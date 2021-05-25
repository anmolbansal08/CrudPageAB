var flags = 0;
var MType = '';
var BillTo = '';
var weight = '';
var Mtype = '';
var C = 0;
var rate = 0;
var MISCSNo = 0;
var Flag = 0;
var shipperconsignee = "";
var currentPomailSno = 0;
$(document).ready(function () {


    cfi.ValidateForm();
    var cuurentawbsno = "";
    var TransactionTypesno = "";
    //  var type = [{ Key: "AWB", Text: "AWB" }, { Key: "ULD", Text: "ULD" }, { Key: "Flight", Text: "Flight" }, { Key: "Others", Text: "Others" }];
    var type = [{ Key: "AWB", Text: "AWB" }];
    //var type = [{ Key: "SLI", Text: "SLI" }, { Key: "AWB", Text: "AWB" }, { Key: "ULD", Text: "ULD" }, { Key: "Flight", Text: "Flight" }, { Key: "Others", Text: "Others" }];
    // var billto = [{ Key: "Agent", Text: "Agent" }, { Key: "Airline", Text: "Airline" }];
    var billto = [{ Key: "Agent", Text: "Agent" }];
    Mtype = [{ Key: "2", value: "2", Text: "EXPORT" }, { Key: "1", value: "1", Text: "IMPORT" }];
    var currentType = "";
    $("#AWB").before("<span id='FlightNo'style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>Flight/Truck No </span>");
    $("#AWB").after('<input name="operation" class="btn btn-success" type="button" id="AddNew" onclick="AddNew()" value="Add New"/><div id="AddNewAqb" style="display:none"><div id="htmltableadd"><div> </div>');
    $("#gsgsgsg").after('<input name="operation" class="btn btn-success" type="button" id="GetCharge" onclick="GetCharge()" value="Get Charges" />');


    $("#FlightNo").on('hover', function () {
        $("#FlightNo").attr('title', 'Select Flight/Truck Number');
    });
    $('#FlightNo').hide();
    // BindIssueInvoice();
    $("#__SpanHeader__").css("color", "black");

    cfi.AutoCompleteV2("BillToSNo", "SNo,Name", "ESSCharges_Name", null, "contains");
    //cfi.AutoCompleteByDataSource("MovementType", Mtype, onselectMtype, null);
    cfi.AutoCompleteByDataSource("Type", type, onselectType, null);
    cfi.AutoCompleteByDataSource("MovementType", Mtype, MovementTypeEmpty, null);

    cfi.AutoCompleteByDataSource("BillTo", billto, onBillToSelect, null);
    cfi.AutoCompleteV2("Process", "ProcessName", "ESSCharges_ProcessName", null, "contains");
    cfi.AutoCompleteV2("SubProcess", "SubProcessDisplayName", "ESSCharges_SubProcessDisplayName", null, "contains");

    cfi.AutoCompleteV2("BillToAgentName", "Name", "ESSCharges_AccountName", null, "contains");

    //   cfi.AutoCompleteV2("AWB", "AWBNo", "ESSCharges_AWBNo", OnSelectGetEssAWBNo_Information, "contains");

    cfi.AutoCompleteV2("AWB", "AWBNo", "ESSCharges_AWBNo", null, "contains", null, null, null, null, OnSelectGetEssAWBNo_Information);
    cfi.AutoCompleteV2("HouseAwbNo", "HAWBNo", "ESS_CHAWBSNo", null, "contains", null, null, null, null, OnSelectGetEssHouseAWBNo_Information);
    //cfi.AutoCompleteV2("HouseAwbNo", "AWBNo", "ESSCharges_AWBNo", null, "contains", null, null, null, null, OnSelectGetEssAWBNo_Information);

    cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Acceptance_Airport", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("destination", "AirportCode,AirportName", "Acceptance_Airport", null, "contains", null, null, null, null, null);


    cfi.AutoCompleteV2("carriercode", "CarrierCode", "ULD_ChoosenAirline", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("AwbFlightNo", "FlightNo", "Acceptance_FlightNo", null, "contains", null, null, null, null, OnSelectGetEssFlight_Information);
    $("#AwbFlightDate").kendoDatePicker();

    // $("#AwbFlightDate").find("span").css("display","block")
    cfi.AutoCompleteV2("pieces", "TotalPieces", "TotalPieces_EssPicesGrweigthChweight", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("chweight", "TotalChargeableWeight", "TotalChaWeight_EssPicesGrweigthChweight", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("grwt", "totalgrossWeight", "totalgrossWeight_EssPicesGrweigthChweight", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("commodity", "CommodityCode,CommodityDescription", "Reservation_Commodity", null, "contains", null, null, null, null, null);



    //$("#AwbFlightNo").before("<span id='FlightDate'style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>Flight Date</span>");
    //$("#AwbFlightNo").attr('title', 'Flight Date');
    $('Text_HouseAwbNo').attr('placeholder','HawbNo');

    $("#Text_AWB").closest('.k-widget').hide();
    $('.k-datepicker').hide();
    $('#spnTypeValue').text('');
    $('#spnBillToSNo').text('');
    $("#Text_BillToSNo").closest('.k-widget').hide();
    //$("#Text_MovementType").attr("disabled", true);
    $("#ShipperName").css('text-transform', 'uppercase');
    //cfi.AutoComplete("IssuedTo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains");
    // BindESSCharges();

    //cfi.AutoComplete("IssuableItem", "Sno,Item", "VConsumablesStockItem", "Sno", "Item", null, null, "contains", null, null, null, null, OnSelectIssuableItem);

    $("#MovementType").val(2);
    $("#Text_MovementType").val("EXPORT");



    $('#Text_BillTo').attr('data-valid', 'required');
    $('#Text_BillTo').attr('data-valid-msg', 'Bill To can not be blank');
    $("#spnBillTo").before('<font color="red">*</font>')

    $("input").bind("keyup", function () {
        //if ($('#Type').val() == 'AWB') {
        //    PutColoninStartRange(this);
        //}
    });

    $("#Date").on('change', function () {
        $("#Text_AWB").val('');
    });

    $("input").blur(function () {
        if ($("#Text_MovementType").val() == "") {
            $("#MovementType").val(2);
            $("#Text_MovementType").val("EXPORT");
        }
    });
    GetMISCChargeSNo();


    //$("input[data-radioval^='CASH']").click(function () {

    //    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (row, tr) {

    //        $(tr).find("input[data-radioval^='CASH']").prop('checked', true);
    //        $(tr).find("input[data-radioval^='CREDIT']").prop('checked', false);
    //        $(tr).find("input[data-radioval^='CREDIT']").attr('disabled', true);

    //    });
    //    alert("1")
    //    //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").find("input[type='radio'][id^='chkCash']").prop("checked", false);
    //    //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").find("input[type='radio'][id^='chkCredit']").prop("checked", true);
    //});
    //$("input[data-radioval^='CREDIT']").click(function () {
    //    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (row, tr) {

    //        $(tr).find("input[data-radioval^='CREDIT']").prop('checked', true);
    //        $(tr).find("input[data-radioval^='CASH']").prop('checked', false);
    //        $(tr).find("input[data-radioval^='CASH']").attr('disabled', true);

    //    });
    //    alert("2")

    //});




    $("#AddNew").click(function () {

        if ($("#Type").val() == "") {
            ShowMessage('warning', 'Warning - AWB', "Please Select Type ! ", "bottom-right");
            return;
        }
        if ($("#MovementType").val() == "") {
            ShowMessage('warning', 'Warning - AWB', "Please Select Movement Type ! ", "bottom-right");
            return;
        }
        if ($("#BillTo").val() == "") {
            ShowMessage('warning', 'Warning - AWB', "Please Select Bill To ! ", "bottom-right");
            return;
        }
        if ($("#BillToSNo").val() == "") {
            ShowMessage('warning', 'Warning - AWB', "Please Select Agent Name! ", "bottom-right");
            return;
        }

        $("#htmltableadd").html("")
        $("#htmltableadd").html(Table)
        BindControlsAwb();

        $("#AddNewAqb").dialog({
            modal: true,
            draggable: true,
            resizable: true,
            position: ['center', 'top'],
            show: 'blind',
            hide: 'blind',
            width: 800,
            title: "AWB NO. INFORMATION",
            dialogClass: 'ui-dialog-osx',

        });
    })


    $("#GetCharge").click(function () {
        //$(".btn btn-success").attr("disabled", false)
        if ($("#Type").val() == "") {
            ShowMessage('warning', 'Warning - AWB', "Please select Type ! ", "bottom-right");
            return false;
        }
        else if ($("#MovementType").val() == "") {
            ShowMessage('warning', 'Warning - AWB', "Please select Movement Type ! ", "bottom-right");
            return false;
        }
        else if ($("#BillTo").val() == "") {
            ShowMessage('warning', 'Warning - AWB', "Please select BillTo ! ", "bottom-right");
            return false;
        }
        else {
            BindESSCharges();
        }
    });
    $("#chweight").attr("readonly", true)
    $("#pieces").attr("readonly", true)
    $("#grwt").attr("readonly", true)

    $("#_tempchweight").attr("readonly", true)
    $("#_temppieces").attr("readonly", true)
    $("#_tempgrwt").attr("readonly", true)
    $("#ShipperName").attr("readonly", true)
    $("#Text_Origin").data("kendoAutoComplete").enable(false);
    $("#Text_destination").data("kendoAutoComplete").enable(false);
    $("#Text_carriercode").data("kendoAutoComplete").enable(false);
    $("#Text_AwbFlightNo").data("kendoAutoComplete").enable(false);
    //$("#AwbFlightDate").attr("readonly", true)
    $("input[id^='AwbFlightDate']").data("kendoDatePicker").enable(false);
    $("#Text_commodity").data("kendoAutoComplete").enable(false);

    // $('#txtawbnoDate').data("kendoDatePicker").value("");
    //$("#ExAwbFlightDate")


    $("#gsgsgsg").before('<input type="checkbox" id="rushhandling" name="rushhandling" onclick="rushhandling(this)" /> Rush Handling');


    if ($('#MovementType').val() == '2') {
        $("#rushhandling").attr("disabled", true)
        $("#pieces").attr("readonly", true)

    } else if ($('#MovementType').val() == '1') {
        $("#rushhandling").attr("disabled", false)
        $("#pieces").attr("readonly", false)
    } else if ($('#MovementType').val() == '3') {
        $("#rushhandling").attr("disabled", true)
    }

    $("#pieces").after('/<label id="lblpieces"></label>');
    $("#chweight").after('/<label id="lblCh"></label>');
    $("#grwt").after('/<label id="lblGS"></label>');


    $("input[type='radio']").change(function () {
        var selection = $(this).val();
        alert("Radio button selection changed. Selected: " + selection);
    });

});


function MovementTypeEmpty() {

    EmptyAllControl()
    if ($('#MovementType').val() == '2') {
        $("#rushhandling").attr("disabled", true)
        $("#pieces").attr("readonly", true)
    } else if ($('#MovementType').val() == '1') {
        $("#rushhandling").attr("disabled", false)
        $("#pieces").attr("readonly", false)
    } else if ($('#MovementType').val() == '3') {
        $("#rushhandling").attr("disabled", true)
    }
}

function KeyAwbFunction() {

    if ($("#AWBCode").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please select awb code!", "bottom-right");
        $("#txtawbno").val("")
    }
    //if ($('#txtawbno').val().length == 3) {
    //    //if ($('#txtawbno').val() == "126") {
    //    //    ShowMessage('warning', 'Warning - AWB', "", "bottom-right");
    //    //    $("#txtawbno").val("")
    //    //} else {
    //    $('#txtawbno').val($("#txtawbno").val() + "-");
    //    // }

    //}
}
function AwbFunction() {
    GetAwbMod()

}
function EmptyAllControl() {
    $("#Origin").val("");
    $("#destination").val("");
    $("#carriercode").val("");
    $("#AwbFlightNo").val("");
    $("#commodity").val("");
    $("#Text_Origin").val("");
    $("#Text_destination").val("");
    $("#Text_carriercode").val("");
    $("#Text_AwbFlightNo").val("");
    $("#Text_commodity").val("");
    $("#pieces").val("");
    $("#_temppieces").val("");
    $("#chweight").val("");
    $("#_tempchweight").val("");
    $("#_tempgrwt").val("");
    $("#grwt").val("");
    $("#Text_AWB").val("");
    $("#AWB").val("");
    $("#Text_BillTo").val("");
    $("#BillTo").val("");
    $("#BillToSNo").val("");
    $("#Text_BillToSNo").val("");
    $("#ShipperName").val("");
    $("#Text_BillToSNo").data("kendoAutoComplete").enable(true);
}
function GetHouseAWB() {  
    $("#AddNewHAWB1").html('');
    var finalValue = $("#AWBCode").val() + "-" + $('#txtawbno').val();
    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetHouseAWB?AWBNo=" + finalValue + "&Mtype=" + $("#MovementType").val(), async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var data = JSON.parse(result);
            var isValid = data.Table0;
            if (isValid != undefined) {
                for (var i = 0; i < data.Table0.length; i++) {                  
                    var str = "";
                    str+= "<table>";
                    str+= "<tr>"
                    str+= "<td><b>HAWBNo:</b></td><td>" + data.Table0[i]["hawbno"] + "</td>";
                    str += "<td><b>Total Pieces:</b></td><td>" + data.Table0[i]["TotalPieces"] + "</td>";
                    str += "</tr>";
                    str += "<tr>";
                    str += "<td><b>TotalGrossWeight</b></td><td>" + data.Table0[i]["TotalGrossWeight"] + "</td>";
                    str += "<td><b>TotalVolumeWeight</b></td><td>" + data.Table0[i]["TotalVolumeWeight"] + "</td>";
                    str += "</tr>";
                    str += "<tr>";
                    str += "<td><b>Commodity</b></td><td>" + data.Table0[i]["commoditycode"] + "</td>";
                    str += "<td><b>TotalChargeableWeight</b></td><td>" + data.Table0[i]["TotalChargeableWeight"] + "</td>";
                    str += "</tr>";
                    str += "<tr>";
                    str += "<td><b>ShipperCustomerName</b></td><td>" + data.Table0[i]["ShipperCustomerName"] + "</td>";
                    str += "<td><b>ConsigneeCustomerName</b></td><td>" + data.Table0[i]["ConsigneeCustomerName"] + "</td>";
                    str += "</tr>";
                    str += "</table>";
                    str += "<br/>";
                    $("#AddNewHAWB1").append(str);
                  //  $(".ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ui-draggable ui-resizable ui-dialog-osx").show();
                 
                }
              
                $("#AddNewHAWB1").dialog({
                    modal: true,
                    draggable: true,
                    resizable: true,
                    position: ['center', 'top'],
                    show: 'blind',
                    hide: 'blind',
                    width: 800,
                    title: "HAWB NO. INFORMATION",
                    dialogClass: 'ui-dialog-osx',

                });
            }

        },
        error: {
        }
    });




}
function CheckIsAWBUsable() {
    //$('#AddNewHAWB').html('');;
    $('div[aria-describedby="AddNewHAWB"]').remove();
    //$('#AddNewHAWB').closest('.ui-dialog').remove();
    var finalValue = $("#AWBCode").val() + "-" + $('#txtawbno').val();

    if ($('#txtawbno').val() != "" || $("#AWBCode").val() != "") {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CheckIsAWBUsable?AWBNo=" + finalValue + "&Mtype=" + $("#MovementType").val(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = JSON.parse(result);
                var isValid = data.Table0;
               // var count = data.Table1[0]["COUNT"];
                if (isValid != undefined) {
                    $("#AWBExOrigin").val(data.Table0[0]["OriginAirportSNo"]);
                    $("#Text_AWBExOrigin").val(data.Table0[0]["OriginAirportCode"]);
                    $("#AWBExdestination").val(data.Table0[0]["DestinationAirportSNo"]);
                    $("#Text_AWBExdestination").val(data.Table0[0]["DestinationAirportCode"]);
                    $("#ExOrigin").val(data.Table0[0]["FOriginAirportSNo"]);
                    $("#Text_ExOrigin").val(data.Table0[0]["FOriginAirportCode"]);
                    $("#Exdestination").val(data.Table0[0]["FDestinationAirportSNo"]);
                    $("#Text_Exdestination").val(data.Table0[0]["FDestinationAirportCode"]);
                    $("#Pieces").val(data.Table0[0]["TotalPieces"]);
                    $("#GrossWt").val(data.Table0[0]["TotalGrossWeight"]);
                    $("#VolumeWt").val(data.Table0[0]["TotalVolumeWeight"]);
                    $("#CBM").val(data.Table0[0]["TotalCBM"]);
                    $("#ChargeableWt").val(data.Table0[0]["TotalChargeableWeight"]);
                    $("#Excommodity").val(data.Table0[0]["CommoditySNo"]);
                    $("#Text_Excommodity").val(data.Table0[0]["commoditycode"]);
                    $("#Text_ExSHIPPER").val(data.Table0[0]["ShipperCustomerName"]);
                    $("#Text_ExConsignee").val(data.Table0[0]["ConsigneeCustomerName"]);
                    $("#ExAwbFlightNo").val(data.Table0[0]["DailyFlightSNo"]);
                    $("#Text_ExAwbFlightNo").val(data.Table0[0]["carriercode"]);
                   
                    var flightno = data.Table0[0]["FlightNo"];                    
                    $("#Text_FlightPrex").val(flightno.substring(flightno.indexOf('-') + 1, flightno.indexOf('-') + 5));
                    $("#Text_FlightPrexGa").val(flightno.substring(flightno.indexOf('-') + 5));
                    $("#NoofHouse").val(data.Table1[0]["COUNT"]);
                    //$("#ADDHouse").after('<input name="operation" class="btn btn-success" type="button" id="GetHouseAWB" onclick = GetHouseAWB() value="View" />');
                    //$("#ADDHouse").attr("disabled", true);
                    GetHouseAWB();
                }
                else
                {
                    $("#AWBExOrigin").val("");
                    $("#Text_AWBExOrigin").val("");
                    $("#AWBExdestination").val("");
                    $("#Text_AWBExdestination").val("");
                    $("#ExOrigin").val("");
                    $("#Text_ExOrigin").val("");
                    $("#Exdestination").val("");
                    $("#Text_Exdestination").val("");
                    $("#Pieces").val("");
                    $("#GrossWt").val("");
                    $("#VolumeWt").val("");
                    $("#CBM").val("");
                    $("#ChargeableWt").val("");
                    $("#Excommodity").val("");
                    $("#Text_Excommodity").val("");
                    $("#Text_ExSHIPPER").val("");
                    $("#Text_ExConsignee").val("");
                    $("#ExAwbFlightNo").val("");
                    $("#Text_ExAwbFlightNo").val("");
                    $("#Text_FlightPrex").val("");
                    $("#Text_FlightPrexGa").val("");                  
                   // $("#ADDHouse").attr("disabled", false);
                }

            },
            error: {
            }
        });
    }
}

