var ValidFrom, ValidTo;
var StrValidFrom, StrValidTo;

var Input = {};
Input.createControl = function (property, type) {
    if (!(type === undefined)) {
        switch (type.toUpperCase()) {
            case 'AUTOCOMPLETE':
                var prefix = 'Text_'
                var real = $("<input type='hidden' controltype='autocomplete' autocomplete='off' data-role='autocomplete'/>").attr(property);
                delete property.datatype;
                var temp = $("<input type='text' controltype='autocomplete' autocomplete='off' data-role='autocomplete'>").attr({ id: prefix + property.id, name: prefix + property.name });
                return $("<span/>").append(temp).append(real);
                break;
            case 'NUMBER':
                var real = $("<input type='text'/>").attr(property);
                return real
                break;
            case 'DATE':
                var prefix = 'Text_'
                var real = $("<input/>").attr(property);
                var temp = $("<input type='hidden'>").attr({ id: prefix + property.id, name: prefix + property.name });
                return ({ input: real, hidden: temp });
                break;
            case 'ACTIVE':
                if (property.value) {
                    delete property.value;
                    return $('<span/>').append($("<input type='radio' value='0' checked='True' >Yes</input>").attr(property)).append($("<input type='radio' value='1' >No</input>").attr(property));
                }
                else {
                    delete property.value;
                    return $('<span/>').append($("<input type='radio' value='0' >Yes</input>").attr(property)).append($("<input type='radio' value='1' checked='True'>No</input>").attr(property));
                }
                break;
            case 'TEXT':
                return $("<input type='text'/>").attr(property);
                break;
            default:
                return $("<input/>").attr(property);
                break;
        }
    }
}
var tableElement = new Array("Priority", "Value", "Effect", "Percentage", "StartWeight", "EndWeight");
var alphabettypes = [{ Key: "+", Text: "+" }, { Key: "-", Text: "-"}];
var checkedChange = true;
var endWeight = 100;
String.Format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}
String.Join = function () {
    var joinLetter = arguments[0];
    var finalString = "";
    for (var i = 0; i < arguments.length - 1; i++) {
        finalString += joinLetter + arguments[i + 1];
    }
    return finalString.substring(joinLetter.length, finalString.length);
}
function validateWeight(obj) {
    var startWeight = $(obj).closest("tr").find("input[id*='StartWeight']:hidden");
    var endWeight = $(obj).closest("tr").find("input[id*='EndWeight']:hidden");
    var stWt = parseFloat(startWeight.val());
    var endWt = parseFloat(endWeight.val());
    if (startWeight.val() == "" || endWeight.val() == "" || stWt == NaN || endWt == NaN) {
        return false;
    }
    else if (stWt > endWt) {
        return false;
    }
    else {
        return true;
    }
}
function addRow(obj, NameOfClass) {

    var currentRow = $(obj).closest('tr');
    if (!currentRow.data('cfValidator').validate()) {
        return
    }

    if (!validateWeight(obj)) {
        //Dialog.alert("");
        CallMessageBox('info', 'Rate Discounting', 'Enter valid Weights');
        return;
    }
    var currentRowIndex = $(obj).closest('tr')[0].rowIndex;
    var currentCellIndex = $(obj).closest('td').index();
    var currentBucketClass = $(obj).closest('td').find('input:hidden').val();
    var txtStartWeight = currentRow.find("td:eq(" + (currentCellIndex - 2).toString() + ")").find("input:text");
    var txtEndWeight = currentRow.find("td:eq(" + (currentCellIndex - 1).toString() + ")").find("input:text");
    endWeight = parseFloat((txtEndWeight).val()) - parseFloat((txtStartWeight).val());
    txtStartWeight.attr({ "disabled": true });
    txtEndWeight.attr({ "disabled": true });
    var curParent = currentRow.attr("parent");
    var classindex = $.inArray(NameOfClass, BucketClasses)//BucketClasses.indexOf(NameOfClass);
    currentIndex++;
    var elencb = $(String.Format('<tr parent="{0}" id="row{1}"></tr>', curParent.toString(), currentIndex.toString())).attr({ class: !BucketIsActive[classindex] ? 'IsActiveRow' : "" });
    elencb.append($(String.Format('<td bucket="{0}">&nbsp;{0}</td>', NameOfClass.toString())).attr({ "class": "formInputcolumn" }).css({ "background-color": $(obj).closest("td").css("background-color") }));

    $.each(tableElement, function () {
        var ele = $('<td></td>');
        ele.attr({ class: 'formInputcolumn' });
        if ($.trim($(currentRow).attr("class"))=="IsActiveRow") {
            if (this.toString().toUpperCase() == "VALUE") {
                ele.append(getInputControl(this.toString()).removeAttr("data-valid"));
            }
            else if (this.toString().toUpperCase() == "PRIORITY") {
                ele.append(getInputControl(this.toString()).text(BucketPriority[classindex]));
            }
            else {
                ele.append(getInputControl(this.toString()));
            }
        }
        else {
            if (this.toString().toUpperCase() == "PRIORITY") {
                ele.append(getInputControl(this.toString()).text(BucketPriority[classindex]));
            }
            else {
                ele.append(getInputControl(this.toString()));
            }
        }
        elencb.append(ele);
    })
    elencb.addClass($(currentRow).attr("class"));


    var link = String.Format('<td colspan="3"><a href="javascript:void(0);" onclick="return addRow(this,{0});">Add</a></td>', "'" + NameOfClass + "'");
    eleRemoveAdd = $(link).attr({ "class": "formInputcolumn" }).css({ "background-color": $(obj).closest("td").css("background-color") });
    eleRemoveAdd.append($("<span>&nbsp;<span>"));
    eleRemoveAdd.append($('<a href="javascript:void(0);" onclick="return removeRow(this);">remove</a>'));
    eleRemoveAdd.append($(String.Format('<input type="hidden" id="BucketClass{0}" value="{1}" datatype="BCLASS">', currentIndex.toString(), currentBucketClass.toString())));
    var rateSno = $("#Value4").closest("tr").find('input[id*=hdnBucketClassSNo]').val();
    if (typeof rateSno === 'string') {
        eleRemoveAdd.append($(String.Format('<input type="hidden" id="hdnBucketClassSNo{0}" value="{1}" datatype="SNO">', currentIndex.toString(), rateSno)));
    }
    elencb.append(eleRemoveAdd);
    var table = $("#tblWebFormTable");
    currentRow.after(elencb);
    var startWieght = $("#tblWebFormTable tr:eq(" + (currentRowIndex + 1).toString() + ") td:eq(" + (currentCellIndex - 2).toString() + ")").find("input:text");
    var endWieght = $("#tblWebFormTable tr:eq(" + (currentRowIndex + 1).toString() + ") td:eq(" + (currentCellIndex - 1).toString() + ")").find("input:text");
    startWieght.val((parseInt(txtEndWeight.val(), 10)).toString());
    startWieght.attr({ disabled: true });
    endWieght.val((parseInt(txtEndWeight.val(), 10) + endWeight).toString());
    $(obj).closest('td').find('a').each(function () {
        $(this).hide();
    })
    cfi.DateType("ValidFrom" + currentIndex.toString());
    cfi.DateType("ValidTo" + currentIndex.toString());
    cfi.Numeric("Value" + currentIndex.toString(), 2);
    cfi.Numeric("StartWeight" + currentIndex.toString(), 2,'weight');
    cfi.Numeric("EndWeight" + currentIndex.toString(), 2, 'weight');
    cfi.AutoCompleteByDataSource(String.Format('Effect{0}', (currentIndex).toString()), alphabettypes);
    cfi.ValidateSection(String.Format("row{0}", (currentIndex).toString()));
}

