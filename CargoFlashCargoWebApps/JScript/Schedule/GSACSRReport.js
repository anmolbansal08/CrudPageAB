$(document).ready(function () {
    var agentsno = "";
    cfi.AutoCompleteV2("Airline", "CarrierCode1,airlinename", "AgentAnalysisReport_Airline", null, "contains", ",", "", "", "", clearnext);
  //  cfi.AutoCompleteV2("Airline", "CarrierCode1,airlinename", "AgentAnalysisReport_Airline", null, "contains");
   // cfi.AutoCompleteV2("Airline", "CarrierCode1,airlinename", "AgentAnalysisReport_Airline", null, "contains", null, null, null, null, clearnext);
    cfi.AutoCompleteV2("AgentName", "Name", "GSACSRReport_Office", null, "contains");
    cfi.AutoCompleteV2("Currency", "CurrencyCode", "CTM_CurrencyCode", null, "contains");
  
    //if ($("#CSRbtnG").val() == 0) {
    //    cfi.EnableAutoComplete('Currency', false, false, null);//diasble
    //}
    //else { cfi.EnableAutoComplete('Currency', true, true, null) };//enable}

   // cfi.EnableAutoComplete('Airline', false, false, null);//diasble
    var YearSource = [{ Key: "2017", Text: "2017" }, { Key: "2018", Text: "2018" }, { Key: "2019", Text: "2019" }, { Key: "2020", Text: "2020" }];
    cfi.AutoCompleteByDataSource("Year", YearSource);

    var MonthSource = [{ Key: "1", Text: "January" }, { Key: "2", Text: "February" }, { Key: "3", Text: "March" }, { Key: "4", Text: "April" }, { Key: "5", Text: "May" }, { Key: "6", Text: "June" }, { Key: "7", Text: "July" }, { Key: "8", Text: "August" }, { Key: "9", Text: "September" }, { Key: "10", Text: "October" }, { Key: "11", Text: "November" }, { Key: "12", Text: "December" }];
    cfi.AutoCompleteByDataSource("Month", MonthSource); 

    var FortNightSource = [{ Key: "1", Text: "First Fortnight" }, { Key: "2", Text: "Second Fortnight" }];
    cfi.AutoCompleteByDataSource("FortNight", FortNightSource);
    $("input[id='BookingTypeAwb']").prop('checked', true);
    $("input[id='CSRbtnG']").prop('checked', true)
    if ($("#CSRbtnG").val() == '0')
    {
        cfi.EnableAutoComplete('Currency', false, false, null)
    }
    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "G9") {
        if (userContext.GroupName == "GSA") {
            $('input:radio[name=CSRbtn][value=0]').attr("disabled", true);
            $('[type="radio"][id="CSRbtnV"][value="1"]').attr("checked", true);
        }
    }

    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "G9" && userContext.GroupName == "GSA") {
        var AirlineCurrency;
        var AirlineSNo = userContext.AirlineSNo;
        

        $.ajax({
            url: "../SearchSchedule/AirlineCurrencyCode",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AirlineSNo: AirlineSNo
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (result) {
                AirlineCurrency = result;
            }
        });
        $('#Text_Airline_input').val(userContext.AirlineCarrierCode);
        $('#Airline').val(AirlineCurrency);
        cfi.EnableAutoComplete("Airline", false);
        $('#Text_AgentName_input').val(userContext.GroupName + '-' + userContext.OfficeName + '-' + userContext.CityCode);
        $('#AgentName').val(userContext.OfficeSNo);
        cfi.EnableAutoComplete("AgentName", false);
        //userContext.OfficeSNo
        //$("#Text_Airline").data("kendoAutoComplete").enable(false);
     
    }
    $('#btnSubmit').click(function () {
        //if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

        //    // alert('From Date can not be greater than To Date');
        //    $('#tbodygridbookingprofile').html('');
        //    $('#lblerror').html('From Date can not be greater than To Date').css({ 'color': 'red' });
        //    return false;;
        //}


        //else
        if (!cfi.IsValidSubmitSection()) {
            return false;
        }
        else {
            var d = new Date();
            var month = d.getMonth() + 1;
            var yrs = d.getFullYear();

            $('#lblerror').html('');
            var careerCode = "";
            if ($("input[name='CSRbtn']:checked").val() == '0') {
                careerCode = $('#Airline').val().split('-')[0] || "";
            } else {
                careerCode = $('#Text_Airline_input').val().split('-')[0] || "";
            }
            var Agentsno = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()

            var Year = $('#Year').val() == "" ? yrs : $('#Year').val();
            var Month = $('#Month').val() == "" ? month : $('#Month').val();
            var FortNightDate = $('#FortNight').val() == "" ? "0" : $('#FortNight').val();
            var Currency = $('#Currency').val() == "" ? "0" : $('#Currency').val();
            var CSRbtn = $("input[name='CSRbtn']:checked").val() == "" ? "0" : $("input[name='CSRbtn']:checked").val();
            var BookingType = $("input[name='BookingType']:checked").val() == "" ? "1" : $("input[name='BookingType']:checked").val();
            if (CSRbtn == 1) {
                $.ajax({
                    url: "../SearchSchedule/GetGSACSRReport",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        careerCode: careerCode, Agentsno: Agentsno, Year: Year, Month: Month, FortNightDate: FortNightDate, CurrencySNo: Currency, CSRbtn: CSRbtn, BookingType: BookingType
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        //$('#grid_bookingprofile').show();
                        $('#tbodygridbookingprofile').html('');

                        var Result = (result.Data);
                        var thead_body = "";
                        var thead_row = "";

                        if (Result.length > 0) {
                            $('#exportflight').show();
                            var container = $("#tbodygridbookingprofile");

                            container.append(Result);

                        }
                        else {
                            $("#tbodygridbookingprofile").append('<tr><td colspan="16" align="center">NO RECORD FOUND</td></tr>')
                        }
                    },
                    error: function (xhr) {
                        var a = "";
                    }

                });
            } else {

                $.ajax({
                    url: "../SearchSchedule/GenerateGSACSRReport",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        careerCode: careerCode, Agentsno: Agentsno, Year: Year, Month: Month, FortNightDate: FortNightDate, CurrencySNo: Currency, CSRbtn: CSRbtn, BookingType: BookingType
                    },
                    contentType: "application/json; charset=utf-8",
                    cache: false,
                    success: function (result) {
                        $('#tbodygridbookingprofile').html('');
                        var ResultStatus = result;
                        var msg = ResultStatus["Data"];
                        if (msg.indexOf('Generated') > 0) {

                            ShowMessage('success', 'Success - GSA CSR Report !', msg);

                            // navigateUrl('Default.cshtml?Module=Shipment&Apps=UldStack&FormAction=INDEXVIEW');
                        }

                        else {
                            ShowMessage('info', 'Info -GSA CSR Report !', 'CSR already generated in this Fortnight.');
                            //  ShowMessage('info', 'Info -GSA CSR Report !', ' Related Information Not Found.');
                        }
                    }
                });
            }
        }
    });
    $("#Text_Origin_input").unbind('select').bind('select', function () {

    });
    $("#CSRbtnG").change(function () {
        cfi.EnableAutoComplete('Currency', false, false, null)
        $("#Currency").val("");
        $("#Text_Currency_input").val("");
        $("#btnSubmit").val("Generate");
        // SelectAgentName();
    });
    $("#CSRbtnV").change(function () {
        cfi.EnableAutoComplete('Currency', true, true, null)
        $("#btnSubmit").val("View");
        // SelectAgentName();
    });
    $("#Text_Origin").change(function () {
        var end = this.value;
        var firstDropVal = $("#Origin").val();;
        // SelectAgentName();
    });
    //$("#Text_Airline_input").change(function () {
    //    var end = this.value;
    //    var firstDropVal = $("#Origin").val();
       
       
    //});
});