function BindControlsAwb() {
    cfi.AutoCompleteV2("AWBCode", "AirlineCode", "Reservation_Airline", null, "contains");
    cfi.AutoCompleteV2("AWBExOrigin", "CityCode,CityName", "ULDSTOCK_CityCode", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("AWBExdestination", "CityCode,CityName", "ULDSTOCK_CityCode", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("ExOrigin", "AirportCode,AirportName", "Acceptance_Airport", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("Exdestination", "AirportCode,AirportName", "Acceptance_Airport", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("Excarriercode", "CarrierCode", "Acceptance_airline", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("ExAwbFlightNo", "CarrierCode", "Acceptance_airline", OnSelectCarrierCode, "contains", null, null, null, null, null);
    $("#ExAwbFlightDate").kendoDatePicker();
    cfi.AutoCompleteV2("Excommodity", "CommodityCode,CommodityDescription", "Reservation_Commodity", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("ExSHIPPER", "CustomerTypeSNo", "Acceptance_SHIPPER_AccountNo", null, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("ExConsignee", "CustomerTypeSNo", "Acceptance_SHIPPER_AccountNo_cons", null, "contains", null, null, null, null, null, null, null, true);
    ///cfi.AutoCompleteV2("ExAwbFlightNo", "CarrierCode", "Acceptance_airline", null, "contains", null, null, null, null, null);
    var AirlineCarrierCode = userContext.AirlineCarrierCode;
    var SAirlineCarrierCode = AirlineCarrierCode.split("-")
    $("#Text_Excarriercode").data("kendoAutoComplete").setDefaultValue(userContext.AirlineSNo, SAirlineCarrierCode[0]);

    if ($("#MovementType").val() == "2") {

        $("#Text_ExSHIPPER").show()
        // $("#Text_ExConsignee").hide()
        $("#Text_ExConsignee").data("kendoAutoComplete").setDefaultValue("", "");
        $("#Text_ExConsignee").data("kendoAutoComplete").enable(false);
    } else {
        // $("#Text_ExSHIPPER").hide()
        $("#Text_ExConsignee").show()
        $("#Text_ExSHIPPER").data("kendoAutoComplete").setDefaultValue("", "");
        $("#Text_ExSHIPPER").data("kendoAutoComplete").enable(false);
    }
    $("#txtawbnoDate").kendoDatePicker();


    var todaydate = new Date();
    var validTodate = $("#ExAwbFlightDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    $("#AwbInformationSave").css("disabled", "block")
}
function OnSelectCarrierCode(valueId, value, keyId, key) {

    $("#Text_Excarriercode").val($("#Text_ExAwbFlightNo").val())
    $("#Excarriercode").val($("#ExAwbFlightNo").val())


}
var Id = 0;
function OnSelectGetEssAWBNo_Information(valueId, value, keyId, key) {

    //$(".btn btn-success").attr("disabled", false)
    setTimeout(function () {
        BindGetEssAWBNo_Information()
    }, 500)
    $("#tblesscharges").hide();


}
function OnSelectGetEssHouseAWBNo_Information(valueId, value, keyId, key) {

    //$(".btn btn-success").attr("disabled", false)
    setTimeout(function () {
        BindGetEssHouseAWBNo_Information()
    }, 500)
    $("#tblesscharges").hide();


}

function OnSelectGetEssFlight_Information(valueId, value, keyId, key) {
    setTimeout(function () {
        BindGetEssAWBNo_Information()
    }, 500)


    //BindESSCharges();
}
function BindGetEssHouseAWBNo_Information() {

    var MovementType = $("#MovementType").val();
    if (MovementType == "") {
        ShowMessage('warning', 'Warning ', "Select  Movement Type", "bottom-right");
        return false;
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetEssHouseAWBNo_Information",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ AWBNo: $("#HouseAwbNo").val(), FlightNO: "", movetype: MovementType }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            if (FinalData.length > 0) {
                $("#Text_Origin").val(FinalData[0].OriginAirport)
                $("#Origin").val(FinalData[0].OriginAirportSNo)
                $("#Text_destination").val(FinalData[0].DestinationAirport)
                $("#destination").val(FinalData[0].DestinationAirportSNo)
                $("#Text_carriercode").val(FinalData[0].carriercode)
                $("#carriercode").val(FinalData[0].carriercode)
                $("#Text_AwbFlightNo").val(FinalData[0].FlightNo)
                $("#AwbFlightNo").val(FinalData[0].FlightNoSno)
                $("#_temppieces").val(FinalData[0].TotalPieces)
                $("#pieces").val(FinalData[0].TotalPieces)
                $("#lblpieces").text(FinalData[0].TotalPieces)

                $('span[id="AwbFlightDate"]').text(FinalData[0].FlightDate);
                $('input[id="AwbFlightDate"]').val(FinalData[0].FlightDate);

                $("#_tempchweight").val(FinalData[0].TotalChargeableWeight)
                $("#chweight").val(FinalData[0].TotalChargeableWeight)
                $("#lblCh").text(FinalData[0].TotalChargeableWeight)
                $("#_tempgrwt").val(FinalData[0].totalgrossWeight)
                $("#lblGS").text(FinalData[0].totalgrossWeight)

                $("#grwt").val(FinalData[0].totalgrossWeight)
                $("#Text_commodity").val(FinalData[0].CommodityDescription)
                $("#commodity").val(FinalData[0].CommoditySno)

                if ($("#MovementType").val() != "2") {
                    $('#ShipperName').attr('readonly', true);
                    $("#Text_BillToSNo").data("kendoAutoComplete").enable(false);
                }
            }
            CheckWalkIn();

        }
    });
}
function BindGetEssAWBNo_Information() {

    var MovementType = $("#MovementType").val();
    if (MovementType == "") {
        ShowMessage('warning', 'Warning ', "Select  Movement Type", "bottom-right");
        return false;
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetEssAWBNo_Information",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ AWBNo: $("#AWB").val(), FlightNO: "", movetype: MovementType }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            if (FinalData.length > 0) {
                $("#Text_Origin").val(FinalData[0].OriginAirport)
                $("#Origin").val(FinalData[0].OriginAirportSNo)
                $("#Text_destination").val(FinalData[0].DestinationAirport)
                $("#destination").val(FinalData[0].DestinationAirportSNo)
                $("#Text_carriercode").val(FinalData[0].carriercode)
                $("#carriercode").val(FinalData[0].carriercode)
                $("#Text_AwbFlightNo").val(FinalData[0].FlightNo)
                $("#AwbFlightNo").val(FinalData[0].FlightNoSno)
                $("#_temppieces").val(FinalData[0].TotalPieces)
                $("#pieces").val(FinalData[0].TotalPieces)
                $("#lblpieces").text(FinalData[0].TotalPieces)

                $('span[id="AwbFlightDate"]').text(FinalData[0].FlightDate);
                $('input[id="AwbFlightDate"]').val(FinalData[0].FlightDate);

                $("#_tempchweight").val(FinalData[0].TotalChargeableWeight)
                $("#chweight").val(FinalData[0].TotalChargeableWeight)
                $("#lblCh").text(FinalData[0].TotalChargeableWeight)
                $("#_tempgrwt").val(FinalData[0].totalgrossWeight)
                $("#lblGS").text(FinalData[0].totalgrossWeight)

                $("#grwt").val(FinalData[0].totalgrossWeight)
                $("#Text_commodity").val(FinalData[0].CommodityDescription)
                $("#commodity").val(FinalData[0].CommoditySno)

                if ($("#MovementType").val() != "2") {
                    $('#ShipperName').attr('readonly', true);
                    $("#Text_BillToSNo").data("kendoAutoComplete").enable(false);
                }
            }
            CheckWalkIn();

        }
    });
}
//function blankAbw() {
   // $("#txtawbno").val("")
//}

function blank() {
    $('#Text_BillTo').val('');
    $('#Text_BillToSNo').val('');
    $('#ShipperName').val('');
    //CheckWalkIn();
}

function onselectMtype() {

    //cfi.ResetAutoComplete("Type");
    cfi.ResetAutoComplete("AWB");
    cfi.ResetAutoComplete("BillTo");
    cfi.ResetAutoComplete("BillToSNo");
    cfi.ResetAutoComplete("MovementType");
    //if ($('#MovementType').val() == '1') {
    //    var type = '';
    //    var type = [{ Key: "AWB", Text: "AWB" }, { Key: "ULD", Text: "ULD No" }, { Key: "Flight", Text: "Flight" }];
    //} else {
    //    var type = '';
    //    var type = [{ Key: "SLI", Text: "SLI" }, { Key: "AWB", Text: "AWB" }, { Key: "ULD", Text: "ULD No" }, { Key: "Flight", Text: "Flight" }];
    //}
    //cfi.ChangeAutoCompleteDataSource("Type", type, true, onselectType, "key", "contains");
    //cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, true, MovementTypeEmpty, "key", "contains");
    //  BindESSCharges();
}

function onBillToSelect(e) {

    if ($('#BillTo').val() == 'Airline') {
        $("#tblIssueDetail").find("table[id^='tableRbtnPaymentType']").each(function () {
            $(this).find('td:eq(1)').find("input:radio").attr("checked", "checked");
            $(this).find('td:eq(0)').find("input:radio").attr("disabled", "disabled");
        })
        $("#BillToSNo").val('');

    }
    if ($('#BillTo').val() == 'Agent') {

        $("#tblIssueDetail").find("table[id^='tableRbtnPaymentType']").each(function () {
            // $(this).find('td:eq(1)').find("input:radio").attr("checked", "checked");
            $(this).find('td:eq(0)').find("input:radio").attr("disabled", false);
        })
        $("#BillToSNo").val('');
    }



    cfi.ResetAutoComplete("BillToSNo");
    $("#Text_BillToSNo").closest('.k-widget').show();
    if ($('#BillTo').val() == 'Agent') {
        if ($('#MovementType').val() == '2') {

            if ($('#Type').val() == 'AWB') {
                $('#spnBillToSNo').text('Agent Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Agent Name')
                //var data = GetDataSource("BillToSNo", "VAccountForExport", "SNo", "Name", ["Name"], null);
                var data = GetDataSourceV2("BillToSNo", "ESSCharges_AgentName", null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Agent Name can not be blank');
            } else if ($('#Type').val() == 'SLI') {
                $('#spnBillToSNo').text('Agent Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Agent Name')
                //var data = GetDataSource("BillToSNo", "VAccountForSLIExport", "SNo", "Name", ["Name"], null);
                var data = GetDataSourceV2("BillToSNo", "ESSCharges_AgentName", null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Agent Name can not be blank');
            }
            else {
                $('#spnBillToSNo').text('Agent Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Agent Name')
                //var data = GetDataSource("BillToSNo", "VAccountForImport", "SNo", "Name", ["Name"], null);            
                var data = GetDataSourceV2("BillToSNo", "ESSCharges_AgentName", null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Agent Name can not be blank');
            }
        } else {
            $('#spnBillToSNo').text('Agent Name');
            $('#spnBillToSNo').closest('td').attr('title', 'Select Agent Name')
            //var data = GetDataSource("BillToSNo", "VAccountForImport", "SNo", "Name", ["Name"], null);
            var data = GetDataSourceV2("BillToSNo", "ESSCharges_AgentName", null);
            cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
            $('#Text_BillToSNo').attr('data-valid', 'required');
            $('#Text_BillToSNo').attr('data-valid-msg', 'Agent Name can not be blank');
        }
    }
    else if ($('#BillTo').val() == 'Airline') {
        flags = 0;
        if ($('#MovementType').val() == '2') {
            if ($('#Type').val() == 'AWB') {
                $('#spnBillToSNo').text('Airline Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Airline Name')
                //var data = GetDataSource("BillToSNo", "VAirlineForAwb", "SNo", "AirlineName", ["AirlineName"], null);
                var data = GetDataSourceV2("BillToSNo", "ESSCharges_AirlineName", null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Airline Name can not be blank');
            } else if ($('#Type').val() == 'SLI') {
                $('#spnBillToSNo').text('Airline Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Airline Name')
                //var data = GetDataSource("BillToSNo", "VAirlineForSli", "SNo", "AirlineName", ["AirlineName"], null);
                var data = GetDataSourceV2("BillToSNo", "ESSCharges_AirlineName", null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Airline Name can not be blank');
            }
            else {
                $('#spnBillToSNo').text('Airline Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Airline Name')
                //var data = GetDataSource("BillToSNo", "VAirlineForAwbImport", "SNo", "AirlineName", ["AirlineName"], null);
                var data = GetDataSourceV2("BillToSNo", "ESSCharges_AirlineName", null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Airline Name can not be blank');
            }
        } else {

            $('#spnBillToSNo').text('Airline Name');
            $('#spnBillToSNo').closest('td').attr('title', 'Select Airline Name')
            //var data = GetDataSource("BillToSNo", "VAirlineForAwbImport", "SNo", "AirlineName", ["AirlineName"], null);
            var data = GetDataSourceV2("BillToSNo", "ESSCharges_AirlineName", null);
            cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
            $('#Text_BillToSNo').attr('data-valid', 'required');
            $('#Text_BillToSNo').attr('data-valid-msg', 'Airline Name can not be blank');
        }

    }

    var AWBSNo = $('#AWB').val();

    if (AWBSNo != "") {
        // if ($('#Text_BillTo').val() == "Agent") {
        $.ajax({
            url: "./Services/ULD/CityWiseULDAllocationService.svc/GetAgentName", async: false, type: "post", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: AWBSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var basis = JSON.parse(result);
                var res = basis.Table0
                var res1 = basis.Table1;
                var res2 = basis.Table2;
                var res3 = basis.Table3;
                var res4 = basis.Table4;
                if ($('#MovementType').val() == '2') {
                    if ($('#Text_BillTo').val() == "Agent") {
                        if (res.length > 0) {

                            //$('#Text_BillToSNo').val(res[0].Name)

                            //$('#Text_BillToSNo').prop("disabled", true);
                            $('#Text_BillToSNo').prop("disabled", false);
                        }
                        else {
                            if (res1.length > 0) {
                                //$('#Text_BillToSNo').val(res1[0].Name)
                                //$('#Text_BillToSNo').prop("disabled", true);
                                $('#Text_BillToSNo').prop("disabled", false);
                            }
                        }
                    }
                    if ($('#Text_BillTo').val() == "Airline") {
                        if (res2.length > 0) {
                            // $('#Text_BillToSNo').val(res2[0].AirlineName)
                        }
                        else {
                            if (res3.length > 0) {
                                //    $('#Text_BillToSNo').val(res3[0].AirlineName)
                            }
                        }
                    }
                }
                else {
                    if (res4.length > 0) {
                        // $('#Text_BillToSNo').val(res4[0].Name)
                    }

                }
            }
        });
        //}
    }
    //  BindESSCharges();
}

function 
    onselectType() {
    $('#Text_HouseAwbNo').attr('placeholder', 'HawbNo');
    cfi.ResetAutoComplete("AWB");
    cfi.ResetAutoComplete("BillTo");
    cfi.ResetAutoComplete("BillToSNo");
    cfi.ResetAutoComplete("MovementType");
    $('#ShipperName').val('');
    $('#ShipperName').attr('readonly', true);
    if ($('#Type').val() != "") {
        $("#Text_AWB").closest('.k-widget').show();
        $('#Text_AWB').removeAttr('data-valid');
        $('#Text_AWB').removeAttr('data-valid-msg');
        weight = '';
    }
    if ($('#Type').val() == 'AWB') {
        $('#Text_AWB').show();
        $('#Text_AWB').closest('span').show();
        $('#Text_AWB').val('');
        $('#FlightNo').hide();
        $('.k-datepicker').hide();
        $('#spnTypeValue').text('AWB No.');
        $('#spnTypeValue').closest('td').attr('title', 'Select AWB Number');
        $('#Text_AWB').closest('span').css('width', '175px');
        $('#Text_AWB').attr('data-valid', 'required');
        $('#Text_AWB').attr('data-valid-msg', 'AWB Number can not be blank');
        //$("#Text_MovementType").attr("disabled", false);

        //var data = GetDataSourceV2("AWB", "AWBNo", null);
        //cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "AWBNo", "contains");
        //cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, true, MovementTypeEmpty, "key", "contains");
        //  cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, MovementTypeEmpty);
    }
        //else if ($('#Type').val() == 'Flight') {
        //    $('#spnTypeValue').text('Flight/Truck Date');
        //    $('#spnTypeValue').closest('td').attr('title', 'Select Flight/Truck Date');
        //    $('.k-datepicker').show();
        //    $('#FlightNo').show();
        //    $('#Text_AWB').show();
        //    $('#Text_AWB').closest('span').show();
        //    $('#Text_AWB').val('');
        //    $('#Text_AWB').attr('data-valid', 'required');
        //    $('#Text_AWB').attr('data-valid-msg', 'Flight/Truck Number can not be blank.');
        //    $('#Date').closest('span').css('width', '80px')
        //    $('#Text_AWB').closest('span').css('width', '120px');
        //    var data = GetDataSourceV2("AWB", "Tarrif_FlightNo", null);
        //    cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "FlightNo", "contains");
        //    cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, MovementTypeEmpty, null);
        //}
    else if ($('#Type').val() == 'ULD') {
        $('#Text_AWB').show();
        $('#Text_AWB').closest('span').show();
        $('#Text_AWB').val('');
        $('#spnTypeValue').text('ULD No.');
        $('#spnTypeValue').closest('td').attr('title', 'Select ULD Number');
        $('#FlightNo').hide();
        $('.k-datepicker').hide();
        $('#Text_AWB').attr('data-valid', 'required');
        $('#Text_AWB').attr('data-valid-msg', 'ULD Number can not be blank.');
        $('#Text_AWB').closest('span').css('width', '175px');
        var data = GetDataSourceV2("AWB", "Tarrif_ULDNo", null);
        cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "ULDNo", "contains");
        //  cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, MovementTypeEmpty);
    }
    //else if ($('#Type').val() == 'SLI') {
    //    ///  $('#Text_AWB').show();
    //    $('#Text_AWB').closest('span').show();
    //    $('#Text_AWB').val('');
    //    $('#spnTypeValue').text('Lot No.');
    //    $('#spnTypeValue').closest('td').attr('title', 'Select SLI Number');
    //    $('#FlightNo').hide();
    //    $('.k-datepicker').hide();
    //    $('#Text_AWB').attr('data-valid', 'required');
    //    $('#Text_AWB').attr('data-valid-msg', 'SLI Number can not be blank.');
    //    $('#Text_AWB').closest('span').css('width', '175px');
    //    var data = GetDataSourceV2("AWB", "Tarrif_SLINo", null);
    //    cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "SLINo", "contains");
    //    var MtypeS = [{ Key: "2", value: "2", Text: "EXPORT" }];
    //    cfi.ChangeAutoCompleteDataSource("MovementType", MtypeS, MovementTypeEmpty, null);
    //}
    //else if ($('#Type').val() == 'Others') {
    //    $('#Text_AWB').closest('span').hide();
    //    $('#Text_AWB').val('');
    //    $('#spnTypeValue').text('');
    //    $('#FlightNo').hide();
    //    $('.k-datepicker').hide();
    //    var MtypeO = [{ Key: "1", value: "1", Text: "IMPORT" }];
    //    cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, MovementTypeEmpty, null);
    //}
    setTimeout(function () {
        $('#AwbFlightDate').closest('tr').find("span").css("display", "block");
    }, 100)
}


function BindESSCharges() {
    var IsRushHandling = "RSH=" + ($("#rushhandling").is(':checked') ? 1 : 0);
    if ($('#MovementType').val() == '2') {

        _CURR_PRO_ = "ESS";
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/GetWebForm/" + _CURR_PRO_ + "/Tariff/ESSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                // $("#tblIssueDetail").html(result);

                $("#tblIssueDetail").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
                $("#tblIssueDetail").html(result);
                cfi.makeTrans("tariff_tariffdohandlingcharge", null, null, BindChargesItemAutoComplete, ReBindChargesItemAutoComplete, null, null);


                $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
                    $(this).find("input[id^='ChargeName']").each(function () {
                        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {

                            // AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE_Ess", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE_Ess_Export", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", $('#chweight').val() == "" ? 0 : $('#chweight').val(), $('#grwt').val() == "" ? 0 : $('#grwt').val(), $('#pieces').val() == "" ? 0 : $('#pieces').val(), IsRushHandling);
                            // AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], ResetFBLCharge, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");

                        }
                    });


                    cfi.Numeric($(this).find("input[id^='PValue']").attr("id"), 2);

                    cfi.Numeric($(this).find("input[id^='SValue']").attr("id"), 2);

                    //cfi.Numeric($(this).find("input[id^='Rate']").attr("id"), 2);

                    $('#spnWaveOff').hide();
                    $(this).find("input[id^='WaveOff']").hide();
                    $(this).find("input[id^='PValue']").attr('data-valid', 'required');
                    $(this).find("input[id^='PValue']").attr('data-valid-msg', 'Primary value can not be blank');
                    ////23-11-2017
                    $(this).find("span[id^='Remarks']").css("white-space", "pre-wrap")
                });


            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }
        });
        setTimeout(function () {
            $('#AwbFlightDate').closest('tr').find("span").css("display", "block");
        }, 100)
    }
    else {
        _CURR_PRO_ = "ESS";
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/GetWebForm/" + _CURR_PRO_ + "/Tariff/ESSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                // $("#tblIssueDetail").html(result);

                $("#tblIssueDetail").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
                $("#tblIssueDetail").html(result);
                cfi.makeTrans("tariff_tariffdohandlingcharge", null, null, BindChargesItemAutoComplete, ReBindChargesItemAutoComplete, null, null);

                var hawb = 0;
                var SPHCTransSNo = 0;
                var ShipmentDetailArray = [];
                var pieces = 0;
                var grossWt = 0;
                var partNumber = 0;
                var VolumeWeight = 0;
                //if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
                //    hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
                //if (subprocesssno == "2137") {
                //    pieces = $("#hdnPieces").val();
                //    grossWt = $("#hdnGrWt").val();
                //}
                //else {
                //$("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                pieces = $('#pieces').val()
                grossWt = $('#grwt').val()
                VolumeWeight = $('#chweight').val()
                var ShipmentDetailViewModel = {
                    PartNumber: Number(partNumber) + 1,
                    AWBSNo: $('#AWB').val() || 0,
                    HAWBSNo: hawb || 0,
                    PartSNo: $('#AwbFlightNo').val() || 0,
                    Pieces: pieces || 0,
                    GrossWeight: grossWt || 0,
                    VolumeWeight: VolumeWeight || 0,
                    IsBUP: 0,
                    SPHCSNo: 0,
                    SPHCTransSNo: SPHCTransSNo || 0
                };
                ShipmentDetailArray.push(ShipmentDetailViewModel);
                //});
                //}
                $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
                    $(this).find("input[id^='ChargeName']").each(function () {
                        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {

                            // AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE_Ess", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
                            ImportAutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], ImportGatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound_EssImport", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, 1, hawb, "2", ShipmentDetailArray, "No", IsRushHandling);
                            // AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], ResetFBLCharge, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");

                        }
                    });


                    cfi.Numeric($(this).find("input[id^='PValue']").attr("id"), 2);

                    cfi.Numeric($(this).find("input[id^='SValue']").attr("id"), 2);

                    //cfi.Numeric($(this).find("input[id^='Rate']").attr("id"), 2);

                    $('#spnWaveOff').hide();
                    $(this).find("input[id^='WaveOff']").hide();
                    $(this).find("input[id^='PValue']").attr('data-valid', 'required');
                    $(this).find("input[id^='PValue']").attr('data-valid-msg', 'Primary value can not be blank');
                    ////23-11-2017
                    $(this).find("span[id^='Remarks']").css("white-space", "pre-wrap")
                });


            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }
        });
        setTimeout(function () {
            $('#AwbFlightDate').closest('tr').find("span").css("display", "block");
        }, 100)
    }

}
function ImportAutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, ShipmentDetailArray, cityChangeFlag, Remarks) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = importGetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, ShipmentDetailArray, cityChangeFlag, Remarks);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
                dataSource: dataSource,
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: '<span>#: TemplateColumn #</span>',
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd
            });
        }
    }
}
var dourlimport = 'Services/AutoCompleteService.svc/ImportESSFBLAutoCompleteDataSource';
function importGetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, ShipmentDetailArray, cityChangeFlag, Remarks) {

    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? dourlimport : serviceurl + newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    awbSNo: awbSNo,
                    chargeTo: chargeTo,
                    cityCode: cityCode,
                    movementType: movementType,
                    hawbSNo: hawbSNo,
                    loginSNo: loginSNo,
                    ShipmentDetailArray: ShipmentDetailArray,
                    cityChangeFlag: cityChangeFlag,
                    Remarks: "RSH=" + ($("#rushhandling").is(':checked') ? 1 : 0),
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    if (filter == false) {
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
    });
    return dataSource;
}

