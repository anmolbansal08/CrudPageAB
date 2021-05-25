function BindLocation() {
    var dbtableName = "LOCATION";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        servicePath: './Services/Import/DeliveryOrderService.svc',
        getRecordServiceMethod: "BindLocation",
        masterTableSNo: (currentArrivedShipmentSNo + '.' + currentawbsno),
        caption: "Location",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 { name: 'AWBNo', display: 'AWB No', type: 'label' },
                 { name: 'HAWBNo', display: 'HAWB No', type: 'label' },
                 { name: 'Received', display: 'Received', type: 'label' },
                 { name: 'Location', display: 'Location', type: 'label' },
                 { name: 'MovableLocation', display: 'Movable Location', type: 'label' },
                 { name: 'StartPieces', display: 'Start Pieces', type: 'label' },
                 { name: 'EndPieces', display: 'End Pieces', type: 'label' },
                 { name: 'Weight', display: 'Weight', type: 'label' }
        ],


        afterRowAppended: function (tbWhole, parentIndex, addedRows) {

            if (userContext.SpecialRights.MOVIMPORT == false) {



                $("table[id$='tblLOCATION']").find("[id^='tblLOCATION_Row_']").each(function (row, tr) {
                    $(tr).find("input[id^=tblLOCATION_MovableLocation_]").hide();
                   
                    $(tr).find("input[id^=tblLOCATION_MovableLocation_]").closest("td").hide();
                   
                    $("table[id$='tblLOCATION']").find('tr').find('td:nth-child(6)').hide()


                });



            }

        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, removeLast: true, append: true, remove: true }



    });


 

    if (userContext.SpecialRights.MOVIMPORT == false) {


        $("table[id$='tblLOCATION']").find('tr').find('td:nth-child(6)').hide()
       



    }









}

/********** FAA ****************/
function BindFAASection() {
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/BindFAASection?AWBSNo=" + awbSNo + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo,
        async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var today = new Date();
            var todayDate = today.toLocaleString();
            var fblData = jQuery.parseJSON(result);
            var resData = fblData.Table0;
            if (resData.length > 0) {
                var resItem = resData[0];
                $("span[id='FAA_CONSIGNEE_AccountNoName']").text(resItem.CustomerName);
                $("span[id='FAA_CONSIGNEE_Street']").text(resItem.Street);
                $("span[id='FAA_CONSIGNEE_TownLocation']").text(resItem.Location);
                $("span[id='FAA_CONSIGNEE_State']").text(resItem.State);
                $("span[id='FAA_CONSIGNEE_PostalCode']").text(resItem.PostalCode);
                $("span[id='FAA_CONSIGNEE_MobileNo']").text(resItem.Phone);
                $("span[id='FAA_CONSIGNEE_Email']").text(resItem.Email);
                $("span[id='FAA_CONSIGNEE_CountryCode']").text(resItem.CountryCode);
                $("span[id='FAA_CONSIGNEE_City']").text(resItem.CityCode);
                $("span[id='FAA_CONSIGNEE_Fax']").text(resItem.Fax);
                $("span[id='FAA_CONSIGNEE_FlightNo']").text(resItem.FlightNo);
                $("span[id='FAA_CONSIGNEE_ArrivalDate']").text(resItem.ArrivalDate);
                var totalpieces = 0;
                var table = document.getElementById("tblFAAChargeDescription");
                if (table != null && table.rows.length > 3) {
                    for (var i = 3; i < table.rows.length; i++) {
                        var rowno = i - 2;
                        totalpieces += parseFloat(document.getElementById("tblFAAChargeDescription_Amount_" + rowno).innerHTML);
                    }
                }
                $("span[id='TotalAmount']").text(totalpieces);
            }
        },
        error: {
        }
    });
}

function BindFAASectionChargeDescription() {
    var dbtableName = "FAAChargeDescription";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 500, whereCondition: null, sort: "",
        servicePath: './Services/Import/DeliveryOrderService.svc',
        getRecordServiceMethod: "BindFAASectionChargeDescription",
        masterTableSNo: currentArrivedShipmentSNo,
        caption: "Charge Description",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 { name: 'TariffSNo', type: 'hidden', value: 0 },
                 { name: 'ChargeDescription', display: 'Charge Description', type: 'label' },
                 { name: 'ChargeCode', display: 'Charge Code', type: 'label' },
                 { name: 'Amount', display: 'Amount In  ' + userContext.CurrencyCode + '', type: 'label' }
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, removeLast: true, append: true, remove: true }
    });
}

function BindFAASectionAWBInformation() {
    var dbtableName = "FAA";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Import/DeliveryOrderService.svc',
        getRecordServiceMethod: "BindFAASectionAWBInformation",
        masterTableSNo: currentArrivedShipmentSNo,
        caption: "AWB Information",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 { name: 'AWBNo', display: 'AWB No', type: 'label' },
                 { name: 'Origin', display: 'Origin', type: 'label' },
                 { name: 'Pcs', display: 'Pcs', type: 'label' },
                 { name: 'Weight', display: 'Weight', type: 'label' },
                 { name: 'CCPP', display: 'CC/PP', type: 'label' },
                 { name: 'CargoType', display: 'Cargo Type', type: 'label' },
                 { name: 'Contents', display: 'Contents', type: 'label' }
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, removeLast: true, append: true, remove: true }
    });
}

function BindFAASectionEmailHistory() {
    var dbtableName = "FAAEmailHistory";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 500, whereCondition: null, sort: "",
        servicePath: './Services/Import/DeliveryOrderService.svc',
        getRecordServiceMethod: "BindFAASectionEmailHistory",
        masterTableSNo: currentArrivedShipmentSNo,
        caption: "Email sent History",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 { name: 'AWBNo', display: 'AWB No', type: 'label' },
                 { name: 'Origin', display: 'Origin', type: 'label' },
                 { name: 'Pcs', display: 'Pcs', type: 'label' },
                 { name: 'Weight', display: 'Weight', type: 'label' },
                 { name: 'CCPP', display: 'CC/PP', type: 'label' },
                 { name: 'CargoType', display: 'Cargo Type', type: 'label' },
                 { name: 'Contents', display: 'Contents', type: 'label' },
                 { name: 'EmailSentdatetime', display: 'Sent date/time', type: 'label' },
                 { name: 'EmailSentBy', display: 'Sent by user Id', type: 'label' },
                 { name: 'EmailSentTo', display: 'Sent to', type: 'label' },
                 { name: 'Remarks', display: 'Remarks', type: 'label' },
                 { name: 'FAX', display: 'FAX', type: 'label' }
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, removeLast: true, append: true, remove: true }
    });
}

function BindFAASectionSMSHistory() {
    var dbtableName = "FAASMSHistory";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 500, whereCondition: null, sort: "",
        servicePath: './Services/Import/DeliveryOrderService.svc',
        getRecordServiceMethod: "BindFAASectionSMSHistory",
        masterTableSNo: currentArrivedShipmentSNo,
        caption: "SMS sent History",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'MobileNo', display: 'Mobile No', type: 'label' },
                 { name: 'SMSCotent', display: 'SMS Content', type: 'label' },
                 { name: 'SendAt', display: 'Sent Date & Time', type: 'label' },
                 { name: 'Status', display: 'Status', type: 'label' }
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, removeLast: true, append: true, remove: true }
    });
}

function PrintFAA() {
    //window.open("HtmlFiles/FreightArrivalNotification/Notificationofarrival.html?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo);
    window.open("HtmlFiles/FreightArrivalNotification/Notificationofarrival.html?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    
}

function SaveFAAinfo() {
    var flag = false;
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    var ArrivedShipmentSNo = (currentArrivedShipmentSNo == "" ? 0 : currentArrivedShipmentSNo);
    var DeliveryOrderFee = "0.000";
    var DeliveryHandlingCharge = "0.000";
    var SitaEmailAddress = $("#FAA_CONSIGNEE_Email").closest('td').find('span').text() + (($("#FAA_CONSIGNEE_Email").closest('td').find('span').text() != "" && $("#Email_SITA").val() != "") ? ',' : "") + $("#Email_SITA").val();
    var Remarks = $("#Remarks").val();
    var FAX = $("#FAX").val();
    var ConsigneeContact = $("#FAA_CONSIGNEE_Contact").val();
    if ($("#FAA_CONSIGNEE_Email").closest('td').find('span').text() != "" || $("#Email_SITA").val() != "") {
        if (($("#Email_SITA").val() != "" && $("#Remarks").val() != "") || $("#Email_SITA").val() == "" && $("#Remarks").val() == "") {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/SaveFAA", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ AWBSNo: awbSNo, ArrivedShipmentSNo: ArrivedShipmentSNo, DeliveryOrderFee: DeliveryOrderFee, DeliveryHandlingCharge: DeliveryHandlingCharge, SitaEmailAddress: SitaEmailAddress, Remarks: Remarks, FAX: FAX, ConsigneeContact: ConsigneeContact }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success - NFD', "AWB No. [" + CurrentAWBNo + "] -  Saved Successfully", "bottom-right");
                        BindFAASectionEmailHistory();
                        BindFAASectionSMSHistory();
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - NFD', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                        flag = false;
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - FAA', "AWB No. [" + awb$("#AWBNo").val() + "] -  unable to process.", "bottom-right");
                }
            });
        }
        else {
            ShowMessage('warning', 'Warning - NFD', "Remarks can't be Blank");
            flag = false;
        }
    }
    else {
        ShowMessage('warning', 'Warning - NFD', "Provide the Email Address");
        flag = false;
    }
    return flag;
}

/***************** FHL ****************/


function BindFHLSection() {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/BindFHLSectionTable",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AWBSNO: currentawbsno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var theDiv = document.getElementById("divDetail");
            theDiv.innerHTML = "";
            var table = "<table class='appendGrid ui-widget' id='tblFHLSection'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>AWB No</td><td class='ui-widget-header'>No of House</td><td class='ui-widget-header'>Origin City</td><td class='ui-widget-header'>Destination City</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Remaining Pieces</td><td class='ui-widget-header'>Gross weight</td><td class='ui-widget-header'>Volume weight</td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'><tr id='tblFHLSection_Row_1'>";
            var FHLtable = "";
            var hdntblFHLPieces = 0;
            var hdntblFHLGrWt = 0;
            var hdntblFHLVolWt = 0;
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    table += "<td class='ui-widget-content first'>" + myData.Table0[0].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[0].NoOfHouse + "<input type='hidden' id='hdnNoOfHouse' value=" + myData.Table0[0].NoOfHouse + " /></td><td class='ui-widget-content first'>" + myData.Table0[0].Origin + "</td><td class='ui-widget-content first'>" + myData.Table0[0].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[0].TotalPieces + "<input type='hidden' id='hdnTotalPieces' value=" + myData.Table0[0].TotalPieces + " /></td><td class='ui-widget-content first'>" + myData.Table0[0].RemainingPieces + "<input type='hidden' id='hdnRemainingPieces' value=" + myData.Table0[0].RemainingPieces + " /></td><td class='ui-widget-content first'>" + myData.Table0[0].TotalGrossWeight + "<input type='hidden' id='hdnTotalGrossWeight' value=" + myData.Table0[0].TotalGrossWeight + " /></td><td class='ui-widget-content first'>" + myData.Table0[0].TotalVolumeWeight + "<input type='hidden' id='hdnTotalVolumeWeight' value=" + myData.Table0[0].TotalVolumeWeight + " /><input type='hidden' id='hdnRemainingGrWt' value=" + myData.Table0[0].RemainingGrossWeight + " /><input type='hidden' id='hdnRemainingVolWt' value=" + myData.Table0[0].RemainingVolumeWeight + " /></td>";

                    if (myData.Table0[0].NoOfHouse > 0 && myData.Table1.length < myData.Table0[0].NoOfHouse) {
                        table += "<td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Submit' type='button' id='btnSubmit' value=" + myData.Table0[0].AWBNo + " tabindex='67' class='btn btn-success' style='width:60px;' onclick='AddFHL();'><span class='ui-button-text'>Add</span></button></td>";
                    }
                    else
                        table += "<td class='ui-widget-content first'></td>";

                    if (myData.Table0[0].NoOfHouse > 0 && myData.Table1.length === (myData.Table0[0].NoOfHouse - 1)) {
                        $("#FHL_HAWB_Pieces").val(myData.Table0[0].RemainingPieces);
                        $("#_tempFHL_HAWB_Pieces").val(myData.Table0[0].RemainingPieces);
                        $("#FHL_HAWB_GrossWeight").val(myData.Table0[0].RemainingGrossWeight);
                        $("#_tempFHL_HAWB_GrossWeight").val(myData.Table0[0].RemainingGrossWeight);
                        $("#FHL_HAWB_VolumeWeight").val(myData.Table0[0].RemainingVolumeWeight);
                        $("#_tempFHL_HAWB_VolumeWeight").val(myData.Table0[0].RemainingVolumeWeight);
                        $("#FHL_HAWB_ChargeableWeight").val(myData.Table0[0].RemainingGrossWeight > myData.Table0[0].RemainingVolumeWeight ? myData.Table0[0].RemainingGrossWeight : myData.Table0[0].RemainingVolumeWeight);
                        $("#_tempFHL_HAWB_ChargeableWeight").val(myData.Table0[0].RemainingGrossWeight > myData.Table0[0].RemainingVolumeWeight ? myData.Table0[0].RemainingGrossWeight : myData.Table0[0].RemainingVolumeWeight);
                    
                    }
                    table += "</tr></tbody></table>";

                    if (myData.Table1.length > 0) {
                        FHLtable = "</BR><table class='appendGrid ui-widget' id='tblFHL'><thead class='ui-widget-header' style='text-align:center'><tr><td colspan='12' class='ui-widget-header'>HAWB Information</td></tr><tr><td class='ui-widget-header'>HAWB No</td><td class='ui-widget-header'>Origin City</td><td class='ui-widget-header'>Destination City</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gross weight</td><td class='ui-widget-header'>Volume weight</td><td class='ui-widget-header'>Consignee Name</td><td class='ui-widget-header'>SHC</td><td class='ui-widget-header'>Freight Type</td><td class='ui-widget-header'>Nature of Goods</td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'>";
                        for (var i = 0; i < myData.Table1.length; i++) {

                            FHLtable += "<tr><td class='ui-widget-content first'>" + myData.Table1[i].HAWBNo + "</td><td class='ui-widget-content first'>" + myData.Table1[i].Origin + "</td><td class='ui-widget-content first'>" + myData.Table1[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table1[i].TotalPieces + "</td><td class='ui-widget-content first'>" + myData.Table1[i].TotalGrossWeight + "</td><td class='ui-widget-content first'>" + myData.Table1[i].TotalVolumeWeight + "</td><td class='ui-widget-content first'>" + myData.Table1[i].CustomerName.toUpperCase() + "</td><td class='ui-widget-content first'>" + myData.Table1[i].SPHC.toUpperCase() + "</td><td class='ui-widget-content first'>" + myData.Table1[i].FreightType + "</td><td class='ui-widget-content first'>" + myData.Table1[i].NatureOfGoods.toUpperCase() + "</td>"

                            if (IsDOCreated == "1" && IsDOCreated != "undefined") {
                                FHLtable += "<td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Submit' type='button' id='btnUpdateFHLGrid' value=" + myData.Table1[i].SNo + " tabindex='68' class='btn btn-success' style='width:50px;' disabled><span class='ui-button-text'>Edit</span></button>";
                            }
                            else {
                                FHLtable += "<td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Submit' type='button' id='btnUpdateFHLGrid' value=" + myData.Table1[i].SNo + " tabindex='68' class='btn btn-success' style='width:50px;' onclick='UpdateFHL(" + myData.Table1[i].SNo + ");'><span class='ui-button-text'>Edit</span></button>";
                            }
                            FHLtable += "<button aria-disabled='false' role='button' title='Submit' type='button' id='btnViewFHLGrid' value=" + myData.Table1[i].SNo + " tabindex='69' class='btn btn-success' style='width:50px;' onclick='ViewFHL(" + myData.Table1[i].SNo + ");'><span class='ui-button-text'>View</span></button>";
                            if (IsDOCreated == "1" && IsDOCreated != "undefined") {

                                FHLtable += "<button aria-disabled='true' role='button' title='Submit' type='button' id='btnDeleteFHLGrid' value=" + myData.Table1[i].SNo + " tabindex='70' class='btn btn-danger' style='width:50px;' disabled><span class='ui-button-text'>Delete</span></button></td></tr>";
                            }
                            else {
                                FHLtable += "<button aria-disabled='false' role='button' title='Submit' type='button' id='btnDeleteFHLGrid' value=" + myData.Table1[i].SNo + " tabindex='70' class='btn btn-danger' style='width:50px;' onclick='DeleteFHL(" + myData.Table1[i].SNo + ");'><span class='ui-button-text'>Delete</span></button></td></tr>";

                            }
                            hdntblFHLPieces = parseInt(hdntblFHLPieces) + parseInt(myData.Table1[i].TotalPieces);
                            hdntblFHLGrWt = Number(hdntblFHLGrWt) + Number(myData.Table1[i].TotalGrossWeight);
                            hdntblFHLVolWt = Number(hdntblFHLVolWt) + Number(myData.Table1[i].TotalVolumeWeight);
                        }
                        FHLtable += "<input type='hidden' id='hdntblFHLPieces' value=" + hdntblFHLPieces + " /><input type='hidden' id='hdntblCount' value=" + myData.Table1.length + " /><input type='hidden' id='hdntblrowFHLPieces' value='' /><input type='hidden' id='hdntblrowFHLIsEdi' value='' /><input type='hidden' id='hdntblFHLGrWt' value=" + hdntblFHLGrWt + " /><input type='hidden' id='hdntblFHLVolWt' value=" + hdntblFHLVolWt + " /><input type='hidden' id='hdntblrowFHLGrWt' value='' /><input type='hidden' id='hdntblrowFHLHawbNo' value='' /><input type='hidden' id='hdntblrowFHLVolWt' value='' /></tbody></table>";
                    }
                    theDiv.innerHTML += table + FHLtable;
                }
                else {
                    var table = "<table class='appendGrid ui-widget' id='tblFHLSection'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                    theDiv.innerHTML += table;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function DeleteFHL(SNo) {
    if (confirm('Are you sure want to Delete this record ?')) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/DeleteFHL",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ HAWBSNo: SNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - HAWB', "HAWB Deleted Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                    flag = false;
                }
            }
        });
        BindFHLSection();
        $('#divDetail1').html('')
    }
}