function clearnext()
{



    setTimeout(function () {
        //Added By Shivam // Purpose :- To Add month field in the dropdown of fortnight based on selection of flight
         var Airline= $("#Airline").val()

         if (Airline === "3O-9-MAD") {
           var FortNightSource = [{ Key: "3", Text: "Month" }];
           cfi.AutoCompleteByDataSource("FortNight", FortNightSource);
                }
        else {
           var FortNightSource = [{ Key: "1", Text: "First Fortnight" }, { Key: "2", Text: "Second Fortnight" }];
           cfi.AutoCompleteByDataSource("FortNight", FortNightSource);
            }

        var ARVAL = $('#Airline').val();
        var ar = ARVAL.split('-');
        $("#Currency").val(ar[1]);
        $('#Text_Currency_input').val(ar[2]);
    }, 300);
   
   
}

function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");

    if (textId == "Text_Airline") {
        //if (userContext.SysSetting.ClientEnvironment == 'G9' && userContext.GroupName == 'GSA') {


        //    cfi.setFilter(filterEmbargo, "AirlineCode", "eq", userContext.AirlineName.substring(0, 3));

        //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        //    return OriginCityAutoCompleteFilter2;
        //    //}
        //}
        //else {

            cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);
            // cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);

            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        //}
    }
    else if (textId == "Text_Origin") {
        // $('#Text_AgentName').val('');
        // $('#AgentName').val('');
        //cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);
        //// cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);

        //var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        //return OriginCityAutoCompleteFilter2;
        //if ($('#Text_Origin').val() != "")
        //{
        //    SelectAgentName();
        //}

    }
    else if (textId == "Text_AgentName") {
        if (userContext.SysSetting.ClientEnvironment == 'G9' && userContext.GroupName == 'GSA') {
        

            cfi.setFilter(filterEmbargo, "Sno", "eq", userContext.OfficeSNo);
        

                var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter2;
            //}
        }

    }
    //if(textId=="")

}

