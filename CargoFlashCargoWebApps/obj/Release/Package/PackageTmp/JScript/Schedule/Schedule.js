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


$(document).ready(function () {
    // SetDateRangeValue(undefined);
    // added by arman ali
   // $('#BindFlightSch').addClass('btn btn-inverse');
   // $('#Show').addClass('btn btn-inverse');
    // end
    $("#PreAlertTime").on('drop', function (event) {
        event.preventDefault();
    });
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $(":radio").attr("disabled", true);
        $(":checkbox").attr("disabled", true);
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
    });

    $('#BindFlightSch').click(function () {


        if (cfi.IsValidSubmitSection()) {

            if ($("#PreAlertTime").val() != '' && $("#PreAlertDate").val() == '') {
                alert("Pre-Alert Date can not be blank.");
            }
            else if ($("#PreAlertDate").val() != '' && $("#PreAlertTime").val() == '') {
                alert("Pre-Alert Time can not be blank.");
            }
            else {
                bindRouting();
                var legs = $('span#Routing').text().split('-');
                var generaterow = 0;
                for (i = 0; i < legs.length; i++) {
                    generaterow = generaterow + i;

                }


                IsGridRecordGet = false;
                GridGenerateRows = $("#Destination").val() == $("#Origin").val() ? generaterow - 1 : generaterow;
                createScheduleDetail();
                //onEtdBlur();
                //onEtaBlur();
                

                $("#tblScheduleTrans_ETD_1").on('blur', function () {
                    $("#tblScheduleTrans_ETD_2").val($(this).val());
                    //$("#tblScheduleTrans_ETD_2").attr("disabled", true);
                });
                $("#tblScheduleTrans_ETA_1").on('blur', function () {
                    $("#tblScheduleTrans_ETA_" + 3 + "").val($(this).val());
                    //$("#tblScheduleTrans_ETA_" + countLeg.length + "").attr("disabled", true);
                });



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
                for (i = 1; i <= (legs.length) - 1; i++) {
                    $("#tblScheduleTrans_CodeShareFlightNumber_" + i).prop("disabled", true);
                    $("#tblScheduleTrans_CodeShareCarrierCode_" + i).val('');
                    $("#tblScheduleTrans_CodeShareFlightNumber_" + i).val('');
                    $("#tblScheduleTrans_CodeShareCarrierCode_" + i).data("kendoAutoComplete").enable(false);
                    $('#tblScheduleTrans_OverBookingCapacity_' + i).attr("disabled", true);
                    $('#tblScheduleTrans_FreeSaleCapacity_' + i).attr("disabled", true);
                    //   $('#tblScheduleTrans_OverBookingCapacityVol_' + i).attr("disabled", true);
                    //  $('#tblScheduleTrans_FreeSaleCapacityVol_' + i).attr("disabled", true);
                    $('#tblScheduleTrans_UMV_' + i).attr("disabled", true);
                    $('#tblScheduleTrans_UMG_' + i).attr("disabled", true);
                    //  $("#tblScheduleTrans_CodeShareCarrierCode_" + i).kendoAutoComplete({enable: false});
                }
            }
        }
       // $("[id*='tabledivLegs'] [style*='none']").closest('tr').hide()
    });
    cfi.AutoComplete("CarrierCode", "CarrierCode", "viewAirline", "autocompleteValue", "CarrierCode", ["CarrierCode"], null);
    $('#_spanDASH_').html('-');
    $('#_spanLBLSHOWCASE_').html('Operated as RFS');
    cfi.AutoComplete("Origin", "AirportCode", "vAirport", "SNo", "AirportCode", ["AirportCode"], bindRouting, "contains");
    cfi.AutoComplete("Destination", "AirportCode", "vAirport", "SNo", "AirportCode", ["AirportCode"], bindRouting, "contains");
    cfi.AutoComplete("ViaRoute", "AirportCode", "vAirport", "SNo", "AirportCode", ["AirportCode"], bindRouting, "contains", ",", null, null, null, null, true, null);


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


        $("input[name='operation']").click(function () {


            /*Added By Brajendra*/
            var flag = true;
            $("#tblScheduleTrans tbody tr").each(function (i, val) {
                $("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + parseInt(i + 1).toString() + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + parseInt(i + 1).toString() + "']").val());

                if ($("#Text_Origin").val().toUpperCase() != $('#tblScheduleTrans_Origin_' + parseInt(i + 1)).val())
                    if ($("#tblScheduleTrans_FlightNumber_" + parseInt(i + 1)).val() + '-' + $("#tblScheduleTrans_null_" + parseInt(i + 1)).val() == $("#Text_CarrierCode").val() + '-' + $("#FlightNumber").val())
                    { flag = false; return false; }

                if (!$("#tblScheduleTrans_IsCodeShare_" + Number(i + 1) + "").is(":checked")) {
                    $("#tblScheduleTrans_CodeShareCarrierCode_" + Number(i + 1)).attr("required", false);
                    $("#tblScheduleTrans_CodeShareFlightNumber_" + Number(i + 1)).attr("required", false);
                }

            });

            if (flag == false) return false;
            /*Ended By Brajendra*/


            if ($("#PreAlertTime").val() != '' && $("#PreAlertDate").val() == '') {
                alert("Pre-Alert Date can not be blank.");
            }
            else if ($("#PreAlertDate").val() != '' && $("#PreAlertTime").val() == '') {
                alert("Pre-Alert Time can not be blank.");
            }
            else {
                if (cfi.IsValidSubmitSection()) {
                    if ($('#tblScheduleTrans').appendGrid('getRowCount') > 0) {
                        var RO = $('#tblScheduleTrans').appendGrid('getRowOrder');
                        for (var i = 0; i < $('#tblScheduleTrans').appendGrid('getRowCount') ; i++) {
                            if ($('#tblScheduleTrans_Day1_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day2_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day3_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day4_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day5_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day6_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day7_' + RO[i.toString()]).prop('checked') == false) {
                                alert("Select Days of Operation for " + $('#tblScheduleTrans_Origin_' + RO[i.toString()]).val() + " - " + $('#tblScheduleTrans_Destination_' + RO[i.toString()]).val() + " leg.");
                                return false;
                            }
                        }
                        return true;
                    }
                    else {
                        alert("Please click on generate schedule");
                        return false;
                    }
                }
                else {
                    return false
                }
            }


        });

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

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#CarrierCode").closest("td").html($("#CarrierCode").closest("td").html().replace(/&nbsp;/g, ''))
        $('input:submit[name=operation]').hide();

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
    $("input[id^=FEndDate]").blur(function (e) {
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


});


function onEtdBlur() {
    $("[id^='tblScheduleTrans_ETD']").blur(function (evt) {
        var rowIndex = $(this).attr("id").split('_')[2];
        var x = $("#" + 'tbl' + dbTableName + '_ETD_' + evt.currentTarget.id.replace("tblScheduleTrans_ETD_", '')).val();
        if (x.length == 0) {
            return false;
        }
        var value = 0;
        for (var i = 0; i < x.length ; i++) {
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
            alert('Please enter correct STD format');
            return false;
        }
        //else
        //    CheckDayDiff(evt, rowIndex);

        if (parseInt($("#tblScheduleTrans_ETD_" + rowIndex).val()) > parseInt($("#tblScheduleTrans_ETA_" + rowIndex).val())) {
            alert("STA should be greater than STD Other wise Automatically Set Arrival Day Diff to 1.");
            $("#tblScheduleTrans_SDDifference_" + rowIndex + " option[value=1]").prop('selected', true);
        }
        else
            CheckDayDiff(evt, rowIndex);
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
        for (var i = 0; i < x.length ; i++) {
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
            alert('Please enter correct STA format');
            return false;
        }
        else
            CheckDayDiff(evt, rowIndex);
        if (parseInt($("#tblScheduleTrans_ETD_" + rowIndex).val()) >= parseInt($("#tblScheduleTrans_ETA_" + rowIndex).val())) {
            alert("STA should be greater than STD Other wise Automatically Set Arrival Day Diff to 1.");
            $("#tblScheduleTrans_SDDifference_" + rowIndex + " option[value=1]").prop('selected', true);
        }
    });
}

function daysValidate() {
    if (cfi.IsValidSubmitSection()) {
        if ($('#tblScheduleTrans').appendGrid('getRowCount') > 0) {
            var RO = $('#tblScheduleTrans').appendGrid('getRowOrder');
            for (var i = 0; i < $('#tblScheduleTrans').appendGrid('getRowCount') ; i++) {
                if ($('#tblScheduleTrans_Day1_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day2_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day3_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day4_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day5_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day6_' + RO[i.toString()]).prop('checked') == false && $('#tblScheduleTrans_Day7_' + RO[i.toString()]).prop('checked') == false) {
                    alert("Select Days of Operation for " + $('#tblScheduleTrans_Origin_' + RO[i.toString()]).val() + " - " + $('#tblScheduleTrans_Destination_' + RO[i.toString()]).val() + " leg.");
                    return false;
                }
            }
            return true;
        }
        else {
            alert("Please click on generate schedule");
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
        for (i = 1; i < $('#divMultiViaRoute li').length; i++) {
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

        for (i = 1; i < $('#divMultiViaRoute li').length; i++) {
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

function BindScheduleRecords() {
    alert('done');
}

function checkValidationSubmit() {
    alert('hi');
    return false;
}

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
    if (textId.indexOf("CarrierCode") >= 0) {
        var typeval = $("input:radio[name='ScheduleType']:checked").val();
        cfi.setFilter(f, "Interline", "eq", typeval);

    }


    if (textId.indexOf("Origin") >= 0 || textId.indexOf("Destination") >= 0) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_Origin", "Destination").replace("Text_Destination", "Origin")).val());
    }

    if (textId.indexOf("ViaRoute") >= 0 && ($('#Origin').val() == 0 || $('#Destination').val() == 0)) {
        cfi.setFilter(f, "SNo", "eq", "0");
    }
    else if (textId.indexOf("ViaRoute") >= 0 && ($('#Origin').val() > 0 && $('#Destination').val() > 0)) {
        cfi.setFilter(f, "SNo", "neq", $('#Destination').val());
        cfi.setFilter(f, "SNo", "neq", $('#Origin').val());

    }
    if (textId.indexOf("AirCraft") >= 0) {// cfi.setFilter(f, "CarrierCode", "eq", $('#' + textId.replace("AirCraft", "ALTCarrierCode")).val()),

        cfi.setFilter(f, "CarrierCode", "eq", $('#CarrierCode').val().replace(/(^[\s]+|[\s]+$)/g, '').length > 3 ? $('#CarrierCode').val().replace(/(^[\s]+|[\s]+$)/g, '').split('-')[2] : $('#CarrierCode').val().replace(/(^[\s]+|[\s]+$)/g, '')), cfi.getFilter("AND"),
        cfi.setFilter(f, "CargoClassification", "in", ($("input:radio[name^='" + textId.replace("AirCraft", "RbtnIsCAO") + "']:checked").val() != "0") ? ("1,3,4") : ("2"));

    }
    return cfi.autoCompleteFilter([f]);
}
function createScheduleDetail() {
    if (cfi.IsValidSubmitSection()) {
        var days = new Array();
        days = ['-1', '0', '1', '2', '3', '4', '5', '6', '7'];
        //'SNo,ScheduleSNo,ScheduleType,CarrierCode,FlightNumber,FlightNo,OriginAirportSNo,OriginAirportCode,ETD,ETDGMT,DestinationSNo,DestinationAirportCode,ETA,ETAGMT,IsDayLightSaving,AirCraftSNo,AllocatedGrossWeight,AllocatedVolumeWeight,MaxGrossPerPcs,DayDifference,Day1,Day2,Day3,Day4,Day5,Day6,Day7,StartDate,EndDate,NoOfStop,IsFirstLeg,IsCAO,Routing,FlightTypeSNo,IsActive,CreatedOn,CreatedBy,UpdatedOn,UpdatedBy'

        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'READ',
            tableColumns: 'FlightNo,Origin,ETD,Destination,ETA,StartDate,EndDate,DayLightSaving,AirCraft,AllocatedGrossWeight,AllocatedVolumeWeight,MaxGrossPerPcs,MaxVolumePerPcs,DayDifference,Sun,Mon,Tue,Wed,Thu,Fri,Sat,NoOfStop,FirstLeg,CAO,Routing,Active,IsCodeShare,CodeShareCarrierCode,CodeShareFlightNumber,CodeShareFlightNo,OverBookingCapacity,FreeSaleCapacity,OverBookingCapacityVol,OverBookingCapacityVol,UMG,UMV',
            masterTableSNo: $('#hdnScheduleSno').val(),
            currentPage: 1, itemsPerPage: 100, whereCondition: null, sort: '',
            servicePath: './Services/Schedule/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
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
                       { name: 'HdnAddLeg', type: 'hidden' },
                       { name: 'HdnUMG', type: 'hidden' },
                        { name: 'HdnUMV', type: 'hidden' },
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
                                { divRowNo: 3, name: 'SDDifference', display: 'Arrival Day Diff.', type: 'select', onChange: function (evt, rowIndex) { }, ctrlCss: { height: '20px' }, ctrlOptions: ['-1', '0', '1', '2', '3', '4', '5', '6', '7'] },
                                { divRowNo: 4, name: 'DayDifference', display: 'Departure Day Diff.', type: 'select', onChange: function (evt, rowIndex) { CheckDayDiff(evt, rowIndex); }, ctrlCss: { height: '20px' }, ctrlOptions: ['0', '1', '2', '3', '4', '5', '6', '7'] },


                                { divRowNo: 5, name: 'ALTCarrierCode', display: 'Carrier Code', type: 'label', ctrlCss: { width: '40px', height: '20px' } },

                                { divRowNo: 5, name: 'ALTFlightNumber', display: 'Flight Number', type: 'text', ctrlAttr: { maxlength: 6, controltype: "alphanumeric" }, ctrlCss: { width: '40px', height: '20px' } }



                          ]
                      },
                      {
                          name: 'divLegValidity', display: 'Leg Validity', type: 'div', isRequired: false,
                          divElements: [{
                              divRowNo: 1, name: 'StartDate', display: 'Start Date', isRequired: true, type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype' }, onChange: function (evt, rowIndex) {
                                  // if (pageType != 'EDIT') {
                               
                                  var ID = $(evt.currentTarget).attr('id').split('_')[2];
                                  if ($("#tblScheduleTrans_HdnAddLeg_" + ID).val() == "1") return false;
                                  var k = $('#FStartDate').val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                                  var startdto = new Date(Date.parse(k));
                                  var sdid = ("tblScheduleTrans_StartDate_" + evt.currentTarget.id.replace("tblScheduleTrans_StartDate_", ''));
                                  //$('#tblScheduleTrans_ETA_' + sdid.split('_')[2]).val('');
                                  k = $("#" + sdid).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                                  var sdfrom = new Date(Date.parse(k));
                                  k = $('#FEndDate').val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                                  var Enddto = new Date(Date.parse(k));
                                  if (sdfrom < startdto) {
                                      ShowMessage('warning', 'Information', 'You have crossed the validity.');
                                      $("#" + sdid).val("");
                                  }
                                  if (sdfrom > Enddto) {
                                      $("#" + sdid).val("");
                                      ShowMessage('warning', 'Information', 'You have crossed the validity.');
                                  }

                                  CheckBoxDuplicateCheck(evt, rowIndex);
                                  //   }
                              }
                          },
                            {
                                divRowNo: 1, name: 'EndDate', display: 'End Date', type: 'text', isRequired: true, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype' }, onChange: function (evt, rowIndex) {
                                    // if (pageType != 'EDIT') {
                                    var ID = $(evt.currentTarget).attr('id').split('_')[2];
                                    if ($("#tblScheduleTrans_HdnAddLeg_" + ID).val() == "1") return false;
                                    var k = $('#FEndDate').val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                                    var Enddto = new Date(Date.parse(k));
                                    var edid = ("tblScheduleTrans_EndDate_" + evt.currentTarget.id.replace("tblScheduleTrans_EndDate_", ''));
                                    //$('#tblScheduleTrans_ETA_' + edid.split('_')[2]).val('');
                                    k = $("#" + edid).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                                    var edfrom = new Date(Date.parse(k));
                                    k = $('#FStartDate').val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                                    var startdto = new Date(Date.parse(k));
                                    if (edfrom > Enddto) {
                                        ShowMessage('warning', 'Information', 'You have crossed the validity.');
                                        $("#" + edid).val("");
                                    }
                                    if (edfrom < startdto) {
                                        ShowMessage('warning', 'Information', 'You have crossed the validity.');
                                        $("#" + edid).val("");
                                    }

                                    CheckBoxDuplicateCheck(evt, rowIndex);
                                    // }
                                }
                            },
                            {
                                divRowNo: 2, name: 'AirCraft', display: 'Aircraft', type: 'text', isRequired: true, ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete' }, tableName: 'vwAirlinewiseAircraft', textColumn: 'AircraftType', keyColumn: 'SNo', addOnFunction: populateValueCell

                            },

                            {
                                divRowNo: 2, name: 'FlightType', display: 'Flight Type', type: 'text', value: '', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: false, tableName: 'FlightType', textColumn: 'FlightTypeName', keyColumn: 'SNo',
                            },

                               //{
                               //    divRowNo: 3, name: 'lblfresalecapcity', value:null, type: 'label', ctrlCss: { 'font-weight': 'bold' }
                               //},


                             {
                                 divRowNo: 3, name: pageType != 'READ' ? 'IsCodeShare' : 'CodeShare', nameFormatter: 'IsCodeShare',
                                 display: null, type: 'checkbox', formatter: myformatter, onClick: function (evt, rowIndex) {
                                     var ID = $(evt.currentTarget).attr('id').split('_')[2];
                                     CheckIsCodeShareCheck(evt, ID);
                                 }
                             },
                             {
                                 divRowNo: 3, name: 'lblCodeShare', value: 'Code Share', formatter: myformatter, type: 'label', ctrlCss: { 'font-weight': 'bold' }
                             },
                          //  {
                                 //name: 'Capacity', display: 'Capacity', type: 'div', isRequired: false,
                                //divElement:[
                                   {
                                       divRowNo: 3, name: 'CodeShareCarrierCode', display: 'Carrier Code', type: 'text', isRequired: true, ctrlAttr: { maxlength: 4, minlength: 4 }, ctrlCss: { width: '70px', height: '20px' }, ctrlAttr: { controltype: 'autocomplete',onSelect: "return checkMainCarrierCode(this.id)" }, tableName: 'viewAirline', textColumn: 'CarrierCode', keyColumn: 'SNo'

                                   },
                                  {
                                      divRowNo: 4, name: 'CodeShareFlightNumber', display: 'Flight No', type: 'text', isRequired: true, ctrlAttr: { maxlength: 4, minlength: 4, controltype: "alphanumeric", onblur: "return checkMainFlightNo(this.id)" }, ctrlCss: { width: '70px', height: '20px' }



                                  },
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
                          divElements: [{ divRowNo: 1, name: 'AllocatedGrossWeight', display: 'Gr. Wt.', type: 'text', value: 0, isRequired: false, ctrlAttr: { maxlength: 18, controltype: 'decimal3', readonly: true }, ctrlCss: { width: '70px' } },
                               {
                                   divRowNo: 1, name: 'UMG', display: null, type: 'text', value: '', ctrlAttr: { controltype: 'uppercase', maxlength: 1, minlength: 1, onmousedown: "return CheckUMenter(event,this.id);", onblur: "return CheckUMtype(this.id);" }, ctrlCss: { width: '15px', height: '20px' }
                               },
                              {
                                  divRowNo: 1, name: 'OverBookingCapacity', display: 'OB', type: 'text', value: '', ctrlAttr: { controltype: 'decimal3', maxlength: 8, minlength: 2, onblur: "return CheckRageOBCCapacity(this.id);", }, ctrlCss: { width: '50px', height: '20px' }
                              },
                               {
                                   divRowNo: 1, name: 'FreeSaleCapacity', display: 'FS', type: 'text', value: '', ctrlAttr: { controltype: 'decimal3', maxlength: 8, minlength: 2, onblur: "return CheckRageFSCCapacity(this.id);" }, ctrlCss: { width: '70px', height: '20px' }
                               },
                            { divRowNo: 2, name: 'AllocatedVolumeWeight', display: 'Volume (CBM)', type: 'text', value: 0, isRequired: false, ctrlAttr: { maxlength: 18, controltype: 'decimal3', readonly: true }, ctrlCss: { width: '70px' } },
                             {
                                 divRowNo: 2, name: 'UMV', display: null, type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 3 }, ctrlCss: { width: '25px', height: '20px' }
                             },
                              {
                                  divRowNo: 2, name: 'OverBookingCapacityVol', display: 'OB', type: 'text', value: '', ctrlAttr: { controltype: 'decimal3', maxlength: 8, minlength: 2, onblur: "return CheckRageOBCCapacityVol(this.id);" }, ctrlCss: { width: '50px', height: '20px' }
                              },
                               {
                                   divRowNo: 2, name: 'FreeSaleCapacityVol', display: 'FS', type: 'text', value: '', ctrlAttr: { controltype: 'decimal3', maxlength: 8, minlength: 2, onblur: "return CheckRageFSCCapacityVol(this.id);" }, ctrlCss: { width: '70px', height: '20px' }
                               },


                           { divRowNo: 3, name: 'MaxGrossPerPcs', display: 'Gr. / Piece', type: 'text', value: 0, isRequired: false, ctrlAttr: { maxlength: 4, controltype: 'number', readonly: true }, ctrlCss: { width: '70px' } },
                           { divRowNo: 3, name: 'MaxVolumePerPcs', display: 'Vol. / Piece', type: 'text', value: 0, isRequired: false, ctrlAttr: { maxlength: 4, controltype: 'decimal3', readonly: true }, ctrlCss: { width: '70px' } }
                          ]
                      },

                      {
                          name: 'divDays', display: 'Days of Operation in Week', type: 'div', isRequired: false,
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
                          , { divRowNo: 3, name: 'lblIsActive', cSpan: 2, value: 'Active', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                          { divRowNo: 3, name: pageType != 'READ' ? 'IsActive' : 'Active', display: null, cSpan: 3, type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1 },
                          { divRowNo: 3, name: 'lblIsFirstLeg', cSpan: 2, value: 'First Leg', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                          { divRowNo: 3, name: pageType != 'READ' ? 'IsFirstLeg' : 'FirstLeg', display: null, type: 'checkbox', onClick: function (evt, rowIndex) { CheckFirstLeg(evt, rowIndex); } }, { divRowNo: 4, name: 'lblIsCAO', cSpan: 2, value: 'CAO', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
              { divRowNo: 4, name: pageType != 'READ' ? 'IsCAO' : 'CAO', display: null, cSpan: 3, type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, onClick: function (evt, rowIndex) { CheckCAO(evt, rowIndex); }, selectedIndex: 0 },
                          { divRowNo: 4, name: 'lblNoOfStop', cSpan: 2, value: 'Stops', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                          { divRowNo: 4, name: 'NoOfStop', value: 0, display: null, type: 'text', ctrlAttr: { maxlength: 1, controltype: 'number' }, ctrlCss: { width: '25px' }, isRequired: false }]
                      },
                      {
                          name: 'divLegs', display: 'Add Legs', type: 'div', isRequired: false,
                          divElements: [
                              { divRowNo: 1, name: 'Routing', type: 'hidden', value: $('#hdnRouting').val() },
                              {
                                  divRowNo: 2, name: pageType != 'READ' ? 'Addlegs' : '', type: 'button', value: 'Add Legs', onClick: function (evt, rowIndex) {

                                      var CurrentRowIndex = this.uIndex
                                      //var PrevRowIndex = $('#tblScheduleTrans_Row_' + CurrentRowIndex).prev('tr').attr('id').split('_')[2];
                                      CheckIsCodeShareCheck(evt, CurrentRowIndex);

                                      if (!validateTableData('tblScheduleTrans', CurrentRowIndex)) {
                                          return false;
                                      }

                                      var tempdate = $('#tblScheduleTrans_EndDate_' + CurrentRowIndex).val();
                                     // $("#tblScheduleTrans_Addlegs_"+ CurrentRowIndex).addClass('btn btn-success');
                                     // $("[id*='tblScheduleTrans_DeleteLegs']").addClass('btn btn-danger');
                                      var data = $('#tblScheduleTrans').appendGrid('getRowValue', rowIndex);

                                      var v = $('#tblScheduleTrans').appendGrid('insertRow', 1, rowIndex + 1);
                                      var nextID = $('#tblScheduleTrans').appendGrid('getRowOrder')[rowIndex + 1];

                                      $('#tblScheduleTrans_EndDate_' + (CurrentRowIndex)).val(tempdate);


                                      //if ($('#tblScheduleTrans_Row_' + (parseInt(rowIndex) + 1)).closest('tr').next()[0].id.length > 0)
                                      //    nextID = $('#tblScheduleTrans_Row_' + (parseInt(rowIndex) + 1)).closest('tr').next()[0].id.replace('tblScheduleTrans_Row_', '');
                                      if (nextID > 0) {
                                          $('#tblScheduleTrans_SNo_' + nextID).val(0);
                                          $('#tblScheduleTrans_ScheduleSNo_' + nextID).val(data.ScheduleSNo);
                                          $('#tblScheduleTrans_HdnOrigin_' + nextID).val(data.HdnOrigin);
                                          $('#tblScheduleTrans_HdnDestination_' + nextID).val(data.HdnDestination);
                                          $('#tblScheduleTrans_ScheduleType_' + nextID).val(data.ScheduleType);
                                          $('#tblScheduleTrans_FlightNo_' + nextID).val(data.FlightNo);
                                          $('#tblScheduleTrans_Routing_' + nextID).val(data.Routing);
                                          $('#tblScheduleTrans_DayDifference_' + nextID).prop('selectedIndex', 1);
                                          $('#tblScheduleTrans_SDDifference_' + nextID).prop('selectedIndex', 1);
                                          $('#tblScheduleTrans_Origin_' + nextID).val(data.Origin);
                                          $('#tblScheduleTrans_Destination_' + nextID).val(data.Destination);

                                          /*Added By Brajendra*/
                                          var date = new Date(data.EndDate);
                                          var newdate = new Date(date);

                                          newdate.setDate(newdate.getDate() + 1);

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
                                          /*Ended */


                                          $('#tblScheduleTrans_StartDate_' + nextID).val(someFormattedDate);
                                          //  if ($('#tblScheduleTrans_EndDate_' + nextID.toString()).val() == "")
                                          $('#tblScheduleTrans_EndDate_' + nextID).val(someFormattedDate);
                                          //$('#tblScheduleTrans_StartDate_' + nextID.toString()).Attributes.Add("readonly", "readonly");
                                          //$('#tblScheduleTrans_EndDate_' + nextID.toString()).Attributes.Add("readonly", "readonly");
                                          $('#tblScheduleTrans_DeleteLegs_' + nextID).show();
                                          $('#tblScheduleTrans_HdnParentID_' + nextID).val($('#tblScheduleTrans').appendGrid('getRowOrder')[rowIndex].toString());
                                          $('#tblScheduleTrans_HdnParentID_' + $('#tblScheduleTrans').appendGrid('getRowOrder')[rowIndex].toString()).val(nextID);

                                          // $('#tblScheduleTrans').appendGrid('setCtrlValue', 'Origin', nextID, data.Origin);
                                          // $('#tblScheduleTrans').appendGrid('setCtrlValue', 'Destination', nextID, data.Destination);

                                          $("#tblScheduleTrans_HdnAddLeg_" + nextID).val('1')
                                          $("[id$='tblScheduleTrans_ALTCarrierCode_" + nextID + "']").text($("#tblScheduleTrans_ALTCarrierCode_" + (CurrentRowIndex)).text());
                                          $("[type='hidden'][id$='tblScheduleTrans_ALTCarrierCode_" + nextID + "']").val($("#tblScheduleTrans_ALTCarrierCode_" + (CurrentRowIndex)).text());
                                          $("[id$='tblScheduleTrans_ALTFlightNumber_" + nextID + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase());



                                          //$("#tblScheduleTrans_CodeShareCarrierCode_" + (CurrentRowIndex)).data("kendoAutoComplete").enable(false);
                                          //// $("#tblScheduleTrans_CodeShareCarrierCode_" + i).kendoAutoComplete({ enable: true});
                                          //$("#tblScheduleTrans_CodeShareFlightNumber_" + (CurrentRowIndex)).prop("disabled", true);
                                          CheckIsCodeShareCheck(evt, nextID);
                                      }
                                  }
                              },
                           {
                               divRowNo: 3, name: pageType != 'READ' ? 'DeleteLegs' : '', type: 'button', value: 'Delete Legs', onClick: function (evt, rowIndex) { $('#tblScheduleTrans').appendGrid('removeRow', rowIndex); }

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
                updateAll: false
            },

            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
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
                $("input[id^=tblScheduleTrans_EndDate_]").blur(function (e) {
                    var Index = this.id.split('_')[2];
                    var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
                    var dto = new Date(Date.parse(k));
                    var validFrom = $(this).attr("id").replace("tblScheduleTrans_EndDate_", "tblScheduleTrans_StartDate_");
                    k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
                    var dfrom = new Date(Date.parse(k));
                    $("input[id^=tblScheduleTrans_EndDate_" + Index + "]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));

                    if (dfrom > dto)
                        $(this).val("");
                });

                $("input[id^=tblScheduleTrans_StartDate]").blur(function (e) {
                    var Index = this.id.split('_')[2];
                    var k = $(this).val().replace(/[^A-Z0-9-/]/ig, '');
                    var dfrom = new Date(Date.parse(k));
                    var validFrom = $(this).attr("id").replace("tblScheduleTrans_StartDate_", "tblScheduleTrans_EndDate_");
                    k = $("#" + validFrom).val().replace(/[^A-Z0-9-/]/ig, '');
                    var dto = new Date(Date.parse(k));
                    $("input[id^=tblScheduleTrans_StartDate_" + Index + "]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
                    if (dfrom > dto)
                        $(this).val("");

                });

                if ($("#Text_Destination").text() == $('#ViaRoute').val()) {
                    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                    $('#tblScheduleTrans_DayDifference_' + parseInt(addedRowIndex + 1).toString()).prop('disabled', 'disabled');

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

                    for (var i = 1; i <= addedRowIndex.length; i++) {

                        /*Added by Brajendra*/
                        $("[id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").text($("#Text_CarrierCode").val());
                        $("[type='hidden'][id$='tblScheduleTrans_ALTCarrierCode_" + i + "']").val($("#Text_CarrierCode").val());

                        $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val($("#FlightNumber").val() + $("#SingleAlpha").val().toUpperCase());
                        // $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").attr("disabled", true);
                        if ($("#Text_Origin").val().toUpperCase() == legs[legvalOne].toUpperCase()) {
                            $("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").prop("readonly", true);
                        }

                        $("[type='hidden'][id$='tblScheduleTrans_FlightNo_" + i + "']").val($("[id$='tblScheduleTrans_ALTFlightNumber_" + i + "']").val());

                        CheckIsCodeShareCheck(this, i)

                        /*Ended by Brajendra*/



                        if (i == 1 && (legs[legID.length - 1] != legs[legvalOne])) {
                            //  $('#tblScheduleTrans_StartDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                            //   $('#tblScheduleTrans_EndDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                            $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[legvalOne]);
                            $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[legvalOne]);
                            $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                            $('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                            $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[legID.length - 1]);

                            $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[legID.length - 1]);
                            //if($('#tblScheduleTrans_EndDate_' + i.toString()).val() == "")
                            $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                            $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());
                        }
                        else {


                            //    $('#tblScheduleTrans_StartDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                            //   $('#tblScheduleTrans_EndDate_' + i.toString()).Attributes.Add("readonly", "readonly");
                            $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('selectedIndex', 0);
                            $('#tblScheduleTrans_SDDifference_' + i.toString()).prop('selectedIndex', 1);
                            $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val(legID[legvalOne]);
                            $('#tblScheduleTrans_Origin_' + i.toString()).val(legs[legvalOne]);

                            $('#tblScheduleTrans_HdnDestination_' + i.toString()).val(legID[legvalTwo]);

                            $('#tblScheduleTrans_Destination_' + i.toString()).val(legs[legvalTwo]);


                            //var todayDate = kendo.toString(kendo.parseDate($("#FEndDate").val()), 'MM/dd/yyyy');
                            //$("#StartDate").data("kendoDatePicker").value(todayDate);
                            // if ($('#tblScheduleTrans_EndDate_' + i.toString()).val() == "")

                            $('#tblScheduleTrans_StartDate_' + i.toString()).val($("#FStartDate").val());
                            $('#tblScheduleTrans_EndDate_' + i.toString()).val($("#FEndDate").val());
                            if (legvalOne == 0 && legvalTwo == legID.length - 2) {
                                legvalOne++;
                                legvalTwo = legvalOne + 1;
                            }
                            else if (legvalTwo == legID.length - 1) {
                                legvalOne++;
                                legvalTwo = legvalOne + 1;
                            }
                            else {
                                legvalTwo++;
                            }
                        }

                        //if ($('#ViaRoute').val() == '') {
                        //    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                        //    $('#tblScheduleTrans_DayDifference_' + i.toString()).prop('disabled', 'disabled');

                        //}
                        //if (i == 1)
                        //{
                        //    $('#tblScheduleTrans_HdnOrigin_' + i.toString()).val($('#Origin').val());
                        //    $('#tblScheduleTrans_HdnDestination_' + i.toString()).val($('#Destination').val());
                        //    $('#tblScheduleTrans_Origin_' + i.toString()).val($('#Text_Origin').val());
                        //    $('#tblScheduleTrans_Destination_' + i.toString()).val($('#Text_Destination').val());
                        //}
                        //else if(addedRowIndex > 0)
                        //{
                        //    //$("#tblScheduleTrans_Origin_" + addedRowIndex).data("kendoAutoComplete").enable(false);
                        //    //$("#tblScheduleTrans_Destination_" + addedRowIndex).data("kendoAutoComplete").enable(false);

                        //    if($('#tblScheduleTrans_HdnDestination_' + addedRowIndex ).val() == $('#Destination').val())
                        //    {
                        //        $('#tblScheduleTrans_HdnOrigin_' + (parseInt(addedRowIndex) + 1)).val($('#Origin').val());
                        //        $('#tblScheduleTrans_Origin_' + (parseInt(addedRowIndex) + 1)).val($('#Text_Origin').val());
                        //    }
                        //    else
                        //    {
                        //        $('#tblScheduleTrans_HdnOrigin_' + (parseInt(addedRowIndex) + 1)).val($('#tblScheduleTrans_HdnDestination_' + (addedRowIndex)).val());
                        //        $('#tblScheduleTrans_Origin_' + (parseInt(addedRowIndex) + 1)).val($('#tblScheduleTrans_Destination_' + (addedRowIndex)).val());
                        //    }
                        //}
                    }
                }
                $('input:button[id*="tblScheduleTrans_DeleteLegs"]').each(function () {
                    if ($('#' + this.id.replace('tblScheduleTrans_DeleteLegs_', 'tblScheduleTrans_HdnParentID_')).val() == "")
                       
                        $('#' + this.id).hide();
                });

            },
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                if (pageType == 'EDIT') {
                    var legs = $('span#Routing').text().split('-');
                    for (i = 1; i <= (legs.length) ; i++) {
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
                        // to show percentage of flight capacity

                        //  grwt[i] = $('#tblScheduleTrans_AllocatedGrossWeight_'+i).val();

                    }

                    if (legs.length == 2) {
                        for (i = 1; i <= (legs.length) - 1; i++) {

                            disable(i);
                        }


                    }
                    else {
                        for (i = 1; i <= (legs[0] != legs[legs.length - 1] ? (legs.length) : (legs.length) - 1) ; i++) {

                            disable(i);
                        }

                    }
                }
            },

        });
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
function CheckFirstLeg(evt, rowIndex)
{
    $('[id^=tblScheduleTrans_IsFirstLeg_]').not('[id=' + evt.currentTarget.id + ']').removeAttr('checked');
}


function CheckAmount(id) {
    alert(id);
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


function disableCodeShare() {

}

function enableCodeShare() {

}


//Added to check IScodeShare by Vsingh 05/12/2016
function CheckIsCodeShareCheck(evt, ID) {
    
    var inputid = "#tblScheduleTrans_IsCodeShare_" + ID;
    if ($(inputid).is(':checked')) {
        $("#tblScheduleTrans_lblCodeShareFlightNumber_" + ID);
        $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).data("kendoAutoComplete").enable(true);
        //   $("#tblScheduleTrans_CodeShareCarrierCode_" + (rowIndex + 1)).kendoAutoComplete({enable:true});
        $("#tblScheduleTrans_CodeShareFlightNumber_" + ID).prop("disabled", false);
        $("#tblScheduleTrans_IsCodeShare_" + ID).is(':checked') ? 1 : 0;

        $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).attr("required", "required");
        $("#tblScheduleTrans_CodeShareFlightNumber_" + ID).attr("required", "required");
        $("#tblScheduleTrans_CodeShareCarrierCode_" + ID).focus();
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
    var RowOrder = $('#tblScheduleTrans').appendGrid('getRowOrder');
    for (var out = 0; out < $('#tblScheduleTrans').appendGrid('getRowCount') ; out++) {
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
        for (var out = 0; out < $('#tblScheduleTrans').appendGrid('getRowCount') ; out++) {
            for (var inn = out + 1; inn < $('#tblScheduleTrans').appendGrid('getRowCount') ; inn++) {
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
                            //  ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_AllDays_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_AllDays_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_AllDays_' + RO[inn]).prop('checked', false);

                        }
                        if ($('#tblScheduleTrans_Day1_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day1_' + RO[inn]).prop('checked') == true) {
                            //   ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day1_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day1_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day1_' + RO[inn]).prop('checked', false);

                        }
                        if ($('#tblScheduleTrans_Day2_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day2_' + RO[inn]).prop('checked') == true) {
                            //  ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day2_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day2_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day2_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day3_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day3_' + RO[inn]).prop('checked') == true) {
                            //   ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day3_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day3_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day3_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day4_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day4_' + RO[inn]).prop('checked') == true) {
                            //   ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day4_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day4_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day4_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day5_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day5_' + RO[inn]).prop('checked') == true) {
                            //    ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day5_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day5_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day5_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day6_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day6_' + RO[inn]).prop('checked') == true) {
                            //  ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day6_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day6_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day6_' + RO[inn]).prop('checked', false);
                        }
                        if ($('#tblScheduleTrans_Day7_' + RO[out]).prop('checked') == true && $('#tblScheduleTrans_Day7_' + RO[inn]).prop('checked') == true) {
                            // ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                            dayscross = 1;
                            if (evt.currentTarget.id == 'tblScheduleTrans_Day7_' + RO[inn] || evt.currentTarget.id == 'tblScheduleTrans_Day7_' + RO[out])
                                $('#' + evt.currentTarget.id).prop('checked', false);
                            else
                                $('#tblScheduleTrans_Day7_' + RO[inn]).prop('checked', false);
                        }
                        if (dayscross == 1)
                            ShowMessage('info', 'Need your Kind Attention!', "Days of Operation overlaps for " + $('#tblScheduleTrans_Origin_' + RO[inn].toString()).val() + "-" + $('#tblScheduleTrans_Destination_' + RO[inn].toString()).val() + " leg");
                    }
                }
            }
        }
    }
}

