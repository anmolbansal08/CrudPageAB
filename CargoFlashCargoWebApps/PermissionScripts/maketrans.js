/// <reference path="../Scripts/common.js" />

(function ($) {
    $.fn.EnableMultiField = function (options) {
        options = $.extend({
            linkText: 'Add more',
            linkClass: 'icon-trans-plus-sign',
            resetLinkText: 'Reset',
            resetLinkClass: 'icon-trans-refresh',
            enableRemove: true,
            removeLinkText: 'Delete',
            removeLinkClass: 'icon-trans-trash',
            confirmOnRemove: true,
            confirmationMsgOnRemove: 'Are you sure you wish to remove selected row?',
            beforeAddEventCallback: null,
            addEventCallback: null,
            convertToControl: ConvertToControl,
            removeEventCallback: null,
            maxItemsAllowedToAdd: null,
            maxItemReachedCallback: null,
            searchType: false,
            isReset: false,
            data: [],
            afterConvertMultiField: null
        }, options);

        return this.each(function () {
            var formAction = getQueryStringValue("FormAction");
            if (formAction.toUpperCase() == "NEW" || formAction.toUpperCase() == "EDIT" || formAction.toUpperCase() == "DUPLICATE" || formAction.toUpperCase() == "OPEN") {
                var self = $(this);
                var selfId = $(this).attr("id");
                cfi.ValidateSection($(self).closest("div").attr("id"));
                var addedCount = $(self).closest("div").find("#transAction").length;

                var closestDiv = $(self).closest("div");
                if (addedCount > 1) {

                    var idCount = 0;
                    var lastTable = $(closestDiv).find("[id^='areaTrans']:last");
                    var lastAction = $(lastTable).find("[id^='transAction']");
                    $(closestDiv).find("[id^='areaTrans']").find("*[id!=''][name!='']").each(function () {
                        if ($(this).attr("id") != undefined && $(this).attr("name") != undefined)
                            $(this).addClass("transSection");
                    });
                    $(closestDiv).find("[id^='areaTrans']").find("[id^='transAction']").addClass("actionwidth");
                    $(closestDiv).find("[id^='areaTrans']").find("[id^='tdSNoCol']").addClass("snowidth");
                    $(closestDiv).find("[id^='areaTrans']:eq(0)").find("input[type='radio']").each(function () {
                        if ($(this).context.defaultChecked) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    $(closestDiv).find("[id^='areaTrans']:gt(0)").each(function () {
                        $(this).attr("id", selfId + "_" + idCount);
                        $(this).attr("TotalFieldsAdded", "0");

                        $(this).attr("maxCountReached", "false");

                        $(this).attr("FieldCount", "0");

                        $(this).attr("uniqueId", options.linkClass + Math.random());

                        $(this).find("." + options.linkClass).remove();

                        $(this).find("." + options.removeLinkClass).remove();
                        $(this).find("[id^='transAction']").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");

                        $(this).find("." + options.removeLinkClass).unbind("click").click(function () {
                            return handleRemove($(this));
                        });
                        $(this).find("*[id!=''][name!='']").each(function () {
                            if ($(this).attr("id")) {
                                var strid = $(this).attr("id");
                                var strname = "";

                                if ($(this).attr("name")) {
                                    strname = $(this).attr("name");
                                }
                                var type = $(this).attr("type")
                                $(this).attr("id", strid + "_" + idCount);
                                if (strname != undefined)
                                    $(this).attr("name", strid + "_" + idCount);
                                //                                var type = $(this).attr("type")
                                if (type == "radio") {
                                    if ($(this).context.defaultChecked) {
                                        $(this).attr("checked", "checked");
                                    }
                                }
                            }
                        });
                        idCount++;
                    });
                    $(closestDiv).find("[id^='areaTrans']").find("*[id!=''][name!='']").each(function () {
                        if ($(this).attr("id") != undefined && $(this).attr("name") != undefined)
                            $(this).addClass("transSection");
                    });
                    $(closestDiv).find("[id^='areaTrans']").find("[id^='transAction']").addClass("actionwidth");
                    $(closestDiv).find("[id^='areaTrans']").find("[id^='tdSNoCol']").addClass("snowidth");
                    $(closestDiv).find("[id^='areaTrans']").each(function () {
                        if (options.convertToControl !== null) {
                            options.convertToControl($(this), self);
                        }
                    });
                    $(closestDiv).find("[id^='areaTrans']").each(function () {
                        if (options.afterConvertMultiField !== null) {
                            options.afterConvertMultiField($(this), self);
                        }
                    });
                    $(closestDiv).find("[id^='areaTrans']:eq(0)").attr("TotalFieldsAdded", (addedCount > 1 ? (addedCount - 1).toString() : "0"));

                    $(closestDiv).find("[id^='areaTrans']:eq(0)").attr("maxCountReached", "false");

                    $(closestDiv).find("[id^='areaTrans']:eq(0)").attr("FieldCount", (addedCount > 1 ? (addedCount - 1).toString() : "0"));

                    $(closestDiv).find("[id^='areaTrans']:eq(0)").attr("uniqueId", options.linkClass + Math.random());

                    if ($(lastTable).find("." + options.removeLinkClass).length === 0) {
                        $(lastAction).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");
                    }
                    $(lastTable).find("." + options.removeLinkClass).unbind("click").click(function () {
                        return handleRemove($(this));
                    });

                    if (options.linkClass != "scheduletransradiocss") {
                        $(lastAction).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.linkClass + "' title='" + options.linkText + "'></i>");

                        $(lastAction).find("." + options.linkClass).unbind("click").click(function () {
                            if (cfi.IsValidSection($(self).closest("div").attr("id"))) {
                                return handleAdd($(this));
                            }
                        });
                    }
                    else {
                        $(lastTable).find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                            if ($(this).val() == "1") {
                                if (cfi.IsValidSection($(self).closest("div").attr("id"))) {
                                    return handleAdd($(this));
                                }
                                else {
                                    $(lastTable).find("input[type='radio']." + options.linkClass.replace("css", "")).each(function () {
                                        $(this).removeAttr("checked");
                                        if ($(this).val() == "0") {
                                            $(this).attr("checked", true);
                                        }
                                    });
                                }
                            }
                        });
                    }
                    //re-initialize autocomplete
                }
                else {
                    $(closestDiv).find("[id^='areaTrans']:eq(0)").find("*[id!=''][name!='']").each(function () {
                        if ($(this).attr("id") != undefined && $(this).attr("name") != undefined) {
                            $(this).addClass("transSection");
                        }
                    });
                    $(closestDiv).find("[id^='areaTrans']").find("[id^='transAction']").addClass("actionwidth");
                    $(closestDiv).find("[id^='areaTrans']").find("[id^='tdSNoCol']").addClass("snowidth");
                    $(self).attr("TotalFieldsAdded", (addedCount > 1 ? (addedCount - 1).toString() : "0"));

                    $(self).attr("maxCountReached", "false");

                    $(self).attr("FieldCount", (addedCount > 1 ? (addedCount - 1).toString() : "0"));

                    $(self).attr("uniqueId", options.linkClass + Math.random());

                    $(self).find("." + options.linkClass).remove();

                    $(self).find("." + options.removeLinkClass).remove();
                    ///manish
                    if (options.linkClass != "scheduletransradiocss") {
                        $(self).find("#transAction:last").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.linkClass + "' title='" + options.linkText + "'></i>");

                        $(self).find("." + options.linkClass).unbind("click").click(function () {
                            if (cfi.IsValidSection($(self).closest("div").attr("id"))) {
                                return handleAdd($(this));
                            }
                        });
                    }
                    else {
                        $(self).find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                            if ($(this).val() == "1") {
                                if (cfi.IsValidSection($(self).closest("div").attr("id"))) {
                                    return handleAdd($(this));
                                }
                                else {
                                    $(self).find("input[type='radio']." + options.linkClass.replace("css", "")).each(function () {
                                        $(this).removeAttr("checked");
                                        if ($(this).val() == "0") {
                                            $(this).attr("checked", true);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                if (options.isReset) {
                    $(self).find("#transAction:first").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.resetLinkClass + "' title='" + options.resetLinkText + "'></i>");
                    $(self).find("." + options.resetLinkClass).unbind("click").click(function () {
                        ResetTransDetail(self, closestDiv);

                        if ($(self).attr("TotalFieldsAdded") > 0) {
                            var totalCount = 0;
                            $(self).attr("TotalFieldsAdded", totalCount);
                            $(self).find("#transAction:last").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.linkClass + "' title='" + options.linkText + "'></i>");

                            $(self).find("." + options.linkClass).unbind("click").click(function () {
                                if (cfi.IsValidSection($(self).closest("div").attr("id"))) {
                                    return handleAdd($(this));
                                }
                            });
                        }
                    });
                }
                var myClone = $(self).clone(false);

                if (options.data.length > 0) {
                    if (options.searchType == true) {
                        options.enableRemove = false;
                    }
                    var $curElem = $(self);
                    for (var i = 0; i < options.data.length; i++) {
                        $curElem.find("input,select,textarea").each(function () {
                            var itemName = $(this).attr("recName");
                            $(this).val(options.data[i][itemName]);
                        });
                        $curElem.find("span").each(function () {
                            var itemName = $(this).attr("recName");
                            $(this).text(options.data[i][itemName]);
                        });
                        $curElem.find("." + options.linkClass).trigger("click");
                        $curElem = $curElem.next();
                    }
                    if (options.searchType == true) {
                        $(closestDiv).find("[id^='areaTrans']:eq(0)").prev().find("td:last").css("display", "none");
                        $(closestDiv).find("[id^='areaTrans']").find("td:last").each(function () {
                            $(this).css("display", "none");
                        });
                        $(closestDiv).find("[id^='areaTrans']:last").remove();
                    }
                }

                function handleAdd(elem) {
                    if (options.beforeAddEventCallback !== null) {
                        var retVal = options.beforeAddEventCallback(elem.closest("[id^='areaTrans_']"));
                        if (!retVal) {
                            return false;
                        }
                    }

                    var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
                    var fieldCount = parseInt($(self).attr("FieldCount"), 10);
                    if (options.maxItemsAllowedToAdd === null || totalCount < options.maxItemsAllowedToAdd) {
                        var newElem = myClone.clone(true);
                        $(newElem).attr("id", $(newElem).attr("id") + "_" + totalCount);
                        $(newElem).find("*[id!=''][name!='']").each(function () {
                            if ($(this).attr("id")) {
                                var strid = $(this).attr("id");
                                var strname = "";
                                var type = $(this).attr("type");
                                $(this).closest("tr").find("td[id^='tdSNoCol']").text((totalCount + 2).toString());
                                if ($(this).attr("name")) {
                                    strname = $(this).attr("name");
                                }
                                if ($(this).attr("controltype") == "datetype") {
                                    if ($(this).attr("endcontrol") != undefined) {
                                        $(this).attr("endcontrol", $(this).attr("endcontrol") + "_" + totalCount)
                                    }
                                    if ($(this).attr("startcontrol") != undefined) {
                                        $(this).attr("startcontrol", $(this).attr("startcontrol") + "_" + totalCount)
                                    }
                                }

                                //                                if (($(this).attr("controltype") == "autocomplete") || ($(this).attr("controltype") == "datetype")) {
                                //                                    $(this).attr("style", $(this).closest("span")[0].style.cssText); 
                                //                                }
                                //                                else { 
                                //                                        $(this).attr("style", $(this)[0].style.cssText);
                                //                                }

                                $(this).attr("id", strid + "_" + totalCount);
                                if (strname != undefined)
                                    $(this).attr("name", strname + "_" + totalCount);
                                if (type != "radio" && type != "checkbox")
                                    $(this).val("");
                                if (type == "checkbox")
                                    $(this).attr("validatename", strid + "_" + totalCount + "[]");
                            }
                        });
                        totalCount++;
                        fieldCount++;

                        $(self).attr("TotalFieldsAdded", totalCount);
                        $(self).attr("FieldCount", fieldCount);

                        $(newElem).removeAttr("uniqueId");

                        if (options.enableRemove && $(self).attr("uniqueId") != $(elem).closest("[id^='areaTrans']").attr("uniqueId")) {
                            if ($(elem).closest("[id^='areaTrans']").find("." + options.removeLinkClass).length === 0) {
                                $(elem).closest("[id^='areaTrans']").find("#transAction").append(" <input type='button' class='" + options.removeLinkClass + "'value='" + options.removeLinkText + "'/>");
                            }
                            $(elem).closest("[id^='areaTrans']").find("." + options.removeLinkClass).unbind("click").click(function () {
                                return handleRemove($(this));
                            });
                        }

                        $(newElem).attr("uniqueId", options.linkClass + Math.random());
                        //$(elem).parent().after(newElem);
                        $(elem).closest("[id^='areaTrans']").after(newElem);

                        $(elem).closest("[id^='areaTrans']").find("." + options.linkClass).remove();

                        $(newElem).find("." + options.resetLinkClass).remove();
                        $(newElem).find("." + options.linkClass).remove();
                        $(newElem).find("." + options.removeLinkClass).remove();

                        if (options.enableRemove) {
                            if ($(newElem).find("." + options.removeLinkClass).length === 0) {
                                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");
                            }
                            $(newElem).find("." + options.removeLinkClass).unbind("click").click(function () {
                                return handleRemove($(this));
                            });
                        }

                        $(self).attr("maxCountReached", "false");
                        if (options.linkClass != "scheduletransradiocss") {
                            $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.linkClass + "' title='" + options.linkText + "'></i>");
                            newElem.find("." + options.linkClass).unbind("click").click(function () {
                                if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                                    return handleAdd($(this));
                                }
                            });
                        }
                        else {
                            $(newElem).find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                                if ($(this).val() == "1") {
                                    if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                                        return handleAdd($(this));
                                    }
                                    else {
                                        $(newElem).find("input[type='radio']." + options.linkClass.replace("css", "")).each(function () {
                                            $(this).removeAttr("checked");
                                            if ($(this).val() == "0") {
                                                $(this).attr("checked", true);
                                            }
                                        });
                                    }
                                }
                            });
                        }

                        if (options.convertToControl !== null) {
                            options.convertToControl($(newElem), self);
                        }
                        if (options.addEventCallback !== null) {
                            options.addEventCallback($(newElem), self);
                        }
                    }

                    if (options.maxItemsAllowedToAdd !== null && totalCount >= options.maxItemsAllowedToAdd) {
                        newElem.find("." + options.linkClass).hide();

                        if (options.maxItemReachedCallback !== null) {
                            options.maxItemReachedCallback($(newElem), self);
                        }
                    }
                    return true;
                }

                function handleRemove(elem) {
                    var cnt = true;

                    if (options.confirmOnRemove) {
                        cnt = confirm(options.confirmationMsgOnRemove);
                    }
                    if (cnt) {
                        var prevParent = $(elem).closest("[id^='areaTrans']").prev();

                        var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
                        totalCount--;

                        $(self).attr("TotalFieldsAdded", totalCount);

                        if ($(elem).closest("[id^='areaTrans']").find("." + options.linkClass).length >= 0) {
                            if (options.enableRemove && $(self).attr("uniqueId") != $(prevParent).attr("uniqueId")) {
                                if ($(prevParent).find("." + options.removeLinkClass).length === 0) {
                                    $(prevParent).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");
                                }

                                $(prevParent).find("." + options.removeLinkClass).unbind("click").click(function () {
                                    return handleRemove($(this));
                                });
                            }

                            $(elem).closest("[id^='areaTrans']").remove();
                            $(prevParent).closest("div").find("." + options.linkClass).remove();
                            if (options.linkClass != "scheduletransradiocss") {
                                $(prevParent).closest("div").find("td[id^='transAction']:last").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + options.linkClass + "' title='" + options.linkText + "'></i>");
                            }
                            var idCount = 0;
                            var parentID = $(prevParent).closest("div").find("[id^='areaTrans']:eq(0)").attr("id");
                            $(prevParent).closest("div").find("[id^='areaTrans']:gt(0)").each(function () {
                                $(this).attr("id", parentID + "_" + idCount);
                                $(this).find("*[id!=''][name!='']").each(function () {
                                    if ($(this).attr("id")) {
                                        var strid = $(this).attr("id");
                                        var strname = "";
                                        $(this).closest("tr").find("td[id^='tdSNoCol']").text((idCount + 2).toString());
                                        if ($(this).attr("name")) {
                                            strname = $(this).attr("name");
                                        }

                                        if ($(this).attr("controltype") == "datetype") {
                                            var EndControl = $(this).attr("endcontrol");

                                            var StartControl = $(this).attr("startcontrol");
                                            if (EndControl != undefined) {
                                                $(this).attr("endcontrol", EndControl.substr(0, EndControl.lastIndexOf('_')) + "_" + idCount)
                                            }
                                            if (StartControl != undefined) {
                                                $(this).attr("startcontrol", StartControl.substr(0, StartControl.lastIndexOf('_')) + "_" + idCount)
                                            }
                                        }
                                        $(this).attr("id", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                                        if (strname != undefined)
                                            $(this).attr("name", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                                    }
                                });
                                idCount++;
                            });
                            if (options.linkClass != "scheduletransradiocss") {
                                $(prevParent).closest("div").find("td[id^='transAction']:last").find("." + options.linkClass).unbind("click").click(function () {
                                    if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                                        return handleAdd($(this));
                                    }
                                });
                            }
                            else {
                                $(prevParent).closest("div").find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                                    if ($(this).val() == "1") {
                                        if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                                            return handleAdd($(this));
                                        }
                                        else {
                                            $(prevParent).closest("div").find("input[type='radio']." + options.linkClass.replace("css", "")).each(function () {
                                                $(this).removeAttr("checked");
                                                if ($(this).val() == "0") {
                                                    $(this).attr("checked", true);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }

                        if (options.maxItemsAllowedToAdd !== null && totalCount < options.maxItemsAllowedToAdd) {
                            $(self).siblings().find("." + options.linkClass).show();
                        }

                        if (options.convertToControl !== null) {
                            options.convertToControl($(prevParent), self);
                        }
                        if (options.removeEventCallback !== null) {
                            options.removeEventCallback($(prevParent), self);
                        }

                    }
                    return true;
                }
            }
        });
    };
})(jQuery);

function ConvertToControl(objId) {

    $(objId).find("input[type='text']").each(function () {
        var width = $(this).parent()[0].style.cssText == "" ? $(this).parent().find("input[type='text']")[0].style.cssText : $(this).parent()[0].style.cssText;
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
            $(this).attr("style", width);
        }

    });

    $(objId).find("span").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidSpanNumeric(controlId);
        if (decimalPosition >= -1) {
            cfi.Numeric(controlId, decimalPosition, true);
        }
    });
    $(objId).find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            cfi.AlphabetTextBox(controlId, alphabetstyle);
        }
    });
    SetDateRangeValue(objId);
}