function removeRow(obj) {
    var currentRowIndex = $(obj).closest('tr')[0].rowIndex;
    var colIndex = $(obj).closest('td').index();
    var controlCell = $("#tblWebFormTable tr:eq(" + (currentRowIndex - 1).toString() + ") td:eq(" + (colIndex).toString() + ")");
    var startWieght = $("#tblWebFormTable tr:eq(" + (currentRowIndex - 1).toString() + ") td:eq(" + (colIndex - 2).toString() + ")").find("input:text");
    var endWieght = $("#tblWebFormTable tr:eq(" + (currentRowIndex - 1).toString() + ") td:eq(" + (colIndex - 1).toString() + ")").find("input:text");
    $(controlCell).find('a').each(function () {
        $(this).show();
    })
    startWieght.attr({ "disabled": false });
    endWieght.attr({ "disabled": false });
    var prevRow = $("tblWebFormTable ");
    $(obj).closest('tr').remove();
}

function getInputControl(typeOfVariable) {
    var input = $('<input type="text"/>');
    switch (typeOfVariable) {
        case 'Effect':
            input = $('<span></span>');
            var input1 = $('<input type="text"/>');
            input1.attr({ datatype: "EFFECT", controltype: "autocomplete", value: '+', allowchar: '+-', id: "Text_Effect" + currentIndex.toString(), maxlength: 1, 'data-valid': 'required', 'data-valid-msg': 'Effect cannot be blank', name: "Text_Effect" + currentIndex.toString() });
            input1.css({ "width": "30px" });
            var inputHdn = $(String.Format("<input type='hidden' value='+' name=Effect{0}>", currentIndex.toString()));
            input.append(input1);
            input.append(inputHdn);
            break;
        case 'Value':
            input.attr({ datatype: "VAL", maxlength: "5", id: "Value" + currentIndex.toString(), 'data-role': 'numerictextbox', 'data-valid': 'required', controltype: 'number', class: 'k-input', name: 'Value' + currentIndex.toString(), 'data-valid-msg': 'Value cannot be blank' });
            input.css({ "text-align": "right" });
            break;
        case 'Percentage':
            input = Input.createControl({ datatype: "ACTIVE", name: "Percentage" + currentIndex.toString(), id: "Percentage" + currentIndex.toString(), 'data-valid': 'required', 'data-valid-msg': 'Value cannot be blank', value: true }, "ACTIVE");
            break;
        case 'ValidFrom':
            input.attr({ datatype: "VALIDFROM", 'data-valid': 'required', 'data-valid-msg': 'Valid From cannot be blank', id: "ValidFrom" + currentOriginDestination.toString(), class: 'k-input', name: "ValidFrom" + currentOriginDestination.toString(), controltype: 'datetype', 'data-role': 'datepicker' });
            cfi.DateType("ValidFrom" + currentOriginDestination.toString());
            break;
        case 'ValidTo':
            input.attr({ datatype: "VALIDTO", 'data-valid': 'required', 'data-valid-msg': 'Valid To cannot be blank', id: "ValidTo" + currentOriginDestination.toString(), class: 'k-input', name: "ValidTo" + currentOriginDestination.toString(), controltype: 'datetype', 'data-role': 'datepicker' });
            cfi.DateType("ValidTo" + currentOriginDestination.toString());
            break;
        case 'StartWeight':
            input.attr({ datatype: "SW", 'data-valid': 'required', 'data-valid-msg': 'Start Weight cannot be blank', maxlength: "5", id: "StartWeight" + currentIndex.toString(), 'data-role': 'numerictextbox', 'data-valid': '', controltype: 'number', class: 'k-input', value: '0' });
            input.css({ "text-align": "right" });
            input.css({ "text-align": "right", "maxlength": "5" });
            break;
        case 'EndWeight':
            input.attr({ datatype: "EW", 'data-valid': 'required', 'data-valid-msg': 'End Weight cannot be blank', maxlength: "5", id: "EndWeight" + currentIndex.toString(), 'data-role': 'numerictextbox', 'data-valid': '', controltype: 'number', class: 'k-input', value: '100' });
            input.css({ "text-align": "right", "maxlength": "5" });
            break;
        case 'Origin':
            input = Input.createControl({ datatype: "ORIGIN", id: "Origin" + currentOriginDestination.toString(), name: "Origin" + currentOriginDestination.toString(), 'data-valid': '', 'data-valid-msg': '' }, "AUTOCOMPLETE");
            break;
        case 'Destination':
            input = Input.createControl({ datatype: "DESTINATION", id: "Destination" + currentOriginDestination.toString(), name: "Destination" + currentOriginDestination.toString(), 'data-valid': '', 'data-valid-msg': '' }, "AUTOCOMPLETE");
            break;
        case 'AirlineCode':
            input = Input.createControl({ datatype: "AIRLINECODE", id: "AirlineCode" + currentOriginDestination.toString(), name: "AirlineCode" + currentOriginDestination.toString(), 'data-valid': '', 'data-valid-msg': '' }, "AUTOCOMPLETE");
            break;
        case 'FlightNo':
            input = Input.createControl({ datatype: "FLIGHTNO", id: "FlightNo" + currentOriginDestination.toString(), name: "FlightNo" + currentOriginDestination.toString(), 'data-valid': '', 'data-valid-msg': '' }, "AUTOCOMPLETE");
            break;
        default:
            input = $("<span/>");
            break;
    }
    return input;
}
function validateRequiredFieldsAll() {
    var res = true;
    $("input[id*=AirlineCode]:visible").each
    (function () {
        var flag = false;
        $(this).closest("tr").find("input[type=text]:visible").each(function () {
            if ($(this).val() != "") {
                flag = true;
                return;
            }
        })
        res = res && flag;
        if (!res) {
            $(this).find("input[value='']:visible:first").eq(0).focus();
            var loc = $(this).closest("tr").find("input[value='']:visible:first").eq(0).closest("td").position();
            // console.log(loc.top);
            $("html, body").animate({ scrollTop: loc.top }, "slow");
            $(this).focus();

        }
    })
    return res;
}
function checkValidity(obj) {
    var flag = false;
    $(obj).closest("tr").find("input[id*='Origin'],input[id*='Destination'],input[id*='AirlineCode'],input[id*='FlightNo']").each(function () {
        if ($.trim($(this).val()) != "") {
            flag = true;
            return;
        }
    })
    return flag;
}
function addBlock(obj) {
    if (!cfi.IsValidSection($(obj).closest('tr').attr("id")) || !cfi.IsValidForm()) {
        return;
    }
    if (!checkValidity(obj)) {
        CallMessageBox('info', 'Rate Discounting', 'Enter Either Airline Name,Flight No, Origin or Destination');
        return;
    }
    $(obj).closest("td").find('a').each(function () {
        $(this).hide();
    })
    var checkedChange = true;
    currentOriginDestination++;
    var elehead = $('<tr style="display:none">' +
                '<td class="formSection">Class</td>' +
                '<td class="formSection">Priority</td>' +
                '<td class="formSection">Value</td>' +
                '<td class="formSection">Effect</td>' +
                '<td class="formSection">Percentage</td>' +
                '<td class="formSection">Start Weight(Kgs)</td>' +
                '<td class="formSection">End Weight(Kgs)</td>' +
                '<td class="formSection" colspan="3">Action</td>' +
               '</tr>');
    var eleEmptyRow = $("<tr/>").append($("<td class='formInputcolumn' colspan='9' style='height:0px;border-left: 0px;border-right:0px'/>").css({ 'border-left': 'none !important', 'border-right': 'none !important' }).append($("<hr>").css({ border: 0, color: "#4B6C9E", 'background-color': '#4B6C9E', height: '2px', width: '100.2%', 'margin-left': '-4px' }))).attr({ parent: currentOriginDestination.toString() });
    var eleHead = $("<tr></tr>");
    eleHead.append($("<td/>").attr({ class: "formlabelMandatory" }).append("<span style='color:#0431B4'>@ Airline</span>")).append("  <input type='hidden' datatype='HR' value='HR'>");
    eleHead.append($("<td/>").attr({ class: "formInputcolumn" }).append(getInputControl("AirlineCode")));
    eleHead.append($("<td/>").attr({ class: "formlabelMandatory" }).append("<span style='color:green'># Origin</span>"));
    eleHead.append($("<td/>").attr({ class: "formInputcolumn" }).append(getInputControl("Origin")));
    eleHead.append($("<td/>").attr({ class: "formlabelMandatory" }).append("<span style='color:green'># Destination</span>"));
    eleHead.append($("<td/>").attr({ class: "formInputcolumn" }).append(getInputControl("Destination")));
    eleHead.append($("<td/>").attr({ class: "formlabelMandatory" }).append("<span style='color:purple'># Flight No</span>"));
    eleHead.append($("<td/>").attr({ class: "formInputcolumn" }).append(getInputControl("FlightNo")));
    eleHead.append($("<td class='formInputcolumn' rowspan='2'>"
                    + "<a href='javascript:void(0);' onclick='return addBlock(this);' class='' style='display:none'>Add<a/>"
                    + "<span>&nbsp;</span>"
                    + "<a href='javascript:void(0);' onclick='return removeBlock(this);' class=''>Remove<a/>"
                    + "<a><input type='button' id='btnChkButton'" + currentOriginDestination + " value='Search' class='buttontolink'></a>"
                    + "</td>")
                    );
    var eleHead2 = $("<tr></tr>");
    eleHead2.append($("<td/>").attr({ class: "formlabelMandatory" }).append("Valid From")).append("  <input type='hidden' datatype='HR' value='HR'>");
    eleHead2.append($("<td/>").attr({ class: "formInputcolumn" }).append(getInputControl("ValidFrom")));
    eleHead2.append($("<td/>").attr({ class: "formlabelMandatory" }).append("Valid To"));
    eleHead2.append($("<td/>").attr({ class: "formInputcolumn" }).append(getInputControl("ValidTo")));
    eleHead2.append($("<td/>").attr({ class: "formlabelMandatory" }).append("<input type='hidden' name='BCTFrom'/><input type='hidden' name='BCTTo'/>"));
    eleHead2.append($("<td/>").attr({ class: "formInputcolumn" }).append(""));
    eleHead2.append($("<td/>").attr({ class: "formlabelMandatory" }).append(""));
    eleHead2.append($("<td/>").attr({ class: "formInputcolumn" }).append(""));
    eleHead.attr({ parent: currentOriginDestination.toString() });
    var table = $(".WebFormTable");
    eleEmptyRow.attr({ parent: currentOriginDestination.toString() });
    eleHead.attr({ parent: currentOriginDestination.toString() });
    eleHead.attr({ id: currentOriginDestination.toString(), parent: currentOriginDestination.toString() });
    eleHead2.attr({ parent: currentOriginDestination.toString() });
    elehead.attr({ parent: currentOriginDestination.toString() });
    table.append(eleEmptyRow);
    table.append(eleHead);
    table.append(eleHead2);
    table.append(elehead);
    $.each(BucketClasses, function (key, value) {
        currentIndex++;

        var elencb = $(String.Format('<tr style="display:none" id="row{0}"></tr>', currentIndex.toString()));
        if (!BucketIsActive[key]) {
            elencb.attr({ "class": "IsActiveRow" });
        }
        elencb.append($('<td bucket="' + value + '">&nbsp;' + value + '</td>').attr({ "class": "formInputcolumn" }));
        $.each(tableElement, function () {
            var ele = $('<td></td>');
            if (!BucketIsActive[key]) {
                ele.attr({ class: 'formInputcolumn' }).css({ 'background-color': 'rgb(242,242,242)' });
            }
            else {

                ele.attr({ class: 'formInputcolumn' });
            }
            if (this.toString().toUpperCase() == "VALUE") {
                if (!BucketIsActive[key]) {
                    ele.append(getInputControl(this.toString()).removeAttr("data-valid"));
                }
                else {
                    ele.append(getInputControl(this.toString()));
                }
            }
            else {
                ele.append(getInputControl(this.toString()));
            }
            if (this.toString().toUpperCase() == "PRIORITY") {
                ele.append(getInputControl(this.toString()).text(BucketPriority[key]));
            }
            elencb.append(ele);
           

        })
        if (BucketPriority[key] == '0') {
            elencb.find("input").attr({ "disabled": true });
            elencb.find("input[id^=Value]").val('0');
            elencb.addClass("PreSold");
        }

        var link = String.Format('<td colspan="3"><a href="javascript:void(0);" onclick="return addRow(this,{0});">Add</a> <input datatype="BCLASS" type="hidden" id="BucketClass{2}" value="{1}"></input></td>', "'" + value + "'", BucketClassesSNo[key].toString(), currentIndex.toString());
        if (BucketPriority[key] == '0') {
            link = String.Format('<td colspan="3"><input datatype="BCLASS" type="hidden" id="BucketClass{2}" value="{1}"></input></td>', "'" + value + "'", BucketClassesSNo[key].toString(), currentIndex.toString());
        }
        elencb.append($(link).attr({ "class": "formInputcolumn" }));
        elencb.attr({ parent: currentOriginDestination.toString() });
        table.append(elencb);
    });

    for (var i = 0; i < BucketClasses.length; i++) {
        cfi.Numeric("Value" + (currentIndex - i).toString(), 0);
        cfi.Numeric("StartWeight" + (currentIndex - i).toString(), 0,'weight');
        cfi.Numeric("EndWeight" + (currentIndex - i).toString(), 0, 'weight');
        cfi.AutoCompleteByDataSource(String.Format('Effect{0}', (currentIndex - i).toString()), alphabettypes);
        cfi.ValidateSection(String.Format("row{0}", (currentIndex - i).toString()));
    }

    $(window).scrollTop() + $(window).height();
   
    $("#" + String.Format('Origin{0}', currentOriginDestination.toString())).focus();
    cfi.AutoCompleteV2(String.Format('Origin{0}', currentOriginDestination.toString()), 'CityName,CityCode', 'Master_BucketRateDiscounting_CityName', null, "contains");
    cfi.AutoCompleteV2(String.Format('AirlineCode{0}', currentOriginDestination.toString()), 'AirlineName,AirlineCode', 'Master_BucketRateDiscounting_AirlineName', null, "contains");
    cfi.AutoCompleteV2(String.Format('Destination{0}', currentOriginDestination.toString()), 'CityName,CityCode', 'Master_BucketRateDiscounting_CityName', null, "contains");
    cfi.AutoCompleteV2(String.Format('FlightNo{0}', currentOriginDestination.toString()), "FlightNo", "Master_BucketRateDiscounting_FlightNo", null, "contains", null, null, null, null, onFlightSelect);
    cfi.ValidateSection(currentOriginDestination.toString());
    cfi.DateType(String.Format('ValidFrom{0}', currentOriginDestination.toString()));
    cfi.DateType(String.Format('ValidTo{0}', currentOriginDestination.toString()));
    $(String.Format('#ValidTo{0}', currentOriginDestination.toString())).val(getDateNextYear());
}
function removeBlock(obj) {
    var currentRow = $(obj).closest('tr');
    var curRowIndex = $(obj).closest('tr')[0].rowIndex;
    var curParent = currentRow.attr("parent");
    $(String.Format('#tblWebFormTable tr[parent="{0}"]', curParent.toString())).remove();
    var tr = String.Format('#tblWebFormTable tr[parent="{0}"]:eq({1})', (currentOriginDestination - 1).toString(), parseInt(currentOriginDestination - 1, 10) == 0 ? "0" : "1")
    $(tr).find('td').each(function () {
        $(this).find("a").each(function () {
            $(this).show();
        })
    })
    currentOriginDestination--;
}

