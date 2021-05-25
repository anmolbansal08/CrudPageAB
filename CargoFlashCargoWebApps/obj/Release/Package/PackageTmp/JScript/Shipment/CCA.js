/// <reference path="../../Scripts/references.js" />

//var DueAgentId = '';
//var DueCarrierId = '';
//var ViewAgentCarrier = '';

//var ArrayList = [];
//var valRevisedFreightType = '';
//var valOriginalFreightType = '';

//var CCADueAgentData = new Array();
//var CCADueCarrierData = new Array();
//var CCAOtherChargeData = new Array();

var PageType = "";

var Approve = "";
var Request = "";
var LoginType = "";



function fn_OnCCASuccessGrid(e) {
    $('table tr td[data-column="SNo"] span').text('');

    var LengthGrid = $('[id*="faction"]').length;
    var Status = '';
    for (var i = 0; i < LengthGrid ; i++) {
        $('table tr td[data-column="SNo"] span:eq(' + i + ')').text('');
        Status = $('table tr td[data-column="Status"] span:eq(' + i + ')').text();
        if (Status == "Approved" || Status == "Rejected") {
            $('table tr td[data-column="SNo"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="Print" class="btn btn-success" onclick="RenderPrintCCA(this.id);" />')
        }
    }

}

function RenderPrintCCA(CCANo) {
    if (CCANo > 0)
        window.open("HtmlFiles/CCA/PrintCCA.html?CCANo=" + CCANo);
    else
        jAlert("CCANo not generated");
}

