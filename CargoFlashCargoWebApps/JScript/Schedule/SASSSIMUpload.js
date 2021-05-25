/// <reference path="../../Services/Schedule/SSIMUploadService.svc" />
/// <reference path="../../Services/Schedule/SSIMUploadService.svc" />
//////saddf
var ssimList = [];
var DataToPush = [];
var DataToValidate = [];
var MultiSubmit = false;
var ajaxReqArr = [];
var Counter = 0;
var VCounter = 0;
var VCount = 0;
var TotalBatch = 0;
var ResultData = [];
var ErrorfromDB = false;
var LotsChunk = 100;
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    $("#tbl tr td.formbuttonrow").append('<input type="button" class="btn btn-info" name="PreviewNvalidate" id="PreviewNvalidate" style="width:120px;" value="Preview &amp; Validate"><input type="button" id ="Submit" class="btn btn-success" style="display:none; width:120px;" value="Save SSIM"/><input type="button" class="btn btn-inverse" name="Excel" id="Excel" style="width:120px; display:none;" value="Export To Excel" onclick="ExportToExcel();"><input type="button" class="btn btn-danger" name="ResetSSIM" id="ResetSSIM" value="Reset All" ">&nbsp;&nbsp;&nbsp;&nbsp;<span id="spnMsg" style="Color:red;font-weight:bold; font-size:12px; display:none;" >Please wait...</span><div id="divMakeTable" style="display:none;" onclick="MakeTable()"></div>');
    $("#tblSSIMpreview").hide();
    $("#tblSSIMpreview").append("<thead class='ui-widget-header'><tr><td class='ui-widget-header'>SNo</td><td class='ui-widget-header'>Carrier Code</td><td class='ui-widget-header'>Flight No</td><td class='ui-widget-header'>Batch No</td><td class='ui-widget-header'>Leg No</td><td class='ui-widget-header'>Flight Type</td><td class='ui-widget-header'>Start Date</td><td class='ui-widget-header'>End Date</td><td class='ui-widget-header'>Day</td><td class='ui-widget-header'>Origin</td><td class='ui-widget-header'>ETD</td><td class='ui-widget-header'>ETD (GMT)</td><td class='ui-widget-header'>Destination</td><td class='ui-widget-header'>ETA</td><td class='ui-widget-header'>ETA (GMT)</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Gross Wt.</td><td class='ui-widget-header'>Volume Wt.</td><td class='ui-widget-header'>Time Difference</td><td class='ui-widget-header'>Validation Message</td><td class='ui-widget-header' style='text-align:left;'>Already Exist Dates &emsp;&emsp;&ensp;&emsp;&emsp;&ensp;&emsp;&emsp;&ensp;&emsp;&emsp;&ensp;&emsp;&emsp;</td></tr></thead><tbody></tbody>");

    $("#ResetSSIM").on('click', function () {
        Reset();
    });

    //$("<input type='button' tabindex='2' class='btn btn-info' name='Excel' id='Excel' style='width:120px;' value='Export To Excel' onclick='ExportToExcel();'>").insertAfter("[id='PreviewNvalidate']");
    //$("input[id='Submit']").css("visibility", "hidden");
    //$("input[id='Submit1']").css("visibility", "hidden");
    //$("#Submit1,#Submit").after('<span id="waitMsg" style="color:red;font-size:15px;">         Please wait...</span>');
    //$("span#waitMsg").hide();
    // $("#Maindiv").css("visibility", "hidden");
    //$('#tblSSIMpreview').appendGrid({
    //    tableID: 'tblSSIMpreview',
    //    caption: 'SSIM Document Preview',
    //    contentEditable: true,
    //    columns: [

    //    { name: 'AirlineCode', display: 'Airline Code', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
    //    { name: 'FlightNo', display: 'FlightNo', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
    //    { name: 'ValidFrom', display: 'Valid From', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
    //    { name: 'ValidTo', display: 'Valid To', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
    //    { name: 'Days', display: 'Days', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
    //    { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
    //    { name: 'Destination', display: 'Destination', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
    //    { name: 'ETD', display: 'ETD', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
    //    { name: 'ETA', display: 'ETA', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },

    //    ],
    //    isPaging: false,
    //    hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },

    //});Submit
    var todaydate = new Date();
    var SSIMDate = $("#SSIMDate").data("kendoDatePicker");
    SSIMDate.min(todaydate);
    $("input[id^=SSIMDate]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });
    $("#__SpanHeader__").css("color", "black");
    $("#Submit").click(function (e) {
        dirtyForm.isDirty = false;
        _callBack();

        $("#Submit").hide();
        $("#Excel").hide();

        if (MultiSubmit == true)
        {
            ShowMessage('warning', 'Information!', "Already uploaded, Please validate then try again.");
            return false;
        }
       
        Counter = 0;
        var arrayOfSuccess = [];
        var arrayOfFailure = [];
        ajaxReqArr = [];
        var RequestLots = chunkArrayInGroups(DataToPush, LotsChunk);

        if (RequestLots.length > 0)
        {
            $('#spnMsg').html('').show().text("Please wait...(" + parseInt((ajaxReqArr.length / RequestLots.length) * 100) + "%) Completed.");
            ShowLoader(true);
            RequestRecursion(RequestLots)
        }
        else
        {
            ShowMessage('info', 'Information!', "There are no records to insert.");
        }
        /*
        if (DataToPush.length > 0) {
            ShowLoader(true);
            for (var i = 0; i < DataToPush.length; i++) {               
             var ajaxReq = $.ajax({
                    url: "Services/Schedule/SASSSIMUploadService.svc/SaveSSIMData",
                    type: "POST",
                    dataType: "json",
                    global:false,
                    data: JSON.stringify({ DiffBatchSNo: DataToPush[i] }),
                    contentType: "application/json; charset=utf-8",
                    cache: false,
                    success: function (result) {
                        var Data = JSON.parse(result).Table0[0].Message;
                        $('#tblSSIMpreview tr[id^="tr' + Data.split('-')[1] + '"]').find('td:eq(18)').html(Data.split('-')[2]);
                        $('#tblSSIMpreview tr[id^="tr' + Data.split('-')[1] + '"]').attr('name', Data.split('-')[0]);
                    },
                    error:function(ex){  }
             });

             ajaxReqArr.push(ajaxReq);

            }
            $.when.apply(null, ajaxReqArr).done(function () {

                ShowMessage('success', 'Information!', "SSIM Uploaded Successfully. Excel file downloaded for Successs and Failure.");

                if ($('#tblSSIMpreview tr[id^="tr"][name="Success"]').length > 0)
                    CreateSuccessNFailureExcel($('#tblSSIMpreview tr[id^="tr"][name="Success"]'), 'Success');

                if ($('#tblSSIMpreview tr[id^="tr"]').not('[name="Success"]').length > 0)
                    CreateSuccessNFailureExcel($('#tblSSIMpreview tr[id^="tr"]').not('[name="Success"]'), 'Failure');

                ShowLoader(false);
            });
            
        }
        else {
            ShowMessage('info', 'Information!', "There is no record to insert");
        }*/
    });
   
    $("input[name='PreviewNvalidate']").click(function (e) {
        $("#Submit").hide();
        $('#PreviewNvalidate').hide();
        $("#Excel").hide();
        $('#spnMsg').html('');
        //$("input[id='Submit1']").css("visibility", "hidden");
        MultiSubmit = false;
        ErrorfromDB = false;
            //$("#tblSSIMpreview").find("tbody").remove();
            //$("#tblSSIMpreview").find("thead").remove();
            var fileSelect = document.getElementById("Fileupload");
            var files = fileSelect.files;
            var fileName = "";
            //if (files['0'].size > 10240)
            //    alert("Max image size is 10 mb");
            //else {
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                fileName = files[i].name;
                data.append(files[i].name, files[i]);
            }
            if (fileName == '' || fileName == undefined) {
                ShowMessage('warning', 'File Upload!', "Choose a File To Upload.", "bottom-right");
                return false;
            }
            if ($("#SSIMDate").val() == '') {
                ShowMessage('warning', 'File Upload!', "Date cannot be blank.", "bottom-right");
                return false;
            }
           //if (confirm("Current Schedule will be expire according to you selected Date and Schedule Carrier Code, Are you sure want to continue?")) {
            var tableString="";
            var flag = true;
            $('#spnMsg').html("File Uplaoding Please wait...");
            $('#spnMsg').show();
            var AjxPromise = $.ajax({
                url: "Handler/SSIMUpload.ashx?SASSSIMUpload=Yes&SSIMDate=" + $("#SSIMDate").val() + "&Environment=" + userContext.SysSetting.ICMSEnvironment + "",
                type: "POST",
                data: data,                
                contentType: false,
                processData: false,
                async: true,
                success: function (result) {
                    if (result.length > 0) {
                        if (result[0].ErrorMsg != undefined && result[0].ErrorMsg!="") {
                            $("#Submit").hide();
                            $("#Excel").hide();
                            $('#spnMsg').html('');
                            ShowMessage('warning', 'File Upload!', result[0].ErrorMsg, "bottom-right");
                        }
                        else if (result[0].Data.length > 0) {
                            TotalBatch = result[0].Total;
                            ResultData = result[0].Data;
                            $('#spnMsg').html('File Uploading Done.');
                            $('#divMakeTable').click();
                        }
                            /*
                        else if (result[0].Data.length > 0) {
                            TotalBatch = result[0].Total;
                            $('#spnMsg').html('File Uploading Done.');
                           
                            $("#tblSSIMpreview").append("<thead class='ui-widget-header'><tr><td class='ui-widget-header'>SNo</td><td class='ui-widget-header'>Carrier Code</td><td class='ui-widget-header'>Flight No</td><td class='ui-widget-header'>Batch No</td><td class='ui-widget-header'>Leg No</td><td class='ui-widget-header'>Flight Type</td><td class='ui-widget-header'>Start Date</td><td class='ui-widget-header'>End Date</td><td class='ui-widget-header'>Day</td><td class='ui-widget-header'>Origin</td><td class='ui-widget-header'>ETD</td><td class='ui-widget-header'>ETD (GMT)</td><td class='ui-widget-header'>Destination</td><td class='ui-widget-header'>ETA</td><td class='ui-widget-header'>ETA (GMT)</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Gross Wt.</td><td class='ui-widget-header'>Volume Wt.</td><td class='ui-widget-header'>Time Difference</td><td class='ui-widget-header'>Validation Message</td><td class='ui-widget-header' style='text-align:left;'>Already Exist Dates &emsp;&emsp;&ensp;&emsp;&emsp;&ensp;&emsp;&emsp;&ensp;&emsp;&emsp;&ensp;&emsp;&emsp;</td></tr></thead>");
                            tableString += "<tbody>";
                            var PreviousID = 0;
                            DataToPush = [];
                            DataToValidate = [];
                            VCount = 0;
                            $(result[0].Data).each(function (index, value) {//result.items

                                var Color = "";
                                Color = value.ValidationMessage == 'VALID' ? 'green' : 'red';

                                var TR = "<tr align='center' id='" + "tr" + value.DiffBatchSNo + "'><td>" + value.SNo + "</td><td>" + value.AirlineCode + "</td><td>" + value.FlightNo + "</td><td>" + value.BatchNo + "</td><td>" + value.LegID + "</td><td>" + value.FlightType + "</td><td>" + value.StartDate + "</td><td>" + value.EndDate + "</td><td>" + value.DaysNo + "</td><td>" + value.Origin + "</td><td>" + value.ETD + "</td><td>" + value.ETDGMT + "</td><td>" + value.Destination + "</td><td>" + value.ETA + "</td><td>" + value.ETAGMT + "</td><td>" + value.AircraftType + "</td><td>" + value.GrossWeight + "</td><td>" + value.VolumeWeight + "</td><td>" + value.TimeDifference + "</td><td><font color='" + Color + "'>" + value.ValidationMessage + "</font></td><td style='text-align:left; word-wrap:break-word; height:auto;'>" + value.ExistOnDates + "</td></tr>";
                                //tableString += "<tr align='center' id='" + "tr" + value.SNo + "'><td>" + value.SNo + "</td><td>" + value.AirlineCode + "</td><td id=" + value.DiffBatchSNo + ">" + value.FlightNo + "</td><td>" + value.FlightType + "</td><td>" + value.StartDate + "</td><td>" + value.EndDate + "</td><td>" + value.DaysNo + "</td><td>" + value.Origin + "</td><td>" + value.ETD + "</td><td>" + value.ETDGMT + "</td><td>" + value.Destination + "</td><td>" + value.ETA + "</td><td>" + value.ETAGMT + "</td><td>" + value.AircraftType + "</td><td>" + value.AircraftSNo + "</td><td>" + value.GrossWeight + "</td><td>" + value.VolumeWeight + "</td><td>" + value.TimeDifference + "</td><td>" + value.ValidationMessage + "</td></tr>";
                                tableString += TR;
                                
                                var Processed = parseInt((VCount / TotalBatch) * 100);

                                if (PreviousID != value.DiffBatchSNo && value.IsValid == 0 ) {
                                    VCount = VCount + 1;
                                    var Processed = parseInt((VCount / TotalBatch) * 100);

                                    if (Processed % 10 == 0 && Processed != 100) {
                                        $('#spnMsg').html("Validating Data, Please wait... (" + Processed + "%) Completed.");
                                    }
                                    else
                                        $('#spnMsg').html("Validation Completed");
                                }
                                else //(PreviousID != value.DiffBatchSNo && value.IsValid != 0)
                                {
                                    DataToValidate.push(value.DiffBatchSNo);
                                }
                                //else if (PreviousID != value.DiffBatchSNo && value.IsValid == 1) {
                                //    DataToPush.push(value.DiffBatchSNo);
                                //}
                                PreviousID = value.DiffBatchSNo
                            });
                            tableString += "</tbody>";
                            $("#tblSSIMpreview").append(tableString);
                            $('#tblSSIMpreview tbody tr').find('td:last').css('white-space', 'normal')
                            $("#Excel").show();
                            //$($("#tblSSIMpreview tbody tr")).each(function (index, value) {
                            //    //if ($(this).find("td")[16].innerHTML.indexOf('does not Exists') || $(this).find("td")[16].innerHTML.indexOf('Already Exists') >= 0) {
                            //    //    flag = false;
                            //    //    return false;
                            //    //}

                            if (DataToValidate.length > 0)
                            {
                                ValidateLots();
                            }
                            //});
                            if (DataToPush.length > 0) {
                                //if ($("#tblSSIMpreview tbody tr").length <= 20) {
                                $("#Submit").show();
                                $('#PreviewNvalidate').hide();
                               // }
                                //else {
                                //    $("input[id='Submit']").css("visibility", "visible");
                                   // $("input[id='Submit1']").css("visibility", "visible");
                               // }
                            }
                        }

                            */
                        else {
                            Reset();
                            ShowMessage('info', 'File Upload!', "Record not found.", "bottom-right");
                        }
                    }
                    else {
                        Reset();
                        ShowMessage('info', 'File Upload!', "Record not found.", "bottom-right");
                    }

                },
                error: function (err) {
                    Reset();
                    ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
                }
            });
    });


});//End of document.Ready

