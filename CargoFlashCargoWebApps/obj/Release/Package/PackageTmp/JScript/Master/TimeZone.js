var elemdup;
var mnth = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
$(document).ready(function () {
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if ($('.btn-info').val() == "Edit") {
            $('.btn-info').css('display', 'none');
        }
    }
    CreateTimeZonetrans
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $('.btn-success').hide();

        CreateTimeZonetrans();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW") {
       
            $('.btn-info').css('display', 'none');
        
    }
    
    else {
        cfi.AutoComplete("Prefix", "prefixText", "PrefixType", "prefixValue", "prefixText", ["prefixText"], null, "contains");
        //cfi.AutoCompleteByDataSource("Prefix", PrefixType);
        if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            $("#ZoneName").val('');
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            // commmented by purushottam kumar 
            //$("#ValidFrom").val('');
            //$("#ValidTo").val('');
            // Change by purushottam kumar 
            $('#ValidFrom').data("kendoDatePicker").value(null);
            $('#ValidTo').data("kendoDatePicker").value(null);
        }
        //apGrid = $("[id='areaTrans_Master_TimeZoneTrans']").EnableMultiField({
        //    addEventCallback: function (elem) {
        //        //$(elem).find("input[id^='Prefix']").each(function () {
        //        //    cfi.AutoCompleteByDataSource($(this).attr("name"), PrefixType);
        //        //});
        //        $(elem).find("input[id^='Prefix']").each(function () {
        //            cfi.AutoComplete($(this).attr("name"), "prefixText", "PrefixType", "prefixValue", "prefixText", ["prefixText"], null, "contains");
        //        });
        //        $(elem).find("input[id^='Valid']").each(function () {
        //            $(this).val('');
        //        });
        //        $("input[id^='ValidFrom']").each(function () {
        //            $(this).attr('readOnly', 'readOnly');
        //            $(this).attr('style', 'width: 90px');
        //        });
        //        $("input[id^='ValidTo']").each(function () {
        //            $(this).attr('readOnly', 'readOnly');
        //            $(this).attr('style', 'width: 90px');
        //        });
        //        $(elem).find("input[id^='ValidFrom']").change(function () {
        //            var ret = CheckDuplicateDATE(this.id, (this.id.split('_').length > 1 ? 'ValidTo_' + this.id.split('_')[1] : 'ValidTo'));
        //            if (ret == false) {
        //                $('#' + this.id).val('');
        //                $(this.id).attr('readOnly', 'readOnly');
        //                return false;
        //            }
        //        });
        //        $(elem).find("input[id^='ValidTo']").change(function () {
        //            var ret1 = CheckDuplicateDATE((this.id.split('_').length > 1 ? 'ValidFrom_' + this.id.split('_')[1] : 'ValidFrom'), this.id);
        //            if (ret1 == false) {
        //                $('#' + this.id).val('');
        //                $(this.id).attr('readOnly', 'readOnly');
        //                return false
        //            }
        //        });
        //        $('.k-datepicker').each(function () {
        //            $(this).removeClass('k-input');
        //        });
        //    },//BindAutoCompleteForPrefix
        //    removeEventCallback: function (elem) {
        //        $("input[id^='ValidFrom']").each(function () {
        //            $(this).attr('readOnly', 'readOnly');
        //        });
        //        $("input[id^='ValidTo']").each(function () {
        //            $(this).attr('readOnly', 'readOnly');
        //        });
        //        $(elem).find("input[id^='ValidFrom']").change(function () {
        //            var ret = CheckDuplicateDATE(this.id, (this.id.split('_').length > 1 ? 'ValidTo_' + this.id.split('_')[1] : 'ValidTo'));
        //            if (ret == false) {
        //                $('#' + this.id).val('');
        //                $(this.id).attr('readOnly', 'readOnly');
        //                return false;
        //            }
        //        });
        //        $(elem).find("input[id^='ValidTo']").change(function () {
        //            var ret1 = CheckDuplicateDATE((this.id.split('_').length > 1 ? 'ValidFrom_' + this.id.split('_')[1] : 'ValidFrom'), this.id);
        //            if (ret1 == false) {
        //                $('#' + this.id).val('');
        //                $(this.id).attr('readOnly', 'readOnly');
        //                return false
        //            }
        //        });
        //        $('.k-datepicker').each(function () {
        //            $(this).removeClass('k-input');
        //        });
        //    }
        //});

        $("input[id^='ValidFrom']").each(function () {
            $(this).attr('readOnly', 'readOnly');
            $(this).attr('startControl', this.id);
            $(this).attr('endControl', (this.id.split('_').length > 1 ? 'ValidTo_' + this.id.split('_')[1] : 'ValidTo'));
            $(this).attr('style', 'width: 90px');
        });
        $("input[id^='ValidTo']").each(function () {
            $(this).attr('readOnly', 'readOnly');
            $(this).attr('startControl', (this.id.split('_').length > 1 ? 'ValidFrom_' + this.id.split('_')[1] : 'ValidFrom'));
            $(this).attr('endControl', this.id);
            $(this).attr('style', 'width: 90px');
        });
        $("input[id^='ValidFrom']").change(function () {
            var ret = CheckDuplicateDATE(this.id, (this.id.split('_').length > 1 ? 'ValidTo_' + this.id.split('_')[1] : 'ValidTo'));
            if (ret == false) {
                $('#' + this.id).val('');
                return false;
            }
        });
        $("input[id^='ValidTo']").change(function () {
            var ret1 = CheckDuplicateDATE((this.id.split('_').length > 1 ? 'ValidFrom_' + this.id.split('_')[1] : 'ValidFrom'), this.id);
            if (ret1 == false) {
                $('#' + this.id).val('');
                return false
            }
        });
        $('.k-datepicker').each(function () {
            $(this).removeClass('k-input');
        });
    }
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });

    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
    $('#ZoneName').keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })

});



