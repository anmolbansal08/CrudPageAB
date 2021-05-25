﻿/// <reference path="../../Services/Master/AirlineService.svc" />
function AddDiv(imgpath) {
    if (!$("#aspnetForm").find("#LogoPopup").length > 0) {
        var divoverlays = $("<div>").attr({ id: "overlays" });
        divoverlays.css({ display: 'none', position: 'fixed', top: '0%', left: '0%', width: '100%', height: '100%', 'background-color': 'black', 'z-index': '101', '-moz-opacity': '0.8', 'opacity': '.65' });
        $("#aspnetForm").append(divoverlays);
        var div = $("<div id='LogoPopup' style='text-alight:center'></div>");
        div.css({ "text-align": "center" });
        var img = $("<img/>").attr({ "src": imgpath })
        img.css({ "height": "100px", width: "100px" });
        $("#aspnetForm").append(div.append(img));
    }
}
function openWindow(div, Title)
{
    var window = $("#" + div);
    window.css({ "display": "block" });
    $("#overlays").css({ "display": "block" });
    undo = $("#undo");
    undo.bind("click", function ()
    {
        window.data("kendoWindow").open();
        undo.hide();
    });
    if (!window.data("kendoWindow")) {
        window.kendoWindow({
            width: "300px",
            actions: ["Minimize", "Maximize", "Close"],
            title: Title,
            close: function () {
                undo.show();
                $("#overlays").css({ "display": "none" });
            }
        });
    }
    else {
        window.data("kendoWindow").open();
    }
    var margin = Math.floor(($(document).width() - window.width()) / 2);
    $(".k-window,.widget ").css({ "left": margin.toString() + 'px' });
    var top = Math.floor(($(document).height() - window.height()) / 2);
    $(".k-window,.widget ").css({ "top": top.toString() + 'px' });
    $(".k-window-title").css({ "font-weight": 'bold' });
}
//function OnSelectCurrency(e) {
//    var Data = this.dataItem(e.item.index());
//    $.ajax({
//        type: "POST",
//        url: "./Services/Master/AirlineService.svc/GetCurrency?recid=" + Data.Key,
//        data: { id: 1 },
//        dataType: "json",
//        success: function (response) {
//            var code = response.Data[0];
//            var text = response.Data[1];
//            $("#CurrencyCode").val(code);
//            $("#Text_CurrencyCode").val(code);

//        }
//    });

//}

function splitPartnerAirline() {
    var str = "How are you doing today?";
    var res = str.split(" ");

}


function blank() {
    $('#Text_SCMDays').val('')

}