function MakeTable()
{
          if (ResultData.length > 0) {             
              
              var TableID = $("#tblSSIMpreview tbody");
              TableID.find('tr').remove();
              $("#tblSSIMpreview").show();
              //tableString += "<tbody>";
              var PreviousID = 0;
              DataToPush = [];
              DataToValidate = [];
              VCount = 0;
              var TR = "";
              $(ResultData).each(function (index, value) {//result.items

                  var Color = "";
                  
                  Color = value.ValidationMessage == 'VALID' ? 'green' : 'red';

                  TR = "<tr align='center' id='" + "tr" + value.DiffBatchSNo + '_' + value.LegID + "' name = '" + (value.ValidationMessage.length > 0 ? 'FAILED' : 'VALID') + "'><td>" + value.SNo + "</td><td>" + value.AirlineCode + "</td><td>" + value.FlightNo + "</td><td>" + value.BatchNo + "</td><td>" + value.LegID + "</td><td>" + value.FlightType + "</td><td>" + value.StartDate + "</td><td>" + value.EndDate + "</td><td>" + value.DaysNo + "</td><td>" + value.Origin + "</td><td>" + value.ETD + "</td><td>" + value.ETDGMT + "</td><td>" + value.Destination + "</td><td>" + value.ETA + "</td><td>" + value.ETAGMT + "</td><td>" + value.AircraftType + "</td><td>" + value.GrossWeight + "</td><td>" + value.VolumeWeight + "</td><td>" + value.TimeDifference + "</td><td><font color='" + Color + "'>" + value.ValidationMessage + "</font></td><td style='text-align:left; word-wrap:break-word; height:auto;'>" + value.ExistOnDates + "</td></tr>";

                  TableID.append(TR)

                  if (PreviousID != value.DiffBatchSNo && value.IsValid == 0) {
                      VCount = VCount + 1;
                  }
                  else if (PreviousID != value.DiffBatchSNo && value.IsValid != 0) {
                      DataToValidate.push(value.DiffBatchSNo);
                  }
                  PreviousID = value.DiffBatchSNo
              });
              var Processed = parseInt((VCount / TotalBatch) * 100);

              if (Processed <100) {
                  $('#spnMsg').html("Validating Data, Please wait... (" + Processed + "%) Completed.");
              }
              else {
                  setTimeout(function () { ShowMessage('success', 'Information!', "SSIM Validated Successfully. Excel file download for Valid or Failure records"); }, 500);
                  $('#spnMsg').html("");
                  $("#Excel").show();
              }
          
              TableID.find('tr td:last').css('white-space', 'normal')
          }
            
          if (DataToValidate.length > 0) {
              setTimeout(function () { ValidateLots(); },1000);
          }

}

