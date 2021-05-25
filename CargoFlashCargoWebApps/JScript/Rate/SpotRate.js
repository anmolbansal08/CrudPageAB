/// <reference path="../../Scripts/references.js" />
/*
*****************************************************************************
Javascript Name:	SpotRate    
Purpose:		    This JS used to get Grid Data for Spot Rate and its tab function.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    AKASH
Created On:		     
Updated By:        
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/

var CoutrySNo = 0;

var awb = [{ Key: "1", Text: "Cargo" }, { Key: "2", Text: "Courier" }, { Key: "3", Text: "CBV" }];
var reqtype = [{ Key: "1", Text: "FOC" }, { Key: "2", Text: "ADHOC" }];
var based = [{ Key: "1", Text: "RSP RATE" }, { Key: "2", Text: "PROMO RATE" }, { Key: "3", Text: "TACT RATE" }];
var HdnPageSNo = 0;

var pageType = $('#hdnPageType').val();



function BeforeRowActionClick(td, tr, recId, grid) {
    if ($(tr).find("td[data-column='Text_IsApproved']").text() == "APPROVED" || $(tr).find("td[data-column='Text_IsApproved']").text() == "REJECTED") {
        var a = $(tr).find("td[data-column='Text_IsApproved']").text() == "REJECTED" ? 'Reject' : 'Approve';
        if (a == 'Approve')
            $(".tool-items").find("a:eq(1) i span:eq(0)").text('Reject')
        else
            $(".tool-items").find("a:eq(1)").hide();
        $(".tool-items").find("a:eq(2)").show();
        $(".tool-items").find("a:eq(2)").attr('href', "#");
        $(".tool-items").find("a:eq(2)").unbind('click').bind('click', function (e) {
            InActiveSpotRate(recId);
            //   e.preventDefault();
        });
    }
    else {
        $(".tool-items").find("a:eq(2)").hide();
        $(".tool-items").find("a:eq(1)").show()
        $(".tool-items").find("a:eq(1) i span:eq(0)").text('Approve');
    }
    if (userContext.SpecialRights.SPOTAPPR == false) {
        var txt = $(".tool-items").find("a:eq(1) i span:eq(0)").text().toUpperCase();
        if (txt.search('APPROVE')==0)
            $(".tool-items").find("a:eq(1)").hide();
        $(".tool-items").find("a:eq(2)").hide();
        $(".tool-items").find("a:eq(0) i span:eq(0)").text('View');
    }
}
function fn_OnSpotSuccessGrid(e) {
    $('table tr td[data-column="spotcode"] span').text('');
    var LengthGrid = $('[id*="faction"]').length;

    for (var i = 0; i < LengthGrid ; i++) {
        $('table tr td[data-column="spotcode"] span:eq(' + i + ')').text('');
        $('table tr td[data-column="spotcode"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="View Code" class="btn btn-success" onclick="ViewSpotCode(this.id);" />')
    }

}


var Approve = "";
var Request = "";
var LoginType = "";
$(document).ready(function () {
    // $('input[type=checkbox][name=CampaignType]').removeAttr('checked', true);
    //added by Shatrughana Gupta
    $('input[type = "checkbox"][name="IsFlatRate"]').closest('td').css("text-align", "left")
    $('input[type = "checkbox"][name="IsFlatRate"]').css("height", "18px").css("width", "18px")
    $('input[type = "checkbox"][name="IsFlatRate"]').attr('disabled', true);
    //-----------------------END
    Approve = userContext.SysSetting.ApproveSpotRate.split(',');
    LoginType = userContext.GroupName.toUpperCase();
    //if (a.includes()) 
    $("[type='button'][value='View Rate']").after('&nbsp;&nbsp; <font> <b>ULD Rate <b></font> <input type="checkbox" id="chkUld" onClick="abc();">')
    Request = userContext.SysSetting.RequestSpotRate.split(',');
    // commented by akash for permission based - 19 july 2017
    //if (Request.includes(LoginType)) {
    if (userContext.SpecialRights["SPOTREQ"] == true) {
        $('input[type="button"][value=New Spot Rate]').show();
    } else {
        $('input[type="button"][value=New Spot Rate]').hide();
    }

    $('#NoofTransaction').closest('tr').hide();
    $('#NoofTransaction').removeAttr('data-valid', "required");
    $('#_tempCodeNo').removeAttr('data-valid', "required");
    $('#CodeType').closest('tr').prev('tr').hide();



    cfi.ValidateForm();

    $('#_tempSectorRate ,#SectorRate').attr("readonly", "readonly");
    $('#AWBCode ,#Reference,#ChargeableWeight').attr("readonly", "readonly");
    $('span#_spanDASH_').text('-');
    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
        $('#GrossWeight ,#Volume').after(' Variance %');
        $('#GrossWeight').attr('data-valid', "required");
        $('#PlusVarainceGrossPercentage ,#PlusVarainceVolumePercentage').after('(+)');
        $('#MinusVarainceGrossPercentage ,#MinusVarainceVolumePercentage').after('(-)');
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "READ") {


        $('#GrossWeight ,#VolumeWeight ,#Grvarplus,#Grvarmin,#_tempGrvarmin,#Vlvarplus,#Vlvarmin,#_tempVlvarmin').attr('disabled', true);
        $('#GrossWeight ,#Volume ,#VolumeWeight').after(' Variance %');
        $('#Grvarplus ,#Vlvarplus').after('(+)');
        $('#Grvarmin ,#Vlvarmin').after('(-)');
        mkunreqread();
        if ($('#Text_IsApproved').text() == "Approved") {
            codegenerated();
        }
        $('input[type=button][value="Duplicate"]').hide()
        $('input[type=button][value="Delete"]').hide()
        $('input[type=button][value="Edit"]').hide()


        var value = $('#RateAdhocType').val();
        if (value == "Campaign") {

            $('#CodeType').closest('tr').prev('tr').show();

            //$('#tbl').append('<tr style="display: table-row;"><td class="formSection" colspan="4">Spot Code Generation</td></tr>' +
            //    '<tr style="display: table-row;"><td class="formlabel" title="Select Code Type">Code Type</td><td class="formInputcolumn"> <input type="radio" tabindex="36" data-radioval="Single" class="" name="CodeType" checked="True" id="CodeType" value="1" oldvalue="Single" newvalue="">Single <input type="radio" tabindex="36" data-radioval="Multiple" class="" name="CodeType" id="CodeType" value="2" oldvalue="Single" newvalue="">Multiple</td><td class="formlabel" title="Enter No of Codes."><span style="color:red">*</span>No Of Code Use By Agent</td><td class="formInputcolumn"><input id="_tempCodeNo" name="_tempCodeNo" tabindex="37" autocomplete="off" class="k-formatted-value k-input" type="text" readonly="readonly" style="width: 120px; text-align: right; display: inline-block;"><input type="text" class="k-input k-state-default" name="CodeNo" id="CodeNo" style="width: 120px; text-align: right; display: none;" controltype="number" tabindex="37" maxlength="14" value="1" data-role="numerictextbox" oldvalue="1" newvalue=""><input type="button" tabindex="19" class="btn btn-success" name="" id="" style="width:140px;" onclick="ViewGeneratedCode()" value="View Geneared Code" oldvalue="View Geneared Code" newvalue=""></td></tr>' +
            //    '<tr style="display: table-row;"><td class="formlabel" title="Enter "><span id="spn"> </span></td><td class="formlabel">&nbsp;</td><td class="formlabel" title="Enter No of Transaction"><font color="red">*</font><span id="spnNoofTransaction"> No of Transaction</span></td><td class="formInputcolumn"><input id="_tempNoofTransaction" name="_tempNoofTransaction" tabindex="34" autocomplete="off" class="k-formatted-value k-input" type="text" readonly="readonly" style="width: 120px; text-align: right;"><input type="text" class="k-input k-state-default" name="NoofTransaction" id="NoofTransaction" style="width: 120px; text-align: right; display: none;" controltype="number" data-valid-msg="No of Transaction can not be blank" tabindex="34" maxlength="14" value="2" data-role="numerictextbox" oldvalue="2" newvalue=""></td></tr>')

            //$('#_tempCodeNo').closest('tr').show()
            //$('#_tempCodeNo').show();

            //$('#_tempCodeNo').val($('#HdnNoofCodes').val());
            //$('#CodeNo').val($('#HdnNoofCodes').val());
        }
        else {
            //$('td[title="Enter No of Codes."]').html("<span style='color:red'>*</span>No Of Code Use By Agent");

        }      

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        $('#GrossWeight ,#VolumeWeight ,#Grvarplus,#Grvarmin,#_tempGrvarmin,#Vlvarplus,#Vlvarmin,#_tempVlvarmin').attr('disabled', true);
        $('#VolumeWeight').after(' Variance %');
        $('#Grvarplus ,#Vlvarplus').after('(+)');
        $('#Grvarmin ,#Vlvarmin').after('(-)');


        if ($('span#Text_IsApproved').text() == "Approved") {
            $('input[type=submit][name="operation"][value="Delete"]').hide();

            ShowMessage('warning', 'warning - Spot Rate', "Spot Rate already Deleted, Cannot be Approved !");
        }

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('td[title="Select  All In Rate "]').text('');
        $("#AllInRate").hide();
        $('td[title="Select Gross Weight"]').html("<span style='color:red'>*</span>  Gross Weight");


        randomString(5, 5);
        $('#Reference').val(randomString);
        $("#ValidFrom").data("kendoDatePicker").value("");
        $("#ValidTill").data("kendoDatePicker").value("");
        $('#IsCommissionable').closest('tr').next('tr').hide();
        $('#OfficeSNo').val(userContext.OfficeSNo)
        $('#Text_OfficeSNo').val(userContext.OfficeName);
        $('#AccountSNo').val(userContext.AgentSNo)
        $('#Text_AccountSNo').val(userContext.AgentName);
        $('#AirlineSNo').val(userContext.AirlineSNo)
        $('#Text_AirlineSNo').val(userContext.AirlineName);
        $('#AWBCode').val(userContext.AirlineName.split('-')[0]);
        $('#OriginCitySNo').val(userContext.CitySNo + '-' + userContext.AirportSNo + '-' + userContext.AirportCode +'-'+ userContext.CountrySNo)
        $('#Text_OriginCitySNo').val(userContext.CityCode + '-' + userContext.CityName);




        $('#CurrencySNo').val(userContext.CurrencySNo)
        $('#Text_CurrencySNo').val(userContext.CurrencyCode + '-' + userContext.CurrencyName);

        //    --------------------------
        $('input[type=checkbox][name=CampaignType]').removeAttr('checked', true);
        $('input[type=checkbox][name="CampaignType"]').hide();
        $('input[type=checkbox][name=CampaignType]').parent().contents()[8].data = "";
        $('input[type=checkbox][name=CampaignType]').parent().contents()[10].data = "";
        //if (Request.includes(LoginType)) {
        if (userContext.SpecialRights["SPOTREQ"] == true) {
            //$('#Text_OfficeSNo').data('kendoAutoComplete').enable(false);
            //$('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
        }
        $('input[type=radio][data-radioval=ServiceCargo]').parent().contents()[4].data = "Service Cargo";
        //$('#IsCommissionable').closest('tr').next('tr').hide();

        var todaydate = new Date();
        var validTodate = $("#ValidTill").data("kendoDatePicker");
        validTodate.min(todaydate);
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "G9") {       // Code added by TFS:15607 only on G9 
            $("#ValidFrom").data("kendoDatePicker").value("");
        }
        else {
            var validfromdate = $("#ValidFrom").data("kendoDatePicker");
            validfromdate.min(todaydate);
        }

        $('td[title="Select Agent"]').text('')
        $('td[title="Select Agent"]').append('<input type="radio" name="AgentGroup" id="IsSingle" checked="checked" value="0">Single<input type="radio" name="AgentGroup" id="IsGroup" value="1">Group <span style="margin-left: 45px;color:red">*</span>Agent');
        //$('#Text_AccountSNo').closest('td').append('<input type="hidden" name="AccountGroupSNo" id="AccountGroupSNo" value="0" /><input type="text" id="Text_AccountGroupSNo" name="Text_AccountGroupSNo" tabindex="0" controltype="autocomplete" data-role="autocomplete" autocomplete="off" class="k-input" oldvalue="" style="width: 100%; text-transform: uppercase;" />');

        $('#DiscountedServiceCargo').remove()
        $('#RequestedRate').after('<div id="DiscountedServiceCargo" style="margin-left: 127px;margin-top: -21px;"><span>Discount %</span><input type="text" class="k-formatted-value k-input" id="txtServiceDiscount" style="width:50px" /><span>Surcharge %</span><input type="text" class="k-formatted-value k-input" id="txtSurchargeDiscount" style="width:50px" /></div>');

        //added by Shatrughan Gupta
        $('#divFlatRate').remove()
        $('#SectorRate').after('<div id="divFlatRate" style="margin-left: 127px;margin-top: -21px;"><input type="checkbox" class="k-formatted-value k-input" id="chkFlatRate" style="width:50px" onclick="isFlatRate();" /><span>Flat Rate</span></div>');
        
        LoadDiscountedChekbox();
        if (userContext.SysSetting["ICMSEnvironment"].toUpperCase() == "GA") {
            $('#spnPieces').closest('td').find('font').hide();        
            $("#Pieces,#_tempPieces").removeAttr('data-valid')
        }
        else {
            $('#spnPieces').closest('td').find('font').show();
            $("#Pieces,#_tempPieces").attr('data-valid', 'required');
        }
      
       

    }



    //if (userContext.GroupName != 'ADMIN' && userContext.GroupName != 'AIRLINE')
    //if (!Approve.includes(LoginType)) {
    if (userContext.SpecialRights["SPOTAPPR"] == false) {

        $('input[type=radio][name=RateAdhocType][value=2]').attr('disabled', true);
        //$('input[type=radio][name=RateAdhocType][value=1]').attr('disabled', true);
        $('input[type=radio][data-radioval=Single]').removeAttr('checked', true);

        //$('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var nan = $('#txtServiceDiscount').val() == 'NaN' ? "0" : $('#txtServiceDiscount').val()
        $('#txtServiceDiscount').val(nan) 
        $("#chkUld").attr('disabled', true);

        $('input[type=checkbox][name=CampaignType]').removeAttr('checked', true);
        $('input[type=checkbox][name="CampaignType"]').hide();
        $('input[type=checkbox][name=CampaignType]').parent().contents()[8].data = "";
        $('input[type=checkbox][name=CampaignType]').parent().contents()[10].data = "";

        $('#AWBNo').attr('disabled', true);

        $('#GetAWBbtn').attr('disabled', true);

        //if (!Approve.includes(LoginType)) {
        if (userContext.SpecialRights["SPOTAPPR"] == false) {
            //if (user == 1) {
            $('#ApprovedRate').attr('disabled', true);
            $('input[type=radio][name=IsApproved]').attr('disabled', true);
            $('input[type=radio][name=RateAdhocType][value=2]').attr('disabled', true);
            $('input[type="button"][value=View Rate]').attr('disabled', true);
        }
        $('#ValidFrom').data('kendoDatePicker').enable(false);
        $('#ValidTill').data('kendoDatePicker').enable(false);
        $('input[type=radio][data-radioval=ServiceCargo]').parent().contents()[4].data = "Service Cargo";
        $('td[title="Select  All In Rate "]').text('');
        $("#AllInRate").hide();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $('#IsCommissionable').closest('tr').next('tr').hide();

    }


    BindAutoComplete();
    CreateRemarks();
    CreateFlightInfoGrid();
    CreateULDSlabGrid();
   // $("#divULDRate").hide()
   // $("#divULDRate").hide();
    //  allowdecimal();

    $("input[type='text'][name='_tempCodeNo']").hide();
    $("input[type='text'][name='CodeNo']").closest('td').prev().find('span').hide();
    $('#_tempCodeNo ').closest('tr').hide();
    if ($("input[type='radio'][name='IsApproved']:checked").val() == 1) {
        codegenerated();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#divULDRate").hide()
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#chkUld").attr('disabled', true);
        var value = $('#RateAdhocType').val();
        if (value == "Campaign") {
            $('#_tempCodeNo ').closest('tr').show();
            $("input[type='text'][name='_tempCodeNo']").show();
            $("input[type='text'][name='CodeNo']").closest('td').prev().find('span').show();
            $('#_tempCodeNo ').closest('tr').next('tr').show()
            $('#CodeNo').after('<input type="button" tabindex="19" class="btn btn-success" name="" id="" style="width:140px;" onclick="ViewGeneratedCode()" value="View Generated Code">')
            if ($('#HdnCodeType').val() == "1") {
                $('input[type=radio][data-radioval=Single]').attr('checked', true);
                $('td[title="Enter No of Codes."]').html("<span style='color:red'>*</span>Number of Agent(s)");
            }
            else if ($('#HdnCodeType').val() == "2") {
                $('input[type=radio][data-radioval=Multiple]').attr('checked', true);
                $('#_tempCodeNo ').closest('tr').next('tr').hide()
            }

        }
        $('td[title = " All In Rate "]').text('');
        $('#Text_AllinRate').hide();


    }
    var value = $('#RateAdhocType:checked').val();
    if (value == 2) {
        Unrequired();
        $('#CodeType').closest('tr').prev('tr').show();
        $('#CodeType').closest('tr').next('tr').show();
        $('#CodeType').closest('tr').show();
        $('#spnCodeNo').show();
        $('#_tempCodeNo').show();
        $('#ApprovedRate').parent().append('<div id="ratePercentage" style="float:right;margin-right: 335px;">%</div>');
        $('td[title="Enter Approved Rate"]').html("<span style='color:red'>*</span>Approved");
    }
    else {
        makerequired();
        $('input[type=radio][name=CodeType]').removeAttr('checked', true);

        if (getQueryStringValue("FormAction").toUpperCase() == "READ") {

            var value = $('#RateAdhocType').val();
            if (value == "Campaign") {
                HdnPageSNo = $('#HdnPageSNo').val();
                if ($('#HdnCodeType').val() == "1") {
                    $('input[type=radio][data-radioval=Single]').attr('checked', true);
                    $('input[type=radio][data-radioval=Multiple]').attr('disabled', 'disabled');
                }
                else if ($('#HdnCodeType').val() == "2") {
                    $('input[type=radio][data-radioval=Multiple]').attr('checked', true);
                    $('input[type=radio][data-radioval=Single]').attr('disabled', 'disabled');
                }


                $('td[title="Rate"]').html('Campaign');

                $('#SectorRate').parent().append('<div id="ratePercentage" style="float:right;margin-right: 300px;">%</div>');

                $('#RequestedRate').closest('td').prev('td').wrapInner('<div></div>').find('*').hide();
                $('#RequestedRate').closest('td').find('*').hide();

                $('#Text_CurrencySNo').closest('tr').next('tr').hide();
                $('#SectorRate').closest('tr').next('tr').hide();
                $('#ApprovedRate').parent().append('<div id="ratePercentage" style="float:right;margin-right: 335px;">%</div>');
                $('td[title="Approved Rate"]').html("<span style='color:red'>*</span>Approved");



            }

        }
    }

    //if (userContext.GroupName != 'ADMIN')
    //if (!Approve.includes(LoginType)) {
    if (userContext.SpecialRights["SPOTAPPR"] == false) {
        $('#AWBCode').attr('disabled', true);
        $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);

        $('#Text_OriginCitySNo').data("kendoAutoComplete").enable(false);

        $('#Text_CurrencySNo').data("kendoAutoComplete").enable(false);

        //$('#Text_OfficeSNo').data('kendoAutoComplete').enable(false);
        //$('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
    }
    if (userContext.GroupName == 'AGENT') {
        $('#Text_OfficeSNo').data('kendoAutoComplete').enable(false);
        $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#chkUld").attr('disabled', true);
        //if (userContext.GroupName != 'AGENT' && userContext.GroupName != 'GSA')
        //if (Approve.includes(LoginType)) {
        if (userContext.SpecialRights["SPOTAPPR"] == true) {
            if ($('input[type=radio][name="IsApproved"]:checked').val() == "1") {
                $('input[type=radio][data-radioval=Rejected]').attr('checked', true);
                $('input[type=radio][data-radioval=Approved]').attr('disabled', true);
                //  $('input[type=submit][name="operation"][value="Update"]').hide();
                // ShowMessage('warning', 'warning - Spot Rate', "Spot Rate already Approved, cannot be added !");
            }
            else
                if ($('input[type=radio][name="IsApproved"]:checked').val() == "2") {
                    $('input[type=submit][name="operation"][value="Update"]').hide();
                    ShowMessage('warning', 'warning - Spot Rate', "Spot Rate already Rejected, Cannot be Approved  !");
                }
                else {
                    $('input[type=radio][data-radioval=Approved]').attr('checked', true);
                }


            //if ($('#AWBNo').val() != "")
            //{
            $('input[type=button][value="View Rate"]').hide()
            //}
            //$('input[type=radio][data-radioval=Requested]').removeAttr('checked', true);

            //$('input[type=radio][data-radioval=Approved]').attr('checked', true);



            $('#AWBCode').attr('disabled', true);
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
            $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
            $('#Text_OriginCitySNo').data("kendoAutoComplete").enable(false);
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AWBTypeSNo').data("kendoAutoComplete").enable(false);
            $('#Text_DestinationCitySNo').data("kendoAutoComplete").enable(false);
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
            $('#_tempPieces').attr('disabled', true);
            if (userContext.SysSetting["ICMSEnvironment"].toUpperCase() == "GA")
            {
                $('#spnPieces').closest('td').find('font').hide();
                $("#Pieces,#_tempPieces").removeAttr('data-valid')
            }
            else {
                $('#spnPieces').closest('td').find('font').show();
                $("#Pieces,#_tempPieces").attr('data-valid', 'required');
            }
            $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
            $('#Text_SHCSNo').data("kendoAutoComplete").enable(false);
            $("input[name=WeightType]").attr('disabled', true);
            $('#GrossWeight').attr('disabled', true);
            $('#Volume').attr('disabled', true);

            $('#PlusVarainceGrossPercentage').attr('disabled', true);
            $('#_tempMinusVarainceGrossPercentage').attr('disabled', true);
            $('#PlusVarainceVolumePercentage').attr('disabled', true);
            $('#_tempMinusVarainceVolumePercentage').attr('disabled', true);
            $('#tblFlightInfo_btnAppendRow').hide();
            $('#tblULDRate_btnAppendRow').hide();
            $('input[type="radio"][data-radioval=Requested').attr('disabled', true);
            $('#_tempSectorRate').attr('disabled', true);
            $('#_tempRequestedRate').attr('disabled', true);
            $('#Text_CurrencySNo').data("kendoAutoComplete").enable(false);
            $('#Text_BasedOnSNo').data("kendoAutoComplete").enable(false);
            $('#ChargeableWeight').attr('disabled', true);
            $("input[name=RateAdhocType]").attr('disabled', true);
            $('input[type="checkbox"][name=CampaignType]').attr('disabled', true)
            $('#IsCommissionable').attr('disabled', true);
            $('#AllInRate').attr('disabled', true);

            if ($('input[type="radio"][name=IsApproved]:checked').val() == "1") {
                if ($("#ApprovedRate").val() <= 0.000 || $("#ApprovedRate").val() <= 0) {
                    $("#ApprovedRate").val('');
                    $('#_tempApprovedRate').val('')
                    $('#_tempApprovedRate').focus();
                    $("#ApprovedRate").focus();
                    //$("#ApprovedRate").attr('Required', true);
                }
                else {

                }
            }
            else if ($('input[type="radio"][name=IsApproved]:checked').val() == "2") {
                $("#ApprovedRate").removeAttr('data-valid', "required");
            }

            $('#divMultiSHCSNo .k-icon').remove();


            var value = $('#RateAdhocType:checked').val();
            if (value == 2) {

                $('#CodeNo').after('<input type="button" tabindex="19" class="btn btn-success" name="" id="" style="width:140px;" onclick="ViewGeneratedCode()" value="View Generated Code">')

                $('#spnSectorRate').text('Campaign');
                $('#SectorRate').parent().append('<div id="ratePercentage" style="float:right;margin-right: 300px;">%</div>');

                $('#RequestedRate').closest('td').prev('td').wrapInner('<div></div>').find('*').hide();
                $('#RequestedRate').closest('td').find('*').hide();

                $('#Text_CurrencySNo').closest('tr').next('tr').hide();
                $('#SectorRate').closest('tr').next('tr').hide();


                $("input[type='button'][value='View Rate']").hide();
                $("input[type='button'][value='View Rate']").closest('td').prev().find('span').hide();
                //$('#CodeType').closest('tr').show();

                $('#_tempCodeNo').show();

                var value = $('#CodeType:checked').val();
                if (value == 2) {
                    $('#CodeType').closest('tr').next('tr').hide();
                    $('#_tempCodeNo').val($('#HdnNoofCodes').val());
                    $('#CodeNo').val($('#HdnNoofCodes').val());

                    $('input[type=radio][data-radioval=Single]').attr('disabled', 'disabled');
                }
                else if (value == 1) {
                    $('td[title="Enter No of Codes."]').html("<span style='color:red'>*</span>Number of Agent(s)");
                    $('input[type=radio][data-radioval=Multiple]').attr('disabled', 'disabled');
                }


                HdnPageSNo = $('#HdnPageSNo').val();


                $('input[type=checkbox][name="CampaignType"]').show();
                $('input[type=checkbox][name=CampaignType]').parent().contents()[8].data = "International";
                $('input[type=checkbox][name=CampaignType]').parent().contents()[10].data = "Domestic";
                $('input[type=checkbox][name=CampaignType][value=1]').removeAttr('checked', true);
                $('input[type=checkbox][name=CampaignType][value=2]').removeAttr('checked', true);


                if ($('#HdnCampaignType').val() == "1") {
                    $('input[type=checkbox][name=CampaignType][value=1]').attr('checked', true);
                    $('input[type=checkbox][name=CampaignType][value=2]').removeAttr('checked', true);
                }
                else if ($('#HdnCampaignType').val() == "2") {
                    $('input[type=checkbox][name=CampaignType][value=1]').removeAttr('checked', true);
                    $('input[type=checkbox][name=CampaignType][value=2]').attr('checked', true);

                }
                else if ($('#HdnCampaignType').val() == "3") {
                    $('input[type=checkbox][name=CampaignType][value=1]').attr('checked', true);
                    $('input[type=checkbox][name=CampaignType][value=2]').attr('checked', true);
                }




            }

            $('#DiscountedServiceCargo').remove();
            $('#RequestedRate').after('<div id="DiscountedServiceCargo" style="margin-left: 127px;margin-top: -21px;"><span>Discount %</span><input type="text" class="k-formatted-value k-input" id="txtServiceDiscount" style="width:50px" /><span>Surcharge %</span><input type="text" class="k-formatted-value k-input" id="txtSurchargeDiscount" style="width:50px" /></div>');

            var CalculateDiscountedRate = "";
            if (parseFloat($("#RequestedRate").val()) > parseFloat($("#SectorRate").val())) {

                $('#txtServiceDiscount').attr('disabled', true);
                $('#txtSurchargeDiscount').attr('disabled', true);
                $('#txtServiceDiscount').val('');
                CalculateDiscountedRate = ($("#RequestedRate").val() / $("#SectorRate").val() * 100) - 100;
                $("#txtSurchargeDiscount").val(parseFloat(CalculateDiscountedRate).toFixed(2));
            }
            else if (parseFloat($("#RequestedRate").val()) <= parseFloat($("#SectorRate").val())) {
                $('#txtSurchargeDiscount').attr('disabled', true);
                $('#txtSurchargeDiscount').val('');
                $('#txtServiceDiscount').attr('disabled', true);
                CalculateDiscountedRate = 100 - $("#RequestedRate").val() / $("#SectorRate").val() * 100;
                $("#txtServiceDiscount").val(parseFloat(CalculateDiscountedRate).toFixed(2));

            }
            $('#ApprovedDiscountedServiceCargo').remove();

            $('#ApprovedRate').after('<div id="ApprovedDiscountedServiceCargo" style="margin-left: 127px;margin-top: -21px;"><span>Discount %</span><input type="text" class="k-formatted-value k-input" id="txtApprovedServiceDiscount" style="width:50px" /><span>Surcharge %</span><input type="text" class="k-formatted-value k-input" id="txtApprovedSurchargeDiscount" style="width:50px" /></div>');

            LoadApprovedDiscountedChekbox();

            var valuecamp = $('#RateAdhocType:checked').val();
            if (valuecamp == 2) {
                $('#DiscountedServiceCargo').remove();
                $('#ApprovedDiscountedServiceCargo').remove();
            }
        }
        else {
            if ($('input[type=radio][name="IsApproved"]:checked').val() == "1") {
                $('input[type="button"][value=View Rate]').attr('disabled', true);
                $('input[type="button"][value=Back]').removeAttr('disabled', true);
                $('#tblFlightInfo_btnAppendRow').hide();
                $('#tblULDRate_btnAppendRow').hide();

                $('input[type=submit][name="operation"][value="Update"]').hide();
                $('#Text_AWBTypeSNo').data("kendoAutoComplete").enable(false);
                $('#Text_DestinationCitySNo').data("kendoAutoComplete").enable(false);
                $('#_tempPieces').attr('disabled', true);
                $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
                $('#Text_SHCSNo').data("kendoAutoComplete").enable(false);

                $('#AWBCode').attr('disabled', true);
                $('#Reference').attr('disabled', true);

                $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);


                $("input[name=WeightType]").attr('disabled', true);
                $('#GrossWeight').attr('disabled', true);
                $('#Volume').attr('disabled', true);
                $('#_tempSectorRate').attr('disabled', true);
                $('#_tempRequestedRate').attr('disabled', true);
                $('#Text_CurrencySNo').data("kendoAutoComplete").enable(false);
                $('#Text_BasedOnSNo').data("kendoAutoComplete").enable(false);
                $('#ChargeableWeight').attr('disabled', true);
                $("input[name=RateAdhocType]").attr('disabled', true);
                $('#IsCommissionable').attr('disabled', true);
                $('#AllInRate').attr('disabled', true);
                $('#divMultiSHCSNo .k-icon').remove();
                $('#PlusVarainceGrossPercentage').attr('disabled', true);
                $('#_tempMinusVarainceGrossPercentage').attr('disabled', true);
                $('#PlusVarainceVolumePercentage').attr('disabled', true);
                $('#_tempMinusVarainceVolumePercentage').attr('disabled', true);


                var len = $('#tblULDRate_rowOrder').val();

                if (len != "" && len != undefined) {
                    for (var i = 1; i <= len.split(',').length; i++) {

                        $('#tblULDRate_ULDSNo_' + (i)).data("kendoAutoComplete").enable(false);

                        $('#tblULDRate_RateClassSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#_temptblULDRate_Rate_' + (i)).attr("disabled", true);
                        $('#tblULDRate_Delete_' + i).css('visibility', 'hidden');

                    }
                }



                var lenFlightInfo = $('#tblFlightInfo_rowOrder').val();
                if (lenFlightInfo != "" && lenFlightInfo != undefined) {
                    for (var i = 1; i <= lenFlightInfo.split(',').length; i++) {

                        $('#tblFlightInfo_FlightOriginSNo_' + (i)).data("kendoAutoComplete").enable(false);

                        $('#tblFlightInfo_FlightDestinationSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#tblFlightInfo_FlightNumSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#tblFlightInfo_FlightDate_' + i).data('kendoDatePicker').enable(false);

                    }
                }


                ShowMessage('warning', 'warning - Spot Rate', "Spot Rate already Approved, cannot be added !");
            }

        }


        if ($('#Text_AccountSNo').val() != "") {
            $('#IsSingle').attr('checked', true);
            $('#IsGroup').removeAttr('checked', true);

        }
        else if ($('#Text_AccountGroupSNo').val() != "") {
            $('#IsSingle').removeAttr('checked', true);
            $('#IsGroup').attr('checked', true);
        }
        else {
            $('#IsSingle').attr('checked', true);
            $('#IsGroup').removeAttr('checked', true);

        }
        $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(false);


        $("[name*=AgentGroup]").attr('disabled', true);

        var value = $('#RateAdhocType:checked').val();
        if (value == "1") {
            if (parseFloat($("#txtServiceDiscount").val()) == 100) {
                $("#RequestedRate").closest('td').append('<div id="lbldivWaveOfDC" style="margin-left: 127px;">Waive Off Due Carrier Charges<input type="checkbox" class="k-formatted-value k-input"  id="lblchkDueCarrierCV"  disabled="disabled" style="width:50px" /></div>')
                var flag = $("#IsWeiveDueCarrierCharges").val() == "True" ? true : false;
                $("#lblchkDueCarrierCV").attr('checked', flag);
            }
            else {
                $("#divWaveOfDC").remove();
            }
        }

    }


    //$('input[type=radio][data-radioval=ServiceCargo]').parent().contents()[4].data = "Service Cargo";
    //$('#IsCommissionable').closest('tr').next('tr').hide();
    //var todaydate = new Date();
    //var validTodate = $("#ValidTill").data("kendoDatePicker");
    //validTodate.min(todaydate);
    //var validfromdate = $("#ValidFrom").data("kendoDatePicker");
    //validfromdate.min(todaydate);

    $("[name*=AgentGroup]").click(function () {
        var value = $('input[type="radio"][name="AgentGroup"]:checked').val();

        if (value == 0) {

            cfi.ResetAutoComplete("AccountGroupSNo");
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IsGroup"]').removeAttr('checked', true)

        }
        else {
            cfi.ResetAutoComplete("AccountSNo");
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(true);
        }

    });



    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        var value = $('input[type="radio"][name="AgentGroup"]:checked').val();

        if (value == 0) {

            cfi.ResetAutoComplete("AccountGroupSNo");
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(false);

        }
        else {
            cfi.ResetAutoComplete("AccountSNo");
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(true);
        }
        $('#Text_OriginCitySNo').data("kendoAutoComplete").enable(false);

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("[name*=AgentGroup]").attr('disabled', true);

        if ($('#AccountSNo').val() != "" && $('#AccountSNo').val() != undefined) {
            $('#IsSingle').attr('checked', true);
            $('#IsGroup').removeAttr('checked', true);

        }
        else if ($('#AccountGroupSNo').val() != "" && $('#AccountGroupSNo').val() != undefined) {
            $('#IsSingle').removeAttr('checked', true);
            $('#IsGroup').attr('checked', true);
        }
        else {
            $('#IsSingle').attr('checked', true);
            $('#IsGroup').removeAttr('checked', true);

        }
    }

    //----------------volume Weight info------------
    if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {

        $("#VolWT").remove();
        if ($('#Volume').val() != "") {
            if ((parseFloat($('#Volume').val()) <= 0.000) || (parseFloat($('#Volume').val()) <= 0)) {
            }
            else {
                $("#MinusVarainceVolumePercentage").closest('td').append('<b><span id= "VolWT"><font color="Black">Volume Weight: </font><span></b>')
                var volWT = GetroundValue(parseFloat($("#Volume").val()) * 166.66, 1)
                $("#VolWT").text($("#VolWT").text() + volWT)

            }
        }

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {

        $("#VolWT").remove();
        if ($('#VolumeWeight').val() != "") {
            if ((parseFloat($('#VolumeWeight').val()) <= 0.000) || (parseFloat($('#VolumeWeight').val()) <= 0)) {
            }
            else {
                $("#Vlvarmin").closest('td').append('<b><span id= "VolWT"><font color="Black">Volume Weight: </font><span></b>')
                var volWT = GetroundValue(parseFloat($("#VolumeWeight").val()) * 166.66, 1)
                $("#VolWT").text($("#VolWT").text() + volWT)

            }
        }

    }
    
});








var ViewCode = "<div id='windowViewGeneratedCode'></div>";

function ViewSpotCode(id) {

    $('#popupViewCodetbl').remove();
    //if (cfi.IsValidSubmitSection()) {
    $('#tbl').append(ViewCode);
    $('#window th').addClass('ui-widget-header');
    $('#window td').addClass('ui-widget-content');
    $('#window td').css("text-align", "center");
    var Modeldata = {
        SNo: id
    }

    $.ajax({
        url: "Services/Rate/SpotRateService.svc/ViewGeneratedCode",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ spotRate: Modeldata }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result != undefined) {
                var Code = jQuery.parseJSON(result);
                var Heading = Code.Table0[0].Heading == "" ? "Generated Code" : Code.Table0[0].Heading;
                var str = "<table id='popupViewCodetbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>" + Heading + "</th></tr></thead>";

                if (Code.Table0.length > 0) {
                    for (var i = 0; i < Code.Table0.length; i++) {
                        str += " <tbody><tr>";
                        var GeneratedCode = Code.Table0[i].GeneratedCode == "" ? "No Code Found !" : Code.Table0[i].GeneratedCode
                        str += "<td>" + GeneratedCode + "</td>";
                        str += "</tr></tbody>";
                    }
                }
                else {
                    str += " <tbody><tr><td><center>No Code Found !</center></td></tr></tbody>";
                }
                str += "</table>";
                $('#windowViewGeneratedCode').append(str);

                cfi.PopUp("windowViewGeneratedCode", "View Generated Code");
                $('div.k-window').css('width', '350px');
                //$('div.k-window').css('margin-left', '80.611px ! important');
            }
        }
    });
    //}

}

function GetProduct() {

    if ($('#Text_AWBTypeSNo').val().toUpperCase() == 'COURIER') {
        BindProductOnAWBType('COURIER')
        $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
        ClearRates();
    }
    if ($('#Text_AWBTypeSNo').val().toUpperCase() == 'CARGO') {
        BindProductOnAWBType('GCR')
        $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
        ClearRates();
    }

}

function BindProductOnAWBType(AWBTypeName) {

    if ($('#Text_AWBTypeSNo').val() != '') {
        $.ajax({
            url: "Services/Rate/SpotRateService.svc/BindProductOnAWBType", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBTypeName: AWBTypeName }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (JSON.parse(result).Table0.length > 0 && JSON.parse(result) != undefined) {
                    $('#Text_ProductSNo').val(JSON.parse(result).Table0[0].ProductName);
                    $('#ProductSNo').val(JSON.parse(result).Table0[0].SNo);
                }
            }
        });
    }
}





/*--------------------------To Bind AWB Code on Select Airline ---------------------------------------------- */
function GetAWB() {
    var acode = $('#Text_AirlineSNo').val();
    var asplit = acode.split('-')[0];
    $('#AWBCode').val(asplit);
    //cfi.ResetAutoComplete("")
    $("[id^='tblFlightInfo_HdnFlightNumSNo_']").val('');
    $("[id^='tblFlightInfo_FlightNumSNo_']").val('');

}
/*--------------------------To Bind AWB Code on Select Airline ---------------------------------------------- */


