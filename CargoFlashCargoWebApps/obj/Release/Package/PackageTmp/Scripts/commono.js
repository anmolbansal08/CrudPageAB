/// <reference path="Kendo/kendo.web.js" />
var timeoutvalue = 0;
var userContext = "";
var attrType = "controltype";
var dateType = "datetype";
var otherType = "OtherType";
var autoCompleteType = "autocomplete";
var autoCompleteText = "Text";
var autoCompleteKey = "Key";
var formid = "aspnetForm";
var formCulture = "en-US";
var cons = "abc";
var wndError, wndSuccess;
var commonErrorMessage = "Please Try Again!"
var _SessionWeightRound_ = 0.5;
var url = 'Services/AutoCompleteService.svc/WMSAutoCompleteDataSource';
var fblurl = 'Services/AutoCompleteService.svc/WMSFBLAutoCompleteDataSource';
//START AUTO COMPLETE DATA SOURCE SECTION
var xorKey = 83;
var CustomerType = [{ Key: "0", Text: "B2B" }, { Key: "1", Text: "B2C" }];
var ApplicableFor = [{ Key: "1", Text: "SHIPPER" }, { Key: "2", Text: " CONSIGNEE" }, { Key: "3", Text: " BOTH" }];
var NeededAt = [{ Key: "1", Text: "ORIGIN" }, { Key: "2", Text: "DESTINATION" }, { Key: "3", Text: "TRANSIT" }, { Key: "4", Text: "ORIGIN AND DESTINATION BOTH" }];
var UsageType = [{ Key: "1", Text: "INBOUND" }, { Key: "2", Text: " OUTBOUND" }];
var PrefixType = [{ Key: "0", Text: "+" }, { Key: "1", Text: "-" }];
var AmountType = [{ Key: "0", Text: "PERCENTAGE" }, { Key: "1", Text: "PER KG" }, { Key: "2", Text: "FLAT" }];
var ValueType = [{ Key: "1", Text: "SHIPMENT DECLARED VALUE" }, { Key: "4", Text: "PER UNIT" }];
var UploadType = [{ Key: "0", Text: "TARIFF" }, { Key: "1", Text: "CITY" }, { Key: "2", Text: "REGION LOCATION ZIPCODE" }, { Key: "3", Text: "COMMODITY" }, { Key: "4", Text: "TARIFF DISCOUNTING" }, { Key: "5", Text: "CONSOLIDATOR FEE" }, { Key: "6", Text: "FORWARD RATE" }, { Key: "7", Text: "FORWARD RATE DISCOUNTING" }, { Key: "8", Text: "FORWARD COST" }];
//var ScheduleType = [{ Key: "1", Text: "POS" }, { Key: "2", Text: "CUSTOMER"}];
var ScheduleType = [{ Key: "1", Text: "POS" }, { Key: "3", Text: "CUSTOMER" }];

var STTType = [{ Key: "1", Text: "DELIVERED" }, { Key: "2", Text: " UN-DELIVERED" }, { Key: "3", Text: " BOTH" }];

var PeriodType = [{ Key: "1", Text: "WEEKLY" }, { Key: "2", Text: "QUARTERLY" }, { Key: "3", Text: "MONTHLY" }, { Key: "4", Text: "YEARLY" }];
var TopUpType = [{ Key: "1", Text: "MANUAL" }, { Key: "2", Text: " AUTOMATIC" }, { Key: "3", Text: " BOTH" }];
var _SessionAutoComplete_ = [{ Key: "", Text: "" }];
var FlightDetail = [{ Key: "", Text: "" }];
var _DefaultAutoComplete_ = [{ Key: "", Text: "" }];
var __TRUE = "True";
var __FALSE = "False";
var __B2B = 5;
var __CONS = 6;
var __DROPBOX = 7;
var __POS = 8;
var __ADMIN = "ADMIN";
var processList = [];
var _CURR_OP_ = "";
var _CURR_PRO_ = "";
var _CITY_ = "DEL";
var _USER_ = "2";
var _CURR_TYPE_ = "";
var userContext = "";
kendo.culture(formCulture);
//kendo.culture("in-IN");
//END AUTO COMPLETE DATA SOURCE SECTION