var strData = [];
function checkNumeric(id) {
    if (!$.isNumeric($('#' + id).val()) || $('#' + id).val() == '') {
        $('#' + id).val('');
        $('#' + id).focus();
        alert('Enter only numbers.');
        $('#' + id).css({
            "border": "1px solid red",
            "background": "#FFCECE"
        });
        //return false;
    }
}
var pageType;
$(document).ready(function () {
    cfi.ValidateForm();
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    pageType = getQueryStringValue("FormAction").toUpperCase();


    $('#AWBDuplicacy').on('blur', function () {
        if ($('#AWBDuplicacy').val() == 0) {
            $('#AWBDuplicacy').val("");
            $('#_tempAWBDuplicacy').val("");
        }
    })

    $('#AWBDuplicacy').keypress(function (e) {

        if (e.keyCode == 13)
            $("#AWBDuplicacy").blur();

    })

    $('#CreditLimit,#_tempCreditLimit').unbind('focusin').bind('focusin', function () {
        if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
            if ($('#CreditLimit').val() == '')
                $('#CreditLimit').val(0);
            if ($('input:radio[name=IsAllowedCL]:checked').val() == 1)
                $('#CreditLimit').attr('readonly', true);
            else if (parseInt($('#CreditLimit').val()) != 0)
                $('#CreditLimit').attr('readonly', true);
            else
                $('#CreditLimit').attr('readonly', false);
        }
    })

    var oldminCl = $("#MinimumCL").val();
    $("#MinimumCL").bind("blur", function () {
        var crlmt = $("#CreditLimit").val();
        var minlmt = $("#MinimumCL").val();
        if (crlmt == '' || parseInt(crlmt) == 0) {
            $("#_tempMinimumCL").val(0);
            $("#MinimumCL").val(0);
            $("#_tempAlertClPerCentage").val(0);
            $("#AlertClPerCentage").val(0);
        }
        if (parseInt(crlmt) < parseInt(minlmt)) {
            $("#_tempMinimumCL").val(oldminCl);
            $("#MinimumCL").val(oldminCl);
            ShowMessage('warning', 'Warning - Account!', "Minimum Credit Limit can not exceed the Credit Limit");
        }

    });


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

    $("#AlertCLPercentage").bind("blur", function () {
        if ($(this).val() != undefined && $(this).val() > 100) {
            alert("Alert Credit Limit(%) can not greater than 100");
            $("#AlertCLPercentage").val("");
            $("#AlertCLPercentage").val("");
            return false;
        }
        else
            $(this).val();
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowHideCreditLimitInformation();
    }

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
                var AirlineSNo = $('#hdnTXTAirlinesno').val();
                $.ajax({
                    type: "POST",
                    url: "./Services/Master/AirlineService.svc/GetCreditLimit?recid=" + AirlineSNo,
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

    });


    $('#Commission').blur(function ()
    {

        if ($('#Commission').val() <= 0 && $('#Commission').val() != "")
        {
            ShowMessage('warning', 'Need your Kind Attention!', 'Commission should be greater than 0.');
            $('#Commission').val('');
            $('#_tempCommission').val('');
            return false;
        }
        else if ($('#Commission').val() > 100) {
            ShowMessage('warning', 'Need your Kind Attention!', 'Commission cannot be greater than 100.');
            $('#Commission').val('');
            $('#_tempCommission').val('');
            return false;
        }

    });



    $("#AirlineLogoPreview").attr("value", "Airline Logo");
    $("#AwbLogoPreview").attr("value", "AWB Logo");

    $('#MobileCountryCode').keypress(function (e) {
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode != 43 && iKeyCode != 45 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
            return false;

        $('#MobileCountryCode').attr('onchange', 'checkNumeric(\"MobileCountryCode\");');
    });


    // $("#PhoneCountryCode").intlTelInput();

    $('#PhoneCountryCode').keypress(function (e)
    {
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode != 43 && iKeyCode != 45 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
            return false;
        $('#PhoneCountryCode').attr('onchange', 'checkNumeric(\"PhoneCountryCode\");');
    });

    $('#CityPrefixCode').keypress(function (e)
    {
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode != 43 && iKeyCode != 45 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
            return false;
        $('#CityPrefixCode').attr('onchange', 'checkNumeric(\"CityPrefixCode\");');
    });
    $('#MobileNo').keypress(function (e)
    {
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
            return false;
        $('#MobileNo').attr('onchange', 'checkNumeric(\"MobileNo\");');
    });

    $('#aspnetForm').attr("enctype", "multipart/form-data");
    cfi.AutoComplete("CurrencyCode", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyName", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("AirportCode", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    //cfi.AutoComplete("CountryName", "CountryCode,CountryName", "vwCountry", "SNo", "CountryName", [, "CountryCode","CountryName"], null, "contains");
    cfi.AutoComplete("CountryName", "CountryCode,CountryName", "vwCountry", "SNo", "CountryName", ["CountryCode", "CountryName"], CountryCodeChange, "contains");
    //cfi.AutoComplete("InvoicingCycle", "InvoicingCycle", "Airline", "InvoicingCycle", "InvoicingCycle", ["InvoicingCycle"], null, "contains");
    var AirlineMember = [{ Key: "1", Text: "None" }, { Key: "2", Text: "ICH" }, { Key: "3", Text: "ACH" }];
    cfi.AutoCompleteByDataSource("AirlineMember", AirlineMember);
    //var SCMWeekely = [{ Key: "0", Text: "Sunday" }, { Key: "1", Text: "Monday" }, { Key: "2", Text: "Tuesday" }, { Key: "3", Text: "Wednesday" }, { Key: "4", Text: "Thursday" }, { Key: "5", Text: "Friday" }, { Key: "6", Text: "Saturday" }];
    //var SCMFortNight = [{ key: "0", Text: "Start of Fortnight" }, { key: "1", Text: "End of Fortnight" }]
    //var SCMMonth = [{ key: "0", Text: "Start of Month" }, { key: "1", Text: "End of Month" }]


    //var SCMWeekely = [{ Key: "0", Text: "Sunday" }, { Key: "1", Text: "Monday" }, { Key: "2", Text: "Tuesday" }, { Key: "3", Text: "Wednesday" }, { Key: "4", Text: "Thursday" }, { Key: "5", Text: "Friday" }, { Key: "6", Text: "Saturday" }];
    //cfi.AutoCompleteByDataSource("SCMDays", SCMWeekely);


    //    var SCMFortNight = [{ key: "0", Text: "Start of Fortnight" }, { key: "1", Text: "End of Fortnight" }]
    //    cfi.AutoCompleteByDataSource("SCMDays", SCMFortNight);


    //    var SCMMonth = [{ key: "0", Text: "Start of Month" }, { key: "1", Text: "End of Month" }]
    //cfi.AutoCompleteByDataSource("SCMDays", SCMMonth);

    //cfi.AutoComplete("CountryName", "CountryCode,CountryName", "vwCountry", "SNo", "CountryName", ["CountryCode", "CountryName"], CountryCodeChange, "contains");

    cfi.AutoComplete("PartnerAirline", "SNo,PartnerAirline", "viewPartnerAirline", "SNo", "PartnerAirline", ["PartnerAirline"], null, "contains", ",");
    //cfi.BindMultiValue("PartnerAirline", $("#Text_PartnerAirline").val(), $("#PartnerAirline").val());

    cfi.AutoComplete("SCMDays", "NO,Value", "", "NO", "Value", ["Value"], null, "contains", null, null, null, "AirlineGetDays");

    cfi.AutoCompleteByDataSource("InvoicingCycle", InvoicingCycleType);
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //$('input[id=IsCCAllowed][value=1]').prop("checked", true);
        //$('input[id=IsPartAllowed][value=1]').prop("checked", true);
        $('input[id=IsCheckModulus7][value=1]').prop("checked", true);
        $("input:radio[name='IsInterline'][value ='1']").prop('checked', true);
        $("#liEventMessage").remove();
        $("#liRecipientMessage").remove();




        $("#AirportCode").val(userContext.AirportSNo);
        $("#Text_AirportCode").val(userContext.AirportCode + '-' + userContext.AirportName);

        /*********Get Country*********************/
        $.ajax({
            url: "./Services/Master/AirlineService.svc/GetCountry", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ CitySNo: userContext.CitySNo }),
            success: function (result) {
                if (result != "") {
                    $('#Text_CountryName').data("kendoAutoComplete").key(result.split('__')[0]);
                    $('#Text_CountryName').data("kendoAutoComplete").value(result.split('__')[1]);
                    $('#Text_CountryName').data("kendoAutoComplete").enable(true);
                    $('#Text_CountryName').data("kendoAutoComplete").enable(true);
                }
            }
        });
        /*****************************************/
        //$('input[name="IsCashAirline"]').prop('checked', true);

    }
    // function CountryCodeChange() {
    //   $("#AirportCode").val('');
    // $("#Text_AirportCode").val('');


    //}

    //cfi.AutoComplete("CityCode", "CityCode,CityName", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains", null, null, null, null, OnSelectCurrency);
    // ExtraCondition("Text_CurrencyCode");
    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("#liEventMessage").remove();
        $("#liRecipientMessage").remove();
    }

    $("#Text_CityCode").bind("change blur", function () {

    });
    $("#AirlineLogoPreview,#AwbLogoPreview,#ReportLogoPreview").click(function () {
        var imgpath = $(this).closest("td").find("input[type=hidden]").val();
        AddDiv(imgpath);
        var id = $(this).val().replace("Logo", " Logo");
        openWindow("LogoPopup", id.toString());
    });
    $("input[type=file]").change(function (e) {
        if ($(this).val() != '')
            if (!($(this).val().toUpperCase().indexOf(".JPG") >= 0 || $(this).val().toUpperCase().indexOf(".JPEG") >= 0)) {
                // Dialog.alert("Only .jpg/.jpeg files are allowed");
                CallMessageBox('info', 'Airline', 'Only .jpg/.jpeg files are allowed');
                $(this).val("");
            }

    })
    $("#AirlineLogoPreview,#AwbLogoPreview,#ReportLogoPreview").css({
        'font-size': '8pt',
        background: 'none',
        border: '0px',
        padding: 0,
        'border-bottom': '0px solid #444',
        color: 'gray',
        cursor: 'pointer',
        'font-family': ' Verdana,Geneva,sans-serif'
    });
    $("input[type=file]").attr({ accept: "image/*" });
    $("#AirlineLogoPreview,#AwbLogoPreview,#ReportLogoPreview").hover(
            function () {
                $(this).css({ 'text-decoration': 'underline', 'color': 'rgb(50,50,50)' });
            },
            function () {
                $(this).css({ 'text-decoration': 'normal', 'color': 'gray' });
            });

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("input[type=file]").hide();
    }
    $("#AirlineLogoUpload,#ReportLogoUpload,#AWBLogoUpload").click(function () {
        $(this).closest("td").find("input[type=file]").show();
        $(this).hide();
    })
    if (getQueryStringValue("FormAction").toUpperCase() != "READ" && getQueryStringValue("FormAction").toUpperCase() != "DELETE") {

        var spnlbl1 = $("<span class='k-label'>(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span>");
        $("#EmailAddress").after(spnlbl1);

        var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span>");
        $("#Email").after(spnlbl2);
        $("#EmailLabel").hide();
        $('input[name="operation"]').click(function (e) {
            $("#tblAirlineCCTrans_CitySNo_1").removeAttr("required");
            $("#tblAirlinePartTrans_CitySNo_1").removeAttr("required");

            if ($("#MobileCountryCode").val() != "") {
                if ($("#MobileCountryCode").val().length < 1) {
                    alert("Mobile Prefix should be  minimum 1 Digit.");
                    return false;
                }
            }
            if ($("#MobileNo").val() != "") {


                if ($("#MobileNo").val().length < 7) {
                    ShowMessage('warning', 'Need your Kind Attention!', 'Mobile No. should be minimum 7 Digits or maximum 10 Digits.');
                    return false;
                }

                if ($("#MobileNo").val().length > 10) {
                    ShowMessage('warning', 'Need your Kind Attention!', 'Mobile No. should be minimum 7 Digits or maximum 10 Digits.');
                    return false;
                }
            }

            if ($("#PhoneCountryCode").val() != "") {
                if ($("#PhoneCountryCode").val().length < 1) {
                    alert("Phone Prefix should be  minimum 1 Digit.");
                    return false;
                }

            }
            if ($("#PhoneNo").val() != "") {
                if ($("#PhoneNo").val().length < 4) {
                    alert("Phone No. should be 4 Digits.");
                    return false;
                }
            }


            if ($("#PhoneCountryCode").val() != "") {
                if ($("#PhoneNo").val() == "") {
                    alert("Enter Phone No.");
                    return false;
                }

            }
            if ($("#PhoneNo").val() != "") {
                if ($("#PhoneCountryCode").val() == "") {
                    alert("Enter Phone Prefix. ");
                    return false;
                }

            }



            if ($("#MobileCountryCode").val() != "" && $("#MobileCountryCode").val() != " ") {
                if ($("#MobileNo").val() == "") {
                    alert("Enter Mobile No.");
                    return false;
                }

            }
            if ($("#MobileNo").val() != "") {
                if ($("#MobileCountryCode").val() == "") {
                    alert("Enter Mobile prefix.");
                    return false;
                }

            }


            var k = ''; var L = ''; var M = '';
            for (var i = 0; i < $("ul#addlist li span").text().split(' ').length - 1; i++)
            { k = k + $("ul#addlist li span").text().split(' ')[i] + ','; }

            for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++)
            { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }


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

            $("#SitaAddress").val(k.substring(0, k.length - 1));

            //$("#hdnadd").val(k.substring(0, k.length - 1));
            //if ($("#addlist li").length > 0)
            //    $("#SitaAddress").removeAttr("data-valid");


            $("#EmailAddress").val(L.substring(0, L.length - 1));

            //$("#hdnmail").val(L.substring(0, L.length - 1));
            //if ($("#addlist1 li").length > 0)
            //    $("#EmailAddress").removeAttr("data-valid");

            if ($('#Commission').val() <= 0 && $('#Commission').val() != "") {
                ShowMessage('warning', 'Need your Kind Attention!', 'Commission should be greater than 0.');
                $('#Commission').val('');
                $('#_tempCommission').val('');
                return false;
            }
            else if ($('#Commission').val() > 100) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Commission cannot be greater than 100.');
                $('#Commission').val('');
                $('#_tempCommission').val('');
                return false;
            }
        });
    }
    $('#AirlineCode').keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })
    $('#CarrierCode').keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })

    $("#PhoneCountryCode").keypress(function (e) {
        var txtCon = "+";
        var strCn = $('#PhoneCountryCode').val();
        var keycode = (e.keyCode ? e.keyCode : e.which);
        //if (keycode == 45)
        //    return false;
        if (strCn.indexOf(txtCon) > -1) {
            return false;
        }
    })

    $("#CityPrefixCode").keypress(function (e) {
        var txtCt = "+";
        var strCt = $('#CityPrefixCode').val();
        var keycode = (e.keyCode ? e.keyCode : e.which);
        //if (keycode == 45)
        //    return false;
        if (strCt.indexOf(txtCt) > -1) {
            return false;
        }
        //else
        //    return true;
    })
    //$("#SMS").checked(function(){
    //    if($(this).is(':checked') == true && $("#Mobile").val().length < 7){
    //        return false;
    //    }
    //})


    //$("#PhoneNo").keypress(function (e) {
    //var txtPn = "+";
    //var strPn = $('#PhoneNo').val();
    //var keycode = (e.keyCode ? e.keyCode : e.which);
    //if (keycode == 45)
    //    return false;
    //if (keycode == 43)
    //    return false;
    //else if (strPn.indexOf(txtPn) > -1) {
    //    return false;
    //}
    //else
    //    return true;
    // })


    $('#PhoneNo').keypress(function (e) {
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
            return false;
        $('#PhoneNo').attr('onchange', 'checkNumeric(\"PhoneNo\");');
    });

    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});

    $(document).on('drop', function ()
    {
        return false;
    });

    BindingGridonClick();
    function BindingGridonClick() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //$("#liCCShipment").hide();
            //$("#liPartShipment").hide();
            ////var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
            //tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
            //tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        divadd = $("<div id='divsitaAdd' style='overflow:auto;'><ul id='addlist' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divsitaAdd").length === 0)
            $("#SitaAddress").after(divadd);
        $("#SitaAddress").css("text-transform", "uppercase");
        SetSitaAddress();

        divmail = $("<div id='divmailAdd' style='overflow:auto;'><ul id='addlist1' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divmailAdd").length === 0)
            $("#EmailAddress").after(divmail);
        SetEMail();

        divemail = $("<div id='divemailAdd' style='overflow:auto;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length === 0)
            $("#Email").after(divemail);
        SetEMailNew();
        $("#Email").css("text-transform", "uppercase");

        //alert($('#SCM').val())
        CheckSCM();



        $('input:radio[id="SCM"]').change(function () {
            $('#SCMCycle').val('')
            $('#Text_SCMCycle').val('')
            $('#Text_SCMDays').val('')
            CheckSCM();

        })
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


    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var textval = $("#SitaAddress").val();
        var len = textval.split(",").length;
        if (textval != "") {
            for (var jk = 0; jk < len; jk++) {
                $("ul#addlist").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
            }
            $("#SitaAddress").val("");
            $("#SitaAddress").removeAttr("required");
        }
        var textval1 = $("#EmailAddress").val();
        var len = textval1.split(",").length;
        if (textval1 != "") {
            for (var jk = 0; jk < len; jk++) {
                $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval1.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
            }
            $("#EmailAddress").val("");
            $("#EmailAddress").removeAttr("required");
        }

        if ($("#Message").is(':checked') == true) {
            $("#EmailLabel").show();
            var textemail = $("#Email").val();
            var len = textemail.split(",").length;
            if (textemail != "") {
                for (var jk = 0; jk < len; jk++) {
                    $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textemail.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                }
                $("#Email").val("");
                $("#Email").removeAttr('data-valid');
            }
        }
    }


    $("#SMS").after('SMS');
    $("#Message").after('Email');
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#SMS").attr('disabled', true);
        $("#Message").attr('disabled', true);
    }

    if ($("#SMS").is(':checked') == true) {
        $("#Mobile").closest('td').prev().find('font').html('*');
        //  $("#_tempMobile").show();
        $("#Mobile").show();
        $("#Mobile").attr('data-valid', 'required');
        $("#Mobile").closest('td').prev().find('span').show();
        
    }
    else {
        $("#Mobile").removeAttr('data-valid');
        $("#Mobile").closest('td').prev().find('font').html('');
        $("#_tempMobile").hide();
        $("#Mobile").hide();
        $("#Mobile").closest('td').prev().find('span').hide();
    }

    
});

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    ///^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/
    return regex.test(email);
}
function CheckSCM() {
    //if ($('input:radio[id="SCM"]:checked').val() == 0) {
    var SCMCycleType = [{ Key: "0", Text: "WEEKLY" }, { Key: "1", Text: "FORTNIGHTLY" }, { Key: "2", Text: "MONTHLY" }];
    cfi.AutoCompleteByDataSource("SCMCycle", SCMCycleType, blank);
    //}
    //else {
    //    var SCMCycleType = [{}];
    //    cfi.AutoCompleteByDataSource("SCMCycle", SCMCycleType, blank);
    //}CheckSCM
}


