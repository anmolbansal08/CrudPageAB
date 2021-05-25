/// <reference path="Kendo/kendo.web.js" />

var attrType = "controltype";
var dateType = "datetype";
var otherType = "OtherType";
var autoCompleteType = "autocomplete";
var autoCompleteText = "Text";
var autoCompleteKey = "Key";
var formid = "aspnetForm";
var formCulture = "en-EN"; 
var cons = "abc";
var wndError, wndSuccess;

//START AUTO COMPLETE DATA SOURCE SECTION
var xorKey = 83;
var CustomerType = [{ Key: "0", Text: "B2B" }, { Key: "1", Text: "B2C"}];
var ApplicableFor = [{ Key: "1", Text: "SHIPPER" }, { Key: "2", Text: " CONSIGNEE" }, { Key: "3", Text: " BOTH"}];
var NeededAt = [{ Key: "1", Text: "ORIGIN" }, { Key: "2", Text: "DESTINATION" }, { Key: "3", Text: "TRANSIT" }, { Key: "4", Text: "ORIGIN AND DESTINATION BOTH"}];
var UsageType = [{ Key: "1", Text: "INBOUND" }, { Key: "2", Text: " OUTBOUND"}];
var PrefixType = [{ Key: "0", Text: "+" }, { Key: "1", Text: "-"}];
var AmountType = [{ Key: "0", Text: "PERCENTAGE" }, { Key: "1", Text: "PER KG" }, { Key: "2", Text: "FLAT"}];
var ValueType = [{ Key: "1", Text: "SHIPMENT DECLARED VALUE" }, { Key: "4", Text: "PER UNIT"}];
var UploadType = [{ Key: "0", Text: "TARIFF" }, { Key: "1", Text: "CITY" }, { Key: "2", Text: "REGION LOCATION ZIPCODE" }, { Key: "3", Text: "COMMODITY" }, { Key: "4", Text: "TARIFF DISCOUNTING" }, { Key: "5", Text: "CONSOLIDATOR FEE" }, { Key: "6", Text: "FORWARD RATE" }, { Key: "7", Text: "FORWARD RATE DISCOUNTING" }, { Key: "8", Text: "FORWARD COST"}];
//var ScheduleType = [{ Key: "1", Text: "POS" }, { Key: "2", Text: "CUSTOMER"}];
var ScheduleType = [{ Key: "1", Text: "POS" }, { Key: "3", Text: "CUSTOMER"}];

var STTType = [{ Key: "1", Text: "DELIVERED" }, { Key: "2", Text: " UN-DELIVERED" }, { Key: "3", Text: " BOTH"}];

var PeriodType = [{ Key: "1", Text: "WEEKLY" }, { Key: "2", Text: "QUARTERLY" }, { Key: "3", Text: "MONTHLY" }, { Key: "4", Text: "YEARLY"}];
var TopUpType = [{ Key: "1", Text: "MANUAL" }, { Key: "2", Text: " AUTOMATIC" }, { Key: "3", Text: " BOTH"}];

var FlightDetail = [{ Key: "", Text: ""}];
var __TRUE = "True";
var __FALSE = "False";
var __B2B = 5;
var __CONS = 6;
var __DROPBOX = 7;
var __POS = 8;
var __ADMIN = "ADMIN";

kendo.culture(formCulture);
//kendo.culture("in-IN");
//END AUTO COMPLETE DATA SOURCE SECTION

