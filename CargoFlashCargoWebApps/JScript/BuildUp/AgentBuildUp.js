/// <reference path="../../Scripts/references.js" />
$(document).ready(function () {

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        $('#MasterSaveAndNew').after('<input type="button" id="btnSaveAgentBuildUp" name="btnSaveAgentBuildUp" value="Save" class="btn btn-success">');
        $("input[type='submit'][name='operation']").hide();

        cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetSearch, "contains");
        cfi.AutoComplete("FlightNo", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");
        cfi.AutoComplete("AgentSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
        cfi.AutoComplete("OriginCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode"], null, "contains");

        $('#Text_OriginCode').data("kendoAutoComplete").key(userContext.CityCode);
        $('#Text_OriginCode').data("kendoAutoComplete").value(userContext.CityCode);
        $('#Text_OriginCode').data("kendoAutoComplete").enable(false);

        $("#btnSaveAgentBuildUp").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection()) {
                SaveAgentBuildUp();
            }
        });

        //Parameter: processName, moduleName, appName, formAction
        $('#dvAgentBuildupTrans').html('');
        $.ajax({
            url: "Services/BuildUp/BuildUpService.svc/GetWebForm/AgentBuildUp/BuildUp/AgentBuildup/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#dvAgentBuildupTrans').html(result);

                InstantiateControl("divareaTrans_buildup_agentbuilduptrans");

                cfi.AutoComplete("Origin", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
                cfi.AutoComplete("Destination", "AirportCode", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
                cfi.AutoComplete("SHC", "Code", "sphc", "SNo", "Code", ["Code"], null, "contains", ",", null, null, null, CountSHCs, true);

                //Parameter: ProcessName_XML Name
                cfi.makeTrans("buildup_agentbuilduptrans", null, null, Bind_AutoComplete, Re_Bind_AutoComplete, null, null);
                $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
                    $(this).find("input[id^='AWBNo']").bind("keyup", function (event) {
                        //debugger;
                        var Length = $(this).val().length;
                        var firstchar = $(this).val().charAt(0);
                        if (firstchar != "") {
                            if (Length == 3) {
                                $(this).val($(this).val() + "-");
                            }
                        }
                    });
                });

                $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
                    $(this).find("input[id^='Text_SHC']").keydown(function (ev) {
                        //if (e.which == 9)
                        // AddNewRow($(this).attr("id"));
                        var key;
                        ev = ev || event;
                        key = ev.keyCode;
                        if (key == 9) {
                            AddNewRow($(this).attr("id"));
                        }
                    });
                });

                $("input[id^='AWBNo']").bind("blur", function (event) { // Call Only First Time
                    GetAWBDetails("#" + $(this).attr("id"));
                });


                $("input[id^='BuildPieces']").bind("blur", function (event) {
                    CheckPiece_Weight($(this).attr("id"), -1, -1);
                });

                $("input[id^='GrossWeight']").bind("blur", function (event) {
                    CheckPiece_Weight($(this).attr("id"), -1, -1);
                });

                DisableOrigin();
                $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
                    $(this).find("div[id^='divMultiSHC']").css("overflow", "auto");
                    $(this).find("div[id^='divMultiSHC']").css("width", "15em");
                });
                //DisableGrossWeight();
            }
        });

        $("#FlightDate").kendoDatePicker({
            change: function () {
                ResetSearch();
            }
        });
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "READ") {

        $('input[type="button"][Value="Edit"]').hide();
        $('input[type="button"][Value="Duplicate"]').hide();
        $('input[type="button"][Value="Delete"]').hide();

        if ($('#hdnAgentBuildupSNo').val() != "") {
            cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetSearch, "contains");
            cfi.AutoComplete("FlightNo", "FlightNo", "v_DailyFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("AgentSNo", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoComplete("OriginCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode"], null, "contains");

            GetShipmentDetails();

            $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
                $(this).find("div[id^='divMultiSHC']").css("overflow", "auto");
                $(this).find("div[id^='divMultiSHC']").css("width", "15em");
            });
        }
    } else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        $('input[type="button"][Value="Edit"]').hide();
        $('input[type="button"][Value="Duplicate"]').hide();
        $('input[type="button"][Value="Delete"]').hide();

        if ($('#hdnAgentBuildupSNo').val() != "") {
            cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetSearch, "contains");
            cfi.AutoComplete("FlightNo", "FlightNo", "v_DailyFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("AgentSNo", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoComplete("OriginCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode"], null, "contains");

            GetShipmentDetailsforEdit();
            $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
                $(this).find("input[id^='Text_SHC']").keydown(function (ev) {
                    //if (e.which == 9)
                    // AddNewRow($(this).attr("id"));
                    var key;
                    ev = ev || event;
                    key = ev.keyCode;
                    if (key == 9) {
                        AddNewRow($(this).attr("id"));
                    }
                });
            });
            $("input[id^='AWBNo']").bind("blur", function (event) { // Call Only First Time
                GetAWBDetails("#" + $(this).attr("id"));
            });


            $("input[id^='BuildPieces']").bind("blur", function (event) {
                CheckPiece_Weight($(this).attr("id"), -1, -1);
            });

            $("input[id^='GrossWeight']").bind("blur", function (event) {
                CheckPiece_Weight($(this).attr("id"), -1, -1);
            });

            //$("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
            //    $(this).find("div[id^='divMultiSHC']").css("overflow", "auto");
            //    $(this).find("div[id^='divMultiSHC']").css("width", "15em");
            //});

        }
    }

    $("#FlightDate").closest("span.k-datepicker").width(100);
});

function AddNewRow(a) {
    //debugger;
    var TrCount = parseInt($("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").length);
    var CurrentTr = $("#" + a).closest("tr");
    if (parseInt(CurrentTr.find("td[id^='tdSNoCol']").text()) == TrCount) {
        $(".icon-trans-plus-sign").click();
    }
}

function ResetSearch() {
    $("#Text_FlightNo").data("kendoAutoComplete").value("");
    $("#Text_FlightNo").data("kendoAutoComplete").key("");
}

function ExtraCondition(textId) {

    var filterFlight = cfi.getFilter("AND");

    if (textId.indexOf("Text_FlightNo") >= 0) {
        var filterFlt = cfi.getFilter("AND");

        cfi.setFilter(filterFlt, "FlightDate", "eq", cfi.CfiDate("FlightDate"));
        cfi.setFilter(filterFlt, "OriginCity", "eq", $("#Text_OriginCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterFlt, "CarrierCode", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").value().split('-')[0]);
        cfi.setFilter(filterFlt, "IsDirectFlight", "eq", "1");
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
        //else if (textId.indexOf("Text_UldType") >= 0) {
        //    var filter = cfi.getFilter("AND");
        //    var filterUld = cfi.getFilter("AND");
        //    cfi.setFilter(filterFlt, "AirlineSno", "eq", $("#AirlineSNo").val());
        //    filter = cfi.autoCompleteFilter(filterFlt);
        //    return filter;
        //}
    else if (textId.indexOf("Text_SHC") >= 0) {
        var addedValue = "";
        if (textId == "Text_SHC") {
            addedValue = $('input[type="hidden"][id="SHC"]').val();
        }
        else {
            addedValue = $('input[type="hidden"][id="' + textId.replace('Text_', '') + '"]').val();
        }
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", addedValue), cfi.autoCompleteFilter(textId);
    }
}
function InstantiateControl(containerId) {

    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
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
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("#" + containerId).find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {

                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }

                }
            }
        }
    });
    SetDateRangeValue();

    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        if ($(this).attr("recname") == undefined) {
            var controlId = $(this).attr("id");
            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
        }
    });
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
            //StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            //StopProgress();
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

