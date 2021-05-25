/// <reference path="../../Scripts/references.js" />



$(document).ready(function () {


    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
      var Airline = [{ Key: "ALL", Text: "ALL" }, { Key: "JT", Text: "JT-LION AIR" }];
    }

    else {
        var airsno = userContext.AirlineName;
        var airlinesno = airsno.split('-');
        var Airline = [{ Key: "ALL", Text: "ALL" }, { Key: airlinesno[0], Text: userContext.AirlineCarrierCode }];
    }
    
    cfi.AutoCompleteByDataSource("Airline", Airline, null);
    cfi.AutoCompleteV2("Origin", "CityCode", "SearchTactRate_Origin", null, "contains");

    cfi.AutoCompleteV2("Destination", "CityCode", "SearchTactRate_Origin", null, "contains");



    $('#btnSubmit').click(function () {
     

        if (!cfi.IsValidSubmitSection()) {
            return false;
        }
        else {

            var Origin = $('#Text_Origin').val();
            var Destination = $('#Text_Destination').val();
            var Carrier = $('#Airline').val();
            $.ajax({
                url: "../SearchTactRate/GetTactRate_Slab",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    Origin: Origin, Destination: Destination, Carrier: Carrier
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    $('#theadid').html('');
                    $('#tbodyid').html('');
                    var Result = JSON.parse(result.Result).Table0
                    var thead_body = "";
                    var thead_row = "";

                    if (Result.length > 0) {

                        for (var i = 0; i < Result.length; i++) {
                            var columnsIn = Result[0];// Coulms Name geting from First Row
                            thead_row += '<tr>'
                            for (var key in columnsIn) { // Printing Columns
                                if (i == 0)
                                    thead_body += "<td class='ui-widget-header' style='text-align:center;' id=" + key + "> " + key + " </td>";

                                thead_row += "<td class='ui-widget-content' style='text-align:center;'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                            }
                            thead_row += '</tr>'
                        }
                    }
                  
                    $('#theadid').append('<tr>' + thead_body + '</tr>');
                    $('#tbodyid').append(thead_row);

                   
                    



                },
                error: function (xhr) {
                    var a = "";
                }

            });

        }

    });
});

function FlightDetails(SNo) {

     window.location.href = "http://localhost:3139/Default.cshtml?Module=Rate&Apps=ManageTactRate&FormAction=Edit&UserID=0&RecID=" + SNo;
  //  url = "http://localhost:3139/Default.cshtml?Module=Rate&Apps=ManageTactRate&FormAction=Edit&UserID=0&RecID=" + SNo;
   // window.open(url, '_blank');
}



function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");

    
    if (textId == "Text_Destination") {

        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Origin").val())

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    
    ////////************////////
    

}