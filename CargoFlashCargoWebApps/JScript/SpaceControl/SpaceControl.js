
/// <reference path="../../Scripts/KendoSchedular/Content/JS/kendo.dataviz.min.js" />
// <copyright file="SpaceControl.js" company="Cargoflash">
//
// Created On: 21-Feb-2017
// Created By: Braj
// Description:
//----------------------------------------------------------------------------
// Updated On: 14-Aug-2018
// Updated By: Tarun K Singh
// Description: Added lock event when awb is in use by another user
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
//</copyright>
SiteUrl = window.location.origin + '/';
var url = function () { return SiteUrl + "Services/AutoCompleteService.svc/AutoCompleteDataSourceV2"; }
var GarudaApp = angular.module("GarudaApp", ["kendo.directives"]);

GarudaApp.controller("GraudaController", ["$scope", "$rootScope", "$compile", "$http", "$window",
    function ($scope, $rootScope, $compile, $http, $window) {
        var garuda = this;
        $scope.ReplanOffloadAutoFillOrigin = userContext.SysSetting.ReplanOffloadAutoFillOrigin.toUpperCase() == "TRUE";
        $scope.ReplanFromBooking = false;
        $scope.maxDate = new Date(new Date().getUTCFullYear() + 1, 0, new Date().getMonth());
        $scope.minDate = new Date();
        $scope.currentDate = kendo.toString(new Date(), 'dd-MMM-yyyy');
        $scope.ChooseChartType = "column";
        $scope.ReplanFrom = "SpaceControl";

        $scope.DateChanged = function () {
            var date = new Date($scope.SearchRequest.FlightDate);
            if (date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
                $scope.SearchRequest.FlightDate = '';
        }


        $scope.Airlines = "";
        var GetAirport = function () {
            $.ajax({
                type: "POST",
                url: "/schedule/GetAirports",
                //data: { __RequestVerificationToken: angular.element('input[name= __RequestVerificationToken]').val() },
                success: function (result) {
                    var d = JSON.parse(result);
                    if (d.length > 0)
                        if (d[0].IsAllAirlines == "0")
                            $scope.Airlines = d[0].Airlines.TrimRight();
                        else
                            $scope.Airlines = '';
                }
            });
        }
        //Replan from reservation booking
        $scope.LoadReplan = function (AWBSNo, Status) {
             GetAirport();
            if (AWBSNo > 0) {

                $scope.replanAWBSelectDetails = { AWBRefBookingSNo: AWBSNo, BookedFrom: 'Reservation' };
                $scope.ReplanFromBooking = true;
                $scope.btnReplanHide = true;
                $scope.btnResetHide = true;
                $scope.ReplanFlightDivHide = true;
                $scope.IsReplan = false;
                if (Status != undefined && Number(Status) >= 4) {
                    $scope.ReplanFrom = "Reservation";
                } if (Status != undefined && Number(Status) < 4)
                    $scope.ReplanFrom = "POMail";
                //$scope.ExistPlanGridOptions.dataSource.read();
                $.ajax({
                    url: "/spaceControl/ReplanFlightDetails",
                    dataType: "json",
                    type: "post", global: false,
                    data: { AWBRefBookingSNo: $scope.replanAWBSelectDetails.AWBRefBookingSNo, BookedFrom: $scope.replanAWBSelectDetails.BookedFrom, dailyFlightSNo: $scope.replanAWBSelectDetails.DailyFlightSNo, airportSNo: $scope.replanAWBSelectDetails.AirportSNo || 0, ACSNo: $scope.replanAWBSelectDetails.AccountSNo || 0 },
                    success: function (data) {
                        $scope.ExistPlanData = [];
                        if (data.Table0.length > 0) {
                            $scope.ReplanDataSource = [];
                            $scope.CurrentPlan = angular.copy(data.Table0[0]);
                            $scope.AWBInfo = data.Table0[0];
                            if ($scope.replanAWBSelectDetails.BookedFrom == "Offloaded")
                                $scope.ExistPlanData.push({ Header: 'Offload Details', data: data.Table1, IsOffload: true });
                            else {
                                $scope.ExistPlanData.push({ Header: 'Existing Flight Plan', data: data.Table1, IsOffload: false });
                                if (data.Table2 && data.Table2.length > 0)
                                    $scope.ExistPlanData.push({ Header: 'Offload Details', data: data.Table2, IsOffload: true });
                            }
                            try {
                                $scope.$apply();
                            } catch (e) { }
                        }
                        loadReplanTemplate(AWBSNo);

                    }
                });


            }

        }
        $scope.ItineraryDateChange = false;
        $scope.DateChangedReplan = function () {
            $scope.ItineraryDateChange = true;
            var date = new Date($scope.SearchReplanRequest.ItineraryDate);
            if (date.setHours(0, 0, 0, 0) < $scope.minDate.setHours(0, 0, 0, 0))
                $scope.SearchReplanRequest.ItineraryDate = '';
        }


        $scope.btnSubmitHide = true;
        $scope.IsManualRoute = true;
        $scope.CurrentPlan;

        $scope.SearchOffloadShipment = function () {
            $scope.divoffloadGrid = false;
            $scope.SearchRequest.Origin = $scope.OriginModel.key || $scope.OriginModel.Key;
            $scope.OffloadShipmentGridOptions.dataSource.read($scope.SearchRequest);

            //setTimeout(function () {
            //    if (isCreate == true) {
            //        $(".wa").attr("disabled", false)
            //    } else {
            //        $(".wa").attr("disabled", true)
            //    }

            //}, 2000)
        }



        $scope.OffloadShipmentGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                type: "json",
                serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 5,
                transport: {
                    read: {
                        url: SiteUrl + "spaceControl/OffloadShipmentGridData",
                        contentType: "application/json; charset=utf-8",
                        type: 'POST',
                        dataType: "json", global: false, data: function () { return $scope.SearchRequest; }
                    }, parameterMap: function (options) {
                        if (options.filter == undefined)
                            options.filter = null;
                        if (options.sort == undefined)
                            options.sort = null; return JSON.stringify(options);
                    },
                },
                schema: {
                    data: function (data) {
                        return JSON.parse(data.Data);
                    }, total: function (data) { return data.Total; }
                }
            }),
            filterable: { mode: 'menu' },
            sortable: true, filterable: true,
            pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
            columns: [
                { field: "BookingRefNo", title: "Booking Ref No", width: 70 },
                { field: "FlightNo", title: "Off-Loaded From Flight", width: "90px", filterable: true, },
                { field: "FlightDate", title: "Flight Date", width: 70 },
                { field: "AWBNo", title: "AWB No", width: 70 },
                { field: "Board", title: "Origin", width: "70px" },
                { field: "Destination", title: "Destination", width: "70px" },
                { field: "Pieces", title: "Pieces", width: 50 },
                { field: "GrossWeight", title: "Gross Weight", width: "60px" },
                { field: "FlightVolume", title: "Volume(CBM)", width: "60px" },
                //{ field: "Status", title: "Status", width: "50px" },

                {
                    template: '<input type="button" value="Replan Offload" class="inProgress wa" ng-click="ReplanAWBFlight(dataItem,true);">',
                    title: "Replan", width: "50px"
                },
            ]
        }






        $scope.toolTipOptions = {
            filter: "td:nth-child(17),td:nth-child(14),td:nth-child(16),td:nth-child(22)",
            position: "top",
            content: function (e) {
                var grid = e.target.closest(".k-grid").getKendoGrid();
                var dataItem = grid.dataItem(e.target.closest("tr"));
                if (e.target != undefined && e.target.context != undefined && e.target.context.cellIndex == 15) {
                    return dataItem.CommodityDesc.TrimRight(',');
                }
                else if (e.target != undefined && e.target.context != undefined && e.target.context.cellIndex == 13) {
                    return dataItem.Product;
                }
                else if (e.target != undefined && e.target.context != undefined && e.target.context.cellIndex == 16) {
                    return dataItem.SHC.TrimRight(',');
                }
                else if (e.target != undefined && e.target.context != undefined && e.target.context.cellIndex == 21) {
                    return dataItem.PriorityName;
                }
            },
            show: function (e) {
                this.popup.element[0].style.width = "300px";
                if (this.content.text().length > 0) {
                    this.content.parent().css("visibility", "visible");
                } else
                    this.content.parent().css("visibility", "hidden");
            }
        }


        //$scope.existGridtoolTip = {
        //    filter: "td:nth-child(1)",
        //    position: "top",
        //    content: function (e) {
        //        var grid = e.target.closest(".k-grid").getKendoGrid();
        //        var dataItem = grid.dataItem(e.target.closest("tr"));
        //        if (dataItem.IsReplan == 1) {
        //            return 'This sector has not been selected for Replan';
        //        } else
        //            return '';
        //    },
        //    show: function (e) {
        //        this.popup.element[0].style.width = "300px";
        //        this.popup.element.addClass('warning')
        //        if (this.content.text().length > 0) {
        //            this.content.parent().css("visibility", "visible");
        //        } else
        //            this.content.parent().css("visibility", "hidden");
        //    }
        //}


        //cfi.AutoComplete("AWBNo", "AWBNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null, "contains");

        //cfi.AutoComplete("AWBNo", "AWBNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null, "contains");
        $scope.K_Options = function (extra_ConditionId, autoCompleteName) {

            return {
                dataTextField: 'Text',
                dataValueField: 'Key',
                template: '<span>#: TemplateColumn #</span>',
                IsChangeOnBlankValue: false,
                dataSource: new kendo.data.DataSource({
                    type: "json",
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    allowUnsort: true,
                    pageSize: 10,
                    batch: true,
                    transport: {
                        read: {
                            url: SiteUrl + 'Services/AutoCompleteService.svc/AutoCompleteDataSourceV2',
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            data: { autoCompleteName: autoCompleteName }
                        },
                        parameterMap: function (options) {

                            if (options.filter != undefined) {
                                var filter = $scope.ExtraCondition(extra_ConditionId);
                                if (filter == undefined) {
                                    filter = { logic: "AND", filters: [] };
                                }
                                filter.filters.push(options.filter);
                                options.filter = filter;
                            }
                            if (options.sort == undefined)
                                options.sort = null;
                            return JSON.stringify(options);
                        }
                    },
                    schema: { data: "Data" }
                })
            };
        }


        $scope.K_Text_Options = function (extra_ConditionId, autoCompleteName) {

            return {
                dataTextField: 'Text',
                dataValueField: 'Text',
                template: '<span>#: TemplateColumn #</span>',
                IsChangeOnBlankValue: false,
                dataSource: new kendo.data.DataSource({
                    type: "json",
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    allowUnsort: true,
                    pageSize: 10,
                    batch: true,
                    transport: {
                        read: {
                            url: SiteUrl + 'Services/AutoCompleteService.svc/AutoCompleteDataSourceV2',
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            data: { autoCompleteName: autoCompleteName }
                        },
                        parameterMap: function (options) {

                            if (options.filter != undefined) {
                                var filter = $scope.ExtraCondition(extra_ConditionId);
                                if (filter == undefined) {
                                    filter = { logic: "AND", filters: [] };
                                }
                                filter.filters.push(options.filter);
                                options.filter = filter;
                            }
                            if (options.sort == undefined)
                                options.sort = null;
                            return JSON.stringify(options);
                        }
                    },
                    schema: { data: "Data" }
                })
            };
        }


        /* Button click Events Start Region*/
        $scope.OriginModel = $scope.ReplanOffloadAutoFillOrigin == true ? { key: userContext.AirportSNo.toString(), Text: userContext.AirportCode } : { key: "", Text: "" };
        $scope.SearchRequest = { FlightDate: kendo.toString(new Date(), 'dd-MMM-yyyy'), OrderBy: 'ETD', IsGraphical: false,FlightNo:"",Origin:"" };

        $scope.SearchFlights = function () {

            $("#SpaceControlSearchForm").cfValidator();
            if ($("#SpaceControlSearchForm").data('cfValidator').validate()) {

                if ($scope.SearchRequest.IsGraphical) {
                    if ($("div").kendoChart == undefined)
                        addScript(GetChartData);
                    else
                        GetChartData();
                } else
                    GetFlightsResult();
            }

        }

        function GetChartData() {
            $.ajax({
                type: "post",
                url: SiteUrl + "/spaceControl/spaceControlSearch",
                data: $scope.SearchRequest,
                success: createChart
            });
        }

        $scope.$watch('ChooseChartType', function (value) {
            RefreshChart();
        }, true);


        function RefreshChart() {
            if ($scope.series == undefined)
                return false;
            var chart = $("#divSpaceControlChart").data("kendoChart"),
                type = $("input[name=seriesType]:checked").val(),
                stack = $("#stack").prop("checked");
            var rotation = 10;
            if (type == 'column' || type == 'line')
                rotation = -30;
            for (var i = 0, length = $scope.series.length; i < length; i++) {
                $scope.series[i].stack = stack;
                $scope.series[i].type = type;
            };

            chart.setOptions({
                series: $scope.series,
                categoryAxis: {
                    labels: {
                        rotation: rotation
                    }
                }
            });
        }

        function createChart(data) {
            //$(".options").unbind('change').bind("change", RefreshChart);
            var categories = [], dataConfirm = [], dataQueue = [], dataRemGross = [], dataRemVol = [], dataUsedGross = [], dataUsedVol = [], dataRevenue = [], dataYield = [];
            $scope.series = [];
            $.map(JSON.parse(data), function (item) {
                categories.push(item.FlightNo);
                dataConfirm.push(parseFloat(item.Confirm));
                dataQueue.push(parseFloat(item.Queue));
                dataUsedGross.push(parseFloat(item.UsedGrossWeight) / 100);
                dataUsedVol.push(parseFloat(item.UsedVolume));
                dataRemGross.push(parseFloat(item.RemainingGrossWeight) / 100);
                dataRemVol.push(parseFloat(item.RemainingVolume));
                dataRevenue.push(parseFloat(item.Revenue) / 1000000);
                dataYield.push(parseFloat(item.Yield) / 1000000);

            });
            $scope.series.push({ name: "Confirm", data: dataConfirm, color: 'green' });
            $scope.series.push({ name: "Queue", data: dataQueue, color: 'red' });
            $scope.series.push({ name: "Remaining Gross(Kg)", data: dataRemGross, color: '#1976d2' });
            $scope.series.push({ name: "Remaining Volume", data: dataRemVol, color: '#f3ac32' });
            $scope.series.push({ name: "Used Gross(Kg)", data: dataUsedGross, color: '#bb6e36' });
            $scope.series.push({ name: "Used Volume", data: dataUsedVol, color: '#b8b8b8' });
            $scope.series.push({ name: "Revenue(M)", data: dataRevenue, color: '#b407f3' });
            $scope.series.push({ name: "Yield(M)", data: dataYield, color: '#f300ce' });
            var type = $("input[name=seriesType]:checked").val(),
                stack = $("#stack").prop("checked");

            $("#divSpaceControlChart").kendoChart({
                legend: {
                    visible: true,
                    position: 'top'
                },
                seriesDefaults: {
                    type: type,
                    stack: stack
                },
                series: $scope.series,
                valueAxis: {
                    // max: 180,
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                categoryAxis: {
                    categories: categories,
                    majorGridLines: {
                        visible: false
                    }, labels: {
                        rotation: -30
                    }
                },
                tooltip: {
                    visible: true,
                    template: "#=category# #= series.name #: #= value #"
                }, seriesClick: onSeriesClick,
            });
        }

        function onSeriesClick(e) {
            $scope.SearchRequest.FlightNo = e.category;
            if (e.series.name == 'Confirm')
                $scope.SearchRequest.SearchBy = 'KK';
            else if (e.series.name == 'Queue')
                $scope.SearchRequest.SearchBy = 'LL';
            else
                $scope.SearchRequest.SearchBy = 'Both';
            GetFlightsResult();
        }

        function GetFlightsResult() {
            var tabtxt = "Space Control Search Result";
            if ($scope.SearchRequest.AWBNo != undefined && $scope.SearchRequest.AWBNo != "")
                tabtxt = "AWB No Details"
            var item = $scope.tabstrip2.tabGroup.find(':contains("' + tabtxt + '")');
            if (item.length > 0)
                $scope.tabstrip2.select(item.index());
            else {
                if ($scope.SearchRequest.AWBNo != undefined && $scope.SearchRequest.AWBNo != "")
                    $scope.AddNewTab(tabtxt, '<div id="AWBNoDetailsTabDive" ></div>');
                else
                    $scope.AddNewTab(tabtxt, '<kendo-grid options="searchFlightResultsGridOptions"></kendo-grid>');
            }
            if ($scope.SearchRequest.AWBNo != undefined && $scope.SearchRequest.AWBNo != "")
                GetTabData(SiteUrl + '/spaceControl/GetAWBNoDetails', 'POST', { AWBNo: $scope.SearchRequest.AWBNo, IsTab: true }, 'AWBNoDetailsTabDive');
            else
                $scope.searchFlightResultsGridOptions.dataSource.read($scope.SearchRequest);
        }

        function GetTabData(url, type, data, divId) {
            $.ajax({
                type: type,
                url: url,
                data: data,
                success: function (result) {
                    $('#' + divId).html(result);
                    $compile($('#' + divId))($scope);

                }
            });

        }

        $rootScope.GetFlightDetails = function (DailyFlightSNo, FlightNo, FlightDate,isAWB) {
            $scope.awbDeatilsRequest = { DailyFlightSNo: DailyFlightSNo, FlightNo: FlightNo, FlightDate: kendo.toString(new Date(FlightDate), 'dd-MMM-yyyy'), airPort: 0, IsSpace: true };
            var tabtxt = "Flight Details";
            if (isAWB) {
                $scope.ViewAWBDetailsTab();
            } else {
                var item = $scope.tabstrip2.tabGroup.find(':contains("' + tabtxt + '")');
                if (item.length > 0)
                    $scope.tabstrip2.select(item.index());
                else
                    $scope.AddNewTab(tabtxt, '<div id="FlightDetailsTabDive" ></div>');
                LoadFlightDetails($scope.awbDeatilsRequest);
            }

        }

        function LoadFlightDetails(req) {
            if ($('#FlightDetailsTabDive').length > 0)
                $.ajax({
                    type: "GET",
                    url: SiteUrl + "/spaceControl/FlightDetails",
                    data: req,
                    success: function (result) {
                        $('#FlightDetailsTabDive').html(result);
                        $compile($('#FlightDetailsTabDive'))($scope);
                    }
                });
        }

        $scope.FlightwiseAWBNo = function () {

            if ($scope.SearchRequest.FlightDate != "" && $scope.SearchRequest.FlightNo != "") {
                $scope.awbDeatilsRequest = { DailyFlightSNo: 0, FlightNo: $scope.SearchRequest.FlightNo, FlightDate: $scope.SearchRequest.FlightDate, airPort: 0, IsSpace: true };
                $scope.ViewAWBDetailsTab();
            }

        }

        $scope.ViewAWBDetailsTab = function () {
            var tabtxt = "AWB Details";
            var item = $scope.tabstrip2.tabGroup.find(':contains("' + tabtxt + '")');
            if (item.length > 0)
                $scope.tabstrip2.select(item.index());
            else
                $scope.AddNewTab(tabtxt, '<kendo-grid options="AWBDetailsSerachGridOptions"><div k-detail-template><div kendo-tooltip k-options="toolTipOptions"><kendo-grid  k-options="AWBDetailsInitGrid(dataItem)"></kendo-grid></div></div></kendo-grid>');
            //$scope.AddNewTab(tabtxt, '<kendo-grid options="AWBDetailsSerachGridOptions"><div k-detail-template><kendo-grid  k-options="AWBDetailsInitGrid(dataItem)"></kendo-grid></div></kendo-grid>');

            $scope.AWBDetailsSerachGridOptions.dataSource.read();
        }

        $scope.AddNewTab = function (txt, content) {
            $scope.tabstrip2.insertAfter(
                {
                    text: txt + ' <span ng-click="removeTab($event)" class="k-icon k-i-close"></span>',
                    encoded: false,
                    content: content
                },
                $scope.tabstrip2.tabGroup.children("li:last")
            );
            $compile($scope.tabstrip2.tabGroup.children("li:last"))($scope);
            $scope.tabstrip2.select($scope.tabstrip2.tabGroup.children("li:last").index());
        }
        $scope.removeTab = function (event) {
            var item = $(event.currentTarget).closest(".k-item");
            var index = item.index();
            $scope.tabstrip2.remove(index);
            $scope.tabstrip2.select(index - 1);
        };

        /*Start Replan Flight Region*/

        $scope.ReplanDataSource = [];
        $scope.ReplanAWBFlight = function (dataItem, isOffloadShipment) {
            $scope.IsOffloadShipment = isOffloadShipment;
            $scope.replanAWBSelectDetails = dataItem;

            ///tarun
            var message = "";
            $.ajax({
                url: SiteUrl + "Services/CommonService.svc/GetAWBLockedEvent",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    awbLockedEvent: {
                        UserSNo: parseInt(userContext.UserSNo), AWBSNo: parseInt($scope.replanAWBSelectDetails.AWBSNo), DailyFlightSNo: "", FlightNo: "", FlightDate: "", ULDNo: ""
                    }
                }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    if (Data.Table0.length > 0) {
                        if (Data.Table0[0].Status1 == 1) {
                            //change by ashish 30aug19 for fetch alter message
                            //ShowMessage('warning', 'Warning - AWB Locked Information', "AWB No <b>" + Data.Table0[0].AWBNo + "</b> is currently in use for <b>" + Data.Table0[0].LockedProcessName + "</b> by <b>" + Data.Table0[0].UserName + "</b> since <b>" + Data.Table0[0].LockedOn + "</b>.", "bottom-right");
                            ShowMessage('warning', 'Warning - AWB Locked Information', Data.Table0[0].Message, "bottom-right");
                            message = "Fail";
                        }

                    }
                },
                error: function (error) {

                }
            });
            ///tarun
            if (message != "") { return; }
            var item = $scope.tabstrip2.tabGroup.find(':contains("Replan AWB Flight")');
            if (item.length > 0)
                $scope.tabstrip2.select(item.index());
            else
                $scope.AddNewTab('Replan AWB Flight', '<div id="ReplanFlightDetailsTabDive" ></div>');

            $.ajax({
                url: "/spaceControl/ReplanFlightDetails",
                dataType: "json",
                type: "post", global: false,
                data: { AWBRefBookingSNo: $scope.replanAWBSelectDetails.AWBRefBookingSNo, BookedFrom: $scope.replanAWBSelectDetails.BookedFrom, dailyFlightSNo: $scope.replanAWBSelectDetails.DailyFlightSNo, airportSNo: $scope.replanAWBSelectDetails.AirportSNo || 0, ACSNo: $scope.replanAWBSelectDetails.AccountSNo || 0 },
                success: function (data) {
                    $scope.ExistPlanData = [];
                    if (data.Table0.length > 0) {
                        $scope.ReplanDataSource = [];
                        $scope.CurrentPlan = angular.copy(data.Table0[0]);
                        $scope.AWBInfo = data.Table0[0];
                        if ($scope.replanAWBSelectDetails.BookedFrom == "Offloaded")
                            $scope.ExistPlanData.push({ Header: 'Offload Details', data: data.Table1, IsOffload: true });
                        else {
                            $scope.ExistPlanData.push({ Header: 'Existing Flight Plan', data: data.Table1, IsOffload: false });
                            if (data.Table2 && data.Table2.length > 0)
                                $scope.ExistPlanData.push({ Header: 'Offload Details', data: data.Table2, IsOffload: true });
                        }
                        try {
                            $scope.$apply();
                        } catch (e) { }
                    }
                    loadReplanTemplate(dataItem.AWBSNo);

                }
            });

            $scope.btnReplanHide = true;
            $scope.btnResetHide = true;
            $scope.ReplanFlightDivHide = true;

            $scope.CurrentPlanGridOptions.dataSource.data([]);
            $scope.IsReplan = false;


        }
        $scope.ExistPlanData = [];
        var loadReplanTemplate = function (AWBSNo) {

            $.ajax({
                type: "POST",
                url: SiteUrl + "spaceControl/ReplanFlight",
                data: { awbSNo: AWBSNo },
                success: function (result) {
                    $('#ReplanFlightDetailsTabDive').html('');
                    $('#ReplanFlightDetailsTabDive').html(result);
                    $compile($('#ReplanFlightDetailsTabDive'))($scope);

                    //$scope.ExistPlanGridOptions.dataSource.read();
                    // setTimeout(function () {
                    //UserSubProcessRights("ReplanFlightDetailsTabDive", 3520);  -- commented by tks due to an issue 30/08
                    //$(".btn-success").attr("style", "");
                    //$(".btn-danger").attr("style", "");
                    //$(".btn-primary").attr("style", "");
                    //$(".btn-block").attr("style", "");
                    // }, 1)
                    // PagerightsCheck();
                    setTimeout(function () {

                        UserSubProcessRightsRepalne();
                    }, 1000)





                }
            });
        }

        var DefaultRoute = function (routeType) {
            var grid = $scope.exitsPlanGrid;
            if (routeType == "Origin")
                return Getselected(grid.dataItems(), 'Is_Origin').Board || "";
            else if (routeType == "OriginSNo")
                return Getselected(grid.dataItems(), 'Is_Origin').OriginSNo || 0;
            else if (routeType == "DestinationSNo")
                return Getselected(grid.dataItems(), 'Is_Destination').DestinationSNo || 0;
            else
                return Getselected(grid.dataItems(), 'Is_Destination').Off || "";
        }

        var ResetSearchReplanRequest = function (dataItem) {


            var refNo = dataItem.ReferenceNumber;

            var BookedFrom = "B";
            if ($scope.replanAWBSelectDetails.BookedFrom == "Reservation") {
                if (parseInt(dataItem.AWBStatus) > 4) {
                    BookedFrom = "E";
                    refNo = dataItem.AWBNo;
                }
            } else {
                BookedFrom = "P";
                if (parseInt(dataItem.AWBStatus) > 1)
                    BookedFrom = "PE";
            }


            $scope.SearchReplanRequest = {
                SearchFrom: BookedFrom,
                BookingNo: refNo,
                DailyFlightSNo: dataItem.DailyFlightSNo,
                AWBPrefix: dataItem.AWBPrefix,
                AgentSNo: dataItem.AgentSNo,
                Product: dataItem.ProductSNo,
                CommoditySNo: dataItem.CommoditySNo,
                ItineraryPieces: dataItem.Pieces,
                ItineraryGrossWeight: dataItem.GrossWeight,
                ItineraryVolumeWeight: dataItem.CBM,
                PaymentType: dataItem.PaymentType,
                SPHC: dataItem.SPHCSNo,
                ItineraryFlightNo: '',
                ItineraryDate: kendo.toString($scope.minDate, 'dd-MMM-yyyy'),
                ItineraryCarrierCode: '',
                ItineraryTransit: '',
                IsMCT: 0,
                ETD: ETA,
                Origin: DefaultRoute("Origin"),
                Destination: DefaultRoute("Destination"),
                OriginModel: { Key: DefaultRoute("OriginSNo"), Text: DefaultRoute("Origin"), TemplateColumn: DefaultRoute("Origin") },
                DestinationModel: { Key: DefaultRoute("DestinationSNo"), Text: DefaultRoute("Destination"), TemplateColumn: DefaultRoute("Destination") }

            }

        }



        $scope.ExistPlanGridOptions = function (data, IsOffload) {
            return {
                dataSource: new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                            fields: { FlightNo: { type: "string" }, Is_Origin: { type: 'boolean' }, Is_Destination: { type: 'boolean' } }
                        }
                    },
                }),
                columns: [
                    {
                        template: '<input  #= IsDisable==1 ? \'disabled\' : "" # class="k-radio radioCls" #= Is_Origin ? \'checked="checked"\' : "" # id="Is_Origin#=uid#" type="radio" value="cgk"><label class="k-radio-label" for="Is_Origin#=uid#">' +
                            '</label><input #= IsDisable==1 ? \'disabled\' : "" # class="k-radio radioCls" #= Is_Destination ? \'checked="checked"\' : "" # id="Is_Destination#=uid#" type="radio" value="cgk"><label class="k-radio-label" for="Is_Destination#=uid#"></label>',
                        title: "Select Plan", width: 40
                    },
                    { field: "FlightNo", title: "Flight No", width: 60 },
                    { field: "FlightDate", title: "Flight Date", width: 60 },
                    { field: "Board", title: "Origin", width: 40 },
                    { field: "Off", title: "Dest", width: 40 },
                    { template: "#=ETD.slice(0,5)#", title: "ETD", width: 40 },
                    { template: "#=ETA.slice(0,5)#", title: "ETA", width: 40 },
                    { field: "Pieces", title: "Pieces", width: 50 },
                    { field: "GrossWeight", title: "Gross Weight", width: "60px" },
                    { field: "VolumeWeight", title: "Volume(CBM)", width: "60px" },
                    { field: "Status", title: (IsOffload ? "Offload Stage" : "Status") + "/Flight Status", width: 80 },
                    { template: "<span class='#=getSpaceInfoClass(SpaceInfo)#'>#=SpaceInfo#</span>", title: "Space Info", width: "40px" },
                    { field: "Remarks", title: "Remarks", width: 90 },
                ]
            };
        }


        $(document).on('change', '.radioCls', function (e, i) {


            var checked = $(this).is(':checked');
            if ($scope.IsReplan) {
                this.checked = !checked;
                return false;
            }

            var IsOffload = $(this).closest('div[isoffload="true"]').getKendoGrid() ? true : false;

            if ($scope.IsOffload != IsOffload) {
                if ($scope.exitsPlanGrid)
                    $scope.ResetPlan();
                $scope.IsOffload = IsOffload;

            }



            $scope.exitsPlanGrid = $(this).closest('div[isoffload="true"]').getKendoGrid() || $(this).closest('div[isoffload="false"]').getKendoGrid();

            var grid = $scope.exitsPlanGrid;
            var dataItem = grid.dataItem($(this).closest('tr'));
            var dataItems = grid.dataItems();
            if (IsOffload) {
                $scope.replanAWBSelectDetails.AirportSNo
            }

            ///Remove origin if destination selected befor origin sector
            if (this.id == 'Is_Destination' + dataItem.uid) {
                var clearOrigin = false;
                $.map(dataItems, function (i) {
                    if (dataItem.DailyFlightSNo == i.DailyFlightSNo) {
                        clearOrigin = true;
                    } else if (i.Is_Origin && clearOrigin)
                        removeOriginDest(dataItems, 'Is_Origin');

                });
            }

            ///Remove Destination if destination selected befor origin sector
            if (this.id == 'Is_Origin' + dataItem.uid) {
                var clearDest = false;
                $.map(dataItems, function (i) {
                    if (dataItem.DailyFlightSNo == i.DailyFlightSNo && clearDest) {
                        removeOriginDest(dataItems, 'Is_Destination');
                    } else if (i.Is_Destination)
                        clearDest = true;


                });
            }



            if (dataItems.length == 1 || IsOffload) {
                removeOriginDest(dataItems, 'Is_Destination');
                removeOriginDest(dataItems, 'Is_Origin');
                dataItem.set('Is_Origin', checked);
                dataItem.set('Is_Destination', checked);
                $scope.btnReplanHide = false;
                // $('#btnReplanFlight').css('display', '');
            } else {
                if (this.id == 'Is_Origin' + dataItem.uid) {
                    dataItem.set('Is_Origin', checked);
                    var selected = Getselected(dataItems, 'Is_Destination');
                    if (selected != undefined && selected.Off == dataItem.Board)
                        checked = false;
                    else
                        removeOriginDest(dataItems, 'Is_Origin');
                    dataItem.set('Is_Origin', checked);
                }
                if (this.id == 'Is_Destination' + dataItem.uid) {
                    dataItem.set('Is_Destination', checked);
                    var selected = Getselected(dataItems, 'Is_Origin');
                    if (selected != undefined && selected.Board == dataItem.Off)
                        checked = false;
                    else
                        removeOriginDest(dataItems, 'Is_Destination');
                    dataItem.set('Is_Destination', checked);
                }

                if (Getselected(dataItems, 'Is_Origin') != "" && Getselected(dataItems, 'Is_Destination') != "")
                    $scope.btnReplanHide = false;

            }
            $scope.btnResetHide = false;
            try {
                $scope.$apply();
            } catch (e) { }

            //if (RightsCheck == "READ") {

            //    $(".btn-success").hide();
            //}
        });

        $scope.IsReplan = false;
        $scope.ResetPlan = function () {
            $scope.IsReplan = false;
            var grid = $scope.exitsPlanGrid;
            $.map(grid.dataItems(), function (data) {
                if (data.Is_Origin)
                    data.set('Is_Origin', false);
                if (data.Is_Destination)
                    data.set('Is_Destination', false);
            });
            $scope.btnResetHide = true;
            $scope.btnReplanHide = true;
            $scope.ReplanFlightDivHide = true;
            $scope.divSearchPlanHide = true;
            $scope.HideCurrentPlanGrid = true;
            ResetSearchReplanRequest($scope.CurrentPlan);
            $scope.CurrentPlanGridOptions.dataSource.data([]);
        }

        $scope.IsInterline = { Key: '0' };
        $scope.CarrierCodeChange = function () {
            var isin = $scope.IsInterline;
            debugger
        }
        $scope.ReplanFlight = function () {
            $scope.IsInterline = null;
            var grid = $scope.exitsPlanGrid;
            $scope.RouteSNo = 1;

            $scope.maxDate = new Date(new Date().getUTCFullYear() + 1, 0, new Date().getMonth());
            var IsOriginSelected = false;
            var IsDestSelected = false;
            var bothSelected = false;
            $scope.ExistPlanList = [];
            var PrevVal = "";
            var PrevOrigin = "";
            var selected = {};
            var isFirst = true;
            var selectedDest = "";
            var dataitems = grid.dataItems();
            $.each(dataitems, function (key, data) {
                if (bothSelected) {
                    //$scope.maxDate = new Date(Date.parse(data.FlightDate + ' ' + data.ETD));
                    IsOriginSelected = false;
                    bothSelected = false;
                    return false;
                }

                if (PrevOrigin != "" && PrevOrigin != data.Board)
                    isFirst = false;

                PrevOrigin = data.Board;

                var IsSet = false;
                if (data.Is_Origin) {
                    IsOriginSelected = IsSet = true;
                    $scope.CurrentPlan.Origin = data.Board;
                    $scope.CurrentPlan.OriginModel = { Key: data.OriginSNo, Text: data.Board, TemplateColumn: data.Board };
                    $scope.CurrentPlan.OriginSNo = data.OriginSNo;
                    if (!isFirst)
                        $scope.minDate = new Date(Date.parse(data.FlightDate + ' ' + data.ETD));
                    else
                        $scope.minDate = new Date();
                }

                if (data.Is_Destination) {
                    IsDestSelected = IsSet = true;
                    $scope.CurrentPlan.Destination = selectedDest = data.Off;
                    $scope.CurrentPlan.DestinationModel = { Key: data.DestinationSNo, Text: data.Off, TemplateColumn: data.Off };
                    $scope.CurrentPlan.DestinationSNo = data.DestinationSNo;
                }

                if (IsDestSelected && IsOriginSelected)
                    bothSelected = true;
                if (IsDestSelected || IsOriginSelected) {
                    if (selected[data.Board] == undefined)
                        selected[data.Board] = { Pieces: 0, Gross: 0, Volume: 0 };
                    selected[data.Board].Pieces += parseFloat(data.Pieces);
                    selected[data.Board].Gross += parseFloat(data.GrossWeight);
                    selected[data.Board].Volume += parseFloat(data.VolumeWeight);
                }

                PrevVal = data.Board;


            });

            var isReplan = 1;
            $.map(dataitems, function (i) {
                if (i.Is_Origin)
                    isReplan = 0;
                i.IsReplan = isReplan;
                if (i.Is_Destination)
                    isReplan = 1;

            });

            //grid.table.find('tr').each(function (i) {
            //    var model = grid.dataItem(this);
            //    if (model.IsReplan == 1)
            //        $(this).addClass('warning')

            //});

            var oldPieces = 0;
            for (var i in selected) {
                if (oldPieces != 0 && oldPieces != selected[i].Pieces) {
                    ShowMessage('warning', 'Information!', "Origin and destination pieces must be equal.")
                    return false;
                    break;
                }
                oldPieces = selected[i].Pieces;
            }

            $scope.CurrentPlan.Pieces = selected[$scope.CurrentPlan.Origin].Pieces;
            $scope.CurrentPlan.GrossWeight = selected[$scope.CurrentPlan.Origin].Gross.toFixed(2);
            $scope.CurrentPlan.CBM = selected[$scope.CurrentPlan.Origin].Volume.toFixed(3);


            $scope.IsReplan = true;
            ResetSearchReplanRequest($scope.CurrentPlan);
            $scope.ReplanFlightDivHide = false;
            $scope.replancomboOrigin.enable(false);
            $scope.replancomboDest.enable(true);
            $scope.btnSearchDisable = false;
            $scope.CurrentPlanGridOptions.dataSource.data([]);
            $scope.HideCurrentPlanGrid = true;
            $scope.divSearchPlanHide = true;
            adviceds.filter($filter1);
            setMaxDateAndETA();
            //if ($scope.CurrentPlan.Sector.match($scope.CurrentPlan.Origin) && $scope.CurrentPlan.Sector.match($scope.CurrentPlan.Destination)) {
            //    ETA = "00:00";
            //    $scope.minDate = new Date();
            //    $scope.maxDate = new Date(2019, 0, 1, 0, 0, 0);
            //    /// applyChanges();
            //}

            $scope.IsMCTBCTShow = (userContext.GroupName.toUpperCase() != 'AGENT'); ///BCT MCT Hide if user is Agent




        }

        var setMaxDateAndETA = function () {
            var grid = $scope.exitsPlanGrid;
            var dt = grid.dataItems().toJSON();
            $scope.MCTMin = 0;
            ETA = "00:00";
            var originSelect = false;
            var destSelect = false;
            var currentDate = new Date();
            $scope.InterlineCarrierCodes = [];

            for (var i in dt) {


                if ($scope.CurrentPlan.Origin == dt[i].Off) {
                    ETA = dt[i].ETA.slice(0, 5);


                    var mindate = kendo.parseDate(dt[i].FlightDate, 'dd-MMM-yyyy');
                    if (currentDate.setHours(0, 0, 0, 0) <= mindate) {
                        $scope.minDate = mindate;
                        $scope.SearchReplanRequest.IsMCT = 1;
                    }
                    else {
                        $scope.minDate = currentDate;
                        $scope.SearchReplanRequest.IsMCT = 0;
                    }
                    $scope.SearchReplanRequest.ItineraryDate = kendo.toString($scope.minDate, 'dd-MMM-yyyy');
                }

                if ($scope.CurrentPlan.Destination == dt[i].Board) {
                    $scope.maxDate = new Date(Date.parse(dt[i].FlightDate + ' ' + dt[i].ETD));
                    $scope.MCTMin = parseInt(dt[i].ConTime || 0);
                    $scope.maxDate.setMinutes($scope.maxDate.getMinutes() - $scope.MCTMin);
                    if ($scope.maxDate < $scope.minDate.setHours(0, 0, 0, 0)) {
                        $scope.minDate = $scope.maxDate;
                        $scope.SearchReplanRequest.ItineraryDate = kendo.toString($scope.maxDate, 'dd-MMM-yyyy');
                    }
                }

                if ($scope.AWBInfo.Sector.split('-')[0] == dt[i].Board) {
                    $scope.InterlineCarrierCodes[dt[i].FlightNo.split('-')[0]] = dt[i].IsInterline;
                }

            }
            $scope.SearchReplanRequest.ETD = ETA;

        }

        var ETA = "00:00";

        $scope.SearchFlightPlan = function () {
            $scope.IsManualRoute = true;
            $scope.btnSubmitHide = true;
            //if ($scope.CurrentPlanGridOptions.dataSource._data.length== 0) {

            //    $scope.HideCurrentPlanGrid = true;
            //    ResetSearchReplanRequest($scope.CurrentPlan);
            //}
            //if (!IsRateAvailable()) {
            //    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
            //    return false;
            //}
            //if (!IsInternationalBookingAgent()) {
            //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
            //    return false;
            //}
            if (!($scope.SearchReplanRequest.Origin != "" && $scope.SearchReplanRequest.Destination != "" && $scope.SearchReplanRequest.ItineraryDate != '')) {
                ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Flight Date to fetch flights.");
                return false;
            }

            if (kendo.parseFloat($scope.SearchReplanRequest.ItineraryPieces) > 0 && kendo.parseFloat($scope.SearchReplanRequest.ItineraryGrossWeight) > 0 && kendo.parseFloat($scope.SearchReplanRequest.ItineraryVolumeWeight) > 0) {
                if ($scope.IsInterline == null || $scope.IsInterline.Key == "0") {
                    $scope.SearchPlanGridOptions.dataSource.read();
                    $scope.divSearchPlanHide = false;
                } else
                    setInterlineFlight();
            }
            else
                ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) to fetch flights.");

        }


        var IsRateAvailable = function () {
            if ($scope.CurrentPlan.ProductName == "COMAT")
                return true;
            else {
                $.ajax({
                    url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/RateAvailableOrNot",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        BookingType: $scope.CurrentPlan.BookingType,
                        AWBStock: $scope.CurrentPlan.AWBStockSNo,
                        AWBPrefix: $scope.CurrentPlan.AWBPrefix,
                        PaymentType: $scope.CurrentPlan.PaymentType,
                        IsBUP: $scope.CurrentPlan.IsBUP,
                        BupPieces: $scope.CurrentPlan.BupPieces,
                        ProductSNo: $scope.CurrentPlan.ProductSNo,
                        OriginCity: $scope.CurrentPlan.Origin,
                        DestinationCity: $scope.CurrentPlan.Destination,
                        AccountSNo: $scope.CurrentPlan.AccountSNo,
                        AWBPieces: $scope.CurrentPlan.Pieces,
                        GrossWeight: $scope.CurrentPlan.GrossWeight,
                        VolumeWeight: $scope.CurrentPlan.Volume,
                        ChargeableWeight: $scope.CurrentPlan.ChargeableWeight,
                        Volume: $scope.CurrentPlan.CBM,
                        UM: $scope.CurrentPlan.UM,
                        CommoditySNo: $scope.CurrentPlan.CommoditySNo,
                        NOG: $scope.CurrentPlan.NOG,
                        SPHC: $scope.CurrentPlan.SPHCSNO,
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        if (result.substring(1, 0) == "{") {
                            var myData = jQuery.parseJSON(result);
                            if (myData.Table0.length > 0) {
                                if (myData.Table0[0].FinalRate != "") {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                    }
                });
            }
        }

        var IsInternationalBookingAgent = function () {
            var Result = true;
            $.ajax({
                url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/IsInternationalBookingAgent",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    ItineraryOrigin: $scope.SearchReplanRequest.OriginModel.Key,
                    ItineraryDestination: $scope.SearchReplanRequest.DestinationModel.Key,
                    OriginCitySNo: $scope.CurrentPlan.OriginSNo,
                    DestinationCitySNo: $scope.CurrentPlan.DestinationSNo,
                    AccountSNo: $scope.SearchReplanRequest.AgentSNo
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            if (myData.Table0[0].Result == "1") {
                                Result = true;
                            }
                            else {
                                Result = false;
                            }
                        }
                    }
                },
                error: function (xhr) {
                    var a = "";
                }
            });
            return Result;

        }

        $scope.ViewRouteList = [];
        $scope.ViewRoute = function () {
            $.ajax({
                url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/ViewRoute?ItineraryOrigin=" + DefaultRoute("OriginSNo") + '&ItineraryDestination=' + DefaultRoute("DestinationSNo") + '&AWBPrefix=' + $scope.SearchReplanRequest.AWBPrefix, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    var ViewRouteData = jQuery.parseJSON(result);
                    var ViewRouteDetailData = ViewRouteData.Table0;
                    if (ViewRouteDetailData.length > 0) {
                        $scope.ViewRouteList = ViewRouteDetailData;
                        $scope.win1.center();
                        $scope.win1.open();
                    }
                }
            });
        }




        /// Select auto route
        $scope.SelectedRoute = function (item) {
            $scope.replancomboOrigin.enable(false);
            $scope.replancomboDest.enable(false);
            $scope.IsManualRoute = false;
            $scope.btnSubmitHide = true;
            $scope.Routes = [];

            //Reset previouse selection

            $scope.CurrentPlanGridOptions.dataSource.data([]);




            var routes = item.split('-');

            // Set auto routes
            for (var i = 0; i < routes.length - 1; i++) {
                if (i != routes.length - 1)
                    $scope.Routes.push({ Origin: routes[i], Dest: routes[i + 1], IsSelect: false });
            }

            if ($scope.Routes.length > 0) {
                if ($scope.SearchReplanRequest.ETD != "00:00")
                    ResetSearchReplanRequest($scope.CurrentPlan);
                $scope.CurrentPlanGridOptions.dataSource.data([]);

                setOriginDest($scope.Routes[0].Origin, $scope.Routes[0].Dest); /// Set origin and destination in request

                $scope.SearchPlanGridOptions.dataSource.read();
                $scope.win1.close();
                $scope.divSearchPlanHide = false;
                $scope.HideCurrentPlanGrid = true;
            }

        }

        /// Set origin and destination for auto search
        function setOriginDest(origin, dest) {
            var AirportInfoOri = getCodeNKey(origin);

            if (AirportInfoOri.length != undefined && AirportInfoOri.length > 0) {
                $scope.SearchReplanRequest.Origin = origin;
                $scope.SearchReplanRequest.OriginModel.Text = AirportInfoOri[0].Text;
                $scope.SearchReplanRequest.OriginModel.Key = AirportInfoOri[0].Key;
            } else
                $scope.SearchReplanRequest.Origin = origin;

            var AirportInfoDest = getCodeNKey(dest);

            if (AirportInfoDest.length != undefined && AirportInfoDest.length > 0) {
                $scope.SearchReplanRequest.Destination = dest;
                $scope.SearchReplanRequest.DestinationModel.Text = AirportInfoDest[0].Text;
                $scope.SearchReplanRequest.DestinationModel.Key = AirportInfoDest[0].Key;
            } else
                $scope.SearchReplanRequest.Destination = dest;

        }

        $scope.searchtimeOut = 0;



        $scope.CheckWeightNVol = function (isVol) {
            var TotalGross = parseFloat($scope.CurrentPlan.GrossWeight);
            var TotalCBM = parseFloat($scope.CurrentPlan.CBM);
            var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
            if (currentPlanData.length > 0) {
                var dataGroupBy = GroupBy(currentPlanData);
                if (dataGroupBy[$scope.SearchReplanRequest.Origin] != undefined) {
                    var selectedPieces = dataGroupBy[$scope.SearchReplanRequest.Origin];
                    if (TotalGross > selectedPieces.Gross)
                        TotalGross = TotalGross - selectedPieces.Gross;
                    else if (TotalGross == selectedPieces.Gross)
                        TotalGross = TotalGross - selectedPieces.Gross;

                    if (TotalCBM > selectedPieces.Volume)
                        TotalCBM = TotalCBM - selectedPieces.Volume;
                    else if (TotalCBM == selectedPieces.Volume)
                        TotalCBM = TotalCBM - selectedPieces.Volume;
                }

            }

            var itineraryGross = parseFloat($scope.SearchReplanRequest.ItineraryGrossWeight);
            var itineraryCBM = parseFloat($scope.SearchReplanRequest.ItineraryVolumeWeight);
            if (itineraryGross > 0) {
                if (itineraryGross > TotalGross)
                    itineraryGross = $scope.SearchReplanRequest.ItineraryGrossWeight = TotalGross;
            }
            else
                itineraryGross = 0;

            if (itineraryCBM > 0) {
                if (itineraryCBM > TotalCBM)
                    itineraryCBM = $scope.SearchReplanRequest.ItineraryVolumeWeight = TotalCBM;
            } else
                itineraryCBM = 0;
            $scope.SearchReplanRequest.ItineraryGrossWeight = itineraryGross;
            $scope.SearchReplanRequest.ItineraryVolumeWeight = itineraryCBM;


        }

        $scope.CalculatePieces = function () {
            var TotalPieces = parseFloat($scope.CurrentPlan.Pieces);
            var TotalGross = parseFloat($scope.CurrentPlan.GrossWeight);
            var TotalCBM = parseFloat($scope.CurrentPlan.CBM);

            var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
            if (currentPlanData.length > 0) {
                var filterdata = filterData(currentPlanData, 'RouteSNo', $scope.RouteSNo)
                if (filterdata.length > 0) {
                    var mxData = filterData(filterdata, 'SubRouteSNo', 0);
                    TotalPieces = parseFloat(mxData[0].Pieces);
                    TotalGross = parseFloat(mxData[0].GrossWeight);
                    TotalCBM = parseFloat(mxData[0].CBM);

                    var dataGroupBy = GroupBy(filterdata, 'SubRouteSNo');
                    if (dataGroupBy[$scope.SubRouteSNo] != undefined) {
                        var selectedPieces = dataGroupBy[$scope.SubRouteSNo];
                        if (TotalPieces > selectedPieces.Pieces) {
                            TotalPieces = TotalPieces - selectedPieces.Pieces;
                            TotalGross = TotalGross - parseFloat(selectedPieces.Gross).toFixed(2);
                            TotalCBM = TotalCBM - parseFloat(selectedPieces.Volume).toFixed(3);
                        }
                    } else if (!$scope.IsManualRoute && itineraryPieces > 0) {
                        clearTimeout($scope.searchtimeOut);
                        $scope.searchtimeOut = setTimeout(function () { $scope.SearchPlanGridOptions.dataSource.read(); }, 500);
                    }
                } else {
                    var dataOut = GrouupByRoute(currentPlanData, 'RouteSNo')
                    var pieces = 0, gross = 0, CBM = 0;
                    for (var i in dataOut) {
                        pieces += dataOut[i].Pieces;
                        gross += dataOut[i].Gross;
                        CBM += dataOut[i].Volume;
                    }
                    TotalPieces = TotalPieces - pieces; TotalGross = TotalGross - gross; TotalCBM = TotalCBM - CBM;
                }
            }
            var itineraryPieces = parseFloat($scope.SearchReplanRequest.ItineraryPieces);
            if (itineraryPieces > 0) {
                if (itineraryPieces > TotalPieces)
                    itineraryPieces = $scope.SearchReplanRequest.ItineraryPieces = TotalPieces;
            }
            else
                itineraryPieces = 0;

            $scope.SearchReplanRequest.ItineraryPieces = itineraryPieces;
            $scope.SearchReplanRequest.ItineraryGrossWeight = (itineraryPieces * TotalGross / TotalPieces).toFixed(2);
            $scope.SearchReplanRequest.ItineraryVolumeWeight = (itineraryPieces * TotalCBM / TotalPieces).toFixed(3);
        }

        function getDayDiff(date1, date2) {
            //var date1 = new Date("7/11/2010");
            //var date2 = new Date("8/11/2010");
            return parseInt((date2 - date1) / (1000 * 60 * 60 * 24));
        }

        var isAgentHide = false;
        if (userContext.SysSetting.ICMSEnvironment == 'JT')
            isAgentHide = (userContext.GroupName.toUpperCase() == 'AGENT');
        //added by tks
        //$scope.BindCarrierCode = function() {
        //    if ($scope.IsInterline) {
        //        $scope.SearchReplanRequest.ItineraryCarrierCode = $scope.IsInterline.Text;
        //    }
        //    else {
        //        $scope.SearchReplanRequest.ItineraryCarrierCode = "";
        //    }
        //}
        //ends
        $scope.SearchPlanGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                type: "json",
                transport: {
                    read: {
                        url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/SearchFlightResult",
                        dataType: "json",
                        type: "GET",
                        global: false,
                        data: function () {
                            if ($scope.SearchReplanRequest.ETD != ETA) {
                                $scope.SearchReplanRequest.ETD = ETA;
                                if (!$scope.ItineraryDateChange)
                                    $scope.SearchReplanRequest.ItineraryDate = kendo.toString(new Date(), 'dd-MMM-yyyy');
                            }

                            var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
                            if (currentPlanData.length > 0) {

                                var subrouteSNo = 0;
                                if ($scope.SubRouteSNo > 0)
                                    subrouteSNo = $scope.SubRouteSNo;
                                //subrouteSNo = ($scope.SubRouteSNo - 1); // Temperarory disabled


                                var filterdata = filterData(currentPlanData, 'RouteSNo', $scope.RouteSNo);
                                var subfilterdata = filterData(filterdata, 'SubRouteSNo', subrouteSNo);
                                if (subfilterdata.length > 0) {
                                    if (subfilterdata[0].IsInterlineCheck) {
                                        $scope.SearchReplanRequest.ItineraryDate = subfilterdata[0].FlightDate;
                                        $scope.SearchReplanRequest.IsMCT = 0;
                                        $scope.SearchReplanRequest.ETD = "00:00";
                                    } else {
                                        if ($scope.ItineraryDateChange) {
                                            var IterDate = new Date($scope.SearchReplanRequest.ItineraryDate);
                                            var ArrDate = new Date(subfilterdata[0].ArrFlightDate);
                                            if (IterDate.setHours(0, 0, 0, 0) > ArrDate.setHours(0, 0, 0, 0)) {
                                                $scope.SearchReplanRequest.ETD = "00:00";
                                            } else {
                                                $scope.SearchReplanRequest.ItineraryDate = subfilterdata[0].ArrFlightDate;
                                                $scope.SearchReplanRequest.ETD = subfilterdata[0].ETA.slice(0, 5);
                                            }

                                        } else {
                                            $scope.SearchReplanRequest.ItineraryDate = subfilterdata[0].ArrFlightDate;
                                            $scope.SearchReplanRequest.ETD = subfilterdata[0].ETA.slice(0, 5);
                                        }
                                        $scope.SearchReplanRequest.IsMCT = 1;
                                    }

                                } else {
                                    $scope.SearchReplanRequest.ETD = ETA;
                                    if (!$scope.ItineraryDateChange)
                                        $scope.SearchReplanRequest.ItineraryDate = kendo.toString(new Date($scope.minDate), 'dd-MMM-yyyy');
                                    $scope.SearchReplanRequest.IsMCT = 0;
                                }
                            }
                            $scope.ItineraryDateChange = false;
                            //if ($scope.IsInterline) {
                            //    $scope.SearchReplanRequest.ItineraryCarrierCode = $scope.IsInterline.Text;
                            //}
                            //else {
                            //    $scope.SearchReplanRequest.ItineraryCarrierCode = "";
                            //}
                            //else if ($scope.SearchReplanRequest.ETD != "00:00" && ($scope.SelectedRoutes == undefined || $scope.SelectedRoutes.length == 0)) {
                            //    ResetSearchReplanRequest($scope.CurrentPlan);
                            //}
                            $scope.SearchReplanRequest.ItineraryCarrierCode = $("#ItineraryCarrierCode").val();
                            $scope.SearchReplanRequest.ItineraryFlightNo = $("#ItineraryFlightNo").val();
                            return $scope.SearchReplanRequest;
                        }
                    },
                },
                schema: {
                    model: { id: "FlightNo", fields: { FlightNo: { type: "string" } } },
                    data: function (data) {
                        var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
                        var exgrid = $scope.exitsPlanGrid;

                        var result = JSON.parse(data).Table0;
                        if (data.indexOf('ErrorMassage') >= 0)
                            var result = [];

                        var maxDateWithMCT = angular.copy($scope.maxDate);
                        if ($scope.SearchReplanRequest.OverrideMCT == "1")
                            maxDateWithMCT.setMinutes(maxDateWithMCT.getMinutes() + $scope.MCTMin);

                        var filterResult = [];

                        for (var i = 0; i < result.length; i++) {
                            var flDate = new Date(Date.parse(result[i].FlightDate + ' ' + result[i].ETA));
                            if ($scope.maxDate <= flDate) {
                                if ($scope.maxDate != maxDateWithMCT) {
                                    result[i].OverrideMCT = 'YES';
                                    if (maxDateWithMCT <= flDate)
                                        break;
                                } else
                                    break;
                            }

                            var isAdd = true;

                            ////$scope.InterlineCarrierCodes[result[i].FlightNo.split('-')[0]] != undefined
                            //if (userContext.SysSetting.ICMSEnvironment == 'JT' && $scope.AWBInfo.Sector.split('-')[0] == $scope.SearchReplanRequest.Origin) {

                            //    var IsInterline = Getselected(exgrid.dataItems(), 'Is_Origin').IsInterline || "";
                            //    if ($scope.AWBInfo.CarrierCode != userContext.SysSetting.ICMSEnvironment && result[i].FlightNo.split('-')[0].toUpperCase() != $scope.CurrentPlan.CarrierCodes.split(',')[0].toUpperCase()) {
                            //        isAdd = false;
                            //    }

                            //    if ($scope.AWBInfo.CarrierCode == userContext.SysSetting.ICMSEnvironment && result[i].FlightNo.split('-')[0].toUpperCase() == $scope.AWBInfo.CarrierCode || IsInterline == "True") {
                            //        isAdd = true;
                            //    }


                            //}

                            //for (var j = 0; j < currentPlanData.length; j++) {

                            //    if (currentPlanData[j].FlightNo == result[i].FlightNo && currentPlanData[j].FlightDate == result[i].FlightDate && currentPlanData[j].Origin == result[i].Origin && currentPlanData[j].Destination == result[i].Destination) {
                            //        isAdd = false;
                            //        break;
                            //    }
                            //}
                            if (isAdd)
                                filterResult.push(result[i]);
                            isAdd = true;
                        }

                        if (filterResult.length == 0) {
                            if (getDayDiff(new Date(), $scope.maxDate) < 30) {
                                ShowMessage('warning', 'Information!', "No flights found on '" + $scope.SearchReplanRequest.Origin + "-" + $scope.SearchReplanRequest.Destination + "' sector to connect " + $scope.SearchReplanRequest.Destination + " at '" + ("0" + $scope.maxDate.getHours()).slice(-2) + "" + ("0" + $scope.maxDate.getMinutes()).slice(-2) + "Hrs'");
                            }

                        }

                        return filterResult;
                    }
                }
            }),
            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);
                var grid = this;
                if (grid.dataSource._data.length > 0)
                    $(".allotmentdd").each(function () {
                        var dropdown = $(this);
                        var tr = dropdown.closest('tr');
                        var model = grid.dataItem(tr);
                        dropdown.kendoDropDownList({
                            optionLabel: "Select ",
                            dataTextField: "AllotmentCode",
                            dataValueField: "AllotmentSNo",
                            autoBind: false,
                            change: function (ev) {
                                if (this.value() == "") {
                                    model.AllotmentSNo = 0;
                                    model.AllotmentCode = '';
                                } else {
                                    model.AllotmentSNo = this.value();
                                    model.AllotmentCode = this.text();
                                }
                            },
                            dataSource: new kendo.data.DataSource({
                                type: "json",
                                transport: {
                                    read: {
                                        url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/BindAllotmentArray",
                                        dataType: "json",
                                        type: "GET",
                                        global: false,
                                        data: {
                                            DailyFlightSNo: model.DailyflightSNo || model.DailyFlightSNo,
                                            AccountSNo: $scope.CurrentPlan.AccountSNo,
                                            ShipperSNo: 0,
                                            GrossWt: $scope.SearchReplanRequest.ItineraryGrossWeight,
                                            Volume: $scope.SearchReplanRequest.ItineraryVolumeWeight,
                                            ProductSNo: $scope.CurrentPlan.ProductSNo,
                                            CommoditySNo: $scope.CurrentPlan.CommoditySNo,
                                            SHC: $scope.CurrentPlan.SPHCSNO
                                        }

                                    }
                                },
                                schema: {
                                    data: function (data) {
                                        return JSON.parse(data).Table0;
                                    }
                                }
                            })

                        });


                    });
            },
            scrollable: true,
            columns: [{ field: 'FlightNo', title: 'Flight No', width: 30 },
            { field: 'FlightDate', title: 'Flight Date', width: 40 },
            { template: '#=Origin#/#=Destination#', title: 'Origin/Dest', width: 30 },
            { field: 'FlightRoute', title: 'Flight Route', width: 40 },
            { template: '#=ETD.slice(0,5)#/#=ETA.slice(0,5)#', title: 'ETD/ETA', width: 35 },
            { template: '#=AircraftType.toUpperCase()#', title: 'Aircraft Type', width: 35 },
            { template: '#=GrossWeight#', title: 'Flight Capacity Gr.Wt.', width: 50, hidden: isAgentHide },
            { template: '#=Volume#', title: 'Flight Capacity Vol', width: 50, hidden: isAgentHide },
            { template: '#=FreeSaleGrossAvailUsed#', title: 'Free Space Gr. Wt.', width: 50 },
            { template: '#=FreeSaleVolumeAvailUsed#', title: 'Free Space Vol', width: 50 },
            { template: '#=AllocatedGrossAvailUsed#', title: 'Allocated Gr. Wt.', width: 50, hidden: isAgentHide },
            { template: '#=AllocatedVolumeAvailUsed#', title: 'Allocated Vol', width: 50, hidden: isAgentHide },
            { template: '#=MaxGrossPerPcs#', title: 'Max Gross Per Pcs', width: 45, hidden: isAgentHide },
            { template: '#=MaxVolumePerPcs#', title: 'Max Vol Per Pcs', width: 40, hidden: isAgentHide },
            { template: '<input class="allotmentdd" data-bind="value:Origin" />', title: 'Allotment Code', width: 40 },
            { template: '#=OverFlightCapacity=="0"?\'<input type="button" class="btn-success" ng-click="SelectFlight(dataItem)" value="Select">\':""#', title: "Action", width: 30 }

            ]
        }

        /// Select flight from search result grid
        $scope.SelectFlight = function (dataItem) {


            $scope.SearchReplanRequest.DailFlightSNo = dataItem.DailyflightSNo;
            var ItineraryGrossWeight = parseFloat($scope.SearchReplanRequest.ItineraryGrossWeight);
            var ItineraryVolumeWeight = parseFloat($scope.SearchReplanRequest.ItineraryVolumeWeight);
            var ItineraryPieces = parseFloat($scope.SearchReplanRequest.ItineraryPieces);
            var MaxGrossPerPcs = parseFloat(dataItem.MaxGrossPerPcs);
            var MaxVolumePerPcs = parseFloat(dataItem.MaxVolumePerPcs);
            var FlightCapacityGrWt = parseFloat(dataItem.GrossWeight);
            var FlightCapacityVol = parseFloat(dataItem.Volume);
            var TotalMaxGrossPerPcs = parseFloat(dataItem.MaxGrossPerPcs) * ItineraryPieces;
            var TotalMaxVolumePerPcs = parseFloat(dataItem.MaxVolumePerPcs) * ItineraryPieces;
            if (ItineraryGrossWeight > FlightCapacityGrWt) {
                ShowMessage('warning', 'Information!', "Itinerary Gross Weight can not be greater than Flight Capacity Gr. Wt .");
                return false;
            }
            if (ItineraryVolumeWeight > FlightCapacityVol) {
                ShowMessage('warning', 'Information!', "Itinerary Volume can not be greater than Flight Capacity Volume .");
                return false;
            }
            if ((ItineraryGrossWeight > TotalMaxGrossPerPcs) && MaxGrossPerPcs != 0) {
                ShowMessage('warning', 'Information!', "Single Piece Gross Weight limit exceeds on chosen flight. Cannot proceed.");
                return false;
            }
            if (($scope.SearchReplanRequest.ItineraryVolumeWeight > TotalMaxVolumePerPcs) && MaxVolumePerPcs != 0) {
                ShowMessage('warning', 'Information!', "Volume Per Piece check applicable on Flight.");
                return false;
            }
            if (ItineraryPieces <= 0 && ItineraryGrossWeight <= 0 && ItineraryVolumeWeight <= 0) {
                ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) to fetch flights.");
                return false;
            }

            $.ajax({
                url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/BindAllotmentArray",
                //async: false,
                type: "GET",
                dataType: "json",
                data: {
                    DailyFlightSNo: dataItem.DailyflightSNo || dataItem.DailyFlightSNo,
                    AccountSNo: $scope.CurrentPlan.AccountSNo,
                    ShipperSNo: 0,
                    GrossWt: $scope.SearchReplanRequest.ItineraryGrossWeight,
                    Volume: $scope.SearchReplanRequest.ItineraryVolumeWeight,
                    ProductSNo: $scope.CurrentPlan.ProductSNo,
                    CommoditySNo: $scope.CurrentPlan.CommoditySNo,
                    SHC: $scope.CurrentPlan.SPHCSNO
                },
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (JSON.parse(result).Table0.length > 0 && JSON.parse(result).Table0[0].IsMandatory.toUpperCase()=="TRUE" && !dataItem.AllotmentSNo)
                        ShowMessage('warning', 'Information!', "Please select allotment code.");
                    else
                        checkEmbargoAll(dataItem);
                    //checkEmbargo(dataItem);                    
                }
            });





        }

        var checkEmbargoAll = function (dataItem) {

            var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data().toJSON();
            $.map(currentPlanData, function (item) {
                item.OriginAirportSNo = item.OriginSNo;
                item.DestinationAirportSNo = item.DestinationSNo;
            });
            currentPlanData.push({
                OriginAirportSNo: dataItem.OriginSNo,
                DestinationAirportSNo: dataItem.DestinationSNo,
                Pieces: $scope.SearchReplanRequest.ItineraryPieces,
                GrossWeight: $scope.SearchReplanRequest.ItineraryGrossWeight,
                VolumeWeight: $scope.SearchReplanRequest.ItineraryVolumeWeight,
                DailyFlightSNo: dataItem.DailyflightSNo,
                FlightNo: dataItem.FlightNo,
                FlightDate: dataItem.FlightDate
            });
            var pSNo = 0;
            var bSNo = 0;
            var AWBSNo = 0;
            if ($scope.replanAWBSelectDetails.BookedFrom == "PO Mail") {
                pSNo = $scope.CurrentPlan.AWBRefBookingSNo;
            } else {
                bSNo = $scope.CurrentPlan.AWBRefBookingSNo || 0;
                AWBSNo = $scope.CurrentPlan.AWBSNo || 0;
            }


            $.ajax({
                url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/CheckEmbargoAll",
                //async: false,
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    AWBSNo: AWBSNo, POMailSNo: pSNo, BookingSNo: bSNo, BookingRefNo: ($scope.CurrentPlan.ReferenceNumber || 0),
                    ReservationInformation:
                        {
                            ReservationBookingSNo: $scope.CurrentPlan.AWBRefBookingSNo,
                            ReservationBookingRefNo: $scope.CurrentPlan.ReferenceNumber,
                            BookingType: $scope.CurrentPlan.BookingType,
                            AWBStock: $scope.CurrentPlan.AWBStockSNo,
                            AWBPrefix: $scope.CurrentPlan.AWBPrefix,
                            AWBNo: $scope.CurrentPlan.AWBNo.split('-')[1],
                            PaymentType: $scope.CurrentPlan.PaymentType,
                            IsBUP: $scope.CurrentPlan.IsBUP,
                            BupPieces: $scope.CurrentPlan.BupPieces,
                            ProductSNo: $scope.CurrentPlan.ProductSNo,
                            OriginCitySNo: $scope.CurrentPlan.OriginCitySNo,
                            DestinationCitySNo: $scope.CurrentPlan.DestinationCitySNo,
                            AccountSNo: $scope.CurrentPlan.AccountSNo,
                            AWBPieces: $scope.CurrentPlan.Pieces,
                            GrossWeight: $scope.CurrentPlan.GrossWeight,
                            VolumeWeight: $scope.CurrentPlan.Volume,
                            ChargeableWeight: $scope.CurrentPlan.ChargeableWeight,
                            Volume: $scope.CurrentPlan.CBM,
                            Priority: $scope.CurrentPlan.PrioritySNo,
                            UM: $scope.CurrentPlan.UM,
                            CommoditySNo: $scope.CurrentPlan.CommoditySNo,
                            NOG: $scope.CurrentPlan.NOG,
                            SPHC: $scope.CurrentPlan.SPHCSNo,
                            IsRoutingComplete: $scope.IsRouteComplete,
                        },
                    ReservationItineraryInformation: currentPlanData
                }),
                //data: { ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    var EData = jQuery.parseJSON(result);
                    if (EData.Table0 && EData.Table0.length > 0) {
                        if (EData.Table0[EData.Table0.length - 1].IsSoftEmbargo == "False")
                            ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EData.Table0[EData.Table0.length - 1].EmbMessage);
                        else if (EData.Table0[EData.Table0.length - 1].IsSoftEmbargo != "") {
                            if (confirm(EData.Table0[EData.Table0.length - 1].EmbMessage + ' - ' + 'Soft Embargo Applied. Do you wish to continue?'))
                                InsertRoute(dataItem, "1");

                        } else
                            InsertRoute(dataItem, "0");
                    } else
                        InsertRoute(dataItem, "0");


                },
                error: function (xhr) {
                    var a = "";
                }
            });

        }
        /// This disabled now we are keeping this for reference
        var checkEmbargo = function (dataItem) {
            var IsConfirmData = true;
            var SoftEmbargo = "0";

            $.ajax({
                url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                //async: false,
                type: "GET",
                dataType: "json",
                data: $scope.SearchReplanRequest,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            if (myData.Table0[0].IsSoftEmbargo != "") {
                                if (myData.Table0[0].IsSoftEmbargo == "True") {
                                    if (confirm(myData.Table0[0].ValidMessage.split('@')[1] + ' - ' + 'Soft Embargo Applied. Do you wish to continue?')) {
                                        SoftEmbargo = "1";
                                        InsertRoute(dataItem, SoftEmbargo);
                                    }
                                }
                                else {
                                    IsConfirmData = false;
                                    ShowMessage('warning', 'Information!', myData.Table0[0].ValidMessage.split('@')[1] + ' - ' + 'Hard Embargo Applied.');
                                    return;
                                }
                                if (IsConfirmData == false) {
                                    return;
                                }
                            } else {
                                InsertRoute(dataItem, SoftEmbargo);
                            }
                        }
                    }
                },
                error: function (xhr) {
                    var a = "";
                }
            });

        }

        /*   Common functions for route selection   */

        var Getselected = function (data, field) {
            var selected = $.map(data, function (item) {
                if (item[field])
                    return item;
            });
            if (selected.length > 0)
                return selected[0];
            else
                return "";
        }

        var removeOriginDest = function (data, field) {
            $.map(data, function (item) {
                item.set(field, false);
            });
        }

        ///Get route base on true or false for auto route selection
        var filterData = function (data, key, value) {
            return $.map(data, function (i) {
                if (i[key] == value)
                    return i;
            });
        }

        function NextPreRoute(O, D, IsNext) {
            var route = {};
            for (var i = 0; i < $scope.Routes.length; i++) {
                if ($scope.Routes[i].Origin == O && $scope.Routes[i].Dest == D) {
                    if (IsNext && $scope.Routes[i + 1] != undefined)
                        route = $scope.Routes[i + 1];
                    else if (!IsNext && $scope.Routes[i - 1] != undefined)
                        route = $scope.Routes[i - 1];
                    break;
                }
            }
            return route;
        }

        $scope.RouteSNo = 1;
        $scope.SubRouteSNo = 0;
        /* common function end */

        $scope.OnChangeRoute = function () {

            var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
            if (currentPlanData.length > 0) {

            } else
                $scope.CurrentPlan.IsRouteComplete = "0";

            return false;
        }

        var setInterlineFlight = function () {

            var ItineraryGrossWeight = parseFloat($scope.SearchReplanRequest.ItineraryGrossWeight);
            var ItineraryVolumeWeight = parseFloat($scope.SearchReplanRequest.ItineraryVolumeWeight);
            var ItineraryPieces = parseFloat($scope.SearchReplanRequest.ItineraryPieces);


            if (ItineraryPieces <= 0 && ItineraryGrossWeight <= 0 && ItineraryVolumeWeight <= 0) {
                ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) to fetch flights.");
                return false;
            }
            if (!$scope.SearchReplanRequest.InterlineFlightNo) {
                ShowMessage('warning', 'Information!', "Please select Flight No.");
                return false;
            }

            var origin = getCodeNKey($scope.SearchReplanRequest.Origin);

            var JsonResult = [{
                DailyflightSNo: '',
                FlightNo: $scope.IsInterline.Text + '-' + $scope.SearchReplanRequest.InterlineFlightNo,
                AircraftType: '',
                FlightDate: $scope.SearchReplanRequest.ItineraryDate,
                ETD: '00:00',
                ETA: '00:00',
                Origin: origin.Text,
                Destination: $scope.SearchReplanRequest.DestinationModel.Text,
                OriginSNo: origin.Key,
                DestinationSNo: $scope.SearchReplanRequest.DestinationModel.Key,
                CarrierCode: $scope.IsInterline.Text,
                IsInterline: true,
                IsInterlineCheck: true
            }];
            var dataItem = {};
            //{ "DailyflightSNo":"206037", "FlightNo":"GA-5590", "FlightDate":"24-Apr-2018", "ETD":"21:00:00", "ETA":"22:00:00", "Origin":"CGK", "Destination":"DPS", "OriginSNo":"3752", "DestinationSNo":"1840", "OriginCitySNo":"3992", "DestinationCitySNo":"1832", "AircraftType":"305FR", "FreeSaleGrossAvailUsed":"9600/9360/240", "FreeSaleVolumeAvailUsed":"57.600/57.594/0.006", "OverBookGrossAvailUsed":"2400/2400/0", "OverBookVolumeAvailUsed":"14.400/14.400/0.000", "AllocatedGrossAvailUsed":"500/500/0", "AllocatedVolumeAvailUsed":"5.000/5.000/0.000", "GrossWeight":"130.00", "Volume":"72.000", "FreesaleGross":"11760.00", "FreesaleVolume":"71.99400", "AllocatedGross":"0.00", "AllocatedVolume":"0.00000", "FlightDateWithTime":"24-Apr-2018", "CTime":"1", "ConnectionDateTime":"24-Apr-2018", "ArrFlightDate":"24-Apr-2018", "IsInterline":"0", "AirlineName":"GARUDA AIRLINE", "Pieces":13, "CBM":"0.027", "SoftEmbargo":"0", "AdviceStatusCode":"", "AllotmentCode":"", "AllotmentSNo":0, "Is_Delete":true, "Is_NextRoute":false, "RouteSNo":1, "SubRouteSNo":0 }
            onSuceessInsertRoute(JsonResult, dataItem, '0', true);
        }


        var InsertRoute = function (dataItem, SoftEmbargo) {
            $.ajax({
                type: "GET",
                url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/SelectdRoute",
                data: { DailFlightSNo: dataItem.DailyflightSNo || dataItem.DailyFlightSNo },
                contentType: "application/json; charset=utf-8", cache: false,
                global: false,
                success: function (result) { onSuceessInsertRoute(JSON.parse(result).Table0, dataItem, SoftEmbargo, false); }
            });

        }

        var onSuceessInsertRoute = function (jsonResult, dataItem, SoftEmbargo, isInterline) {

            if (jsonResult.length > 0) {

                var existData = $scope.CurrentPlanGridOptions.dataSource.data();
                var filterdata = filterData(existData, 'RouteSNo', $scope.RouteSNo);
                if (filterdata.length > 0) {
                    var subroutePcs = filterData(filterdata, 'SubRouteSNo', 0);
                    var pcs = subroutePcs[0].Pieces;
                    var selectedPcs = Number($scope.SearchReplanRequest.ItineraryPieces);
                    var subroutePcs1;
                    if ($scope.SubRouteSNo > 0) {
                        subroutePcs1 = filterData(filterdata, 'SubRouteSNo', $scope.SubRouteSNo);
                        if (subroutePcs1.length > 0)
                            selectedPcs = selectedPcs + (subroutePcs1[0].Pieces || 0);
                    }
                    if (subroutePcs1 != undefined && subroutePcs1.length > 0 && subroutePcs1[0].Origin == $scope.SearchReplanRequest.Origin && subroutePcs1[0].Destination == $scope.SearchReplanRequest.Destination) {
                    } else
                        $scope.SubRouteSNo++;


                }

                var dataResult = $.map(jsonResult, function (item) {
                    item.Pieces = $scope.SearchReplanRequest.ItineraryPieces;
                    item.CBM = parseFloat($scope.SearchReplanRequest.ItineraryVolumeWeight || 0).toFixed(3);
                    item.GrossWeight = parseFloat($scope.SearchReplanRequest.ItineraryGrossWeight || 0).toFixed(2);
                    item.SoftEmbargo = SoftEmbargo;
                    item.AdviceStatusCode = '';
                    item.AllotmentCode = dataItem.AllotmentCode || '';
                    item.AllotmentSNo = dataItem.AllotmentSNo || 0;
                    item.Is_Delete = true;
                    item.Is_NextRoute = false;
                    item.RouteSNo = $scope.RouteSNo;
                    item.SubRouteSNo = $scope.SubRouteSNo;
                    item.IsBCT = dataItem.OverrideBCT == 'NO' ? false : true;
                    item.IsMCT = dataItem.OverrideMCT == 'NO' ? false : true;
                    return item;
                });

                $scope.HideCurrentPlanGrid = false;

                if (existData.length > 0 && dataResult.length > 0) {
                    $.map(existData, function (item) { item.set("Is_Delete", false); })
                    existData.push(dataResult[0]);
                } else
                    $scope.CurrentPlanGridOptions.dataSource.data(dataResult);
                $scope.SearchPlanGridOptions.dataSource.data([]);
                $scope.divSearchPlanHide = true;

                var dataIn = $scope.CurrentPlanGridOptions.dataSource.data();
                //var dataOut = GroupBy(dataIn, 'RouteSNo');
                var dataOut = GrouupByRoute(dataIn, 'RouteSNo');

                var filterdata = filterData(dataIn, 'RouteSNo', $scope.RouteSNo);

                var subrouteData = [];
                var groupBy = 'SubRouteSNo';
                $.each(filterdata, function (index, element) {
                    if (subrouteData[element[groupBy]] == undefined)
                        subrouteData[element[groupBy]] = { Pieces: 0, Gross: 0, Volume: 0 };
                    subrouteData[element[groupBy]].Pieces += parseFloat(element.Pieces);
                    subrouteData[element[groupBy]].Gross += parseFloat(element.GrossWeight);
                    subrouteData[element[groupBy]].Volume += parseFloat(element.CBM);
                });

                //var selectedRoutes = dataOut[$scope.RouteSNo];

                if (subrouteData.length > 1 && subrouteData[$scope.SubRouteSNo - 1] != undefined && subrouteData[$scope.SubRouteSNo - 1].Pieces > subrouteData[$scope.SubRouteSNo].Pieces) {
                    $scope.replancomboDest.enable(false);
                    $scope.SearchReplanRequest.ItineraryPieces = (subrouteData[$scope.SubRouteSNo - 1].Pieces - subrouteData[$scope.SubRouteSNo].Pieces);
                    $scope.SearchReplanRequest.ItineraryGrossWeight = (parseFloat(subrouteData[$scope.SubRouteSNo - 1].Gross) - subrouteData[$scope.SubRouteSNo].Gross).toFixed(2);
                    $scope.SearchReplanRequest.ItineraryVolumeWeight = (parseFloat(subrouteData[$scope.SubRouteSNo - 1].Volume) - subrouteData[$scope.SubRouteSNo].Volume).toFixed(3);
                    if (!$scope.IsManualRoute) {
                        $scope.SearchPlanGridOptions.dataSource.read();
                        $scope.divSearchPlanHide = false;
                    }


                } else {
                    var pieces = 0, gross = 0, CBM = 0;
                    for (var i in dataOut) {
                        pieces += dataOut[i].Pieces;
                        gross += dataOut[i].Gross;
                        CBM += dataOut[i].Volume;
                    }
                    gross = gross.toFixed(2);
                    CBM = CBM.toFixed(3);
                    var oldPieces = parseFloat($scope.CurrentPlan.Pieces);

                    if ($scope.SearchReplanRequest.Destination == DefaultRoute('Destination')) {

                        if ($scope.IsManualRoute) {
                            $scope.SearchReplanRequest.Origin = DefaultRoute('Origin');
                            $scope.SearchReplanRequest.Destination = DefaultRoute('Destination');
                        }
                        $scope.SearchReplanRequest.ItineraryPieces = (oldPieces - pieces);
                        $scope.SearchReplanRequest.ItineraryGrossWeight = (parseFloat($scope.CurrentPlan.GrossWeight) - gross).toFixed(2);
                        $scope.SearchReplanRequest.ItineraryVolumeWeight = (parseFloat($scope.CurrentPlan.CBM) - CBM).toFixed(3);


                        if (pieces == oldPieces && $scope.SearchReplanRequest.ItineraryPieces == 0) {
                            if (parseFloat($scope.CurrentPlan.GrossWeight) != gross) {
                                ShowMessage('warning', 'Information!', " Gross Weight are not equal to existing gross weight.");
                                applyChanges();
                                return false;

                            }
                            if (parseFloat($scope.CurrentPlan.CBM) != CBM) {
                                ShowMessage('warning', 'Information!', " CBM are not equal to existing CBM.");
                                applyChanges();
                                return false;
                            }
                            $scope.SearchReplanRequest.ItineraryGrossWeight = parseFloat($scope.CurrentPlan.GrossWeight).toFixed(2);
                            $scope.SearchReplanRequest.ItineraryVolumeWeight = parseFloat($scope.CurrentPlan.CBM).toFixed(3);
                            $scope.SearchReplanRequest.ItineraryPieces = oldPieces;


                            $scope.btnSubmitHide = false;
                            $scope.replancomboDest.enable(false);
                            $scope.btnSearchDisable = true;
                        } else if ($scope.IsManualRoute) {
                            $scope.RouteSNo = $scope.RouteSNo + 1;
                            $scope.SubRouteSNo = 0;
                            $scope.replancomboDest.enable(true);
                        }
                        else {
                            $scope.RouteSNo = $scope.RouteSNo + 1;
                            $scope.SubRouteSNo = 0;
                            var dest = NextPreRoute($scope.SearchReplanRequest.Origin, $scope.SearchReplanRequest.Destination, true); //Get next route
                            if (dest.Origin == undefined)
                                dest = $scope.Routes[0];// Resetting default or first route
                            setOriginDest(dest.Origin, dest.Dest);
                            $scope.SearchPlanGridOptions.dataSource.read();
                            $scope.divSearchPlanHide = false;

                        }

                    } else {

                        if ($scope.IsManualRoute) {
                            $scope.SearchReplanRequest.Origin = $scope.SearchReplanRequest.Destination;
                            $scope.SearchReplanRequest.Destination = '';
                            $scope.replancomboDest.enable(true);
                        } else {

                            var dest = NextPreRoute($scope.SearchReplanRequest.Origin, $scope.SearchReplanRequest.Destination, true); //Get next route

                            if (dest.Origin != undefined) {

                                setOriginDest(dest.Origin, dest.Dest);
                                $scope.SearchPlanGridOptions.dataSource.read();
                                $scope.divSearchPlanHide = false;

                            }
                        }

                    }
                }



                try {
                    $scope.$apply();
                } catch (e) { }
            }
        }
        $scope.DeleteFlight = function (dataItem) {

            $scope.SearchPlanGridOptions.dataSource.data([]);
            $scope.btnSubmitHide = true;
            $scope.btnSearchDisable = false;
            var existData = $scope.CurrentPlanGridOptions.dataSource.data();
            existData.remove(dataItem);


            var oldPieces = parseFloat($scope.CurrentPlan.Pieces);
            var oldGross = parseFloat($scope.CurrentPlan.GrossWeight);
            var oldCBM = parseFloat($scope.CurrentPlan.CBM);
            $scope.SearchReplanRequest.ItineraryPieces = oldPieces;
            $scope.SearchReplanRequest.ItineraryGrossWeight = oldGross;
            $scope.SearchReplanRequest.ItineraryVolumeWeight = oldCBM;
            $scope.replancomboDest.enable(true);

            var dataOut = GrouupByRoute(existData, 'RouteSNo');


            if (existData.length > 0) {
                existData[existData.length - 1].set("Is_Delete", true);
                $scope.RouteSNo = existData[existData.length - 1].RouteSNo;
                $scope.SubRouteSNo = existData[existData.length - 1].SubRouteSNo;

                $scope.SearchReplanRequest.ItineraryPieces = Number(dataItem.Pieces);
                $scope.SearchReplanRequest.ItineraryGrossWeight = parseFloat(dataItem.GrossWeight).toFixed(2);
                $scope.SearchReplanRequest.ItineraryVolumeWeight = parseFloat(dataItem.CBM).toFixed(3);


            } else {
                $scope.HideCurrentPlanGrid = true;
                ResetSearchReplanRequest($scope.CurrentPlan);
                $scope.SubRouteSNo = 0;
            }


            $scope.SubRouteSNo = dataItem.SubRouteSNo == 0 ? 0 : $scope.SubRouteSNo;
            $scope.RouteSNo = dataItem.RouteSNo;

            if ($scope.IsManualRoute) {
                $scope.SearchReplanRequest.Destination = dataItem.Destination;
                $scope.SearchReplanRequest.Origin = dataItem.Origin;
            } else {
                setOriginDest(dataItem.Origin, dataItem.Destination);
                $scope.SearchPlanGridOptions.dataSource.read();
                $scope.divSearchPlanHide = false;
            }


        }



        function applyChanges() {
            $scope.btnSearchDisable = true;
            try {
                $scope.$apply();
            } catch (e) { }
        }
        var GroupBy = function (data, groupBy) {
            var dataOut = [];
            $.each(data, function (index, element) {
                if (dataOut[element[groupBy]] == undefined)
                    dataOut[element[groupBy]] = { Pieces: 0, Gross: 0, Volume: 0 };
                dataOut[element[groupBy]].Pieces += parseFloat(element.Pieces);
                dataOut[element[groupBy]].Gross += parseFloat(element.GrossWeight);
                dataOut[element[groupBy]].Volume += parseFloat(element.CBM);
            });
            return dataOut;
        }


        var GrouupByRoute = function (data, grp) {
            var routes = [];

            $.each(data, function (index, element) {
                if (routes[element[grp]] == undefined)
                    routes[element[grp]] = { RouteSNo: 1 };
                routes[element[grp]].RouteSNo = element.RouteSNo;
            });

            var dataOut = [];
            for (var i in routes) {
                var route = filterData(data, grp, routes[i].RouteSNo);
                var grpRoute = GroupBy(route, 'SubRouteSNo');
                if (dataOut[i] == undefined)
                    dataOut[i] = { Pieces: 0, Gross: 0, Volume: 0 };
                dataOut[i].Pieces = parseFloat(grpRoute[grpRoute.length - 1].Pieces);
                dataOut[i].Gross = parseFloat(grpRoute[grpRoute.length - 1].Gross);
                dataOut[i].Volume = parseFloat(grpRoute[grpRoute.length - 1].Volume);
            }
            return dataOut;
        }




        var $filter1 = new Array();
        //$filter1.push({ field: "AdviceStatusCode", operator: "neq", value: 'UU' });
        $filter1.push({ field: "IsActive", operator: "eq", value: 1 });
        var adviceds = GetDataSourceV2("Text_Grid", "SpaceControl_Advice");
        //adviceds.filter($filter1);

        $scope.CurrentPlanGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource(),
            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);
                var grid = this;
                if (!isAgentHide)
                    $(".advice").each(function () {
                        var dropdown = $(this);
                        var tr = dropdown.closest('tr');
                        var model = grid.dataItem(tr);

                        dropdown.kendoDropDownList({
                            autoBind: false,
                            optionLabel: "Select",
                            dataTextField: "Text",
                            dataValueField: "Key",
                            dataSource: adviceds.data().toJSON(),
                            change: function (ev) {
                                if (this.value() == "")
                                    model.AdviceStatusCode = '';
                                else
                                    model.AdviceStatusCode = this.text();
                            },

                        }).data("kendoDropDownList");


                    });

            },
            scrollable: false,
            columns: [
                { template: '#=RouteSNo#', title: 'Route', width: 40 },
                { template: '#=FlightNo#', title: 'Flight No', width: 40 },
                { template: '#=FlightDate#', title: 'Flight Date', width: 50 },
                { template: '#=Origin#/#=Destination#', title: 'Origin/Dest', width: 50 },
                { template: '#=ETD.slice(0,5)#/#=ETA.slice(0,5)#', title: 'ETD/ETA', width: 50 },
                { template: '#=AircraftType#', title: 'Aircraft Type', width: 50 },
                { template: '#=Pieces#', title: 'Pieces', width: 50 },
                { template: '#=GrossWeight#', title: 'Gross Weight', width: 50 },
                { template: '#=CBM#', title: 'Volume(CBM)', width: 50 },
                { template: '#=AllotmentCode#', title: 'Allotment Code', width: 45 },
                { template: '<div class="advice"></div>', headerTemplate: "<span class='hawb'>Advice</span>", width: 50 },
                { template: BindcheckBox('IsBCT'), title: 'BCT', width: 30 },
                { template: BindcheckBox('IsMCT'), title: 'MCT', width: 30 },
                { template: '#=Is_Delete?\'<input type="button" class="btn-primary" ng-click="DeleteFlight(dataItem)" value="Delete">\':""#', title: "Action", width: 25 }

            ]
        }

        function BindcheckBox(field) {
            return "<div class='chkCls'><input disabled id='" + field + "#=data.uid#' class='k-checkbox' type='checkbox' #=data." + field + "==true ? \"checked='checked'\" : '' # /><label for='" + field + "#=data.uid#' class='k-checkbox-label' ></label></div>";
        }


        $scope.SubmitReplan = function () {

            var grid = $scope.exitsPlanGrid;


            var beforeOrign = true; // Get not planed flight plan before origin
            var afterDest = false; // Get not planed flight plan after destination 
            var beforePlans = [];
            var afterPlans = [];

            var existPlans = $.map(grid.dataItems(), function (item) {

                if (item.Is_Origin) {
                    beforeOrign = false;
                }

                if (beforeOrign)
                    beforePlans.push(item.FlightPlanSNo);

                if (afterDest)
                    afterPlans.push(item.FlightPlanSNo);

                if (item.Is_Destination)
                    afterDest = true;
            });

            var ItineraryDetails = [];
            var CurrentPlanGridData = $scope.CurrentPlanGridOptions.dataSource.data().toJSON();

            // Before Plan Flight plan SNo
            for (var i in beforePlans)
                ItineraryDetails.push({ FlightPlanSNo: beforePlans[i] });


            var fltno = "";
            var arrVal = [];
            var grpData = [];
            var AWBSNo = "";
            for (var i = 0; i < CurrentPlanGridData.length; i++) {
                if (CurrentPlanGridData[i].IsSelect == undefined) {
                    grpData.push(CurrentPlanGridData[i]);
                    for (var j = i + 1; j < CurrentPlanGridData.length; j++) {
                        if (grpData[i].FlightNo == CurrentPlanGridData[j].FlightNo && grpData[i].FlightDate == CurrentPlanGridData[j].FlightDate && grpData[i].Origin == CurrentPlanGridData[j].Origin && grpData[i].Destination == CurrentPlanGridData[j].Destination) {
                            CurrentPlanGridData[j].IsSelect = true;
                            grpData[i].Pieces = parseFloat(grpData[i].Pieces) + parseFloat(CurrentPlanGridData[j].Pieces);
                            grpData[i].CBM = parseFloat(grpData[i].CBM) + parseFloat(CurrentPlanGridData[j].CBM);
                            grpData[i].GrossWeight = parseFloat(grpData[i].GrossWeight) + parseFloat(CurrentPlanGridData[j].GrossWeight);
                        }

                    }
                }
            }





            // Itinerary details
            for (var i in grpData)
                ItineraryDetails.push(grpData[i]);


            // After plans flight plan sno
            for (var i in afterPlans)
                ItineraryDetails.push({ FlightPlanSNo: afterPlans[i] });


            $.ajax({
                type: "POST",
                url: SiteUrl + 'SpaceControl/SubmitReplan',
                contentType: 'application/json',
                data: JSON.stringify({ BookingRefNo: $scope.CurrentPlan.ReferenceNumber, ReplanFrom: $scope.ReplanFrom, BookedFrom: ($scope.IsOffload ? "Offloaded" : $scope.replanAWBSelectDetails.BookedFrom), aWBDetails: $scope.CurrentPlan, ItineraryDetails: ItineraryDetails, airportSNo: $scope.replanAWBSelectDetails.AirportSNo || 0 }),
                success: function (result) {
                    result = JSON.parse(result);
                    if (result.Table0 != undefined && result.Table0.length > 0 && result.Table0[0].Result == 'Success') {

                        //Added Code By Shivali Thakur for Audit Log//
                        var flightno = "";
                        var FlightDate = "";
                        var bct = "";
                        var mct = "";
                        var bool = true;
                        $.map(grid.dataItems(), function (item) {

                            for (var i = 0; i < CurrentPlanGridData.length; i++) {
                                AWBSNo = item.FlightPlanSNo;
                                fltno = item.FlightNo;

                                grpData.push(CurrentPlanGridData[i]);
                                if ($("#eq2").prop("checked") == true) {
                                    bct = "Yes";
                                }

                                if ($("#eq3").prop("checked") == true) {
                                    mct = "Yes";
                                }
                                if (CurrentPlanGridData.length > 1) {
                                    for (var j = i + 1; j < CurrentPlanGridData.length; j++) {


                                        if (grpData[i].FlightNo == CurrentPlanGridData[j].FlightNo) {
                                            flightno = grpData[i].FlightNo;
                                        }
                                        else {
                                            flightno = grpData[i].FlightNo + "/" + CurrentPlanGridData[j].FlightNo;
                                        }
                                        if (grpData[i].FlightDate == CurrentPlanGridData[j].FlightDate) {
                                            FlightDate = grpData[i].FlightDate;
                                        }
                                        else {
                                            FlightDate = grpData[i].FlightDate + "/" + CurrentPlanGridData[j].FlightDate;
                                        }

                                        var Pieces = grpData[i].Pieces + "/" + CurrentPlanGridData[j].Pieces;
                                        var CBM = grpData[i].CBM + "/" + CurrentPlanGridData[j].CBM;
                                        var GrossWeight = grpData[i].GrossWeight + "/" + CurrentPlanGridData[j].GrossWeight;
                                        var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'FlightNo', OldValue: item.FlightNo, NewValue: flightno };
                                        arrVal.push(c);
                                        var d = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'FlightDate', OldValue: item.FlightDate, NewValue: FlightDate };
                                        arrVal.push(d);
                                        var f = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'Pieces', OldValue: item.Pieces, NewValue: Pieces };
                                        arrVal.push(f);
                                        var g = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'CBM', OldValue: item.CBM, NewValue: CBM };
                                        arrVal.push(g);
                                        var h = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'GrossWeight', OldValue: item.GrossWeight, NewValue: GrossWeight };
                                        arrVal.push(h);
                                        var l = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'BCT', OldValue: "", NewValue: bct };
                                        arrVal.push(l);
                                        var m = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'MCT', OldValue: "", NewValue: mct };
                                        arrVal.push(m);
                                    }
                                }
                                else {
                                    if (bool == true) {
                                        var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'FlightNo', OldValue: item.FlightNo, NewValue: grpData[i].FlightNo };
                                        arrVal.push(c);
                                        var d = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'FlightDate', OldValue: item.FlightDate, NewValue: grpData[i].FlightDate };
                                        arrVal.push(d);
                                        var f = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'Pieces', OldValue: item.Pieces, NewValue: grpData[i].Pieces };
                                        arrVal.push(f);
                                        var g = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'CBM', OldValue: item.CBM, NewValue: grpData[i].CBM };
                                        arrVal.push(g);
                                        var h = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'GrossWeight', OldValue: item.GrossWeight, NewValue: grpData[i].GrossWeight };
                                        arrVal.push(h);
                                        var l = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'BCT', OldValue: "", NewValue: bct };
                                        arrVal.push(l);
                                        var m = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBReplan", ColumnName: 'MCT', OldValue: "", NewValue: mct };
                                        arrVal.push(m);
                                    }
                                    bool = false;
                                }
                            }
                        });

                        SaveAppendGridAuditLog("FlightNo", fltno, AWBSNo, JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);

                        //Added Code By Shivali Thakur for Audit Log//



                        ShowMessage('success', 'Success - Shipment has been replanned.', " ", "bottom-right");
                        if ($scope.ReplanFromBooking) {
                            window.location.href = SiteUrl + 'Default.cshtml?Module=Shipment&Apps=ReservationBooking&FormAction=INDEXVIEW';
                        } else {
                            if ($scope.IsOffloadShipment)
                                $scope.OffloadShipmentGridOptions.dataSource.read();
                            else
                                $scope.AWBDetailsSerachGridOptions.dataSource.read();
                            $scope.tabstrip2.remove($scope.tabstrip2.select());
                            $scope.tabstrip2.select($scope.tabstrip2.tabGroup.children("li:last").index());
                        }
                    } else if (result.Table0 != undefined)
                        ShowMessage('warning', 'Warning -' + result.Table0[0].Result, " ", "bottom-right");
                    else
                        ShowMessage('warning', 'Warning -' + result, " ", "bottom-right");
                }
            });


        }


        /*End Replan Flight Region*/


        /* Request Region*/

        $scope.awbDeatilsRequest = {};
        $scope.GetawbDeatilsRequest = function () { return $scope.awbDeatilsRequest; }
        /* Grids Start Region*/
        $scope.searchFlightResultsGridOptions = {
            appScopeProvider: garuda,
            dataBound: function (e) { cfi.DisplayEmptyMessage(e, this); },
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                type: "json",
                serverPaging: true,
                serverSorting: true,
                pageSize: 10,
                transport: {
                    read: {
                        url: SiteUrl + "/spaceControl/spaceControlSearch",
                        dataType: "json",
                        type: "post",
                        global: false,
                        data: function () {

                            return $scope.SearchRequest;
                        }
                    }

                },
                schema: {
                    model: {
                        fields: { FlightDate: { type: "date" }, Finalised: { type: "boolean" } }
                    }, data: function (data) {
                        return JSON.parse(data.Data);
                    }, total: function (data) {
                        return data.Total;
                    }
                }
            }),
            // height: 500,
            pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
            columnMenu: false,
            columns: [
                { template: '#= Board#/#=Off#', title: "Board/Off", width: 60, locked: true },
                { field: "Route", title: "Routing", width: 110, locked: true },
                { field: "FlightDate", title: "Flight Date", format: "{0: dd-MMM-yyyy}", width: 80, locked: true },
                { template: '<input type="button" value="#=FlightNo#" ng-click="GetFlightDetails(\'#=DailyFlightSNo#\',\'#=FlightNo#\',\'#=FlightDate#\');" title="View Flight details" class="inProgress wa">', title: "Flight No", width: 70, locked: true },
                { template: "#=ETD.slice(0,5)#", title: "ETD", width: 40, locked: true },
                { field: "TTD", title: "Time<br> To<br>Departure", width: 90, locked: true },
                { template: '<input type="button" value="#=AircraftType#" onclick="GetAircraftInfo(\'#=AirCraftSNo#\',\'#=AircraftType#\');" title="View Aircraft details" class="inProgress wa">', title: "Aircraft Type", width: 60, locked: true },
                { field: "AirCraftNo", title: "A/C Reg. No", width: 90, locked: true },
                {
                    headerTemplate: "<span class='hQueue'>Queues</span>/<br><span class='hConf'>Confirm</span>",
                    template: '<button ng-click="GetFlightDetails(\'#=DailyFlightSNo#\',\'#=FlightNo#\',\'#=FlightDate#\',true);" class="inProgress"><span class="tdQueue">#= Queue#</span> / <span class="tdConf">#= Confirm#</span></button>', width: 60, locked: true
                },

                {
                    headerTemplate: "<span class='hcap'>Total Capacity</span>",
                    columns: [{ template: '<input type="button" value="#=GrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Total\');">', title: "Gross", width: 75 },
                    { template: '<input type="button" value="#=Volume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Total\');">', title: "CBM", width: 75 }, ]
                }, {

                    headerTemplate: "<span class='hcap'>Used Capacity</span>",
                    columns: [{ template: '<input type="button" value="#=UsedGrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Used\');">', title: "Gross", width: 75 },
                    { template: '<input type="button" value="#=UsedVolume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Used\');">', title: "CBM", width: 75 }, ]
                },
                {

                    headerTemplate: "<span class='hcap'>Remaining Capacity</span>",
                    columns: [{ template: '<input type="button" value="#=RemainingGrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Remaining\');">', title: "Gross", width: 75 },
                    { template: '<input type="button" value="#=RemainingVolume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Remaining\');">', title: "CBM", width: 75 }, ]
                },
                {

                    headerTemplate: "<span class='hcap'>Reserved Capacity</span>",
                    columns: [{ field: "ReservedGrossWeight", title: "Gross", width: 60 },
                    { field: "ReservedVolume", title: "CBM", width: 60 }, ]
                }, {

                    headerTemplate: "<span class='hcap'>Overbooked Capacity</span>",
                    columns: [{ field: "OverBookGrossWeight", title: "Gross", width: 50 },
                    { field: "OverbookVolume", title: "CBM", width: 50 }, ]
                },
                { headerTemplate: "<span class='hRev'>Revenue</span>", template: "<span class='tdRev'>#=Revenue#</span>", width: 100 },
                { headerTemplate: "<span class='hYield'>Yield</span>", template: "<span class='tdYield'>#=Yield#</span>", width: 80 },
                { field: "PaxLoad", title: "PAX<br>Load", width: 50 },
                { template: "#= Finalised ? 'YES' : 'NO' #", title: "Finalised", width: 60 },


            ]

        };



        $scope.AWBDetailsSerachGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                type: "json",
                transport: {
                    read: {
                        url: SiteUrl + "/spaceControl/GetFlightRoute",
                        dataType: "json",
                        type: "post",
                        global: false,
                        data: $scope.GetawbDeatilsRequest
                    }
                },
                schema: {
                    model: {
                        id: "FlightNo", fields: { FlightNo: { type: "string" }, }
                    }, data: function (data) { return JSON.parse(data); }, total: function (data) { return data.Total; },
                }
            }),

            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);
                this.expandRow(this.tbody.find("tr.k-master-row"));
                //remove hierarchy cells and column
                $(".k-hierarchy-cell").remove();
                $(".k-hierarchy-col").remove();

            },
            scrollable: true,
            columns: [{
                headerTemplate: "<span  class='hawbd'>{{awbDeatilsRequest.FlightNo}} </span> AWB Details",
                template: '<span class="hawb">#=Origin#-#=Dest#</span>', width: 60
            },
            {
                headerTemplate: "<span class='hcap'>Total Capacity</span>",
                columns: [{ template: '<input type="button" value="#=GrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Total\');">', title: "Gross", width: 75 },
                { template: '<input type="button" value="#=Volume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Total\');">', title: "CBM", width: 75 },

                ]
            },
            {

                headerTemplate: "<span class='hcap'>Used Capacity</span>",
                columns: [{ template: '<input type="button" value="#=UsedGrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Used\');">', title: "Gross", width: 75 },
                { template: '<input type="button" value="#=UsedVolume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Used\');">', title: "CBM", width: 75 }, ]
            },
            {

                headerTemplate: "<span class='hcap'>Remaining Capacity</span>",
                columns: [{ template: '<input type="button" value="#=RemainingGrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Remaining\');">', title: "Gross", width: 75 },
                { template: '<input type="button" value="#=RemainingVolume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Remaining\');">', title: "CBM", width: 75 }, ]
            },
                //{ field: "GrossWeight", title: "Available Capacity", width: 100 },
                //{ field: "UsedGrossWeight", title: "Used Capacity", width: 100 },
                //{ field: "RemainingGrossWeight", title: "Remaining Capacity", width: 100 }
            ]
        };



        function UpdateDeleteData(options) {
            var _this = this;
            var arrVal = [];
            var oldarrVal = [];
            var NewoldarrVal = [];

            var flightno = '';
            var awbsno = '';
            var oldspaceinfo = '';
            //Added By Shivali thakur for Audit Log
            $.map(options.data.models, function (item) {

                if (item.Is_Select == true) {

                    var s = {
                        oldvalue: item.SpaceInfo,
                        awbno: item.AWBNo,
                        AdviceStatusCode: item.AdviceStatusCode

                    }
                    oldarrVal.push(s);
                }

            });
            var dataModels = $.map(options.data.models, function (item) {

                if (item.Is_Select && item.AdviceStatusCode != '') {
                    item.SHC = '';
                    oldspaceinfo = item.SpaceInfo;
                    return item;
                }
            });
            if (dataModels.length == 0) {
                ShowMessage('warning', 'Warning -Please select at least one record and update status', " ", "bottom-right");
                return false;
            }
            $.ajax({
                type: "POST",
                url: SiteUrl + "/spaceControl/UpdateAWBList",
                data: JSON.stringify({ models: dataModels }),
                dataType: "json",
                global: false,
                contentType: 'application/json',
                success: function (result) {
                    if (result == 'Success') {
                        var uModels = $.map(options.data.models, function (item) {

                            item.Is_Select = false;
                            item.SpaceInfo = item.AdviceStatusCode;
                            item.AdviceStatusCode = '';
                            flightno = item.FlightNo;
                            awbsno = item.AWBSNo;

                            return item;

                        });


                        //Added Code By Shivali thakur for Audit Log
                        var holdvalue, hawbno, nholdvalue, nhawbno, HoldValues
                        jQuery.each(oldarrVal, function (index, item) {
                            holdvalue = item.oldvalue;
                            HoldValues = item.oldvalue;
                            nhawbno = item.awbno
                            var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "AWBDetails", ColumnName: nhawbno, OldValue: HoldValues, NewValue: item.AdviceStatusCode };
                            arrVal.push(c);
                        });

                        SaveAppendGridAuditLog("FlightNo", flightno, awbsno, JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);
                        // Ended Code By Shivali thakur for Audit Log
                        var data = { Data: JSON.stringify(uModels) };
                        options.success(data);

                        ShowMessage('success', 'Success -Shipment has been updated', " ", "bottom-right");
                        $scope.AWBDetailsSerachGridOptions.dataSource.read();
                        $scope.searchFlightResultsGridOptions.dataSource.read($scope.SearchRequest);
                        LoadFlightDetails($scope.awbDeatilsRequest);
                    } else
                        ShowMessage('warning', 'Warning -' + result, " ", "bottom-right");

                }
            });
        }

        function SaveAppendGridAuditLog(KeyColumn, KeyValue, keySNo, jsonData, FormAction, TerminalSNo, TerminalName) {
            try {


                //if ($("#hdnAuditLog").length > 0 && $("#hdnAuditLog").val() != "") {
                if (jsonData != undefined && jsonData != null && jsonData.length > 0) {
                    KeyColumn = KeyColumn || "A~A";
                    KeyValue = KeyValue || "A~A";
                    keySNo = keySNo || "0"
                    $.ajax({
                        type: "POST",
                        async: false,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: SiteUrl + "Services/Common/CommonService.svc/SaveAppendGridAuditLog?ModuleName=" + getQueryStringValue("Module").toUpperCase() + "&AppsName=" + getQueryStringValue("Apps").toUpperCase() + "&KeyColumn=" + KeyColumn + "&KeyValue=" + KeyValue + "&KeySNo=" + keySNo + "&FormAction=" + FormAction + "&TerminalSNo=" + TerminalSNo + "&TerminalName=" + TerminalName,
                        // data: $("#hdnAuditLog").val(),
                        data: JSON.stringify({ data: btoa(jsonData) }),
                        success: function (response) {

                        }
                    });
                }
            } catch (e) {

            }
            finally {
                sessionStorage.removeItem("auditlog");
            }
        }
        $scope.AWBDetailsInitGrid = function (dataItem, IsHidden) {
            return {
                dataSource: {
                    type: "json",
                    serverPaging: true,
                    serverSorting: true,
                    pageSize: 20,
                    transport: {
                        read: function (options) {
                            options.data.dailyFlightSNo = dataItem.DailyFlightSNo;
                            options.data.AWBRefSNo = dataItem.AWBRefBookingSNo;
                            options.data.BookedFrom = dataItem.BookedFrom;
                            options.data.SearchBy = $scope.SearchRequest.SearchBy;
                            options.data.ProductSNo = $scope.SearchRequest.ProductSNo;
                            $.ajax({
                                type: "POST",
                                url: SiteUrl + "/spaceControl/SearchAWBList", global: false,
                                //contentType: "application/json; charset=utf-8",dataType: "json",
                                data: options.data,
                                success: function (result) {
                                    options.success(result);
                                }
                            });
                        },

                        // parameterMap: function (options) {
                        //    if (options.filter == undefined)
                        //        options.filter = null;
                        //    if (options.sort == undefined)
                        //        options.sort = null; return JSON.stringify(options);
                        //},
                        update: UpdateDeleteData,

                    },
                    schema: {
                        model: {
                            id: "FlightNo", fields: { FlightNo: { type: "string" }, }
                        }, data: function (data) {

                            return JSON.parse(data.Data);
                        }, total: function (data) {

                            return data.Total;
                        },
                    },
                    batch: true,

                },

                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
                sortable: true,
                dataBound: function (e) {
                    cfi.DisplayEmptyMessage(e, this);
                    var grid = this;
                    grid.table.find('.adviceCode').each(function () {
                        var dropdown = $(this);
                        var tr = dropdown.closest('tr');
                        var model = grid.dataItem(tr);
                        if (model.IsCancelled != "1") {

                            var data = [];
                            $.map(adviceDataSource.data(), function (item) {
                                if (model.SpaceInfo != item.Text)
                                    data.push(item);
                            });
                            dropdown.kendoDropDownList({
                                autoBind: false,
                                optionLabel: "Select",
                                dataTextField: "Text",
                                dataValueField: "Key",
                                dataSource: data,
                                change: function (ev) {
                                    if (this.value() == "") {
                                        model.AdviceStatusCode = '';
                                        model.set('dirty', false);
                                    }
                                    else {
                                        model.AdviceStatusCode = this.text();
                                        model.set('dirty', true);
                                    }
                                },

                            }).data("kendoDropDownList");

                        }
                    });

                },
                toolbar: ["save", "cancel"],
                columns: [
                    { template: '<input #= IsDisable==1 ? \'disabled\' : "" # type="checkbox" id="eq1#=uid#" ng-model = "dataItem.Is_Select"  class="k-checkbox checkbox chkbx" ><label class="k-checkbox-label" for="eq1#=uid#"></label>', width: 23 },
                    { template: "#=BookedFrom#", headerTemplate: "Booking<br>Type", width: 60 },

                    { template: "#=FlightNo#", title: "Flight No", width: 55, hidden: !IsHidden },
                    { template: "#=FlightDate#", title: "Flight Date", width: 70, hidden: !IsHidden },
                    { template: "#=Origin#/#=Dest#", title: "O/D", width: 55 },
                    { template: '<span class="linkbtn" onclick="GetAWBNoDetails(\'#=AWBNo.toUpperCase()#\',\'#=AWBRefBookingSNo#\',\'#=BookedFrom#\');">#=AWBNo.toUpperCase()#</span>', headerTemplate: "<span>AWB No/ <br> Ref No/CN38</span>", width: 80, hidden: IsHidden },
                    { template: "#=Pieces#", title: "Pieces", width: "40px" },
                    { template: "#=Gross#", title: "Gross", width: "50px" },
                    { template: "#=Chargeable#", headerTemplate: "<span class='hawb'>Chble<br> Wt.</span>", width: 60 },
                    { template: "#=GetroundValue(Volume)#", headerTemplate: "<span>Volume<br> Wt.</span>", width: "50px" },
                    { template: "#=CBM#", title: "CBM", width: 60 },
                    { template: '<span class="linkbtn" onclick="GetAgentDetails(\'#=AWBRefBookingSNo#\',\'#=AgentSNo#\',\'#=BookedFrom#\');">#=Agent.toUpperCase()#</span>', title: "Agent", width: "60px" },
                    { template: "#=AgentAllocation#", headerTemplate: "<span class='hawb'>Agent<br>Allocation</span>", width: "50px" },

                    { template: "<span class='cap'>#=Product#</span>", title: 'Product', width: 50 },
                    { template: "<span class='cap'>#=OriginPriority#</span>", headerTemplate: "<span>Origin<br>Priority</span>", width: "50px" },
                    { template: "#=CommodityDesc.slice(0,9).TrimRight(',')#", title: "Commodity", width: "60px" },
                    { template: "#=SHC.slice(0,10).TrimRight(',')#", title: 'SHC', width: 50 },

                    { template: '<span class="linkbtn" onclick="GetOSIRemarks(\'#=AWBSNo#\');">#=Remarks#</span>', title: "OSI/Remarks", width: "80px" },
                    //{ template: "<span class='#=SplitLoaded=='Yes'?\"KK\":\"LL\"#'>#=SplitLoaded#</span>", headerTemplate: "<span class='hawb'>Split <br> Loaded</span>", width: "50px" },
                    { template: "#=Yield#", headerTemplate: "<span class='hawb'>Yield</span>", width: "50px" },
                    { template: "#=Revenue#", headerTemplate: "<span class='hawb'>Revenue</span>", width: "50px" },
                    { template: "<span class='#=getSpaceInfoClass(SpaceInfo)#'>#=SpaceInfo#</span>", headerTemplate: "<span class='hawb'>Space<br>Info</span>", width: "50px" },

                    {
                        //template: "#=PriorityName#",
                        template: '<button class="pbtn" ng-click="AddHDQRemarks(dataItem);">#=PriorityName.toUpperCase()#</button>',
                        headerTemplate: "<span class='hawb'>HDQ<br>Priority<br>/RMKS</span>", width: "50px"
                    },
                    { template: "#=AWBStatus#", title: "Status", width: "50px" },
                    { headerTemplate: "<span class='hawb'>C/S/O</span>", template: "<div style='width:48px;' class='adviceCode'></div>", width: "50px" },
                    {
                        template: '#=IsReplan=="0"?"":\'<input type="button" value="Replan" class="inProgress wa" ng-click="ReplanAWBFlight(dataItem,false);">\'#',
                        //template: '<a href="../Index.cshtml?Default.cshtml?Module=Shipment&Apps=ReservationBooking&FormAction=INDEXVIEW" target="_blank">Booking</a>',
                        title: "Replan", width: "50px"
                    },

                ], editable: true
            };
        };

        $scope.AddHDQRemarks = function (dataItem) {
            $scope.HDQRemarks = dataItem;
            $scope.HDQRemarks.HDQRemarks = dataItem.PriorityName;
            $scope.kwinRemarks.center();
            $scope.kwinRemarks.open();

        }

        $scope.UpdateHDQRemarks = function () {
            $http.post('/SpaceControl/ADDHDQRemarks', {
                FlightPlanSNo: $scope.HDQRemarks.FlightPlanSNo, DailyFlightSNo: $scope.HDQRemarks.DailyFlightSNo,
                Remarks: $scope.HDQRemarks.HDQRemarks, AWBSNo: $scope.HDQRemarks.AWBSNo,
                AirportSNo: $scope.HDQRemarks.AirportSNo
            }).then(function (result) {
                $scope.HDQRemarks.set('PriorityName', $scope.HDQRemarks.HDQRemarks);
                $scope.kwinRemarks.close();
            });
        }


        $scope.ExtraCondition = function (textId) {

            var SearchFilter = cfi.getFilter("AND");

            if (textId == "Replan_CarrierCode") {
                var _SearchFilter = cfi.getFilter("AND");
                cfi.setFilter(_SearchFilter, "IsActive", "eq", '1');
                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            }

            if (textId == "Text_FlightNo") {
                var _SearchFilter = cfi.getFilter("AND");
                if ($scope.Airlines != "")
                    cfi.setFilter(_SearchFilter, "CarrierCode", "in", $scope.Airlines);
                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            }
            //SpaceControl_FlightNo
            if (textId == "Replan_FlightNo") {
                var _SearchFilter = cfi.getFilter("AND");
                if ($scope.SearchReplanRequest.Destination != "")
                    cfi.setFilter(_SearchFilter, "DestinationAirportCode", "eq", $scope.SearchReplanRequest.Destination);
                if ($scope.SearchReplanRequest.Origin != "")
                    cfi.setFilter(_SearchFilter, "OriginAirportCode", "eq", $scope.SearchReplanRequest.Origin);
                if ($scope.Airlines != "")
                    cfi.setFilter(_SearchFilter, "CarrierCode", "in", $scope.Airlines);


                if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                    if ($scope.IsInterline && $scope.IsInterline.Key == "0") {
                        cfi.setFilter(_SearchFilter, "CarrierCode", "eq", $scope.IsInterline.Text);
                    } else
                        if ($scope.AWBInfo.Sector.split('-')[0] == $scope.SearchReplanRequest.Origin) {
                            var exgrid = $scope.exitsPlanGrid;
                            var data = Getselected(exgrid.dataItems(), 'Is_Origin');
                            var IsInterline = Getselected(exgrid.dataItems(), 'Is_Origin').IsInterline || "";

                            if (data.IsInterline == 'True') {
                                cfi.setFilter(_SearchFilter, "CarrierCode", "in", $scope.CurrentPlan.CarrierCodes.TrimRight() + ',' + data.FlightNo.split('-')[0]);
                            }
                        }
                        else
                            cfi.setFilter(_SearchFilter, "CarrierCode", "in", $scope.CurrentPlan.CarrierCodes.TrimRight());
                } else if ($scope.IsInterline && $scope.IsInterline.Key == "0")
                    cfi.setFilter(_SearchFilter, "CarrierCode", "eq", $scope.IsInterline.Text);




                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            } else
                if (textId == 'Text_FlightNos') {
                    var _SearchFilter = cfi.getFilter("AND");
                    // cfi.setFilter(_SearchFilter, "FlightDate", "eq", cfi.CfiDate($("#" + textId).closest('tr').find("[id^='FlightDate']").attr('id')));
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                } else if (textId == 'Text_CapacityUtilized') {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "LOOKUPTYPENAME", "eq", 'CapacityUtilised');
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                } else if (textId == 'Text_CAO') {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "LOOKUPTYPENAME", "eq", 'CAO');
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                }
                else if (textId == 'Text_TimeToDep') {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "LOOKUPTYPENAME", "eq", 'TimeToDeparture');
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                } else if (textId == 'Text_FlightFinalised') {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "LOOKUPTYPENAME", "eq", 'FlightFinalised');
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                } else if (textId == 'Text_Zone') {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "Text_ZoneBasedOn", "eq", 'Airport');
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                }
                else if (textId == 'Text_Origin' && this.SearchRequest.Destination != "") {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "OriginAirportSNo", "neq", this.SearchRequest.Destination);
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                }
                else if (textId == 'Text_Destination' && (this.OriginModel.key || this.OriginModel.Key || "") != "") {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "DestinationAirportSNo", "neq", (this.OriginModel.key || this.OriginModel.Key || ""));
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                }

                else if (textId == 'Text_Destination' && this.SearchRequest.Origin != "") {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "DestinationAirportSNo", "neq", this.SearchRequest.Origin);
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                } else if (textId == 'Text_OrderBy') {
                    var _SearchFilter = cfi.getFilter("AND");
                    cfi.setFilter(_SearchFilter, "LOOKUPTYPENAME", "eq", 'OrderBy');
                    SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                    return SearchFilter;
                }
            //else
            //    if (textId.indexOf("Text_FlightDetailsAirport") >= 0) {
            //        var filter1 = cfi.getFilter("AND");
            //        var flightDate = new Date($("#FlightDetailsFlightDate").val());
            //        var month = flightDate.getMonth() < 10 ? '0' + (flightDate.getMonth() + 1) : (flightDate.getMonth() + 1);
            //        var day = flightDate.getDate();
            //        var year = flightDate.getFullYear();
            //        flightDate = year + "-" + month + "-" + day;
            //        cfi.setFilter(filter1, "FlightNumber", "eq", $('#FlightDetailsFlightNo').val());
            //        cfi.setFilter(filter1, "FlightDate", "eq", flightDate);
            //        cfi.setFilter(filter1, "IsActive", "eq", "1");
            //        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
            //        return filterAirlineSNo;
            //    }

        }



    }]);