/*****Call: When Click on ADD************************/
function Bind_AutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Origin']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    });
    $(elem).find("input[id^='Destination']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    });
    $(elem).find("input[id^='SHC']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Code", "sphc", "SNo", "Code", ["Code"], null, "contains", ",", null, null, null, CountSHCs, true);
        $("div[id='divMulti" + this.id + "']").not(':last').remove(); // Remove Duplicate Multi DIvs from MakeTrans


    });

    $(elem).find("input[id^='AWBNo']").bind("keyup", function (event) {
        //debugger;
        var Length = $(this).val().length;
        var firstchar = $(this).val().charAt(0);
        if (firstchar != "") {
            if (Length == 3) {
                $(this).find("input[id^='AWBNo']").val($(this).find("input[id^='AWBNo']").val() + "-");
            }
        }
    });

    $(elem).find("input[id^='Text_SHC']").keydown(function (ev) {
        var key;
        ev = ev || event;
        key = ev.keyCode;
        if (key == 9) {
            AddNewRow($(this).attr("id"));
        }
    });

    $(elem).find("input[id^='AWBNo']").bind("blur", function (event) {
        GetAWBDetails("#" + $(this).attr("id"));
    });

    $("input[id^='BuildPieces']").bind("blur", function (event) {
        CheckPiece_Weight($(this).attr("id"), -1, -1);
    });

    $("input[id^='GrossWeight']").bind("blur", function (event) {
        CheckPiece_Weight($(this).attr("id"), -1, -1);
    });

    $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
        $(this).find("div[id^='divMultiSHC']").css("overflow", "auto");
        $(this).find("div[id^='divMultiSHC']").css("width", "15em");
    });
    DisableOrigin();
    SetTabIndex();
    //DisableGrossWeight();
}

/*****Call: When Click on DELETE************************/
function Re_Bind_AutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Destination']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
        $(this).css("width", "150px");
    });
    $(elem).closest("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
        $(this).find("input[id^='Origin']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "City", "CityCode", "CityName", ["CityCode", "CityName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        //$(this).find("input[id^='Destination']").each(function () {
        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"]);
        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        //});
        $(this).find("input[id^='SHC']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "sphc", "SNo", "Code", ["Code"], null, "contains", ",", null, null, null, CountSHCs, true);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='AWBNo']").each(function () {
            GetAWBInfo("#" + $(this).attr("id"));
        });

        $(this).find("input[id^='AWBNo']").bind("keyup", function (event) {
            //debugger;
            var Length = $(this).val().length;
            var firstchar = $(this).val().charAt(0);
            if (firstchar != "") {
                if (Length == 3) {
                    $(this).val($(this).val() + "-");
                }
            }
        });
    });

    $(elem).find("input[id^='AWBNo']").bind("blur", function (event) {
        GetAWBDetails("#" + $(this).attr("id"));
    });

    $("input[id^='BuildPieces']").bind("blur", function (event) {
        CheckPiece_Weight($(this).attr("id"), -1, -1);
    });

    $("input[id^='GrossWeight']").bind("blur", function (event) {
        CheckPiece_Weight($(this).attr("id"), -1, -1);
    });

    $(this).find("input[id^='Text_SHC']").keydown(function (ev) {
        var key;
        ev = ev || event;
        key = ev.keyCode;
        if (key == 9) {
            AddNewRow($(this).attr("id"));
        }
    });
    $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
        $(this).find("div[id^='divMultiSHC']").css("overflow", "auto");
        $(this).find("div[id^='divMultiSHC']").css("width", "15em");
    });
    DisableOrigin();
    SetTabIndex();
    //DisableGrossWeight();
}
function CountSHCs(e) {

    var CurretTr = $("#" + e.item.context.offsetParent.id.split("-")[0]).closest("tr");
    var SHCs = parseInt(CurretTr.find("input[id^=Multi_SHC]").val().split(",").length);
    if (SHCs + 1 > 9) {
        ShowMessage('warning', 'Information', "Maximum 9 SHC can be selected");
        e.preventDefault();
    }
}


function UpdateAgentBuildUp() {
    // alert("Hello");
    if (cfi.IsValidTransSection('divareaTrans_buildup_agentbuilduptrans')) {
        $('#dvMessageTable').html('');
        var AgentBuildUpSNo = parseInt($("#hdnAgentBuildupSNo").val()) || 0;
        var TransModel = [];
        $("#divareaTrans_buildup_agentbuilduptrans table tr:gt(2)").each(function (index, item) {
            var currentIndex = "";
            if (index == 0)
                currentIndex = "";
            else {
                currentIndex = index - 1;
                currentIndex = "_" + currentIndex;
            }

            TransModel.push(
            {
                ULDNo: $(this).find('input[type="text"][id="ULDNo' + currentIndex + '"]').val(),
                AWBNo: $(this).find('input[type="text"][id="AWBNo' + currentIndex + '"]').val(),
                SLINo: $(this).find('input[type="text"][id="SLINo' + currentIndex + '"]').val(),
                BOENo: $(this).find('input[type="text"][id="BOENo' + currentIndex + '"]').val(),
                BuildPieces: $(this).find('input[type="text"][id="BuildPieces' + currentIndex + '"]').val(),
                TotalPieces: $(this).find('input[type="text"][id="TotalPieces' + currentIndex + '"]').val(),
                GrossWeight: $(this).find('input[type="text"][id="GrossWeight' + currentIndex + '"]').val(),
                NatureOfGoods: $(this).find('input[type="text"][id="NatureOfGoods' + currentIndex + '"]').val(),
                Origin: $("#Text_Origin" + currentIndex).data("kendoAutoComplete").key(),
                Destination: $("#Text_Destination" + currentIndex).data("kendoAutoComplete").key(),
                SHC: $(this).find('input[type="hidden"][id="SHC' + currentIndex + '"]').val(),
                TotalGrossWeight: $(this).find('input[type="text"][id="TotalGrossWeight' + currentIndex + '"]').val(),
            }
            );

        });
        $.ajax({
            url: "Services/BuildUp/AgentBuildUpService.svc/UpdateAgentBuildup", async: true, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AgentBuildUpSNo: AgentBuildUpSNo, LstAgentBuildUpTrans: TransModel }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].Result == "Success") {
                    // ShowMessage('success', 'Information', "Agent Buid Up Updated Successfully");
                    //location.reload();
                    $("input[type='submit'][name='operation'][value='Update']").click(); // Saved message comming from Management WebUI
                }
                else if (MsgData[0].Result == "Invalid") {
                    var errorMessage = "<table id='tblErrorTable' align='left' style='padding:5px'><tr><td colspan='3' style='color:red; font-weight:bold'>Please Correct The Below Points.</td></tr><tr style='font-weight:bold'><td style='width:60px'>S.No.</td><td style='width:150px'>AWB No.</td><td style='width:100px'>ULD No.</td><td>Message</td><td id='AddUld' style='display:none'>Add ULD<div id='divUldPopup'></div></td></tr>";
                    $.each(MsgData, function (index, item) {
                        errorMessage = errorMessage + "<tr><td>" + (index + 1) + "</td><td>" + item.AWBNo + "</td><td id=tdULDNo_" + item.ULDNo + ">" + item.ULDNo + "</td><td id=tdEM_" + item.ULDNo + ">" + item.ErrorMessage.replace("Add ULD", "<a href=# id=addlink onclick=GetPopup(this)>Add ULD</a>") + "</td><td id='tdaddULD' style='display:Block'> </td></tr>";
                        //errorMessage = errorMessage + "<tr><td>" + (index + 1) + "</td><td>" + item.AWBNo + "</td><td id='tdULDNo'>" + item.ULDNo + "</td><td id='tdEM'>" + item.ErrorMessage.replace("Add ULD", "<a href=# id=addlink onclick=GetPopup(this)>Add ULD</a>") + "</td><td id='tdaddULD' style='display:Block'> </td></tr>";
                    });
                    errorMessage = errorMessage + "</table>";
                    $('#dvMessageTable').html(errorMessage);
                }
                else {
                    ShowMessage('warning', 'Information', MsgData[0].Result);
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Information', result);

            }
        });
    }
}


