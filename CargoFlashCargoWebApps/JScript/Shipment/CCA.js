/// <reference path="../../Scripts/references.js" />
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
var Istransit = 0;
var filterOriginAirport = "";
var subprocesssno = 0;
var DestinationChange = "";
var bid = 0;
var strCCASno = 0;
var SaveFlightRequestModel = [];
var DueCarrierOtherChargeCCA = [];
var DueAgentOtherChargeCCA = [];
var AWBSNo = 0;
var flagdueCarrier = 0
var flagdueAgent = 0

//----------- Updated By Akash  -For Update CCA record saving remarks and message --19 July 2017

//----------- Updated By Akash  -For Readonly Chargable Weight --21 July 2017

///// --------------  Start EDox------------------------
function BindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='DocType']").each(function () {

        cfi.AutoCompleteV2($(this).attr("name"), "DocumentName", "Acceptance_DocType", MakeFileMandatory, "contains");
    });

    $(elem).find("input[type='file']").attr("data-valid-msg", "Attach Document");
    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
    });
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
    WrapSelectedFileName();
}
function ReBindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("[id^='areaTrans_shipment_shipmentedoxinfo']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {

            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "Acceptance_DocType");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, MakeFileMandatory);
        });
        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}
function MakeFileMandatory(e) {
    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $("#" + e).closest('tr').find("[id ^= 'DocsName']").attr("data-valid", "required");
    } else {
        $("#" + e).closest('tr').find("[id ^= 'DocsName']").removeAttr("data-valid");
    }
}
function UploadEDoxDocument(objId, nexctrlid) {

    //$('#DocsName').bind('change', function () {
    //    alert('Hi');
    //    alert('This file size is: ' + this.files[0].size / 1024 / 1024 + "MB");
    //    return;
    //});

    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;



    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    var FileFlag = true;
    for (var i = 0; i < files.length; i++) {
        if (files[i].name.length > 150) {
            FileFlag = false;
        } else {
            fileName = files[i].name;
            data.append(files[i].name, files[i]);
        }
    }

    var fsize = (files[0].size);
    var sizeInMB = fsize / 1048576;
    if (parseFloat(sizeInMB).toFixed(2) > 3) {
        alert('Please upload either 3 MB and Less than 3 MB ');
        return;
    }

    if (FileFlag == false) {
        ShowMessage('info', 'File Upload!', "Unable to upload selected file. File Name should be less than 150 characters.", "bottom-right");
        return;
    }
    $.ajax({
        url: "/BLOBUploadAndDownload/UploadToBlob",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {

            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(files[0].name);//result.substring(result.lastIndexOf('__') + 2)
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });

}
function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}
function WrapSelectedFileName() {
    $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("[id^='areaTrans_shipment_shipmentedoxinfo']").each(function () {
        $(this).find("span[id^='DocName']").closest('td').css("white-space", "inherit");
        $(this).find("input[type='file'][id^='DocsName']").css('width', '');
        $(this).find("input[id^='Text_DocType']").parent('span').css('width', '120px');
    });

}

var divfooter = '<div id="divFooter" class="divFooter" style="display: block;"><div><table style="margin-left:20px;"><tbody><tr><td> &nbsp; &nbsp;</td>'
    + '<td></td><td> &nbsp; &nbsp;</td><td><input type="button" class="btn btn-block btn-success btn-sm" id="btnSave" value="Save" onclick="SaveEdox();" style=""/></td>'
    + '<td> &nbsp; &nbsp;</td><td><button class="btn btn-block btn-success btn-sm" id="btnSaveToNext" style="display: none;">Save &amp; Next</button></td>'
    + '<td> &nbsp; &nbsp;</td><td><input type="button" class="btn btn-block btn-danger btn-sm" id="btnCancel" value="Cancel" onclick="BtnCancel();" style=""/></td></tr></tbody></table> </div></div>';

function BindEdoxViewDetails() {

    $.ajax({
        url: "Services/Shipment/CCAService.svc/GetRecordAtAWBEDox?CCSNO=" + strCCASno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;

            var docRcvd = false;

            cfi.makeTrans("shipment_shipmentedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, true);
            cfi.makeTrans("shipment_shipmentsphcedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, null);
            $("#divareaTrans_shipment_shipmentedoxinfo tr:first").find("font").remove();


            if (!docRcvd) {
                $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("[id='areaTrans_shipment_shipmentedoxinfo']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "DocumentName", "Acceptance_DocType", MakeFileMandatory, "contains");

                    });
                    $(this).find("input[id^='Text_DocType']").attr('required', 'required');
                    $(this).find("input[id^='Text_DocType']").attr('data-valid', 'required');
                    $(this).find("input[id^='Text_DocType']").unbind("blur").bind("blur", function () {
                        RemoveFileMandatory($(this).closest('td').find("input[id^='Text_DocType']").attr("id"));
                    });

                    $(this).find("input[id^='DocsName']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadEDoxDocument($(this).attr("id"), "DocName");
                            if (SPHCDoc.length > 0 || (PriorBOEArray[0].PriorApproval == "True" || PriorBOEArray[0].IsBOEVerification == "True" || PriorBOEArray[0].IsFOC == "True")) {
                                $(this).removeAttr("data-valid");
                            }
                            WrapSelectedFileName();
                        })
                    });
                    $(this).find("a[id^='ahref_DocName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                    $(this).find("input[type='file']").css('width', '');
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                });

                $("div[id$='areaTrans_shipment_shipmentsphcedoxinfo']").find("table tr").each(function () {
                    $(this).find("td:eq(1)").css("display", "none");
                    $(this).find("td:eq(2)").css("display", "none");
                    $(this).find("td:eq(3)").css("display", "none");
                    $(this).find("td:eq(4)").css("display", "none");
                    $(this).find("td:last").remove();

                    $(this).find("input[id^='sphcdocsname']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadSPHCDocument($(this).attr("id"), "sphcdocname");
                        })
                    });
                    $(this).find("a[id^='ahref_sphcdocname']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadSPHCDocument($(this).attr("id"), "sphcdocname");
                        })
                    });
                    if ($(this).find("span[id^='IsUploadMandatory']").text().toUpperCase() == "TRUE") {
                        if (($(this).find("span[id^='sphcdocname']").text() || "") == "") {
                            $(this).find("input[id^='sphcdocsname']").attr("data-valid", "required");
                        }
                    }

                    var DocSNo = $(this).find("span[id^='sphcdocumenttransnso']").text() || "0";
                    if (parseInt(DocSNo) > 0) {
                        $(this).find("a[id^='ahref_sampledocname']").each(function () {
                            $(this).unbind("click").bind("click", function () {
                                DownloadEDoxFromDB(DocSNo, "S");    //S== Sample Document Flag
                            })
                        });
                    }
                    else {
                        $(this).find("span[id^='sampledocname']").closest('td').html('');
                    }

                    $(this).find("input[type='file']").css('width', '');
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");

                });

            }
            else {
                var prevtr = $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("tr[id='areaTrans_shipment_shipmentedoxinfo']").prev()
                prevtr.find("td:eq(2)").remove();
                prevtr.find("td:last").remove();
                $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("tr[id^='areaTrans_shipment_shipmentedoxinfo']").each(function () {
                    $(this).find("td:eq(2)").remove();
                    $(this).find("td:last").remove();
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                })

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
            }

        },
        error: {

        }
    });
}
function BindEdox(obj) {

    strCCASno = obj;
    _CURR_PRO_ = 'ACCEPTANCE';
    subprocess = 'EDOX';
    var AcceptanceGetWebForm4 = {
        processName: _CURR_PRO_,
        moduleName: 'Shipment',
        appName: subprocess,
        Action: 'New',
        IsSubModule: '1'
    }
    $.ajax({
        url: "Services/Shipment/CCAService.svc/GetWebForm",
        async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ model: AcceptanceGetWebForm4 }),
        success: function (result) {

            var divv = $(result).find('#divareaTrans_shipment_shipmentedoxinfo').html();

            $('#divareaTrans_shipment_shipmentedoxinfo').remove();
            $('#divbody').append("<div id='divareaTrans_shipment_shipmentedoxinfo'>" + divv + "</div>").html();
            $('#divareaTrans_shipment_shipmentedoxinfo').append(divfooter);

            BindEdoxViewDetails();

            cfi.makeTrans("shipment_shipmentedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, null, null, true);
            cfi.makeTrans("shipment_shipmentsphcedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, null);
            $("#divareaTrans_shipment_shipmentedoxinfo tr:first").find("font").remove();

            $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("[id='areaTrans_shipment_shipmentedoxinfo']").each(function () {

                $(this).find("input[id^='DocType']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "DocumentName", "Acceptance_DocType", MakeFileMandatory, "contains");

                });
                $(this).find("input[id^='DocsName']").each(function () {
                    $(this).unbind("change").bind("change", function () {
                        UploadEDoxDocument($(this).attr("id"), "DocName");
                        WrapSelectedFileName();
                    })
                });

                $(this).find("input[id^='Text_DocType']").attr('required', 'required');
                $(this).find("input[id^='Text_DocType']").attr('data-valid', 'required');
                $(this).find("input[id^='Text_DocType']").unbind("blur").bind("blur", function () {
                    //RemoveFileMandatory($(this).closest('td').find("input[id^='Text_DocType']").attr("id"));
                });

                //$(this).find("input[id^='DocsName']").each(function () {
                //    $(this).unbind("change").bind("change", function () {
                //        UploadEDoxDocument($(this).attr("id"), "DocName");
                //        WrapSelectedFileName();
                //    })
                //});
                $(this).find("a[id^='ahref_DocName']").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        DownloadEDoxDocument($(this).attr("id"), "DocName");
                    })
                });
                $(this).find("input[type='file']").css('width', '');
                $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
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
}

function SaveEdox() {
    var docs = $('#DocName').html();
    var strDoctype = $('#Text_DocType').val();
    var srtAttachment = $('#DocsName').val();
    if (strDoctype == "") {
        ShowMessage('warning', 'Warning - CCA Edox', "Please Select Doc Type");
        return;
    }
    //if (docs == "" || srtAttachment=="") {
    //    ShowMessage('warning', 'Warning - CCA Edox', "Please! Attachment Document");
    //    return;
    //}
    var currentawbsno = 0;
    var aa = strCCASno;
    var EDoxArray = [];
    //  var SPHCDoxArray = [];
    var AllEDoxReceived = 1;
    var Remarks = $("#Remarks").val();
    var flag = false;
    $("div[id$='areaTrans_shipment_shipmentedoxinfo']").find("[id^='areaTrans_shipment_shipmentedoxinfo']").each(function () {
        if ($(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key() || "0" > 0) {
            var eDoxViewModel = {
                EDoxdocumenttypeSNo: $(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key(),
                DocName: $(this).find("span[id^='DocName']").text(),
                AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
                ReferenceNo: $(this).find("input[id^='Reference']").val(),
                Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
            };
            EDoxArray.push(eDoxViewModel);
        }
    });

    var isPriorApproval = 0;
    var isFOC = 0;
    var FOCTypeSNo = "";
    var FocRemarks = "";
    var BOEFlag = false;
    var Awbnumber = "";

    if (BOEFlag == false) {
        $.ajax({
            url: "Services/Shipment/CCAService.svc/SaveAWBEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CCSNO: aa, AWBEDoxDetail: EDoxArray, AllEDoxReceived: 1, Remarks: Remarks, PriorApproval: isPriorApproval, UpdatedBy: userContext.UserSNo, isFOC: isFOC, FOCTypeSNo: FOCTypeSNo, FocRemarks: FocRemarks }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined && result != null && result.length > 0) {
                    var myData = jQuery.parseJSON(result);
                    Awbnumber = myData.Table0[0]["AwbNumber"];
                    // var msgData = myData.Table0;
                    ShowMessage('success', 'Success - e-Dox Information', "AWB No. [" + Awbnumber + "] -  Processed Successfully", "bottom-right");
                    setTimeout(function () {
                        navigateUrl("Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW");

                    }, 2000);
                    if (sessionStorage.getItem("auditlog") != null) {
                        var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                        SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                    }
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else
                    ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + Awbnumber + "] -  unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + Awbnumber + "] -  unable to process.", "bottom-right");

            },
            complete: function (xhr) {
                $("div[id$='areaTrans_shipment_shipmentsphcedoxinfo']").find("[id^='areaTrans_shipment_shipmentsphcedoxinfo']").each(function () {
                    $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata", '');
                });

            }
        });
    }
    return flag;
}

//    End Edox ----------------------------------


function fn_OnCCASuccessGrid(e) {
    $('table tr td[data-column="SNo"] span').text('');

    var LengthGrid = $('[id*="faction"]').length;
    var Status = '';
    var flag = '';
    for (var i = 0; i < LengthGrid; i++) {
        $('table tr td[data-column="SNo"] span:eq(' + i + ')').text('');
        Status = $('table tr td[data-column="Status"] span:eq(' + i + ')').text();
        flag = $('table tr td[data-column="IsCCADoc"]:eq(' + i + ')').text();

        if (Status == "Approved" || Status == "Rejected" || Status == "Requested") {

            $('table tr td[data-column="SNo"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="Print"  title= "Print" class="btn btn-success" onclick="RenderPrintCCA(this.id);" />')
            //$('table tr td[data-column="SNo"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="EDOX" class="btn btn-success" onclick="BindEdox(this.id);" />')
            $('table tr td[data-column="SNo"] span:eq(' + i + ')').append(" ");
            if (flag == "True") {
                $('table tr td[data-column="SNo"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="EDOX" title= "EDOX" class="completeprocess" onclick="BindEdox(this.id);" style="height: 24px; width:50px;" />')
            }
            else {
                $('table tr td[data-column="SNo"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="EDOX" title= "EDOX" class="incompleteprocess" onclick="BindEdox(this.id);" style="height: 24px; width:50px;" />')
            }
        }
    }
}

function BtnCancel() {
    setTimeout(function () {
        navigateUrl("Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW");

    }, 1000);
}

$('#DocsName').bind('change', function () {
    alert('Hi');
    alert('This file size is: ' + this.files[0].size / 1024 / 1024 + "MB");
});

function BeforeRowActionClick(td, tr, recId, grid) {
    if ($(tr).find("td[data-column='Status']").text().toUpperCase() == "APPROVED") {
        $(".tool-items").find("a:eq(1)").hide();
    } else {
        $(".tool-items").find("a:eq(1)").show();
    }
}

function RenderPrintCCA(CCANo) {
    if (CCANo > 0)
        window.open("HtmlFiles/CCA/PrintCCA.html?CCANo=" + CCANo);
    else
        jAlert("CCANo not generated");
}
var userContext = "";
$(function () {


    if (window.opener) {
        userContext = window.opener.parent.userContext;
    }

    PageType = getQueryStringValue("FormAction").toUpperCase();
    Approve = userContext.SpecialRights["CCAAPPR"];
    LoginType = userContext.GroupName.toUpperCase();
    Request = userContext.SysSetting.RequestCCA.split(',');
    CCAforRCSshipment = userContext.SysSetting.CCAforRCSShipment_HOLD || 0;

    //if (!Request.includes(LoginType)) {
    //    $('input[type="button"][value=New CCA]').hide();
    //}
    var ViewCode = "<div id='windowViewGeneratedCode'></div>";
    //$('#tbl').append("<div id='windowViewGeneratedCode'></div>");

    // commented by akash for permission based - 19 july 2017
    //if (Request.includes(LoginType)) {
    if (userContext.SpecialRights["CCAREQ"] == true) {
        $('input[type="button"][value=New CCA]').show();
    } else {
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
                LoadFlightvalidation();
                $("#PrintDiv").hide();
                $("#ApprovedPanel").hide();
                $("#ApprovedPanelRemarks").hide();
                $('input[type="radio"][value=Pending]').attr('checked', true);
                $("#Text_AWBSNo").parent('span').attr('class', '');
                $("#Text_AWBSNo").next('span').hide();

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
                LoadFlightvalidation()
                UpdateCCAAWbRecord();


                //if (Approve.includes(LoginType)) {
                if (userContext.SpecialRights["CCAAPPR"] == true) {


                    $('#Text_RevisedShipper').attr('disabled', 'disabled');
                    $('#Text_RevisedConsignee').attr('disabled', 'disabled');


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
                    $('#Text_RevisedVolumeWeight').attr('disabled', 'disabled');



                    $('input[type="checkbox"][name=WEIGHTDISCREP]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=VOLUMEDISCREP]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=CNEECHANGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=SHPRCHANGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=NOGCHANGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=DESTCHANGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=RATEERROR]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=CCACHARGE]').attr('disabled', 'disabled');
                    $("#NatureOfGoods").attr('disabled', true);
                    $('input[type="checkbox"][name=SHCCHARGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=IsRepriceAWB]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=IsTerminateShpt]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=IsDestinationChange]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=PRODUCTCHARGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=COMMODITYCHARGE]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=PIECESCHARGE]').attr('disabled', 'disabled');

                    $('input[type="checkbox"][name=IsDueCarrierChange]').attr('disabled', 'disabled');
                    $('input[type="checkbox"][name=IsDueAgentChange]').attr('disabled', 'disabled');

                    $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
                    $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
                    $('#Text_TermianteStation').data("kendoAutoComplete").enable(false);
                    $('#Text_DestinationChange').data("kendoAutoComplete").enable(false);
                    $('#Text_SHCSNo').data("kendoAutoComplete").enable(false);
                    $('#divMultiSHCSNo').find('span').removeClass("k-icon k-delete");


                    if ($("span#FlightNo1").text().trim() != "") {
                        $("#DepartedPieces1").attr('disabled', 'disabled');
                        $("#DepartedGrossWeight1").attr('disabled', 'disabled');
                        $("#DepartedVolume1").attr('disabled', 'disabled');
                        $("#DepartedVolumeWeight1").attr('disabled', 'disabled');
                    }

                    if ($("span#FlightNo2").text().trim() != "") {
                        $("#DepartedPieces2").attr('disabled', 'disabled');
                        $("#DepartedGrossWeight2").attr('disabled', 'disabled');
                        $("#DepartedVolume2").attr('disabled', 'disabled');
                        $("#DepartedVolumeWeight2").attr('disabled', 'disabled');
                    }
                    if ($("span#FlightNo3").text().trim() != "") {
                        $("#DepartedPieces3").attr('disabled', 'disabled');
                        $("#DepartedGrossWeight3").attr('disabled', 'disabled');
                        $("#DepartedVolume3").attr('disabled', 'disabled');
                        $("#DepartedVolumeWeight3").attr('disabled', 'disabled');
                    }

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

                    $('#DisplayButtonUpdate').attr('style', 'position: fixed;margin-top: -37px;margin-left: 1530px;');
                    $("#ApprovedPanel").hide();
                    $("#ApprovedPanelRemarks").hide();
                    $('#Text_RevisedShipper').attr('disabled', 'disabled');
                    $('#Text_RevisedConsignee').attr('disabled', 'disabled');



                    ShowMessage('warning', 'Warning - CCA', "CCA already Approved !");
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
                    $('#DisplayButtonUpdate').attr('style', 'position: fixed;margin-top:-25px;margin-left: 1278px;');
                    $("#ApprovedPanel").hide();
                    $("#ApprovedPanelRemarks").hide();
                    ShowMessage('warning', 'Warning - CCA', "CCA already Rejected !");
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
                LoadFlightvalidation();
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
                $('input[type="checkbox"][name=SHPRCHANGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=NOGCHANGE]').attr('disabled', 'disabled');
                $("#NatureOfGoods").attr('disabled', true);
                $('input[type="checkbox"][name=SHCCHARGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=IsRepriceAWB]').attr('disabled', 'disabled');

                $('input[type="checkbox"][name=IsTerminateShpt]').attr('disabled', 'disabled');

                $('#Text_TermianteStation').data("kendoAutoComplete").enable(false);
                $('input[type="checkbox"][name=IsDestinationChange]').attr('disabled', 'disabled');
                $('#Text_DestinationChange').data("kendoAutoComplete").enable(false);

                $('input[type="checkbox"][name=PRODUCTCHARGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=COMMODITYCHARGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=PIECESCHARGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=IsDueCarrierChange]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=IsDueAgentChange]').attr('disabled', 'disabled');
                $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
                $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
                $('#Text_SHCSNo').data("kendoAutoComplete").enable(false);
                $('#divMultiSHCSNo').find('span').removeClass("k-icon k-delete");
                $('#Text_RevisedShipper').attr('disabled', 'disabled');
                $('#Text_RevisedConsignee').attr('disabled', 'disabled');

                $('#Text_RevisedVolumeWeight').attr('disabled', 'disabled');


                if ($("span#FlightNo1").text().trim() != "") {
                    $("#DepartedPieces1").attr('disabled', 'disabled');
                    $("#DepartedGrossWeight1").attr('disabled', 'disabled');
                    $("#DepartedVolume1").attr('disabled', 'disabled');
                    $("#DepartedVolumeWeight1").attr('disabled', 'disabled');
                }

                if ($("span#FlightNo2").text().trim() != "") {
                    $("#DepartedPieces2").attr('disabled', 'disabled');
                    $("#DepartedGrossWeight2").attr('disabled', 'disabled');
                    $("#DepartedVolume2").attr('disabled', 'disabled');
                    $("#DepartedVolumeWeight2").attr('disabled', 'disabled');
                }
                if ($("span#FlightNo3").text().trim() != "") {
                    $("#DepartedPieces3").attr('disabled', 'disabled');
                    $("#DepartedGrossWeight3").attr('disabled', 'disabled');
                    $("#DepartedVolume3").attr('disabled', 'disabled');
                    $("#DepartedVolumeWeight3").attr('disabled', 'disabled');
                }
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
                LoadFlightvalidation();
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


                $('input[type="checkbox"][name=SHCCHARGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=IsRepriceAWB]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=IsTerminateShpt]').attr('disabled', 'disabled');
                $('#Text_TermianteStation').data("kendoAutoComplete").enable(false);
                $('input[type="checkbox"][name=PRODUCTCHARGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=COMMODITYCHARGE]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=PIECESCHARGE]').attr('disabled', 'disabled');

                $('input[type="checkbox"][name=IsDueCarrierChange]').attr('disabled', 'disabled');
                $('input[type="checkbox"][name=IsDueAgentChange]').attr('disabled', 'disabled');

                $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
                $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
                $('#Text_SHCSNo').data("kendoAutoComplete").enable(false);
                $('#divMultiSHCSNo').find('span').removeClass("k-icon k-delete");


                $('#Text_RevisedVolumeWeight').attr('disabled', 'disabled');


                if ($("span#Status").text() == 'Approved') {

                    $('input[type="submit"][value=Delete]').attr('style', 'display:none')

                    ShowMessage('warning', 'Warning - CCA', "CCA already deleted !");
                }


                if ($("span#FlightNo1").text().trim() != "") {
                    $("#DepartedPieces1").attr('disabled', 'disabled');
                    $("#DepartedGrossWeight1").attr('disabled', 'disabled');
                    $("#DepartedVolume1").attr('disabled', 'disabled');
                    $("#DepartedVolumeWeight1").attr('disabled', 'disabled');
                }

                if ($("span#FlightNo2").text().trim() != "") {
                    $("#DepartedPieces2").attr('disabled', 'disabled');
                    $("#DepartedGrossWeight2").attr('disabled', 'disabled');
                    $("#DepartedVolume2").attr('disabled', 'disabled');
                    $("#DepartedVolumeWeight2").attr('disabled', 'disabled');
                }
                if ($("span#FlightNo3").text().trim() != "") {
                    $("#DepartedPieces3").attr('disabled', 'disabled');
                    $("#DepartedGrossWeight3").attr('disabled', 'disabled');
                    $("#DepartedVolume3").attr('disabled', 'disabled');
                    $("#DepartedVolumeWeight3").attr('disabled', 'disabled');
                }
            }
        });
    }


});