angular.bootstrap(document, ["GarudaApp"]);

var adviceDataSource;


function HMSToHM(txt) {
    if (txt.lastIndexOf(':') > 4)
        return txt.substr(0, txt.lastIndexOf(':'));
    else
        return txt;
}

function getSpaceInfoClass(status) {
    if (status == "LL" || status == "UU") {
        return "Hold";
    } else if (status == 'KK') {
        return "KK";
    }
}


$(document).ready(function () {
    adviceDataSource = GetDataSourceV2("Text_Grid", "SpaceControl_Advice");
    adviceDataSource.read();
    UserPageRights("SpaceControl/ReplanOffLoadShipment")

});


function GetAgentDetails(refSNo, aSNo, BookedFrom) {
    cfi.ShowPopUp("Agent Details", SiteUrl + "/spaceControl/GetAgentDetails", { AWBRefBookinSNo: refSNo, agentSNo: aSNo, BookedFrom: BookedFrom }, 850);
}
function GetAWBNoDetails(awbno, AWBRefBookingSNo, BookedFrom) {
    cfi.ShowPopUp("AWB No/Ref No/CN38 No(" + awbno + ") Details", SiteUrl + "/spaceControl/GetAWBNoDetails", { AWBRefBookingSNo: AWBRefBookingSNo, BookedFrom: BookedFrom }, 800);
}

