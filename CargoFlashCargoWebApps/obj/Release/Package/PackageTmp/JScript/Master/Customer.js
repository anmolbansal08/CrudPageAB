var arraylength;
var foundPresent_ = false;
var country = "";

$(function () {
   // $('.k-icon').on('click', function ()
    $('.k-icon k-delete').on('click', function ()
    {
       alert("2")
    });
   
    $("#spnIsFocConsignee").closest('td').next('td').wrapInner('<div id="divRadio" class="dynamic" />');
    $("#IsConsigneeAsForwarder").closest('td').wrapInner('<div id="divRadioForwarder" class="dynamic" />');
    $("#IsConsigneeAsForwarder").closest('td').parent('tr').find('td[title$="Consignee As Forwarder (Agent)"]').wrapInner('<div id="divConForwarder" class="dynamic" />');


    //  cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    cfi.AutoComplete("CityCode", "CityName,CityCode,SNo", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], getCountrySNo, "contains");
    cfi.AutoComplete("CustomerTypeSNo", "CustomerTypeName,SNo", "vwCustomerType", "SNo", "CustomerTypeName", ["CustomerTypeName"], EventHideShow, "contains");
    cfi.AutoComplete("AccountSNo", "Name,SNo", "vwFORWARDER", "SNo", "Name", ["Name"], CheckConsigneeAsfarwarder, "contains");
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });


    //$("#SecurityCode").closest("tr").find("td").hide();
    // $("#IsFocConsignee").closest("tr").find("td:gt(1)").hide();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#CityCode").val(userContext.CitySNo);
        $("#Text_CityCode").val(userContext.CityCode + '-' + userContext.CityName);

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if ($('input[name="IsConsigneeAsForwarder"][value="0"]').is(':checked') == true) {
            $("[type='radio'][id='IsConsigneeAsForwarder']").attr("disabled", "disabled");
        }
        $("input[type='hidden'][id$='hdnAccountName']").val($('#Text_AccountSNo').val());
        $('#Text_AccountSNo').data('kendoAutoComplete').enable(false);


        $('<input>').attr({
            type: 'hidden',
            id: 'hdnCustomerName',
            name: 'CustomerName'
        }).appendTo('form')
        $("#hdnCustomerName").val($('#CustomerName').val() + "-" + $('#CustomerName2').val());



        //$('<input>').attr({
        //    type: 'hidden',
        //    id: 'hdnCustomerNameSecond',
        //    name: 'CustomerNameSecond'
        //}).appendTo('form')
        //$("#hdnCustomerNameSecond").val($('#CustomerName2').val());


        $('#CustomerName').attr("disabled", true);
        $('#CustomerName2').attr("disabled", true);
        getCountrySNo();

    }

    FOCShowHide(userContext.SpecialRights.FOC);

    removecValidation();

    $(document).on('drop', function () {
        return false;
    });
    $(document).on("contextmenu", function (e) {
        return false;
    });
    $('#btnSaveAttachement').click(function () {
        var id = $('#divareaTrans_Master_AuthorizedPersonal');
        if (cfi.IsValidSection('divareaTrans_Master_AuthorizedPersonal')) {
            SaveAttachment();
        }
        else {
            return false;
        }
    });

    //$('[id^=tblCustomerAddress_Phone]').bind("keyup paste", function () {
    //    this.value = this.value.replace(/[^0-9\.]/g, '');
    //});
    //var arrSpecialRights = JSON.parse($('#welcomeMsg').find('[id="hdnUserContext"]').val()).SpecialRights;
    $('#MobileNo').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
    });


    BindingGridonClick();
    function BindingGridonClick() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //$("#liCustomerAddress").hide();
            //$("#liAuthorizedPersonal").hide();
            var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
            tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);

        }
    }

    //$('input[type="radio"][name="IsConsigneeAsForwarder"]').click(function () {
    //    if($('input[name="IsConsigneeAsForwarder"][value="0"]').is(':checked')==true)
    //    {
    //        $('#Text_AccountSNo').attr("data-valid","required");
    //        $('#Text_AccountSNo').attr("data-valid-msg","Forwarder (Agent) Name can not be blank");
    //        $("#spnAccountSNo").closest('td').find("font").remove();
    //        $("#spnAccountSNo").before('<font color="red">*</font>');
    //        $('#Text_AccountSNo').css('border-color', '#94c0d2');
    //    }
    //    if($('input[name="IsConsigneeAsForwarder"][value="1"]').is(':checked')==true)
    //    {
    //        $('#Text_AccountSNo').removeAttr("data-valid");
    //        $('#Text_AccountSNo').removeAttr("data-valid-msg");
    //        $("#spnAccountSNo").closest('td').find("font").remove();
    //        $('#Text_AccountSNo').closest('span').css('border-color', '');
    //        $('#Text_AccountSNo').val('');
    //        $('#AccountSNo').val('');
    //    }

    //});

});


