
//cfi.AutoCompleteV2("AirlineCode", "AirlineCode", "TrackingOuter_AirlineCode", null, "contains");




function AddAirline() {
	$.ajax({
		url: "../../DataSetToExcel/GetAirlineCode", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
		success: function (result) {
			strAirlineCode = '<option value="0" >Select</option>';
			$(JSON.parse(result).Table).each(function (row, tr) {
				strAirlineCode += '<option value=' + tr.AirlineCode + ' >' + tr.AirlineCode + '</option>';
			});
		},
		error: function (jqXHR, textStatus) {
		}
	});
	if ($('#Text_AirlineCode').length) {
	    $('#Text_AirlineCode').html('')
	    $('#Text_AirlineCode').append(strAirlineCode);
	}
}

// check whether the data is provided or not




$(window).load(function () {
    // Your code here
    $("#Emailoption").hide();
    $("#ahref_EmailId").hide();
    var EmailAddress = $('#hdnmail').val();
    fnSetEmail();
    FnNotAllowedEnterKey();
	AddAirline();
});

$(document).on('paste', '#Text_AirlineCode', function (e) {
	if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
		e.preventDefault()
		var data = e.originalEvent.clipboardData.getData('Text');
		var len = data.length;
		if (len > 3) {
			var resdata = data.split('-');
			$("#Text_AirlineCode").data("kendoAutoComplete").setDefaultValue(resdata[0], resdata[0]);
			var outval = resdata[1].replace(/[0-9,\s]/gi, '');
			if (outval.length == 0)
				$("#AWBNo").val(resdata[1]);
			$('#SearchAWB').focus();

		}
	}
});
$(document).on('paste', '#AWBNo', function (e) {
	if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
		var data = e.originalEvent.clipboardData.getData('Text');
		var outval1 = data.replace(/[0-9,\s]/gi, '');
		if (outval1.length == 0)
			$("#AWBNo").val(data);
		e.preventDefault();
	}
});
$(document).on('focus', '#AWBNo', function (e) {
	if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
		$("#AWBNo").attr("placeholder", "Max 10 AWB entries (comma separated)");
	}
});
$(document).on('blur', '#AWBNo', function (e) {
	//if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
	$("#AWBNo").removeAttr("placeholder");//, "Max 10 AWB entries (comma separated)");
	//}
});
$(document).on('keypress', '#AWBNo', function (e) {
	if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
		var regex = new RegExp("^[0-9,]+$");
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regex.test(str)) {
			return true;
		}

		e.preventDefault();
		return false;
	}
	return true;
});

