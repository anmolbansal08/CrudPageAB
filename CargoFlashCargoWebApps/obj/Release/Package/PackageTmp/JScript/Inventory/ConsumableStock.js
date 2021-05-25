$(document).ready(function () {

    $("input[type='radio'][data-radioval='Self']").click();
    $('#ConsumablePrefix').closest('tr').hide();
    $('#ConsumableNoStart').closest('tr').hide();
  //  $('#NoOfItem').prop('readonly', true);
    //$("#NoOfItem").data("kendoAutoComplete").enable(false);
    $("#NoOfItem").attr("disabled", "disabled");
    $("#MasterSaveAndNew").hide();

    // cfi.AutoComplete("Sno", "Sno,Item", "VConsumableItem", "Sno", "Item", ["Item"], null, "contains");

    cfi.AutoComplete("ConsumableItem", "ConsumableItem", "VConsumableItem", "Sno", "ConsumableItem", ["ConsumableItem"], OnchangeConsumableItems, "contains");

    cfi.AutoComplete("City", "CityCode,CityName", "VCityForConsumableStock", "CitySNo", "CityCode", ["CityCode", "CityName"], OnchangeCity, "contains");

    //cfi.AutoComplete("Airport", "AirportCode", "VAirportForConsumableStock", "AirportSNo", "AirportName", ["AirportCode", "AirportName"], onchangeAirport, "contains");
    cfi.AutoComplete("Airport", "AirportCode,AirportName", "VAirportForConsumableStock", "AirportSNo", "AirportName", ["AirportCode", "AirportName"], onchangeAirport, "contains");

    cfi.AutoComplete("Office", "OfficeName", "VCityAirportOfficeForConsumableStock", "OfficeSno", "OfficeName", ["OfficeName"], onchangeOffice, "contains");

    //cfi.AutoComplete("Office", "OfficeName", "VOfficeForConsumable", "OfficeSno", "OfficeName", ["OfficeName"], onchangeOffice, "contains");

   // cfi.AutoComplete("Office", "SNo,Name", "VOfficeForConsumable", "SNo", "Name", null, onchangeOffice, "contains");

    cfi.AutoComplete("OwnerName", "SNo,Name", "VOwnerForConsumablestock", "SNo", "Name", null, onchangeOwner, "contains");


    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $('#Text_ConsumableItem').focus();
        $("#City").val(userContext.CitySNo);
        $("#Text_City").val(userContext.CityCode + '-' + userContext.CityName);
        $("#Airport").val(userContext.AirportSNo);
        $("#Text_Airport").val(userContext.AirportCode + '-' + userContext.AirportName);

        $.ajax({
            url: "./Services/Inventory/ConsumableService.svc/Getofficelist", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ OfficeSNo: userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#Office').val(resData[0].officeSNo);
                    $('#Text_Office').val(resData[0].officeName);
                }
            }
        });
        /*****************************************/



    }
    // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
    //BindConsumableStock();
  

    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $('#Text_ConsumableItem').focus();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == 'DELETE' || getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        $('.btn-info').hide();
        BindConsumableStockView();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        $('#MasterDuplicate').hide();
        $(".btn-danger").hide();

    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
        //$(".btn-success").attr("name", "updateBtn");
        //$(".btn-success").attr("type", "button");
        BindConsumableStockUpdate();
        $('#Text_City').focus();

        $('#__SpanHeader__').html($('#__SpanHeader__').text() + '' + $('#Text_ConsumableItem').text());
    }
    $('br:gt(1)').remove();

    //$("#NoOfItem").blur(function (e) {

    //    if ($("#NoOfItem").val() != '')
    //    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
    //        if ($('#ConsumableItem').val().split('-')[1] == '1') {
    //            $('#ConsumablePrefix').closest('tr').show();
    //            $('#ConsumableNoStart').closest('tr').show();

    //            $('#ConsumablePrefix').attr('data-valid', 'required');
    //            $('#ConsumablePrefix').attr('data-valid-msg', 'Consumable Prefix can not be blank or must have minimum 1 Character.');

    //            $('#ConsumableType').attr('data-valid', 'required');
    //            $('#ConsumableType').attr('data-valid-msg', 'Consumable Type can not be blank or must have minimum 1 Character.');

    //            $('#ConsumableNoStart').attr('data-valid', 'required');
    //            $('#ConsumableNoStart').attr('data-valid-msg', 'Consumable No can not be blank or must have minimum 1 Character.');


    //        } else {
    //            $('#ConsumablePrefix').closest('tr').hide();
    //            $('#ConsumableNoStart').closest('tr').hide();

    //            $('#ConsumablePrefix').removeAttr('data-valid');
    //            $('#ConsumablePrefix').removeAttr('data-valid-msg');

    //            $('#ConsumableType').removeAttr('data-valid');
    //            $('#ConsumableType').removeAttr('data-valid-msg');


    //            $('#ConsumableNoStart').removeAttr('data-valid');
    //            $('#ConsumableNoStart').removeAttr('data-valid-msg');
    //        }
    //    }
    //});

    $("#ConsumableNoStart11").blur(function (e) {

        //    tblConsumableStockTrans
        //if ($('#ConsumableNoStart').val() > $('#ConsumableNoEnd').val())
        //{
        //    ShowMessage('warning', 'Warning!', "Start value must be gater then end value.", "bottom-right");
        //    $('#ConsumableNoStart').val('');
        //    $('#ConsumableNoEnd').val('');
        //}
        var consumableSno = $('#ConsumableItem').val().split('-')[0];
        var citycode = $('#hdnCityCode').val();
        if ($('#ConsumableItem').val().split('-')[1] == '1') {
            if ($('#ConsumablePrefix').val() != '' && $('#ConsumableType').val() != '' && $('#ConsumableNoStart').val()) {
                BindConsumableStock();

                var item = $('#NoOfItem').val();
                var startrange = $('#ConsumableNoStart').val();
                var lstItem = [];
                var row = [];
                for (var i = 0; i < item; i++) {
                    var r = {
                        SNo: 0,
                        ConsumablePrefix: $('#ConsumablePrefix').val().toUpperCase(),
                        ConsumableType: $('#ConsumableType').val().toUpperCase(),
                        ConsumableNo: (parseInt(startrange) + i),
                        IsActive: "1",
                        noofitem: item,
                        CStockSno: consumableSno,
                        citycode: citycode
                    }
                    row.push(i + 1);
                    lstItem.push(r);
                    //  getUpdatedRowIndex(i + 1);
                }

                getUpdatedRowIndex(lstItem.join(','), "tblItemDetail");
                $("#tblItemDetail").appendGrid('load', JSON.parse(JSON.stringify(lstItem)));

                //var strdata;
                //var startrange = $('#ConsumableNoStart').val();
                //strdata = "<table class='appendGrid ui-widget' id='tblConsumableStockTrans'><thead class='ui-widget-header'><tr><td class='ui-widget-header'> </td><td class='ui-widget-header'>Consumable Prefix</td><td class='ui-widget-header'>Consumable Type</td><td class='ui-widget-header'>Consumable No</td></tr></thead><tbody class='ui-widget-content'>";

                //for (var i = 0; i < item; i++) {
                //    strdata = strdata + "<tr id='tblSPHCSubClass_Row_" + i + "'><td class='ui-widget-content' colspan='1'><td class='ui-widget-content' colspan='1'><input name='ConsumablePrefix_" + i + "' tabindex='1' class='k-input' id='ConsumablePrefix_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + $('#ConsumablePrefix').val() + "' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable Prefix can not be blank or must be 10 characters' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td class='ui-widget-content' colspan='1'><input name='ConsumableType_" + i + "' tabindex='1' class='k-input' id='ConsumableType_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + $('#ConsumableType').val() + "' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable Type can not be blank or must be 10 characters' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td class='ui-widget-content' colspan='1'><input name='ConsumableNo_" + i + "' tabindex='1' class='k-input' id='ConsumableNo_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + (parseInt(startrange) + i) + "' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable No can not be blank or must have minimum 1 Character' data-valid='required' allowchar='0123456789' autocomplete='off' readonly='readonly'></td></tr>";
                //}

                //strdata = strdata + "</tbody></table></div></td></tr></tbody></table></td></tr></table>";

                //$('#divItemDetail').html(strdata);
                //   $(".btn-success").hide();

                // $('#tblItemDetail_btnUpdateAll')[0].textContent = "Save";

            } else {
                ShowMessage('warning', 'Warning!', "Please Enter Consumables Detail .", "bottom-right");
            }

        }

        //else {
        //    $(".btn-success").show();
        //    $('#tblItemDetail').html('');
        //    $('#tblItemDetail_btnUpdateAll')[0].textContent = "Update";
        //}



    })

    //$(".btn-danger").click(function (e) {
    //    if (getQueryStringValue("FormAction").toUpperCase() == 'DELETE') {

    //        $.ajax({
    //            url: "./Services/Inventory/ConsumableStockService.svc/DeleteConsumableStock",
    //            async: false, type: "POST", dataType: "json", cache: false,
    //            data: JSON.stringify({ consumableStockSno: $('#hdnCStockSno').val() }),
    //            contentType: "application/json; charset=utf-8",

    //            success: function (response) {
    //                if (response.length > 0)
    //                {
    //                    ShowMessage('warning', 'Warning!', "Can Not Delete Stock Already Issued.", "bottom-right");
    //                    return false;
                        
    //                } else {
    //                    navigateUrl('Default.cshtml?Module=Inventory&Apps=ConsumableStock&FormAction=INDEXVIEW');
    //                }
    //            },
    //            error: function (er) {
    //                //debugger
    //            }
    //        });
    //    }
    //    cfi.ValidateForm();

       
    //});

    

    $("input[name=Owner]:radio").click(function () {

        cfi.ResetAutoComplete("OwnerName");
        cfi.ResetAutoComplete("ConsumableItem");
        if ($(this).attr("value") == "0") {
        //    var data = GetDataSource("OwnerName", "Account", "SNo", "Name", ["Name"], null);
        //    cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "Name", "contains");

            $('#Text_OwnerName').attr('data-valid', 'required');
            $('#Text_OwnerName').attr('data-valid-msg', 'Enter Agent.');
            $('#spnOwnerName').parent().find('font').html('*');
            $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
            // cfi.ResetAutoComplete("BasisOfChargeSNo");

        }
       else if ($(this).attr("value") == "1") {
        //    var data = GetDataSource("OwnerName", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
        //    cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "AirlineName", "contains");

            $('#Text_OwnerName').attr('data-valid', 'required');
            $('#Text_OwnerName').attr('data-valid-msg', 'Enter Airline.');
            $('#spnOwnerName').parent().find('font').html('*');
            $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
            //  cfi.ResetAutoComplete("BasisOfChargeSNo");

        } else {
            $('#Text_OwnerName').removeAttr("data-valid");
            $('#Text_OwnerName').removeAttr("data-valid-msg");


            $('#Text_OwnerName').removeClass("valid_invalid");
            $('#spnOwnerName').parent().find('font').html(' ');
            $("#Text_OwnerName").data("kendoAutoComplete").enable(false);

            cfi.ResetAutoComplete("OwnerName");
            $('#OwnerName').closest('td').find('span').find('.k-state-disabled').removeAttr('style');
        }
    });

    $(".btn-success").click(function (e) {

       
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW' || getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {

            if (!cfi.IsValidForm()) {
                return false;
            }     

            var noofitem = $('#NoOfItem').val();
            var citycode = $('#hdnCityCode').val(); 
            var consumableSno = $('#ConsumableItem').val().split('-')[0];
            var citysno = $('#City').val();
            var airport = $('#Airport').val();
            var office = $('#Office').val();
            var owner = $("input[type='radio'][name='Owner']:checked").val();
             var ownersno = $('#OwnerName').val()==''?'0': $('#OwnerName').val();
        
        }
   


        if ($('#ConsumableItem').val().split('-')[1] == "1") {
        
            var consumablePrefix=$('#ConsumablePrefix').val();
            var consumableType=$('#ConsumableType').val();
            var consumableNo = $('#ConsumableNoStart').val();
            var tareWeight = $('#TareWeight').val();
            var isActive = 0;
            var consumableStockTransSno = $('#hdnCStockTransSno').val();
            var equipmentNbr = $('#EquipmentNbr').val();
        } else {
        
            var consumablePrefix = '';
            var consumableType = '';
            var consumableNo = 0;
            var tareWeight = $('#TareWeight').val();
            var isActive = $('input[name=IsActive]:checked').val();
            var consumableStockTransSno = $('#hdnCStockTransSno').val();
            var equipmentNbr = $('#EquipmentNbr').val();
        }
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            $.ajax({
                url: "./Services/Inventory/ConsumableStockService.svc/SaveConsumableStock",
                async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ ConsumablePrefix: consumablePrefix, ConsumableType: consumableType, ConsumableNo: consumableNo, ConsumableSno: consumableSno, CityCode: citycode, NoOfItems: noofitem, TareWeight: tareWeight, CitySno: citysno, Airport: airport, Office: office, Owner: owner, OwnerSno: ownersno }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    //if (data[0].indexOf('Stock series already exists') != -1) {

                    //    ShowMessage('error', 'Need your Kind Attention!', data[0]);
                    //    return false;
                    //}

                    if (eval(data) == 0) {

                        navigateUrl('Default.cshtml?Module=Inventory&Apps=ConsumableStock&FormAction=INDEXVIEW');
                    }
                    else {
                        ShowMessage('warning', 'Warning!', data[0], "bottom-right");
                        //ShowMessage('error', 'Need your Kind Attention!', data[0]);
                        e.preventDefault();
                        //return false;
                       
                    }
                }
            });
        }
        else if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
            $.ajax({
                url: "./Services/Inventory/ConsumableStockService.svc/UpdateConsumableStock",
                async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ ConsumableStockTransSno: consumableStockTransSno, ConsumableSno: 0,TareWeight: tareWeight, IsActive: isActive,EquipmentNbr:equipmentNbr }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (0 == 0) {
                        // window.location = 'Default.cshtml?Module=Inventory&Apps=ConsumableStock&FormAction=INDEXVIEW';
                        navigateUrl('Default.cshtml?Module=Inventory&Apps=ConsumableStock&FormAction=INDEXVIEW');
                    }
                    else {
                        ShowMessage('error', 'Need your Kind Attention!', 'Consumable Stock Error.');

                    }
                }
            });

        }



    });
    cfi.ValidateForm();

    $("#NoOfItem").keyup(function () {
        if ($("#NoOfItem").val() == 0)
        {
            $("#NoOfItem").val('');
            return false;
        }
    });

    $("#ConsumableNoStart").keyup(function () {
        if ($("#ConsumableNoStart").val() == 0) {
            $("#ConsumableNoStart").val('');
            return false;
        }
    });
    
   ResetOwner();
});