var dbTableName = 'CustomerAddress';
function CustomerAddressGrid() {
    removecValidation();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Participant Address Details can be added in Edit/Update mode only.");
        return;
    }
    else {
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,CustomerSNo,CustomerName,CitySNo,CountrySNo,State,PostalCode,Phone,Fax,Email,IsPrimary,IsActive,CreatedBy,UpdatedBy,Town,Street',
            masterTableSNo: $('#hdnCustomerSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            isGetRecord: true,
            caption: 'Participant Address',
            initRows: 1,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'CustomerSNo', type: 'hidden', value: $('#hdnCustomerSNo').val() },
                { name: 'CustomerName', type: 'hidden', value: $('#hdnCustomerName').val() },
               // { name: 'Address', display: 'Address', type: 'text', ctrlAttr: { maxlength: 98, controltype: 'text' }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: 'CountrySNo', display: 'Country Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '60px', height: '20px' }, isRequired: true, tableName: 'Country', textColumn: 'CountryCode', keyColumn: 'SNo' },
                { name: 'CitySNo', display: 'City Name', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '70px', height: '20px' }, isRequired: true, tableName: 'City', textColumn: 'CityName', keyColumn: 'SNo' },
                { name: 'State', display: 'State', type: 'text', ctrlAttr: { maxlength: 9, minlength: 1, controltype: 'alphanumericupper' }, ctrlCss: { width: '70px' }, isRequired: true },
                { name: 'Street', display: 'Address 1', type: 'text', ctrlAttr: { maxlength: 35, minlength: 1, controltype: "alphanumericupper", allowchar: "!@#$%^&*()-_=+[]{};\":'|?/.,<>`~" }, ctrlCss: { width: '135px' }, isRequired: true },
                { name: 'Address2', display: 'Address 2', type: 'text', ctrlAttr: { maxlength: 35, minlength: 1, controltype: "alphanumericupper", allowchar: "!@#$%^&*()-_=\"+[]{};:'|?/.,<>`~" }, ctrlCss: { width: '135px' } },
                { name: 'Town', display: 'Town/Place', type: 'text', ctrlAttr: { maxlength: 17, minlength: 1, controltype: 'alphanumericupper' }, ctrlCss: { width: '110px' }, isRequired: true },
                { name: 'PostalCode', display: 'Postal Code', type: 'text', ctrlAttr: { maxlength: 9, minlength: 1, controltype: "alphanumericupper" }, ctrlCss: { width: '70px' }, isRequired: true },
                { name: 'Phone', display: 'Contact No', type: 'text', ctrlAttr: { maxlength: 12, minlength: 1, controltype: "text", onblur: "return checkPhoneNumber(this.id);", oninput: "this.value = this.value.replace(/[^0-9]/g, '');" }, ctrlCss: { width: '90px' }, isRequired: true },
                { name: 'Telex', display: 'Telex', type: 'text', ctrlAttr: { maxlength: 25, minlength: 1, controltype: "text", oninput: "this.value = this.value.toUpperCase().replace(/[^0-9a-zA-Z]/g,'');" }, ctrlCss: { width: '90px' } },
                { name: 'Fax', display: 'Fax', type: 'text', ctrlAttr: { minlength: 1, maxlength: 25, controltype: "text", oninput: "this.value = this.value.replace(/[^0-9]/g, '');" }, ctrlCss: { width: '60px' } },
                { name: 'Email', display: 'Email', type: 'text', ctrlAttr: { maxlength: 98, onblur: "return checkForEmail(this.id);" }, ctrlCss: { width: '100px' } },
                { name: pageType == 'Edit' ? 'IsPrimary' : 'Primary', display: 'Primary', type: 'radiolist', ctrlOptions: { 0: 'NO', 1: 'YES' }, selectedIndex: 0, onClick: function (evt, rowIndex) { checkIsPrimary(rowIndex + 1, $('#tbl' + dbTableName).appendGrid('getRowCount')); } },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'NO', 1: 'YES' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: false,
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                if ($('#tblCustomerAddress tr[id]').length == 1) {
                    $("#tblCustomerAddress_btnAppendRow").hide();
                }
                //============added by arman ali
                $("[id*='tblCustomerAddress_State_']").attr("oninput", "this.value = this.value.replace(/[0-9]/g, '')");
                //=============end
            },
            afterRowRemoved: function (caller, rowIndex) {
                if ($('#tblCustomerAddress tr[id]').length < 1) {
                    $("#tblCustomerAddress_btnAppendRow").show();
                }

            }
        });
        if (pageType == 'Edit' && $('#tblCustomerAddress tr[id]').length < 1) {
            $('#tblCustomerAddress').appendGrid('insertRow', 1, 0);
        }
    }
}

function checkIsPrimary(rIndex, totalRecord) {
    $('#tbl' + dbTableName + ' tr input:radio[name*="_RbtnIsPrimary_"]').each(function () {
        if (rIndex != eval(this.id.split('_')[2]) && $("input:radio[name='tbl" + dbTableName + '_RbtnIsPrimary_' + rIndex + "']:checked").val() == '1' && this.id.split('_')[3] == '0')
            document.getElementById(this.id.split('_')[0] + '_' + this.id.split('_')[1] + '_' + this.id.split('_')[2] + '_0').checked = true;
    });
}

function ExtraCondition(textId) {
  
    var filter = cfi.getFilter("AND");
    if (textId.indexOf("CountrySNo") >= 0) {
        $("#" + textId.split('_')[0] + "_HdnCitySNo_" + (textId.split('_')[2])).val('');
        $("#" + textId.split('_')[0] + "_CitySNo_" + (textId.split('_')[2])).val('');
        cfi.setFilter(filter, "SNo", "eq", country);
        var countryfilter = cfi.autoCompleteFilter([filter]);
        return countryfilter;

    }
    if (textId.indexOf("CitySNo") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#" + textId.split('_')[0] + "_HdnCountrySNo_" + (textId.split('_')[2])).val())
        var AutoCompleteFilter = cfi.autoCompleteFilter([filter]);
        return AutoCompleteFilter;
    }
}

