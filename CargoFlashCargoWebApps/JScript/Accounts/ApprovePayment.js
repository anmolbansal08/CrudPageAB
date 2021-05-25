$(document).ready(function () {
    $('#MasterSaveAndNew').hide();
    $("[title='Existing Credit Limit']").closest('td').text('Balance Credit Limit')

    $("[title='New Credit Limit']").closest('td').text('New Balance Credit Limit')

    $("[type='radio'][name='IsApproved'][value='0']").attr('checked', true)

    OnSelectTrans();

    //if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
    //    if ($('#TransectionModeSNo').val().toUpperCase() == "BANK GUARANTEE") {
    //        $("#CreditLimit").next('span').text($("#ExistingCreditLimit").val());
    //    }

    //}
    UserPageRights("ApprovePayment")
    if (isCreate == false) {
        $('input[value="Save"]').hide()
    } else {
        $('input[value="Save"]').show()
    }
    /**********************Added by devendra **********05JAN2019********************/
    var vtxt = $('#__SpanHeader__').text();
    var vkey = $('#htmlkeyvalue').val();
    $('#__SpanHeader__').text('');
    $('#__SpanHeader__').text(vtxt + ' ' + vkey);
    /**********************END******************************/
});

function OnSelectTrans() {

    if ($('#TransectionModeSNo').val() == 'CASH') { //CASH
        // resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().hide();
        $('#BankGaranteeValidFrom').closest('tr').hide();
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
        $('#BankGaranteeValidFrom').closest('tr').hide();
        //applyValidation();
        //$('#UpdateType').closest('td').hide();
        //$('#spnUpdateType').closest('td').hide();

    }
    else if ($('#TransectionModeSNo').val() == 'BANK GUARANTEE' || $('#TransectionModeSNo').val() == 'ONLINE PAYMENT') { //BANK GUARANTEE AND ONLINE PAYMENT
       // resetTransectionFields();
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
        $('#BankGaranteeValidFrom').closest('tr').hide();

    }
    else {
        //resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().hide();
        //removeValidation();
        //$('#UpdateType').closest('td').show();
        //$('#spnUpdateType').closest('td').show();
    }
}

$(window).on('beforeunload', function () {
 
    $('input[name="operation"]').prop("disabled", "disabled");
});
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