function ViewFHL(SNo) {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/FHL/New/1",
        async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail1").html(result);
            cfi.AutoComplete("FHL_HAWB_Origin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Destination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_SPHC", "CODE", "SPHC", "SNO", "CODE@", ["CODE", "Description"], null, "contains", ",");
            cfi.AutoComplete("FHL_HAWB_AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");

            cfi.AutoComplete("FHL_HAWB_SHI_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

            cfi.AutoComplete("FHL_HAWB_CD_Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_Valuation", WeightValuation);
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_OtherCharge", WeightValuation);

            cfi.AutoComplete("FHL_OCI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
            cfi.AutoComplete("FHL_OCI_InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
            cfi.AutoComplete("FHL_OCI_CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

            $("input[id='FHL_HAWB_Pieces']").unbind("blur").bind("blur", function () {
                validatePcsFHL();
            });

            $("#FHL_HAWB_ChargeableWeight").unbind("blur").bind("blur", function () {
            });

            $("#FHL_HAWB_GrossWeight").unbind("blur").bind("blur", function () {
                validateGrWtFHL();
            });

            $("#FHL_HAWB_VolumeWeight").unbind("blur").bind("blur", function () {
                validateVolWtFHL();
            });
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        }
    });

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/BindHAWBSectionData",
        async: false, type: "get", dataType: "json", cache: false,
        data: { HAWBSNo: SNo },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var MainData = Data.Table0;
            var ocitransInfo = Data.Table1;
            var shipperData = Data.Table2;
            var consigneeData = Data.Table3;
            var harmonizedCommodity = Data.Table7;
            var textDescription = Data.Table8;
            if (MainData.length > 0) {
                $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").setDefaultValue(MainData[0].OriginAirportSNo, MainData[0].OriginCityName);
                $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").setDefaultValue(MainData[0].DestinationAirportSNo, MainData[0].DestinationCityName);
                $("#FHL_HAWB_HAWBNo").val(MainData[0].HAWBNo);
                $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").setDefaultValue(MainData[0].CommoditySNo, MainData[0].CommodityCode + '-' + MainData[0].CommodityDescription);
                $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").setDefaultValue(MainData[0].AWBCurrencySNo, MainData[0].Currency);

                if (MainData[0].SPHCSNo.length > 0) {
                    if (MainData[0].SPHCSNo != "0" && MainData[0].SPHC != "") {
                        cfi.BindMultiValue("FHL_HAWB_SPHC", MainData[0].SPHC, MainData[0].SPHCSNo)
                        $("#FHL_HAWB_SPHC").val(MainData[0].SPHCSNo);
                    }
                }
                $("#FHL_HAWB_SPHC").closest("td").find("div").css("overflow-x", "scroll").css("width", "200");
                $("#FHL_HAWB_Pieces").val(MainData[0].TotalPieces);
                $("#_tempFHL_HAWB_Pieces").val(MainData[0].TotalPieces);
                $("#FHL_HAWB_GrossWeight").val(MainData[0].TotalGrossWeight);
                $("#_tempFHL_HAWB_GrossWeight").val(MainData[0].TotalGrossWeight);
                $("#FHL_HAWB_VolumeWeight").val(MainData[0].TotalVolumeWeight);
                $("#_tempFHL_HAWB_VolumeWeight").val(MainData[0].TotalVolumeWeight);
                $("#FHL_HAWB_ChargeableWeight").val(MainData[0].TotalChargeableWeight);
                $("#_tempFHL_HAWB_ChargeableWeight").val(MainData[0].TotalChargeableWeight);
                $("#FHL_HAWB_NatureofGoods").val(MainData[0].NatureOfGoods);
                $("#FHL_HAWB_DescriptionofGoods").val(MainData[0].DescriptionOfGoods);
                $("#FHL_HAWB_HarmonisedCommodityCode").val(MainData[0].HarmonisedCommodityCode);

                if (MainData[0].IsFreightPrepaid == "False") {
                    $('input:radio[name=FHL_HAWB_FreightType]')[1].checked = true;
                }
                else {
                    $('input:radio[name=FHL_HAWB_FreightType]')[0].checked = true;
                }

                $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDCurrencyCode, MainData[0].CVDCurrencyCode);
                $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDWeightValuation, MainData[0].CVDWeightValuationtxt);
                $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDOtherCharges, MainData[0].CVDOtherChargesTxt);
                $("#FHL_HAWB_CD_DecCarriageVal").val(MainData[0].CVDDeclareCarriageValue);
                $("#_tempFHL_HAWB_CD_DecCarriageVal").val(MainData[0].CVDDeclareCarriageValue);
                $("#FHL_HAWB_CD_DecCustomsVal").val(MainData[0].CVDDeclareCustomValue);
                $("#_tempFHL_HAWB_CD_DecCustomsVal").val(MainData[0].CVDDeclareCustomValue);
                $("#FHL_HAWB_CD_Insurance").val(MainData[0].CVDDeclareInsurenceValue);
                $("#_tempFHL_HAWB_CD_Insurance").val(MainData[0].CVDDeclareInsurenceValue);
                $("#FHL_HAWB_CD_ValuationCharge").val(MainData[0].CVDValuationCharge);
                $("#_tempFHL_HAWB_CD_ValuationCharge").val(MainData[0].CVDValuationCharge);

                cfi.makeTrans("import_fhlshipmentocitrans", null, null, BindFHLCountryCodeAutoComplete, ReBindFHLCountryCodeAutoComplete, null, ocitransInfo);
                cfi.makeTrans("import_hawbharmonisedcommoditytrans", null, null, BindHarmonizedCommodity, REBindHarmonizedCommodity, null, harmonizedCommodity);
                InstantiateControl("divareaTrans_import_hawbharmonisedcommoditytrans")
                cfi.makeTrans("import_hawbdescription", null, null, null, null, null, textDescription);
                InstantiateControl("divareaTrans_import_hawbdescription")
                if (shipperData.length > 0) {
                    $("[id^='FHL_HAWB_SHI_Shipper']").prop("checked", shipperData[0].IsShipper == 0 ? false : true);
                    $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                    if (shipperData[0].ShipperAccountNo != "") {
                        $("#Text_FHL_HAWB_SHI_AccountNo").prop('disabled', true);
                        $("#chkFHL_HAWB_SHI_AccountNo").closest('td').hide();
                    }

                    $("#FHL_HAWB_SHI_Name").val(shipperData[0].ShipperName);
                    $("#FHL_HAWB_SHI_Street").val(shipperData[0].ShipperStreet);
                    $("#FHL_HAWB_SHI_TownLocation").val(shipperData[0].ShipperLocation);
                    $("#FHL_HAWB_SHI_State").val(shipperData[0].ShipperState);
                    $("#FHL_HAWB_SHI_PostalCode").val(shipperData[0].ShipperPostalCode);
                    $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                    $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                    $("#FHL_HAWB_SHI_MobileNo").val(shipperData[0].ShipperMobile);
                    $("#_tempFHL_HAWB_SHI_MobileNo").val(shipperData[0].ShipperMobile);
                    $("#FHL_HAWB_SHI_Email").val(shipperData[0].ShipperEMail);
                    $("#FHL_HAWB_SHI_Fax").val(shipperData[0].Fax);
                    $("#_tempFHL_HAWB_SHI_Fax").val(shipperData[0].Fax);
                }

                if (consigneeData.length > 0) {
                    $("[id^='FHL_HAWB_SHI_Consignee']").prop("checked", consigneeData[0].IsConsignee == 0 ? false : true);
                    $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                    if (consigneeData[0].ConsigneeAccountNo != "") {
                        $("#Text_FHL_HAWB_CON_AccountNo").prop('disabled', true);
                        $("#chkFHL_HAWB_CON_AccountNo").closest('td').hide();
                    }

                    $("#FHL_HAWB_CON_AccountNoName").val(consigneeData[0].ConsigneeName);
                    $("#FHL_HAWB_CON_Street").val(consigneeData[0].ConsigneeStreet);
                    $("#FHL_HAWB_CON_TownLocation").val(consigneeData[0].ConsigneeLocation);
                    $("#FHL_HAWB_CON_State").val(consigneeData[0].ConsigneeState);
                    $("#FHL_HAWB_CON_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                    $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                    $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                    $("#FHL_HAWB_CON_MobileNo").val(consigneeData[0].ConsigneeMobile);
                    $("#_tempFHL_HAWB_CON_MobileNo").val(consigneeData[0].ConsigneeMobile);
                    $("#FHL_HAWB_CON_Email").val(consigneeData[0].ConsigneeEMail);
                    $("#FHL_HAWB_CON_Fax").val(consigneeData[0].Fax);
                    $("#_tempFHL_HAWB_CON_Fax").val(consigneeData[0].Fax);
                }
                $("#btnSave").css("display", "none");
                $("#btnUpdate").css("display", "none");
            }

            $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_SPHC").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").enable(false);
            $("#FHL_HAWB_Pieces").attr("disabled", "disabled");
            $("#FHL_HAWB_GrossWeight").attr("disabled", "disabled");
            $("#FHL_HAWB_VolumeWeight").attr("disabled", "disabled");
            $("#FHL_HAWB_ChargeableWeight").attr("disabled", "disabled");
            $("#FHL_HAWB_NatureofGoods").attr("disabled", "disabled");
            $("#FHL_HAWB_HarmonisedCommodityCode").attr("disabled", "disabled");
            $("#FHL_HAWB_HAWBNo").attr("disabled", "disabled");

            $("input[name='FHL_HAWB_FreightType']").each(function (i) {
                $(this).attr('disabled', 'disabled');
            });

            $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").enable(false);
            $("#FHL_HAWB_SHI_Shipper").prop('disabled', true);
            $("#FHL_HAWB_SHI_Name").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_Street").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_TownLocation").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_State").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_PostalCode").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_MobileNo").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_Email").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_Fax").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_Consignee").prop('disabled', true);
            $("#FHL_HAWB_CON_AccountNoName").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_Street").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_TownLocation").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_State").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_PostalCode").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_MobileNo").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_Email").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_Fax").attr("disabled", "disabled");
            $("#FHL_HAWB_CD_DecCarriageVal").attr("disabled", "disabled");
            $("#FHL_HAWB_CD_DecCustomsVal").attr("disabled", "disabled");
            $("#FHL_HAWB_CD_Insurance").attr("disabled", "disabled");
            $("#FHL_HAWB_CD_ValuationCharge").attr("disabled", "disabled");

            $("#divareaTrans_import_fhlshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
                $(i).find("[id^='Text_FHL_OCI_CountryCode']").data("kendoAutoComplete").enable(false);
                $(i).find("[id^='Text_FHL_OCI_InfoType']").data("kendoAutoComplete").enable(false);
                $(i).find("[id^='Text_FHL_OCI_CSControlInfoIdentifire']").data("kendoAutoComplete").enable(false);
                $(i).find("[id^='FHL_OCI_SCSControlInfoIdentifire']").attr("disabled", "disabled");
                $(i).find("[id^='transActionDiv']").attr("style", "display: none;");
            });

            $("[id^='FHL_HAWB_SHI_Shipper']").hide();
            $("span[id='spnFHL_HAWB_SHI_Shipper']").hide();
            $("[id^='FHL_HAWB_SHI_Consignee']").hide();
            $("span[id='spnFHL_HAWB_SHI_Consignee']").hide();
        },
        error: {
        }
    });
}

