﻿/*!
* jQuery appendGrid v1.3.2
* https://appendgrid.apphb.com/
*
* Copyright 2014 Albert L.
* Dual licensed under the LGPL (http://www.gnu.org/licenses/lgpl.html)
* and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
*
* Depends:
* jQuery v1.9.1+
* jquery UI v1.10.2+
*/
//-----  added by Anand  --------------------------------------------------------------------------------------------
var settings = null, totalRows = null, pages = null, isDataLoad = false;
var updatedRows = new Array();
//-------------------------------------------------------------------------------------------------------------------
(function ($) {
    // The default initial options.
    var _defaultInitOptions = {
        //-----  added by Anand  --------------------------------------------------------------------------------------------
        tableID: null,
        tableColumns: null,
        masterTableSNo: null,
        currentPage: null,
        itemsPerPage: null,
        whereCondition: null,
        sort: null,
        servicePath: null,
        getRecordServiceMethod: null,
        createUpdateServiceMethod: null,
        deleteServiceMethod: null,
        rowUpdateExtraFunction: null,
        allUpdateExtraFunction:null,
        // Adding paging option in Caption row
        isPaging: null,
        // Adding row filter option in Caption row
        isFilter: null,
        contentEditable: true,
        rowNumColumnName:null,
        //-------------------------------------------------------------------------------------------------------------------

        // The text as table caption, set null to disable caption generation.
        caption: null,
        // The total number of empty rows generated when init the grid. This will be ignored if `initData` is assigned.
        initRows: 3,
        // An array of data to be filled after initialized the grid.
        initData: null,
        // Array of column options.
        columns: null,
        // Labels or messages used in grid.
        i18n: null,
        // The ID prefix of controls generated inside the grid. Table ID will be used if not defined.
        idPrefix: null,
        // Enable row dragging by using jQuery UI sortable on grid rows.
        rowDragging: false,
        // Hide the buttons at the end of rows or bottom of grid.
        hideButtons: null,
        // Hide the row number column.
        hideRowNumColumn: false,
        // The extra class names for buttons.
        buttonClasses: null,
        // Adding extra button(s) at the end of rows.
        customRowButtons: null,
        // Adding extra button(s) at the bottom of grid.
        customFooterButtons: null,
        // The callback function to be triggered after data loaded to grid.
        dataLoaded: null,
        // The callback function to be triggered after new row appended.
        afterRowAppended: null,
        // The callback function to be triggered after new row inserted.
        afterRowInserted: null,
        // The callback function to be triggered after grid row swapped.
        afterRowSwapped: null,
        // The callback function to be triggered before grid row remove.
        beforeRowRemove: null,
        // The callback function to be triggered after grid row removed.
        afterRowRemoved: null
    };
    // Default column options.
    var _defaultColumnOptions = {
        // Type of column control.
        type: 'text',
        // Name of column.
        name: null,
        // Default value.
        value: null,
        // Display text on the header section.
        display: null,
        // Extra CSS setting to be added to display text.
        displayCss: null,
        // The `colspan` setting on the column header.
        headerSpan: 1,
        // Extra CSS setting to be added to the control container table cell.
        cellCss: null,
        // Extra attributes to be added to the control.
        ctrlAttr: null,
        // Extra properties to be added to the control.
        ctrlProp: null,
        // Extra CSS to be added to the control.
        ctrlCss: null,
        // Extra name of class to be added to the control.
        ctrlClass: null,
        // The available option for building `select` type control.
        ctrlOptions: null,
        // Options for initalize jQuery UI widget.
        uiOption: null,
        // Options for initalize jQuery UI tooltip.
        uiTooltip: null,
        // Callback function to build custom type control.
        customBuilder: null,
        // Callback function to get control value.
        customGetter: null,
        // Callback function to set control value.
        customSetter: null,
        // The `OnClick` event callback of control.
        onClick: null,
        // The `OnChange` event callback of control.
        onChange: null,
        //-----  added by Anand for autocomplete --------------------------------------------------------------------------------------------
        basedOn: null,
        tableName: null,
        keyColumn: null,
        textColumn: null,
        templateColumn: null,
        addOnFunction: null,
        filterCriteria: null,
        separator: null,
        newAllowed: null,
        confirmOnAdd: null,
        procName: null,
        onSelect: null,
        isRequired: false,
        selectedIndex: null,
        divElements: null,
        divRowNo: 0,
        cSpan:1,startControl:null,endControl:null
        //-------------------------------------------------------------------------------------------------------------------
    };
    var _systemMessages = {
        noColumnInfo: 'Cannot initial grid without column information!',
        elemNotTable: 'Cannot initial grid on element other than TABLE!',
        notInit: '`appendGrid` does not initialized',
        getValueMultiGrid: 'Cannot get values on multiple grid',
        notSupportMethod: 'Method is not supported by `appendGrid`: '
    };
    var _defaultTextResources = {
        append: 'Append Row',
        removeLast: 'Remove Last Row',
        insert: 'Update Row',//'Insert Row Above',
        remove: 'Remove Current Row',
        moveUp: 'Move Up',
        moveDown: 'Move Down',
        rowDrag: 'Sort Row',
        rowEmpty: 'This Grid Is Empty',
        // changes by Anand
        updateAll:'Update all record.'
    };
    var _defaultButtonClasses = { append: null, removeLast: null, insert: null, remove: null, moveUp: null, moveDown: null, rowDrag: null, updateAll:null };
    var _defaultHideButtons = { append: false, removeLast: false, insert: false, remove: false, moveUp: false, moveDown: false,updateAll:false };
    var _methods = {
        init: function (options) {
            var target = this;
            var tbWhole, tbHead, tbBody, tbFoot, tbRow, tbCell;
            if (target.length > 0) {
                // Check mandatory paramters included
                if (!$.isArray(options.columns) || options.columns.length == 0) {
                    alert(_systemMessages.noColumnInfo);
                    return target;
                }
                // Check target element is table or not
                tbWhole = target[0];
                if (isEmpty(tbWhole.tagName) || tbWhole.tagName != 'TABLE') {
                    alert(_systemMessages.elemNotTable);
                    return target;
                }
                // Generate settings
                // changes by Anand var settings to settings
                settings = $.extend({}, _defaultInitOptions, options);
                // Add internal settings
                $.extend(settings, {
                    //The UniqueIndex accumulate counter.
                    _uniqueIndex: 0,
                    // The row order array.
                    _rowOrder: [],
                    // Indicate data is loaded or not.
                    _isDataLoaded: false,
                    // Visible column count for internal calculation.
                    _visibleCount: 0,
                    // Total colSpan count after excluding `hideRowNumColumn` and not generating last column.
                    _finalColSpan: 0,
                    // Indicate to hide last column or not
                    _hideLastColumn: false
                });
                // Labels or messages used in grid.
                if ($.isPlainObject(options.i18n))
                    settings._i18n = $.extend({}, _defaultTextResources, options.i18n);
                else
                    settings._i18n = $.extend({}, _defaultTextResources);
                // The extra class names for buttons.
                if ($.isPlainObject(options.buttonClasses))
                    settings._buttonClasses = $.extend({}, _defaultButtonClasses, options.buttonClasses);
                else
                    settings._buttonClasses = $.extend({}, _defaultButtonClasses);
                // Make sure the `hideButtons` setting defined
                if ($.isPlainObject(options.hideButtons))
                    settings.hideButtons = $.extend({}, _defaultHideButtons, options.hideButtons);
                else
                    settings.hideButtons = $.extend({}, _defaultHideButtons);
                // Check `idPrefix` is defined
                if (isEmpty(settings.idPrefix)) {
                    // Check table ID defined
                    if (isEmpty(tbWhole.id) || tbWhole.id == '') {
                        // Generate an ID using current time
                        settings.idPrefix = 'ag' + new Date().getTime();
                    }
                    else {
                        settings.idPrefix = tbWhole.id;
                    }
                }
                // Create thead and tbody
                tbHead = document.createElement('thead');
                tbHead.className = 'ui-widget-header';
                tbBody = document.createElement('tbody');
                tbBody.className = 'ui-widget-content';
                tbFoot = document.createElement('tfoot');
                tbFoot.className = 'ui-widget-header';
                // Remove existing content and append new thead and tbody
                $(tbWhole).empty().addClass('appendGrid ui-widget').append(tbHead, tbBody, tbFoot);
                // Handle header row
                tbRow = tbHead.insertRow(-1);
                if (!settings.hideRowNumColumn) {
                    tbCell = tbRow.insertCell(-1);
                    tbCell.className = 'ui-widget-header';
                    if (settings.rowNumColumnName != null)
                        $(tbCell).text(settings.rowNumColumnName);
                    $(tbCell).attr('align', 'center');
                }
                // Prepare column information and add column header
                var pendingSkipCol = 0;
                for (var z = 0; z < settings.columns.length; z++) {
                    // Assign default setting
                    var columnOpt = $.extend({}, _defaultColumnOptions, settings.columns[z]);
                    settings.columns[z] = columnOpt;
                    // Skip hidden
                    if (settings.columns[z].type != 'hidden') {
                        settings._visibleCount++;
                        // Check skip header colSpan
                        if (pendingSkipCol == 0) {
                            tbCell = tbRow.insertCell(-1);
                            tbCell.className = 'ui-widget-header';
                            $(tbCell).text(settings.columns[z].display);
                            if (settings.columns[z].displayCss) $(tbCell).css(settings.columns[z].displayCss);
                            if (settings.columns[z].headerSpan > 1) {
                                $(tbCell).attr('colSpan', settings.columns[z].headerSpan);
                                pendingSkipCol = settings.columns[z].headerSpan - 1;
                            }
                            if (settings.columns[z].isRequired && settings.contentEditable)
                                tbCell.appendChild(makeRequiredField());
                        } else {
                            pendingSkipCol--;
                        }
                    }
                }
                // add ||!settings.contentEditable by Anand
                // Check to hide last column or not
                if( (settings.hideButtons.insert && settings.hideButtons.remove
                        && settings.hideButtons.moveUp && settings.hideButtons.moveDown
                        && (!$.isArray(settings.customRowButtons) || settings.customRowButtons.length == 0))||!settings.contentEditable ){
                    settings._hideLastColumn = true;
                }
                // Calculate the `_finalColSpan` value
                settings._finalColSpan = settings._visibleCount;
                if (!settings.hideRowNumColumn) settings._finalColSpan++;
                if (!settings._hideLastColumn) settings._finalColSpan++;
                // Generate last column header if needed
                if (!settings._hideLastColumn) {
                    tbCell = tbRow.insertCell(-1);
                    tbCell.className = 'ui-widget-header';
                }
                // Add caption when defined
                if (settings.caption) {
                    tbRow = tbHead.insertRow(0);
                    tbCell = tbRow.insertCell(-1);
                    tbCell.className = 'ui-state-active caption';
                    tbCell.colSpan = settings._finalColSpan;
                    $(tbCell).text(settings.caption);
                    //-----  added by Anand  --------------------------------------------------------------------------------------------
                    // Enable Paging
                    if (settings.isPaging)
                        createPaging(tbCell);
                    //-------------------------------------------------------------------------------------------------------------------
                }
                // Handle footer row
                tbRow = tbFoot.insertRow(-1);
                tbCell = tbRow.insertCell(-1);
                tbCell.colSpan = settings._finalColSpan;
                // added by Anand------------
                ctrl = document.createElement('div');
                ctrl.id =settings.idPrefix+ '_divStatusMsg';
                ctrl.name = settings.idPrefix + '_divStatusMsg';
                ctrl.style.cssFloat = 'right';
                tbCell.appendChild(ctrl);
                //-------------------------------
                $('<input/>').attr({
                    type: 'hidden',
                    id: settings.idPrefix + '_rowOrder',
                    name: settings.idPrefix + '_rowOrder'
                }).appendTo(tbCell);
                if (settings.contentEditable) {
                    // Make row invisible if all buttons are hidden
                    if (settings.hideButtons.append && settings.hideButtons.removeLast && settings.hideButtons.updateAll
                            && (!$.isArray(settings.customFooterButtons) || settings.customFooterButtons.length == 0)) {
                        tbRow.style.display = 'none';
                    } else {
                        // Added by Anand
                        if (!settings.hideButtons.updateAll) {
                            $('<button/>').addClass('updateAll', settings._buttonClasses.updateAll).css('float', 'left').attr({
                                type: 'button', title: settings._i18n.updateAll, title: 'Update All Record.', id: settings.idPrefix + '_btnUpdateAll', name: settings.idPrefix + '_btnUpdateAll'
                                //, onclick: (!isEmpty(settings.allUpdateExtraFunction)) ? settings.allUpdateExtraFunction : ''
                            })
                            .button({ icons: { primary: 'ui-icon-refresh' }, label: 'Update' }).click(function () {
                                //$('#' + settings.idPrefix).cfValidator();
                                createUpdateRecord(updatedRows);
                                if (typeof (settings.allUpdateExtraFunction) == 'function') {
                                    settings.allUpdateExtraFunction();
                                }
                            }).appendTo(tbCell);
                        }
                        if (!settings.hideButtons.append) {
                            $('<button/>').addClass('append', settings._buttonClasses.append).css('float', 'left').attr({ type: 'button', title: settings._i18n.append, id: settings.idPrefix + '_btnAppendRow', name: settings.idPrefix + '_btnAppendRow' })
                            .button({ icons: { primary: 'ui-icon-plusthick' }, text: false }).click(function () {
                                getUpdatedRowIndex(settings._uniqueIndex + 1);
                                if (validateTableData(settings.tableID, updatedRows)) {
                                    insertRow(tbWhole, 1, null, null);
                                } else {
                                    updatedRows.splice(updatedRows.length-1, 1);
                                }
                                if (!isEmpty(document.getElementById(settings.idPrefix + '_btnUpdateAll')) && !settings.hideButtons.updateAll) {
                                    document.getElementById(settings.idPrefix + '_btnUpdateAll').style.display = 'block';
                                }
                                if (!isEmpty(document.getElementById(settings.idPrefix + '_btnRemoveLast')) && !settings.hideButtons.removeLast) {
                                    document.getElementById(settings.idPrefix + '_btnRemoveLast').style.display = 'block';
                                }

                            }).appendTo(tbCell);
                        }
                        if (!settings.hideButtons.removeLast) {
                            $('<button/>').addClass('removeLast', settings._buttonClasses.removeLast).css('float', 'left').attr({ type: 'button', title: settings._i18n.removeLast, id: settings.idPrefix + '_btnRemoveLast', name: settings.idPrefix + '_btnRemoveLast' })
                            .button({ icons: { primary: 'ui-icon-closethick' }, text: false }).click(function () {
                                //removeRow(tbWhole, null, this.value, false);
                                deleteRecord($('#' + settings.tableID).appendGrid('getRowCount'));
                            }).appendTo(tbCell);
                        }
                        if (settings.customFooterButtons && settings.customFooterButtons.length) {
                            // Add front buttons
                            for (var y = settings.customFooterButtons.length - 1; y >= 0; y--) {
                                var buttonCfg = settings.customFooterButtons[y];
                                if (buttonCfg && buttonCfg.uiButton && buttonCfg.click && buttonCfg.atTheFront) {
                                    $(tbCell).prepend(makeCustomBottomButton(tbWhole, buttonCfg));
                                }
                            }
                            // Add end buttons
                            for (var y = 0; y < settings.customFooterButtons.length; y++) {
                                var buttonCfg = settings.customFooterButtons[y];
                                if (buttonCfg && buttonCfg.uiButton && buttonCfg.click && !buttonCfg.atTheFront) {
                                    $(tbCell).append(makeCustomBottomButton(tbWhole, buttonCfg));
                                }
                            }
                        }
                    }
                }
                //else {
                //    $('<button/>').addClass('removeLast', settings._buttonClasses.removeLast).css('float', 'left').attr({ type: 'button', title: 'Download' })
                //           .button({ icons: { primary: 'ui-icon-arrowthickstop-1-s' }, text: false }).click(function (e) {
                //               exportToExcel(e);
                //               //var exportData = '<table>' + $('#' + settings.idPrefix).html() + '</table>';
                //               //$('body').prepend("<form method='post' action='data:application/vnd.ms-excel' style='top:-3333333333px;' id='tempForm'><input type='hidden' name='data' value='" + exportData + "' ></form>");
                //               //$('#tempForm').submit();
                //               //$("tempForm").remove();
                //               //return false;

                //              // window.open('data:application/vnd.ms-excel,' + $('#' + settings.idPrefix).html());
                //              // e.preventDefault();

                //               //$('#' + settings.idPrefix).print();
                //               //removeRow(tbWhole, null, this.value, false);
                //               //deleteRecord($('#' + settings.tableID).appendGrid('getRowCount'));
                //           }).appendTo(tbCell);
                //}

                // Enable dragging
                if (settings.rowDragging) {
                    $(tbBody).sortable({
                        axis: 'y',
                        containment: tbWhole,
                        handle: '.rowDrag',
                        helper: function (e, tr) {
                            var org = tr.children();
                            var helper = tr.clone();
                            helper.children().each(function (index) {
                                $(this).width(org.eq(index).width());
                            });
                            return helper;
                        },
                        update: function (event, ui) {
                            var uniqueIndex = ui.item[0].id.substring(ui.item[0].id.lastIndexOf('_') + 1);
                            var tbRowIndex = ui.item[0].rowIndex - $('tr', tbHead).length;
                            gridRowDragged(tbWhole, ui.originalPosition.top > ui.position.top, uniqueIndex, tbRowIndex);
                        }
                    });
                }
                // Save options
                $(tbWhole).data('appendGrid', settings);
                if (options.initData == undefined)
                    options.initData = [];
                if (options.initData.length == 0 && !isEmpty(document.getElementById(settings.idPrefix + '_btnUpdateAll')))
                    document.getElementById(settings.idPrefix + '_btnUpdateAll').style.display = 'none';
                if (options.initData.length == 0 && !isEmpty(document.getElementById(settings.idPrefix + '_btnRemoveLast')))
                    document.getElementById(settings.idPrefix + '_btnRemoveLast').style.display = 'none';
                if ($.isArray(options.initData)) {
                    // Load data if initData is array
                    loadData(tbWhole, options.initData, true);
                } else {
                    // Add empty rows
                    $(tbWhole).appendGrid('appendRow', settings.initRows);
                }
                // Show no rows in grid
                if (settings._rowOrder.length == 0) {
                    var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
                    $('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty));
                }
            }
            return target;
        },
        isReady: function () {
            // Check the appendGrid is initialized or not
            var target = this, result = false;
            if (target.length > 0) {
                var settings = target.first().data('appendGrid');
                if (settings) {
                    result = true;
                }
            }
            return result;
        },
        isDataLoaded: function () {
            // Check the grid data is loaded by `load` method or `initData` parameter or not
            var target = this, result = null;
            if (this.length == 1) {
                var settings = target.data('appendGrid');
                if (settings) {
                    return settings._isDataLoaded;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        },
        load: function (records) {
            var target = this;
            if (target.length > 0) {
                if (records != null && records.length > 0) {
                    loadData(target[0], records, false);
                } else {
                    emptyGrid(target[0]);
                }
            }
            return target;
        },
        appendRow: function (numOfRowOrRowArray) {
            return this.appendGrid('insertRow', numOfRowOrRowArray);
        },
        insertRow: function (numOfRowOrRowArray, rowIndex, callerUniqueIndex) {
            var target = this;
            if (target.length > 0) {
                var tbWhole = target[0], insertResult = null;
                var settings = $(tbWhole).data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else if (($.isArray(numOfRowOrRowArray) && numOfRowOrRowArray.length > 0) || ($.isNumeric(numOfRowOrRowArray) && numOfRowOrRowArray > 0)) {
                    // Define variables
                    insertResult = insertRow(tbWhole, numOfRowOrRowArray, rowIndex, callerUniqueIndex);
                    // Reorder sequence as needed
                    if ($.isNumeric(rowIndex) || $.isNumeric(callerUniqueIndex)) {
                        // Sort sequence
                        sortSequence(tbWhole, insertResult.rowIndex);
                        // Move focus
                        var insertUniqueIndex = settings._rowOrder[insertResult.addedRows[0]];
                        $('#' + settings.idPrefix + '_Insert_' + insertUniqueIndex, tbWhole).focus();
                    }
                }
            }
            return target;
        },
        removeRow: function (rowIndex, uniqueIndex) {
            var target = this;
            if (target.length > 0) {
                var tbWhole = target[0];
                var settings = $(tbWhole).data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else if (settings._rowOrder.length > 0) {
                    removeRow(tbWhole, rowIndex, uniqueIndex, true);
                }
            }
            return target;
        },
        emptyGrid: function () {
            var target = this;
            if (target.length > 0) {
                var tbWhole = target[0];
                var settings = $(tbWhole).data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else {
                    emptyGrid(tbWhole);
                }
            }
            return target;
        },
        moveUpRow: function (rowIndex, uniqueIndex) {
            var target = this, tbodyIndex = -1;
            if (target.length > 0) {
                var tbWhole = target[0], tbBody, trTarget, trSwap, swapSeq;
                var settings = $(tbWhole).data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else {
                    var oldIndex = null;
                    tbBody = tbWhole.getElementsByTagName('tbody')[0];
                    if ($.isNumeric(rowIndex) && rowIndex > 0 && rowIndex < settings._rowOrder.length) {
                        oldIndex = rowIndex;
                        uniqueIndex = settings._rowOrder[rowIndex];
                        trTarget = document.getElementById(settings.idPrefix + '_Row_' + uniqueIndex, tbWhole);
                    } else if ($.isNumeric(uniqueIndex)) {
                        oldIndex = findRowIndex(uniqueIndex, settings);
                        trTarget = document.getElementById(settings.idPrefix + '_Row_' + uniqueIndex, tbWhole);
                    }
                    if (oldIndex != null && oldIndex > 0) {
                        // Get row to swap
                        trSwap = document.getElementById(settings.idPrefix + '_Row_' + settings._rowOrder[oldIndex - 1], tbWhole);
                        // Remove current row
                        tbBody.removeChild(trTarget);
                        // Insert before the above row
                        tbBody.insertBefore(trTarget, trSwap);
                        // Update rowOrder
                        settings._rowOrder[oldIndex] = settings._rowOrder[oldIndex - 1];
                        settings._rowOrder[oldIndex - 1] = uniqueIndex;
                        // Update row label
                        swapSeq = $('td.first', trSwap).html();
                        $('td.first', trSwap).html($('td.first', trTarget).html());
                        $('td.first', trTarget).html(swapSeq)
                        // Save setting
                        saveSetting(tbWhole, settings);
                        // Change focus
                        $('td.last button.moveUp', trTarget).removeClass('ui-state-hover').blur();
                        $('td.last button.moveUp', trSwap).focus();
                        // Trigger event
                        if (settings.afterRowSwapped) {
                            settings.afterRowSwapped(tbWhole, oldIndex, oldIndex - 1);
                        }
                    }
                }
            }
            return target;
        },
        moveDownRow: function (rowIndex, uniqueIndex) {
            var target = this, tbodyIndex = -1;
            if (target.length > 0) {
                var tbWhole = target[0], tbBody, trTarget, trSwap, swapSeq;
                var settings = $(tbWhole).data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else {
                    var oldIndex = null;
                    tbBody = tbWhole.getElementsByTagName('tbody')[0];
                    if ($.isNumeric(rowIndex) && rowIndex >= 0 && rowIndex < settings._rowOrder.length - 1) {
                        oldIndex = rowIndex;
                        uniqueIndex = settings._rowOrder[rowIndex];
                        trTarget = document.getElementById(settings.idPrefix + '_Row_' + uniqueIndex, tbWhole);
                    } else if ($.isNumeric(uniqueIndex)) {
                        oldIndex = findRowIndex(uniqueIndex, settings);
                        trTarget = document.getElementById(settings.idPrefix + '_Row_' + uniqueIndex, tbWhole);
                    }
                    if (oldIndex != null && oldIndex != settings._rowOrder.length - 1) {
                        // Get row to swap
                        trSwap = document.getElementById(settings.idPrefix + '_Row_' + settings._rowOrder[oldIndex + 1], tbWhole);
                        // Remove current row
                        tbBody.removeChild(trSwap);
                        // Insert before the above row
                        tbBody.insertBefore(trSwap, trTarget);
                        // Update rowOrder
                        settings._rowOrder[oldIndex] = settings._rowOrder[oldIndex + 1];
                        settings._rowOrder[oldIndex + 1] = uniqueIndex;
                        // Update row label
                        swapSeq = $('td.first', trSwap).html();
                        $('td.first', trSwap).html($('td.first', trTarget).html());
                        $('td.first', trTarget).html(swapSeq)
                        // Save setting
                        saveSetting(tbWhole, settings);
                        // Change focus
                        $('td.last button.moveDown', trTarget).removeClass('ui-state-hover').blur();
                        $('td.last button.moveDown', trSwap).focus();
                        // Trigger event
                        if (settings.afterRowSwapped) {
                            settings.afterRowSwapped(tbWhole, oldIndex, oldIndex + 1);
                        }
                    }
                }
            }
            return target;
        },
        getRowCount: function () {
            var target = this;
            if (target.length > 0) {
                var settings = target.data('appendGrid');
                if (settings) {
                    return settings._rowOrder.length;
                }
                else {
                    alert(_systemMessages.notInit);
                }
            }
            else {
                alert(_systemMessages.getValueMultiGrid);
            }
            return null;
        },
        getUniqueIndex: function (rowIndex) {
            var target = this;
            if (target.length > 0 && rowIndex >= 0) {
                var settings = target.data('appendGrid');
                if (settings) {
                    if (rowIndex < settings._rowOrder.length) {
                        return settings._rowOrder[rowIndex];
                    }
                }
                else {
                    alert(_systemMessages.notInit);
                }
            }
            return null;
        },
        getRowIndex: function (uniqueIndex) {
            var target = this;
            if (target.length > 0) {
                var settings = target.data('appendGrid');
                if (settings) {
                    for (var z = 0; z < settings._rowOrder.length; z++) {
                        if (settings._rowOrder[z] == uniqueIndex) {
                            return z;
                        }
                    }
                    return null;
                }
                else {
                    alert(_systemMessages.notInit);
                }
            }
            return null;
        },
        getRowValue: function (rowIndex, uniqueIndex, loopIndex) {
            var target = this, result = null;
            if (target.length > 0) {
                var settings = target.data('appendGrid');
                if (settings) {
                    if ($.isNumeric(rowIndex) && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                        uniqueIndex = settings._rowOrder[rowIndex];
                    }
                    if (!isEmpty(uniqueIndex)) {
                        result = getRowValue(settings, uniqueIndex, loopIndex);
                    }
                }
                else {
                    alert(_systemMessages.notInit);
                }
            }
            return result;
        },
        getAllValue: function (objectMode) {
            var target = this, result = null, rowValue;
            if (target.length > 0) {
                var settings = $(target).data('appendGrid');
                if (settings) {
                    // Prepare result based on objectMode setting
                    result = objectMode ? {} : [];
                    // Process on each rows
                    for (var z = 0; z < settings._rowOrder.length; z++) {
                        if (objectMode) {
                            rowValue = getRowValue(settings, settings._rowOrder[z], z);
                            $.extend(result, rowValue)
                        } else {
                            rowValue = getRowValue(settings, settings._rowOrder[z]);
                            result.push(rowValue);
                        }
                    }
                    if (objectMode) {
                        result['_RowCount'] = settings._rowOrder.length;
                    }
                }
            }
            return result;
        },
        // changes by Anand
        getCtrlValue: function (name, rowIndex) {
            var target = this;
            if (target.length > 0) {
                settings = target.data('appendGrid');
                if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                    for (var z = 0; z < settings.columns.length; z++) {
                        if (settings.columns[z].type == 'div') {
                            for (var a = 0; a < settings.columns.length; a++) {
                                if (settings.columns[z].divElements[a].name == name) {
                                    return getCtrlValue((!isEmpty(settings.columns[z].divElements[a].ctrlAttr) ? (!isEmpty(settings.columns[z].divElements[a].ctrlAttr.controltype) ? settings.columns[z].divElements[a].ctrlAttr.controltype : settings.columns[z].divElements[a].type) : settings.columns[z].divElements[a].type), settings.columns[z].divElements[a].name, settings._rowOrder[rowIndex]);
                                    break;
                                }
                            }
                        }
                        else if (settings.columns[z].name == name) {
                            return getCtrlValue((!isEmpty(settings.columns[z].ctrlAttr) ? (!isEmpty(settings.columns[z].ctrlAttr.controltype) ? settings.columns[z].ctrlAttr.controltype : settings.columns[z].type) : settings.columns[z].type), settings.columns[z].name, settings._rowOrder[rowIndex]);
                            break;
                        }
                    }
                }
            }
            return null;
        },
        // changes by Anand
        setCtrlValue: function (name, rowIndex, value) {
            var target = this;
            if (target.length > 0) {
                var tbWhole = this, settings = $(this).data('appendGrid');
                if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                    for (var z = 0; z < settings.columns.length; z++) {
                        if (settings.columns[z].type == 'div') {
                            for (var a = 0; a < settings.columns.length; a++) {
                                if (settings.columns[z].divElements[a].name == name) {
                                    setCtrlValue((!isEmpty(settings.columns[z].divElements[a].ctrlAttr) ? (!isEmpty(settings.columns[z].divElements[a].ctrlAttr.controltype) ? settings.columns[z].divElements[a].ctrlAttr.controltype : settings.columns[z].divElements[a].type) : settings.columns[z].divElements[a].type), settings.columns[z].divElements[a].name, settings._rowOrder[rowIndex], value);
                                    break;
                                }
                            }
                        }
                        else if (settings.columns[z].name == name) {
                            setCtrlValue((!isEmpty(settings.columns[z].ctrlAttr) ? (!isEmpty(settings.columns[z].ctrlAttr.controltype) ? settings.columns[z].ctrlAttr.controltype : settings.columns[z].type) : settings.columns[z].type), settings.columns[z].name, settings._rowOrder[rowIndex], value);
                            break;
                        }
                    }
                }
            }
            return target;
        },
        getCellCtrl: function (name, uniqueIndex) {
            var target = this, result = null;
            if (target.length == 1) {
                settings = target.data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else {
                    for (var z = 0; z < settings.columns.length; z++) {
                        if (settings.columns[z].name === name) {
                            return getCellCtrl(settings.columns[z].type, settings.idPrefix, name, uniqueIndex);
                            break;
                        }
                    }
                }
            }
            return null;
        },
        getCellCtrlByRowIndex: function (name, rowIndex) {
            var target = this, result = null;
            if (target.length == 1) {
                settings = target.data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else {
                    if (rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                        var uniqueIndex = settings._rowOrder[rowIndex];
                        for (var z = 0; z < settings.columns.length; z++) {
                            if (settings.columns[z].name === name) {
                                return getCellCtrl(settings.columns[z].type, settings.idPrefix, name, uniqueIndex);
                            }
                        }
                    }
                }
            }
            return null;
        },
        setCellCtrlByRowIndex: function (name, rowIndex, value) {
            var target = this, result = null;
            if (target.length == 1) {
                settings = target.data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else {
                    if (rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                        var uniqueIndex = settings._rowOrder[rowIndex];
                        for (var z = 0; z < settings.columns.length; z++) {
                            if (settings.columns[z].name === name) {
                                return setCellCtrl(settings.columns[z].type, settings.idPrefix, name, uniqueIndex, value);
                            }
                        }
                    }
                }
            }
            return null;
        },
        getRowOrder: function () {
            var target = this, result = null;
            if (this.length == 1) {
                var settings = target.data('appendGrid');
                if (settings) {
                    result = settings._rowOrder.slice();
                }
                else {
                    alert(_systemMessages.notInit);
                }
            }
            else {
                alert(_systemMessages.getValueMultiGrid);
            }
            return result;
        }
    };
    function insertRow(tbWhole, numOfRowOrRowArray, rowIndex, callerUniqueIndex) {
        // Define variables
        //var settings = $(tbWhole).data('appendGrid');
        var addedRows = [], parentIndex = null, uniqueIndex, ctrl, hidden = [];
        var tbHead = tbWhole.getElementsByTagName('thead')[0];
        var tbBody = tbWhole.getElementsByTagName('tbody')[0];
        // Check number of row to be inserted
        var numOfRow = numOfRowOrRowArray, loadData = false;
        if ($.isArray(numOfRowOrRowArray)) {
            numOfRow = numOfRowOrRowArray.length;
            loadData = true;
        }
        // Check parent row
        if ($.isNumeric(callerUniqueIndex)) {
            for (var z = 0; z < settings._rowOrder.length; z++) {
                if (settings._rowOrder[z] == callerUniqueIndex) {
                    rowIndex = z;
                    if (z != 0) parentIndex = z - 1;
                    break;
                }
            }
        }
        else if ($.isNumeric(rowIndex)) {
            if (rowIndex >= settings._rowOrder.length) {
                rowIndex = null;
            } else {
                parentIndex = rowIndex - 1;
            }
        }
        else if (settings._rowOrder.length != 0) {
            rowIndex = null;
            parentIndex = settings._rowOrder.length - 1;
        }
        // Remove empty row
        if (settings._rowOrder.length == 0) {
            $('tr.empty', tbWhole).remove(); 
            //-----  added by Anand  --------------------------------------------------------------------------------------------
            if (!isEmpty(document.getElementById(settings.idPrefix + '_btnUpdateAll')) && !settings.hideButtons.updateAll)
                document.getElementById(settings.idPrefix + '_btnUpdateAll').style.display = 'block';
            if (!isEmpty(document.getElementById(settings.idPrefix + '_btnRemoveLast')) && !settings.hideButtons.removeLast)
                document.getElementById(settings.idPrefix + '_btnRemoveLast').style.display = 'block';
            //-------------------------------------------------------------------------------------------------------------------
        }
        // Add total number of row
        for (var z = 0; z < numOfRow; z++) {
            // Update variables
            settings._uniqueIndex++;
            uniqueIndex = settings._uniqueIndex;
            hidden.length = 0;
            // Check row insert index
            if ($.isNumeric(rowIndex)) {
                settings._rowOrder.splice(rowIndex, 0, uniqueIndex);
                tbRow = tbBody.insertRow(rowIndex);
                addedRows.push(rowIndex);
            }
            else {
                settings._rowOrder.push(uniqueIndex);
                tbRow = tbBody.insertRow(-1);
                addedRows.push(settings._rowOrder.length - 1);
            }
            tbRow.id = settings.idPrefix + '_Row_' + uniqueIndex;
            $(tbRow).data('appendGrid', uniqueIndex);
            var tbCell;
            // Add row number
            if (!settings.hideRowNumColumn) {
                tbCell = tbRow.insertCell(-1);
                // changes by Anand
                $(tbCell).addClass('ui-widget-content first').text(settings._rowOrder.length + (settings.isPaging ? (settings.currentPage * settings.itemsPerPage - settings.itemsPerPage) : 0));
            }
            // set background color for alternate rows
            //if (settings._rowOrder.length % 2 == 0)
            //    $(tbRow).addClass('dataTableRow');
            // Process on each columns
            for (var y = 0; y < settings.columns.length; y++) {
                settings.columns[y].isRequired = (!settings.contentEditable ? false : settings.columns[y].isRequired);
                // Skip hidden
                if (settings.columns[y].type == 'hidden') {
                    hidden.push(y);
                    continue;
                }
                //-----  added/changes by Anand  --------------------------------------------------------------------------------------------
                if (settings.columns[y].type == 'div') {
                    tbCell = tbRow.insertCell(-1);
                    tbCell.style.verticalAlign = 'top';
                    var tbl = document.createElement('table');
                    tbl.id = 'table' + settings.columns[y].name + uniqueIndex;
                    tbl.name = tbl.id;
                    tbl.width = '100%';
                    tbl.cellSpacing = 0;
                    tbl.border = 0;
                    tbl.borderColor = 'transparant';
                    tbl.style.verticalAlign = 'top';
                    tbl.setAttribute('required', settings.columns[y].isRequired ? 'required' : '');
                    var tr, td, rNo = 0;

                    tbCell.appendChild(tbl);
                    tbCell.style.textAlign = 'left';
                    for (var d = 0; d < settings.columns[y].divElements.length; d++) {
                        settings.columns[y].divElements[d].isRequired = (!settings.contentEditable ? false : settings.columns[y].divElements[d].isRequired);
                        if (rNo < settings.columns[y].divElements[d].divRowNo)
                            tr = tbl.insertRow(settings.columns[y].divElements[d].divRowNo - 1);
                        rNo = settings.columns[y].divElements[d].divRowNo;
                        if (!isEmpty(settings.columns[y].divElements[d].display)) {
                            td = tr.insertCell(-1);
                            td.className = 'ui-widget-content';
                            td.colSpan = settings.columns[y].divElements[d].cSpan == undefined ? 1 : settings.columns[y].divElements[d].cSpan;
                            if (!isEmpty(settings.columns[y].divElements[d].cellCss)) $(tCell).css(settings.columns[y].divElements[d].cellCss);
                            if (!isEmpty(settings.columns[y].divElements[d].isRequired))
                                if (settings.columns[y].divElements[d].isRequired && settings.contentEditable)
                                    td.appendChild(makeRequiredField());
                            ctrl = document.createElement('label');
                            ctrl.id = settings.idPrefix + '_lbl' + settings.columns[y].divElements[d].name + '_' + uniqueIndex;
                            ctrl.name = ctrl.id;
                            ctrl.innerHTML = settings.columns[y].divElements[d].display;
                            ctrl.style.cssText = 'font-weight:bold';
                            td.appendChild(ctrl);
                        }
                        createHTMLControl(tbWhole, tr, td, settings.columns[y].divElements[d], y, uniqueIndex);
                    }
                }
                else {
                    createHTMLControl(tbWhole, tbRow, tbCell, settings.columns[y], y, uniqueIndex);
                    if(settings.contentEditable)
                    //if (loadData) {
                        // Load data if needed
                        //if (settings.columns[y].type == 'div') {
                        //    for (var a = 0; a < settings.columns.length; a++) {
                        //        if (loadData) {
                        //            setCtrlValue((!isEmpty(settings.columns[y].divElements[a].ctrlAttr) ? (!isEmpty(settings.columns[y].divElements[a].ctrlAttr.controltype) ? settings.columns[y].divElements[a].ctrlAttr.controltype : settings.columns[y].divElements[a].type) : settings.columns[y].divElements[a].type), settings.columns[y].divElements[a].name, uniqueIndex, numOfRowOrRowArray[z][settings.columns[y].name]);
                        //        }
                        //        else if (!isEmpty(settings.columns[y].divElements[a].value)) {
                        //            // Set default value
                        //            setCtrlValue(settings.columns[y].divElements[a].type, settings.columns[y].divElements[a].name, uniqueIndex, settings.columns[y].divElements[a].value);
                        //        }
                        //    }
                        //}
                        //else {
                            if (loadData) {
                                setCtrlValue((!isEmpty(settings.columns[y].ctrlAttr) ?(!isEmpty(settings.columns[y].ctrlAttr.controltype) ? settings.columns[y].ctrlAttr.controltype : settings.columns[y].type) : settings.columns[y].type), settings.columns[y].name, uniqueIndex, numOfRowOrRowArray[z][settings.columns[y].name]);
                            }
                            else if (!isEmpty(settings.columns[y].value)) {
                                // Set default value
                                    setCtrlValue(settings.columns[y].type, settings.columns[y].name, uniqueIndex, settings.columns[y].value);
                                 }
                        //}
                }
                //-------------------------------------------------------------------------------------------------------------------
            }
            // Add button cell if needed
            if ((!settings._hideLastColumn || settings.columns.length > settings._visibleCount) && settings.contentEditable) {
                tbCell = tbRow.insertCell(-1);
                tbCell.className = 'ui-widget-content last';
                if (settings._hideLastColumn) tbCell.style.display = 'none';
                // Add standard buttons
                if (!settings.hideButtons.insert) {
                    $(tbCell).append($('<button/>').addClass('insert', settings._buttonClasses.insert).val(uniqueIndex)
                        .attr({ id: settings.idPrefix + '_Insert_' + uniqueIndex, type: 'button', title: settings._i18n.insert, tabindex: -1 })
                        .button({ icons: { primary: 'ui-icon-refresh' }, text: false }).click(function () {//'ui-icon-arrowreturnthick-1-w'
                            // $(tbWhole).appendGrid('insertRow', 1, null, this.value);
                            createUpdateRecord(this.id.split('_')[2]);
                            if (typeof (settings.rowUpdateExtraFunction) == 'function') {
                                settings.rowUpdateExtraFunction();
                            }
                            //if (!isEmpty(settings.rowUpdateExtraFunction))
                            //    settings.rowUpdateExtraFunction;
                        }));
                    //, onclick: (!isEmpty(settings.rowUpdateExtraFunction))?settings.rowUpdateExtraFunction:''
                }
                if (!settings.hideButtons.remove) {
                    $(tbCell).append($('<button/>').addClass('remove', settings._buttonClasses.remove).val(uniqueIndex)
                        .attr({ id: settings.idPrefix + '_Delete_' + uniqueIndex, type: 'button', title: settings._i18n.remove, tabindex: -1 })
                        .button({ icons: { primary: 'ui-icon-trash' }, text: false }).click(function () {
                            //removeRow(tbWhole, null, this.value, false);
                            deleteRecord(this.id.split('_')[2]);
                        }));
                }

                //// Add hidden
                //for (var y = 0; y < hidden.length; y++) {
                //    ctrl = document.createElement('input');
                //    ctrl.id = settings.idPrefix + '_' + settings.columns[hidden[y]].name + '_' + uniqueIndex;
                //    ctrl.name = ctrl.id;
                //    ctrl.type = 'hidden';

                //    if (loadData) {
                //        // Load data if needed
                //        ctrl.value = numOfRowOrRowArray[z][settings.columns[hidden[y]].name];
                //    } else if (!isEmpty(settings.columns[hidden[y]].value)) {
                //        // Set default value
                //        ctrl.value = settings.columns[hidden[y]].value;
                //    }
                //    tbCell.appendChild(ctrl);
                //}
                // Add extra buttons
                if (settings.customRowButtons && settings.customRowButtons.length) {
                    // Add front buttons
                    for (var y = settings.customRowButtons.length - 1; y >= 0; y--) {
                        var buttonCfg = settings.customRowButtons[y];
                        if (buttonCfg && buttonCfg.uiButton && buttonCfg.click && buttonCfg.atTheFront) {
                            $(tbCell).prepend(makeCustomRowButton(tbWhole, buttonCfg, uniqueIndex));
                        }
                    }
                    // Add end buttons
                    for (var y = 0; y < settings.customRowButtons.length; y++) {
                        var buttonCfg = settings.customRowButtons[y];
                        if (buttonCfg && buttonCfg.uiButton && buttonCfg.click && !buttonCfg.atTheFront) {
                            $(tbCell).append(makeCustomRowButton(tbWhole, buttonCfg, uniqueIndex));
                        }
                    }
                }
            }
            // Add hidden
            for (var y = 0; y < hidden.length; y++) {
                ctrl = document.createElement('input');
                ctrl.id = settings.idPrefix + '_' + settings.columns[hidden[y]].name + '_' + uniqueIndex;
                ctrl.name = ctrl.id;
                ctrl.type = 'hidden';

                if (loadData) {
                    // Load data if needed
                    ctrl.value = numOfRowOrRowArray[z][settings.columns[hidden[y]].name];
                } else if (!isEmpty(settings.columns[hidden[y]].value)) {
                    // Set default value
                    ctrl.value = settings.columns[hidden[y]].value;
                }
                tbCell.appendChild(ctrl);
            }
        }
        // Save setting
        saveSetting(tbWhole, settings);
        // Trigger events
        if ($.isNumeric(rowIndex)) {
            if (typeof (settings.afterRowInserted) == 'function') {
                settings.afterRowInserted(tbWhole, parentIndex, addedRows);
            }
        }
        else {
            if (typeof (settings.afterRowAppended) == 'function') {
                settings.afterRowAppended(tbWhole, parentIndex, addedRows);
            }
        }
        // Return added rows' uniqueIndex
        return { addedRows: addedRows, parentIndex: parentIndex, rowIndex: rowIndex };
    }
    function createHTMLControl(tWhole,tRow,tCell,col,colIndex,uIndex)
    {
        if (!settings.contentEditable && col.type != 'button') {
            col.type = 'label';
            col.value = '';
            if (!isEmpty(col.ctrlAttr))
                if (!isEmpty(col.ctrlAttr.controltype))
                    col.ctrlAttr.controltype = '';
        }
        // Insert cell
        tCell = tRow.insertCell(-1);
        tCell.className = 'ui-widget-content';
        tCell.colSpan = col.cSpan == undefined ? 1 : col.cSpan;
        if (col.cellCss != null) $(tCell).css(col.cellCss);
        // Check control type
        ctrl = null;
        if (col.type == 'custom') {
            if (typeof (col.customBuilder) == 'function') {
                ctrl = col.customBuilder(tCell, settings.idPrefix, col.name, uIndex);
            }
        }
        else if (col.type == 'select') {
            ctrl = document.createElement('select');
            ctrl.id = settings.idPrefix + '_' + col.name + '_' + uIndex;
            ctrl.name = ctrl.id;
            // Build option list
            if ($.isArray(col.ctrlOptions)) {
                // For array type option list
                if (col.ctrlOptions.length > 0) {
                    if ($.isPlainObject(col.ctrlOptions[0])) {
                        for (var x = 0; x < col.ctrlOptions.length; x++) {
                            ctrl.options[ctrl.options.length] = new Option(col.ctrlOptions[x].label, col.ctrlOptions[x].value);
                        }
                    }
                    else {
                        for (var x = 0; x < col.ctrlOptions.length; x++) {
                            ctrl.options[ctrl.options.length] = new Option(col.ctrlOptions[x], col.ctrlOptions[x]);
                        }
                    }
                }
            }
            else if ($.isPlainObject(col.ctrlOptions)) {
                // For plain object type option list
                for (var x in col.ctrlOptions) {
                    ctrl.options[ctrl.options.length] = new Option(col.ctrlOptions[x], x);
                }
            }
            else if (typeof (col.ctrlOptions) == 'string') {
                // For string type option list
                var arrayOpt = col.ctrlOptions.split(';');
                for (var x = 0; x < arrayOpt.length; x++) {
                    var eqIndex = arrayOpt[x].indexOf(':');
                    if (-1 == eqIndex) {
                        ctrl.options[ctrl.options.length] = new Option(arrayOpt[x], arrayOpt[x]);
                    } else {
                        ctrl.options[ctrl.options.length] = new Option(arrayOpt[x].substring(eqIndex + 1, arrayOpt[x].length), arrayOpt[x].substring(0, eqIndex));
                    }
                }
            }
            if (col.selectedIndex != undefined)
                ctrl.selectedIndex = col.selectedIndex;
            tCell.appendChild(ctrl);
        }
            //-----  added by Anand  --------------------------------------------------------------------------------------------
        else if (col.type == 'radiolist') {
            var tblRadio = document.createElement('table');
            tblRadio.id = 'tableRbtn' + col.name + uIndex;
            tblRadio.name = tblRadio.id;
            tblRadio.setAttribute('required', col.isRequired ? 'required' : '');
            var trRadio = tblRadio.insertRow(0);
            var tdRadio;
            if ($.isPlainObject(col.ctrlOptions)) {
                // For plain object type option list
                for (var x in col.ctrlOptions) {
                    tdRadio = trRadio.insertCell(-1);
                    ctrl = document.createElement('input');
                    ctrl.type = 'radio';
                    ctrl.id = settings.idPrefix + '_Rbtn' + col.name + '_' + uIndex + '_' + x;
                    ctrl.name = settings.idPrefix + '_Rbtn' + col.name + '_' + uIndex;
                    ctrl.required = col.isRequired;
                    ctrl.checked = x == col.selectedIndex;
                    ctrl.value = x;
                    tdRadio.appendChild(ctrl);
                    ctrl = document.createElement('label');
                    ctrl.id = settings.idPrefix + '_Lbl' + col.name + '_' + uIndex + '_' + x;
                    ctrl.name = settings.idPrefix + '_Lbl' + col.name + '_' + uIndex;
                    ctrl.innerText = col.ctrlOptions[x];
                    tdRadio.appendChild(ctrl);
                }
            }
            if (typeof (col.onClick) == 'function') {
                $(tblRadio).click({ caller: tWhole, callback: col.onClick, uIndex: uIndex }, function (evt) {
                    evt.data.callback(evt, $(evt.data.caller).appendGrid('getRowIndex', evt.data.uIndex));
                });
            }
            tblRadio.setAttribute('onclick', 'javascript:getUpdatedRowIndex(' + uIndex + ');');
            tCell.appendChild(tblRadio);
            tCell.style.textAlign = 'center';
        }
            //-------------------------------------------------------------------------------------------------------------------
        else if (-1 != col.type.search(/^(color|date|datetime|datetime\-local|email|month|number|range|search|tel|time|url|week)$/)) {
            ctrl = document.createElement('input');
            try {
                ctrl.type = col.type;
                ctrl.setAttribute('controltype', col.type);
            }
            catch (err) { /* Not supported type */ }
            // changes by Anand
            ctrl.value = col.value;
            ctrl.id = settings.idPrefix + '_' + col.name + '_' + uIndex;
            tCell.appendChild(ctrl);
        }
        else {
            if (col.type == 'label' || col.type == 'div') {
                if (!isEmpty(col.isRequired)==true && settings.contentEditable)
                    tCell.appendChild(makeRequiredField());
                ctrl = document.createElement(col.type);
                ctrl.innerHTML = isEmpty(col.value) ? '' : col.value;
            }
            else {
                ctrl = document.createElement('input');
                ctrl.value = isEmpty(col.value) ? '' : col.value;
                ctrl.type = isEmpty(col.type) ? 'text' : col.type;
            }
            ctrl.id = settings.idPrefix + '_' + col.name + '_' + uIndex;
            ctrl.name = ctrl.id;
            //ctrl.style.cssText = 'height:20px;';
            tCell.appendChild(ctrl);
           
        }
        // make required field
        if (!isEmpty(col.isRequired))
            if (col.isRequired && settings.contentEditable) ctrl.setAttribute('required', 'required');
    //    {
    //    ctrl.setAttribute('data-valid', 'required');
    //    ctrl.setAttribute('data-valid-msg', col.name +' is required.');
    //}
        // Add extra control properties
        // Add control CSS as needed
        if (col.ctrlCss != null) $(ctrl).css(col.ctrlCss);
        if (col.type != 'custom' && (settings.contentEditable || col.type == 'button')) {
            // Add control attributes as needed
            if (col.ctrlAttr != null) $(ctrl).attr(col.ctrlAttr);
            // Add control properties as needed
            if (col.ctrlProp != null) $(ctrl).prop(col.ctrlProp);
            // Add control class as needed
            if (col.ctrlClass != null) $(ctrl).addClass(col.ctrlClass);
            // Add jQuery UI tooltip as needed
            if (col.uiTooltip) $(ctrl).tooltip(col.uiTooltip);
            // Add control events as needed
            // radiolist condition check added by anand
            if (col.type != 'radiolist') {
                if (typeof (col.onClick) == 'function') {
                    $(ctrl).click({ caller: tWhole, callback: col.onClick, uIndex: uIndex }, function (evt) {
                        evt.data.callback(evt, $(evt.data.caller).appendGrid('getRowIndex', evt.data.uIndex));
                    });
                }
                if (typeof (col.onChange) == 'function') {
                    $(ctrl).change({ caller: tWhole, callback: col.onChange, uIndex: uIndex }, function (evt) {
                        evt.data.callback(evt, $(evt.data.caller).appendGrid('getRowIndex', evt.data.uIndex));
                    });
                }
            }
            //-----  added by Anand  --------------------------------------------------------------------------------------------
            //var controlId = $('#'+ctrl.id).attr("id");
            var decimalPosition = cfi.IsValidNumeric(ctrl.id);
            if (decimalPosition >= -1) {
                $('#' + ctrl.id).css("text-align", "right");
                cfi.Numeric(ctrl.id, decimalPosition);
            }
            else if (ctrl.getAttribute('controltype') == 'autocomplete') {
                ctrl = document.createElement('input');
                ctrl.type = 'hidden';
                ctrl.id = settings.idPrefix + '_Hdn' + col.name + '_' + uIndex;
                ctrl.name = ctrl.id;
                tCell.appendChild(ctrl);
                col.basedOn = isEmpty(col.basedOn) ? col.textColumn : col.basedOn;
                cfi.GridAutoComplete(settings.idPrefix + '_' + col.name + '_' + uIndex, col.basedOn, col.tableName, col.keyColumn, col.textColumn, col.templateColumn, null, col.filterCriteria, col.separator, col.newAllowed, col.confirmOnAdd, col.procName, col.onSelect);
                document.getElementById(settings.idPrefix + '_' + col.name + '_' + uIndex).setAttribute('onblur', 'javascript:getUpdatedRowIndex(' + uIndex + ');' + col.addOnFunction);
                if ($("#divMulti" + settings.idPrefix + '_' + col.name + '_' + uIndex).find("ul")[0] != undefined)
                    $("#divMulti" + settings.idPrefix + '_' + col.name + '_' + uIndex).find("ul")[0].style.width = "400px";
                   // .css({ "width": "auto" });
               
            }
            else if (ctrl.getAttribute('controltype') == 'timepicker') {
                ctrl.style.fontSize = '12px';
                ctrl.setAttribute('readOnly', 'readOnly');
                $("#" + ctrl.id).kendoTimePicker({ format: "HH:mm", interval: 1 });
            }
            else {
                var alphabetstyle = cfi.IsValidAlphabet(ctrl.id);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        if (!isEmpty($(ctrl).attr('startControl')))
                            $(ctrl).attr('startControl', settings.idPrefix + '_' + $(ctrl).attr('startControl') + '_' + uIndex)
                        if (!isEmpty($(ctrl).attr('endControl')))
                            $(ctrl).attr('endControl', settings.idPrefix + '_' + $(ctrl).attr('endControl') + '_' + uIndex)
                        cfi.DateType(ctrl.id);
                    }
                    else cfi.AlphabetTextBox(ctrl.id, alphabetstyle);
                }
            }
            if (col.type != 'label' && col.type != 'radiolist' && ctrl.type != 'hidden')
                ctrl.setAttribute('onchange', 'javascript:getUpdatedRowIndex(' + uIndex + ');');
            //-------------------------------------------------------------------------------------------------------------------
        }
    }
    function makeRequiredField() {
        ctrl = document.createElement('font');
        ctrl.color = "red";
        //ctrl.innerText = "*";
        ctrl.textContent = "*";
        return ctrl;
    }
    function makeCustomBottomButton(tbWhole, buttonCfg) {
        var exButton = $('<button/>').attr({ type: 'button', tabindex: -1 })
        .button(buttonCfg.uiButton).click({ tbWhole: tbWhole }, buttonCfg.click);
        if (buttonCfg.btnClass) exButton.addClass(buttonCfg.btnClass);
        if (buttonCfg.btnCss) exButton.css(buttonCfg.btnCss);
        if (buttonCfg.btnAttr) exButton.attr(buttonCfg.btnAttr);
        return exButton;
    }
    function makeCustomRowButton(tbWhole, buttonCfg, uniqueIndex) {
        var exButton = $('<button/>').val(uniqueIndex).attr({ type: 'button', tabindex: -1 })
        .button(buttonCfg.uiButton).click({ tbWhole: tbWhole, uniqueIndex: uniqueIndex }, function (evt) {
            //var rowData = $(evt.data.tbWhole).appendGrid('getRowValue', null, evt.data.uniqueIndex);
            //buttonCfg.click(evt, evt.data.uniqueIndex, rowData);
            createUpdateRecord(updatedRows);
        });
        if (buttonCfg.btnClass) exButton.addClass(buttonCfg.btnClass);
        if (buttonCfg.btnCss) exButton.css(buttonCfg.btnCss);
        if (buttonCfg.btnAttr) exButton.attr(buttonCfg.btnAttr);
        return exButton;
    }
    function removeRow(tbWhole, rowIndex, uniqueIndex, force) {
        var settings = $(tbWhole).data('appendGrid');
        var tbBody = tbWhole.getElementsByTagName('tbody')[0];
        if ($.isNumeric(uniqueIndex)) {
            for (var z = 0; z < settings._rowOrder.length; z++) {
                if (settings._rowOrder[z] == uniqueIndex) {
                    rowIndex = z;
                    break;
                }
            }
        }
        if ($.isNumeric(rowIndex)) {
            // Remove middle row
            if (force || typeof (settings.beforeRowRemove) != 'function' || settings.beforeRowRemove(tbWhole, rowIndex)) {
                settings._rowOrder.splice(rowIndex, 1);
                tbBody.deleteRow(rowIndex);
                // Save setting
                saveSetting(tbWhole, settings);
                // Sort sequence
                sortSequence(tbWhole, rowIndex);
                // Trigger event
                if (typeof (settings.afterRowRemoved) == 'function') {
                    settings.afterRowRemoved(tbWhole, rowIndex);
                }
            }
        }
        else {
            // Remove last row
            if (force || typeof (settings.beforeRowRemove) != 'function' || settings.beforeRowRemove(tbWhole, settings._rowOrder.length - 1)) {
                uniqueIndex = settings._rowOrder.pop();
                tbBody.deleteRow(-1);
                // Save setting
                saveSetting(tbWhole, settings);
                // Trigger event
                if (typeof (settings.afterRowRemoved) == 'function') {
                    settings.afterRowRemoved(tbWhole, null);
                }
            }
        }
        // Add empty row
        if (settings._rowOrder.length == 0) {
            var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
            $('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty)); 
            document.getElementById(settings.idPrefix + '_btnUpdateAll').style.display = 'none';
            document.getElementById(settings.idPrefix + '_btnRemoveLast').style.display = 'none';
        }
    }
    function emptyGrid(tbWhole) {
        // Load settings
        var settings = $(tbWhole).data('appendGrid');
        // Remove rows
        $('tbody', tbWhole).empty();
        settings._rowOrder.length = 0;
        settings._uniqueIndex = 0;
        // Save setting
        saveSetting(tbWhole, settings);
        // Add empty row
        if (settings._rowOrder.length == 0) {
            var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
            $('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty));
        }
    }
    function sortSequence(tbWhole, startIndex) {
        var settings = $(tbWhole).data('appendGrid');
        if (!settings.hideRowNumColumn) {
            for (var z = startIndex; z < settings._rowOrder.length; z++) {
                $('#' + settings.idPrefix + '_Row_' + settings._rowOrder[z] + ' td.first', tbWhole).text(z + 1);
            }
        }
    }
    function loadData(tbWhole, records, isInit) {
        var tbBody, tbRow, tbCell, uniqueIndex, insertResult, ctrType;
        var settings = $(tbWhole).data('appendGrid');
        if (settings) {
            // Clear existing content
            tbBody = tbWhole.getElementsByTagName('tbody')[0];
            $(tbBody).empty();
            settings._rowOrder.length = 0;
            settings._uniqueIndex = 0;
            // Check any records
            if (records != null && records.length) {
                // Add rows
                insertResult = insertRow(tbWhole, records.length, null, null);
                // Set data
                for (var r = 0; r < insertResult.addedRows.length; r++) {
                    for (var c = 0; c < settings.columns.length; c++) {
                        ctrType = (!isEmpty(settings.columns[c].ctrlAttr) ? (!isEmpty(settings.columns[c].ctrlAttr.controltype) ? settings.columns[c].ctrlAttr.controltype : settings.columns[c].type) : settings.columns[c].type);
                        ctrType = ctrType == '' ? 'label' : ctrType;
                        //-----  added by Anand for autocomplete and div --------------------------------------------------------------------------------------------
                        //if (!settings.contentEditable && ctrType == 'hidden')
                        //    continue;
                        if (ctrType == 'autocomplete' && records[r][settings.columns[c].name].split(',').length > 0 && document.getElementById('Multi_' + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r])!=null) {
                            //Multi_tblShipmentDetail0_SPHCSNo_1
                            //FieldKeyValuestblShipmentDetail0_SPHCSNo_1
                            //$('#' + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).closest('td').attr('class', 'formInputcolumn');
                            //$("#divMulti" + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).find("ul").css({ "width": "100px" });
                            document.getElementById(settings.idPrefix + '_Hdn' + settings.columns[c].name + '_' + settings._rowOrder[r]).value = records[r]['Hdn' + settings.columns[c].name];
                            document.getElementById('Multi_' + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).value = records[r]['Hdn' + settings.columns[c].name];
                            document.getElementById('FieldKeyValues' + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).innerHTML = records[r]['Hdn' + settings.columns[c].name];
                            var multiLI = $("#divMulti" + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).find("ul").html();
                            $("#divMulti" + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).find("ul").html('');
                            var Li = '';
                            for (var g = 0; g < records[r][settings.columns[c].name].split(',').length; g++) {
                                if (records[r][settings.columns[c].name].split(',')[g] != '') {
                                    Li = Li + '<li class="k-button" style="margin-right: 3px; margin-bottom: 3px;" id="' + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]+'"><span>' + records[r][settings.columns[c].name].split(',')[g] + '</span><span class="k-icon k-delete" id="' + records[r]['Hdn' + settings.columns[c].name].split(',')[g] + '"></span></li>';
                                }
                            }
                            $("#divMulti" + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).find("ul").html(multiLI + Li);
                            $('.k-delete').click(function () {
                                if (this.parentNode.id.split('_')[1] != undefined) {
                                    var curColName = this.parentNode.id.split('_')[1];// $('#' + $(this)[0].id).closest('li')[0].id.split('_')[1];
                                    var curRNo = this.parentNode.id.split('_')[2];
                                    $(this).parent().remove();
                                    if ($("div[id='divMulti" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").text().indexOf($(this)[0].id + ",") > -1) {
                                        var ll = $("div[id='divMulti" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").text().replace($(this)[0].id + ",", '');
                                        $("div[id='divMulti" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").text(ll);
                                        $('#' + settings.idPrefix + '_Hdn' + curColName + '_' + curRNo).val(ll);
                                    }
                                    else {
                                        var l = $("div[id='divMulti" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").text().replace($(this)[0].id, '');
                                        $("div[id='divMulti" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").text(l);
                                        $('#' + settings.idPrefix + '_Hdn' + curColName + '_' + curRNo).val(l);
                                    }
                                    $("div[id='divMulti" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").find("input:hidden[name^='Multi_" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").val($("div[id='divMulti" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + curColName + "_" + curRNo + "']").text());
                                    getUpdatedRowIndex(curRNo);
                                }
                            });
                            }
                        //    for (var g = 0; g < records[r][settings.columns[c].name].split(',').length; g++) {
                        //        if (records[r][settings.columns[c].name].split(',')[g] != '') {
                        //            Li = Li + '<li class="k-button" style="margin-right: 3px; margin-bottom: 3px;"><span>' + records[r][settings.columns[c].name].split(',')[g] + '</span><span class="k-icon k-delete" id="' + records[r]['Hdn' + settings.columns[c].name].split(',')[g] + '"></span></li>';
                        //        }
                        //    }
                        //    $("#divMulti" + settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).find("ul").html(multiLI + Li);
                        //    $('.k-delete').click(function () {
                        //        $(this).parent().remove();
                        //        if ($("div[id='divMulti" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").text().indexOf($(this)[0].id + ",") > -1) {
                        //            var ll = $("div[id='divMulti" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").text().replace($(this)[0].id + ",", '');
                        //            $("div[id='divMultiSHCSNo']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").text(ll);
                        //            $('#' + settings.idPrefix + '_Hdn' + settings.columns[c].name + '_' + settings._rowOrder[r]).val(ll);
                        //        }
                        //        else {
                        //            var l = $("div[id='divMulti" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").text().replace($(this)[0].id, '');
                        //            $("div[id='divMulti" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").text(l);
                        //            $('#' + settings.idPrefix + '_Hdn' + settings.columns[c].name + '_' + settings._rowOrder[r]).val(l);
                        //        }
                        //        $("div[id='divMulti" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").find("input:hidden[name^='Multi_" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").val($("div[id='divMulti" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").find("span[name^='FieldKeyValues" + settings.idPrefix + "_" + settings.columns[c].name + "_" + settings._rowOrder[r] + "']").text());
                        //    });
                        //}
                        else if (ctrType == 'autocomplete') {
                            document.getElementById(settings.idPrefix + '_Hdn' + settings.columns[c].name + '_' + settings._rowOrder[r]).value = records[r]['Hdn' + settings.columns[c].name];
                            document.getElementById(settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).value = records[r][settings.columns[c].name];
                        }
                        else if (ctrType == 'div') {
                            for (var d = 0; d < settings.columns[c].divElements.length; d++) {
                                ctrType = (!isEmpty(settings.columns[c].divElements[d].ctrlAttr) ? (!isEmpty(settings.columns[c].divElements[d].ctrlAttr.controltype) ? settings.columns[c].divElements[d].ctrlAttr.controltype : settings.columns[c].divElements[d].type) : settings.columns[c].divElements[d].type);
                                ctrType = ctrType == '' ? 'label' : ctrType;
                                if (ctrType == 'autocomplete') {
                                    document.getElementById(settings.idPrefix + '_Hdn' + settings.columns[c].divElements[d].name + '_' + settings._rowOrder[r]).value = records[r]['Hdn' + settings.columns[c].divElements[d].name];
                                    document.getElementById(settings.idPrefix + '_' + settings.columns[c].divElements[d].name + '_' + settings._rowOrder[r]).value = records[r][settings.columns[c].divElements[d].name];
                                }
                                else
                                    setCtrlValue(ctrType, settings.columns[c].divElements[d].name, settings._rowOrder[r], records[r][settings.columns[c].divElements[d].name]);
                            }
                        }
                            //-------------------------------------------------------------------------------------------------------------------
                        else
                            setCtrlValue(ctrType, settings.columns[c].name, settings._rowOrder[r], records[r][settings.columns[c].name]);
                    }
                }
            }
            // Save setting
            settings._isDataLoaded = true;
            if (isInit) settings.initData = null;
            $(tbWhole).data('appendGrid', settings);
            // Trigger data loaded event
            if (typeof (settings.dataLoaded) == 'function') {
                settings.dataLoaded(tbWhole);
            }
        }
    }
    function findRowIndex(uniqueIndex, settings) {
        for (var z = 0; z < settings._rowOrder.length; z++) {
            if (settings._rowOrder[z] == uniqueIndex) {
                return z;
            }
        }
        return null;
    }
    function getObjValue(obj, key) {
        if (!isEmpty(obj) && $.isPlainObject(obj) && !isEmpty(obj[key])) {
            return obj[key];
        }
        return null;
    }
    function saveSetting(tbWhole, settings) {
        $(tbWhole).data('appendGrid', settings);
        $('#' + settings.idPrefix + '_rowOrder', tbWhole).val(settings._rowOrder.join());
    }
    function getRowIndex(settings, uniqueIndex) {
        var rowIndex = null;
        for (var z = 0; z < settings._rowOrder.length; z++) {
            if (settings._rowOrder[z] == uniqueIndex) {
                return z;
            }
        }
        return rowIndex;
    }
    function getCellCtrl(type, idPrefix, columnName, uniqueIndex) {
        return document.getElementById(idPrefix + '_' + columnName + '_' + uniqueIndex);
    }
    function getCtrlValue(type, columnName, uniqueIndex) {
        var ctrl = null;
        if (type == 'checkbox') {
            ctrl = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
            if (ctrl == null)
                return null;
            else
                return ctrl.checked ? 1 : 0;
        }
            //-----  added by Anand --------------------------------------------------------------------------------------------
        else if (type == 'radiolist') {
            var rbl = document.getElementsByName(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex);
            for (var index = 0; index < rbl.length; index++) {
                if (document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + index).checked) {
                    return document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + index).value;
                    break;
                }
                else
                    continue;
            }

        }
            //-------------------------------------------------------------------------------------------------------------------

        else {
            ctrl = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
            if (ctrl == null)
                return null;
            else
                return ctrl.value;
        }
    }
    function getRowValue(settings, uniqueIndex, loopIndex) {
        var result = {}, keyName = null;
        for (var z = 0; z < settings.columns.length; z++) {
            if (settings.columns[z].type == 'div') {
                for (var a = 0; a < settings.columns[z].divElements.length; a++) {
                    keyName = settings.columns[z].divElements[a].name + (isEmpty(loopIndex) ? '' : '_' + loopIndex);
                    result[keyName] = getCtrlValue((!isEmpty(settings.columns[z].divElements[a].ctrlAttr) ? (!isEmpty(settings.columns[z].divElements[a].ctrlAttr.controltype) ? settings.columns[z].divElements[a].ctrlAttr.controltype : settings.columns[z].divElements[a].type) : settings.columns[z].divElements[a].type), settings.columns[z].divElements[a].name, uniqueIndex);
                }
            }
            else {
                keyName = settings.columns[z].name + (isEmpty(loopIndex) ? '' : '_' + loopIndex);
                result[keyName] = getCtrlValue(settings.columns[z].type, settings.columns[z].name, uniqueIndex);
            }
        }
        return result;
    } 
    function setCtrlValue(type , columnName,  uniqueIndex, data) {
        // radio condition added by Anand
        if (type == 'checkbox' || type == 'radio') {
            getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).checked = (data != null && data != 0);
        }
        //-----  added by Anand --------------------------------------------------------------------------------------------
        if (type == 'radiolist') {
            var rbl = document.getElementsByName(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex);
            for (var index = 0; index < eval(rbl.length + 1) ; index++) {
                if (document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + index) != null) {
                    try { document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + index).checked = document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + index).value == (data == null ? '' : data); }
                    catch (e) {
                        document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + index).checked = document.getElementById(settings.idPrefix + '_Lbl' + columnName + '_' + uniqueIndex + '_' + index).innerHTML == (data == null ? '' : data);
                    }
                }
            }
        }
        else if (type == 'label') {
            getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).innerHTML = (data == null ? '' : data);
        }
        else if (type == 'number' || type == 'decimal1' || type == 'decimal2' || type == 'decimal3' || type == 'decimal4' || type == 'decimal5') {
            getCellCtrl(type, '_temp' + settings.idPrefix, columnName, uniqueIndex).value = (data == null ? '' : data);
            getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).value = (data == null ? '' : data);
        }
            //-------------------------------------------------------------------------------------------------------------------
        else {
            getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).value = (data == null ? '' : data);
        }
      
    }
    function gridRowDragged(tbWhole, isMoveUp, uniqueIndex, tbRowIndex) {
        // Get setting
        var settings = $(tbWhole).data('appendGrid');
        // Find the start sorting index
        var startIndex = -1;
        for (var z = 0; z < settings._rowOrder.length; z++) {
            if (settings._rowOrder[z] == uniqueIndex) {
                if (isMoveUp) {
                    startIndex = tbRowIndex;
                    settings._rowOrder.splice(z, 1);
                    settings._rowOrder.splice(tbRowIndex, 0, uniqueIndex);
                } else {
                    startIndex = z;
                    settings._rowOrder.splice(tbRowIndex + 1, 0, uniqueIndex);
                    settings._rowOrder.splice(z, 1);
                }
                break;
            }
        }
        // Do re-order
        sortSequence(tbWhole, startIndex);
        // Save setting
        saveSetting(tbWhole, settings);
    }
    //-----  added by Anand  --------------------------------------------------------------------------------------------
    function createPaging(tbCell) {
        // page size
        var ctrl = document.createElement('select');
        ctrl.id = settings.idPrefix+ '_ddlPageSize';
        ctrl.name = ctrl.id;
        ctrl.style.cssFloat = 'right';
        //ctrl.options[ctrl.options.length] = new Option(settings.columns[y].ctrlOptions[x].label, settings.columns[y].ctrlOptions[x].value);
        ctrl.options[0] = new Option('5', '5');
        ctrl.options[1] = new Option('10', '10');
        ctrl.options[2] = new Option('20', '20');
        ctrl.options[3] = new Option('50', '50');
        ctrl.options[4] = new Option('100', '100');
        ctrl.setAttribute('onchange', 'javascript:setPageSize();');
        $(ctrl).val(settings.itemsPerPage);
        //getRecord(' + settings.Paging.mSNo + ', ' + tbWhole.id + ', ' + settings.Paging.sName + ', ' + settings.Paging.sMethod + ', ' + settings.Paging.pNo + ', ' + settings.Paging.pSize + ', ' + settings.Paging.wCondition + ', ' + settings.Paging.sort + ');') + '
        tbCell.appendChild(ctrl);
        ctrl = document.createElement('span');
        ctrl.id = settings.idPrefix + '_spanPageSize';
        ctrl.name = ctrl.id;
        ctrl.style.cssFloat = 'right';
        ctrl.style.paddingRight = '5px';
        ctrl.innerHTML = 'Page Size: ';
        tbCell.appendChild(ctrl);
        ctrl = document.createElement('div');
        ctrl.id = settings.idPrefix + '_pageNavPosition';
        ctrl.name = ctrl.id;
        ctrl.style.cssFloat = 'right';
        ctrl.style.paddingRight = '10px';
        tbCell.appendChild(ctrl);
    }
    //-------------------------------------------------------------------------------------------------------------------
    /// <summary>
    /// Initialize append grid or calling its methods.
    /// </summary>
    $.fn.appendGrid = function (params) {
        if (_methods[params]) {
            return _methods[params].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof (params) === 'object' || !params) {
            return _methods.init.apply(this, arguments);
        } else {
            $.error(_systemMessages.notSupportMethod + params);
        }
    };
})(jQuery);
//-----  added by Anand  --------------------------------------------------------------------------------------------
//function isEmpty(value) {
//    return typeof (value) == 'undefined' || value == null;
//}

