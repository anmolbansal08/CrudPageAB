/// <reference path="../../JScript/Schedule/VIewEditFlightV2.js" />
// <copyright file="budget.js" company="Cargoflash">
//
// Created On: 29-August-2019
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
const Read = "R";
const Edit = "E";
const Add = "A";

GarudaApp.controller("GraudaController", ["$scope", "$rootScope", "$compile", "$http", "$window", "$timeout",
    function ($scope, $rootScope, $compile, $http, $window, $timeout) {
        $scope.Environment = Environment.toUpperCase();
        $scope.SearchRequest = { Origin: "", Destination: '' };
        $scope.action = '';
        $scope.isRecordFetch = false;
        $scope.monthSelectorOptions = {
            start: "year",
            depth: "year"
        };

        $scope.onChangeTarget = function () {

        };

        $scope.close = function () {
            $scope.action = "";
            $scope.isRecordFetch = false;
        };

        $scope.FetchData = function () {

            $("#fetchtargetdata").cfValidator();
            if ($("#fetchtargetdata").data('cfValidator').validate()) {
                $scope.isRecordFetch = true;
                $.ajax({
                    url: SiteUrl + "budget/fetchdata",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify($scope.SearchRequest),
                    type: 'post',
                    success: function (result) {

                        $scope.IsBind = true;
                        result = JSON.parse(result);
                        $scope.TargetGridOptions.dataSource.data([]);
                        $.map(result.Table0, function (item) {
                            item.pdata = item.pdata || [];
                        });
                        $scope.TargetGridOptions.dataSource.data(result.Table0);
                        $scope.IsBind = false;

                    },
                    error: function (error) {

                    }
                });
            }

        };



        $scope.IsBind = true;
        $scope.IsEdit = true;
        $scope.TargetGridOptions = {
            autoBind: false, dataSource: new kendo.data.DataSource({
                schema: {
                    model: {
                        id: "SNo",
                        fields: {
                            IsDom: { type: "boolean" },
                            Months: { editable: false },
                            TotalGrossWt: { type: 'number', validation: { default: 0, required: true }, editable: true },
                            TargetPercent: { type: 'number', validation: { required: true }, editable: true },
                            TargetWeight: { type: "number", editable: false },
                            Yeild: { type: "number", validation: { required: true }, editable: true },
                            Revenue: { type: "number", validation: { required: true }, editable: true }
                        }
                    }
                }
            }),
            edit: function (e) {
                var field = e.container.find("input[name]").attr("name");
                if ((field === "TotalGrossWt" || field === "NoOfFlights") && !JSON.parse(e.model.IsManual.toLocaleLowerCase())) {
                    this.closeCell(); // prevent editing
                }
            },
            change: function (e) {
                console.log('change');
            },
            save: function (e) {
                var field = Object.keys(e.values)[0];
                var value = e.values[Object.keys(e.values)[0]];
                var capWt, targetPercent, targetWeight, Yield, revenue;
                if (field === "TargetPercent" && value !== undefined) {

                    capWt = parseFloat(e.model.TotalGrossWt);
                    targetPercent = parseFloat(value);
                    targetWeight = (capWt * targetPercent) / 100;
                    e.model.set('TargetWeight', targetWeight, null, true);

                    revenue = parseFloat(e.model.Revenue);
                    Yield = parseFloat(e.model.Yield);
                    e.model.set('TargetWeight', targetWeight.toFixed(3), null, true);

                    if (Yield > 0) {
                        revenue = targetWeight * Yield;
                        e.model.set('Revenue', revenue.toFixed(2), null, true);
                    }
                    else if (revenue > 0) {
                        Yield = revenue / targetWeight;
                        e.model.set('Yield', Yield.toFixed(2), null, true);
                    }


                } else if (field === "Yield" && value !== undefined) {
                    targetWeight = parseFloat(e.model.TargetWeight);
                    Yield = parseFloat(value);
                    revenue = (targetWeight * Yield);
                    e.model.set('Revenue', revenue, null, true);
                }
                else if (field === "Revenue" && value !== undefined) {
                    targetWeight = parseFloat(e.model.TargetWeight);
                    revenue = parseFloat(value);
                    Yield = revenue / targetWeight;
                    e.model.set('Yield', Yield, null, true);
                }

            },
            detailTemplate: kendo.template($("#template").html()),
            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);
                if ($scope.action !== 'A') {
                    var grid = this;
                    var data = grid.dataSource.data();


                    for (var i = 0; i < data.length; i++) {
                        var row = data[i];
                        if (row.pdata.length > 0) { // checks for the value of the Comment property
                            grid.expandRow("tr[data-uid='" + row.uid + "']"); // expands the row with the specific uid
                        } else {
                            grid.tbody.find("tr[data-uid='" + row.uid + "']").find('.k-hierarchy-cell .k-icon').hide()
                        }
                    }
                }

            },
            dataBinding: function (e) { if (!$scope.IsBind) e.preventDefault(); },
            columns: [

                { field: "Months", title: "Month" },
                { field: "NoOfFlights", title: "No Of Flights" },
                { field: "TotalGrossWt", title: "Capacity Weight(Kg)" },
                { field: "TargetPercent", title: "Target %" },
                { field: "TargetWeight", title: "Target Weight" },
                { field: "Yield", title: "Yield" },
                { field: "Revenue", title: "Target Revenue" }

            ],
            editable: $scope.IsEdit
        };


        $scope.ProductGridOption = function (dataItem) {
            return {

                dataSource: {
                    data: dataItem.pdata,
                    batch: true,
                    schema: {
                        model: {
                            id: "ProductID",
                            fields: {

                                Product: { validation: { required: true } },
                                TargetPercent: { type: "number", validation: { required: true }, editable: true },
                                TargetWeight: { type: "number", editable: false },
                                Yield: { type: "number", editable: true },
                                Revenue: { type: "number", editable: true },
                                pdata: { hidden: true, editable: false }
                            }
                        }
                    }
                },
                toolbar: ["create"],
                dataBound: function (e) {
                    cfi.DisplayEmptyMessage(e, this);
                    if (!$scope.IsEdit)
                        this.wrapper.find('.k-grid-toolbar').hide();
                },
                save: function (e) {
                    //this.pDataItem = dataItem;
                    var field = Object.keys(e.values)[0];
                    var value = e.values[Object.keys(e.values)[0]];
                    var pdata = dataItem.pdata.toJSON() || [];
                    //if (field == "Product") {
                    //    if (pdata.filter(f => f.Product == value).lenght>0) {
                    //        e.preventDefault();
                    //        return false;
                    //    }

                    //}


                    var capWt, targetPercent, targetWeight, Yield, revenue, TotalPercent = 0, TotalTargetWeight = 0, TotalRevenue = 0, TotalYield = 0;


                    for (var i in pdata) {
                        if (pdata[i].Product !== e.model.Product) {
                            TotalPercent += parseFloat(pdata[i].TargetPercent);
                            TotalTargetWeight += parseFloat(pdata[i].TargetWeight);
                            TotalRevenue += parseFloat(pdata[i].Revenue);
                            TotalYield += parseFloat(pdata[i].Yield);
                        }
                    }

                    if (field === "TargetPercent" && value !== undefined) {

                        capWt = parseFloat(dataItem.TotalGrossWt);
                        targetPercent = parseFloat(value);
                        targetWeight = (capWt * targetPercent) / 100;
                        revenue = parseFloat(e.model.Revenue);
                        Yield = parseFloat(e.model.Yield);
                        TotalTargetWeight += targetWeight;
                        e.model.set('TargetWeight', targetWeight.toFixed(3), null, true);
                        if (Yield > 0) {
                            revenue = targetWeight * Yield;
                            e.model.set('Revenue', revenue.toFixed(2), null, true);
                        }
                        else if (revenue > 0) {
                            Yield = revenue / targetWeight;
                            e.model.set('Yield', Yield.toFixed(2), null, true);
                        }

                        dataItem.set('TargetWeight', TotalTargetWeight.toFixed(3), null, true);
                    } else if (field === "Yield" && value !== undefined) {
                        targetWeight = parseFloat(e.model.TargetWeight);
                        Yield = parseFloat(value);
                        revenue = (targetWeight * Yield);
                        e.model.set('Revenue', revenue.toFixed(2), null, true);

                    }
                    else if (field === "Revenue" && value !== undefined) {
                        targetWeight = parseFloat(e.model.TargetWeight);
                        revenue = parseFloat(value);
                        Yield = revenue / targetWeight;
                        e.model.set('Yield', Yield.toFixed(2), null, true);
                    }

                    if (field === "Revenue" || field === "Yield" || field === "TargetPercent") {
                        TotalRevenue += revenue;
                        TotalTargetWeight += targetWeight;
                        TotalYield = TotalRevenue / TotalTargetWeight;
                        dataItem.set('Yield', TotalYield.toFixed(2), null, true);
                        dataItem.set('Revenue', TotalRevenue.toFixed(2), null, true);
                    }
                },
                columns: [
                    { field: "Product", title: "Product", editor: ProductEditor },
                    { field: "TargetPercent", title: "Target %" },
                    { field: "TargetWeight", title: "Target Weight" },
                    { field: "Yield", title: "Yield" },
                    { field: "Revenue", title: "Revenue" },
                    { command: ["destroy"], title: "&nbsp;", hidden: !$scope.IsEdit, width: "100px" }

                ], editable: $scope.IsEdit
            };
        };

        function ProductEditor(container, options) {

            var filterdata = options.model.parent().toJSON() || [];
            filterdata = filterdata.map(f => f.Product).filter(f => { if (f) return f }).join();

            var dropdownlist = $('<input required  />')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Product",
                    autoBind: false,
                    filter: "contains",
                    filterField: 'ProductName',
                    dataTextField: "Text",
                    dataValueField: "Key",
                    change: function (ev) {
                        if (this.value() !== "") {
                            options.model.set("Product", this.text());
                            options.model.set("ProductSNo", this.value());
                        }

                    },
                    dataSource: GetDataSourceV2("Product_Grid`" + filterdata, "ViewNEditFlight_Product")

                }).data('kendoDropDownList');
        }


        $scope.BudgetSearchGridOptions = {
            autoBind: true, dataSource: new kendo.data.DataSource({
                type: "json",
                serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 5,
                transport: {
                    read: {
                        url: SiteUrl + "/budget/SearchBudget",
                        contentType: "application/json; charset=utf-8",
                        type: 'POST',
                        dataType: "json", global: false, data: function () { return "" }
                    }, parameterMap: function (options) {
                        if (options.filter === undefined)
                            options.filter = null;
                        if (options.sort === undefined)
                            options.sort = null; return JSON.stringify(options);
                    },
                },
                schema: {
                    data: function (data) {
                        return data.Table0;
                    }, total: function (data) { return data.Table0; }
                }
            }),
            toolbar: kendo.template($("#toolbartemplate").html()),
            dataBound: function (e) {
                cfi.DisplayEmptyMessage(e, this);                
            },
            columns: [

                {
                    field: "BudgetName", title: "Budget Name",width:250,
                    template: '<input type="button" class="btn-info" ng-click="ViewBudgetDetail(dataItem)" value="#:BudgetName#">'

                },
                { field: "TargetType", title: "Target Type" },
                { field: "Origin", title: "Origin" },
                { field: "Destination", title: "Destination" },
                { field: "Currency", title: "Currency", width: 70},
                { field: "Status", title: "Status" },
                { field: "CreatedOn", title: "Created On" },
                { field: "CreatedBy", title: "Created By" },
                { field: "UpdatedBy", title: "Updated By" },
                { field: "UpdatedOn", title: "Updated On" }

            ]
        };

        $scope.IsUpdate = true;
        $scope.dataItem = {};
        $scope.ViewBudgetDetail = function (dataItem) {
            $scope.dataItem = dataItem;
            if (dataItem.StatusNo === "1")
                $scope.StatusNos = "1,4";
            else if (dataItem.StatusNo === "2")
                $scope.StatusNos = "1,3,4";
            else if (dataItem.StatusNo === "3")
                $scope.StatusNos = "1,3";
            $scope.IsUpdate = JSON.parse(dataItem.IsUpdate);
            $scope.action = 'R';
            $scope.Title = dataItem.BudgetName;
            $scope.isRecordFetch = true;
            $scope.IsEdit = false;
            $scope.SearchRequest.Status = "";
            $.ajax({
                type: "POST",
                url: "../budget/info/" + dataItem.SNo, contentType: "application/json; charset=utf-8",
                success: function (result) {
                    $scope.IsBind = true;
                    result = JSON.parse(result);
                    $scope.TargetGridOptions.dataSource.data([]);
                    $.map(result.Table0, function (item) {
                        item.pdata = JSON.parse(item.pdata || "[]");
                    });
                    $scope.TargetGridOptions.dataSource.data(result.Table0);
                    $scope.IsBind = false;
                }
            });


        };

        $scope.UpdateStatus = function () {
            $("#updateStatustr").cfValidator();
            if ($("#updateStatustr").data('cfValidator').validate()) {
                $.ajax({
                    type: "POST",
                    url: "../budget/UpdateStatus/" + $scope.dataItem.SNo, contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ statusNo: $scope.SearchRequest.Status, remarks: $('#Rmks').val() }),
                    success: function (result) {
                        result = getStatus(result);
                        if (result.Status === "Success") {
                            $scope.action = "";
                            $scope.isRecordFetch = false;
                            ShowMessage('success', 'Success!', result.Msg);
                            $scope.BudgetSearchGridOptions.dataSource.read();
                            $scope.$apply();

                        } else
                            ShowMessage('warning', result.Msg);
                    }
                });

            }
        };

        function getStatus(result) {
            result = JSON.parse(result).Table0 || [];
            if (result.length > 0)
                return { Status: result[0].Status, Msg: result[0].Msg };
            else
                return { Status: "Failed", Msg: "some error occurred" };
        }

        $scope.AddNewBudget = function () {
            $scope.action = Add;
            $scope.isRecordFetch = false;
            $scope.TargetGridOptions.dataSource.data([]);
            $scope.IsEdit = true;
            $scope.Title = "Create New Budget";
            $scope.SearchRequest.Origin = "";
            $scope.SearchRequest.Destination = "";
        };

        $scope.submitBudget = function () {
            $("#tblSearch").cfValidator();
            if ($("#tblSearch").data('cfValidator').validate()) {
                var grid = $('div[options=TargetGridOptions]').getKendoGrid();
                if (grid.tbody.find('.k-edit-cell').length > 0)
                    return false;


                $.ajax({
                    type: "POST",
                    url: "../budget/savebudget", contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        model: {
                            Trans: $scope.TargetGridOptions.dataSource.data(), TargetType: $scope.SearchRequest.TargetType,
                            OriginAirportSNo: $scope.SearchRequest.Origin, DestinationAirportSNo: $scope.SearchRequest.Destination,
                            CurrencySNo: $scope.SearchRequest.Currency, FromMonth: $scope.SearchRequest.From
                        }
                    }),
                    success: function (result) {
                        result = getStatus(result);
                        if (result.Status === "Success") {
                            $scope.action = "";
                            $scope.isRecordFetch = false;
                            ShowMessage('success', 'Success!', result.Msg);
                            $scope.BudgetSearchGridOptions.dataSource.read();
                            $scope.$apply();

                        } else
                            ShowMessage('warning', result.Msg);
                    }
                });
            }
        };
        //$scope.OffloadShipmentGridOptions.dataSource.read();
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

                                if (filter === undefined) {
                                    filter = { logic: "AND", filters: [] };
                                }
                                if (options.filter !== undefined)
                                    filter.filters.push(options.filter);
                                options.filter = filter;
                            }
                            if (options.sort === undefined)
                                options.sort = null;
                            return JSON.stringify(options);
                        }
                    },
                    schema: { data: "Data" }
                })
            };
        };



        $scope.SearchBudgets = function () {

            $("#tblSearch").cfValidator();
            //if ($("#tblSearch").data('cfValidator').validate()) {

            //}
        };



        $scope.ExtraCondition = function (textId) {

            var SearchFilter = cfi.getFilter("AND");
            if (textId === 'S_O') {
                //if ($scope.Airports !== "")
                //    cfi.setFilter(SearchFilter, "OriginAirportSNo", "in", $scope.Airports);
                cfi.setFilter(SearchFilter, "OriginAirportSNo", "neq", $scope.SearchRequest.Destination);
            }
            else if (textId === 'S_D')
                cfi.setFilter(SearchFilter, "DestinationAirportSNo", "neq", $scope.SearchRequest.Origin);
            else if (textId === 'targettype') {
                var _SearchFilter = cfi.getFilter("AND");
                cfi.setFilter(_SearchFilter, "LOOKUPTYPENAME", "eq", 'TargetType');
                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            } else if (textId === 'BudgetMasterStatus') {

                cfi.setFilter(SearchFilter, "LOOKUPTYPENAME", "eq", 'BudgetMasterStatus');
                cfi.setFilter(SearchFilter, "LOOKUPCODE", "notin", $scope.StatusNos);
                //return  cfi.autoCompleteFilter(SearchFilter);
                //return SearchFilter;
            } else if (textId !== undefined && textId.split('`')[0] === 'Product_Grid') {

                cfi.setFilter(SearchFilter, "ProductName", "notin", textId.split('`')[1]);
            }
            return cfi.autoCompleteFilter(SearchFilter);

        }

        $window.ExtraCondition = $scope.ExtraCondition;




    }]);

angular.bootstrap(document, ["GarudaApp"]);