function UpdateFHL(SNo) {
    fhlType = "EDIT";
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/FHL/New/1",
        async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail1").html(result);

            if (IsFHLSaveStatus == "True") {
                $("#tblfhl tr:eq(1) td").append("<table align=\"right\"><tr><td><span id=\"Amendment\"><b>Amendment</b></span>&nbsp;<input id=\"chkAmendment\" type=\"checkbox\"\">&nbsp;<span id=\"AmendmentCharges\"><b>Waive off Amendment Charges</b></span>&nbsp;<input id=\"chkAmendmentCharges\" type=\"checkbox\"\"></td></tr></table>");
                $("#tblfhl tr:eq(1) td").find("input[id='chkFWBAmmendment']").prop("checked", false);
                $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").prop("checked", false);
            }

            cfi.AutoComplete("FHL_HAWB_Origin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Destination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_SPHC", "CODE", "SPHC", "SNO", "CODE@", ["CODE", "Description"], null, "contains", ",");
            cfi.AutoComplete("FHL_HAWB_AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_CD_Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_Valuation", WeightValuation);
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_OtherCharge", WeightValuation);
            cfi.AutoComplete("FHL_OCI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
            cfi.AutoComplete("FHL_OCI_InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
            cfi.AutoComplete("FHL_OCI_CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

            $("input[id='FHL_HAWB_Pieces']").unbind("blur").bind("blur", function () {
                validatePcsFHL();
            });

            $("#FHL_HAWB_ChargeableWeight").unbind("blur").bind("blur", function () {
                Zero(this);
                validateChWtFHL();
            });

            $("#FHL_HAWB_GrossWeight").unbind("blur").bind("blur", function () {
                Zero(this);
                validateGrWtFHL();
            });

            $("#FHL_HAWB_VolumeWeight").unbind("blur").bind("blur", function () {
            });

            if (IsFHLSaveStatus == "True" && userContext.SpecialRights.DOFHL == true) {
                $("#tblfhl tr:eq(1) td").find("input[id='chkAmendment']").show();
                $("#tblfhl tr:eq(1) td").find("span[id='Amendment']").show();
            }
            else {
                $("#tblfhl tr:eq(1) td").find("input[id='chkAmendment']").hide();
                $("#tblfhl tr:eq(1) td").find("span[id='Amendment']").hide();
            }

            if (IsFHLSaveStatus == "True" && userContext.SpecialRights.DOFHLC == true) {
                $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").show();
                $("#tblfhl tr:eq(1) td").find("span[id='AmendmentCharges']").show();
            }
            else {
                $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").hide();
                $("#tblfhl tr:eq(1) td").find("span[id='AmendmentCharges']").hide();
            }
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        }
    });

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/BindHAWBSectionData",
        async: false, type: "get", dataType: "json", cache: false,
        data: { HAWBSNo: SNo },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var MainData = Data.Table0;
            var ocitransInfo = Data.Table1;
            var shipperData = Data.Table2;
            var consigneeData = Data.Table3;
            var harmonizedCommodity = Data.Table7;
            var textDescription = Data.Table8;
            if (MainData.length > 0) {
                IsDOCreated = MainData[0].IsDOCreated;
                $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").setDefaultValue(MainData[0].OriginAirportSNo, MainData[0].OriginCityName);
                $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").setDefaultValue(MainData[0].DestinationAirportSNo, MainData[0].DestinationCityName);
                $("#FHL_HAWB_HAWBNo").val(MainData[0].HAWBNo);
                $('#hdntblrowFHLHawbNo').val(MainData[0].HAWBNo)
                $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").setDefaultValue(MainData[0].CommoditySNo, MainData[0].CommodityCode + '-' + MainData[0].CommodityDescription);
                $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").setDefaultValue(MainData[0].AWBCurrencySNo, MainData[0].Currency);

                if (MainData[0].SPHCSNo.length > 0) {
                    if (MainData[0].SPHCSNo != "0" && MainData[0].SPHC != "") {
                        cfi.BindMultiValue("FHL_HAWB_SPHC", MainData[0].SPHC, MainData[0].SPHCSNo)
                        $("#FHL_HAWB_SPHC").val(MainData[0].SPHCSNo);
                    }
                }
                $("#FHL_HAWB_SPHC").closest("td").find("div").css("overflow-x", "scroll").css("width", "200");
                $("#FHL_HAWB_Pieces").val(MainData[0].TotalPieces);
                $("#_tempFHL_HAWB_Pieces").val(MainData[0].TotalPieces);
                $("#hdntblrowFHLPieces").val(MainData[0].TotalPieces);
                $("#hdntblrowFHLIsEdi").val(MainData[0].IsEdi)
                $("#FHL_HAWB_GrossWeight").val(MainData[0].TotalGrossWeight);
                $("#_tempFHL_HAWB_GrossWeight").val(MainData[0].TotalGrossWeight);
                $('#hdntblrowFHLGrWt').val(MainData[0].TotalGrossWeight);
                $("#FHL_HAWB_VolumeWeight").val(MainData[0].TotalVolumeWeight);
                $("#_tempFHL_HAWB_VolumeWeight").val(MainData[0].TotalVolumeWeight);
                $('#hdntblrowFHLVolWt').val(MainData[0].TotalVolumeWeight);
                $("#FHL_HAWB_ChargeableWeight").val(MainData[0].TotalChargeableWeight);
                $("#_tempFHL_HAWB_ChargeableWeight").val(MainData[0].TotalChargeableWeight);
                $("#FHL_HAWB_NatureofGoods").val(MainData[0].NatureOfGoods);
                $("#FHL_HAWB_DescriptionofGoods").val(MainData[0].DescriptionOfGoods);
                $("#FHL_HAWB_HarmonisedCommodityCode").val(MainData[0].HarmonisedCommodityCode);

                if (MainData[0].IsFreightPrepaid == "False") {
                    $('input:radio[name=FHL_HAWB_FreightType]')[1].checked = true;
                }
                else {
                    $('input:radio[name=FHL_HAWB_FreightType]')[0].checked = true;
                }

                $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDCurrencyCode, MainData[0].CVDCurrencyCode);
                $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDWeightValuation, MainData[0].CVDWeightValuationtxt);
                $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDOtherCharges, MainData[0].CVDOtherChargesTxt);
                $("#FHL_HAWB_CD_DecCarriageVal").val(MainData[0].CVDDeclareCarriageValue == "0.000" ? '' : MainData[0].CVDDeclareCarriageValue);
                $("#_tempFHL_HAWB_CD_DecCarriageVal").val(MainData[0].CVDDeclareCarriageValue == "0.000" ? '' : MainData[0].CVDDeclareCarriageValue);
                $("#FHL_HAWB_CD_DecCustomsVal").val(MainData[0].CVDDeclareCustomValue == "0.000" ? '' : MainData[0].CVDDeclareCustomValue);
                $("#_tempFHL_HAWB_CD_DecCustomsVal").val(MainData[0].CVDDeclareCustomValue == "0.000" ? '' : MainData[0].CVDDeclareCustomValue);
                $("#FHL_HAWB_CD_Insurance").val(MainData[0].CVDDeclareInsurenceValue == "0.000" ? '' : MainData[0].CVDDeclareInsurenceValue);
                $("#_tempFHL_HAWB_CD_Insurance").val(MainData[0].CVDDeclareInsurenceValue == "0.000" ? '' : MainData[0].CVDDeclareInsurenceValue);
                $("#FHL_HAWB_CD_ValuationCharge").val(MainData[0].CVDValuationCharge == "0.000" ? '' : MainData[0].CVDValuationCharge);
                $("#_tempFHL_HAWB_CD_ValuationCharge").val(MainData[0].CVDValuationCharge == "0.000" ? '' : MainData[0].CVDValuationCharge);

                cfi.makeTrans("import_fhlshipmentocitrans", null, null, BindFHLCountryCodeAutoComplete, ReBindFHLCountryCodeAutoComplete, null, ocitransInfo, 8);
                InstantiateControl("divareaTrans_import_hawbharmonisedcommoditytrans");
                InstantiateControl("divareaTrans_import_hawbdescription");
                cfi.makeTrans("import_hawbharmonisedcommoditytrans", null, null, BindHarmonizedCommodity, REBindHarmonizedCommodity, null, harmonizedCommodity, 8);

                cfi.makeTrans("import_hawbdescription", null, null, null, null, null, textDescription, 8);


                if (shipperData.length > 0) {
                    $("[id^='FHL_HAWB_SHI_Shipper']").prop("checked", shipperData[0].IsShipper == 0 ? false : true);
                    $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                    $("#FHL_HAWB_SHI_Name").val(shipperData[0].ShipperName);
                    $("#FHL_HAWB_SHI_Street").val(shipperData[0].ShipperStreet);
                    $("#FHL_HAWB_SHI_TownLocation").val(shipperData[0].ShipperLocation);
                    $("#FHL_HAWB_SHI_State").val(shipperData[0].ShipperState);
                    $("#FHL_HAWB_SHI_PostalCode").val(shipperData[0].ShipperPostalCode);
                    $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                    $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                    $("#FHL_HAWB_SHI_MobileNo").val(shipperData[0].ShipperMobile);
                    $("#_tempFHL_HAWB_SHI_MobileNo").val(shipperData[0].ShipperMobile);
                    $("#FHL_HAWB_SHI_Email").val(shipperData[0].ShipperEMail);
                    $("#FHL_HAWB_SHI_Fax").val(shipperData[0].Fax);
                    $("#_tempFHL_HAWB_SHI_Fax").val(shipperData[0].Fax);
                }

                if (consigneeData.length > 0) {
                    $("[id^='FHL_HAWB_SHI_Consignee']").prop("checked", consigneeData[0].IsConsignee == 0 ? false : true);
                    $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                    $("#FHL_HAWB_CON_AccountNoName").val(consigneeData[0].ConsigneeName);
                    $("#FHL_HAWB_CON_Street").val(consigneeData[0].ConsigneeStreet);
                    $("#FHL_HAWB_CON_TownLocation").val(consigneeData[0].ConsigneeLocation);
                    $("#FHL_HAWB_CON_State").val(consigneeData[0].ConsigneeState);
                    $("#FHL_HAWB_CON_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                    $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                    $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                    $("#FHL_HAWB_CON_MobileNo").val(consigneeData[0].ConsigneeMobile);
                    $("#_tempFHL_HAWB_CON_MobileNo").val(consigneeData[0].ConsigneeMobile);
                    $("#FHL_HAWB_CON_Email").val(consigneeData[0].ConsigneeEMail);
                    $("#FHL_HAWB_CON_Fax").val(consigneeData[0].Fax);
                    $("#_tempFHL_HAWB_CON_Fax").val(consigneeData[0].Fax);
                }

                $("#FHL_HAWB_GrossWeight").unbind("blur").bind("blur", function () {
                    Zero(this);
                    validateGrWtFHL();
                });

                $("#FHL_HAWB_VolumeWeight").unbind("blur").bind("blur", function () {
                });

                $("#btnSave").css("display", "none");
                $("#btnUpdate").css("display", "block");

                $("#FHL_HAWB_HAWBNo").blur(function () {
                    if ($("#FHL_HAWB_HAWBNo").val() != '' && $("#FHL_HAWB_HAWBNo").val() != undefined) {
                        var HAWBNo = $("#FHL_HAWB_HAWBNo").val().toUpperCase();
                        var AWBSNo = currentawbsno;
                        if ($('#hdntblrowFHLHawbNo').val() !== HAWBNo) {
                            GetHAWBNoDetails(HAWBNo, AWBSNo);
                        }
                    }
                });

                CheckCommodityCode();

                $("#btnUpdate").unbind("click").bind("click", function () {

                    var IsFHLAmmendment = $("#tblfhl tr:eq(1) td").find("input[id='chkAmendment']").is(":checked") == true ? 1 : 0;
                    var IsFHLAmmendmentCharges = $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;


                    if (IsFHLSaveStatus == "True" && IsFHLAmmendment == 0) {
                        ShowMessage('warning', 'Warning - HAWB', "Please check FHL amendment.", "bottom-right");
                        return false;
                    }

                    if (cfi.IsValidSection('divDetail1')) {


                        if ($('#FHL_HAWB_SPHC').val() == "" || $('#FHL_HAWB_SPHC').val() == undefined) {
                            $("#divDetail2").html("No SHC selected are you sure to save FHL without any SHC.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "SHC Information",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        if (UpdateFHLData('FHL', SNo)) {
                                            DeliveryOrderSearch();
                                        }
                                        $("#divDetail2").dialog('close');
                                    },
                                    "No": function () {
                                        $("#divDetail2").dialog('close');
                                        return false;
                                    }
                                }
                            });
                        }
                        else {
                            if (UpdateFHLData('FHL', SNo)) {
                                DeliveryOrderSearch();
                            }
                        }
                    }
                    else {
                        return false;
                    }
                });
            }
        },
        error: {
        }
    });

    $("[id^='FHL_HAWB_SHI_Shipper']").hide();
    $("span[id='spnFHL_HAWB_SHI_Shipper']").hide();
    $("[id^='FHL_HAWB_SHI_Consignee']").hide();
    $("span[id='spnFHL_HAWB_SHI_Consignee']").hide();

    if (Number(IsDOCreated) == 1) {
        $("#divDetail1 input,select").attr("disabled", true);
        $("#btnSave").hide();
        $("#btnSaveToNext").hide();
    }
    else
        $("#divDetail1 input,select").attr("disabled", false);
}