function navigateUrl(currenturl, messageValue) {
    window.location.href = currenturl + ((messageValue != undefined && messageValue != "") ? ("&HV=" + messageValue) : "");
}
//-----  added by Santosh  ----------------------------------
function isEmpty(value) {
    return typeof (value) == 'undefined' || value == null;
}
function CargoFlashApplication() {
    var dateType = "datetype";
    var otherType = "OtherType";
    var autoCompleteType = "autocomplete";
    var attrType = "controltype";
    var numbertype = [{ key: "range", value: "-1" }, { key: "number", value: "0" }, { key: "decimal1", value: "1" }, { key: "decimal2", value: "2" }, { key: "decimal3", value: "3" }, { key: "decimal4", value: "4" }, { key: "decimal5", value: "5" }];

    var trnsformtype = [{ key: "datetype", value: "datetype" }, { key: "time", value: "none" }, { key: "ip", value: "none" }, { key: "contact", value: "none" }, { key: "default", value: "none" }, { key: "uppercase", value: "uppercase" }, { key: "lowercase", value: "lowercase" }, { key: "sentencecase", value: "capitalize" }, { key: "alphanumericupper", value: "uppercase" }, { key: "alphanumericlower", value: "lowercase" }, { key: "alphanumeric", value: "none" }, { key: "alphabet", value: "none" }, { key: "editor", value: "editor" }];

    var alphabettype = [{ key: "time", value: "time" }, { key: "ip", value: "ip" }, { key: "contact", value: "contact" }, { key: "default", value: "default" }, { key: "uppercase", value: "alphabet" }, { key: "lowercase", value: "alphabet" }, { key: "alphabet", value: "alphabet" }, { key: "alphanumericupper", value: "alphanumeric" }, { key: "alphanumericlower", value: "alphanumeric" }, { key: "alphanumeric", value: "alphanumeric" }];

    this.GetCFGrid = function (cntrlId) {
        return $("#" + cntrlId).find('.k-grid').data("kendoGrid");
    }

    this.GetNestedCFGrid = function (cntrlId) {
        return $("#" + cntrlId + ".k-grid").data("kendoGrid");
    }

    this.loadjscssfile = function (filename, filetype) {
        if (filetype == "js") { //if filename is a external JavaScript file
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
        }
        else if (filetype == "css") { //if filename is an external CSS file
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    this.ShowIndexView = function (divId, serviceUrl, jscriptUrl) {
        $.ajax({
            url: serviceUrl, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (jscriptUrl != undefined && jscriptUrl != "") {
                    ngen.loadjscssfile(jscriptUrl, "js");
                }
                $("#" + divId).html(result);
            },
            error: function (jqXHR, textStatus) {
            }
        });
    }

    this.ceil = function (value) {
        return kendo.ceil(value);
    }

    this.floor = function (value) {
        return kendo.floor(result);
    }

    this.round = function (value) {
        if (isNaN(value)) {
            return 0;
        }
        var weightRoundLimit = parseFloat(lvalue(_SessionWeightRound_).toString());
        var result = parseFloat(value) - weightRoundLimit;
        if (result % 1 === 0) {
            result = result + 0.001
        }
        return Math.ceil(result);
    }

    this.newKey = function (key) {
        var resultKey = "";
        for (i = 0; i < key.length; ++i) {
            resultKey += String.fromCharCode(xorKey ^ key.charCodeAt(i));
        }
        return resultKey;
    }
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return !this.indexOf(str);
        }
    }
    this.CultureValue = function (value, formatType, isRound) {
        if (isRound == undefined || isRound == null || isRound == "")
            isRound = true;
        return kendo.cultureValue(value, formatType, isRound);
    }

    this.RoundCultureValue = function (value, formatType, isRound) {
        if (value < 1)
            return 1;
        if (isRound == undefined || isRound == null || isRound == "")
            isRound = true;
        return kendo.roundCultureValue(value, formatType, isRound);
    }

    this.AssignCultureValue = function (controlId, value) {
        kendo.assignCultureValue(controlId, value);
    }

    this.ConvertCulture = function (obj, defaultCulture) {
        if (obj.value !== "" && obj.value != undefined && obj.value != null)
            kendo.convertCulture(obj.id, obj.value, defaultCulture);
    }

    this.Numeric = function (cntrlId, decimalPos, isSpan) {
        if (isSpan) {
            var subtype = $("span[id='" + cntrlId + "']").attr("subtype");
            $("span[id='" + cntrlId + "']").kendoNumericTextBox({
                format: (subtype == "weight" ? "#.00 kg" : (subtype == "currency" ? "c" : "n") + decimalPos),
                decimals: decimalPos,
                width: widthset,
                wrap: false
            });
        }
        else {
            var minValue = null, maxValue = null;
            var allowChar = $("[id='" + cntrlId + "']").attr("allowchar");
            if (decimalPos == -1) {
                decimalPos = 0;
            }
            if (allowChar != undefined && allowChar != "") {
                minValue = allowChar.split('!')[0];
                maxValue = allowChar.split('!')[1];
            }

            var widthset = "80px";
            if ($("[id='" + cntrlId + "']").css("width") != undefined)
                widthset = $("[id='" + cntrlId + "']").css("width");

            var subtype = $("[id='" + cntrlId + "']").attr("subtype");
            var allowround = $("[id='" + cntrlId + "']").attr("allowround");
            $("[id='" + cntrlId + "']").kendoNumericTextBox({
                min: minValue,
                max: maxValue,
                step: 1,
                format: (subtype == "weight" ? "#.00 kg" : (subtype == "currency" ? "c" : "n") + decimalPos),
                decimals: decimalPos,
                width: widthset,
                wrap: true,
                allowround: (allowround != undefined ? allowround : true),
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
                filter: (filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria),
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
    this.AlphabetTextBox = function (cntrlId, alphabetstyle) {
        var allowChar = $("[id='" + cntrlId + "']").attr("allowchar");
        var maxLength = $("[id='" + cntrlId + "']").attr("maxLength");
        $("[id='" + cntrlId + "']").kendoAlphabetTextBox({
            value: 10,
            textTransform: alphabetstyle,
            textType: TextType(cntrlId),
            allowChar: allowChar != undefined ? allowChar : "",
            maxLength: (maxLength == undefined || maxLength == "" ? 15 : maxLength)
        });
    }

    this.Editor = function (cntrlId) {
        $("[id='" + cntrlId + "']").kendoEditor();
    }

    this.getFilter = function (logic) {
        var filter = { logic: (logic == undefined || logic == "" ? "AND" : logic), filters: [] };
        return filter;
    }

    this.setFilter = function (filterName, field, operator, value) {
        if (filterName != undefined) {
            filterName.filters.push({ field: field, operator: operator, value: value, parentlogic: "" });
        }
    }

    this.autoCompleteFilter = function (filterName, logic) {
        var filter = { parentlogic: (logic == undefined || logic == "" ? "AND" : logic), filters: [] };
        if (Object.prototype.toString.call(filterName) === '[object Array]') {
            for (var i = 0; i < filterName.length; i++)
                if (filterName[i] != undefined) {
                    filterName[i].parentlogic = (logic == undefined || logic == "" ? "AND" : logic);
                    filter.filters.push(filterName[i]);
                }
        }
        else {
            if (filterName != undefined) {
                filterName.parentlogic = (logic == undefined || logic == "" ? "AND" : logic);
                filter.filters.push(filterName);
            }
        }
        return filter;
    }

    this.DateType = function (cntrlId, isSpan) {
        var isDateExist = true;

        if (isSpan == undefined || isSpan == "" || isSpan == false) {
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
                isDateExist = $("#" + cntrlId).val() != "";
            }
        }
        var startControl = $("#" + cntrlId).attr("startControl");
        var endControl = $("#" + cntrlId).attr("endControl");

        var widthset = $("#" + cntrlId).css("width");
        var addonchange = $("#" + cntrlId).attr("addonchange");
        if (isSpan) {
            $("span[id='" + cntrlId + "']").kendoDatePicker({
                format: "dd-MMM-yyyy",
                width: widthset,
                wrap: false
            });
        }
        else {
            $("#" + cntrlId).kendoDatePicker({
                format: "dd-MMM-yyyy",
                startControlId: (startControl == undefined ? null : startControl),
                endControlId: (endControl == undefined ? null : endControl),
                change: ((startControl != undefined && startControl == cntrlId) ? startChange : (endControl != undefined && endControl == cntrlId) ? endChange : (addonchange != undefined ? AddOnChange : null)),
                width: widthset,
                wrap: true,
                addOnChange: (addonchange != undefined ? addonchange : null)
            });
            if (!isDateExist) {
                $("#" + cntrlId).val("");
            }
        }
    }

    this.AutoCompleteByDataSource = function (textId, dataSourceName, addOnFunction, clearAllValues, container) {
        var keyId = textId;
        textId = "Text_" + textId;

        if (IsValid(textId, autoCompleteType)) {
            basedOn = autoCompleteText;
            var width = $("input[type='text'][name='" + textId + "']").attr("data-width");
            if (container == undefined) {
                if ($("input[type='text'][name='" + textId + "']").data("kendoAutoComplete") != undefined) {
                    var kendoAutoCompleteWC = null;
                    kendoAutoCompleteWC = $("input[type='text'][name='Text_" + keyId + "']").data("kendoAutoComplete");
                    if (kendoAutoCompleteWC != undefined) {
                        if (clearAllValues) {
                            kendoAutoCompleteWC.setDefaultValue("", "");
                            $("#Text_" + keyId).val("");
                            $("#" + keyId).val("");
                        }
                        kendoAutoCompleteWC.setDataSource(dataSourceName);
                        kendoAutoCompleteWC.options.filterField = (basedOn == undefined ? kendoAutoCompleteWC.options.filterField : basedOn);
                        kendoAutoCompleteWC.options.addOnFunction = (addOnFunction == undefined || addOnFunction == null ? null : addOnFunction);
                        kendoAutoCompleteWC.options.dataTextField = autoCompleteText;
                        kendoAutoCompleteWC.options.dataValueField = autoCompleteKey;
                        kendoAutoCompleteWC.setAddOnFunction(keyId)
                    }
                }
                else {
                    var dataSource = dataSourceName;
                    $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                        filter: "startswith",
                        dataSource: dataSource,
                        filterField: basedOn,
                        dataTextField: autoCompleteText,
                        dataValueField: autoCompleteKey,
                        valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                        addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                        width: width
                    });
                }
            }
            else {
                if ($(container).find("input[type='text'][name='" + textId + "']").data("kendoAutoComplete") != undefined) {
                    var kendoAutoCompleteWC = null;
                    kendoAutoCompleteWC = $(container).find("input[type='text'][name='Text_" + keyId + "']").data("kendoAutoComplete");
                    if (kendoAutoCompleteWC != undefined) {
                        if (clearAllValues) {
                            kendoAutoCompleteWC.setDefaultValue("", "");
                            $(container).find("#Text_" + keyId).val("");
                            $(container).find("#" + keyId).val("");
                        }
                        kendoAutoCompleteWC.setDataSource(dataSourceName);
                        kendoAutoCompleteWC.options.filterField = (basedOn == undefined ? kendoAutoCompleteWC.options.filterField : basedOn);
                        kendoAutoCompleteWC.options.addOnFunction = (addOnFunction == undefined || addOnFunction == null ? null : addOnFunction);
                        kendoAutoCompleteWC.options.dataTextField = autoCompleteText;
                        kendoAutoCompleteWC.options.dataValueField = autoCompleteKey;
                        kendoAutoCompleteWC.setAddOnFunction(keyId)
                    }
                }
                else {
                    var dataSource = dataSourceName;
                    $(container).find("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                        filter: "startswith",
                        dataSource: dataSource,
                        filterField: basedOn,
                        dataTextField: autoCompleteText,
                        dataValueField: autoCompleteKey,
                        valueControlID: $(container).find("input[type='hidden'][name='" + keyId + "']"),
                        addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                        width: width
                    });
                }
            }
        }
    }

    this.AutoComplete = function (textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl) {
        var keyId = textId;
        textId = "Text_" + textId;

        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var width = $("input[type='text'][name='" + textId + "']").attr("data-width");
            var dataSource = GetDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl);
            if ($("input[type='text'][name='" + textId + "']").data("kendoAutoComplete") != undefined) {
                cfi.ChangeAutoCompleteDataSource(textId.replace("Text_", ""), dataSource, true, addOnFunction, basedOn);
            }
            else {
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
                    confirmOnAdd: confirmOnAdd,
                    width: width
                });
            }
        }
    }

    this.AutoCompleteForFBLHandlingCharge = function (textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
        var keyId = textId;
        textId = "Text_" + textId;

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
            $("[id='" + sectionId + "']").find("[validateonsubmit='true']").each(function () {
                $(this).cfValidator();
            });
        }
        else {
            $("[id='" + sectionId + "']").find("[validateonsubmit='true']").each(function () {
                $(this).cfValidator(options);
            });
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

    this.IsValidTransSection = function (sectionId) {
        if (sectionId instanceof jQuery)
            return sectionId.data('cfValidator').validate();
        return $("#" + sectionId).data('cfValidator').validate();
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

    this.PopUp = function (cntrlId, title, width, addOnOpen, addOnClose, topPosition) {
        var window = $("#" + cntrlId);
        var popUpWindow = $("#divPopUpBackground");
        window.show();
        popUpWindow.show();
        //        if (window.find('input[type="text"]').length > 0) {
        //            if (window.find('input[type="text"]')[0].name.indexOf('_temp') >= 0) {
        //                var l = window.find('input[type="text"]')[0].name.replace('_temp', '');
        //                $("#" + l).focus();
        //            }
        //            else {
        //                window.find('input[type="text"]').focus();
        //            }
        //        }
        if (!window.data("kendoWindow")) {
            window.kendoWindow({
                width: ((width == null || width == undefined || width == "") ? "800px" : width + "px"),
                actions: ["Minimize", "Close"],
                title: title,
                maxHeight: 500,
                close: function () {
                    window.hide();
                    popUpWindow.hide();
                },
                top: '0px',
                addOnOpen: (addOnOpen == undefined ? null : addOnOpen),
                addOnClose: (addOnClose == undefined ? null : addOnClose)
            });
        }
        else {
            var kendowindow = window.data("kendoWindow");
            kendowindow.options.width = ((width == null || width == undefined || width == "") ? "800px" : width + "px");
            kendowindow.options.top = '0px';
            kendowindow.options.actions = ["Minimize", "Close"];
            kendowindow.options.title = ((title == null || title == undefined || title == "") ? "Details" : title);
            kendowindow.options.addOnOpen = (addOnOpen == undefined ? null : addOnOpen);
            kendowindow.options.addOnClose = (addOnClose == undefined ? null : addOnClose);
            kendowindow.open();

        }

        //window.show();
        //popUpWindow.show();
        $(document).bind("keydown", function (e) {
            if (cntrlId != "divAfterContent" && e.keyCode == kendo.keys.ESC) {
                var visibleWindow = $(".k-window:visible > .k-window-content");
                if (visibleWindow.length)
                    visibleWindow.data("kendoWindow").close();
            }
            else if (cntrlId == "divAfterContent" && e.keyCode == kendo.keys.ESC) {
                var visibleWindow = $(".k-window:visible:last > .k-window-content")
                if (visibleWindow.length)
                    visibleWindow.data("kendoWindow").close();
            }
        });
        $("#" + cntrlId).closest(".k-window").removeAttr('style');
        $("#" + cntrlId).closest(".k-window").removeClass('k-widget');
        $("#" + cntrlId).closest(".k-window").css("top", "0px");
        //$("#" + cntrlId).closest(".k-window").css("margin", "auto");
        //$("#" + cntrlId).closest(".k-window").css("position", "fixed");
        //$("#" + cntrlId).closest(".k-window").css("position", "fixed");
        $("#" + cntrlId).closest(".k-window").css("left", "10%");
        $("#" + cntrlId).closest(".k-window").css("right", "10%");

        if (cntrlId == "divAfterContent") {
            window.data("kendoWindow").center();
            $("#" + cntrlId).closest(".k-window").centerTop(topPosition);
        }

        return false;
    }

    this.PopUp_Common = function (cntrlId, title, width, OnOpen, OnClose, topPosition) {

        var Kwindow = $("#" + cntrlId);

        if (!Kwindow.data("kendoWindow")) {
            Kwindow.kendoWindow({
                appendTo: "form#aspnetForm",
                width: ((width == null || width == undefined || width == "") ? "800px" : width + "px"),
                actions: ["Minimize", "Close"],
                title: title,
                modal: true,
                maxHeight: 500,
                close: function () {
                    Kwindow.hide();
                    //popUpWindow.hide();
                },
                close: (OnClose == undefined ? null : OnClose),
                //open: (OnOpen == undefined ? null : OnOpen)
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

    this.BindMultiValue = function (controlName, textDetail, keyDetail) {
        var totalText = textDetail.split(',');
        var totalKeys = keyDetail.split(',');

        for (lIndex = 0; lIndex < totalText.length; lIndex++) {
            $("div[id='divMulti" + controlName + "']").find("ul").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + totalText[lIndex] + "</span><span id='" + totalKeys[lIndex] + "' class='k-icon k-delete'></span></li>");

            if (lIndex == 0) {
                $("div[id='divMulti" + controlName + "']").find("span[id^='FieldKeyValues" + controlName + "']").text(totalKeys[lIndex]);
            }
            else {
                var lPreviousKey = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text();
                lPreviousKey = lPreviousKey + "," + totalKeys[lIndex];
                $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(lPreviousKey);
            }
            /*
            $('.k-icon.k-delete').live('click', function () {
                $(this).parent().remove();
                //                if ($("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().indexOf($(this)[0].id + ",") > -1) {
                //                    var ll = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().replace($(this)[0].id + ",", '');
                //                    $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(ll);
                //                    $("input:hidden[name^='" + controlName + "']").val(ll);
                //                    $("div[id='divMulti" + controlName + "']").find("input:hidden[name^='Multi_" + controlName + "']").val(ll);
                //                }
                //                else {
                //                    if ($("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text() == $(this)[0].id) {
                //                        var l = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().replace($(this)[0].id, '');
                //                        $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(l);
                //                    }
                //                }
                var lFieldKeyValues = [];
                lFieldKeyValues = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().split(',');
                var lFoundKeyValues = false;
                for (lCounter = 0; lCounter < lFieldKeyValues.length; lCounter++) {
                    if (lFieldKeyValues[lCounter] == $(this)[0].id) {
                        lFoundKeyValues = true;
                        break;
                    }
                }

                if (lFoundKeyValues) {
                    var ll = "";
                    ll = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().replace($(this)[0].id + ",", '');

                    if (ll == $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text()) {
                        ll = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().replace("," + $(this)[0].id, '');
                    }

                    if (ll == $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text()) {
                        ll = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().replace($(this)[0].id, '');
                    }

                    $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(ll);
                    $("input:hidden[name^='" + controlName + "']").val(ll);
                    $("div[id='divMulti" + controlName + "']").find("input:hidden[name^='Multi_" + controlName + "']").val(ll);
                    //                    if (that.options.valueControlID != "" || that.options.valueControlID != undefined)
                    //                        $(that.options.valueControlID).val(ll);
                }
                else {
                    if ($("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text() == $(this)[0].id) {
                        var l = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().replace($(this)[0].id, '');
                        $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(l);
                        //$("div[id='divMulti" + controlName + "']").find("input:hidden[name^='Multi_" + that.element[0].name.replace('Text_', '') + "']").val(l);
                        //                        if (that.options.valueControlID != "" || that.options.valueControlID != undefined)
                        //                            $(that.options.valueControlID).val(l);
                    }
                }
            });*/
        }

        $("div[id='divMulti" + controlName + "']").find("input:hidden[name^='Multi_" + controlName + "']").val($("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text());
    }

    this.BindMultiValueRead = function (controlName, textDetail) {
        var totalText = textDetail.split(',');
        $("#tbl").find("span[id^='" + controlName + "']").text('');
        $("#tbl").find("span[id^='" + controlName + "']").append("<ul style='padding:3px 2px 2px 0px;margin-top:0px; width:400px;'></ul>");
        for (lIndex = 0; lIndex < totalText.length; lIndex++) {
            $("#tbl").find("span[id^='" + controlName + "']").find("ul").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + totalText[lIndex] + "</span>");
        }
    }

    this.CompareValue = function (startControlId, endControlId, errorMessage, isEqualAllowed) {
        if ($("#" + startControlId).val() != "" && $("#" + endControlId).val()) {
            var startValue = $("#" + startControlId).val();
            var endValue = $("#" + endControlId).val();
            if (isEqualAllowed == undefined || isEqualAllowed == null)
                isEqualAllowed = false;
            if (isEqualAllowed == false) {
                if (parseFloat(startValue) >= parseFloat(endValue)) {
                    alert((errorMessage == undefined ? "End Value should be greater than Start Value." : errorMessage));
                    if (!($("[id^='" + startControlId + "']").attr("readonly") != undefined && $("[id^='" + startControlId + "']").attr("readonly") == "readonly")) {
                        $("[id$='" + startControlId + "']").val("");
                    }
                    if (!($("[id^='" + endControlId + "']").attr("readonly") != undefined && $("[id^='" + endControlId + "']").attr("readonly") == "readonly")) {
                        $("[id$='" + endControlId + "']").val("");
                    }
                }
            }
            else {
                if (parseFloat(startValue) > parseFloat(endValue)) {
                    alert((errorMessage == undefined ? "End Value should be greater than Start Value." : errorMessage));
                    if (!($("[id^='" + startControlId + "']").attr("readonly") != undefined && $("[id^='" + startControlId + "']").attr("readonly") == "readonly")) {
                        $("[id$='" + startControlId + "']").val("");
                    }
                    if (!($("[id^='" + endControlId + "']").attr("readonly") != undefined && $("[id^='" + endControlId + "']").attr("readonly") == "readonly")) {
                        $("[id$='" + endControlId + "']").val("");
                    }
                }
            }
        }
    }

    this.ReturnNewTime = function (timeValue, minuteToAdd) {
        if (timeValue != undefined && timeValue != "" && minuteToAdd != undefined && minuteToAdd != "") {
            var timeArray = timeValue.split(':');
            var oldHour = parseFloat(timeArray[0]);
            var oldMinute = parseFloat(timeArray[1]);
            var minAdd = minuteToAdd % 60;
            var hourAdd = Math.floor(minuteToAdd / 60);
            var newHour = oldHour + (hourAdd % 24);
            var newMinute = oldMinute + minAdd;
            if (newMinute > 59) {
                newMinute = newMinute - 60;
                newHour = newHour + 1;
            }
            if (newHour > 23) {
                newHour = (newHour - 24);
            }
            return (newHour < 10 ? "0" + newHour.toString() : newHour.toString()) + ":" + (newMinute < 10 ? "0" + newMinute.toString() : newMinute.toString());
        }
        else
            return "";
    }

    this.ReturnNewDateTime = function (time1, time2) {
        var time1_hr = "";
        var time1_min = "";
        var time2_hr = "";
        var time2_min = "";
        var total_hrtime = "";
        var total_mintime = "";
        var generated_Hour = 0;
        time1_hr = time1.split(":")[0];
        time1_min = time1.split(":")[1];
        time2_hr = time2.split(":")[0];
        time2_min = time2.split(":")[1];

        total_hrtime = 1 * time1_hr + 1 * time2_hr;

        total_mintime = 1 * time1_min + 1 * time2_min;

        if (total_mintime >= 60) {
            total_mintime = total_mintime - 60;
            total_hrtime = total_hrtime + 1;
        }

        if (total_hrtime >= 24) {
            total_hrtime = total_hrtime - 24;
            if (total_hrtime < 10)
                total_hrtime = "0" + total_hrtime;

        }

        return total_hrtime + ":" + total_mintime;
    }

    this.GetAutoCompleteDataSource = function (cntrlId) {
        return $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoAutoComplete");
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
            kendoAutoCompleteWC.options.filter = ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)),
            kendoAutoCompleteWC.options.filterField = (basedOn == undefined ? kendoAutoCompleteWC.options.filterField : basedOn);
            kendoAutoCompleteWC.options.addOnFunction = (addOnFunction == undefined ? null : addOnFunction);
            kendoAutoCompleteWC.setAddOnFunction(cntrlId)
        }
    }

    this.SetAutoCompleteOptions = function (cntrlId, newDataSourceName, clearAllValue) {
        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoAutoComplete");
        if (kendoAutoCompleteWC != undefined) {
            if (clearAllValue) {
                kendoAutoCompleteWC.setDefaultValue("", "");
                $("#Text_" + cntrlId).val("");
                $("#" + cntrlId).val("");
            }
            kendoAutoCompleteWC.setDataSource(newDataSourceName);

        }
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

    this.EnableAutoComplete = function (cntrlId, enable, clearAllValue, bgcolor) {
        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoAutoComplete");
        if (kendoAutoCompleteWC != undefined) {
            $("input[type='text'][name='Text_" + cntrlId + "']").css({ "background-color": bgcolor });
            kendoAutoCompleteWC.enable(enable);
            if (clearAllValue) {
                kendoAutoCompleteWC.setDefaultValue("", "");
                $("#Text_" + cntrlId).val("");
                $("#" + cntrlId).val("");
            }
        }
    }

    this.ResetAutoComplete = function (cntrlId) {
        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoAutoComplete");
        if (kendoAutoCompleteWC != undefined) {
            kendoAutoCompleteWC.setDefaultValue("", "");
            $("#Text_" + cntrlId).val("");
            $("#" + cntrlId).val("");
        }
    }

    this.ResetMultiAutoComplete = function (cntrlId) {
        $("#Text_" + cntrlId).val("");
        $("#" + cntrlId).val("");
        $("#Multi_" + cntrlId).val("");
        $("#FieldKeyValues" + cntrlId).text("");
        $("#divMulti" + cntrlId).find("li:gt(0)").remove();

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

    this.ClosePopUp = function (cntrlId) {
        var window = $("#" + cntrlId);
        window.data("kendoWindow").close();
        return false;
    }

    this.ToWCFDate = function (value) {
        var dtArr = value.split("/");
        var dt = new Date(dtArr[2], --dtArr[0], dtArr[1]);
        var date = '\/Date(' + dt.getTime() + '+0000)\/';
        return date;
    }

    this.ArrowMessage = function (obj, message) {
        if (message == undefined || message == "")
            message = "Please Select";
        $(obj).append("<div style='float:right;display:block;cursor: pointer;' title='" + message + "' id='dvArrowMessage' onclick='$(this).hide();'><table><tr><td><img src='images/arrow.png' height='20px'></td><td style='color:red;font-size:11px;'>" + message + "</td></tr></table></div>").attr("title", "");
        setTimeout(function () { $(obj).find("#dvArrowMessage").fadeOut("slow") }, 5000);
    }

    this.CfiDate = function (cntrl) {
        var cfiDate = $("#" + cntrl).data("kendoDatePicker");
        return cfiDate != undefined ? (cfiDate.sqlDateValue() == null ? "" : cfiDate.sqlDateValue()) : $("#" + cntrl).val();
    }
    //this.CfiDate = function (cntrl) {
    //    var cfiDate = $("#" + cntrl).data("kendoDatePicker");
    //    return cfiDate != undefined ? (cfiDate.sqlDateValue() == null ? "" : $("#" + cntrl).attr("sqldatevalue")) : $("#" + cntrl).val();
    //}

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
    this.makeTrans = function (containerId, linkText, isReset, addEventCallBack, removeEventCallBack, beforeAddEventCallback, data, maxCount) {
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
            maxItemsAllowedToAdd: maxCount
        });
    }
}


GetDataSource = function (textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? url : serviceurl + newUrl),
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

ExtraCondition = function (textId) {
    var filter = { logic: "AND", filters: [] };
    return filter;
}

checkProgrss = function (item, subprocess, displaycaption) {
}

BindEvents = function (obj, e, isdblclick) {

}

onChange = function (obj) {

}

AutoCompleteTemplate = function (textId) {

}

var cfi = new CargoFlashApplication();

function ChangeAllControlToLable(containerID) {
    //    $("input[type!='button']", $("#" + containerID)).attr("disabled", "disabled");

    //    $("input[type='button'][buttontype!='MoveToTab1']", $("#" + containerID)).each(function () {
    //        if ($(this).hasClass("buttonRegular")) {
    //            $(this).removeClass("buttonRegular");
    //        }
    //    });
    //    $("input[type='submit']", $("#" + containerID)).each(function () {
    //        if ($(this).hasClass("buttonRegular")) {
    //            $(this).css("display", "none");
    //        }
    //    });
    //    $("input[type='button'][value != 'Cancel'][buttontype!='MoveToTab1']", $("#" + containerID)).hide();
    $("input[type='text']", $("#" + containerID)).each(function () {
        if ($(this).attr("controltype") == "datetype")
            $(this).replaceWith("<span style='" + $(this).attr("style") + "'>" + $(this).val() + "</span>");
    });
    //    $("textarea", $("#" + containerID)).each(function () {
    //        $(this).replaceWith("<span style='" + $(this).attr("style") + "'>" + $(this).val() + "</span>");
    //    });
    //    $("select", $("#" + containerID)).attr("disabled", true);
    //    //    $("input[type='text']", $("#" + containerID)).each(function () {
    //    //        if ($(this).hasClass("datepicker")) {
    //    //            $(this).removeClass("datepicker");
    //    //        }
    //    //        $(this).replaceWith("<span style='" + $(this).attr("style") + "'>" + $(this).val() + "</span>");
    //    //    });

    //    $("input[type='radio']", $("#" + containerID)).each(function () {
    //        var id = $(this).attr("id");
    //        if ($(this).attr("checked") != true) {
    //            $(this).css("display", "none");
    //            $("label[for='" + id + "']").css("display", "none");
    //        }
    //        else {
    //            if ($(this).attr("disabled") == true) {
    //                $(this).css("display", "none");
    //            }
    //            if ($("label[for='" + id + "']").length == 0 && !$(this).hasClass("alreadyChecked")) {
    //                $(this).replaceWith("<img src='../images/CheckBoxChecked.gif' height='13' width='13'/>");
    //            }
    //            else {
    //                $("label[for='" + id + "']").replaceWith("<img src='../images/CheckBoxChecked.gif' height='13' width='13'/><b>" + $("label[for='" + id + "']").text() + "</b>");
    //            }
    //            $(this).addClass("alreadyChecked");
    //        }
    //    });
    //    $("select", $("#" + containerID)).each(function () {
    //        $(this).replaceWith("<span style='" + $(this).attr("style") + "'>" + ($(this).find("option").length == 0 ? "N/A" : (this.options[this.selectedIndex].value == "" ? "N/A" : this.options[this.selectedIndex].text)) + "</span>");
    //    });

}

function SetDateRangeValue(containerId, defaultBlankControlId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var startControl = $(this).attr("startControl");
            var endControl = $(this).attr("endControl");
            var cntrlId = $(this).attr("id");
            if (startControl != undefined && startControl == cntrlId && defaultBlankControlId != endControl) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                start.max(end.value());
            }
            if (endControl != undefined && endControl == cntrlId && defaultBlankControlId != startControl) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                end.min(start.value());
            }
            if (defaultBlankControlId != undefined) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                if (defaultBlankControlId == endControl) {
                    start.max(new Date(2099, 11, 31));
                }
                else if (defaultBlankControlId == startControl) {
                    end.min(new Date(2013, 0, 31));
                }
            }
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var startControl = $(this).attr("startControl");
            var endControl = $(this).attr("endControl");
            var cntrlId = $(this).attr("id");
            if (startControl != undefined && startControl == cntrlId && defaultBlankControlId != endControl) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                start.max(end.value());
            }
            if (endControl != undefined && endControl == cntrlId && defaultBlankControlId != startControl) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                end.min(start.value());
            }
            if (defaultBlankControlId != undefined) {
                var start = $("#" + startControl).data("kendoDatePicker");
                var end = $("#" + endControl).data("kendoDatePicker");
                if (defaultBlankControlId == endControl) {
                    start.max(new Date(2099, 11, 31));
                }
                else if (defaultBlankControlId == startControl) {
                    end.min(new Date(2013, 0, 31));
                }
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
        startDate.setDate(startDate.getDate());
        end.min(startDate);
    }
    else {
        end.min(new Date(2013, 0, 31));
        start.dateView.toggle();
    }
    AddOnChange(that);
}

