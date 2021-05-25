$(document).ready(function () {
    $('#MasterSaveAndNew').hide();
    OnSelectTrans();
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