$(function () {

    PageType = getQueryStringValue("FormAction").toUpperCase();
    Approve = userContext.SysSetting.ApproveCCA.split(',');
    LoginType = userContext.GroupName.toUpperCase();
    Request = userContext.SysSetting.RequestCCA.split(',');

    if (!Request.includes(LoginType)) {
        $('input[type="button"][value=New CCA]').hide();
    }

    if (PageType == "NEW") {
        $.ajax({
            url: 'HtmlFiles/CCA/CCA.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);
                LoadJS();
                $("#PrintDiv").hide();
                $("#ApprovedPanel").hide();
                $("#ApprovedPanelRemarks").hide();
                $('input[type="radio"][value=Pending]').attr('checked', true);
            }
        });



    } else if (PageType == "EDIT") {


        $.ajax({
            url: 'HtmlFiles/CCA/CCA.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);

                LoadJS();
                UpdateCCAAWbRecord();


                if (Approve.includes(LoginType)) {
                    $('#Text_RevisedWeightUnit').attr('disabled', 'disabled');
                    $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
                    $('#Text_RevisedPieces').attr('disabled', 'disabled');
                    $('#Text_RevisedVolume').attr('disabled', 'disabled');
                    $('#Text_RevisedPrepaidWeightCharges').attr('disabled', 'disabled');
                    $('#Text_RevisedPrepaidValuationCharges').attr('disabled', 'disabled');
                    $('#Text_RevisedPrepaidTax').attr('disabled', 'disabled');
                    $('#Text_RevisedPrepaidTotal').attr('disabled', 'disabled');
                    $("#ApprovedPanel").show();
                    $("#ApprovedPanelRemarks").show();
                    $('input[type="radio"][value=Approved]').attr('checked', true)
                    $('#Text_RevisedChargeableWeight').attr('disabled', 'disabled');
                    $('#tblAWBRateOtherCharge_btnAppendRow').css('visibility', 'hidden');
                    $('input[type="radio"][value=Pending]').attr('disabled', 'disabled');




                    $('input[type="checkbox"][name=WEIGHTDISCREP]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=VOLUMEDISCREP]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=CNEECHANGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=DESTCHANGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=RATEERROR]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=CCACHARGE]').attr('disabled', 'disabled');

                    $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
                    $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
                    $('#Text_SHCSNo').data("kendoAutoComplete").enable(false);
                    $('#divMultiSHCSNo').find('span').removeClass("k-icon k-delete");

                }

                else {
                    $("#ApprovedPanel").hide();
                    $("#ApprovedPanelRemarks").hide();
                    $('input[type="radio"][value=Pending]').attr('checked', true)

                }
                if ($("span#Status").text() == 'Approved') {
                    $('input[type="submit"][value=Save]').attr('style', 'display:none')
                    $('input[type="submit"][value=Back]').removeAttr('style', 'display:none')
                    $('input[type="button"][value=Print]').removeAttr('style', 'display:none')
                    $('input[type="submit"][value=Approve]').attr('style', 'display:none')
                    $('input[type="submit"][value=Delete]').attr('style', 'display:none')
                    $('input[type="submit"][value=Update]').attr('style', 'display:none')
                    $('#SearchSection').attr('style', 'display:none');
                    $('#DisplayButtonUpdate').removeAttr('style', 'display:none')
                    $("#ApprovedPanel").hide();
                    $("#ApprovedPanelRemarks").hide();



                    ShowMessage('warning', 'warning - CCA', "Already Approved By Admin , cannot be added !");
                }
                if ($("span#Status").text() == 'Rejected') {
                    $('input[type="submit"][value=Save]').attr('style', 'display:none')
                    $('input[type="submit"][value=Back]').removeAttr('style', 'display:none')
                    $('input[type="button"][value=Print]').removeAttr('style', 'display:none')
                    $('input[type="submit"][value=Approve]').attr('style', 'display:none')
                    $('input[type="submit"][value=Delete]').attr('style', 'display:none')
                    $('input[type="submit"][value=Update]').attr('style', 'display:none')
                    $('#SearchSection').attr('style', 'display:none');
                    $('#DisplayButtonUpdate').removeAttr('style', 'display:none')
                    $("#ApprovedPanel").hide();
                    $("#ApprovedPanelRemarks").hide();
                    ShowMessage('warning', 'warning - CCA', "Already Rejected By Admin , cannot be added !");
                }

            }
        });

    }
    else if (PageType == "READ") {


        $.ajax({
            url: 'HtmlFiles/CCA/CCA.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);
                //InstantiateControl("htmldivdetails");
                LoadJS();
                UpdateCCAAWbRecord();
                $('#Text_RevisedWeightUnit').attr('disabled', 'disabled');
                $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
                $('#Text_RevisedPieces').attr('disabled', 'disabled');
                $('#Text_RevisedVolume').attr('disabled', 'disabled');
                $('#Text_RevisedPrepaidWeightCharges').attr('disabled', 'disabled');
                $('#Text_RevisedPrepaidValuationCharges').attr('disabled', 'disabled');
                $('#Text_RevisedPrepaidTax').attr('disabled', 'disabled');
                $('#Text_RevisedPrepaidTotal').attr('disabled', 'disabled');
                $("#ApprovedPanel").show();
                $("#ApprovedPanelRemarks").show();
                $('input[type="radio"][value=Approved]').attr('checked', true)
                $('#Text_RevisedChargeableWeight').attr('disabled', 'disabled');
                $('#tblAWBRateOtherCharge_btnAppendRow').css('visibility', 'hidden');
                $("#ApprovedPanel").hide();
                $("#ApprovedPanelRemarks").hide();
                $('input[type="checkbox"][name=WEIGHTDISCREP]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=VOLUMEDISCREP]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=CNEECHANGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=DESTCHANGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=RATEERROR]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=CCACHARGE]').attr('disabled', 'disabled');


                $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
                $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
                $('#Text_SHCSNo').data("kendoAutoComplete").enable(false);
                $('#divMultiSHCSNo').find('span').removeClass("k-icon k-delete");
            }
        });
    }

    else if (PageType == "DELETE") {


        $.ajax({
            url: 'HtmlFiles/CCA/CCA.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);
                //InstantiateControl("htmldivdetails");
                LoadJS();
                UpdateCCAAWbRecord();
                $('#Text_RevisedWeightUnit').attr('disabled', 'disabled');
                $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
                $('#Text_RevisedPieces').attr('disabled', 'disabled');
                $('#Text_RevisedVolume').attr('disabled', 'disabled');
                $('#Text_RevisedPrepaidWeightCharges').attr('disabled', 'disabled');
                $('#Text_RevisedPrepaidValuationCharges').attr('disabled', 'disabled');
                $('#Text_RevisedPrepaidTax').attr('disabled', 'disabled');
                $('#Text_RevisedPrepaidTotal').attr('disabled', 'disabled');
                $("#ApprovedPanel").show();
                $("#ApprovedPanelRemarks").show();
                $('input[type="radio"][value=Approved]').attr('checked', true)
                $('#Text_RevisedChargeableWeight').attr('disabled', 'disabled');
                $('#tblAWBRateOtherCharge_btnAppendRow').css('visibility', 'hidden');
                $("#ApprovedPanel").hide();
                $("#ApprovedPanelRemarks").hide();
                $('input[type="checkbox"][name=WEIGHTDISCREP]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=VOLUMEDISCREP]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=CNEECHANGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=DESTCHANGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=RATEERROR]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=CCACHARGE]').attr('disabled', 'disabled');
            }
        });
    }


});
function LoadJS() {
    cfi.AutoComplete("AWBSNo", "AWBNo", "GetAWBNO", "SNo", "AWBNo", ["AWBNo"], null, "contains");

    cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoComplete("ProductSNo", "ProductName", "Product", "SNo", "ProductName", null, null, "contains");
    cfi.AutoComplete("SHCSNo", "Code,Description", "SPHC", "SNo", "Code@", ["Code", "Description"], null, "contains", ",");





    cfi.AutoComplete("OriginalCommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoComplete("OriginalProductSNo", "ProductName", "Product", "SNo", "ProductName", null, null, "contains");
    cfi.AutoComplete("OriginalSHCSNo", "Code,Description", "SPHC", "SNo", "Code@", ["Code", "Description"], null, "contains", ",");
    $('#Text_OriginalProductSNo').data("kendoAutoComplete").enable(false);
    $('#Text_OriginalCommoditySNo').data("kendoAutoComplete").enable(false);
    $('#Text_OriginalSHCSNo').data("kendoAutoComplete").enable(false);



    $('#Text_RevisedGrossWeight').blur(function () {

        var key = event.which;

        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {

            ShowMessage('warning', 'warning - CCA', "Gross Weight Should Not be Zero or Less than Zero.");

            $("#Text_RevisedGrossWeight").val('');
            return false;
        }
        else {
            var grwt = $('#Text_RevisedGrossWeight').val();

            $('#Text_RevisedGrossWeight').val(parseFloat(grwt).toFixed(2));
            if ($('#Text_RevisedGrossWeight').val() == "NaN") {
                $("#Text_RevisedGrossWeight").val('');
            }
        }

        if (this.value > ($('#Text_RevisedVolume').val() * 166.67)) {

            var CWweight = $('#Text_RevisedGrossWeight').val();

            var vlwt = Math.abs(CWweight).toFixed(2);

            $("#Text_RevisedChargeableWeight").val(parseFloat(vlwt).toFixed(2));



            return false;
        } else {
            var CWweight = $('#Text_RevisedVolume').val();

            var vlwt = Math.abs(CWweight * 166.67).toFixed(2);

            $("#Text_RevisedChargeableWeight").val(parseFloat(vlwt).toFixed(2));



            return false;
        }

    });
    $('#Text_RevisedVolume').blur(function () {


        var key = event.which;

        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((this.value <= 0.000) || (this.value <= 0)) {

            ShowMessage('warning', 'warning - CCA', "Volume  Should Not be Zero or Less than Zero.");

            $("#Text_RevisedVolume").val('');
            return false;
        }
        else {
            var grwt = $('#Text_RevisedVolume').val();

            $('#Text_RevisedVolume').val(parseFloat(grwt).toFixed(3));
            if ($('#Text_RevisedVolume').val() == "NaN") {
                $("#Text_RevisedVolume").val('');
            }
        }


        if ((this.value * 166.67) > ($('#Text_RevisedGrossWeight').val())) {
            var vlweight = $('#Text_RevisedVolume').val();

            var vlwt = Math.abs((vlweight * 166.67).toFixed(2));

            $("#Text_RevisedChargeableWeight").val(parseFloat(vlwt).toFixed(2));
            return false;
        } else {
            var vlweight = $('#Text_RevisedGrossWeight').val();

            var vlwt = Math.abs(vlweight).toFixed(2);

            $("#Text_RevisedChargeableWeight").val(parseFloat(vlwt).toFixed(2));
            return false;
        }

    });
    $('#Text_RevisedPieces').blur(function () {



        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {

            ShowMessage('warning', 'warning - CCA', "Pieces  Should Not be Zero or Less than Zero.");

            $("#Text_RevisedPieces").val('');
            return false;
        }

    });
    $('#Text_RevisedPieces').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }

    });



    $('input[type="submit"][value=Save]').attr('style', 'display:none')

    $('input[type="button"][value=Print]').attr('style', 'display:none')
    $('input[type="submit"][value=Update]').attr('style', 'display:none')

}

