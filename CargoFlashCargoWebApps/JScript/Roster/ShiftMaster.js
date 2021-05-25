$(document).ready(function () {
    //cfi.ValidateForm();
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    //    // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
    //}
    //$('input.timepicker').timepicker({});

    //$("#TimeIn")
    //$("#TimeOut").kendoTimePicker();
    
    var dt = new Date();


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#TimeIn").css('width', '75px');
        $("#TimeOut").css('width', '75px');
        var start = $("#TimeIn").kendoTimePicker({
            format: "HH:mm",
        }).data("kendoTimePicker");

        //init end timepicker
        var end = $("#TimeOut").kendoTimePicker({
            format: "HH:mm"
        }).data("kendoTimePicker");


    }

});


