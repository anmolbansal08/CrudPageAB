(function ($, undefined) {
    var kendo = window.kendo,
        keys = kendo.keys,
        ui = kendo.ui,
        Widget = ui.Widget,
        placeholderSupported = kendo.support.placeholder,
        touch = kendo.support.touch,
        getCulture = kendo.getCulture,
        CHANGE = "change",
        INPUT = "k-input",
        TYPE = touch ? "number" : "text",
        NULL = null,
        proxy = $.proxy;

    var AlphabetTextBox = Widget.extend(/** @lends kendo.ui.NumericTextBox.prototype */{
    init: function (element, options) {
        var that = this,
             textTransform = options.textTransform,
             textType = options.textType,
             allowChar = (textType.toLowerCase() == "ip" ? "." : (textType.toLowerCase() == "time" ? ":" : options.allowChar)),
             value = options && options[value] !== undefined;

        Widget.fn.init.call(that, element, options);

        if (textType == "ip") {
            options.allowChar = ".";
            that.element.attr("maxLength", "15");
        }
        else if (textType == "time") {
            options.allowChar = (options.allowChar != undefined && options.allowChar != "" ? ":" : "");
            that.element.attr("maxLength", (options.allowChar != undefined && options.allowChar != "" ? "5" : "4")).css("width", "40px");
        }
        options = that.options;
        element = that.element.addClass(INPUT).css("text-transform", textTransform).attr("autocomplete", "off")
                           .bind({
                               keypress: proxy(that._keypress, that),
                               paste: proxy(that._paste, that),
                               blur: proxy(that._blur, that),
                               change: proxy(that._removeWhiteSpace, that)
                           });

        element.closest("form")
                    .bind("reset", function () {
                        setTimeout(function () {
                            that.value(element[0].value);
                        });
                    });

        //$("<span id='spn'/>").insertAfter(element)
        options.placeholder = options.placeholder || element.attr("placeholder");
        kendo.notify(that);
    },

    options: {
        name: "AlphabetTextBox",
        textTransform: "none",
        allowChar: " ",
        textType: "default",
        value: NULL,
        placeholder: "",
        allNumericChar: "1234567890"
    },
    events: [
            CHANGE
        ],
    value: function (value) {
        var that = this, adjusted;
        that._text.css('color', 'black');

        if (value === undefined) {
            return that._value;
        }

        adjusted = that._adjust(value);

        if (value !== adjusted) {
            that._text.val(that.options.placeholder);
            that._text.css('color', 'gray');
            return;
        }

        that._old = that._value;
    },

    _blur: function () {
        var that = this,
                element = that.element[0],
                value = element.value,
                options = that.options,
                allowedChar = options.allowChar,
                textType = options.textType,
                ipTimeAllowedChar = (textType.toLowerCase() == "ip" ? "." : (textType.toLowerCase() == "time" ? allowedChar : "")),
                prevent = true,
                end;

        if (textType.toLowerCase() == "ip" || textType.toLowerCase() == "time") {
            var valueArr = value.split(ipTimeAllowedChar);
            if (textType.toLowerCase() == "ip") {
                var modifiedIp = "";
                if (value != "") {
                    for (var i = 0; i < 4; i++) {
                        if (valueArr.length >= i + 1) {
                            if (parseInt(valueArr[i]) > 255) {
                                modifiedIp = (modifiedIp == "" ? "" : modifiedIp + ".") + "255";
                            }
                            else {
                                modifiedIp = (modifiedIp == "" ? "" : modifiedIp + ".") + (valueArr[i] == "" ? "255" : valueArr[i]);
                            }
                        }
                        else
                            modifiedIp = (modifiedIp == "" ? "" : modifiedIp + ".") + "255";
                    }
                }
                that.element.val(modifiedIp);
            }
            else if (textType.toLowerCase() == "time") {
                var modifiedTime = "";
                if (ipTimeAllowedChar != "") {
                    for (var i = 0; i < 2; i++) {
                        if (valueArr.length >= i + 1) {
                            if (parseInt(valueArr[i]) > (i == 0 ? 23 : 59)) {
                                modifiedTime = (modifiedTime == "" ? "" : modifiedTime + ipTimeAllowedChar) + ((i == 0 ? 23 : 59).toString().length == 1 ? "0" : "") + (i == 0 ? 23 : 59).toString();
                            }
                            else {
                                modifiedTime = (modifiedTime == "" ? "" : modifiedTime + ipTimeAllowedChar) + (valueArr[i] == "" ? "00" : (valueArr[i].length == 1 ? "0" : "") + valueArr[i]);
                            }
                        }
                        else
                            modifiedTime = (modifiedTime == "" ? "" : modifiedTime + ipTimeAllowedChar) + "00";
                    }
                }
                else {
                    if (value.length < 2) {
                        modifiedTime = "0" + value + "00";
                    }
                    else if (value.length == 2) {
                        modifiedTime = (parseInt(value) > 23 ? "2300" : value + "00");
                    }
                    else if (value.length == 3) {
                        modifiedTime = (parseInt(value.substr(0, 2)) > 23 ? "23" : value.substr(0, 2)) + "0" + value.substr(2, 1);
                    }
                    else if (value.length == 4) {
                        modifiedTime = (parseInt(value.substr(0, 2)) > 23 ? "23" : value.substr(0, 2)) + (parseInt(value.substr(2, 2)) > 59 ? "59" : value.substr(2, 2));
                    }
                    else {
                        modifiedTime = "";
                    }
                }
                element.value = modifiedTime;
                prevent = !(valueArr.length <= 2 && valueArr[valueArr.length - 1] != "");
            }
        }
    },

    _culture: function (culture) {
        return culture || getCulture(this.options.culture);
    },

    _keypress: function (e) {
        var that = this,
                options = that.options,
                key = (e.keyCode ? e.keyCode : e.which),
                textType = options.textType,
                charCode = "";

        if (e.keyCode != 0) charCode = String.fromCharCode(e.keyCode);
        else charCode = String.fromCharCode(e.charCode);

        //                $('#spn').text($('#spn').text() + e.which);
        if (textType.toLowerCase() == "ip" || textType.toLowerCase() == "time") {
            if (key == 32) {
                e.preventDefault();
                return;
            }
            if (jQuery.browser.mozilla == true) {
                if (e.which == 0 && (key == 46 || key == 9)) {
                }
                else if (key != 8 && !(key >= 33 && key <= 40 && e.which == 0) && that._prevent(key, charCode) && !e.ctrlKey) {
                    e.preventDefault();
                }
            }
            else if (that._prevent(key, charCode) && !e.ctrlKey) {
                e.preventDefault();
            }
        }
        else {
            if (jQuery.browser.mozilla == true) {
                if (e.which == 0 && (key == 46 || key == 9)) {
                }
                else if (key != 32 && key != 8 && !(key >= 33 && key <= 40 && e.which == 0) && that._prevent(key, charCode) && !e.ctrlKey) {
                    e.preventDefault();
                }
            }
            else if (key != 32 && that._prevent(key, charCode) && !e.ctrlKey) {
                e.preventDefault();
            }
        }
    },

    _paste: function (e) {
        var that = this,
                element = e.target,
                value = element.value;

        setTimeout(function () {
            alert(element.value);
        });
    },

    _prevent: function (key, char) {
        var that = this,
                element = that.element[0],
                value = element.value,
                options = that.options,
                allowedChar = options.allowChar,
                textType = options.textType,
                prevent = true,
                ipTimeAllowedChar = (textType.toLowerCase() == "ip" ? "." : (textType.toLowerCase() == "time" ? allowedChar : "")),
                end;
        if (textType.toLowerCase() == "ip" || textType.toLowerCase() == "time") {
            if (value != "" && ipTimeAllowedChar.indexOf(char) >= 0) {
                var valueArr = value.split(ipTimeAllowedChar);
                if (textType.toLowerCase() == "ip") {
                    var modifiedIp = "";
                    for (var i = 0; i < valueArr.length; i++) {
                        if (parseInt(valueArr[i]) > 255) {
                            modifiedIp = (modifiedIp == "" ? "" : modifiedIp + ".") + "255";
                        }
                        else {
                            modifiedIp = (modifiedIp == "" ? "" : modifiedIp + ".") + valueArr[i];
                        }
                    }
                    element.value = modifiedIp;
                    prevent = !(valueArr.length <= 3 && valueArr[valueArr.length - 1] != "");
                }
                else if (textType.toLowerCase() == "time") {
                    var modifiedTime = "";
                    for (var i = 0; i < valueArr.length; i++) {
                        if (parseInt(valueArr[i]) > (i == 0 ? 23 : 59)) {
                            modifiedTime = (modifiedTime == "" ? "" : modifiedTime + ":") + ((i == 0 ? 23 : 59).toString().length == 1 ? "0" : "") + (i == 0 ? 23 : 59).toString();
                        }
                        else {
                            modifiedTime = (modifiedTime == "" ? "" : modifiedTime + ":") + (valueArr[i].length == 1 ? "0" : "") + valueArr[i];
                        }
                    }
                    element.value = modifiedTime;
                    prevent = !(valueArr.length <= 2 && valueArr[valueArr.length - 1] != "");
                }
            }
        }
        else {
            if (allowedChar.indexOf(char) >= 0) {
                prevent = false;
            }
        }
        if (prevent) {
            if (textType.toLowerCase() == "ip" || textType.toLowerCase() == "time") {
                if (options.allNumericChar.indexOf(char) >= 0) {
                    prevent = false;
                }
            }
            else if (textType.toLowerCase() == "default") {
                prevent = false;
            }
            else if ((key >= 65 && key <= 90) || (key >= 97 && key < 123)) {
                prevent = false;
            }
        }

        if (prevent && textType.toLowerCase().indexOf("alphanumeric") >= 0) {
            if (options.allNumericChar.indexOf(char) >= 0) {
                prevent = false;
            }
        }

        return prevent;
    },

    _placeholder: function (value) {
        this._text.val(value);
        if (!placeholderSupported && !value) {
            this._text.val(this.options.placeholder);
        }
    },

    _removeWhiteSpace: function (e) {
        var that = this,
        element = e.target,
        value = element.value;
        value = value.replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n +/, "\n");
        element.value = value;
    }



});
ui.plugin(AlphabetTextBox);
})(jQuery);
