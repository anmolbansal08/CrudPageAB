var SiteUrl = "";
var _DefaultAutoComplete_ = [{ Key: "", Text: "" }];
var timeoutvalue = 0;
var userContext = "";
var attrType = "controltype";
var dateType = "datetype";
var otherType = "OtherType";
var autoCompleteType = "autocomplete";
var autoCompleteText = "Text";
var autoCompleteKey = "Key";
var wndError, wndSuccess;
var _SessionWeightRound_ = 0.5;
var formCulture = "en-US";

//var InvoicingCycleTypeAA = [{ Key: "-1", Text: "ALL" }, { Key: "1", Text: "Weekly" }, { Key: "3", Text: "Fortnightly" }, { Key: "4", Text: "Monthly" }, { Key: "5", Text: "1 Days" },{ Key: "6", Text: "7 Days" }, { Key: "7", Text: "10 Days" }];
//var InvoicingCycleTypeAA = [{ Key: "-1", Text: "ALL" }, { Key: "4", Text: "Monthly" }, { Key: "3", Text: "Fortnightly" }, { Key: "2", Text: "10 Days" }, { Key: "1", Text: "Weekly" }, { Key: "0", Text: "1 Days" }];
//var InvoicingCycleType = [{ Key: "-1", Text: "ALL" }, { Key: "4", Text: "Monthly" }, { Key: "3", Text: "Fortnightly" }, { Key: "2", Text: "10 Days" }, { Key: "1", Text: "Weekly" }, { Key: "0", Text: "1 Days" }];
var InvoicingCycleTypeAA = [{ Key: "-1", Text: "ALL" }, { Key: "2", Text: "Weekly" }, { Key: "4", Text: "Fortnightly" }, { Key: "5", Text: "Monthly" }]
var InvoicingCycleType = [{ Key: "-1", Text: "ALL" }, { Key: "2", Text: "Weekly" }, { Key: "4", Text: "Fortnightly" }, { Key: "5", Text: "Monthly" }]
var ValueType = [{ Key: "1", Text: "Plus Pecentage" }, { Key: "2", Text: "Minus Percentage" }, { Key: "3", Text: "Plus Flat" }, { Key: "4", Text: "Minus Flat" }];
var IATATYPE = [{ Key: "1", Text: "TC1" }, { Key: "2", Text: "TC2" }, { Key: "3", Text: "TC3" }];
var SLITYPE = [{ Key: "1", Text: "SEA-AIR" }, { Key: "2", Text: "RE-EXPORT" }, { Key: "3", Text: "LOCAL" }, { Key: "4", Text: "FREEZONE" }];
var SLICustomerTYPE = [{ Key: "1", Text: "REGULAR" }, { Key: "2", Text: "WALK IN" }];
var SLIChargeCode = [{ Key: "1", Text: "PP-Prepaid" }, { Key: "2", Text: "CC-Collect" }];
var WeightValuation = [{ Key: "PP", Text: "Prepaid" }, { Key: "CC", Text: "Collect" }];
var BillTo = [{ Key: "0", Text: "Agent" }, { Key: "1", Text: "Airline" }];
var OnSelectOriginIATA = "OnSelectOriginIATA";
var OnSelectDestinationIATA = "OnSelectDestinationIATA";

var SiteUrl = "";

kendo.culture(formCulture);
//kendo.culture("in-IN");
//END AUTO COMPLETE DATA SOURCE SECTION
function navigateUrl(currenturl) {
    var res = false;
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: SiteUrl + "Services/CommonService.svc/CheckSession",
        success: function (response) {
            if (response.CheckSessionResult == false) {
                OpenLoginWindow();
                res = false;
            } else {
                window.location.href = currenturl;
            }
        }, error: function () {
            location.href = SiteUrl + 'Account/' + userContext.SysSetting.LoginPage + '?islogout=true';
        }
    });
    return res;
}
//-----  added by Anand  ----------------------------------
function isEmpty(value) {
    return typeof (value) == 'undefined' || value == null;
}
//Numeric
function checkNumeric(id) {
    if (!$.isNumeric($('#' + id).val()) || $('#' + id).val() == '') {
        $('#' + id).val('0');
        $('#' + id).focus();
        //alert('Enter only numbers.');  //Commented By Manish Sir
        $('#' + id).css({
            "border": "1px solid red",
            "background": "#FFCECE"
        });
        //return false;
    }
}
//Alphanumeric
function checkAlphanumeric(currObject) {
    $(currObject).alphanumeric({ allow: ' ' });
}
//NumericWithHyphen

function checkNumericWithHyphen(currObject) {
    $(currObject).numeric({ allow: ' - ' });
}
//Alphabet

function checkAlphabet(currObject) {
    $(currObject).alpha({ allow: ' ' });
}
//NumberWithChar
function checkNumberwithAllowChar(currObject, allowchar) {
    $(currObject).numeric({ allow: allowchar });
}
//EmailCheck
function checkForEmail(currObject) {
    if ($("#" + currObject).val() != "") {
        var emailaddress = $("#" + currObject).val();
        var emailexp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (!emailexp.test(emailaddress)) {
            $("#" + currObject).val('');
            ShowMessage('info', 'Please enter valid email address.');
            $("#" + currObject).focus();
        }
    }

}
this.ConvertCulture = function (obj, defaultCulture) {
    if (obj.value !== "" && obj.value != undefined && obj.value != null)
        kendo.convertCulture(obj.id, obj.value, defaultCulture);
}
function checkkeypress(e, ch) {

    if (!e.charCode) k = String.fromCharCode(e.which);
    else k = String.fromCharCode(e.charCode);

    if (ch.indexOf(k) != -1) e.preventDefault();
    if (e.ctrlKey && k == 'v') e.preventDefault();

}
$(window).unload(function () {
    if ($("#hdnLo").val() == "")
        cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");

});

