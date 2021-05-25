$(document).ready(function () {
    cfi.ValidateForm();


    cfi.AutoComplete("LedgerSno", "LedgerCode", "vwLedger", "Sno", "LedgerCode", ["LedgerCode"], null, "contains");
});