function saveData() {
    var str = "";
    var bucket = ""
    var hdnData = $("#hdnData");
    hdnData.val("");
    $.each($(".WebFormTable tr:gt(2)"), function () {
        str += "^";
        try {
            bucket = $(this).find("td:first").attr("bucket").toString();
        }
        catch (exp) {
        }
        $.each($(this), function () {
            $(this).find("input:text,input:radio,input:hidden").each(function () {
                if ($(this).attr('type') == "radio" && $(this).val() == "0") {
                    str += $(this).attr("checked") == "checked" ? "ACTIVE:Yes" + "~" : "ACTIVE:No" + "~";
                }
                if ($(this).attr('type') != "radio") {
                    str += $(this).attr("datatype") + ":" + $(this).val() + "~";
                }
            });
        })
        hdnData.val(hdnData.val() + str + bucket);
        str = "";
    });
    if (!validateRequiredFieldsAll()) {
       // Dialog.alert("");
        CallMessageBox('info', 'Rate Discounting', 'Enter Either Airline Name,Flight No, Origin or Destination');
        return false;
    }
    else {
        return true;
    }
}
$(document).ready(function () {
    if (getQueryStringValue("FormAction") != "INDEXVIEW") {
        onPageLoad();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var k = ValidFromBCT.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        ValidFrom = dfrom;
        k = ValidToBCT.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        ValidTo = dto;
        StrValidFrom = ValidFromBCT;
        StrValidTo = ValidToBCT;
    }
})