function ResetOwner() {
    cfi.ResetAutoComplete("OwnerName");
    if ($("input[type='radio'][name='Owner']:checked").val() == "0") {
        //    var data = GetDataSource("OwnerName", "Account", "SNo", "Name", ["Name"], null);
        //    cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "Name", "contains");

        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Agent.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        // cfi.ResetAutoComplete("BasisOfChargeSNo");

    }
    else if ($("input[type='radio'][name='Owner']:checked").val() == "1") {
        //    var data = GetDataSource("OwnerName", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
        //    cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "AirlineName", "contains");

        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Airline.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        //  cfi.ResetAutoComplete("BasisOfChargeSNo");

    } else {
        $('#Text_OwnerName').removeAttr("data-valid");
        $('#Text_OwnerName').removeAttr("data-valid-msg");


        $('#Text_OwnerName').removeClass("valid_invalid");
        $('#spnOwnerName').parent().find('font').html('');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(false);

        cfi.ResetAutoComplete("OwnerName");
        $('#OwnerName').closest('td').find('span').find('.k-state-disabled').removeAttr('style');
    }
}

function BindConsumableStock() {

    var PageType = getQueryStringValue("FormAction").toUpperCase();

    var citycode = $('#hdnCityCode').val();
    var consumableSno = $('#ConsumableItem').val().split('-')[0];

    var ConsumableStock = "ItemDetail";
    $('#tbl' + ConsumableStock).appendGrid({
        tableID: 'tbl' + ConsumableStock,
        contentEditable: (PageType == "READ" || PageType == "DELETE" ? false : true),
        // contentEditable: false,
        // tableColumns: 'SNo,CFTNumber,MawbNo,TotalPcs,TotalGrossWt,TotalCBM,NoOfBUP,ShipmentType,ForwarderName,AirlineName,IsSecure,Origin,SPHCSNo,FlightNo,Origin,Destination,FlightNo,CarrierCode',
        isGetRecord: false,
        masterTableSNo: consumableSno,
        currentPage: 1, itemsPerPage: 10, whereCondition: '', sort: '',
        servicePath: './Services/Inventory/ConsumableStockService.svc',
        getRecordServiceMethod: null,
        createUpdateServiceMethod: 'createUpdateConsumableStock',
        deleteServiceMethod: 'deletetblConsumableStock',
        caption: "Consumable Stock",
        initRows: 1,
        rowNumColumnName: 'SNo',

        columns: [{ name: 'SNo', type: 'hidden' },
                  { name: 'ConsumablePrefix', display: 'Consumable Prefix', type: 'label' },
                  { name: 'ConsumableType', display: 'Consumable Type', type: 'label' },
                  { name: 'ConsumableNo', display: 'Consumable No.', type: 'label' },
                   { name: 'ConsumablePrefix', type: 'hidden' },
                  { name: 'ConsumableType', type: 'hidden' },
                  { name: 'ConsumableNo', type: 'hidden' },
               { name: 'IsActive', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
               { name: 'noofitem', type: 'hidden' },
                { name: 'CStockSno', type: 'hidden' },
                 { name: 'citycode', type: 'hidden' },

        ],

        //  hideButtons: { remove: true, removeLast: true },
        hideButtons: { append: true, remove: true, removeLast: true, updateAll: true, insert: true },

        isPaging: true
    });
    //$("#btnBack").hide();
    // $('#tblItemDetail_btnAppendRow').hide();
}

function BindConsumableStockView() {
    var CStockSno = $('#hdnCStockSno').val();
    var CstockTransSno = $('#hdnCStockTransSno').val() == undefined ? 0 : $('#hdnCStockTransSno').val();

    $.ajax({
        url: "./Services/Inventory/ConsumableStockService.svc/GetConsumableStockRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: { recid: CStockSno, UserID: 0 },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            var myData = jQuery.parseJSON(result); 
            if (myData.Table0.length > 0) {
                $('#divAwbHeaderDetail').show();

             //   $('#ConsumableItem').textContent = myData.Table0[0].Item;
             ///   $('#ConsumableItem').html(myData.Table0[0].Item);
                $('#ConsumableName').textContent = myData.Table0[0].Item;
                $('#ConsumableName').html(myData.Table0[0].Item);
              //  $('#Text_NoOfItem').html(myData.Table0[0].NoOfItems);
                $('#NoOfItem').html(myData.Table0[0].NoOfItems);
                $('#TareWeight').html(myData.Table0[0].TareWeight);
                $('#EquipmentNbr').html(myData.Table0[0].EquipmentNbr);               

                //$('#Text_City').html(myData.Table0[0].CityName);
                //$('#City').val(myData.Table0[0].CitySno);

                //$('#Text_Airport').html(myData.Table0[0].AirportName);
                //$('#Airport').val(myData.Table0[0].Airport);

                //$('#Text_Office').html(myData.Table0[0].OFFICENAME);
                //$('#Office').val(myData.Table0[0].Office);

                //$('#Text_Owner').html(myData.Table0[0].TEXT_OWNER);
                //$('#Owner').val(myData.Table0[0].Owner);

                //$('#Text_OwnerName').html(myData.Table0[0].TEXT_OWNERSNO);
                //$('#OwnerName').val(myData.Table0[0].OwnerSno);
                
                

                //$("[type=radio][id='IsActive']:checked").removeAttr("checked");
                //$("[type=radio][id='IsActive'][value=" + (myData.Table0[0].IsActive == 'True' ? 1 : 0) + "]").attr("checked", "checked");

              //  $('#IsActive').val(myData.Table0[0].IsActive);


                //$('#Destination').html(myData.Table0[0].DestinationAirportCode);
                //$('#Pieces').html(myData.Table0[0].TotalPieces);
                //$('#GrossWt').html(myData.Table0[0].TotalGrossWeight);
                //$('#VolumeWt').html(myData.Table0[0].TotalVolumeWeight);
                //$('#AWBNo').html(myData.Table0[0].AWBNo);

            }

            //if (myData.Table1.length > 0) {
            //    BindConsumableStock();
            //    var item = $('#NoOfItem').val();
            //    var startrange = $('#ConsumableNoStart').val();
            //    var lstItem = [];
            //    for (var i = 0; i < myData.Table1.length; i++) {
            //        var r = {
            //            SNo: myData.Table1[i].SNo,
            //            ConsumablePrefix: myData.Table1[i].ConsumablePrefix.toUpperCase(),
            //            ConsumableType: myData.Table1[i].ConsumableType.toUpperCase(),
            //            ConsumableNo: myData.Table1[i].ConsumableNo,
            //            IsActive: (myData.Table1[i].ISActive == "True" ? "YES" : "NO"),
            //            noofitem: myData.Table0[0].NoOfItems,
            //            CStockSno: $('#hdnCStockSno').val(),
            //            citycode: 0
            //        }

            //        lstItem.push(r);

            //    }


            //    $("#tblItemDetail").appendGrid('load', JSON.parse(JSON.stringify(lstItem)));

            //    //var strdata;

            //    //strdata = "<table class='appendGrid ui-widget' id='tblConsumableStockTrans'><thead class='ui-widget-header'><tr><td class='ui-widget-header'>Consumable Prefix</td><td class='ui-widget-header'>Consumable Type</td><td class='ui-widget-header'>Consumable No</td><td class='ui-widget-header'>Is InActive</td></tr></thead><tbody class='ui-widget-content'>";

            //    //for (var i = 0; i < myData.Table1.length; i++) {


            //    //    strdata = strdata + "<tr id='tblSPHCSubClass_Row_" + i + "'><td class='ui-widget-content' colspan='1'><input name='ConsumablePrefix_" + i + "' tabindex='1' class='k-input' id='ConsumablePrefix_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + myData.Table1[i].ConsumablePrefix + "' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable Prefix can not be blank or must be 10 characters' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td class='ui-widget-content' colspan='1'><input name='ConsumableType_" + i + "' tabindex='1' class='k-input' id='ConsumableType_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + myData.Table1[i].ConsumableType + "' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable Type can not be blank or must be 10 characters' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td class='ui-widget-content' colspan='1'><input name='ConsumableNo_" + i + "' tabindex='1' class='k-input' id='ConsumableNo_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + myData.Table1[i].ConsumableNo + "'  data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable No can not be blank or must have minimum 1 Character' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td class='ui-widget-content' colspan='1'>";
            //    //    if (myData.Table1[i].ISActive == 'True') {
            //    //        strdata = strdata + "<input name='chkselectISActive_" + i + "' id='chkselectISActive_" + i + "' type='checkbox'  checked='checked'  value='" + myData.Table1[i].ISActive + "' >";
            //    //    }else
            //    //        strdata = strdata + "<input name='chkselectISActive_" + i + "' id='chkselectISActive_" + i + "' type='checkbox'   value='" + myData.Table1[i].ISActive + "' >";
            //    //    strdata = strdata + "</td></tr>";


            //    //}

            //    //strdata = strdata + "</tbody></table></div></td></tr></tbody></table></td></tr></table>";

            //    //$('#divItemDetail').html(strdata);
            //    //    $(".btn-success").hide();
            //}
            // else { $(".btn-success").show(); }
            return false
        }
    });
}

