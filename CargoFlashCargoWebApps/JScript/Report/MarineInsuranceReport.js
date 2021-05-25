$(document).ready(function ()
{
    $("#imgexcel").hide();
    var CitySNo = userContext.CitySNo;
    cfi.AutoCompleteV2("Airline", "AirlineName", "MarineInsurance_Airline", null, "contains");
    cfi.AutoCompleteV2("City", "CityCode", "MarineInsuranceReport_CityCode", null, "contains");
    cfi.AutoCompleteV2("Agent", "Name", "MarineInsuranceReport_Agent", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var firstdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), 1)
    var lastDate = new Date(todaydate.getFullYear(), todaydate.getMonth() + 1, 0)
    var validTodate = $("#ToDate").data("kendoDatePicker");

    // validTodate.min(todaydate);
    $("#FromDate").data("kendoDatePicker").value(firstdate);
    $("#ToDate").data("kendoDatePicker").value(lastDate);
    validTodate.min(todaydate);


    $("#FromDate").change(function () {

        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
        else if (isNaN(Date.parse($("#ToDate").val())) == true) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }

    });
    $('#grid').css('display', 'none')
    //if (CitySNo == 3992)
    //    {
    //     $("#grid").kendoGrid({
    //    autoBind: false,
    //    dataSource: new kendo.data.DataSource({
    //        type: "json",
    //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
    //        transport: {
    //            read: {
    //                url: "../MarineInsuranceReport/SearchMarineInsuranceReport",
    //                dataType: "json",
    //                global: true,
    //                type: 'POST',
    //                method: 'POST',
    //                contentType: "application/json; charset=utf-8",
    //                data:
    //                    function GetReportData()
    //                    {
    //                        return { Model: Model };
    //                    }

    //            }, parameterMap: function (options) {
    //                if (options.filter == undefined)
    //                    options.filter = null;
    //                if (options.sort == undefined)
    //                    options.sort = null; return JSON.stringify(options);
    //            },
    //        },
    //        schema: {
    //            model: {
    //                id: "SNo",
    //                fields:
    //                  {
    //                      No: { type: "string" },
    //                      BoReport: { type: "string" },
    //                      GASALESatauCARGOASSISTANCE: { type: "string" },
    //                      customername: { type: "string" },
    //                      AWB: { type: "string" },
    //                      ROUTE: { type: "string" },
    //                      FLIGHT: { type: "string" },
    //                      DATE: { type: "string" },
    //                      PCS: { type: "string" },
    //                      Weight: { type: "string" },
    //                      Commodity: { type: "string" },
    //                      CommodityClassification: { type: "string" },
    //                      DecleredvalueIDR: { type: "string" },
    //                      CertificateNumber: { type: "string" },
    //                      PremiumRate: { type: "string" },
    //                      PublishPremiumRate: { type: "string" },
    //                      ChargeableInsuranceRate: { type: "string" },
    //                      NETRATE: { type: "string" },
    //                      PremiumRates: { type: "string" },
    //                      ChargeableInsuranceRateForGA: { type: "string" },
    //                      Formula: { type: "string" },
    //                      Nominal: { type: "string" },
    //                      FormulaForGA: { type: "string" },
    //                      NominalIDR: { type: "string" },
    //                  }
    //            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
    //        },
    //    }),
    //    sortable: true, filterable: false,
    //    pageable:
    //        {
    //            refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 1, totalinfo: false
    //        },
    //    scrollable: true,
    //    //toolbar: ['Export'],
        
    //    columns: [
    //        { field: "No", title: "No" ,width:50},
    //        { field: "BOREPORT", title: "BO REPORT", width:80},
    //        {
    //            headerTemplate: "<span class='hcap' align='center'>PIC</span>",
    //            columns: [{ field: "GASALESatauCARGOASSISTANCE", title: "GA SALES atau CARGO ASSISTANT", width: 200 }, ]
    //        },
    //        { field: "customername", title: "CUSTOMER NAME",width:100},
    //         {
    //             headerTemplate: "<span class='hcap'>MARINE CARGO INSURANCE DATA</span>",
    //             columns: [{ field: "AWB", title: "AWB", width: 90 },
    //                       { field: "ROUTE", title: "ROUTE", width: 50 },
    //                       { field: "FLIGHT", title: "FLIGHT", width: 50 },
    //                       { field: "DATE", title: "DATE", width: 50 },
    //                       { field: "PCS", title: "PCS", width: 50 },
    //                       { field: "Weight", title: "WEIGHT", width: 70 },
    //                       { field: "Commodity", title: "COMMODITY", width: 70 },
    //                       { field: "DecleredvalueIDR", title: "DECLARED VALUE</br>(IDR)", width: 120 },
    //                       { field: "CommodityClassification", title: "COMMODITY CLASSIFICATION",width:150 },
    //                       { field: "CertificateNumber", title: "CERTIFICATE NUMBER",width:120},
    //                      ]
    //         },
    //         {
    //             headerTemplate: "<span class='hcap'>CUSTOMER to GA</span>",
    //             columns: [{ field: "PremiumRate", title: "PUBLISH RATE</br>(PREMIUM RATE)", width: 100 },
    //                       { field: "PublishPremiumRate", title: "PUBLISH PREMIUM RATE</br>(IDR)", width: 140 },
    //                       { field: "ChargeableInsuranceRate", title: "CHARGEABLE INSURANCE RATE</br>(IDR)", width: 140 },
    //                      ]
    //         },
    //         {
    //             headerTemplate: "<span class='hcap'>GA to MARINE INSURANCE Co.</span>",
    //             columns: [{ field: "NETRATE", title: "NET RATE", width: 50 },
    //                       { field: "PremiumRate", title: "NET PREMIUM RATE</br>(IDR)", width: 120 },
    //                       { field: "ChargeableInsuranceRateForGA", title: "CHARGEABLE INSURANCE RATE</br>(IDR)", width: 140 },
    //                      ]
    //         },
    //         {
    //             headerTemplate: "<span class='hcap'>INCENTIVE COMMISSION to</span></br><span class='hcap'>SALES</span>",
    //             columns: [{ field: "Formula", title: "FORMULA", width: 50 },
    //                       { field: "Nominal", title: "NOMINAL</br>(IDR)", width: 50 },
    //                      ]
    //         },
    //        {
    //            headerTemplate: "<span class='hcap'>MARKETING FEE GA</span>",
    //            columns: [{ field: "FormulaForGA", title: "FORMULA", width: 50 },
    //                      { field: "NominalIDR", title: "NOMINAL</br>(IDR)", width: 100 },
    //            ]
    //        },
    //    ]
    //});
    //    }
    //else
    //{
    //    $("#grid").kendoGrid({
    //        autoBind: false,
    //        dataSource: new kendo.data.DataSource({
    //            type: "json",
    //            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
    //            transport: {
    //                read: {
    //                    url: "../MarineInsuranceReport/SearchMarineInsuranceReport",
    //                    dataType: "json",
    //                    global: true,
    //                    type: 'POST',
    //                    method: 'POST',
    //                    contentType: "application/json; charset=utf-8",
    //                    data:
    //                        function GetReportData() {
    //                            return { Model: Model };
    //                        }

    //                }, parameterMap: function (options) {
    //                    if (options.filter == undefined)
    //                        options.filter = null;
    //                    if (options.sort == undefined)
    //                        options.sort = null; return JSON.stringify(options);
    //                },
    //            },
    //            schema: {
    //                model: {
    //                    id: "SNo",
    //                    fields:
    //                      {
    //                          No: { type: "string" },
    //                          BoReport: { type: "string" },
    //                          CargoAssistant: { type: "string" },
    //                          CustomerName: { type: "string" },
    //                          AWB: { type: "string" },
    //                          Route: { type: "string" },
    //                          Flight: { type: "string" },
    //                          Date: { type: "string" },
    //                          Pcs: { type: "string" },
    //                          Weight: { type: "string" },
    //                          Commodity: { type: "string" },
    //                          DeclaredValue: { type: "string" },
    //                          CommodityClassification: { type: "string" },
    //                          CertificateNumber: { type: "string" },
    //                          PublishRate: { type: "string" },
    //                          PublishPremiumRate: { type: "string" },
    //                          ChargeableInsuranceRate: { type: "string" },
    //                          NetRate: { type: "string" },
    //                          NetPremiumRate: { type: "string" },
    //                          ChargeableInsuranceRates: { type: "string" },
    //                          Formula: { type: "string" },
    //                          Nominal: { type: "string" },
    //                          Formulas: { type: "string" },
    //                          Nominals: { type: "string" },
    //                      }
    //                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
    //            },
    //        }),
    //        sortable: true, filterable: false,
    //        pageable:
    //            {
    //                refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 1, totalinfo: false
    //            },
    //        scrollable: true,
    //        //toolbar: ['Export'],

    //        columns: [
    //            { field: "No", title: "No" },
    //            { field: "BOREPORT", title: "BO REPORT" },
    //            {
    //                headerTemplate: "<span class='hcap'>PIC</span>",
    //                columns: [{ field: "GASALESatauCARGOASSISTANCE", title: "GA SALES atau CARGO ASSISTANT", width: 120 }, ]
    //            },
    //            { field: "customername", title: "CUSTOMER NAME" },
    //             {
    //                 headerTemplate: "<span class='hcap'>MARINE CARGO INSURANCE DATA</span>",
    //                 columns: [{ field: "AWB", title: "AWB", width: 90 },
    //                       { field: "ROUTE", title: "ROUTE", width: 50 },
    //                       { field: "FLIGHT", title: "FLIGHT", width: 50 },
    //                       { field: "DATE", title: "DATE", width: 50 },
    //                       { field: "PCS", title: "PCS", width: 50 },
    //                       { field: "Weight", title: "WEIGHT", width: 70 },
    //                       { field: "Commodity", title: "COMMODITY", width: 50 },
    //                       { field: "DecleredvalueIDR", title: "DECLARED VALUE</br>(IDR)" },
    //                       { field: "CommodityClassification", title: "COMMODITY CLASSIFICATION" },
    //                       { field: "CertificateNumber", title: "CERTIFICATE NUMBER" },
    //                 ]
    //             },
    //             {
    //                 headerTemplate: "<span class='hcap'>CUSTOMER to GA</span>",
    //                 columns: [{ field: "PremiumRate", title: "PUBLISH RATE</br>(PREMIUM RATE)" },
    //                       { field: "PublishPremiumRate", title: "PUBLISH PREMIUM RATE</br>(IDR)" },
    //                       { field: "ChargeableInsuranceRate", title: "CHARGEABLE INSURANCE RATE</br>(IDR)" },
    //                 ]
    //             },
    //        ]
    //    });
    //}

    $('#btnSubmit').click(function () {
       
        //if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

        //    alert('From Date can not be greater than To Date');
        //    return false;;
        //}

        if (cfi.IsValidSubmitSection()) {
            var FromDate= $('#FromDate').val();
            var  ToDate= $('#ToDate').val();
            var Airline= $('#Airline').val();
            var City= $('#City').val();
            var Agent = $('#Agent').val();
            var UserSNo = userContext.UserSNo;
           
            $.ajax({
                url: "../MarineInsuranceReport/SearchMarineInsuranceReport",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    FromDate: FromDate, ToDate: ToDate, Airline: Airline, City: City, Agent: Agent, UserSNo: UserSNo
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    $("#imgexcel").show();
                    $('#grid').show();
                    $('#gridbodys').html('');

                    var Result1 = jQuery.parseJSON(result.Result);
                    var Result = Result1.Table0;

                    var thead_body = "";
                    var thead_row = "";

                    if (Result.length > 0) {
                        $('#exportflight').show();
                        var container = $("#gridbodys");
                        var tr = '';
                        var tr1 = '';
                        var td1 = '';
                        var TotalDeclareValue = 0;
                        var TotalMinimumPremiApplied = 0;
                        var TotalChargeablePremi = 0;
                        var TotalChargeableInsuranceRateForGA = 0;
                        var TotalChargeablePremiGAToInsurence = 0;
                        var TotalGENERAL = 0;
                        var TotalPremiumGAFee = 0;
                        var PremiumGAFee = 0;
                        var GENERAL = 0;
                        var PremiumRate = 0;
                        var ChargeableInsuranceRateForGA = 0;
                        var PublishPremiumRate = 0;
                        var MinimumPremiApplied = 0;
                        var ChargeableInsuranceRate = 0;
                        var ChargeablePremiGAToInsurence = 0;
                        var ChargeablePremi = 0;

                        for (var i = 0; i < Result.length; i++) {
                            var count = i + 1;
                           
                            PremiumRate = parseFloat(Result[i].PremiumRate).toFixed(2)
                            if (PremiumRate == 0) {
                                PremiumRate = '';
                            }
                            else
                            {
                                PremiumRate = parseFloat(Result[i].PremiumRate).toFixed(2) + '%'
                            }
                           
                             ChargeableInsuranceRate = parseFloat(Result[i].ChargeableInsuranceRate).toFixed(2);
                            if (ChargeableInsuranceRate == 0) {
                                ChargeableInsuranceRate = '';
                            }

                            PublishPremiumRate = parseFloat(Result[i].PublishPremiumRate).toFixed(2);
                            if (PublishPremiumRate == 0)
                            {
                                PublishPremiumRate = '';
                            }
                            ChargeablePremi = parseFloat(Result[i].ChargeablePremi).toFixed(2);
                            if (ChargeablePremi == 0) {
                                ChargeablePremi = '';
                            }
                             MinimumPremiApplied = parseFloat(Result[i].MinimumPremiApplied).toFixed(2);
                            if (MinimumPremiApplied == 0) {
                                MinimumPremiApplied = '';
                            }
                            var PremiumGAFee = Result[i].PremiumGAFee;
                            if (PremiumGAFee == 0)
                            {
                                PremiumGAFee = '';
                            }
                                ChargeablePremiGAToInsurence = Result[i].ChargeablePremiGAToInsurence
                                TotalPremiumGAFee = parseFloat(TotalPremiumGAFee) + parseFloat(Result[i].PremiumGAFee)
                                TotalChargeablePremiGAToInsurence = parseFloat(TotalChargeablePremiGAToInsurence) + parseFloat(Result[i].ChargeablePremiGAToInsurence)
                           
                            
                            var NETRATE = Result[i].NETRATE
                            if (NETRATE == '0.00%')
                            {
                                NETRATE = '';
                            }

                            ChargeableInsuranceRateForGA = parseFloat(Result[i].ChargeableInsuranceRateForGA).toFixed(2)
                            if (ChargeableInsuranceRateForGA == 0)
                            {
                                ChargeableInsuranceRateForGA = '';
                            }

                            if (ChargeablePremiGAToInsurence == 0)
                            {
                                ChargeablePremiGAToInsurence = '';
                            }
                            if (TotalChargeablePremiGAToInsurence == 0) {
                                TotalChargeablePremiGAToInsurence = '';
                            }
                            
                            if (TotalPremiumGAFee == 0)
                            {
                                TotalPremiumGAFee = '';
                            }
                             GENERAL = parseFloat(Result[i].MinimumPremiApplied-Result[i].ChargeableInsuranceRateForGA).toFixed(2);
                            if (GENERAL == 0)
                            {
                                GENERAL = '';
                            }
                            TotalDeclareValue = parseFloat(TotalDeclareValue) + parseFloat(Result[i].DecleredvalueIDR);
                            TotalMinimumPremiApplied = parseFloat(TotalMinimumPremiApplied) + parseFloat(Result[i].MinimumPremiApplied);
                            TotalChargeablePremi = parseFloat(TotalChargeablePremi) + parseFloat(Result[i].ChargeablePremi);
                            //alert(TotalChargeablePremi)
                            //if (TotalChargeablePremi == 0)
                            //{
                            //    TotalChargeablePremi = '';
                             
                                
                            //}
                            TotalChargeableInsuranceRateForGA = parseFloat(TotalChargeableInsuranceRateForGA) + parseFloat(Result[i].ChargeableInsuranceRateForGA)
                            
                            TotalGENERAL = TotalGENERAL + parseFloat(Result[i].MinimumPremiApplied-Result[i].ChargeableInsuranceRateForGA)
                             
                            tr += '<tr class="datarow">';
                            var td = '';
                            td += "<td class='ui-widget-content'  id='No'> <span  maxlength='100' style='width:100px;'>" + count + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainNo'> <span  maxlength='100' style='width:100px;'>" + Result[i].BOREPORT + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainSource'> <span  maxlength='100' style='width:100px;'>" + Result[i].GASALESatauCARGOASSISTANCE + "</span></td>";
                            td += "<td class='ui-widget-content'  id='DTClosed'> <span  maxlength='100' style='width:100px;'>" + Result[i].customername + "</span></td>";
                            td += "<td class='ui-widget-content'  id='DTopen'> <span  maxlength='100' style='width:100px;'>" + Result[i].AWB + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainSubject'> <span  maxlength='100' style='width:100px;'>" + Result[i].ROUTE + "</span></td>";
                            td += "<td class='ui-widget-content'  id='CUSTOMER'> <span  maxlength='100' style='width:100px;'>" + Result[i].FLIGHT + "</span></td>";
                            td += "<td class='ui-widget-content'  id='AWB'> <span  maxlength='100' style='width:100px;'>" + Result[i].DATE + "</span></td>";
                            td += "<td class='ui-widget-content'  id='FLTNO'> <span  maxlength='100' style='width:100px;'>" + Result[i].PCS + "</span></td>";
                            td += "<td class='ui-widget-content'  id='FLTDATE'> <span  maxlength='100' style='width:100px;'>" + Result[i].Weight + "</span></td>";
                            td += "<td class='ui-widget-content'  id='Origin'> <span  maxlength='100' style='width:100px;'>" + Result[i].Commodity + "</span></td>";
                            td += "<td class='ui-widget-content'  id='Destination'> <span  maxlength='100' style='width:100px;'>" + Result[i].CommodityClassification + "</span></td>";
                            td += "<td class='ui-widget-content'  id='Commodity' align='right'> <span  maxlength='100' style='width:100px;'>" + Result[i].DecleredvalueIDR + "</span></td>";
                            td += "<td class='ui-widget-content'  id='PCS'> <span  maxlength='100' style='width:100px;'>" + Result[i].CertificateNumber + "</span></td>";
                            td += "<td class='ui-widget-content'  id='KGS' align='right'> <span  maxlength='100' style='width:100px;'>" + PremiumRate + "</span></td>";
                            td += "<td class='ui-widget-content'  id='13 DAYS' align='right'> <span  maxlength='100' style='width:100px;'>" + ChargeableInsuranceRate + "</span></td>";
                            td += "<td class='ui-widget-content'  id='46 DAYS' align='right'> <span  maxlength='100' style='width:100px;'>" + MinimumPremiApplied + "</span></td>";
                            td += "<td class='ui-widget-content'  id='7DAYS' align='right'> <span  maxlength='100' style='width:100px;'>" + PublishPremiumRate + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + ChargeablePremi + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + NETRATE + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + ChargeableInsuranceRateForGA + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + ChargeablePremiGAToInsurence + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + GENERAL + "</span></td>";
                            td += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + PremiumGAFee + "</span></td>";
                           tr += td + "</tr>";
                        }
                        container.append(tr);
                        tr1 += '<tr class="ui-widget-header" style="text-align:center">';
                        td1 += "<td class='ui-widget-content' colspan='12'  id='ComplainStatus'> <span  maxlength='100' style='width:100px;'>TOTAL</span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + parseFloat(TotalDeclareValue).toFixed(2) + "</span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus'> <span  maxlength='100' style='width:100px;'></span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus'> <span  maxlength='100' style='width:100px;'></span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus'> <span  maxlength='100' style='width:100px;'></span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus' align='right' > <span  maxlength='100' style='width:100px;'>" + parseFloat(TotalMinimumPremiApplied).toFixed(2) + "</span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus'> <span  maxlength='100' style='width:100px;'></span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + parseFloat(TotalChargeablePremi).toFixed(2) + "</span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus'> <span  maxlength='100' style='width:100px;'></span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + parseFloat(TotalChargeableInsuranceRateForGA).toFixed(2) + "</span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus' align='right' > <span  maxlength='100' style='width:100px;'>" + parseFloat(TotalChargeablePremiGAToInsurence).toFixed(2) + "</span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + parseFloat(TotalGENERAL).toFixed(2) + "</span></td>";
                        td1 += "<td class='ui-widget-content'  id='ComplainStatus' align='right'> <span  maxlength='100' style='width:100px;'>" + parseFloat(TotalPremiumGAFee).toFixed(2) + "</span></td>";
                        tr1 += td1 + "</tr>";
                        container.append(tr1);

                    }
                    else {
                        $("#gridbodys").append('<tr><td colspan="20" align="center">NO RECORD FOUND</td></tr>')
                    }



                },
                error: function (xhr) {
                    var a = "";
                }

            });
        }
    });
});
var Model = [];