function onPageLoad() {
    cfi.ValidateForm();
    cfi.AutoCompleteV2('AirlineCode', 'AirlineName,AirlineCode', 'Master_BucketRateDiscounting_AirlineName', null, "contains");
    cfi.AutoCompleteV2('Origin', 'CityName,CityCode', 'Master_BucketRateDiscounting_CityName', null, "contains");
    cfi.AutoCompleteV2('Destination', 'CityName,CityCode', 'Master_BucketRateDiscounting_CityName', null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Master_BucketRateDiscounting_FlightNo", null, "contains", null, null, null, null, onFlightSelect);
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        cfi.EnableAutoComplete("AirlineCode", false, false, "#F0F0F0");
        cfi.EnableAutoComplete("Origin", false, false, "#F0F0F0");
        cfi.EnableAutoComplete("Destination", false, false, "#F0F0F0");
        cfi.EnableAutoComplete("FlightNo", false, false, "#F0F0F0");
    }
    $("#Text_Origin").parent().css("width", "");
    $("#Text_Destination").parent().css("width", "");
    $("input[name='operation']").click(function (e) {
        //saveData();
    });
    try {
        for (var i = 0; i < currentIndex; i++) {
            cfi.DateType("ValidFrom" + (currentIndex - i).toString());
            cfi.DateType("ValidTo" + (currentIndex - i).toString());
            cfi.Numeric("Value" + (currentIndex - i).toString(), 2);
            cfi.Numeric("StartWeight" + (currentIndex - i).toString(), 2);
            cfi.Numeric("EndWeight" + (currentIndex - i).toString(), 2);
            cfi.AutoCompleteByDataSource(String.Format('Effect{0}', (currentIndex - i).toString()), alphabettypes);
            $("#_tempStartWeight" + (currentIndex - i).toString()).removeAttr("readonly");
            $("#_tempStartWeight" + (currentIndex - i).toString()).removeClass("k-state-disabled");
            $("#_tempEndWeight" + (currentIndex - i).toString()).removeAttr("readonly");
            $("#_tempEndWeight" + (currentIndex - i).toString()).removeClass("k-state-disabled");
            $("#StartWeight" + (currentIndex - i).toString()).removeAttr("readonly");
            $("#StartWeight" + (currentIndex - i).toString()).removeClass("k-state-disabled");
            $("#EndWeight" + (currentIndex - i).toString()).removeAttr("readonly");
            $("#EndWeight" + (currentIndex - i).toString()).removeClass("k-state-disabled");
            cfi.ValidateSection(String.Format("row{0}", (currentIndex - i).toString()));
        }
    }
    catch (exp) {
    }
    try {
        cfi.ValidateSection(String.Format("{0}", currentOriginDestination.toString()));
    }
    catch (Ecp)
    { }
    $("input[id*='EndWeight']:visible").live("change blur", function (e) {
        var curRow = $(this).closest("tr");
        var endWt = parseFloat($(this).val());
        var startWt = parseFloat($(this).closest("tr").find("input[id*='StartWeight']:hidden").val());
        var nextStart = parseFloat($(this).closest("tr").next('tr').find("input[id*='StartWeight']:hidden").val());
        var curClass1 = $.trim(curRow.find("td:first").text());
        var curClass2 = $.trim(curRow.next('tr').find("td:first").text());
        if (startWt > endWt || (endWt > nextStart && curClass1 == curClass2)) {
            $(this).closest("td").find("input:text").each(function () {
                $(this).val("");
            })
        }
    });
    $("input[id*='StartWeight']:visible").live("change blur", function (e) {
        var curRow = $(this).closest("tr");
        var startWt = parseFloat($(this).val());
        var curClass1 = $.trim(curRow.find("td:first").text());
        var curClass2 = $.trim(curRow.prev('tr').find("td:first").text());
        var endWt = parseFloat(curRow.find("input[id*='EndWeight']:hidden").val());
        var prevEnd = parseFloat(curRow.prev('tr').find("input[id*='EndWeight']:hidden").val());
        prevEnd = isNaN(prevEnd) ? 0 : prevEnd;
        if (startWt > endWt || (startWt < prevEnd && curClass1 == curClass2)) {
            $(this).closest("td").find("input:text").each(function () {
                $(this).val("");
            })
        }
    });
    $("input[id*=Percentage]").live("click", function () {
        checkedChange = $.trim($(this).val()) == "0";
    });
    $("input[id^=ValidTo]").live("change", function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        k = $(this).closest("tr").find("input[name=BCTTo]").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        ValidTo = new Date(Date.parse(k));
        if (dto > ValidTo && $(this).val() != '') {
            $(this).val("");
            ShowMessage('warning', 'Need your Kind Attention!', 'Valid To cannot be greater than ' + $(this).closest("tr").find("input[name=BCTTo]").val());
        }
        if (dfrom > dto)
            $(this).val("");
       
        
    });
    $("input[id^=ValidFrom]").live("change", function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        //ValidFrom = ""
        k = $(this).closest("tr").find("input[name=BCTFrom]").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        ValidFrom = new Date(Date.parse(k));
        
        if (dfrom > dto)
            $(this).val("");
        if (dfrom < ValidFrom) {
            $(this).val("");
            ShowMessage('warning', 'Need your Kind Attention!', 'Valid From cannot be lesser than ' + $(this).closest("tr").find("input[name=BCTFrom]").val());
        }
       
    });
    $("input[id*=Origin]:visible").live("change", function () {
        var curid = $(this).attr("id");
        if (!(typeof curid === "undefine")) {
            if ($(this).val() != "") {
                var destinationId = curid.replace("Origin", "Destination");
                $("#" + destinationId).attr({ "Data-Valid": "required", "Data-Valid-Msg": "Destination cannot be blank" });
            }
            else {
                var destinationId = curid.replace("Origin", "Destination");
                $("#" + destinationId).removeAttr("Data-Valid");
            }
        }
    });

    $("input[id^=btnChkButton]").live("click", function () {
        var obj = $(this);
        checkActiveBuckets(obj);
    })
    $("input[id^=Text_FlightNo]").live("blur", function () {
        var CurTr = $(this).closest("tr");
        if ($.trim($(this).val()) != "") {
            //function (cntrlId, enable, clearAllValue, bgcolor)
            cfi.EnableAutoComplete(CurTr.find("input[id^=Origin]").attr("id"), false, false, "#F0F0F0");
            cfi.EnableAutoComplete(CurTr.find("input[id^=Destination]").attr("id"), false, false, "#F0F0F0");
            cfi.EnableAutoComplete(CurTr.find("input[id^=Airline]").attr("id"), false, false, "#F0F0F0");
        }
        else {
            cfi.EnableAutoComplete(CurTr.find("input[id^=Origin]").attr("id"), true, true, "#FFFFFF");
            cfi.EnableAutoComplete(CurTr.find("input[id^=Destination]").attr("id"), true, true, "#FFFFFF");
            cfi.EnableAutoComplete(CurTr.find("input[id^=Airline]").attr("id"), true, true, "#FFFFFF");
        }
    })
}