function SelectAgentName() {

    $.ajax({
        url: "../SearchSchedule/getAgentName",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#Origin").val() == "" ? 0 : $("#Origin").val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            debugger;
            agentsno = "";
            agentsno = result[0].AgentCode;
            if (agentsno == "") {
                agentsno = 0;
                $('#Text_AgentName').val('');
                $('#AgentName').val('');
                $('#Text_AgentName_input').val('');

            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
//function ExportToExcel_Flight() {
//    var today = new Date();
//    var dd = today.getDate();
//    var mm = today.getMonth() + 1;

//    var yyyy = today.getFullYear();
//    if (dd < 10) {
//        dd = '0' + dd;
//    }
//    if (mm < 10) {
//        mm = '0' + mm;
//    }
//    var today = dd + '_' + mm + '_' + yyyy;


//    var a = document.createElement('a');
//    var data_type = 'data:application/vnd.ms-excel';
//    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px">' + $('#tbl_bookingprofile').html() + '</table></body></html>';
//    //var table_div = '<table>' + $('#tbl_bookingprofile').html() + '</table>';
//    var table_html = table_div.replace(/ /g, '%20');
//    a.href = data_type + ', ' + table_html;
//    a.download = 'BookingProfile' + today + '_.xls';
//    a.click();

//    return false
//}

function ExportToExcel_GSACSR() {
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    else {
        var d = new Date();
        var dd = d.getDate();
        var month = d.getMonth() + 1;
        var yrs = d.getFullYear();


        var careerCode = $('#Airline').val().split('-')[0] || "";
        var Agentsno = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()

        var Year = $('#Year').val() == "" ? yrs : $('#Year').val();
        var Month = $('#Month').val() == "" ? month : $('#Month').val();
        var FortNightDate = $('#FortNight').val() == "" ? "0" : $('#FortNight').val();




        var yyyy = d.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (month < 10) {
            month = '0' + month;
        }
        var today = dd + '_' + month + '_' + yrs;



        var CurrencySNo = $('#Currency').val() == "" ? "0" : $('#Currency').val();
        var CSRbtn = "0"
        var BookingType = $("input[name='BookingType']:checked").val() == "" ? "1" : $("input[name='BookingType']:checked").val();
        if (careerCode != undefined && Year != undefined && Month != undefined && FortNightDate != undefined) {
            if (careerCode != "" && Year != "" && Month != "" && FortNightDate != "") {
                $.ajax({
                    url: "../SearchSchedule/GetGSACSRReport",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        careerCode: careerCode, Agentsno: Agentsno, Year: Year, Month: Month, FortNightDate: FortNightDate, CurrencySNo: CurrencySNo, CSRbtn: CSRbtn, BookingType: BookingType
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        if (result.Total > 0) {

                            var Result = (result.Data);

                            var a = document.createElement('a');
                            var data_type = 'data:application/vnd.ms-excel';
                            var table_div = Result;
                            var table_html = table_div.replace(/ /g, '%20');
                            //a.href = data_type + ', ' + table_html;
                            // a.download = 'GSACSRReport.xls';
                            var filename = 'GSACSRReport_' + today + '_.xls'; //  
                            exportToExcelNew(table_div, filename)
                            // a.click();
                            return false
                        }
                        else {
                            ShowMessage("info", "", "No Data Found...");
                        }
                    }
                });
            }
        }
    }
        
}

