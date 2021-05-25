if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    var value = $("#MachineName").val();
    $('#__SpanHeader__').text("BTB Machine Pallet Edit:" + value);
    $('#Weight').after('KG');
    $('#Weight').keyup(function () {
        if ($('#Weight').val() == '0') {
            //ShowMessage('warning', 'Success -', "Flight-  Processed Successfully", "bottom-right");
            $('#Weight').val('');
        }
        else {

        }
    });
}
if (getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
    var value = $("#MachineName").val();
    $('#__SpanHeader__').text("BTB Machine Pallet Delete:" + value);
    $('#palletweight').after(' KG');
    if ($('#IsActive').val().toUpperCase() == 'TRUE') {
        $("#IsActive").siblings('span').first().html('Yes');
    }
    else {
        $("#IsActive").siblings('span').first().html('No');
    }
}
if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
    var value = $("#MachineName").val();
    $('#__SpanHeader__').text("BTB Machine Pallet Detail:" + value);
    $('#palletweight').after(' KG');
    if ($('#IsActive').val().toUpperCase() == 'TRUE') {
        $("#IsActive").siblings('span').first().html('Yes');
    }
    else {
        $("#IsActive").siblings('span').first().html('No');
    }
}
if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

    $('#Weight').after('KG');
    $('#Weight').keyup(function () {
        if ($('#Weight').val() == '0') {
            //ShowMessage('warning', 'Success -', "Flight-  Processed Successfully", "bottom-right");
            $('#Weight').val('');
        }
        else {

        }
    });

}
if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    $('#Weight').after('KG');
    $('#Weight').keyup(function () {
        if ($('#Weight').val() == '0') {
            //ShowMessage('warning', 'Success -', "Flight-  Processed Successfully", "bottom-right");
            $('#Weight').val('');
        }
        else {

        }

    });
}