function endChange(that) {
    var start = $("#" + that.sender.options.startControlId).data("kendoDatePicker");
    var end = $("#" + that.sender.options.endControlId).data("kendoDatePicker");
    var endDate = end.value();

    if (endDate) {
        endDate = new Date(endDate);
        endDate.setDate(endDate.getDate());
        start.max(endDate);
    }
    else {
        start.max(new Date(2099, 11, 31));
        end.dateView.toggle();
    }
    AddOnChange(that);
}

function preventPost(obj) {
    $("#" + obj).find("input[type='text']").keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    });
}

function AddOnChange(that) {
    if (that.sender.options.addOnChange !== null) {
        if (typeof window[that.sender.options.addOnChange] === "function")
            window[that.sender.options.addOnChange](that.sender.element.attr("id"));
    }
}

function ConvertControlToCulture(obj) {
    if (obj == undefined) {
        $("#" + formid).find("span").each(function () {
            var attr = $(this).attr('controltype');


            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                if (this.innerHTML.toLowerCase().indexOf("rp") < 0) {
                    var controlId = $(this).attr("id");

                    var decimalPosition = cfi.IsValidSpanNumeric(controlId);
                    if (decimalPosition >= -1) {
                        //            $(this).css("text-align", "right");
                        cfi.Numeric(controlId, decimalPosition, true);
                    }
                }
            }
        });
        $("#" + formid).find("input[type='text']").each(function () {
            var attr = $(this).attr('controltype');


            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                if (this.innerHTML.toLowerCase().indexOf("rp") < 0) {
                    var controlId = $(this).attr("id");

                    var decimalPosition = cfi.IsValidNumeric(controlId);
                    if (decimalPosition >= -1) {
                        //            $(this).css("text-align", "right");
                        cfi.Numeric(controlId, decimalPosition);
                    }
                }
            }
        });
    }
    else {
        $("#" + obj).find("span").each(function () {
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
            }
        });
        $("#" + obj).find("input[type='text']").each(function () {
            var attr = $(this).attr('controltype');

            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                var controlId = $(this).attr("id");

                var decimalPosition = cfi.IsValidNumeric(controlId);
                if (decimalPosition >= -1) {
                    //            $(this).css("text-align", "right");
                    cfi.Numeric(controlId, decimalPosition);
                }
            }
        });
    }
}

