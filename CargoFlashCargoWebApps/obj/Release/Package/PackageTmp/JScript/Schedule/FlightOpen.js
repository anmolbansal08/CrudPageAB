$(document).ready(function () {
    $('tr').find('td.formbuttonrow').remove();
    //cfi.AutoComplete("Origin", "AirportCode", "vAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
    //cfi.AutoComplete("Destination", "AirportCode", "vAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");


    cfi.AutoComplete("CarrierCode", "CarrierCode", "viewAirline", "CarrierCode", "CarrierCode", ["CarrierCode"], null, "contains", ",");
    cfi.AutoComplete("AirFlight", "Flightno", "vSchedule", "Flightno", "Flightno", ["Flightno"], null, "contains", ",");
    //cfi.AutoComplete("ForwarderAgent", "CityCode,Name", "vwFORWARDER", "SNo", "Name", ["CityCode", "Name"], null, "contains");
    //$("#spnForwarderAgent").closest('tr').hide();
    $("#__SpanHeader__").css("color", "black");
    $("span.k-delete").live("click", function () {
        if ($("#divMultiAirFlight").find('ul li').length == 2) {
            $("#spnForwarderAgent").closest('tr').show();
        }
        else {
            $("#spnForwarderAgent").closest('tr').hide();
        }
    });

    $("input[id^=EndDate]").change(function (e) {

        if (ValidateDate(this.id) == false && $(this).val() != "") {
            $(this).data("kendoDatePicker").value("");
            return false
        }

        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var StartDate = $(this).attr("id").replace("End", "Start");
        k = $("#" + StartDate).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto) {
            ShowMessage('info', 'Need your Kind Attention!', "End Date should be greater than and equal to Start Date");
            $(this).data("kendoDatePicker").value("");
        }

        //adding validation
        var startDate = $("#StartDate").data("kendoDatePicker").value();

        var endDate = $("#EndDate").data("kendoDatePicker").value();
        var DaysDiff = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);
        if (startDate != null && endDate != null) {
            if (DaysDiff > 3) {
                ShowMessage('info', 'Need your Kind Attention!', "Days should not be greater than 3");

                $("#EndDate").data("kendoDatePicker").value("");
                //$("#StartDate").data("kendoDatePicker").value("");
                return;
            }
        }
        //end
    })
    $("input[id^=StartDate]").change(function (e) {
        if (ValidateDate(this.id) == false && $(this).val() != "") {
            $(this).data("kendoDatePicker").value("");
            return false
        }
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var EndDate = $(this).attr("id").replace("Start", "End");
        k = $("#" + EndDate).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto) {
            ShowMessage('info', 'Need your Kind Attention!', "Start Date should be less than and equal to End Date");
            $(this).data("kendoDatePicker").value("");
        }
        //adding validation
        var startDate = $("#StartDate").data("kendoDatePicker").value();
        var endDate = $("#EndDate").data("kendoDatePicker").value();
        var DaysDiff = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);
        if (startDate != null && endDate != null) {
            if (DaysDiff > 3) {
                ShowMessage('info', 'Need your Kind Attention!', "Days should not be greater than 3");
                $("#StartDate").data("kendoDatePicker").value("");
                return;
            }
        }


        //end
    })


    $(":radio").click(function (event) {
        cfi.ResetAutoComplete("AirFlight");
        cfi.ResetAutoComplete("CarrierCode");
    });

    $('input[type=radio][name=ScheduleType]').click(function () {
        $('span[class="k-icon k-delete"]').click();
    });

    //var SkillDataField = ($('#CarrierCode').val());
    //var SkillDataText = ($('#Text_CarrierCode').val());
    //$('#Text_CarrierCode')[0].defaultValue = '';
    //$('#Text_CarrierCode')[0].Value = '';
    //$('#Text_CarrierCode').val('');
    //$('#Multi_CarrierCode').val(SkillDataField);
    //$('#FieldKeyValuesCarrierCode')[0].innerHTML = SkillDataField;
    //var i = 0;
    //if (SkillDataField.split(',').length > 0) {
    //    while (i < SkillDataField.split(',').length) {
    //        if (SkillDataField.split(',')[i] != '')
    //            $('#divMultiCarrierCode').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SkillDataText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + SkillDataField.split(',')[i] + "'></span></li>");
    //        i++;
    //    }
    //    $("#divMultiCarrierCode").css("display", "block");
    //}


    //var AirFlightField = ($('#AirFlight').val());
    //var AirFlightText = ($('#Text_AirFlight').val());
    //$('#Text_AirFlight')[0].defaultValue = '';
    //$('#Text_AirFlight')[0].Value = '';
    //$('#Text_AirFlight').val('');
    //$('#Multi_AirFlight').val(AirFlightField);
    //$('#FieldKeyValuesAirFlight')[0].innerHTML = AirFlightField;
    //var i = 0;
    //if (AirFlightField.split(',').length > 0) {
    //    while (i < AirFlightField.split(',').length) {
    //        if (AirFlightField.split(',')[i] != '')
    //            $('#divMultiAirFlight').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + AirFlightText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + AirFlightField.split(',')[i] + "'></span></li>");
    //        i++;
    //    }
    //    $("#divMultiAirFlight").css("display", "block");
    //}


    //$('.k-delete').click(function () {
    //    $(this).parent().remove();
    //    if ($("div[id='divMultiCarrierCode']").find("span[name^='FieldKeyValuesCarrierCode']").text().indexOf($(this)[0].id + ",") > -1) {
    //        var CarrierCodeVal = $("div[id='divMultiCarrierCode']").find("span[name^='FieldKeyValuesCarrierCode']").text().replace($(this)[0].id + ",", '');
    //        $("div[id='divMultiCarrierCode']").find("span[name^='FieldKeyValuesCarrierCode']").text(CarrierCodeVal);
    //        $('#CarrierCode').val(CarrierCodeVal);
    //    }
    //    else {
    //        var CarrierCodeValfield = $("div[id='divMultiCarrierCode']").find("span[name^='FieldKeyValuesCarrierCode']").text().replace($(this)[0].id, '');
    //        $("div[id='divMultiCarrierCode']").find("span[name^='FieldKeyValuesCarrierCode']").text(CarrierCodeValfield);
    //        $('#CarrierCode').val(CarrierCodeValfield);
    //    }
    //    $("div[id='divMultiCarrierCode']").find("input:hidden[name^='Multi_CarrierCode']").val($("div[id='divMultiCarrierCode']").find("span[name^='FieldKeyValuesCarrierCode']").text());

    //    $(this).parent().remove();
    //    if ($("div[id='divMultiAirFlight']").find("span[name^='FieldKeyValuesAirFlight']").text().indexOf($(this)[0].id + ",") > -1) {
    //        var AirFlightVal = $("div[id='divMultiAirFlight']").find("span[name^='FieldKeyValuesAirFlight']").text().replace($(this)[0].id + ",", '');
    //        $("div[id='divMultiAirFlight']").find("span[name^='FieldKeyValuesAirFlight']").text(AirFlightVal);
    //        $('#AirFlight').val(AirFlightVal);
    //    }
    //    else {
    //        var AirFlightValfield = $("div[id='divMultiAirFlight']").find("span[name^='FieldKeyValuesAirFlight']").text().replace($(this)[0].id, '');
    //        $("div[id='divMultiAirFlight']").find("span[name^='FieldKeyValuesAirFlight']").text(AirFlightValfield);
    //        $('#AirFlight').val(AirFlightValfield);
    //    }
    //    $("div[id='divMultiAirFlight']").find("input:hidden[name^='Multi_AirFlight']").val($("div[id='divMultiAirFlight']").find("span[name^='FieldKeyValuesAirFlight']").text());
    //});
    //$("input[id^=StartDate]").blur(function (e) {
    //    $("input[id^=StartDate]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
    //});
    //$("input[id^=EndDate]").blur(function (e) {
    //    $("input[id^=EndDate]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
    //});

    window.onbeforeunload = function () {
        $("input[type=button], input[type=submit]").attr("disabled", "disabled");
    };
})