function GetAuthorizedPersonnel() {
  
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Authorized Personnel Details can be added in Edit/Update mode only.");
        $('#divareaTrans_Master_AuthorizedPersonal').hide();
        $('#ApplicationTabs-3 input[value="Save"]').hide();
        return false;
    }
    else {
        removecValidation();
        $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='Name']").attr('data-valid', 'required');
        $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='Name']").attr('data-valid-msg', 'Name Can Not be Blank');

        $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardNo']").attr('data-valid', 'required');
        $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardNo']").attr('data-valid-msg', 'Id Card No Can Not be Blank');


        $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='ValidFrom']").attr('data-valid', 'required');
        $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='ValidTo']").attr('data-valid', 'required');

        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            //$('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardAttachement']").attr('data-valid', 'required');
            //$('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardAttachement']").attr('data-valid-msg', 'Attach Id Card');
            $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardAttachement']");
            $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardAttachement']");

            $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='AuthorizationLetterAttachement']").attr('data-valid', 'required');
            $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='AuthorizationLetterAttachement']").attr('data-valid-msg', 'Attach Authorization Letter');

            $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='PhotoAttachement']").attr('data-valid', 'required');
            $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='PhotoAttachement']").attr('data-valid-msg', 'Attach Photo');
        }

        $.ajax({
            url: "Services/Master/CustomerService.svc/GetRecordAuthorizedPersonnel?CustomerSNo=" + $("#hdnCustomerSNo").val(), async: false, type: "get", dataType: "json", cache: false,
            data: JSON.stringify({ CustomerSNo: $("#hdnCustomerSNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
           
                var authorizedPERSONNELData = jQuery.parseJSON(result);
                var authorizedPERSONNELArray = [];
                arraylength = 0;
                authorizedPERSONNELArray = authorizedPERSONNELData.Table0;
                arraylength = authorizedPERSONNELArray.length;
                var authorizedPERSONNELData = jQuery.parseJSON(result);
                if ($("#areaTrans_Master_AuthorizedPersonal")) {
                    var tr = $("#areaTrans_Master_AuthorizedPersonal");
                    $("#divareaTrans_Master_AuthorizedPersonal").find(".WebFormTable tr:gt(0)").remove();
                    $("#divareaTrans_Master_AuthorizedPersonal").find(".WebFormTable").append(tr);
                }
                InstantiateControl("divareaTrans_Master_AuthorizedPersonal");
          
                $('.k-datepicker').css('width', '90px');

                cfi.makeTrans("Master_AuthorizedPersonal", null, null, BindAttachement, ReBindAttachement, null, authorizedPERSONNELArray);

                $('.k-datepicker').css('width', '90px');
                $("div[id$='divareaTrans_Master_AuthorizedPersonal']").find("[id^='areaTrans_Master_AuthorizedPersonal']").each(function () {
                  
                    $(this).find("input[id^='IdCardAttachement']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadAuthorizesPERSONNEL($(this).attr("id"), "IdCardName");
                        });
                    });
                    $(this).find("input[id^='AuthorizationLetterAttachement']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadAuthorizesPERSONNEL($(this).attr("id"), "AuthorizationLetterName");
                        });
                    });
                    $(this).find("input[id^='PhotoAttachement']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadAuthorizesPERSONNEL($(this).attr("id"), "PhotoName");
                        });
                    });
                    $(this).find("a[id^='ahref_IdCardName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadAuthorizesPERSONNEL($(this).attr("id"), "IdCardName");
                        });
                    });
                    $(this).find("a[id^='ahref_AuthorizationLetterName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadAuthorizesPERSONNEL($(this).attr("id"), "AuthorizationLetterName");
                        });
                    });
                    $(this).find("a[id^='ahref_PhotoName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadAuthorizesPERSONNEL($(this).attr("id"), "PhotoName");
                        });
                    });


                });

                $("#Name").removeAttr('required');
                $("#IdCardNo").removeAttr('required');
                ///Updated By Shahbaz Akhtar 28-03-2017//////////////////
                $('#Name').attr("oninput", "this.value = this.value.replace(/[0-9]/g, '')");
                /////////////////////
                $('[id^="mobileno"]').attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
                $('[id^="mobileno"]').attr("onblur", "checkMobileNumber(this.id)");
                if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
                    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='Name']").attr("disabled", "disabled");
                    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardNo']").attr("disabled", "disabled");
                    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='mobileno']").attr("disabled", "disabled");

                    $('#divareaTrans_Master_AuthorizedPersonal table').find("[data-role='datepicker'][id^='Valid']").each(function () {
                        $('#' + this.id).data("kendoDatePicker").enable(false);
                    });
                    $('#divareaTrans_Master_AuthorizedPersonal table:eq(1) tr').find('td:eq(6)').hide();
                    $('#divareaTrans_Master_AuthorizedPersonal table:eq(1) tr').find('td:eq(8)').hide();
                    $('#divareaTrans_Master_AuthorizedPersonal table:eq(1) tr').find('td:eq(10)').hide();
                    $('#divareaTrans_Master_AuthorizedPersonal table:eq(1) tr').find('td:eq(12)').hide();
                    $('#divareaTrans_Master_AuthorizedPersonal table:eq(1) tr').find('td:eq(13)').hide();
                }
            }
        });

        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

            if ($('#transSNo').closest('tr').length > 0) {
                $("#spnPhotoName").closest('td').find("font").text('');
                $("#spnPhotoAttachement").closest('td').find("font").text('');
                $("#spnAuthorizationLetterName").closest('td').find("font").text('');
                $("#spnAuthorizationLetterAttachement").closest('td').find("font").text('');
                $("#spnIdCardAttachement").closest('td').find("font").text('');
                $("#spnIdCardName").closest('td').find("font").text('');
                var todaydate = new Date();
                var validfromdate = $("#ValidFrom").data("kendoDatePicker");
                validfromdate.min(todaydate);
            }
            $("#divareaTrans_Master_AuthorizedPersonal table:last tr td:nth-child(13)").hide();
            var alltr = $('#divareaTrans_Master_AuthorizedPersonal table:eq(1)').find("tr[id]");
            $(alltr).each(function (index, item) {
                if ($(this).find('input[id^="SNo"]').val() == "") {


                    //   $(this).find("[id^='IdCardAttachement']").attr('data-valid', 'required');
                    //  $(this).find("[id^='IdCardAttachement']").attr('data-valid-msg', 'Attach Id Card');

                    //$(this).find("[id^='AuthorizationLetterAttachement']").attr('data-valid', 'required');
                    //$(this).find("[id^='AuthorizationLetterAttachement']").attr('data-valid-msg', 'Attach Authorization Letter');

                    //$(this).find("[id^='PhotoAttachement']").attr('data-valid', 'required');
                    //$(this).find("[id^='PhotoAttachement']").attr('data-valid-msg', 'Attach Photo');
                }
                else
                    return true;
            });
          // this is new 
          
            $(alltr).find("input[data-role='datepicker'][id^='ValidFrom']").each(function () {
                if ($(this).attr("id").indexOf("ValidFrom") != -1) {

                 
                    var validto = $('#' + $(this).attr("id")).closest("tr").find("input[name^='ValidTo']").data("kendoDatePicker");
                    if (validto) {
                        validto.min($('#' + $(this).attr("id")).data("kendoDatePicker").value());
                    }
                }
            });
        }
    }
}