function checkActiveBuckets(obj) {
    var curRow = $(obj).closest("tr");
    var CurData = new Array;
    var Message = 0;

    $.ajax({
        type: "GET",
        url: "./Services/CommonService.svc/IsActiveBucket",
        data: { AirlineCode: $(curRow).find("input[id^=AirlineCode]").val(), Origin: $(curRow).find("input[id^=Origin]").val(), Destination: $(curRow).find("input[id^=Destination]").val(), FlightNo: $(curRow).find("input[id^=FlightNo]").val()
            , ValidFrom: $(curRow).next("tr").find("input[id^=ValidFrom]").val(), ValidTo: $(curRow).next("tr").find("input[id^=ValidTo]").val()
        },
        dataType: "json",
        success: function (response) {
            Message = response.Total; //get mEssage Code in this fields
            StrValidFrom = response.ExtraData[0];
            StrValidTo = response.ExtraData[1];
            if (response.Data.length > 0) {
                CurData = response.Data;

            }
        },
        complete: function () {
            if (Message == 1001) {
                //Dialog.alert("Record already exists");
                ShowMessage('warning', 'Need your Kind Attention!', 'Record already exists');
                return;
            }
            else {

                // $(obj).closest("tr").next("tr").find("input[id^=ValidFrom]").val(StrValidFrom);
                $(curRow).next("tr").find("input[name=BCTTo]").val(StrValidTo);
                $(curRow).next("tr").find("input[name=BCTFrom]").val(StrValidFrom);
                $(obj).closest("tr").next("tr").find("input[id^=ValidTo]").val(StrValidTo);
                var k = StrValidFrom.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dfrom = new Date(Date.parse(k));
                ValidFrom = dfrom;
                k = StrValidTo.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dto = new Date(Date.parse(k));
                ValidTo = dto;
            }
            $(obj).closest("tr").find("td:last a").show();
            if (CurData.length > 0) {
                var parent = $(obj).closest("tr").attr("parent");

                $("tr[parent=" + parent + "]").show();
                var rows = $("tr[parent=" + parent + "]").filter("tr[id^=row]");
                var curRowIndex = 0;
                $(rows).each(function () {
                    $(this).find("input[id*=BucketClass]").val(CurData[curRowIndex].TransSNo);
                    var bclass = $(this).find("input[id*=BucketClass]").val();
                    classname = $.trim($(this).find("td:first").text());
                    if (!CurData[curRowIndex].IsActive) {
                        $(this).addClass("IsActiveRow");
                        $(this).find("input[type=text]").removeAttr("data-valid");
                    }
                    else {
                        $(this).removeClass("IsActiveRow");
                        $(this).find("input[id^=Value],input[id^=StartWeight],input[id^=EndWeight]").attr({ "data-valid": "required" });
                    }
                    curRowIndex++
                })
            }
            else {
                var parent = $(obj).closest("tr").attr("parent");
                $("tr[parent=" + parent + "]").show();
                var rows = $("tr[parent=" + parent + "]").filter("tr[id^=row]");
                var curRowIndex = 0;
                $(rows).each(function () {
                    $(this).find("input[id*=BucketClass]").val(BucketClassesSNo[curRowIndex])
                    if (!BucketIsActive[curRowIndex]) {
                        $(this).addClass("curRow");
                        $(this).find("input[type=text]").removeAttr("data-valid");
                    }
                    else {
                        $(this).removeClass("IsActiveRow");
                        $(this).find("input[id^=Value],input[id^=StartWeight],input[id^=EndWeight]").attr({ "data-valid": "required" });
                    }
                    curRowIndex++
                })
            }
        }
    });
}