function navigateUrl(currenturl, messageValue) {
    window.location.href = currenturl + ((messageValue!=undefined && messageValue!="") ? ("&HV=" + messageValue) : "");
}
//-----  added by Anand  ----------------------------------
function isEmpty(value) {
    return typeof (value) == 'undefined' || value == null || value == '';
}
//Numeric
function checkNumeric(id) {
    if (!$.isNumeric($('#' + id).val()) || $('#' + id).val() == '') {
        $('#' + id).val(id == 'txtPageNo' ? '1' : '0');
        $('#' + id).focus();
        ShowMessage('warning', 'Need your Kind Attention!', 'Enter only numbers.');
        //$('#' + id).css({
        //    "border": "1px solid red",
        //    "background": "#FFCECE"
        //});
        return false;
    }
    else
        //$('#' + id).css({
        //    "border": "",
        //    "background": ""
        //});
        return true;
}
function checkNumericValueGreaterThanZero(id)
{
    if (checkNumeric(id)) {
        if ($('#' + id).val() < 1) {
            $('#' + id).val('');
            ShowMessage('warning', 'Need your Kind Attention!', 'Please enter more than 0.');
            return false
        }
        else {
            return true;
        }
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
    var emailaddress = $("#" + currObject).val();
    var emailexp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (emailaddress == '') {
        ShowMessage('error', 'Need your Kind Attention!', 'Please enter email.');
        //alert('Please enter email.');
        $("#" + currObject).focus();
        return false;
    }
    else if (!emailexp.test(emailaddress)) {
        ShowMessage('error', 'Need your Kind Attention!', 'Please enter valid email address.');
        //alert('Please enter valid email address.');
        $("#" + currObject).focus();
        return false;
    }
    else {
        return true;
    }

}
// AWB Number format check
function CheckAWBNumberFormat(id, isCourier) {
    try {
        var awbNumber = $("#" + id).val();
        if (awbNumber == "") {
            return false;
        }
        if (isCourier == "0") {
            if (awbNumber.length != 12) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
                //alert("Invalid AWB Number", 'Message');
                awbNumber = "";
                //$("#" + id).focus();
                return false;
            }
            else if (awbNumber.indexOf("-") != 3) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
               // alert("Invalid AWB Number", 'Message');
                awbNumber = "";
                //$("#" + id).focus();
                return false;
            }
            else if (awbNumber.split("-")[1].substring(0, 7) % 7 != awbNumber.split("-")[1].substring(7, 8)) {
                ShowMessage('warning', 'Need your Kind Attention!', "Invalid AWB Number.The Correct series is : " + (awbNumber.split("-")[1].substring(0, 7) % 7));
                //alert("Invalid AWB Number.The Correct series is : " + (awbNumber.split("-")[1].substring(0, 7) % 7), 'Message');
                awbNumber = "";
                //$("#" + id).focus();
                return true;
            }
            else
                return true;
        }
    }
    catch (e) { }
}
function CargoFlashApplication() {
    var dateType = "datetype";
    var otherType = "OtherType";
    var autoCompleteType = "autocomplete";
    var attrType = "controltype";

    var numbertype = [{ key: "range", value: "-1" }, { key: "number", value: "0" }, { key: "decimal1", value: "1" }, { key: "decimal2", value: "2" }, { key: "decimal3", value: "3" }, { key: "decimal4", value: "4" }, { key: "decimal5", value: "5"}];

    var trnsformtype = [{ key: "datetype", value: "datetype" }, { key: "time", value: "none" }, { key: "ip", value: "none" }, { key: "contact", value: "none" }, { key: "default", value: "none" }, { key: "uppercase", value: "uppercase" }, { key: "lowercase", value: "lowercase" }, { key: "sentencecase", value: "capitalize" }, { key: "alphanumericupper", value: "uppercase" }, { key: "alphanumericlower", value: "lowercase" }, { key: "alphanumeric", value: "none" }, { key: "alphabet", value: "none" }, { key: "editor", value: "editor"}];

    var alphabettype = [{ key: "time", value: "time" }, { key: "ip", value: "ip" }, { key: "contact", value: "contact" }, { key: "default", value: "default" }, { key: "uppercase", value: "alphabet" }, { key: "lowercase", value: "alphabet" }, { key: "alphabet", value: "alphabet" }, { key: "alphanumericupper", value: "alphanumeric" }, { key: "alphanumericlower", value: "alphanumeric" }, { key: "alphanumeric", value: "alphanumeric"}];

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
                value: 10,
                min: minValue,
                max: maxValue,
                step: 1,
                format: (subtype == "weight" ? "#.00 kg" : (subtype == "currency" ? "c" : "n") + decimalPos),
                decimals: decimalPos,
                width: widthset,
                wrap: true,
                allowround: (allowround != undefined ? allowround : true)
            });
        }
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

    this.AutoCompleteByDataSource = function (textId, dataSourceName, addOnFunction) {
        var keyId = textId;
        textId = "Text_" + textId;

        if (IsValid(textId, autoCompleteType)) {
            basedOn = autoCompleteText;
            var dataSource = dataSourceName;
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: "startswith",
                dataSource: dataSource,
                filterField: basedOn,
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction)
            });
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
            var dataSource = GetDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (templateColumn == undefined || templateColumn == null ?( (filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
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

    this.PopUp = function (cntrlId, title, width) {
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
                close: function () {
                    window.data("kendoWindow").open();
                    window.hide();
                    popUpWindow.hide();
                }
            });
        }
        else {
            window.data("kendoWindow").open();
        }

        window.show();
        popUpWindow.show();
        $(document).bind("keydown", function (e) {
            if (e.keyCode == kendo.keys.ESC) {
                var visibleWindow = $(".k-window:visible > .k-window-content");
                if (visibleWindow.length)
                    visibleWindow.data("kendoWindow").close();
            }
        });
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
            });
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
                    ShowMessage('error', 'Need your Kind Attention!', (errorMessage == undefined ? "End Value should be greater than Start Value." : errorMessage));
                    //alert((errorMessage == undefined ? "End Value should be greater than Start Value." : errorMessage));
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
                    ShowMessage('error', 'Need your Kind Attention!', (errorMessage == undefined ? "End Value should be greater than Start Value." : errorMessage));
                    //alert();
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

    this.ChangeAutoCompleteDataSource = function (cntrlId, newDataSourceName, clearAllValue) {
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
                $("#Text_" + cntrlId).val("");
                $("#" + cntrlId).val("");
            }
        }
    }

    this.ResetAutoComplete = function (cntrlId) {
        $("#Text_" + cntrlId).val("");
        $("#" + cntrlId).val("");
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

ExtraCondition = function (textId) {
    if (textId == "Text_loginAirport") {
        var filterRegion = getFilter("AND");
        setFilter(filterRegion, "CitySNo", "eq", $("#Text_logincity").data("kendoAutoComplete").key());
        setFilter(filterRegion, "IsActive", "eq", 1);
      
        var RegionAutoCompleteFilter = autoCompleteFilter(filterRegion);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_loginWarehouse") {
        var filterRegion = getFilter("AND");
        setFilter(filterRegion, "AirportSNo", "eq", $("#Text_loginAirport").data("kendoAutoComplete").key());
        setFilter(filterRegion, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = autoCompleteFilter(filterRegion);
        return RegionAutoCompleteFilter;
    }
    else {
        var filter = { logic: "AND", filters: [] };
        return filter;
    }
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
    $('.k-grid-content').find("tr").each(function () {

        //Selecting Grid
        var gview = $("#grid").data("kendoExcelGrid");
        //Getting selected item
//        var selectedItem = gview.dataItem(gview.select());
//        //accessing selected rows data 
//        alert(selectedItem.email);
        $(this).unbind("click").bind("click", function () {
            //$(".k-grid").data("kendoExcelGrid").dataItem($(".k-grid").data("kendoExcelGrid").select()).idField
            var recId = $(this).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(this).toolbar({ content: '#user-options', position: 'top', recId: recId });
            }
        });
    });
}

function SetErrorVariable(valueToSetTo) {
    $("input[type='hidden'][id$='__SessionErrorMsg__']").val(valueToSetTo);
}

function SetSuccessVariable(valueToSetTo) {
    $("input[type='hidden'][id$='__SessionSuccessMsg__']").val(valueToSetTo);
}

function StartProgress() {
    $.blockUI({ message: '<b style=" vertical-align:middle;text-align:center; font-size:12pt;color:red;">Please Wait........</b>',
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

$(document).ready(function () {

    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
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
    cfi.ValidateSubmitSection();
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
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //    ChangeAllControlToLable("aspnetForm");
});
$(document).ready(function () {
    $("#ApplicationTabs").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });

    shortcut.add("Ctrl+S", function () {
        $("input[name='operation']").trigger("click");
    });
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


//Added By Karan for Multilanguage Converter 

function getLanguageDetail(text,languageCode)
{
    var languageval = '';
    $.ajax({
        type: "POST",
        async: false,
        cache: false,
        url: "./MultiLanguage.ashx",
        data: { textVal: text, LanguageCode:(languageCode==undefined||languageCode==null?'':languageCode) },
        dataType: "json",
        success: function (data) {

            if (data != null && data != '') {

                 languageval = data.d;
            }


        }

    });

    return languageval;
}

///-----------------------