function GetAllotmentDetails(AllotmentNo) {
    cfi.ShowPopUp("Allotment Details", SiteUrl + "/spaceControl/GetAllotmentDetails", { allotmentSNo: AllotmentNo }, 800);
}

function GetFlightSummary(dailyFlightSNo) {
    cfi.ShowPopUp("Flight Summary", "/spaceControl/GetFlightSummary", { dailyFlightSNo: dailyFlightSNo }, 800);
}

function GetOSIRemarks(awbSNo) {
    cfi.ShowPopUp("OSI Remarks", "/spaceControl/GetOSIRemarks", { awbSNo: awbSNo }, 800);
}

function ViewCapacity(dailyFlightSNo, CapacityType) {
    cfi.ShowPopUp(CapacityType + " Capacity", "/spaceControl/GetCapacity", { dailyFlightSNo: dailyFlightSNo, CapacityType: CapacityType }, 1024);
}

var GetAircraftInfo = function (SNo, aircraftType) {
    cfi.ShowPopUp("Aircraft Details: " + aircraftType, SiteUrl + "/spaceControl/GetAircraftDetails", { airCraftSNo: SNo }, 1024);
}

var validDate = function (_this) {
    var dtRegex = new RegExp("^([0]?[1-9]|[1-2]\\d|3[0-1])-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-[1-2]\\d{3}$", 'i');
    if (!dtRegex.test($(_this).val())) {
        $(_this).val('');
    }
}
if (typeof String.prototype.TrimRight !== 'function') {
    String.prototype.TrimRight = function (char) {
        if (this.lastIndexOf(char))
            return this.slice(0, this.length - 1);
        else
            return this;

    }
}

