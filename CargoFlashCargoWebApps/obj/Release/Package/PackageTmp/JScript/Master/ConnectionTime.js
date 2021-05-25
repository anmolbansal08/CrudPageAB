$(document).ready(function () {
    cfi.ValidateForm();
    var BasedOnKey = [{ Key: "1", Text: "BKD" }, { Key: "2", Text: "FWB" }, { Key: "3", Text: "ETD" }]
    cfi.AutoCompleteByDataSource("BasedOn", BasedOnKey);

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
 