function ValidateLots() {
    VCounter = 0;
    ajaxReqArr = [];
    DataToPush = [];
    var RequestLots = chunkArrayInGroups(DataToValidate, LotsChunk);

    if (RequestLots.length > 0) {
        var Processed = parseInt((VCount / TotalBatch) * 100);
        $('#spnMsg').html('').show().text("Validating Data, Please wait... (" + Processed + "%) Completed.");
        ShowLoader(true);
        RequestValidateRecursion(RequestLots);
    }
}

function RequestValidateRecursion(RequestLots)
{
    if (Counter == 0)
        ValidateIndividuals(RequestLots[Counter])

    $.when.apply(null, ajaxReqArr).done(function () {

        if (ErrorfromDB == true) {
            ShowLoader(false);
            return false;
        }

        var Processed = parseInt((VCount / TotalBatch) * 100);

        if ((Counter + 1) == RequestLots.length) {

            $('#spnMsg').html("");

            ShowLoader(false);

            ShowMessage('success', 'Information!', "SSIM Validated Successfully. Excel file download for Valid or Failure records");
            $("#Excel").show();

            if(DataToPush.length>0)
                $("#Submit").show();

            DataToValidate = [];
            ajaxReqArr = [];
            Counter = 0;
            VCounter = 0;
            VCount = 0;
            TotalBatch = 0;
            ResultData = [];
            
        }
        else {
            $('#spnMsg').html("Validating Data, Please wait... (" + Processed + "%) Completed.");
            //  ShowMessage('success', 'Information!', "Total Request (" + RequestLots.length + ") and Request Processed " + ajaxReqArr.length);
            Counter = Counter + 1;
            if (Counter < RequestLots.length) {
                ValidateIndividuals(RequestLots[Counter])
                RequestValidateRecursion(RequestLots)
            }
        }
    });
}

