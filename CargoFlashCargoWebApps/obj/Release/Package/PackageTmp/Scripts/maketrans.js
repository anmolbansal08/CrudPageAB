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
            confirmationMsgOnRemove: 'Are you sure, you wish to remove selected row?',
            beforeAddEventCallback: null,
            addEventCallback: null,
            convertToControl: ConvertToControl,
            removeEventCallback: null,
            maxItemsAllowedToAdd: null,
            maxItemReachedCallback: null,
            searchType: false,
            isReset: false,
            data: [],
            isAdd: true,
            afterConvertMultiField: null,
            IsPopUp: false,
            isRemove: false,
        }, options);

        return this.each(function () {
            var transcss = (options.IsPopUp == "false" ? "btnTrans btnTrans-default" : "btnTrans btnTrans-default");

            var formAction = "";
            if (formAction == "")
                formAction = "NEW";

            if (formAction.toUpperCase() == "NEW" || formAction.toUpperCase() == "EDIT" || formAction.toUpperCase() == "DUPLICATE" || formAction.toUpperCase() == "OPEN") {

                var self = $(this);
                var selfId = $(this).attr("id");
                cfi.ValidateTransSection($(self).closest("div").attr("id"));
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
                        $(this).find("[id^='transAction']").find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");

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
                        $(lastAction).find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");
                    }
                    $(lastTable).find("." + options.removeLinkClass).unbind("click").click(function () {
                        return handleRemove($(this));
                    });

                    if (options.isAdd) {
                        if (options.linkClass != "scheduletransradiocss") {
                            $(lastAction).find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.linkClass + "' title='" + options.linkText + "'></i>");
                            $(lastAction).find("." + options.linkClass).unbind("click").click(function () {
                                if (cfi.IsValidTransSection($(self).closest("div").attr("id"))) {
                                    return handleAdd($(this));
                                }
                            });
                        }
                        else {
                            $(lastTable).find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                                if ($(this).val() == "1") {
                                    if (cfi.IsValidTransSection($(self).closest("div").attr("id"))) {
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
                    }
                    var nn = 1;
                    $(closestDiv).closest("div").find("[id^='areaTrans']").each(function () {
                        $(this).closest("tr").find("td[id^='tdSNoCol']").text(nn);
                        nn++;
                    })

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

                    if (options.isRemove) {
                        $(self).find("[id^='transAction']").find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");

                        $(self).find("." + options.removeLinkClass).unbind("click").click(function () {
                            return handleRemove($(self));
                        });
                    }
                    if (options.isAdd) {
                        if (options.linkClass != "scheduletransradiocss") {
                            $(self).find("#transAction:last").find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.linkClass + "' title='" + options.linkText + "'></i>");
                            $(self).find("." + options.linkClass).unbind("click").click(function () {
                                if (cfi.IsValidTransSection($(self).closest("div").attr("id"))) {
                                    return handleAdd($(this));
                                }
                            });
                        }
                        else {
                            $(self).find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                                if ($(this).val() == "1") {
                                    if (cfi.IsValidTransSection($(self).closest("div").attr("id"))) {
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

                }
                if (options.isReset) {
                    $(self).find("#transAction:first").find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.resetLinkClass + "' title='" + options.resetLinkText + "'></i>");
                    $(self).find("." + options.resetLinkClass).unbind("click").click(function () {
                        ResetTransDetail(self, closestDiv);

                        if ($(self).attr("TotalFieldsAdded") > 0) {
                            var totalCount = 0;
                            $(self).attr("TotalFieldsAdded", totalCount);
                            if (options.isAdd) {
                                $(self).find("#transAction:last").find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.linkClass + "' title='" + options.linkText + "'></i>");

                                $(self).find("." + options.linkClass).unbind("click").click(function () {
                                    if (cfi.IsValidTransSection($(self).closest("div").attr("id"))) {
                                        return handleAdd($(this));
                                    }
                                });
                            }
                        }
                    });
                }
                var myClone = $(self).clone(false);

                if (options.data.length > 0 && options.isAdd) {
                    //debugger
                    if (options.searchType == true) {
                        options.enableRemove = false;
                    }
                    var $curElem = $(self);
                    for (var i = 0; i < options.data.length; i++) {
                        $curElem.find("input,select,textarea").each(function () {
                            if ($(this).attr("type") == "file") {

                            }
                            else {
                                if ($(this).attr("recName") != undefined) {
                                    var itemName = $(this).attr("recName").toLowerCase();
                                    $(this).val(options.data[i][itemName]);
                                }
                            }
                        });
                        $curElem.find("input[data-role='autocomplete']").each(function () {
                            if ($(this).attr("recName") != undefined) {
                                var itemName = $(this).attr("recName").toLowerCase();
                                $(this).data("kendoAutoComplete").value(options.data[i][itemName])
                            }
                        });
                        $curElem.find("input[data-role='datepicker']").each(function () {
                            if ($(this).attr("recName") != undefined) {
                                var itemName = $(this).attr("recName").toLowerCase();
                                $(this).data("kendoDatePicker").value(options.data[i][itemName])
                            }
                        });
                        $curElem.find("span").each(function () {
                            if ($(this).attr("recName") != undefined) {
                                var itemName = $(this).attr("recName").toLowerCase();
                                $(this).text(options.data[i][itemName]);
                            }
                        });
                        $curElem.find("a[id^='ahref_']").each(function () {
                            if ($(this).attr("recName") != undefined) {
                                var itemName = $(this).attr("recName").toLowerCase();
                                $(this).attr("linkdata", options.data[i][itemName]);
                            }
                        });
                        if (options.isAdd) {
                            if (i + 1 < options.data.length) {
                                $curElem.find("." + options.linkClass).trigger("click");
                                $curElem = $curElem.next();
                            }
                        }
                    }
                    if (options.searchType == true) {
                        $(closestDiv).find("[id^='areaTrans']:eq(0)").prev().find("td:last").css("display", "none");
                        $(closestDiv).find("[id^='areaTrans']").find("td:last").each(function () {
                            $(this).css("display", "none");
                        });
                        $(closestDiv).find("[id^='areaTrans']:last").remove();
                    }
                    var nn = 1;
                    $(self).closest("div").find("[id^='areaTrans']").each(function () {
                        $(this).closest("tr").find("td[id^='tdSNoCol']").text(nn);
                        nn++;
                    })

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

                    //alert(options.maxItemsAllowedToAdd + '   ' + totalCount);
                    if (options.maxItemsAllowedToAdd === null || totalCount < options.maxItemsAllowedToAdd) {
                        var newElem = myClone.clone(true);
                        $(newElem).attr("id", $(newElem).attr("id") + "_" + totalCount);
                        $(newElem).find("*[id!=''][name!='']").each(function () {

                            if ($(this).attr("id")) {
                                var strid = $(this).attr("id");
                                var strname = "";
                                var type = $(this).attr("type");

                                //$(this).closest("tr").find("td[id^='tdSNoCol']").text((sno).toString());

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

                                if (($(this).attr("controltype") == "autocomplete") || ($(this).attr("controltype") == "datetype")) {

                                    if ($(this).attr("controltype") == "autocomplete") {
                                        if ($("#" + $(this).attr("id")).closest("span").length != 0)
                                            $(this).attr("style", $("#" + $(this).attr("id")).closest("span")[0].style.cssText);
                                    } else {
                                        //Amit
                                        $(this).attr("style", $("#" + $(this).attr("id")).closest("span")[0].style.cssText).removeClass("k-input");

                                    }
                                }
                                else {
                                    $(this).attr("style", $(this)[0].style.cssText);
                                }


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
                                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");
                            }
                            $(newElem).find("." + options.removeLinkClass).unbind("click").click(function () {
                                return handleRemove($(this));
                            });
                        }

                        $(self).attr("maxCountReached", "false");
                        if (options.isAdd) {
                            if (options.linkClass != "scheduletransradiocss") {
                                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.linkClass + "' title='" + options.linkText + "'></i>");
                                newElem.find("." + options.linkClass).unbind("click").click(function () {
                                    if (cfi.IsValidTransSection($(newElem).closest("div").attr("id"))) {
                                        return handleAdd($(this));
                                    }
                                });
                            }
                            else {
                                $(newElem).find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                                    if ($(this).val() == "1") {
                                        if (cfi.IsValidTransSection($(newElem).closest("div").attr("id"))) {
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
                        }
                        if (options.convertToControl !== null) {
                            options.convertToControl($(newElem), self);
                        }
                        if (options.addEventCallback !== null) {
                            options.addEventCallback($(newElem), self);
                        }
                        var nn = 1;
                        $(newElem).closest("div").find("[id^='areaTrans']").each(function () {
                            $(this).closest("tr").find("td[id^='tdSNoCol']").text(nn);
                            nn++;
                        })
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
                        if (options.isRemove) {
                            //totalCount--;
                        }
                        else
                            totalCount--;

                        $(self).attr("TotalFieldsAdded", totalCount);

                        if ($(elem).closest("[id^='areaTrans']").find("." + options.linkClass).length >= 0) {
                            if (options.enableRemove && $(self).attr("uniqueId") != $(prevParent).attr("uniqueId")) {
                                if ($(prevParent).find("." + options.removeLinkClass).length === 0) {
                                    $(prevParent).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");
                                }

                                $(prevParent).find("." + options.removeLinkClass).unbind("click").click(function () {
                                    return handleRemove($(this));
                                });
                            }

                            $(elem).closest("[id^='areaTrans']").remove();
                            $(prevParent).closest("div").find("." + options.linkClass).remove();
                            if (options.linkClass != "scheduletransradiocss") {
                                $(prevParent).closest("div").find("td[id^='transAction']:last").find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.linkClass + "' title='" + options.linkText + "'></i>");
                            }
                            var idCount = 0;
                            var parentID = $(prevParent).closest("div").find("[id^='areaTrans']:eq(0)").attr("id");
                            $(prevParent).closest("div").find("[id^='areaTrans']:gt(0)").each(function () {
                                $(this).attr("id", parentID + "_" + idCount);
                                //sno = parseInt($(this).closest("tr").find("td[id^='tdSNoCol']").text()) + 1
                                $(this).find("*[id!=''][name!='']").each(function () {

                                    if ($(this).attr("id")) {
                                        var strid = $(this).attr("id");
                                        var strname = "";

                                        // alert($(this).prev("tr").find("td[id^='tdSNoCol']").text((sno).toString()));
                                        // alert($(this).prev("tr").find("td[id^='tdSNoCol']").text());
                                        //$(this).closest("tr").find("td[id^='tdSNoCol']").text((sno).toString());
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
                                        if ($(this).attr("class") != "k-icon k-delete")
                                            $(this).attr("id", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                                        if (strname != undefined)
                                            if ($(this).attr("class") != "k-icon k-delete")
                                                $(this).attr("name", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                                    }

                                });
                                idCount++;

                            });
                            if (options.linkClass != "scheduletransradiocss") {
                                $(prevParent).closest("div").find("td[id^='transAction']:last").find("." + options.linkClass).unbind("click").click(function () {
                                    if (cfi.IsValidTransSection($(prevParent).closest("div").attr("id"))) {
                                        return handleAdd($(this));
                                    }
                                });
                            }
                            else {
                                $(prevParent).closest("div").find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                                    if ($(this).val() == "1") {
                                        if (cfi.IsValidTransSection($(prevParent).closest("div").attr("id"))) {
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

                        //AMIT
                        $(prevParent).find("input[type='text']").each(function () {
                            if (($(this).attr("controltype") == "autocomplete") || ($(this).attr("controltype") == "datetype")) {
                                if ($(this).attr("controltype") == "autocomplete") {
                                    $(this).attr("style", $("#" + $(this).attr("id")).closest("span")[0].style.cssText);
                                } else {
                                    $(this).attr("style", $("#" + $(this).attr("id")).closest("span")[0].style.cssText).removeClass("k-input");
                                }
                            }
                            else {
                                $(this).attr("style", $(this)[0].style.cssText);
                            }
                        });

                        var nn = 1;

                        $(prevParent).closest("div").find("[id^='areaTrans']").each(function () {
                            $(this).closest("tr").find("td[id^='tdSNoCol']").text(nn);
                            nn++;
                        })


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
        var controlId = $(this).attr("id");

        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
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
                    if (controltype == "autocomplete")
                        hdnKeyIdValue = (i == 0 ? "" : hdnKeyIdValue + "~") + $("#" + $(this).attr("id").replace(/Text_/gi, "")).val();
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
function PopulateMakeTransMultiSelect(id) {
    $("tr[id^='areaTrans_" + id + "']").find("input[controltype='autocomplete']").each(function () {
        var id = $(this).attr("id").replace('Text_', '');
        var lbl = "<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + $(this).val() + "</span><span onclick='DeleteMutiSpan(this);' id='" + $("#" + id).val() + "' class='k-icon k-delete'></span></li>";
        var divul = $(this).closest("td").find("div[id^='divMulti'] ul");
        $("#Multi_" + id).val($("#" + id).val());
        $("#divMulti" + id).show();
        $("#FieldKeyValues" + id).text($("#" + id).val())
        divul.append(lbl);
        $(this).val("");
    });
}

function DeleteMutiSpan(obj) {
    //debugger
    var lControlName = $(obj).closest("div").attr("id").replace('divMulti', '');
    var val = $("#FieldKeyValues" + lControlName).text();
    $(obj).parent().remove();
    if ($("div[id='divMulti" + lControlName + "']").find("span[name^='FieldKeyValues" + lControlName + "']").text().indexOf($(obj).attr("id") + ",") > -1) {
        var ll = $("div[id='divMulti" + lControlName + "']").find("span[name^='FieldKeyValues" + lControlName + "']").text().replace($(obj).attr("id") + ",", '');
        $("div[id='divMulti" + lControlName + "']").find("span[name^='FieldKeyValues" + lControlName + "']").text(ll);
        $("div[id='divMulti" + lControlName + "']").find("input:hidden[name^='Multi_" + lControlName + "']").val(ll);
    }
    else {
        var l = $("div[id='divMulti" + lControlName + "']").find("span[name^='FieldKeyValues" + lControlName + "']").text().replace($(obj).attr("id"), '');
        $("div[id='divMulti" + lControlName + "']").find("span[name^='FieldKeyValues" + lControlName + "']").text(l);
        $("div[id='divMulti" + lControlName + "']").find("input:hidden[name^='Multi_" + lControlName + "']").val(l);

        if ($("#" + lControlName).val() != "" || $("#" + lControlName).val() != undefined)
            $("#" + lControlName).val(l);

        if ($("#" + lControlName).val() == "")
            $("#divMulti" + lControlName).hide();
    }
}