function BindConsumableStockUpdate() {

    var cStockSno = $('#hdnCStockSno').val();
    var consumableStockTransSno = $('#hdnCStockTransSno').val();

    $.ajax({
        url: "./Services/Inventory/ConsumableStockService.svc/GetConsumableStockRecord",
        async: false,
        type: "GET",
        dataType: "json",
        //data: { recid: CStockSno },
        data: { recid: cStockSno, UserID: 0,ConsumableStockTransSno:consumableStockTransSno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            var myData = jQuery.parseJSON(result);

            if (myData.Table0.length > 0) {
                $('#divAwbHeaderDetail').show();
                if (myData.Table0[0].Numbered == 'True') {
                    $('#Text_ConsumableItem').html(myData.Table0[0].Item);
                    $('#ConsumableItem').val(myData.Table0[0].Sno + "-" + myData.Table0[0].Numbered);
                    $('#Text_ConsumableName').html(myData.Table0[0].ConsumablesName);
                    $('#ConsumableName').val(myData.Table0[0].SNo);
                    $('#Text_NoOfItem').html(myData.Table0[0].NoOfItems);
                    $('#NoOfItem').val(myData.Table0[0].NoOfItems);
                    $('#_tempTareWeight').val(myData.Table0[0].TareWeight);
                    $('#TareWeight').val(myData.Table0[0].TareWeight);

                    $('#_tempEquipmentNbr').val(myData.Table0[0].EquipmentNbr);
                    $('#EquipmentNbr').val(myData.Table0[0].EquipmentNbr);

                    $('#ConsumableName').closest('tr').show();
                    $('#IsActive').closest('tr').show();


                    $('#Text_City').html(myData.Table0[0].CityName);
                    $('#City').val(myData.Table0[0].CitySno);

                    $('#Text_Airport').html(myData.Table0[0].AirportName);
                    $('#Airport').val(myData.Table0[0].Airport);

                    $('#Text_Office').html(myData.Table0[0].OFFICENAME);
                    $('#Office').val(myData.Table0[0].Office);

                    $('#Text_Owner').html(myData.Table0[0].TEXT_OWNER);
                    $('#Owner').val(myData.Table0[0].Owner);

                    $('#Text_OwnerName').html(myData.Table0[0].TEXT_OWNERSNO);
                    $('#OwnerName').val(myData.Table0[0].OwnerSno);


                    $("[type=radio][id='IsActive']:checked").removeAttr("checked");
                    $("[type=radio][id='IsActive'][value=" + (myData.Table0[0].IsActive=='True'?1:0) + "]").attr("checked", "checked");
                   

                    $('#ISActive').val(myData.Table0[0].IsActive);
                } else {

                    $('#Text_ConsumableItem').html(myData.Table0[0].Item);
                    $('#ConsumableItem').val(myData.Table0[0].Sno + "-" + myData.Table0[0].Numbered);
                    $('#Text_NoOfItem').html(myData.Table0[0].NoOfItems);
                    $('#NoOfItem').val(myData.Table0[0].NoOfItems);
                    $('#Text_City').html(myData.Table0[0].CityName);
                    $('#City').val(myData.Table0[0].CitySno);
                    $('#Text_Office').html(myData.Table0[0].OFFICENAME);
                    $('#Office').val(myData.Table0[0].Office);
                    $('#Text_Airport').html(myData.Table0[0].AirportName);
                    $('#Airport').val(myData.Table0[0].Airport);
                    $('#Text_Owner').html(myData.Table0[0].TEXT_OWNER);
                    $('#Owner').val(myData.Table0[0].Owner);

                    $('#Text_OwnerName').html(myData.Table0[0].TEXT_OWNERSNO);
                    $('#OwnerName').val(myData.Table0[0].OwnerSno);
                    $('#ConsumableName').closest('tr').hide();
                    $('#IsActive').closest('tr').hide();
                }
                if (myData.Table0[0].Type == 'False') {
                    $('#spnEquipment').show();
                    $('#EquipmentNbr').show();
                }else {
                    $('#spnEquipment').hide();
                    $('#EquipmentNbr').hide();
                }  

            }

            //if (myData.Table1.length > 0) {
            //    BindConsumableStock();
            //    var item = $('#NoOfItem').val();
            //    var startrange = $('#ConsumableNoStart').val();
            //    var lstItem = [];
            //    for (var i = 0; i < myData.Table1.length; i++) {
            //        var r = {
            //            SNo: myData.Table1[i].SNo,
            //            ConsumablePrefix: myData.Table1[i].ConsumablePrefix.toUpperCase(),
            //            ConsumableType: myData.Table1[i].ConsumableType.toUpperCase(),
            //            ConsumableNo: myData.Table1[i].ConsumableNo,
            //            IsActive: (myData.Table1[i].ISActive == "True" ? 1 : 0),
            //            noofitem: myData.Table0[0].NoOfItems,
            //            CStockSno: cStockSno,
            //            citycode: 0
            //        }

            //        lstItem.push(r);

            //    }


            //    $("#tblItemDetail").appendGrid('load', JSON.parse(JSON.stringify(lstItem)));

            //    //var strdata;

            //    //strdata = "<table class='appendGrid ui-widget' id='tblConsumableStockTrans'><thead class='ui-widget-header'><tr><td class='ui-widget-header'>Consumable Prefix</td><td class='ui-widget-header'>Consumable Type</td><td class='ui-widget-header'>Consumable No</td><td class='ui-widget-header'>Is InActive</td></tr></thead><tbody class='ui-widget-content'>";

            //    //for (var i = 0; i < myData.Table1.length; i++) {


            //    //    strdata = strdata + "<tr id='tblSPHCSubClass_Row_" + i + "'><td class='ui-widget-content' colspan='1'><input name='ConsumablePrefix_" + i + "' tabindex='1' class='k-input' id='ConsumablePrefix_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + myData.Table1[i].ConsumablePrefix + "' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable Prefix can not be blank or must be 10 characters' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td class='ui-widget-content' colspan='1'><input name='ConsumableType_" + i + "' tabindex='1' class='k-input' id='ConsumableType_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + myData.Table1[i].ConsumableType + "' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable Type can not be blank or must be 10 characters' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td class='ui-widget-content' colspan='1'><input name='ConsumableNo_" + i + "' tabindex='1' class='k-input' id='ConsumableNo_" + i + "' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='" + myData.Table1[i].ConsumableNo + "'  data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable No can not be blank or must have minimum 1 Character' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td class='ui-widget-content' colspan='1'>";
            //    //    if (myData.Table1[i].ISActive == 'True') {
            //    //        strdata = strdata + "<input name='chkselectISActive_" + i + "' id='chkselectISActive_" + i + "' type='checkbox'  checked='checked'  value='" + myData.Table1[i].ISActive + "' >";
            //    //    }else
            //    //        strdata = strdata + "<input name='chkselectISActive_" + i + "' id='chkselectISActive_" + i + "' type='checkbox'   value='" + myData.Table1[i].ISActive + "' >";
            //    //    strdata = strdata + "</td></tr>";


            //    //}

            //    //strdata = strdata + "</tbody></table></div></td></tr></tbody></table></td></tr></table>";

            //    //$('#divItemDetail').html(strdata);
            //    //    $(".btn-success").hide();
            //}
            //else {
            //  //  $(".btn-success").show();
            //}
            return false
        }
    });

}

