
$(document).ready(function () {
    if (userContext.AllowedUserCreation == "NO") {
        ShowMessage('info', 'Info  -   Users !', ' You are not authorized to create Users.');
        return;

    }
    $('#ShowAsAgreedonAWBPrint').hide();
    $('#spnShowAsAgreedonAWBPrint').hide();
    $('#Text_ShowAsAgreedonAWBPrint').hide();
    //var usertypelist = [{ Key: "0", Text: "Airline" }, { Key: "1", Text: "Agent" }, { Key: "2", Text: "GSA" }, { Key: "3", Text: "GHA/CTO" }, { Key: "4", Text: "GSSA" }, { Key: "5", Text: "POS-CSC" }, { Key: "6", Text: "POS-KSO" }]
    //cfi.AutoCompleteByDataSource("UserTypeSNo", usertypelist, userTypeBind);
    var UserCreation = [{ Key: "1", Text: "YES" }, { Key: "0", Text: "NO" }]
    cfi.AutoCompleteByDataSource("IsAllowedUserCreation", UserCreation, null);
    cfi.AutoCompleteV2("UserTypeSNo", "UserTypeName", "Users_UserTypeName", userTypeBind, "contains");
    cfi.AutoCompleteV2("EmployeeID", "Name", "Users_Employee", null, "contains");
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Users_Airline", ClearAgentNoffice, "contains");//Added by Shatrughana Gupta on 10-02-2017 
    cfi.AutoCompleteV2("Agent", "Name", "Users_Agent", GetMaxUsers, "contains", null, null, null, null, SetOtherAirline); //Added by Shatrughana Gupta
    cfi.ValidateForm(); 

    cfi.AutoCompleteV2("Designation", "Name", "Users_Designation", null, "contains");
    cfi.AutoCompleteV2("Terminal", "TerminalName", "Users_Terminal", null, "contains", null, null, null, null, nchange);
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Users_City", null, "contains", null, null, null, null, GetCityData);
    cfi.AutoCompleteV2("MobileCountryCode", "ISDCode", "Users_ISDCode", readOnlyfield, "contains");
    cfi.AutoCompleteV2("AirportSNo", "AirportCode,AirportName", "Users_Airport", null, "contains", null, null, null, null, RemoveField);
   
    cfi.AutoCompleteV2("Products", "ProductName", "User_otherproduct", null, "contains", ",", null, null, null);
    cfi.BindMultiValue("Products", $("#Text_Products").val(), $("#Products").val());

/*
    // changes by arman ali for binding others airport
    if ($('#Text_UserTypeSNo').val() == "") {
        $('#MLIsCityChangeAllowed').attr('disabled', true);
        $('#OtherAirlineAccess').attr('disabled', true);
       
    }
    else {
        $('#MLIsCityChangeAllowed').attr('disabled', false);
        $('#OtherAirlineAccess').attr('disabled', false);
       
    }
*/
    cfi.AutoCompleteV2("AllowCitySNo", "AirportCode", "Users_Airport", null, "contains", ",", null, null, null, RemoveRequired);
    cfi.AutoCompleteV2("OtherAirline", "CarrierCode,AirlineName", "Users_OtherAirline", null, "contains", ",", null, null, null, RemoveRequired);
    //  cfi.AutoComplete("OtherAirline", "CarrierCode", "v_Airline_NonInternal", "SNo", "CarrierCode", null, RemoveRequired, "contains", ",");// commented by arman ali
    //  bind multi
    cfi.BindMultiValue("AllowCitySNo", $("#Text_AllowCitySNo").val(), $("#AllowCitySNo").val());
    cfi.BindMultiValue("OtherAirline", $("#Text_OtherAirline").val(), $("#OtherAirline").val());
    cfi.AutoCompleteV2("GroupSNo", "GroupName", "Users_Groups", CountRestUsers, "contains", null, null, null, null, OnAdminChange);
    cfi.AutoCompleteV2("NameSNo", "WeighingScaleID,Name", "Users_WeighingScale", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "Name", "Users_Office", null, "contains", null, null, null, null, ClearAgent);

    

    // by arman 2017-05-16 : hide weighing scale td
    $('#spnNameSNo').closest('td').contents().hide();
    $('#Text_NameSNo').closest('td').contents().hide();
    $('#spnNameSNo').closest('td').attr('title', '');// Added by devendra 03 August 2018 for removing title of weighing scale td
    //= end
    var GrpName = userContext.GroupName.toUpperCase();
    //******************************************************************NEW MODE******************************//
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        //  alert("1");

        if (userContext.SysSetting.IsSpecialInvoiceDisabled.toUpperCase() == "TRUE")
        {
            $('input[id=IsSpecialInvoice][value=1]').prop("checked", true);
            $('#IsSpecialInvoice').attr('disabled', true)
            
            $("#Text_Terminal").data("kendoAutoComplete").enable(true);
            $("#Text_Designation").data("kendoAutoComplete").enable(false);
        }
      
               //The Below Condition is Added by Shivam so that to enable and disable the group email id based on the system setting------------

        if (userContext.SysSetting.EnableGroupEmailId.toUpperCase() == "TRUE") {
            $("#GroupEMailID").attr("enabled", "enabled");
        }
        else {
            $("#GroupEMailID").attr("disabled", "disabled");
        }
//-------------------------------------------------------------------------------------------------------------------------------------------------------


        // by arman ali date 2017-05-16 : disable designation tab
        //if (GrpName != "SUPER ADMIN") {
        //    $('#spnIsAllowedUserCreation').hide()
        //    $('#spnIsAllowedUserCreation').closest('td').attr('title', ''); // Added by devendra 03 August 2018 for removing title
        //    $("#Text_IsAllowedUserCreation").closest('span').hide()
        //}

        if (userContext.SysSetting.ICMSEnvironment == "JT") {
            if (userContext.SpecialRights['USCR'])
        {
                $('#spnIsAllowedUserCreation').show()
                $('#spnIsAllowedUserCreation').closest('td').attr('title', ''); // Added by devendra 03 August 2018 for removing title
                $("#Text_IsAllowedUserCreation").closest('span').show()
            }

            else
            {
                $('#spnIsAllowedUserCreation').hide()
                $('#spnIsAllowedUserCreation').closest('td').attr('title', ''); // Added by devendra 03 August 2018 for removing title
                $("#Text_IsAllowedUserCreation").closest('span').hide()
            }
        }

        else
        {
            if (GrpName != "SUPER ADMIN") {
                $('#spnIsAllowedUserCreation').hide()
                $('#spnIsAllowedUserCreation').closest('td').attr('title', ''); // Added by devendra 03 August 2018 for removing title
                $("#Text_IsAllowedUserCreation").closest('span').hide()
            }
        }
    }
 if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('#UserName').val('')
        var txt = $('#hdnLo').parent().find('script').text().indexOf("User ID Already Exists") > 0 ? $('#hdnLo').parent().find('script').text() : "";
        if (txt.indexOf("User ID Already Exists") < 0) {
            userTypeBind();
            //$('input[id=IsSpecialInvoice][value=1]').prop("checked", true);
            //$('#IsActive').attr('disabled', true);
            if (userContext.SysSetting.IsSpecialInvoiceDisabled.toUpperCase() == "TRUE") {
                $('#IsSpecialInvoice').attr('disabled', true)
                $('input[id=IsSpecialInvoice][value=1]').prop("checked", true);
            }
           
          
            $('input:radio[name="IsActive"]').filter('[value="1"]').attr('checked', true);
            $("#UserExpiaryDate").data("kendoDatePicker").value(getDateNextYear());

            var uname = userContext.UserName;
            $.ajax({
                url: "Services/Permissions/UsersService.svc/Get_Default_Airline?Uname=" + uname, type: "get", async: false, dataType: "json", cache: false,
                //url: "Services/Permissions/UsersService.svc/Get_Default_Airline?Uname=" + uname, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    //var resData = Data.Table0;
                    //if (Data[0] > 0) {

                    $("#Airline").val(Data[0].SNo);
                    $("#Text_Airline").val(Data[0].CarrierCode + '-' + Data[0].AirlineName);

                    $("#CitySNo").val(Data[0].CitySNo);
                    $("#Text_CitySNo").val(Data[0].CityCode + '-' + Data[0].CityName);

                    $("#AirportSNo").val(Data[0].AirPortSNo);
                    $("#Text_AirportSNo").val(Data[0].AirportCode + '-' + Data[0].AirportName);
                    //}

                }
            });

            if ($('#UserName').val() == "")
                $('input[data-radioval="Self"]').click();
            //========default city name according to login city Date : 2017-09-13=============================

            $("#CitySNo").val(userContext.CitySNo);
            $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);
            $("#AirportSNo").val(userContext.AirportSNo);
            $("#Text_AirportSNo").val(userContext.AirportCode + '-' + userContext.AirportName);
          }
       
    }

    // changes by arman ali for binding others airport
    if ($('#Text_UserTypeSNo').val() == "") {
        $('#MLIsCityChangeAllowed').attr('disabled', true);
        $('#OtherAirlineAccess').attr('disabled', true);

    }
     else {
        $('#MLIsCityChangeAllowed').attr('disabled', false);
        $('#OtherAirlineAccess').attr('disabled', false);

    }

   
    //******************************************************************NEW MODE END******************************//
    $('input[name="operation"]').click(function (e) {
        // $("input[name='operation']").unbind("click").click(function () {
        var userType = $("input[name=UserTypeSNo]:radio:checked").val();
       
        if (userType == "0") {
            $('#Text_UserTypeValue').removeAttr('data-valid-msg');
            $('#Text_UserTypeValue').attr('data-valid-msg', 'Select Airline.');
        }
        else if (userType == "1") {
            $('#Text_UserTypeValue').removeAttr('data-valid-msg');
            $('#Text_UserTypeValue').attr('data-valid-msg', 'Select Agent.');
        }
        else {
            $('#Text_UserTypeValue').removeAttr('data-valid-msg');
            $('#Text_UserTypeValue').attr('data-valid-msg', 'Select Employee.');
        }

        if (cfi.IsValidSubmitSection()) {
            dirtyForm.isDirty = false;//to track the changes
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }

            //debugger
            //var SKeyValue = "";
            //var FormAction = "";
            //var KeyValue = "";
            //var TerminalSNo = "";
            //var TerminalName = "";
            //var KeyColumn = "Users";
            //FormAction = getQueryStringValue("FormAction").toUpperCase();
            //KeyValue = document.getElementById('__SpanHeader__').innerText;
            //TerminalSNo = userContext.TerminalSNo;
            //TerminalName = userContext.NewTerminalName;
            //Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName);


            return true;
        }
        else {
            return false
        }
    });

    $('#Mobile').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
    });

    //$('#spn').closest('td').attr('title', 'Enter Password');


    $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").each(function () {
        $(this).click(function () {
            if ($(this).val() == "1") {
                var closestTr = $('#AllowCitySNo').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTr.find($("#spnAllowCitySNo")).hide();
                closestTr.find($("#Text_AllowCitySNo")).hide();
                closestTr.find($("#divMultiAllowCitySNo")).hide();
                //closestTr.find("td:eq(2) span").hide();
                closestTr.find($("#Text_AllowCitySNo")).parent().hide();
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').hide();
                $("#AllowCitySNo").val('');
                $("#Text_AllowCitySNo").val('');
                $('#divMultiAllowCitySNo ul li span').not('span[id="FieldKeyValuesAllowCitySNo"]').click();
                $("#divMultiAllowCitySNo").find('ul >li').each(function (i) {
                    if (i > 0) {
                        $("#Multi_AllowCitySNo").val('');
                        $('span[id*=FieldKeyValuesAllowCitySNo]')[0].Content = '';
                        $("#divMultiAllowCitySNo").find('ul >li').eq(1).remove();
                    }
                });
            }
            else {
                var closestTr = $('#AllowCitySNo').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
                closestTr.find($("#spnAllowCitySNo")).show();
                closestTr.find($("#Text_AllowCitySNo")).show();
                closestTr.find($("#divMultiAllowCitySNo")).show();
                //closestTr.find("td:eq(1) span").show();
                closestTr.find($("#Text_AllowCitySNo")).parent().show();
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').show();
            }
        });
    });

    $(this).find("input[type='radio'][id^='OtherAirlineAccess']").each(function () {
        $(this).click(function () {
            if ($(this).val() == "1") {
                var closestTrA = $('#OtherAirline').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTrA.find($("#spnOtherAirline")).hide();
                closestTrA.find($("#Text_OtherAirline")).hide();
                closestTrA.find($("#divMultiOtherAirline")).hide();
                //closestTr.find("td:eq(1) span").hide();
                closestTrA.find($("#Text_OtherAirline")).parent().hide();
                $('input:text[id^=Text_OtherAirline]').val('')
                var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
                closestHA.find('td font').hide();
                $("#OtherAirline").val('');
                $("#Text_OtherAirline").val('');
                $('#divMultiOtherAirline ul li span').not('span[id="FieldKeyValuesOtherAirline"]').click();
                //$("#divMultiOtherAirline").find('ul >li').each(function (i) {
                //    if (i > 0) {
                //        $("#Multi_OtherAirline").val('');
                //        $('span[id*=FieldKeyValuesOtherAirline]')[0].Content = '';
                //        $("#divMultiOtherAirline").find('ul >li').eq(1).remove();
                //    }
                //});
            }
            else {
                var closestTrA = $('#OtherAirline').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTrA.find($("#spnOtherAirline")).show();
                closestTrA.find($("#Text_OtherAirline")).show();
                closestTrA.find($("#divMultiOtherAirline")).show();
                //closestTr.find("td:eq(1) span").hide();
                closestTrA.find($("#Text_OtherAirline")).parent().show();
                $('input:text[id^=Text_OtherAirline]').val('')
                var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
                closestHA.find('td font').show();
                //$("#divMultiOtherAirline").find('ul >li').each(function (i) {
                //    if (i > 0) {
                //        $("#Multi_OtherAirline").val('');
                //        $('span[id*=FieldKeyValuesOtherAirline]')[0].textContent = '';
                //        $("#divMultiOtherAirline").find('ul >li').eq(1).remove();
                //    }
                //});

            }
        });
    });
   

    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
        $('#ShowPassword').css('display', 'none');
    }
    //==========================Add By:Pradeep Sharma=============================== 
    OnAdminChange();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //$('input[id=IsSpecialInvoice][value=1]').prop("checked", true);
        $('input[id=OtherAirlineAccess][value=1]').prop("checked", true);
        $(this).find("input[type='radio'][id^='OtherAirlineAccess']").each(function () {
            if ($('input:radio[name=OtherAirlineAccess]:checked').val() == "1") {
                //$('span#spnOtherAirline').hide();
                //$("#Text_OtherAirline").parent().parent().hide();
                var closestTrA = $('#OtherAirline').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTrA.find($("#spnOtherAirline")).hide();
                closestTrA.find($("#Text_OtherAirline")).hide();
                closestTrA.find($("#divMultiOtherAirline")).hide();
                //closestTr.find("td:eq(1) span").hide();
                closestTrA.find($("#Text_OtherAirline")).parent().hide();
                $('input:text[id^=Text_OtherAirline]').val('')
                var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
                closestHA.find('td font').hide();
            }
            else {
                //$('span#spnOtherAirline').show();
                //$("#Text_OtherAirline").parent().parent().show();
                var closestTrA = $('#OtherAirline').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTrA.find($("#spnOtherAirline")).show();
                closestTrA.find($("#Text_OtherAirline")).show();
                closestTrA.find($("#divMultiOtherAirline")).show();
                //closestTr.find("td:eq(1) span").hide();
                closestTrA.find($("#Text_OtherAirline")).parent().show();
                $('input:text[id^=Text_OtherAirline]').val('')
                var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
                closestHA.find('td font').show();
            }
        });
       
        //The Below Condition is Added by Shivam so that to enable and disable the group email id based on the system setting------------
        if (userContext.SysSetting.EnableGroupEmailId.toUpperCase() == "TRUE") {
            $("#GroupEMailID").attr("enabled", "enabled");
        }
        else {
            $("#GroupEMailID").attr("disabled", "disabled");
        }
                                                  

        //$("#Text_Terminal").data("kendoAutoComplete").enable(false);
        //$("#Text_Designation").data("kendoAutoComplete").enable(false);
        $('input[id=MLIsCityChangeAllowed][value=1]').prop("checked", true);
        $('input:radio[id^=IsCityChangeAllowed]:eq(1)').attr("checked", "checked");
        $('#MobileCountryCode').closest('td').find('.k-combobox ').css('width', '70px');
        if ($('#MobileCountryCode').val() == "")
            $('#Mobile').attr('readOnly', 'readOnly');
        // $('#Phone').attr('onblur', 'checkMobileCountryCode(this.value);');
        $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").each(function () {
            if ($('input:radio[name=MLIsCityChangeAllowed]:checked').val() == "1") {
                var closestTr = $('#AllowCitySNo').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTr.find($("#spnAllowCitySNo")).hide();
                closestTr.find($("#Text_AllowCitySNo")).hide();
                closestTr.find($("#divMultiAllowCitySNo")).hide();
                //closestTr.find("td:eq(1) span").hide();
                closestTr.find($("#Text_AllowCitySNo")).parent().hide();
                $('input:text[id^=Text_AllowCitySNo]').val('')
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').hide();
            }
            else {
                var closestTr = $('#AllowCitySNo').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
                closestTr.find($("#spnAllowCitySNo")).show();
                closestTr.find($("#Text_AllowCitySNo")).show();
                closestTr.find($("#divMultiAllowCitySNo")).show();
                //closestTr.find("td:eq(1) span").show();
                closestTr.find($("#Text_AllowCitySNo")).parent().show();
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').show();
            }
        });
        //$('#UserName').attr("autocomplete", "off");
        //setTimeout('$("#UserName").val("");', 20);
        //$('#Password').attr("autocomplete", "off");
        //setTimeout('$("#Password").val("");', 20);

        /*        Added by DEVENDRA       */ 
       $('input[id=Otherproducts][value=1]').prop("checked", true);
      //$('input[id=Otherproducts]').click(function () {
      //    var tg = $('input[id=Otherproducts]:checked').val();
      //      productaccesschange();
      //  });
       //if (GrpName != "SUPER ADMIN") {
       //    $('#IsAllowedUserCreation').closest("tr").remove();
       //} else {
       //    $('#IsAllowedUserCreation').val('0')
       //    $('#Text_IsAllowedUserCreation').val('NO')
       //}
       if (userContext.SysSetting.ICMSEnvironment == "JT") {
           if (userContext.SpecialRights['USCR']) {

               $('#IsAllowedUserCreation').closest("tr").show();
           } else {
               $('#IsAllowedUserCreation').val('0')
               $('#Text_IsAllowedUserCreation').val('NO')
           }
       }
       else
       {
           if (GrpName != "SUPER ADMIN") {
               $('#IsAllowedUserCreation').closest("tr").remove();
           } else {
               $('#IsAllowedUserCreation').val('0')
               $('#Text_IsAllowedUserCreation').val('NO')
           }
       }
    
    }
    //=======================================Update Case =========================================================
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if ($('#IsOtherproducts').val() == "NO") {          
            $('#spnProducts').hide();
        }
          //if (GrpName != "SUPER ADMIN") {
        
          //  $('#Text_IsAllowedUserCreation').hide();
          //  $('#spnIsAllowedUserCreation').hide();
          //}
        if (userContext.SysSetting.ICMSEnvironment == "JT") {
            if (userContext.SpecialRights['USCR']) {

                $('#Text_IsAllowedUserCreation').show();
                $('#spnIsAllowedUserCreation').show();
            }
            else {
                $('#Text_IsAllowedUserCreation').hide();
                $('#spnIsAllowedUserCreation').hide();
            }
        }

        else
        {
            if (GrpName != "SUPER ADMIN") {
        
                  $('#Text_IsAllowedUserCreation').hide();
                  $('#spnIsAllowedUserCreation').hide();
                }

        }
        if ($('#UserTypeText').val().toUpperCase() == "AIRLINE") {

            var closestTr = $('span#spnOfficeSNo').closest("tr");
            closestTr.hide();
            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.show();

            $('span#spnEmployeeID').show();
            //$("#Text_EmployeeID").parent().parent().show();
            //if ($('#IsOtherproducts').val() == "NO") {
            //    $('#spnProducts').hide();
            //}
            if ($('#OtherAirlineAccess').val() == "NO") {
                var closestTrA = $('span#spnOtherAirline').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTrA.find($('span#spnOtherAirline')).hide();
                closestTrA.find($("#OtherAirline")).hide();
                closestTrA.find($("#divMultiOtherAirline")).hide();
                //closestTr.find("td:eq(1) span").hide();

                closestTrA.find($("#Text_OtherAirline")).parent().parent().hide();
                $('input:text[id^=Text_OtherAirline]').val('')
                var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
                closestHA.find('td font').hide();

                $("#divMultiOtherAirline").find('ul >li').each(function (i) {
                    if (i > 0) {
                        $("#Multi_OtherAirline").val('');
                        $('span[id*=FieldKeyValuesOtherAirline]')[0].Content = '';
                        $("#divMultiOtherAirline").find('ul >li').eq(1).remove();
                    }
                });
                //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
            }
            else {
                var closestTrA = $('#OtherAirline').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTrA.find($("#spnOtherAirline")).show();
                closestTrA.find($("#Text_OtherAirline")).show();
                closestTrA.find($("#divMultiOtherAirline")).show();
                //closestTr.find("td:eq(1) span").hide();
                closestTrA.find($("#Text_OtherAirline")).parent().parent().show();
                $('input:text[id^=Text_OtherAirline]').val('')
                var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
                closestHA.find('td font').show();
                //$("#divMultiAllowCitySNo").find('ul >li').each(function (i) {
                //    if (i > 0) {
                //        $("#Multi_AllowCitySNo").val('');
                //        $('span[id*=FieldKeyValuesAllowCitySNo]')[0].textContent = '';
                //        $("#divMultiAllowCitySNo").find('ul >li').eq(1);
                //    }
                //});
                DivReset();
                cfi.AutoCompleteV2("OtherAirline", "CarrierCode,AirlineName", "Users_OtherAirline", RemoveRequired, "contains", ",");
            }
            $("#Text_OfficeSNo").removeAttr('data-valid');
            $('td[title="Airline"]').text("Airline");
            $("#Airline").removeAttr('data-valid');
            $('td[title="Select Agent"]').text("");
            //$('span#spnAgent').hide();  
            //$("#Text_Agent").parent().parent().hide();
            $("#Text_Agent").removeAttr('data-valid');
            $("#Text_AirportSNo").removeAttr('data-valid');
            $('td[title="Select Airport Name"]').text("Airport Name");
            //closestTr.find($("#spnOfficeSNo")).hide();
            //closestTr.find($("#Text_OfficeSNo")).hide();
        }
        else if ($("#Text_UserTypeSNo").val() != undefined && $("#Text_UserTypeSNo").val().toUpperCase() == "AGENT") {
            //  $('span#spnEmployeeID').hide();
            //  $("#Text_EmployeeID").parent().parent().hide();
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.show();
            //var closestTrr = $('#spnMLIsCityChangeAllowed').closest("tr");
            //closestTrr.show();

            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.show();
            $('span#spnAgent').show();
            // $('td[title="Select Agent"]').text("Agent");
            $("#Text_Agent").parent().parent().show();
            $("#Text_Agent").attr('data-valid', 'required');

            $("#Text_AirportSNo").removeAttr('data-valid');
            //   $('td[title="Select Airport Name"]').text("Airport Name");
            $("#Text_OfficeSNo").attr('data-valid', 'required');

            $("#Text_Agent").attr('data-valid', 'required');
            DivReset();
        }
        else if ($("#Text_UserTypeSNo").val()!=undefined && ($("#Text_UserTypeSNo").val().toUpperCase() == "GSA" || $("#Text_UserTypeSNo").val().toUpperCase() == "GSSA")) {
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.show();
            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.show();
            $('span#spnEmployeeID').hide();
            $("#Text_EmployeeID").parent().parent().hide();
            $("#Text_AirportSNo").attr('data-valid', 'required');
            $("#Text_OfficeSNo").attr('data-valid', 'required');
            //  $('td[title="Select Agent"]').text("");
            $('span#spnAgent').hide();
            $("#Text_Agent").parent().parent().hide();
            $("#Text_Agent").removeAttr('data-valid');
            DivReset();
            cfi.AutoCompleteV2("OtherAirline", "CarrierCode,AirlineName", "Users_OtherAirline", RemoveRequired, "contains", ",");
        }
        else {
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.show();




            //*********************** 
            if ($('#OtherAirlineAccess').val() == "NO") {
                var closestTrA = $('span#spnOtherAirline').closest("tr");
                closestTrA.find($('span#spnOtherAirline')).hide();
                closestTrA.find($("#OtherAirline")).hide();
                closestTrA.find($("#divMultiOtherAirline")).hide();
                //closestTr.find("td:eq(1) span").hide();
                closestTrA.find($("#Text_OtherAirline")).parent().parent().hide();
                $('input:text[id^=Text_OtherAirline]').val('')
                var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
                closestHA.find('td font').hide();
                $("#divMultiOtherAirline").find('ul >li').each(function (i) {
                    if (i > 0) {
                        $("#Multi_OtherAirline").val('');
                        $('span[id*=FieldKeyValuesOtherAirline]')[0].Content = '';
                        $("#divMultiOtherAirline").find('ul >li').eq(1).remove();
                    }
                });
                //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
                var closestTrr = $('#OtherAirlineAccess').closest("tr");
                closestTrr.hide();
            }
            else {
                var closestTrr = $('#OtherAirlineAccess').closest("tr");
                closestTrr.show();
            }
            //**************************

            DivReset();
            //    $('span#spnEmployeeID').hide();
            //    $("#Text_EmployeeID").parent().parent().hide();
            ///   $('td[title="Airline"]').text("Airline");
            $("#Text_AirportSNo").attr('data-valid', 'required');
            $('td[title="Select Office Name"]').text("GHA Name");
            $("#Text_OfficeSNo").attr('data-valid', 'required');
            $('span#spnOfficeSNo').show();
            $("#Text_OfficeSNo").parent().parent().show();

            //     $('td[title="Agent"]').text("");
            //      $('span#spnAgent').hide();
            //   $("#Text_Agent").parent().parent().hide();
            $("#Text_Agent").removeAttr('data-valid');
            cfi.ResetAutoComplete("OtherAirline");
            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_Associated", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ","); //Commented By Shatrughana Gupta
            cfi.AutoCompleteV2("OtherAirline", "CarrierCode,AirlineName", "Users_OtherAirline", RemoveRequired, "contains", ",");
            //Added By Shatrughana Gupta
        }
        $('.floatingHeader').css('display', 'none');
        if ($('#UserTypeText').val().toUpperCase() == "AIRLINE")
            $("span#spnText_UserTypeValue").text('Airline');
        else if ($('#UserTypeText').val().toUpperCase() == "AGENT")
            $("span#spnText_UserTypeValue").text('Agent');
        else
            $("span#spnText_UserTypeValue").text('Employee ID');
        // Changes by vkumar task #38
        if ($("#UserTypeText").val().toUpperCase() == "FORWARDER (AGENT)") {
            $("span#spnOfficeSNo").text('GSA Name');
        }
        else {
            $("span#spnOfficeSNo").text('Office Name');
        }
        //Ends
    }
    if ((getQueryStringValue("FormAction").toUpperCase() == "READ")) {
        if ($('#Text_GroupSNo').val() == "ADMIN") {
            //$("#spnCompanyName").hide();
        }
        if ($("#CityChangeAllowed").val() == "NO") {
            $("#spnMultipleCity").hide();
        }
        var closestTr = $('input:text[id^=Company]').closest('tr');
        closestTr.find('td').hide();
        $('input:text[id^=Company]').removeAttr('data-valid');
        $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").each(function () {
            if ($(this).val() == "1") {
                var closestTr = $('#AllowCitySNo').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTr.find($("#spnAllowCitySNo")).hide();
                closestTr.find($("#Text_AllowCitySNo")).hide();
                closestTr.find($("#Text_AllowCitySNo")).hide();
                closestTr.find($("#divMultiAllowCitySNo")).hide();
                closestTr.find($("#Text_AllowCitySNo")).parent().hide();
                // closestTr.find("td:eq(1) span").hide()
                $('input:text[id^=Text_AllowCitySNo]').val('')
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').hide();
            }
            if ($(this).val() == "1") {
                var closestTr = $('#AllowCitySNo').closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
                closestTr.find($("#spnAllowCitySNo")).show();
                closestTr.find($("#Text_AllowCitySNo")).show();
                closestTr.find($("#divMultiAllowCitySNo")).show();
                closestTr.find($("#Text_AllowCitySNo")).parent().show();
                //closestTr.find("td:eq(1) span").show()
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').show();
            }
        });
        // Changes by vkumar task #38
        if ($("#UserTypeText").val().toUpperCase() == "FORWARDER (AGENT)") {
            $("span#spnOfficeSNo").text('GSA Name');
        }
        else {
            $("span#spnOfficeSNo").text('Office Name');
        }
        //Ends
    }
   
    if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")&& userContext.GroupName.toUpperCase() == "AGENT") {
        setdropdownEdit();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" && userContext.GroupName.toUpperCase() == "AGENT") {
        SetDropDownValues();
    }
    $('input[id=Otherproducts]').click(function () {
        var tg = $('input[id=Otherproducts]:checked').val();
        productaccesschange();
    });
    if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT")) {
        var UType = $('#Text_UserTypeSNo').val().toUpperCase();
        if (UType == "AGENT") {
            $('#Text_Agent').data("kendoAutoComplete").enable(false);
            $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);

        }
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                $('input:radio[name=IsBlock]').attr("disabled", true);
            } //ankit kumar for disable the block in case of edit
        
        $('#Remarks').val('');
    var ASNo = userContext.AgentSNo || 0;
    var GName = $('#Text_GroupSNo').val();
    if (GName != "" || GName != undefined) {
        CheckMultiCityAccess(GName, ASNo);
    }

        //added by ankit kumar
    if ($('#Text_GroupSNo').val() == "GSA") {
        $('#MLIsCityChangeAllowed').attr('disabled', false);
    }
    }
});

