/*
*************************************************************************************
File Name:      CfiTextBox.js
Purpose:        For numeric only text box, checks for the negative no insertion also.
Company:        CargoFlash Infotech .
Author:         Sudhir Yadav
Created On:     26 Nov, 2009
******************************************************************************
*/

//For numeric only text boxes, formats the text box according to the places of decimal specified...
function FormatOnBlur(clientID, placesOfDecimal, isZeroPrefix) {
    num = clientID.value;
    if (num == '-')
        num = '0';
    if (num != '') {
        var aabb = num = (parseFloat(num)).toFixed(placesOfDecimal);
//        if (aabb.indexOf('.') == 1) {
//            aabb = '0' + aabb;
        //        }
        if (isNaN(aabb))
            aabb = 0;
        if (!isNaN(aabb) && isZeroPrefix.toLowerCase() == "true")
            clientID.value = clientID.value;
        else
            clientID.value = aabb;
    }
    else {
        clientID.value = '0';
    }
}


function FormatOnBlur(clientID, placesOfDecimal, isZeroPrefix,minlength) {
    num = clientID.value;
    if (num == '-')
        num = '0';
    if (num != '') {
        var aabb = num = (parseFloat(num)).toFixed(placesOfDecimal);
        //        if (aabb.indexOf('.') == 1) {
        //            aabb = '0' + aabb;
        //        }
        if (isNaN(aabb))
            aabb = 0;
        if (!isNaN(aabb) && isZeroPrefix.toLowerCase() == "true")
            clientID.value = clientID.value;
        else
            clientID.value = aabb;
    }
    else {
        clientID.value = '0';
    }
    if (minlength > 0 && clientID.value.length < minlength) {
        var a = '0';
        for (var i = 1; i < (minlength - clientID.value.length); i++)
            a = a + '0';
        clientID.value = a + aabb;
        
    }

}

// Keep user from entering more than maxLength characters

function doKeypressforMaxLength(control, maxLength) {
    value = control.value;
    if (value.length > maxLength) {
        //event.returnValue = false;
        control.value = control.value.substr(0, maxLength);
    }
    //return (value.length <= maxLength);

}

// check total allowed hyphen count in textbox
//txtType : 0->Default && 1->Numeric && 2->Alphanumeric && 3->AWB or FLIGHT or ULD 
function doKeypressforAllowChar(e, control, hyphenCount, allowedCharacter, txtType) {
    value = control.value;
    var asciiCode = e.keyCode ? e.keyCode : e.charCode;
    var keyCode = String.fromCharCode(e.keyCode ? e.keyCode : e.charCode)
    txtType = parseInt(txtType);
    if ((txtType==3 || txtType==4) && keyCode == " ")
        e.preventDefault();
    var matchedAlpha = (/[a-z]/i).test(String.fromCharCode(e.keyCode || e.which));
    var matchedNumber = (/[0-9]/i).test(String.fromCharCode(e.keyCode || e.which));
    hyphenCount = parseInt(hyphenCount); 
    if (allowedCharacter == undefined || allowedCharacter == null)
        allowedCharacter = "";
    if (hyphenCount > 0)
        allowedCharacter = allowedCharacter.replace("-", "");
    var specialCharacter = allowedCharacter.indexOf(keyCode);
    var trueKey = ((asciiCode >= 37 && asciiCode <= 40) || asciiCode == 8 || asciiCode == 46 || asciiCode == 9);

    if (e.shiftKey && !trueKey) {
        if (specialCharacter < 0)
            e.preventDefault();
    }
    if (hyphenCount > 0) {
        var valueArray = value.split('-');
        if (txtType == 3) {
            trueKey = true; // Add To Allow Copy/Paste
            if (!(matchedNumber || keyCode == "-" || trueKey))
                e.preventDefault();
            if (valueArray.length >= hyphenCount + 1 && keyCode == "-" && !matchedNumber && specialCharacter < 0) {
                e.preventDefault();
            }
        }
        // Add To Allow Copy/Paste
        else if (txtType == 4) {
        return true;
        }
        else if (valueArray.length >= hyphenCount + 1 && keyCode == "-" && specialCharacter < 0) {
            e.preventDefault();
        }
    }
    else {
        if (txtType == 4) {
            if (!(matchedAlpha || matchedNumber || specialCharacter >=0 || trueKey))
                e.preventDefault();
            if (!matchedAlpha && !matchedNumber && specialCharacter < 0 && !trueKey) {
                e.preventDefault();
            }
        }
        else if (txtType == 3) {
            if (!matchedNumber && specialCharacter < 0 && !trueKey) {
                e.preventDefault();
            }
        }
    }
    //return (value.length <= maxLength);

}

// check decimal count in textbox

function doKeypressforDecimalCount(e, control, isDecimalAllowed, allowedCharacter) {
    value = control.value;
    var asciiCode = e.keyCode ? e.keyCode : e.charCode;
    var keyCode = String.fromCharCode(e.keyCode ? e.keyCode : e.charCode);
   
    var matchedNumber = (/[0-9]/i).test(String.fromCharCode(e.keyCode || e.which));
    if (allowedCharacter == undefined || allowedCharacter == null)
        allowedCharacter = "";
    var specialCharacter = allowedCharacter.indexOf(keyCode);
    var trueKey = ((asciiCode >= 37 && asciiCode <= 40) || asciiCode == 8 || asciiCode == 46 || asciiCode == 9);
    if (e.shiftKey && !trueKey) {
        if (specialCharacter < 0)
            e.preventDefault();
    }
    if (isDecimalAllowed.toUpperCase() == "FALSE") {
        if ((keyCode == "." || keyCode == "_") && !trueKey)
            e.preventDefault();
    }
    else {
        var valueArray = value.split('.');
        if ((keyCode == "." || keyCode == "_") && valueArray.length >= 2 && !trueKey)
            e.preventDefault();
        else {
            if (!matchedNumber && specialCharacter < 0 && !trueKey) {
                e.preventDefault();
            }
        }
    }
}

// Cancel default behavior

function doBeforePasteforMaxLength(control, maxLength) {
    if (maxLength) {
        event.returnValue = false;
    }
}
// Cancel default behavior and create a new paste routine

function doPasteforMaxLength(control, maxLength) {
//    value = control.value;
//    if (maxLength) {
//        event.returnValue = false;
//        maxLength = parseInt(maxLength);
//        var oTR = control.document.selection.createRange();
//        var iInsertLength = maxLength - value.length + oTR.text.length;
//        var sData = window.clipboardData.getData("Text").substr(0, iInsertLength);
//        oTR.text = sData;
//    }
    
     /*   if (maxLength) {
        if (maxLength < control.value.length) {
            var txt = event.clipboardData.getData("text");
            control.value.substring(0, txt);
        }*/
}