function OnchangeConsumableItems() {
    if ($('#ConsumableItem').val() != null) {
        $('#_tempTareWeight').val($('#ConsumableItem').val().split('-')[2]);
        $('#TareWeight').val($('#ConsumableItem').val().split('-')[2]);
        $("#ConsumablePrefix").val('');    
        $('#_tempConsumableNoStart').val('');
        $('#ConsumableNoStart').val('');
        $('#ConsumableType').val('');
        // $('#NoOfItem').prop('readonly', true);
        //$("#_tempNoOfItem").data("kendoAutoComplete").enable(false);
//$("#_tempNoOfItem").attr("disabled", "disabled");
        // $("#NoOfItem").attr("disabled", "disabled");
        $("#NoOfItem").removeAttr("disabled");
        //var txtbox = document.getElementById('txtOne');
        //Remove all white spaces from textbox using the regex
       // txtbox.value = txtbox.value.replace(/\s/g, "");
            if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
                if ($('#ConsumableItem').val().split('-')[1] == '1') {
                    $('#ConsumablePrefix').closest('tr').show();
                    $('#ConsumableNoStart').closest('tr').show();

                    $('#ConsumablePrefix').attr('data-valid', 'required');
                    $('#ConsumablePrefix').attr('data-valid-msg', 'Consumable Prefix can not be blank or must have minimum 1 Character.');

                    $('#ConsumableType').attr('data-valid', 'required');
                    $('#ConsumableType').attr('data-valid-msg', 'Consumable Type can not be blank or must have minimum 1 Character.');

                    $('#ConsumableNoStart').attr('data-valid', 'required');
                    $('#ConsumableNoStart').attr('data-valid-msg', 'Consumable No can not be blank or must have minimum 1 Character.');


                } else {
                    $('#ConsumablePrefix').closest('tr').hide();
                    $('#ConsumableNoStart').closest('tr').hide();

                    $('#ConsumablePrefix').removeAttr('data-valid');
                    $('#ConsumablePrefix').removeAttr('data-valid-msg');

                    $('#ConsumableType').removeAttr('data-valid');
                    $('#ConsumableType').removeAttr('data-valid-msg');


                    $('#ConsumableNoStart').removeAttr('data-valid');
                    $('#ConsumableNoStart').removeAttr('data-valid-msg');
                }
            }
    }
}
//function OnchangeCity() {
  //  cfi.ResetAutoComplete("Airport");
    //cfi.ResetAutoComplete("Office");
    //cfi.ResetAutoComplete("OwnerName");
    //cfi.ResetAutoComplete("ConsumableItem");
   