function SaveAgentBuildUp() {

    if (cfi.IsValidTransSection('divareaTrans_buildup_agentbuilduptrans')) {

        $('#dvMessageTable').html('');

        var Model = [];
        var TransModel = [];

        Model.push(
            {
                AirlineSNo: $("#Text_AirlineSNo").data("kendoAutoComplete").key(),
                DailyFlightSNo: $("#Text_FlightNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FlightNo").data("kendoAutoComplete").key().split('-')[0],
                AgentSNo: $("#Text_AgentSNo").data("kendoAutoComplete").key(),
                OriginCity: $("#Text_OriginCode").data("kendoAutoComplete").key(),
                CreatedBy: userContext.UserSNo,
            }
            );

        $("#divareaTrans_buildup_agentbuilduptrans table tr:gt(2)").each(function (index, item) {
            var currentIndex = "";
            if (index == 0)
                currentIndex = "";
            else {
                currentIndex = index - 1;
                currentIndex = "_" + currentIndex;
            }

            TransModel.push(
            {
                ULDNo: $(this).find('input[type="text"][id="ULDNo' + currentIndex + '"]').val(),
                AWBNo: $(this).find('input[type="text"][id="AWBNo' + currentIndex + '"]').val(),
                SLINo: $(this).find('input[type="text"][id="SLINo' + currentIndex + '"]').val(),
                BOENo: $(this).find('input[type="text"][id="BOENo' + currentIndex + '"]').val(),
                BuildPieces: $(this).find('input[type="text"][id="BuildPieces' + currentIndex + '"]').val(),
                TotalPieces: $(this).find('input[type="text"][id="TotalPieces' + currentIndex + '"]').val(),
                GrossWeight: $(this).find('input[type="text"][id="GrossWeight' + currentIndex + '"]').val(),
                NatureOfGoods: $(this).find('input[type="text"][id="NatureOfGoods' + currentIndex + '"]').val(),
                Origin: $("#Text_Origin" + currentIndex).data("kendoAutoComplete").key(),
                Destination: $("#Text_Destination" + currentIndex).data("kendoAutoComplete").key(),
                SHC: $(this).find('input[type="hidden"][id="SHC' + currentIndex + '"]').val(),
                TotalGrossWeight: $(this).find('input[type="text"][id="TotalGrossWeight' + currentIndex + '"]').val(),
            }
            );

        });


        $.ajax({
            url: "Services/BuildUp/AgentBuildUpService.svc/SaveAgentBuildup", async: true, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AgentBuildUpModel: Model, LstAgentBuildUpTrans: TransModel }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].Result == "Success") {
                    //ShowMessage('success', 'Information', "Agent Buid Up Saved Successfully");
                    $("input[type='submit'][name='operation'][value='Save']").click(); // Saved message comming from Management WebUI
                }
                else if (MsgData[0].Result == "Invalid") {
                    var errorMessage = "<table id='tblErrorTable' align='left' style='padding:5px'><tr><td colspan='3' style='color:red; font-weight:bold'>Please Correct The Below Points.</td></tr><tr style='font-weight:bold'><td style='width:60px'>S.No.</td><td style='width:150px'>AWB No.</td><td style='width:100px'>ULD No.</td><td>Message</td><td id='AddUld' style='display:none'>Add ULD<div id='divUldPopup'></div></td></tr>";
                    $.each(MsgData, function (index, item) {
                        errorMessage = errorMessage + "<tr><td>" + (index + 1) + "</td><td>" + item.AWBNo + "</td><td id=tdULDNo_" + item.ULDNo + ">" + item.ULDNo + "</td><td id=tdEM_" + item.ULDNo + ">" + item.ErrorMessage.replace("Add ULD", "<a href=# id=addlink onclick=GetPopup(this)>Add ULD</a>") + "</td><td id='tdaddULD' style='display:Block'> </td></tr>";
                        //var EM = errorMessage.Find("td[id=tdEM]").text();
                        //if(EM=="ULD No. does not exist")


                    });
                    errorMessage = errorMessage + "</table>";
                    $('#dvMessageTable').html(errorMessage);
                    //$('#dvMessageTable').find("table[id='tblErrorTable']").each(function (row, tr) {
                    //    var Message = $(tr).find("td[id='tdEM']").text();
                    //    var search = Message.indexOf("ULD No. does not exist");
                    //    if (search != -1) {
                    //        $(tr).find("td[id='tdaddULD']").css("display", "Block");
                    //    }
                    //});
                }
                else {
                    ShowMessage('warning', 'Information', MsgData[0].Result);
                }
                //<a href'#'><div id='divUldPopup'><strong>Add Uld</strong></div></a>
                //

            },
            error: function (xhr) {
                ShowMessage('warning', 'Information', result);

            }
        });
    }
}
var UldValidateHtml = "<div id='ULDpopup' width=200px><table id='tblPopUp' width='100%'><tr><td width='40%'><strong>ULD Code</strong></td><td width='30%'><strong>Serial Nbr</strong></td><td width='30%'> <strong>Owner Code</strong></td></tr><tr><td><input type='hidden' id='UldType' name='UldType' tabindex='0'  /> <input type=text id='Text_UldType' tabindex='0'   name='Text_UldType' controltype='autocomplete'/></td><td><input type='text' class='transSection k-input' name='TDULDNo' id='TDULDNo' recname='TDULDNo' style='width: 80px; text-transform: uppercase;' controltype='alphanumericupper' tabindex='0' maxlength='5' data-valid='required,maxlength[5],minlength[4]' value='' placeholder='' data-role='alphabettextbox' autocomplete='off'></td><td><input type='text' class='k-input transSection' name='OwnerCode' id='OwnerCode' recname='OwnerCode' style='width: 30px; text-transform: uppercase;' controltype='alphanumericupper'  data-valid='required,maxlength[3],minlength[2]' data-valid-msg='Enter valid Owner Code.Minimum 2 Characters required' tabindex='0' maxlength='3' value='' placeholder='' data-role='alphabettextbox' autocomplete='off'></td></tr></table></div>";
var PopupFooter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><input type=button  id='btnAdd' name='Add' value='ADD' / ></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><input type=button   id='btnCLose' name='Cancel' value='Cancel' / ></td>" +
                        "</tr></tbody></table> </div>";

