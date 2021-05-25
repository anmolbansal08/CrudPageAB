//Javascript file for CityConnectionTime Page for binding Autocomplete

$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    var BasedOnList = [{ Key: "0", Text: "BKD" }, { Key: "1", Text: "FWB" }, { Key: "2", Text: "ETD" }]
    cfi.AutoCompleteByDataSource("BasedOn", BasedOnList);
    cfi.AutoComplete("ConnectionTypeSNo", "SNo,ConnectionTypeName", "vwConnectionType", "SNo", "ConnectionTypeName", ["ConnectionTypeName"], setfields, "contains");
    cfi.AutoComplete("AirlineCodeSNo", "CarrierCode,AirlineName", "v_airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");//Added by Shahbaz
    cfi.AutoComplete("AirportSNo", "SNo,AirportCode", "vwairport", "SNo", "AirportCode", ["AirportCode"], onSelectAirport, "contains");
    cfi.AutoComplete("AircraftSNo", "SNo,AircraftType", "vAirCraftGetList", "SNo", "AircraftType", ["AircraftType"], onSelectAircrafttype, "contains");
    cfi.AutoComplete("ProductSNo", "SNo,ProductName", "vwProduct", "SNo", "ProductName", ["ProductName"], onSelectProduct, "contains");
    cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
   // BindAutocomplete()
   
    $('#ConnectionTimeHr,#ConnectionTimeMin').css('text-align', 'right').on('keypress', function (e) {
        if (e.which != 8 && e.which != 0 && e.which != 9 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    $('#ConnectionTimeHr,#ConnectionTimeMin').on('blur', function () {
        if ($('#ConnectionTimeMin').val() >59)
        {
            ShowMessage('warning', '', "Min. can not be greater than 59.");
            $('#ConnectionTimeMin').val(0);
        }
        
        if(this.value=="")
        {
            this.value = 0;
        }
    });
   
    cfi.BindMultiValue("SPHCSNo", $("#Text_SPHCSNo").val(), $("#SPHCSNo").val());
    
   
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //onSelectAircrafttype();
        getslab();
        $('#ConnectionTimeHr').after('<span>&nbsp;Hr.&nbsp;&nbsp;</span>');
        $('#ConnectionTimeMin').after('<span>&nbsp;Min.&nbsp;&nbsp;</span>');
        
    }
    function setfields(){
        $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
        $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
        $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
        $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
       
        $('#Text_AircraftSNo').val('');
        $('#AircraftSNo').val('');
        $('#Text_ProductSNo').val('');
        $('#ProductSNo').val('');
        $('#Text_AirportSNo').val('');
        $('#AirportSNo').val('');
        $('#Text_SPHCSNo').val('');
        $('#SPHCSNo').val('');
        $('#divMultiSPHCSNo').remove();
        cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
        getslab();


    }
  

    function getslab() {
       // BindAutoComplete();
     
       

        var id = $("#ConnectionTypeSNo").val();
        if (id != "") {
            $.ajax({
                type: "GET",
                url: './Services/Master/CityConnectionTimeService.svc/GetDefault?id=' + parseInt(id),
                //data: { id: parseInt(id) },
                dataType: "json",
                success: function (response) {
                    var record = jQuery.parseJSON(response);
                    var myData = record.Table[0];
                    //   alert(myData.BasedOn);
                    $('#Text_BasedOn').val(myData.Text_BasedOn);
                    $('#BasedOn').val(myData.BasedOn);
                    if ((myData.IsRoot) == true) {
                        $('#IsRoot').val(0)
                        $('input[type="radio"][name="IsRoot"][value="0"]').prop("checked", 'checked');
                        $('#Text_BasedOn').data("kendoAutoComplete").enable(false);
                        $('input[type="radio"][name="IsRoot"]').attr("disabled", false);

                    }
                    else {
                        $('#IsRoot').val(1)
                        $('input[type="radio"][name="IsRoot"][value="1"]').prop("checked", 'checked');
                        $('#Text_BasedOn').data("kendoAutoComplete").enable(false);
                        $('input[type="radio"][name="IsRoot"]').attr("disabled", true);

                    }

                    // $("#IsRoot").prop('checked') == myData.IsRoot ? 0 : 1;
                    // alert(myData.IsRoot);
                }
            });
        }
    }

    $(document).on('drop', function () {
        return false;
    });
});

$('input[type="submit"][name="operation"]').click(function (e) {
    $('input[type="radio"][name="IsRoot"]').attr("disabled", false);
    $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
    $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
    $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
    $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
    //getslab();

    if ($('#ConnectionTimeHr').val() == 0 && $('#ConnectionTimeMin').val() == 0) {
        ShowMessage('warning', '', "Connection Time should be greater than 0.");
        e.preventDefault();
        return false;
    }
});