function AddFHL() {
    fhlType = "";
    var flag = true;
    var FHLGrWt = 0;
    var FHLVolWt = 0;
    var FHLTotalGrossWt = 0;
    $("#btnSave").show();
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/BindFHLSectionTable",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AWBSNO: currentawbsno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                FHLTotalGrossWt = Number(myData.Table0[0].TotalGrossWeight);
                for (var i = 0; i < myData.Table1.length; i++) {
                    FHLGrWt = Number(FHLGrWt) + Number(myData.Table1[i].TotalGrossWeight);
                    FHLVolWt = Number(FHLVolWt) + Number(myData.Table1[i].TotalVolumeWeight);
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });

    if (Number(FHLTotalGrossWt) <= Number(FHLGrWt)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Complete gross weight already added against another HAWB .", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/FHL/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail1").html(result);
                cfi.AutoComplete("FHL_HAWB_Origin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
                cfi.AutoComplete("FHL_HAWB_Destination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
                cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains");
                cfi.AutoComplete("FHL_HAWB_SPHC", "CODE", "SPHC", "SNO", "CODE@", ["CODE", "Description"], null, "contains", ",");
                cfi.AutoComplete("FHL_HAWB_AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
                cfi.AutoComplete("FHL_HAWB_SHI_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
                cfi.AutoComplete("FHL_HAWB_SHI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
                cfi.AutoComplete("FHL_HAWB_SHI_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
                cfi.AutoComplete("FHL_HAWB_CON_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
                cfi.AutoComplete("FHL_HAWB_CON_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
                cfi.AutoComplete("FHL_HAWB_CON_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
                cfi.AutoComplete("FHL_HAWB_CD_Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
                cfi.AutoCompleteByDataSource("FHL_HAWB_CD_Valuation", WeightValuation);
                cfi.AutoCompleteByDataSource("FHL_HAWB_CD_OtherCharge", WeightValuation);
                cfi.AutoComplete("FHL_OCI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
                cfi.AutoComplete("FHL_OCI_InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
                cfi.AutoComplete("FHL_OCI_CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

                if (result != undefined || result != "") {
                    InitializePage("FHL", "divDetail1");
                }

                $("input[id='FHL_HAWB_Pieces']").unbind("blur").bind("blur", function () {
                    validatePcsFHL();
                });

                $("#FHL_HAWB_ChargeableWeight").unbind("blur").bind("blur", function () {
                    Zero(this);
                    validateChWtFHL();

                });

                $("#FHL_HAWB_GrossWeight").unbind("blur").bind("blur", function () {
                    Zero(this);
                    validateGrWtFHL();
                });

                $("#FHL_HAWB_VolumeWeight").unbind("blur").bind("blur", function () {
                });
                CheckCommodityCode();

                $("#FHL_HAWB_SHI_Name").removeAttr('data-valid').attr('data-valid-msg');
                $("#FHL_HAWB_SHI_Street").removeAttr('data-valid').attr('data-valid-msg');
                $("#FHL_HAWB_SHI_TownLocation").removeAttr('data-valid').attr('data-valid-msg');
                $("#FHL_HAWB_SHI_State").removeAttr('data-valid').attr('data-valid-msg');
                $("#FHL_HAWB_SHI_PostalCode").removeAttr('data-valid').attr('data-valid-msg');
                $("#FHL_HAWB_SHI_CountryCode").removeAttr('data-valid').attr('data-valid-msg');
                $("#FHL_HAWB_SHI_City").removeAttr('data-valid').attr('data-valid-msg');

                validatePcsFHL();

                $("[id^='FHL_HAWB_SHI_Shipper']").unbind("click").bind("click", function () {
                    AppendControl(this);
                });


                $("#btnSave").css("display", "block");
                $("#btnUpdate").css("display", "none");

                $("[id^='FHL_HAWB_SHI_Shipper']").hide();
                $("span[id='spnFHL_HAWB_SHI_Shipper']").hide();
                $("[id^='FHL_HAWB_SHI_Consignee']").hide();
                $("span[id='spnFHL_HAWB_SHI_Consignee']").hide();
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            }
        });

        cfi.makeTrans("import_fhlshipmentocitrans", null, null, BindFHLCountryCodeAutoComplete, ReBindFHLCountryCodeAutoComplete, null, null, 8);
        cfi.makeTrans("import_hawbharmonisedcommoditytrans", null, null, BindHarmonizedCommodity, REBindHarmonizedCommodity, null, null, 8);
        cfi.makeTrans("import_hawbdescription", null, null, null, null, null, null, 8);

        $("#FHL_HAWB_HAWBNo").blur(function () {
            if ($("#FHL_HAWB_HAWBNo").val() != '' && $("#FHL_HAWB_HAWBNo").val() != undefined) {
                var HAWBNo = $("#FHL_HAWB_HAWBNo").val().toUpperCase();
                var AWBSNo = currentawbsno;
                if ($('#hdntblrowFHLHawbNo').val() !== HAWBNo) {
                    GetHAWBNoDetails(HAWBNo, AWBSNo);
                }
            }
        });
        $("#FHL_HAWB_SPHC").closest("td").find("div").css("overflow-x", "scroll").css("width", "200");
        $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").setDefaultValue(userContext.CurrencySNo, userContext.CurrencyCode);
    }
}

function validatePcsFHL() {
    var totalPcs = $("#hdnTotalPieces").val();
    var countPcs = 0;
    var updatedrowPcs = 0;
    var pcsOnUpdate = $("#FHL_HAWB_Pieces").val();
    var totalGrWt = $("#hdnTotalGrossWeight").val();
    var countGrWt = 0;
    var updatedrowpieces = 0;
    var GrWtOnUpdate = $("#FHL_HAWB_GrossWeight").val();

    if (pcsOnUpdate == "")
        pcsOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total added pcs
    countPcs = $("#hdntblFHLPieces").val();
    updatedrowPcs = $("#hdntblrowFHLPieces").val();
    if (countPcs == "" || countPcs == undefined)
        countPcs = 0;

    if (updatedrowPcs == "" || updatedrowPcs == undefined)
        updatedrowPcs = 0;

    if (tblCount > 0) {
        if (parseInt(updatedrowPcs) == 0)
            var MaxTotalPieces = (parseInt(totalPcs) - (parseInt(countPcs) - parseInt(updatedrowPcs)) - (parseInt(NoOfHouse) - parseInt(tblCount))) + 1
        else
            var MaxTotalPieces = (parseInt(totalPcs) - (parseInt(countPcs) - parseInt(updatedrowPcs)) - (parseInt(NoOfHouse) - parseInt(tblCount)))
    }
    else
        var MaxTotalPieces = (parseInt(totalPcs) - parseInt(NoOfHouse)) + 1;

    countGrWt = $("#hdntblFHLGrWt").val();
    updatedrowGrWt = $("#hdntblrowFHLGrWt").val();
    if (countGrWt == "" || countGrWt == undefined)
        countGrWt = 0;

    if (updatedrowGrWt == "" || updatedrowGrWt == undefined)
        updatedrowGrWt = 0;

    if (GrWtOnUpdate == "" || GrWtOnUpdate == undefined)
        GrWtOnUpdate = 0;

    if (parseInt($("#FHL_HAWB_Pieces").val()) > MaxTotalPieces) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Pieces can not be greater than " + MaxTotalPieces + ".", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }

    if (parseInt($("#FHL_HAWB_Pieces").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Pieces can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }

    if (((parseInt(countPcs) - parseInt(updatedrowPcs)) + parseInt(pcsOnUpdate)) > parseInt(totalPcs)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces can not be exceed from AWB total pieces.", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }

    if (updatedrowPcs == 0) {
        if (NoOfHouse > 0 && (parseInt(tblCount) + 1) == NoOfHouse) {
            if (((parseInt(countPcs) - parseInt(updatedrowPcs)) + parseInt(pcsOnUpdate)) != parseInt(totalPcs)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces should be equal to AWB pieces.", "bottom-right");
                $("#FHL_HAWB_Pieces").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((parseInt(countPcs) - parseInt(updatedrowPcs)) + parseInt(pcsOnUpdate)) != parseInt(totalPcs)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces should be equal to AWB pieces.", "bottom-right");
                $("#FHL_HAWB_Pieces").val('');
                return false;
            }
        }
    }
    if ($("#hdntblrowFHLIsEdi").val() != "True") {
        calcPcs();
        var shipmentGrWt = parseFloat($("#FHL_HAWB_GrossWeight").val());
        var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
        var expectedChWt = (shipmentGrWt > shipmentVolWt ? shipmentGrWt : shipmentVolWt);
    }
}

function validateGrWtFHL() {
    var totalPcs = $("#hdnTotalPieces").val();
    var countPcs = 0;
    var updatedrowPcs = 0;
    var pcsOnUpdate = $("#FHL_HAWB_Pieces").val();
    var totalGrWt = $("#hdnTotalGrossWeight").val();
    var countGrWt = 0;
    var updatedrowpieces = 0;
    var GrWtOnUpdate = $("#FHL_HAWB_GrossWeight").val();

    if (GrWtOnUpdate == "")
        GrWtOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total added pcs and grwt
    countPcs = $("#hdntblFHLPieces").val();
    updatedrowPcs = $("#hdntblrowFHLPieces").val();
    if (countPcs == "" || countPcs == undefined)
        countPcs = 0;

    if (updatedrowPcs == "" || updatedrowPcs == undefined)
        updatedrowPcs = 0;

    countGrWt = $("#hdntblFHLGrWt").val();
    updatedrowGrWt = $("#hdntblrowFHLGrWt").val();
    if (countGrWt == "" || countGrWt == undefined)
        countGrWt = 0;

    if (updatedrowGrWt == "" || updatedrowGrWt == undefined)
        updatedrowGrWt = 0;

    var restPcs = Number(totalPcs) - Number(countPcs) - Number(updatedrowPcs) - Number(pcsOnUpdate);

    var MaxTotalGrossWeight = (parseFloat(totalGrWt) - (parseFloat(countGrWt) - parseFloat(updatedrowGrWt))).toFixed(3);

    if (parseFloat($("#FHL_HAWB_GrossWeight").val()) > MaxTotalGrossWeight) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Gross Weight can not be greater than " + MaxTotalGrossWeight + ".", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (Number($("#FHL_HAWB_GrossWeight").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Gross Weight can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (((Number(countGrWt) - Number(updatedrowGrWt)) + Number(GrWtOnUpdate)) > Number(totalGrWt)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total Gross Weight can not be exceed from AWB total Gross Weight.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (updatedrowGrWt == 0) {
        if (NoOfHouse > 0 && fhlType == "" && (Number(tblCount) + 1) == Number(NoOfHouse)) {
            if (((Number(countGrWt) - Number(updatedrowGrWt)) + Number(GrWtOnUpdate)) != Number(totalGrWt)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total Gross Weight should be equal to AWB Gross Weight.", "bottom-right");
                $("#FHL_HAWB_GrossWeight").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((Number(countGrWt) - Number(updatedrowGrWt)) + Number(GrWtOnUpdate)) != Number(totalGrWt)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total Gross Weight should be equal to AWB Gross Weight.", "bottom-right");
                $("#FHL_HAWB_GrossWeight").val('');
                return false;
            }
        }
    }

    if ($("#hdntblrowFHLIsEdi").val() != "True") {
        calcPcs();
        var shipmentGrWt = parseFloat($("#FHL_HAWB_GrossWeight").val());
        var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
        var expectedChWt = (Number(shipmentGrWt) > Number(shipmentVolWt) ? shipmentGrWt : shipmentVolWt);
        $("[id$='FHL_HAWB_ChargeableWeight']").val(expectedChWt);
        $("[id$='_tempFHL_HAWB_ChargeableWeight']").val(expectedChWt);
    }
}

function validateChWtFHL() {
    var GrWt = $('#FHL_HAWB_GrossWeight').val();
    var VolWt = $('#FHL_HAWB_VolumeWeight').val();
    var MaxLength = (Number(GrWt) > Number(VolWt) ? GrWt : VolWt);

    if (parseFloat($("#FHL_HAWB_ChargeableWeight").val()) > MaxLength) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Chargeable Weight can not be greater than " + MaxLength + ".", "bottom-right");
        $("#FHL_HAWB_ChargeableWeight").val('');
        return false;
    }
}

function validateVolWtFHL() {
    var totalVolWt = $("#hdnTotalVolumeWeight").val();
    var countVolWt = 0;
    var updatedrowpieces = 0;
    var VolWtOnUpdate = $("#FHL_HAWB_VolumeWeight").val();

    if (VolWtOnUpdate == "")
        VolWtOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total added pcs
    countVolWt = $("#hdntblFHLVolWt").val();
    updatedrowVolWt = $("#hdntblrowFHLVolWt").val();
    if (countVolWt == "" || countVolWt == undefined)
        countVolWt = 0;

    if (updatedrowVolWt == "" || updatedrowVolWt == undefined)
        updatedrowVolWt = 0;

    if (tblCount > 0) {
        if (parseFloat(updatedrowVolWt) == 0)
            var MaxTotalVolumeWeight = ((parseFloat(totalVolWt) - (parseFloat(countVolWt) - parseFloat(updatedrowVolWt)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100))) + 0.01).toFixed(3);
        else
            var MaxTotalVolumeWeight = ((parseFloat(totalVolWt) - (parseFloat(countVolWt) - parseFloat(updatedrowVolWt)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100)))).toFixed(3)
    }
    else
        var MaxTotalVolumeWeight = ((parseFloat(totalVolWt) - parseFloat(NoOfHouse / 100)) + 0.01).toFixed(3);

    if (parseFloat($("#FHL_HAWB_VolumeWeight").val()) > MaxTotalVolumeWeight) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Volume Weight can not be greater than " + MaxTotalVolumeWeight + ".", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        return false;
    }

    if (Number($("#FHL_HAWB_VolumeWeight").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Volume Weight can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (((Number(countVolWt) - Number(updatedrowVolWt)) + Number(VolWtOnUpdate)) > Number(totalVolWt)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total Volume Weight can not be exceed from AWB total Volume Weight.", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        return false;
    }

    if (updatedrowVolWt == 0) {
        if (NoOfHouse > 0 && fhlType == "" && (Number(tblCount) + 1) == NoOfHouse) {
            if (((Number(countVolWt) - Number(updatedrowVolWt)) + Number(VolWtOnUpdate)) != Number(totalVolWt)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total Volume Weight should be equal to AWB Volume Weight.", "bottom-right");
                $("#FHL_HAWB_VolumeWeight").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((Number(countVolWt) - Number(updatedrowVolWt)) + Number(VolWtOnUpdate)) != Number(totalVolWt)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total Volume Weight should be equal to AWB Volume Weight.", "bottom-right");
                $("#FHL_HAWB_VolumeWeight").val('');
                return false;
            }
        }
    }

    if ($("#hdntblrowFHLIsEdi").val() != "True") {
        calcPcs();
        var shipmentGrWt = parseFloat($("#FHL_HAWB_GrossWeight").val());
        var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
        var expectedChWt = (Number(shipmentGrWt) > Number(shipmentVolWt) ? shipmentGrWt : shipmentVolWt);
        $("[id$='FHL_HAWB_ChargeableWeight']").val(expectedChWt);
        $("[id$='_tempFHL_HAWB_ChargeableWeight']").val(expectedChWt);
    }
}

function validatePcsFHL() {
    var totalPcs = $("#hdnTotalPieces").val();
    var countPcs = 0;
    var updatedrowPcs = 0;
    var pcsOnUpdate = $("#FHL_HAWB_Pieces").val();
    var totalGrWt = $("#hdnTotalGrossWeight").val();
    var countGrWt = 0;
    var updatedrowpieces = 0;
    var GrWtOnUpdate = $("#FHL_HAWB_GrossWeight").val();

    if (pcsOnUpdate == "")
        pcsOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total added pcs
    countPcs = $("#hdntblFHLPieces").val();
    updatedrowPcs = $("#hdntblrowFHLPieces").val();
    if (countPcs == "" || countPcs == undefined)
        countPcs = 0;

    if (updatedrowPcs == "" || updatedrowPcs == undefined)
        updatedrowPcs = 0;

    if (tblCount > 0) {
        if (parseInt(updatedrowPcs) == 0)
            var MaxTotalPieces = (parseInt(totalPcs) - (parseInt(countPcs) - parseInt(updatedrowPcs)) - (parseInt(NoOfHouse) - parseInt(tblCount))) + 1
        else
            var MaxTotalPieces = (parseInt(totalPcs) - (parseInt(countPcs) - parseInt(updatedrowPcs)) - (parseInt(NoOfHouse) - parseInt(tblCount)))
    }
    else
        var MaxTotalPieces = (parseInt(totalPcs) - parseInt(NoOfHouse)) + 1;

    countGrWt = $("#hdntblFHLGrWt").val();
    updatedrowGrWt = $("#hdntblrowFHLGrWt").val();
    if (countGrWt == "" || countGrWt == undefined)
        countGrWt = 0;

    if (updatedrowGrWt == "" || updatedrowGrWt == undefined)
        updatedrowGrWt = 0;

    if (GrWtOnUpdate == "" || GrWtOnUpdate == undefined)
        GrWtOnUpdate = 0;

    if (parseInt($("#FHL_HAWB_Pieces").val()) > MaxTotalPieces) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Pieces can not be greater than " + MaxTotalPieces + ".", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }

    if (parseInt($("#FHL_HAWB_Pieces").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Pieces can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }

    if (((parseInt(countPcs) - parseInt(updatedrowPcs)) + parseInt(pcsOnUpdate)) > parseInt(totalPcs)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces can not be exceed from AWB total pieces.", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }

    if (updatedrowPcs == 0) {
        if (NoOfHouse > 0 && (parseInt(tblCount) + 1) == NoOfHouse) {
            if (((parseInt(countPcs) - parseInt(updatedrowPcs)) + parseInt(pcsOnUpdate)) != parseInt(totalPcs)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces should be equal to AWB pieces.", "bottom-right");
                $("#FHL_HAWB_Pieces").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((parseInt(countPcs) - parseInt(updatedrowPcs)) + parseInt(pcsOnUpdate)) != parseInt(totalPcs)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces should be equal to AWB pieces.", "bottom-right");
                $("#FHL_HAWB_Pieces").val('');
                return false;
            }
        }
    }
    if ($("#hdntblrowFHLIsEdi").val() != "True") {
        calcPcs();
        var shipmentGrWt = parseFloat($("#FHL_HAWB_GrossWeight").val());
        var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
        var expectedChWt = (shipmentGrWt > shipmentVolWt ? shipmentGrWt : shipmentVolWt);
    }
}

function validateGrWtFHL() {
    var totalPcs = $("#hdnTotalPieces").val();
    var countPcs = 0;
    var updatedrowPcs = 0;
    var pcsOnUpdate = $("#FHL_HAWB_Pieces").val();
    var totalGrWt = $("#hdnTotalGrossWeight").val();
    var countGrWt = 0;
    var updatedrowpieces = 0;
    var GrWtOnUpdate = $("#FHL_HAWB_GrossWeight").val();

    if (GrWtOnUpdate == "")
        GrWtOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total added pcs and grwt
    countPcs = $("#hdntblFHLPieces").val();
    updatedrowPcs = $("#hdntblrowFHLPieces").val();
    if (countPcs == "" || countPcs == undefined)
        countPcs = 0;

    if (updatedrowPcs == "" || updatedrowPcs == undefined)
        updatedrowPcs = 0;

    countGrWt = $("#hdntblFHLGrWt").val();
    updatedrowGrWt = $("#hdntblrowFHLGrWt").val();
    if (countGrWt == "" || countGrWt == undefined)
        countGrWt = 0;

    if (updatedrowGrWt == "" || updatedrowGrWt == undefined)
        updatedrowGrWt = 0;

    var restPcs = Number(totalPcs) - Number(countPcs) - Number(updatedrowPcs) - Number(pcsOnUpdate);

    var MaxTotalGrossWeight = (parseFloat(totalGrWt) - (parseFloat(countGrWt) - parseFloat(updatedrowGrWt))).toFixed(3);

    if (parseFloat($("#FHL_HAWB_GrossWeight").val()) > MaxTotalGrossWeight) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Gross Weight can not be greater than " + MaxTotalGrossWeight + ".", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (Number($("#FHL_HAWB_GrossWeight").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Gross Weight can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (((Number(countGrWt) - Number(updatedrowGrWt)) + Number(GrWtOnUpdate)) > Number(totalGrWt)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total Gross Weight can not be exceed from AWB total Gross Weight.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (updatedrowGrWt == 0) {
        if (NoOfHouse > 0 && fhlType == "" && (Number(tblCount) + 1) == Number(NoOfHouse)) {
            if (((Number(countGrWt) - Number(updatedrowGrWt)) + Number(GrWtOnUpdate)) != Number(totalGrWt)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total Gross Weight should be equal to AWB Gross Weight.", "bottom-right");
                $("#FHL_HAWB_GrossWeight").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((Number(countGrWt) - Number(updatedrowGrWt)) + Number(GrWtOnUpdate)) != Number(totalGrWt)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total Gross Weight should be equal to AWB Gross Weight.", "bottom-right");
                $("#FHL_HAWB_GrossWeight").val('');
                return false;
            }
        }
    }

    if ($("#hdntblrowFHLIsEdi").val() != "True") {
        calcPcs();
        var shipmentGrWt = parseFloat($("#FHL_HAWB_GrossWeight").val());
        var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
        var expectedChWt = (Number(shipmentGrWt) > Number(shipmentVolWt) ? shipmentGrWt : shipmentVolWt);
        $("[id$='FHL_HAWB_ChargeableWeight']").val(expectedChWt);
        $("[id$='_tempFHL_HAWB_ChargeableWeight']").val(expectedChWt);
    }
}

function validateChWtFHL() {
    var GrWt = $('#FHL_HAWB_GrossWeight').val();
    var VolWt = $('#FHL_HAWB_VolumeWeight').val();
    var MaxLength = (Number(GrWt) > Number(VolWt) ? GrWt : VolWt);

    if (parseFloat($("#FHL_HAWB_ChargeableWeight").val()) > MaxLength) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Chargeable Weight can not be greater than " + MaxLength + ".", "bottom-right");
        $("#FHL_HAWB_ChargeableWeight").val('');
        return false;
    }
}

function validateVolWtFHL() {
    var totalVolWt = $("#hdnTotalVolumeWeight").val();
    var countVolWt = 0;
    var updatedrowpieces = 0;
    var VolWtOnUpdate = $("#FHL_HAWB_VolumeWeight").val();

    if (VolWtOnUpdate == "")
        VolWtOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total added pcs
    countVolWt = $("#hdntblFHLVolWt").val();
    updatedrowVolWt = $("#hdntblrowFHLVolWt").val();
    if (countVolWt == "" || countVolWt == undefined)
        countVolWt = 0;

    if (updatedrowVolWt == "" || updatedrowVolWt == undefined)
        updatedrowVolWt = 0;

    if (tblCount > 0) {
        if (parseFloat(updatedrowVolWt) == 0)
            var MaxTotalVolumeWeight = ((parseFloat(totalVolWt) - (parseFloat(countVolWt) - parseFloat(updatedrowVolWt)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100))) + 0.01).toFixed(3);
        else
            var MaxTotalVolumeWeight = ((parseFloat(totalVolWt) - (parseFloat(countVolWt) - parseFloat(updatedrowVolWt)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100)))).toFixed(3)
    }
    else
        var MaxTotalVolumeWeight = ((parseFloat(totalVolWt) - parseFloat(NoOfHouse / 100)) + 0.01).toFixed(3);

    if (parseFloat($("#FHL_HAWB_VolumeWeight").val()) > MaxTotalVolumeWeight) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Volume Weight can not be greater than " + MaxTotalVolumeWeight + ".", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        return false;
    }

    if (Number($("#FHL_HAWB_VolumeWeight").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Volume Weight can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (((Number(countVolWt) - Number(updatedrowVolWt)) + Number(VolWtOnUpdate)) > Number(totalVolWt)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total Volume Weight can not be exceed from AWB total Volume Weight.", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        return false;
    }

    if (updatedrowVolWt == 0) {
        if (NoOfHouse > 0 && fhlType == "" && (Number(tblCount) + 1) == NoOfHouse) {
            if (((Number(countVolWt) - Number(updatedrowVolWt)) + Number(VolWtOnUpdate)) != Number(totalVolWt)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total Volume Weight should be equal to AWB Volume Weight.", "bottom-right");
                $("#FHL_HAWB_VolumeWeight").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((Number(countVolWt) - Number(updatedrowVolWt)) + Number(VolWtOnUpdate)) != Number(totalVolWt)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total Volume Weight should be equal to AWB Volume Weight.", "bottom-right");
                $("#FHL_HAWB_VolumeWeight").val('');
                return false;
            }
        }
    }

    if ($("#hdntblrowFHLIsEdi").val() != "True") {
        calcPcs();
        var shipmentGrWt = parseFloat($("#FHL_HAWB_GrossWeight").val());
        var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
        var expectedChWt = (Number(shipmentGrWt) > Number(shipmentVolWt) ? shipmentGrWt : shipmentVolWt);
        $("[id$='FHL_HAWB_ChargeableWeight']").val(expectedChWt);
        $("[id$='_tempFHL_HAWB_ChargeableWeight']").val(expectedChWt);
    }
}

function calcPcs() {
    var totalPcs = $("#hdnTotalPieces").val();
    var totalGWt = $("#hdnTotalGrossWeight").val();
    var totalVWt = $("#hdnTotalVolumeWeight").val();
    var rmgPcs = $("#hdnRemainingPieces").val();
    var rmgGWt = $("#hdnRemainingGrWt").val();
    var rmgVWt = $("#hdnRemainingVolWt").val();

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    var spGWt = parseFloat(rmgGWt) / parseInt(rmgPcs);
    var spVWt = parseFloat(rmgVWt) / parseInt(rmgPcs);
    if ($("#FHL_HAWB_Pieces").val() != "") {
        var calcGwt = parseInt($("#FHL_HAWB_Pieces").val()) * parseFloat(spGWt);
        calcGwt = parseFloat(Number($("#FHL_HAWB_GrossWeight").val()) == 0 ? calcGwt : $("#FHL_HAWB_GrossWeight").val());

        var calcVwt = (parseInt($("#FHL_HAWB_Pieces").val()) * (parseFloat(spVWt) * 166.66)) / 166.66;
        calcVwt = parseFloat(Number($("#FHL_HAWB_VolumeWeight").val()) == 0 ? calcVwt : $("#FHL_HAWB_VolumeWeight").val());

    }
    else {
        $("#FHL_HAWB_VolumeWeight").val("0.00");
        $("#FHL_HAWB_GrossWeight").val("0.00");
        $("#_tempFHL_HAWB_VolumeWeight").val("0.00");
        $("#_tempFHL_HAWB_GrossWeight").val("0.00");
    }
}

function CalculateShipmentCBMFHL() {
    var grosswt = ($("#FHL_HAWB_GrossWeight").val() == "" ? 0 : parseFloat($("#FHL_HAWB_GrossWeight").val()));
    var volwt = ($("#FHL_HAWB_VolumeWeight").val() == "" ? 0 : parseFloat($("#FHL_HAWB_VolumeWeight").val()));
    var cbm = (volwt / 166.6667).toFixed(3);
    $("#CBM").val(cbm.toString());
    $("#_tempCBM").val(cbm.toString());
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#FHL_HAWB_ChargeableWeight").val(chwt.toString());
    $("#_tempFHL_HAWB_ChargeableWeight").val(chwt.toFixed(3).toString());
}

function CalculateShipmentChWtFHL(obj) {
    var grosswt = ($("#FHL_HAWB_GrossWeight").val() == "" ? 0 : parseFloat($("#FHL_HAWB_GrossWeight").val()));
    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.6667;
    if ($(obj).attr('id').toUpperCase() == "CBM") {
        $("span[id='FHL_HAWB_VolumeWeight']").text(volwt.toFixed(3));
        $("#FHL_HAWB_VolumeWeight").val(volwt.toFixed(3));
        $("#_tempFHL_HAWB_VolumeWeight").val(volwt.toFixed(3));
    }

    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#FHL_HAWB_ChargeableWeight").val(chwt.toFixed(3).toString());
    $("#_tempFHL_HAWB_ChargeableWeight").val(chwt.toFixed(3).toString());
}

function compareGrossVolValueFHL() {
    var gw = $("#FHL_HAWB_GrossWeight").val();
    var vw = $("#FHL_HAWB_VolumeWeight").val();
    var cw = $("#FHL_HAWB_ChargeableWeight").val();
    var chwt = gw > vw ? gw : vw;

    if (parseFloat($("#FHL_HAWB_ChargeableWeight").val() == "" ? "0" : $("#FHL_HAWB_ChargeableWeight").val()) < chwt) {
        $("#FHL_HAWB_ChargeableWeight").val(chwt);
        $("#_tempFHL_HAWB_ChargeableWeight").val(chwt);
    }
}

function GetShipperConsigneeDetailsFHL(e) {
    var UserTyp = (e == "Text_FHL_HAWB_SHI_AccountNo" || e == "Text_FHL_HAWB_SHI_Name") ? "S" : "C";
    var FieldType = (e == "Text_FHL_HAWB_SHI_Name" || e == "Text_FHL_HAWB_CON_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        $("#FHL_HAWB_SHI_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#FHL_HAWB_SHI_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#FHL_HAWB_SHI_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#FHL_HAWB_SHI_State").val(shipperConsigneeData[0].ShipperState);
                        $("#FHL_HAWB_SHI_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#FHL_HAWB_SHI_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#_tempFHL_HAWB_SHI_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#FHL_HAWB_SHI_Email").val(shipperConsigneeData[0].ShipperEMail);
                    }
                    else if (UserTyp == "C") {
                        $("#FHL_HAWB_CON_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#FHL_HAWB_CON_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#FHL_HAWB_CON_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#FHL_HAWB_CON_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#FHL_HAWB_CON_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#FHL_HAWB_CON_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempFHL_HAWB_CON_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#FHL_HAWB_CON_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                    }
                }
                else {
                    if (UserTyp == "S") {
                        $("#FHL_HAWB_SHI_Name").val('');
                        $("#FHL_HAWB_SHI_Street").val('');
                        $("#FHL_HAWB_SHI_TownLocation").val('');
                        $("#FHL_HAWB_SHI_State").val('');
                        $("#FHL_HAWB_SHI_PostalCode").val('');
                        $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#FHL_HAWB_SHI_MobileNo").val('');
                        $("#_tempFHL_HAWB_SHI_MobileNo").val('');
                        $("#FHL_HAWB_SHI_Email").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#FHL_HAWB_CON_AccountNoName").val('');
                        $("#FHL_HAWB_CON_Street").val('');
                        $("#FHL_HAWB_CON_TownLocation").val('');
                        $("#FHL_HAWB_CON_State").val('');
                        $("#FHL_HAWB_CON_PostalCode").val('');
                        $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#FHL_HAWB_CON_MobileNo").val('');
                        $("#_tempFHL_HAWB_CON_MobileNo").val('');
                        $("#FHL_HAWB_CON_Email").val('');
                    }
                }
            },
            error: {
            }
        });
    }
}

function BindFHLCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='FHL_OCI_CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });
}

function ReBindFHLCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_import_fhlshipmentocitrans']").find("[id^='areaTrans_import_fhlshipmentocitrans']").each(function () {
        $(this).find("input[id^='FHL_OCI_CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function UpdateFHLData(subprocess, Sno) {
    var flag = true;
    var IsShipperEnable = 0;
    var IsConsigneeEnable = 0;
    IsShipperEnable = $("#FHL_HAWB_SHI_Shipper").is(":checked") == true ? 1 : 0;
    IsConsigneeEnable = $("#FHL_HAWB_SHI_Consignee").is(":checked") == true ? 1 : 0;
    var IsFHLAmmendment = $("#tblfhl tr:eq(1) td").find("input[id='chkAmendment']").is(":checked") == true ? 1 : 0;
    var IsFHLAmmendmentCharges = $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;

    if (Number($("#FHL_HAWB_GrossWeight").val()) == 0) {
        ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be 0.", "bottom-right");
        flag = false;
    }
     
        if (Number($("#FHL_HAWB_VolumeWeight").val()) == 0) {
            ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be 0.", "bottom-right");
            flag = false;
        }
        else if (Number($("#FHL_HAWB_VolumeWeight").val()) > Number($("#hdnTotalVolumeWeight").val())) {
            ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be greater than total Volume Weight .", "bottom-right");      
            flag = false;
        }

        else if ((Number($("#FHL_HAWB_VolumeWeight").val()) == Number($("#hdnTotalVolumeWeight").val())) && (($("#FHL_HAWB_Pieces").val()) != ($("#hdnTotalPieces").val()))) {
            ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be equal to total Volume Weight .", "bottom-right");
           
            flag = false;
        }
        else if ((Number($("#_tempFHL_HAWB_VolumeWeight").val()) != 0) && (Number($("#FHL_HAWB_VolumeWeight").val()) > Number($("#_tempFHL_HAWB_VolumeWeight").val()) && ($("#hdnRemainingPieces").val() == 0)) && (Number($("#FHL_HAWB_VolumeWeight").val()) > ((Number($("#_tempFHL_HAWB_VolumeWeight").val())) + (Number($("#hdnRemainingVolWt").val()))))) {
            ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be greater than Remaining total Volume Weight .", "bottom-right");
            flag = false;
        }
            //---------------------------------------------------------------------------------
         
        else if (Number($("#FHL_HAWB_GrossWeight").val()) > Number($("#hdnTotalGrossWeight").val())) {
            ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be greater than total Gross Weight .", "bottom-right");
            flag = false;
        }

        else if ((Number($("#FHL_HAWB_GrossWeight").val()) == Number($("#hdnTotalGrossWeight").val())) && (($("#FHL_HAWB_Pieces").val()) != ($("#hdnTotalPieces").val()))) {
            ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be equal to total Gross Weight .", "bottom-right");
            flag = false;
        }
        else if ((Number($("#_tempFHL_HAWB_GrossWeight").val()) != 0) && (Number($("#FHL_HAWB_GrossWeight").val()) > Number($("#_tempFHL_HAWB_VolumeWeight").val()) && ($("#hdnRemainingPieces").val() == 0)) && (Number($("#FHL_HAWB_GrossWeight").val()) > ((Number($("#_tempFHL_HAWB_GrossWeight").val())) + (Number($("#hdnRemainingGrWt").val()))))) {
            ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be greater than Remaining total Gross Weight .", "bottom-right");
            flag = false;
        }
    //---------------------------------------------------------------------------------
    var IsFHLSave = 1;

    var HAWBViewModel = {
        AWBSNo: currentawbsno,
        HAWBOrigin: $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").key(),
        HAWBDestination: $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").key(),
        HAWBNo: $("#FHL_HAWB_HAWBNo").val().toUpperCase(),
        HAWBCommodity: $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").key(),
        HAWBSPHC: $("#FHL_HAWB_SPHC").val(),
        HAWBPieces: $("#FHL_HAWB_Pieces").val(),
        HAWBGrossWeight: $("#FHL_HAWB_GrossWeight").val(),
        HAWBVolumeWeight: $("#FHL_HAWB_VolumeWeight").val(),
        HAWBChargeableWeight: $("#FHL_HAWB_ChargeableWeight").val(),
        HAWBAWBCurrency: $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").key(),
        HAWBNatureofGoods: $("#FHL_HAWB_NatureofGoods").val(),
        HAWBDescriptionOfGoods: $("#FHL_HAWB_DescriptionofGoods").val(),
        HAWBFreightType: ($("[id='FHL_HAWB_FreightType']:checked").val() == 0 ? "Prepaid" : "Collect"),
        HAWBHarmonisedCommodityCode: $("#FHL_HAWB_HarmonisedCommodityCode").val()
    };

    var ShipperViewModel = {
        ShipperAccountNo: $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key(),
        ShipperName: $("#FHL_HAWB_SHI_Name").val().toUpperCase(),
        ShipperStreet: $("#FHL_HAWB_SHI_Street").val(),
        ShipperLocation: $("#FHL_HAWB_SHI_TownLocation").val(),
        ShipperState: $("#FHL_HAWB_SHI_State").val(),
        ShipperPostalCode: $("#FHL_HAWB_SHI_PostalCode").val(),
        ShipperCity: $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").key(),
        ShipperCountryCode: $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").key(),
        ShipperMobile: $("#FHL_HAWB_SHI_MobileNo").val(),
        ShipperEMail: $("#FHL_HAWB_SHI_Email").val(),
        ShipperFax: $("#FHL_HAWB_SHI_Fax").val(),
        ShipperName2: "",
        ShipperStreet2: "",
        ShipperMobile2: ""
    };

    var ConsigneeViewMode = {
        ConsigneeAccountNo: $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key(),
        ConsigneeName: $("#FHL_HAWB_CON_AccountNoName").val().toUpperCase(),
        ConsigneeStreet: $("#FHL_HAWB_CON_Street").val(),
        ConsigneeLocation: $("#FHL_HAWB_CON_TownLocation").val(),
        ConsigneeState: $("#FHL_HAWB_CON_State").val(),
        ConsigneePostalCode: $("#FHL_HAWB_CON_PostalCode").val(),
        ConsigneeCity: $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").key(),
        ConsigneeCountryCode: $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").key(),
        ConsigneeMobile: $("#FHL_HAWB_CON_MobileNo").val(),
        ConsigneeEMail: $("#FHL_HAWB_CON_Email").val(),
        ConsigneeFax: $("#FHL_HAWB_CON_Fax").val(),
        ConsigneeName2: "",
        ConsigneeStreet2: "",
        ConsigneeMobile2: ""
    };

    var ChargeDeclarationsViewMode = {
        ChargeDeclarationsCurrency: $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").key(),
        ChargeDeclarationsValuation: $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").key(),
        ChargeDeclarationsOtherCharge: $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").key(),
        ChargeDeclarationsDecCarriageVal: $("#FHL_HAWB_CD_DecCarriageVal").val() == "" ? 0.00 : $("#FHL_HAWB_CD_DecCarriageVal").val(),
        ChargeDeclarationsDecCustomsVal: $("#FHL_HAWB_CD_DecCustomsVal").val() == "" ? 0.00 : $("#FHL_HAWB_CD_DecCustomsVal").val(),
        ChargeDeclarationsInsurance: $("#FHL_HAWB_CD_Insurance").val() == "" ? 0.00 : $("#FHL_HAWB_CD_Insurance").val(),
        ChargeDeclarationsValuationCharge: $("#FHL_HAWB_CD_ValuationCharge").val() == "" ? 0.00 : $("#FHL_HAWB_CD_ValuationCharge").val(),
    };

    var OCIInfoModel = new Array();
    var HarmonizedCommodityCode = new Array();
    var HAWBNo = $("#FHL_HAWB_HAWBNo").val()
    var HawbDescription = new Array();
    $("#divareaTrans_import_fhlshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
        if (($(i).find('td:nth-child(2) input[type=text]').val() != '') && ($(i).find('td:nth-child(3) input[type=text]').val() != '') && ($(i).find('td:nth-child(4) input[type=text]').val() != '')) {
            OCIInfoModel.push({
                AWBSNo: currentawbsno,
                CountryCode: $(i).find("td:eq(1) > [id^='FHL_OCI_CountryCode']").val(),
                InfoType: $(i).find("td:eq(2) > [id^='FHL_OCI_InfoType']").val(),
                CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='FHL_OCI_CSControlInfoIdentifire']").val(),
                SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
            });
        }
    });

    $("#divareaTrans_import_hawbharmonisedcommoditytrans table tr[data-popup='false']").each(function (row, i) {
        if ($(this).find('input:text[id^="HarmonizedCommodity"]').val() != "") {
            HarmonizedCommodityCode.push({
                harmonizedCommodityCode: $(this).find('input:text[id^="HarmonizedCommodity"]').val()

            })
        }

    });

    $("#divareaTrans_import_hawbdescription table tr[data-popup='false']").each(function (row, i) {
        if ($(this).find('input:text[id^="HAWBDescription"]').val() != "") {
            HawbDescription.push({
                hawbDescription: $(this).find('input:text[id^="HAWBDescription"]').val()
            })
        }

    });

    if (flag == true) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/UpdateFHLinfoImport", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                ArrivedShipmentSNo: currentArrivedShipmentSNo,
                HAWBSNo: Sno,
                HAWBInformation: HAWBViewModel,
                ShipperInformation: ShipperViewModel,
                ConsigneeInformation: ConsigneeViewMode,
                ChargeDeclarationsInformation: ChargeDeclarationsViewMode,
                OCIInformation: OCIInfoModel,
                ShipperSno: $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key(),
                ConsigneeSno: $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key(),
                IsShipperEnable: IsShipperEnable,
                IsConsigneeEnable: IsConsigneeEnable,
                IsFHLSave: IsFHLSave,
                IsFHLAmmendment: IsFHLAmmendment,
                IsFHLAmmendmentCharges: IsFHLAmmendmentCharges
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - HAWB', "HAWB Updated Successfully", "bottom-right");
                    BindFHLSection();
                    var theFHLDiv = document.getElementById("divDetail1");
                    theFHLDiv.innerHTML = "";
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                flag = false;
            }
        });

        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveFHLHarmonizedCommodity", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ HarmonizedCommodityCode: HarmonizedCommodityCode, HAWBNo: HAWBNo, AwbSNo: currentawbsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        });

        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveFHLHAWBDescription", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ HawbDescription: HawbDescription, HAWBNo: HAWBNo, AwbSNo: currentawbsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        });
    }
    return flag;
}