// Load data
function getRecord() {
    if ((settings == null ? 0 : settings.masterTableSNo) > 0) {
        $.ajax({
            type: "GET",
            async: isDataLoad==true,
            cache: false,
            url: settings.servicePath + "/" + settings.getRecordServiceMethod + "?recid=" + settings.masterTableSNo + "&pageNo=" + (settings.currentPage == null ? 1 : settings.currentPage) + "&pageSize=" + (settings.itemsPerPage == null ? 10 : settings.itemsPerPage) + "&whereCondition=" + (settings.whereCondition == null ? '' : settings.whereCondition) + "&sort=" + (settings.sort == null ? '' : settings.sort),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true,
            success: function (data) {
                if (data.key >= 0)
                    $('#' + settings.tableID).appendGrid('load', data.value);
                else {
                    if (document.getElementById(settings.idPrefix + '_btnUpdateAll') != null)
                        document.getElementById(settings.idPrefix + '_btnUpdateAll').style.display = 'none';
                    if (document.getElementById(settings.idPrefix + '_btnRemoveLast') != null)
                        document.getElementById(settings.idPrefix + '_btnRemoveLast').style.display = 'none';
                }
                totalRows = data.key;
                if (settings.isPaging && !isDataLoad && settings.currentPage == 1)//
                    showPage(settings.currentPage);
                isDataLoad = true;
                if (typeof (settings.rowUpdateExtraFunction) == 'function') {
                    settings.rowUpdateExtraFunction(settings.idPrefix);
                }
            },
            error: AjaxFailed
        });

    }

}
// get updated row index
function getUpdatedRowIndex(Index) {
    updatedRows[updatedRows.length] = eval(Index);
}
// create and update data
function createUpdateRecord(uRows) {
    try {
        if ($.isArray(uRows)) {
            uRows.sort();
            uRows = jQuery.unique(uRows);
        }
        var isExist = false;
        for (var i = 0; i < uRows.length; i++) {
            isExist = false;
            for (var j = 0; j < $('#' + settings.tableID + '_rowOrder').val().split(',').length; j++) {
                if ($('#' + settings.tableID + '_rowOrder').val().split(',')[j] == uRows[i]) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist)
                uRows.splice(i, 1);
        }

        if (validateTableData(settings.tableID, uRows)) {
            //var strData = getRowValue(settings, uRows);
            var strData = tableToJSON(settings.tableID, settings.columns, uRows);


            //return false;
            if (strData == '[]') {
                ShowMessage('success', 'Success!', 'Record Updated Successfully.');
            }
            else {
                $.ajax({
                    type: "POST",
                    async: false,
                    url: settings.servicePath + "/" + settings.createUpdateServiceMethod + "?strData=" + strData,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    processData: true,
                    success: function (result) {
                       
                        var resultArray = result[0].split('~^~'); // Send message with errorkey by purushottam Kumar
                        var errorKey = 0;
                        if (resultArray.length > 1) // Check length is exists or not  purushottam Kuma
                            errorKey = result[0].split('~^~')[1]; // Extact the error key purushottam Kumar 

                        result = result[0].split('~^~')[0]; // Message with restore orginal value  
                        if (!isEmpty(result) != '') { //result not blank
                            if (result.replace('<value>', '').replace('</value>', '').substring(0, 6) == 'Please')
                                ShowMessage('warning', '', result.replace('<value>', '').replace('</value>', ''));
                            else
                                AjaxSucceeded(result.replace('<value>', '').replace('</value>', ''));
                        }
                        isDataLoad = false;
                        // Check error key for message insert, update, delete to bind grid other wise grid not bind and message shows
                        ////if (errorKey == "2000" || errorKey == "2001" || errorKey == "2002") {
                        //if (errorKey != "" || !isEmpty(result) != '') {
                        //    if (settings.currentPage == 1)
                        //        getRecord();
                        //    else
                        //        showPage(settings.currentPage);
                        //}
                        getRecord();
                        showPage(settings.currentPage);
                        if ($.isArray(uRows))
                            uRows.splice(0, uRows.length);
                        //return true;
                    },
                    error: AjaxFailed
                });
                return isDataLoad;
            }

        }
        else
            return false;
    }
    catch (e) { return false; }
}
// delete data
function deleteRecord(rowNo) {
    rowNo = eval($('#' + settings.tableID + '_rowOrder').val().split(',')[eval(rowNo - 1)]);
    try {
        var strData = $('#' + settings.tableID + '_SNo_' + rowNo).val();
        if (strData == 0 || strData == undefined) {
            $('#' + settings.tableID).appendGrid('removeRow', null, rowNo);
            //rowNo == $('#' + settings.tableID).appendGrid('getRowCount') ? null :
        }
        else {
            $.ajax({
                type: "POST",
                url: settings.servicePath + "/" + settings.deleteServiceMethod + "?recid=" + strData,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true,
                beforeSend: function () {
                    return confirm("Are you sure you want to delete this record?");
                },
                success: function (result) {
                    if (!isEmpty(result[0])!='')
                        AjaxSucceeded(result[0].replace('<value>', '').replace('</value>', ''));
                    //location.reload(true);
                    isDataLoad = false;
                    //if (settings.isPaging)
                    //    showPage(settings.currentPage);//setPageSize();//
                    //else
                        getRecord();
                    showPage(settings.currentPage);
                },
                error: AjaxFailed
            });
        }
        //var i = $.inArray(rowNo, $.unique(updatedRows));
        updatedRows = $.unique(updatedRows);

        for (var i = 0; i < updatedRows.length; i++) {
            // Skip accessing in sparse arrays//$('#tblBayLoadingTypeTrans_rowOrder').val().split(',')[rowNo]
            if (updatedRows[i] === rowNo) {
                updatedRows.splice(i, 1);
            }
            //for (var j = 0; j < $('#' + settings.tableID + '_rowOrder').val().split(',').length; j++) {
            //    if ($('#' + settings.tableID + '_rowOrder').val().split(',')[j] != updatedRows[i])
            //        updatedRows.splice(i, 1);
            //}
        }
        //if (i >= 0) updatedRows.splice(i, 1);
        return true;
    }
    catch (e) { return false; }
}
function AjaxSucceeded(result) {
    ShowMessage('success', 'Success!', result);
    //alert(result);
}
function AjaxFailed(result) {
    ShowMessage('error', 'Need your Kind Attention!', result);
    //alert(result.status + ' ' + result.statusText);
}
// convert table data to JSON
function getJSONDataString(tableName, colName, type, rIndex) {
    var str = '';
    if (colName.type == 'radio' || colName.type == 'checkbox')
        str += '"' + colName.name + '":"' + (document.getElementById(tableName + '_' + colName.name + '_' + rIndex).checked ? 1 : 0) + '"';
    else if ((!isEmpty(colName.ctrlAttr) ? (!isEmpty(colName.ctrlAttr.controltype) ? colName.ctrlAttr.controltype : colName.type) : colName.type) == 'autocomplete') {
        //if ($('#' + tableName + '_Hdn' + colName.name + '_' + rIndex).val().split(',').length > 0) {
        //    str += '"Hdn' + colName.name + '":"' + document.getElementById('Multi_' + tableName + '_' + colName.name + '_' + rIndex).value + '",';
        //    str += '"' + colName.name + '":"' + $('#' + tableName + '_' + colName.name + '_' + rIndex).val() + '"';
        //}
        //else {
            str += '"Hdn' + colName.name + '":"' + $('#' + tableName + '_Hdn' + colName.name + '_' + rIndex).val() + '",';
            str += '"' + colName.name + '":"' + $('#' + tableName + '_' + colName.name + '_' + rIndex).val() + '"';
        //}
    }
    else if (!isEmpty($('#' + tableName + '_' + colName.name + '_' + rIndex).attr('data-role')) && $('#' + tableName + '_' + colName.name + '_' + rIndex).attr('data-role') == 'numerictextbox') {
        str += '"' + colName.name + '":"' + $('#_temp' + tableName + '_' + colName.name + '_' + rIndex).val() + '"';
    }
    else if (colName.type == 'radiolist') {
        for (var x in colName.ctrlOptions) {
            if (document.getElementById(tableName + '_Rbtn' + colName.name + '_' + rIndex + '_' + x).checked)
                str += '"' + colName.name + '":"' + $('#' + tableName + '_Rbtn' + colName.name + '_' + rIndex + '_' + x).val() + '"';
        }
    }
    else if (colName.type == 'label')
        str += '"' + colName.name + '":"' + $('#' + tableName + '_' + colName.name + '_' + rIndex).html() + '"';
    else
        str += '"' + colName.name + '":"' + $('#' + tableName + '_' + colName.name + '_' + rIndex).val() + '"';
    return str;
}