function CheckULDType(ULDName, AirlineSno) {

    $.ajax({
        url: "Services/BuildUp/AgentBuildUpService.svc/ValidUldName", async: false, type: "get", cache: false,
        data: { UldName: ULDName, AirlineSNo: AirlineSno },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            if (Data.Table0[0].SNo > 0) {
                $("#UldType").val(Data.Table0[0].SNo);
                $("#Text_UldType").val(Data.Table0[0].ULDName);
            }
            else {
                //ShowMessage('warning', 'Information', "Uld Type is not valid");
                $("#UldType").val("");
                $("#Text_UldType").val("");
            }

        }
    });
}

function GetPopup(input) {
    var regexp = /^[0-9]*$/;
    var AirlineSno = $("#AirlineSNo").val();
    var CurrentTr = $(input).closest("tr");
    var ULDNo = CurrentTr.find("td[id^='tdULDNo_']").text();
    var UldName = ULDNo.substring(0, 3);
    $("div[id=divUldPopup]").not(':first').remove();
    $("#divUldPopup").html('').html(UldValidateHtml);
    $("#divUldPopup").append(PopupFooter);
    cfi.AutoComplete("UldType", "ULDName", "vwAgentBuildupUldName", "SNo", "ULDName", ["ULDName"], null, "contains");

    cfi.PopUp("divUldPopup", "Add ULD Stock", 300, PopUpOnOpen, null, 60);
    CheckULDType(UldName, AirlineSno);
    if (ULDNo.length == 9) {
        $("#TDULDNo").val(ULDNo.substring(3, 7).toUpperCase());
        $("#OwnerCode").val(ULDNo.substring(7, 10).toUpperCase());
    }
    if (ULDNo.length == 10) {
        var OWCode = ULDNo.substring(7, 10).toUpperCase();
        var FirstDigit = OWCode.substring(0, 1);
        var numberCheck = regexp.exec(FirstDigit);
        if (numberCheck == null) {
            $("#TDULDNo").val(ULDNo.substring(3, 7).toUpperCase());
            $("#OwnerCode").val(ULDNo.substring(7, 10).toUpperCase());
        }
        else {
            $("#TDULDNo").val(ULDNo.substring(3, 8).toUpperCase());
            $("#OwnerCode").val(ULDNo.substring(8, 10).toUpperCase());
        }
    }
    if (ULDNo.length == 11) {
        $("#TDULDNo").val(ULDNo.substring(3, 8).toUpperCase());
        $("#OwnerCode").val(ULDNo.substring(8, 11).toUpperCase());
    }

    $("input[id^='TDULDNo']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    //$("input[id^='OwnerCode']").keydown(function (e) {
    //    alphanumeric(e);
    //});

    $("#btnCLose").unbind("click").bind("click", function () {
        ResetforPOPUp();
    });

    $("#btnAdd").unbind("click").bind("click", function () {
        if (cfi.IsValidSubmitSection()) {
            SaveUldStock(AirlineSno, ULDNo, CurrentTr);
        }
    });

}
function ResetforPOPUp() {
    $("#divUldPopup").data("kendoWindow").close();
}
function SaveUldStock(AirlineSno, ULDNo, CurrentTr) {
    var regexp = /^[0-9]*$/;
    var Flag = 0;
    var ULDType = $("#Text_UldType").val();
    var ULD = $("#TDULDNo").val();
    var OW = $("#OwnerCode").val();
    var numberCheck = regexp.exec(OW);
    var UldNumberCheck = regexp.exec(ULD);

    if (ULDType == "") {
        ShowMessage('warning', 'Information', "Please select ULD Code");
        Flag = 1;
    }
    if (ULD == "") {
        ShowMessage('warning', 'Information', "Please enter Serial Nbr");
        Flag = 1;
    }
    if (OW == "") {
        ShowMessage('warning', 'Information', "Please enter Owner Code");
        Flag = 1;
    }

    if (Flag == 0) {
        if (UldNumberCheck != null) {
            if (ULD.length >= 4 && ULD.length <= 5) {
                $.ajax({
                    url: "Services/BuildUp/AgentBuildUpService.svc/AddUldStock", async: true, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ ULDType: ULDType, ULD: ULD, OW: OW, AirlineSno: AirlineSno }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var MsgTable = jQuery.parseJSON(result);
                        var MsgData = MsgTable.Table0;
                        var NEWULD;
                        if (MsgData[0].Msg == "Success") {
                            $("#divUldPopup").data("kendoWindow").close();
                            $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function (row, tr) {
                                if ($(tr).find("input[id^=ULDNo]").val().toUpperCase() == ULDNo.toUpperCase()) {
                                    $(tr).find("input[id^=ULDNo]").val($("#Text_UldType").val() + $("#TDULDNo").val() + $("#OwnerCode").val());
                                    NEWULD = $("#Text_UldType").val() + $("#TDULDNo").val() + $("#OwnerCode").val();
                                }
                            });
                            var i = parseInt($("div[id='dvMessageTable']").find("table[id='tblErrorTable']").find("tr").length);
                            $("div[id='dvMessageTable']").find("table[id='tblErrorTable']").each(function (row, tr) {

                                $(tr).find("td[id^=tdULDNo_" + ULDNo.toUpperCase() + "]").text("");
                                $(tr).find("td[id^=tdULDNo_" + ULDNo.toUpperCase() + "]").text(NEWULD.toUpperCase());
                                $(tr).find("td[id^=tdEM_" + ULDNo.toUpperCase() + "]").text("");
                                $(tr).find("td[id^=tdEM_" + ULDNo.toUpperCase() + "]").text("ADDED");
                                //if (row <= i) {
                                //    if ($(tr).find("td[id^=tdULDNo]").eq(row).text().toUpperCase() == ULDNo.toUpperCase()) {
                                //        $(tr).find("td[id='tdEM']").eq(row).text("");
                                //        $(tr).find("td[id='tdEM']").eq(row).text("ADDED");
                                //        $(tr).find("td[id^=tdULDNo]").eq(row).text(ULDNo.toUpperCase());
                                //    }
                                //    row = row + 1;;
                                //}
                            });
                        }
                        else {
                            if (MsgData[0].Msg == "Invalid") {
                                ShowMessage('warning', 'Information', "ULD already Utilized.");
                            }
                            if (MsgData[0].Msg == "Invalid0") {
                                ShowMessage('warning', 'Information', "ULD already exists.");
                            }
                            if (MsgData[0].Msg == "Invalid1") {
                                ShowMessage('warning', 'Information', "Please Enter Serial Nbr.");
                            }
                            if (MsgData[0].Msg == "Invalid2") {
                                ShowMessage('warning', 'Information', "ULD is not Serviceable.");
                            }
                        }
                    }
                });
            }

            else {
                ShowMessage('warning', 'Information', "Serial Nbr length should be minimum 4 or maximum 5");
            }
        }
        else {

            ShowMessage('warning', 'Information', "Serial Nbr should have all numeric values");
        }

    }
    //else {
    //    ShowMessage('warning', 'Information', "Uld is not valid");
    //}
}