function validateTableData(id, uRows) {
    var upRows;
    if (!$.isArray(uRows)) {
        upRows = new Array();
        upRows[0] = uRows;
    }
    else
        upRows = uRows;
    var isValid = true;
    $('#' + id + (upRows.length != 1 ? ' tr input[id*="' + id + '_"]' : ' input[id*="_' + upRows[0] + '"]')).each(function () {
        if (this.dataset.role == 'autocomplete' && this.type != 'hidden' && this.required) {
            var inputID = this.id;
            if (inputID.split('_').length == 3)
                inputID = inputID.split('_')[0] + '_Hdn' + inputID.split('_')[1] + '_' + inputID.split('_')[2];
            if ($.trim($('#' + inputID).val()) == '') {
                isValid = false;
                $(this).css({ "border": "1px solid red" });
            }
            else $(this).css({ "border": "" });
        }//'alphanumericupper'
        else if ((this.dataset.role == 'numerictextbox' || this.dataset.role == 'decimal1' || this.dataset.role == 'decimal2' || this.dataset.role == 'decimal3' || this.dataset.role == 'decimal4' || this.dataset.role == 'decimal5') && this.required) {
            if (eval($.trim($('#_temp' + this.id).val())) == 0 || $.trim($('#_temp' + this.id).val()) == '') {
                isValid = false;
                $('#_temp' + this.id).css({ "border": "1px solid red" });
            } else $('#_temp' + this.id).css({ "border": "" });
        }
        else if (this.type == 'radio' && this.required) {
            if ($("input:radio[name=" + this.id.split('_')[0] + '_' + this.id.split('_')[1] + '_' + this.id.split('_')[2] + "]:checked").val() == undefined) {
                isValid = false;
                $('#table' + this.id.split('_')[1] + this.id.split('_')[2]).css({ "border": "1px solid red" });
            }
            else $('#table' + this.id.split('_')[1] + this.id.split('_')[2]).css({ "border": "" });
        }
        //else if (($.trim($(this).val()) == '' || ($(this).attr('minlength') != undefined ? $.trim($(this).val()).length != eval($(this).attr('minlength')) : 0 != 0)) && this.type != 'hidden' && this.required) {
        else if (($.trim($(this).val()) == '' || ($(this).attr('minlength') != undefined ? $.trim($(this).val()).length < eval($(this).attr('minlength')) : 0 != 0)) && this.type != 'hidden' && this.required) {
            isValid = false;
            $(this).css({ "border": "1px solid red" });
        }
        else if (this.id.split('_')[1].toUpperCase() == 'MAWBNO') {
            if (CheckAWBNumberFormat(this.id, "0")) {
                $('#' + id).css({
                    "border": ""

                });
            }
            else if (this.required) {
                isValid = false;
                $('#' + id).css({
                    "border": "1px solid red"
                });
            }
        }
        else $(this).css({ "border": "" });
    });
    return isValid;
}
function CargoFlashApplication() {
    var dateType = "datetype";
    var otherType = "OtherType";
    var autoCompleteType = "autocomplete";
    var attrType = "controltype";
    var url = function () { return SiteUrl + "Services/AutoCompleteService.svc/AutoCompleteDataSource"; }

    var numbertype = [{ key: "range", value: "-1" }, { key: "number", value: "0" }, { key: "decimal1", value: "1" }, { key: "decimal2", value: "2" }, { key: "decimal3", value: "3" }, { key: "decimal4", value: "4" }, { key: "decimal5", value: "5" }];

    var trnsformtype = [{ key: "datetype", value: "datetype" }, { key: "time", value: "none" }, { key: "ip", value: "none" }, { key: "contact", value: "none" }, { key: "default", value: "none" }, { key: "uppercase", value: "uppercase" }, { key: "lowercase", value: "lowercase" }, { key: "sentencecase", value: "capitalize" }, { key: "alphanumericupper", value: "uppercase" }, { key: "alphanumericlower", value: "lowercase" }, { key: "alphanumeric", value: "none" }, { key: "alphabet", value: "none" }];

    var alphabettype = [{ key: "time", value: "time" }, { key: "ip", value: "ip" }, { key: "contact", value: "contact" }, { key: "default", value: "default" }, { key: "uppercase", value: "alphabet" }, { key: "lowercase", value: "alphabet" }, { key: "alphabet", value: "alphabet" }, { key: "alphanumericupper", value: "alphanumeric" }, { key: "alphanumericlower", value: "alphanumeric" }, { key: "alphanumeric", value: "alphanumeric" }];

    this.Numeric = function (cntrlId, decimalPos, formatName) {
        var minValue = null, maxValue = null;
        if (decimalPos == -1) {
            decimalPos = 0;
            var allowChar = $("[id='" + cntrlId + "']").attr("allowchar");
            if (allowChar != undefined && allowChar != "") {
                minValue = allowChar.split('!')[0];
                maxValue = allowChar.split('!')[1];
            }
        }

        var widthset = "80px";
        if ($("[id='" + cntrlId + "']").css("width") != undefined)
            widthset = $("[id='" + cntrlId + "']").css("width");

        var subtype = $("[id='" + cntrlId + "']").attr("subtype");
        if ((subtype == undefined) && (formatName != undefined))
            subtype = formatName.toString().toLowerCase();

        $("[id='" + cntrlId + "']").kendoNumericTextBox({
            value: 10,
            min: minValue,
            max: maxValue,
            step: 1,
            format: (subtype == "weight" ? "#.00 kg" : (subtype == "currency" ? "c" : "n") + decimalPos),
            decimals: decimalPos,
            width: widthset,
            wrap: true
        });
    }

    this.AlphabetTextBox = function (cntrlId, alphabetstyle) {
        var allowChar = $("[id='" + cntrlId + "']").attr("allowchar");
        var width = $("[id='" + cntrlId + "']").css("width");
        var maxLength = $("[id='" + cntrlId + "']").attr("maxLength");
        $("[id='" + cntrlId + "']").kendoAlphabetTextBox({
            value: 10,
            textTransform: alphabetstyle,
            textType: TextType(cntrlId),
            allowChar: allowChar != undefined ? allowChar : "",
            width: width,
            maxLength: (maxLength == undefined || maxLength == "" ? 15 : maxLength)
        });
    }

    this.getFilter = function (logic) {
        var filter = { logic: (logic == undefined || logic == "" ? "AND" : logic), filters: [] };
        return filter;
    }

    this.setFilter = function (filterName, field, operator, value) {
        if (filterName != undefined) {
            filterName.filters.push({ field: field, operator: operator, value: value });
        }
    }

    this.autoCompleteFilter = function (filterName) {
        var filter = { logic: "AND", filters: [] };
        if (Object.prototype.toString.call(filterName) === '[object Array]') {
            for (var i = 0; i < filterName.length; i++)
                if (filterName[i] != undefined) {
                    filter.filters.push(filterName[i]);
                }
        }
        else {
            if (filterName != undefined) {
                filter.filters.push(filterName);
            }
        }
        return filter;
    }

    this.DateType = function (cntrlId) {
        var startControl = $("#" + cntrlId).attr("startControl");
        var endControl = $("#" + cntrlId).attr("endControl");
        $("#" + cntrlId).kendoDatePicker({
            format: "dd-MMM-yyyy",
            min: (startControl == undefined || cntrlId == startControl ? new Date(1950, 0, 1) : new Date()),//new Date(1950, 0, 1)
            max: (endControl == undefined || cntrlId == endControl ? new Date(2999, 11, 31) : new Date()),//new Date(2049, 11, 31)
            startControlId: (startControl == undefined ? null : startControl),
            endControlId: (endControl == undefined ? null : endControl),
            value: new Date(),
            change: ((startControl != undefined && startControl == cntrlId) ? startChange : (endControl != undefined && endControl == cntrlId) ? endChange : null)
        });
    }

    this.AutoCompleteByDataSource = function (textId, dataSourceName, addOnFunction, separator) {

        var keyId = textId;
        textId = "Text_" + textId;
        $("div[id^='" + textId + "-list']").remove();
        if (IsValid(textId, autoCompleteType)) {
            basedOn = autoCompleteText;
            var dataSource = dataSourceName;
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: "startswith",
                dataSource: dataSource,
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction)
            });
        }
    }

    this.AutoComplete = function (textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template, IsChangeOnBlankValue) {

        var keyId = textId;
        textId = "Text_" + textId;
        $("div[id^='" + textId + "-list']").remove();
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (filterCriteria || "contains"),//== undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria), //Changed By CS on 2018-02-12   startwith to contains
                dataSource: dataSource,
                select: (onSelect == undefined ? null : onSelect),
                filterField: basedOn,
                rightAlign: (rightAlign == undefined ? false : rightAlign),
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: template == null ? '<span>#: TemplateColumn #</span>' : template,
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd,
                IsChangeOnBlankValue: (IsChangeOnBlankValue == undefined ? false : IsChangeOnBlankValue)
            });
        }
    }



    this.AutoCompleteV2 = function (textId, basedOn, autoCompleteName, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template, IsChangeOnBlankValue, Parameterlist) {
        var keyId = textId;

        textId = "Text_" + textId;
        $("div[id^='" + textId + "-list']").remove();
        if (IsValid(textId, autoCompleteType)) {
            var dataSource = GetDataSourceV2(textId, autoCompleteName, Parameterlist);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (filterCriteria || "contains"),//Changed By CS on 2018-02-12   startwith to contains
                dataSource: dataSource,
                select: (onSelect == undefined ? null : onSelect),
                filterField: basedOn,
                rightAlign: (rightAlign == undefined ? false : rightAlign),
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: template == null ? '<span>#: TemplateColumn #</span>' : template,
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd,
                IsChangeOnBlankValue: (IsChangeOnBlankValue == undefined ? false : IsChangeOnBlankValue)
            });
        }
    }



    this.ChangeAutoCompleteDataSource = function (cntrlId, newDataSourceName, clearAllValue, addOnFunction, basedOn, filterCriteria) {

        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoAutoComplete");
        if (kendoAutoCompleteWC != undefined) {
            if (clearAllValue) {
                kendoAutoCompleteWC.setDefaultValue("", "");
                $("#Text_" + cntrlId).val("");
                $("#" + cntrlId).val("");
            }
            kendoAutoCompleteWC.setDataSource(newDataSourceName);
            kendoAutoCompleteWC.options.filter = (filterCriteria || "contains"),
                kendoAutoCompleteWC.options.filterField = (basedOn == undefined ? kendoAutoCompleteWC.options.filterField : basedOn);
            kendoAutoCompleteWC.options.addOnFunction = (addOnFunction == undefined ? null : addOnFunction);
            kendoAutoCompleteWC.setAddOnFunction(cntrlId);
        }
    }
    this.ValidateTransSection = function (sectionId, options) {
        if (options == undefined || options == "") {
            $("[id='" + sectionId + "']").each(function () {
                $(this).cfValidator();
            });
        }
        else {
            $("[id='" + sectionId + "']").each(function () {
                $(this).cfValidator(options);
            });
        }
    }
    this.IsValidTransSection = function (sectionId) {
        if (sectionId instanceof jQuery)
            return sectionId.data('cfValidator').validate();
        return $("#" + sectionId).data('cfValidator').validate();
    }
    this.makeTrans = function (containerId, linkText, isReset, addEventCallBack, removeEventCallBack, beforeAddEventCallback, data) {

        var popup = $("[id='areaTrans_" + containerId + "']").attr("data-popup");
        $("[id='areaTrans_" + containerId + "']").EnableMultiField({
            linkText: (linkText == null ? "Add More" : linkText),
            isReset: (isReset == null ? false : isReset),
            addEventCallback: (addEventCallBack == null ? null : addEventCallBack),
            beforeAddEventCallback: (beforeAddEventCallback == null ? null : beforeAddEventCallback),
            convertToControl: ConvertToControl,
            removeEventCallback: (addEventCallBack == null ? null : removeEventCallBack),
            data: (data != null ? data : []),
            IsPopUp: popup
        });
    }
    this.makeTrans = function (containerId, linkText, isReset, addEventCallBack, removeEventCallBack, beforeAddEventCallback, data, maxCount, isRemove) {
        var popup = $("[id='areaTrans_" + containerId + "']").attr("data-popup");
        $("[id='areaTrans_" + containerId + "']").EnableMultiField({
            linkText: (linkText == null ? "Add More" : linkText),
            isReset: (isReset == null ? false : isReset),
            addEventCallback: (addEventCallBack == null ? null : addEventCallBack),
            beforeAddEventCallback: (beforeAddEventCallback == null ? null : beforeAddEventCallback),
            convertToControl: ConvertToControl,
            removeEventCallback: (addEventCallBack == null ? null : removeEventCallBack),
            data: (data != null ? data : []),
            IsPopUp: popup,
            maxItemsAllowedToAdd: maxCount,
            isRemove: isRemove
        });
    }
    this.makeTrans = function (containerId, linkText, isReset, addEventCallBack, removeEventCallBack, beforeAddEventCallback, data, maxCount, isRemove, onDeleted) {
        var popup = $("[id='areaTrans_" + containerId + "']").attr("data-popup");
        $("[id='areaTrans_" + containerId + "']").EnableMultiField({
            linkText: (linkText == null ? "Add More" : linkText),
            isReset: (isReset == null ? false : isReset),
            addEventCallback: (addEventCallBack == null ? null : addEventCallBack),
            beforeAddEventCallback: (beforeAddEventCallback == null ? null : beforeAddEventCallback),
            convertToControl: ConvertToControl,
            removeEventCallback: (addEventCallBack == null ? null : removeEventCallBack),
            data: (data != null ? data : []),
            IsPopUp: popup,
            maxItemsAllowedToAdd: maxCount,
            isRemove: isRemove,
            OnDeleted: onDeleted
        });
    }


    this.GridAutoCompleteV2 = function (textId, basedOn, AutoCompleteName, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect, Parameterlist) {
        var keyId = textId;

        //textId = "Text_" + textId;
        var KeyIdArray = new Array();
        KeyIdArray = textId.split("_");
        var KeyIdHidden = "";
        if (KeyIdArray.length = 3) {
            KeyIdHidden = KeyIdArray[0] + '_' + 'Hdn' + KeyIdArray[1] + '_' + KeyIdArray[2];
        }

        if (IsValid(textId, autoCompleteType)) {
            var dataSource = GetDataSourceV2(textId, AutoCompleteName, Parameterlist);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (filterCriteria || "contains"),
                dataSource: dataSource,
                select: (onSelect == undefined ? null : onSelect),
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + KeyIdHidden + "']"),
                template: '<span>#: TemplateColumn #</span>',
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd
            });


        }
    }

    this.GridAutoComplete = function (textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect) {
        var keyId = textId;

        //textId = "Text_" + textId;
        var KeyIdArray = new Array();
        KeyIdArray = textId.split("_");
        var KeyIdHidden = "";
        if (KeyIdArray.length = 3) {
            KeyIdHidden = KeyIdArray[0] + '_' + 'Hdn' + KeyIdArray[1] + '_' + KeyIdArray[2];
        }

        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (filterCriteria || "contains"),
                dataSource: dataSource,
                select: (onSelect == undefined ? null : onSelect),
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + KeyIdHidden + "']"),
                template: '<span>#: TemplateColumn #</span>',
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd
            });
        }
    }
    GetDataSource = function (textId, tableName, keyColumn, textColumn, templateColumn, procName) {

        var dataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: url,
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: {
                        tableName: tableName,
                        keyColumn: keyColumn,
                        textColumn: textColumn,
                        templateColumn: templateColumn,
                        procedureName: procName
                    }
                },
                parameterMap: function (options) {
                    if (options.filter != undefined) {
                        var filter = _ExtraCondition(textId);
                        if (filter == undefined) {
                            filter = { logic: "AND", filters: [] };
                        }
                        filter.filters.push(options.filter);
                        options.filter = filter;
                    }
                    if (options.sort == undefined)
                        options.sort = null;
                    return JSON.stringify(options);
                }
            },
            schema: { data: "Data" }
        });
        return dataSource;
    }

    GetDataSourceV2 = function (textId, autoCompleteName, Parameterlist) {

        var dataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: SiteUrl + "Services/AutoCompleteService.svc/AutoCompleteDataSourceV2",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: {
                        autoCompleteName: autoCompleteName,
                        // Parameters: Parameterlist == undefined ? null : Parameterlist
                    }
                },
                parameterMap: function (options) {

                    if (options.filter != undefined) {
                        var filter = _ExtraCondition(textId);
                        if (filter == undefined) {
                            filter = { logic: "AND", filters: [] };
                        }
                        filter.filters.push(options.filter);
                        options.filter = filter;
                    }
                    if (options.sort == undefined)
                        options.sort = null;

                    // Added By Amit Yadav
                    if ($.isFunction(window.ExtraParameters)) {
                        options.Parameters = window.ExtraParameters(textId);
                    }
                    return JSON.stringify(options);
                }
            },
            schema: { data: "Data" }
        });
        return dataSource;
    }

    IsValid = function (cntrlId, attrValue) {
        var attr = $("[id='" + cntrlId + "']").attr(attrType);
        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false && attr == attrValue) {
            // ...
            return true;
        }
        return false;
    }

    this.IsValidNumeric = function (cntrlId) {
        var attr = $("[id='" + cntrlId + "']").attr(attrType);

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            for (var i = 0; i < numbertype.length; i++) {
                if (numbertype[i].key == attr)
                    return numbertype[i].value;
            }
        }
        return -2;
    }

    this.IsValidAlphabet = function (cntrlId) {
        var attr = $("[id='" + cntrlId + "']").attr(attrType);

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            for (var i = 0; i < trnsformtype.length; i++) {
                if (trnsformtype[i].key == attr)
                    return trnsformtype[i].value;
            }
        }
        return "";
    }

    TextType = function (cntrlId) {
        var attr = $("[id='" + cntrlId + "']").attr(attrType);

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            for (var i = 0; i < alphabettype.length; i++) {
                if (alphabettype[i].key == attr)
                    return alphabettype[i].value;
            }
        }
        return "";
    }

    this.ValidateForm = function (options) {
        if (options == undefined || options == "") {
            $("#aspnetForm").cfValidator();
        }
        else {
            $("#aspnetForm").cfValidator(options);
        }
    }

    this.ValidateSection = function (sectionId, options) {
        if (options == undefined || options == "") {
            $("[id='" + sectionId + "']").each(function () {
                $(this).cfValidator();
            });
        }
        else {
            $("[id='" + sectionId + "']").each(function () {
                $(this).cfValidator(options);
            });
        }
    }

    this.ValidateSubmitSection = function (options) {
        if (options == undefined || options == "") {
            $("[ValidateOnSubmit]").each(function () {
                $(this).cfValidator();
            });
        }
        else {
            $("[ValidateOnSubmit]").each(function () {
                $(this).cfValidator(options);
            });
        }
    }

    this.IsValidForm = function () {
        return $("#aspnetForm").data('cfValidator').validate();
    }

    this.IsValidSection = function (sectionId) {
        var flag = true;
        if (sectionId instanceof jQuery)
            return sectionId.find("[validateonsubmit='true']").data('cfValidator').validate();
        $("#" + sectionId).find("[validateonsubmit='true']").each(function () {
            if (flag)
                flag = $(this).data('cfValidator').validate();
        });
        return flag;
    }

    this.IsValidSubmitSection = function () {
        var valid = true;
        $("[ValidateOnSubmit]").each(function () {
            if (!$(this).data('cfValidator').validate()) {
                valid = false;
            }
        });
        return valid;
    }

    this.ResetValidateSection = function (sectionId) {
        if (sectionId instanceof jQuery) {
            sectionId.find("div.bVErrMsgContainer").each(function () {
                $(this).remove();
            });
            sectionId.find(".valid_invalid").each(function () {
                $(this).removeClass("valid_invalid");
            });
        }
    }
    //Amit
    this.PopUp = function (cntrlId, title, width, OnOpen, OnClose, topPosition) {

        var Kwindow = $("#" + cntrlId);

        if (!Kwindow.data("kendoWindow")) {
            Kwindow.kendoWindow({
                appendTo: "form#aspnetForm",
                width: ((width == null || width == undefined || width == "") ? "800px" : width + "px"),
                actions: ["Minimize", "Close"],
                title: title,
                modal: true,
                maxHeight: 500,
                close: (OnClose == undefined ? null : OnClose),
                open: (OnOpen == undefined ? null : OnOpen)
            });
            Kwindow.data("kendoWindow").open();
        }
        else {
            Kwindow.data("kendoWindow").open();
        }
        $(document).bind("keydown", function (e) {
            if (e.keyCode == kendo.keys.ESC) {
                var visibleWindow = $(".k-window:visible:last > .k-window-content")
                if (visibleWindow.length)
                    visibleWindow.data("kendoWindow").close();
            }
        });

        Kwindow.data("kendoWindow").center();
        $("#" + cntrlId).closest(".k-window").centerTop(topPosition);

        return false;
    }

    //Riyaz To create popup only not to open when create
    this.PopUpCreate = function (cntrlId, title, width, OnOpen, OnClose, topPosition) {
        var Kwindow = $("#" + cntrlId);
        if (!Kwindow.data("kendoWindow")) {
            Kwindow.kendoWindow({
                appendTo: "form#aspnetForm",
                width: ((width == null || width == undefined || width == "") ? "800px" : width + "px"),
                actions: ["Minimize", "Close"],
                title: title,
                modal: true,
                maxHeight: 500,
                close: (OnClose == undefined ? null : OnClose),
                open: (OnOpen == undefined ? null : OnOpen)
            });
            // Kwindow.data("kendoWindow").open();
        }
        //else {
        //    Kwindow.data("kendoWindow").open();
        //}
        $(document).bind("keydown", function (e) {
            if (e.keyCode == kendo.keys.ESC) {
                var visibleWindow = $(".k-window:visible:last > .k-window-content")
                if (visibleWindow.length)
                    visibleWindow.data("kendoWindow").close();
            }
        });
        topPosition = topPosition || 0;
        if (Kwindow.data("kendoWindow") != undefined)
            Kwindow.data("kendoWindow").center();
        $("#" + cntrlId).closest(".k-window").centerTop(topPosition);

        return false;
    }

    this.BindMultiValue = function (controlName, textDetail, keyDetail) {
        if (textDetail != "" && textDetail != null) {
            var totalText = textDetail.split(',');
            var totalKeys = keyDetail.split(',');
            for (lIndex = 0; lIndex < totalText.length; lIndex++) {
                $("div[id='divMulti" + controlName + "']").find("ul").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + totalText[lIndex] + "</span><span id='" + totalKeys[lIndex] + "' class='k-icon k-delete'></span></li>");

                if (lIndex == 0) {
                    $("div[id='divMulti" + controlName + "']").show();
                    $("div[id='divMulti" + controlName + "']").find("span[id^='FieldKeyValues" + controlName + "']").text(totalKeys[lIndex]);
                }
                else {
                    var lPreviousKey = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text();
                    lPreviousKey = lPreviousKey + "," + totalKeys[lIndex];
                    $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(lPreviousKey);
                }
                $("div[id='divMulti" + controlName + "']").find("span[id='" + totalKeys[lIndex] + "'].k-delete").click(function (e) {
                    //Added By Amit Yadav Delete Callback
                    var divId = "divMulti" + controlName;
                    var textboxid = "Text_" + controlName;
                    AutoCompleteDeleteCallBack(e, divId, textboxid);

                    $(this).parent().remove();

                    var arr = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().split(',').filter(function (n) { return n != '' });
                    var idx = arr.indexOf($(this)[0].id);
                    arr.splice(idx, 1);

                    $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(arr.join(','));
                    $("div[id='divMulti" + controlName + "']").closest("td").find("input:hidden[name^='" + controlName + "']").val(arr.join(','));
                    $("div[id='divMulti" + controlName + "']").find("input:hidden[name^='Multi_" + controlName + "']").val(arr.join(','));
                });
            }

            $("div[id='divMulti" + controlName + "']").find("input:hidden[name^='Multi_" + controlName + "']").val($("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text());
            $("#Text_" + controlName + "").val("");
        }
    }

    this.BindMultiValueRead = function (controlName, textDetail) {
        var totalText = textDetail.split(',');
        $("#tbl").find("span[id^='" + controlName + "']").text('');
        $("#tbl").find("span[id^='" + controlName + "']").append("<ul style='padding:3px 2px 2px 0px;margin-top:0px; width:400px;'></ul>");
        for (lIndex = 0; lIndex < totalText.length; lIndex++) {
            $("#tbl").find("span[id^='" + controlName + "']").find("ul").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + totalText[lIndex] + "</span>");
        }
    }

    this.EnableAutoComplete = function (cntrlId, enable, clearAllValue, bgcolor) {
        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoAutoComplete");
        if (kendoAutoCompleteWC != undefined) {
            $("input[type='text'][name='Text_" + cntrlId + "']");//.css({ "background-color": bgcolor });
            kendoAutoCompleteWC.enable(enable);
            if (clearAllValue) {
                $("#Text_" + cntrlId).val("");
                $("#" + cntrlId).val("");
            }
        }
    }
    this.CfiDate = function (cntrl) {
        var cfiDate = $("#" + cntrl).data("kendoDatePicker");
        return cfiDate != undefined ? (cfiDate.sqlDateValue() == null ? "" : $("#" + cntrl).attr("sqldatevalue")) : $("#" + cntrl).val();
    }
    this.ShowIndexView = function (divId, serviceUrl, jscriptUrl) {
        $.ajax({
            url: serviceUrl, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                //if (jscriptUrl != undefined && jscriptUrl != "") {
                //    ngen.loadjscssfile(jscriptUrl, "js");
                //}
                $("#" + divId).html(result);
            },
            error: function (jqXHR, textStatus) {
            }
        });
    }

    this.ShowIndexViewV2 = function (divId, serviceUrl, data) {
        $.ajax({
            url: serviceUrl, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: data }),
            success: function (result) {
                //if (jscriptUrl != undefined && jscriptUrl != "") {
                //    ngen.loadjscssfile(jscriptUrl, "js");
                //}
                $("#" + divId).html(result);
            },
            error: function (jqXHR, textStatus) {
            }
        });
    }
    this.ConvertCulture = function (obj, defaultCulture) {
        if (obj.value !== "" && obj.value != undefined && obj.value != null)
            kendo.convertCulture(obj.id, obj.value, defaultCulture);
    }
    this.ceil = function (value) {
        return kendo.ceil(value);
    }

    this.IsValidSpanNumeric = function (cntrlId) {
        var attr = $("span[id='" + cntrlId + "']").attr(attrType);

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            for (var i = 0; i < numbertype.length; i++) {
                if (numbertype[i].key == attr)
                    return numbertype[i].value;
            }
        }
        return -2;
    }
    this.GetCFGrid = function (cntrlId) {
        return $("#" + cntrlId).find('.k-grid').data("kendoGrid");
    }
    this.GetNestedCFGrid = function (cntrlId) {
        return $("#" + cntrlId + ".k-grid").data("kendoGrid");
    }
    this.IsValidSpanAlphabet = function (cntrlId) {
        var attr = $("span[id='" + cntrlId + "']").attr(attrType);

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            for (var i = 0; i < trnsformtype.length; i++) {
                if (trnsformtype[i].key == attr)
                    return trnsformtype[i].value;
            }
        }
        return "";
    }
    this.SetAutoCompleteOptions = function (cntrlId, newDataSourceName, clearAllValue) {
        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoAutoComplete");
        if (kendoAutoCompleteWC != undefined) {
            if (clearAllValue) {
                $("#Text_" + cntrlId).val("");
                $("#" + cntrlId).val("");
            }
            kendoAutoCompleteWC.setDataSource(newDataSourceName);

        }
    }
    this.AutoCompleteForFBLHandlingCharge = function (textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
        var keyId = textId;
        textId = "Text_" + textId;
        $("div[id^='" + textId + "-list']").remove();
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSourceForFBLHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
                dataSource: dataSource,
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: '<span>#: TemplateColumn #</span>',
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd
            });
        }
    }

    GetDataSourceForFBLHandlingCharge = function (textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
        var dataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: (newUrl == undefined || newUrl == "" ? fblurl : serviceurl + newUrl),
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: {
                        tableName: tableName,
                        keyColumn: keyColumn,
                        textColumn: textColumn,
                        templateColumn: templateColumn,
                        procedureName: procName,
                        awbSNo: awbSNo,
                        chargeTo: chargeTo,
                        cityCode: cityCode,
                        movementType: movementType,
                        hawbSNo: hawbSNo,
                        loginSNo: loginSNo,
                        chWt: chWt,
                        cityChangeFlag: cityChangeFlag
                    }
                },
                parameterMap: function (options) {
                    if (options.filter != undefined) {
                        var filter = _ExtraCondition(textId);
                        if (filter == undefined) {
                            filter = { logic: "AND", filters: [] };
                        }
                        filter.filters.push(options.filter);
                        options.filter = filter;
                    }
                    if (options.sort == undefined)
                        options.sort = null;
                    return JSON.stringify(options);
                }
            },
            schema: { data: "Data" }
        });
        return dataSource;
    }

    this.ModifyAutoCompleteDataSource = function (textId, tableName, keyColumn, textColumn, templateColumn, procName) {
        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + textId + "']").data("kendoAutoComplete");
        if (kendoAutoCompleteWC != undefined) {
            var dataSource = kendoAutoCompleteWC.dataSource;
            if (tableName != undefined && tableName != null && tableName != "") {
                dataSource.transport.options.read.data.tableName = tableName;
            }
            if (keyColumn != undefined && keyColumn != null && keyColumn != "") {
                dataSource.transport.options.read.data.keyColumn = keyColumn;
            }
            if (textColumn != undefined && textColumn != null && textColumn != "") {
                dataSource.transport.options.read.data.textColumn = textColumn;
            }
            if (templateColumn != undefined && templateColumn != null && templateColumn != "") {
                dataSource.transport.options.read.data.templateColumn = templateColumn;
            }
            if (procName != undefined && procName != null && procName != "") {
                dataSource.transport.options.read.data.procName = procName;
            }
            kendoAutoCompleteWC.setDataSource(dataSource);
            $("#Text_" + textId).val("");
            $("#" + textId).val("");
        }
    }
    this.ResetAutoComplete = function (cntrlId) {
        $("#Text_" + cntrlId).val("");
        $("#" + cntrlId).val("");
    }
    this.GetAutoCompleteDataSource = function (cntrlId) {
        return $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoAutoComplete");
    }//Added by KK
    this.GetAWBLockedEvent = function (UserSNo, AWBSNo, DailyFlightSNo, FlightNo, FlightDate, ULDNo, SubProcessSNo) {
        var message = "";
        $.ajax({
            // Changes by Vipin Kumar
            //url: SiteUrl + "Services/CommonService.svc/GetAWBLockedEvent?UserSNo=" + UserSNo + "&AWBSNo=" + AWBSNo + "&DailyFlightSNo=" + DailyFlightSNo + "&FlightNo=" + FlightNo + "&FlightDate=" + FlightDate + "&ULDNo=" + ULDNo, async: false, type: "get", dataType: "json", cache: false,
            //// data: JSON.stringify({ UserSNo: UserSNo, AWBSNo: AWBSNo, DailyFlightSNo: DailyFlightSNo, FlightNo: FlightNo, FlightDate: FlightDate, ULDNo: ULDNo }),
            //contentType: "application/json; charset=utf-8",
            url: SiteUrl + "Services/CommonService.svc/GetAWBLockedEvent",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ awbLockedEvent: { UserSNo: parseInt(UserSNo), AWBSNo: parseInt(AWBSNo), DailyFlightSNo: DailyFlightSNo, FlightNo: FlightNo, FlightDate: FlightDate, ULDNo: ULDNo, SubProcessSNo: SubProcessSNo } }),
            async: false,
            type: 'post',
            cache: false,
            // Ends
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                if (Data.Table0.length > 0) {
                    if (Data.Table0[0].Status1 == 1) {
                        //change by ashish 30aug19 for fetch alter message
                        //ShowMessage('warning', 'Warning - AWB Locked Information', "AWB No <b>" + Data.Table0[0].AWBNo + "</b> is currently in use for <b>" + Data.Table0[0].LockedProcessName + "</b> by <b>" + Data.Table0[0].UserName + "</b> since <b>" + Data.Table0[0].LockedOn + "</b>.", "bottom-right");
                        ShowMessage('warning', 'Warning - AWB Locked Information', Data.Table0[0].Message, "bottom-right");
                        message = "Fail";
                    }
                    else if (Data.Table0[0].Status1 == 2) {
                        //ShowMessage('warning', 'Warning - ULD Locked Information', "ULD No <b>" + Data.Table0[0].AWBNo + "</b> is currently in use for <b>" + Data.Table0[0].LockedProcessName + "</b> by <b>" + Data.Table0[0].UserName + "</b> since <b>" + Data.Table0[0].LockedOn + "</b>.", "bottom-right");
                        ShowMessage('warning', 'Warning - ULD Locked Information', Data.Table0[0].Message, "bottom-right");
                        message = "Fail";
                    }
                    else if (Data.Table0[0].Status1 == 3) {
                        //ShowMessage('warning', 'Warning - Flight Locked Information', "Flight No <b>" + Data.Table0[0].AWBNo + "</b> is currently in use for <b>" + Data.Table0[0].LockedProcessName + "</b> by <b>" + Data.Table0[0].UserName + "</b> since <b>" + Data.Table0[0].LockedOn + "</b>.", "bottom-right");
                        ShowMessage('warning', 'Warning - Flight Locked Information', Data.Table0[0].Message, "bottom-right");
                        message = "Fail";

                    }

                }
            },
            error: function (error) {

            }
        });
        return message;
    }//Added by KK
    this.SaveUpdateLockedProcess = function (AWBSNo, DailyFlightSNo, FlightNo, FlightDate, UpdatedBy, SubprocessSNo, SUbprocess, Event, ULDNo) {
        $.ajax({
            url: SiteUrl + "Services/CommonService.svc/SaveUpdateLockedProcess", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: AWBSNo, DailyFlightSNo: DailyFlightSNo, FlightNo: FlightNo, FlightDate: FlightDate, UpdatedBy: UpdatedBy, SubprocessSNo: SubprocessSNo, SUbprocess: SUbprocess, Event: Event, ULDNo: ULDNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
            }
        });
    }

}