var isAllAirports;
var otherAirportAccess='';

function ClearAgent()
{
        $('#Agent').val('');
        $('#Text_Agent').val('');
        $("#divMultiOtherAirline").closest('td').find('[class="k-icon k-delete"]').click();
    //=============added by ankit kumar=============
        $.ajax({
            url: "../Schedule/GetAirports",
            async: true,
            type: "POST",
            dataType: "json",
            success: function (result) {
                if (result[0] != undefined && result[0] != null) {
                    isAllAirports = parseInt(result[0].IsAll);
                    if(isAllAirports != 1)
                        otherAirportAccess = result[0].Airports;
                    
                }
            }
        })


}

function ClearAgentNoffice() {
    $('#Agent').val('');
    $('#Text_Agent').val('');
    $('#OfficeSNo').val('');
    $('#Text_OfficeSNo').val('');
    $("#divMultiOtherAirline").closest('td').find('[class="k-icon k-delete"]').click();
}
//******************************************************************Document.Ready Closed******************************//
function Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName) {
    if (FormAction == "DELETE" || FormAction == "EDIT") {
        SKeyValue = KeyValue.split(':');
        AuditLogSaveNewValue("divbody", true, '', KeyColumn, SKeyValue[1], '', FormAction, TerminalSNo, TerminalName);
    }
    else if (FormAction == "NEW") {
        KeyValue = document.getElementById('FirstName').value;
        SKeyValue = KeyValue.toUpperCase();
        AuditLogSaveNewValue("divbody", true, '', KeyColumn, SKeyValue, '', FormAction, TerminalSNo, TerminalName);
    }
}
function ResetGroupName() {
    cfi.ResetAutoComplete("GroupSNo");
    $('#SpanUsers').remove();
}

