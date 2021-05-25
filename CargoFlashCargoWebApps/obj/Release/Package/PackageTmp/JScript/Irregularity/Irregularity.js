//Javascript file for Irregularity Page for binding Autocomplete
$(document).ready(function () {

    cfi.ValidateForm();
    var AWBNoPieces = '';
    var DeliveryOrderFee = "";
    var HandlingCharges = "";
    var StorageCharges = "";

    $('#aspnetForm').attr("enctype", "multipart/form-data");
    //cfi.AutoComplete("IncidentCategory", "IncidentCategory,SNo", "IrregularityIncidentCategory", "IncidentCategoryCode", "IncidentCategory", ["IncidentCategory"], OnSelectHideShow, "contains");
    cfi.AutoComplete("IncidentCategory", "IncidentCategory,SNo", "vIrregularityIncidentCategory", "IncidentCategoryCode", "IncidentCategory", ["IncidentCategory"], null, "contains");
    cfi.AutoComplete("ReportingStation", "AirportCode,SNo", "Airport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
    cfi.AutoComplete("AWBNo", "AWBNo,SNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null, "contains");
    cfi.AutoComplete("FlightNo", "FlightNo,SNo", "IrrFlightExport", "SNo", "FlightNo", ["FlightNo"], null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("#Text_ReportingStation").val(userContext.AirportCode)
        $("#ReportingStation").val(userContext.AirportSNo)
    }

    $("#SaveUpload").live("click", function () {
        //var DivID = $(this).closest('div').attr('id');
        //var mainDivID = $("#" + DivID).closest('div').attr('id');
        var visibleWindow = "divUploader";
        //visibleWindow.data("kendoWindow").close();
        $("#divUploader").data("kendoWindow").close();
    })
    $("button[id^=tblIrregularityTrans_btnAppendRow]").live("click", function () {

        if ($("#Text_AWBNo").val() == "" && $("input[type=radio][name=IsAWBLabel]:checked").val() == "0") {
            //if ($("input[type=radio][name=IsAWBLabel]:checked").val() == "1") {
            //    return false;
            //}
            ShowMessage('warning', 'Need your Kind Attention!', 'First select AWB No.');
        }
        $("#tblIrregularityTrans tr[id^=tblIrregularityTrans_Row]").each(function () {
            var id = $(this).attr('id');
            //var id1 = $("tr[id=" + id + "] td:nth-last-child(3) input[type^=text]").attr('id');
            var StatusID = $("#" + id).find('input[id^=tblIrregularityTrans_Status_]').attr('id');
            $("#" + StatusID).closest('td').hide();
            var ActionID = $("#" + id).find('input[id^=tblIrregularityTrans_Action_]').attr('id');
            $("#" + ActionID).closest('td').hide();

            var HdnDamageDiscoveredID = $("#" + id).find('input[id^=tblIrregularityTrans_HdnDamageDiscovered_]').attr('id');
            $("#" + HdnDamageDiscoveredID).val(14);
            var DamageDiscoveredID = $("#" + id).find('input[id^=tblIrregularityTrans_DamageDiscovered_]').attr('id');
            $("#" + DamageDiscoveredID).val('DURING BREAK DOWN');


        });

    })
    //$("#tblIrregularityTrans_Attachment_1").val("Attachment");

    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("button[id^=tblIrregularityTrans_btnAppendRow]").live("click", function () {
            //$("#tblIrregularityTrans tr[id=tblIrregularityTrans_Row_]").each(function () {
            //$("input[id^=tblIrregularityTrans_IdentificationRemarks_]").css({ 'rows': '2', 'cols': '100' });
            //$("input[id^=tblIrregularityTrans_IdentificationRemarks_]").attr('rows', '2');
            //$("input[id^=tblIrregularityTrans_IdentificationRemarks_]").attr('cols', '100');
            $("input[id^=tblIrregularityTrans_Attachment_]").attr('disabled', true)
            //$("input[id^=tblIrregularityTrans_Dimensions_]").attr('disabled', true)
            //})
            DisableEnable();
            DisableEnableReportsFetch();
        })

        $("#tblIrregularityTransDimension_btnUpdateAll").live("click", function () {
            ShowAlert();
            return false;
        })
    }
    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
        $("#tblIrregularityTrans tr[id^=tblIrregularityTrans_Row]").each(function () {
            var id = $(this).attr('id');
            var AttachmentID = $("tr[id=" + id + "] td:nth-last-child(2) input[type=button]").attr('id');
            //var DimensionID = $("tr[id=" + id + "]").find("input[name^=tblIrregularityTrans_Dimensions_]").attr('id');

            $("#" + AttachmentID + "").attr('disabled', false);
        })

    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("#tbl tbody tr:nth-child(3) td input[value=Save]").remove();
        $("#tbl tbody tr:nth-child(3) td input[id=MasterSaveAndNew]").remove();
        $("#tbl tbody tr:nth-child(3) td input[value=Back]").remove();
        $("#tbl tbody tr:nth-child(3) td").append("<input type='button' name='operation' value='Save' class='btn btn-success' style='width:40px'>");
        $("#tbl tbody tr:nth-child(3) td").append("<input type='submit' name='operation' id='MasterSaveAndNew' value='Save & New' class='btn btn-success'>");
        $("#tbl tbody tr:nth-child(3) td").append("<input type='button' value='Back' onclick='BackButton()' class='btn btn-inverse'>");


        //$('input[name="operation"]').removeAttr('type');
        //$('input[name="operation"]').attr('type','button');
    }


    //$("input[name^=tblIrregularityTrans_RbtnIsInspected]").live("click", function () {
    //    var InspectedID = $(this).attr("id");
    //    //var ContentType = $("#" + InspectedID).parents('td').next().find('input')[0].id;
    //    if ($("input[name^=tblIrregularityTrans_RbtnIsInspected_" + $(this).attr("id").split('_')[2] + "]:checked").val() == 0) {
    //        cfi.ResetAutoComplete($("#tblIrregularityTrans_ContentType_" + $(this).attr("id").split('_')[2])[0].id);
    //        $("#tblIrregularityTrans_ContentType_" + $(this).attr("id").split('_')[2]).data("kendoAutoComplete").enable(false)
    //    }
    //    else
    //        $("#tblIrregularityTrans_ContentType_" + $(this).attr("id").split('_')[2]).data("kendoAutoComplete").enable(true)
    //})

    $("#IsAWBLabel").closest("tr").find("td").hide();
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("#FlightDate").closest("tr").hide();
    }
    $('input:radio[name=IsAWBLabel]').change(function () { RadioButtonSelectShow(); });

    if ($("input[name^=Type]:checked").val() == 1) {
        var data = GetDataSource("AWBNo", "ImportAWB", "SNo", "AWBNo", ["AWBNo"], null);
        cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
        var data1 = GetDataSource("IncidentCategory", "vIrregularityIncidentCategoryImport", "IncidentCategoryCode", "IncidentCategory", ["IncidentCategory"], null);
        cfi.ChangeAutoCompleteDataSource("IncidentCategory", data1, true, OnSelectHideShow, "IncidentCategory", "contains");
        var data = GetDataSource("FlightNo", "IrrFlightImport", "SNo", "FlightNo", ["FlightNo"], null);
        cfi.ChangeAutoCompleteDataSource("FlightNo", data, true, GetAWBDetail, "FlightNo", "contains");
    }
    else {
        var data = GetDataSource("AWBNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null);
        cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
        var data1 = GetDataSource("IncidentCategory", "vIrregularityIncidentCategory", "IncidentCategoryCode", "IncidentCategory", ["IncidentCategory"], null);
        cfi.ChangeAutoCompleteDataSource("IncidentCategory", data1, true, OnSelectHideShow, "IncidentCategory", "contains");
        var data = GetDataSource("FlightNo", "IrrFlightExport", "SNo", "FlightNo", ["FlightNo"], null);
        cfi.ChangeAutoCompleteDataSource("FlightNo", data, true, GetAWBDetail, "FlightNo", "contains");
    }

    $("input[name^=Type]").live("click", function () {
        if ($("#FlightDate").closest("tr").css("display") != "none") {
            //$('#FlightDate').val('');
            $('#FlightNo').val('');
            $('#Text_FlightNo').val('');
            $("#FlightDate").closest("tr").hide();
        }
        if ($("input[name^=Type]:checked").val() == 1) {
            var data = GetDataSource("AWBNo", "ImportAWB", "SNo", "AWBNo", ["AWBNo"], null);
            cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
            var data1 = GetDataSource("IncidentCategory", "vIrregularityIncidentCategoryImport", "IncidentCategoryCode", "IncidentCategory", ["IncidentCategory"], null);
            cfi.ChangeAutoCompleteDataSource("IncidentCategory", data1, true, OnSelectHideShow, "IncidentCategory", "contains");
            var data = GetDataSource("FlightNo", "IrrFlightImport", "SNo", "FlightNo", ["FlightNo"], null);
            cfi.ChangeAutoCompleteDataSource("FlightNo", data, true, GetAWBDetail, "FlightNo", "contains");
        }
        else {
            var data = GetDataSource("AWBNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null);
            cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
            var data1 = GetDataSource("IncidentCategory", "vIrregularityIncidentCategory", "IncidentCategoryCode", "IncidentCategory", ["IncidentCategory"], null);
            cfi.ChangeAutoCompleteDataSource("IncidentCategory", data1, true, OnSelectHideShow, "IncidentCategory", "contains");
            var data = GetDataSource("FlightNo", "IrrFlightExport", "SNo", "FlightNo", ["FlightNo"], null);
            cfi.ChangeAutoCompleteDataSource("FlightNo", data, true, GetAWBDetail, "FlightNo", "contains");
        }
    })
    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'READ') {

        if ($("#hdnIncidentCategoryCode").val() == "MSCA" || $("#hdnIncidentCategoryCode").val() == "DMCA" || $("#hdnIncidentCategoryCode").val() == "PLCA") {
            //$("#liReport").show();
            $("#liReport").hide();
        }
        else {
            $("#liReport").hide();
        }
        if ($("#hdnIncidentCategoryCode").val() == "UDLD") {
            $("#liNND").hide();
            $("#liNND2nd").hide();
            $("#liNND3rd").hide();
            //$("#liNND").show();
            //if ($('#tabCount').val().split('-')[0] == "3") {
            //    $("#liNND2nd").show();
            //    $("#liNND3rd").show();
            //}
            //else if ($('#tabCount').val().split('-')[0] == "2") {
            //    $("#liNND2nd").show();
            //    $("#liNND3rd").hide();
            //}
            //else if ($('#tabCount').val().split('-')[0] == "1") {
            //    $("#liNND").show();
            //    $("#liNND2nd").hide();
            //    $("#liNND3rd").hide();
            //}

        }
        else {
            $("#liNND").hide();
            $("#liNND2nd").hide();
            $("#liNND3rd").hide();
        }

        if ($("#hdnIncidentCategoryCode").val() == "MSCA" || $("#hdnIncidentCategoryCode").val() == "SSPD") {
            $("#liTracing").show();
        }
        else {
            $("#liTracing").hide();
        }

        if ($('span[id="FlightDate"]').text() == "07-Jul-1977") {
            $('span[id="FlightDate"]').text('');
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        $("#liTracing").hide();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        if ($("#hdnIncidentCategoryCode").val() == "MSCA") {
            $("#spnRemainingPcs").text('Man. Pcs.');
        }
        if ($("#hdnIncidentCategoryCode").val() == "OFLD") {
            $("#spnRemainingPcs").text('Dep. Pcs.');
        }
        CreateTransGrid();
        OnSelectHideShow("", "", "", $("#hdnIncidentCategoryCode").val())
        $("input[name='Type']").attr('disabled', true);

        var TracingType = "EDIT";
        /*Get address of station which is in the awb route*/
        $.ajax({
            type: "GET",
            url: "./Services/Irregularity/IrregularityService.svc/GetAWBRoute/" + $("#hdnIrregularitySNo").val(),
            dataType: "html",
            success: function (response) {
                var AWBData = JSON.parse(response);
                AWBData = AWBData.replace('[', '').replace(']', '').replace('{', '').replace('}', '');
                if (AWBData != '') {
                    var AWBRows = AWBData.split('","')[0].split(':');
                    TracingType = AWBData.split('","')[1].split(':')[1] === '\"\"' ? "EDIT" : "VIEW";
                    var AWBRows = AWBRows[1].replace('"', '').replace('"', '');
                }
                /*Create Tracing form*/
                var strVar = "";
                //strVar += "<table class=\"tdPadding\" style=\"width:100%;cellpadding:0;cellspacing:0\"><tbody>";
                if (TracingType == "EDIT") {
                    //strVar += "<tr><td style=\"padding-left: 5px; width: 200px\">Select Message<\/td>";
                    //strVar += "<td><input name=\"messagedefault\" id=\"messagedefault\" type=\"hidden\" value=\"\"><input id=\"Text_messagedefault\" name=\"Text_messagedefault\" controltype=\"autocomplete\" type=\"text\" class=\"input-md form-control  tt-input\" style=\"font-family: Verdana; font-size: 12px; width: 320px; height: 25px; position: relative; vertical-align: top; background-color: transparent;\" autocorrect=\"off\"><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\">Message<\/td>";
                    strVar += "<td><textarea id=\"txtMessage\" style=\"width:400px;height:150px\"><\/textarea><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\">From<\/td>";
                    strVar += "<td><label style=\"width:400px;height:50px;color:#808080;font-size:medium\">info@cargoflash.com<\/label><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\">Email<\/td>";
                    strVar += "<td><textarea id=\"txtEmail\" style=\"width:400px;height:50px\"><\/textarea><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\">Other Address<\/td>";
                    strVar += "<td><input name=\"AssignTo\" id=\"AssignTo\" type=\"hidden\" value=\"\"><input id=\"Text_AssignTo\" name=\"Text_AssignTo\" controltype=\"autocomplete\" type=\"text\" class=\"input-md form-control  tt-input\" style=\"font-family: Verdana; font-size: 12px; width: 120px; height: 25px; position: relative; vertical-align: top; background-color: transparent;\" placeholder=\"Select Station\" autocorrect=\"off\"><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\"><\/td>";
                    strVar += "<td><span id=\"spnAddress\"><\/span><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\"><\/td>";
                    strVar += "<td><input id=\"btnSend\" type=\"button\" value=\"Send\" onclick=\"SendMessage();\"><\/td><\/tr>";
                }
                else {
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\">Message<\/td>";
                    strVar += "<td><span id=\"spnMessage\" style=\"width:400px;height:150px\">" + AWBData.split('","')[1].split(':')[1].replace('"', '').replace('"', '') + "<\/span><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\">Status<\/td>";
                    strVar += "<td><input name=\"hdnStatus\" id=\"hdnStatus\" type=\"hidden\" value=\"\"><input id=\"Text_Status\" name=\"Text_Status\" controltype=\"autocomplete\" type=\"text\" class=\"input-md form-control  tt-input\" style=\"font-family: Verdana; font-size: 12px; width: 120px; height: 25px; position: relative; vertical-align: top; background-color: transparent;\" placeholder=\"Select Status\" autocorrect=\"off\"><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\">Remarks<\/td>";
                    strVar += "<td><textarea id=\"txtRemarks\" style=\"width:400px;height:50px\"><\/textarea><\/td><\/tr>";
                    strVar += "<tr><td style=\"padding-left: 5px; width: 200px\"><\/td>";
                    strVar += "<td><input id=\"btnSave\" type=\"button\" value=\"Save\" onclick=\"UpdateStatus();\"><\/td><\/tr>";
                }
                //strVar += "<\/tbody><\/table>";
                strVar += "<\/br>";
                $('#tblTracing').html(strVar);
                $('#spnAddress').html(AWBRows);
                //cfi.AutoComplete("SitaAddress", "ReceivingID,SNo", "v_Irr_TracingSita", "SNo", "ReceivingID", ["ReceivingID"], GetSitaAddress, "contains");
                cfi.AutoComplete("AssignTo", "AirportCode,SNo", "Airport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
                //cfi.AutoComplete("messagedefault", "SNo", "Airport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
                var SearchDataSource = [{ Key: "A", Text: "Definitely not loaded." }, { Key: "B", Text: "Definitely loaded." }, { Key: "C", Text: "Loaded on the wrong flight." }, { Key: "D", Text: "Erroneously sent on other airlines." }];//, { Key: "Transit", Text: "Transit" }
                cfi.AutoCompleteByDataSource("messagedefault", SearchDataSource);
                $("#txtMessage").keyup(function (e) {
                    var addlen1 = $("#txtMessage").val();
                    addlen1 = addlen1.replace(/[^0-9a-zA-Z\s]/g, '');
                    $("#txtMessage").val(addlen1);
                })
                //cfi.AutoComplete("Status", "SNo", "IrregularityTracingStatus", "SNo", "TracingStatus", ["TracingStatus"], null, "contains");
            },
            error: function (er) {
                debugger
            }
        });
        $('input[name="operation"]').hide();

        $("#liTracing").click(function () {
            OpenTracing();
        });

        $("#liAction").click(function () {
            var module = "Irregularity";
            $.ajax({
                url: "Services/Irregularity/IrregularityService.svc/GetWebForm/Irregularity/" + module + "/IrregularityAction/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                success: function (result) {
                    $('#tblAction').empty();
                    $("#tblAction").html(result);
                    cfi.AutoComplete("AWBNo", "AWBNo,SNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null, "contains");
                    $("#Text_AWBNo").data("kendoAutoComplete").enable(false);
                    $("#Text_AWBNo").removeAttr('required');
                    var ActionCode = [{ Key: "1", Text: "Customer Response" }, { Key: "2", Text: "Destroy the Shipment" }, { Key: "3", Text: "Put for Auction" }];
                    cfi.AutoCompleteByDataSource("ActionCode", ActionCode);
                    $('#__tblirregularityaction__').append('<tr><td><input type="button" name="Save" value="Save" id="SaveActionNew" class="btn btn-success" style="width:60px"></td><td></td><td></td><td></td></tr>');
                    GetAwbNoForAction($('#hdnIrregularitySNo').val());
                    GetActionHistory($('#hdnIrregularitySNo').val());
                    $("#SaveActionNew").bind("click", function () {
                        if (!cfi.IsValidForm()) {
                            return false;
                        }
                        else {
                            SaveActionNew($('#hdnIrregularitySNo').val());
                        }
                    })
                }
            });
        });

        $("#liHistory").on("click", function (event) {
            var IrregularitySNo = $("#hdnIrregularitySNo").val();
            GetHistory(IrregularitySNo);
        });
        $("#liHistory").show();
    }

    $("#liReport").on("click", function (event) {
        var IrregularitySNo = $("#hdnIrregularitySNo").val();
        if (IrregularitySNo == "" || IrregularitySNo == "0")
            ShowMessage('warning', 'Warning - Irregularity Report', "Record not found.");
        else
            //window.open("HtmlFiles/Import/FCReport.html?ISNo=" + IrregularitySNo);
            $.ajax({
                url: "HtmlFiles/CargoIrregularityReport/IrregularityReport.html",
                async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                success: function (result) {

                    $("#tblIrregularityReport").html(result);
                    GetDeliveryOrderPrint(IrregularitySNo)
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var inventoryDate = new Date();
                    var CurrentDate = inventoryDate.getUTCDate() + "-" + (monthNames[inventoryDate.getUTCMonth()]) + "-" + inventoryDate.getUTCFullYear();
                    $("#spnDate1").text(CurrentDate);
                    $("#spnDate2").text(CurrentDate);
                    //if (result != undefined || result != "") {
                    //    InitializePage(subprocess, "divDetail", isdblclick);
                    //    $("#Validate").addClass("btn-info");
                    //}
                },
                //beforeSend: function (jqXHR, settings) {
                //},
                //complete: function (jqXHR, textStatus) {
                //},
                error: function (xhr) {
                    // var a = "";
                }
            });
    })

    $("#liNND,#liNND2nd,#liNND3rd").on("click", function (event) {
        var IrregularitySNo = $("#hdnIrregularitySNo").val();
        var TableID = $(this).attr('id');
        if (IrregularitySNo == "" || IrregularitySNo == "0")
            ShowMessage('warning', 'Warning - Irregularity Report', "Record not found.");
        else
            //window.open("HtmlFiles/Import/FCReport.html?ISNo=" + IrregularitySNo);
            $.ajax({
                url: "HtmlFiles/CargoIrregularityReport/NonDelivery.html",
                async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var TabCount = '';
                    if (TableID == "liNND2nd") {
                        $("#tblNND").html('');
                        $("#tblNND3rd").html('');
                        $("#tblNND2nd").html(result);
                        TabCount = 2;
                    } else if (TableID == "liNND3rd") {
                        $("#tblNND").html('');
                        $("#tblNND2nd").html('');
                        $("#tblNND3rd").html(result);
                        TabCount = 3;
                    } else {
                        $("#tblNND2nd").html('');
                        $("#tblNND3rd").html('');
                        $("#tblNND").html(result);
                        TabCount = 1;
                    }

                    GetNNDPrint(IrregularitySNo, TabCount, TableID);
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var inventoryDate = new Date();
                    var CurrentDate = inventoryDate.getUTCDate() + "-" + (monthNames[inventoryDate.getUTCMonth()]) + "-" + inventoryDate.getUTCFullYear();
                    $("#SpnDate").text(CurrentDate);
                    //$("#SpnConsignee").text('abasdkfjsdf');
                    //$("#SpnNo").text('009525');
                    //$("#SpnDate").text('12-09-16');
                    //$("#SpnShipper").text('abasdkfjsdf');
                    //$("#spnAWBNumber").text('514-12344567');
                    //$("#SpnOrigin").text('SHJ');
                    //$("#SpnDestination").text('DEL');
                    //$("#SpnCC").text('PP');
                    //$("#SpnFlightDetails").text('UAE 9555T 12-12-16 07:09');
                    //$("#spnPcs").text('1/1');
                    //$("#SpnWeight").text('61.000/61.000');
                    //$("#SpnDescription").text('Used Survey Equipment');
                    $('#spnRemarks1').text('Undelivered goods will be auctioned by customs after 6 months from the date of arrival. The Total Charges Due on the shipment is given below. Storage Charges accruing from 61st Day till auction will be 0.20Fils/Kg/Day and charges will debited to airline account.');


                    $('#SpnRemarks2').text('Free storage according to part shipment arrival if any. Charges are rounded up @ AED 5.00');
                    //GetDeliveryOrderPrint(IrregularitySNo)
                    //var inventoryDate = new Date();
                    //var CurrentDate = inventoryDate.getUTCDate() + "-" + ('0' + (parseInt(inventoryDate.getUTCMonth() + 1))).slice(-2) + "-" + inventoryDate.getUTCFullYear();
                    //$("#spnDate1").text(CurrentDate);
                    //$("#spnDate2").text(CurrentDate);
                    //if (result != undefined || result != "") {
                    //    InitializePage(subprocess, "divDetail", isdblclick);
                    //    $("#Validate").addClass("btn-info");
                    //}
                },
                //beforeSend: function (jqXHR, settings) {
                //},
                //complete: function (jqXHR, textStatus) {
                //},
                error: function (xhr) {
                    // var a = "";
                }
            });
    })

    $('input[name="operation"]').click(function (e) {
        var strData1 = [];
        var IncidentCategory = $("#IncidentCategory").val();
        var strData = "";
        //if (!cfi.IsValidTransSection("divIrregularityTrans")) {
        //    return false;
        //}

        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            //if ($("#AWBNo").val() == "") {
            //    return
            //}
            //else {
            var abc = "";
            if ($("#IncidentCategory").val() == "PLCA") {
                $("#tblIrregularityTrans tr[id^=tblIrregularityTrans_Row]").each(function () {
                    var id = $(this).attr('id');
                    var ValueID = $("tr[id=" + id + "] input[name^=tblIrregularityTrans_Value_").attr('id');
                    $("#" + ValueID + "").val("0");
                })
            }
            if ($("#IncidentCategory").val() == "MSCA") {
                $("#tblIrregularityTrans tr[id^=tblIrregularityTrans_Row]").each(function () {
                    var id = $(this).attr('id');
                    var WeightID = $("tr[id=" + id + "] input[name^=tblIrregularityTrans_Weight_").attr('id');
                    if ($("#" + WeightID + "").val() == "") {
                        $("#" + WeightID + "").val("0");
                    }
                })
            }
            if (!cfi.IsValidForm()) {
                return false;
            }
            else {
                cfi.IsValidSubmitSection();
                var rows = $("tr[id^='tblIrregularityTrans']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
                for (var i = 0; i < rows.length; i++) {
                    if (!validateTableData("tblIrregularityTrans", rows[i])) {
                        return false;
                    }
                }
                if ($("#IncidentCategory").val() == 'SSPD') {
                    AWBNoPieces = parseFloat($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(5)").text().split('/')[1]);
                    var Save = true;
                    if (AWBNoPieces) {
                        $("#tblIrregularityTrans tr[id^=tblIrregularityTrans_Row]").each(function () {
                            var id = $(this).attr('id');
                            var PiecesID = $("tr[id=" + id + "] input[name^=tblIrregularityTrans_Pieces_").attr('id');
                            if ($("#" + PiecesID + "").val() == AWBNoPieces) {
                                ShowMessage('info', 'Short Shipped!', "For " + $("#" + PiecesID + "").val() + " Pieces SHORT SHIPPED can not be raised.", "bottom-right");
                                Save = false;
                                return;
                            }
                        })
                        if (!Save) {
                            return;
                        }
                    }
                }
                getUpdatedRowIndex(rows.join(","), "tblIrregularityTrans");
                if ($("#IncidentCategory").val() == "MSCA" || $("#IncidentCategory").val() == "PLCA") {
                    $("#tblIrregularityTrans").find("tr[id^='tblIrregularityTrans']").each(function (index, row) {
                        var Data = {
                            SNo: index + 1,
                            HAWBNo: $(row).find("[id^=tblIrregularityTrans_HdnHAWBNo_]").val() == "" ? 0 : $(row).find("[id^=tblIrregularityTrans_HdnHAWBNo_]").val(),
                            Pieces: $(row).find("[id^=tblIrregularityTrans_Pieces_]").val(),
                            Weight: $(row).find("[id^=tblIrregularityTrans_Weight_]").val() == "" ? null : $(row).find("[id^=tblIrregularityTrans_Weight_]").val(),
                            PackingSNo: $(row).find("[id^=tblIrregularityTrans_HdnPacking_]").val() == "" ? 0 : $(row).find("[id^=tblIrregularityTrans_HdnPacking_]").val(),
                            IdentificationRemarks: $(row).find("[id^=tblIrregularityTrans_IdentificationRemarks_]").val(),
                            EventSNo: $(row).find("[id^=tblIrregularityTrans_HdnPilferageDiscovered_]").val() == undefined ? 0 : $(row).find("[id^=tblIrregularityTrans_HdnPilferageDiscovered_]").val(),
                            PoliceReportFiled: $(row).find("input[id^=tblIrregularityTrans_RbtnIsReport_]:checked").val(),
                            //$(row).find("[id^=tblIrregularityTrans_HdnPilferageDiscovered_]").val(),
                            EstimatedValue: $(row).find("[id^=tblIrregularityTrans_Value_]").val() == undefined ? 0 : $(row).find("[id^=tblIrregularityTrans_Value_]").val(),
                            PoliceReportFilingDate: $(row).find("input[id^=tblIrregularityTrans_RbtnIsReport_]:checked").val() == "0" ? null : ($(row).find("[id^=tblIrregularityTrans_ReportDate_]").val() == undefined ? null : $(row).find("[id^=tblIrregularityTrans_ReportDate_]").val()),
                            PoliceReportFilingPlace: $(row).find("input[id^=tblIrregularityTrans_RbtnIsReport_]:checked").val() == "0" ? 0 : ($(row).find("[id^=tblIrregularityTrans_HdnPlace_]").val() == undefined ? 0 : $(row).find("[id^=tblIrregularityTrans_HdnPlace_]").val()),
                            PoliceReportFilingRemarks: $(row).find("input[id^=tblIrregularityTrans_RbtnIsReport_]:checked").val() == "0" ? "" : ($(row).find("[id^=tblIrregularityTrans_Remarks_]").val() == undefined ? "" : $(row).find("[id^=tblIrregularityTrans_Remarks_]").val()),
                            DamageSNo: 0,
                            IsInspected: 0,
                            ContentType: 0,
                            Reason: 0,
                            IrregularityStatusSNo: 0,
                            PoliceReportFilePath: "",
                            ClosingRemarks: "",
                            ClosingFlightNo: "",
                            ClosingFlightDate: null,
                            OnHold: 0,
                            OnHoldSince: null,
                            UnHoldAt: null,
                            IsMisrouted: 0,
                            NonDeliveryReasonSNo: 0,
                            AlternateDeliveryAddress: "",
                            DisposalAdviceSNo: 0,
                            DateOfShipmentDestruction: null,
                            CostOfShipmentDestruction: null,
                            DateOfShipmentAuction: null,
                            AmountRecoveredFromAuction: null,
                            hdnChildData: $(row).find("[id^=tblIrregularityTrans_hdnChildData_]").val()
                        }
                        strData1.push(Data);
                    });
                }
                else {
                    strData = $('#tblIrregularityTrans').appendGrid('getStringJson');
                }
                var Mail = '';
                if ($("#IncidentCategory").val() == "MSMB" || $("#IncidentCategory").val() == "FDMB" || $("#IncidentCategory").val() == "MSAV" || $("#IncidentCategory").val() == "FDAV") {
                    Mail = '1';
                }
                var ReportingStation = parseInt($("#ReportingStation").val());
                var IsAWBLabel = $("input[name='IsAWBLabel']:checked").val() == 0 ? true : false;
                var AWBNo = Mail == "1" ? '' : $("#AWBNo").val();
                var Type = $("input[name^=Type]:checked").val();
                var AirportSNo = userContext.AirportSNo;
                var DailyFlightSNo = $("#IncidentCategory").val() == "FDCA" ? 0 : $('#FlightNo').val();
                var POMailSNo = Mail == "1" ? $("#AWBNo").val() : "";

                $.ajax({
                    url: "Services/Irregularity/IrregularityService.svc/SaveIrregularity", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                    //?ReportingStation=" + ReportingStation + "&IncidentCategory=" + IncidentCategory + "&IsAWBLabel=" + IsAWBLabel + "&AWBNo=" + AWBNo + "&strData=" + strData + "&Type=" + Type + "&strData1=" + strData1,
                    data: JSON.stringify({ ReportingStation: ReportingStation, IncidentCategory: IncidentCategory, IsAWBLabel: IsAWBLabel, AWBNo: AWBNo, POMailSNo: POMailSNo, strData: strData, Type: Type, strData1: strData1, AirportSNo: AirportSNo, DailyFlightSNo: DailyFlightSNo }),
                    success: function (response) {
                        var abc = response[0];
                        if (abc == '0') {
                            ShowMessage('info', 'Already Exists!', "Selected Incident Category and AWB No. already exists.", "bottom-right");
                        } else {
                            navigateUrl('Default.cshtml?Module=Irregularity&Apps=Irregularity&FormAction=EDIT&RecID=' + abc);
                            ShowMessage('success', 'Success!', "Saved Successfully");
                        }
                    },
                    error: function (er) {
                        debugger
                    }
                });
                //}
            }
        }
    });
});

function OpenTracing() {
    $.ajax({
        type: "GET",
        url: "./Services/Irregularity/IrregularityService.svc/GetTracingDetail/" + $("#hdnIrregularitySNo").val(),
        dataType: "html",
        //success: function (response) {
        //    var AWBData = JSON.parse(response);
        //    AWBData = AWBData.replace('[', '').replace(']', '').replace('{', '').replace('}', '');
        //    if (AWBData != "") {
        //        var AWBRows = AWBData.split(',');
        //        var strResult = "<tr><td colspan=4>";
        //        strResult += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" align=\"left\" colspan=\"" + AWBRows.length + "\">AWB Details<\/td><\/tr>";
        //        strResult += "<tr style=\"font-weight: bold\">";
        //        for (var i in AWBRows) {
        //            strResult += "<td class=\"ui-widget-header\">" + AWBRows[i].split(':')[0].replace('"', '').replace('"', '') + "<\/td>";
        //        }
        //        strResult += "<\/tr><tr>";
        //        for (var i in AWBRows) {
        //            strResult += "<td class=\"ui-widget-content\">" + AWBRows[i].split(':')[1].replace('"', '').replace('"', '') + "<\/td>";
        //        }
        //        strResult += "<\/tr><\/tbody>";
        //        strResult += "<\/table><\/td><\/tr>";
        //        strResult += "<\/br>";
        //        $('#tblTracing').append(strResult);
        //    }
        //},
        success: function (response) {
            var strVar = "<\/br>";
            var AWBDatas = jQuery.parseJSON(response);
            var AWBData = JSON.parse(AWBDatas);
            var columnNo = 0;
            for (var j in AWBData[0]) {
                columnNo = columnNo + 1;
            }
            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" height=20px; align=\"left\" colspan=\"" + columnNo + "\">Assigning Details<\/td><\/tr>";
            for (var j in AWBData[0]) {
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
            }
            //strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Details</td>";
            strVar += "<\/tr>";

            for (var i in AWBData) {
                strVar += "<tr>";
                for (var j in AWBData[i]) {
                    strVar += "<td class=\"ui-widget-content\">" + AWBData[i][j] + "<\/td>";
                }
                //strVar += "<td class=\"ui-widget-content\"><input type=\"button\" id=\"btnDetails\" value=\"Details\" onclick=\"GetDetails('" + AWBData[i]["IrregularitySNo"] + "','" + (AWBData[i]["ActionSNo"] == '' ? 0 : AWBData[i]["ActionSNo"]) + "')\"><\/td>";
                //"," + AWBData[i]["ActionSNo"] +
                strVar += "<\/tr>";
            }
            strVar += "<\/tbody>";
            strVar += "<\/table>";
            strVar += "<\/br>";
            $('#tblTracingHistory').html(strVar);
        },
        error: function (er) {
            debugger
        }
    });
}

function GetSitaAddress(valueId, value, keyId, key) {
    if ($('#spnAddress').html().indexOf(value) === -1)
        //$('#spnAddress').html($('#spnAddress').html() + "," + value);
        $('#spnAddress').html($('#spnAddress').html() + value + ",");

}

function OnSelectHideShow(valueId, value, keyId, key) {
    if (key != "") {
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            if ($("#FlightDate").closest("tr").css("display") != "none") {
                //$('#FlightDate').val('');
                $('#FlightNo').val('');
                $('#Text_FlightNo').val('');
                $("#FlightDate").closest("tr").hide();
                if ($('#Text_AWBNo').val()) {
                    $('#Text_AWBNo').val('');
                    $('#AWBNo').val('');
                }
            }
        }

        $("#spnAWBNo").closest('tr').css("display", "block");
        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'READ') {
            if (key == "FDCA" || key == "MSAW" || key == "OVCD") {
                key = "DMCA";
            }
        }

        if (key == "MSCA" || key == "PLCA" || key == "SSPD" || key == "FDAW" || key == "DMCA" || key == "UDLD" || key == "OFLD" || key == "MSMB" || key == "FDMB" || key == "MSAV" || key == "FDAV") {
            $("#IsAWBLabel").closest("tr").find("td").hide();
            $("#IsAWBLabel").closest("tr").find("td:gt(1)").css("display", "");
            $("#IsAWBLabel").closest("tr").css("display", "");
            $("#IsAWBLabel").attr('value', 0);
            CreateTransGrid();
            if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
                $('#tblIrregularityTrans').appendGrid('insertRow', 1, 0);
                DisableEnable();
                DisableEnableReportsFetch();
                $("#tblIrregularityTrans tr[id^=tblIrregularityTrans_Row]").each(function () {
                    var id = $(this).attr('id');
                    //var id1 = $("tr[id=" + id + "] td:nth-last-child(3) input[type^=text]").attr('id');
                    var StatusID = $("#" + id).find('input[id^=tblIrregularityTrans_Status_]').attr('id');
                    $("#" + StatusID).closest('td').hide();
                    var ActionID = $("#" + id).find('input[id^=tblIrregularityTrans_Action_]').attr('id');
                    $("#" + ActionID).closest('td').hide();

                    var HdnDamageDiscoveredID = $("#" + id).find('input[id^=tblIrregularityTrans_HdnDamageDiscovered_]').attr('id');
                    $("#" + HdnDamageDiscoveredID).val(14);
                    var DamageDiscoveredID = $("#" + id).find('input[id^=tblIrregularityTrans_DamageDiscovered_]').attr('id');
                    $("#" + DamageDiscoveredID).val('DURING BREAK DOWN');
                    $("input[id^=tblIrregularityTrans_Attachment_]").attr('disabled', true);
                });
            }

            $('br:gt(1)').remove();
        }
        else {
            $("#IsAWBLabel").closest("tr").find("td").hide();
            $("#IsAWBLabel").closest("tr").find("td:lt(2)").css("display", "");
            $("#IsAWBLabel").closest("tr").css("display", "");
            RadioButtonSelectShow();
        }
        if (key != "FDCA") {
            $('#FlightDate').attr("required", "required");
            $('#Text_FlightNo').attr("required", "required");
            $('#FlightDate').attr('data-valid', 'required');
            $('#Text_FlightNo').attr('data-valid', 'required');
            $('#spnFlightDate').closest('td').find('font').text('*');
            $('#spnFlightNo').closest('td').find('font').text('*');
        }
        //if (key == "OVCD") {
        //    var data = GetDataSource("AWBNo", "vOffLoadedCargo_AWB", "SNo", "AWBNo", ["AWBNo"], null);
        //    cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, GetAWBDetail, "AWBNo", "contains");
        //}
        if (key == "SSPD" || key == "OFLD") {
            var data = GetDataSource("AWBNo", "vClosedShipment_AWB", "SNo", "AWBNo", ["AWBNo"], null);
            cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
        }
        else if (key == "OVCD") {
            var data = GetDataSource("AWBNo", "vOffLoadedCargo_AWB", "SNo", "AWBNo", ["AWBNo"], null);
            cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
        }
        if (key == "DMCA") {
            if ($("input[name^=Type]:checked").val() == 1) {
                var data = GetDataSource("AWBNo", "ImportAWB", "SNo", "AWBNo", ["AWBNo"], null);
                cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
            }
            else {
                var data = GetDataSource("AWBNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null);
                cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");

                var data1 = GetDataSource("FlightNo", "IrrFlightAfterRCS", "SNo", "FlightNo", ["FlightNo"], null);
                cfi.ChangeAutoCompleteDataSource("FlightNo", data1, true, null, "FlightNo", "contains");
            }
        }
        else if (key == "MSMB" || key == "FDMB" || key == "MSAV" || key == "FDAV") {
            var data = GetDataSource("AWBNo", "POMailDetail", "SNo", "CN38No", ["CN38No"], null);
            cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "CN38No", "contains");

            var data1 = GetDataSource("FlightNo", "IrrFlightImport", "SNo", "FlightNo", ["FlightNo"], null);
            cfi.ChangeAutoCompleteDataSource("FlightNo", data1, true, null, "FlightNo", "contains");

            $('#spnAWBNo').text(' CN No.');
        }
        else if (key == "UDLD") {
            var data = GetDataSource("AWBNo", "vphysicalDelivery_AWB", "SNo", "AWBNo", ["AWBNo"], null);
            cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
        }
        else if (key == "FDCA") {
            var data = GetDataSource("AWBNo", "vphysicalDelivery_AWB", "SNo", "AWBNo", ["AWBNo"], null);
            cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");

            var data1 = GetDataSource("FlightNo", "IrrFlightImport", "SNo", "FlightNo", ["FlightNo"], null);
            cfi.ChangeAutoCompleteDataSource("FlightNo", data1, true, null, "FlightNo", "contains");
        }
        else {
            if ($("input[name^=Type]:checked").val() == 1) {
                var data = GetDataSource("AWBNo", "ImportAWB", "SNo", "AWBNo", ["AWBNo"], null);
                cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
            }
            else {
                var data = GetDataSource("AWBNo", "AWB", "SNo", "AWBNo", ["AWBNo"], null);
                cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, HideFlightDtl, "AWBNo", "contains");
            }
        }
    }
}