//}

function onchangeAirport()
{
    cfi.ResetAutoComplete("OwnerName");
    cfi.ResetAutoComplete("ConsumableItem");
}

function onchangeOffice() {
    cfi.ResetAutoComplete("OwnerName");
    cfi.ResetAutoComplete("ConsumableItem");
}

function onchangeOwner()
{
    cfi.ResetAutoComplete("ConsumableItem");
    $("#ConsumablePrefix").val('');
    $('#_tempConsumableNoStart').val('');
    $('#ConsumableNoStart').val('');
    $('#ConsumableType').val('');
}

function ExtraCondition(textId) {
    var filterAirport = cfi.getFilter("AND");

    if (textId == "Text_Airport") {
        cfi.setFilter(filterAirport, "CitySno", "eq", $("#City").val())
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
        return CurrencyAutoCompleteFilter;
    }

    if (textId == "Text_Office") {
        cfi.setFilter(filterAirport, "CitySno", "eq", $("#City").val())
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
        return CurrencyAutoCompleteFilter;
    }



    if (textId == "Text_OwnerName") {

        var valll = $("input[type='radio'][name='Owner']:checked").val(); 

        cfi.setFilter(filterAirport, "Owner", "eq", valll);

        cfi.setFilter(filterAirport, "CitySno", "eq", $('#City').val());

        cfi.setFilter(filterAirport, "officeSno", "eq", $('#Office').val());


        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
        return CurrencyAutoCompleteFilter;
    }


    if (textId == "Text_ConsumableItem") {

        var valll = $("input[type='radio'][name='Owner']:checked").val();

        cfi.setFilter(filterAirport, "Owner", "eq", valll);     

        cfi.setFilter(filterAirport, "OwnerSno", "eq", $('#OwnerName').val());
        cfi.setFilter(filterAirport, "CitySno", "eq", $('#City').val());

        cfi.setFilter(filterAirport, "officeSno", "eq", $('#Office').val());


        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
        return CurrencyAutoCompleteFilter;
    }
    
}