function getQueryStringValue(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else {
        var str = decodeURIComponent(results[1].replace(/\+/g, " "));
        if (str.toUpperCase() == "STT ADJUSTMENT")
            return "EDIT";
        else
            return str;
    }
}

function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

function test123(obj) {

}

function ShowValidationErrorMessage(htmlText) {

    if (htmlText != "") {
        if ($('#divValidationMessage').length > 0) {
            // $('#divValidationMessage').css("display", "block");
            $('#divValidationMessage').fadeIn('slow');
            $('#divValidationMessage').html(htmlText);
        }

        else if ($('.validation-summary-errors').length > 0) {
            $('.validation-summary-errors').fadeIn("slow");
            $('.validation-summary-errors').html(htmlText);
        }
        else
            $('#divValidationMessage').css("display", "none");




        $('#divValidationMessage').click(function () {
            $('#divValidationMessage').fadeOut('slow', function () {
                // Animation complete
            });
        });
    }
}

function ShowMessage(msgType, title, htmlText, position, width, logout) {

    if (htmlText != "") {
        CallMessageBox(msgType, title, htmlText, position, undefined, undefined, undefined, width, logout);
    }
}

///MessageBox
function CallMessageBox(msgType, title, msg, position, fadeInTime, fadeOutTime, timeout, width, logout) {

    if (fadeInTime == undefined)
        fadeInTime = 300;
    if (fadeOutTime == undefined)
        fadeOutTime = 1000;
    if (timeout == undefined)
        timeout = 6000;
    if (width == undefined)
        width = "300px";
    if (position == undefined)
        position = "cfMessage-top-right";
    else
        position = "cfMessage-" + position.toLowerCase();
    InvokeMsg.options = {
        "debug": false,
        "positionClass": position,
        "onclick": null,
        "fadeIn": fadeInTime,
        "fadeOut": fadeOutTime,
        "timeOut": timeout,
        "width": width,
        "logout": logout

    }
    InvokeMsg[msgType](msg, title)

}