/*--------------------------To Bind AutoComplete on load ---------------------------------------------- */
function BindAutoComplete() {




    /*--------------------------To Bind AutoComplete on load ----- Autocomplete v2---------------------------------------- */

    cfi.AutoCompleteV2("AirlineSNo", "AirlineCode,AirlineName", "SpotRate_AirlineCode", GetAWB, "contains");
    cfi.AutoCompleteV2("OriginCitySNo", "CityCode,CityName", "SpotRate_CityCode", clearvalues, "contains");
    cfi.AutoCompleteV2("DestinationCitySNo", "CityCode,CityName", "SpotRate_DestinationCode", ClearRates, "contains");
    cfi.AutoCompleteV2("AccountSNo", "Name", "SpotRate_Account", checkAgent, "contains");
    cfi.AutoCompleteV2("ProductSNo", "ProductName", "SpotRate_Product", ClearRates, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "Name", "SpotRate_Office", clear, "contains");
    cfi.AutoCompleteV2("CommoditySNo", "CommodityCode,CommodityDescription", "SpotRate_CommodityCode", ClearRates, "contains");
    cfi.AutoCompleteV2("SHCSNo", "Code,Description", "SpotRate_SPHCCode", ClearRates, "contains", ",");
    cfi.AutoCompleteV2("FlightOriginSNo", "AirportCode,AirportName", "SpotRate_AirportCode", ClearRates, "contains");
    cfi.AutoCompleteV2("FlightDestinationSNo", "AirportCode,AirportName", "SpotRate_FlightDestination", null, "contains");
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "SpotRate_Currency", null, "contains");



    cfi.AutoCompleteV2("BasedOnSNo", "RateTypeName,RateTypeName", "SpotRate_GetBasedOn", null, "contains");

    cfi.AutoCompleteByDataSource("AWBTypeSNo", awb, GetProduct);
    cfi.AutoCompleteByDataSource("ReqTypeSNo", reqtype, null);
    //For Itinerary information 
    //cfi.AutoCompleteByDataSource("BasedOnSNo", based, null);


    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    cfi.AutoCompleteV2("AccountGroupSNo", "AgentGroupName", "Rate_rate_AgentGroupName", null, "contains");

}

