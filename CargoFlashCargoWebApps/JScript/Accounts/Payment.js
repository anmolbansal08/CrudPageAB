$(document).ready(function ()
{

    $('.formSection').append("<a href='#secondpage' data-role='button' >Link Button</a>");
    
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Payment_City", null, "contains");
    cfi.AutoCompleteV2("BankAccountSNo", "SNo,AccountNo", "BankAccount", null, "contains");
    cfi.AutoCompleteV2("ContactTypeSNo", "SNo,Name", "Payment_Contact", null, "contains");

    $('input:radio[name=PaymentType]').click(function ()
    {
        if($(this).val()=='0')
        {
            $('#ContactTypeSNo').val('');
            $('#Text_ContactTypeSNo').val('');
            $('#spnContactTypeSNo').text('Office Name');
            cfi.AutoCompleteV2("ContactTypeSNo", "SNo,Name", "Payment_Contact", null, "contains");
        }
        else
        {
            $('#ContactTypeSNo').val('');
            $('#Text_ContactTypeSNo').val('');
            $('#spnContactTypeSNo').text('Account Name');
            cfi.AutoCompleteV2("ContactTypeSNo", "SNo,Name", "Payment_AccountContact", null, "contains");
        }
    });
});