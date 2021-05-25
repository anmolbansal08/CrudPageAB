var dbTableName = 'ScheduleTrans';
var pageType = $('#hdnPageType').val();
var IsGridRecordGet = true;
var GridGenerateRows = 1;
var overbookingcapacity = "";
var Freesalecapacity = "";
var percencap = [];
var percenover = [];
var prev = [];
var Obprev = [];

var percencapvol = [];
var percenovervol = [];
var prevvol = [];
var Obprevvol = [];
var Umg = [];
var Umv = [];

var grwt = [];
var countLeg = 0;
var AircraftFlag = false;
var SetAllAircraft = {};
var DayDiffArray = [];
var DayDiifIsValid = true;
var IsValidSchedule = false;
var IsValidScheduleDone = false;
var IsAddLeg = false;
var OldTransData = [];

var GridData = {};
var LastAddLegNo = 0;
var IsRemoveFlights = false;
//jQuery('form').submit(function () {
//    $(this).find(':submit').attr('disabled', 'disabled');
//});

$(document).ready(function () {


    IsAddLeg = userContext.SysSetting.ScheduleAddLeg.toUpperCase() == "TRUE";
    IsRemoveFlights = userContext.SysSetting.RemoveFligthsOnScheduleUpdate.toUpperCase() == "TRUE";
    // SetDateRangeValue(undefined);
    // added by arman ali
    // $('#BindFlightSch').addClass('btn btn-inverse');
    // $('#Show').addClass('btn btn-inverse');
    // end

    if (pageType == 'NEW' || pageType == 'EDIT') {
        $('input[name=operation]').hide();
        $('#ValidateBtn').remove();
        IsValidSchedule = false;
        $('input[type="button"][value="Back"]').before('<input type="button" name="ValidateBtn" id="ValidateBtn" value="Validate" class="btn btn-info" onclick="ValidateOnSubmit()">');
    }

    //var datepicker = $("#FStartDate").data("kendoDatePicker");
    //datepicker.value('1-OCT-2017');
    //datepicker.on("change", function (e) { alert('hello');});

    $("#PreAlertTime").on('drop', function (event) {
        event.preventDefault();
    });
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("[name='IsSch']:radio").attr("disabled", true);
        $(":checkbox").attr("disabled", true);
        if ($('#FStartDate').val() <= $('#OpenedUpto').val() && $('#OpenedUpto').val() != '' && IsRemoveFlights == false) {
            $("#FStartDate").data("kendoDatePicker").enable(false);
            $('#FStartDate').removeAttr('disabled');
            $('#FStartDate').attr('readonly', true);
            if (!IsAddLeg)
                $("#FEndDate").data("kendoDatePicker").min($('#OpenedUpto').val());
        }
        else {
            $("#FEndDate").data("kendoDatePicker").min(new Date($("#FStartDate").val()) <= new Date() ? new Date() : $("#FStartDate").val());
        }
        //AircraftFlag == true;
    }
    $("#PreAlertTime").bind('paste', function (e) {
        e.preventDefault(); //disable cut,copy,paste
    });
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("input[id^=FEndDate]").val("")
        $("#PreAlertDate").val('');
        $("#PreAlertTime").kendoTimePicker({
            format: "HH:mm", interval: 1
        });
        $("#PreAlertTime").bind('keyup', function (e) {
            this.value = this.value.replace(/[^0-9:]/g, '');
        });
        $("#PreAlertTime").bind('blur', function (e) {
            var validTime = $(this).val().match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
            if (!validTime) {
                $(this).val('');
            }
        });

        $("#Text_ViaRoute").closest("span").hide();

        $("#Text_ViaRoute").removeAttr("data-valid");
        $("div#divMultiViaRoute").remove();
        $("#ViaRoute").val('');
    }

    $('#Show').click(function () {
        IsValidSchedule = false;
        $('input[name=operation]').hide();
        $('#ValidateBtn').show();

        var $rows = $("#tbl tr");
        $rows.eq(5).show();
        $rows.eq(6).show();
        $rows.eq(4).show();
        $rows.eq(7).show();
        $rows.eq(8).show();
        $rows.eq(9).show();
        //  $rows.eq(10).show();
        $('#BindFlightSch').show();
        $('#tblScheduleTrans').hide();
        $('#Show').hide();

        SetAllAircraft = {};
        //AircraftFlag = false;
    });

    $('#BindFlightSch').click(function () {
        //AircraftFlag = false;       
        if (cfi.IsValidSubmitSection()) {

            if ($("#PreAlertTime").val() != '' && $("#PreAlertDate").val() == '') {
                //alert("Pre-Alert Date can not be blank.");
                ShowMessage('warning', 'Information', 'Pre-Alert Date can not be blank.');
            }
            else if ($("#PreAlertDate").val() != '' && $("#PreAlertTime").val() == '') {
                //alert("Pre-Alert Time can not be blank.");
                ShowMessage('warning', 'Information', 'Pre-Alert Time can not be blank.');
            }
            else {

                bindRouting();

                //20 Sep 2017  Commented By Pankaj Khanna
                if (IsAddLeg) {
                    var legs = $('span#Routing').text().split('-');
                    var generaterow = 0;
                    for (i = 0; i < legs.length; i++) {
                        generaterow = generaterow + i;

                    }
                    IsGridRecordGet = false;
                    GridGenerateRows = $("#Destination").val() == $("#Origin").val() ? generaterow - 1 : generaterow;
                }
                else {
                    var legs = $('span#Routing').text().split('-').length - 1;
                    IsGridRecordGet = false;
                    GridGenerateRows = legs;//$("#Destination").val() == $("#Origin").val() ? generaterow - 1 : generaterow;
                }
                createScheduleDetail();

                $('#tblScheduleTrans_btnUpdateAll').hide();
                //$("#Text_Origin").data("kendoAutoComplete").enable(false);
                //$("#Text_Destination").data("kendoAutoComplete").enable(false);
                //$("#Text_ViaRoute").data("kendoAutoComplete").enable(false);
                //$("#Text_CarrierCode").data("kendoAutoComplete").enable(false);
                //$("#FStartDate").data("kendoDatePicker").enable(false);
                //$("#FEndDate").data("kendoDatePicker").enable(false);
                //$('input[name=ScheduleType]').attr("disabled", true);
                //$('input[name=IsActive]').attr("disabled", true);
                //$('input[name=IsSch]').attr("disabled", true);
                //$('input[name=FlightNumber]').attr("disabled", true);
                // $('#tbl tr:nth-child(n+5)').hide();
                var $rows = $("#tbl tr");
                $rows.eq(5).hide();
                $rows.eq(6).hide();
                $rows.eq(4).hide();
                $rows.eq(7).hide();
                $rows.eq(8).hide();
                $rows.eq(9).hide();
                //$rows.eq(10).hide();
                $("#Show").show();
                $('#BindFlightSch').hide();
                $('#tblScheduleTrans').show();

                SetDateRangeValue(undefined);
                // for (i = 1; i <= (legs.length) - 1; i++) {
                $('#tblScheduleTrans tr[id]').each(function () {
                    var i = this.id.split('_')[2];

                    $("#tblScheduleTrans_CodeShareFlightNumber_" + i).val('');
                    $("#tblScheduleTrans_CodeShareFlightNumber_" + i).prop("disabled", true);
                    $("#tblScheduleTrans_CodeShareCarrierCode_" + i).val('');
                    //$("#tblScheduleTrans_CodeShareCarrierCode_" + i).data("kendoAutoComplete").enable(false);
                    //$('#tblScheduleTrans_OverBookingCapacity_' + i + ',#_temptblScheduleTrans_OverBookingCapacity_' + i + '').attr("disabled", true);
                    //$('#tblScheduleTrans_OverBookingCapacityVol_' + i + ',#_temptblScheduleTrans_OverBookingCapacityVol_' + i + '').attr("disabled", true);
                    //$('#tblScheduleTrans_FreeSaleCapacity_' + i + ',#_temptblScheduleTrans_FreeSaleCapacity_' + i + '').attr("disabled", true);
                    //$('#tblScheduleTrans_FreeSaleCapacityVol_' + i + ',#_temptblScheduleTrans_FreeSaleCapacityVol_' + i + '').attr("disabled", true);
                    $('#tblScheduleTrans_UMV_' + i).attr("disabled", true);
                    $('#tblScheduleTrans_UMG_' + i).attr("disabled", true);
                    //  $("#tblScheduleTrans_CodeShareCarrierCode_" + i).kendoAutoComplete({enable: false});
                });

                $('[id^="tblScheduleTrans_AddLegNo"]').each(function () {
                    if (!SetAllAircraft.hasOwnProperty(this.value)) {
                        SetAllAircraft[parseInt(this.value)];
                        SetAllAircraft[this.value] = { "AircraftFlag": false };

                    }

                });
            }
        }
        var abc = $("input[id=IsActive]:checked").val()
        // $("[id*='tabledivLegs'] [style*='none']").closest('tr').hide()
    });
    cfi.AutoCompleteV2("CarrierCode", "CarrierCode", "Schedule_CarrierCode", null, "contains");
    $('#_spanDASH_').html('-');
    $('#_spanLBLSHOWCASE_').html('Operated as RFS');
    cfi.AutoCompleteV2("Origin", "AirportCode", "Schedule_AirportCode", bindRouting, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode", "Schedule_AirportCode", bindRouting, "contains");
    cfi.AutoCompleteV2("ViaRoute", "AirportCode", "Schedule_AirportCode", bindRouting, "contains", ',');

    if (pageType != undefined && (pageType == "EDIT" || pageType == "READ")) {
        createScheduleDetail();
    }


    //cfi.ValidateSection('tbl' + dbTableName);

    $("#FlightNumber").keypress(function (evt) {
        var iKeyCode = (evt.which) ? evt.which : evt.keyCode
        if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
            return false;

        return true;
    });

    if ($('#_spanDASHTYPE_').length > 0) {

        if ($("input:radio[name='ScheduleType']:checked").val() == 2) {
            $('#_spanDASHTYPE_').text('T');
        }
    }

    $(":radio[name=ScheduleType]").click(function (event) {
        cfi.ResetAutoComplete("CarrierCode");
        $("#FlightNumber").val('');
        $("#SingleAlpha").val('');
        if (document.querySelector('input[name="ScheduleType"]:checked').value == 2) {
            $('#_spanDASHTYPE_').text('T');
            GetTrucking("2");
        }
        else {
            $('#_spanDASHTYPE_').text('');

        }

    });

    $("input[id^=FEndDate]").change(function (e) {

        var EndValue = $(e.target).val();
        var StartValue = $('#' + $(this).attr("id").replace("EndDate", "StartDate")).val();

        if ((new Date(StartValue) > new Date(EndValue)) && EndValue != '' && StartValue != '') {
            $("input[id^=FEndDate]").val('');
            e.preventDefault();
            return false;
        }

        else if (EndValue != '' && IsAddLeg == true && IsRemoveFlights == true && $('[id^="tblScheduleTrans_EndDate_"]').length > 0) {
            $('[id^="tblScheduleTrans_EndDate_"]').each(function () {

                var EndDate = this.value;
                var ID = this.id.replace('EndDate', 'StartDate');
                var StartDate = $('#' + ID).val();

                if (new Date(EndValue) < new Date(EndDate)) {
                    $('#' + this.id).val('');
                }
                if (new Date(EndValue) < new Date(StartDate)) {
                    $('#' + ID).val('');
                }
                $('#' + this.id).data("kendoDatePicker").max(EndValue);
                $('#' + ID).data("kendoDatePicker").max(new Date(EndValue) > new Date(EndDate) && EndDate != '' ? new Date(EndDate) : new Date(EndValue));
            });

            $('[id^="tblScheduleTrans_StartDate_"]').data("kendoDatePicker").max(EndValue);
            $('[id^="tblScheduleTrans_EndDate_"]').data("kendoDatePicker").max(EndValue);

        }
        else if (EndValue != '' && IsAddLeg == false && $('[id^="tblScheduleTrans_EndDate_"]').length > 0) {
            $('[id^="tblScheduleTrans_EndDate_"]').val($('#FEndDate').val());
        }

        /*
        var Value = $(this).val();
       
        

        */
    });

    $("input[id^=FStartDate]").change(function (e) {
        //$('[id^="tblScheduleTrans_StartDate_"]').val($('#FStartDate').val());
        var StartValue = $(e.target).val();
        var EndValue = $('#' + $(this).attr("id").replace("StartDate", "EndDate")).val();

        if ((new Date(StartValue) > new Date(EndValue)) && EndValue != '' && StartValue != '') {
            $("input[id^=FStartDate]").val('');
            e.preventDefault();
            return false;
        }
        else if (StartValue != '' && IsAddLeg == true && IsRemoveFlights == true) {
            $('[id^="tblScheduleTrans_StartDate_"]').each(function () {

                var StartDate = this.value;
                var ID = this.id.replace('StartDate', 'EndDate');
                var EndDate = $('#' + ID).val();

                if (new Date(StartValue) > new Date(StartDate)) {
                    $('#' + this.id).val('');
                }
                if (new Date(StartValue) > new Date(EndDate)) {
                    $('#' + ID).val('');
                }
                $('#' + this.id).data("kendoDatePicker").min(StartValue);
                $('#' + ID).data("kendoDatePicker").min(new Date(StartValue) < new Date(StartDate) && StartDate != '' ? new Date(StartDate) : new Date(StartValue));
            });
            //$('[id^="tblScheduleTrans_StartDate_"]').data("kendoDatePicker").min(StartValue);
            //$('[id^="tblScheduleTrans_EndDate_"]').data("kendoDatePicker").min(StartValue);
        }
        else if (StartValue != '' && IsAddLeg == false) {
            $('[id^="tblScheduleTrans_StartDate_"]').val($('#FStartDate').val());
        }

        /*
        if (Value != "" && Value != undefined) {
            $('[id^="tblScheduleTrans_StartDate_"]').each(function () {
                var CurrentUniqueIndex = this.id.split('_')[2];
                var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                var CurrentValue = $(this).val();
                var EndDate = $('#tblScheduleTrans_EndDate_' + CurrentUniqueIndex + '').val();

                if ((Value <= EndDate || EndDate == ''))
                {
                    
                }
                else if (Value>EndDate)
                {

                }



                if (CurrentValue != '' && EndDate != '') {
                    var SD = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                    var ED = EndDate.replace(/[^A-Z0-9-/]/ig, '');
                    var dfrom = new Date(Date.parse(SD));
                    var dto = new Date(Date.parse(ED));
                    if (dfrom > dto) {
                        $(this).val("");
                        CurrentValue = '';
                    }
                }

                $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                    var CurrentRowID = parseInt(this.id.split('_')[2]);
                    $('[id^=tblScheduleTrans_StartDate_' + CurrentRowID + ']').val(CurrentValue);
                    $('[id^=tblScheduleTrans_StartDate_' + CurrentRowID + ']').data("kendoDatePicker").min(CurrentValue);
                });

            });
        }

        */
    });

    //$("input[id^=FEndDate]").change(function (e) {
    //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dto = new Date(Date.parse(k));
    //    var validFrom = $(this).attr("id").replace("End", "Start");
    //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dfrom = new Date(Date.parse(k));
    //    if (dfrom > dto)
    //        $(this).val("");

    //})
    //$("input[id^=FStartDate]").change(function (e) {
    //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dfrom = new Date(Date.parse(k));

    //    var validFrom = $(this).attr("id").replace("Start", "End");
    //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dto = new Date(Date.parse(k));
    //    if (dfrom > dto)
    //        $(this).val("");

    //})


    //$("input[id^=tblScheduleTrans_StartDate]").on("change blur", function (e) {
    //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dfrom = new Date(Date.parse(k));

    //    var validFrom = $(this).attr("id").replace("Start", "End");
    //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dto = new Date(Date.parse(k));
    //    if (dfrom > dto)
    //        $(this).val("");

    //})


    //$("input[id^=tblScheduleTrans_EndDate_]").on("change blur",function (e) {
    //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dto = new Date(Date.parse(k));
    //    var validFrom = $(this).attr("id").replace("End", "Start");
    //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dfrom = new Date(Date.parse(k));
    //    if (dfrom > dto)
    //        $(this).val("");

    //})  


    // if ($("input[name='ScheduleType']").live("click", function () { alert($("input[name='ScheduleType']:checked").val()) == 0 || 1 })) {

    ///  $('#_spanLBLSHOWCASE_').show();
    // $('#OperatedasTruck').show
    //  }
    // else {

    //   $('#_spanLBLSHOWCASE_').hide();
    //  $('#OperatedasTruck').hide();

    // }


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        $('input[id="ScheduleType"]').bind("click", function () {
            if ($('input[id="ScheduleType"]:eq(2)').prop('checked')) {
                $('#_spanLBLSHOWCASE_').hide();
                $('#OperatedasTruck').hide();
            }
            else {
                $('#_spanLBLSHOWCASE_').show();
                $('#OperatedasTruck').show();

            }
        })

        if ($('input[id="ScheduleType"]:eq(2)').prop('checked')) {
            $('#_spanLBLSHOWCASE_').hide();
            $('#OperatedasTruck').hide();

        }
        else {
            $('#_spanLBLSHOWCASE_').show();
            $('#OperatedasTruck').show();

        }


        //  $("input[name='operation']").unbind("click").click(function () {
        $("input[name='operation']").click(function () {
            var val = ValidateOnSubmit();
            return val;
        });

        if (pageType == 'NEW') {
            var SkillDataField = ($('#ViaRoute').val());
            var SkillDataText = ($('#Text_ViaRoute').val());
            $('#Text_ViaRoute')[0].defaultValue = '';
            $('#Text_ViaRoute')[0].Value = '';
            $('#Text_ViaRoute').val('');
            $('#Multi_ViaRoute').val(SkillDataField);
            //$('#FieldKeyValuesViaRoute')[0].innerHTML = SkillDataField;
            var i = 0;
            if (SkillDataField.split(',').length > 0) {
                while (i < SkillDataField.split(',').length) {
                    if (SkillDataField.split(',')[i] != '')
                        $('#divMultiViaRoute').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SkillDataText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + SkillDataField.split(',')[i] + "'></span></li>");
                    i++;
                }
                $("#divMultiViaRoute").css("display", "block");
            }
        }

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#Text_CarrierCode").closest("td").html($("#Text_CarrierCode").closest("td").html().replace(/&nbsp;/g, ''))
        //$('input:submit[name=operation]').hide();

        //$('#tblScheduleTrans_btnUpdateAll').click(function () {
        //    // daysValidate();
        //    alert("sdfd");
        //});

        $('.k-delete').click(function () {
            $(this).parent().remove();
            if ($("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text().indexOf($(this)[0].id + ",") > -1) {
                var ViaRouteVal = $("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text().replace($(this)[0].id + ",", '');
                $("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text(ViaRouteVal);
                $('#ViaRoute').val(ViaRouteVal);
            }
            else {
                var ViaRouteValfield = $("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text().replace($(this)[0].id, '');
                $("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text(ViaRouteValfield);
                $('#ViaRoute').val(ViaRouteValfield);
            }
            $("div[id='divMultiViaRoute']").find("input:hidden[name^='Multi_ViaRoute']").val($("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text());
            bindRouting();

        });
        $('input:button[id*="tblScheduleTrans_DeleteLegs"]').each(function () {
            $('#' + this.id).hide();
        });
    }
    $("#Show").hide();


    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    //    $('table[id^="tabledivLegValidity"] tbody tr td').each(function () {
    //        $(this).find("input[controltype='datetype']").each(function () {
    //            SetDateRangeValue(containerId);
    //        })

    //    })


    // }
    //$("#SingleAlpha").hide();
    //$("#SingleAlpha").removeAttr("data-valid");
    //if ($("input[name=OperatedasTruck]:checkbox").is(":checked")) {
    //    $("#FlightNumber").val($("#FlightNumber").val().substring(0, $("#FlightNumber").val().length - 1));
    //    $("#SingleAlpha").show();
    //    //$("#SingleAlpha").attr("data-valid", "required");
    //}
    ////var abc = $("#FlightNumber").val();
    ////$("#FlightNumber").val().substring(0, $("#FlightNumber").val().length - 1)
    //$("#OperatedasTruck").live('click', function () {
    //    if ($("input[name=OperatedasTruck]:checkbox").is(":checked")) {
    //        $("#SingleAlpha").show();
    //        //$("#SingleAlpha").attr("data-valid", "required");
    //    }
    //    else {
    //        $("#SingleAlpha").hide();
    //        $("#SingleAlpha").removeAttr("data-valid");
    //        $("#SingleAlpha").val('');
    //    }
    //})
    $("#Text_Destination").on('blur', function () {
        if ($('#Origin').val() == $('#Destination').val()) {

            $("#Text_ViaRoute").attr("data-valid", "required");
            $('#Text_ViaRoute').attr("data-valid-msg", "Via Route can not be blank");
            $("#spnViaRoute").closest("td").find("font").html('*');
            $("#ViaRoute").attr("explicitValid", "1");
            if ($("#spnViaRoute").closest("td").find("font").length == 0 || $("#spnViaRoute").closest("td").find("font").text() == '') {
                $("<font color=red>*</font>").insertBefore("[id='spnViaRoute']");
            }

        }
        else {

            $("div#divMultiViaRoute ul li").find("span[class$='k-delete']").closest('li').remove();
            $("div#divMultiViaRoute ul li:last-child").find('input[type="hidden"]').val('');
            $("div#divMultiViaRoute ul li:last-child").find('span').text('');
            $("#Text_ViaRoute").closest('td').find("[id='ViaRoute']").val('');

            $("#ViaRoute").val("");
            $("#Text_ViaRoute").removeAttr("data-valid");
            $('#Text_ViaRoute').removeAttr("data-valid-msg");
            $("#spnViaRoute").closest("td").find("font").html('');
        }
    });

    //$("td").each(function () {
    //    var $this = $(this);
    //    $this.html($this.html().replace(/&nbsp;/g, ''));
    //});
    /*$("input[id^=FEndDate]").blur(function (e) {
        var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("EndDate", "StartDate");
        k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
        var dfrom = new Date(Date.parse(k));
        $("input[id^=FEndDate]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));

        if (dfrom > dto)
            $(this).val("");
    });

    $("input[id^=FStartDate]").blur(function (e) {
        var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("StartDate", "EndDate");
        k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
        var dto = new Date(Date.parse(k));
        $("input[id^=FStartDate]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
        if (dfrom > dto)
            $(this).val("");

    })

    */


    $("input[id^='tblScheduleTrans_OverBookingCapacityVol_']").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', ' Over Booking Volume Wt.');
    }, function () {
        $(this).css('cursor', 'auto');
    }
    );

    $("input[id^='tblScheduleTrans_OverBookingCapacity_']").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'Over Booking Gross Wt.');
    }, function () {
        $(this).css('cursor', 'auto');
    });


    $("[id^='tblScheduleTrans_lblOverBookingCapacityVol_']").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', ' Over Booking Volume Wt.');
    }, function () {
        $(this).css('cursor', 'auto');
    }
    );

    $("[id^='tblScheduleTrans_lblOverBookingCapacity_']").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'Over Booking Gross Wt.');
    }, function () {
        $(this).css('cursor', 'auto');
    });





    $("input[id^='tblScheduleTrans_FreeSaleCapacityVol_']").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', ' Free Sale Volume Wt.');
    }, function () {
        $(this).css('cursor', 'auto');
    }
    );

    $("input[id^='tblScheduleTrans_FreeSaleCapacity_']").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'Free Sale Gross Wt.');
    }, function () {
        $(this).css('cursor', 'auto');
    });


    $("[id^='tblScheduleTrans_lblFreeSaleCapacityVol_']").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', ' Free Sale Volume Wt.');
    }, function () {
        $(this).css('cursor', 'auto');
    }
    );

    $("[id^='tblScheduleTrans_lblFreeSaleCapacity_']").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'Free Sale Gross Wt.');
    }, function () {
        $(this).css('cursor', 'auto');
    });



    $("input:radio[name^='tblScheduleTrans_RbtnIsCAO_']").on('change', function () {
        var id = $(this).attr("name").replace("RbtnIsCAO", "AirCraft");
        $("#" + id).val('');
    });

    $('#OperatedasTruck').on('click', function () {
        if ($('#OperatedasTruck').is(':checked') == true) {
            $('#SingleAlpha').attr('data-valid', 'required');
            $('#SingleAlpha').attr('data-valid-msg', 'Character cannot be blank.');
        }
        else {
            $('#SingleAlpha').removeAttr('data-valid');
            $('#SingleAlpha').removeAttr('data-valid-msg');
            // $('#SingleAlpha').css('border', '1px solid #b4d5e2');
        }
    });
});


function onEtdBlur() {
    $("[id^='tblScheduleTrans_ETD']").blur(function (evt) {
        var rowIndex = $(this).attr("id").split('_')[2];
        var x = $("#" + 'tbl' + dbTableName + '_ETD_' + evt.currentTarget.id.replace("tblScheduleTrans_ETD_", '')).val();
        if (x.length == 0) {
            return false;
        }
        var value = 0;
        for (var i = 0; i < x.length; i++) {
            var iKeyCode = x.charAt(i);
            if (iKeyCode.toString() == '0' || iKeyCode.toString() == '1' || iKeyCode.toString() == '2' || iKeyCode.toString() == '3' || iKeyCode.toString() == '4' || iKeyCode.toString() == '5' || iKeyCode.toString() == '6' || iKeyCode.toString() == '7' || iKeyCode.toString() == '8' || iKeyCode.toString() == '9')
                value = 0;
            else {
                value = 1;
                break;
            }
        }
        if (x.length != 4) {
            value = 1;
        }
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (firstno >= 4 && (x.charAt(0) != 1 && x.charAt(0) != 0))
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        if (value == 1) {
            $("#" + 'tbl' + dbTableName + '_ETD_' + evt.currentTarget.id.replace("tblScheduleTrans_ETD_", '')).val('');
            // alert('Please enter correct STD format');
            ShowMessage('warning', 'Warning', 'Please enter correct STD format.');
            return false;
        }
        //else
        //    CheckDayDiff(evt, rowIndex);

        /*  if (parseInt($("#tblScheduleTrans_ETD_" + rowIndex).val()) >= parseInt($("#tblScheduleTrans_ETA_" + rowIndex).val()) && $('#tblScheduleTrans_SDDifference_' + rowIndex).val() <= 0) {
              //alert("STA should be greater than STD Other wise Automatically Set Arrival Day Diff to 1.");
              //$("#tblScheduleTrans_SDDifference_" + rowIndex + " option[value=1]").prop('selected', true);
  
              if (userContext.SysSetting.Schedule_RemoveETAETDCheck == 'true') {
                  ShowMessage('warning', 'Warning', 'STA is less than STD. Kindly enter relevant Arrival Day Difference if applicable.');
              }
              else {
                  ShowMessage('warning', 'Warning', 'STA should be greater than STD.');
              }
              return false;
          }*/

        // $("input[id^=tblScheduleTrans_ETD_]").on('blur', function () {

        var CurrentRowOriginID = this.id.replace('ETD', 'Origin');
        var CurrentRowOriginVal = $('#' + CurrentRowOriginID).val();
        var CurrentRowETD = this.value;
        var CurrentAddLegID = this.id.replace('ETD', 'AddLegNo');

        //if ($('#' + CurrentAddLegID).val() == 0) {
        $('#tblScheduleTrans tr[id]').each(function () {
            // $('#tblScheduleTrans tr[id]').not($("input[id^=tblScheduleTrans_HdnAddLeg_][value='1']").parent().parent()).each(function () {
            var NewRowOriginID = this.id.replace('Row', 'Origin');
            var NewRowOriginVal = $('#' + NewRowOriginID).val();
            var NewRowETD_ID = this.id.replace('Row', 'ETD');

            var ETA_ID = this.id.replace('Row', 'ETA');

            var NewAddLegID = this.id.replace('Row', 'AddLegNo');

            if (CurrentRowOriginVal == NewRowOriginVal && $('#' + NewAddLegID).val() == $('#' + CurrentAddLegID).val()) {
                $('#' + NewRowETD_ID).val(CurrentRowETD);
            }

            //var N_ETD = $('#' + NewRowETD_ID).val();
            //var N_ETA = $('#' + ETA_ID).val();


            ////--Setting Arrival Day Diff
            //if(N_ETD!="" && N_ETA!="" &&  (parseInt(N_ETD) >= parseInt(N_ETA))) {
            //    $("#" + this.id.replace('Row', 'SDDifference') + " option[value=1]").prop('selected', true);
            //}
            //else
            //{
            //    $("#" + this.id.replace('Row', 'SDDifference') + " option[value=0]").prop('selected', true);
            //}


            // To Check Daparture Day Diff
            //$('#tblScheduleTrans tr[id]').each(function () {
            //    var NewRowDestinationID = this.id.replace('Row', 'Destination');
            //    var NewRowDestinationVal = $('#' + NewRowDestinationID).val();
            //    var NewRowETA_ID = this.id.replace('Row', 'ETA');

            //    if (NewRowOriginVal == NewRowDestinationVal && $('#' + NewRowETD_ID).val() != "" && $("#" + NewRowETA_ID).val() != "")
            //    {
            //        if (parseInt($('#' + NewRowETD_ID).val()) <= parseInt($("#" + NewRowETA_ID).val()))
            //        {
            //            $("#" + NewRowETD_ID.replace('ETD', 'DayDifference') + " option[value=1]").prop('selected', true);
            //        }
            //        else {
            //            $("#" + NewRowETD_ID.replace('ETD', 'DayDifference') + " option[value=0]").prop('selected', true);
            //        }
            //    }

            //});
        });
        // }
        //});

        //else
        //    CheckDayDiff(evt, rowIndex);
    });
}