function BindChargesItemAutoComplete(elem, mainElem) {
    var TransactionTypesno = $('#BillToSNo').val().split('-')[1];
    var hawb = 0;
    var SPHCTransSNo = 0;
    var ShipmentDetailArray = [];
    var pieces = 0;
    var grossWt = 0;
    var VolumeWeight = 0;
    var partNumber = 0;
    var IsRushHandling = "RSH=" + ($("#rushhandling").is(':checked') ? 1 : 0);

    pieces = $('#pieces').val()
    grossWt = $('#grwt').val()
    VolumeWeight = $('#chweight').val()

    var ShipmentDetailViewModel = {
        PartNumber: Number(partNumber) + 1,
        AWBSNo: $('#AWB').val() || 0,
        HAWBSNo: hawb || 0,
        PartSNo: $('#AwbFlightNo').val() || 0,
        Pieces: pieces || 0,
        GrossWeight: grossWt || 0,
        VolumeWeight: VolumeWeight || 0,
        IsBUP: 0,
        SPHCSNo: 0,
        SPHCTransSNo: SPHCTransSNo || 0
    };
    ShipmentDetailArray.push(ShipmentDetailViewModel);


    if ($('#MovementType').val() == '2') {
        $(elem).find("input[id^='ChargeName']").each(function () {

            //  AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE_Ess", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
            //  AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE_Ess_Export", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE_Ess_Export", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", $('#chweight').val() == "" ? 0 : $('#chweight').val(), $('#grwt').val() == "" ? 0 : $('#grwt').val(), $('#pieces').val() == "" ? 0 : $('#pieces').val(), IsRushHandling);

        });
    }
    else {
        $(elem).find("input[id^='ChargeName']").each(function () {

            //  AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE_Ess", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
            ImportAutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], ImportGatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound_EssImport", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, 1, hawb, "2", ShipmentDetailArray, "No", IsRushHandling);

        });
    }
    cfi.Numeric($(elem).find("input[id^='PValue']").attr("id"), 2);

    cfi.Numeric($(elem).find("input[id^='SValue']").attr("id"), 2);





    if (flags == 1) {
        $(elem).find("input[id^='PaymentMode']").each(function () {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
            $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
        });
    }
    else if (flags == 2) {
        $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
            $(elem).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(elem).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(elem).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 2;
        });
    }
    else {
        $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
            $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 0;
        });
    }
    $('#spnWaveOff').hide();
    $(elem).find("input[id^='WaveOff']").hide();
    $(elem).find("input[id^='PValue']").attr('data-valid', 'required');
    $(elem).find("input[id^='PValue']").attr('data-valid-msg', 'Primary value can not be blank');
    /*****************added by jitendra ,20 dec 2017, autocomplete charge popup ***/
    if (parseInt(TransactionTypesno) == 0) {
        if ($("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").is(':checked') == true) {
            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").prop('checked', true);
            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').prop('checked', false);
        }

        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').attr('disabled', true);

    }
    else if (parseInt(TransactionTypesno) == 1)//Credit Customer
    {
        if ($("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').is(':checked') == true) {
            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").prop('checked', false);
            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').prop('checked', true);
        }


        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').attr('disabled', false);
        //confirmation box

    }
    else if (parseInt(TransactionTypesno) == 2)//Cass Customer
    {
        if ($("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").is(':checked') == true) {
            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").prop('checked', true);
            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').prop('checked', false);
        }
        //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").find("input[id^='chkCash']").prop('checked', true);
        //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").find("input[id^='chkCredit']").prop('checked', false);
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').attr('disabled', true);

    }
    else if (parseInt(TransactionTypesno) == 3) {

        if ($("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").is(':checked') == true) {
            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").prop('checked', true);
            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').prop('checked', false);
        }

        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find('input[type="radio"][data-radioval*="CREDIT"]').attr('disabled', true);


    }

    /*****************end by jitendra ,20 dec 2017, autocomplete charge popup ***/
}

function ReBindChargesItemAutoComplete(elem, mainElem) {



    //$(elem).find("input[id^='ChargeName']").each(function () {
    //    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE_Ess", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
    //});


    //if (flags == 1) {
    //    $(elem).find("input[id^='PaymentMode']").each(function () {
    //        $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
    //        $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
    //    });
    //}
    //else if (flags == 2) {
    //    $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
    //        $(elem).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
    //        $(elem).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
    //        $(elem).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //        flags = 2;
    //    });
    //}
    //else {
    //    $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
    //        $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
    //        $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //        flags = 0;
    //    });
    //}


    $(elem).find("input[id^='SBasis']").each(function (i, row) {
        if ($(elem).find("span[id^='SBasis']").text() == '') {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
        }
        else {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
        }
        $(elem).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
    });
    $('#spnWaveOff').hide();
    $(elem).find("input[id^='WaveOff']").hide();
    $(elem).find("input[id^='PValue']").attr('data-valid', 'required');
    $(elem).find("input[id^='PValue']").attr('data-valid-msg', 'Primary value can not be blank');
}

function calculateAmount(id) {

    var idvalIndex = id.id.split('_')[2]
    //var lstItem = [];
    //    var r = {

    //        TariffSNo: $('#tblIssueDetail_HdnServiceName_' + idvalIndex + '').val(),
    //        PaymentType: $('input:radio[name=tblIssueDetail_RbtnPaymentType_' + idvalIndex + ']:checked').val(),
    //        PrimaryValue: $('#tblIssueDetail_PrimaryValue_' + idvalIndex ).val() == '' ? '0' : $('#tblIssueDetail_PrimaryValue_' + idvalIndex ).val(),
    //        SecondaryValue: $('#tblIssueDetail_SecondaryValue_' + idvalIndex ).val() == '' ? '0' : $('#tblIssueDetail_SecondaryValue_' + idvalIndex ).val()
    //    }
    //    lstItem.push(r);


    var obj = {
        MomvementType: $('#MovementType').val(),
        Type: $('#Type').val(),
        TypeValue: $('#AWB').val(),
        BillTo: $("#BillTo").val() == '' ? '0' : $('#BillTo').val(),
        BillToSNo: $('#BillToSNo').val() == '' ? '0' : $('#BillToSNo').val().split('-')[0],
        FlightDate: $('#Date').val(),
        TariffSNo: $('#tblIssueDetail_HdnServiceName_' + idvalIndex + '').val(),
        PrimaryValue: $('#tblIssueDetail_PrimaryValue_' + idvalIndex).val() == '' ? '0' : $('#tblIssueDetail_PrimaryValue_' + idvalIndex).val(),
        SecondaryValue: $('#tblIssueDetail_SecondaryValue_' + idvalIndex).val() == '' ? '0' : $('#tblIssueDetail_SecondaryValue_' + idvalIndex).val()
        // LstESSCharges: lstItem
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetESSChargesTotal",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data > 1) {
                $('#tblIssueDetail_Amount_' + idvalIndex).text(data);

                $('#tblIssueDetail_hdnAmount_' + idvalIndex).val(data);
            }
            else {
                $('#tblIssueDetail_Amount_' + idvalIndex).text('0');

                $('#tblIssueDetail_hdnAmount_' + idvalIndex).val('0');
            }

        }
    });
    calculateTotalCash();
}
function onchangeservicename(id, val) {

    var index = id.split('_')[2];
    var ss = $('#tblIssueDetail_ServiceName_1').val();
    if ($('#tblIssueDetail_ServiceName_' + index).val() != '') {
        var serviceName = val.split('[')[1].split(']')[0];
        if (serviceName.split('-').length > 1) {

            $('#tblIssueDetail_PrimaryValue_' + index).val('');
            $('#tblIssueDetail_SecondaryValue_' + index).val('');

            $('#_temptblIssueDetail_PrimaryValue_' + index).val('');
            $('#_temptblIssueDetail_SecondaryValue_' + index).val('');

            $('#tblIssueDetail_lblPrimaryValue_' + index).text('');
            $('#tblIssueDetail_lblSecondaryValue_' + index).text('');
            $('#tblIssueDetail_lblPrimaryValue_' + index).text(serviceName.split('-')[0]);
            $('#tblIssueDetail_lblSecondaryValue_' + index).text(serviceName.split('-')[1]);
            $('#tableSecondaryValue' + index).show();
        } else {
            $('#_temptblIssueDetail_PrimaryValue_' + index).val('');
            $('#_temptblIssueDetail_SecondaryValue_' + index).val('');
            $('#tblIssueDetail_PrimaryValue_' + index).val('');
            $('#tblIssueDetail_SecondaryValue_' + index).val('');

            $('#tblIssueDetail_lblPrimaryValue_' + index).text('');
            $('#tblIssueDetail_lblSecondaryValue_' + index).text('');
            $('#tblIssueDetail_lblPrimaryValue_' + index).text(serviceName.split('-')[0])

            $('#tableSecondaryValue' + index).hide();
        }
    }

}

//$(".btn-success").unbind("click").bind("click", function () {
$(".btn-success").click(function () {
    _callBack();
});
$(".btn-success").off().on('click', function () {
    //  $("input[name^='operation']").attr('disabled', true)
    //$(this).attr("disabled", true)
    if (!cfi.IsValidForm()) {
        return false;
    }

    if ($('#tblIssueDetail_rowOrder').val() == '' || $('#tblIssueDetail_rowOrder').val() == 0) {
        ShowMessage('warning', 'Warning ', "Select at least one ESS .", "bottom-right");
        $("input[name^='operation']").attr('disabled', false)
        return false;
    }



    var HandlingChargeArray = [];
    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
        //if ($(this).find("[id^='PValue']").val() != "") {
        var HandlingChargeViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol']").html(),
            AWBSNo: $('#AWB').val(),
            WaveOff: 0,
            TariffCodeSNo: $(this).find("[id^='ChargeName']").val() == "" ? "0" : $(this).find("[id^='ChargeName']").val(),
            TariffHeadName: $(this).find("[id^='Text_ChargeName']").val() == "" ? "" : $(this).find("[id^='Text_ChargeName']").val(),
            pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
            sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
            Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
            Discount: 0,
            //  DiscountPercent: parseFloat($(this).find("[id^='DiscountPercent']").val() || "0.00").toFixed(3),
            DiscountPercent: 0,
            TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text() == "" ? 0 : $(this).find("[id^='TotalTaxAmount']").text(),
            TotalAmount: $(this).find("[id^='TotalAmount']").text() == "" ? 0 : $(this).find("[id^='TotalAmount']").text(),
            Rate: $(this).find("[id^='Rate']").val() == "" ? "0" : $(this).find("[id^='Rate']").val(),
            Min: 1,
            Mode: $(this).find("[id^='PaymentMode']:checked").val(),
            ChargeTo: $("#Text_BillToSNo").data("kendoAutoComplete").key().split('-')[0],
            pBasis: $(this).find("[id^='PBasis']").text() == "" ? "" : $(this).find("[id^='PBasis']").text(),
            sBasis: $(this).find("[id^='SBasis']").text() == "" ? "" : $(this).find("[id^='SBasis']").text(),
            Remarks: $(this).find("[id^='Remarks']")[1].innerText == undefined ? "" : btoa($(this).find("[id^='Remarks']")[1].innerText.toUpperCase()),
            WaveoffRemarks: '',
            DescriptionRemarks: $(this).find("span[id^='_DescriptionRemarks_']").text() || "",
            TaxPercent: $(this).find("span[id^='_TaxPercent_']").text() || 0,
        };
        if ($(this).find("[id^='PaymentMode']:checked").val() == 0) {
            C = 1;
        }
        HandlingChargeArray.push(HandlingChargeViewModel);

        // }

    });

    if (HandlingChargeArray.length == "0") {
        ShowMessage('warning', 'Warning ', "Select at least one ESS .", "bottom-right");
        $("input[name^='operation']").attr('disabled', false)
        return false;
    }


    var obj = {
        MomvementType: $('#MovementType').val(),
        Type: $('#Type').val(),
        TypeValue: $('#AWB').val(),
        BillTo: $("#BillTo").val() == '' ? '0' : $('#BillTo').val(),
        BillToSNo: $('#BillToSNo').val() == '' ? '0' : $('#BillToSNo').val().split('-')[0],
        FlightDate: $('#Date').val(),
        BillToAgentName: $("#BillToAgentName").val(),
        ShipperName: $("#ShipperName").val(),
        Process: $("#Process").val(),
        SubProcess: $("#SubProcess").val(),
        LstDOHandlingCharges: HandlingChargeArray
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/CreateESSCharges",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $("input[name^='operation']").attr('disabled', true)
        },
        success: function (data) {
            $("input[name^='operation']").attr('disabled', false)
            if (data.split('?')[0].trim() == "1") {
                $("input[name^='operation']").attr('disabled', false)
                ShowMessage('warning', 'Warning - ESS Charges', data.split('?')[1], "bottom-right");
                return
            } else if (data != "") {
                ShowMessage('success', 'Success!', "ESS Charge Applied Successfully for Invoice " + data + "");
                $("input[name='operation']").prop('type', 'button');
                setTimeout(function () {
                    if (C == 1) {

                        //$.ajax({
                        //    url: 'HtmlFiles/Shipment/SearchShipmentInvoice.html',
                        //    success: function (result) {
                        //        $('#aspnetForm').on('submit', function (e) {
                        //            e.preventDefault();
                        //        });
                        //        $('#tbl').html('');
                        //        $('#aspnetForm').append(result);

                        //        //LoadFlightvalidation();
                        //        //$("#PrintDiv").hide();
                        //        //$("#ApprovedPanel").hide();
                        //        //$("#ApprovedPanelRemarks").hide();
                        //        //$('input[type="radio"][value=Pending]').attr('checked', true);

                        //    }
                        //})
                        navigateUrl('Default.cshtml?Module=Shipment&Apps=Payment&FormAction=NEW&invoiceno=ESS&data=' + data + '');
                        // cfi.ShowIndexViewV2("divDeliveryOrderDetails", "../Services/Shipment/PaymentService.svc/GetGridData", InvoiceSearch);
                    }
                        //  navigateUrl('Default.cshtml?Module=Shipment&Apps=Payment&FormAction=NEW');
                    else
                        navigateUrl('Default.cshtml?Module=Report&Apps=WorkOrder&FormAction=INDEXVIEW');
                }, 500)
            } else {
                ShowMessage('warning', 'Warning - ESS Charges', "Record Not Saved Please Try Again ", "bottom-right");
                $("input[name^='operation']").attr('disabled', false)
                return
            }

        },
        error: function (xhr) {
            $("input[name^='operation']").attr('disabled', false)


        },
        complete: function () {
            $("input[name^='operation']").attr('disabled', true)
        }
    });


});

