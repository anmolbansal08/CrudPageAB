$(document).ready(function () {
    cfi.ValidateForm();
    // onselectType()
    if (userContext.SysSetting.ClientEnvironment == 'JT')
        var SearchTypeDataSource = [{ Key: "2", Text: "AWB" }, { Key: "3", Text: "ULD" }, { Key: "4", Text: "FLIGHT" }];
    else
        var SearchTypeDataSource = [{ Key: "1", Text: "ALL" }, { Key: "2", Text: "AWB" }, { Key: "3", Text: "ULD" }, { Key: "4", Text: "FLIGHT" }];
    cfi.AutoCompleteByDataSource("Type", SearchTypeDataSource, FnGetOriginAC, null);
    // $("<input type='button' class='btn btn-success' style='width:100px;' value='Search' name='Search' id='Search' onclick='search()' />");
    //    cfi.AutoCompleteByDataSource("Type", type, onselectType, null);
    cfi.AutoCompleteV2("TypeOf", "AWBNo", "UnclokedPage_AWBNo", null, "contains");
    cfi.AutoCompleteV2("LockedBy", "LockedBy", "UnclokedPage_LockedBy", null, "contains");
    // cfi.AutoComplete("TypeOf", null,null,null,null);
    $('[type="button"][value="Search"]').attr('disabled', false)
    $('[type="button"][value="Search"]').click(function () {
        BindUnLockedPage();
        //  $('[id*=tblUnLockedPage_UNLocked_]').val("Unlock");
        //   $('[id*=tblUnLockedPage_UNLocked_]').val("Unlock");
    });
    if (userContext.SysSetting.ClientEnvironment == 'JT') {
        $('#Text_Type').val('AWB');
        $('#Text').val('2');
        $("#Text_TypeOf").data("kendoAutoComplete").enable(false);
        $('#FlightDate').parent().hide();
        $("input[id='FlightDate']").val('');
    }
    else
        $('#Text_Type').val('ALL');
        $('#Text').val('1');
        $("#Text_TypeOf").data("kendoAutoComplete").enable(false);
        $('#FlightDate').parent().hide();
        $("input[id='FlightDate']").val('');


});



    function 
    onselectType() {

        cfi.ResetAutoComplete("AWB");

        if ($('#Text_Type').val() != "") {
            $("#Text_TypeOf").closest('.k-widget').show();
            $('#Text_TypeOf').removeAttr('data-valid');
            $('#Text_TypeOf').removeAttr('data-valid-msg');

    }
    if ($('#Text_Type').val() == 'AWB') {
        $('#Text_TypeOf').show();
        $('#Text_TypeOf').closest('span').show();
        $('#Text_TypeOf').val('');
        $('#FlightNo').hide();

        $('#spnTypeValue').text('AWB No.');
        $('#spnTypeValue').closest('td').attr('title', 'Select AWB Number');
        $('#Text_TypeOf').closest('span').css('width', '175px');
        $('#Text_TypeOf').attr('data-valid', 'required');
        $('#Text_TypeOf').attr('data-valid-msg', 'AWB Number can not be blank');
        //$("#Text_MovementType").attr("disabled", false);
        cfi.AutoCompleteV2("TypeOf", "AWBNo", "UnclokedPage_AWBNo1", null, null, "contains");


        // var data = GetDataSource("AWB", "vgetAWB", "SNO", "AWBNo", ["AWBNo"], null);
        // cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "AWBNo", "contains");
        //cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, true, Mblank, "key", "contains");
        //cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, Mblank, null);
    }
    else if ($('#Text_Type').val() == 'FLIGHT') {
        $('#spnTypeValue').text('Flight/Truck Date');
        $('#spnTypeValue').closest('td').attr('title', 'Select Flight/Truck Date');
        $('.k-datepicker').show();
        $('#FlightNo').show();
        $('#Text_TypeOf').show();
        $('#Text_TypeOf').closest('span').show();
        $('#Text_TypeOf').val('');
        $('#Text_TypeOf').attr('data-valid', 'required');
        $('#Text_TypeOf').attr('data-valid-msg', 'Flight/Truck Number can not be blank.');
        //  $('#Date').closest('span').css('width', '80px')
        $('#Text_TypeOf').closest('span').css('width', '120px');
        var data = GetDataSourceV2("TypeOf", "UnclokedPage_FlightNo1", null);
        cfi.ChangeAutoCompleteDataSource("TypeOf", data, true, null, "FlightNo", "contains");
        // cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, Mblank, null);
    }
    else if ($('#Text_Type').val() == 'ULD') {
        $('#Text_TypeOf').show();
        $('#Text_TypeOf').closest('span').show();
        $('#Text_TypeOf').val('');
        $('#spnTypeValue').text('ULD No.');
        $('#spnTypeValue').closest('td').attr('title', 'Select ULD Number');
        $('#FlightNo').hide();
        $('.k-datepicker').hide();
        $('#Text_TypeOf').attr('data-valid', 'required');
        $('#Text_TypeOf').attr('data-valid-msg', 'ULD Number can not be blank.');
        $('#Text_TypeOf').closest('span').css('width', '175px');
        var data = GetDataSourceV2("TypeOf", "UnclokedPage_uld_ULDNo", null);
        cfi.ChangeAutoCompleteDataSource("TypeOf", data, true, null, "ULDNo", "contains");
        //cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, Mblank, null);
}


}
var Model = [];
    function BindWhereCondition() {
        Model = {
            //model: {
                type: $("input[id='Text_Type']").val(),
                Typeof: $("input[id='Text_TypeOf']").val(),
                LockedBySNo: $("input[id='LockedBy']").val() || 0,
                FlightDate: $("input[id='FlightDate']").val()

        //}
    }
        return Model;
        }

        function BindUnLockedPage() {

    UnLockedPage = 'UnLockedPage';


    $('#tbl' + UnLockedPage).appendGrid({
            tableID: 'tbl' + UnLockedPage,
        V2: true,
        contentEditable: true,
        masterTableSNo: '1',
        currentPage: 1, itemsPerPage: 50, model: BindWhereCondition(), sort: '',

        //data: JSON.stringify(type:type),
            servicePath: '../Services/Master/UnLockedPageService.svc',
            getRecordServiceMethod: 'GetUnLockedPageRecord',

        deleteServiceMethod: '',
            caption: 'Unlock Process',
        initRows: 1,
        isGetRecord: true,


            columns: [
                //{ name: 'SNo', display: "SNo", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                      { name: "AWBNo", display: "AWB No ", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                      { name: "ULDNo", display: "ULD No ", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                      { name: "FLIGHTNo", display: "Flight Nbr ", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                      { name: "FlightDate", display: " Flight Date", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                      { name: "LockedProcessName", display: "Locked Process Name", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                //{ name: "IsLocked", display: "IsLocked", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                      { name: "LockedBy", display: "Locked By", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                      { name: "LockedOn", display: "Locked On", type: 'label', ctrlAttr: { controltype: 'label', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                //{ name: "LockedOn", display: "LockedOn", type: 'button', ctrlAttr: { controltype: 'default', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' } },
                      { name: "UNLocked", display: "Action", type: "button", value: "Update", ctrlCss: { width: '50px' }, ctrlAttr: { onclick: "return UnLockProcess(this.id);" } }
                //{ name: 'VolumeWt', display: 'Volume', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal2" }, ctrlCss: { width: '60px' }, isRequired: true },


    ],
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {



    },
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            $('[id*=tblUnLockedPage_UNLocked_]').val("Unlock");
    },
        isPaging: true,

            hideButtons: { updateAll: true, insert: true, remove: true, append: true, removeLast: true }
        });

            //$("tr[id^='tblUnLockedPage_Row']").each(function (row, tr) {

            //    $(tr).find("input[id^='tblUnLockedPage_UnLock']").attr(Text, "Unlock");


    //});
}



    ///========
    function FnGetOriginAC(input) {
        var Origin = $("#Text_Type").val().toUpperCase();
        if (Origin == "AWB") {
            $("#Text_TypeOf").data("kendoAutoComplete").enable(true);
            cfi.ResetAutoComplete("TypeOf");
            var dataSource = GetDataSourceV2("TypeOf", "UnclokedPage_AWBNo", null)
            cfi.ChangeAutoCompleteDataSource("TypeOf", dataSource, false, null, "AWBNo");
            $("#TypeOf").val('');
            $("#Text_TypeOf").val('')
            $('#FlightDate').parent().hide();
            $("input[id='FlightDate']").val('');


        }
    else if (Origin == "ULD") {
        $("#Text_TypeOf").data("kendoAutoComplete").enable(true);
        cfi.ResetAutoComplete("TypeOf");
        var dataSource = GetDataSourceV2("TypeOf", "UnclokedPage_ULDNo", null)
        cfi.ChangeAutoCompleteDataSource("TypeOf", dataSource, false, null, "ULDNo");
        $("#TypeOf").val('');
        $("#Text_TypeOf").val('')
        $('#FlightDate').parent().hide();
        $("input[id='FlightDate']").val('');


    }
    else if (Origin == "ALL") {
        $("#Text_TypeOf").data("kendoAutoComplete").enable(false);

        //$('#FlightDate').attr('disabled', 'disabled')
        $("#TypeOf").val('');
        $("#Text_TypeOf").val('')
        $('#FlightDate').parent().hide();
        $("input[id='FlightDate']").val('');

    }
    else if (Origin == "FLIGHT") {
        $('#FlightDate').parent().show();
        $("#Text_TypeOf").data("kendoAutoComplete").enable(true);
        cfi.ResetAutoComplete("TypeOf");
        var dataSource = GetDataSourceV2("TypeOf", "UnclokedPage_FlightNo", null)
        cfi.ChangeAutoCompleteDataSource("TypeOf", dataSource, false, null, "FlightNo");
        $("#TypeOf").val('');
        $("#Text_TypeOf").val('')
}

}


