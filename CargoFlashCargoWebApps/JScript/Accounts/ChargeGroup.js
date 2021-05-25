$(document).ready(function () {
    cfi.ValidateForm();

    cfi.AutoCompleteV2("LedgerSno", "LedgerCode,LedgerName", "ChargeGroup_Ledger", null, "contains");
});