function CountRestUsers() {
    $('#SpanUsers').remove();
    var GroupNameText = $('#Text_GroupSNo').val();
    GroupNameText = GroupNameText.toUpperCase().replace(' ', '');
    var groupName = userContext.GroupName.toUpperCase().replace(' ', '');

    if (groupName == "ADMIN" && GroupNameText == "ADMIN") {
        cfi.ResetAutoComplete("GroupSNo");
        $('#SpanUsers').remove();
        ShowMessage('warning', 'Warning - Users !', "Admin Not Authorized to Create a Admin User !");
        return false;
    }
    else if (GroupNameText == "SUPERADMIN") {
        $('#GroupSNo').closest("td").append('<span id="SpanUsers">[<span id="CountRestUsers">0</span>] Left</span>')
        if ($('#Airline').val() != "") {
            $.ajax({
                type: "GET",
                url: "Services/Permissions/UsersService.svc/CountRemainingUsers?GroupId=" + parseInt($('#GroupSNo').val()) + "&AirlineSNo=" + parseInt($('#Airline').val()),
                //data: { id: parseInt(id) },
                dataType: "json",
                async: false, cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    if (response != undefined && response.length > 0) {
                        var CountRestUsers = jQuery.parseJSON(response).Table[0].Column1;
                        $('#CountRestUsers').text(CountRestUsers)
                        if (CountRestUsers == 0) {
                            cfi.ResetAutoComplete("GroupSNo");
                            $('#SpanUsers').remove();
                            ShowMessage('warning', 'Warning - Users !', "Super Admin Not Available For this Airline!");
                        }
                    }
                }
            });
        }
        else {
            ShowMessage('warning', 'Warning - Users !', "Please Select an Airline ");
            cfi.ResetAutoComplete("GroupSNo");
            $('#SpanUsers').remove();
        }
    }
    else if (groupName == "SUPERADMIN" && GroupNameText == "ADMIN") {
        $('#GroupSNo').closest("td").append('<span id="SpanUsers">[<span id="CountRestUsers">0</span>] Left</span>')
        if ($('#Airline').val() != "") {
            $.ajax({
                type: "GET",
                url: "Services/Permissions/UsersService.svc/CountRemainingAdminUsers?GroupId=" + parseInt($('#GroupSNo').val()) + "&AirlineSNo=" + parseInt($('#Airline').val()),
                //data: { id: parseInt(id) },
                dataType: "json",
                async: false, cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    if (response != undefined && response.length > 0) {
                        var CountRestUsers = jQuery.parseJSON(response).Table[0].Column1;
                        $('#CountRestUsers').text(CountRestUsers)
                        if (CountRestUsers == 0) {
                            cfi.ResetAutoComplete("GroupSNo");
                            $('#SpanUsers').remove();
                            ShowMessage('warning', 'Warning - Users !', "Admin Not Available For this Airline!");
                        }
                    }
                }
            });
        }
        else {
            ShowMessage('warning', 'Warning - Users !', "Please Select an Airline ");
            cfi.ResetAutoComplete("GroupSNo");
            $('#SpanUsers').remove();
        }

    }
    else {
        $('#SpanUsers').remove();
    }
    var AgentSNo = userContext.AgentSNo || 0;
    CheckMultiCityAccess(GroupNameText, AgentSNo);

    //===============added by ankit==================
    if ($('#Text_GroupSNo').val() == "GSA") {

        $('#MLIsCityChangeAllowed').attr('disabled', false);
    }//=============end==============

}

function checkMobileCountryCode(val) {
    $('#Mobile').removeAttr('readOnly');


}
function DivReset() {
    $('#OtherAirline').val('');
    $('#Text_OtherAirline').val('');
    $('#divMultiOtherAirline').remove();
}

function DivResetAirport() {
    $('#AllowCitySNo').val('');
    $('#Text_AllowCitySNo').val('');
    $('#divMultiAllowCitySNo').remove();
}

function clearFields() {
    $('#Text_EmployeeID').val('');
    $('#Text_Airline, #Airline').val('');
    /// arman 
    //$('#Text_CitySNo').val('');
    $('#Text_OfficeSNo, #OfficeSNo').val('');
    $('#Text_Agent, #Agent').val('');
    // $('#Text_AirportSNo').val('');
    $('#Text_Terminal,#Terminal').val('');
    $('#Text_GroupSNo').val('');
    $('#FirstName').val('');
    $('#LastName').val('');
    $('#UserName').val('');
    $('#EMailID').val('');
    $('#GroupEMailID').val('');
    $('#Text_MobileCountryCode, #MobileCountryCode').val('');
    $('#Mobile').val('');
    $('#Address').val('');
    $('#Text_NameSNo').val('');
    $('input[id=OtherAirlineAccess][value=1]').prop("checked", true);
    $('input[id=MLIsCityChangeAllowed][value=1]').prop("checked", true);

    //Added by Shatrughana Gupta on 10-02-2017
    //For Other Airline
    var closestTrA = $('#OtherAirline').closest("tr");
    closestTrA.find($("#spnOtherAirline")).hide();
    closestTrA.find($("#Text_OtherAirline")).hide();
    //For Other Airport
    var closetTrOtherAirport = $('#AllowCitySNo').closest("tr");
    closetTrOtherAirport.find($("#spnAllowCitySNo")).hide();
    closetTrOtherAirport.find($("#Text_AllowCitySNo")).hide();

    //End of Text
}

//$('#Text_UserTypeSNo').select(function () { debugger; userTypeBind(); });

