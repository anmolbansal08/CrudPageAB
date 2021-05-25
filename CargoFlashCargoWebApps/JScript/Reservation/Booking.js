/// <reference path="../../Scripts/KendoSchedular/Content/JS/kendo.dataviz.min.js" />

SiteUrl = window.location.origin + '/';
var url = function () { return SiteUrl + "Services/AutoCompleteService.svc/AutoCompleteDataSourceV2"; }
var GarudaApp = angular.module("GarudaApp", ["kendo.directives"]);

GarudaApp.controller("GraudaController", ["$scope", "$rootScope", "$compile", "$http", "$window",
	function ($scope, $rootScope, $compile, $http, $window) {
		var garuda = this;
		var isAgentHide = false;
		
		$scope.K_Options = cfi.K_Options;
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
							//if ($scope.SearchReplanRequest.ETD != ETA) {
							//	$scope.SearchReplanRequest.ETD = ETA;
							//	if (!$scope.ItineraryDateChange)
							//		$scope.SearchReplanRequest.ItineraryDate = kendo.toString(new Date(), 'dd-MMM-yyyy');
							//}

							//var currentPlanData = $scope.CurrentPlanGridOptions.dataSource.data();
							//if (currentPlanData.length > 0) {

							//	var subrouteSNo = 0;
							//	if ($scope.SubRouteSNo > 0)
							//		subrouteSNo = $scope.SubRouteSNo;
							//	//subrouteSNo = ($scope.SubRouteSNo - 1); // Temperarory disabled


							//	var filterdata = filterData(currentPlanData, 'RouteSNo', $scope.RouteSNo);
							//	var subfilterdata = filterData(filterdata, 'SubRouteSNo', subrouteSNo);
							//	if (subfilterdata.length > 0) {
							//		if (subfilterdata[0].IsInterlineCheck) {
							//			$scope.SearchReplanRequest.ItineraryDate = subfilterdata[0].FlightDate;
							//			$scope.SearchReplanRequest.IsMCT = 0;
							//			$scope.SearchReplanRequest.ETD = "00:00";
							//		} else {
							//			if ($scope.ItineraryDateChange) {
							//				var IterDate = new Date($scope.SearchReplanRequest.ItineraryDate);
							//				var ArrDate = new Date(subfilterdata[0].ArrFlightDate);
							//				if (IterDate.setHours(0, 0, 0, 0) > ArrDate.setHours(0, 0, 0, 0)) {
							//					$scope.SearchReplanRequest.ETD = "00:00";
							//				} else {
							//					$scope.SearchReplanRequest.ItineraryDate = subfilterdata[0].ArrFlightDate;
							//					$scope.SearchReplanRequest.ETD = subfilterdata[0].ETA.slice(0, 5);
							//				}

							//			} else {
							//				$scope.SearchReplanRequest.ItineraryDate = subfilterdata[0].ArrFlightDate;
							//				$scope.SearchReplanRequest.ETD = subfilterdata[0].ETA.slice(0, 5);
							//			}
							//			$scope.SearchReplanRequest.IsMCT = 1;
							//		}

							//	} else {
							//		$scope.SearchReplanRequest.ETD = ETA;
							//		if (!$scope.ItineraryDateChange)
							//			$scope.SearchReplanRequest.ItineraryDate = kendo.toString(new Date($scope.minDate), 'dd-MMM-yyyy');
							//		$scope.SearchReplanRequest.IsMCT = 0;
							//	}
							//}
							//$scope.ItineraryDateChange = false;
							////if ($scope.IsInterline) {
							////    $scope.SearchReplanRequest.ItineraryCarrierCode = $scope.IsInterline.Text;
							////}
							////else {
							////    $scope.SearchReplanRequest.ItineraryCarrierCode = "";
							////}
							////else if ($scope.SearchReplanRequest.ETD != "00:00" && ($scope.SelectedRoutes == undefined || $scope.SelectedRoutes.length == 0)) {
							////    ResetSearchReplanRequest($scope.CurrentPlan);
							////}
							//$scope.SearchReplanRequest.ItineraryCarrierCode = $("#ItineraryCarrierCode").val();
							//$scope.SearchReplanRequest.ItineraryFlightNo = $("#ItineraryFlightNo").val();
							//return $scope.SearchReplanRequest;
							return {};
						}
					},
				},
				schema: {
					model: { id: "FlightNo", fields: { FlightNo: { type: "string" } } },
					data: function (data) {
						
						return data;
					}
				}
			}),
			dataBound: function (e) {
				cfi.DisplayEmptyMessage(e, this);				
					
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


		/* Request Region*/


		$scope.ExtraCondition = function (textId) {

			var SearchFilter = cfi.getFilter("AND");

			
			

		}
		$window.ExtraCondition = $scope.ExtraCondition;


	}]);

angular.bootstrap(document, ["GarudaApp"]);



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