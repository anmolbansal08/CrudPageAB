$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("Divisions", "SNo,Division", "SpecialHandlingCode_Divisions", null, "contains", ",");
    cfi.AutoCompleteV2("DGClass", "SNo,ClassName", "SpecialHandlingCode_DGClass",  null, "contains");
    cfi.BindMultiValue("Divisions", $("#Text_Divisions").val(), $("#Divisions").val());


    $("#SHCStatement").css('text-transform', 'uppercase');
    $("#MandatoryStatement,#StatementLabel,#PackingInstructionLabel").css('text-transform', 'uppercase');
    $("#SHCStatement,#MandatoryStatement,#StatementLabel,#PackingInstructionLabel").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var Charactors = "+*&@-/#()_;:<>$% ";    // allow only numbers [0-9] 
        var regex = /^[a-zA-Z0-9]*$/;    // allow only alphanumeric

        if (Charactors.indexOf(key) < 0 && !regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
    

    $('#Description').keypress(function (e) {

        if (e.keyCode != 44)
            return true;
        else
            return false;
    });
    $("#Code").on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $("#Code").on('drop', function () {
        return false;
    });

    $('#Code').keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })
    $('input:radio').change(function () {
      
        if ($('input:radio[name=IsDGR]:checked').val() == 1) {
            //cfi.ResetAutoComplete("IsDGR");
            $("#Text_DGClass").data("kendoAutoComplete").enable(false) 
            $("#Text_DGClass").data("kendoAutoComplete").value("") 
            $("#Text_Divisions").data("kendoAutoComplete").enable(false) 
            $("#Text_Divisions").data("kendoAutoComplete").value("")
            $("#DGClass").val("");
            $("#Divisions").val("");
            $('#divMultiDivisions ul').find('li').remove();
           
        }
        else {
            //cfi.ResetAutoComplete("IsDGR");
            $("#Text_DGClass").data("kendoAutoComplete").enable(true)
            $("#Text_Divisions").data("kendoAutoComplete").enable(true)
          
        }
    });

    //if ($('#IsDGR').prop('checked') == true) {
    //    //$("#DGClass").prop("readonly", false)
    //    $("#Text_DGClass").data("kendoAutoComplete").enable(false)
    //}
    //else {
    //    //$("#DGClass").prop("readonly", true)
    //    $("#Text_DGClass").data("kendoAutoComplete").enable(true)
    //}

    var time

    $('#IsDGR').change(function () {
        if ($(this).prop('checked') == true) {
            $("#DGClass").prop("readonly", false)
            //time = $.datepicker.formatDate('yy/mm/dd', new Date());
        }
        else {
            $("#DGClass").val(null)
            $("#DGClass").prop("readonly", true)
        }

    })

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('input[type="radio"][name="IsAllowLateAcceptance"][data-radioval="No"]').click();
    }

});

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_Divisions") {
        try {
            cfi.setFilter(filterAirline, "ClassSNo", "eq", $("#Text_DGClass").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}