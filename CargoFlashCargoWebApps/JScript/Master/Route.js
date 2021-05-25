
var route = ""

var spanval = ''




$(document).ready(function () {
    cfi.ValidateForm();
    var check = "";
  
  
});


if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    //$("divMultiLeg li").remove();
    //$('span[id="Routing"]').html('');

    //$("#Text_Leg").closest("span").hide();

    //$("#Text_Leg").removeAttr("data-valid");
    //$('#aspnetForm').attr("enctype", "multipart/form-data");

    //$("#Text_Leg").after('&nbsp;&nbsp;&nbsp;&nbsp;' + '<input type="button" name="demo" id="btnlegs" value="Legs"></input>');
    cfi.AutoCompleteV2("OriginAirportSNo", "AirportCode", "Route_OriginAirportSNo",GetLeg, "contains");
    cfi.AutoCompleteV2("DestinationAirportSNo", "AirportCode", "Route_OriginAirportSNo", GetLeg, "contains");
    cfi.AutoCompleteV2("Leg", "AirportCode", "Route_OriginAirportSNo", null, "contains", ",", null, null, null, GetLeg, true);

   // cfi.AutoComplete("OriginAirportSNo", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode"], GetLeg, "contains");
   // cfi.AutoComplete("DestinationAirportSNo", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode"], GetLeg, "contains");
   // cfi.AutoComplete("Leg", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode"], null, "contains", ",", null, null, null, GetLeg, true);
    cfi.BindMultiValue("Leg", $("#Text_Leg").val(), $("#Leg").val());
    $('#Text_OriginAirportSNo').data("kendoAutoComplete").enable(false);
    $('#Text_DestinationAirportSNo').data("kendoAutoComplete").enable(false);
    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $('#Text_OriginAirportSNo').data("kendoAutoComplete").enable(true);
        $('#Text_DestinationAirportSNo').data("kendoAutoComplete").enable(true);
    }
   
}


if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    $("divMultiLeg li").remove();
    $('span[id="Routing"]').html('');

    $("#Text_Leg").closest("span").hide();

    $("#Text_Leg").removeAttr("data-valid");
    $('#aspnetForm').attr("enctype", "multipart/form-data");

 
    cfi.AutoCompleteV2("OriginAirportSNo", "AirportCode", "Route_OriginAirportSNo", addOD, "contains");
    cfi.AutoCompleteV2("DestinationAirportSNo", "AirportCode", "Route_OriginAirportSNo", addOD, "contains");
    cfi.AutoCompleteV2("Leg", "AirportCode", "Route_OriginAirportSNo", null, "contains", ",", null, null, null, GetLeg, true);
    //cfi.AutoComplete("OriginAirportSNo", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode"], addOD, "contains");
    //cfi.AutoComplete("DestinationAirportSNo", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode"], addOD, "contains");
    //cfi.AutoComplete("Leg", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode"], null, "contains", ",", null, null, null, GetLeg, true);

  


}




function GetLeg(e) {
    if ($("#divMultiLeg").find("li[class='k-button']").not(":first").length >= 3) {
        ShowMessage('warning', 'Warning - Route!', "Cannot add more than 3 routes");
        e.preventDefault();
        //e.stopPropagation();
    }

    else {
        addleg();
    }

}


function RemoveLeg(e) {
    $("div[id$='divMultiLeg']").find("[id^='divMultiLeg']").each(function () {

        if ($("div[id='divMultiLeg']").find("span[name^='FieldKeyValuesLeg']").text().indexOf($(this)[0].id + ",") > -1) {
            var ViaRouteVal = $("div[id='divMultiLeg']").find("span[name^='FieldKeyValuesLeg']").text().replace($(this)[0].id + ",", '');
            $("div[id='divMultiLeg']").find("span[name^='FieldKeyValuesLeg']").text(ViaRouteVal);

        }
        else {
            var ViaRouteValfield = $(e.currentTarget).attr("id"); //$("div[id='divMultiLeg']").find("span[name^='FieldKeyValuesLeg']").text().replace($(this)[0].id, '');
            $("div[id='divMultiLeg']").find("span[name^='FieldKeyValuesLeg']").text(ViaRouteValfield);

        }
        $("div[id='divMultiLeg']").find("input:hidden[name^='Multi_Leg']").val($("div[id='divMultiLeg']").find("span[name^='FieldKeyValuesLeg']").text());
        addleg($(e.currentTarget).attr("id"));
    });
}