function ValidateFHLGrossWeight() {
            var countGrossWeight = 0;
            var updatedrowGrossWeight = 0;
            var flag = true;
            var totalGrossWeight = $("#hdnTotalGrossWeight").val();  
            var GrossWeightOnUpdate = $("#FHL_HAWB_GrossWeight").val();
            var NoOfHouse = $("#hdnNoOfHouse").val();
            if (NoOfHouse == "" || NoOfHouse == undefined)
                NoOfHouse = 0;
            var tblCount = $("#hdntblCount").val();
            if (tblCount == "" || tblCount == undefined)
                tblCount = 0;
            countGrossWeight = $("#hdntblFHLGrWt").val();
            updatedrowGrossWeight = $("#hdntblrowFHLGrWt").val();
            if (countGrossWeight == "" || countGrossWeight == undefined)
                countGrossWeight = 0;
            if (updatedrowGrossWeight == "" || updatedrowGrossWeight == undefined)
                updatedrowGrossWeight = 0;
            if (tblCount > 0) {
                if (parseFloat(updatedrowGrossWeight) == 0)
                    var MaxTotalGrossWeight = ((parseFloat(totalGrossWeight) - (parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100))) + 0.01).toFixed(3);
                else
                    var MaxTotalGrossWeight = ((parseFloat(totalGrossWeight) - (parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100)))).toFixed(3)
            }
            else
                var MaxTotalGrossWeight = ((parseFloat(totalGrossWeight) - parseFloat(NoOfHouse / 100)) + 0.01).toFixed(3);
           if (updatedrowGrossWeight == 0) {
                if (NoOfHouse > 0 && (parseInt(tblCount) + 1) == NoOfHouse) {
                    if (((parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) + parseFloat(GrossWeightOnUpdate)) != parseFloat(totalGrossWeight)) {
                        ShowMessage('warning', 'Warning - House Air WayBill', "Total  Gross Weight should be equal to AWB GrossWeight.", "bottom-right");
                        //$("#FHL_HAWB_GrossWeight").val('');
                        return false;
                    }
                }
           }
           var countVolumeWeight = 0;
           var updatedrowVolumeWeight = 0;
           var flag = true;
           var totalVolumeWeight = $("#hdnTotalVolumeWeight").val();
           var VolumeWeightOnUpdate = $("#FHL_HAWB_VolumeWeight").val();
           var NoOfHouse = $("#hdnNoOfHouse").val();
           if (NoOfHouse == "" || NoOfHouse == undefined)
               NoOfHouse = 0;
           var tblCount = $("#hdntblCount").val();
           if (tblCount == "" || tblCount == undefined)
               tblCount = 0;
           countVolumeWeight = $("#hdntblFHLVolWt").val();
           updatedrowVolumeWeight = $("#hdntblrowFHLVolWt").val();
           if (countVolumeWeight == "" || countVolumeWeight == undefined)
               countVolumeWeight = 0;
           if (updatedrowVolumeWeight == "" || updatedrowVolumeWeight == undefined)
               updatedrowVolumeWeight = 0;
           if (tblCount > 0) {
               if (parseFloat(updatedrowVolumeWeight) == 0)
                   var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100))) + 0.01).toFixed(3);
               else
                   var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100)))).toFixed(3)
           }
           else
               var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - parseFloat(NoOfHouse / 100)) + 0.01).toFixed(3);
           if (updatedrowVolumeWeight == 0) {
               if (NoOfHouse > 0 && (parseInt(tblCount) + 1) == NoOfHouse) {
                   if (((parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) + parseFloat(VolumeWeightOnUpdate)) != parseFloat(totalVolumeWeight)) {
                       ShowMessage('warning', 'Warning - House Air WayBill', "Total  Volume Weight should be equal to AWB VolumeWeight.", "bottom-right");
                       //$("#FHL_HAWB_GrossWeight").val('');
                       return false;
                   }
               }
           }
           return flag;
           
        }
