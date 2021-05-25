// <copyright file="Commmon.Js" company="Cargoflash">
//
// Created On: 4-Feb-2017
// Created By: Braj
// Description: Common
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
//
//</copyright>


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

var InvoicingCycleTypeAA = [{ Key: "-1", Text: "ALL" }, { Key: "0", Text: "Cash Airline" }, { Key: "1", Text: "7 Days" }, { Key: "2", Text: "10 Days" }, { Key: "3", Text: "Fortnightly" }, { Key: "4", Text: "Monthly" }];
var InvoicingCycleType = [{ Key: "-1", Text: "ALL" }, { Key: "1", Text: "7 Days" }, { Key: "2", Text: "10 Days" }, { Key: "3", Text: "Fortnightly" }, { Key: "4", Text: "Monthly" }];
var ValueType = [{ Key: "1", Text: "Plus Pecentage" }, { Key: "2", Text: "Minus Percentage" }, { Key: "3", Text: "Plus Flat" }, { Key: "4", Text: "Minus Flat" }];
var IATATYPE = [{ Key: "1", Text: "TC1" }, { Key: "2", Text: "TC2" }, { Key: "3", Text: "TC3" }];
var SLITYPE = [{ Key: "1", Text: "SEA-AIR" }, { Key: "2", Text: "RE-EXPORT" }, { Key: "3", Text: "LOCAL" }, { Key: "4", Text: "FREEZONE" }];
var SLICustomerTYPE = [{ Key: "1", Text: "REGULAR" }, { Key: "2", Text: "WALK IN" }];
var SLIChargeCode = [{ Key: "1", Text: "PP-Prepaid" }, { Key: "2", Text: "CC-Collect" }];
var WeightValuation = [{ Key: "PP", Text: "Prepaid" }, { Key: "CC", Text: "Collect" }];
var BillTo = [{ Key: "0", Text: "Agent" }, { Key: "1", Text: "Airline" }];
var OnSelectOriginIATA = "OnSelectOriginIATA";
var OnSelectDestinationIATA = "OnSelectDestinationIATA";



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
            if (response.CheckSessionResult == true) {
                OpenLoginWindow();
                res = false;
            } else {
                window.location.href = currenturl;
            }
        }, error: function () {
            location.href = SiteUrl + 'Account/Login.cshtml?islogout=true';
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

        $("#" + cntrlId).change(function (e) {
            var dtValue = $('#' + this.id).val();
            var dtRegex = new RegExp("^([0]?[1-9]|[1-2]\\d|3[0-1])-(JAN|FEB|MAR|APR|MAY|JUN|JULY|AUG|SEP|OCT|NOV|DEC)-[1-2]\\d{3}$", 'i');
            if (!dtRegex.test(dtValue)) {
                $('#' + this.id).val('');
            }
        });

    }

    this.AutoCompleteByDataSource = function (textId, dataSourceName, addOnFunction, separator) {
        var keyId = textId;
        textId = "Text_" + textId;
        $("div[id^='" + textId + "-list']").remove();
        if (IsValid(textId, autoCompleteType)) {
            basedOn = autoCompleteText;
            var dataSource = dataSourceName;
            $("input[type='text'][name='" + textId + "']").kendoComboBox({
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
            $("input[type='text'][name='" + textId + "']").kendoComboBox({
                filter: (filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria),
                dataSource: dataSource,
                autoBind: false,
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
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoComboBox");
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
            $("input[type='text'][name='" + textId + "']").kendoComboBox({
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
            batch: true,
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

    this.DisplayEmptyMessage = function (e, grid) {
        if (grid != null && grid.dataSource != null && grid.dataSource.data().length == 0) {
            var colCount = grid.table.find("colgroup col").length; //  grid.columns.length;
            grid.table.find("tbody tr.gridemptyrow").remove();
            $(e.sender.wrapper).find(".k-grid-content table tbody").append('<tr class="kendo-data-row gridemptyrow"><td colspan="' + colCount + '" class="no-data">No records found.</td></tr>');
            if (e.sender.element != undefined && e.sender.element != null && e.sender.element[0].offsetParent != undefined && e.sender.element[0].offsetParent != null && e.sender.element[0].offsetParent.innerHTML != undefined && e.sender.element[0].offsetParent.innerHTML != null) {
                var exportdiv = $(e.sender.element[0].offsetParent).find(".grid_taskBar #dvExport");
                if (exportdiv != undefined && exportdiv != null) {
                    exportdiv.hide();
                }
            }
        }
        else {
            if (e.sender.element != undefined && e.sender.element != null && e.sender.element[0].offsetParent != undefined && e.sender.element[0].offsetParent != null && e.sender.element[0].offsetParent.innerHTML != undefined && e.sender.element[0].offsetParent.innerHTML != null) {
                var exportdiv = $(e.sender.element[0].offsetParent).find(".grid_taskBar #dvExport");
                if (exportdiv != undefined && exportdiv != null) {
                    exportdiv.show();
                }
            }
        }
    }



    this.ShowPopUp = function (title, url, data, width) {
        $("#kendoWindowDiv").append("<div style='max-height:" + (window.innerHeight - 70) + "px' id='window'></div>");
        var Kwindow = $("#window")
        .kendoWindow({
            width: ((width == null || width == undefined || width == "") ? "800px" : width + "px"),
            actions: ["Minimize", "Maximize", "Close"],
            title: title,
            visible: false,
            //content: 'Loading.......',
            deactivate: function () {
                this.destroy();
            }, open: function (e) {
                this.wrapper.css({ top: 10 });
            },//height: (window.innerHeight - 70)
        }).data("kendoWindow");
        Kwindow.refresh({
            url: url,
            IsPopUp:true,
            type: "POST",
            data: data
        });
        Kwindow.center().open();
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
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoComboBox");
        if (kendoAutoCompleteWC != undefined) {
            $("input[type='text'][name='Text_" + cntrlId + "']");//.css({ "background-color": bgcolor });
            kendoAutoCompleteWC.enable(enable);
            if (clearAllValue) {
                kendoAutoCompleteWC.value('');
                //$("#Text_" + cntrlId).val("");
                //$("#" + cntrlId).val("");
            }
        }
    }

    this.SetValueAutoComplete = function (cntrlId, value) {
        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoComboBox");
        if (kendoAutoCompleteWC != undefined)
            kendoAutoCompleteWC.value(value);
    }


    this.SetIndexAutoComplete = function (cntrlId, index) {
        var kendoAutoCompleteWC = null;
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoComboBox");
        if (kendoAutoCompleteWC != undefined) {
            kendoAutoCompleteWC.select(index);
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
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoComboBox");
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
            $("input[type='text'][name='" + textId + "']").kendoComboBox({
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
        kendoAutoCompleteWC = $("input[type='text'][name='Text_" + textId + "']").data("kendoComboBox");
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
        return $("input[type='text'][name='Text_" + cntrlId + "']").data("kendoComboBox");
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
            $.ajax({
                type: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: SiteUrl + "Services/CommonService.svc/CheckSession",
                success: function (response) {
                    if (response.CheckSessionResult == true) {
                        OpenLoginWindow();
                        res = false;
                    } else {
                        res = true;
                    }
                }, error: function () {
                    location.href = SiteUrl + 'Account/Login.cshtml?islogout=true';
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
    ShowTickerOnPublish();
   // CompareSession();



});
function CompareSession() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: SiteUrl + "Services/CommonService.svc/CompareSession?UserID=" + userContext.UserName + "&Password=&UserSNo=" + userContext.UserSNo,
        success: function (response) {
            if (response) {
                //if (confirm(response)) {
                //    $.ajax({
                //        type: "GET",
                //        contentType: "application/json; charset=utf-8",
                //        dataType: "json",
                //        async: false,
                //        url: SiteUrl + "Services/CommonService.svc/ReLogin?userId=@&password=&UserSNo=" + userContext.UserSNo,
                //        success: function (response) {
                //             window.location = '../Index.cshtml';
                //        }
                //    });
                //} else {
                location.href = 'Account/GarudaLogin.cshtml?islogout=true';
                //ShowMessage("error", "", "Invalid UserID or Password");
                //return false;
                //}
            }
        }
    });
}
function ShowTickerOnPublish() {

    if ($.browser != undefined && $.browser.safari != undefined)
        if ($.browser.safari) {
            if (Notification.permission !== "granted")
                Notification.requestPermission();
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
            if (response.CheckSessionResult == true) {
                OpenLoginWindow();
            } else {
                ShowMessage("error", "System is busy at the moment. Kindly try again after some time.");
                setTimeout(function () { InsertAjaxRequestError() }, 500);
            }
        }, error: function () {
            location.href = SiteUrl + 'Account/Login.cshtml?islogout=true';
        }
    });
}
function InsertAjaxRequestError() {
    var ajaxRequestError = { URL: AjaxErrorevent.target.URL, status: AjaxErrorrequest.status, statusText: AjaxErrorrequest.statusText, responseText: $(AjaxErrorrequest.responseText).filter("#content").html(), RequestUrl: AjaxErrorsettings.url, PageURL: window.location.href, module: getQueryStringValue("Module"), Apps: getQueryStringValue("Apps") };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: SiteUrl + "Services/CommonService.svc/InsertAjaxRequestError",
        data: JSON.stringify(ajaxRequestError),
        success: function (response) {

        }, error: function () {
            location.href = SiteUrl + 'Account/Login.cshtml?islogout=true';
        }
    });
}

function OpenLoginWindow() {
    $("#txtReUserId").text(userContext.UserName);
    $("#divDialogSession").dialog({
        title: "Your current session has expired. Kindly login again to continue.",
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
                               //url: SiteUrl + "Services/CommonService.svc/ReLogin?userId=" + $("#txtReUserId").text() + "&password=" + $("#txtRePassword").val(),
                               url: SiteUrl + "Services/CommonService.svc/ReLogin?userId=" + $("#txtReUserId").text() + "&password=" + $("#txtRePassword").val() + "&UserSNo=",
                               success: function (response) {
                                   if (response == false)
                                       ShowMessage("error", "", "Invalid UserID or Password");
                                   else {
                                       $("#divDialogSession").dialog("close");
                                   }
                               }, error: function () {
                                   location.href = SiteUrl + 'Account/Login.cshtml?islogout=true';
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
                            qString += e.split("=")[0] + "=" + $(row).find("td[data-column='" + e.split("=")[0] + "']").html() + "&";
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
    var isView = false;
    //get the subprocess view permission
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            isView = e.IsView;
            return;
        }
    });

    //if view permission is true
    if (isView) {
        $(".btn-success").attr("style", "display:none;");
        $(".btn-danger").attr("style", "display:none;");
        $(".ui-button").closest("td").attr("style", "display:none;");
        $(".btnTrans").closest("td").attr("style", "display:none;");
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
        $(".btn-success").attr("style", "display:block;");
        $(".btn-danger").attr("style", "display:block;");
        $(".btnTrans").closest("td").attr("style", "display:table-cell;");
        $(".ui-button").closest("td").attr("style", "display:table-cell;");
    }
}

function GetPageRightsByAppName(Modules, Apps) {
    var returnVal;
    $.ajax({
        url: SiteUrl + "Services/CommonService.svc/GetPageRightsByAppName?Module=" + Modules + "&Apps=" + Apps + "&UserSNo=" + userContext.UserSNo,
        async: false,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            returnVal = result;
        }
    });
    return returnVal;
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