function tableToJSON(tableName, colName, uRows) {
    try {
        var noOfRows;
        if (!$.isArray(uRows)) {
            noOfRows = new Array();
            noOfRows[0] = uRows;
        }
        else {
            uRows.sort();
            uRows = jQuery.unique(uRows);
            noOfRows = uRows;
        }
        
        var strJSON = '[';
        for (var row = 0; row < noOfRows.length; row++) {
            strJSON += '{';
            for (var col = 0; col < colName.length; col++) {
                if (colName[col].type == 'div') {
                    for (var d = 0; d < colName[col].divElements.length; d++) {
                        if (colName[col].divElements[d].type != 'label') {
                            strJSON += getJSONDataString(tableName, colName[col].divElements[d], colName[col].divElements[d].type, noOfRows[row]);
                            if (d <= (colName[col].divElements.length - 1))
                                strJSON += ',';
                        }
                    }
                }
                else if (colName[col].type != 'label') {
                    strJSON += getJSONDataString(tableName, colName[col], colName[col].type, noOfRows[row]);
                    if (col < (colName.length - 1))
                        strJSON += ',';
                }
            }
            strJSON += '}';
            if (row < noOfRows.length - 1)
                strJSON += ',';
        }
        // }
        strJSON += ']';
        return strJSON;
    }
    catch (e) { return '[]'; }
}