function checkAgent() {
    //if ($('#Text_AccountSNo_list').val() == "") {
    //    alert('1');
    //}

    if ($('input[name=RateAdhocType][value=2]:checked').val() == 2) {
        if ($('#Text_AccountSNo').val() != "") {
            var value = $('#CodeType:checked').val();
            if (value == 1) {
                $("#_tempCodeNo").val('1');
                $("#_tempCodeNo").attr('disabled', true);
            }
            else {
                $("#_tempCodeNo").attr('disabled', false);
            }
        }
        else {
            $("#_tempCodeNo").attr('disabled', false);
        }
    }
}

/*--------------------------To Bind AutoComplete on load ---------------------------------------------- */
$('#Text_OriginCitySNo').select(function () {
    //var uniqueindex;
    //var prevrowuniqueindex;
    //uniqueindex = $('#tblFlightInfo').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
    //prevrowuniqueindex = $('#tblFlightInfo').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
    //$('#tblFlightInfo_HdnFlightOriginSNo_' + uniqueindex).val($("#OriginCitySNo").val().split('-')[1]);
    ////  $('#tblFlightInfo_HdnFlightOriginSNo_' + uniqueindex).attr('keyColumn')
    //$('#tblFlightInfo_FlightOriginSNo_' + uniqueindex).val($("#OriginCitySNo").val().split('-')[2]);
    //  $('#Text_CurrencySNo').val(filterAirlineSNo);
});
/*--------------------------To Bind ExtraConditions on load ---------------------------------------------- */
function ExtraCondition(textId) {



    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }

    else if (textId.indexOf("Text_OriginCitySNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNo", "neq", $("#DestinationCitySNo").val());
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "CitySNo", "eq", userContext.CitySNo);
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }


    else if (textId.indexOf("Text_DestinationCitySNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNo", "neq", $("#OriginCitySNo").val().split('-')[0]);

        if (($('input[name = CampaignType][value = 1]:checked').val() == 1) && ($('input[name = CampaignType][value = 2]:checked').val() == 2)) {

        }
        else if ($('input[name = CampaignType][value = 2]:checked').val() == 2) {
            cfi.setFilter(filter1, "CountrySNo", "eq", CoutrySNo);
        }
        else if ($('input[name = CampaignType][value = 1]:checked').val() == 1) {
            cfi.setFilter(filter1, "CountrySNo", "neq", CoutrySNo);
        }


        cfi.setFilter(filter1, "IsActive", "eq", "1");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);

        return filterAirlineSNo;
    }

    else if (textId.indexOf("Text_OfficeSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "CitySNo", "eq", $("#OriginCitySNo").val().split('-')[0]);
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }

    else if (textId.indexOf("Text_AccountSNo") >= 0) {

        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "OfficeSNo", "eq", $("#OfficeSNo").val());
        //cfi.setFilter(filter1, "AccountTypeSNo", "eq", 2);
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }



    else if (textId.indexOf("Text_AccountGroupSNo") >= 0) {

        if ($("#OriginCitySNo").val().split('-')[0] != "") {
            var filter1 = cfi.getFilter("OR");
            cfi.setFilter(filter1, "CitySNo", "eq", $("#OriginCitySNo").val().split('-')[0]);
            cfi.setFilter(filter1, "GroupLevel", "eq", "2");
            cfi.setFilter(filter1, "CountrySNo", "eq", $("#OriginCitySNo").val().split('-')[3]);
            //cfi.setFilter(filter1, "AccountTypeSNo", "eq", 2);
            filterAirlineSNo = cfi.autoCompleteFilter(filter1);
            return filterAirlineSNo;
        }
    }



    else if (textId.indexOf("Text_CampaignGeneratedCodeSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "RateAirlineAdhocSNo", "eq", $('#HdnPageSNo').val());

        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }

        //if (textId.indexOf("Text_CurrencySNo") >= 0) {
        //    var filter1 = cfi.getFilter("AND");
        //    cfi.setFilter(filter1, "CitySNo", "eq", $("#OriginCitySNo").val());
        //    filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        //    return filterAirlineSNo;
        //} 
        //// $('[id*="tblFlightInfo_rowOrder"]').each(function (row, tr) {
        // $("#tblFlightInfo_rowOrder").each(function (row, tr) {
        //  $("#tblFlightInfo_rowOrder").val().split(',').length;
        //var r = Math.abs(row + 1);


    else if (textId.indexOf("tblFlightInfo_FlightDestinationSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        $('[id*="tblFlightInfo_rowOrder"]').each(function (row, tr) {
            r = textId.split('_')[2];
            cfi.setFilter(filter1, "SNo", "neq", $("#tblFlightInfo_HdnFlightOriginSNo_" + r).val());
        });
        var filterSNo = cfi.autoCompleteFilter(filter1);

        return filterSNo;
    }
    else if (textId.indexOf("tblULDRate_RateClassSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");

        cfi.setFilter(filter1, "Class", "eq", 3);

        var filterSNo = cfi.autoCompleteFilter(filter1);

        return filterSNo;
    }

    else if (textId.indexOf("tblFlightInfo_FlightOriginSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        $('[id*="tblFlightInfo_rowOrder"]').each(function (row, tr) {
            r = textId.split('_')[2];
            cfi.setFilter(filter1, "SNo", "neq", $("#tblFlightInfo_HdnFlightDestinationSNo_" + r).val());

        });
        var filterSNo = cfi.autoCompleteFilter(filter1);
        return filterSNo;
    }

    else if (textId.indexOf("tblFlightInfo_FlightNumSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        $('[id*="tblFlightInfo_rowOrder"]').each(function (row, tr) {
            r = textId.split('_')[2];
            cfi.setFilter(filter1, "AirlineSNo", "eq", $("#AirlineSNo").val());
            cfi.setFilter(filter1, "OriginAirportCode", "eq", $("#tblFlightInfo_FlightOriginSNo_" + r).val());
            cfi.setFilter(filter1, "DestinationAirportCode", "eq", $("#tblFlightInfo_FlightDestinationSNo_" + r).val());
            cfi.setFilter(filter1, "flightDate", "eq", $("#tblFlightInfo_FlightDate_" + r).val());

        });
        var filterSNo = cfi.autoCompleteFilter(filter1);
        return filterSNo;
    }

    // });

}

/*--------------------------To Bind ExtraConditions on load ---------------------------------------------- */

function randomString(method, length) {
    var stringLength = 0;
    if (!length) {
        stringLength = 10;
    } else {
        stringLength = length;
    }
    var chars = '';
    if (method === 'alpha') {
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    } else if (method === 'numeric') {
        chars = '0123456789';
    } else {
        chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    }
    var randomString = '';
    for (var i = 0; i < stringLength; i += 1) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return "REF" + randomString;
}

/*--------------------------To Clear AutoComplete office and agent on origin change ---------------------------------------------- */
function clearvalues() {
    if ($('input[name=RateAdhocType][value=2]:checked').val() == 2) {
        GetDestination();
    }
    cfi.ResetAutoComplete("OfficeSNo");
    cfi.ResetAutoComplete("AccountSNo");
}
/*--------------------------To Clear AutoComplete office and agent on origin change ---------------------------------------------- */

/*--------------------------To Clear AutoComplete  agent on office change ---------------------------------------------- */
function clear() {

    cfi.ResetAutoComplete("AccountSNo");
}
/*--------------------------To Clear AutoComplete  agent on office change ---------------------------------------------- */


$('#Volume').blur(function () {
    $("#VolWT").remove();
    if ($('#Volume').val() != "") {
        if ((this.value <= 0.000) || (this.value <= 0)) {

            ShowMessage('warning', 'warning - Spot Rate', "Volume cannot be zero.");

            $("#Volume").val('');
            return false;
        }
        else {
            $("#MinusVarainceVolumePercentage").closest('td').append('<b><span id= "VolWT"><font color="Black">Volume Weight: </font><span></b>')
            var volWT = GetroundValue(parseFloat( $("#Volume").val()) * 166.66, 1)
            $("#VolWT").text($("#VolWT").text() + volWT)

        }
        ClearRates();
        chargablewt();
    }
});
$('#GrossWeight').blur(function () {

    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {

            ShowMessage('warning', 'warning - Spot Rate', "Gross Weight Should Not be Zero or Less than Zero.");

            $("#GrossWeight").val('');
            return false;
        }
    }
    ClearRates();
    chargablewt();
});
$('#GetAWBbtn').click(function () {
    getAWBList();
});
$('#PlusVarainceGrossPercentage ,#MinusVarainceGrossPercentage').blur(function () {
    Checkvalues();
});
$('#PlusVarainceVolumePercentage ,#MinusVarainceVolumePercentage').blur(function () {
    Checkvlvalues();
});

/*--------------------------To set chargable Weight ---------------------------------------------- */
function chargablewt() {
    var grwt = $('#GrossWeight').val();
    var vlweight = $('#Volume').val();

    var vlwt = Math.abs((vlweight * 166.66).toFixed(2));
    if (grwt != "" || vlwt != "") {
        if (grwt > vlwt) {
            $('#ChargeableWeight,#_tempChargeableWeight').val(parseFloat(grwt).toFixed(2));
            //$('#GrossWeight').val(parseFloat(grwt).toFixed(1));
            $('#ChargeableWeight').removeAttr('Readonly')
        }
        else {
            $('#ChargeableWeight ,#_tempChargeableWeight').val(vlwt);
            $('#Volume').val(parseFloat(vlweight).toFixed(3));
            //$('#GrossWeight').val(parseFloat(grwt).toFixed(1));
        }
    }
    else {
        $('#ChargeableWeight ,#_tempChargeableWeight').val('');
    }
}
/*--------------------------To set chargable Weight ---------------------------------------------- */

/*--------------------------To Check values for GrossWeight &Volume Weight ---------------------------------------------- */
function Checkvalues() {
    var grper = parseInt($('#PlusVarainceGrossPercentage').val());
    var grmper = parseInt($('#MinusVarainceGrossPercentage').val());
    if ((grper < grmper)) {
        ShowMessage('info', 'Warning-Message', "Value must be greater than minus percentage");
        $('#PlusVarainceGrossPercentage').val('');
    }

}
function Checkvlvalues() {
    var grper = parseInt($('#PlusVarainceVolumePercentage').val());
    var grmper = parseInt($('#MinusVarainceVolumePercentage').val());
    if (grper < grmper) {
        ShowMessage('info', 'Warning-Message', "Value must be greater than minus percentage");
        $('#PlusVarainceVolumePercentage').val('');
    }

}
/*--------------------------To Check values for GrossWeight &Volume Weight ---------------------------------------------- */

/*--------------------------To get AWB data ---------------------------------------------- */
function getAWBList() {
    var AwbValue = $('#AWBNo').val();
    var AwbCode = $('#AWBCode').val();
    if (AwbValue != "") {
        if (AwbCode == "") {
            ShowMessage('info', 'Warning-Message', "Please Select Airline  First");
            return false;
        }
        var AWBNO = AwbCode + "-" + AwbValue;
    }
    else {
        if (AwbValue == "") {
            ShowMessage('warning', 'Warning-Message', "Kindly enter AWB number prior to clicking GET AWB to fetch relevant details");
            return false;
        }
        else if (AwbCode == "") {
            ShowMessage('info', 'Warning-Message', "Please Select Airline  First");
            return false;
        }
    }

    GetAWBdetails(AWBNO);

}

function GetAWBdetails(value) {
    $.ajax({
        url: "Services/Rate/SpotRateService.svc/GetAWBData",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            str: value
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(21, 22) == '{') {
                var record = jQuery.parseJSON(result);
                var myData = record.Table[0];
                //  var myData2 = record.Table2[0];
                if (parseInt(userContext.CitySNo) != parseInt(myData.OriginCitySNo))
                {
                    ShowMessage('info', 'Warning-Message', "AWB No Does Not Belong To This City");
                    return false;
                }
                $('#OriginCitySNo').val(myData.OriginCitySNo);
                $('#Text_OriginCitySNo').val(myData.Text_OriginCitySNo);
                $('#DestinationCitySNo').val(myData.DestinationCitySNo);
                $('#Text_DestinationCitySNo').val(myData.Text_DestinationCitySNo);
                $('#OfficeSNo').val(myData.OfficeSNo);
                $('#Text_OfficeSNo').val(myData.Text_OfficeSNo);

                $('#BasedOnSNo').val(myData.BasedOnSNo);
                $('#Text_BasedOnSNo').val(myData.Text_BasedOnSNo);


                $('#AccountSNo').val(myData.AccountSNo);
                $('#Text_AccountSNo').val(myData.Text_AccountSNo);
                $('#ProductSNo').val(myData.ProductSNo);
                $('#Text_ProductSNo').val(myData.Text_ProductSNo);
                $('#CommoditySNo').val(myData.CommoditySNo);
                $('#Text_CommoditySNo').val(myData.Text_CommoditySNo);
                $('#Pieces ,#_tempPieces').val(myData.TotalPieces);
                $('#GrossWeight').val(myData.TotalGrossWeight);
                $('#Volume').val(myData.TotalCBM);
                //------------------volume Weight section--------------------------------
                $("#VolWT").remove();
                if ($('#Volume').val() != "") {
                    if ((parseFloat($('#Volume').val()) <= 0.000) || (parseFloat($('#Volume').val()) <= 0)) {
                    }
                    else {
                        $("#MinusVarainceVolumePercentage").closest('td').append('<b><span id= "VolWT"><font color="Black">Volume Weight: </font><span></b>')
                        var volWT = GetroundValue(parseFloat($("#Volume").val()) * 166.66, 1)
                        $("#VolWT").text($("#VolWT").text() + volWT)

                    }
                }
                //--------------------end------------------------------------------------------
                $('#ChargeableWeight ,#_tempChargeableWeight').val(myData.ChargeableWeight);
                $('#CurrencySNo').val(myData.CurrencySNo);
                $('#Text_CurrencySNo').val(myData.Text_CurrencySNo);
                $('#divMultiSHCSNo li').remove();
                $('#SHCSNo').val(myData.SHCSNo);
                $('#Text_SHCSNo').val(myData.Text_SHCSNo);
                $('#AWBTypeSNo').val(myData.AWBTypeSNo);
                $('#Text_AWBTypeSNo').val(myData.Text_AWBTypeSNo);
                $('#SectorRate ,#_tempSectorRate').val(myData.Rate);
                cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());               // 
                $('#divMultiSHCSNo').find('span').removeClass("k-icon k-delete");
                var tabNo = [3, 8, 9, 10, 11, 12, 13, 15, 32, 33];
                $.each(tabNo, function (i, val) {
                    $("input[tabindex='" + tabNo[i] + "']").data("kendoAutoComplete").enable(false);
                });
                $('#Pieces ,#_tempPieces ,#GrossWeight ,#Volume ,#_tempChargeableWeight ,#Text_CurrencySNo ,#Reference ,#_tempSectorRate').attr('disabled', true);
                $("input[type='button'][value='View Rate']").hide();
                $("input[type='button'][value='View Rate']").closest('td').prev().find('span').hide();
                var len = record.Table1.length;
                if (len > 0) {
                    CreateFlightInfoGrid();
                    for (var i = 1; i <= len; i++) {
                        //$('#tblFlightInfo_btnAppendRow').click();

                        var myData1 = record.Table1[i - 1];
                        $('#tblFlightInfo').appendGrid('insertRow', 1, 0);
                        var uniqueindex;
                        var prevrowuniqueindex;
                        prevrowuniqueindex = $('#tblFlightInfo').appendGrid('getRowOrder');
                        uniqueindex = prevrowuniqueindex.length;
                        $('#tblFlightInfo_HdnFlightOriginSNo_' + uniqueindex).val(myData1.OriginAirportSNo);
                        $('#tblFlightInfo_FlightOriginSNo_' + uniqueindex).val(myData1.OriginAirportCode);
                        $('#tblFlightInfo_FlightOriginSNo_' + uniqueindex).data("kendoAutoComplete").enable(false);

                        $('#tblFlightInfo_HdnFlightDestinationSNo_' + uniqueindex).val(myData1.DestinationAirportSNo);
                        $('#tblFlightInfo_FlightDestinationSNo_' + uniqueindex).val(myData1.DestinationAirportCode);
                        $('#tblFlightInfo_FlightDestinationSNo_' + uniqueindex).data("kendoAutoComplete").enable(false);

                        $('#tblFlightInfo_HdnFlightNumSNo_' + uniqueindex).val(myData1.FlightNo);
                        $('#tblFlightInfo_FlightNumSNo_' + uniqueindex).val(myData1.FlightNo);
                        $('#tblFlightInfo_FlightNumSNo_' + uniqueindex).data("kendoAutoComplete").enable(false);

                        $('#tblFlightInfo_FlightDate_' + uniqueindex).val(myData1.FlightDate);
                        $('#tblFlightInfo_FlightDate_' + uniqueindex).data("kendoDatePicker").enable(false);
                    }

                    CreateULDSlabGrid();

                    var len = record.Table2.length;
                    if (len > 0) {
                        $("#chkUld").click()
                        $("#chkUld").attr('checked', true);
                        $("#divULDRate").show()
                        $("#_tempSectorRate,#SectorRate,#RequestedRate,#_tempRequestedRate").removeAttr('data-valid')
                    }
                    else {
                        $("#_tempSectorRate,#SectorRate,#RequestedRate,#_tempRequestedRate").attr('data-valid','required')
                        }

                    for (var i = 1; i <= len; i++) {
                        var myData1 = record.Table2[i - 1];
                        $('#tblULDRate').appendGrid('insertRow', 1, 0);
                        var uniqueindex;
                        var prevrowuniqueindex;
                        prevrowuniqueindex = $('#tblULDRate').appendGrid('getRowOrder');
                        uniqueindex = prevrowuniqueindex.length;
                        $('#tblULDRate_HdnULDSNo_' + uniqueindex).val(myData1.ULDSNo);
                        $('#tblULDRate_ULDSNo_' + uniqueindex).val(myData1.ULDName);
                        $('#tblULDRate_ULDSNo_' + uniqueindex).data("kendoAutoComplete").enable(false);

                        $('#tblULDRate_HdnRateClassSNo_' + uniqueindex).val(myData1.RateClassCode);
                        $('#tblULDRate_RateClassSNo_' + uniqueindex).val(myData1.Text_RateClassCode);
                        $('#tblULDRate_RateClassSNo_' + uniqueindex).data("kendoAutoComplete").enable(false);


                        $('#_temptblULDRate_Rate_' + uniqueindex).val(myData1.PivotRate);
                        $('#tblULDRate_Rate_' + uniqueindex).val(myData1.PivotRate);
                        $('#_temptblULDRate_Rate_' + uniqueindex).attr('disabled', true);
                        $('#tblULDRate_Rate_' + uniqueindex).removeAttr('data-valid', 'required');
                        $('#_temptblULDRate_Rate_' + uniqueindex).removeAttr('data-valid', 'required');
                        $('#tblULDRate_Rate_' + uniqueindex).attr('disabled', true);

                    }
                }
                else {
                    var ab = $('#tblFlightInfo').appendGrid('getRowOrder');
                    var c = (ab.length);
                    CreateFlightInfoGrid();
                    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                        $('#tblFlightInfo_HdnFlightOriginSNo_1').val($("#OriginCitySNo").val().split('-')[1]);
                        //  $('#tblFlightInfo_HdnFlightOriginSNo_' + uniqueindex).attr('keyColumn')
                        $('#tblFlightInfo_FlightOriginSNo_1').val($("#OriginCitySNo").val().split('-')[2]);                      

                        // $('#tblFlightInfo_FlightOriginSNo_' + (uniqueindex)).data("kendoAutoComplete").enable(false);
                    }
                }

                $("[name*=AgentGroup]").attr('disabled', true);
            }
            else {
                CreateFlightInfoGrid();
                CreateULDSlabGrid();
                ShowMessage('info', 'Info-Message', "No Record Found For AWB No/Already Exists");
            }
            $('input[type="radio"][data-radioval=Campaign]').attr('disabled', 'true');
            if ($('input[type=radio][name=RateAdhocType]:checked').val() == "1") {
                $('input[type="radio"][data-radioval=Adhoc]').attr('disabled', 'true');
            }
            else if ($('input[type=radio][name=RateAdhocType]:checked').val() == "0") {
                $('input[type="radio"][data-radioval=ServiceCargo]').attr('disabled', 'true');
            }

            $('input[type=checkbox][name=CampaignType][value=1]').removeAttr('data-valid', "required");
            $('input[type=checkbox][name=CampaignType][value=2]').removeAttr('data-valid', "required");

            $('[id*="tblFlightInfo_Delete_"]').each(function () {
                $('#' + this.id).hide();

            });
            //$('#tblFlightInfo').appendGrid({hideButtons:{ remove: true } });
            return false
        },
        error: function (xhr) {

        }
    });
}