function PopUpOnOpen(cntrlId) {
    savetype = "ULD";
    return false;
}

function DisableOrigin() {
    $('#divareaTrans_buildup_agentbuilduptrans input[type="text"][id^="Text_Origin"]').each(function () {
        $(this).data("kendoAutoComplete").key(userContext.CityCode);
        $(this).data("kendoAutoComplete").value(userContext.CityCode);
        $(this).data("kendoAutoComplete").enable(false);
    });

    $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
        $(this).find("input[id^='AWBNo']").bind("keyup", function (event) {
            //debugger;
            var Length = $(this).val().length;
            var firstchar = $(this).val().charAt(0);
            if (firstchar != "") {
                if (Length == 3) {
                    $(this).val($(this).val() + "-");
                }
            }
        });
    });

}
function alphanumeric(alphane) {
    var numaric = alphane;
    for (var j = 0; j < numaric.length; j++) {
        var alphaa = numaric.charAt(j);

        var hh = alphaa.charCodeAt(0);

        if ((hh > 47 && hh < 58) || (hh > 64 && hh < 91) || (hh > 96 && hh < 123)) {
        }
        else {
            //ShowMessage('warning', 'Information', "Owner Code should be Alpha Numeric");
            return false;
        }
    }
    // alert("Your Alpha Numeric Test Passed");
    return true;
}
function IsNumericNewCheck(e) {

    if (e.ctrlKey || e.altKey)  // if shift, ctrl or alt keys held down
    {
        e.preventDefault();             // Prevent character input
    }
    else {
        var n = e.keyCode;
        if (!((n == 8)              // backspace
          || (n == 46)                // delete
          || (n >= 35 && n <= 40)     // arrow keys/home/end
          || (n >= 48 && n <= 57)     // numbers on keyboard
          || (n >= 96 && n <= 105)    // number on keypad
          || (n == 9)
          || (n !== undefined) || (n == 16)
            )              // Tab on keypad
          ) {
            e.preventDefault();          // Prevent character input
        }
    }
}
function DisableGrossWeight() {
    $('#divareaTrans_buildup_agentbuilduptrans input[type="text"][id^="GrossWeight"]').each(function () {
        $(this).attr("disabled", "disabled");
    });

}

function GetAWBInfo(input) {


    var CurrentTr = $(input).closest("tr");
    $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function (row, tr) {
        var CurrentWaybill = $(input).val();
        var InitialWaybill = $(tr).find("input[id^='AWBNo']").val();
        //if (CurrentWaybill == InitialWaybill && CurrentTr.find("input[id^='TotalPieces']").val() == "" && CurrentTr.find("input[id^='TotalGrossWeight']").val() == "") {
        if (CurrentWaybill == InitialWaybill) {
            CurrentTr.find("input[id^='TotalPieces']").val($(tr).find("input[id^='TotalPieces']").val());
            CurrentTr.find("input[id^='_tempTotalPieces']").val($(tr).find("input[id^='TotalPieces']").val());
            CurrentTr.find("input[id^='TotalGrossWeight']").val($(tr).find("input[id^='TotalGrossWeight']").val());
            CurrentTr.find("input[id^='_tempTotalGrossWeight']").val($(tr).find("input[id^='TotalGrossWeight']").val());
            CurrentTr.find("input[id^='NatureOfGoods']").val($(tr).find("input[id^='NatureOfGoods']").val());
            CurrentTr.find("input[id^='Destination']").val($(tr).find("input[id^='Destination']").val());
            CurrentTr.find("input[id^='Text_Destination']").val($(tr).find("input[id^='Text_Destination']").val());
            CurrentTr.find("input[id^='Destination']").val($(tr).find("input[id^='Destination']").val());
            CurrentTr.find("input[id^='Text_Destination']").val($(tr).find("input[id^='Text_Destination']").val());
            CurrentTr.find("input[id^='SLINo']").val($(tr).find("input[id^='SLINo']").val());
            CurrentTr.find("input[id^='BOENo']").val($(tr).find("input[id^='BOENo']").val());

            //CurrentTr.find("input[id^='BuildPieces']").val($(tr).find("input[id^='BuildPieces']").val());
            //CurrentTr.find("input[id^='_tempBuildPieces']").val($(tr).find("input[id^='_tempBuildPieces']").val());
            //CurrentTr.find("input[id^='GrossWeight']").val($(tr).find("input[id^='GrossWeight']").val());
            //CurrentTr.find("input[id^='_tempGrossWeight']").val($(tr).find("input[id^='_tempGrossWeight']").val());

            //CurrentTr.find("input[id^='SHC']").val($(tr).find("input[id^='SHC']").val());
            //CurrentTr.find("div[id^='divMultiSHC']").find("ul").append($(tr).find("div[id^='divMultiSHC']").find("li[style='margin-right:3px;margin-bottom:3px;']"));
            //CurrentTr.find("input[id^='Multi_SHC']").val($(tr).find("input[id^='Multi_SHC']").val());
            //CurrentTr.find("input[id^='Multi_SHC']").text($(tr).find("input[id^='Multi_SHC']").text())
            //cfi.BindMultiValue(CurrentTr.find("input[id^='SHC']").attr("name"), null, $(tr).find("input[id^='SHC']").val());
            //CurrentTr.find("input[id^='SHC']").val($(tr).find("input[id^='SHC']").val());
        }
    });



    //alert("Hello");
}

function GetShipmentDetails() {
    var _AgentBuildupSNo = parseInt($('#hdnAgentBuildupSNo').val());
    $.ajax({
        url: "Services/BuildUp/AgentBuildUpService.svc/GetAgentBuildUpShipment?AgentBuildUpSNo=" + _AgentBuildupSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MasterData = jQuery.parseJSON(result);
            var FlightData = MasterData.Table0;
            var ShiupmentData = MasterData.Table1;
            if (FlightData.length > 0) {
                BindFlighDetail(FlightData);
            }
            if (ShiupmentData.length > 0) {
                BindShipment(ShiupmentData);
            }
        }
    });
}

