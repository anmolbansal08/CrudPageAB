//----------------------------------------------------------------------------
// CREATED ON: 30-JAN-2019
// CREATED BY: Tarun K Singh
// Description: Flightwise Discounting
//----------------------------------------------------------------------------

SiteUrl = window.location.origin + '/';
var url = function () { return SiteUrl + "Services/AutoCompleteService.svc/AutoCompleteDataSourceV2"; }
var GarudaApp = angular.module("GarudaApp", ["kendo.directives"]);
var ProductFilterValues = [];
var $filter1 = new Array();
GarudaApp.controller("GraudaController", ["$scope", "$rootScope", "$compile", "$http", "$window",
    function ($scope, $rootScope, $compile, $http, $window) {
        $scope.FlightNo = "";
        $scope.btnSubmitHide = true;
        $scope.maxDate = new Date(new Date().getUTCFullYear() + 1, 0, new Date().getMonth());
        $scope.minDate = new Date();
        $scope.maxStartDate = new Date(new Date().getUTCFullYear() + 1, 0, new Date().getMonth());
        $scope.minEndDate = new Date();
        $scope.isNewrequest = false;
        $scope.FlightDetailsRequest = {
            BookingClosed: '',
            CancelFlight: '',
            ControlCity: '',
            ETA: '',
            ETD: '',
            FlightType: '',
            GrWt: '',
            PiecesMaxVolume: '',
            PiecesMaxWeight: '',
            VolWt: '',
            StartDate: '',
            EndDate: '',
            AlReleaseTime: '',
            Status: '',
            DailyFlightSNo: ''
        };
        $scope.Conditions =
            {
                Agent: [],
                AgentGroup: [],
                SPHC: [],
                SPHCGroup: [],
                Commodity: [],
                IncludeAgent: true,
                IncludeAgentGroup: true,
                IncludeSPHC: true,
                IncludeSPHCGroup: true,
                IncludeCommodity:true
                
            }
        $scope.StartDateChange = function () {
            $scope.minEndDate = $scope.FlightDetailsRequest.StartDate;
        };
        $scope.EndDateChange = function () {
            $scope.maxStartDate = $scope.FlightDetailsRequest.EndDate;
        };
        $scope.GetSlabData = function (dataItem)
        {
            $scope.isNewrequest = true;
            $scope.ShowFlightInfo = true;
            $scope.ShowGrid = true;
            ///$filter1.push({ field: "IsActive", operator: "eq", value: 1 });
            

            //service here 
            $http.post('/FlightWiseDiscoutingForRate/GetFlightInformation', {
                FlightDate: dataItem.FlightDate, Origin: dataItem.Origin,
                Destination: dataItem.Destination, FlightNo: dataItem.FlightNo
            }).then(function (result) {
                $scope.FlightDetailsRequest.AircraftType = result.data.Table0[0].AircraftType;
                $scope.FlightDetailsRequest.BookingClosed = result.data.Table0[0].BookingClosed == "true" ? true : false;
                $scope.FlightDetailsRequest.CancelFlight = result.data.Table0[0].CancelFlight == "true" ? true : false;
                $scope.FlightDetailsRequest.ControlCity = result.data.Table0[0].ControlCity;
                $scope.FlightDetailsRequest.ETA = result.data.Table0[0].ETA.slice(0, 5);
                $scope.FlightDetailsRequest.ETD = result.data.Table0[0].ETD.slice(0, 5);
                $scope.FlightDetailsRequest.FlightType = result.data.Table0[0].FlightType;
                $scope.FlightDetailsRequest.GrWt = result.data.Table0[0].GrWt;
                $scope.FlightDetailsRequest.PiecesMaxVolume = result.data.Table0[0].PiecesMaxVolume;
                $scope.FlightDetailsRequest.PiecesMaxWeight = result.data.Table0[0].PiecesMaxWeight;
                $scope.FlightDetailsRequest.VolWt = result.data.Table0[0].VolWt;
                $scope.FlightDetailsRequest.DailyFlightSNo = result.data.Table0[0].DailyFlightSNo;
                $scope.FlightDetailsRequest.StartDate = result.data.Table0[0].StartDate;
                $scope.FlightDetailsRequest.EndDate = result.data.Table0[0].EndDate;
                //$scope.FlightDetailsRequest.AlReleaseTime = result.data.Table0[0].ReleaseTime;
                $scope.FlightDetailsRequest.Status = result.data.Table0[0].Status;
                $scope.Conditions.Agent = result.data.Table0[0].Agent.split(',');
                $scope.Conditions.AgentGroup = result.data.Table0[0].AgentGroup.split(',');
                $scope.Conditions.SPHC = result.data.Table0[0].SPHC.split(',');
                $scope.Conditions.SPHCGroup = result.data.Table0[0].SPHCGroup.split(',');
                $scope.Conditions.Commodity = result.data.Table0[0].Commodity.split(',');
                $scope.Conditions.IncludeAgent = result.data.Table0[0].IsIncludeAgent == "True" ? true : false;
                $scope.Conditions.IncludeAgentGroup = result.data.Table0[0].IsIncludeAgentGroup == "True" ? true : false;
                $scope.Conditions.IncludeSPHC = result.data.Table0[0].IsIncludeSPHC == "True" ? true : false;
                $scope.Conditions.IncludeSPHCGroup = result.data.Table0[0].IsIncludeSPHCGroup == "True" ? true : false;
                $scope.Conditions.IncludeCommodity = result.data.Table0[0].IsIncludeCommodity == "True" ? true : false;
            });
            setTimeout(function () {
                $scope.SlabGridOptions.dataSource.read();
            }, 200);
            $scope.ShowConditionsGrid = true;
            //$scope.SlabGridOptions.dataSource.read();
        };
        $scope.K_Options = function (extra_ConditionId, autoCompleteName) {
            //alert(extra_ConditionId + autoCompleteName);
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


        $scope.ExtraCondition = function (textId) {

            var SearchFilter = cfi.getFilter("AND");
            if (textId == "Replan_FlightNo") {
                var _SearchFilter = cfi.getFilter("AND");
                cfi.setFilter(_SearchFilter, "IsActive", "eq", '1');
                if ($scope.SearchFlightRequest.FlightDate != undefined && $scope.SearchFlightRequest.FlightDate != "")
                {
                    cfi.setFilter(_SearchFilter, "FlightDate", "eq", $scope.SearchFlightRequest.FlightDate);
                }
                if ($scope.SearchFlightRequest.Origin != undefined && $scope.SearchFlightRequest.Origin != "")
                    cfi.setFilter(_SearchFilter, "OriginAirportSNo", "eq", $scope.SearchFlightRequest.Origin);
                if ($scope.SearchFlightRequest.Destination != undefined && $scope.SearchFlightRequest.Destination != "")
                    cfi.setFilter(_SearchFilter, "DestinationAirportSNo", "eq", $scope.SearchFlightRequest.Destination);
                if ($scope.SearchFlightRequest.FlightType != undefined && $scope.SearchFlightRequest.FlightType != "")
                    cfi.setFilter(_SearchFilter, "FlightTypeSNo", "eq", $scope.SearchFlightRequest.FlightType);
                if ($scope.SearchFlightRequest.Airline != undefined && $scope.SearchFlightRequest.Airline != "")
                    cfi.setFilter(_SearchFilter, "CarrierCode", "eq", $scope.SearchFlightRequest.Airline);
                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            }
            else if (textId == 'Text_Origin' && this.SearchFlightRequest.Destination != "") {
                var _SearchFilter = cfi.getFilter("AND");
                cfi.setFilter(_SearchFilter, "OriginAirportSNo", "neq", this.SearchFlightRequest.Destination);
                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            }

            else if (textId == 'Text_Destination' && this.SearchFlightRequest.Origin != "") {
                var _SearchFilter = cfi.getFilter("AND");
                cfi.setFilter(_SearchFilter, "DestinationAirportSNo", "neq", this.SearchFlightRequest.Origin);
                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            }
            else if (textId == 'Text_Airline') {
                var _SearchFilter = cfi.getFilter("AND");
                cfi.setFilter(_SearchFilter, "UserSNo", "eq", userContext.UserSNo);
                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            }
            else if (textId == 'ProductDD') {
                var _SearchFilter = cfi.getFilter("AND");
                for (var i in ProductFilterValues) {
                    cfi.setFilter(_SearchFilter, "ProductName", "neq", ProductFilterValues[i]);
                }
                SearchFilter = cfi.autoCompleteFilter(_SearchFilter);
                return SearchFilter;
            }
        };
        $window.ExtraCondition = $scope.ExtraCondition;

        $scope.AddNewRow = function (dataitem)
        {
            //validation
            var newrow = Object.assign({}, dataitem.toJSON());
            var hasProduct = 0,hasSlab=0,hasChangeBy=0,hasIncDec=0; 
            var slabname;
            for (var item in newrow)
            {
                
                if (item.indexOf("Product") >= 0 && newrow[item] !="")
                    hasProduct = 1;
                if( item.indexOf("ChangeBy") >= 0 && newrow[item] !="" )
                {
                    hasChangeBy = 1;
                    slabname = item.substr(item.lastIndexOf("ChangeBy") + 8, item.length);
                    if (newrow["IncDec" + slabname] != undefined && newrow["IncDec" + slabname] != "")
                    {
                        hasIncDec = 1;
                        if (newrow[slabname] != "" && parseInt(newrow[slabname]) > 0) {
                            hasSlab = 1;
                        }
                    }
                    
                    
                }
            }
            if (hasProduct > 0 && hasSlab > 0 && hasChangeBy > 0 && hasIncDec > 0) {
                dataitem.ShowAddButton = false;
                dataitem.ShowDeleteButton = false;
                var currentdata = $scope.SlabGridOptions.dataSource.data().toJSON();
                setAll(newrow, '');
                newrow["ShowAddButton"] = true;
                newrow["ShowDeleteButton"] = true;
                currentdata.push(newrow);
                $scope.SlabGridOptions.dataSource.data([]);
                ProductFilterValues = [];
                
                setTimeout(function(){
                    $scope.SlabGridOptions.dataSource.data(currentdata)
                }, 200);
               // $(dataitem).closest('tr').find("input[type='button']").hide();
            }
            else if (hasProduct<=0)
            {
                ShowMessage('warning','Warning', 'No product selected');
            }
            else
            {
                ShowMessage('warning','Warning', 'Minimum one slab discount required');
            }
        };

        $scope.DeleteRow = function (dataItem) {
            var datalength = $scope.SlabGridOptions.dataSource.data().length;
            $scope.SlabGridOptions.dataSource.data()[datalength - 2].ShowAddButton = true;
            if (datalength > 2)
            {
                $scope.SlabGridOptions.dataSource.data()[datalength - 2].ShowDeleteButton = true;
            }
            else
            {
                $scope.SlabGridOptions.dataSource.data()[datalength - 2].ShowDeleteButton = false;
            }
            var currentdata = $scope.SlabGridOptions.dataSource.data().toJSON();
            var removerow = dataItem.toJSON();
            currentdata.pop(removerow);
            $scope.SlabGridOptions.dataSource.data([]);
            ProductFilterValues = [];
            setTimeout(function () {
                $scope.SlabGridOptions.dataSource.data(currentdata)
            }, 200);
        };

        $scope.columns = [];

        $scope.SlabGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource ({
                type: "json",
                transport: {
                    read: {
                        url: SiteUrl + "FlightWiseDiscoutingForRate/GetSlabData",
                        dataType: "json",
                        type: "post",
                        global: false,
                        data: function () {
                            var obj = {FlightNo : $scope.FlightDetailsRequest.DailyFlightSNo}
                            return obj;
                        }
                        }
                },
                schema: {
                    data: function (data) {
                        if (data.Table0 == undefined || data.Table0.length<=0) {
                            ShowMessage('warning', 'Warning', 'Some error occured.')
                            return;
                            }
                        ProductFilterValues = [];
                        var dataColumns = data.Table0 || [];
                        var dataToBind = [];
                        var responsedata = {} ;
                        if ($scope.isNewrequest) {
                            $scope.columns = [];
                            $scope.columns.push({ template: '<div   style="width:100%;" class="product"></div>', headerTemplate: "<span class='hcap'>Product</span>" , width: 120 , locked : true});
                            for (var i in dataColumns) {
                                $scope.columns.push({
                                           headerTemplate: "<span class='hcap'>"+dataColumns[i]["SlabName"]+"</span>",
                                           columns: [
                                               { template: '<input placeholder="Select" ng-model="dataItem.ChangeBy' + dataColumns[i]["SlabName"] + '"  k-options="GetChangeByOptions(true)" kendo-combo-box style="width:100%;" />', title: "Change By" , width: 65 },
                                               { template: '<input placeholder="Select" ng-model="dataItem.IncDec' + dataColumns[i]["SlabName"] + '"  k-options="GetChangeByOptions(false)" kendo-combo-box style="width:100%;" />', title: "Inc/Dec", width: 65 },
                                               { field: dataColumns[i]["SlabName"], template: '<input type="textbox" onkeypress="CheckDecimal(event,this);" ng-model="dataItem.' + dataColumns[i]["SlabName"] + '" style="width:100%;"/>', title: dataColumns[i]["SlabName"], width: 80 },
                                           ]
                                });
                                responsedata["Product"] = '';
                                responsedata[dataColumns[i]["SlabName"]] = (data.Table1 == undefined || data.Table1.length==0)?'0':'';
                                responsedata["ChangeBy" + dataColumns[i]["SlabName"]] = '';
                                responsedata["IncDec" + dataColumns[i]["SlabName"]] = '';
                                if (data.Table1 == undefined || data.Table1.length == 0) {
                                    responsedata["ShowAddButton"] = true;
                                    responsedata["ShowDeleteButton"] = false;
                                }
                            }
                            $scope.columns.push({ template: '<input type="button"  class="btn btn-success"  ng-show="dataItem.ShowAddButton" ng-click="AddNewRow(dataItem)" value="ADD MORE"><input type="button" class="btn btn-success" ng-show="dataItem.ShowDeleteButton" ng-click="DeleteRow(dataItem)" value="REMOVE">', width: 170 });
                            $scope.SlabGridOptions.columns = $scope.columns;
                            $scope.grid.setOptions($scope.SlabGridOptions);
                            $scope.isNewrequest = false;
                        }
                        var slabForLoop;
                        var ProductForBind = "";
                        if (data.Table1 != undefined && data.Table1.length > 0)
                        {
                            var listProduct = [];
                            for (var i in data.Table1) {
                                if(listProduct.indexOf(data.Table1[i]["Product"])<0)
                                    listProduct.push(data.Table1[i]["Product"])
                            }
                            for (var j = 0; j < listProduct.length; j++)
                            {
                                for (var i in data.Table1)
                                {
                                    if (listProduct[j] == data.Table1[i]["Product"])
                                    {
                                        slabForLoop = data.Table1[i]["Slabs"]["SlabName"];
                                        responsedata["Product"] = data.Table1[i]["Product"];
                                        responsedata[slabForLoop] = data.Table1[i]["Slabs"]["value"];
                                        responsedata["ChangeBy" + slabForLoop] = data.Table1[i]["Slabs"]["ChangeBy"] == "Percent" ? "%" : "Val";
                                        responsedata["IncDec" + slabForLoop] = data.Table1[i]["Slabs"]["IncDec"] == "Inc" ? "+" : "-";
                                        responsedata["ShowAddButton"] = listProduct.length - 1 == j ? true : false;
                                        responsedata["ShowDeleteButton"] = listProduct.length - 1 == j && listProduct.length > 1 ? true : false;
                                    }
                                }
                                var newobj = jsonCopy(responsedata);
                                dataToBind.push(newobj);
                                setNull(responsedata);
                            }
                            
                        }
                        else
                        {
                            dataToBind.push(responsedata);
                        }
                        ProductFilterValues = [];
                        return dataToBind;
                    },
                    errors: function(response){
                        return response.error;
                        }
                    },
                pageSize: 5,
                serverPaging: true,
                serverSorting: true
            }),
            sortable: false,
            pageable: false,
            scrollable: true,
            dataBound: function (e) {
                //cfi.DisplayEmptyMessage(e, this);
                var grid = this;
                var dd;
                    $(".product").each(function () {
                        var dropdown = $(this);
                        var tr = dropdown.closest('tr');
                        var model = grid.dataItem(tr);

                        dd = dropdown.kendoDropDownList({
                            autoBind: false,
                            filter: "contains",
                            filterField:"ProductName",
                          //  optionLabel: "Select",
                            dataTextField: "Text",
                            dataValueField: "Key",
                            dataSource: GetDataSourceV2("ProductDD", "FltDiscount_Product"),
                            select: function (ev) {
                                if (this.value() == "")
                                    model.Product = '';
                                else
                                    model.Product = this.text();
                            },
                            change: function (ev) {
                                if (this.value() == "")
                                    model.Product = '';
                                else
                                    model.Product = this.text();
                            },
                        }).data("kendoDropDownList");
                        dd.text(model.Product.toUpperCase());
                        ProductFilterValues.push(model.Product);
                        
                    });
                    
                    //for (var i = 0; i < this.columns.length; i++) {
                    //    this.autoFitColumn(i);
                    //}
                    
                    }
        };

       

        $scope.GetChangeByOptions = function (IsChangeBy)
        {
            if (IsChangeBy)
                return {
                    dataSource: ["%", "Val"]
                };
            else
                return {
                    dataSource: ["+", "-"]
                };
        }

        $scope.flightDetailsGridOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                type: "json",
                transport: {
                    read: {
                        url: SiteUrl + "FlightWiseDiscoutingForRate/GetFlights",
                        dataType: "json",
                        type: "post",
                        global: false,
                        data: function () {
                            return $scope.SearchFlightRequest;
                        }
                    }
                },
                schema: {
                    data: function (data) {
                        var data = data.Table0 || [];
                        
                        return data;
                    }
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true
            }),
            sortable: false,
            pageable: false,
            scrollable: true,
            dataBound: function (e) {
                
            },
            columns: [
                      { field: "FlightNo", headerTemplate: "<span class='hcap'>Flight No</span>", width: "50" },
                      { field: "FlightDate", headerTemplate: "<span class='hcap'>Flight Date</span>", width: "50" },
                      { field: "Origin", headerTemplate: "<span class='hcap'>Origin</span>", width: "50" },
                      { field: "Destination", headerTemplate: "<span class='hcap'>Destination</span>", width: "50" },
                      { field: "FlightType", headerTemplate: "<span class='hcap'>Flight Type</span>", width: "50" },
                      { field: "ETD", headerTemplate: "<span class='hcap'>ETD</span>", width: "30" },
                      { field: "ETA", headerTemplate: "<span class='hcap'>ETA</span>", width: "30" },
                      {template:'<input type="button" class="btn btn-success" value="Select" ng-click="SelectFlight(dataItem)">', width : "50"}
            ]
        };

        $scope.SelectFlight = function (dataItem) {
            $scope.FlightDetailsRequest.DailyFlightSNo = dataItem.DailyFlightSNo;
            $scope.flightDetailsGridOptions.dataSource.data([dataItem]);
            $scope.GetSlabData(dataItem);
        };

        $scope.GetFlightList = function () {
            $scope.ShowFlightDetailsGrid = false;
            $scope.ShowFlightInfo = false;
            $scope.ShowGrid = false;
            $scope.ShowConditionsGrid = false;
            if ($scope.SearchFlightRequest.FlightDate == undefined || $scope.SearchFlightRequest.FlightDate == "")
                ShowMessage('warning', 'Warning', 'Select Flight Date');
            else if ($scope.SearchFlightRequest.Origin == undefined || $scope.SearchFlightRequest.Origin == "" )
                ShowMessage('warning', 'Warning', 'Select Flight Origin');
            else if($scope.SearchFlightRequest.Destination == undefined ||$scope.SearchFlightRequest.Destination == "")
                ShowMessage('warning', 'Warning', 'Select Flight Destination');
            else{
                
                $scope.ShowFlightDetailsGrid = true;
                $scope.flightDetailsGridOptions.dataSource.read();
            }
        };

        $scope.SaveDiscount = function () {
            if ($scope.FlightDetailsRequest.StartDate == "" || $scope.FlightDetailsRequest.EndDate == "" ) //|| $scope.FlightDetailsRequest.AlReleaseTime == "" )//|| $scope.FlightDetailsRequest.Status == "")
            {
                ShowMessage('warning','Warning','Enter Start Date and End Date.')
            }
            else
            {
                var hasProduct = 0, hasSlab = 0, hasChangeBy = 0, hasIncDec = 0;
                var discountarray = $scope.SlabGridOptions.dataSource.data().toJSON();
                var discountarraylength = discountarray.length;
                var slabname
                for (var item in discountarray[discountarraylength-1]) {

                    if (item.indexOf("Product") >= 0 && discountarray[discountarraylength - 1][item] != "")
                        hasProduct = 1;
                    if (item.indexOf("ChangeBy") >= 0 && discountarray[discountarraylength - 1][item] != "") {
                        hasChangeBy = 1;
                        slabname = item.substr(item.lastIndexOf("ChangeBy") + 8, item.length);
                        if (discountarray[discountarraylength - 1]["IncDec" + slabname] != undefined && discountarray[discountarraylength - 1]["IncDec" + slabname] != "") {
                            hasIncDec = 1;
                            if (discountarray[discountarraylength - 1][slabname] != "" && parseInt(discountarray[discountarraylength - 1][slabname]) > 0) {
                                hasSlab = 1;
                            }
                        }


                    }
                }
                if (hasProduct > 0 && hasSlab > 0 && hasChangeBy > 0 && hasIncDec > 0) {
                    var finalData = $scope.SlabGridOptions.dataSource.data().toJSON();
                    var DiscountData = [];
                    var DiscountObj;
                    for (var i=0;i<finalData.length;i++)
                    {
                        DiscountObj =
                        {
                            Product: '',
                            Slabs: []
                        }
                        for(var item in finalData[i])
                        {
                            if (item.indexOf("Product") >= 0)
                            {
                                DiscountObj.Product = finalData[i][item];
                            }
                            else if (item.indexOf("Product") < 0 && item.indexOf("ChangeBy") < 0 && item.indexOf("IncDec") < 0 && item.indexOf("Button")<0)
                            {
                                DiscountObj.Slabs.push({ SlabName: item, value: finalData[i][item], ChangeBy: finalData[i]["ChangeBy" + item], IncDec: finalData[i]["IncDec" + item] });
                            }
                        }
                        DiscountData.push(DiscountObj);
                    }
                    var ConditionsData = {
                        Agent: getStringFromArray($scope.Conditions.Agent),
                        AgentGroup: getStringFromArray($scope.Conditions.AgentGroup),
                        SPHC: getStringFromArray($scope.Conditions.SPHC),
                        SPHCGroup: getStringFromArray($scope.Conditions.SPHCGroup),
                        Commodity: getStringFromArray($scope.Conditions.Commodity),
                        IsIncludeAgent: $scope.Conditions.IncludeAgent == false ? "0" : "1",
                        IsIncludeAgentGroup: $scope.Conditions.IncludeAgentGroup == false ? "0" : "1",
                        IsIncludeSPHC: $scope.Conditions.IncludeSPHC == false ? "0" : "1",
                        IsIncludeSPHCGroup: $scope.Conditions.IncludeSPHCGroup == false ? "0" : "1",
                        IsIncludeCommodity: $scope.Conditions.IncludeCommodity == false ? "0" : "1"
                    }
                    $http.post('/FlightWiseDiscoutingForRate/SaveDiscount', {
                        obj: DiscountData,
                        DailyFlightSNo: $scope.FlightDetailsRequest.DailyFlightSNo,
                        FromDate: $scope.FlightDetailsRequest.StartDate,
                        ToDate: $scope.FlightDetailsRequest.EndDate,
                        AlReleaseTime: $scope.FlightDetailsRequest.AlReleaseTime || 0,
                        Status: $scope.FlightDetailsRequest.Status,
                        DisObj : ConditionsData
                    }).then(function (result) {
                        if (result.status =200 && result.data.Table0[0].Column1 == "Failure") {
                            ShowMessage('warning', 'Warning', 'Some error occured. Please try again.')
                        }
                        else if (result.status = 200 && result.data.Table0[0].Column1 == "Success") {
                            ShowMessage('success', 'Success', 'Details saved successfully.')
                            $scope.ShowFlightInfo = false;
                            $scope.ShowGrid = false;
                            $scope.ShowFlightDetailsGrid = false;
                            $scope.ShowConditionsGrid = false;
                        }
                        else
                        {
                            ShowMessage('warning', 'Warning', 'Please try again.')
                        }
                    });
                    
                    //$(dataitem).closest('tr').find("input[type='button']").hide();
                }
                else if (hasProduct <= 0) {
                    ShowMessage('warning', 'Warning', 'No product selected');
                }
                else {
                    ShowMessage('warning', 'Warning', 'Minimum one slab discount required');
                }

            }
        };

        $scope.GetStatus = ["Draft", "Active", "Inactive", "Expired"];

        $scope.SelectConditionOptions = function (extra_ConditionId, autoCompleteName,filterField) {
            {
                return {
                    placeholder: "Select",                   
                    dataTextField: 'Text',
                    dataValueField: 'Key',
                    template: '<span>#: TemplateColumn #</span>',
                    IsChangeOnBlankValue: false,
                    filterField: filterField,
                    dataSource: new kendo.data.DataSource({
                        type: "json",
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        allowUnsort: true,
                       /// filterField: "OriginAirportCode",
                        pageSize: 200,
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
                }
            }
        }
        
    }]);