function ImportGatValueOfAutocomplete(valueId, value, keyId, key) {
    var IsRushHandling = "RSH=" + ($("#rushhandling").is(':checked') ? 1 : 0);
    pValue = 0;
    sValue = 0;
    rowId = valueId.split("_")[2];
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if (ValidateExistingCharges(valueId, value, keyId, key)) {
        if (value != "") {
            if ($("input[id^='Text_HAWB']").length > 0) {
                var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
            }
            else
                var hawbSNo = 0;

            if ($("#Text_MovementType").val() == "") {
                ShowMessage('warning', '', "Select Movement Type");
                $("#" + valueId).val('');
                return false;
            }
            var hawb = 0;
            var SPHCTransSNo = 0;
            var ShipmentDetailArray = [];
            var pieces = 0;
            var grossWt = 0;
            var VolumeWeight = 0;
            var partNumber = 0;


            pieces = $('#pieces').val()
            grossWt = $('#grwt').val()
            VolumeWeight = $('#chweight').val()
            var ShipmentDetailViewModel = {
                PartNumber: Number(partNumber) + 1,
                AWBSNo: $('#AWB').val() || 0,
                HAWBSNo: hawb || 0,
                PartSNo: $('#AwbFlightNo').val() || 0,
                Pieces: pieces || 0,
                GrossWeight: grossWt || 0,
                VolumeWeight: VolumeWeight || 0,
                IsBUP: 0,
                SPHCSNo: 0,
                SPHCTransSNo: SPHCTransSNo || 0
            };
            ShipmentDetailArray.push(ShipmentDetailViewModel);
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/GetCharges_Ess_Import", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TariffSNo: parseInt(key), AWBSNo: $('#AWB').val(), CityCode: userContext.CityCode, HAWBSNo: hawb, ProcessSNo: parseInt(22), SubProcessSNo: parseInt(2135), GrWT: parseFloat(grossWt), ChWt: parseFloat(VolumeWeight), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling, POMailSNo: parseInt(currentPomailSno) }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : ((doItem.pValue == "" || doItem.pValue == undefined) ? 0 : doItem.pValue));
                            $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : ((doItem.pValue == "" || doItem.pValue == undefined) ? 0 : doItem.pValue));
                            $("span[id='PBasis']").text(doItem.PrimaryBasis);
                            if (value.split('-')[0].toUpperCase() == "MISC") {
                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").attr('readonly', false);
                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").attr('readonly', false);
                            }
                            else {
                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").attr('readonly', true);
                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").attr('readonly', true);
                            }
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").val(0);
                            }
                            else {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : ((doItem.sValue == "" || doItem.sValue == undefined) ? 0 : doItem.sValue));
                                $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : ((doItem.sValue == "" || doItem.sValue == undefined) ? 0 : doItem.sValue));
                                $("span[id='SBasis']").text(doItem.SecondaryBasis);
                            }
                            if (doItem.Rate == undefined || doItem.Rate == "" || doItem.Rate == 0.00 || doItem.Rate == 0 || doItem.Rate == 0.000) {
                                $("input[id='Rate']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                                $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").attr('readonly', false);
                                $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").val(0);
                                $("input[id='Rate']").closest("td").find("input[id^='Rate']").val(0);
                                rate = 1;
                            }
                            else {
                                $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").val(((doItem.Rate == "" || doItem.Rate == undefined) ? 0 : doItem.Rate));
                                $("input[id='Rate']").closest("td").find("input[id^='Rate']").val(((doItem.Rate == "" || doItem.Rate == undefined) ? 0 : doItem.Rate));
                                if (value.split('-')[0].toUpperCase() == "MISC") {

                                    $("input[id='Rate']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                                    $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").attr('readonly', false);
                                }
                                else {
                                    $("input[id='Rate']").closest("td").find("input[id^='Rate']").attr('readonly', true);
                                    $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").attr('readonly', true);
                                }
                                rate = 0;
                            }
                            $("span[id='Amount']").text(doItem.ChargeAmount);
                            $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id='Remarks']").text(doItem.ChargeRemarks);
                            $("span[id='Remarks']").css("white-space", "pre-wrap")
                            if (doItem.PrimaryBasis == 'KG' && (doItem.pValue == undefined || doItem.pValue == '' || doItem.pValue == 0.00 || doItem.pValue == 0.000 || doItem.pValue == 0)) {
                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(weight);
                                $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").focus();
                            }
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
                            $("input[id^='DescriptionRemarks']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_>" + doItem.DescriptionRemarks + "</span>");
                            $("input[id^='DescriptionRemarks']").closest('td').css('display', 'none')
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : ((doItem.pValue == "" || doItem.pValue == undefined) ? 0 : doItem.pValue));
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : ((doItem.pValue == "" || doItem.pValue == undefined) ? 0 : doItem.pValue));
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            $("input[id^='DescriptionRemarks_" + rowId + "']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_" + rowId + ">" + doItem.DescriptionRemarks + "</span>");
                            $("input[id^='DescriptionRemarks_" + rowId + "']").closest('td').css('display', 'none')
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").val(0);
                            }
                            else {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : ((doItem.sValue == "" || doItem.sValue == undefined) ? 0 : doItem.sValue));
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : ((doItem.sValue == "" || doItem.sValue == undefined) ? 0 : doItem.sValue));
                                $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            }
                            if (doItem.Rate == undefined || doItem.Rate == "" || doItem.Rate == 0.00 || doItem.Rate == 0 || doItem.Rate == 0.000) {
                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").attr('readonly', false);
                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").val(0);
                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").val(0);
                                rate = 1;
                            }
                            else {
                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").val(((doItem.Rate == "" || doItem.Rate == undefined) ? 0 : doItem.Rate));
                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").val(((doItem.Rate == "" || doItem.Rate == undefined) ? 0 : doItem.Rate));
                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', true);
                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").attr('readonly', true);
                                rate = 0;
                            }
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                            $("span[id^='Remarks_" + rowId + "']").css("white-space", "pre-wrap")
                            if (doItem.PrimaryBasis == 'KG' && doItem.pValue == '') {
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(weight);
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").focus();
                            }
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").focus();
                        }
                    }

                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                        if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                            $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                            $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                        }
                    });
                    totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                    $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
                    if (rowId == undefined) {
                        if ($("#UserRemark").length == 0)
                            $("span[id='Remarks']").after('<span style="padding-left:50px;"><input type="text" name="UserRemark" id="UserRemark" placeholder="USER REMARK" controltype="alphanumericupper" maxlength="150" data-role="alphabettextbox" style="width: 150px; text-transform: uppercase;"></span>');
                        if (key == MISCSNo) {
                            $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").val('');
                            $("input[id='Rate']").closest("td").find("input[id^='Rate']").val('');
                        }
                    } else {
                        if ($("#UserRemark_" + rowId).length == 0) {
                            $("span[id^='Remarks_" + rowId + "']").after('<span style="padding-left:50px;"><input type="text" name="UserRemark" id="UserRemark_' + rowId + '" placeholder="USER REMARK" controltype="alphanumericupper" maxlength="150" data-role="alphabettextbox" style="width: 150px; text-transform: uppercase;"></span>');
                            $("span[id^='Remarks_" + rowId + "']").css("white-space", "pre-wrap")
                        }
                        if (key == MISCSNo) {
                            $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").val('');
                            $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").val('');
                        }
                    }
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
    if (rowId == undefined) {
        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").focus();
        //$("span[id='SBasis']").closest("td").find("input[id^='SValue']").blur();
    }
    else {
        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").focus();
        //  $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").blur();
    }
}

/* added by jitendra ,09 dec 2017*/
function getNonObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getNonObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

var pValue = 0;
var sValue = 0;
function GatValueOfAutocomplete(valueId, value, keyId, key) {




    var IsRushHandling = "RSH=" + ($("#rushhandling").is(':checked') ? 1 : 0);
    pValue = 0;
    sValue = 0;
    rowId = valueId.split("_")[2];
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if (ValidateExistingCharges(valueId, value, keyId, key)) {
        if (value != "") {
            if ($("input[id^='Text_HouseAwbNo']").length > 0) {
                var hawbSNo = $("input[id^='Text_HouseAwbNo']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HouseAwbNo']").data("kendoAutoComplete").key() : 0;
            }
            else
                var hawbSNo = 0;

            if ($("#Text_MovementType").val() == "") {
                ShowMessage('warning', '', "Select Movement Type");
                $("#" + valueId).val('');
                return false;
            }
            var GrWT = $('#grwt').val() == "" ? 0 : $('#grwt').val()
            var chweight = $('#chweight').val() == "" ? 0 : $('#chweight').val()
            var pieces = $('#pieces').val() == "" ? 0 : $('#pieces').val()
            var VolWt = $('#VolWt').val() == "" ? 0 : $('#VolWt').val()

            $.ajax({

                url: "Services/Tariff/ESSChargesService.svc/GetExportESSHandlingCharges?AWBSNo=" + parseInt(($("#AWB").val() == '' ? 0 : $("#AWB").val())) + "&HAWBSNo=" + hawbSNo + "&GrWT=" + GrWT + "&ChWt=" + chweight + "&Pieces=" + pieces + "&IsRushHandling=" + IsRushHandling, async: false, type: "get", dataType: "json", cache: false,

                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    /* added by jitendra ,09 dec 2017*/
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
                        if (valueId == $(this).find("input[id^='Text_ChargeName']").attr("id")) {
                            if (valueId == "") {
                                $(this).find("input[id^='Amount']").val("0");
                                $(this).find("span[id^='TotalAmount']").html("");
                                $(this).find("input[id^='TotalAmount']").val("");
                            }
                            else {
                                var obj = $(this);
                                var doCharges = resData.Table0;
                                if (doCharges.length > 0) {
                                    var doItem = getNonObjects(resData.Table0, 'TariffSNo', key);
                                    if (doItem.length > 0) {
                                        if (rowId == undefined) {
                                            $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : ((doItem[0].pValue == "" || doItem[0].pValue == undefined) ? 0 : doItem[0].pValue));
                                            $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : ((doItem[0].pValue == "" || doItem[0].pValue == undefined) ? 0 : doItem[0].pValue));
                                            $("span[id='PBasis']").text(doItem[0].PrimaryBasis);
                                            if (value.split('-')[0].toUpperCase() == "MISC") {
                                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").attr('readonly', false);
                                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").attr('readonly', false);
                                            }
                                            else {
                                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").attr('readonly', true);
                                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").attr('readonly', true);
                                            }

                                            if (doItem[0].SecondaryBasis == undefined || doItem[0].SecondaryBasis == "") {
                                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").val(0);
                                            }
                                            else {
                                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                                $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : ((doItem[0].sValue == "" || doItem[0].sValue == undefined) ? 0 : doItem[0].sValue));
                                                $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : ((doItem[0].sValue == "" || doItem[0].sValue == undefined) ? 0 : doItem[0].sValue));
                                                $("span[id='SBasis']").text(doItem[0].SecondaryBasis);
                                                if (value.split('-')[0].toUpperCase() == "MISC") {
                                                    $("span[id='SBasis']").closest("td").find("input[id^='SValue']").attr('readonly', false);
                                                    $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").attr('readonly', false);
                                                }
                                                else {
                                                    $("span[id='SBasis']").closest("td").find("input[id^='SValue']").attr('readonly', true);
                                                    $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").attr('readonly', true);
                                                }

                                            }
                                            if (doItem[0].Rate == undefined || doItem[0].Rate == "" || doItem[0].Rate == 0.00 || doItem[0].Rate == 0 || doItem[0].Rate == 0.000) {
                                                $("input[id='Rate']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                                                $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").attr('readonly', false);
                                                $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").val(0);
                                                $("input[id='Rate']").closest("td").find("input[id^='Rate']").val(0);
                                                rate = 1;
                                            }
                                            else {
                                                $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").val(((doItem[0].Rate == "" || doItem[0].Rate == undefined) ? 0 : doItem[0].Rate));
                                                $("input[id='Rate']").closest("td").find("input[id^='Rate']").val(((doItem[0].Rate == "" || doItem[0].Rate == undefined) ? 0 : doItem[0].Rate));
                                                if (value.split('-')[0].toUpperCase() == "MISC") {
                                                    $("input[id='Rate']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                                                    $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").attr('readonly', false);
                                                }
                                                else {
                                                    $("input[id='Rate']").closest("td").find("input[id^='Rate']").attr('readonly', true);
                                                    $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").attr('readonly', true);
                                                }

                                                rate = 0;
                                            }
                                            $("input[id^='TaxPercent']").closest('td').append("&nbsp;&nbsp;<span id=_TaxPercent_" + rowId + " style='display:none'>" + doItem[0].TaxPercent + "</span>");

                                            $("span[id='Amount']").text(doItem[0].ChargeAmount);
                                            $("span[id='TotalTaxAmount']").text(doItem[0].TotalTaxAmount);
                                            $("span[id='TotalAmount']").text(doItem[0].TotalAmount);
                                            $("span[id='Remarks']").text(doItem[0].ChargeRemarks);
                                            if (doItem[0].PrimaryBasis == 'KG' && (doItem[0].pValue == undefined || doItem[0].pValue == '' || doItem[0].pValue == 0.00 || doItem[0].pValue == 0.000 || doItem[0].pValue == 0)) {
                                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(weight);
                                                $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").focus();
                                            }
                                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
                                            $("input[id^='DescriptionRemarks']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_>" + doItem[0].DescriptionRemarks + "</span>");
                                            $("input[id^='DescriptionRemarks']").closest('td').css('display', 'none')
                                        }
                                        else {
                                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : ((doItem[0].pValue == "" || doItem[0].pValue == undefined) ? 0 : doItem[0].pValue));
                                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : ((doItem[0].pValue == "" || doItem[0].pValue == undefined) ? 0 : doItem[0].pValue));
                                            $("span[id^='PBasis_" + rowId + "']").text(doItem[0].PrimaryBasis);
                                            if (value.split('-')[0].toUpperCase() == "MISC") {
                                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").attr('readonly', false);
                                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").attr('readonly', false);
                                            }
                                            else {
                                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").attr('readonly', true);
                                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").attr('readonly', true);
                                            }
                                            $("input[id^='DescriptionRemarks_" + rowId + "']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_" + rowId + ">" + doItem[0].DescriptionRemarks + "</span>");
                                            $("input[id^='DescriptionRemarks_" + rowId + "']").closest('td').css('display', 'none')
                                            if (doItem[0].SecondaryBasis == undefined || doItem[0].SecondaryBasis == "") {
                                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").val(0);
                                            }
                                            else {
                                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : ((doItem[0].sValue == "" || doItem[0].sValue == undefined) ? 0 : doItem[0].sValue));
                                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : ((doItem[0].sValue == "" || doItem[0].sValue == undefined) ? 0 : doItem[0].sValue));
                                                $("span[id^='SBasis_" + rowId + "']").text(doItem[0].SecondaryBasis);
                                            }
                                            if (doItem[0].Rate == undefined || doItem[0].Rate == "" || doItem[0].Rate == 0.00 || doItem[0].Rate == 0 || doItem[0].Rate == 0.000) {
                                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").attr('readonly', false);
                                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").val(0);
                                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").val(0);
                                                rate = 1;
                                                if (value.split('-')[0].toUpperCase() == "MISC") {
                                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").attr('readonly', false);
                                                }
                                                else {
                                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', true);
                                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").attr('readonly', true);
                                                }
                                            }
                                            else {
                                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").val(((doItem[0].Rate == "" || doItem[0].Rate == undefined) ? 0 : doItem[0].Rate));
                                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").val(((doItem[0].Rate == "" || doItem[0].Rate == undefined) ? 0 : doItem[0].Rate));
                                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', true);
                                                $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").attr('readonly', true);
                                                rate = 0;
                                                if (value.split('-')[0].toUpperCase() == "MISC") {
                                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").attr('readonly', false);
                                                }
                                                else {
                                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', true);
                                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").attr('readonly', true);
                                                }
                                            }
                                            $("span[id^='Amount_" + rowId + "']").text(doItem[0].ChargeAmount);
                                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem[0].TotalTaxAmount);
                                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem[0].TotalAmount);
                                            $("span[id^='Remarks_" + rowId + "']").text(doItem[0].ChargeRemarks);
                                            $("span[id^='Remarks_" + rowId + "']").css("white-space", "pre-wrap")
                                            if (doItem[0].PrimaryBasis == 'KG' && doItem[0].pValue == '') {
                                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(weight);
                                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").focus();
                                            }
                                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").focus();
                                        }
                                    }
                                }
                            }

                            $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                                totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                                if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                                    $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                                    $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                                }
                            });
                            totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                            $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
                            if (rowId == undefined) {
                                if ($("#UserRemark").length == 0)
                                    $("span[id='Remarks']").after('<span style="padding-left:50px;"><input type="text" name="UserRemark" id="UserRemark" placeholder="USER REMARK" controltype="alphanumericupper" maxlength="150" data-role="alphabettextbox" style="width: 150px; text-transform: uppercase;"></span>');
                                if (key == MISCSNo) {
                                    $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").val('');
                                    $("input[id='Rate']").closest("td").find("input[id^='Rate']").val('');
                                }
                            } else {
                                if ($("#UserRemark_" + rowId).length == 0) {
                                    $("span[id^='Remarks_" + rowId + "']").after('<span style="padding-left:50px;"><input type="text" name="UserRemark" id="UserRemark_' + rowId + '" placeholder="USER REMARK" controltype="alphanumericupper" maxlength="150" data-role="alphabettextbox" style="width: 150px; text-transform: uppercase;"></span>');
                                    $("span[id^='Remarks_" + rowId + "']").css("white-space", "pre-wrap")
                                }
                                if (key == MISCSNo) {
                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").val('');
                                    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").val('');
                                }
                            }
                        }
                    });
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
    if (rowId == undefined) {
        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").focus();
        //$("span[id='SBasis']").closest("td").find("input[id^='SValue']")._blur();
    }
    else {
        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").focus();
        // $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']")._blur();
    }
}

var dourl = 'Services/AutoCompleteService.svc/ExportESSWMSFBLAutoCompleteDataSource';
function GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, GrWT, Pieces, cityChangeFlag) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? dourl : serviceurl + newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    awbSNo: awbSNo,
                    chargeTo: chargeTo,
                    cityCode: cityCode,
                    movementType: movementType,
                    hawbSNo: hawbSNo,
                    loginSNo: loginSNo,
                    chWt: chWt,
                    GrWT: GrWT,
                    Pieces: Pieces,
                    cityChangeFlag: cityChangeFlag
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    if (filter == false) {
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
    });
    return dataSource;
}

function PutColoninStartRange(obj) {
    var s = $("#" + obj.id).val().length
    if (s == 3) {
        if (obj.id == "Text_AWB")
            $("#" + obj.id).val($("#" + obj.id).val() + '-');
    }
}