function LoadJS() {





    //-----------------------New v2 addded by akash on 27 sep 2017

   // cfi.AutoCompleteV2("AWBSNo", "AWBNo", "CCA_AWBSNo", null, "contains"); commented by devendra 15June2020 as told by khan sir 
    cfi.AutoCompleteV2("CommoditySNo", "CommodityCode,CommodityDescription", "CCA_CommodityCode", null, "contains");
    cfi.AutoCompleteV2("ProductSNo", "ProductName", "CCA_ProductName", null, "contains");
    cfi.AutoCompleteV2("SHCSNo", "Code,Description", "CCA_Code", null, "contains", ",");
    cfi.AutoCompleteV2("OriginalCommoditySNo", "CommodityCode,CommodityDescription", "CCA_OriginalCommodityCode", null, "contains");
    cfi.AutoCompleteV2("OriginalProductSNo", "ProductName", "CCA_OriginalProductName", null, "contains");
    cfi.AutoCompleteV2("OriginalSHCSNo", "Code,Description", "CCA_OriginalCode", null, "contains", ",");
    cfi.AutoCompleteV2("TermianteStation", "AirportCode,AirportName", "SpotRate_AirportCode", null, "contains");
    cfi.AutoCompleteV2("DestinationChange", "AirportCode,AirportName", "SpotRate_AirportCode", null, "contains");
    //-------------shipper
    cfi.AutoCompleteV2("SHIPPER_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("SHIPPER_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
    cfi.AutoCompleteV2("SHIPPER_City", "CityCode,CityName", "Reservation_City", null, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_City", "CityCode,CityName", "Reservation_City", null, "contains");

    cfi.AutoCompleteV2("OrgSHIPPER_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", null, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("OrgSHIPPER_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
    cfi.AutoCompleteV2("OrgSHIPPER_City", "CityCode,CityName", "Reservation_City", null, "contains");
    cfi.AutoCompleteV2("OrgCONSIGNEE_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", null, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("OrgCONSIGNEE_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
    cfi.AutoCompleteV2("OrgCONSIGNEE_City", "CityCode,CityName", "Reservation_City", null, "contains");
    //------------end

    $('#Text_OriginalProductSNo').data("kendoAutoComplete").enable(false);
    $('#Text_OriginalCommoditySNo').data("kendoAutoComplete").enable(false);
    $('#Text_OriginalSHCSNo').data("kendoAutoComplete").enable(false);



    $('#Text_RevisedGrossWeight').blur(function () {

        var key = event.which;

        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((parseFloat(this.value) <= 0.000) || (parseFloat(this.value) <= 0)) {

            ShowMessage('warning', 'Warning - CCA', "Gross Weight Should Not be Zero or Less than Zero.");

            $("#Text_RevisedGrossWeight").val('');
            return false;
        }
        else {
            var a = parseFloat($("#Text_RevisedGrossWeight").val())
            var b = parseFloat($("#Text_RevisedVolumeWeight").val())
            var abc = a > b ? GetroundValue(a, 1) : GetroundValue(b, 1)
            $("#Text_RevisedChargeableWeight").val(abc)
        }

    });
    $('#Text_RevisedVolume').blur(function () {


        var key = event.which;

        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((this.value <= 0.000) || (this.value <= 0)) {

            ShowMessage('warning', 'Warning - CCA', "Volume  Should Not be Zero or Less than Zero.");

            $("#Text_RevisedVolume").val('');
            return false;
        }
        else {
            var grwt = $('#Text_RevisedVolume').val();

            $('#Text_RevisedVolume').val(parseFloat(grwt).toFixed(3));
            if ($('#Text_RevisedVolume').val() == "NaN") {
                $("#Text_RevisedVolume").val('');
            }
            var a = parseFloat($("#Text_RevisedGrossWeight").val())
            var b = parseFloat($("#Text_RevisedVolumeWeight").val())
            var abc = a > b ? GetroundValue(a, 1) : GetroundValue(b, 1)
            $("#Text_RevisedChargeableWeight").val(abc)

        }


        if (GetroundValue((this.value * 166.66), 1) > ($('#Text_RevisedGrossWeight').val())) {
            //var vlweight = $('#Text_RevisedVolume').val();

            //var vlwt = Math.abs((GetroundValue((this.value * 166.66), 1)).toFixed(2));

            $("#Text_RevisedChargeableWeight").val(parseFloat(GetroundValue((this.value * 166.66), 1)).toFixed(2));
            $("#Text_RevisedVolumeWeight").val(parseFloat(GetroundValue(($('#Text_RevisedVolume').val() * 166.66), 1)).toFixed(2));
            var a = parseFloat($("#Text_RevisedGrossWeight").val())
            var b = parseFloat($("#Text_RevisedVolumeWeight").val())
            var abc = a > b ? GetroundValue(a, 1) : GetroundValue(b, 1)
            $("#Text_RevisedChargeableWeight").val(abc)
            return false;
        } else {
            var vlweight = $('#Text_RevisedGrossWeight').val();

            var vlwt = Math.abs(vlweight).toFixed(2);

            $("#Text_RevisedChargeableWeight").val(parseFloat(vlwt).toFixed(2));
            $("#Text_RevisedVolumeWeight").val(parseFloat(GetroundValue(($('#Text_RevisedVolume').val() * 166.66), 1)).toFixed(2));
            var a = parseFloat($("#Text_RevisedGrossWeight").val())
            var b = parseFloat($("#Text_RevisedVolumeWeight").val())
            var abc = a > b ? GetroundValue(a, 1) : GetroundValue(b, 1)
            $("#Text_RevisedChargeableWeight").val(abc)
            return false;
        }

    });
    $('#Text_RevisedPieces').blur(function () {



        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {

            ShowMessage('warning', 'Warning - CCA', "Pieces  Should Not be Zero or Less than Zero.");

            $("#Text_RevisedPieces").val('');
            return false;
        }

    });
    $('#Text_RevisedPieces').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }

    });

    //$('#Text_RevisedChargeableWeight').keyup(function () {
    //    if (this.value != this.value.replace(/[^0-9]/g, '')) {
    //        this.value = this.value.replace(/[^0-9]/g, '');
    //    }

    //});
    $('#Text_RevisedVolumeWeight').blur(function () {

        var key = event.which;

        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {

            ShowMessage('warning', 'Warning - CCA', "Volume Weight Should Not be Zero or Less than Zero.");

            $("#Text_RevisedVolumeWeight").val('');
            return false;
        }
        else {
            var grwt = $('#Text_RevisedVolumeWeight').val();

            $('#Text_RevisedVolumeWeight').val(parseFloat(grwt).toFixed(2));
            if ($('#Text_RevisedVolumeWeight').val() == "NaN") {
                $("#Text_RevisedVolumeWeight").val('');
            }
        }

    });


    $('input[type="submit"][value=Save]').attr('style', 'display:none')

    $('input[type="button"][value=Print]').attr('style', 'display:none')
    $('input[type="submit"][value=Update]').attr('style', 'display:none')
    /* added by   nehal  12 mar 2020         */
    //if ($('input[type="checkbox"][name=WEIGHTDISCREP]').is(':checked') == false) {
    //    $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
    //    $('#Text_RevisedVolume').attr('disabled', 'disabled');
    //    $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
    //    cfi.EnableAutoComplete("SHCSNo", false);
    //    cfi.EnableAutoComplete("ProductSNo", false);
    //    cfi.EnableAutoComplete("CommoditySNo", false);
    //    $('#Text_RevisedPieces').attr('disabled', 'disabled');
    //    $('#Revfltplan2').hide();
    //    $('#Revfltplan3').hide();
    //    $('#NatureOfGoods').attr('disabled', 'disabled');
    //    $('#Text_RevisedChargeableWeight').attr('disabled', 'disabled');
    //    $('#Text_RevisedVolumeWeight').attr('disabled', 'disabled');


    //    /*disable shiper*/

    //    cfi.EnableAutoComplete("SHIPPER_AccountNo", false);
    //    cfi.EnableAutoComplete("SHIPPER_CountryCode", false);
    //    cfi.EnableAutoComplete("SHIPPER_City", false);
    //    $('#SHIPPER_Name').attr('disabled', 'disabled');
    //    $('#SHIPPER_Name2').attr('disabled', 'disabled');
    //    $('#SHIPPER_Street').attr('disabled', 'disabled');
    //    $('#SHIPPER_Street2').attr('disabled', 'disabled');web.config
    //    $('#SHIPPER_TownLocation').attr('disabled', 'disabled');
    //    $('#SHIPPER_PostalCode').attr('disabled', 'disabled');
    //    $('#SHIPPER_MobileNo').attr('disabled', 'disabled');
    //    $('#SHIPPER_MobileNo2').attr('disabled', 'disabled');
    //    $('#SHIPPER_Email').attr('disabled', 'disabled');
    //    $('#SHipper_Fax').attr('disabled', 'disabled');
    //    $('#SHIPPER_State').attr('disabled', 'disabled');

    //    /* disable consignee*/
    //    cfi.EnableAutoComplete("CONSIGNEE_AccountNo", false);
    //    cfi.EnableAutoComplete("CONSIGNEE_CountryCode", false);
    //    cfi.EnableAutoComplete("CONSIGNEE_City", false);
    //    $('#CONSIGNEE_AccountNoName').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_Name2').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_Street').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_Street2').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_TownLocation').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_State').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_PostalCode').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_MobileNo').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_MobileNo2').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_MobileNo2').attr('disabled', 'disabled');
    //    $('#OrgSHIPPER_Email').attr('disabled', 'disabled');
    //    $('#OrgCONSIGNEE_Fax').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_Street2').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_AccountNoName2').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_MobileNo').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_Street').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_TownLocation').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_Fax').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_State').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_PostalCode').attr('disabled', 'disabled');
    //    $('#CONSIGNEE_Email').attr('disabled', 'disabled');


    //}

    //$('[name="WEIGHTDISCREP"]').click(function () {
    //    if ($('input[type="checkbox"][name=WEIGHTDISCREP]').is(':checked') == false) {
    //        var option = jConfirm("Changed <b><i>Gross Weight</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v = $('#hdn_OriginalGrossWeight').text();
    //                $('#Text_RevisedGrossWeight').val(v);
    //            }

    //        });

    //        $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
    //    } else { $('#Text_RevisedGrossWeight').removeAttr('disabled'); }
    //});

    //$('[name="VOLUMEDISCREP"]').click(function () {
    //    if ($('input[type="checkbox"][name=VOLUMEDISCREP]').is(':checked') == false) {
    //        var option = jConfirm("Changed <b><i>Volume, Volume Weight</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v1 = $('#hdn_OriginalVolume').text();
    //                $('#Text_RevisedVolume').val(v1);
    //                var v2 = $('#hdn_OriginalVolumeWeight').text();
    //                $('#Text_RevisedVolumeWeight').val(v2);

    //            }

    //        });

    //        $('#Text_RevisedVolume').attr('disabled', 'disabled');
    //        $('#Text_RevisedVolumeWeight').attr('disabled', 'disabled');
    //    } else {
    //        $('#Text_RevisedVolume').removeAttr('disabled');
    //        $('#Text_RevisedVolumeWeight').removeAttr('disabled');
    //    }
    //});

    //$('[name="CNEECHANGE"]').click(function () {
    //    if ($('input[type="checkbox"][name=CNEECHANGE]').is(':checked') == false) {
    //        var option = jConfirm("Changed <b><i>Consignee Information</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v1 = $('#Text_OrgCONSIGNEE_AccountNo').val();
    //                $('#Text_CONSIGNEE_AccountNo').val(v1);

    //                var v2 = $('#OrgCONSIGNEE_AccountNoName').val();
    //                $('#CONSIGNEE_AccountNoName').val(v2);

    //                var v3 = $('#OrgCONSIGNEE_AccountNoName2').val();
    //                $('#CONSIGNEE_AccountNoName2').val(v3);

    //                var v4 = $('#OrgCONSIGNEE_Street').val();
    //                $('#CONSIGNEE_Street').val(v4);

    //                var v5 = $('#OrgCONSIGNEE_Street2').val();
    //                $('#CONSIGNEE_Street2').val(v5);

    //                var v6 = $('#OrgCONSIGNEE_TownLocation').val();
    //                $('#CONSIGNEE_TownLocation').val(v6);

    //                var v7 = $('#OrgCONSIGNEE_State').val();
    //                $('#CONSIGNEE_State').val(v7);

    //                var v8 = $('#OrgCONSIGNEE_PostalCode').val();
    //                $('#CONSIGNEE_PostalCode').val(v8);

    //                var v9 = $('#OrgCONSIGNEE_MobileNo').val();
    //                $('#CONSIGNEE_MobileNo').val(v9);

    //                var v10 = $('#OrgCONSIGNEE_MobileNo2').val();
    //                $('#CONSIGNEE_MobileNo2').val(v10);

    //                var v11 = $('#OrgCONSIGNEE_Email').val();
    //                $('#CONSIGNEE_Email').val(v11);

    //                var v12 = $('#Text_OrgCONSIGNEE_CountryCode').val();
    //                $('#Text_CONSIGNEE_CountryCode').val(v12);

    //                var v13 = $('#Text_OrgCONSIGNEE_City').val();
    //                $('#Text_CONSIGNEE_City').val(v13);

    //                var v14 = $('#OrgCONSIGNEE_Fax').val();
    //                $('#CONSIGNEE_Fax').val(v14);

    //            }

    //        });

    //        cfi.EnableAutoComplete("CONSIGNEE_AccountNo", false);
    //        cfi.EnableAutoComplete("CONSIGNEE_CountryCode", false);
    //        cfi.EnableAutoComplete("CONSIGNEE_City", false);
    //        $('#CONSIGNEE_AccountNoName').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_AccountNoName2').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_Street ').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_Street2').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_TownLocation').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_State').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_PostalCode').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_MobileNo').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_MobileNo2').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_Email').attr('disabled', 'disabled');

    //        $('#CONSIGNEE_Fax').attr('disabled', 'disabled');


    //    } else {
    //        cfi.EnableAutoComplete("CONSIGNEE_AccountNo", true);
    //        cfi.EnableAutoComplete("CONSIGNEE_CountryCode", true);
    //        cfi.EnableAutoComplete("CONSIGNEE_City", true);
    //        $('#CONSIGNEE_AccountNoName').removeAttr('disabled');

    //        $('#CONSIGNEE_AccountNoName2').removeAttr('disabled');

    //        $('#CONSIGNEE_Street ').removeAttr('disabled');

    //        $('#CONSIGNEE_Street2').removeAttr('disabled');

    //        $('#CONSIGNEE_TownLocation').removeAttr('disabled');

    //        $('#CONSIGNEE_State').removeAttr('disabled');

    //        $('#CONSIGNEE_PostalCode').removeAttr('disabled');

    //        $('#CONSIGNEE_MobileNo').removeAttr('disabled');

    //        $('#CONSIGNEE_MobileNo2').removeAttr('disabled');

    //        $('#CONSIGNEE_Email').removeAttr('disabled');

    //        $('#CONSIGNEE_Fax').removeAttr('disabled');
    //    }
    //});

    //$('[name="SHPRCHANGE"]').click(function () {
    //    if ($('input[type="checkbox"][name=SHPRCHANGE]').is(':checked') == false) {

    //        var option = jConfirm("Changed <b><i>Shipper Information</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v1 = $('#Text_OrgSHIPPER_AccountNo').val();
    //                $('#Text_SHIPPER_AccountNo').val(v1);

    //                var v2 = $('#OrgSHIPPER_Name').val();
    //                $('#SHIPPER_Name').val(v2);

    //                var v3 = $('#OrgSHIPPER_Name2').val();
    //                $('#SHIPPER_Name2 ').val(v3);

    //                var v4 = $('#OrgSHIPPER_Street').val();
    //                $('#SHIPPER_Street').val(v4);

    //                var v5 = $('#OrgSHIPPER_Street2').val();
    //                $('#SHIPPER_Street2').val(v5);

    //                var v6 = $('#OrgSHIPPER_TownLocation').val();
    //                $('#SHIPPER_TownLocation').val(v6);

    //                var v7 = $('#OrgSHIPPER_State').val();
    //                $('#SHIPPER_State').val(v7);

    //                var v8 = $('#OrgSHIPPER_PostalCode').val();
    //                $('#SHIPPER_PostalCode').val(v8);

    //                var v9 = $('#OrgSHIPPER_MobileNo').val();
    //                $('#SHIPPER_MobileNo').val(v9);

    //                var v10 = $('#OrgSHIPPER_MobileNo2').val();
    //                $('#SHIPPER_MobileNo2').val(v10);

    //                var v11 = $('#OrgSHIPPER_Email').val();
    //                $('#SHIPPER_Email').val(v11);

    //                var v12 = $('#Text_OrgSHIPPER_CountryCode').val();
    //                $('#Text_SHIPPER_CountryCode').val(v12);

    //                var v13 = $('#Text_OrgSHIPPER_City').val();
    //                $('#Text_SHIPPER_City').val(v13);

    //                var v14 = $('#OrgSHIPPER_Fax').val();
    //                $('#SHipper_Fax').val(v14);

    //            }

    //        });




    //        cfi.EnableAutoComplete("SHIPPER_AccountNo", false);
    //        cfi.EnableAutoComplete("SHIPPER_CountryCode", false);
    //        cfi.EnableAutoComplete("SHIPPER_City", false);
    //        $('#SHIPPER_Name').attr('disabled', 'disabled');
    //        $('#SHIPPER_Name2').attr('disabled', 'disabled');
    //        $('#SHIPPER_Street').attr('disabled', 'disabled');
    //        $('#SHIPPER_Street2').attr('disabled', 'disabled');
    //        $('#SHIPPER_TownLocation').attr('disabled', 'disabled');
    //        $('#SHIPPER_PostalCode').attr('disabled', 'disabled');
    //        $('#SHIPPER_MobileNo').attr('disabled', 'disabled');
    //        $('#SHIPPER_MobileNo2').attr('disabled', 'disabled');
    //        $('#SHIPPER_Email').attr('disabled', 'disabled');
    //        $('#SHipper_Fax').attr('disabled', 'disabled');
    //        $('#SHIPPER_State').attr('disabled', 'disabled');
    //    } else {

    //        cfi.EnableAutoComplete("SHIPPER_AccountNo", true);
    //        cfi.EnableAutoComplete("SHIPPER_CountryCode", true);
    //        cfi.EnableAutoComplete("SHIPPER_City", true);
    //        $('#SHIPPER_Name').removeAttr('disabled');
    //        $('#SHIPPER_Name2').removeAttr('disabled');
    //        $('#SHIPPER_Street').removeAttr('disabled');
    //        $('#SHIPPER_Street2').removeAttr('disabled');
    //        $('#SHIPPER_TownLocation').removeAttr('disabled');
    //        $('#SHIPPER_PostalCode').removeAttr('disabled');
    //        $('#SHIPPER_MobileNo').removeAttr('disabled');
    //        $('#SHIPPER_MobileNo2').removeAttr('disabled');
    //        $('#SHIPPER_Email').removeAttr('disabled');
    //        $('#SHipper_Fax').removeAttr('disabled');
    //        $('#SHIPPER_State').removeAttr('disabled');
    //    }
    //});

    //$('[name="SHCCHARGE"]').click(function () {
    //    if ($('input[type="checkbox"][name=SHCCHARGE]').is(':checked') == false) {
    //        var option = jConfirm("Changed <b><i> SHC</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v = $("#divMultiOriginalSHCSNo").html();
    //                $('#divMultiSHCSNo').html(v);
    //            }
    //        });



    //        cfi.EnableAutoComplete("SHCSNo", false);
    //    } else { cfi.EnableAutoComplete("SHCSNo", true); }
    //});

    //$('[name="PRODUCTCHARGE"]').click(function () {
    //    if ($('input[type="checkbox"][name=PRODUCTCHARGE]').is(':checked') == false) {
    //        var option = jConfirm("Changed <b><i> Product </i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v = $('#Text_OriginalProductSNo').val()
    //                $('#Text_ProductSNo').val(v);
    //            }
    //        });



    //        cfi.EnableAutoComplete("ProductSNo", false);
    //    } else { cfi.EnableAutoComplete("ProductSNo", true); }
    //});

    //$('[name="COMMODITYCHARGE"]').click(function () {
    //    if ($('input[type="checkbox"][name=COMMODITYCHARGE]').is(':checked') == false) {
    //        var option = jConfirm("Changed <b><i> Commodity </i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v = $('#Text_OriginalCommoditySNo').val()
    //                $('#Text_CommoditySNo').val(v);
    //            }
    //        });




    //        cfi.EnableAutoComplete("CommoditySNo", false);
    //    } else { cfi.EnableAutoComplete("CommoditySNo", true); }

    //});

    //$('[name="NOGCHANGE"]').click(function () {
    //    if ($('input[type="checkbox"][name=NOGCHANGE]').is(':checked') == false) {
    //        var option = jConfirm("Changed <b><i>Nature Of Goods</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v1 = $('#hdn_NatureOfGoods').text();
    //                $('#NatureOfGoods').val(v1);
    //            }
    //        });

    //             $('#NatureOfGoods').attr('disabled', 'disabled');
    //    } else { $('#NatureOfGoods').removeAttr('disabled'); }
    //});

    //$('[name="PIECESCHARGE"]').click(function () {
    //    if ($('input[type="checkbox"][name=PIECESCHARGE]').is(':checked') == false) {
    //        var option = jConfirm("Changed <b><i>Pieces</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
    //            if (option == true) {
    //                var v = $('#hdn_OriginalPieces').text();
    //                $('#Text_RevisedPieces').val(v);
    //            }
    //        });



    //        $('#Text_RevisedPieces').attr('disabled', 'disabled');
    //    } else { $('#Text_RevisedPieces').removeAttr('disabled'); }
    //});

    //$('[name="IsDueCarrierChange"]').click(function () {
    //    if ($('input[type="checkbox"][name=IsDueCarrierChange]').is(':checked') == false) {
    //        $('#Revfltplan2').hide();
    //    } else { $('#Revfltplan2').show(); }
    //});

    //$('[name="IsDueAgentChange"]').click(function () {
    //    if ($('input[type="checkbox"][name=IsDueAgentChange]').is(':checked') == false) {
    //        $('#Revfltplan3').hide();
    //    } else { $('#Revfltplan3').show(); }
    //});

    //$('[name="IsRepriceAWB"]').click(function () {
    //    if ($('input[type="checkbox"][name=IsRepriceAWB]').is(':checked') == false) {
    //        // $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
    //    }
    //});

    //$('[name="IsTerminateShpt"]').click(function () {
    //    if ($('input[type="checkbox"][name=IsTerminateShpt]').is(':checked') == false) {
    //        // $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
    //    }
    //});

}

//function BindTransit() {
//    if ($("#IsTerminateShpt").is(':checked') == true) {
//        $("#TermianteStation").closest('td').show();
//        $("#Text_TermianteStation").attr('data-valid', 'required').val('');
//        $("#TermianteStation").val('');
//        $("#Text_TermianteStation").val('');
//        $("#IsRepriceAWB").closest('tr').show();
//    }
//    else {
//        $("#TermianteStation").closest('td').hide();
//        $("#Text_TermianteStation").removeAttr('data-valid').val('');
//        $("#TermianteStation").val('');
//        $("#IsRepriceAWB").closest('tr').hide();
//    }
//}

function GetCCADATA() {
    DueCarrierOtherChargeCCA = [];
    DueAgentOtherChargeCCA = [];
    flagdueAgent = 0;
    flagdueCarrier = 0;
    $('#RequestAndApproveBy').hide();
    $('#CCAGeneratedRow').hide();
    var AwbSno;
    var AbSno;
    var ShowData;
    ShowData = 1;
    var PageType = getQueryStringValue("FormAction").toUpperCase();

    AwbSno = $("#Text_AWBSNo").val() //$("#AWBSNo").val();
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
                        AbSno = GetSucessResult.Table0[0].SNo;
                        $("#hdnAWBSNo").val(AbSno);
                        $("#AWBSNo").val(AbSno);
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


                        $("#Text_RevisedVolumeWeight").val(GetSucessResult.Table0[0].RevisedVolumeWeight)
                        $("span#hdn_OriginalVolumeWeight").text(GetSucessResult.Table0[0].OriginalVolumeWeight)



                        $("#Text_RevisedChargeableWeight").val(GetSucessResult.Table0[0].RevisedChargeableWeight);
                        $("span#hdn_OriginalChargeableWeight").text(GetSucessResult.Table0[0].OriginalChargeableWeight);

                        $("#Text_RevisedChargeableWeight").attr('Readonly', 'Readonly');
                        $('#Text_RevisedVolumeWeight').attr('Readonly', 'Readonly');

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


                        //-------------------------------------------Original Commodity,SHC,Product
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

                        //-------------------------------------------Revised Commodity,SHC,Product
                        ////Span 
                        $('#CommoditySNo').val(GetSucessResult.Table0[0].CommoditySNo);
                        $('#Text_CommoditySNo').val(GetSucessResult.Table0[0].Text_CommoditySNo);

                        //$('#divMultiSHCSNo ul li span').not('span[id="FieldKeyValuesSHCSNo"]').click();

                        var SHCSNo = GetSucessResult.Table0[0].SHCSNo.substring(0, GetSucessResult.Table0[0].SHCSNo.length - 1);
                        $('#SHCSNo').val(SHCSNo);
                        var Text_SHCSNo = GetSucessResult.Table0[0].Text_SHCSNo.substring(0, GetSucessResult.Table0[0].Text_SHCSNo.length - 1);
                        $('#Text_SHCSNo').val(Text_SHCSNo);
                        $('#ProductSNo').val(GetSucessResult.Table0[0].ProductSNo);
                        $('#Text_ProductSNo').val(GetSucessResult.Table0[0].Text_ProductSNo);
                        cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
                        $("#NatureOfGoods").val(GetSucessResult.Table0[0].NatureOfGoods)
                        $("#hdn_NatureOfGoods").text(GetSucessResult.Table0[0].NatureOfGoods)
                        //-------------------------------------------------



                        $("span#Shipper").text(GetSucessResult.Table0[0].ShipperName);
                        $("span#Consignee").text(GetSucessResult.Table0[0].ConsigneeName);


                        $("#Text_RevisedShipper").val(GetSucessResult.Table0[0].RevisedShipper);
                        $("#Text_RevisedConsignee").val(GetSucessResult.Table0[0].RevisedConsignee);
                        $("span#hdn_OriginalShipper").text(GetSucessResult.Table0[0].RevisedShipper);
                        $("span#hdn_OriginalConsignee").text(GetSucessResult.Table0[0].RevisedConsignee);



                        $("span#Status").text('Request');

                        $("span#CurrencyCode").text(GetSucessResult.Table0[0].CurrencyCode);
                        $('#divMultiOriginalSHCSNo').find('span').removeClass("k-icon k-delete");


                        //Flight Details
                        if (GetSucessResult.Table1.length > 0) {

                            for (var i = 1; i <= GetSucessResult.Table1.length; i++) {
                                $("span#To" + i + "").text(GetSucessResult.Table1[i - 1].Origin);
                                $("span#FlightNo" + i + "").text(GetSucessResult.Table1[i - 1].FlightNo);
                                $("span#Date" + i + "").text(GetSucessResult.Table1[i - 1].FlightDate);

                                //--------------------------------------------------

                                $("#DepartedPieces" + i + "").val(GetSucessResult.Table1[i - 1].Pieces);
                                $("#DepartedGrossWeight" + i + "").val(GetSucessResult.Table1[i - 1].GrossWeight);
                                $("#DepartedVolume" + i + "").val(GetSucessResult.Table1[i - 1].Volume);
                                $("#DepartedVolumeWeight" + i + "").val(GetSucessResult.Table1[i - 1].VolumeWeight);

                            }
                        }

                        if ($("span#FlightNo1").text().trim() == "") {
                            $("span#FlightDetails1").hide();
                            $("#DepartedPieces1").hide();
                            $("#DepartedGrossWeight1").hide();
                            $("#DepartedVolume1").hide();
                            $("#DepartedVolumeWeight1").hide();
                        }

                        if ($("span#FlightNo2").text().trim() == "") {
                            $("span#FlightDetails2").hide();
                            $("#DepartedPieces2").hide();
                            $("#DepartedGrossWeight2").hide();
                            $("#DepartedVolume2").hide();
                            $("#DepartedVolumeWeight2").hide();
                        }
                        if ($("span#FlightNo3").text().trim() == "") {
                            $("span#FlightDetails3").hide();
                            $("#DepartedPieces3").hide();
                            $("#DepartedGrossWeight3").hide();
                            $("#DepartedVolume3").hide();
                            $("#DepartedVolumeWeight3").hide();
                        }



                        if (GetSucessResult.Table2.length > 0) {
                            if (GetSucessResult.Table2[0].StatusNo <= 9) {
                                if ($("span#FlightNo1").text().trim() != "") {
                                    $("#DepartedPieces1").attr('disabled', 'disabled');
                                    $("#DepartedGrossWeight1").attr('disabled', 'disabled');
                                    $("#DepartedVolume1").attr('disabled', 'disabled');
                                    $("#DepartedVolumeWeight1").attr('disabled', 'disabled');
                                }

                                if ($("span#FlightNo2").text().trim() != "") {
                                    $("#DepartedPieces2").attr('disabled', 'disabled');
                                    $("#DepartedGrossWeight2").attr('disabled', 'disabled');
                                    $("#DepartedVolume2").attr('disabled', 'disabled');
                                    $("#DepartedVolumeWeight2").attr('disabled', 'disabled');
                                }
                                if ($("span#FlightNo3").text().trim() != "") {
                                    $("#DepartedPieces3").attr('disabled', 'disabled');
                                    $("#DepartedGrossWeight3").attr('disabled', 'disabled');
                                    $("#DepartedVolume3").attr('disabled', 'disabled');
                                    $("#DepartedVolumeWeight3").attr('disabled', 'disabled');
                                }
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
                        //--------shipper consignee---------
                        $("#tblOriginalShipper").find('input').attr('disabled', true)
                        $('#tblOriginalShipper').find('[class="k-icon k-i-arrow-s"]').unbind('click')

                        if (GetSucessResult.Table5.length > 0 && GetSucessResult.Table5[0].SNo != '0') {
                            Istransit = "1";
                            $("#IsRepriceAWB").attr('checked', false);
                            $("#IsRepriceAWB").closest('tr').hide();
                            // $("#IsRepriceAWB").show();
                            // $("#IsRepriceAWB").closest('tr').show();
                            // $("#DestinationChange").closest('td').show();


                            // $("#TermianteStation").closest('td').hide();
                            if (GetSucessResult.Table6.length > 0) {
                                $("#IsTerminateShpt").closest('td').show();
                                filterOriginAirport = GetSucessResult.Table6[0].filterOriginAirport;
                                DestinationChange = GetSucessResult.Table7[0].DestinationChange
                            }
                            else {
                                $("#IsTerminateShpt").closest('td').hide();
                                $("#TermianteStation").closest('td').hide();
                            }
                        }
                        else {
                            Istransit = "0";
                            $("#IsRepriceAWB").attr('checked', true);
                            //   $("#IsRepriceAWB").hide();
                            $("#IsRepriceAWB").closest('tr').hide();
                            $("#IsTerminateShpt").closest('td').hide();
                            $("#TermianteStation").closest('td').hide();
                            DestinationChange = GetSucessResult.Table6[0].DestinationChange

                        }

                    }

                    else {
                        ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                        ShowData = 0;
                    }

                    //------------------ Destination change
                    DestinationChange == '0' ? $("#IsDestinationChange").closest('td').hide() : $("#IsDestinationChange").closest('td').show();
                    ApplyRequired();
                    if (GetSucessResult.Table3.length > 0) {
                        $("#SHIPPER_AccountNo").val(GetSucessResult.Table3[0].ShipperAccountNo)
                        $("#Text_SHIPPER_AccountNo").val(GetSucessResult.Table3[0].CustomerNo)
                        $("#SHIPPER_Name").val(GetSucessResult.Table3[0].ShipperName)
                        $("#SHIPPER_Name2").val(GetSucessResult.Table3[0].ShipperName2)
                        $("#SHIPPER_Street").val(GetSucessResult.Table3[0].ShipperStreet)
                        $("#SHIPPER_Street2").val(GetSucessResult.Table3[0].ShipperStreet2)
                        $("#SHIPPER_TownLocation").val(GetSucessResult.Table3[0].ShipperLocation)
                        $("#SHIPPER_State").val(GetSucessResult.Table3[0].ShipperState)
                        $("#SHIPPER_PostalCode").val(GetSucessResult.Table3[0].ShipperPostalCode)
                        $("#SHIPPER_MobileNo").val(GetSucessResult.Table3[0].ShipperMobile)
                        $("#SHIPPER_MobileNo2").val(GetSucessResult.Table3[0].ShipperMobile2)
                        $("#SHIPPER_Email").val(GetSucessResult.Table3[0].ShipperEMail)
                        $("#SHIPPER_CountryCode").val(GetSucessResult.Table3[0].ShipperCountryCode)
                        $("#Text_SHIPPER_CountryCode").val(GetSucessResult.Table3[0].ShipperCountryName)
                        $("#SHIPPER_City").val(GetSucessResult.Table3[0].ShipperCity)
                        $("#Text_SHIPPER_City").val(GetSucessResult.Table3[0].ShipperCityName)
                        $("#SHipper_Fax").val(GetSucessResult.Table3[0].Fax)

                        $("#OrgSHIPPER_AccountNo").val(GetSucessResult.Table3[0].ShipperAccountNo)
                        $("#Text_OrgSHIPPER_AccountNo").val(GetSucessResult.Table3[0].CustomerNo)
                        $("#OrgSHIPPER_Name").val(GetSucessResult.Table3[0].ShipperName)
                        $("#OrgSHIPPER_Name2").val(GetSucessResult.Table3[0].ShipperName2)
                        $("#OrgSHIPPER_Street").val(GetSucessResult.Table3[0].ShipperStreet)
                        $("#OrgSHIPPER_Street2").val(GetSucessResult.Table3[0].ShipperStreet2)
                        $("#OrgSHIPPER_TownLocation").val(GetSucessResult.Table3[0].ShipperLocation)
                        $("#OrgSHIPPER_State").val(GetSucessResult.Table3[0].ShipperState)
                        $("#OrgSHIPPER_PostalCode").val(GetSucessResult.Table3[0].ShipperPostalCode)
                        $("#OrgSHIPPER_MobileNo").val(GetSucessResult.Table3[0].ShipperMobile)
                        $("#OrgSHIPPER_MobileNo2").val(GetSucessResult.Table3[0].ShipperMobile2)
                        $("#OrgSHIPPER_Email").val(GetSucessResult.Table3[0].ShipperEMail)
                        $("#OrgSHIPPER_CountryCode").val(GetSucessResult.Table3[0].ShipperCountryCode)
                        $("#Text_OrgSHIPPER_CountryCode").val(GetSucessResult.Table3[0].ShipperCountryName)
                        $("#OrgSHIPPER_City").val(GetSucessResult.Table3[0].ShipperCity)
                        $("#Text_OrgSHIPPER_City").val(GetSucessResult.Table3[0].ShipperCityName)
                        $("#OrgSHIPPER_Fax").val(GetSucessResult.Table3[0].Fax)
                    }
                    if (GetSucessResult.Table4.length > 0) {
                        $("#CONSIGNEE_AccountNo").val(GetSucessResult.Table4[0].ConsigneeAccountNo)
                        $("#Text_CONSIGNEE_AccountNo").val(GetSucessResult.Table4[0].CustomerNo)
                        $("#CONSIGNEE_AccountNoName").val(GetSucessResult.Table4[0].ConsigneeName)
                        $("#CONSIGNEE_AccountNoName2").val(GetSucessResult.Table4[0].ConsigneeName2)
                        $("#CONSIGNEE_Street").val(GetSucessResult.Table4[0].ConsigneeStreet)
                        $("#CONSIGNEE_Street2").val(GetSucessResult.Table4[0].ConsigneeStreet2)
                        $("#CONSIGNEE_TownLocation").val(GetSucessResult.Table4[0].ConsigneeLocation)
                        $("#CONSIGNEE_State").val(GetSucessResult.Table4[0].ConsigneeState)
                        $("#CONSIGNEE_PostalCode").val(GetSucessResult.Table4[0].ConsigneePostalCode)
                        $("#CONSIGNEE_MobileNo").val(GetSucessResult.Table4[0].ConsigneeMobile)
                        $("#CONSIGNEE_MobileNo2").val(GetSucessResult.Table4[0].ConsigneeMobile2)
                        $("#CONSIGNEE_Email").val(GetSucessResult.Table4[0].ConsigneeEMail)
                        $("#CONSIGNEE_CountryCode").val(GetSucessResult.Table4[0].ConsigneeCountryCode)
                        $("#Text_CONSIGNEE_CountryCode").val(GetSucessResult.Table4[0].ConsigneeCountryName)
                        $("#CONSIGNEE_City").val(GetSucessResult.Table4[0].ConsigneeCity)
                        $("#Text_CONSIGNEE_City").val(GetSucessResult.Table4[0].ConsigneeCityName)
                        $("#CONSIGNEE_Fax").val(GetSucessResult.Table4[0].Fax)

                        $("#OrgCONSIGNEE_AccountNo").val(GetSucessResult.Table4[0].ConsigneeAccountNo)
                        $("#Text_OrgCONSIGNEE_AccountNo").val(GetSucessResult.Table4[0].CustomerNo)
                        $("#OrgCONSIGNEE_AccountNoName").val(GetSucessResult.Table4[0].ConsigneeName)
                        $("#OrgCONSIGNEE_AccountNoName2").val(GetSucessResult.Table4[0].ConsigneeName2)
                        $("#OrgCONSIGNEE_Street").val(GetSucessResult.Table4[0].ConsigneeStreet)
                        $("#OrgCONSIGNEE_Street2").val(GetSucessResult.Table4[0].ConsigneeStreet2)
                        $("#OrgCONSIGNEE_TownLocation").val(GetSucessResult.Table4[0].ConsigneeLocation)
                        $("#OrgCONSIGNEE_State").val(GetSucessResult.Table4[0].ConsigneeState)
                        $("#OrgCONSIGNEE_PostalCode").val(GetSucessResult.Table4[0].ConsigneePostalCode)
                        $("#OrgCONSIGNEE_MobileNo").val(GetSucessResult.Table4[0].ConsigneeMobile)
                        $("#OrgCONSIGNEE_MobileNo2").val(GetSucessResult.Table4[0].ConsigneeMobile2)
                        $("#OrgCONSIGNEE_Email").val(GetSucessResult.Table4[0].ConsigneeEMail)
                        $("#OrgCONSIGNEE_CountryCode").val(GetSucessResult.Table4[0].ConsigneeCountryCode)
                        $("#Text_OrgCONSIGNEE_CountryCode").val(GetSucessResult.Table4[0].ConsigneeCountryName)
                        $("#OrgCONSIGNEE_City").val(GetSucessResult.Table4[0].ConsigneeCity)
                        $("#Text_OrgCONSIGNEE_City").val(GetSucessResult.Table4[0].ConsigneeCityName)
                        $("#OrgCONSIGNEE_Fax").val(GetSucessResult.Table4[0].Fax)
                    }
                    //------------------------flight plan data-----------------
                    //  setflightplandata();
                    //-------------END-------------------------------------------

                }

                else {
                    ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                    ShowData = 0;
                }
            },
            complete: function () {
                AWBSNo = $("#Text_AWBSNo").val();
                if (ShowData != 0) {
                    AWBSNo = AbSno;
                    setflightplandata(AWBSNo, 0);
                }
                // DueAgentTab()
                // DueCarrierTab();
            }
        });
    }

    //----------------------------------------------------------
    if ($('input[type="checkbox"][name=WEIGHTDISCREP]').is(':checked') == false) {
        $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
        $('#Text_RevisedVolume').attr('disabled', 'disabled');
        $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
        cfi.EnableAutoComplete("SHCSNo", false);
        cfi.EnableAutoComplete("ProductSNo", false);
        cfi.EnableAutoComplete("CommoditySNo", false);
        $('#Text_RevisedPieces').attr('disabled', 'disabled');
        $('#Revfltplan2').hide();
        $('#Revfltplan3').hide();
        $('#NatureOfGoods').attr('disabled', 'disabled');
        $('#Text_RevisedChargeableWeight').attr('disabled', 'disabled');
        $('#Text_RevisedVolumeWeight').attr('disabled', 'disabled');


        /*disable shiper*/

        cfi.EnableAutoComplete("SHIPPER_AccountNo", false);
        cfi.EnableAutoComplete("SHIPPER_CountryCode", false);
        cfi.EnableAutoComplete("SHIPPER_City", false);
        $('#SHIPPER_Name').attr('disabled', 'disabled');
        $('#SHIPPER_Name2').attr('disabled', 'disabled');
        $('#SHIPPER_Street').attr('disabled', 'disabled');
        $('#SHIPPER_Street2').attr('disabled', 'disabled');
        $('#SHIPPER_TownLocation').attr('disabled', 'disabled');
        $('#SHIPPER_PostalCode').attr('disabled', 'disabled');
        $('#SHIPPER_MobileNo').attr('disabled', 'disabled');
        $('#SHIPPER_MobileNo2').attr('disabled', 'disabled');
        $('#SHIPPER_Email').attr('disabled', 'disabled');
        $('#SHipper_Fax').attr('disabled', 'disabled');
        $('#SHIPPER_State').attr('disabled', 'disabled');

        /* disable consignee*/
        cfi.EnableAutoComplete("CONSIGNEE_AccountNo", false);
        cfi.EnableAutoComplete("CONSIGNEE_CountryCode", false);
        cfi.EnableAutoComplete("CONSIGNEE_City", false);
        $('#CONSIGNEE_AccountNoName').attr('disabled', 'disabled');
        $('#OrgSHIPPER_Name2').attr('disabled', 'disabled');
        $('#OrgSHIPPER_Street').attr('disabled', 'disabled');
        $('#OrgSHIPPER_Street2').attr('disabled', 'disabled');
        $('#OrgSHIPPER_TownLocation').attr('disabled', 'disabled');
        $('#OrgSHIPPER_State').attr('disabled', 'disabled');
        $('#OrgSHIPPER_PostalCode').attr('disabled', 'disabled');
        $('#OrgSHIPPER_MobileNo').attr('disabled', 'disabled');
        $('#OrgSHIPPER_MobileNo2').attr('disabled', 'disabled');
        $('#CONSIGNEE_MobileNo2').attr('disabled', 'disabled');
        $('#OrgSHIPPER_Email').attr('disabled', 'disabled');
        $('#OrgCONSIGNEE_Fax').attr('disabled', 'disabled');
        $('#CONSIGNEE_Street2').attr('disabled', 'disabled');
        $('#CONSIGNEE_AccountNoName2').attr('disabled', 'disabled');
        $('#CONSIGNEE_MobileNo').attr('disabled', 'disabled');
        $('#CONSIGNEE_Street').attr('disabled', 'disabled');
        $('#CONSIGNEE_TownLocation').attr('disabled', 'disabled');
        $('#CONSIGNEE_Fax').attr('disabled', 'disabled');
        $('#CONSIGNEE_State').attr('disabled', 'disabled');
        $('#CONSIGNEE_PostalCode').attr('disabled', 'disabled');
        $('#CONSIGNEE_Email').attr('disabled', 'disabled');


    }

    $('[name="WEIGHTDISCREP"]').click(function () {
        if ($('input[type="checkbox"][name=WEIGHTDISCREP]').is(':checked') == false) {
            var option = jConfirm("Changed <b><i>Gross Weight</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v = $('#hdn_OriginalGrossWeight').text();
                    $('#Text_RevisedGrossWeight').val(v);
                } else {
                    $('input[type="checkbox"][name=WEIGHTDISCREP]').prop('checked', true);
                    $('#Text_RevisedGrossWeight').removeAttr('disabled');
                }

            });

            $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
        } else { $('#Text_RevisedGrossWeight').removeAttr('disabled'); }
    });

    $('[name="VOLUMEDISCREP"]').click(function () {
        if ($('input[type="checkbox"][name=VOLUMEDISCREP]').is(':checked') == false) {
            var option = jConfirm("Changed <b><i>Volume, Volume Weight</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v1 = $('#hdn_OriginalVolume').text();
                    $('#Text_RevisedVolume').val(v1);
                    var v2 = $('#hdn_OriginalVolumeWeight').text();
                    $('#Text_RevisedVolumeWeight').val(v2);

                } else {
                    $('input[type="checkbox"][name=VOLUMEDISCREP]').prop('checked', true);
                    $('#Text_RevisedVolume').removeAttr('disabled');
                }

            });

            $('#Text_RevisedVolume').attr('disabled', 'disabled');
            $('#Text_RevisedVolumeWeight').attr('disabled', 'disabled');
        } else {
            $('#Text_RevisedVolume').removeAttr('disabled');
            $('#Text_RevisedVolumeWeight').removeAttr('disabled');
        }
    });

    $('[name="CNEECHANGE"]').click(function () {
        if ($('input[type="checkbox"][name=CNEECHANGE]').is(':checked') == false) {
            var option = jConfirm("Changed <b><i>Consignee Information</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v1 = $('#Text_OrgCONSIGNEE_AccountNo').val();
                    $('#Text_CONSIGNEE_AccountNo').val(v1);

                    var v2 = $('#OrgCONSIGNEE_AccountNoName').val();
                    $('#CONSIGNEE_AccountNoName').val(v2);

                    var v3 = $('#OrgCONSIGNEE_AccountNoName2').val();
                    $('#CONSIGNEE_AccountNoName2').val(v3);

                    var v4 = $('#OrgCONSIGNEE_Street').val();
                    $('#CONSIGNEE_Street').val(v4);

                    var v5 = $('#OrgCONSIGNEE_Street2').val();
                    $('#CONSIGNEE_Street2').val(v5);

                    var v6 = $('#OrgCONSIGNEE_TownLocation').val();
                    $('#CONSIGNEE_TownLocation').val(v6);

                    var v7 = $('#OrgCONSIGNEE_State').val();
                    $('#CONSIGNEE_State').val(v7);

                    var v8 = $('#OrgCONSIGNEE_PostalCode').val();
                    $('#CONSIGNEE_PostalCode').val(v8);

                    var v9 = $('#OrgCONSIGNEE_MobileNo').val();
                    $('#CONSIGNEE_MobileNo').val(v9);

                    var v10 = $('#OrgCONSIGNEE_MobileNo2').val();
                    $('#CONSIGNEE_MobileNo2').val(v10);

                    var v11 = $('#OrgCONSIGNEE_Email').val();
                    $('#CONSIGNEE_Email').val(v11);

                    var v12 = $('#Text_OrgCONSIGNEE_CountryCode').val();
                    $('#Text_CONSIGNEE_CountryCode').val(v12);

                    var v13 = $('#Text_OrgCONSIGNEE_City').val();
                    $('#Text_CONSIGNEE_City').val(v13);

                    var v14 = $('#OrgCONSIGNEE_Fax').val();
                    $('#CONSIGNEE_Fax').val(v14);

                } else {
                    $('input[type="checkbox"][name=CNEECHANGE]').prop('checked', true);
                    cfi.EnableAutoComplete("CONSIGNEE_AccountNo", true);
                    cfi.EnableAutoComplete("CONSIGNEE_CountryCode", true);
                    cfi.EnableAutoComplete("CONSIGNEE_City", true);
                    $('#CONSIGNEE_AccountNoName').removeAttr('disabled');

                    $('#CONSIGNEE_AccountNoName2').removeAttr('disabled');

                    $('#CONSIGNEE_Street ').removeAttr('disabled');

                    $('#CONSIGNEE_Street2').removeAttr('disabled');

                    $('#CONSIGNEE_TownLocation').removeAttr('disabled');

                    $('#CONSIGNEE_State').removeAttr('disabled');

                    $('#CONSIGNEE_PostalCode').removeAttr('disabled');

                    $('#CONSIGNEE_MobileNo').removeAttr('disabled');

                    $('#CONSIGNEE_MobileNo2').removeAttr('disabled');

                    $('#CONSIGNEE_Email').removeAttr('disabled');

                    $('#CONSIGNEE_Fax').removeAttr('disabled');
                }

            });

            cfi.EnableAutoComplete("CONSIGNEE_AccountNo", false);
            cfi.EnableAutoComplete("CONSIGNEE_CountryCode", false);
            cfi.EnableAutoComplete("CONSIGNEE_City", false);
            $('#CONSIGNEE_AccountNoName').attr('disabled', 'disabled');

            $('#CONSIGNEE_AccountNoName2').attr('disabled', 'disabled');

            $('#CONSIGNEE_Street ').attr('disabled', 'disabled');

            $('#CONSIGNEE_Street2').attr('disabled', 'disabled');

            $('#CONSIGNEE_TownLocation').attr('disabled', 'disabled');

            $('#CONSIGNEE_State').attr('disabled', 'disabled');

            $('#CONSIGNEE_PostalCode').attr('disabled', 'disabled');

            $('#CONSIGNEE_MobileNo').attr('disabled', 'disabled');

            $('#CONSIGNEE_MobileNo2').attr('disabled', 'disabled');

            $('#CONSIGNEE_Email').attr('disabled', 'disabled');

            $('#CONSIGNEE_Fax').attr('disabled', 'disabled');


        } else {
            cfi.EnableAutoComplete("CONSIGNEE_AccountNo", true);
            cfi.EnableAutoComplete("CONSIGNEE_CountryCode", true);
            cfi.EnableAutoComplete("CONSIGNEE_City", true);
            $('#CONSIGNEE_AccountNoName').removeAttr('disabled');

            $('#CONSIGNEE_AccountNoName2').removeAttr('disabled');

            $('#CONSIGNEE_Street ').removeAttr('disabled');

            $('#CONSIGNEE_Street2').removeAttr('disabled');

            $('#CONSIGNEE_TownLocation').removeAttr('disabled');

            $('#CONSIGNEE_State').removeAttr('disabled');

            $('#CONSIGNEE_PostalCode').removeAttr('disabled');

            $('#CONSIGNEE_MobileNo').removeAttr('disabled');

            $('#CONSIGNEE_MobileNo2').removeAttr('disabled');

            $('#CONSIGNEE_Email').removeAttr('disabled');

            $('#CONSIGNEE_Fax').removeAttr('disabled');
        }
    });

    $('[name="SHPRCHANGE"]').click(function () {
        if ($('input[type="checkbox"][name=SHPRCHANGE]').is(':checked') == false) {

            var option = jConfirm("Changed <b><i>Shipper Information</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v1 = $('#Text_OrgSHIPPER_AccountNo').val();
                    $('#Text_SHIPPER_AccountNo').val(v1);

                    var v2 = $('#OrgSHIPPER_Name').val();
                    $('#SHIPPER_Name').val(v2);

                    var v3 = $('#OrgSHIPPER_Name2').val();
                    $('#SHIPPER_Name2 ').val(v3);

                    var v4 = $('#OrgSHIPPER_Street').val();
                    $('#SHIPPER_Street').val(v4);

                    var v5 = $('#OrgSHIPPER_Street2').val();
                    $('#SHIPPER_Street2').val(v5);

                    var v6 = $('#OrgSHIPPER_TownLocation').val();
                    $('#SHIPPER_TownLocation').val(v6);

                    var v7 = $('#OrgSHIPPER_State').val();
                    $('#SHIPPER_State').val(v7);

                    var v8 = $('#OrgSHIPPER_PostalCode').val();
                    $('#SHIPPER_PostalCode').val(v8);

                    var v9 = $('#OrgSHIPPER_MobileNo').val();
                    $('#SHIPPER_MobileNo').val(v9);

                    var v10 = $('#OrgSHIPPER_MobileNo2').val();
                    $('#SHIPPER_MobileNo2').val(v10);

                    var v11 = $('#OrgSHIPPER_Email').val();
                    $('#SHIPPER_Email').val(v11);

                    var v12 = $('#Text_OrgSHIPPER_CountryCode').val();
                    $('#Text_SHIPPER_CountryCode').val(v12);

                    var v13 = $('#Text_OrgSHIPPER_City').val();
                    $('#Text_SHIPPER_City').val(v13);

                    var v14 = $('#OrgSHIPPER_Fax').val();
                    $('#SHipper_Fax').val(v14);

                }
                else {
                    $('input[type="checkbox"][name=SHPRCHANGE]').prop('checked', true);
                    cfi.EnableAutoComplete("SHIPPER_AccountNo", true);
                    cfi.EnableAutoComplete("SHIPPER_CountryCode", true);
                    cfi.EnableAutoComplete("SHIPPER_City", true);
                    $('#SHIPPER_Name').removeAttr('disabled');
                    $('#SHIPPER_Name2').removeAttr('disabled');
                    $('#SHIPPER_Street').removeAttr('disabled');
                    $('#SHIPPER_Street2').removeAttr('disabled');
                    $('#SHIPPER_TownLocation').removeAttr('disabled');
                    $('#SHIPPER_PostalCode').removeAttr('disabled');
                    $('#SHIPPER_MobileNo').removeAttr('disabled');
                    $('#SHIPPER_MobileNo2').removeAttr('disabled');
                    $('#SHIPPER_Email').removeAttr('disabled');
                    $('#SHipper_Fax').removeAttr('disabled');
                    $('#SHIPPER_State').removeAttr('disabled');
                }

            });




            cfi.EnableAutoComplete("SHIPPER_AccountNo", false);
            cfi.EnableAutoComplete("SHIPPER_CountryCode", false);
            cfi.EnableAutoComplete("SHIPPER_City", false);
            $('#SHIPPER_Name').attr('disabled', 'disabled');
            $('#SHIPPER_Name2').attr('disabled', 'disabled');
            $('#SHIPPER_Street').attr('disabled', 'disabled');
            $('#SHIPPER_Street2').attr('disabled', 'disabled');
            $('#SHIPPER_TownLocation').attr('disabled', 'disabled');
            $('#SHIPPER_PostalCode').attr('disabled', 'disabled');
            $('#SHIPPER_MobileNo').attr('disabled', 'disabled');
            $('#SHIPPER_MobileNo2').attr('disabled', 'disabled');
            $('#SHIPPER_Email').attr('disabled', 'disabled');
            $('#SHipper_Fax').attr('disabled', 'disabled');
            $('#SHIPPER_State').attr('disabled', 'disabled');
        } else {

            cfi.EnableAutoComplete("SHIPPER_AccountNo", true);
            cfi.EnableAutoComplete("SHIPPER_CountryCode", true);
            cfi.EnableAutoComplete("SHIPPER_City", true);
            $('#SHIPPER_Name').removeAttr('disabled');
            $('#SHIPPER_Name2').removeAttr('disabled');
            $('#SHIPPER_Street').removeAttr('disabled');
            $('#SHIPPER_Street2').removeAttr('disabled');
            $('#SHIPPER_TownLocation').removeAttr('disabled');
            $('#SHIPPER_PostalCode').removeAttr('disabled');
            $('#SHIPPER_MobileNo').removeAttr('disabled');
            $('#SHIPPER_MobileNo2').removeAttr('disabled');
            $('#SHIPPER_Email').removeAttr('disabled');
            $('#SHipper_Fax').removeAttr('disabled');
            $('#SHIPPER_State').removeAttr('disabled');
        }
    });

    $('[name="SHCCHARGE"]').click(function () {
        if ($('input[type="checkbox"][name=SHCCHARGE]').is(':checked') == false) {
            var option = jConfirm("Changed <b><i> SHC</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v = $("#divMultiOriginalSHCSNo").html();
                    $('#divMultiSHCSNo').html(v);
                } else {
                    $('input[type="checkbox"][name=SHCCHARGE]').prop('checked', true);
                    cfi.EnableAutoComplete("SHCSNo", true);
                }
            });



            cfi.EnableAutoComplete("SHCSNo", false);
        } else { cfi.EnableAutoComplete("SHCSNo", true); }
    });

    $('[name="PRODUCTCHARGE"]').click(function () {
        if ($('input[type="checkbox"][name=PRODUCTCHARGE]').is(':checked') == false) {
            var option = jConfirm("Changed <b><i> Product </i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v = $('#Text_OriginalProductSNo').val()
                    $('#Text_ProductSNo').val(v);
                } else {
                    $('input[type="checkbox"][name=PRODUCTCHARGE]').prop('checked', true);
                    cfi.EnableAutoComplete("ProductSNo", true);
                }
            });



            cfi.EnableAutoComplete("ProductSNo", false);
        } else { cfi.EnableAutoComplete("ProductSNo", true); }
    });

    $('[name="COMMODITYCHARGE"]').click(function () {
        if ($('input[type="checkbox"][name=COMMODITYCHARGE]').is(':checked') == false) {
            var option = jConfirm("Changed <b><i> Commodity </i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v = $('#Text_OriginalCommoditySNo').val()
                    $('#Text_CommoditySNo').val(v);
                } else {
                    $('input[type="checkbox"][name=COMMODITYCHARGE]').prop('checked', true);
                    cfi.EnableAutoComplete("CommoditySNo", true);
                }
            });




            cfi.EnableAutoComplete("CommoditySNo", false);
        } else { cfi.EnableAutoComplete("CommoditySNo", true); }

    });

    $('[name="NOGCHANGE"]').click(function () {
        if ($('input[type="checkbox"][name=NOGCHANGE]').is(':checked') == false) {
            var option = jConfirm("Changed <b><i>Nature Of Goods</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v1 = $('#hdn_NatureOfGoods').text();
                    $('#NatureOfGoods').val(v1);
                } else {
                    $('input[type="checkbox"][name=NOGCHANGE]').prop('checked', true);
                    $('#NatureOfGoods').removeAttr('disabled');
                }
            });

            $('#NatureOfGoods').attr('disabled', 'disabled');
        } else { $('#NatureOfGoods').removeAttr('disabled'); }
    });

    $('[name="PIECESCHARGE"]').click(function () {
        if ($('input[type="checkbox"][name=PIECESCHARGE]').is(':checked') == false) {
            var option = jConfirm("Changed <b><i>Pieces</i></b>,   will get reset as previous value. Do you wish to continue?", "", function (option) {
                if (option == true) {
                    var v = $('#hdn_OriginalPieces').text();
                    $('#Text_RevisedPieces').val(v);
                } else {
                    $('input[type="checkbox"][name=PIECESCHARGE]').prop('checked', true);
                    $('#Text_RevisedPieces').removeAttr('disabled');
                }
            });



            $('#Text_RevisedPieces').attr('disabled', 'disabled');
        } else { $('#Text_RevisedPieces').removeAttr('disabled'); }
    });

    $('[name="IsDueCarrierChange"]').click(function () {
        if ($('input[type="checkbox"][name=IsDueCarrierChange]').is(':checked') == false) {
            $('#Revfltplan2').hide();
        } else { $('#Revfltplan2').show(); }
    });

    $('[name="IsDueAgentChange"]').click(function () {
        if ($('input[type="checkbox"][name=IsDueAgentChange]').is(':checked') == false) {
            $('#Revfltplan3').hide();
        } else { $('#Revfltplan3').show(); }
    });

    $('[name="IsRepriceAWB"]').click(function () {
        if ($('input[type="checkbox"][name=IsRepriceAWB]').is(':checked') == false) {
            // $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
        }
    });

    $('[name="IsTerminateShpt"]').click(function () {
        if ($('input[type="checkbox"][name=IsTerminateShpt]').is(':checked') == false) {
            // $('#Text_RevisedGrossWeight').attr('disabled', 'disabled');
        }
    });

}

