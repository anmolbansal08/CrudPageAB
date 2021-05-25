
var tableElement = new Array("Value","Effect", "Percentage", "StartTime", "EndTime");
var alphabettypes = [{ Key: "+", Text: "+" }, { Key: "-", Text: "-"}];
var checkedChange = true;
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
function validateTime(obj) {
    var startWeight = $(obj).closest("tr").find("input[id*='StartTime']");
    var endWeight = $(obj).closest("tr").find("input[id*='EndTime']");
    var stWt = parseFloat(startWeight.val());
    var endWt = parseFloat(endWeight.val());
    if (startWeight.val() == "" || endWeight.val() == "" || stWt.toString() == "NaN" || endWt.toString() == "NaN") {
        return false;
    }
    else if (stWt >= endWt) {
        return false;
    }
    else {
        return true;
    }
}
function addRow(obj, NameOfClass) {
    var currentRow = $(obj).closest('tr');
    if (!cfi.IsValidSection($(obj).closest('tr').attr("id"))) {
        return;
    }
    if (!validateTime(obj)) {
        alert("Enter valid Time");
        return;
    }
    var currentRowIndex = $(obj).closest('tr')[0].rowIndex;
    var currentCellIndex = $(obj).closest('td').index();
    var currentBucketClass = $(obj).closest('td').find('input:hidden').val();
    var curParent = currentRow.attr("parent");
    currentIndex++;
    var elencb = $(String.Format('<tr parent="{0}" id="row{1}"></tr>', curParent.toString(), currentIndex.toString()));
    elencb.append($(String.Format('<td bucket="{0}">&nbsp;{0} <input type="hidden" value="{1}"></td>', NameOfClass.toString(), "DR")).attr({ "class": "formInputcolumn" }));
    $.each(tableElement, function () {
        var ele = $('<td></td>');
        ele.attr({ class: 'formInputcolumn' });
        ele.append(getInputControl(this.toString()))
        elencb.append(ele);
    })
    var link = String.Format('<td colspan="4"><a href="javascript:void(0);" onclick="return addRow(this,{0});">Add</a></td>', "'" + NameOfClass + "'");
    eleRemoveAdd = $(link).attr({ "class": "formInputcolumn" });
    eleRemoveAdd.append($("<span>&nbsp;<span>"));
    eleRemoveAdd.append($('<a href="javascript:void(0);" onclick="return removeRow(this);">remove</a>'));
    eleRemoveAdd.append($(String.Format('<input type="hidden" id="BucketClass{0}" value="{1}">', currentIndex.toString(), currentBucketClass.toString())));
    elencb.append(eleRemoveAdd);
    var table = $("#tblWebFormTable");
    currentRow.after(elencb);
    $("#StartTime" + currentIndex.toString()).val(currentRow.find("input[id*=EndTime]:visible").val());
    var endval = parseInt(currentRow.find("input[id*=EndTime]:visible").val(), 10) + (parseInt(currentRow.find("input[id*=EndTime]:visible").val(), 10) - parseInt(currentRow.find("input[id*=StartTime]:visible").val(), 10));
    endval = isNaN(endval) ? "0" : endval.toString();
    $("#EndTime" + currentIndex.toString()).val(endval);
    currentRow.find("input[id*=StartTime]:visible").attr({ "disabled": true });
    currentRow.find("input[id*=EndTime]:visible").attr({ "disabled": true })
    currentRow.find('a').each(function () {
        $(this).hide();
    })
    cfi.DateType("ValidFrom" + currentIndex.toString());
    cfi.DateType("ValidTo" + currentIndex.toString());
    cfi.Numeric("Value" + currentIndex.toString(), 0);
    cfi.Numeric("StartTime" + currentIndex.toString(), 0);
    cfi.Numeric("EndTime" + currentIndex.toString(), 0);
    $("#Value" + currentIndex.toString()).closest("td").find("input[id*='_temp']").css({ "text-align": "right" }).attr({ name: "_temp" + "Value" + currentIndex.toString(), id: "_temp" + "Value" + currentIndex.toString() });
    $("#StartTime" + currentIndex.toString()).closest("td").find("input[id*='_temp']").attr({ name: "_temp" + "StartTime" + currentIndex.toString(), id: "_temp" + "StartTime" + currentIndex.toString() });
    $("#EndTime" + currentIndex.toString()).closest("td").find("input[id*='_temp']").attr({ name: "_temp" + "EndTime" + currentIndex.toString(), id: "_temp" + "EndTime" + currentIndex.toString() });
    cfi.AutoCompleteByDataSource(String.Format('Effect{0}', (currentIndex).toString()), alphabettypes);
    cfi.ValidateSection(String.Format("row{0}", (currentIndex).toString()));
}