function RadioButtonSelectShow() {
    $("#IsAWBLabel").closest("tr").find("td:gt(1)").css("display", "");
    $("#IsAWBLabel").closest("tr").css("display", "");
    if ($("input[name='IsAWBLabel']:checked").val() == 0) {
        $("#IsAWBLabel").closest("tr").find("td:gt(1)").css("display", "");
        $("#IsAWBLabel").closest("tr").css("display", "");
        $("#Text_AWBNo").attr({ "required": "required", "data-valid": "required" });
        $("#Text_FlightNo").attr({ "required": "required", "data-valid": "required" });
        CreateTransGrid();
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            $('#tblIrregularityTrans').appendGrid('insertRow', 1, 0);
            $("#tblIrregularityTrans tr[id^=tblIrregularityTrans_Row]").each(function () {
                var id = $(this).attr('id');
                //var id1 = $("tr[id=" + id + "] td:nth-last-child(3) input[type^=text]").attr('id');
                var StatusID = $("#" + id).find('input[id^=tblIrregularityTrans_Status_]').attr('id');
                $("#" + StatusID).closest('td').hide();
                var ActionID = $("#" + id).find('input[id^=tblIrregularityTrans_Action_]').attr('id');
                $("#" + ActionID).closest('td').hide();

                var HdnDamageDiscoveredID = $("#" + id).find('input[id^=tblIrregularityTrans_HdnDamageDiscovered_]').attr('id');
                $("#" + HdnDamageDiscoveredID).val(14);
                var DamageDiscoveredID = $("#" + id).find('input[id^=tblIrregularityTrans_DamageDiscovered_]').attr('id');
                $("#" + DamageDiscoveredID).val('DURING BREAK DOWN');
                $("input[id^=tblIrregularityTrans_Attachment_]").attr('disabled', true);
            });
        }
    }
    else {
        $("#Text_AWBNo").removeAttr('required');
        $("#Text_AWBNo").removeAttr('data-valid');
        $("#Text_FlightNo").removeAttr('required');
        $("#Text_FlightNo").removeAttr('data-valid');
        $("#IsAWBLabel").closest("tr").find("td").hide();
        $("#IsAWBLabel").closest("tr").find("td:lt(2)").css("display", "");
        $("#IsAWBLabel").closest("tr").css("display", "");
        CreateTransGrid();
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            $('#tblIrregularityTrans').appendGrid('insertRow', 1, 0);
            $("#tblIrregularityTrans tr[id^=tblIrregularityTrans_Row]").each(function () {
                var id = $(this).attr('id');
                //var id1 = $("tr[id=" + id + "] td:nth-last-child(3) input[type^=text]").attr('id');
                var StatusID = $("#" + id).find('input[id^=tblIrregularityTrans_Status_]').attr('id');
                $("#" + StatusID).closest('td').hide();
                var ActionID = $("#" + id).find('input[id^=tblIrregularityTrans_Action_]').attr('id');
                $("#" + ActionID).closest('td').hide();

                var HdnDamageDiscoveredID = $("#" + id).find('input[id^=tblIrregularityTrans_HdnDamageDiscovered_]').attr('id');
                $("#" + HdnDamageDiscoveredID).val(14);
                var DamageDiscoveredID = $("#" + id).find('input[id^=tblIrregularityTrans_DamageDiscovered_]').attr('id');
                $("#" + DamageDiscoveredID).val('DURING BREAK DOWN');
                $("input[id^=tblIrregularityTrans_Attachment_]").attr('disabled', true);
            });
        }
    }
    $('br:gt(1)').remove();
}