function onEtaBlur() {
    $("[id^='tblScheduleTrans_ETA']").blur(function (evt) {


        var rowIndex = $(this).attr("id").split('_')[2];

        var x = $("#" + 'tbl' + dbTableName + '_ETA_' + evt.currentTarget.id.replace("tblScheduleTrans_ETA_", '')).val();

        if (x.length == 0) {
            return false;
        }
        var value = 0;
        for (var i = 0; i < x.length; i++) {
            var iKeyCode = x.charAt(i);
            if (iKeyCode.toString() == '0' || iKeyCode.toString() == '1' || iKeyCode.toString() == '2' || iKeyCode.toString() == '3' || iKeyCode.toString() == '4' || iKeyCode.toString() == '5' || iKeyCode.toString() == '6' || iKeyCode.toString() == '7' || iKeyCode.toString() == '8' || iKeyCode.toString() == '9')
                value = 0;
            else {
                value = 1;
                break;
            }
        }

        if (x.length != 4) {
            value = 1;
        }

        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (firstno >= 4 && x.charAt(0) != 1 && x.charAt(0) != 0)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        if (value == 1) {
            $("#" + 'tbl' + dbTableName + '_ETA_' + evt.currentTarget.id.replace("tblScheduleTrans_ETA_", '')).val('');
            //alert('Please enter correct STA format');
            ShowMessage('warning', 'Warning', 'Please enter correct STA format.');
            return false;
        }
        //else
        // CheckDayDiff(evt, rowIndex);
        /* if (parseInt($("#tblScheduleTrans_ETD_" + rowIndex).val()) >= parseInt($("#tblScheduleTrans_ETA_" + rowIndex).val()) && $('#tblScheduleTrans_SDDifference_' + rowIndex).val() <= 0) {
             //alert("STA should be greater than STD Other wise Automatically Set Arrival Day Diff to 1.");
             if (userContext.SysSetting.Schedule_RemoveETAETDCheck == 'true') {
                 ShowMessage('warning', 'Warning', 'STA is less than STD. Kindly enter relevant Arrival Day Difference if applicable.');
             }
             else {
                 ShowMessage('warning', 'Warning', 'STA should be greater than STD.');
             }
            // $("#tblScheduleTrans_SDDifference_" + rowIndex + " option[value=1]").prop('selected', true);
             return false;
         }*/

        // $("input[id^=tblScheduleTrans_ETA_]").on('blur', function () {
        //$("input[id^=tblScheduleTrans_ETA_]").not($("input[id^=tblScheduleTrans_HdnAddLeg_][value='1']").parent().parent().find("input[id^=tblScheduleTrans_ETA_]")).on('blur', function () {                    
        var CurrentRowDestinationID = this.id.replace('ETA', 'Destination');
        var CurrentRowDestinationVal = $('#' + CurrentRowDestinationID).val();
        var CurrentRowETA = this.value;

        var CurrentAddLegID = this.id.replace('ETA', 'AddLegNo');

        //if ($('#' + CurrentAddLegID).val() == 0) {

        $('#tblScheduleTrans tr[id]').each(function () {
            // $('#tblScheduleTrans tr[id]').not($("input[id^=tblScheduleTrans_HdnAddLeg_][value='1']").parent().parent()).each(function () {
            var NewRowDestinationID = this.id.replace('Row', 'Destination');
            var NewRowDestinationVal = $('#' + NewRowDestinationID).val();
            var NewRowETA_ID = this.id.replace('Row', 'ETA');

            var ETD_ID = this.id.replace('Row', 'ETD');

            var NewAddLegID = this.id.replace('Row', 'AddLegNo');
            if (CurrentRowDestinationVal == NewRowDestinationVal && $('#' + NewAddLegID).val() == $('#' + CurrentAddLegID).val()) {
                $('#' + NewRowETA_ID).val(CurrentRowETA);
            }

            //var N_ETD = $('#' + ETD_ID).val();
            //var N_ETA = $('#' + NewRowETA_ID).val();
            ////--Setting Arrival Day Diff
            //if (N_ETD != "" && N_ETA != "" && (parseInt(N_ETD) >= parseInt(N_ETA))) {
            //    $("#" + this.id.replace('Row', 'SDDifference') + " option[value=1]").prop('selected', true);
            //}
            //else {
            //    $("#" + this.id.replace('Row', 'SDDifference') + " option[value=0]").prop('selected', true);
            //}
            // To Check Daparture Day Diff
            //$('#tblScheduleTrans tr[id]').each(function () {
            //    var NewRowOriginID = this.id.replace('Row', 'Origin');
            //    var NewRowOriginVal = $('#' + NewRowOriginID).val();
            //    var NewRowETD_ID = this.id.replace('Row', 'ETD');
            //    if (NewRowOriginVal == NewRowDestinationVal && $('#' + NewRowETA_ID).val() != "" && $("#" + NewRowETD_ID).val() != "") {
            //        if (parseInt($("#" + NewRowETD_ID).val()) <= parseInt($('#' + NewRowETA_ID).val())) {
            //            $("#" + NewRowETD_ID.replace('ETD', 'DayDifference') + " option[value=1]").prop('selected', true);
            //        }
            //        else {
            //            $("#" + NewRowETD_ID.replace('ETD', 'DayDifference') + " option[value=0]").prop('selected', true);
            //        }
            //    }
            //});

        });
        //}
        //});
    });
}

function daysValidate() {
    if (cfi.IsValidSubmitSection()) {
        if ($('#tblScheduleTrans').appendGrid('getRowCount') > 0) {
            var RO = $('#tblScheduleTrans').appendGrid('getRowOrder');
            for (var i = 0; i < $('#tblScheduleTrans').appendGrid('getRowCount'); i++) {
                if ($('#tblScheduleTrans_Day1_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day2_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day3_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day4_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day5_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day6_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day7_' + RO[i.toString()]).prop('checked') == false) {
                    //alert("Select Frequency for " + $('#tblScheduleTrans_Origin_' + RO[i.toString()]).val() + " - " + $('#tblScheduleTrans_Destination_' + RO[i.toString()]).val() + " leg.");

                    ShowMessage('warning', 'Information', "Select Frequency for " + $('#tblScheduleTrans_Origin_' + RO[i.toString()]).val() + " - " + $('#tblScheduleTrans_Destination_' + RO[i.toString()]).val() + " leg.");
                    return false;
                }
            }
            return true;
        }
        else {
            //alert("Please click on generate schedule");
            ShowMessage('warning', 'Warning', 'Please click on generate schedule.');
            return false;
        }
    }
    else {
        return false
    }
}

function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);

        });
    }
    else {

        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}