function UnLockProcess(obj) {


    //var a = 'tblUnLockedPage_UNLocked_1'
    var d = obj.split('tblUnLockedPage_UNLocked_')[1]

    var e = '#tblUnLockedPage_AWBNo_' + d
    var v = ($(e).text());


    //var a = obj.split('tblUnLockedPage_UNLocked_')[1]

    var b = '#tblUnLockedPage_ULDNo_' + d
    var c = ($(b).text());

    //var g = obj.split('tblUnLockedPage_UNLocked_')[1]

    var h = '#tblUnLockedPage_FLIGHTNo_' + d
    var i = ($(h).text());

    //var j = obj.split('tblUnLockedPage_UNLocked_')[1]

    var k = '#tblUnLockedPage_FlightDate_' + d
    var l = ($(k).text());






    $.ajax({
            url: "../../Services/Master/UnLockedPageService.svc/UpdateProcessGetLock",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ AWBNo: v, ULDNo: c, FlightNo: i, FlightDate: l }),
        // data: JSON.stringify({ AWBNo: v, ULDNo: c, FlightNo: i, FlightDate: l }),
        async: false,
        type: 'post',
        cache: false,
            success: function (result) {
            if (JSON.parse(result).Table0[0].Column1 == 0) {



                ShowMessage('success', 'Success - Unlocked Processed !', "Updated Successfully");
                BindUnLockedPage();

        }
    },
            error: function (err) {
            alert("Generated error" + err.status);
}
    });

}