function showForwarderAgent(valueId, value, keyId, key) {
    if ($("#divMultiAirFlight").find('ul li').length == 1) {
        $("#spnForwarderAgent").closest('tr').show();
    }
    else {
        $("#spnForwarderAgent").closest('tr').hide();
    }
    $('#btnGenerate').focus();

}
function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("CarrierCode") >= 0) {
        var typeval = $("input:radio[name='ScheduleType']:checked").val();
        switch(typeval)
        {
            case "0":
                cfi.setFilter(f, "Interline", "eq", typeval);
                break;
            case "1":
                cfi.setFilter(f, "Interline", "eq", typeval);
                break;
            default:
                cfi.setFilter(f, "Interline", "in", ("0,1"));
                break;


        }
        cfi.setFilter(f, "CarrierCode", "notin", $("#CarrierCode").val());

    }
   else if (textId.indexOf("AirFlight") >= 0) {
       cfi.setFilter(f, "CarrierCode", "in", $("#CarrierCode").val());
       cfi.setFilter(f, "FlightNo", "notin", $("#AirFlight").val());
   }
  
    return cfi.autoCompleteFilter([f]);
}
function FlightOpen() {
    // if ($("#Origin").val() == '') { ShowMessage('info', 'Need your Kind Attention!', "Please select origin"); return false; }
    //  else if ($("#Destination").val() == '') { ShowMessage('info', 'Need your Kind Attention!', "Please select Destination"); return false; }
    //else

    $('#btnGenerate').attr("disabled", "disabled");
    $('#btnGenerate').att
    $('#hdnDFCreated').val('');
    $('#hdnDFAlreadyCreated').val('');
    $('#spnCreatedFileMsg').html('');
    $('#spnAlreadyCreatedFileMsg').html('');
    $('#divShowExcelFile').hide();
    if (!cfi.IsValidSubmitSection()) { $('#btnGenerate').removeAttr("disabled"); return false; }
    //if ($("#CarrierCode").val() == '') { ShowMessage('info', 'Need your Kind Attention!', "Please select CarrierCode"); return false; }
    //else if ($("#AirFlight").val() == '') { ShowMessage('info', 'Need your Kind Attention!', "Please select Flight No."); return false; }
    $("#divShowExcelFile").css("display", "none");
    $("#divShowCreatedFile").css("display", "none");
    if ($("#StartDate").val() == '') { ShowMessage('info', 'Need your Kind Attention!', "Please Enter StartDate"); return false; }
    else if ($("#EndDate").val() == '') { ShowMessage('info', 'Need your Kind Attention!', "Please Enter EndDate"); return false; }
    else
    {
        if (cfi.IsValidSubmitSection()) {
            $.ajax({
                url: "Services/Schedule/FlightOpen.svc/OpenFlight",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    origin: '',
                    destination: '',
                    SD: $("#StartDate").val(),
                    ED: $("#EndDate").val(),
                    Airline: $("#AirFlight").val(),
                    CarrierCode: $("#CarrierCode").val(),
                    ScheduleType: $("input:radio[name='ScheduleType']:checked").val(),
                    createdBy: 1,//$("#hdncreatedBy").val(),


                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    if (result.substring(1, 2) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData[0].Create.length > 0 && myData[0].Created.length > 0) {
                            $('#hdnDFCreated').val(myData[0].Create);
                            $('#hdnDFAlreadyCreated').val(myData[0].Created);
                            $("#divShowCreatedFile").css("display", "block");
                            $('#spnCreatedFileMsg').html('<strong>Total open flight is ' + myData[0].Create.split(',').length + '</strong>')
                            $('#spnAlreadyCreatedFileMsg').html('<strong>Already total opened flight is ' + myData[0].Created.split(',').length + '</strong>')
                            ShowMessage('success', 'Success!', "Opened Flight Successfully and Already Opened For Some Days");
                            $("#divShowCurrentExcelFile").css("display", "block");
                            $("#divShowExcelFile").css("display", "block");
                            //createFlightOpenTable();
                            // createFlightAlreadyOpenTable();
                            // window.open('data:application/vnd.ms-excel,' + $('#FlightAlreadyOpen').html());
                            //clearAutoComplete();
                        }
                        else if (myData[0].Create.length > 0) {
                            $('#hdnDFCreated').val(myData[0].Create);
                            ShowMessage('success', 'Success!', "Opened Flight Successfully.");
                            $("#divShowExcelFile").css("display", "block");
                            $("#divShowCreatedFile").css("display", "block");
                            $('#spnCreatedFileMsg').html('<strong>Total open flight is ' + myData[0].Create.split(',').length + '</strong>')
                            // createFlightOpenTable();
                        }
                        else if (myData[0].Created.length > 0) {
                            $('#hdnDFAlreadyCreated').val(myData[0].Created);
                            ShowMessage('success', 'Success!', "Flight Already Opened.");//Kindly select Carrier Code and Flight No
                            $("#divShowExcelFile").css("display", "block");
                            $("#divShowCreatedFile").css("display", "block");
                            $('#spnAlreadyCreatedFileMsg').html('<strong>Already total opened flight is ' + myData[0].Created.split(',').length + '</strong>')
                            //  createFlightAlreadyOpenTable();
                            //  window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#tblFlightAlreadyOpen').html()));
                            //  
                        }
                        else {
                            ShowMessage('info', 'Need your Kind Attention!', 'Valid flight schedule not found for the selected period.');
                        }

                    }

                    return false
                },
                error: function (xhr) {
                    var a = "";
                }
            });
        }
        else
            return false;
    }
    $('#btnGenerate').removeAttr("disabled");
}

