$(function () {
	ShortBooking();
});

//function ShortBooking() { alert('hi'); }

var BookingTypeIndexNo = "";
var IsAsAgreedAgent = 0;
var DimensionMandatoryOrNotInEcecutionAtCity = 1;
var IsCCAllowedAirline = "";
var PrefixAirlineName = "";
var ReplanCompleteIndexNo = 0;
var AWBStatusNo = 0;
var BookingRefNo = 0;
var currentprocess = "";
var currentawbsno = 0;
var currentawbno = "";
var currentPrefix = "";
var DimSaved = false;
var AWBReferenceBookingPrimarySNo = 0;
var BookingPrimaryRefNo = "";
var BookingOrigin = "";
var BookingDestination = "";
var AWBStatusDetails = "";
var DGRSPHC = [];
var tblhtml, tblNogHtml;
var AWBFillCarrierCode = "";
var array = [];
var sno = [];
var org = "";
var ArrSelectedDateValue = "";
var ArrSelectedDate = "";
var ArrETATime = "";
var etd, date;


function ShortBooking() {

	_CURR_PRO_ = "SHORTBOOKING";
	_CURR_OP_ = "Master Reservation";
	$("#divShipmentDetails").html("");
	CleanUI();
	var ReservationGetWebForm = {
		processName: _CURR_PRO_,
		moduleName: 'Shipment',
		appName: 'ShortBookingSearch',
		Action: 'Search',
		IsSubModule: '1'
	}
	$.ajax({

		url: "Services/Shipment/ShortBookingService.svc/GetWebForm",
		async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
		data: JSON.stringify({ model: ReservationGetWebForm }),
		success: function (result) {
			$("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'><div id='divContent' style='display:none;'></div></form");//" + result + "
			$("#divContent").html(divContent);
			$('#aspnetForm').on('submit', function (e) {
				e.preventDefault();
			});
			FormDataBind('NEW', _CURR_PRO_);
			$("#divFooter").html(fotter).show();
			CleanUI();
			$("#btnNew").unbind("click").bind("click", function () {
				AWBStatusDetails = "";
				FormDataBind('NEW', _CURR_PRO_);
			});
		}
	});
}
var ServiceableProduct = [];
var IsGarudaMilesShownOn = [];
var LoginGroupType = "";
function FormDataBind(Action, ProcessNameDetails) {
	if (Action == "NEW" || Action == "COPY")
		AWBStatusNo = 0;
	$.ajax({
		url: 'HtmlFiles/Shipment/ShortBooking.html', cache: false,
		success: function (result) {
			$('#aspnetForm').on('submit', function (e) {
				e.preventDefault();
			});
			$("#divContent1").remove()
			$('#aspnetForm').append(result);
			//  $("#divContent").html(divContent);
			InstantiateControl("htmldivdetails");
			PageLoaded(Action, ProcessNameDetails);
			InitializePage("SHORTBOOKING", "ApplicationTabs-1", "", "");
			$('input[name=AWBStock]').click(function () {
				if ($(this).val() === '0') {
					$('#AWBNumber').removeAttr("disabled");
					$('#_tempAWBNumber').removeAttr("disabled");
					ManualStockAgentOrNot();
				} else if ($(this).val() === '1') {
					$('#AWBNumber').val('');
					$('#_tempAWBNumber').val('');
					$('#AWBNumber').attr('disabled', true);
					AutoStockAgentOrNot();
				}
			});
			$('input[name=BookingType]').click(function () {
				if (userContext.AgentSNo > 0) {
					$('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
					$("#_tempAWBNumber").val('');
					$('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
					$('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
					//$('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").enable(false) 
					$('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(false)
					//tarun
				}
				else {
					$('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
					$("#_tempAWBNumber").val('');
					if ($('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").value() != "" && $('#tblShortBookingTab_Agent_' + rowIndex).prop('disabled') == true) {
						if ($('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) {
							$('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(false);
						}
						else {
							cfi.ResetAutoComplete("AWBAgent");
							$('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(true);
						}
					}
					else {
						cfi.ResetAutoComplete("AWBAgent");
						$('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(true);
					}
					//cfi.ResetAutoComplete("AWBAgent");
					//$('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(true);
					$('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").enable(true);
				}
				//GETProductASPerBookingType($(this).val(), userContext.GroupName);
			});

			$("#ApplicationTabs").kendoTabStrip();
			$("#btnSave").unbind("click").bind("click", function () {
				if (SaveData(ProcessNameDetails)) {
					// ShipmentSearch();
					CleanUI();
					AWBStatusDetails = "";
					FormDataBind('NEW', _CURR_PRO_);
				}
			});
			$("#btnCancel").unbind("click").bind("click", function () {
				CleanUI();
				AWBStatusDetails = "";
				FormDataBind('NEW', _CURR_PRO_);
			});

			//$("#ItineraryVolumeWeight").attr('disabled', true);
			//$("#_tempItineraryVolumeWeight").attr('disabled', true);
			//$("#ItineraryMainVolumeWeight").attr('disabled', true);
			//$("#_tempItineraryMainVolumeWeight").attr('disabled', true);
		}
	});
	if (Action == "NEW") {
		$.ajax({
			url: "Services/Shipment/BackDateBookingService.svc/GenerateAndGetReferenceNumber",
			async: false,
			type: "GET",
			dataType: "json",
			data: { BookingRefNo: 'GenerateAndGetReferenceNumber' },
			contentType: "application/json; charset=utf-8", cache: false,
			success: function (result) {
				if (result.substring(1, 0) == "{") {
					var myData = jQuery.parseJSON(result);
					if (myData.Table0.length > 0) {
						$("#hdnBookingMasterRefNo").val(myData.Table0[0].ReferenceNumber);
					}
				}
				return false
			},
			error: function (xhr) {
				var a = "";
			}
		});
		//GetProductAsPerAgent();
		//bindappendflight();
	}
}
function ShortBookingTab() {
	var dbTableName = 'ShortBookingTab';
	var pageType = 'Edit';
	//, controltype: 'number'
	$('#tbl' + dbTableName).appendGrid({
		V2: true,
		tableID: 'tbl' + dbTableName,
		contentEditable: pageType != 'View',
		tableColumns: 'SNo,OtherChargeCode,OtherchargeDetail,ChargeValue',
		masterTableSNo: 0,
		currentPage: 1, itemsPerPage: 50,
		model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
		sort: '',
		servicePath: 'Services/Shipment/ShortBookingService.svc',
		getRecordServiceMethod: 'Get' + dbTableName + 'Record',
		createUpdateServiceMethod: 'createUpdate' + dbTableName,
		deleteServiceMethod: 'delete' + dbTableName,
		caption: 'Multiple Booking',
		initRows: 1,
		isGetRecord: true,
		columns: [
			{ name: 'SNo', type: 'hidden', value: 0 },
			{ name: 'BookingSNo', type: 'hidden', value: 0 },
			{ name: 'BookingRefNo', type: 'hidden', value: 0 },
			{ name: 'Prefix', display: 'Prefix', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return GetItineraryCarrierCode(this.id);" }, onchange: "return GetItineraryCarrierCode(this.id);", ctrlCss: { width: '50px' }, isRequired: true, AutoCompleteName: 'Reservation_Airline', filterField: "AirlineCode", filterCriteria: "contains" },
			{ name: 'AWBNo', display: 'AWB No', type: 'text', value: '', ctrlAttr: { maxlength: 8, minlength: 8, onblur: "return CheckValidAWBNumber(this.id);" }, ctrlCss: { width: '60px' }, isRequired: true },
			{ name: 'Origin', display: 'Origin', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px' }, isRequired: true, AutoCompleteName: 'Reservation_City1', filterField: "CityCode", filterCriteria: "contains" },
			{ name: 'Destination', display: 'Destination', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px' }, isRequired: true, AutoCompleteName: 'Reservation_City1', filterField: "CityCode", filterCriteria: "contains" },
			{ name: 'Agent', display: 'Agent', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px' }, isRequired: true, AutoCompleteName: 'Reservation_Agent', filterField: "Name", filterCriteria: "contains" },
			{ name: 'Pieces', display: 'Pieces', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number' }, ctrlCss: { width: '50px' }, isRequired: true },
			{ name: 'GrossWeight', display: 'Gr. Wt.', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '50px' }, isRequired: true },
			{ name: 'Volume', display: 'CBM', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal3' }, ctrlCss: { width: '50px' }, isRequired: true },
			{ name: 'Product', display: 'Product', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px' }, isRequired: true, AutoCompleteName: 'Reservation_Product', filterField: "ProductName", filterCriteria: "contains" },
			{ name: 'Commodity', display: 'Commodity', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px' }, isRequired: true, AutoCompleteName: 'Reservation_Commodity', filterField: "CommodityCode", filterCriteria: "contains" },
			{ name: 'FlightDate', display: 'Flight Date', type: 'text', value: '', ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px' }, isRequired: true },
			{ name: 'FlightNo', display: 'Flight No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px' }, isRequired: true, AutoCompleteName: 'Reservation_searchFlightNo', filterField: "FlightNo", filterCriteria: "contains" },
			{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
			{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }

		],
		afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
			var len = $('#tblShortBookingTab_rowOrder').val();
			//$("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(userContext.AirlineName.split('-')[0], userContext.AirlineName.split('-')[0]);
			//$('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
			//var uniqueindex;
			//uniqueindex = $('#tblShortBookingTab').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
			//$('#tblShortBookingTab_HdnPrefix_' + uniqueindex).val(userContext.AirlineName.split('-')[0]);
			//$('#tblShortBookingTab_Prefix_' + uniqueindex).val(userContext.AirlineName.split('-')[0]);


			var rows = 0;
			$("tr[id^='tblShortBookingTab_Row']").each(function (row, tr) {
				rows = tr.id.split('_')[2];
			});
			//rows = parseInt(rows) + 1;

			$('#tblShortBookingTab_HdnPrefix_' + rows).val(userContext.AirlineName.split('-')[0]);
			$('#tblShortBookingTab_Prefix_' + rows).val(userContext.AirlineName.split('-')[0]);
			$('#tblShortBookingTab_HdnOrigin_' + rows).val(userContext.CitySNo);
			$('#tblShortBookingTab_Origin_' + rows).val(userContext.CityCode + '-' + userContext.CityName);
			//$('#tblShortBookingTab_HdnProduct_' + rows).val(28);
			//$('#tblShortBookingTab_Product_' + rows).val('GENERAL');
			//$('#tblShortBookingTab_HdnCommodity_' + rows).val(2385);
			//$('#tblShortBookingTab_Commodity_' + rows).val('10001-GENERAL CARGO');


			var todaydate = new Date();
			var ItineraryDate = $('#tblShortBookingTab_FlightDate_' + rows).data("kendoDatePicker");
			ItineraryDate.min(todaydate);
			$("input[id^=tblShortBookingTab_FlightDate_]").change(function (e) {
				var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
				var dto = new Date(Date.parse(k));
				var validFrom = $(this).attr("id").replace("To", "From");
				k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
				var dfrom = new Date(Date.parse(k));
				if (dfrom > dto)
					$(this).val("");
				//$("#Text_ItineraryFlightNo").data("kendoAutoComplete").setDefaultValue('', '');
			});
			//$('#tblShortBookingTab_FlightDate_' + rows).attr('sqldatevalue', '2015-05-17');
			$('#tblShortBookingTab_FlightDate_' + rows).attr('readOnly', 'readOnly');
		},
		isPaging: false,
		hideButtons: { updateAll: false,insert: true, removeLast: true },

	});
	var Totalrows = 0;
	$("tr[id^='tblShortBookingTab_Row']").each(function (row, tr) {
		Totalrows = tr.id.split('_')[2];
	});
	if (Totalrows == 0) {
		$('#tblShortBookingTab').appendGrid('insertRow', 1, 0);
	}
}

function CheckValidAWBNumber(e) {
    var rowIndex = e.split('_')[2];
    var AwbNoLength = $('#tblShortBookingTab_AWBNo_' + rowIndex).val().length;
    if ($('#tblShortBookingTab_AWBNo_' + rowIndex).val().length != 8) {
        ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an correct AWB number to proceed.");
        $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
    }
    var AWBStock = 0;
   // var rowCount = $('#tblShortBookingTab tr').length;
    var rowAWBNo = $('#tblShortBookingTab_Prefix_' + rowIndex).val() + "-" + $('#tblShortBookingTab_AWBNo_' + rowIndex).val();
    if ($("#tblShortBookingTab tbody tr").length > 1) {
        ValidateAWBDuplicateOrNot(rowAWBNo, rowIndex);
    }
    if (AWBStock == 0 && $('#tblShortBookingTab_AWBNo_' + rowIndex).val().length == 8) {
        $.ajax({
            url: "Services/Shipment/ShortBookingService.svc/CheckValidAWBNumber",
            async: true,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: 0,
                AWBPrefix: $('#tblShortBookingTab_Prefix_' + rowIndex).data("kendoAutoComplete").key(),
                AWBNumber: $('#tblShortBookingTab_AWBNo_' + rowIndex).val(),
                OriginCitySNo: $('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").value() == "" ? 0 : $('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").key(),
                AccountSNo: $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").value() == "" ? 0 : $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SNo == 'Interline') {
                            if (myData.Table0[0].AWBNo == '') {
                                //	AssignAWBNoForInterline();
                                if (userContext.AgentSNo <= 0) {
                                    if ($('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").value() != "" && $('#tblShortBookingTab_Agent_' + rowIndex).prop('disabled') == true) {
                                        if ($('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) {
                                            $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(false);
                                        }
                                        else
                                            $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(true);
                                    }
                                    else
                                        $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(true);
                                    $('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").enable(true);
                                }
                            }
                            else {
                                ShowMessage('warning', 'Information!', "AWB already Used, Please try other AWB.");
                                $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
                                //$("#_tempAWBNumber").val('');
                            }
                        }
                        else {
                            if (myData.Table1.length > 0 && myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
                                //$("#_tempAWBNumber").val('');
                            }
                            else {
                                $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo == "" ? "" : myData.Table0[0].AccountSNo, myData.Table0[0].AccountSNo == "" ? "" : myData.Table0[0].Name);
                                IsAsAgreedAgent = myData.Table0[0].AsAgreed == 'True' ? 1 : 0;
                                if (myData.Table0[0].AccountSNo > 0) {
                                    $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(false);
                                    $('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").enable(false);
                                }
                            }
                        }
                    }
                    else {
                        if (myData.Table1.length > 0) {
                            if (myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
                                //$("#_tempAWBNumber").val('');
                            }
                            else {
                                ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                                $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
                                //$("#_tempAWBNumber").val('');
                                if (userContext.AgentSNo <= 0) {
                                    $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(true);
                                    $('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").enable(true);
                                }
                            }
                        }
                        else {
                            ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                            $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
                            //$("#_tempAWBNumber").val('');
                            if (userContext.AgentSNo <= 0) {
                                $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(true);
                                $('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").enable(true);
                            }
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}



function ValidateAWBDuplicateOrNot(awbno, rowIndex) {
 
    var rowValue = awbno;
    var RowNo = rowIndex;
    $("#tblShortBookingTab tbody tr td").find('[id*="tblShortBookingTab_AWBNo_"]').each(function () {
       
        var i = $(this).attr('id').split('_')[2]
     

        var oldvalue = $("#tblShortBookingTab_Prefix_" + i).val() + "-" + $("#tblShortBookingTab_AWBNo_" + i).val();
       
        if (oldvalue == rowValue && parseInt(i) <= RowNo - 1) {
           
            $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
            ShowMessage('warning', 'Information!', "AWB Already Used.");
            return false;
        }

        


    //if ($(tr).find("input[id^='tblShortBookingTab_AWBNo_']").val() == rowValue)
    //{
    //    // alert("alert")

    });

}
   

   
function GetItineraryCarrierCode(e) {
   // alert("abc");
    //var rowIndex = e.split('_')[2];
    var rowIndex = $(e).attr('id').split('_')[2]
    var AWBCode = "";
    //if (e != "Text_AWBCode") {
    //    AWBCode = e;
    //}
    //else {
        AWBCode = $('#tblShortBookingTab_Prefix_' + rowIndex).data("kendoAutoComplete").key() == "" ? 0 : $('#tblShortBookingTab_Prefix_' + rowIndex).data("kendoAutoComplete").key()
  //  }
    if (AWBCode != "") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetItineraryCarrierCode",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBCode: AWBCode
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        //AWBFillCarrierCode = myData.Table0[0].CarrierCode;
                        //PrefixAirlineName = myData.Table0[0].AirlineName;
                        //IsCCAllowedAirline = myData.Table0[0].IsCCAllowed;
                        //if (IsCCAllowedAirline == "False") {
                        //    if ($("#Text_ChargeCode").data("kendoAutoComplete").key() == 2) {
                        //        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue("1", "PP");
                        //        ShowMessage('warning', 'Information!', "Collect Shipment booking not allowed for " + PrefixAirlineName + ".");
                        //    }
                        //}
                        //if (userContext.SysSetting.ICMSEnvironment != 'JT')
                        //    $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CarrierCode, myData.Table0[0].CarrierCode);
                   //     IsItineraryCarrierCodeInterline();
                        if (myData.Table0[0].IsInterline == "True") {
                            //$('input[name=AWBStock][value=0]').attr('checked', true);
                            //$('input[name=AWBStock][value=0]').click();
                            //$('#AWBNumber').removeAttr("disabled");
                            //$('#_tempAWBNumber').removeAttr("disabled");
                            //$('input[type=radio][name=AWBStock]').attr('disabled', true);
                            if (userContext.AgentSNo > 0) { }
                            else {
                                if (userContext.SysSetting.InterlineAgentName != "" && userContext.SysSetting.InterlineAgentName != undefined) {
                                    $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").setDefaultValue(userContext.SysSetting.InterlineAgentSNo, userContext.SysSetting.InterlineAgentName);
                                    $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(false);
                                    $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');
                                }
                            }
                        }
                        else {
                            if ($('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").value() != "" && $('#tblShortBookingTab_Agent_' + rowIndex).prop('disabled') == true) {
                                if ($('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) {
                                    $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").enable(true);
                                    $('#tblShortBookingTab_Agent_' + rowIndex).data("kendoAutoComplete").setDefaultValue("", "");
                                    $('#tblShortBookingTab_AWBNo_' + rowIndex).val('');

                                }
                            }
                            //if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
                            //}
                            //else {
                            //    $('input[name=AWBStock][value=1]').attr('checked', true);
                            //    $('#AWBNumber').val('');
                            //    $('#_tempAWBNumber').val('');

                            //    $('#AWBNumber').attr('disabled', true);
                            //    $('input[type=radio][name=AWBStock]').attr('disabled', false);
                            //    AutoStockAgentOrNot();
                            //}
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}

function PageLoaded(Action, ProcessName) {
	ShortBookingTab();

	cfi.AutoCompleteV2("ItineraryOrigin", "AirportCode,AirportName", "Reservation_Airport", null, "contains");
	cfi.AutoCompleteV2("ItineraryDestination", "AirportCode,AirportName", "Reservation_Airport", null, "contains");
	cfi.AutoCompleteV2("ItineraryCarrierCode", "CarrierCode", "Reservation_Airline1", null, "contains");
	cfi.AutoCompleteV2("ItineraryFlightNo", "FlightNo", "Reservation_searchFlightNo", null, "contains");

	//cfi.AutoCompleteV2("AWBCode", "AirlineCode", "Reservation_Airline", GetItineraryCarrierCode, "contains");
	//cfi.AutoCompleteV2("Product", "ProductName", "Reservation_Product", null, "contains");
	//var ChargeCodeSource = [{ Key: "1", Text: "PP" }, { Key: "2", Text: "CC" }];
	//cfi.AutoCompleteByDataSource("ChargeCode", ChargeCodeSource, CheckIsCCAllowed, null);
	//cfi.AutoCompleteV2("AWBOrigin", "CityCode,CityName", "Reservation_City1", SelectedAWBOriginDestination, "contains");
	//cfi.AutoCompleteV2("AWBOrigin1", "CityCode,CityName", "Reservation_City1", null, "contains");
	//cfi.AutoCompleteV2("AWBDestination", "CityCode,CityName", "Reservation_City1", SelectedAWBOriginDestination, "contains");
	//cfi.AutoCompleteV2("AWBOffice", "Name", "Reservation_Office", null, "contains");
	//cfi.AutoCompleteV2("AWBAgent", "Name", "Reservation_Agent", CheckValidAWBNumber, "contains");
	//var UMSource = [{ Key: "0", Text: "K" }, { Key: "1", Text: "L" }];
	//cfi.AutoCompleteByDataSource("UM", UMSource);
	//cfi.AutoCompleteV2("Priority", "Code,PriorityName", "Reservation_Priority", null, "contains");
	//cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "Reservation_Commodity", FillCommoditySHC, "contains");
	//cfi.AutoCompleteV2("SHC", "CODE,Description", "Reservation_SPHC1", null, "contains", ",", null, null, null, SHCDetails, true);
	//cfi.AutoCompleteV2("ItineraryOrigin", "AirportCode,AirportName", "Reservation_Airport", CheckPiecesOnOD, "contains");
	//cfi.AutoCompleteV2("ItineraryDestination", "AirportCode,AirportName", "Reservation_Airport", CheckPiecesOnOD, "contains");
	//cfi.AutoCompleteV2("ItineraryCarrierCode", "CarrierCode", "Reservation_Airline1", IsItineraryCarrierCodeInterline, "contains");
	//cfi.AutoCompleteV2("ItineraryFlightNo", "FlightNo", "Reservation_searchFlightNo", null, "contains");
	//cfi.DateType("ItineraryDate", true);
	//cfi.AutoCompleteV2("ItineraryTransit", "AirportCode,AirportName", "Reservation_Airport", null, "contains");
	//cfi.AutoCompleteV2("SHIPPER_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
	//cfi.AutoCompleteV2("SHIPPER_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
	//cfi.AutoCompleteV2("SHIPPER_City", "CityCode,CityName", "Reservation_City", null, "contains");
	//cfi.AutoCompleteV2("CONSIGNEE_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
	//cfi.AutoCompleteV2("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
	//cfi.AutoCompleteV2("CONSIGNEE_City", "CityCode,CityName", "Reservation_City", null, "contains");

	//$('#tblShortBookingTab_AWBNo_' + rowIndex).unbind("blur").bind("blur", function () {
	//	if (Action == "NEW" || Action == "COPY")
	//		CheckValidAWBNumber();
	//});
	//$("#AWBPieces").unbind("blur").bind("blur", function () {
	//	CalculatedPieces();
	//});
	//$("#NoofHouse").unbind("blur").bind("blur", function () {
	//	NoofHousePieces();
	//});
	//$("#AWBNoofBUP").unbind("blur").bind("blur", function () {
	//	CalculatedBUPPieces('AWBNoofBUP');
	//});
	//$("#AWBNoofBUPIntact").unbind("blur").bind("blur", function () {
	//	CalculatedBUPPieces('AWBNoofBUPIntact');
	//});
	//$("#AWBChargeableWeight").bind("blur", function () {
	//	if (userContext.SpecialRights.RESCHARGEABLE != true) {
	//		compareGrossVolValue();
	//	}
	//	else {
	//		var chwt = $("#AWBChargeableWeight").val();
	//		$("#AWBChargeableWeight").val(chwt == 0 ? "" : GetroundValue(chwt, 1));
	//		$("#_tempAWBChargeableWeight").val(chwt == 0 ? "" : GetroundValue(chwt, 1));
	//	}
	//});
	//$("#AWBGrossWeight").bind("blur", function () {
	//	CalculateGrossVolumeWeight(this);
	//});
	//$("#AWBCBM").bind("blur", function () {
	//	CalculateShipmentChWt(this);
	//});
	//$("#AWBVolumeWeight").bind("blur", function () {
	//	CalculateShipmentCBM();
	//});
	//$("#ItineraryPieces").unbind("blur").bind("blur", function () {
	//	ItineraryPieces();
	//});
	//$("#ItineraryGrossWeight").bind("blur", function () {
	//	ItineraryGrossWeight();
	//});
	//$("#ItineraryVolumeWeight").bind("blur", function () {
	//	ItineraryCBM();
	//});
	//$("#ItineraryMainVolumeWeight").bind("blur", function () {
	//	ItineraryMainVolumeWeight();
	//});
	//$("div[id^='divMultiSHC']").css("overflow", "auto");
	//$("div[id^='divMultiSHC']").css("width", "15em");
	//$("#btnNew").css("display", "none");
	//$("#tdItineraryInterlineFlightNo").css("display", "none");
}
function SearchFlight() {
    //if (cfi.IsValidSection("ApplicationTabs-1")) {
    //    if (true) {
            var theDivSearch = document.getElementById("divFlightSearchResult");
            theDivSearch.innerHTML = "";
            //if ($("#hdnIsItineraryCarrierCodeInterline").val() == "0") {
            //    var RateAvailable = true; // RateAvailableOrNot();
            //    if (RateAvailable == true) {
            //        if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
            //            var result = IsInternationalBookingAgent($("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
            //            if (result == true) {
            //                if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
            //                    SearchFlightMode("SearchFlight");
            //                }
            //                else
            //                    ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
            //            }
            //        }
            //        else
            //            ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");

            //        //else
            //        //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
            //    }
            //    else
            //        ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
            //}
        //    else {
                if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                    if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                        if(  ($("#ItineraryInterlineFlightNo").val() == "" ? $("#ItineraryFlightNo").val() : $("#ItineraryInterlineFlightNo").val())!= "") {
                     //   if ($("#ItineraryInterlineFlightNo").val() != "") {
                            if ($("#ItineraryCarrierCode").val() != "") {
                             //   if ($("#ItineraryInterlineFlightNo").val() != "" && $("#hdnIsItineraryCarrierCodeInterline").val() == "1") {
                           //     if ($("#ItineraryInterlineFlightNo").val() != "" && $("#hdnIsItineraryCarrierCodeInterline").val() == "1") {
                                    var SearchFlightValid = true;
                                    if ($("#hdnFlightDate").val() != "" && $("#ItineraryDate").val() != "") {
                                        var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

                                        var date = $("#hdnFlightDate").val();
                                        var Selecteddate_components = date.split("-");
                                        var Selectedcurrent_day = Selecteddate_components[0];
                                        var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
                                        var Selectedcurrent_year = Selecteddate_components[2];
                                        SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
                                        var SelectedDate = new Date(SelectedDateValue);

                                        var Date1 = $("#ItineraryDate").val();
                                        var Previousdate_components = Date1.split("-");
                                        var Previouscurrent_day = Previousdate_components[0];
                                        var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
                                        var Previouscurrent_year = Previousdate_components[2];
                                        PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
                                        var ItineraryDate = new Date(PreviousDateValue);

                                        if (ItineraryDate < SelectedDate) {
                                            ShowMessage('warning', 'Information!', "Itinerary Flight Date can not be less than Selected Date .");
                                            SearchFlightValid = false;
                                        }
                                    }
                                    if (SearchFlightValid == true) {

                                        var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
                                        var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
                                        var ItineraryOriginSNo = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key();
                                        var ItineraryDestinationSNo = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key();
                                        var ItineraryOriginCitySNo = 0;
                                        var ItineraryDestinationCitySNo = 0;
                                        $.ajax({
                                            url: "Services/Shipment/BackDateBookingService.svc/GETCitySNofromItinerary",
                                            async: false,
                                            type: "GET",
                                            dataType: "json",
                                            data: {
                                                ItineraryOriginSNo: ItineraryOriginSNo,
                                                ItineraryDestinationSNo: ItineraryDestinationSNo,
                                            },
                                            contentType: "application/json; charset=utf-8", cache: false,
                                            success: function (result) {
                                                if (result.substring(1, 0) == "{") {
                                                    var myData = jQuery.parseJSON(result);
                                                    if (myData.Table0.length > 0) {
                                                        ItineraryOriginCitySNo = myData.Table0[0].OriginCitySNo;
                                                        ItineraryDestinationCitySNo = myData.Table0[0].DestinationCitySNo;
                                                    }
                                                }
                                            },
                                            error: function (xhr) {
                                                var a = "";
                                            }
                                        });
                                        var theDiv = document.getElementById("divFinalSelectedroute");
                                        var table = "";
                                        if (theDiv.innerHTML == "") {
                                            table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                                        }
                                        if (theDiv.innerHTML == "") {
                                            table += "<tr id='Interline_0'><td class='ui-widget-content first'>" + ($("#ItineraryInterlineFlightNo").val() == "" ? $("#ItineraryFlightNo").val() : $("#ItineraryCarrierCode").val() + "-" + $("#ItineraryInterlineFlightNo").val()).toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><input name='hdnOriginAirportSNo_Interline_0' id='hdnOriginAirportSNo_Interline_0' type='hidden' value='" + ItineraryOriginSNo + "'/><input name='hdnDestinationAirportSNo_Interline_0' id='hdnDestinationAirportSNo_Interline_0' type='hidden' value='" + ItineraryDestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_0' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_0\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_0' id='hdnOriginCitySNo_Interline_0' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_0' id='hdnDestinationCitySNo_Interline_0' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_0' id='hdnSoftEmbargo_Interline_0' type='hidden' value=''/><input name='hdnItineraryMainVolumeWeight_Interline_0' id='hdnItineraryMainVolumeWeight_Interline_0' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_Interline_0' id='hdnArrFlightDate_Interline_0' type='hidden' value='" + $("#ItineraryDate").val() + "'/></td></tr>";
                                            $("#hdnETDTime").val('00:00');
                                            $("#hdnFlightDate").val($("#ItineraryDate").val());
                                            $("#hdnArrFlightDate").val($("#ItineraryDate").val());
                                        }
                                        else {
                                            var tableroute = document.getElementById("tblSelectdRouteResult");
                                            var RowID = tableroute.rows.length - 1;
                                            $('#tblSelectdRouteResult').append("<tr id='Interline_" + RowID + "'><td class='ui-widget-content first'>" + ($("#ItineraryInterlineFlightNo").val() == "" ? $("#ItineraryFlightNo").val() : $("#ItineraryCarrierCode").val() + "-" + $("#ItineraryInterlineFlightNo").val()).toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><input name='hdnOriginAirportSNo_Interline_" + RowID + "' id='hdnOriginAirportSNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginSNo + "'/><input name='hdnDestinationAirportSNo_Interline_" + RowID + "' id='hdnDestinationAirportSNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_" + RowID + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_" + RowID + "\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_" + RowID + "' id='hdnOriginCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_" + RowID + "' id='hdnDestinationCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_" + RowID + "' id='hdnSoftEmbargo_Interline_" + RowID + "' type='hidden' value=''/><input name='hdnItineraryMainVolumeWeight_Interline_" + RowID + "' id='hdnItineraryMainVolumeWeight_Interline_" + RowID + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_Interline_" + RowID + "' id='hdnArrFlightDate_Interline_" + RowID + "' type='hidden' value='" + $("#ItineraryDate").val() + "'/></td></tr>");
                                            $("#hdnETDTime").val('00:00');
                                            $("#hdnFlightDate").val($("#ItineraryDate").val());
                                            $("#hdnArrFlightDate").val($("#ItineraryDate").val());
                                        }
                                        if (theDiv.innerHTML == "") {
                                            table += "</tbody></table>";
                                            theDiv.innerHTML += table;
                                        }
                                        var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                        if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                                    $(tr).find("[id^='Delete_']").css("display", "none");
                                            });
                                        }



                                        var IsmatchAWBOriginCity = false;
                                        var IsmatchAWBDestinationCity = false;
                                        var AWBOriginCitySNo = $('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").value() == "" ? 0 : $('#tblShortBookingTab_Origin_' + rowIndex).data("kendoAutoComplete").key();
                                        var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
                                        var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
                                        var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
                                        var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
                                        var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));

                                        var SelectedItineraryPieces = 0;
                                        var SelectedItineraryGrossWeight = 0;
                                        var SelectedCBM = 0;
                                        var SelectedItineraryMainVolumeWeight = 0;
                                        var RemainingPieces = 0;
                                        var RemainingItineraryGrossWeight = 0;
                                        var RemainingCBM = 0;
                                        var RemainingItineraryMainVolumeWeight = 0;
                                        var table = document.getElementById("tblSelectdRouteResult");
                                        if (table != null && table.rows.length > 1) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                                                    SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                                                    SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                                                    SelectedCBM = parseFloat(SelectedCBM) + parseFloat($(tr).find("td")[5].innerText);
                                                    SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
                                                }
                                                if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val()) {
                                                    IsmatchAWBOriginCity = true;
                                                }
                                                if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val()) {
                                                    IsmatchAWBDestinationCity = true;
                                                }
                                            });
                                        }
                                        RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
                                        RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
                                        RemainingCBM = (parseFloat(AWBCBM) - parseFloat(SelectedCBM)).toFixed(3);
                                        RemainingItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
                                        if (SelectedItineraryPieces < AWBPieces) {
                                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
                                            $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
                                            $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
                                            $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

                                            $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                                            $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                                            $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? '' : RemainingCBM)
                                            $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? '' : RemainingCBM)
                                            $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                                            $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                                        }
                                        else {
                                            if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                                                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');

                                                $("#ItineraryPieces").val('');
                                                $("#_tempItineraryPieces").val('');
                                                $("#ItineraryGrossWeight").val('');
                                                $("#_tempItineraryGrossWeight").val('');
                                                $("#ItineraryVolumeWeight").val('');
                                                $("#_tempItineraryVolumeWeight").val('');
                                                $("#ItineraryMainVolumeWeight").val('');
                                                $("#_tempItineraryMainVolumeWeight").val('');


                                                var FlightDateForRateSearch = "";
                                                var FlightNoForRateSearch = "";
                                                var AllotmentCODEForRateSearch = "";


                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    if (row == 0)
                                                        FlightDateForRateSearch = $(tr).find("td")[1].innerText;
                                                    FlightNoForRateSearch += $(tr).find("td")[0].innerText + ',';
                                                    //if ($(tr).find("td")[8].innerText != '')
                                                    //    AllotmentCODEForRateSearch += $(tr).find("td")[0].innerText + '~' + $(tr).find("td")[8].innerText + '~' + $(tr)[0].id + ',';
                                                });
                                                if (FlightNoForRateSearch != "")
                                                    FlightNoForRateSearch = FlightNoForRateSearch.substring(0, FlightNoForRateSearch.length - 1);
                                                if (AllotmentCODEForRateSearch != "")
                                                    AllotmentCODEForRateSearch = AllotmentCODEForRateSearch.substring(0, AllotmentCODEForRateSearch.length - 1);
                                                var RateAvailableNEW = RateAvailableOrNotNEW(FlightDateForRateSearch, FlightNoForRateSearch, AllotmentCODEForRateSearch);
                                                if (RateAvailableNEW != true) {
                                                    ClearItineraryRoute();
                                                    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
                                                }
                                            }
                                            else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
                                                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);

                                                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                                $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                                $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                                $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                            }
                                            else {
                                                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                                $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                                $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                                $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                            }
                                            $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)

                                        }


                                        //if (Action.toUpperCase() == "NEW") {
                                        var tableSelected = document.getElementById("tblSelectdRouteResult");
                                        if (tableSelected != null && tableSelected.rows.length > 1) {
                                            $('#tblSelectdRouteResult  tr').each(function (row, tr) {
                                             //   $(tr).find("[id^='RouteStatus']").css("display", "none");
                                               // $(tr).find("[id^='Status']").css("display", "none");
                                             //   $(tr).find("[id^='SoftEmbargoApplied']").css("display", "none");
                                            });
                                        }
                                        //}

                                    }
                               // }
                            }
                            else
                                ShowMessage('warning', 'Information!', "Enter Carrier Code.");
                        }
                        else
                            ShowMessage('warning', 'Information!', "Enter Flight No.");
                    }
                    else
                        ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
                }
                else
                    ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");
           // }
    //    }
    //}

}
function ExtraCondition(textId) {
	var MainfiltertblFlightNo = cfi.getFilter("AND");
	if (textId.indexOf("tblShortBookingTab_FlightNo") >= 0) {		
		var filtertblFlightNo = cfi.getFilter("AND");
		cfi.setFilter(filtertblFlightNo, "FlightDate", "eq", $("#" + textId).closest('tr').find("input[id^='tblShortBookingTab_FlightDate_']").val());
		cfi.setFilter(filtertblFlightNo, "OriginCitySNo", "eq", $("#" + textId).closest('tr').find("input[id^='tblShortBookingTab_HdnOrigin_']").val());
		cfi.setFilter(filtertblFlightNo, "DestinationCitySNo", "eq", $("#" + textId).closest('tr').find("input[id^='tblShortBookingTab_HdnDestination_']").val());
		MainfiltertblFlightNo = cfi.autoCompleteFilter(filtertblFlightNo);
		return MainfiltertblFlightNo;
	}
	var MainfiltertblAgent = cfi.getFilter("AND");
	if (textId.indexOf("tblShortBookingTab_Agent") >= 0) {
		var filtertblFlightNo = cfi.getFilter("AND");
		cfi.setFilter(filtertblFlightNo, "CitySNo", "in", "" + userContext.CitySNo + "");
		MainfiltertblAgent = cfi.autoCompleteFilter(filtertblFlightNo);
		return MainfiltertblAgent;
	}
}
function CleanUI() {
	$("#ApplicationTabs-1").html("");
	$("#ApplicationTabs-2").html("");
	$("#ApplicationTabs-3").html("");
	$("#ApplicationTabs-4").html("");
	$("#ApplicationTabs-5").html("");

	$("#btnSave").unbind("click");
	$("#btnUpdate").unbind("click");
	$("#btnCopyBooking").unbind("click");
	$("#btnExecute").unbind("click");
	$("#ulReservation").hide();
	$("#ApplicationTabs").hide();

	$("#btnSave").css("display", "none");
	$("#btnUpdate").css("display", "none");
	$("#btnCopyBooking").css("display", "none");
	$("#btnExecute").css("display", "none");
	$("#btnNew").css("display", "block");
	$("#divEDox").html("");
}
function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno) {
	if (subprocess.toUpperCase() == "SHORTBOOKING") {
		cfi.ValidateSection(cntrlid);
		$("#btnSave").unbind("click").bind("click", function () {
			cfi.ValidateSubmitSection();
			if (cfi.IsValidSection(cntrlid)) {
				if (true) {
				}
			}
			else {
				return false
			}
		});
	}
}
function InstantiateControl(containerId) {
	$("#" + containerId).find("input[type='text']").each(function () {
		var controlId = $(this).attr("id");
		var decimalPosition = cfi.IsValidNumeric(controlId);
		if (decimalPosition >= -1) {
			$(this).css("text-align", "right");
			cfi.Numeric(controlId, decimalPosition);
		}
		else {
			var alphabetstyle = cfi.IsValidAlphabet(controlId);
			if (alphabetstyle != "") {
				if (alphabetstyle == "datetype") {
					cfi.DateType(controlId);
				}
				else {
					cfi.AlphabetTextBox(controlId, alphabetstyle);

				}
			}
		}
	});
	$("#" + containerId).find("textarea").each(function () {
		var controlId = $(this).attr("id");
		var alphabetstyle = cfi.IsValidAlphabet(controlId);
		if (alphabetstyle != "") {
			cfi.AlphabetTextBox(controlId, alphabetstyle);
		}
	});
	SetDateRangeValue();


	cfi.ValidateSubmitSection();
	$("div[id^='__appTab_").each(function () {
		$(this).kendoTabStrip().data("kendoTabStrip");
	});
	$("input[name='operation']").click(function () {
		_callBack();
	});
	$("[id$='divRemoveRecord']").hide();
	$("input[name='operation']").click(function () {
		if (cfi.IsValidSubmitSection()) {
			StartProgress();
			if ($(this).hasClass("removeop")) {
				$("#" + formid).trigger("submit");
			}
			StopProgress();
			return true;
		}
		else {
			return false
		}
	});
	_callBack = function () {
		if ($.isFunction(window.MakeTransDetailsData)) {
			return MakeTransDetailsData();
		}
	}

	_ExtraCondition = function (textId) {

		if ($.isFunction(window.ExtraCondition)) {
			return ExtraCondition(textId);
		}
	}
	$(".removepopup").click(function () {
		$("#divRemovePanel").show();
		cfi.PopUp("divRemoveRecord", "");
	});
	$(".cancelpopup").click(function () {
		$("#divRemovePanel").hide();
		cfi.ClosePopUp("divRemoveRecord");
	});
	$("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
		var transid = this.id.replace("divareaTrans_", "");
		cfi.makeTrans(transid, null, null, null, null, null, null);
	});

}
var fotter = "<div><table style='margin-left:20px;'>" +
	"<tbody><tr><td> &nbsp; &nbsp;</td>" +
	//"<td><button class='btn btn-primary btn-sm' style='width:125px' id='btnNew'>New Booking</button></td>" +
	"<td> &nbsp; &nbsp;</td>" +
	"<td><button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnSave'>Save</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnUpdate'>Update</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnExecute'>Execute</button></td>" +
	"<td> <button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnCopyBooking'>Copy</button></td>" +
	//"<td><button class='btn btn-block btn-success btn-sm' onclick='AWBPrint()'  id='btnAWBPrint'>AWB Print</button></td>" +
	//"<td><button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnSaveToNext'>Save &amp; Next</button></td>" +
	"<td> &nbsp; &nbsp;</td>" +
	"<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +

	"</tr></tbody></table> </div>";

var divContent = "<div class='rows'> <table style='width:100%'><input type='hidden' id='hdnBookingMasterRefNo'/><input type='hidden' id='hdnBookingSNo'/><input type='hidden' id='hdnPreviousBookingMasterRefNo'/><input type='hidden' id='hdnPreviousBookingSNo'/><input type='hidden' id='hdnShipperSNo'/><input type='hidden' id='hdnConsigneeSNo'/> <tr> <td valign='top' class='td100Padding'><div id='divViewRoutePopUp' style='width:100%'></div><div id='divViewFlightDetailPopUp' style='width:100%'></div><div id='divCBVHandlingInformationPopUp' style='width:100%'></div><div id='divCallerCodePopUp' style='width:100%'></div><div id='divShipmentDetails' style='width:100%'></div><div id='pWindow'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div><div id='divEDox' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td colspan='3'></td></tr><tr> <td id='IdAWBPrint' colspan='3' class='tdInnerPadding'>Print &nbsp;&nbsp;&nbsp;&nbsp;<select id='sprint' ><option value='AWB' selected>AWB</option><option value='CSD'  selected>eCSD</option><option value='AWBLabel'>AWB Label</option><option value='AcceptanceNote'>Acceptance Note</option><option value='PReceipt'>Payment Receipt</option><option value='Checklist'>Check List</option></select>&nbsp;<button name='button' onclick='bprint();' value='OK type='button'>Print</button></td></tr><tr id='trAmmendment'> <td>FWB Amendment</td><td>:</td><td><input type='checkbox' name='chkFWBAmmendMent' id='chkFWBAmmendMent'  onclick='ToggleCharge(this)'></td></tr><tr id='trAmmendmentCharge'> <td>Levy Amendment Charges</td><td>:</td><td><input type='checkbox' name='chkAmmendMentCharge' id='chkAmmendMentCharge' disabled></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> General </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";//<option value='EDI'>EDI Messages</option>
var rpl = "<ul id='ulReservation' style='display:none;'> <li class='k-state-active'> Reservation </li><li> Dimension </li><li>Rate</li><li>Message</li></ul> <div> <div id='ApplicationTabs-1'></div></div><div> <div id='ApplicationTabs-2'> </div></div><div><div id='ApplicationTabs-3'></div></div><div><div id='ApplicationTabs-4'></div></div>";
var SubGroupDiv = '<div id="divareaTrans_shipment_shipmentSHCSubGroup" style="display:none" cfi-aria-trans="trans">'
	+ '<table class="WebFormTable"><tbody>'
	+ '<tr><td class="formHeaderLabel snowidth" id="SubGroupSNo" name="SubGroupSNo">SNo</td><td class="formHeaderLabel" title="SHC"><span id="spnSHC"> SHC</span></td><td class="formHeaderLabel" title="Sub Group"><span id="spnSubGriup"> Sub Group</span></td>  <td class="formHeaderLabel" title=""><span id="spnLabel"></span></td><td class="formHeaderLabel" title="Mandatory Info"><span id="spnStatement"> Mandatory Info</span></td><td class="formHeaderLabel" title=""><span id="spnpackLabel" style="width: 150px;"></span></td> <td class="formHeaderLabel" title="Packing Instruction"><span id="spnPacking">Packing Instruction</span></td>   </tr>'
	+ '</tbody></table>'
	+ '</div>'