AutoCompleteTemplate = function (textId) {

}


var cfi = new CargoFlashApplication();
function ChangeAllControlToLable(containerID) {
    $("input[type='text']", $("#" + containerID)).each(function () {
        $(this).replaceWith("<span style='" + $(this).attr("style") + "'>" + $(this).val() + "</span>");
    });
    $("textarea", $("#" + containerID)).each(function () {
        $(this).replaceWith("<span style='" + $(this).attr("style") + "'>" + $(this).val() + "</span>");
    });
    $("select", $("#" + containerID)).attr("disabled", true);

    $("input[type='radio']", $("#" + containerID)).each(function () {
        var id = $(this).attr("id");
        if ($(this).attr("checked") != true) {
            $(this).css("display", "none");
            $("label[for='" + id + "']").css("display", "none");
        }
        else {
            if ($(this).attr("disabled") == true) {
                $(this).css("display", "none");
            }
            if ($("label[for='" + id + "']").length == 0 && !$(this).hasClass("alreadyChecked")) {
                $(this).replaceWith("<img src='../images/CheckBoxChecked.gif' height='13' width='13'/>");
            }
            else {
                $("label[for='" + id + "']").replaceWith("<img src='../images/CheckBoxChecked.gif' height='13' width='13'/><b>" + $("label[for='" + id + "']").text() + "</b>");
            }
            $(this).addClass("alreadyChecked");
        }
    });
    $("select", $("#" + containerID)).each(function () {
        $(this).replaceWith("<span style='" + $(this).attr("style") + "'>" + ($(this).find("option").length == 0 ? "N/A" : (this.options[this.selectedIndex].value == "" ? "N/A" : this.options[this.selectedIndex].text)) + "</span>");
    });

}

function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var startControl = $(this).attr("startControl");
            var endControl = $(this).attr("endControl");
            var cntrlId = $(this).attr("id");
            if (startControl != undefined && startControl == cntrlId) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                start.max(end.value());
            }
            if (endControl != undefined && endControl == cntrlId) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                end.min(start.value());
            }
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var startControl = $(this).attr("startControl");
            var endControl = $(this).attr("endControl");
            var cntrlId = $(this).attr("id");
            if (startControl != undefined && startControl == cntrlId) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                start.max(end.value());
            }
            if (endControl != undefined && endControl == cntrlId) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                end.min(start.value());
            }
        });
    }
}

function startChange(that) {
    var start = $("#" + that.sender.options.startControlId).data("kendoDatePicker");
    var end = $("#" + that.sender.options.endControlId).data("kendoDatePicker");
    var startDate = start.value();

    if (startDate) {
        startDate = new Date(startDate);
        startDate.setDate(startDate.getDate() + 1);
        end.min(startDate);
    }
}

function endChange(that) {
    var start = $("#" + that.sender.options.startControlId).data("kendoDatePicker");
    var end = $("#" + that.sender.options.endControlId).data("kendoDatePicker");
    var endDate = end.value();

    if (endDate) {
        endDate = new Date(endDate);
        endDate.setDate(endDate.getDate() - 1);
        start.max(endDate);
    }
}