function BindTransit() {
    if ($("#IsTerminateShpt").is(':checked') == true) {
        $("#TermianteStation").closest('td').show();
        $("#Text_TermianteStation").attr('data-valid', 'required').val('');
        $("#TermianteStation").val('');
        $("#Text_TermianteStation").val('');
        $("#IsRepriceAWB").closest('tr').show();
        $("#IsDestinationChange").prop('checked', false);
        $("#DestinationChange").closest('td').hide();
    }
    else {
        $("#TermianteStation").closest('td').hide();
        $("#Text_TermianteStation").removeAttr('data-valid').val('');
        $("#TermianteStation").val('');
        $("#IsRepriceAWB").closest('tr').hide();
    }
}

function SaveCCA() {

    $("#tbl").cfValidator();
    if (!$("#tbl").data('cfValidator').validate()) {
        $(".bVErrMsgContainer").closest('td').find('input').focus();
        return false;
    }
    if ((parseFloat($("#Text_RevisedGrossWeight").val()) <= 0.000) || (parseFloat($("#Text_RevisedGrossWeight").val()) <= 0) || $("#Text_RevisedGrossWeight").val() == "") {

        ShowMessage('warning', 'Warning - CCA', "Gross Weight Can Not be Blank !");
        return false;
    }
    else if ((parseInt($("#Text_RevisedPieces").val()) <= 0.000) || (parseInt($("#Text_RevisedPieces").val()) <= 0) || $("#Text_RevisedPieces").val() == "") {

        ShowMessage('warning', 'Warning - CCA', "Pieces Can Not be Blank !");
        return false;
    }
    else if (($("#Text_RevisedVolume").val() <= 0.000) || ($("#Text_RevisedVolume").val() <= 0) || $("#Text_RevisedVolume").val() == "") {

        ShowMessage('warning', 'Warning - CCA', "Volume Can Not be Blank !");
        return false;
    }
    else if (($("#Text_RevisedVolumeWeight").val() <= 0.000) || ($("#Text_RevisedVolumeWeight").val() <= 0) || $("#Text_RevisedVolumeWeight").val() == "") {

        ShowMessage('warning', 'Warning - CCA', "Volume Weight Can Not be Blank !");
        return false;
    }


    else if ($("span#FlightNo1").text().trim() != "") {
        if (($("#DepartedPieces1").val() <= 0.000) || ($("#DepartedPieces1").val() <= 0) || $("#DepartedPieces1").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Pieces Can Not be Blank !");
            $("#DepartedPieces1").focus();
            return false;
        }
        else if (($("#DepartedGrossWeight1").val() <= 0.000) || ($("#DepartedGrossWeight1").val() <= 0) || $("#DepartedGrossWeight1").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Gross Weight Can Not be Blank !");
            $("#DepartedGrossWeight1").focus();
            return false;
        }
        else if (($("#DepartedVolume1").val() <= 0.000) || ($("#DepartedVolume1").val() <= 0) || $("#DepartedVolume1").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Volume  Can Not be Blank !");
            $("#DepartedVolume1").focus();
            return false;
        }

    }

    else if ($("span#FlightNo2").text().trim() != "") {
        if (($("#DepartedPieces2").val() <= 0.000) || ($("#DepartedPieces2").val() <= 0) || $("#DepartedPieces2").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Pieces Can Not be Blank !");
            $("#DepartedPieces2").focus();
            return false;
        }
        else if (($("#DepartedGrossWeight2").val() <= 0.000) || ($("#DepartedGrossWeight2").val() <= 0) || $("#DepartedGrossWeight2").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Gross Weight Can Not be Blank !");
            $("#DepartedGrossWeight2").focus();

            return false;
        }
        else if (($("#DepartedVolume2").val() <= 0.000) || ($("#DepartedVolume2").val() <= 0) || $("#DepartedVolume2").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Volume  Can Not be Blank !");
            $("#DepartedVolume2").focus();
            return false;
        }

    }

    else if ($("span#FlightNo3").text().trim() != "") {
        if (($("#DepartedPieces3").val() <= 0.000) || ($("#DepartedPieces3").val() <= 0) || $("#DepartedPieces3").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Pieces Can Not be Blank !");
            $("#DepartedPieces3").focus();
            return false;
        }
        else if (($("#DepartedGrossWeight3").val() <= 0.000) || ($("#DepartedGrossWeight3").val() <= 0) || $("#DepartedGrossWeight3").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Gross Weight Can Not be Blank !");
            $("#DepartedGrossWeight3").focus();
            return false;
        }
        else if (($("#DepartedVolume3").val() <= 0.000) || ($("#DepartedVolume3").val() <= 0) || $("#DepartedVolume3").val() == "") {
            ShowMessage('warning', 'Warning - CCA', "Volume  Can Not be Blank !");
            $("#DepartedVolume3").focus();
            return false;
        }

    }



    if ($("input[type='checkbox'][id!='IsRepriceAWB'][class='CCAReason']:checked").val() == undefined || $("input[type='checkbox'][id!='IsRepriceAWB'][class='CCAReason']:checked").val() == "") {

        ShowMessage('warning', 'Warning - CCA ', "Atleast one reason for creating the CCA has to be selected from  the checklist !");
        return false;
    }


    if ($('#Text_Remarks').val().trim() == "" || $('#Text_Remarks').val() == undefined) {
        $('#Text_Remarks').focus()
        ShowMessage('warning', 'Warning - CCA', "Remarks are Mandatory !");
        return false;
    }

    if (PageType == "EDIT") {
        //if (Approve.includes(LoginType)) {
        if (userContext.SpecialRights["CCAAPPR"] == true) {
            if ($('#Text_RemarksApproved').val() == "" || $('#Text_RemarksApproved').val() == undefined) {
                $('#Text_RemarksApproved').focus()
                ShowMessage('warning', 'Warning - CCA', "Remarks are Mandatory !");
                return false;
            }
        }

    }

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

    //-----------Remove condition (disable buutons after one click)----------------------------;
    //$('input[type="submit"][value=Save]').attr('disabled', true);
    //$('input[type="submit"][value=Approve]').attr('disabled', true);
    //$('input[type="submit"][value=Update]').attr('disabled', true);
    //$('input[type="submit"][value=Delete]').attr('disabled', true);
    //$('input[type="submit"][value=Reject]').attr('disabled', true);



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
        RevisedWeightUnit: $("#Text_RevisedWeightUnit").val() == '' ? '0' : $("#Text_RevisedWeightUnit").val() || "",
        OriginalWeightUnit: $("span#hdn_OriginalWeightUnit").html() == '' ? '0' : $("span#hdn_OriginalWeightUnit").html() || "",
        RevisedVolume: $("#Text_RevisedVolume").val() == '' ? '0' : $("#Text_RevisedVolume").val(),
        OriginalVolume: $("span#hdn_OriginalVolume").html() == '' ? '0' : $("span#hdn_OriginalVolume").html(),
        RevisedVolumeWeight: $("#Text_RevisedVolumeWeight").val() == '' ? '0' : $("#Text_RevisedVolumeWeight").val(),
        OriginalVolumeWeight: $("span#hdn_OriginalVolumeWeight").html() == '' ? '0' : $("span#hdn_OriginalVolumeWeight").html(),
        RevisedChargeableWeight: $("#Text_RevisedChargeableWeight").val(),
        OriginalChargeableWeight: $("span#hdn_OriginalChargeableWeight").html(),
        shipper: $("span#Shipper").html() || "",
        Consignee: $("span#Consignee").html() || "",
        ISWEIGHTDISCREP: $('input[type="checkbox"][name=WEIGHTDISCREP]:checked').val() == undefined ? '0' : '1',
        ISVOLUMEDISCREP: $('input[type="checkbox"][name=VOLUMEDISCREP]:checked').val() == undefined ? '0' : '1',
        ISCNEECHANGE: $('input[type="checkbox"][name=CNEECHANGE]:checked').val() == undefined ? '0' : '1',
        ISDESTCHANGE: $('input[type="checkbox"][name=DESTCHANGE]:checked').val() == undefined ? '0' : '1',
        ISRATEERROR: $('input[type="checkbox"][name=RATEERROR]:checked').val() == undefined ? '0' : '1',
        ISCCACHARGE: $('input[type="checkbox"][name=CCACHARGE]:checked').val() == undefined ? '0' : '1',
        RevisedCommoditySNo: $('#CommoditySNo').val() == '' ? '0' : $('#CommoditySNo').val(),
        OriginalCommoditySNo: $('#OriginalCommoditySNo').val() == '' ? '0' : $('#OriginalCommoditySNo').val(),
        RevisedSHCSNo: $('#SHCSNo').val() == '' ? '' : $('#SHCSNo').val(),
        OriginalSHCSNo: $('#OriginalSHCSNo').val() == '' ? '0' : $('#OriginalSHCSNo').val(),
        RevisedProductSNo: $('#ProductSNo').val() == '' ? '0' : $('#ProductSNo').val(),
        OriginalProductSNo: $('#OriginalProductSNo').val() == '' ? '0' : $('#OriginalProductSNo').val(),
        ISSHCCHARGE: $('input[type="checkbox"][name=SHCCHARGE]:checked').val() == undefined ? '0' : '1',
        ISPRODUCTCHARGE: $('input[type="checkbox"][name=PRODUCTCHARGE]:checked').val() == undefined ? '0' : '1',
        ISCOMMODITYCHARGE: $('input[type="checkbox"][name=COMMODITYCHARGE]:checked').val() == undefined ? '0' : '1',
        ISPIECESCHARGE: $('input[type="checkbox"][name=PIECESCHARGE]:checked').val() == undefined ? '0' : '1',
        Revisedshipper: $('#Text_RevisedShipper').val() || "",
        RevisedConsignee: $('#Text_RevisedConsignee').val() || "",
        ISSHPRCHANGE: $('input[type="checkbox"][name=SHPRCHANGE]:checked').val() == undefined ? '0' : '1',
        OriginalNOG: $("#hdn_NatureOfGoods").text(),
        RevisedNOG: $("#NatureOfGoods").val(),
        ISNOGCHANGE: $('input[type="checkbox"][name=NOGCHANGE]:checked').val() == undefined ? '0' : '1',

    };

    CCAInList.push(Array);







    //------- shipper  details---------------------
    var CCACustomerTrans = [];
    var arr = {
        SNo: 0,
        CCASNo: 0,
        AWBSNo: $("#AWBSNo").val() || 0,
        RevisedCustomerTypeSNo: 0,
        RevisedCustomerSNo: $("#SHIPPER_AccountNo").val() || 0,
        RevisedCustomerAccountNo: 0,
        RevisedCustomerName: $("#SHIPPER_Name").val(),
        RevisedCustomerName2: $("#SHIPPER_Name2").val(),
        RevisedStreet: $("#SHIPPER_Street").val(),
        RevisedStreet2: $("#SHIPPER_Street2").val(),
        RevisedLocation: $("#SHIPPER_TownLocation").val(),
        RevisedCitySno: $("#Text_SHIPPER_City").data("kendoAutoComplete").key() || 0,
        RevisedCountrySno: $("#SHIPPER_CountryCode").val() || 0,
        RevisedState: $("#SHIPPER_State").val(),
        RevisedPostalCode: $("#SHIPPER_PostalCode").val(),
        RevisedPhone: $("#SHIPPER_MobileNo").val(),
        RevisedPhone2: $("#SHIPPER_MobileNo2").val(),
        RevisedFax: $("#SHipper_Fax").val() || "",
        RevisedEmail: $("#SHIPPER_Email").val(),
        //----------org----------
        OriginalCustomerTypeSNo: 0,
        OriginalCustomerSNo: $("#OrgSHIPPER_AccountNo").val() || 0,
        OriginalCustomerAccountNo: 0,
        OriginalCustomerName: $("#OrgSHIPPER_Name").val(),
        OriginalCustomerName2: $("#OrgSHIPPER_Name2").val(),
        OriginalStreet: $("#OrgSHIPPER_Street").val(),
        OriginalStreet2: $("#OrgSHIPPER_Street2").val(),
        OriginalLocation: $("#OrgSHIPPER_TownLocation").val(),
        OriginalCitySno: $("#Text_OrgSHIPPER_City").data("kendoAutoComplete").key() || 0,
        OriginalCountrySno: $("#OrgSHIPPER_CountryCode").val() || 0,
        OriginalState: $("#OrgSHIPPER_State").val(),
        OriginalPostalCode: $("#OrgSHIPPER_PostalCode").val(),
        OriginalPhone: $("#OrgSHIPPER_MobileNo").val(),
        OriginalPhone2: $("#OrgSHIPPER_MobileNo2").val(),
        OriginalFax: $("#OrgSHipper_Fax").val() || "",
        OriginalEmail: $("#OrgSHIPPER_Email").val()
    };
    CCACustomerTrans.push(arr);
    //---------------  consignee details-----------------
    var arr1 = {
        SNo: 0,
        CCASNo: 0,
        AWBSNo: $("#AWBSNo").val() || 0,
        RevisedCustomerTypeSNo: 0,
        RevisedCustomerSNo: $("#CONSIGNEE_AccountNo").val() || 0, //$("CONSIGNEE_AccountNo").val(),
        RevisedCustomerAccountNo: 0,
        RevisedCustomerName: $("#CONSIGNEE_AccountNoName").val(),
        RevisedCustomerName2: $("#CONSIGNEE_AccountNoName2").val(),
        RevisedStreet: $("#CONSIGNEE_Street").val(),
        RevisedStreet2: $("#CONSIGNEE_Street2").val(),
        RevisedLocation: $("#CONSIGNEE_TownLocation").val(),
        RevisedCitySno: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key() || 0,
        RevisedCountrySno: $("#CONSIGNEE_CountryCode").val() || 0,
        RevisedState: $("#CONSIGNEE_State").val(),
        RevisedPostalCode: $("#CONSIGNEE_PostalCode").val(),
        RevisedPhone: $("#CONSIGNEE_MobileNo").val(),
        RevisedPhone2: $("#CONSIGNEE_MobileNo2").val(),
        RevisedFax: $("#CONSIGNEE_Fax").val() || "",
        RevisedEmail: $("#CONSIGNEE_Email").val(),
        //----------org---------- CONSIGNEE_AccountNoName
        OriginalCustomerTypeSNo: 0,
        OriginalCustomerSNo: $("#OrgCONSIGNEE_AccountNo").val() || 0,
        OriginalCustomerAccountNo: 0,
        OriginalCustomerName: $("#OrgCONSIGNEE_AccountNoName").val(),
        OriginalCustomerName2: $("#OrgCONSIGNEE_AccountNoName2").val(),
        OriginalStreet: $("#OrgCONSIGNEE_Street").val(),
        OriginalStreet2: $("#OrgCONSIGNEE_Street2").val(),
        OriginalLocation: $("#OrgCONSIGNEE_TownLocation").val(),
        OriginalCitySno: $("#Text_OrgCONSIGNEE_City").data("kendoAutoComplete").key() || 0,
        OriginalCountrySno: $("#OrgCONSIGNEE_CountryCode").val() || 0,
        OriginalState: $("#OrgCONSIGNEE_State").val(),
        OriginalPostalCode: $("#OrgCONSIGNEE_PostalCode").val(),
        OriginalPhone: $("#OrgCONSIGNEE_MobileNo").val(),
        OriginalPhone2: $("#OrgCONSIGNEE_MobileNo2").val(),
        OriginalFax: $("#OrgCONSIGNEE_Fax").val() || "",
        OriginalEmail: $("#OrgCONSIGNEE_Email").val()
    };
    CCACustomerTrans.push(arr1);


    var ActionType = getQueryStringValue("FormAction").toUpperCase()

    var SNo = $('#hdnCCASNo').val() || 0;
    var IsRepriceAWB = $('#IsRepriceAWB').is(':checked') == false ? 0 : 1 || 1
    var IsUpdateAWB = Istransit;
    var isTerminateShipment = $('#IsTerminateShpt').is(':checked') == false ? 0 : 1 || 0
    var TerminateStation = $("#TermianteStation").val() || 0
    var DestinationChange = $("#DestinationChange").val() || 0
    var IsDueCarrierChange = $('#IsDueCarrierChange').is(':checked') == false ? 0 : 1 || 0
    var IsDueAgentChange = $('#IsDueAgentChange').is(':checked') == false ? 0 : 1 || 0
    //-------------------------------------------------------------Flight plan validation-------------------
    if (PageType == 'NEW') {
        for (var i = 0; i < SaveFlightRequestModel.length; i++) {
            var sumPcs = 0, sumGrossWT = 0, sumVolWt = 0, sumVolume = 0
            for (var j = 0; j < SaveFlightRequestModel.length; j++) {
                if (SaveFlightRequestModel[i].ODPair.split('/')[0] == SaveFlightRequestModel[j].ODPair.split('/')[0]) {
                    sumPcs = sumPcs + parseInt(SaveFlightRequestModel[j].Pieces)
                    sumGrossWT = sumGrossWT + parseFloat(SaveFlightRequestModel[j].GrossWeight).toFixed(2)
                    sumVolWt = sumVolWt + parseFloat(SaveFlightRequestModel[j].VolumeWeight).toFixed(2)
                    sumVolume = sumVolume + parseFloat(SaveFlightRequestModel[j].Volume).toFixed(3)
                }
            }
            if (parseInt(sumPcs) > parseInt($("#Text_RevisedPieces").val())
                || sumGrossWT > parseFloat($("#Text_RevisedGrossWeight").val())
                || sumVolWt > parseFloat($("#Text_RevisedVolumeWeight").val())
                || sumVolume > parseFloat($("#Text_RevisedVolume").val())
            ) {
                Getflightplan(1)
                ShowMessage('warning', 'Warning - CCA', "Flight Pieces/Gross Wt./Volume/Vol. wt cannot be greater than Revised Pieces/Gross Wt./Volume/Vol. wt");

                return false;
            }
            if (parseInt(sumPcs) < parseInt($("#Text_RevisedPieces").val())
                || sumGrossWT < parseFloat($("#Text_RevisedGrossWeight").val())
                || sumVolWt < parseFloat($("#Text_RevisedVolumeWeight").val())
                || sumVolume < parseFloat($("#Text_RevisedVolume").val())
            ) {
                Getflightplan(1)
                ShowMessage('warning', 'Warning - CCA', "Flight Pieces/Gross Wt./Volume/Vol. wt cannot be Lesser than Revised Pieces/Gross Wt./Volume/Vol. wt");
                return false;
            }
        }
    }
    //--------------------------------END-------------------------------------------------------------------
    if (PageType == 'NEW') {
        var tempdueCarrier = DueCarrierOtherChargeCCA;
        var tempdueAgent = DueAgentOtherChargeCCA;
        if (tempdueCarrier.length > 0) {
            DueCarrierOtherChargeCCA = [];
            for (var i = 0; i < tempdueCarrier.length; i++) {
                if (tempdueCarrier[i].ChargeType.toUpperCase() != 'AUTO') {
                    var SaveFlightData = {
                        SNo: tempdueCarrier[i].SNo,
                        AWBSNo: tempdueCarrier[i].AWBSNo,
                        BookingSNo: tempdueCarrier[i].BookingSNo,
                        BookingRefNo: tempdueCarrier[i].BookingRefNo,
                        Type: tempdueCarrier[i].Type,
                        OtherChargeCode: tempdueCarrier[i].OtherChargeCode,
                        OtherchargeDetail: tempdueCarrier[i].OtherchargeDetail,
                        OtherchargeCurrency: tempdueCarrier[i].OtherchargeCurrency,
                        ChargeValue: tempdueCarrier[i].ChargeValue,
                        CreatedBy: tempdueCarrier[i].CreatedBy,
                        UpdatedBy: tempdueCarrier[i].UpdatedBy

                    }

                    DueCarrierOtherChargeCCA.push(SaveFlightData)
                }
            }
        }
        if (tempdueAgent.length > 0) {
            DueAgentOtherChargeCCA = [];
            for (var i = 0; i < tempdueAgent.length; i++) {
                if (tempdueAgent[i].ChargeType.toUpperCase() != 'AUTO') {
                    var SaveFlightData = {
                        SNo: tempdueAgent[i].SNo,
                        AWBSNo: tempdueAgent[i].AWBSNo,
                        BookingSNo: tempdueAgent[i].BookingSNo,
                        BookingRefNo: tempdueAgent[i].BookingRefNo,
                        Type: tempdueAgent[i].Type,
                        OtherChargeType: "0",
                        OtherChargeCode: tempdueAgent[i].OtherChargeCode,
                        OtherchargeDetail: tempdueAgent[i].OtherchargeDetail,
                        AgentOtherchargeCurrency: tempdueAgent[i].AgentOtherchargeCurrency,
                        HdnAgentOtherchargeCurrency: tempdueAgent[i].HdnAgentOtherchargeCurrency,
                        ChargeValue: tempdueAgent[i].ChargeValue,
                        CreatedBy: tempdueAgent[i].CreatedBy,
                        UpdatedBy: tempdueAgent[i].UpdatedBy,
                    }

                    DueAgentOtherChargeCCA.push(SaveFlightData)
                }
            }
        }
    }
    else {
        DueAgentOtherChargeCCA = [];
        DueCarrierOtherChargeCCA = [];
    }
    if (IsDueCarrierChange != 1) {
        DueCarrierOtherChargeCCA = [];
    }
    if (IsDueAgentChange != 1) {
        DueAgentOtherChargeCCA = [];
    }

    if (TerminateStation == 0 && DestinationChange == 0)
        IsRepriceAWB = 1;
    if (AwbSno != "") {

        $.ajax({
            url: "Services/Shipment/CCAService.svc/SaveCCA", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                SNo: SNo, SaveCCA: CCAInList, ActionType: ActionType, SaveFlightRequestModel: SaveFlightRequestModel, CCACustomerTrans: CCACustomerTrans,
                IsRepriceAWB: IsRepriceAWB, IsUpdateAWB: IsUpdateAWB, isTerminateShipment: isTerminateShipment, TerminateStation: TerminateStation,
                DestinationChange: DestinationChange, dueCarrierOtherChargeCCA: DueCarrierOtherChargeCCA, dueAgentOtherChargeCCA: DueAgentOtherChargeCCA,
                IsDueCarrierChange: IsDueCarrierChange, IsDueAgentChange: IsDueAgentChange
            }),
            success: function (result) {


                //var GetSucessResult = JSON.parse(result).Table0[0].Column1;

                if (PageType != "EDIT") {
                    if (JSON.parse(result).Table[0].Column1 == 0) {
                        //setTimeout(function () {
                        //    navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                        //}, 2000);
                        ShowMessage('success', 'Success - CCA', "CCA saved successfully !");
                        window.onbeforeunload = null;
                        window.location.href = 'Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW'

                    }
                    else if (JSON.parse(result).Table[0].Column1 == 2000) {
                        //setTimeout(function () {
                        //    navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                        //}, 2000);
                        ShowMessage('success', 'Success - CCA', "CCA Delete Successfully !");
                        window.onbeforeunload = null;
                        window.location.href = 'Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW'
                    }
                    else if (JSON.parse(result).Table[0].Column1 == 5) {
                        ShowMessage('warning', 'Warning - CCA', "CCA Already Exists in Requested Mode !");



                    }
                    else {
                        ShowMessage('warning', 'Warning - CCA', JSON.parse(result).Table[0].Column1, "bottom-right");
                    }
                } else {

                    //if (userContext.GroupName.toUpperCase() == "ADMIN") {
                    //if (Approve.includes(LoginType)) {
                    if (userContext.SpecialRights["CCAAPPR"] == true) {

                        if ($('input[type="radio"][name=Group]:checked').val() == 'Approved') {


                            if (JSON.parse(result).Table3 != undefined) {
                                if (JSON.parse(result).Table3.length > 0 && JSON.parse(result).Table3[0].Column1 == 1000) {
                                    ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    window.onbeforeunload = null;
                                    window.location.href = 'Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW'
                                    return;
                                }
                            }
                            if (JSON.parse(result).Table2 != undefined) {
                                if (JSON.parse(result).Table2.length > 0 && JSON.parse(result).Table2[0].Column1 == 1000) {
                                    ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    window.onbeforeunload = null;
                                    window.location.href = 'Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW'
                                    return;
                                }
                            }
                            if (JSON.parse(result).Table1 != undefined) {
                                if (JSON.parse(result).Table1.length > 0 && JSON.parse(result).Table1[0].Column1 == 1000) {
                                    //ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    window.onbeforeunload = null;
                                    window.location.href = 'Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW'
                                    return;
                                }
                            }
                            if (JSON.parse(result).Table != undefined) {
                                if (JSON.parse(result).Table.length > 0 && JSON.parse(result).Table[0].Column1 == 1000) {
                                    //ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    window.onbeforeunload = null;
                                    window.location.href = 'Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW'
                                    return;
                                }
                            }
                            if (JSON.parse(result).Table != undefined) {
                                if (JSON.parse(result).Table.length > 0 && JSON.parse(result).Table[0].Column1 == 6) {
                                    //ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    ShowMessage('success', 'Warning - CCA', "Shipment in Build-Up stage . Cannot Approve CCA");
                                    return;
                                }
                            }

                            if (JSON.parse(result).Table1 != undefined) {
                                if (JSON.parse(result).Table1.length > 0 && JSON.parse(result).Table1[0].Column1 != 1000) {
                                    //ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    ShowMessage('warning', 'Warning - CCA', JSON.parse(result).Table1[0].Column1, "bottom-right");
                                    return;
                                }
                            }
                            if (JSON.parse(result).Table != undefined) {
                                if (JSON.parse(result).Table.length > 0 && JSON.parse(result).Table[0].Column1 != 1000) {
                                    //ShowMessage('success', 'Success - CCA', "CCA Approved successfully !");
                                    ShowMessage('warning', 'Warning - CCA', JSON.parse(result).Table[0].Column1, "bottom-right");
                                    return;
                                }
                            }

                        } else if ($('input[type="radio"][name=Group]:checked').val() == 'Reject') {
                            if (JSON.parse(result).Table != undefined) {
                                if (JSON.parse(result).Table.length > 0 && JSON.parse(result).Table[0].Column1 == 5000) {
                                    //setTimeout(function () {
                                    //    navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                                    //}, 2000);
                                    ShowMessage('success', 'Success - CCA', "CCA Rejected Successfully !");
                                    window.onbeforeunload = null;
                                    window.location.href = 'Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW'

                                }
                            }
                        }
                    }
                    else {

                        if ($('input[type="radio"][name=Group]:checked').val() == 'Pending') {
                            if (JSON.parse(result).Table.length > 0 && JSON.parse(result).Table[0].Column1 == 1000) {
                                //setTimeout(function () {
                                //    navigateUrl('Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW');

                                //}, 2000);
                                ShowMessage('success', 'Success - CCA', "CCA Updated successfully !");
                                window.onbeforeunload = null;
                                window.location.href = 'Default.cshtml?Module=Shipment&Apps=CCA&FormAction=INDEXVIEW'
                            }
                        }
                    }
                }
            }
        });
    }

}