function GetCCADATA() {

    $('#RequestAndApproveBy').hide();
    $('#CCAGeneratedRow').hide();
    var AwbSno;
    var PageType = getQueryStringValue("FormAction").toUpperCase();

    AwbSno = $("#AWBSNo").val();
    if (AwbSno == "") {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter AWB NO.", "bottom-left");
        return false;

    }


    if (AwbSno != "") {
        $.ajax({
            url: "Services/Shipment/CCAService.svc/GetCCAData", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AwbSno: AwbSno }),
            success: function (result) {

                var GetSucessResult = JSON.parse(result);
                if (GetSucessResult != undefined) {

                    if (GetSucessResult.Table0.length > 0) {
                        $("#PrintDiv").show();
                        $("span#AWBNO").text(GetSucessResult.Table0[0].AwbNo);
                        $("span#Origin").text(GetSucessResult.Table0[0].Origin);
                        $("#OriginSNo").val(GetSucessResult.Table0[0].OriginSNo);
                        $("#DestinationSNo").val(GetSucessResult.Table0[0].DestinationSNo);
                        $("span#Destination").text(GetSucessResult.Table0[0].Destination);
                        $("span#DateOfAwbIssue").text(GetSucessResult.Table0[0].DateofAWBissue);
                        $("span#PlaceOfAwbIssue").text(GetSucessResult.Table0[0].PlaceofAWBIssue);
                        $("span#NameAndCity").text(GetSucessResult.Table0[0].AgentName + '/' + GetSucessResult.Table0[0].AgentCity);
                        $('#AgentCode').text(GetSucessResult.Table0[0].AgentCode);
                        //$("#Text_RevisedWeightUnit").val(GetSucessResult.Table0[0].RevisedWeightUnit);
                        //$("span#hdn_OriginalWeightUnit").text(GetSucessResult.Table0[0].OriginalWeightUnit);

                        $("#Text_RevisedGrossWeight").val(GetSucessResult.Table0[0].RevisedGrossWeight)
                        $("span#hdn_OriginalGrossWeight").text(GetSucessResult.Table0[0].OriginalGrossWeight)

                        $("#Text_RevisedPieces").val(GetSucessResult.Table0[0].RevisedPieces)
                        $("span#hdn_OriginalPieces").text(GetSucessResult.Table0[0].OriginalPieces)

                        $("#Text_RevisedVolume").val(GetSucessResult.Table0[0].RevisedVolume)
                        $("span#hdn_OriginalVolume").text(GetSucessResult.Table0[0].OriginalVolume)

                        $("#Text_RevisedChargeableWeight").val(GetSucessResult.Table0[0].RevisedChargeableWeight);
                        $("span#hdn_OriginalChargeableWeight").text(GetSucessResult.Table0[0].OriginalChargeableWeight);


                        valRevisedFreightType = 'P';
                        valOriginalFreightType = 'P';

                        //---------------Weight Charges

                        $("span#Text_RevisedPrepaidWeightCharges").text(GetSucessResult.Table0[0].RevisedPrepaidWeightCharges);
                        $('#Text_RevisedCollectWeightCharges').text(GetSucessResult.Table0[0].Text_RevisedCollectWeightCharges);
                        $("span#hdn_OriginalPrepaidWeightCharges").text(GetSucessResult.Table0[0].OriginalPrepaidWeightCharges);

                        //---------------Valuation Charges
                        $("#Text_RevisedPrepaidValuationCharges").text(GetSucessResult.Table0[0].RevisedPrepaidValuationCharges);
                        //$('#Text_RevisedCollectValuationCharges').hide();
                        $("span#hdn_OriginalPrepaidValuationCharges").text(GetSucessResult.Table0[0].OriginalPrepaidValuationCharges);

                        //---------------Tax
                        $("#Text_RevisedPrepaidTax").text(GetSucessResult.Table0[0].RevisedPrepaidTax);
                        //$('#Text_RevisedCollectTax').hide();
                        $("span#hdn_OriginalPrepaidTax").text(GetSucessResult.Table0[0].OriginalPrepaidTax);


                        //---------------Due Agent
                        $("span#Text_RevisedPrepaidDueAgent").text(GetSucessResult.Table0[0].RevisedPrepaidDueAgent);
                        //$('span#Text_RevisedCollectDueAgent').hide();
                        $("span#hdn_OriginalPrepaidDueAgent").text(GetSucessResult.Table0[0].OriginalPrepaidDueAgent);

                        //---------------Due Carrier
                        $("span#Text_RevisedPrepaidDueCarrier").text(GetSucessResult.Table0[0].RevisedPrepaidDueCarrier);
                        //$('span#Text_RevisedCollectDueCarrier').hide();
                        $("span#hdn_OriginalPrepaidDueCarrier").text(GetSucessResult.Table0[0].OriginalPrepaidDueCarrier);

                        //---------------Total
                        $("#Text_RevisedPrepaidTotal").text(GetSucessResult.Table0[0].RevisedPrepaidTotal);
                        //$('#Text_RevisedCollectTotal').hide();
                        $("span#hdn_OriginalPrepaidTotal").text(GetSucessResult.Table0[0].OriginalPrepaidTotal);


                        ////Span 
                        $('#OriginalCommoditySNo').val(GetSucessResult.Table0[0].CommoditySNo);
                        $('#Text_OriginalCommoditySNo').val(GetSucessResult.Table0[0].Text_CommoditySNo);
                        //$("#OriginalSHCSNo").val();
                        //$("#Text_OriginalSHCSNo").val();

                        $('#divMultiOriginalSHCSNo ul li span').not('span[id="FieldKeyValuesOriginalSHCSNo"]').click();
                        $('#divMultiSHCSNo ul li span').not('span[id="FieldKeyValuesSHCSNo"]').click();
                        var SHC = GetSucessResult.Table0[0].SHCSNo.substring(0, GetSucessResult.Table0[0].SHCSNo.length - 1);
                        $('#OriginalSHCSNo').val(SHC);
                        var Text_SHC = GetSucessResult.Table0[0].Text_SHCSNo.substring(0, GetSucessResult.Table0[0].Text_SHCSNo.length - 1);
                        $('#Text_OriginalSHCSNo').val(Text_SHC);
                        $('#OriginalProductSNo').val(GetSucessResult.Table0[0].ProductSNo);
                        $('#Text_OriginalProductSNo').val(GetSucessResult.Table0[0].Text_ProductSNo);
                       
                        cfi.BindMultiValue("OriginalSHCSNo", $("#Text_OriginalSHCSNo").val(), $("#OriginalSHCSNo").val());
                        

                        $("span#Shipper").text(GetSucessResult.Table0[0].Shipper);
                        $("span#Consignee").text(GetSucessResult.Table0[0].Consignee);

                        $("span#Status").text('Request');

                        $("span#CurrencyCode").text(GetSucessResult.Table0[0].CurrencyCode);
                        $('#divMultiOriginalSHCSNo').find('span').removeClass("k-icon k-delete");


                        //Flight Details
                        if (GetSucessResult.Table1.length > 0) {

                            for (var i = 1; i <= GetSucessResult.Table1.length; i++) {
                                $("span#To" + i + "").text(GetSucessResult.Table1[i - 1].Origin);
                                $("span#FlightNo" + i + "").text(GetSucessResult.Table1[i - 1].FlightNo);
                                $("span#Date" + i + "").text(GetSucessResult.Table1[i - 1].FlightDate);
                            }

                        }


                        $('input[type="submit"][value=Save]').removeAttr('style', 'display:none')
                        $('input[type="button"][value=Print]').removeAttr('style', 'display:none')
                        $('input[type="submit"][value=Update]').attr('style', 'display:none')
                        //$('#Text_RevisedWeightUnit').attr('disabled', 'disabled');
                        //$('#Text_RevisedPrepaidWeightCharges').attr('disabled', 'disabled');
                        //$('#Text_RevisedPrepaidValuationCharges').attr('disabled', 'disabled')
                        //$('#Text_RevisedPrepaidTax').attr('disabled', 'disabled')
                        //$('#Text_RevisedPrepaidTotal').attr('disabled', 'disabled')

                    }
                    else {
                        ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                    }
                }

                else {
                    ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                }
            }
        });
    }
}

