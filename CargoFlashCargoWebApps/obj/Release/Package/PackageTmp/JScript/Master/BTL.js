
$(document).ready(function () {
   
    $.ajax({
        url: 'HtmlFiles/BTL/BTL.html',
        async:false,
        success: function (result) {
            $('#BTLContainer').append(result);
            CreateData();
         
        }
    })
   
    cfi.ValidateForm();
    //cfi.ValidateSection('tblbtl');
});

var a = '';
var TypeList = [{ Key: "1", Text: "International" }, { Key: "2", Text: "Domestic" }, { Key: "3", Text: "Both" }] //
var BTLLevelList = [{ Key: "1", Text: "Flight Level" }, { Key: "2", Text: "Period Level" }, { Key: "3", Text: "" }]
var BTLStatusList = [{ Key: "1", Text: "Active" }, { Key: "2", Text: "Inactive" }, { Key: "3", Text: "Expired" }]
function CreateData() {
    cfi.AutoComplete("AccountSNo", "Name", "vAccount", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineCode", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("Aircraft", "AircraftType,AirlineName", "vwAirCraftForEmbargo", "SNo", "AircraftType", ["AircraftType", "AirlineName"], null, "contains", ",");
    cfi.AutoComplete("Commodity", "CommodityCode,CommodityDescription", "vwCommodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoComplete("SHC", "SNo,Code", "vwsphc", "SNo", "Code", ["Code"], null, "contains");
    cfi.AutoCompleteByDataSource("Type", TypeList);
    cfi.AutoCompleteByDataSource("BTLLevel", BTLLevelList);
    cfi.AutoCompleteByDataSource("BTLStatus", BTLStatusList);
    cfi.DateType("ValidFrom");
    cfi.DateType("ValidTo");

    if (getQueryStringValue("FormAction").toUpperCase() != "NEW" && getQueryStringValue("FormAction").toUpperCase() != "INDEXVIEW") {
        var CurrentRateSno = $("#hdnBTLConSNo").val();
        $.ajax({
            url: "Services/Master/BTLService.svc/GetBTLRecord?recordID=" + CurrentRateSno , async: false, type: "get", dataType: "json", cache: false,
            //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
            data: JSON.stringify({ RateSNo: CurrentRateSno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ArrayData = jQuery.parseJSON(result);
                var Array = ArrayData.Table0;
                cfi.BindMultiValue("Aircraft", Array[0].Text_AircraftSNo, Array[0].AircraftSNo);
                $('#Text_AirlineSNo').val(Array[0].Text_AirlineSNo);
                $('#Text_Type').val(Array[0].Text_Type);
                $('#Text_BTLLevel').val(Array[0].Text_BTLLevel);
                $('#Text_BTLStatus').val(Array[0].Text_BTLStatus);
                //$("input[type=radio][name=IsInclude][value=" + Array[0].IsInclude + "]").attr('checked', 1);
                $('#BTLName').val(Array[0].BTLName);
                $('#BTLRemarks').val(Array[0].BTLRemarks);
                $('#DaysOfWeek').val(Array[0].DaysOfWeek);
               

            }
        });


        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            var a = $("#DaysOfWeek").val();
            var countday = 0;
            for (i = 1; i < 8; i++) {
                if (a.indexOf(i) != -1) {
                    $("#Day" + i).attr('checked', true);
                    countday += 1;
                }
            }
            if (countday == 7) {
                $("#Day0").attr('checked', true);
            }
        }

    }

}

function CreateFlightGrid() {
    var dbtableName = "BTL";
 
    $("#tblBTL").appendGrid({

        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10, 
        contentEditable: true,
        servicePath: "/Services/Master/BTLService.svc",
        getRecordServiceMethod: "GetBTLFlightRecord",
        deleteServiceMethod: "DeleteBTLFlightRecord",
        caption: "BTL Flight",
        initRows: 1,
        isGetRecord: false,
        columns: [
            { name: "SNo", type: "hidden" },
           { name: 'FlightSNo', display: 'Flight', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'vScheduleForBTL', textColumn: 'FlightNo', keyColumn: 'FlightNo', filterCriteria: "contains" },
           { name: "NoOfPieces", display: "No. Of Pieces", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: "number" }, isRequired: true },
           { name: "TotalWeight", display: "Total Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: "number" }, isRequired: true },
            { name: 'CommoditySNo', display: 'Commodity', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'vwCommodity', textColumn: 'CommodityDescription', keyColumn: 'SNo', filterCriteria: "contains" },
            { name: 'SHCSNo', display: 'SHC', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'vwsphc', textColumn: 'Code', keyColumn: 'SNo', filterCriteria: "contains" }

        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    })
   // $('#tblTransactionHistory_btnRemoveLast').remove();
  //  $('#tblTransactionHistory_btnAppendRow').remove();
    //$("#tblBTL").appendGrid('hideColumn', '');
}

function CreatePeriodGrid() {
    var dbtableName = "BTL";

    $("#tblBTL").appendGrid({

        tableID: "tbl" + dbtableName,
        tableColumns: 'SNo',
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1,
        itemsPerPage: 10,
        contentEditable: true,
        servicePath: "/Services/Master/BTLService.svc",
        getRecordServiceMethod: "GetBTLFlightRecord",
        deleteServiceMethod: "DeleteBTLFlightRecord",
        caption: "BTL Period",
        initRows: 1,
        isGetRecord: false,
        columns: [
            { name: "SNo", type: "hidden" },
           { name: "NoOfDays", display: "No. Of Days", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: "number" }, isRequired: true },
           { name: "NoOfShipment", display: "No. Of Shipment", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: "number" }, isRequired: true },
           { name: "TotalWeight", display: "Total Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: "number" }, isRequired: true },
           { name: 'CommoditySNo', display: 'Commodity', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'vwCommodity', textColumn: 'CommodityDescription', keyColumn: 'SNo', filterCriteria: "contains" },
           { name: 'SHCSNo', display: 'SHC', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'vwsphc', textColumn: 'Code', keyColumn: 'SNo', filterCriteria: "contains" }


        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    })
   // $('#tblTransactionHistory_btnRemoveLast').remove();
   // $('#tblTransactionHistory_btnAppendRow').remove();
   // $("#tblBTL").appendGrid('hideColumn', '');
}

$(document).on('select', '#Text_BTLLevel', function () {
    
    if ($('#BTLLevel').val() == 1) {
       // $("#tblBTL").empty();
        CreateFlightGrid();
    }
    else if ($('#BTLLevel').val() == 2) {
      //  $("#tblBTL").empty();
        CreatePeriodGrid();
    }
});

$('input[type="submit"][name="operation"]').click(function () {
    
    if ($('#tblBTL_rowOrder').val() == "") {
        ShowMessage('warning', 'Warning -BTL!', "Add BTL Level Details");
        return false;
    }
    return true;
});




function handleClick() {
    if ($('#Day0').is(":checked")) {
        $('input[type="checkbox"]').attr('checked', true);
    }
   
}

function changeClick() {
    if ($('input[id^="Day"][value!="8"]').not(":checked")) {

        $('#Day0').attr('checked', false);
    }

}