function addToolBar() {
    //$('.k-grid-content').find("tr").each(function () {

    //    //Selecting Grid
    //    var gview = $("#grid").data("kendoExcelGrid");
    //    //Getting selected item
    //    //        var selectedItem = gview.dataItem(gview.select());
    //    //        //accessing selected rows data 
    //    //        alert(selectedItem.email);
    //    $(this).unbind("click").bind("click", function () {
    //        //$(".k-grid").data("kendoExcelGrid").dataItem($(".k-grid").data("kendoExcelGrid").select()).idField
    //        var recId = $(this).find("input[type='radio']").val();
    //        if (!(recId == undefined || recId == "")) {
    //            $(this).find("input[type='radio']").attr("checked", true);
    //            $(this).toolbar({ content: '#user-options', position: 'top', recId: recId });
    //        }
    //    });
    //});
}

function SetErrorVariable(valueToSetTo) {
    $("input[type='hidden'][id$='__SessionErrorMsg__']").val(valueToSetTo);
}

function SetSuccessVariable(valueToSetTo) {
    $("input[type='hidden'][id$='__SessionSuccessMsg__']").val(valueToSetTo);
}

function StartProgress() {
    $.blockUI({
        message: '<b style=" vertical-align:middle;text-align:center; font-size:12pt;color:red;">Please Wait........</b>',
        css: {
            color: '#fff',
            border: '3px solid Transparent',
            backgroundColor: 'Transparent',
            cursor: 'default'
        }
    });
    $("input[type='hidden'][data-role='kendoAutoComplete']").each(function () {
        if ($("#Text_" + this.id).data(this.attributes["data-role"].nodeValue)._key != "")
            $(this).val($("#Text_" + this.id).data(this.attributes["data-role"].nodeValue)._key);
        else if (this.value != "")
            $("#Text_" + this.id).data(this.attributes["data-role"].nodeValue)._key = this.value;
    })
}