$('#Mobile').blur(function () {
    
    if ($("#Mobile").val() < 1000000 && $("#Mobile").val().length > 0) {
        $("#Mobile").val('');
        ShowMessage('warning', 'Need your Kind Attention!', 'Mobile No. should be minimum 7 Digits and not zero');

        //$("#Mobile").focus();

    }
    if ($("#Mobile").val().length < 7 && $("#Mobile").val().length > 0) {
        // $("#Mobile").focus();
        
            $("#Mobile").val('');
            ShowMessage('warning', 'Need your Kind Attention!', 'Mobile No. should be minimum 7 Digits and not zero');

            //$("#Mobile").focus();

        
    }
    
});
//|| $("#Mobile").val()<1000000


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
        $("#_tempMobile").val('');
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
        $("#_tempEmail").val('');
        $('#divemailAdd ul').find('li span[id]').click();
    }
}

function ShowHideCreditLimitInformation() {
    if ($('input:radio[name=IsAllowedCL]:checked').val() == '1') {
        $('#MinimumCL').attr('readonly', true);
        $('#CreditLimit').attr('readonly', true);
        $('#AlertCLPercentage').attr('readonly', true);
    }
    else {
        $('#CreditLimit').attr('readonly', false);
        $('#MinimumCL').attr('readonly', false);
        $('#AlertCLPercentage').attr('readonly', false);
    }
}