function removeRow(obj) {
    var currentRowIndex = $(obj).closest('tr')[0].rowIndex;
    var colIndex = $(obj).closest('td').index();
    var controlCell = $("#tblWebFormTable tr:eq(" + (currentRowIndex - 1).toString() + ") td:eq(" + (colIndex).toString() + ")");
    $(obj).closest("tr").prev('tr').find('a').each(function () {
        $(this).show();
    })
    $(obj).closest("tr").prev('tr').find("input[id*=StartTime]:visible").attr({ "disabled": false });
    $(obj).closest("tr").prev('tr').find("input[id*=EndTime]:visible").attr({ "disabled": false });
    $(obj).closest('tr').remove();
}

function getInputControl(typeOfVariable) {
    var input = $('<input type="text"/>');
    switch (typeOfVariable) {
        case 'Effect':
            input = $('<span></span>');
            var input1 = $('<input type="text"/>');
            input1.attr({ controltype: "autocomplete", value: '+', allowchar: '+-', id: "Text_Effect" + currentIndex.toString(), maxlength: 1, 'data-valid': 'required', 'data-valid-msg': 'Effect cannot be blank', name: "Text_Effect" + currentIndex.toString() });
            input1.css({ "width": "30px" });
            var inputHdn = $(String.Format("<input type='hidden' value='+' name=Effect{0} data-type='EFFECT'>", currentIndex.toString()));
            input.append(inputHdn);
            input.append(input1);
          
            break;
        case 'Value':
            input.attr({ maxlength: "5", id: "Value" + currentIndex.toString(), 'data-role': 'numerictextbox', 'data-valid': 'required', controltype: 'number', class: 'k-input', name: 'Value' + currentIndex.toString(), 'data-valid-msg': 'Value cannot be blank','data-type':'VALUE' });
            input.css({ "text-align": "right" });
            break;
        case 'Percentage':
            if (checkedChange) {
                input = $(String.Format("<input id='Percentage{0}'  type='radio' value='0' checked='True' data-type='PERCENTAGE' name='Percentage{0}'>Yes<input id='Percentage{0}' class='' type='radio' value='1' name='Percentage{0}' data-type='PERCENTAGE'>No<span><span>", currentIndex.toString()));
            }
            else {
                input = $(String.Format("<input id='Percentage{0}' data-type='PERCENTAGE' type='radio' value='0' name='Percentage{0}'>Yes<input id='Percentage{0}' data-type='PERCENTAGE' class='' type='radio' value='1' name='Percentage{0}' checked='True'>No<span><span>", currentIndex.toString()));
            }
            input.attr({ id: "Percentage" + currentIndex.toString(), 'data-valid': 'required', 'data-valid-msg': 'Value cannot be blank' });
            break;
        case 'ValidFrom':
            input.attr({ 'data-valid': 'required', 'data-valid-msg': 'Valid From cannot be blank', id: "ValidFrom" + currentOriginDestination.toString(), name: "ValidFrom" + currentOriginDestination.toString(), controltype: 'datetype', 'data-role': 'datepicker','data-type':'VALIDFROM' });
            cfi.DateType("ValidFrom" + currentOriginDestination.toString());
            break;
        case 'ValidTo':
            input.attr({ 'data-valid': 'required', 'data-valid-msg': 'Valid To cannot be blank', id: "ValidTo" + currentOriginDestination.toString(), name: "ValidTo" + currentOriginDestination.toString(), controltype: 'datetype', 'data-role': 'datepicker', 'data-type': 'VALIDTO' });
            cfi.DateType("ValidTo" + currentOriginDestination.toString());
            break;
        case 'StartTime':
            input.attr({ 'data-valid': 'required', 'data-valid-msg': 'Start Time cannot be blank', class: 'k-input', maxlength: "5", id: "StartTime" + currentIndex.toString(), controltype: "number", 'data-type': 'STARTTIME' });
            input.css({ "text-align": "right", "maxlength": "5" });

            break;
        case 'EndTime':
            input.attr({ 'data-valid': 'required', 'data-valid-msg': 'End Time cannot be blank', class: 'k-input', maxlength: "5", id: "EndTime" + currentIndex.toString(), controltype: 'number', 'data-type': 'ENDTIME' });
            input.css({ "text-align": "right", "maxlength": "5" });
            break;
        case 'AirlineName':
            input = $('<span></span>');
            var input1 = $('<input type="text"/>');
            input1.attr({ controltype: "autocomplete", id: "Text_AirlineName" + currentOriginDestination.toString(), name: "Text_AirlineName" + currentOriginDestination.toString() });
            var inputHdn = $(String.Format("<input type='hidden' id=AirlineName{0} name=AirlineName{0} data-type='AIRLINECODE'>", currentOriginDestination.toString()));
            input.append(inputHdn);
            input.append(input1);
          
            break;
        case 'Origin':
            input = $('<span></span>');
            var input1 = $('<input type="text"/>');
            input1.attr({ controltype: "autocomplete", id: "Text_Origin" + currentOriginDestination.toString(), 'data-valid-msg': 'Origin cannot be blank', name: "Text_Origin" + currentOriginDestination.toString() });
            var inputHdn = $(String.Format("<input type='hidden' id=Origin{0} name=Origin{0}  data-type='ORIGIN'>", currentOriginDestination.toString()));
            input.append(inputHdn);
            input.append(input1);
          
            break;
        case 'Destination':
            input = $('<span></span>');
            var input1 = $('<input type="text"/>');
            input1.attr({ controltype: "autocomplete", id: "Text_Destination" + currentOriginDestination.toString(),  name: "Text_Destination" + currentOriginDestination.toString() });
            var inputHdn = $(String.Format("<input type='hidden' id=Destination{0} name=Destination{0}  data-type='DESTINATION'>", currentOriginDestination.toString()));
            input.append(inputHdn);
            input.append(input1);
          
            break;
        case 'CustomerName':
            input = $('<span></span>');
            var input1 = $('<input type="text"/>');
            input1.attr({ controltype: "autocomplete", id: "Text_CustomerName" + currentOriginDestination.toString(), maxlength: 1, name: "Text_CustomerName" + currentOriginDestination.toString() });

            var inputHdn = $(String.Format("<input type='hidden' name=CustomerName{0}  data-type='CUSTOMER'>", currentOriginDestination.toString()));
            input.append(inputHdn);
            input.append(input1);
          
            break;
        case 'PenaltyType':
            input = $('<span></span>');
            var input1 = $('<input type="text"/>');
            input1.attr({ controltype: "autocomplete", id: "Text_PenaltyType" + currentOriginDestination.toString(), maxlength: 1, 'data-valid': 'required', 'data-valid-msg': 'Penalty Type cannot be blank', name: "Text_PenaltyType" + currentOriginDestination.toString() });

            var inputHdn = $(String.Format("<input type='hidden' name=PenaltyType{0}  data-type='PENALTYTYPE'>", currentOriginDestination.toString()));
            input.append(inputHdn);
            input.append(input1);
          
            break;
        case 'FlightName':
            input = $('<span></span>');
            var input1 = $('<input type="text"/>');
            input1.attr({ controltype: "autocomplete", id: "Text_FlightName" + currentOriginDestination.toString(),  name: "Text_FlightName" + currentOriginDestination.toString() });
            var inputHdn = $(String.Format("<input type='hidden' id=FlightName{0} name=FlightName{0}  data-type='FLIGHTNO'>", currentOriginDestination.toString()));
            input.append(inputHdn);
            input.append(input1);
            break;
        default:

            break;
    }
    return input;
}