function GetShipmentDetailsforEdit() {
    var _AgentBuildupSNo = parseInt($('#hdnAgentBuildupSNo').val());
    $.ajax({
        url: "Services/BuildUp/AgentBuildUpService.svc/GetAgentBuildUpShipmentforEdit?AgentBuildUpSNo=" + _AgentBuildupSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MasterData = jQuery.parseJSON(result);
            var FlightData = MasterData.Table0;
            var ShiupmentData = MasterData.Table1;
            if (FlightData.length > 0) {
                BindFlighDetail(FlightData);
            }
            if (ShiupmentData.length > 0) {
                //debugger;
                $("input[type='submit'][name='operation']").after('<input type="button" id="btnUpdateAgentBuildUp" name="btnUpdateAgentBuildUp" value="Update" class="btn btn-success">');
                $("input[type='submit'][name='operation']").hide();

                cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetSearch, "contains");
                cfi.AutoComplete("FlightNo", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");
                cfi.AutoComplete("AgentSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
                cfi.AutoComplete("OriginCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode"], null, "contains");

                $('#Text_OriginCode').data("kendoAutoComplete").key(userContext.CityCode);
                $('#Text_OriginCode').data("kendoAutoComplete").value(userContext.CityCode);
                $('#Text_OriginCode').data("kendoAutoComplete").enable(false);

                $("#btnUpdateAgentBuildUp").unbind("click").bind("click", function () {
                    if (cfi.IsValidSubmitSection()) {
                        UpdateAgentBuildUp();
                    }
                });

                //Parameter: processName, moduleName, appName, formAction
                $('#dvAgentBuildupTrans').html('');
                $.ajax({
                    url: "Services/BuildUp/BuildUpService.svc/GetWebForm/AgentBuildUp/BuildUp/AgentBuildup/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        //debugger
                        $('#dvShipment').html(result);

                        InstantiateControl("divareaTrans_buildup_agentbuilduptrans");

                        cfi.AutoComplete("Origin", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
                        cfi.AutoComplete("Destination", "AirportCode", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
                        cfi.AutoComplete("SHC", "Code", "sphc", "SNo", "Code", ["Code"], null, "contains", ",", null, null, null, CountSHCs, true);

                        //Parameter: ProcessName_XML Name
                        cfi.makeTrans("buildup_agentbuilduptrans", null, null, Bind_AutoComplete, Re_Bind_AutoComplete, null, ShiupmentData);
                        $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
                            $(this).find("input[id^='AWBNo']").bind("keyup", function (event) {
                                //debugger;
                                var Length = $(this).val().length;
                                var firstchar = $(this).val().charAt(0);
                                if (firstchar != "") {
                                    if (Length == 3) {
                                        $(this).val($(this).val() + "-");
                                    }
                                }
                            });
                        });

                        $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
                            //$(this).find("input[id^=_tempLength]").css("display", "none");
                            var id = $(this).find("input[id^='Text_SHC']").attr("id").replace('Text_', '');
                            var txt = $(this).find("input[id^='Text_SHC']").val();
                            var val = $(this).find("input[id^='SHC']").val();
                            cfi.BindMultiValue(id, txt, val);
                            // $("span.k-delete").live("click", function (e) { fn_RemoveRequired(e, $(this).find("input[id^='Text_SLISPHCCode']").attr("id")) })

                        });
                        $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("[id^='areaTrans_buildup_agentbuilduptrans']").each(function () {
                            $(this).find("div[id^='divMultiSHC']").css("overflow", "auto");
                            $(this).find("div[id^='divMultiSHC']").css("width", "15em");
                        });

                        DisableOrigin();



                        //DisableGrossWeight();
                    }
                });

                $("#FlightDate").kendoDatePicker({
                    change: function () {
                        ResetSearch();
                    }
                });



                //BindShipment(ShiupmentData);
            }
        }
    });
}



function BindFlighDetail(FlightData) {
    $("#Text_AirlineSNo").data("kendoAutoComplete").setDefaultValue(FlightData[0].AirlineSNo, FlightData[0].AirlineName);
    $('#FlightDate').val(FlightData[0].FlightDate);
    $("#Text_FlightNo").data("kendoAutoComplete").setDefaultValue(FlightData[0].DailyFlightSNo, FlightData[0].FlightNo);
    $("#Text_AgentSNo").data("kendoAutoComplete").setDefaultValue(FlightData[0].AgentSNo, FlightData[0].AgentName);
    $("#Text_OriginCode").data("kendoAutoComplete").setDefaultValue(FlightData[0].OriginCityCode, FlightData[0].OriginCityCode);

    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
    $('#FlightDate').data('kendoDatePicker').enable(false);
    $("#Text_FlightNo").data("kendoAutoComplete").enable(false);
    $("#Text_AgentSNo").data("kendoAutoComplete").enable(false);
    $("#Text_OriginCode").data("kendoAutoComplete").enable(false);


}

function BindShipment(ShiupmentData) {
    var uldhtml = "";
    uldhtml = "<br><table class='WebFormTable'><tr><td class='formSection' colspan='13'>Build Up Details</td></tr>";
    uldhtml = uldhtml + "<tr><td class='formHeaderLabel'>ULD No</td><td class='formHeaderLabel'>AWB No</td><td class='formHeaderLabel'>Lot No</td><td class='formHeaderLabel'>BOE No</td><td class='formHeaderLabel'>Lot No</td><td class='formHeaderLabel'>Total Pieces</td><td class='formHeaderLabel'>Total Gross Weight</td><td class='formHeaderLabel'>Build Pieces</td><td class='formHeaderLabel'>Gross Weight</td><td class='formHeaderLabel'>Nature Of Goods</td><td class='formHeaderLabel'>Origin</td><td class='formHeaderLabel'>Destination</td><td class='formHeaderLabel'>SHC</td></tr>";
    $.each(ShiupmentData, function (index, item) {
        uldhtml = uldhtml + "<tr></tr>";
        uldhtml = uldhtml + "<td style='padding-left:10px' class='formthreeInputcolumn'>" + item.ULDNo + "</td><td class='formthreeInputcolumn'>" + item.AWBNo + "</td><td align='center' class='formthreeInputcolumn'>" + item.SLINo + "</td><td align='right' class='formthreeInputcolumn'>" + item.BOENo + "</td><td align='left' class='formthreeInputcolumn'>" + item.LotNo + "</td><td align='center' class='formthreeInputcolumn'>" + item.TotalPieces + "</td><td align='right' class='formthreeInputcolumn'>" + item.TotalGrossWeight + "</td><td align='center' class='formthreeInputcolumn'>" + item.BuildPieces + "</td><td align='center' class='formthreeInputcolumn'>" + item.GrossWeight + "</td><td align='center' class='formthreeInputcolumn'>" + item.NatureOfGoods + "</td><td align='center' class='formthreeInputcolumn'>" + item.OriginCode + "</td><td align='center' class='formthreeInputcolumn'>" + item.DestinationCode + "</td><td align='center' class='formthreeInputcolumn'>" + item.SHC + "</td>";
    });
    uldhtml = uldhtml + "</table>";
    $('#dvShipment').html(uldhtml);
}

function SetTabIndex() {
    $("#divareaTrans_buildup_agentbuilduptrans input").each(function (i) {
        $(this).attr('tabindex', i + 1000);
    });
}

