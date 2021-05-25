$(document).ready(function () {
    cfi.ValidateForm();
    //$(document).keydown(function (event) {
    //    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
    //        event.preventDefault();
    //    }
    //});
    var a = $("#AssignedTruckExpDate").data("kendoDatePicker");
    a.min(new Date());
    var b = $("#EIDNoExpDate").data("kendoDatePicker");
    b.min(new Date());
    var c = $("#PPExpDate").data("kendoDatePicker");
    c.min(new Date());
    var d = $("#SHJcustomscardNoexpDate").data("kendoDatePicker");
    d.min(new Date());
    var e = $("#ADPNoExpDate").data("kendoDatePicker");
    e.min(new Date());
    var f = $("#DXBcustomsExpDate").data("kendoDatePicker");
    f.min(new Date());

    $("input#TruckNo").on({
        keydown: function (e) {
            if (e.which === 32)
                return false;
        },
        change: function () {
            this.value = this.value.replace(/\s/g, "");
        }
    });

    $("input#AssignedTruckRegNo").on({
        keydown: function (e) {
            if (e.which === 32)
                return false;
        },
        change: function () {
            this.value = this.value.replace(/\s/g, "");
        }
    });

    $("#TruckNo").change(function (e) {
        if (parseInt($("#TruckNo").val()) == 0) {
            ShowMessage('warning', 'information - Truck Master', "Enter Valid Truck No");
            $("#TruckNo").val('');
            return false;
        }

    })

    $("#AssignedTruckRegNo").change(function (e) {
        if (parseInt($("#AssignedTruckRegNo").val()) == 0) {
            ShowMessage('warning', 'information - Truck Master', "Enter Valid Assigned Truck Reg No");
            $("#AssignedTruckRegNo").val('');
            return false;
        }

    })

    $("#EIDNo").change(function (e) {
        if (parseInt($("#EIDNo").val()) == 0) {
            ShowMessage('warning', 'information - Truck Master', "Enter Valid EID No");
            $("#EIDNo").val('');
            return false;
        }

    })
    $("#PPNo").change(function (e) {
        if (parseInt($("#PPNo").val()) == 0) {
            ShowMessage('warning', 'information - Truck Master', "Enter Valid  PP No");
            $("#PPNo").val('');
            return false;
        }

    })
    $("#SHJcustomsCardNo").change(function (e) {
        if (parseInt($("#SHJcustomsCardNo").val()) == 0) {
            ShowMessage('warning', 'information - Truck Master', "Enter Valid SHJ customs Card No");
            $("#SHJcustomsCardNo").val('');
            return false;
        }

    })
    $("#DXBcustomsCardNo").change(function (e) {
        if (parseInt($("#DXBcustomsCardNo").val()) == 0) {
            ShowMessage('warning', 'information - Truck Master', "Enter Valid DXB customs Card No");
            $("#DXBcustomsCardNo").val('');
            return false;
        }

    })
    $("#ADPNo").change(function (e) {
        if (parseInt($("#ADPNo").val()) == 0) {
            ShowMessage('warning', 'information - Truck Master', "Enter Valid ADP No");
            $("#ADPNo").val('');
            return false;
        }

    })
});