/*--------------------------To allow decimal character only ---------------------------------------------- */

function validDecimal(txt) {
    return txt.match(/^\d*(.\d{0,1})?$/);
}
$("#GrossWeight ,#Volume").on("keypress keyup blur", function (event) {
    //this.value = this.value.replace(/[^0-9\.]/g,'');
    $(this).val().match(/^\d*(.\d{0,1})?$/);
    $(this).val($(this).val().replace(/^\s*[0-9]{,3}(?:\.[0-9]{1,3})?\s*$/, ''));
    if ((event.which != 46 && event.which > 31 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
    $(this).val().match(/^\d*(.\d{0,1})?$/);
    //if ($(this).val().indexOf('.') == -1) {
    //                    return true;
    //                }
    //                else {
    //                    return false;
    //                }
    //evt.preventDefault();
});


/*--------------------------To allow decimal character only ---------------------------------------------- */
$("#PlusVarainceGrossPercentage ,#MinusVarainceGrossPercentage ,#PlusVarainceVolumePercentage ,#MinusVarainceVolumePercentage ,#_tempAWBNo ,#AWBNo").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});


$("[id*=RateAdhocType]").click(function () {
    var value = $('#RateAdhocType:checked').val();
    if ($('#AirlineSNo').val() != "") {
        if (value == 2) {
            Unrequired();
            //cfi.ResetAutoComplete("OriginCitySNo");
            cfi.ResetAutoComplete("AWBTypeSNo");
            cfi.ResetAutoComplete("DestinationCitySNo");
            cfi.ResetAutoComplete("ProductSNo");
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
            cfi.ResetAutoComplete("CommoditySNo");
            cfi.ResetAutoComplete("OfficeSNo");
            cfi.ResetAutoComplete("AccountSNo");
            //$('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);

            //$('#Text_AccountSNo').data("kendoAutoComplete").enable(false);

            $('#AWBNo').attr('disabled', true);
            $('#GetAWBbtn').attr('disabled', true);
            //$('#Text_AWBTypeSNo').data('kendoAutoComplete').enable(false);
            $('#GrossWeight').removeAttr('data-valid', "required");
            $('td[title="Select Gross Weight"]').html("<span style='color:red'></span>Gross Weight");

            $('input[type=checkbox][name="CampaignType"]').show();
            $('input[type=checkbox][name=CampaignType]').parent().contents()[8].data = "International";
            $('input[type=checkbox][name=CampaignType]').parent().contents()[10].data = "Domestic";


            $('input[type=checkbox][name=CampaignType][value=1]').attr('data-valid', "required");
            $('input[type=checkbox][name=CampaignType][value=2]').attr('data-valid', "required");
            $('input[type=checkbox][name=CampaignType][value=1]').attr('checked', true);
            $('input[type=checkbox][name=CampaignType][value=2]').attr('checked', true);
            CheckValidate();


            $('#spnChargeableWeight').prev().text('');


            $("input[name=CodeType][data-radioval=Single]").attr('Checked', true);
            $('#NoofTransaction').closest('tr').show();
            $("input[type='text'][name='_tempCodeNo']").show();

            $('#Domestic').attr('data-valid', "required");
            $('#spnSectorRate').text('Campaign');
            $("#_tempCodeNo").attr('data-valid', 'required');
            $("#NoofTransaction").attr('data-valid', 'required');


            $('td[title="Enter No of Codes."]').html("<span style='color:red'>*</span>Number of Agent(s)");
            $("input[type='text'][name='CodeNo']").closest('td').prev().find('span').show();


            $('#ratePercentage').remove();
            $('#SectorRate').parent().append('<div id="ratePercentage" style="float:right;margin-right: 300px;">%</div>');
            $('#RequestedRate').closest('td').prev('td').wrapInner('<div></div>').find('*').hide();
            $('#RequestedRate').closest('td').find('*').hide();


            $('#Text_CurrencySNo').closest('tr').next('tr').hide();
            $('#SectorRate').closest('tr').next('tr').hide();


            $("input[type='button'][value='View Rate']").hide();
            $("input[type='button'][value='View Rate']").closest('td').prev().find('span').hide();
            $('#_tempCodeNo ').closest('tr').show();
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                $('#IsCommissionable').closest('tr').next('tr').show();

            }
            $('#_tempSectorRate ,#SectorRate').removeAttr("readonly");
            $('#_tempSectorRate ,#SectorRate').removeAttr("disabled");
            $('#DiscountedServiceCargo').remove()
            $('#SectorRate ,#_tempSectorRate ,#RequestedRate ,#_tempRequestedRate').val('');
            $('#Text_OriginCitySNo').data("kendoAutoComplete").enable(true);
        }

        else {

            $('#OriginCitySNo').val(userContext.CitySNo + '-' + userContext.AirportSNo + '-' + userContext.AirportCode)
            $('#Text_OriginCitySNo').val(userContext.CityCode + '-' + userContext.CityName);

            $('#spnChargeableWeight').prev().text('*');
            if (userContext.GroupName == 'AGENT') {
                $('#Text_OfficeSNo').data('kendoAutoComplete').enable(false);
                $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            }
            else {
                $('#Text_OfficeSNo').data("kendoAutoComplete").enable(true);

                $('#Text_AccountSNo').data("kendoAutoComplete").enable(true);

            }


            $('#AWBNo').removeAttr('disabled', true);
            $('#GetAWBbtn').removeAttr('disabled', true);
            $('#Text_AWBTypeSNo').data('kendoAutoComplete').enable(true);
            $('#GrossWeight').attr('data-valid', "required");
            $('td[title="Select Gross Weight"]').html("<span style='color:red'>*</span>Gross Weight");
            $('input[type=checkbox][name="CampaignType"]').hide();
            $('input[type=checkbox][name=CampaignType]').parent().contents()[8].data = "";
            $('input[type=checkbox][name=CampaignType]').parent().contents()[10].data = "";

            $("#NoofTransaction").removeAttr('data-valid', 'required');
            $('#Text_CurrencySNo').closest('tr').next('tr').show();
            $('#SectorRate').closest('tr').next('tr').show();
            $('#ratePercentage').remove();

            $('#spnSectorRate').text('Rate ');
            $('#NoofTransaction').closest('tr').hide();


            $('#_tempRequestedRate').show()
            makerequired();
            $('#Text_OriginCitySNo').data("kendoAutoComplete").enable(false);
            $('#_tempCodeNo ').closest('tr').hide();
            $('#IsCommissionable').closest('tr').next('tr').hide();
            $('#_tempSectorRate ,#SectorRate').attr("readonly", "readonly");
            if (value == 1) {
                $('#SectorRate ,#_tempSectorRate ,#RequestedRate ,#_tempRequestedRate').val('');
                $('#CampaignGroup').remove();
                $('#ratePercentage').remove();
                $('#DivNoOfTransaction').remove();            
                //$('#DiscountedServiceCargo').remove()
                //$('#RequestedRate').after('<div id="DiscountedServiceCargo" style="margin-left: 127px;margin-top: -21px;"><span>Discount %</span><input type="text" class="k-formatted-value k-input" id="txtServiceDiscount" style="width:50px" /></div>');

                //LoadDiscountedChekbox();
                //_tempRequestedRate1
                //$('#RequestedRate').closest('td').prev('td').wrapInner('<div></div>').find('*').show();
                //$('#RequestedRate').closest('td').find('*').show();


            }
            else if (value == 0) {
                $('#SectorRate ,#_tempSectorRate ,#RequestedRate ,#_tempRequestedRate').val('');
                $('#CampaignGroup').remove();
                $('#ratePercentage').remove();
                $('#DivNoOfTransaction').remove();             
                //$('#RequestedRate').closest('td').prev('td').wrapInner('<div></div>').find('*').show();
                //$('#RequestedRate').closest('td').find('*').show();
            }
            $('#DiscountedServiceCargo').remove()
            $('#RequestedRate').after('<div id="DiscountedServiceCargo" style="margin-left: 127px;margin-top: -21px;"><span>Discount %</span><input type="text" class="k-formatted-value k-input" id="txtServiceDiscount" style="width:50px" /><span>Surcharge %</span><input type="text" class="k-formatted-value k-input" id="txtSurchargeDiscount" style="width:50px" /></div>');
            LoadDiscountedChekbox();
            // $('#SectorRate ,#_tempSectorRate ,#RequestedRate ,#_tempRequestedRate').val('');
        }
    }
    else {
        if (value == 2) {
            Unrequired();
            $("input[type='button'][value='View Rate']").hide();
            $("input[type='button'][value='View Rate']").closest('td').prev().find('span').hide();
            $('#_tempCodeNo ').closest('tr').show();
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                $('#IsCommissionable').closest('tr').next('tr').show();
           
            }
            // $('#_tempSectorRate ,#SectorRate').removeAttr("readonly");
            // $('#_tempSectorRate ,#SectorRate').removeAttr("disabled");

        }
        else {
            $('#_tempCodeNo ').closest('tr').hide();
            $('#IsCommissionable').closest('tr').next('tr').hide();
            makerequired();
            $('#_tempCodeNo ').closest('tr').hide();
            $('#IsCommissionable').closest('tr').next('tr').hide();
            $('#_tempSectorRate ,#SectorRate').attr("readonly", "readonly");
            if (value == 1) {
                $('#SectorRate ,#_tempSectorRate ,#RequestedRate ,#_tempRequestedRate').val('');
            }
        }
    }
});

function LoadDiscountedChekbox() {

    var CalculateRequestedRate = "";
    $("#txtServiceDiscount").blur(function () {

        if ($("#SectorRate").val() != "") {

            if (parseFloat(this.value) <= 0.000 || parseFloat(this.value) <= 0) {

                //ShowMessage('warning', 'warning - Discounted Spot Rate', "Discount percentage cannot be zero");
                //$("#txtServiceDiscount").val('');
                //return false;

            }
            //var value = $('#RateAdhocType:checked').val();
            //if (value == "1") {
            //    if (parseFloat(this.value) == 100) {
            //        $("#BasedOnSNo").after('<div id="divWaveOfDC" style="margin-left: 127px;">Waive Off Due Carrier Charges<input type="checkbox" class="k-formatted-value k-input" id="chkDueCarrierCV" style="width:50px" /></div>')
            //    }
            //    else {
            //        $("#divWaveOfDC").remove();
            //    }
            //}

            var value = $('#RateAdhocType:checked').val();
            var divWaveOfDC = document.getElementById("divWaveOfDC");
            var chk = 0;
            if (divWaveOfDC == null) { chk = 0 }
            else { chk = 1 };
            if (value == "1") {
                if (parseFloat(this.value) == 100 && chk == 0) {
                    $("#BasedOnSNo").after('<div id="divWaveOfDC" style="margin-left: 127px;">Waive Off Due Carrier Charges<input type="checkbox" class="k-formatted-value k-input" id="chkDueCarrierCV" style="width:50px" /></div>')
                }
                else if (chk == 0 || parseFloat(this.value)!=100) {
                    $("#divWaveOfDC").remove();
                }
            }


            if (parseFloat(this.value) > 100) {
                ShowMessage('warning', 'warning - Discounted Spot Rate', "Discount percentage cannot be more than 100 %");

                $("#txtServiceDiscount").val('');
            }

            if ($("#txtServiceDiscount").val().trim() != "") {
                CalculateRequestedRate = parseFloat($("#SectorRate").val()) - parseFloat((($("#SectorRate").val() * $("#txtServiceDiscount").val()) / 100))
                $("#RequestedRate").val(parseFloat(CalculateRequestedRate).toFixed(2));
                $("#_tempRequestedRate").val(parseFloat(CalculateRequestedRate).toFixed(2));
            } else {
                $("#RequestedRate").val('');
                $("#_tempRequestedRate").val('');
                $('#txtSurchargeDiscount').removeAttr('disabled');
            }
            if ($("#RequestedRate").val().trim() != "" && $("#SectorRate").val().trim() != "") {
                if (parseFloat($("#RequestedRate").val()) > parseFloat($("#SectorRate").val())) {

                    $('#txtServiceDiscount').attr('disabled', true);
                    $('#txtSurchargeDiscount').removeAttr('disabled');
                    $('#txtServiceDiscount').val('');

                }
                else if (parseFloat($("#RequestedRate").val()) <= parseFloat($("#SectorRate").val())) {
                    $('#txtSurchargeDiscount').attr('disabled', true);
                    $('#txtSurchargeDiscount').val('');
                    $('#txtServiceDiscount').removeAttr('disabled');
                }
            }
        }
        else {
            ShowMessage('warning', 'warning - Discounted Spot Rate', "Rate cannot be blank !");
            $("#SectorRate").focus();
            $("#txtServiceDiscount").val('');
        }


    })


    $("#txtSurchargeDiscount").blur(function () {

        if ($("#SectorRate").val() != "") {


            if (parseFloat(this.value) <= 0.000 || parseFloat(this.value) <= 0) {
                //ShowMessage('warning', 'warning - Surcharge Spot Rate', "Surcharge percentage cannot be zero");
                //$("#txtSurchargeDiscount").val('');
                //return false;
            }

            if (parseFloat(this.value) > 100) {
                ShowMessage('warning', 'warning - Surcharge Spot Rate', "Surcharge percentage cannot be more than 100 %");

                $("#txtSurchargeDiscount").val('');
            }

            if ($("#txtSurchargeDiscount").val().trim() != "") {
                CalculateRequestedRate = parseFloat($("#SectorRate").val()) + parseFloat(($("#SectorRate").val() * $("#txtSurchargeDiscount").val()) / 100)
                //$("#RequestedRate").val(CalculateRequestedRate);
                //$("#_tempRequestedRate").val(CalculateRequestedRate);
                $("#RequestedRate").val(parseFloat(CalculateRequestedRate).toFixed(2));
                $("#_tempRequestedRate").val(parseFloat(CalculateRequestedRate).toFixed(2));
            }
            else {
                $("#RequestedRate").val('');
                $("#_tempRequestedRate").val('');
                $('#txtServiceDiscount').removeAttr('disabled');

            }
            if ($("#RequestedRate").val().trim() != "" && $("#SectorRate").val().trim() != "") {
                if (parseFloat($("#RequestedRate").val()) > parseFloat($("#SectorRate").val())) {

                    $('#txtServiceDiscount').attr('disabled', true);
                    $('#txtSurchargeDiscount').removeAttr('disabled');
                    $('#txtServiceDiscount').val('');

                }
                else if (parseFloat($("#RequestedRate").val()) < parseFloat($("#SectorRate").val())) {
                    $('#txtSurchargeDiscount').attr('disabled', true);
                    $('#txtSurchargeDiscount').val('');
                    $('#txtServiceDiscount').removeAttr('disabled');
                }
                else if (parseFloat($("#RequestedRate").val()) == parseFloat($("#SectorRate").val())) {
                    $('#txtServiceDiscount').attr('disabled', true);
                    $('#txtSurchargeDiscount').val('0');
                    $('#txtSurchargeDiscount').removeAttr('disabled');
                }
            }
        }
        else {
            ShowMessage('warning', 'warning - Discounted Spot Rate', "Rate cannot be blank !");
            $("#SectorRate").focus();
            $("#txtServiceDiscount").val('');
        }


    })
}
$("#RequestedRate").blur(function () {
    var value = $('#RateAdhocType:checked').val();
    var divWaveOfDC = document.getElementById("divWaveOfDC");
    var chk = 0;
    if (divWaveOfDC == null) { chk = 0}
    else { chk = 1 };
    if (value == "1") {
        if (parseFloat(this.value) == 0 && chk==0) {
            $("#BasedOnSNo").after('<div id="divWaveOfDC" style="margin-left: 127px;">Waive Off Due Carrier Charges<input type="checkbox" class="k-formatted-value k-input" id="chkDueCarrierCV" style="width:50px" /></div>')
        }
        else if (parseFloat(this.value)>0)
        {
            $("#divWaveOfDC").remove();
        }
    }
});