function calculateTotalCash() {
    var strData;
    var cash = 0, credit = 0;
    var res = $("#tblIssueDetail tr[id^='tblIssueDetail']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblIssueDetail');

    var data = JSON.parse(($('#tblIssueDetail').appendGrid('getStringJson')));


    for (var num = 0; num < data.length; num++) {
        if (data[num].PaymentType == 0) {
            cash = parseFloat(cash) + parseFloat(data[num].hdnAmount);
        } else if (data[num].PaymentType == 1) {
            credit = parseFloat(credit) + parseFloat(data[num].hdnAmount);
        }
    }

    $('#spntotalcredit').text(credit);
    $('#spntotalcash').text(cash);

}


function ExtraCondition(textId) {

    var filter = cfi.getFilter("AND");

    if (textId == "Text_AWB") {
        try {

            if ($('#Type').val() == 'AWB') {
                //cfi.setFilter(filterEmbargo, "DestinationAirport", "eq", userContext.CityCode)
                //cfi.setFilter(filter, "AWBTYPE", "eq", $("#MovementType").val())
                cfi.setFilter(filter, "MovementTypeSNo", "eq", $("#MovementType").val())
                if ($("#MovementType").val() != "3") {
                    cfi.setFilter(filter, "AirportCode", "eq", userContext.CityCode)
                }

            }

            var fileterAWB = cfi.autoCompleteFilter([filter]);
            return fileterAWB;
        }
        catch (exp)
        { }



    }
    if (textId == "Text_ExSHIPPER") {
        try {

            if ($("#MovementType").val() == "2") {
                cfi.setFilter(filter, "CustomerTypeSNo", "eq", 9)
            }
            var fileterAWB = cfi.autoCompleteFilter([filter]);
            return fileterAWB;
        }
        catch (exp)
        { }

    }
    if (textId == "Text_ExConsignee") {
        try {

            if ($("#MovementType").val() == "1") {
                cfi.setFilter(filter, "CustomerTypeSNo", "eq", 10)
            }
            var fileterAWB = cfi.autoCompleteFilter([filter]);
            return fileterAWB;
        }
        catch (exp)
        { }

    }


    if (textId == "Text_SubProcess") {

        try {

            cfi.setFilter(filter, "ProcessSno", "eq", $("#Process").val())
            var fileterAWB = cfi.autoCompleteFilter([filter]);
            return fileterAWB;
        }
        catch (exp)
        { }
    }


    //if (textId == 'Text_commodity') {
    //    cfi.setFilter(filter, "Sno", 'eq', $("#AWB").val());
    //    var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
    //    return ChargeAutoCompleteFilter;
    //}



    var x = textId.split('_')[2];
    if (x != undefined) {
        if (textId == 'Text_ChargeName_' + x) {
            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {

                if (x != i - 1) {
                    if ($('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val() != MISCSNo)
                        cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
                }
            });
            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return ChargeAutoCompleteFilter;
        }
    }
    else {
        if (textId == 'Text_ChargeName') {


            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {
                if (i != 0) {
                    if ($('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val() != MISCSNo)
                        cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
                }
            });
            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return ChargeAutoCompleteFilter;

        }
    }
    if (textId.indexOf("Text_Exdestination") >= 0) {

        cfi.setFilter(filter, "SNo", 'notin', $("#ExOrigin").val());
        var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return ChargeAutoCompleteFilter;

    }
    if (textId.indexOf("Text_ExOrigin") >= 0) {

        cfi.setFilter(filter, "SNo", 'notin', $("#Exdestination").val());
        var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return ChargeAutoCompleteFilter;
    }

    if (textId.indexOf("Text_AWBExdestination") >= 0) {

        cfi.setFilter(filter, "SNo", 'notin', $("#AWBExOrigin").val());
        var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return ChargeAutoCompleteFilter;

    }
    if (textId.indexOf("Text_AWBExOrigin") >= 0) {

        cfi.setFilter(filter, "SNo", 'notin', $("#AWBExdestination").val());
        var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return ChargeAutoCompleteFilter;
    }
    else if (textId.indexOf("Text_HouseAwbNo") >= 0) {
        var LocaWFilter = cfi.getFilter("AND");
        cfi.setFilter(LocaWFilter, "AWBSNo", "eq", $('#AWB').val());
        LocaFilter = cfi.autoCompleteFilter(LocaWFilter);
        return LocaFilter;

    }



}

function AutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, GrWT, Pieces, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, GrWT, Pieces, cityChangeFlag);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
                dataSource: dataSource,
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: '<span>#: TemplateColumn #</span>',
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd
            });
        }
    }
}

function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
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
        if (typeof attr !== 'undefined' && attr !== false) {
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
    //$("input[name='operation']").click(function () {
    //    if (cfi.IsValidSubmitSection()) {
    //      //  StartProgress();
    //        if ($(this).hasClass("removeop")) {
    //            $("#" + formid).trigger("submit");
    //        }
    //     //   StopProgress();
    //        return true;
    //    }
    //    else {
    //        return false
    //    }
    //});
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

function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");

                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").text("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").text("");
                $("span[id^='Amount_" + rowId + "']").text("");
                $("span[id^='TotalTaxAmount" + rowId + "']").text("");
                $("span[id^='TotalAmount_" + rowId + "']").text("");
                $("span[id^='Remarks" + rowId + "']").text("");
                $("span[id^='Remarks_" + rowId + "']").css("white-space", "pre-wrap")
                Flag = false;
            }
        }
    });
    return Flag;
}



function CheckCreditLimit(obj) {
    var TransactionTypesno = $('#BillToSNo').val().split('-')[1];
    $("#divWindowCash").dialog({
        autoResize: true,
        maxWidth: 250,
        maxHeight: 150,
        width: 250,
        height: 150,
        modal: true,
        title: 'Confirmation',
        draggable: false,
        resizable: false,
        autoOpen: false,
        buttons:
		{
		    'Yes': function () {
		        $(this).dialog('close');
		        $.ajax({

		        });


		    },
		    'No': function () {

		        $(this).dialog('close');

		    }
		}
    });
    if (obj.value == "0" && (parseInt(TransactionTypesno) == 1 || parseInt(TransactionTypesno) == 2)) {
        $('#divWindowCash').dialog('close');
        $("#Container").remove();
        $("#divWindowCash").remove();
        $('#divareaTrans_tariff_tariffdohandlingcharge').after("<div id='Container'>");
        $("#Container").append('<div id="divWindowCash" style="display:none;"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>Are you sure?To proceed payment with Cash.</b></td></tr></table></div>');

        $('#divWindowCash').css('display', 'block');
        $(obj).closest('tr').find('input[type="radio"][data-radioval*="CREDIT"]').attr('checked', false);
        $("#divWindowCash").dialog({
            autoResize: true,
            maxWidth: 250,
            maxHeight: 150,
            width: 250,
            height: 150,
            modal: true,
            title: 'Confirmation',
            draggable: false,
            resizable: false,
            autoOpen: false,
            buttons:
            {
                'Yes': function () {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CREDIT']").prop("checked", false);
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").prop("checked", true);

                    $(this).dialog('close');

                    //  CalculateTotalFBLAmount();


                },
                'No': function () {

                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CREDIT']").prop("checked", true);
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").prop("checked", false);

                    $(this).dialog('close');

                    //CalculateTotalFBLAmount();

                }
            }
        });
        $('#divWindowCash').dialog('open');
    }
    if (obj.value == "1" && (parseInt(TransactionTypesno) == 1 || parseInt(TransactionTypesno) == 2)) {
        $('#divWindowCash').dialog('close');
        $("#Container").remove();
        $("#divWindowCash").remove();
        $('#divareaTrans_tariff_tariffdohandlingcharge').after("<div id='Container'>");
        $("#Container").append('<div id="divWindowCash" style="display:none;"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>Are you sure?To proceed payment with Credit.</b></td></tr></table></div>');

        $('#divWindowCash').css('display', 'block');
        $(obj).closest('tr').find('input[type="radio"][data-radioval*="CREDIT"]').attr('checked', false);
        $("#divWindowCash").dialog({
            autoResize: true,
            maxWidth: 250,
            maxHeight: 150,
            width: 250,
            height: 150,
            modal: true,
            title: 'Confirmation',
            draggable: false,
            resizable: false,
            autoOpen: false,
            buttons:
            {
                'Yes': function () {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CREDIT']").prop("checked", true);
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").prop("checked", false);

                    $(this).dialog('close');

                    //  CalculateTotalFBLAmount();


                },
                'No': function () {

                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CREDIT']").prop("checked", false);
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[type='radio'][data-radioval^='CASH']").prop("checked", true);

                    $(this).dialog('close');

                    //CalculateTotalFBLAmount();

                }
            }
        });
        $('#divWindowCash').dialog('open');
        $(obj).closest('tr').find('input[type="radio"][data-radioval*="CASH"]').attr('checked', false);
    }
    //$('#divareaTrans_tariff_tariffdohandlingcharge').after("<div id='Container'>");
    //$("#Container").append('<div id="divWindowCash" style="display:none;"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>Are you sure?To proceed payment with credit.</b></td></tr></table></div>');

    if ($("#" + obj.id).closest('tr').find('[data-radioval^=CREDIT]').is(':checked') == true) {
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[data-radioval^='CREDIT']").prop("checked", true);
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[data-radioval^='CASH']").prop("checked", false);
    }
    else {
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[data-radioval^='CASH']").prop("checked", true);
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").find("input[data-radioval^='CREDIT']").prop("checked", false);
    }
    if ($("#BillTo").val() != 'Airline') {
        var total = 0;
        var value = ($("#" + obj.id + ":checked").val() == undefined ? ($("#" + obj.id).closest('tr').find('[id^=PaymentMode]:checked').val()) : $("#" + obj.id + ":checked").val());
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            if ($(this).find("[id^='PaymentMode']:checked").val() == 1)
                total = parseFloat(total) + parseFloat($(this).find("span[id^='Amount']").text());
        });
        //var total = $("#" + obj.id).closest('td').prev().prev().text();
        var BillToSNo = $("#BillToSNo").val();
        if (value == 1) {
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ BillToSNo: BillToSNo.split('-')[0], total: total }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    FinalData = dataTableobj.Table0;
                    if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                        //$("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        //    if ($(this).find("[id^='PaymentMode']:checked").val() == 1) {
                        //        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        //        //$(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        //    }
                        //    flags = 0;
                        //});

                        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(0).attr("checked", 'checked');
                        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
                        flags = 0;

                        if (FinalData[0].Column2 != '')
                            ShowMessage('warning', '', FinalData[0].Column2);
                    }
                    else {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            if ($(obj).closest('tr').index() == (i + 1)) {
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
                                flags = 0;
                            }
                        });
                    }
                }
            });
        }
    }
}

function CheckCreditLimitMode(obj) {
    //$("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
    //    $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
    //    $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //});
    if ($("#BillTo").val() != 'Airline') {
        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(0).attr("checked", 'checked');
        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
    }
    else {
        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).attr("checked", 'checked');
        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
    }
}

function CheckCreditBillToSNo(a, b, c, d) {
    var total = 0;
    var BillToSNo = $("#BillToSNo").val();
    if ($("#BillTo").val() != 'Airline') {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ BillToSNo: BillToSNo.split('-')[0], total: total }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        flags = 1;
                    });
                    ShowMessage('warning', '', FinalData[0].Column2);
                }
                else {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                        flags = 0;
                    });
                }
            }
        });
    }
    else {
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 2;
        });
    }
    if ($("#BillToSNo").val() == '')
        CheckWalkIn();
}

function CheckWalkIn() {
    var Sno = $("#AWB").val();
    var type = $("#Type").val();
    if ($("#AWB").val() != '') {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CheckWalkIn",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Sno: Sno, type: type }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                weight = FinalData[0].Column2;
                if (FinalData[0].Column4 == 'SAS') {
                    if ($("#Text_BillTo").val().toUpperCase() == 'AGENT') {
                        $("#ShipperName").val(FinalData[0].Column5);
                        $('#ShipperName').attr('readonly', true);

                        $("#Text_BillToSNo").val(FinalData[0].Column1);
                        $("#BillToSNo").val(FinalData[0].Column3);

                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                            $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                            //$(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                            //flags = 1;

                            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                            flags = 0;

                        });
                    }
                    else if ($("#Text_BillTo").val().toUpperCase() == 'AIRLINE') {
                        $("#ShipperName").val('');
                        $('#ShipperName').attr('readonly', true);
                        $("#Text_BillToSNo").val('');
                        $("#BillToSNo").val('');
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            //$(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                            //$(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                            //$(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                            //flags = 0;
                            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
                            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
                            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                            flags = 2;
                        });

                    }

                }
                else {

                    $("#ShipperName").val(FinalData[0].Column5);
                    $("#Text_BillToSNo").val(FinalData[0].Column1);
                    $("#BillToSNo").val(FinalData[0].Column3);

                    if ($("#MovementType").val() != "2") {
                        if (FinalData[0].Column1 != "") {
                            $('#ShipperName').attr('readonly', true);
                            $("#Text_BillToSNo").data("kendoAutoComplete").enable(false);
                        } else {
                            $('#ShipperName').attr('readonly', true);
                            $("#Text_BillToSNo").data("kendoAutoComplete").enable(true);
                        }
                    }


                }
            }
        });
    }

}

function GetTotalAmount(obj) {
    var total = 0;
    if ($(obj).closest("tr").find("[id^='ChargeName']").val() != MISCSNo) {
        if (rate == 1) {
            var r = parseFloat($("#" + obj.id).val()).toFixed(3);
            var p = parseFloat($("#" + obj.id.replace("Rate", "PValue")).val()).toFixed(3);
            var s = parseFloat($("#" + obj.id.replace("Rate", "SValue")).val()).toFixed(3);
            r = ((r == "" || r == undefined || r == "NaN") ? 0 : r);
            if (s != "0.000") {
                total = r * p * s;
            }
            else {
                total = r * p;
            }

            var remark = "Tariff SNo " + $("#" + obj.id.replace("Rate", "ChargeName")).val() + " ---- Charge : " + p + " " + $("#" + obj.id.replace("Rate", "PBasis")).closest('td').find("span[id^='PBasis']").text() + ((s == "" || s == undefined || s == "0.000") ? "" : (" * " + s + " " + $("#" + obj.id.replace("Rate", "SBasis")).closest('td').find("span[id^='SBasis']").text())) + " * " + r + " [Rate] =" + (Math.ceil(total)).toFixed(3) + " (Manual Rate)";
            $("#" + obj.id.replace("Rate", "Amount")).closest('td').find("span[id^='Amount']").text((Math.ceil(total)).toFixed(3));
            $("#" + obj.id.replace("Rate", "TotalAmount")).closest('td').find("span[id^='TotalAmount']").text((Math.ceil(total)).toFixed(3));
            $("#" + obj.id.replace("Rate", "Remarks")).closest('td').find("span[id^='Remarks']").text(remark);
        }
    }
    else {
        var r = parseFloat($("#" + obj.id).val()).toFixed(3);
        r = ((r == "" || r == undefined || r == "NaN") ? 0 : r);
        total = r;
        var remark = "Tariff SNo " + $("#" + obj.id.replace("Rate", "ChargeName")).val() + " ---- Charge : [Rate] =" + (Math.ceil(total)).toFixed(3) + " (Manual Rate)";
        $("#" + obj.id.replace("Rate", "Amount")).closest('td').find("span[id^='Amount']").text((Math.ceil(total)).toFixed(3));
        $("#" + obj.id.replace("Rate", "TotalAmount")).closest('td').find("span[id^='TotalAmount']").text((Math.ceil(total)).toFixed(3));
        $("#" + obj.id.replace("Rate", "Remarks")).closest('td').find("span[id^='Remarks']").text(remark);
    }
}

function GetMISCChargeSNo() {
    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetMISCChargeSNo",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ SNo: 0 }),
        async: false,
        type: 'get',
        cache: false,
        success: function (result) {
            var dataTableobj = JSON.parse(result);
            MISCSNo = dataTableobj.Table0[0].SNo == '' ? 0 : dataTableobj.Table0[0].SNo;
        }
    });
}