function checkValidity(obj) {
    var flag = true;
    $(obj).closest("tr").find("input[id*='Origin'],input[id*='Destination']").each(function () {
        if ($.trim($(this).val()) == "") {
            flag = false;
            return;
        }
    })
    return flag;
}
function addBlock(obj) {

    var CurRow = $(obj).closest("tr");
    var NextRow = $(obj).closest("tr").next("tr");
    var parent = CurRow.attr("parent");
   
    if (!$("tr[parent=" + parent + "]:last").is(":visible"))
    {
        CallMessageBox('info', 'Penalty Charges', 'Please Search first');
        return;
    }
    var curRowId = $(obj).closest("tr").attr("id");
    var headRowB = cfi.IsValidSection(curRowId);
    var headRowA = cfi.IsValidSection(curRowId.replace('A', 'B'));
    if (!(headRowA && headRowB)) {
        return;
    }
    if ((CurRow.find("input[id^=AirlineName]").val() == "" && CurRow.find("input[id^=FlightName]").val() == "" && CurRow.find("input[id^=Origin]").val() == "" && CurRow.find("input[id^=Destination]").val() == "")) {
        CallMessageBox('info', 'Penalty Charges', 'Enter Either Airline Name,Flight No, Origin or Destination');
        return;
    }

    $(obj).closest("td").find('a').each(function () {
        $(this).hide();
    })
    var checkedChange = true;
    currentOriginDestination++;
    //"Effect","Percentage","StartTime","EndTime"
    var elehead = $('<tr style="display:none">' +
                '<td class="formSection">Class</td>' +
                 '<td class="formSection">Value</td>' +
                '<td class="formSection">Effect</td>' +
                '<td class="formSection">Percentage</td>' +
                '<td class="formSection">StartTime(mins)</td>' +
                '<td class="formSection" >EndTime(mins)</td>' +
                '<td class="formSection" colspan="4">Action</td>' +
               '</tr>');
    var eleEmptyRow = $('<tr style="display:none">' +
                '<td class="formSection">&nbsp</td>' +
                '<td class="formSection"></td>' +
                '<td class="formSection"></td>' +
                '<td class="formSection"></td>' +
                //'<td class="formSection"></td>' +
    //'<td class="formSection"></td>' +
                '<td class="formSection"></td>' +
                '<td class="formSection"></td>' +
                '<td class="formSection" colspan="4"></td>' +
               '</tr>');
    var eleHead = $("<tr></tr>");

    eleHead.append($("<td class='formlabelMandatory' ><span style='color:#0431B4'>@ Airline</span><input type='hidden'value='HR1' data-type='HR1'/></td>"));
    eleHead.append($("<td class='formInputcolumn' ></td>").append(getInputControl("AirlineName")));
    eleHead.append($("<td class='formlabelMandatory' ><span style='color:green'># Origin</span></td>"));
    eleHead.append($("<td class='formInputcolumn' ></td>").append(getInputControl("Origin")));
    eleHead.append($("<td class='formlabelMandatory' ><span style='color:green'># Destination</span></td>"));
    eleHead.append($("<td class='formInputcolumn' ></td>").append(getInputControl("Destination")));
    eleHead.append($("<td class='formlabelMandatory' ><span style='color:purple'>$ Flight No</span></td>"));
    eleHead.append($("<td class='formInputcolumn' ></td>").append(getInputControl("FlightName")));
    eleHead.append($("<td class='formInputcolumn' rowspan='2'>"
                    + "<a><input class='buttontolink' type='button' value='Search' id='btnChkButton" + currentOriginDestination + "'/></a>"
                    + "<a href='javascript:void(0);' onclick='return addBlock(this);' class=''>Add<a/>"
                    + "<span>&nbsp;</span>"
                    + "<a href='javascript:void(0);' onclick='return removeBlock(this);' class=''>Remove<a/>"
                    + "</td>")
                    );

    eleHead.attr({ parent: currentOriginDestination.toString(), id: currentOriginDestination.toString() + "A" });

    var eleHead2 = $("<tr ></tr>");
    eleHead2.append($("<td class='formlabelMandatory' >Penalty Type*<input type='hidden'value='HR2' data-type='HR2'/></td>"));
    eleHead2.append($("<td class='formInputcolumn' ></td>").append(getInputControl("PenaltyType")));
    eleHead2.append($("<td class='formlabelMandatory' >Customer Type</td>"));
    eleHead2.append($("<td class='formInputcolumn' ></td>").append(getInputControl("CustomerName")));
    eleHead2.append($("<td class='formlabelMandatory' >Valid To*</td>"));
    eleHead2.append($("<td class='formInputcolumn' ></td>").append(getInputControl("ValidFrom")));
    eleHead2.append($("<td class='formlabelMandatory' >Valid To*</td>"));
    eleHead2.append($("<td class='formInputcolumn' ></td>").append(getInputControl("ValidTo")));
    eleHead2.attr({ parent: currentOriginDestination.toString(), id: currentOriginDestination.toString() + "B" });
    //increase index to generate new ids of the controls

    var table = $(".WebFormTable");
    eleEmptyRow.attr({ parent: currentOriginDestination.toString() });
    eleHead.attr({ parent: currentOriginDestination.toString() });
    eleHead2.attr({ parent: currentOriginDestination.toString() });
    elehead.attr({ parent: currentOriginDestination.toString() });
    table.append(eleEmptyRow);
    table.append(eleHead);
    table.append(eleHead2);
    table.append(elehead);

    $.each(BucketClasses, function (key, value) {
        currentIndex++;
        var elencb = $(String.Format('<tr id="row{0}"></tr>', currentIndex.toString()));
        elencb.append($(String.Format('<td bucket="' + value + '">&nbsp;' + value + '<input type="hidden"  value="{0}"></td>', "DR")).attr({ "class": "formInputcolumn" }));
        $.each(tableElement, function () {
            var ele = $('<td></td>');
            ele.attr({ class: 'formInputcolumn' });
            ele.append(getInputControl(this.toString()))
            elencb.append(ele);
        })
        var link = String.Format('<td colspan="4"><a href="javascript:void(0);" onclick="return addRow(this,{0});">Add</a> <input type="hidden" id="BucketClass{2}" value="{1}"></input></td>', "'" + value + "'", BucketClassesSNo[key].toString(), currentIndex.toString());

        if (BucketPriority[key] == '0') {
            elencb.find("input").attr({ "disabled": true });
            elencb.find("input[id^=Value],input[id^=StartTime],input[id^=EndTime]").val('0');
            elencb.addClass("PreSold");
            link = String.Format('<td colspan="4"><input type="hidden" id="BucketClass{2}" value="{1}"></input></td>', "'" + value + "'", BucketClassesSNo[key].toString(), currentIndex.toString());
        }
        elencb.append($(link).attr({ "class": "formInputcolumn" }));
        elencb.css({display:'none'});
        elencb.attr({ parent: currentOriginDestination.toString() });
        table.append(elencb);

    });

    //Set Child controls datatype
    for (var i = 0; i < BucketClasses.length; i++) {
        cfi.Numeric("Value" + (currentIndex - i).toString(), 0);
       
        cfi.Numeric("StartTime" + (currentIndex - i).toString(), 0);
        cfi.Numeric("EndTime" + (currentIndex - i).toString(), 0);
        
        $("#StartTime" + (currentIndex - i).toString()).closest("td").find("input[id*='_temp']").attr({ name: "_temp" + "StartTime" + (currentIndex - i).toString(), id: "_temp" + "StartTime" + (currentIndex - i).toString() });
        $("#EndTime" + (currentIndex - i).toString()).closest("td").find("input[id*='_temp']").attr({ name: "_temp" + "EndTime" + (currentIndex - i).toString(), id: "_temp" + "EndTime" + (currentIndex - i).toString() });
        $("#Value" + (currentIndex - i).toString()).closest("td").find("input[id*='_temp']").attr({ name: "_temp" + "Value" + (currentIndex - i).toString(), id: "_temp" + "Value" + (currentIndex - i).toString() });
        cfi.AutoCompleteByDataSource(String.Format('Effect{0}', (currentIndex - i).toString()), alphabettypes);
        cfi.ValidateSection(String.Format("row{0}", (currentIndex - i).toString()));
    }
    //Set Header Control's Data Type
    cfi.DateType("ValidFrom" + currentOriginDestination.toString());
    cfi.DateType("ValidTo" + currentOriginDestination.toString());
    $("#" + String.Format('Origin{0}', currentOriginDestination.toString())).focus();
//    var loc = $("#" + String.Format('Origin{0}', currentOriginDestination.toString())).position();
//    $("html, body").animate({ scrollTop: loc.top }, "slow");
    cfi.AutoComplete(String.Format('Origin{0}', currentOriginDestination.toString()), 'CityName,CityCode', 'City', 'CityCode', 'CityCode', ['CityCode', 'CityName'], null, "contains");
    cfi.AutoComplete(String.Format('Destination{0}', currentOriginDestination.toString()), 'CityName,CityCode', 'City', 'CityCode', 'CityCode', ['CityCode', 'CityName'], null, "contains");
    cfi.AutoComplete(String.Format('PenaltyType{0}', currentOriginDestination.toString()), "PenaltyTypeName", "Penalty", "SNo", "PenaltyTypeName");
    cfi.AutoComplete(String.Format('CustomerName{0}', currentOriginDestination.toString()), "CustomerName", "CustomerType", "SNo", "CustomerName");
    cfi.AutoComplete(String.Format('AirlineName{0}', currentOriginDestination.toString()), "AirlineName,AirlineCode", "Airline", "AirlineCode", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("FlightName" + currentOriginDestination.toString(), "FlightNo", "vDailyFlight", "FlightNo", "FlightNo");
    cfi.ValidateSection(String.Format("{0}A", currentOriginDestination.toString()));
    cfi.ValidateSection(String.Format("{0}B", currentOriginDestination.toString()));
}
function removeBlock(obj) {
    var currentRow = $(obj).closest('tr');
    var curRowIndex = $(obj).closest('tr')[0].rowIndex;
    var curParent = currentRow.attr("parent");
    //var prevParent = $("#tblWebFormTable tr:eq(" + (parseInt(curRowIndex, 10) - nosOfCommonRows).toString() + ")").attr("parent");

    $(String.Format('#tblWebFormTable tr[parent="{0}"]', curParent.toString())).remove();
    // console.log(parseInt(currentOriginDestination - 1, 10) == 0 ? "0" : "1");
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
                    str += $(this).attr("data-type") == undefined ? ":" + $(this).val()+"~" : $(this).attr("data-type").toString() + ":" + $(this).attr("checked") == "checked" ? "Yes" + "~" : "No" + "~";
                }
                if ($(this).attr('type') != "radio") {
                    str += $(this).attr("data-type") == undefined ? ":" + $(this).val() + "~" : $(this).attr("data-type").toString() + ":" + $(this).val() + "~";
                }
            });

        })
        hdnData.val(hdnData.val() + str + bucket);
        str = "";
    });
    var flag = true;
    $("input[id^=AirlineName]").each(function () {
        var suf = $(this).attr("id").replace("AirlineName", "");
        if ($("#AirlineName" + suf).val() == "" && $("#FlightName" + suf).val() == "" && $("#Origin" + suf).val() == "" && $("#Destination" + suf).val() == "") {
            flag = false;
            CallMessageBox('info', 'Penalty Charges', 'Enter Either Airline Name,Flight No, Origin or Destination');
            return
        }
    });
    return flag;
}

