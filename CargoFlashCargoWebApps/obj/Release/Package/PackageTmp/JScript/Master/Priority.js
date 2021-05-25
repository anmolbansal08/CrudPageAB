$(document).ready(function () {
    cfi.ValidateForm();
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
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