function BindAttachement(elem, mainElem) {

    $(elem).find("input[data-role='datepicker'][id^='ValidFrom']").each(function () {
        $('#' + $(this).attr("id")).kendoDatePicker({
            change: function (a, b) {
                if (($(a.sender.element).attr("id")).indexOf("ValidFrom") != -1) {
                    var validto = $(a.sender.element).closest("tr").find("input[name^='ValidTo']").data("kendoDatePicker");
                    if (validto) {
                        validto.value("");
                        validto.min(a.sender.element.data("kendoDatePicker").value());
                    }
                }
            }
        });

        if ($(this).attr("id").indexOf("ValidFrom") != -1) {
            var validto = $('#' + $(this).attr("id")).closest("tr").find("input[name^='ValidTo']").data("kendoDatePicker");
            if (validto) {
                validto.min($('#' + $(this).attr("id")).data("kendoDatePicker").value());

             
            }
        }

    });

    $(elem).find("input[id^='IdCardAttachement_']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadAuthorizesPERSONNEL($(this).attr("id"), "IdCardName");
        });
    });

    $(elem).find("span[id^='IdCardName']").each(function () {
        $(this).text(elem.closest('table').find("tr:eq(0)").find("td:eq(6)").find("span[id='spnIdCardName']").text());
    });

    $(elem).find("input[id^='AuthorizationLetterAttachement']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadAuthorizesPERSONNEL($(this).attr("id"), "AuthorizationLetterName");
        });
    });

    $(elem).find("span[id^='AuthorizationLetterName']").each(function () {
        $(this).text(elem.closest('table').find("tr:eq(0)").find("td:eq(8)").find("span[id='spnAuthorizationLetterName']").text());
    });

    $(elem).find("input[id^='PhotoAttachement']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadAuthorizesPERSONNEL($(this).attr("id"), "PhotoName");
        });
    });

    $(elem).find("span[id^='PhotoName']").each(function () {
        $(this).text(elem.closest('table').find("tr:eq(0)").find("td:eq(10)").find("span[id='spnPhotoName']").text());
    });
    $("#divareaTrans_Master_AuthorizedPersonal table:last tr td:nth-child(13)").hide();
    if ($('#divareaTrans_Master_AuthorizedPersonal table:eq(1)').find("tr[id]").length > arraylength) {
        var alltr = $('#divareaTrans_Master_AuthorizedPersonal table:eq(1)').find("tr[id]:last");
        //alert('fgdfg');
       
   
         // $(alltr).find("[id^='IdCardAttachement']").attr('data-valid', 'required');
         // $(alltr).find("[id^='IdCardAttachement']").attr('data-valid-msg', 'Attach Id Card');

         //$(alltr).find("[id^='AuthorizationLetterAttachement']").attr('data-valid', 'required');
         // $(alltr).find("[id^='AuthorizationLetterAttachement']").attr('data-valid-msg', 'Attach Authorization Letter');

         // $(alltr).find("[id^='PhotoAttachement']").attr('data-valid', 'required');
         // $(alltr).find("[id^='PhotoAttachement']").attr('data-valid-msg', 'Attach Photo');
        $('[id^="mobileno"]').attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
    }
    $('[id^="mobileno"]').attr("onblur", "checkMobileNumber(this.id)");
}