//function ValidateFHLVolumeWeight() {
//    var countVolumeWeight = 0;
//    var updatedrowVolumeWeight = 0;
//    var flag = true;
//    var totalVolumeWeight = $("#hdnTotalVolumeWeight").val();   
//    var VolumeWeightOnUpdate = $("#FHL_HAWB_VolumeWeight").val();
//    var NoOfHouse = $("#hdnNoOfHouse").val();
//    if (NoOfHouse == "" || NoOfHouse == undefined)
//        NoOfHouse = 0;
//    var tblCount = $("#hdntblCount").val();
//    if (tblCount == "" || tblCount == undefined)
//        tblCount = 0;
//    countVolumeWeight = $("#hdntblFHLVolWt").val();
//    updatedrowVolumeWeight = $("#hdntblrowFHLVolWt").val();
//    if (countVolumeWeight == "" || countVolumeWeight == undefined)
//        countVolumeWeight = 0;
//    if (updatedrowVolumeWeight == "" || updatedrowVolumeWeight == undefined)
//        updatedrowVolumeWeight = 0;
//    if (tblCount > 0) {
//        if (parseFloat(updatedrowVolumeWeight) == 0)
//            var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100))) + 0.01).toFixed(3);
//        else
//            var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100)))).toFixed(3)
//    }
//    else
//        var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - parseFloat(NoOfHouse / 100)) + 0.01).toFixed(3);
//    if (updatedrowVolumeWeight == 0) {
//        if (NoOfHouse > 0 && (parseInt(tblCount) + 1) == NoOfHouse) {
//            if (((parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) + parseFloat(VolumeWeightOnUpdate)) != parseFloat(totalVolumeWeight)) {
//                ShowMessage('warning', 'Warning - House Air WayBill', "Total  Volume Weight should be equal to AWB VolumeWeight.", "bottom-right");
//                //$("#FHL_HAWB_GrossWeight").val('');
//                return false;
//            }
//        }
//    }
//    return true;
//}

function SaveFHLinfo() {
   
    var flag = true;
    var IsShipperEnable = 0;
    var IsConsigneeEnable = 0;
    IsShipperEnable = $("#FHL_HAWB_SHI_Shipper").is(":checked") == true ? 1 : 0;
    IsConsigneeEnable = $("#FHL_HAWB_SHI_Consignee").is(":checked") == true ? 1 : 0;
    flag = ValidateFHLGrossWeight();
    //flag = ValidateFHLVolumeWeight();
    if (Number($("#FHL_HAWB_GrossWeight").val()) == 0) {
        ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be 0.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        flag = false;
    }
    if (Number($("#FHL_HAWB_VolumeWeight").val()) == 0) {
        ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be 0.", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        flag = false;
    }else
    if (Number($("#FHL_HAWB_VolumeWeight").val()) > Number($("#hdnTotalVolumeWeight").val())) {
        ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be greater than total Volume Weight .", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        flag = false;
    }
    else    if ((Number($("#FHL_HAWB_VolumeWeight").val()) == Number($("#hdnTotalVolumeWeight").val())) && (($("#FHL_HAWB_Pieces").val()) != ($("#hdnTotalPieces").val()))) {
        ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be equal to total Volume Weight .", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        flag = false;
    }
   else if ((Number($("#_tempFHL_HAWB_VolumeWeight").val()) != 0) && Number($("#FHL_HAWB_VolumeWeight").val()) > Number($("#_tempFHL_HAWB_VolumeWeight").val()) && ($("#hdnRemainingPieces").val() == 0)) {
       ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be greater than Remaining total Volume Weight .", "bottom-right");
       $("#FHL_HAWB_VolumeWeight").val('');
        flag = false;
    }
   else  if ((Number($("#_tempFHL_HAWB_VolumeWeight").val()) != 0) && Number($("#FHL_HAWB_VolumeWeight").val()) == Number($("#_tempFHL_HAWB_VolumeWeight").val()) && (($("#FHL_HAWB_Pieces").val()) != ($("#hdnRemainingPieces").val()))) {
       ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be equal to Remaining total Volume Weight .", "bottom-right");
       $("#FHL_HAWB_VolumeWeight").val('');
        flag = false;
    }
   else if ((Number($("#_tempFHL_HAWB_VolumeWeight").val()) != 0) && (Number($("#FHL_HAWB_VolumeWeight").val()) > Number($("#_tempFHL_HAWB_VolumeWeight").val()))) {
       ShowMessage('warning', 'Warning - HAWB', "Volume Weight can not be greater than Remaining total Volume Weight .", "bottom-right");
       $("#FHL_HAWB_VolumeWeight").val('');
      flag = false;
    }
   
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------
    if (Number($("#FHL_HAWB_GrossWeight").val()) > Number($("#hdnTotalGrossWeight").val())) {
        ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be greater than total Gross Weight .", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        flag = false;
    }  
    else if ((Number($("#FHL_HAWB_GrossWeight").val()) == Number($("#hdnTotalGrossWeight").val())) && (($("#FHL_HAWB_Pieces").val()) != ($("#hdnTotalPieces").val()))) {
        ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be equal to total Gross Weight .", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
          flag = false;
      }
    else if ((Number($("#_tempFHL_HAWB_GrossWeight").val()) != 0) && Number($("#FHL_HAWB_GrossWeight").val()) > Number($("#_tempFHL_HAWB_GrossWeight").val()) && ($("#hdnRemainingPieces").val() == 0)) {
        ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be greater than Remaining total Gross Weight .", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
          flag = false;
      }
    else if ((Number($("#_tempFHL_HAWB_GrossWeight").val()) != 0) && Number($("#FHL_HAWB_GrossWeight").val()) == Number($("#_tempFHL_HAWB_GrossWeight").val()) && (($("#FHL_HAWB_Pieces").val()) != ($("#hdnRemainingPieces").val()))) {
          ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be equal to Remaining total Gross Weight .", "bottom-right");
          flag = false;
      }
    else if ((Number($("#_tempFHL_HAWB_GrossWeight").val()) != 0) && (Number($("#FHL_HAWB_GrossWeight").val()) > Number($("#_tempFHL_HAWB_GrossWeight").val()))) {
        ShowMessage('warning', 'Warning - HAWB', "Gross Weight can not be greater than Remaining total Gross Weight .", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
          flag = false;
      }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    var IsFHLAmmendment = $("#tblfhl tr:eq(1) td").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
    var IsFHLAmmendmentCharges = $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;

    var IsFHLSave = 1;

    var HAWBViewModel = {
        AWBSNo: currentawbsno,
        HAWBOrigin: $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").key(),
        HAWBDestination: $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").key(),
        HAWBNo: $("#FHL_HAWB_HAWBNo").val().toUpperCase(),
        HAWBCommodity: $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").key(),
        HAWBSPHC: $("#FHL_HAWB_SPHC").val(),
        HAWBPieces: $("#FHL_HAWB_Pieces").val(),
        HAWBGrossWeight: $("#FHL_HAWB_GrossWeight").val(),
        HAWBVolumeWeight: $("#FHL_HAWB_VolumeWeight").val(),
        HAWBChargeableWeight: $("#FHL_HAWB_ChargeableWeight").val(),
        HAWBAWBCurrency: $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").key(),
        HAWBNatureofGoods: $("#FHL_HAWB_NatureofGoods").val(),
        HAWBDescriptionOfGoods: $("#FHL_HAWB_DescriptionofGoods").val(),
        HAWBFreightType: ($("[id='FHL_HAWB_FreightType']:checked").val() == 0 ? "Prepaid" : "Collect"),
        HAWBHarmonisedCommodityCode: $("#FHL_HAWB_HarmonisedCommodityCode").val()
    };

    var ShipperViewModel = {
        ShipperAccountNo: $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key(),
        ShipperName: $("#FHL_HAWB_SHI_Name").val().toUpperCase(),
        ShipperStreet: $("#FHL_HAWB_SHI_Street").val(),
        ShipperLocation: $("#FHL_HAWB_SHI_TownLocation").val(),
        ShipperState: $("#FHL_HAWB_SHI_State").val(),
        ShipperPostalCode: $("#FHL_HAWB_SHI_PostalCode").val(),
        ShipperCity: $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").key(),
        ShipperCountryCode: $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").key(),
        ShipperMobile: $("#FHL_HAWB_SHI_MobileNo").val(),
        ShipperEMail: $("#FHL_HAWB_SHI_Email").val(),
        ShipperFax: $("#FHL_HAWB_SHI_Fax").val(),
        ShipperName2: "",
        ShipperStreet2: "",
        ShipperMobile2: ""
    };

    var ConsigneeViewMode = {
        ConsigneeAccountNo: $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key(),
        ConsigneeName: $("#FHL_HAWB_CON_AccountNoName").val().toUpperCase(),
        ConsigneeStreet: $("#FHL_HAWB_CON_Street").val(),
        ConsigneeLocation: $("#FHL_HAWB_CON_TownLocation").val(),
        ConsigneeState: $("#FHL_HAWB_CON_State").val(),
        ConsigneePostalCode: $("#FHL_HAWB_CON_PostalCode").val(),
        ConsigneeCity: $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").key(),
        ConsigneeCountryCode: $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").key(),
        ConsigneeMobile: $("#FHL_HAWB_CON_MobileNo").val(),
        ConsigneeEMail: $("#FHL_HAWB_CON_Email").val(),
        ConsigneeFax: $("#FHL_HAWB_CON_Fax").val(),
        ConsigneeName2: "",
        ConsigneeStreet2: "",
        ConsigneeMobile2: ""
    };

    var ChargeDeclarationsViewMode = {
        ChargeDeclarationsCurrency: $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").key(),
        ChargeDeclarationsValuation: $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").key(),
        ChargeDeclarationsOtherCharge: $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").key(),
        ChargeDeclarationsDecCarriageVal: $("#FHL_HAWB_CD_DecCarriageVal").val() == "" ? 0.00 : $("#FHL_HAWB_CD_DecCarriageVal").val(),
        ChargeDeclarationsDecCustomsVal: $("#FHL_HAWB_CD_DecCustomsVal").val() == "" ? 0.00 : $("#FHL_HAWB_CD_DecCustomsVal").val(),
        ChargeDeclarationsInsurance: $("#FHL_HAWB_CD_Insurance").val() == "" ? 0.00 : $("#FHL_HAWB_CD_Insurance").val(),
        ChargeDeclarationsValuationCharge: $("#FHL_HAWB_CD_ValuationCharge").val() == "" ? 0.00 : $("#FHL_HAWB_CD_ValuationCharge").val(),
    };

    var OCIInfoModel = new Array();
    var HarmonizedCommodityCode = new Array();
    var HAWBNo = $("#FHL_HAWB_HAWBNo").val()
    var HawbDescription = new Array();
    $("#divareaTrans_import_fhlshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
        if (($(i).find('td:nth-child(2) input[type=text]').val() != '') && ($(i).find('td:nth-child(3) input[type=text]').val() != '') && ($(i).find('td:nth-child(4) input[type=text]').val() != '')) {
            OCIInfoModel.push({
                AWBSNo: currentawbsno,
                CountryCode: $(i).find("td:eq(1) > [id^='FHL_OCI_CountryCode']").val(),
                InfoType: $(i).find("td:eq(2) > [id^='FHL_OCI_InfoType']").val(),
                CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='FHL_OCI_CSControlInfoIdentifire']").val(),
                SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
            });
        }
    });


    $("#divareaTrans_import_hawbharmonisedcommoditytrans table tr[data-popup='false']").each(function (row, i) {
        if ($(this).find('input:text[id^="HarmonizedCommodity"]').val() != "") {
            HarmonizedCommodityCode.push({
                harmonizedCommodityCode: $(this).find('input:text[id^="HarmonizedCommodity"]').val()

            })
        }

    });
    $("#divareaTrans_import_hawbdescription table tr[data-popup='false']").each(function (row, i) {
        if ($(this).find('input:text[id^="HAWBDescription"]').val() != "") {
            HawbDescription.push({
                hawbDescription: $(this).find('input:text[id^="HAWBDescription"]').val()
            })
        }

    });

    if (flag == true) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveFHLinfoImport", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                ArrivedShipmentSNo: currentArrivedShipmentSNo,
                HAWBSNo: 0,
                HAWBInformation: HAWBViewModel,
                ShipperInformation: ShipperViewModel,
                ConsigneeInformation: ConsigneeViewMode,
                ChargeDeclarationsInformation: ChargeDeclarationsViewMode,
                OCIInformation: OCIInfoModel,
                ShipperSno: $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key(),
                ConsigneeSno: $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key(),
                IsShipperEnable: IsShipperEnable,
                IsConsigneeEnable: IsConsigneeEnable,
                IsFHLSave: IsFHLSave,
                IsFHLAmmendment: IsFHLAmmendment,
                IsFHLAmmendmentCharges: IsFHLAmmendmentCharges,
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - HAWB', "HAWB Updated Successfully", "bottom-right");
                    BindFHLSection();
                    var theFHLDiv = document.getElementById("divDetail1");
                    theFHLDiv.innerHTML = "";
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                flag = false;
            }
        });

        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveFHLHarmonizedCommodity", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ HarmonizedCommodityCode: HarmonizedCommodityCode, HAWBNo: HAWBNo, AwbSNo: currentawbsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        });

        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveFHLHAWBDescription", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ HawbDescription: HawbDescription, HAWBNo: HAWBNo, AwbSNo: currentawbsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        });
    }

    return flag;
}

