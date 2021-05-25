/*
*****************************************************************************
Javascript Name:	ShortAcceptanceJS     
Purpose:		    This JS used for Short Acceptance.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    04 July 2017
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/


function CallDirect() {

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));


    }
    var AWBSNo = getParameterByName("AWBSNo", "");
    if (AWBSNo != null && AWBSNo != '')
        SearchResultByAWBSNo(AWBSNo);
}

$(function () {
    ShortAcceptance();
});

function SearchResultByAWBSNo(AWBSNo) {

    $.ajax({
        url: "Services/Shipment/ShortAcceptanceService.svc/GetSearchResultData",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AcceptanceType: 0,
            AWBSNo: AWBSNo,
            FlightNo: 0,
            FlightOrigin: 0,
            FlightDestination: 0,
            FlightDate: "",
            AirlineSno: 0,
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                var thedivSearchResult = document.getElementById("divSearchResult");
                thedivSearchResult.innerHTML = "";
                var table = "";
                if (myData.Table0.length > 0) {
                    $("input[type=radio]").attr('disabled', true);


                    table = "</br><table class='appendGrid ui-widget' id='tblSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'><input name='chkAll' id='chkAll' tabindex='10' type='checkbox' value='0'></td><td class='ui-widget-header'>AWB No</td><td class='ui-widget-header'>Agent Name</td><td class='ui-widget-header'>Booking Type</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pcs</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Volume (CBM)</td><td class='ui-widget-header'>Type</td><td class='ui-widget-header'>Booking Date</td><td class='ui-widget-header'>Flight No</td><td id='Status' class='ui-widget-header'>Flight Date</td><td class='ui-widget-header'>Split Plan</td><td class='ui-widget-header'>Shipment Status</td></tr></thead><tbody class='ui-widget-content'>";
                    for (var i = 0; i < myData.Table0.length; i++) {
                        //var isdisable1 = myData.Table0[i].SplitLoaded == "Yes" ? " disabled" : " "
                        var isdisable1 = "";
                        table += "<tr><td class='ui-widget-content first'><input class='checkBox' tabindex='" + parseInt(i + 1) + "1' name='Chk_" + myData.Table0[i].AWBSNo + "' id='Chk_" + myData.Table0[i].AWBSNo + "'  value='" + myData.Table0[i].AWBSNo + "' type='checkbox'" + isdisable1 + "></td><td class='ui-widget-content first'>" + myData.Table0[i].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AgentName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].BookingType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'><input type='text' class='' name='AWBPieces_" + myData.Table0[i].AWBSNo + "' id='AWBPieces_" + myData.Table0[i].AWBSNo + "' style='width: 60px;' placeholder='' controltype='number' data-valid='min[1],required' data-valid-msg='Enter Pieces' tabindex='" + parseInt(i + 1) + "2' maxlength='7' value='" + myData.Table0[i].AWBPieces + "' placeholder='' data-role='numerictextbox'></td><td class='ui-widget-content first'><input type='text' class='' name='AWBGrossWeight_" + myData.Table0[i].AWBSNo + "' id='AWBGrossWeight_" + myData.Table0[i].AWBSNo + "' style='width: 60px;' placeholder='' controltype='decimal2' data-valid='min[1.00],required' data-valid-msg='Enter Gross Weight' tabindex='" + parseInt(i + 1) + "3' maxlength='6' value='" + myData.Table0[i].GrossWeight + "' placeholder='' data-role='numerictextbox'></td><td class='ui-widget-content first'><input type='text' class='' name='AWBCBM_" + myData.Table0[i].AWBSNo + "' id='AWBCBM_" + myData.Table0[i].AWBSNo + "' style='width: 60px;' placeholder='' controltype='decimal3' data-valid='min[0.001],required' data-valid-msg='Enter CBM' tabindex='" + parseInt(i + 1) + "4' maxlength='8' value='" + myData.Table0[i].Volume + "' placeholder='' data-role='numerictextbox'></td><td class='ui-widget-content first'>" + myData.Table0[i].InternationalORDomestic + "</td><td class='ui-widget-content first'>" + myData.Table0[i].BookingDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].SplitLoaded + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ShipmentStatus + "</td></tr>";
                    }
                    //table += "</tbody></table></br><table class='appendGrid ui-widget' id='tblButton'><tbody><tr><td class='formSection'><button class='btn btn-success' style='width:50px;' onclick='SaveResult();' id='btnSave'>Save</button></td></tr></tbody></table>";
                    table += "</tbody></table></br><table class='appendGrid ui-widget' id='tblButton'><tbody><tr><td class='formSection'><button class='btn btn-success' tabindex='101' style='width:50px;' onclick='SaveAcceptanceData();' id='btnSave'>Save</button></td></tr></tbody></table>";
                    thedivSearchResult.innerHTML += table;
                    $('#chkAll').click(function () {
                        if ($(this).prop("checked")) {
                            $(".checkBox").prop("checked", true);
                        } else {
                            $(".checkBox").prop("checked", false);
                        }
                        $('input[type=checkbox]:disabled').attr('checked', false)

                    });
                    $('.checkBox').click(function () {
                        if ($(".checkBox").length == $(".checkBox:checked").length) {
                            $("#chkAll").prop("checked", true);
                        } else {
                            $("#chkAll").prop("checked", false);
                        }
                    });
                }
                else {
                    table = "</br><table class='appendGrid ui-widget' id='tblSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found.</td></tr></thead></table>"
                    thedivSearchResult.innerHTML += table;
                }
            }
            PagerightsCheckShortAcceptance()
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}





function ShortAcceptance() {
    $.ajax({
        url: 'HtmlFiles/Shipment/ShortAcceptance.html',
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            //$("#divContent1").remove();
            // alert(1);
            InstantiateControl("htmldivdetails");
            PageLoaded();
            $('input[name=ShortAcceptanceType]').click(function () {
                if ($(this).val() === '0') {
                    $("#Text_AWBNo").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_AWBNo").data("kendoAutoComplete").enable(true);
                    $("#Text_FlightNo").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_FlightNo").data("kendoAutoComplete").enable(false);
                    $("#Text_FlightOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_FlightOrigin").data("kendoAutoComplete").enable(false);
                    $("#Text_FlightDestination").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_FlightDestination").data("kendoAutoComplete").enable(false);
                    $('#FlightDate').attr('disabled', true);
                    $('#FlightDate').data("kendoDatePicker").value(null);
                    $("#tblAWB").show();
                    $("#tblFlight").hide();
                    $("#trSearch").show();
                    var thedivSearchResult = document.getElementById("divSearchResult");
                    thedivSearchResult.innerHTML = "";
                } else if ($(this).val() === '1') {
                    $("#Text_AWBNo").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_AWBNo").data("kendoAutoComplete").enable(false);
                    $("#Text_FlightNo").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_FlightNo").data("kendoAutoComplete").enable(true);
                  //  $("#Text_FlightOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_FlightOrigin").data("kendoAutoComplete").enable(true);
                    $("#Text_FlightDestination").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_FlightDestination").data("kendoAutoComplete").enable(true);
                    $('#FlightDate').attr('disabled', false);
                    $("#tblAWB").hide();
                    $("#tblFlight").show();
                    $("#trSearch").show();
                    if (userContext.GroupName.toUpperCase() == 'GSA') {
                        if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
                            $("#FlightOrigin").val(userContext.CityCode);
                            $("#Text_FlightOrigin").val(userContext.CityCode);
                            $('#Text_FlightOrigin').data("kendoAutoComplete").enable(false);
                        }
                        
                    }
                    var thedivSearchResult = document.getElementById("divSearchResult");
                    thedivSearchResult.innerHTML = "";
                }
                 
            });
            $("#btnSearch").unbind("click").bind("click", function () {
                SearchResult();
                InstantiateControl("divSearchResult");
            });
            $("#btnCancel").unbind("click").bind("click", function () {

            });
            CallDirect();
        }
    });
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

function PageLoaded() {
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "ShortAcceptence_AWBNo", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "ShortAcceptence_FlightNo", onSelectFlightNo, "contains");
    cfi.AutoCompleteV2("FlightOrigin", "AirportCode,AirportName", "ShortAcceptence_Airport", null, "contains");
    cfi.AutoCompleteV2("FlightDestination", "AirportCode,AirportName", "ShortAcceptence_Airport", null, "contains");
    var todaydate = new Date();
    var ItineraryDate = $("#FlightDate").data("kendoDatePicker");
    ItineraryDate.min(todaydate);
}

function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AWBNo") {
        var UserSNo = userContext.UserSNo;
        var AirlineSNo = userContext.AirlineSNo;
        param.push({ ParameterName: "AirlineSNo", ParameterValue: AirlineSNo }),
            param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });

        return param;
    }
}


function onSelectFlightNo() {
    try {
        if (userContext.GroupName.toUpperCase() != 'GSA') {
            if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {

                $("#Text_FlightOrigin").data("kendoAutoComplete").setDefaultValue('', '');
            }
        }
    }
    catch (exp) { }
}

function ExtraCondition(textId) {
    var FlightOriginFilter = cfi.getFilter("AND");
    var FlightDestinationFilter = cfi.getFilter("AND");

    var filterAWB = cfi.getFilter("AND");
    if (textId == "Text_AWBNo") {
        try {

            cfi.setFilter(filterAWB, "OriginAirportSNo", "eq", userContext.AirportSNo)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAWB]);
            return OriginCityAutoCompleteFilter2;
        }

        catch (exp) { }
    }
    var filterFlight = cfi.getFilter("AND");
    if (textId == "Text_FlightNo") {
        try {

            cfi.setFilter(filterFlight, "OriginAirportSNo", "eq", userContext.AirportSNo)
            var FlightNoAutoCompleteFilter2 = cfi.autoCompleteFilter([filterFlight]);
            return FlightNoAutoCompleteFilter2;
        }

        catch (exp) { }
    }

    if (textId.indexOf("Text_FlightOrigin") >= 0) {
        var filterFlightOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterFlightOrigin, "SNo", "eq", $("#Text_FlightNo").data("kendoAutoComplete").key());
        cfi.setFilter(filterFlightOrigin, "SNo", "notin", $("#Text_FlightDestination").data("kendoAutoComplete").key());
        cfi.setFilter(filterFlightOrigin, "IsActive", "eq", "1");
        FlightOriginFilter = cfi.autoCompleteFilter(filterFlightOrigin);
        return FlightOriginFilter;
    }
    else if (textId.indexOf("Text_FlightDestination") >= 0) {
        var filterFlightDestination = cfi.getFilter("AND");
        cfi.setFilter(filterFlightDestination, "SNo", "notin", $("#Text_FlightOrigin").data("kendoAutoComplete").key());
        cfi.setFilter(filterFlightDestination, "IsActive", "eq", "1");
        FlightDestinationFilter = cfi.autoCompleteFilter(filterFlightDestination);
        return FlightDestinationFilter;
    }

}

function SearchResult() {
    if (cfi.IsValidSection("htmldivdetails")) {
        if (true) {
            $.ajax({
                url: "Services/Shipment/ShortAcceptanceService.svc/GetSearchResultData",
                async: true,
                type: "GET",
                dataType: "json",
                data: {
                    AcceptanceType: $('input:radio[name=ShortAcceptanceType]:checked').val(),
                    AWBSNo: $("#Text_AWBNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AWBNo").data("kendoAutoComplete").key(),
                    FlightNo: $("#Text_FlightNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FlightNo").data("kendoAutoComplete").value(),
                    FlightOrigin: $("#Text_FlightOrigin").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FlightOrigin").data("kendoAutoComplete").key(),
                    FlightDestination: $("#Text_FlightDestination").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FlightDestination").data("kendoAutoComplete").key(),
                    FlightDate: $("#FlightDate").val(),
                    AirlineSno: userContext.AirlineSNo
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        var thedivSearchResult = document.getElementById("divSearchResult");
                        thedivSearchResult.innerHTML = "";
                        var table = "";
                        if (myData.Table0.length > 0) {
                            table = "</br><table class='appendGrid ui-widget' id='tblSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'><input name='chkAll' id='chkAll' type='checkbox' tabindex='10' value='0'></td><td class='ui-widget-header'>AWB No</td><td class='ui-widget-header'>Agent Name</td><td class='ui-widget-header'>Booking Type</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pcs</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Volume (CBM)</td><td class='ui-widget-header'>Type</td><td class='ui-widget-header'>Booking Date</td><td class='ui-widget-header'>Flight No</td><td id='Status' class='ui-widget-header'>Flight Date</td><td class='ui-widget-header'>Split Plan</td><td class='ui-widget-header'>Shipment Status</td></tr></thead><tbody class='ui-widget-content'>";
                            for (var i = 0; i < myData.Table0.length; i++) {
                               // var isdisable = myData.Table0[i].SplitLoaded == "Yes" ? " disabled" : " ";
                                var isdisable = "";
                                //table += "<tr><td class='ui-widget-content first'><input class='checkBox' name='Chk_" + myData.Table0[i].AWBSNo + "' id='Chk_" + myData.Table0[i].AWBSNo + "'  value='" + myData.Table0[i].AWBSNo + "' type='checkbox'></td><td class='ui-widget-content first'>" + myData.Table0[i].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AgentName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].BookingType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AWBPieces + "</td><td class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'>" + myData.Table0[i].InternationalORDomestic + "</td><td class='ui-widget-content first'>" + myData.Table0[i].BookingDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].SplitLoaded + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ShipmentStatus + "</td></tr>";
                                table += "<tr><td class='ui-widget-content first'><input class='checkBox' tabindex='" + parseInt(i + 1) + "1' name='Chk_" + myData.Table0[i].AWBSNo + "' id='Chk_" + myData.Table0[i].AWBSNo + "'  value='" + myData.Table0[i].AWBSNo + "' type='checkbox' " + isdisable + "></td><td class='ui-widget-content first'>" + myData.Table0[i].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AgentName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].BookingType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'><input type='text' class='' name='AWBPieces_" + myData.Table0[i].AWBSNo + "' id='AWBPieces_" + myData.Table0[i].AWBSNo + "' style='width: 60px;' placeholder='' controltype='number' data-valid='min[1],required' data-valid-msg='Enter Pieces' tabindex='" + parseInt(i + 1) + "2' maxlength='7' value='" + myData.Table0[i].AWBPieces + "' placeholder='' data-role='numerictextbox'></td><td class='ui-widget-content first'><input type='text' class='' name='AWBGrossWeight_" + myData.Table0[i].AWBSNo + "' id='AWBGrossWeight_" + myData.Table0[i].AWBSNo + "' style='width: 60px;' placeholder='' controltype='decimal2' data-valid='min[1.00],required' data-valid-msg='Enter Gross Weight' tabindex='" + parseInt(i + 1) + "3' maxlength='6' value='" + myData.Table0[i].GrossWeight + "' placeholder='' data-role='numerictextbox'></td><td class='ui-widget-content first'><input type='text' class='' name='AWBCBM_" + myData.Table0[i].AWBSNo + "' id='AWBCBM_" + myData.Table0[i].AWBSNo + "' style='width: 60px;' placeholder='' controltype='decimal3' data-valid='min[0.001],required' data-valid-msg='Enter CBM' tabindex='" + parseInt(i + 1) + "4' maxlength='8' value='" + myData.Table0[i].Volume + "' placeholder='' data-role='numerictextbox'></td><td class='ui-widget-content first'>" + myData.Table0[i].InternationalORDomestic + "</td><td class='ui-widget-content first'>" + myData.Table0[i].BookingDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].SplitLoaded + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ShipmentStatus + "</td></tr>";
                            }
                            //table += "</tbody></table></br><table class='appendGrid ui-widget' id='tblButton'><tbody><tr><td class='formSection'><button class='btn btn-success' style='width:50px;' onclick='SaveResult();' id='btnSave'>Save</button></td></tr></tbody></table>";
                            table += "</tbody></table></br><table class='appendGrid ui-widget' id='tblButton'><tbody><tr><td class='formSection'><button class='btn btn-success' tabindex='100' style='width:50px;' onclick='SaveAcceptanceData();' id='btnSave'>Save</button></td></tr></tbody></table>";
                            thedivSearchResult.innerHTML += table;
                            $('#chkAll').click(function () {
                                if ($(this).prop("checked")) {
                                    $(".checkBox").prop("checked", true);
                                } else {
                                    $(".checkBox").prop("checked", false);
                                }
                                $('input[type=checkbox]:disabled').attr('checked', false)
                            });
                            $('.checkBox').click(function () {
                                if ($(".checkBox").length == $(".checkBox:checked").length) {
                                    $("#chkAll").prop("checked", true);
                                } else {
                                    $("#chkAll").prop("checked", false);
                                }
                            });
                        }
                        else {
                            table = "</br><table class='appendGrid ui-widget' id='tblSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found.</td></tr></thead></table>"
                            thedivSearchResult.innerHTML += table;
                        }
                    }
                    PagerightsCheckShortAcceptance()
                    return false
                },
                error: function (xhr) {
                    var a = "";
                }
            });
        }
    }
}

function SaveResult() {
    var checkboxSelectorNot = 0;
    var AWBSNo = "";
    $('#tblSearchResult  tbody  tr').each(function (row, tr) {
        if ($(tr).find("input[id^='Chk_']").prop('checked') == true) {
            checkboxSelectorNot = 1;
            AWBSNo += $(tr).find("input[id^='Chk_']").val() + ',';
        }
    });
    if (checkboxSelectorNot == 1) {
        if (AWBSNo != "")
            AWBSNo = AWBSNo.substring(0, AWBSNo.length - 1);
        $.ajax({
            url: "Services/Shipment/ShortAcceptanceService.svc/SaveResult", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: AWBSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    ShowMessage('success', 'Success - Short Acceptance', "Processed Successfully", "bottom-right");
                    ShortAcceptance();
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Short Acceptance', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Short Acceptance', "unable to process.", "bottom-right");
                flag = false;
            }
        });
    }
    else
        ShowMessage('warning', 'Information!', "Please select atleast one Shipment.");
}

function SaveAcceptanceData() {
    var CheckedShortAcceptanceDataArray = [];
    $('#tblSearchResult  tbody  tr').each(function (row, tr) {
        if ($(tr).find("input[id^='Chk_']").prop('checked') == true) {
            if ($(tr).find("input[id^='AWBPieces_']").val() > 0 && $(tr).find("input[id^='AWBGrossWeight_']").val() > 0 && $(tr).find("input[id^='AWBCBM_']").val() > 0) {
                var CheckedShortAcceptanceDataArrayItems = {
                    AWBSNo: $(tr).find("input[id^='Chk_']").val(),
                    AWBPieces: $(tr).find("input[id^='AWBPieces_']").val(),
                    GrossWeight: $(tr).find("input[id^='AWBGrossWeight_']").val(),
                    Volume: $(tr).find("input[id^='AWBCBM_']").val()
                };
                CheckedShortAcceptanceDataArray.push(CheckedShortAcceptanceDataArrayItems);
            }
        }
    });

    if (CheckedShortAcceptanceDataArray.length > 0) {
        $.ajax({
            url: "Services/Shipment/ShortAcceptanceService.svc/SaveShortAcceptance", async: true, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ShortAcceptanceDataArray: CheckedShortAcceptanceDataArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    ShowMessage('success', 'Success - Short Acceptance', "Processed Successfully", "bottom-right");
                    ShortAcceptance();
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Short Acceptance', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Short Acceptance', "unable to process.", "bottom-right");
                flag = false;
            }
        });
    }
    else
        ShowMessage('warning', 'Information!', "Please select atleast one Shipment, OR Shipment Pieces or Gross Weight or Volume should be greater than 0.");
}


var RightsCheck = false;
function PagerightsCheckShortAcceptance() {

    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {

        if (i.Apps.toString().toUpperCase() == "SHORTACCEPTANCE") {
            if (i.Apps.toString().toUpperCase() == "SHORTACCEPTANCE" && i.PageRight != "Delete") {
                if (i.Apps.toString().toUpperCase() == "SHORTACCEPTANCE" && i.PageRight == "New") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "SHORTACCEPTANCE" && i.PageRight == "Edit") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "SHORTACCEPTANCE" && i.PageRight == "Delete") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } else if (CheckIsFalse == 0 && i.PageRight == "Read"){
                    RightsCheck = true;
                    return
                }
            }
        }
    });
    if (RightsCheck) {


        $("#btnSave").hide()


    }

}