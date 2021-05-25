$(document).ready(function () {
    var hidenn_Text_ORIGINCITY = '';
    var hidenn_Text_destinationCITY = '';
    var hiidenrate = '';
    var hidenn_Text_Airline = '';
    var hidenn_Text_Product = '';
    var hiidenCommodity = '';
    var hidenn_Text_flightname = '';
    var hidenn_Text_Account = '';
    var username = $('#myUsername').val();
    var agensno = $('#myAgentSNo').val();

    if (userContext.GroupName == 'ADMIN') {
        $("#Text_Account").prop("disabled", false);
        $("#Text_Account").val();
        $("#Origin").val();
        $("#Text_Origin_input").val();
        $("#Text_Origin_input").prop("disabled", false);

        $("#Airline").val();
        $("#Text_Airline").val();
        $("#Text_Airline").prop("disabled", false);
    }
    else if (userContext.GroupName == 'AGENT') {

        $("#Account").val(userContext.AgentSNo);
        $("#Text_Account").val(userContext.AgentName);
        $("#Text_Account").prop("disabled", true);

        $("#Origin").val(userContext.CitySNo);
        $("#Text_Origin").val(userContext.CityCode + '-' + userContext.CityName);
        $("#Text_Origin").prop("disabled", true);

        $("#Airline").val(userContext.AirlineSNo);
        $("#Text_Airline").val(userContext.AirlineName);
        $("#Text_Airline").prop("disabled", true);



    }
    $("#FlightDate").kendoDatePicker({
        min: new Date(),
        format: "dd-MMM-yyyy"
    });

    $("#FlightDate").attr('readOnly', true);


    cfi.AutoCompleteV2("Airline", "airlinecode,airlinename", "SearchOtherCharges_Airline", null, "contains");

    //cfi.AutoComplete("Origin", "CITYNAME,AIRPORTCODE", "BuildJoinCityName", "CountrySNo", "CITYNAME", ["AIRPORTCODE", "CITYNAME"], null, "contains");
    cfi.AutoCompleteV2("Origin", "CityCode,CityName", "SearchOtherCharges_Origin", null, "contains");


    cfi.AutoCompleteV2("Destination", "CityCode,CityName", "SearchOtherCharges_Origin", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode", "SearchOtherCharges_Commodity", null, "contains");
    cfi.AutoCompleteV2("flightname", "Flightno", "SearchOtherCharges_flightname", null, "contains");
    cfi.AutoCompleteV2("Account", "Name", "SearchOtherCharges_Account", null, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "SearchOtherCharges_product",  null, "contains");

    var TypeSource = [{ Key: "3", Text: "All" }, { Key: "1", Text: "Due Agent" }, { Key: "2", Text: "Due Carrier" }];

    cfi.AutoCompleteByDataSource("Type", TypeSource);



    $('#Text_Airline').on('autocompletechange change', function () {
        hidenn_Text_Airline = this.value;
        if (userContext.GroupName == 'ADMIN') {
            $('#Text_Account_input').val('');
            $('#Account').val('');
        }

    }).change();
    $('#Text_Origin').on('autocompletechange change', function () {
        hidenn_Text_ORIGINCITY = this.value;
        if (userContext.GroupName == 'ADMIN') {
            $('#Text_Account_input').val('');
            $('#Account').val('');
        }
    }).change();
    $('#Text_Destination').on('autocompletechange change', function () {
        hidenn_Text_destinationCITY = this.value;
    }).change();
    $('#Text_Product').on('autocompletechange change', function () {
        hidenn_Text_Product = this.value;
    }).change();
    $('#Text_Commodity').on('autocompletechange change', function () {
        hiidenCommodity = this.value;
    }).change();
    $('#Text_flightname').on('autocompletechange change', function () {
        hidenn_Text_flightname = this.value;
    }).change();
    $('#Text_Account').on('autocompletechange change', function () {
        hidenn_Text_Account = this.value;
    }).change();
    $('#Text_RateType').on('autocompletechange change', function () {
        hiidenrate = this.value;
    }).change();

    var searchStoreArray = [];
    $('#btnSubmit').click(function () {
        if (!cfi.IsValidSubmitSection()) {
            return false;
        }
        alert("Search");
        var AirlineSNo = $("#Airline").val();
        var Date = $('#FlightDate').val();
        var OriginSNo = $('#Origin').val();
        var DestinationSNo = $('#Destination').val();
        var ChargeType = $('#Type').val();
        alert("AirlineSNo : " + AirlineSNo);
        alert("Date : " + Date);
        alert("OriginSNo : " + OriginSNo);
        alert("DestinationSNo : " + DestinationSNo);
        alert("ChargeType : " + ChargeType);
        
        $.ajax({
            url: "../SearchSchedule/SearchOtherChargesDetails",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AirlineSNo: AirlineSNo, Date: Date, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo, ChargeType: ChargeType
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
                                thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                            thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                        }
                        thead_row += '</tr>'
                    }
                }
                $('#theadid').append('<tr>' + thead_body + '</tr>');
                $('#tbodyid').append(thead_row);
                //var dsResult = result.Result;
                //var dscolumn = result.ID;
                //var dsrows = result.ROWSID;
                //var myData = (dsResult);

                //var $trs = $();

                //var ii = 0;
                //var thead_body = "";
                //var thead_row = "";
                //for (; ii < dscolumn;) {
                //    JSON.parse(myData, function (k, v) {


                //        if (ii < dscolumn && k != "0" && k != "EM" && k != "1" && k != "Table0" && k != "Table1" && k != "") {

                //            thead_row += "<td class='ui-widget-header' id=" + k + "> " + k.toUpperCase() + " </td>";

                //            ii++;
                //        }

                //    });

                //}
                //thead_body += "<tr>" + thead_row + "</tr>";


                //var jscount = 0;

                //var kk = 0;
                //var tbl_body = "";
                //var tbl_row = "";
                //JSON.parse(myData, function (k, v) {

                //    if (kk < dscolumn && k != "0" && k != "EM" && k != "1" && k != "Table0" && k != "Table1" && k != "") {

                //        tbl_row += "<td class='ui-widget-content'  id=" + k + "> <label  maxlength='100' style='width:100px;'>" + v + "</label></td>";

                //        kk++;
                //    }

                //    if (kk == dscolumn && k != "EM" && k != "1" && k != "Table0" && k != "Table1" && k != "") {

                //        tbl_body += "<tr>" + tbl_row + "</tr>";
                //        tbl_row = '';
                //        kk = 0;
                //    }

                //});
                //$('#tbodyid').append(tbl_body);
                //$('#tblsearchrateList  thead  tr').each(function () {
                //    $('#tblsearchrateList').find(' thead tr td').eq(0).remove();
                //    $('#tblsearchrateList').find(' thead tr td').eq(8).remove();
                //});
                //$('#tblsearchrateList  tbody  tr').each(function () {
                //    $('#Rates').remove();
                //    $('#RateSNo').remove();
                //});
                ////$('#tblsearchrateList  tbody  tr').each(function () {

                ////    $('#RateSNo').remove();
                ////});


            },
            error: function (xhr) {
                var a = "";
            }
        });
        //GetGridData(ddlorigin, ddldestination, Date, ddl_hidenn_Text_Account, ddlairline, ddl_hiidenCommodity, ddlhidenn_Text_Product, ddl_hidenn_Text_flightname, rate);
    });

});
function GetGridData(ddlorigin, ddldestination, Date, ddl_hidenn_Text_Account, ddlairline, ddl_hiidenCommodity, ddlhidenn_Text_Product, ddl_hidenn_Text_flightname, rate) {



    $("#grid").html('');

    $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "../SearchSchedule/GetRateDetails",
                    datatype: 'json',
                    method: 'post',
                    data: {
                        fromorigin: ddlorigin, todestination: ddldestination, flightdate: Date, accountsno: ddl_hidenn_Text_Account, airlinecode: ddlairline, commoditycode: ddl_hiidenCommodity, productname: ddlhidenn_Text_Product, flightNumber: ddl_hidenn_Text_flightname, rateType: rate


                    },
                }
            },
            parameterMap: function (data, operation) {

                return JSON.stringify(data);
            },
            schema: {
                model: {

                    fields: {
                        Airlincode: { type: "string" },
                        origincity: { type: "string" },
                        destinationCity: { type: "string" },
                        Agentname: { type: "string" },

                        Products: { type: "string" },
                        Commodity: { type: "string" },
                        Flight: { type: "string" },

                        RateTypeName: { type: "string" },
                        Minium: { type: "string" },
                        Normal: { type: "string" },
                        Plus45: { type: "string" },
                        Plus90: { type: "string" },
                        Plus150: { type: "string" },
                        //Plus250: { type: "string" },
                        Plus350: { type: "string" },

                        Plus500: { type: "string" }



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
            { field: "Airlincode", title: "Airlincode " },
            { field: "origincity", title: " Origin" },
            { field: "destinationCity", title: " Destination" },

            { field: "Agentname", title: "Agent name" },
               { field: "Products", title: "Products" },
                  { field: "Commodity", title: "Commodity" },

                    { field: "Flight", title: "Flight" },
                      { field: "RateTypeName", title: "RateTypeName" },

                      { field: "Minium", title: "Minium" },
                      { field: "Normal", title: "Normal" },
                        { field: "Plus45", title: "Plus 45" },
                       { field: "Plus90", title: "Plus 100" },
                      { field: "Plus150", title: "Plus 300" },
                      //{ field: "Plus250", title: "Plus 500" },
                      { field: "Plus350", title: "Plus 1000" },

                      { field: "Plus500", title: "Plus 2000" }




        ]
    });
}

function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");
    if (textId == "Text_Account") {

        cfi.setFilter(filterEmbargo, "AirlineSNo", "in", $("#Airline").val())
        cfi.setFilter(filterEmbargo, "CItySNo", "in", $("#Origin").val())
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }
    if (textId == "Text_Airline") {

        cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }


    if (textId == "Text_Destination") {

        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Origin").val())

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }
}