function StopProgress() {
    $.unblockUI();

}

function UpdateTableHeaders() {
    $("#aspnetForm").each(function () {

        var el = $(this),
               offset = el.offset(),
               scrollTop = $(window).scrollTop(),
               floatingHeader = $(".floatingHeader", this),
               height = $(".WebFormHeaderTable:eq(0)").find("tr:eq(0)").height()

        if ((scrollTop > offset.top + height) && (scrollTop < offset.top + height + el.height())) {
            floatingHeader.css({
                "visibility": "visible"
            });
        } else {
            floatingHeader.css({
                "visibility": "hidden"
            });
        };
    });
}

//DOM Ready
$(function () {

    var clonedHeaderRow;

    $(".persist-area").each(function () {
        clonedHeaderRow = $(".persist-header", this);
        clonedHeaderRow
             .before(clonedHeaderRow.clone())
             .css("width", clonedHeaderRow.width())
        //             .css("top", $("#tdFormHeader:eq(0)").css("height"))
             .addClass("floatingHeader");
        clonedHeaderRow.find(".persist-div").css("width", clonedHeaderRow.width())
        clonedHeaderRow.find("input[type='hidden'][name='operation']").removeAttr("name");
        clonedHeaderRow.find("div[id='divRemoveRecord']").remove();

    });

    $(window)
        .scroll(UpdateTableHeaders)
        .trigger("scroll");

});
function MarkUnMarkAll(obj) {
    var parentGrid = $(obj).closest("[data-role='excelgrid']");
    $(parentGrid).find("input[type='checkbox']").attr("checked", obj.checked);
}

