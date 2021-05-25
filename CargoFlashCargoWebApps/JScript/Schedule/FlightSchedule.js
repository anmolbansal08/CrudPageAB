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

    AutoCompleteV2("Origin", "CITYNAMES,AIRPORTCODE", "FlightSchedule_Airport", null, "contains");
    //cfi.AutoComplete("Origin", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");

    AutoCompleteV2("Destination", "CITYNAMES,AIRPORTCODE", "FlightSchedule_Airport", null, "contains");

    var UMSource = [{ Key: "0", Text: "0" }, { Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }];

    AutoCompleteByDataSource("leg", UMSource);
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

        //if (!IsValidSubmitSection()) {
        //    return false;
        //}
        $("#tbl").cfValidator();
        if ($("#tbl").data('cfValidator').validate()) {
        var ddlorigin = hidenn_Text_ORIGINCITY;
        var ddldestination = hidenn_Text_destinationCITY;
        var Date = $('#FlightDate').val();
        var UserSNo = 0; //window.parent.$("#iMasterFrame").length > 0 ? userContext.UserSNo : 0 //added by ankit

        var leg = hiidenlog;
        var radiocheck = $("input[name='Filter']:checked").val() == null ? "0" : $("input[name='Filter']:checked").val();
        $.ajax({
            url: "../SearchSchedule/GetSearchSchedule",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                originCityname: ddlorigin, destinationcityname: ddldestination, date: Date, leg: leg, radiocheck: radiocheck
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                if (result.radiocheck == "0") {
                    $('#theadid').html('');
                    $('#tbodyid').html('');
                    var Result = (result.listschedule);
                    var ResultRoute = (result.listRoutepath);
                    if (Result.length > 0) {
                        var j = 0;
                        var i = 0;
                        var k = 0;
                        for (; k < ResultRoute.length; k++) {

                           
                            if (i == Result.length) {
                                i = i - 1;
                                j = j + 1;
                                if (j == ResultRoute.length)
                                {
                                    break;
                                }
                               
                                else { thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;text-align:  center;">' + ResultRoute[j].ORIGINMAIN + '</td></tr>' }
                            }
                            else {
                                thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;text-align:  center;">' + ResultRoute[j].ORIGINMAIN + '</td></tr>'
                            }
                            if (ResultRoute[j].id == Result[i].sno) {
                                for (; i < Result.length; ) {
                                   
                                    if (ResultRoute[j].id == Result[i].sno) {
                                        // thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;text-align:  center;">' + ResultRoute[j].ORIGINMAIN + '</td></tr>'
                                        //  thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;">' + Result[i].RoutePath + '</td></tr>'
                                        var columnsIn = Result[0];// Coulms Name geting from First Row
                                        thead_row += '<tr id="routeid">'
                                        for (var key in columnsIn) { // Printing Columns
                                            if (key == 'FlightNo') {
                                                var keys = 'Flight No';
                                                if (i == 0)

                                                    thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                                thead_row += "<td class='ui-widget-content' style='text-align: center;' id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                            }
                                            else if (key == 'FlightOrigin') {
                                                var keys = 'Flight Origin';
                                                if (i == 0)

                                                    thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                                thead_row += "<td class='ui-widget-content' style='text-align: center;' id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                            }
                                            else if (key == 'FlightDestination') {
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
                                        // thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;text-align:  center;">' + ResultRoute[j].ORIGINMAIN + '</td></tr>'
                                        //  thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;">' + Result[i].RoutePath + '</td></tr>'
                                        //var columnsIn = Result[0];// Coulms Name geting from First Row
                                        //thead_row += '<tr id="routeid">'
                                        //for (var key in columnsIn) { // Printing Columns
                                        //    if (i == 0)
                                        //        thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                                        //    thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label for='formsearch' maxlength='100' style='width:100px;'>No flight found</label></td>";
                                        //}
                                        //thead_row += '</tr>'
                                       
                                        j++;
                                        i--;

                                    }
                                    i++
                                    if (i == Result.length) {
                                        break;
                                       
                                    }
                                    if (ResultRoute[j].id != Result[i].sno) {
                                        j++;
                                        thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;text-align:  center;">' + ResultRoute[j].ORIGINMAIN + '</td></tr>'


                                    }
                                }

                            }
                            else {
                                //thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;">' + ResultRoute[j].ORIGINMAIN + '</td></tr>'
                                //  thead_row += '<tr><td colspan="8"  style="color: blue;font-size: large;">' + Result[i].RoutePath + '</td></tr>'
                                var columnsIn = Result[0];// Coulms Name geting from First Row
                                thead_row += '<tr id="routeid">'
                                for (var key in columnsIn) { // Printing Columns
                                    //if (i == 0)
                                    //    thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                                    thead_row += "<td class='ui-widget-content' style='text-align: center;'  id=" + key + i + "> <label for='formsearch' maxlength='100' style='width:100px;'>no record found</label></td>";
                                }
                                thead_row += '</tr>'
                                j++;
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

                else {
                    $('#theadid').html('');
                    $('#tbodyid').html('');
                    var Result = (result.listschedule);
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
                                        else if (key == 'FlightOrigin') {
                                            var keys = 'Flight Origin';
                                            if (i == 0)

                                                thead_body += "<td class='ui-widget-header' id=" + key + "> " + keys + " </td>";

                                            thead_row += "<td class='ui-widget-content' style='text-align: center;' id=" + key + i + "> <label for='formsearch'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                        }
                                        else if (key == 'FlightDestination') {
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
            }
        });
    }
    });
    $('input[name="Filter"]').on('click change', function (e) {
        if ($("input[name='Filter']:checked").val() == "0") {
            //$('#Text_leg').data("kendoAutoComplete").enable(false);
            //$('#leg').data("kendoAutoComplete").enable(false);
            $("#Text_leg_input").attr('disabled', true);
            $("#Text_leg").data("kendoComboBox").enable(false)
           
            $("#Text_leg").data("kendoComboBox").setDefaultValue('', '');
        }
        else if ($("input[name='Filter']:checked").val() == "1") {
            //$('#Text_leg').data("kendoAutoComplete").enable(false);
            //$('#leg').data("kendoAutoComplete").enable(false);
            $("#Text_leg_input").attr('disabled', false);
            $("#Text_leg").data("kendoComboBox").enable(true)
        }
    });
    if ($("input[name='Filter']:checked").val() == "0") {
        //$('#Text_leg').data("kendoAutoComplete").enable(false);
        //$('#leg').data("kendoAutoComplete").enable(false);
        $("#Text_leg_input").attr('disabled', true);
        $("#Text_leg").data("kendoComboBox").enable(false)
       
        $("#Text_leg").data("kendoComboBox").setDefaultValue('', '');
    }
    else if ($("input[name='Filter']:checked").val() == "1") {
        //$('#Text_leg').data("kendoAutoComplete").enable(false);
        //$('#leg').data("kendoAutoComplete").enable(false);
        $("#Text_leg_input").attr('disabled', false);
        $("#Text_leg").data("kendoComboBox").enable(true)
    }
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

    var filterEmbargo = getFilter("AND");
    if (textId == "Text_Destination") {

        setFilter(filterEmbargo, "SNo", "notin", $("#Origin").val())

        var OriginCityAutoCompleteFilter2 = autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
}



var autoCompleteType = "autocomplete";
var attrType = "controltype";
var autoCompleteText = "Text";
var autoCompleteKey = "Key";
    this.AutoCompleteV2 = function (textId, basedOn, autoCompleteName, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template, IsChangeOnBlankValue) {

        var keyId = textId;
        textId = "Text_" + textId;
        $("div[id^='" + textId + "-list']").remove();
        if (IsValid(textId, autoCompleteType)) {
            var dataSource = GetDataSourceV2(textId, autoCompleteName);

            $("input[type='text'][name='" + textId + "']").kendoComboBox({
                filter: (filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria),
                dataSource: dataSource,
                autoBind: false,
                select: (onSelect == undefined ? null : onSelect),
                filterField: basedOn,
                rightAlign: (rightAlign == undefined ? false : rightAlign),
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: template == null ? '<span>#: TemplateColumn #</span>' : template,
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd,
                IsChangeOnBlankValue: (IsChangeOnBlankValue == undefined ? false : IsChangeOnBlankValue)
            });
        }


    }
    this.AutoCompleteByDataSource = function (textId, dataSourceName, addOnFunction, separator) {
        var keyId = textId;
        textId = "Text_" + textId;
        $("div[id^='" + textId + "-list']").remove();
        if (IsValid(textId, autoCompleteType)) {
            basedOn = autoCompleteText;
            var dataSource = dataSourceName;
            $("input[type='text'][name='" + textId + "']").kendoComboBox({
                filter: "startswith",
                dataSource: dataSource,
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction)
            });
        }
    }
    IsValid = function (cntrlId, attrValue) {
        var attr = $("[id='" + cntrlId + "']").attr(attrType);
        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false && attr == attrValue) {
            // ...
            return true;
        }
        return false;
    }
    GetDataSourceV2 = function (textId, autoCompleteName) {
        var dataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url:"../Services/AutoCompleteService.svc/AutoCompleteDataSourceV2",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: { autoCompleteName: autoCompleteName }
                },
                parameterMap: function (options) {
                    var filter = _ExtraCondition(textId);
                    if (filter != undefined) {

                        if (filter == undefined) {
                            filter = { logic: "AND", filters: [] };
                        }
                        if (options.filter != undefined)
                            filter.filters.push(options.filter);
                        options.filter = filter;
                    }
                    if (options.sort == undefined)
                        options.sort = null;

                    if ($.isFunction(window.ExtraParameters)) {
                        options.Parameters = window.ExtraParameters(textId);
                    }
                    return JSON.stringify(options);
                }
            },
            schema: { data: "Data" }
        });
        return dataSource;
    }
    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }
    this.getFilter = function (logic) {
        var filter = { logic: (logic == undefined || logic == "" ? "AND" : logic), filters: [] };
        return filter;
    }
    this.setFilter = function (filterName, field, operator, value) {
        if (filterName != undefined) {
            filterName.filters.push({ field: field, operator: operator, value: value });
        }
    }
    this.autoCompleteFilter = function (filterName) {
        var filter = { logic: "AND", filters: [] };
        if (Object.prototype.toString.call(filterName) === '[object Array]') {
            for (var i = 0; i < filterName.length; i++)
                if (filterName[i] != undefined) {
                    filter.filters.push(filterName[i]);
                }
        }
        else {
            if (filterName != undefined) {
                filter.filters.push(filterName);
            }
        }
        return filter;
    }
    this.IsValidSubmitSection = function () {
        var valid = false;
        $("[ValidateOnSubmit]").each(function () {
            if (!$(this).data('cfValidator').validate()) {
                valid = true;
            }
        });
        return valid;
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