function setFavorite() {
    //alert('I know you love this album now :)');
    //// Check the caller button exist in event object
    //if (evtObj && evtObj.target) {
    //    // Do something on the button, such as disable the button
    //    $(evtObj.target).button('disable');
    //}
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



    var ReplaceString = value.replace('tblScheduleTrans_', 'tblScheduleTrans_Hdn');
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


    //  $('#' + OBC).after("<span id='lblper'></span>");


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
            AirCraftSno: $('#' + ReplaceString).val()
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

                    $("#OBcap_" + index).remove();
                    $('#' + OBC).after('<span id="OBcap_' + index + '">&nbsp;&nbsp;' + (Number(myData[0].OverBookingCapacityPercentage).toFixed(2) + "&nbsp%") + '</span>');
                    percenover[index] = $("#OBcap_" + index).html();
                    $("#fscap_" + index).remove();
                    $('#' + FSC).after('<span id="fscap_' + index + '">&nbsp;&nbsp;' + (Number(myData[0].FreeSaleCapacityPercentage).toFixed(2) + "&nbsp%") + '</span>');
                    percencap[index] = $("#fscap_" + index).html();

                    //if (total > 100 || FSCtotal > 100) {
                    //    ShowMessage('info', 'Need your Kind Attention!', "Value must be less than 100.");
                    //}

                    if ($("#OBcap_" + index).html().slice(0, -1) > 100.00) {
                        ShowMessage('info', 'Need your Kind Attention!', "OverBookingCapacity Value must be less than 100.");
                        $('#tblScheduleTrans_OverBookingCapacity_ ' + i).val('');
                    }
                    if ($("#fscap_" + index).html().slice(0, -1) > 100.00) {
                        ShowMessage('info', 'Need your Kind Attention!', "FreeSaleCapacity Value must be less than 100.");
                        $('#tblScheduleTrans_FreeSaleCapacity_ ' + i).val('');
                    }


                    
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

                    $("#OBcapvol_" + index).remove();
                    $('#' + OBCVol).after('<span id="OBcapvol_' + index + '">&nbsp;&nbsp;' + (Number(myData[0].OverBookingCapacityVolPercentage).toFixed(2) + "&nbsp%") + '</span>');
                    percenovervol[index] = $("#OBcapvol_" + index).html();
                    $("#fscapvol_" + index).remove();
                    $('#' + FSCVol).after('<span id="fscapvol_' + index + '">&nbsp;&nbsp;' + (Number(myData[0].FreeSaleCapacityVolPercentage).toFixed(2) + "&nbsp%") + '</span>');
                    percencapvol[index] = $("#fscapvol_" + index).html();


                    if ($('#' + UM).val() == "K" || $('#' + UM).val() == "L") {
                        //$('#' + OBCVol).attr("disabled", true);
                        //$('#' + FSCVol).attr("disabled", true);
                        $('#' + OBC).attr("disabled", false);
                        $('#' + FSC).attr("disabled", false);
                    }
                    else {
                        $('#' + OBC).attr("disabled", true);
                        $('#' + FSC).attr("disabled", true);
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
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

function CheckCAO(evt, rowIndex)
{
    $('input[type="text"][id^="tblScheduleTrans_AirCraft_' + (rowIndex + 1) + '"]').val('');
    $('input[type="hidden"][id^="tblScheduleTrans_HdnAirCraft_' + (rowIndex + 1) + '"]').val('');
}



function FlightBlur(obj) {
    if ($("#FlightNumber").val() != "") {
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
    var value = $("#OBcap_" + index).html();
    var OBCvalue = $('#tblScheduleTrans_OverBookingCapacity_' + index).val();
    if (OBCvalue == "")
    {
        $('#tblScheduleTrans_OverBookingCapacity_' + index).val('0');
    }

    if (OBCvalue != "" || OBCvalue != 0) {
        var weight = $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val();
        var total = parseFloat((OBCvalue / ( weight)) * 100);
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        $("#OBcap_" + index).remove();
        $('#' + rowIndex).after('<span id="OBcap_' + index + '">&nbsp;&nbsp;' + (total.toFixed(2) + "&nbsp%") + '</span>');
        
        if (total > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Overbooking capacity value must be less than 100%.");
            $("#OBcap_" + index).html(percenover[index]);
            $('#tblScheduleTrans_OverBookingCapacity_' + index).val(Obprev[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        $("#OBcap_" + index).remove();
    }
}
//Added by Vsingh For OverBooking Capacity on 06/01/2017

//Added by Vsingh For FreeSale Capacity on 06/01/2017

function CheckRageFSCCapacity(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $("#fscap_" + index).html();
    var FSCvalue = $('#tblScheduleTrans_FreeSaleCapacity_' + index).val();

    if (FSCvalue == "") {
        $('#tblScheduleTrans_FreeSaleCapacity_' + index).val('0');
    }
    if (FSCvalue != "" || FSCvalue != 0) {
        var weight = $('#tblScheduleTrans_AllocatedGrossWeight_' + index).val();
        // tblScheduleTrans_AirCraft_1
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        var FSCtotal = parseFloat((FSCvalue / (weight)) * 100);



        $("#fscap_" + index).remove();
        $('#' + rowIndex).after('<span id="fscap_' + index + '">&nbsp;&nbsp;' + (FSCtotal.toFixed(2) + "&nbsp%") + '</span>');
        
        if (FSCtotal > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Free Sale Capacity Value must be less than 100%.");
            $("#fscap_" + index).html(percencap[index]);
            $('#tblScheduleTrans_FreeSaleCapacity_' + index).val(prev[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        $("#fscap_" + index).remove();
    }

};

//Added by Vsingh For FreeSale Capacity on 06/01/2017





//Added by Vsingh For OverBooking Capacity on 09/01/2017
function CheckRageOBCCapacityVol(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $("#OBcapvol_" + index).html();
    var OBCvaluevol = $('#tblScheduleTrans_OverBookingCapacityVol_' + index).val();

    if (OBCvaluevol == "") {
        $('#tblScheduleTrans_OverBookingCapacityVol_' + index).val('0');
    }

    if (OBCvaluevol != "" || OBCvaluevol != 0) {
        var weightvol = $('#tblScheduleTrans_AllocatedVolumeWeight_' + index).val();
        var totalvol = parseFloat((OBCvaluevol /( weightvol)) * 100);
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        $("#OBcapvol_" + index).remove();
        $('#' + rowIndex).after('<span id="OBcapvol_' + index + '">&nbsp;&nbsp;' + (totalvol.toFixed(2) + "&nbsp%") + '</span>');
        
        if (totalvol > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Overbooking capacity value must be less than 100%.");
            $("#OBcapvol_" + index).html(percenovervol[index]);
            $('#tblScheduleTrans_OverBookingCapacityVol_' + index).val(Obprevvol[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        $("#OBcapvol_" + index).remove();
    }
}
//Added by Vsingh For OverBooking Capacity on 09/01/2017


//Added by Vsingh For FreeSale Capacity on 09/01/2017

function CheckRageFSCCapacityVol(rowIndex) {

    var index = rowIndex.split('_')[2];
    var value = $("#fscapvol_" + index).html();
    var FSCvaluevol = $('#tblScheduleTrans_FreeSaleCapacityVol_' + index).val();

    if (FSCvaluevol == "") {
        $('#tblScheduleTrans_FreeSaleCapacityVol_' + index).val('0');
    }

    if (FSCvaluevol != "" || FSCvaluevol != 0) {
        var weightvol = $('#tblScheduleTrans_AllocatedVolumeWeight_' + index).val();
        // tblScheduleTrans_AirCraft_1
        var aircraft = 'tblScheduleTrans_AirCraft_' + index;
        var FSCtotalvol = parseFloat((FSCvaluevol /(weightvol)) * 100);



        $("#fscapvol_" + index).remove();
        $('#' + rowIndex).after('<span id="fscapvol_' + index + '">&nbsp;&nbsp;' + (FSCtotalvol.toFixed(2) + "&nbsp%") + '</span>');
        
        if (FSCtotalvol > 100.00) {
            ShowMessage('info', 'Need your Kind Attention!', "Free Sale Capacity Value must be less than 100%.");
            $("#fscapvol_" + index).html(percencapvol[index]);
            $('#tblScheduleTrans_FreeSaleCapacityVol_' + index).val(prevvol[index]);
            if (pageType == "EDIT") {
                populateValueCell(aircraft);
            }
        }
    }
    else {
        $("#fscapvol_" + index).remove();
    }

};

//Added by Vsingh For FreeSale Capacity on 09/01/2017



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
    if ($('#' + obj).val() + '-' + $("#" + obj.replace("CarrierCode", "FlightNumber")).val() == $('#CarrierCode').val().trim().slice(-2) + '-' + $('#FlightNumber').val().trim()) {
        alert("Select Another flight");
        $('#' + obj).val('')
        $("#" + obj.replace("CarrierCode", "FlightNumber")).val('');
   }
}
function checkMainFlightNo(obj) {
    if ($("#" + obj.replace("FlightNumber", "CarrierCode")).val() + '-' + $('#' + obj).val() == $('#CarrierCode').val().trim().slice(-2) + '-' + $('#FlightNumber').val().trim()) {
        alert("Select Another flight");
        $('#' + obj).val('')
        $("#" + obj.replace("FlightNumber", "CarrierCode")).val('');
    }
}
// ================End=============================================================
//===========================================Added by arman ali 17-04-2017=========================
function checkcodeshare(){
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    debugger;
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