function bindRouting() {
    var org = $('#Text_Origin').val();
    var Dest = $('#Text_Destination').val();
    var viaRout = '';
    var spanval = ''
    if ($.browser.safari == undefined) {
        for (i = 0; i < $('#divMultiViaRoute li').length - 1; i++) {
            if (viaRout == '') {
                viaRout = $('#divMultiViaRoute li')[i].innerText;
            }
            else {
                viaRout = viaRout + '-' + $('#divMultiViaRoute li')[i].innerText;
            }
        }
    }
    else {
        var val = $('#Text_ViaRoute').val().substring(0, 3);
        var Count = 0;
        Count = $('#divMultiViaRoute li').length - 2;
        for (i = Count; i >= 0; i--) {
            if (viaRout == '') {
                if ($('#divMultiViaRoute li')[i].innerText == val)
                    val = '';
                viaRout = $('#divMultiViaRoute li')[i].innerText;
            }
            else {
                if ($('#divMultiViaRoute li')[i].innerText == val)
                    val = '';
                viaRout = viaRout + '-' + $('#divMultiViaRoute li')[i].innerText;
            }
        }

        if (viaRout == '') {
            viaRout = val;
        }
        else {
            if (val != '')
                viaRout = viaRout + '-' + val;
        }
    }
    //var viaRout = $('#divMultiViaRoute li').text();
    if (org != '') {
        spanval = org;
    }
    if (Dest != '') {
        spanval = org + '-' + Dest;
    }
    if (viaRout != '') {
        spanval = org + '-' + viaRout + '-' + Dest;
    }
    $('span#Routing').text(spanval);
    $('#hdnTextViaRoute').val(spanval);
    var spans = document.getElementsByTagName("span");
    //for (var i = 0; i < spans.length; i++) {
    //    if (spans[i].id == "Routing") {
    //        spans[i].innerHTML = spanval;
    //        $('#Routing').val(spanval);
    //        break;
    //    }



    $('.k-delete').click(function () {
        $(this).parent().remove();
        if ($("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text().indexOf($(this)[0].id + ",") > -1) {
            var ViaRouteVal = $("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text().replace($(this)[0].id + ",", '');
            $("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text(ViaRouteVal);
            $('#ViaRoute').val(ViaRouteVal);
        }
        else {
            var ViaRouteValfield = $("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text().replace($(this)[0].id, '');
            $("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text(ViaRouteValfield);
            $('#ViaRoute').val(ViaRouteValfield);
        }
        $("div[id='divMultiViaRoute']").find("input:hidden[name^='Multi_ViaRoute']").val($("div[id='divMultiViaRoute']").find("span[name^='FieldKeyValuesViaRoute']").text());
        bindRouting();
    });
}

//function BindScheduleRecords() {
//    alert('done');
//}

//function checkValidationSubmit() {
//    alert('hi');
//    return false;
//}

// origin destination filter conditions
function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    //if (pageType != undefined && pageType == "NEW" && $('#tbl' + dbTableName).appendGrid('getRowCount') > 0 && textId.split('_').length == 3) {
    //    if (textId.split('_')[2] == 1) {
    //        if (textId.indexOf("tblScheduleTrans_Origin") >= 0)
    //            cfi.setFilter(f, "AirportCode", "eq", $("#Text_Origin")[0].value);
    //        if (textId.indexOf("tblScheduleTrans_Destination") >= 0)
    //            cfi.setFilter(f, "AirportCode", "eq", $("#Text_Destination")[0].value);
    //    }
    //    else if (textId.split('_')[2] == 2) {
    //        if (textId.indexOf("tblScheduleTrans_Origin") >= 0)
    //            cfi.setFilter(f, "AirportCode", "eq", $("#Text_Origin")[0].value);
    //        if (textId.indexOf("tblScheduleTrans_Destination") >= 0)
    //            cfi.setFilter(f, "AirportCode", "neq", $("#Text_Origin")[0].value);
    //    }
    //    else if (textId.split('_')[2]>2 && textId.split('_')[2]<= $('#tbl' + dbTableName).appendGrid('getRowCount')) {
    //        if (textId.indexOf("tblScheduleTrans_Origin") >= 0)
    //            if ($("#Destination")[0].value == $("#" + textId.split('_')[0] + "_HdnDestination_" + (eval(textId.split('_')[2]) - 1)).val())
    //                cfi.setFilter(f, "AirportCode", "eq", $("#Text_Origin")[0].value);
    //            else
    //                cfi.setFilter(f, "SNo", "eq", $("#" + textId.split('_')[0] + "_HdnDestination_" + (eval(textId.split('_')[2]) - 1)).val());
    //        if (textId.indexOf("tblScheduleTrans_Destination") >= 0) {
    //            // if ($("#" + textId.split('_')[0] + "_HdnOrigin_" + (eval(textId.split('_')[2]) + 1)).val() == '')
    //            //cfi.setFilter(f, "AirportCode", "neq", $("#Text_Origin")[0].value);
    //           //cfi.setFilter(f, "AirportCode", "neq", $("#Text_Destination")[0].value);
    //            //cfi.setFilter(f, "SNo", "neq", $("#" + textId.split('_')[0] + "_HdnDestination_" + (eval(textId.split('_')[2]) - 1)).val());
    //            }
    //       // else
    //           // cfi.setFilter(f, "SNo", "eq", $("#" + textId.split('_')[0] + "_HdnOrigin_" + (eval(textId.split('_')[2]) + 1)).val());
    //    }
    //    else if (textId.split('_')[2] == $('#tbl' + dbTableName).appendGrid('getRowCount')) {
    //        if (textId.indexOf("tblScheduleTrans_Origin") >= 0)
    //            cfi.setFilter(f, "SNo", "eq", $("#" + textId.split('_')[0] + "_HdnDestination_" + (eval(textId.split('_')[2]) - 1)).val());
    //            //cfi.setFilter(f, "SNo", "neq", $("#Origin").val());
    //        if (textId.indexOf("tblScheduleTrans_Destination") >= 0)
    //            cfi.setFilter(f, "AirportCode", "eq", $("#Text_Destination")[0].value);
    //    }
    //    else if (textId.split('_')[2] > $('#tbl' + dbTableName).appendGrid('getRowCount')) {
    //        if (textId.indexOf("tblScheduleTrans_Origin") >= 0)
    //            cfi.setFilter(f, "SNo", "eq", $("#" + textId.split('_')[0] + "_HdnDestination_" + (eval($('#tbl' + dbTableName).appendGrid('getRowCount')) - 1)).val());
    //        if (textId.indexOf("tblScheduleTrans_Destination") >= 0)
    //            cfi.setFilter(f, "AirportCode", "eq", $("#Text_Destination")[0].value);
    //    }
    //}
    //else

    if (textId.indexOf("Origin") >= 0 || textId.indexOf("Destination") >= 0) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_Origin", "Destination").replace("Text_Destination", "Origin")).val());
    }

    else if (textId.indexOf("ViaRoute") >= 0 && ($('#Origin').val() == 0 || $('#Destination').val() == 0)) {
        cfi.setFilter(f, "SNo", "eq", "0");
    }
    else if (textId.indexOf("ViaRoute") >= 0 && ($('#Origin').val() > 0 && $('#Destination').val() > 0)) {
        cfi.setFilter(f, "SNo", "neq", $('#Destination').val());
        cfi.setFilter(f, "SNo", "neq", $('#Origin').val());

    }
    else if (textId.indexOf("AirCraft") >= 0) {// cfi.setFilter(f, "CarrierCode", "eq", $('#' + textId.replace("AirCraft", "ALTCarrierCode")).val()),

        if ($("input:radio[name^='" + textId.replace("AirCraft", "RbtnIsCAO") + "']:checked").val() == undefined)
            ShowMessage('warning', 'Information', 'Kindly select Aircraft Type ( Freighter-Yes or No) prior to selection of Aircraft.');

        cfi.setFilter(f, "IsActive", "eq", 1);
        cfi.setFilter(f, "CarrierCode", "eq", $('#CarrierCode').val().replace(/(^[\s]+|[\s]+$)/g, '').length > 3 ? $('#CarrierCode').val().replace(/(^[\s]+|[\s]+$)/g, '').split('-')[2] : $('#CarrierCode').val().replace(/(^[\s]+|[\s]+$)/g, '')), cfi.getFilter("AND"),
            cfi.setFilter(f, "CargoClassification", "in", ($("input:radio[name^='" + textId.replace("AirCraft", "RbtnIsCAO") + "']:checked").val() == "1" && $('#OperatedasTruck').is(':checked') == false) ? ("1,3") :
                (($("input:radio[name^='" + textId.replace("AirCraft", "RbtnIsCAO") + "']:checked").val() == "0" && $('#OperatedasTruck').is(':checked') == false) ? ("2") : (($("input:radio[name^='" + textId.replace("AirCraft", "RbtnIsCAO") + "']:checked").val() == "0" && $('#OperatedasTruck').is(':checked') == true) ? ("4") : "-1")));

    }
    else if (textId.indexOf("CodeShareCarrierCode") >= 0) {
        cfi.setFilter(f, "CarrierCode", "neq", $('#Text_CarrierCode').val())
    }
    else if (textId.indexOf("CarrierCode") >= 0) {
        var typeval = $("input:radio[name='ScheduleType']:checked").val();
        cfi.setFilter(f, "Interline", "eq", typeval);

    }
    else if (textId.indexOf("SDDifference") >= 0 || textId.indexOf("DayDifference") >= 0) {
        cfi.setFilter(f, "SNo", "neq", '');
    }

    return cfi.autoCompleteFilter([f]);
}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_CarrierCode") {
        //var UserSNo = $("#htmlkeysno").val() || userContext.UserSNo;
        var UserSNo = userContext.UserSNo;
        //var UserSNo = 0
        //if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
        //    UserSNo = userContext.UserSNo;
        //else
        //    UserSNo = $("#htmlkeysno").val();

        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}


function createScheduleDetail() {
    if (cfi.IsValidSubmitSection()) {
        var days = new Array();
        days = ['-1', '0', '1', '2', '3', '4', '5', '6', '7'];
        //'SNo,ScheduleSNo,ScheduleType,CarrierCode,FlightNumber,FlightNo,OriginAirportSNo,OriginAirportCode,ETD,ETDGMT,DestinationSNo,DestinationAirportCode,ETA,ETAGMT,IsDayLightSaving,AirCraftSNo,AllocatedGrossWeight,AllocatedVolumeWeight,MaxGrossPerPcs,DayDifference,Day1,Day2,Day3,Day4,Day5,Day6,Day7,StartDate,EndDate,NoOfStop,IsFirstLeg,IsCAO,Routing,FlightTypeSNo,IsActive,CreatedOn,CreatedBy,UpdatedOn,UpdatedBy'


        if (IsAddLeg) {

            $('#tbl' + dbTableName).appendGrid({
                V2: true,
                tableID: 'tbl' + dbTableName,
                contentEditable: pageType != 'READ',
                tableColumns: 'FlightNo,Origin,ETD,Destination,ETA,StartDate,EndDate,DayLightSaving,AirCraft,AllocatedGrossWeight,AllocatedVolumeWeight,MaxGrossPerPcs,MaxVolumePerPcs,DayDifference,Sun,Mon,Tue,Wed,Thu,Fri,Sat,NoOfStop,FirstLeg,CAO,Routing,Active,IsCodeShare,CodeShareCarrierCode,CodeShareFlightNumber,CodeShareFlightNo,OverBookingCapacity,FreeSaleCapacity,OverBookingCapacityVol,OverBookingCapacityVol,UMG,UMV,Charter',
                masterTableSNo: $('#hdnScheduleSno').val(),
                currentPage: 1, itemsPerPage: 100, model: BindWhereCondition(), sort: '',
                servicePath: './Services/Schedule/ScheduleService.svc',//    ' + dbTableName + 'Service.svc',
                getRecordServiceMethod: 'Get' + dbTableName + 'Record',
                i18n: { customValidationMessage: "Kindly enter respective Schedule Details." },
                // createUpdateServiceMethod: 'createUpdate' + dbTableName,
                // deleteServiceMethod: 'delete' + dbTableName,
                caption: 'Schedule Detail',
                initData: "",
                OnUpdateSuccess: function (result) {
                    if (result[0].m_Item1 != undefined) {
                        if (result[0].m_Item2 == 0) {


                        } else {

                            setTimeout(function () { navigateUrl('Default.cshtml?Module=Schedule&Apps=Schedule&FormAction=INDEXVIEW') }, 3000);

                        }
                    }
                },
                initRows: GridGenerateRows,
                isGetRecord: IsGridRecordGet,
                // column for edit
                columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                { name: 'ScheduleSNo', type: 'hidden', value: $('#hdnScheduleSno').val() },
                { name: 'HdnOrigin', type: 'hidden' },
                { name: 'HdnParentID', type: 'hidden' },
                { name: 'HdnDestination', type: 'hidden' },
                { name: 'ALTCarrierCode', type: 'hidden' },
                { name: 'AddLegNo', type: 'hidden', value: "0" },
                { name: 'RowID', type: 'hidden', value: "0" },
                { name: 'HdnUMG', type: 'hidden' },
                { name: 'HdnUMV', type: 'hidden' },
                { name: 'Routing', type: 'hidden', value: $('#hdnRouting').val() },
                { name: 'HdnIsLeg', type: 'hidden' },
                { name: 'HdnLegId', type: 'hidden' },
                { name: 'ScheduleType', type: 'hidden', value: (isEmpty($('input:radio[name*="ScheduleType"]')) ? ($('#ScheduleTypeName').html() == 'Self' ? '0' : ($('#ScheduleTypeName').html() == 'SPA' ? '1' : '3')) : $('input:radio[name*="ScheduleType"]').val()) },
                { name: 'FlightNo', type: 'hidden' },
                { name: 'HdnDepartureSequence', type: 'hidden' },
                {
                    name: 'divZone', display: 'Time/Zone', type: 'div', isRequired: false,
                    divElements: [
                        { divRowNo: 1, name: 'Origin', display: 'Origin', type: 'text', value: '', ctrlAttr: { maxlength: 3, readonly: true }, ctrlCss: { width: '75px', }, isRequired: false },
                        {
                            divRowNo: 1, name: 'ETD', display: 'STD(HHMM)', type: 'text', isRequired: true, value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                        },
                        { divRowNo: 2, name: 'Destination', display: 'Destination', isRequired: false, type: 'text', value: '', ctrlAttr: { maxlength: 3, readonly: true }, ctrlCss: { width: '75px' } },
                        {
                            divRowNo: 2, name: 'ETA', display: 'STA(HHMM)', type: 'text', isRequired: true, value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                        },


                        { divRowNo: 3, name: pageType == 'EDIT' ? 'IsDayLightSaving' : 'DayLightSaving', display: 'Daylight Saving', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 0 },
                        { divRowNo: 3, name: pageType != 'READ' ? 'IsCharter' : 'Charter', display: 'Charter Flight', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 0, onClick: function (evt, rowIndex) { CheckCharter(evt, rowIndex); } },
                        {
                            divRowNo: 4, name: 'DayDifference', display: 'Departure Day Diff.', type: 'text', ctrlCss: { width: '30px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, AutoCompleteName: 'Schedule_DiffDays', filterField: "SNo", addOnFunction: onDayDiffChange
                        },
                        {
                            divRowNo: 4, name: 'SDDifference', display: 'Arrival Day Diff.', type: 'text', ctrlCss: { width: '30px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, AutoCompleteName: 'Schedule_DiffDays', filterField: "SNo", addOnFunction: onDayDiffChange
                        },

                        { divRowNo: 5, name: 'ALTCarrierCode', display: 'Carrier Code', type: 'label', ctrlCss: { width: '40px', height: '20px' } },

                        { divRowNo: 5, name: 'ALTFlightNumber', display: 'Flight Number', type: 'text', ctrlAttr: { maxlength: 6, controltype: "alphanumeric" }, ctrlCss: { width: '40px', height: '20px' } }



                    ]
                },
                {
                    name: 'divLegValidity', display: 'Leg Validity', type: 'div', isRequired: false,
                    divElements: [{
                        divRowNo: 1, name: 'StartDate', display: 'Start Date', isRequired: true, type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', readonly: true }, onChange: function (evt, rowIndex) {

                            var CurrentUniqueIndex = $('#tblScheduleTrans').appendGrid('getUniqueIndex', rowIndex);
                            var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                            var CurrentValue = $(evt.currentTarget).val();
                            var EndDate = $('#tblScheduleTrans_EndDate_' + CurrentUniqueIndex + '').val();

                            if (CurrentValue != '' && EndDate != '') {
                                var SD = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                                var ED = EndDate.replace(/[^A-Z0-9-/]/ig, '');
                                var dfrom = new Date(Date.parse(SD));
                                var dto = new Date(Date.parse(ED));
                                if (dfrom > dto) {
                                    $(this).val("");
                                    CurrentValue = '';
                                }
                            }

                            $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                                var CurrentRowID = parseInt(this.id.split('_')[2]);
                                $('[id^=tblScheduleTrans_StartDate_' + CurrentRowID + ']').val(CurrentValue);
                                $('[id^=tblScheduleTrans_AllDays_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day1_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day2_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day3_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day4_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day5_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day6_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day7_' + CurrentRowID + ']').attr('checked', false);
                            });
                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    {
                        divRowNo: 1, name: 'EndDate', display: 'End Date', type: 'text', isRequired: true, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', readonly: true }, onChange: function (evt, rowIndex) {

                            var CurrentUniqueIndex = $('#tblScheduleTrans').appendGrid('getUniqueIndex', rowIndex);
                            var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                            var CurrentValue = $(evt.currentTarget).val();
                            var StartDate = $('#tblScheduleTrans_StartDate_' + CurrentUniqueIndex + '').val();

                            if (CurrentValue != '' && StartDate != '') {
                                var SD = StartDate.replace(/[^A-Z0-9-/]/ig, '');
                                var ED = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                                var dfrom = new Date(Date.parse(SD));
                                var dto = new Date(Date.parse(ED));
                                if (dfrom > dto) {
                                    $(this).val("");
                                    CurrentValue = '';
                                }
                            }

                            $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                                var CurrentRowID = parseInt(this.id.split('_')[2]);
                                $('[id^=tblScheduleTrans_EndDate_' + CurrentRowID + ']').val(CurrentValue);
                                $('[id^=tblScheduleTrans_AllDays_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day1_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day2_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day3_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day4_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day5_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day6_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day7_' + CurrentRowID + ']').attr('checked', false);
                            });

                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    { divRowNo: 2, name: 'lblIsCAO', value: 'Freighter', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: pageType != 'READ' ? 'IsCAO' : 'CAO', display: null, type: 'radiolist', ctrlCss: { width: '80px', height: '20px' }, ctrlOptions: { 0: 'No', 1: 'Yes' }, onClick: function (evt, rowIndex) { CheckCAO(evt, rowIndex); }, },//selectedIndex: 0
                    {
                        divRowNo: 2, name: 'AirCraft', display: 'Aircraft', type: 'text', isRequired: true, ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, AutoCompleteName: 'Schedule_Aircraft', filterField: 'AircraftType', addOnFunction: populateValueCell
                        //tableName: 'vwAirlinewiseAircraft', textColumn: 'AircraftType', keyColumn: 'SNo',
                    },

                    {
                        divRowNo: 3, name: 'FlightType', display: 'Flight Type', type: 'text', value: '', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: false, AutoCompleteName: 'Schedule_FlightType', filterField: 'FlightTypeName', //tableName: 'FlightType', textColumn: 'FlightTypeName', keyColumn: 'SNo',
                    },

                    //{
                    //    divRowNo: 3, name: 'lblfresalecapcity', value:null, type: 'label', ctrlCss: { 'font-weight': 'bold' }
                    //},

                    {
                        divRowNo: 3, name: 'lblCodeShare', value: 'Code Share', formatter: myformatter, type: 'label', ctrlCss: { 'font-weight': 'bold' }
                    },
                    {
                        divRowNo: 3, name: pageType != 'READ' ? 'IsCodeShare' : 'CodeShare', nameFormatter: 'IsCodeShare',
                        display: null, type: 'checkbox', formatter: myformatter, onClick: function (evt, rowIndex) {
                            var ID = $(evt.currentTarget).attr('id').split('_')[2];
                            CheckIsCodeShareCheck(evt, ID);
                        }
                    },

                    //  {
                    //name: 'Capacity', display: 'Capacity', type: 'div', isRequired: false,
                    //divElement:[
                    {
                        divRowNo: 4, name: 'CodeShareCarrierCode', display: 'Carrier Code', type: 'text', isRequired: true, ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete', onSelect: "return checkMainCarrierCode(this.id)" }, AutoCompleteName: 'Schedule_CarrierCode', filterField: 'CarrierCode',// textColumn: 'CarrierCode', keyColumn: 'SNo'

                    },
                    {
                        divRowNo: 4, name: 'CodeShareFlightNumber', display: 'Flight No', type: 'text', isRequired: true, ctrlAttr: { maxlength: 4, minlength: 4, controltype: "alphanumeric", onblur: "return checkMainFlightNo(this.id)" }, ctrlCss: { width: '70px', height: '20px' }



                    }
                        //}],
                        // },
                    ]
                },


                // added by VSingh Flight Capacity details 
                // {
                //  name: 'Capacity', display: '', type: 'div', isRequired: false,
                //  divElements: [

                //{ divRowNo: 1, name: pageType != 'READ' ? 'IsCodeShare' : 'True', display: 'IsCodeShare', type: 'checkbox', onClick: function (evt, rowIndex) { CheckIsCodeShareCheck(evt, rowIndex); } },
                // { divRowNo: 1, name: 'IsCodeShare', value: 'IsCodeShare', type: 'label', ctrlCss: { 'font-weight': 'bold' },},
                //{
                //    divRowNo: 1, name: 'CodeShareCarrierCode', display: 'CodeShareCarrierCode', type: 'text',  value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, tableName: 'viewAirline', textColumn: 'CarrierCode', keyColumn: 'SNo', addOnFunction: getFlightnumber

                //},
                //   {
                //       divRowNo: 2, name: 'CodeShareFlightNumber', display: 'CodeShareFlightNumber', type: 'text',  value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                //   },
                //{
                //    divRowNo: 3, name:pageType == 'READ'? 'CodeShareFlightNo':'CodeShareFlightNo', display: 'CodeShareFlightNo', type: 'text',  value: '', ctrlAttr: { maxlength: 8, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                //},


                //{
                //    divRowNo: 4, name: '', display: 'CodeShareFlightNo', type: 'text', isRequired: true, value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                //},
                //  ] },
                // added by VSingh Flight Capacity details 


                //{ divRowNo: 3, name: 'IsCodeShare', display: 'IsCodeShare', type: 'checkbox', value: '', isRequired: false,}]
                // },
                {
                    name: 'divAllocation', display: 'Allocation', type: 'div', isRequired: false,
                    divElements: [
                        { divRowNo: 1, name: 'AllocatedGrossWeight', display: 'AC. Gr. Wt.', type: 'text', value: 0, isRequired: true, ctrlAttr: { maxlength: 18, controltype: 'decimal2', readonly: true, onblur: "return onChangeGross(this.id);" }, ctrlCss: { width: '70px' }, },
                        {
                            divRowNo: 1, name: 'UMG', display: null, type: 'text', value: '', ctrlAttr: { controltype: 'uppercase', maxlength: 1, minlength: 1, onmousedown: "return CheckUMenter(event,this.id);", onblur: "return CheckUMtype(this.id);" }, ctrlCss: { width: '50px', height: '20px' }
                        },
                        { divRowNo: 1, name: 'AllocatedVolumeWeight', display: 'AC. Vol. (CBM)', type: 'text', value: 0, isRequired: true, ctrlAttr: { maxlength: 18, controltype: 'decimal3', readonly: true, onblur: "return onChangeVol(this.id);" }, ctrlCss: { width: '70px' }, },
                        {
                            divRowNo: 1, name: 'UMV', display: null, type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 3 }, ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 2, name: 'FreeSaleCapacity', display: 'FS Wt.', type: 'text', value: 0, isRequired: false, ctrlAttr: { controltype: 'decimal2', maxlength: 8, readonly: true, minlength: 3, onblur: "return CheckRageFSCCapacity(this.id);" }, ctrlCss: { width: '70px', height: '20px' }
                        },
                        {
                            divRowNo: 2, name: 'FSCapPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 2, name: 'FreeSaleCapacityVol', display: 'FS (CBM)', type: 'text', value: 0, isRequired: false, ctrlAttr: { controltype: 'decimal3', maxlength: 8, minlength: 2, readonly: true, onblur: "return CheckRageFSCCapacityVol(this.id);" }, ctrlCss: { width: '70px', height: '20px' }
                        },
                        {
                            divRowNo: 2, name: 'FSVolPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },

                        {
                            divRowNo: 3, name: 'ReservedCapacity', display: 'RS Wt.', type: 'text', value: 0, isRequired: false, ctrlAttr: { maxlength: 4, controltype: 'decimal2', readonly: true, onblur: "return CheckRageRSCapacity(this.id);" }, ctrlCss: { width: '70px' }
                        },
                        {
                            divRowNo: 3, name: 'RSCapPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 3, name: 'ReservedCapacityVol', display: 'RS (CBM)', type: 'text', value: 0, isRequired: false, ctrlAttr: { maxlength: 4, controltype: 'decimal3', readonly: true, onblur: "return CheckRageRSCapacityVol(this.id);" }, ctrlCss: { width: '70px' }
                        },
                        {
                            divRowNo: 3, name: 'RSVolPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 4, name: 'OverBookingCapacity', display: 'OB Wt.', type: 'text', value: 0, isRequired: false, ctrlAttr: { controltype: 'decimal2', maxlength: 8, readonly: true, minlength: 2, onblur: "return CheckRageOBCCapacity(this.id);", }, ctrlCss: { width: '70px', height: '20px' }
                        },
                        {
                            divRowNo: 4, name: 'OBCapPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 4, name: 'OverBookingCapacityVol', display: 'OB (CBM)', type: 'text', value: 0, isRequired: false, ctrlAttr: { controltype: 'decimal3', maxlength: 8, readonly: true, minlength: 2, onblur: "return CheckRageOBCCapacityVol(this.id);" }, ctrlCss: { width: '70px', height: '20px' }
                        },
                        {
                            divRowNo: 4, name: 'OBVolPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 5, name: 'MaxGrossPerPcs', display: 'Gr. / Piece', type: 'text', value: 0, isRequired: true, ctrlAttr: { maxlength: 4, controltype: 'number', readonly: false }, ctrlCss: { width: '70px' }
                        },
                        {
                            divRowNo: 5, display: null, type: 'label', value: '', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 5, name: 'MaxVolumePerPcs', display: 'Vol. / Piece', type: 'text', value: 0, isRequired: true, ctrlAttr: { maxlength: 4, controltype: 'decimal3', readonly: false }, ctrlCss: { width: '70px' }
                        },
                        {
                            divRowNo: 5, display: null, type: 'label', value: '', ctrlCss: { width: '50px', height: '20px' }
                        }

                    ]
                },

                {
                    name: 'divDays', display: 'Frequency', type: 'div', isRequired: false,
                    divElements: [{
                        divRowNo: 1, name: pageType != 'READ' ? 'AllDays' : 'AllDay', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                            var num = evt.currentTarget.id;
                            $('input:checkbox[id*="_' + (evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '')) + '"]').each(function () {
                                if (this.id != 'tbl' + dbTableName + '_IsFirstLeg_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') && (this.id == 'tbl' + dbTableName + '_AllDays_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day1_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day2_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day3_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day4_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day5_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day6_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day7_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_AllDays_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '')))
                                    this.checked = $('input[id*="AllDays_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') + '"]:checked').val() != undefined;
                            });
                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    {
                        divRowNo: 1, name: pageType != 'READ' ? 'Day1' : 'Sun', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                            if ($('input[id*="tbl' + dbTableName + '_Day1_' + (rowIndex + 1) + '"]:checked').val() == undefined)
                                $('input[id*="AllDays_' + (rowIndex + 1) + '"]:checked').val('off');
                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    {
                        divRowNo: 1, name: pageType != 'READ' ? 'Day2' : 'Mon', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day3' : 'Tue', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day4' : 'Wed', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day5' : 'Thu', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day6' : 'Fri', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day7' : 'Sat', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 2, name: 'lblAllDays', value: 'Days', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay1', value: 'Sun', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay2', value: 'Mon', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay3', value: 'Tue', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay4', value: 'Wed', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay5', value: 'Thu', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay6', value: 'Fri', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay7', value: 'Sat', type: 'label', ctrlCss: { 'font-weight': 'bold' } }
                        //{ divRowNo: 3, name: 'lblIsActive', cSpan: 2, value: 'Active', type: 'label', ctrlCss: { 'font-weight': 'bold' } },

                        //{ divRowNo: 3, name: pageType != 'READ' ? 'IsActive' : 'Active', display: null, cSpan: 3, type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' } },//selectedIndex: 1 
                        //{ divRowNo: 3, name: 'lblIsFirstLeg', cSpan: 2, value: 'First Leg', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                        //{ divRowNo: 3, name: pageType != 'READ' ? 'IsFirstLeg' : 'FirstLeg', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckFirstLeg(evt, rowIndex); } }, 

                        //{ divRowNo: 4, name: 'lblNoOfStop', cSpan: 2, value: 'Stops', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                        //{ divRowNo: 4, name: 'NoOfStop', value: 0, display: null, type: 'text', ctrlAttr: { maxlength: 1, controltype: 'number' }, ctrlCss: { width: '25px' }, isRequired: false }
                    ]
                }
                    ,
                {
                    name: 'divLegs', display: 'Add Legs', type: 'div', isRequired: false,
                    divElements: [
                        { divRowNo: 1, name: 'Routing', type: 'hidden', value: $('#hdnRouting').val() },
                        {
                            divRowNo: 2, name: pageType != 'READ' ? 'Addlegs' : '', type: 'button', value: 'Add Legs', onClick: function (evt, rowIndex) {

                                var CurrentRowIndex = this.uIndex;
                                var AddLegRows = $('[id^=tblScheduleTrans_AddLegNo_][value="0"]').length;
                                var AfterRows = parseInt($('#tblScheduleTrans tbody tr[id]:last').attr('id').split('-')[2]);
                                LastAddLegNo = parseInt($('[id^=tblScheduleTrans_AddLegNo_]:last').val());
                                var LegsID = [];
                                $('[id^=tblScheduleTrans_AddLegNo_][value="0"]').map(function () {
                                    LegsID.push(this.id.split('_')[2]);
                                });

                                if (!validateTableData('tblScheduleTrans', CurrentRowIndex)) {
                                    return false;
                                }

                                var v = $('#tblScheduleTrans').appendGrid('insertRow', AddLegRows, AfterRows + 1);
                                onEtdBlur();
                                onEtaBlur();

                                var Pcount = 1;
                                $('#tblScheduleTrans tbody tr[id]:nth-last-child(-n+' + AddLegRows + ')').map(function () {
                                    var nextID = this.id.split('_')[2];
                                    var ParentID = '';
                                    var Scount = 1;
                                    $.each(LegsID, function (id, PID) {
                                        if (Scount == Pcount) {
                                            ParentID = PID;
                                        }
                                        Scount = Scount + 1;
                                    });
                                    Pcount = Pcount + 1;

                                    if (nextID > 0) {
                                        $('#tblScheduleTrans_SNo_' + nextID).val(0);
                                        $('#tblScheduleTrans_ScheduleSNo_' + nextID).val($('#tblScheduleTrans_ScheduleSNo_' + ParentID).val());
                                        $('#tblScheduleTrans_HdnOrigin_' + nextID).val($('#tblScheduleTrans_HdnOrigin_' + ParentID).val());
                                        $('#tblScheduleTrans_HdnDestination_' + nextID).val($('#tblScheduleTrans_HdnDestination_' + ParentID).val());
                                        $('#tblScheduleTrans_ScheduleType_' + nextID).val($('#tblScheduleTrans_ScheduleType_' + ParentID).val());
                                        $('#tblScheduleTrans_FlightNo_' + nextID).val($('#tblScheduleTrans_FlightNo_' + ParentID).val());
                                        $('#tblScheduleTrans_Routing_' + nextID).val($('#tblScheduleTrans_Routing_' + ParentID).val());
                                        $('#tblScheduleTrans_Origin_' + nextID).val($('#tblScheduleTrans_Origin_' + ParentID).val());
                                        $('#tblScheduleTrans_Destination_' + nextID).val($('#tblScheduleTrans_Destination_' + ParentID).val());
                                        /*  //Added By Brajendra
                                        var date = new Date(data.EndDate);
                                        var newdate = new Date(date);
                                        var dd = newdate.getDate();
                                        var mm = newdate.getMonth();
                                        var y = newdate.getFullYear();
                                        var months = new Array(12);
                                        months[0] = "Jan";
                                        months[1] = "Feb";
                                        months[2] = "Mar";
                                        months[3] = "Apr";
                                        months[4] = "May";
                                        months[5] = "Jun";
                                        months[6] = "Jul";
                                        months[7] = "Aug";
                                        months[8] = "Sep";
                                        months[9] = "Oct";
                                        months[10] = "Nov";
                                        months[11] = "Dec";
                                        var someFormattedDate = dd + '-' + months[mm] + '-' + y;
                                        //Ended */
                                        $('#tblScheduleTrans_EndDate_' + nextID).data("kendoDatePicker").min($("#FStartDate").val());
                                        $('#tblScheduleTrans_EndDate_' + nextID).data("kendoDatePicker").max($("#FEndDate").val());
                                        $('#tblScheduleTrans_StartDate_' + nextID).data("kendoDatePicker").min($("#FStartDate").val());
                                        $('#tblScheduleTrans_StartDate_' + nextID).data("kendoDatePicker").max($("#FEndDate").val());
                                        $('#tblScheduleTrans_StartDate_' + nextID).val('');//$("#FStartDate").val() //someFormattedDate
                                        $('#tblScheduleTrans_EndDate_' + nextID).val('');//$("#FEndDate").val() //someFormattedDate 
                                        $('#tblScheduleTrans_DeleteLegs_' + nextID).show();
                                        //$('#tblScheduleTrans_HdnParentID_' + nextID).val($('#tblScheduleTrans').appendGrid('getRowOrder')[rowIndex].toString());
                                        //$('#tblScheduleTrans_HdnParentID_' + $('#tblScheduleTrans').appendGrid('getRowOrder')[rowIndex].toString()).val(nextID); 
                                        $("[id$='tblScheduleTrans_ALTCarrierCode_" + nextID + "']").text($('#CarrierCode').val().split('-')[2].trim());
                                        $("[id$='tblScheduleTrans_ALTFlightNumber_" + nextID + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase()).prop("readonly", true);;
                                        $("input[name=tblScheduleTrans_RbtnIsCAO_" + nextID + "][value=" + $("input[name=tblScheduleTrans_RbtnIsCAO_" + ParentID + "]:checked").val() + "]").attr("checked", 'checked');
                                        $("input[name=tblScheduleTrans_RbtnIsCharter_" + nextID + "][value=" + $("input[name=tblScheduleTrans_RbtnIsCharter_" + ParentID + "]:checked").val() + "]").attr("checked", 'checked');
                                        $("#tblScheduleTrans_HdnCodeShareCarrierCode_" + nextID).val($("#tblScheduleTrans_HdnCodeShareCarrierCode_" + ParentID).val())
                                        $("#tblScheduleTrans_CodeShareCarrierCode_" + nextID).val($("#tblScheduleTrans_CodeShareCarrierCode_" + ParentID).val());
                                        $("#tblScheduleTrans_CodeShareFlightNumber_" + nextID).val($("#tblScheduleTrans_CodeShareFlightNumber_" + ParentID).val());
                                        $("#tblScheduleTrans_HdnDayDifference_" + nextID).val($("#tblScheduleTrans_HdnDayDifference_" + ParentID).val());
                                        $("#tblScheduleTrans_DayDifference_" + nextID).val($("#tblScheduleTrans_DayDifference_" + ParentID).val());
                                        $("#tblScheduleTrans_HdnSDDifference_" + nextID).val($("#tblScheduleTrans_HdnSDDifference_" + ParentID).val());
                                        $("#tblScheduleTrans_SDDifference_" + nextID).val($("#tblScheduleTrans_SDDifference_" + ParentID).val());
                                        $('#tblScheduleTrans_FlightType_' + nextID).val($('#tblScheduleTrans_FlightType_' + ParentID).val());
                                        $('#tblScheduleTrans_HdnFlightType_' + nextID).val($('#tblScheduleTrans_HdnFlightType_' + ParentID).val());
                                        $('#tblScheduleTrans_AirCraft_' + nextID).val($('#tblScheduleTrans_AirCraft_' + ParentID).val());
                                        $('#tblScheduleTrans_HdnAirCraft_' + nextID).val($('#tblScheduleTrans_HdnAirCraft_' + ParentID).val());
                                        $('#tblScheduleTrans_UMG_' + nextID).val($('#tblScheduleTrans_UMG_' + ParentID).val()).attr('disabled', 'disabled');
                                        $('#tblScheduleTrans_UMV_' + nextID).val($('#tblScheduleTrans_UMV_' + ParentID).val()).attr('disabled', 'disabled');
                                        $('#_temptblScheduleTrans_AllocatedGrossWeight_' + nextID).val($('#_temptblScheduleTrans_AllocatedGrossWeight_' + ParentID).val());
                                        $('#tblScheduleTrans_AllocatedGrossWeight_' + nextID).val($('#tblScheduleTrans_AllocatedGrossWeight_' + ParentID).val());
                                        $('#_temptblScheduleTrans_AllocatedVolumeWeight_' + nextID).val($('#_temptblScheduleTrans_AllocatedVolumeWeight_' + ParentID).val());
                                        $('#tblScheduleTrans_AllocatedVolumeWeight_' + nextID).val($('#tblScheduleTrans_AllocatedVolumeWeight_' + ParentID).val());
                                        $('#_temptblScheduleTrans_FreeSaleCapacity_' + nextID).val($('#_temptblScheduleTrans_FreeSaleCapacity_' + ParentID).val());
                                        $('#tblScheduleTrans_FreeSaleCapacity_' + nextID).val($('#tblScheduleTrans_FreeSaleCapacity_' + ParentID).val());
                                        $('#_temptblScheduleTrans_FreeSaleCapacityVol_' + nextID).val($('#_temptblScheduleTrans_FreeSaleCapacityVol_' + ParentID).val());
                                        $('#tblScheduleTrans_FreeSaleCapacityVol_' + nextID).val($('#tblScheduleTrans_FreeSaleCapacityVol_' + ParentID).val());
                                        $('#_temptblScheduleTrans_ReservedCapacity_' + nextID).val($('#_temptblScheduleTrans_ReservedCapacity_' + ParentID).val());
                                        $('#tblScheduleTrans_ReservedCapacity_' + nextID).val($('#tblScheduleTrans_ReservedCapacity_' + ParentID).val());
                                        $('#_temptblScheduleTrans_ReservedCapacityVol_' + nextID).val($('#_temptblScheduleTrans_ReservedCapacityVol_' + ParentID).val());
                                        $('#tblScheduleTrans_ReservedCapacityVol_' + nextID).val($('#tblScheduleTrans_ReservedCapacityVol_' + ParentID).val());
                                        $('#_temptblScheduleTrans_OverBookingCapacity_' + nextID).val($('#_temptblScheduleTrans_OverBookingCapacity_' + ParentID).val());
                                        $('#tblScheduleTrans_OverBookingCapacity_' + nextID).val($('#tblScheduleTrans_OverBookingCapacity_' + ParentID).val());
                                        $('#_temptblScheduleTrans_OverBookingCapacityVol_' + nextID).val($('#_temptblScheduleTrans_OverBookingCapacityVol_' + ParentID).val());
                                        $('#tblScheduleTrans_OverBookingCapacityVol_' + nextID).val($('#tblScheduleTrans_OverBookingCapacityVol_' + ParentID).val());
                                        $('#_temptblScheduleTrans_MaxGrossPerPcs_' + nextID).val($('#_temptblScheduleTrans_MaxGrossPerPcs_' + ParentID).val());
                                        $('#tblScheduleTrans_MaxGrossPerPcs_' + nextID).val($('#tblScheduleTrans_MaxGrossPerPcs_' + ParentID).val());
                                        $('#_temptblScheduleTrans_MaxVolumePerPcs_' + nextID).val($('#_temptblScheduleTrans_MaxVolumePerPcs_' + ParentID).val());
                                        $('#tblScheduleTrans_MaxVolumePerPcs_' + nextID).val($('#tblScheduleTrans_MaxVolumePerPcs_' + ParentID).val());
                                        $('#tblScheduleTrans_FSCapPr_' + nextID).text($('#tblScheduleTrans_FSCapPr_' + ParentID).text());
                                        $('#tblScheduleTrans_FSVolPr_' + nextID).text($('#tblScheduleTrans_FSVolPr_' + ParentID).text());
                                        $('#tblScheduleTrans_RSCapPr_' + nextID).text($('#tblScheduleTrans_RSCapPr_' + ParentID).text());
                                        $('#tblScheduleTrans_RSVolPr_' + nextID).text($('#tblScheduleTrans_RSVolPr_' + ParentID).text());
                                        $('#tblScheduleTrans_OBCapPr_' + nextID).text($('#tblScheduleTrans_OBCapPr_' + ParentID).text());
                                        $('#tblScheduleTrans_OBVolPr_' + nextID).text($('#tblScheduleTrans_OBVolPr_' + ParentID).text());
                                        $('#tblScheduleTrans_HdnLegId_' + nextID).val($('#tblScheduleTrans_HdnLegId_' + ParentID).val());
                                        $('#tblScheduleTrans_HdnIsLeg_' + nextID).val($('#tblScheduleTrans_HdnIsLeg_' + ParentID).val());
                                        $('#tblScheduleTrans_HdnDepartureSequence_' + nextID).val($('#tblScheduleTrans_HdnDepartureSequence_' + ParentID).val());
                                        $('#tblScheduleTrans_RowID_' + nextID).val(nextID);
                                        $('#tblScheduleTrans_AddLegNo_' + nextID).val(LastAddLegNo + 1);
                                        if ($('#tblScheduleTrans_HdnLegId_' + ParentID).val().toString().indexOf("1") >= 0) {
                                            //$('#tblScheduleTrans_DayDifference_' + nextID.toString()).attr("style", "pointer-events: none;");
                                            $("#tblScheduleTrans_HdnDayDifference_" + nextID).val('0');
                                            $("#tblScheduleTrans_DayDifference_" + nextID).val(0);
                                            $('#tblScheduleTrans_DayDifference_' + nextID.toString()).data("kendoAutoComplete").enable(false);
                                        }
                                        CheckIsCodeShareCheck(evt, nextID);
                                    }
                                });
                                if (!SetAllAircraft.hasOwnProperty(LastAddLegNo + 1)) {
                                    SetAllAircraft[parseInt(LastAddLegNo + 1)];
                                    SetAllAircraft[LastAddLegNo + 1] = { "AircraftFlag": true };

                                }
                            }
                        },
                        {
                            divRowNo: 3, name: pageType != 'READ' ? 'DeleteLegs' : '', type: 'button', value: 'Delete Legs', onClick: function (evt, rowIndex) {

                                LastAddLegNo = parseInt($('[id^=tblScheduleTrans_AddLegNo_]:last').val());

                                var CurrentUniqueIndex = $('#tblScheduleTrans').appendGrid('getUniqueIndex', rowIndex);
                                var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                                var RemoveRows = [];
                                delete SetAllAircraft[CurrentAddLegNo];
                                $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                                    RemoveRows.push(parseInt(this.id.split('_')[2]));
                                });

                                $.each(RemoveRows, function (i, RowUniqueIndex) {
                                    var CurrentRowIndex = $('#tblScheduleTrans').appendGrid('getRowIndex', RowUniqueIndex);
                                    $('#tblScheduleTrans').appendGrid('removeRow', CurrentRowIndex);

                                });
                            }

                        }]
                }

                ],
                rowUpdateExtraFunction: function (caller) {
                    $("input[id^=tblScheduleTrans_Origin]").each(function (i, el) {
                        if ($("#Text_Origin").text().toUpperCase() == $("#tblScheduleTrans_Origin_" + parseInt(i + 1)).val().toUpperCase()) {
                            $("[id$='tblScheduleTrans_ALTFlightNumber_" + parseInt(i + 1) + "']").prop("readonly", true);
                        }

                    });

                },
                isPaging: false,
                hideButtons: {
                    remove: true,
                    removeLast: true,
                    insert: true,
                    append: true,
                    update: true,
                    updateAll: true
                },

                afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                    //$('#tblScheduleTrans').appendGrid('hideColumn', 'Add Legs');
                    countLeg = addedRowIndex;



                    // added by arman ali
                    // $("[id*='tblScheduleTrans_Addlegs_']").addClass('btn btn-success');
                    // $("[id*='tblScheduleTrans_DeleteLegs']").addClass('btn btn-danger');
                    //  $("[id*='tblScheduleTrans_CodeShareFlightNumber_']").attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
                    // for removing blank rows
                    //  $("[id*='tabledivLegs'] :hidden").closest('tr').hide();
                    //  $("[id*='tabledivLegs'] [style*='none']").closest('tr').hide();

                    // end

                    onEtdBlur();
                    onEtaBlur();
                    //.not($("input[id^=tblScheduleTrans_HdnAddLeg_][value='1']").parent().parent().find("input[id^=tblScheduleTrans_ETD_]"))

                    /*
                    $("input[id^=tblScheduleTrans_EndDate_]").blur(function (e) {
                        //var Index = this.id.split('_')[2];
                        //var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
                        //var dto = new Date(Date.parse(k));
                        //var validFrom = $(this).attr("id").replace("tblScheduleTrans_EndDate_", "tblScheduleTrans_StartDate_");
                        //k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
                        //var dfrom = new Date(Date.parse(k));
                        //$("input[id^=tblScheduleTrans_EndDate_" + Index + "]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));

                        //if (dfrom > dto)
                        //    $(this).val("");


                        var CurrentUniqueIndex = this.id.split('_')[2];
                        var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                        var CurrentValue = $(this).val();
                        var StartDate = $('#tblScheduleTrans_StartDate_' + CurrentUniqueIndex + '').val();
                        var rowIndex = $('#tblScheduleTrans').appendGrid('getRowIndex', CurrentUniqueIndex);

                        if (CurrentValue != '' && StartDate != '') {
                            var SD = StartDate.replace(/[^A-Z0-9-/]/ig, '');
                            var ED = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                            var dfrom = new Date(Date.parse(SD));
                            var dto = new Date(Date.parse(ED));
                            if (dfrom > dto) {
                                $(this).val("");
                                CurrentValue = '';
                            }
                        }

                        $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                            var CurrentRowID = parseInt(this.id.split('_')[2]);
                            $('[id^=tblScheduleTrans_EndDate_' + CurrentRowID + ']').val(CurrentValue);
                        });

                        CheckBoxDuplicateCheck(evt, rowIndex);

                    });

                    $("input[id^=tblScheduleTrans_StartDate]").blur(function (e) {
                        //var Index = this.id.split('_')[2];
                        //var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
                        //var dfrom = new Date(Date.parse(k));
                        //var validFrom = $(this).attr("id").replace("tblScheduleTrans_StartDate_", "tblScheduleTrans_EndDate_");
                        //k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
                        //var dto = new Date(Date.parse(k));
                        //$("input[id^=tblScheduleTrans_StartDate_" + Index + "]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
                        //if (dfrom > dto)
                        //    $(this).val("");



                        var CurrentUniqueIndex = this.id.split('_')[2];
                        var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                        var CurrentValue = $(this).val();
                        var EndDate = $('#tblScheduleTrans_EndDate_' + CurrentUniqueIndex + '').val();
                        var rowIndex = $('#tblScheduleTrans').appendGrid('getRowIndex', CurrentUniqueIndex);
                        if (CurrentValue != '' && EndDate != '') {
                            var SD = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                            var ED = EndDate.replace(/[^A-Z0-9-/]/ig, '');
                            var dfrom = new Date(Date.parse(SD));
                            var dto = new Date(Date.parse(ED));
                            if (dfrom > dto) {
                                $(this).val("");
                                CurrentValue = '';
                            }
                        }

                        $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                            var CurrentRowID = parseInt(this.id.split('_')[2]);
                            $('[id^=tblScheduleTrans_StartDate_' + CurrentRowID + ']').val(CurrentValue);
                        });
                        CheckBoxDuplicateCheck(evt, rowIndex);
                    }); */

                    if ($("#Text_Destination").text() == $('#ViaRoute').val()) {
                        //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                        // $('#tblScheduleTrans_DayDifference_' + parseInt(addedRowIndex + 1).toString()).prop('disabled', 'disabled');
                        $("#tblScheduleTrans_HdnDayDifference_" + parseInt(addedRowIndex + 1).toString()).val('0');
                        $("#tblScheduleTrans_DayDifference_" + parseInt(addedRowIndex + 1).toString()).val(0);
                        $('#tblScheduleTrans_DayDifference_' + parseInt(addedRowIndex + 1).toString()).data("kendoAutoComplete").enable(false);
                    }

                    //if (pageType == 'READ') {
                    //    
                    //    for (var i = 1; i <= addedRowIndex.length; i++) {
                    //        var index = '#tblScheduleTrans_IsCodeShare_'+ i;

                    //    //$('#tblScheduleTrans_IsCodeShare_1').text();
                    //    alert(index);
                    //    alert($(index).text());
                    //    var value = $('#tblScheduleTrans_IsCodeShare_' + i ).text();
                    //    if (value == 'false') {
                    //        $("#tableCapacity" + i).hide();
                    //    }
                    //    else {
                    //        $("#tableCapacity" + i).show();
                    //    }
                    //    }
                    //}
                    //if (pageType == 'EDIT') {
                    //    
                    //    //$('#tblScheduleTrans_IsCodeShare_1').text();
                    //    for (var i = 1; i <= addedRowIndex.length; i++) {
                    //        var index = '#tblScheduleTrans_IsCodeShare_' + i;

                    //        //$('#tblScheduleTrans_IsCodeShare_1').text();

                    //        var value = $('#tblScheduleTrans_IsCodeShare_' + i).text();
                    //        if (value == 'false') {
                    //            $("#tableCapacity" + i).hide();
                    //        }
                    //        else {
                    //            $("#tableCapacity" + i).show();
                    //        }
                    //    }


                    //  }

                    if (pageType == 'NEW') {
                        var legs = $('span#Routing').text().split('-');
                        var legssno = $('#Origin').val();
                        var mviaroute = $('#Multi_ViaRoute').val();
                        if (mviaroute.length > 0)
                            legssno = legssno + ',' + mviaroute;

                        legssno = legssno + ',' + $('#Destination').val();
                        legssno = legssno.replace(",,", ",");
                        var legID = legssno.split(',');
                        var legvalOne = 0;
                        var legvalTwo = 1;
                        var i = 0;
                        for (var K = 0; K < legs.length - 1; K++) {
                            i = K + 1;
                            $("[id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").text($("#Text_CarrierCode").val());
                            $("[type='hidden'][id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").val($("#Text_CarrierCode").val());

                            $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase()).prop("readonly", true);;

                            if ($("#Text_Origin").val().toUpperCase() == legs[K].toUpperCase()) {
                                $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").prop("readonly", true);
                            }

                            $("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + i + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val());

                            CheckIsCodeShareCheck(this, i)

                            $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[K]);
                            $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[K]);
                            $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('');
                            $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                            $("#tblScheduleTrans_HdnSDDifference_" + i.toString()).val('');
                            $("#tblScheduleTrans_SDDifference_" + i.toString()).val(0);
                            //$('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                            //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                            $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[i]);
                            $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[i]);
                            $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                            $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());

                            $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").enable(false);
                            $('#tblScheduleTrans_EndDate_' + i.toString()).removeAttr('disabled');
                            $('#tblScheduleTrans_StartDate_' + i.toString()).data("kendoDatePicker").enable(false);
                            $('#tblScheduleTrans_StartDate_' + i.toString()).removeAttr('disabled');
                            $('input[id^=tblScheduleTrans_RbtnIsActive_' + i.toString() + ']').attr('readonly', true);
                            $('#tblScheduleTrans_HdnLegId_' + i.toString()).val(i.toString());
                            $('#tblScheduleTrans_HdnIsLeg_' + i.toString()).val(1);
                            $('#tblScheduleTrans_AddLegNo_' + i.toString()).val("0");
                            $('#tblScheduleTrans_RowID_' + i.toString()).val(i.toString());
                            if (i.toString() === "1") {
                                //$('#tblScheduleTrans_DayDifference_' + i.toString()).attr("style", "pointer-events: none;");
                                $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('0');
                                $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                                $('#tblScheduleTrans_DayDifference_' + i.toString()).data("kendoAutoComplete").enable(false);
                            }
                        }

                        // Segment has not been creating now 
                        //22-Sep-2017 Commented By Pankaj Khanna
                        if (IsAddLeg) {
                            for (var k = 0; k < legs.length - 1; k++) {
                                for (var j = k + 1; j < legs.length - 1; j++) {
                                    i = i + 1;

                                    $("[id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").text($("#Text_CarrierCode").val());
                                    $("[type='hidden'][id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").val($("#Text_CarrierCode").val());

                                    $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase()).prop("readonly", true);;
                                    if ($("#Text_Origin").val().toUpperCase() == legs[k].toUpperCase()) {
                                        $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").prop("readonly", true);
                                    }

                                    $("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + i + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val());

                                    CheckIsCodeShareCheck(this, i)


                                    $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[k]);
                                    $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[k]);
                                    $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('');
                                    $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                                    $("#tblScheduleTrans_HdnSDDifference_" + i.toString()).val('');
                                    $("#tblScheduleTrans_SDDifference_" + i.toString()).val(0);
                                    //$('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                                    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                                    $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[j + 1]);
                                    $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[j + 1]);
                                    $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                                    $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());

                                    $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").enable(false);
                                    $('#tblScheduleTrans_EndDate_' + i.toString()).removeAttr('disabled');
                                    $('#tblScheduleTrans_StartDate_' + i.toString()).data("kendoDatePicker").enable(false);
                                    $('#tblScheduleTrans_StartDate_' + i.toString()).removeAttr('disabled');
                                    $('input[id^=tblScheduleTrans_RbtnIsActive_' + i.toString() + ']').attr('readonly', true);
                                    $('#tblScheduleTrans_HdnLegId_' + i.toString()).val((k + 1).toString() + (j + 1).toString());
                                    $('#tblScheduleTrans_HdnIsLeg_' + i.toString()).val(0);
                                    $('#tblScheduleTrans_AddLegNo_' + i.toString()).val("0");
                                    $('#tblScheduleTrans_RowID_' + i.toString()).val(i.toString());
                                    if ((k + 1).toString() === "1") {
                                        //$('#tblScheduleTrans_DayDifference_' + i.toString()).attr("style", "pointer-events: none;");
                                        $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('0');
                                        $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                                        $('#tblScheduleTrans_DayDifference_' + i.toString()).data("kendoAutoComplete").enable(false);
                                    }
                                }

                            }
                        }

                        //22-Sep-2017 Commented By Pankaj Khanna



                        //for (var i = 1; i <= addedRowIndex.length; i++) {

                        /*Added by Brajendra*/
                        //$("[id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").text($("#Text_CarrierCode").val());
                        //$("[type='hidden'][id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").val($("#Text_CarrierCode").val());

                        //$("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase());
                        //// $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").attr("disabled", true);
                        //if ($("#Text_Origin").val().toUpperCase() == legs[legvalOne].toUpperCase()) {
                        //    $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").prop("readonly", true);
                        //}

                        //$("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + i + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val());

                        //CheckIsCodeShareCheck(this, i)

                        //    /*Ended by Brajendra*/



                        //    if (i == 1 && (legs[legID.length - 1] != legs[legvalOne])) {
                        //        //  $('#tblScheduleTrans_StartDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                        //        //   $('#tblScheduleTrans_EndDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                        //        $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[legvalOne]);
                        //        $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[legvalOne]);
                        //        $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                        //        $('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                        //        $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[legID.length - 1]);

                        //        $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[legID.length - 1]);
                        //        //if($('#tblScheduleTrans_EndDate_' + i.toString()).val() == "")
                        //        $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                        //        $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());
                        //    }
                        //    else {


                        //        //    $('#tblScheduleTrans_StartDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                        //        //   $('#tblScheduleTrans_EndDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                        //        $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                        //        $('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                        //        $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[legvalOne]);
                        //        $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[legvalOne]);

                        //        $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[legvalTwo]);

                        //        $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[legvalTwo]);


                        //        //var todayDate = kendo.toString(kendo.parseDate($("#FEndDate").val()), 'MM/dd/yyyy');
                        //        //$("#StartDate").data("kendoDatePicker").value(todayDate);
                        //        // if ($('#tblScheduleTrans_EndDate_' + i.toString()).val() == "")

                        //        $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());
                        //        $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                        //        if (legvalOne == 0 && legvalTwo == legID.length - 2) {
                        //            legvalOne++;
                        //            legvalTwo = legvalOne + 1;
                        //        }
                        //        else if (legvalTwo == legID.length - 1) {
                        //            legvalOne++;
                        //            legvalTwo = legvalOne + 1;
                        //        }
                        //        else {
                        //            legvalTwo++;
                        //        }
                        //    }

                        //    //if ($('#ViaRoute').val() == '') {
                        //    //    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                        //    //    $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('disabled', 'disabled');

                        //    //}
                        //    //if (i == 1)
                        //    //{
                        //    //    $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val($('#Origin').val());
                        //    //    $('#tblScheduleTrans_HdnDestination_' + i.toString()).val($('#Destination').val());
                        //    //    $('#tblScheduleTrans_Origin_' + i.toString()).val($('#Text_Origin').val());
                        //    //    $('#tblScheduleTrans_Destination_' + i.toString()).val($('#Text_Destination').val());
                        //    //}
                        //    //else if(addedRowIndex > 0)
                        //    //{
                        //    //    //$("#tblScheduleTrans_Origin_" + addedRowIndex).data("kendoAutoComplete").enable(false);
                        //    //    //$("#tblScheduleTrans_Destination_" + addedRowIndex).data("kendoAutoComplete").enable(false);

                        //    //    if($('#tblScheduleTrans_HdnDestination_' + addedRowIndex ).val() == $('#Destination').val())
                        //    //    {
                        //    //        $('#tblScheduleTrans_HdnOrigin_' + (parseInt(addedRowIndex) + 1)).val($('#Origin').val());
                        //    //        $('#tblScheduleTrans_Origin_' + (parseInt(addedRowIndex) + 1)).val($('#Text_Origin').val());
                        //    //    }
                        //    //    else
                        //    //    {
                        //    //        $('#tblScheduleTrans_HdnOrigin_' + (parseInt(addedRowIndex) + 1)).val($('#tblScheduleTrans_HdnDestination_' + (addedRowIndex)).val());
                        //    //        $('#tblScheduleTrans_Origin_' + (parseInt(addedRowIndex) + 1)).val($('#tblScheduleTrans_Destination_' + (addedRowIndex)).val());
                        //    //    }
                        //    //}
                        //}
                    }
                    $('input:button[id*="tblScheduleTrans_DeleteLegs"]').each(function () {
                        if ($('#' + this.id.replace('tblScheduleTrans_DeleteLegs_', 'tblScheduleTrans_SNo_')).val() == "0")

                            $('#' + this.id).hide();
                    });

                },
                dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                    if (pageType == 'EDIT') {
                        //var legs = $('span#Routing').text().split('-');
                        //for (i = 1; i <= (legs.length - 1) ; i++)
                        // AircraftFlag = true;
                        $('#tblScheduleTrans tr[id]').each(function () {
                            var i = this.id.split('_')[2];
                            $('input[type=hidden][id=tblScheduleTrans_ALTCarrierCode_' + i.toString() + ']').val($('#tblScheduleTrans_ALTCarrierCode_' + i.toString()).val());
                            $('input[type=hidden][id=tblScheduleTrans_FlightNo_' + i.toString() + ']').val($('#tblScheduleTrans_ALTFlightNumber_' + i.toString()).val());
                            $('#tblScheduleTrans_ALTFlightNumber_' + i.toString()).attr('readonly', true);
                            $('input[id^=tblScheduleTrans_RbtnIsActive_' + i.toString() + ']').attr('readonly', true);

                            if ($('#tblScheduleTrans_HdnLegId_' + i.toString()).val().toString().indexOf("1") >= 0) {
                                // $('#tblScheduleTrans_DayDifference_' + i.toString()).attr("style", "pointer-events: none;");
                                $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('0');
                                $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                                $('#tblScheduleTrans_DayDifference_' + i.toString()).data("kendoAutoComplete").enable(false);
                            }

                            if (IsRemoveFlights == false) {
                                $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").enable(false);
                                $('#tblScheduleTrans_EndDate_' + i.toString()).removeAttr('disabled');
                                $('#tblScheduleTrans_StartDate_' + i.toString()).data("kendoDatePicker").enable(false);
                                $('#tblScheduleTrans_StartDate_' + i.toString()).removeAttr('disabled');
                            }

                            $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").min($('#FStartDate').val());
                            $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").max($('#FEndDate').val());
                            $('#tblScheduleTrans_StartDate_' + i.toString()).data("kendoDatePicker").min($('#FStartDate').val());
                            $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").max($('#FEndDate').val());

                            // to show percentage of flight capacity  
                            // Added by arman ali
                            // $("[id*='tabledivLegs'] :hidden").closest('tr').hide();
                            //  $("[id*='tabledivLegs'] [style*='none']").closest('tr').hide();
                            // end
                            //=================added by arman==============
                            checkcodeshare();
                            //====================End=======================
                            $('#tblScheduleTrans_UMV_' + i).attr("disabled", true);
                            $('#tblScheduleTrans_UMG_' + i).attr("disabled", true);
                            var fc = 'tblScheduleTrans_FreeSaleCapacity_' + i;
                            CheckRageFSCCapacity(fc);
                            var ob = 'tblScheduleTrans_OverBookingCapacity_' + i;
                            //7March2017
                            CheckRageOBCCapacity(ob);

                            var fcvol = 'tblScheduleTrans_FreeSaleCapacityVol_' + i;
                            CheckRageFSCCapacityVol(fcvol);
                            var obvol = 'tblScheduleTrans_OverBookingCapacityVol_' + i;
                            CheckRageOBCCapacityVol(obvol);

                            var RSCap = 'tblScheduleTrans_ReservedCapacity_' + i;
                            var RSCapVl = 'tblScheduleTrans_ReservedCapacityVol_' + i;
                            CheckRageRSCapacity(RSCap)
                            CheckRageRSCapacityVol(RSCapVl)
                            // to show percentage of flight capacity

                            //  grwt[i] = $('#tblScheduleTrans_AllocatedGrossWeight_'+i).val();
                            disable(i);

                            var AddLegNoD = $('#tblScheduleTrans_AddLegNo_' + i).val();
                            if (!SetAllAircraft.hasOwnProperty(AddLegNoD)) {
                                SetAllAircraft[parseInt(AddLegNoD)];
                                SetAllAircraft[AddLegNoD] = { "AircraftFlag": true };
                            }
                            // }
                        });

                        // if (legs.length == 2) {
                        //for (i = 1; i <= (legs.length) - 1; i++) {

                        //    disable(i);
                        //}


                        //}
                        //else {
                        //    for (i = 1; i <= (legs[0] != legs[legs.length - 1] ? (legs.length) : (legs.length) - 1) ; i++) {

                        //        disable(i);
                        //    }

                        //}
                    }
                },

            });

        }
        else {

            $('#tbl' + dbTableName).appendGrid({
                V2: true,
                tableID: 'tbl' + dbTableName,
                contentEditable: pageType != 'READ',
                tableColumns: 'FlightNo,Origin,ETD,Destination,ETA,StartDate,EndDate,DayLightSaving,AirCraft,AllocatedGrossWeight,AllocatedVolumeWeight,MaxGrossPerPcs,MaxVolumePerPcs,DayDifference,Sun,Mon,Tue,Wed,Thu,Fri,Sat,NoOfStop,FirstLeg,CAO,Routing,Active,IsCodeShare,CodeShareCarrierCode,CodeShareFlightNumber,CodeShareFlightNo,OverBookingCapacity,FreeSaleCapacity,OverBookingCapacityVol,OverBookingCapacityVol,UMG,UMV,Charter',
                masterTableSNo: $('#hdnScheduleSno').val(),
                currentPage: 1, itemsPerPage: 100, model: BindWhereCondition(), sort: '',
                servicePath: './Services/Schedule/ScheduleService.svc',//    ' + dbTableName + 'Service.svc',
                getRecordServiceMethod: 'Get' + dbTableName + 'Record',
                i18n: { customValidationMessage: "Kindly enter respective Schedule Details." },
                // createUpdateServiceMethod: 'createUpdate' + dbTableName,
                // deleteServiceMethod: 'delete' + dbTableName,
                caption: 'Schedule Detail',
                initData: "",
                OnUpdateSuccess: function (result) {
                    if (result[0].m_Item1 != undefined) {
                        if (result[0].m_Item2 == 0) {


                        } else {

                            setTimeout(function () { navigateUrl('Default.cshtml?Module=Schedule&Apps=Schedule&FormAction=INDEXVIEW') }, 3000);

                        }
                    }
                },
                initRows: GridGenerateRows,
                isGetRecord: IsGridRecordGet,
                // column for edit
                columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                { name: 'ScheduleSNo', type: 'hidden', value: $('#hdnScheduleSno').val() },
                { name: 'HdnOrigin', type: 'hidden' },
                { name: 'HdnParentID', type: 'hidden' },
                { name: 'HdnDestination', type: 'hidden' },
                { name: 'ALTCarrierCode', type: 'hidden' },
                { name: 'AddLegNo', type: 'hidden', value: "0" },
                { name: 'RowID', type: 'hidden', value: "0" },
                { name: 'HdnUMG', type: 'hidden' },
                { name: 'HdnUMV', type: 'hidden' },
                { name: 'Routing', type: 'hidden', value: $('#hdnRouting').val() },
                { name: 'HdnIsLeg', type: 'hidden' },
                { name: 'HdnLegId', type: 'hidden' },
                { name: 'ScheduleType', type: 'hidden', value: (isEmpty($('input:radio[name*="ScheduleType"]')) ? ($('#ScheduleTypeName').html() == 'Self' ? '0' : ($('#ScheduleTypeName').html() == 'SPA' ? '1' : '3')) : $('input:radio[name*="ScheduleType"]').val()) },
                { name: 'FlightNo', type: 'hidden' },
                { name: 'HdnDepartureSequence', type: 'hidden' },
                {
                    name: 'divZone', display: 'Time/Zone', type: 'div', isRequired: false,
                    divElements: [
                        { divRowNo: 1, name: 'Origin', display: 'Origin', type: 'text', value: '', ctrlAttr: { maxlength: 3, readonly: true }, ctrlCss: { width: '75px', }, isRequired: false },
                        {
                            divRowNo: 1, name: 'ETD', display: 'STD(HHMM)', type: 'text', isRequired: true, value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                        },
                        { divRowNo: 2, name: 'Destination', display: 'Destination', isRequired: false, type: 'text', value: '', ctrlAttr: { maxlength: 3, readonly: true }, ctrlCss: { width: '75px' } },
                        {
                            divRowNo: 2, name: 'ETA', display: 'STA(HHMM)', type: 'text', isRequired: true, value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                        },


                        { divRowNo: 3, name: pageType == 'EDIT' ? 'IsDayLightSaving' : 'DayLightSaving', display: 'Daylight Saving', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 0 },
                        { divRowNo: 3, name: pageType != 'READ' ? 'IsCharter' : 'Charter', display: 'Charter Flight', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 0, onClick: function (evt, rowIndex) { CheckCharter(evt, rowIndex); } },
                        {
                            divRowNo: 4, name: 'DayDifference', display: 'Departure Day Diff.', type: 'text', ctrlCss: { width: '30px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, AutoCompleteName: 'Schedule_DiffDays', filterField: "SNo", addOnFunction: onDayDiffChange
                        },
                        {
                            divRowNo: 4, name: 'SDDifference', display: 'Arrival Day Diff.', type: 'text', ctrlCss: { width: '30px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, AutoCompleteName: 'Schedule_DiffDays', filterField: "SNo", addOnFunction: onDayDiffChange
                        },

                        { divRowNo: 5, name: 'ALTCarrierCode', display: 'Carrier Code', type: 'label', ctrlCss: { width: '40px', height: '20px' } },

                        { divRowNo: 5, name: 'ALTFlightNumber', display: 'Flight Number', type: 'text', ctrlAttr: { maxlength: 6, controltype: "alphanumeric" }, ctrlCss: { width: '40px', height: '20px' } }



                    ]
                },
                {
                    name: 'divLegValidity', display: 'Leg Validity', type: 'div', isRequired: false,
                    divElements: [{
                        divRowNo: 1, name: 'StartDate', display: 'Start Date', isRequired: true, type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', readonly: true }, onChange: function (evt, rowIndex) {

                            var CurrentUniqueIndex = $('#tblScheduleTrans').appendGrid('getUniqueIndex', rowIndex);
                            var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                            var CurrentValue = $(evt.currentTarget).val();
                            var EndDate = $('#tblScheduleTrans_EndDate_' + CurrentUniqueIndex + '').val();

                            if (CurrentValue != '' && EndDate != '') {
                                var SD = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                                var ED = EndDate.replace(/[^A-Z0-9-/]/ig, '');
                                var dfrom = new Date(Date.parse(SD));
                                var dto = new Date(Date.parse(ED));
                                if (dfrom > dto) {
                                    $(this).val("");
                                    CurrentValue = '';
                                }
                            }

                            $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                                var CurrentRowID = parseInt(this.id.split('_')[2]);
                                $('[id^=tblScheduleTrans_StartDate_' + CurrentRowID + ']').val(CurrentValue);
                                $('[id^=tblScheduleTrans_AllDays_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day1_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day2_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day3_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day4_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day5_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day6_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day7_' + CurrentRowID + ']').attr('checked', false);
                            });
                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    {
                        divRowNo: 1, name: 'EndDate', display: 'End Date', type: 'text', isRequired: true, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', readonly: true }, onChange: function (evt, rowIndex) {

                            var CurrentUniqueIndex = $('#tblScheduleTrans').appendGrid('getUniqueIndex', rowIndex);
                            var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                            var CurrentValue = $(evt.currentTarget).val();
                            var StartDate = $('#tblScheduleTrans_StartDate_' + CurrentUniqueIndex + '').val();

                            if (CurrentValue != '' && StartDate != '') {
                                var SD = StartDate.replace(/[^A-Z0-9-/]/ig, '');
                                var ED = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                                var dfrom = new Date(Date.parse(SD));
                                var dto = new Date(Date.parse(ED));
                                if (dfrom > dto) {
                                    $(this).val("");
                                    CurrentValue = '';
                                }
                            }

                            $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                                var CurrentRowID = parseInt(this.id.split('_')[2]);
                                $('[id^=tblScheduleTrans_EndDate_' + CurrentRowID + ']').val(CurrentValue);
                                $('[id^=tblScheduleTrans_AllDays_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day1_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day2_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day3_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day4_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day5_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day6_' + CurrentRowID + ']').attr('checked', false);
                                $('[id^=tblScheduleTrans_Day7_' + CurrentRowID + ']').attr('checked', false);
                            });

                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    { divRowNo: 2, name: 'lblIsCAO', value: 'Freighter', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: pageType != 'READ' ? 'IsCAO' : 'CAO', display: null, type: 'radiolist', ctrlCss: { width: '80px', height: '20px' }, ctrlOptions: { 0: 'No', 1: 'Yes' }, onClick: function (evt, rowIndex) { CheckCAO(evt, rowIndex); }, },//selectedIndex: 0
                    {
                        divRowNo: 2, name: 'AirCraft', display: 'Aircraft', type: 'text', isRequired: true, ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, AutoCompleteName: 'Schedule_Aircraft', filterField: 'AircraftType', addOnFunction: populateValueCell
                        //tableName: 'vwAirlinewiseAircraft', textColumn: 'AircraftType', keyColumn: 'SNo',
                    },

                    {
                        divRowNo: 3, name: 'FlightType', display: 'Flight Type', type: 'text', value: '', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: false, AutoCompleteName: 'Schedule_FlightType', filterField: 'FlightTypeName', //tableName: 'FlightType', textColumn: 'FlightTypeName', keyColumn: 'SNo',
                    },

                    //{
                    //    divRowNo: 3, name: 'lblfresalecapcity', value:null, type: 'label', ctrlCss: { 'font-weight': 'bold' }
                    //},

                    {
                        divRowNo: 3, name: 'lblCodeShare', value: 'Code Share', formatter: myformatter, type: 'label', ctrlCss: { 'font-weight': 'bold' }
                    },
                    {
                        divRowNo: 3, name: pageType != 'READ' ? 'IsCodeShare' : 'CodeShare', nameFormatter: 'IsCodeShare',
                        display: null, type: 'checkbox', formatter: myformatter, onClick: function (evt, rowIndex) {
                            var ID = $(evt.currentTarget).attr('id').split('_')[2];
                            CheckIsCodeShareCheck(evt, ID);
                        }
                    },

                    //  {
                    //name: 'Capacity', display: 'Capacity', type: 'div', isRequired: false,
                    //divElement:[
                    {
                        divRowNo: 4, name: 'CodeShareCarrierCode', display: 'Carrier Code', type: 'text', isRequired: true, ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete', onSelect: "return checkMainCarrierCode(this.id)" }, AutoCompleteName: 'Schedule_CarrierCode', filterField: 'CarrierCode',// textColumn: 'CarrierCode', keyColumn: 'SNo'

                    },
                    {
                        divRowNo: 4, name: 'CodeShareFlightNumber', display: 'Flight No', type: 'text', isRequired: true, ctrlAttr: { maxlength: 4, minlength: 4, controltype: "alphanumeric", onblur: "return checkMainFlightNo(this.id)" }, ctrlCss: { width: '70px', height: '20px' }



                    }
                        //}],
                        // },
                    ]
                },


                // added by VSingh Flight Capacity details 
                // {
                //  name: 'Capacity', display: '', type: 'div', isRequired: false,
                //  divElements: [

                //{ divRowNo: 1, name: pageType != 'READ' ? 'IsCodeShare' : 'True', display: 'IsCodeShare', type: 'checkbox', onClick: function (evt, rowIndex) { CheckIsCodeShareCheck(evt, rowIndex); } },
                // { divRowNo: 1, name: 'IsCodeShare', value: 'IsCodeShare', type: 'label', ctrlCss: { 'font-weight': 'bold' },},
                //{
                //    divRowNo: 1, name: 'CodeShareCarrierCode', display: 'CodeShareCarrierCode', type: 'text',  value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, tableName: 'viewAirline', textColumn: 'CarrierCode', keyColumn: 'SNo', addOnFunction: getFlightnumber

                //},
                //   {
                //       divRowNo: 2, name: 'CodeShareFlightNumber', display: 'CodeShareFlightNumber', type: 'text',  value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                //   },
                //{
                //    divRowNo: 3, name:pageType == 'READ'? 'CodeShareFlightNo':'CodeShareFlightNo', display: 'CodeShareFlightNo', type: 'text',  value: '', ctrlAttr: { maxlength: 8, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                //},


                //{
                //    divRowNo: 4, name: '', display: 'CodeShareFlightNo', type: 'text', isRequired: true, value: '', ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }

                //},
                //  ] },
                // added by VSingh Flight Capacity details 


                //{ divRowNo: 3, name: 'IsCodeShare', display: 'IsCodeShare', type: 'checkbox', value: '', isRequired: false,}]
                // },
                {
                    name: 'divAllocation', display: 'Allocation', type: 'div', isRequired: false,
                    divElements: [
                        { divRowNo: 1, name: 'AllocatedGrossWeight', display: 'AC. Gr. Wt.', type: 'text', value: 0, isRequired: true, ctrlAttr: { maxlength: 18, controltype: 'decimal2', readonly: true, onblur: "return onChangeGross(this.id);" }, ctrlCss: { width: '70px' }, },
                        {
                            divRowNo: 1, name: 'UMG', display: null, type: 'text', value: '', ctrlAttr: { controltype: 'uppercase', maxlength: 1, minlength: 1, onmousedown: "return CheckUMenter(event,this.id);", onblur: "return CheckUMtype(this.id);" }, ctrlCss: { width: '50px', height: '20px' }
                        },
                        { divRowNo: 1, name: 'AllocatedVolumeWeight', display: 'AC. Vol. (CBM)', type: 'text', value: 0, isRequired: true, ctrlAttr: { maxlength: 18, controltype: 'decimal3', readonly: true, onblur: "return onChangeVol(this.id);" }, ctrlCss: { width: '70px' }, },
                        {
                            divRowNo: 1, name: 'UMV', display: null, type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 3 }, ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 2, name: 'FreeSaleCapacity', display: 'FS Wt.', type: 'text', value: 0, isRequired: false, ctrlAttr: { controltype: 'decimal2', maxlength: 8, readonly: true, minlength: 3, onblur: "return CheckRageFSCCapacity(this.id);" }, ctrlCss: { width: '70px', height: '20px' }
                        },
                        {
                            divRowNo: 2, name: 'FSCapPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 2, name: 'FreeSaleCapacityVol', display: 'FS (CBM)', type: 'text', value: 0, isRequired: false, ctrlAttr: { controltype: 'decimal3', maxlength: 8, minlength: 2, readonly: true, onblur: "return CheckRageFSCCapacityVol(this.id);" }, ctrlCss: { width: '70px', height: '20px' }
                        },
                        {
                            divRowNo: 2, name: 'FSVolPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },

                        {
                            divRowNo: 3, name: 'ReservedCapacity', display: 'RS Wt.', type: 'text', value: 0, isRequired: false, ctrlAttr: { maxlength: 4, controltype: 'decimal2', readonly: true, onblur: "return CheckRageRSCapacity(this.id);" }, ctrlCss: { width: '70px' }
                        },
                        {
                            divRowNo: 3, name: 'RSCapPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 3, name: 'ReservedCapacityVol', display: 'RS (CBM)', type: 'text', value: 0, isRequired: false, ctrlAttr: { maxlength: 4, controltype: 'decimal3', readonly: true, onblur: "return CheckRageRSCapacityVol(this.id);" }, ctrlCss: { width: '70px' }
                        },
                        {
                            divRowNo: 3, name: 'RSVolPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 4, name: 'OverBookingCapacity', display: 'OB Wt.', type: 'text', value: 0, isRequired: false, ctrlAttr: { controltype: 'decimal2', maxlength: 8, readonly: true, minlength: 2, onblur: "return CheckRageOBCCapacity(this.id);", }, ctrlCss: { width: '70px', height: '20px' }
                        },
                        {
                            divRowNo: 4, name: 'OBCapPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 4, name: 'OverBookingCapacityVol', display: 'OB (CBM)', type: 'text', value: 0, isRequired: false, ctrlAttr: { controltype: 'decimal3', maxlength: 8, readonly: true, minlength: 2, onblur: "return CheckRageOBCCapacityVol(this.id);" }, ctrlCss: { width: '70px', height: '20px' }
                        },
                        {
                            divRowNo: 4, name: 'OBVolPr', display: null, type: 'label', value: '0.00 %', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 5, name: 'MaxGrossPerPcs', display: 'Gr. / Piece', type: 'text', value: 0, isRequired: true, ctrlAttr: { maxlength: 4, controltype: 'number', readonly: false }, ctrlCss: { width: '70px' }
                        },
                        {
                            divRowNo: 5, display: null, type: 'label', value: '', ctrlCss: { width: '50px', height: '20px' }
                        },
                        {
                            divRowNo: 5, name: 'MaxVolumePerPcs', display: 'Vol. / Piece', type: 'text', value: 0, isRequired: true, ctrlAttr: { maxlength: 4, controltype: 'decimal3', readonly: false }, ctrlCss: { width: '70px' }
                        },
                        {
                            divRowNo: 5, display: null, type: 'label', value: '', ctrlCss: { width: '50px', height: '20px' }
                        }

                    ]
                },

                {
                    name: 'divDays', display: 'Frequency', type: 'div', isRequired: false,
                    divElements: [{
                        divRowNo: 1, name: pageType != 'READ' ? 'AllDays' : 'AllDay', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                            var num = evt.currentTarget.id;
                            $('input:checkbox[id*="_' + (evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '')) + '"]').each(function () {
                                if (this.id != 'tbl' + dbTableName + '_IsFirstLeg_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') && (this.id == 'tbl' + dbTableName + '_AllDays_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day1_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day2_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day3_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day4_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day5_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day6_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_Day7_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') || this.id == 'tbl' + dbTableName + '_AllDays_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '')))
                                    this.checked = $('input[id*="AllDays_' + evt.currentTarget.id.replace("tblScheduleTrans_AllDays_", '') + '"]:checked').val() != undefined;
                            });
                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    {
                        divRowNo: 1, name: pageType != 'READ' ? 'Day1' : 'Sun', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                            if ($('input[id*="tbl' + dbTableName + '_Day1_' + (rowIndex + 1) + '"]:checked').val() == undefined)
                                $('input[id*="AllDays_' + (rowIndex + 1) + '"]:checked').val('off');
                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    {
                        divRowNo: 1, name: pageType != 'READ' ? 'Day2' : 'Mon', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                            CheckBoxDuplicateCheck(evt, rowIndex);
                        }
                    },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day3' : 'Tue', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day4' : 'Wed', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day5' : 'Thu', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day6' : 'Fri', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 1, name: pageType != 'READ' ? 'Day7' : 'Sat', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckBoxDuplicateCheck(evt, rowIndex); } },
                    { divRowNo: 2, name: 'lblAllDays', value: 'Days', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay1', value: 'Sun', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay2', value: 'Mon', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay3', value: 'Tue', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay4', value: 'Wed', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay5', value: 'Thu', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay6', value: 'Fri', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                    { divRowNo: 2, name: 'lblDay7', value: 'Sat', type: 'label', ctrlCss: { 'font-weight': 'bold' } }
                        //{ divRowNo: 3, name: 'lblIsActive', cSpan: 2, value: 'Active', type: 'label', ctrlCss: { 'font-weight': 'bold' } },

                        //{ divRowNo: 3, name: pageType != 'READ' ? 'IsActive' : 'Active', display: null, cSpan: 3, type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' } },//selectedIndex: 1 
                        //{ divRowNo: 3, name: 'lblIsFirstLeg', cSpan: 2, value: 'First Leg', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                        //{ divRowNo: 3, name: pageType != 'READ' ? 'IsFirstLeg' : 'FirstLeg', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckFirstLeg(evt, rowIndex); } }, 

                        //{ divRowNo: 4, name: 'lblNoOfStop', cSpan: 2, value: 'Stops', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                        //{ divRowNo: 4, name: 'NoOfStop', value: 0, display: null, type: 'text', ctrlAttr: { maxlength: 1, controltype: 'number' }, ctrlCss: { width: '25px' }, isRequired: false }
                    ]
                }

                ],
                rowUpdateExtraFunction: function (caller) {
                    $("input[id^=tblScheduleTrans_Origin]").each(function (i, el) {
                        if ($("#Text_Origin").text().toUpperCase() == $("#tblScheduleTrans_Origin_" + parseInt(i + 1)).val().toUpperCase()) {
                            $("[id$='tblScheduleTrans_ALTFlightNumber_" + parseInt(i + 1) + "']").prop("readonly", true);
                        }

                    });

                },
                isPaging: false,
                hideButtons: {
                    remove: true,
                    removeLast: true,
                    insert: true,
                    append: true,
                    update: true,
                    updateAll: true
                },

                afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                    //$('#tblScheduleTrans').appendGrid('hideColumn', 'Add Legs');                    
                    countLeg = addedRowIndex;



                    // added by arman ali
                    // $("[id*='tblScheduleTrans_Addlegs_']").addClass('btn btn-success');
                    // $("[id*='tblScheduleTrans_DeleteLegs']").addClass('btn btn-danger');
                    //  $("[id*='tblScheduleTrans_CodeShareFlightNumber_']").attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
                    // for removing blank rows
                    //  $("[id*='tabledivLegs'] :hidden").closest('tr').hide();
                    //  $("[id*='tabledivLegs'] [style*='none']").closest('tr').hide();

                    // end

                    onEtdBlur();
                    onEtaBlur();
                    //.not($("input[id^=tblScheduleTrans_HdnAddLeg_][value='1']").parent().parent().find("input[id^=tblScheduleTrans_ETD_]"))

                    /*
                    $("input[id^=tblScheduleTrans_EndDate_]").blur(function (e) {
                        //var Index = this.id.split('_')[2];
                        //var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
                        //var dto = new Date(Date.parse(k));
                        //var validFrom = $(this).attr("id").replace("tblScheduleTrans_EndDate_", "tblScheduleTrans_StartDate_");
                        //k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
                        //var dfrom = new Date(Date.parse(k));
                        //$("input[id^=tblScheduleTrans_EndDate_" + Index + "]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));

                        //if (dfrom > dto)
                        //    $(this).val("");


                        var CurrentUniqueIndex = this.id.split('_')[2];
                        var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                        var CurrentValue = $(this).val();
                        var StartDate = $('#tblScheduleTrans_StartDate_' + CurrentUniqueIndex + '').val();
                        var rowIndex = $('#tblScheduleTrans').appendGrid('getRowIndex', CurrentUniqueIndex);

                        if (CurrentValue != '' && StartDate != '') {
                            var SD = StartDate.replace(/[^A-Z0-9-/]/ig, '');
                            var ED = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                            var dfrom = new Date(Date.parse(SD));
                            var dto = new Date(Date.parse(ED));
                            if (dfrom > dto) {
                                $(this).val("");
                                CurrentValue = '';
                            }
                        }

                        $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                            var CurrentRowID = parseInt(this.id.split('_')[2]);
                            $('[id^=tblScheduleTrans_EndDate_' + CurrentRowID + ']').val(CurrentValue);
                        });

                        CheckBoxDuplicateCheck(evt, rowIndex);

                    });

                    $("input[id^=tblScheduleTrans_StartDate]").blur(function (e) {
                        //var Index = this.id.split('_')[2];
                        //var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
                        //var dfrom = new Date(Date.parse(k));
                        //var validFrom = $(this).attr("id").replace("tblScheduleTrans_StartDate_", "tblScheduleTrans_EndDate_");
                        //k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
                        //var dto = new Date(Date.parse(k));
                        //$("input[id^=tblScheduleTrans_StartDate_" + Index + "]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
                        //if (dfrom > dto)
                        //    $(this).val("");



                        var CurrentUniqueIndex = this.id.split('_')[2];
                        var CurrentAddLegNo = $('[id^=tblScheduleTrans_AddLegNo_' + CurrentUniqueIndex + ']').val();
                        var CurrentValue = $(this).val();
                        var EndDate = $('#tblScheduleTrans_EndDate_' + CurrentUniqueIndex + '').val();
                        var rowIndex = $('#tblScheduleTrans').appendGrid('getRowIndex', CurrentUniqueIndex);
                        if (CurrentValue != '' && EndDate != '') {
                            var SD = CurrentValue.replace(/[^A-Z0-9-/]/ig, '');
                            var ED = EndDate.replace(/[^A-Z0-9-/]/ig, '');
                            var dfrom = new Date(Date.parse(SD));
                            var dto = new Date(Date.parse(ED));
                            if (dfrom > dto) {
                                $(this).val("");
                                CurrentValue = '';
                            }
                        }

                        $('[id^=tblScheduleTrans_AddLegNo_][value=' + CurrentAddLegNo + ']').map(function () {
                            var CurrentRowID = parseInt(this.id.split('_')[2]);
                            $('[id^=tblScheduleTrans_StartDate_' + CurrentRowID + ']').val(CurrentValue);
                        });
                        CheckBoxDuplicateCheck(evt, rowIndex);
                    }); */

                    if ($("#Text_Destination").text() == $('#ViaRoute').val()) {
                        //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                        //$('#tblScheduleTrans_DayDifference_' + parseInt(addedRowIndex + 1).toString()).prop('disabled', 'disabled');
                        $("#tblScheduleTrans_HdnDayDifference_" + parseInt(addedRowIndex + 1).toString()).val('0');
                        $("#tblScheduleTrans_DayDifference_" + parseInt(addedRowIndex + 1).toString()).val(0);
                        $('#tblScheduleTrans_DayDifference_' + parseInt(addedRowIndex + 1).toString()).data("kendoAutoComplete").enable(false);
                    }

                    //if (pageType == 'READ') {
                    //    
                    //    for (var i = 1; i <= addedRowIndex.length; i++) {
                    //        var index = '#tblScheduleTrans_IsCodeShare_'+ i;

                    //    //$('#tblScheduleTrans_IsCodeShare_1').text();
                    //    alert(index);
                    //    alert($(index).text());
                    //    var value = $('#tblScheduleTrans_IsCodeShare_' + i ).text();
                    //    if (value == 'false') {
                    //        $("#tableCapacity" + i).hide();
                    //    }
                    //    else {
                    //        $("#tableCapacity" + i).show();
                    //    }
                    //    }
                    //}
                    //if (pageType == 'EDIT') {
                    //    
                    //    //$('#tblScheduleTrans_IsCodeShare_1').text();
                    //    for (var i = 1; i <= addedRowIndex.length; i++) {
                    //        var index = '#tblScheduleTrans_IsCodeShare_' + i;

                    //        //$('#tblScheduleTrans_IsCodeShare_1').text();

                    //        var value = $('#tblScheduleTrans_IsCodeShare_' + i).text();
                    //        if (value == 'false') {
                    //            $("#tableCapacity" + i).hide();
                    //        }
                    //        else {
                    //            $("#tableCapacity" + i).show();
                    //        }
                    //    }


                    //  }

                    if (pageType == 'NEW') {
                        var legs = $('span#Routing').text().split('-');
                        var legssno = $('#Origin').val();
                        var mviaroute = $('#Multi_ViaRoute').val();
                        if (mviaroute.length > 0)
                            legssno = legssno + ',' + mviaroute;

                        legssno = legssno + ',' + $('#Destination').val();
                        legssno = legssno.replace(",,", ",");
                        var legID = legssno.split(',');
                        var legvalOne = 0;
                        var legvalTwo = 1;
                        var i = 0;
                        for (var K = 0; K < legs.length - 1; K++) {
                            i = K + 1;
                            $("[id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").text($("#Text_CarrierCode").val());
                            $("[type='hidden'][id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").val($("#Text_CarrierCode").val());

                            $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase()).prop("readonly", true);;

                            if ($("#Text_Origin").val().toUpperCase() == legs[K].toUpperCase()) {
                                $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").prop("readonly", true);
                            }

                            $("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + i + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val());

                            CheckIsCodeShareCheck(this, i);
                            $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[K]);
                            $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[K]);
                            //$('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                            //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                            $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('');
                            $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                            $("#tblScheduleTrans_HdnSDDifference_" + i.toString()).val('');
                            $("#tblScheduleTrans_SDDifference_" + i.toString()).val(0);
                            $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[i]);
                            $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[i]);
                            $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                            $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());

                            $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").enable(false);
                            $('#tblScheduleTrans_EndDate_' + i.toString()).removeAttr('disabled');
                            $('#tblScheduleTrans_StartDate_' + i.toString()).data("kendoDatePicker").enable(false);
                            $('#tblScheduleTrans_StartDate_' + i.toString()).removeAttr('disabled');
                            $('input[id^=tblScheduleTrans_RbtnIsActive_' + i.toString() + ']').attr('readonly', true);
                            $('#tblScheduleTrans_HdnLegId_' + i.toString()).val(i.toString());
                            $('#tblScheduleTrans_HdnIsLeg_' + i.toString()).val(1);
                            $('#tblScheduleTrans_AddLegNo_' + i.toString()).val("0");
                            $('#tblScheduleTrans_RowID_' + i.toString()).val(i.toString());

                            if (i.toString() === "1") {
                                //$('#tblScheduleTrans_DayDifference_' + i.toString()).attr("style", "pointer-events: none;");
                                $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('0');
                                $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                                $('#tblScheduleTrans_DayDifference_' + i.toString()).data("kendoAutoComplete").enable(false);
                            }
                        }

                        // Segment has not been creating now 
                        //22-Sep-2017 Commented By Pankaj Khanna
                        if (IsAddLeg) {
                            for (var k = 0; k < legs.length - 1; k++) {
                                for (var j = k + 1; j < legs.length - 1; j++) {
                                    i = i + 1;

                                    $("[id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").text($("#Text_CarrierCode").val());
                                    $("[type='hidden'][id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").val($("#Text_CarrierCode").val());

                                    $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase()).prop("readonly", true);;
                                    if ($("#Text_Origin").val().toUpperCase() == legs[k].toUpperCase()) {
                                        $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").prop("readonly", true);
                                    }

                                    $("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + i + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val());

                                    CheckIsCodeShareCheck(this, i)


                                    $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[k]);
                                    $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[k]);
                                    //$('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                                    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                                    $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('');
                                    $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                                    $("#tblScheduleTrans_HdnSDDifference_" + i.toString()).val('');
                                    $("#tblScheduleTrans_SDDifference_" + i.toString()).val(0);

                                    $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[j + 1]);
                                    $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[j + 1]);
                                    $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                                    $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());

                                    $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").enable(false);
                                    $('#tblScheduleTrans_EndDate_' + i.toString()).removeAttr('disabled');
                                    $('#tblScheduleTrans_StartDate_' + i.toString()).data("kendoDatePicker").enable(false);
                                    $('#tblScheduleTrans_StartDate_' + i.toString()).removeAttr('disabled');
                                    $('input[id^=tblScheduleTrans_RbtnIsActive_' + i.toString() + ']').attr('readonly', true);
                                    $('#tblScheduleTrans_HdnLegId_' + i.toString()).val((k + 1).toString() + (j + 1).toString());
                                    $('#tblScheduleTrans_HdnIsLeg_' + i.toString()).val(0);
                                    $('#tblScheduleTrans_AddLegNo_' + i.toString()).val("0");
                                    $('#tblScheduleTrans_RowID_' + i.toString()).val(i.toString());
                                    if ((k + 1).toString() === "1") {
                                        //$('#tblScheduleTrans_DayDifference_' + i.toString()).attr("style", "pointer-events: none;");
                                        $("#tblScheduleTrans_HdnDayDifference_" + i.toString()).val('0');
                                        $("#tblScheduleTrans_DayDifference_" + i.toString()).val(0);
                                        $('#tblScheduleTrans_DayDifference_' + i.toString()).data("kendoAutoComplete").enable(false);
                                    }
                                }

                            }
                        }

                        //22-Sep-2017 Commented By Pankaj Khanna



                        //for (var i = 1; i <= addedRowIndex.length; i++) {

                        /*Added by Brajendra*/
                        //$("[id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").text($("#Text_CarrierCode").val());
                        //$("[type='hidden'][id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").val($("#Text_CarrierCode").val());

                        //$("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase());
                        //// $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").attr("disabled", true);
                        //if ($("#Text_Origin").val().toUpperCase() == legs[legvalOne].toUpperCase()) {
                        //    $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").prop("readonly", true);
                        //}

                        //$("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + i + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val());

                        //CheckIsCodeShareCheck(this, i)

                        //    /*Ended by Brajendra*/



                        //    if (i == 1 && (legs[legID.length - 1] != legs[legvalOne])) {
                        //        //  $('#tblScheduleTrans_StartDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                        //        //   $('#tblScheduleTrans_EndDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                        //        $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[legvalOne]);
                        //        $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[legvalOne]);
                        //        $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                        //        $('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                        //        $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[legID.length - 1]);

                        //        $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[legID.length - 1]);
                        //        //if($('#tblScheduleTrans_EndDate_' + i.toString()).val() == "")
                        //        $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                        //        $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());
                        //    }
                        //    else {


                        //        //    $('#tblScheduleTrans_StartDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                        //        //   $('#tblScheduleTrans_EndDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                        //        $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                        //        $('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                        //        $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[legvalOne]);
                        //        $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[legvalOne]);

                        //        $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[legvalTwo]);

                        //        $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[legvalTwo]);


                        //        //var todayDate = kendo.toString(kendo.parseDate($("#FEndDate").val()), 'MM/dd/yyyy');
                        //        //$("#StartDate").data("kendoDatePicker").value(todayDate);
                        //        // if ($('#tblScheduleTrans_EndDate_' + i.toString()).val() == "")

                        //        $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());
                        //        $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                        //        if (legvalOne == 0 && legvalTwo == legID.length - 2) {
                        //            legvalOne++;
                        //            legvalTwo = legvalOne + 1;
                        //        }
                        //        else if (legvalTwo == legID.length - 1) {
                        //            legvalOne++;
                        //            legvalTwo = legvalOne + 1;
                        //        }
                        //        else {
                        //            legvalTwo++;
                        //        }
                        //    }

                        //    //if ($('#ViaRoute').val() == '') {
                        //    //    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                        //    //    $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('disabled', 'disabled');

                        //    //}
                        //    //if (i == 1)
                        //    //{
                        //    //    $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val($('#Origin').val());
                        //    //    $('#tblScheduleTrans_HdnDestination_' + i.toString()).val($('#Destination').val());
                        //    //    $('#tblScheduleTrans_Origin_' + i.toString()).val($('#Text_Origin').val());
                        //    //    $('#tblScheduleTrans_Destination_' + i.toString()).val($('#Text_Destination').val());
                        //    //}
                        //    //else if(addedRowIndex > 0)
                        //    //{
                        //    //    //$("#tblScheduleTrans_Origin_" + addedRowIndex).data("kendoAutoComplete").enable(false);
                        //    //    //$("#tblScheduleTrans_Destination_" + addedRowIndex).data("kendoAutoComplete").enable(false);

                        //    //    if($('#tblScheduleTrans_HdnDestination_' + addedRowIndex ).val() == $('#Destination').val())
                        //    //    {
                        //    //        $('#tblScheduleTrans_HdnOrigin_' + (parseInt(addedRowIndex) + 1)).val($('#Origin').val());
                        //    //        $('#tblScheduleTrans_Origin_' + (parseInt(addedRowIndex) + 1)).val($('#Text_Origin').val());
                        //    //    }
                        //    //    else
                        //    //    {
                        //    //        $('#tblScheduleTrans_HdnOrigin_' + (parseInt(addedRowIndex) + 1)).val($('#tblScheduleTrans_HdnDestination_' + (addedRowIndex)).val());
                        //    //        $('#tblScheduleTrans_Origin_' + (parseInt(addedRowIndex) + 1)).val($('#tblScheduleTrans_Destination_' + (addedRowIndex)).val());
                        //    //    }
                        //    //}
                        //}
                    }
                    $('input:button[id*="tblScheduleTrans_DeleteLegs"]').each(function () {
                        if ($('#' + this.id.replace('tblScheduleTrans_DeleteLegs_', 'tblScheduleTrans_SNo_')).val() == "0")

                            $('#' + this.id).hide();
                    });

                },
                dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                    if (pageType == 'EDIT') {
                        //var legs = $('span#Routing').text().split('-');
                        //for (i = 1; i <= (legs.length - 1) ; i++)
                        // AircraftFlag = true;                        
                        $('#tblScheduleTrans tr[id]').each(function () {
                            var i = this.id.split('_')[2];
                            $('input[type=hidden][id=tblScheduleTrans_ALTCarrierCode_' + i.toString() + ']').val($('#tblScheduleTrans_ALTCarrierCode_' + i.toString()).val());
                            $('input[type=hidden][id=tblScheduleTrans_FlightNo_' + i.toString() + ']').val($('#tblScheduleTrans_ALTFlightNumber_' + i.toString()).val());
                            $('#tblScheduleTrans_ALTFlightNumber_' + i.toString()).attr('readonly', true);
                            $('input[id^=tblScheduleTrans_RbtnIsActive_' + i.toString() + ']').attr('readonly', true);

                            if ($('#tblScheduleTrans_HdnLegId_' + i.toString()).val().toString().indexOf("1") >= 0) {
                                //$('#tblScheduleTrans_DayDifference_' + i.toString()).attr("style", "pointer-events: none;");
                                $('#tblScheduleTrans_DayDifference_' + i.toString()).data("kendoAutoComplete").enable(false);
                            }

                            if (IsRemoveFlights == false) {
                                $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").enable(false);
                                $('#tblScheduleTrans_EndDate_' + i.toString()).removeAttr('disabled');
                                $('#tblScheduleTrans_StartDate_' + i.toString()).data("kendoDatePicker").enable(false);
                                $('#tblScheduleTrans_StartDate_' + i.toString()).removeAttr('disabled');
                            }

                            $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").min($('#FStartDate').val());
                            $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").max($('#FEndDate').val());
                            $('#tblScheduleTrans_StartDate_' + i.toString()).data("kendoDatePicker").min($('#FStartDate').val());
                            $('#tblScheduleTrans_EndDate_' + i.toString()).data("kendoDatePicker").max($('#FEndDate').val());

                            // to show percentage of flight capacity  
                            // Added by arman ali
                            // $("[id*='tabledivLegs'] :hidden").closest('tr').hide();
                            //  $("[id*='tabledivLegs'] [style*='none']").closest('tr').hide();
                            // end
                            //=================added by arman==============
                            checkcodeshare();
                            //====================End=======================
                            $('#tblScheduleTrans_UMV_' + i).attr("disabled", true);
                            $('#tblScheduleTrans_UMG_' + i).attr("disabled", true);
                            var fc = 'tblScheduleTrans_FreeSaleCapacity_' + i;
                            CheckRageFSCCapacity(fc);
                            var ob = 'tblScheduleTrans_OverBookingCapacity_' + i;
                            //7March2017
                            CheckRageOBCCapacity(ob);

                            var fcvol = 'tblScheduleTrans_FreeSaleCapacityVol_' + i;
                            CheckRageFSCCapacityVol(fcvol);
                            var obvol = 'tblScheduleTrans_OverBookingCapacityVol_' + i;
                            CheckRageOBCCapacityVol(obvol);

                            var RSCap = 'tblScheduleTrans_ReservedCapacity_' + i;
                            var RSCapVl = 'tblScheduleTrans_ReservedCapacityVol_' + i;
                            CheckRageRSCapacity(RSCap)
                            CheckRageRSCapacityVol(RSCapVl)
                            // to show percentage of flight capacity

                            //  grwt[i] = $('#tblScheduleTrans_AllocatedGrossWeight_'+i).val();
                            disable(i);

                            var AddLegNoD = $('#tblScheduleTrans_AddLegNo_' + i).val();
                            if (!SetAllAircraft.hasOwnProperty(AddLegNoD)) {
                                SetAllAircraft[parseInt(AddLegNoD)];
                                SetAllAircraft[AddLegNoD] = { "AircraftFlag": true };
                            }
                            // }
                        });

                        // if (legs.length == 2) {
                        //for (i = 1; i <= (legs.length) - 1; i++) {

                        //    disable(i);
                        //}


                        //}
                        //else {
                        //    for (i = 1; i <= (legs[0] != legs[legs.length - 1] ? (legs.length) : (legs.length) - 1) ; i++) {

                        //        disable(i);
                        //    }

                        //}
                    }
                },

            });

        }



        LastAddLegNo = parseInt($('[id^=tblScheduleTrans_AddLegNo_]:last').val());
        var Routing = $('span#Routing').text().split('-');
        $("#tblScheduleTrans tbody tr[id^=tblScheduleTrans_Row_]").each(function () {
            var trID = $(this).attr('id');
            var OriginValue = $("#" + trID).find("input[id^=tblScheduleTrans_Origin_" + trID.split('_')[2] + "]").attr('value');
            for (var i = 0; i < Routing.length; i++) {
                if (OriginValue == Routing[i]) {
                    $("#tblScheduleTrans_HdnDepartureSequence_" + trID.split('_')[2] + "").val(parseInt(i + 1));
                }
            }
        });
        //var Routing = $('span#Routing').text().split('-');
        //$("#tblScheduleTrans tbody tr[id^=tblScheduleTrans_Row_]").each(function (i,val) {
        //    var trID = $(this).attr('id');
        //    var OriginValue = $("#" + trID).find("input[id^=tblScheduleTrans_Origin_" + trID.split('_')[2] + "]").attr('value');
        //   // for (var i = 0; i < Routing.length; i++) {
        //        if (OriginValue == Routing[i]) {
        //            $("#tblScheduleTrans_HdnDepartureSequence_" + trID.split('_')[2] + "").val(parseInt(i));
        //        }
        //        else {
        //         //   if (OriginValue == Routing[i]) {
        //                $("#tblScheduleTrans_HdnDepartureSequence_" + trID.split('_')[2] + "").val(parseInt(i));
        //           // }
        //        }
        //    //}
        //});

        getRecord();
    }

}
function BindWhereCondition() {

    var model = {
        RecordID: parseInt($('#hdnScheduleSno').val()) || 0,
        PageType: pageType
    }
    return model;
    //pageType=='EDIT'?'IsLeg=1'
}
function CheckFirstLeg(evt, rowIndex) {
    $('[id^=tblScheduleTrans_IsFirstLeg_]').not('[id=' + evt.currentTarget.id + ']').removeAttr('checked');
}