function addScript(callback) {
    var s = document.createElement('script');
    s.setAttribute('src', "/Scripts/KendoSchedular/Content/JS/kendo.dataviz.min.js");
    s.onload = callback;
    document.body.appendChild(s);
}

function GetroundValue(numbervalue, precision) {
    var multiplier = Math.pow(10, precision || 0);
    if (userContext.SysSetting.IsRoundValue == "1") {
        if (parseFloat(numbervalue) > 0 && parseFloat(numbervalue) < 1)
            return 1;
        else
            return Math.round(parseFloat(parseFloat(numbervalue).toFixed(0)) * multiplier) / multiplier;
    }
    else {
        var Decimalnumbervalue = numbervalue.toString().split('.')[1] || 0;
        var Returnnumbervalue = "";
        Decimalnumbervalue = '.' + Decimalnumbervalue;
        if (parseFloat(Decimalnumbervalue) > .5)
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + 1
        else if (parseFloat(Decimalnumbervalue) == .0)
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + 0
        else
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + .5


        return Math.round(parseFloat(Returnnumbervalue) * multiplier) / multiplier;
    }
}

function getCodeNKey(value) {
    var output = {};
    $.ajax({
        url: SiteUrl + "Services/AutoCompleteService.svc/AutoCompleteDataSourceV2",
        async: false,
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        cache: false,
        data: JSON.stringify({

            filter: {
                logic: "AND",
                filters: [
                    { logic: "and", filters: [{ field: "AirportCode", operator: "eq", value: value }] }
                ]
            },

            autoCompleteName: "SpaceControl_Airport",
            take: 10,
            page: 1,
            pageSize: 5,
        }),

        success: function (result) {
            if (result.Data.length > 0)
                output = result.Data[0];
        }
    });
    return output;
}