function LoadApprovedDiscountedChekbox() {

    var CalculateRequestedRate = "";
    $("#txtApprovedServiceDiscount").blur(function () {

        if (parseFloat(this.value) <= 0.000 || parseFloat(this.value) <= 0) {

            //ShowMessage('warning', 'warning - Discounted Spot Rate', "Discount percentage cannot be zero");
            //$("#txtApprovedServiceDiscount").val('');
            //return false;

        }

        //var value = $('#RateAdhocType:checked').val();
        //if (value == "1") {
        //    if (parseFloat(this.value) == 100) {
        //        $("#txtApprovedSurchargeDiscount").closest('td').append('<div id="divWaveOfDC" style="margin-left: 127px;">Waive Off Due Carrier Charges<input type="checkbox" class="k-formatted-value k-input" id="chkDueCarrierCV" style="width:50px" /></div>')
        //    }
        //    else {
        //        $("#divWaveOfDC").remove();
        //    }
        //}

        var value = $('#RateAdhocType:checked').val();
        var divWaveOfDC = document.getElementById("divWaveOfDC");
        var chk = 0;
        if (divWaveOfDC == null) { chk = 0 }
        else { chk = 1 };
        if (value == "1") {
            if (parseFloat(this.value) == 100 && chk == 0) {
                $("#txtApprovedSurchargeDiscount").closest('td').append('<div id="divWaveOfDC" style="margin-left: 127px;">Waive Off Due Carrier Charges<input type="checkbox" class="k-formatted-value k-input" id="chkDueCarrierCV" style="width:50px" /></div>')
            }
            else if (parseFloat(this.value) != 100 || chk==0) {
                $("#divWaveOfDC").remove();
            }
        }


        if (parseFloat(this.value) > 100) {
            ShowMessage('warning', 'warning - Discounted Spot Rate', "Discount percentage cannot be more than 100 %");

            $("#txtApprovedServiceDiscount").val('');
        }

        if ($("#txtApprovedServiceDiscount").val().trim() != "") {
            CalculateRequestedRate = parseFloat($("#SectorRate").val()) - parseFloat((($("#SectorRate").val() * $("#txtApprovedServiceDiscount").val()) / 100))
            //$("#ApprovedRate").val(CalculateRequestedRate);
            //$("#_tempApprovedRate").val(CalculateRequestedRate);

            $("#ApprovedRate").val(parseFloat(CalculateRequestedRate).toFixed(2));
            $("#_tempApprovedRate").val(parseFloat(CalculateRequestedRate).toFixed(2));
        } else {
            $("#ApprovedRate").val('');
            $("#_tempApprovedRate").val('');
            $('#txtApprovedSurchargeDiscount').removeAttr('disabled');
        }

        if ($("#SectorRate").val().trim() != "" && $("#ApprovedRate").val() != "") {

            if (parseFloat($("#SectorRate").val()) > parseFloat($("#ApprovedRate").val())) {

                $('#txtApprovedSurchargeDiscount').attr('disabled', true);
                $('#txtApprovedSurchargeDiscount').val('');
                $('#txtApprovedServiceDiscount').removeAttr('disabled');

            }
            else if (parseFloat($("#SectorRate").val()) < parseFloat($("#ApprovedRate").val())) {


                $('#txtApprovedServiceDiscount').attr('disabled', true);
                $('#txtApprovedSurchargeDiscount').removeAttr('disabled');
                $('#txtApprovedServiceDiscount').val('');
            }
            else if (parseFloat($("#SectorRate").val()) == parseFloat($("#ApprovedRate").val())) {


                $('#txtApprovedServiceDiscount').removeAttr('disabled');
                $('#txtApprovedSurchargeDiscount').attr('disabled', true);;
                $('#txtApprovedServiceDiscount').val('0');
                $('#txtApprovedSurchargeDiscount').val('');
            }
        }



    })


    $("#txtApprovedSurchargeDiscount").blur(function () {


        if (parseFloat(this.value) <= 0.000 || parseFloat(this.value) <= 0) {
            //ShowMessage('warning', 'warning - Surcharge Spot Rate', "Surcharge percentage cannot be zero");
            //$("#txtApprovedSurchargeDiscount").val('');
            //return false;
        }

        if (parseFloat(this.value) > 100) {
            ShowMessage('warning', 'warning - Surcharge Spot Rate', "Surcharge percentage cannot be more than 100 %");

            $("#txtApprovedSurchargeDiscount").val('');
        }

        if ($("#txtApprovedSurchargeDiscount").val().trim() != "") {
            CalculateRequestedRate = parseFloat($("#SectorRate").val()) + parseFloat(($("#SectorRate").val() * $("#txtApprovedSurchargeDiscount").val()) / 100)
            //$("#ApprovedRate").val(CalculateRequestedRate);
            //$("#_tempApprovedRate").val(CalculateRequestedRate);

            $("#ApprovedRate").val(parseFloat(CalculateRequestedRate).toFixed(2));
            $("#_tempApprovedRate").val(parseFloat(CalculateRequestedRate).toFixed(2));

        } else {
            $("#ApprovedRate").val('');
            $("#_tempApprovedRate").val('');

            $('#txtApprovedServiceDiscount').removeAttr('disabled');
        }
        if ($("#SectorRate").val().trim() != "" && $("#ApprovedRate").val() != "") {

            if (parseFloat($("#SectorRate").val()) > parseFloat($("#ApprovedRate").val())) {

                $('#txtApprovedSurchargeDiscount').attr('disabled', true);
                $('#txtApprovedSurchargeDiscount').val('');
                $('#txtApprovedServiceDiscount').removeAttr('disabled');

            }
            else if (parseFloat($("#SectorRate").val()) < parseFloat($("#ApprovedRate").val())) {


                $('#txtApprovedServiceDiscount').attr('disabled', true);
                $('#txtApprovedSurchargeDiscount').removeAttr('disabled');
                $('#txtApprovedServiceDiscount').val('');
            }
            else if (parseFloat($("#SectorRate").val()) == parseFloat($("#ApprovedRate").val())) {


                $('#txtApprovedServiceDiscount').attr('disabled', true);
                $('#txtApprovedSurchargeDiscount').removeAttr('disabled');
                $('#txtApprovedServiceDiscount').val('');
                $('#txtApprovedSurchargeDiscount').val('0');
            }
        }


    })
}



$("#SectorRate").blur(function () {
    if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {

        ShowMessage('warning', 'warning - Campaign ', "Campaign Should Not be Zero or Less than Zero.");

        $("#SectorRate").val('');
    }
    else {

    }
})



$("#RequestedRate").blur(function () {

    if (parseFloat(this.value) <= 0.000 || parseFloat(this.value) <= 0) {

        var value = $('input[type="radio"][name=RateAdhocType]:checked').val();
        if ((value == 2) || (value == 0)) {
            ShowMessage('warning', 'warning - Requested Rate', "Requested Rate cannot be zero.");

            $("#RequestedRate").val('');
        }


    }
    var CalculateDiscountedRate = "";
    if ($("#RequestedRate").val().trim() != "" && $("#SectorRate").val().trim() != "") {
        if (parseFloat($("#RequestedRate").val()) > parseFloat($("#SectorRate").val())) {

            $('#txtServiceDiscount').attr('disabled', true);
            $('#txtSurchargeDiscount').removeAttr('disabled');
            $('#txtServiceDiscount').val('');
            CalculateDiscountedRate = ($("#RequestedRate").val() / $("#SectorRate").val() * 100) - 100;
            $("#txtSurchargeDiscount").val(parseFloat(CalculateDiscountedRate).toFixed(2));
        }
        else if (parseFloat($("#RequestedRate").val()) < parseFloat($("#SectorRate").val())) {
            $('#txtSurchargeDiscount').attr('disabled', true);
            $('#txtSurchargeDiscount').val('');
            $('#txtServiceDiscount').removeAttr('disabled');
            CalculateDiscountedRate = 100 - $("#RequestedRate").val() / $("#SectorRate").val() * 100;
            $("#txtServiceDiscount").val(parseFloat(CalculateDiscountedRate).toFixed(2));
        }
        else if (parseFloat($("#RequestedRate").val()) == parseFloat($("#SectorRate").val())) {
            $('#txtSurchargeDiscount').attr('disabled', true);
            $('#txtSurchargeDiscount').val('');
            $('#txtServiceDiscount').val('0');
            $('#txtServiceDiscount').removeAttr('disabled');
        }
    }
    else if ($("#RequestedRate").val().trim() == "") {
        $('#txtSurchargeDiscount').removeAttr('disabled', true);
        $('#txtSurchargeDiscount').val('');
        $('#txtServiceDiscount').val('');
        $('#txtServiceDiscount').removeAttr('disabled');
    }




    //else if (parseFloat(this.value) > parseFloat($('#_tempSectorRate').val())) {
    //    ShowMessage('warning', 'warning - Requested Rate', "Requested Rate Should Not be More than RSP Rate.");

    //    $("#RequestedRate").val('');
    //}
})


$("#ApprovedRate").blur(function () {


    if (parseFloat(this.value) <= 0.000 || parseFloat(this.value) <= 0) {
        if ($('input[type="radio"][name=RateAdhocType]:checked').val() != "1") {
            ShowMessage('warning', 'warning - Approved Spot Rate', "Approved Rate can not be Zero");
            $("#ApprovedRate").val('');
            return false;
        }
    }
    else if (parseFloat(this.value) > 0.000 || parseFloat(this.value) > 0) {
        $('#ApprovedRate').val(parseFloat($('#ApprovedRate').val()).toFixed(2));
    }


    if ($('input[type="radio"][name=RateAdhocType]:checked').val() == "2" && $("#IsFlatRate:checked").val() != 'on') {
        if (parseFloat(this.value) > 100) {
            ShowMessage('warning', 'warning - Approved Spot Rate', "Approved Rate Should Not be More than  100 %.");
            $("#ApprovedRate").val('');
        }
    }


    var CalculateDiscountedRate = "";

    if ($("#ApprovedRate").val().trim() != "" && $("#SectorRate").val().trim() != "") {
        if (parseFloat($("#ApprovedRate").val()) > parseFloat($("#SectorRate").val())) {

            $('#txtApprovedServiceDiscount').attr('disabled', true);
            $('#txtApprovedSurchargeDiscount').removeAttr('disabled');
            $('#txtApprovedServiceDiscount').val('');
            CalculateDiscountedRate = ($("#ApprovedRate").val() / $("#SectorRate").val() * 100) - 100;
            $("#txtApprovedSurchargeDiscount").val(parseFloat(CalculateDiscountedRate).toFixed(2));
        }
        else if (parseFloat($("#ApprovedRate").val()) < parseFloat($("#SectorRate").val())) {
            $('#txtApprovedSurchargeDiscount').attr('disabled', true);
            $('#txtApprovedSurchargeDiscount').val('');
            $('#txtApprovedServiceDiscount').removeAttr('disabled');
            CalculateDiscountedRate = 100 - $("#ApprovedRate").val() / $("#SectorRate").val() * 100;
            $("#txtApprovedServiceDiscount").val(parseFloat(CalculateDiscountedRate).toFixed(2));

        }
        else if (parseFloat($("#ApprovedRate").val()) == parseFloat($("#SectorRate").val())) {
            $('#txtApprovedSurchargeDiscount').attr('disabled', true);
            $('#txtApprovedSurchargeDiscount').val('');
            $('#txtApprovedServiceDiscount').val('0');
            $('#txtApprovedServiceDiscount').removeAttr('disabled');
        }
    } else if ($("#ApprovedRate").val().trim() == "") {
        $('#txtApprovedSurchargeDiscount').removeAttr('disabled', true);
        $('#txtApprovedSurchargeDiscount').val('');
        $('#txtApprovedServiceDiscount').val('');
        $('#txtApprovedServiceDiscount').removeAttr('disabled');
    }
    //added on 17 dec 18
    var value = $('#RateAdhocType:checked').val();
    var divWaveOfDC = document.getElementById("divWaveOfDC");
    var chk = 0;
    if (divWaveOfDC == null) { chk = 0 }
    else { chk = 1 };
    if (value == "1") {
        if (parseFloat(this.value) == 0 && chk == 0) {
            $("#txtApprovedSurchargeDiscount").closest('td').append('<div id="divWaveOfDC" style="margin-left: 127px;">Waive Off Due Carrier Charges<input type="checkbox" class="k-formatted-value k-input" id="chkDueCarrierCV" style="width:50px" /></div>')
        }
        else if (parseFloat(this.value) > 0) {
            $("#divWaveOfDC").remove();
        }
    }
    //if ($('input[type="radio"][name=RateAdhocType]:checked').val() == "0" || $('input[type="radio"][name=RateAdhocType]:checked').val() == "1") {
    //    if (parseFloat(this.value) > parseFloat($('#_tempSectorRate').val())) {
    //        ShowMessage('warning', 'warning - Approved Spot Rate', "Approved Rate Should Not be More than  RSP Rate.");

    //        $("#ApprovedRate").val('');
    //    }
    //}

})

$("[id*=IsApproved]").click(function () {
    var value = $('#IsApproved:checked').val();
    if (value == 2) {
        $("#ApprovedRate").removeAttr('data-valid', "required");
        $("#ApprovedRate").attr('disabled', true);
    }
    else {
        $("#ApprovedRate").attr('data-valid', "required");
        $("#ApprovedRate").removeAttr('disabled', true);
    }
});



$("#CodeNo").blur(function () {
    if (this.value <= 0.000 || this.value <= 0) {

        ShowMessage('warning', 'warning - Number of Agent(s)	', "Number of Agent(s) Should Not be Zero or Less than Zero.");

        $("#CodeNo").val('');
    }
    else {

    }
})
$("#NoofTransaction").blur(function () {
    if (this.value <= 0.000 || this.value <= 0) {

        ShowMessage('warning', 'warning - Number of Transaction(s)', "Number of Transaction(s) Should Not be Zero or Less than Zero.");

        $("#NoofTransaction").val('');
    }
    else {

    }
})



$('#ApprovedRate').keyup(function () {
    //if (this.value != this.value.replace(/[^0-9]/g, '')) {
    //    this.value = this.value.replace(/[^0-9]/g, '');
    //}
    //this.value = Math.abs(this.value).toFixed(2);

});



function CheckValidate() {

    var value = $('#CampaignType:checked').val() || "";
    if (value == "") {
        $('input[type=checkbox][name=CampaignType][value=1]').attr('data-valid', "required");
        $('input[type=checkbox][name=CampaignType][value=2]').attr('data-valid', "required");
    }
    else {
        $('input[type=checkbox][name=CampaignType][value=1]').removeAttr('data-valid', "required");
        $('input[type=checkbox][name=CampaignType][value=2]').removeAttr('data-valid', "required");

    }
}

function Unrequired() {

    $('#Text_OriginCitySNo').removeAttr('data-valid', "required");
    $('td[title="Select Origin"]').html("<span style='color:red'></span>  Origin");
    $('#Text_OriginCitySNo').closest('span').css('border-color', '');


    $('#Text_CurrencySNo').attr('data-valid', "required");
    $('td[title="Select Currency"]').html("<span style='color:red'>*</span>Currency");

    $('#Text_DestinationCitySNo').removeAttr('data-valid', "required");
    $('td[title="Select Destination"]').html("<span style='color:red'></span> Destination");
    $('#Text_DestinationCitySNo').closest('span').css('border-color', '');


    $('#Text_OfficeSNo').removeAttr('data-valid', "required");
    $('td[title="Select Office"]').html("<span style='color:red'></span>  Office");
    $('#Text_OfficeSNo').closest('span').css('border-color', '');

    $('#Text_AccountSNo').removeAttr('data-valid', "required");
    //$('td[title="Select Agent"]').html("<span style='color:red'></span>  Agent");
    $('td[title="Select Agent"]').text('')
    $('td[title="Select Agent"]').append('<input type="radio" name="AgentGroup" id="IsSingle" checked="checked" value="0">Single<input type="radio" name="AgentGroup" id="IsGroup" value="1">Group <span style="margin-left: 45px;color:red"></span>Agent');


    $('#Text_AccountSNo').closest('span').css('border-color', '');

    $('#Text_ProductSNo').removeAttr('data-valid', "required");
    $('td[title="Select Product"]').html("<span style='color:red'></span>  Product");
    $('#Text_ProductSNo').closest('span').css('border-color', '');

    $('#WeightType').removeAttr('data-valid', "required");
    $('td[title="Select Unit"]').html("<span style='color:red'></span>  Unit");
    $('#WeightType').closest('span').css('border-color', '');

    //$('#VolumeUnit').removeAttr('data-valid', "required");
    // $('td[title="Select Volume Unit"]').html("<span style='color:red'></span>  Volume Unit");
    //$('#VolumeUnit').closest('span').css('border-color', '');

    $('#Pieces ,#_tempPieces,#ChargeableWeight').removeAttr('data-valid', "required");
    $('td[title="Enter Pieces"]').html("<span style='color:red'></span>Pieces ");
    $('td[title="Enter Chargable Weight"]').html("<span style='color:red'></span>Chargable Weight");
    $('#Pieces ,#_tempPieces').closest('span').css('border-color', '');
    $('#Pieces ,#_tempPieces ,#_tempChargeableWeight ,#ChargeableWeight ,#RequestedRate').removeClass('valid_invalid');

    $('#RequestedRate').attr('disabled', true);
    $('td[title="Enter Requested Rate"]').html("<span style='color:red'></span> Requested Rate ");

    $("[name*=AgentGroup]").click(function () {
        var value = $('input[type="radio"][name="AgentGroup"]:checked').val();

        if (value == 0) {

            cfi.ResetAutoComplete("AccountGroupSNo");
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(false);

        }
        else {
            cfi.ResetAutoComplete("AccountSNo");
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(true);
        }

    });
}