//----------------------------Start Calculate Due Agent ----------------


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

//-------------------------END Due Carrier-------------------------------------



function GetDepartedAWbOnUser() {

    if (userContext.GroupName != "") {
        $.ajax({
            url: "Services/Shipment/CCAService.svc/GetDepartedAWb", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                GroupName: userContext.GroupName
            }),
            success: function (result) {
                var GetSucessResult = JSON.parse(result);
                if (GetSucessResult != undefined) {
                    if (GetSucessResult.Table0.length > 0) {
                        Operator = GetSucessResult.Table0[0].Operator;
                    }
                }
            }
        });
    }
}
var Operator = "";
function ExtraCondition(textId) {

    var filterShipperCity = cfi.getFilter("AND");
    var filterConsigneeCity = cfi.getFilter("AND");
    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");
    var otherchargefilter = cfi.getFilter("AND");



    if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        var filterSCity = cfi.getFilter("AND");
        cfi.setFilter(filterSCity, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        //     cfi.setFilter(filterSCity, "SNo", "notin", $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key());
        //    cfi.setFilter(filterSCity, "SNo", "notin", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        var filterCCity = cfi.getFilter("AND");
        cfi.setFilter(filterCCity, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        //     cfi.setFilter(filterCCity, "SNo", "notin", $("#Text_SHIPPER_City").data("kendoAutoComplete").key());
        //      cfi.setFilter(filterCCity, "SNo", "notin", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
    //else if (textId.indexOf("Text_SHIPPER_CountryCode") >= 0) {
    //    var filterSCity = cfi.getFilter("AND");
    //    cfi.setFilter(filterSCity, "SNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
    //    filterShipperCity = cfi.autoCompleteFilter(filterSCity);
    //    return filterShipperCity;
    //}
    //else if (textId.indexOf("Text_CONSIGNEE_CountryCode") >= 0) {
    //    var filterCCity = cfi.getFilter("AND");
    //    cfi.setFilter(filterCCity, "SNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
    //    filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
    //    return filterConsigneeCity;
    //}

    else if ((textId.indexOf("SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        var SHIPPER_AccountNo2 = cfi.getFilter("AND");
        if (userContext.SysSetting.IsShowShipperConsigneeOnAgent == "True" && userContext.AgentSNo > 0) {
            cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
            cfi.setFilter(SHIPPER_AccountNo2, "CitySNo", "eq", $("#OriginSNo").val());
            //    cfi.setFilter(SHIPPER_AccountNo2, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
            ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
            return ShipperAccountFilter;
        }
        else {
            cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
            cfi.setFilter(SHIPPER_AccountNo2, "CitySNo", "eq", $("#OriginSNo").val());
            ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
            return ShipperAccountFilter;
        }
    }
    else if ((textId.indexOf("CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        var ConsigneeFilter2 = cfi.getFilter("AND");
        if (userContext.SysSetting.IsShowShipperConsigneeOnAgent == "True" && userContext.AgentSNo > 0) {
            cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
            cfi.setFilter(ConsigneeFilter2, "CitySNo", "eq", $("#DestinationSNo").val());
            //   cfi.setFilter(ConsigneeFilter2, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
            ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
            return ConsigneeFilter;
        }
        else {
            cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
            cfi.setFilter(ConsigneeFilter2, "CitySNo", "eq", $("#DestinationSNo").val());
            ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
            return ConsigneeFilter;
        }
    }
    else if (textId.indexOf("Text_TermianteStation") >= 0) {
        var filter1 = cfi.getFilter("AND");
        //  cfi.setFilter(filter1, "StatusNo", Operator, "9");
        cfi.setFilter(filter1, "SNo", "in", filterOriginAirport);  // Awb fetch from login city wise as per pradip sir on 6 sep 2017
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    else if (textId.indexOf("Text_DestinationChange") >= 0) {
        DestinationChange = DestinationChange == undefined || DestinationChange == null ? '0' : DestinationChange
        var filter1 = cfi.getFilter("AND");
        //  cfi.setFilter(filter1, "StatusNo", Operator, "9");
        cfi.setFilter(filter1, "SNo", "notin", DestinationChange);  // Awb fetch from login city wise as per pradip sir on 6 sep 2017
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    else if (textId.indexOf("tbldueCarriercharges_OtherChargeCode") >= 0) {
        var filterOtherCharge = cfi.getFilter("AND");
        var str = "";
        $("#tbldueCarriercharges tr td input[id*='tbldueCarriercharges_OtherChargeCode_']").each(function () {
            if ($(this).attr('id') != textId)
                str = str + $(this).val() + ','

        })
        cfi.setFilter(filterOtherCharge, "Code", "notin", str);
        //  cfi.setFilter(filterOtherCharge, "IsCarrier", "eq", 1);
        cfi.setFilter(filterOtherCharge, "IsActive", "eq", 1);
        otherchargefilter = cfi.autoCompleteFilter(filterOtherCharge);
        return otherchargefilter;
    }
    else if (textId.indexOf("tbldueAgentcharges_OtherChargeCode") >= 0) {
        var filterOtherCharge = cfi.getFilter("AND");
        var str = "";
        $("#tbldueAgentcharges tr td input[id*='tbldueAgentcharges_OtherChargeCode_']").each(function () {
            if ($(this).attr('id') != textId)
                str = str + $(this).val() + ','

        })
        cfi.setFilter(filterOtherCharge, "Code", "notin", str);
        //  cfi.setFilter(filterOtherCharge, "IsCarrier", "eq", 0);
        cfi.setFilter(filterOtherCharge, "IsActive", "eq", 1);
        otherchargefilter = cfi.autoCompleteFilter(filterOtherCharge);
        return otherchargefilter;
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
            data: JSON.stringify({
                SNo: SNo
            }),
            success: function (result) {

                var GetSucessResult = JSON.parse(result);
                if (GetSucessResult != undefined) {

                    if (GetSucessResult.Table0.length > 0) {
                        $('#hdnAWBSNo').val(GetSucessResult.Table0[0].AWBSNo)
                        AWBSNo = GetSucessResult.Table0[0].AWBSNo
                        $("span#AWBNO").text(GetSucessResult.Table0[0].AwbNo);
                        $("span#Origin").text(GetSucessResult.Table0[0].Origin);
                        $("span#Destination").text(GetSucessResult.Table0[0].Destination);
                        $("span#DateOfAwbIssue").text(GetSucessResult.Table0[0].DateofAWBissue);
                        $("span#PlaceOfAwbIssue").text(GetSucessResult.Table0[0].PlaceofAWBIssue);
                        $("span#NameAndCity").text(GetSucessResult.Table0[0].AgentName + ' / ' + GetSucessResult.Table0[0].AgentCity);
                        $('#AgentCode').text(GetSucessResult.Table0[0].AgentCode);
                        Istransit = GetSucessResult.Table0[0].IsUpdateAWB;
                        //$("#Text_RevisedWeightUnit").val(GetSucessResult.Table0[0].WeightUnit);
                        //$("span#Text_RevisedWeightUnit").text(GetSucessResult.Table0[0].WeightUnit);

                        $("#Text_RevisedGrossWeight").val(GetSucessResult.Table0[0].RevisedGrossWeight)
                        $("span#hdn_OriginalGrossWeight").text(GetSucessResult.Table0[0].OriginalGrossWeight)

                        $("#Text_RevisedPieces").val(GetSucessResult.Table0[0].RevisedPieces)
                        $("span#hdn_OriginalPieces").text(GetSucessResult.Table0[0].OriginalPieces)
                        $("#Text_RevisedChargeableWeight").attr('Readonly', 'Readonly');

                        //$("#Text_RevisedWeightUnit").val(GetSucessResult.Table0[0].RevisedWeightUnit)
                        //$("span#hdn_OriginalWeightUnit").text(GetSucessResult.Table0[0].OriginalWeightUnit)

                        $("#Text_RevisedVolume").val(GetSucessResult.Table0[0].RevisedVolume)
                        $("span#hdn_OriginalVolume").text(GetSucessResult.Table0[0].OriginalVolume)

                        $("span#Shipper").text(GetSucessResult.Table0[0].ShipperName);
                        $("span#Consignee").text(GetSucessResult.Table0[0].ConsigneeName);


                        $("#Text_RevisedShipper").val(GetSucessResult.Table0[0].RevisedShipper);
                        $("#Text_RevisedConsignee").val(GetSucessResult.Table0[0].RevisedConsignee);
                        $("span#hdn_OriginalShipper").text(GetSucessResult.Table0[0].shipper);
                        $("span#hdn_OriginalConsignee").text(GetSucessResult.Table0[0].Consignee);


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

                        Istransit = GetSucessResult.Table0[0].IsUpdateAWB;
                        $('#OriginalProductSNo').val(GetSucessResult.Table0[0].OriginalProductSNo);
                        $('#Text_OriginalProductSNo').val(GetSucessResult.Table0[0].Text_OriginalProductSNo);

                        cfi.BindMultiValue("OriginalSHCSNo", $("#Text_OriginalSHCSNo").val(), $("#OriginalSHCSNo").val());
                        $('#divMultiOriginalSHCSNo').find('span').removeClass("k-icon k-delete");
                        //-------nog details------------
                        $("#NatureOfGoods").val(GetSucessResult.Table0[0].RevisedNOG)
                        $("#hdn_NatureOfGoods").text(GetSucessResult.Table0[0].OriginalNOG)
                        if (GetSucessResult.Table0[0].ISWEIGHTDISCREP == 'Checked') {
                            $('input[type="checkbox"][name=WEIGHTDISCREP]').click()
                        }
                        if (GetSucessResult.Table0[0].ISVOLUMEDISCREP == 'Checked') {
                            $('input[type="checkbox"][name=VOLUMEDISCREP]').click()
                        }
                        if (GetSucessResult.Table0[0].ISCNEECHANGE == 'Checked') {
                            $('input[type="checkbox"][name=CNEECHANGE]').click()
                        }
                        if (GetSucessResult.Table0[0].ISSHPRCHANGE == 'Checked') {
                            $('input[type="checkbox"][name=SHPRCHANGE]').click()
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
                        if (GetSucessResult.Table0[0].ISNOGCHANGE == 'Checked') {
                            $('input[type="checkbox"][name=NOGCHANGE]').click()
                        }

                        if (GetSucessResult.Table0[0].ISSHCCHARGE == 'Checked') {
                            $('input[type="checkbox"][name=SHCCHARGE]').click()
                        }
                        if (GetSucessResult.Table0[0].ISPRODUCTCHARGE == 'Checked') {
                            $('input[type="checkbox"][name=PRODUCTCHARGE]').click()
                        }
                        if (GetSucessResult.Table0[0].ISCOMMODITYCHARGE == 'Checked') {
                            $('input[type="checkbox"][name=COMMODITYCHARGE]').click()
                        }
                        if (GetSucessResult.Table0[0].ISPIECESCHARGE == 'Checked') {
                            $('input[type="checkbox"][name=PIECESCHARGE]').click()
                        }
                        if (GetSucessResult.Table0[0].IsRepriceAWB == 'Checked') {
                            $('input[type="checkbox"][id=IsRepriceAWB]').click()
                        }
                        if (GetSucessResult.Table0[0].IsDueCarrierChange == 'Checked') {
                            $('input[type="checkbox"][id=IsDueCarrierChange]').click()
                        }
                        if (GetSucessResult.Table0[0].IsDueAgentChange == 'Checked') {
                            $('input[type="checkbox"][id=IsDueAgentChange]').click()
                        }
                        if (GetSucessResult.Table0[0].IsDestinationChange == 'Checked') {
                            //  $('input[type="checkbox"][id=IsDestinationChange]').click()
                            $('input[type="checkbox"][id=IsDestinationChange]').attr('checked', true);
                            $("#DestinationChange").closest('td').show();
                            $("#Text_DestinationChange").val(GetSucessResult.Table0[0].Text_DestinationChange);
                            $("#DestinationChange").val(GetSucessResult.Table0[0].DestinationChange);
                        }
                        else {
                            $("#DestinationChange").closest('tr').hide();
                        }
                        if (GetSucessResult.Table0[0].IsTerminateShpt == 'Checked') {
                            $('input[type="checkbox"][id=IsTerminateShpt]').attr('checked', true);
                            $("#TermianteStation").closest('td').show();
                            $("#Text_TermianteStation").val(GetSucessResult.Table0[0].Text_TerminateStation)
                            $("#TermianteStation").val(GetSucessResult.Table0[0].TerminateStation)
                        }
                        else {
                            $("#TermianteStation").closest('tr').hide();
                        }
                        if (GetSucessResult.Table0[0].IsTerminateShpt == 'Checked' || GetSucessResult.Table0[0].IsDestinationChange == 'Checked') {
                            $("#IsRepriceAWB").closest('tr').show();
                        }
                        else
                            $("#IsRepriceAWB").closest('tr').hide();

                        $("#Text_RevisedVolumeWeight").val(GetSucessResult.Table0[0].RevisedVolumeWeight)
                        $("#Text_RevisedVolumeWeight").attr('Readonly', 'Readonly');
                        $("span#hdn_OriginalVolumeWeight").text(GetSucessResult.Table0[0].OriginalVolumeWeight)

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


                                //--------------------------------------------------

                                $("#DepartedPieces" + i + "").val(GetSucessResult.Table1[i - 1].Pieces);
                                $("#DepartedGrossWeight" + i + "").val(GetSucessResult.Table1[i - 1].GrossWeight);
                                $("#DepartedVolume" + i + "").val(GetSucessResult.Table1[i - 1].Volume);
                                $("#DepartedVolumeWeight" + i + "").val(GetSucessResult.Table1[i - 1].VolumeWeight);

                            }

                        }
                        if ($("span#FlightNo1").text().trim() == "") {
                            $("span#FlightDetails1").hide();
                            $("#DepartedPieces1").hide();
                            $("#DepartedGrossWeight1").hide();
                            $("#DepartedVolume1").hide();
                            $("#DepartedVolumeWeight1").hide();
                        }
                        if ($("span#FlightNo2").text().trim() == "") {
                            $("span#FlightDetails2").hide();
                            $("#DepartedPieces2").hide();
                            $("#DepartedGrossWeight2").hide();
                            $("#DepartedVolume2").hide();
                            $("#DepartedVolumeWeight2").hide();
                        }
                        if ($("span#FlightNo3").text().trim() == "") {
                            $("span#FlightDetails3").hide();
                            $("#DepartedPieces3").hide();
                            $("#DepartedGrossWeight3").hide();
                            $("#DepartedVolume3").hide();
                            $("#DepartedVolumeWeight3").hide();
                        }

                        //----------------shipper consignee info----
                        if (GetSucessResult.Table2.length > 0) {
                            //for (var i = 1; i <= GetSucessResult.Table2.length; i++) {
                            $("#SHIPPER_AccountNo").val(GetSucessResult.Table2[0].RevisedCustomerSNo)
                            $("#Text_SHIPPER_AccountNo").val(GetSucessResult.Table2[0].Text_RevisedCustomerSNo)
                            $("#SHIPPER_Name").val(GetSucessResult.Table2[0].RevisedCustomerName)
                            $("#SHIPPER_Name2").val(GetSucessResult.Table2[0].RevisedCustomerName2)
                            $("#SHIPPER_Street").val(GetSucessResult.Table2[0].RevisedStreet)
                            $("#SHIPPER_Street2").val(GetSucessResult.Table2[0].RevisedStreet2)
                            $("#SHIPPER_TownLocation").val(GetSucessResult.Table2[0].RevisedLocation)
                            $("#SHIPPER_State").val(GetSucessResult.Table2[0].RevisedState)
                            $("#SHIPPER_PostalCode").val(GetSucessResult.Table2[0].RevisedPostalCode)
                            $("#SHIPPER_MobileNo").val(GetSucessResult.Table2[0].RevisedPhone)
                            $("#SHIPPER_MobileNo2").val(GetSucessResult.Table2[0].RevisedPhone2)
                            $("#SHIPPER_Email").val(GetSucessResult.Table2[0].RevisedEmail)
                            $("#SHIPPER_CountryCode").val(GetSucessResult.Table2[0].RevisedCountrySno)
                            $("#Text_SHIPPER_CountryCode").val(GetSucessResult.Table2[0].Text_RevisedCountrySno)
                            $("#SHIPPER_City").val(GetSucessResult.Table2[0].RevisedCitySno)
                            $("#Text_SHIPPER_City").val(GetSucessResult.Table2[0].Text_RevisedCitySno)
                            $("#SHipper_Fax").val(GetSucessResult.Table2[0].RevisedFax)




                            $("#OrgSHIPPER_AccountNo").val(GetSucessResult.Table2[0].OriginalCustomerSNo)
                            $("#Text_OrgSHIPPER_AccountNo").val(GetSucessResult.Table2[0].Text_OriginalCustomerSNo)
                            $("#OrgSHIPPER_Name").val(GetSucessResult.Table2[0].OriginalCustomerName)
                            $("#OrgSHIPPER_Name2").val(GetSucessResult.Table2[0].OriginalCustomerName2)
                            $("#OrgSHIPPER_Street").val(GetSucessResult.Table2[0].OriginalStreet)
                            $("#OrgSHIPPER_Street2").val(GetSucessResult.Table2[0].OriginalStreet2)
                            $("#OrgSHIPPER_TownLocation").val(GetSucessResult.Table2[0].OriginalLocation)
                            $("#OrgSHIPPER_State").val(GetSucessResult.Table2[0].OriginalState)
                            $("#OrgSHIPPER_PostalCode").val(GetSucessResult.Table2[0].OriginalPostalCode)
                            $("#OrgSHIPPER_MobileNo").val(GetSucessResult.Table2[0].OriginalPhone)
                            $("#OrgSHIPPER_MobileNo2").val(GetSucessResult.Table2[0].OriginalPhon2)
                            $("#OrgSHIPPER_Email").val(GetSucessResult.Table2[0].OriginalEmail)
                            $("#OrgSHIPPER_CountryCode").val(GetSucessResult.Table2[0].OriginalCountrySno)
                            $("#Text_OrgSHIPPER_CountryCode").val(GetSucessResult.Table2[0].Text_OriginalCountrySno)
                            $("#OrgSHIPPER_City").val(GetSucessResult.Table2[0].OriginalCitySno)
                            $("#Text_OrgSHIPPER_City").val(GetSucessResult.Table2[0].Text_OriginalCitySno)
                            $("#OrgSHIPPER_Fax").val(GetSucessResult.Table2[0].OriginalFax)



                            //-------end
                            //  }


                            $("#tblOriginalShipper").find('input').attr('disabled', true)
                            $('#tblOriginalShipper').find('[class="k-icon k-i-arrow-s"]').unbind('click')
                            $("#tblRevisedShipper").find('input').attr('disabled', true)
                            $('#tblRevisedShipper').find('[class="k-icon k-i-arrow-s"]').unbind('click')
                        }
                        if (GetSucessResult.Table3.length > 0) {
                            $("#CONSIGNEE_AccountNo").val(GetSucessResult.Table3[0].RevisedCustomerSNo)
                            $("#Text_CONSIGNEE_AccountNo").val(GetSucessResult.Table3[0].Text_RevisedCustomerSNo)
                            $("#CONSIGNEE_AccountNoName").val(GetSucessResult.Table3[0].RevisedCustomerName)
                            $("#CONSIGNEE_AccountNoName2").val(GetSucessResult.Table3[0].RevisedCustomerName2)
                            $("#CONSIGNEE_Street").val(GetSucessResult.Table3[0].RevisedStreet)
                            $("#CONSIGNEE_Street2").val(GetSucessResult.Table3[0].RevisedStreet2)
                            $("#CONSIGNEE_TownLocation").val(GetSucessResult.Table3[0].RevisedLocation)
                            $("#CONSIGNEE_State").val(GetSucessResult.Table3[0].RevisedState)
                            $("#CONSIGNEE_PostalCode").val(GetSucessResult.Table3[0].RevisedPostalCode)
                            $("#CONSIGNEE_MobileNo").val(GetSucessResult.Table3[0].RevisedPhone)
                            $("#CONSIGNEE_MobileNo2").val(GetSucessResult.Table3[0].RevisedPhone2)
                            $("#CONSIGNEE_Email").val(GetSucessResult.Table3[0].RevisedEmail)
                            $("#CONSIGNEE_CountryCode").val(GetSucessResult.Table3[0].RevisedCountrySno)
                            $("#Text_CONSIGNEE_CountryCode").val(GetSucessResult.Table3[0].Text_RevisedCountrySno)
                            $("#CONSIGNEE_City").val(GetSucessResult.Table3[0].RevisedCitySno)
                            $("#Text_CONSIGNEE_City").val(GetSucessResult.Table3[0].Text_RevisedCitySno)
                            $("#CONSIGNEE_Fax").val(GetSucessResult.Table3[0].RevisedFax)

                            $("#OrgCONSIGNEE_AccountNo").val(GetSucessResult.Table3[0].OriginalCustomerSNo)
                            $("#Text_OrgCONSIGNEE_AccountNo").val(GetSucessResult.Table3[0].Text_OriginalCustomerSNo)
                            $("#OrgCONSIGNEE_AccountNoName").val(GetSucessResult.Table3[0].OriginalCustomerName)
                            $("#OrgCONSIGNEE_AccountNoName2").val(GetSucessResult.Table3[0].OriginalCustomerName2)
                            $("#OrgCONSIGNEE_Street").val(GetSucessResult.Table3[0].OriginalStreet)
                            $("#OrgCONSIGNEE_Street2").val(GetSucessResult.Table3[0].OriginalStreet2)
                            $("#OrgCONSIGNEE_TownLocation").val(GetSucessResult.Table3[0].OriginalLocation)
                            $("#OrgCONSIGNEE_State").val(GetSucessResult.Table3[0].OriginalState)
                            $("#OrgCONSIGNEE_PostalCode").val(GetSucessResult.Table3[0].OriginalPostalCode)
                            $("#OrgCONSIGNEE_MobileNo").val(GetSucessResult.Table3[0].OriginalPhone)
                            $("#OrgCONSIGNEE_MobileNo2").val(GetSucessResult.Table3[0].OriginalPhon2)
                            $("#OrgCONSIGNEE_Email").val(GetSucessResult.Table3[0].OriginalEmail)
                            $("#OrgCONSIGNEE_CountryCode").val(GetSucessResult.Table3[0].OriginalCountrySno)
                            $("#Text_OrgCONSIGNEE_CountryCode").val(GetSucessResult.Table3[0].Text_OriginalCountrySno)
                            $("#OrgCONSIGNEE_City").val(GetSucessResult.Table3[0].OriginalCitySno)
                            $("#Text_OrgCONSIGNEE_City").val(GetSucessResult.Table3[0].Text_OriginalCitySno)
                            $("#OrgCONSIGNEE_Fax").val(GetSucessResult.Table3[0].OriginalFax)
                        }

                        //----record from AWB for New Record------
                        if (GetSucessResult.Table4.length > 0 && GetSucessResult.Table2.length < 1) {
                            $("#SHIPPER_AccountNo").val(GetSucessResult.Table4[0].ShipperAccountNo)
                            $("#Text_SHIPPER_AccountNo").val(GetSucessResult.Table4[0].CustomerNo)
                            $("#SHIPPER_Name").val(GetSucessResult.Table4[0].ShipperName)
                            $("#SHIPPER_Name2").val(GetSucessResult.Table4[0].ShipperName2)
                            $("#SHIPPER_Street").val(GetSucessResult.Table4[0].ShipperStreet)
                            $("#SHIPPER_Street2").val(GetSucessResult.Table4[0].ShipperStreet2)
                            $("#SHIPPER_TownLocation").val(GetSucessResult.Table4[0].ShipperLocation)
                            $("#SHIPPER_State").val(GetSucessResult.Table4[0].ShipperState)
                            $("#SHIPPER_PostalCode").val(GetSucessResult.Table4[0].ShipperPostalCode)
                            $("#SHIPPER_MobileNo").val(GetSucessResult.Table4[0].ShipperMobile)
                            $("#SHIPPER_MobileNo2").val(GetSucessResult.Table4[0].ShipperMobile2)
                            $("#SHIPPER_Email").val(GetSucessResult.Table4[0].ShipperEMail)
                            $("#SHIPPER_CountryCode").val(GetSucessResult.Table4[0].ShipperCountryCode)
                            $("#Text_SHIPPER_CountryCode").val(GetSucessResult.Table4[0].ShipperCountryName)
                            $("#SHIPPER_City").val(GetSucessResult.Table4[0].ShipperCity)
                            $("#Text_SHIPPER_City").val(GetSucessResult.Table4[0].ShipperCityName)
                            $("#SHipper_Fax").val(GetSucessResult.Table4[0].Fax)

                            $("#OrgSHIPPER_AccountNo").val(GetSucessResult.Table4[0].ShipperAccountNo)
                            $("#Text_OrgSHIPPER_AccountNo").val(GetSucessResult.Table4[0].CustomerNo)
                            $("#OrgSHIPPER_Name").val(GetSucessResult.Table4[0].ShipperName)
                            $("#OrgSHIPPER_Name2").val(GetSucessResult.Table4[0].ShipperName2)
                            $("#OrgSHIPPER_Street").val(GetSucessResult.Table4[0].ShipperStreet)
                            $("#OrgSHIPPER_Street2").val(GetSucessResult.Table4[0].ShipperStreet2)
                            $("#OrgSHIPPER_TownLocation").val(GetSucessResult.Table4[0].ShipperLocation)
                            $("#OrgSHIPPER_State").val(GetSucessResult.Table4[0].ShipperState)
                            $("#OrgSHIPPER_PostalCode").val(GetSucessResult.Table4[0].ShipperPostalCode)
                            $("#OrgSHIPPER_MobileNo").val(GetSucessResult.Table4[0].ShipperMobile)
                            $("#OrgSHIPPER_MobileNo2").val(GetSucessResult.Table4[0].ShipperMobile2)
                            $("#OrgSHIPPER_Email").val(GetSucessResult.Table4[0].ShipperEMail)
                            $("#OrgSHIPPER_CountryCode").val(GetSucessResult.Table4[0].ShipperCountryCode)
                            $("#Text_OrgSHIPPER_CountryCode").val(GetSucessResult.Table4[0].ShipperCountryName)
                            $("#OrgSHIPPER_City").val(GetSucessResult.Table4[0].ShipperCity)
                            $("#Text_OrgSHIPPER_City").val(GetSucessResult.Table4[0].ShipperCityName)
                            $("#OrgSHIPPER_Fax").val(GetSucessResult.Table4[0].Fax)
                        }
                        if (GetSucessResult.Table5.length > 0 && GetSucessResult.Table3.length < 1) {
                            $("#CONSIGNEE_AccountNo").val(GetSucessResult.Table5[0].ConsigneeAccountNo)
                            $("#Text_CONSIGNEE_AccountNo").val(GetSucessResult.Table5[0].CustomerNo)
                            $("#CONSIGNEE_AccountNoName").val(GetSucessResult.Table5[0].ConsigneeName)
                            $("#CONSIGNEE_AccountNoName2").val(GetSucessResult.Table5[0].ConsigneeName2)
                            $("#CONSIGNEE_Street").val(GetSucessResult.Table5[0].ConsigneeStreet)
                            $("#CONSIGNEE_Street2").val(GetSucessResult.Table5[0].ConsigneeStreet2)
                            $("#CONSIGNEE_TownLocation").val(GetSucessResult.Table5[0].ConsigneeLocation)
                            $("#CONSIGNEE_State").val(GetSucessResult.Table5[0].ConsigneeState)
                            $("#CONSIGNEE_PostalCode").val(GetSucessResult.Table5[0].ConsigneePostalCode)
                            $("#CONSIGNEE_MobileNo").val(GetSucessResult.Table5[0].ConsigneeMobile)
                            $("#CONSIGNEE_MobileNo2").val(GetSucessResult.Table5[0].ConsigneeMobile2)
                            $("#CONSIGNEE_Email").val(GetSucessResult.Table5[0].ConsigneeEMail)
                            $("#CONSIGNEE_CountryCode").val(GetSucessResult.Table5[0].ConsigneeCountryCode)
                            $("#Text_CONSIGNEE_CountryCode").val(GetSucessResult.Table5[0].ConsigneeCountryName)
                            $("#CONSIGNEE_City").val(GetSucessResult.Table5[0].ConsigneeCity)
                            $("#Text_CONSIGNEE_City").val(GetSucessResult.Table5[0].ConsigneeCityName)
                            $("#CONSIGNEE_Fax").val(GetSucessResult.Table5[0].Fax)

                            $("#OrgCONSIGNEE_AccountNo").val(GetSucessResult.Table5[0].ConsigneeAccountNo)
                            $("#Text_OrgCONSIGNEE_AccountNo").val(GetSucessResult.Table5[0].CustomerNo)
                            $("#OrgCONSIGNEE_AccountNoName").val(GetSucessResult.Table5[0].ConsigneeName)
                            $("#OrgCONSIGNEE_AccountNoName2").val(GetSucessResult.Table5[0].ConsigneeName2)
                            $("#OrgCONSIGNEE_Street").val(GetSucessResult.Table5[0].ConsigneeStreet)
                            $("#OrgCONSIGNEE_Street2").val(GetSucessResult.Table5[0].ConsigneeStreet2)
                            $("#OrgCONSIGNEE_TownLocation").val(GetSucessResult.Table5[0].ConsigneeLocation)
                            $("#OrgCONSIGNEE_State").val(GetSucessResult.Table5[0].ConsigneeState)
                            $("#OrgCONSIGNEE_PostalCode").val(GetSucessResult.Table5[0].ConsigneePostalCode)
                            $("#OrgCONSIGNEE_MobileNo").val(GetSucessResult.Table5[0].ConsigneeMobile)
                            $("#OrgCONSIGNEE_MobileNo2").val(GetSucessResult.Table5[0].ConsigneeMobile2)
                            $("#OrgCONSIGNEE_Email").val(GetSucessResult.Table5[0].ConsigneeEMail)
                            $("#OrgCONSIGNEE_CountryCode").val(GetSucessResult.Table5[0].ConsigneeCountryCode)
                            $("#Text_OrgCONSIGNEE_CountryCode").val(GetSucessResult.Table5[0].ConsigneeCountryName)
                            $("#OrgCONSIGNEE_City").val(GetSucessResult.Table5[0].ConsigneeCity)
                            $("#Text_OrgCONSIGNEE_City").val(GetSucessResult.Table5[0].ConsigneeCityName)
                            $("#OrgCONSIGNEE_Fax").val(GetSucessResult.Table5[0].Fax)
                        }

                        $("#tblOriginalShipper").find('input').attr('disabled', true)
                        $('#tblOriginalShipper').find('[class="k-icon k-i-arrow-s"]').unbind('click')
                        $("#tblRevisedShipper").find('input').attr('disabled', true)
                        $('#tblRevisedShipper').find('[class="k-icon k-i-arrow-s"]').unbind('click')
                        //--------------end-----------------------
                        //if (GetSucessResult.Table5.length)
                        DueCarrierOtherChargeCCA = GetSucessResult.Table6;
                        DueAgentOtherChargeCCA = GetSucessResult.Table7;

                        ApplyRequired();
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
                            $('#DisplayButtonUpdate').attr('style', 'position: fixed;margin-top: -70px;margin-left: 1297px;');
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
                            $('#DisplayButtonUpdate').attr('style', 'position: fixed;margin-top:-25px;margin-left: 1265px;');
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
                            $('#DisplayButtonUpdate').attr('style', 'position: fixed;margin-top:-66px;margin-left: 1265px;');
                        }
                        //if (userContext.GroupName.toUpperCase() == "ADMIN") {
                        //if (Approve.includes(LoginType)) {
                        if (userContext.SpecialRights["CCAAPPR"] == true) {
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
            },
            complete: function () {

                setflightplandata(AWBSNo, SNo);
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

//--------------------------------------------FlightDetails validation------------------------------


function LoadFlightvalidation() {

    $('#DepartedPieces1').blur(function () {
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Pieces can not blank .");
            $("#DepartedPieces1").val('');
            return false;
        }

    });
    $('#DepartedPieces2').blur(function () {
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Pieces can not blank .");
            $("#DepartedPieces2").val('');
            return false;
        }

    });
    $('#DepartedPieces3').blur(function () {
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Pieces can not blank .");
            $("#DepartedPieces3").val('');
            return false;
        }

    });



    $('#DepartedGrossWeight1').blur(function () {
        var key = event.which;
        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Gross Weight can not be blank");
            $("#DepartedGrossWeight1").val('');
            return false;
        }
        else {
            var grwt = $('#DepartedGrossWeight1').val();
            $('#DepartedGrossWeight1').val(parseFloat(grwt).toFixed(2));
            if ($('#DepartedGrossWeight1').val() == "NaN") {
                $("#DepartedGrossWeight1").val('');
            }
        }
    });
    $('#DepartedGrossWeight2').blur(function () {
        var key = event.which;
        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Gross Weight can not be blank");
            $("#DepartedGrossWeight2").val('');
            return false;
        }
        else {
            var grwt = $('#DepartedGrossWeight2').val();
            $('#DepartedGrossWeight2').val(parseFloat(grwt).toFixed(2));
            if ($('#DepartedGrossWeight2').val() == "NaN") {
                $("#DepartedGrossWeight2").val('');
            }
        }
    });
    $('#DepartedGrossWeight3').blur(function () {
        var key = event.which;
        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((parseInt(this.value) <= 0.000) || (parseInt(this.value) <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Gross Weight can not be blank");
            $("#DepartedGrossWeight3").val('');
            return false;
        }
        else {
            var grwt = $('#DepartedGrossWeight3').val();
            $('#DepartedGrossWeight3').val(parseFloat(grwt).toFixed(2));
            if ($('#DepartedGrossWeight3').val() == "NaN") {
                $("#DepartedGrossWeight3").val('');
            }
        }
    });


    $('#DepartedVolume1').blur(function () {
        var key = event.which;
        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((this.value <= 0.000) || (this.value <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Volume  can not be blank");
            $("#DepartedVolume1").val('');
            return false;
        }
        else {
            var grwt = $('#DepartedVolume1').val();
            $('#DepartedVolume1').val(parseFloat(grwt).toFixed(3));
            if ($('#DepartedVolume1').val() == "NaN") {
                $("#DepartedVolume1").val('');
            }
        }
        if (GetroundValue((this.value * 166.66), 1) > ($('#DepartedGrossWeight1').val())) {
            $("#DepartedVolumeWeight1").val(parseFloat(GetroundValue(($('#DepartedVolume1').val() * 166.66), 1)).toFixed(2));
            return false;
        } else {
            var vlweight = $('#DepartedGrossWeight1').val();
            var vlwt = Math.abs(vlweight).toFixed(2);
            $("#DepartedVolumeWeight1").val(parseFloat(GetroundValue(($('#DepartedVolume1').val() * 166.66), 1)).toFixed(2));
            return false;
        }

    });
    $('#DepartedVolume2').blur(function () {
        var key = event.which;
        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((this.value <= 0.000) || (this.value <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Volume  can not be blank");
            $("#DepartedVolume2").val('');
            return false;
        }
        else {
            var grwt = $('#DepartedVolume2').val();
            $('#DepartedVolume2').val(parseFloat(grwt).toFixed(3));
            if ($('#DepartedVolume2').val() == "NaN") {
                $("#DepartedVolume2").val('');
            }
        }
        if (GetroundValue((this.value * 166.66), 1) > ($('#DepartedGrossWeight2').val())) {
            $("#DepartedVolumeWeight2").val(parseFloat(GetroundValue(($('#DepartedVolume2').val() * 166.66), 1)).toFixed(2));
            return false;
        } else {
            var vlweight = $('#DepartedGrossWeight2').val();
            var vlwt = Math.abs(vlweight).toFixed(2);
            $("#DepartedVolumeWeight2").val(parseFloat(GetroundValue(($('#DepartedVolume2').val() * 166.66), 1)).toFixed(2));
            return false;
        }

    });
    $('#DepartedVolume3').blur(function () {
        var key = event.which;
        if (!(key >= 48 && key <= 57)) {
            event.preventDefault();
        }
        if ((this.value <= 0.000) || (this.value <= 0)) {
            ShowMessage('warning', 'Warning - CCA', "Volume  can not be blank");
            $("#DepartedVolume3").val('');
            return false;
        }
        else {
            var grwt = $('#DepartedVolume3').val();
            $('#DepartedVolume3').val(parseFloat(grwt).toFixed(3));
            if ($('#DepartedVolume3').val() == "NaN") {
                $("#DepartedVolume3").val('');
            }
        }
        if (GetroundValue((this.value * 166.66), 1) > ($('#DepartedGrossWeight3').val())) {
            $("#DepartedVolumeWeight3").val(parseFloat(GetroundValue(($('#DepartedVolume3').val() * 166.66), 1)).toFixed(2));
            return false;
        } else {
            var vlweight = $('#DepartedGrossWeight3').val();
            var vlwt = Math.abs(vlweight).toFixed(2);
            $("#DepartedVolumeWeight3").val(parseFloat(GetroundValue(($('#DepartedVolume3').val() * 166.66), 1)).toFixed(2));
            return false;
        }

    });



    $('#DepartedPieces1').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }

    });
    $('#DepartedPieces2').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }

    });
    $('#DepartedPieces2').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }

    });
}
function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        if (UserTyp == "S") {
            $("#chkShipper").prop('checked', false);
            $("#chkShipper").attr('disabled', true);
            $("#chkShipper").removeAttr("title");
        }
        if (UserTyp == "C") {
            $("#chkconsignee").prop('checked', false);
            $("#chkconsignee").attr('disabled', true);
            $("#chkconsignee").removeAttr("title");
        }

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperConsigneeData[0].Name2);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperConsigneeData[0].Address2);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#_tempSHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperConsigneeData[0].Fax);
                        $("#_tempSHipper_Fax").val(shipperConsigneeData[0].Fax);
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(shipperConsigneeData[0].Name2);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(shipperConsigneeData[0].Address2);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                        $("#_tempCONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                    }

                }
                else {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val('');
                        $("#SHIPPER_Name2").val('');
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_Street2").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#_tempSHIPPER_MobileNo").val('');
                        $("#SHIPPER_MobileNo2").val('');
                        $("#SHIPPER_Email").val('');
                        $("#SHipper_Fax").val('');
                        $("#_tempSHipper_Fax").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val('');
                        $("#CONSIGNEE_AccountNoName2").val('');
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_Street2").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#_tempCONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_MobileNo2").val('');
                        $("#CONSIGNEE_Email").val('');
                        $("#CONSIGNEE_Fax").val('');
                        $("#_tempCONSIGNEE_Fax").val('');
                    }
                }

            },
            error: {

            }
        });
    } else {
        if (UserTyp == "S") {
            $("#chkShipper").removeAttr('disabled');
            $("#chkShipper").attr("title", "Select to add in Participant as Shipper");

            $("#SHIPPER_Name").val('');
            $("#SHIPPER_Name2").val('');
            $("#SHIPPER_Street").val('');
            $("#SHIPPER_Street2").val('');
            $("#SHIPPER_TownLocation").val('');
            $("#SHIPPER_State").val('');
            $("#SHIPPER_PostalCode").val('');
            $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#SHIPPER_MobileNo").val('');
            $("#_tempSHIPPER_MobileNo").val('');
            $("#SHIPPER_MobileNo2").val('');
            $("#SHIPPER_Email").val('');
            $("#SHipper_Fax").val('');
            $("#_tempSHipper_Fax").val('');
        } else if (UserTyp == "C") {
            $("#chkconsignee").removeAttr('disabled');
            $("#chkconsignee").attr("title", "Select to add in Participant as Consignee");

            $("#CONSIGNEE_AccountNoName").val('');
            $("#CONSIGNEE_AccountNoName2").val('');
            $("#CONSIGNEE_Street").val('');
            $("#CONSIGNEE_Street2").val('');
            $("#CONSIGNEE_TownLocation").val('');
            $("#CONSIGNEE_State").val('');
            $("#CONSIGNEE_PostalCode").val('');
            $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#CONSIGNEE_MobileNo").val('');
            $("#_tempCONSIGNEE_MobileNo").val('');
            $("#CONSIGNEE_MobileNo2").val('');
            $("#CONSIGNEE_Email").val('');
            $("#CONSIGNEE_Fax").val('');
            $("#_tempCONSIGNEE_Fax").val('');
        }
    }

}
function ApplyRequired() {
    //   $("#Text_SHIPPER_AccountNo").attr("data-valid", "required");
    $("#SHIPPER_Name").attr("data-valid", "required");
    $('#SHIPPER_Name').attr('data-valid-msg', 'Enter Shipper Name.');
    $("#SHIPPER_Street").attr("data-valid", "required");
    $('#SHIPPER_Street').attr('data-valid-msg', 'Enter Shipper Street.');
    $("#SHIPPER_TownLocation").attr("data-valid", "required");
    $('#SHIPPER_TownLocation').attr('data-valid-msg', 'Enter Shipper Town/Location.');
    $("#Text_SHIPPER_City").attr("data-valid", "required");
    $('#Text_SHIPPER_City').attr('data-valid-msg', 'Select Shipper City.');
    $("#Text_SHIPPER_CountryCode").attr("data-valid", "required");
    $('#Text_SHIPPER_CountryCode').attr('data-valid-msg', 'Select Shipper Country.');
    //   $("#Text_SHIPPER_AccountNo").attr("data-valid", "required");
    //   $("#Text_CONSIGNEE_AccountNo").attr("data-valid", "required");
    $('#CONSIGNEE_AccountNoName').attr('data-valid-msg', 'Enter Consignee Name.');
    $("#CONSIGNEE_Street").attr("data-valid", "required");
    $('#CONSIGNEE_Street').attr('data-valid-msg', 'Enter Consignee Street.');
    $("#CONSIGNEE_TownLocation").attr("data-valid", "required");
    $('#CONSIGNEE_TownLocation').attr('data-valid-msg', 'Enter Consignee Town/Location.');
    $("#Text_CONSIGNEE_City").attr("data-valid", "required");
    $('#Text_CONSIGNEE_City').attr('data-valid-msg', 'Select Consignee City.');
    $("#Text_CONSIGNEE_CountryCode").attr("data-valid", "required");
    $('#Text_CONSIGNEE_CountryCode').attr('data-valid-msg', 'Select Consignee Country.');

    $("#NatureOfGoods").attr("data-valid", "required");
    $('#NatureOfGoods').attr('data-valid-msg', 'Enter NOG.');

}
function ChangeDestination() {
    if ($("#IsDestinationChange").is(':checked') == true) {
        $("#DestinationChange").closest('td').show();
        $("#Text_DestinationChange").attr('data-valid', 'required').val('');
        $("#DestinationChange").val('');
        $("#Text_DestinationChange").val('');
        $("#IsRepriceAWB").closest('tr').show();
        $("#IsTerminateShpt").prop('checked', false);
        $("#TermianteStation").closest('td').hide();
    }
    else {
        $("#DestinationChange").closest('td').hide();
        $("#Text_DestinationChange").removeAttr('data-valid').val('');
        $("#DestinationChange").val('');
        $("#IsRepriceAWB").closest('tr').hide();
    }
}