function userTypeBind() {	
    $('#OverrideAsAgreedonAWBPrint').prop('checked', true);
    $('#ViewRatewhileBooking').prop('checked', true);
    $('#EnableRateTabInReservation').prop('checked', true);
    $('#ShowBalanceCreditLimit').prop('checked', true);
   // $('#ShowAsAgreedonAWBPrint ').prop('disabled', false);
    $('#SpanUsers').remove();
    $('input[id=Otherproducts][value=1]').prop("checked", true);
    var tg = $('input[id=Otherproducts]:checked').val();
    if (tg == "1") {
        var closestTr = $('#Otherproducts').closest("tr");
        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
        closestTr.find($("#spnProducts")).hide();
        closestTr.find($("#Text_Products")).hide();
        closestTr.find($("#divMultiProducts")).hide();
        //closestTr.find("td:eq(2) span").hide();
        closestTr.find($("#Text_Products")).parent().hide();
        var closestH = $('input:text[id^=Text_Products]').closest('tr');
        closestH.find('td font').hide();
    }
    if (userContext.GroupName.toUpperCase().replace(' ', '') == 'AGENT') {
        $('#OverrideAsAgreedonAWBPrint').prop('checked', false);
        $('#ViewRatewhileBooking').prop('checked', false);
        $('#EnableRateTabInReservation').prop('checked', false);
        $('#ShowBalanceCreditLimit').prop('checked', false);
		//$('#ShowAsAgreedonAWBPrint ').prop('checked', false)
		//$('#ShowAsAgreedonAWBPrint ').prop('disabled', true)
    }
    if ($("#Text_UserTypeSNo").val().toUpperCase() == "AGENT")
    {
        $('#OverrideAsAgreedonAWBPrint').prop('checked', false);
        $('#ViewRatewhileBooking').prop('checked', false);
        $('#EnableRateTabInReservation').prop('checked', false);
        $('#ShowBalanceCreditLimit').prop('checked', false);
    }
    if ($("#Text_UserTypeSNo").val() != "") {
        // 13-05-2017

        $('#Text_Terminal').removeAttr('data-valid');
        $('#Text_Terminal').removeAttr('data-valid-msg');
        $('#Text_Terminal').closest('span').css('border-color', '');
        $('#spnTerminal').closest('td').find('font').text('');
        //==end
        $('#MaxUsers,#MaxUser ').text('');
        $('#Text_Airline').nextAll("span").remove();


        if ($('#Text_UserTypeSNo').val() == "") {
            $('#MLIsCityChangeAllowed').attr('disabled', true);
            $('#OtherAirlineAccess').attr('disabled', true);
            $('#Otherproducts').attr('disabled', true);
        }
        else {
            $('#MLIsCityChangeAllowed').attr('disabled', false);
            $('#OtherAirlineAccess').attr('disabled', false);
            $('#Otherproducts').attr('disabled', false);
        }
        if ($("#Text_UserTypeSNo").val().toUpperCase() == "AIRLINE") {
            clearFields();
            //$('span#spnOfficeSNo').remove('*');
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.hide();
            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.show();


            var closestTrr = $('#spnMLIsCityChangeAllowed').closest("tr");
            closestTrr.show();
            //if ($('#OtherAirlineAccess').val() == 1) {

            //}
            $('span#spnEmployeeID').show();
            $("#Text_EmployeeID").closest('span').css("display", "block");
            $("#Text_EmployeeID").show();
            $('span#spnEmployeeID').show();
            $('#Text_EmployeeID').closest('td').contents().show();
            //$('span#spnOtherAirline').show();
            //$("#Text_OtherAirline").parent().parent().show();
            /// $('td[title="Select Office Name"]').text("Office Name");
            //$('span#spnOfficeSNo').hide();
            //$("#Text_OfficeSNo").parent().parent().hide();
            $("#Text_OfficeSNo").removeAttr('data-valid');
            //$('td[title="Select Agent"]').text("");
            //$('span#spnAgent').hide();  
            //$("#Text_Agent").parent().parent().hide();
            $("#Text_Agent").removeAttr('data-valid');
            $("#Text_AirportSNo").removeAttr('data-valid');
            // $('td[title="Select Airport Name"]').text("Airport Name");
            //closestTr.find($("#spnOfficeSNo")).hide();
            //closestTr.find($("#Text_OfficeSNo")).hide();
            $("#Text_Airline").attr('data-valid', 'required');
            $("#spnAirline").parent().find("font").show();
            cfi.ResetAutoComplete("OtherAirline");
            DivReset();
            DivResetAirport();
            cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Users_Airline", ClearAgentNoffice, "contains");
            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");

            //cfi.AutoComplete("OtherAirline", "CarrierCode", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode"], RemoveRequired, "contains", ",");//Commented by Shatrughana Gupta-10-02-2017
            cfi.AutoCompleteV2("OtherAirline", "AirlineName", "Users_OtherAirline", RemoveRequired, "contains", ",");//Added by Shatrughana Gupta on 10-02-2017

            //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "Airport", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");
            //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "v_OtherAirport_Branch", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");
            //cfi.AutoComplete("AllowCitySNo", "SNo", "v_OtherAirport_Branch", "SNo", "AirportName", ["SNo"], RemoveRequired, "contains", ",");
            // added by arman ali
            cfi.AutoCompleteV2("AllowCitySNo", "AirportCode", "Users_OtherAirport", RemoveRequired, "contains", ",");
            // cfi.AutoComplete("AllowCitySNo", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], RemoveRequired, "contains", ",");
            // cfi.AutoComplete("AllowCitySNo", "AirportCode", "v_OtherAirport_Branch", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");

        }
        else if ($("#Text_UserTypeSNo").val().toUpperCase() == "AGENT" || $("#Text_UserTypeSNo").val().toUpperCase() == "AJC") {
            if ($("#Text_UserTypeSNo").val().toUpperCase() == "AGENT") {
               // $('#ShowAsAgreedonAWBPrint ').prop('disabled', true)
            }
            clearFields();
            $('span#spnEmployeeID').hide();
            $('#Text_EmployeeID').closest('td').contents().hide();
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.show();
            $("#tbl > tbody > tr:nth-child(7) > td:nth-child(3) > font").removeAttr("Style");
            $("#Text_Agent").attr('data-valid', 'required');
            $("#tbl > tbody > tr:nth-child(7) > td:nth-child(4) > span > span").show();

            // $('td[title="Select Agent"]').text("Agent");
            $("#Text_Agent").show();
            var closestTrr = $('#spnMLIsCityChangeAllowed').closest("tr");
            closestTrr.show();

            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.show();
          //  $('span#spnAgent').show();
            // $('td[title="Select Agent"]').text("Agent");
           // $("#Text_Agent").parent().parent().show();
          //  $("#Text_Agent").attr('data-valid', 'required');

            $("#Text_AirportSNo").removeAttr('data-valid');
            // $('td[title="Select Airport Name"]').text("Airport Name");

            // $('td[title="Select Office Name"]').text("Office Name");
            $('span#spnOfficeSNo').show();
            $("#Text_OfficeSNo").parent().parent().show();
            $("#Text_OfficeSNo").attr('data-valid', 'required');

            // $('td[title="Select Agent"]').text("* Agent");
            $('span#spnAgent').show();
            $("#Text_Agent").parent().parent().show();
            $("#Text_Agent").attr('data-valid', 'required');
            $("#Text_Airline").attr('data-valid', 'required');
            //   $("#spnAirline").parent().find("font").show();
            cfi.ResetAutoComplete("OtherAirline");
             DivReset();
            DivResetAirport();
            cfi.AutoCompleteV2("OtherAirline", "CarrierCode,AirlineName", "Users_OtherAirline", null, "contains", ",", null, null, null, RemoveRequired);//Added by Shatrughana Gupta on 10-02-2017

            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_Associated", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
            //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "v_OtherAirport_Branch", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");

            cfi.AutoCompleteV2("AllowCitySNo", "AirportCode", "Users_OtherAirport", RemoveRequired, "contains", ",");  // arman ali Date : 2017-10-04  other airport access

            //Added by Shatrughana Gupta on 10-02-2017
            cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Users_Airline", ClearAgentNoffice, "contains");
            // cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_Associated", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
            // cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "v_OtherAirport_Branch", "SNo", "AirportName", ["AirportName", "CityName"], null, "contains", ",");
            // cfi.AutoComplete("AllowCitySNo", "SNo", "v_OtherAirport_Branch", "SNo", "AirportName", ["SNo"], RemoveRequired, "contains", ",");
            //  cfi.AutoComplete("AllowCitySNo", "AirportCode", "Votherairport", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");

            //Added by Shatrughana Gupta on 10-02-2017
            // cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");

        }
        else if ($("#Text_UserTypeSNo").val().toUpperCase() == "GSA" || $("#Text_UserTypeSNo").val().toUpperCase() == "GSSA") {
            clearFields();
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.show();
            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.show();
            $('span#spnEmployeeID').hide();
            $('#Text_EmployeeID').closest('td').contents().hide();
            //var closestTrr = $('#spnMLIsCityChangeAllowed').closest("tr");
            //closestTrr.show();
            
            //$("#Text_AirportSNo").removeAttr('data-valid');
            $("#Text_AirportSNo").attr('data-valid', 'required');
            $("#Text_Airline").attr('data-valid', 'required');
            $("#spnAirline").parent().find("font").show();
            //$('td[title="Select Airport Name"]').text("Airport Name");

            // $('td[title="Select Office Name"]').text("Office Name");
            $("#Text_OfficeSNo").attr('data-valid', 'required');
            //$('span#spnOfficeSNo').show();
            //$("#Text_OfficeSNo").parent().parent().show();
            //$('span#spnOtherAirline').show();
            //$("#Text_OtherAirline").parent().parent().show();
            // $('td[title="Select Agent"]').text("");
            $('span#spnAgent').hide();
            $('span#spnAgent').closest('td').contents().hide();
            $("#Text_Agent").parent().parent().hide();
            //$("#Text_Agent").attr('data-valid', 'required');
            $("#Text_Agent").removeAttr('data-valid');
            DivReset();
            DivResetAirport();
            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");

            //cfi.AutoComplete("OtherAirline", "CarrierCode", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode"], RemoveRequired, "contains", ",");//Commented by Shatrughana Gupta-10-02-2017
            cfi.AutoCompleteV2("OtherAirline", "AirlineName", "Users_OtherAirline", RemoveRequired, "contains", ",");//Added by Shatrughana Gupta on 10-02-2017

            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_Associated", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
            //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "v_OtherAirport_Branch", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");

            cfi.AutoCompleteV2("AllowCitySNo", "AirportCode", "Users_OtherAirport", RemoveRequired, "contains", ","); // arman ali Date : 2017-10-04  other airport access

            //Added by Shatrughana Gupta on 10-02-2017
            cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Users_Airline", ClearAgentNoffice, "contains");

            //$.ajax({
            //    url: "Services/Permissions/UsersService.svc/Getofficelist", async: false, type: "POST", dataType: "json", cache: false,
            //    data: JSON.stringify({ OfficeSNo: userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo }),
            //    contentType: "application/json; charset=utf-8",
            //    success: function (result) {
            //        var Data = jQuery.parseJSON(result);
            //        var resData = Data.Table0;
            //        if (resData.length > 0) {
            //            $('#OfficeSNo').val(resData[0].officeSNo);
            //            $('#Text_OfficeSNo').val(resData[0].officeName);
            //        }
            //    }
            //});
        }



        else {
            clearFields();
            //==added by arman
        
            if ($("#Text_UserTypeSNo").val().toUpperCase() == "GHA/CTO") {
                $('#Text_Terminal').attr('data-valid', 'required');
                $('#Text_Terminal').attr('data-valid-msg', 'terminal is required');
                $('#spnTerminal').closest('td').find('font').text('');
                $('#spnTerminal').closest('td').find('font').text('*');

                //   $('#Text_Terminal').closest('span').css('border-color', 'red');
            }
            //===end
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.show();
            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.show();
            var closestTrm = $('#MLIsCityChangeAllowed').closest("tr");
            closestTrm.show();
            DivReset();
            $('span#spnEmployeeID').hide();
            $('#Text_EmployeeID').closest('td').contents().hide();

            $("#Text_AirportSNo").removeAttr('data-valid');

            $("#Text_OfficeSNo").attr('data-valid', 'required');
            $('span#spnOfficeSNo').show();
            $("#Text_OfficeSNo").parent().parent().show();

            // $('td[title="Select Agent"]').text("");
            $('span#spnAgent').closest('td').contents().hide();
            $("#Text_Agent").parent().parent().hide();
            $("#Text_Agent").removeAttr('data-valid');

            DivResetAirport();
            DivReset();
            cfi.ResetAutoComplete("OtherAirline");
            cfi.AutoCompleteV2("AllowCitySNo", "AirportCode", "Users_OtherAirport", RemoveRequired, "contains", ",");  // arman ali Date : 2017-10-04  other airport access
            //Added by Shatrughana Gupta on 10-02-2017
            cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Users_Airline", ClearAgentNoffice, "contains");
            cfi.AutoCompleteV2("OtherAirline", "AirlineName", "Users_OtherAirline", RemoveRequired, "contains", ",");//Added by Shatrughana Gupta on 10-02-2017
        }

        $('#Text_Airline').closest('span').width(150);

    }

   
}

//commented byb arman
//$('#Text_CitySNo').select(function () {

//    if ($('#Text_UserTypeSNo').val() == "GSA") {
//        var airline = $('#Airline').val();
//        var city = $('#CitySNo').val();
//        //try {
//        $.ajax({
//            url: "Services/Permissions/UsersService.svc/Get_GSA_Offices?AirlineSNo=" + airline + "&CitySNo= " + city, type: "get", async: false, dataType: "json", cache: false,
//            contentType: "application/json; charset=utf-8",

//            //success: function (result) {
//            //    var Data = jQuery.parseJSON(result);
//            //    var resData = Data.Table0;
//            //    if (resData.length > 0) {


//            //    }
//            //    else {

//            //    }
//            //}
//        });
//        //cfi.AutoComplete("Text_OfficeSNo", "Name", "GA_GSA_Office", "SNo", "Name", ["Name"], null, "contains");
//        cfi.AutoComplete("OfficeSNo", "Name", "GA_GSA_Office", "SNo", "Name", null, null, "contains");
//        //}
//    }

//    if ($('#Text_UserTypeSNo').val() == "GHA/CTO") {
//        var airline = $('#Airline').val();
//        var city = $('#CitySNo').val();
//        //try {
//        $.ajax({
//            url: "Services/Permissions/UsersService.svc/Get_GHA_Offices?AirlineSNo=" + airline + "&CitySNo= " + city, type: "get", async: false, dataType: "json", cache: false,
//            contentType: "application/json; charset=utf-8",

//            //success: function (result) {
//            //    var Data = jQuery.parseJSON(result);
//            //    var resData = Data.Table0;
//            //    if (resData.length > 0) {


//            //    }
//            //    else {

//            //    }
//            //}
//        });
//        //cfi.AutoComplete("Text_OfficeSNo", "Name", "GA_GSA_Office", "SNo", "Name", ["Name"], null, "contains");

//        cfi.AutoComplete("OfficeSNo", "Name", "GA_GSA_Office", "SNo", "Name", null, null, "contains");
//        //}
//    }
// //   BindOtherAirportAccess(OfficeSNo.value == "" ? 0 : OfficeSNo.value);
//});
//end

//$('#Text_OfficeSNo').blur(function () {
//    if ($('#Text_UserTypeSNo').val() == "Agent") {
//        var airline = $('#Airline').val();
//        var city = $('#CitySNo').val();
//        var office = $('#OfficeSNo').val();

//        $.ajax({
//            //url: "Services/Permissions/UsersService.svc/Get_Agent_Offices?AirlineSNo=" + airline + "&CitySNo= " + city + "&OfficeSNo= " + office, type: "get", async: false, dataType: "json", cache: false, //Commented by Shatrughana Gupta-11-02-2017
//            url: "Services/Permissions/UsersService.svc/GetAgentBasedonCondition?AirlineSNo=" + airline + "&CitySNo= " + city + "&OfficeSNo= " + office, type: "get", async: false,
//            contentType: "application/json; charset=utf-8",//Added by Shatrughana Gupta on 11-02-2017
//        });
//        //cfi.AutoComplete("Agent", "Name", "GA_Agent_Offices", "SNo", "Name", ["Name"], null, "contains"); //Commented by Shatrughana Gupta-10-02-2017
//        cfi.AutoComplete("Agent", "Name", "TempAgent", "SNo", "Name", ["Name"], null, "contains"); //Added by Shatrughana Gupta on 10-02-2017
//        //}
//    }

//    if ($('#Text_UserTypeSNo').val() == "GSA") {
//        var office = $('#OfficeSNo').val();
//        $.ajax({
//            url: "Services/Permissions/UsersService.svc/Get_Self_OtherAirline?OfficeSNo=" + office, type: "get", async: false, dataType: "json", cache: false,
//            contentType: "application/json; charset=utf-8",

//            success: function (result) {
//                var Data = jQuery.parseJSON(result);
//                //var resData = Data.Table0;
//                if (Data[0].Column1 == 1) {
//                    var closestTrr = $('#OtherAirlineAccess').closest("tr");
//                    closestTrr.hide();

//                }
//                else {
//                    var closestTrr = $('#OtherAirlineAccess').closest("tr");
//                    closestTrr.show();
//                    $('input[id=OtherAirlineAccess][value=1]').prop("checked", true);

//                    $("input[type='radio'][id^='OtherAirlineAccess']").click(function () {
//                        if ($('input:radio[name=OtherAirlineAccess]:checked').val() == "1") {
//                            var closestTrA = $('#OtherAirline').closest("tr");
//                            //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
//                            closestTrA.find($("#spnOtherAirline")).hide();
//                            closestTrA.find($("#Text_OtherAirline")).hide();
//                            closestTrA.find($("#divMultiOtherAirline")).hide();
//                            //closestTr.find("td:eq(1) span").hide();
//                            closestTrA.find($("#Text_OtherAirline")).parent().parent().hide();
//                            $('input:text[id^=Text_OtherAirline]').val('')
//                            var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
//                            closestHA.find('td font').hide();
//                            $("#divMultiOtherAirline").find('ul >li').each(function (i) {
//                                if (i > 0) {
//                                    $("#Multi_OtherAirline").val('');
//                                    $('span[id*=FieldKeyValuesOtherAirline]')[0].textContent = '';
//                                    $("#divMultiOtherAirline").find('ul >li').eq(1).remove();
//                                }
//                            });
//                            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
//                        }
//                        else {
//                            var closestTrA = $('#OtherAirline').closest("tr");
//                            //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
//                            closestTrA.find($("#spnOtherAirline")).show();
//                            closestTrA.find($("#Text_OtherAirline")).show();
//                            closestTrA.find($("#divMultiOtherAirline")).show();
//                            //closestTr.find("td:eq(1) span").hide();
//                            closestTrA.find($("#Text_OtherAirline")).parent().parent().show();
//                            $('input:text[id^=Text_OtherAirline]').val('')
//                            var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
//                            closestHA.find('td font').show();
//                            //$("#divMultiAllowCitySNo").find('ul >li').each(function (i) {
//                            //    if (i > 0) {
//                            //        $("#Multi_AllowCitySNo").val('');
//                            //        $('span[id*=FieldKeyValuesAllowCitySNo]')[0].textContent = '';
//                            //        $("#divMultiAllowCitySNo").find('ul >li').eq(1);
//                            //    }
//                            //});
//                            DivReset();

//                            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "GSA_OtherAirline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
//                            cfi.AutoComplete("OtherAirline", "CarrierCode", "GSA_OtherAirline", "SNo", "AirlineName", ["CarrierCode"], RemoveRequired, "contains", ",");

//                        }
//                    });

