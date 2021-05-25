
$(document).ready(function () {
    // Laxmikanta Pradhan (on 24-jan-2017)
    var usertypelist = [{ Key: "0", Text: "Airline" }, { Key: "1", Text: "Agent" }, { Key: "2", Text: "GSA" }, { Key: "3", Text: "GHA/CTO" }]
    cfi.AutoCompleteByDataSource("UserTypeSNo", usertypelist, userTypeBind);
    cfi.AutoComplete("EmployeeID", "Name", "vwUserEmployee", "SNo", "Name", null, null, "contains");

      cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");//Added by Shatrughana Gupta on 10-02-2017
    //cfi.AutoComplete("Agent", "Name", "v_User_Agent", "SNo", "Name", ["Name"], null, "contains"); //Commented by Shatrughana Gupta
    cfi.AutoComplete("Agent", "Name", "V_BindAgent", "SNo", "Name", ["Name"], GetMaxUsers, "contains"); //Added by Shatrughana Gupta
    cfi.ValidateForm();

    cfi.AutoComplete("Designation", "Name", "DesignationMaster", "SNo", "Name", null, null, "contains");
    cfi.AutoComplete("Terminal", "TerminalName", "Terminal", "SNo", "TerminalName", null, null, "contains", null, null, null,null, nchange);
    cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains", null, null, null, null, GetCityData);
    cfi.AutoComplete("MobileCountryCode", "ISDCode", "Vw_GetISDCodeFromCityCountryCode", "ISDCode", "ISDCode", null, readOnlyfield, "contains");
    cfi.AutoComplete("AirportSNo", "AirportCode,AirportName", "Votherairport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains", null, null, null, null, RemoveField);
   
    // changes by arman ali for binding others airport
    if ($('#Text_UserTypeSNo').val() == "") {
        $('#MLIsCityChangeAllowed').attr('disabled', true);
        $('#OtherAirlineAccess').attr('disabled', true);
    }
    else {
        $('#MLIsCityChangeAllowed').attr('disabled', false);
        $('#OtherAirlineAccess').attr('disabled', false);
    }
    cfi.AutoComplete("AllowCitySNo", "AirportCode", "Votherairport", "SNo", "AirportCode", ["AirportCode"], null, "contains", ",", null, null,null, RemoveRequired);
    cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains", ",", null, null, null, RemoveRequired);
  //  cfi.AutoComplete("OtherAirline", "CarrierCode", "v_Airline_NonInternal", "SNo", "CarrierCode", null, RemoveRequired, "contains", ",");// commented by arman ali
    //  bind multi
   cfi.BindMultiValue("AllowCitySNo", $("#Text_AllowCitySNo").val(), $("#AllowCitySNo").val());
    cfi.BindMultiValue("OtherAirline", $("#Text_OtherAirline").val(), $("#OtherAirline").val());
    cfi.AutoComplete("GroupSNo", "GroupName", "Groups", "SNo", "GroupName", ["GroupName"], null, "contains", null, null, null, null, OnAdminChange);
    cfi.AutoComplete("NameSNo", "WeighingScaleID,Name", "vwWeighingScale", "SNo", "WeighingScaleID", ["WeighingScaleID", "Name"], null, "contains");
    cfi.AutoComplete("OfficeSNo", "Name", "v_Office", "SNo", "Name", null, null, "contains");
    // by arman 2017-05-16 : hide weighing scale td
    $('#spnNameSNo').closest('td').contents().hide();
    $('#Text_NameSNo').closest('td').contents().hide();
    //= end
  
    
    //******************************************************************NEW MODE******************************//
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $('#spnTerminal').closest('td').find('font').remove();

        $('#spnTerminal').before('<font color="red">*</font>');// by arman 2017-05-15
        $("#Text_Designation").data("kendoAutoComplete").enable(false);// by arman ali date 2017-05-16 : disable designation tab
     }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        userTypeBind();
        //$('#Text_UserTypeSNo').live('keydown', function (e) {
        //    debugger;
        //    var code = e.keyCode || e.which;
        //    if (code == 9) {
        //        $('#Text_UserTypeSNo').unbind('keydown', userTypeBind());
        //        // e.preventDefault();
        //        //  alert('tab');
        //    }
        //});
       
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
       
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
    }
    //******************************************************************NEW MODE END******************************//

    $("input[name='operation']").unbind("click").click(function () {
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
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            
               
                AuditLogSaveNewValue("tbl");
            }
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

    $('#spn').closest('td').attr('title', 'Enter Password');
    
    // commented by arman 
  

    //******************************************************************READ MODE******************************//
    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
        if ($("input[name='UserTypeSNo']:checked").val() == 0) {
          //  cfi.AutoComplete("UserTypeValue", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");

          //  $("span#spnUserTypeValue").text('Airline');
            $('#Terminal').removeClass('valid_invalid');
            $('#Terminal').removeAttr('data-valid');
            $('#Terminal').removeAttr('data-valid-msg');
            $('#Terminal').closest('td').find('.valid_errmsg').css('display', 'none');
            $('#Text_Terminal').removeClass('valid_invalid');
            $('#Text_Terminal').removeAttr('data-valid');
            $('#Text_Terminal').removeAttr('data-valid-msg');
            $('#Text_Terminal').closest('td').find('.valid_errmsg').css('display', 'none');
            $('#Text_Designation').removeClass('valid_invalid');
            $('#Text_Designation').removeAttr('data-valid');
            $('#Text_Designation').removeAttr('data-valid-msg');
            $('#Text_Designation').closest('td').find('.valid_errmsg').css('display', 'none');
            $("#Text_Designation").data("kendoAutoComplete").enable(false);
        }
        else if ($("input[name='UserTypeSNo']:checked").val() == 1) {
          //  cfi.AutoComplete("UserTypeValue", "Name", "Account", "SNo", "Name", null, null, "contains");
           // $("span#spnUserTypeValue").text('Agent');
            $('#Terminal').removeClass('valid_invalid');
            $('#Terminal').removeAttr('data-valid');
            $('#Terminal').removeAttr('data-valid-msg');
            $('#Terminal').closest('td').find('.valid_errmsg').css('display', 'none');
            $('#Text_Terminal').removeClass('valid_invalid');
            $('#Text_Terminal').removeAttr('data-valid');
            $('#Text_Terminal').removeAttr('data-valid-msg');
            $('#Text_Terminal').closest('td').find('.valid_errmsg').css('display', 'none')
            $('#Text_Designation').removeClass('valid_invalid');
            $('#Text_Designation').removeAttr('data-valid');
            $('#Text_Designation').removeAttr('data-valid-msg');
            $('#Text_Designation').closest('td').find('.valid_errmsg').css('display', 'none');
       //     $("#Text_Designation").data("kendoAutoComplete").enable(false);
        }
        else if ($("input[name='UserTypeSNo']:checked").val() == 2) {
        //    cfi.AutoComplete("UserTypeValue", "Name", "vwUserEmployee", "SNo", "Name", null, OnSelectEmployeeProcess, "contains"); $("span#spnUserTypeValue").text('Employee ID');
            $('#Terminal').attr('data-valid', 'required');
            $('#Terminal').attr('data-valid-msg', 'Select Terminal.');
            $('#Text_Terminal').attr('data-valid', 'required');
            $('#Text_Terminal').attr('data-valid-msg', 'Select Terminal.');
            $('#Text_Designation').attr('data-valid', 'required');
            $('#Text_Designation').attr('data-valid-msg', 'Select Designation.');
            $("#Text_Designation").data("kendoAutoComplete").enable(true);
        }
        var rNo = 0;
        $('.formlabelUSR').each(function () {
            if (rNo == 1 && ($('input:radio[name=UserTypeSNo]:checked').val() == 0 || $('input:radio[name=UserTypeSNo]:checked').val() == 1))
                this.innerHTML = '<span id="spnTerminal">Terminal</span>';
            else if (rNo == 2 && ($('input:radio[name=UserTypeSNo]:checked').val() == 0 || $('input:radio[name=UserTypeSNo]:checked').val() == 1))
                this.innerHTML = '<span id="spnDesignation">Designation</span>';
            else if (rNo == 2 && ($('input:radio[name=UserTypeSNo]:checked').val() == 2))
                this.innerHTML = '<font color="red">*</font><span id="spnDesignation">Designation</span>';
            rNo += 1;
        });
    }
    //******************************************************************READ MODE END******************************//

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

        $("#Text_Designation").data("kendoAutoComplete").enable(false);
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
    }
    //=======================================Update Case =========================================================
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if ($('#UserTypeText').val() == "AIRLINE") {

            var closestTr = $('span#spnOfficeSNo').closest("tr");
            closestTr.hide();
            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.show();

            $('span#spnEmployeeID').show();
            //$("#Text_EmployeeID").parent().parent().show();

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
                cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
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
        else if ($("#Text_UserTypeSNo").val() == "AGENT") {
          //  $('span#spnEmployeeID').hide();
          //  $("#Text_EmployeeID").parent().parent().hide();
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.show();
            //var closestTrr = $('#spnMLIsCityChangeAllowed').closest("tr");
            //closestTrr.show();

            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.hide();
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
        else if ($("#Text_UserTypeSNo").val() == "GSA") {
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
            cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
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
            else
            {
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
            cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
            //Added By Shatrughana Gupta
        }
        $('.floatingHeader').css('display', 'none');
        if ($('#UserTypeText').val() == "Airline")
            $("span#spnText_UserTypeValue").text('Airline');
        else if ($('#UserTypeText').val() == "Agent")
            $("span#spnText_UserTypeValue").text('Agent');
        else
            $("span#spnText_UserTypeValue").text('Employee ID');
        // Changes by vkumar task #38
        if ($("#UserTypeText").val() == "FORWARDER (AGENT)") {
            $("span#spnOfficeSNo").text('GSA Name');
        }
        else {
            $("span#spnOfficeSNo").text('Office Name');
        }
        //Ends
    }
    if ((getQueryStringValue("FormAction").toUpperCase() == "READ") ) {
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
        if ($("#UserTypeText").val() == "FORWARDER (AGENT)") {
            $("span#spnOfficeSNo").text('GSA Name');
        }
        else {
            $("span#spnOfficeSNo").text('Office Name');
        }
        //Ends
    }

 
});
//******************************************************************Document.Ready Closed******************************//

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
        }
        else {
            $('#MLIsCityChangeAllowed').attr('disabled', false);
            $('#OtherAirlineAccess').attr('disabled', false);
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
            cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");

            //cfi.AutoComplete("OtherAirline", "CarrierCode", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode"], RemoveRequired, "contains", ",");//Commented by Shatrughana Gupta-10-02-2017
            cfi.AutoComplete("OtherAirline", "AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["AirlineName"], RemoveRequired, "contains", ",");//Added by Shatrughana Gupta on 10-02-2017

            //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "Airport", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");
            //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "v_OtherAirport_Branch", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");
            //cfi.AutoComplete("AllowCitySNo", "SNo", "v_OtherAirport_Branch", "SNo", "AirportName", ["SNo"], RemoveRequired, "contains", ",");
            // added by arman ali
            cfi.AutoComplete("AllowCitySNo", "AirportCode", "Votherairport", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");
            // cfi.AutoComplete("AllowCitySNo", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], RemoveRequired, "contains", ",");
            // cfi.AutoComplete("AllowCitySNo", "AirportCode", "v_OtherAirport_Branch", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");

        }
        else if ($("#Text_UserTypeSNo").val().toUpperCase() == "AGENT") {
            clearFields();
            $('span#spnEmployeeID').hide();
            $('#Text_EmployeeID').closest('td').contents().hide();
            var closestTr = $('#OfficeSNo').closest("tr");
            closestTr.show();
            var closestTrr = $('#spnMLIsCityChangeAllowed').closest("tr");
            closestTrr.show();

            var closestTrr = $('#OtherAirlineAccess').closest("tr");
            closestTrr.hide();
            $('span#spnAgent').show();
            // $('td[title="Select Agent"]').text("Agent");
            $("#Text_Agent").parent().parent().show();
            $("#Text_Agent").attr('data-valid', 'required');

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
            //  cfi.ResetAutoComplete("OtherAirline");
            //  DivReset();
            DivResetAirport();
            cfi.AutoComplete("OtherAirline", "AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["AirlineName"], RemoveRequired, "contains", ",");//Added by Shatrughana Gupta on 10-02-2017

            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_Associated", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
            //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "v_OtherAirport_Branch", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");

            cfi.AutoComplete("AllowCitySNo", "SNo", "Votherairport", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");

            //Added by Shatrughana Gupta on 10-02-2017
            cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            // cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_Associated", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
            // cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "v_OtherAirport_Branch", "SNo", "AirportName", ["AirportName", "CityName"], null, "contains", ",");
            // cfi.AutoComplete("AllowCitySNo", "SNo", "v_OtherAirport_Branch", "SNo", "AirportName", ["SNo"], RemoveRequired, "contains", ",");
            //  cfi.AutoComplete("AllowCitySNo", "AirportCode", "Votherairport", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");

            //Added by Shatrughana Gupta on 10-02-2017
            // cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");

        }
        else if ($("#Text_UserTypeSNo").val().toUpperCase() == "GSA") {
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
            cfi.AutoComplete("OtherAirline", "AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["AirlineName"], RemoveRequired, "contains", ",");//Added by Shatrughana Gupta on 10-02-2017

            //cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_Associated", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");
            //cfi.AutoComplete("AllowCitySNo", "AirportName,CityName", "v_OtherAirport_Branch", "SNo", "AirportName", ["AirportName", "CityName"], RemoveRequired, "contains", ",");

            cfi.AutoComplete("AllowCitySNo", "SNo", "Votherairport", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");

            //Added by Shatrughana Gupta on 10-02-2017
            cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");

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
            cfi.AutoComplete("AllowCitySNo", "SNo", "Votherairport", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");
            //Added by Shatrughana Gupta on 10-02-2017
            cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            cfi.AutoComplete("OtherAirline", "AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["AirlineName"], RemoveRequired, "contains", ",");//Added by Shatrughana Gupta on 10-02-2017
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
    var expiarydate = new Date($("#UserExpiaryDate").val());
    var today = new Date();

    if (expiarydate <= today) {
        ShowMessage('warning', 'Warning - Expiary Date Vallidation!', "Expiary Date should be greater than Current date");
        return false;
    }
});

$('input[type="submit"][name="operation"][value="Save"]').click(function () {
    var expiarydate = new Date($("#UserExpiaryDate").val());
    var today = new Date();

    if (expiarydate <= today) {
        ShowMessage('warning', 'Warning - Expiary Date Vallidation!', "Expiary Date should be greater than Current date");
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

    //======================Add By:Pradeep Sharma==================================
    if (textId == "Text_CitySNo") {
        $('#AirportSNo').val('');
        $('#Text_AirportSNo').val('');
        //$('#WareHouseMasterSNo').val('');
        //$('#Text_WareHouseMasterSNo').val('');
    }
    //Added by Shatrughana
    if (textId == "Text_Agent")
    {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        
        if (textId.indexOf("Agent") >= 0) {
            cfi.setFilter(filterConsolidatorSNo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key());
            cfi.setFilter(filterConsolidatorSNo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key());
            cfi.setFilter(filterConsolidatorSNo, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoAutoComplete").key());
           
        }
    }
    //------End Text by Shatrughana
    //========================================== Added by arman ali=======================================================//
    if (textId == "Text_AllowCitySNo"  &&  $('#UserTypeSNo').val() == "2" ){

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        if (textId.indexOf("CitySNo") >= 0) {
            cfi.setFilter(filterConsolidatorSNo, "ParentID", "in", $("#Text_OfficeSNo").data("kendoAutoComplete").key());
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_AirportSNo").data("kendoAutoComplete").key());   
        }
           
    }
    if (textId == "Text_AllowCitySNo" && $('#UserTypeSNo').val() == "1") {

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        if (textId.indexOf("CitySNo") >= 0) {
            cfi.setFilter(filterConsolidatorSNo, "OtherAirport", "in", $("#Text_Agent").val());
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_AirportSNo").data("kendoAutoComplete").key());   
        }

    }
  
    if (textId == "Text_AllowCitySNo" && $('#UserTypeSNo').val() == "0") {

        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        if (textId.indexOf("CitySNo") >= 0) {
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_AirportSNo").data("kendoAutoComplete").key()); 
        }
    }
    if (textId == "Text_AllowCitySNo" && $('#UserTypeSNo').val() == "3") {

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
        if ($('#UserTypeSNo').val() == '1' || $('#UserTypeSNo').val() == '2')
        {
            cfi.setFilter(filterEmbargo, "OfficeType", "neq", '2')
            cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key())
        }
        if ($('#UserTypeSNo').val() == '3') {
            cfi.setFilter(filterEmbargo, "OfficeType", "eq", '2')
           // cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_Airline").data("kendoAutoComplete").key())
        }
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }

    //End of Text_Terminal By Pankaj Khanna


    if (textId == "Text_AllowWarehouseSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $("#Text_AllowCitySNo").data("kendoAutoComplete").key() || $("#Text_CitySNo").data("kendoAutoComplete").key());

    }
    //==============================End==============================================

    //============================= changes done by arman ali fro gsa and airline ===================================//  
    var filterOtherAirline = cfi.getFilter("AND");
    if (textId == "Text_OtherAirline" && $('#UserTypeSNo').val() == '0') {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_Airline").data("kendoAutoComplete").key())
        cfi.setFilter(filterConsolidatorSNo, "IsInterline", "eq", 0);

      
    }
    if (textId == "Text_OtherAirline" && $('#UserTypeSNo').val() == '3') {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_Airline").data("kendoAutoComplete").key())
       
    }
    if (textId == "Text_OtherAirline" && $('#UserTypeSNo').val() == '2') {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "IsInterline", "eq", 0);
        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_Airline").data("kendoAutoComplete").key())
        cfi.setFilter(filterConsolidatorSNo, "OfficeSNo", "in", $("#Text_OfficeSNo").data("kendoAutoComplete").key());
      
    }
   
    if (textId == "Text_Airline" && ($('#UserTypeSNo').val() == '0' || $('#UserTypeSNo').val() == '1' || $('#UserTypeSNo').val() == '2')) {
        cfi.setFilter(filterConsolidatorSNo, "IsInterline", "eq",  0);
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
    }
    if (textId == "Text_Airline" && ($('#UserTypeSNo').val() == '3' )) {
  
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
    }
        //====================================End===============================================
   
        //=== by arman ali 22 apr 2017==============
    else if (textId == "Text_GroupSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        if ($('#UserTypeSNo').val() == '1') {
            cfi.setFilter(filterConsolidatorSNo, "GroupName", "eq", "AGENT")
        }
        else if ($('#UserTypeSNo').val() == '2') {
            cfi.setFilter(filterConsolidatorSNo, "GroupName", "eq", "GSA")
        }

// ======= end======================================

    }
        // By arman Date 2017-05-16 : filtering mobile countrycode on the basic of countrycode;
    else if (textId == "Text_MobileCountryCode") {
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "eq", $('#CitySNo').val());

      
    }
    //======end
    var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterConsolidatorSNo);
    return RegionAutoCompleteFilter;
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
    $('#Terminal').val('');
    $('#Text_Terminal').val('');
    $('#Text_NameSNo').val('');
    $('#NameSNo').val('');
    $('#AllowCitySNo').val('');
    $('#Text_AllowCitySNo').val('');
    $('#divMultiAllowCitySNo span[id][class]').closest('li').remove();
    $('#Multi_AllowCitySNo').val('');
    $('#FieldKeyValuesAllowCitySNo').text('');

    try {
        $.ajax({
            url: "Services/Permissions/UsersService.svc/GetAirportOfficeInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CitySNo: $("#CitySNo").val() == undefined ? "" : $("#CitySNo").val() }),
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
    cfi.AutoComplete("AllowCitySNo", "AirportCode", "Votherairport", "SNo", "AirportCode", ["AirportCode"], RemoveRequired, "contains", ",");
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
                }
                else if (result == 1) {
                    // alert("Password reset link has been sent on respective user's E-mail Address.");
                    ShowMessage('warning', 'Warning', "Your Email-ID is not available for sending password. Can’t reset password.");//"Kindly provide Email Id of respective user."
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
    
    $('#spnTerminal').before('<font color="red">*</font>');// by arman 2017-05-15
    $('#Text_Terminal').removeAttr('data-valid');
    $('#Text_Terminal').removeAttr('data-valid-msg');
    $('#Text_Terminal').closest('span').css('border-color', '');
    $('#spnTerminal').closest('td').find('font').text('');
    if ($('#UserTypeSNo').val() == '0') {
        $('#OfficeSNo').closest("tr").hide();
        $('#Text_OfficeSNo').removeAttr('data-valid');
        $('#Text_Agent').removeAttr('data-valid')
        $('span#spnEmployeeID').show();
        $("#Text_EmployeeID").parent().parent().show();
        
    }

    else if ($('#UserTypeSNo').val() == '2') {
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
    else if ($("#UserTypeSNo").val() == "1") {
        $('span#spnEmployeeID').hide();
        $('#Text_EmployeeID').closest('td').contents().hide();
        $('#OfficeSNo').closest("tr").show();
        $('#OtherAirlineAccess').closest("tr").hide();
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
        if ($("#UserTypeSNo").val() == "3") {
            $("#Text_Terminal").attr('data-valid', 'required');
            $("#Text_Terminal").attr("data-valid-msg", 'Terminal is required');
            $('#spnTerminal').closest('td').find('font').text('');
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
   cfi.AutoComplete("OtherAirline", "CarrierCode,AirlineName", "v_Airline_NonInternal", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], RemoveRequired, "contains", ",");

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


if (getQueryStringValue("FormAction").toUpperCase() == "READ")
{
    if ($("#UserTypeText").val() == "GHA/CTO") {
        $("[title='Employee Name']").closest('td').text('')
        $("#EmployeeID").closest('td').contents().hide();
        $("[title='Agent']").closest('td').text('')
        $("#Agent").closest('td').contents().hide();
    }
    if ($("#UserTypeText").val() == "GSA") {
        $("[title='Employee Name']").closest('td').text('')
        $("#EmployeeID").closest('td').contents().hide();
        $("[title='Agent']").closest('td').text('')
        $("#Agent").closest('td').contents().hide();
    }
    if ($("#UserTypeText").val() == "AIRLINE") {
        $("[title='Employee Name']").closest('td').text('')
        $("#EmployeeID").closest('td').contents().hide();
        $("#OfficeSNo").closest('tr').hide();
    }
    if ($("#UserTypeText").val() == "AGENT") {
        $("[title='Employee Name']").closest('td').text('')
        $("#EmployeeID").closest('td').contents().hide();
       
    }
   


}

//==========================Added by Arman ali Date: 30-03-2017


$('#Text_Agent').after('&nbsp&nbsp&nbsp' + '<div id="MaxUsers" style="display:inline-flex; color:black;"></div>');
$('#MaxUsers').after('&nbsp&nbsp' + '<div id="MaxUser" style="display:inline-flex; color:Red"></div>');
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    if ($('#UserTypeSNo').val()=='1')
        GetMaxUsers();
    else
        $('#MaxUsers,#MaxUser ').text('');
}

function GetMaxUsers() {
    $('#Text_Agent').live('keydown', function (e) {
        var code = e.keyCode || e.which;
        if (code == 9) {
            // e.preventDefault();
            //  alert('tab');
        }
    });
    var id = $("#Agent").val();
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
                $('#MaxUser').text('  ' + myData.MaxUsers);
                if (getQueryStringValue("FormAction").toUpperCase() == "NEW" && myData.MaxUsers == 0) {
                    alert("warning Maximum Users limit Exceeded For " +  $('#Text_Agent').val() + " Agent");
                    $('#Agent').val('');
                    $('#Text_Agent').val('');
                  //  $('#MaxUser').text('');
                  //  $('#MaxUsers').text('')
                    
                }
                
            }
        });
    }
    if ($("#Text_Agent").val()=="")
        $('#MaxUsers,#MaxUser ').text('');

   
}
//==========================End================================================================
if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
   
    if ($('#UserTypeSNo').val() == '0') {
        $('#OfficeSNo').closest("tr").hide();
        $('#Text_OfficeSNo').removeAttr('data-valid');
        $('#Text_Agent').removeAttr('data-valid')

        //  $('span#spnEmployeeID').show();
        //  $("#Text_EmployeeID").parent().parent().show();
        $('span#spnEmployeeID').show();
        $('#Text_EmployeeID').closest('td').contents().show();
    }

    else if ($('#UserTypeSNo').val() == '2') {
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
    else if ($("#UserTypeSNo").val() == "1") {
        $('span#spnEmployeeID').hide();
        $('#Text_EmployeeID').closest('td').contents().hide();
        $('#OfficeSNo').closest("tr").show();
        $('#OtherAirlineAccess').closest("tr").hide();
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
    if ($("#UserTypeSNo").val() == "0") {
        $('#Text_OfficeSNo, #OfficeSNo').val('');
    }
  }
   