function CalculateGrossWeight(obj, objName) {
    var currentindex = obj.id.split('_')[1];
    currentindex = currentindex == undefined ? "" : "_" + currentindex;

    var TotalPieces = $('#TotalPieces' + currentindex).val();
    var TotalGrossWeight = $('#TotalGrossWeight' + currentindex).val();
    var BuildPieces = $('#BuildPieces' + currentindex).val();
    var GrossWeight = $('#GrossWeight' + currentindex).val();

    if (GrossWeight != "") {
        GrossWeight = parseFloat(GrossWeight) == 0 ? "0" : GrossWeight;
    }

    if (objName == "TotalPieces" && (TotalPieces == "0" || TotalPieces == "")) {
        $('#BuildPieces' + currentindex).val("");
        $('#GrossWeight' + currentindex).val("");
        $('#_tempBuildPieces' + currentindex).val("");
        $('#_tempGrossWeight' + currentindex).val("");
        $('#TotalPieces' + currentindex).val("");
        $('#_tempTotalPieces' + currentindex).val("");
        return;
    }
    if (objName == "TotalGrossWeight" && (TotalGrossWeight == "0" || TotalGrossWeight == "")) {
        $('#BuildPieces' + currentindex).val("");
        $('#GrossWeight' + currentindex).val("");
        $('#_tempBuildPieces' + currentindex).val("");
        $('#_tempGrossWeight' + currentindex).val("");
        return;
    }
    if (objName == "BuildPieces" && (BuildPieces == "0" || BuildPieces == "")) {
        $('#BuildPieces' + currentindex).val("");
        $('#GrossWeight' + currentindex).val("");
        $('#_tempBuildPieces' + currentindex).val("");
        $('#_tempGrossWeight' + currentindex).val("");
        return;
    }
    if (objName == "GrossWeight" && (GrossWeight == "0" || GrossWeight == "")) {
        $('#GrossWeight' + currentindex).val("");
        $('#_tempGrossWeight' + currentindex).val("");
        return;
    }

    if (TotalGrossWeight != "" && TotalGrossWeight != "0" && BuildPieces != "" && BuildPieces != "0" && objName != "GrossWeight") {
        var singlePcs = parseFloat(TotalGrossWeight) / parseInt(TotalPieces);
        var CalculatedGrWt = parseInt(BuildPieces) * singlePcs;
        $('#GrossWeight' + currentindex).val(CalculatedGrWt.toFixed(2));
        $('#_tempGrossWeight' + currentindex).val(CalculatedGrWt.toFixed(2));
    }
}

function showChildAgentBuildUpULD(obj) {
    $("#dvChildAgentBuildUpPopUp").remove();
    $("#tblChildAgentBuildUp").remove();
    var AgentBuildUpSNo = $(obj).closest("tr").find("td[data-column='SNo']").text();
    //$("#dvUldStackPopUp").show();
    //$("<div  id=dvUldStackPopUp></div>").appendTo('body');
    $("<div id='dvChildAgentBuildUpPopUp'></div>").appendTo('body');
    $("#dvChildAgentBuildUpPopUp").append("<table align='center' id='tblChildAgentBuildUp' border=\"1\" class='WebFormTable1' style=\"border-collapse: collapse;\"><tr><td align='center' style=\"width:200px; height:25px;font-weight: bold;font-size: 9pt;color: #5A7570;font-family: Verdana;background-color: #F7F7F7\" class='formSection1'>ULD No</td><td align='center' style=\"width:200px; height:25px;font-weight: bold;font-size: 9pt;color: #5A7570;font-family: Verdana;background-color: #F7F7F7\" class='formSection1'>Weighing</td></tr>");
    if (AgentBuildUpSNo != "" || AgentBuildUpSNo != undefined) {
        $.ajax({
            url: "Services/BuildUp/AgentBuildUpService.svc/GetChildULDAgentBuildUpRecord",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AgentBuildUpSNo: AgentBuildUpSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var tableString = "";
                var resData = jQuery.parseJSON(result);

                var AgentBuildUpULDDetailsData = resData.Table0;


                $(AgentBuildUpULDDetailsData).each(function (index, value) {
                    tableString += "<tr><td align='center' class='formthreeInputcolumn1' style=\" height:25px\">" + value.ULDNo + "</td><td align='center' class='formthreeInputcolumn1' style=\" height:25px\">" + value.Weighing + "</td></tr>";
                });
                tableString += "</table>";
                $("#tblChildAgentBuildUp").append(tableString);
                // $('#tblConsumable').appendGrid('load', consumablesData);
            },
            error: function (error) {
                alert(error)
            }
        });
    }


    cfi.PopUp("dvChildAgentBuildUpPopUp", "Agent Build Up-ULD", "500", null, null, 50);
}

function GetAWBDetails(Currentawbid) {

    //if (1 == 1) {
    //    return;
    //}

    //if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
    //    return;
    //}

    var awbno = $(Currentawbid).val();
    var currentindex = Currentawbid.split('_')[1] == undefined ? "" : "_" + Currentawbid.split('_')[1];

    var _AgentBuildupSNo = 0;

    if ($('#hdnAgentBuildupSNo').val() != undefined) {
        _AgentBuildupSNo = $('#hdnAgentBuildupSNo').val() == "" ? 0 : parseInt($('#hdnAgentBuildupSNo').val());
    }

    if (awbno != "") {
        $.ajax({
            url: "Services/BuildUp/AgentBuildUpService.svc/GetAgentBUP_AWBDetails?CheckFor=AWB&AWBNo=" + awbno + "&AgentBuildupSNo=" + _AgentBuildupSNo, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Result = jQuery.parseJSON(result);
                if (Result.Table0.length > 0) {
                    var AWBData = Result.Table0;
                    if (AWBData.length > 0) {
                        if (AWBData[0].AWBType == "ImportAWB") {
                            ClearValues(currentindex);
                            $('#hdnRemaining' + currentindex).val("ImportAWB-0");
                            ShowMessage('warning', 'Information', "AWB Already Executed in Import.");
                        }
                        else if (AWBData[0].AWBType == "TransitAWB") {
                            ClearValues(currentindex);
                            $('#hdnRemaining' + currentindex).val("TransitAWB-0");
                            ShowMessage('warning', 'Information', "AWB Already Executed in Transit.");
                        }
                        else if (AWBData[0].AWBType == "SLIExecuted") {
                            ClearValues(currentindex);
                            $('#hdnRemaining' + currentindex).val("SLIExecuted-0");
                            ShowMessage('warning', 'Information', " SLI for this AWB No. " + awbno + " has already been executed. Can not proceed with Agent Build Up.");
                        }
                        else if (AWBData[0].TotalPieces == AWBData[0].BuildPieces) {
                            ClearValues(currentindex);
                            $('#hdnRemaining' + currentindex).val("Completed-" + AWBData[0].LotNo);
                            ShowMessage('warning', 'Information', "Agent Build Up already executed under Lot No (" + AWBData[0].LotNo + ")");
                        }
                        else {
                            $('#TotalPieces' + currentindex).val(AWBData[0].TotalPieces);
                            $('#_tempTotalPieces' + currentindex).val(AWBData[0].TotalPieces);
                            $('#TotalGrossWeight' + currentindex).val(AWBData[0].TotalGrossWeight);
                            $('#_tempTotalGrossWeight' + currentindex).val(AWBData[0].TotalGrossWeight);
                            $('#Text_Destination' + currentindex).data("kendoAutoComplete").setDefaultValue(AWBData[0].DestinationCode, AWBData[0].DestinationCodeText);
                            $('#hdnRemaining' + currentindex).val(AWBData[0].RemainingPcs + "-" + AWBData[0].RemainingGrWt);

                            $('#SLINo' + currentindex).val(AWBData[0].SLINo);
                            $('#BOENo' + currentindex).val(AWBData[0].BOENo);
                            $('#_tempBOENo' + currentindex).val(AWBData[0].BOENo);

                            CheckPiece_Weight(Currentawbid, AWBData[0].RemainingPcs, AWBData[0].RemainingGrWt);
                        }
                    }
                }
                else {
                    $('#hdnRemaining' + currentindex).val("0-0");
                    CheckPiece_Weight(Currentawbid, -1, -1); // For New Waybill
                }
            }
        });
    }
}