//function UserSubProcessRights(container, subProcessSNo) {
//    var isView = false, IsBlocked = false;
//    //get the subprocess view permission
//    $(userContext.ProcessRights).each(function (i, e) {
//        if (e.SubProcessSNo == subProcessSNo) {
//            isView = e.IsView;
//            return;
//        }
//    });

//    $(userContext.ProcessRights).each(function (i, e) {
//        if (e.SubProcessSNo == subProcessSNo) {
//            IsBlocked = e.IsBlocked;
//            return;
//        }
//    });

//    if (IsBlocked) {
//        $('#' + container).html("")
//        $(".btn-success").attr("style", "display:none;");
//        $(".btn-danger").attr("style", "display:none;");
//        $(".ui-button").closest("td").attr("style", "display:none;");
//        $(".btnTrans").closest("td").attr("style", "display:none;");
//        $(".btn-primary").attr("style", "display:none;");
//        $(".btn-block").attr("style", "display:none;");

//    } else {

//        //if view permission is true
//        if (isView) {
//            $(".btn-success").attr("style", "display:none;");
//            $(".btn-danger").attr("style", "display:none;");
//            $(".ui-button").closest("td").attr("style", "display:none;");
//            $(".btnTrans").closest("td").attr("style", "display:none;");
//            $(".btn-primary").attr("style", "display:none;");
//            $(".btn-block").attr("style", "display:none;");