function ReBindAttachement(elem, mainElem) {
    $(elem).find("input[data-role='datepicker'][id^='ValidFrom']").each(function () {
        if ($(this).attr("id").indexOf("ValidFrom") != -1) {
            var validto = $('#' + $(this).attr("id")).closest("tr").find("input[name^='ValidTo']").data("kendoDatePicker");
            if (validto) {
                validto.min($('#' + $(this).attr("id")).data("kendoDatePicker").value());
                //var todaydate = new Date();
                //var validfromdate = $("#ValidFrom").data("kendoDatePicker");
                //validfromdate.min(todaydate);
            }
        }
    });

    $(elem).closest("div[id$='areaTrans_master_authorizedPersonal']").find("[id^='areaTrans_master_authorizedPersonal']").each(function () {
        $(this).find("input[id^='IdCardName']").unbind("change").bind("change", function () {
            UploadAuthorizesPERSONNEL($(this).attr("id"), "IdCardName");
        });
        $(this).find("input[id^='AuthorizationLetterName']").unbind("change").bind("change", function () {
            UploadAuthorizesPERSONNEL($(this).attr("id"), "AuthorizationLetterName");
        });
        $(this).find("input[id^='PhotoName']").unbind("change").bind("change", function () {
            UploadAuthorizesPERSONNEL($(this).attr("id"), "PhotoName");
        });
    });
}
var BackEndFileExtension = [];
var extension = '';
function UploadAuthorizesPERSONNEL(objId, nexctrlid) {

   
   
  
    var userobject = userContext.SysSetting.AllowedUploadFileExtension.toUpperCase().split(',');
    BackEndFileExtension.push(userobject);
    // var extension = file.substr((file.lastIndexOf('.') + 1));
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;

    var fileName1 = files.item(0).name;
   
    extension = (fileName1.toUpperCase().substr((fileName1.toUpperCase().lastIndexOf('.') + 1)));
    var fileName = "";

    //var check_selected = '';
    //check_selected = myData.Table0[0].Codes;
    //var check_selected_SNos = '';
    //check_selected_SNos = myData.Table0[0].SNos;

   // foundPresent_ = $.inArray(extension, BackEndFileExtension) > -1;
  
    // jQuery
    //alert($.inArray(extension, BackEndFileExtension[0]));
    if ($.inArray(extension, BackEndFileExtension[0]) != '-1')
    {
       // alert(extension + ' is in the array!');
    }
    else
    {
        alert('Please Select only ' + BackEndFileExtension[0] + ' Extension(s)');
        return;
    }

    //if (files['0'].size > 10240)
    //    alert("Max image size is 10 mb");
    //else {
    var fsize = files.item(0).size;
    // alert(fsize);
    var sizeInMB = fsize / 1048576;
    // alert(parseFloat(sizeInMB).toFixed(2));
    if (parseFloat(sizeInMB).toFixed(2) > 3) {
        alert('Please upload either 3 MB and Less than 3 MB ');
        return;
    }

    // var fileName, fileExtension;
    //  fileName = ‘file.jpeg’;
    // fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1));


    //var objFSO = new ActiveXObject("Scripting.FileSystemObject"); var filePath = $("#" + fileid)[0].value;
    //var objFile = objFSO.getFile(filePath);
    //var fileSize = objFile.size; //size in kb
    //fileSize = fileSize / 1048576;


    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);

        // var fsize = files.item(i).size;
    }
    if ((fileName.length) - (('.' + fileName.split('.').pop()).length) > 150) {
        ShowMessage('info', 'File Upload!', "Unable to upload selected file. File Name should be less than 150 characters.", "bottom-right");
        return;
    }
    else {
        $.ajax({
            url: "Handler/UploadImage.ashx",
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {

                if (result.indexOf("Session has been expired!!!") >= 0) {
                    ShowMessage('warning', 'File Upload!', "Session has been expired!!!", "bottom-right");
                }
                else {
                  
                    var add = '<span id="1" class="k-icon k-delete"></span>'
                    
                    $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);

                    $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
                  //  $("#ahref_AuthorizationLetterName").append('<span id="asd" class="k-icon k-delete"></span>');
                    // This is   $("#ahref_AuthorizationLetterName").after('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id=' + nexctrlid + ' class="k-icon k-delete" >Delete</span>');
                
                }
            },
            error: function (err) {
                ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            }
        });
    }
}

function DownloadAuthorizesPERSONNEL(objId, nexctrlid) {
   
    var ImagePath = $("#" + objId).find("span").text();
    var ImageId = nexctrlid.replace("Name", "Attachement");
    var CustomerAuthorizedPERSONNELSNo = $("#" + objId).closest("tr").find("td input[id^='SNo']").val(); //$("#" + objId).closest("tr").find("td:eq(9)").text();

    if (CustomerAuthorizedPERSONNELSNo != '')//$("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
    {
        window.location.href = "Handler/UploadImage.ashx?CustomerSNo=" + $("#hdnCustomerSNo").val() + "&CustomerAuthorizedPERSONNELSNo=" + CustomerAuthorizedPERSONNELSNo + "&FileName=" + ImagePath + "&ImageId=" + ImageId + "";
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }

    //$.ajax({
    //    //url: "Services/Master/CustomerService.svc/GetAuthorizedImage",
    //    url: "Handler/UploadImage.ashx",
    //    async: false, type: "GET", dataType: "html", cache: false,
    //    data: { CustomerSNo: $("#hdnCustomerSNo").val(), ImagePath: ImagePath, ImageId: ImageId, CustomerAuthorizedPERSONNELSNo: CustomerAuthorizedPERSONNELSNo },
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        alert("");
    //       // $("#divImage").html("");
    //        //$("#ahref_IdCardName").attr('href', "http://localhost:8000/UploadImage//" + result);
    //       // $("#divImage").html("<img src=" + result + "></img>");
    //        //$("#divImage").dialog({
    //        //    title: ImageId,
    //        //    width: 800,
    //        //    height: 350,
    //        //    modal: true,
    //        //    buttons: {
    //        //        Close: function () {
    //        //            //var deletePath = "http://localhost:8000/UploadImage//" + ImagePath;
    //        //            //var fso = new ActiveXObject('Scripting.FileSystemObject');
    //        //            //fso.DeleteFile(deletePath, true);
    //        //            //fso = null;
    //        //            //alert("hi");
    //        //            $(this).dialog('close');
    //        //        }
    //        //    }
    //        //});
    //    },
    //    error: {
    //    }
    //});
}


