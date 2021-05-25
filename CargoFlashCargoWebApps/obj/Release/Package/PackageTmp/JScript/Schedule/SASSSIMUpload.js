    /// <reference path="../../Services/Schedule/SSIMUploadService.svc" />
/// <reference path="../../Services/Schedule/SSIMUploadService.svc" />

//////saddf
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    $("input[id='Submit']").css("visibility", "hidden");
    $("input[id='Submit1']").css("visibility", "hidden");
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

    $("#__SpanHeader__").css("color", "black");
    $("#Submit1,#Submit").click(function (e) {
        //ExcelDownload();
        $("#Excel").hide();
        var ssimList = [];
        var Counter = 0;
        $("#tblSSIMpreview tbody tr").each(function (index, element) {
            if ($(this).find("td")[18].innerHTML.indexOf('does not Exists') >= 0 || $(this).find("td")[18].innerHTML.indexOf('Already Exists') >= 0)
                return;

            ssimList.push({
                AirlineCode: $(this).find("td")[1].innerHTML,
                FlightNo: $(this).find("td")[2].innerHTML,
                FlightType: $(this).find("td")[3].innerHTML,
                StartDate: $(this).find("td")[4].innerHTML,
                EndDate: $(this).find("td")[5].innerHTML,
                //ValidFrom: $(this).find("td")[6].innerHTML,
                //ValidTo: $(this).find("td")[7].innerHTML,
                // DaysNo: $(this).find("td")[8].innerHTML,
                Days: $(this).find("td")[6].innerHTML,
                Origin: $(this).find("td")[7].innerHTML,
                ETD: $(this).find("td")[8].innerHTML,
                ETDGMT: $(this).find("td")[9].innerHTML,
                Destination: $(this).find("td")[10].innerHTML,
                ETA: $(this).find("td")[11].innerHTML,
                ETAGMT: $(this).find("td")[12].innerHTML,
                AircraftType: $(this).find("td")[13].innerHTML,
                AircraftTypeSNo: $(this).find("td")[14].innerHTML,
                GrossWeight: $(this).find("td")[15].innerHTML,
                VolumeWeight: $(this).find("td")[16].innerHTML,
                TimeDifference: $(this).find("td")[17].innerHTML
            });

        });
        var arrayOfSuccess = [];
        var arrayOfFailure = [];
        var results = chunkArrayInGroups(ssimList, 200);
        for (var i = 0; i < results.length; i++) {
            $.ajax({
                url: "Services/Schedule/SASSSIMUploadService.svc/SaveSSIMUpload",
                async: false,
                type: "POST",
                dataType: "json",
                data: JSON.stringify({ ssimUpload: results[i] }),
                contentType: "application/json; charset=utf-8",
                cache: false,
                success: function (result) {
                    if (result.length != 0) {
                        if (result[0].indexOf("SSIM Added Successfully") >= 0) {
                            arrayOfSuccess.push.apply(arrayOfSuccess,results[i]);
                            
                        }
                        else {
                            arrayOfFailure.push.apply(arrayOfFailure, results[i]);                            
                                alert(result[0]);
                                $("#spnMsg").text(result[0]);
                                // e.preventDefault();
                            
                        }
                    }
                },
                error: function (error) {
                    debugger;
                }
                
            });

        }
        if (arrayOfSuccess.length > 0) {
            CreateTableFromArray(arrayOfSuccess, "Success");
            CreateTableFromArray(arrayOfFailure, "Failure");
            alert("SSIM Uploaded Successfully, Excel file downloaded for Successs and Failure.");
            $("#spnMsg").text("SSIM Uploaded Successfully, Excel file downloaded for Successs and Failure.");
            navigateUrl('Default.cshtml?Module=Schedule&Apps=SASSSIMUpload&FormAction=NEW');
        }
        
        
        
    });
    function CreateTableFromArray(array, fileName) {
        var htmltbl = "<table><thead><tr><td>SNo</td><td>Airline Code</td><td>Flight No</td><td>Flight Type</td><td>Start Date</td><td>End Date</td><td>Day</td><td>Origin</td><td>ETD</td><td>Destination</td><td>ETA</td><td>Aircraft Type</td><td>Aircraft SNo</td><td>Gross Wt.</td><td>Volume Wt.</td><td>Time Difference</td><td>Validation Message</td></tr></thead><tbody>";
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

    $("input[name='PreviewNvalidate']").click(function (e) {
        $("#tblSSIMpreview").find("tbody tr").remove();
        $("#tblSSIMpreview").find("thead tr").remove();
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
            alert("Choose File To Upload.");
            return false;
        }
        var tableString;
        var flag = true;
        $.ajax({
            url: "Handler/SSIMUpload.ashx?SASSSIMUpload=Yes",
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result.items.length > 0) {
                    if (result.items[0].Error != undefined) {
                        $("input[id='Submit']").css("visibility", "hidden");
                        alert("File is not valid, only text file allowed.");
                    }
                    else {
                        $("#tblSSIMpreview").append("<thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>SNo</td><td class='ui-widget-header'>Carrier Code</td><td class='ui-widget-header'>Flight No</td><td class='ui-widget-header'>Flight Type</td><td class='ui-widget-header'>Start Date</td><td class='ui-widget-header'>End Date</td><td class='ui-widget-header'>Day</td><td class='ui-widget-header'>Origin</td><td class='ui-widget-header'>ETD</td><td class='ui-widget-header'>ETD (GMT)</td><td class='ui-widget-header'>Destination</td><td class='ui-widget-header'>ETA</td><td class='ui-widget-header'>ETA (GMT)</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Aircraft SNo</td><td class='ui-widget-header'>Gross Wt.</td><td class='ui-widget-header'>Volume Wt.</td><td class='ui-widget-header'>Time Difference</td><td class='ui-widget-header'>Validation Message</td></tr></thead>");
                        tableString += "<tbody>";
                        $(result.items).each(function (index, value) {
                            tableString += "<tr align='center' id='" + "tr" + value.SNo + "'><td>" + value.SNo + "</td><td>" + value.AirlineCode + "</td><td>" + value.FlightNo + "</td><td>" + value.FlightType + "</td><td>" + value.StartDate + "</td><td>" + value.EndDate + "</td><td>" + value.DaysNo + "</td><td>" + value.Origin + "</td><td>" + value.ETD + "</td><td>" + value.ETDGMT + "</td><td>" + value.Destination + "</td><td>" + value.ETA + "</td><td>" + value.ETAGMT + "</td><td>" + value.AircraftType + "</td><td>" + value.AircraftSNo + "</td><td>" + value.GrossWeight + "</td><td>" + value.VolumeWeight + "</td><td>" + value.TimeDifference + "</td><td>" + value.ValidationMessage + "</td></tr>";
                        });
                        tableString += "</tbody>";
                        $("#tblSSIMpreview").append(tableString);

                        //$($("#tblSSIMpreview tbody tr")).each(function (index, value) {

                        //    //if ($(this).find("td")[16].innerHTML.indexOf('does not Exists') || $(this).find("td")[16].innerHTML.indexOf('Already Exists') >= 0) {
                        //    //    flag = false;
                        //    //    return false;
                        //    //}

                        //});
                        if ($("#tblSSIMpreview tbody tr").length <= 20) {

                            $("input[id='Submit']").css("visibility", "visible");
                        }
                        else {
                            $("input[id='Submit']").css("visibility", "visible");
                            $("input[id='Submit1']").css("visibility", "visible");
                        }



                    }

                }
                else {
                    alert("Record not found.");
                }

            },
            error: function (err) {
                ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            }
        });
        $("#Excel").remove();
        $("<input type='button' tabindex='2' class='button' name='Excel' id='Excel' style='width:120px;' value='Export To Excel' onclick='ExportToExcel();'>").insertAfter("[id='PreviewNvalidate']");
    });

});//End of document.Ready
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
    tableStr += "<table><thead><tr><td>SNo</td><td>Airline Code</td><td>Flight No</td><td>Flight Type</td><td>Start Date</td><td>End Date</td><td>Day</td><td>Origin</td><td>ETD</td><td>Destination</td><td>ETA</td><td>Aircraft Type</td><td>Aircraft SNo</td><td>Gross Wt.</td><td>Volume Wt.</td><td>Time Difference</td><td>Validation Message</td></tr></thead><tbody>";
    $($("#tblSSIMpreview tbody tr")).each(function (index, value) {
        tableStr += "<tr align='center' id='" + "tr" + $(this).find("td")[0].innerHTML + "'><td>" + $(this).find("td")[0].innerHTML + "</td><td>" + $(this).find("td")[1].innerHTML + "</td><td>" + $(this).find("td")[2].innerHTML + "</td><td>" + $(this).find("td")[3].innerHTML + "</td><td>" + $(this).find("td")[4].innerHTML + "</td><td>" + $(this).find("td")[5].innerHTML + "</td><td>" + $(this).find("td")[6].innerHTML + "</td><td>" + $(this).find("td")[7].innerHTML + "</td><td>" + $(this).find("td")[8].innerHTML + "</td><td>" + $(this).find("td")[9].innerHTML + "</td><td>" + $(this).find("td")[10].innerHTML + "</td><td>" + $(this).find("td")[11].innerHTML + "</td><td>" + $(this).find("td")[12].innerHTML + "</td><td>" + $(this).find("td")[13].innerHTML + "</td><td>" + $(this).find("td")[14].innerHTML + "</td><td>" + $(this).find("td")[15].innerHTML + "</td><td>" + $(this).find("td")[16].innerHTML + "</td></tr>";
    });
    tableStr += "</tbody></table>";
    var data_type = 'data:application/vnd.ms-excel';
    //var postfix = $("lblWarehouseName").text();
    var a = document.createElement('a');
    a.href = data_type + ', ' + tableStr;
    a.download = fileName + '.xls';
    a.click();
}