function CheckDayDiff(evt, rowIndex) {
    $("select[id$='#tblScheduleTrans_DayDifference_" + parseInt(p + 1).toString() + '] :selected').val()

    var RowOrder = $('#tblScheduleTrans').appendGrid('getRowOrder');
    var v = evt.currentTarget.id.replace('tblScheduleTrans_ETA_', '').replace('tblScheduleTrans_ETD_', '').trim();
    if ($("span[id='Routing']").text().split('-').length <= 2) {
        $("#tblScheduleTrans_DayDifference_" + v.toString()).attr("disabled", "disabled");
        $('#tblScheduleTrans_DayDifference_' + v.toString()).prop('selectedIndex', 0);

        if ((Number($('#tblScheduleTrans_ETD_' + v.toString()).val()) > Number($('#tblScheduleTrans_ETA_' + v.toString()).val() == "" ? "0" : $('#tblScheduleTrans_ETA_' + v.toString()).val())) && $('#tblScheduleTrans_ETA_' + v.toString()).val() != "") {
            $('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', 2);
            // $("#tblScheduleTrans_SDDifference_" + v.toString()).attr("disabled", "disabled");
        }
        else {
            $('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', 1);
            //$('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', 2);
            // $('#tblScheduleTrans_DayDifference_' + v.toString()).prop('selectedIndex', 2);
        }


    }
    else if ($("span[id='Routing']").text().split('-').length > 2) {
        if (v == 1 || v == 2) {
            // $("#tblScheduleTrans_DayDifference_" + v.toString()).attr("disabled", "disabled");
            // $('#tblScheduleTrans_DayDifference_' + v.toString()).prop('selectedIndex', 0);

            if (parseInt($('#tblScheduleTrans_ETD_' + v.toString()).val()) > parseInt($('#tblScheduleTrans_ETA_' + v.toString()).val())) {
                $('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', 2);
                //  $("#tblScheduleTrans_SDDifference_" + v.toString()).attr("disabled", "disabled");
            }
            else {
                $('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', 1);
            }
        }
        else {
            var p = 2;
            while (p < RowOrder.length) {
                if (parseInt($('#tblScheduleTrans_ETD_' + parseInt(p).toString()).val()) >= parseInt($('#tblScheduleTrans_ETD_' + parseInt(p + 1).toString()).val())) {
                    $('#tblScheduleTrans_DayDifference_' + parseInt(p + 1).toString()).prop('selectedIndex', 1);
                    if (parseInt($('#tblScheduleTrans_ETD_' + parseInt(p).toString()).val()) > parseInt($('#tblScheduleTrans_ETA_' + parseInt(p).toString()).val())) {
                        $('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', 3);
                    }
                    else {
                        $("#tblScheduleTrans_SDDifference_" + parseInt(p + 1).toString()).prop('selectedIndex', 2);
                    }
                }
                else {
                    $('#tblScheduleTrans_DayDifference_' + parseInt(p + 1).toString()).prop('selectedIndex', 0);
                }
                if ($('#tblScheduleTrans_DayDifference_' + parseInt(2 + 1).toString() + ' option:selected').text() == "0") {
                    if (parseInt($('#tblScheduleTrans_ETD_' + parseInt(p + 1).toString()).val()) >= parseInt($('#tblScheduleTrans_ETA_' + parseInt(p + 1).toString()).val()))
                        $("#tblScheduleTrans_SDDifference_" + parseInt(p + 1).toString()).prop('selectedIndex', 2);
                    else
                        $("#tblScheduleTrans_SDDifference_" + parseInt(p + 1).toString()).prop('selectedIndex', 1);
                }


                p++;

                //  $("#tblScheduleTrans_SDDifference_" + v.toString()).attr("disabled", "disabled");
            }


        }

    }

    // }



    //var RowOrder = $('#tblScheduleTrans').appendGrid('getRowOrder');
    //var v = evt.currentTarget.id.replace('tblScheduleTrans_ETA_', '').replace('tblScheduleTrans_ETD_', '').trim();
    ////if(tblScheduleTrans_DayDifference_1)
    //if (new Date(Date.parse($('#tblScheduleTrans_StartDate_' + v.toString()).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) < new Date(Date.parse($('#tblScheduleTrans_EndDate_' + v.toString()).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')))) {
    //    $('#tblScheduleTrans_DayDifference_' + v.toString()).removeAttr('disabled');
    //    $('#tblScheduleTrans_DayDifference_' + v.toString()).prop('selectedIndex', 1);

    //    if ($('#ViaRoute').val() != '') {
    //        $('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', 2);
    //    }
    //}


    //if ($('#tblScheduleTrans_DayDifference_' + v.toString()).val() <= 0)
    //    var dayDiff = (new Date(Date.parse($('#tblScheduleTrans_EndDate_' + v.toString()).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) - new Date(Date.parse($('#tblScheduleTrans_StartDate_' + v.toString()).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')))) / 1000 / 60 / 60 / 24;
    //$('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', parseInt(dayDiff + 1));
    //if ($('#tblScheduleTrans_ETA_' + v.toString()).val() < $('#tblScheduleTrans_ETD_' + v.toString()).val()) {
    //    $('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', parseInt(2));
    //}
    //$('#tblScheduleTrans_SDDifference_' + v.toString()).prop('selectedIndex', 2);
    //// }

    //if ($('#tblScheduleTrans_ETA_' + v.toString()).val() != '') {
    //    $('#tblScheduleTrans_ETA_' + v.toString()).val('');
    //    ShowMessage('info', 'Need your Kind Attention!', "ETA is less than ETD for " + $('#tblScheduleTrans_Origin_' + v.toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + v.toString()).val() + " leg. Kindly provide Day Difference value other than 0.");
    //}

    //var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
}

