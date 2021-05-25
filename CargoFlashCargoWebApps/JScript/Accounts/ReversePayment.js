function fn_ReverseSuccessGrid(e) {

    //  if (userContext.SysSetting["IsExcludeBankGuarantee"].toUpperCase() == "TRUE") {

    $('table tr td[data-column="Print"] span').text('');
    var LogoURL = 0;
    var LengthGrid = $('[id*="faction"]').length;
    var Status = '';
    var flag = '';
    for (var i = 0; i < LengthGrid ; i++) {
        $('table tr td[data-column="Print"] span:eq(' + i + ')').text('');
        //Status = $('table tr td[data-column="Transaction"] span:eq(' + i + ')').text();                   

        var IsExclude = $('table tr td[data-column="IsExcludeBankGuarantee"]:eq(' + i + ')').text();
        if (IsExclude == "True") {

            $('table tr td[data-column="Print"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="P"  title= "Print Deposit Receipt" class="btn btn-success" onclick="BindPrintData(this.id,this.LogoURL);"   />')
            $('table tr td[data-column="Print"] span:eq(' + i + ')').append(" ");
            //if (flag == "True") {
            //    $('table tr td[data-column="SNo"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="EDOX" title= "EDOX" class="completeprocess" onclick="BindEdox(this.id);" style="height: 24px; width:50px;" />')
            //}
            //else {
            //    $('table tr td[data-column="SNo"] span:eq(' + i + ')').append('<input type="button" id=' + $('[id*="faction"]:eq(' + i + ')').val() + ' value="EDOX" title= "EDOX" class="incompleteprocess" onclick="BindEdox(this.id);" style="height: 24px; width:50px;" />')
            //}
        }
    }
}


var strExclude = '';
strExclude +='<td class="formtwolabel" title="Select AWB No">Description</td>'
strExclude +='<td class="formtwoInputcolumn">'
strExclude+='<input type="textbox" class="k-input" id="Description" style="width: 150px; text-transform: uppercase;" tabindex="47"></td>'


function BindPrintData(id,LogoURL) {
    var LogoURL = userContext.SysSetting.LogoURL;
        if (id > 0)
            window.open("HtmlFiles/Account/BGSecurityDepositPrint.html?SNo=" + id + "&LogoUrl=" + LogoURL);
           //window.open("HtmlFiles/Account/InvoiceWorkOrderPrint.html?AirlineInvoiceSNo=" + AirlineInvoiceSNo + "&UserSNo=" + userContext.UserSNo + "&LogoUrl=" + LogoURL);
        else
            jAlert("BG Print not generated");

        //var logoUrl = userContext.SysSetting.LogoURL;
    
}
$(document).ready(function () {
    $('#MasterSaveAndNew').hide();
    OnSelectTrans();

    UserPageRights("ReversePayment")
    if (isCreate == false) {
        $('input[value="Save"]').hide()
    } else {
        $('input[value="Save"]').show()
    }

    // Add Ref no at the top by umar 04-Jul-2019
    var vtxt = $('#__SpanHeader__').text();
    var vkey = $('#htmlkeyvalue').val();
    $('#__SpanHeader__').text('');
    $('#__SpanHeader__').text(vtxt + ' ' + vkey);
    
   
});



function OnSelectTrans() {

    if ($('#TransectionModeSNo').val() == 'CASH') { //CASH
        // resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().hide();
        //removeValidation();
        //$('#UpdateType').closest('td').hide();
        //$('#spnUpdateType').closest('td').hide();

    }
    else if ($('#TransectionModeSNo').val() == 'CHEQUE') { //CHEQUE
        // resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().show();
        $('#spnChequeDate').text('Cheque Date');
        $('#spnChequeDate').closest('td').attr('title', 'Select Cheque Date');
        $('#ChequeDate').attr("data-valid-msg", "Cheque Date cannot be blank");
        $('#ChequeNo').removeAttr('disabled');
        $('#spnChequeNo').closest('td').find('font').text('*');
        $('#ChequeNo').closest('tr').nextAll().hide();
        //applyValidation();
        //$('#UpdateType').closest('td').hide();
        //$('#spnUpdateType').closest('td').hide();

    }
    else if ($('#TransectionModeSNo').val() == 'BANK GUARANTEE' || $('#TransectionModeSNo').val() == 'ONLINE PAYMENT') { //BANK GUARANTEE AND ONLINE PAYMENT
        //resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().show();
        $('#spnChequeDate').text('Transaction Date');
        $('#spnChequeDate').closest('td').attr('title', 'Select Transaction Date');
        $('#ChequeDate').attr("data-valid-msg", "Transaction Date cannot be blank");
        $('#ChequeNo').attr('disabled', true);
        $('#spnChequeNo').closest('td').find('font').text('');
        $('#ReferenceNo').closest('tr').nextAll().hide();

        // applyValidation();
        $('#ChequeNo').removeAttr('data-valid');
        //$('#UpdateType').closest('td').hide();
        //$('#spnUpdateType').closest('td').hide();
    }
    else if ($('#TransectionModeSNo').val() == 'VIRTUAL UPDATE') {// VIRTUAL UPDATE
        //resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().show();
        $('#spnChequeDate').text('Transaction Date');
        $('#spnChequeDate').closest('td').attr('title', 'Select Transaction Date');
        $('#ChequeDate').attr("data-valid-msg", "Transaction Date cannot be blank");
        $('#ChequeNo').attr('disabled', true);
        $('#spnChequeNo').closest('td').find('font').text('');
        $('#ReferenceNo').closest('tr').nextAll().hide();
        $('#ReferenceNo').closest('tr').prev().hide().prev().hide();
        //$('#UpdateType').closest('td').show();
        //$('#spnUpdateType').closest('td').show();
        //removeValidation();
        $('#ChequeDate').attr('data-valid', 'required');

    }
    else {
        //resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().hide();
        //removeValidation();
        //$('#UpdateType').closest('td').show();
        //$('#spnUpdateType').closest('td').show();
    }
}
// add By Sushant on 24-07-2018
var isCreate = false, IsEdit = false, IsDelete = false, IsRead = false;

function UserPageRights(apps) {

    $(userContext.PageRights).each(function (i, e) {
        if (e.Apps.toUpperCase() == apps.toUpperCase()) {
            if (e.PageRight.toUpperCase() == 'New'.toUpperCase()) {
                isCreate = true;
            }
            if (e.PageRight.toUpperCase() == 'Edit'.toUpperCase()) {
                IsEdit = true;
            }
            if (e.PageRight.toUpperCase() == 'Delete'.toUpperCase()) {
                IsDelete = true;
            }
            if (e.PageRight.toUpperCase() == 'Read'.toUpperCase()) {
                IsRead = true;
            }
        }
    });

}
//-- added by arman for multiple save on save button click 2019-01-03
$(window).on('beforeunload', function () {

    $('input[name="operation"]').prop("disabled", "disabled");
});