function ExtraCondition(textId) {
    var filterdaysdiscounting = cfi.getFilter("AND");
    if (textId.indexOf("Origin") >= 0) {
        var destination = textId.replace("Text_Origin", "Destination");
        cfi.setFilter(filterdaysdiscounting, "CityCode", "neq", $("#" + destination).val())
        var OriginCityAutoCompleteFilter = cfi.autoCompleteFilter([filterdaysdiscounting]);
        return OriginCityAutoCompleteFilter;
    }
    if (textId.indexOf("Destination") >= 0) {
        var origin = textId.replace("Text_Destination", "Origin");
        cfi.setFilter(filterdaysdiscounting, "CityCode", "neq", $("#" + origin).val())
        var OriginCityAutoCompleteFilter = cfi.autoCompleteFilter([filterdaysdiscounting]);
        return OriginCityAutoCompleteFilter;
    }
}
function onFlightSelect(e) {
    var Data = this.dataItem(e.item.index());

    var CurData = null;
    var Flight = Data.Key;
    var CurTr = $(e.sender.element).closest("tr");

    $.ajax({
        type: "GET",
        url: "./Services/CommonService.svc/GetODFromFlight",
        data: { FlightNo: Flight },
        dataType: "json",
        success: function (response) {
            if (response.Data.length > 0) {
                CurData = response.Data;

            }
        },
        complete: function () {
            if (!(CurData === null)) {
                if (CurData.length > 0) {
                    CurTr.find("input[id^=Origin],input[id^=Text_Origin]").val(CurData[0]);
                    CurTr.find("input[id^=Destination],input[id^=Text_Destination]").val(CurData[1]);
                    CurTr.find("input[id^=Airline],input[id^=Text_Airline]").val(CurData[2]);
                }
            }
            else {
                CurTr.find("input[id^=Origin],input[id^=Text_Origin]").val("");
                CurTr.find("input[id^=Destination],input[id^=Text_Destination]").val("");
                CurTr.find("input[id^=Airline],input[id^=Text_Airline]").val("");
            }
            CurData = null;
            if ($.trim(Flight) != "") {
                //function (cntrlId, enable, clearAllValue, bgcolor)
                cfi.EnableAutoComplete(CurTr.find("input[id^=Origin]").attr("id"), false, false, "#F0F0F0");
                cfi.EnableAutoComplete(CurTr.find("input[id^=Destination]").attr("id"), false, false, "#F0F0F0");
                cfi.EnableAutoComplete(CurTr.find("input[id^=Airline]").attr("id"), false, false, "#F0F0F0");
            }
            else {
                cfi.EnableAutoComplete(CurTr.find("input[id^=Origin]").attr("id"), true, false, "#FFFFFF");
                cfi.EnableAutoComplete(CurTr.find("input[id^=Destination]").attr("id"), true, false, "#FFFFFF");
                cfi.EnableAutoComplete(CurTr.find("input[id^=Airline]").attr("id"), true, false, "#FFFFFF");
            }

            CurTr = null;
            Flight = null;
        }
    });
}