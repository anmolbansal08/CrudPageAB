$(document).ready(function () {
    var hidenn_Text_ORIGINCITY = '';
    var hidenn_Text_destinationCITY = '';
    var hiidenrate = '';
    var hidenn_Text_Airline = '';
    var hidenn_Text_Product = '';
    var hiidenCommodity = '';
    var hidenn_Text_flightname = '';
    var hidenn_Text_Account = '';
    //  var session = '<%=HttpContext.Current.Session["Username"]%>';
    var username = $('#myUsername').val();
    var agensno = $('#myAgentSNo').val();
    $("#exportflight").hide();
    $('table').find('tr:contains("Mandatory Fields")').after('<tr><td class="formlabel">Search By</td><td class= "formInputcolumn" ><input type="checkbox" name="SerchByRef" id="SerchByRef" /> Reference Number</td><td class = "formlabel" colspan= "8"></td></tr>')
    if (userContext.GroupName == 'ADMIN') {
      
        $("#Text_Account").prop("disabled", false);
        $("#Text_Account").val();
        $("#Origin").val();
        $("#Text_Origin_input").val();
        $("#Text_Origin_input").prop("disabled", false);

        $("#Airline").val();
        $("#Text_Airline").val();
        $("#Text_Airline").prop("disabled", false);
        $("#rateRefId").show();
    }
    else if (userContext.GroupName == 'AGENT') {
        $("#SerchByRef").closest('tr').remove();
        $("#Account").val(userContext.AgentSNo);
        $("#Text_Account").val(userContext.AgentName);
        $("#Text_Account").prop("disabled", true);

        $("#Origin").val(userContext.CitySNo);
        $("#Text_Origin").val(userContext.CityCode + '-' + userContext.CityName);
        $("#Text_Origin").prop("disabled", true);

        $("#Airline").val(userContext.AirlineSNo);
        $("#Text_Airline").val(userContext.AirlineName);
        $("#Text_Airline").prop("disabled", true);
        $("#rateRefId").hide();

    }
    $("#FlightDate").kendoDatePicker({
        //min: new Date(),
        format: "dd-MMM-yyyy"
    });

    $("#FlightDate").attr('readOnly', true);
   
    var Origin = [{ Key: "1", Text: "AIRPORT" }, { Key: "2", Text: "CITY" }];
    var Destination = [{ Key: "1", Text: "AIRPORT" }, { Key: "2", Text: "CITY" }];

    cfi.AutoCompleteV2("Airline", "CarrierCode,airlinename", "SearchRate_Airline", null, "contains");

    //cfi.AutoComplete("Origin", "CITYNAME,AIRPORTCODE", "BuildJoinCityName", "CountrySNo", "CITYNAME", ["AIRPORTCODE", "CITYNAME"], null, "contains");

    cfi.AutoCompleteByDataSource("OriginType", Origin, null);

    //cfi.AutoCompleteV2("Origin", "CityCode,CityName", "SearchRate_City", null, "contains");

    cfi.AutoCompleteByDataSource("DestinationType", Destination, null);

    //cfi.AutoCompleteV2("Destination", "CityCode,CityName", "SearchRate_City", null, "contains");

    cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Rate_rate_Origin", OnSelectOrigin, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode,AirportName", "Rate_rate_Destination", OnSelectDestination, "contains");

    cfi.AutoCompleteV2("Commodity", "CommodityCode", "SearchRate_Commodity", null, "contains");
    cfi.AutoCompleteV2("flightname", "Flightno", "SearchRate_Flightno", null, "contains");
    cfi.AutoCompleteV2("Account", "ParticipantID,Name", "SearchRate_Account", null, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "SearchRate_product", null, "contains");
    //cfi.AutoComplete("RateType", "RateTypeName", "RateType", "sno", "RateTypeName", ["RateTypeName"], null, "contains");
    cfi.AutoCompleteV2("RateRefNo", "RateRaferenceNumber", "SearchRate_rate", null, "contains");
    cfi.AutoCompleteV2("SHCSNo", "Code", "SearchRate_SPHC", null, "contains", ",", null, null, null, null, true);
    cfi.AutoCompleteV2("TransitSno", "AirportCode,AirportName", "Rate_rate_TransitStation", null);
    cfi.AutoCompleteV2("AccountGroupSNo", "AgentGroupName", "Rate_rate_AgentGroupName", null, "contains", ",");

    var RateSource = [{ Key: "9", Text: "ALL" },{ Key: "1", Text: "RSP RATE" }, { Key: "2", Text: "PROMO" }, { Key: "3", Text: "AGENT SPECIFIC" }, { Key: "4", Text: "ALLOTMENT RATE" }, { Key: "5", Text: "MAIL RATE" }, { Key: "6", Text: "ULD RATE" }];

    cfi.AutoCompleteByDataSource("RateType", RateSource);
    $("#RateType").val("9");
    $("#Text_RateType_input").val("ALL");

    $("#RateRefNo").closest('tr').hide();
    $("#RateRefNo").closest('tr').hide();
    cfi.AutoCompleteV2("AirlineCodeFilter", "CarrierCode,airlinename", "SearchRate_AirlineCodeFilter", null, "contains");

    //if (userContext.GroupName == 'AGENT')
    //{
    //    var RateSourceAgent = [{ Key: "1", Text: "RSP RATE" }, { Key: "3", Text: "AGENT SPECIFIC" }];
    //    cfi.AutoCompleteByDataSource("RateType", RateSourceAgent);
    //}
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //Added by devendra on 13 JAN 2019
        $('#OriginType').val('1');
        $('#Text_OriginType_input').val('AIRPORT');
        $('#DestinationType').val('1');
        $('#Text_DestinationType_input').val('AIRPORT');
    }
    // user context airline
    $("#Text_Airline").val(userContext.AirlineCarrierCode);
    $("#Airline").val(userContext.AirlineSNo);
    $("#Text_Airline_input").val(userContext.AirlineCarrierCode);
    // end
    $('#SerchByRef').change(function () {
        $("#exportflight").hide();
        $("#RateRefNo, #Text_RateRefNo,#Text_RateRefNo_input").val('')  // clear reference drop down
        if ($(this).is(":checked")) {
            $("#Text_Airline_input,#Text_Origin_input,#Text_Destination_input,#Text_RateType_input,#FlightDate,#SHCSNo").removeAttr('data-valid');
            $("#Airline,#FlightDate,#flightname,#SHCSNo").closest('tr').hide();
            $("#RateRefNo").closest('tr').show();
            $("#Text_RateRefNo_input").attr("data-valid", 'required');
            $('#theadid').html('');
            $('#tbodyid').html('');
        }
        else {
            $("#Text_Airline_input,#Text_Origin_input,#Text_Destination_input,#Text_RateType_input,#FlightDate").attr('data-valid', 'required');
            $("#Airline,#FlightDate,#flightname,#SHCSNo").closest('tr').show();
            $("#RateRefNo").closest('tr').hide();
            $("#Text_RateRefNo_input").removeAttr("data-valid");
            $('#theadid').html('');
            $('#tbodyid').html('');
        }

       
    });

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
        hiidenCommodity = (this.value).split('-')[0];
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
    $('#btnSubmit').click(function ()
    {
        if (!cfi.IsValidSubmitSection())
        {
            return false;
        }
        $("#exportflight").hide();
        var ddlorigin = hidenn_Text_ORIGINCITY;
        var ddldestination = hidenn_Text_destinationCITY;
        var Date = $('#FlightDate').val();
        var rate = $('#RateType').val();
        var ddlairline = hidenn_Text_Airline;
        var ddlhidenn_Text_Product = hidenn_Text_Product;
        var ddl_hiidenCommodity = hiidenCommodity;
        var ddl_hidenn_Text_flightname = hidenn_Text_flightname;
        var ddl_hidenn_Text_Account = $('#Account').val();
        var RateRefNumber = $("#RateRefNo").val();
        var SHCSNo = $("#SHCSNo").val();
        var TransitSno = $("#TransitSno").val();
        var IsAgentLogin = parseInt(userContext.AgentSNo) > 0 ? 1 : 0;
        var OriginLevelParam = parseInt($("#OriginType").val());
        var DestinationLevelParam = parseInt($("#DestinationType").val());
        var AgentGroup = $("#AccountGroupSNo").val() || 0
        $.ajax({
            url: "../SearchSchedule/GetRateDetails",
            async: true,
            type: "GET",
            dataType: "json",
            data: {
                fromorigin: ddlorigin, todestination: ddldestination, flightdate: Date, accountsno: ddl_hidenn_Text_Account, airlinecode: ddlairline, commoditycode: ddl_hiidenCommodity, productname: ddlhidenn_Text_Product, flightNumber: ddl_hidenn_Text_flightname, rateType: rate, RateRefNumber: RateRefNumber, SHCSNo: SHCSNo, TransitSno: TransitSno, IsAgentLogin: IsAgentLogin, OriginLevelParam: OriginLevelParam, DestinationLevelParam: DestinationLevelParam, AgentGroup: AgentGroup
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                $('#theadid').html('');
                $('#tbodyid').html('');
                var Result = JSON.parse(result.Result).Table0
                var thead_body = "";
                var thead_row = "";
          
                if (Result.length > 0) {
                    var abc = '';
                    for (var i = 0; i < Result.length; i++) {
                        var columnsIn = Result[0];// Coulms Name geting from First Row
                        thead_row += '<tr>'
                        for (var key in columnsIn)
                        { // Printing Columns
                            if (i == 0 && key != "Column1")
                            {
                                /*------Comment By Pankaj Kumar Ishwar on 31-08-2018------*/
                                thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";
                            }
                            if (key.toUpperCase() == 'REFERENCE NO')
                                abc = 'a href="#" onclick="rateRecord(this.id)"  style="width:100px; color:blue;"'
                            else
                                abc = 'label'
                          
                            thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <" + abc + " id='anc" + key + i + "'  maxlength='100' style='width:100px;'>" + Result[i][key] + "</'" + abc + "'></td>";
                        }
                        thead_row += '</tr>'
                    }
                }
                $('#theadid').append('<tr>' + thead_body + '</tr>');
                $('#tbodyid').append(thead_row);
                $(".k-grid-header-wrap").closest('div').attr('style', 'overflow-x: scroll;overflow-y: scroll ');
                // set div length
               // alert($(window).height());
                //   $("#grid").attr('height', $(window).height() - 5);
                $("#grid").css('height', $(window).height() / 1.8);
              //  $("#grid").css('overflow-y', 'scroll')
                $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                $("#Serial").closest('td').attr('style', 'color:#daecf4');
                $("#Serial").closest('td').text('');
                /*------Changed By Pankaj Kumar Ishwar on 31-08-2018------*/
                if (Result[0]["Column1"] == "NO RECORD FOUND")
                {
                    $("#tblsearchrateList tbody tr").each(function ()
                    {
                        $(this).attr('style', 'text-align : center');
                    });
                    $("#exportflight").hide();
                }
                    /*----*/
                else
                {
                    $("#exportflight").show();
                }
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
            complete: function (data) {
                //    setTimeout(function () {
               // $("#tblsearchrateList thead tr td").css('background', 'paleturquoise')
                    $("#tblsearchrateList tbody tr td").each(function () {
                        var i = $(this).closest('tr').index();
                        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
                        var col = i % 2 == 0 ? "black" : "green";
                        $(this).attr('style', 'background:' + co + '; mso-number-format:"\@"', 'important');
                    //    $(this).attr('style', 'color:' + col, 'important');
                    });
                   $("td[id^='RateSNo']").attr('style', 'display:none')
              //  }, 2000);
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
function ExtraCondition(textId)
{
    var filterEmbargo = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");
    if (textId == "Text_Account")
    {
        cfi.setFilter(filterEmbargo, "AirlineSNo", "in", $("#Airline").val())
        cfi.setFilter(filterEmbargo, "CItySNo", "in", $("#Origin").val())
        if (userContext.GroupName.toUpperCase() == 'AGENT')
        {
            cfi.setFilter(filterEmbargo, "SNo", "in", userContext.AgentSNo)
        }
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    if (textId == "Text_Airline")
    {
        cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    if (textId == "Text_Origin")
    {
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Destination").val())
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Destination")
    {

        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Origin").val())

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }
    if (textId == "Text_AirlineCodeFilter") {

        $('#theadid').html('');
        $('#tbodyid').html('');

        $("#Text_RateRefNo_input").val('');
        $("#RateRefNo").val('');

        cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }
    if(textId == "Text_RateRefNo")
    {
        cfi.setFilter(filterEmbargo, "airlinesno", "in", $("#AirlineCodeFilter").val())

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
}
function ExportToExcel_Searchrate() {
    $("#Text_Airline_input,Text_Origin_input,Text_Destination_input").val()

    var ddlorigin = $("#Text_Origin_input").val();
    var ddldestination = $("#Text_Destination_input").val();
    var date = $('#FlightDate').val();

    var rate = $('#RateType').val();
    var ddlairline = $("#Text_Airline_input").val();
    var ddlhidenn_Text_Product = $("#Text_Product_input").val();
    var ddl_hiidenCommodity = $("#Text_Commodity_input").val();
    var ddl_hidenn_Text_flightname = $("#Text_flightname_input").val();
    var ddl_hidenn_Text_Account = $('#Account').val();
    var RateRefNumber = $("#RateRefNo").val();
    var SHCSNo = $("#SHCSNo").val();
    if (ddlorigin != "" && date != "" && rate != "") {

        //  window.location.href = "../SearchSchedule/ExportToExcel?fromorigin=" + ddlorigin + "&todestination=" + ddldestination + "&flightdate=" + date + "&accountsno=" + ddl_hidenn_Text_Account + "&airlinecode=" + ddlairline + "&commoditycode=" + ddl_hiidenCommodity + "&productname=" + ddlhidenn_Text_Product + "&flightNumber=" + ddl_hidenn_Text_flightname + "&rateType=" + rate + "&RateRefNumber=" + RateRefNumber + "&SHCSNo=" + SHCSNo;
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth() + 1;
          var yyyy = today.getFullYear();
          if (dd < 10) {
              dd = '0' + dd;
          }
          if (mm < 10) {
              mm = '0' + mm;
          }
          var today = dd + '_' + mm + '_' + yyyy;
          var a = document.createElement('a');
          var data_type = 'data:application/vnd.ms-excel';
          //----remove hiiden field column-------------------
        //  $("#tblCreditLimitReport tbody tr").find('td:last').remove();
       //   $("#tblCreditLimitReport thead tr td:last").remove();
         // var i = $("#tblCreditLimitReport tbody tr").length;
        //  
          $("#tblsearchrateList tbody tr").each(function () {
              var i = $(this).index();
              var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
              $(this).attr('style', 'background-color:' + co);
          });
        //------- end---------------------------------------
      //    $('#tblsearchrateList [id^="Serial"]').hide();
          var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblsearchrateList thead tr:eq(0)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblsearchrateList tbody').html() + '</tbody></table></body></html>';
          var table_html = table_div.replace(/ /g, '%20');
          //a.href = data_type + ', ' + table_html;
          //a.download = 'RateReport' + today + '_.xls';
        //a.click();
          //Fixed as told by Srini sir in ARabia whatsapp Group for excel not downloading
          var flName = 'RateReport' + today + '_.xls';
          exportToExcelNew(table_div, flName)
    }
}
function rateRecord(obj) {
    var RateSNo = $("[id='" + obj + "']").closest('tr').find('td[id^="RateSNo"]').text().trim()
    var myPopup =  window.open('/Index.cshtml', '_blank');
    myPopup.addEventListener('load', function () {
        myPopup.parent.$("#iMasterFrame").append('<input type = "hidden" id = "flagForSearch">1</input>')
      //  myPopup.parent.$("#iMasterFrame").attr('src', 'Default.cshtml?Module=Rate&Apps=Rate&FormAction=INDEXVIEW');
    //    myPopup.parent.$("#iMasterFrame").append('<input type = "hidden" id = "flagForSearch">1</input>')
        myPopup.parent.iMasterFrame.location.href = '../Default.cshtml?Module=Rate&Apps=Rate&FormAction=Read&UserID=' + 0 + '&RecID=' + RateSNo;     
    }, false);
}
//Added on 24 aug 2018(SKG)------------------------
$(function () {

    $("#Text_OriginType").change(function () {
        var Origin = $("#Text_OriginType").val().toUpperCase();
        if (Origin == "AIRPORT") {
            cfi.ResetAutoComplete("Origin");
            //var dataSource = GetDataSourceV2("Origin", "Rate_rate_Origin")
            //cfi.ChangeAutoCompleteDataSource("Origin", dataSource, false, OnSelectOrigin, "AirportCode");
            cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Rate_rate_Origin", OnSelectOrigin, "contains");
        }
        else if (Origin == "CITY") {
            cfi.ResetAutoComplete("Origin");
            var dataSource = GetDataSourceV2("Origin", "Rate_rate_OriginCityName")
            cfi.ChangeAutoCompleteDataSource("Origin", dataSource, false, OnSelectOrigin, "CityCode");
        }
    })
});
$(function () {
    $("#Text_DestinationType").change(function () {
        var Destination = $("#Text_DestinationType").val().toUpperCase();
        if (Destination == "AIRPORT") {
            cfi.ResetAutoComplete("Destination");
            var dataSource = GetDataSourceV2("Destination", "Rate_rate_Destination")
            cfi.ChangeAutoCompleteDataSource("Destination", dataSource, false, OnSelectDestination, "AirportCode");
        }
        else if (Destination == "CITY") {
            cfi.ResetAutoComplete("Destination");
            //var dataSource = GetDataSourceV2("Destination", "Rate_rate_OriginCityName")
            //cfi.ChangeAutoCompleteDataSource("Destination", dataSource, false, OnSelectDestination, "CityCode");
            cfi.AutoCompleteV2("Destination", "CityCode,CityName", "Rate_rate_OriginCityName", OnSelectDestination, "contains");
        }
    })
});
function OnSelectOrigin(input) {

    var Origin = $("#Text_OriginType").val().toUpperCase();
    var Text_OriginSNo = $("#Text_Origin").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_Destination").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        if (Origin == "AIRPORT") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', 'Origin Airport can not be same as Destination Airport.', "bottom-right");
                $("#Text_Destination").val("");
                $("#Destination").val("");
            }

        }
        else if (Origin == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Origin City can not be same as Destination City.", "bottom-right");
                $("#Text_Destination").val("");
                $("#Destination").val("");

            }
        }

    }
}
function OnSelectDestination(input) {
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    var Text_OriginSNo = $("#Text_Origin").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_Destination").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        if (Destination == "AIRPORT") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Destination Airport can not be same as Origin Airport.", "bottom-right");
                $("#Text_Destination").val("");
                $("#Destination").val("");

            }
        }
        else if (Destination == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Destination Airport can not be same as Origin Airport.", "bottom-right");
                $("#Text_Destination").val("");
                $("#Destination").val("");

            }

        }
    }
}
// ---------------------END-------------------------------