//            //$(".k-icon,.k-delete").replaceWith("");

//            $('#' + container).find('input').each(function () {
//                var ctrltype = $(this).attr("type");
//                var dataRole = $(this).attr("data-role");
//                if (ctrltype != "hidden") {
//                    if (dataRole == "autocomplete") {
//                        $(this).parent().parent().replaceWith("<span>" + this.value + "</span>");
//                    }
//                    else if (dataRole == "datepicker") {
//                        $(this).parent().replaceWith("<span>" + this.value + "</span>");
//                    }
//                    else if (ctrltype == "radio") {
//                        var name = $(this).attr("name");
//                        if ($(this).attr("data-radioval"))
//                            $(this).closest("td").html("<span>" + $("input[name='" + name + "']:checked").attr("data-radioval") + "</span>");
//                        else
//                            $(this).attr("disabled", true);
//                    }
//                    else if (ctrltype == "checkbox" || ctrltype == "radio") {// && (this.value == "0" || this.value == "1")
//                        $(this).attr("disabled", true);
//                    }
//                    else if ($(this).attr("id").indexOf("_temp") >= 0) {
//                        $(this).replaceWith("<input type='hidden' id='" + $(this).attr("id") + "' value='" + this.value + "' />");
//                    }
//                    else {
//                        $(this).replaceWith("<span id='" + $(this).attr("id") + "'>" + this.value + "</span>");
//                    }
//                }