function makerequired() {


    $('#Text_OriginCitySNo').attr('data-valid', "required");
    $('td[title="Select Origin"]').html("<span style='color:red'>*</span>  Origin");

    $("input[type='button'][value='View Rate']").show();
    $("input[type='button'][value='View Rate']").closest('td').prev().find('span').show();

    $('td[title="Select Currency"]').html("<span style='color:red'></span>Currency");
    $('td[title="Select Destination"]').html("<span style='color:red'>*</span> Destination");

    $('#Text_OfficeSNo').attr('data-valid', "required");
    $('td[title="Select Office"]').html("<span style='color:red'>*</span>  Office");

    $('#Text_AccountSNo').attr('data-valid', "required");
    //$('td[title="Select Agent"]').html("<span style='color:red'>*</span>  Agent");


    $('td[title="Select Agent"]').text('')
    $('td[title="Select Agent"]').append('<input type="radio" name="AgentGroup" id="IsSingle" checked="checked" value="0">Single<input type="radio" name="AgentGroup" id="IsGroup" value="1">Group <span style="margin-left: 45px;color:red">*</span>Agent');

    $('#Text_ProductSNo').attr('data-valid', "required");
    $('td[title="Select Product"]').html("<span style='color:red'>*</span>  Product");

    $('#WeightType').attr('data-valid', "required");
    $('td[title="Select Unit"]').html("<span style='color:red'>*</span>  Unit");

    //$('#VolumeUnit').attr('data-valid', "required");
    //$('td[title="Select Volume Unit"]').html("<span style='color:red'>*</span>  Volume Unit");

    $('#Text_DestinationCitySNo').attr('data-valid', "required");
    $('#Text_CurrencySNo').removeAttr('data-valid', "required");
    $('#Text_CurrencySNo').closest('span').css('border-color', '');

    $('#Pieces ,#_tempPieces,#ChargeableWeight').attr('data-valid', "required");
    $('td[title="Enter  Pieces "]').html("<span style='color:red'>*</span>  Pieces ");
    $('td[title="Enter Chargable Weight"]').html("<span style='color:red'>*</span>Chargable Weight");

    $('#RequestedRate').attr('disabled', false);
    $('td[title="Enter Requested Rate"]').html("<span style='color:red'>*</span> Requested Rate ");
    $("[name*=AgentGroup]").click(function () {
        var value = $('input[type="radio"][name="AgentGroup"]:checked').val();

        if (value == 0) {

            cfi.ResetAutoComplete("AccountGroupSNo");
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(false);

        }
        else {
            cfi.ResetAutoComplete("AccountSNo");
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AccountGroupSNo').data("kendoAutoComplete").enable(true);
        }

    });
}


function mkunreqread() {
    $('td[title="Agent"]').html("<span style='color:red'></span>Agent");
}

/*--------------------------To check Dates ---------------------------------------------- */
$("input[id^=ValidFrom]").change(function (e) {
    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    var validFrom = $(this).attr("id").replace("From", "Till");
    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    if (dfrom > dto) {
        var todaydate = new Date();
        validTodate.min(todaydate);
        validTodate.max(dto);
    }
    else {
        var todaydate = new Date();
        var validTodate = $("#ValidTill").data("kendoDatePicker");
        validTodate.min(dfrom);
    }


});
$("input[id^=ValidTill]").change(function (e) {
    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    var validFrom = $(this).attr("id").replace("Till", "From");
    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    if (dfrom > dto) {
        var todaydate = new Date();
        var validTodate = $("#ValidTill").data("kendoDatePicker");
        validTodate.min(validFrom);
        validTodate.max(dfrom);
    }
    else {
        var todaydate = new Date();
        var validTodate = $("#ValidFrom").data("kendoDatePicker");
        validTodate.min(todaydate);
        validTodate.max(dto);
    }

});
/*--------------------------To Check Dates---------------------------------------------- */

$("[id*=CodeType]").click(function () {
    var value = $('#CodeType:checked').val();
    if (value != 2) {
        //$("input[type='text'][name='_tempCodeNo']").hide();
        $("input[type='text'][name='_tempCodeNo']").closest('td').prev().find('span').hide();
        //$("input[type='text'][name='_tempCodeNo']").removeAttr('data-valid', 'required');
        $('td[title="Enter No of Codes."]').html("<span style='color:red'></span>");

        $("#NoofTransaction").attr('data-valid', 'required');
        //$('#SingleNoOfCodeUseByAgent').remove();       
        $('td[title="Enter No of Codes."]').html("<span style='color:red'>*</span>Number of Agent(s)");
        $("input[type='text'][name='CodeNo']").closest('td').prev().find('span').show();


        //$('#_tempCodeNo').parent().append('<div id="SingleNoOfCodeUseByAgent"><input id="NoOfCodeUseByAgent" name="NoOfCodeUseByAgent" controltype="decimal2" data-valid="required" data-valid-msg="No Of Transaction can not be blank"  class="k-formatted-value k-input" type="text" style="width: 120px; text-align: right;"maxlength="14" value="" data-role="numerictextbox"></div>')
        $('#CodeType').parent().parent().closest('tr').next('tr').show();
        //$('#_tempCodeNo').removeAttr('data-valid', "required");

        //---------------------------------
        if ($('#Text_AccountSNo').val() != "") {
            $("#_tempCodeNo").val('1');
            $("#_tempCodeNo").attr('disabled', true);
        }
        else {
            $("#_tempCodeNo").attr('disabled', false);
        }
    }
    else {
        $("#_tempCodeNo").attr('disabled', false);

        $('#NoOfCodeUseByAgent').removeAttr('data-valid', "required");
        $("#NoofTransaction").removeAttr('data-valid', 'required');
        $('#SingleNoOfCodeUseByAgent').remove();
        $("input[type='text'][name='_tempCodeNo']").show();
        $("input[type='text'][name='_tempCodeNo']").attr('data-valid', 'required');
        $('td[title="Enter No of Codes."]').html("<span style='color:red'>*</span>No of Codes.");
        $("input[type='text'][name='CodeNo']").closest('td').prev().find('span').show();
        $('#CodeType').parent().parent().closest('tr').next('tr').hide();
    }
});

function codegenerated() {
    if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
        CreateSpotCode();
        $('[id*="tblSpotCode_CompaignSpotCode_"]').each(function () {
            $(this).css("font-size", "1.2em");
        });

    }
}

function CreateSpotCode() {
    //divReference
    //var dbtableName = "SpotCode";
    //$("#tbl" + dbtableName).appendGrid({
    //    tableID: "tbl" + dbtableName,
    //    contentEditable: true,
    //    masterTableSNo: $("#hdnRateSNo").val() || 1,
    //    currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
    //    isGetRecord: true,
    //    servicePath: "./Services/Rate/SpotRateService.svc/",
    //    getRecordServiceMethod: "GetSpotCode",
    //    deleteServiceMethod: "",
    //    caption: "Generated Code",
    //    initRows: 1,
    //    columns: [
    //        { name: "SNo", type: "hidden" },
    //             { name: "CompaignSpotCode", display: "GeneratedCode", type: "label", ctrlAttr: { maxlength: 500, }, ctrlCss: { width: "350px", height: "40px" }, isRequired: false },
    //             { name: "Text_IsCodeUsed", display: "Status", type: "label" },
    //    ],
    //    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

    //    },
    //    isPaging: true,
    //    hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? true : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? true : true, removeLast: true }
    //});

}

function CreateRemarks() {
    var dbtableName = "Remarks";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnRateSNo").val() || 1,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/SpotRateService.svc/",
        getRecordServiceMethod: "GetRemarks",
        deleteServiceMethod: "",
        caption: "Remarks",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
                 { name: "Remarks", display: "Remark", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "textarea" : "label", ctrlAttr: { maxlength: 500, }, ctrlCss: { width: "350px", height: "40px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 { name: "CreatedBy", display: "Created By", type: "label" },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $('#tblRemarks_Remarks_' + addedRowIndex[0]).attr('required', 'required');
            if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                var len = $('#tblRemarks_rowOrder').val();
                for (var i = 1; i <= len.split(',').length - 1; i++) {
                    $('#tblRemarks_Remarks_' + i).attr('disabled', true);

                    $('input#tblRemarks_Remarks_' + i).css({ height: '25', border: 'none', background: '#daecf4', 'font-size': '1.3em ', 'font-family': 'cursive' });
                }
            }
            $('[id*="tblRemarks_Row_"]').each(function () {
                // $("#tblRemarks tr:eq(1)").find('td:first-child').hide();
                // $("#" + this.id).find('td:first-child').hide();
                $("#" + this.id).find('td:first-child').html('');
                $("#" + this.id).find('td:eq(2)').css("width", "53%");

            });

        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? true : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? true : true, removeLast: true }
    });
    $('#tblRemarks button.insert,#tblRemarks button.remove').hide();
    // Buttons at footer row
    $("#tblRemarks button.removeLast").hide();
    //$('#tblRemarks button.append,#tblRemarks button.removeLast').hide();
    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        //$('[id*="tblRemarks_Row_"]').each(function () {
        //    $('#' + this.id).remove();
        //});
        var len = $('#tblRemarks_rowOrder').val();
        for (var i = 1; i <= len.split(',').length - 1; i++) {
            $('#tblRemarks_Row_' + i).remove();
        }
    }
}

function CreateFlightInfoGrid() {

    var dbtableName = "FlightInfo";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        //masterTableSNo:1,// $("#hdnRateSNo").val(),
        masterTableSNo: $("#hdnRateSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/SpotRateService.svc",
        getRecordServiceMethod: "GetFlightInfo",
        deleteServiceMethod: "DeleteFlightTrans",
        caption: "Flight Information",
        initRows: 1,
        columns: [
                 { name: "SNo", type: "hidden" },
                 {
                     name: 'FlightOriginSNo', display: 'Flight Origin', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'SpotRate_AppendAirportCode', filterField: 'AirportCode', filterCriteria: "contains"
                 },
                 {
                     name: 'FlightDestinationSNo', display: 'Flight Destination', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'SpotRate_AppendDestination', filterField: 'AirportCode', filterCriteria: "contains"
                 },
                    {
                        name: 'FlightDate', display: 'Flight Date', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }
                    },
                   {
                       name: 'FlightNumSNo', display: 'Flight No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'SpotRate_AppendFlightNo', filterField: 'FlightNo', filterCriteria: "contains"
                   }

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                //if (getQueryStringValue("FormAction").toUpperCase() == "READ"){   
                var len = $('#tblFlightInfo_rowOrder').val();

                for (var i = 1; i <= len.split(',').length; i++) {
                    //$('#tblFlightInfo_FlightOriginSNo_' + i).attr('disabled', true);

                    $('#tblFlightInfo_FlightOriginSNo_' + (i)).data("kendoAutoComplete").enable(false);
                    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                        if ($('#tblFlightInfo_FlightOriginSNo_1').val() == "") {
                        }
                        else {
                            $('#tblFlightInfo_FlightOriginSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        }
                        $('#tblFlightInfo_FlightDestinationSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#tblFlightInfo_FlightNumSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#tblFlightInfo_FlightDate_' + i).data('kendoDatePicker').enable(false);
                    }
                    //if (userContext.GroupName != 'AGENT' && userContext.GroupName != 'GSA')
                    //if (Approve.includes(LoginType)) {
                    if (userContext.SpecialRights["SPOTAPPR"] == true) {
                        $('#tblFlightInfo_FlightDestinationSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#tblFlightInfo_FlightNumSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#tblFlightInfo_FlightDate_' + i).data('kendoDatePicker').enable(false);
                    }
                }
            }

            var uniqueindex;
            var prevrowuniqueindex;
            //  $('#tblFlightInfo').appendGrid('getRowOrder');
            uniqueindex = $('#tblFlightInfo').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
            prevrowuniqueindex = $('#tblFlightInfo').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                $('#tblFlightInfo_HdnFlightOriginSNo_' + uniqueindex).val($("#OriginCitySNo").val().split('-')[1]);
                //  $('#tblFlightInfo_HdnFlightOriginSNo_' + uniqueindex).attr('keyColumn')
                $('#tblFlightInfo_FlightOriginSNo_' + uniqueindex).val($("#OriginCitySNo").val().split('-')[2]);

                // $('#tblFlightInfo_FlightOriginSNo_' + (uniqueindex)).data("kendoAutoComplete").enable(false);
            }
            var Fdest = $('#tblFlightInfo_HdnFlightDestinationSNo_' + prevrowuniqueindex).val();
            var Fdesttxt = $('#tblFlightInfo_FlightDestinationSNo_' + prevrowuniqueindex).val();

            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                $('#tblFlightInfo_FlightOriginSNo_' + uniqueindex).data("kendoAutoComplete").enable(false);
            }
            //   $('#tblFlightInfo_FlightOriginSNo_' + uniqueindex).data("kendoAutoComplete").enable(false);

            // $('#tblFlightInfo_FlightOriginSNo_' + (uniqueindex)).data("kendoAutoComplete").enable(false);
            $('#tblFlightInfo_FlightDestinationSNo_' + (uniqueindex)).attr('required', 'required')

            if (uniqueindex > 1) {

                $('#tblFlightInfo_FlightOriginSNo_' + (uniqueindex)).val(Fdesttxt);
                $('#tblFlightInfo_HdnFlightOriginSNo_' + uniqueindex).val(Fdest);
            }
            if (addedRowIndex > 0) {
                var elem = $('#tblFlightInfo').appendGrid('getCellCtrl', 'FlightOriginSNo', prevrowuniqueindex);
            }


        },
        beforeRowAppend: function (caller, parentRowIndex, addedRowIndex) {
            var uniqueindex;
            var prevrowuniqueindex;
            uniqueindex = Math.abs(parentRowIndex + 1);
            // alert(uniqueindex);
            prevrowuniqueindex = $('#tblFlightInfo').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
            if (uniqueindex >= 2) {
                if ($('#tblFlightInfo_FlightDestinationSNo_' + (parentRowIndex)).val() == $('#Text_DestinationCitySNo').val().split('-')[0]) {
                    ShowMessage('warning', 'warning - FlightDestination', "Flight Destination can't have different from Destination ");
                    return false;
                }
                else { $('#tblFlightInfo').appendGrid('appendRow', 1); }
            }
            else { $('#tblFlightInfo').appendGrid('appendRow', 1); }
        },
        afterRowRemoved: function (caller, rowIndex) {

        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });
}

function CreateULDSlabGrid() {
    var dbtableName = "ULDRate";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnRateSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/SpotRateService.svc",
        getRecordServiceMethod: "GetULDRate",
        deleteServiceMethod: "DeleteUldTrans",
        caption: "ULD Rate Slab Information",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
             { name: "IsULDRate", type: "hidden" },
            {
                name: 'ULDSNo', display: 'ULD Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'SpotRate_ULDName', filterField: 'ULDName', filterCriteria: "contains"
            },
                 {
                     name: 'RateClassSNo', display: 'Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'SpotRate_RateClassCode', filterField: 'RateClassCode', filterCriteria: "contains"
                 },

                 { name: "Rate", display: "Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 18 }, isRequired: true, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
                { name: "RequestedRate", display: "Requested Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);",controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 18 }, isRequired: true, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
            pageType == "EDIT" || pageType == "READ" ? { name: "ApprovedRate", display: "ApprovedRate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);",controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 18 }, isRequired: true, ctrlCss: { width: "120px" }, isRequired: pageType == "EDIT" ? true : false } : { name: "ApprovedRate", type: "hidden" },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {


            //$("tr[id^='tblULDRate_Row']").each(function (row, tr) {
            //    $(tr).find("input[id^='tblULDRate_ULDSNo_']").attr("data-valid", "required");
            //    $(tr).find("input[id^='tblULDRate_ULDSNo_']").attr("data-valid-msg", "Rate can not be blank");
            //});


            var len = $('#tblULDRate_rowOrder').val();

            for (var i = 1; i <= len.split(',').length; i++) {

                if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                    $('#tblULDRate_ULDSNo_' + (i)).data("kendoAutoComplete").enable(false);
                    $('#tblULDRate_RateClassSNo_' + (i)).data("kendoAutoComplete").enable(false);
                    $("#chkUld").attr('disabled', true);

                }
                if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                    //$('[id^="tblULDRate_Rate_"]').attr('disabled', true);
                    $('[id^="tblULDRate_Rate_"]').attr('enable', true);
                }

                if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                    //if (userContext.GroupName != 'AGENT' && userContext.GroupName != 'GSA')
                    //if (Approve.includes(LoginType)) {
                    if (userContext.SpecialRights["SPOTAPPR"] == true) {
                        $('#tblULDRate_ULDSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#tblULDRate_RateClassSNo_' + (i)).data("kendoAutoComplete").enable(false);
                        $('#tblULDRate_Rate_' + (i)).attr('disabled', true);
                        $('#tblULDRate_RequestedRate_' + (i)).attr('disabled', true);
                        //$('#tblULDRate_ApprovedRate_' + (i)).attr('disabled', true);
                       
                        $('#tblULDRate_Delete_' + (i)).css('visibility', 'hidden')
                      
                    }
                }
            }
        },
        isPaging: true,
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

            var check = $('#tblULDRate_IsULDRate_1').val()
            if (check == '1') {
                $("#chkUld").attr('disabled', true);
                $("#chkUld").attr('checked', true);
                $("#divULDRate").show();
                $("#ApprovedRate,#_tempApprovedRate").removeAttr('data-valid');
                $("#ApprovedRate,#_tempApprovedRate").attr('disabled', true);


            }


        },
        
        //hideButtons: { updateAll: true, insert: true, removeLast: true },
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
        
    });

}

$('input[name="operation"]').unbind("click").click(function (e) {
     
    checkRequired();
    if (userContext.SysSetting["ICMSEnvironment"].toUpperCase() == "GA")
    {
         $("#Pieces,#_tempPieces").removeAttr('data-valid');
    }
    else {
        $("#Pieces,#_tempPieces").attr('data-valid','required');
    }
    var ULDRate = $("#chkUld").is(":checked") == false ? 0 : 1
    if (ULDRate == 0) {
        $('#SectorRate').attr('data-valid', 'required');
        $('#RequestedRate').attr('data-valid', 'required');
        }
    else {
        $("#_tempSectorRate,#SectorRate,#RequestedRate,#_tempRequestedRate").removeAttr('data-valid')

    }
  
    if (getQueryStringValue("FormAction").toUpperCase() != "DELETE") {
        var sectionId = "divRemarks";
        cfi.ValidateSubmitSection();
        if (cfi.IsValidSubmitSection(sectionId)) {
            if (cfi.IsValidSubmitSection()) {
                var count = 0;
                var em;
                $('[id*="tblRemarks_rowOrder"]').each(function () {
                    var el = $('#tblRemarks_rowOrder').val().split(',').length;
                    em = $('#tblRemarks_Remarks_' + (el)).val();
                });
                var elem = $('#tblRemarks_Remarks_9').val();
                if (em == "") {
                    console.log("NR");
                }
                else {

                    e.preventDefault();
                    SaveRateAirlineMaster();
                    // });
                    //   }

                    //  });
                }
            }
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        DeleteSpotRate();
    }
});



function DeleteSpotRate() {

    if ($('#hdnRateSNo').val() != '') {
        $.ajax({
            url: "Services/Rate/SpotRateService.svc/DeleteSpotRateRequest", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: parseInt($("#hdnRateSNo").val()) }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (JSON.parse(result).Table0.length > 0 && JSON.parse(result) != undefined) {
                    if (JSON.parse(result).Table0[0].Column1 == "2000") {
                        setTimeout(function () {
                            navigateUrl('Default.cshtml?Module=Rate&Apps=SpotRate&FormAction=INDEXVIEW');
                        }, 1000);
                        ShowMessage('success', 'Success - Spot Rate', "Spot Rate Details Successfully Deleted !", "bottom-right");

                    }
                }
            }
        });
    }
}



