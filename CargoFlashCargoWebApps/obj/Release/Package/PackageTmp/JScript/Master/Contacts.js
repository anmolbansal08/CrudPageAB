$(document).ready(function ()
{
  
    cfi.ValidateForm();
    cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "vwOffice", "SNo", "Name", null, null, "contains");
   // cfi.AutoComplete("AccountSNo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains");
   // cfi.AutoComplete("WarehouseSNo", "SNo,Name", "Warehouse", "SNo", "Name", null, null, "contains");
    cfi.AutoComplete("DepartmentSNo", "SNo,Name", "vwDepartment", "SNo", "Name", null, null, "contains");
    cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("CountryCode", "CountryCode,CountryName", "vwCountry", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains", null, null, null, null, OnSelectCountry);
    $('input:radio[name=ContactsType]').click(function ()
    {
        if ($(this).val() == '0')
        {
            $('#spnContactTypeSNo').text('Office Name');
            $('#ContactTypeSNo').val('');
            $('#Text_ContactTypeSNo').val('');
            cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "vwOffice", "SNo", "Name", null, null, "contains");
        }
        else if ($(this).val() == '1')
        {
            $('#spnContactTypeSNo').text('Account Name');
            $('#ContactTypeSNo').val('');
            $('#Text_ContactTypeSNo').val('');
            cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "vwAccount", "SNo", "Name", null, null, "contains");
        }
        else if ($(this).val() == '2') {
            $('#spnContactTypeSNo').text('CTO Name');
            $('#ContactTypeSNo').val('');
            $('#Text_ContactTypeSNo').val('');
            cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "vwWarehouse", "SNo", "Name", null, null, "contains");
        }
    });


    $('input:radio[name=IsPrimary]').click(function ()
    {

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
        //                    ShowMessage('info', 'Need your Kind Attention!', ProductName + " Product have already default.");
        //                    $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
        //                }
        //            }

        //        });
        //    }
        //    else {
        //    }
        //});






        if ($('input:radio[name=IsPrimary]:checked').val() == "0")
        {
           var Sno = getQueryStringValue("FormAction").toUpperCase() == "EDIT" ? $('#hdnContactSNo').val() : "0";
           if ($('#Text_ContactTypeSNo').data("kendoAutoComplete").key() != "")
            {

                $.ajax({
                    type: "POST",
                    url: "./Services/Master/ContactsService.svc/CheckIsPrimary?ContactType=" + $("input:radio[name=ContactsType]:checked").val() + "&ContactTypeSNo=" + $('#Text_ContactTypeSNo').data("kendoAutoComplete").key() + "&Primary=" + $("input:radio[name=IsPrimary]:checked").val() + "&SNo=" + Sno,
                    data: { id: 1 },
                    dataType: "json",
                    async: false,
                    success: function (response)
                    {
                        var SNo = response.Data[0];
                        if (SNo == "1999")
                        {
                            ShowMessage('info', 'Need your Kind Attention!', $('#spnContactTypeSNo').text()+"  "+ $('#Text_ContactTypeSNo').data("kendoAutoComplete").value() + " have already Primary.");
                            $("input:radio[name='IsPrimary'][value ='1']").prop('checked', true);
                        }
                      
                    }
                });
            }
            else
            {
                ShowMessage('info', 'Need your Kind Attention!', 'Please  Select  ' + $('#spnContactTypeSNo').text() + "");
                $("input:radio[name='IsPrimary'][value ='1']").prop('checked', true);
            }
        }
        else
        {
            $("input:radio[name='IsPrimary'][value ='1']").prop('checked', true);
        }
 });

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
    {
          $("input:radio[name='IsPrimary'][value ='1']").prop('checked', true);
    }


    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
    {
        ShowHide();
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
    {
        ShowHide();
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "READ")
    {
        ShowHide();
    }

    

   
});


function OnSelectCountry(e) {
    var Data = this.dataItem(e.item.index());
    $.ajax({
        type: "POST",
        url: "./Services/Master/ContactsService.svc/GetCity?recid=" + Data.Key,
        data: { id: 1 },
        dataType: "json",
        success: function (response) {
            var SNo = response.Data[0];
            var CityCode = response.Data[1];
            $('#CitySNo').val(SNo);
            $('#Text_CitySNo').val(CityCode);
           
        }
    });
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_CitySNo") {
        try {
            cfi.setFilter(filterEmbargo, "CountryCode", "eq", $("#Text_CountryCode").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}


function ShowHide()
{
    if ($('input:radio[name=ContactsType]:checked').val() == '0') {
        $('#spnContactTypeSNo').text('Office Name');
        cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "vwOffice", "SNo", "Name", null, null, "contains");
    }
    else if ($('input:radio[name=ContactsType]:checked').val() == '1') {
        $('#spnContactTypeSNo').text('Account Name');
        cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "vwAccount", "SNo", "Name", null, null, "contains");
    }
    else if ($('input:radio[name=ContactsType]:checked').val() == '2') {
        $('#spnContactTypeSNo').text('CTO Name');
        cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "vwWarehouse", "SNo", "Name", null, null, "contains");
    }
}



//function ShowHide(id)
//{
//    var content = id.value;

//    if(content==0)
//    {
//        $("#Text_OfficeSNo").show();
//        $("#Text_AccountSNo").hide();
//        $("#Text_WarehouseSNo").hide();

//        //$("#Text_OfficeSNo").css("display", "block");
//        //$("#Text_AccountSNo").css("display", "none");
       

//    }
//    else if (content == 1)
//    {

       

    

      

//        //$("#OfficeSNo").show();
//        //$("#Text_AccountSNo").show();
//        //$("#AccountSNo").show();


//        $("#Text_OfficeSNo").hide();
//        $("#Text_AccountSNo").show();
//        $("#Text_WarehouseSNo").hide();

//        //$("#Text_OfficeSNo").css("display","none");
//        //$("#Text_AccountSNo").css("display", "block");
//       // alert("1");

//    }
//    else
//    {
//        $("#Text_OfficeSNo").hide();
//        $("#Text_AccountSNo").hide();
//        $("#Text_WarehouseSNo").show();
//        //alert("2");
//    }

    
//}