function DeleteAuthorizesPERSONNEL(objId, nexctrlid)
{
    var ImagePath = $("#" + objId).find("span").text();
    var ImageId = nexctrlid.replace("Name", "Attachement");
    var CustomerAuthorizedPERSONNELSNo = $("#" + objId).closest("tr").find("td input[id^='SNo']").val(); //$("#" + objId).closest("tr").find("td:eq(9)").text();

    if (CustomerAuthorizedPERSONNELSNo != '')//$("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
    {
        window.location.href = "Handler/UploadImage.ashx?CustomerSNo=" + $("#hdnCustomerSNo").val() + "&CustomerAuthorizedPERSONNELSNo=" + CustomerAuthorizedPERSONNELSNo + "&FileName=" + ImagePath + "&ImageId=" + ImageId + "";
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function EventHideShow(valueId, value, keyId, key) {
    if (value == "CONSIGNEE" && userContext.SpecialRights.FOC == true) {
        $("[name='IsFocConsignee']").removeAttr("disabled");
        $("#spnIsFocConsignee").show();
        $("#divRadio").show();
    }
    else {
        $("[name='IsFocConsignee']").attr("disabled", "disabled");
        $("#spnIsFocConsignee").hide();
        $("#divRadio").hide();
    }

    if (value == "CONSIGNEE" && userContext.SpecialRights.FOC == false) {
        $("[name='IsFocConsignee']").attr("disabled", "disabled");
        $("#spnIsFocConsignee").show();
        $("#divRadio").show();
    }
    if (value == "CONSIGNEE") {
        $('#divRadioForwarder').show();
        $('#divConForwarder').show();
        if ($("#AccountSNo").val() != "") {
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", true);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", false);
            $('#Text_AccountSNo').attr("data-valid", "required");
            $('#Text_AccountSNo').attr("data-valid-msg", "Forwarder (Agent) Name can not be blank");
            $("#spnAccountSNo").closest('td').find("font").remove();
            $("#spnAccountSNo").before('<font color="red">*</font>');
            $('#Text_AccountSNo').css('border-color', '#94c0d2');
        }
    }
    else {
        $('#divRadioForwarder').hide();
        $('#divConForwarder').hide();
        $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", false);
        $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", true);
        $('#Text_AccountSNo').removeAttr("data-valid");
        $('#Text_AccountSNo').removeAttr("data-valid-msg");
        $("#spnAccountSNo").closest('td').find("font").remove();
        $('#Text_AccountSNo').closest('span').css('border-color', '');
    }
}

function SaveAttachment() {

    if (!cfi.IsValidTransSection("divareaTrans_Master_AuthorizedPersonal")) {
        return false;
    }
    var AuthorizedPERSONNELArray = [];
    var flag = false;
    $("tr[id^=areaTrans_Master_AuthorizedPersonal]").each(function () {
        var authorizedPERSONNEL = {
            SNo: parseInt($(this).find("input[id^='SNo']").val() == "" ? 0 : $(this).find("input[id^='SNo']").val()),
            CustomerSNo: $('#hdnCustomerSNo').val(),
            Name: $(this).find("input[id^='Name']").val(),
            IdCardNo: $(this).find("input[id^='IdCardNo']").val(),
            MobileNo: $(this).find("input[id^='mobileno']").val(),
            ValidFrom: $(this).find("input[id^='ValidFrom']").val(),
            ValidTo: $(this).find("input[id^='ValidTo']").val(),
            IdCardName: $(this).find("span[id^='IdCardName']").text(),

            AttachIdCardName: $(this).find("a[id^='ahref_IdCardName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_IdCardName']").attr("linkdata"),
            AuthorizationLetterName: $(this).find("span[id^='AuthorizationLetterName']").text(),
            AttachAuthorizationLetterName: $(this).find("a[id^='ahref_AuthorizationLetterName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_AuthorizationLetterName']").attr("linkdata"),
            PhotoName: $(this).find("span[id^='PhotoName']").text(),
            AttachPhotoName: $(this).find("a[id^='ahref_PhotoName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_PhotoName']").attr("linkdata")
        };
        AuthorizedPERSONNELArray.push(authorizedPERSONNEL);
    });

    if (AuthorizedPERSONNELArray.length == 0) {
        ShowMessage('warning', 'Warning - Authorized Personnel Info', "Blank details are unable to process.", "bottom-right");
    }

    $.ajax({
        url: "Services/Master/CustomerService.svc/SaveAuthorizedPersonal", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AuthorizedPersonal: AuthorizedPERSONNELArray }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Authorized Personnel Info', "Processed Successfully", "bottom-right");
                flag = true;
                GetAuthorizedPersonnel();
                $('a[id]').removeAttr('linkdata');
            }
            else
                ShowMessage('warning', 'Warning - Authorized Personnel Info', "unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Authorized PERSONNEL Info', "unable to process.", "bottom-right");
        }
    });
    return flag;


}

