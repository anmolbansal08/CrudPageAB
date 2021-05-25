$(document).ready(function ()
{

    $('.formSection').append("<a href='#secondpage' data-role='button' >Link Button</a>");
    
    cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("BankAccountSNo", "SNo,AccountNo", "BankAccount", "SNo", "AccountNo", null, null, "contains");
    cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "Office", "SNo", "Name", null, null, "contains");

    $('input:radio[name=PaymentType]').click(function ()
    {
        if($(this).val()=='0')
        {
            $('#ContactTypeSNo').val('');
            $('#Text_ContactTypeSNo').val('');
            $('#spnContactTypeSNo').text('Office Name');
            cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "Office", "SNo", "Name", null, null, "contains");
        }
        else
        {
            $('#ContactTypeSNo').val('');
            $('#Text_ContactTypeSNo').val('');
            $('#spnContactTypeSNo').text('Account Name');
            cfi.AutoComplete("ContactTypeSNo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains");
        }
    });
});