// validate table text boxes
function validateTableData(id, uRows) {
    var upRows;
    if (!$.isArray(uRows)) {
        upRows = new Array();
        upRows[0] = uRows;
    }
    else
        upRows = uRows;
    var isValid = true;
    $('#' + id + (upRows.length != 1 ? ' tr input[id*="' + id + '_"]' : ' input[id*="_' + upRows[0] + '"]')).each(function () {
        if (this.dataset.role == 'autocomplete' && this.type != 'hidden' && this.required) {
            var inputID = this.id;
            if (inputID.split('_').length == 3)
                inputID = inputID.split('_')[0] + '_Hdn' + inputID.split('_')[1] + '_' + inputID.split('_')[2];
            if ($.trim($('#' + inputID).val()) == '') {
                isValid = false;
                $(this).css({ "border": "1px solid red", "background": "#FFCECE" });
            }
            else $(this).css({"border": "","background": ""});
        }//'alphanumericupper'
        else if((this.dataset.role == 'numerictextbox' || this.dataset.role == 'decimal1' || this.dataset.role == 'decimal2' || this.dataset.role == 'decimal3' || this.dataset.role == 'decimal4' || this.dataset.role == 'decimal5') && this.required) {
            if (eval($.trim($('#_temp' + this.id).val())) == 0 || $.trim($('#_temp' + this.id).val())=='') {
                isValid = false;
                $('#_temp' + this.id).css({ "border": "1px solid red", "background": "#FFCECE" });
            } else $('#_temp' + this.id).css({ "border": "", "background": "" });
        }
        else if (this.type == 'radio' && this.required) {
            if ($("input:radio[name=" + this.id.split('_')[0] + '_' + this.id.split('_')[1] + '_' + this.id.split('_')[2] + "]:checked").val() == undefined) {
                isValid = false;
                $('#table' + this.id.split('_')[1] + this.id.split('_')[2]).css({ "border": "1px solid red","background": "#FFCECE" });
            }
            else  $('#table' + this.id.split('_')[1] + this.id.split('_')[2]).css({"border": "","background": ""});
        }
        //else if (($.trim($(this).val()) == '' || ($(this).attr('minlength') != undefined ? $.trim($(this).val()).length != eval($(this).attr('minlength')) : 0 != 0)) && this.type != 'hidden' && this.required) {
        else if (($.trim($(this).val()) == '' || ($(this).attr('minlength') != undefined ? $.trim($(this).val()).length < eval($(this).attr('minlength')) : 0 != 0)) && this.type != 'hidden' && this.required) {
            isValid = false;
            $(this).css({ "border": "1px solid red", "background": "#FFCECE" });
        }
        else if (this.id.split('_')[1].toUpperCase() == 'MAWBNO' ) {
            if (CheckAWBNumberFormat(this.id, "0")) {
                $('#' + id).css({
                    "border": "",
                    "background": ""
                });
            }
            else if(this.required) {
                isValid = false;
                $('#' + id).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
        }
        else $(this).css({ "border": "", "background": "" });
    });
    return isValid;
}
// export to excel
function exportToExcel(evt) {

    if ((settings == null ? 0 : settings.masterTableSNo) > 0) {
        $.ajax({
            type: "GET",
            //async: isDataLoad == true,
            cache: false,
            url: settings.servicePath + "/" + settings.getRecordServiceMethod + "?recid=" + settings.masterTableSNo + "&pageNo=" + (settings.currentPage == null ? 1 : settings.currentPage) + "&pageSize=" + totalRows + "&whereCondition=" + (settings.whereCondition == null ? '' : settings.whereCondition) + "&sort=" + (settings.sort == null ? '' : settings.sort),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.key >= 0) {///Services/CommonService.svc/DataExport?strJSON=" + data.value + 
                    var jsonString = JSON.stringify(data.value);
                    $('body').prepend("<form method='post' action='/Common/exportPage.cshtml?columnNames="+settings.tableColumns+"&exportType=Excel' style='top:-3333333333px;' id='tempForm'><input type='hidden' name='hdnExportData' value='" + jsonString + "' ></form>");
                    $('#tempForm').submit();
                    $("tempForm").remove();
                    return false;
                }
            },
            error: AjaxFailed
        });

    }


    //var html = document.getElementById(settings.tableID).outerHTML;
    //window.open('data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html));
    //evt.preventDefault();
   

}
function setPageSize() {
    settings.itemsPerPage = $('#' + settings.idPrefix + '_ddlPageSize').val();
    settings.currentPage = 1;
    isDataLoad = false;
    getRecord();
}
function showPage(pageNumber) {
    try {
        //settings.currentPage = pageNumber;
        // getRecord();
        // for on page selection of paging and change page size
        if ((settings.currentPage > 1 || pageNumber > 1 || settings.itemsPerPage != $('#' + settings.idPrefix + '_ddlPageSize').val())) {
            settings.currentPage = pageNumber;
            getRecord();
        }
        else {
            settings.itemsPerPage = $('#' + settings.idPrefix + '_ddlPageSize') == null || $('#' + settings.idPrefix + '_ddlPageSize').val() == 'undefined' ? 10 : $('#' + settings.idPrefix + '_ddlPageSize').val();
        }
        // check total rows
        if (totalRows > 0) {

            // set no of pages
            pages = Math.ceil(totalRows / settings.itemsPerPage);
            // set start page
            var startPage = Math.floor((pageNumber - 1) * 0.1) * 10;
            // show pageing navigation
            showPageNav(startPage + 1);
            var oldPageAnchor = document.getElementById(settings.idPrefix + '_pg' + settings.currentPage);
            if (oldPageAnchor != null) {
                oldPageAnchor.className = 'pg-normal';
            }
            // set current page, set css for selected page number
            settings.currentPage = pageNumber;
            var newPageAnchor = document.getElementById(settings.idPrefix + '_pg' + settings.currentPage);
            if (newPageAnchor != null) {
                newPageAnchor.className = 'pg-selected';
            }
            // set page start and end index as [1-10]
            pageStart = (pageNumber - 1) * settings.itemsPerPage + 1;
            pageEnd = (pageStart + eval(settings.itemsPerPage)) - 1;
            // set paging message as 'Showing 1 to 10 of 12 rows.'
            //var footerMessage = document.getElementById('divStatusMsg');
            document.getElementById(settings.idPrefix + '_divStatusMsg').innerHTML = 'Showing ' + pageStart + ' to ' + (pageEnd > totalRows ? totalRows : pageEnd) + ' of ' + totalRows + ' rows.';
            //$('div[id*="divStatusMsg"]').innerHTML('Showing ' + pageStart + ' to ' + (pageEnd > totalRows ? totalRows : pageEnd) + ' of ' + totalRows + ' rows.');
            // set first,previous,next and last options in paging
            var pgFirst = document.getElementById(settings.idPrefix + '_pgFirst');
            var pgNext = document.getElementById(settings.idPrefix + '_pgNext');
            var pgPrev = document.getElementById(settings.idPrefix + '_pgPrev');
            var pgLast = document.getElementById(settings.idPrefix + '_pgLast');

            if (pgFirst != null) {
                if (settings.currentPage == 1) pgFirst.style.display = 'none';
                else pgFirst.style.display = '';
            }

            if (pgPrev != null) {
                if (settings.currentPage == 1) pgPrev.style.display = 'none';
                else pgPrev.style.display = '';
            }

            if (pgNext != null) {
                if (settings.currentPage == pages) pgNext.style.display = 'none';
                else pgNext.style.display = '';
            }

            if (pgLast != null) {
                if (settings.currentPage == pages) pgLast.style.display = 'none';
                else pgLast.style.display = '';
            }
        } else { document.getElementById(settings.idPrefix + '_divStatusMsg').innerHTML = ''; }

    }
    catch (e)
    { }
}
// set first button on paging functionality
function first() {
    if (settings.currentPage > 1)
        showPage(1);
}
// set previous button on paging functionality
function prev() {
    if (settings.currentPage > 1)
        showPage(settings.currentPage - 1);
}
// set next button on paging functionality
function next() {
    if (settings.currentPage < pages)
        showPage(settings.currentPage + 1);

}
// set last button on paging functionality
function last() {
    if (settings.currentPage < pages)
        showPage(pages);

}