function ValidateIndividuals(RequestLot)
{
    VCount =VCount+ RequestLot.length;
    var ajaxReq = $.ajax({
        url: "Services/Schedule/SASSSIMUploadService.svc/ValidateSSIM",
        type: "POST",
        dataType: "json",
        global: false,
        data: JSON.stringify({ DiffBatchSNo: RequestLot, IsLastRequest: (VCount == TotalBatch?1:0)}), //RequestLot[j]
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var Data = JSON.parse(result);
            var Table = Data.Table0;
            var Table1 = Data.Table1;
            if (Table1[0].ErrorMessage != '' && Table1[0].ErrorMessage != undefined) {
                ErrorfromDB = true;
                Reset();
                ShowMessage('warning', 'Error!', "Please contact to support team! " + Table1[0].ErrorMessage);
                return false;
            }
            if (Table.length > 0) {
                var PreviousID = 0;
                Table.forEach(function (item, idx) {
                    $('#tblSSIMpreview tr[id^="tr' + item.DiffBatchSNo +'_'+item.LegID+ '"]').find('td:eq(19)').html((item.IsValid == "True" ? "<font color='green'>" + item.ValidationMessage + "</font>" : "<font color='red'>" + item.ValidationMessage + "</font>"));
                    $('#tblSSIMpreview tr[id^="tr' + item.DiffBatchSNo + '_' + item.LegID + '"]').attr('name', (item.IsValid == "True" ? "VAILD" : "FAILED"));
                    $('#tblSSIMpreview tr[id^="tr' + item.DiffBatchSNo + '_' + item.LegID + '"]').find('td:eq(20)').html(item.ExistOnDates);

                    if (VCount <= TotalBatch) {
                        if (PreviousID != parseInt(item.DiffBatchSNo) && item.IsValid == "True") {
                            DataToPush.push(parseInt(item.DiffBatchSNo));
                        }
                        PreviousID = parseInt(item.DiffBatchSNo)
                    }
                });
            }
            
        },
        error: function (ex) {
            ErrorfromDB = true;
            Reset();
            ShowMessage('warning', 'Error!', "Please contact to support team! " + ex.Message);
            return false;
        }
    });

    ajaxReqArr.push(ajaxReq);

}


