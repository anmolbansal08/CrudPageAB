$(document).ready(function () {
    $("#FlightDate").kendoDatePicker({
        min: new Date(),
        format: "dd-MMM-yyyy"
    });



    $('#FlightDate').blur(function () {
        var expiarydate = new Date($("#FlightDate").val());
        var today = new Date();

        //if (expiarydate < today) {
        //    ShowMessage('warning', 'Warning - Expiary Date Vallidation!', "Expiary Date should be greater than Current date");
        //    return false;
        //}
    });


    $("#FlightDate").attr('readOnly', true);
    var hidenn_Text_ORIGINCITY = '';
    var hidenn_Text_destinationCITY = '';
    var hiidenlog = '';

    cfi.AutoComplete("Origin", "CITYNAME,AIRPORTCODE", "BuildJoinCityName", "SNO", "CITYNAME", ["AIRPORTCODE", "airportname"], null, "contains");
    //cfi.AutoComplete("Origin", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("Destination", "CITYNAME,AIRPORTCODE", "BuildJoinCityName", "SNO", "CITYNAME", ["AIRPORTCODE", "airportname"], null, "contains");

    var UMSource = [{ Key: "0", Text: "0" }, { Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }];

    cfi.AutoCompleteByDataSource("leg", UMSource);
    $("#Text_leg_input").val(0);
    // $("#leg_input").val('0');
    $('#Text_Origin').on('autocompletechange change', function () {
        hidenn_Text_ORIGINCITY = this.value;
    }).change();
    $('#Text_Destination').on('autocompletechange change', function () {
        hidenn_Text_destinationCITY = this.value;
    }).change();
    $('#Text_leg').on('autocompletechange change', function () {
        hiidenlog = this.value;
    }).change();





    //        },
    //        error: function (xhr) {
    //            var a = "";
    //        }
    //    });
    //});


    $('#btnSubmit').click(function () {
        if (!cfi.IsValidSubmitSection()) {
            return false;
        }

        var ddlorigin = hidenn_Text_ORIGINCITY;
        var ddldestination = hidenn_Text_destinationCITY;
        var Date = $('#FlightDate').val();

        var leg = hiidenlog;
        $.ajax({
            url: "../SearchSchedule/GetSearchSchedule",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                originCityname: ddlorigin, destinationcityname: ddldestination, date: Date, leg: leg
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                $('#theadid').html('');
                $('#tbodyid').html('');
                var Result = (result.Data);
                var thead_body = "";
                var thead_row = "";

                if (Result.length > 0) {
                    var j = 1;
                    var i = 0;
                    if (Result[i].sno == j) {
                        thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;">' + Result[i].RoutePath + '</td></tr>'
                        for (; i < Result.length; i++) {

                            if (Result[i].sno == j) {

                                var columnsIn = Result[0];// Coulms Name geting from First Row
                                thead_row += '<tr id="routeid">'
                                for (var key in columnsIn) { // Printing Columns
                                    if (key == 'FlightNo') {
                                        var keys = 'Flight No';
                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;' id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }
                                  else  if (key == 'FlightOrigin') {
                                        var keys = 'Flight Origin';
                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;' id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }
                                  else  if (key == 'FlightDestination') {
                                        var keys = 'Flight Destination';
                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;' id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }
                                  else if (key == 'FlightDate') {
                                        var keys = 'Flight Date';
                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;' id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }
                                  else if (key == 'ETD') {
                                        var keys = 'ETD/ETA';
                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;' id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }
                                    else if (key == 'ETDGMT') {
                                        var keys = 'ETD GMT/ETA GMT';
                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label for='formsearch' maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }
                                    else if (key == 'CargoClassification') {
                                        var keys = 'Mode of Operation';
                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label for='formsearch' maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }

                                    else if (key == 'AircraftDescription') {
                                        var keys = 'Aircraft Description';
                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label for='formsearch' maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }
                                    else {

                                        if (i == 0)

                                            thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                                        thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                    }

                                }
                                thead_row += '</tr>'
                            }
                            else {
                                thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;">' + Result[i].RoutePath + '</td></tr>'
                                var columnsIn = Result[0];// Coulms Name geting from First Row
                                thead_row += '<tr id="routeid">'
                                for (var key in columnsIn) { // Printing Columns
                                    if (i == 0)
                                        thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                                    thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label for='formsearch' maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                }
                                thead_row += '</tr>'
                                j++;

                            }
                        }

                    }
                }
                else {

                    thead_body += "<td class='ui-widget-header' </td>";

                    thead_row += "<td class='ui-widget-content'  align='center' style='margin-left: 573px;' ><label for='formsearch' maxlength='100' style='width:100px;font-size: large;'>No record found</label></td>";

                    thead_row += '</tr>'

                }
                $('#theadid').append('<tr>' + thead_body + '</tr>');
                $('#tbodyid').append(thead_row);

                if ($('#routeid').length > 0) {
                    $('[id*="RoutePath"]').remove();
                    $('[id*="sno"]').remove();

                }

            }
        });

    });


});

function GetGridData(ddlorigin, ddldestination, Date, leg) {



    $("#grid").html('');

    $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "../SearchSchedule/GetSearchSchedule",
                    datatype: 'json',
                    method: 'post',
                    data: {
                        originCityname: ddlorigin, destinationcityname: ddldestination, date: Date, leg: leg
                    },
                }
            },
            parameterMap: function (data, operation) {

                return JSON.stringify(data);
            },
            schema: {
                model: {

                    fields: {
                        FlightNo: { type: "string" },
                        FromOrigin: { type: "string" },
                        ToDestination: { type: "string" },
                        FlightDate: { type: "string" },
                        // DepDate: { type: "string" },
                        ETD: { type: "string" }
                        ,
                        ETDGMT: { type: "string" },
                        ETA: { type: "string" },
                        //ETAGMT: { type: "string" },
                        //Mode: { type: "string" },
                        //NoOfStop: { type: "string" },
                        AircraftDescription: { type: "string" }
                        //GrossWeight: { type: "string" },
                        //Volume: { type: "string" },
                        //UsedVolume: { type: "string" }
                        //RemainingGrossWeight: { type: "string" },
                        //RemainingVolume: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
        },
        //filterable: true,
        //sortable: true,
        pageable: true,
        // detailInit: GetAgentData,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { field: "FlightNo", title: "Flight No" },
            { field: "FromOrigin", title: "Flight Origin" },
            { field: "ToDestination", title: "Flight Destination" },

            { field: "FlightDate", title: "Flight Date" },
               { field: "ETD", title: "ETD/ETA" },
                  { field: "ETDGMT", title: "ETD-(GMT)/ETA-(GMT)" },
                     //{ field: "ETA", title: "ETA" }
                     //,
                       //{ field: "ETAGMT", title: "ETAGMT" },
                     //      { field: "Mode", title: "Mode" },
                     //         { field: "NoOfStop", title: "NoOfStop" },
                                { field: "AircraftDescription", title: "Aircraft Description" }
                     //{ field: "GrossWeight", title: "Gross Weight" },
                     //{ field: "Volume", title: "Volume" },
                     //{ field: "UsedVolume", title: "Used Volume" }
                     //{ field: "RemainingGrossWeight", title: "Remaining Gross Weight" },
                     //{ field: "RemainingVolume", title: "Remaining Volume" }

        ]
    });
}


function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_Destination") {

        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Origin").val())

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
}




//var filterEmbargo = cfi.getFilter("AND");

//if (textId == "Text_ORIGINCITY") {
//    if ($('#Origin').val() != "") {
//        if ($('#Origin').val() != "System.Collections.Generic.List`1[System.Web.Mvc.SelectListItem]") {

//            return textId = cfi.getFilter("AND"),
//                cfi.setFilter(textId, "CountrySNo", "eq", $("#Origin").val()),
//                cfi.autoCompleteFilter(textId);
//        }
//    }


//}
//if (textId == "Text_destinationCITY") {
//    if ($('#Destination').val() != "System.Collections.Generic.List`1[System.Web.Mvc.SelectListItem]") {
//        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "CountrySNo", "eq", $("#Destination").val()), cfi.autoCompleteFilter(textId);
//    }


//}
//}