/************ FAD *************/
function BindFADSection() {
    var alphabettypes = [{ Key: "0", Text: "Cargo" }];
    cfi.AutoCompleteByDataSource("FAD_DiscrepancyType", alphabettypes);
    cfi.AutoComplete("FAD_ReportingStation", "SNo", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("FAD_DiscrepancySubType", "SNo", "vIrregularityIncidentCategoryImport", "SNo", "IncidentCategory", ["IncidentCategory"], null, "contains");
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/BindFADSection",
        async: false, type: "get", dataType: "json", cache: false,
        data: { ArrivedShipmentSNo: currentArrivedShipmentSNo == "" ? 0 : currentArrivedShipmentSNo },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var MainData = Data.Table0;
            if (MainData.length > 0) {
                $("span[id='FAD_AWBNo']").text(MainData[0].AWBNo);
                $("span[id='FAD_AWBOrigin']").text(MainData[0].Origin);
                $("span[id='FAD_AWBDestination']").text(MainData[0].Destination);
                $("span[id='FAD_Pieces']").text(MainData[0].TotalPieces);
                $("span[id='FAD_Grossweight']").text(MainData[0].TotalGrossWeight);
                $("span[id='FAD_VolumeWeight']").text(MainData[0].TotalVolumeWeight);
                $("span[id='FAD_Commodity']").text(MainData[0].CommodityCode);
                $("span[id='FAD_SPHC']").text(MainData[0].SPHC);
                $("#Text_FAD_ReportingStation").data("kendoAutoComplete").setDefaultValue(MainData[0].ReportingStation, MainData[0].ReportingStation);
                $("#FAD_ReportingStation").val(MainData[0].ReportingStationSNo);
                $("#Text_FAD_DiscrepancySubType").data("kendoAutoComplete").setDefaultValue(MainData[0].IncidentCategory, MainData[0].IncidentCategory);
                $("#FAD_DiscrepancySubType").val(MainData[0].IncidentCategorySNo);
                $("#FAD_Remarks").val(MainData[0].IdentificationRemarks);
                $("#FAD_Discrepancypieces").val(MainData[0].Pieces);
                $("#_tempFAD_Discrepancypieces").val(MainData[0].Pieces);
                $("#FAD_DiscrepancyGrossweight").val(MainData[0].Weight);
                $("#_tempFAD_DiscrepancyGrossweight").val(MainData[0].Weight);
                $("#FAD_DiscrepancyVolwt").val(MainData[0].VolumeWeight);
                $("#_tempFAD_DiscrepancyVolwt").val(MainData[0].VolumeWeight);
            }
        },
        error: {
        }
    });
}

function SaveFADinfo() {
    var flag = false;
    var ArrivedShipmentSNo = (currentArrivedShipmentSNo == "" ? 0 : currentArrivedShipmentSNo);
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    var ReportingStation = $("#Text_FAD_ReportingStation").data("kendoAutoComplete").key();
    var DiscrepancyType = 0;//$("#Text_FAD_DiscrepancyType").data("kendoAutoComplete").key();
    var DiscrepancySubType = $("#Text_FAD_DiscrepancySubType").data("kendoAutoComplete").key();
    var Discrepancypieces = $("#FAD_Discrepancypieces").val() == "" ? 0 : $("#FAD_Discrepancypieces").val();
    var DiscrepancyGrossweight = $("#FAD_DiscrepancyGrossweight").val() == "" ? 0 : $("#FAD_DiscrepancyGrossweight").val();
    var DiscrepancyVolwt = $("#FAD_DiscrepancyVolwt").val() == "" ? 0 : $("#FAD_DiscrepancyVolwt").val();
    var Remarks = $("#FAD_Remarks").val();
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/SaveFAD", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ ArrivedShipmentSNo: ArrivedShipmentSNo, AWBSNo: awbSNo, ReportingStation: ReportingStation, DiscrepancyType: DiscrepancyType, DiscrepancySubType: DiscrepancySubType, Discrepancypieces: Discrepancypieces, DiscrepancyGrossweight: DiscrepancyGrossweight, DiscrepancyVolwt: DiscrepancyVolwt, Remarks: Remarks, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - FAD', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                flag = true;
            }
            else if (result == "1001") {
                ShowMessage('warning', 'warning - FAD', "Discrepancy Type already enter for AWB No. [" + CurrentAWBNo + "] ", "bottom-right");
                flag = true;
            }
            else {
                ShowMessage('warning', 'Warning - FAD', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - FAD', "AWB No. [" + awb$("#AWBNo").val() + "] -  unable to process.", "bottom-right");
        }
    });
    return flag;
}

/************* AWD ************/
function CheckBankConsigned(e) {
    if (e == 'BankConsigned' || e == 'BankReleaseReceived') {
        if ($("[id='BankConsigned']:checked").val() == 'on' || $("[id='BankReleaseReceived']:checked").val() == 'on' || $("[id='BankConsigned']:checked").val() == 'True' || $("[id='BankReleaseReceived']:checked").val() == 'True') {
            $('#DocsName').attr('data-valid', 'required');
            $('#DocsName').attr('data-valid-msg', 'Please Attach Document.');
        }
        else {
            $('#DocsName').removeAttr('data-valid');
            $('#DocsName').removeAttr('data-valid-msg');
            $('#DocsName').closest('td').find('.valid_errmsg').css('display', 'none');
        }
    }
    else {
        if ($("[id='BankConsigned_'" + e.split('_')[1] + "]:checked").val() == 'on' || $("[id='BankReleaseReceived'" + e.split('_')[1] + "]:checked").val() == 'on' || $("[id='BankConsigned_'" + e.split('_')[1] + "]:checked").val() == 'True' || $("[id='BankReleaseReceived'" + e.split('_')[1] + "]:checked").val() == 'True') {
            $('#DocsName_' + e.split('_')[1]).attr('data-valid', 'required');
            $('#DocsName_' + e.split('_')[1]).attr('data-valid-msg', 'Please Attach Document.');
        }
        else {
            $('#DocsName_' + e.split('_')[1]).removeAttr('data-valid');
            $('#DocsName_' + e.split('_')[1]).removeAttr('data-valid-msg');
            $('#DocsName_' + e.split('_')[1]).closest('td').find('.valid_errmsg').css('display', 'none');
        }
    }
}

function BindAWDDocs() {
    $('.k-datepicker').css('width', '150px');
    cfi.AutoComplete("Consignee", "Name", "VWConsigneeCustomer", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("AuthorizedPerson", "Name", "CustomerAuthorizedPersonal", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoCompleteByDataSource("CustomerType", CustomerDataSource, HideCCCharges);

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetRecordAtAWDImport?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo,
        async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno, ArrivedShipmentSNo: currentArrivedShipmentSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArrayMain = edoxData.Table0;
            var edoxArray = edoxData.Table1;
            var alldocrcvd = edoxData.Table2;
            var awdHistory = edoxData.Table3;
            var docRcvd = false;
            $("#Text_CustomerType").data("kendoAutoComplete").enable(false);

            if (alldocrcvd.length > 0) {
                var docItem = alldocrcvd[0];
                docRcvd = docItem.IsAllEDoxRecieved.toLowerCase() == "true" ? true : false;
                $("#XRay").prop("checked", docRcvd);
                $("#Remarks").val(docItem.AllEDoxReceivedRemarks);
            }

            $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue("1", "REGULAR");
            $("#Text_CustomerType").data("kendoAutoComplete").enable(true);

            if ($("#Text_CustomerType").data("kendoAutoComplete").key() == 1) {
                if ($("#Text_AuthorizedPerson").data("kendoAutoComplete") != undefined) {
                    $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(true);
                    $("#Text_AuthorizedPerson").attr("data-valid", "required").attr("data-valid-msg", "Select Authorized Person.");
                }
                $("#AuthorizedPersonId").closest("tr").hide();
                $("#AuthorizedPersonCompany").closest("tr").hide();
            }
            else {
                $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(false);
                $("#AuthorizedPersonId").closest("tr").show();
                $("#AuthorizedPersonCompany").closest("tr").show();
                $("#AuthorizedPersonId").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Id.");
                $("#AuthorizedPersonName").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Name.");
                $("#AuthorizedPersonCompany").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Company.");
            }

            cfi.makeTrans("import_awddocs", null, null, BindEDoxDocTypeAutoCompleteAWD, ReBindEDoxDocTypeAutoCompleteAWD, null, edoxArray);
            if (edoxArray != []) {
                $(edoxArray).each(function (row, i) {
                    if (row > 0) {
                        if (i.bankconsigned == "True") {
                            $("#BankConsigned_" + (row - 1)).prop("checked", true);
                        }
                        if (i.bankreleasereceived == "True") {
                            $("#BankReleaseReceived_" + (row - 1)).prop("checked", true);
                        }
                    }
                    else {
                        if (i.bankconsigned == "True") {
                            $("#BankConsigned").prop("checked", true);
                        }
                        if (i.bankreleasereceived == "True") {
                            $("#BankReleaseReceived").prop("checked", true);
                        }
                    }
                });
            }

            if (!docRcvd) {
                $("div[id$='areaTrans_import_awddocs']").find("[id^='areaTrans_import_awddocs']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, null, "contains");
                    });

                    $(this).find("input[id^='DocsName']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadEDoxDocumentAWD($(this).attr("id"), "DocName");
                        })
                    });

                    $(this).find("a[id^='ahref_DocName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadEDoxDocumentAWD($(this).attr("id"), "DocName");
                        })
                    });
                    $(this).find("input[type='file']").css('width', '');
                });

                if (edoxArray.length > 0) {
                    $("div[id$='areaTrans_import_awddocs']").find("[id^='areaTrans_import_awddocs']").each(function (i, row) {
                        $(this).find("input").attr("disabled", "disabled");
                    });
                }
            }
            else {
                var prevtr = $("div[id$='areaTrans_import_awddocs']").find("tr[id='areaTrans_import_awddocs']").prev()
                prevtr.find("td:eq(2)").remove();
                prevtr.find("td:last").remove();
                $("div[id$='areaTrans_import_awddocs']").find("tr[id^='areaTrans_import_awddocs']").each(function () {
                    $(this).find("td:eq(2)").remove();
                    $(this).find("td:last").remove();
                })

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
            }


            if (awdHistory.length > 0) {
                var strHistory = "";
                var columnNo = 0;
                for (var j in awdHistory[0]) {
                    columnNo = columnNo + 1;
                }
                strHistory += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                strHistory += "<tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"" + columnNo + "\">Document Delivery Details<\/td><\/tr>";
                strHistory += "<tr style=\"font-weight: bold\">";
                for (var j in awdHistory[0]) {
                    strHistory += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
                }
                strHistory += "<\/tr>";
                for (var i in awdHistory) {
                    strHistory += "<tr>";
                    for (var j in awdHistory[i]) {
                        strHistory += "<td class=\"ui-widget-content\">" + awdHistory[i][j] + "<\/td>";
                    }
                    strHistory += "<\/tr>";
                }
                strHistory += "<\/tbody>";
                strHistory += "<\/table>";
                $('#divDetail2').html(strHistory);
            }
        },
        error: {
        }
    });
}

function SaveEDoxListAWD() {
    var EDoxArrayAWD = [];
    var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
    var Consignee = $("#Text_Consignee").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_Consignee").data("kendoAutoComplete").key();;
    var AuthorizedPerson = $("#Text_AuthorizedPerson").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AuthorizedPerson").data("kendoAutoComplete").key();
    var CustomerType = $("#Text_CustomerType").data("kendoAutoComplete").key();
    var AuthorizedPersoneId = $("#AuthorizedPersonId").val();
    var AuthorizedPersoneName = $("#AuthorizedPersonName").val();
    var AuthorizedPersonCompany = $("#AuthorizedPersonCompany").val();
    var flag = false;
    $("div[id$='areaTrans_import_awddocs']").find("[id^='areaTrans_import_awddocs']").each(function () {
        var eDoxViewModel = {
            BankConsigned: $(this).find("input[id^='BankConsigned']")[0].checked,
            BankReleaseReceived: $(this).find("input[id^='BankReleaseReceived']")[0].checked,
            EDoxdocumenttypeSNo: $(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key(),
            DocName: $(this).find("span[id^='DocName']").text(),
            AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
            ReferenceNo: $(this).find("input[id^='Reference']").val(),
            Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
        };
        EDoxArrayAWD.push(eDoxViewModel);
    });

    if (EDoxArrayAWD.length == 0) {
        ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
    }

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/SaveEDoxListAWD", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, ArrivedShipmentSNo: currentArrivedShipmentSNo, AWDEDoxDetail: EDoxArrayAWD, AllEDoxReceived: AllEDoxReceived, Consignee: Consignee, AuthorizedPerson: AuthorizedPerson, CustomerType: CustomerType, AuthorizedPersoneId: AuthorizedPersoneId, AuthorizedPersoneName: AuthorizedPersoneName, AuthorizedPersonCompany: AuthorizedPersonCompany }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - AWD Information', "AWB No. [" + CurrentAWBNo + "] -  Saved Successfully", "bottom-right");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - AWD Information', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        },
        complete: function (xhr) {
            $("div[id$='areaTrans_import_sphcedoxinfo']").find("[id^='areaTrans_import_sphcedoxinfo']").each(function () {
                $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata", '');
            });
        }
    });
    return flag;
}