function GetAWBDetail(valueId, value, keyId, key) {
    if (key != "") {
        var typeID = $("input[name^=Type]:checked").val();
        var IrregularityType = $("#IncidentCategory").val();
        $.ajax({
            type: "GET",
            url: "Services/Irregularity/IrregularityService.svc/GetAWBDetail?AWBNo=" + $('#AWBNo').val() + "&Type=" + parseInt(typeID) + "&IrregularityType=" + IrregularityType + "&DailyFlightSNo=" + ($('#FlightNo').val() ? $('#FlightNo').val() : 0),
            dataType: "html",
            success: function (response) {
                var GetAWBtable = jQuery.parseJSON(response)
                var GetAWBtableDetail = JSON.parse(GetAWBtable)
                if (GetAWBtableDetail[0].SHP == "0" && GetAWBtableDetail[0].AirportCode == "0" && GetAWBtableDetail[0].CON == "0") {
                    ShowMessage('warning', 'Need your Kind Attention!', GetAWBtableDetail[0].Message);
                    $("#Text_AWBNo").val('');
                    $('#FlightNo').val('');
                    $('#Text_FlightNo').val('');
                    return;
                }
                var GridText = "";
                if (IrregularityType == 'PLCA') {
                    GridText = 'Shipment Details';
                }
                else if (IrregularityType == 'MSMB' || IrregularityType == 'FDMB' || IrregularityType == 'MSAV' || IrregularityType == 'FDAV') {
                    GridText = 'CN No. Details';
                }
                else {
                    GridText = 'AWB Details';
                }
                if (GetAWBtableDetail.length > 0) {
                    var strVar = "";
                    var columnNo = 0;
                    for (var j in GetAWBtableDetail[0]) {
                        columnNo = columnNo + 1;
                    }
                    strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                    strVar += "<tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"" + columnNo + "\">" + GridText + "<\/td><\/tr>";
                    strVar += "<tr style=\"font-weight: bold\">";
                    for (var j in GetAWBtableDetail[0]) {
                        if ($(j).selector != "AWBSNo") {
                            if ($(j).selector != "SNo") {
                                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
                            }
                        }
                    }
                    if ($('#IncidentCategory').val() == "MSMB" || $('#IncidentCategory').val() == "FDMB" || $('#IncidentCategory').val() == "MSAV" || $('#IncidentCategory').val() == "FDAV") {

                    } else {
                        strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Dimensions</td>";
                    }

                    strVar += "<\/tr>";
                    for (var i in GetAWBtableDetail) {
                        strVar += "<tr>";
                        for (var j in GetAWBtableDetail[i]) {
                            if ($(j).selector != "AWBSNo") {
                                if ($(j).selector != "SNo") {
                                    strVar += "<td class=\"ui-widget-content\">" + GetAWBtableDetail[i][j] + "<\/td>";
                                }
                            }
                        }
                        if ($('#IncidentCategory').val() == "MSMB" || $('#IncidentCategory').val() == "FDMB" || $('#IncidentCategory').val() == "MSAV" || $('#IncidentCategory').val() == "FDAV") {

                        } else {
                            strVar += "<td class=\"ui-widget-content\"><input type=\"button\" id=\"btnDimension\" value=\"Dimension\" onclick=\"GetAWBDimDetails(" + GetAWBtableDetail[i]["AWBSNo"] + ")\"><\/td>";
                        }
                        strVar += "<\/tr>";
                    }
                    strVar += "<\/tbody>";
                    strVar += "<\/table>";
                    //strVar += "<\/br>";
                    $('#divGetAWBDetail').html(strVar);
                }
            },
            error: function (er) {
                debugger
            }
        })
    }
}


function GetHistory(IrregularitySNo) {

    //var typeID = $("input[name^=Type]:checked").val();
    var IrregularityType = $("#IncidentCategory").val();
    $.ajax({
        type: "GET",
        url: "Services/Irregularity/IrregularityService.svc/GetHistory?IrregularitySNo=" + IrregularitySNo + "&IrregularityType=" + IrregularityType,
        dataType: "json",
        success: function (response) {
            var strVar = "<\/br>";
            var AWBData = JSON.parse(response);
            var columnNo = 0;
            for (var j in AWBData[0]) {
                columnNo = columnNo + 1;
            }
            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" height=20px; align=\"left\" colspan=\"" + columnNo + "\">Irregularities History Details<\/td><\/tr>";
            for (var j in AWBData[0]) {
                if ($(j).selector != "IrregularitySNo" && $(j).selector != "ActionSNo")
                    strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
            }
            strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Details</td>";
            strVar += "<\/tr>";

            for (var i in AWBData) {
                strVar += "<tr>";
                for (var j in AWBData[i]) {
                    if ($(j).selector != "IrregularitySNo" && $(j).selector != "ActionSNo")
                        strVar += "<td class=\"ui-widget-content\">" + AWBData[i][j] + "<\/td>";
                }
                strVar += "<td class=\"ui-widget-content\"><input type=\"button\" id=\"btnDetails\" value=\"Details\" onclick=\"GetDetails('" + AWBData[i]["IrregularitySNo"] + "','" + (AWBData[i]["ActionSNo"] == '' ? 0 : AWBData[i]["ActionSNo"]) + "')\"><\/td>";
                //"," + AWBData[i]["ActionSNo"] +
                strVar += "<\/tr>";
            }
            strVar += "<\/tbody>";
            strVar += "<\/table>";
            strVar += "<\/br>";
            $('#tblHistory').html(strVar);
        },
        error: function (er) {
            debugger
        }
    });

}