function CheckPiece_Weight(currentID, RemainingPcs, RemainingGrWt) {

    //if (1 == 1)
    //{
    //    return;
    //}

    //if (getQueryStringValue("FormAction").toUpperCase() != "NEW")
    //{
    //    return;
    //}

    var currentindex = currentID.split('_')[1] == undefined ? "" : "_" + currentID.split('_')[1];
    var TotalPieces = $('#TotalPieces' + currentindex).val() == "" ? 0 : parseInt($('#TotalPieces' + currentindex).val());
    var TotalGrWt = $('#TotalGrossWeight' + currentindex).val() == "" ? 0 : parseFloat($('#TotalGrossWeight' + currentindex).val());
    var CalculatedPcs = 0;
    var CalculatedGrWt = 0;
    var AWBNo = $('#AWBNo' + currentindex).val();
    var ControlName = currentID.split('_')[0];

    if ($('#hdnRemaining' + currentindex).val().split('-')[0] == "Completed") {
        ShowMessage('warning', 'Information', "Agent Build Up already executed under Lot No (" + $('#hdnRemaining' + currentindex).val().split('-')[1] + ")");
        ClearValues(currentindex);
        return;
    }
    else if ($('#hdnRemaining' + currentindex).val().split('-')[0] == "ImportAWB") {
        ClearValues(currentindex);
        ShowMessage('warning', 'Information', "AWB Already Executed in Import.");
        return;
    }
    else if ($('#hdnRemaining' + currentindex).val().split('-')[0] == "SLIExecuted") {
        ClearValues(currentindex);
        ShowMessage('warning', 'Information', " SLI has already been executed. Can not proceed with Agent Build Up.");
        return;
    }
    else if ($('#hdnRemaining' + currentindex).val().split('-')[0] == "TransitAWB") {
        ClearValues(currentindex);
        ShowMessage('warning', 'Information', "AWB Already Executed in Transit.");
        return;
    }

    if (RemainingPcs == -1 && $('#hdnRemaining' + currentindex).val() != "" && $('#hdnRemaining' + currentindex).val() != "0-0") {
        RemainingPcs = parseInt($('#hdnRemaining' + currentindex).val().split('-')[0]);
        RemainingGrWt = parseFloat($('#hdnRemaining' + currentindex).val().split('-')[1]);
    }

    if (AWBNo != "") {
        $("div[id$='divareaTrans_buildup_agentbuilduptrans']").find("input[type='text'][id^='AWBNo']").each(function (index, item) {
            if (AWBNo == $(this).val()) {
                if (index == 0) {
                    if ($('#BuildPieces').val() != "")
                        CalculatedPcs = CalculatedPcs + parseInt($('#BuildPieces').val());
                    if ($('#GrossWeight').val() != "")
                        CalculatedGrWt = parseFloat(CalculatedGrWt) + parseFloat($('#GrossWeight').val());
                }
                else {
                    if ($('#BuildPieces_' + (index - 1)).val() != "")
                        CalculatedPcs = CalculatedPcs + parseInt($('#BuildPieces_' + (index - 1)).val());
                    if ($('#GrossWeight_' + (index - 1)).val() != "")
                        CalculatedGrWt = parseFloat(CalculatedGrWt) + parseFloat($('#GrossWeight_' + (index - 1)).val());
                }
            }
        });

        if (RemainingPcs == -1) // For New Waybill
        {
            if (parseInt(CalculatedPcs) > parseInt(TotalPieces)) {
                ShowMessage('warning', 'Information', "Build Pieces should be less than Total Pieces");
                $('#BuildPieces' + currentindex).val("");
                $('#_tempBuildPieces' + currentindex).val("");
                $('#GrossWeight' + currentindex).val("");
                $('#_tempGrossWeight' + currentindex).val("");
            }
            else if (parseFloat(CalculatedGrWt) > parseFloat(TotalGrWt) + 0.05 && $('#GrossWeight' + currentindex).val() != "") {
                ShowMessage('warning', 'Information', "Gross Weight should be less than Total Gross Weight");
                $('#GrossWeight' + currentindex).val("");
                $('#_tempGrossWeight' + currentindex).val("");
            }
        }
        else {
            if (parseInt(CalculatedPcs) > parseInt(RemainingPcs)) /********For Part Shipment*************/ {
                ShowMessage('warning', 'Information', "Total Build Pieces should be less than Remaining Pieces(" + parseInt(RemainingPcs) + ")");
                $('#BuildPieces' + currentindex).val("");
                $('#_tempBuildPieces' + currentindex).val("");
                $('#GrossWeight' + currentindex).val("");
                $('#_tempGrossWeight' + currentindex).val("");
            }
            else if (parseFloat(CalculatedGrWt) > parseFloat(RemainingGrWt) + 0.05 && $('#GrossWeight' + currentindex).val() != "") /********For Part Shipment*************/ {
                ShowMessage('warning', 'Information', "Total Gross Weight should be less than Remaining Gross Weight(" + parseFloat(RemainingGrWt) + ")");
                $('#GrossWeight' + currentindex).val("");
                $('#_tempGrossWeight' + currentindex).val("");
            }
        }

    }

}

function ClearValues(currentindex) {
    $('#TotalPieces' + currentindex).val("");
    $('#BuildPieces' + currentindex).val("");
    $('#TotalGrossWeight' + currentindex).val("");
    $('#GrossWeight' + currentindex).val("");
    $('#_tempTotalPieces' + currentindex).val("");
    $('#_tempBuildPieces' + currentindex).val("");
    $('#_tempTotalGrossWeight' + currentindex).val("");
    $('#_tempGrossWeight' + currentindex).val("");
    $('#SLINo' + currentindex).val("");
    $('#BOENo' + currentindex).val("");
    $('#_tempBOENo' + currentindex).val("");
}