function createFlightOpenTable() {
    $('#tblFlightOpen').html('');
    var dbTableName = 'FlightOpen';
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tblFlightOpen').appendGrid({
        tableID: 'tblFlightOpen',
        contentEditable: pageType != 'VIEW',
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 5, whereCondition: $('#hdnDFCreated').val(), sort: '',
        servicePath: './Services/Schedule/FlightOpen.svc',
        getRecordServiceMethod: 'GetFlightCreatedRecord',
        createUpdateServiceMethod: '',
        isGetRecord: true,
        deleteServiceMethod: '',
        caption: 'Flight Details',
        initRows: 1,
        // column for edit
        columns: [
                { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'ETD', display: 'ETD', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'ETA', display: 'ETA', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'Destination', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'AirCraftSNo', display: 'Aircraft Type', type: 'label', ctrlCss: { width: '40px' }, isRequired: false }
        ],

        isPaging: true,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true

        }
    });


}


function DownloadCurrentExcel() {
    $.ajax({
        url: "Services/Schedule/FlightOpen.svc/DownloadExcelFile",
        async: false,
        type: "GET",
        dataType: "json",
        //data: {
        //    SNo: $('#hdnDFCreated').val()
        //},
        data: JSON.stringify({ SNo: $('#hdnDFCreated').val().split(',') }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(result);
                var str = "<table><tr><td>Flight No</td><td>Flight Date</td><td>ETD</td><td>ETA</td><td>Origin</td><td>Destination</td><td>AirCraft</td><td>OverBookingCapacity</td><td>FreeSaleCapacity</td><td>OverBookingCapacityVOL</td><td>FreeSaleCapacityVOL</td><td>UMG</td><td>UMV</td></tr>";
                for (var i = 0; i < myData.length; i++) {
                    str += "<tr>";
                    str += "<td>" + myData[i].flightNo + "</td>";
                    str += "<td>" + myData[i].FlightDate + "</td>";
                    str += "<td>" + myData[i].ETD + "</td>";
                    str += "<td>" + myData[i].ETA + "</td>";
                    str += "<td>" + myData[i].OriginAirportcode + "</td>";
                    str += "<td>" + myData[i].Destinationairportcode + "</td>";
                    str += "<td>" + myData[i].AirCraftSNo + "</td>";
                    str += "<td  align='center' >" + myData[i].OverBookingCapacity + "</td>";
                    str += "<td  align='center' >" + myData[i].FreeSaleCapacity + "</td>";

                    str += "<td  align='center' >" + myData[i].OverBookingCapacityVolume + "</td>";
                    str += "<td  align='center' >" + myData[i].FreeSaleCapacityVolume + "</td>";
                    str += "<td  align='center' >" + myData[i].UMG + "</td>";
                    str += "<td  align='center' >" + myData[i].UMV + "</td>";
                    str += "</tr>";
                }
                str += "</table>";


                var dt = new Date();
                var day = dt.getDate();
                var month = dt.getMonth() + 1;
                var year = dt.getFullYear();
                var hour = dt.getHours();
                var mins = dt.getMinutes();
                var postfix = $("#StartDate").val() + '_' + $("#EndDate").val();
                var a = document.createElement('a');
                var data_type = 'data:application/vnd.ms-excel';
                var table_div = str;
                var table_html = table_div.replace(/ /g, '%20');
                a.href = data_type + ', ' + table_html;
                a.download = 'Flight_Open_' + postfix + '_.xls';
                a.click();
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });

}

function DownloadExcel() {

    $.ajax({
        url: "Services/Schedule/FlightOpen.svc/DownloadExcelFile",
        async: false,
        type: "POST",
        dataType: "json",
        //data: { SNo: ($("#hdnDFAlreadyCreated").val() + ',' + $('#hdnDFCreated').val()).split(',') },
        data: JSON.stringify({ SNo: ($("#hdnDFAlreadyCreated").val() + ',' + $('#hdnDFCreated').val()).split(',') }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(result);
                var str = "<table><tr><td>Flight No</td><td>Flight Date</td><td>ETD</td><td>ETA</td><td>Origin</td><td>Destination</td><td>AirCraft</td><td>OverBookingCapacity</td><td>FreeSaleCapacity</td><td>OverBookingCapacityVOL</td><td>FreeSaleCapacityVOL</td><td>UMG</td><td>UMV</td></tr>";
                for (var i = 0; i < myData.length; i++) {
                    str += "<tr>";
                    str += "<td>" + myData[i].flightNo + "</td>";
                    str += "<td>" + myData[i].FlightDate + "</td>";
                    str += "<td>" + myData[i].ETD + "</td>";
                    str += "<td>" + myData[i].ETA + "</td>";
                    str += "<td>" + myData[i].OriginAirportcode + "</td>";
                    str += "<td>" + myData[i].Destinationairportcode + "</td>";
                    str += "<td>" + myData[i].AirCraftSNo + "</td>";
                    str += "<td  align='center' >" + myData[i].OverBookingCapacity + "</td>";
                    str += "<td  align='center' >" + myData[i].FreeSaleCapacity + "</td>";
                    str += "<td  align='center' >" + myData[i].OverBookingCapacityVolume + "</td>";
                    str += "<td  align='center' >" + myData[i].FreeSaleCapacityVolume + "</td>";
                    str += "<td  align='center' >" + myData[i].UMG + "</td>";
                    str += "<td  align='center' >" + myData[i].UMV + "</td>";
                    str += "</tr>";
                }
                str += "</table>";
                // window.open('data:application/vnd.ms-excel,' + encodeURIComponent(str));
                //var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
                //windowAttr += ",width=" + 900 + ",height=" + 600;
                //windowAttr += ",resizable=yes,screenX=" + 200 + ",screenY=" + 200 + ",personalbar=no,scrollbars=yes";
                //  window.open('data:application/vnd.ms-excel,' + encodeURIComponent(str));

                //var newWin = window.open("", "_blank", windowAttr);
                //newWin.document.open();
                //newWin.document.write(str);
                //newWin.document.close();

                var dt = new Date();
                var day = dt.getDate();
                var month = dt.getMonth() + 1;
                var year = dt.getFullYear();
                var hour = dt.getHours();
                var mins = dt.getMinutes();
                var postfix = $("#StartDate").val() + '_' + $("#EndDate").val();
                var a = document.createElement('a');
                var data_type = 'data:application/vnd.ms-excel';
                var table_div = str;
                var table_html = table_div.replace(/ /g, '%20');
                a.href = data_type + ', ' + table_html;
                a.download = 'Flight_Open_' + postfix + '_.xls';
                a.click();
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });

}

function Export(htmltable) {
    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += "<head>";
    excelFile += '<meta http-equiv="Content-type" content="text/html;charset=utf-8" />';
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "{worksheet}";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += htmltable.replace(/"/g, '\'');
    excelFile += "</body>";
    excelFile += "</html>";

    var uri = "data:application/vnd.ms-excel;base64,";
    var ctx = { worksheet: 'Open Flight', table: htmltable };

    return (uri + base64(format(excelFile, ctx)));
}

function base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
}

function format(s, c) {
    return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; });
}