$(document).ready(function () {
    cfi.ValidateForm();
    try {
        cfi.DateType("ValidFrom");
        cfi.DateType("ValidTo");
        var alphabettypes = [{ Key: "+", Text: "+" }, { Key: "-", Text: "-"}];
        $("input[id*=Effect]:hidden").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("id").toString(), alphabettypes);
        })
        cfi.AutoComplete("BucketClassSNo", "Name", "BucketClass", "SNo", "Name");
        cfi.AutoComplete("CustomerName", "CustomerName", "CustomerType", "SNo", "CustomerName");
        cfi.AutoComplete("AirlineName", "AirlineName,AirlineCode", "Airline", "AirlineCode", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");
        cfi.AutoComplete("PenaltyType", "PenaltyTypeName", "Penalty", "SNo", "PenaltyTypeName");
        cfi.AutoComplete("Origin", "CityName,CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");
        cfi.AutoComplete("Destination", "CityName,CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");
        cfi.AutoComplete("FlightName", "FlightNo", "vDailyFlight", "FlightNo", "FlightNo");
        cfi.ValidateSection("0A");
        cfi.ValidateSection("0B");
        try {
            for (var i = 1; i <= currentIndex; i++) {
                cfi.ValidateSection(String.Format("row{0}", i.toString()));
                cfi.Numeric("Value" + i.toString(), 0);
                cfi.Numeric("StartTime" + i.toString(), 0);
                cfi.Numeric("EndTime" + i.toString(), 0);
                $("#Value" + i.toString()).closest("td").find("input[id*='_temp']").attr({ name: "_temp" + "Value" + i.toString(), id: "_temp" + "Value" + i.toString() });
                $("#StartTime" + i.toString()).closest("td").find("input[id*='_temp']").attr({ name: "_temp" + "StartTime" + i.toString(), id: "_temp" + "StartTime" + i.toString() });
                $("#EndTime" + i.toString()).closest("td").find("input[id*='_temp']").attr({ name: "_temp" + "EndTime" + i.toString(), id: "_temp" + "EndTime" + i.toString() });
            }
        }
        catch (ecp) { }
        ExtraCondition("Origin");
        ExtraCondition("Destination");
    }
    catch (exp)
    { }


    $("input[name='operation'").click(function () {
        saveData();
    });


    $("input[id*=Percentage]").live("click", function () {
        checkedChange = $.trim($(this).val()) == "0";
    })
    function parseDate(val) {
        var dt = val.split("-");
        var date = new Date(dt[2], dt[1] - 1, dt[0]);
        return date;
    }
    $("input[id*=ValidTo]").live("change", function () {
        var startDt = parseDate($(this).closest("tr").find("input[id*=ValidFrom]").val());
        var endDt = parseDate($(this).val());
        //console.log(startDt > endDt);
        if (startDt > endDt) {
            $(this).val("");
        }
    })
    //date Validation on Date Input Box
    $("input[id^=ValidTo]").live("change", function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })

    $("input[id^=ValidFrom]").live("change", function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })
    $("input[id*='EndTime']:visible").live("change blur", function (e) {
        var curRow = $(this).closest("tr");
        var endWt = parseFloat($(this).val());
        var startWt = parseFloat($(this).closest("tr").find("input[id*='StartTime']:hidden").val());
        var curClass1 = $.trim(curRow.find("td:first").text());
        var curClass2 = $.trim(curRow.next('tr').find("td:first").text());
        var nextStart = parseFloat($(this).closest("tr").next('tr').find("input[id*='StartTime']:hidden").val());
        if (startWt > endWt || (endWt > nextStart && curClass1 == curClass2)) {
            $(this).closest("td").find("input:text").each(function () {
                $(this).val("");
            })
        }
    });
    $("input[id*='StartTime']:visible").live("change blur", function (e) {

        var curRow = $(this).closest("tr");
        var startWt = parseFloat($(this).val());
        var curClass1 = $.trim(curRow.find("td:first").text());
        var curClass2 = $.trim(curRow.prev('tr').find("td:first").text());
        var startWt = parseFloat($(this).val());
        var endWt = parseFloat($(this).closest("tr").find("input[id*='EndTime']:hidden").val());
        var prevEnd = parseFloat($(this).closest("tr").prev('tr').find("input[id*='EndTime']:hidden").val());

        prevEnd = isNaN(prevEnd) ? 0 : prevEnd;
        if (startWt > endWt || (startWt < prevEnd && curClass1 == curClass2)) {
            $(this).closest("td").find("input:text").each(function () {
                $(this).val("");
            })
        }
    });
    $("input[id^=Text_FlightName]").live("blur change", function () {
        var CurData = null;
        var Flight = $(this).val();
        var CurTr = $(this).closest("tr");

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
                        CurTr.find("input[id^=AirlineName],input[id^=Text_AirlineName]").val(CurData[2]);
                    }
                }
                else {
                    CurTr.find("input[id^=Origin],input[id^=Text_Origin]").val("");
                    CurTr.find("input[id^=Destination],input[id^=Text_Destination]").val("");
                    CurTr.find("input[id^=AirlineName],input[id^=Text_AirlineName]").val("");
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
    })
    $("input[id^=btnChkButton]").live("click", function () {
        var obj = $(this);
        var curRow = $(obj).closest("tr");
        var curNextRow = $(obj).closest("tr").next("tr");
        if ((curRow.find("input[id^=AirlineName]").val() == "" && curRow.find("input[id^=FlightName]").val() == "" && curNextRow.find("input[id^=Origin]").val() == "" && curNextRow.find("input[id^=Destination]").val() == "")) {
            CallMessageBox('info', 'Penalty Charges', 'Enter Either Airline Name,Flight No, Origin or Destination');
            return;
        }

        $.ajax({
            type: "GET",
            url: "./Services/PenaltyCharge/PenaltyChargesService.svc/IsActiveBucket",
            data: { AirlineCode: $(curRow).find("input[id^=AirlineName]").val(), Origin: $(curNextRow).find("input[id^=Origin]").val(), Destination: $(curNextRow).find("input[id^=Destination]").val(), FlightNo: $(curRow).find("input[id^=FlightName]").val() },
            dataType: "json",
            success: function (response) {
                if (response.Data.length > 0) {
                    BucketIsActive = response.Data;
                }
            },
            complete: function () {
                var parent = $(obj).closest("tr").attr("parent");
                var rows = $("tr[parent=" + parent + "]").filter("tr[id^=row]");
                var curRow = 0;
                var parent = $(obj).closest("tr").attr("parent");
                $("tr[parent=" + parent + "]").show();
                if (BucketIsActive.length > 0) {
                  
                    $(rows).each(function () {
                        var bclass = $(this).find("input[id*=BucketClass]").val();
                        var curIndex = $.inArray(bclass, BucketClassesSNo); //BucketClassesSNo.indexOf(bclass);

                        if (!BucketIsActive[curIndex]) {
                            $(this).addClass("IsActiveRow");
                            $(this).find("input[type=text]").removeAttr("data-valid");
                        }
                        else {
                            $(this).removeClass("IsActiveRow");
                            $(this).find("input[id^=Value],input[id^=StartTime],input[id^=EndTime]").attr({ "data-valid": "required" });
                        }
                        curRow++
                    })
                }
            }
        });
    })
})
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