$(document).on('blur', '#NoofHouse', function (event) {
    $('#ADDHouse').attr('style', 'display:block;margin-left: 133px;margin-top: -18px;');


});
$(document).on('click', '#HawSave', function (event) {
    var count = $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").length;
    var hawwpieces = 0;
    var hawbweight = 0;
    var hawbvolume = 0;
    for (var k = 1; k <= count; k++)
    {
        hawwpieces += parseInt($("#tblAddhouse_hawPieces_" + k).val());
        hawbweight += parseFloat($("#tblAddhouse_hawGrossWt_" + k).val());
        hawbvolume += parseFloat($("#tblAddhouse_hawVolumeWt_" + k).val());
    }
    if ($('#NoofHouse').val() <= 1)
    {
       
        if ($("#Pieces").val() != $("#tblAddhouse_hawPieces_1").val()) {
            ShowMessage('warning', 'Warning - ESS', "Total Pieces and Hawb pieces should be equal in case of one house.! ", "bottom-right");
            return;
        }
    }
    if (parseFloat($("#Pieces").val()) < hawwpieces || hawwpieces < parseFloat($("#Pieces").val())) {
        ShowMessage('warning', 'Warning - ESS', "Please complete Total  house Pieces! ", "bottom-right");
        return;
    }
    if (parseFloat($("#GrossWt").val()) < hawbweight || hawbweight < parseFloat($("#GrossWt").val()))
    {
        ShowMessage('warning', 'Warning - ESS', "Please complete Total  house Weight! ", "bottom-right");
        return;
    }
    if (parseFloat($("#VolumeWt").val()) < hawbvolume || hawbvolume < parseFloat($("#VolumeWt").val()))
    {
        ShowMessage('warning', 'Warning - ESS', "Please complete Total  house Volume! ", "bottom-right");
        return;
    }
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='tblAddhouse_txthawbno_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please enter house AWB NO.! ", "bottom-right");
        return;
    }
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='tblAddhouse_hawPieces_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please enter  Pieces.! ", "bottom-right");
        return;
    }
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='tblAddhouse_hawGrossWt_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please enter  Gross Weight.! ", "bottom-right");
        return;
    }
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='tblAddhouse_hawVolumeWt_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please enter  Volume Weight.! ", "bottom-right");
        return;
    }
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='tblAddhouse_hawCBM_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please enter  CBM.! ", "bottom-right");
        return;
    }
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='tblAddhouse_hawChargeableWt_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please enter  ChargeableWt.! ", "bottom-right");
        return;
    }
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='tblAddhouse_hawExcommodity_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please select  commodity .! ", "bottom-right");
        return;
    }
    //if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='tblAddhouse_hawSHC_']").val() == "") {
    //    ShowMessage('warning', 'Warning - ESS', "Please select  SHC .! ", "bottom-right");
    //    return;
    //}
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='Text_tblAddhouse_hawExSHIPPER_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please select  SHIPPER .! ", "bottom-right");
        return;
    }
    if ($("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").find("input[id^='Text_tblAddhouse_hawExConsignee_']").val() == "") {
        ShowMessage('warning', 'Warning - ESS', "Please enter house AWB NO.! ", "bottom-right");
        return;
    }
    if ($('#NoofHouse').val() != $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").length)
    {
        ShowMessage('warning', 'Warning - ESS', "Please complete Total  house AWB NO.! ", "bottom-right");
        return;
    }
    var Flag =SaveAwbInformation()
    if (Flag == "1") {
        $("#AddNewAqb").dialog("close");
        BindGetEssAWBNo_Information()
    }

    if (Flag == "1") {
        var Type = $('#MovementType').val();
        var HawbArrylist = [];
        var countTable = $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").length;
        for (var i = 1; i <= countTable; i++) {
            var hawbInfo = {
                AwbSno:cuurentawbsno,
                Hawbno: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='tblAddhouse_txthawbno_" + i + "']").val(),
                hawPieces: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='tblAddhouse_hawPieces_" + i + "']").val(),
                hawGrossWt: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='tblAddhouse_hawGrossWt_" + i + "']").val(),
                hawVolumeWt: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='tblAddhouse_hawVolumeWt_" + i + "']").val(),
                hawCBM: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='tblAddhouse_hawCBM_" + i + "']").val(),
                hawChargeableWt: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='tblAddhouse_hawChargeableWt_" + i + "']").val(),
                hawExcommodity: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='tblAddhouse_hawExcommodity_" + i + "']").val(),
                hawSHC: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='tblAddhouse_hawSHC_" + i + "']").val(),
                hawExSHIPPER: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='Text_tblAddhouse_hawExSHIPPER_" + i + "']").val(),
                hawExConsignee: $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + i + "']").find("input[id^='Text_tblAddhouse_hawExConsignee_" + i + "']").val(),
            }

            HawbArrylist.push(hawbInfo);
        }
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/SaveHawbEssAWBNo_Information", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ strData: btoa(JSON.stringify({ lstEssHouseInfo: HawbArrylist ,Type:Type,NoofHouse:$('#NoofHouse').val()})) }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;

                if (FinalData[0].Message != "") {

                    ShowMessage('warning', 'Warning - HAWB ', 'Please Try after', "bottom-right");
                }
                else {
                    $("#AddNewAqb").dialog("close");
                    $("#AddNewHAWB").dialog("close");
                    $("div[id$='htmltableaddHawb']").html('')
                   
                    ShowMessage('success', 'Success - AWB No.', "AWB No.  -  Processed Successfully", "bottom-right");
                   

                }
            }
        });
    }
});
$(document).on('click', '#tblAddShipment_btnRemoveLast', function (event) {
    var countTable = $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").length;
    $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_" + countTable + "']").remove();
    if (countTable == "2") {
        $('#tblAddShipment_btnRemoveLast').hide();
    }
});
$(document).on('click', '#ADDHouse', function (event) {
    $("#AddNewHAWB table:not(#tblfooter,#tblehawb_1)").html('');
  //  $('#AddNewHAWB').closest('.ui-dialog').remove();
    if ($("#AWBCode").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please select AWB Code! ", "bottom-right");
        return;
    }
    if ($("#txtawbno").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter AWB No.! ", "bottom-right");
        return;
    }
    if ($("#txtawbnoDate").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter AWB Date! ", "bottom-right");
        return;
    }
    if ($("#AWBExOrigin").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  AWB Origin ! ", "bottom-right");
        return;
    }
    if ($("#AWBExdestination").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  AWB Destination ! ", "bottom-right");
        return;
    }

    if ($("#ExOrigin").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  Flight Origin ! ", "bottom-right");
        return;
    }

    if ($("#Exdestination").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  Flight Destination	 ! ", "bottom-right");
        return;
    }



    if ($("#ExAwbFlightDate").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Flight Date ! ", "bottom-right");
        return;
    }

    if ($("#Text_ExAwbFlightNo").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please select  Flight No ! ", "bottom-right");
        return;
    }
    if ($("#Text_FlightPrex").val() == "" || $("#Text_FlightPrex").val() == "0") {
        ShowMessage('warning', 'Warning - AWB', "Please enter  Flight No ! ", "bottom-right");
        return;
    }

    if ($("#Excarriercode").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  Carrier Code ! ", "bottom-right");
        return;
    }

    if ($("#Pieces").val() == "" || $("#Pieces").val() == "0") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Pieces ! ", "bottom-right");
        return;
    }
    if ($("#GrossWt").val() == "" || parseFloat($("#GrossWt").val()).toFixed(2) == "0.00") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Gr.Wt. ! ", "bottom-right");
        return;
    }

    if ($("#ChargeableWt").val() == "" || parseFloat($("#ChargeableWt").val()).toFixed(2) == "0.00") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Ch.Wt. ! ", "bottom-right");
        return;
    }

    if ($("#VolumeWt").val() == "" || parseFloat($("#VolumeWt").val()).toFixed(2) == "0.00") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Volume Wt. ! ", "bottom-right");
        return;
    }
    if ($("#CBM").val() == "" || parseFloat($("#CBM").val()).toFixed(2) == "0.00") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  CBM ! ", "bottom-right");
        return;
    }

    if ($("#Excommodity").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select Commodity ! ", "bottom-right");
        return;
    }
    if ($("#NoofHouse").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please enter House No ! ", "bottom-right");
        return;
    }
    if ($("#NoofHouse").val() == "0") {
        ShowMessage('warning', 'Warning - AWB', "Please enter valid House No ! ", "bottom-right");
        return;
    }
    $("#htmltableaddHawb").html("")
    $("#htmltableaddHawb").html(TableHawb)

    $("#htmltableaddHawb").append(TableHawbfooter)
    $('#tblAddShipment_btnRemoveLast').hide();
    if ($('#NoofHouse').val() == 1) {
        $("#tblAddhawb_btnAppendRow").hide();
    }
    cfi.AutoCompleteV2("tblAddhouse_hawExcommodity_1", "CommodityCode,CommodityDescription", "Reservation_Commodity", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("tblAddhouse_hawSHC_1", "CODE,Description", "Reservation_SPHC1", null, "contains", ",", null, null, null, null, true);
    cfi.AutoCompleteV2("tblAddhouse_hawExSHIPPER_1", "CustomerTypeSNo", "Acceptance_SHIPPER_AccountNo_Ship", null, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("tblAddhouse_hawExConsignee_1", "CustomerTypeSNo", "Acceptance_SHIPPER_AccountNo_cons", null, "contains", null, null, null, null, null, null, null, true);

    $("#AddNewHAWB").dialog({
        modal: true,
        draggable: true,
        resizable: true,
        position: ['center', 'top'],
        show: 'blind',
        hide: 'blind',
        width: 800,
        title: "HAWB NO. INFORMATION",
        dialogClass: 'ui-dialog-osx',

    });
});
$(document).on('click', '#tblAddhawb_btnAppendRow', function (event) {
    var countTable = $("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").length;


    for (var i = 1; i <= countTable; i++) {
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='tblAddhouse_txthawbno_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please enter house AWB NO.! ", "bottom-right");
            $("#tblAddhouse_txthawbno_" + countTable).focus();
            return;
        }
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='tblAddhouse_hawPieces_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please enter  Pieces.! ", "bottom-right");
            $("#tblAddhouse_hawPieces_" + countTable).focus();
            return;
        }
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='tblAddhouse_hawGrossWt_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please enter  Gross Weight.! ", "bottom-right");
            $("#tblAddhouse_hawGrossWt_" + countTable).focus();
            return;
        }
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='tblAddhouse_hawVolumeWt_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please enter  Volume Weight.! ", "bottom-right");
            $("#tblAddhouse_hawVolumeWt_" + countTable).focus();
            return;
        }
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='tblAddhouse_hawCBM_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please enter  CBM.! ", "bottom-right");
            $("#tblAddhouse_hawCBM_" + countTable).focus();
            return;
        }
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='tblAddhouse_hawChargeableWt_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please enter  ChargeableWt.! ", "bottom-right");
            $("#tblAddhouse_hawChargeableWt_" + countTable).focus();
            return;
        }
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='tblAddhouse_hawExcommodity_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please select  commodity .! ", "bottom-right");
            $("#tblAddhouse_hawExcommodity_" + countTable).focus();
            return;
        }
        //if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='tblAddhouse_hawSHC_" + countTable + "']").val() == "") {
        //    ShowMessage('warning', 'Warning - ESS', "Please select  SHC .! ", "bottom-right");
        //    return;
        //}
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='Text_tblAddhouse_hawExSHIPPER_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please select  SHIPPER .! ", "bottom-right");
            $("#Text_tblAddhouse_hawExSHIPPER_" + countTable).focus();
            return;
        }
        if ($("div[id$='htmltableaddHawb']").find("table[id='tblehawb_" + countTable + "']").find("input[id='Text_tblAddhouse_hawExConsignee_" + countTable + "']").val() == "") {
            ShowMessage('warning', 'Warning - ESS', "Please select consignee.! ", "bottom-right");
            $("#Text_tblAddhouse_hawExConsignee_" + countTable).focus();
            return;
        }
    }
    var tablecount = $('table[id*="tblehawb_"]').length;
    var rowscount = tablecount + 1;
    var TableHawb = '<table style="width:100%" class="WebFormTable" id="tblehawb_' + rowscount + '"><tbody>'
    TableHawb += '<tr><td class="formtwolabel" ><font color="red">*</font><label id="tblAddhouse_HouseAWBNo_' + rowscount + '" style="font-weight: bold;">House AWB No.</label></td>'
    TableHawb += ' <td class="formtwoInputcolumn">'

    TableHawb += '<input type="text" id="tblAddhouse_txthawbno_' + rowscount + '" style="width:120px;"  maxlength="12" class="txthawbno" /> </td>'


    TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_Pieces_' + rowscount + '" style="font-weight: bold;">Pieces</label></td>'
    TableHawb += '           <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawPieces_' + rowscount + '" class="Pieces" id="tblAddhouse_hawPieces_' + rowscount + '" maxlength="5" style="width:120px;text-align: right;"></td>'
    TableHawb += '      </tr>'
    TableHawb += '      <tr>'
    TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_GrWt_' + rowscount + '" style="font-weight: bold;">Gr.Wt.</label></td>'
    TableHawb += '          <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawGrossWt_' + rowscount + '" class="hawGrossWt" id="tblAddhouse_hawGrossWt_' + rowscount + '" maxlength="8"   style="width:120px;text-align: right;"></td>'
    TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_VolWt_' + rowscount + '" style="font-weight: bold;">Vol. Wt.</label></td>'
    TableHawb += '          <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawVolumeWt_' + rowscount + '" class="hawbVolumeWt" id="tblAddhouse_hawVolumeWt_' + rowscount + '" maxlength="8"   style="width:120px;text-align: right;"></td>'
    TableHawb += '      </tr>'
    TableHawb += '      <tr>'
    TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_CBM_' + rowscount + '" style="font-weight: bold;">CBM</label></td>'
    TableHawb += '           <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawCBM_' + rowscount + '" class="hawCBM" id="tblAddhouse_hawCBM_' + rowscount + '" maxlength="8" style="width:120px;text-align: right;"></td>'
    TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_ChWt_' + rowscount + '" style="font-weight: bold;">ChargeableWt</label>	</td>'
    TableHawb += '           <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawChargeableWt_' + rowscount + '" disabled="disabled" class="hawChargeableWt" id="tblAddhouse_hawChargeableWt_' + rowscount + '" maxlength="8" style="width:120px;text-align: right;"></td>'
    TableHawb += '      </tr>'
    TableHawb += '      <tr>'
    TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_Commodity_' + rowscount + '" style="font-weight: bold;">Commodity</label></td>'
    TableHawb += '          <td class="formtwoInputcolumn"><input type="hidden" name="tblAddhouse_hawExcommodity_' + rowscount + '" id="tblAddhouse_hawExcommodity_' + rowscount + '"><input type="text" name="Text_tblAddhouse_hawExcommodity_' + rowscount + '" id="Text_tblAddhouse_hawExcommodity_' + rowscount + '" data-valid="required" data-valid-msg="Select commodity" controltype="autocomplete" style="width:150px;"></td>'
    TableHawb += '<td class="formtwolabel"><label id="tblAddhouse_SHC_' + rowscount + '" style="font-weight: bold;">SHC</label></td>'
    TableHawb += '<td class="formtwoInputcolumn"><input type="hidden" name="tblAddhouse_hawSHC_' + rowscount + '" id="tblAddhouse_hawSHC_' + rowscount + '"><input type="text" name="Text_tblAddhouse_hawSHC_' + rowscount + '" id="Text_tblAddhouse_hawSHC_' + rowscount + '" data-valid="required" data-valid-msg="Select SHC" controltype="autocomplete" style="width:150px;"></td>'

    TableHawb += '      </tr>'
    TableHawb += '      <tr>'
    TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_Shipper_' + rowscount + '" style="font-weight: bold;">Shipper</label></td>'
    TableHawb += '          <td class="formtwoInputcolumn"><input type="text" name="Text_tblAddhouse_hawExSHIPPER_' + rowscount + '" id="Text_tblAddhouse_hawExSHIPPER_' + rowscount + '" data-valid="required" data-valid-msg="Select Shipper /Consignee " controltype="autocomplete" maxlength="55" style="width:180px;text-transform: uppercase"></td>'
    TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_Consignee_' + rowscount + '" style="font-weight: bold;">Consignee</label></td>'
    TableHawb += '          <td class="formtwoInputcolumn"><input type="text" name="Text_tblAddhouse_hawExConsignee_' + rowscount + '" id="Text_tblAddhouse_hawExConsignee_' + rowscount + '" data-valid="required" data-valid-msg="Select Shipper /Consignee " controltype="autocomplete" maxlength="55" style="width:180px;text-transform: uppercase"><input type="hidden" name="tblAddhouse_hawExSHIPPER_' + rowscount + '" id="tblAddhouse_hawExSHIPPER_' + rowscount + '"><input type="hidden" name="tblAddhouse_hawExConsignee_' + rowscount + '" id="tblAddhouse_hawExConsignee_' + rowscount + '">'
    TableHawb += '      </tr></tbody>'
    TableHawb += '   </table>'
    $('table[id="tblfooter"]').closest('table').before(TableHawb)
    cfi.AutoCompleteV2('tblAddhouse_hawExcommodity_' + rowscount + '', "CommodityCode,CommodityDescription", "Reservation_Commodity", null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2('tblAddhouse_hawSHC_' + rowscount + '', "CODE,Description", "Reservation_SPHC1", null, "contains", ",", null, null, null, null, true);
    cfi.AutoCompleteV2('tblAddhouse_hawExSHIPPER_' + rowscount + '', "CustomerTypeSNo", "Acceptance_SHIPPER_AccountNo", null, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2('tblAddhouse_hawExConsignee_' + rowscount + '', "CustomerTypeSNo", "Acceptance_SHIPPER_AccountNo_cons", null, "contains", null, null, null, null, null, null, null, true);
    $('#tblAddShipment_btnRemoveLast').show();

});

$(document).on('click', '#AwbInformationSave', function (event) {

    if ($("#AWBCode").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please select AWB Code! ", "bottom-right");
        return;
    }
    if ($("#txtawbno").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter AWB No.! ", "bottom-right");
        return;
    }
    if ($("#txtawbnoDate").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter AWB Date! ", "bottom-right");
        return;
    }
    if ($("#AWBExOrigin").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  AWB Origin ! ", "bottom-right");
        return;
    }
    if ($("#AWBExdestination").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  AWB Destination ! ", "bottom-right");
        return;
    }

    if ($("#ExOrigin").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  Flight Origin ! ", "bottom-right");
        return;
    }

    if ($("#Exdestination").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  Flight Destination	 ! ", "bottom-right");
        return;
    }



    if ($("#ExAwbFlightDate").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Flight Date ! ", "bottom-right");
        return;
    }

    if ($("#Text_ExAwbFlightNo").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please select  Flight No ! ", "bottom-right");
        return;
    }
    if ($("#Text_FlightPrex").val() == "" || $("#Text_FlightPrex").val() == "0") {
        ShowMessage('warning', 'Warning - AWB', "Please enter  Flight No ! ", "bottom-right");
        return;
    }

    if ($("#Excarriercode").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select  Carrier Code ! ", "bottom-right");
        return;
    }

    if ($("#Pieces").val() == "" || $("#Pieces").val() == "0") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Pieces ! ", "bottom-right");
        return;
    }
    if ($("#GrossWt").val() == "" || parseFloat($("#GrossWt").val()).toFixed(2) == "0.00") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Gr.Wt. ! ", "bottom-right");
        return;
    }

    if ($("#ChargeableWt").val() == "" || parseFloat($("#ChargeableWt").val()).toFixed(2) == "0.00") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  Ch.Wt. ! ", "bottom-right");
        return;
    }

    if ($("#VolumeWt").val() == "" || parseFloat($("#VolumeWt").val()).toFixed(2) <= "0.00" || parseFloat($("#VolumeWt").val()) < "1") {
        if ($("#VolumeWt").val() < "1") {
            ShowMessage('warning', 'Warning - AWB', "Volume weight cannot be less than 1", "bottom-right");
            return;
        }
        else {
            ShowMessage('warning', 'Warning - AWB', "Please Enter  Volume Wt. ! ", "bottom-right");
            return;
        }
    }
    if ($("#CBM").val() == "" || parseFloat($("#CBM").val()).toFixed(2) == "0.00") {
        ShowMessage('warning', 'Warning - AWB', "Please Enter  CBM ! ", "bottom-right");
        return;
    }

    if ($("#Excommodity").val() == "") {
        ShowMessage('warning', 'Warning - AWB', "Please Select Commodity ! ", "bottom-right");
        return;
    }

    if ($("#MovementType").val() == "2") {

        if ($("#Text_ExSHIPPER").val() == "" || $("#Text_ExSHIPPER").val() == "0") {
            ShowMessage('warning', 'Warning - AWB', "Please enter shipper ! ", "bottom-right");
            return;
        }

    } else {

        if ($("#Text_ExConsignee").val() == "" || $("#Text_ExConsignee").val() == "0") {
            ShowMessage('warning', 'Warning - AWB', "Please enter consignee ! ", "bottom-right");
            return;
        }


    }




    var Flag = SaveAwbInformation()
    if (Flag == "1") {
        $("#AddNewAqb").dialog("close");
        BindGetEssAWBNo_Information()
    }


});

function SaveAwbInformation() {

    $("#AwbInformationSave").css("disabled", "none")
    var ExSHIPPERConsignee = "", SHIPPERConsigneeType;
    if ($("#MovementType").val() == "2") {
        ExSHIPPERConsignee = $("#Text_ExSHIPPER").val()
        SHIPPERConsigneeType = "SHIPPER";
    } else {
        ExSHIPPERConsignee = $("#Text_ExConsignee").val()
        SHIPPERConsigneeType = "CONSIGNEE";
    }
    var AWBCode = $("#AWBCode").val() + "-" + $('#txtawbno').val();
    var SummaryArray = [];
    var SaveData = {
        Awb: AWBCode,
        Origin: $("#ExOrigin").val(),
        destination: $("#Exdestination").val(),
        carriercode: $("#Excarriercode").val(),
        AwbFlightNo: $("#ExAwbFlightNo").val(),
        AwbFlightDate: $("#ExAwbFlightDate").val(),
        pieces: $("#Pieces").val(),
        chweight: $("#ChargeableWt").val(),
        grwt: $("#GrossWt").val(),
        commodity: $("#Excommodity").val(),
        AwbType: 1,
        MovementType: $("#MovementType").val(),
        BillToSNo: $("#BillToSNo").val().split('-')[0],
        CBM: $("#CBM").val(),
        VolumeWt: $("#VolumeWt").val(),
        NoofHouse: $("#NoofHouse").val() == "" ? 0 : $("#NoofHouse").val(),
        SHIPPERConsignee: ExSHIPPERConsignee,
        AWBOrigin: $("#AWBExOrigin").val(),
        AWBDestination: $("#AWBExdestination").val(),
        FlightCarrierCode: $("#Text_ExAwbFlightNo").val(),
        FlightNo: $("#Text_ExAwbFlightNo").val(),
        FlightNoPrix: $("#Text_FlightPrex").val(),
        FlightNoPrix1: $("#Text_FlightPrexGa").val(),
        AWBDate: $("#txtawbnoDate").val()

    }
    SummaryArray.push(SaveData);

    //var ShAccountNo = "0";
    //var ConAccountNo = "0";
    //if (shipperconsignee == "SHIPPER") {
    //    ShAccountNo = $("#ExSHIPPER").val()
    //    ConAccountNo = "0";
    //} else {
    //    ShAccountNo = "0";
    //    ConAccountNo = $("#ExSHIPPER").val()
    //}

    var ShipperViewModel = {
        ShipperAccountNo: 0,
        ShipperName: ShipperName,
        ShipperName2: ShipperName2,
        ShipperStreet: ShipperStreet,
        ShipperStreet2: ShipperStreet2,
        ShipperLocation: ShipperLocation,
        ShipperState: ShipperState,
        ShipperPostalCode: ShipperPostalCode,
        ShipperCity: ShipperCity,
        ShipperCountryCode: ShipperCountryCode,
        ShipperMobile: ShipperMobile,
        ShipperMobile2: ShipperMobile2,
        ShipperEMail: ShipperEMail,
        ShipperFax: ShipperFax,
    };

    var ConsigneeViewMode = {
        ConsigneeAccountNo: 0,
        ConsigneeName: ConsigneeName,
        ConsigneeName2: ConsigneeName2,
        ConsigneeStreet: ConsigneeStreet,
        ConsigneeStreet2: ConsigneeStreet2,
        ConsigneeLocation: ConsigneeLocation,
        ConsigneeState: ConsigneeState,
        ConsigneePostalCode: ConsigneePostalCode,
        ConsigneeCity: ConsigneeCity,
        ConsigneeCountryCode: ConsigneeCountryCode,
        ConsigneeMobile: ConsigneeMobile,
        ConsigneeMobile2: ConsigneeMobile2,
        ConsigneeEMail: ConsigneeEMail,
        ConsigneeFax: ConsigneeFax,
    };

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/CreateAWBSummary", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ Summary: SummaryArray, ShipperInformation: ShipperViewModel, ConsigneeInformation: ConsigneeViewMode, shipperconsignee: SHIPPERConsigneeType }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            FinalData1 = ResultData.Table1;
            if (FinalData.length > 0) {
                if (FinalData[0].AwbSno != "0" && FinalData[0].AwbSno != "") {
                    if (FinalData[0].AwbSno == "Invalid AWB No") {
                        ShowMessage('warning', 'Warning - FWB [' + $("#AWBCode").val() + "-" + $('#txtawbno').val() + ']', FinalData1[0].AwbSno + ".", "bottom-right");
                    } else  {
                        if (FinalData[0].AwbSno != undefined) {
                            cuurentawbsno = FinalData[0].AwbSno;
                            ShowMessage('success', 'Success - AWB No.', "AWB No. [" + $("#AWBCode").val() + "-" + $('#txtawbno').val() + "] -  Processed Successfully", "bottom-right");
                            $("#Text_AWB").val($("#AWBCode").val() + "-" + $('#txtawbno').val());
                            $("#AWB").val(FinalData[0].AwbSno);
                            Flag = 1;
                        }
                    }
                }
            }
            // if(FinalData1.length > 0)
            //    {
               
            //        if (FinalData1[0].AwbSno != "0" && FinalData1[0].AwbSno != "") {
            //            if (FinalData1[0].AwbSno == "Invalid AWB No") {
            //                ShowMessage('warning', 'Warning - FWB [' + $("#AWBCode").val() + "-" + $('#txtawbno').val() + ']', FinalData1[0].AwbSno + ".", "bottom-right");
            //            } else {
            //                if (FinalData1[0].AwbSno  != undefined) {
            //                    cuurentawbsno = FinalData1[0].AwbSno;
            //                    ShowMessage('success', 'Success - AWB No.', "AWB No. [" + $("#AWBCode").val() + "-" + $('#txtawbno').val() + "] -  Processed Successfully", "bottom-right");
            //                    $("#Text_AWB").val($("#AWBCode").val() + "-" + $('#txtawbno').val());
            //                    $("#AWB").val(FinalData1[0].AwbSno);
            //                    Flag = 1;
            //                }
            //            }
            //        }


            //}
        },
        error: function (xhr) {
            $("#AwbInformationSave").css("disabled", "block")
            ShowMessage('warning', 'Warning - Other Info', "AWB No. [" + $("#txtawbno").val() + "] -  unable to process.", "bottom-right");

        }
    });

    return Flag
}