function createFlightAlreadyOpenTable() {
    var dbTableName = 'FlightAlreadyOpen';
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tblFlightAlreadyOpen').appendGrid({
        tableID: 'tblFlightAlreadyOpen',
        contentEditable: pageType != 'VIEW',
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 2000, whereCondition: $('#hdnDFAlreadyCreated').val(), sort: '',
        servicePath: './Services/Schedule/FlightOpen.svc',
        getRecordServiceMethod: 'GetFlightAlreadyOpenedRecord',
        createUpdateServiceMethod: 'GetFlightAlreadyOpenedRecord',
        isGetRecord: true,
        deleteServiceMethod: 'delete',
        caption: 'Flight Details',
        initRows: 1,
        // column for edit
        columns: [
                { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'ETD', display: 'ETD', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'ETA', display: 'ETA', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'Destination', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'AirCraftSNo', display: 'Aircraft Type', type: 'label', ctrlCss: { width: '40px' }, isRequired: false }
        ],

        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true

        }
    });


}

function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(new Date(start));
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(new Date(start));
        });
    }
}

function AutoCompleteDeleteCallBack(e, div, textboxid) {
    if (textboxid == "Text_CarrierCode" && div == "divMultiCarrierCode") {
        var target = e.target; // get current Span.
        var DivId = div; // get div id.
        var textboxid = textboxid; // get textbox id.
        var mid = textboxid.replace('Text', 'Multi');

        var arr = $("#" + mid).val().split(',');
        var idx = arr.indexOf($(this)[0].id);
        arr.splice(idx, $(e.target).attr("id"));
        var idx = arr.indexOf($(e.target).attr("id"));
        arr.splice(idx, 1);
        $("#" + mid).val(arr);
        $("#" + textboxid.replace('Text_', '')).val(arr);

        if (arr.length == 0 && $('#divMultiAirFlight span[class="k-icon k-delete"]').length>0)
        {
           // ShowMessage('warning', 'Warning!', "Please fill the carrier code first");
            $('#divMultiAirFlight span[class="k-icon k-delete"]').click();
        }
    }
}


