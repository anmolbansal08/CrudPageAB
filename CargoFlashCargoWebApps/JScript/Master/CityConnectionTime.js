/// <reference path="D:\Cargoflash.Garuda.Reservation\GADev\CargoFlashCargoWebApps\Scripts/references.js" />
//Javascript file for CityConnectionTime Page for binding Autocomplete
// { Key: "2", Text: "ETD" }
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    //var BasedOnList = [{ Key: "1", Text: "BKD" }, { Key: "2", Text: "FWB" }, { Key: "3", Text: "ATA" }, { Key: "4", Text: "ATD" }]
    //cfi.AutoCompleteByDataSource("BasedOn", BasedOnList);
    cfi.AutoCompleteV2("BasedOn", "SNo,BasedOn", "Master_CityConnectionTime_BasedOn", null, "contains");// Added By Pankaj Kumar Ishwar on 13-01-2018
    //cfi.AutoComplete("ConnectionTypeSNo", "SNo,ConnectionTypeName", "vwConnectionType", "SNo", "ConnectionTypeName", ["ConnectionTypeName"], setfields, "contains");
    cfi.AutoCompleteV2("ConnectionTypeSNo", "SNo,ConnectionTypeName", "Master_CityConnectionTime_ConnectionType", null, "contains", null, null, null, null, setfields);
    //cfi.AutoComplete("AirlineCodeSNo", "CarrierCode,AirlineName", "v_airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");//Added by Shahbaz
    cfi.AutoCompleteV2("AirlineCodeSNo", "CarrierCode,AirlineName", "Master_CityConnectionTime_AirlineCode", null, "contains");
    //cfi.AutoComplete("AirportSNo", "SNo,AirportCode", "vwairport", "SNo", "AirportCode", ["AirportCode"], onSelectAirport, "contains");
    cfi.AutoCompleteV2("AirportSNo", "SNo,AirportCode", "Master_CityConnectionTime_AirportCode", onSelectAirport, "contains");
    //cfi.AutoComplete("AircraftSNo", "SNo,AircraftType", "vAirCraftGetList", "SNo", "AircraftType", ["AircraftType"], onSelectAircrafttype, "contains");
    cfi.AutoCompleteV2("AircraftSNo", "SNo,AircraftType", "Master_CityConnectionTime_AircraftType", onSelectAircrafttype, "contains");
    //cfi.AutoComplete("ProductSNo", "SNo,ProductName", "vwProduct", "SNo", "ProductName", ["ProductName"], onSelectProduct, "contains");
    cfi.AutoCompleteV2("ProductSNo", "SNo,ProductName", "Master_CityConnectionTime_ProductName", onSelectProduct, "contains");
    //cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
    cfi.AutoCompleteV2("SPHCSNo", "Code", "Master_CityConnectionTime_SPHC", onSelectSHC, "contains", ",");
    // BindAutocomplete()
    cfi.AutoCompleteV2("OtherAirlineAccess", "CarrierCode,AirlineName", "Master_CityConnectionTime_AirlineCode", null, "contains", ",");
    //cfi.AutoCompleteV2("AgentSNo", "Code", "Master_CityConnectionTime_SPHC", null, "contains", ",");
    cfi.AutoCompleteV2("AgentSNo", "Name", "Master_CityConnectionTime_TOPUPAgent", null, "contains", ",");


    $("#tbl tr:eq(10)").css("visibility", "collapse");

    $('#AdjustableWeight').keypress(function (event) {
        return isNumber(event, this)
    });

    function isNumber(evt, element) {

        var charCode = (evt.which) ? evt.which : event.keyCode      
        if (
          
            (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    }

    $('#ConnectionTimeHr,#ConnectionTimeMin').css('text-align', 'right').on('keypress', function (e) {
        if (e.which != 8 && e.which != 0 && e.which != 9 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("input[id='IsRoot'][value='1']").click();
        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "TOPUP") {
            $("#tbl tr:eq(10)").css("visibility", "visible");
            $("#AdjustableWeight").attr("data-valid", "required");
            $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');
        }
        else {
            $("#tbl tr:eq(10)").css("visibility", "collapse");

            $("#AdjustableWeight").removeAttr("data-valid");
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        //  $("#Text_BasedOn").data("kendoAutoComplete").enable(false)
        if ($("input[id='IsRoot']:checked").val() == '0') {
            $("input[id='IsRoot'][value='1']").attr('disabled', 'disabled');
        } else {
            $("input[id='IsRoot'][value='0']").attr('disabled', 'disabled');
        }
        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "TOPUP") {
            $("#tbl tr:eq(10)").css("visibility", "visible");
            $("#AdjustableWeight").attr("data-valid", "required");
            $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');
        }
        else {
            $("#tbl tr:eq(10)").css("visibility", "collapse");

            $("#AdjustableWeight").removeAttr("data-valid");
        }
    }
    if (userContext.SysSetting.ICMSEnvironment == "JT") {
        Changesfields();
    }
    //--------- added by arman for Auto Confirm-------------------
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        var hour = parseInt($("#ConnectionTimeHr").val());
        var Min = parseInt($("#ConnectionTimeMin").val());
        $("#Weight").closest('td').remove();
        $("#ConnectionTimeMin").closest('td').show();
        $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');
        $("#Weight").removeAttr("data-valid");
        $("#ConnectionTimeHr").closest('td').prev('td').find('span').text("Connection Time")
        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "AUTO CONFIRM") {
            var str = '<input type="text" class="k-input" name="Weight" id="Weight" style="width: 149px; text-align: right;" controltype="number" colname="Weight" data-valid="min[1],required" data-valid-msg="Weight Should Be Greater Than Zero" tabindex="10" maxlength="" value="" data-role="numerictextbox">';
            $("#ConnectionTimeMin").closest('td').after('<td class="formInputcolumn">' + str + "</td>");
            $("#ConnectionTimeMin").closest('td').hide();
            $("#ConnectionTimeHr").closest('td').prev('td').find('span').text("Weight")
            $("#ConnectionTimeHr, #ConnectionTimeMin").removeAttr('data-valid')
            var hour = parseInt($("#ConnectionTimeHr").val());
            var Min = parseInt($("#ConnectionTimeMin").val());
            var total = (hour * 60) + Min
            $("#Weight").val(total);
            //alert(total)
            // $("#ConnectionTimeMin").closest('td').prev('td').text("Weight");
        }
        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "ACCEPTANCE VARIANCE") {
            $("#tbl tr:gt(5)").css("visibility", "collapse");
            CreateCityConnectionSlabGrid();
        }
        else {
            $("#tbl tr:gt(5)").css("visibility", "visible");
        }

        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "TOPUP") {
            $("#tbl tr:eq(10)").css("visibility", "visible");
            $("#AdjustableWeight").attr("data-valid", "required");
            $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');
        }
        else {
            $("#tbl tr:eq(10)").css("visibility", "collapse");
            $("#AdjustableWeight").removeAttr("data-valid");
        }


        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "FLIGHT AUTO CLOSE") {
            $("#Text_ProductSNo").data("kendoAutoComplete").enable(false);
            $("#Text_SPHCSNo").data("kendoAutoComplete").enable(false);
            $("#Text_BasedOn").data("kendoAutoComplete").enable(true);
            var hour = parseInt($("#ConnectionTimeHr").val());
            var Min = parseInt($("#ConnectionTimeMin").val());
            $("#Weight").closest('td').remove();
            $("#ConnectionTimeMin").closest('td').show();
            $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');
            $("#Weight").removeAttr("data-valid");
            $("#ConnectionTimeHr").closest('td').prev('td').find('span').text("Connection Time")
        }
        cfi.BindMultiValue("OtherAirlineAccess", $("#Text_OtherAirlineAccess").val(), $("#OtherAirlineAccess").val());
        cfi.BindMultiValue("AgentSNo", $("#Text_AgentSNo").val(), $("#Text_AgentSNo").val());
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        if ($("#ConnectionTypeSNo").val().toUpperCase() == "AUTO CONFIRM") {
            var len = parseInt($("#ConnectionTime").val().split(" ").length)
            var Hour = len == 2 ? 0 : parseInt($("#ConnectionTime").val().split(" ")[0])
            var Min = len == 2 ? parseInt($("#ConnectionTime").val().split(" ")[0]) : parseInt($("#ConnectionTime").val().split(" ")[3])
            var total = (Hour * 60) + Min
            $("span#ConnectionTime").text(total);
            $("#ConnectionTime").closest('td').prev('td').text("Weight");

        }
        if ($("#ConnectionTypeSNo").val().toUpperCase() == "ACCEPTANCE VARIANCE") {
            $("#tbl tr:gt(5)").css("visibility", "collapse");
            CreateCityConnectionSlabGrid();

            $('#tblAppendGrid1').find("input,button,textarea,select").attr("disabled", "disabled");
        }
        else {
            $("#tbl tr:gt(5)").css("visibility", "visible");
        }
    }
    //---------------------------------------end-----------------------------------------------
    $('#ConnectionTimeHr,#ConnectionTimeMin').on('blur', function () {
        if ($('#ConnectionTimeMin').val() > 59) {
            ShowMessage('warning', '', "Min. can not be greater than 59.");
            $('#ConnectionTimeMin').val(0);
        }

        if (this.value == "") {
            this.value = 0;
        }
    });
    cfi.BindMultiValue("SPHCSNo", $("#Text_SPHCSNo").val(), $("#SPHCSNo").val());

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        //onSelectAircrafttype();
        //getslab();
        $('#ConnectionTimeHr').after('<span>&nbsp;Hr.&nbsp;&nbsp;</span>');
        $('#ConnectionTimeMin').after('<span>&nbsp;Min.&nbsp;&nbsp;</span>');
    }







    function setfields(a) {

        //Added By Mukesh 30/01/2020
        if ($("#Text_ConnectionTypeSNo").data("kendoAutoComplete").dataItem(a.item.index()).Text.toUpperCase() == "ACCEPTANCE VARIANCE") {
            //cfi.AutoCompleteV2("AirlineCodeSNo", "CarrierCode,AirlineName", "Master_CityConnectionTime_AirlineCode", null, "contains", ",");
            //cfi.AutoCompleteV2("AirportSNo", "SNo,AirportCode", "Master_CityConnectionTime_AirportCode", onSelectAirport, "contains", ",");

            $('#Text_AirlineCodeSNo').val('');
            $('#Text_AirportSNo').val('');

            $("#ConnectionTimeMin").removeAttr("data-valid");

            $("#ConnectionTimeHr").removeAttr("data-valid");

            $("#tbl tr:gt(5)").css("visibility", "collapse");




            //    var table = "<table id='tblAppendGrid1'></table>";                  
            //    $("#tbl").after(table);
            //    $('#tblAppendGrid1').appendGrid({
            //    V2: true,
            //    tableID: 'tblAppendGrid1',
            //    caption: 'Slab Details',
            //    //servicePath: "./Services/Rate/RateService.svc",
            //    getRecordServiceMethod: "GetCityConnectionTransRecord",
            //   // getRecordServiceMethod: SlabProc,
            //   // deleteServiceMethod: 'delete' + dbtableName,

            //    servicePath: 'Services/Master/CityConnectionTimeService.svc',
            //    //getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            //    //createUpdateServiceMethod: 'createUpdateCityConnectionTimeSlab',
            //   // deleteServiceMethod: 'deleteCityConnectionTimeSlab',


            //    columns: [
            //              //{ name: 'SNo', type: 'hidden', value: 0 },
            //              //{ name: 'ScheduleSNo', type: 'hidden', value: $('#hdnScheduleSno').val() },
            //              //{ name: 'HdnOrigin', type: 'hidden' },
            //              //{ name: 'HdnParentID', type: 'hidden' },
            //              //{ name: 'HdnDestination', type: 'hidden' },
            //              //{ name: 'ALTCarrierCode', type: 'hidden' },
            //              //{ name: 'AddLegNo', type: 'hidden', value: "0" },
            //              //{ name: 'RowID', type: 'hidden', value: "0" },
            //              //{ name: 'HdnUMG', type: 'hidden' },
            //              //{ name: 'HdnUMV', type: 'hidden' },
            //              //{ name: 'Routing', type: 'hidden', value: $('#hdnRouting').val() },
            //              //{ name: 'HdnIsLeg', type: 'hidden' },
            //              //{ name: 'HdnLegId', type: 'hidden' },
            //              //{ name: 'ScheduleType', type: 'hidden', value: (isEmpty($('input:radio[name*="ScheduleType"]')) ? ($('#ScheduleTypeName').html() == 'Self' ? '0' : ($('#ScheduleTypeName').html() == 'SPA' ? '1' : '3')) : $('input:radio[name*="ScheduleType"]').val()) },
            //              //{ name: 'FlightNo', type: 'hidden' },
            //              //{ name: 'HdnDepartureSequence', type: 'hidden' },                    
            //              { name: "StartWeight", display: "Start Weight", isRequired: true,  ctrlAttr: { maxlength: 3, maxlength: 3 }, ctrlCss: { width: '75px', height: '20px' } },
            //              { name: "EndWeight", display: "End Weight", isRequired: true, ctrlAttr: { maxlength: 3, maxlength: 3 }, ctrlCss: { width: '75px', height: '20px' } },
            //             // { name: "type", display: "type", type: 'div',
            //             //   divElements: [
            //             //  { divRowNo: 1, name: 'plus', type: 'label', value: '+', ctrlAttr: { maxlength: 3, readonly: true }, ctrlCss: { width: '75px', }, isRequired: false }
            //             //  ,
            //             //  { divRowNo: 2, name: 'minus', isRequired: false, type: 'label', value: '-', ctrlAttr: { maxlength: 3, readonly: true }, ctrlCss: { width: '75px' } }
            //             //        ]
            //             //    },

            //             // { name: 'fwbfoh', display: 'FWB-FOH Variance %', type: 'div', isRequired: false,
            //             //divElements: [
            //             //    { divRowNo: 1, name: 'GrWtplus', display: 'Gr Wt', type: 'text',  value: '', ctrlAttr: { maxlength: 3, maxlength: 3 }, ctrlCss: { width: '75px', } },
            //             //    { divRowNo: 1, name: 'volplus', display: 'Volume', type: 'text',  value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

            //             //      },
            //             //    { divRowNo: 2, name: 'GrWtminus', display: 'Gr Wt', isRequired: false, type: 'text', value: '', ctrlAttr: { maxlength: 3 }, ctrlCss: { width: '75px' } },
            //             //    { divRowNo: 2, name: 'volminus', display: 'Volume', type: 'text',  value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }
            //             //    }
            //             //]
            //             // },
            //              { name: "GrossWtVariancePlus", display: "Gr Wt (+ve Variance)", type: 'text', ctrlAttr: { maxlength: 3, maxlength: 3 }, ctrlCss: { width: '75px', height: '20px' } },
            //              { name: "VoluemeWeightPlus", display: "Volume (+ve Variance)", type: 'text', ctrlAttr: { maxlength: 3, maxlength: 3 }, ctrlCss: { width: '75px', height: '20px' } },
            //              { name: "GrossWtVarianceminus", display: "Gr Wt (-ve Variance)", type: 'text', ctrlAttr: { maxlength: 3, maxlength: 3 }, ctrlCss: { width: '75px', height: '20px' } },
            //              { name: "VoluemeWeightminus", display: "Volume (-ve Variance)", type: 'text', ctrlAttr: { maxlength: 3, maxlength: 3 }, ctrlCss: { width: '75px', height: '20px' } }
            //    ],
            //    afterRowAppended: function(caller, parentRowIndex, addedRowIndex) {
            //        // Copy data of `Foo` from parent row to new added rows
            //       // var parentValue = getCtrlValue("EndRange", parentRowIndex);
            //        if (parentRowIndex!=null)
            //        {

            //            var parentValue = $("#tblAppendGrid1_EndWeight_" + addedRowIndex).val();
            //        var    currentRowIndex = parseInt(addedRowIndex) + 1;
            //        $("#tblAppendGrid1_StartWeight_" + currentRowIndex).val(parseInt(parentValue) + 1);

            //            //for (var z = 0; z < addedRowIndex.length; z++) {
            //            //    // setCtrlValue("StartRange", addedRowIndex[z], parentValue + 1);
            //            //    $("#tblAppendGrid1_StartRange_" + addedRowIndex).val(parentValue);
            //            //}
            //        }
            //        else
            //        {
            //            addedRowIndex = parseInt(addedRowIndex) + 1;
            //            $("#tblAppendGrid1_StartWeight_" + (addedRowIndex)).val("1");
            //        }
            //        //var parentValue = $("#tblAppendGrid1_EndRange_" + parentRowIndex+1).val();
            //        //for (var z = 0; z < addedRowIndex.length; z++) {
            //        //    caller.setCtrlValue("StartRange", addedRowIndex[z], parentValue + 1);
            //        //    $("#tblAppendGrid1_StartRange_" + addedRowIndex+1).val(parentValue);
            //        //}

            //    },

            //    isPaging: false,
            //    hideButtons: {
            //        remove: false,
            //        removeLast: false,
            //        insert: true,
            //        append: false,
            //        update: true,
            //        updateAll: true
            //    }            
            //});  
            CreateCityConnectionSlabGrid();
        }
        else {
            $("#tbl tr:gt(5)").css("visibility", "visible");

            $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');

            $('#divMultiAirlineCodeSNo').remove();
            $('#divMultiAirportSNo').remove();
            $("#tblAppendGrid1").remove();

            //cfi.AutoCompleteV2("AirlineCodeSNo", "CarrierCode,AirlineName", "Master_CityConnectionTime_AirlineCode", null, "contains");
            //cfi.AutoCompleteV2("AirportSNo", "SNo,AirportCode", "Master_CityConnectionTime_AirportCode", onSelectAirport, "contains");
        }
        //Mukesh 30/01/2020 --Ends Here

        if ($("#Text_ConnectionTypeSNo").data("kendoAutoComplete").dataItem(a.item.index()).Text.toUpperCase() == "TOPUP") {
          
            $('#Text_AirlineCodeSNo').val('');
            $('#Text_AirportSNo').val('');

            $("#ConnectionTimeMin").removeAttr("data-valid");

            $("#ConnectionTimeHr").removeAttr("data-valid");

            $("#tbl tr:eq(10)").css("visibility", "visible");
            $("#AdjustableWeight").attr("data-valid", "required");
            $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');
        }
        else
        {
            $("#tbl tr:eq(10)").css("visibility", "collapse");
            $("#AdjustableWeight").removeAttr("data-valid");
        }


        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "FLIGHT AUTO CLOSE") {
            $("#Text_ProductSNo").data("kendoAutoComplete").enable(false);
            $("#Text_SPHCSNo").data("kendoAutoComplete").enable(false);
            $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
            $("#Text_BasedOn").data("kendoAutoComplete").enable(true);
            $("#Weight").closest('td').remove();
            $("#ConnectionTimeMin").closest('td').show();
            $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');
            $("#Weight").removeAttr("data-valid");
            $("#ConnectionTimeHr").closest('td').prev('td').find('span').text("Connection Time")
            Clear();
        }
        else {
            $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
            $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AircraftSNo').val('');
            $('#AircraftSNo').val('');
            $('#Text_ProductSNo').val('');
            $('#ProductSNo').val('');
            $('#Text_AirportSNo').val('');
            $('#AirportSNo').val('');
            $('#Text_SPHCSNo').val('');
            $('#SPHCSNo').val('');
            $('#divMultiSPHCSNo').remove();
            //cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
            cfi.AutoCompleteV2("SPHCSNo", "Code", "Master_CityConnectionTime_SPHC", onSelectSHC, "contains", ",");
            getslab();
        }
        if (userContext.SysSetting.ICMSEnvironment == "JT") {
            Changesfields();
        }
        SelectAirport();
    }
    function getslab() {
        // BindAutoComplete();
        $("#Weight").closest('td').remove();
        $("#ConnectionTimeMin").closest('td').show();
        //$("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');        
        $("#Weight").removeAttr("data-valid");
        $("#ConnectionTimeHr").closest('td').prev('td').find('span').text("Connection Time")

        //   $("#ConnectionTimeMin").closest('td').prev('td').text("Connection Time");
        //  $("#spnConnectionTime").text('*');
        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "AUTO CONFIRM") {
            var str = '<input type="text" class="k-input" name="Weight" id="Weight" style="width: 149px; text-align: right;" controltype="number" colname="Weight" data-valid="required" data-valid-msg="Weight Cannot Be Blank" tabindex="10" maxlength="" value="" data-role="numerictextbox">';
            $("#ConnectionTimeMin").closest('td').after('<td class="formInputcolumn">' + str + "</td>");
            $("#ConnectionTimeMin").closest('td').hide();
            $("#ConnectionTimeHr").closest('td').prev('td').find('span').text("Weight");
            $("#ConnectionTimeHr, #ConnectionTimeMin").removeAttr('data-valid');
            // $("#ConnectionTimeMin").closest('td').prev('td').text("Weight");
        }
        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "ACCEPTANCE VARIANCE") {
            $("#ConnectionTimeHr, #ConnectionTimeMin").removeAttr('data-valid');
        }

        var id = $("#ConnectionTypeSNo").val();
        if (id != "") {
            $.ajax({
                type: "GET",
                url: './Services/Master/CityConnectionTimeService.svc/GetDefault?id=' + parseInt(id),
                //data: { id: parseInt(id) },
                dataType: "json",
                success: function (response) {
                    var record = jQuery.parseJSON(response);
                    var myData = record.Table[0];
                    //   alert(myData.BasedOn);
                    $('#Text_BasedOn').val(myData.Text_BasedOn);
                    $('#BasedOn').val(myData.BasedOn);
                    if ((myData.IsRoot) == true) {
                        $('#IsRoot[data-radioval=No]').removeAttr('checked');
                        //$('#IsRoot').val(1)
                        $('input[type="radio"][name="IsRoot"][value="0"]').prop("checked", 'checked');
                        $('#Text_BasedOn').data("kendoAutoComplete").enable(false);
                        $('input[type="radio"][name="IsRoot"]').attr("disabled", false);
                    }
                    else {
                        $('#IsRoot').val(0)
                        $('input[type="radio"][name="IsRoot"][value="1"]').prop("checked", 'checked');
                        $('#Text_BasedOn').data("kendoAutoComplete").enable(false);
                        $('input[type="radio"][name="IsRoot"]').attr("disabled", true);

                    }

                    // $("#IsRoot").prop('checked') == myData.IsRoot ? 0 : 1;
                    // alert(myData.IsRoot);
                }
            });
        }
    }

    $(document).on('drop', function () {
        return false;
    });
    function Changesfields() {
        var fA = getQueryStringValue("FormAction").toUpperCase();
        if (fA != "READ" && $("#Text_ConnectionTypeSNo").val().toUpperCase() == "AUTO ALERT ON FBL") {
            $("#Text_SPHCSNo").data("kendoAutoComplete").enable(false);
            $("#Text_ProductSNo").data("kendoAutoComplete").enable(false);
            $('#AirportSNo').closest('td').prev('td').text('').append('<font color="red">*</font> <span id="spnAirportCodeSNo"> Airport Code</span>');
            $('#Text_AirportSNo').attr("data-valid", "required");
            $('#Text_AirportSNo').attr("data-valid-msg", "Airport Code cannot be blank");
            $('#Text_AirportSNo').css('border-color', '#94c0d2');
        }
        else {
            $('#Text_AirportSNo').removeAttr("data-valid");
            $('#Text_AirportSNo').removeAttr("data-valid-msg");
            $('#AirportSNo').closest('td').prev('td').text('').text('Airport Code')//
            $('#Text_AirportSNo').closest('span').css('border-color', '');
        }

        if ($("#Text_ConnectionTypeSNo").val().toUpperCase() == "TOPUP") {
            $("#tbl tr:eq(10)").css("visibility", "visible");
            $("#AdjustableWeight").attr("data-valid", "required");
            $("#ConnectionTimeHr, #ConnectionTimeMin").attr('data-valid', 'required');
        }
        else {
            $("#tbl tr:eq(10)").css("visibility", "collapse");
            $("#AdjustableWeight").removeAttr("data-valid");
        }

    }
    SelectAirport();
});
$('input[type="submit"][name="operation"]').click(function (e) {
    if ($("input[name='IsRoot']:checked").val() == '0') {
        if ($("#Text_AirportSNo").val() == "" && $("#Text_AircraftSNo").val() == "" && $("#Text_ProductSNo").val() == "" && ($("#SPHCSNo").val() == "" || $("#SPHCSNo").val() == "0" && $("#Text_AdjustableWeight").val() == "")) {
            ShowMessage('warning', 'City Connection Time', "Select Any Field (Aircraft or Airport or Product or SHC)");
            return false;
        }
    }
    $('input[type="radio"][name="IsRoot"]').attr("disabled", false);
    $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
    $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
    $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
    $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
    //getslab();
    if ($("#Text_ConnectionTypeSNo").val().toUpperCase() != "AUTO CONFIRM" && $('#Text_ConnectionTypeSNo').val().toUpperCase() != "FLIGHT AUTO CLOSE" && $('#Text_ConnectionTypeSNo').val().toUpperCase() != "ACCEPTANCE VARIANCE") {
        if ($('#ConnectionTimeHr').val() == 0 && $('#ConnectionTimeMin').val() == 0) {
            ShowMessage('warning', '', "Connection Time should be greater than 0.");
            e.preventDefault();
            return false;
        }
    }
    else if ($('#Text_ConnectionTypeSNo').val().toUpperCase() == "ACCEPTANCE VARIANCE") {
        if ($('#tblAppendGrid1_rowOrder').val() == "") {
            ShowMessage('warning', 'Warning -City Connection!', "Add Slab");
            return false;
        }
    }
});