angular.bootstrap(document, ["GarudaApp"]);

var validDate = function (_this) {
    var dtRegex = new RegExp("^([0]?[1-9]|[1-2]\\d|3[0-1])-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-[1-2]\\d{3}$", 'i');
    if (!dtRegex.test($(_this).val())) {
        $(_this).val('');
    }
}

function setAll(obj, val) {
 
    Object.keys(obj).forEach(function (index) {
        obj[index] = val
    });
}
function setNull(obj) {
    setAll(obj, null);
}

function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
}


//var guidCount = 0;
//var getGuid = function () {
//    guidCount++;
//    return 'name=offpt' + guidCount;
//}

function CheckDecimal(ev, val) {
    if ((ev.which != 46 || val.value.indexOf('.') != -1) && (ev.which < 48 || ev.which > 57)) {
        if ((ev.which != 46 || val.value.indexOf('.') != -1)) {
            ShowMessage('warning', 'Warning', 'Multiple Decimals are not allowed');
        }
        ev.preventDefault();
    }
    if (val.value.indexOf(".") > -1 && (val.value.split('.')[1].length > 2)) {
        ShowMessage('warning', 'Warning', 'Only 3 digits allowed after decimal point');
        ev.preventDefault();
    }
    if(val.value.length>18)
    {
        ShowMessage('warning', 'Warning', 'Maximum length reached');
        ev.preventDefault();
    }
}

function getStringFromArray(arraydata)
{
    var stringdata = '';
    for (var elem in arraydata)
    { stringdata = stringdata + ',' + arraydata[elem] }
    return stringdata;
}