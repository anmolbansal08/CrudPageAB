// <copyright file="SpaceControl.js" company="Cargoflash">
//
// Created On: 21-Feb-2017
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
var GarudaApp = angular.module('GarudaApp', ["kendo.directives"]);

GarudaApp.controller('GraudaController', function ($scope, $rootScope, $compile, $http, $window) {
    var garuda = this;
    $scope.maxDate = new Date(2018, 0, 1, 0, 0, 0);
    $scope.minDate = new Date();
    $scope.currentDate = kendo.toString(new Date(), 'dd-MMM-yyyy');
    $scope.btnSubmitHide = true;
    $scope.IsManualRoute = true;
    $scope.CurrentPlan;

    $scope.SearchOffloadShipment = function () {
        $scope.divoffloadGrid = false;
        $scope.OffloadShipmentGridOptions.dataSource.read($scope.SearchRequest);
    }



    $scope.OffloadShipmentGridOptions = {
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 5,
            transport: {
                read: {
                    url: "../spaceControl/OffloadShipmentGridData",
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
        filterable: { mode: 'menu'},
        sortable: true, filterable: true,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        columns: [
            { field: "BookingRefNo", title: "Booking Ref No", width: 70 },
            { field: "FlightNo", title: "Flight No", width: "70px", filterable: true, },
            { field: "FlightDate", title: "Flight Date", width: 70 },
            { field: "AWBNo", title: "AWB No", width: 70 },
            { field: "Board", title: "Origin", width: "70px" },
            { field: "Destination", title: "Destination", width: "70px" },
            { field: "Pieces", title: "Pieces", width: 50 },
            { field: "GrossWeight", title: "Gross Weight", width: "60px" },
            { field: "FlightVolume", title: "Volume(CBM)", width: "60px" },
            { field: "Status", title: "Status", width: "50px" },

                    {
                        template: '<input type="button" value="Replan Offload" class="inProgress wa" ng-click="ReplanAWBFlight(dataItem,true);">',
                        title: "Replan", width: "50px"
                    },
        ]
    }



    $scope.toolTipOptions = {
        filter: "td:nth-child(7),td:nth-child(13)",
        position: "top",
        content: function (e) {

            var grid = e.target.closest(".k-grid").getKendoGrid();
            var dataItem = grid.dataItem(e.target.closest("tr"));
            if (e.target != undefined && e.target.context != undefined && e.target.context.cellIndex == 6) {
                if (dataItem.CommodityDesc == "")
                    e.preventDeafult();
                return dataItem.CommodityDesc;
            }
            else if (e.target != undefined && e.target.context != undefined && e.target.context.cellIndex == 12) {
                if (dataItem.SHC == "")
                    e.preventDeafult();
                return dataItem.SHC;
            }
        },
        show: function (e) {
            this.popup.element[0].style.width = "300px";
        }
    }

    //cfi.AutoComplete("AWBNo", "AWBNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null, "contains");
    $scope.K_Options = function (extra_ConditionId, tableName, keyColumn, textColumn, templateColumn, addOnFunction, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template, IsChangeOnBlankValue) {

        return {
            dataTextField: 'Text',
            dataValueField: 'Key',
            select: (onSelect == undefined ? null : onSelect),
            rightAlign: (rightAlign == undefined ? false : rightAlign),
            separator: (separator == undefined ? null : separator),
            template: template == null ? '<span>#: TemplateColumn #</span>' : template,
            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
            newAllowed: newAllowed,
            confirmOnAdd: confirmOnAdd,
            IsChangeOnBlankValue: (IsChangeOnBlankValue == undefined ? false : IsChangeOnBlankValue),
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
                        url: '../Services/AutoCompleteService.svc/AutoCompleteDataSource',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        data: {
                            tableName: tableName,
                            keyColumn: keyColumn,
                            textColumn: textColumn,
                            templateColumn: templateColumn,
                            procedureName: procName
                        }
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

    $scope.K_Text_Options = function (extra_ConditionId, tableName, keyColumn, textColumn, templateColumn, addOnFunction, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template, IsChangeOnBlankValue) {

        return {
            dataTextField: 'Text',
            dataValueField: 'Text',
            select: (onSelect == undefined ? null : onSelect),
            rightAlign: (rightAlign == undefined ? false : rightAlign),
            separator: (separator == undefined ? null : separator),
            template: template == null ? '<span>#: TemplateColumn #</span>' : template,
            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
            newAllowed: newAllowed,
            confirmOnAdd: confirmOnAdd,
            IsChangeOnBlankValue: (IsChangeOnBlankValue == undefined ? false : IsChangeOnBlankValue),
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
                        url: '../Services/AutoCompleteService.svc/AutoCompleteDataSource',
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        data: {
                            tableName: tableName,
                            keyColumn: keyColumn,
                            textColumn: textColumn,
                            templateColumn: templateColumn,
                            procedureName: procName
                        }
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
    $scope.SearchRequest = { FlightDate: kendo.toString(new Date(), 'dd-MMM-yyyy') };
    $scope.SearchFlights = function () {
        
        $("#SpaceControlSearchForm").cfValidator();
        if ($("#SpaceControlSearchForm").data('cfValidator').validate()) {
            var tabtxt = "Space Control Search Result";
            if ($scope.SearchRequest.AWBNo != undefined && $scope.SearchRequest.AWBNo != "")
                tabtxt="AWBNo Details"
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
                GetTabData('../spaceControl/GetAWBNoDetails', 'POST',{ AWBNo: $scope.SearchRequest.AWBNo,IsTab:true }, 'AWBNoDetailsTabDive');
                else
            $scope.searchFlightResultsGridOptions.dataSource.read($scope.SearchRequest);
        }
    }

    function GetTabData(url,type,data,divId){
        $.ajax({
            type: type,
            url: url,
            data:data,
            success: function (result) {
                $('#' + divId).html(result);
                $compile($('#' + divId))($scope);
            }
        });

    }

    $rootScope.GetFlightDetails = function (DailyFlightSNo, FlightNo, FlightDate) {
        $scope.awbDeatilsRequest = { DailyFlightSNo: DailyFlightSNo, FlightNo: FlightNo, FlightDate: kendo.toString(new Date(FlightDate), 'dd-MMM-yyyy') };
        var tabtxt = "Flight Details";
        var item = $scope.tabstrip2.tabGroup.find(':contains("' + tabtxt + '")');
        if (item.length > 0)
            $scope.tabstrip2.select(item.index());
        else
            $scope.AddNewTab(tabtxt, '<div id="FlightDetailsTabDive" ></div>');

        $.ajax({
            type: "GET",
            url: "../spaceControl/FlightDetails",
            data: { DailyFlightSNo: DailyFlightSNo, airPort: 0, FlightNo: FlightNo, FlightDate: kendo.toString(new Date(FlightDate), 'dd-MMM-yyyy'), IsSpace: true },
            success: function (result) {
                $('#FlightDetailsTabDive').html(result);
                $compile($('#FlightDetailsTabDive'))($scope);
            }
        });

    }


    $scope.ViewAWBDetailsTab = function () {
        var tabtxt = "AWB Details";
        var item = $scope.tabstrip2.tabGroup.find(':contains("' + tabtxt + '")');
        if (item.length > 0)
            $scope.tabstrip2.select(item.index());
        else
            $scope.AddNewTab(tabtxt, '<kendo-grid options="AWBDetailsSerachGridOptions"><div k-detail-template><div kendo-tooltip k-options="toolTipOptions"><kendo-grid  k-options="AWBDetailsInitGrid(dataItem)"></kendo-grid></div></div></kendo-grid>');
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
        $scope.tabstrip2.remove(item.index());
        $scope.tabstrip2.select($scope.tabstrip2.tabGroup.children("li:first").index());
    };

    /*Start Replan Flight Region*/
    $scope.replanAWBSelectDetails;
    $scope.ReplanAWBFlight = function (dataItem, isOffloadShipment) {
        $scope.IsOffloadShipment = isOffloadShipment;
        $scope.replanAWBSelectDetails = dataItem;
        var item = $scope.tabstrip2.tabGroup.find(':contains("Replan AWB Flight")');
        if (item.length > 0)
            $scope.tabstrip2.select(item.index());
        else
            $scope.AddNewTab('Replan AWB Flight', '<div id="ReplanFlightDetailsTabDive" ></div>');
        $.ajax({
            type: "POST",
            url: "../spaceControl/ReplanFlight",
            data: { awbSNo: dataItem.AWBSNo },
            success: function (result) {
                $('#ReplanFlightDetailsTabDive').html('');
                $('#ReplanFlightDetailsTabDive').html(result);
                $compile($('#ReplanFlightDetailsTabDive'))($scope);                
                $scope.ExistPlanGridOptions.dataSource.read();
            }
        });
        $scope.btnReplanHide = true;
        $scope.btnResetHide = true;
        $scope.ReplanFlightDivHide = true;

        $scope.CurrentPlanGridOptions.dataSource.data([]);

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

        $scope.SearchReplanRequest = {
            DailyFlightSNo: dataItem.DailyFlightSNo,
            AWBPrefix: dataItem.AWBPrefix,
            AgentSNo: dataItem.AgentSNo,
            ProductSNo: dataItem.ProductSNo,
            CommoditySNo: dataItem.CommoditySNo,
            ItineraryPieces: dataItem.Pieces,
            ItineraryGrossWeight: dataItem.GrossWeight,
            ItineraryVolumeWeight: dataItem.CBM,
            PaymentType: dataItem.PaymentType,
            SPHC: dataItem.SPHCSNo,
            ItineraryFlightNo: '',
            ItineraryDate: kendo.toString(new Date(), 'dd-MMM-yyyy'),
            ItineraryCarrierCode: '',
            ItineraryTransit: '',
            IsMCT : 0,
            ETD: '00:00',
            Origin: DefaultRoute("Origin"),
            Destination: DefaultRoute("Destination"),
            OriginModel: { Key: DefaultRoute("OriginSNo"), Text: DefaultRoute("Origin"), TemplateColumn: DefaultRoute("Origin") },
            DestinationModel: { Key: DefaultRoute("DestinationSNo"), Text: DefaultRoute("Destination"), TemplateColumn: DefaultRoute("Destination") }

        }

    }



    $scope.ExistPlanGridOptions = {
        dataSource: new kendo.data.DataSource({
            type: "json",
            transport: {
                read: {
                    url: "../spaceControl/ReplanFlightDetails",
                    dataType: "json", type: "post", global: false, data: function () { return { AWBRefBookingSNo: $scope.replanAWBSelectDetails.AWBRefBookingSNo, BookedFrom: $scope.replanAWBSelectDetails.BookedFrom, dailyFlightSNo: $scope.replanAWBSelectDetails.DailyFlightSNo}; }
                },
            },
            schema: {
                model: {
                    fields: { FlightNo: { type: "string" }, Is_Origin: { type: 'boolean' }, Is_Destination: { type: 'boolean' } }
                }, data: function (data) {
                    if (data.Table0.length > 0) {
                        $scope.CurrentPlan = angular.copy(data.Table0[0]);
                        $scope.AWBInfo = data.Table0[0];
                        $scope.$apply();
                    }
                    return data.Table1;

                }
            },
        }),
        columns: [
            {
                template: '<input  #= IsDisable==1 ? \'disabled\' : "" # class="k-radio radioCls" #= Is_Origin ? \'checked="checked"\' : "" # id="Is_Origin#=uid#" type="radio" value="cgk"><label class="k-radio-label" for="Is_Origin#=uid#">' +
                '</label><input #= IsDisable==1 ? \'disabled\' : "" # class="k-radio radioCls" #= Is_Destination ? \'checked="checked"\' : "" # id="Is_Destination#=uid#" type="radio" value="cgk"><label class="k-radio-label" for="Is_Destination#=uid#"></label>',
                title: "Select Plan", width: 40
            },
            { field: "FlightNo", title: "Flight No", width: "70px" },
            { field: "FlightDate", title: "Flight Date", width: 70 },
            { field: "Board", title: "Origin", width: "70px" },
            { field: "Off", title: "Destination", width: "70px" },
              { template: "#=ETD.slice(0,5)#", title: "ETD", width: 50 },
            { template: "#=ETA.slice(0,5)#", title: "ETA", width: 50 },
            { field: "Pieces", title: "Pieces", width: 50 },
            { field: "GrossWeight", title: "Gross Weight", width: "60px" },
            { field: "VolumeWeight", title: "Volume(CBM)", width: "60px" },
            { field: "Status", title: "Status", width: "50px" },
            { field: "Remarks", title: "Remarks", width: "50px" },
        ]
    }

    $(document).on('change', '.radioCls', function () {
        var checked = $(this).is(':checked');
        var grid = $scope.exitsPlanGrid;
        var dataItem = grid.dataItem($(this).closest('tr'));
        var dataItems = grid.dataItems();
        if (dataItems.length == 1) {
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
            if (Getselected(dataItems, 'Is_Origin') != undefined && Getselected(dataItems, 'Is_Destination'))
                $scope.btnReplanHide = false;
        }
        $scope.btnResetHide = false;
        $scope.$apply();
    });

    $scope.ResetPlan = function () {
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

    $scope.ReplanFlight = function () {
        var grid = $scope.exitsPlanGrid;
        
        $scope.maxDate = new Date(2018, 0, 1, 0, 0, 0);
        var IsOriginSelected = false;
        var IsDestSelected = false;
        var bothSelected = false;
        $scope.ReplanSectors = [];
        var PrevVal = "";
        var selected = {};
        $.each(grid.dataItems(), function (key, data) {
            if (bothSelected) {
                $scope.maxDate = new Date(data.FlightDate);
                IsOriginSelected = false;
                bothSelected = false;
                //return false;
            }
            var IsSet = false;
            if (data.Is_Origin) {
                IsOriginSelected = IsSet = true;

                $scope.CurrentPlan.Origin = data.Board;
                $scope.CurrentPlan.OriginModel = { Key: data.OriginSNo, Text: data.Board, TemplateColumn: data.Board };
            }
            if (data.Is_Destination) {
                IsDestSelected = IsSet = true;
                $scope.CurrentPlan.Destination = data.Off;
                $scope.CurrentPlan.DestinationModel = { Key: data.DestinationSNo, Text: data.Off, TemplateColumn: data.Off };
            }


            //if (IsSet) {
            //    $scope.CurrentPlan.Pieces += Number(data.Pieces);
            //    $scope.CurrentPlan.GrossWeight += parseFloat(data.GrossWeight);
            //    $scope.CurrentPlan.CBM += parseFloat(data.VolumeWeight);
            //}
            if (IsDestSelected && IsOriginSelected)
                bothSelected = true;
            if (IsDestSelected || IsOriginSelected) {
                if (selected[data.Board] == undefined)
                    selected[data.Board] = { Pieces: 0, Gross: 0, Volume: 0 };
                selected[data.Board].Pieces += parseFloat(data.Pieces);
                selected[data.Board].Gross += parseFloat(data.GrossWeight);
                selected[data.Board].Volume += parseFloat(data.VolumeWeight);

                //ReplanSectors.push(data);
            }

            PrevVal = data.Board;

        });

        $scope.CurrentPlan.Pieces = selected[$scope.CurrentPlan.Origin].Pieces;
        $scope.CurrentPlan.GrossWeight = selected[$scope.CurrentPlan.Origin].Gross;
        $scope.CurrentPlan.CBM = selected[$scope.CurrentPlan.Origin].Volume;
        


        debugger;

        ResetSearchReplanRequest($scope.CurrentPlan);
        $scope.ReplanFlightDivHide = false;
        $scope.replancomboOrigin.enable(false);
        $scope.replancomboDest.enable(true);
        $scope.btnSearchDisable = false;
        $scope.CurrentPlanGridOptions.dataSource.data([]);
        $scope.HideCurrentPlanGrid = true;
        $scope.divSearchPlanHide = true;
    }

    $scope.SearchFlightPlan = function () {
        $scope.IsManualRoute = true;
        $scope.btnSubmitHide = true;
        if ($scope.SelectedRoutes != undefined && $scope.SelectedRoutes.length > 0) {
            $scope.SelectedRoutes = [];
            $scope.CurrentPlanGridOptions.dataSource.data([]);
            $scope.HideCurrentPlanGrid = true;
            ResetSearchReplanRequest($scope.CurrentPlan);
        }
        //if (!IsRateAvailable()) {
        //    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
        //    return false;
        //}
        //if (!IsInternationalBookingAgent()) {
        //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
        //    return false;
        //}
        if (!($scope.SearchReplanRequest.Origin != "" && $scope.SearchReplanRequest.Destination != "" && $scope.SearchReplanRequest.ItineraryDate != '')) {
            ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");
            return false;
        }

        if (kendo.parseFloat($scope.SearchReplanRequest.ItineraryPieces) > 0 && kendo.parseFloat($scope.SearchReplanRequest.ItineraryGrossWeight) > 0 && kendo.parseFloat($scope.SearchReplanRequest.ItineraryVolumeWeight) > 0) {
            $scope.SearchPlanGridOptions.dataSource.read();
            $scope.divSearchPlanHide = false;
        }
        else
            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");

    }


    var IsRateAvailable = function () {
        if ($scope.CurrentPlan.ProductName == "COMAT")
            return true;
        else {
            $.ajax({
                url: "../Services/Shipment/ReservationBookingService.svc/RateAvailableOrNot",
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
            url: "../Services/Shipment/ReservationBookingService.svc/IsInternationalBookingAgent",
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
            url: "../Services/Shipment/ReservationBookingService.svc/ViewRoute?ItineraryOrigin=" + DefaultRoute("OriginSNo") + '&ItineraryDestination=' + DefaultRoute("DestinationSNo") + '&AWBPrefix=' + $scope.SearchReplanRequest.AWBPrefix, async: false, type: "get", dataType: "json", cache: false,
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


    function getCodeNKey(value) {
        var output = {};
        $.ajax({
            url: "../Services/AutoCompleteService.svc/AutoCompleteDataSource",
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

                tableName: "Airport",
                keyColumn: "SNo",
                textColumn: "AirportCode",
                templateColumn: ["AirportCode"],
                take: 10,
                page: 1,
                pageSize: 5,
            }),

            success: function (result) {
                output = result.Data;
            }
        });
        return output;
    }

    $scope.SelectedRoute = function (item) {
        $scope.replancomboOrigin.enable(false);
        $scope.replancomboDest.enable(false);
        $scope.IsManualRoute = false;
        $scope.btnSubmitHide = true;
        $scope.SelectedRoutes = $.map(item.split('-'), function (data) {
            return { O_D: data, Is_Select: false };
        });
        if ($scope.SelectedRoutes.length > 0) {
            if ($scope.SearchReplanRequest.ETD != "00:00")
                ResetSearchReplanRequest($scope.CurrentPlan);
            $scope.CurrentPlanGridOptions.dataSource.data([]);
            var AirportInfoOri = getCodeNKey($scope.SelectedRoutes[0].O_D);
            if (AirportInfoOri.length != undefined && AirportInfoOri.length > 0) {
                $scope.SearchReplanRequest.Origin = $scope.SelectedRoutes[0].O_D;
                $scope.SearchReplanRequest.OriginModel.Text = AirportInfoOri[0].Text;
                $scope.SearchReplanRequest.OriginModel.Key = AirportInfoOri[0].Key;
            } else
                $scope.SearchReplanRequest.Origin = $scope.SelectedRoutes[0].O_D;

            var AirportInfoDest = getCodeNKey($scope.SelectedRoutes[1].O_D);
            if (AirportInfoDest.length != undefined && AirportInfoDest.length > 0) {
                $scope.SearchReplanRequest.Destination = $scope.SelectedRoutes[1].O_D;
                $scope.SearchReplanRequest.DestinationModel.Text = AirportInfoDest[0].Text;
                $scope.SearchReplanRequest.DestinationModel.Key = AirportInfoDest[0].Key;
            } else
                $scope.SearchReplanRequest.Destination = $scope.SelectedRoutes[1].O_D;

            // $scope.SelectedRoutes[0].Is_Select = true;            
            $scope.SearchPlanGridOptions.dataSource.read();
            $scope.win1.close();
            $scope.divSearchPlanHide = false;
            $scope.HideCurrentPlanGrid = true;
        }

    }
    $scope.searchtimeOut = 0;
    $scope.CalculatePieces = function () {
        var TotalPieces = parseFloat($scope.CurrentPlan.Pieces);
        var TotalGross = parseFloat($scope.CurrentPlan.GrossWeight);
        var TotalCBM = parseFloat($scope.CurrentPlan.CBM);

        var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
        if (currentPlanData.length > 0) {
            var dataGroupBy = GroupBy(currentPlanData);
            if (dataGroupBy[$scope.SearchReplanRequest.Origin] != undefined) {
                var selectedPieces = dataGroupBy[$scope.SearchReplanRequest.Origin];
                if (TotalPieces > selectedPieces.Pieces) {
                    TotalPieces = TotalPieces - selectedPieces.Pieces;
                    TotalGross = TotalGross - selectedPieces.Gross;
                    TotalCBM = TotalCBM - selectedPieces.Volume;
                }
            } else if (!$scope.IsManualRoute && itineraryPieces > 0) {
                clearTimeout($scope.searchtimeOut);
                $scope.searchtimeOut = setTimeout(function () { $scope.SearchPlanGridOptions.dataSource.read(); }, 500);
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


    $scope.SearchPlanGridOptions = {
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            transport: {
                read: {
                    url: "../Services/Shipment/ReservationBookingService.svc/SearchFlightResult",
                    dataType: "json",
                    type: "GET",
                    global: false,
                    data: function () {
                        if ($scope.SearchReplanRequest.ETD != "00:00") {
                            $scope.SearchReplanRequest.ETD = "00:00";
                            $scope.SearchReplanRequest.ItineraryDate = kendo.toString(new Date($scope.CurrentPlan.FlightDate), 'dd-MMM-yyyy');
                        }
                        var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
                        if (currentPlanData.length > 0) {

                            var data = currentPlanData[currentPlanData.length - 1];
                            var dataGroupBy = GroupBy(currentPlanData);

                            var selectedPieces = 0;
                            if (dataGroupBy[$scope.SearchReplanRequest.Origin] != undefined)
                                selectedPieces = dataGroupBy[$scope.SearchReplanRequest.Origin].Pieces;
                            var previousRoutePieces = 0;
                            var ItineraryPieces = parseFloat($scope.SearchReplanRequest.ItineraryPieces) + selectedPieces;
                            var IsCheck = true;
                            var previousRoute = $.map(currentPlanData, function (item) {
                                if (IsCheck) {
                                    previousRoutePieces += parseFloat(item.Pieces)
                                    if (item.Destination == $scope.SearchReplanRequest.Origin && item.Is_NextRoute == false && ItineraryPieces <= previousRoutePieces) {
                                        IsCheck = false;
                                        return item;
                                    }
                                }
                            });

                            if (previousRoute.length > 0 && ItineraryPieces <= previousRoutePieces) {
                                data = previousRoute[0];
                            }

                            $scope.SearchReplanRequest.ItineraryDate = data.FlightDate;
                            $scope.SearchReplanRequest.ETD = data.ETA.slice(0, 5);
                            $scope.SearchReplanRequest.IsMCT = 1;

                        } else if ($scope.SearchReplanRequest.ETD != "00:00" && ($scope.SelectedRoutes == undefined || $scope.SelectedRoutes.length == 0)) {
                            ResetSearchReplanRequest($scope.CurrentPlan);
                        }
                        return $scope.SearchReplanRequest;
                    }
                },
            },
            schema: {
                model: { id: "FlightNo", fields: { FlightNo: { type: "string" } } },
                data: function (data) {
                    var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
                    var result = JSON.parse(data).Table0;

                    var filterResult = [];
                    for (var i = 0; i < result.length; i++) {
                        var isAdd = true;
                        for (var j = 0; j < currentPlanData.length; j++) {
                            if (currentPlanData[j].FlightNo == result[i].FlightNo && currentPlanData[j].FlightDate == result[i].FlightDate && currentPlanData[j].Origin == result[i].Origin && currentPlanData[j].Destination == result[i].Destination) {
                                isAdd = false;
                                break;
                            }
                        }
                        if (isAdd)
                            filterResult.push(result[i]);
                        isAdd = true;
                    }

                    return filterResult;
                }
            }
        }),
        dataBound: function (e) {
            cfi.DisplayEmptyMessage(e, this);
            var grid = this;
            if (grid.dataSource._data.length>0)
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
                                url: "../Services/Shipment/ReservationBookingService.svc/BindAllotmentArray",
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
        columns: [{ field: 'FlightNo', width: 30 },
            { field: 'FlightDate', title: 'Flight Date', width: 40 },
            { template: '#=Origin#/#=Destination#', title: 'Origin/Dest', width: 30 },
            { template: '#=ETD.slice(0,5)#/#=ETA.slice(0,5)#', title: 'ETD/ETA', width: 35 },
            { template: '#=AircraftType.toUpperCase()#', title: 'Aircraft Type', width: 35 },
            { template: '#=GrossWeight#', title: 'Flight Capacity Gr.Wt.', width: 50 },
            { template: '#=Volume#', title: 'Flight Capacity Vol', width: 50 },
            { template: '#=FreeSaleGrossAvailUsed#', title: 'Free Space Gr. Wt.', width: 50 },
            { template: '#=FreeSaleVolumeAvailUsed#', title: 'Free Space Vol', width: 50 },
            { template: '#=AllocatedGrossAvailUsed#', title: 'Allocated Gr. Wt.', width: 50 },
            { template: '#=AllocatedVolumeAvailUsed#', title: 'Allocated Vol', width: 50 },
            { template: '#=MaxGrossPerPcs#', title: 'Max Gross Per Pcs', width: 45 },
            { template: '#=MaxVolumePerPcs#', title: 'Max Vol Per Pcs', width: 40 },
            { template: '<input class="allotmentdd" data-bind="value:Origin" />', title: 'Allotment Code', width: 40 },
            { template: '#=OverFlightCapacity=="0"?\'<input type="button" class="btn-success" ng-click="SelectFlight(dataItem)" value="Select">\':""#', title: "Action", width: 30 }

        ]
    }

    $scope.SelectFlight = function (dataItem) {

        $scope.SearchReplanRequest.DailFlightSNo = dataItem.DailyflightSNo;
        var IsConfirmData = true;
        var SoftEmbargo = "0";
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
            ShowMessage('warning', 'Information!', "Itinerary Groos Weight can not be greater than Flight Capacity Gr. Wt .");
            return false;
        }
        if (ItineraryVolumeWeight > FlightCapacityVol) {
            ShowMessage('warning', 'Information!', "Itinerary Volume can not be greater than Flight Capacity Volume .");
            return false;
        }
        if ((ItineraryGrossWeight > TotalMaxGrossPerPcs) && MaxGrossPerPcs != 0) {
            ShowMessage('warning', 'Information!', "Groos Weight Per Piece check applicable on Flight.");
            return false;
        }
        if (($scope.SearchReplanRequest.ItineraryVolumeWeight > TotalMaxVolumePerPcs) && MaxVolumePerPcs != 0) {
            ShowMessage('warning', 'Information!', "Volume Per Piece check applicable on Flight.");
            return false;
        }
        if (ItineraryPieces <= 0 && ItineraryGrossWeight <= 0 && ItineraryVolumeWeight <= 0) {
            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
            return false;
        }
        $.ajax({
            url: "../Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
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
                                    selectRoute(dataItem, SoftEmbargo);
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
                            selectRoute(dataItem, SoftEmbargo);
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });



    }


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

    var getRoutes = function (data) {
        return $.map($scope.SelectedRoutes, function (data) {
            if (!data.Is_Select)
                return data;
        });
    }



    var selectRoute = function (dataItem, SoftEmbargo) {
        $.ajax({
            type: "GET",
            url: "../Services/Shipment/ReservationBookingService.svc/SelectdRoute",
            data: { DailFlightSNo: dataItem.DailyflightSNo || dataItem.DailyFlightSNo },
            contentType: "application/json; charset=utf-8", cache: false,
            global: false,
            success: function (result) {
                var jsonResult = JSON.parse(result).Table0;
                if (jsonResult.length > 0) {
                    var dataResult = $.map(jsonResult, function (item) {
                        item.Pieces = $scope.SearchReplanRequest.ItineraryPieces;
                        item.CBM = $scope.SearchReplanRequest.ItineraryVolumeWeight;
                        item.GrossWeight = $scope.SearchReplanRequest.ItineraryGrossWeight;
                        item.SoftEmbargo = SoftEmbargo;
                        item.AdviceStatusCode = '';
                        item.AllotmentCode = dataItem.AllotmentCode || '';
                        item.AllotmentSNo = dataItem.AllotmentSNo || 0;
                        item.Is_Delete = true;
                        item.Is_NextRoute = false;
                        return item;
                    });

                    $scope.HideCurrentPlanGrid = false;
                    var existData = $scope.CurrentPlanGridOptions.dataSource.data();
                    if (existData.length > 0 && dataResult.length > 0) {
                        $.map(existData, function (item) { item.set("Is_Delete", false); })
                        existData.push(dataResult[0]);
                    } else
                        $scope.CurrentPlanGridOptions.dataSource.data(dataResult);
                    $scope.SearchPlanGridOptions.dataSource.data([]);
                    $scope.divSearchPlanHide = true;

                    var dataIn = $scope.CurrentPlanGridOptions.dataSource.data();
                    var dataOut = GroupBy(dataIn);
                    var selectedRoutes = dataOut[$scope.SearchReplanRequest.Origin];
                    var pieces = selectedRoutes.Pieces;
                    var gross = selectedRoutes.Gross;
                    var CBM = selectedRoutes.Volume;

                    var oldPieces = parseFloat($scope.CurrentPlan.Pieces);
                    if (oldPieces > pieces) {
                        $scope.replancomboDest.enable(false);
                        $scope.SearchReplanRequest.ItineraryPieces = (oldPieces - pieces);
                        $scope.SearchReplanRequest.ItineraryGrossWeight = (parseFloat($scope.CurrentPlan.GrossWeight) - gross).toFixed(2);
                        $scope.SearchReplanRequest.ItineraryVolumeWeight = (parseFloat($scope.CurrentPlan.CBM) - CBM).toFixed(3);

                        if (!$scope.IsManualRoute && $scope.SelectedRoutes != undefined && $scope.SelectedRoutes.length > 0) {
                            $scope.SearchPlanGridOptions.dataSource.read();
                            $scope.divSearchPlanHide = false;
                        }

                    } else if (oldPieces == pieces) {
                        $scope.SearchReplanRequest.ItineraryPieces = oldPieces;
                        $scope.SearchReplanRequest.ItineraryGrossWeight = parseFloat($scope.CurrentPlan.GrossWeight).toFixed(2);
                        $scope.SearchReplanRequest.ItineraryVolumeWeight = parseFloat($scope.CurrentPlan.CBM).toFixed(3);


                        if ($scope.SearchReplanRequest.Destination == DefaultRoute('Destination')) {
                            $scope.btnSubmitHide = false;
                            $scope.replancomboDest.enable(false);
                            $scope.btnSearchDisable = true;

                        } else if (!$scope.IsManualRoute && $scope.SelectedRoutes != undefined && $scope.SelectedRoutes.length > 0) {
                            var tempRoutes = getRoutes($scope.SelectedRoutes);
                            tempRoutes[0].Is_Select = true;
                            var routes = getRoutes($scope.SelectedRoutes);
                            if (routes.length > 1) {
                                $scope.SearchReplanRequest.Origin = routes[0].O_D;
                                //routes[0].Is_Select = true;
                                $scope.SearchReplanRequest.Destination = routes[1].O_D;
                                $scope.SearchPlanGridOptions.dataSource.read();
                                $scope.divSearchPlanHide = false;
                            } else if (routes.length == 1) {
                                $scope.SearchReplanRequest.Origin = DefaultRoute("Origin");
                                $scope.SearchReplanRequest.Destination = DefaultRoute("Destination");
                                $scope.btnSubmitHide = false;

                            }
                        } else {
                            $scope.SearchReplanRequest.Origin = $scope.SearchReplanRequest.Destination;
                            $scope.SearchReplanRequest.Destination = '';
                            $scope.replancomboDest.enable(true);
                        }
                    }

                    $scope.$apply();
                }
            }
        });

    }

    var GroupBy = function (data) {
        var dataOut = [];
        $.each(data, function (index, element) {
            if (dataOut[element.Origin] == undefined)
                dataOut[element.Origin] = { Pieces: 0, Gross: 0, Volume: 0 };
            dataOut[element.Origin].Pieces += parseFloat(element.Pieces);
            dataOut[element.Origin].Gross += parseFloat(element.GrossWeight);
            dataOut[element.Origin].Volume += parseFloat(element.CBM);
        });
        return dataOut;
    }

  

    $scope.CurrentPlanGridOptions = {
        autoBind: false,
        dataSource: new kendo.data.DataSource(),
        dataBound: function (e) {
            cfi.DisplayEmptyMessage(e, this);
            var grid = this;
            $(".advice").each(function () {
                var dropdown = $(this);
                var tr = dropdown.closest('tr');
                var model = grid.dataItem(tr);

                var $filter1 = new Array();
                $filter1.push({ field: "AdviceStatusCode", operator: "neq", value: 'UU' });
                $filter1.push({ field: "IsActive", operator: "eq", value: 1 });
                dropdown.kendoDropDownList({
                    autoBind: false,
                    optionLabel: "Select",
                    dataTextField: "Text",
                    dataValueField: "Key",
                    dataSource: adviceDataSource,
                    change: function (ev) {
                        if (this.value() == "")
                            model.AdviceStatusCode = '';
                        else
                            model.AdviceStatusCode = this.text();
                    },

                }).data("kendoDropDownList").dataSource.filter($filter1);


            });

        },
        scrollable: false,
        columns: [{ template: '#=FlightNo#', title: 'Flight No', width: 40 },
            { template: '#=FlightDate#', title: 'Flight Date', width: 50 },
            { template: '#=Origin#/#=Destination#', title: 'Origin/Dest', width: 50 },
            { template: '#=ETD.slice(0,5)#/#=ETA.slice(0,5)#', title: 'ETD/ETA', width: 50 },
            { template: '#=AircraftType#', title: 'Aircraft Type', width: 50 },
            { template: '#=Pieces#', title: 'Pieces', width: 50 },
            { template: '#=GrossWeight#', title: 'Gross Weight', width: 50 },
            { template: '#=CBM#', title: 'Volume(CBM)', width: 50 },
            { template: '#=AllotmentCode#', title: 'Allotment Code', width: 45 },
            { template: '<div class="advice"></div>', headerTemplate: "<span class='hawb'>Advice</span>", width: 50 },

           { template: '#=Is_Delete?\'<input type="button" class="btn-primary" ng-click="DeleteFlight(dataItem)" value="Delete">\':""#', title: "Action", width: 25 }

        ]
    }

    $scope.DeleteFlight = function (dataItem) {
        $scope.SearchPlanGridOptions.dataSource.data([]);
        $scope.btnSubmitHide = true;
        $scope.btnSearchDisable = false;
        var existData = $scope.CurrentPlanGridOptions.dataSource.data();
        existData.remove(dataItem);

        var dataOut = GroupBy(existData);
        var oldPieces = parseFloat($scope.CurrentPlan.Pieces);
        var oldGross = parseFloat($scope.CurrentPlan.GrossWeight);
        var oldCBM = parseFloat($scope.CurrentPlan.CBM);
        $scope.SearchReplanRequest.ItineraryPieces = oldPieces;
        $scope.SearchReplanRequest.ItineraryGrossWeight = oldGross;
        $scope.SearchReplanRequest.ItineraryVolumeWeight = oldCBM;
        $scope.replancomboDest.enable(true);
        if (dataOut[dataItem.Origin] != undefined) {
            var selectedRoutes = dataOut[dataItem.Origin];
            var pieces = selectedRoutes.Pieces;
            var gross = selectedRoutes.Gross;
            var CBM = selectedRoutes.Volume;

            if (oldPieces > pieces) {
                $scope.SearchReplanRequest.ItineraryPieces = (oldPieces - pieces);
                $scope.SearchReplanRequest.ItineraryGrossWeight = (oldGross - gross).toFixed(2);
                $scope.SearchReplanRequest.ItineraryVolumeWeight = (oldCBM - CBM).toFixed(3);
                $scope.replancomboDest.enable(false);
            }
        }

        $scope.SearchReplanRequest.Destination = dataItem.Destination;
        $scope.SearchReplanRequest.Origin = dataItem.Origin;

        if ($scope.SelectedRoutes != undefined && $scope.SelectedRoutes.length > 0) {
            var isFalse = true;
            $.map($scope.SelectedRoutes, function (item) {
                if (item.O_D == dataItem.Origin)
                    isFalse = false;
                if (!isFalse)
                    item.Is_Select = isFalse;
            });
            $scope.SearchPlanGridOptions.dataSource.read();
            $scope.divSearchPlanHide = false;

        }

        if (existData.length > 0) {
            existData[existData.length - 1].set("Is_Delete", true);
        } else {
            $scope.replancomboDest.enable(true);
            $scope.HideCurrentPlanGrid = true;
            //$scope.$apply();
        }
    }


    $scope.SubmitReplan = function () {

        $.ajax({
            type: "POST",
            url: '../SpaceControl/SubmitReplan',
            contentType: 'application/json',
            data: JSON.stringify({ BookingRefNo: $scope.CurrentPlan.ReferenceNumber, BookedFrom: $scope.replanAWBSelectDetails.BookedFrom, aWBDetails: $scope.CurrentPlan, ItineraryDetails: $scope.CurrentPlanGridOptions.dataSource.data().toJSON() }),
            success: function (result) {
                result = JSON.parse(result);
                if (result.Table0 != undefined && result.Table0.length > 0 && result.Table0[0].Result == 'Success') {
                    ShowMessage('success', 'Success - Shipment has been replanned.', " ", "bottom-right");
                    if ($scope.IsOffloadShipment)
                        $scope.OffloadShipmentGridOptions.dataSource.read();
                    else
                        $scope.AWBDetailsSerachGridOptions.dataSource.read();
                    $scope.tabstrip2.remove($scope.tabstrip2.select());
                    $scope.tabstrip2.select($scope.tabstrip2.tabGroup.children("li:first").index());
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
        dataSource: new kendo.data.DataSource({
            type: "json",
            transport: {
                read: {
                    url: "../spaceControl/spaceControlSearch",
                    dataType: "json",
                    type: "post",
                    global: false,
                    data: function () { return $scope.SearchRequest; }
                },
                //pageSize: 10
            },
            schema: {
                model: {
                    fields: { FlightDate: { type: "date" }, Finalised: { type: "boolean" } }
                }, data: function (data) { return JSON.parse(data); }, total: function (data) { return data.Total; },
            }
        }),
        // height: 500,
        columnMenu: false,
        columns: [{ template: "<span>#= Route.split('-')[0] #</span>", title: "Origin", width: 40 },
                      { template: "<span>#= Route.split('-').pop() #</span>", title: "Destination", width: 40 },
                      { field: "Board", title: "Board", width: 40 },
                      { field: "Off", title: "Off", width: 40 },
                      { field: "FlightDate", title: "Flight Date", format: "{0: dd-MMM-yyyy}", width: 72 },
                      { field: "Route", title: "Routing", width: 60 },
                      { template: '<input type="button" value="#=FlightNo#" ng-click="GetFlightDetails(\'#=DailyFlightSNo#\',\'#=FlightNo#\',\'#=FlightDate#\');" title="View Flight details" class="inProgress wa">', title: "Flight No", width: 60 },
                      { template: "#=ETD.slice(0,5)#", title: "ETD", width: 50 },
                      { field: "TTD", title: "Time<br> To<br>Departure", width: 50 },
                      { template: '<input type="button" value="#=AircraftType#" onclick="GetAircraftInfo(\'#=AirCraftSNo#\',\'#=AircraftType#\');" title="View Aircraft details" class="inProgress wa">', title: "Aircraft", width: 50 },
               {
                   headerTemplate: "<span class='hcap'>Total Capacity</span>",
                   columns: [{ template: '<input type="button" value="#=GrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Available\');">', title: "Gross", width: 75 },
                       { template: '<input type="button" value="#=Volume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Available\');">', title: "Volume", width: 75 }, ]
               }, {

                   headerTemplate: "<span class='hcap'>Used Capacity</span>",
                   columns: [{ template: '<input type="button" value="#=UsedGrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Used\');">', title: "Gross", width: 75 },
                       { template: '<input type="button" value="#=UsedVolume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Used\');">', title: "Volume", width: 75 }, ]
               },
                {

                    headerTemplate: "<span class='hcap'>Remaining Capacity</span>",
                    columns: [{ template: '<input type="button" value="#=RemainingGrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Remaining\');">', title: "Gross", width: 75 },
                        { template: '<input type="button" value="#=RemainingVolume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Remaining\');">', title: "Volume", width: 75 }, ]
                },
                 {

                     headerTemplate: "<span class='hcap'>Reserved Capacity</span>",
                     columns: [{ field: "ReservedGrossWeight", title: "Gross", width: 50 },
                         { field: "ReservedVolume", title: "Volume", width: 50 }, ]
                 }, {

                     headerTemplate: "<span class='hcap'>Overbooked Capacity</span>",
                     columns: [{ field: "OverBookGrossWeight", title: "Gross", width: 50 },
                         { field: "OverbookVolume", title: "Volume", width: 50 }, ]
                 },
                      { headerTemplate: "<span class='hRev'>Revenue</span>", template: "<span class='tdRev'>#=Revenue#</span>", width: 63 },
                      { headerTemplate: "<span class='hYield'>Yield</span>", template: "<span class='tdYield'>#=Yield#</span>", width: 50 },

                      {
                          headerTemplate: "<span class='hQueue'>Queues</span>/<br><span class='hConf'>Confirm</span>",
                          template: "<span class='tdQueue'>#= Queue#</span> / <span class='tdConf'>#= Confirm#</span>", width: 60
                      },
                      { field: "PaxLoad", title: "PAX<br>Load", width: 50 },
                      { template: "#= Finalised ? 'YES' : 'NO' #", title: "Finalised", width: 60 },

        ]

    };



    $scope.AWBDetailsSerachGridOptions = {
        dataSource: new kendo.data.DataSource({
            type: "json",
            transport: {
                read: {
                    url: "../spaceControl/GetFlightRoute",
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
            columns: [{ template: '<input type="button" value="#=GrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Available\');">', title: "Gross", width: 75 },
                { template: '<input type="button" value="#=Volume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Available\');">', title: "Volume", width: 75 },
            ]
        },
        {

            headerTemplate: "<span class='hcap'>Used Capacity</span>",
            columns: [{ template: '<input type="button" value="#=UsedGrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Used\');">', title: "Gross", width: 75 },
                { template: '<input type="button" value="#=UsedVolume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Used\');">', title: "Volume", width: 75 }, ]
        },
                {

                    headerTemplate: "<span class='hcap'>Remaining Capacity</span>",
                    columns: [{ template: '<input type="button" value="#=RemainingGrossWeight#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Remaining\');">', title: "Gross", width: 75 },
                        { template: '<input type="button" value="#=RemainingVolume#" class="inProgress" onclick="ViewCapacity(\'#=DailyFlightSNo#\',\'Remaining\');">', title: "Volume", width: 75 }, ]
                },
        //{ field: "GrossWeight", title: "Available Capacity", width: 100 },
        //{ field: "UsedGrossWeight", title: "Used Capacity", width: 100 },
        //{ field: "RemainingGrossWeight", title: "Remaining Capacity", width: 100 }
        ]
    };



    function UpdateDeleteData(options) {
        var _this = this;
        
        var dataModels = $.map(options.data.models, function (item) {
            if (item.Is_Select && item.AdviceStatusCode != '')
                return item;
        });
        if (dataModels.length == 0) {
            ShowMessage('warning', 'Warning -Please select at least one record and update status', " ", "bottom-right");
            return false;
        }
        $.ajax({
            type: "POST",
            url: "../spaceControl/UpdateAWBList",
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
                            return item;
                    });
                    options.success(uModels);
                    ShowMessage('success', 'Success -Shipment has been updated', " ", "bottom-right");                   
                    $scope.AWBDetailsSerachGridOptions.dataSource.read();
                } else
                    ShowMessage('warning', 'Warning -' + result, " ", "bottom-right");

            }
        });
    }


    $scope.AWBDetailsInitGrid = function (dataItem,IsHidden) {
        return {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        $.ajax({
                            type: "POST",
                            url: "../spaceControl/SearchAWBList",
                            data: { dailyFlightSNo: dataItem.DailyFlightSNo, AWBRefSNo: dataItem.AWBRefBookingSNo,BookedFrom:dataItem.BookedFrom },
                            success: function (result) {
                                options.success(JSON.parse(result));
                            }
                        });
                    },
                    update: UpdateDeleteData,
                   
                },
                schema: {
                    model: {
                        id: "FlightNo", fields: { FlightNo: { type: "string" }, }
                    }//, data: function (data) { return JSON.parse(data); }, total: function (data) { return data.Total; },
                },
                batch: true,

            },
            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);
                var grid = this;
                grid.table.find('.adviceCode').each(function () {
                    var dropdown = $(this);
                    var tr = dropdown.closest('tr');
                    var model = grid.dataItem(tr);
                    var $filter1 = new Array();
                    $filter1.push({ field: "AdviceStatusCode", operator: "neq", value: model.SpaceInfo || "" });
                    $filter1.push({ field: "IsActive", operator: "eq", value: 1 });

                    dropdown.kendoDropDownList({
                        autoBind: false,
                        optionLabel: "Select",
                        dataTextField: "Text",
                        dataValueField: "Key",
                        dataSource: GetDataSource("Text_Grid", "SpaceAdviceStatusCode", "SNo", "AdviceStatusCode"),
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

                    }).data("kendoDropDownList").dataSource.filter($filter1);


                });
            },
            toolbar: ["save", "cancel"],
            columns: [
                { template: '<input type="checkbox" id="eq1#=uid#" ng-model = "dataItem.Is_Select"  class="k-checkbox checkbox chkbx" ><label class="k-checkbox-label" for="eq1#=uid#"></label>', width: 23 },
                { template: "#=BookedFrom#", headerTemplate: "Booking<br>Type", width: 60 },
                { template: '<span class="linkbtn" onclick="GetAWBNoDetails(\'#=AWBNo.toUpperCase()#\',\'#=AWBRefBookingSNo#\',\'#=BookedFrom#\');">#=AWBNo.toUpperCase()#</span>', headerTemplate: "<span>AWB No/ <br> Ref No/CN38</span>", width: 80, hidden: IsHidden },
                { template: "#=Origin#", title: "Origin", width: 40 },
                { template: "#=Dest#", title: "Dest", width: 40 },
                { template: '<span class="linkbtn" onclick="GetAgentDetails(\'#=AWBRefBookingSNo#\',\'#=AgentSNo#\',\'#=BookedFrom#\');">#=Agent#</span>', title: "Agent", width: "60px" },
                { template: "#=CommodityDesc.slice(0,9)#", title: "Commodity", width: "60px" },
                { template: "#=Pieces#", title: "Pieces", width: "40px" },
                { template: "#=Gross#", title: "Gross", width: "50px" },
                { template: "#=Volume#", title: "Volume", width: "50px" },
                { template: "#=CBM#", title: "CBM", width: 60 },
                { template: "#=Chargeable#", headerTemplate: "<span class='hawb'>Chble<br> Wt.</span>", width: 60 },
                { template: "#=SHC.slice(0,10)#", title: 'SHC', width: 50 },
                { template: "#=OriginPriority#", headerTemplate: "<span>Origin<br>Priority</span>", width: "50px" },
                { template: '<span class="linkbtn" onclick="GetOSIRemarks(\'#=AWBSNo#\');">#=Remarks#</span>', title: "OSI/Remarks", width: "80px" },
                { template: "<span class='#=SplitLoaded=='Yes'?\"KK\":\"LL\"#'>#=SplitLoaded#</span>", headerTemplate: "<span class='hawb'>Split <br> Loaded</span>", width: "50px" },
                { template: "#=AgentAllocation#", headerTemplate: "<span class='hawb'>Agent<br>Allocation</span>", width: "50px" },
                { template: "#=Yield#", headerTemplate: "<span class='hawb'>Yield</span>", width: "50px" },
                { template: "#=Revenue#", headerTemplate: "<span class='hawb'>Revenue</span>", width: "50px" },
                { template: "<span class='#=getSpaceInfoClass(SpaceInfo)#'>#=SpaceInfo#</span>", headerTemplate: "<span class='hawb'>Space<br>Info</span>", width: "50px" },

                { template: "#=PriorityName#", headerTemplate: "<span class='hawb'>HDQ<br>Priority<br>/RMKS</span>", width: "50px" },
                { template: "#=AWBStatus#", title: "Status", width: "50px" },
                { headerTemplate: "<span class='hawb'>C/S/O</span>", template: "<div style='width:48px;' class='adviceCode'></div>", width: "50px" },
                {
                    template: '<input type="button" value="Replan" class="inProgress wa" ng-click="ReplanAWBFlight(dataItem,false);">',
                    //template: '<a href="../Index.cshtml?Default.cshtml?Module=Shipment&Apps=ReservationBooking&FormAction=INDEXVIEW" target="_blank">Booking</a>',
                    title: "Replan", width: "50px", hidden: IsHidden
                },

            ], editable: true
        };
    };




    $scope.ExtraCondition = function (textId) {

        var SearchFilter = cfi.getFilter("AND");

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





});

angular.bootstrap(document, ['GarudaApp']);

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
    adviceDataSource = GetDataSource("Text_Grid", "SpaceAdviceStatusCode", "SNo", "AdviceStatusCode");
});


function GetAgentDetails(refSNo, aSNo, BookedFrom) {
    cfi.ShowPopUp("Agent Details", "../spaceControl/GetAgentDetails", { AWBRefBookinSNo: refSNo, agentSNo: aSNo, BookedFrom: BookedFrom }, 800);
}
function GetAWBNoDetails(awbno, AWBRefBookingSNo,BookedFrom) {
    cfi.ShowPopUp("AWB No/Ref No/CN38 No(" + awbno + ") Details", "../spaceControl/GetAWBNoDetails", { AWBRefBookingSNo: AWBRefBookingSNo,BookedFrom:BookedFrom }, 800);
}

function GetAllotmentDetails(AllotmentNo) {
    cfi.ShowPopUp("Allotment Details", "../spaceControl/GetAllotmentDetails", { allotmentSNo: AllotmentNo }, 800);
}

function GetFlightSummary(dailyFlightSNo) {
    cfi.ShowPopUp("Flight Summary", "../spaceControl/GetFlightSummary", { dailyFlightSNo: dailyFlightSNo }, 800);
}

function GetOSIRemarks(awbSNo) {
    cfi.ShowPopUp("OSI Remarks", "../spaceControl/GetOSIRemarks", { awbSNo: awbSNo }, 800);
}

function ViewCapacity(dailyFlightSNo, CapacityType) {
    cfi.ShowPopUp(CapacityType + " Capacity", "../spaceControl/GetCapacity", { dailyFlightSNo: dailyFlightSNo, CapacityType: CapacityType }, 1024);
}

var GetAircraftInfo = function (SNo, aircraftType) {
    cfi.ShowPopUp("Aircraft Details: " + aircraftType,"../spaceControl/GetAircraftDetails", { airCraftSNo: SNo }, 1024);
}

var validDate = function (_this) {
    var dtRegex = new RegExp("^([0]?[1-9]|[1-2]\\d|3[0-1])-(JAN|FEB|MAR|APR|MAY|JUN|JULY|AUG|SEP|OCT|NOV|DEC)-[1-2]\\d{3}$", 'i');
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