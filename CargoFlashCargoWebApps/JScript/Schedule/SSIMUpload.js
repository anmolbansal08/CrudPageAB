/// <reference path="../../Services/Schedule/SSIMUploadService.svc" />
/// <reference path="../../Services/Schedule/SSIMUploadService.svc" />
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    $("input[id='Submit']").css("visibility", "hidden");
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
    $("input[id='Submit']").click(function (e) {
        var ssimList = [];
        $("#tblSSIMpreview tbody tr").each(function (index, element) {

            ssimList.push({
                CarrierCode: $(this).find("td")[1].innerHTML,
                FlightNo: $(this).find("td")[2].innerHTML,
                ValidFrom: $(this).find("td")[3].innerHTML,
                ValidTo: $(this).find("td")[4].innerHTML,
                Days: $(this).find("td")[5].innerHTML,
                Origin: $(this).find("td")[6].innerHTML,
                ETD: $(this).find("td")[7].innerHTML,
                Destination: $(this).find("td")[8].innerHTML,
                OriginAirportCode: $(this).find("td")[9].innerHTML,
                DestinationAirportCode: $(this).find("td")[10].innerHTML
            });

        });
        $.ajax({
            url: "Services/Schedule/SSIMUploadService.svc/SaveSSIMUpload",
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ ssimUpload: ssimList }),
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (result) {
                if (result.length != 0) {
                    if (result[0].indexOf("SSIM Added Successfully") >= 0) {
                        navigateUrl('Default.cshtml?Module=Schedule&Apps=SSIMUpload&FormAction=NEW');
                    }
                    else {
                        alert(result[0]);
                        return false;
                    }
                }
            },
            error: function (error) {
                debugger;
            }
        });
    });

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
        var tableString;
        var flag = true;
        $.ajax({
            url: "Handler/SSIMUpload.ashx",
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
                        $("#tblSSIMpreview").append("<thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>SNo</td><td class='ui-widget-header'>Carrier Code</td><td class='ui-widget-header'>Fligh tNo</td><td class='ui-widget-header'>Valid From</td><td class='ui-widget-header'>Valid To</td><td class='ui-widget-header'>Days</td><td class='ui-widget-header'>Origin</td><td class='ui-widget-header'>ETD</td><td class='ui-widget-header'>Destination</td><td class='ui-widget-header'>Origin Airport Code</td><td class='ui-widget-header'>Destination Airport Code</td><td class='ui-widget-header'>Validation Messsage</td></tr></thead>");
                        tableString += "<tbody>";
                        $(result.items).each(function (index, value) {
                            tableString += "<tr align='center' id='" + "tr" + value.SNo + "'><td>" + value.SNo + "</td><td>" + value.AirlineCode + "</td><td>" + value.FlightNo + "</td><td>" + value.ValidFrom + "</td><td>" + value.ValidTo + "</td><td>" + value.Days + "</td><td>" + value.Origin + "</td><td>" + value.ETD + "</td><td>" + value.Destination + "</td><td>" + value.OriginAirportCode + "</td><td>" + value.DestinationAirportCode + "</td><td>" + value.ValidationMessage + "</td></tr>";
                        });
                        tableString += "</tbody>";
                        $("#tblSSIMpreview").append(tableString);

                        $($("#tblSSIMpreview tbody tr")).each(function (index, value) {

                            if ($(this).find("td")[11].innerHTML.indexOf('does not Exists') >= 0) {
                                flag = false;
                                return false;
                            }

                        });
                        if ($("#tblSSIMpreview tbody tr").length > 1 && flag == true)
                            $("input[id='Submit']").css("visibility", "visible");
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
    });


});