function Getflightplan(e) {
    if (SaveFlightRequestModel.length > 0) {
        if ($("#windowViewGeneratedCode").length > 0) {
            $("#windowViewGeneratedCode").remove();
        }
        $('#CCATable').after("<div id='windowViewGeneratedCode'></div>");

        // var Heading = Code.Table0[0].Heading == "" ? "Generated Code" : Code.Table0[0].Heading;
        var str = "<table id='popupViewCodetbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;font-size: 14px;text-align: center;'>";
        str = str + "<thead><tr><th bgcolor='lightblue'> Flight No</th><th bgcolor='lightblue'> Flight Date </th><th bgcolor='lightblue'> O/D</th>"
        str = str + "<th bgcolor='lightblue'> Pieces</th><th bgcolor='lightblue'> Gross Wt</th><th bgcolor='lightblue'> Vol. Wt</th><th bgcolor='lightblue'> CBM</th></tr></thead><tbody>"
        var divBtn = "";
        var tagtype = 'input';
        var PageType = getQueryStringValue("FormAction").toUpperCase();
        if (PageType != 'NEW') {
            tagtype = 'label'
        }
        if (SaveFlightRequestModel.length > 0) {
            if (e == "1") {
                for (var i = 0; i < SaveFlightRequestModel.length; i++) {
                    if (PageType != 'NEW') {
                        str += " <tr>";
                        str += "<td><span id= FlightNo_" + i + ">" + SaveFlightRequestModel[i].FlightNo + "</span><input type='hidden' id= DailyFlightSNo_" + i + "  value = '" + SaveFlightRequestModel[i].DailyFlightSNo + "'></input></td>";
                        str += "<td><span id= FlightDate_" + i + ">" + SaveFlightRequestModel[i].Date + "</span></td>";
                        str += "<td><span id= ODPair_" + i + ">" + SaveFlightRequestModel[i].ODPair + "</span></td>";
                        str += "<td ><label id= Pieces_" + i + " >" + SaveFlightRequestModel[i].Pieces + "</label>/<label>" + SaveFlightRequestModel[i].oldPieces + "</label></td>";
                        str += "<td ><label id= GrossWeight_" + i + " >" + SaveFlightRequestModel[i].GrossWeight + "</label>/<label>" + SaveFlightRequestModel[i].oldGrossWeight + "</label></td>";
                        str += "<td ><label id= VolumeWeight_" + i + " onblur='changeVolumeWt()' >" + SaveFlightRequestModel[i].VolumeWeight + "</label>/<label>" + SaveFlightRequestModel[i].oldVolumeWeight + "</label></td>";
                        str += "<td><label  id= FlightVolume_" + i + " onblur='changeVolume()'>" + SaveFlightRequestModel[i].Volume + " </label>/<label>" + SaveFlightRequestModel[i].oldVolume + "</label></td>";
                        str += "</tr></tbody>";

                    }
                    else {
                        str += " <tr>";
                        str += "<td><span id= FlightNo_" + i + ">" + SaveFlightRequestModel[i].FlightNo + "</span><input type='hidden' id= DailyFlightSNo_" + i + "  value = '" + SaveFlightRequestModel[i].DailyFlightSNo + "'></input></td>";
                        str += "<td><span id= FlightDate_" + i + ">" + SaveFlightRequestModel[i].Date + "</span></td>";
                        str += "<td><span id= ODPair_" + i + ">" + SaveFlightRequestModel[i].ODPair + "</span></td>";
                        str += "<td ><input id= Pieces_" + i + " style=' width: 80px;' type='text' value='" + SaveFlightRequestModel[i].Pieces + "'></input>/<label>" + SaveFlightRequestModel[i].oldPieces + "</label></td>";
                        str += "<td ><input id= GrossWeight_" + i + "  style=' width: 80px;' type='text' value='" + SaveFlightRequestModel[i].GrossWeight + "'></input>/<label>" + SaveFlightRequestModel[i].oldGrossWeight + "</label></td>";
                        str += "<td ><input id= VolumeWeight_" + i + "  style=' width: 80px;' type='text' onblur='changeVolumeWt(this)' value='" + SaveFlightRequestModel[i].VolumeWeight + "'></input>/<label>" + SaveFlightRequestModel[i].oldVolumeWeight + "</label></td>";
                        str += "<td><input  id= FlightVolume_" + i + "  style=' width: 80px;' type='text' onblur='changeVolume(this)'  value='" + SaveFlightRequestModel[i].Volume + "'> </input>/<label>" + SaveFlightRequestModel[i].oldVolume + "</label></td>";
                        str += "</tr></tbody>";
                        divBtn = "</br><div id='divbutton' style='float:right;'><button type='button' class='btn btn-success' onclick='UpdateFlightPlan();'    >Save</button> </td><td><button type='button' class='btn btn-inverse' onclick='closePopUp();' >Cancel</button></div>"

                    }


                }

            }

        }
        else {
            str += " <tbody><tr><td><center>No Data Found !</center></td></tr></tbody>";
        }
        str += "</table>" + divBtn;
        $('#windowViewGeneratedCode').append(str);

        //cfi.PopUp("windowViewGeneratedCode", "Flight Plan");

        //$("#popupViewCodetbl tr td input:eq(0)").focus();
        if (!$("#windowViewGeneratedCode").data("kendoWindow"))
            cfi.PopUp("windowViewGeneratedCode", "Flight Plan");
        else
            $("#windowViewGeneratedCode").data("kendoWindow").open();
        //-------------allow floating number only-------------------------------------------
        $('#popupViewCodetbl tr input[type!="hidden"]').on('input', function () {
            this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        });
    }
    /*----------------------Added by Nehal-----------------------------*/

}

