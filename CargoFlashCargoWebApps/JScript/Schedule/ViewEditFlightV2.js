/// <reference path="../../JScript/Schedule/VIewEditFlightV2.js" />
// <copyright file="VIewEditFlightV2.js" company="Cargoflash">
//
// Created On: 1-September-2017
// Created By: Braj
// Description:
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
//</copyright>
var url = function () { return SiteUrl + "Services/AutoCompleteService.svc/AutoCompleteDataSource"; }
var GarudaApp = angular.module("GarudaApp", ["kendo.directives"]);
var Environment = userContext.SysSetting.ICMSEnvironment;

GarudaApp.controller("GraudaController", ["$scope", "$rootScope", "$compile", "$http", "$window", "$timeout",
    function ($scope, $rootScope, $compile, $http, $window, $timeout) {
        $scope.Environment = Environment.toUpperCase();
        $scope.KKLLPopUp = (userContext.SysSetting.BookedExecutedShipmentsPopUp.toUpperCase() || '') == "TRUE";        
        $scope.SegmentBookingOpenClose = userContext.SysSetting.SegmentBookingOpenClose.toUpperCase() == "TRUE";
        var garuda = this;
        var GFormat = '{0:0.00}';
        var VFormat = '{0:0.000}';
        $scope.SearchBy = '1';
        $scope.IsEdit = 1;
        $scope.IsApply = false;
        $scope.IsApplyHide = true;
        $scope.IsUpdateFlight = true;
        $scope.IsSecCapPrompt = false;
		$scope.maxDate = new Date(new Date().getUTCFullYear() + 1, 0, new Date().getMonth());  //new Date(2019, 0, 1, 0, 0, 0);
        $scope.minScheduleDate;
        //$scope.minDate = new Date();
        $scope.CAO = "2";
        $scope.currentDate = kendo.toString(new Date(), 'dd-MMM-yyyy');
        $scope.Airports = "";
        $scope.Airlines = "";
        $scope.GetAirport = function () {
            $.ajax({
                type: "POST",
                url: "../schedule/GetAirports",
                data: { __RequestVerificationToken: angular.element('input[name= __RequestVerificationToken]').val() },
                success: function (result) {
                    var d = JSON.parse(result);
                    if (d.length > 0)
                    {
                        if (d[0].IsAll == "0")
                            $scope.Airports = d[0].Airports.TrimRight();
                        else
                            $scope.Airports = '';
                        if (d[0].IsAllAirlines == "0")
                            $scope.Airlines = d[0].Airlines.TrimRight();
                        else
                            $scope.Airlines = '';
                    }
                }
            });
        }

        $scope.ResetSearch = function (flag) {
            $scope.SearchRequest.Origin = '';
            $scope.SearchRequest.Destination = '';
            $scope.SearchRequest.FlightNo = '';
            $scope.IsSecCapPrompt = false;
            $scope.SearchInfoShow = true;
            if ($scope.FlightSearchGridOptions.dataSource._data.length == 0 && $scope.SearchBy == '1')
                $scope.SearchInfoShow = false;
            if ($scope.FlightSearchO_DGridOptions.dataSource._data.length == 0 && !flag && $scope.SearchBy == '0')
                $scope.SearchInfoShow = false;

        }

        $scope.VTime = function (item, field, items) {
            var tm = item[field].replace(/[a-zA-Z-!@&\/\\#,+()$~%.'":*?<>{}]/g, '');
            var HH = tm.slice(0, 2);
            var SS = tm.slice(2, 4);
            if (HH > Number(24))
                HH = "00"
            if (Number(SS) > 59)
                SS = "00";

            tm = HH.length > 1 ? HH + ':' + SS : HH;
            item[field] = tm.slice(0, 5);
            if (items)
                validDayDiff(item, field, items);
        }

        function validDayDiff(item, field, items) {

            items.forEach(function (i) { setDaysDiff(i, items); });

        }

        function setDaysDiff(item, items) {

            var pidx = items.indexOf(item);
            if (pidx > 0) {
                pitem = items[pidx - 1];
                var pETA = kendo.parseDate(pitem.ScheduleDate + ' ' + kendo.toString(pitem.ETA, 'HH:mm'), 'dd-MMM-yyyy HH:mm', 'en-US').addDays(pitem.ArrDayDiff);
                var cETD = kendo.parseDate(item.ScheduleDate + ' ' + kendo.toString(item.ETD, 'HH:mm'), 'dd-MMM-yyyy HH:mm', 'en-US').addDays(pitem.ArrDayDiff);

                if (pETA.getTime() >= cETD.getTime()) {
                    cETD = cETD.addDays(1);
                }

                var daydiff = parseInt(pitem.ArrDayDiff) + getDayDiff(pETA, cETD);
                item.DayDiff = daydiff.toString();
                item.FlightDate = kendo.toString(cETD, 'dd-MMM-yyyy');
            }


            var ETD = LocalUTC(item.FlightDate + ' ' + item.ETD, item.OriginOffset, true);
            var ETA = LocalUTC(item.FlightDate + ' ' + item.ETA, item.DestOffset, true);
            ETA = kendo.parseDate(kendo.toString(ETD, 'dd-MMM-yyyy') + ' ' + kendo.toString(ETA, 'HH:mm'), 'dd-MMM-yyyy HH:mm', 'en-US');

            console.log(ETD);
            console.log(ETA);

            if (ETD.getTime() >= ETA.getTime())
                ETA = ETA.addDays(1);
            var hrs = parseInt(Math.abs(ETA - ETD) / (1000 * 60 * 60));
            var min = parseInt(Math.abs(ETA.getTime() - ETD.getTime()) / (1000 * 60) % 60);

            item.FlyTime = "Flying Time: " + (hrs > 0 ? hrs + " Hr" : "") + ((hrs > 0 && min > 0) ? " : " : "") + (min > 0 ? min + " Min" : "");

            console.log("Flying Time: " + item.FlyTime);
            ETD = LocalUTC(ETD, item.OriginOffset, false);
            ETA = LocalUTC(ETA, item.DestOffset, false);

            console.log("After");
            console.log(ETD);
            console.log(ETA);
            var day = parseInt(item.DayDiff) + getDayDiff(ETD, ETA);
            item.ArrDayDiff = day.toString();

            console.log(day);

            var idx = items.indexOf(item);
            if (items[idx + 1] != undefined) {
                nItem = items[idx + 1];

                var cETA = kendo.parseDate(item.ScheduleDate + ' ' + kendo.toString(item.ETA, 'HH:mm'), 'dd-MMM-yyyy HH:mm', 'en-US').addDays(item.ArrDayDiff);
                var nETD = kendo.parseDate(nItem.ScheduleDate + ' ' + kendo.toString(nItem.ETD, 'HH:mm'), 'dd-MMM-yyyy HH:mm', 'en-US').addDays(item.ArrDayDiff);

                if (cETA.getTime() > nETD.getTime()) {
                    nETD = nETD.addDays(1);
                }

                var daydiff = parseInt(item.ArrDayDiff) + getDayDiff(cETA, nETD);
                nItem.DayDiff = daydiff.toString();
                nItem.FlightDate = kendo.toString(nETD, 'dd-MMM-yyyy');

            }

        }

        $scope.DateChanged = function () {
            var date = new Date($scope.SearchRequest.FlightDate);
            if (date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
                $scope.SearchRequest.FlightDate = '';
        }

        $scope.FlightSearchGridOptions = {
            autoBind: false, dataSource: new kendo.data.DataSource({
                schema: {
                    model: {
                        id: "SNo",
                        fields: {
                            IsDom: { type: "boolean" }
                        }
                    }
                }
            }),
            columns: [

                { field: "FlightNo", title: "Flight No", width: "70px" },
                { field: "Board", title: "Brd Pt", width: 50 },
                { field: "Off", title: "Off Pt", width: "50px", },
                { field: "LocalETD", title: "ETD", width: 110 },
                { field: "ETDGMT", title: "ETD GMT", width: 110 },
                { field: "LocalETA", title: "ETA", width: 110 },
                { field: "ETAGMT", title: "ETA GMT", width: 110 },
                { field: "LocalSTD", title: "STD", width: 110 },
                { field: "STDGMT", title: "STD GMT", width: 110 },
                { field: "LocalSTA", title: "STA", width: 110 },
                { field: "STAGMT", title: "STA GMT", width: 110 },
                //{ template: "#=DepDate +' '+ETD#", title: "ETD", width: 110 },
                //{ field: "ETDGMT", title: "ETD GMT", width: 110 },
                //{ template: "#=ArrDate +' '+ETA#", title: "ETA", width: 110 },
                //{ field: "ETAGMT", title: "ETA GMT", width: 110 },
                //{ template: "#=DepDate +' '+STD#", title: "STD", width: 110 },

                //{ field: "STD", title: "STD", width: 70 },
                //{ field: "ArrDate", title: "Arr Date", width: 80 },
                //{ field: "STA", title: "STA", width: 70 },
                //{ field: "STDGMT", title: "STD GMT", width: 110 },
                //{ template: "#=ArrDate +' '+STA#", title: "STA", width: 110 },
                //{ field: "STAGMT", title: "STA GMT", width: 110 },

                { template: BindcheckBox('IsDom'), title: "DOM", width: 40 },
                { title: "Tech", width: 40 },
                //{ title: "Op. Carrier" },
                //{ title: "Op. Flt" },
                //{ title: "Call Sign" },
                //{ title: "Dep Terminal" },
                //{ title: "Dep Bay" },
                //{ title: "Arr Terminal" },
                //{ title: "Arr Bay" },
                { field: 'DepStatus', title: "Dep Status" },
                { field: 'ArrStatus', title: "Arr Status"},
            ]
        };

        $scope.FlightSearchGridOptionsTooltip = {
            filter: "tbody tr:not(.k-grouping-row):not(.k-footer-template) td:not(.k-group-cell):not(:empty):not(:has(div)):not(:has(span:empty))",
            content: function (e) {
                var target = e.target;
                return $(target).text();

            }
        };

        //$scope.FlightSearchGridOptions = searchgridoptions;
        $scope.FlightSearchO_DGridOptions = {
            autoBind: false, dataSource: new kendo.data.DataSource({
                type: "json",
                serverPaging: true,
                serverSorting: true,
                pageSize: 12,
                transport: {
                    read: {
                        url: "../Schedule/SearchFlightDetails",
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
                        id: "SNo",
                        fields: {
                            IsDom: { type: "boolean" }
                        }
                    }, data: function (data) {
                        $scope.SearchInfoShow = true;
                        if (data)
                            return data.Table0;
                    }, total: function (data) {
                        if (data && data.Table0 && data.Table0.length > 0)
                            return data.Table0[0].RC;
                        else
                            return 0;
                    }
                }
            }),
            pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false },
            columns: [
                { template: '#=IsLinkBtn=="1"?\'<input type="button" class="btn-info" ng-click="SelectFlight(dataItem)" value="\'+FlightNo+\'">\':FlightNo#', title: "Flight No", width: 90 },
                { field: "Board", title: "Brd Pt", width: 50 },
                { field: "Off", title: "Off Pt", width: "50px", },
                { field: "DepDate", title: "Dep Date", width: 80 },
                { field: "STD", title: "STD", width: 70 },
                { field: "ArrDate", title: "Arr Date", width: 80 },
                { field: "STA", title: "STA", width: 70 },
                {
                    headerTemplate: "<span class='hcap'>Used Capacity</span>",
                    columns: [{ field: "DisplayUsedGrossWeight", title: "Gross", width: 75, attributes: { class: "#=setcolor(data.DisplayUsedGrossWeight)#" } },
                    { field: "DisplayUsedVolume", title: "Volume", width: 70, attributes: { class: "#=setcolor(data.DisplayUsedVolume)#" } }]
                },
                {
                    headerTemplate: "<span class='hcap'>Remaining Capacity</span>",
                    columns: [{ field: "RemainingGross", title: "Gross", width: 75, attributes: { class: "#=setcolor(data.RemainingGross)#" } },
                    { field: "RemainingVolume", title: "Volume", width: 70, attributes: { class: "#=setcolor(data.RemainingVolume)#" } }]
                },
                { template: BindcheckBox('IsDom'), title: "DOM", width: 40 },
                { title: "Tech", width: 40 },
                { headerTemplate: "Op.<br>Carrier" },
                { headerTemplate: "Op.<br>Flt" },
                { headerTemplate: "Call<br>Sign" },
                { headerTemplate: "Dep<br>Terminal" },
                { title: "Dep Bay" },
                { headerTemplate: "Arr<br>Terminal" },
                { title: "Arr Bay" },
                { field: 'DepStatus', headerTemplate: "Dep<br>Status" },
                { field: 'ArrStatus', headerTemplate: "Arr<br>Status" },
            ]
        };

        var historyRequest = function () {
            return {
                dfSNo: $.map($scope.SegmentGridOptions.dataSource._data.toJSON(), function (i) {
                    return i.SNo;
                }),
                FlightNo: '',
                FlightDate: ''
            };
        }

        $scope.ViewHistory = function () {
            $window.oldModel = null;
            $window.prevColors = [];
            $scope.historyWin.options.width = window.innerWidth;
            $scope.historyWin.open();
            $scope.historyWin.center();
            $scope.HistoryGridOptions.dataSource.read();
        }

        $scope.HistoryGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                type: "json",
                transport: {
                    read: {
                        url: "../schedule/viewhistory",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json", type: "post", global: false, data: historyRequest
                    },
                    parameterMap: function (options) {
                        if (options.filter == undefined)
                            options.filter = null;
                        if (options.sort == undefined)
                            options.sort = null;
                        return JSON.stringify(options);
                    },
                },
                schema: {
                    model: {
                        fields: {
                            sector: { type: "string" },
                            UpdatedOn: { type: "date" },
                            OverCBM: { type: "number" },
                            //Volume: { type: "number" },
                            //UnitsInStock: { type: "number" }
                        }
                    },
                    data: function (data) {
                        $scope.OperationHistoryGridOptions.dataSource.transport.data = data.Table1;
                        $scope.OperationHistoryGridOptions.dataSource.read();
                        $scope.ReRouteHistoryGridOptions.dataSource.transport.data = data.Table2;
                        $scope.ReRouteHistoryGridOptions.dataSource.read();
                        return data.Table0;// JSON.parse();
                    }

                },
                sort: {
                    field: "UpdatedOn",
                    dir: "desc"
                },
                group: {
                    field: "Sector", aggregates: [
                        { field: "Sector", aggregate: "count" },
                        //{ field: "UpdatedOn", aggregate: "max" },
                        //{ field: "Volume", aggregate: "sum" },
                        //{ field: "UnitsOnOrder", aggregate: "average" },

                    ]

                },
                aggregate: [{ field: "Sector", aggregate: "count" },
                    //{ field: "UpdatedOn", aggregate: "max" },
                    //{ field: "Volume", aggregate: "sum" },
                    //{ field: "UnitsOnOrder", aggregate: "average" },
                    //{ field: "UnitsInStock", aggregate: "min" },
                    //{ field: "UnitsInStock", aggregate: "max" }
                ]

            }),
            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);
                var grid = this;
                var preModel = null;
                grid.table.find('tr').each(function (i) {
                    var model = grid.dataItem(this);

                    if ($(this).find('td').length > 5) {
                        var model = grid.dataItem(this);
                        if (preModel != null) {


                        }
                        preModel = model.toJSON();

                    } else
                        preModel = null;


                });


            },
            width: 1024,
            columns: [
                {
                    field: "Sector", title: "Sector", aggregates: ["count"], hidden: true,
                    groupHeaderTemplate: "Sector: #= value # (Total: #= count#)   Legend<span class='lgd'><lable class='fa greenl'>Recent Update</lable><lable class='fa redl'>Earlier Update</lable></span>"
                },
                {
                    headerTemplate: "<span class='hcap'>Actual Capacity</span>",
                    columns: [{ field: "GrossWeight", title: "Gross", width: 75, attributes: { class: "#=setStatus(data,'GrossWeight')#" } },
                    {
                        field: "Volume", spinner: true, title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'Volume')#" },
                    }]
                },
                {
                    headerTemplate: "<span class='hcap'>Free Sale Capacity</span>",
                    columns: [{ field: "FreeSaleGross", title: "Gross", width: 75, attributes: { class: "#=setStatus(data,'FreeSaleGross')#" } },
                    {
                        field: "FreeSaleCBM", spinner: true, title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'FreeSaleCBM')#" },
                    }]
                }
                , {

                    headerTemplate: "<span class='hcap'>Reserved Capacity</span>",
                    columns: [{ field: "ResGross", title: "Gross", width: 75, attributes: { class: "#=setStatus(data,'ResGross')#" } },
                    { field: "ResCBM", spinner: true, title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'ResCBM')#" } }, ]
                }
                , {

                    headerTemplate: "<span class='hcap'>Over Booked Capacity</span>",
                    columns: [{ field: "OverGross", title: "Gross", width: 75, attributes: { class: "#=setStatus(data,'OverGross')#" } },
                    { field: "OverCBM", spinner: true, title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'OverCBM')#" } }, ]
                }, {

                    headerTemplate: "<span class='hcap'>Allocated Weight</span>",
                    columns: [{ field: "AllocatedGross", title: "Gross", width: 70, attributes: { class: "#=setStatus(data,'AllocatedGross')#" } },
                    { field: "AllocatedVolume", title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'AllocatedVolume')#" } }, ]
                },
                {
                    headerTemplate: "<span class='hcap'>Max Gross Vol Per Pcs</span>",
                    columns: [{ field: "MaxGrossPerPcs", title: "Gross", width: 70, attributes: { class: "#=setStatus(data,'MaxGrossPerPcs')#" } },
                    { field: "MaxVolumePerPcs", title: "Volume", width: 70, attributes: { class: "#=setStatus(data,'MaxVolumePerPcs')#" } }, ]
                },
                {
                    headerTemplate: "<span class='hcap'>Flight Information</span>",
                    columns: [
                        { field: "AircraftType", title: "Aircraft Type", width: 110 },
                        { field: "ACRegNo", title: "A/C Reg. No", width: 70 },
                        { field: "FlightTypeName", title: "Flight Type", width: 80 },
                        { field: "ETD", title: "ETD", width: 50 },
                        { field: "ETA", title: "ETA", width: 50 },
                        { template: BindcheckBox('IsCancelled'), title: "Cancelled", width: 70 },
                        { template: BindcheckBox('IsDelay'), title: "Delay", width: 50 },
                        { template: BindcheckBox('IsCAO'), title: "CAO", width: 50 },
                        { template: BindcheckBox('IsBuildup'), title: "Buildup", width: 50 },
                        { template: BindcheckBox('IsLoadingInstruction'), title: "LI", width: 35 },
                        { template: BindcheckBox('IsManifested'), title: "MAN", width: 45 },
                        { template: BindcheckBox('IsDeparted'), title: "DEP", width: 40 },
                        { template: BindcheckBox('IsReRoute'), title: "Re-Route", width: 70 }
                    ]
                },
                { template: BindcheckBox('IsBookingClosed'), headerTemplate: "Booking<br>Closed", width: 60 },
                {
                    field: "UpdatedOn", format: "{0: dd-MMM-yyyy HH:mm:ss}", title: "Updated On", width: 140
                },
                {
                    field: "UpdatedBy", title: "Updated By", width: 100
                },
                {
                    //field: "MessageType", title: "Message Type", width: 140
                    
                    template: '<a href ng-click="MessageTypePopUp(\'#=data.MessageType#\')">#=(data.MessageType.length>0? data.MessageType.split("_")[0]+"-"+data.MessageType.split("_")[1]:"")#',
                        title: "Message Type", width: 85
                },

                {
                    field: "Remarks", title: "Remarks", width: 140
                },




            ]

        };
        $scope.opHistoryData = [];
        $scope.OperationHistoryGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                //data: function () { return $scope.opHistoryData },
                type: "json",
                schema: {
                    model: {
                        fields: {
                            sector: { type: "string" },
                            EventDateTime: { type: "date" },
                        }
                    }
                },
                sort: {
                    field: "EventDateTime",
                    dir: "desc"
                },
                group: {
                    field: "Sector", aggregates: [
                        { field: "Sector", aggregate: "count" },
                    ]

                },
                aggregate: [{ field: "Sector", aggregate: "count" },
                ]

            }),
            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);
            },
            width: 1024,
            columns: [
                {
                    field: "Sector", title: "Sector", aggregates: ["count"], hidden: true,
                    groupHeaderTemplate: "<span class='hcap'> Flight Station: #= value #</span> (Total: #= count#)"
                },

                { field: "StageName", headerTemplate: "Flight Stage", width: 120 },
                { field: "FlightDate", headerTemplate: "Flight Date", width: 100 },
                { field: "WaybillCount", headerTemplate: "AWB<br>Count", width: 50 },
                { field: "ULDCount", headerTemplate: "ULD<br>Count", width: 50 },
                { field: "MessageType", headerTemplate: "Message Type", width: 100 },
                { field: "GrossWeight", headerTemplate: "Gross Wt.", width: 70 },
                { field: "VolumeWeight", headerTemplate: "Volume Wt.", width: 80 },
                { field: "CBM", headerTemplate: "CBM", width: 70 },
                { template: "#=EventDetails#", headerTemplate: "Event Details", width: 300 },
                {
                    field: "EventDateTime", format: "{0: dd-MMM-yyyy HH:mm:ss}", title: "Event Date/Time", width: 140
                },
                {
                    field: "UserName", title: "Updated By", width: 100
                }

            ]

        };

        $scope.ReRouteHistoryGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource(),
            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);
            },
            columns: [
                { field: "Route", title: "Route" },
                { field: "UpdatedBy", title: "Created By" },
                { field: "UpdatedOn", title: "Created On" }
            ]
        };

        $scope.HistoryGridOptionsTooltip = {
            filter: "tbody tr:not(.k-grouping-row):not(.k-footer-template) td:not(.k-group-cell):not(:empty):not(:has(div)):not(:has(span:empty))",
            content: function (e) {
                var target = e.target;
                return $(target).text();

            }
        }
        $scope.OperationHistoryGridOptionsTooltip = {
            filter: "tbody tr:not(.k-grouping-row):not(.k-footer-template) td:not(.k-group-cell):not(:empty):not(:has(div)):not(:has(span:empty))",
            content: function (e) {
                var target = e.target;
                return $(target).text();

            }
        }
        $scope.ReRouteHistoryGridOptionsTooltip = {
            filter: "tbody tr:not(.k-grouping-row):not(.k-footer-template) td:not(.k-group-cell):not(:empty):not(:has(div)):not(:has(span:empty))",
            content: function (e) {
                var target = e.target;
                return $(target).text();

            }
        }

        var isUpdate = true;

        $scope.CommonColumns = [
            {
                headerTemplate: "<span class='hcap'>Total Capacity</span>",
                columns: [{ field: "TotalGross", format: GFormat, title: "Gross", width: 63 },
                {
                    field: "TotalVol", format: VFormat, title: "Volume", width: 60
                }, ]
            },
            {
                headerTemplate: "<span class='hcap'>Actual Capacity</span>",
                columns: [{ field: "GrossWeight", format: GFormat, title: "Gross", width: 63 },
                { field: "VolumeWeight", format: VFormat, spinner: true, title: "Volume", width: 60 }, ]
            },
            {

                headerTemplate: "<span class='hcap'>Free Sale Capacity</span>",
                columns: [{ field: "FreeSaleCapacity", format: GFormat, title: "Gross", width: 65 },
                {
                    field: "FreeSaleCapacityVolume", format: VFormat, spinner: true, title: "Volume", width: 65
                }, ]
            }
            , {

                headerTemplate: "<span class='hcap'>Reserved Capacity</span>",
                columns: [{ field: "ReservedCapacityGrosswt", format: GFormat, title: "Gross", width: 65 },
                {
                    field: "ReservedCapacityVolwt", format: VFormat, spinner: true, title: "Volume", width: 65
                }, ]
            }
            , {

                headerTemplate: "<span class='hcap'>Over Booked Capacity</span>",
                columns: [{ field: "OverBookingCapacity", format: GFormat, title: "Gross", width: 65 },
                {
                    field: "OverBookingCapacityVolume", format: VFormat, spinner: true, title: "Volume", width: 65
                }, ]
            },

            {
                field: 'CommercialCapacity', title: "Commercial<br>Capacity", width: 65
            }, {

                headerTemplate: "<span class='hcap'>Actual Used Capacity</span>",
                columns: [{
                    template: '#=parseFloat(ActUsedGrossWeight)>0?\'<input type="button" class="btn-info" ng-click="OpenPopUp(dataItem,\\\'FS\\\')" value="\'+ActUsedGrossWeight+\'">\':ActUsedGrossWeight#',
                    title: "Gross", width: 85
                },
                {
                    template: '#=parseFloat(ActUsedVolume)>0?\'<input type="button" class="btn-info" ng-click="OpenPopUp(dataItem,\\\'FS\\\')" value="\'+ActUsedVolume+\'">\':ActUsedVolume#',
                    title: "Volume", width: 60
                }]
            }
            , {

                headerTemplate: "Used Capacity",
                columns: [{ field: "DisplayUsedGrossWeight", title: "Gross", width: 65 },
                {
                    field: "DisplayUsedVolume", title: "Volume", width: 45
                }, ]
            }

            , {

                headerTemplate: "Remaining Capacity",
                columns: [{ field: "RemainingGrosswt", title: "Gross", width: 65 },
                {
                    field: "RemainingVolwt", title: "Volume", width: 50
                }, ]
            }
            , {

                headerTemplate: "Allocated Weight",
                columns: [{ field: "AllocatedGross", title: "Gross", width: 65 },
                {
                    field: "AllocatedVolume", title: "Volume", width: 50
                }, ]
            }
            , {

                headerTemplate: "Released Weight",
                columns: [{ field: "ReleasedGrossWt", title: "Gross", width: 65 },
                {
                    field: "ReleasedVolumeWt", title: "Volume", width: 50
                }, ]
            }
        ];


        var gMsg = "Gross weight is required";
        var VMsg = "Volume weight is required";
        $scope.LegGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                batch: true,
                schema: {
                    model: {
                        id: "SNo",
                        fields: {
                            Board: { editable: false }, Off: { editable: false },
                            ValidFrom: { type: 'date', validation: { required: true }, editable: false },
                            ValidTo: { type: 'date', validation: { required: true } },
                            AircraftType: { type: 'string', validation: { required: true, } },
                            ACRegNo: { editable: true },
                            CommercialCapacity: { editable: false },
                            DisplayUsedGrossWeight: { editable: false },
                            DisplayUsedVolume: { editable: false },
                            //UsedVolume: { editable: false },
                            ReleasedGrossWt: { editable: false },
                            AllocatedGross: { editable: false },
                            //UsedGrossWeight: { editable: false },
                            AllocatedVolume: { editable: false },
                            ReleasedVolumeWt: { editable: false },
                            RemainingGrosswt: { editable: false },
                            RemainingVolwt: { editable: false },
                            StructuralCapacity: { editable: false },
                            //AllotmentType: { validation: { required: true } },
                            //OfficeName: { type: 'string' },
                            FreeSaleCapacity: { type: "number", validation: { required: { message: gMsg }, min: 0 } },
                            FreeSaleCapacityVolume: { type: "number", validation: { required: { message: VMsg }, min: 0 } },
                            ReservedCapacityGrosswt: { type: "number", validation: { required: { message: gMsg }, min: 1 } },
                            ReservedCapacityVolwt: { type: "number", validation: { required: { message: VMsg }, min: 0.001 } },
                            GrossWeight: { editable: (userContext.SpecialRights.TOTALCAPACITY ? userContext.SpecialRights.TOTALCAPACITY : false), type: "number", validation: { required: { message: gMsg }, min: 1 } },
                            VolumeWeight: { editable: (userContext.SpecialRights.TOTALCAPACITY ? userContext.SpecialRights.TOTALCAPACITY : false), type: "number", validation: { required: { message: VMsg }, min: 0.001 } },
                            TotalGross: { editable: false, type: "number", validation: { required: { message: gMsg }, min: 1 } },
                            TotalVol: { editable: false, type: "number", validation: { required: { message: VMsg }, min: 0.001 } },
                            OverBookingCapacity: { type: "number", validation: { required: { message: gMsg }, min: 1 } },
                            OverBookingCapacityVolume: { type: "number", validation: { required: { message: VMsg }, min: 0.001 } },
                        }
                    }
                }
            }),
            //edit: function (e) {
            //    //var columnIndex = this.cellIndex(e.container);
            //    //var fieldName = this.thead.find("th").eq(columnIndex).data("field");

            //    //if (!isEditable(fieldName, e.model)) {
            //    //e.preventDefault();
            //},
            save: function (e) {

                if (this.columns[this.cellIndex(e.container)].field != 'AircraftType') {

                    var TFieldName = this.columns[this.cellIndex(e.container)].field;
                    TFieldName = TFieldName != undefined ? TFieldName.toLowerCase() : "";
                    var data = [];
                    var field = Object.keys(e.values)[0];
                    var value = e.values[Object.keys(e.values)[0]];                   
                    if (field == "ValidTo" && e.model.ValidTo != value)
                    {
                        $.when(ConfirmAlert('\'Valid To\' date would be amended in Movement Tab as well. Do you wish to Continue ?')).then(function (confirmed) {
                            if (confirmed) {
                                e.model.set('ValidTo', value);
                                e.model.set('OldValidTo',value);
                            }
                        });
                            e.preventDefault();
                            return false
                    }
                    

                    /*-------------- Start  Capacity Distribution Prompt ------------*/
                    if (field == 'FreeSaleCapacity' || field == 'FreeSaleCapacityVolume' || field == 'ReservedCapacityGrosswt' || field == 'ReservedCapacityVolwt' || field == 'GrossWeight' || field == 'VolumeWeight') {
                        $.when($scope.IsSectorCapDistribution && !$scope.IsSecCapPrompt && ConfirmAlert('In case you wish to change the capacity, distributed capacity on respective sectors would now be marked as NULL/Blank. Do you wish to continue with Amendments ?')).then(function (confirmed) {
                            if (confirmed) {
                                ShowMessage('info', 'Information!', "Kindly Proceed with Amendments.");
                                $scope.IsSecCapPrompt = true
                            }
                        });

                        if ($scope.IsSectorCapDistribution && !$scope.IsSecCapPrompt) {
                            e.preventDefault();
                            return false
                        }
                    }
                    /*-------------- END  Capacity Distribution Prompt ------------*/

                    var vaildFrom = new Date(e.model.ValidFrom);
                    var validTo = value;

                    if (TFieldName == "validto" && field == 'ValidTo' && $scope.Environment == 'JT' && vaildFrom < validTo) {
                        e.model.set('All', true, null, true);
                        $scope.CheckAll(e.model);
                        $scope.CheckFlightDateRange(e,e.model,0)//(e.model.FlightNo, e.model.ValidFrom, value, e.model.Board, e.model.Off);
                    }

                    else if (TFieldName == "validto" && field == 'ValidTo' && vaildFrom > validTo) {
                        ShowMessage('warning', 'Warning!', "Valid To Date can not be less than Valid From Date.");
                        e.preventDefault();
                        return false;
                    }

                    if (isUpdate) {
                        isUpdate = false;
                        var capOutput = true;
                        if (field == 'FreeSaleCapacity') {
                            if ((parseFloat(e.model['GrossWeight']) - parseFloat(e.model.AllocatedGross)) >= parseFloat(value))
                                capOutput = CapacityCal(e, 'GrossWeight', 'ReservedCapacityGrosswt', value, data);
                            else {
                                e.preventDefault();
                                isUpdate = true;
                                return false;
                            }

                        } else if (field == 'ReservedCapacityGrosswt') {
                            if (value >= parseFloat(e.model.AllocatedGross))
                                capOutput = CapacityCal(e, 'GrossWeight', 'FreeSaleCapacity', value, data);
                            else {
                                e.preventDefault();
                                isUpdate = true;
                                return false;
                            }
                        } else if (field == 'ReservedCapacityVolwt') {
                            if (value >= parseFloat(e.model.AllocatedVolume))
                                capOutput = CapacityCal(e, 'VolumeWeight', 'FreeSaleCapacityVolume', value, data);
                            else {
                                e.preventDefault();
                                isUpdate = true;
                                return false;
                            }
                        } else if (field == 'FreeSaleCapacityVolume') {
                            if ((parseFloat(e.model['VolumeWeight']) - parseFloat(e.model.AllocatedVolume)) >= parseFloat(value))
                                capOutput = CapacityCal(e, 'VolumeWeight', 'ReservedCapacityVolwt', value, data);
                            else {
                                e.preventDefault();
                                isUpdate = true;
                                return false;
                            }
                        } else if (field == 'VolumeWeight') {

                            if ($scope.IsImpactAllCap) {
                                var FreeVol = ((parseFloat(e.model.FreeSaleVolP) * parseFloat(value)) / 100);
                                var overbookVol = ((parseFloat(e.model.OverbookVolP) * parseFloat(value)) / 100);

                                if (((parseFloat(value) + overbookVol) * parseFloat(userContext.SysSetting.CalculateCBM)) > parseFloat(e.model.StructuralCapacity)) {
                                    e.preventDefault();
                                    isUpdate = true;
                                    return false;
                                }

                                var reserveCap = parseFloat(value) - FreeVol;
                                if (reserveCap >= parseFloat(e.model.AllocatedVolume)) {

                                } else if (parseFloat(e.model.AllocatedVolume) > 0 && (FreeVol + reserveCap) >= parseFloat(e.model.AllocatedVolume)) {
                                    FreeVol = FreeVol + reserveCap - parseFloat(e.model.AllocatedVolume);
                                    reserveCap = parseFloat(e.model.AllocatedVolume);
                                } else {
                                    e.preventDefault();
                                    isUpdate = true;
                                    return false;
                                }

                                e.model.set('ReservedCapacityVolwt', reserveCap);
                                e.model.set('FreeSaleCapacityVolume', FreeVol);
                                e.model.set('OverBookingCapacityVolume', overbookVol);
                                e.model.set('TotalVol', parseFloat(value) + overbookVol, null, true);

                                data.push({ Key: 'ReservedCapacityVolwt', Value: (parseFloat(value) - FreeVol) });
                                data.push({ Key: 'FreeSaleCapacityVolume', Value: (FreeVol) });
                                data.push({ Key: 'OverBookingCapacityVolume', Value: overbookVol });
                                data.push({ Key: 'TotalVol', Value: parseFloat(value) + overbookVol });
                            } else {
                                var reservol = parseFloat(e.model.ReservedCapacityVolwt)
                                var ttVol = parseFloat(value) + parseFloat(e.model.OverBookingCapacityVolume);
                                if (reservol <= parseFloat(value) && (ttVol * parseFloat(userContext.SysSetting.CalculateCBM)) <= parseFloat(e.model.StructuralCapacity)) {
                                    e.model.set('FreeSaleCapacityVolume', parseFloat(value) - reservol);
                                    e.model.set('TotalVol', ttVol, null, true);
                                    data.push({ Key: 'FreeSaleCapacityVolume', Value: parseFloat(value) - reservol });
                                    data.push({ Key: 'TotalVol', Value: ttVol });
                                } else {
                                    e.preventDefault();
                                    isUpdate = true;
                                    return false;
                                }
                            }

                        } else if (field == 'GrossWeight') {
                            if ($scope.IsImpactAllCap) {
                                var FreeGross = ((parseFloat(e.model.FreeSaleGrossP) * parseFloat(value)) / 100);
                                var overbookGross = ((parseFloat(e.model.OverbookGrossP) * parseFloat(value)) / 100);

                                if ((parseFloat(value) + overbookGross) > parseFloat(e.model.StructuralCapacity)) {
                                    e.preventDefault();
                                    isUpdate = true;
                                    return false;
                                }

                                var reserveCap = parseFloat(value) - FreeGross;
                                if (reserveCap >= parseFloat(e.model.AllocatedGross)) {

                                } else if (parseFloat(e.model.AllocatedGross) > 0 && (FreeGross + reserveCap) >= parseFloat(e.model.AllocatedGross)) {
                                    FreeGross = FreeGross + reserveCap - parseFloat(e.model.AllocatedGross);
                                    reserveCap = parseFloat(e.model.AllocatedGross);
                                } else {
                                    e.preventDefault();
                                    isUpdate = true;
                                    return false;
                                }

                                e.model.set('FreeSaleCapacity', FreeGross);
                                e.model.set('ReservedCapacityGrosswt', reserveCap);
                                e.model.set('TotalGross', parseFloat(value) + overbookGross, null, true);
                                e.model.set('OverBookingCapacity', overbookGross);

                                data.push({ Key: 'TotalGross', Value: parseFloat(value) + overbookGross });
                                data.push({ Key: 'FreeSaleCapacity', Value: FreeGross });
                                data.push({ Key: 'ReservedCapacityGrosswt', Value: (parseFloat(value) - FreeGross) });
                                data.push({ Key: 'OverBookingCapacity', Value: overbookGross });
                            } else {
                                var reserGross = parseFloat(e.model.ReservedCapacityGrosswt)
                                var ttGross = parseFloat(value) + parseFloat(e.model.OverBookingCapacity);
                                if (reserGross <= parseFloat(value) && ttGross <= parseFloat(e.model.StructuralCapacity)) {
                                    e.model.set('FreeSaleCapacity', parseFloat(value) - reserGross);
                                    e.model.set('TotalGross', ttGross, null, true);
                                    data.push({ Key: 'FreeSaleCapacity', Value: parseFloat(value) - reserGross });
                                    data.push({ Key: 'TotalGross', Value: ttGross });
                                } else {
                                    e.preventDefault();
                                    isUpdate = true;
                                    return false;
                                }
                            }

                        } else if (field == 'OverBookingCapacity') {

                            var grossTotal = parseFloat(e.model['GrossWeight']) + parseFloat(value);
                            if (grossTotal > parseFloat(e.model.StructuralCapacity)) {
                                e.preventDefault();
                                isUpdate = true;
                                return false;
                            }
                            e.model.set('TotalGross', grossTotal, null, true);
                            data.push({ Key: 'TotalGross', Value: grossTotal });

                        } else if (field == 'OverBookingCapacityVolume') {

                            var grossVol = parseFloat(e.model['VolumeWeight']) + parseFloat(value);

                            if ((grossVol * parseFloat(userContext.SysSetting.CalculateCBM)) > parseFloat(e.model.StructuralCapacity)) {
                                e.preventDefault();
                                isUpdate = true;
                                return false;
                            }
                            e.model.set('TotalVol', grossVol, null, true);
                            data.push({ Key: 'TotalVol', Value: grossVol });

                        }// else if (field == 'TotalGross') {
                        //    var overbookGross = ((parseFloat(e.model.OverbookGrossP) * parseFloat(value)) / 100);
                        //    var AGross = parseFloat(value) - parseFloat(overbookGross);
                        //    var FreeGross = ((parseFloat(e.model.FreeSaleGrossP) * parseFloat(AGross)) / 100);
                        //    e.model.set('GrossWeight', AGross);
                        //    e.model.set('FreeSaleCapacity', FreeGross);
                        //    e.model.set('ReservedCapacityGrosswt', (parseFloat(AGross) - FreeGross));
                        //    e.model.set('OverBookingCapacity', overbookGross);
                        //    data.push({ Key: 'FreeSaleCapacity', Value: FreeGross });
                        //    data.push({ Key: 'ReservedCapacityGrosswt', Value: (parseFloat(AGross) - FreeGross) });
                        //    data.push({ Key: 'TotalGross', Value: value });
                        //    data.push({ Key: 'OverBookingCapacity', Value: overbookGross });
                        //} else if (field == 'TotalVol') {
                        //    var overbookVol = ((parseFloat(e.model.OverbookVolP) * parseFloat(value)) / 100);
                        //    var AVol = parseFloat(value) - parseFloat(overbookVol);
                        //    var FreeVol = ((parseFloat(e.model.FreeSaleVolP) * parseFloat(AVol)) / 100);
                        //    e.model.set('ReservedCapacityVolwt', (parseFloat(AVol) - FreeVol));
                        //    e.model.set('FreeSaleCapacityVolume', FreeVol);
                        //    e.model.set('VolumeWeight', AVol);
                        //    e.model.set('OverBookingCapacityVolume', overbookVol);
                        //    data.push({ Key: 'ReservedCapacityVolwt', Value: (parseFloat(AVol) - FreeVol) });
                        //    data.push({ Key: 'FreeSaleCapacityVolume', Value: (FreeVol) });
                        //    data.push({ Key: 'TotalVol', Value: value });
                        //    data.push({ Key: 'OverBookingCapacityVolume', Value: overbookVol });
                        //}

                        if (capOutput) {
                            data.push({ Key: field, Value: value });
                            setValues(data, e.model.SNo);
                        }
                        isUpdate = true;
                    }
                }
                setTimeout(function () { $scope.UpdateSegmentDetails() }, 100);
            },
            columns:
                $.merge($.merge([
                    { field: "Board", title: "Brd Pt", width: 40, locked: true, lockable: false, },
                    {
                        field: "Off", title: "Off Pt", width: 40, locked: true
                    },
                    {
                        field: "ValidFrom", title: "Valid From", d: 'A', format: "{0: dd-MMM-yyyy}", width: 80, locked: true,
                    },
                    {
                        field: 'ValidTo', title: "Valid To", d: 'A', format: "{0: dd-MMM-yyyy}", width: 80, locked: true, editor: validToEditor,
                    },
                    {
                        field: "AircraftType", title: "Aircraft Type", width: 110, editor: ACEditor, locked: true
                    },
                    {
                        field: "ACRegNo", title: "A/C Reg. No", width: 80, editor: RegEditor, locked: true
                    }], $scope.CommonColumns), [{
                        field: 'StructuralCapacity', headerTemplate: "Structural<br>Capacity", width: 65
                    }]),
            editable: true
        }

        $scope.LegGridOptionsTooltip = {
            filter: "tbody tr:not(.k-grouping-row):not(.k-footer-template) td:not(.k-group-cell):not(:empty):not(:has(div)):not(:has(input)):not(:has(span:not(.k-dirty):empty))",
            content: function (e) {
                var target = e.target;
                return $(target).text();

            }
        }

        function validToEditor(container, options) {
            $('<input required="required" data-text-field="' + options.field + '" data-value-field="' + options.field
                    + '" data-bind="value:' + options.field + '" />')
                    .appendTo(container)
                    .kendoDatePicker({
                        format: "{0: dd-MMM-yyyy}",
                        value: new Date(options.model.ValidFrom),
                        min: new Date(options.model.ValidFrom),
                        d: 'A',
                    });
        }

        function CapacityCal(e, type, key, value, data) {
            var totolVol = parseFloat(e.model[type]) - parseFloat(value);
            if (totolVol > 0 || totolVol == 0) {
                e.model.set(key, totolVol);
                data.push({ Key: key, Value: totolVol });
                return true;
            }
            else {
                e.preventDefault();
                isUpdate = true;
                return false;
            }
        }

        function setValues(data, Key) {
            //Temprory commented

            //var segmentsGrid = $scope.SegmentsGrid.dataItems();
            //for (var i in data) {
            //    $.map(segmentsGrid, function (item) {
            //        if (item.SNo == Key) {
            //            item[data[i].Key] = data[i].Value;
            //            $scope.SegmentsGrid._modelChange({ field: data[i].Key, model: item });
            //        }
            //    });
            //}
            isUpdate = true;
        }


        $scope.SegmentGridOptions = {
            autoBind: false,
            // dataSource: new kendo.data.DataSource(),
            dataSource: new kendo.data.DataSource({
                batch: true,
                schema: {
                    model: {
                        id: "SNo",
                        fields: {
                            Board: { editable: false },
                            Off: { editable: false },
                            CommercialCapacity: { editable: false },
                            DisplayUsedGrossWeight: { editable: false },
                            DisplayUsedVolume: { editable: false },
                            //UsedVolume: { editable: false },
                            ReleasedGrossWt: { editable: false },
                            AllocatedGross: { editable: false },
                            //UsedGrossWeight: { editable: false },
                            AllocatedVolume: { editable: false },
                            ReleasedVolumeWt: { editable: false },
                            RemainingGrosswt: { editable: false },
                            RemainingVolwt: { editable: false },
                            FreeSaleCapacity: { editable: false },
                            FreeSaleCapacityVolume: { editable: false },
                            ReservedCapacityGrosswt: { editable: false },
                            ReservedCapacityVolwt: { editable: false },
                            GrossWeight: { editable: false },
                            VolumeWeight: { editable: false },
                            TotalGross: { editable: false },
                            TotalVol: { editable: false },
                            OverBookingCapacity: { editable: false },
                            OverBookingCapacityVolume: { editable: true },
                            IsBookingClosed: { editable: true, type: "boolean" }
                        }
                    }
                }
            }),
            columns: $.merge($.merge([
                { field: "Board", title: "Brd Pt", locked: true, lockable: false, width: 40 },
                {
                    field: "Off", title: "Off Pt", locked: true, width: 40
                }],
                $scope.CommonColumns),
                [{
                    template: BindcheckBoxActive('IsBookingClosed', 'IsEdit', 'IsDisabled'), headerTemplate: "<span class='hcap'>Booking <br> Closed</span>", editor: customBoolEditor, width: 70
                }]),
            editable: true
        }

        $scope.SegmentGridOptionsTooltip = {
            filter: "tbody tr:not(.k-grouping-row):not(.k-footer-template) td:not(.k-group-cell):not(:empty):not(:has(div)):not(:has(input)):not(:has(span:empty))",
            content: function (e) {
                var target = e.target;
                return $(target).text();

            }
        }

        $scope.CapDistributeGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                //batch: true,
                schema: {
                    model: {
                        id: "SNo",
                        fields: {
                            Board: { editable: false },
                            Off: { editable: false },
                            GrossWeight: { editable: false },
                            VolumeWeight: { editable: false },
                            FreeSaleCapacity: { editable: false },
                            FreeSaleCapacityVolume: { editable: false },
                            FreeSaleUsedGross: { editable: false },
                            FreeSaleUsedVolume: { editable: false },
                            //UsedGrossWeight: { editable: false },
                            //UsedVolume: { editable: false },
                            //RemainingGrosswt: { editable: false },
                            //RemainingVolwt: { editable: false },
                            SecCapDisGWT: { editable: true, type: "number" }, //,validation: { required: { message: gMsg }, min: 0.000}
                            SecCapDisVWT: { editable: true, type: "number" }, //, validation: { required: { message: VMsg }, min: 0.000}
                            AvlSecCapDisGWT: { editable: false },
                            AvlSecCapDisVWT: { editable: false }
                        }
                    }
                }
            }),
            save: function (e) {
                var Field = Object.keys(e.values)[0];
                var SNo = e.model.id;
                var Value = e.values[Object.keys(e.values)[0]];
                var Output = $scope.ValidateSectorCapacityDistribution(SNo, Field, Value, 0);
                if (!Output) {
                    e.preventDefault();
                    return false
                }
                else
                    $scope.SetAvailableSectorCapacityDistribution();
            },
            columns: [
                { field: "Board", title: "Brd Pt", width: 30 },
                {
                    field: "Off", title: "Off Pt", width: 30
                },
                {
                    headerTemplate: "Actual Capacity",
                    columns: [{ field: "GrossWeight", title: "Gross", width: 40 },
                    { field: "VolumeWeight", title: "Volume", width: 40 }, ]
                },
                {

                    headerTemplate: "Free Sale Capacity",
                    columns: [{ field: "FreeSaleCapacity", title: "Gross", width: 40 },
                    {
                        field: "FreeSaleCapacityVolume", title: "Volume", width: 40
                    }, ]
                },
                {

                    headerTemplate: "Free Sale Used Capacity",
                    columns: [{ field: "FreeSaleUsedGross", title: "Gross", width: 40 },
                    {
                        field: "FreeSaleUsedVolume", title: "Volume", width: 40
                    }, ]
                },
                /* {

                    headerTemplate: "Used Capacity",
                    columns: [{ field: "UsedGrossWeight", title: "Gross", width: 40 },
                    {
                        field: "UsedVolume", title: "Volume", width: 40
                    }, ]
                },
                {

                    headerTemplate: "Remaining Capacity",
                    columns: [{ field: "RemainingGrosswt", title: "Gross", width: 40 },
                    {
                        field: "RemainingVolwt", title: "Volume", width: 40
                    }, ]
                },*/
                {
                    headerTemplate: "<span class='hcap' style='color:#196F3D;'>Available For Distribution</span>",
                    columns: [{ field: "AvlSecCapDisGWT", title: "Gross", width: 40 },
                    {
                        field: "AvlSecCapDisVWT", title: "Volume", width: 40 // spinner: true,
                    }, ]
                },
                {

                    headerTemplate: "<span class='hcap'>Capacity Distribution <br/> (In Addition to Used Free Sale Capacity)</span>",
                    columns: [{ field: "SecCapDisGWT", format: GFormat, title: "Gross", width: 60 },
                    {
                        field: "SecCapDisVWT", format: VFormat, title: "Volume", width: 60 // spinner: true,
                    }, ]
                }

            ],
            editable: true,
            dataBound: function (e) {
                var cells = e.sender.tbody.find('td');
                cells.each(function (idx, item) {

                    if ((idx + 1) % 12 == 0 || (idx + 1) % 12 == 11) {

                    }
                    else {
                        $(item).addClass('noneditable');
                    }
                });
            }
        }



        var allotRequest = function () {
            return {
                dailyFlightSNo: $.map($scope.SegmentGridOptions.dataSource._data.toJSON(), function (i) {
                    return i.SNo;
                })
            };
        }




        $scope.AllotmentGridOptions = function () {
            return {
                autoBind: true,
                dataSource: new kendo.data.DataSource({
                    type: "json",
                    transport: {
                        read: {
                            url: "../schedule/getallotment",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json", type: "post", global: false, data: allotRequest
                        },
                        parameterMap: function (options) {
                            if (options.filter == undefined)
                                options.filter = null;
                            if (options.sort == undefined)
                                options.sort = null;
                            return JSON.stringify(options);
                        },
                    },
                    schema: {
                        model: {
                            fields: {
                                Route: { type: "string" },
                                AllotmentCode: { type: "string" },
                                GrossWeight: { type: "number" },
                                Volume: { type: "number" },
                                //UnitsInStock: { type: "number" }
                            }
                        }
                    },
                    group: {
                        field: "Route", aggregates: [
                            { field: "AllotmentCode", aggregate: "count" },
                            {
                                field: "GrossWeight", aggregate: "sum"
                            },
                            {
                                field: "Volume", aggregate: "sum"
                            },
                            //{ field: "UnitsOnOrder", aggregate: "average" },

                        ]
                    },
                    aggregate: [{ field: "AllotmentCode", aggregate: "count" },
                    {
                        field: "GrossWeight", aggregate: "sum"
                    },
                    {
                        field: "Volume", aggregate: "sum"
                    },
                        //{ field: "UnitsOnOrder", aggregate: "average" },
                        //{ field: "UnitsInStock", aggregate: "min" },
                        //{ field: "UnitsInStock", aggregate: "max" }
                    ]

                }),
                dataBound: function (e) {
                    cfi.DisplayEmptyMessage(e, this);
                },
                columns: [
                    //{
                    //    field: "Route", title: "Route", aggregates: ["count"],

                    //    //groupHeaderTemplate: "Units In Stock: #= value # (Volume: #= data.aggregates.Volume.sum#)",
                    //    //footerTemplate: "Total Count: #=count#", groupFooterTemplate: "Count: #=count#", width: 100
                    //},
                    {
                        field: "AllotmentCode", title: "Allotment Code", aggregates: ["count"],

                        footerTemplate: "Total Count: #=count#", groupFooterTemplate: "Count: #=count#", width: 100
                    },
                    {
                        field: "AllotmentType", title: "Allotment Type", width: 80
                    },
                    {
                        field: "Office", title: "Office Name", width: 80
                    },
                    {
                        field: "Agent", title: "Agent Name", width: 100
                    },
                    {
                        field: "GrossWeight", title: "Gross Wt.", format: GFormat, aggregates: ["sum"], groupFooterTemplate: "#=(sum).toFixed(2)#", footerTemplate: "#=(sum).toFixed(2)#", width: 70
                    },
                    {
                        field: "Volume", title: "Volume", format: VFormat, aggregates: ["sum"], groupFooterTemplate: "#=(sum).toFixed(3)#", footerTemplate: "#=(sum).toFixed(3)#", spinner: true, width: 70
                    },
                    {

                        headerTemplate: "<span class='hcap'>Gross Variance</span>",
                        columns: [{ field: "GVPlus", title: "(+)%", width: 40 },
                        {
                            field: "GVMinus", title: "(-)%", width: 40
                        }, ]
                    },
                    {
                        headerTemplate: "<span class='hcap'>Volume Variance</span>",
                        columns: [{ field: "VVPlus", spinner: true, title: "(+)%", width: 40 },
                        {
                            field: "VVMinus", spinner: true, title: "(-)%", width: 40
                        }, ]
                    },
                    {
                        field: "SHC", title: "SHC", width: 70
                    },

                    {
                        template: BindcheckBox('IsSHC'), headerTemplate: "<span class='hcap'>Exclude<br> SHC</span>", editor: customBoolEditor, width: 50
                    },

                    {
                        field: "Commodity", title: "Commodity", width: 80
                    },

                    {
                        template: BindcheckBox('IsCommodity'), headerTemplate: "<span class='hcap'>Exclude<br> Commodity</span>", editor: customBoolEditor, width: 50
                    },

                    {
                        field: "Product", title: "Product", width: 80
                    },

                    {
                        template: BindcheckBox('IsProduct'), headerTemplate: "<span class='hcap'>Exclude<br> Product</span>", editor: customBoolEditor, width: 50
                    },

                    {
                        headerTemplate: "<span class='hcap'> Release Time</span>",
                        columns: [{ field: "ReleaseHr", title: "Hr", width: 35 },
                        {
                            field: "ReleaseMin", title: "Min", width: 35
                        }, ]
                    },
                    {
                        template: BindcheckBox('Active'), title: "Active", editor: customBoolEditor, width: 45

                    },// { command: ["edit", "destroy"], title: "&nbsp;", width: 70 }
                ],
                //editable: 'inline'

            };
        }

        function BindcheckBox(field) {
            return "<div class='chkCls'><input disabled id='" + field + "#=data.uid#' class='k-checkbox' type='checkbox' #=data." + field + "=='True' ? \"checked='checked'\" : '' # /><label for='" + field + "#=data.uid#' class='k-checkbox-label' ></label></div>";
        }

        function BindcheckBoxActive(field, IsEdit, IsDisabled) {
            return "<div class='chkCls'><input  #=data." + IsEdit + "=='True' && data." + IsDisabled + "=='True' ? \"disabled\" : \"\" # id='" + field + "#=data.uid#' class='k-checkbox' type='checkbox' #=data." + field + "=='True' ? \"checked='checked'\" : '' # /><label for='" + field + "#=data.uid#' class='k-checkbox-label' ></label></div>";
        }


        function RegEditor(container, options) {
            var dropdownlist = $('<input />')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Reg. No",
                    autoBind: false,
                    filter: "contains",
                    filterField: 'RegistrationNo',
                    dataTextField: "Text",
                    dataValueField: "Key",
                    change: function (ev) {

                        $.when($scope.IsSectorCapDistribution && !$scope.IsSecCapPrompt && ConfirmAlert('In case you wish to change the Aircraft Registration No., distributed capacity on respective sectors would now be marked as NULL/Blank. Do you wish to continue with Amendments ?')).then(function (confirmed) {
                            if (confirmed) {
                                ShowMessage('info', 'Information!', "Kindly Proceed with Amendments.");
                                $scope.IsSecCapPrompt = true
                            }
                        });

                        if ($scope.IsSectorCapDistribution && !$scope.IsSecCapPrompt) {
                            ev.preventDefault();
                            return false
                        }

                        if (this.value() == "") {

                        } else {
                            options.model.set("ACRegNo", this.text());
                            var data = [];
                            var capacity = GetAirCraftCap(options.model['ACSNo'], options.model['SNo'], options.model['ACRegNo']);
                            for (var i in capacity) {
                                if (options.model[i] != undefined) {
                                    options.model.set(i, capacity[i], undefined, true);
                                    data.push({ Key: i, Value: capacity[i] })
                                }
                            }
                            if (data.length > 0)
                                setValues(data, options.model['GroupFlightSNo']);
                        }
                    },
                    dataSource: GetDataSourceV2("Leg_Reg_Grid-" + options.model['ACSNo'], "ViewNEditFlight_RegistrationNo")

                }).data('kendoDropDownList');
        }

        // Aicraft Editor
        function ACEditor(container, options) {
            var dropdownlist = $('<input />')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Aircraft",
                    autoBind: false,
                    filter: "contains",
                    filterField: 'AircraftType',
                    dataTextField: "Text",
                    dataValueField: "Key",
                    IsChangeOnBlankValue: false,
                    change: function (ev) {
                        $.when($scope.IsSectorCapDistribution && !$scope.IsSecCapPrompt && ConfirmAlert('In case you wish to change the Aircraft Type, distributed capacity on respective sectors would now be marked as NULL/Blank. Do you wish to continue with Amendments ?')).then(function (confirmed) {
                            if (confirmed) {
                                ShowMessage('info', 'Information!', "Kindly Proceed with Amendments.");
                                $scope.IsSecCapPrompt = true
                            }
                        });

                        if ($scope.IsSectorCapDistribution && !$scope.IsSecCapPrompt) {
                            ev.preventDefault();
                            return false
                        }

                        if (this.value() == "") {

                        } else {
                            options.model.set("AircraftType", this.text());
                            options.model.set("ACSNo", this.value());
                            options.model['IsCAO'] = $scope.CAO == '2' ? 'False' : 'True';
                            var data = [];
                            var capacity = GetAirCraftCap(this.value(), options.model['SNo']);
                            for (var i in capacity) {
                                if (options.model[i] != undefined) {
                                    options.model.set(i, capacity[i], undefined, true);
                                    data.push({ Key: i, Value: capacity[i] })
                                }
                            }
                            if (data.length > 0)
                                setValues(data, options.model['GroupFlightSNo']);
                            options.model.set("ACRegNo", "");

                        }
                    },
                    dataSource: GetDataSourceV2("Leg_Aircraft_Grid-" + options.model['CarrierCode'] + "-" + options.model['IsTruck'], "ViewNEditFlight_AircraftType")

                }).data('kendoDropDownList');
        }

        function setAircraftCapacity(model, cap) {
            var segmentsGrid = $scope.SegmentsGrid.dataItems();
            for (var i in cap) {
                if (model.model[i] != undefined)
                    model.set(i, cap[i], undefined, true);
            }
        }

        /// Get Aircraft capacity 
        function GetAirCraftCap(ACSNo, dfSNo, ACReg) {
            var cap;
            $.ajax({
                type: "POST", async: false,
                url: "../Schedule/GetAirCraftCapacity",
                dataType: "json",
                data: { ACSNo: ACSNo, ACReg: ACReg, DFSNo: dfSNo },
                success: function (result) {
                    if (result.length > 0)
                        cap = result[0];
                }
            });
            return cap;

        }

        function customBoolEditor(container, options) {
            var div = $('<div class="chkCls">');
            div.appendTo(container);

            $('<input id="' + options.field + '" class="k-checkbox" type="checkbox" name="Active" data-type="boolean" data-bind="checked:' + options.field + '">').appendTo(div);
            $('<label class="k-checkbox-label" for="' + options.field + '">&#8203;</label>').appendTo(div);
        }


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
                            url: '../Services/AutoCompleteService.svc/AutoCompleteDataSourceV2',
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            data: { autoCompleteName: autoCompleteName }
                        },
                        parameterMap: function (options) {

                            //if (options.filter != undefined) {
                            var filter = $scope.ExtraCondition(extra_ConditionId);
                            if (filter) {

                                if (filter == undefined) {
                                    filter = { logic: "AND", filters: [] };
                                }
                                if (options.filter != undefined)
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
        $scope.SearchRequest = { FlightDate: kendo.toString(new Date(), 'dd-MMM-yyyy') };
        $scope.SearchRequest.ACRegYes = 0;
        $scope.SearchRequest.ACRegNo = 1;
        $scope.LegDataSource = [];
        $scope.SegmentDataSource = [];
        $scope.OldData = "";
        $scope.OldSecCapDisData = "";

        $scope.SelectFlight = function (item) {
            $scope.ResetSearch();
            $scope.SearchBy = '1';
            $scope.SearchRequest.FlightNo = item.FlightNo;
            $scope.SearchRequest.FlightDate = kendo.toString(new Date(item.FlightDate), 'dd-MMM-yyyy');
            $scope.SearchFlights();
        }


        $scope.SearchFlights = function () {
            $scope.IsSecCapPrompt = false;
            $("#tblSearch").cfValidator();
            if ($("#tblSearch").data('cfValidator').validate()) {

                if ($scope.SearchBy == '1') {
                    $scope.tabs.select(0);
                    $scope.FlightRequest = angular.copy($scope.SearchRequest);

                    $.ajax({
                        type: "POST",
                        url: "../Schedule/SearchFlightDetails",
                        dataType: "json",
                        data: $scope.FlightRequest,
                        success: function (result) {
                            $scope.SearchInfoShow = true;
                            $scope.$apply();
                            $timeout(function () { loadFlightData(result); }, 50);
                        }
                    });

                } else {

                    $scope.FlightSearchO_DGridOptions.dataSource.read();

                    //$.ajax({
                    //    type: "POST",
                    //    url: "../Schedule/SearchFlightDetails",
                    //    dataType: "json",
                    //    data: $scope.SearchRequest,
                    //    success: function (result) {
                    //        $scope.SearchInfoShow = true;
                    //        $scope.FlightSearchO_DGridOptions.dataSource.data([]);
                    //        $scope.FlightSearchO_DGridOptions.dataSource.data(result.Table0);
                    //    }
                    //});


                }
            }
        }


        function loadFlightData(result) {
            $scope.IsReroute = false; //Reset re-route checkbox
            $scope.IsSegmentBookingOpenClose = false;
            $scope.Reroute();
            //var isEdit = 0;
            //if (result.Table1.length > 0 && userContext.AirportCode == result.Table1[0].Board)
            //    isEdit = 1;
            $scope.CAO = result.Table1[0].IsCAO == "True" ? 1 : 0;
            $.map(result.Table1, function (i) {
                i.TotalGross = parseFloat(i.GrossWeight) + parseFloat(i.OverBookingCapacity);
                i.TotalVol = parseFloat(i.VolumeWeight) + parseFloat(i.OverBookingCapacityVolume);
                i.Header = i.FlightNo + ' : ' + i.Board + ' - ' + i.Off + ' on ' + i.FlightDate;
                i.ValidFrom = kendo.parseDate(i.ValidFrom, "dd-MMM-yyyy");
                i.ValidTo = kendo.parseDate(i.ValidTo, "dd-MMM-yyyy");
                i.OldValidTo = kendo.parseDate(i.ValidTo, "dd-MMM-yyyy");

                //i.Days = { SUN: 1, MON: 2, TUE: 3, WED: 4, THU: 5, FRI: 6, SAT: 7 };
                var days = { SUN: false, MON: false, TUE: false, WED: false, THU: false, FRI: false, SAT: false };
                days[i.Days.toUpperCase()] = true;
                i.Days = days;
                i.IsDisabled = JSON.parse(i.IsDisabled.toLowerCase()) || false;
                i.IsCancelNotice = JSON.parse(i.IsCancelNotice.toLowerCase()) || false;
                i.IsSectorCapDistribution = i.IsSectorCapDistribution.toLowerCase() == 'true' ? true : false;
                $scope.IsSectorCapDistribution = i.IsSectorCapDistribution;
                $scope.OldIsSectorCapDistribution = i.IsSectorCapDistribution;
                $scope.Cancel = i.IsCancelled == 'True' ? true : false;
                $scope.IsEdit = i.IsEdit;
                $scope.minScheduleDate = new Date(i.ScheduleDate);
            });

            $.map(result.Table2, function (i) {
                i.TotalGross = parseFloat(i.GrossWeight) + parseFloat(i.OverBookingCapacity);
                i.TotalVol = parseFloat(i.VolumeWeight) + parseFloat(i.OverBookingCapacityVolume);
                i.Header = i.FlightNo + ' : ' + i.Board + ' - ' + i.Off + ' on ' + i.FlightDate;
                i.ValidFrom = kendo.parseDate(i.ValidFrom, "dd-MMM-yyyy");
                i.ValidTo = kendo.parseDate(i.ValidTo, "dd-MMM-yyyy");
                var days = { SUN: false, MON: false, TUE: false, WED: false, THU: false, FRI: false, SAT: false };
                days[i.Days.toUpperCase()] = true;
                i.Days = days;
                i.IsDisabled = JSON.parse(i.IsDisabled.toLowerCase()) || false;
            });

            $scope.FlightSearchGridOptions.dataSource.data([]);
            $scope.FlightSearchGridOptions.dataSource.data(result.Table0);
            $scope.LegGridOptions.dataSource.data([]);
            $scope.LegGridOptions.dataSource.data(result.Table1);
            $scope.LegDataSource = [];
            $scope.SegmentDataSource = [];
            $scope.SegmentGridOptions.dataSource.data([]);
            $scope.SegmentGridOptions.dataSource.data(result.Table2);
            var capDistributorData = angular.copy(result.Table2);

            capDistributorData.forEach(function (item, idx) {
                //item.IsEdit =  idx == 0 ?1:0;
                item.IsEdit = 1;
                item.AvlSecCapDisGWT = 0;
                item.AvlSecCapDisVWT = 0;
            });

            $scope.CapDistribution();
            $scope.SegmentBookingClose();

            $scope.CapDistributeGridOptions.dataSource.data(capDistributorData);

            $scope.LegDataSource = $scope.LegGridOptions.dataSource._data;
            $scope.SegmentDataSource = $scope.SegmentGridOptions.dataSource._data;
            $scope.$apply();
            $scope.OldData = JSON.stringify($scope.LegDataSource.toJSON());
            $scope.OldSecCapDisData = JSON.stringify($scope.CapDistributeGridOptions.dataSource.data().toJSON());
            $scope.OldSegmentDataSource = angular.copy(result.Table2);


            /*-----------------------End Grid Tabbing  ------------------------------*/

            //var gridTab0 = $('div[options="LegGridOptions"]').data('kendoGrid');
            //gridTab0.table.on('keydown', function (e) { moveToNext(e, gridTab0) });

            var gridTab1 = $('div[options="SegmentGridOptions"]').data('kendoGrid');
            //if ($scope.Environment != 'JT') {
            gridTab1.hideColumn(gridTab1.columns[13]);
            //}

            var gridTab2 = $('div[options="CapDistributeGridOptions"]').data('kendoGrid');
            gridTab2.table.on('keydown', function (e) { moveToNext(e, gridTab2) });

            $('#movementPanel')
            PagerightsCheckFlightCapacity()
            /*-----------------------End Grid Tabbing  ------------------------------*/
        }


        $scope.dayDiff = ['-1', '0', '1', '2', '3', '4', '5', '6', '7'];

        $scope.CalPax = function (item) {
            if (Number(item.OpenSeats))
                item.CommercialCapacity = (parseFloat(item.OpenSeats) * parseFloat(item.WeightPerPax) + parseFloat(item.GrossWeight)).toFixed(3);
            else
                item.CommercialCapacity = (parseFloat(0) * parseFloat(item.WeightPerPax) + parseFloat(item.GrossWeight)).toFixed(3);
        }
        $scope.CheckAll = function (item) {
            for (var i in item.Days) {
                if (typeof item.Days[i] == 'boolean')
                    item.Days[i] = item.All;
            }

        }
        $scope.CancellFlight = function () {

            if ($scope.Cancel)
                $.when(ConfirmAlert('Please ensure that the respective shipments( If any) on Flight have been Transferred')).then(function (confirmed) {
                    if (confirmed) {
                        if ($scope.LegDataSource.length > 0)
                            $.map($scope.LegDataSource, function (item) {
                                if (item.IsDeparted != 'True')
                                    item.IsCancelled = $scope.Cancel ? 'True' : 'False';
                            });
                    }
                    else {
                        $scope.Cancel = false;
                    }
                    $scope.$apply();
                });
            else
                if ($scope.LegDataSource.length > 0)
                    $.map($scope.LegDataSource, function (item) {
                        if (item.IsDeparted != 'True')
                            item.IsCancelled = $scope.Cancel ? 'True' : 'False';
                    });
        }

        $scope.IsCancelled = function (item, isCancel) {
            if (isCancel)
                $.when(ConfirmAlert('Please ensure that the respective shipments( If any) on Flight have been Transferred')).then(function (confirmed) {
                    if (confirmed) {
                        cancellFlight(item, isCancel);
                    }
                    else {
                        item.IsCancelled = 'False';
                    }
                    $scope.$apply();
                });
            else
                cancellFlight(item, isCancel);



        }

        function cancellFlight(item, isCancel) {
            var isTopCancel = false;
            var previouseVal;
            var isNextCancel = false;
            //for (var i = 0; i < $scope.LegDataSource.length; i++) {
            //    if ($scope.LegDataSource[i].SNo == item.SNo) {
            //        if (previouseVal == 'True' || i==0) {
            //            $scope.LegDataSource[i].IsCancelled = isCancel ? 'True' : 'False';
            //            break;
            //        } else{
            //            $scope.LegDataSource[i].IsCancelled = isCancel ? 'True' : 'False';
            //            isNextCancel = true;
            //        }

            //    } else if (isNextCancel)
            //        $scope.LegDataSource[i].IsCancelled = isCancel ? 'True' : 'False';
            //    previouseVal = $scope.LegDataSource[i].IsCancelled;

            //}

            //if (previouseVal == 'True' && isCancel == false) {
            //    item.IsCancelled = 'True';
            //    ShowMessage('warning', 'Information!', "Please select previous Leg as 'No'");
            //    return;
            //}

            //var isNextCancel = false;
            //for (var i = 0; i < $scope.LegDataSource.length; i++) {
            //    if ($scope.LegDataSource[i].SNo == item.SNo)
            //        isNextCancel = true;
            //    if (isNextCancel)
            //        $scope.LegDataSource[i].IsCancelled = isCancel ? 'True' : 'False';
            //}

        }

        $scope.UpdateRemarks = "";
        $scope.SaveChanges = function () {

            $scope.IsUpdateFlight = true;
            $('#UpdateRemarks').cfValidator();


            $('#movementPanel>li').cfValidator();

            var countrow = 0;

            var dataSource = $scope.LegGridOptions.dataSource,
                data = dataSource.data();

            var SecdataSource = $scope.CapDistributeGridOptions.dataSource,
                Secdata = SecdataSource.data();

            var grid = $('div[options=LegGridOptions]').getKendoGrid();
            if (grid.tbody.find('.k-edit-cell').length > 0)
                return false;

            var oldData = JSON.parse($scope.OldData);
            var oldSecCapDistData = JSON.parse($scope.OldSecCapDisData);

            var isCancellYesNo = false;
            changedModels = [];
            var ModelSCD = [];
            
            // if (dataSource.hasChanges()) {
            for (var i = 0; i < data.length; i++) {
                data[i].CancelStatus = "0";
                if (JSON.stringify(data[i].toJSON()) !== JSON.stringify(oldData[i])) {
                    if (!$('#movementPanel>li:eq(' + i + ')').data('cfValidator').validate()) {
                        $scope.tabs.select(3);
                        return false;
                    }

                    if (data[i].IsCancelled != oldData[i].IsCancelled) {
                        data[i].CancelStatus = data[i].IsCancelled == 'True' ? "1" : "2"; // 1 for Yes 2- No 0- nothing                         
                        isCancellYesNo = true;
                        changedModels.push(data[i].toJSON());
                    } else
                        changedModels.push(data[i].toJSON());
                }

            }

            for (var i = 0; i < Secdata.length; i++) {
                if (MakeValue(oldSecCapDistData[i].SecCapDisGWT) != MakeValue(Secdata[i].SecCapDisGWT) || MakeValue(oldSecCapDistData[i].SecCapDisVWT) != MakeValue(Secdata[i].SecCapDisVWT) || $scope.OldIsSectorCapDistribution != $scope.IsSectorCapDistribution) {

                    Secdata[i].set("IsSectorCapDistribution", $scope.IsSectorCapDistribution, undefined, true);

                    var SCD = {
                        SNo: Secdata[i].SNo,
                        FlightNo: Secdata[i].FlightNo,
                        FlightDate: Secdata[i].FlightDate,
                        From: Secdata[i].FlightDate,
                        To: Secdata[i].FlightDate,
                        Board: Secdata[i].Board,
                        Off: Secdata[i].Off,
                        FreeSaleCapacity: Secdata[i].FreeSaleCapacity,
                        FreeSaleCapacityVolume: Secdata[i].FreeSaleCapacityVolume,
                        FreeSaleUsedGross: Secdata[i].FreeSaleUsedGross,
                        FreeSaleUsedVolume: Secdata[i].FreeSaleUsedVolume,
                        SecCapDisGWT: Secdata[i].SecCapDisGWT,
                        SecCapDisVWT: Secdata[i].SecCapDisVWT,
                        IsSectorCapDistribution: $scope.IsSectorCapDistribution
                    }
                    ModelSCD.push(SCD);
                }
            }

            if ($scope.IsSectorCapDistribution) {

                var IsEmptyCellExists = false;
                $scope.CapDistributeGridOptions.dataSource._data.forEach(function (item, idx) {
                    if (item.SecCapDisGWT == null || item.SecCapDisGWT.toString() == "" || item.SecCapDisVWT == null || item.SecCapDisVWT.toString() == "") {
                        IsEmptyCellExists = true;
                    }
                });

                if (IsEmptyCellExists) {
                    ShowMessage('warning', 'Capacity Distribution!', "All Sector Capacity Distribution data should be filled.");
                    return false;
                }

                if (!$scope.ValidateSectorCapacityDistribution(0, "", "", 1)) {
                    ShowMessage('warning', 'Capacity Distribution!', "Sector Capacity Distribution is not distributed correctly.");
                    return false;
                }
            }

            // return false;

            if ($scope.OldData === JSON.stringify($scope.LegDataSource.toJSON()) && $scope.OldSecCapDisData === JSON.stringify(Secdata.toJSON())) {
                return false;
            }

            if (!$('#UpdateRemarks').data('cfValidator').validate()) {
                $scope.kwinRemarks.center();
                $scope.kwinRemarks.open();
                setTimeout(function () { document.getElementById("UpdateRemarks").focus() }, 500);
                return false;

            }
            

            if ($scope.UpdateRemarks != undefined && (changedModels.length > 0 || ModelSCD.length > 0) && $scope.UpdateRemarks.length > 0) {

                var updateModel = $.map(changedModels, function (item) {
                    var model = angular.copy(item);
                    model.Days = DaysToNo(model.Days);
                    model.ValidFrom = kendo.toString(model.ValidFrom, 'dd-MMM-yyyy');
                    model.ValidTo = kendo.toString(model.ValidTo, 'dd-MMM-yyyy');
                    if (!isCancellYesNo || model.CancelStatus != 0)
                        return model;
                });
                $.ajax({
                    type: "POST",
                    url: "../Schedule/UpdateFlightDetils", contentType: "application/json; charset=utf-8", //dataType: "json",
                    data: JSON.stringify({
                        model: { LegGrid: updateModel, Remarks: $scope.UpdateRemarks, FlightAllotment: [] },
                        ModelSCD: ModelSCD
                    }),
                    success: function (result) {
                        if (result == "2000") {
                            //Added Code By Shivali thakur for Audit Log
                            var arrVal = [];
                            var flightno = "";
                            jQuery.each(oldData, function (index) {
                                flightno = oldData[0].FlightNo;

                                if (oldData[index].AircraftType != data[index].AircraftType) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Capacity " + oldData[index].Board, ColumnName: "Aircraft Type", OldValue: oldData[index].AircraftType, NewValue: data[index].AircraftType };
                                    arrVal.push(c);
                                }
                                if (oldData[index].FreeSaleCapacity != data[index].FreeSaleCapacity) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Capacity " + oldData[index].Board, ColumnName: "Free Sale Capacity Gross", OldValue: oldData[index].FreeSaleCapacity, NewValue: data[index].FreeSaleCapacity };
                                    arrVal.push(c);
                                }
                                if (oldData[index].FreeSaleCapacity != data[index].FreeSaleCapacity) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Capacity " + oldData[index].Board, ColumnName: "Free Sale Capacity Volume", OldValue: oldData[index].FreeSaleCapacity, NewValue: data[index].FreeSaleCapacity };
                                    arrVal.push(c);
                                }
                                if (oldData[index].ReservedCapacityGrosswt != data[index].ReservedCapacityGrosswt) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Capacity " + oldData[index].Board, ColumnName: "Reserved Capacity Gross", OldValue: oldData[index].ReservedCapacityGrosswt, NewValue: data[index].ReservedCapacityGrosswt };
                                    arrVal.push(c);
                                }
                                if (oldData[index].ReservedCapacityVolwt != data[index].ReservedCapacityVolwt) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Capacity " + oldData[index].Board, ColumnName: "Reserved Capacity Volume", OldValue: oldData[index].ReservedCapacityVolwt, NewValue: data[index].ReservedCapacityVolwt };
                                    arrVal.push(c);
                                }
                                if (oldData[index].OverBookingCapacity != data[index].OverBookingCapacity) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Capacity " + oldData[index].Board, ColumnName: "Over Booking Capacity", OldValue: oldData[index].OverBookingCapacity, NewValue: data[index].OverBookingCapacity };
                                    arrVal.push(c);
                                }
                                if (oldData[index].OverBookingCapacityVolume != data[index].OverBookingCapacityVolume) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Capacity " + oldData[index].Board, ColumnName: "Over Booking Capacity Volume", OldValue: oldData[index].OverBookingCapacityVolume, NewValue: data[index].OverBookingCapacityVolume };
                                    arrVal.push(c);
                                }
                                if (oldData[index].OpenSeats != data[index].OpenSeats) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "PAX " + oldData[index].Board, ColumnName: "Open Seats", OldValue: oldData[index].OpenSeats, NewValue: data[index].OpenSeats };
                                    arrVal.push(c);
                                }
                                if (oldData[index].ValidTo != data[index].ValidTo) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "Valid To", OldValue: oldData[index].ValidTo, NewValue: data[index].ValidTo };
                                    arrVal.push(c);
                                }
                                if (oldData[index].ETD != data[index].ETD) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "ETD", OldValue: oldData[index].ETD, NewValue: data[index].ETD };
                                    arrVal.push(c);
                                }
                                if (oldData[index].ETA != data[index].ETA) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "ETA", OldValue: oldData[index].ETA, NewValue: data[index].ETA };
                                    arrVal.push(c);
                                }
                                if (oldData[index].MaxGrossPerPcs != data[index].MaxGrossPerPcs) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "Max Gross Per Pcs", OldValue: oldData[index].MaxGrossPerPcs, NewValue: data[index].MaxGrossPerPcs };
                                    arrVal.push(c);
                                }
                                if (oldData[index].MaxVolumePerPcs != data[index].MaxVolumePerPcs) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "Max Volume Per Pcs", OldValue: oldData[index].MaxVolumePerPcs, NewValue: data[index].MaxVolumePerPcs };
                                    arrVal.push(c);
                                }
                                if (oldData[index].IsCAO != data[index].IsCAO) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "CAO", OldValue: oldData[index].IsCAO, NewValue: data[index].IsCAO };
                                    arrVal.push(c);
                                }
                                if (oldData[index].IsCancelled != data[index].IsCancelled) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "Cancel Flight", OldValue: oldData[index].IsCancelled, NewValue: data[index].IsCancelled };
                                    arrVal.push(c);
                                }
                                if (oldData[index].IsDelay != data[index].IsDelay) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "Flight Delay", OldValue: oldData[index].IsDelay, NewValue: data[index].IsDelay };
                                    arrVal.push(c);
                                }
                                if (oldData[index].Remarks != data[index].Remarks) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "Remarks", OldValue: oldData[index].Remarks, NewValue: data[index].Remarks };
                                    arrVal.push(c);
                                }
                                if (oldData[index].Status != data[index].Status) {
                                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Movement " + oldData[index].Board, ColumnName: "Booking", OldValue: oldData[index].Status, NewValue: data[index].Status };
                                    arrVal.push(c);
                                }

                            });
                            SaveAppendGridAuditLog("FlightNo", flightno, "", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);
                            // Ended Code By Shivali thakur for Audit Log           


                            ShowMessage('success', 'Success!', "Flight details have been updated.");
                            $scope.kwinRemarks.close();
                            $scope.UpdateRemarks = "";
                            $scope.SearchFlights();
                        }
                        else
                            ShowMessage('warning', 'Warning!', result);

                    }
                });
            }



        }

        function MakeValue(value) {
            if (value === null || value === undefined || value === "")
                return "";
            else
                return value;
        }

        //Added By Shivali Thakur
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
                        url: SiteUrl + "Services/Common/CommonService.svc/SaveAppendGridAuditLog?ModuleName=FLIGHT CAPACITY&AppsName=FLIGHT CAPACITY&KeyColumn=" + KeyColumn + "&KeyValue=" + KeyValue + "&KeySNo=" + keySNo + "&FormAction=" + FormAction + "&TerminalSNo=" + TerminalSNo + "&TerminalName=" + TerminalName,
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
       

        function DaysToNo(days) {
            var no = [], dayno = 1;
            for (var i in days) {
                if ((i == "SUN" || i == "MON" || i == "TUE" || i == "WED" || i == "THU" || i == "FRI" || i == "SAT")) {

                    if (days[i])
                        no.push(dayno);

                    dayno++;
                }
            }
            return no.join(',');
        }


        $scope.PopUpType = "";
        $scope.PopUpTypePCS = false;
        $scope.PCSDataItem = {};
        $scope.PopBTN = {};

        $scope.OpenPopUp = function (item, type) {
           
            $(".k-window").height('auto');
            $scope.PopUpType = "";
            $scope.PopBTN = {BTN:0,item: item};
            if (type == "FS") {
                if ($scope.KKLLPopUp == true) {
                    $scope.kwin3.center();
                    $scope.kwin3.open();
                    $scope.OnDisableSearch();
                    return false;
                }
                else {
                    $scope.kwin1.title('Shipment Details Flight No ' + item.FlightNo + ' : ' + item.Board + '-' + item.Off + ' on ' + item.FlightDate);
                }
            }
            else if (type == 'A')
                $scope.kwin1.title('Previous Aircrafts History');
            else
                $scope.kwin1.title('Flight SI Details');

            $scope.kwin1.center();
            $scope.kwin1.open();
            $timeout(function () { $scope.PopUpType = { type: type, item: item } }, 100);
        }
       
        $scope.OpenPopUpPCS = function (item) {
            $scope.PopUpTypePCS = false;
            $scope.PopUpTypePCS = true;
            $scope.PCSDataItem = {};
            $scope.kwin2.title('Capacity Details of AWB No '+item.AWBNo);           
            $scope.kwin2.center();
            $scope.kwin2.open();
            $scope.kwin2.options.close = function () { $scope.PopUpTypePCS = false; }
            $scope.PCSDataItem = item;
        }
        $scope.OnDisableSearch = function () {
            $("#rpDate").attr("disabled", "disabled");
            $("#fltNo").attr("disabled", "disabled");
        }
       
        $scope.MessageTypePopUp = function(item)
        {
           
            if (item.split('_').length >= 2) {
                $scope.MessageTypeDetails = '';
                var MesageType = item.split('_')[0]||'';
                var MesageSNo = parseInt(item.split('_')[2])||0;

                $.ajax({
                    url: "../schedule/GetEDIMessageDetails",
                    dataType: "json",
                    type: "post",
                    global: false,
                    data: { MesageType: MesageType, MesageSNo: MesageSNo },
                    success: function (result) {
                        $scope.kwinMessageType.title('Message Type Details');
                        $scope.MessageTypeDetails = result[0].ActualMessage.replace(/\^\^/g, "\r\n").replace(/\^/g, "\r\n");
                        $scope.kwinMessageType.center();
                        $scope.kwinMessageType.open();
                        $scope.$apply();
                    }
                });
                               
            }
        }

        $scope.OnColse=function(){
            $scope.PopUpTypePCS = false;
        
        }
        $scope.OnClose1 = function () {
            $("#rpDate").removeAttr("disabled");
            $("#fltNo").removeAttr("disabled");
        }
        $scope.OnClose2 = function () {
            $("#rpDate").removeAttr("disabled");
            $("#fltNo").removeAttr("disabled");
        }
     
        $scope.OpenBKDorUT = function (BtnNo)
        {
            $scope.OnColse();
            $scope.PopBTN["BTN"] = BtnNo;
            $scope.kwin1.title('Shipment Details Flight No ' + $scope.PopBTN.item.FlightNo + ' : ' + $scope.PopBTN.item.Board + '-' + $scope.PopBTN.item.Off + ' on ' + $scope.PopBTN.item.FlightDate);
            //$scope.kwin1.center();
            $scope.kwin1.open();
            $(".k-window").add(".k-window-content").attr("tabindex", "");         /*Added By shivam to restrict keyboard navigation of kendo window*/
            $timeout(function () { $scope.PopUpType = { type: 'FS', item: $scope.PopBTN.item } }, 100);
        }
        
        $scope.PopUpOptions = function (item) {
            if (item.type == 'FS') {
                $scope.kwin3.close();
                $scope.OnDisableSearch();
                if ($scope.PopBTN['BTN'] == 2) {
                    //$(".k-window").height('220px');
                    return {

                        dataSource: new kendo.data.DataSource({
                            type: "json",
                            transport: {
                                read: {
                                    url: "../schedule/ShipmentInfo",
                                    dataType: "json", type: "post", global: false, data: { SNo: item.item.SNo, Type : 2},
                                }
                            },
                            schema: {
                                model: {
                                    fields: {
                                        Status: { type: "string" },
                                        //UpdatedOn: { type: "date" },
                                        GrossWt: { type: "number" },
                                        Pieces: { type: "number" },
                                        Volume: { type: "number" },
                                        ChargeableWeight: { type: "number" },
                                        Revenue: { type: "number" },
                                        Yield: { type: "number" },
                                    }
                                },
                                data: function (data) {
                                    return data.Table0;
                                }

                            },
                            //sort: {
                            //    field: "UpdatedOn",
                            //    dir: "desc"
                            //},
                            group: {
                                field: "Status", aggregates: [
                                    { field: "AWBNo", aggregate: "count" },
                                    { field: "Status", aggregate: "count" },
                                    { field: "Pieces", aggregate: "sum" },                                    
                                    { field: "GrossWt", aggregate: "sum" },
                                    { field: "Volume", aggregate: "sum" },
                                    { field: "ChargeableWeight", aggregate: "sum" },
                                    { field: "Revenue", aggregate: "sum" },
                                    { field: "Yield", aggregate: "sum" }

                                ]

                            },
                            aggregate: [{ field: "Status", aggregate: "count" },
                            { field: "AWBNo", aggregate: "count" },
                            { field: "Pieces", aggregate: "sum" },
                            { field: "Volume", aggregate: "sum" },
                            { field: "GrossWt", aggregate: "sum" },
                            { field: "ChargeableWeight", aggregate: "sum" },
                            { field: "Revenue", aggregate: "sum" },
                            { field: "Yield", aggregate: "sum" },
                            

                            ]

                        }),
                        //height: auto,
                        dataBound: function (e) {

                            var popupTbl = $('div [k-options="PopUpOptionsTooltip"] table');
                            var YieldIndex = popupTbl.find('thead tr th[data-field="Yield"]').index();
                            var RevenueIndex = popupTbl.find('thead tr th[data-field="Revenue"]').index();
                            var ChargeableWeightIndex = popupTbl.find('thead tr th[data-field="ChargeableWeight"]').index();

                            //For Group Total
                            popupTbl.find('tbody tr[class="k-group-footer"]').each(function (idx, item) {
                                $(item).find('td:eq(' + YieldIndex + ') span').text(
                                    (parseFloat($(item).find('td:eq(' + RevenueIndex + ') span').text()) / parseFloat($(item).find('td:eq(' + ChargeableWeightIndex + ') span').text())).toFixed(3));
                            });
                            //For Total
                            popupTbl.find('tbody tr[class="k-footer-template"]').each(function (idx, item) {
                                $(item).find('td:eq(' + YieldIndex + ') span').text(
                                    (parseFloat($(item).find('td:eq(' + RevenueIndex + ') span').text()) / parseFloat($(item).find('td:eq(' + ChargeableWeightIndex + ') span').text())).toFixed(3));
                            });
                            

                            cfi.DisplayEmptyMessage(e, this);
                           
                        }, filterable: {
                            extra: false,
                            operators: {
                                string: {
                                    contains: "Contains",
                                    startswith: "Starts with",
                                    eq: "Is equal to",
                                    neq: "Is not equal to"
                                }
                            }
                        },
                        columns: [
                            {
                                field: "Status", title: "Status", aggregates: ["count"], hidden: true,
                                groupHeaderTemplate: "<lable class='#=setStatusColor(value)# fb'>Space info: #= value # </lable>",

                            },
                            { field: 'AWBNo', filterable: false, title: 'Reference No./AWB No.', aggregates: ["count"], groupFooterTemplate: "<span class='fb'>Count: #= count#</span>", footerTemplate: "<span class='fb'>Total Count: #=count#</span>", width: 130 },
                            { field: 'Origin', filterable: false, title: 'Origin', width: 45 },
                            { field: 'Destination', filterable: false, title: 'Dest', width: 40 },
                            { field: 'Commodity', filterable: false, title: 'Commodity' },
                            { field: 'NOG', filterable: false, title: 'Nature of Goods' },
                            { field: 'Pieces', filterable: false, title: 'Pieces', width: 45, aggregates: ["sum"], groupFooterTemplate: "<span class='fb'>#=sum#</span>", footerTemplate: "<span class='fb'>#=sum#</span>" },
                            { field: 'GrossWt', filterable: false, title: 'Gross Wt.', format: GFormat, aggregates: ["sum"], groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(2)#</span>", footerTemplate: "<span class='fb'>#=(sum).toFixed(2)#</span>", width: 70 },
                            { field: 'Volume', filterable: false, title: 'Volume', format: VFormat, aggregates: ["sum"], groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>", footerTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>", width: 70 },
                            { field: 'ChargeableWeight', filterable: false, title: 'Chargeable Wt.', format: GFormat, aggregates: ["sum"], groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(2)#</span>", footerTemplate: "<span class='fb'>#=(sum).toFixed(2)#</span>", width: 70 },
                            { field: 'AllotmentCode', filterable: false, title: 'Allotment Code' },
                            { field: 'Revenue', filterable: false, title: 'Revenue', format: VFormat, aggregates: ["sum"], groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>", footerTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>" },
                            { field: 'Yield', filterable: false, title: 'Yield', format: VFormat, aggregates: ["sum"], groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>", footerTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>" }
                        ]

                    };
                }
                else
                {
                    //$(".k-window").height('220px');
                    return {

                        dataSource: new kendo.data.DataSource({
                            type: "json",
                            transport: {
                                read: {
                                    url: "../schedule/ShipmentInfo",
                                    dataType: "json", type: "post", global: false, data: { SNo: item.item.SNo, Type : 1 },
                                }
                            },
                            schema: {
                                model: {
                                    fields: {
                                        //Status: { type: "string" },
                                        //UpdatedOn: { type: "date" },
                                        GrossWt: { type: "number" },
                                        Pieces: { type: "number" },
                                        Volume: { type: "number" },
                                        UsedGrossWt: { type: "number" },
                                        UsedPieces: { type: "number" },
                                        UsedVolume: { type: "number" },
                                        FreeSaleUsedGross: { type: "number" },
                                        FreeSaleUsedVolume: { type: "number" },
                                        ReserveUsedGross: { type: "number" },
                                        ReserveUsedVolume: { type: "number" },
                                        AllotmentUsedGross: { type: "number" },
                                        AllotmentUsedVolume: { type: "number" },
                                        AllotmentUsedGrossVariance: { type: "number" },
                                        AllotmentUsedVolumeVariance: { type: "number" },
                                        OverbookUsedGross: { type: "number" },
                                        OverbookUsedVolume: { type: "number" }
                                        //Revenue: { type: "number" },
                                        //Yield: { type: "number" },
                                    }
                                },
                                data: function (data) {
                                    return data.Table0;
                                }

                            },
                            //sort: {
                            //    field: "UpdatedOn",
                            //    dir: "desc"
                            //},
                            //group: {
                            //    field: "Status", aggregates: [
                            //        { field: "AWBNo", aggregate: "count" },
                            //        { field: "Status", aggregate: "count" },
                            //        { field: "Pieces", aggregate: "sum" },
                            //        { field: "GrossWt", aggregate: "sum" },
                            //        { field: "Volume", aggregate: "sum" },
                            //        //{ field: "Revenue", aggregate: "sum" },
                            //        //{ field: "Yield", aggregate: "sum" }

                            //    ]

                            //},
                            aggregate: [//{ field: "Status", aggregate: "count" },
                            { field: "AWBNo", aggregate: "count" },
                            { field: "Pieces", aggregate: "sum" },
                            { field: "Volume", aggregate: "sum" },
                            { field: "GrossWt", aggregate: "sum" },
                            { field: "UsedPieces", aggregate: "sum" },
                            { field: "UsedVolume", aggregate: "sum" },
                            { field: "UsedGrossWt", aggregate: "sum" },
                            { field: "FreeSaleUsedGross", aggregate: "sum" },
                                { field: "FreeSaleUsedVolume", aggregate: "sum" },
                                { field: "ReserveUsedGross", aggregate: "sum" },
                                { field: "ReserveUsedVolume", aggregate: "sum" },
                                { field: "AllotmentUsedGross", aggregate: "sum" },
                                { field: "AllotmentUsedVolume", aggregate: "sum" },
                                { field: "AllotmentUsedGrossVariance", aggregate: "sum" },
                                { field: "AllotmentUsedVolumeVariance", aggregate: "sum" },
                                { field: "OverbookUsedGross", aggregate: "sum" },
                                { field: "OverbookUsedVolume", aggregate: "sum" }
                            //{ field: "Revenue", aggregate: "sum" },
                            //{ field: "Yield", aggregate: "sum" }
                            ]

                        }),
                       // detailInit: OpenPopUpPCS,
                        dataBound: function (e) {
                            cfi.DisplayEmptyMessage(e, this);
                        }, filterable: {
                            extra: false,
                            operators: {
                                string: {
                                    contains: "Contains",
                                    startswith: "Starts with",
                                    eq: "Is equal to",
                                    neq: "Is not equal to"
                                }
                            }
                        },
                        columns: [
                            //{
                            //    field: "Status", title: "Status", aggregates: ["count"], hidden: true,
                            //    groupHeaderTemplate: "<lable class='#=setStatusColor(value)# fb'>Space info: #= value # </lable>",

                            //},
                            {
                                field: 'AWBNo', filterable: true, title: 'BRN/AWB/PO', aggregates: ["count"],
                                //groupFooterTemplate: "<span class='fb'>Count: #= count#</span>",
                                footerTemplate: "<span class='fb'>Total Count: #=count#</span>", width: 90
                            },
                            { field: 'Origin', filterable: false, title: 'Org', width: 40 },
                            { field: 'Destination', filterable: false, title: 'Dest', width: 40 },
                            { field: 'Commodity', filterable: false, title: 'Commodity', width:70 },
                            { field: 'NOG', filterable: false,title: 'NOG', width:70 },
                            {
                                field: 'Pieces', filterable: false, title: 'Total AWB Pcs', width: 40, aggregates: ["sum"],
                                //template: '#=parseFloat(Pieces)>0?\'<input type="button" class="btn-info" ng-click="OpenPopUpPCS(dataItem)" value="\'+Pieces+\'">\':Pieces#',
                                //groupFooterTemplate: "<span class='fb'>#=sum#</span>",
                                footerTemplate: "<span class='fb'>#=sum#</span>"
                            },
                            {
                                field: 'GrossWt', filterable: false, title: 'Total AWB Gr Wt.', width: 70, format: GFormat, aggregates: ["sum"],
                                //groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(2)#</span>",
                                footerTemplate: "<span class='fb'>#=(sum).toFixed(2)#</span>"
                            },
                            {
                                field: 'Volume', filterable: false, title: 'Total AWB Vol', width: 70, format: VFormat, aggregates: ["sum"],
                                //groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>",
                                footerTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>"
                            },
                            {
                                headerTemplate: "<span class='hcap'>Used Pcs</span>",
                                field: 'UsedPieces', filterable: false, title: 'Used Pcs', width: 50, aggregates: ["sum"],
                               // template: '#=parseFloat(UsedPieces)>0?\'<input type="button" class="btn-info" ng-click="OpenPopUpPCS(dataItem)" value="\'+UsedPieces+\'">\':UsedPieces#',
                                //groupFooterTemplate: "<span class='fb'>#=sum#</span>",
                                footerTemplate: "<span class='fb'>#=sum#</span>"
                            },
                            {
                                headerTemplate: "<span class='hcap'>Used Gr Wt.</span>",
                                field: 'UsedGrossWt', filterable: false, title: 'Used Gr Wt.', format: GFormat, aggregates: ["sum"],
                                //groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(2)#</span>",
                                footerTemplate: "<span class='fb'>#=(sum).toFixed(2)#</span>", width: 50
                            },
                            {
                                headerTemplate: "<span class='hcap'>Used Vol</span>",
                                field: 'UsedVolume', filterable: false, title: 'Used Vol', format: VFormat, aggregates: ["sum"],
                                //groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>",
                                footerTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>", width: 50
                            },

                        {

                            headerTemplate: "<span class='hcap'>Free Sale Used Capacity</span>",
                            columns: [{ field: "FreeSaleUsedGross", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "FreeSaleUsedVolume", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }, ]
                        },
                        {

                            headerTemplate: "<span class='hcap'>Reserve Used Capacity</span>",
                            columns: [{ field: "ReserveUsedGross", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "ReserveUsedVolume", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }, ]
                        },
                        {

                            headerTemplate: "<span class='hcap'>Allotment Used Capacity</span>",
                            columns: [{ field: "AllotmentUsedGross", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "AllotmentUsedVolume", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }
                            ]
                        },

                       {

                           headerTemplate: "<span class='hcap'>Allotment Variance Used Capacity</span>",
                           columns: [
                            { field: "AllotmentUsedGrossVariance", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "AllotmentUsedVolumeVariance", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }]
                       },

                        {

                            headerTemplate: "<span class='hcap'>Overbook Used Capacity</span>",
                            columns: [{ field: "OverbookUsedGross", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "OverbookUsedVolume", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }, ]
                        }


                            /*,
                            { field: 'AllotmentCode', filterable: false, title: 'Allotment Code' },
                            { field: 'Revenue', filterable: false, title: 'Revenue', format: VFormat, aggregates: ["sum"], 
                            //groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>",
                            footerTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>"
                            },
                            {
                                field: 'Yield', filterable: false, title: 'Yield', format: VFormat, aggregates: ["sum"],
                                //groupFooterTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>",
                                footerTemplate: "<span class='fb'>#=(sum).toFixed(3)#</span>"
                            }*/
                        ]
                    };
                }
            }           

            else
                return {
                    dataSource: new kendo.data.DataSource({
                        type: "json",
                        transport: {
                            read: {
                                url: "../schedule/GetHistory",
                                dataType: "json", type: "post", global: false, data: { SNo: item.item.SNo, HistoryType: item.type },
                            }
                        }
                    }),
                    height: 282,
                    dataBound: function (e) {
                        cfi.DisplayEmptyMessage(e, this);
                    },
                    columns: GetColumns(item.type)
                };
        }


        $scope.PopUpOptionsTooltip = {
          
            filter: "tr:not(.k-grouping-row) :nth-child(n):not(.k-group-cell):not(:empty):not(:contains('\u00a0')):not(:has(div)):not(:has(input)):not(:has(span:not(.k-dirty):not(.k-filter):empty)):not(:has(a))",
          
            content: function (e) {
                var target = e.target;
                return $(target).text;

            }
        }

        $scope.PopUpOptionsPCSTooltip = {

            filter: "tr:not(.k-grouping-row) :nth-child(n):not(.k-group-cell):not(:empty):not(:contains('\u00a0')):not(:has(div)):not(:has(input)):not(:has(span:not(.k-dirty):not(.k-filter):empty)):not(:has(a))",
            content: function (e) {
                var target = e.target;
                return $(target).text();

            }
        }

        $scope.PopUpOptionsPCS = function (item) {
           
                return {

                    dataSource: new kendo.data.DataSource({
                        type: "json",
                        transport: {
                            read: {
                                url: "../schedule/ShipmentCapacityInfo",
                                dataType: "json", type: "post", global: false, data: { DailyFlightSNo: item.DailyFlightSNo, AWBNo: item.AWBNo },
                            }
                        },
                        schema: {
                            model: {
                                fields: {
                                    AWBNo: { type: "string" },
                                    AWBStage: { type: "string" },                                   
                                    Pieces: { type: "number" },
                                    GrossWt: { type: "number" },
                                    Volume: { type: "number" },
                                    FreeSaleUsedGross: { type: "number" },
                                    FreeSaleUsedVolume: { type: "number" },
                                    ReserveUsedGross: { type: "number" },
                                    ReserveUsedVolume: { type: "number" },
                                    AllotmentUsedGross: { type: "number" },
                                    AllotmentUsedVolume: { type: "number" },
                                    AllotmentUsedGrossVariance: { type: "number" },
                                    AllotmentUsedVolumeVariance: { type: "number" },
                                    OverbookUsedGross: { type: "number" },
                                    OverbookUsedVolume: { type: "number" }
                                }
                            },
                            data: function (data) {
                                return data.Table0;
                            }

                        },                        
                            aggregate: [
                                
                                { field: "Pieces", aggregate: "sum" },
                                { field: "GrossWt", aggregate: "sum" },
                                { field: "Volume", aggregate: "sum" },
                                { field: "UsedGrossWt", aggregate: "sum" },
                                { field: "UsedVolume", aggregate: "sum" },
                                { field: "FreeSaleUsedGross", aggregate: "sum" },
                                { field: "FreeSaleUsedVolume", aggregate: "sum" },
                                { field: "ReserveUsedGross", aggregate: "sum" },
                                { field: "ReserveUsedVolume", aggregate: "sum" },
                                { field: "AllotmentUsedGross", aggregate: "sum" },
                                { field: "AllotmentUsedVolume", aggregate: "sum" },
                                { field: "AllotmentUsedGrossVariance", aggregate: "sum" },
                                { field: "AllotmentUsedVolumeVariance", aggregate: "sum" },
                                { field: "OverbookUsedGross", aggregate: "sum" },
                                { field: "OverbookUsedVolume", aggregate: "sum" }
                            ]
                    }),
                    dataBound: function (e) {
                        cfi.DisplayEmptyMessage(e, this);
                    }, filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contains",
                                startswith: "Starts with",
                                eq: "Is equal to",
                                neq: "Is not equal to"
                            }
                        }
                    },
                    columns: [                        
                       // { field: 'AWBNo', filterable: false,  title: 'Reference No. /</br>AWB No. / PO No.', width: 120 },
                        { field: 'AWBStage', filterable: false, title: 'Stage', width: 70 },
                        { field: 'Pieces', filterable: false, aggregate: ["sum"],  footerTemplate: "<span class='fb'>#= sum#</span>", title: 'Pieces', width: 45 },
                        { field: 'GrossWt', filterable: false, aggregate: ["sum"],  footerTemplate: "<span class='fb'>#= sum#</span>", title: 'Gross Wt.', format: GFormat, width: 50 },
                        { field: 'Volume', filterable: false, aggregate: ["sum"],  footerTemplate: "<span class='fb'>#= sum#</span>", title: 'Volume', format: VFormat, width: 50 },
                        { field: 'AllotmentCode', filterable: false, title: 'Allotment Code', width: 70 },
                        {
                            headerTemplate: "<span class='hcap'>Used Gr Wt.</span>",
                            field: 'UsedGrossWt', filterable: false, aggregate: ["sum"],
                            template: "<span style= 'color:#if(IsCapacityUsed==0){#red#} else {#green#}#' >#=UsedGrossWt#</span>",
                            footerTemplate: "<span class='fb'>#= sum#</span>", title: 'Used Gr Wt.', format: GFormat, width: 50
                        },
                        {
                            headerTemplate: "<span class='hcap'>Used Vol</span>",
                            field: 'UsedVolume', filterable: false, aggregate: ["sum"],
                            template: "<span style= 'color:#if(IsCapacityUsed==0){#red#} else {#green#}#' >#=UsedVolume#</span>",
                            footerTemplate: "<span class='fb'>#= sum#</span>", title: 'Used Vol', format: VFormat, width: 50
                        },

                        {

                            headerTemplate: "<span class='hcap'>Free Sale Used Capacity</span>",
                            columns: [{ field: "FreeSaleUsedGross", aggregate: ["sum"],  footerTemplate: "<span class='fb'>#= sum#</span>",  filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "FreeSaleUsedVolume", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }, ]
                        },
                        {

                            headerTemplate: "<span class='hcap'>Reserve Used Capacity</span>",
                            columns: [{ field: "ReserveUsedGross", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "ReserveUsedVolume", aggregate: ["sum"],  footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }, ]
                        },
                        {

                            headerTemplate: "<span class='hcap'>Allotment Used Capacity</span>",
                            columns: [{ field: "AllotmentUsedGross", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "AllotmentUsedVolume", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }
                            ]
                        },

                       {

                           headerTemplate: "<span class='hcap'>Allotment Variance Used Capacity</span>",
                           columns: [
                            { field: "AllotmentUsedGrossVariance", aggregate: ["sum"],  footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "AllotmentUsedVolumeVariance", aggregate: ["sum"],  footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }]
                       },

                        {

                            headerTemplate: "<span class='hcap'>Overbook Used Capacity</span>",
                            columns: [{ field: "OverbookUsedGross", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: GFormat, title: "Gross", width: 65 },
                            {
                                field: "OverbookUsedVolume", aggregate: ["sum"], footerTemplate: "<span class='fb'>#= sum#</span>", filterable: false, format: VFormat, spinner: true, title: "Volume", width: 65
                            }, ]
                        }
                    ]

                };
               
        }
            


        function GetColumns(type) {
            if (type == 'SI')
                return [{ field: 'SNo', width: '60px' }, { field: 'Remarks' }, { field: 'CreateBy', title: 'Create By', width: '130px' }];
            else
                return [{ field: 'SNo', width: '40px' },
                {
                    field: 'Aircraft', width: '70px'
                },
                {
                    field: 'Remarks', width: '200px'
                },
                {
                    field: 'GrossWeight', title: 'Gross', width: '60px'
                },
                {
                    field: 'Volume', title: 'Volume', width: '60px'
                },
                {
                    field: 'WeightPerPax', title: 'Wt. Per Pax', width: '70px'
                },
                {
                    field: 'OpenSeats', width: '60px'
                },
                {
                    field: 'FreeSaleGrossWeight', title: 'FreeSale Gr. Wt.', width: '100px'
                },
                {
                    field: 'FreeSaleVolume', title: 'FreeSale Vol. Wt.', width: '100px'
                },
                {
                    field: 'ReservedGrossWeight', title: 'Rsd Gr. Wt.', width: '100px'
                },
                {
                    field: 'ReservedVolume', title: 'Rsd Vol. Wt.', width: '100px'
                },
                {
                    field: 'OverbookGrossWeight', title: 'Overbook Gr. Wt.', width: '100px'
                },
                {
                    field: 'OverbookVolume', title: 'Overbook Vol. Wt.', width: '100px'
                },
                {
                    field: 'UpdatedBy', title: 'Update By', width: '100px'
                }
                ];

        }

        $scope.ExtraCondition = function (textId) {

            var SearchFilter = cfi.getFilter("AND");

            if (textId == 'Search_FlightNo') {
                if ($scope.Airports != "")
                    cfi.setFilter(SearchFilter, "OriginAirportSNo", "in", $scope.Airports);
                if ($scope.Airlines != "")
                    cfi.setFilter(SearchFilter, "CarrierCode", "in", $scope.Airlines);
                cfi.setFilter(SearchFilter, "ScheduleDate", "eq", $scope.SearchRequest.FlightDate);
            }
            else if (textId == 'S_O') {
                if ($scope.Airports != "")
                    cfi.setFilter(SearchFilter, "OriginAirportSNo", "in", $scope.Airports);
                cfi.setFilter(SearchFilter, "OriginAirportSNo", "neq", $scope.SearchRequest.Destination);
            }
            else if (textId == 'S_D')
                cfi.setFilter(SearchFilter, "DestinationAirportSNo", "neq", $scope.SearchRequest.Origin);
            else if (textId != undefined && textId.split('-')[0] == 'Leg_Aircraft_Grid') {
                cfi.setFilter(SearchFilter, "IsActive", "eq", 1);
                cfi.setFilter(SearchFilter, "CarrierCode", "eq", textId.split('-')[1]); // Get carrier code from textId
                if (textId.split('-')[2] == "True" && $scope.CAO == "2")
                    cfi.setFilter(SearchFilter, "CargoClassification", "in", "4");
                else if (textId.split('-')[2] == "True" && $scope.CAO != "2")
                    cfi.setFilter(SearchFilter, "CargoClassification", "in", "1");
                else
                    cfi.setFilter(SearchFilter, "CargoClassification", "in", $scope.CAO);
            } else if (textId != undefined && textId.split('-')[0] == 'Leg_Reg_Grid') {
                cfi.setFilter(SearchFilter, "AirCraftSNo", "eq", textId.split('-')[1]); // Get ACSNO from textId
                cfi.setFilter(SearchFilter, "IsActive", "eq", 1);
            } else if (textId && textId == 'AirportCode') {
                var routes = $.map($scope.routes, function (i) {
                    return i.Name;

                });
                cfi.setFilter(SearchFilter, "AirportCode", "notin", routes.join(','));
            } if (textId == 'Text_CapacityUtilized') {
                cfi.setFilter(SearchFilter, "LOOKUPTYPENAME", "eq", 'AvlCap');
            }

            return cfi.autoCompleteFilter(SearchFilter);

        }

        $window.ExtraCondition = $scope.ExtraCondition;

        /*------------------------- Reroute flight -----------------------------------------------*/

        $scope.Reroute = function () {


            if ($scope.IsReroute) {
                $scope.tabs.enable($scope.tabs.items()[6]);
                $scope.tabs.select(6);
                BindRoutes();
            }

            else {
                $scope.tabs.disable($scope.tabs.items()[6]);
                $scope.tabs.select(0);
                $scope.IsApply = false;
                $scope.tabs.remove(7);
            }
        }
        $scope.CapDistribution = function () {
            if ($scope.IsSectorCapDistribution) {
                $scope.tabs.enable($scope.tabs.items()[5]);
                $scope.tabs.select(5);
                $scope.ValidateSectorCapacityDistribution(0, "", "", 0);
                $scope.SetAvailableSectorCapacityDistribution();
            }
            else {
                $scope.tabs.disable($scope.tabs.items()[5]);
                $scope.tabs.select(0);
            }

        }
        $scope.SegmentBookingClose = function () {
            if ($scope.IsSegmentBookingOpenClose) {
                $scope.tabs.enable($scope.tabs.items()[4]);
                $scope.tabs.select(4);
            }
            else {
                $scope.tabs.disable($scope.tabs.items()[4]);
                $scope.tabs.select(0);
            }

        }


        $scope.routes = [];
        function BindRoutes() {
            var routeLists = $scope.FlightSearchGridOptions.dataSource._data.toJSON();
            $scope.routes = [];
            $scope.RouteRange = {};
            var isOpen = true;
            var isMAN = false;

            for (var i in routeLists) {
                var icon = "right-arrow.svg";

                if (routeLists[i].DepStatus == "MAN")
                    isOpen = isMAN = true;
                if (routeLists[i].DepStatus == "DEP")
                    isOpen = !(isMAN = false);
                var disabled = isOpen;


                if (routeLists[i].DepStatus == "Open" && isOpen && !isMAN) {
                    icon = 'airplane.svg';
                    $scope.routes.push({ SNo: routeLists[i].SNo, Offset: routeLists[i].Offset, Name: routeLists[i].Board, DepStatus: routeLists[i].DepStatus, disabled: disabled, IsSelect: true, icon: 'airplane.svg', IsAddRoute: isOpen, IsddEnabled: false });
                    isOpen = false;
                    $scope.RouteRange.FromMin = $scope.RouteRange.From = $scope.RouteRange.To = kendo.parseDate(routeLists[i].FlightDate, 'dd-MMM-yyyy', 'en-US');

                }
                else
                    $scope.routes.push({ SNo: routeLists[i].SNo, Offset: routeLists[i].Offset, Name: routeLists[i].Board, DepStatus: isMAN ? 'MAN' : routeLists[i].DepStatus, disabled: disabled, IsSelect: true, icon: icon, IsAddRoute: !isOpen, IsddEnabled: false });
                if (i == routeLists.length - 1)
                    $scope.routes.push({ SNo: routeLists[i].SNo, Offset: routeLists[i].Offset, Name: routeLists[i].Off, DepStatus: isMAN ? 'MAN' : routeLists[i].DepStatus, disabled: disabled, IsSelect: true, icon: 'right-arrow.svg', IsAddRoute: !isOpen, IsddEnabled: false });

            }
            enableLastRoute($scope.routes);

        }


        function filterdata(arr, colval, col) {
            return $.map(arr, function (i) {
                if (i[col] == colval)
                    return i;
            });
        }

        function GetLeg(arr, brd, off) {
            return $.map(arr, function (i) {
                if (i["Board"] == brd && i["Off"] == off)
                    return i;
            });
        }

        function routesChange(newval) {


            var disabled = true;
            var selectedRoutes = [];
            var routes = JSON.parse(newval);

            for (var i in routes) {
                if (routes[i].IsSelect) {
                    var route = angular.copy(routes[i]);
                    route.disabled = disabled;
                    selectedRoutes.push(route);
                    if (routes[i].IsNew && disabled) {
                        disabled = false;
                        selectedRoutes[selectedRoutes.length - 1].disabled = disabled;
                    }
                }
                else {
                    disabled = false;
                    if (selectedRoutes[selectedRoutes.length - 1] != undefined)
                        selectedRoutes[selectedRoutes.length - 1].disabled = disabled;
                    else
                        $scope.IsApplyHide = false;
                }
            }

            var legs = $scope.SegmentsGrid.dataSource._data.toJSON();

            for (var i in selectedRoutes) {
                if (selectedRoutes[i].IsSelect == true && i < selectedRoutes.length - 1) {
                    if (selectedRoutes[parseInt(i) + 1].IsNew || selectedRoutes[i].IsNew) {
                        var newRoute = {};
                        if ($scope.updateRoutes.length > 0)
                            newRoute = angular.copy($scope.updateRoutes[$scope.updateRoutes.length - 1]);
                        else {
                            var leg = filterdata(legs, selectedRoutes[i].SNo, 'SNo');
                            if (leg.length > 0)
                                newRoute = angular.copy(leg[0]);
                            else
                                newRoute = angular.copy(legs[0]);

                        }
                        newRoute.SNo = 0;
                        newRoute.ETD = "";
                        newRoute.ETA = "";
                        newRoute.IsNew = true;
                        newRoute.OriginOffset = selectedRoutes[i].Offset;
                        newRoute.Board = selectedRoutes[i].Name;
                        newRoute.Off = selectedRoutes[parseInt(i) + 1].Name;
                        newRoute.DestOffset = selectedRoutes[parseInt(i) + 1].Offset;
                        newRoute.disabled = false; //selectedRoutes[i].disabled;
                        $scope.updateRoutes.push(newRoute);

                    } else {

                        var existRout = GetLeg(legs, selectedRoutes[i].Name, selectedRoutes[parseInt(i) + 1].Name);
                        if (existRout.length > 0) {
                            var skipRoute = angular.copy(existRout[0]);

                            skipRoute.disabled = selectedRoutes[i].disabled;
                            skipRoute.OriginOffset = filterdata(routes, skipRoute.Board, "Name")[0].Offset;
                            skipRoute.DestOffset = filterdata(routes, skipRoute.Off, "Name")[0].Offset;
                            $scope.updateRoutes.push(skipRoute);
                        }

                    }


                }


            }
            if (((routes.length != $scope.updateRoutes.length + 1) && $scope.updateRoutes.length > 0) || filterdata($scope.updateRoutes, true, 'IsNew').length > 0)
                $scope.IsApplyHide = true;
            else
                $scope.IsApplyHide = false;
        }

        $scope.$watch(function () { return angular.toJson($scope.routes); }, function (newval, oldval) {
            if (newval != oldval) {
                $scope.updateRoutes = [];
                $timeout(function () { routesChange(newval) }, 50);
            }
        });


        $scope.IsddOpen = false; //This flag used to Hide all plus icon in reroute
        $scope.AddRoute = function (item, flag, IsFirst) {
            item.IsddEnabled = flag;
            item.IsAddRoute = !flag;
            item.IsFirst = IsFirst;
            $scope.IsddOpen = flag;
        }

        $scope.RemoveRoute = function (index, item, routes) {
            routes.splice(index, 1);
            enableLastRoute(routes);
        }

        $scope.AddNewRoute = function (index, item, routes, isFist) {

            $('input[name=arpt]').parent().cfValidator();

            if ($('input[name=arpt]').parent().data('cfValidator').validate()) {
                item.IsddEnabled = false;
                item.IsAddRoute = !false;
                $scope.IsddOpen = false;
                var newItem = angular.copy(item);
                newItem.SNo = 0;
                newItem.Name = this.AirportCode.Text;
                newItem.Offset = this.AirportCode.Key;
                newItem.IsNew = true;
                newItem.DepStatus = "Open";
                newItem.IsSelect = true;
                newItem.disabled = true;
                newItem.icon = 'right-arrow.svg';
                if (isFist)
                    routes.splice(index, 0, newItem);
                else
                    routes.splice(index + 1, 0, newItem);

                enableLastRoute(routes);
            }

        }

        function enableLastRoute(routes) {
            var isOpen = true;
            var isMAN = false;

            for (var i in routes) {
                if (routes[i].DepStatus == "MAN") {
                    isOpen = isMAN = true;
                    routes[i].IsAddRoute = false;
                }
                if (routes[i].DepStatus == "DEP") {
                    isOpen = !(isMAN = false);
                    routes[i].IsAddRoute = false;
                }
                var disabled = isOpen;
                routes[i].IsFirst = false;
                if (routes[i].DepStatus == "Open" && isOpen) {
                    routes[i].disabled = (routes[i].IsNew ? isOpen : (routes[i - 1] && routes[i - 1].DepStatus == "DEP"));
                    isOpen = false;
                }
                else if (!routes[i].IsNew)
                    routes[i].disabled = disabled;
                if (routes.length == 2) {
                    routes[i].disabled = true;
                    routes[i].IsSelect = true;
                }

            }
        }

        $scope.ApplyRoute = function () {
            $('#tblUpdateRoute').cfValidator()
            if ($("#tblUpdateRoute").data('cfValidator').validate()) {

                $scope.skiproutes = [];
                $scope.IsApply = true;
                var routes = $.map($scope.routes, function (i) {
                    if (!i.IsSelect)
                        return i.Name;

                });

                var routestr = routes.join(',');
                var segments = $scope.SegmentGridOptions.dataSource._data.toJSON();

                for (var i in segments) {
                    if (routestr.match(segments[i].Board) || routestr.match(segments[i].Off))
                        $scope.skiproutes.push({ SNo: segments[i].SNo, Board: segments[i].Board, Off: segments[i].Off, IsOffload: 'true' });
                }

                var content = '<div id="ReRouteTab"><div kendo-grid="ShipmentGrid" options="ShipmentGridOptions();" ><div><div>';
                AddNewTab('Shipment details for skipped route', content);
            }
        }


        var AddNewTab = function (txt, content) {
            $scope.tabs.insertAfter(
                {
                    text: txt + ' <span ng-click="removeTab($event)" class="k-icon k-i-close"></span>',
                    encoded: false,
                    content: content
                },
                $scope.tabs.tabGroup.children("li:last")
            );
            $compile($scope.tabs.tabGroup.children("li:last"))($scope);
            $scope.tabs.select($scope.tabs.tabGroup.children("li:last").index());
        }
        $scope.removeTab = function (event) {
            $scope.IsApply = false;
            var item = $(event.currentTarget).closest(".k-item");
            $scope.tabs.remove(item.index());
            $scope.tabs.select($scope.tabs.tabGroup.children("li:last").index());
        };


        var shipRequest = function () {
            return { dfsno: $.map($scope.skiproutes, function (i) { return i.SNo; }), isExpand: false, From: kendo.toString($scope.RouteRange.From, 'dd-MMM-yyyy'), To: kendo.toString($scope.RouteRange.To, 'dd-MMM-yyyy') };
        }

        $scope.ShipmentGridOptions = function () {
            return {
                //autoBind: false,
                dataSource: new kendo.data.DataSource({
                    type: "json",
                    transport: {
                        read: {
                            url: "../schedule/GetSkipRouteShip",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json", type: "post", global: false, data: shipRequest
                        },
                        parameterMap: function (options) {
                            if (options.filter == undefined)
                                options.filter = null;
                            if (options.sort == undefined)
                                options.sort = null;
                            return JSON.stringify(options);
                        },
                    },
                    schema: {
                        model: {
                            fields: {
                                Route: { type: "string" },
                                FlightDate: { type: "date" },
                                Shipments: { type: "number" },
                            }
                        }
                    },
                    group: {
                        field: "Route", field2: "FlightDate", aggregates: [
                            { field: "Route", aggregate: "count" },
                            { field: "ULDNo", aggregate: "count" },
                            { field: "Shipments", aggregate: "sum" },

                        ]
                    }
                }),
                detailTemplate: kendo.template($("#template").html()),
                dataBound: function (e) {
                    cfi.DisplayEmptyMessage(e, this);
                },
                scrollable: true,
                sortable: true,
                columns: [
                    { field: "ULDNo", title: "ULD No" },
                    { field: "GrossWeight", title: "Total Weight" },
                    {
                        field: "Shipments", title: "Total Shipment"
                    },
                    {
                        field: "FlightDate", title: "Flight Date", format: '{0:dd-MMM-yyyy}'
                    },
                    {
                        template: BindcheckBox('IsStopOver'), title: "StopOver", width: 100
                    },
                    {
                        template: '<input #=getGuid()# data-valid-msg="Select off point" data-valid="required" ng-model="dataItem.AWBOffPoint"  k-options="OffPointRoute(dataItem.Route,true)" kendo-combo-box style="width:90px;" />',
                        title: "Off Point", width: 125
                    }
                ]
            };
        }



        var offPointdata = function (item, isParent) {
            var isSelect = false;
            return $.merge(["OFLD"], $.map($scope.routes, function (i) {

                if (i.IsSelect && isSelect)
                    return i.Name;
                if (i.IsSelect && item.split('-')[0] == i.Name)
                    isSelect = true;
            }));


        }

        $scope.OffPointRoute = function (filterby, isParent) {
            return {
                dataSource: offPointdata(filterby, isParent),
                filter: "startswith",
                placeholder: "Select Off Point",
                change: function (e) {

                    if (isParent) {
                        var gridid = e.sender.$angular_scope.dataItem.Route.replace(/[: -]/g, '') + e.sender.$angular_scope.dataItem.ULDNo.exRep();
                        var offpt = this.value();
                        var grd = $(e.sender.element).closest('tbody').find('div[kendo-grid="initgrd' + gridid + '"]');
                        if (grd.length > 0)
                            $.map(grd.data('kendoGrid').dataSource._data, function (i) {
                                i.set('AWBOffPoint', offpt);
                            });
                    }
                }
                //separator: ", "

            };
        }

        $scope.ShipmentInitGrid = function (dataItem) {
            return {
                dataSource: {
                    type: "json",
                    transport: {
                        read: function (options) {
                            $.ajax({
                                url: "../schedule/GetSkipRouteShip",
                                dataType: "json",
                                type: "post",
                                global: false,
                                data: { dfsno: dataItem.DailyFlightSNo, isExpand: true, uldSNo: dataItem.ULDStockSNo },
                                success: function (result) {
                                    if (dataItem.AWBOffPoint)
                                        for (var i in result) {
                                            result[i].AWBOffPoint = dataItem.AWBOffPoint;
                                        }
                                    options.success(result);
                                }
                            });
                        },
                    },
                    batch: true,
                },
                dataBound: function (e) {
                    cfi.DisplayEmptyMessage(e, this);
                },
                columns: [
                    { template: "#=AWBNo#", title: "AWBNo" },
                    {
                        template: "#=AWBSector#", title: "AWB Sector"
                    },
                    {
                        template: "#=Pieces#", title: "Pieces"
                    },
                    {
                        template: "#=GrossWeight#", title: "Gross"
                    },
                    {
                        template: "#=VolumeWeight#", title: "Volume"
                    },
                    {
                        template: "#=CBM#", title: "CBM", width: 100
                    },
                    {
                        template: (dataItem.ULDNo.toLowerCase() == 'bulk' || dataItem.IsCart == 1 ? '<input data-valid="required" #=getGuid()# ng-model="dataItem.AWBOffPoint"  k-options="OffPointRoute(\'' + dataItem.Route + '\',false)" kendo-combo-box style="width:90px;" />' : '#=AWBOffPoint#'),
                        title: "Off Point", width: 100
                    },

                ], editable: true
            };
        };

        $scope.OnSelectDayDiff = function (items, item) {
            var ScheduleDate = new Date(item.ScheduleDate);
            ScheduleDate.setDate(ScheduleDate.getDate() + parseInt(item.DayDiff));
            item.FlightDate = kendo.toString(ScheduleDate, 'dd-MMM-yyyy');
        }


        function SetOffPointSNo(Segments, data) {
            $.map(data, function (item) {
                var Origin = "";
                if (item.AWBSector != undefined) {
                    Origin = item.AWBSector.slice(0, 3);
                } else {
                    Origin = item.Route.slice(0, 3);
                }
                for (var i in Segments) {
                    if (Segments[i].Board == Origin && Segments[i].Off == item.AWBOffPoint) {
                        item.OffPointDailyFlightSNo = Segments[i].SNo;
                    }
                }
            });
        }



        $scope.UpdateFlightRoute = function () {
            $scope.IsUpdateFlight = false;
            $('#UpdateRemarks').cfValidator();
            $('#ReRouteTab').cfValidator()

            if ($("#ReRouteTab").data('cfValidator').validate()) {
                var RoutesShipment = [];
                var Routes = $scope.ShipmentGrid.dataSource._data.toJSON();
                var segments = $scope.SegmentGridOptions.dataSource.data().toJSON();

                for (var i in Routes) {
                    // Iterate shipments
                    if (Routes[i].ULDNo.toLowerCase() == 'bulk' || Routes[i].IsCart == 1) {
                        var gridid = Routes[i].Route.exRep() + Routes[i].ULDNo.exRep();
                        var grd = $('#ReRouteTab').find('div[kendo-grid="initgrd' + gridid + '"]');

                        if (grd.length > 0) {
                            var shipmentsdata = grd.data('kendoGrid').dataSource._data.toJSON();
                            $.merge(RoutesShipment, shipmentsdata);
                        }
                    }
                }

                SetOffPointSNo(segments, Routes);//For ULD
                SetOffPointSNo(segments, RoutesShipment);//For Bulk

                var routesDetails = $.map($scope.updateRoutes, function (i) { if (i.disabled == false) return i; });
                var allRoutes = $scope.SegmentsGrid.dataSource._data.toJSON();
                $scope.SearchRequest.FlightNo = allRoutes[0].FlightNo;
                var skpRoutes = shipRequest().dfsno;
                var filterRoute = skpRoutes.join(',');
                var activeRoutes = $.map(allRoutes, function (i) {
                    if (!filterRoute.match(i.SNo))
                        return i.SNo;

                });
                var sector = $.map($scope.routes, function (i) { if (i.IsSelect) return i.Name; });

                if (!$('#UpdateRemarks').data('cfValidator').validate()) {
                    $scope.kwinRemarks.center();
                    $scope.kwinRemarks.open();
                    return false;

                }


                $.ajax({
                    url: "../schedule/UpdateFlightRoute",
                    type: "post",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        BulkShipments: RoutesShipment, ULDShipments: Routes,
                        RoutesDetails: routesDetails, SkipRoutes: skpRoutes,
                        ActiveRoutes: activeRoutes, Routes: sector, Remarks: $scope.UpdateRemarks,
                        FlightNo: $scope.SearchRequest.FlightNo,
                        From: kendo.toString($scope.RouteRange.From, 'dd-MMM-yyyy'), To: kendo.toString($scope.RouteRange.To, 'dd-MMM-yyyy')

                    }),
                    success: function (result) {
                        if (result == 'Success') {
                            ShowMessage('success', 'Success!', "Flight has been Re-Routed successfully.");
                            $scope.kwinRemarks.close();
                            $scope.UpdateRemarks = "";
                            $scope.SearchFlights();

                        } else
                            ShowMessage('warning', result);
                    }
                });


            }


        }

        $scope.UpdateFlightBooingOpenClose = function () {
            $scope.IsUpdateFlight = false;
            $('#UpdateRemarks').cfValidator();
            $('#FlightBookingOpenClose').cfValidator();

            if (!$('#UpdateRemarks').data('cfValidator').validate()) {
                $scope.kwinRemarks.center();
                $scope.kwinRemarks.open();
                return false;

            }

            if ($scope.IsSegmentBookingOpenClose && $("#FlightBookingOpenClose").data('cfValidator').validate() && $scope.UpdateRemarks != undefined && $scope.UpdateRemarks.length > 0) {

                var changedSegModels = [];
                var OldData = $scope.OldSegmentDataSource;
                var data = $scope.SegmentDataSource;

                for (var i = 0; i < data.length; i++) {
                    if (JSON.stringify(data[i].ValidTo.toJSON()) !== JSON.stringify(OldData[i].ValidTo.toJSON()) || data[i].IsBookingClosed !== OldData[i].IsBookingClosed) {
                        changedSegModels.push(
                            {
                                FlightNo: data[i].FlightNo,
                                Origin: data[i].Board,
                                Destination: data[i].Off,
                                ValidFrom: kendo.toString(data[i].ValidFrom, 'dd-MMM-yyyy'),
                                ValidTo: kendo.toString(data[i].ValidTo, 'dd-MMM-yyyy'),
                                Days: DaysToNo(data[i].Days),
                                IsBookingClosed: data[i].IsBookingClosed
                            });
                    }
                }
                $.ajax({
                    url: "../schedule/UpdateFilghtBookingOpenClose",
                    type: "post",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        Model: changedSegModels,
                        Remarks: $scope.UpdateRemarks
                    }),
                    success: function (result) {
                        if (result == 'Success') {
                            ShowMessage('success', 'Success!', "Flight details have been updated.");
                            $scope.kwinRemarks.close();
                            $scope.UpdateRemarks = "";
                            $scope.SearchFlights();

                        } else
                            ShowMessage('warning', result);
                    }
                });
            }
        }

        $scope.UpdateSegmentDetails = function () {
            var SegmentData = $scope.SegmentGridOptions.dataSource;
            var CapDistributeData = $scope.CapDistributeGridOptions.dataSource;
            var LegData = $scope.LegGridOptions.dataSource;
            var IsResetSecCapDist = false;
            SegmentData._data.forEach(function (Sitem, Sidx) {

                var ACSNo = 0;
                var AirCraftSNo = 0;
                var CommercialCapacity = 0;
                var TotalGross = 0;
                var TotalVol = 0;
                var GrossWeight = 0;
                var VolumeWeight = 0;
                var OverBookingCapacity = 0;
                var OverBookingCapacityVolume = 0;
                var ReservedCapacityGrosswt = 0;
                var ReservedCapacityVolwt = 0;
                var FreeSaleCapacity = 0;
                var FreeSaleCapacityVolume = 0;
                var IsSegmentData = false;
                var StarPoint = true;

                LegData._data.forEach(function (Litem, Lidx) {

                    if (Litem.SNo === Sitem.SNo && Litem.IsLeg === Sitem.IsLeg) {

                        SegmentData._data[Sidx].set("ACSNo", Litem.ACSNo, undefined, true);

                        SegmentData._data[Sidx].set("AirCraftSNo", Litem.AirCraftSNo, undefined, true);

                        //SegmentData._data.set("CommercialCapacity", Litem.CommercialCapacity);

                        SegmentData._data[Sidx].set("TotalGross", Litem.TotalGross, undefined, true);
                        SegmentData._data[Sidx].set("TotalVol", Litem.TotalVol, undefined, true);

                        SegmentData._data[Sidx].set("GrossWeight", Litem.GrossWeight, undefined, true);
                        SegmentData._data[Sidx].set("VolumeWeight", Litem.VolumeWeight, undefined, true);

                        SegmentData._data[Sidx].set("OverBookingCapacity", Litem.OverBookingCapacity, undefined, true);
                        SegmentData._data[Sidx].set("OverBookingCapacityVolume", Litem.OverBookingCapacityVolume, undefined, true);

                        SegmentData._data[Sidx].set("ReservedCapacityGrosswt", Litem.ReservedCapacityGrosswt, undefined, true);
                        SegmentData._data[Sidx].set("ReservedCapacityVolwt", Litem.ReservedCapacityVolwt, undefined, true);

                        SegmentData._data[Sidx].set("FreeSaleCapacity", Litem.FreeSaleCapacity, undefined, true);
                        SegmentData._data[Sidx].set("FreeSaleCapacityVolume", Litem.FreeSaleCapacityVolume, undefined, true);

                        CapDistributeData._data[Sidx].set("ACSNo", Litem.ACSNo, undefined, true);
                        CapDistributeData._data[Sidx].set("AirCraftSNo", Litem.AirCraftSNo, undefined, true);
                        //CapDistributeData._data.set("CommercialCapacity", Sitem.CommercialCapacity);

                        CapDistributeData._data[Sidx].set("TotalGross", Litem.TotalGross, undefined, true);
                        CapDistributeData._data[Sidx].set("TotalVol", Litem.TotalVol, undefined, true);

                        CapDistributeData._data[Sidx].set("GrossWeight", Litem.GrossWeight, undefined, true);
                        CapDistributeData._data[Sidx].set("VolumeWeight", Litem.VolumeWeight, undefined, true);

                        CapDistributeData._data[Sidx].set("OverBookingCapacity", Litem.OverBookingCapacity, undefined, true);
                        CapDistributeData._data[Sidx].set("OverBookingCapacityVolume", Litem.OverBookingCapacityVolume, undefined, true);

                        CapDistributeData._data[Sidx].set("ReservedCapacityGrosswt", Litem.ReservedCapacityGrosswt, undefined, true);
                        CapDistributeData._data[Sidx].set("ReservedCapacityVolwt", Litem.ReservedCapacityVolwt, undefined, true);

                        CapDistributeData._data[Sidx].set("FreeSaleCapacity", Litem.FreeSaleCapacity, undefined, true);
                        CapDistributeData._data[Sidx].set("FreeSaleCapacityVolume", Litem.FreeSaleCapacityVolume, undefined, true);

                        IsSegmentData = false;
                    }
                    else if ((',' + Litem.GroupFlightSNo.toString() + ',').indexOf(',' + Sitem.SNo.toString() + ',') >= 0 || (',' + Litem.FWDGroupSNo.toString() + ',').indexOf(',' + Sitem.SNo.toString() + ',') >= 0) {
                        //alert("Litmes" + (',' + Litem.GroupFlightSNo.toString()) + (',' + Litem.FWDGroupSNo.toString() + ',') + "    Sitem" + Sitem.SNo.toString());

                        if (Litem.Board === Sitem.Board) {
                            ACSNo = parseInt(Litem.ACSNo);
                            AirCraftSNo = parseInt(Litem.AirCraftSNo);
                        }
                        else {
                            ACSNo = parseInt(Sitem.ACSNo);
                            AirCraftSNo = parseInt(Sitem.AirCraftSNo);
                        }

                        if (StarPoint) {
                            OverBookingCapacity = parseFloat(Litem.OverBookingCapacity);
                            OverBookingCapacityVolume = parseFloat(Litem.OverBookingCapacityVolume);

                            ReservedCapacityGrosswt = parseFloat(Litem.ReservedCapacityGrosswt);
                            ReservedCapacityVolwt = parseFloat(Litem.ReservedCapacityVolwt);

                            FreeSaleCapacity = parseFloat(Litem.FreeSaleCapacity);
                            FreeSaleCapacityVolume = parseFloat(Litem.FreeSaleCapacityVolume);

                            StarPoint = false
                        }
                        else {
                            FreeSaleCapacity = parseFloat(Litem.FreeSaleCapacity) <= FreeSaleCapacity ? parseFloat(Litem.FreeSaleCapacity) : FreeSaleCapacity;
                            FreeSaleCapacityVolume = parseFloat(Litem.FreeSaleCapacityVolume) <= FreeSaleCapacityVolume ? parseFloat(Litem.FreeSaleCapacityVolume) : FreeSaleCapacityVolume;

                            ReservedCapacityGrosswt = parseFloat(Litem.ReservedCapacityGrosswt) <= ReservedCapacityGrosswt ? parseFloat(Litem.ReservedCapacityGrosswt) : ReservedCapacityGrosswt;
                            ReservedCapacityVolwt = parseFloat(Litem.ReservedCapacityVolwt) <= ReservedCapacityVolwt ? parseFloat(Litem.ReservedCapacityVolwt) : ReservedCapacityVolwt;

                            OverBookingCapacity = parseFloat(Litem.OverBookingCapacity) <= OverBookingCapacity ? parseFloat(Litem.OverBookingCapacity) : OverBookingCapacity;
                            OverBookingCapacityVolume = parseFloat(Litem.OverBookingCapacityVolume) <= OverBookingCapacityVolume ? parseFloat(Litem.OverBookingCapacityVolume) : OverBookingCapacityVolume;
                        }

                        IsSegmentData = true;

                    }

                });


                if (Sitem.IsLeg == "False" && IsSegmentData) {
                    TotalGross = FreeSaleCapacity + ReservedCapacityGrosswt + OverBookingCapacity;
                    TotalVol = FreeSaleCapacityVolume + ReservedCapacityVolwt + OverBookingCapacityVolume;

                    GrossWeight = FreeSaleCapacity + ReservedCapacityGrosswt;
                    VolumeWeight = FreeSaleCapacityVolume + ReservedCapacityVolwt;

                    SegmentData._data[Sidx].set("ACSNo", ACSNo, undefined, true);

                    SegmentData._data[Sidx].set("AirCraftSNo", AirCraftSNo, undefined, true);

                    //SegmentData._data.set("CommercialCapacity", Litem.CommercialCapacity);

                    SegmentData._data[Sidx].set("TotalGross", TotalGross, undefined, true);
                    SegmentData._data[Sidx].set("TotalVol", TotalVol, undefined, true);

                    SegmentData._data[Sidx].set("GrossWeight", GrossWeight, undefined, true);
                    SegmentData._data[Sidx].set("VolumeWeight", VolumeWeight, undefined, true);

                    SegmentData._data[Sidx].set("OverBookingCapacity", OverBookingCapacity, undefined, true);
                    SegmentData._data[Sidx].set("OverBookingCapacityVolume", OverBookingCapacityVolume, undefined, true);

                    SegmentData._data[Sidx].set("ReservedCapacityGrosswt", ReservedCapacityGrosswt, undefined, true);
                    SegmentData._data[Sidx].set("ReservedCapacityVolwt", ReservedCapacityVolwt, undefined, true);

                    SegmentData._data[Sidx].set("FreeSaleCapacity", FreeSaleCapacity, undefined, true);
                    SegmentData._data[Sidx].set("FreeSaleCapacityVolume", FreeSaleCapacityVolume, undefined, true);

                    CapDistributeData._data[Sidx].set("ACSNo", ACSNo, undefined, true);
                    CapDistributeData._data[Sidx].set("AirCraftSNo", AirCraftSNo, undefined, true);
                    //CapDistributeData._data.set("CommercialCapacity", Sitem.CommercialCapacity);

                    CapDistributeData._data[Sidx].set("TotalGross", TotalGross, undefined, true);
                    CapDistributeData._data[Sidx].set("TotalVol", TotalVol, undefined, true);

                    CapDistributeData._data[Sidx].set("GrossWeight", GrossWeight, undefined, true);
                    CapDistributeData._data[Sidx].set("VolumeWeight", VolumeWeight, undefined, true);

                    CapDistributeData._data[Sidx].set("OverBookingCapacity", OverBookingCapacity, undefined, true);
                    CapDistributeData._data[Sidx].set("OverBookingCapacityVolume", OverBookingCapacityVolume, undefined, true);

                    CapDistributeData._data[Sidx].set("ReservedCapacityGrosswt", ReservedCapacityGrosswt, undefined, true);
                    CapDistributeData._data[Sidx].set("ReservedCapacityVolwt", ReservedCapacityVolwt, undefined, true);

                    CapDistributeData._data[Sidx].set("FreeSaleCapacity", FreeSaleCapacity, undefined, true);
                    CapDistributeData._data[Sidx].set("FreeSaleCapacityVolume", FreeSaleCapacityVolume, undefined, true);
                }

            });

            $scope.ValidateSectorCapacityDistribution(0, "", "", 1)

            $scope.$apply();
        }

        var OutputObj = {};
        var IsSetAvlVal = true;
        $scope.ValidateSectorCapacityDistribution = function (SNo, Field, Value, Reset) {

            var PrimaryData = $scope.CapDistributeGridOptions.dataSource._data;
            var SecondaryData = $scope.CapDistributeGridOptions.dataSource._data;
            OutputObj = {};
            var IsPassed = true;
            var IsEditable = true;
            var ContinueLoop = true;
            IsSetAvlVal = true;

            PrimaryData.forEach(function (itemP, idxP) {

                // if (ContinueLoop) {
                var SecCapDisGWT = 0;
                var SecCapDisVWT = 0;

                var CurrentGWT = 0;
                var CurrentVWT = 0;

                var PisLeg = itemP.IsLeg.toLocaleLowerCase() === 'true' ? 1 : 0;

                var CurrentGWTVal = (itemP.SNo === SNo && Field == "SecCapDisGWT" ? parseFloat(Value || 0) : parseFloat(itemP.SecCapDisGWT || 0));
                var CurrentVWTVal = (itemP.SNo === SNo && Field == "SecCapDisVWT" ? parseFloat(Value || 0) : parseFloat(itemP.SecCapDisVWT || 0));


                var CurrentGWT = parseFloat(CurrentGWTVal || 0) > parseFloat(itemP.FreeSaleUsedGross || 0) ? parseFloat(CurrentGWTVal || 0) : parseFloat(itemP.FreeSaleUsedGross || 0);
                var CurrentVWT = parseFloat(CurrentVWTVal || 0) > parseFloat(itemP.FreeSaleUsedVolume || 0) ? parseFloat(CurrentVWTVal || 0) : parseFloat(itemP.FreeSaleUsedVolume || 0);

                //var GWTVal = (itemP.SNo === SNo && Field == "SecCapDisGWT" ? (Value || "") : (itemP.SecCapDisGWT || ""));
                //var VWTVal = (itemP.SNo === SNo && Field == "SecCapDisVWT" ? (Value || "") : (itemP.SecCapDisVWT || ""));

                OutputObj[itemP.SNo] = { PointA: "", PointB: "", InsertedGWT: '', InsertedVWT: '', GWT: 0, VWT: 0, AvlGWT: 0, AvlVWT: 0, IsLeg: 0, SecCapDisGWT: "", SecCapDisVWT: "" };

                var TempGT = 0;
                var TempVT = 0;
                var S_GWeight = 0;
                var S_VWeight = 0;

                SecondaryData.forEach(function (itemS, idxS) {

                    var SisLeg = itemS.IsLeg.toLocaleLowerCase() === 'true' ? 1 : 0;

                    var GT = 0;
                    var VT = 0;

                    var SCurrentGWTVal = (itemS.SNo === SNo && Field == "SecCapDisGWT" ? parseFloat(Value || 0) : parseFloat(itemS.SecCapDisGWT || 0));
                    var SCurrentVWTVal = (itemS.SNo === SNo && Field == "SecCapDisVWT" ? parseFloat(Value || 0) : parseFloat(itemS.SecCapDisVWT || 0));

                    if ((',' + itemS.GroupFlightSNo.toString() + ',').indexOf(',' + itemP.SNo.toString() + ',') >= 0 || (',' + itemS.FWDGroupSNo.toString() + ',').indexOf(',' + itemP.SNo.toString() + ',') >= 0) {
                        GT = (parseInt(itemS.SNo) != parseInt(itemP.SNo) ? (parseFloat(itemS.FreeSaleUsedGross || 0) > parseFloat(SCurrentGWTVal || 0) ? parseFloat(itemS.FreeSaleUsedGross || 0) : parseFloat(SCurrentGWTVal || 0)) : 0);

                        VT = (parseInt(itemS.SNo) != parseInt(itemP.SNo) ? (parseFloat(itemS.FreeSaleUsedVolume || 0) > parseFloat(SCurrentVWTVal || 0) ? parseFloat(itemS.FreeSaleUsedVolume || 0) : parseFloat(SCurrentVWTVal || 0)) : 0);

                        if (PisLeg == 0) {
                            if (SisLeg == 1) {

                                GT = (parseFloat(itemS.FreeSaleCapacity) - parseFloat(GT)) >= parseFloat(itemP.FreeSaleCapacity) ? 0 : parseFloat(itemP.FreeSaleCapacity) - (parseFloat(itemS.FreeSaleCapacity) - parseFloat(GT));

                                VT = (parseFloat(itemS.FreeSaleCapacityVolume) - parseFloat(VT)) >= parseFloat(itemP.FreeSaleCapacityVolume) ? 0 : parseFloat(itemP.FreeSaleCapacityVolume) - (parseFloat(itemS.FreeSaleCapacityVolume) - parseFloat(VT));

                                TempGT = TempGT > GT ? TempGT : GT;
                                TempVT = TempVT > VT ? TempVT : VT;
                            }
                            else {
                                S_GWeight = parseFloat((S_GWeight + GT).toFixed(3));
                                S_VWeight = parseFloat((S_VWeight + VT).toFixed(3));
                                //S_GWeight =  GT; //S_GWeight > GT ? S_GWeight : GT;
                                //S_VWeight = VT; //S_VWeight > VT ? S_VWeight : VT;
                            }
                        }
                        else //if (PisLeg == 1)
                        {
                            S_GWeight = parseFloat((S_GWeight + GT).toFixed(3));
                            S_VWeight = parseFloat((S_VWeight + VT).toFixed(3));
                        }
                    }
                    else if ((',' + itemP.FWDGroupSNo.toString() + ',').indexOf(',' + itemS.SNo.toString() + ',') >= 0 && itemP.SNo != itemS.SNo) {


                        GT = (parseInt(itemS.SNo) != parseInt(itemP.SNo) ? (parseFloat(itemS.FreeSaleUsedGross || 0) > parseFloat(SCurrentGWTVal || 0) ? parseFloat(itemS.FreeSaleUsedGross || 0) : parseFloat(SCurrentGWTVal || 0)) : 0);

                        VT = (parseInt(itemS.SNo) != parseInt(itemP.SNo) ? (parseFloat(itemS.FreeSaleUsedVolume || 0) > parseFloat(SCurrentVWTVal || 0) ? parseFloat(itemS.FreeSaleUsedVolume || 0) : parseFloat(SCurrentVWTVal || 0)) : 0);

                        if (PisLeg == 0) {
                            if (SisLeg == 1) {

                                GT = (parseFloat(itemS.FreeSaleCapacity) - parseFloat(GT)) >= parseFloat(itemP.FreeSaleCapacity) ? 0 : parseFloat(itemP.FreeSaleCapacity) - (parseFloat(itemS.FreeSaleCapacity) - parseFloat(GT));

                                VT = (parseFloat(itemS.FreeSaleCapacityVolume) - parseFloat(VT)) >= parseFloat(itemP.FreeSaleCapacityVolume) ? 0 : parseFloat(itemP.FreeSaleCapacityVolume) - (parseFloat(itemS.FreeSaleCapacityVolume) - parseFloat(VT));

                                TempGT = TempGT > GT ? TempGT : GT;
                                TempVT = TempVT > VT ? TempVT : VT;
                            }
                            else {
                                S_GWeight = parseFloat((S_GWeight + GT).toFixed(3));
                                S_VWeight = parseFloat((S_VWeight + VT).toFixed(3));
                                // S_GWeight = GT; //S_GWeight > GT ? S_GWeight : GT;
                                // S_VWeight = VT; //S_VWeight > VT ? S_VWeight : VT;
                            }
                        }
                        else //if (PisLeg == 1)
                        {
                            S_GWeight = parseFloat((S_GWeight + GT).toFixed(3));
                            S_VWeight = parseFloat((S_VWeight + VT).toFixed(3));
                        }
                    }

                });
                //SecCapDisGWT = parseFloat((SecCapDisGWT + (parseInt(itemP.SNo) === parseInt(SNo) && Field == "SecCapDisGWT" ? CurrentGWTVal : 0)).toFixed(3));
                //SecCapDisVWT = parseFloat((SecCapDisVWT + (parseInt(itemP.SNo) === parseInt(SNo) && Field == "SecCapDisVWT" ? CurrentVWTVal : 0)).toFixed(3));

                var PrvSecCapDisGWT = parseFloat((SecCapDisGWT + CurrentGWT + S_GWeight + TempGT).toFixed(3));
                var PrvSecCapDisVWT = parseFloat((SecCapDisVWT + CurrentVWT + S_VWeight + TempVT).toFixed(3));

                SecCapDisGWT = parseFloat((SecCapDisGWT + CurrentGWTVal + S_GWeight + TempGT).toFixed(3));
                SecCapDisVWT = parseFloat((SecCapDisVWT + CurrentVWTVal + S_VWeight + TempVT).toFixed(3));

                var ALGWT = parseFloat(itemP.FreeSaleCapacity || 0) - parseFloat(PrvSecCapDisGWT);
                ALGWT = (ALGWT < 0 ? 0 : ALGWT).toFixed(3);
                var ALVWT = parseFloat(itemP.FreeSaleCapacityVolume || 0) - parseFloat(PrvSecCapDisVWT);
                ALVWT = (ALVWT < 0 ? 0 : ALVWT).toFixed(3);

                OutputObj[itemP.SNo].GWT = SecCapDisGWT;
                OutputObj[itemP.SNo].VWT = SecCapDisVWT;
                OutputObj[itemP.SNo].PointA = itemP.Board;
                OutputObj[itemP.SNo].PointB = itemP.Off;
                OutputObj[itemP.SNo].IsLeg = itemP.IsLeg.toLowerCase() == 'true' ? 1 : 0;
                OutputObj[itemP.SNo].AvlGWT = ALGWT;
                OutputObj[itemP.SNo].AvlVWT = ALVWT;
                OutputObj[itemP.SNo].InsertedGWT = (itemP.SNo === SNo && Field == "SecCapDisGWT" ? Value : itemP.SecCapDisGWT);
                OutputObj[itemP.SNo].InsertedVWT = (itemP.SNo === SNo && Field == "SecCapDisVWT" ? Value : itemP.SecCapDisVWT);

                if (ContinueLoop) {
                    if (parseFloat(itemP.FreeSaleCapacity || 0) < SecCapDisGWT && CurrentGWTVal > 0) {

                        var AvlGWT = parseFloat(itemP.FreeSaleCapacity || 0) - parseFloat(SecCapDisGWT - CurrentGWTVal);
                        AvlGWT = (AvlGWT < 0 ? 0 : AvlGWT).toFixed(3);

                        OutputObj[itemP.SNo].SecCapDisGWT = "Distributed Capacity cannot be greater than the available Free Sale Gross Weight (" + AvlGWT + ")";

                        if (Reset == 1)
                            PrimaryData[idxP].set("SecCapDisGWT", "", undefined, true);

                        IsPassed = false;
                    }
                    else if (parseFloat(itemP.FreeSaleUsedGross || 0) > CurrentGWTVal) {

                        OutputObj[itemP.SNo].SecCapDisGWT = "Distributed Capacity should be greater than or equal to the Used Free Sale Gross Weight (" + parseFloat(itemP.FreeSaleUsedGross || 0).toFixed(3) + ")";

                        if (Reset == 1)
                            PrimaryData[idxP].set("SecCapDisGWT", "", undefined, true);
                        IsPassed = false;
                    }

                    if (parseFloat(itemP.FreeSaleCapacityVolume || 0) < SecCapDisVWT && CurrentVWTVal > 0) {

                        var AvlVWT = parseFloat(itemP.FreeSaleCapacityVolume || 0) - parseFloat(SecCapDisVWT - CurrentVWTVal);
                        AvlVWT = (AvlVWT < 0 ? 0 : AvlVWT).toFixed(3);

                        OutputObj[itemP.SNo].SecCapDisVWT = "Distributed Capacity cannot be greater than the available Free Sale Volume (" + AvlVWT + ")";

                        if (Reset == 1)
                            PrimaryData[idxP].set("SecCapDisVWT", "", undefined, true);

                        IsPassed = false;
                    }
                    else if (parseFloat(itemP.FreeSaleUsedVolume || 0) > CurrentVWTVal) {

                        OutputObj[itemP.SNo].SecCapDisVWT = "Distributed Capacity should be greater than or equal to the Used Free Sale Volume (" + parseFloat(itemP.FreeSaleUsedVolume).toFixed(3) + ")";
                        if (Reset == 1)
                            PrimaryData[idxP].set("SecCapDisVWT", "", undefined, true);

                        IsPassed = false;
                    }
                }
                if (PrimaryData[idxP].id == SNo && OutputObj[SNo][Field] != "" && IsPassed == false) {
                    ShowMessage('warning', 'Warning!', OutputObj[SNo][Field]);
                    //PrimaryData[idxP].set(Field, "", undefined, true);
                    ContinueLoop = false;
                    IsSetAvlVal = false;
                    //ShowMessage('warning', 'Warning!', 'Row No ' + (idxP + 1) + ' GT Weight :- ' + SecCapDisGWT.toString() + ' VT Weight :- ' + SecCapDisVWT.toString());
                }
                else if (PrimaryData[idxP].id == SNo && OutputObj[SNo][Field] == "") {
                    IsPassed = true;
                    ContinueLoop = false;
                    //ShowMessage('warning', 'Warning!', 'Row No ' + (idxP + 1) + ' GT Weight :- ' + SecCapDisGWT.toString() + ' VT Weight :- ' + SecCapDisVWT.toString());
                }
                //}
                /* START Sector Capacity Distribution Grid Row Wise enable Logic */
                /*
                if (SNo > 0 && ((PrimaryData[idxP].id != SNo && PrimaryData[idxP].SecCapDisGWT != "" && PrimaryData[idxP].SecCapDisVWT != "") || (PrimaryData[idxP].id == SNo && GWTVal != "" && VWTVal != "")))
                {
                    if (PrimaryData[idxP + 1] != undefined) {
                        PrimaryData[idxP].IsEdit = 1;
                        PrimaryData[idxP + 1].IsEdit = 1;
                    }
                }
                else if (SNo > 0 && ((PrimaryData[idxP - 1] != undefined && PrimaryData[idxP].SecCapDisGWT != "" && PrimaryData[idxP].SecCapDisVWT != "") || idxP == 0) && ((PrimaryData[idxP].id != SNo && (PrimaryData[idxP].SecCapDisGWT == "" || PrimaryData[idxP].SecCapDisVWT == "")) || (PrimaryData[idxP].id == SNo && (GWTVal == "" || VWTVal == ""))))
                {
                    IsEditable = false;
                    if (PrimaryData[idxP + 1] != undefined)
                    PrimaryData[idxP + 1].IsEdit = 0;
                }

                if(PrimaryData[idxP].id != SNo && SNo>0 && !IsEditable)
                {
                    PrimaryData[idxP].IsEdit = 0;
                }
                */
                /* END Sector Capacity Distribution Grid Row Wise enable Logic */
            });

            return IsPassed
        }

        $scope.SetAvailableSectorCapacityDistribution = function () {
            var PrimaryData = $scope.CapDistributeGridOptions.dataSource._data;
            if (IsSetAvlVal && $scope.IsSectorCapDistribution) {                
                var MainDataJSON = PrimaryData.toJSON();
                MainDataJSON.forEach(function (itemP, idxP) {
                    PrimaryData[idxP].AvlSecCapDisGWT = OutputObj[itemP.SNo].AvlGWT;
                    PrimaryData[idxP].AvlSecCapDisVWT = OutputObj[itemP.SNo].AvlVWT;
                    PrimaryData[idxP].SecCapDisGWT = OutputObj[itemP.SNo].InsertedGWT;
                    PrimaryData[idxP].SecCapDisVWT = OutputObj[itemP.SNo].InsertedVWT;
                    //$timeout(function () {
                    //     PrimaryData[idxP].set("AvlSecCapDisGWT", OutputObj[itemP.SNo].AvlGWT, undefined, true);
                    //     PrimaryData[idxP].set("AvlSecCapDisVWT", OutputObj[itemP.SNo].AvlVWT, undefined, true);
                    // }, 50, true);

                });
            }
            $scope.CapDistributeGridOptions.dataSource.data(PrimaryData);
            $scope.$apply();
        }

        $scope.CheckFlightDateRange = function (e, item, showPrompt) {//FlightNo, ValidFrom, ValidTo, Origin, Destination,
           
            if (showPrompt == 1)
            {
                $.when(ConfirmAlert('\'Valid To\' date would be amended in Capacity Tab as well. Do you wish to Continue ?')).then(function (confirmed) {
                    if (confirmed) {
                        item.OldValidTo = item.ValidTo;
                        $scope.CheckFlightDateRange(e, item, 0);
                    }
                    else
                    {
                        item.ValidTo = item.OldValidTo;
                        $scope.$apply();
                    }
                });
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "../Schedule/CheckFlightDateRange", contentType: "application/json; charset=utf-8", //dataType: "json",
                    data: JSON.stringify({
                        model: { FlightNo: item.FlightNo, ValidFrom: kendo.parseDate(item.ValidFrom, "dd-MMM-yyyy"), ValidTo: kendo.parseDate(item.ValidTo, "dd-MMM-yyyy"), Origin: item.Board, Destination: item.Off }
                    }),
                    success: function (result) {
                        if (result.length > 0)
                            ShowMessage('warning', 'Warning!', result);
                    }
                });
            }
        };

        //$scope.validDate = function (FlightNo, ValidFrom, ValidTo, Board, Off) {            
        //    if (FlightNo.length > 0 && ValidFrom.length > 0 && ValidTo.length > 0 && Board.length > 0, Off.length > 0) {
        //        $scope.CheckFlightDateRange(FlightNo, ValidFrom, ValidTo, Board, Off);
        //    }
        //}

        $scope.DateTimeValidate = function (item, field, items) {

            var Val = item[field];
            var FieldLabel = field.split('Local')[1];

            var DateTimeValidate = new RegExp('^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-([1-2])\\d{3}\\s([0-1][0-9]|[2][0-3]):([0-5][0-9])$');
            if (!DateTimeValidate.test(Val)) {
                if (Val != undefined && Val != "")
                ShowMessage('warning', 'Warning!', "Entered " + FieldLabel + " (" + Val + ") is not in valid Date Time Format (dd-mmm-yyyy hh:mm).");
                item[field] = '';
            }
            else 
            {
                item[FieldLabel] = Val.split(' ')[1];

                if (FieldLabel == "ETD" || FieldLabel == "ETA") {
                    //var FETD;
                    var PETA;
                    var PDestOffSet;
                    var DayDiff=0;
                    var ArrDayDiff=0;
                    var CurruntIdx

                    $scope.LegDataSource.forEach(function (itemC, idx) {
                        
                        var ETD_UTC;
                        var ETA_UTC;
                        var PETA_UTC;
                        if (item.SNo == itemC.SNo)
                        { CurruntIdx = idx; };
                        //FETD = idx == 0 ? itemC.LocalETD : FETD;
                        PETA = idx > 0 ? $scope.LegDataSource[idx - 1].LocalETA : itemC.LocalETA;
                        PDestOffSet = idx > 0 ? $scope.LegDataSource[idx - 1].DestinationOffset : itemC.DestinationOffset;

                        if ((itemC.LocalETD == "" || itemC.LocalETD == null) && (idx < CurruntIdx || CurruntIdx == undefined))
                        {
                            ShowMessage('warning', 'Warning!', "Flight Leg (" + itemC.Board + " " + itemC.Off + ") ETD Cannot blank");
                            item[FieldLabel] = '';
                            item[field] = '';
                            return false;
                        }
                        else if ((itemC.LocalETA == "" || itemC.LocalETA == null) && (idx < CurruntIdx || CurruntIdx == undefined)) {
                            ShowMessage('warning', 'Warning!', "Flight Leg (" + itemC.Board + " " + itemC.Off + ") ETA Cannot blank");
                            item[FieldLabel] = '';
                            item[field] = '';
                            return false;
                        }
                        else if (itemC.LocalETD != "" && itemC.LocalETA != "") {

                              ETD_UTC = LocalUTC(itemC.LocalETD, itemC.OriginOffset, true);
                              ETA_UTC = LocalUTC(itemC.LocalETA, itemC.DestinationOffset, true);
                              PETA_UTC = LocalUTC(PETA, PDestOffSet, true);

                              if (PETA_UTC >= ETD_UTC && idx!=0) {
                                  ShowMessage('warning', 'Warning!', "Flight Leg (" + itemC.Board + "-" + itemC.Off + ") ETD Cannot be less than or equals to previous Leg ETA.");
                                  itemC.ETD = '';
                                  itemC.LocalETD = '';
                                  itemC.DayDiff = "0";
                                  return false;
                              }

                             else if (ETD_UTC >= ETA_UTC) {
                                 ShowMessage('warning', 'Warning!', "Flight Leg (" + itemC.Board + "-" + itemC.Off + ") ETA Cannot be less than or equals to ETD.");
                                 itemC.ETA = '';
                                 itemC.LocalETA = '';
                                 itemC.ArrDayDiff = "0";
                                 return false;
                             }
                                
                            else if (ETD_UTC < ETA_UTC) {
                                DayDiff = ArrDayDiff +  (idx>0 ? getDayDiff(new Date(PETA), new Date(itemC.LocalETD)):0);
                                ArrDayDiff = DayDiff + getDayDiff(new Date(itemC.LocalETD), new Date(itemC.LocalETA));

                                itemC.DayDiff = DayDiff.toString();
                                itemC.ArrDayDiff = ArrDayDiff.toString();
                            }
                         }
                    });
                }
            }
        };

    }]);