function preventPost(obj) {
    $("#" + obj).find("input[type='text']").keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    });
}
$(document).ready(function () {

    $(document).bind("contextmenu", function (e) {
        e.preventDefault();
    });
    $("#aspnetForm").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            $(this).css("text-align", "right");
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("#aspnetForm").find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            cfi.AlphabetTextBox(controlId, alphabetstyle);
        }
    });
    SetDateRangeValue(); cfi.ValidateSubmitSection();
    $("input[name='operation']").click(function () {
        dirtyForm.isDirty = false;//to track the changes
        _callBack();
    });


    $("input[name='operation']").click(function () {

        if (cfi.IsValidSubmitSection()) {

            var res = false;
            var Keycolumn = "";
            var Keycolumnsno = "";
            var Keycolumnapp = "";
            $.ajax({
                type: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: SiteUrl + "Services/CommonService.svc/CheckSession",
                success: function (response) {
                    if (response.CheckSessionResult == false) {
                        OpenLoginWindow();
                        res = false;
                    } else {
                        res = true;

                        var FormAction = getQueryStringValue("FormAction").toUpperCase();
                        if (document.getElementById('htmlkeycolumn'))
                            Keycolumn = document.getElementById('htmlkeycolumn').value;

                        if (document.getElementById('htmlkeysno'))
                            Keycolumnsno = document.getElementById('htmlkeysno').value;

                        var Keycolumnval = '';
                        if (FormAction == "NEW" || FormAction == "DELETE") {
                            Keycolumnapp = getQueryStringValue("Apps").toUpperCase();
                            var st = Keycolumn.split(",");
                            for (var i = 0; i < st.length; i++) {
                                if (Keycolumnval == "") {
                                    Keycolumnval = $("#" + st[i]).val();
                                }
                                else {
                                    Keycolumnval = Keycolumnval + ',' + $("#" + st[i]).val();
                                }
                            }
                            Keycolumn = Keycolumnapp;
                            if (getQueryStringValue("Apps").toUpperCase() != "ROUNDOFFCURRENCY") {
                                AuditLogSaveNewValue("tbl", true, "", Keycolumn || '', Keycolumnval || '', Keycolumnsno || '', FormAction, userContext.TerminalSNo, userContext.NewTerminalName);
                            }
                        }
                        else {
                            if (getQueryStringValue("Apps").toUpperCase() == "ROUNDOFFCURRENCY") {
                                Keycolumnval = $("#tblRoundOffCurrency_Currency_1").val();
                            }
                            else if (getQueryStringValue("Apps").toUpperCase() == "REVERSEPAYMENT") {
                                Keycolumn = "Amount";
                                Keycolumnval = $("#Amount").val();
                            }
                            else if (getQueryStringValue("Apps").toUpperCase() == "APPROVEPAYMENT") {
                                Keycolumn = "Amount";
                                Keycolumnval = $("#Amount").val();
                            }
                            else if (getQueryStringValue("Apps").toUpperCase() == "VERIFYPAYMENT") {
                                Keycolumn = "Amount";
                                Keycolumnval = $("#Amount").val();
                            }
                            else {
                                if (document.getElementById('htmlkeyvalue'))
                                    Keycolumnval = document.getElementById('htmlkeyvalue').value;
                                else
                                    Keycolumnval = $("#" + Keycolumn).val();
                                if (getQueryStringValue("Apps").toUpperCase() == "ULDSLACALENDAR") {
                                    Keycolumnval = $("#CalendarName").val();
                                }

                            }
                            if (getQueryStringValue("Apps").toUpperCase() != "ROUNDOFFCURRENCY") {
                                AuditLogSaveNewValue("tbl", true, "", Keycolumn || '', Keycolumnval || '', Keycolumnsno || '', FormAction, userContext.TerminalSNo, userContext.NewTerminalName);
                            }
                        }
                        //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                        //AuditLogSaveNewValue("tbl");
                        //}
                    }
                }, error: function () {
                    location.href = SiteUrl + 'Account/' + userContext.SysSetting.LoginPage + '?islogout=true';
                }
            });
            return res;
        }
        else {
            return false
        }
    });
    //check dirty fields 
    if (getQueryStringValue("FormAction").toUpperCase() != "INDEXVIEW") {
        dirtyForm.checkDirtyForm();
    }
    //check dirty fields
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
    $("input[type='text']:eq(0)").focus();

    // AddDocumentShortCuts();
    userContext = JSON.parse($("#hdnUserContext", parent.document).val());
    //ShowTickerOnPublish();
    CompareSession();
    //Added By Amit Yadav
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        setTimeout(function () {
            AuditLogBindOldValue("tbl");

        }, 1000);

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "DELETE") {

        setTimeout(function () {
            AuditLogBindOldValueForDeleteAction("tbl");

        }, 1000);

    }

    //else if(getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW")
    //{
    //    if( getQueryStringValue("Apps").toUpperCase() == "RESERVATIONBOOKING")
    //    {
    //        setTimeout(function () {
    //            AuditLogBindOldValue("tbl");

    //        }, 1000);
    //    }
    //}

    //Added By Amit Yadav
    StartTimers();
});


const SessionTimerchannel = new BroadcastChannel('SessionTimerchannel');
SessionTimerchannel.onmessage = function (e) {
    if (e.data == "Open")
        OpenLoginWindow();
    if (e.data == "Reset")
        ResetTimers();
    if (e.data == "Close")
        $("#divDialogSession").dialog("close");
};

//Added By Amit Yadav
var timeoutTimer = null;
$(document).on('keyup keydown keypress mousemove', function (evt) {
    SessionTimerchannel.postMessage('Reset');
    ResetTimers();
});
function StartTimers() {
    var timoutNow = (userContext != undefined && userContext.SysSetting != undefined && userContext.SysSetting.SessionTimeout != undefined) ? userContext.SysSetting.SessionTimeout : 900000;

    //if (userContext != undefined && userContext.SysSetting != undefined && userContext.SysSetting.SessionTimeout != undefined) {
    //    timoutNow = userContext.SysSetting.SessionTimeout || 900000;
    //}
    // var timoutNow = 5000;
    timeoutTimer = setTimeout("IdleTimeout()", timoutNow);

}
function ResetTimers() {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
    StartTimers();
}

function IdleTimeout() {
    SessionTimerchannel.postMessage('Open');
    OpenLoginWindow();
}
$(window).on("focus", function (e) {
    if ($("#divDialogSession").is(':visible') && $("#CaptchaCode").length > 0) {
        RefreshCaptcha();
        $("#CaptchaCode").val('');
    }
});

//$(window).on("blur", function (e) {
//    if (timeoutTimer != null) {
//        clearTimeout(timeoutTimer);
//        timeoutTimer = null;
//    }
//});