function MakeTransDetailsData() {
    var re = "";
    $("div[id^='divareaTrans_']").each(function () {
        var hdnKeyId = $(this).find("input[type='hidden'][id^='valueareaTrans_']");
        hdnKeyId.val("");
        $(this).find("[id^='areaTrans_']").each(function () {
            var hdnKeyIdValue = "";
            var i = 0;
            var prevControlName = "";
            $(this).find(".transSection").each(function (index) {
                var controltype = $(this).attr("controltype");
                var type = $(this).attr("type");
                if (typeof controltype !== 'undefined' && controltype !== false) {
                    if (controltype == "autocomplete") {
                        if ($(this).val() == "+" || $(this).val() == "-")
                            hdnKeyIdValue = (i == 0 ? "" : hdnKeyIdValue + "~") + $(this).val();
                        else
                            hdnKeyIdValue = (i == 0 ? "" : hdnKeyIdValue + "~") + $("#" + $(this).attr("id").replace(/Text_/gi, "")).val();
                    }
                    else
                        hdnKeyIdValue = (i == 0 ? "" : hdnKeyIdValue + "~") + $(this).val();
                    i++;
                }
                else if (controltype == undefined && type == "radio") {
                    if ($(this).attr("checked") == "checked") {
                        hdnKeyIdValue = (i == 0 ? "" : hdnKeyIdValue + "~") + $(this).val();
                        i++;
                    }
                }
                else if (controltype == undefined && type == "checkbox") {
                    if (prevControlName != $(this).attr("name")) {
                        prevControlName = $(this).attr("name");
                        var checkedValue = "";
                        $("input[name='" + prevControlName + "']").each(function () {
                            if ($(this).attr("checked")) {
                                checkedValue = (checkedValue == "" ? "" : checkedValue + ",") + $(this).val();
                            }
                        });
                        hdnKeyIdValue = (i == 0 ? "" : hdnKeyIdValue + "~") + checkedValue;
                        i++;
                    }
                }
            });
            hdnKeyId.val((hdnKeyId.val() == "" ? "" : hdnKeyId.val() + "^") + hdnKeyIdValue);
        });
    });
}