function ExtraCondition(textId) {
    var filterCityConnectionTime = cfi.getFilter("AND");

    if (textId == "Text_ConnectionTypeSNo") {
        try {
            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_AirportSNo") {
        try {

            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_AircraftSNo") {
        try {

            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_ProductSNo") {
        try {

            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_SPHCSNo") {
        try {

            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_AirlineCodeSNo") {
        try {
            cfi.setFilter(filterCityConnectionTime, "IsInterline", "eq", "0");
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }

}

function onSelectAircrafttype() {
    if ($("input[name='IsRoot']:checked").val() == '0') {
        if ($('#Text_AircraftSNo').val() == "") {
            ResetDropDown();
        }
        else {
       //     ResetDropDown();
            $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
            $('#Text_ProductSNo,#Text_SPHCSNo, #ProductSNo, #SPHCSNo, #Text_AirportSNo, #AirportSNo').val('');
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
            $('#Text_SPHCSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AirportSNo').data("kendoAutoComplete").enable(false);
           
            cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
            $('#divMultiSPHCSNo').remove();
            //   alert('yes')
        }
    }
    else {
        ResetDropDown();
        //  alert('no')
    }
}
function onSelectSHC() {
    if ($("input[name='IsRoot']:checked").val() == '0') {
        if ($('#Text_SPHCSNo').val() == "") {
            ResetDropDown();
        }
        else {
           // ResetDropDown();
            $('#Text_AircraftSNo,#Text_ProductSNo, #ProductSNo, #AircraftSNo,#Text_AirportSNo, #AirportSNo').val('');
        $('#Text_AircraftSNo').data("kendoAutoComplete").enable(false);
        $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
        $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
        $('#Text_AirportSNo').data("kendoAutoComplete").enable(false);
      
        
        }
      //  alert('yes')
    }
    else {
        ResetDropDown();
       // alert('no')
    }
}
        function onSelectProduct() {
            if ($("input[name='IsRoot']:checked").val() == '0') {
                if ($('#Text_ProductSNo').val() == "") {
                    ResetDropDown();
                }
                else {
                   // ResetDropDown();
                    $('#Text_AircraftSNo,#Text_SPHCSNo, #SPHCSNo, #AircraftSNo, #Text_AirportSNo, #AirportSNo').val('');
                    $('#Text_AircraftSNo').data("kendoAutoComplete").enable(false);
                    $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
                    $('#Text_SPHCSNo').data("kendoAutoComplete").enable(false);
                    $('#Text_AirportSNo').data("kendoAutoComplete").enable(false);
                    //  $('#divMultiSPHCSNo').remove();
                   
                    cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
                    $('#divMultiSPHCSNo').remove();
                } // alert('yes')
            }
            else {
                ResetDropDown();
                //alert('no')
            }
   
        }
// added by arman ali  Date 27 mar ,2017
        function onSelectAirport() {
            if ($("input[name='IsRoot']:checked").val() == '0') {
                if ($('#Text_AirportSNo').val() == "") {
                    ResetDropDown();
                }
                else {
                    // ResetDropDown();
                    $('#Text_AircraftSNo,#Text_SPHCSNo, #SPHCSNo, #AircraftSNo,#Text_ProductSNo, #ProductSNo').val('');
                    $('#Text_AircraftSNo').data("kendoAutoComplete").enable(false);
                    $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
                    $('#Text_SPHCSNo').data("kendoAutoComplete").enable(false);
                    $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
                    //  $('#divMultiSPHCSNo').remove();

                    cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
                    $('#divMultiSPHCSNo').remove();
                } // alert('yes')
            }
            else {
                ResetDropDown();
                //alert('no')
            }

        }

        $("input[name='IsRoot']").change(function () {
            // alert($('input:radio[name=IsDefault]:checked').val());
          
            if ($('input:radio[name=IsRoot]:checked').val() == "1") {
              //  $("#divMultiSPHCSNo").remove()
                $('#Text_AircraftSNo').val('');
                $('#Text_ProductSNo').val('');
                $('#Text_SPHCSNo').val('');
                $('#Text_AirportSNo').val('');
                $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
                $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
                $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
                $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
               
                cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
                $('#divMultiSPHCSNo').remove();
             //   $('#divMultiSPHCSNo').remove();
           //     $("#divMultiSlab").remove()

            }
           
        });
        function ResetDropDown() {
            $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
            $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
           
        }
        
          