function ExportToExcel() {
    ExcelDownload();
}
function ExcelDownload() {
    var fileSelect = document.getElementById("Fileupload");
    var files = fileSelect.files;
    var fileName = "";
    //if (files['0'].size > 10240)
    //    alert("Max image size is 10 mb");
    //else {
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }
    var tableStr = "";
    tableStr += "<html><body><table border='1px' margin:0px; padding:0px; cellspacing='0' cellpadding='0'><thead><tr align='center' bgcolor='#daecf4'><td><b>SNo</b></td><td><b>Airline Code</b></td><td><b>Flight No</b></td><td><b>Batch No</b></td><td><b>Leg No</b></td><td><b>Flight Type</b></td><td><b>Start Date</b></td><td><b>End Date</b></td><td><b>Day</b></td><td><b>Origin</b></td><td><b>ETD</b></td><td><b>ETD(GMT)</b></td><td><b>Destination</b></td><td><b>ETA</b></td><td><b>ETA(GMT)</b></td><td><b>Aircraft Type</b></td><td><b>Gross Wt.</b></td><td><b>Volume Wt.</b></td><td><b>Time Difference</b></td><td><b>Validation Message</b></td><td><b>Already Exist Dates</b></td></tr></thead><tbody>";
    $($("#tblSSIMpreview tbody tr")).each(function (index, value) {

        var Color = "";
        Color = $(this).find("td")[19].innerHTML == 'VALID' || $(this).find("td")[19].innerHTML == 'SUCCESS' ? 'green' : 'red';

        tableStr += "<tr align='center' id='" + "tr" + $(this).find("td")[0].innerHTML + "'><td>" + $(this).find("td")[0].innerHTML + "</td><td>" + $(this).find("td")[1].innerHTML + "</td><td>" + $(this).find("td")[2].innerHTML + "</td><td>" + $(this).find("td")[3].innerHTML + "</td><td>" + $(this).find("td")[4].innerHTML + "</td><td>" + $(this).find("td")[5].innerHTML + "</td><td>" + $(this).find("td")[6].innerHTML + "</td><td>" + $(this).find("td")[7].innerHTML + "</td><td>" + $(this).find("td")[8].innerHTML + "</td><td>" + $(this).find("td")[9].innerHTML + "</td><td>" + $(this).find("td")[10].innerHTML + "</td><td>" + $(this).find("td")[11].innerHTML + "</td><td>" + $(this).find("td")[12].innerHTML + "</td><td>" + $(this).find("td")[13].innerHTML + "</td><td>" + $(this).find("td")[14].innerHTML + "</td><td>" + $(this).find("td")[15].innerHTML + "</td><td>" + $(this).find("td")[16].innerHTML + "</td><td>" + $(this).find("td")[17].innerHTML + "</td><td>" + $(this).find("td")[18].innerHTML + "</td><td><font color='" + Color + "'>" + $(this).find("td")[19].innerHTML + "</font></td><td>" + $(this).find("td")[20].innerHTML + "</td></tr>";
    });
    tableStr += "</tbody></table></body></html>";
    //var data_type = 'data:application/vnd.ms-excel';
    ////var postfix = $("lblWarehouseName").text();
    //var a = document.createElement('a');
    //a.href = data_type + ', ' + tableStr;
    //a.download = fileName + '.xls';
    //a.click();

    fileName = fileName.split('.')[0];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '_' + mm + '_' + yyyy;
    var contentType = "application/vnd.ms-excel";
    var byteCharacters = tableStr; //e.format(fullTemplate, e.ctx);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: contentType });
    var blobUrl = URL.createObjectURL(blob);
    //FILEDOWNLOADFIX END
    a = document.createElement("a");
    a.download = fileName+'_SSIM_' + today + '_.xls';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)

}