function SaveRateAirlineMaster() {
    // $("#btnSaveRateMaster").hide();
    //if (!cfi.IsValidSubmitSection)
    //{
    //    return false;
    //}
    var RequestType = $('#RateAdhocType:checked').val();

    if (RequestType == 0 || RequestType == 1) {
        if ($('input[type="radio"][name="AgentGroup"]:checked').val() == 0) {
            if ($('#Text_AccountSNo').val() == "") {
                ShowMessage('warning', 'warning - Spot Rate', "Agent can not be blank");
                return;
            }
        }
        else {
            if ($('#Text_AccountGroupSNo').val() == "") {
                ShowMessage('warning', 'warning - Spot Rate', "Agent Group can not be blank");
                return;
            }
        }
    }
    else if (RequestType == 2) {
        //if ($('#Text_AccountSNo').val() != "") {

        //}
    }



    $('input[type="submit"][value=Save]').attr('disabled', true);
    $('#MasterSaveAndNew').attr('disabled', true);
    $('input[type="submit"][value=Update]').attr('disabled', true);
    var RateRemarksarray = [];
    var RateFlightInfoarray = [];
    var RateULDSLABInfoArray = [];


    var compaignType;

    if ($('#CampaignType:checked').length == 2)
        compaignType = 3;
    else if ($('#CampaignType:checked').val() == 1)
        compaignType = 1;
    else if ($('#CampaignType:checked').val() == 2)
        compaignType = 2;
    else
        compaignType = 0;


    var RateViewModel = {
        SNo: parseInt($("#hdnRateSNo").val()) || 0,
        AirlineSNo: parseInt($("#AirlineSNo").val()) || 0,
        AWBTypeSNo: parseInt($("#AWBTypeSNo").val()) || 0,
        AWBcode: $("#AWBCode").val(),
        AWBSNo: $('#AWBNo').val(),
        //AWBSNo: AWBcode + "-" + AWBNo,
        RateAdhocType: parseInt($("input[name=RateAdhocType]:checked").val()) || 0,
        OriginCitySNo: parseInt($("#OriginCitySNo").val().split('-')[0]) || 0,
        DestinationCitySNo: parseInt($("#DestinationCitySNo").val()) || 0,
        OfficeSNo: parseInt($("#OfficeSNo").val()) || 0,
        AccountSNo: $("#AccountSNo").val() || 0,
        ProductSNo: parseInt($("#ProductSNo").val()) || 0,
        CommoditySNo: parseInt($("#CommoditySNo").val()) || 0,
        Pieces: parseInt($("#Pieces").val()) || 0,
        ValidFrom: $("#ValidFrom").val(),
        ValidTill: $("#ValidTill").val(),
        Reference: $("#Reference").val(),
        WeightType: parseInt($("input[name=WeightType]:checked").val()) || 0,
        GrossWeight: $("#GrossWeight").val() || 0,
        PlusVarainceGrossPercentage: parseInt($("#PlusVarainceGrossPercentage").val() == "" ? 0 : parseInt($("#PlusVarainceGrossPercentage").val())),
        MinusVarainceGrossPercentage: parseInt($("#MinusVarainceGrossPercentage").val() == "" ? 0 : parseInt($("#MinusVarainceGrossPercentage").val())),
        VolumeUnit: parseInt($("input[name=VolumeUnit]:checked").val()) || 0,
        Volume: $("#Volume").val() || 0,
        PlusVarainceVolumePercentage: parseInt($("#PlusVarainceVolumePercentage").val() == "" ? 0 : parseInt($("#PlusVarainceVolumePercentage").val())),
        MinusVarainceVolumePercentage: parseInt($("#MinusVarainceVolumePercentage").val() == "" ? 0 : parseInt($("#MinusVarainceVolumePercentage").val())),
        ChargeableWeight: $("#ChargeableWeight").val() || 0,
        SectorRate: $("#SectorRate").val() || 0,
        RequestedRate: $("#RequestedRate").val() || 0,
        CurrencySNo: $("#CurrencySNo").val() || 0,
        BasedOnSNo: $("#BasedOnSNo").val() || 0,
        AllInRate: $("#AllInRate").prop('checked') == true ? 1 : 0,
        SHCSNo: $("#SHCSNo").val(),
        IsCommissionable: $("#IsCommissionable").prop('checked') == true ? 1 : 0,
        ActionType: getQueryStringValue("FormAction").toUpperCase(),
        ApprovedRate: $("#ApprovedRate").val() || 0,
        IsApproved: parseInt($("input[name=IsApproved]:checked").val()) || 0,
        CodeType: $("input[name=CodeType]:checked").val() || 0,
        CodeNo: $("#_tempCodeNo").val() || 0,
        CampaignType: compaignType,
        IsSingleCompaignCode: $("input[name=CodeType]:checked").val() || 0,
        NoofCompaignAgentTransaction: $('#_tempCodeNo').val() || 0,
        NoofTransaction: $('#_tempNoofTransaction').val() || 0,
    }

    $("tr[id^='tblRemarks_Row']").each(function (row, tr) {
        var RateRemarksViewModel = {
            //   SNo: $("#tblRemarks_SNo_").val() || 0,
            SNo: $(tr).find("input[id^='tblRemarks_SNo_']").val() || 0,
            RateAirlineAdhocRequestSNo: parseInt($("#hdnRateSNo").val()) || 0,
            Remarks: $(tr).find("input[id^='tblRemarks_Remarks_']").val()
        }
        RateRemarksarray.push(RateRemarksViewModel);

    });


    //var tblFlightInfo = $("#tblFlightInfo").serializeToJSON();
    $("tr[id^='tblFlightInfo_Row']").each(function (row, tr) {
        var RateFlightViewModel = {
            SNo: $(tr).find("input[id^='tblFlightInfo_SNo_']").val() || 0,
            //SNo: $("#tblFlightInfo_SNo_").val() || 0,
            SpotRateSNo: $("#hdnRateSNo").val() || 0,
            HdnFlightOriginSNo: $(tr).find("input[id^='tblFlightInfo_HdnFlightOriginSNo_']").val() || 0,
            FlightOriginSNo: $(tr).find("input[id^='tblFlightInfo_FlightOriginSNo_']").val() || 0,
            HdnFlightDestinationSNo: $(tr).find("input[id^='tblFlightInfo_HdnFlightDestinationSNo_']").val() || 0,
            FlightDestinationSNo: $(tr).find("input[id^='tblFlightInfo_HdnFlightDestinationSNo_']").val() || 0,
            HdnFlightNumSNo: $(tr).find("input[id^='tblFlightInfo_HdnFlightNumSNo_']").val() || 0,
            FlightNumSNo: $(tr).find("input[id^='tblFlightInfo_HdnFlightNumSNo_']").val() || 0,
            FlightDate: $(tr).find("input[id^='tblFlightInfo_FlightDate_']").val()
        }
        RateFlightInfoarray.push(RateFlightViewModel);
    });

    $("tr[id^='tblULDRate_Row']").each(function (row, tr) {
        var RateULDSLABViewModel = {
            // SNo: $("#tblULDRate_HdnULDSNo_").val() || 0,
            SNo: $(tr).find("input[id^='tblULDRate_SNo_']").val() || 0,
            ULDSNo: $(tr).find("input[id^='tblULDRate_HdnULDSNo_']").val() || 0,
            HdnULDSNo: $(tr).find("input[id^='tblULDRate_HdnULDSNo_']").val() || 0,
            //SlabSNo: 0,
            SpotRateSNo: $("#hdnRateSNo").val() || 0,
            //  SlabName: $(tr).find("input[id^='tblULDRate_SLABName_']").val(),
            RateClassSNo: $(tr).find("input[id^='tblULDRate_HdnRateClassSNo_']").val() || 0,
            Text_RateClassSNo: "",
            // StartWt: $(tr).find("input[id^='tblULDRate_StartWt_']").val(),
            //EndWt: 0,
            Rate: $(tr).find("input[id^='_temptblULDRate_Rate_']").val() || 0,
            HdnRateClassSNo: $(tr).find("input[id^='tblULDRate_HdnRateClassSNo_']").val() || 0,
            RequestedRate: $(tr).find("input[id^='_temptblULDRate_RequestedRate_']").val() || 0,
            ApprovedRate: $(tr).find("input[id^='_temptblULDRate_ApprovedRate_']").val() || 0,
            // Based: 0,
        }
        RateULDSLABInfoArray.push(RateULDSLABViewModel);
    });
    //-----Added on 24 aug 2018 by Shatrughan Gupta
    $("tr[id^='tblULDRate_Row']").each(function (row, tr) {
        var ApprovedRate = $(tr).find("input[id^='_temptblULDRate_ApprovedRate_']").val();
        if (parseInt(ApprovedRate) <= 0) {
            ShowMessage('warning', 'warning - Rate', "Approve Rate Cannot be Zero ", "bottom-right");
            $(tr).find("input[id^='_temptblULDRate_ApprovedRate_']").val() = '';
            $(tr).find("input[id^='_temptblULDRate_ApprovedRate_']").focus();
            return;
        }
    });
    //------------------------------------
    var ApproveType = Approve;
    var IsFlatRate=0
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
    {
        IsFlatRate = $("#IsFlatRate").prop('checked') == true ? 1 : 0
    }
    else
    {
        IsFlatRate= $("#chkFlatRate").prop('checked') == true ? 1 : 0
    }
    var IsWeiveDueCarrierCharges = 0
    IsWeiveDueCarrierCharges = $("#chkDueCarrierCV").prop('checked')==true?1:0
//---end
    

    $.ajax({
        url: "Services/Rate/SpotRateService.svc/SaveSpotRateDetais", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ SNo: parseInt($("#hdnRateSNo").val()) || 1, SpotRate: RateViewModel, spotRateRemarks: RateRemarksarray, SpotRateFlightInfo: RateFlightInfoarray, SpotRateULDSLABInfoArray: RateULDSLABInfoArray, ApproveType: ApproveType, IsAgentGroup: $('input[type="radio"][name="AgentGroup"]:checked').val(), AccountGroupSNo: $('#AccountGroupSNo').val(), DiscountedPercentage: $('#txtServiceDiscount').val() == "" || $('#txtServiceDiscount').val() == 'NaN' ? "0" : $('#txtServiceDiscount').val(), SurchargePercentage: $('#txtSurchargeDiscount').val() == "" ? "0" : $('#txtSurchargeDiscount').val(), ApprovedDiscountedPercentage: $('#txtApprovedServiceDiscount').val() == "" ? "0" : $('#txtApprovedServiceDiscount').val(), ApprovedSurchargePercentage: $('#txtApprovedSurchargeDiscount').val() == "" ? "0" : $('#txtApprovedSurchargeDiscount').val(), isFlatRate: IsFlatRate, IsWeiveDueCarrierCharges: IsWeiveDueCarrierCharges }),
        //data: JSON.stringify({ RateSNo: parseInt($("#hdnRateSNo").val()) || 1, SpotRate: RateViewModel }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                setTimeout(function () {
                    navigateUrl('Default.cshtml?Module=Rate&Apps=SpotRate&FormAction=INDEXVIEW');
                }, 2000);
                ShowMessage('success', 'Success - Spot Rate', "Spot Rate Details Successfully Saved", "bottom-right");
                // setTimeout(, 10000);

            }
            if (result.split('?')[0] == "1000") {
                setTimeout(function () {
                    // ShowMessage('success', 'Success - SpotRate', "SpotRate Details Successfully Updated", "bottom-right");
                    navigateUrl('Default.cshtml?Module=Rate&Apps=SpotRate&FormAction=INDEXVIEW');
                }, 1000);
                ShowMessage('success', 'Success - Spot Rate', "Spot Rate Details Successfully Updated", "bottom-right");
                // navigateUrl('Default.cshtml?Module=Rate&Apps=SpotRate&FormAction=INDEXVIEW');
                // setTimeout(, 10000);

            }
            else if (result.split('?')[0] == "1024") {
                setTimeout('', 5000);
                ShowMessage('warning', 'warning - UldType', "For ULD 'AKE' Uld type must have Minimum and ULD devices");

            }
            else if (result.split('?')[0] == "1004") {
                setTimeout(function () {
                    // ShowMessage('success', 'Success - SpotRate', "SpotRate Details Successfully Updated", "bottom-right");
                    navigateUrl('Default.cshtml?Module=Rate&Apps=SpotRate&FormAction=INDEXVIEW');
                }, 1000);
                ShowMessage('warning', 'warning - Spot Rate', "Spot Rate already used.");

            }
            else if (result.split('?')[0] == "1005") {
                setTimeout('', 1000);
                ShowMessage('warning', 'warning - Spot Rate', "Spot request for this AWB already exist, Please reject the old request in order to proceed with new request");

            }

            //else {
            //    ShowMessage('warning', 'warning - SpotRate', "unable to process", "bottom-right");
            //    $("#btnSaveRateMaster").show();
            //}

        }
    });


}

var popup = "<table id='window'class='appendGrid ui-widget'><tr><th>Reference No.</th><th>Org</th><th>Dest</th><th>Gr.Wt</th><th>Volume</th><th>Charg.Wt</th><th>Product</th><th>Rate Type</th><th>Slab</th><th>Rate</th><th>Freight</th></tr><tr id='IsRecord'><td><label id='lblReferenceNo'></label><td><label id='lblorigin'></label></td><td><label id='lbldest'></label></td><td><label id='lblgrwt'></label></td><td><label id='lblvlwt'></label></td><td><label id='lblchargwt'></label></td><td><label id='lblproduct'></label></td><td><label id='lblratetype'></label></td><td><label id='lblslab'></label></td><td><label id='lblrate'></label></td><td><label id='lblfrrate'></label></td></tr></table>";

$("input[type='button'][value='View Rate']").click(function () {
    //  alert('1');
    // $('#window').show();
   
    var ULDRate = $("#chkUld").is(":checked") == false ? 0 : 1
    var flag = 0;
    if (ULDRate == 1) {
        var sectionId = "divULDRate";
        cfi.IsValidSubmitSection(sectionId);
    }
    if (userContext.SysSetting["ICMSEnvironment"].toUpperCase() == "GA") {
        $("#Pieces,#_tempPieces").removeAttr('data-valid');
    }
    else {
        $("#Pieces,#_tempPieces").attr('data-valid','required');
    }
    $('#SectorRate ,#RequestedRate').removeAttr('data-valid');
    $('input[type=checkbox][name=CampaignType]').removeAttr('data-valid', "required");
    //$('#_tempRequestedRate ,#_tempSectorRate').removeClass("valid_invalid", "bVErrMsgContainer");
    if (cfi.IsValidSubmitSection()) {
        $("#def").remove();
        var Modeldata = {

            Text_OriginCitySNo: $("#Text_OriginCitySNo").val().split('-')[0] || 0,
            Text_DestinationCitySNo: $("#Text_DestinationCitySNo").val().split('-')[0] || 0,
            ValidFrom: $("#ValidFrom").val(),
            AirlineSNo: parseInt($("#AirlineSNo").val()) || 0,
            OfficeSNo: parseInt($("#OfficeSNo").val()) || 0,
            Reference: $("#Reference").val(),
            AccountSNo: parseInt($("#AccountSNo").val()) || 0,
            ProductSNo: parseInt($("#ProductSNo").val()) || 0,
            CommoditySNo: parseInt($("#CommoditySNo").val()) || 0,
            Pieces: parseInt($("#Pieces").val()) || 0,
            CurrencySNo: $("#CurrencySNo").val(),
            WeightType: parseInt($("input[name=WeightType]:checked").val()) || 0,
            GrossWeight: $("#GrossWeight").val() || 0,
            VolumeUnit: parseInt($("input[name=VolumeUnit]:checked").val()) || 0,
            Volume: $("#Volume").val() || 0,
            ChargeableWeight: $("#ChargeableWeight").val() || 0,
            SHCSNo: $("#SHCSNo").val(),

            //ValidFrom: $("#tblFlightInfo_FlightDate_1").val(),
        }
        var ULDRate = $("#chkUld").is(":checked") == false ? 0 : 1
        // --------  For Uld rate-----------------------
        var ULDNo = "";
        $("table tr input[id^='tblULDRate_ULDSNo_']").each(function () {
            ULDNo = $(this).val() + ',' + ULDNo
        })
        ULDNo.slice(0, -1);
        $.ajax({
            url: "Services/Rate/SpotRateService.svc/ViewRate",
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ spotRate: Modeldata, ULDRate: ULDRate, ULDNo: ULDNo }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result != undefined) {
                    if (result.substring(1, 2) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.length > 0 && ULDRate == 0) {
                            
                             $('#tbl').append(popup);
                            $('#window th').addClass('ui-widget-header');
                            $('#window td').addClass('ui-widget-content');
                            $('#window td').css("text-align", "center");
                            $('#lblReferenceNo').text(myData[0].BookingRefNo);

                            $('#lblorigin').text($('#Text_OriginCitySNo').val());
                            $('#lbldest').text($('#Text_DestinationCitySNo').val());
                            $('#lblgrwt').text($('#GrossWeight').val());
                            $('#lblvlwt').text($('#Volume').val());
                            $('#lblchargwt').text($('#ChargeableWeight').val());
                            $('#lblproduct').text($('#Text_ProductSNo').val());
                            $('#lblratetype').text(myData[0].RateTypeName);
                            $('#lblslab').text(myData[0].SlabName);
                            $('#lblrate').text(myData[0].Rate);
                            $('#lblfrrate').text(myData[0].FinalRate);
                            $('#_tempSectorRate ,#SectorRate').val(myData[0].Rate);
                            $('#_tempSectorRate ,#SectorRate').attr("readonly", "readonly");

                            $('#Text_BasedOnSNo').val(myData[0].RateTypeName);
                            $('#Text_BasedOnSNo').data("kendoAutoComplete").enable(false);
                            $('#BasedOnSNo').val(myData[0].RateTypeSNo)
                        }
                        else if (myData.length > 0 && ULDRate == 1) {
                       
                            $("#def").remove();
                            var divuld = "<div id = 'def'></div>"
                            $('#tbl').append(divuld);
                            var uldpopup = "";
                            uldpopup = "<table id='window'class='appendGrid ui-widget'><tr><th>ULD Type</th><th>Type</th><th>Rate</tr>";
                            var rowno = myData.length - $('#tblULDRate_rowOrder').val().split(',').length < 0 ? myData.length : myData.length - $('#tblULDRate_rowOrder').val().split(',').length
                            $('#tblULDRate').appendGrid('appendRow', rowno);
                            for (var i in myData) {
                                uldpopup = uldpopup + "<tr>" + "<th>" + myData[i].ULDNAME + "</th>" + "<th>" + myData[i].UldRateClass + "</th>" + "<th>" + (parseFloat(myData[i].MinimumRate) > 0 ? myData[i].MinimumRate : myData[i].overpivotrate) + "</th></tr>"
                                var uniqueIndex = $('#tblULDRate').appendGrid('getUniqueIndex', i);
                                $("#tblULDRate_ULDSNo_" + uniqueIndex).val(myData[i].ULDNAME)
                                $("#tblULDRate_HdnULDSNo_" + uniqueIndex).val(myData[i].ULDSNO)
                                $("#tblULDRate_RateClassSNo_" + uniqueIndex).val(myData[i].RateClassCode)
                                $("#tblULDRate_HdnRateClassSNo_" + uniqueIndex).val(myData[i].RateSlabType)
                                $("#tblULDRate_Rate_" + uniqueIndex).val((parseFloat(myData[i].MinimumRate) > 0 ? myData[i].MinimumRate : myData[i].overpivotrate))
                                $("#_temptblULDRate_Rate_" + uniqueIndex).val((parseFloat(myData[i].MinimumRate) > 0 ? myData[i].MinimumRate : myData[i].overpivotrate))
                            }
                            uldpopup = uldpopup + "</table>"
                            $("#def").append(uldpopup);
                            $('#window th').addClass('ui-widget-header');
                            $('#window td').addClass('ui-widget-content');
                            $('#window td').css("text-align", "center");
                            flag= 1

                    }

                    else {
                            var NotFoundMessage = "<tr><td colspan='10' style='color:red'><center>No Record Found !</center><td></tr>"
                             if ($("#window").length < 1) {
                            $('#tbl').append(popup);
                            $('#window th').addClass('ui-widget-header');
                            $('#window td').addClass('ui-widget-content');
                            $('#window td').css("text-align", "center");
                        }
                        $('#IsRecord').hide();
                       
                        $('#window').append(NotFoundMessage);

                    }

                    }
                    else {
                        var NotFoundMessage = "<tr><td colspan='10' style='color:red'><center>No Record Found !</center><td></tr>"
                        if ($("#window").length < 1) {
                            $('#tbl').append(popup);
                            $('#window th').addClass('ui-widget-header');
                            $('#window td').addClass('ui-widget-content');
                            $('#window td').css("text-align", "center");
                        }
                        $('#IsRecord').hide();
                       
                        $('#window').append(NotFoundMessage);

                    }
                    var abc = flag == 0 ? 'window' : "def"
                   
                    cfi.PopUp(abc, "View Rate");
                }
            }
        });
    }
});