angular.bootstrap(document, ["GarudaApp"]);



function HMSToHM(txt) {
    if (txt.lastIndexOf(':') > 4)
        return txt.substr(0, txt.lastIndexOf(':'));
    else
        return txt;
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



function setcolor(val) {
    val = parseFloat(val);
    if (val > 0)
        return "green";
    else
        return "red";
}

var oldModel = null;
var prevColors = [];
function setStatus(model, field) {
    if (oldModel != null && oldModel.Sector != model.Sector) {
        oldModel = null;
        prevColors = [];
    }
    if (oldModel != undefined && oldModel.uid != model.uid) {
        var output = compareVal(oldModel[field], model[field], field);
        if (field == "MaxVolumePerPcs")
            oldModel = model;
        return output;
    } else
        oldModel = model;

    return "green";
}

function setStatusColor(status) {
    if (status.indexOf("onfirm") > 0)
        return "green";
    else
        return "red";
}


function compareVal(old, newval, field) {
    if (Number(old) == Number(newval)) {
        if (prevColors[field] != undefined)
            return prevColors[field];
        else
            return prevColors[field] = "green";
    }
    else {
        if (prevColors[field] != undefined && prevColors[field] == "red")
            return prevColors[field] = "green";
        else
            return prevColors[field] = "red";
    }
}

function LocalUTC(localDateTime, offSet, isUTC) {
    var d = kendo.parseDate(localDateTime, 'dd-MMM-yyyy HH:mm', 'en-US');
    if (isUTC)
        d.setSeconds(d.getSeconds() - parseInt(offSet))
    else
        d.setSeconds(d.getSeconds() + parseInt(offSet))
    return d;
}

function getDayDiff(firstDate, secondDate) {
    firstDate = new Date(firstDate);
    secondDate = new Date(secondDate);
    if (!isNaN(firstDate) && !isNaN(secondDate)) {
        firstDate.setHours(0, 0, 0, 0); //ignore time part
        secondDate.setHours(0, 0, 0, 0); //ignore time part
        var dayDiff = secondDate - firstDate;
        dayDiff = dayDiff / 86400000; // divide by milisec in one day
        return dayDiff;
    } else {
        console.log("Enter valid date.");
    }
}

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf() + days * 24 * 60 * 60 * 1000);
    return dat;
    //return kendo.toString(dat, 'dd-MMM-yyyy');
}