function Reset() {
    $("#Submit").hide();
    $('#PreviewNvalidate').show();
    $("#Excel").hide();
    $("#spnMsg").hide();
    $('#spnMsg').html('');
    $("#tblSSIMpreview").hide();
    $("#tblSSIMpreview tbody tr").remove();
    $('#SSIMDate').val(kendo.toString(new Date(), 'dd-MMM-yyyy'));
    $('#Fileupload').val('');
    ssimList = [];
    DataToPush = [];
    DataToValidate = [];
    MultiSubmit = false;
    ajaxReqArr = [];
    Counter = 0;
    VCounter = 0;
    VCount = 0;
    TotalBatch = 0;
    ResultData = [];
}

function RequestRecursion(RequestLots)
{
    if (Counter==0)
    Save_SSIMData(RequestLots[Counter]);
    
    $.when.apply(null, ajaxReqArr).done(function () {

        if ((Counter + 1) == RequestLots.length) {

            $('#spnMsg').html("Please wait...(" + parseInt((ajaxReqArr.length / RequestLots.length) * 100) + "%) Completed.");            

            if ($('#tblSSIMpreview tr[id^="tr"][name="Success"]').length > 0)
                CreateSuccessNFailureExcel($('#tblSSIMpreview tr[id^="tr"][name="Success"]'), 'Success');

            if ($('#tblSSIMpreview tr[id^="tr"]').not('[name="Success"]').length > 0)
                CreateSuccessNFailureExcel($('#tblSSIMpreview tr[id^="tr"]').not('[name="Success"]'), 'Failure');
            ShowLoader(false);
            Reset();

            ShowMessage('success', 'Information!', "SSIM Uploaded Successfully. Excel file downloaded for Successs and Failure."); 
        }
        else {
            $('#spnMsg').html("Please wait...(" +parseInt((ajaxReqArr.length / RequestLots.length) *100) + "%) Completed.");
          //  ShowMessage('success', 'Information!', "Total Request (" + RequestLots.length + ") and Request Processed " + ajaxReqArr.length);
            Counter = Counter + 1;
            if (Counter < RequestLots.length) {
                Save_SSIMData(RequestLots[Counter]);
                RequestRecursion(RequestLots);
            }
        }
    });
}