function SaveCCA() {



    if ($("input[type='checkbox'][class='CCAReason']:checked").val() == undefined || $("input[type='checkbox'][class='CCAReason']:checked").val() == "") {
        ShowMessage('warning', 'CCA - CARGO CHARGES CORRECTION ADVICE ', "Atleast one reason for creating the CCA has to be selected from  the checklist !");
        return false;
    }


    if ($('#Text_Remarks').val() == "" || $('#Text_Remarks').val() == undefined) {
        $('#Text_Remarks').focus()
        ShowMessage('warning', 'CCA - CARGO CHARGES CORRECTION ADVICE', "Remarks Can not be blank !");
        return false;
    }

    if (PageType == "EDIT") {
        if ($('#Text_RemarksApproved').val() == "" || $('#Text_RemarksApproved').val() == undefined) {
            $('#Text_RemarksApproved').focus()
            ShowMessage('warning', 'CCA - CARGO CHARGES CORRECTION ADVICE', "Remarks Can not be blank !");
            return false;
        }

    }
    var RequestType = $('input[type="radio"][name=Group]:checked').val();
    if (RequestType == 'Pending') {
        RequestType = '0'
    }
    else if (RequestType == 'Approved') {
        RequestType = '1'
    }
    else if (RequestType == "Reject") {
        RequestType = '2'
    }







    var CCAInList = [];
    var Array = {
        AWBSNo: $("#AWBSNo").val(),
        AWBNo: $("span#AWBNO").html(),
        Origin: $("#OriginSNo").val(),
        Destination: $("#DestinationSNo").val(),
        //public string CCANo { get; set; }
        CCARemarks: $("#Text_Remarks").val() == '' ? '' : $("#Text_Remarks").val(),
        RevisedFreightType: valRevisedFreightType,
        OriginalFreightType: valOriginalFreightType,
        RevisedPWeightCharges: $("#Text_RevisedPrepaidWeightCharges").html() == '' ? '0' : $("#Text_RevisedPrepaidWeightCharges").html(),
        OriginalPWeightCharges: $("span#hdn_OriginalPrepaidWeightCharges").html() == '' ? '0' : $("span#hdn_OriginalPrepaidWeightCharges").html(),
        RevisedCWeightCharges: $('#Text_RevisedCollectWeightCharges').html() == '' ? '0' : $('#Text_RevisedCollectWeightCharges').val(),
        OriginalCWeightCharges: $("span#hdn_OriginalCollectWeightCharges").html() == '' ? '0' : $("span#hdn_OriginalCollectWeightCharges").html(),

        RevisedPValuationCharges: $("#Text_RevisedPrepaidValuationCharges").val() == '' ? '0' : $("#Text_RevisedPrepaidValuationCharges").val(),
        OriginalPValuationCharges: $("span#hdn_OriginalPrepaidValuationCharges").html() == '' ? '0' : $("span#hdn_OriginalPrepaidValuationCharges").html(),
        RevisedCValuationCharges: $('#Text_RevisedCollectValuationCharges').val() == '' ? '0' : $('#Text_RevisedCollectValuationCharges').val(),
        OriginalCValuationCharges: $("span#hdn_OriginalCollectValuationCharges").html() == '' ? '0' : $("span#hdn_OriginalCollectValuationCharges").html(),

        RevisedPTax: $("#Text_RevisedPrepaidTax").val() == '' ? '0' : $("#Text_RevisedPrepaidTax").val(),
        OriginalPTax: $("span#hdn_OriginalPrepaidTax").html() == '' ? '0' : $("span#hdn_OriginalPrepaidTax").html(),
        RevisedCTax: $('#Text_RevisedCollectTax').val() == '' ? '0' : $('#Text_RevisedCollectTax').val(),
        OriginalCTax: $("span#hdn_OriginalCollectTax").html() == '' ? '0' : $("span#hdn_OriginalCollectTax").html(),

        RevisedPDueAgentCharges: $("span#Text_RevisedPrepaidDueAgent").html() == '' ? '0' : $("span#Text_RevisedPrepaidDueAgent").html(),
        RevisedCDueAgentCharges: $('span#Text_RevisedCollectDueAgent').html() == '' ? '0' : $('span#Text_RevisedCollectDueAgent').html(),
        OriginalPDueAgentCharges: $("span#hdn_OriginalPrepaidDueAgent").html() == '' ? '0' : $("span#hdn_OriginalPrepaidDueAgent").html(),
        OriginalCDueAgentCharges: $("span#hdn_OriginalCollectDueAgent").html() == '' ? '0' : $("span#hdn_OriginalCollectDueAgent").html(),

        RevisedPDueCarrierCharges: $("span#Text_RevisedPrepaidDueCarrier").html() == '' ? '0' : $("span#Text_RevisedPrepaidDueCarrier").html(),
        RevisedCDueCarrierCharges: $('span#Text_RevisedCollectDueCarrier').html() == '' ? '0' : $('span#Text_RevisedCollectDueCarrier').html(),
        OriginalPDueCarrierCharges: $("span#hdn_OriginalPrepaidDueCarrier").html() == '' ? '0' : $("span#hdn_OriginalPrepaidDueCarrier").html(),
        OriginalCDueCarrierCharges: $("span#hdn_OriginalCollectDueCarrier").html() == '' ? '0' : $("span#hdn_OriginalCollectDueCarrier").html(),
        //public string RevisedCCFee { get; set; }
        //public string OriginalCCFee { get; set; }
        RevisedPTotalCharges: $("#Text_RevisedPrepaidTotal").val() == '' ? '0' : $("#Text_RevisedPrepaidTotal").val(),
        RevisedCTotalCharges: $('#Text_RevisedCollectTotal').val() == '' ? '0' : $('#Text_RevisedCollectTotal').val(),
        OriginalPTotalCharges: $("span#hdn_OriginalPrepaidTotal").html() == '' ? '0' : $("span#hdn_OriginalPrepaidTotal").html(),
        OriginalCTotalCharges: $("span#hdn_OriginalCollectTotal").html() == '' ? '0' : $("span#hdn_OriginalCollectTotal").html(),
        CurrencyCode: $("span#CurrencyCode").text(),
        IsApproved: RequestType,
        //public string ShowCCA { get; set; }
        ApprovedRemarks: $('#Text_RemarksApproved').val() == '' ? '' : $('#Text_RemarksApproved').val(),
        CreatedBy: userContext.UserSNo,
        CreatedDate: GetUserLocalTime("MM/dd/yyyy"),
        // ApprovedBy: '',
        ApprovedDate: GetUserLocalTime("MM/dd/yyyy"),
        RevisedPieces: $("#Text_RevisedPieces").val() == '' ? '0' : $("#Text_RevisedPieces").val(),
        OriginalPieces: $("span#hdn_OriginalPieces").html() == '' ? '0' : $("span#hdn_OriginalPieces").html(),

        RevisedGrossWeight: $("#Text_RevisedGrossWeight").val() == '' ? '0' : $("#Text_RevisedGrossWeight").val(),
        OriginalGrossWeight: $("span#hdn_OriginalGrossWeight").html() == '' ? '0' : $("span#hdn_OriginalGrossWeight").html(),
        AccountSno: userContext.AgentSNo,
        RevisedWeightUnit: $("#Text_RevisedWeightUnit").val() == '' ? '0' : $("#Text_RevisedWeightUnit").val(),
        OriginalWeightUnit: $("span#hdn_OriginalWeightUnit").html() == '' ? '0' : $("span#hdn_OriginalWeightUnit").html(),
        RevisedVolume: $("#Text_RevisedVolume").val() == '' ? '0' : $("#Text_RevisedVolume").val(),
        OriginalVolume: $("span#hdn_OriginalVolume").html() == '' ? '0' : $("span#hdn_OriginalVolume").html(),
        RevisedChargeableWeight: $("#Text_RevisedChargeableWeight").val(),
        OriginalChargeableWeight: $("span#hdn_OriginalChargeableWeight").html(),
        shipper: $("span#Shipper").html(),
        Consignee: $("span#Consignee").html(),
        ISWEIGHTDISCREP: $('input[type="checkbox"][name=WEIGHTDISCREP]:checked').val() == undefined ? '0' : '1',
        ISVOLUMEDISCREP: $('input[type="checkbox"][name=VOLUMEDISCREP]:checked').val() == undefined ? '0' : '1',
        ISCNEECHANGE: $('input[type="checkbox"][name=CNEECHANGE]:checked').val() == undefined ? '0' : '1',
        ISDESTCHANGE: $('input[type="checkbox"][name=DESTCHANGE]:checked').val() == undefined ? '0' : '1',
        ISRATEERROR: $('input[type="checkbox"][name=RATEERROR]:checked').val() == undefined ? '0' : '1',
        ISCCACHARGE: $('input[type="checkbox"][name=CCACHARGE]:checked').val() == undefined ? '0' : '1',
        RevisedCommoditySNo: $('#CommoditySNo').val() == '' ? '0' : $('#CommoditySNo').val(),
        OriginalCommoditySNo: $('#OriginalCommoditySNo').val() == '' ? '0' : $('#OriginalCommoditySNo').val(),
        RevisedSHCSNo: $('#SHCSNo').val() == '' ? '0' : $('#SHCSNo').val(),
        OriginalSHCSNo: $('#OriginalSHCSNo').val() == '' ? '0' : $('#OriginalSHCSNo').val(),
        RevisedProductSNo: $('#ProductSNo').val() == '' ? '0' : $('#ProductSNo').val(),
        OriginalProductSNo: $('#OriginalProductSNo').val() == '' ? '0' : $('#OriginalProductSNo').val()
    };

    CCAInList.push(Array);
    var AwbSno = "";
    if (PageType == "NEW") {

        AwbSno = $("#AWBSNo").val();
        if (AwbSno == "") {
            ShowMessage('info', 'Need your Kind Attention!', "Please enter AWB NO.", "bottom-left");
            return false;
        }
    }
    else {
        AwbSno = $("#hdnAWBSNo").val();
    }




    var ActionType = getQueryStringValue("FormAction").toUpperCase()
    var ApproveType = Approve;
    var SNo = $('#hdnCCASNo').val();
    if (AwbSno != "") {

        $.ajax({
            url: "Services/Shipment/CCAService.svc/SaveCCA", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ SNo: SNo, SaveCCA: CCAInList, ActionType: ActionType, ApproveType: ApproveType }),
            success: function (result) {


                //var GetSucessResult = JSON.parse(result).Table0[0].Column1;

                if (PageType != "EDIT") {
                    if (JSON.parse(result).Table[0].Column1 == 0) {
                        setTimeout(function () {
                            navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                        }, 2000);
                        ShowMessage('success', 'Success - CCA !', "CCA Save Successfully");

                    }
                    if (JSON.parse(result).Table[0].Column1 == 2000) {
                        setTimeout(function () {
                            navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                        }, 2000);
                        ShowMessage('success', 'Success - CCA !', "CCA Delete Successfully");

                    }
                } else {

                    //if (userContext.GroupName.toUpperCase() == "ADMIN") {
                    if (Approve.includes(LoginType)) {

                        if ($('input[type="radio"][name=Group]:checked').val() == 'Approved') {
                            if (JSON.parse(result).Table3.length > 0 && JSON.parse(result).Table3[0].Column1 == 1000) {
                                setTimeout(function () {
                                    navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                                }, 2000);
                                ShowMessage('success', 'Success - CCA !', "CCA Approved Successfully");

                            }

                            if (JSON.parse(result).Table2.length > 0 && JSON.parse(result).Table2[0].Column1 == 1000) {
                                setTimeout(function () {
                                    navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                                }, 2000);
                                ShowMessage('success', 'Success - CCA !', "CCA Approved Successfully");

                            }
                        } else if ($('input[type="radio"][name=Group]:checked').val() == 'Reject') {
                            if (JSON.parse(result).Table.length > 0 && JSON.parse(result).Table[0].Column1 == 5000) {
                                setTimeout(function () {
                                    navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                                }, 2000);
                                ShowMessage('success', 'Success - CCA !', "CCA Rejected Successfully");

                            }
                        }
                    }
                    else {

                        if ($('input[type="radio"][name=Group]:checked').val() == 'Pending') {
                            if (JSON.parse(result).Table.length > 0 && JSON.parse(result).Table[0].Column1 == 1000) {
                                setTimeout(function () {
                                    navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                                }, 2000);
                                ShowMessage('success', 'Success - CCA !', "CCA update Successfully");
                            }
                        }
                    }
                }
            }
        });
    }

}