function createCustomer(CustomerCreate, callback) {
    $.ajax({
        url: "http://localhost:421/api/Airline/SaveAirline",
        data: JSON.stringify(Airline),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        statusCode: {
            201: function (newCustomer) {
                callback(newCustomer);
            }
        }
    })
}

function CCShipmentTab()
{
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
    {
        ShowMessage('info', 'Need your Kind Attention!', "CC Shipment - Can be added in Edit/Update Mode only.");
        return;
    }
    else
    {
        CreateShipmentGrid('AirlineCCTrans', getQueryStringValue("FormAction").toUpperCase());
        //$('#tblAirlineCCTrans_btnAppendRow').remove();
        //test();
    }
}

function PartShipmentTab()
{
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Part Shipment - Can be added in Edit/Update Mode only.");
        return;
    }
    else
    {
        CreateShipmentGrid('AirlinePartTrans', getQueryStringValue("FormAction").toUpperCase());
        //$('#tblAirlinePartTrans_btnAppendRow').remove();
    }
}

function CreateShipmentGrid(table, pageType)
{
    if (cfi.IsValidSubmitSection())
    {
        var TransTable = "" + table + "";
        //var pageType = $('#hdnPageType').val();
        $('#tbl' + TransTable).appendGrid({
            tableID: 'tbl' + TransTable,
            contentEditable: pageType != 'READ',
            tableColumns: 'SNo,AirlineSNo,CitySNo,IsCCAllowed,IsPartAllowed,IsExclude,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn',
            masterTableSNo: $('#hdnTXTAirlinesno').val(),
            currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirlineService.svc',
            getRecordServiceMethod: 'Get' + table + 'Record',
            createUpdateServiceMethod: 'CreateUpdate' + table,
            deleteServiceMethod: 'Delete' + table,
            caption: TransTable == "AirlineCCTrans" ? 'CC Shipment' : 'Part Shipment',
            initRows: 1,
            isGetRecord: true,
            columns: [{ name: 'SNo', type: 'hidden', value: '0' },
                      { name: 'AirlineSNo', type: 'hidden', value: $('#hdnTXTAirlinesno').val() },
                      { name: 'IsCCAllowed', type: 'hidden', value: $('#hdnIsCCAllowed').val() },
                      { name: 'IsPartAllowed', type: 'hidden', value: $('#hdnIsPartAllowed').val() },
                      { name: 'CitySNo', display: 'City', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, onChange: function (evt, rowIndex) { }, tableName: 'vCityNew', textColumn: 'CityCode', keyColumn: 'SNo', filterCriteria: "contains", separator: "," },
                      //{ name: pageType != 'READ' ? (TransTable == 'AirlineCCTrans' ? 'IsCCAllowed' : 'IsPartAllowed') : (TransTable == 'AirlineCCTrans' ? 'CCAllowed' : 'PartAllowed'), display: TransTable == 'AirlineCCTrans' ? 'CC Shipment Allowed' : 'Part Shipment Allowed', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                      { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                      { name: 'UpdatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() }
            ],
            hideButtons: { removeLast: true, updateAll: false },
            isPaging: false,
            //hideButtons: { append: false, insert: true, remove: true, removeLast: true },
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex)
            {
                //$("#tbl" + table + "_btnAppendRow").hide();
                if ($('#tbl' + TransTable + ' tr[id]').length == 1)
                {
                    $("#tbl" + TransTable + "_btnAppendRow").hide();
                }

                for (var i = 1; i <= addedRowIndex.length; i++)
                {
                    strData.push(i);
                }
                getUpdatedRowIndex(strData.join(','), "tbl" + table);
            },
            afterRowRemoved: function (caller, rowIndex)
            {
                if ($('#tbl' + TransTable + ' tr[id]').length < 1)
                {
                    $("#tbl" + TransTable + "_btnAppendRow").show();
                }
            }

            //afterRowAppended: function () { $("#tbl" + table + "_btnAppendRow").hide(); }
        });
        $("#tbl" + TransTable + "_btnUpdateAll span").text('Update');
        $("#tbl" + TransTable + "_btnUpdateAll").attr('title', 'Update Record.');
        if (pageType == 'EDIT' && $('#tbl' + TransTable + ' tr[id]').length < 1)
        {
            $('#tbl' + TransTable).appendGrid('insertRow', 1, 0);
        }
    }
    //   $("#tbl" + table + "_btnAppendRow").click(function () { $("#tbl" + table + "_btnAppendRow").hide(); })
    //else {
    //    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#li' + table));
    //    return false;bi
    //}

}
function ExtraCondition(a)
{
    var id = a;
    if (a.split('_')[0] == "tblAirlineCCTrans")
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#tblAirlineCCTrans_HdnCitySNo_" + id.split('_')[2]).val()), filter = cfi.autoCompleteFilter(a);
    if (a.split('_')[0] == "tblAirlinePartTrans")
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#tblAirlinePartTrans_HdnCitySNo_" + id.split('_')[2]).val()), filter = cfi.autoCompleteFilter(a);
}