//            });

//            $('#' + container).find('select').each(function () {
//                $(this).replaceWith("<span>" + $("#" + $(this).attr("id") + " :selected").text() + "</span>");
//            });

//            $('#' + container).find('ul li span').each(function (i, e) {
//                $(e).removeClass();
//            });

//        }
//        else {
//            if (subProcessSNo == 2513 || subProcessSNo == 2500 || subProcessSNo == 2391) {
//                //$(".btn-success").attr("style", "width:100px;");
//                //$(".btn-primary").attr("style", "width:100px;");
//                //$(".btn-block").attr("style", "width:100px;");
//            }
//            else {
//                $(".btn-success").attr("style", "display:block;");
//                $(".btn-danger").attr("style", "display:block;");
//                $(".btn-primary").attr("style", "display:block;");
//                $(".btn-block").attr("style", "display:block;");
//                $(".btnTrans").closest("td").attr("style", "display:table-cell;");
//                $(".ui-button").closest("td").attr("style", "display:table-cell;");
//            }
//        }
//    }

//}


var RightsCheck = "";
function PagerightsCheck() {

    $.ajax({
        url: SiteUrl + "Services/Shipment/ReservationBookingService.svc/PagerightsCheck"
        //url: "Services/Shipment/ReservationBookingService.svc/PagerightsCheck"
        , async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ GroupSNo: userContext.GroupSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var GroupEdit = jQuery.parseJSON(result).Table0[0].GroupEdit;
            var GroupEdit = jQuery.parseJSON(result).Table0[0].GroupEdit;
            var GroupRead = jQuery.parseJSON(result).Table0[0].GroupRead;
            var GroupCreate = jQuery.parseJSON(result).Table0[0].GroupCreate;
            if (GroupCreate.toUpperCase() == "FALSE" && GroupRead.toUpperCase() == "TRUE") {

                RightsCheck = "READ";
            } else if (GroupCreate.toUpperCase() == "FALSE") {
                //   $("#btnNew").hide();
                // $("#btnCopyBooking").hide();
            }

        }
    });
}