//                }
//            }
//        });

//        $.ajax({
//            url: "Services/Permissions/UsersService.svc/Get_GSA_Airport?OfficeSNo=" + office, type: "get", async: false, dataType: "json", cache: false,
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                var Data = jQuery.parseJSON(result);
//                $("input[type='radio'][id^='MLIsCityChangeAllowed']").click(function () {
//                    if ($('input:radio[name=MLIsCityChangeAllowed]:checked').val() == "1")
//                        //$(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").each(function () {
//                        //    $(this).click(function () {
//                        //        if ($(this).val() == "1") 
//                    {
//                        var closestTr = $('#AllowCitySNo').closest("tr");
//                        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
//                        closestTr.find($("#spnAllowCitySNo")).hide();
//                        closestTr.find($("#Text_AllowCitySNo")).hide();
//                        closestTr.find($("#divMultiAllowCitySNo")).hide();
//                        //closestTr.find("td:eq(2) span").hide();
//                        closestTr.find($("#Text_AllowCitySNo")).parent().hide();
//                        var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
//                        closestH.find('td font').hide();
//                        $("#AllowCitySNo").val('');
//                        $("#Text_AllowCitySNo").val('');
//                        $("#divMultiAllowCitySNo").find('ul >li').each(function (i) {
//                            if (i > 0) {
//                                $("#Multi_AllowCitySNo").val('');
//                                $('span[id*=FieldKeyValuesAllowCitySNo]')[0].textContent = '';
//                                $("#divMultiAllowCitySNo").find('ul >li').eq(1).remove();
//                            }
//                        });
//                    }
//                    else {
//                        var closestTr = $('#AllowCitySNo').closest("tr");
//                        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
//                        closestTr.find($("#spnAllowCitySNo")).show();
//                        closestTr.find($("#Text_AllowCitySNo")).show();
//                        closestTr.find($("#divMultiAllowCitySNo")).show();
//                        //closestTr.find("td:eq(1) span").show();
//                        closestTr.find($("#Text_AllowCitySNo")).parent().show();
//                        var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
//                        closestH.find('td font').show();
//                        DivResetAirport();
//                        //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "GA_GSA_Airport", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");
//                        //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "GA_GSA_Airport", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");
//                        cfi.AutoComplete("AllowCitySNo", "AirportCode", "v_OtherAirport_Branch", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");
//                    }
//                });
//            }
//        });


//        //});
//    }

//});
////*/

$('#UserExpiaryDate').blur(function () {
    var expiarydate = Date.parse(($("#UserExpiaryDate").val().replace('-', '/').replace('-', '/')));
    if (!isNaN(expiarydate)) {
        expiarydate = new Date(expiarydate);
                        }
    var today = new Date(Date.parse((new Date()).toDateString()));

    if (expiarydate <= today) {
        ShowMessage('warning', 'Warning - Expiry Date Validation!', "Expiry Date should be greater than Current date");
        return false;
    }
});

$('input[type="submit"][name="operation"][value="Save"]').click(function () {
    var expiarydate = Date.parse(($("#UserExpiaryDate").val().replace('-', '/').replace('-', '/')));
    if (!isNaN(expiarydate)) {
        expiarydate = new Date(expiarydate);
    }
    var today = new Date(Date.parse((new Date()).toDateString()));


    if (expiarydate <= today) {
        ShowMessage('warning', 'Warning - Expiry Date Validation!', "Expiry Date should be greater than Current date");
        return false;
    }
});
function OnAdminChange() {

   
    //var val = $("#Text_GroupSNo").val();
    //if (val == "ADMIN") {
    //$('input:text[id^=Company]').removeAttr('data-valid');
    //var closestTr = $('input:text[id^=Company]').closest('tr');
    //closestTr.find('td:eq(3) input').hide();
    //closestTr.find("td:eq(2) span").hide();
    //closestTr.find("td:eq(2) font").hide();
    //$('#CompanyName').closest('td').find('.valid_errmsg').css('display', 'none');
    //}
    //else {
    //    var closestTr = $('input:text[id^=Company]').closest('tr');
    //    closestTr.find('td:eq(3) input').show();
    //    closestTr.find("td:eq(2) span").show();
    //    closestTr.find("td:eq(2) font").show();
    //    $('input:text[id^=Company]').attr("data-valid", "required");;
    //}

} 
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
function ExtraCondition(textId) {
    var filterConsolidatorSNo = cfi.getFilter("AND");
    var filterConsolidatorSNo1 = cfi.getFilter("OR");
    /*  Added by devendra */
       var AccountTypeSno = $('#Agent').val().split('-')[1] || "0"
       if (textId == "Text_Products") {
           if (AccountTypeSno != "0") {
               cfi.setFilter(filterConsolidatorSNo, "AccountTypeSno", "eq", AccountTypeSno);
   
           }
       }
    
    //======================Add By:Pradeep Sharma==================================
       var AgentSNo = userContext.AgentSNo || "0";
    if (textId == "Text_CitySNo") {
        $('#AirportSNo').val('');
        $('#Text_AirportSNo').val('');
        //$('#WareHouseMasterSNo').val('');
        //$('#Text_WareHouseMasterSNo').val('');

        if (userContext.GroupName.toUpperCase() == "AGENT" && AgentSNo!="0") {
            cfi.setFilter(filterConsolidatorSNo1, "AccountSNo", "eq", AgentSNo);
            cfi.setFilter(filterConsolidatorSNo1, "ParentID", "eq", AgentSNo);
            //var RegionAutoCompleteFilter1 = cfi.autoCompleteFilter(filterConsolidatorSNo);
            var RegionAutoCompleteFilter1 = cfi.autoCompleteFilter(filterConsolidatorSNo1);
            return RegionAutoCompleteFilter1;
           // SetCityValue(AgentSNo);
        }
    }
    //Added by Shatrughana
    if (textId == "Text_Agent") {
        var orCondition = cfi.getFilter("OR");
        
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        if (userContext.GroupName.toUpperCase()  == "AGENT" && AgentSNo != "0" ) {
            if (textId.indexOf("Agent") >= 0) {
                cfi.setFilter(filterConsolidatorSNo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key());
                cfi.setFilter(filterConsolidatorSNo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key());
                cfi.setFilter(filterConsolidatorSNo, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoAutoComplete").key());
                    cfi.setFilter(orCondition, "AgentSNo", "eq", AgentSNo);
                    cfi.setFilter(orCondition, "ParentId", "eq", AgentSNo);
                                     
                return cfi.autoCompleteFilter([orCondition, filterConsolidatorSNo], "AND");
            }
        } else {
            if (textId.indexOf("Agent") >= 0) {
                cfi.setFilter(filterConsolidatorSNo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key());
                cfi.setFilter(filterConsolidatorSNo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key());
                cfi.setFilter(filterConsolidatorSNo, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoAutoComplete").key());
            }
        }
    }
    //------End Text by Shatrughana
    //========================================== Added by arman ali=======================================================//
    if (textId == "Text_AllowCitySNo" && $('#Text_UserTypeSNo').val().toUpperCase() == "GSA") {

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        if (textId.indexOf("CitySNo") >= 0) {
            cfi.setFilter(filterConsolidatorSNo, "ParentID", "in", $("#Text_OfficeSNo").data("kendoAutoComplete").key());
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_AirportSNo").data("kendoAutoComplete").key());
        }
       //==============added by ankit kumar============
        if (otherAirportAccess != "") {
            cfi.setFilter(filterConsolidatorSNo, "SNo", "in", otherAirportAccess);
        }
    }
    if (textId == "Text_AllowCitySNo" && $('#Text_UserTypeSNo').val().toUpperCase() == "AGENT") {

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        //commented by arman ali  Date : 2017-08-03
        //if (textId.indexOf("CitySNo") >= 0) {
        //    cfi.setFilter(filterConsolidatorSNo, "OtherAirport", "in", $("#Text_Agent").val());
        //    cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_AirportSNo").data("kendoAutoComplete").key());
        //}

    }

    if (textId == "Text_AllowCitySNo" && $('#Text_UserTypeSNo').val().toUpperCase() == "AIRLINE") {

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        if (textId.indexOf("CitySNo") >= 0) {
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_AirportSNo").data("kendoAutoComplete").key());
        }
    }
    if (textId == "Text_AllowCitySNo" && $('#Text_UserTypeSNo').val().toUpperCase() == "GHA/CTO") {

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        if (textId.indexOf("CitySNo") >= 0) {
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_AirportSNo").data("kendoAutoComplete").key()); //Added by Arman
        }
    }
    //================================ end=========================================================//



    if (textId == "Text_AirportSNo") {

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);

        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key());

    }


    if (textId == "Text_AllowAirportSNo") {

        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $("#Text_AllowCitySNo").data("kendoAutoComplete").key() || $("#Text_CitySNo").data("kendoAutoComplete").key());

    }

    if (textId == "Text_NameSNo") {

        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $("#Text_CitySNo").data("kendoAutoComplete").key());
        if ($("#Text_AirportSNo").val() != '')
            cfi.setFilter(filterConsolidatorSNo, "AirportSNo", "in", $("#Text_AirportSNo").data("kendoAutoComplete").key());
        if ($("#Text_Terminal").val() != '')
            cfi.setFilter(filterConsolidatorSNo, "TerminalSNo", "in", $("#Text_Terminal").data("kendoAutoComplete").key());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterConsolidatorSNo]);
        return OriginCityAutoCompleteFilter2;
    }
    //Text_Terminal Added By Pankaj Khanna

    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_Terminal") {
        if ($("#Text_AirportSNo").val() == "") {
            cfi.setFilter(filterEmbargo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        if ($("#Text_AirportSNo").val() != "") {
            cfi.setFilter(filterEmbargo, "AirportSNo", "eq", $("#Text_AirportSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
    }
    // Arman Ali 15 apr 2017
    if (textId == "Text_OfficeSNo") {
        
        cfi.setFilter(filterEmbargo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key())
        if (userContext.GroupName.toUpperCase() == "AGENT" && AgentSNo !="0") {
            cfi.setFilter(filterConsolidatorSNo1, "AgentSNo", "eq", AgentSNo);
            cfi.setFilter(filterConsolidatorSNo1, "ParentId", "eq", AgentSNo);
          }
        if ($('#Text_UserTypeSNo').val().toUpperCase() == "AGENT" || $('#Text_UserTypeSNo').val().toUpperCase() == "GSA" ) {
            cfi.setFilter(filterEmbargo, "OfficeType", "neq", '2')
            cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key())
            
           // return cfi.autoCompleteFilter([filterConsolidatorSNo1, filterEmbargo], "AND");
        }
        if ($('#Text_UserTypeSNo').val().toUpperCase() == "GHA/CTO") {
            cfi.setFilter(filterEmbargo, "OfficeType", "eq", '2')
            // cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key())
        }
        if ($('#Text_UserTypeSNo').val().toUpperCase() == "POS-CSC") {
            cfi.setFilter(filterEmbargo, "OfficeType", "eq", '4')
            // cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key())
        }
        if ($('#Text_UserTypeSNo').val().toUpperCase() == "POS-KSO") {
            cfi.setFilter(filterEmbargo, "OfficeType", "eq", '5')
            // cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key())
        }
        // var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        var OriginCityAutoCompleteFilter2 =  cfi.autoCompleteFilter([filterConsolidatorSNo1, filterEmbargo], "AND");
        return OriginCityAutoCompleteFilter2;
    }

    //End of Text_Terminal By Pankaj Khanna


    if (textId == "Text_AllowWarehouseSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $("#Text_AllowCitySNo").data("kendoAutoComplete").key() || $("#Text_CitySNo").data("kendoAutoComplete").key());

    }

    //if (textId == "Text_GroupSNo") {
    //    cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
    //}
    //==============================End==============================================

    //============================= changes done by arman ali fro gsa and airline ===================================//  
    var filterOtherAirline = cfi.getFilter("AND");
    var AcNo = $('#Agent').val().split('-')[0] || "0";
    if (textId == "Text_OtherAirline") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_Airline").data("kendoAutoComplete").key())
        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_OtherAirline").data("kendoAutoComplete").key())
        if (AcNo != "0") {
            cfi.setFilter(filterConsolidatorSNo, "AccountSNo", "eq", AcNo);
            cfi.setFilter(filterConsolidatorSNo, "IsInterline", "in", '0,1');
        } else {
            cfi.setFilter(filterConsolidatorSNo, "IsInterline", "eq", 0);
        }
    }

/*
    if (textId == "Text_OtherAirline" && $('#Text_UserTypeSNo').val().toUpperCase() == "AIRLINE") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_Airline").data("kendoAutoComplete").key())
        cfi.setFilter(filterConsolidatorSNo, "IsInterline", "eq", 0);


    }
    if (textId == "Text_OtherAirline" && $('#Text_UserTypeSNo').val().toUpperCase() == "GHA/CTO") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_Airline").data("kendoAutoComplete").key())

    }
    if (textId == "Text_OtherAirline" && $('#Text_UserTypeSNo').val().toUpperCase() == "GSA") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "IsInterline", "eq", 0);
        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_Airline").data("kendoAutoComplete").key())
        cfi.setFilter(filterConsolidatorSNo, "OfficeSNo", "in", $("#Text_OfficeSNo").data("kendoAutoComplete").key());

    }
    */

        if (textId == "Text_Airline" && ($('#Text_UserTypeSNo').val().toUpperCase() != "GHA/CTO")) {
            cfi.setFilter(filterConsolidatorSNo, "IsInterline", "eq", 0);
            cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_OtherAirline").data("kendoAutoComplete").key());
            ResetGroupName();
        }
        if (textId == "Text_Airline" && ($('#Text_UserTypeSNo').val().toUpperCase() == "GHA/CTO")) {
            cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_OtherAirline").data("kendoAutoComplete").key());
            ResetGroupName();
        }
    
     
        //====================================End===============================================

        //=== by arman ali 22 apr 2017==============
    else if (textId == "Text_GroupSNo") {
        var UserTypo = $("#Text_UserTypeSNo").val().toUpperCase();

        cfi.setFilter(filterConsolidatorSNo, "UserTypeName", "eq", UserTypo);

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
      /*
                if ($('#Text_UserTypeSNo').val().toUpperCase() == "AIRLINE")
                {
                    cfi.setFilter(filterConsolidatorSNo, "GroupName", "neq", "SUPER ADMIN")
                }
                else if ($('#Text_UserTypeSNo').val().toUpperCase() == "AGENT") {
                    cfi.setFilter(filterConsolidatorSNo, "GroupName", "in", "AGENT,POST OFFICE CN,POST OFFICE AWB,POST OFFICE (ALL),OUTLET")
        
                }
                else if ($('#Text_UserTypeSNo').val().toUpperCase() == "GSA") {
                    cfi.setFilter(filterConsolidatorSNo, "GroupName", "in", "POS-CSC,POS-KSO,POS-OPS,GSA")
                }
                else if ($('#Text_UserTypeSNo').val().toUpperCase() == "GHA/CTO") {
                    cfi.setFilter(filterConsolidatorSNo, "GroupName", "in", "GHA,CGK-GHA-INCOMING INT,CGK-GHA-INCOMING DOM,CGK-GHA-TRANSIT,CGK-GHA-ACCPT-DOM,CGK-GHA-MOVEMENT,BO-GHA-OPS-OUT/INC,BO-GHA-OPS-OUT,BO-GHA-OPS-INC,CGK-GHA-ACCPT-INT,CGK-GHA-RHPJT")
                }
                else if ($('#Text_UserTypeSNo').val().toUpperCase() == "GSSA") {
                    cfi.setFilter(filterConsolidatorSNo, "GroupName", "in", "GSSA,GSSA-OPS,GSSA-SALES,BO-GSSA-OPS,GSSA FINANCE,GSSA-SALES MGR,GSSA-OPS MGR,GSSA-FNC MGR,GSSA MGR,GSSA SPV/MGR")
                }
                else if ($('#Text_UserTypeSNo').val().toUpperCase() == "POS-CSC") {  // POS-CSA 
                    cfi.setFilter(filterConsolidatorSNo, "GroupName", "in", "POS-CSC,POS-OPS,POS-OPS MGR,POS-CSC SPV/MGR,POS-CSC SPV")
                }
                else if ($('#Text_UserTypeSNo').val().toUpperCase() == "POS-KSO") { // USER TYPE = POS-KSO
                    cfi.setFilter(filterConsolidatorSNo, "GroupName", "in", "POS-KSO,POS-OPS")
                }
                // ======= end======================================-
            Commented by devendra*/
    }
        // By arman Date 2017-05-16 : filtering mobile countrycode on the basic of countrycode;
    else if (textId == "Text_MobileCountryCode") {
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "eq", $('#CitySNo').val());


    }
        //======end

        //=============added by ankit kumar=================updated by Priti Yadav==================
    else if (textId == "Text_UserTypeSNo" && userContext.GroupName.toUpperCase() == 'GSA') {
        
            cfi.setFilter(filterConsolidatorSNo, "UserTypeName", "in", 'Agent,GHA/CTO,GSA,POS-CSC,POS-KSO');
        
    }
    //========end
var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterConsolidatorSNo);
    return RegionAutoCompleteFilter;
}