$('#Pieces').blur(function () {
    if (userContext.SysSetting["ICMSEnvironment"].toUpperCase() != "GA") {
        if ($('#Pieces').val() == "" || $('#Pieces').val() == 0) {
            ShowMessage('info', 'Warning-Pieces', "Pieces Value Cann't be Zero or Empty");
            $('#Pieces').val('');

        }
        ClearRates();
    }  
});

$('#AWBNo').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        $('input[name = GetAWBbtn]').click();
        return false;
    }
});























//-----------------------------------------------------------------------------




var AWBInformation = "<div id='window' style='height: 400px;'><fieldset> " +
  "<legend>AWB Information :</legend><table id='AWBInformationwindow' style='Margin-top: 10px;Margin-bottom: 10px;    height: auto;' class='appendGrid ui-widget'> " +
    "<tr><th>AWB No</th><th style='width: 100px;'><label id='lblAWBNo'></th>" +
     "<th>Origin</th><th style='width: 100px;'><label id='lblOrigin'></th>" +
    "<th>Destination</th><th style='width: 100px;'><label id='lblDestination'></th>" +
    "<th>Pieces</th><th style='width: 100px;'><label id='lblPieces'></th>" +
    "</tr><tr>" +
    "<th>Gr. Weight</th><th style='width: 100px;'><label id='lblGrossWeight'></th>" +
    "<th>Volume</th><th style='width: 100px;'><label id='lblVolume'></th>" +
    "<th>Ch. Weight</th><th style='width: 100px;'><label id='lblChargableWeight'></th>" +
    "<th>Product</th><th style='width: 100px;'><label id='lblProduct'></th>" +
    "</tr><tr>" +
    "<th>Commodity</th><th style='width: 100px;'><label id='lblCommodity'></th>" +

    "<th>Nature Of Goods</th><th><label id='lblNatureOfGoods'></th>" +
     "<th></th><th style='width: 100px;'><label id=''></th>" +
      "<th></th><th style='width: 100px;'><label id=''></th></tr>" +
    "</table></fieldset> " +

  "<fieldset><legend>Rate Information :</legend><table id='RateInformationwindow' style='Margin-top: 10px;Margin-bottom: 10px;height: auto;' class='appendGrid ui-widget'> " +
    "<tr><th style='width: 200px;'>Rate</th><th style='width: 200px;'><label id='lblRate'></th>" +
    "<th style='width: 200px;'>Freight Amount</th><th style='width: 200px;'><label id='lblFreightAmount'></th></tr>" +
    "</table></fieldset> " +

  "<fieldset><legend>Code Information :</legend>" +
  "<input type='radio' name='CodeInformation' onchange='BindSpotCode(this.id)'  id='SpotCode' value='0'>Spot Code <input type='radio' name='CodeInformation' onchange='BindCampaignCode(this.id)' id='CampaignCode' value='1'>Campaign Code </input>" +

  "<div id='BindSpotCode' style='float: right;width: 500px;'></div></fieldset>" +

  "<div style='Margin-top: 10px;Margin-bottom: 10px;height: auto;'><input type='button' class='btn btn-success' id='BtnAppliedCode' style='width:120px;' value='Applied Code' /></div></div>";





$("input[type='button'][value='View Spot Details']").click(function () {

    $('#SectorRate ,#RequestedRate').removeAttr('data-valid');
    //$('#_tempRequestedRate ,#_tempSectorRate').removeClass("valid_invalid", "bVErrMsgContainer");
    if (cfi.IsValidSubmitSection()) {
        $('#tbl').append(AWBInformation);
        $('#window th').addClass('ui-widget-header');
        $('#window td').addClass('ui-widget-content');
        $('#window td').css("text-align", "center");
        var Modeldata = {
            AWBSNo: $("#Text_OriginCitySNo").val().split('-')[0] || 0
        }
        $.ajax({
            url: "Services/Rate/SpotRateService.svc/GetAWbForSpotRate",
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ spotRate: Modeldata }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result != undefined) {
                    if (result.substring(1, 2) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.length > 0) {
                            $('#lblAWBNo').text(myData[0].AWBNo);
                            $('#lblOrigin').text(myData[0].Text_OriginCitySNo);
                            $('#lblDestination').text(myData[0].Text_DestinationCitySNo);
                            $('#lblPieces').text(myData[0].TotalPieces);

                            $('#lblGrossWeight').text(myData[0].TotalGrossWeight);
                            $('#lblVolume').text(myData[0].TotalCBM);
                            $('#lblChargableWeight').text(myData[0].TotalChargeableWeight);
                            $('#lblProduct').text(myData[0].ProductName);

                            $('#lblCommodity').text(myData[0].CommodityDescription);
                            $('#lblNatureOfGoods').text(myData[0].NatureOfGoods);


                            $('#lblRate').val(myData[0].MKTRate);
                            $('#lblFreightAmount').val(myData[0].MKTFreight);




                        }

                    }
                    else {
                        var NotFoundMessage = "<tr><td colspan='10' style='color:red'><center>No Record Found !</center><td></tr>"
                        $('#IsRecord').hide();
                        $('#window').append(NotFoundMessage);

                    }

                    cfi.PopUp("window", "View Spot Details");
                    $('div.k-window').css('width', '950px');
                    $('div.k-window').css('margin-left', '80.611px ! important');
                }
            }
        });
    }
});



var popupViewCode = "<div id='windowGeneratedCode'></div>";
//Generated Code</td><td><input type='hidden'  name='CampaignGeneratedCodeSNo' id='CampaignGeneratedCodeSNo'><input type='text' name='Text_CampaignGeneratedCodeSNo'  id='Text_CampaignGeneratedCodeSNo' style='text-transform: uppercase;' controltype='autocomplete' data-role='autocomplete' autocomplete='off'><input type='text' name='Text_CampaignSingleCodeSNo' class='k-input' autofocus= 'autofocus' id='Text_CampaignSingleCodeSNo' style='text-transform: uppercase;width:190px;'/>

function ViewGeneratedCode() {

    var value = $('#CodeType:checked').val();
    $('#popupViewCodetbl').remove();

    //if (cfi.IsValidSubmitSection()) {
    $('#tbl').append(popupViewCode);
    $('#window th').addClass('ui-widget-header');
    $('#window td').addClass('ui-widget-content');
    $('#window td').css("text-align", "center");
    var Modeldata = {
        HdnPageSNo: HdnPageSNo || 0,
        IsSingleCompaignCode: value
    }

    $.ajax({
        url: "Services/Rate/SpotRateService.svc/GetGeneratedCode",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ spotRate: Modeldata }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result != undefined) {
                //if (result.substring(1, 2) == "{") {

                var str = "<table id='popupViewCodetbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>Generated Code</th></tr></thead>";
                var Code = jQuery.parseJSON(result);

                if (value == 2) {

                    if (Code.length > 0) {
                        for (var i = 0; i < Code.length; i++) {
                            str += " <tbody><tr>";
                            if (Code[i].CompaignSpotCode != "") {
                                str += "<td>" + Code[i].CompaignSpotCode + "</td>";
                            }
                            else {
                                str += "<td>No Code Found !</td>";
                            }
                            str += "</tr></tbody>";
                        }
                    }
                    else {
                        str += " <tbody><tr>";
                        str += "<td>No Code Found !</td>";
                        str += "</tr></tbody>";
                    }

                }
                else if (value == 1) {

                    str += " <tbody><tr>";
                    if (Code[0].CompaignSingleCode != "") {
                        str += "<td>" + Code[0].CompaignSingleCode + "</td>";
                    }
                    else {
                        str += "<td>No Code Found !</td>";
                    }
                    //str += "<td>" + Code[0].CompaignSingleCode + "</td>";
                    str += "</tr></tbody>";
                }

                str += "</table>";
                $('#windowGeneratedCode').append(str);
                //$('div.k-window').css('margin-left', '80.611px ! important');
            }
            cfi.PopUp("windowGeneratedCode", "View Generated Code");
            $('div.k-window').css('width', '350px');
        }
    });
    //}
}



function BindSpotCode(Elem) {
    if (document.getElementById(Elem).checked) {
        //$('#BindSpotCode').remove(SpotCode);
        $('#BindSpotCode').html('');
        $('#BindSpotCode').append("<input type='hidden'  name='SpotCodeSNo' id='SpotCodeSNo'><input type='text' name='Text_SpotCodeSNo'  id='Text_SpotCodeSNo' style='text-transform: uppercase;' controltype='autocomplete' data-role='autocomplete' autocomplete='off'>");


        //----------------------Convert cfi.AutoComplete in V2

        cfi.AutoCompleteV2("SpotCodeSNo", "SpotCode", "SpotRate_SpotCode", null, "contains");

        $('.k-dropdown-wrap').css('width', '170px');
    } else {
        //$('#ccTopp').removeAttr("disabled");
        //alert('againclick');

    }
}



function BindCampaignCode(Elem) {
    if (document.getElementById(Elem).checked) {
        //$('#BindSpotCode').remove(SpotCode);
        $('#BindSpotCode').html('');
        $('#BindSpotCode').append("<input type='text' name='Text_CampaignCode' class='k-input' autofocus= 'autofocus' id='Text_CampaignCode' style='text-transform: uppercase;width:190px;'/> ");

    } else {
        //$('#ccTopp').removeAttr("disabled");
        //alert('againclick');

    }
}

function checkRequired() {
    if ($('#tblULDRate_rowOrder').val() != '') {
        $("[id*='tblULDRate_RateClassSNo_']").attr('data-valid', "required");
        $("[id*='tblULDRate_RateClassSNo_']").attr('data-valid-msg', "Cannot be blank");
        $("[id*='tblULDRate_RateClassSNo_']").addClass('k-input k-state-default valid_invalid');

        $("[id*='tblULDRate_ULDSNo_']").attr('data-valid', "required");
        $("[id*='tblULDRate_ULDSNo_']").attr('data-valid-msg', "Cannot be blank");
        $("[id*='tblULDRate_ULDSNo_']").addClass('k-input k-state-default valid_invalid');



        //$("[id*='_temptblULDRate_Rate_']").attr('data-valid', "required");
        //$("[id*='_temptblULDRate_Rate_']").attr('data-valid-msg', "Cannot be blank");
        //$("[id*='_temptblULDRate_Rate_']").addClass('k-input k-state-default valid_invalid');

        $("[id*='_temptblULDRate_ApprovedRate_']").attr('data-valid', "required");
        $("[id*='_temptblULDRate_ApprovedRate_']").attr('data-valid-msg', "Cannot be blank");
        $("[id*='_temptblULDRate_ApprovedRate_']").addClass('k-input k-state-default valid_invalid');

        $("[id*='_temptblULDRate_RequestedRate_']").attr('data-valid', "required");
        $("[id*='_temptblULDRate_RequestedRate_']").attr('data-valid-msg', "Cannot be blank");
        $("[id*='_temptblULDRate_RequestedRate_']").addClass('k-input k-state-default valid_invalid');
    }
    if ($('#tblFlightInfo_rowOrder').val() != '') {
        $("[id*='tblFlightInfo_FlightDestinationSNo_']").attr('data-valid', "required");
        $("[id*='tblFlightInfo_FlightDestinationSNo_']").attr('data-valid-msg', "Cannot be blank");
        $("[id*='tblFlightInfo_FlightDestinationSNo_']").addClass('k-input k-state-default valid_invalid');

        $("[id*='tblFlightInfo_FlightNumSNo_']").attr('data-valid', "required");
        $("[id*='tblFlightInfo_FlightNumSNo_']").attr('data-valid-msg', "Cannot be blank");
        $("[id*='tblFlightInfo_FlightNumSNo_']").addClass('k-input k-state-default valid_invalid');

        $("[id*='tblFlightInfo_FlightDate_']").attr('data-valid', "required");
        $("[id*='tblFlightInfo_FlightDate_']").attr('data-valid-msg', "Cannot be blank");
        $("[id*='tblFlightInfo_FlightDate_']").addClass('k-input k-state-default valid_invalid');
    }
}





function ClearRates() {

    $('#_tempSectorRate').val('');
    $('#_tempRequestedRate').val('');
    $('#SectorRate').val('');
    $('#RequestedRate').val('');
    $('input[type="button"][value=View Rate]').attr('disabled', false);
}















$('input[name=CampaignType][value=2],input[name=CampaignType][value=1], input[name=RateAdhocType][value=2]').change(function () {
    GetDestination();
});

function GetDestination() {
    $('#DestinationCitySNo').val('');
    $('#Text_DestinationCitySNo').val('');

    if ($('#OriginCitySNo').val() != '') {
        $.ajax({
            url: "Services/Rate/SpotRateService.svc/GetDestination", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CitySNo: $('#OriginCitySNo').val().split('-')[0] }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                CoutrySNo = JSON.parse(result).Table0[0].CountrySNo;
            }
        });
    }
}


function GetroundValue(numbervalue, precision) {
    var multiplier = Math.pow(10, precision || 0);
    if (userContext.SysSetting.IsRoundValue == "1") {
        if (parseFloat(numbervalue) > 0 && parseFloat(numbervalue) < 1)
            return 1;
        else
            return Math.round(parseFloat(parseFloat(numbervalue).toFixed(0)) * multiplier) / multiplier;
    }
    else {
        var Decimalnumbervalue = numbervalue.toString().split('.')[1] || 0;
        var Returnnumbervalue = "";
        Decimalnumbervalue = '.' + Decimalnumbervalue;
        if (parseFloat(Decimalnumbervalue) > .5)
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + 1
        else if (parseFloat(Decimalnumbervalue) == .0)
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + 0
        else
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + .5


        return Math.round(parseFloat(Returnnumbervalue) * multiplier) / multiplier;
    }
}

function abc() {
    if ($("#chkUld").is(":checked") == true) {
        //   CreateULDSlabGrid();
        $("#divULDRate").show();
        //$("#Pieces,#GrossWeight,#ChargeableWeight,#SectorRate,#RequestedRate,#Volume,#_tempPieces").
        //$("#Pieces,#GrossWeight,#ChargeableWeight,#SectorRate,#RequestedRate,#Volume,#_tempPieces").attr('disabled', true);
        $("#SectorRate,#RequestedRate,#ApprovedRate,#_tempApprovedRate").removeAttr('data-valid');
        $("#SectorRate,#RequestedRate,#ApprovedRate,#_tempApprovedRate").attr('disabled', true);

    }
    else{
        $("#divULDRate").hide();
        //$("#Pieces,#GrossWeight,#ChargeableWeight,#SectorRate,#RequestedRate,#Volume,#_tempPieces").attr('data-valid', 'required');
        //$("#Pieces,#GrossWeight,#ChargeableWeight,#SectorRate,#RequestedRate,#Volume,#_tempPieces").attr('disabled', false);
        $("#SectorRate,#RequestedRate,#ApprovedRate,#_tempApprovedRate").attr('data-valid', 'required');
        $("#SectorRate,#RequestedRate,#ApprovedRate,#_tempApprovedRate").attr('disabled', false);
    }
}

function InActiveSpotRate(id) {
    $("#popupInActiveCodetbl").remove();
    $("#windowInActiveCode").remove();
    var InActiveCode = "<div id='windowInActiveCode'></div>";
    var str = "<table id='popupInActiveCodetbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>Are you sure, you want to mark this Spot Code as Inactive ?</th></tr></thead><tbody>"
    str = str + "<tr><td style='height:38px'><right><input type = 'button' id='btnYes' value='Yes' onclick='inactiveCode(" + id + ");' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'> <input type = 'button' id='btnNo' value='No' onclick='dialogClose(" + id + ");' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'></right></td></tr> </tbody></table>";
    $('#tbl').append(InActiveCode);
    $('#window th').addClass('ui-widget-header');
    $('#window td').addClass('ui-widget-content');
    $('#window td').css("text-align", "center");
    $('#windowInActiveCode').append(str)
    cfi.PopUp("windowInActiveCode", "Spot Rate");
    $('div.k-window').css('width', '350px');
    //$("#windowInActiveCode").dialog({
    //    resizable: false,
    //    modal: false,
    //    title: "Do You Want To In-Active Spot Rate",
    //    height: 70,
    //    width: 400,
    //    buttons: {
    //        "Yes": function () {
    //            $("#windowInActiveCode").dialog('close');

    //        },
    //        "No": function () {
    //            $("#windowInActiveCode").dialog('close');

    //        }
    //    }
    //});
}
function inactiveCode(id) {
    $.ajax({
        url: "Services/Rate/SpotRateService.svc/InActiveSpotRate",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ id: id }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var Code = jQuery.parseJSON(result);
            var Heading = Code.Table0[0].Error
            if (Heading == "1") {
                $("#windowInActiveCode").data("kendoWindow").close();
                navigateUrl('Default.cshtml?Module=Rate&Apps=SpotRate&FormAction=INDEXVIEW');
                ShowMessage('success', 'success - Spot Rate', "Spot Rate Updated Successfully");


            }
            else {
                ShowMessage('warning', 'warning - Spot Rate', "Unable To Update Spot Rate");
                ShowMessage('success', 'success - Spot Rate', "Spot Rate Updated Successfully");
            }
        }
    });

}
function dialogClose(id) {
    $("#windowInActiveCode").data("kendoWindow").close();
}
function isFlatRate() {
    var value = $('#RateAdhocType:checked').val();
    if (value == 2)
        {
        if ($("#chkFlatRate").is(":checked") == true) {
            $('#ratePercentage').remove();
        }
        else {
            $('#SectorRate').parent().append('<div id="ratePercentage" style="float:left;margin-left: 300px;vertical-align:top">%</div>');

        }
    }

}
//Added by Shatrughana Gupta on 24 aug 2018
function CheckValueValidation(input)
{
    var CurrentRowVal = $("#" + input).val();
    if (parseInt(CurrentRowVal)<=0)
    {
        ShowMessage('warning', 'warning - Rate', "Rate Cannot be Zero ", "bottom-right");
        $("#" + input).val("");
    }
}
