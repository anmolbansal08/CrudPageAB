$(document).ready(function () {
   // add changes by ARman ali , Date : 2017-11-01 for autoclose
    cfi.ValidateForm();
    //var BasedOnKey = [{ Key: "1", Text: "BKD" }, { Key: "2", Text: "FWB" }, { Key: "3", Text: "ATA" }, {Key:"4",Text:"ATD"}]
    //cfi.AutoCompleteByDataSource("BasedOn", BasedOnKey);
    cfi.AutoCompleteV2("BasedOn", "SNo,BasedOn", "Master_CityConnectionTime_BasedOn", null, "contains");
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('input[id=IsRouteSetting][value=1]').prop("checked", true);
    }
    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
});

 