$(document).on('change', '#BasedOn', function () {
	if (parseInt($("input[name='BasedOn']:checked").val()) == 0) {
		$("#AWBNo").attr('maxlength', 87);
		//$("#AWBNo").attr("placeholder", "Max 10 airwaybills allowed.");
		$("#AWBNo").val('');
	}
	else {
		$("#AWBNo").val('');
		$("#AWBNo").removeAttr('maxlength');
		$("#AWBNo").removeAttr('placeholder');
	}
});
$(document).on('click', '#ahref_EmailId', function () {
    $("#Emailoption").show();
    $("#ahref_EmailId").hide();
});
var myData = "";
function Search(awbno, carriercode) {
    $("#AWBDetails").show();
    $("#Emailoption").hide();
    $("#ahref_EmailId").show();
    var BasedOn =awbno? 0 : parseInt($("input[name='BasedOn']:checked").val());
    var AWBNo = awbno || $.trim($("#AWBNo").val());
    AWBNo = AWBNo ? AWBNo.toString() : "";
    var CarrierCode = carriercode || $("#Text_AirlineCode option:selected").val();
	var AccountSNo = 0;
	var flag = 0;
	var str = "";
	var str1 = "";
	var str2 = "";
	
	if (userContext.GroupName != undefined) {
		if (userContext.GroupName.toUpperCase() == "AGENT") {
			AccountSNo = userContext.AgentSNo;
			flag = 1;
		}
	}

	if (BasedOn == 0) {
		str2 = "<span class='attMed'><strong>AWB No: " + CarrierCode + "-"
	}
	else if (BasedOn == 1) {
		str2 = "<span class='attMed'><strong>Reference Number: "
	}
	else {
		str2 = "<span class='attMed'><strong>PO Mail No: " + CarrierCode + "-"
	}
	// rendering the data from awbtracking service
	$.ajax({
		url: "../../Services/Shipment/AWBTrackingService.svc/GetAWBTrackingRecord",
		async: false,
		type: "GET",
		dataType: "json",
		data: { AWBNo: AWBNo, BasedOn: BasedOn, AccountSNo: AccountSNo, flag: flag, CarrierCode: CarrierCode },
		contentType: "application/json; charset=utf-8",
		cache: false,
		success: function (result) {
			$("#AWBDetails").html('');
			var countmain = 0;
			var count = 0;
			var countforbkd = 0; var countforexe = 0; var countforrcs = 0; var countnexttd = 0;
			var action = ""; var station = ""; var description = "";
			 myData = jQuery.parseJSON(result);
			if (myData == null || myData == '') {
				ShowMessage('warning', 'AWB TRACKING', "Some Error Occured");
				return;
			}
			if (myData.Table0.length > 0) {
			    var IsPenaltyApproved = myData.Table0[0].IsPenaltyApproved
			    var PenaltyType = myData.Table0[0].PenaltyType

			    if (PenaltyType == 3 && IsPenaltyApproved == '') {
			        ShowMessage('warning', 'AWB TRACKING', "AWB is marked as Cancelled");
			        return;
			    }
			    if (PenaltyType == 1 && IsPenaltyApproved == '') {
			        ShowMessage('warning', 'AWB TRACKING', "AWB is marked as VOID");
			        return;
			    }
			    if ((PenaltyType === "0" && IsPenaltyApproved === "") || (PenaltyType === "11" && IsPenaltyApproved === "")) {
			        ShowMessage('warning', 'AWB TRACKING', "AWB is marked as NO SHOW");
			        return;
			    }
				str += '<ul id="AWBOuterSearchPanelBar">';
				for (var i = 0; i < AWBNo.split(',').length; i++) {
					var divmain = "divmain" + i;
					var divsummary = "divsummmary" + i;
					var divmile = "divmilestone" + i;
					var divinfo = "divinfo" + i;
					var divhistory = "divstatushistory" + i;
					countmain = 0;
					countnexttd = 0;
					// create table for summary and awb details
					for (var j = 0; j < myData.Table0.length; j++) {

						if (myData.Table0[j].AWBNo == CarrierCode + '-' + AWBNo.split(',')[i] || myData.Table0[j].AWBNo == AWBNo.split(',')[i]) {
							if (countmain == 0) {
								str += '<li class="k-state-active"><b><span id="AWBNoInput">' + str2 + myData.Table0[j].AWBNo + '</strong></span></span></b><div id="' + divmain + '" style="width: 98%; margin-left: 15px;"><ul id="AWBInnerSearchpanelbar"' + count + '>';
								str += '<li class="k-state-active"><span><b>AWB Summary</b></span><div id="' + divsummary + '" style="width: 98%; margin-left: 15px;">'

								for (var m = 0; m < myData.Table1.length; m++) {
									if (myData.Table1[m].AWBNo == myData.Table0[j].AWBNo || myData.Table1[m].ReferenceNumber == myData.Table0[j].AWBNo) {
										//latest event
										str += '<table cellpadding="12"><tr><td><span style="color:red;"><strong>LATEST EVENT: <span style="color:blue;">' + myData.Table1[m].Action + ' </span></strong></span><span><b>Your shipment '
										var action = myData.Table1[m].Action;
										switch (action) {
											case ('BKD'):
												str += 'has been booked at ';
												break;
											case ('EXE'):
												str += 'has been executed at ';
												break;
											case ('RCS'):
												str += 'has been accepted at ';
												break;
											case ('REPLAN'):
												str += 'has been Re-planned at ';
												break;
											case ('RCT'):
												str += 'has been transferred at ';
												break;
											case ('PRE'):
												str += 'has been pre-manifested at ';
												break;
											case ('MAN'):
												str += 'has been manifested at ';
												break;
											case ('DEP'):
												str += 'has been Departed from ';
												break;
											case ('ARR'):
												str += 'has been arrived at ';
												break;
											case ('RCF'):
												str += 'has been arrived at ';
												break;
											case ('TFD'):
												str += 'has been transferred at ';
												break;
											case ('NFD'):
												str += 'has been notified at ';
												break;
											case ('AWD'):
												str += 'document has arrived at ';
												break;
											case ('DLV'):
												str += 'has been delivered at ';
												break;
											default:
												str += '';
												break;

										}
										str += myData.Table1[m].Station + ' on ' + myData.Table1[m].createdon + '</b></span></td></tr></table>';
									}
								}
								// summary
								str += "<table width='100%' border='0' align='center' cellpadding='8' cellspacing='0' class='k-focusable k-selectable'><tbody >"
								str += "<tr style='background-color:#bfbbbb'><td width='20%' height='25' align='center' valign='middle'><strong><b>Origin</b><strong></td><td width='20%' height='25' align='center' valign='middle'><strong><b>Destination</b><strong></td><td width='20%' height='25' align='center' valign='middle'><strong><b>Total Pieces</b><strong></td><td width='20%' height='25' align='center' valign='middle'><strong><b>Gross Weight</b><strong></td><td width='20%' height='25' align='center' valign='middle'><strong><b>Product</b><strong></td></tr>"
								if (myData.Table0.length > 1) {
									str += "<tr ><td width='20%' align='center' valign='middle'><strong>" + myData.Table0[1].Origin + "</strong></td><td width='20%' align='center' valign='middle' ><strong>" + myData.Table0[1].Destination + "</strong></td><td width='20%' align='center' valign='middle' ><strong>" + myData.Table0[1].Pieces + "</strong></td><td width='20%' align='center' valign='middle' ><strong>" + myData.Table0[1].GrossWeight + "</strong></td><td width='20%' align='center' valign='middle'><strong>" + myData.Table0[1].ProductName + "</strong></td></tr></tbody></table>"
								}
								else {
									str += "<tr ><td width='20%' align='center' valign='middle'><strong>" + myData.Table0[j].Origin + "</strong></td><td width='20%' align='center' valign='middle' ><strong>" + myData.Table0[j].Destination + "</strong></td><td width='20%' align='center' valign='middle' ><strong>" + myData.Table0[j].Pieces + "</strong></td><td width='20%' align='center' valign='middle' ><strong>" + myData.Table0[j].GrossWeight + "</strong></td><td width='20%' align='center' valign='middle'><strong>" + myData.Table0[j].ProductName + "</strong></td></tr></tbody></table>"
								}
								str += '</div></li>';
								// booking and acceptance
								//str  += '<li class="k-state-active"><span><b>Booking & Acceptance Information</b></span><div id="' + divinfo + '" style="width: 98%; margin-left: 15px; ">'
								//str += "<table id='tblbkdrcs' cellspacing='0' cellpadding='8' border='0' width='100%' align='center'><tbody><tr style='background-color:#bfbbbb; '><td align='center' width='17%'><strong><b>Origin</b><strong></td><td align='center' width='17%'><strong><b>Destination</b><strong></td><td align='center' width='17%' ><strong><b>Pieces</b><strong></td><td align='center' width='17%' ><strong><b>Gross Weight</b><strong></td><td align='center' width='17%'><strong><b>Volume</b><strong></td><td align='center' width='15%' ><strong><b>Status</b><strong></td></tr>"
								countmain += 1;
							}
							count += 1;
							//if (myData.Table0[j].AWBStatus == 'BKD' || myData.Table0[j].AWBStatus == 'EXE' || myData.Table0[j].AWBStatus == 'RCS')
							//{

							//    str += "<tr style='background-color: #eae7e7;'><td align='center' width='17%'>" + myData.Table0[j].Origin + "</td><td align='center' width='17%'>" + myData.Table0[j].Destination + "</td><td align='center' width='17%' >" + myData.Table0[j].Pieces + "</td><td align='center' width='17%' >" + myData.Table0[j].GrossWeight + "</td><td align='center' width='17%'>" + myData.Table0[j].cbm + "</td><td align='center' width='15%' >" + myData.Table0[j].AWBStatus + "</td></tr>"
							//}
						}
					} //str += "</tbody></table>"

					//str += '</div></li>';
					countmain = 0;
					countforbkd = 0; countforexe = 0; countforrcs = 0;
					// create table for milestone plan
					var bkdexercs = 4;
					for (var l = 0; l < myData.Table2.length; l++) {
						bkdexercs = 4;

						if (myData.Table2[l].AWBNo == AWBNo.split(',')[i] || myData.Table2[l].ReferenceNumber == AWBNo.split(',')[i]) {
							if (countmain == 0) {
								//milestone plan table only 1st iteration
								str += '<li class="k-state-active"><span><b>Milestone Plan</b></span><div id="' + divmile + '" style="width: 98%; margin-left: 15px;">'
								str += '<div id="milestoneinner" style = "text-align: -webkit-center;">'
								str += '<table ><tr >'

							}

							if (countforbkd == 0 && myData.Table2[l].Action.toUpperCase() == 'BKD') {
								action = myData.Table2[l].Action.toUpperCase();
								station = myData.Table2[l].Station;
								countforbkd = 1;
								bkdexercs = 1;
							}
							if (countforexe == 0 && myData.Table2[l].Action.toUpperCase() == 'EXE') {
								action = myData.Table2[l].Action.toUpperCase();
								station = myData.Table2[l].Station;
								countforexe = 1;
								bkdexercs = 1;
							}
							if (countforrcs == 0 && myData.Table2[l].Action.toUpperCase() == 'RCS') {
								action = myData.Table2[l].Action.toUpperCase();
								station = myData.Table2[l].Station;
								countforrcs = 1;
								bkdexercs = 1;
							}
							if (myData.Table2[l].Action.toUpperCase() == action && myData.Table2[l].Station != station) {
								myData.Table2[l].Action = action;
								myData.Table2[l].Station = station;

								continue;
							}
							if ((myData.Table2[l].Action.toUpperCase() == 'BKD' || myData.Table2[l].Action.toUpperCase() == 'EXE' || myData.Table2[l].Action.toUpperCase() == 'RCS') && bkdexercs == 4) {
								continue;
							}
							// to not get the arrow image first time
							if (countmain != 0) {
								str += '<td style="text-align:center;padding:2px;"><img  src="../../images/arrowtrack.png" alt="confirm order"></td>'
							}
							countmain = 1;
							if (countnexttd % 9 == 0 && countnexttd > 0) {
								str += '</tr><tr>'
							}
							if (myData.Table2[l].Action.toUpperCase() == 'BKD' || myData.Table2[l].Action.toUpperCase() == 'EXE' || myData.Table2[l].Action.toUpperCase() == 'RCS') {
							    str += '<td style="text-align:center;padding:2px;"><p ><b>' + myData.Table2[l].Station + '</b></p><img  src="../../images/' + myData.Table2[l].Action.toUpperCase() + ".png" + '" alt="confirm order"><p ><b>' + myData.Table2[l].Action + '</b></p>'
								str += '<p><b>' + myData.Table2[l].createdon + '</b></p><p><b>' + myData.Table2[l].ActualPieces + ' pcs' + '</b></p></td>'
							}
							else {
								// for arr at rcf
								//if (myData.Table2[l].Action.toUpperCase() == 'RCF') {
								//    str += '<td style="text-align:center;padding:2px;"><p ><b>' + myData.Table2[l].Station + '</b></p><img  src="../images/ARR.png" alt="confirm order"><p ><b>ARR</b></p>'
								//    str += '<p><b>' + myData.Table2[l].createdon + '</b></p><p><b>' + myData.Table2[l].Pieces + ' pcs' + '</b></p></td>';
								//    str += '<td style="text-align:center;padding:2px;"><img  src="../images/arrowtrack.png" alt="confirm order"></td>';
								//    countnexttd += 1;
								//    if (countnexttd % 9 == 0 && countnexttd > 0) {
								//        str += '</tr><tr>';
								//    }
								//}
							    str += '<td style="text-align:center;padding:2px;"><p ><b>' + myData.Table2[l].Station + '</b></p><img  src="../../images/' + myData.Table2[l].Action.toUpperCase() + ".png" + '" alt="confirm order"><p ><b>' + myData.Table2[l].Action + '</b></p>'
								str += '<p><b>' + myData.Table2[l].createdon + '</b></p><p><b>' + myData.Table2[l].Pieces + ' pcs' + '</b></p></td>'
							}
							countnexttd += 1;

						}
					} str += '</tr></table></div></div></li>';
					countmain = 0;
					// create table for  flight details
					for (var k = 0; k < myData.Table2.length; k++) {
						if (myData.Table2[k].AWBNo == AWBNo.split(',')[i] || myData.Table2[k].ReferenceNumber == AWBNo.split(',')[i]) {
							//flight details table only 1st iteration
							if (countmain == 0) {
								str += '<li class="k-state-active"><span><b>Flight Details</b></span><div id="' + divhistory + '" style="width: 98%; margin-left: 15px; ">'
								if (userContext.SysSetting != undefined) {
									if (userContext.SysSetting.ShowPlannedPiecesInTracking.toUpperCase() == 'FALSE')
										str += "<table id='tblstatus' cellspacing='0' cellpadding='8' border='0' width='100%' align='center'><tbody><tr style='background-color:#bfbbbb; '><td align='center' width='11%' ><strong><b>Event</b></strong></td><td align='center' width='19%' ><strong><b>Description</b></strong></td><td align='center' width='11%' ><strong><b>Station</b></strong></td><td align='center' width='19%'><strong><b>Flight No</b></strong></td><td align='center' width='14%'><strong><b>Flight Date</b></strong></td><td align='center' width='13%' ><strong><b>Pieces</b></strong></td><td align='center' width='13%' ><strong><b>Gross Weight</b></strong></td></tr>"
									else
										str += "<table id='tblstatus' cellspacing='0' cellpadding='8' border='0' width='100%' align='center'><tbody><tr style='background-color:#bfbbbb; '><td align='center' width='10%' ><strong><b>Event</b></strong></td><td align='center' width='18%' ><strong><b>Description</b></strong></td><td align='center' width='10%' ><strong><b>Station</b></strong></td><td align='center' width='17%'><strong><b>Flight No</b></strong></td><td align='center' width='12%'><strong><b>Flight Date</b></strong></td><td align='center' width='11%' ><strong><b>Total Pieces</b></strong></td><td align='center' width='11%' ><strong><b>Planned Pieces</b></strong></td><td align='center' width='11%' ><strong><b>Gross Weight</b></strong></td></tr>"
								}
								else {
									str += "<table id='tblstatus' cellspacing='0' cellpadding='8' border='0' width='100%' align='center'><tbody><tr style='background-color:#bfbbbb; '><td align='center' width='10%' ><strong><b>Event</b></strong></td><td align='center' width='18%' ><strong><b>Description</b></strong></td><td align='center' width='10%' ><strong><b>Station</b></strong></td><td align='center' width='17%'><strong><b>Flight No</b></strong></td><td align='center' width='12%'><strong><b>Flight Date</b></strong></td><td align='center' width='11%' ><strong><b>Total Pieces</b></strong></td><td align='center' width='11%' ><strong><b>Planned Pieces</b></strong></td><td align='center' width='11%' ><strong><b>Gross Weight</b></strong></td></tr>"
								}
								countmain += 1;
							}
							switch (myData.Table2[k].Action) {
								case ('BKD'):
									description = 'Booking confirmed';
									break;
								case ('EXE'):
									description = 'Booking executed';
									break;
								case ('RCS'):
									description = 'Shipment accepted';
									break;
								case ('REPLAN'):
									description = 'Shipment Re-planned';
									break;
								case ('RCT'):
									description = 'Shipment transferred';
									break;
								case ('PRE'):
									description = 'Pre-manifested';
									break;
								case ('MAN'):
									description = 'Manifested';
									break;
								case ('DEP'):
									description = 'Departed';
									break;
								case ('RCF'):
									description = 'Received from flight';
									break;
								case ('TFD'):
									description = 'Shipment transferred';
									break;
								case ('ARR'):
									description = 'AWB Arrived';
									break;
								case ('NFD'):
									description = 'Ready for pick-up';
									break;
								case ('AWD'):
									description = 'Document arrived';
									break;
								case ('DLV'):
									description = 'Delivered';
									break;
								default:
									description = '';
									break;

							}
							//<td align='center' width='11%'><strong><b>Origin</b></strong></td><td align='center' width='11%'><strong><b>Destination</b></strong></td>
							//if (myData.Table2[k].Action.toUpperCase() == 'RCF') {
							//    str += "<tr style='background-color: #eae7e7;'><td align='center' width='10%' >ARR</td><td align='center' width='18%' >AWB Arrived</td><td align='center' width='10%'>" + myData.Table2[k].Station + "</td><td align='center' width='17%'><b><font color='red'>" + myData.Table2[k].FlightNo + "</font><font color='blue'> ( " + myData.Table2[k].Origin + " -> " + myData.Table2[k].Destination + " )</font></b>" + "</td><td align='center' width='12%'>" + myData.Table2[k].FlightDate + "</td><td align='center' width='11%' >" + myData.Table2[k].ActualPieces + "</td><td align='center' width='11%' >" + myData.Table2[k].Pieces + "</td><td align='center' width='11%' >" + myData.Table2[k].Weight + "</td></tr>"
							//}
							if (userContext.SysSetting != undefined) {
								if (userContext.SysSetting.ShowPlannedPiecesInTracking.toUpperCase() == 'FALSE')
									str += "<tr style='background-color: #eae7e7;'><td align='center' width='11%' >" + myData.Table2[k].Action + "</td><td align='center' width='19%' >" + description + "</td><td align='center' width='11%'>" + myData.Table2[k].Station + "</td><td align='center' width='19%'><b><font color='red'>" + myData.Table2[k].FlightNo + "</font><font color='blue'> ( " + myData.Table2[k].Origin + " -> " + myData.Table2[k].Destination + " )</font></b>" + "</td><td align='center' width='14%'>" + myData.Table2[k].FlightDate + "</td><td align='center' width='13%' >" + myData.Table2[k].Pieces + "</td><td align='center' width='13%' >" + myData.Table2[k].Weight + "</td></tr>"
								else
									str += "<tr style='background-color: #eae7e7;'><td align='center' width='10%' >" + myData.Table2[k].Action + "</td><td align='center' width='18%' >" + description + "</td><td align='center' width='10%'>" + myData.Table2[k].Station + "</td><td align='center' width='17%'><b><font color='red'>" + myData.Table2[k].FlightNo + "</font><font color='blue'> ( " + myData.Table2[k].Origin + " -> " + myData.Table2[k].Destination + " )</font></b>" + "</td><td align='center' width='12%'>" + myData.Table2[k].FlightDate + "</td><td align='center' width='11%' >" + myData.Table2[k].ActualPieces + "</td><td align='center' width='11%' >" + myData.Table2[k].Pieces + "</td><td align='center' width='11%' >" + myData.Table2[k].Weight + "</td></tr>"
							}
							else
								str += "<tr style='background-color: #eae7e7;'><td align='center' width='10%' >" + myData.Table2[k].Action + "</td><td align='center' width='18%' >" + description + "</td><td align='center' width='10%'>" + myData.Table2[k].Station + "</td><td align='center' width='17%'><b><font color='red'>" + myData.Table2[k].FlightNo + "</font><font color='blue'> ( " + myData.Table2[k].Origin + " -> " + myData.Table2[k].Destination + " )</font></b>" + "</td><td align='center' width='12%'>" + myData.Table2[k].FlightDate + "</td><td align='center' width='11%' >" + myData.Table2[k].ActualPieces + "</td><td align='center' width='11%' >" + myData.Table2[k].Pieces + "</td><td align='center' width='11%' >" + myData.Table2[k].Weight + "</td></tr>"
						}
					} str += "</tbody></table>"

					str += '</ul></div></li>';

				}
				str += "</ul>";
				$("#AWBDetails").append(str);
				$("#tblbkdrcs tr:odd,#tblstatus tr:odd").css("background-color", "#ffffff");
				$("#AWBOuterSearchPanelBar").kendoPanelBar();
				$("[id^=AWBInnerSearchpanelbar]").kendoPanelBar();

			}
			else {
				$("#AWBDetails").html('');
				ShowMessage('warning', 'AWB TRACKING', "No Record Found");
			}

		}
	});
}