function ExtraParameters(id) {
    var param = [];
    if (id == "Text_Airline" || id == "Text_OtherAirline") {
        //var UserSNo = $("#htmlkeysno").val() || userContext.UserSNo;
        var UserSNo = userContext.UserSNo;
        //var UserSNo = 0
        //if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
        //    UserSNo = userContext.UserSNo;
        //else
        //    UserSNo = $("#htmlkeysno").val();
        if (id == "Text_OtherAirline") {
            var AgentSNo = $('#Agent').val().split('-')[0] || 0;
            param.push({ ParameterName: "AgentSNo", ParameterValue: AgentSNo });
        }
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}


function GetData(textID, textValue, keyID, keyValue) {
    // HideRows();
    var actingKeyValue = keyValue;
    var sNo = keyValue;
    var groupName = textValue;
    var allowMultiCity = false;
    var actingGroupSNo = keyValue;
    var actingGroupName = textValue;
    $.ajax({
        url: "Services/Permissions/GroupsService.svc/GetGroupDetails?GroupSNo=" + keyValue,
        async: false, type: "GET", dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            sNo = eval(result)[0].SNo;
            sNo = eval(result)[0].GroupName;
            allowMultiCity = eval(result)[0].MultiCity == "YES";
            actingGroupSNo = eval(result)[0].ActingGroupSNo;
            actingGroupName = eval(result)[0].ActingGroupName;
        },
        error: function (xhr) {
            ShowMessage('info', lApplicationMessage, xhr);
        }
    });

}
function GetCityDefult(textID, textValue, keyID, keyValue) {
    if (textValue != null || textValue != "") {
        $("input[id$='Text_CitySNo']").val(textValue);
    }

}
function GetCityData(textID, textValue, keyID, keyValue) {

    //Added by Shatrughana Gupta on 10-02-2017
    if (ValidateFun() == false) {
        return false;
    }
    //End
    //  $('#OfficeSNo').val('');
    // $('#Text_OfficeSNo').val('');
    // clearAgent();
    // $('#Agent').val('');
    //  $('#Text_Agent').val('');
    var selectedOne = this.dataItem(textID.item.index());
    var Citysno = selectedOne.Key;
    $('#Terminal').val('');
    $('#Text_Terminal').val('');
    $('#Text_NameSNo').val('');
    $('#NameSNo').val('');
    $('#AllowCitySNo').val('');
    $('#Text_AllowCitySNo').val('');
    $('#divMultiAllowCitySNo span[id][class]').closest('li').remove();
    $('#Multi_AllowCitySNo').val('');
    $('#FieldKeyValuesAllowCitySNo').text('');
    OfficeSNo
    if (userContext.GroupName.toUpperCase() != "AGENT") {
        $('#OfficeSNo').val('');
        $('#Text_OfficeSNo').val('');
        $('#Agent').val('');
        $('#Text_Agent').val('');
    }
    try {
        $.ajax({
            url: "Services/Permissions/UsersService.svc/GetAirportOfficeInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CitySNo: Citysno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#AirportSNo').val(resData[0].AirportSNo);
                    $('#Text_AirportSNo').val(resData[0].AirportName);
                    //  $('#OfficeSNo').val(resData[0].OfficeSNo);
                    //  $('#Text_OfficeSNo').val(resData[0].OfficeName);
                }
                else {
                    $('#OfficeSNo').val("");
                    $('#Text_OfficeSNo').val("");
                    $('#AirportSNo').val("");
                    $('#Text_AirportSNo').val("");
                }
            }
        });
    }
    catch (exp) { }







    var val = textValue;
    //$('span#DCity').text(val);
    cfi.ResetAutoComplete("AirportSNo");
    //cfi.ResetAutoComplete("WareHouseMasterSNo");
    if (keyValue != "") {
        $.ajax({
            //url: "index.aspx/setAirportWarehouseName",
            url: "Services/Permissions/UsersService.svc/setAirportWarehouseName",
            async: false, type: "POST", dataType: "json",
            data: JSON.stringify({ citySno: keyValue, airportSNo: '0' }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "") {

                    if (result.split('~').length >= 4) {
                        $('#AirportSNo').val(result.split('~')[0]);
                        $('#Text_AirportSNo').val(result.split('~')[1]);
                        //$('#WareHouseMasterSNo').val(result.split('~')[2]);
                        //$('#Text_WareHouseMasterSNo').val(result.split('~')[3]);
                    }
                    else if (result.split('~').length >= 2) {
                        $('#AirportSNo').val(result.split('~')[0]);
                        $('#Text_AirportSNo').val(result.split('~')[1]);
                    }
                }
            },
            error: function (xhr) {
                alert($(xhr.responseText).find("p:eq(1)").html());
            }
        });
    }
}

function ShowAction() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            var block = $(this).closest("tr").find("td:last").html();
            var groupName = $(this).find("td:eq(3)").text().toUpperCase();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(this).toolbar({ content: '#user-options', position: 'top', recId: recId + "&gname=" + groupName, addOnFunction: addOnFunction, addOnParmeter: recId });
            }
        });
    });
}
function addOnFunction(content, obj, recId) {
    $("#header-user-options").find("a").css("display", "");
    //var loginType = lvalue(_SessionLoginType_);
    var loginType = _SessionLoginType_;
    if (loginType.toUpperCase() == "ADMIN") {
        if ($(obj).find("td:last").text().toUpperCase() == "NO") {
            $("#header-user-options").find(".actionSpan").each(function () {
                if ($(this).text().toUpperCase() == "UNBLOCK" || $(this).text().toUpperCase() == "BLOCK") {
                    $(this).text("BLOCK");
                    $(this).closest("a").unbind("click").bind("click", function () {
                        BlockUser(recId);
                    });
                }
            });
            $(content).find(".actionSpan").each(function (index) {
                if ($(this).text().toUpperCase() == "UNBLOCK") {
                    $(this).text("BLOCK");
                    $(content).find("a:eq(" + index + ")").unbind("click").bind("click", function () {
                        BlockUser(recId);
                    });
                }
            });
        }
        else {
            $("#header-user-options").find(".actionSpan").each(function () {
                if ($(this).text().toUpperCase() == "UNBLOCK" || $(this).text().toUpperCase() == "BLOCK") {
                    $(this).text("UNBLOCK");
                    $(this).closest("a").unbind("click").bind("click", function () {
                        UnblockUser(recId);
                    });
                }
            });
            $(content).find(".actionSpan").each(function (index) {
                if ($(this).text().toUpperCase() == "UNBLOCK") {
                    $(content).find("a:eq(" + index + ")").unbind("click").bind("click", function () {
                        UnblockUser(recId);
                    });
                }
            });
        }
    }
    else {
        $("#header-user-options").find(".actionSpan").each(function () {
            if ($(this).text().toUpperCase() == "UNBLOCK") {
                $(this).closest("a").css("display", "none");
            }
        });
        $(content).find(".actionSpan").each(function (index) {
            if ($(this).text().toUpperCase() == "UNBLOCK") {
                $(content).find("a:eq(" + index + ")").remove();
            }
        });
    }
}
function UnblockUser(recId) {
    var url = getAbsolutePath();
    $.ajax({
        url: "Services/Permissions/UsersService.svc/UnblockUser?RecordId=" + recId + "&Url=" + url, async: false,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (response) {
            if (response.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(response);
                ShowMessage('success', 'Success', "[" + myData[0].UserName + "]- " + myData[0].UnblockMessage + " Please reload your page.");
            }
            else {
                ShowMessage('error', 'Error', "Unable to process request.");
            }
        },
        error: function (xhr) {
            ShowMessage('error', 'Error', "Unable to process request!");
        }
    });
}
function BlockUser(recId) {
    var url = getAbsolutePath();
    $.ajax({
        url: "Services/Permissions/UsersService.svc/BlockUser?RecordId=" + recId + "&Url=" + url, async: false,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (response) {
            if (response.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(response);
                ShowMessage('success', 'Success', "[" + myData[0].UserName + "]- " + myData[0].BlockMessage + " Please reload your page.");
            }
            else {
                ShowMessage('error', 'Error', "Unable to process request.");
            }
        },
        error: function (xhr) {
            ShowMessage('error', 'Error', "Unable to process request!");
        }
    });
}
function ShowHidePassword() {
    if ($("#Password").val() != "") {
        if ($('#ShowPassword').val().toLowerCase() == "hide password") {
            $('span#TempPassword').text("");
            $('#ShowPassword').val("Show Password");
        }
        else {
            $('span#TempPassword').text('(Entered Password - ' + $("#Password").val() + ')');
            $('#ShowPassword').val("Hide Password");
        }
    }
    else {
        ShowMessage('info', 'Information', "Enter Password");
    }
}
function UserStatusChange() {
}
$(document).ready(function () {
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        var groupName = getQueryStringValue("gname").toUpperCase();
        if (groupName == "ADMIN") {
            $(".btn.btn-info")[0].style.display = "none";
            $(".btn.btn-danger").css("display", "none");
        }
    }
});
function IsMultiCityAllowed(gSNo) {
    $.ajax({
        url: "Services/Permissions/UsersService.svc/IsMultiCityAllowed?SNo=" + gSNo,
        async: false, type: "GET", dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var res = jQuery.parseJSON(result)[0];
                if (res.IsMultiCity == 'False')
                    $("#AccessibleCitySNo").closest("tr").hide();
                else
                    $("#AccessibleCitySNo").closest("tr").show();

            }
        }
        // error: function (xhr) {
        //  var a = "";
        //}
    });
}
function RemoveRequired() {
    //var closestTr = $(this).closest("tr");
    //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');

    $('#Text_AllowCitySNo').removeAttr('data-valid');

}
function readOnlyfield(valueId, value, keyId, key) {
    if (value == "") {
        $('#Mobile').attr('readOnly', 'readOnly');
        $('#Mobile').val('');
        $('#Mobile').removeClass('valid_invalid');
    }
    else
        $('#Mobile').removeAttr('readOnly');
}
function RadioMLIsCityChangeAllowed() {
    if ($('input:radio[name=MLIsCityChangeAllowed]:checked').val() == "1") {


        var closestTr = $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").closest("tr");
        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "");
        closestTr.find($("#spnAllowCitySNo")).hide();
        closestTr.find($("#Text_AllowCitySNo")).hide();
        closestTr.find($("#divMultiAllowCitySNo")).hide();
        closestTr.find("td:eq(3) span").hide()
        $('input:text[id^=Text_AllowCitySNo]').val('')
        var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
        closestH.find('td font').hide();
    }
    else {
        var closestTr = $(this).closest("tr");
        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
        closestTr.find($("#spnAllowCitySNo")).show();
        closestTr.find($("#Text_AllowCitySNo")).show();
        closestTr.find($("#divMultiAllowCitySNo")).show();
        closestTr.find("td:eq(3) span").show()
        var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
        closestH.find('td font').show();
    }
}
function RemoveField() {
    $('#Text_AllowCitySNo').val('');
    $('#AllowCitySNo').val('');
    $('#divMultiAllowCitySNo').remove();
    cfi.AutoCompleteV2("AllowCitySNo", "AirportCode", "Users_OtherAirport", RemoveRequired, "contains", ",");
    // $("#divMultiAllowCitySNo").find('.k-button ').remove();
    RemoveTerminal();
}
function RemoveTerminal() {
    $('#Terminal').val('');
    $('#Text_Terminal').val('');
    $('#Text_NameSNo').val('');
    $('#NameSNo').val('');


}
function nchange() {
    $('#Text_NameSNo').val('');
    $('#NameSNo').val('');
}
function ResetUserPassword(UString) {
    var SNo = UString.href.split('=')[1];
    var path = "";
    //if (window.location.href.split('/')[2].indexOf('localhost') > -1)
    //    path = window.location.href.split('/')[2];
    //else
    path = window.location.href.split('/Default')[0].split('//')[1];
    var UserName = $(".k-state-selected td[data-column='FirstName']").text() + ' ' + $(".k-state-selected td[data-column='LastName']").text();
    if (confirm('Are you sure, you want to reset password for user \'' + UserName + '\' ?')) {
        $.ajax({
            url: "Services/Permissions/ChangePasswordService.svc/ResetUserPassword",
            async: false,
            type: "POST",
            cache: false,
            data: JSON.stringify({ SNo: SNo, UserSNo: userContext.UserSNo, Path: path }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.toLowerCase().indexOf("password reset successfully.") >= 0) {
                    // alert("Password reset link has been sent on respective user's E-mail Address.");
                    //ShowMessage('success', 'Success- User Password Reset', result); //Change by parvez khan
                    ShowMessage('success', 'Success- User Password Reset');
                    //window.location.href = 'Default.cshtml?Module=Permissions&Apps=Users&FormAction=INDEXVIEW'
                    ReloadGrid();


                }
                else if (result == 1) {
                    // alert("Password reset link has been sent on respective user's E-mail Address.");
                    ShowMessage('warning', 'Warning', "Your Email-ID is not available for sending password. Can’t reset password.");//"Kindly provide Email Id of respective user."
                }
                else if (result == 2) {
                    // alert("Password reset link has been sent on respective user's E-mail Address.");
                    ShowMessage('warning', 'Warning', "User Id is Inactivated. Please contact Admin.");
                }
                else { //alert("Invaild Attempt!!!");
                    ShowMessage('warning', 'Warning', "Invaild Attempt!!!");
                }
            },
            error: function (result) { //alert("Invaild Attempt!!!");
                ShowMessage('warning', 'Warning', "Invaild Attempt!!!");
            }
        });
    }
    else {
        return false;
    }
    return false;
}