function ShowEditRead() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);

                if ($(this).find("td")[4].innerText == "YES" || $(this).find("td")[4].innerText == "Yes") {

                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "READ") {
                            $(this).closest("a").css("display", "none");
                        }

                        if ($(this).text().toUpperCase() == "EDIT") {
                            $(this).closest("a").css("display", "block");
                        }
                    });

                } else {

                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "READ") {
                            $(this).closest("a").css("display", "block");
                        }
                        if ($(this).text().toUpperCase() == "EDIT") {
                            $(this).closest("a").css("display", "none");
                        }
                    });

                }

            }
        });
    });



}



function OnchangeCity() {

    cfi.ResetAutoComplete("ConsumableItem");
    try {
        $.ajax({
            url: "./Services/Inventory/ConsumableService.svc/GetAirportOfficeInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CitySNo: $("#City").val() == undefined ? "" : $("#City").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#Airport').val(resData[0].AirportSNo);
                    $('#Text_Airport').val(resData[0].AirportName);
                    $('#Office').val(resData[0].OfficeSNo);
                    $('#Text_Office').val(resData[0].OfficeName);

                }
                else {
                    $('#Office').val("");
                    $('#Text_Office').val("");
                    $('#Airport').val("");
                    $('#Text_Airport').val("");
                }
            }
        });
    }
    catch (exp) { }
}