function showPageNav(start) {
    try {
        // get div id
        var element = document.getElementById(settings.idPrefix + '_pageNavPosition');
        // set paging loop, only for 10 pages
        var loopEnd = start + 9;
        var pagerHtml = '';
        // if page count is greater than 1 then show first and previous button
        if (pages >= 2) {
            pagerHtml += '<span id="' + settings.idPrefix + '_pgFirst" onclick="first();" class="pg-normal" title="First Page"><img src="Images/firstPage.png" alt="First" /></span>';
            //pagerHtml += '&nbsp';
            pagerHtml += '<span id="' + settings.idPrefix + '_pgPrev" onclick="prev();" class="pg-normal" title="Previous Page"><img src="Images/prevPage.png" alt="Previous"/></span>';
            //pagerHtml += '&nbsp';
        }
        // set ... for more than 10 pages
        if (start > 10)
            pagerHtml += '<span class="regularDataBlue" title="Page No.' + (start - 10) + '-' + (start - 1) + '" onclick="showPage(' + (start - 5) + ');">.....</span>';
        // show page numbers
        for (var page = start; page <= loopEnd; page++) {
            if (page > pages) break;
            pagerHtml += '<span id="' + settings.idPrefix + '_pg' + page + '" class="pg-normal" onclick="showPage(' + page + ');">' + page + '</span>';
        }
        page--;
        // set ... if number of pages is greater than number of loop page
        if (pages > page)
            pagerHtml += '<span class="regularDataBlue" title="Page No.' + (loopEnd + 1) + '-' + ((loopEnd + 10) > pages ? pages : (loopEnd + 10)) + '" onclick="showPage(' + (loopEnd + 1) + ');">.....</span>';
        // show next button
        pagerHtml += '<span id="' + settings.idPrefix + '_pgNext" onclick="next();" class="pg-normal" title="Next Page"><img src="Images/nextPage.png" alt="Next"/></span>';
        // show last button
        pagerHtml += '<span id="' + settings.idPrefix + '_pgLast" onclick="last();" class="pg-normal" title="Last Page"><img src="Images/lastPage.png" alt="Last"/></span>';
        element.innerHTML = pagerHtml;
    }
    catch (e)
    { }
}
function showDiv() {
    // '+' button click functionality
    document.getElementById('divBrowse').style.display = document.getElementById('divBrowse').style.display == 'block' ? 'none' : 'block';
    document.getElementById('spanExpand').style.display = document.getElementById('divBrowse').style.display == 'block' ? 'none' : 'block';
    document.getElementById('spanCollapse').style.display = document.getElementById('divBrowse').style.display == 'block' ? 'block' : 'none';

}
//-------------------------------------------------------------------------------------------------------------------