//abc();
function OnSelectEmployeeProcess() {
    //var UserTypeValue = $("#Text_UserTypeValue").val().split['-'];
    //var SNo = $("#Text_UserTypeValue").val().split('-')[0];
    var SNo = $("#UserTypeValue").val();
    //if ($.isNumeric(SNo) == true) {       
    try {
        SNo = parseInt(SNo);
        $.ajax({
            type: "GET",
            url: "Services/Permissions/UsersService.svc/GetEmployeedetailinformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: SNo == "" ? 0 : SNo }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#FirstName').val(FinalData[0].firstname);
                    $('#LastName').val(FinalData[0].lastname);
                    $('#Address').val(FinalData[0].Address);
                    $('#EMailID').val(FinalData[0].MailID);
                    $('#Mobile').val(FinalData[0].contactNo);
                    $('#Designation').val(FinalData[0].DesignationSNo);
                    $('#Text_Designation').val(FinalData[0].Name);
                    $('#UserName').val(FinalData[0].StaffSNo);
                }
            }
        });
    }
    catch (exp) { }
    //}
}
//// Changes by vkumar task #38
// Ajax call to get Agent's Office & City Details
//$("#Text_UserTypeValue").select(function () {
//    if ($('input[name=UserTypeSNo]:checked').val() == "1") {
//        var UserTypeValue = $("#UserTypeValue").val();
//        if (UserTypeValue != "") {
//            $.ajax({
//                url: "Services/Permissions/UsersService.svc/GetAgentDetails",
//                async: false,
//                type: "GET",
//                dataType: "json",
//                data: {
//                    agentId: UserTypeValue
//                },
//                contentType: "application/json; charset=utf-8", cache: false,
//                success: function (result) {
//                    if (result.substring(1, 2) == "{") {
//                        var myData = jQuery.parseJSON(result);
//                        $('#Text_CitySNo').val(myData[0].City);
//                        $('#CitySNo').val(myData[0].CitySNo);
//                        $('#Text_OfficeSNo').val(myData[0].Office);
//                        $('#OfficeSNo').val(myData[0].OfficeSno);
//                        $('#Text_CitySNo').data("kendoAutoComplete").enable(false);
//                        $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
//                    }
//                    return false
//                },
//                error: function (xhr) {
//                    var a = "";
//                }
//            });
//        }
//    }
//});
//Ends

//Added by Shatrughana Gupta Gupta
function ValidateFun() {
    if ($('#Text_UserTypeSNo').val() == "") {
        ShowMessage('warning', 'Warning - User Type Validation!', "Please Enter User Type");
        return false;
    }
    else if ($('#Text_Airline').val() == " ") {
        ShowMessage('warning', 'Warning - Airline Name Validation!', "Please Enter Airline Name");
        return false;
    }
    else {
        return true;
    }
}
//function BindOtherAirportAccess(office)
//{
//    $.ajax({
//        url: "Services/Permissions/UsersService.svc/Get_GSA_Airport?OfficeSNo=" + office, type: "get", async: false, dataType: "json", cache: false,
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var Data = jQuery.parseJSON(result);
//            if (Data.length > 0)
//            {
//                $('#MLIsCityChangeAllowed').attr('disabled', false);
//            }
//            else
//            {
//                $('#MLIsCityChangeAllowed').attr('disabled', true);
//                //$("input[type=radio][value='MLIsCityChangeAllowed']").attr("disabled", true);
//               // $("input[type=radio][value=" + a + "]").prop("disabled", true);
//            }

//        } 
//            });
//}
//End Text By Shatrughana Gupta Gupta   
// added by arman ali
function otherairlineaccess() {
    if ($('input:radio[name=OtherAirlineAccess]:checked').val() == "1") {
        var closestTrA = $('#OtherAirline').closest("tr");
        closestTrA.find($("#spnOtherAirline")).hide();
        closestTrA.find($("#Text_OtherAirline")).hide();

    }
    else {
        var closestTrA = $('#OtherAirline').closest("tr");
        closestTrA.find($("#spnOtherAirline")).show();
        closestTrA.find($("#Text_OtherAirline")).show();
    }

}
function otherairportaccess() {
    if ($('input:radio[name=MLIsCityChangeAllowed]:checked').val() == "1") {

        //  For Other Airport
        var closetTrOtherAirport = $('#AllowCitySNo').closest("tr");
        closetTrOtherAirport.find($("#spnAllowCitySNo")).hide();
        closetTrOtherAirport.find($("#Text_AllowCitySNo")).hide();
    }
    else {
        var closetTrOtherAirport = $('#AllowCitySNo').closest("tr");
        closetTrOtherAirport.find($("#spnAllowCitySNo")).show();
        closetTrOtherAirport.find($("#Text_AllowCitySNo")).show();
    }
}
otherairlineaccess();
otherairportaccess();
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    //  preventTab();

    $('#spnTerminal').before('<font color="red"></font>');// by arman 2017-05-15
    $('#Text_Terminal').removeAttr('data-valid');
    $('#Text_Terminal').removeAttr('data-valid-msg');
    $('#Text_Terminal').closest('span').css('border-color', '');
    $('#spnTerminal').closest('td').find('font').text('');
    if ($('#Text_UserTypeSNo').val().toUpperCase() == "AIRLINE") {
        $('#OfficeSNo').closest("tr").hide();
        $('#Text_OfficeSNo').removeAttr('data-valid');
        $('#Text_Agent').removeAttr('data-valid')
        $('span#spnEmployeeID').show();
        $("#Text_EmployeeID").parent().parent().show();

    }

    else if ($('#Text_UserTypeSNo').val().toUpperCase() == "GSA") {
        $('span#spnEmployeeID').hide();
        $('#Text_EmployeeID').closest('td').contents().hide();
        $('#OfficeSNo').closest("tr").show();
        $('#OtherAirlineAccess').closest("tr").show();
        $('#MLIsCityChangeAllowed').closest("tr").show();
        $("#Text_AirportSNo").attr('data-valid', 'required');
        $("#Text_OfficeSNo").attr('data-valid', 'required');
        $('#spnAgent').closest('td').contents().hide();
        $('#Text_Agent').closest('td').contents().hide();
        // $("#Text_Agent").removeAttr('data-valid')
        // $('td[title="Select Agent"]').text("");
        $('span#spnAgent').hide();
        // $("#Text_Agent").parent().parent().hide();
        $("#Text_Agent").removeAttr('data-valid');
    
    }
    else if ($('#Text_UserTypeSNo').val().toUpperCase() == "AGENT" || $('#Text_UserTypeSNo').val().toUpperCase() == "AJC") {
        $('span#spnEmployeeID').hide();
        $('#Text_EmployeeID').closest('td').contents().hide();
        $('#OfficeSNo').closest("tr").show();
        $('#OtherAirlineAccess').closest("tr").show();
        $('#MLIsCityChangeAllowed').closest("tr").show();
        $('span#spnAgent').show();

        $("#Text_Agent").parent().parent().show();
        $("#Text_Agent").attr('data-valid', 'required');

        $("#Text_AirportSNo").removeAttr('data-valid');

        $("#Text_OfficeSNo").attr('data-valid', 'required');
        $("#Text_Agent").attr('data-valid', 'required');


    }
    else {


        var closestTr = $('#OfficeSNo').closest("tr");
        closestTr.show();
        var closestTrr = $('#OtherAirlineAccess').closest("tr");
        closestTrr.show();
        var closestTrm = $('#MLIsCityChangeAllowed').closest("tr");
        closestTrm.show();
        $('span#spnEmployeeID').hide();
        $('#Text_EmployeeID').closest('td').contents().hide();

        $("#Text_AirportSNo").removeAttr('data-valid');

        //   $("#Text_Airline").removeAttr('data-valid');
        //  $("#spnAirline").parent().find("font").hide()


        $("#Text_OfficeSNo").attr('data-valid', 'required');
        $('span#spnOfficeSNo').show();
        $("#Text_OfficeSNo").parent().parent().show();
        //=====13-05-2017
        if ($("#Text_UserTypeSNo").val().toUpperCase() == "GHA/CTO") {
     
            $("#Text_Terminal").attr('data-valid', 'required');
            $("#Text_Terminal").attr("data-valid-msg", 'Terminal is required');
            //   $('#spnTerminal').closest('td').find('font').text('');
            $('#spnTerminal').closest('td').find('font').text('*');
            // $('#Text_Terminal').closest('span').css('border-color', 'red');
        }
        //===END

        $('span#spnAgent').closest('td').contents().hide();
        $("#Text_Agent").closest('td').contents().hide();
        $("#Text_Agent").removeAttr('data-valid');

    }
}



$('#Text_Airline').change(function () {
    $('#Text_OtherAirline').val('');
    $('#OtherAirline').val('');
    $("#divMultiOtherAirline").remove();
    cfi.AutoCompleteV2("OtherAirline", "CarrierCode,AirlineName", "Users_OtherAirline", RemoveRequired, "contains", ",");

});
//common for password and address
$('#Password').attr('maxlength', '20');
$("#Password").addClass('pwdtextbox');
$("#Address").removeClass('k-nput');
$("#Address").addClass('pwdtextbox');
// Added By Arman Ali
if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

    $('#MobileCountryCode').closest('td').find('.k-combobox ').css('width', '70px');
    $("#Mobile").css("margin-left", "40px");
}


if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
    if ($("#UserTypeText").val().toUpperCase() == "GHA/CTO") {
        $("[title='Employee Name']").closest('td').text('')
        $("#EmployeeID").closest('td').contents().hide();
        $("[title='Agent']").closest('td').text('')
        $("#Agent").closest('td').contents().hide();
    }
    if ($("#UserTypeText").val().toUpperCase() == "GSA" || $("#UserTypeText").val().toUpperCase() == "GSSA") {
        $("[title='Employee Name']").closest('td').text('')
        $("#EmployeeID").closest('td').contents().hide();
        $("[title='Agent']").closest('td').text('')
        $("#Agent").closest('td').contents().hide();
    }
    if ($("#UserTypeText").val().toUpperCase() == "AIRLINE") {
        $("[title='Employee Name']").closest('td').text('')
        $("#EmployeeID").closest('td').contents().hide();
        $("#OfficeSNo").closest('tr').hide();
    }
    if ($("#UserTypeText").val().toUpperCase() == "AGENT" || $("#UserTypeText").val().toUpperCase() == "AJC") {
        $("[title='Employee Name']").closest('td').text('')
        $("#EmployeeID").closest('td').contents().hide();

    }



}

//==========================Added by Arman ali Date: 30-03-2017