function EventMessageTab()
{
    $('#TxtAirlineName').remove();
    var table = "EventMsgTrans";
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    var GetRecord = "GetEventMessageGridAppendGrid";

    if (pageType.toUpperCase() == 'READ')
    {
        $("#tblEventMsgTrans").before("<div id='TxtAirlineName' class='k-content k-state-active' style='display: block;'><table><tr><td style='font-weight:bold;'>Airline Name : </td><td>" + $('#ApplicationTabs-1 table tr').find('#AirlineName').text() + "</td></tr></table></div>");
    }
    else if (pageType.toUpperCase() == 'EDIT') {
        $("#tblEventMsgTrans").before("<div id='TxtAirlineName' class='k-content k-state-active' style='display: block;'><table><tr><td style='font-weight:bold;'>Airline Name : </td><td>" + $('#AirlineName').val() + "</td></tr></table></div>");
    }

    var controlType = "Label";
    $('#tbl' + table).appendGrid({
        tableID: 'tbl' + table,
        contentEditable: pageType.toUpperCase() != 'READ' && pageType.toUpperCase() != 'DELETE' && pageType.toUpperCase() != 'EDIT',
        masterTableSNo: $("#hdnTXTAirlinesno").val(),
        currentPage: 1, itemsPerPage: 10, whereCondition: null,
        servicePath: 'Services/EDI/EventMessageTransService.svc',
        getRecordServiceMethod: GetRecord,
        createUpdateServiceMethod: '',
        deleteServiceMethod: '',
        caption: "Event",
        initRows: 1,
        isGetRecord: true,
        rowNumColumnName: 'SNo',
        columns: [{ name: 'SNo', type: 'hidden' },
                  { name: "EventName", display: "Event", type: controlType, ctrlAttr: { maxlength: 48, controltype: 'alphanumericupper' }, ctrlCss: { width: '150px' }, isRequired: true, tableName: "vwEventName", textColumn: "EventName", keyColumn: "SNo", filterCriteria: "contains", separator: "," },
                  { name: "SubProcessName", display: "Process(s)", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "250px" }, isRequired: true, tableName: "vProcessSubprocess", textColumn: "SubProcessName", keyColumn: "SNo", filterCriteria: "contains", separator: "," },
                  { name: "MessageType", display: "Message", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "vwMessageType", textColumn: "MessageType", keyColumn: "SNo", filterCriteria: "contains", separator: "," },

        ],

        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
        isPaging: false
    });
}

