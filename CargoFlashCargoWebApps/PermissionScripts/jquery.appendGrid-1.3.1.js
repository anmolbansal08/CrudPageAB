/*!
* jQuery appendGrid v1.3.1
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
var settings = null, totalRows = null, pages = null, isDataLoaded = false;
var updatedRows = new Array();
(function ($) {
    // The default initial options.
    var _defaultInitOptions = {
        // database t
        tableID:null,
        tableColumns:null,
        masterTableSNo:null,
        currentPage: null,
        itemsPerPage: null,
        whereCondition:null,
        sort: null,
        serviceName: null,
        getRecordServiceMethod: null,
        createUpdateServiceMethod: null,
        deleteServiceMethod: null,
        // The text as table caption, set null to disable caption generation.
        caption: null,
        // The total number of empty rows generated when init the grid. This will be ignored if `initData` is assigned.
        initRows: 2,
        // An array of data to be filled after initialized the grid.
        initData: null,
        // Array of column options.
        columns: null,
        // Labels or messages used in grid.
        i18n: null,
        // The ID prefix of controls generated inside the grid. Table ID will be used if not defined.
        idPrefix: null,
        // Adding paging option in Caption row
        isPaging: null,
        // Adding row filter option in Caption row
        isFilter: null,
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
        // for autocomplete
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
        isRequired: true,
        selectedIndex:null

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
        insert: 'Insert Row Above',
        remove: 'Remove Current Row',
        moveUp: 'Move Up',
        moveDown: 'Move Down',
        rowDrag: 'Sort Row',
        rowEmpty: 'This Grid Is Empty'
    };
    var _defaultButtonClasses = { append: null, removeLast: null, insert: null, remove: null, moveUp: null, moveDown: null, rowDrag: null };
    var _defaultHideButtons = { append: false, removeLast: false, insert: false, remove: false, moveUp: false, moveDown: false };
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
                }
                // Prepare column information and add column header
                for (var z = 0; z < settings.columns.length; z++) {
                    // Assign default setting
                    var columnOpt = $.extend({}, _defaultColumnOptions, settings.columns[z]);
                    settings.columns[z] = columnOpt;
                    // Skip hidden
                    if (settings.columns[z].type != 'hidden') {
                        settings._visibleCount++;
                        tbCell = tbRow.insertCell(-1);
                        tbCell.className = 'ui-widget-header';
                        $(tbCell).text(settings.columns[z].display);
                        if (settings.columns[z].displayCss) $(tbCell).css(settings.columns[z].displayCss);
                    }
                }
                // Check to hide last column or not
                if (settings.hideButtons.insert && settings.hideButtons.remove
                        && settings.hideButtons.moveUp && settings.hideButtons.moveDown
                        && (!$.isArray(settings.customRowButtons) || settings.customRowButtons.length == 0)) {
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
                    // Enable Paging
                    if (settings.isPaging) 
                        createPaging(tbCell);
                }
                // Add filter row
                if (settings.isFilter) {
                    tbRow = tbHead.insertRow(1);
                    tbCell = tbRow.insertCell(-1);
                    tbCell.colSpan = settings._finalColSpan;
                    $(tbCell).addClass('ui-widget-content-filter');
                    
                    var divFilter = document.createElement('div');
                    divFilter.id = 'divFilter';
                    divFilter.name = divFilter.id;
                    divFilter.style.width = '100%';

                    var divPlusMinus = document.createElement('div');
                    divPlusMinus.style.cssText = 'float:left;text-align:left';

                    var spanExpand = document.createElement('span');
                    spanExpand.id = 'spanExpand';
                    spanExpand.style.cssText = 'cursor: pointer; font-weight: bold; font-size: 14px; color: Green;';
                    spanExpand.setAttribute('onclick', 'javascript:showDiv();');

                    var imgPlus = document.createElement('img');
                    imgPlus.id = 'imgPlus';
                    imgPlus.src = 'Images/plus.gif';
                    var lblText = document.createElement('label');
                    lblText.innerText = 'Filter';
                    spanExpand.appendChild(imgPlus);
                    spanExpand.appendChild(lblText);

                    var spanCollapse = document.createElement('span');
                    spanCollapse.id = 'spanCollapse';
                    spanCollapse.style.cssText = 'cursor: pointer;font-weight: bold;font-size: 14px; color: Red;display: none;';
                    spanCollapse.setAttribute('onclick', 'javascript:showDiv();');
                    var imgMinus = document.createElement('img');
                    imgMinus.id = 'imgMinus';
                    imgMinus.src = 'Images/minus.gif';
                    lblText = document.createElement('label');
                    lblText.innerText = 'Filter';
                    spanCollapse.appendChild(imgMinus);
                    spanCollapse.appendChild(lblText);
                    divPlusMinus.appendChild(spanExpand);
                    divPlusMinus.appendChild(spanCollapse);
                    divFilter.appendChild(divPlusMinus);

                    var divBrowse = document.createElement('div');
                    divBrowse.id = 'divBrowse';
                    divBrowse.name = divBrowse.id;
                    divBrowse.style.cssText = 'float:left;text-align:center;display:none;';

                    var tblFilter = document.createElement('table');
                    tblFilter.id = 'tableBrowsing'
                    tblFilter.name = tblFilter.id;
                    var trFilter = tblFilter.insertRow(0);
                    var tdFilter = trFilter.insertCell(-1);

                    ctrl = document.createElement('select');
                    ctrl.id = 'ddlColumnName1';
                    ctrl.name = ctrl.id;
                    for (var col = 0; col < settings.tableColumns.split(',').length; col++)
                        ctrl.options[col] = new Option(settings.tableColumns.split(',')[col], col);
                    tdFilter.appendChild(ctrl);
                    ctrl = document.createElement('span');
                    ctrl.id = 'spanFiltered';
                    ctrl.name = ctrl.id;
                    ctrl.style.paddingLeft = '10px';
                    ctrl.innerHTML = ' Contains : ';
                    tdFilter.appendChild(ctrl);
                    ctrl = document.createElement('input');
                    ctrl.id = 'txtColumnValue1';
                    ctrl.name = ctrl.id;
                    ctrl.type = 'text';
                    ctrl.style.width = '150px';
                    tdFilter.appendChild(ctrl);
                    ctrl = document.createElement('img');
                    ctrl.id = 'btnAdd1';
                    ctrl.url = 'Images/addMore.jpg'
                    ctrl.onclick = 'javascript:addNewSearchRow(\"' + tblFilter.id + '\");';
                    ctrl.style = 'cursor:pointer';
                    tdFilter.appendChild(ctrl);
                    ctrl = document.createElement('img');
                    ctrl.id = 'btnFilter1';
                    ctrl.url = 'Images/search.jpg'
                    ctrl.onclick = 'javascript:tableFilter(\"' + tblFilter.id + '\");';
                    ctrl.style = 'cursor:pointer';
                    tdFilter.appendChild(ctrl);

                    divBrowse.appendChild(tblFilter);
                    divFilter.appendChild(divBrowse);

                    tbCell.appendChild(divFilter);
                   
                }
                // Handle footer row
                tbRow = tbFoot.insertRow(-1);
                tbCell = tbRow.insertCell(-1);
                tbCell.colSpan = settings._finalColSpan;
                ctrl = document.createElement('div');
                ctrl.id = 'divStatusMsg';
                ctrl.name = 'divStatusMsg';
                ctrl.style.cssFloat = 'right';
                tbCell.appendChild(ctrl);
                $('<input/>').attr({
                    type: 'hidden',
                    id: settings.idPrefix + '_rowOrder',
                    name: settings.idPrefix + '_rowOrder'
                }).appendTo(tbCell);
                // Make row invisible if all buttons are hidden
                if (settings.hideButtons.append && settings.hideButtons.removeLast
                        && (!$.isArray(settings.customFooterButtons) || settings.customFooterButtons.length == 0)) {
                    tbRow.style.display = 'none';
                } else {
                    if (!settings.hideButtons.append) {
                        $('<button/>').addClass('append', settings._buttonClasses.append).attr({ type: 'button', title: settings._i18n.append })
                        .button({ icons: { primary: 'ui-icon-plusthick' }, text: false }).click(function () {
                            insertRow(tbWhole, 1, null, null);
                            //a1(this);
                        }).appendTo(tbCell);
                    }
                    if (!settings.hideButtons.removeLast) {
                        $('<button/>').addClass('removeLast', settings._buttonClasses.removeLast).attr({ type: 'button', title: settings._i18n.removeLast })
                        .button({ icons: { primary: 'ui-icon-closethick' }, text: false }).click(function () {
                            removeRow(tbWhole, null, this.value, false);
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
                loadData(target[0], records, false);
            }
            return target;
        },
        appendRow: function (numOfRow) {
            return this.appendGrid('insertRow', numOfRow);
        },
        insertRow: function (numOfRow, rowIndex, callerUniqueIndex) {

            var target = this;
            if (target.length > 0) {
                var tbWhole = target[0], insertResult = null;
                var settings = $(tbWhole).data('appendGrid');
                if (!settings) {
                    alert(_systemMessages.notInit);
                }
                else if (numOfRow > 0) {
                    // Define variables
                    insertResult = insertRow(tbWhole, numOfRow, rowIndex, callerUniqueIndex);
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
            var target = this, tbodyIndex = -1;
            if (target.length > 0) {
                var tbWhole = target[0], tbHead, tbBody, tbRow;
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
                    tbBody = tbWhole.getElementsByTagName('tbody')[settings.isFilter ? 1 : 0];
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
                    tbBody = tbWhole.getElementsByTagName('tbody')[settings.isFilter ? 1 : 0];
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
        getCtrlValue: function (name, rowIndex) {
            var target = this;
            if (target.length > 0) {
                settings = target.data('appendGrid');
                if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                    for (var z = 0; z < settings.columns.length; z++) {
                        if (settings.columns[z].name === name) {
                            return getCtrlValue(settings, z, settings._rowOrder[rowIndex]);
                        }
                    }
                }
            }
            return null;
        },
        setCtrlValue: function (name, rowIndex, value) {
            var target = this;
            if (target.length > 0) {
                var tbWhole = this, settings = $(this).data('appendGrid');
                if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
                    for (var z = 0; z < settings.columns.length; z++) {
                        if (settings.columns[z].name == name) {
                            setCtrlValue(settings, z, settings._rowOrder[rowIndex], value);
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
    function insertRow(tbWhole, numOfRow, rowIndex, callerUniqueIndex) {
        // Define variables
        //var settings = $(tbWhole).data('appendGrid');
        var addedRows = [], parentIndex = null, uniqueIndex, ctrl, hidden = [];
        var tbHead = tbWhole.getElementsByTagName('thead')[0];
        var tbBody = tbWhole.getElementsByTagName('tbody')[settings.isFilter ? 1 : 0];
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
            if (document.getElementById('btnUpdateAll') != null)
                document.getElementById('btnUpdateAll').style.display = 'block';
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
            // Add row number
            if (!settings.hideRowNumColumn) {
                tbCell = tbRow.insertCell(-1);
                $(tbCell).addClass('ui-widget-content first').text(settings._rowOrder.length + (settings.isPaging ? (settings.currentPage * settings.itemsPerPage - settings.itemsPerPage) : 0));
            }
            uniqueID = settings._uniqueIndex;
            //alert(settings._uniqueIndex);
            // Process on each columns
            for (var y = 0; y < settings.columns.length; y++) {
                // Skip hidden
                if (settings.columns[y].type == 'hidden') {
                    hidden.push(y);
                    continue;
                }
                // Insert cell
                tbCell = tbRow.insertCell(-1);
                tbCell.className = 'ui-widget-content';
                if (settings.columns[y].cellCss != null) $(tbCell).css(settings.columns[y].cellCss);
                // Check control type
                ctrl = null;
                if (settings.columns[y].type == 'custom') {
                    if (typeof (settings.columns[y].customBuilder) == 'function') {
                        ctrl = settings.columns[y].customBuilder(tbCell, settings.idPrefix, settings.columns[y].name, uniqueIndex);
                    }
                }
                else if (settings.columns[y].type == 'select') {
                    ctrl = document.createElement('select');
                    ctrl.id = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    // Build option list
                    if ($.isArray(settings.columns[y].ctrlOptions)) {
                        // For array type option list
                        if (settings.columns[y].ctrlOptions.length > 0) {
                            if ($.isPlainObject(settings.columns[y].ctrlOptions[0])) {
                                for (var x = 0; x < settings.columns[y].ctrlOptions.length; x++) {
                                    ctrl.options[ctrl.options.length] = new Option(settings.columns[y].ctrlOptions[x].label, settings.columns[y].ctrlOptions[x].value);
                                }
                            }
                            else {
                                for (var x = 0; x < settings.columns[y].ctrlOptions.length; x++) {
                                    ctrl.options[ctrl.options.length] = new Option(settings.columns[y].ctrlOptions[x], settings.columns[y].ctrlOptions[x]);
                                }
                            }
                        }
                    }
                    else if ($.isPlainObject(settings.columns[y].ctrlOptions)) {
                        // For plain object type option list
                        for (var x in settings.columns[y].ctrlOptions) {
                            ctrl.options[ctrl.options.length] = new Option(settings.columns[y].ctrlOptions[x], x);
                        }
                    }
                    else if (typeof (settings.columns[y].ctrlOptions) == 'string') {
                        // For string type option list
                        var arrayOpt = settings.columns[y].ctrlOptions.split(';');
                        for (var x = 0; x < arrayOpt.length; x++) {
                            var eqIndex = arrayOpt[x].indexOf(':');
                            if (-1 == eqIndex) {
                                ctrl.options[ctrl.options.length] = new Option(arrayOpt[x], arrayOpt[x]);
                            } else {
                                ctrl.options[ctrl.options.length] = new Option(arrayOpt[x].substring(eqIndex + 1, arrayOpt[x].length), arrayOpt[x].substring(0, eqIndex));
                            }
                        }
                    }
                    tbCell.appendChild(ctrl);
                }
                else if (settings.columns[y].type == 'radio') {
                    ctrl = document.createElement('input');
                    ctrl.type = 'radio';
                    ctrl.id = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    ctrl.value = 1;
                    tbCell.appendChild(ctrl);
                    tbCell.style.textAlign = 'center';
                }
                else if (settings.columns[y].type == 'radiolist') {
                    var tblRadio = document.createElement('table');
                    tblRadio.id = 'tableRbtn' + settings.columns[y].name + uniqueIndex;
                    tblRadio.name = tblRadio.id;
                    tblRadio.setAttribute('required', settings.columns[y].isRequired ? 'required' : '');
                    var trRadio = tblRadio.insertRow(0);
                    var tdRadio;
                    if ($.isPlainObject(settings.columns[y].ctrlOptions)) {
                        // For plain object type option list
                        for (var x in settings.columns[y].ctrlOptions) {
                                tdRadio = trRadio.insertCell(-1);
                                ctrl = document.createElement('input');
                                ctrl.type = 'radio';
                                ctrl.id = settings.idPrefix + '_Rbtn' + settings.columns[y].name + '_' + uniqueIndex + '_' + x;
                                ctrl.name = settings.idPrefix + '_Rbtn' + settings.columns[y].name + '_' + uniqueIndex;
                                ctrl.required = settings.columns[y].isRequired;
                                ctrl.checked = x == settings.columns[y].selectedIndex;
                                ctrl.value = x;
                                tdRadio.appendChild(ctrl);
                                ctrl = document.createElement('label');
                                ctrl.id = settings.idPrefix + '_Lbl' + settings.columns[y].name + '_' + uniqueIndex + '_' + x;
                                ctrl.name = settings.idPrefix + '_Lbl' + settings.columns[y].name + '_' + uniqueIndex;
                                ctrl.innerText = settings.columns[y].ctrlOptions[x];
                                tdRadio.appendChild(ctrl);
                        }
                    }
                    if (typeof (settings.columns[y].onClick) == 'function') {
                        $(tblRadio).click({ caller: tbWhole, callback: settings.columns[y].onClick, uniqueIndex: uniqueIndex }, function (evt) {
                            evt.data.callback(evt, $(evt.data.caller).appendGrid('getRowIndex', evt.data.uniqueIndex));
                        });
                    }
                    tbCell.appendChild(tblRadio);
                    tbCell.style.textAlign = 'center';
                }
                else if (settings.columns[y].type == 'checkbox') {
                    ctrl = document.createElement('input');
                    ctrl.type = 'checkbox';
                    ctrl.id = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    ctrl.value = 1;
                    tbCell.appendChild(ctrl);
                    tbCell.style.textAlign = 'center';
                }
                else if (settings.columns[y].type == 'label') {
                    // Generate text 
                    ctrl = document.createElement('label');
                    ctrl.id = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    tbCell.appendChild(ctrl);
                }
                else if (settings.columns[y].type == 'autocomplete') {
                    ctrl = document.createElement('input');
                    ctrl.type = 'hidden';
                    ctrl.id = settings.idPrefix + '_Hdn' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    tbCell.appendChild(ctrl);
                    ctrl = document.createElement('input');
                    ctrl.type = 'text';
                    ctrl.id = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    ctrl.style.cssText = 'height:20px;';
                    ctrl.setAttribute('controltype', 'autocomplete');
                    tbCell.appendChild(ctrl);
                    // textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect
                    //textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl
                    cfi.AutoComplete(ctrl.id, settings.columns[y].basedOn, settings.columns[y].tableName, settings.columns[y].keyColumn, settings.columns[y].textColumn, settings.columns[y].templateColumn, settings.columns[y].addOnFunction, settings.columns[y].filterCriteria,settings.columns[y].separator,settings.columns[y].newAllowed,settings.columns[y].confirmOnAdd,settings.columns[y].procName,settings.columns[y].onSelect );
                }
                else if (settings.columns[y].type == 'datetype') {
                    ctrl = document.createElement('input');
                    ctrl.id = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    ctrl.style.cssText = 'height:20px;';
                    ctrl.setAttribute('controltype', 'datetype');
                    tbCell.appendChild(ctrl);
                    cfi.DateType(ctrl.id);
                }
                else if (-1 != settings.columns[y].type.search(/^(color|date|datetime|datetime\-local|email|month|number|range|search|tel|time|url|week)$/)) {
                    ctrl = document.createElement('input');
                    try {
                        ctrl.type = settings.columns[y].type;
                    }
                    catch (err) { /* Not supported type */ }
                    ctrl.id = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    tbCell.appendChild(ctrl);
                }
                else {
                    // Generate text input
                    ctrl = document.createElement('input');
                    ctrl.type = 'text';
                    ctrl.id = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    ctrl.validationMessage
                    tbCell.appendChild(ctrl);
                    // Handle UI widget
                    if (settings.columns[y].type == 'ui-datepicker') {
                        $(ctrl).datepicker(settings.columns[y].uiOption);
                    } else if (settings.columns[y].type == 'ui-spinner') {
                        $(ctrl).spinner(settings.columns[y].uiOption);
                    } else if (settings.columns[y].type == 'ui-autocomplete') {
                        $(ctrl).autocomplete(settings.columns[y].uiOption);
                    }
                }
                // Add extra control properties
                if (settings.columns[y].type != 'custom') {
                    // Add control attributes as needed
                    if (settings.columns[y].ctrlAttr != null) $(ctrl).attr(settings.columns[y].ctrlAttr);
                    if (settings.columns[y].isRequired) ctrl.setAttribute('required', 'required');
                    // Add control properties as needed
                    if (settings.columns[y].ctrlProp != null) $(ctrl).prop(settings.columns[y].ctrlProp);
                    // Add control CSS as needed
                    if (settings.columns[y].ctrlCss != null) $(ctrl).css(settings.columns[y].ctrlCss);
                    // Add control class as needed
                    if (settings.columns[y].ctrlClass != null) $(ctrl).addClass(settings.columns[y].ctrlClass);
                    // Add jQuery UI tooltip as needed
                    if (settings.columns[y].uiTooltip) $(ctrl).tooltip(settings.columns[y].uiTooltip);
                    // Add control events as needed
                    if (settings.columns[y].type != 'radiolist') {
                        if (typeof (settings.columns[y].onClick) == 'function') {
                            $(ctrl).click({ caller: tbWhole, callback: settings.columns[y].onClick, uniqueIndex: uniqueIndex }, function (evt) {
                                evt.data.callback(evt, $(evt.data.caller).appendGrid('getRowIndex', evt.data.uniqueIndex));
                            });
                        }
                        if (typeof (settings.columns[y].onChange) == 'function') {
                            $(ctrl).change({ caller: tbWhole, callback: settings.columns[y].onChange, uniqueIndex: uniqueIndex }, function (evt) {
                                evt.data.callback(evt, $(evt.data.caller).appendGrid('getRowIndex', evt.data.uniqueIndex));
                            });
                        }
                    }
                }
                // Set default value
                if (!isEmpty(settings.columns[y].value)) {
                    setCtrlValue(settings, y, uniqueIndex, settings.columns[y].value);
                }
            }
            // Add button cell if needed
            if (!settings._hideLastColumn || settings.columns.length > settings._visibleCount) {
                tbCell = tbRow.insertCell(-1);
                tbCell.className = 'ui-widget-content last';
                if (settings._hideLastColumn) tbCell.style.display = 'none';
                // Add standard buttons
                if (!settings.hideButtons.insert) {
                    $(tbCell).append($('<button/>').addClass('insert', settings._buttonClasses.insert).val(uniqueIndex)
                        .attr({ id: settings.idPrefix + '_Insert_' + uniqueIndex, type: 'button', title: settings._i18n.insert, tabindex: -1 })
                        .button({ icons: { primary: 'ui-icon-arrowreturnthick-1-w' }, text: false }).click(function () {
                            $(tbWhole).appendGrid('insertRow', 1, null, this.value);
                        }));
                }
                if (!settings.hideButtons.remove) {
                    $(tbCell).append($('<button/>').addClass('remove', settings._buttonClasses.remove).val(uniqueIndex)
                        .attr({ id: settings.idPrefix + '_Delete_' + uniqueIndex, type: 'button', title: settings._i18n.remove, tabindex: -1 })
                        .button({ icons: { primary: 'ui-icon-trash' }, text: false }).click(function () {
                            removeRow(tbWhole, null, this.value, false);
                        }));
                }
                if (!settings.hideButtons.moveUp) {
                    $(tbCell).append($('<button/>').addClass('moveUp', settings._buttonClasses.moveUp).val(uniqueIndex)
                        .attr({ id: settings.idPrefix + '_MoveUp_' + uniqueIndex, type: 'button', title: settings._i18n.moveUp, tabindex: -1 })
                        .button({ icons: { primary: 'ui-icon-arrowthick-1-n' }, text: false }).click(function () {
                            $(tbWhole).appendGrid('moveUpRow', null, this.value);
                        }));
                }
                if (!settings.hideButtons.moveDown) {
                    $(tbCell).append($('<button/>').addClass('moveDown', settings._buttonClasses.moveDown).val(uniqueIndex)
                        .attr({ id: settings.idPrefix + '_MoveDown_' + uniqueIndex, type: 'button', title: settings._i18n.moveDown, tabindex: -1 })
                        .button({ icons: { primary: 'ui-icon-arrowthick-1-s' }, text: false }).click(function () {
                            $(tbWhole).appendGrid('moveDownRow', null, this.value);
                        }));
                }
                // Handle row dragging
                if (settings.rowDragging) {
                    $('<div/>').addClass('rowDrag ui-state-default ui-corner-all', settings._buttonClasses.rowDrag)
                        .attr('title', settings._i18n.rowDrag).append($('<div/>').addClass('ui-icon ui-icon-carat-2-n-s'))
                        .appendTo(tbCell);
                }
                // Add hidden
                for (var y = 0; y < hidden.length; y++) {
                    ctrl = document.createElement('input');
                    ctrl.id = settings.idPrefix + '_' + settings.columns[hidden[y]].name + '_' + uniqueIndex;
                    ctrl.name = ctrl.id;
                    ctrl.type = 'hidden';
                    if (!isEmpty(settings.columns[hidden[y]].value)) {
                        ctrl.value = settings.columns[hidden[y]].value;
                    }
                    tbCell.appendChild(ctrl);
                }
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
            var rowData = $(evt.data.tbWhole).appendGrid('getRowValue', null, evt.data.uniqueIndex);
            buttonCfg.click(evt, evt.data.uniqueIndex, rowData);
        });
        if (buttonCfg.btnClass) exButton.addClass(buttonCfg.btnClass);
        if (buttonCfg.btnCss) exButton.css(buttonCfg.btnCss);
        if (buttonCfg.btnAttr) exButton.attr(buttonCfg.btnAttr);
        return exButton;
    }
    function removeRow(tbWhole, rowIndex, uniqueIndex, force) {
        var settings = $(tbWhole).data('appendGrid');
        var tbBody = tbWhole.getElementsByTagName('tbody')[settings.isFilter ? 1 : 0];
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
            document.getElementById('btnUpdateAll').style.display = 'none';
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
        var tbBody, tbRow, tbCell, uniqueIndex, insertResult;
        var settings = $(tbWhole).data('appendGrid');
        if (settings) {
            // Clear existing content
            tbBody = tbWhole.getElementsByTagName('tbody')[settings.isFilter ? 1 : 0];
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
                        if (settings.columns[c].type == 'autocomplete') {
                            document.getElementById(settings.idPrefix + '_Hdn' + settings.columns[c].name + '_' + settings._rowOrder[r]).value = records[r]['Hdn'+settings.columns[c].name];
                            document.getElementById(settings.idPrefix + '_' + settings.columns[c].name + '_' + settings._rowOrder[r]).value = records[r][settings.columns[c].name];
                        }
                        else
                            setCtrlValue(settings, c, settings._rowOrder[r], records[r][settings.columns[c].name]);
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
    function isEmpty(value) {
        return typeof (value) == 'undefined' || value == null;
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
    function getRowValue(settings, uniqueIndex, loopIndex) {
        var result = {}, keyName = null;
        for (var z = 0; z < settings.columns.length; z++) {
            keyName = settings.columns[z].name + (isEmpty(loopIndex) ? '' : '_' + loopIndex);
            result[keyName] = getCtrlValue(settings, z, uniqueIndex);
        }
        return result;
    }
    function getCtrlValue(settings, colIndex, uniqueIndex) { // type, idPrefix, columnName, uniqueIndex
        var ctrl = null, type = settings.columns[colIndex].type, columnName = settings.columns[colIndex].name;
        if (type == 'checkbox' || type == 'radio') {
            ctrl = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
            if (ctrl == null)
                return null;
            else
                return ctrl.checked ? 1 : 0;
        }
        else if (type == 'radiolist') {
            for (var x in settings.columns[colIndex].ctrlOptions) {
                if (document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + x).checked) {
                    return document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + x).value;
                    break;
                }
                else {
                    //return null;
                    continue;
                }
            }
        }
        else if (type == 'custom') {
            if (typeof (settings.columns[colIndex].customGetter) == 'function')
                return settings.columns[colIndex].customGetter(settings.idPrefix, columnName, uniqueIndex);
            else
                return null;
        }
        else {
            ctrl = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
            if (ctrl == null)
                return null;
            else
                return ctrl.value;
        }
    }
    function getCellCtrl(type, idPrefix, columnName, uniqueIndex) {
        return document.getElementById(idPrefix + '_' + columnName + '_' + uniqueIndex);
    }
    function setCtrlValue(settings, colIndex, uniqueIndex, data) {
        var type = settings.columns[colIndex].type;
        var columnName = settings.columns[colIndex].name;
        if (type == 'checkbox' || type == 'radio') {
            getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).checked = (data != null && data != 0);
        }
        if (type == 'radiolist') {
            for (var x in settings.columns[colIndex].ctrlOptions) {
                try { document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + x).checked = document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + x).value == (data == null ? '' : data); }
                catch (e) {
                    document.getElementById(settings.idPrefix + '_Rbtn' + columnName + '_' + uniqueIndex + '_' + x).checked = document.getElementById(settings.idPrefix + '_Lbl' + columnName + '_' + uniqueIndex + '_' + x).innerHTML == (data == null ? '' : data);
                }
            }
            //document.getElementById(idPrefix + '_' + columnName + '_' + uniqueIndex)
            //getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).checked = (data != null && data != 0);
        }
        else if (type == 'custom') {
            if (typeof (settings.columns[colIndex].customSetter) == 'function') {
                settings.columns[colIndex].customSetter(settings.idPrefix, columnName, uniqueIndex, data);
            }
        }
        else if (type == 'label') {
            getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).innerHTML = (data == null ? '' : data);
        }
        //else if (type == 'autocomplete') {
        //    getCellCtrl(type, settings.idPrefix, settings.tableColumns.split(',')[colIndex], uniqueIndex).value = (data == null ? '' : data);
        //}
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
    function createPaging(tbCell) {
        // page size
       var ctrl = document.createElement('select');
        ctrl.id = 'ddlPageSize';
        ctrl.name = ctrl.id;
        ctrl.style.cssFloat = 'right';
        //ctrl.options[ctrl.options.length] = new Option(settings.columns[y].ctrlOptions[x].label, settings.columns[y].ctrlOptions[x].value);
        ctrl.options[0] = new Option('5', '5');
        ctrl.options[1] = new Option('10', '10');
        ctrl.options[2] = new Option('20', '20');
        ctrl.options[3] = new Option('50', '50');
        ctrl.options[4] = new Option('100', '100');
        ctrl.setAttribute('onchange', 'javascript:setPageSize();');
        //getRecord(' + settings.Paging.mSNo + ', ' + tbWhole.id + ', ' + settings.Paging.sName + ', ' + settings.Paging.sMethod + ', ' + settings.Paging.pNo + ', ' + settings.Paging.pSize + ', ' + settings.Paging.wCondition + ', ' + settings.Paging.sort + ');') + '
        tbCell.appendChild(ctrl);
        ctrl = document.createElement('span');
        ctrl.id = 'spanPageSize';
        ctrl.name = ctrl.id;
        ctrl.style.cssFloat = 'right';
        ctrl.style.paddingRight = '5px';
        ctrl.innerHTML = 'Page Size: ';
        tbCell.appendChild(ctrl);
        ctrl = document.createElement('div');
        ctrl.id = 'pageNavPosition';
        ctrl.name = 'pageNavPosition';
        ctrl.style.cssFloat = 'right';
        ctrl.style.paddingRight = '10px';
        tbCell.appendChild(ctrl);
    }
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
// Load data
function getRecord() {
    if ((settings == null ? 0 : settings.masterTableSNo) > 0) {
        $.ajax({
            type: "GET",
            cache: false,
            url: "./Services/Master/" + settings.serviceName + "/" + settings.getRecordServiceMethod + "?recid=" + settings.masterTableSNo + "&pageNo=" + (settings.currentPage == null ? 1 : settings.currentPage) + "&pageSize=" + (settings.itemsPerPage == null ? 10 : settings.itemsPerPage) + "&whereCondition=" + (settings.whereCondition == null ? '' : settings.whereCondition) + "&sort=" + (settings.sort == null ? '' : settings.sort) ,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.key > 0)
                    $('#' + settings.tableID).appendGrid('load', data.value);
                else if (document.getElementById('btnUpdateAll') != null)
                    document.getElementById('btnUpdateAll').style.display = 'none';
                totalRows = data.key;
                //if (totalRows == 0) {
                //    var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
                //    $('tbody', target[0]).append($('<tr></tr>').addClass('empty').append(empty));
                //}
                //return data.value;
                //AjaxSucceeded(data);
            },
            complete: function () {
                if (settings.isPaging && settings.currentPage == 1 && !isDataLoaded)
                    showPage(settings.currentPage);
                isDataLoaded = true;
            },
            error: AjaxFailed
        });
        
    }
    
}
// get updated row index
function getUpdatedRowIndex(Index)
{
    updatedRows[updatedRows.length] = Index;
}
// create and update data
function createUpdateRecord(updatedRows) {
    try {
        
        updatedRows = jQuery.unique(updatedRows);
        //if (updatedRows.length ==1)
          //  updatedRows.splice(0, updatedRows.length);
        ////(rowNo == 0 ? $('#' + tableID).appendGrid('getRowCount') : 0)
        if (validateTableData(settings.tableID, updatedRows)) {
            var strData = tableToJSON(settings.tableID, settings.columns, updatedRows);
            //return false;
            if (strData == '[]') {
                ShowMessage('success', '', 'Record Updated Successfully.');
            }
            else {
                //if (rowNo > 0) {
                $.ajax({
                    type: "POST",
                    url: "./Services/Master/" + settings.serviceName + "/" + settings.createUpdateServiceMethod + "?strData=" + strData,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    processData: true,
                    success: function (result) {
                        //location.reload(true);
                        AjaxSucceeded(result[0].replace('<value>', '').replace('</value>', ''));
                        //settings.currentPage = 1;
                        //getRecord();
                        showPage(settings.currentPage);
                        updatedRows.splice(0, updatedRows.length);
                    },
                    error: AjaxFailed
                });
            }
        }
    }
    catch(e){}
}
// delete data
function deleteRecord(rowNo) {
    try{
        var strData = $('#' + settings.tableID + '_SNo_' + rowNo).val();
        if (strData == 0 || strData==undefined) {
            $('#' + settings.tableID).appendGrid('removeRow', null, rowNo);
            //rowNo == $('#' + settings.tableID).appendGrid('getRowCount') ? null :
        }
        else {
            $.ajax({
                type: "POST",
                url: "./Services/Master/" + settings.serviceName + "/" + settings.deleteServiceMethod + "?recid=" + strData,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: true,
                beforeSend: function () {
                    return confirm("Are you sure you want to delete this record?");
                },
                success: function (result) {
                    AjaxSucceeded(result[0].replace('<value>', '').replace('</value>', ''));
                    //location.reload(true);
                    if (settings.isPaging)
                        setPageSize();//showPage(settings.currentPage);
                    else
                        getRecord();
                },
                error: AjaxFailed
            });
        }
    }
    catch (e) { }
}
function AjaxSucceeded(result) {
    ShowMessage('success', '', result);
    //alert(result);
}
function AjaxFailed(result) {
    ShowMessage('error', 'Need your Kind Attention!', result);
    //alert(result.status + ' ' + result.statusText);
}
// convert table data to JSON
function tableToJSON(tableName, colName, noOfRows) {
    try{
        var strJSON = '[';
        for (var row = 0; row < noOfRows.length; row++) {
            strJSON += '{';
            for (var col = 0; col < colName.length; col++) {
                if (colName[col].type == 'radio' || colName[col].type == 'checkbox')
                    strJSON += '"' + colName[col].name + '":"' + (document.getElementById(tableName + '_' + colName[col].name + '_' + noOfRows[row]).checked ? 1 : 0) + '"';
                else if (colName[col].type == 'autocomplete') {
                    strJSON += '"Hdn' + colName[col].name + '":"' + $('#' + tableName + '_Hdn' + colName[col].name + '_' + noOfRows[row]).val() + '",';
                    strJSON += '"' + colName[col].name + '":"' + $('#' + tableName + '_' + colName[col].name + '_' + noOfRows[row]).val() + '"';
                }
                else if (colName[col].type == 'radiolist') {
                    for (var x in colName[col].ctrlOptions) {
                        if (document.getElementById(tableName + '_Rbtn' + colName[col].name + '_' + noOfRows[row] + '_' + x).checked)
                            strJSON += '"' + colName[col].name + '":"' + $('#' + tableName + '_Rbtn' + colName[col].name + '_' + noOfRows[row] + '_' + x).val() + '"';
                    }
                }
                else
                    strJSON += '"' + colName[col].name + '":"' + $('#' + tableName + '_' + colName[col].name + '_' + noOfRows[row]).val() + '"';
                if (col < (colName.length - 1))
                    strJSON += ',';
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
function validateTableData(id, updatedRows) {
    var isValid = true;
    $('#' + id + (updatedRows.length != 1 ? ' tr input[id*="' + id + '_"]' : ' input[id*="_' + updatedRows[0] + '"]')).each(function () {
        if (this.dataset.role == 'autocomplete'&& this.type!='hidden' && this.required) {
            var inputID = this.id;
            if (inputID.split('_').length == 3)
                inputID = inputID.split('_')[0] + '_Hdn' + inputID.split('_')[1] + '_' + inputID.split('_')[2];
            if ($.trim($('#' + inputID).val()) == '') {
                isValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
            else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }
        }
        else if (this.type == 'radio' && this.required) {
            if ($("input:radio[name=" + this.id.split('_')[0] + '_' + this.id.split('_')[1] + '_' + this.id.split('_')[2] + "]:checked").val() == undefined) {
                isValid = false;
                $('#table' + this.id.split('_')[1] + this.id.split('_')[2]).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
            else {
                $('#table' + this.id.split('_')[1] + this.id.split('_')[2]).css({
                    "border": "",
                    "background": ""
                });
            }
        }
        else if ($.trim($(this).val()) == '' && this.type != 'hidden' && this.required) {
            isValid = false;
            $(this).css({
                "border": "1px solid red",
                "background": "#FFCECE"
            });
        }
        else {
            $(this).css({
                "border": "",
                "background": ""
            });
        }
    });
    return isValid;
}
// export to excel
function exportToExcel(evt)
{
    var html = document.getElementById(settings.tableID).outerHTML;
    window.open('data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html));
    //evt.preventDefault();
    ////$('body').prepend("<form method='post' action=\"data:application/vnd.ms-excel," + encodeURIComponent(html) + "\" style='top:-3333333333px;' id='tempForm'><input type='hidden' name='data' value='' ></form>");
    ////$('#tempForm').submit();
    ////$("tempForm").remove();
    //////dynamicTable();
    ////return false;
    ////var strURL = "http://localhost:420/Services/Master/" + settings.serviceName + "/" + settings.getRecordServiceMethod + "?recid=" + settings.masterTableSNo + "&pageNo=1&pageSize=" + (settings.itemsPerPage == null ? 10 : settings.itemsPerPage * pages) + "&whereCondition=" + (settings.whereCondition == null ? '' : settings.whereCondition) + "&sort=" + (settings.sort == null ? '' : settings.sort)
    //$('body').prepend("<form method='post' action='' style='top:-3333333333px;' id='tempForm'><input type='hidden' name='data' value='+encodeURIComponent(html)+' ></form>");
    //$('#tempForm').submit();
    //$("tempForm").remove();
    //return false;

}
function setPageSize()
{
    settings.itemsPerPage = $('#ddlPageSize').val();
    settings.currentPage = 1;
    isDataLoaded = false;
    getRecord();
}
function showPage(pageNumber) {
    try {
        // check total rows
        if (totalRows > 0) {
            // for on page selection of paging and change page size
            if ((settings.currentPage > 1 || pageNumber > 1 || settings.itemsPerPage != $('#ddlPageSize').val())) {
                settings.currentPage = pageNumber;
                getRecord();
            }
            else {
                settings.itemsPerPage = $('#ddlPageSize') == null || $('#ddlPageSize').val() == 'undefined' ? 10 : $('#ddlPageSize').val();
            }
            // set no of pages
            pages = Math.ceil(totalRows / settings.itemsPerPage);
            // set start page
            var startPage = Math.floor((pageNumber - 1) * 0.1) * 10;
            // show pageing navigation
            showPageNav(startPage + 1);
            var oldPageAnchor = document.getElementById('pg' + settings.currentPage);
            if (oldPageAnchor != null) {
                oldPageAnchor.className = 'pg-normal';
            }
            // set current page, set css for selected page number
            settings.currentPage = pageNumber;
            var newPageAnchor = document.getElementById('pg' + settings.currentPage);
            if (newPageAnchor != null) {
                newPageAnchor.className = 'pg-selected';
            }
            // set page start and end index as [1-10]
            pageStart = (pageNumber - 1) * settings.itemsPerPage + 1;
            pageEnd = (pageStart + eval(settings.itemsPerPage)) - 1;
            // set paging message as 'Showing 1 to 10 of 12 rows.'
            var footerMessage = document.getElementById('divStatusMsg');
            footerMessage.innerHTML = 'Showing ' + pageStart + ' to ' + (pageEnd > totalRows ? totalRows : pageEnd) + ' of ' + totalRows + ' rows.';
            // set first,previous,next and last options in paging
            var pgFirst = document.getElementById('pgFirst');
            var pgNext = document.getElementById('pgNext');
            var pgPrev = document.getElementById('pgPrev');
            var pgLast = document.getElementById('pgLast');

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
        }
           
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
        var element = document.getElementById('pageNavPosition');
        // set paging loop, only for 10 pages
        var loopEnd = start + 9;
        var pagerHtml = ''; 
        // if page count is greater than 1 then show first and previous button
        if (pages >= 2) {
            pagerHtml += '<span id="pgFirst" onclick="first();" class="pg-normal" title="First Page"><img src="Images/firstPage.png" alt="First" /></span>';
            //pagerHtml += '&nbsp';
            pagerHtml += '<span id="pgPrev" onclick="prev();" class="pg-normal" title="Previous Page"><img src="Images/prevPage.png" alt="Previous"/></span>';
            //pagerHtml += '&nbsp';
        }
        // set ... for more than 10 pages
        if (start > 10)
            pagerHtml += '<span class="regularDataBlue" title="Page No.' + (start - 10) + '-' + (start - 1) + '" onclick="showPage(' + (start - 5) + ');">.....</span>';
        // show page numbers
        for (var page = start; page <= loopEnd; page++) {
            if (page > pages) break;
            pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="showPage(' + page + ');">' + page + '</span>';
        }
        page--;
        // set ... if number of pages is greater than number of loop page
        if (pages > page)
            pagerHtml += '<span class="regularDataBlue" title="Page No.' + (loopEnd + 1) + '-' + ((loopEnd + 10) > pages ? pages : (loopEnd + 10)) + '" onclick="showPage(' + (loopEnd + 1) + ');">.....</span>';
        // show next button
        pagerHtml += '<span id="pgNext" onclick="next();" class="pg-normal" title="Next Page"><img src="Images/nextPage.png" alt="Next"/></span>';
        // show last button
        pagerHtml += '<span id="pgLast" onclick="last();" class="pg-normal" title="Last Page"><img src="Images/lastPage.png" alt="Last"/></span>';
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