// add By Sushant on 24-07-2018
var isCreate = false, IsEdit = false, IsDelete = false, IsRead = false;

function UserPageRights(apps) {

    $(userContext.PageRights).each(function (i, e) {
        if (e.Hyperlink.toUpperCase() == apps.toUpperCase()) {
            if (e.PageRight.toUpperCase() == 'New'.toUpperCase()) {
                isCreate = true;
            }
            if (e.PageRight.toUpperCase() == 'Edit'.toUpperCase()) {
                IsEdit = true;
            }
            if (e.PageRight.toUpperCase() == 'Delete'.toUpperCase()) {
                IsDelete = true;
            }
            if (e.PageRight.toUpperCase() == 'Read'.toUpperCase()) {
                IsRead = true;
            }
        }
    });

}

function UserSubProcessRightsRepalne() {
    var isView = false, IsBlocked = false;
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == 3520) {
            isView = e.IsView;
            return;
        }
    });

    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == 3520) {
            IsBlocked = e.IsBlocked;
            return;
        }
    });
    if (IsBlocked) {

    } else {
        if (isView) {
            $('#ReplanFlightDetailsTabDive').find('input, textarea, button, select').attr('disabled', 'disabled');
        }
        else {
            //$('#ReplanFlightDetailsTabDive').find('input, textarea, button, select').removeAttr('disabled');
            if (isCreate == true) {

            } else {


            }
        }

    }

}