var pageType = $('#hdnPageType').val();
function CreateTransGrid() {
    //OFLD
    var gridType = pageType == "NEW" ? $("#IncidentCategory").val() : $("#hdnIncidentCategoryCode").val()
    var labelType = $("input[name='IsAWBLabel']:checked").val() == undefined ? 0 : $("input[name='IsAWBLabel']:checked").val();
    var dbtableName = "IrregularityTrans";
    var Parameter = $("#IncidentCategory").val() + '-' + $("input[name='IsAWBLabel']:checked").val();
    var UploadSNo = $("#hdnIrregularitySNo").val();
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        masterTableSNo: $("#hdnIrregularitySNo").val(),
        currentPage: 1, itemsPerPage: 10, whereCondition: Parameter, sort: "",
        servicePath: "./Services/Irregularity/IrregularityService.svc",
        getRecordServiceMethod: "GetIrregularityTransRecord",
        createUpdateServiceMethod: "Update" + dbtableName,
        caption: gridType == "MSCA" ? "Missing Cargo" : gridType == "PLCA" ? "Pilfered Cargo" : gridType == "SSPD" ? "Short Shipped Cargo" : gridType == "FDAW" ? "Found AWB" : gridType == "DMCA" ? "Damaged Cargo" : gridType == "UDLD" ? "Undelivered Cargo" : gridType == "FDCA" ? "Found Cargo" : gridType == "OVCD" ? "Over Carried Cargo" : gridType == "MSAW" ? "Missing AWB" : gridType == "MSMB" ? "MISSING MAIL" : gridType == "FDMB" ? "FOUND MAIL" : gridType == "MSAV" ? "MISSING MAIL DOCUMENT" : gridType == "FDAV" ? "FOUND MAIL DOCUMENT" : "Offloaded",
        initRows: 1,
        columns: pageType == "NEW" || pageType == "EDIT" ? (gridType == "MSCA" ? ([{ name: "SNo", type: "hidden", value: 0 },
                 { name: "IrregularityTransSNo", type: "hidden", value: 0 },
                 { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
                 { name: "HAWBPcs", type: "hidden", value: 0 },
                 //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
                 {
                     name: "HAWBNo", display: "HAWB No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
                 },
                 { name: "Pieces", display: "Pieces", type: "text", ctrlCss: { width: "60px" }, ctrlAttr: { controltype: "range", allowchar: '0!10000000', maxlength: 10, onBlur: "PiecesValue(this)" }, isRequired: true },
                 { name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" } },
                 //{ name: "Dimensions", display: "Dimensions", type: "text", ctrlCss: { width: "150px", }, ctrlAttr: { controltype: "default", maxlength: 200, oninput: "this.value = this.value.replace(/[^0-9,]/g, '');" }, isRequired: true },
                 {
                     name: 'Dimensions', display: 'Dimensions', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Dimensions', ctrlCss: { width: '110px' }, onClick: function (evt, rowIndex) {
                         var IrregularitySNo = UploadSNo;
                         var BttnID = evt.target.id;
                         var trID = $("#" + BttnID + "").closest('tr').attr('id');
                         var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                         PopupDiv(BttnID, IrregularitySNo, IrregularityTransSNo);
                         //CreateTransDimensionGrid(IrregularitySNo, IrregularityTransSNo);
                     }
                 },
                 { name: "Packing", display: "Packing", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: "IrregularityPacking", textColumn: "PackingName", keyColumn: "SNo" },
                 { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "200px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 490 } },
                {
                    name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                        var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                        var BttnValue = $('#' + BttnID).val();
                        var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                        var SelectedItem = evt.item.context.innerText;
                        var IrregularitySNo = UploadSNo;
                        var trID = $("#" + BttnID + "").closest('tr').attr('id');
                        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                        var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                        if (SelectedItem == 'CLOSED') {
                            $('#' + PiecesID).attr('disabled', true);
                        }
                        else {
                            if ($('#' + PiecesID).attr('disabled')) {
                                $('#' + PiecesID).attr('disabled', false);
                            }
                        }
                    }
                },
                {
                    name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                        //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                        //    var trID = $(this).attr('id');
                        //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                        //})
                        var IrregularitySNo = UploadSNo;
                        var BttnID = evt.target.id;
                        var trID = $("#" + BttnID + "").closest('tr').attr('id');
                        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                        Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                    }
                },
                //{
                //    name: "Attachment", dislplay: "Attachment", type: "button", value: 'Attachment', onClick: function () {
                //        var IrregularitySNo = UploadSNo;
                //        var IrregularityTransSNo = $("#tblIrregularityTrans_IrregularityTransSNo_1").val();
                //        Upload(IrregularitySNo, gridType, IrregularityTransSNo);
                //    }, ctrlAttr: { Title: 'Attachment' }
                //},
                { name: "IncidentCategory", type: "hidden", value: 0 },
                { name: "IsAWBLabel", type: "hidden", value: 0 },
                {
                    name: 'hdnChildData', type: 'hidden', value: 0
                },
                {
                    name: "HdnPieces", type: "hidden", value: 0
                }
                 //{
                 //     name: 'Duration', display: 'Total Duration', type: 'custom',
                 //     customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                 //         var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                 //         var ctrl = document.createElement('span');
                 //         $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                 //         $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_Hour', value: 'Button', onclick: 'alert("a")' }).css('width', '120px').appendTo(ctrl).button();
                 //         return ctrl;
                 //     }
                 // }
                 //{
                 //    name: 'UploadDocument', display: 'Upload Document', type: 'custom', value: '0:00:00',
                 //    customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                 //        // Prepare the control ID/name by using idPrefix, column name and uniqueIndex
                 //        var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                 //        // Create a span as a container
                 //        var ctrl = document.createElement('span');
                 //        // Set the ID and name to container and append it to parent control which is a table cell
                 //        $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                 //        // Create extra controls and add to container
                 //        $('<input>', {
                 //            type: 'button', id: ctrlId + '_TEST', name: ctrlId + '_TEST', value: "as"
                 //        }).css('width', '50px').appendTo(ctrl);
                 //        // Finally, return the container control
                 //        return ctrl;
                 //    }
                 //},
                 //{ name: 'Album', display: 'Album', type: 'button', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '100px' }, click: function (evt, rowIndex) { alert('You have changed the value of `Album` at row ' + rowIndex); } }
                 //UploadDocument
        ]) : gridType == "PLCA" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "PLCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: "100px" }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             {
                 name: "HAWBNo", display: "HAWB No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             },
             { name: "PilferageDiscovered", display: "Pilferage Discovered", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "IrregularityEvent", textColumn: "EventName", keyColumn: "SNo" },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             //onBlur: (pageType == "EDIT" ? "" : "PiecesValue(this)")
             //{ name: "Dimensions", display: "Dimensions", type: "text", ctrlCss: { width: "200px", }, ctrlAttr: { controltype: "default", maxlength: 200, oninput: "this.value = this.value.replace(/[^0-9,]/g, '');" }, isRequired: true },
             {
                 name: 'Dimensions', display: 'Dimensions', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Dimensions', ctrlCss: { width: '70px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     PopupDiv(BttnID, IrregularitySNo, IrregularityTransSNo);
                     //CreateTransDimensionGrid(IrregularitySNo, IrregularityTransSNo);
                 }
             },
             { name: "Packing", display: "Packing", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "80px" }, tableName: "IrregularityPacking", textColumn: "PackingName", keyColumn: "SNo", isRequired: true },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 490 } },
             { name: "Value", display: "Value", type: "text", value: "0.0", ctrlCss: { width: "60px", height: "20px" }, ctrlAttr: { controltype: "decimal2", maxlength: 10 } },
             {
                 name: "IsReport", display: "Report", type: "radiolist", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 0, isRequired: true, onClick: function (evt, rowIndex) {
                     var RadioBtnID = evt.target.id;
                     var rowNo = RadioBtnID.split('_')[2];
                     //Test(rowIndex + 1);
                     DisableEnableReports(rowNo);
                 }
             },
             { name: "ReportDate", display: "Report Date", type: "text", ctrlAttr: { controltype: "datetype" }, ctrlCss: { width: "80px", height: "20px" } },
             { name: "Place", display: "Place", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "80px" }, tableName: "Airport", textColumn: "CityName", keyColumn: "SNo" },
             { name: "Remarks", display: "Remarks", type: "text", ctrlCss: { width: "100px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65, } },
             //{
             //    name: 'Action', display: 'Action', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Action', ctrlCss: { width: '50px' }, onClick: function (evt, rowIndex) {
             //        var BttnID = evt.target.id;
             //        var trID = $("#" + BttnID + "").closest('tr').attr('id');
             //        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
             //        var IrregularitySNo = UploadSNo;
             //        var AWBNo = $("#AWBNo").val();
             //        var Type = $("input[name^=Type]:checked").val() == "1" ? "Import" : "Export";
             //        var CityCode = userContext.CityCode;
             //        var CitySNo = userContext.CitySNo;
             //        var UserSNo = userContext.UserSNo;
             //        var Pieces = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').val();
             //        ActionDiv(IrregularityTransSNo, IrregularitySNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID);
             //        //var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val();
             //        //Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
             //    }
             //},
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                     var BttnValue = $('#' + BttnID).val();
                     var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                     var SelectedItem = evt.item.context.innerText;
                     var IrregularitySNo = UploadSNo;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                     if (SelectedItem == 'CLOSED') {
                         $('#' + PiecesID).attr('disabled', true);
                     }
                     else {
                         if ($('#' + PiecesID).attr('disabled')) {
                             $('#' + PiecesID).attr('disabled', false);
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '100px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: 'hdnChildData', type: 'hidden', value: 0
             },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
             //UploadDocument1
             //UploadDocument2
        ]) : gridType == "DMCA" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "DMCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: "100px" }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             {
                 name: "HAWBNo", display: "HAWB No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             },
             { name: "DamageDiscovered", display: "Damage Discovered", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "IrregularityEvent", textColumn: "EventName", keyColumn: "SNo" },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             { name: "Packing", display: "Packing", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: "IrregularityPacking", textColumn: "PackingName", keyColumn: "SNo", isRequired: true },
             { name: "DamageType", display: "Damage Type", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "IrregularityDamage", textColumn: "Damage", keyColumn: "SNo" },
             {
                 name: "IsInspected", display: "Inspected", type: "radiolist", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 0, onClick: function (evt, rowIndex) {
                     var RadioBtnID = evt.target.id;
                     var row = RadioBtnID.split('_')[2];
                     //Test(rowIndex + 1);
                     Test(row);
                 }
             },
             { name: "ContentType", display: "Content Type", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "IrregularityDamage", textColumn: "Damage", keyColumn: "SNo" },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 490 } },
             { name: "Value", display: "Value", type: "text", ctrlCss: { width: "60px", height: "20px" }, ctrlAttr: { controltype: "decimal2", maxlength: 10, }, value: 0 },
             //{
             //    name: 'Action', display: 'Action', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Action', ctrlCss: { width: '50px' }, onClick: function (evt, rowIndex) {
             //        var BttnID = evt.target.id;
             //        var trID = $("#" + BttnID + "").closest('tr').attr('id');
             //        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
             //        var IrregularitySNo = UploadSNo;
             //        var AWBNo = $("#AWBNo").val();
             //        var Type = $("input[name^=Type]:checked").val() == "1" ? "Import" : "Export";
             //        var CityCode = userContext.CityCode;
             //        var CitySNo = userContext.CitySNo;
             //        var UserSNo = userContext.UserSNo;
             //        var Pieces = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').val();
             //        ActionDiv(IrregularityTransSNo, IrregularitySNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID);
             //        //var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val();
             //        //Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
             //    }
             //},
            {
                name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                    var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                    var BttnValue = $('#' + BttnID).val();
                    var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                    var SelectedItem = evt.item.context.innerText;
                    var IrregularitySNo = UploadSNo;
                    var trID = $("#" + BttnID + "").closest('tr').attr('id');
                    var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                    var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                    if (SelectedItem == 'CLOSED') {
                        $('#' + PiecesID).attr('disabled', true);
                    }
                    else {
                        if ($('#' + PiecesID).attr('disabled')) {
                            $('#' + PiecesID).attr('disabled', false);
                        }
                    }
                }
            },

            {
                name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                    var BttnID = evt.target.id;
                    var trID = $("#" + BttnID + "").closest('tr').attr('id');
                    var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                    var IrregularitySNo = UploadSNo;
                    //var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val();
                    Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                }
            },

            { name: "IncidentCategory", type: "hidden", value: 0 },
            { name: "IsAWBLabel", type: "hidden", value: 0 },
            {
                name: "HdnPieces", type: "hidden", value: 0
            }
             //UploadDocument
             /*With Label*/
        ]) : (gridType == "FDCA" || gridType == "OVCD") && labelType == 0 ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             {
                 name: "HAWBNo", display: "HAWB No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             { name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: true },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                     var BttnValue = $('#' + BttnID).val();
                     var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                     var SelectedItem = evt.item.context.innerText;
                     var IrregularitySNo = UploadSNo;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                     if (SelectedItem == 'CLOSED') {
                         $('#' + PiecesID).attr('disabled', true);
                     }
                     else {
                         if ($('#' + PiecesID).attr('disabled')) {
                             $('#' + PiecesID).attr('disabled', false);
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
             /*Without Label*/
        ]) : (gridType == "FDCA" || gridType == "OVCD") && labelType == 1 ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() },
             { name: "GridType", type: "hidden", value: "OVCD" },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             { name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: true },
             { name: "Packing", display: "Packing", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: "IrregularityPacking", textColumn: "PackingName", keyColumn: "SNo", isRequired: true },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                     var BttnValue = $('#' + BttnID).val();
                     var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                     var SelectedItem = evt.item.context.innerText;
                     var IrregularitySNo = UploadSNo;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                     if (SelectedItem == 'CLOSED') {
                         $('#' + PiecesID).attr('disabled', true);
                     }
                     else {
                         if ($('#' + PiecesID).attr('disabled')) {
                             $('#' + PiecesID).attr('disabled', false);
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
        ]) : gridType == "OFLD" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             {
                 name: "HAWBNo", display: "HAWB No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             { name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: true },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     if (gridType == 'OFLD') {
                         //var BttnID = evt.target.id;
                         var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                         var BttnValue = $('#' + BttnID).val();
                         var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                         var SelectedItem = evt.item.context.innerText;
                         var IrregularitySNo = UploadSNo;
                         var trID = $("#" + BttnID + "").closest('tr').attr('id');
                         var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                         var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                         if (SelectedItem == 'CLOSED') {
                             CheckAWBInOFLD(IrregularitySNo, IrregularityTransSNo, BttnID, BttnValue, hdnBttnValue);
                         }
                         else {
                             if ($('#' + PiecesID).attr('disabled')) {
                                 $('#' + PiecesID).attr('disabled', false);
                             }
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
        ]) : gridType == "MSMB" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             {
                 name: "HAWBNo", display: "Mail Bag No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             { name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: true },
             //{ name: "Reason", display: "Reason", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 0: "Consignee can not be contacted", 1: "Refusal of the consignee to receive the cargo" }, ctrlCss: { width: "242px" }, isRequired: true },
             //{
             //    name: 'Action', display: 'Action', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Action', ctrlCss: { width: '50px' }, onClick: function (evt, rowIndex) {
             //        var BttnID = evt.target.id;
             //        var trID = $("#" + BttnID + "").closest('tr').attr('id');
             //        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
             //        var IrregularitySNo = UploadSNo;
             //        var AWBNo = $("#AWBNo").val();
             //        var Type = $("input[name^=Type]:checked").val() == "1" ? "Import" : "Export";
             //        var CityCode = userContext.CityCode;
             //        var CitySNo = userContext.CitySNo;
             //        var UserSNo = userContext.UserSNo;
             //        var Pieces = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').val();
             //        ActionDiv(IrregularityTransSNo, IrregularitySNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID);
             //        //var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val();
             //        //Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
             //    }
             //},
             //{ name: "Reason", display: "Reason", type: "text", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65, }, },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "242px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                     var BttnValue = $('#' + BttnID).val();
                     var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                     var SelectedItem = evt.item.context.innerText;
                     var IrregularitySNo = UploadSNo;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                     if (SelectedItem == 'CLOSED') {
                         $('#' + PiecesID).attr('disabled', true);
                     }
                     else {
                         if ($('#' + PiecesID).attr('disabled')) {
                             $('#' + PiecesID).attr('disabled', false);
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
        ]) : gridType == "FDMB" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             {
                 name: "HAWBNo", display: "Mail Bag No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             { name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: true },
             //{ name: "Reason", display: "Reason", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 0: "Consignee can not be contacted", 1: "Refusal of the consignee to receive the cargo" }, ctrlCss: { width: "242px" }, isRequired: true },
             //{
             //    name: 'Action', display: 'Action', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Action', ctrlCss: { width: '50px' }, onClick: function (evt, rowIndex) {
             //        var BttnID = evt.target.id;
             //        var trID = $("#" + BttnID + "").closest('tr').attr('id');
             //        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
             //        var IrregularitySNo = UploadSNo;
             //        var AWBNo = $("#AWBNo").val();
             //        var Type = $("input[name^=Type]:checked").val() == "1" ? "Import" : "Export";
             //        var CityCode = userContext.CityCode;
             //        var CitySNo = userContext.CitySNo;
             //        var UserSNo = userContext.UserSNo;
             //        var Pieces = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').val();
             //        ActionDiv(IrregularityTransSNo, IrregularitySNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID);
             //        //var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val();
             //        //Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
             //    }
             //},
             //{ name: "Reason", display: "Reason", type: "text", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65, }, },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "242px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                     var BttnValue = $('#' + BttnID).val();
                     var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                     var SelectedItem = evt.item.context.innerText;
                     var IrregularitySNo = UploadSNo;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                     if (SelectedItem == 'CLOSED') {
                         $('#' + PiecesID).attr('disabled', true);
                     }
                     else {
                         if ($('#' + PiecesID).attr('disabled')) {
                             $('#' + PiecesID).attr('disabled', false);
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
        ]) : gridType == "MSAV" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             //{
             //    name: "HAWBNo", display: "Mail Bag No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             //},
             //{ name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             //{ name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: true },
             //{ name: "Reason", display: "Reason", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 0: "Consignee can not be contacted", 1: "Refusal of the consignee to receive the cargo" }, ctrlCss: { width: "242px" }, isRequired: true },
             //{
             //    name: 'Action', display: 'Action', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Action', ctrlCss: { width: '50px' }, onClick: function (evt, rowIndex) {
             //        var BttnID = evt.target.id;
             //        var trID = $("#" + BttnID + "").closest('tr').attr('id');
             //        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
             //        var IrregularitySNo = UploadSNo;
             //        var AWBNo = $("#AWBNo").val();
             //        var Type = $("input[name^=Type]:checked").val() == "1" ? "Import" : "Export";
             //        var CityCode = userContext.CityCode;
             //        var CitySNo = userContext.CitySNo;
             //        var UserSNo = userContext.UserSNo;
             //        var Pieces = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').val();
             //        ActionDiv(IrregularityTransSNo, IrregularitySNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID);
             //        //var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val();
             //        //Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
             //    }
             //},
             //{ name: "Reason", display: "Reason", type: "text", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65, }, },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "242px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                     var BttnValue = $('#' + BttnID).val();
                     var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                     var SelectedItem = evt.item.context.innerText;
                     var IrregularitySNo = UploadSNo;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                     if (SelectedItem == 'CLOSED') {
                         $('#' + PiecesID).attr('disabled', true);
                     }
                     else {
                         if ($('#' + PiecesID).attr('disabled')) {
                             $('#' + PiecesID).attr('disabled', false);
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
        ]) : gridType == "FDAV" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             //{
             //    name: "HAWBNo", display: "Mail Bag No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             //},
             //{ name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             //{ name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: true },
             //{ name: "Reason", display: "Reason", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 0: "Consignee can not be contacted", 1: "Refusal of the consignee to receive the cargo" }, ctrlCss: { width: "242px" }, isRequired: true },
             //{
             //    name: 'Action', display: 'Action', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Action', ctrlCss: { width: '50px' }, onClick: function (evt, rowIndex) {
             //        var BttnID = evt.target.id;
             //        var trID = $("#" + BttnID + "").closest('tr').attr('id');
             //        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
             //        var IrregularitySNo = UploadSNo;
             //        var AWBNo = $("#AWBNo").val();
             //        var Type = $("input[name^=Type]:checked").val() == "1" ? "Import" : "Export";
             //        var CityCode = userContext.CityCode;
             //        var CitySNo = userContext.CitySNo;
             //        var UserSNo = userContext.UserSNo;
             //        var Pieces = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').val();
             //        ActionDiv(IrregularityTransSNo, IrregularitySNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID);
             //        //var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val();
             //        //Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
             //    }
             //},
             //{ name: "Reason", display: "Reason", type: "text", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65, }, },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "242px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                     var BttnValue = $('#' + BttnID).val();
                     var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                     var SelectedItem = evt.item.context.innerText;
                     var IrregularitySNo = UploadSNo;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                     if (SelectedItem == 'CLOSED') {
                         $('#' + PiecesID).attr('disabled', true);
                     }
                     else {
                         if ($('#' + PiecesID).attr('disabled')) {
                             $('#' + PiecesID).attr('disabled', false);
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
        ]) : gridType == "UDLD" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             {
                 name: "HAWBNo", display: "HAWB No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: true },
             { name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: true },
             { name: "Reason", display: "Reason", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 0: "Consignee can not be contacted", 1: "Refusal of the consignee to receive the cargo" }, ctrlCss: { width: "242px" }, isRequired: true },
             //{
             //    name: 'Action', display: 'Action', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Action', ctrlCss: { width: '50px' }, onClick: function (evt, rowIndex) {
             //        var BttnID = evt.target.id;
             //        var trID = $("#" + BttnID + "").closest('tr').attr('id');
             //        var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
             //        var IrregularitySNo = UploadSNo;
             //        var AWBNo = $("#AWBNo").val();
             //        var Type = $("input[name^=Type]:checked").val() == "1" ? "Import" : "Export";
             //        var CityCode = userContext.CityCode;
             //        var CitySNo = userContext.CitySNo;
             //        var UserSNo = userContext.UserSNo;
             //        var Pieces = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').val();
             //        ActionDiv(IrregularityTransSNo, IrregularitySNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID);
             //        //var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val();
             //        //Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
             //    }
             //},
             //{ name: "Reason", display: "Reason", type: "text", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65, }, },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "242px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                     var BttnValue = $('#' + BttnID).val();
                     var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                     var SelectedItem = evt.item.context.innerText;
                     var IrregularitySNo = UploadSNo;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                     if (SelectedItem == 'CLOSED') {
                         $('#' + PiecesID).attr('disabled', true);
                     }
                     else {
                         if ($('#' + PiecesID).attr('disabled')) {
                             $('#' + PiecesID).attr('disabled', false);
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
        ]) : ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "HAWBPcs", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             //{ name: "HAWBNo", display: "HAWB No.", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "alphanumericupper", maxlength: 12 } },
             {
                 name: "HAWBNo", display: "HAWB No.", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, tableName: ($("input[name^=Type]:checked").val() == 1 ? "ImportHAWB" : "HAWB"), textColumn: "HAWBNo", keyColumn: "SNo", addOnFunction: SetHawbPCS
             },
             { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number", onBlur: "PiecesValue(this)" }, ctrlCss: { width: "60px" }, isRequired: (gridType == "MSAW" ? false : true) },
             { name: "Weight", display: "Weight", type: "text", ctrlAttr: { maxlength: 18, controltype: "decimal2", onBlur: "CheckWeight(this)" }, ctrlCss: { width: "50px" }, isRequired: (gridType == "MSAW" ? false : true) },
             { name: "IdentificationRemarks", display: "Description", type: "textarea", ctrlCss: { width: "150px" }, ctrlAttr: { controltype: "alphanumeric", maxlength: 65 }, },
             {
                 name: "Status", value: "", display: "Status", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onBlur: "StatusValue(this)" }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo", onSelect: function (evt, rowIndex) {
                     if (gridType == 'SSPD') {
                         //var BttnID = evt.target.id;
                         var BttnID = evt.item.context.offsetParent.id.split('-')[0];
                         var BttnValue = $('#' + BttnID).val();
                         var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val();
                         var SelectedItem = evt.item.context.innerText;
                         var IrregularitySNo = UploadSNo;
                         var trID = $("#" + BttnID + "").closest('tr').attr('id');
                         var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                         var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                         if (SelectedItem == 'CLOSED') {
                             CheckAWBInOFLD(IrregularitySNo, IrregularityTransSNo, BttnID, BttnValue, hdnBttnValue);
                         } else {
                             if ($('#' + PiecesID).attr('disabled')) {
                                 $('#' + PiecesID).attr('disabled', false);
                             }
                         }
                     }
                 }
             },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             },
             { name: "IncidentCategory", type: "hidden", value: 0 },
             { name: "IsAWBLabel", type: "hidden", value: 0 },
             {
                 name: "HdnPieces", type: "hidden", value: 0
             }
        ])) :
    /*Grid for edit and view mode*/
    (gridType == "MSCA" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             { name: "HAWBNo", display: "HAWB No.", type: "label", ctrlCss: { width: '100px' } },
             { name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: "60px" } },
             { name: "Weight", display: "Weight", type: "label", ctrlCss: { width: "50px" } },
             //{ name: "Dimensions", display: "Dimensions", type: "label", ctrlCss: { width: "200px", } },
             {
                 name: 'Dimensions', display: 'Dimensions', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Dimensions', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     PopupDiv(BttnID, IrregularitySNo, IrregularityTransSNo);
                 }
             },
             { name: "Packing", display: "Packing", type: "label", ctrlCss: { width: "100px" } },
             { name: "IdentificationRemarks", display: "Description", type: "label", ctrlCss: { width: "100px" } },
             { name: "Status", value: "", display: "Status", type: (pageType == "EDIT" ? "text" : "label"), ctrlAttr: { maxlength: 100, controltype: (pageType == "EDIT" ? "autocomplete" : "") }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo" },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                     //    var trID = $(this).attr('id');
                     //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                     //})
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             }
             //UploadDocument
    ]) : gridType == "PLCA" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "PLCA" },
             { name: "HAWBNo", display: "HAWB No.", type: "label", ctrlCss: { width: "100px" } },
             { name: "PilferageDiscovered", display: "Pilferage Discovered", type: "label", ctrlCss: { width: "100px" } },
             { name: "Pieces", display: "Pieces", type: "label" },
             //{ name: "Dimensions", display: "Dimensions", type: "label", ctrlCss: { width: "200px", } },
             {
                 name: 'Dimensions', display: 'Dimensions', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Dimensions', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     PopupDiv(BttnID, IrregularitySNo, IrregularityTransSNo);
                 }
             },
             { name: "Packing", display: "Packing", type: "label", ctrlCss: { width: "100px" } },
             { name: "IdentificationRemarks", display: "Description", type: "label", ctrlCss: { width: "100px" } },
             { name: "Value", display: "Value", type: "label", ctrlCss: { width: "60px" } },
             { name: "IsReport", display: "Report", type: "label", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 0 },
             { name: "ReportDate", display: "Report Date", type: "label", ctrlCss: { width: "80px", } },
             { name: "Place", display: "Place", type: "label", ctrlCss: { width: "100px" } },
             { name: "Remarks", display: "Remarks", type: "label", ctrlCss: { width: "100px" } },
             { name: "Status", value: "", display: "Status", type: (pageType == "EDIT" ? "text" : "label"), ctrlAttr: { maxlength: 100, controltype: (pageType == "EDIT" ? "autocomplete" : "") }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo" },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                     //    var trID = $(this).attr('id');
                     //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                     //})
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             }
             //UploadDocument1
             //UploadDocument2
    ]) : gridType == "DMCA" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "DMCA" },
             { name: "HAWBNo", display: "HAWB No.", type: "label", ctrlCss: { width: "100px" } },
             { name: "DamageDiscovered", display: "Damage Discovered", type: "label", ctrlCss: { width: "100px" } },
             { name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: "60px" } },
             { name: "Packing", display: "Packing", type: "label", ctrlCss: { width: "100px" } },
             { name: "DamageType", display: "Damage Type", type: "label", ctrlCss: { width: "100px" } },
             //{ name: "IsInspected", display: "Inspected", type: "label", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 0 },
             { name: "IsInspected", display: "Inspected", type: "label", ctrlCss: { width: "100px" } },//ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 0, },
             { name: "ContentType", display: "Content Type", type: "label", ctrlCss: { width: "100px" } },
             { name: "IdentificationRemarks", display: "Description", type: "label", ctrlCss: { width: "100px" } },
             { name: "Value", display: "Value", type: "label", ctrlCss: { width: "60px" } },
             { name: "Status", value: "", display: "Status", type: (pageType == "EDIT" ? "text" : "label"), ctrlAttr: { maxlength: 100, controltype: (pageType == "EDIT" ? "autocomplete" : "") }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo" },
            {
                name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                    //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                    //    var trID = $(this).attr('id');
                    //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                    //})
                    var IrregularitySNo = UploadSNo;
                    var BttnID = evt.target.id;
                    var trID = $("#" + BttnID + "").closest('tr').attr('id');
                    var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                    Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                }
            }
             //UploadDocument
             /*With Label*/
    ]) : (gridType == "FDCA" || gridType == "OVCD") && labelType == 0 ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             { name: "HAWBNo", display: "HAWB No.", type: "label", ctrlCss: { width: '100px' } },
             { name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: "60px" } },
             { name: "Weight", display: "Weight", type: "label", ctrlCss: { width: "50px" } },
             { name: "IdentificationRemarks", display: "Description", type: "label", ctrlCss: { width: "100px" } },
             { name: "Status", value: "", display: "Status", type: (pageType == "EDIT" ? "text" : "label"), ctrlAttr: { maxlength: 100, controltype: (pageType == "EDIT" ? "autocomplete" : "") }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo" },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                     //    var trID = $(this).attr('id');
                     //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                     //})
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             }
             /*Without Label*/
    ]) : (gridType == "FDCA" || gridType == "OVCD") && labelType == 1 ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "OVCD" },
             { name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: "60px" } },
             { name: "Weight", display: "Weight", type: "label", ctrlCss: { width: "50px" } },
             { name: "Packing", display: "Packing", type: "label", ctrlCss: { width: "100px" } },
             { name: "IdentificationRemarks", display: "Description", type: "label", ctrlCss: { width: "100px" } },
             { name: "Status", value: "", display: "Status", type: (pageType == "EDIT" ? "text" : "label"), ctrlAttr: { maxlength: 100, controltype: (pageType == "EDIT" ? "autocomplete" : "") }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo" },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                     //    var trID = $(this).attr('id');
                     //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                     //})
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             }
    ]) : gridType == "OFLD" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             { name: "HAWBNo", display: "HAWB No.", type: "label", ctrlCss: { width: '100px' } },
             { name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: "60px" } },
             { name: "Weight", display: "Weight", type: "label", ctrlCss: { width: "50px" } },
             { name: "IdentificationRemarks", display: "Description", type: "label", ctrlCss: { width: "100px" } },
             { name: "Status", value: "", display: "Status", type: (pageType == "EDIT" ? "text" : "label"), ctrlAttr: { maxlength: 100, controltype: (pageType == "EDIT" ? "autocomplete" : "") }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo" },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                     //    var trID = $(this).attr('id');
                     //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                     //})
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             }
    ]) : gridType == "UDLD" ? ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             { name: "HAWBNo", display: "HAWB No.", type: "label", ctrlCss: { width: '100px' } },
             { name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: "60px" } },
             { name: "Weight", display: "Weight", type: "label", ctrlCss: { width: "50px" } },
             { name: "Reason", display: "Reason", type: "label", ctrlCss: { width: "180px" } },
             { name: "IdentificationRemarks", display: "Description", type: "label", ctrlCss: { width: "100px" } },
             { name: "Status", value: "", display: "Status", type: (pageType == "EDIT" ? "text" : "label"), ctrlAttr: { maxlength: 100, controltype: (pageType == "EDIT" ? "autocomplete" : "") }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo" },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                     //    var trID = $(this).attr('id');
                     //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                     //})
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             }
    ]) :
    ([{ name: "SNo", type: "hidden", value: 0 },
             { name: "IrregularityTransSNo", type: "hidden", value: 0 },
             { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
             { name: "HAWBNo", display: "HAWB No.", type: "label", ctrlCss: { width: '100px' } },
             { name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: "60px" } },
             { name: "Weight", display: "Weight", type: "label", ctrlCss: { width: "50px" } },
             { name: "IdentificationRemarks", display: "Description", type: "label", ctrlCss: { width: "100px" } },
             { name: "Status", value: "", display: "Status", type: (pageType == "EDIT" ? "text" : "label"), ctrlAttr: { maxlength: 100, controltype: (pageType == "EDIT" ? "autocomplete" : "") }, ctrlCss: { width: "100px" }, isRequired: (pageType == "EDIT" ? true : false), tableName: "IrregularityStatus", textColumn: "Status", keyColumn: "SNo" },
             {
                 name: 'Attachment', display: 'Attachment', type: 'button', ctrlAttr: { maxlength: 100 }, value: 'Upload/View Doc.', ctrlCss: { width: '120px' }, onClick: function (evt, rowIndex) {
                     //$("tr[id^=tblIrregularityTrans_Row_").each(function () {
                     //    var trID = $(this).attr('id');
                     //    var Row_SNo = $("tr[id=" + trID + "] td:nth-child(1)").text();
                     //})
                     var IrregularitySNo = UploadSNo;
                     var BttnID = evt.target.id;
                     var trID = $("#" + BttnID + "").closest('tr').attr('id');
                     var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                     Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID);
                 }
             }
    ])),

        useSubPanel: true, // Required
        subPanelBuilder: function (cell, uniqueIndex) {
            // Create a textarea element and append to the cell
            $('<textarea></textarea>').attr({
                id: 'tblIrregularityTrans_Comment_' + uniqueIndex,
                name: 'tblIrregularityTrans_Comment_' + uniqueIndex,
                cols: 80,
                rows: 3
            }).appendTo(cell);
        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
                $("tr[id^=tblIrregularityTrans_Row]").each(function () {
                    var trID = $(this).attr('id');
                    var StatusID = $("#" + trID).find('input[name^=tblIrregularityTrans_Status_]').attr('id');
                    var HDnStatusID = $("#" + trID).find('input[name^=tblIrregularityTrans_HdnStatus_]').attr('id');
                    if ($("#" + StatusID).val() == "CLOSED") {
                        var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                        $('#' + PiecesID).attr('disabled', true);
                        $("#" + StatusID).data("kendoAutoComplete").enable(false);
                        $("#" + StatusID).removeAttr('required');
                    }
                    if ($('#hdnIncidentCategoryCode').val() == 'MSCA' || $('#hdnIncidentCategoryCode').val() == 'OFLD') {
                        var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                        var WeightID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Weight_]').attr('id');
                        $('#' + PiecesID).attr('disabled', true);
                        $('#' + WeightID).attr('disabled', true);
                    }
                })
            }
            DisableEnable();
            DisableEnableReportsFetch();
        },
        rowUpdateExtraFunction: function (id) {
            if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
                if ($('#hdnIncidentCategoryCode').val() == "MSAV" || $('#hdnIncidentCategoryCode').val() == "FDAV") {

                }
                else {
                    $("tr[id^=tblIrregularityTrans_Row]").each(function () {
                        var trID = $(this).attr('id');
                        var PcsID = $("#" + trID).find('input[name^=tblIrregularityTrans_Pieces_]').attr('id');
                        $('#' + PcsID).data("kendoNumericTextBox").value($("#" + PcsID).val())
                    });
                }
            }
        },
        isPaging: false,
        hideButtons: { updateAll: true, append: (pageType == "NEW" ? false : true), insert: (pageType == "EDIT" ? false : true), remove: (pageType == "NEW" ? false : true), removeLast: true }

    });

    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        $("tr[id^=tblIrregularityTrans_Row]").each(function () {
            var trID = $(this).attr('id');

            var IsInspectedID = $("#" + trID).find('label[id^=tblIrregularityTrans_IsInspected]').attr('id');
            var IsInspectedValue = $("#" + IsInspectedID).text();
            if (IsInspectedValue == "0") {
                $("#" + IsInspectedID).text('No');
            }
            else {
                $("#" + IsInspectedID).text('Yes');
            }
        })
    }

    if ((getQueryStringValue("FormAction").toUpperCase() == 'EDIT') && ($("#hdnIncidentCategoryCode").val() == "DMCA")) {
        $("tr[id^=tblIrregularityTrans_Row]").each(function () {
            var trID = $(this).attr('id');
            var InspectedID = $("#" + trID).find('input[name^=tblIrregularityTrans_RbtnIsInspected]').attr('id');
            var ContentTypeid = $("#" + trID + "").find('input[id^=tblIrregularityTrans_ContentType]').attr('id');
            //var id = $("input[id^=tblIrregularityTrans_ContentType]").attr("id");
            if ($("#" + ContentTypeid).val() == "" || $("input[id=" + InspectedID + "]:checked").val() == "0") {
                $("#" + ContentTypeid).data("kendoAutoComplete").enable(false)
                $("#" + ContentTypeid).removeAttr('required');
            }
            //else {
            //    $("#" + id).data("kendoAutoComplete").enable(true)
            //    $("#" + id).attr("required", "required");
            //}
        })
    }

    if ((getQueryStringValue("FormAction").toUpperCase() == 'EDIT')) {
        $("tr[id^=tblIrregularityTrans_Row]").each(function () {
            var trID = $(this).attr('id');
            var IsReportID = $("#" + trID).find('input[name^=tblIrregularityTrans_RbtnIsReport]').attr('id');
            var ReportDateid = $("#" + trID + "").find('input[id^=tblIrregularityTrans_ReportDate]').attr('id');
            var Remarksid = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Remarks]').attr('id');
            var Placeid = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Place]').attr('id');
            //var id = $("input[id^=tblIrregularityTrans_ContentType]").attr("id");
            if ($("#" + Placeid).val() == "" || $("input[id=" + IsReportID + "]:checked").val() == "0") {
                $("#" + Placeid).data("kendoAutoComplete").enable(false)
                $("#" + Placeid).removeAttr('required');
                $("#" + ReportDateid).data("kendoDatePicker").enable(false)
                $("#" + ReportDateid).removeAttr('required');
                $("#" + Remarksid).attr('disabled', true);
                $("#" + Remarksid).removeAttr('required');
            }
        })
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("#tblIrregularityTrans thead tr:nth-last-child(1) td:nth-last-child(3)").hide();
        if ($("#IncidentCategory").val() == "PLCA" || $("#IncidentCategory").val() == "DMCA") {
            $("#tblIrregularityTrans thead tr:nth-last-child(1) td:nth-last-child(4)").hide();
        }
        if ($("#IncidentCategory").val() == "UDLD") {
            $("#tblIrregularityTrans thead tr:nth-last-child(1) td:nth-last-child(5)").hide()
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
        $("tr[id^=tblIrregularityTrans_Row]").each(function () {
            var trID = $(this).attr('id');
            var StatusID = $("#" + trID).find('input[name^=tblIrregularityTrans_Status_]').attr('id');
            var HDnStatusID = $("#" + trID).find('input[name^=tblIrregularityTrans_HdnStatus_]').attr('id');
            if ($("#" + StatusID).val() == "") {
                $("#" + StatusID).val('OPEN');
                $("#" + HDnStatusID).val('2');
            }
            if ($("#" + StatusID).val() == "CLOSED") {
                var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                $('#' + PiecesID).attr('disabled', true);
                $("#" + StatusID).data("kendoAutoComplete").enable(false);
                $("#" + StatusID).removeAttr('required');
            }
            var HdnDamageDiscoID = $("#" + trID).find('input[name^=tblIrregularityTrans_HdnDamageDiscovered]').attr('id');
            if ($("#" + HdnDamageDiscoID).val() == 0) {
                $("#" + HdnDamageDiscoID).removeAttr('value');
            }
            else {
                return
            }
            var HdnPackingID = $("#" + trID).find('input[name^=tblIrregularityTrans_HdnPacking]').attr('id');
            if ($("#" + HdnPackingID).val() == 0) {
                $("#" + HdnPackingID).removeAttr('value');
            }
            else {
                return
            }
            var HdnDamageTypeID = $("#" + trID).find('input[name^=tblIrregularityTrans_HdnDamageType]').attr('id');
            if ($("#" + HdnDamageTypeID).val() == 0) {
                $("#" + HdnDamageTypeID).removeAttr('value');
            }
            else {
                return
            }
        })
    }

}