function ExtraCondition(textId) {
    var filterCityConnectionTime = cfi.getFilter("AND");
    if (textId == "Text_ConnectionTypeSNo") {
        try {
            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }
    if (textId == "Text_AirportSNo") {
        try {

            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }
    if (textId == "Text_AircraftSNo") {
        try {

            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }
    if (textId == "Text_ProductSNo") {
        try {

            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }
    if (textId == "Text_SPHCSNo") {
        try {

            cfi.setFilter(filterCityConnectionTime, "IsActive", "eq", "1")
            cfi.setFilter(filterCityConnectionTime, "SNo", "notin", $("#Text_SPHCSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }
    if (textId == "Text_AirlineCodeSNo") {
        try {
            cfi.setFilter(filterCityConnectionTime, "IsInterline", "eq", "0");
            cfi.setFilter(filterCityConnectionTime, "SNo", "notin", $("#Text_OtherAirlineAccess").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }

    if (textId == "Text_BasedOn" && $("#Text_ConnectionTypeSNo").val().toUpperCase() == "FLIGHT AUTO CLOSE") {
        try {
            cfi.setFilter(filterCityConnectionTime, "SNo", "in", "3,4");
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }
    if (textId == "Text_OtherAirlineAccess")
        try {
            cfi.setFilter(filterCityConnectionTime, "IsInterline", "eq", "0");
            cfi.setFilter(filterCityConnectionTime, "SNo", "notin", $("#Text_AirlineCodeSNo").data("kendoAutoComplete").key())
            //cfi.setFilter(filterCityConnectionTime, "CarrierCode", "notin", $('#Text_AirlineCodeSNo').val().split('-')[0])
            //cfi.setFilter(filterCityConnectionTime, "SNo", "notin", $('#AirlineCodeSNo').val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
}
function onSelectAircrafttype() {
    if ($("input[name='IsRoot']:checked").val() == '0') {
        if ($('#Text_AircraftSNo').val() == "") {
            //ResetDropDown();
        }
        else {
            //     ResetDropDown();
            $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
            $('#Text_ProductSNo,#Text_SPHCSNo, #ProductSNo, #SPHCSNo').val('');
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
            $('#Text_SPHCSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);

            //cfi.AutoComplete("SPHCSNo", "Code", "vwSPHC", "SNo", "Code", ["Code"], onSelectSHC, "contains", ",");
            cfi.AutoCompleteV2("SPHCSNo", "Code", "Master_CityConnectionTime_SPHC", onSelectSHC, "contains", ",");
            $('#divMultiSPHCSNo').remove();
            //   alert('yes')
        }
    }
    else {
        //ResetDropDown();
        //  alert('no')
    }
}
function onSelectSHC() {
    if ($("input[name='IsRoot']:checked").val() == '0') {
        if ($('#Text_SPHCSNo').val() == "") {
            ResetDropDown();
        }
        else {
            // ResetDropDown();
            $('#Text_AircraftSNo,#Text_ProductSNo, #ProductSNo, #AircraftSNo,#Text_AirportSNo, #AirportSNo').val('');
            $('#Text_AircraftSNo').data("kendoAutoComplete").enable(false);
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
            $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
            $('#Text_AirportSNo').data("kendoAutoComplete").enable(false);


        }
        //  alert('yes')
    }
    else {
        ResetDropDown();
        // alert('no')
    }
}
function onSelectProduct() {
    if ($("input[name='IsRoot']:checked").val() == '0') {
        if ($('#Text_ProductSNo').val() == "") {
            ResetDropDown();
        }
        else {
            // ResetDropDown();
            $('#Text_AircraftSNo,#Text_SPHCSNo, #SPHCSNo, #AircraftSNo, #Text_AirportSNo, #AirportSNo').val('');
            $('#Text_AircraftSNo').data("kendoAutoComplete").enable(false);
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
            $('#Text_SPHCSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AirportSNo').data("kendoAutoComplete").enable(false);
            //  $('#divMultiSPHCSNo').remove();

            cfi.AutoCompleteV2("SPHCSNo", "Code", "Master_CityConnectionTime_SPHC", onSelectSHC, "contains", ",");
            $('#divMultiSPHCSNo').remove();
        } // alert('yes')
    }
    else {
        ResetDropDown();
        //alert('no')
    }

}
// added by arman ali  Date 27 mar ,2017
function onSelectAirport() {
    if ($("input[name='IsRoot']:checked").val() == '0') {
        if ($('#Text_AirportSNo').val() == "") {
            // ResetDropDown();
        }
        else {
            // ResetDropDown();
            $('#Text_AircraftSNo,#Text_SPHCSNo, #SPHCSNo, #AircraftSNo,#Text_ProductSNo, #ProductSNo').val('');
            $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
            $('#Text_SPHCSNo').data("kendoAutoComplete").enable(false);
            $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
            cfi.AutoCompleteV2("SPHCSNo", "Code", "Master_CityConnectionTime_SPHC", onSelectSHC, "contains", ",");
            $('#divMultiSPHCSNo').remove();
        } // alert('yes')
    }
    else {
        //ResetDropDown();
        //alert('no')
    }
}
$("input[name='IsRoot']").change(function () {
    if ($('input:radio[name=IsRoot]:checked').val() == "1") {
        //  $("#divMultiSPHCSNo").remove()
        $('#Text_AircraftSNo').val('');
        $('#Text_ProductSNo').val('');
        $('#Text_SPHCSNo').val('');
        $('#Text_AirportSNo').val('');
        $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
        $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
        $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
        $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
        cfi.AutoCompleteV2("SPHCSNo", "Code", "Master_CityConnectionTime_SPHC", onSelectSHC, "contains", ",");
        $('#divMultiSPHCSNo').remove();
        //   $('#divMultiSPHCSNo').remove();
        //     $("#divMultiSlab").remove()
    }
    else if ($('input:radio[name=IsRoot]:checked').val() == "0") {
        cfi.ResetAutoComplete("AirlineCodeSNo");
        cfi.ResetAutoComplete("AirportSNo");
        cfi.ResetAutoComplete("AircraftSNo");
        cfi.ResetAutoComplete("ProductSNo");
        cfi.ResetAutoComplete("SPHCSNo");
        //$('#divMultiSPHCSNo').remove()
        $("div#divMultiSPHCSNo ul li").find("span[class$='k-delete']").closest('li').remove();
        $("div#divMultiSPHCSNo ul li:last-child").find('input[type="hidden"]').val('');
        $("div#divMultiSPHCSNo ul li:last-child").find('span').text('');
        $("#Text_SPHCSNo").closest('td').find("[id='SPHCSNo']").val('');
    }
});
function ResetDropDown() {
    $('#Text_AircraftSNo').data("kendoAutoComplete").enable(true);
    $('#Text_ProductSNo').data("kendoAutoComplete").enable(true);
    $('#Text_SPHCSNo').data("kendoAutoComplete").enable(true);
    $('#Text_AirportSNo').data("kendoAutoComplete").enable(true);
}
function Clear() {
    $('#divMultiSPHCSNo').remove();
    $("#ConnectionTimeHr").val('');
    $("#ConnectionTimeMin").val('');
    $("#Text_AircraftSNo").val('');
    $("#Text_AirportSNo").val('');
    $("Text_AirlineCodeSNo").val('');
    $("#Text_BasedOn").val('');
    $("#BasedOn").val('');
    $("#Text_ProductSNo").val('');
    $("#ProductSNo").val('');
    $("#Text_SPHCSNo").val('');
    $("#SPHCSNo").val('');
}

function CreateCityConnectionSlabGrid() {
    var table = "<table id='tblAppendGrid1'></table>";
    $("#tbl").after(table);
    var pageType = $('#hdnPageType').val();
    var dbtableName = "CommissionSlab";
    $("#tblAppendGrid1").appendGrid({
        tableID: "tblAppendGrid1",
        contentEditable: pageType != 'READ',
        masterTableSNo: $("#htmlkeysno").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Master/CityConnectionTimeService.svc",
        getRecordServiceMethod: "GetCityConnectionTransRecord",
        // deleteServiceMethod: "",
        caption: " Slab Information",

        initRows: 1,
        columns: [
            { name: "StartWeight", display: "Start Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 12, readonly: true, controltype: "default", onblur: "return CheckNumeric(this.id);" }, isRequired: true },
            { name: "EndWeight", display: "End Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: "default", onblur: "return CheckNumeric(this.id);" }, isRequired: true },
            { name: "GrossWtVariancePlus", display: "Gr Wt (+ve Variance)", type: 'text', ctrlAttr: { maxlength: 5, maxlength: 5, controltype: "default", onblur: "return CheckNumeric(this.id);" }, ctrlCss: { width: '75px', height: '20px' } },
            { name: "VoluemeWeightPlus", display: "Volume (+ve Variance)", type: 'text', ctrlAttr: { maxlength: 5, maxlength: 5, controltype: "default", onblur: "return CheckNumeric(this.id);" }, ctrlCss: { width: '75px', height: '20px' } },
            { name: "GrossWtVarianceminus", display: "Gr Wt (-ve Variance)", type: 'text', ctrlAttr: { maxlength: 5, maxlength: 5, controltype: "default", onblur: "return CheckNumeric(this.id);" }, ctrlCss: { width: '75px', height: '20px' } },
            { name: "VoluemeWeightminus", display: "Volume (-ve Variance)", type: 'text', ctrlAttr: { maxlength: 5, maxlength: 5, controltype: "default", onblur: "return CheckNumeric(this.id);" }, ctrlCss: { width: '75px', height: '20px' } }
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            if (parentRowIndex != null) {
                var parentValue = $("#tblAppendGrid1_EndWeight_" + addedRowIndex).val();
                //   $("#tblAppendGrid1_EndWeight_" + addedRowIndex).prop("readonly", true);
                $('[id^=tblAppendGrid1_EndWeight_]').each(function () {
                    $(this).prop("readonly", true);
                });
                var currentRowIndex = parseInt(addedRowIndex) + 1;
                $("#tblAppendGrid1_StartWeight_" + currentRowIndex).val(parseInt(parentValue) + 1);
                $("#tblAppendGrid1_StartWeight_" + currentRowIndex).prop("readonly", true);
                $("#tblAppendGrid1_EndWeight_" + currentRowIndex).prop("readonly", false);
            }
            else if (parentRowIndex == null) {

                if (addedRowIndex.length == 1) {
                    addedRowIndex = parseInt(addedRowIndex) + 1;
                    $("#tblAppendGrid1_EndWeight_" + addedRowIndex).prop("readonly", false);
                    $('[id^=tblAppendGrid1_StartWeight_]').each(function () {

                        //  alert('hii');
                        $(this).prop("readonly", false);
                        $(this).val("1");
                        //  $(this).prop("readonly", true);
                    });
                }

                if (addedRowIndex.length > 1) {
                    //$('[id^=tblAppendGrid1_EndWeight_]').each(function () {                   
                    //    $(this).prop("readonly", true);                 
                    //});



                    ///
                    var parentValue = $("#tblAppendGrid1_EndWeight_" + addedRowIndex.length).val();
                    $('[id^=tblAppendGrid1_EndWeight_]').each(function () {
                        $(this).prop("readonly", true);
                    });
                    var currentRowIndex = parseInt(addedRowIndex.length);
                    $("#tblAppendGrid1_StartWeight_" + currentRowIndex).val(parseInt(parentValue));
                    $("#tblAppendGrid1_StartWeight_" + currentRowIndex).prop("readonly", true);

                }
            }
        },
        afterRowRemoved: function (caller, rowIndex) {

            var parentValue = $("#tblAppendGrid1_EndWeight_" + rowIndex).val();
            $("#tblAppendGrid1_StartWeight_" + currentRowIndex + 1).prop("readonly", false);
            var currentRowIndex = parseInt(rowIndex) + 1;
            $("#tblAppendGrid1_StartWeight_" + currentRowIndex + 1).val(parseInt(parentValue) + 1);
            // $("#tblAppendGrid1_StartWeight_" + currentRowIndex).prop("readonly", true);

            //$("#tblAppendGrid1_EndWeight_" + rowIndex).prop("readonly", false);

        },
        beforeRowRemove: function (caller, rowIndex) {
            // return confirm('Are you sure to remove this row?');
        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {


            if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                $('#tblCommissionSlab_btnRemoveLast').remove();
                $('#tblCommissionSlab_btnAppendRow').remove();
            }
            // setdatevalue();
        },
        isPaging: true,
        hideButtons: {
            remove: true,
            removeLast: false,
            insert: true,
            append: false,
            update: true,
            updateAll: true
        },
        showButtons: { removeAll: true }
    });

}


function CheckValueValidation(input) {

    var CurrentRowVal = $("#" + input).val();
    var rowNo = input.split("_")[2];
    var previousRowVal = $("#tblRateBase_Rate_" + (parseInt(rowNo) - 1)).val();
    var nextRowVAl = $("#tblRateBase_Rate_" + (parseInt(rowNo) + 1)).val()
    //if (userContext.SysSetting.EnableSlabOnRate != "True") {
    if (parseFloat(CurrentRowVal) > parseFloat(previousRowVal) && rowNo >= 2) {
        ShowMessage('warning', 'warning - Rate', "Rate Cannot be greater than previous rate ", "bottom-right");
        // $("#tblRateBase_Rate_" + (parseInt(rowNo) - 1)).val('');
        $("#" + input).val("");
        $("#_temp" + input).val("");

    }
    else if (parseFloat(nextRowVAl) > parseFloat(CurrentRowVal) && rowNo != 1) {

        ShowMessage('warning', 'warning - Rate', "Rate Cannot be greater than previous rate ", "bottom-right");
        // $("#tblRateBase_Rate_" + (parseInt(rowNo) - 1)).val('');
        $("#tblRateBase_Rate_" + (parseInt(rowNo) + 1)).val("")
        $("#_temptblRateBase_Rate_" + (parseInt(rowNo) + 1)).val("")
    }

    //}


}

function CheckNumeric(obj) {
    var startValue = 0;
    var endValue = 0;

    //   alert(obj);
    if (obj.indexOf("Start") >= 0) {
        startValue = $("#" + obj).val();
        endValue = $("#" + obj.replace("Start", "End")).val();
        previousEndValue = $("#" + obj.replace("Start", "End").replace(obj.split("_")[2], obj.split("_")[2] - 1)).val();
    }
    else {
        endValue = $("#" + obj).val();
        startValue = $("#" + obj.replace("End", "Start")).val();
    }
    // alert(obj );
    if (parseFloat(startValue) > parseFloat(endValue)) {
        alert("Start Weight can not be greater than End Weight.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }
    if (parseFloat(endValue) == 0) {
        $("#" + obj).val("");

    }
    if ($.isNumeric($("#" + obj).val()) == false) {
        //  ShowMessage('warning', 'Warning -Commission!', "Numbers Only");
        $("#" + obj).val('');
        return false;
    }

}

function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineCodeSNo" || id == "Text_OtherAirlineAccess") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}

function SelectAirport() {
    var fA = getQueryStringValue("FormAction").toUpperCase();

    if ($("#Text_ConnectionTypeSNo").val() != 'undefined') {
        if (fA != "READ" && $("#Text_ConnectionTypeSNo").val().toUpperCase().indexOf('FLIGHT CLOSURE') > 0) {
            $('#AirportSNo').closest('td').prev('td').text('').append('<font color="red">*</font> <span id="spnAirportCodeSNo"> Airport Code</span>');
            $('#Text_AirportSNo').attr("data-valid", "required");
            $('#Text_AirportSNo').attr("data-valid-msg", "Airport Code cannot be blank");
            $('#Text_AirportSNo').css('border-color', '#94c0d2');
        }
        else {
            $('#Text_AirportSNo').removeAttr("data-valid");
            $('#Text_AirportSNo').removeAttr("data-valid-msg");
            $('#AirportSNo').closest('td').prev('td').text('').text('Airport Code')//
            $('#Text_AirportSNo').closest('span').css('border-color', '');
        }
    }


}