function CheckDuplicateDATE(vfID, vtID) {
    var count = 0;
    var seen = {};
    var msgpkpp = 0;
    var curVF = new Date($('#' + vfID).val().split('-')[2], mnth.indexOf($('#' + vfID).val().split('-')[1]), $('#' + vfID).val().split('-')[0]);
    var curVT = new Date($('#' + vtID).val().split('-')[2], mnth.indexOf($('#' + vtID).val().split('-')[1]), $('#' + vtID).val().split('-')[0]);
    var txtValidFrom = $("#divareaTrans_Master_TimeZoneTrans").find("input[id^='ValidFrom']");
    var txtValidTo = $("#divareaTrans_Master_TimeZoneTrans").find("input[id^='ValidTo']");
    var vf, vt;

    while ($("div[id$='areaTrans_Master_TimeZoneTrans']").find("[id^='areaTrans_Master_TimeZoneTrans']").length > count) {
        if (curVF > curVT) {
            msgpkpp = 1;
            ShowMessage('warning', 'Need your Kind Attention!', 'Valid To is always greater than Valid From.');
            return false;
        }
        else if (vfID != txtValidFrom[count].id && vtID != txtValidTo[count].id) {
            vf = new Date(txtValidFrom[count].value.split('-')[2], mnth.indexOf(txtValidFrom[count].value.split('-')[1]), txtValidFrom[count].value.split('-')[0]);
            vt = new Date(txtValidTo[count].value.split('-')[2], mnth.indexOf(txtValidTo[count].value.split('-')[1]), txtValidTo[count].value.split('-')[0]);
            if ((curVF >= vf && curVF <= vt) || (curVT >= vf && curVT <= vt) || (curVF < vf && curVT > vt)) {
                msgpkpp = 1;
                ShowMessage('warning', 'Need your Kind Attention!', 'Please do not enter duplicate value.');
                return false;
            }
                //else if (curVF > curVT) {
                //    msgpkpp = 1;
                //    ShowMessage('warning', 'Need your Kind Attention!', 'Valid To is always greater than Valid From.');
                //    return false;
                //}
            else
                msgpkpp = 0;
        }
        count++;
    }
    if (msgpkpp == 1) {
        //ShowMessage('warning', 'Information', 'Please do not enter duplicate value.');
        return false;
    }
    else
        return true;
}





function CreateTimeZonetrans() {
  

    var dbtableName = "TimeZoneTrans";

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: (getQueryStringValue("FormAction").toUpperCase()  == 'EDIT'),
            tableColume: 'RowSNo,AirlineSNo,ULDNo,ULDLocation,IsLoadedInSystem,IsPhysicallyAvailable,IsFound,PageULDLocationValue,ULDStatus,IsDamaged',
            masterTableSNo: $('#hdnTimeSoneSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: '', sort: '',
            servicePath: './Services/Master/TimeZoneService.svc',
            getRecordServiceMethod: 'GetTimeZoneTransRecordViewUpdate',
            createUpdateServiceMethod: 'createUpdateTimeZone',
            deleteServiceMethod: 'DeleteULDInventory',
            caption: 'Time Zone Trans',
            initRows: 1,
            columns: [{ name: 'SNo', type: 'hidden' },
                      //{ name: 'ValidFrom', display: 'Valid From', type: 'text', ctrlAttr: { controltype: 'datetime' }, ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },

                       { name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { min: '0', controltype: 'datetype', }, ctrlCss: { width: '80px', height: '20px' } },
                       { name: 'ValidFromTime', display: 'Time', type: 'text', ctrlAttr: { controltype: 'timepicker' }, ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
              
                       { name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { min: '0', controltype: 'datetype', }, ctrlCss: { width: '80px', height: '20px' } },
                    
                     { name: 'ValidToTime', display: 'Time', type: 'text', ctrlAttr: { controltype: 'timepicker' }, ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
               { name: 'Minute', display: 'Minute', type: 'text', ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
            ],

            hideButtons: { append: true, remove: true, removeLast: true },
            isPaging: true,

        });
        getRecord();

      

        //$("#tbl tbody tr:nth-child(4)").show();
    }
  