var guidCount = 0;
var getGuid = function () {
    guidCount++;
    return 'name=offpt' + guidCount;
}

if (typeof String.prototype.exRep !== 'function') {
    String.prototype.exRep = function () {
        return this.replace(/[: -]/g, '');
    }
}

function moveToNext(e, gridTab) {
    if (e.keyCode === kendo.keys.TAB && $($(e.target).closest('.k-edit-cell'))[0]) {
        e.preventDefault();
        var currentNumberOfItems = gridTab.dataSource.view().length;
        var row = $(e.target).closest('tr').index();
        var col = gridTab.cellIndex($(e.target).closest('td'));

        var GridCellLength = $(e.target).closest('tr').find('td').length;

        var dataItem = gridTab.dataItem($(e.target).closest('tr'));
        var field = e.target.name;
        var value = $(e.target).val();
        dataItem.set(field, value);

        if (row >= 0 && row < currentNumberOfItems && col >= 0 && col < GridCellLength) {
            var nextCellRow;
            var nextCellCol;

            if (!e.shiftKey) {
                nextCellCol = (col + 1) === GridCellLength ? 0 : col + 1;
            } else {
                nextCellCol = (col - 1) === -1 ? GridCellLength - 1 : col - 1;
            }

            if (!e.shiftKey) {
                nextCellRow = nextCellCol === 0 ? row + 1 : row;
            } else {
                nextCellRow = nextCellCol === GridCellLength - 1 ? row - 1 : row;
            }

            if (nextCellRow >= currentNumberOfItems || nextCellRow < 0) {
                return;
            }

            // wait for cell to close and gridTab to rebind when changes have been made
            if (!gridTab.tbody.find("tr:eq(" + nextCellRow + ") td:eq(" + nextCellCol + ")").is('.noneditable')) {
                setTimeout(function () {
                    gridTab.editCell(gridTab.tbody.find("tr:eq(" + nextCellRow + ") td:eq(" + nextCellCol + ")"));
                });
            } else {
                while (gridTab.tbody.find("tr:eq(" + nextCellRow + ") td:eq(" + nextCellCol + ")").is('.noneditable')) {
                    !e.shiftKey ? nextCellCol++ : nextCellCol--;

                    if (nextCellCol === GridCellLength) {
                        nextCellCol = 0;

                        nextCellRow++;
                    }

                    if (nextCellCol === -1) {
                        nextCellCol = GridCellLength - 1;

                        nextCellRow--;
                    }

                    if (nextCellRow >= currentNumberOfItems || nextCellRow < 0) {
                        return;
                    }
                }
                gridTab.editCell(gridTab.tbody.find("tr:eq(" + nextCellRow + ") td:eq(" + nextCellCol + ")"));
            }

        }
    }
}