$(document).on('keypress keyup blur', '.ChargeableWt', function (event) {
    CalculateShipmentChWt(this);
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }

});

$(document).on('blur', '.txthawbno', function (event) {
    //var row_index = $(this).closest('table').attr('id').split('_')[1];
    //var houseNo = $('#tblAddhouse_txthawbno_' + row_index).val();
    //var flag = false;
    //$("div[id$='htmltableaddHawb']").find("table[id^='tblehawb_']").each(function (row, tr) {
    //    if ($(this).find("tr:eq(0)").find("td:eq(1)").find("input").attr("id") != $('#tblAddhouse_txthawbno_' + row_index)) {
    //        if ($(this).find("tr:eq(0)").find("td:eq(1)").find("input").val() == houseNo) {
    //            flag = true;
    //            ShowMessage('warning', 'Information!', "Can not duplicate house Awbno.", "bottom-right");
    //            $('#tblAddhouse_txthawbno_' + row_index).val('');
    //            return false;
    //        }
    //    }
    //})

});
$(document).on('keypress keyup blur', '.hawChargeableWt', function (event) {
    var row_index = $(this).closest('table').attr('id').split('_')[1];
    CalculateShipmenthawChWt(this, row_index);
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }

});
$(document).on('keypress keyup', '.ChargeableWt', function (event) {


    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }

});
$(document).on('keypress keyup', '.hawChargeableWt', function (event) {


    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }

});
$(document).on('keypress keyup change', '.GrossWt', function (event) {

    CalculateShipmentCBM();
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }

});

$(document).on('keypress keyup change', '.hawGrossWt', function (event) {

    var row_index = $(this).closest('table').attr('id').split('_')[1];
    CalculateShipmenthawCBM(row_index);
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)&&(event.which == 48)) {
        event.preventDefault();
    }
   
});
$(document).on('keypress keyup change', '.Pieces', function (event) {

    var row_index = $(this).closest('table').attr('id').split('_')[1];
    CalculateShipmenthawCBM(row_index);
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57) && (event.which == 48)) {
        event.preventDefault();
    }

});

$(document).on('blur', '.hawChargeableWt', function (event) {
    var row_index = $(this).closest('table').attr('id').split('_')[1];
    var GrossWt = parseFloat($("#tblAddhouse_hawGrossWt_" + id + "").val() == "" ? 0 : $("#tblAddhouse_hawGrossWt_" + id + "").val()).toFixed(3);
    var ChargeableWt = parseFloat($("#tblAddhouse_hawChargeableWt_" + id + "").val() == "" ? 0 : $("#tblAddhouse_hawChargeableWt_" + id + "").val()).toFixed(3);

    if (ChargeableWt < GrossWt) {
        $("#tblAddhouse_hawChargeableWt_" + id + "").val(parseFloat(GrossWt == 0 ? "" : GrossWt));
    }
});
$(document).on('blur', '.ChargeableWt', function (event) {

    var GrossWt = parseFloat($("#GrossWt").val() == "" ? 0 : $("#GrossWt").val()).toFixed(3);
    var ChargeableWt = parseFloat($("#ChargeableWt").val() == "" ? 0 : $("#ChargeableWt").val()).toFixed(3);

    if (ChargeableWt < GrossWt) {
        $("#ChargeableWt").val(parseFloat(GrossWt == 0 ? "" : GrossWt));
    }


});

$(document).on('keypress keyup blur', '.Pieces', function (event) {

    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }


});



$(document).on('blur', '#pieces', function (event) {

    if ($('#MovementType').val() == '1') {

        var Pieces = $(this).val();
        var lblpieces = $("#lblpieces").text() == "" ? 0 : $("#lblpieces").text();
        var ChargeableWt = $("#lblCh").text() == "" ? 0 : parseFloat($("#lblCh").text()).toFixed(3);

        if (lblpieces != 0 && ChargeableWt != 0) {
            var CWait = parseFloat((ChargeableWt / lblpieces) * $(this).val()).toFixed(3)
        }
        else {
            var CWait = 0;
        }


        $("#chweight").val(CWait)
        $("#_tempchweight").val(CWait)
        var grwt = $("#lblGS").text() == "" ? 0 : parseFloat($("#lblGS").text()).toFixed(3);
        if (grwt != 0 && lblpieces != 0) {
            var GWait = parseFloat((grwt / lblpieces) * $(this).val()).toFixed(3)
        }
        else {
            var GWait = 0;
        }

        $("#grwt").val(GWait)
        $("#_tempgrwt").val(GWait)
    }
    $("#tblesscharges").hide();
});

$(document).on('keypress keyup blur', '.CBM', function (event) {
    CalculateShipmentChWt(this);
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }


});


$(document).on('blur', '.VolumeWt', function (event) {

    CalculateShipmentCBM();


    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which != 8 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }

});
$(document).on('blur', '.hawbVolumeWt', function (event) {
   // CalculateShipmenthawCBM(id)
    var row_index = $(this).closest('table').attr('id').split('_')[1];
    CalculateShipmenthawCBM(row_index);
   // CalculateShipmentCBM();


    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which != 8 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }

});
$(document).on('keypress keyup blur', '.NoofHouse', function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$(document).on('keypress keyup blur', '.txtawbno', function (event) {

    var k = event.keyCode;
    var $return = ((k > 64 && k < 91) || k == 8 || k == 32 || k == 45 || (k >= 48 && k <= 57));
    if (!$return) {
        return false;
    }


});

$(document).on('keypress keyup blur', '#Text_FlightPrex', function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$(document).on('keypress keyup blur', '#Text_FlightPrexGa', function (e) {
    var node = $(this);
    node.val(node.val().replace(/[^a-z][A-Z]/g, '').toUpperCase());
});

$(document).on('keypress keyup blur', '#Text_ExSHIPPER', function (evt) {
    var keyCode = event.keyCode || event.which
    // Don't validate the input if below arrow, delete and backspace keys were pressed 

    if (keyCode == 8 || keyCode == 32 || (keyCode >= 35 && keyCode <= 40)) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
        return;
    }

    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});



$(document).on('keypress keyup blur', '#Text_ExConsignee', function (event) {
    var keyCode = event.keyCode || event.which
    // Don't validate the input if below arrow, delete and backspace keys were pressed 

    if (keyCode == 8 || keyCode == 32 || (keyCode >= 35 && keyCode <= 40)) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
        return;
    }

    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});


$(document).on('change', '#txtawbnoDate', function (evt) {

    $("#ExAwbFlightDate").data("kendoDatePicker").min($("#txtawbnoDate").val());
    $("#ExAwbFlightDate").data("kendoDatePicker").value('');
});





function compareGrossValue(obj) {
    //if (parseFloat(accgrwt) > 0) {
    //    var flag = false;
    //    var value = $(obj).val();
    //    if (parseFloat(value) < parseFloat(accgrwt)) {
    //        $(obj).val(bkdgrwt == 0 ? "" : bkdgrwt);
    //        ShowMessage('warning', 'Information!', "Entered Gross weight cannot be less than accepted Gross weight. Accepted gross weight : " + bkdgrwt.toString() + ".", "bottom-right");
    //        flag = true;
    //    }
    //    return flag;
    //} else
    //    return true;
}

function compareVolValue(obj) {
    //var flag = true;
    //var cbm = ($(obj).val() == "" ? 0 : parseFloat($(obj).val()));
    //var volwt = cbm * 166.66;
    //if (parseFloat(volwt) < parseFloat(accvolwt)) {
    //    $(obj).val(bkdvolwt == 0 ? "" : bkdvolwt);
    //    ShowMessage('warning', 'Information!', "Entered Volume weight cannot be less than accepted Volume weight. Accepted volume weight : " + bkdvolwt.toString() + ".", "bottom-right");
    //    flag = false;
    //}
    //return flag;
}

function CalculateShipmenthawChWt(obj, id) {

    var grosswt = ($("#tblAddhouse_hawGrossWt_" + id + "").val() == "" ? 0 : parseFloat($("#tblAddhouse_hawGrossWt_" + id + "").val()));

    var cbm = ($("#tblAddhouse_hawCBM_" + id + "").val() == "" ? 0 : parseFloat($("#tblAddhouse_hawCBM_" + id + "").val()));
    var volwt = cbm * userContext.SysSetting.CalculateCBM;
    //if ($(obj).attr('id').toUpperCase() == "CBM") {
    //    $("span[id='VolumeWt']").text(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));// 
    // $("input[id='VolumeWt']").val(volwt.toFixed(3));// 
    $("#tblAddhouse_hawVolumeWt_" + id + "").val(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));// 

    //}

    var GrossWt = parseFloat($("#tblAddhouse_hawGrossWt_" + id + "").val() == "" ? 0 : $("#tblAddhouse_hawGrossWt_" + id + "").val()).toFixed(3);
    var ChargeableWt = parseFloat($("#tblAddhouse_hawChargeableWt_" + id + "").val() == "" ? 0 : $("#tblAddhouse_hawChargeableWt_" + id + "").val()).toFixed(3);

    if (ChargeableWt < GrossWt) {
        $("#tblAddhouse_hawChargeableWt_" + id + "").val(parseFloat(GrossWt == 0 ? "" : GrossWt));
    }


}
function CalculateShipmentChWt(obj) {

    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));

    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * userContext.SysSetting.CalculateCBM;
    if ($(obj).attr('id').toUpperCase() == "CBM") {
        $("span[id='VolumeWt']").text(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));// 
        // $("input[id='VolumeWt']").val(volwt.toFixed(3));// 
        $("#VolumeWt").val(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));// 

    }

    var GrossWt = parseFloat($("#GrossWt").val() == "" ? 0 : $("#GrossWt").val()).toFixed(3);
    var ChargeableWt = parseFloat($("#ChargeableWt").val() == "" ? 0 : $("#ChargeableWt").val()).toFixed(3);

    if (ChargeableWt < GrossWt) {
        $("#ChargeableWt").val(parseFloat(GrossWt == 0 ? "" : GrossWt));
    }


}


function CalculateShipmentCBM() {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()).toFixed(3));
    var volwt = ($("#VolumeWt").val() == "" ? 0 : parseFloat($("#VolumeWt").val()).toFixed(3));
    var cbm = (volwt / userContext.SysSetting.CalculateCBM).toFixed(3);
    // cbm = cbm < 0.01 ? 0.01 : cbm;
    $("#CBM").val(cbm.toString() == 0 ? "" : cbm.toString());
    var chwt = parseFloat(grosswt) > parseFloat(volwt) ? parseFloat(grosswt) : parseFloat(volwt);
    $("#ChargeableWt").val(parseFloat(chwt.toString() == 0 ? "" : chwt.toString()));
    if ($("#CBM").val() != "" && $("#VolumeWt").val() != "") {
        $("#CBM").attr('disabled', 'true');
    } else if ($("#VolumeWt").val() == "") {
        $("#CBM").attr('disabled', false);
    }
}
function CalculateShipmenthawCBM(id) {
    var pieces = ($("#tblAddhouse_hawPieces_" + id + "").val() == "" ? 0 : parseFloat($("#tblAddhouse_hawPieces_" + id + "").val()).toFixed(3));
    var grosswt = ($("#tblAddhouse_hawGrossWt_" + id + "").val() == "" ? 0 : parseFloat($("#tblAddhouse_hawGrossWt_" + id + "").val()).toFixed(3));
    var volwt = ($("#tblAddhouse_hawVolumeWt_" + id + "").val() == "" ? 0 : parseFloat($("#tblAddhouse_hawVolumeWt_" + id + "").val()).toFixed(3));
    if (pieces <= 0.00) {
        $("#tblAddhouse_hawPieces_" + id + "").val(" ");

    }
    if (grosswt <= 0.00) {
        $("#tblAddhouse_hawGrossWt_" + id + "").val(" ");
        
    }
    if (volwt <=0.00) {
        $("#tblAddhouse_hawVolumeWt_" + id + "").val(" ");
      
    }
     var cbm = (volwt / userContext.SysSetting.CalculateCBM).toFixed(3);
    // cbm = cbm < 0.01 ? 0.01 : cbm;
    $("#tblAddhouse_hawCBM_" + id + "").val(cbm.toString() == 0 ? "" : cbm.toString());
    var chwt = parseFloat(grosswt) > parseFloat(volwt) ? parseFloat(grosswt) : parseFloat(volwt);  
    $("#tblAddhouse_hawChargeableWt_" + id + "").val(parseFloat(chwt.toString() == 0 ? 0 : chwt.toString()));
  
    if ($("#tblAddhouse_hawCBM_" + id + "").val() != "" && $("#tblAddhouse_hawVolumeWt_" + id + "").val() != "") {
        $("#tblAddhouse_hawCBM_" + id + "").attr('disabled', 'true');
    } else if ($("#tblAddhouse_hawVolumeWt_" + id + "").val() == "") {
        $("#tblAddhouse_hawCBM_" + id + "").attr('disabled', false);
    }
}
function GetAwbMod() {

    //var AWB7 = $("#txtawbno").val();
    //var AWB1 = $("#txtawbno").val()
    //; var Mod
    //AWB1 = AWB1.substring(8, 7)
    //AWB7 = AWB7.substring(0, 7)
    //Mod = AWB7 % 7;
    //if (AWB1 != Mod) {
    //    ShowMessage('warning', 'Warning - FWB', "Invalid AWB No", "bottom-right");
    //    $('#txtawbno').val('');
    //    $('#AWBCode').val('');
    //    $('#Text_AWBCode').val('');
    //    return;
    //} else {
    //    CheckIsAWBUsable()
    //}

    CheckIsAWBUsable()

}

var ShipperAccountNo = 0; ShipperName = "", ShipperName2 = "", ShipperStreet = "", ShipperStreet2 = "", ShipperLocation = "", ShipperState = "", ShipperPostalCode = "", ShipperCity = "",
ShipperCountryCode = "", ShipperMobile = "", ShipperMobile2 = "", ShipperEMail = "", ShipperFax = ""

var ConsigneeAccountNo = 0, ConsigneeName = "", ConsigneeName2 = "", ConsigneeStreet = "", ConsigneeStreet2 = "", ConsigneeLocation = "", ConsigneeState = "", ConsigneePostalCode = "",
ConsigneeCity = "", ConsigneeCountryCode = "", ConsigneeMobile = "", ConsigneeMobile2 = "", ConsigneeEMail = "", ConsigneeFax = ""



