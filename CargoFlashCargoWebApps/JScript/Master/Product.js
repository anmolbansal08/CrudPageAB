$(document).ready(function () {
    cfi.ValidateForm();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
    }
    
    cfi.AutoCompleteV2("PriorityMasterSNo", "SNo,PriorityName", "Master_Product_Priority", null, "contains",',');/*-- Added By Pankaj Kumar Ishwar on 27/03/2018 --*/
    cfi.BindMultiValue("PriorityMasterSNo", $("#Text_PriorityMasterSNo").val(), $("#PriorityMasterSNo").val());
    var data = [{ Key: "1", Text: "Discount On OC " }, { Key: "2", Text: "Discount On WC " }, { Key: "3", Text: "No" }];
    cfi.AutoCompleteByDataSource("TypeOfDiscount", data, null, null);
    $('input:radio[name=IsDefault]').click(function () {
        if ($(this).val() == '0') {
            var IsDefault = 'False';
            $.ajax({
                type: "POST",
                url: "./Services/Master/ProductService.svc/GetDefault",
                data: { id: 1 },
                dataType: "json",
                success: function (response) {
                    IsDefault = response.Data[0];
                    var ProductName = response.Data[1];
                    if (IsDefault == 'True') {
                        ShowMessage('info', 'Need your Kind Attention!', ProductName +" Product has already been set as default.");
                        $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
                    }
                }

            });
        }
        else {
        }
    });
  
    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
});


function ExtraCondition(textId) {
   
    var PriorityName = cfi.getFilter("AND");
    if (textId == "Text_PriorityMasterSNo")
    {
        cfi.setFilter(PriorityName, "IsActive", "eq", 1);
        var AutoCompleteFilter = cfi.autoCompleteFilter(PriorityName);
        return AutoCompleteFilter;
    }
}
function SetPriority(e) {
    var Data = e.value;
    if (Data>10) {
        alert("Priority must be less or equal to 10")
        $("#Priority").val("");
    }
}
$('#Priority').blur(function () {

    if ($("#Priority").val() > 10 || $("#Priority").val() < 1) {
        alert("Priority should be   between 1 to 10.")
        $("#Priority").val("");
        return false;
    }

});