function ExtraCondition(textId) {

	var filterAWB = cfi.getFilter("AND");
	if (textId == "Text_AirlineCode") {
		cfi.setFilter(filterAWB, "IsActive", "eq", 1)
		var AutoCompleteFilter = cfi.autoCompleteFilter([filterAWB]);
		return AutoCompleteFilter;
	}
}



$("#SearchAWB").click(function () {
	//$(document).on('click', '#SearchAWB', function () {
	if ($("#AWBNo").val() == "") {
		$("#AWBTrackingGridDivInner").html('');
		$("#AWBDetails").hide();
		ShowMessage('warning', 'Need Your Kind Attention', "AWB No / Reference Number Is Required");
	}
	else if ($("#Text_AirlineCode option:selected").val() == "") {
		$("#AWBTrackingGridDivInner").html('');
		$("#AWBDetails").hide();
		ShowMessage('warning', 'Need Your Kind Attention', "Airline Code Is Required");
	}
	else {
		Search();
	}
});

$(document).on('paste', '#Text_AirlineCode', function (e) {
	e.preventDefault()
	var data = e.originalEvent.clipboardData.getData('Text');
	var len = data.length;
	if (len > 3) {
		var resdata = data.split('-');
		$("#Text_AirlineCode").data("kendoAutoComplete").setDefaultValue(resdata[0], resdata[0]);
		$("#AWBNo").val(resdata[1]);
		$('#SearchAWB').focus();

	}
});