function checkPhoneNumber(obj) {
    //========= edit by arman ali date 17-03-2017 ============================//
    //validation for Contact number length min 6 digits //
    if ($('#' + obj).val().length < 6) {//&& $('#' + obj).val().length > 0
        ShowMessage('warning', 'Info - Participant Address Details', "Minimum 6 digits are required in Contact No\n", "bottom-right");
        $('#' + obj).val('');
        return false;
    }
}

function FOCShowHide(FOCRight) {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#spnIsFocConsignee").hide();
        $("#divRadio").hide();
        $('input[name="IsFocConsignee"][value="0"]').attr("checked", false);
        $('input[name="IsFocConsignee"][value="1"]').attr("checked", true);

        if ($('#Text_CustomerTypeSNo').val() == "CONSIGNEE" && $('#AccountSNo').val() != "") {
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", true);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", false);
            $('#Text_AccountSNo').attr("data-valid", "required");
            $('#Text_AccountSNo').attr("data-valid-msg", "Forwarder (Agent) Name can not be blank");
            $("#spnAccountSNo").closest('td').find("font").remove();
            $("#spnAccountSNo").before('<font color="red">*</font>');
            $('#Text_AccountSNo').css('border-color', '#94c0d2');
        }
        else {
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", false);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", true);
            $('#Text_AccountSNo').removeAttr("data-valid");
            $('#Text_AccountSNo').removeAttr("data-valid-msg");
            $("#spnAccountSNo").closest('td').find("font").remove();
            $('#Text_AccountSNo').closest('span').css('border-color', '');
        }
        $('#divRadioForwarder').hide();
        $('#divConForwarder').hide();

    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        if ($('#Text_CustomerTypeSNo').val() == "CONSIGNEE" && FOCRight == true) {
            $("[name='IsFocConsignee']").removeAttr("disabled");
            $("#spnIsFocConsignee").show();
            $("#divRadio").show();
        }
        else {
            $("[name='IsFocConsignee']").attr("disabled", "disabled");
            $("#spnIsFocConsignee").hide();
            $("#divRadio").hide();
        }

        if ($('#Text_CustomerTypeSNo').val() == "CONSIGNEE" && FOCRight == false) {
            $("[name='IsFocConsignee']").attr("disabled", "disabled");
            $("#spnIsFocConsignee").show();
            $("#divRadio").show();
        }

        if ($('#Text_CustomerTypeSNo').val() == "CONSIGNEE") {
            $('#divRadioForwarder').show();
            $('#divConForwarder').show();
            if ($('input[name="IsConsigneeAsForwarder"][value="0"]').is(':checked') == true) {
                $('#Text_AccountSNo').attr("data-valid", "required");
                $('#Text_AccountSNo').attr("data-valid-msg", "Forwarder (Agent) Name can not be blank");
                $("#spnAccountSNo").closest('td').find("font").remove();
                $("#spnAccountSNo").before('<font color="red">*</font>');
                $('#Text_AccountSNo').css('border-color', '#94c0d2');
            }
        }
        else {
            $('#divRadioForwarder').hide();
            $('#divConForwarder').hide();
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", false);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", true);
        }
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if ($('#CustomerTypeName').text() == "CONSIGNEE") {// && FOCRight == true
            $("#spnIsFocConsignee").show();
            $('#FocConsignee').show();
            $('#divRadioForwarder').show();
            $('#divConForwarder').show();

        }
        else {
            $("#spnIsFocConsignee").hide();
            $('#FocConsignee').hide();
            $('#divRadioForwarder').hide();
            $('#divConForwarder').hide();
        }
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if ($('#CustomerTypeName').text() == "CONSIGNEE" && FOCRight == true) {
            $("[name='IsFocConsignee']").removeAttr("disabled");
            $("#spnIsFocConsignee").show();
            $("#divRadio").show();
        }
        else {
            $("[name='IsFocConsignee']").attr("disabled", "disabled");
            $("#spnIsFocConsignee").hide();
            $("#divRadio").hide();
        }

        if ($('#CustomerTypeName').text() == "CONSIGNEE" && FOCRight == false) {
            $("[name='IsFocConsignee']").attr("disabled", "disabled");
            $("#spnIsFocConsignee").show();
            $("#divRadio").show();
        }

        if ($('#CustomerTypeName').text() == "CONSIGNEE") {
            $('#divRadioForwarder').show();
            $('#divConForwarder').show();
            if ($('input[name="IsConsigneeAsForwarder"][value="0"]').is(':checked') == true) {
                $('#Text_AccountSNo').attr("data-valid", "required");
                $('#Text_AccountSNo').attr("data-valid-msg", "Forwarder (Agent) Name can not be blank");
                $("#spnAccountSNo").closest('td').find("font").remove();
                $("#spnAccountSNo").before('<font color="red">*</font>');
                $('#Text_AccountSNo').css('border-color', '#94c0d2');
            }
        }
        else {
            $('#divRadioForwarder').hide();
            $('#divConForwarder').hide();
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", false);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", true);
        }
    }
}