// for adding legs
function addleg(ViaRouteValfield) {

    var org = $("#Text_OriginAirportSNo").data("kendoAutoComplete").value();
    var Dest = $("#Text_DestinationAirportSNo").data("kendoAutoComplete").value();
    var legs = $("#Text_Leg").data("kendoAutoComplete").value();
    var viaRout = '';

    setTimeout(function () {
        $("#divMultiLeg").find("li span:first-child").each(function () {
            viaRout += $(this).text() + "-";
        });

      
       
       


            if (org != '') {
                spanval = org;
            }
            if (Dest != '') {
                spanval = org + '-' + Dest;
            }
            if (viaRout != '') {
                spanval = org + '-' + viaRout + Dest;
            }
       
        

        $('span#Routing').text(spanval);
        $('span[id="Routing"]').val($('span#Routing').text(spanval));
        $('input:hidden[id="Routing"]').val(spanval);

        $('#hdnText_Leg').val(spanval);
       
    }, 10);





}

function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");

    if (textId.indexOf("OriginAirportSNo") >= 0 || (textId.indexOf("DestinationAirportSNo") >= 0)) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginAirportSNo", "DestinationAirportSNo").replace("Text_DestinationAirportSNo", "OriginAirportSNo")).val());
       cfi.setFilter(f, "SNo", "notin", $("#Leg").val());
    }
    else if (textId.indexOf("Leg") >= 0 && ($('#OriginAirportSNo').val() == 0 || $('#DestinationAirportSNo').val() == 0)) {
        ShowMessage('warning', 'Need Your Kind Attention - Route!', "select origin and destination First");
        cfi.setFilter(f, "SNo", "eq", "0");
    }
    else if (textId.indexOf("Leg") >= -1 && ($('#OriginAirportSNo').val() > 0 && $('#DestinationAirportSNo').val() > 0)) {
        cfi.setFilter(f, "SNo", "notin", $("#Leg").val());
        cfi.setFilter(f, "SNo", "neq", $('#DestinationAirportSNo').val());
        cfi.setFilter(f, "SNo", "neq", $('#OriginAirportSNo').val());

    }
    return cfi.autoCompleteFilter([f]);
}


//for deleting legs
function AutoCompleteDeleteCallBack(e, div, textboxid) {
    if (textboxid == "Text_Leg" && div == "divMultiLeg") {
        var target = e.target; // get current Span.
        var DivId = div; // get div id.
        var textboxid = textboxid; // get textbox id.
        var mid = textboxid.replace('Text', 'Multi');

        var arr = $("#" + mid).val().split(',');
        var idx = arr.indexOf($(this)[0].id);
        arr.splice(idx, $(e.target).attr("id"));
        var idx = arr.indexOf($(e.target).attr("id"));
        arr.splice(idx, 1);
        $("#" + mid).val(arr);
        $("#" + textboxid.replace('Text_', '')).val(arr);

        RemoveLeg(e);
        // to clear routong
        addleg();
    }
}

// for adding origin and destination
function addOD() {
    var org = $('#Text_OriginAirportSNo').val();
    var Dest = $('#Text_DestinationAirportSNo').val();
    var viaRout = '';
    var spanval = ''
    
    if ($.browser.safari == undefined) {
        for (i = 1; i < $('#divMultiLeg li').length; i++) {
            if (viaRout == '') {
                viaRout = $('#divMultiLeg li')[i].innerText;
            }
            else {
                viaRout = viaRout + '-' + $('#divMultiLeg li')[i].innerText;
            }
        }
    }
    else {
        var val = $('#Text_Leg').val().substring(0, 3);

        for (i = 1; i < $('#divMultiLeg li').length; i++) {
            if (viaRout == '') {
                if ($('#divMultiLeg li')[i].innerText == val)
                    val = '';
                viaRout = $('#divMultiLeg li')[i].innerText;
            }
            else {
                if ($('#divMultiLeg li')[i].innerText == val)
                    val = '';
                viaRout = viaRout + '-' + $('#divMultiLeg li')[i].innerText;
            }
        }

        if (viaRout == '') {
            viaRout = val;
        }
        else {
            if (val != '')
                viaRout = viaRout + '-' + val;
        }
    }
    //var viaRout = $('#divMultiViaRoute li').text();
    if (org != '') {
        spanval = org;
    }
    if (Dest != '') {
        spanval = org + '-' + Dest;
    }
    if (viaRout != '') {
        spanval = org + '-' + viaRout + '-' + Dest;
    }
    $('span#Routing').text(spanval);
    $('#hdnTextViaRoute').val(spanval);
    var spans = document.getElementsByTagName("span");
    $('input:hidden[id="Routing"]').val(spanval);

    $('#hdnText_Leg').val(spanval);
   



    
}



   


















