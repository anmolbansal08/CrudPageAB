/// <reference path="../../Scripts/references.js" />
//Javascript file for City Page for binding Autocomplete

$(document).ready(function () {
    cfi.ValidateForm();


    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });

});