var RightsCheck = false;
function PagerightsCheckFlightCapacity() {

    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        

        if (i.PageName.toString().toUpperCase() == "FLIGHT CAPACITY") {
          
                if (i.PageName.toString().toUpperCase() == "FLIGHT CAPACITY" && i.PageRight == "New") {
                    RightsCheck = false;
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.PageName.toString().toUpperCase() == "FLIGHT CAPACITY" && i.PageRight == "Edit") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.PageName.toString().toUpperCase() == "FLIGHT CAPACITY" && i.PageRight == "Delete") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } else if (CheckIsFalse == 0 && i.PageRight == "Read"){
                    RightsCheck = true;
                    return
                }
            
        }
    });
    if (RightsCheck) {

        $('input[value="Update Flight Details"]').hide();
        $('input[value="Update Flight Route"]').hide();
        $('input[value="Update Flight Booking Open/Close"]').hide();
        $('input[value="View History"]').hide();
        $("#CAO").attr("disabled", "disabled");
        $("#Cancel").attr("disabled", "disabled");
        $("#imptAllCap").attr("disabled", "disabled");
        $("#BookingClosed").attr("disabled", "disabled");
        $("#CapDist").attr("disabled", "disabled");
        $("#rerout").attr("disabled", "disabled");
       // 
    }

}