function changeVolume(chv) {
    var chv_id = $(chv).attr("id")
    var rn = chv_id.split('_')[1];
    var chvWt_id = 'VolumeWeight_' + rn;
    var chgrwt_id = 'GrossWeight_' + rn;
    var key = event.which;

    if (!(key >= 48 && key <= 57)) {
        event.preventDefault();
    }
    if ((this.value <= 0.000) || (this.value <= 0)) {

        ShowMessage('warning', 'Warning - CCA', "Volume  Should Not be Zero or Less than Zero.");

        $("#" + chv_id).val('');
        return false;
    }
    else {
        var grwt = $('#' + chv_id).val();

        $('#' + chv_id).val(parseFloat(grwt).toFixed(3));
        if ($('#' + chv_id).val() == "NaN") {
            $("#" + chv_id).val('');
        }
        var a = parseFloat($("#" + chgrwt_id).val())
        var b = parseFloat($("#" + chvWt_id).val())
        var abc = a > b ? GetroundValue(a, 1) : GetroundValue(b, 1)
        // $("#Text_RevisedChargeableWeight").val(abc)

    }


    if (GetroundValue((this.value * 166.66), 1) > ($('#' + chgrwt_id).val())) {
        //var vlweight = $('#Text_RevisedVolume').val();

        //var vlwt = Math.abs((GetroundValue((this.value * 166.66), 1)).toFixed(2));

        // $("#Text_RevisedChargeableWeight").val(parseFloat(GetroundValue((this.value * 166.66), 1)).toFixed(2));
        $("#" + chvWt_id).val(parseFloat(GetroundValue(($('#' + chv_id).val() * 166.66), 1)).toFixed(3));
        var a = parseFloat($("#" + chgrwt_id).val())
        var b = parseFloat($("#" + chvWt_id).val())
        var abc = a > b ? GetroundValue(a, 1) : GetroundValue(b, 1)
        // $("#Text_RevisedChargeableWeight").val(abc)
        return false;
    } else {
        var vlweight = $('#' + chgrwt_id).val();

        var vlwt = Math.abs(vlweight).toFixed(2);

        // $("#Text_RevisedChargeableWeight").val(parseFloat(vlwt).toFixed(2));
        $("#" + chvWt_id).val(parseFloat(GetroundValue(($('#' + chv_id).val() * 166.66), 1)).toFixed(3));
        var a = parseFloat($("#" + chgrwt_id).val())
        var b = parseFloat($("#" + chvWt_id).val())
        var abc = a > b ? GetroundValue(a, 1) : GetroundValue(b, 1)
        // $("#Text_RevisedChargeableWeight").val(abc)
        return false;
    }


}
function changeVolumeWt(chvt) {
    //alert($(chvt).attr("id"));
    var chvt_id = $(chvt).attr('id');//AWBVolumeWeight
    var rn = chvt_id.split('_')[1];
    var chv_id = 'FlightVolume_' + rn;//AWBCBM
    var chgrwt_id = 'GrossWeight_' + rn;//AWBGrossWeight

    if ($("#" + chvt_id).val() != "") {        //Decimal By Tarun
        $("#" + chvt_id).val(GetroundValue($("#" + chvt_id).val(), 1).toFixed(3));
        // $("#_tempAWBVolumeWeight").val(GetroundValue($("#" + chvt_id).val(), 1));
    }
    var grosswt = ($("#" + chgrwt_id).val() == "" ? 0 : parseFloat($("#" + chgrwt_id).val()));
    var volwt = ($("#" + chvt_id).val() == "" ? 0 : parseFloat($("#" + chvt_id).val()));
    var cbm = volwt / 166.66;
    $("#" + chv_id).val(cbm.toFixed(3) == 0 ? "" : cbm.toFixed(3));
    //$("#_tempAWBCBM").val(cbm.toFixed(3) == 0 ? "" : cbm.toFixed(3));
    //var chwt = parseFloat(grosswt) > parseFloat(volwt) ? grosswt : volwt;
}
function closePopUp() {
    ////////////------------------- SaveFlightRequestModel = [];
    $("#windowViewGeneratedCode").data("kendoWindow").close();
}
function UpdateFlightPlan() {
    for (var i = 0; i < $("#popupViewCodetbl tbody tr ").length; i++) {
        var sumPcs = 0, sumGrossWT = 0, sumVolWt = 0, sumVolume = 0
        for (var j = 0; j < $("#popupViewCodetbl tbody tr ").length; j++) {
            if ($("#ODPair_" + i).text().split('/')[0] == $("#ODPair_" + j).text().split('/')[0]) {
                sumPcs = sumPcs + parseInt($("#Pieces_" + j).val()) || 0
                sumGrossWT = sumGrossWT + parseFloat($("#GrossWeight_" + j).val()).toFixed(2) || 0
                sumVolWt = sumVolWt + parseFloat($("#VolumeWeight_" + j).val()).toFixed(2) || 0
                sumVolume = sumVolume + parseFloat($("#FlightVolume_" + j).val()).toFixed(3)
            }
        }
        if (parseInt(sumPcs) > parseInt($("#Text_RevisedPieces").val())
            || sumGrossWT > parseFloat($("#Text_RevisedGrossWeight").val())
            || sumVolWt > parseFloat($("#Text_RevisedVolumeWeight").val())
            || sumVolume > parseFloat($("#Text_RevisedVolume").val())
        ) {
            //  Getflightplan(1)
            ShowMessage('warning', 'Warning - CCA', "Flight Pieces/Gross Wt./Volume/Vol. wt cannot be greater than Revised Pieces/Gross Wt./Volume/Vol. wt");

            return false;
        }
        if (parseInt(sumPcs) < parseInt($("#Text_RevisedPieces").val())
            || sumGrossWT < parseFloat($("#Text_RevisedGrossWeight").val())
            || sumVolWt < parseFloat($("#Text_RevisedVolumeWeight").val())
            || sumVolume < parseFloat($("#Text_RevisedVolume").val())
        ) {
            //  Getflightplan(1)
            ShowMessage('warning', 'Warning - CCA', "Flight Pieces/Gross Wt./Volume/Vol. wt cannot be Lesser than Revised Pieces/Gross Wt./Volume/Vol. wt");

            return false;
        }
        SaveFlightRequestModel[i].To = i + 1
        SaveFlightRequestModel[i].FlightNo = $("#FlightNo_" + i).text() || ""
        SaveFlightRequestModel[i].Pieces = $("#Pieces_" + i).val() || "0"
        SaveFlightRequestModel[i].GrossWeight = $("#GrossWeight_" + i).val() || "0"
        SaveFlightRequestModel[i].Volume = $("#FlightVolume_" + i).val() || "0"
        SaveFlightRequestModel[i].VolumeWeight = $("#VolumeWeight_" + i).val() || "0"
        SaveFlightRequestModel[i].Date = $("#FlightDate_" + i).text() || ""
        SaveFlightRequestModel[i].DailyFlightSNo = $("#DailyFlightSNo_" + i).val() || ""
        SaveFlightRequestModel[i].ODPair = $("#ODPair_" + i).text() || ""

    }
    $("#windowViewGeneratedCode").data("kendoWindow").close();
}
function setflightplandata(AWBSNo, SNo) {
    $.ajax({
        url: "Services/Shipment/CCAService.svc/GetFlightPlanData", data: { SNo: SNo, AWBSNo: AWBSNo }, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined) {
                SaveFlightRequestModel = [];
                var Code = jQuery.parseJSON(result);
                if (Code.Table0.length > 0) {
                    for (var i = 0; i < Code.Table0.length; i++) {
                        var SaveFlightData = {
                            To: i + 1,
                            FlightNo: Code.Table0[i].FlightNo || "",
                            Pieces: Code.Table0[i].Pieces || "0",
                            oldPieces: Code.Table0[i].oldPieces || "0",
                            GrossWeight: Code.Table0[i].GrossWeight || "0",
                            oldGrossWeight: Code.Table0[i].oldGrossWeight || "0",
                            Volume: Code.Table0[i].FlightVolume || "0",
                            oldVolume: Code.Table0[i].oldVolume || "0",
                            VolumeWeight: Code.Table0[i].VolumeWeight || "0",
                            oldVolumeWeight: Code.Table0[i].oldVolumeWeight || "0",
                            Date: Code.Table0[i].FlightDate || "",
                            DailyFlightSNo: Code.Table0[i].DailyFlightSNo || "",
                            ODPair: Code.Table0[i].OriginAirportCode + "/" + Code.Table0[i].DestinationAirportCode || ""
                        }
                        SaveFlightRequestModel.push(SaveFlightData);
                    }
                }
            }
        }
    });
}
function DueCarrierTab() {
    var PageType = getQueryStringValue("FormAction").toUpperCase();
    //  $("#popUpwimdow").html('');
    $('#tbl' + 'dueCarriercharges').appendGrid({
        V2: true,
        tableID: 'tbl' + 'dueCarriercharges',
        contentEditable: PageType == 'NEW',
        // tableColumns: 'SNo,OtherChargeCode,OtherchargeDetail,ChargeValue',
        masterTableSNo: AWBSNo,
        currentPage: 1, itemsPerPage: 50,
        model: { AWBSNo: AWBSNo == "" ? 0 : parseFloat(AWBSNo) },
        //   sort: '',
        servicePath: '/Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + 'DueCarrierOtherChargeTab' + 'Record',
        //  createUpdateServiceMethod: 'createUpdate' + dbTableName,
        ///  deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Carrier Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: AWBSNo },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'Type', display: 'Payment Type', type: 'select', ctrlOptions: { '1': 'PREPAID', '2': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'OtherChargeCode', display: 'Charge Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_DueCarrier', filterField: "Code", filterCriteria: "contains" },
            { name: 'OtherchargeDetail', display: 'Charge Detail', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            //{ name: 'OtherchargeCurrency', display: 'Other Charges Currency', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'OtherchargeCurrency', display: 'Other Charge Currency', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckExchangeRate(this.id);" }, onChange: "return CheckExchangeRate(this.id);", ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_AgentOtherChargeCurrency', filterField: "CurrencyCode", filterCriteria: "contains" },

            { name: 'ChargeValue', display: 'Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '90px' }, isRequired: true },
            { name: 'ConvertedCurrencyCode', display: 'Rate Currency', type: 'hidden', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ConvertedChargeValue', display: 'Rate Charge', type: 'hidden', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ReferenceNumber', display: 'Reference Number', type: 'hidden', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ChargeType', display: 'Mode of Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }

        ],
        dataLoaded: function () {
            $("#tbldueCarriercharges tbody tr td label[id*='tbldueCarriercharges_ChargeType_']").each(function () {
                var RowNo = $(this).attr('id').split('_')[2]
                $("#tbldueCarriercharges_ConvertedChargeValue_" + RowNo).val($("#tbldueCarriercharges_SNo_" + RowNo).val());
                $("#tbldueCarriercharges_SNo_" + RowNo).val('0');
                if ($(this).text().trim().toUpperCase() == 'AUTO') {
                    $("#tbldueCarriercharges_Delete_" + RowNo).remove()
                    if (PageType == 'NEW') {
                        $("#tbldueCarriercharges_OtherChargeCode_" + RowNo).data("kendoAutoComplete").enable(false);
                        $("#tbldueCarriercharges_Type_" + RowNo).attr('disabled', true)
                        $("#tbldueCarriercharges_OtherchargeDetail_" + RowNo).attr('disabled', true)
                        $("#tbldueCarriercharges_ChargeValue_" + RowNo).attr('disabled', true)
                        $("#_temptbldueCarriercharges_ChargeValue_1" + RowNo).attr('disabled', true)
                        $("#tbldueCarriercharges_OtherchargeCurrency_" + RowNo).data("kendoAutoComplete").enable(false);
                    }
                    //  $("#tbldueCarriercharges_Type_1").attr('disabled', true) 

                }
            })
            //if (PageType != 'NEW') {
            //  //  $("#tbldueCarriercharges").appendGrid('load', (DueCarrierOtherChargeCCA));
            //    $("#tbldueCarriercharges tbody tr td label[id*='tbldueCarriercharges_Type_']").each(function () {
            //        $(this).text($(this).text() == '1' ? 'PREPAID' : 'COLLECT')
            //    })
            //}

        },
        isPaging: false,
        //hideButtons: { updateAll: true, append: true,  insert: false}
        hideButtons: { updateAll: true, insert: true, remove: false },
        showButtons: { removeAll: false }

    });

    $("#divbutton").remove();
    var divBtn = "<div id='divbutton' style='float:right;'><button type='button' class='btn btn-success'   onclick='updateDuecarrierData();'  >Save</button> </td><td><button type='button' class='btn btn-inverse' onclick='closepopup(1)' >Cancel</button></div>"
    divBtn = PageType == 'NEW' ? divBtn : "";
    if (!$("#popUpwimdow").data("kendoWindow")) {

        cfi.PopUp("popUpwimdow", "Due Carrier Charges", 1000);
    }

    else {
        $("#popUpwimdow").data("kendoWindow").open();
    }

    // $("#popUpwimdow").data("kendoWindow").close();
    $("#popUpwimdow").append(divBtn)
    if (PageType != 'NEW' || flagdueCarrier == 1) {
        // DueCarrierOtherChargeCCA.sort(compare)
        $("#tbldueCarriercharges").appendGrid('load', (DueCarrierOtherChargeCCA));

    }


}
function DueAgentTab() {
    // $("#popUpwimdow").html('');
    var PageType = getQueryStringValue("FormAction").toUpperCase();
    $('#tbldueAgentcharges').appendGrid({
        V2: true,
        tableID: 'tbldueAgentcharges',
        contentEditable: PageType == 'NEW',
        //tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
        masterTableSNo: AWBSNo,
        currentPage: 1, itemsPerPage: 5,
        model: { AWBSNo: AWBSNo == "" ? 0 : parseInt(AWBSNo) },
        // sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'GetAgentOtherChargeTabRecord',
        // createUpdateServiceMethod: 'createUpdate' + dbTableName,
        // deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Agent Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: AWBSNo },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'Type', display: 'Payment Type', type: 'select', ctrlOptions: { '1': 'PREPAID', '2': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '90px' } },
            { name: 'OtherChargeType', display: 'Charge Type', type: 'hidden', ctrlOptions: { '1': 'DUE CARRIER', '2': 'DUE AGENT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '100px' } },
            { name: 'OtherChargeCode', display: 'Charge Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_DueCarrier', filterField: "Code", filterCriteria: "contains" },
            { name: 'OtherchargeDetail', display: 'Charge Detail', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '150px' } },
            { name: 'AgentOtherchargeCurrency', display: 'Other Charge Currency', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckExchangeRate(this.id);" }, onChange: "return CheckExchangeRate(this.id);", ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_AgentOtherChargeCurrency', filterField: "CurrencyCode", filterCriteria: "contains" },
            { name: 'ChargeValue', display: 'Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '90px' }, isRequired: true },
            { name: 'ConvertedCurrencyCode', display: 'Rate Currency', type: 'hidden', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ConvertedChargeValue', display: 'Rate Charge', type: 'hidden', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ReferenceNumber', display: 'Reference Number', type: 'hidden', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ChargeType', display: 'Mode of Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        dataLoaded: function () {

            $("#tbldueAgentcharges tbody tr td label[id*='tbldueAgentcharges_ChargeType_']").each(function () {
                var RowNo = $(this).attr('id').split('_')[2]
                $("#tbldueAgentcharges_ConvertedChargeValue_" + RowNo).val($("#tbldueAgentcharges_SNo_" + RowNo).val());
                $("#tbldueAgentcharges_SNo_" + RowNo).val('0');
                if ($(this).text().trim().toUpperCase() == 'AUTO') {
                    $("#tbldueAgentcharges_Delete_" + RowNo).remove()
                    if (PageType == 'NEW') {
                        $("#tbldueAgentcharges_OtherChargeCode_" + RowNo).data("kendoAutoComplete").enable(false);
                        $("#tbldueAgentcharges_Type_" + RowNo).attr('disabled', true)
                        $("#tbldueAgentcharges_OtherchargeDetail_" + RowNo).attr('disabled', true)
                        $("#tbldueAgentcharges_ChargeValue_" + RowNo).attr('disabled', true)
                        $("#_temptbldueAgentcharges_ChargeValue_" + RowNo).attr('disabled', true)
                        $("#tbldueAgentcharges_AgentOtherchargeCurrency_" + RowNo).data("kendoAutoComplete").enable(false);
                    }

                }
            })

            //if (PageType != 'NEW') {

            // //   $("#tbldueAgentcharges").appendGrid('load', (DueAgentOtherChargeCCA));
            //    $("#tbldueAgentcharges tbody tr td label[id*='tbldueAgentcharges_Type_']").each(function () {


            //        $(this).text($(this).text() == '1' ? 'PREPAID' : 'COLLECT')
            //    })
            //}
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: false },
        showButtons: { removeAll: false }
    });
    $("#divbutton").remove();
    var divBtn = "<div id='divbutton' style='float:right;'><button type='button' class='btn btn-success'  onclick='updateDueagentData();'    >Save</button> </td><td><button type='button' class='btn btn-inverse' onclick='closepopup(2)'  >Cancel</button></div>"
    divBtn = PageType == 'NEW' ? divBtn : "";
    if (!$("#AgentPopUp").data("kendoWindow")) {
        cfi.PopUp("AgentPopUp", "Due Agent Charges", 1000);
    }

    else {

        $("#AgentPopUp").data("kendoWindow").open();
    }

    $("#AgentPopUp").append(divBtn);
    if (PageType != 'NEW' || flagdueAgent == 1) {
        //  DueAgentOtherChargeCCA.sort(compare)
        $("#tbldueAgentcharges").appendGrid('load', (DueAgentOtherChargeCCA));

    }
    //----------------------------------------------
    //$("#tbldueCarriercharges_btnRemoveLast").unbind('click').bind('click', function () {

    //})

}
function OpenDueCarrierTab() {
    DueCarrierTab();
}
function OpenDueAgentTab() {
    DueAgentTab();
}
function updateDuecarrierData() {
    flagdueCarrier = 1;
    var res = $("#tbldueCarriercharges tr[id^='tbldueCarriercharges']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    if (!validateTableData('tbldueCarriercharges', res)) {
        return false;
    }

    DueCarrierOtherChargeCCA = [];
    // $("#tbldueCarriercharges").cfValidator();
    // if ($("#tbldueCarriercharges").data('cfValidator').validate()) {
    var ModeOfCharge = "";
    if ($("#tbldueCarriercharges tbody tr:eq(0)[class='empty']").length < 1) {
        $("#tbldueCarriercharges tbody tr").each(function () {
            var rowNo = $(this).attr('id').split('_')[2]
            ModeOfCharge = $("#tbldueCarriercharges_ChargeType_" + rowNo).text().trim().toUpperCase();
            if (ModeOfCharge != 'text') {
                var SaveFlightData = {
                    SNo: $("#tbldueCarriercharges_ConvertedChargeValue_" + rowNo).val() || "0",
                    AWBSNo: $("#tbldueCarriercharges_AWBSNo_" + rowNo).val() || "0",
                    BookingSNo: $("#tbldueCarriercharges_BookingSNo_" + rowNo).val() || "0",
                    BookingRefNo: $("#tbldueCarriercharges_BookingRefNo_" + rowNo).val() || "0",
                    Type: $("#tbldueCarriercharges_Type_" + rowNo).val() || "0",
                    //OtherChargeType : $("#tbldueAgentcharges_HdnOtherChargeCode_" + rowNo).val() ,
                    OtherChargeCode: $("#tbldueCarriercharges_OtherChargeCode_" + rowNo).val() || "0",
                    OtherchargeDetail: $("#tbldueCarriercharges_OtherchargeDetail_" + rowNo).val() || "0",
                    OtherchargeCurrency: $("#tbldueCarriercharges_OtherchargeCurrency_" + rowNo).val() || "0",
                    //HdnAgentOtherchargeCurrency : $("#tbldueAgentcharges_HdnAgentOtherchargeCurrency_" + rowNo).val() ,
                    ChargeValue: $("#tbldueCarriercharges_ChargeValue_" + rowNo).val() || "0",
                    CreatedBy: $("#tbldueCarriercharges_CreatedBy_" + rowNo).val() || "0",
                    UpdatedBy: $("#tbldueCarriercharges_UpdatedBy_" + rowNo).val() || "0",
                    ChargeType: $("#tbldueCarriercharges_ChargeType_" + rowNo).text() || "",
                }

                DueCarrierOtherChargeCCA.push(SaveFlightData)
            }

        })
    }
    ShowMessage('success', 'Success - CCA- Due Carrier Charges ', "Due Carrier Charges Saved Successfully");
    $("#popUpwimdow").data("kendoWindow").close();
    //  }
}
function updateDueagentData() {
    flagdueAgent = 1;
    var ModeOfCharge = "";
    //  $("#tbldueAgentcharges").cfValidator();
    // if ($("#tbldueAgentcharges").data('cfValidator').validate()) {
    var res = $("#tbldueAgentcharges tr[id^='tbldueAgentcharges']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    if (!validateTableData('tbldueAgentcharges', res)) {
        return false;
    }
    DueAgentOtherChargeCCA = [];
    if ($("#tbldueAgentcharges tbody tr:eq(0)[class='empty']").length < 1) {
        $("#tbldueAgentcharges tbody tr").each(function () {
            ModeOfCharge = $("#tbldueAgentcharges_ChargeType_" + rowNo).text().trim().toUpperCase();
            if (ModeOfCharge != 'text') {
                var rowNo = $(this).attr('id').split('_')[2]
                var SaveFlightData = {
                    SNo: $("#tbldueAgentcharges_ConvertedChargeValue_" + rowNo).val() || "0",
                    AWBSNo: $("#tbldueAgentcharges_AWBSNo_" + rowNo).val() || "0",
                    BookingSNo: $("#tbldueAgentcharges_BookingSNo_" + rowNo).val() || "0",
                    BookingRefNo: $("#tbldueAgentcharges_BookingRefNo_" + rowNo).val() || "0",
                    Type: $("#tbldueAgentcharges_Type_" + rowNo).val() || "0",
                    OtherChargeType: "0",
                    OtherChargeCode: $("#tbldueAgentcharges_OtherChargeCode_" + rowNo).val() || "0",
                    OtherchargeDetail: $("#tbldueAgentcharges_OtherchargeDetail_" + rowNo).val() || "0",
                    AgentOtherchargeCurrency: $("#tbldueAgentcharges_AgentOtherchargeCurrency_" + rowNo).val() || "0",
                    HdnAgentOtherchargeCurrency: $("#tbldueAgentcharges_HdnAgentOtherchargeCurrency_" + rowNo).val() || "0",
                    ChargeValue: $("#tbldueAgentcharges_ChargeValue_" + rowNo).val() || "0",
                    CreatedBy: $("#tbldueAgentcharges_CreatedBy_" + rowNo).val() || "0",
                    UpdatedBy: $("#tbldueAgentcharges_UpdatedBy_" + rowNo).val() || "0",
                    ChargeType: $("#tbldueAgentcharges_ChargeType_" + rowNo).text() || "",
                }

                DueAgentOtherChargeCCA.push(SaveFlightData)
            }

        })
    }
    ShowMessage('success', 'Success - CCA- Due Agent Charges ', "Due Agent Charges Saved Successfully");
    $("#AgentPopUp").data("kendoWindow").close();

    //  }
}

function closepopup(i) {
    if (i == 1)
        $("#popUpwimdow").data("kendoWindow").close();
    else
        $("#AgentPopUp").data("kendoWindow").close();
}
//-------------------Extra parameter-----------------
function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_AWBSNo") {
        var AirlineSNo = userContext.AirlineSNo;
        var CitySNo = userContext.CitySNo
        param.push({ ParameterName: "AirlineSNo", ParameterValue: AirlineSNo });
        param.push({ ParameterName: "CitySNo", ParameterValue: CitySNo });
        return param;
    }
}
//----------------------END--------------------------

function CheckExchangeRate(obj) {
    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT') {
        var RowNo = $(obj).attr('id').split('_')[2]
        var mode = $(obj).attr('id').split('_')[0]
        var currency = ""
        if (mode == 'tbldueCarriercharges')
            currency = $("#tbldueCarriercharges_HdnOtherchargeCurrency_" + RowNo).val();
        else
            currency = $("#tbldueAgentcharges_HdnAgentOtherchargeCurrency_" + RowNo).val();
        var AirlineSNo = $("#AWBNO").text().split('-')[0] || 0
        if (currency != "") {
            $.ajax({
                url: "../Services/Accounts/DirectPaymentService.svc/GetExchangeRate", async: false, type: "GET", dataType: "json", cache: false,
                data: {
                    currency: currency, Mode: 3, AirlineSNo: AirlineSNo, AccountSNo: 0
                },   // 1 for direct payment
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != undefined && result.length > 0) {
                        var ResultData = jQuery.parseJSON(result);
                        var FromCurrency = ResultData.Table0[0]["FromCurrency"]
                        var ToCurrency = ResultData.Table0[0]["ToCurrency"]
                        if (ResultData.Table0[0]["Error"] == "2") {
                            ShowMessage('warning', 'Warning - CCA', "Exchange Rate Not Available for: " + FromCurrency + " To " + ToCurrency + "");
                            if (mode == 'tbldueCarriercharges') {
                                $("#tbldueCarriercharges_HdnOtherchargeCurrency_" + RowNo).val('');
                                $("#tbldueCarriercharges_OtherchargeCurrency_" + RowNo).val('');
                            }
                            else {
                                $("#tbldueAgentcharges_HdnAgentOtherchargeCurrency_" + RowNo).val('');
                                $("#tbldueAgentcharges_AgentOtherchargeCurrency_" + RowNo).val('');
                            }
                        }


                    }
                }
            });
        }
    }
}
function GetCharges() {
    var SNo = $('#hdnCCASNo').val() || 0;
    var CCAList = [];
    var CCAArray = {
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
        IsApproved: 0,
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
        RevisedWeightUnit: $("#Text_RevisedWeightUnit").val() == '' ? '0' : $("#Text_RevisedWeightUnit").val() || "",
        OriginalWeightUnit: $("span#hdn_OriginalWeightUnit").html() == '' ? '0' : $("span#hdn_OriginalWeightUnit").html() || "",
        RevisedVolume: $("#Text_RevisedVolume").val() == '' ? '0' : $("#Text_RevisedVolume").val(),
        OriginalVolume: $("span#hdn_OriginalVolume").html() == '' ? '0' : $("span#hdn_OriginalVolume").html(),
        RevisedVolumeWeight: $("#Text_RevisedVolumeWeight").val() == '' ? '0' : $("#Text_RevisedVolumeWeight").val(),
        OriginalVolumeWeight: $("span#hdn_OriginalVolumeWeight").html() == '' ? '0' : $("span#hdn_OriginalVolumeWeight").html(),
        RevisedChargeableWeight: $("#Text_RevisedChargeableWeight").val(),
        OriginalChargeableWeight: $("span#hdn_OriginalChargeableWeight").html(),
        shipper: $("span#Shipper").html() || "",
        Consignee: $("span#Consignee").html() || "",
        ISWEIGHTDISCREP: $('input[type="checkbox"][name=WEIGHTDISCREP]:checked').val() == undefined ? '0' : '1',
        ISVOLUMEDISCREP: $('input[type="checkbox"][name=VOLUMEDISCREP]:checked').val() == undefined ? '0' : '1',
        ISCNEECHANGE: $('input[type="checkbox"][name=CNEECHANGE]:checked').val() == undefined ? '0' : '1',
        ISDESTCHANGE: $('input[type="checkbox"][name=DESTCHANGE]:checked').val() == undefined ? '0' : '1',
        ISRATEERROR: $('input[type="checkbox"][name=RATEERROR]:checked').val() == undefined ? '0' : '1',
        ISCCACHARGE: $('input[type="checkbox"][name=CCACHARGE]:checked').val() == undefined ? '0' : '1',
        RevisedCommoditySNo: $('#CommoditySNo').val() == '' ? '0' : $('#CommoditySNo').val(),
        OriginalCommoditySNo: $('#OriginalCommoditySNo').val() == '' ? '0' : $('#OriginalCommoditySNo').val(),
        RevisedSHCSNo: $('#SHCSNo').val() == '' ? '' : $('#SHCSNo').val(),
        OriginalSHCSNo: $('#OriginalSHCSNo').val() == '' ? '0' : $('#OriginalSHCSNo').val(),
        RevisedProductSNo: $('#ProductSNo').val() == '' ? '0' : $('#ProductSNo').val(),
        OriginalProductSNo: $('#OriginalProductSNo').val() == '' ? '0' : $('#OriginalProductSNo').val(),
        ISSHCCHARGE: $('input[type="checkbox"][name=SHCCHARGE]:checked').val() == undefined ? '0' : '1',
        ISPRODUCTCHARGE: $('input[type="checkbox"][name=PRODUCTCHARGE]:checked').val() == undefined ? '0' : '1',
        ISCOMMODITYCHARGE: $('input[type="checkbox"][name=COMMODITYCHARGE]:checked').val() == undefined ? '0' : '1',
        ISPIECESCHARGE: $('input[type="checkbox"][name=PIECESCHARGE]:checked').val() == undefined ? '0' : '1',
        Revisedshipper: $('#Text_RevisedShipper').val() || "",
        RevisedConsignee: $('#Text_RevisedConsignee').val() || "",
        ISSHPRCHANGE: $('input[type="checkbox"][name=SHPRCHANGE]:checked').val() == undefined ? '0' : '1',
        OriginalNOG: $("#hdn_NatureOfGoods").text(),
        RevisedNOG: $("#NatureOfGoods").val(),
        ISNOGCHANGE: $('input[type="checkbox"][name=NOGCHANGE]:checked').val() == undefined ? '0' : '1',

    };

    CCAList.push(CCAArray);

    $.ajax({
        url: "Services/Shipment/CCAService.svc/GetCharges", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            SNo: SNo, SaveCCA: CCAList
        }),
        success: function (result) {
            if (result != undefined && result.length > 0) {
                var GetSucessResult = JSON.parse(result);
                if (GetSucessResult.Table0.length > 0) {
                    $("#Text_RevisedPrepaidWeightCharges").text(GetSucessResult.Table0[0].FinalRate)
                    $("#Text_RevisedPrepaidDueCarrier").text(GetSucessResult.Table1[0].OtherChargePrepaidDueCarrierTotal)
                    $("#Text_RevisedCollectDueCarrier").text(GetSucessResult.Table1[0].OtherChargeCollectDueCarrierTotal)
                    $("#Text_RevisedPrepaidDueAgent").text(GetSucessResult.Table1[0].OtherChargePrepaidDueAgentTotal)
                    $("#Text_RevisedCollectDueAgent").text(GetSucessResult.Table1[0].OtherChargeCollectDueAgentTotal)
                    //  $("#Text_RevisedPrepaidTotal").text(GetSucessResult.Table1[0].TotalPrepaid)
                    // $("#Text_RevisedCollectTotal").text(GetSucessResult.Table1[0].TotalCollect)
                    $("#Text_RevisedPrepaidTax").text(GetSucessResult.Table2[0].TOTALTaxAmount)
                    var Totalamount = parseFloat($("#Text_RevisedPrepaidWeightCharges").text()) + parseFloat($("#Text_RevisedPrepaidDueAgent").text()) + parseFloat($("#Text_RevisedPrepaidDueCarrier").text()) + parseFloat($("#Text_RevisedPrepaidTax").text())
                    $("#Text_RevisedPrepaidTotal").text(Totalamount);
                }


            }
        }
    });
}