//Added By Amit Yadav
function AuditLogBindOldValue(id) {
    try {
        //Added By Shivali Thakur
        if (getQueryStringValue("Apps").toUpperCase() == "CREDITDEBITNOTE") {
            var rowcount = $('#tblInvoiceCharges tbody tr').length;
            for (var i = 1; i <= rowcount; i++) {
                $("#tblInvoiceCharges_InputAmount_" + i).attr("oldvalue", $("#tblInvoiceCharges_InputAmount_" + i).val())
                $("#tblInvoiceCharges_Remarks_" + i).attr("oldvalue", $("#tblInvoiceCharges_Remarks_" + i).val())
                $("#tblInvoiceCharges_ChargeName_" + i).attr("oldvalue", $("#tblInvoiceCharges_ChargeName_" + i).text())
            }
        }
        if (getQueryStringValue("Apps").toUpperCase() == "CREDITDEBITNOTEAPPROVAL") {
            var rowcount = $('#tblCNList tbody tr').length;
            //for (var i = 1; i <= rowcount; i++) {
            $("#tblCNList_ApprovedRemarks_1").attr("oldvalue", $("#tblCNList_ApprovedRemarks_1").val())
            $("#tblCNList_Action_1").attr("oldvalue", $("#tblCNList_Action_1 option:selected").text())

            //}
        }
        if (getQueryStringValue("Apps").toUpperCase() == "GROUPBOOKING") {
            $("#OriginFlightNo").attr("oldvalue", $("#OriginFlightNo").text())
            $("#FlightDate").attr("oldvalue", $("#FlightDate").val())
        }


        $("#" + id).find("input[type!='hidden'],textarea,select").each(function (i, e) {

            if (this.type == "radio") {
                var obj = $('input[name=' + $(this).attr("name") + ']:checked');
                if (id == "tblAdd") {
                    $(this).attr("oldvalue", "").attr("newvalue", "");
                }
                else {
                    if ($(obj[0]).attr("id").indexOf("tbl") == 0 && obj[0].nextSibling.nodeValue == null)
                        $(this).attr("oldvalue", $(obj[0].nextSibling).text()).attr("newvalue", "");
                    else
                        $(this).attr("oldvalue", obj[0].nextSibling.nodeValue.replace('\n', '').trim()).attr("newvalue", "");
                }
            }
            else if (this.type == "checkbox") {

                if ((getQueryStringValue("Apps").toUpperCase() == "MANAGETARIFF" && $(this).attr('id') == 'Days') || (getQueryStringValue("Apps").toUpperCase() == "RATE" && $(this).attr('id') == 'Days') || (getQueryStringValue("Apps").toUpperCase() == "EMBARGO")) {

                    //Added By Shivali Thakur 

                    if (getQueryStringValue("Apps").toUpperCase() == "EMBARGO" && $(this).attr('id') == 'Day2') {
                        var day = '';
                        $("[type='checkbox'][id^'Day']:checked").each(function () {
                            switch ($(this).val()) {
                                case '0':
                                    day = day + '/' + "All";
                                    break;
                                case '1':
                                    day = day + '/' + "Sun";
                                    break;
                                case '2':
                                    day = day + '/' + "Mon";
                                    break;
                                case '3':
                                    day = day + '/' + "Tue";
                                    break;
                                case '4':
                                    day = day + '/' + "Wed";
                                    break;
                                case '5':
                                    day = day + '/' + "Thu";
                                    break;
                                case '6':
                                    day = day + '/' + "Fri";
                                    break;
                                case '7':
                                    day = day + '/' + "Sat";
                            }
                        })
                        $(this).attr("oldvalue", day).attr("newvalue", "");
                    }
                    else {
                        var day = '';
                        $("[type='checkbox'][id='Days']:checked").each(function () {
                            switch ($(this).val()) {
                                case '0':
                                    day = day + '/' + "All";
                                    break;
                                case '1':
                                    day = day + '/' + "Sun";
                                    break;
                                case '2':
                                    day = day + '/' + "Mon";
                                    break;
                                case '3':
                                    day = day + '/' + "Tue";
                                    break;
                                case '4':
                                    day = day + '/' + "Wed";
                                    break;
                                case '5':
                                    day = day + '/' + "Thu";
                                    break;
                                case '6':
                                    day = day + '/' + "Fri";
                                    break;
                                case '7':
                                    day = day + '/' + "Sat";
                            }
                        })
                        $(this).attr("oldvalue", day).attr("newvalue", "");
                    }
                }
                else {
                    $(this).attr("oldvalue", $(this).is(":checked")).attr("newvalue", "");
                }
            }

            else if (e.nodeName == "SELECT") {
                $(this).attr("oldvalue", $(this).find("option:checked").text()).attr("newvalue", "");
            }
            else if ($(this).attr("controltype") != undefined && $(this).attr("controltype") == "autocomplete") {
                if ($(this).data("kendoAutoComplete") != undefined) {
                    if ($(this).data("kendoAutoComplete").options.separator == ",") {
                        var aa = [];
                        $("#divMulti" + $(this).attr("id").replace("Text_", '') + " ul li:visible span:not(.k-delete)").each(function (e, b) {
                            if ($(b).text() != "")
                                aa.push($(b).text())
                        });
                        $(this).attr("oldvalue", aa.join(','));
                    } else {
                        $(this).attr("oldvalue", $(this).val());
                    }
                }
            }


            //Start code Added Below Condition by AKASH on 2 Nov 2017

            else if ($(this).attr("controltype") != undefined && $(this).attr("controltype") == "default") {
                if ($(this).data("kendoAlphabetTextBox") != undefined) {
                    var aa = [];
                    $(this).attr("oldvalue", this.getAttribute('value') || this.value);
                }
            }
            //---------------------End Of Code Added By Akash




            //else if ($(e).attr("id").indexOf("ItineraryVolumeWeight") != -1) {
            //    debugger
            //    $(this).attr("oldvalue", $(this).val()).attr("newvalue", "");
            //}
            else if ($(e).attr("id") && $(e).attr("id").indexOf("_temp") == 0) {
            }
            else if (getQueryStringValue("Apps").toUpperCase() == "CLAIM" && $(this).attr("controltype") == undefined) {
                if ($("#AirlineDocName").text() == "") { $(this).attr("oldvalue", $("#DocName").text()).attr("newvalue", ""); }
                else {
                    $(this).attr("oldvalue", $("#AirlineDocName").text()).attr("newvalue", "");
                }

            }
            else {
                $(this).attr("oldvalue", $(this).val()).attr("newvalue", "");
            }
        });

        if (getQueryStringValue("Apps").toUpperCase() == "HANDLINGCHARGES") {

            $("#divareaTrans_Tariff_HandlingChargesTrans .WebFormTable").find("input[type!='hidden'],textarea,select").each(function (i, e) {

                if (this.type == "radio") {
                    var obj = $('input[name=' + $(this).attr("name") + ']:checked');

                    if ($(obj[0]).attr("id").indexOf("tbl") == 0 && obj[0].nextSibling.nodeValue == null)
                        $(this).attr("oldvalue", $(obj[0].nextSibling).text()).attr("newvalue", "");
                    else
                        $(this).attr("oldvalue", obj[0].nextSibling.nodeValue.replace('\n', '').trim()).attr("newvalue", "");

                }
                else {
                    $(this).attr("oldvalue", $(this).val()).attr("newvalue", "");
                }
            });

        }
        if (getQueryStringValue("Apps").toUpperCase() == "ULDSTACK") {
            $("#txtScaleWeight").attr("oldvalue", $("#txtScaleWeight").val())
            $("#Text_txtAirline").attr("oldvalue", $("#Text_txtAirline").val())
            $("#txtFlightDate").attr("oldvalue", $("#txtFlightDate").val())
            $("#Text_txtFlightNo").attr("oldvalue", $("#Text_txtFlightNo").val())
            $("#Text_txtOffPoint").attr("oldvalue", $("#Text_txtOffPoint").val())
        }
    } catch (e) {

    }
}
//Added By Amit Yadav
function AuditLogSaveNewValue(id, isAjax, subprocess, KeyColumn, KeyValue, keySNo, FormAction, TerminalSNo, TerminalName) {

    try {

        isAjax = isAjax || false;
        subprocess = subprocess || '';
        //Added By Shivali Thakur
        var arrVal = [];
        var name = "";
        var clNameval = "";
        var clName = "";
        if (getQueryStringValue("Apps").toUpperCase() == "IRREGULARITY") {
            KeyValue = $("#ReferenceCode").val();
        }
        if (getQueryStringValue("Apps").toUpperCase() == "CREDITDEBITNOTEAPPROVAL") {
            var rowcount = $('#tblCNList tbody tr').length;

            $("#tblCNList_ApprovedRemarks_1").attr("newvalue", $("#tblCNList_ApprovedRemarks_1").val())
            $("#tblCNList_Action_1").attr("newvalue", $("#tblCNList_Action_1 option:selected").text())
            var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: 'Action', OldValue: $("#tblCNList_Action_1").attr("oldvalue"), NewValue: $("#tblCNList_Action_1").attr("newvalue") };
            var ab = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: 'Remarks', OldValue: $("#tblCNList_ApprovedRemarks_1").attr("oldvalue"), NewValue: $("#tblCNList_ApprovedRemarks_1").attr("newvalue") };
            arrVal.push(a);
            arrVal.push(ab);
            SaveAppendGridAuditLog(KeyColumn, KeyValue, keySNo, JSON.stringify(arrVal), FormAction, TerminalSNo, TerminalName);
        }
        else if (getQueryStringValue("Apps").toUpperCase() == "CREDITDEBITNOTE") {
            var rowcount = $('#tblInvoiceCharges tbody tr').length;
            if (keySNo == "1") {
                var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: 'Amount', OldValue: 'Approved', NewValue: 'Refunded' };
                arrVal.push(a);
            }
            else {
                for (var i = 1; i <= rowcount; i++) {

                    $("#tblInvoiceCharges_InputAmount_" + i).attr("newvalue", $("#tblInvoiceCharges_InputAmount_" + i).val())
                    $("#tblInvoiceCharges_Remarks_" + i).attr("newvalue", $("#tblInvoiceCharges_Remarks_" + i).val())
                    $("#tblInvoiceCharges_ChargeName_" + i).attr("newvalue", $("#tblInvoiceCharges_ChargeName_" + i).text())
                    var newval = $("#tblInvoiceCharges_ChargeName_" + i).attr("newvalue") + "/" + $("#tblInvoiceCharges_InputAmount_" + i).attr("newvalue") + "/" + $("#tblInvoiceCharges_Remarks_" + i).attr("newvalue");
                    var oldval = $("#tblInvoiceCharges_ChargeName_" + i).attr("oldvalue") + "/" + $("#tblInvoiceCharges_InputAmount_" + i).attr("oldvalue") + "/" + $("#tblInvoiceCharges_Remarks_" + i).attr("oldvalue");

                    var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: 'Credit-Note Slab' + "-" + i, OldValue: oldval, NewValue: newval };
                    arrVal.push(a);

                }
            }
            SaveAppendGridAuditLog(KeyColumn, KeyValue, keySNo, JSON.stringify(arrVal), FormAction, TerminalSNo, TerminalName);

        }

        else {
            ////$("#hdnAuditLog").val('');
            //$("#" + id).find("input[type!='hidden'],textarea,select").each(function (i, e) {

            //    if (this.type == "radio") {
            //        var obj = $('input[name=' + $(this).attr("name") + ']:checked');
            //        if ($(obj[0]).attr("id") != undefined) {
            //            if ($(obj[0]).attr("id").indexOf("tbl") == 0 && obj[0].nextSibling.nodeValue == null)
            //                $(this).attr("newvalue", $(obj[0].nextSibling).text());
            //            else
            //                $(this).attr("newvalue", obj[0].nextSibling.nodeValue.replace('\n', '').trim());
            //        }
            //        else
            //            $(this).attr("newvalue", obj[0].nextSibling.nodeValue.replace('\n', '').trim());
            //    }
            //    else if (this.type == "checkbox") {
            //        $(this).attr("newvalue", $(this).is(":checked"));
            //    }
            //    else if (e.nodeName == "SELECT") {
            //        $(this).attr("newvalue", $(this).find("option:checked").text());
            //    } else if ($(this).attr("controltype") != undefined && $(this).attr("controltype") == "autocomplete") {
            //        if ($(this).data("kendoAutoComplete") != undefined) {
            //            if ($(this).data("kendoAutoComplete").options.separator == ",") {
            //                var aa = [];
            //                $("#divMulti" + $(this).attr("id").replace("Text_", '') + " ul li:visible span:not(.k-delete)").each(function (e, b) {
            //                    if ($(b).text() != "")
            //                        aa.push($(b).text())
            //                });
            //                $(this).attr("newvalue", aa.join(','));
            //            } else {
            //                $(this).attr("newvalue", $(this).val());
            //            }
            //        }
            //    }
            //        //else if ($(e).attr("id").indexOf("ItineraryVolumeWeight") != -1) {
            //        //    debugger
            //        //    $(this).attr("newvalue", $(this).val());
            //        //}
            //    else if ($(e).attr("id") || 0 && $(e).attr("id").indexOf("_temp") || 0 == 0) { }
            //    else {
            //        $(this).attr("newvalue", $(this).val());
            //    }
            //});



            //-------------------Start Work by Akash For appendgrid last row bing old value and new value on 10 Nov 2017----------    

            var ISFormAction = getQueryStringValue("FormAction").toUpperCase();
            if (ISFormAction == "DELETE") {
                var Deletedoldval = '';
                var DeletedNewValue = '';

                var clName = "";
                var keyValue = "";
                var Keycolumn = "";
                var Keycolumnapp = "";
                var arrVal = [];

                clName = KeyValue;
                if (document.getElementById('htmlkeycolumn'))
                    DeletedKeycolumn = document.getElementById('htmlkeycolumn').value;

                if (document.getElementById('htmlkeysno'))
                    DeletedKeycolumnsno = document.getElementById('htmlkeysno').value;

                var Keycolumnval = '';
                if (ISFormAction == "NEW" || ISFormAction == "DELETE" || ISFormAction == "EDIT") {
                    Keycolumnapp = getQueryStringValue("Apps").toUpperCase();
                    var st = DeletedKeycolumn.split(",");
                    for (var i = 0; i < st.length; i++) {
                        if (Keycolumnval == "") {
                            Keycolumnval = $("#" + st[i]).val();
                        }
                        else {
                            Keycolumnval = Keycolumnval + ',' + $("#" + st[i]).val();
                        }
                    }
                }
                DeletedColumnName = Keycolumnval;

                $("table").find("span").each(function (i, e) {
                    if (this.tagName == "SPAN") {
                        if (Deletedoldval == '') {
                            if ($(this).attr("newvalue") != undefined) {
                                DeletedNewValue = DeletedNewValue + '/' + ($(this).attr("newvalue") || $(this).attr("oldvalue"));
                            }
                            Deletedoldval = $(this).attr("oldvalue") || "";
                        }
                    }

                });
                subprocess = "";
                if (Deletedoldval == "" && DeletedNewValue != "") {

                    var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: DeletedColumnName, OldValue: DeletedNewValue, NewValue: Deletedoldval };
                    arrVal.push(a);
                }
                var auditLog = {
                    KeyColumn: DeletedKeycolumn, KeyValue: DeletedColumnName, keySNo: DeletedKeycolumnsno, arrVal: JSON.stringify(arrVal), FormAction: ISFormAction, TerminalSNo: userContext.TerminalSNo, TerminalName: userContext.NewTerminalName
                }
                sessionStorage.setItem("auditlog", JSON.stringify(auditLog));
                SaveAppendGridAuditLog(DeletedKeycolumn, DeletedColumnName, DeletedKeycolumnsno, JSON.stringify(arrVal), ISFormAction, userContext.TerminalSNo, userContext.NewTerminalName);
            }



            //-------------------End Work by Akash For appendgrid last row bing old value and new value on 10 Nov 2017----------



            $("table").find("input[type!='hidden']:not(input[id^=_temp]),textarea,select").each(function (i, e) {

                if (this.type == "radio") {

                    var obj = $('input[name=' + $(this).attr("name") + ']:checked');
                    if ($(obj[0]).attr("id") != undefined) {
                        if (id == "tblAdd") {
                            $(this).attr("newvalue", "");
                        }
                        else {
                            if ($(obj[0]).attr("id").indexOf("tbl") == 0 && obj[0].nextSibling.nodeValue == null)
                                $(this).attr("newvalue", $(obj[0].nextSibling).text());
                            else
                                $(this).attr("newvalue", obj[0].nextSibling.nodeValue.replace('\n', '').trim());
                        }
                    }
                    else
                        $(this).attr("newvalue", "");
                    // $(this).attr("newvalue", obj[0].nextSibling.nodeValue.replace('\n', '').trim());
                }
                else if (this.type == "checkbox") {
                    //Added By Shivali Thakur MANAGETARIFF
                    if ((getQueryStringValue("Apps").toUpperCase() == "MANAGETARIFF" && $(this).attr('id') == 'Days') || (getQueryStringValue("Apps").toUpperCase() == "RATE" && $(this).attr('id') == 'Days') || (getQueryStringValue("Apps").toUpperCase() == "EMBARGO")) {

                        if (getQueryStringValue("Apps").toUpperCase() == "EMBARGO" && $(this).attr('id') == 'Day2') {
                            var day = '';
                            //($("#DaysOfOps").val().split(',')).each(function () {
                            $("[type='checkbox'][id^'Day']:checked").each(function () {
                                switch ($(this).val()) {
                                    case '0':
                                        day = day + '/' + "All";
                                        break;
                                    case '1':
                                        day = day + '/' + "Sun";
                                        break;
                                    case '2':
                                        day = day + '/' + "Mon";
                                        break;
                                    case '3':
                                        day = day + '/' + "Tue";
                                        break;
                                    case '4':
                                        day = day + '/' + "Wed";
                                        break;
                                    case '5':
                                        day = day + '/' + "Thu";
                                        break;
                                    case '6':
                                        day = day + '/' + "Fri";
                                        break;
                                    case '7':
                                        day = day + '/' + "Sat";
                                }
                            })
                            $(this).attr("newvalue", day);
                        }
                        else {


                            var day = ''
                            $("[type='checkbox'][id='Days']:checked").each(function () {
                                switch ($(this).val()) {
                                    case '0':
                                        day = day + '/' + "All";
                                        break;
                                    case '1':
                                        day = day + '/' + "Sun";
                                        break;
                                    case '2':
                                        day = day + '/' + "Mon";
                                        break;
                                    case '3':
                                        day = day + '/' + "Tue";
                                        break;
                                    case '4':
                                        day = day + '/' + "Wed";
                                        break;
                                    case '5':
                                        day = day + '/' + "Thu";
                                        break;
                                    case '6':
                                        day = day + '/' + "Fri";
                                        break;
                                    case '7':
                                        day = day + '/' + "Sat";
                                }
                            })
                            $(this).attr("newvalue", day);
                        }
                    }
                    else {
                        // $(this).Text
                        $(this).attr("newvalue", $(this).is(":checked"));
                    }
                }
                else if (e.nodeName == "SELECT") {
                    $(this).attr("newvalue", $(this).find("option:checked").text());
                }
                else if ($(this).attr("controltype") != undefined && $(this).attr("controltype") == "autocomplete") {
                    if ($(this).data("kendoAutoComplete") != undefined) {
                        if ($(this).data("kendoAutoComplete").options.separator == ",") {
                            var aa = [];
                            $("#divMulti" + $(this).attr("id").replace("Text_", '') + " ul li:visible span:not(.k-delete)").each(function (e, b) {
                                if ($(b).text() != "")
                                    aa.push($(b).text())
                            });
                            $(this).attr("newvalue", aa.join(','));
                        } else {
                            $(this).attr("newvalue", $(this).val());
                        }
                    }
                }



                else if ($(this).attr("controltype") != undefined && $(this).attr("controltype") == "default") {
                    if ($(this).data("kendoAlphabetTextBox") != undefined) {
                        if (getQueryStringValue("Apps").toUpperCase() == "CLAIM" || getQueryStringValue("Apps").toUpperCase() == "RESERVATIONBOOKING") {
                            $(this).attr("newvalue", $(this).val());
                        }
                        else {
                            if (getQueryStringValue("Apps").toUpperCase() == "AIRMAIL") {
                                $(this).attr("newvalue", $(this).val());
                            }
                            else
                            {
                                var aa = [];
                                $(this).attr("newvalue", $("#divemailAdd ul li span").text());
                            }
                         
                        }
                    }
                }

                //else if ($(e).attr("id").indexOf("ItineraryVolumeWeight") != -1) {
                //    debugger
                //    $(this).attr("newvalue", $(this).val());
                //}
                else if ($(e).attr("id") != undefined && $(e).attr("id").indexOf("_temp") == 0) {
                    $(this).attr("newvalue", $(this).val());
                }
                else {
                    $(this).attr("newvalue", $(this).val());
                }
            });
            if (getQueryStringValue("Apps").toUpperCase() == "HANDLINGCHARGES") {

                $("#divareaTrans_Tariff_HandlingChargesTrans .WebFormTable").find("input[type!='hidden'],textarea,select").each(function (i, e) {

                    if (this.type == "radio") {

                        var obj = $('input[name=' + $(this).attr("name") + ']:checked');
                        if ($(obj[0]).attr("id") != undefined) {
                            if (id == "tblAdd") {
                                $(this).attr("newvalue", "");
                            }
                            else {
                                if ($(obj[0]).attr("id").indexOf("tbl") == 0 && obj[0].nextSibling.nodeValue == null)
                                    $(this).attr("newvalue", $(obj[0].nextSibling).text());
                                else
                                    $(this).attr("newvalue", obj[0].nextSibling.nodeValue.replace('\n', '').trim());
                            }
                        }
                        else
                            $(this).attr("newvalue", "");
                    }
                    else {
                        $(this).attr("newvalue", $(this).val());
                    }



                });

                $("#divareaTrans_Tariff_HandlingChargesTrans").find('.WebFormTable tbody tr').each(function (ii, row) {
                    var oldval = '';
                    var newval = '';
                    var ap = false;
                    var rid = '';
                    var clName = '';
                    clName = 'Charge Management' + '-' + ii;
                    $(row).find("[newvalue]").each(function (iii, e) {



                        if (ap == false) {
                            var attrold = '';
                            var attrnew = '';
                            $(row).find("input").each(function (i, tr) {
                                ap = true;
                                attrold = this.name;
                                if ($(tr).attr("oldvalue") != undefined && attrold != attrnew) {

                                    if (oldval == '') {
                                        if ($(tr).attr("newvalue") != undefined)
                                            newval = newval + '/' + ($(tr).attr("newvalue") || $(tr).attr("oldvalue"));
                                        else
                                            newval = newval + '/' + $(tr).attr("oldvalue");


                                        oldval = $(tr).attr("oldvalue");
                                    }
                                    else {
                                        oldval = oldval + '/' + $(tr).attr("oldvalue");

                                        if ($(tr).attr("newvalue") != undefined)

                                            newval = newval + '/' + ($(tr).attr("newvalue") || $(tr).attr("oldvalue"));
                                        else
                                            newval = newval + '/' + $(tr).attr("oldvalue");
                                    }
                                    attrnew = this.name;

                                }

                            });
                        }
                    });
                    if (oldval != "" && newval != "") {

                        var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: clName, OldValue: oldval, NewValue: newval };
                        arrVal.push(a);
                    }
                    else if (oldval == "" && newval != "") {
                        var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: clName, OldValue: oldval, NewValue: newval };
                        arrVal.push(a);
                    }
                });
            }
            if (subprocess == "UPDATERESERVATIONBOOKING" || subprocess == "EXECUTERESERVATIONBOOKING" || subprocess == "RESERVATIONBOOKING" || subprocess == "RESERVATION") {
                var oldrefcode = sessionStorage.getItem("OldRateRefCode");
                var OldFlightNo = sessionStorage.getItem("OldFlightNo");
                var NewFlightNo = sessionStorage.getItem("NewFlightNo");
                var RateRefrenceNoforAuditLog = "";

                $.ajax({
                    type: "GET",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: SiteUrl + "Services/Common/CommonService.svc/GetRateReferenceCode?Keysno=" + keySNo,
                    success: function (result) {
                        if (OldFlightNo != "" && NewFlightNo != "") {
                            if (subprocess == "UPDATERESERVATIONBOOKING" || subprocess == "EXECUTERESERVATIONBOOKING") {
                                var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Flight No", OldValue: OldFlightNo, NewValue: NewFlightNo };
                                arrVal.push(a);

                                var C = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Rate Reference Code", OldValue: oldrefcode, NewValue: result };
                                arrVal.push(C);
                            }
                            else {
                                var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Rate Reference Code", OldValue: oldrefcode, NewValue: result };
                                arrVal.push(a);
                            }
                        }
                        else {
                            var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Rate Reference Code", OldValue: oldrefcode, NewValue: result };
                            arrVal.push(a);
                        }
                    }
                });
            }

            $("#" + id + ":not(table[class*=appendGrid])").each(function (ii, ee) {
                $(ee).find("[newvalue]").each(function (i, e) {

                    if ($(e).attr("newvalue") != "" && $(e).attr("newvalue") != $(e).attr("oldvalue")) {
                        if (($('#' + $(e).attr('id')).closest('table').attr('class') || '').toString().indexOf('appendGrid') < 0) {
                            //Added by Shivali Thakur
                            if (subprocess == "UPDATERESERVATIONBOOKING" || subprocess == "EXECUTERESERVATIONBOOKING" || subprocess == "RESERVATIONBOOKING") {
                                if ($(e).attr("id") == "Text_CONSIGNEE_AccountNo") {
                                    clName = $("#Text_CONSIGNEE_AccountNo").attr("name").split("_")[2];
                                }
                                else if ($(e).attr("id") == "Text_SHIPPER_AccountNo") {
                                    clName = $("#Text_SHIPPER_AccountNo").attr("name").split("_")[2];
                                }
                                else {
                                    clName = $('#' + $(e).attr('id')).closest('td').find('label').text().trim() || '';
                                    clName = clName.replace(":", '');
                                }
                            }
                            else if (subprocess == "DIMENSION" || subprocess == "LOCATION") {
                                clName = ($(e).attr("colname") || $(e).attr("name") || $(e).attr("id")) || "";
                            }
                            else if ($(e).attr("oldvalue") == "Include" || $(e).attr("oldvalue") == "Exclude") {
                                clName = $('#' + $(e).attr('id')).closest('td').prev('td').prev('td').text();
                                //clName = ($(e).attr("colname") || $(e).attr("name") || $(e).attr("id")) || "";
                            }
                            else {
                                clName = $('#' + $(e).attr('id')).closest('td').prev('td').text().replace('*', '').trim() || $('#' + $(e).attr('id')).closest('td').prev('td').find('span').text().trim() || $('#' + $(e).attr('id')).closest('td').prev('td').text().trim() || "";
                                if (clName == "") {
                                    clName = ($(e).attr("colname") || $(e).attr("name") || $(e).attr("id")) || "";
                                }
                                if (getQueryStringValue("Apps").toUpperCase() == "ULDINCOMPATIBILITY") {
                                    clName = ($(e).attr("colname"));
                                }
                                if (getQueryStringValue("Apps").toUpperCase() == "CLAIM") {
                                    clName = ($(e).attr("colname") || $(e).attr("name") || $(e).attr("id")) || "";
                                }



                            }
                            //if (this.type == "radio") {
                            //    if ($(e).attr("name") == "IsActive" || $(e).attr("id") == "IsActive") {
                            //        clName = "Active";
                            //    }
                            //    else {
                            //        clName = ($(e).attr("colname") || $(e).attr("name") || $(e).attr("id")) || "";
                            //    }
                            //}
                            //else {

                            // clName = ($(e).attr("colname") || $(e).attr("name") || $(e).attr("id")) || "";
                            //}
                            if (name != $(e).attr("name") && clName) {
                                if (clName.indexOf("Text_") == 0 || clName.indexOf("tbl") == 0)
                                    clName = clName.replace("Text_", '').replace("tbl", '');


                                //var abc = $('#'+clName).closest('td').index()+1;
                                // clName = $("thead td").eq(abc).text();
                                var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: clName, OldValue: $(e).attr("oldvalue"), NewValue: $(e).attr("newvalue") };
                                arrVal.push(a);
                                //if (this.type == "radio") {
                                //    if ($(e).attr("name") == "IsActive" || $(e).attr("id") == "IsActive") {
                                //        name = "Active";
                                //    }

                                //}
                                //else {
                                name = ($(e).attr("name") || $(e).attr("id"));
                                // }

                            }
                        }


                    }
                });
            });

            if (getQueryStringValue("Apps").toUpperCase() == "SCHEDULE") {
                var ap = false;
                $("table[class*=appendGrid]").find("tr").each(function (ii, row) {

                    var oldval = '';
                    var newval = '';

                    var rid = '';



                    $(row).find("[newvalue]").each(function (iii, e) {

                        rid = $(row).closest('table tr').index();
                        clName = $(row).closest('table').find('thead tr:first').text() + '-' + (rid + 1);

                        if ($(e).attr("newvalue") != "" && $(e).attr("newvalue") != $(e).attr("oldvalue")) {

                            if (ap == false) {
                                var attrold = '';
                                var attrnew = '';
                                $(row).find("input").each(function (i, tr) {
                                    ap = true;

                                    attrold = this.name;
                                    if ($(tr).attr("oldvalue") != undefined && attrold != attrnew) {

                                        if (oldval == '') {
                                            if ($(tr).attr("newvalue") != undefined)
                                                //newval = $(tr).attr("newvalue") || $(tr).attr("oldvalue"); --- Commented by Akash for Bind All value in Appendgrid on 8 Nov 2017
                                                newval = newval + '/' + ($(tr).attr("newvalue") || $(tr).attr("oldvalue"));
                                            //-- Added by Akash for Bind All value in Appendgrid on 8 Nov 2017
                                            else
                                                //newval = $(tr).attr("oldvalue"); --- Commented by Akash for Bind Al value in Appendgrid on 8 Nov 2017
                                                newval = newval + '/' + $(tr).attr("oldvalue");
                                            //-- Added by Akash for Bind Al value in Appendgrid on 8 Nov 2017


                                            oldval = $(tr).attr("oldvalue");
                                        }
                                        else {
                                            oldval = oldval + '/' + $(tr).attr("oldvalue");

                                            if ($(tr).attr("newvalue") != undefined)
                                                // if (getQueryStringValue("Apps").toUpperCase() == "ROUNDOFFCURRENCY" && )
                                                newval = newval + '/' + ($(tr).attr("newvalue") || $(tr).attr("oldvalue"));
                                            else
                                                newval = newval + '/' + $(tr).attr("oldvalue");
                                        }
                                        attrnew = this.name;

                                    }

                                });
                            }
                        }

                    });
                    if (id == "tblConsumables") {
                        var item = sessionStorage.getItem("uldnumber");
                        KeyColumn = "ULDNUMBER";
                        KeyValue = item;
                    }

                    if (oldval != "" && newval != "") {

                        var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: clName, OldValue: oldval, NewValue: newval };
                        arrVal.push(a);
                    }
                    else if (oldval == "" && newval != "") {

                        var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: clName, OldValue: oldval, NewValue: newval };
                        arrVal.push(a);
                    }
                });
            }
            else {
                $("table[class*=appendGrid]").find("tr").each(function (ii, row) {

                    var oldval = '';
                    var newval = '';
                    var ap = false;
                    var rid = '';


                    $(row).find("[newvalue]").each(function (iii, e) {
                        //Added by Shivali Thakur to show header and row id of append grid on 18 dec 2017
                        rid = $(row).closest('table tr').index();
                        clName = $(row).closest('table').find('thead tr:first').text() + '-' + (rid + 1);
                        //Edit by Manish and to be changes by KK.
                        if ($(e).attr("newvalue") != "" && $(e).attr("newvalue") != $(e).attr("oldvalue") && ($('#' + $(e).attr('id')).closest('table').attr('class') || '').toString().indexOf('appendGrid') >= 0) {




                            if (ap == false) {
                                var attrold = '';
                                var attrnew = '';
                                $(row).find("input").each(function (i, tr) {
                                    ap = true;
                                    attrold = this.name;
                                    if ($(tr).attr("oldvalue") != undefined && attrold != attrnew) {

                                        if (oldval == '') {
                                            if ($(tr).attr("newvalue") != undefined)
                                                //newval = $(tr).attr("newvalue") || $(tr).attr("oldvalue"); --- Commented by Akash for Bind All value in Appendgrid on 8 Nov 2017
                                                newval = newval + '/' + ($(tr).attr("newvalue") || $(tr).attr("oldvalue"));
                                            //-- Added by Akash for Bind All value in Appendgrid on 8 Nov 2017
                                            else
                                                //newval = $(tr).attr("oldvalue"); --- Commented by Akash for Bind Al value in Appendgrid on 8 Nov 2017
                                                newval = newval + '/' + $(tr).attr("oldvalue");
                                            //-- Added by Akash for Bind Al value in Appendgrid on 8 Nov 2017


                                            oldval = $(tr).attr("oldvalue");
                                        }
                                        else {
                                            oldval = oldval + '/' + $(tr).attr("oldvalue");

                                            if ($(tr).attr("newvalue") != undefined)
                                                // if (getQueryStringValue("Apps").toUpperCase() == "ROUNDOFFCURRENCY" && )
                                                newval = newval + '/' + ($(tr).attr("newvalue") || $(tr).attr("oldvalue"));
                                            else
                                                newval = newval + '/' + $(tr).attr("oldvalue");
                                        }
                                        attrnew = this.name;

                                    }

                                });
                            }
                        }
                    });
                    if (id == "tblConsumables") {
                        var item = sessionStorage.getItem("uldnumber");
                        KeyColumn = "ULDNUMBER";
                        KeyValue = item;
                    }

                    if (oldval != "" && newval != "") {

                        var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: clName, OldValue: oldval, NewValue: newval };
                        arrVal.push(a);
                    }
                    else if (oldval == "" && newval != "") {

                        var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: clName, OldValue: oldval, NewValue: newval };
                        arrVal.push(a);
                    }
                });
            }
            if (getQueryStringValue("Apps").toUpperCase() == "ULDSTACK") {
                keySNo = $("#hdnUldStackSNo").val();
                $("#txtScaleWeight").attr("newvalue", $("#txtScaleWeight").val())
                $("#Text_txtAirline").attr("newvalue", $("#Text_txtAirline").val())
                $("#txtFlightDate").attr("newvalue", $("#txtFlightDate").val())
                $("#Text_txtFlightNo").attr("newvalue", $("#Text_txtFlightNo").val())
                $("#Text_txtOffPoint").attr("newvalue", $("#Text_txtOffPoint").val())

                if ($("#txtScaleWeight").attr("oldvalue") != $("#txtScaleWeight").attr("newvalue")) {
                    var ac = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Scale Weight", OldValue: $("#txtScaleWeight").attr("oldvalue"), NewValue: $("#txtScaleWeight").attr("newvalue") };
                    arrVal.push(ac);
                }
                if ($("#Text_txtAirline").attr("oldvalue") != $("#Text_txtAirline").attr("newvalue")) {
                    var ad = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Airline", OldValue: $("#Text_txtAirline").attr("oldvalue"), NewValue: $("#Text_txtAirline").attr("newvalue") };
                    arrVal.push(ad);
                }
                if ($("#txtFlightDate").attr("oldvalue") != $("#txtFlightDate").attr("newvalue")) {
                    var ad = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Flight Date", OldValue: $("#txtFlightDate").attr("oldvalue"), NewValue: $("#txtFlightDate").attr("newvalue") };
                    arrVal.push(ad);
                }
                if ($("#Text_txtFlightNo").attr("oldvalue") != $("#Text_txtFlightNo").attr("newvalue")) {
                    var af = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Flight No.", OldValue: $("#Text_txtFlightNo").attr("oldvalue"), NewValue: $("#Text_txtFlightNo").attr("newvalue") };
                    arrVal.push(af);
                }
                if ($("#Text_txtOffPoint").attr("oldvalue") != $("#Text_txtOffPoint").attr("newvalue")) {
                    var ag = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Off. Point", OldValue: $("#Text_txtOffPoint").attr("oldvalue"), NewValue: $("#Text_txtOffPoint").attr("newvalue") };
                    arrVal.push(ag);
                }
            }

            if (subprocess == "CLAIMACTION") {
                if ($("#InsauranceCompany").val() != "") {
                    var aj = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Insurance Company", OldValue: "", NewValue: $("#InsauranceCompany").val() };
                    arrVal.push(aj);
                }
                if ($("#SubrogationValue").val() != "0") {
                    var ak = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Subrogation Value", OldValue: "", NewValue: $("#SubrogationValue").val() };
                    arrVal.push(ak);
                }
                if ($("#InsauranceAmount").val() != "0") {
                    var al = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Insurance Value", OldValue: "", NewValue: $("#InsauranceAmount").val() };
                    arrVal.push(al);
                }
                if ($("#Maxliability").val() != "") {
                    var am = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Maximum Liability", OldValue: "", NewValue: $("#Maxliability").val() };
                    arrVal.push(am);
                }
                if ($("#Rate").val() != "") {
                    var ap = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "SDR Rate", OldValue: "", NewValue: $("#Rate").val() };
                    arrVal.push(ap);
                }
            }

            //Added By Shivali Thakur
            if (id == 'tblDimensionTab') {
                keySNo = $('#hdnBookingSNo').val();
            }
            var auditLog = {
                KeyColumn: KeyColumn, KeyValue: KeyValue, keySNo: keySNo, arrVal: JSON.stringify(arrVal), FormAction: FormAction, TerminalSNo: TerminalSNo, TerminalName: TerminalName
            }
            sessionStorage.setItem("auditlog", JSON.stringify(auditLog));
            if (id == "tblAdd") {
                SaveAppendGridAuditLog(KeyColumn, KeyValue, keySNo, JSON.stringify(arrVal), FormAction, TerminalSNo, TerminalName);
            }
            else {
                SaveAppendGridAuditLog(KeyColumn, KeyValue, keySNo, JSON.stringify(arrVal), FormAction, TerminalSNo, TerminalName);
            }
        }
    } catch (e) {

    }
}
//Added By Amit Yadav
function SaveAppendGridAuditLog(KeyColumn, KeyValue, keySNo, jsonData, FormAction, TerminalSNo, TerminalName) {
    try {
        if (getQueryStringValue("Apps").toUpperCase() == "PROCESSDEPENDENCY") {
            jsonData = jsonData.replace(new RegExp("/", "g"), "");
        }

        //if ($("#hdnAuditLog").length > 0 && $("#hdnAuditLog").val() != "") {
        if (jsonData != undefined && jsonData != null && jsonData.length > 0) {
            KeyColumn = KeyColumn || "A~A";
            KeyValue = KeyValue || "A~A";
            keySNo = keySNo || "0"
            $.ajax({
                type: "POST",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: SiteUrl + "Services/Common/CommonService.svc/SaveAppendGridAuditLog?ModuleName=" + getQueryStringValue("Module").toUpperCase() + "&AppsName=" + getQueryStringValue("Apps").toUpperCase() + "&KeyColumn=" + KeyColumn + "&KeyValue=" + KeyValue + "&KeySNo=" + keySNo + "&FormAction=" + FormAction + "&TerminalSNo=" + TerminalSNo + "&TerminalName=" + TerminalName,
                // data: $("#hdnAuditLog").val(),
                data: JSON.stringify({ data: btoa(jsonData) }),
                success: function (response) {

                }
            });
        }
    } catch (e) {

    }
    finally {
        sessionStorage.removeItem("auditlog");
    }
}
function CompareSession() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: SiteUrl + "Services/CommonService.svc/CompareSessionAfterLogin",
        success: function (response) {
            if (!response) {
                location.href = 'Account/' + userContext.SysSetting.LoginPage + '?islogout=true';
            }
        }
    });
}
function ShowTickerOnPublish() {

    if ($.browser != undefined && $.browser.safari != undefined)
        if ($.browser.safari) {
            //Commented by braj, notification function not working in safari
            //if (Notification.permission !== "granted")
            //    Notification.requestPermission();
        }
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        url: SiteUrl + "Services/CommonService.svc/ShowTickerOnPublish",
        success: function (response) {
            if (response.ShowTickerOnPublishResult != "") {
                window.parent.$("#marTicker").text(response.ShowTickerOnPublishResult).show();
                setInterval(function () {
                    window.parent.$("#marTicker").toggleClass('MarqueBlue');
                }, 400);
                if ($.browser.safari) {
                    if (Notification.permission !== "granted")
                        Notification.requestPermission();
                    else {
                        var notification = new Notification('', {
                            icon: 'http://www.freeiconspng.com/uploads/message-alert-red-icon--message-types-icons--softiconsm-4.png',
                            body: response.ShowTickerOnPublishResult,
                        });
                    }
                }
            }
        }
    });
}
// Added By Amit Yadav
function AddDocumentShortCuts() {

    // For Expand Collapse screen
    shortcut.add("f1", function (e) {
        window.parent.$("#divSlider").trigger("click");
        e.preventDefault();
    }, {
            'type': 'keydown',
            'target': document
        });
    //For Grid Filter
    shortcut.add("f5", function (e) {
        if (gridSelectedRowIndex != -1) {
            $(gridObjectDiv).find("th:visible:eq(" + (gridSelectedColumnIndex) + ")").find(".k-grid-filter").trigger('click');
            e.preventDefault();
        }
    }, {
            'type': 'keydown',
            'target': document
        });
    // Read
    shortcut.add('f2', function (bo) {
        if (gridSelectedRowIndex != -1 && $("#header-user-options").length > 0) {
            var $a = $("#header-user-options").find(".icon-read").closest("a");
            navigateUrl($a.attr("href"));
        }
    }, {
            'type': 'keydown',
            'target': document
        });
    // Edit
    shortcut.add('f3', function (bo) {
        if (gridSelectedRowIndex != -1 && $("#header-user-options").length > 0) {
            var $a = $("#header-user-options").find(".icon-edit").closest("a");
            navigateUrl($a.attr("href"));
        }
    }, {
            'type': 'keydown',
            'target': document
        });
    // Delete
    shortcut.add('f4', function (bo) {
        if (gridSelectedRowIndex != -1 && $("#header-user-options").length > 0) {
            var $a = $("#header-user-options").find(".icon-trash").closest("a");
            navigateUrl($a.attr("href"));
        }
    }, {
            'type': 'keydown',
            'target': document
        });
}