function RecipientMessageTab()
{
    $('#Txt1AirlineName').remove();
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    var table = "RecipientMessageTrans";
    var GetRecord = "RecipientMessageAppendGrid";

    if (pageType.toUpperCase() == 'READ')
    {
        $("#tblRecipientMessageTrans").before("<div id='Txt1AirlineName' class='k-content k-state-active' style='display: block;'><table><tr><td style='font-weight:bold;'>Airline Name : </td><td>" + $('#ApplicationTabs-1 table tr').find('#AirlineName').text() + "</td></tr></table></div>");

    }
    else if (pageType.toUpperCase() == 'EDIT')
    {
        $("#tblRecipientMessageTrans").before("<div id='Txt1AirlineName' class='k-content k-state-active' style='display: block;'><table><tr><td style='font-weight:bold;'>Airline Name : </td><td>" + $('#AirlineName').val() + "</td></tr></table></div>");
    }
    $('#tbl' + table).appendGrid({
        tableID: 'tbl' + table,
        contentEditable: pageType.toUpperCase() != 'READ' && pageType.toUpperCase() != 'DELETE' && pageType.toUpperCase() != 'EDIT',
        masterTableSNo: $("#hdnTXTAirlinesno").val(),
        currentPage: 1, itemsPerPage: 10, whereCondition: null,
        servicePath: './Services/Master/AirlineService.svc',
        getRecordServiceMethod: GetRecord,
        createUpdateServiceMethod: '',
        deleteServiceMethod: '',
        caption: "Recipient Config",
        initRows: 1,
        isGetRecord: true,
        rowNumColumnName: 'SNo',
        columns: [
                  { name: "MessageMovementType", display: "Message Movement Type", type: "Label" },
                  { name: "MessageType", display: "Message Type", type: "Label" },
                  { name: "DestinationCountry", display: "Destination Country", type: "Label" },
                  { name: "DestinationCity", display: "Destination City", type: "Label" },
                  { name: "MessageVersion", display: "Message Version", type: "Label" },
                  { name: "Basis", display: "Basis", type: "Label" },
                  { name: "CutOffMins", display: "Cut Off Min.", type: "Label" },
        ],

        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
        isPaging: false
    });
}
function ClearDoor(id) {
    var rowIndex = id.split('_')[2];
    $("#tblUserDoorRights_HdnBayMasterSNo_" + rowIndex).val('');
    $("#tblUserDoorRights_BayMasterSNo_" + rowIndex).val('');
    //$("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').remove();
    $("#Multi_tblUserDoorRights_BayMasterSNo_" + rowIndex).val('');
    $("#FieldKeyValuestblUserDoorRights_BayMasterSNo_" + rowIndex)[0].innerHTML = '';
    $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').each(function (i) {
        if (i > 0) {
            $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').eq(1).remove();
        }
    });
}