function IsMarkUnMarkAll(obj) {
    var parentGrid = $(obj).closest("[data-role='excelgrid']");
    $(parentGrid).find(".k-grid-header").find("input[type='checkbox']").attr("checked", ($(parentGrid).find(".k-grid-content").find("input[type='checkbox']").not(':checked').length == 0));
}

function NestedCheckAll(obj) {
    var parentGrid = $(obj).closest("[data-role='grid']");
    $(parentGrid).find("input[type='checkbox']").attr("checked", obj.checked);
}

function TOPNestedCheckAll(obj) {
    var parentGrid = $(obj).closest("[data-role='grid']");
    $(parentGrid).find(".k-grid-header").find("input[type='checkbox']").attr("checked", ($(parentGrid).find(".k-grid-content").find("input[type='checkbox']").not(':checked').length == 0));
}

function AttachEvents() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).find("a").unbind("click").bind("click", function (e) {
            BindEvents(this, e);
        });
        $(this).find("input[type='button']").unbind("click").bind("click", function (e) {
            BindEvents(this, e);
        });
        $(this).find("input[type='button']").unbind("dblclick").bind("dblclick", function (e) {
            BindEvents(this, e, true);
        });
    });
}


//Added by Amit Yadav
$(document).ajaxSend(function (evt, request, settings) {
    $("#divLoading").centerScreen().show();
});