function checkMobileNumber(obj) {
    //========= edit by arman ali ============================//
    //validation for mobile number length min 6 digits //
    if ($('#' + obj).val().length < 6 && $('#' + obj).val().length > 0) {
        ShowMessage('warning', 'Info - Authorized Personnel', "Minimum 6 digits are required in Mobile No\n", "bottom-right");
        $('#' + obj).val('');
        return false;
    }
}

//check DirtyFields Inside the Page
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};

function CheckConsigneeAsfarwarder() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        if ($('#Text_CustomerTypeSNo').val() == "CONSIGNEE") {
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", true);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", false);
            $('#Text_AccountSNo').attr("data-valid", "required");
            $('#Text_AccountSNo').attr("data-valid-msg", "Forwarder (Agent) Name can not be blank");
            $("#spnAccountSNo").closest('td').find("font").remove();
            $("#spnAccountSNo").before('<font color="red">*</font>');
            $('#Text_AccountSNo').css('border-color', '#94c0d2');
        }
        else {
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", false);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", true);
            $('#Text_AccountSNo').removeAttr("data-valid");
            $('#Text_AccountSNo').removeAttr("data-valid-msg");
            $("#spnAccountSNo").closest('td').find("font").remove();
            $('#Text_AccountSNo').closest('span').css('border-color', '');
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if ($('#CustomerTypeName').text() == "CONSIGNEE") {
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", true);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", false);
            $('#Text_AccountSNo').attr("data-valid", "required");
            $('#Text_AccountSNo').attr("data-valid-msg", "Forwarder (Agent) Name can not be blank");
            $("#spnAccountSNo").closest('td').find("font").remove();
            $("#spnAccountSNo").before('<font color="red">*</font>');
            $('#Text_AccountSNo').css('border-color', '#94c0d2');

        }
        else {
            $('input[name="IsConsigneeAsForwarder"][value="0"]').attr("checked", false);
            $('input[name="IsConsigneeAsForwarder"][value="1"]').attr("checked", true);
            $('#Text_AccountSNo').removeAttr("data-valid");
            $('#Text_AccountSNo').removeAttr("data-valid-msg");
            $("#spnAccountSNo").closest('td').find("font").remove();
            $('#Text_AccountSNo').closest('span').css('border-color', '');
        }
    }
}


function removecValidation() {
    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='Name']").removeAttr("data-valid");
    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='Name']").removeAttr("data-valid-msg");

    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardNo']").removeAttr("data-valid");
    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardNo']").removeAttr("data-valid-msg");

    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='mobileno']").removeAttr("data-valid");

    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='ValidFrom']").removeAttr("data-valid");
    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='ValidTo']").removeAttr("data-valid");

    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardAttachement']").removeAttr("data-valid");
    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='IdCardAttachement']").removeAttr("data-valid-msg");

    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='AuthorizationLetterAttachement']").removeAttr("data-valid");
    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='AuthorizationLetterAttachement']").removeAttr("data-valid-msg");

    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='PhotoAttachement']").removeAttr("data-valid");
    $('#divareaTrans_Master_AuthorizedPersonal table').find("[id^='PhotoAttachement']").removeAttr("data-valid-msg");
}




function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    //  cfi.DateType(controlId);
                    $("#" + controlId).kendoDatePicker({
                        format: "dd-MMM-yyyy",
                        min: new Date(1950, 0, 1),
                        max: new Date(2999, 11, 31),
                        value: new Date(),
                        change: function (a, b) {
                            if (($(a.sender.element).attr("id")).indexOf("ValidFrom") != -1) {
                                var validto = $(a.sender.element).closest("tr").find("input[name^='ValidTo']").data("kendoDatePicker");
                                if (validto) {
                                    validto.value("");
                                    validto.min(a.sender.element.data("kendoDatePicker").value());
                                }
                            }
                        }
                    });
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("#" + containerId).find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("#" + containerId).find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });
    SetDateRangeValue();

    //$("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    if ($(this).attr("recname") == undefined) {
    //        var controlId = $(this).attr("id");
    //        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //    }
    //});

    cfi.ValidateSubmitSection();
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });
    $("input[name='operation']").click(function () {
        _callBack();


    });
    $("[id$='divRemoveRecord']").hide();
    $("input[name='operation']").click(function () {
        if (cfi.IsValidSubmitSection()) {
            StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            StopProgress();
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                AuditLogSaveNewValue("MainDiv");
            }
            return true;
        }
        else {
            return false
        }



    });
    _callBack = function () {
        if ($.isFunction(window.MakeTransDetailsData)) {
            return MakeTransDetailsData();
        }
    }

    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }

    $(".removepopup").click(function () {
        $("#divRemovePanel").show();
        cfi.PopUp("divRemoveRecord", "");
    });
    $(".cancelpopup").click(function () {
        $("#divRemovePanel").hide();
        cfi.ClosePopUp("divRemoveRecord");
    });
}
//================by arman Date : 18-05-2017 purpose: get countrusno on city click  ==============================
function getCountrySNo() {
  
    if ($("#CityCode").val() != "") {
       
        $.ajax({
            url:  "Services/Master/CustomerService.svc/GetCountrySNo",
            datatpye: "JSON",
            data: { CitySNo: $("#CityCode").val() },
            tpye: "GET",
            async: false,
            contentType: "application/json; charset=utf-8", cache: false,

            success: function (result) {


                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        coutrysno = parseInt(myData.Table0[0].CountrySNo);
                        country = coutrysno;
                    }
                }
                return coutrysno;
            },
            error: function (xhr) {
                var a = "";
            }

        });
        return coutrysno;


    }
}
//=============end========================