function SetSitaAddress()
{
    $("#SitaAddress").keyup(function (e) {

        var addlen1 = $("#SitaAddress").val().toUpperCase();
        addlen1 = addlen1.replace(/\s/g, '');
        addlen1 = $("#SitaAddress").val(addlen1);
        var addlen = addlen1.val().toUpperCase();
        if (addlen.length == 7) {
            var restdata = $("ul#addlist li").text().split(" ");

            for (var i = 0; i < restdata.length; i++) {
                if (addlen == restdata[i]) {
                    $("#SitaAddress").val('');
                    ShowMessage('warning', 'Warning - Airline', "SITA Address already entered");
                    return;
                }
            }


            if ($("ul#addlist li").length < 4) {
                var listlen = $("ul#addlist li").length;
                $("ul#addlist").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;text-transform: uppercase'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                // $("ul#addlist").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span id='" + listlen + "' class='k-icon k-delete remove'>" + addlen +"</span></li>");
            }
            else {
                ShowMessage('warning', 'Warning - Telex Type', "Maximum 4 SITA Address allowed.");
            }
            $("#SitaAddress").val('');
        }
        else if (addlen.length > 7) {
            $("#SitaAddress").val('');
        }
        else
            e.preventDefault();
    });
    $("#SitaAddress").blur(function () {
        $("#SitaAddress").val('');
    });
    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });
}
function SetEMail() {
    $("#EmailAddress").keyup(function (e) {
        var addlen = $("#EmailAddress").val();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    if ($("ul#addlist1 li").length < 10) {
                        var listlen = $("ul#addlist1 li").length;
                        $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");

                    }
                    else {
                        ShowMessage('warning', 'Warning - Airline', "Maximum 10 E-mail Address allowed.");
                    }
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

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}

function SetEMailNew() {
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
                        ShowMessage('warning', 'Warning - Airline', "Maximum 3 E-mail Address allowed.");
                    }
                    $("#Email").val('');
                    $("#Email").removeAttr('data-valid');
                }
                else {
                    ShowMessage('warning', 'Warning - Airline', "Please enter valid Email Address.");
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


function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");
    var filterProcess = cfi.getFilter("AND");



    if (textId == "Text_PartnerAirline") {
        try {

            cfi.setFilter(filterAirline, "SNo", "notin", $("#PartnerAirline").val());
            cfi.setFilter(filterAirline, "CarrierCode", "notin", $('#CarrierCode').val());
            var SubProcessAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return SubProcessAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }



    if (textId == "Text_AirportCode") {
        try {
            cfi.setFilter(filterAirline, "CountrySNo", "eq", $("#Text_CountryName").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }



    if (textId == "Text_AirportCode") {
        try {
            cfi.setFilter(filterAirline, "CountrySNo", "eq", $("#Text_CountryName").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }


    if (textId == "Text_SCMDays") {
        if ($('#SCMCycle').val() == "") {
            cfi.setFilter(filterAirline, "k", "eq", '123')
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;

        }
        else {
            try {
                cfi.setFilter(filterAirline, "k", "eq", $("#Text_SCMCycle").data("kendoAutoComplete").key())
                var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
                return OriginCityAutoCompleteFilter2;
            }
            catch (exp)
            { }
        }


    }
}


function CountryCodeChange() {
    try {
        //$.ajax({
        //    type: "GET",
        //    url: "./Services/Master/AirlineService.svc/GetCountryInformation",
        //    async: false, type: "POST", dataType: "json", cache: false,
        //    data: JSON.stringify({ SNo: $("#CountryName").val() }),
        //    contentType: "application/json; charset=utf-8",
        //    success: function (response) {
        //        var ResultData = jQuery.parseJSON(response);
        //        var FinalData = ResultData.Table0;
        //        if (FinalData.length > 0) {
        //            $('#Text_AirportCode').val(FinalData[0].AirportName);
        //        }
        //    }
        //});

        $.ajax({
            url: "./Services/Master/AirlineService.svc/GetCountryInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#CountryName").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#AirportCode').val(resData[0].SNo);
                    $('#Text_AirportCode').val(resData[0].AirportName);
                }
            }
        });
    }
    catch (exp) { }

}
//function test()
//{
//    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ") {

//        var SkillDataField = ($('#tblAirlineCCTrans_HdnCitySNo_1').val());
//        var SkillDataText = ($('#tblAirlineCCTrans_CitySNo_1').val());
//        $('#Text_CitySNo')[0].defaultValue = '';
//        $('#Text_CitySNo')[0].Value = '';
//        $('#Text_CitySNo').val('');
//        $('#Multi_CitySNo').val(SkillDataField);
//        $('#FieldKeyValuesCitySNo')[0].innerHTML = SkillDataField;
//        var i = 0;
//        //if (TruckTypeVal != "" && TruckTypeText == "") {
//        //    TruckTypeVal = TruckTypeVal.replace(",,", ",");
//        //    $.ajax({
//        //        type: "POST",
//        //        url: "./Services/Master/BayMasterService.svc/GetTruckTypeText?recid=" + TruckTypeVal,
//        //        data: { id: 1 },
//        //        dataType: "json",
//        //        success: function (response) {
//        //            if (response != null && response != '') {
//        //                TruckTypeText = response.Data[0];
//        //                TruckTypeVal = response.Data[1];
//        //                if (TruckTypeVal.split(',').length > 0) {
//        //                    while (i < TruckTypeVal.split(',').length) {
//        //                        if (TruckTypeVal.split(',')[i] != '')
//        //                            $('#divMultiCitySNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + TruckTypeText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + TruckTypeVal.split(',')[i] + "'></span></li>");
//        //                        i++;
//        //                    }
//        //                    $('.k-delete').click(function () {
//        //                        $(this).parent().remove();
//        //                        if ($("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text().indexOf($(this)[0].id + ",") > -1) {
//        //                            var CitySNoVal = $("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text().replace($(this)[0].id + ",", '');
//        //                            $("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text(CitySNoVal);
//        //                            $('#CitySNo').val(CitySNoVal);
//        //                        }
//        //                        else {
//        //                            var CitySNoValfield = $("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text().replace($(this)[0].id, '');
//        //                            $("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text(CitySNoValfield);
//        //                            $('#CitySNo').val(CitySNoValfield);
//        //                        }
//        //                        $("div[id='divMultiCitySNo']").find("input:hidden[name^='Multi_CitySNo']").val($("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text());

//        //                    });
//        //                }
//        //            }
//        //        }
//        //    });
//        //}
//        //else {
//        if (SkillDataField.split(',').length > 0) {
//            while (i < SkillDataField.split(',').length) {
//                if (SkillDataField.split(',')[i] != '')
//                    $('#divMultiCitySNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SkillDataText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + SkillDataField.split(',')[i] + "'></span></li>");
//                i++;
//            }
//        }
//        //}
//    }
//    $('.k-delete').click(function () {
//        $(this).parent().remove();
//        if ($("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text().indexOf($(this)[0].id + ",") > -1) {
//            var CitySNoVal = $("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text().replace($(this)[0].id + ",", '');
//            $("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text(CitySNoVal);
//            $('#CitySNo').val(CitySNoVal);
//        }
//        else {
//            var CitySNoValfield = $("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text().replace($(this)[0].id, '');
//            $("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text(CitySNoValfield);
//            $('#CitySNo').val(CitySNoValfield);
//        }
//        $("div[id='divMultiCitySNo']").find("input:hidden[name^='Multi_CitySNo']").val($("div[id='divMultiCitySNo']").find("span[name^='FieldKeyValuesCitySNo']").text());

//    });

//}
if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

    $('input[id=SCM][value=1]').prop("checked", true);
    $('input[id=IsCashAirline][value=1]').prop("checked", true);

}

if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT")
{
    $("#OverBookingCapacity").after(" %");
    $("#FreeSaleCapacity").after(" %");
    $("#OverBookingCapacityVol").after(" %");
    $("#FreeSaleCapacityVol").after(" %");

}