//Added to check IScodeShare by Vsingh 05/12/2016
function CheckIsCodeShareCheck(evt, ID) {

    var isChecked = $("#tblScheduleTrans_IsCodeShare_" + ID).is(':checked');
    var AddLegVal = $('[id^=tblScheduleTrans_AddLegNo_' + ID + ']').val();
    //$("input[id^=tblScheduleTrans_IsCodeShare_]").not('[id=tblScheduleTrans_IsCodeShare_'+ ID+']' ).attr('checked', isChecked);

    $('[id^=tblScheduleTrans_AddLegNo_][value=' + AddLegVal + ']').parents('tr[id]').find('[id^=tblScheduleTrans_IsCodeShare_]').not('[id=tblScheduleTrans_IsCodeShare_' + ID + ']').attr('checked', isChecked);

    $('#tblScheduleTrans tr[id]').each(function () {

        ID = this.id.split('_')[2];

        var inputid = "#tblScheduleTrans_IsCodeShare_" + ID;
        if ($(inputid).is(':checked')) {
            $("#tblScheduleTrans_lblCodeShareFlightNumber_" + ID);
            $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).data("kendoAutoComplete").enable(true);
            //   $("#tblScheduleTrans_CodeShareCarrierCode_" + (rowIndex + 1)).kendoAutoComplete({enable:true});
            $("#tblScheduleTrans_CodeShareFlightNumber_" + ID).prop("disabled", false);
            $("#tblScheduleTrans_IsCodeShare_" + ID).is(':checked') ? 1 : 0;

            $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).attr("required", "required");
            $("#tblScheduleTrans_CodeShareFlightNumber_" + ID).attr("required", "required");
            //  $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).focus();
        }

        else {
            $("#tblScheduleTrans_CodeShareFlightNumber_" + ID).prop("disabled", true);
            $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).prop("disabled", true);


            //   $("#tblScheduleTrans_lblCodeShareFlightNumber_" + (rowIndex + 1)).prop("disabled", true);

            //$("#tblScheduleTrans_CodeShareCarrierCode_" + (rowIndex + 1)).kendoAutoComplete({enable:false });
            $("#tblScheduleTrans_IsCodeShare_" + ID).is(':checked') ? 1 : 0;
            $("#tblScheduleTrans_CodeShareFlightNumber_" + ID).val('');
            $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).val('');


            $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).data("kendoAutoComplete").enable(false);

            $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).attr("required", false);
            $("#tblScheduleTrans_CodeShareFlightNumber_" + ID).attr("required", false);
        }

    });
    // else {
    //     $("#tableCapacity1").hide();
    //  }
    //alert($(this).is(':unchecked'));
    //if ($(this).is(':unchecked')) {
    //    $("#tableCapacity1").hide();
    // }
    //tblScheduleTrans_CodeShareCarrierCode_1
    //  $("#tableCapacity1").hide();
}
//Added to check IScodeShare by Vsingh 05/12/2016