$(document).ajaxComplete(function (event, request, settings) {
    $("#divLoading").hide();
});


$(document).ajaxError(function (event, request, settings, thrownError) {
    AjaxErrorevent = event;
    AjaxErrorrequest = request;
    AjaxErrorsettings = settings;
    AjaxErrorthrownError = thrownError;
    setTimeout(function () { CheckSession() }, 500);

});

function OpenLoginWindow() {
    $("#txtReUserId").text(userContext.UserName);
    $("#divDialogSession").dialog({
        title: 'Your current session has expired. Kindly login again to continue.',
        modal: true,
        draggable: false,
        resizable: false,
        position: 'top',
        width: 400,
        buttons: [
                   {
                       text: "Login",
                       click: function () {
                           $.ajax({
                               type: "GET",
                               contentType: "application/json; charset=utf-8",
                               dataType: "json",
                               //url: "Services/CommonService.svc/ReLogin?userId=" + $("#txtReUserId").text() + "&password=" + $("#txtRePassword").val(),
                               url: "Services/CommonService.svc/ReLogin?userId=" + $("#txtReUserId").text() + "&password=" + $("#txtRePassword").val() + "&UserSNo=",
                               success: function (response) {
                                   if (response == false)
                                       ShowMessage("error", "", "Invalid UserID or Password");
                                   else {
                                       $("#divDialogSession").dialog("close");
                                   }
                               }, error: function () {
                                   location.href = 'Account/GarudaLogin.cshtml?islogout=true';
                               }
                           });

                       }
                   }]

    });
}
function CheckSession() {
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/CommonService.svc/CheckSession",
        success: function (response) {
            if (response.CheckSessionResult == true) {
                OpenLoginWindow();

            } else {
                ShowMessage("error", "System is busy at the moment. Kindly try again after some time.");
                setTimeout(function () { InsertAjaxRequestError() }, 500);
            }
        }, error: function () {
            location.href = 'Account/GarudaLogin.cshtml?islogout=true';
        }
    });
}
var AjaxErrorevent;
var AjaxErrorrequest;
var AjaxErrorsettings;
var AjaxErrorthrownError;
function InsertAjaxRequestError() {
    var ajaxRequestError = { URL: AjaxErrorevent.target.URL, status: AjaxErrorrequest.status, statusText: AjaxErrorrequest.statusText, responseText: $(AjaxErrorrequest.responseText).filter("#content").html(), RequestUrl: AjaxErrorsettings.url, PageURL: window.location.href, module: getQueryStringValue("Module"), Apps: getQueryStringValue("Apps") };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/CommonService.svc/InsertAjaxRequestError",
        data: JSON.stringify(ajaxRequestError),
        success: function (response) {

        }, error: function () {
            location.href = 'Account/GarudaLogin.cshtml?islogout=true';
        }
    });
}

function getCook(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
    // Return everything after the equal sign
    return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}



$(document).ready(function () {

    $("#" + formid).find("table#fixme:eq(0)").addClass("floatcss").append("<tr><td style='width:100%'>&nbsp;</td></tr>");
    $("#" + formid).find("input[type='text']").each(function () {
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
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("#" + formid).find("textarea").each(function () {
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
    $("#" + formid).find("span").each(function () {
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
    //ValidateSection
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });
    $("input[name='operation']").click(function () {
        _callBack();
    });
    $("[id$='divRemoveRecord']").hide();
    $("input[name='operation']").click(function () {
        if (cfi.IsValidSubmitSection()) {
            var res = false;
            $.ajax({
                type: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "Services/CommonService.svc/CheckSession",
                success: function (response) {
                    if (response.CheckSessionResult == true) {
                        OpenLoginWindow();
                        res = false;
                    } else {
                        res = true;
                    }
                }, error: function () {
                    location.href = 'Account/GarudaLogin.cshtml?islogout=true';
                }
            });
            return res;
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
    userContext = JSON.parse($("#hdnUserContext", parent.document).val());
});

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
                    cfi.DateType(controlId);
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

    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        if ($(this).attr("recname") == undefined) {
            var controlId = $(this).attr("id");
            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
        }
    });
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
    $("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
        var transid = this.id.replace("divareaTrans_", "");
        cfi.makeTrans(transid, null, null, null, null, null, null);
    });
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //    ChangeAllControlToLable("aspnetForm");
}

function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
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
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
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
    $("table[cfi-aria-search='search']").find("span").each(function () {
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

    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    });
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

$(document).ready(function () {
    try {
        //debugger;
        //$("#globe-menu").text(" " + _CityCode_);
        //$("#person-menu").text(" " + _UserName_);
        //$("#currency-menu").text(" " + _Currency_);
        //$("#group-menu").text(" " + _LoginType_);
        $("#globe-menu").find("i").text(" " + _CityCode_);
        $("#person-menu").find("i").text(" " + _UserName_);
        $("#currency-menu").find("i").text(" " + _Currency_);
        $("#group-menu").find("i").text(" " + _LoginType_);
    }
    catch (ex) {

    }
});

$(document).ready(function () {
    //    var datalist = "{\"Waybill\" : [{\"SNo\":\"291\",\"Origin\":\"PSJ-POSO\",\"Destination\":\"CGK-JAKARTA\"},{\"SNo\":\"291\",\"Origin\":\"PSJ-POSO\",\"Destination\":\"CGK-JAKARTA\"}],\"Waybill1\" : [{\"SNo\":\"291\",\"Origin\":\"PSJ-POSO\",\"Destination\":\"CGK-JAKARTA\"},{\"SNo\":\"291\",\"Origin\":\"PSJ-POSO\",\"Destination\":\"CGK-JAKARTA\"}]}"
    //    $("[id='areaTrans_Shipment_Dimensions']").EnableMultiField({
    //        data: jQuery.parseJSON(datalist)
    //    });
});
//}
//e.g.  
//cfi.ChangeAutoCompleteDataSource("ToCitySNo", ScheduleType);
//cfi.EnableAutoComplete("ToCitySNo", false);
//var alphabettypes = [{ Key: "0", Text: "+" }, { Key: "1", Text: "-" }, { Key: "2", Text: "*" }, { Key: "3", Text: "%" }];
//cfi.AutoCompleteByDataSource("ToCitySNo", alphabettypes);
//cfi.makeTrans(transid, null, null, null, null, null, null);