function Save_SSIMData(RequestLot)
{
    //for (var j=0; j < RequestLot.length; j++) {
        var ajaxReq = $.ajax({
            url: "Services/Schedule/SASSSIMUploadService.svc/SaveSSIMData",
            type: "POST",
            dataType: "json",
            global: false,
            data: JSON.stringify({ DiffBatchSNo: RequestLot }), //RequestLot[j]
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (result) {
                var Data =JSON.parse(result);
                var Table = Data.Table0;
                if (Table.length > 0) {
                    Table.forEach(function (item, idx) {
                        var Data = item.Message;
                        $('#tblSSIMpreview tr[id^="tr' + Data.split('-')[1] + '"]').find('td:eq(19)').html(Data.split('-')[2]);
                        $('#tblSSIMpreview tr[id^="tr' + Data.split('-')[1] + '"]').attr('name', Data.split('-')[0]);
                    });
                }
                
            },
            error: function (ex) { }
        });

        ajaxReqArr.push(ajaxReq);
     //  }
    

}

function CreateSuccessNFailureExcel(TR_List, fileName) {
    var htmltbl = "<html><body><table border='1px' margin:0px; padding:0px; cellspacing='0' cellpadding='0'><thead><tr align='center' bgcolor='#daecf4'><td><b>SNo</b></td><td><b>Airline Code</b></td><td><b>Flight No</b></td><td><b>Batch No</b></td><td><b>Leg No</b></td><td><b>Flight Type</b></td><td><b>Start Date</b></td><td><b>End Date</b></td><td><b>Day</b></td><td><b>Origin</b></td><td><b>ETD</b></td><td><b>ETD(GMT)</b></td><td><b>Destination</b></td><td><b>ETA</b></td><td><b>ETA(GMT)</b></td><td><b>Aircraft Type</b></td><td><b>Gross Wt.</b></td><td><b>Volume Wt.</b></td><td><b>Time Difference</b></td><td><b>Validation Message</b></td><td><b>Already Exist Dates</b></td></tr></thead><tbody>";


    $(TR_List).each(function () {
        htmltbl += '<tr>'
        htmltbl += $(this).html();
        htmltbl += '</tr>'
    });


    htmltbl += "</tbody></table></body></html>";
    /*var data_type = 'data:application/vnd.ms-excel';
    var a = document.createElement('a');
    a.href = data_type + ', ' + htmltbl;
    a.download = fileName + '.xls';
    a.click();*/

    fileName = fileName.split('.')[0];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '_' + mm + '_' + yyyy;
    var contentType = "application/vnd.ms-excel";
    var byteCharacters = htmltbl; //e.format(fullTemplate, e.ctx);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: contentType });
    var blobUrl = URL.createObjectURL(blob);
    //FILEDOWNLOADFIX END
    a = document.createElement("a");
    a.download = fileName + '_SSIM_' + today + '_.xls';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)

}

function CreateTableFromArray(array, fileName) {
    var htmltbl = "<table><thead><tr><td>SNo</td><td>Airline Code</td><td>Flight No</td><td>Flight Type</td><td>Start Date</td><td>End Date</td><td>Day</td><td>Origin</td><td>ETD</td><td>Destination</td><td>ETA</td><td>Aircraft Type</td><td>Aircraft SNo</td><td>Gross Wt.</td><td>Volume Wt.</td><td>Time Difference</td><td>Validation Message</td><td>Already Exist Dates</td></tr></thead><tbody>";
    for (var i in array) {
        htmltbl += "<tr>";
        for (var j in array[i])
            htmltbl += "<td>" + array[i][j] + "</td>";
        htmltbl += "</tr>";
    }
    htmltbl += "</tbody><table>";
    var data_type = 'data:application/vnd.ms-excel';
    var a = document.createElement('a');
    a.href = data_type + ', ' + htmltbl;
    a.download = fileName + '.xls';
    a.click();
}

function chunkArrayInGroups(array, unit) {
    var results = [],
    length = Math.ceil(array.length / unit);
    for (var i = 0; i < length; i++) {
        results.push(array.slice(i * unit, (i + 1) * unit));
    }
    return results;
}