function getQueryStringValue(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//check DirtyFields Inside the Page
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {
    $(window).bind('beforeunload', function (e) {
        if (dirtyForm.isDirty) {
            return 'Some changes are on page are not saved.';
        }
    });
    return $('form').each(function () {
        var self = $(this), original = self.serialize() || self.val(), dirty;
        self.bind('keydown keyup change', function () {
            dirtyForm.isDirty = original !== self.serialize() || self.val() ? true : false;
        });
    })
};

var Dialog = { onClose: function () { }, onYes: function () { }, onNo: function () { } };
Dialog.alert = function (Message, Title, a) {
    if (typeof Title === "undefined") {
        Title = "Message from webpage";

    }
    Dialog.openWindow(Title, Message);
    $("#divDialogBox #lblDialogBoxMessage").html("");
    $("#divDialogBox #divDialogBoxControls").html("");
    $("#divDialogBox #lblDialogBoxMessage");
    $("#divDialogBox #lblDialogBoxMessage").text(Message).append("</br>");
    $("#divDialogBoxControls").append($("<a class='buttonlink' href='#' onclick='javascript:return Dialog.Close();'></a>").css({ 'padding-bottom': "2px" }).attr({ class: "buttonlink k-window-action k-link" }).append($("<span>Close</span>").attr({ class: "k-i-close" }))).focus();
    $("#divDialogBoxControls").append($("</br>"));
    Dialog.onClose = a;
    Dialog.onNo = function () { };
    Dialog.onYes = function () { };


}
Dialog.confirmBox = function (Message, Title, a, b) {
    if (typeof Title === "undefined") {
        Title = "Message from webpage";
    }
    Dialog.openWindow(Title, Message);
    $("#divDialogBox #lblDialogBoxMessage").html("");
    $("#divDialogBox #divDialogBoxControls").html("");
    $("#divDialogBox #lblDialogBoxMessage")
    $("#divDialogBox #lblDialogBoxMessage").text(Message + (Message.indexOf("?") >= 0 ? "" : "?")).append("</br>");
    $("#divDialogBoxControls").append($("<a class='buttonlink' href='#' onclick='javascript:return Dialog.Close();'></a>").css({ 'padding-bottom': "2px" }).attr({ class: "buttonlink k-window-action k-link" }).append($("<span>Yes</span>").attr({ class: "k-i-close" })));
    $("#divDialogBoxControls").append($("<a class='buttonlink' href='#' onclick='javascript:return Dialog.Close();'></a>").css({ 'padding-bottom': "2px" }).attr({ class: "buttonlink k-window-action k-link" }).append($("<span>No</span>").attr({ class: "k-i-close" }))).focus();
    $("#divDialogBoxControls").append($("</br>"));
    Dialog.onYes = a;
    Dialog.onNo = b;
    Dialog.onClose = function () { };
}
Dialog.Close = function () {
    var window = $("#divDialogBox");
    window.data("kendoWindow").close();
    if (!typeof Dialog.onYes === "undefined") {
        Dialog.onYes();
    }
    if (!typeof Dialog.onNo === "undefined") {
        Dialog.onNo();
    }
    if (!typeof Dialog.onClose === "undefined") {
        Dialog.onClose();
    }
}
Dialog.openWindow = function openWindow(Title, Message) {
    var window = $("#divDialogBox");
    window.css({ "display": "block" });
    $("#overlayDialogBox").css({ "display": "block" });
    if (!window.data("kendoWindow")) {
        window.kendoWindow({
            width: "450px",
            actions: ["Close"],
            title: Title,
            close: function () {
                $("#overlayDialogBox").css({ "display": "none" });
            }
        });
        window.data("kendoWindow").open();
    }
    else {
        window.data("kendoWindow").open();
    }
    $('.k-window-titlebar').find("span:first").css({ "font-size": "12px", "font-weight": "normal" }).text(Title);

    var margin = Math.floor(($(document).width() - window.width()) / 2);
    $(".k-window,.widget ").css({ "left": margin.toString() + 'px' });
    var top = Math.floor(($(document).height() - window.height()) / 2);
    $(".k-window,.widget ").css({ "top": top.toString() + 'px' });
    $(".k-window-title").css({ "font-weight": 'bold' });
}


function ShowMessage(msgType, title, htmlText) {

    if (htmlText != "") {
        CallMessageBox(msgType, title, htmlText);
    }
}


///MessageBox
function CallMessageBox(msgType, title, msg, position, fadeInTime, fadeOutTime, timeout) {

    if (fadeInTime == undefined)
        fadeInTime = 200;
    if (fadeOutTime == undefined)
        fadeOutTime = 300;
    if (timeout == undefined)
        timeout = 2600;
    if (position == undefined)
        position = "cfMessage-top-right";
    InvokeMsg.options = {
        "debug": false,
        "positionClass": position,
        "onclick": null,
        "fadeIn": fadeInTime,
        "fadeOut": fadeOutTime,
        "timeOut": timeout

    }
    InvokeMsg[msgType](msg, title)
}

function Check() {
    $.blockUI({
        message: '<b style=" vertical-align:middle;text-align:center; font-size:12pt;color:red;">Please Wait........</b>',
        css: {

            color: '#fff',
            border: '3px solid Transparent',
            backgroundColor: 'Transparent',
            cursor: 'default'
        }
    });
}

function StopProgress() {
    $.unblockUI();
}

function getDateNextYear() {
    var temp = $.trim((new Date()).toDateString().replace(/^(\w+)\s+(\w+)\s+(\d+)\s+(\d+)/, '$3-$2-$4').substring(0, 12));
    temp = temp.replace(/^(\d+)\W+(\w+)\W+(\d+)/, "$1-$2-" + (parseInt(temp.replace(/^(\d+)\W+(\w+)\W+(\d+)/, "$3")) + 1).toString())
    return temp
}
function getDateNext(date) {
    var k = date.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dt = new Date(Date.parse(k));
    dt.setDate(dt.getDate() + 1);
    var temp = $.trim(dt.toDateString().replace(/^(\w+)\s+(\w+)\s+(\d+)\s+(\d+)/, '$3-$2-$4').substring(0, 12));
    return temp;
}

function getDatePrevious(date) {
    var k = date.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dt = new Date(Date.parse(k));
    dt.setDate(dt.getDate() - 1);
    var temp = $.trim(dt.toDateString().replace(/^(\w+)\s+(\w+)\s+(\d+)\s+(\d+)/, '$3-$2-$4').substring(0, 12));
    return temp;
}
function blockNonNumbersLatest(obj, e, allowDecimal, allowNegative) {
    var key;
    var isCtrl = false;
    var keychar;
    var reg;

    if (window.event) {
        key = e.keyCode;
        isCtrl = window.event.ctrlKey
    }
    else if (e.which) {
        key = e.which;
        isCtrl = e.ctrlKey;
    }

    if (isNaN(key)) return true;

    keychar = String.fromCharCode(key);

    // check for backspace or delete, or if Ctrl was pressed
    if (key == 8 || isCtrl) {
        return true;
    }

    reg = /\d/;
    var isFirstN = allowNegative ? keychar == '-' && obj.value.indexOf('-') == -1 : false;
    var isFirstD = allowDecimal ? keychar == '.' && obj.value.indexOf('.') == -1 : false;

    return isFirstN || isFirstD || reg.test(keychar);
}

$.fn.centerScreen = function () {
    this.css("position", "absolute");
    this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
    this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
    return this;
};
$.fn.centerTop = function (topPosition) {
    this.css("position", "absolute");
    if (topPosition)
        this.css("top", topPosition + "px");
    else
        this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
    this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
    return this;
};

function getCook(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
    // Return everything after the equal sign
    return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}


function ShowLoader(toggle) {
    $body = window.parent.$("body");
    var mask = $body.find(".k-loading-mask");
    if (toggle) {
        if (!mask.length) {
            mask = $("<div class='k-loading-mask'><span class='k-loading-text'>Loading...</span><div class='k-loading-image'/><div class='k-loading-color'/></div>")
                .width("100%").height("100%")
                .prependTo($body)
                .css({ top: $body.scrollTop(), left: $body.scrollLeft() });
        }
    } else if (mask) {
        mask.remove();
    }
}
//Added by Amit Yadav
$(document).ajaxSend(function (evt, request, settings) {
    ShowLoader(true);
});

$(document).ajaxComplete(function (event, request, settings) {
    ShowLoader(false);
});
$(document).ajaxError(function (event, request, settings, thrownError) {
    ShowLoader(false);
    AjaxErrorevent = event;
    AjaxErrorrequest = request;
    AjaxErrorsettings = settings;
    AjaxErrorthrownError = thrownError;
    setTimeout(function () { CheckSession(); }, 500);
});

var AjaxErrorevent;
var AjaxErrorrequest;
var AjaxErrorsettings;
var AjaxErrorthrownError;

function CheckSession() {
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: SiteUrl + "Services/CommonService.svc/CheckSession",
        success: function (response) {
            if (response.CheckSessionResult == false) {
                OpenLoginWindow();
            } else {
                if (!$("#divDialogSession").is(':visible')) {
                    ShowMessage("error", "System is busy at the moment. Kindly try again after some time.");
                    setTimeout(function () { InsertAjaxRequestError(); }, 500);
                }
            }
        }, error: function (a) {
            location.href = SiteUrl + 'Account/' + userContext.SysSetting.LoginPage + '?islogout=true';
        }
    });
}
function InsertAjaxRequestError() {
    var ajaxRequestError = { URL: btoa(AjaxErrorevent.target.URL), status: AjaxErrorrequest.status, statusText: btoa(AjaxErrorrequest.statusText), responseText: btoa($(AjaxErrorrequest.responseText).filter("#content").html()), RequestUrl: btoa(AjaxErrorsettings.url), PageURL: btoa(window.location.href), module: getQueryStringValue("Module"), Apps: getQueryStringValue("Apps") };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        global: false,
        url: SiteUrl + "Services/CommonService.svc/InsertAjaxRequestError",
        data: JSON.stringify(ajaxRequestError),
        success: function (response) {

        }, error: function () {
            //  location.href = SiteUrl + 'Account/' + userContext.SysSetting.LoginPage + '?islogout=true';
        }
    });
}

