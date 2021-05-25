$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoComplete("LocationTypeSNo", "Description", "MovementType", "SNo", "Description", ["Description"], null, "contains");

    cfi.AutoComplete("TeamName", "Name", "TeamID", "SNo", "Name", ["Name"], null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
       // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
    }


    //$('input:radio[name=IsDefault]').click(function () {
    //    if ($(this).val() == '0') {
    //        var IsDefault = 'False';
    //        $.ajax({
    //            type: "POST",
    //            url: "./Services/Master/ProductService.svc/GetDefault",
    //            data: { id: 1 },
    //            dataType: "json",
    //            success: function (response) {
    //                IsDefault = response.Data[0];
    //                var ProductName = response.Data[1];
    //                if (IsDefault == 'True') {
    //                    ShowMessage('info', 'Need your Kind Attention!', ProductName +" Product have already default.");
    //                    $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
    //                }
    //            }

    //        });
    //    }
    //    else {
    //    }
    //});
});