function ValidateDate(obj) {
    var dtValue = $('#' + obj).val();
    var dtRegex = new RegExp("^([0]?[1-9]|[1-2]\\d|3[0-1])-(JAN|FEB|MAR|APR|MAY|JUN|JULY|AUG|SEP|OCT|NOV|DEC)-[1-2]\\d{3}$", 'i');
    return dtRegex.test(dtValue);
}
/////////////////////////   Function added to get flight capacity added by Vikram singh 30/12/2016   ////////////////////
//function getFlightnumber() {

//    debugger;
//    var flightno = $('#Text_CarrierCode').val();

//    //var flightnumber = $('#Text_AirFlight').val();
//    //var flightnum = flightno+"-"+flightnumber;
//    // GetopenFlightCapacity(flightnum);
//    GetopenFlightCapacity(flightno);


//}

//function GetopenFlightCapacity(value) {
//    $.ajax({
//        url: "Services/Schedule/FlightOpen.svc/FlightCapacity",
//        async: false,
//        type: "GET",
//        dataType: "json",
//        data: {
//            str: value
//        },
//        contentType: "application/json; charset=utf-8", cache: false,
//        success: function (result) {
//            if (result.substring(1, 2) == "{") {
//                var myData = jQuery.parseJSON(result);
//                $('#OverBookingCapacity').val(myData[0].OverBookingCapacity) ;
//                $('#FreeSaleCapacity').val(myData[0].FreeSaleCapacity) ;
//                $('#_tempOverBookingCapacity').val(myData[0].OverBookingCapacity) ;
//                $('#_tempFreeSaleCapacity').val(myData[0].FreeSaleCapacity);
//            }
//            return false
//        },
//        error: function (xhr) {
//            var a = "";
//        }
//    });
//}

/////////////////////////   Function added to get flight capacity added by Vikram singh 30/12/2016   ////////////////////