//function SearchMarineInsuranceReport()
//{
//    Model =
//       {
//           FromDate: $('#FromDate').val(),
//           ToDate: $('#ToDate').val(),
//           Airline: $('#Airline').val(),
//           City: $('#City').val(),
//           Agent: $('#Agent').val(),
//           UserSNo: userContext.UserSNo
//       };
//    var WhereCondition = "";
//    if (Date.parse(Model.FromDate) > Date.parse(Model.ToDate))
//    {
//        ShowMessage('warning', 'Warning - Report ', "From Date can not be greater than To Date !");
//        return;
//    }
//    if (Model.Airline != "")
//    {
//            $('#grid').css('display', '')
//            $("#grid").data('kendoGrid').dataSource.page(1);
//            $("#imgexcel").show();
//    }
//}
function ExportToExcel()
{
    Model =
      {
          FromDate: $('#FromDate').val(),
          ToDate: $('#ToDate').val(),
          Airline: $('#Airline').val(),
          City: $('#City').val(),
          Agent: $('#Agent').val(),
          UserSNo: userContext.UserSNo
      };
    $('#MarineToExcel #FromDate').val(Model.FromDate);
    $('#MarineToExcel #ToDate').val(Model.ToDate);
    $('#MarineToExcel #Airline').val(Model.Airline);
    $('#MarineToExcel #City').val(Model.City);
    $('#MarineToExcel #Agent').val(Model.Agent);
    $('#MarineToExcel #UserSNo').val(Model.UserSNo);
    $('#MarineToExcel').submit();
}

$(document).ready(function () {
    $("#grid").kendoTooltip({
        filter: "tr:not(.k-grouping-row):not(.k-footer-template) :nth-child(n):not(.k-group-cell):not(:empty):not(:has(div)):not(:has(input)):not(:has(span:not(.k-dirty):not(.k-filter):empty)):not(a)",
        width: 120,
        position: "top",
        content: function (e) {
            var target = e.target;
            return $(target).text();

        }
    });
});


