$(document).ready(function () {
    cfi.ValidateForm();
    $('tr').find('td.formbuttonrow').remove();
    cfi.AutoComplete("FlightSNo", "SNo,FlightNo", "vwDailyFlight", "SNo", "FlightNo", null, null, "contains");
    cfi.AutoComplete("FSNo", "SNo,FName", "FlightTransferFilter", "SNo", "FName", null, FlightTransferGrid, "contains");
    $('#tblFlightTransfer1').hide();
    $('#tblFilter').hide();

    $('#SearchFlight').click(function () {
        $.ajax({
            url: "Services/Shipment/FlightTransferService.svc/GetFlight",
            async: false,
            type: "GET",
            dataType: "json",
            data: { FlightNo: $('#Text_FlightSNo').val(), FlightDate: $('#FlightDateSearch').attr("sqldatevalue") },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                $('#FlightSearchValue').val(result.toString());
                createFlightSearchTable(result.toString());
            },
            error: function (xhr) {
                var a = "";
            }
        });
        
        $('#tblFlightTransfer1').hide();
        $('#tblFilter').hide();
    });


    $("#divFlightSummary").dialog({
        width: '800px',
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        closeOnEscape: true,
        open: function (event, ui) {
            $('#divFlightSummary').show();
            // for multi grid
            if (!isEmpty(settings)) tableSetting = settings;
            createFlightSummaryTable();
        },
        close: function (event, ui) {
            $('#divFlightSummary').hide();
            // for multi grid
            if (!isEmpty(settings)) settings = tableSetting;
        }
    });
})


function BTranFlight(evt, rowIndex) {
    $('#tblFlightTransfer1').show();
    $('#tblFilter').show();
    $("#hdnDFSNo").val($('#tblFlightSearch_DFSNo_' + (rowIndex + 1)).val());
    FlightTransferGrid();
}



function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("FlightNo") >= 0) {
        cfi.setFilter(f, "FlightDate", "eq", $("#" + textId.replace("FlightNo", "FlightDate")).attr("sqldatevalue"));
        cfi.setFilter(f, "OriginAirportSNo", "eq", $("#" + textId.replace("FlightNo", "OASNO")).val());
        cfi.setFilter(f, "DestinationAirportSNo", "eq", $("#" + textId.replace("FlightNo", "DASNo")).val());
        cfi.setFilter(f, "SNo", "neq", $('#hdnFlightSno').val());
        if ($("#sameflight").is(':checked')) {
            if ($('#hdnSameFlightSNo').val() != '')
                cfi.setFilter(f, "SNo", "eq", $('#hdnSameFlightSNo').val());
        }
    }
    return cfi.autoCompleteFilter([f]);
}
//valueId, value, keyId, key
function BindGridData1() {
    FlightTransferGrid();
    //hidegridbutton();
}

function BindSameDropDownList()
{

    if (!$("#sameflight").is(':checked')) {
        $('#hdnSameFlightSNo').val('');
    }
}