function GetConsigneeDetails(e) {

    setTimeout(function () {


        var UserTyp = $("#Text_ExConsignee").val();
        var FieldType = "NAME";

        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;
                if (shipperConsigneeData !== undefined) {
                    if (shipperConsigneeData.length > 0) {
                        if ((shipperConsigneeData[0].CustomerTypeName).trim().toUpperCase() == "SHIPPER".trim().toUpperCase()) {

                            ShipperAccountNo = 0;
                            ShipperName = shipperConsigneeData[0].ShipperName
                            ShipperName2 = shipperConsigneeData[0].Name2
                            ShipperStreet = shipperConsigneeData[0].ShipperStreet
                            ShipperStreet2 = shipperConsigneeData[0].Address2
                            ShipperLocation = shipperConsigneeData[0].ShipperLocation;
                            ShipperState = shipperConsigneeData[0].ShipperState;
                            ShipperPostalCode = shipperConsigneeData[0].ShipperPostalCode;
                            ShipperCity = shipperConsigneeData[0].ShipperCity == "" ? "0" : shipperConsigneeData[0].ShipperCity;
                            ShipperCountryCode = shipperConsigneeData[0].ShipperCountryCode == "" ? "0" : shipperConsigneeData[0].ShipperCountryCode;
                            ShipperMobile = shipperConsigneeData[0].ShipperMobile;
                            ShipperMobile2 = shipperConsigneeData[0].Telex;
                            ShipperEMail = shipperConsigneeData[0].ShipperEMail;
                            ShipperFax = shipperConsigneeData[0].Fax;
                            shipperconsignee = "SHIPPER";

                        }
                        else if ((shipperConsigneeData[0].CustomerTypeName).trim().toUpperCase() == "CONSIGNEE".trim().toUpperCase()) {

                            ConsigneeAccountNo = 0
                            ConsigneeName = shipperConsigneeData[0].ConsigneeName;
                            ConsigneeName2 = shipperConsigneeData[0].Name2;
                            ConsigneeStreet = shipperConsigneeData[0].ConsigneeStreet;
                            ConsigneeStreet2 = shipperConsigneeData[0].Address2;
                            ConsigneeLocation = shipperConsigneeData[0].ConsigneeLocation;
                            ConsigneeState = shipperConsigneeData[0].ConsigneeState;
                            ConsigneePostalCode = shipperConsigneeData[0].ConsigneePostalCode;
                            ConsigneeCity = shipperConsigneeData[0].ConsigneeCity == "" ? "0" : shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName;
                            ConsigneeCountryCode = shipperConsigneeData[0].ConsigneeCountryCode == "" ? "0" : shipperConsigneeData[0].ConsigneeCountryCode;
                            ConsigneeMobile = shipperConsigneeData[0].ConsigneeMobile;
                            ConsigneeMobile2 = shipperConsigneeData[0].Telex;
                            ConsigneeEMail = shipperConsigneeData[0].ConsigneeEMail;
                            ConsigneeFax = shipperConsigneeData[0].Fax;
                            shipperconsignee = "CONSIGNEE";

                        }

                    }
                    else {
                        if ((shipperConsigneeData[0].CustomerTypeName).trim().toUpperCase() == "SHIPPER".trim().toUpperCase()) {
                            ShipperAccountNo = "0";
                            ShipperName = "";
                            ShipperName2 = "";
                            ShipperStreet = "";
                            ShipperStreet2 = "";
                            ShipperLocation = "";
                            ShipperState = "";
                            ShipperPostalCode = "";
                            ShipperCity = "0";
                            ShipperCountryCode = "0";
                            ShipperMobile = "";
                            ShipperMobile2 = "";
                            ShipperEMail = "";
                            ShipperFax = "";
                            shipperconsignee = "";
                        }
                        else if ((shipperConsigneeData[0].CustomerTypeName).trim().toUpperCase() == "CONSIGNEE".trim().toUpperCase()) {
                            ConsigneeAccountNo = "0"
                            ConsigneeName = "";
                            ConsigneeName2 = "";
                            ConsigneeStreet = "";
                            ConsigneeStreet2 = "";
                            ConsigneeLocation = "";
                            ConsigneeState = "";
                            ConsigneePostalCode = "";
                            ConsigneeCity = "0";
                            ConsigneeCountryCode = "0";
                            ConsigneeMobile = "";
                            ConsigneeMobile2 = "";
                            ConsigneeEMail = "";
                            ConsigneeFax = "";
                            shipperconsignee = "";
                        }
                    }
                } else {
                    ShowMessage('warning', 'Warning - AWB', "Does not exist shipper /consignee Infomartion	 ! ", "bottom-right");
                    $("#ExSHIPPER").val("")
                    $("#Text_ExSHIPPER").val("")
                }

            },
            error: {

            }
        });

    }, 200)
}
function GetShipperConsigneeDetails(e) {

    setTimeout(function () {


        var UserTyp = $("#Text_ExSHIPPER").val();
        var FieldType = "NAME";

        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;
                if (shipperConsigneeData !== undefined) {
                    if (shipperConsigneeData.length > 0) {
                        if ((shipperConsigneeData[0].CustomerTypeName).trim().toUpperCase() == "SHIPPER".trim().toUpperCase()) {

                            ShipperAccountNo = 0;
                            ShipperName = shipperConsigneeData[0].ShipperName
                            ShipperName2 = shipperConsigneeData[0].Name2
                            ShipperStreet = shipperConsigneeData[0].ShipperStreet
                            ShipperStreet2 = shipperConsigneeData[0].Address2
                            ShipperLocation = shipperConsigneeData[0].ShipperLocation;
                            ShipperState = shipperConsigneeData[0].ShipperState;
                            ShipperPostalCode = shipperConsigneeData[0].ShipperPostalCode;
                            ShipperCity = shipperConsigneeData[0].ShipperCity == "" ? "0" : shipperConsigneeData[0].ShipperCity;
                            ShipperCountryCode = shipperConsigneeData[0].ShipperCountryCode == "" ? "0" : shipperConsigneeData[0].ShipperCountryCode;
                            ShipperMobile = shipperConsigneeData[0].ShipperMobile;
                            ShipperMobile2 = shipperConsigneeData[0].Telex;
                            ShipperEMail = shipperConsigneeData[0].ShipperEMail;
                            ShipperFax = shipperConsigneeData[0].Fax;
                            shipperconsignee = "SHIPPER";

                        }
                        else if ((shipperConsigneeData[0].CustomerTypeName).trim().toUpperCase() == "CONSIGNEE".trim().toUpperCase()) {

                            ConsigneeAccountNo = 0
                            ConsigneeName = shipperConsigneeData[0].ConsigneeName;
                            ConsigneeName2 = shipperConsigneeData[0].Name2;
                            ConsigneeStreet = shipperConsigneeData[0].ConsigneeStreet;
                            ConsigneeStreet2 = shipperConsigneeData[0].Address2;
                            ConsigneeLocation = shipperConsigneeData[0].ConsigneeLocation;
                            ConsigneeState = shipperConsigneeData[0].ConsigneeState;
                            ConsigneePostalCode = shipperConsigneeData[0].ConsigneePostalCode;
                            ConsigneeCity = shipperConsigneeData[0].ConsigneeCity == "" ? "0" : shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName;
                            ConsigneeCountryCode = shipperConsigneeData[0].ConsigneeCountryCode == "" ? "0" : shipperConsigneeData[0].ConsigneeCountryCode;
                            ConsigneeMobile = shipperConsigneeData[0].ConsigneeMobile;
                            ConsigneeMobile2 = shipperConsigneeData[0].Telex;
                            ConsigneeEMail = shipperConsigneeData[0].ConsigneeEMail;
                            ConsigneeFax = shipperConsigneeData[0].Fax;
                            shipperconsignee = "CONSIGNEE";

                        }

                    }
                    else {
                        if ((shipperConsigneeData[0].CustomerTypeName).trim().toUpperCase() == "SHIPPER".trim().toUpperCase()) {
                            ShipperAccountNo = "0";
                            ShipperName = "";
                            ShipperName2 = "";
                            ShipperStreet = "";
                            ShipperStreet2 = "";
                            ShipperLocation = "";
                            ShipperState = "";
                            ShipperPostalCode = "";
                            ShipperCity = "0";
                            ShipperCountryCode = "0";
                            ShipperMobile = "";
                            ShipperMobile2 = "";
                            ShipperEMail = "";
                            ShipperFax = "";
                            shipperconsignee = "";
                        }
                        else if ((shipperConsigneeData[0].CustomerTypeName).trim().toUpperCase() == "CONSIGNEE".trim().toUpperCase()) {
                            ConsigneeAccountNo = "0"
                            ConsigneeName = "";
                            ConsigneeName2 = "";
                            ConsigneeStreet = "";
                            ConsigneeStreet2 = "";
                            ConsigneeLocation = "";
                            ConsigneeState = "";
                            ConsigneePostalCode = "";
                            ConsigneeCity = "0";
                            ConsigneeCountryCode = "0";
                            ConsigneeMobile = "";
                            ConsigneeMobile2 = "";
                            ConsigneeEMail = "";
                            ConsigneeFax = "";
                            shipperconsignee = "";
                        }
                    }
                } else {
                    ShowMessage('warning', 'Warning - AWB', "Does not exist shipper /consignee Infomartion	 ! ", "bottom-right");
                    $("#ExSHIPPER").val("")
                    $("#Text_ExSHIPPER").val("")
                }

            },
            error: {

            }
        });

    }, 200)
}

var Table = '<table style="width:100%" class="WebFormTable">'
Table += '<tr><td class="formtwolabel" ><font color="red">*</font>AWB No.</td>'
Table += ' <td class="formtwoInputcolumn">'
Table += '<input type="hidden" name="AWBCode" id="AWBCode"><input type="text" name="Text_AWBCode" id="Text_AWBCode" data-valid="required" data-valid-msg="AWB Code" controltype="autocomplete" style="width:50px;">'
Table += '-<input type="text" id="txtawbno" style="width:120px;" onblur="AwbFunction()" maxlength="8"  minlength="5"class="txtawbno" onkeyup="KeyAwbFunction()"/> </td>'
Table += '        <td class="formtwolabel"><font color="red">*</font>AWB Date</td>'
Table += '<td class="formtwoInputcolumn"><input type="text" name="txtawbnoDate" id="txtawbnoDate" data-valid="required" data-valid-msg=" " controltype="autocomplete" style="width:150px;"></td>'
Table += '</tr>'
Table += '    <tr>'
Table += '          <td class="formtwolabel"><font color="red">*</font>AWB Origin</td>'
Table += '           <td class="formtwoInputcolumn"><input type="hidden" name="AWBExOrigin" id="AWBExOrigin"><input type="text" name="Text_AWBExOrigin" id="Text_AWBExOrigin" data-valid="required" data-valid-msg="Select AWB Origin" controltype="autocomplete" style="width:150px;"></td>'
Table += '           <td class="formtwolabel"><font color="red">*</font>AWB Destination</td>'
Table += '           <td class="formtwoInputcolumn"><input type="hidden" name="AWBExdestination" id="AWBExdestination"><input type="text" name="Text_AWBExdestination" id="Text_AWBExdestination" data-valid="required" data-valid-msg="Select AWB Destination" controltype="autocomplete" style="width:150px;"></td>'
Table += '       </tr>'
Table += '    <tr>'
Table += '          <td class="formtwolabel"><font color="red">*</font>Flight Origin</td>'
Table += '           <td class="formtwoInputcolumn"><input type="hidden" name="ExOrigin" id="ExOrigin"><input type="text" name="Text_ExOrigin" id="Text_ExOrigin" data-valid="required" data-valid-msg="Select Origin" controltype="autocomplete" style="width:150px;"></td>'
Table += '           <td class="formtwolabel"><font color="red">*</font>Flight Destination</td>'
Table += '           <td class="formtwoInputcolumn"><input type="hidden" name="Exdestination" id="Exdestination"><input type="text" name="Text_Exdestination" id="Text_Exdestination" data-valid="required" data-valid-msg="Select Destination" controltype="autocomplete" style="width:150px;"></td>'
Table += '       </tr>'
Table += '       <tr>'
Table += '          <td class="formtwolabel">'
Table += '             <font color="red">*</font> Flight Date'
Table += '                         </td>'
Table += '         <td class="formtwoInputcolumn"><input type="text" name="ExAwbFlightDate" id="ExAwbFlightDate" ></td>'
Table += '          <td class="formtwolabel">'
Table += '             <font color="red">*</font>Flight No'
Table += '          </td>'
Table += '         <td class="formtwoInputcolumn"><input type="hidden" name="ExAwbFlightNo" id="ExAwbFlightNo" style="width:97px !important;">'
Table += '        <input type="text" name="Text_ExAwbFlightNo" id="Text_ExAwbFlightNo" data-valid="required" data-valid-msg="Select FlightNo" controltype="autocomplete" style="width:97px !important">'
Table += '        <input type="text" name="Text_FlightPrex" maxlength="4" id="Text_FlightPrex" data-valid="required" data-valid-msg="Select FlightNo" controltype="autocomplete" style="width:40px;">-'
Table += '        <input type="text" name="Text_FlightPrexGa" maxlength="1" id="Text_FlightPrexGa" data-valid="required" data-valid-msg="Select FlightNo" controltype="autocomplete" style="width:20px;">'
Table += '      </td>'
Table += '      </tr>'
Table += '      <tr>'
Table += '         <td class="formtwolabel">'
Table += '             <font color="red">*</font> Carrier Code'
Table += '          </td>'
Table += '          <td class="formtwoInputcolumn"><input type="hidden" name="Excarriercode" id="Excarriercode"><input type="text" name="Text_Excarriercode" id="Text_Excarriercode" data-valid="required" data-valid-msg="Select Carrier ccode" controltype="autocomplete" style="width:150px;"></td>'
Table += '          <td class="formtwolabel"><font color="red">*</font>Pieces</td>'
Table += '           <td class="formtwoInputcolumn"><input type="text" name="Pieces" class="Pieces" id="Pieces" maxlength="5" style="width:120px;text-align: right;"></td>'
Table += '      </tr>'
Table += '      <tr>'
Table += '          <td class="formtwolabel"><font color="red">*</font>Gr.Wt.	</td>'
Table += '          <td class="formtwoInputcolumn"><input type="text" name="GrossWt" class="GrossWt" id="GrossWt" maxlength="8"   style="width:120px;text-align: right;"></td>'
Table += '          <td class="formtwolabel"><font color="red">*</font>Vol. Wt.</td>'
Table += '          <td class="formtwoInputcolumn"><input type="text" name="VolumeWt" class="VolumeWt" id="VolumeWt" maxlength="8"   style="width:120px;text-align: right;"></td>'
Table += '      </tr>'
Table += '      <tr>'
Table += '          <td class="formtwolabel"><font color="red">*</font>CBM</td>'
Table += '           <td class="formtwoInputcolumn"><input type="text" name="CBM" class="CBM" id="CBM" maxlength="8" style="width:120px;text-align: right;"></td>'
Table += '          <td class="formtwolabel"><font color="red">*</font>Ch.Wt.	</td>'
Table += '           <td class="formtwoInputcolumn"><input type="text" name="ChargeableWt" disabled="disabled" class="ChargeableWt" id="ChargeableWt" maxlength="8" style="width:120px;text-align: right;"></td>'
Table += '      </tr>'
Table += '      <tr>'
Table += '          <td class="formtwolabel"><font color="red">*</font>Commodity</td>'
Table += '          <td class="formtwoInputcolumn"><input type="hidden" name="Excommodity" id="Excommodity"><input type="text" name="Text_Excommodity" id="Text_Excommodity" data-valid="required" data-valid-msg="Select commodity" controltype="autocomplete" style="width:150px;"></td>'
Table += '          <td class="formtwolabel"><font color="red">*</font>Consignee</td>'
Table += '          <td class="formtwoInputcolumn"><input type="text" name="Text_ExConsignee" id="Text_ExConsignee" data-valid="required" data-valid-msg="Select Shipper /Consignee " controltype="autocomplete" maxlength="55" style="width:180px;text-transform: uppercase"></td>'
Table += '      </tr>'
Table += '      <tr>'
Table += '          <td class="formtwolabel"><font color="red">*</font>Shipper</td>'
Table += '          <td class="formtwoInputcolumn"><input type="text" name="Text_ExSHIPPER" id="Text_ExSHIPPER" data-valid="required" data-valid-msg="Select Shipper /Consignee " controltype="autocomplete" maxlength="55" style="width:180px;text-transform: uppercase"></td>'


Table += '          <td class="formtwolabel"> No of House</td>'
Table += '          <td class="formtwoInputcolumn"><input type="text" name="NoofHouse" class="NoofHouse" id="NoofHouse" maxlength="3" style="width:120px;text-align: right;display:block">'
    + '<input type="button" value="ADD" class="btn btn-success" id="ADDHouse" style="margin-left: 133px;margin-top: -18px;display:none"></td>'
Table += '      </tr>'
Table += '          <td class="formtwolabel"></td>'
Table += '          <td class="formtwoInputcolumn"></td>'
Table += '          <td class="formtwolabel"></td>'
Table += '          <td class="formtwoInputcolumn"><input type="button" value="Save" class="btn btn-success" id="AwbInformationSave"><input type="hidden" name="ExSHIPPER" id="ExSHIPPER"><input type="hidden" name="ExConsignee" id="ExConsignee"></td>'
Table += '      </tr>'
Table += '   </table><div id="AddNewHAWB" style="display:none"><div id="htmltableaddHawb"><div> <div id="AddNewHAWB1" style="display:none"><div id="htmltableaddHawb1"><div>'


var TableHawb = '<table style="width:100%" class="WebFormTable" id="tblehawb_1"><tbody>'
TableHawb += '<tr><td class="formtwolabel" ><font color="red">*</font><label id="tblAddhouse_HouseAWBNo_1" style="font-weight: bold;">House AWB No.</label></td>'
TableHawb += ' <td class="formtwoInputcolumn">'

TableHawb += '<input type="text" id="tblAddhouse_txthawbno_1" style="width:120px;"  maxlength="12" class="txthawbno" /> </td>'


TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_Pieces_1" style="font-weight: bold;">Pieces</label></td>'
TableHawb += '           <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawPieces_1" class="Pieces" id="tblAddhouse_hawPieces_1" maxlength="5" style="width:120px;text-align: right;"></td>'
TableHawb += '      </tr>'
TableHawb += '      <tr>'
TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_GrWt_1" style="font-weight: bold;">Gr.Wt.</label></td>'
TableHawb += '          <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawGrossWt_1" class="hawGrossWt" id="tblAddhouse_hawGrossWt_1" maxlength="8"   style="width:120px;text-align: right;"></td>'
TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_VolWt_1" style="font-weight: bold;">Vol. Wt.</label></td>'
TableHawb += '          <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawVolumeWt_1" class="hawbVolumeWt" id="tblAddhouse_hawVolumeWt_1" maxlength="8"   style="width:120px;text-align: right;"></td>'
TableHawb += '      </tr>'
TableHawb += '      <tr>'
TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_CBM_1" style="font-weight: bold;">CBM</label></td>'
TableHawb += '           <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawCBM_1" class="hawCBM" id="tblAddhouse_hawCBM_1" maxlength="8" style="width:120px;text-align: right;"></td>'
TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_ChWt_1" style="font-weight: bold;">ChargeableWt</label>	</td>'
TableHawb += '           <td class="formtwoInputcolumn"><input type="text" name="tblAddhouse_hawChargeableWt_1" disabled="disabled" class="hawChargeableWt" id="tblAddhouse_hawChargeableWt_1" maxlength="8" style="width:120px;text-align: right;"></td>'
TableHawb += '      </tr>'
TableHawb += '      <tr>'
TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_Commodity_1" style="font-weight: bold;">Commodity</label></td>'
TableHawb += '          <td class="formtwoInputcolumn"><input type="hidden" name="tblAddhouse_hawExcommodity_1" id="tblAddhouse_hawExcommodity_1"><input type="text" name="Text_tblAddhouse_hawExcommodity_1" id="Text_tblAddhouse_hawExcommodity_1" data-valid="required" data-valid-msg="Select commodity" controltype="autocomplete" style="width:150px;"></td>'
TableHawb += '<td class="formtwolabel"><label id="tblAddhouse_SHC_1" style="font-weight: bold;">SHC</label></td>'
TableHawb += '<td class="formtwoInputcolumn"><input type="hidden" name="tblAddhouse_hawSHC_1" id="tblAddhouse_hawSHC_1"><input type="text" name="Text_tblAddhouse_hawSHC_1" id="Text_tblAddhouse_hawSHC_1" data-valid="required" data-valid-msg="Select SHC" controltype="autocomplete" style="width:150px;"></td>'

TableHawb += '      </tr>'
TableHawb += '      <tr>'
TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_Shipper_1" style="font-weight: bold;">Shipper</label></td>'
TableHawb += '          <td class="formtwoInputcolumn"><input type="text" name="Text_tblAddhouse_hawExSHIPPER_1" id="Text_tblAddhouse_hawExSHIPPER_1" data-valid="required" data-valid-msg="Select Shipper /Consignee " controltype="autocomplete" maxlength="55" style="width:180px;text-transform: uppercase"></td>'
TableHawb += '          <td class="formtwolabel"><font color="red">*</font><label id="tblAddhouse_Consignee_1" style="font-weight: bold;">Consignee</label></td>'
TableHawb += '          <td class="formtwoInputcolumn"><input type="text" name="Text_tblAddhouse_hawExConsignee_1" id="Text_tblAddhouse_hawExConsignee_1" data-valid="required" data-valid-msg="Select Shipper /Consignee " controltype="autocomplete" maxlength="55" style="width:180px;text-transform: uppercase"><input type="hidden" name="tblAddhouse_hawExSHIPPER_1" id="tblAddhouse_hawExSHIPPER_1"><input type="hidden" name="tblAddhouse_hawExConsignee_1" id="tblAddhouse_hawExConsignee_1"></td>'
TableHawb += '      </tr></tbody>'
TableHawb += '   </table>'

var TableHawbfooter = '      <table id="tblfooter">'
TableHawbfooter += '      <tr>'
TableHawbfooter += '<td class="formtwolabel"><button class="append ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" type="button" title="Append Row" id="tblAddhawb_btnAppendRow" name="tblAddhawb_btnAppendRow" role="button" aria-disabled="false" style="float: left;"><span class="ui-button-icon-primary ui-icon ui-icon-plusthick"></span><span class="ui-button-text"></span></button><button class="removeLast ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" type="button" title="Remove Last Row" id="tblAddShipment_btnRemoveLast" name="tblAddShipment_btnRemoveLast" role="button" aria-disabled="false" style="float: left; display: block;"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text"></span></button></td>'
TableHawbfooter += '          <td class="formtwoInputcolumn"><input type="button" value="Save" class="btn btn-success" id="HawSave"></td>'

TableHawbfooter += '      </tr>'
TableHawbfooter += '      </table>'