function OpenLoginWindow() {
    if ($("#divDialogSession").is(':visible'))
        return false;
    $("#txtReUserId").text(userContext.UserName);
    $("#divDialogSession").dialog({
        title: "Your current session has expired. Kindly login again to continue.",
        modal: true,
        draggable: false,
        resizable: false,
        position: 'top',
        width: 400,
        closeOnEscape: false,
        open: function (event, ui) {
            $("#divoverlay", parent.document).show();
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            RefreshCaptcha();
            $("#CaptchaCode").val('');
            $("#divoverlay", parent.document).css("height", $("#header", parent.document).height()).css("width", $("#header", parent.document).width()).show();
        }, close: function () {
            $("#divoverlay", parent.document).hide();
        },
        buttons: [
            {
                text: "Login",
                click: function () {
                    if ($("#txtRePassword").val() == "") {
                        ShowMessage("warning", "", "Password is required!");
                        return false;
                    }
                    $.ajax({
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: SiteUrl + "Services/CommonService.svc/ReLogin?userId=" + $("#txtReUserId").text() + "&password=" + $("#txtRePassword").val() + "&CaptchaCode=" + $("#CaptchaCode").val(),
                        success: function (response) {
                            $("#hdnUserContext", parent.document).val(response);
                            userContext = JSON.parse($("#hdnUserContext", parent.document).val());
                            ResetTimers();
                            if (response) {
                                $("#divDialogSession").dialog("close");
                                SessionTimerchannel.postMessage('Close');
                            }
                        }, error: function (response, q, t) {
                            var message = jQuery.parseJSON(response.responseText);
                            ShowMessage("warning", "", message);
                        }
                    });

                }
            }]

    });
}
//Added by Amit Yadav
var gridSelectedRowIndex = -1;
var gridSelectedColumnIndex;
var gridObjectDiv;
function onGridDataBound(e) {
    //  shortcut.remove("Ctrl+F");    
    var grid = $(e.sender.element).data("kendoGrid");
    if (grid) {
        $(grid.tbody).find("td").unbind("click").bind("click", function (e) {
            var row = $(this).closest("tr");
            gridObjectDiv = $(this).closest("div[data-role='grid']");
            gridSelectedRowIndex = parseInt($("tr", grid.tbody).index(row));
            gridSelectedColumnIndex = parseInt($("td:visible", row).index(this));
            if ($("#header-user-options").length === 0) {
                // gridSelectedColumnIndex++;
            } else {
                var recId = $(row).find("td:eq(0)").find("input[type='radio']").val();
                $(row).find("td:eq(0)").find("input[type='radio']").attr("checked", true);
                $("#header-user-options").find("a").each(function () {
                    var qString = "", ix = false;

                    $($(this).attr("href").split("&")).each(function (i, e) {
                        if (e.indexOf("RecID") >= 0) {
                            ix = true;
                            qString += e.split("=")[0] + "=" + recId + "&";
                        }
                        if (ix && e.indexOf("RecID") < 0) {
                            qString += e.split("=")[0] + "=" + $(row).find("td[data-column='" + e.split("=")[0] + "']").text() + "&";
                        }
                        else if (e.indexOf("RecID") < 0) {
                            qString += e + "&";
                        }
                    });

                    //if (!$(this).attr("onclick") || $(this).attr("data-rel")) {
                    //    if ($(this).attr("href") == "#")
                    //        $(this).attr("onclick", $(this).attr("data-rel"));
                    //    else {
                    //        $(this).attr("href", "#");
                    //        $(this).attr("onclick", "navigateUrl('" + qString.substr(0, qString.length - 1) + "')");
                    //        $(this).attr("data-rel", "navigateUrl('" + qString.substr(0, qString.length - 1) + "')");
                    //    }
                    //}
                    //else {
                    //    $(this).attr("href", qString.substr(0, qString.length - 1));
                    //}

                    $(this).attr("href", qString.substr(0, qString.length - 1));
                });
                if (gridSelectedColumnIndex === 0) {
                    // Added By Amit Yadav
                    if ($.isFunction(window.BeforeRowActionClick)) {
                        window.BeforeRowActionClick(this, row, recId, grid);
                    }
                    $(row).toolbar({ content: '#header-user-options', position: 'top', recId: "" });
                }
            }
        });
    }
}