function findavlSpace(evt, RowIndex) {
    alert('Hi Value');
}
function FlightTransferGrid() {
    var dbTableName = 'FlightTransfer1';
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        masterTableSNo: $('#hdnDFSNo').val(),
        currentPage: 1, itemsPerPage: 100, whereCondition: null, sort: $('#FilterSort').find('option:selected').val(),
        servicePath: './Services/Shipment/FlightTransferService.svc',
        getRecordServiceMethod: 'GetFlightTransfer1Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Flight Transfer',
        initRows: 1,
        isGetRecord: true,
        columns: [
            {
                name: 'FCheck', display: '', type: 'checkbox', ctrlCss: { width: '18px' }, onClick: function (evt, rowIndex) {

                    if ($("#tblFlightTransfer1_FCheck_" + (rowIndex + 1)).is(':checked')) {
                        $('#tblFlightTransfer1_FlightDate_' + (rowIndex + 1)).attr('required', 'required');
                        $('#tblFlightTransfer1_FlightNo_' + (rowIndex + 1)).attr('required', 'required');

                    }
                    else {
                        $('#tblFlightTransfer1_FlightDate_' + (rowIndex + 1)).removeAttr('required');
                        $('#tblFlightTransfer1_FlightNo_' + (rowIndex + 1)).removeAttr('required');

                    }
                }
            },
            { name: 'FlightSNo', type: 'hidden' },
            { name: 'OASNO', type: 'hidden' },
            { name: 'DASNo', type: 'hidden' },
            { name: 'AWBNo', display: 'AWBNo', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
            { name: 'AcceptTime', display: 'A Time', type: 'label', ctrlCss: { width: '55px' }, isRequired: false },
            { name: 'TotalPic', display: 'TP/PP', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },

            { name: 'TotGrWt', display: 'TG/PG (Wt)', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
            { name: 'TotVolWt', display: 'TV/PV (Wt)', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
            { name: 'AWBStatus', display: 'Status', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
            { name: 'AWBOrigin', display: 'Origin', type: 'label', ctrlCss: { width: '50px' } },
            { name: 'AWBDest', display: 'Dest', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
            { name: 'NatureGood', display: 'NOG', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'Yield', display: 'Yield', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            {
                name: 'FlightDate', display: 'Flight Date', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype' }, onChange: function (evt, rowIndex) {
                    cfi.ResetAutoComplete('tblFlightTransfer1_FlightNo_' + (rowIndex + 1));
                    $('#tblFlightTransfer1_HdnFlightNo_' + (rowIndex + 1)).val('');
                }
            },
            {
                name: 'FlightNo', display: 'FlightNo', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '90px', height: '20px' }, onChange: handleChange, onblur: function (evt, rowIndex) { alert('brt'); }, isRequired: false, tableName: 'DailyFlight', textColumn: 'FlightNo', keyColumn: 'SNo'
            },
            {
                name: 'ADD', display: '', type: 'button', ctrlCss: { width: '40px', height: '20px' }, onClick: function (evt, rowIndex) {
                    if ($("#sameflight").is(':checked') && $('#hdnSameFlightSNo').val() == '') {
                            $('#hdnSameFlightSNo').val($('#tblFlightTransfer1_HdnFlightNo_' + (rowIndex + 1)).val());
                    }

                    if (!$('#tblFlightTransfer1_FCheck_' + (rowIndex + 1)).attr('checked')) {
                        ShowMessage('error', 'Need your Kind Attention!', 'Please select checkbox.');
                    }
                    else if ($('#tblFlightTransfer1_FlightNo_' + (rowIndex + 1)).val() == "") {
                        ShowMessage('error', 'Need your Kind Attention!', 'Please select Flight No.');
                    }
                    else if ($('#tblFlightTransfer1_FlightDate_' + (rowIndex + 1)).val() == "") {
                        ShowMessage('error', 'Need your Kind Attention!', 'Please select Flight Date.');
                    }
                    else {
                        $('#tblFlightTransfer1_ADDSpam_' + (rowIndex + 1)).text('');
                        $('#tblFlightTransfer1_ADDSpam_' + (rowIndex + 1)).append('<a href="#">' + $("#tblFlightTransfer1_FlightNo_" + (rowIndex + 1)).val() + '</a>');
                        $('#tblFlightTransfer1_ADDSpam_' + (rowIndex + 1))
                        $('#tblFlightTransfer1_FCheck_' + (rowIndex + 1)).attr("disabled", true);
                        $("#sameflight").attr("disabled", true);
                        $('#tblFlightTransfer1_FlightNo_' + (rowIndex + 1)).attr({ disabled: true });
                        $('#tblFlightTransfer1_FlightDate_' + (rowIndex + 1)).attr({ disabled: true });
                        $('#tblFlightTransfer1_FlightDate_' + (rowIndex + 1)).attr("disabled", true).closest("span").find("span.k-icon").hide();
                        $('#tblFlightTransfer1_FlightNo_' + (rowIndex + 1)).attr("disabled", true).closest("span").find("span.k-icon").hide();
                       // $('#tblFlightTransfer1_FlightNo_' + (rowIndex + 1)).addClass("ui-autocomplete-disabled ui-state-disabled").attr("aria-disabled", true);
                        $('#FilterSort').prop('disabled', 'disabled');

                       
                        //$('#tblFlightTransfer1_FlightNo_2').val('D7-1234');
                        //$('#tblFlightTransfer1_HdnFlightNo_2').val('90');

                        //$('#tblFlightTransfer1_FlightDate_2').val('26-Nov-2015');

                        if ($("#sameflight").is(':checked')){

                            var lenDateTime = $('#tblFlightTransfer1 input[id^=tblFlightTransfer1_FlightDate_]')
                            for (var count = 0; count < lenDateTime.length; count++) {
                                if (count != rowIndex) {
                                    $("#" + lenDateTime[count.toString()].id).val($('#tblFlightTransfer1_FlightDate_' + (rowIndex + 1)).val());
                                    $("#" + lenDateTime[count.toString()].id).attr("disabled", true).closest("span").find("span.k-icon").hide();
                                }
                            }


                            var lenDateTime = $('#tblFlightTransfer1 input[id^=tblFlightTransfer1_FlightNo_]')
                            for (var count = 0; count < lenDateTime.length; count++) {
                                if (count != rowIndex) {
                                    $("#" + lenDateTime[count.toString()].id).val($('#tblFlightTransfer1_FlightNo_' + (rowIndex + 1)).val());
                                    $('#tblFlightTransfer1_HdnFlightNo_' + (count + 1)).val($('#tblFlightTransfer1_HdnFlightNo_' + (rowIndex + 1)).val());
                                    $("#" + lenDateTime[count.toString()].id).attr("disabled", true).closest("span").find("span.k-icon").hide();
                                }
                            } 
                        }
                            
                        
                        



                        
                        
                    }
                }
            },
            {
                name: 'ADDSpam', display: 'Flight Summary', type: 'label', isRequired: false, onClick: function (evt, rowIndex) {
                    $('#hdnFlightSumarySNo').val($('#tblFlightTransfer1_HdnFlightNo_' + (rowIndex + 1)).val())
                    $("#divFlightSummary").dialog('open');
            }
            },
        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: false

        }
    });
    
    // hidegridbutton();
}

function handleChange(evt, rowIndex) {
    alert('Selected Value = ' + evt.target.value);
}


function createFlightSummaryTable() {
    var dbTableName = 'FlightSummary';
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tblFlightSummary').appendGrid({
        tableID: 'tblFlightSummary',
        contentEditable: pageType != 'VIEW',
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Shipment/FlightTransferService.svc',
        getRecordServiceMethod: 'GetFlightSummaryRecord',
        createUpdateServiceMethod: 'createUpdateDimension',
        isGetRecord: true,
        deleteServiceMethod: 'deleteDimension',
        caption: 'Flight Transfer Detail',
        initRows: 1,
        // column for edit
        columns: [
                { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'ETD', display: 'ETD', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'ETA', display: 'ETA', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'Dest', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'Atype', display: 'Atype', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'Route', display: 'Route', type: 'label', ctrlCss: { width: '80px' }, isRequired: false },
                { name: 'TCapacity', display: 'TCapacity', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'ACapacity', display: 'ACapacity', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'UCapacity', display: 'UCapacity', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'FStatus', display: 'FStatus', type: 'label', ctrlCss: { width: '50px' }, isRequired: false }
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




function createFlightSearchTable(DFSNo) {
    var dbTableName = 'FlightSearch';
    var pageType = 1;
    cfi.ValidateForm();
    $('#tblFlightSearch').appendGrid({
        tableID: 'tblFlightSearch',
        contentEditable: pageType != 'VIEW',
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 5, whereCondition: DFSNo, sort: '',
        servicePath: './Services/Shipment/FlightTransferService.svc',
        getRecordServiceMethod: 'GetFlightSearchRecord',
        createUpdateServiceMethod: 'createUpdateDimension',
        deleteServiceMethod: 'deleteDimension',
        caption: 'Flight Search Detail',
        initRows: 1,
        isGetRecord: true,
        // column for edit
        columns: [
                {
                    name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '50px', color: 'blue','text-decoration': 'underline','cursor': 'pointer' }, isRequired: false, onClick: function (evt, rowIndex) {
                        BTranFlight(evt, rowIndex);
                    }
                },
                { name: 'DFSNo', type: 'hidden' },
                { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'ETD', display: 'ETD', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'ETA', display: 'ETA', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'Dest', display: 'Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'Atype', display: 'Atype', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'Route', display: 'Route', type: 'label', ctrlCss: { width: '80px' }, isRequired: false },
                { name: 'TCapacity', display: 'TCapacity', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'ACapacity', display: 'ACapacity', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'UCapacity', display: 'UCapacity', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'FStatus', display: 'FStatus', type: 'label', ctrlCss: { width: '50px' }, isRequired: false }
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