function BindCodeshareCapacity(rowindex) {


    var index = rowindex.split("_")[2];
    var valtest = $("#" + rowindex).val();
    var Carriercode = $("#tblScheduleTrans_CodeShareCarrierCode_" + index).val();
    var Carrierflight = $("#tblScheduleTrans_CodeShareFlightNumber_" + index).val();
    if (Carrierflight != '') {
        $("#tblScheduleTrans_CodeShareFlightNo_" + index).val(Carriercode + "-" + valtest);
    }
    else {
        $("#tblScheduleTrans_CodeShareFlightNo_" + index).val('');

    }


}

function CheckBoxDuplicateCheck(evt, rowIndex) {

    //if (evt.target.id.indexOf('AllDays') > 0) { $('input[type=checkbox][id*=Day]').attr('checked', $('#' + evt.target.id).is(':checked')) }  
    var RowOrder = $('#tblScheduleTrans').appendGrid('getRowOrder');
    var RowNo = $('#tblScheduleTrans').appendGrid('getUniqueIndex', rowIndex);//
    var FDate = new Date(Date.parse($('#tblScheduleTrans_StartDate_' + RowNo).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
    var TDate = new Date(Date.parse($('#tblScheduleTrans_EndDate_' + RowNo).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
    days = Math.round((TDate - FDate) / (1000 * 60 * 60 * 24)) + 1;
    var weekday = new Array(7);
    weekday[0] = "#tblScheduleTrans_Day1_" + RowNo;//"Sunday";
    weekday[1] = "#tblScheduleTrans_Day2_" + RowNo; //"Monday";
    weekday[2] = "#tblScheduleTrans_Day3_" + RowNo;//"Tuesday";
    weekday[3] = "#tblScheduleTrans_Day4_" + RowNo;//"Wednesday";
    weekday[4] = "#tblScheduleTrans_Day5_" + RowNo;//"Thursday";
    weekday[5] = "#tblScheduleTrans_Day6_" + RowNo;//"Friday";
    weekday[6] = "#tblScheduleTrans_Day7_" + RowNo;//"Saturday";

    if (days <= 7) {
        var NotTouch = "";
        //var nextDate = FDate;
        var nextDate = new Date(FDate.setDate(FDate.getDate() + parseInt($('#tblScheduleTrans_Row_' + RowNo).find('[id^="tblScheduleTrans_HdnDayDifference_' + RowNo + '"]').val() == '' ? '0' : $('#tblScheduleTrans_Row_' + RowNo).find('[id^="tblScheduleTrans_HdnDayDifference_' + RowNo + '"]').val())));
        for (var i = 1; i <= days; i++) {
            NotTouch += NotTouch.length > 0 ? ', ' + weekday[nextDate.getDay()] : weekday[nextDate.getDay()];
            nextDate.setDate(nextDate.getDate() + 1);
        }
        if (NotTouch.length > 0) {
            $('#tblScheduleTrans_Row_' + RowNo).find('[id^="tblScheduleTrans_Day"]:not(' + NotTouch + ')').attr('checked', false);
            //$('#tblScheduleTrans_Row_' + RowOrder[0]).find('[id^="tblScheduleTrans_AllDays_"]').attr('checked', false);
        }
    }
    for (var out = 0; out < $('#tblScheduleTrans').appendGrid('getRowCount'); out++) {

        //Added By Pankaj Khanna on (05-Jun-2017) 
        /*
        var DayNo = evt.target.id.split('_')[1].slice(3, 4);
        var DayDiff = $('#tblScheduleTrans_DayDifference_' + RowOrder[out] + ' option:selected').val();

        if (isNaN(Number(DayNo)) == false)
        {
            var SelectDay = (Number(DayNo) + Number(DayDiff)) % 7;
            if (evt.target.id.indexOf('Day' + DayNo + '') > 0) {
                $('#tblScheduleTrans tr[id=tblScheduleTrans_Row_' + RowOrder[out] + ']').find('input[type=checkbox][id*=Day' + SelectDay + ']').attr('checked', $('#' + evt.target.id).is(':checked'));

                if (SelectDay != DayNo)
                    $('#tblScheduleTrans_Day' + DayNo + '_' + RowOrder[out]).attr('checked', false)
            }
        }*/



        if ($('#tblScheduleTrans_StartDate_' + RowOrder[out]).val() != "" && $('#tblScheduleTrans_EndDate_' + RowOrder[out]).val() != "") {
            if (new Date(Date.parse($('#tblScheduleTrans_StartDate_' + RowOrder[out]).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) > new Date(Date.parse($('#tblScheduleTrans_EndDate_' + RowOrder[out]).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')))) {
                //$('#tblScheduleTrans_StartDate_' + RowOrder[out]).val('');
                $('#tblScheduleTrans_EndDate_' + RowOrder[out]).val('');
                // ShowMessage('info', 'Need your Kind Attention!', "End Date can not be less than Start Date for " + $('#tblScheduleTrans_Origin_' + RowOrder[out].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RowOrder[out].toString()).val() + " leg");
                return false;
            }
        }
    }

    if ($('#tblScheduleTrans').appendGrid('getRowCount') > 1) {
        var RO = $('#tblScheduleTrans').appendGrid('getRowOrder');
        for (var out = 0; out < $('#tblScheduleTrans').appendGrid('getRowCount'); out++) {
            for (var inn = out + 1; inn < $('#tblScheduleTrans').appendGrid('getRowCount'); inn++) {
                if ($('#tblScheduleTrans_Origin_' + RO[out]).val() == $('#tblScheduleTrans_Origin_' + RO[inn]).val() && $('#tblScheduleTrans_Destination_' + RO[out]).val() == $('#tblScheduleTrans_Destination_' + RO[inn]).val()) {
                    var k = $('#tblScheduleTrans_StartDate_' + RO[out]).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                    var StartDateOuter = new Date(Date.parse(k));
                    k = $('#tblScheduleTrans_StartDate_' + RO[inn]).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                    var StartDateInner = new Date(Date.parse(k));
                    var k = $('#tblScheduleTrans_EndDate_' + RO[out]).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                    var EndDateOuter = new Date(Date.parse(k));
                    k = $('#tblScheduleTrans_EndDate_' + RO[inn]).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                    var EndDateInner = new Date(Date.parse(k));

                    var dayscross = 0;
                    if (StartDateOuter >= StartDateInner && StartDateOuter <= EndDateInner || EndDateOuter >= StartDateInner && EndDateOuter <= EndDateInner
                        || StartDateOuter >= StartDateInner && EndDateOuter <= EndDateInner || StartDateInner >= StartDateOuter && StartDateInner <= EndDateOuter
                        || EndDateInner >= StartDateOuter && EndDateInner <= EndDateOuter || StartDateInner >= StartDateOuter && EndDateInner <= EndDateOuter
                        || StartDateInner >= StartDateOuter && EndDateInner <= EndDateOuter || StartDateOuter >= StartDateInner && EndDateOuter <= EndDateInner) {
                        if ($('#tblScheduleTrans_AllDays_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_AllDays_' + RO[inn]).prop('checked') == true) {
                            //  ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_AllDays_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_AllDays_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_AllDays_' + RO[inn]).prop('checked', false);

                        }
                        if ($('#tblScheduleTrans_Day1_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day1_' + RO[inn]).prop('checked') == true) {
                            //   ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day1_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day1_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day1_' + RO[inn]).prop('checked', false);

                        }
                        if ($('#tblScheduleTrans_Day2_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day2_' + RO[inn]).prop('checked') == true) {
                            //  ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day2_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day2_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day2_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day3_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day3_' + RO[inn]).prop('checked') == true) {
                            //   ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day3_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day3_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day3_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day4_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day4_' + RO[inn]).prop('checked') == true) {
                            //   ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day4_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day4_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day4_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day5_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day5_' + RO[inn]).prop('checked') == true) {
                            //    ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day5_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day5_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day5_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day6_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day6_' + RO[inn]).prop('checked') == true) {
                            //  ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day6_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day6_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day6_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day7_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day7_' + RO[inn]).prop('checked') == true) {
                            // ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day7_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day7_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day7_' + RO[inn]).prop('checked', false);
                        }
                        if (dayscross == 1)
                            ShowMessage('info', 'Need your Kind Attention!', "Frequency overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                    }
                }
            }
        }
    }
}

function GetTrucking(value) {
    $.ajax({
        url: "Services/Schedule/ScheduleService.svc/Getcheck_Z_Code",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            str: value
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(result);
                $('#Text_CarrierCode').val(myData[0].CarrierCode);
                $('#CarrierCode').val(myData[0].autocompleteValue);
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

//modified to det values for capacity by Vsingh 05/12/2016
function populateValueCell(value) {
    //var val = value.replace('_AirCraft_', '_HdnAirCraft_');
    //var valWeight = $('#' + val).val().split(',');
    //$('#' + val).val(valWeight[0])

    // Added By pankaj Khanna
    var ARowID = value.split('_')[2];
    var AddVal = $('#tblScheduleTrans_AddLegNo_' + ARowID).val();
    //$('#tblScheduleTrans tr[id]')
    var Filter = $('[id^=tblScheduleTrans_AddLegNo_][value=' + AddVal + ']').parent().parent();
    Filter.each(function () {

        if (SetAllAircraft[AddVal].AircraftFlag == false) {
            $('#tblScheduleTrans_AirCraft_' + this.id.split('_')[2]).val($('#tblScheduleTrans_AirCraft_' + value.split('_')[2]).val());
            $('#tblScheduleTrans_HdnAirCraft_' + this.id.split('_')[2]).val($('#tblScheduleTrans_HdnAirCraft_' + value.split('_')[2]).val());
            value = "tblScheduleTrans_AirCraft_" + this.id.split('_')[2];
        }

        //END By pankaj Khanna
        clearCapacityData(value.split('_')[2]);
        var ReplaceString = value.replace('tblScheduleTrans_', 'tblScheduleTrans_Hdn');
        var Origin = value.replace('tblScheduleTrans_AirCraft', 'tblScheduleTrans_HdnOrigin');
        var Destination = value.replace('tblScheduleTrans_AirCraft', 'tblScheduleTrans_HdnDestination');
        var AGW = value.replace('AirCraft', 'AllocatedGrossWeight');
        var AVW = value.replace('AirCraft', 'AllocatedVolumeWeight');
        var mgpp = value.replace('AirCraft', 'MaxGrossPerPcs');
        var mvpp = value.replace('AirCraft', 'MaxVolumePerPcs');
        var _AGW = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_AllocatedGrossWeight');
        var _AVW = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_AllocatedVolumeWeight');
        var _mgpp = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_MaxGrossPerPcs');
        var _mvpp = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_MaxVolumePerPcs');
        var OBC = value.replace('AirCraft', 'OverBookingCapacity');
        var _OBC = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_OverBookingCapacity');

        var FSC = value.replace('AirCraft', 'FreeSaleCapacity');
        var _FSC = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_FreeSaleCapacity');

        var RSC = value.replace('AirCraft', 'ReservedCapacity');
        var _RSC = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_ReservedCapacity');

        var UM = value.replace('AirCraft', 'UMG');
        var _UM = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_UMG');

        var hdnUMG = value.replace('tblScheduleTrans_AirCraft', 'tblScheduleTrans_HdnUMG');


        var UMV = value.replace('AirCraft', 'UMV');
        var _UMV = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_UMV');

        var hdnUMV = value.replace('tblScheduleTrans_AirCraft', 'tblScheduleTrans_HdnUMV');



        var OBCVol = value.replace('AirCraft', 'OverBookingCapacityVol');
        var _OBCVol = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_OverBookingCapacityVol');

        var FSCVol = value.replace('AirCraft', 'FreeSaleCapacityVol');
        var _FSCVol = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_FreeSaleCapacityVol');

        var RSCVol = value.replace('AirCraft', 'ReservedCapacityVol');
        var _RSCVol = value.replace('tblScheduleTrans_AirCraft', '_temptblScheduleTrans_ReservedCapacityVol');

        var OBCapPr = value.replace('AirCraft', 'OBCapPr');
        var OBVolPr = value.replace('AirCraft', 'OBVolPr');
        var FSCapPr = value.replace('AirCraft', 'FSCapPr');
        var FSVolPr = value.replace('AirCraft', 'FSVolPr');
        var RSCapPr = value.replace('AirCraft', 'RSCapPr');
        var RSVolPr = value.replace('AirCraft', 'RSVolPr');
        //  $('#' + OBC).after("<span id='lblper'></span>");

        //$('#' + AGW).removeAttr('readonly');
        //$('#' + _AGW).removeAttr('readonly');
        //$('#' + AVW).removeAttr('readonly');
        //$('#' + _AVW).removeAttr('readonly');
        //   $('#' + OBC).prev(total);

        //$('#' + AGW).val(valWeight[1]);
        //$('#' + AVW).val(valWeight[2]);
        //$('#' + mgpp).val(valWeight[3]);
        //$('#' + _AGW).val(valWeight[1]);
        //$('#' + _AVW).val(valWeight[2]);
        //$('#' + _mgpp).val(valWeight[3]);


        $.ajax({
            url: "Services/Schedule/ScheduleService.svc/GetAirCraftWeight",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AirCraftSno: $('#' + ReplaceString).val(), Ori: $('#' + Origin).val(), Dest: $('#' + Destination).val(),
                AirlineSNo: $('#CarrierCode').val().split('-')[0]
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 2) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData[0].grossWeight.length > 0 && myData[0].Volumeweight.length > 0 && myData[0].maxGrossWtPiece.length > 0) {
                        $('#' + AGW).val(myData[0].grossWeight);
                        $('#' + AVW).val(myData[0].Volumeweight);
                        $('#' + mgpp).val(myData[0].maxGrossWtPiece);
                        $('#' + mvpp).val(myData[0].maxVolumePiece);
                        $('#' + _AGW).val(myData[0].grossWeight);
                        $('#' + _AVW).val(myData[0].Volumeweight);
                        $('#' + _mgpp).val(myData[0].maxGrossWtPiece);
                        $('#' + _mvpp).val(myData[0].maxVolumePiece);
                        $('#' + OBC).val(myData[0].OverBookingCapacity);
                        $('#' + _OBC).val(myData[0].OverBookingCapacity);
                        $('#' + FSC).val(myData[0].FreeSaleCapacity);
                        $('#' + _FSC).val(myData[0].FreeSaleCapacity);
                        $('#' + UM).val(myData[0].UMG);
                        $('#' + _UM).val(myData[0].UMG);
                        $('#' + OBCVol).val(myData[0].OverBookingCapacityVol);
                        $('#' + _OBCVol).val(myData[0].OverBookingCapacityVol);
                        $('#' + FSCVol).val(myData[0].FreeSaleCapacityVol);
                        $('#' + _FSCVol).val(myData[0].FreeSaleCapacityVol);
                        $('#' + UMV).val(myData[0].UMV);
                        $('#' + _UMV).val(myData[0].UMV);

                        $('#' + hdnUMG).val(myData[0].UMG);
                        $('#' + hdnUMV).val(myData[0].UMV);

                        $('#' + RSC).val(myData[0].ReservedCapacity);
                        $('#' + _RSC).val(myData[0].ReservedCapacity);
                        $('#' + RSCVol).val(myData[0].ReservedCapacityVol);
                        $('#' + _RSCVol).val(myData[0].ReservedCapacityVol);


                        var index = OBC.split('_')[2];
                        prev[index] = $('#' + FSC).val();
                        Obprev[index] = $('#' + OBC).val();
                        var OBCvalue = $('#' + OBC).val();
                        var FSCvalue = $('#' + FSC).val();
                        var weight = $('#' + _AGW).val();

                        //if (pageType == "EDIT") {
                        //    grwt[i] = $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val();
                        //}
                        //else
                        //{
                        grwt[index] = $('#' + _AGW).val();
                        // }

                        var total = parseFloat((OBCvalue / weight) * 100);
                        var FSCtotal = parseFloat((FSCvalue / weight) * 100);

                        //$("#OBcap_" + index).remove();
                        //$('#' + OBC).after('<span id="OBcap_' + index + '">&nbsp;&nbsp;' + (Number(myData[0].OverBookingCapacityPercentage).toFixed(2) + "&nbsp%") + '</span>');
                        //percenover[index] = $("#OBcap_" + index).html();
                        // $("#fscap_" + index).remove();
                        //$('#' + FSC).after('<span id="fscap_' + index + '">&nbsp;&nbsp;' + (Number(myData[0].FreeSaleCapacityPercentage).toFixed(2) + "&nbsp%") + '</span>');
                        //percencap[index] = $("#fscap_" + index).html();

                        $('#' + OBCapPr).text((Number(myData[0].OverBookingCapacityPercentage).toFixed(2) + " %"));
                        $('#' + FSCapPr).text((Number(myData[0].FreeSaleCapacityPercentage).toFixed(2) + " %"));
                        $('#' + OBVolPr).text((Number(myData[0].OverBookingCapacityVolPercentage).toFixed(2) + " %"));
                        $('#' + FSVolPr).text((Number(myData[0].FreeSaleCapacityVolPercentage).toFixed(2) + " %"));

                        $('#' + RSCapPr).text((Number(myData[0].ReservedCapacityPercentage).toFixed(2) + " %"));
                        $('#' + RSVolPr).text((Number(myData[0].ReservedCapacityVolPercentage).toFixed(2) + " %"));

                        //if (total > 100 || FSCtotal > 100) {
                        //    ShowMessage('info', 'Need your Kind Attention!', "Value must be less than 100.");
                        //}

                        //if ($("#OBcap_" + index).html().slice(0, -1) > 100.00) {
                        //    ShowMessage('info', 'Need your Kind Attention!', "OverBookingCapacity Value must be less than 100.");
                        //    $('#tblScheduleTrans_OverBookingCapacity_ ' + i).val('');
                        //}
                        //if ($("#fscap_" + index).html().slice(0, -1) > 100.00) {
                        //    ShowMessage('info', 'Need your Kind Attention!', "FreeSaleCapacity Value must be less than 100.");
                        //    $('#tblScheduleTrans_FreeSaleCapacity_ ' + i).val('');
                        //}



                        ///Accordin to volume free sale Capacity and Overbooking capacity
                        prevvol[index] = $('#' + FSCVol).val();
                        Obprevvol[index] = $('#' + OBCVol).val();
                        Umg[index] = $('#' + UM).val();
                        Umv[index] = $('#' + UMV).val();
                        $('#tblScheduleTrans_UMG_' + index).attr('disabled', true);
                        $('#tblScheduleTrans_UMV_' + index).attr('disabled', true);
                        var OBCvaluevol = $('#' + OBCVol).val();
                        var FSCvaluevol = $('#' + FSCVol).val();
                        var weightvol = $('#' + _AVW).val();

                        var totalvol = parseFloat((OBCvaluevol / weightvol) * 100);
                        var FSCtotalvol = parseFloat((FSCvaluevol / weightvol) * 100);

                        // $("#OBcapvol_" + index).remove();
                        // $('#' + OBCVol).after('<span id="OBcapvol_' + index + '">&nbsp;&nbsp;' + (Number(myData[0].OverBookingCapacityVolPercentage).toFixed(2) + "&nbsp%") + '</span>');
                        // percenovervol[index] = $("#OBcapvol_" + index).html();
                        //$("#fscapvol_" + index).remove();
                        // $('#' + FSCVol).after('<span id="fscapvol_' + index + '">&nbsp;&nbsp;' + (Number(myData[0].FreeSaleCapacityVolPercentage).toFixed(2) + "&nbsp%") + '</span>');
                        //percencapvol[index] = $("#fscapvol_" + index).html();



                        //if ($('#' + UM).val() == "K" || $('#' + UM).val() == "L") {
                        //    //$('#' + OBCVol).attr("disabled", true);
                        //    //$('#' + FSCVol).attr("disabled", true);
                        //    $('#' + OBC).attr("disabled", false);
                        //    $('#' + FSC).attr("disabled", false);
                        //}
                        //else {
                        //    $('#' + OBC).attr("disabled", true);
                        //    $('#' + FSC).attr("disabled", true);
                        //}
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });


        if (SetAllAircraft[AddVal].AircraftFlag == true) {
            return false;
        }

    });

    //var Vl=$('input[id^=tblScheduleTrans_AirCraft_]').not('[id="tblScheduleTrans_AirCraft_' + value.split('_')[2] + '"]').val()||'';
    var vl = Filter.find('input[id^=tblScheduleTrans_AirCraft_]').not('[id="tblScheduleTrans_AirCraft_' + value.split('_')[2] + '"]').val() || '';
    var hasData = vl.length;
    if (hasData > 0) {
        // AircraftFlag = true;
        SetAllAircraft[AddVal].AircraftFlag = true;
    }
}

function ButtonHideShow(strValue) {
    //var ReplaceString = strValue.replace('tblScheduleTrans_', 'tblScheduleTrans_Hdn');

    //var previousID = '';
    //var nextID = '';

    //if ($('#' + strValue.replace('Destination', 'Row')).closest('tr').prev().length > 0)
    //    previousID = $('#' + strValue.replace('Destination', 'Row')).closest('tr').prev()[0].id.replace('tblScheduleTrans_Row_', '');
    //if ($('#' + strValue.replace('Destination', 'Row')).closest('tr').next().length > 0)
    //    nextID = $('#' + strValue.replace('Destination', 'Row')).closest('tr').next()[0].id.replace('tblScheduleTrans_Row_', '');

    //var total = $('#tbl' + dbTableName).appendGrid('getRowCount');

    //$('#tbl' + dbTableName).appendGrid('getRowCount') == strValue.replace('tblScheduleTrans_Destination_', '')
    //if ($('#' + ReplaceString).val() == $("#Destination")[0].value && $('#tbl' + dbTableName).appendGrid('getRowCount') == strValue.replace('tblScheduleTrans_Destination_', ''))
    //    $('#tblScheduleTrans_btnUpdateAll').show();
    //else {
    //    $('#tblScheduleTrans_btnUpdateAll').hide();

    //    if ($('#' + ReplaceString).val() != $("#Destination")[0].value ) {
    //        $('#tblScheduleTrans_HdnOrigin_'  + nextID).val($('#tblScheduleTrans_HdnDestination_' + (strValue.replace('tblScheduleTrans_Destination_', ''))).val());
    //        $('#tblScheduleTrans_Origin_' + nextID).val($('#tblScheduleTrans_Destination_' + (strValue.replace('tblScheduleTrans_Destination_', ''))).val());
    //    }
    //    else
    //    {
    //        $('#tblScheduleTrans_HdnOrigin_' +  nextID).val($('#Origin').val());
    //        $('#tblScheduleTrans_Origin_' +  nextID).val($('#Text_Origin').val());
    //    }
    //}
}

function CheckCAO(evt, rowIndex) {
    //$('input[type="text"][id^="tblScheduleTrans_AirCraft_' + (rowIndex + 1) + '"]').val('');
    //$('input[type="hidden"][id^="tblScheduleTrans_HdnAirCraft_' + (rowIndex + 1) + '"]').val('');

    var target = evt.target.id.split('_')[3];
    var Untarget = (target == 0) ? 1 : (target == 1 ? 0 : 2);
    var ARowID = evt.target.id.split('_')[2];
    var AddVal = $('#tblScheduleTrans_AddLegNo_' + ARowID).val();
    //$('#tblScheduleTrans tr[id]')
    var Filter = $('[id^=tblScheduleTrans_AddLegNo_][value=' + AddVal + ']').parent().parent();
    if (SetAllAircraft[AddVal].AircraftFlag == false) {
        Filter.each(function () {
            $('input[type="radio"][id^="tblScheduleTrans_RbtnIsCAO_' + this.id.split('_')[2] + '"][value="' + target + '"]').attr('checked', 'checked');
            $('input[type="radio"][id^="tblScheduleTrans_RbtnIsCAO_' + this.id.split('_')[2] + '"][value="' + Untarget + '"]').removeAttr('checked');
            $('input[type="text"][id^="tblScheduleTrans_AirCraft_"]').val('');
            $('input[type="hidden"][id^="tblScheduleTrans_HdnAirCraft_"]').val('');
            $('input[type="hidden"][id^="tblScheduleTrans_AllocatedGrossWeight_"]').val('').attr("readonly", "readonly");
            $('input[type="hidden"][id^="_temptblScheduleTrans_AllocatedGrossWeight_"]').val('').attr("readonly", "readonly");
            $('input[type="hidden"][id^="tblScheduleTrans_AllocatedVolumeWeight_"]').val('').attr("readonly", "readonly");
            $('input[type="hidden"][id^="_temptblScheduleTrans_AllocatedVolumeWeight_"]').val('').attr("readonly", "readonly");
            clearCapacityData(this.id.split('_')[2]);

        });
    }
    else if (SetAllAircraft[AddVal].AircraftFlag == true) {
        $('input[type="text"][id^="tblScheduleTrans_AirCraft_' + evt.target.id.split('_')[2] + '"]').val('');
        $('input[type="hidden"][id^="tblScheduleTrans_HdnAirCraft_' + evt.target.id.split('_')[2] + '"]').val('');

        $('input[type="hidden"][id^="tblScheduleTrans_AllocatedGrossWeight_' + evt.target.id.split('_')[2] + '"]').val('').attr("readonly", "readonly");
        $('input[type="hidden"][id^="_temptblScheduleTrans_AllocatedGrossWeight_' + evt.target.id.split('_')[2] + '"]').val('').attr("readonly", "readonly");
        $('input[type="hidden"][id^="tblScheduleTrans_AllocatedVolumeWeight_' + evt.target.id.split('_')[2] + '"]').val('').attr("readonly", "readonly");
        $('input[type="hidden"][id^="_temptblScheduleTrans_AllocatedVolumeWeight_' + evt.target.id.split('_')[2] + '"]').val('').attr("readonly", "readonly");
        clearCapacityData(evt.target.id.split('_')[2]);
    }
}

function CheckCharter(evt, rowIndex) {
    var target = evt.target.id.split('_')[3];
    var Untarget = (target == 0) ? 1 : (target == 1 ? 0 : 2)
    var AddLegVal = $('[id^="tblScheduleTrans_AddLegNo_' + evt.target.id.split('_')[2] + '"]').val();
    $('#tblScheduleTrans tr[id]').each(function () {
        if ($('[id^="tblScheduleTrans_AddLegNo_' + this.id.split('_')[2] + '"]').val() == AddLegVal) {
            $('input[type="radio"][id^="tblScheduleTrans_RbtnIsCharter_' + this.id.split('_')[2] + '"][value="' + target + '"]').attr('checked', 'checked');
            $('input[type="radio"][id^="tblScheduleTrans_RbtnIsCharter_' + this.id.split('_')[2] + '"][value="' + Untarget + '"]').removeAttr('checked');
        }
    });
}

function FlightBlur(obj) {
    if ($("#FlightNumber").val() != "" && userContext.SysSetting.FlightNumberPrefixZero.toUpperCase() == "YES") {
        if ($("#FlightNumber").val().length < 4) {
            if ($("#FlightNumber").val().length == 1) {
                $("#FlightNumber").val('000' + $("#FlightNumber").val());
            }
            else if ($("#FlightNumber").val().length == 2) {
                $("#FlightNumber").val('00' + $("#FlightNumber").val());
            }
            else {
                $("#FlightNumber").val('0' + $("#FlightNumber").val());
            }
        }
    }
    else if ($("#FlightNumber").val() != "" && userContext.SysSetting.FlightNumberPrefixZero.toUpperCase() != "YES") {
        if (parseInt($("#FlightNumber").val()) == 0) {
            ShowMessage('warning', 'Flight Number', "Please fill valid Flight Number.");
            $("#FlightNumber").val('');
        }
        else
            $("#FlightNumber").val(parseInt($("#FlightNumber").val()).toString());
    }
}



//$("#Text_CarrierCode").on("keydown", function (event, ui) {
//     post value to console for validation
//    alert('hello');
//    console.log($(this).val());
//});


function getFlightnumber() {


    var flightno = $('#tblScheduleTrans_HdnAirCraft_1').val();
    GetScheduleCapacity(flightno);
    //  overbookingcapacity =$('#OverBookingCapacity').val();
    // Freesalecapacity = $('#Freesalecapacity').val();

}
function GetScheduleCapacity(value) {
    $.ajax({
        url: "Services/Schedule/ScheduleService.svc/ScheduleCapacity",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            str: value
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(result);
                $('#OverBookingCapacity').val(myData[0].OverBookingCapacity);
                $('#FreeSaleCapacity').val(myData[0].FreeSaleCapacity);
                $('#_tempOverBookingCapacity').val(myData[0].OverBookingCapacity);
                $('#_tempFreeSaleCapacity').val(myData[0].FreeSaleCapacity);
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function CheckRange() {


    var dbtableName = "AccountTargetCommTrans";
    var commisonvalue = $('#OverBookingCapacity').val();
    var commisontype = $('#tbl' + dbtableName + '_CommisionType_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val();
    if (commisontype == '1') {
        if (commisonvalue > 100) {
            //alert('Value must be less than 100.');
            $("#tblAccountTargetCommTrans_btnAppendRow").hide();
            ShowMessage('info', 'Need your Kind Attention!', "Value must be less than 100.");
            $('#tbl' + dbtableName + '_CommisionValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val('0.00');
            //  $(rowIndex).val('0.00');
        }
        else {
            $("#tblAccountTargetCommTrans_btnAppendRow").show();
        }
    }
    //  alert('End Value must be greater than Start Value.');
}


//$("#OverBookingCapacity").blur(function () {

//    var value = $('#OverBookingCapacity').val();
//    if (value > 100)
//    {
//        ShowMessage('info', 'Need your Kind Attention!', "Value must be less than 100.");
//        $('#OverBookingCapacity').val(overbookingcapacity);
//    }
//    //CheckRange();
//});



//$("#FreeSaleCapacity").keypress(function () {

//    var value = $('#FreeSaleCapacity').val();
//    if (value > 100) {
//        ShowMessage('info', 'Need your Kind Attention!', "Value must be less than 100.");
//        $('#FreeSaleCapacity').val(Freesalecapacity);
//    }
//    //CheckRange();
//});

function myformatter(cellvalue, options, rowObject) {
    return cellvalue + ' ' + rowObject.IsCodeShare;
}


//Added by Vsingh For OverBooking Capacity on 06/01/2017


function CheckRageOBCCapacity(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $('#tblScheduleTrans_OBCapPr_' + index).html();//$("#OBcap_" + index).html();
    var OBCvalue = $('#tblScheduleTrans_OverBookingCapacity_' + index).val();
    if (OBCvalue == "") {
        $('#tblScheduleTrans_OverBookingCapacity_' + index + ',#_temptblScheduleTrans_OverBookingCapacity_' + index + '').val('0');
    }

    if (OBCvalue != "" || OBCvalue != 0) {
        var weight = $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val();
        var total = parseFloat((OBCvalue / (weight)) * 100);
        total = isNaN(total) ? 0 : total;
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        //$("#OBcap_" + index).remove();
        //$('#tblScheduleTrans_OverBookingCapacity_' + index).after('<span id="OBcap_' + index + '">&nbsp;&nbsp;' + (total.toFixed(2) + "&nbsp%") + '</span>');
        $('#tblScheduleTrans_OBCapPr_' + index).text((total.toFixed(2) + " %"));
        if (total > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Overbooking capacity value must be less than 100%.");
            $("#OBcap_" + index).remove();//.html(percenover[index]);
            $('#tblScheduleTrans_OverBookingCapacity_' + index + ',#_temptblScheduleTrans_OverBookingCapacity_' + index + '').val((0).toFixed(2));//.val(Obprev[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        // $("#OBcap_" + index).remove();
        $('#tblScheduleTrans_OBCapPr_' + index).text("0.00 %");
    }
}
//Added by Vsingh For OverBooking Capacity on 06/01/2017

//Added by Vsingh For FreeSale Capacity on 06/01/2017

function CheckRageFSCCapacity(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $('#tblScheduleTrans_FSCapPr_' + index).html(); //$("#fscap_" + index).html();
    var FSCvalue = $('#tblScheduleTrans_FreeSaleCapacity_' + index).val();

    if (FSCvalue == "") {
        $('#tblScheduleTrans_FreeSaleCapacity_' + index + ',#_temptblScheduleTrans_FreeSaleCapacity_' + index + '').val('0');
    }
    if (FSCvalue != "" || FSCvalue != 0) {
        var weight = $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val();
        // tblScheduleTrans_AirCraft_1
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        var FSCtotal = parseFloat((FSCvalue / (weight)) * 100);

        FSCtotal = isNaN(FSCtotal) ? 0 : FSCtotal;

        //$("#fscap_" + index).remove();
        //$('#tblScheduleTrans_FreeSaleCapacity_' + index).after('<span id="fscap_' + index + '">&nbsp;&nbsp;' + (FSCtotal.toFixed(2) + "&nbsp%") + '</span>');
        $('#tblScheduleTrans_FSCapPr_' + index).text((FSCtotal.toFixed(2) + " %"));

        if (FSCtotal > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Free Sale Capacity Value must be less than 100%.");
            //$("#fscap_" + index).remove();//.html(percencap[index]);
            $('#tblScheduleTrans_FreeSaleCapacity_' + index + ',#_temptblScheduleTrans_FreeSaleCapacity_' + index + '').val((0).toFixed(2));//.val(prev[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        // $("#fscap_" + index).remove();
        $('#tblScheduleTrans_FSCapPr_' + index).text("0.00 %");
    }

};

//Added by Vsingh For FreeSale Capacity on 06/01/2017





//Added by Vsingh For OverBooking Capacity on 09/01/2017
function CheckRageOBCCapacityVol(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $('#tblScheduleTrans_OBVolPr_' + index).html(); //$("#OBcapvol_" + index).html();
    var OBCvaluevol = $('#tblScheduleTrans_OverBookingCapacityVol_' + index).val();

    if (OBCvaluevol == "") {
        $('#tblScheduleTrans_OverBookingCapacityVol_' + index + ',#_temptblScheduleTrans_OverBookingCapacityVol_' + index + '').val('0');
    }

    if (OBCvaluevol != "" || OBCvaluevol != 0) {
        var weightvol = $('#tblScheduleTrans_AllocatedVolumeWeight_' + index).val();
        var totalvol = parseFloat((OBCvaluevol / (weightvol)) * 100);
        totalvol = isNaN(totalvol) ? 0 : totalvol;
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        //$("#OBcapvol_" + index).remove();
        //$('#tblScheduleTrans_OverBookingCapacityVol_' + index).after('<span id="OBcapvol_' + index + '">&nbsp;&nbsp;' + (totalvol.toFixed(2) + "&nbsp%") + '</span>');
        $('#tblScheduleTrans_OBVolPr_' + index).text((totalvol.toFixed(2) + " %"));
        if (totalvol > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Overbooking capacity value must be less than 100%.");
            //$("#OBcapvol_" + index).remove();//.html(percenovervol[index]);
            $('#tblScheduleTrans_OverBookingCapacityVol_' + index + ',#_temptblScheduleTrans_OverBookingCapacityVol_' + index + '').val((0).toFixed(3));//.val(Obprevvol[index]);

            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        //$("#OBcapvol_" + index).remove();
        $('#tblScheduleTrans_OBVolPr_' + index).text("0.00 %");
    }
}
//Added by Vsingh For OverBooking Capacity on 09/01/2017


//Added by Vsingh For FreeSale Capacity on 09/01/2017

function CheckRageFSCCapacityVol(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $('#tblScheduleTrans_FSVolPr_' + index).html();//$("#fscapvol_" + index).html();
    var FSCvaluevol = $('#tblScheduleTrans_FreeSaleCapacityVol_' + index).val();

    if (FSCvaluevol == "") {
        $('#tblScheduleTrans_FreeSaleCapacityVol_' + index + ',#_temptblScheduleTrans_FreeSaleCapacityVol_' + index + '').val('0');
    }

    if (FSCvaluevol != "" || FSCvaluevol != 0) {
        var weightvol = $('#tblScheduleTrans_AllocatedVolumeWeight_' + index).val();
        // tblScheduleTrans_AirCraft_1
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        var FSCtotalvol = parseFloat((FSCvaluevol / (weightvol)) * 100);

        FSCtotalvol = isNaN(FSCtotalvol) ? 0 : FSCtotalvol;

        //$("#fscapvol_" + index).remove();
        //$('#tblScheduleTrans_FreeSaleCapacityVol_' + index).after('<span id="fscapvol_' + index + '">&nbsp;&nbsp;' + (FSCtotalvol.toFixed(2) + "&nbsp%") + '</span>');
        $('#tblScheduleTrans_FSVolPr_' + index).text((FSCtotalvol.toFixed(2) + " %"));
        if (FSCtotalvol > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Free Sale Capacity Value must be less than 100%.");
            //$("#fscapvol_" + index).remove();//.html(percencapvol[index]);
            $('#tblScheduleTrans_FreeSaleCapacityVol_' + index + ',#_temptblScheduleTrans_FreeSaleCapacityVol_' + index + '').val((0).toFixed(3))//.val(prevvol[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        //$("#fscapvol_" + index).remove();
        $('#tblScheduleTrans_FSVolPr_' + index).text("0.00 %");
    }

};

//Added by Vsingh For FreeSale Capacity on 09/01/2017


//Added BY Pankaj Khanna
function CheckRageRSCapacity(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $('#tblScheduleTrans_RSCapPr_' + index).html(); //$("#fscap_" + index).html();
    var FSCvalue = $('#tblScheduleTrans_ReservedCapacity_' + index).val();

    if (FSCvalue == "") {
        $('#tblScheduleTrans_ReservedCapacity_' + index + ',#_temptblScheduleTrans_ReservedCapacity_' + index + '').val('0');
    }
    if (FSCvalue != "" || FSCvalue != 0) {
        var weight = $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val();
        // tblScheduleTrans_AirCraft_1
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        var FSCtotal = parseFloat((FSCvalue / (weight)) * 100);

        FSCtotal = isNaN(FSCtotal) ? 0 : FSCtotal;

        //$("#fscap_" + index).remove();
        //$('#tblScheduleTrans_FreeSaleCapacity_' + index).after('<span id="fscap_' + index + '">&nbsp;&nbsp;' + (FSCtotal.toFixed(2) + "&nbsp%") + '</span>');
        $('#tblScheduleTrans_RSCapPr_' + index).text((FSCtotal.toFixed(2) + " %"));

        if (FSCtotal > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Reserved Capacity Value must be less than 100%.");
            //$("#fscap_" + index).remove();//.html(percencap[index]);
            $('#tblScheduleTrans_ReservedCapacity_' + index + ',#_temptblScheduleTrans_ReservedCapacity_' + index + '').val((0).toFixed(2));//.val(prev[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        // $("#fscap_" + index).remove();
        $('#tblScheduleTrans_RSCapPr_' + index).text("0.00 %");
    }

};

function CheckRageRSCapacityVol(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $('#tblScheduleTrans_RSVolPr_' + index).html();//$("#fscapvol_" + index).html();
    var RSCvaluevol = $('#tblScheduleTrans_ReservedCapacityVol_' + index).val();

    if (RSCvaluevol == "") {
        $('#tblScheduleTrans_ReservedCapacityVol_' + index + ',#_temptblScheduleTrans_ReservedCapacityVol_' + index + '').val('0');
    }

    if (RSCvaluevol != "" || RSCvaluevol != 0) {
        var weightvol = $('#tblScheduleTrans_AllocatedVolumeWeight_' + index).val();
        // tblScheduleTrans_AirCraft_1
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        var RSCtotalvol = parseFloat((RSCvaluevol / (weightvol)) * 100);

        RSCtotalvol = isNaN(RSCtotalvol) ? 0 : RSCtotalvol;

        //$("#fscapvol_" + index).remove();
        //$('#tblScheduleTrans_FreeSaleCapacityVol_' + index).after('<span id="fscapvol_' + index + '">&nbsp;&nbsp;' + (FSCtotalvol.toFixed(2) + "&nbsp%") + '</span>');
        $('#tblScheduleTrans_RSVolPr_' + index).text((RSCtotalvol.toFixed(2) + " %"));
        if (RSCtotalvol > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Free Sale Capacity Value must be less than 100%.");
            //$("#fscapvol_" + index).remove();//.html(percencapvol[index]);
            $('#tblScheduleTrans_ReservedCapacityVol_' + index + ',#_temptblScheduleTrans_ReservedCapacityVol_' + index + '').val((0).toFixed(3))//.val(prevvol[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        //$("#fscapvol_" + index).remove();
        $('#tblScheduleTrans_RSVolPr_' + index).text("0.00 %");
    }

};



function CheckUMtype(rowIndex) {
    var index = rowIndex.split('_')[2];
    var Umtype = '#tblScheduleTrans_UMG_';
    var aircraft = 'tblScheduleTrans_AirCraft_' + index;
    //  grwt[index] = $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val();

    var lbs;

    if ($(Umtype + index).val().toUpperCase() == "K") {
        aircraftvaluesenable();
        if (Umg[index] == 'L') {
            var kg = grwt[index] * 0.453592;
            $('#_temptblScheduleTrans_AllocatedGrossWeight_' + index).val(kg);
            $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val(kg);
            CheckRageOBCCapacity('tblScheduleTrans_OverBookingCapacity_' + index);
            CheckRageFSCCapacity('tblScheduleTrans_FreeSaleCapacity_' + index);
        }
        else {

            //if (pageType == "EDIT") {
            //    // populateValueCell(aircraft);
            //    CheckRageOBCCapacity('tblScheduleTrans_OverBookingCapacity_' + index);
            //    CheckRageFSCCapacity('tblScheduleTrans_FreeSaleCapacity_' + index);
            //}
            //else {
            $('#_temptblScheduleTrans_AllocatedGrossWeight_' + index).val(grwt[index]);
            $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val(grwt[index]);
            CheckRageOBCCapacity('tblScheduleTrans_OverBookingCapacity_' + index);
            CheckRageFSCCapacity('tblScheduleTrans_FreeSaleCapacity_' + index);
            // }
        }

        return true;
    }
    else if ($(Umtype + index).val().toUpperCase() == "L") {
        aircraftvaluesenable(index);
        if (Umg[index] == 'K') {
            var lbs = grwt[index] * 2.20462;
            $('#_temptblScheduleTrans_AllocatedGrossWeight_' + index).val(lbs);
            $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val(lbs);
            CheckRageOBCCapacity('tblScheduleTrans_OverBookingCapacity_' + index);
            CheckRageFSCCapacity('tblScheduleTrans_FreeSaleCapacity_' + index);
        }
        else {
            //if (pageType == "EDIT") {
            //    // populateValueCell(aircraft);
            //    CheckRageOBCCapacity('tblScheduleTrans_OverBookingCapacity_' + index);
            //    CheckRageFSCCapacity('tblScheduleTrans_FreeSaleCapacity_' + index);
            //}
            //else {
            $('#_temptblScheduleTrans_AllocatedGrossWeight_' + index).val(grwt[index]);
            $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val(grwt[index]);
            CheckRageOBCCapacity('tblScheduleTrans_OverBookingCapacity_' + index);
            CheckRageFSCCapacity('tblScheduleTrans_FreeSaleCapacity_' + index);
            //  }
        }


        return true;
    }
    else {
        aircraftvaluesdisable();
        ShowMessage('info', 'Need your Kind Attention!', "GrossWt. should be in Kg or LBS in terms of K/L.");
        $('#tblScheduleTrans_UMG_' + index).val('');
    }





    // $('#tblScheduleTrans_UMG_'+index).mousedown(function (e) {
    //    var regex = new RegExp("^[k-lK-L]");
    //    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    //    if (regex.test(str)) {
    //        return true;
    //    }

    //    e.preventDefault();             
    //    ShowMessage('info', 'Need your Kind Attention!', "You canenter GrossWeight Only in KK or LBS interms of K/L");
    //    $('#tblScheduleTrans_UMG_' + index).val('');
    //    return false;
    //});
    //if ($(Umtype + index).val() == "K" || $(Umtype + index).val() == "k")
    //{
    //    aircraftvaluesenable(index);
    //       return true;
    //   }
    //else if ($(Umtype + index).val() == "L" || $(Umtype + index).val() == "l") {
    //    aircraftvaluesenable(index);
    //       return true;
    //   }
    //   else
    //   {
    //    //  ShowMessage('info', 'Need your Kind Attention!', "You canenter GrossWeight Only in KK or LBS interms of K/L");
    //    aircraftvaluesdisable(index);
    //       $('#tblScheduleTrans_UMG_' + index).val('');
    //   }


}



function CheckUMenter(event, rowIndex) {
    var index = rowIndex.split('_')[2];
    var Umtype = '#tblScheduleTrans_UMG_';
    $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val();

    var lbs;

    if ($(Umtype + index).val().toUpperCase() == "K") {
        aircraftvaluesenable();
        //if (Umg[index] == 'l' || Umg[index] == 'L')
        //{
        //    var kg = grwt[index] * 0.453592;
        //    $('#_temptblScheduleTrans_AllocatedGrossWeight_' + index).val(kg);
        //    $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val(kg);
        //}
        //else
        //{
        //    $('#_temptblScheduleTrans_AllocatedGrossWeight_' + index).val(grwt[index]);
        //    $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val(grwt[index]);
        //}

        return true;
    }
    else if ($(Umtype + index).val().toUpperCase() == "L") {
        aircraftvaluesenable(index);
        //if (Umg[index] == 'K' || Umg[index] == 'k') {
        //    var lbs = grwt[index] * 2.20462;
        //    $('#_temptblScheduleTrans_AllocatedGrossWeight_' + index).val(lbs);
        //    $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val(lbs);
        //}
        //else {
        //    $('#_temptblScheduleTrans_AllocatedGrossWeight_' + index).val(grwt[index]);
        //    $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val(grwt[index]);
        //}


        return true;
    }
    else {
        aircraftvaluesdisable();
        ShowMessage('info', 'Need your Kind Attention!', "GrossWt. should be in Kg or LBS in terms of K/L.");
        $('#tblScheduleTrans_UMG_' + index).val('');
    }

};
//$('input[type="button"][name=""tblScheduleTrans_btnUpdateAll"]').click(function () {


function aircraftvaluesenable(index) {
    var i = index;
    $('#tblScheduleTrans_OverBookingCapacity_' + i).attr("disabled", false);
    $('#tblScheduleTrans_FreeSaleCapacity_' + i).attr("disabled", false);
    //  $('#tblScheduleTrans_OverBookingCapacityVol_' + i).attr("disabled", false);
    //  $('#tblScheduleTrans_FreeSaleCapacityVol_' + i).attr("disabled", false);
}
function aircraftvaluesdisable(index) {
    var i = index;
    $('#tblScheduleTrans_OverBookingCapacity_' + i).attr("disabled", true);
    $('#tblScheduleTrans_FreeSaleCapacity_' + i).attr("disabled", true);
    // $('#tblScheduleTrans_OverBookingCapacityVol_' + i).attr("disabled", true);
    // $('#tblScheduleTrans_FreeSaleCapacityVol_' + i).attr("disabled", true);
}


function disable(i) {


    var carriercode = $("#tblScheduleTrans_CodeShareCarrierCode_" + i).val();
    var flightNo = $("#tblScheduleTrans_CodeShareFlightNumber_" + i).val();
    var inputid = "#tblScheduleTrans_IsCodeShare_" + i;
    var aircraft = 'tblScheduleTrans_AirCraft_' + i;
    // populateValueCell(aircraft);

    //if ($("#OBcap_" + i).html().slice(0, -1) > 100.00)
    //{
    //    ShowMessage('info', 'Need your Kind Attention!', "OverBookingCapacity Value must be less than 100.");
    //    $('tblScheduleTrans_OverBookingCapacity_ '+ i).val('0');
    //} 
    //if ($("#fscap_" + i).html().slice(0, -1) > 100.00) {
    //    ShowMessage('info', 'Need your Kind Attention!', "OverBookingCapacity Value must be less than 100.");
    //    $('tblScheduleTrans_FreeSaleCapacity_ ' + i).val('0');
    //}




    if ($(inputid).is(':checked')) {
        $("#tblScheduleTrans_CodeShareFlightNumber_" + i);
        $("#tblScheduleTrans_CodeShareCarrierCode_" + (i)).data("kendoAutoComplete").enable(true);
        // $("#tblScheduleTrans_CodeShareCarrierCode_" + i).kendoAutoComplete({ enable: true});
        $("#tblScheduleTrans_CodeShareFlightNumber_" + i).prop("disabled", false);
        $("#tblScheduleTrans_IsCodeShare_" + i).is(':checked') ? 1 : 0;
        // $("#tblScheduleTrans_CodeShareFlightNumber_" + i).val(flightNo);
        // $("#tblScheduleTrans_CodeShareCarrierCode_" + i).val(carriercode);
    }
    else {

        $("#tblScheduleTrans_CodeShareFlightNumber_" + i).prop("disabled", true);
        $("#tblScheduleTrans_CodeShareCarrierCode_" + i).prop("disabled", true);
        $("#tblScheduleTrans_CodeShareCarrierCode_" + (i)).data("kendoAutoComplete").enable(false);
        //$("#tblScheduleTrans_CodeShareCarrierCode_" + i).kendoAutoComplete({enable: false});
        $("#tblScheduleTrans_IsCodeShare_" + i).is(':checked') ? 1 : 0;

        // $("#tblScheduleTrans_CodeShareFlightNumber_" + i).val(flightNo);
        // $("#tblScheduleTrans_CodeShareCarrierCode_" + i).val(carriercode);

        $("#tblScheduleTrans_CodeShareCarrierCode_" + i).attr("required", false);
        $("#tblScheduleTrans_CodeShareFlightNumber_" + i).attr("required", false);
    }


}

//check DirtyFields Inside the Page
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};

//======================Added By Arman Ali  Date 3 Apr @2017=======================
function checkMainCarrierCode(obj) {
    //var ID = $(obj).attr('id');
    //$('input[id^=tblScheduleTrans_CodeShareCarrierCode_]').val($('#' + ID).val());
    //$('input[id^=tblScheduleTrans_HdnCodeShareCarrierCode_]').val($('#tblScheduleTrans_HdnCodeShareCarrierCode_' + ID.split('_')[2]).val());

    var ID = $(obj).attr('id').split('_')[2];
    var AddLegVal = $('[id^=tblScheduleTrans_AddLegNo_' + ID + ']').val();
    $('[id^=tblScheduleTrans_AddLegNo_][value=' + AddLegVal + ']').parents('tr[id]').find('[id^=tblScheduleTrans_CodeShareCarrierCode_]').val($('#' + $(obj).attr('id')).val());

}
function checkMainFlightNo(obj) {
    //$('input[id^=tblScheduleTrans_CodeShareFlightNumber_]').val($('#' + obj).val());
    var ID = obj.split('_')[2];
    var AddLegVal = $('[id^=tblScheduleTrans_AddLegNo_' + ID + ']').val();
    $('[id^=tblScheduleTrans_AddLegNo_][value=' + AddLegVal + ']').parents('tr[id]').find('[id^=tblScheduleTrans_CodeShareFlightNumber_]').val($('#' + obj).val());
}
// ================End=============================================================
//===========================================Added by arman ali 17-04-2017=========================
function checkcodeshare() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var RowCount = $('#tblScheduleTrans_rowOrder').val().split(',');
        for (var count = 1; count <= $('#tblScheduleTrans_rowOrder').val().split(",").length; count++) {
            if (!$('#tblScheduleTrans_IsCodeShare_' + RowCount[count]).is(':checked')) {

                $('#tblScheduleTrans_CodeShareFlightNumber_' + RowCount[count]).attr('required', false);
                $('#tblScheduleTrans_CodeShareCarrierCode_' + RowCount[count]).attr('required', false);
                $('#tblScheduleTrans_CodeShareFlightNumber_' + RowCount[count]).prop("disabled", true);

                $('#tblScheduleTrans_CodeShareCarrierCode_' + RowCount[count]).attr('disabled', true);
                //   $('#tblScheduleTrans_CodeShareCarrierCode_' + RowCount[count]).data("kendoAutoComplete").enable(false);


            }
        }
    }
}
//=================================end here===============================================================


function clearCapacityData(RowID) {
    $('input[name=operation]').hide();
    $('#ValidateBtn').show();
    IsValidSchedule = false;

    $('#tblScheduleTrans_AllocatedGrossWeight_' + RowID + ',#_temptblScheduleTrans_AllocatedGrossWeight_' + RowID + '').val(0).attr('readonly', true);//.removeAttr('readonly');
    $('#tblScheduleTrans_AllocatedVolumeWeight_' + RowID + ',#_temptblScheduleTrans_AllocatedVolumeWeight_' + RowID + '').val(0).attr('readonly', true);//.removeAttr('readonly');
    $('#tblScheduleTrans_OverBookingCapacity_' + RowID + ',#_temptblScheduleTrans_OverBookingCapacity_' + RowID + '').val(0).removeAttr('disabled').attr('readonly', true);//.removeAttr('disabled');
    $('#tblScheduleTrans_OverBookingCapacityVol_' + RowID + ',#_temptblScheduleTrans_OverBookingCapacityVol_' + RowID + '').val(0).removeAttr('disabled').attr('readonly', true);//.removeAttr('disabled');
    $('#tblScheduleTrans_FreeSaleCapacity_' + RowID + ',#_temptblScheduleTrans_FreeSaleCapacity_' + RowID + '').val(0).removeAttr('disabled').attr('readonly', true);//.removeAttr('disabled');
    $('#tblScheduleTrans_FreeSaleCapacityVol_' + RowID + ',#_temptblScheduleTrans_FreeSaleCapacityVol_' + RowID + '').val(0).removeAttr('disabled').attr('readonly', true);//.removeAttr('disabled');
    $('#tblScheduleTrans_ReservedCapacity_' + RowID + ',#_temptblScheduleTrans_ReservedCapacity_' + RowID + '').val(0).removeAttr('disabled').attr('readonly', true);//.removeAttr('disabled');
    $('#tblScheduleTrans_ReservedCapacityVol_' + RowID + ',#_temptblScheduleTrans_ReservedCapacityVol_' + RowID + '').val(0).removeAttr('disabled').attr('readonly', true);//.removeAttr('disabled');
    $('#tblScheduleTrans_MaxGrossPerPcs_' + RowID + ',#_temptblScheduleTrans_MaxGrossPerPcs_' + RowID + '').val(0).attr('readonly', false);//.removeAttr('readonly');
    $('#tblScheduleTrans_MaxVolumePerPcs_' + RowID + ',#_temptblScheduleTrans_MaxVolumePerPcs_' + RowID + '').val(0).attr('readonly', false);//.removeAttr('readonly');
    $('#OBcap_' + RowID + ',#OBcapvol_' + RowID + '').text('');
    $('#fscap_' + RowID + ',#fscapvol_' + RowID + '').text('');
    $('#tblScheduleTrans_OBCapPr_' + RowID + '').text('0.00 %');
    $('#tblScheduleTrans_OBVolPr_' + RowID + '').text('0.00 %');
    $('#tblScheduleTrans_FSCapPr_' + RowID + '').text('0.00 %');
    $('#tblScheduleTrans_FSVolPr_' + RowID + '').text('0.00 %');
    $('#tblScheduleTrans_RSCapPr_' + RowID + '').text('0.00 %');
    $('#tblScheduleTrans_RSVolPr_' + RowID + '').text('0.00 %');
    $('#tblScheduleTrans_UMG_' + RowID + ',#tblScheduleTrans_UMV_' + RowID + '').val('');
}

function onChangeGross(id) {
    CheckRageOBCCapacity(id);
    CheckRageFSCCapacity(id);
}

function onChangeVol(id) {
    CheckRageOBCCapacityVol(id)
    CheckRageFSCCapacityVol(id)
}

function DayDiffCalculation() {
    var Row_ID = '';
    var DipDiffrence_ID = '#tblScheduleTrans_DayDifference_';
    var ArriDiffrence_ID = '#tblScheduleTrans_SDDifference_';
    var Ori_ID = '#tblScheduleTrans_HdnOrigin_';
    var Dest_ID = '#tblScheduleTrans_HdnDestination_';
    var ETD_ID = '#tblScheduleTrans_ETD_';
    var ETA_ID = '#tblScheduleTrans_ETA_';
    var Origin = '#tblScheduleTrans_Origin_';
    var Deststination = '#tblScheduleTrans_Destination_';
    var No_Rows = $('[id^=tblScheduleTrans_Row_]').length;
    var LoopCount = 0;
    var SecondLoopCount = 0;
    var AriDay = 0;
    var DipDay = 0;
    DayDiffArray = [];
    DayDiifIsValid = true;
    $('[id^=tblScheduleTrans_Row_]').each(function () {

        LoopCount = LoopCount + 1;

        Row_ID = this.id.split('_')[2].toString();

        DipDay = 0;

        DipDay = parseInt($(DipDiffrence_ID + Row_ID).val()) >= AriDay + DipDay ? parseInt($(DipDiffrence_ID + Row_ID).val()) : AriDay + DipDay;

        AriDay = parseInt($(ArriDiffrence_ID + Row_ID).val()) >= DipDay ? parseInt($(ArriDiffrence_ID + Row_ID).val()) : (AriDay > DipDay ? AriDay : DipDay);

        if ($(ETA_ID + Row_ID).val() <= $(ETD_ID + Row_ID).val() && DipDay >= AriDay)  //&& $(ArriDiffrence_ID + Row_ID).val() <= 0 && $(ArriDiffrence_ID + Row_ID).val() < AriDay) 
        {

            AriDay = AriDay + 1;
        }

        if ($(ArriDiffrence_ID + Row_ID).val() < AriDay) {
            DayDiifIsValid = false;
        }

        SecondLoopCount = 0
        $('[id^=tblScheduleTrans_Row_]').each(function () {

            SecondLoopCount = SecondLoopCount + 1;
            Row_IDnext = this.id.split('_')[2].toString();

            if (Row_IDnext != Row_ID && SecondLoopCount < LoopCount) { //Must check 

                if ($(Ori_ID + Row_ID).val() == $(Dest_ID + Row_IDnext).val() && $(ETD_ID + Row_ID).val() <= $(ETA_ID + Row_IDnext).val()) {

                    DipDay = parseInt($(DipDiffrence_ID + Row_ID).val()) > parseInt($(ArriDiffrence_ID + Row_IDnext).val()) ?

                        parseInt($(DipDiffrence_ID + Row_ID).val()) : DipDay + 1;

                    AriDay = parseInt($(ArriDiffrence_ID + Row_ID).val()) < DipDay ?

                        DipDay : parseInt($(ArriDiffrence_ID + Row_ID).val());
                }

                else {

                    DipDay = parseInt($(DipDiffrence_ID + Row_ID).val()) > parseInt($(ArriDiffrence_ID + Row_IDnext).val()) ?

                        parseInt($(DipDiffrence_ID + Row_ID).val()) : DipDay;

                    AriDay = parseInt($(ArriDiffrence_ID + Row_ID).val()) < DipDay ?

                        DipDay : parseInt($(ArriDiffrence_ID + Row_ID).val());
                }

                if (parseInt($(DipDiffrence_ID + Row_ID).val()) < DipDay) {
                    DayDiifIsValid = false;
                }
                else if (parseInt($(ArriDiffrence_ID + Row_ID).val()) < AriDay) {
                    DayDiifIsValid = false;
                }
            }

            if (DayDiifIsValid == false) {
                return false;
            }
        });

        DayDiffArray.push({
            Key: LoopCount,
            RowID: Row_ID,
            Ori: $(Origin + Row_ID).val(),
            Dest: $(Deststination + Row_ID).val(),
            DipDayDiff: DipDay,
            ArrDayDiff: AriDay
        });

        if (DayDiifIsValid == false) {

            ShowMessage('warning', 'Information', DayDiffArray[LoopCount - 1].Ori + '-' + DayDiffArray[LoopCount - 1].Dest + ' should have Departure Day Diff. = ' + DayDiffArray[LoopCount - 1].DipDayDiff + ' and Arrival Day Diff. = ' + DayDiffArray[LoopCount - 1].ArrDayDiff);
            return false;
        }
    });
}
/*
function FnAircarftValidate()
{
    var rowID = 0;
    var ID = 0;
    GridData = {};
    
    var Val = ValidateOnSubmit();

    if (Val) {
    $('[id^=tblScheduleTrans_Row_]').each(function () {
        rowID = this.id.split('_')[2];
        if ($('#tblScheduleTrans_HdnAddLeg_' + rowID.toString()).val() == "0") {
            ID = ID + 1;
            var ConnectedLegs=  $('#tblScheduleTrans_HdnLegId_' + rowID.toString()).val();
            ConnectedLegs = ConnectedLegs.length>1? ConnectedLegs.substr(0,1)+","+ConnectedLegs.substr(1,2): ConnectedLegs;

            GridData[parseInt(ID)] =
                               {
                                   IsLeg: $('#tblScheduleTrans_HdnIsLeg_' + rowID.toString()).val(),
                                   Ori: $('#tblScheduleTrans_Origin_' + rowID.toString()).val(),
                                   Dest: $('#tblScheduleTrans_Destination_' + rowID.toString()).val(),
                                   ConnectedLeg: ConnectedLegs,
                                   Start:parseInt(ConnectedLegs.split(',')[0]),
                                   End: parseInt(ConnectedLegs.split(',')[1]||ConnectedLegs.split(',')[0]),
                                   IsAddLeg: $('#tblScheduleTrans_HdnAddLeg_' + rowID.toString()).val(),
                                   AircraftSNo: $('#tblScheduleTrans_HdnAirCraft_' + rowID.toString()).val(),
                                   AircraftType: $('#tblScheduleTrans_AirCraft_' + rowID.toString()).val(),
                                   ActGrossWT: parseFloat($('#tblScheduleTrans_AllocatedGrossWeight_' + rowID.toString()).val()) + parseFloat($('#tblScheduleTrans_OverBookingCapacity_' + rowID.toString()).val()),
                                   ActVolumeWT: parseFloat($('#tblScheduleTrans_AllocatedVolumeWeight_' + rowID.toString()).val()) + parseFloat($('#tblScheduleTrans_OverBookingCapacityVol_' + rowID.toString()).val()),
                                   FSGPer: parseFloat($('#tblScheduleTrans_FSCapPr_' + rowID.toString()).text().split(' ')[0] || 0),  
                                   FSVPer: parseFloat($('#tblScheduleTrans_FSVolPr_' + rowID.toString()).text().split(' ')[0] || 0),
                                   RGPer: parseFloat($('#tblScheduleTrans_RSCapPr_' + rowID.toString()).text().split(' ')[0] || 0),
                                   RVPer: parseFloat($('#tblScheduleTrans_RSVolPr_' + rowID.toString()).text().split(' ')[0] || 0),
                                   OGPer: parseFloat($('#tblScheduleTrans_OBCapPr_' + rowID.toString()).text().split(' ')[0] || 0),
                                   OVPer: parseFloat($('#tblScheduleTrans_OBVolPr_' + rowID.toString()).text().split(' ')[0] || 0),
                                   GWTPerPCS: parseFloat($('#tblScheduleTrans_MaxGrossPerPcs_' + rowID.toString()).val() || 0),
                                   VWTPerPCS: parseFloat($('#tblScheduleTrans_MaxVolumePerPcs_' + rowID.toString()).val() || 0),
                                   FCGW: 0,
                                   FCVW: 0,
                                   RSGW: 0,
                                   RSVW: 0,
                                   OBGW: 0,
                                   OBVW: 0,
                                   UMG: $('#tblScheduleTrans_UMG_' + rowID.toString()).val(),
                                   UMV: $('#tblScheduleTrans_UMV_' + rowID.toString()).val(),
                                   IsCAO: $('[id^=tblScheduleTrans_RbtnIsCAO_'+ rowID.toString()+'_]:checked').val(),
                                   GridRowID: rowID
                               }
        }
    });

    $.each(GridData, function (id, item) {
        
        if(GridData[id].IsLeg==0)
        {
            var minGWT=0.000;
            var minVWT = 0.000;
            var RowNo = GridData[id].GridRowID;

            for (var i = GridData[id].Start; i <= GridData[id].End; i++) {
                if (GridData[id].Ori == GridData[i].Ori) {
                    minGWT = GridData[i].ActGrossWT;
                    minVWT = GridData[i].ActVolumeWT;
                    GridData[id].AircraftSNo = GridData[i].AircraftSNo;
                    GridData[id].AircraftType = GridData[i].AircraftType;
                    GridData[id].GWTPerPCS = GridData[i].GWTPerPCS;
                    GridData[id].VWTPerPCS = GridData[i].VWTPerPCS;
                    GridData[id].FSGPer = GridData[i].FSGPer;
                    GridData[id].FSVPer = GridData[i].FSVPer;
                    GridData[id].RGPer = GridData[i].RGPer;
                    GridData[id].RVPer = GridData[i].RVPer;
                    GridData[id].OGPer = GridData[i].OGPer;
                    GridData[id].OVPer = GridData[i].OVPer;
                    GridData[id].IsCAO = GridData[i].IsCAO;

                }
                else {
                    if (GridData[i].ActGrossWT <= minGWT) {
                        minGWT = GridData[i].ActGrossWT;
                    }
                    if (GridData[i].ActVolumeWT <= minVWT) {
                        minVWT = GridData[i].ActVolumeWT;
                    }
                }
            }
            GridData[id].ActGrossWT = (minGWT).toFixed(2);
            GridData[id].ActVolumeWT = (minVWT).toFixed(3);
            GridData[id].FCGW = (parseFloat(GridData[id].ActGrossWT) * parseFloat(GridData[id].FSGPer)/100).toFixed(2);
            GridData[id].FCVW = (parseFloat(GridData[id].ActVolumeWT) * parseFloat(GridData[id].FSVPer) / 100).toFixed(3);
            GridData[id].RSGW = (parseFloat(GridData[id].ActGrossWT) * parseFloat(GridData[id].RGPer) / 100).toFixed(2);
            GridData[id].RSVW = (parseFloat(GridData[id].ActVolumeWT) * parseFloat(GridData[id].RVPer) / 100).toFixed(3);
            GridData[id].OBGW = (parseFloat(GridData[id].ActGrossWT) * parseFloat(GridData[id].OGPer) / 100).toFixed(2);
            GridData[id].OBVW = (parseFloat(GridData[id].ActVolumeWT) * parseFloat(GridData[id].OVPer) / 100).toFixed(3);

            $('#tblScheduleTrans_AllocatedGrossWeight_' + RowNo + ',#_temptblScheduleTrans_AllocatedGrossWeight_' + RowNo + '').val(GridData[id].ActGrossWT);
            $('#tblScheduleTrans_AllocatedVolumeWeight_' + RowNo + ',#_temptblScheduleTrans_AllocatedVolumeWeight_' + RowNo + '').val(GridData[id].ActVolumeWT);
            $('#tblScheduleTrans_OverBookingCapacity_' + RowNo + ',#_temptblScheduleTrans_OverBookingCapacity_' + RowNo + '').val(GridData[id].OBGW);
            $('#tblScheduleTrans_OverBookingCapacityVol_' + RowNo + ',#_temptblScheduleTrans_OverBookingCapacityVol_' + RowNo + '').val(GridData[id].OBVW);
            $('#tblScheduleTrans_FreeSaleCapacity_' + RowNo + ',#_temptblScheduleTrans_FreeSaleCapacity_' + RowNo + '').val(GridData[id].FCGW);
            $('#tblScheduleTrans_FreeSaleCapacityVol_' + RowNo + ',#_temptblScheduleTrans_FreeSaleCapacityVol_' + RowNo + '').val(GridData[id].FCVW);
            $('#tblScheduleTrans_ReservedCapacity_' + RowNo + ',#_temptblScheduleTrans_ReservedCapacity_' + RowNo + '').val(GridData[id].RSGW);
            $('#tblScheduleTrans_ReservedCapacityVol_' + RowNo + ',#_temptblScheduleTrans_ReservedCapacityVol_' + RowNo + '').val(GridData[id].RSVW);
            $('#tblScheduleTrans_MaxGrossPerPcs_' + RowNo + ',#_temptblScheduleTrans_MaxGrossPerPcs_' + RowNo + '').val(GridData[id].GWTPerPCS);
            $('#tblScheduleTrans_MaxVolumePerPcs_' + RowNo + ',#_temptblScheduleTrans_MaxVolumePerPcs_' + RowNo + '').val(GridData[id].VWTPerPCS);
            $('#tblScheduleTrans_OBCapPr_' + RowNo + '').text(GridData[id].OGPer.toFixed(2)+' %');
            $('#tblScheduleTrans_OBVolPr_' + RowNo + '').text(GridData[id].OVPer.toFixed(2) + ' %');
            $('#tblScheduleTrans_FSCapPr_' + RowNo + '').text(GridData[id].FSGPer.toFixed(2) + ' %');
            $('#tblScheduleTrans_FSVolPr_' + RowNo + '').text(GridData[id].FSVPer.toFixed(2) + ' %');
            $('#tblScheduleTrans_RSCapPr_' + RowNo + '').text(GridData[id].RGPer.toFixed(2) + ' %');
            $('#tblScheduleTrans_RSVolPr_' + RowNo + '').text(GridData[id].RVPer.toFixed(2) + ' %');
            $('#tblScheduleTrans_UMG_' + RowNo + '').val(GridData[id].UMG);
            $('#tblScheduleTrans_UMV_' + RowNo + '').val(GridData[id].UMV);
            $('[id^=tblScheduleTrans_RbtnIsCAO_' + RowNo + '_]').removeAttr('checked');
            $('#tblScheduleTrans_RbtnIsCAO_' + RowNo + '_' + GridData[id].IsCAO + '').attr('checked', 'checked');
        }

    });

   
        $('input[name=operation]').show();
        $('#ValidateBtn').hide();
    }

}
*/
var IsAutoDateSet = false, CheckIsAutoDateSet = 0;
function ValidateOnSubmit() {

    // IsAutoDateSet = false;
    var IsPageVaild = true;

    if (cfi.IsValidSubmitSection()) {

        if ($("#PreAlertTime").val() != '' && $("#PreAlertDate").val() == '') {
            ShowMessage('warning', 'Warning', 'Pre-Alert Date can not be blank.');
            IsValidSchedule = false;
            IsPageVaild = false;
            CheckIsAutoDateSet = 1;
        }
        else if ($("#PreAlertDate").val() != '' && $("#PreAlertTime").val() == '') {
            ShowMessage('warning', 'Warning', 'Pre-Alert Time can not be blank.');
            IsValidSchedule = false;
            IsPageVaild = false;
            CheckIsAutoDateSet = 1;
        }
        else if ($('#tblScheduleTrans').appendGrid('getRowCount') <= 0) {
            ShowMessage('warning', 'Warning', 'Please click on generate schedule.');
            IsValidSchedule = false;
            IsPageVaild = false;
            CheckIsAutoDateSet = 1;
        }
        else if ($('#tblScheduleTrans').appendGrid('getRowCount') > 0) {
            /*Added By Brajendra*/
            var flag = true;
            $("#tblScheduleTrans tbody tr").each(function (i, val) {
                $("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + parseInt(i + 1).toString() + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + parseInt(i + 1).toString() + "']").val());

                if ($("#Text_Origin").val().toUpperCase() != $('#tblScheduleTrans_Origin_' + parseInt(i + 1)).val())
                    if ($("#tblScheduleTrans_FlightNumber_" + parseInt(i + 1)).val() + '-' + $("#tblScheduleTrans_null_" + parseInt(i + 1)).val() == $("#Text_CarrierCode").val() + '-' + $("#FlightNumber").val()) {
                        flag = false;
                        IsValidSchedule = false;
                        IsPageVaild = false;
                        $('input[name=operation]').hide();
                        $('#ValidateBtn').show();
                        return false;
                    }

            });

            if (flag == false)
                return false;
            /*Ended By Brajendra*/

            var rows = $("tr[id^='tblScheduleTrans']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
            getUpdatedRowIndex(rows.join(","), 'tblScheduleTrans');
            var TransData = [];

            TransData = JSON.parse(replaceAll(replaceAll($('#tblScheduleTrans').appendGrid('getStringJson'), ',,', ','), ',}', '}'));

            var DTScheduleData = [];

            $.each(TransData, function (i, item) {

                if (item.Day1 == "0" && item.Day2 == "0" && item.Day2 == "0" && item.Day3 == "0" && item.Day4 == "0" && item.Day5 == "0" && item.Day6 == "0" && item.Day7 == "0") {
                    ShowMessage('warning', 'Information', "Select Frequency for " + item.Origin + " - " + item.Destination + " leg.");
                    IsValidSchedule = false;
                    IsPageVaild = false;
                    CheckIsAutoDateSet = 1;
                    $('input[name=operation]').hide();
                    $('#ValidateBtn').show();
                    return false;
                }

                DTScheduleData.push(
                    {
                        SNo: parseInt(item.SNo) || 0,
                        ScheduleSNo: parseInt(item.ScheduleSNo) || 0,
                        RowID: parseInt(item.RowID) || 0,
                        ScheduleType: parseInt(item.ScheduleType) || 0,
                        OriginSNo: parseInt(item.HdnOrigin) || 0,
                        DestinationSNo: parseInt(item.HdnDestination) || 0,
                        Origin: item.Origin || '',
                        Destination: item.Destination || '',
                        StartDate: item.StartDate || '',
                        EndDate: item.EndDate || '',
                        ETA: item.ETA || '',
                        ETD: item.ETD || '',
                        Day1: item.Day1 == '1',
                        Day2: item.Day2 == '1',
                        Day3: item.Day3 == '1',
                        Day4: item.Day4 == '1',
                        Day5: item.Day5 == '1',
                        Day6: item.Day6 == '1',
                        Day7: item.Day7 == '1',
                        DayDifference: parseInt((item.HdnDayDifference == "" ? null : item.HdnDayDifference)),
                        SDDifference: parseInt((item.HdnSDDifference == "" ? null : item.HdnSDDifference)),
                        DepartureSequence: parseInt(item.HdnDepartureSequence) || 0,
                        AddLegNo: parseInt(item.AddLegNo) || 0,
                        IsLeg: item.HdnIsLeg == '1',
                        LegId: parseInt(item.HdnLegId) || 0,
                        AirCraftSNo: parseInt(item.HdnAirCraft) || 0,
                        GrossWeight: parseFloat(item.AllocatedGrossWeight) || 0,
                        VolumeWeight: parseFloat(item.AllocatedVolumeWeight) || 0,
                        FreeSaleCapacity: parseFloat(item.FreeSaleCapacity) || 0,
                        FreeSaleCapacityVol: parseFloat(item.FreeSaleCapacityVol) || 0,
                        ReservedCapacity: parseFloat(item.ReservedCapacity) || 0,
                        ReservedCapacityVol: parseFloat(item.ReservedCapacityVol) || 0,
                        OverBookingCapacity: parseFloat(item.OverBookingCapacity) || 0,
                        OverBookingCapacityVol: parseFloat(item.OverBookingCapacityVol) || 0,
                        MaxGrossPerPcs: parseFloat(item.MaxGrossPerPcs) || 0,
                        MaxVolumePerPcs: parseFloat(item.MaxVolumePerPcs) || 0,
                        UMG: item.UMG || '',
                        UMV: item.UMV || '',
                        IsCAO: item.IsCAO == '1',
                        AirCraftName: item.AirCraft || '',
                        IsCharter: item.IsCharter == '1',
                        IsDayLightSaving: item.IsDayLightSaving == '1',
                        IsCodeShare: item.IsCodeShare == '1',
                        ALTCarrierCode: item.ALTCarrierCode || '',
                        ALTFlightNumber: item.ALTFlightNumber || '',
                        CodeShareCarrierCode: item.CodeShareCarrierCode || '',
                        CodeShareFlightNo: item.CodeShareFlightNumber || '',
                        FlightTypeSNo: parseInt(item.HdnFlightType) || 0,
                        FlightType: item.FlightType || '',
                    });
            });

            var DTSchdeule = {
                SNo: parseInt($('#htmlkeysno').val()) || 0,
                ScheduleType: parseInt($('#ScheduleType:checked').val()) || 0,
                AirlineSNo: parseInt($('#CarrierCode').val().split('-')[0]) || 0,
                FlightNo: $('#CarrierCode').val().split('-')[2].trim() + '-' + $('#FlightNumber').val() + $("#SingleAlpha").val().toUpperCase(),
                FromDate: $('#FStartDate').val(),
                ToDate: $('#FEndDate').val(),
                TextRouting: $('span#Routing').text() || '',
                OperatedasTruck: $('#OperatedasTruck').is('checked'),
                ValidateScheduleTrans: DTScheduleData,
                IsActive: $('#IsActive:checked').val() == '0'
            }

            //if (userContext.SysSetting.Schedule_RemoveETAETDCheck.toUpperCase() != 'TRUE') {
            //    DayDiffCalculation();
            //    if (DayDiifIsValid == false)
            //        IsPageVaild = false;
            //}

            if (JSON.stringify(OldTransData) !== JSON.stringify(TransData) && IsValidSchedule == true && IsPageVaild == true && IsAutoDateSet == false) {
                IsValidSchedule = false;
                $('input[name=operation]').hide();
                $('#ValidateBtn').show();
                ShowMessage('warning', 'Warning', "Found Updatation in your schedule please validate first.");
                return false;
            }
            else if (IsValidSchedule == false && IsPageVaild == true && IsAutoDateSet == false) {
                $.ajax({
                    url: "./Services/Schedule/ScheduleService.svc/ValidateSchedule", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ ScheduleDetail: DTSchdeule, IsValidSchedule: IsValidScheduleDone == true ? 1 : 0 }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var DataSet = JSON.parse(result);
                        var MsgNo = DataSet.Table0[0].MsgNo;
                        var Message = DataSet.Table0[0].Message;

                        if (MsgNo == '0') {
                            ValidatedDataSet(DataSet.Table1);
                            OldTransData = JSON.parse(replaceAll(replaceAll($('#tblScheduleTrans').appendGrid('getStringJson'), ',,', ','), ',}', '}'));

                            IsValidSchedule = true; IsValidScheduleDone = true; CheckIsAutoDateSet = 0;
                            $('input[name=operation]').show();
                            $('#ValidateBtn').hide();
                            ShowMessage('success', 'Validation!', Message);

                        }
                        else {
                            IsValidSchedule = false;
                            $('input[name=operation]').hide();
                            $('#ValidateBtn').show();

                            if (MsgNo == '2') {
                                if (Message.indexOf('?') > 0) {
                                    var Arr = Message.split('?');
                                    var ActualRowNo = $("#tblScheduleTrans_Row_" + Arr[0] + " td:first").text(); //$('#tblScheduleTrans').appendGrid('getRowIndex', Arr[0]);
                                    Message = Arr[1].replace('~', ActualRowNo);
                                }
                            }
                            else if (MsgNo == '8' || MsgNo == '9') {
                                PupUpUsedFlights(DataSet.Table1);
                            }
                            CheckIsAutoDateSet = 0;
                            ShowMessage('warning', 'Warning', Message);
                        }

                    }
                });
            }

            $(TransData).each(function (index, item) {
                var CurrentRowID = (index + 1);
                if ($("#tblScheduleTrans_HdnDayDifference_" + CurrentRowID).val() > 0) {
                    //$('[id^=tblScheduleTrans_AllDays_' + CurrentRowID + ']').attr('checked', false);
                    $('[id^=tblScheduleTrans_Day1_' + CurrentRowID + ']').attr('checked', true);
                    $('[id^=tblScheduleTrans_Day2_' + CurrentRowID + ']').attr('checked', true);
                    $('[id^=tblScheduleTrans_Day3_' + CurrentRowID + ']').attr('checked', true);
                    $('[id^=tblScheduleTrans_Day4_' + CurrentRowID + ']').attr('checked', true);
                    $('[id^=tblScheduleTrans_Day5_' + CurrentRowID + ']').attr('checked', true);
                    $('[id^=tblScheduleTrans_Day6_' + CurrentRowID + ']').attr('checked', true);
                    $('[id^=tblScheduleTrans_Day7_' + CurrentRowID + ']').attr('checked', true);
                    $('[id^=tblScheduleTrans_AllDays_' + CurrentRowID + ']').trigger('click');
                    $('[id^=tblScheduleTrans_AllDays_' + CurrentRowID + ']').attr('checked', true);
                    if (CheckIsAutoDateSet == 0) {
                        IsAutoDateSet = true;
                    } else {
                        IsAutoDateSet = false;
                    }

                }
            }
            )


        }
    }
    else {
        IsPageVaild == false;
    }

    if (IsValidSchedule == false || IsPageVaild == false || DayDiifIsValid == false) {
        IsValidSchedule == false;
        $('input[name=operation]').hide();
        $('#ValidateBtn').show();
        return false
    }
}

/* Define function for escaping user input to be treated as 
   a literal string within a regular expression */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* Define functin to find and replace specified term with replacement string */
function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}

function ValidatedDataSet(item) {
    $.each(item, function (I, Data) {

        var RowID = Data.RowID;

        $('#tblScheduleTrans_SNo_' + RowID).val(Data.SNo);
        $('#tblScheduleTrans_ScheduleSNo_' + RowID).val(Data.ScheduleSNo);
        $('#tblScheduleTrans_HdnOrigin_' + RowID).val(Data.OriginSNo);
        $('#tblScheduleTrans_HdnDestination_' + RowID).val(Data.DestinationSNo);
        $('#tblScheduleTrans_Origin_' + RowID).val(Data.Origin);
        $('#tblScheduleTrans_Destination_' + RowID).val(Data.Destination);
        $('#tblScheduleTrans_ScheduleType_' + RowID).val(Data.ScheduleType);
        //$('#tblScheduleTrans_DayDifference_' + RowID).prop('selectedIndex', (parseInt(Data.DayDifference)).toString());
        //$('#tblScheduleTrans_SDDifference_' + RowID).prop('selectedIndex', (parseInt(Data.SDDifference)+1).toString());
        $("#tblScheduleTrans_HdnDayDifference_" + RowID).val((parseInt(Data.DayDifference)).toString());
        $("#tblScheduleTrans_DayDifference_" + RowID).val((parseInt(Data.DayDifference)).toString());
        $("#tblScheduleTrans_HdnSDDifference_" + RowID).val((parseInt(Data.SDDifference)).toString());
        $("#tblScheduleTrans_SDDifference_" + RowID).val((parseInt(Data.SDDifference)).toString());
        $('#tblScheduleTrans_StartDate_' + RowID).val(Data.StartDate);
        $('#tblScheduleTrans_EndDate_' + RowID).val(Data.EndDate);
        $("[id$='tblScheduleTrans_ALTCarrierCode_" + RowID + "']").val(Data.ALTCarrierCode);
        $("[id$='tblScheduleTrans_ALTFlightNumber_" + RowID + "']").val(Data.ALTFlightNumber);
        $("input[name=tblScheduleTrans_RbtnIsCAO_" + RowID + "][value=" + (Data.IsCAO == 'True' ? '1' : '0') + "]").attr("checked", 'checked');

        if (Data.IsCodeShare == 'True')
            $("input[name=tblScheduleTrans_IsCodeShare_" + RowID + "]").attr("checked", 'checked');
        else
            $("input[name=tblScheduleTrans_IsCodeShare_" + RowID + "]").removeAttr("checked");

        $("#tblScheduleTrans_HdnCodeShareCarrierCode_" + RowID).val(Data.CodeShareCarrierCode)
        $("#tblScheduleTrans_CodeShareCarrierCode_" + RowID).val(Data.CodeShareCarrierCode);
        $("#tblScheduleTrans_CodeShareFlightNumber_" + RowID).val(Data.CodeShareFlightNo);
        $('#tblScheduleTrans_FlightType_' + RowID).val(Data.FlightType);
        $('#tblScheduleTrans_HdnFlightType_' + RowID).val(Data.FlightTypeSNo);
        $('#tblScheduleTrans_AirCraft_' + RowID).val(Data.AirCraftName);
        $('#tblScheduleTrans_HdnAirCraft_' + RowID).val(Data.AirCraftSNo);
        $('#tblScheduleTrans_UMG_' + RowID).val(Data.UMG).attr('disabled', 'disabled');
        $('#tblScheduleTrans_UMV_' + RowID).val(Data.UMV).attr('disabled', 'disabled');
        $('#tblScheduleTrans_HdnUMG_' + RowID).val(Data.UMG);
        $('#tblScheduleTrans_HdnUMV_' + RowID).val(Data.UMV);
        $('#_temptblScheduleTrans_AllocatedGrossWeight_' + RowID + ', #tblScheduleTrans_AllocatedGrossWeight_' + RowID).val(parseFloat(Data.GrossWeight).toFixed(2));
        $('#_temptblScheduleTrans_AllocatedVolumeWeight_' + RowID + ', #tblScheduleTrans_AllocatedVolumeWeight_' + RowID).val(parseFloat(Data.VolumeWeight).toFixed(3));
        $('#_temptblScheduleTrans_FreeSaleCapacity_' + RowID + ', #tblScheduleTrans_FreeSaleCapacity_' + RowID).val(parseFloat(Data.FreeSaleCapacity).toFixed(2));
        $('#_temptblScheduleTrans_FreeSaleCapacityVol_' + RowID + ', #tblScheduleTrans_FreeSaleCapacityVol_' + RowID).val(parseFloat(Data.FreeSaleCapacityVol).toFixed(3));
        $('#_temptblScheduleTrans_ReservedCapacity_' + RowID + ', #tblScheduleTrans_ReservedCapacity_' + RowID).val(parseFloat(Data.ReservedCapacity).toFixed(2));
        $('#_temptblScheduleTrans_ReservedCapacityVol_' + RowID + ', #tblScheduleTrans_ReservedCapacityVol_' + RowID).val(parseFloat(Data.ReservedCapacityVol).toFixed(3));
        $('#_temptblScheduleTrans_OverBookingCapacity_' + RowID + ', #tblScheduleTrans_OverBookingCapacity_' + RowID).val(parseFloat(Data.OverBookingCapacity).toFixed(2));
        $('#_temptblScheduleTrans_OverBookingCapacityVol_' + RowID + ', #tblScheduleTrans_OverBookingCapacityVol_' + RowID).val(parseFloat(Data.OverBookingCapacityVol).toFixed(3));
        $('#_temptblScheduleTrans_MaxGrossPerPcs_' + RowID + ', #tblScheduleTrans_MaxGrossPerPcs_' + RowID).val(parseInt(Data.MaxGrossPerPcs));
        $('#_temptblScheduleTrans_MaxVolumePerPcs_' + RowID + ', #tblScheduleTrans_MaxVolumePerPcs_' + RowID).val(parseFloat(Data.MaxVolumePerPcs).toFixed(3));
        $('#tblScheduleTrans_FSCapPr_' + RowID).text(parseFloat(Data.FreeSaleGWPer).toFixed(2) + ' %');
        $('#tblScheduleTrans_FSVolPr_' + RowID).text(parseFloat(Data.FreeSaleVWPer).toFixed(2) + ' %');
        $('#tblScheduleTrans_RSCapPr_' + RowID).text(parseFloat(Data.ReserveGWPer).toFixed(2) + ' %');
        $('#tblScheduleTrans_RSVolPr_' + RowID).text(parseFloat(Data.ReserveVWPer).toFixed(2) + ' %');
        $('#tblScheduleTrans_OBCapPr_' + RowID).text(parseFloat(Data.OverbookGWPer).toFixed(2) + ' %');
        $('#tblScheduleTrans_OBVolPr_' + RowID).text(parseFloat(Data.OverbookVWPer).toFixed(2) + ' %');
        $('#tblScheduleTrans_HdnLegId_' + RowID).val(Data.LegId);
        $('#tblScheduleTrans_HdnIsLeg_' + RowID).val(Data.IsLeg == 'True' ? 1 : 0);
        $('#tblScheduleTrans_HdnDepartureSequence_' + RowID).val(Data.DepartureSequence);
    });
}

function PupUpUsedFlights(item) {
    $('#DivUsedFlights').hide();
    $('#DivUsedFlights').html('');
    var PopTable = '<table style="width:100%; margin: 0px auto; border: 1px solid black; border-collapse: collapse;"><thead><tr><th class="ui-widget-header" style="width:10%; border: 1px solid black; text-align:center; ">S.No.</th><th class="ui-widget-header" style="width:25%; border: 1px solid black; text-align:center;">Flight No</th><th class="ui-widget-header" style="width:35%; border: 1px solid black; text-align:center;">Flight Date</th><th class="ui-widget-header" style="width:15%; border: 1px solid black; text-align:center;">Ori.</th><th class="ui-widget-header" style="width:15%; border: 1px solid black; text-align:center;">Dest.</th></tr></thead><tbody>'
    var tr = '';
    if (item.length > 0) {
        $.each(item, function (I, Data) {
            tr += '<tr><td style="width:10%; border: 1px solid black;text-align:center; ">' + (I + 1) + '</td><td style="width:25%; border: 1px solid black;text-align:center; ">' + Data.FlightNo + '</td><td style="width:35%; border: 1px solid black;text-align:center; ">' + Data.FlightDate + '</td><td style="width:15%; border: 1px solid black;text-align:center; ">' + Data.OriginAirportCode + '</td><td style="width:15%; border: 1px solid black;text-align:center; ">' + Data.DestinationAirportCode + '</td></tr>'
        });
    }
    else {
        tr += '<tr><td colspan="5" style="width:100%; color:red ; border: 1px solid black;text-align:center; ">No Record Found.</td></tr>'
    }
    PopTable += tr + '</tbody></table>';
    $('#DivUsedFlights').append(PopTable);
    $('#DivUsedFlights').show();
    cfi.PopUp("DivUsedFlights", "Utilized Flights Details", 500, null, null, null);
}

function onDayDiffChange() {
    //alert('HI');
}