function addToolBar() {


}

function AddJavaScriptFile(filename, filetype) {
    var fileref;
    if (filetype == "js") { //if filename is a external JavaScript file
        fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    } else if (filetype == "css") { //if filename is an external CSS file
        fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

function RemoveJavaScriptFile(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"; //determine element type to create nodelist from
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"; //determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement);
    for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]); //remove element by calling parentNode.removeChild()
    }
}

$(window).resize(function () {
    $(".tool-container").hide('slide');

});

function UserSubProcessRights(container, subProcessSNo) {
    var isView = false, IsBlocked = false;
    //get the subprocess view permission
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            isView = e.IsView;
            return;
        }
    });

    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            IsBlocked = e.IsBlocked;
            return;
        }
    });

    if (IsBlocked) {
        $('#' + container).html("")
        $(".btn-success").attr("style", "display:none;");
        $(".btn-danger").attr("style", "display:none;");
        $(".ui-button").closest("td").attr("style", "display:none;");
        $(".btnTrans").closest("td").attr("style", "display:none;");
        $(".btn-primary").attr("style", "display:none;");
        $(".btn-block").attr("style", "display:none;");

    } else {

        //if view permission is true
        if (isView) {
            $(".btn-success").attr("style", "display:none;");
            $(".btn-danger").attr("style", "display:none;");
            $(".ui-button").closest("td").attr("style", "display:none;");
            $(".btnTrans").closest("td").attr("style", "display:none;");
            $(".btn-primary").attr("style", "display:none;");
            $(".btn-block").attr("style", "display:none;");

            //$(".k-icon,.k-delete").replaceWith("");

            $('#' + container).find('input').each(function () {
                var ctrltype = $(this).attr("type");
                var dataRole = $(this).attr("data-role");
                if (ctrltype != "hidden") {
                    if (dataRole == "autocomplete") {
                        $(this).parent().parent().replaceWith("<span>" + this.value + "</span>");
                    }
                    else if (dataRole == "datepicker") {
                        $(this).parent().replaceWith("<span>" + this.value + "</span>");
                    }
                    else if (ctrltype == "radio") {
                        var name = $(this).attr("name");
                        if ($(this).attr("data-radioval"))
                            $(this).closest("td").html("<span>" + $("input[name='" + name + "']:checked").attr("data-radioval") + "</span>");
                        else
                            $(this).attr("disabled", true);
                    }
                    else if (ctrltype == "checkbox" || ctrltype == "radio") {// && (this.value == "0" || this.value == "1")
                        $(this).attr("disabled", true);
                    }
                    else if ($(this).attr("id").indexOf("_temp") >= 0) {
                        $(this).replaceWith("<input type='hidden' id='" + $(this).attr("id") + "' value='" + this.value + "' />");
                    }
                    else {
                        $(this).replaceWith("<span id='" + $(this).attr("id") + "'>" + this.value + "</span>");
                    }
                }

            });

            $('#' + container).find('select').each(function () {
                $(this).replaceWith("<span>" + $("#" + $(this).attr("id") + " :selected").text() + "</span>");
            });

            $('#' + container).find('ul li span').each(function (i, e) {
                $(e).removeClass();
            });

        }
        else {
            if (subProcessSNo == 2513 || subProcessSNo == 2500 || subProcessSNo == 2391 || subProcessSNo == 5356) {
                //$(".btn-success").attr("style", "width:100px;");
                //$(".btn-primary").attr("style", "width:100px;");
                //$(".btn-block").attr("style", "width:100px;");
            }
            else {
                $(".btn-success").attr("style", "display:block;");
                $(".btn-danger").attr("style", "display:block;");
                $(".btn-primary").attr("style", "display:block;");
                $(".btn-block").attr("style", "display:block;");
                $(".btnTrans").closest("td").attr("style", "display:table-cell;");
                $(".ui-button").closest("td").attr("style", "display:table-cell;");
            }
        }
    }

}

function GetPageRightsByAppName(Modules, Apps) {
    var returnVal;
    $.ajax({
        url: SiteUrl + "Services/CommonService.svc/GetPageRightsByAppName",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ getPageRightsByUser: { Module: Modules, Apps: Apps } }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            returnVal = result;
        }
    });
    return returnVal;
}

function GetPageRightsParameter() {
    return {
        Model: $("#FromDate").val(),
        Apps: $("#ToDate").val(),
        UserSno: $("#Issue").val()


    }
}
function GetUserLocalTime(Format) {
    var returnVal;
    var now = new Date();
    var strDate = kendo.toString(new Date(now.getTime() + (now.getTimezoneOffset() * 60000)), "dd-MMM-yyyy HH:mm:ss");
    $.ajax({
        url: SiteUrl + "Services/CommonService.svc/GetUserLocalTime?strDate=" + strDate + "&Format=" + Format + "&UserSNo=" + userContext.UserSNo,
        async: false,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            returnVal = result;
        }
    });
    return returnVal;
}

//Added by CS
function GetUserCurrentUTCTime(Format) {
    var returnVal;
    $.ajax({
        url: SiteUrl + "Services/CommonService.svc/GetUserCurrentUTCTime?Format=" + Format + "&UserSNo=" + userContext.UserSNo,
        async: false,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            returnVal = result;
        }
    });
    return returnVal;
}

//Added by Amit Yadav
var ButtonProcess = null;
function HighLightGridButton(obj, e) {
    if (ButtonProcess)
        $(ButtonProcess).removeAttr("style");
    $(obj).css({ "font-size": "15px", "box-shadow": "3px 3px 3px #000000", "border": "2px solid yellow" });
    ButtonProcess = obj;
}
function AllowedSpecialChar(ctrlID) {
    $("[id=" + ctrlID + "]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var Charactors = "+*&@,-/#()_;:<>$% ";    // allow only numbers [0-9] 
        var regex = /^[a-zA-Z0-9]*$/;    // allow only alphanumeric

        if (Charactors.indexOf(key) < 0 && !regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
}


//Added By Amit Yadav Delete Callback
function AutoCompleteDeleteCallBack(e, div, textboxid) {
    var target = e.target; // get current Span.
    var DivId = div; // get div id.
    var textboxid = textboxid; // get textbox id.

}

//Added By CS on 2017-09-28
function RefreshCaptcha() {
    var img = document.getElementById("imgCaptcha");
    if (img)
        img.src = "../Handler/CaptchaHandler.ashx?query=" + Math.random();
}

$.fn.livetooltip = function () {
    if (($(this).attr('title') || "") != "") {
        $(this).mouseover(function (e) {
            var tip = $(this).attr('title');
            $(this).attr('title', '');
            $("body").append('<div id="tooltip"><div class="tipBody">' + tip + '</div></div>');
            $('#tooltip').fadeIn('500');
            $('#tooltip').fadeTo('10', 0.9);

        }).mousemove(function (e) {
            $('#tooltip').css('top', e.pageY + 5);
            $('#tooltip').css('left', e.pageX + 5);

        }).mouseout(function () {
            $(this).attr('title', $('.tipBody').html());
            $('div#tooltip').remove();
        });
    }
};










//Start Code by Akash 29 July 2017


//Disable Right Click
//$(document).bind("contextmenu", function (e) {
//    e.preventDefault();
//});



$(document).ready(function () {
    ////Disable full page
    //$('body').bind('cut copy paste', function (e) {
    //    e.preventDefault();
    //});

    ////Disable part of page
    //$('#id').bind('cut copy paste', function (e) {
    //    e.preventDefault();
    //});
});

//document.onkeydown = function (e) {
//    // To Disable F12
//    //if (event.keyCode == 123) {
//    //    return false;
//    //}
//    // To Disable Cntrl + SHift + I
//    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
//        return false;
//    }
//    // To Disable Cntrl + SHift + J
//    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
//        return false;
//    }
//    //// To Disable Cntrl + SHift + C
//    //if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
//    //    return false;
//    //}

//    //// To Disable Cntrl + U
//    //if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
//    //    return false;
//    //}

//    // To Disable Cntrl + S
//    if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) {
//        return false;
//    }

//};

//End Start Code by Akash 29 July 2017












//-------------------Start Work by Akash For appendgrid last row bing old value and new value on 8 Nov 2017----------                                

var DeletedColumnName = "";
var DeletedKeycolumn = "";
var DeletedKeycolumnsno = "";
function SaveAuditLogForDeletedRowOfAppendgrid(tableId, RowNo, subprocess) {
    var oldval = '';
    var newval = '';
    var ap = false;
    var arrVal = [];
    var name = "";
    var clNameval = "";
    var clName = "";
    var keyValue = "";
    var Keycolumn = "";
    var Keycolumnapp = "";
    var rid = "";

    try {
        RowNo = RowNo - 1;
        $('#' + tableId + ' tbody').find("tr:eq(" + RowNo + ")").each(function (ii, row) {


            var FormAction = "DELETE";
            if (document.getElementById('htmlkeycolumn'))
                DeletedKeycolumn = document.getElementById('htmlkeycolumn').value;

            if (document.getElementById('htmlkeysno'))
                DeletedKeycolumnsno = document.getElementById('htmlkeysno').value;

            var Keycolumnval = '';
            if (FormAction == "NEW" || FormAction == "DELETE" || FormAction == "EDIT") {
                Keycolumnapp = getQueryStringValue("Apps").toUpperCase();
                var st = DeletedKeycolumn.split(",");
                for (var i = 0; i < st.length; i++) {
                    if (Keycolumnval == "") {
                        Keycolumnval = $("#" + st[i]).val();
                    }
                    else {
                        Keycolumnval = Keycolumnval + ',' + $("#" + st[i]).val();
                    }
                }
            }
            rid = $(row).closest('table tr').index();
            DeletedColumnName = $(row).closest('table').find('thead tr:first').text() + '-' + (rid + 1);;


            $(row).find("[newvalue]").each(function (iii, e) {
                if ($(e).attr("oldvalue") != "" && $(e).attr("oldvalue") != $(e).attr("newvalue") && ($('#' + $(e).attr('id')).closest('table').attr('class') || '').toString().indexOf('appendGrid') >= 0) {

                    if (ap == false) {
                        var attrold = '';
                        var attrnew = '';
                        $(row).find("input").each(function (i, tr) {
                            ap = true;
                            attrold = this.name;
                            if ($(tr).attr("oldvalue") != undefined && attrold != attrnew) {
                                if (oldval == '') {
                                    if ($(tr).attr("newvalue") != undefined)
                                        newval = newval + '/' + ($(tr).attr("newvalue") || $(tr).attr("oldvalue"));
                                    else
                                        newval = newval + '/' + $(tr).attr("oldvalue");

                                    oldval = $(tr).attr("oldvalue");
                                }
                                else {
                                    oldval = oldval + '/' + $(tr).attr("oldvalue");

                                    if ($(tr).attr("newvalue") != undefined)
                                        newval = newval + '/' + ($(tr).attr("newvalue") || $(tr).attr("oldvalue"));
                                    else
                                        newval = newval + '/' + $(tr).attr("oldvalue");
                                }
                                attrnew = this.name;
                            }

                        });
                    }
                }
            });

            if (oldval != "" && newval != "") {

                var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: DeletedColumnName, OldValue: oldval, NewValue: newval };
                arrVal.push(a);
            }
            else if (oldval == "" && newval != "") {

                var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: DeletedColumnName, OldValue: oldval, NewValue: newval };
                arrVal.push(a);
            }

            var auditLog = {
                KeyColumn: DeletedKeycolumn, KeyValue: Keycolumnval, keySNo: DeletedKeycolumnsno, arrVal: JSON.stringify(arrVal), FormAction: FormAction, TerminalSNo: userContext.TerminalSNo, TerminalName: userContext.NewTerminalName
            }
            sessionStorage.setItem("auditlog", JSON.stringify(auditLog));
            SaveAppendGridAuditLog(DeletedKeycolumn, Keycolumnval, DeletedKeycolumnsno, JSON.stringify(arrVal), FormAction, userContext.TerminalSNo, userContext.NewTerminalName);
        });

    } catch (e) {

    }
}


function AuditLogBindOldValueForDeleteAction(id) {
    try {

        $("#" + id).find("input[type!='hidden'],textarea,select,span,label").each(function (i, e) {

            if (this.tagName.toUpperCase() == "SPAN") {
                $(this).attr("oldvalue", "").attr("newvalue", this.innerText);
            }
            else if (this.type == "checkbox") {
                $(this).attr("oldvalue", $(this).is(":checked")).attr("newvalue", "");
            }
            else if (e.nodeName == "SELECT") {
                $(this).attr("oldvalue", $(this).find("option:checked").text()).attr("newvalue", "");
            }

        });
    } catch (e) {

    }
}
//-------------------End Work by Akash For appendgrid last row bing old value and new value on 8 Nov 2017----------

//Added By Devendra Singh For Excel download 21 FEB 2019

function exportToExcelNew(htmls, filename) {
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    var base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)))
    };

    var format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
        })
    };

    var ctx = {
        worksheet: filename == 'AWB Information' ? 'Sheet1' : 'Worksheet',
        table: htmls
    }

    var link = document.createElement("a");
    link.download = filename + '.xls' || "export.xls";
    link.href = uri + base64(format(template, ctx));
    link.click();
}