function DisableEnable() {
    $("#tblIrregularityTrans").find("input[id^='tblIrregularityTrans_RbtnIsInspected']").each(
              function () {
                  if ($("input[name^=tblIrregularityTrans_RbtnIsInspected_" + this.id.split('_')[2] + "]:checked").val() == 0) {
                      cfi.ResetAutoComplete($("#tblIrregularityTrans_ContentType_" + this.id.split('_')[2])[0].id);
                      $("#tblIrregularityTrans_ContentType_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(false);
                      $("#tblIrregularityTrans_ContentType_" + this.id.split('_')[2]).removeAttr('required');
                  }
                  else {
                      $("#tblIrregularityTrans_ContentType_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(true);
                      $("#tblIrregularityTrans_ContentType_" + this.id.split('_')[2]).attr("required", "required");
                  }
              });
}

function Test(row) {
    if ($("input[name^=tblIrregularityTrans_RbtnIsInspected_" + row + "]:checked").val() == 0) {
        cfi.ResetAutoComplete($("#tblIrregularityTrans_ContentType_" + row)[0].id);
        $("#tblIrregularityTrans_ContentType_" + row).data("kendoAutoComplete").enable(false)
        $("#tblIrregularityTrans_ContentType_" + row).removeAttr('required');
    }
    else {
        $("#tblIrregularityTrans_ContentType_" + row).data("kendoAutoComplete").enable(true)
        $("#tblIrregularityTrans_ContentType_" + row).attr("required", "required");
        //$("#tblIrregularityTrans_ContentType_" + row).attr('disabled', false);
    }

}

function DisableEnableReports(rowNo) {
    //tblIrregularityTrans_RbtnIsReport_1_0
    //tblIrregularityTrans_Place_1
    if ($("input[name^=tblIrregularityTrans_RbtnIsReport_" + rowNo + "]:checked").val() == 0) {
        cfi.ResetAutoComplete($("#tblIrregularityTrans_Place_" + rowNo)[0].id);
        $("#tblIrregularityTrans_HdnPlace_" + rowNo).val('');
        $("#tblIrregularityTrans_Place_" + rowNo).data("kendoAutoComplete").enable(false);
        $("#tblIrregularityTrans_Place_" + rowNo).removeAttr('required');
        $("#tblIrregularityTrans_Remarks_" + rowNo).val('');
        $("#tblIrregularityTrans_Remarks_" + rowNo).attr('disabled', true);
        $("#tblIrregularityTrans_Remarks_" + rowNo).removeAttr('required');
        $("#tblIrregularityTrans_ReportDate_" + rowNo).val('');
        $("#tblIrregularityTrans_ReportDate_" + rowNo).data("kendoDatePicker").enable(false);
        $("#tblIrregularityTrans_ReportDate_" + rowNo).removeAttr('required');
    }
    else {
        $("#tblIrregularityTrans_Place_" + rowNo).data("kendoAutoComplete").enable(true);
        $("#tblIrregularityTrans_Place_" + rowNo).attr("required", "required");
        $("#tblIrregularityTrans_Remarks_" + rowNo).attr('disabled', false);
        $("#tblIrregularityTrans_Remarks_" + rowNo).attr("required", "required");
        $("#tblIrregularityTrans_ReportDate_" + rowNo).data("kendoDatePicker").enable(true);
        $("#tblIrregularityTrans_ReportDate_" + rowNo).attr("required", "required");
    }
}

function DisableEnableReportsFetch() {
    $("#tblIrregularityTrans").find("input[id^='tblIrregularityTrans_RbtnIsReport_']").each(
              function () {
                  if ($("input[name^=tblIrregularityTrans_RbtnIsReport_" + this.id.split('_')[2] + "]:checked").val() == 0) {
                      cfi.ResetAutoComplete($("#tblIrregularityTrans_Place_" + this.id.split('_')[2])[0].id);
                      $("#tblIrregularityTrans_Place_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(false);
                      $("#tblIrregularityTrans_Place_" + this.id.split('_')[2]).removeAttr('required');
                      $("#tblIrregularityTrans_Remarks_" + this.id.split('_')[2]).attr('disabled', true);
                      $("#tblIrregularityTrans_Remarks_" + this.id.split('_')[2]).removeAttr('required');
                      $("#tblIrregularityTrans_ReportDate_" + this.id.split('_')[2]).data("kendoDatePicker").enable(false);
                      $("#tblIrregularityTrans_ReportDate_" + this.id.split('_')[2]).removeAttr('required');
                  }
                  else {
                      $("#tblIrregularityTrans_Place_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(true);
                      $("#tblIrregularityTrans_Place_" + this.id.split('_')[2]).attr("required", "required");
                      $("#tblIrregularityTrans_Remarks_" + this.id.split('_')[2]).attr('disabled', false);
                      $("#tblIrregularityTrans_Remarks_" + this.id.split('_')[2]).attr("required", "required");
                      $("#tblIrregularityTrans_ReportDate_" + this.id.split('_')[2]).data("kendoDatePicker").enable(true);
                      $("#tblIrregularityTrans_ReportDate_" + this.id.split('_')[2]).attr("required", "required");
                  }
              });
}

//<input type='button' value='Back' class='btn btn-inverse' onclick='javascript:BackButton();'>
function Upload(IrregularitySNo, gridType, IrregularityTransSNo, BttnID) {
    //var IrregularityTransSNo1 = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val()
    GetImageFromDB(IrregularitySNo, IrregularityTransSNo, gridType, BttnID);


    //$("#divUploader").append("<div id='divfileUploader'><span id='spnIrregularityTransUploader'><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + IrregularitySNo + "'/><input id='IrregularityTransSNo' name='IrregularityTransSNo' type='hidden' value='" + IrregularityTransSNo + "'/><input id='hdnIrregularitygridType' name='hdnIrregularitygridType' type='hidden' value='" + gridType + "'/><table id='tblIrregularityUploader'><tr id='Uploader_0'><td><form action='demo_form.asp'><input type='file' id='fileUploader_0' name='pic' accept='image/*'></form></td><td id='addimage_0'><img src='..//Images/AddIcon.png' onclick='AddRow(this,IrregularityTransSNo)'/></td></tr><tr id='buttonRow'><td class'formActiontitle'><input type='button' name='operation' id='SaveUpload' value='OK' class='btn btn-success'></td></tr></table></span></div>");
    //cfi.PopUp("tblIrregularityUploader", "Upload Your Document", 500, null, null, 100);


    //$("tr[id^='Uploader_']").each(function () {
    //    var trID = $(this).attr('id');
    //    $("#" + trID).find("input[id^=fileUploader_]").each(function () {
    //        $(this).unbind("change").bind("change", function () {
    //            var objID = $(this).attr("id");
    //            var irregularitySNo = $("#hdnIrregularitySNo").val();
    //            var gridtype = "";
    //            if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
    //                gridtype = $("#IncidentCategory").val();
    //            }
    //            else {
    //                gridtype = $("#Text_IncidentCategory").val();
    //            }
    //            UploadDocument(objID, irregularitySNo, gridtype, IrregularityTransSNo, "Irregularity");
    //            var fileSelect = document.getElementById(objID);
    //            var filesName = fileSelect.files[0].name;
    //            $("#divfileUploader").append("<span id='spnIrregularityTransUploader_0'></span>");
    //            $("#spnIrregularityTransUploader_" + IrregularityTransSNo).append("<input id='hdnfilesName_0' name='hdnfilesName' type='hidden' value='" + filesName + "'/>");
    //        });
    //    })
    //})

}

function AddRow(id) {
    var IrregularityTransSNo = $("span[id=spnIrregularityTransUploader] input[id=IrregularityTransSNo]").val();
    var trID = $(id).closest('tr').attr('id');
    var incrementValue = parseInt(trID.split('_')[1]) + 1;
    var FileUploaderID = $("#" + trID + "").find('input[type=file]').attr('id');
    var LabelText = $("#" + trID + "").find('label').text().split(':-')[1];
    if (document.getElementById(FileUploaderID).value == "" && LabelText.trim() == "") {
        //var abc = "";
        ShowMessage('info', 'File Upload!', "First Upload any Document.", "bottom-right");
        return false;
    }
    //var IncrementValue = incrementValue + 1;
    $("#tblIrregularityUploader tr[id=buttonRow]").remove();
    $("#tblIrregularityUploader").append("<tr id='Uploader_" + incrementValue + "'><td><form action='demo_form.asp'><input type='file' id='fileUploader_" + incrementValue + "' name='pic' accept='image/*'></form></td><td id='addLabel_" + incrementValue + "'><label style='color:blue;text-decoration: underline;' id='Downloadlbl_" + incrementValue + "'>Download File:-    </label></td><td id='addimage_" + incrementValue + "'><img src='./Images/AddIcon.png' onclick='AddRow(this,IrregularityTransSNo)'/></td><td id='deleteimage_" + incrementValue + "'><img src='./Images/delete.png' onclick='DeleteRow(this)'/></td></tr>")
    $("#tblIrregularityUploader").append("<tr id='buttonRow'><td class'formActiontitle'><input type='button' name='operation' id='SaveUpload' value='OK' class='btn btn-success'></td><td><span style='font-size: x-small; font-weight: 400; color: gray;'>Only 'png' and 'jpg' format will be accepted. </span></td></tr>")
    $("#deleteimage_0").show();
    //$(id).closest('td').attr('id');
    var buttonID = $(id).closest('td').attr('id');
    $("#" + buttonID).hide();
    $("tr[id^='Uploader_']").each(function () {
        var trID = $(this).attr('id');
        $("#" + trID).find("input[id^=fileUploader_]").each(function () {
            $(this).unbind("change").bind("change", function () {
                var objID = $(this).attr("id");
                var irregularitySNo = $("#hdnIrregularitySNo").val();
                //var IrregularityTransSNo = $("#tblIrregularityTrans_IrregularityTransSNo_1").val();
                var gridtype = "";
                if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
                    gridtype = $("#IncidentCategory").val();
                }
                else {
                    gridtype = $("#Text_IncidentCategory").val();
                }
                var fileSelect = document.getElementById(objID);
                var files = fileSelect.files;
                if (files[0].name.length > 54) {
                    $("input[type='file']").val(null);
                    ShowMessage('info', 'File Upload!', "Document Name is too long. Number of character can not be greater than '50'.", "bottom-right");
                    return false;
                }
                if (files[0].size > 512000) {
                    $("input[type='file']").val(null);
                    ShowMessage('info', 'File Upload!', "Document size has exceeded it max limit of 500KB.", "bottom-right");
                    return false;
                }
                if (files[0].type.split('/')[1] != 'png' && files[0].type.split('/')[1] != 'jpg' && files[0].type.split('/')[1] != 'jpeg') {
                    $("input[type='file']").val(null);
                    ShowMessage('info', 'File Upload!', "Document format should be 'png' or 'jpg'", "bottom-right");
                    return false;
                }
                UploadDocument(objID, irregularitySNo, gridtype, IrregularityTransSNo, "Irregularity");
                //var fileSelect = document.getElementById(objID);
                //var filesName = fileSelect.files[0].name;
                var fileSelect = document.getElementById(objID);
                var filesName = fileSelect.files[0].name;
                //$("#divfileUploader").append("<span id='spnIrregularityTransUploader_0'></span>");
                //$("#spnIrregularityTransUploader_" + IrregularityTransSNo1).append("<input id='hdnfilesName_0' name='hdnfilesName' type='hidden' value='" + filesName + "'/>");
                $("#tblIrregularityUploader tr[id^=Uploader_" + incrementValue + "] td[id^=addLabel_" + incrementValue + "]").remove();
                $("#tblIrregularityUploader tr[id^=Uploader_" + incrementValue + "] td[id^=addimage_" + incrementValue + "]").remove();
                $("#tblIrregularityUploader tr[id^=Uploader_" + incrementValue + "] td[id^=deleteimage_" + incrementValue + "]").remove();
                $("#tblIrregularityUploader tr[id^=Uploader_" + incrementValue + "]").append("<td id='addLabel_" + incrementValue + "'><label style='color:blue;text-decoration: underline;' id='Downloadlbl_" + incrementValue + "' onclick='DownloadDocument(this)' >Download File:- " + filesName + " </label></td><td id='addimage_" + incrementValue + "'><img src='./Images/AddIcon.png' onclick='AddRow(this,IrregularityTransSNo)'/></td><td id='deleteimage_" + incrementValue + "'><img src='./Images/delete.png' onclick='DeleteRow(this,IrregularityTransSNo)'/><input id='hdnImageSNo_" + incrementValue + "' name='hdnImageSNo' type='hidden' value='0'/></td>")
                $("#fileUploader_" + incrementValue + "").attr("disabled", true);
                //$("#spnIrregularityTransUploader_" + IrregularityTransSNo).append("<input id='hdnfilesName_" + incrementValue + "' name='hdnfilesName' type='hidden' value='" + filesName + "'/>");

                //$("#tblIrregularityUploader tr[id^=]").append("");
            });
        })
    })
}

function DeleteRow(id) {
    var IrregularityTransSNo = $("span[id=spnIrregularityTransUploader] input[id=IrregularityTransSNo]").val();
    var trID = $(id).closest('tr').attr('id');
    //var filenameID = $("#" + trID + " input[name='hdnImageAttachement']").attr('id');
    var filenameID = $("#" + trID).find('input[name=hdnImageAttachement]').attr('id');
    var filename = $("#" + filenameID + "").val();
    //var objId = $("tr[id=" + trID + "] td:nth-child(1) input[type=file]").attr('id');
    var objId = $("tr[id=" + trID + "]").find('input[type=file]').attr('id');
    $("#tblIrregularityUploader tr[id=" + trID + "]").remove();
    var SecondLast_tr = $("#tblIrregularityUploader tr:nth-last-child(2)").attr('id');
    $("#addimage_" + SecondLast_tr.split('_')[1] + "").show();

    if ($("#tblIrregularityUploader tr").length == 2) {
        $("td[id^=deleteimage_]").hide();
    }

    var IrregularitySNo = $("#hdnIrregularitySNo").val();
    gridType = $("#IncidentCategory").val();
    //$("tr[id=" + trID + "] td:nt-child(1) input[type=file]").attr('id');
    DeleteDocument(objId, IrregularitySNo, gridType, IrregularityTransSNo, "Delete", filename)
}

function DeleteDocument(objId, IrregularitySNo, gridType, IrregularityTransSNo, Irr, filename) {
    var fileSelect = document.getElementById(objId);
    var data = "";
    if (filename != null) {
        $.ajax({
            url: "Handler/UploadImage.ashx?IrregularitySNo=" + IrregularitySNo + "&gridType=" + gridType + "&Irr=" + Irr + "&IrregularityTransSNo=" + IrregularityTransSNo + "&filename=" + filename,
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                //var a = "";
                //if (result == "") {
                //    $("#" + objId).val("");
                //    ShowMessage('info', 'File Upload!', "This Document is already exist.", "bottom-right");
                //}
                //$("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);
                //$("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
            },
            error: function (err) {
                ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            }
        });
    }
}

function UploadDocument(objId, IrregularitySNo, gridType, IrregularityTransSNo, Irr) {
    var Position = objId.split('_')[1];
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }
    //window.open("http://localhost:3139/Handler/UploadImage.ashx?IrregularitySNo="+ IrregularitySNo + "&gridType=" + gridType + "&Irr=" + Irr + "&IrregularityTransSNo=" + IrregularityTransSNo + "&Position=" + Position);
    $.ajax({
        url: "Handler/UploadImage.ashx?IrregularitySNo=" + IrregularitySNo + "&gridType=" + gridType + "&Irr=" + Irr + "&IrregularityTransSNo=" + IrregularityTransSNo + "&Position=" + Position,
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            var a = "";
            if (result == "") {
                $("#" + objId).val("");
                ShowMessage('info', 'File Upload!', "This Document is already exist.", "bottom-right");
            }
            //$("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);
            //$("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });
    //SaveUploader();
}

function GetImageFromDB(IrregularitySNo, IrregularityTransSNo, gridType, BttnID) {
    $.ajax({
        type: "GET",
        url: "Services/Irregularity/IrregularityService.svc/GetImageFromDB?IrregularitySNo=" + IrregularitySNo + "&IrregularityTransSNo=" + IrregularityTransSNo,
        dataType: "json",
        success: function (response) {
            var efd = JSON.parse(response);
            var pageType = $('#hdnPageType').val();
            if (efd.length > 0) {
                var ImageAttachement = efd[0]['ImageAttachement'];
                var ImageName = efd[0]['ImageName'];
                var IrregularityTransSNo1 = efd[0].IrregularityTransSNo;
                var ImageSNo = efd[0].SNo;
                $("#divUploader").html("<div id='divfileUploader'><span id='spnIrregularityTransUploader'><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + IrregularitySNo + "'/><input id='IrregularityTransSNo' name='IrregularityTransSNo' type='hidden' value='" + IrregularityTransSNo1 + "'/><input id='hdnIrregularitygridType' name='hdnIrregularitygridType' type='hidden' value='" + gridType + "'/><table id='tblIrregularityUploader'><tr id='Uploader_0'><td><form action='demo_form.asp'><input type='file' id='fileUploader_0' name='pic' accept='image/*'></form></td><td id='addLabel_0'><label style='color:blue;text-decoration: underline;' id='Downloadlbl_0' onclick='DownloadDocument(this)'>Download File:- " + ImageName + "      </label></td><td id='addimage_0'><img src='./Images/AddIcon.png' onclick='AddRow(this)'/></td><td id='deleteimage_0'><img src='./Images/delete.png' onclick='DeleteRow(this)'/><input id='hdnImageSNo_0' name='hdnImageSNo' type='hidden' value='" + ImageSNo + "'/><input id='hdnImageAttachement_0' name='hdnImageAttachement' type='hidden' value='" + ImageAttachement + "'/></td></tr><tr id='buttonRow'><td class'formActiontitle'><input type='button' name='operation' id='SaveUpload' value='OK' class='btn btn-success'></td><td><span style='font-size: x-small; font-weight: 400; color: gray;'>Only 'png' and 'jpg' format will be accepted. </span></td></tr></table></span></div>");
                $("#fileUploader_0").attr("disabled", true);
                if (efd.length == 1) {
                    $("#deleteimage_0").hide();
                }

                if (pageType == "READ") {
                    $("#addimage_0").hide();
                    $("#deleteimage_0").hide();
                    $("#tblIrregularityUploader tr[id^=Uploader_]").each(function () {
                        var trID = $(this).attr('id');
                        var DownloadID = $("#" + trID + "").find('label').attr('id');
                        $("#" + DownloadID + "").removeAttr('onclick');
                    })
                }
                if (efd.length > 1) {
                    $("#addimage_0").hide();
                }
                for (var i = 1; i < efd.length; i++) {
                    var incrementValue = i;
                    var IrregularityTransSNo1 = efd[i].IrregularityTransSNo;
                    var ImageSNo1 = efd[i].SNo;
                    var ImageAttachement1 = efd[incrementValue]['ImageAttachement'];
                    var ImageName = efd[incrementValue]['ImageName'];
                    $("#tblIrregularityUploader tr[id=buttonRow]").remove();
                    $("#tblIrregularityUploader").append("<tr id='Uploader_" + incrementValue + "'><td><form action='demo_form.asp'><input type='file' id='fileUploader_" + incrementValue + "' name='pic' accept='image/*'></form></td><td id='addLabel_" + incrementValue + "'><label style='color:blue;text-decoration: underline;' id='Downloadlbl_" + incrementValue + "' onclick='DownloadDocument(this)'>Download File:- " + ImageName + "      </label></td><td id='addimage_" + incrementValue + "'><img src='./Images/AddIcon.png' onclick='AddRow(this)'/></td><td id='deleteimage_" + incrementValue + "'><img src='./Images/delete.png' onclick='DeleteRow(this)'/><input id='hdnImageSNo_" + incrementValue + "' name='hdnImageSNo' type='hidden' value='" + ImageSNo1 + "'/><input id='hdnImageAttachement_" + incrementValue + "' name='hdnImageAttachement' type='hidden' value='" + ImageAttachement1 + "'/></td></tr>")
                    $("#tblIrregularityUploader").append("<tr id='buttonRow'><td class'formActiontitle'><input type='button' name='operation' id='SaveUpload' value='OK' class='btn btn-success'></td><td><span style='font-size: x-small; font-weight: 400; color: gray;'>Only 'png' and 'jpg' format will be accepted. </span></td></tr>")
                    $("#fileUploader_" + incrementValue + "").attr("disabled", true);
                    var pageType = $('#hdnPageType').val();
                    if (pageType == "READ") {
                        $("#addimage_" + incrementValue + "").hide();
                        $("#deleteimage_" + incrementValue + "").hide();
                        $("#tblIrregularityUploader tr[id^=Uploader_]").each(function () {
                            var trID = $(this).attr('id');
                            var DownloadID = $("#" + trID + "").find('label').attr('id');
                            $("#" + DownloadID + "").removeAttr('onclick');
                        })
                    }

                    if (parseInt(incrementValue) + 1 == efd.length) {
                        var pageType = $('#hdnPageType').val();
                        if (pageType == "READ") {
                            $("#addimage_" + incrementValue + "").hide();
                        }
                        else {
                            $("#addimage_" + incrementValue + "").show();
                        }
                    }
                    else {
                        $("#addimage_" + incrementValue + "").hide();
                    }

                }

                cfi.PopUp("divUploader", "Upload Your Document.", 700, null, null, 100);

                $("tr[id^='Uploader_']").each(function () {
                    var trID = $(this).attr('id');
                    $("#" + trID).find("input[id^=fileUploader_]").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            var objID = $(this).attr("id");
                            var irregularitySNo = $("#hdnIrregularitySNo").val();
                            var gridtype = "";
                            if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
                                gridtype = $("#IncidentCategory").val();
                            }
                            else {
                                gridtype = $("#Text_IncidentCategory").val();
                            }
                            var fileSelect = document.getElementById(objID);
                            var files = fileSelect.files;
                            if (files[0].name.indexOf('_') != -1) {
                                $("input[type='file']").val(null);
                                ShowMessage('info', 'File Upload!', "( _ ) 'underscore' can not be used in Document Name.", "bottom-right");
                                return false;
                            }
                            if (files[0].name.length > 54) {
                                $("input[type='file']").val(null);
                                ShowMessage('info', 'File Upload!', "Document Name is too long. Number of character can not be greater than '50'.", "bottom-right");
                                return false;
                            }
                            if (files[0].size > 512000) {
                                $("input[type='file']").val(null);
                                ShowMessage('info', 'File Upload!', "Document size has exceeded it max limit of 500KB.", "bottom-right");
                                return false;
                            }
                            if (files[0].type.split('/')[1] != 'png' && files[0].type.split('/')[1] != 'jpg' && files[0].type.split('/')[1] != 'jpeg') {
                                $("input[type='file']").val(null);
                                ShowMessage('info', 'File Upload!', "Document format should be 'png' or 'jpg'", "bottom-right");
                                return false;
                            }
                            UploadDocument(objID, irregularitySNo, gridtype, IrregularityTransSNo1, "Irregularity");
                            //var fileSelect = document.getElementById(objID);
                            //var filesName = fileSelect.files[0].name;
                            //$("#divfileUploader").append("<span id='spnIrregularityTransUploader_0'></span>");
                            //$("#spnIrregularityTransUploader_" + IrregularityTransSNo1).append("<input id='hdnfilesName_0' name='hdnfilesName' type='hidden' value='" + filesName + "'/>");
                        });
                    })
                })

                //return efd.length;
            }
            else {
                var IrregularitySNo = $("#hdnIrregularitySNo").val();
                var trID = $("#" + BttnID + "").closest('tr').attr('id');
                var IrregularityTransSNo = $("#" + trID + "").find('input[id^=tblIrregularityTrans_IrregularityTransSNo_]').val();
                $("#divUploader").html("<div id='divfileUploader'><span id='spnIrregularityTransUploader'><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + IrregularitySNo + "'/><input id='IrregularityTransSNo' name='IrregularityTransSNo' type='hidden' value='" + IrregularityTransSNo + "'/><input id='hdnIrregularitygridType' name='hdnIrregularitygridType' type='hidden' value='" + gridType + "'/><table id='tblIrregularityUploader'><tr id='Uploader_0'><td><form action='demo_form.asp'><input type='file' id='fileUploader_0' name='pic' accept='image/*'></form></td><td id='addLabel_0'><label style='color:blue;text-decoration: underline;' id='Downloadlbl_0' >Download File:-    </label></td><td id='addimage_0'><img src='./Images/AddIcon.png' onclick='AddRow(this,IrregularityTransSNo)'/></td><td id='deleteimage_0'><img src='./Images/delete.png' onclick='DeleteRow(this)'/></td></tr><tr id='buttonRow'><td class'formActiontitle'><input type='button' name='operation' id='SaveUpload' value='OK' class='btn btn-success'></td><td><span style='font-size: x-small; font-weight: 400; color: gray;'>Only 'png' and 'jpg' format will be accepted. </span></td></tr></table></span></div>");
                $("#deleteimage_0").hide();
                if (pageType == "READ") {
                    $("#addimage_0").hide();
                    $("#deleteimage_0").hide();
                    $("#tblIrregularityUploader tr[id^=Uploader_]").each(function () {
                        var trID = $(this).attr('id');
                        var DownloadID = $("#" + trID + "").find('label').attr('id');
                        var fileUploaderID = $("#" + trID).find('input[id^=fileUploader_]').attr('id');
                        $("#" + fileUploaderID).attr("disabled", true);
                        $("#" + DownloadID + "").removeAttr('onclick');
                    })
                }
                cfi.PopUp("divUploader", "Upload Your Document", 500, null, null, 100);
                $("tr[id^='Uploader_']").each(function () {
                    var trID = $(this).attr('id');
                    $("#" + trID).find("input[id^=fileUploader_]").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            var objID = $(this).attr("id");
                            var irregularitySNo = $("#hdnIrregularitySNo").val();
                            var gridtype = "";
                            if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
                                gridtype = $("#IncidentCategory").val();
                            }
                            else {
                                gridtype = $("#Text_IncidentCategory").val();
                            }
                            var fileSelect = document.getElementById(objID);
                            var files = fileSelect.files;
                            if (files[0].name.indexOf('_') != -1) {
                                $("input[type='file']").val(null);
                                ShowMessage('info', 'File Upload!', "( _ ) 'underscore' can not be used in Document Name.", "bottom-right");
                                return false;
                            }
                            if (files[0].name.length > 54) {
                                $("input[type='file']").val(null);
                                ShowMessage('info', 'File Upload!', "Document Name is too long. Number of character can not be greater than '50'.", "bottom-right");
                                return false;
                            }
                            if (files[0].size > 512000) {
                                $("input[type='file']").val(null);
                                ShowMessage('info', 'File Upload!', "Document size has exceeded it max limit of 500KB.", "bottom-right");
                                return false;
                            }
                            if (files[0].type.split('/')[1] != 'png' && files[0].type.split('/')[1] != 'jpg' && files[0].type.split('/')[1] != 'jpeg') {
                                $("input[type='file']").val(null);
                                ShowMessage('info', 'File Upload!', "Document format should be 'png' or 'jpg'", "bottom-right");
                                return false;
                            }

                            UploadDocument(objID, irregularitySNo, gridtype, IrregularityTransSNo, "Irregularity");
                            var fileSelect = document.getElementById(objID);
                            var filesName = fileSelect.files[0].name;
                            //$("#divfileUploader").append("<span id='spnIrregularityTransUploader_0'></span>");
                            //$("#spnIrregularityTransUploader_" + IrregularityTransSNo1).append("<input id='hdnfilesName_0' name='hdnfilesName' type='hidden' value='" + filesName + "'/>");
                            $("#tblIrregularityUploader tr[id^=Uploader_0] td[id^=addLabel_0]").remove();
                            $("#tblIrregularityUploader tr[id^=Uploader_0] td[id^=addimage_0]").remove();
                            $("#tblIrregularityUploader tr[id^=Uploader_0] td[id^=deleteimage_0]").remove();
                            $("#tblIrregularityUploader tr[id^=Uploader_0]").append("<td id='addLabel_0'><label style='color:blue;text-decoration: underline;' id='Downloadlbl_0' onclick='DownloadDocument(this)' >Download File:- " + filesName + "      </label></td><td id='addimage_0'><img src='./Images/AddIcon.png' onclick='AddRow(this,IrregularityTransSNo)'/><input id='hdnImageSNo_0' name='hdnImageSNo' type='hidden' value='0'/></td><td id='deleteimage_0'><img src='./Images/delete.png' onclick='DeleteRow(this)'/></td>")
                            $("#deleteimage_0").hide();
                            $("#fileUploader_0").attr("disabled", true);
                        });
                    })
                })
            }
        },
        error: function (er) {
            debugger
        }
    });
}

function ClosePopup() {
    //vardivID = $("div[id=#divUploader] div").attr('id');
    //$("#" + vardivID + "").html('');
    //$("div[id=divUploader]").html('');
    //$("#divUploader").empty();
}

function DownloadDocument(id) {
    var irregularitySNo = $("#hdnIrregularitySNo").val();
    var IrregularityTransSNo = $("input[id^=tblIrregularityTrans_IrregularityTransSNo_]").val()
    var trID = $(id).closest('tr').attr('id');
    var position = trID.split('_')[1];
    //var filenameID = $("tr[id=" + trID + "] td:nth-last-child(1) input[id^=hdnImageAttachement_]").attr('id');
    var filenameID = $("#" + trID).find('input[name=hdnImageAttachement]').attr('id');
    //var ImageSNoID = $("tr[id=" + trID + "] td:nth-last-child(1) input[id^=hdnImageSNo_]").attr('id');
    var ImageSNoID = $("tr[id=" + trID + "]").find("input[id^=hdnImageSNo_]").attr('id');  //td:nth-last-child(1) input[id^=hdnImageSNo_]").attr('id');

    var ImageSNo = $("#" + ImageSNoID + "").val();
    if (ImageSNo == 0 || ImageSNo == "0") {
        var objID = $("#" + trID + "").find("input[type='file']").attr('id');
        var fileSelect = document.getElementById(objID);
        var filename = fileSelect.files[0].name;
        ImageSNo = 'a';
    }
    else {
        var filename = $("#" + filenameID + "").val();
    }
    var Download = "Download";
    var url;
    if (location.hostname == "localhost") {
        url = "http://" + location.host;
    }
    else {
        url = "http://" + location.hostname + "/" + (window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').split('.').pop() == "cshtml" ? '' : window.location.pathname.replace(/^\/([^\/]*).*$/, '$1'));
    }

    //localhost:3139
    //192.168.2.229/sasrelease
    window.open(url + "/Handler/UploadImage.ashx?Download=" + Download + "&filename=" + filename + "&ImageSNo=" + ImageSNo + "&position=" + position + "&irregularitySNo=" + irregularitySNo + "&IrregularityTransSNo=" + IrregularityTransSNo);
    //$.ajax({
    //    url: "Handler/UploadImage.ashx?Download=" + Download + "&filename=" + filename + "&ImageSNo=" + ImageSNo + "&position=" + position + "&irregularitySNo=" + irregularitySNo + "&IrregularityTransSNo=" + IrregularityTransSNo,
    //    type: "POST",
    //    data: data,
    //    contentType: false,
    //    processData: false,
    //    success: function (result) {
    //        //var a = "";
    //        //if (result == "") {
    //        //    $("#" + objId).val("");
    //        //    ShowMessage('info', 'File Upload!', "This Document is already exist.", "bottom-right");
    //        //}
    //        //$("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);
    //        //$("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
    //    },
    //    error: function (err) {
    //        ShowMessage('info', 'File Upload!', "Unable to Download selected file. Please try again.", "bottom-right");
    //    }
    //});
    var abc = "";
}

function SaveUploader() {
    if (!cfi.IsValidTransSection("divareaTrans_Master_AuthorizedPersonal")) {
        return false;
    }
    var AuthorizedPERSONNELArray = [];
    var flag = false;
    $("tr[id^=areaTrans_Master_AuthorizedPersonal]").each(function () {
        var authorizedPERSONNEL = {
            SNo: parseInt($(this).find("input[id^='SNo']").val() == "" ? 0 : $(this).find("input[id^='SNo']").val()),
            CustomerSNo: $('#hdnCustomerSNo').val(),
            Name: $(this).find("input[id^='Name']").val(),
            IdCardNo: $(this).find("input[id^='IdCardNo']").val(),
            IdCardName: $(this).find("span[id^='IdCardName']").text(),
            AttachIdCardName: $(this).find("a[id^='ahref_IdCardName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_IdCardName']").attr("linkdata"),
            AuthorizationLetterName: $(this).find("span[id^='AuthorizationLetterName']").text(),
            AttachAuthorizationLetterName: $(this).find("a[id^='ahref_AuthorizationLetterName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_AuthorizationLetterName']").attr("linkdata"),
            PhotoName: $(this).find("span[id^='PhotoName']").text(),
            AttachPhotoName: $(this).find("a[id^='ahref_PhotoName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_PhotoName']").attr("linkdata")
        };
        AuthorizedPERSONNELArray.push(authorizedPERSONNEL);
    });

    if (AuthorizedPERSONNELArray.length == 0) {
        ShowMessage('warning', 'Warning - Authorized Personnel Info', "unable to process.", "bottom-right");
    }

    $.ajax({
        url: "Services/Irregularity/IrregularityService.svc/SaveUploader", async: false, type: "POST", dataType: "json", cache: false,
        data: null,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

        }
    });
    return flag;
}

var CurrentRow;
function PopupDiv(obj, IrregularitySNo, IrregularityTransSNo) {
    CurrentRow = obj;
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        var HidDataVal = $("#" + obj).closest('tr').find("input[type=hidden][id*='hdnChildData']").val();
        CreateTransDimensionGrid("IrregularityTransDimension", IrregularitySNo, IrregularityTransSNo);
        if (HidDataVal != 0 && HidDataVal != "") {
            $("#tblIrregularityTransDimension").appendGrid('load', JSON.parse(HidDataVal));
        }
        //else {
        //    BindDimensionChildGrid("tblAWBRateDesriptionChild");
        //}
        $("div[id=divIrregularityTransDimension]").not(':first').remove();
        if (!$("#divIrregularityTransDimension").data("kendoWindow")) {
            cfi.PopUp("divIrregularityTransDimension", "Dimension Table", 1000, null, null, 100);
        }
            //cfi.PopUp("tbl" + dbtableName + "", "", 1000, null, null, 100);
        else {
            if (HidDataVal != 0 && HidDataVal != "") {
                $("#divIrregularityTransDimension").data("kendoWindow").open();
            }
            else {
                cfi.PopUp("divIrregularityTransDimension", "Dimension Table", 1000, null, null, 100);
            }
        }
        // cfi.PopUp("ChildGrid", "", null, null, ShowAlert);

    }
    else {
        CreateTransDimensionGrid("IrregularityTransDimension", IrregularitySNo, IrregularityTransSNo);
    }
}

function ShowAlert(e) {
    //var strData;
    //var rows = $("tr[id^='tblAWBRateDesriptionChild']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    //getUpdatedRowIndex(rows.join(","), "tblAWBRateDesriptionChild");
    //strData = $('#tblAWBRateDesriptionChild').appendGrid('getStringJson');
    var childdata = [];
    $("#tblIrregularityTransDimension").find("tr[id^='tblIrregularityTransDimension_Row_']").each(function (i, row) {
        var dimInfo = {
            SNo: i + 1,
            Length: $(row).find("[id^=tblIrregularityTransDimension_Length_]").val() || "0",
            Width: $(row).find("[id^=tblIrregularityTransDimension_Width_]").val() || "0",
            Height: $(row).find("[id^=tblIrregularityTransDimension_Height_]").val() || "0",
            MeasurementUnit: $(row).find("[id^=tblIrregularityTransDimension_MeasurementUnit_]").val() || "0",
        }
        childdata.push(dimInfo);
    });

    $("#" + CurrentRow).closest('tr').find("input[type=hidden][id*='hdnChildData']").val(JSON.stringify(childdata));
    $("#divIrregularityTransDimension").data("kendoWindow").close();
}

var pageType = $('#hdnPageType').val();
function CreateTransDimensionGrid(tableid, IrregularitySNo, IrregularityTransSNo) {
    var dbtableName = tableid;
    var UploadSNo = $("#hdnIrregularitySNo").val();
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        masterTableSNo: IrregularitySNo,
        currentPage: 1, itemsPerPage: 10, whereCondition: IrregularityTransSNo, sort: "",
        servicePath: "./Services/Irregularity/IrregularityService.svc",
        getRecordServiceMethod: "GetIrregularityTransDimensionRecord",
        createUpdateServiceMethod: pageType == "EDIT" ? "Update" + dbtableName : "Blank", //"Update" + dbtableName,
        deleteServiceMethod: pageType == "EDIT" ? "delete" + dbtableName : "",
        caption: "Dimension Table",
        initRows: 1,
        columns: [{ name: "SNo", type: "hidden", value: 0 },
                 { name: "IrregularityTransSNo", type: "hidden", value: IrregularityTransSNo },
                 { name: "IrregularitySNo", type: "hidden", value: $("#IrregularitySNo").val() },
                 { name: "Length", display: "Length", type: (pageType == "READ" ? "label" : "text"), ctrlAttr: { maxlength: 18, controltype: (pageType == "READ" ? "" : "decimal2") }, ctrlCss: { width: "50px" }, isRequired: (pageType == "READ" ? false : true) },
                 { name: "Width", display: "Width", type: (pageType == "READ" ? "label" : "text"), ctrlAttr: { maxlength: 18, controltype: (pageType == "READ" ? "" : "decimal2") }, ctrlCss: { width: "50px" }, isRequired: (pageType == "READ" ? false : true) },
                 { name: "Height", display: "Height", type: (pageType == "READ" ? "label" : "text"), ctrlAttr: { maxlength: 18, controltype: (pageType == "READ" ? "" : "decimal2") }, ctrlCss: { width: "50px" }, isRequired: (pageType == "READ" ? false : true) },
                 { name: "MeasurementUnit", display: "Measurement Unit", type: (pageType == "READ" ? "label" : "select"), ctrlAttr: { maxlength: 18, controltype: (pageType == "READ" ? "" : "default") }, ctrlOptions: { 0: "CMS", 1: "Inch" }, ctrlCss: { width: "50px" }, isRequired: (pageType == "READ" ? false : true) },


        //{ name: "SlabType", display: "Slab Type", type: "select", ctrlAttr: { maxlength: 100, onchange: "return ChangeUnitType(this.id);" }, ctrlOptions: { 0: "WEIGHT", 1: "TIME", 2: "UNIT" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
        ],
        isPaging: false,
        hideButtons: { updateAll: (pageType == "READ" ? true : false), append: (pageType == "READ" ? true : false), insert: true, remove: (pageType == "READ" ? true : false), removeLast: (pageType == "READ" ? true : false) }
    });
    if (pageType != "NEW") {
        cfi.PopUp("tbl" + dbtableName + "", "Dimension Table", 1000, null, null, 100);
    }
}

function PiecesValue(obj) {
    var Pieces = parseInt($(obj).val());
    if (Pieces) {
        if ($('#tblIrregularityTrans_HAWBNo_' + $(obj).attr('id').split('_')[2]).val()) {
            if (Pieces > $('#tblIrregularityTrans_HAWBPcs_' + $(obj).attr('id').split('_')[2]).val()) {
                ShowMessage('info', 'HAWB Pcs !', "Pieces are greater than HAWB Pcs:- " + $('#tblIrregularityTrans_HAWBPcs_' + $(obj).attr('id').split('_')[2]).val() + " ", "bottom-right");
                $(obj).val("");
                return
            }
            else {
                return;
            }
        }
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            if ($("input[type=radio][name=IsAWBLabel]:checked").val() == "1") {
                return;
            }
            var FL = $("#IncidentCategory").val() == "FDCA" ? 'a' : $("#FlightNo").val();
            if (FL != "") {
                if ($("#IncidentCategory").val() == 'OVCD') {
                    AWBNoPieces = parseInt($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(4)").text())
                }
                else if ($("#IncidentCategory").val() == 'MSCA') {
                    AWBNoPieces = parseInt($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(5)").text().split('/')[0].trim());
                }
                else if ($("#IncidentCategory").val() == 'OFLD' || $("#IncidentCategory").val() == 'SSPD') {
                    AWBNoPieces = parseInt($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(5)").text().split('/')[0].trim());
                }
                else {
                    AWBNoPieces = parseInt($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(5)").text());
                }
                if ($("#IncidentCategory").val() == 'SSPD') {
                    if (Pieces == AWBNoPieces) {
                        ShowMessage('info', 'Short Shipped!', "For " + Pieces + " Pieces SHORT SHIPPED can not be raised.", "bottom-right");
                        $(obj).val("");
                        return
                    }
                }
                if (Pieces > AWBNoPieces) {
                    ShowMessage('warning', 'Need your Kind Attention!', $("#IncidentCategory").val() == 'OVCD' ? 'Pieces can not be greater than "Total Pieces" as showing in AWB Detail table.' : ($("#IncidentCategory").val() == "MSCA" ? 'Pieces can not be greater than "Remaining Pieces" as showing in AWB Detail table.' : 'Pieces can not be greater than "Remaining Pieces" as showing in AWB Detail table.'));
                    $(obj).val("");
                    return
                }
            }
            else {
                if ($("#IncidentCategory").val() == "FDCA" || $("#IncidentCategory").val() == "MSMB" || $("#IncidentCategory").val() == "FDMB" || $("#IncidentCategory").val() == "MSAV" || $("#IncidentCategory").val() == "FDAV" || $("#IncidentCategory").val() == "DMCA") {
                    if ($("#IncidentCategory").val() == "DMCA") {
                        if ($("input[name^=Type]:checked").val() == 1) {
                            ShowMessage('warning', 'Need your Kind Attention!', 'First select Flight No.');
                            $(obj).val("");
                        }
                        else {

                        }
                    }

                }
                else {
                    ShowMessage('warning', 'Need your Kind Attention!', 'First select Flight No.');
                    $(obj).val("");
                }
            }
        }
        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
            if ($('#RemainingPcs').val() != "") {
                var RemainingPcs = parseInt($('#RemainingPcs').val());
                var hdnpcs = parseInt($('#' + obj.id).closest('tr').find('input[id^=tblIrregularityTrans_HdnPieces_]').val());
                if ($("#hdnIncidentCategoryCode").val() == 'SSPD') {
                    if (Pieces == RemainingPcs + hdnpcs) {
                        ShowMessage('info', 'Short Shipped!', "For " + Pieces + " Pieces SHORT SHIPPED can not be raised.", "bottom-right");
                        $(obj).val("");
                        return
                    }
                    else if (Pieces > RemainingPcs + hdnpcs) {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Pieces can not be greater than "Remaining Pieces" .');
                        $(obj).val("");
                        return
                    }
                }
                else if ($("#hdnIncidentCategoryCode").val() == 'MSCA') {
                    if (Pieces > RemainingPcs) {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Pieces can not be greater than "Remaining Pieces" .');
                        $(obj).val("");
                        return
                    }
                }
                else {
                    if (Pieces > RemainingPcs + hdnpcs) {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Pieces can not be greater than "Remaining Pieces" .');
                        $(obj).val("");
                        return
                    }
                }
            }
        }
    }
}

function CheckWeight(obj) {
    var Weight = parseFloat($(obj).val());
    if (Weight) {
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            var FL = $("#IncidentCategory").val() == "FDCA" ? 'a' : $("#FlightNo").val();
            if (FL != "") {
                if ($("#IncidentCategory").val() == 'MSCA' || $("#IncidentCategory").val() == 'MSAW') {
                    var TWeight = parseFloat($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(5)").text().split('/')[1]);
                    if (Weight > TWeight) {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Weight can not be greater than "Rem.Gr.Wt." as showing in AWB Detail table.');
                        $(obj).val("");
                        return
                    }
                }
                else if ($("#IncidentCategory").val() == 'OFLD' || $("#IncidentCategory").val() == 'SSPD') {
                    var TWeight = parseFloat($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(5)").text().split('/')[1]);
                    if (Weight > TWeight) {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Weight can not be greater than "Rem.Gr.Wt." as showing in AWB Detail table.');
                        $(obj).val("");
                        return
                    }
                    if ($("#IncidentCategory").val() == 'SSPD') {
                        if (Weight == TWeight) {
                            ShowMessage('info', 'Short Shipped!', "For " + Weight + " Weight SHORT SHIPPED can not be raised.", "bottom-right");
                            $(obj).val("");
                            return
                        }
                    }
                }
                else if ($("#IncidentCategory").val() == 'OVCD') {
                    var TWeight = parseFloat($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(5)").text());
                    if (Weight > TWeight) {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Weight can not be greater than "T.Gr.Wt." as showing in AWB Detail table.');
                        $(obj).val("");
                        return
                    }
                }
                else if ($("#IncidentCategory").val() == 'FDAW') {
                    var TWeight = parseFloat($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(6)").text());
                    if (Weight > TWeight) {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Weight can not be greater than "T.Gr.Wt." as showing in AWB Detail table.');
                        $(obj).val("");
                        return
                    }
                }
                else {
                    var TWeight = parseFloat($("div[id^=divGetAWBDetail] table tbody:last tr:nth-child(3) td:nth-child(6)").text());
                    if (Weight > TWeight) {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Weight can not be greater than "T.Gr.Wt." as showing in AWB Detail table.');
                        $(obj).val("");
                        return
                    }
                }
            }
            else {
                if ($("#IncidentCategory").val() == "FDCA" || $("#IncidentCategory").val() == "MSMB" || $("#IncidentCategory").val() == "FDMB" || $("#IncidentCategory").val() == "MSAV" || $("#IncidentCategory").val() == "FDAV" || $("#IncidentCategory").val() == "DMCA") {
                    if ($("#IncidentCategory").val() == "DMCA") {
                        if ($("input[name^=Type]:checked").val() == 1) {
                            ShowMessage('warning', 'Need your Kind Attention!', 'First select Flight No.');
                            $(obj).val("");
                        }
                        else {

                        }
                    }

                }
                else {
                    ShowMessage('warning', 'Need your Kind Attention!', 'First select Flight No.');
                    $(obj).val("");
                }
            }
        }

        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
            var TWeight = parseFloat($('#TotalGrossWeight').val())
            if (Weight > TWeight) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Weight can not be greater than "Total Gross Weight" .');
                $(obj).val("");
                return
            }
        }
    }
}

function SendMessage() {
    if ($('[id$="txtMessage"]').val() == "")
        alert("Message can not be blank");
    else if ($('[id$="spnAddress"]').text() == "" && $('[id$="txtEmail"]').val() == "")
        alert("Please enter at least one of email or sita address");
    else {
        $.ajax({
            type: "POST",
            url: "./Services/Irregularity/IrregularityService.svc/SendMessage?IrregularitySNo=" + $("#hdnIrregularitySNo").val() + "&Message=" + $('[id$="txtMessage"]').val() + "&Email=" + $('[id$="txtEmail"]').val() + "&AssignTo=" + $('#AssignTo').val(),
            dataType: "json",
            success: function (response) {
                //navigateUrl('Default.cshtml?Module=Irregularity&Apps=Irregularity&FormAction=INDEXVIEW');
                OpenTracing();
                $('[id$="txtMessage"]').val('');
                $('[id$="txtEmail"]').val('');
                $('#AssignTo').val('');
                $('#Text_AssignTo').val('');
            },
            error: function (er) {
                debugger
            }
        });
    }
}

function UpdateStatus() {
    if ($("#Text_Status").val() == "")
        alert("Please select status");
    else if ($('[id$="txtRemarks"]').val() == "")
        alert("Remarks can not be blank");
    else {
        $.ajax({
            type: "POST",
            url: "./Services/Irregularity/IrregularityService.svc/UpdateStatus?IrregularitySNo=" + $("#hdnIrregularitySNo").val() + "&Status=" + $("#Text_Status").val() + "&Remarks=" + $('[id$="txtRemarks"]').val(),
            dataType: "json",
            success: function (response) {
                navigateUrl('Default.cshtml?Module=Irregularity&Apps=Irregularity&FormAction=INDEXVIEW');
            },
            error: function (er) {
                debugger
            }
        });
    }
}

function CreateTransPopUpGrid() {
    var gridType = $("#IncidentCategory").val();
    var labelType = $("input[name='IsAWBLabel']:checked").val();
    var dbtableName = "IrregularityDamageTrans";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        tableColume: "SNo,RowSNo,Pieces,DamageType",
        masterTableSNo: $("#hdnIrregularitySNo").val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: "./Services/Irregularity/IrregularityService.svc",
        getRecordServiceMethod: "GetTransRecord",
        createUpdateServiceMethod: "CreateUpdate" + dbtableName,
        deleteServiceMethod: "Delete" + dbtableName,
        caption: "Damaged Cargo",
        initRows: 1,
        columns: [{ name: "SNo", type: "hidden", value: 0 },
                 { name: "RowSNo", type: "hidden", value: $("#IrregularitySNo").val() }, { name: "GridType", type: "hidden", value: "MSCA" },
                 { name: "Pieces", display: "Pieces", type: "text", ctrlAttr: { maxlength: 10, controltype: "number" }, ctrlCss: { width: "60px" }, isRequired: true, value: 0 },
                 { name: "ContentsCodition", display: "ContentsCodition", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "IrregularityDamage", textColumn: "Damage", keyColumn: "SNo" }],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true }
    });

}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("tblIrregularityTrans_ContentType") >= 0) {
        cfi.setFilter(filterEmbargo, "DamageType", "notin", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
    if (textId.indexOf("tblIrregularityTrans_DamageType") >= 0) {
        cfi.setFilter(filterEmbargo, "DamageType", "notin", 2);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
    if (textId.indexOf("tblIrregularityTrans_HAWBNo") >= 0) {
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            cfi.setFilter(filterEmbargo, "AWBSNo", "eq", $('#AWBNo').val());
        }
        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
            cfi.setFilter(filterEmbargo, "AWBSNo", "eq", $('#tabCount').val().split('-')[1]);
        }
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
    if (textId == "FlightNo") {
        try {
            //cfi.setFilter(filter, "AirlineSNo", "eq", $("#AirlineName1").val())
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#FlightDate").attr("sqldatevalue"))
            if ($("input[name^=Type]:checked").val() == "1") {
                cfi.setFilter(filterEmbargo, "DestinationAirportCode", "eq", userContext.AirportCode)
            }
            else if ($("input[name^=Type]:checked").val() == "0") {
                cfi.setFilter(filterEmbargo, "OriginAirportCode", "eq", userContext.AirportCode)
            }
            cfi.setFilter(filterEmbargo, "AWBSNo", "eq", $("#AWBNo").val())
            //cfi.setFilter(filter, "IsDirectFlight", "eq", 1)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
}

function BackButton() {
    navigateUrl('Default.cshtml?Module=Irregularity&Apps=Irregularity&FormAction=INDEXVIEW');
}

function GetDeliveryOrderPrint(ISNo) {
    //var ISNo = getParameterByName("ISNo", "");
    var abc = '';
    if (ISNo !== null) {
        $.ajax({
            url: "Services/Irregularity/IrregularityReportService.svc/GetCDRPrint",
            async: false,
            type: "GET",
            dataType: "json",
            data: { ISNo: ISNo },
            contentType: "application/json; charset=utf-8", cache: false,

            success: function (result) {
                //alert(data); // this is Json data object
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                FinalData1 = ResultData.Table1;
                FinalData2 = ResultData.Table2;
                FinalData3 = ResultData.Table3;
                FinalData4 = ResultData.Table4;
                FinalData5 = ResultData.Table5;
                $('#HAWBNo').hide();
                if (FinalData.length > 0) {
                    $("#spnAWBIssueDate").text(FinalData[0].AWBIssueDate);
                    $("#spnAWBNumber").text(FinalData[0].AWBNumber);
                    $("#spnAirportOfDestination").text(FinalData[0].AirportOfDestination);
                    $("#spnAirportOfOrgin").text(FinalData[0].AirportOfOrgin);
                    $("#spnConsigneesNameAndAddress").text(FinalData[0].ConsigneesNameAndAddress);
                    $("#spnConsigneesAddress").text(FinalData[0].ConsigneesAddress)
                    $('#spnDate').text(FinalData[0].Date)
                    $("#spnDescriptionOfContents").text(FinalData[0].DescriptionOfContents);
                    $("#spnRemarks").html(FinalData[0].Remarks);
                    $("#spnFlightNumber").html(FinalData[0].FlightNumber);
                    $("#spnPiecesWeightAsPerAWB").html(FinalData[0].PiecesWeightAsPerAWB);
                    $("#spnPiecesWeightDamaged").html(FinalData[0].PiecesWeightDamaged);
                    $("#spnPiecesWeightMissing").html(FinalData[0].PiecesWeightMissing);
                    $("#spnPiecesWeightRecived").html(FinalData[0].PiecesWeightRecived);
                    $("#spnSignedConsignee").html(FinalData[0].SignedConsignee);
                    $("#SpnSerialNo").html(FinalData[0].SerialNo);
                    if (FinalData[0].IsCancel == "False") {
                        $("#spnReprintCount").html(FinalData[0].PrintCount > 1 ? "(RE-PRINT: " + (FinalData[0].PrintCount - 1).toString() + ")" : "");
                    }
                    if (FinalData[0].HAWB) {
                        $('#HAWBNo').show()
                        $('#HAWBNUmber').html(FinalData[0].HAWB);
                    }
                }
                if (FinalData5) {
                    if (FinalData5.length > 0) {
                        $("#spnHAWBConsigneesNameAndAddress").html(FinalData5[0].HAWBConsigneesNameAndAddress);
                        $("#spnHAWBConsigneesAddress").html(FinalData5[0].HAWBConsigneesAddress);
                    }
                }
                var strdata = '';

                if (FinalData1.length > 0) {
                    //strdata = strdata + "<tr><td align='center' style='width:8%'>Pcs</td><td align='center' style='width:15%'>Gross Wt.</td><td align='center' style='width:52%'>Description of Goods</td><td align='center' style='width:25%'>Flight Details</td></tr>";
                    //  for (var num = 0; num < FinalData1.length; num++) {
                    //      strdata = strdata + "<tr><td style='border:1px solid black; padding-right:10px' align='center'><span id='spnPcs'>" + FinalData1[num].Pieces + "</span></td><td class='auto-style36' style='border:1px solid black;' align='center'><span id='spnGrossWt'>" + FinalData1[num].GrossWeight + "</span></td><td class='auto-style12' style='border:1px solid black; vertical-align:top;'><span id='spnDescription'>" + FinalData1[num].DescriptionOfGoods + "</span></td><td style='border:1px solid black;height:40px; vertical-align:top;'><span id='spnFlightDetails'>" + FinalData1[num].FlightDetails + "</span></td><tr>";
                    //$("#spnPcs").text(FinalData1[num].Pieces);
                    //$("#spnGrossWt").text(FinalData1[num].GrossWeight);
                    //$("#spnDescription").text(FinalData1[num].DescriptionOfGoods);
                    //$("#spnFlightDetails").text(FinalData1[num].FlightDetails);
                    //   }
                    if (FinalData1[0].PackingName == "") {
                        $("#spnOuterPacking").text('--')
                    }
                    else {
                        $("#spnOuterPacking").text(FinalData1[0].PackingName);
                    }
                }
                else {
                    $("#spnOuterPacking").text('--')
                }
                var Particulars;
                var Charges;
                var TotalCharges = 0;
                if (FinalData2.length > 0) {
                    //for (var num = 0; num < FinalData2.length; num++) {
                    //    Particulars = Particulars + "</br>" + FinalData2[num].TariffName;
                    //    Charges = Charges + "</br>" + FinalData2[num].ChargeValue;
                    //    TotalCharges = parseFloat(TotalCharges) + parseFloat(FinalData2[num].ChargeValue);
                    //}
                    //$("#spnParticulars").html(Particulars.replace(undefined, ""));
                    //$("#spnAmount").html(Charges.replace(undefined, ""));
                    //$("#spnTotal").html(TotalCharges);
                    if (FinalData2[0].Damage == "") {
                        $("#spnDamagetoOuterPacking").text('--')
                    }
                    else {
                        $("#spnDamagetoOuterPacking").text(FinalData2[0].Damage);
                    }
                }
                else {
                    $("#spnDamagetoOuterPacking").text('--')
                }

                if (FinalData3.length > 0) {
                    $("#spnRemarks").text(FinalData3[0].IdentificationRemarks)
                }
                $("#spnSigned").text(userContext.FirstName)

                if (FinalData4[0].BalanceReceivable === "0" || FinalData4[0].BalanceReceivable === "0.0000" || parseFloat(FinalData4[0].BalanceReceivable) < 0) {
                    $("#btnCDRPrint").show();
                }
                else {
                    $("#background").css({ 'position': 'absolute', 'z-index': '0', 'background': 'rgba(255, 255, 255, 0)', 'display': 'block', 'color': 'yellow', 'width': '68%', 'margin-left': '15%', 'margin-right': '10%', 'margin-top': '12%' })
                    $('#bg-text').css({ 'color': 'lightgrey', 'font-size': '79px', 'transform': 'rotate(328deg)', '-webkit-transform': 'rotate(323deg)', 'margin-top': '17px' })
                    $('#bg-text').text('(DUMMY, NOT FINAL)')
                    $("#btnCDRPrint").hide();
                }
                //PrintElem('#table1');
            },
            error: function (err) {
                alert("Generated error");
            }
        });
    }
    else {
        //PrintElem('#table1');
        alert("Value Null");
    }
}

function PrintElem(elem) {
    Popup($(elem).html());
}

function Popup(data) {
    var mywindow = window.open('', 'my div', 'height=400,width=600');
    mywindow.document.write('<html><head><title>my div</title>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}

function SendMailNND(IrregularitySNo, TabCount, TableID, DeliveryOrderFee, HandlingCharges, StorageCharges) {
    //cfi.PopUp("", "History Details", 1000, null, null, 100);
    $('#NNDMailDiv').remove();
    $("#" + TableID).append("<div id='NNDMailDiv'><span id='spnNNDMail'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + getQueryStringValue("FormAction").toUpperCase() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + IrregularitySNo + "'/><input id='hdnTabCount' name='hdnTabCount' type='hidden' value='" + TabCount + "'/><table style='width:100%;' id='tblNNDMail' class='WebFormTable'></table></span></div>");
    $('#tblNNDMail').append('<tr><td style="padding-left: 5px; width: 200px">From</td> <td><label style="width:400px;height:50px;color:#808080;font-size:medium">info@cargoflash.com</label></td></tr> <tr><td style="padding-left: 5px; width: 200px">Email</td> <td><textarea id="txtEmailNND" style="width:400px;height:50px"></textarea></td></tr>');
    $('div[id="NNDMailDiv"] span[id="spnNNDMail"]').append('<table style="width:100%;" id="tblNNDMail2"><tr><td><input style="Float:right;margin-right: 17%;" id="btnSendMailNND2" type="button" value="Send" ></td> <td><input style="margin-left: 12%;" id="btnCnclMailNND2" type="button" value="Cancel" onclick="CloseTab()" ></td></tr></table>');

    cfi.PopUp("NNDMailDiv", "Send Mail", 700, null, null, 500);

    $('#btnSendMailNND2').on('click', function () {
        //SendMail(IrregularitySNo, TabCount, TableID, DeliveryOrderFee, HandlingCharges, StorageCharges);
        if (!$('#txtEmailNND').val()) {
            ShowMessage('info', 'Send Mail', 'Please enter at least one of Email address');
            return;
        }
        else {
            $.ajax({
                url: "./Services/Irregularity/IrregularityService.svc/SendMailNND?IrregularitySNo=" + IrregularitySNo + "&TabCount=" + TabCount + "&TableID=" + TableID + "&Email=" + $('#txtEmailNND').val() + "&DeliveryOrderFee=" + DeliveryOrderFee + "&HandlingCharges=" + HandlingCharges + "&StorageCharges=" + StorageCharges,
                async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                success: function (response) {
                    ShowMessage('success', 'Success!', "Mail Sent Successfully");
                    $("#NNDMailDiv").data("kendoWindow").close();
                },
                error: function (er) {
                    debugger
                }
            });
        }
    })

    //$("#btnCnclMailNND2").on("click", function () {
    //    $("#NNDMailDiv").data("kendoWindow").close();
    //})
    //<tr><td style=\"padding-left: 5px; width: 200px\">Message<\/td> <td><textarea id=\"txtMessage\" style=\"width:400px;height:150px\"><\/textarea><\/td><\/tr>
}

function CloseTab() {
    $("#NNDMailDiv").data("kendoWindow").close();
}

//function SendMail(IrregularitySNo, TabCount, TableID, DeliveryOrderFee, HandlingCharges, StorageCharges) {

//    if (!$('#txtEmailNND').val()) {
//        ShowMessage('info', 'Send Mail', 'Please enter at least one of Email address');
//        return;
//    }
//    else {
//        $.ajax({
//            url: "./Services/Irregularity/IrregularityService.svc/SendMailNND?IrregularitySNo=" + IrregularitySNo + "&TabCount=" + TabCount + "&TableID=" + TableID + "&Email=" + $('#txtEmailNND').val() + "&DeliveryOrderFee=" + DeliveryOrderFee + "&HandlingCharges=" + HandlingCharges + "&StorageCharges=" + StorageCharges,
//            async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
//            success: function (response) {
//                ShowMessage('success', 'Success!', "Mail Sent Successfully");
//                $("#NNDMailDiv").data("kendoWindow").close();
//            },
//            error: function (er) {
//                debugger
//            }
//        });
//    }
//}
function SetHawbPCS(value) {
    //var BttnID = evt.item.context.offsetParent.id.split('-')[0];
    var BttnValue = $('#' + value).val();
    var hdnBttnValue = $('#tblIrregularityTrans_Hdn' + value.split('_')[1] + '_' + value.split('_')[2]).val();
    if (BttnValue) {
        $.ajax({
            url: "Services/Irregularity/IrregularityService.svc/GetHAWBPcs?SNo=" + hdnBttnValue + "&MovementTypeSNo=" + $("input[name^=Type]:checked").val(),
            dataType: "json",
            success: function (result) {
                var Table = jQuery.parseJSON(result);
                $('#tblIrregularityTrans_HAWBPcs_' + value.split('_')[2]).val(Table.Table0[0].TotalPieces);
            },
            error: function (err) {
                alert("Generated error");
            }
        });
    }
}

function GetNNDPrint(ISNo, TabCount, TableID) {
    var abc = '';
    if (ISNo !== null) {
        $.ajax({
            url: "Services/Irregularity/IrregularityService.svc/GetNNDPrint?ISNo=" + ISNo + "&AWBNo=" + $("#AWBNo").val() + "&MovementType=" + 1 + "&CityCode=" + userContext.CityCode + "&TerminalSNo=" + userContext.TerminalSNo + "&TabCount=" + TabCount,
            dataType: "json",
            success: function (result) {
                var Table1 = jQuery.parseJSON(result).Table0;
                var Table2 = jQuery.parseJSON(result).Table2;
                var IdentificationRemarks = jQuery.parseJSON(result).Table3[0].IdentificationRemarks;
                for (var i = 0; i < Table1.length; i++) {
                    if (Table1[i].isMandatory == 1) {
                        if (Table1[i].TariffHeadName == "DO") {
                            $('#spnDeliveryOrderFee').text(Table1[i].TotalAmount);
                        }
                        else if (Table1[i].TariffHeadName == "HNDL") {
                            $('#spnHandlingCharges').text(Table1[i].TotalAmount);
                        }
                        else if (Table1[i].TariffHeadName == "STRG") {
                            $('#spnStorageCharges').text(Table1[i].TotalAmount);
                        }
                    }
                }
                $('#spnRemarks0').text(IdentificationRemarks);
                DeliveryOrderFee = $('#spnDeliveryOrderFee').text();
                HandlingCharges = $('#spnHandlingCharges').text();
                StorageCharges = $('#spnStorageCharges').text() == "" ? 0 : $('#spnStorageCharges').text();
                $("#trPrint").append('<td> <div style="align-content:center;"> <input type="button" id="btnSendMailNND" value="Send Mail" /></div></td>');
                //onclick = "SendMailNND(IrregularitySNo, TabCount, TableID)"
                $('#btnSendMailNND').on('click', function () {
                    SendMailNND(ISNo, TabCount, TableID, DeliveryOrderFee, HandlingCharges, StorageCharges);
                })
                var Total = parseFloat(DeliveryOrderFee) + parseFloat(HandlingCharges) + parseFloat(StorageCharges);
                $('#SpnTotal').text(parseFloat(Total).toFixed(2));
                if (Table2.length > 0) {
                    $("#SpnConsignee").text(Table2[0].Consignee);
                    $("#SpnShipper").text(Table2[0].Shipper);
                    $("#spnAWBNumber").text(Table2[0].AWBNo);
                    $("#SpnOrigin").text(Table2[0].Origin);
                    $("#SpnDestination").text(Table2[0].Destination);
                    $("#SpnCC").text(Table2[0].PP);
                    $("#SpnFlightDetails").text(Table2[0].FlightNo + ' ' + Table2[0].FlightDate + ' ' + Table2[0].ATATime);
                    $("#spnPcs").text(Table2[0].TotalPieces);
                    $("#SpnWeight").text(Table2[0].TotalGrossWeight);
                    $("#SpnDescription").text(Table2[0].Description);
                    $("#SpnNo").text(Table2[0].SerialNo);
                    $("#SpnCargoType").text(Table2[0].CargoType);
                }
                //$("#trPrint").append('<td> <div style="align-content:center;"> <input type="button" id="btnSendMail" value="Send Mail" onclick="SendMailNND()" /></div></td>');
            },
            error: function (err) {
                alert("Generated error");
            }
        });
    }
    else {
        //PrintElem('#table1');
        alert("Value Null");
    }
}

function GetDetails(ISNo, ActionSNo) {
    $.ajax({
        type: "GET",
        url: "Services/Irregularity/IrregularityService.svc/GetHistoryDetails?ISNo=" + ISNo + "&ActionSNo=" + ActionSNo,
        dataType: "json",
        success: function (response) {
            var strVar = "<\/br>";
            var AWBData = JSON.parse(response);
            var columnNo = 0;
            for (var j in AWBData[0]) {
                columnNo = columnNo + 1;
            }
            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" height=20px; align=\"left\" colspan=\"" + columnNo + "\">History Details<\/td><\/tr>";
            for (var j in AWBData[0]) {
                if ($(j).selector != "IrregularitySNo")
                    strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
            }
            //strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Details</td>";
            strVar += "<\/tr>";

            for (var i in AWBData) {
                strVar += "<tr>";
                for (var j in AWBData[i]) {
                    if ($(j).selector != "IrregularitySNo")
                        strVar += "<td class=\"ui-widget-content\">" + AWBData[i][j] + "<\/td>";
                }
                //strVar += "<td class=\"ui-widget-content\"><input type=\"button\" id=\"btnDetails\" value=\"Details\" onclick=\"GetDetails(" + AWBData[i]["IrregularitySNo"] + ")\"><\/td>";
                strVar += "<\/tr>";
            }
            strVar += "<\/tbody>";
            strVar += "<\/table>";
            strVar += "<\/br>";
            $('#tblHistoryDetail').html(strVar);

            cfi.PopUp("divGetHistoryDetail", "History Details", 1000, null, null, 100);
        }
    });


}

function GetAWBDimDetails(AWBSNo) {
    var typeID = $("input[name^=Type]:checked").val();
    $.ajax({
        type: "GET",
        url: "Services/Irregularity/IrregularityService.svc/GetAWBDimDetails?AWBSNo=" + AWBSNo + "&typeID=" + parseInt(typeID),
        dataType: "json",
        success: function (response) {
            var strVar = "<\/br>";
            var AWBData = JSON.parse(response);
            var columnNo = 0;
            for (var j in AWBData[0]) {
                columnNo = columnNo + 1;
            }
            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" height=20px; align=\"left\" colspan=\"" + columnNo + "\"><\/td><\/tr>";
            for (var j in AWBData[0]) {
                //if ($(j).selector != "IrregularitySNo")
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
            }
            //strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Details</td>";
            strVar += "<\/tr>";

            for (var i in AWBData) {
                strVar += "<tr>";
                for (var j in AWBData[i]) {
                    //if ($(j).selector != "IrregularitySNo")
                    strVar += "<td class=\"ui-widget-content\">" + AWBData[i][j] + "<\/td>";
                }
                //strVar += "<td class=\"ui-widget-content\"><input type=\"button\" id=\"btnDetails\" value=\"Details\" onclick=\"GetDetails(" + AWBData[i]["IrregularitySNo"] + ")\"><\/td>";
                strVar += "<\/tr>";
            }
            strVar += "<\/tbody>";
            strVar += "<\/table>";
            strVar += "<\/br>";
            $('#tblAWBDimDetails').html(strVar);

            cfi.PopUp("divGetAWBDimDetails", "Dimensions Details", 650, null, null, 100);
        }
    });
}

function ActionDiv(IrregularityTransSNo, IrregularitySNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID) {
    if (gridType == "PLCA") {
        $("#divAction").html('<span id="spnTracing"><input id="hdnIrregularitySNo" name="hdnIrregularitySNo" type="hidden" value="' + IrregularitySNo + '"/><input id="hdnIrregularityTransSNo" name="hdnIrregularityTransSNo" type="hidden" value="' + IrregularityTransSNo + '"/><table id="tblAction" class="WebFormTable" style="background-color: #F5F5F5;"></table></span>');
        $("#tblAction").append('<tr><td><b style="margin-left: 30px;">Action:</b><input type="radio" tabindex="1" data-radioval="HI" class="" name="Action" value="0" checked="true" id="Recuperate"><b>Recuperate</b><input type="radio" tabindex="1" data-radioval="HI" class="" name="Action" value="1" id="HoldShipment"><b>Hold Shipment</b></td><td><b>Remarks:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td></tr><tr><td><input type="button" id="btnSaveAction" value="Save" class="btn btn-success" style="width:60px; margin-left: 30px;"></td><td></td><td></td><td></td></tr>');
    }
    else if (gridType == "DMCA") {
        $("#divAction").html('<span id="spnTracing"><input id="hdnIrregularitySNo" name="hdnIrregularitySNo" type="hidden" value="' + IrregularitySNo + '"/><input id="hdnIrregularityTransSNo" name="hdnIrregularityTransSNo" type="hidden" value="' + IrregularityTransSNo + '"/><table id="tblAction" class="WebFormTable" style="background-color: #F5F5F5;"></table></span>');
        $("#tblAction").append('<tr><td><b style="margin-left: 30px;">Action:</b><input type="radio" tabindex="1" data-radioval="HI" class="" name="Action" value="0" checked="true" id="Recuperate"><b>Recuperate</b><input type="radio" tabindex="1" data-radioval="HI" class="" name="Action" value="1" id="HoldShipment"><b>Hold Shipment</b></td><td><input id="Text_PackageCondition" name="Text_PackageCondition" controltype="autocomplete" type="text" class="input-md form-control tt-input"></td><td><b>Remarks:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td></tr><tr><td><input type="button" id="btnSaveAction" value="Save" class="btn btn-success" style="width:60px; margin-left: 30px;"></td><td></td><td></td><td></td></tr>');
        cfi.AutoComplete("PackageCondition", "RecuperationType,SNo", "IrregularityRecuperation", "RecuperationType", "RecuperationType", ["RecuperationType"], null, "contains");
    }
    else if (gridType == "UDLD") {
        if ($("#" + trID).find('select[id^=tblIrregularityTrans_Reason_]').val() == "0") {
            $("#divAction").html('<span id="spnTracing"><input id="hdnIrregularitySNo" name="hdnIrregularitySNo" type="hidden" value="' + IrregularitySNo + '"/><input id="hdnIrregularityTransSNo" name="hdnIrregularityTransSNo" type="hidden" value="' + IrregularityTransSNo + '"/><table id="tblAction" class="WebFormTable" style="background-color: #F5F5F5;"></table></span>');
            $("#tblAction").append('<tr><td><b style="padding-left: 26px;">Address:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none; width:95%;"></textarea></td></tr><tr><td><input type="button" id="btnSaveAction" value="Save" class="btn btn-success" style="width:60px; margin-left: 30px;"></td><td></td><td></td><td></td></tr>');
        }
        else if ($("#" + trID).find('select[id^=tblIrregularityTrans_Reason_]').val() == "1") {
            $("#divAction").html('<span id="spnTracing"><input id="hdnIrregularitySNo" name="hdnIrregularitySNo" type="hidden" value="' + IrregularitySNo + '"/><input id="hdnIrregularityTransSNo" name="hdnIrregularityTransSNo" type="hidden" value="' + IrregularityTransSNo + '"/><table id="tblAction" class="WebFormTable" style="background-color: #F5F5F5;"></table></span>');
            $("#tblAction").append('<tr><td><b style="padding-right: 5px;">Disposal Advice:</b><input name="DisposalAdvice" id="DisposalAdvice" type="hidden" value=""><input id="Text_DisposalAdvice" name="Text_DisposalAdvice" controltype="autocomplete" type="text" class="input-md form-control  tt-input" style="font-family: Verdana; font-size: 10px; width: 160px; height: 18px; position: relative; vertical-align: top; background-color: transparent;" autocorrect="off"></td></tr><tr><td><input type="button" id="btnSaveAction" value="Save" class="btn btn-success" style="width:60px; margin-left: 30px;"></td><td></td><td></td><td></td></tr>');
            var SearchDataSource = [{ Key: "1", Text: "Return shipment to Origin." }, { Key: "2", Text: "Destroy the Shipment." }, { Key: "3", Text: "Put up the Shipment for auction." }];//, { Key: "Transit", Text: "Transit" }
            cfi.AutoCompleteByDataSource("DisposalAdvice", SearchDataSource, ChangeLayOut, null);
        }


    }
    $.ajax({
        type: "GET",
        url: "Services/Irregularity/IrregularityService.svc/GetActionDetails?IrregularitySNo=" + IrregularitySNo + "&IrregularityTransSNo=" + IrregularityTransSNo,
        data: "json",
        success: function (response) {
            var ActionData = JSON.parse(response);
            if (ActionData.length > 0) {
                if ($("#hdnIncidentCategoryCode").val() == "PLCA" || $("#hdnIncidentCategoryCode").val() == "DMCA") {
                    if (ActionData[0].Action == 0) {
                        $("#Recuperate").attr('checked', 'true');
                    }
                    else {
                        $("#HoldShipment").attr('checked', 'true');
                        if (gridType == "DMCA") {
                            cfi.ResetAutoComplete($("#Text_PackageCondition")[0].id);
                            $("#Text_PackageCondition").data("kendoAutoComplete").enable(false);
                            $("#Text_PackageCondition").removeAttr('required');
                        }
                    }
                    if (ActionData[0].PackageCondition != "") {
                        $("#Text_PackageCondition").val(ActionData[0].PackageCondition);
                    }
                    $("#txtRemarks").val(ActionData[0].Remarks);
                    $("#btnSaveAction").val('Update');
                }
                else if ($("#hdnIncidentCategoryCode").val() == "UDLD") {

                    if (ActionData[0].DisposalAdvice != "") {
                        $("#btnSaveAction").val('Update');
                        $("#Text_DisposalAdvice").val(ActionData[0].DisposalAdvice);
                        $("#DisposalAdvice").val(ActionData[0].DisposalAdvice == "Return shipment to Origin." ? 1 : (ActionData[0].DisposalAdvice == "Destroy the Shipment." ? 2 : 3));
                        var tdLength = $("#tblAction tr:nth-child(1) td").length;
                        if ($("#DisposalAdvice").val() == 1) {
                            if (tdLength > 1) {
                                for (var i = 1; i < tdLength; i++) {
                                    var td = parseInt(2);
                                    $("#tblAction tr:nth-child(1) td:nth-child(" + td + ")").remove();
                                }
                            }
                            $("#tblAction tr:nth-child(1)").append('<td><b>Remarks:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td>');
                            $("#txtRemarks").val(ActionData[0].Remarks);
                        }
                        if ($("#DisposalAdvice").val() == 2) {
                            if (tdLength > 1) {
                                for (var i = 1; i < tdLength; i++) {
                                    var td = parseInt(2);
                                    $("#tblAction tr:nth-child(1) td:nth-child(" + td + ")").remove();
                                }
                            }
                            $("#tblAction tr:nth-child(1)").append('<td><b style="padding-right:5px;">Shipment Destruction Date:</b><span class="k-picker-wrap k-state-default k-widget k-datepicker k-header" style="width: 70px;"><input type="text" class="k-input k-state-default" name="DestructionDate" id="DestructionDate" style="width: 40%; color: rgb(0, 0, 0);" data-valid="required" data-valid-msg="Destruction Date can not be blank" tabindex="3" controltype="datetype" maxlength="15" value="" data-role="datepicker" sqldatevalue="2016-09-07" formattedvalue="07-Sep-2016"><span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-i-calendar">select</span></span></span></td><td><b>Remarks:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td>');
                            $("#DestructionDate").kendoDatePicker();
                            $("#DestructionDate").val();
                            $("#txtRemarks").val(ActionData[0].Remarks);
                        }
                        if ($("#DisposalAdvice").val() == 3) {
                            if (tdLength > 1) {
                                for (var i = 1; i < tdLength; i++) {
                                    var td = parseInt(2);
                                    $("#tblAction tr:nth-child(1) td:nth-child(" + td + ")").remove();
                                }
                            }
                            $("#tblAction tr:nth-child(1)").append('<td><b style="padding-right:5px;">Shipment Auction Date:</b><span class="k-picker-wrap k-state-default k-widget k-datepicker k-header" style="width: 70px;"><input type="text" class="k-input k-state-default" name="AuctionDate" id="AuctionDate" style="width: 40%; color: rgb(0, 0, 0);" data-valid="required" data-valid-msg="Destruction Date can not be blank" tabindex="3" controltype="datetype" maxlength="15" value="" data-role="datepicker" sqldatevalue="2016-09-07" formattedvalue="07-Sep-2016"><span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-i-calendar">select</span></span></span></td><td><b>Remarks:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td>');
                            $("#AuctionDate").kendoDatePicker();
                            $("#AuctionDate").val();
                            $("#txtRemarks").val(ActionData[0].Remarks);
                        }
                    }
                    else {
                        $("#txtRemarks").val(ActionData[0].Remarks);
                        $("#btnSaveAction").val('Update');
                    }
                }
            }
        }
    })
    //if ($("#txtRemarks").val() != "") {
    //    $("#btnSaveAction").val('Update')
    //}
    cfi.PopUp("divAction", "Action", 900, null, null, 100);
    if (gridType == "DMCA") {
        $("#HoldShipment").click(function () {
            cfi.ResetAutoComplete($("#Text_PackageCondition")[0].id);
            $("#Text_PackageCondition").data("kendoAutoComplete").enable(false);
            $("#Text_PackageCondition").removeAttr('required');
        });
        $("#Recuperate").click(function () {
            $("#Text_PackageCondition").data("kendoAutoComplete").enable(true);
            $("#Text_PackageCondition").attr("required", "required");
        });
    }
    $("#btnSaveAction").click(function () {
        if (gridType == "DMCA" || gridType == "PLCA") {
            if ($("input[type=radio][id=HoldShipment]:checked").val() == 1) {
                if ($("#txtRemarks").val() == "") {
                    alert('Fill the Remark Section')
                    return false;
                }
            }
            else {
                if ($("#txtRemarks").val() == "" || $("#Text_PackageCondition").val() == "") {
                    alert('Fill the Blank Section')
                    return false;
                }
            }
        }
        else if (gridType == "UDLD") {
            if ($('#messagedefault').val() == "") {
                alert('First select Disposal Advice')
                return;
            }
            if ($("#txtRemarks").val() == "") {
                alert('Fill the Remark Section')
                return;
            }
        }
        SaveAction(IrregularitySNo, IrregularityTransSNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID);
    })
}

function ChangeLayOut(valueId, value, keyId, key) {
    var tdLength = $("#tblAction tr:nth-child(1) td").length;
    if (key == "1") {
        if (tdLength > 1) {
            for (var i = 1; i < tdLength; i++) {
                var td = parseInt(2);
                $("#tblAction tr:nth-child(1) td:nth-child(" + td + ")").remove();
            }
        }
        $("#tblAction tr:nth-child(1)").append('<td><b>Remarks:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td>');
    }
    else if (key == "2") {
        if (tdLength > 1) {
            for (var i = 1; i < tdLength; i++) {
                var td = parseInt(2);
                $("#tblAction tr:nth-child(1) td:nth-child(" + td + ")").remove();
            }
        }
        $("#tblAction tr:nth-child(1)").append('<td><b style="padding-right:5px;">Shipment Destruction Date:</b><span class="k-picker-wrap k-state-default k-widget k-datepicker k-header" style="width: 70px;"><input type="text" class="k-input k-state-default" name="DestructionDate" id="DestructionDate" style="width: 40%; color: rgb(0, 0, 0);" data-valid="required" data-valid-msg="Destruction Date can not be blank" tabindex="3" controltype="datetype" maxlength="15" value="" data-role="datepicker" sqldatevalue="2016-09-07" formattedvalue="07-Sep-2016"><span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-i-calendar">select</span></span></span></td><td><b>Remarks:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td>');
        $("#DestructionDate").kendoDatePicker();
        //<td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td>
    }
    else if (key == "3") {
        if (tdLength > 1) {
            for (var i = 1; i < tdLength; i++) {
                var td = parseInt(2);
                $("#tblAction tr:nth-child(1) td:nth-child(" + td + ")").remove();
            }
        }
        $("#tblAction tr:nth-child(1)").append('<td><b style="padding-right:5px;">Shipment Auction Date:</b><span class="k-picker-wrap k-state-default k-widget k-datepicker k-header" style="width: 70px;"><input type="text" class="k-input k-state-default" name="AuctionDate" id="AuctionDate" style="width: 40%; color: rgb(0, 0, 0);" data-valid="required" data-valid-msg="Destruction Date can not be blank" tabindex="3" controltype="datetype" maxlength="15" value="" data-role="datepicker" sqldatevalue="2016-09-07" formattedvalue="07-Sep-2016"><span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-i-calendar">select</span></span></span></td><td><b>Remarks:</b></td><td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td>');
        $("#AuctionDate").kendoDatePicker();
        //<td colspan="2"><textarea rows="2" cols="30" id="txtRemarks" style="resize:none;"></textarea></td>
    }
}

function CheckAWBInOFLD(IrregularitySNo, IrregularityTransSNo, BttnID, BttnValue, hdnBttnValue) {
    $.ajax({
        type: "GET",
        url: "Services/Irregularity/IrregularityService.svc/CheckAWBInOFLD?IrregularitySNo=" + IrregularitySNo + "&IrregularityTransSNo=" + IrregularityTransSNo,
        dataType: "json",
        success: function (response) {
            var Message = JSON.parse(response);
            if (Message[0].Message) {
                ShowMessage('info', 'Irregularity Status', Message[0].Message);
                $('#' + BttnID).val(BttnValue);
                $('#tblIrregularityTrans_Hdn' + BttnID.split('_')[1] + '_' + BttnID.split('_')[2]).val(hdnBttnValue);
            }
            else {
                var trID = $("#" + BttnID + "").closest('tr').attr('id');
                var PiecesID = $("#" + trID + "").find('input[id^=tblIrregularityTrans_Pieces_]').attr('id');
                $('#' + PiecesID).attr('disabled', true);
            }
        }
    });
}

function HideFlightDtl(valueId, value, keyId, key) {
    if (key != "") {
        //$("#FlightDate").closest("tr").find("td:gt(1)").css("display", "");
        //$("#FlightDate").closest("tr").css("display", "");
        //$('#FlightDate').val('');
        $('#FlightNo').val('');
        $('#Text_FlightNo').val('');
        $("#FlightDate").closest("tr").css("display", "");
        if ($('#IncidentCategory').val() == 'FDCA' || $('#IncidentCategory').val() == 'MSMB' || $('#IncidentCategory').val() == 'FDMB' || $('#IncidentCategory').val() == 'MSAV' || $('#IncidentCategory').val() == 'FDAV') {
            GetAWBDetail(1, 1, 1, $('#AWBNo').val());
            $('#FlightDate').removeAttr('required');
            $('#Text_FlightNo').removeAttr('required');
            $('#FlightDate').removeAttr('data-valid');
            $('#Text_FlightNo').removeAttr('data-valid');
            $('#spnFlightDate').closest('td').find('font').text('');
            $('#spnFlightNo').closest('td').find('font').text('');
        }
        if ($('#IncidentCategory').val() == 'DMCA') {
            if ($("input[name^=Type]:checked").val() == 0) {
                GetAWBDetail(1, 1, 1, $('#AWBNo').val());
                $('#FlightDate').removeAttr('required');
                $('#Text_FlightNo').removeAttr('required');
                $('#FlightDate').removeAttr('data-valid');
                $('#Text_FlightNo').removeAttr('data-valid');
                $('#spnFlightDate').closest('td').find('font').text('');
                $('#spnFlightNo').closest('td').find('font').text('');
            }
        }
    }
}

function StatusValue(ID) {
    $('#' + ID.id).val('');
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
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
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

function SaveActionNew(IrregularitySNo) {
    var SaveData = [];
    var Data = {
        ActionCode: $('#ActionCode').val(),
        Text_ActionCode: $('#Text_ActionCode').val(),
        Date: $('#Date').attr('sqldatevalue'),
        Remarks: $('#Remarks').val(),
        Amount: ($('#Amount').val() ? $('#Amount').val() : 0),
        IrregularitySNo: IrregularitySNo
    }
    SaveData.push(Data)

    $.ajax({
        url: "Services/Irregularity/IrregularityService.svc/SaveActionNew",
        async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify(SaveData),
        success: function (response) {
            if (response == "0") {
                ShowMessage('success', 'Success!', "Action Saved Successfully");
                $('#ActionCode').val('');
                $('#Text_ActionCode').val('');
                $('#Remarks').val('');
                $('#Amount').val('');
                $('#_tempAmount').val('');
                GetActionHistory(IrregularitySNo);
            } else {
                ShowMessage('info', 'Action!', response, "bottom-right");
            }
        }
    });
}

function GetActionHistory(IrregularitySNo) {
    $.ajax({
        type: "GET",
        url: "./Services/Irregularity/IrregularityService.svc/GetActionHistory/" + IrregularitySNo,
        dataType: "html",
        success: function (response) {
            var strVar = "<\/br>";
            var AWBDatas = jQuery.parseJSON(response);
            var AWBData = JSON.parse(AWBDatas).Table0;
            var columnNo = 0;
            for (var j in AWBData[0]) {
                columnNo = columnNo + 1;
            }
            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" height=20px; align=\"left\" colspan=\"" + columnNo + "\">Action History<\/td><\/tr>";
            for (var j in AWBData[0]) {
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
            }
            strVar += "<\/tr>";

            for (var i in AWBData) {
                strVar += "<tr>";
                for (var j in AWBData[i]) {
                    strVar += "<td class=\"ui-widget-content\">" + AWBData[i][j] + "<\/td>";
                }
                strVar += "<\/tr>";
            }
            strVar += "<\/tbody>";
            strVar += "<\/table>";
            strVar += "<\/br>";
            $('#tblActionHistory').html(strVar);
        }
    });
}

function GetAwbNoForAction(IrregularitySNo) {
    $.ajax({
        type: "GET",
        url: "./Services/Irregularity/IrregularityService.svc/GetAwbNoForAction/" + IrregularitySNo,
        dataType: "html",
        success: function (response) {
            var AWBDatas = jQuery.parseJSON(response);
            var AWBData = JSON.parse(AWBDatas).Table0
            $('#AWBNo').val(AWBData[0].AWBSNo);
            $('#Text_AWBNo').val(AWBData[0].AWBNo);
            if (AWBData[0].Mail == 'Y') {
                $('span[id="spnAWBNo"]').text('CN No.');
            }
        }
    });
}

function SaveAction(IrregularitySNo, IrregularityTransSNo, gridType, AWBNo, Type, CityCode, CitySNo, UserSNo, Pieces, trID) {
    if (gridType == "DMCA" || gridType == "PLCA") {
        $.ajax({
            type: "POST",
            url: "Services/Irregularity/IrregularityService.svc/SaveAction?IrregularitySNo=" + IrregularitySNo + "&IrregularityTransSNo=" + IrregularityTransSNo + "&Action=" + ($("input[type=radio][id=HoldShipment]:checked").val() == 1 ? 1 : 0) + "&PackageCondition=" + (gridType == "DMCA" ? $("#Text_PackageCondition").val() : null) + "&Remarks=" + $("#txtRemarks").val() + "&AWBNo=" + AWBNo + "&Type=" + Type + "&CityCode=" + CityCode + "&CitySNo=" + CitySNo + "&UserSNo=" + UserSNo + "&Pieces=" + Pieces,
            data: "json",
            success: function (response) {

            }
        })
    } else if (gridType == "UDLD") {
        //$("#" + trID).find('select[id^=tblIrregularityTrans_Reason_]').val() == "0"
        $.ajax({
            type: "POST",
            url: "Services/Irregularity/IrregularityService.svc/SaveUDLDAction?IrregularitySNo=" + IrregularitySNo + "&IrregularityTransSNo=" + IrregularityTransSNo + "&DisposalAdvice=" + ($("#" + trID).find('select[id^=tblIrregularityTrans_Reason_]').val() == "1" ? $("#Text_DisposalAdvice").val() : '') + "&DestructionDate=" + ($("#DisposalAdvice").val() == "2" ? $("#DestructionDate").val() : "0") + "&AuctionDate=" + ($("#DisposalAdvice").val() == "3" ? $("#AuctionDate").val() : "0") + "&Remarks=" + $("#txtRemarks").val() + "&AWBNo=" + AWBNo + "&Type=" + Type + "&CityCode=" + CityCode + "&CitySNo=" + CitySNo + "&UserSNo=" + UserSNo + "&Pieces=" + Pieces,
            data: "json",
            success: function (response) {

            }
        })
    }
    $("#divAction").data("kendoWindow").close();
}
//check DirtyFields Inside the Page
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};