$('#Text_Agent').after('&nbsp&nbsp&nbsp' + '<div id="MaxUsers" style="display:inline-flex; color:black;"></div>');
$('#MaxUsers').after('&nbsp&nbsp' + '<div id="MaxUser" style="display:inline-flex; color:Red"></div>');
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

  
    if ($('#Text_UserTypeSNo').val().toUpperCase() == "AGENT")
        GetMaxUsers();
    else
        $('#MaxUsers,#MaxUser ').text('');
   

    /* ADDED BY DEVENDRA*/
    var tg = $('input[id=Otherproducts]:checked').val();
    if (tg == "1") {
        $('span#spnProducts').hide();
        $('#Products').parent().find('*').hide();
      //  productaccesschange();
        
    }
   
}


   $('input[id=Otherproducts]').click(function () {
            var tg = $('input[id=Otherproducts]:checked').val();
            productaccesschange();
        });
      function productaccesschange() {
                  var tg = $('input[id=Otherproducts]:checked').val();
               if (tg == "1") {
        var closestTr = $('#Otherproducts').closest("tr");
        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
        closestTr.find($("#spnProducts")).hide();
        closestTr.find($("#Text_Products")).hide();
        closestTr.find($("#divMultiProducts")).hide();
        //closestTr.find("td:eq(2) span").hide();
        closestTr.find($("#Text_Products")).parent().hide();
        var closestH = $('input:text[id^=Text_Products]').closest('tr');
        closestH.find('td font').hide();
        $("#Products").val('');
        $("#Text_Products").val('');
        $('#divMultiProducts ul li span').not('span[id="FieldKeyValuesProducts"]').click();
        $("#divMultiProducts").find('ul >li').each(function (i) {
            if (i > 0) {
                $("#Multi_Products").val('');
                $('span[id*=FieldKeyValuesProducts]')[0].Content = '';
                $("#divMultiProducts").find('ul >li').eq(1).hide();
            }
        });
    }
    else {
        var closestTr = $('#Otherproducts').closest("tr");
        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
        closestTr.find($("#spnProducts")).show();
        closestTr.find($("#Text_Products")).show();
        closestTr.find($("#divMultiProducts")).show();
        //closestTr.find("td:eq(1) span").show();
        closestTr.find($("#Text_Products")).parent().show();
        var closestH = $('input:text[id^=Text_Products]').closest('tr');
        closestH.find('td font').show();
    }
}
      function GetMaxUsers() {
              $('#Text_Agent').live('keydown', function (e) {
                  var code = e.keyCode || e.which;
                  if (code == 9) {
                      // e.preventDefault();
                      //  alert('tab');
                  }
              });
          
    var id = $("#Agent").val().split('-')[0];
    var agnt = $('#Text_Agent').val();
    if (id != "") {

        $.ajax({
            type: "GET",
            url: 'Services/Permissions/UsersService.svc/GetMaxUsers?id=' + parseInt(id),
            //data: { id: parseInt(id) },
            dataType: "json",
            success: function (response) {
                var record = jQuery.parseJSON(response);
                var myData = record.Table[0];
                //   alert(myData.BasedOn);
                $('#MaxUsers').text('Remaining Users: ');
                $('#MaxUser').text('  ' + parseInt( myData.MaxUsers)  <= 0 ? 0 : myData.MaxUsers);
                if ((getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE"  ) && parseInt(myData.MaxUsers) <= 0) {
                    ShowMessage('warning', 'Warning - Users !', " Maximum Users limit Exceeded For '" + agnt + "' Agent");
                   // alert("warning Maximum Users limit Exceeded For '"+ $('#Text_Agent').val() + "' Agent");
                    $('#Agent').val('');
                    $('#Text_Agent').val('');
                    //  $('#MaxUser').text('');
                    //  $('#MaxUsers').text('')
                    //$("#divMultiOtherAirline ul li:visible").remove();
                    //$('#Multi_OtherAirline').val('');
                    //$('#FieldKeyValuesOtherAirline').val('');
                    $("#divMultiOtherAirline").closest('td').find('[class="k-icon k-delete"]').click();
                }

            }
        });
        if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
           //SetOtherAirline(id);
        }
    }
    if ($("#Text_Agent").val() == "") {
        $('#MaxUsers,#MaxUser ').text('');
        //$("#divMultiOtherAirline ul li:visible").remove();
        //$('#Multi_OtherAirline').val('');
        //$('#FieldKeyValuesOtherAirline').val('');
        $("#divMultiOtherAirline").closest('td').find('[class="k-icon k-delete"]').click();
    }
}
//==========================End================================================================
if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    $('#spnTerminal').before('<font color="red"></font>');// by arman 2017-05-15
    $('#Text_Terminal').removeAttr('data-valid');
    $('#Text_Terminal').removeAttr('data-valid-msg');
    $('#Text_Terminal').closest('span').css('border-color', '');
    $('#spnTerminal').closest('td').find('font').text('');
    $('#OverrideAsAgreedonAWBPrint').prop('checked', true);
    $('#ViewRatewhileBooking').prop('checked', true);
    $('#EnableRateTabInReservation').prop('checked', true);
    $('#ShowBalanceCreditLimit').prop('checked', true);
    if ($('#Text_UserTypeSNo').val().toUpperCase() == "AIRLINE") {
        $('#OfficeSNo').closest("tr").hide();
        $('#Text_OfficeSNo').removeAttr('data-valid');
        $('#Text_Agent').removeAttr('data-valid')

        //  $('span#spnEmployeeID').show();
        //  $("#Text_EmployeeID").parent().parent().show();
        $('span#spnEmployeeID').show();
        $('#Text_EmployeeID').closest('td').contents().show();
    }
   else if ($("#Text_UserTypeSNo").val().toUpperCase() == "AGENT") {
        $('#ShowAsAgreedonAWBPrint ').prop('checked', false);
        $('#OverrideAsAgreedonAWBPrint').prop('checked', false);
        //$('#ShowAsAgreedonAWBPrint ').prop('disabled', true)
        $('#OverrideAsAgreedonAWBPrint').prop('checked', false);
        $('#ViewRatewhileBooking').prop('checked', false);
        $('#EnableRateTabInReservation').prop('checked', false);
        $('#ShowBalanceCreditLimit').prop('checked', false);
    }
    else if ($('#Text_UserTypeSNo').val().toUpperCase() == "GSA") {
        $('span#spnEmployeeID').hide();
        $('#Text_EmployeeID').closest('td').contents().hide();
        $('#OfficeSNo').closest("tr").show();
        $('#OtherAirlineAccess').closest("tr").show();
        $('#MLIsCityChangeAllowed').closest("tr").show();
        $("#Text_AirportSNo").attr('data-valid', 'required');
        $("#Text_OfficeSNo").attr('data-valid', 'required');
        $('#spnAgent').closest('td').contents().hide();
        $('#Text_Agent').closest('td').contents().hide();
        // $("#Text_Agent").removeAttr('data-valid')
        // $('td[title="Select Agent"]').text("");
        $('span#spnAgent').hide();
        // $("#Text_Agent").parent().parent().hide();
        $("#Text_Agent").removeAttr('data-valid');
      
    }
    else if ($('#Text_UserTypeSNo').val().toUpperCase() == "AGENT" || $('#Text_UserTypeSNo').val().toUpperCase() == "AJC") {
        $('span#spnEmployeeID').hide();
        $('#Text_EmployeeID').closest('td').contents().hide();
        $('#OfficeSNo').closest("tr").show();
        $('#OtherAirlineAccess').closest("tr").show();
        $('#MLIsCityChangeAllowed').closest("tr").show();
        $('span#spnAgent').show();

        $("#Text_Agent").parent().parent().show();
        $("#Text_Agent").attr('data-valid', 'required');

        $("#Text_AirportSNo").removeAttr('data-valid');

        $("#Text_OfficeSNo").attr('data-valid', 'required');
        $("#Text_Agent").attr('data-valid', 'required');


    }
    else {
        if ($('#Text_UserTypeSNo').val().toUpperCase() == "GHA/CTO") {


            $('#Text_Terminal').attr('data-valid');
            $('#Text_Terminal').attr('data-valid-msg');
            //     $('#Text_Terminal').closest('span').css('border-color', '');
            $('#spnTerminal').closest('td').find('font').text('*');
        }

        var closestTr = $('#OfficeSNo').closest("tr");
        closestTr.show();
        var closestTrr = $('#OtherAirlineAccess').closest("tr");
        closestTrr.show();
        var closestTrm = $('#MLIsCityChangeAllowed').closest("tr");
        closestTrm.show();
        $('span#spnEmployeeID').hide();
        $('#Text_EmployeeID').closest('td').contents().hide();

        $("#Text_AirportSNo").removeAttr('data-valid');

        //   $("#Text_Airline").removeAttr('data-valid');
        //  $("#spnAirline").parent().find("font").hide()


        $("#Text_OfficeSNo").attr('data-valid', 'required');
        $('span#spnOfficeSNo').show();
        $("#Text_OfficeSNo").parent().parent().show();


        $('span#spnAgent').closest('td').contents().hide();
        $("#Text_Agent").closest('td').contents().hide();
        $("#Text_Agent").removeAttr('data-valid');

    }
}

//function clearAgent() {
//    $('#Agent').val('');
//    $('#Text_Agent').val('');
//    $('#MaxUsers,#MaxUser ').text('');
//}


//function clearAllFields()
//{
//    clearAgent();
//    $('#CitySNo').val('');
//    $('#Text_CitySNo').val('');
//    $('#Text_OfficeSNo').val('');
//    $('#OfficeSNo').val('');

//}

if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    if ($("#Text_UserTypeSNo").val() != undefined && $("#Text_UserTypeSNo").val().toUpperCase() == "AIRLINE") {
        $('#Text_OfficeSNo, #OfficeSNo').val('');
    }
}


function SetDropDownValues() {
    $('span#spnEmployeeID').hide();
    $('#Text_EmployeeID').closest('td').contents().hide();
    var AgentSNo = userContext.AgentSNo || 0;
   
    $('#Text_UserTypeSNo').val(userContext.UserTypeName)
    $('#UserTypeSNo').val(userContext.UserType)
    $("#Text_UserTypeSNo").data("kendoAutoComplete").enable(false)

    $('#Text_Airline').val(userContext.AirlineName)
    $('#Airline').val(userContext.AirlineSNo)
    $("#Text_Airline").data("kendoAutoComplete").enable(false)
   // SetCityValue(AgentSNo);
    $('#Text_OfficeSNo').val(userContext.OfficeName)
    $('#OfficeSNo').val(userContext.OfficeSNo)
   // $("#Text_OfficeSNo").data("kendoAutoComplete").enable(false);

    $('#Text_GroupSNo').val(userContext.GroupName)
    $('#GroupSNo').val(userContext.GroupSNo)
    $("#Text_GroupSNo").data("kendoAutoComplete").enable(false)

    $('#Text_Agent').val(userContext.AgentName)
    $('#Agent').val(userContext.AgentSNo)   
   //$("#Text_Agent").data("kendoAutoComplete").enable(false);
    var GroupName = $('#Text_GroupSNo').val() || ""
    CheckMultiCityAccess(GroupName, AgentSNo);
    GetMaxUsers();
    $('#MLIsCityChangeAllowed').attr('disabled', true);
    $('#OtherAirlineAccess').removeAttr('disabled');
}


function CheckMultiCityAccess(GroupName,AgentSNo) {
    $.ajax({
        url: "Services/Permissions/UsersService.svc/CheckMultiCityAccess?GroupName=" + GroupName + "&AgentSNo=" + AgentSNo, type: "get", async: false, dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.length;
            var resData1 = Data.Table0
            var resData2 = Data.Table1
            if (resData1.length > 0) {
                if (resData1[0].IsMultiAccess == "FALSE") {
                    $('#MLIsCityChangeAllowed').removeAttr('disabled');
                    $('#MLIsCityChangeAllowed').attr('disabled', true);
                }
                else {
                    $('#MLIsCityChangeAllowed').removeAttr('disabled');
                   // $('#OtherAirlineAccess').removeAttr('disabled');
                }
            }   
            if (resData2.length > 0) {
                var AgentSno = $('#Agent').val()
                if (resData2[0].AccountTypeSNo != 0 && AgentSno.indexOf('-')< 0) {
                    $('#Agent').val(AgentSno + '-' + resData2[0].AccountTypeSNo)
                }
            }
        }
    });

}


function setdropdownEdit() {
    //$("#Text_UserTypeSNo").data("kendoAutoComplete").enable(false)
    $("#Text_Airline").data("kendoAutoComplete").enable(false)
   // $("#Text_OfficeSNo").data("kendoAutoComplete").enable(false)
    $("#Text_GroupSNo").data("kendoAutoComplete").enable(false)
    //$("#Text_Agent").data("kendoAutoComplete").enable(false);

    GetMaxUsers();
    var GroupName = $('#Text_GroupSNo').val() || "";
    var AgentSNo = userContext.AgentSNo || 0;
    CheckMultiCityAccess(GroupName, AgentSNo);
    $('#OtherAirlineAccess').removeAttr('disabled');
    $('#MLIsCityChangeAllowed').attr('disabled', true);
   var tg = $('input[id=OtherAirlineAccess]:checked').val();
    if (tg == "1") {
        OtherAirlineAccessfn();
    }
   
}
 
function SetOtherAirline(e) {
    var id = (this.dataItem(e.item.index())).Key.split('-')[0];// Added by Devendra
    if ($("#Agent").val() != "0" && id != "0") {
        $.ajax({
            url: "Services/Permissions/UsersService.svc/GetOtherAirlinesForAgent?AgentSNo=" + id, type: "get", async: false, dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData1 = Data.Table0
                $("#divMultiOtherAirline").closest('td').find('[class="k-icon k-delete"]').click();
                if (resData1.length > 0) {
                    $('#OtherAirlineAccess').removeAttr('disabled');
                    $('input[id=OtherAirlineAccess][value=0]').prop("checked", true);
                    // if ($("#divMultiOtherAirline ul li:visible").length > 0) {
                    //     $("#divMultiOtherAirline ul li:visible").remove();
                    //     $('#Multi_OtherAirline').val('');
                    //     $('#FieldKeyValuesOtherAirline').val('');
                    //}
                    otherairlineset();
                    $("#OtherAirline").val(resData1[0].SNo);
                    $("#Text_OtherAirline").val(resData1[0].AirlineName);
                    cfi.BindMultiValue("OtherAirline", $("#Text_OtherAirline").val(), $("#OtherAirline").val());
                }

            }
        });
    }
}


function OtherAirlineAccessfn() {
   

        var closestTr = $('#OtherAirline').closest("tr");
        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
        closestTr.find($("#spnOtherAirline")).hide();
        closestTr.find($("#Text_OtherAirline")).hide();
        closestTr.find($("#divMultiOtherAirline")).hide();
        //closestTr.find("td:eq(2) span").hide();
        closestTr.find($("#Text_OtherAirline")).parent().hide();
        var closestH = $('input:text[id^=Text_OtherAirline]').closest('tr');
        closestH.find('td font').hide();
        $("#OtherAirline").val('');
        $("#Text_OtherAirline").val('');
        $('#divMultiOtherAirline ul li span').not('span[id="FieldKeyValuesProducts"]').click();
        $("#divMultiOtherAirline").find('ul >li').each(function (i) {
            if (i > 0) {
                $("#Multi_OtherAirline").val('');
                $('span[id*=FieldKeyValuesOtherAirline]')[0].Content = '';
                $("#divMultiOtherAirline").find('ul >li').eq(1).hide();
            }
        });
    }

function otherairlineset() {
    var closestTrA = $('#OtherAirline').closest("tr");
    //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
    closestTrA.find($("#spnOtherAirline")).show();
    closestTrA.find($("#Text_OtherAirline")).show();
    closestTrA.find($("#divMultiOtherAirline")).show();
    //closestTr.find("td:eq(1) span").hide();
    closestTrA.find($("#Text_OtherAirline")).parent().show();
    $('input:text[id^=Text_OtherAirline]').val('')
    var closestHA = $('input:text[id^=Text_OtherAirline]').closest('tr');
    closestHA.find('td font').show();

}


function ReloadGrid() {
window.location.reload();
}