function BindAttachement(elem, mainElem) {
    $(elem).find("input[id^='DocAttachement_']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadAWDDocs($(this).attr("id"), "DocName");
        });
    });
}

function ReBindAttachement(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_master_awddocs']").find("[id^='areaTrans_master_awddocs']").each(function () {
        $(this).find("input[id^='DocName']").unbind("change").bind("change", function () {
            UploadAWDDocs($(this).attr("id"), "DocName");
        });
    });
}

function UploadAWDDocs(objId, nexctrlid) {
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "Handler/UploadImage.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });
}

function DownloadAWDDocs(objId, nexctrlid) {

}

/************* EDOX ************/
function BindEDoxDocTypeAutoCompleteAWD(elem, mainElem) {
    $(elem).find("input[id^='DocType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, null, "contains");
    });

    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
        })
    });

    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEDoxDocumentAWD($(this).attr("id"), "DocName");
        })
    });
}

function ReBindEDoxDocTypeAutoCompleteAWD(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_import_awddocs']").find("[id^='areaTrans_import_awddocs']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEDoxDocumentAWD($(this).attr("id"), "DocName");
        })

        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEDoxDocumentAWD($(this).attr("id"), "DocName");
        })
    });
}

function UploadEDoxDocumentAWD(objId, nexctrlid) {
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();

    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "Handler/FileUploadHandler.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#eDox#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#eDox#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });
}

function DownloadEDoxDocumentAWD(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "Handler/FileUploadHandler.ashx?l=e-Dox&f=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function BindEDox() {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetRecordAtAWBEDox?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            var SPHCDoc = edoxData.Table1;
            var edoxCheckListArray = edoxData.Table2;
            var edoxCheckList = edoxData.Table3;

            cfi.makeTrans("import_edoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray);
            $("div[id$='areaTrans_import_edoxinfo']").find("[id='areaTrans_import_edoxinfo']").each(function () {
                $(this).find("input[id^='DocType']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", ["DocumentName"], ValidateControl, "contains");
                });

                $(this).find("input[id^='DocsName']").each(function () {
                    $(this).unbind("change").bind("change", function () {
                        UploadEDoxDocument($(this).attr("id"), "DocName");
                    })
                });

                $(this).find("a[id^='ahref_DocName']").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        DownloadEDoxDocument($(this).attr("id"), "DocName");
                    })
                });
                $(this).find("input[type='file']").css('width', '');
            });

            var edoxArrayChecklist = edoxCheckListArray.length > 0 ? edoxCheckListArray : edoxCheckList;
            cfi.makeTrans("import_edoxchecklist", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArrayChecklist);
            $("div[id$='areaTrans_import_edoxchecklist']").find("[id='areaTrans_import_edoxchecklist']").each(function () {
                $(this).find("input[id^='EdoxDocType']").each(function () {
                    AutoCompleteForDOHandlingCharge($(this).attr("name"), "Name", null, "SPHCSNo", "Name", null, ValidateControl, null, null, null, null, "GetImportSPHCCheckList", "", currentawbsno, 0, 0, 1, "", "2", "999999999", "No");
                });

                $(this).find("input[id^='EdoxProcessType']").each(function () {
                    cfi.AutoCompleteByDataSource($(this).attr("name"), EdoxProcessDataSource, ValidateControl);
                });

                $(this).find("input[id^='EdoxHAWBNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "SNo", "ImportHAWB", "SNo", "HAWBNo", null, null, "contains");
                });

                $(this).find("input[id^='EdoxDocsName']").each(function () {
                    $(this).unbind("change").bind("change", function () {
                        UploadEDoxDocument($(this).attr("id"), "EdoxDocName");
                    })
                });

                $(this).find("a[id^='ahref_EdoxDocName']").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        DownloadEDoxDocument($(this).attr("id"), "EdoxDocName");
                    })
                });
                $(this).find("input[type='file']").css('width', '');
            });

            $("div[id$='areaTrans_import_edoxchecklist']").find("[id^='areaTrans_import_edoxchecklist']").each(function (i, row) {
                if ($(this).find("input[id^='EdoxDocType']").val() != "" || $(this).find("input[id^='EdoxProcessType']").val() != "") {
                    $(this).find("input[id^='Text_EdoxDocType']").attr("data-valid", "required").attr("data-valid-msg", "Select Edox Doc Type.");
                    $(this).find("input[id^='Text_EdoxProcessType']").attr("data-valid", "required").attr("data-valid-msg", "Select Edox Process Type.");
                }
            });
            $("div[id$='areaTrans_import_sphcedoxinfo']").remove();
        },
        error: {
        }
    });
}

function ValidateControl(valueId, value, keyId, key) {
    if (keyId == "DocType") {
        $("#Text_DocType").attr("data-valid", "required").attr("data-valid-msg", "Select Doc Type.");
    }

    if (keyId.indexOf("EdoxProcessType") > -1) {
        $("#" + valueId).attr("data-valid", "required").attr("data-valid-msg", "Select Edox Process Type.");
        $("#" + valueId.replace("EdoxProcessType", "EdoxDocType")).attr("data-valid", "required").attr("data-valid-msg", "Select Edox Doc Type.");
    }

    if (keyId.indexOf("EdoxDocType") > -1) {
        $("#" + valueId).attr("data-valid", "required").attr("data-valid-msg", "Select Edox Process Type.");
        $("#" + valueId.replace("EdoxDocType", "EdoxProcessType")).attr("data-valid", "required").attr("data-valid-msg", "Select Edox Doc Type.");
    }
}

function BindEDoxDocTypeAutoComplete(elem, mainElem) {
    if ($(elem)[0].id.indexOf("edoxinfo") > -1) {
        $(elem).find("input[id^='DocType']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, ValidateControl, "contains");
        });

        $(elem).find("input[id^='DocsName']").each(function () {
            $(this).unbind("change").bind("change", function () {
                UploadEDoxDocument($(this).attr("id"), "DocName");
            })
        });

        $(elem).find("a[id^='ahref_DocName']").each(function () {
            $(this).unbind("click").bind("click", function () {
                DownloadEDoxDocument($(this).attr("id"), "DocName");
            })
        });
    }

    if ($(elem)[0].id.indexOf("edoxchecklist") > -1) {
        $(elem).find("input[id^='EdoxDocType']").each(function () {
            AutoCompleteForDOHandlingCharge($(this).attr("name"), "Name", null, "SPHCSNo", "Name", null, ValidateControl, null, null, null, null, "GetImportSPHCCheckList", "", currentawbsno, 0, 0, 1, "", "2", "999999999", "No");
        });

        $(elem).find("input[id^='EdoxProcessType']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), EdoxProcessDataSource, ValidateControl);
        });

        $(elem).find("input[id^='EdoxHAWBNo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "SNo", "ImportHAWB", "SNo", "HAWBNo", null, null, "contains");
        });

        $(elem).find("input[id^='EdoxDocsName']").each(function () {
            $(this).unbind("change").bind("change", function () {
                UploadEDoxDocument($(this).attr("id"), "EdoxDocName");
            })
        });

        $(elem).find("a[id^='ahref_EdoxDocName']").each(function () {
            $(this).unbind("click").bind("click", function () {
                DownloadEDoxDocument($(this).attr("id"), "EdoxDocName");
            })
        });
    }
}

function ReBindEDoxDocTypeAutoComplete(elem, mainElem) {
    if ($(elem)[0].id.indexOf("edoxinfo") > -1) {
        $(elem).closest("div[id$='areaTrans_import_edoxinfo']").find("[id^='areaTrans_import_edoxinfo']").each(function () {
            $(this).find("input[id^='DocType']").each(function () {
                var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, ValidateControl, false);
            });

            $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
                UploadEDoxDocument($(this).attr("id"), "DocName");
            })

            $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
                DownloadEDoxDocument($(this).attr("id"), "DocName");
            })
        });
    }

    if ($(elem)[0].id.indexOf("edoxchecklist") > -1) {
        $(elem).closest("div[id$='areaTrans_import_edoxchecklist']").find("[id^='areaTrans_import_edoxchecklist']").each(function () {
            $(elem).find("input[id^='EdoxDocType']").each(function () {
                AutoCompleteForDOHandlingCharge($(this).attr("name"), "Name", null, "SPHCSNo", "Name", null, ValidateControl, null, null, null, null, "GetImportSPHCCheckList", "", currentawbsno, 0, 0, 1, "", "2", "999999999", "No");
            });

            $(elem).find("input[id^='EdoxProcessType']").each(function () {
                cfi.AutoCompleteByDataSource($(this).attr("name"), EdoxProcessDataSource, ValidateControl);
            });

            $(elem).find("input[id^='EdoxHAWBNo']").each(function () {
                cfi.AutoComplete($(this).attr("name"), "SNo", "ImportHAWB", "SNo", "HAWBNo", null, null, "contains");
            });

            $(this).find("input[id^='EdoxDocsName']").unbind("change").bind("change", function () {
                UploadEDoxDocument($(this).attr("id"), "EdoxDocName");
            })

            $(this).find("a[id^='ahref_EdoxDocName']").unbind("click").bind("click", function () {
                DownloadEDoxDocument($(this).attr("id"), "EdoxDocName");
            })
        });
    }
}

function UploadEDoxDocument(objId, nexctrlid) {
    var flag = true;
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();

    if (files['0'].size > 4096000) {
        $("input[type='file']").val(null);
        ShowMessage('info', 'File Upload!', "Document size has exceeded it max limit of 4MB.", "bottom-right");
        flag = false;
        return false
    }

    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }

    if (flag == true) {
        $.ajax({
            url: "Handler/FileUploadHandler.ashx",
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#eDox#')[0]);
                $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#eDox#')[1]);
            },
            error: function (err) {
                ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            }
        });
    }
}

function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "Handler/FileUploadHandler.ashx?l=e-Dox&f=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function DownloadEDoxFromDB(DocSNo, DocFlag) {
    if (parseInt(DocSNo) > 0) {
        window.location.href = "Handler/FileUploadHandler.ashx?ImportDocSNo=" + DocSNo + "&ImportDocFlag=" + DocFlag;
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function SaveEDoxList() {
    if (cfi.IsValidTransSection('divareaTrans_import_edoxchecklist') && cfi.IsValidTransSection('divareaTrans_import_edoxinfo')) {
        var EDoxArray = [];
        var SPHCDoxArray = [];
        var EDoxCheckListArray = [];
        var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
        var Remarks = $("#Remarks").val();
        var edoxFlag = true;
        var edoxChecklistFlag = true;
        var flag = true;
        $("div[id$='areaTrans_import_edoxinfo']").find("[id^='areaTrans_import_edoxinfo']").each(function () {
            var eDoxViewModel = {
                EDoxdocumenttypeSNo: $(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key(),
                DocName: $(this).find("span[id^='DocName']").text(),
                AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
                ReferenceNo: $(this).find("input[id^='Reference']").val(),
                Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
            };
            EDoxArray.push(eDoxViewModel);
        });

        $("div[id$='areaTrans_import_sphcedoxinfo']").find("[id^='areaTrans_import_sphcedoxinfo']").each(function () {
            var SPHCDoxViewModel = {
                SNo: $(this).find("span[id^='uploaddocsno']").text(),
                AWBSNo: currentawbsno,
                SPHCSNo: $(this).find("span[id^='sphcsno']").text(),
                DocName: $(this).find("span[id^='sphcdocname']").text(),
                AltDocName: $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata"),
                Remarks: $(this).find("textarea[id^='sphcdocremarks']").val()
            };
            SPHCDoxArray.push(SPHCDoxViewModel);
        });

        $("div[id$='areaTrans_import_edoxchecklist']").find("[id^='areaTrans_import_edoxchecklist']").each(function () {
            var processType = 0;
            var hawbSNo = 0;
            processType = $(this).find("input[id^='Text_EdoxProcessType']").length > 0 ? ($(this).find("input[id^='Text_EdoxProcessType']").data("kendoAutoComplete").key() == "" ? 0 : $(this).find("input[id^='Text_EdoxProcessType']").data("kendoAutoComplete").key()) : 0;
            hawbSNo = $(this).find("input[id^='Text_EdoxHAWBNo']").data("kendoAutoComplete").key() == "" ? 0 : $(this).find("input[id^='Text_EdoxHAWBNo']").data("kendoAutoComplete").key();
            var eDoxCheckListViewModel = {
                ProcessType: parseInt(processType),
                HAWBSNo: parseInt(hawbSNo),
                EDoxdocumenttypeSNo: $(this).find("input[id^='Text_EdoxDocType']").data("kendoAutoComplete").key(),
                EDoxDocName: $(this).find("span[id^='EdoxDocName']").text(),
                EDoxAltDocName: $(this).find("a[id^='ahref_EdoxDocName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_EdoxDocName']").attr("linkdata"),
                EDoxReferenceNo: $(this).find("input[id^='EdoxReference']").val(),
                EDoxRemarks: $(this).find("textarea[id^='EdoxDoc_Remarks']").val()
            };
            EDoxCheckListArray.push(eDoxCheckListViewModel);
        });

        for (var i = 0; i < EDoxArray.length; i++) {
            if (EDoxArray[i].EDoxdocumenttypeSNo == "")
                edoxFlag = false;
        }

        for (var i = 0; i < EDoxCheckListArray.length; i++) {
            if (EDoxCheckListArray[i].ProcessType == "")
                edoxChecklistFlag = false;
        }

        if (edoxFlag == false && edoxChecklistFlag == false) {
            ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + CurrentAWBNo + "] -  Select checklist Doc Type or Process Type.", "bottom-right");
            flag = false;
            return false;
        }

        if (edoxFlag == true) {
            $("div[id$='areaTrans_import_edoxinfo']").find("[id^='areaTrans_import_edoxinfo']").each(function (i, row) {
                if ($(this).find("input[id^='DocType']").val() != "" && $(this).find("a[id^='ahref_DocName']").attr("linkdata") == "") {
                    ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + CurrentAWBNo + "] -  Doc Type Attachment not found.", "bottom-right");
                    flag = false;
                    return false;
                }
            });
        }

        if (edoxChecklistFlag == true) {
            $("div[id$='areaTrans_import_edoxchecklist']").find("[id^='areaTrans_import_edoxchecklist']").each(function (i, row) {
                if (($(this).find("input[id^='EdoxDocType']").val() != "" || $(this).find("input[id^='EdoxProcessType']").val() != "") && $(this).find("a[id^='ahref_EdoxDocName']").attr("linkdata") == "") {
                    ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + CurrentAWBNo + "] -  Checklist Attachment not found.", "bottom-right");
                    flag = false;
                    return false;
                }
            });
        }

        if (flag == true) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/SaveAWBEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ AWBSNo: parseInt(currentawbsno), ArrivedShipmentSNo: parseInt(currentArrivedShipmentSNo), AWBEDoxDetail: EDoxArray, SPHCDoxArray: SPHCDoxArray, AllEDoxReceived: AllEDoxReceived, Remarks: Remarks, EDoxCheckListDetail: EDoxCheckListArray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success - e-Dox Information', "AWB No. [" + CurrentAWBNo + "] -  Saved Successfully", "bottom-right");
                        flag = true;
                    }
                    else
                        ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                },
                complete: function (xhr) {
                    $("div[id$='areaTrans_import_sphcedoxinfo']").find("[id^='areaTrans_import_sphcedoxinfo']").each(function () {
                        $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata", '');
                    });
                }
            });
        }
        return flag;
    }
}