////**************For Email Function****************//

function FnNotAllowedEnterKey() {
    $("body").keydown(function (e) {
        var addlen = $("#txtEmail").val();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
}
function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}
function fnSetEmail() {
    $("#txtEmail").keyup(function (e) {
        var addlen = $("#txtEmail").val();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            var finalValue = addlen.substring(0, addlen.length - 1);
            if (ValidateEMail(finalValue)) {
                if ($("ul#addlist1 li").length < 3) {
                    var listlen = $("ul#addlist1 li").length;
                    $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + finalValue + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                }
                else {
                    ShowMessage('warning', 'Warning  ', "Maximum 3 E-mail Addresses allowed.");
                }
                $("#txtEmail").val('');
            }
            else {
                ShowMessage('warning', 'Warning  ', "Enter valid Email address.");
                return;
            }
        }
        else
            e.preventDefault();
    });
    $("#txtEmail").blur(function () {
        $("#txtEmail").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });

}

function SaveEmailId() {
    var k = '';
    var L = '';

    for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++)
    { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }


    $("#hdnmail").val(L.substring(0, L.length - 1));

    if ($('#hdnmail').val() == '' || $('#hdnmail').val() == "0") {
        ShowMessage('warning', 'Warning', "Please enter email address!", "bottom-right");
        return false;
    }
    if ($("#Text_AirlineCode").val() != '' && $("#AWBNo").val() != '') {
        var AWB = $("#Text_AirlineCode").val() + '-' + $("#AWBNo").val();
    }
    else {
        ShowMessage('warning', 'Warning', "Please enter AWBNo!", "bottom-right");
        return false;
    }
    var action = '';
    var description = '';
    var MailBody = '';
    var MailBody1 = '';
    var MailBody2 = '';
    var MailBody3 = '';

    //Search();


    //For AWB Summary detail in Email
    for (var j = 0; j < myData.Table0.length; j++) {
        for (var m = 0; m < myData.Table1.length; m++) {
            //for getting shipment event
            switch (myData.Table1[m].Action) {
                case ('BKD'):
                    description = 'has been booked at ';
                    break;
                case ('EXE'):
                    description = 'has been executed at ';
                    break;
                    //case ('Cancel'):
                    //    str += 'has been Cancelled at ';
                    //    break;
                    //case ('APR'):
                    //    str += 'has been Approved at ';
                    //    break;
                case ('RCS'):
                    description = 'has been accepted at ';
                    break;
                case ('REPLAN'):
                    description = 'has been Re-planned at ';
                    break;
                case ('RCT'):
                    description = 'has been transferred at ';
                    break;
                case ('PRE'):
                    description = 'has been pre-manifested at ';
                    break;
                case ('MAN'):
                    description = 'has been manifested at ';
                    break;
                case ('DEP'):
                    description = 'has been Departed from ';
                    break;
                case ('ARR'):
                    description = 'has been arrived at ';
                    break;
                case ('RCF'):
                    description = 'has been arrived at ';
                    break;
                case ('TFD'):
                    description = 'has been transferred at ';
                    break;
                case ('NFD'):
                    description = 'has been notified at ';
                    break;
                case ('AWD'):
                    description = 'document has arrived at ';
                    break;
                case ('DLV'):
                    description = 'has been delivered at ';
                    break;
                default:
                    description = '';
                    break;

            }
            MailBody1 = "<table width='100%' border='0' align=''center='' cellpadding='0' cellspacing='0'  style='font-size: small;font-family: auto;margin-top:1%;border-collapse:collapse;'><tr><td colspan='7' style='border:0px solid #dddddd;text-align:left;padding:8px;'>Your Shipment Details- AWBNo:" + AWB + " <br><br></td></tr><tr><td style='border:0px solid #dddddd;text-align:left;padding:8px;'><span style='color:red;'><b>LATEST EVENT: <span style='color:blue;'>" + myData.Table1[m].Action + " </span></b></span><span><b>Your shipment " + description + myData.Table1[m].Station + " on " + myData.Table1[m].createdon + "</b></span></td></tr></table><table width='100%' border='0' align=''center='' cellpadding='0' cellspacing='0'  style='font-size: small;font-family: auto;margin-top:1%;border-collapse:collapse;'><tr><td colspan='7' style='border:0px solid #dddddd;text-align:left;padding:8px;'><b>AWB Summary </b><br></td></tr><tr><th style='border:1px solid #dddddd;text-align:left;padding:8px;width:20%;'>Origin</th><th style='border:1px solid #dddddd;text-align:left;padding:8px;width:20%;'>Destination</th><th style='border:1px solid #dddddd;text-align:left;padding:8px;width:20%;'>Total Pieces</th><th style='border:1px solid #dddddd;text-align:left;padding:8px;width:20%;'>Gross Weight</th><th style='border:1px solid #dddddd;text-align:left;padding:8px;width:20%;'>Product</th></tr>";
            MailBody1 = MailBody1 + "<tr><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table0[j].Origin + "</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table0[j].Destination + "</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table0[j].Pieces + "</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table0[j].GrossWeight + "	</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table0[j].ProductName + "</td></tr></table>";
        }
    }


    var imageurl = window.location.origin+'/';
    var countmain = 0;
    var countnexttd = 0;

    MailBody3 = "<table width='100%' border='0' align=''center='' cellpadding='0' cellspacing='0'  style='font-size: small;font-family: auto;margin-top:1%;border-collapse:collapse;'><tr><td colspan='7' style='border:0px solid #dddddd;text-align:left;padding:8px;'><b>Milestone Plan </b><br></td></tr><tr>";
    for (var l = 0; l < myData.Table2.length; l++) {
        if (countmain != 0) {
            MailBody3 += '<td style="text-align:center;padding:2px;"><img  src=' + imageurl + '/images/arrowtrack.png alt="confirm order" width="20%"></td>'
        }
        countmain = 1;
        if (countnexttd % 9 == 0 && countnexttd > 0) {
            MailBody3 += '</tr><tr>'
        }
        MailBody3 = MailBody3 + '<td style="text-align:center;padding:2px;"><p ><b>' + myData.Table2[l].Station + '</b></p><img  src=' + imageurl + 'images/' + myData.Table2[l].Action.toUpperCase() + '.png + alt="confirm order" width="20%"><p ><b>' + myData.Table2[l].Action + '</b></p>'
        MailBody3 = MailBody3 + '<p><b>' + myData.Table2[l].createdon + '</b></p><p><b>' + myData.Table2[l].ActualPieces + ' pcs' + '</b></p></td>'
        MailBody3 = MailBody3 + "</td>";
    }
    MailBody3 = MailBody3 + "</tr></table>";



    //For Flight Detail in Email
    for (var k = 0; k < myData.Table2.length; k++) {
        action = myData.Table2[k].Action;

        switch (myData.Table2[k].Action) {
            case ('BKD'):
                description = 'Booking confirmed';
                break;
            case ('EXE'):
                description = 'Booking executed';
                break;
            case ('RCS'):
                description = 'Shipment accepted';
                break;
            case ('REPLAN'):
                description = 'Shipment Re-planned';
                break;
            case ('RCT'):
                description = 'Shipment transferred';
                break;
            case ('PRE'):
                description = 'Pre-manifested';
                break;
            case ('MAN'):
                description = 'Manifested';
                break;
            case ('DEP'):
                description = 'Departed';
                break;
            case ('RCF'):
                description = 'Received from flight';
                break;
            case ('TFD'):
                description = 'Shipment transferred';
                break;
            case ('ARR'):
                description = 'AWB Arrived';
                break;
            case ('NFD'):
                description = 'Ready for pick-up';
                break;
            case ('AWD'):
                description = 'Document arrived';
                break;
            case ('DLV'):
                description = 'Delivered';
                break;
            default:
                description = '';
                break;

        }


        MailBody2 = "<table width='100%' border='0' align=''center='' cellpadding='0' cellspacing='0'  style='font-size: small;font-family: auto;margin-top:1%;border-collapse:collapse;'><tr><td colspan='7' style='border:0px solid #dddddd;text-align:left;padding:8px;'><b>Flight Details</b> <br></td></tr><tr><th style='border:1px solid #dddddd;text-align:left;padding:8px;'>Event</th><th style='border:1px solid #dddddd;text-align:left;padding:8px;'>Description</th><th style='border:1px solid #dddddd;text-align:left;padding:8px;'>Station</th><th style='border:1px solid #dddddd;text-align:left;padding:8px;'>Flight No</th><th style='border:1px solid #dddddd;text-align:left;padding:8px;'>Flight Date</th><th style='border:1px solid #dddddd; text-align:left; padding:8px; '>Pieces	</th><th style='border:1px solid #dddddd;text-align:left; padding:8px; '>Gross Weight</th></tr>";
        MailBody2 = MailBody2 + "<tr><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + action + "</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + description + "</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table2[k].Station + "</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table2[k].FlightNo + "	</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table2[k].FlightDate + "</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table2[k].Pieces + "</td><td style='border:1px solid #dddddd;text-align:left;padding:8px;'>" + myData.Table2[k].Weight + "</td></tr>";
        MailBody2 = MailBody2 + "<tr><td colspan='7' style='border:0px solid #dddddd;text-align:left;padding:8px;color:blue;'><br><br>This is System generated email. Do not reply back to this email.</td></tr></table>";
    }


    var obj = {
        AWBNo: AWB,
        EmailAddress: btoa($('#hdnmail').val()),
        MailSubject: '',
        MailBody: btoa(MailBody1 + MailBody3 + MailBody2),
        BodyFormat: 'HTML',
        GenerateBy: 0,
        GenerateAt: '',
        IsSend: 0
    }
    $.ajax({
        url: "../../Services/Shipment/AWBTrackingService.svc/SaveEmailId",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            ShowMessage('success', 'Success!', "AWB Tracking Sent Successfully!");
        }
    });
}