//----------------------------Start Calculate Due Agent ----------------




//-------------------------END Due Carrier-------------------------------------






function ExtraCondition(textId) {

    if (textId.indexOf("Text_AWBSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "STATUS", "eq", "RCS");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }




}



function UpdateCCAAWbRecord() {
    var SNo;
    var PageType = getQueryStringValue("FormAction").toUpperCase();
    if (PageType == "EDIT" || PageType == "READ" || PageType == "DELETE") {
        SNo = getQueryStringValue("RecID").toUpperCase()
        $('#SearchSection').hide();
    }
    else {

        if (SNo == "") {
            ShowMessage('info', 'Need your Kind Attention!', "Please enter AWB NO.", "bottom-left");
            return false;
        }
    }


    if (SNo != "") {
        $.ajax({
            url: "Services/Shipment/CCAService.svc/UpdateCCAAWbRecord", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ SNo: SNo }),
            success: function (result) {

                var GetSucessResult = JSON.parse(result);
                if (GetSucessResult != undefined) {

                    if (GetSucessResult.Table0.length > 0) {
                        $('#hdnAWBSNo').val(GetSucessResult.Table0[0].AWBSNo)
                        $("span#AWBNO").text(GetSucessResult.Table0[0].AwbNo);
                        $("span#Origin").text(GetSucessResult.Table0[0].Origin);
                        $("span#Destination").text(GetSucessResult.Table0[0].Destination);
                        $("span#DateOfAwbIssue").text(GetSucessResult.Table0[0].DateofAWBissue);
                        $("span#PlaceOfAwbIssue").text(GetSucessResult.Table0[0].PlaceofAWBIssue);
                        $("span#NameAndCity").text(GetSucessResult.Table0[0].AgentName + ' / ' + GetSucessResult.Table0[0].AgentCity);
                        $('#AgentCode').text(GetSucessResult.Table0[0].AgentCode);

                        //$("#Text_RevisedWeightUnit").val(GetSucessResult.Table0[0].WeightUnit);
                        //$("span#Text_RevisedWeightUnit").text(GetSucessResult.Table0[0].WeightUnit);

                        $("#Text_RevisedGrossWeight").val(GetSucessResult.Table0[0].RevisedGrossWeight)
                        $("span#hdn_OriginalGrossWeight").text(GetSucessResult.Table0[0].OriginalGrossWeight)

                        $("#Text_RevisedPieces").val(GetSucessResult.Table0[0].RevisedPieces)
                        $("span#hdn_OriginalPieces").text(GetSucessResult.Table0[0].OriginalPieces)


                        //$("#Text_RevisedWeightUnit").val(GetSucessResult.Table0[0].RevisedWeightUnit)
                        //$("span#hdn_OriginalWeightUnit").text(GetSucessResult.Table0[0].OriginalWeightUnit)

                        $("#Text_RevisedVolume").val(GetSucessResult.Table0[0].RevisedVolume)
                        $("span#hdn_OriginalVolume").text(GetSucessResult.Table0[0].OriginalVolume)

                        $("span#Shipper").text(GetSucessResult.Table0[0].shipper);
                        $("span#Consignee").text(GetSucessResult.Table0[0].Consignee);



                        $('#CommoditySNo').val(GetSucessResult.Table0[0].CommoditySNo);
                        $('#Text_CommoditySNo').val(GetSucessResult.Table0[0].Text_CommoditySNo);
                        var SHC = GetSucessResult.Table0[0].SHCSNo.substring(0, GetSucessResult.Table0[0].SHCSNo.length - 1);
                        $('#SHCSNo').val(SHC);
                        var Text_SHC = GetSucessResult.Table0[0].Text_SHCSNo.substring(0, GetSucessResult.Table0[0].Text_SHCSNo.length - 1);
                        $('#Text_SHCSNo').val(Text_SHC);
                        $('#ProductSNo').val(GetSucessResult.Table0[0].ProductSNo);
                        $('#Text_ProductSNo').val(GetSucessResult.Table0[0].Text_ProductSNo);

                        cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());

                        //Original----------------------
                        $('#OriginalCommoditySNo').val(GetSucessResult.Table0[0].OriginalCommoditySNo);
                        $('#Text_OriginalCommoditySNo').val(GetSucessResult.Table0[0].Text_OriginalCommoditySNo);

                        var SHCOriginal = GetSucessResult.Table0[0].OriginalSHCSNo.substring(0, GetSucessResult.Table0[0].OriginalSHCSNo.length - 1);
                        $('#OriginalSHCSNo').val(SHCOriginal);
                        var Text_OriginalSHC = GetSucessResult.Table0[0].Text_OriginalSHCSNo.substring(0, GetSucessResult.Table0[0].Text_OriginalSHCSNo.length - 1);
                        $('#Text_OriginalSHCSNo').val(Text_OriginalSHC);


                        $('#OriginalProductSNo').val(GetSucessResult.Table0[0].OriginalProductSNo);
                        $('#Text_OriginalProductSNo').val(GetSucessResult.Table0[0].Text_OriginalProductSNo);

                        cfi.BindMultiValue("OriginalSHCSNo", $("#Text_OriginalSHCSNo").val(), $("#OriginalSHCSNo").val());
                        $('#divMultiOriginalSHCSNo').find('span').removeClass("k-icon k-delete");



                        if (GetSucessResult.Table0[0].ISWEIGHTDISCREP == 'Checked') {
                            $('input[type="checkbox"][name=WEIGHTDISCREP]').click()
                        }
                        if (GetSucessResult.Table0[0].ISVOLUMEDISCREP == 'Checked') {
                            $('input[type="checkbox"][name=VOLUMEDISCREP]').click()
                        }
                        if (GetSucessResult.Table0[0].ISCNEECHANGE == 'Checked') {
                            $('input[type="checkbox"][name=CNEECHANGE]').click()
                        }
                        if (GetSucessResult.Table0[0].ISDESTCHANGE == 'Checked') {
                            $('input[type="checkbox"][name=DESTCHANGE]').click()
                        }
                        if (GetSucessResult.Table0[0].ISRATEERROR == 'Checked') {
                            $('input[type="checkbox"][name=RATEERROR]').click()
                        }
                        if (GetSucessResult.Table0[0].ISCCACHARGE == 'Checked') {
                            $('input[type="checkbox"][name=CCACHARGE]').click()
                        }

                        $("span#Status").text(GetSucessResult.Table0[0].Status);
                        $("span#CurrencyCode").text(GetSucessResult.Table0[0].CurrencyCode);
                        if ($("span#Status").text() == 'Requested') {
                            $('#RequestedBy').text(GetSucessResult.Table0[0].RequestedBy)
                            $('#lblApprovedBy').hide();
                            $('#CCAGeneratedRow').hide();
                            $('#lblCCAexecutionDate').hide();
                        }

                        if ($("span#Status").text() == 'Approved') {
                            $('#RequestedBy').text(GetSucessResult.Table0[0].RequestedBy)
                            $('#ApprovedBy').text(GetSucessResult.Table0[0].ApprovedBy)
                            $("span#CCANo").text(GetSucessResult.Table0[0].CCANo)
                            $("span#PlaceofExecution").text(GetSucessResult.Table0[0].PlaceofExecution)
                            $("span#CCAExecutionDate").text(GetSucessResult.Table0[0].CCAExecutionDate)
                        }


                        if ($("span#Status").text() == 'Rejected') {
                            $('#RequestedBy').text(GetSucessResult.Table0[0].RequestedBy)
                            $('#ApprovedBy').text(GetSucessResult.Table0[0].ApprovedBy)
                            $('#CCAGeneratedRow').hide();
                            $("span#CCAExecutionDate").text(GetSucessResult.Table0[0].CCAExecutionDate)
                        }
                        $("#Text_Remarks").val(GetSucessResult.Table0[0].CCARemarks)

                        $("#Text_RemarksApproved").val(GetSucessResult.Table0[0].ApprovedRemarks)

                        $("#Text_RevisedChargeableWeight").val(GetSucessResult.Table0[0].RevisedChargeableWeight);
                        $("span#hdn_OriginalChargeableWeight").text(GetSucessResult.Table0[0].OriginalChargeableWeight);

                        valRevisedFreightType = 'P';
                        valOriginalFreightType = 'P';


                        $('#ccTopp').attr("disabled", true);


                        $("#Text_RevisedPrepaidWeightCharges").text(GetSucessResult.Table0[0].RevisedPWeightCharges);
                        $("#Text_RevisedPrepaidValuationCharges").text(GetSucessResult.Table0[0].RevisedPValuationCharges);
                        $("#Text_RevisedPrepaidTax").text(GetSucessResult.Table0[0].RevisedPTax);
                        $("span#Text_RevisedPrepaidDueAgent").text(GetSucessResult.Table0[0].RevisedPDueAgentCharges);
                        $("span#Text_RevisedPrepaidDueCarrier").text(GetSucessResult.Table0[0].RevisedPDueCarrierCharges);
                        $("#Text_RevisedPrepaidTotal").text(GetSucessResult.Table0[0].RevisedPTotalCharges);



                        ////Read Only Collect
                        //$('#Text_RevisedCollectWeightCharges').hide();
                        //$('#Text_RevisedCollectValuationCharges').hide();
                        //$('#Text_RevisedCollectTax').hide();
                        //$('span#Text_RevisedCollectDueCarrier').hide();
                        //$('span#Text_RevisedCollectDueAgent').hide();
                        //$('#Text_RevisedCollectTotal').hide();

                        //Span Original Prepaid
                        $("span#hdn_OriginalPrepaidWeightCharges").text(GetSucessResult.Table0[0].OriginalPWeightCharges);
                        $("span#hdn_OriginalPrepaidValuationCharges").text(GetSucessResult.Table0[0].OriginalPValuationCharges);
                        $("span#hdn_OriginalPrepaidTax").text(GetSucessResult.Table0[0].OriginalPTax);
                        $("span#hdn_OriginalPrepaidDueAgent").text(GetSucessResult.Table0[0].OriginalPDueAgentCharges);
                        $("span#hdn_OriginalPrepaidDueCarrier").text(GetSucessResult.Table0[0].OriginalPDueCarrierCharges);
                        $("span#hdn_OriginalPrepaidTotal").text(GetSucessResult.Table0[0].OriginalPTotalCharges);


                        //Flight Details
                        if (GetSucessResult.Table1.length > 0) {

                            for (var i = 1; i <= GetSucessResult.Table1.length; i++) {
                                $("span#To" + i + "").text(GetSucessResult.Table1[i - 1].Origin);
                                $("span#FlightNo" + i + "").text(GetSucessResult.Table1[i - 1].FlightNo);
                                $("span#Date" + i + "").text(GetSucessResult.Table1[i - 1].FlightDate);
                            }

                        }




                        $('#__SpanHeader__').closest('tr').hide();

                        if (PageType == "READ") {
                            $('input[type="submit"][value=Save]').attr('style', 'display:none')
                            $('input[type="submit"][value=Back]').removeAttr('style', 'display:none')
                            $('input[type="button"][value=Print]').removeAttr('style', 'display:none')
                            $('input[type="submit"][value=Approve]').attr('style', 'display:none')
                            $('input[type="submit"][value=Delete]').attr('style', 'display:none')
                            $('input[type="submit"][value=Update]').attr('style', 'display:none')
                            $('#SearchSection').attr('style', 'display:none');
                            $('#DisplayButtonUpdate').removeAttr('style', 'display:none')
                            $("#ApprovedPanel").hide();
                            $("#ApprovedPanelRemarks").hide();

                        } else if (PageType == "DELETE") {
                            $('input[type="submit"][value=Save]').attr('style', 'display:none')
                            $('input[type="submit"][value=Back]').removeAttr('style', 'display:none')
                            $('input[type="button"][value=Print]').removeAttr('style', 'display:none')
                            $('input[type="submit"][value=Approve]').attr('style', 'display:none')
                            $('input[type="submit"][value=Delete]').removeAttr('style', 'display:none')
                            $('input[type="submit"][value=Update]').attr('style', 'display:none')
                            $('#SearchSection').attr('style', 'display:none');
                            $('#DisplayButtonUpdate').removeAttr('style', 'display:none')
                            $("#ApprovedPanel").hide();
                            $("#ApprovedPanelRemarks").hide();

                        } else {
                            $('input[type="submit"][value=Save]').attr('style', 'display:none')
                            $('input[type="submit"][value=Back]').removeAttr('style', 'display:none')
                            $('input[type="button"][value=Print]').removeAttr('style', 'display:none')
                            $('input[type="submit"][value=Approve]').attr('style', 'display:none')
                            $('input[type="submit"][value=Update]').removeAttr('style', 'display:none')
                            $('input[type="submit"][value=Delete]').attr('style', 'display:none')
                            $('#SearchSection').attr('style', 'display:none');
                            $('#DisplayButtonUpdate').removeAttr('style', 'display:none')
                        }
                        //if (userContext.GroupName.toUpperCase() == "ADMIN") {
                        if (Approve.includes(LoginType)) {
                            $('input[type="submit"][value=Approve]').removeAttr('style', 'display:none')
                            $('input[type="submit"][value=Update]').attr('style', 'display:none')
                            $('input[type="submit"][value=Delete]').attr('style', 'display:none')
                            if (PageType == "READ") {
                                $('input[type="submit"][value=Approve]').attr('style', 'display:none');
                            }
                            $('#Text_Remarks').attr('disabled', 'disabled')
                        }



                    }
                    else {
                        ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                    }
                }

                else {
                    ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                }
            }
        });
    }
}


function printDiv() {
    var CCANo = getQueryStringValue("RecID").toUpperCase();
    if (CCANo > 0)
        window.open("HtmlFiles/CCA/PrintCCA.html?CCANo=" + CCANo);
    else
        jAlert("CCANo not generated");

}


function RequestTypeMode() {

    if ($('input[type="radio"][name=Group]:checked').val() == 'Approved') {
        $('input[type="submit"][value=Reject]').val('Approve');

    }
    if ($('input[type="radio"][name=Group]:checked').val() == 'Reject') {
        $('input[type="submit"][value=Approve]').val('Reject');
        //$('input[type="radio"][value=Approved]').removeAttr('checked', true)
    }

}

