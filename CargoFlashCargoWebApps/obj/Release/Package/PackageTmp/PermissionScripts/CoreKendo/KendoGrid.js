
//kendo.filtermenu.js

(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        NUMERICTEXTBOX = "kendoNumericTextBox",
        DATEPICKER = "kendoDatePicker",
        proxy = $.proxy,
        POPUP = "kendoPopup",
        EQ = "Is equal to",
        NEQ = "Is not equal to",
        Widget = ui.Widget;

    var booleanTemplate =
            '<div>' +
                '<div class="k-filter-help-text">#=messages.info#</div>'+
                '<label>'+
                    '<input type="radio" data-#=ns#bind="checked: filters[0].value" value="true" name="filters[0].value"/>' +
                    '#=messages.isTrue#' +
                '</label>' +
                '<label>'+
                    '<input type="radio" data-#=ns#bind="checked: filters[0].value" value="false" name="filters[0].value"/>' +
                    '#=messages.isFalse#' +
                '</label>' +
                '<button type="submit" class="k-button">#=messages.filter#</button>'+
                '<button type="reset" class="k-button">#=messages.clear#</button>'+
            '</div>';

    var defaultTemplate =
            '<div>' +
                '<div class="k-filter-help-text">#=messages.info#</div>'+
                '<select data-#=ns#bind="value: filters[0].operator" data-#=ns#role="dropdownlist">'+
                    '#for(var op in operators){#'+
                        '<option value="#=op#">#=operators[op]#</option>'+
                    '#}#'+
                '</select>'+
                '#if(values){#' +
                    '<select data-#=ns#bind="value:filters[0].value" data-#=ns#text-field="text" data-#=ns#value-field="value" data-#=ns#source=\'#=kendo.stringify(values)#\' data-#=ns#role="dropdownlist" data-#=ns#option-label="#=messages.selectValue#">' +
                    '</select>' +
                '#}else{#' +
                    '<input data-#=ns#bind="value:filters[0].value" class="k-textbox" type="text" data-#=ns#type="#=type#"/>'+
                '#}#' +
                '#if(extra){#'+
                    '<select class="k-filter-and" data-#=ns#bind="value: logic" data-#=ns#role="dropdownlist">'+
                        '<option value="and">#=messages.and#</option>'+
                        '<option value="or">#=messages.or#</option>'+
                    '</select>'+
                    '<select data-#=ns#bind="value: filters[1].operator" data-#=ns#role="dropdownlist">'+
                        '#for(var op in operators){#'+
                            '<option value="#=op#">#=operators[op]#</option>'+
                        '#}#'+
                    '</select>'+
                    '#if(values){#' +
                        '<select data-#=ns#bind="value:filters[1].value" data-#=ns#text-field="text" data-#=ns#value-field="value" data-#=ns#source=\'#=kendo.stringify(values)#\' data-#=ns#role="dropdownlist" data-#=ns#option-label="#=messages.selectValue#">' +
                        '</select>'+
                    '#}else{#' +
                        '<input data-#=ns#bind="value: filters[1].value" class="k-textbox" type="text" data-#=ns#type="#=type#"/>'+
                    '#}#' +
                '#}#'+
                '<button type="submit" class="k-button">#=messages.filter#</button>'+
                '<button type="reset" class="k-button">#=messages.clear#</button>'+
            '</div>';

    function removeFiltersForField(expression, field) {
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function(filter) {
                removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    function convertItems(items) {
        var idx,
            length,
            item,
            value,
            text,
            result;

        if (items && items.length) {
            result = [];
            for (idx = 0, length = items.length; idx < length; idx++) {
                item = items[idx];
                text = item.text || item.value || item;
                value = item.value == null ? (item.text || item) : item.value;

                result[idx] = { text: text, value: value };
            }
        }
        return result;
    }

    var FilterMenu = Widget.extend({
        init: function(element, options) {
            var that = this,
                type = "string",
                link,
                field,
                operators;

            Widget.fn.init.call(that, element, options);

            operators = options.operators || {};
            element = that.element;
            options = that.options;

            if (!options.appendToElement) {
                link = element.addClass("k-filterable").find(".k-grid-filter");

                if (!link[0]) {
                    link = element.prepend('<a class="k-grid-filter" href="#"><span class="k-icon k-filter"/></a>').find(".k-grid-filter");
                }
                that._clickHandler = proxy(that._click, that);
                link.click(that._clickHandler);
            } else {
                that.link = $();
            }

            that.dataSource = options.dataSource.bind("change", proxy(that.refresh, that));

            that.field = options.field || element.attr(kendo.attr("field"));

            that.model = that.dataSource.reader.model;

            that._parse = function(value) {
                 return value + "";
            };

            if (that.model && that.model.fields) {
                field = that.model.fields[that.field];

                if (field) {
                    type = field.type || "string";
                    that._parse = proxy(field.parse, field);
                }
            }

            if (options.values) {
                type = "enums";
            }

            operators = operators[type] || options.operators[type];

            that.form = $('<form class="k-filter-menu"/>');

            that.form.html(kendo.template(type === "boolean" ? booleanTemplate : defaultTemplate)({
                field: that.field,
                ns: kendo.ns,
                messages: options.messages,
                extra: options.extra,
                operators: operators,
                type: type,
                values: convertItems(options.values)
            }));

            if (!options.appendToElement) {
                that.popup = that.form[POPUP]({
                    anchor: link,
                    open: proxy(that._open, that)
                }).data(POPUP);

                that.link = link;
            } else {
                element.append(that.form);
                that.popup = that.element.closest(".k-popup").data(POPUP);
            }

            that.form
                .bind({
                    submit: proxy(that._submit, that),
                    reset: proxy(that._reset, that)
                })
                .find("[" + kendo.attr("type") + "=number]")
                .removeClass("k-textbox")
                [NUMERICTEXTBOX]()
                .end()
                .find("[" + kendo.attr("type") + "=date]")
                .removeClass("k-textbox")
                [DATEPICKER]();


            that.refresh();
        },

        refresh: function() {
            var that = this,
                expression = that.dataSource.filter() || { filters: [], logic: "and" };

            that.filterModel = kendo.observable({
                logic: "and",
                filters: [{ field: that.field, operator: "eq", value: "" }, { field: that.field, operator: "eq", value: "" }]
            });

            kendo.bind(that.form, that.filterModel);

            if (that._bind(expression)) {
                that.link.addClass("k-state-active");
            } else {
                that.link.removeClass("k-state-active");
            }
        },

        destroy: function() {
            kendo.unbind(this.form);

            this.form.remove();

            this.form.removeData(POPUP);
            this.link.unbind("click", this._clickHandler);
            this.element.removeData("kendoFilterMenu");
        },

        _bind: function(expression) {
            var that = this,
                filters = expression.filters,
                idx,
                length,
                found = false,
                current = 0,
                filterModel = that.filterModel,
                currentFilter,
                filter;

            for (idx = 0, length = filters.length; idx < length; idx++) {
                filter = filters[idx];
                if (filter.field == that.field) {
                    filterModel.set("logic", expression.logic);

                    currentFilter = filterModel.filters[current];
                    currentFilter.set("value", filter.value);
                    currentFilter.set("operator", filter.operator);

                    current++;
                    found = true;
                } else if (filter.filters) {
                    found = found || that._bind(filter);
                }
            }

            return found;
        },

        _merge: function(expression) {
            var that = this,
                logic = expression.logic || "and",
                filters = expression.filters,
                filter,
                result = that.dataSource.filter() || { filters:[], logic: "and" },
                idx,
                length;

            removeFiltersForField(result, that.field);

            filters = $.grep(filters, function(filter) {
                return filter.value !== "";
            });

            for (idx = 0, length = filters.length; idx < length; idx++) {
                filter = filters[idx];
                filter.value = filter.value;
            }

            if (filters.length) {
                if (result.filters.length) {
                    expression.filters = filters;

                    if (result.logic !== "and") {
                        result.filters = [ { logic: result.logic, filters: result.filters }];
                        result.logic = "and";
                    }

                    if (filters.length > 1) {
                        result.filters.push(expression);
                    } else {
                        result.filters.push(filters[0]);
                    }
                } else {
                    result.filters = filters;
                    result.logic = logic;
                }
            }

            return result;
        },

        filter: function(expression) {
            expression = this._merge(expression);

            if (expression.filters.length) {
                this.dataSource.filter(expression);
            }
        },

        clear: function() {
            var that = this,
                expression = that.dataSource.filter() || { filters:[] };

            expression.filters = $.grep(expression.filters, function(filter) {
                if (filter.filters) {
                    filter.filters = $.grep(filter.filters, function(expr) {
                        return expr.field != that.field;
                    });

                    return filter.filters.length;
                }

                return filter.field != that.field;
            });

            if (!expression.filters.length) {
                expression = null;
            }

            that.dataSource.filter(expression);
        },

        _submit: function(e) {
            var that = this;

            e.preventDefault();

            that.filter(that.filterModel.toJSON());

            that.popup.close();
        },

        _reset: function(e) {
            this.clear();
            this.popup.close();
        },

        _click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.popup.toggle();
        },

        _open: function() {
            var popup;

            $(".k-filter-menu").not(this.form).each(function() {
                popup = $(this).data(POPUP);
                if (popup) {
                    popup.close();
                }
            });
        },

        options: {
            name: "FilterMenu",
            extra: true,
            appendToElement: false,
            type: "string",
            operators: {
                string: {
                    eq: EQ,
                    neq: NEQ,
                    startswith: "Starts with",
                    contains: "Contains",
                    doesnotcontain: "Does not contain",
                    endswith: "Ends with"
                },
                number: {
                    eq: EQ,
                    neq: NEQ,
                    gte: "Is greater than or equal to",
                    gt: "Is greater than",
                    lte: "Is less than or equal to",
                    lt: "Is less than"
                },
                date: {
                    eq: EQ,
                    neq: NEQ,
                    gte: "Is after or equal to",
                    gt: "Is after",
                    lte: "Is before or equal to",
                    lt: "Is before"
                },
                enums: {
                    eq: EQ,
                    neq: NEQ
                }
            },
            messages: {
                info: "Show items with value that:",
                isTrue: "is true",
                isFalse: "is false",
                filter: "Filter",
                clear: "Clear",
                and: "And",
                or: "Or",
                selectValue: "-Select value-"
            }
        }
    });

    ui.plugin(FilterMenu);
})(jQuery);

//kendo.pager.js

(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        proxy = $.proxy,
        FIRST = ".k-i-seek-w",
        LAST = ".k-i-seek-e",
        PREV = ".k-i-arrow-w",
        NEXT = ".k-i-arrow-e",
        CHANGE = "change",
        CLICK = "click",
        KEYDOWN = "keydown",
        DISABLED = "disabled",
        iconTemplate = kendo.template('<a href="\\#" title="#=text#" class="k-link"><span class="k-icon #= className #">#=text#</span></a>');

    function button(template, idx, text, numeric) {
        return template( {
            idx: idx,
            text: text,
            ns: kendo.ns,
            numeric: numeric
        });
    }

    function icon(className, text) {
        return iconTemplate({
            className: className.substring(1),
            text: text
        });
    }

    function update(element, selector, page, disabled) {
       element.find(selector)
              .parent()
              .attr(kendo.attr("page"), page)
              .toggleClass("k-state-disabled", disabled);
    }

    function first(element, page, totalPages) {
        update(element, FIRST, 1, page <= 1);
    }

    function prev(element, page, totalPages) {
        update(element, PREV, Math.max(1, page - 1), page <= 1);
    }

    function next(element, page, totalPages) {
        update(element, NEXT, Math.min(totalPages, page + 1), page >= totalPages);
    }

    function last(element, page, totalPages) {
        update(element, LAST, totalPages, page >= totalPages);
    }

    var Pager = Widget.extend( {
        init: function(element, options) {
            var that = this, page, totalPages;

            Widget.fn.init.call(that, element, options);

            options = that.options;
            that.dataSource = options.dataSource;
            that.linkTemplate = kendo.template(that.options.linkTemplate);
            that.selectTemplate = kendo.template(that.options.selectTemplate);

            page = that.page();
            totalPages = that.totalPages();

            that._refreshHandler = proxy(that.refresh, that);

            that.dataSource.bind(CHANGE, that._refreshHandler);

            if (options.previousNext) {
                if (!that.element.find(FIRST).length) {
                    that.element.append(icon(FIRST, options.messages.first));

                    first(that.element, page, totalPages);
                }

                if (!that.element.find(PREV).length) {
                    that.element.append(icon(PREV, options.messages.previous));

                    prev(that.element, page, totalPages);
                }
            }

            if (options.numeric) {
                that.list = that.element.find(".k-pager-numbers");

                if (!that.list.length) {
                   that.list = $('<ul class="k-pager-numbers k-reset" />').appendTo(that.element);
                }
            }

            if (options.input) {
                if (!that.element.find(".k-pager-input").length) {
                   that.element.append('<span class="k-pager-input k-label">'+
                       options.messages.page +
                       '<input class="k-textbox">' +
                       kendo.format(options.messages.of, totalPages) +
                       '</span>');
                }

                that._keydownHandler = proxy(that._keydown, that);
                that.element.on(KEYDOWN, ".k-pager-input input", that._keydownHandler);
            }

            if (options.previousNext) {
                if (!that.element.find(NEXT).length) {
                    that.element.append(icon(NEXT, options.messages.next));

                    next(that.element, page, totalPages);
                }

                if (!that.element.find(LAST).length) {
                    that.element.append(icon(LAST, options.messages.last));

                    last(that.element, page, totalPages);
                }
            }

            if (options.pageSizes){
                if (!that.element.find(".k-pager-sizes").length){
                     $('<span class="k-pager-sizes k-label"><select/>' + options.messages.itemsPerPage + "</span>")
                        .appendTo(that.element)
                        .find("select")
                        .html($.map($.isArray(options.pageSizes) ? options.pageSizes : [5,10,20], function(page){
                            return "<option>" + page + "</option>";
                        }).join(""))
                        .end()
                        .appendTo(that.element);
                }

                that.element.find(".k-pager-sizes select").val(that.pageSize());

                if (kendo.ui.DropDownList) {
                   that.element.find(".k-pager-sizes select").kendoDropDownList();
                }

                that._changeHandler = proxy(that._change, that);

                that.element.on(CHANGE, ".k-pager-sizes select", that._changeHandler);
            }

            if (options.refresh) {
                if (!that.element.find(".k-pager-refresh").length) {
                    that.element.append('<a href="#" class="k-pager-refresh k-link"  title="' + options.messages.refresh +
                        '"><span class="k-icon k-i-refresh">' + options.messages.refresh + "</span></a>");
                }

                that._reloadHandler = proxy(that._refreshClick, that);

                that.element.on(CLICK, ".k-pager-refresh", that._reloadHandler);
            }

            if (options.info) {
                if (!that.element.find(".k-pager-info").length) {
                    that.element.append('<span class="k-pager-info k-label" />');
                }
            }

            that._clickHandler = proxy(that._click, that);

            that.element.on(CLICK, "a", that._clickHandler);

            if (options.autoBind) {
                that.refresh();
            }
        },

        destroy: function() {
            var that = this;

            that.element.off(CLICK, "a", that._clickHandler);

            that.element.off(KEYDOWN, ".k-pager-input input", that._keydownHandler);

            that.element.off(CHANGE, ".k-pager-sizes select", that._changeHandler);

            that.element.off(CLICK, ".k-pager-refresh", that._reloadHandler);

            that.dataSource.unbind(CHANGE, that._refreshHandler);
        },

        events: [
            CHANGE
        ],

        options: {
            name: "Pager",
            selectTemplate: '<li><span class="k-state-selected">#=text#</span></li>',
            linkTemplate: '<li><a href="\\#" class="k-link" data-#=ns#page="#=idx#">#=text#</a></li>',
            buttonCount: 10,
            autoBind: true,
            numeric: false,
            info: true,
            input: true,
            previousNext: true,
            pageSizes: true,
            refresh: true,
            messages: {
                display: "{0} - {1} of {2} Records ",
                empty: "No Records Found.",
                page: "Page",
                of: "of {0}",
                itemsPerPage: "Records per page",
                first: "First page",
                previous: "Previous page",
                next: "Next page",
                last: "Last page",
                refresh: "Reload"
            }
        },

        refresh: function() {
            var that = this,
                idx,
                end,
                start = 1,
                html = "",
                reminder,
                page = that.page(),
                options = that.options,
                pageSize = that.pageSize(),
                total = that.dataSource.total(),
                totalPages = that.totalPages(),
                linkTemplate = that.linkTemplate,
                buttonCount = options.buttonCount;

            if (options.numeric) {
                if (page > buttonCount) {
                    reminder = (page % buttonCount);

                    start = (reminder === 0) ? (page - buttonCount) + 1 : (page - reminder) + 1;
                }

                end = Math.min((start + buttonCount) - 1, totalPages);

                if (start > 1) {
                    html += button(linkTemplate, start - 1, "...", false);
                }

                for (idx = start; idx <= end; idx++) {
                    html += button(idx == page ? that.selectTemplate : linkTemplate, idx, idx, true);
                }

                if (end < totalPages) {
                    html += button(linkTemplate, idx, "...", false);
                }

                if (html === "") {
                    html = that.selectTemplate({ text: 0 });
                }

                that.list.html(html);
            }

            if (options.info) {
                if (total > 0) {
                    html = kendo.format(options.messages.display,
                        (page - 1) * pageSize + 1, // first item in the page
                        Math.min(page * pageSize, total), // last item in the page
                    total);
                } else {
                    html = options.messages.empty;
                }

                that.element.find(".k-pager-info").html(html);
            }

            if (options.input) {
                that.element
                    .find(".k-pager-input")
                    .html(that.options.messages.page +
                        '<input class="k-textbox">' +
                        kendo.format(options.messages.of, totalPages))
                    .find("input")
                    .val(page)
                    .attr(DISABLED, total < 1)
                    .toggleClass("k-state-disabled", total < 1);
            }

            if (options.previousNext) {
                first(that.element, page, totalPages);

                prev(that.element, page, totalPages);

                next(that.element, page, totalPages);

                last(that.element, page, totalPages);
            }

            if (options.pageSizes) {
                that.element.find(".k-pager-sizes select").val(pageSize);
            }
        },

        _keydown: function(e) {
            if (e.keyCode === kendo.keys.ENTER || e.keyCode === kendo.keys.TAB) {
                var input = this.element.find(".k-pager-input").find("input"),
                    page = parseInt(input.val(), 10);

                if (isNaN(page) || page < 1 || page > this.totalPages()) {
                    page = this.page();
                }

                input.val(page);

                this.page(page);
            }
        },

        _refreshClick: function(e) {
            e.preventDefault();

            this.dataSource.read();
        },

        _change: function(e) {
            var pageSize = parseInt(e.currentTarget.value, 10);

            if (!isNaN(pageSize)){
               this.dataSource.pageSize(pageSize);
            }
        },

        _click: function(e) {
            var target = $(e.currentTarget);

            e.preventDefault();

            if (!target.is(".k-state-disabled")) {
                this.page(target.attr(kendo.attr("page")));
            }
        },
        
        totalPages: function() {
            return Math.ceil((this.dataSource.total() || 0) / this.pageSize());
        },

        pageSize: function() {
            return this.dataSource.pageSize() || this.dataSource.total();
        },

        page: function(page) {
            if (page !== undefined) {
                this.dataSource.page(page);

                this.trigger(CHANGE, { index: page });
            } else {
                if (this.dataSource.total() > 0) {
                    return this.dataSource.page();
                } else {
                    return 0;
                }
            }
        }
    });

    ui.plugin(Pager);
})(jQuery);

//kendo.sortable.js

(function($, undefined) {
    var kendo = window.kendo,
        proxy = $.proxy,
        DIR = "data-dir",
        ASC = "asc",
        SINGLE = "single",
        FIELD = "data-field",
        DESC = "desc",
        TLINK = ".k-link",
        Widget = kendo.ui.Widget;

    var Sortable = Widget.extend({
        init: function(element, options) {
            var that = this, link;

            Widget.fn.init.call(that, element, options);

            that.dataSource = that.options.dataSource.bind("change", proxy(that.refresh, that));
            link = that.element.find(TLINK);

            if (!link[0]) {
                link = that.element.wrapInner('<a class="k-link" href="#"/>').find(TLINK);
            }

            that.link = link;
            that.element.click(proxy(that._click, that));
        },

        options: {
            name: "Sortable",
            mode: SINGLE,
            allowUnsort: true
        },

        refresh: function() {
            var that = this,
                sort = that.dataSource.sort() || [],
                idx,
                length,
                descriptor,
                dir,
                element = that.element,
                field = element.attr(FIELD);

            element.removeAttr(DIR);

            for (idx = 0, length = sort.length; idx < length; idx++) {
               descriptor = sort[idx];

               if (field == descriptor.field) {
                   element.attr(DIR, descriptor.dir);
               }
            }

            dir = element.attr(DIR);

            element.find(".k-i-arrow-n,.k-i-arrow-s").remove();

            if (dir === ASC) {
                $('<span class="k-icon k-i-arrow-n" />').appendTo(that.link);
            } else if (dir === DESC) {
                $('<span class="k-icon k-i-arrow-s" />').appendTo(that.link);
            }
        },

        _click: function(e) {
            var that = this,
                element = that.element,
                field = element.attr(FIELD),
                dir = element.attr(DIR),
                options = that.options,
                sort = that.dataSource.sort() || [],
                idx,
                length;

            if (dir === ASC) {
                dir = DESC;
            } else if (dir === DESC && options.allowUnsort) {
                dir = undefined;
            } else {
                dir = ASC;
            }

            if (options.mode === SINGLE) {
                sort = [ { field: field, dir: dir } ];
            } else if (options.mode === "multiple") {
                for (idx = 0, length = sort.length; idx < length; idx++) {
                    if (sort[idx].field === field) {
                        sort.splice(idx, 1);
                        break;
                    }
                }
                sort.push({ field: field, dir: dir });
            }

            e.preventDefault();

            that.dataSource.sort(sort);
        }
    });

    kendo.ui.plugin(Sortable);
})(jQuery);

//kendo.draganddrop.js

(function($, undefined) {
    var kendo = window.kendo,
        support = kendo.support,
        pointers = support.pointers,
        document = window.document,
        SURFACE = $(document.documentElement),
        Class = kendo.Class,
        Widget = kendo.ui.Widget,
        Observable = kendo.Observable,
        proxy = $.proxy,
        now = $.now,
        extend = $.extend,
        getOffset = kendo.getOffset,
        draggables = {},
        dropTargets = {},
        lastDropTarget,
        invalidZeroEvents = support.mobileOS && support.mobileOS.android,
        START_EVENTS = "mousedown",
        MOVE_EVENTS = "mousemove",
        END_EVENTS = "mouseup mouseleave",
        KEYUP = "keyup",
        CHANGE = "change",

        // Draggable events
        DRAGSTART = "dragstart",
        DRAG = "drag",
        DRAGEND = "dragend",
        DRAGCANCEL = "dragcancel",

        // DropTarget events
        DRAGENTER = "dragenter",
        DRAGLEAVE = "dragleave",
        DROP = "drop",

        // Drag events
        START = "start",
        MOVE = "move",
        END = "end",
        CANCEL = "cancel",
        TAP = "tap";

    if (support.touch) {
        START_EVENTS = "touchstart";
        MOVE_EVENTS = "touchmove";
        END_EVENTS = "touchend touchcancel";
    }

    if(pointers) {
        START_EVENTS = "MSPointerDown";
        MOVE_EVENTS = "MSPointerMove";
        END_EVENTS = "MSPointerUp MSPointerCancel";
    }

    function contains(parent, child) {
        try {
            return $.contains(parent, child) || parent == child;
        } catch (e) {
            return false;
        }
    }

    function elementUnderCursor(e) {
        return document.elementFromPoint(e.x.client, e.y.client);
    }

    function numericCssPropery(element, property) {
        return parseInt(element.css(property), 10) || 0;
    }

    function within(value, range) {
        return Math.min(Math.max(value, range.min), range.max);
    }

    function containerBoundaries(container, element) {
        var offset = container.offset(),
            minX = offset.left + numericCssPropery(container, "borderLeftWidth") + numericCssPropery(container, "paddingLeft"),
            minY = offset.top + numericCssPropery(container, "borderTopWidth") + numericCssPropery(container, "paddingTop"),
            maxX = minX + container.width() - element.outerWidth(true),
            maxY = minY + container.height() - element.outerHeight(true);

        return {
            x: { min: minX, max: maxX },
            y: { min: minY, max: maxY }
        };
    }

    function addNS(events, ns) {
        return events.replace(/ /g, ns + " ");
    }

    function preventTrigger(e) {
        e.preventDefault();

        var target = $(e.target),   // Determine the correct parent to receive the event and bubble.
            parent = target.closest(".k-widget").parent();

        if (!parent[0]) {
            parent = target.parent();
        }

        parent.trigger(e.type);
    }

    /**
     * @name kendo.DragAxis.Description
     *
     * @section <h4>DragAxis</h4>
     * The DragAxis is used internally by the kendo.Drag component to store and calculate event data.
     * The Drag component contains two DragAxis instances: <code>x</code> for the horizontal coordinates, and <code>y</code> for the vertical.
     * The two DragAxis instances are available in each Drag event parameter.
     * @exampleTitle Access DragAxis information in Drag start event
     * @example
     * new kendo.Drag($("#foo"), {
     *  start: function(e) {
     *      console.log(x); // Horizontal axis
     *      console.log(y); // Vertical axis
     *  }
     * });
     *
     * @section Each axis instance contains the following fields:
     * <ul>
     *   <li><b>location</b> - the offset of the mouse/touch relative to the entire document (pageX/Y);</li>
     *   <li><b>startLocation</b> - the offset of the mouse/touch relative to the document when the drag started;</li>
     *   <li><b>client</b> - the offset of the mouse/touch relative to the viewport (clientX/Y);</li>
     *   <li><b>delta</b> - the change from the previous event location</li>
     *   <li><b>velocity</b> - the pixels per millisecond speed of the current move.</li>
     * </ul>
     */
    var DragAxis = Class.extend(/** @lends kendo.DragAxis.prototype */{
        /**
         * @constructs
         */
        init: function(axis) {
            this.axis = axis;
        },

        start: function(location, timeStamp) {
            var that = this,
                offset = location["page" + that.axis];

            that.startLocation = that.location = offset;
            that.client = location["client" + that.axis];
            that.velocity = that.delta = 0;
            that.timeStamp = timeStamp;
        },

        move: function(location, timeStamp) {
            var that = this,
                offset = location["page" + that.axis];

            if (!offset && invalidZeroEvents) {
                return;
            }

            that.delta = offset - that.location;
            that.location = offset;
            that.client = location["client" + that.axis];
            that.initialDelta = offset - that.startLocation;
            that.velocity = that.delta / (timeStamp - that.timeStamp);
            that.timeStamp = timeStamp;
        }
    });

    /**
     * @name kendo.Drag.Description
     * @section <h4>Drag</h4> The kendo Drag component provides a cross-browser, touch-friendly way to handle mouse and touch drag events.
     * @exampleTitle <b>Drag</b> initialization
     * @example
     * var drag = new kendo.Drag($("#draggable"));
     */
    var Drag = Observable.extend(/** @lends kendo.Drag.prototype */{
        /**
         * @constructs
         * @extends kendo.Observable
         * @param {Element} element the DOM element from which the drag event starts.
         * @param {Object} options Configuration options.
         * @option {Number} [threshold] <0> The minimum distance the mouse/touch should move before the event is triggered.
         * @option {Boolean} [global] <false> If set to true, the drag event will be tracked beyond the element boundaries.
         * @option {Element} [surface]  If set, the drag event will be tracked for the surface boundaries. By default, leaving the element boundaries will end the drag.
         * @option {Boolean} [allowSelection] <false> If set to true, the mousedown and selectstart events will not be prevented.
         * @option {Boolean} [stopPropagation] <false> If set to true, the mousedown event propagation will be stopped, disabling
         * drag capturing at parent elements.
         * If set to false, dragging outside of the element boundaries will trigger the <code>end</code> event.
         * @option {Selector} [filter] If passed, the filter limits the child elements that will trigger the event sequence.
         */
        init: function(element, options) {
            var that = this,
                eventMap = {},
                filter,
                preventIfMoving,
                ns = "." + kendo.guid();

            options = options || {};
            filter = that.filter = options.filter;
            that.threshold = options.threshold || 0;

            element = $(element);
            Observable.fn.init.call(that);

            eventMap[addNS(MOVE_EVENTS, ns)] = proxy(that._move, that);
            eventMap[addNS(END_EVENTS, ns)] = proxy(that._end, that);

            extend(that, {
                x: new DragAxis("X"),
                y: new DragAxis("Y"),
                element: element,
                surface: options.global ? SURFACE : options.surface || element,
                stopPropagation: options.stopPropagation,
                pressed: false,
                eventMap: eventMap,
                ns: ns
            });

            element
                .on(START_EVENTS, filter, proxy(that._start, that))
                .on("dragstart", filter, kendo.preventDefault);

            if (pointers) {
                element.css("-ms-touch-action", "pinch-zoom double-tap-zoom");
            }

            if (!options.allowSelection) {
                var args = ["mousedown selectstart", filter, preventTrigger];

                if (filter instanceof $) {
                    args.splice(2, 0, null);
                }

                element.on.apply(element, args);
            }

            if (support.eventCapture) {
                preventIfMoving = function(e) {
                    if (that.moved) {
                        e.preventDefault();
                    }
                };

                that.surface[0].addEventListener(support.mouseup, preventIfMoving, true);
            }

            that.bind([
            /**
             * Fires when the user presses and releases the element without any movement or with a movement below the <code>threshold</code> specified.
             * @name kendo.Drag#tap
             * @event
             * @param {Event} e
             * @param {DragAxis} e.x Reference to the horizontal drag axis instance.
             * @param {DragAxis} e.y Reference to the vertical drag axis instance.
             * @param {jQueryEvent} e.event Reference to the jQuery event object.
             * @param {Element} e.target Reference to the DOM element from which the Drag started.
             * It is different from the element only if <code>filter</code> option is specified.
             */
            TAP,
            /**
             * Fires when the user starts dragging the element.
             * @name kendo.Drag#start
             * @event
             * @param {Event} e
             * @param {DragAxis} e.x Reference to the horizontal drag axis instance.
             * @param {DragAxis} e.y Reference to the vertical drag axis instance.
             * @param {jQueryEvent} e.event Reference to the jQuery event object.
             * @param {Element} e.target Reference to the DOM element from which the Drag started.
             * It is different from the element only if <code>filter</code> option is specified.
             */
            START,
            /**
             * Fires while dragging.
             * @name kendo.Drag#move
             * @event
             * @param {Event} e
             * @param {DragAxis} e.x Reference to the horizontal drag axis instance.
             * @param {DragAxis} e.y Reference to the vertical drag axis instance.
             * @param {jQueryEvent} e.event Reference to the jQuery event object.
             * @param {Element} e.target Reference to the DOM element from which the Drag started.
             * It is different from the element only if <code>filter</code> option is specified.
             */
            MOVE,
            /**
             * Fires when the drag ends.
             * @name kendo.Drag#end
             * @event
             * @param {Event} e
             * @param {DragAxis} e.x Reference to the horizontal drag axis instance.
             * @param {DragAxis} e.y Reference to the vertical drag axis instance.
             * @param {jQueryEvent} e.event Reference to the jQuery event object.
             * @param {Element} e.target Reference to the DOM element from which the Drag started.
             * It is different from the element only if <code>filter</code> option is specified.
             */
            END,
            /**
             * Fires when the drag is canceled. This  when the <code>cancel</code> method is called.
             * @name kendo.Drag#cancel
             * @event
             * @param {Event} e
             * @param {DragAxis} e.x Reference to the horizontal drag axis instance.
             * @param {DragAxis} e.y Reference to the vertical drag axis instance.
             * @param {jQueryEvent} e.event Reference to the jQuery event object.
             * @param {Element} e.target Reference to the DOM element from which the Drag started.
             * It is different from the element only if <code>filter</code> option is specified.
             */
            CANCEL], options);
        },

        /**
         * Capture the current drag, so that Drag listeners bound to parent elements will not trigger.
         * This method will not have any effect if the current drag instance is instantiated with the <code>global</code> option set to true.
         */
        capture: function() {
            Drag.captured = true;
        },

        /**
         * Discard the current drag. Calling the <code>cancel</code> method will trigger the <code>cancel</code> event.
         * The correct moment to call this method would be in the <code>start</code> event handler.
         * @exampleTitle Cancel the drag event sequence
         * @example
         * new kendo.Drag($("#foo"), {
         *  start: function(e) {
         *      e.cancel();
         *  }
         * });
         */
        cancel: function() {
            this._cancel();
            this.trigger(CANCEL);
        },

        skip: function() {
            this._cancel();
        },

        _cancel: function() {
            var that = this;
            that.moved = that.pressed = false;
            that.surface.off(that.ns);
        },

        _start: function(e) {
            var that = this,
                filter = that.filter,
                originalEvent = e.originalEvent,
                touch,
                location = e;

            if (that.pressed) { return; }

            if (filter) {
                that.target = $(e.target).is(filter) ? $(e.target) : $(e.target).closest(filter);
            } else {
                that.target = that.element;
            }

            if (!that.target.length) {
                return;
            }

            that.currentTarget = e.currentTarget;

            if (that.stopPropagation) {
                e.stopPropagation();
            }

            that.pressed = true;
            that.moved = false;
            that.startTime = null;

            if (support.touch) {
                touch = originalEvent.changedTouches[0];
                that.touchID = touch.identifier;
                location = touch;
            }

            if (pointers) {
                that.touchID = originalEvent.pointerId;
                location = originalEvent;
            }

            that._perAxis(START, location, now());
            that.surface.off(that.eventMap).on(that.eventMap);
            Drag.captured = false;
        },

        _move: function(e) {
            var that = this,
                xDelta,
                yDelta,
                delta;

            if (!that.pressed) { return; }

            that._withEvent(e, function(location) {

                that._perAxis(MOVE, location, now());

                if (!that.moved) {
                    xDelta = that.x.initialDelta;
                    yDelta = that.y.initialDelta;

                    delta = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

                    if (delta <= that.threshold) {
                        return;
                    }

                    if (!Drag.captured) {
                        that.startTime = now();
                        that._trigger(START, e);
                        that.moved = true;
                    } else {
                        return that._cancel();
                    }
                }

                // Event handlers may cancel the swipe in the START event handler, hence the double check for pressed.
                if (that.pressed) {
                    that._trigger(MOVE, e);
                }
            });
        },

        _end: function(e) {
            var that = this;

            if (!that.pressed) { return; }

            that._withEvent(e, function() {
                if (that.moved) {
                    that.endTime = now();
                    that._trigger(END, e);
                    that.moved = false;
                } else {
                    that._trigger(TAP, e);
                }

                that._cancel();
            });
        },

        _perAxis: function(method, location, timeStamp) {
            this.x[method](location, timeStamp);
            this.y[method](location, timeStamp);
        },

        _trigger: function(name, e) {
            var data = {
                x: this.x,
                y: this.y,
                target: this.target,
                event: e
            };

            if(this.trigger(name, data)) {
                e.preventDefault();
            }
        },

        _withEvent: function(e, callback) {
            var that = this,
                touchID = that.touchID,
                originalEvent = e.originalEvent,
                touches,
                idx;

            if (support.touch) {
                touches = originalEvent.changedTouches;
                idx = touches.length;

                while (idx) {
                    idx --;
                    if (touches[idx].identifier === touchID) {
                        return callback(touches[idx]);
                    }
                }
            }
            else if (pointers) {
                if (touchID === originalEvent.pointerId) {
                    return callback(originalEvent);
                }
            } else {
                return callback(e);
            }
        }
    });

    var Tap = Observable.extend({
        init: function(element, options) {
            var that = this,
                domElement = element[0];

            that.capture = false;
            domElement.addEventListener(START_EVENTS, proxy(that._press, that), true);
            $.each(END_EVENTS.split(" "), function() {
                domElement.addEventListener(this, proxy(that._release, that), true);
            });

            Observable.fn.init.call(that);

            that.bind(["press", "release"], options || {});
        },

        _press: function(e) {
            var that = this;
            that.trigger("press");
            if (that.capture) {
                e.preventDefault();
            }
        },

        _release: function(e) {
            var that = this;
            that.trigger("release");

            if (that.capture) {
                e.preventDefault();
                that.cancelCapture();
            }
        },

        captureNext: function() {
            this.capture = true;
        },

        cancelCapture: function() {
            this.capture = false;
        }
    });

    var PaneDimension = Observable.extend({
        init: function(options) {
            var that = this;
            Observable.fn.init.call(that);

            $.extend(that, options);

            that.max = 0;

            if (that.horizontal) {
                that.measure = "width";
                that.scrollSize = "scrollWidth";
                that.axis = "x";
            } else {
                that.measure = "height";
                that.scrollSize = "scrollHeight";
                that.axis = "y";
            }
        },

        outOfBounds: function(offset) {
            return  offset > this.max || offset < this.min;
        },

        present: function() {
            return this.max - this.min;
        },

        getSize: function() {
            return this.container[this.measure]();
        },

        getTotal: function() {
            return this.element[0][this.scrollSize];
        },

        update: function(silent) {
            var that = this;

            that.size = that.getSize();
            that.total = that.getTotal();
            that.min = Math.min(that.max, that.size - that.total);
            if (!silent) {
                that.trigger(CHANGE, that);
            }
        }
    });

    var PaneDimensions = Observable.extend({
        init: function(options) {
            var that = this,
                refresh = proxy(that.refresh, that);

            Observable.fn.init.call(that);

            that.x = new PaneDimension(extend({horizontal: true}, options));
            that.y = new PaneDimension(extend({horizontal: false}, options));

            that.bind(CHANGE, options);

            kendo.onResize(refresh);
        },

        present: function() {
            return this.x.present() || this.y.present();
        },

        refresh: function() {
            this.x.update();
            this.y.update();
            this.trigger(CHANGE);
        }
    });

    var PaneAxis = Observable.extend({
        init: function(options) {
            var that = this;
            extend(that, options);
            Observable.fn.init.call(that);
        },

        dragMove: function(delta) {
            var that = this,
                dimension = that.dimension,
                axis = that.axis,
                movable = that.movable,
                position = movable[axis] + delta;

            if (!dimension.present()) {
                return;
            }

            if ((position < dimension.min && delta < 0) || (position > dimension.max && delta > 0)) {
                delta *= that.resistance;
            }

            movable.translateAxis(axis, delta);
            that.trigger(CHANGE, that);
        }
    });

    var Pane = Class.extend({
        init: function(options) {
            var that = this,
                x,
                y,
                resistance;

            extend(that, {elastic: true}, options);

            resistance = that.elastic ? 0.5 : 0;

            that.x = x = new PaneAxis({
                axis: "x",
                dimension: that.dimensions.x,
                resistance: resistance,
                movable: that.movable
            });

            that.y = y = new PaneAxis({
                axis: "y",
                dimension: that.dimensions.y,
                resistance: resistance,
                movable: that.movable
            });

            that.drag.bind(["move", "end"], {
                move: function(e) {
                    if (x.dimension.present() || y.dimension.present()) {
                        x.dragMove(e.x.delta);
                        y.dragMove(e.y.delta);
                        e.preventDefault();
                    } else {
                        that.drag.skip();
                    }
                },

                end: function(e) {
                    e.preventDefault();
                }
            });
        }
    });

    var TRANSFORM_STYLE = support.transitions.prefix + "Transform",
        round = Math.round,
        translate;

    if (support.hasHW3D) {
        translate = function(x, y) {
            return "translate3d(" + round(x) + "px," + round(y) +"px,0)";
        };
    } else {
        translate = function(x, y) {
            return "translate(" + round(x) + "px," + round(y) +"px)";
        };
    }

    var Movable = Observable.extend({
        init: function(element) {
            var that = this;

            Observable.fn.init.call(that);

            that.element = $(element);
            that.x = 0;
            that.y = 0;
            that._saveCoordinates(translate(that.x, that.y));
        },

        translateAxis: function(axis, by) {
            this[axis] += by;
            this.refresh();
        },

        translate: function(coordinates) {
            this.x += coordinates.x;
            this.y += coordinates.y;
            this.refresh();
        },

        moveAxis: function(axis, value) {
            this[axis] = value;
            this.refresh();
        },

        moveTo: function(coordinates) {
            extend(this, coordinates);
            this.refresh();
        },

        refresh: function() {
            var that = this,
                newCoordinates = translate(that.x, that.y);

            if (newCoordinates != that.coordinates) {
                that.element[0].style[TRANSFORM_STYLE] = newCoordinates;
                that._saveCoordinates(newCoordinates);
                that.trigger(CHANGE);
            }
        },

        _saveCoordinates: function(coordinates) {
            this.coordinates = coordinates;
        }
    });

    var DropTarget = Widget.extend(/** @lends kendo.ui.DropTarget.prototype */ {
        /**
         * @constructs
         * @extends kendo.ui.Widget
         * @param {Element} element DOM element
         * @param {Object} options Configuration options.
         * @option {String} [group] <"default"> Used to group sets of draggable and drop targets. A draggable with the same group value as a drop target will be accepted by the drop target.
         */
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            var group = that.options.group;

            if (!(group in dropTargets)) {
                dropTargets[group] = [ that ];
            } else {
                dropTargets[group].push( that );
            }
        },

        events: [
            /**
             * Fires when draggable moves over the drop target.
             * @name kendo.ui.DropTarget#dragenter
             * @event
             * @param {Event} e
             * @param {jQuery} e.draggable Reference to the draggable that enters the drop target.
             */
            DRAGENTER,
            /**
             * Fires when draggable moves out of the drop target.
             * @name kendo.ui.DropTarget#dragleave
             * @event
             * @param {Event} e
             * @param {jQuery} e.draggable Reference to the draggable that leaves the drop target.
             */
            DRAGLEAVE,
            /**
             * Fires when draggable is dropped over the drop target.
             * @name kendo.ui.DropTarget#drop
             * @event
             * @param {Event} e
             * @param {jQuery} e.draggable Reference to the draggable that is dropped over the drop target.
             * @param {jQuery} e.draggable.currentTarget The element that the drag and drop operation started from.
             */
            DROP
        ],

        options: {
            name: "DropTarget",
            group: "default"
        },

        _trigger: function(eventName, e) {
            var that = this,
                draggable = draggables[that.options.group];

            if (draggable) {
                return that.trigger(eventName, extend({}, e.event, {
                           draggable: draggable
                       }));
            }
        },

        _over: function(e) {
            this._trigger(DRAGENTER, e);
        },

        _out: function(e) {
            this._trigger(DRAGLEAVE, e);
        },

        _drop: function(e) {
            var that = this,
                draggable = draggables[that.options.group];

            if (draggable) {
                draggable.dropped = !that._trigger(DROP, e);
            }
        }
    });

    /**
     * @name kendo.ui.Draggable.Description
     *
     * @section <h4>Draggable</h4>
     * Enable draggable functionality on any DOM element.
     *
     * @exampleTitle <b>Draggable</b> initialization
     * @example
     * var draggable = $("#draggable").kendoDraggable();
     *
     * @name kendo.ui.DropTarget.Description
     *
     * @section <h4>DropTarget</h4>
     * Enable any DOM element to be a target for draggable elements.
     *
     * @exampleTitle <b>DropTarget</b> initialization
     * @example
     * var dropTarget = $("#dropTarget").kendoDropTarget();
     */
    var Draggable = Widget.extend(/** @lends kendo.ui.Draggable.prototype */{
        /**
         * @constructs
         * @extends kendo.ui.Widget
         * @param {Element} element DOM element
         * @param {Object} options Configuration options.
         * @option {Number} [distance] <5> The required distance that the mouse should travel in order to initiate a drag.
         * @option {Selector} [filter] Selects child elements that are draggable if a widget is attached to a container.
         * @option {String} [group] <"default"> Used to group sets of draggable and drop targets. A draggable with the same group value as a drop target will be accepted by the drop target.
         * @option {String} [axis] <null> Constrains the hint movement to either the horizontal (x) or vertical (y) axis. Can be set to either "x" or "y".
         * @option {jQuery} [container] If set, the hint movement is constrained to the container boundaries.
         * @option {Object} [cursorOffset] <null> If set, specifies the offset of the hint relative to the mouse cursor/finger.
         * By default, the hint is initially positioned on top of the draggable source offset. The option accepts an object with two keys: <code>top</code> and <code>left</code>.
         * _exampleTitle Initialize Draggable with cursorOffset
         * _example
         * $("#draggable").kendoDraggable({cursorOffset: {top: 10, left: 10}});
         * @option {Function | jQuery} [hint] Provides a way for customization of the drag indicator. If a function is supplied, it receives one argument - the draggable element's jQuery object.
         * _example
         *  //hint as a function
         *  $("#draggable").kendoDraggable({
         *      hint: function(element) {
         *          return $("#draggable").clone();
         *          // same as
         *          //  return element.clone();
         *      }
         *  });
         *
         * //hint as jQuery object
         *  $("#draggable").kendoDraggable({
         *      hint: $("#draggableHint");
         *  });
         */
        init: function (element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that.drag = new Drag(that.element, {
                global: true,
                stopPropagation: true,
                filter: that.options.filter,
                threshold: that.options.distance,
                start: proxy(that._start, that),
                move: proxy(that._drag, that),
                end: proxy(that._end, that),
                cancel: proxy(that._cancel, that)
            });

            that.destroy = proxy(that._destroy, that);
            that.captureEscape = function(e) {
                if (e.keyCode === kendo.keys.ESC) {
                    that._trigger(DRAGCANCEL, {event: e});
                    that.drag.cancel();
                }
            };
        },

        events: [
            /**
             * Fires when item drag starts.
             * @name kendo.ui.Draggable#dragstart
             * @event
             * @param {Event} e
             */
            DRAGSTART,
             /**
             * Fires while dragging.
             * @name kendo.ui.Draggable#drag
             * @event
             * @param {Event} e
             */
            DRAG,
             /**
             * Fires when item drag ends.
             * @name kendo.ui.Draggable#dragend
             * @event
             * @param {Event} e
             */
            DRAGEND,
             /**
             * Fires when item drag is canceled by pressing the Escape key.
             * @name kendo.ui.Draggable#dragcancel
             * @event
             * @param {Event} e
             */
            DRAGCANCEL
        ],

        options: {
            name: "Draggable",
            distance: 5,
            group: "default",
            cursorOffset: null,
            axis: null,
            container: null,
            dropped: false
        },

        _start: function(e) {
            var that = this,
                options = that.options,
                container = options.container,
                hint = options.hint;

            that.currentTarget = that.drag.target;
            that.currentTargetOffset = getOffset(that.currentTarget);

            if (hint) {
                that.hint = $.isFunction(hint) ? $(hint(that.currentTarget)) : hint;

                var offset = getOffset(that.currentTarget);
                that.hintOffset = offset;

                that.hint.css( {
                    position: "absolute",
                    zIndex: 20000, // the Window's z-index is 10000 and can be raised because of z-stacking
                    left: offset.left,
                    top: offset.top
                })
                .appendTo(document.body);
            }

            draggables[options.group] = that;

            that.dropped = false;

            if (container) {
                that.boundaries = containerBoundaries(container, that.hint);
            }

            if (that._trigger(DRAGSTART, e)) {
                that.drag.cancel();
                that.destroy();
            }

            $(document).on(KEYUP, that.captureEscape);
        },

        updateHint: function(e) {
            var that = this,
                coordinates,
                options = that.options,
                boundaries = that.boundaries,
                axis = options.axis,
                cursorOffset = that.options.cursorOffset;

            if (cursorOffset) {
               coordinates = { left: e.x.location + cursorOffset.left, top: e.y.location + cursorOffset.top };
            } else {
               that.hintOffset.left += e.x.delta;
               that.hintOffset.top += e.y.delta;
               coordinates = $.extend({}, that.hintOffset);
            }

            if (boundaries) {
                coordinates.top = within(coordinates.top, boundaries.y);
                coordinates.left = within(coordinates.left, boundaries.x);
            }

            if (axis === "x") {
                delete coordinates.top;
            } else if (axis === "y") {
                delete coordinates.left;
            }

            that.hint.css(coordinates);
        },

        _drag: function(e) {
            var that = this;

            e.preventDefault();

            that._withDropTarget(e, function(target) {
                if (!target) {
                    if (lastDropTarget) {
                        lastDropTarget._trigger(DRAGLEAVE, e);
                        lastDropTarget = null;
                    }
                    return;
                }

                if (lastDropTarget) {
                    if (target.element[0] === lastDropTarget.element[0]) {
                        return;
                    }

                    lastDropTarget._trigger(DRAGLEAVE, e);
                }

                target._trigger(DRAGENTER, e);
                lastDropTarget = target;
            });

            that._trigger(DRAG, e);

            if (that.hint) {
                that.updateHint(e);
            }
        },

        _end: function(e) {
            var that = this;

            that._withDropTarget(e, function(target) {
                if (target) {
                    target._drop(e);
                    lastDropTarget = null;
                }
            });

            that._trigger(DRAGEND, e);
            that._cancel(e.event);
        },

        _cancel: function(e) {
            var that = this;

            if (that.hint && !that.dropped) {
                that.hint.animate(that.currentTargetOffset, "fast", that.destroy);
            } else {
                that.destroy();
            }
        },

        _trigger: function(eventName, e) {
            var that = this;

            return that.trigger(
            eventName, extend(
            {},
            e.event,
            {
                x: e.x,
                y: e.y,
                currentTarget: that.currentTarget
            }));
        },

        _withDropTarget: function(e, callback) {
            var that = this,
                target,
                theTarget,
                result,
                options = that.options,
                targets = dropTargets[options.group],
                i = 0,
                length = targets && targets.length;

            if (length) {

                target = elementUnderCursor(e);

                if (that.hint && contains(that.hint, target)) {
                    that.hint.hide();
                    target = elementUnderCursor(e);
                    that.hint.show();
                }

                outer:
                while (target) {
                    for (i = 0; i < length; i ++) {
                        theTarget = targets[i];
                        if (theTarget.element[0] === target) {
                            result = theTarget;
                            break outer;
                        }
                    }

                    target = target.parentNode;
                }

                callback(result);
            }
        },

        _destroy: function() {
            var that = this;

            if (that.hint) {
                that.hint.remove();
            }

            delete draggables[that.options.group];

            that.trigger("destroy");
            $(document).off(KEYUP, that.captureEscape);
        }
    });

    kendo.ui.plugin(DropTarget);
    kendo.ui.plugin(Draggable);
    kendo.Drag = Drag;
    kendo.Tap = Tap;
    kendo.containerBoundaries = containerBoundaries;

    extend(kendo.ui, {
        Pane: Pane,
        PaneDimensions: PaneDimensions,
        Movable: Movable
    });

 })(jQuery);

 //kendo.groupable.js

 (function($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        proxy = $.proxy,
        indicatorTmpl = kendo.template('<div class="k-group-indicator" data-#=data.ns#field="${data.field}" data-#=data.ns#title="${data.title || ""}" data-#=data.ns#dir="${data.dir || "asc"}">' +
                '<a href="\\#" class="k-link">' +
                    '<span class="k-icon k-si-arrow-${(data.dir || "asc") == "asc" ? "n" : "s"}">(sorted ${(data.dir || "asc") == "asc" ? "ascending": "descending"})</span>' +
                    '${data.title ? data.title: data.field}' +
                '</a>' +
                '<a class="k-button k-button-icon k-button-bare">' +
                    '<span class="k-icon k-group-delete"></span>' +
                '</a>' +
             '</div>',  { useWithBlock:false }),
        hint = function(target) {
            return $('<div class="k-header k-drag-clue" />')
                .css({
                    width: target.width(),
                    paddingLeft: target.css("paddingLeft"),
                    paddingRight: target.css("paddingRight"),
                    lineHeight: target.height() + "px",
                    paddingTop: target.css("paddingTop"),
                    paddingBottom: target.css("paddingBottom")
                })
                .html(target.attr(kendo.attr("title")) || target.attr(kendo.attr("field")))
                .prepend('<span class="k-icon k-drag-status k-denied" />');
        },
        dropCue = $('<div class="k-grouping-dropclue"/>'),
        nameSpecialCharRegExp = /(\[|\]|\$|\.|\:|\+)/g;

    function dropCueOffsetTop(element) {
        return element.position().top + 3;
    }

    var Groupable = Widget.extend({
        init: function(element, options) {
            var that = this,
                groupContainer,
                group = kendo.guid(),
                intializePositions = proxy(that._intializePositions, that),
                draggable,
                dropCuePositions = that._dropCuePositions = [];

            Widget.fn.init.call(that, element, options);

            draggable = that.options.draggable || new kendo.ui.Draggable(that.element, {
                filter: that.options.filter,
                hint: hint,
                group: group
            });

            groupContainer = that.groupContainer = $(that.options.groupContainer, that.element)
                .kendoDropTarget({
                    group: draggable.options.group,
                    dragenter: function(e) {
                        if (that._canDrag(e.draggable.currentTarget)) {
                            e.draggable.hint.find(".k-drag-status").removeClass("k-denied").addClass("k-add");
                            dropCue.css({top: dropCueOffsetTop(groupContainer), left: 0}).appendTo(groupContainer);
                        }
                    },
                    dragleave: function(e) {
                        e.draggable.hint.find(".k-drag-status").removeClass("k-add").addClass("k-denied");
                        dropCue.remove();
                    },
                    drop: function(e) {
                        var targetElement = e.draggable.currentTarget,
                            field = targetElement.attr(kendo.attr("field")),
                            title = targetElement.attr(kendo.attr("title")),
                            sourceIndicator = that.indicator(field),
                            dropCuePositions = that._dropCuePositions,
                            lastCuePosition = dropCuePositions[dropCuePositions.length - 1],
                            position;

                        if (!targetElement.hasClass("k-group-indicator") && !that._canDrag(targetElement)) {
                            return;
                        }
                        if(lastCuePosition) {
                            position = that._dropCuePosition(dropCue.offset().left + parseInt(lastCuePosition.element.css("marginLeft"), 10) + parseInt(lastCuePosition.element.css("marginRight"), 10));
                            if(position && that._canDrop($(sourceIndicator), position.element, position.left)) {
                                if(position.before) {
                                    position.element.before(sourceIndicator || that.buildIndicator(field, title));
                                } else {
                                    position.element.after(sourceIndicator || that.buildIndicator(field, title));
                                }

                                that._change();
                            }
                        } else {
                            that.groupContainer.append(that.buildIndicator(field, title));
                            that._change();
                        }
                    }
                })
                .kendoDraggable({
                    filter: "div.k-group-indicator",
                    hint: hint,
                    group: draggable.options.group,
                    dragcancel: proxy(that._dragCancel, that),
                    dragstart: function(e) {
                        var element = e.currentTarget,
                            marginLeft = parseInt(element.css("marginLeft"), 10),
                            left = element.position().left - marginLeft;

                        intializePositions();
                        dropCue.css({top: dropCueOffsetTop(groupContainer), left: left}).appendTo(groupContainer);
                        this.hint.find(".k-drag-status").removeClass("k-denied").addClass("k-add");
                    },
                    dragend: function() {
                        that._dragEnd(this);
                    },
                    drag: proxy(that._drag, that)
                })
                .delegate(".k-button", "click", function(e) {
                    e.preventDefault();
                    that._removeIndicator($(this).parent());
                })
                .delegate(".k-link", "click", function(e) {
                    var current = $(this).parent(),
                        newIndicator = that.buildIndicator(current.attr(kendo.attr("field")), current.attr(kendo.attr("title")), current.attr(kendo.attr("dir")) == "asc" ? "desc" : "asc");

                    current.before(newIndicator).remove();
                    that._change();
                    e.preventDefault();
                });

            draggable.bind([ "dragend", "dragcancel", "dragstart", "drag" ],
            {
                dragend: function() {
                    that._dragEnd(this);
                },
                dragcancel: proxy(that._dragCancel, that),
                dragstart: function(e) {
                    var element, marginRight, left;

                    if (!that.options.allowDrag && !that._canDrag(e.currentTarget)) {
                        e.preventDefault();
                        return;
                    }

                    intializePositions();
                    if(dropCuePositions.length) {
                        element = dropCuePositions[dropCuePositions.length - 1].element;
                        marginRight = parseInt(element.css("marginRight"), 10);
                        left = element.position().left + element.outerWidth() + marginRight;
                    } else {
                        left = 0;
                    }
                },
                drag: proxy(that._drag, that)
            });

            that.dataSource = that.options.dataSource;

            if(that.dataSource) {
                that._refreshHandler = proxy(that.refresh, that);
                that.dataSource.bind("change", that._refreshHandler);
            }
        },

        refresh: function() {
            var that = this,
                dataSource = that.dataSource;

            that.groupContainer.empty().append(
                $.map(dataSource.group() || [], function(item) {
                    var fieldName = item.field.replace(nameSpecialCharRegExp, "\\$1");
                    var element = that.element.find(that.options.filter).filter("[" + kendo.attr("field") + "=" + fieldName + "]");
                    return that.buildIndicator(item.field, element.attr(kendo.attr("title")), item.dir);
                }).join("")
            );
            that._invalidateGroupContainer();
        },

        destroy: function() {
            var that = this;
            if (that.dataSource && that._refreshHandler) {
                that.dataSource.unbind("change", that._refreshHandler);
            }
        },

        options: {
            name: "Groupable",
            filter: "th",
            messages: {
                empty: "Drag a column header and drop it here to group by that column"
            }
        },

        indicator: function(field) {
            var indicators = $(".k-group-indicator", this.groupContainer);
            return $.grep(indicators, function (item)
                {
                    return $(item).attr(kendo.attr("field")) === field;
                })[0];
        },
        buildIndicator: function(field, title, dir) {
            return indicatorTmpl({ field: field, dir: dir, title: title, ns: kendo.ns });
        },
        descriptors: function() {
            var that = this,
                indicators = $(".k-group-indicator", that.groupContainer),
                aggregates,
                names,
                field,
                idx,
                length;

            aggregates = that.element.find(that.options.filter).map(function() {
                var cell = $(this),
                    aggregate = cell.attr(kendo.attr("aggregates")),
                    member = cell.attr(kendo.attr("field"));

                if (aggregate && aggregate !== "") {
                    names = aggregate.split(",");
                    aggregate = [];
                    for (idx = 0, length = names.length; idx < length; idx++) {
                        aggregate.push({ field: member, aggregate: names[idx] });
                    }
                }
                return aggregate;
            }).toArray();

            return $.map(indicators, function(item) {
                item = $(item);
                field = item.attr(kendo.attr("field"));

                return {
                    field: field,
                    dir: item.attr(kendo.attr("dir")),
                    aggregates: aggregates || []
                };
            });
        },
        _removeIndicator: function(indicator) {
            var that = this;
            indicator.remove();
            that._invalidateGroupContainer();
            that._change();
        },
        _change: function() {
            var that = this;
            if(that.dataSource) {
                that.dataSource.group(that.descriptors());
            }
        },
        _dropCuePosition: function(position) {
            var dropCuePositions = this._dropCuePositions;
            if(!dropCue.is(":visible") || dropCuePositions.length === 0) {
                return;
            }

            position = Math.ceil(position);

            var lastCuePosition = dropCuePositions[dropCuePositions.length - 1],
                right = lastCuePosition.right,
                marginLeft = parseInt(lastCuePosition.element.css("marginLeft"), 10),
                marginRight = parseInt(lastCuePosition.element.css("marginRight"), 10);

            if(position >= right) {
                position = {
                    left: lastCuePosition.element.position().left + lastCuePosition.element.outerWidth() + marginRight,
                    element: lastCuePosition.element,
                    before: false
                };
            } else {
                position = $.grep(dropCuePositions, function(item) {
                    return item.left <= position && position <= item.right;
                })[0];

                if(position) {
                    position = {
                        left: position.element.position().left - marginLeft,
                        element: position.element,
                        before: true
                    };
                }
            }

            return position;
        },
        _drag: function(event) {
            var location = kendo.touchLocation(event),
                position = this._dropCuePosition(location.x);
            if(position) {
                dropCue.css({ left: position.left });
            }
        },
        _canDrag: function(element) {
            return element.attr(kendo.attr("groupable")) != "false" && (element.hasClass("k-group-indicator") || !this.indicator(element.attr(kendo.attr("field"))));
        },
        _canDrop: function(source, target, position) {
            var next = source.next();
            return source[0] !== target[0] && (!next[0] || target[0] !== next[0] || position > next.position().left);
        },
        _dragEnd: function(draggable) {
            var that = this,
                field = draggable.currentTarget.attr(kendo.attr("field")),
                sourceIndicator = that.indicator(field);

            if (draggable !== that.options.draggable && !draggable.dropped && sourceIndicator) {
                that._removeIndicator($(sourceIndicator));
            }

            that._dragCancel();
        },
        _dragCancel: function() {
            dropCue.remove();
            this._dropCuePositions = [];
        },
        _intializePositions: function() {
            var that = this,
                indicators = $(".k-group-indicator", that.groupContainer),
                left;
            that._dropCuePositions = $.map(indicators, function(item) {
                item = $(item);
                left = item.offset().left;
                return {
                    left: parseInt(left, 10),
                    right: parseInt(left + item.outerWidth(), 10),
                    element: item
                };
            });
        },
        _invalidateGroupContainer: function() {
            var groupContainer = this.groupContainer;
            if(groupContainer.is(":empty")) {
                groupContainer.html(this.options.messages.empty);
            }
        }
    });

    kendo.ui.plugin(Groupable);

})(jQuery);

//kendo.editable.js

(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        extend = $.extend,
        isFunction = $.isFunction,
        isPlainObject = $.isPlainObject,
        inArray = $.inArray,
        ERRORTEMPLATE = '<div class="k-widget k-tooltip k-tooltip-validation" style="margin:0.5em"><span class="k-icon k-warning"> </span>' +
                    '${message}<div class="k-callout k-callout-n"></div></div>',
        CHANGE = "change";

    var specialRules = ["url", "email", "number", "date", "boolean"];

    function fieldType(field) {
        field = field != null ? field : "";
        return field.type || $.type(field) || "string";
    }

    function convertToValueBinding(container) {
        container.find(":input:not(:button, [" + kendo.attr("role") + "=upload], [" + kendo.attr("skip") + "]), select").each(function() {
            var bindAttr = kendo.attr("bind"),
                binding = this.getAttribute(bindAttr) || "",
                bindingName = this.type === "checkbox" ? "checked:" : "value:",
                fieldName = this.name;

            if (binding.indexOf(bindingName) === -1 && fieldName) {
                binding += (binding.length ? "," : "") + bindingName + fieldName;

                $(this).attr(bindAttr, binding);
            }
        });
    }

    function createAttributes(options) {
        var field = (options.model.fields || options.model)[options.field],
            type = fieldType(field),
            validation = field ? field.validation : {},
            ruleName,
            DATATYPE = kendo.attr("type"),
            BINDING = kendo.attr("bind"),
            rule,
            attr = {
                name: options.field
            };

        for (ruleName in validation) {
            rule = validation[ruleName];

            if (inArray(ruleName, specialRules) >= 0) {
                attr[DATATYPE] = ruleName;
            } else if (!isFunction(rule)) {
                attr[ruleName] = isPlainObject(rule) ? rule.value || ruleName : rule;
            }

            attr[kendo.attr(ruleName + "-msg")] = rule.message;
        }

        if (inArray(type, specialRules) >= 0) {
            attr[DATATYPE] = type;
        }

        attr[BINDING] = (type === "boolean" ? "checked:" : "value:") + options.field;

        return attr;
    }

    function convertItems(items) {
        var idx,
            length,
            item,
            value,
            text,
            result;

        if (items && items.length) {
            result = [];
            for (idx = 0, length = items.length; idx < length; idx++) {
                item = items[idx];
                text = item.text || item.value || item;
                value = item.value == null ? (item.text || item) : item.value;

                result[idx] = { text: text, value: value };
            }
        }
        return result;
    }

    var editors = {
        "number": function(container, options) {
            var attr = createAttributes(options);
            $('<input type="text"/>').attr(attr).appendTo(container).kendoNumericTextBox({ format: options.format });
            $('<span ' + kendo.attr("for") + '="' + options.field + '" class="k-invalid-msg"/>').hide().appendTo(container);
        },
        "date": function(container, options) {
            var attr = createAttributes(options);
            attr[kendo.attr("format")] = options.format;

            $('<input type="text"/>').attr(attr).appendTo(container).kendoDatePicker({ format: options.format });
            $('<span ' + kendo.attr("for") + '="' + options.field + '" class="k-invalid-msg"/>').hide().appendTo(container);
        },
        "string": function(container, options) {
            var attr = createAttributes(options);

            $('<input type="text" class="k-input k-textbox"/>').attr(attr).appendTo(container);
        },
        "boolean": function(container, options) {
            var attr = createAttributes(options);
            $('<input type="checkbox" />').attr(attr).appendTo(container);
        },
        "values": function(container, options) {
            var attr = createAttributes(options);
            $('<select ' + kendo.attr("text-field") + '="text"' + kendo.attr("value-field") + '="value"' +
                kendo.attr("source") + "=\'" + kendo.stringify(convertItems(options.values)) +
                "\'" + kendo.attr("role") + '="dropdownlist"/>') .attr(attr).appendTo(container);
            $('<span ' + kendo.attr("for") + '="' + options.field + '" class="k-invalid-msg"/>').hide().appendTo(container);
        }
    };

    var Editable = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);
            that._validateProxy = $.proxy(that._validate, that);
            that.refresh();
        },

        events: [CHANGE],

        options: {
            name: "Editable",
            editors: editors,
            clearContainer: true,
            errorTemplate: ERRORTEMPLATE
        },

        editor: function(field, modelField) {
            var that = this,
                editors = that.options.editors,
                isObject = isPlainObject(field),
                fieldName = isObject ? field.field : field,
                model = that.options.model || {},
                isValuesEditor = isObject && field.values,
                type = isValuesEditor ? "values" : fieldType(modelField),
                isCustomEditor = isObject && field.editor,
                editor = isCustomEditor ? field.editor : editors[type],
                container = that.element.find("[data-container-for=" + fieldName + "]");

            editor = editor ? editor : editors["string"];

            if (isCustomEditor && typeof field.editor === "string") {
                editor = function(container) {
                    container.append(field.editor);
                };
            }

            container = container.length ? container : that.element;
            editor(container, extend(true, {}, isObject ? field : { field: fieldName }, { model: model }));
        },

        _validate: function(e) {
            var that = this,
                isBoolean = typeof e.value === "boolean",
                input,
                preventChangeTrigger = that._validationEventInProgress,
                values = {};

            values[e.field] = e.value;

            input = $(':input[' + kendo.attr("bind") + '="' + (isBoolean ? 'checked:' : 'value:') + e.field + '"]', that.element);

            try {
                that._validationEventInProgress = true;

                if (!that.validatable.validateInput(input) || (!preventChangeTrigger && that.trigger(CHANGE, { values: values }))) {
                    e.preventDefault();
                }

            } finally {
                that._validationEventInProgress = false;
            }
        },

        end: function() {
            return this.validatable.validate();
        },

        destroy: function() {
            this.options.model.unbind("set", this._validateProxy);
            kendo.unbind(this.element);

            this.element.removeData("kendoValidator")
                .removeData("kendoEditable");
        },

        refresh: function() {
            var that = this,
                idx,
                length,
                fields = that.options.fields || [],
                container = that.options.clearContainer ? that.element.empty() : that.element,
                model = that.options.model || {},
                rules = {};

            if (!$.isArray(fields)) {
                fields = [fields];
            }

            for (idx = 0, length = fields.length; idx < length; idx++) {
                var field = fields[idx],
                    isObject = isPlainObject(field),
                    fieldName = isObject ? field.field : field,
                    modelField = (model.fields || model)[fieldName],
                    validation = modelField ? (modelField.validation || {}) : {};

                for (var rule in validation) {
                    if (isFunction(validation[rule])) {
                        rules[rule] = validation[rule];
                    }
                }

                that.editor(field, modelField);
            }

            convertToValueBinding(container);

            kendo.bind(container, that.options.model);

            that.options.model.bind("set", that._validateProxy);

            that.validatable = container.kendoValidator({
                validateOnBlur: false,
                errorTemplate: that.options.errorTemplate || undefined,
                rules: rules }).data("kendoValidator");

            container.find(":input:visible:first").focus();
        }
   });

   ui.plugin(Editable);
})(jQuery);

//kendo.selectable.js

(function($, undefined) {
    var kendo = window.kendo,
        touch = kendo.support.touch,
        Widget = kendo.ui.Widget,
        proxy = $.proxy,
        MOUSEUP = touch? "touchend" : "mouseup",
        MOUSEDOWN = touch? "touchstart" : "mousedown",
        MOUSEMOVE = touch? "touchmove" : "mousemove",
        SELECTED = "k-state-selected",
        ACTIVE = "k-state-selecting",
        SELECTABLE = "k-selectable",
        SELECTSTART = "selectstart",
        DOCUMENT = $(document),
        CHANGE = "change",
        UNSELECTING = "k-state-unselecting";

    var Selectable = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that._marquee = $("<div class='k-marquee'></div>");
            that._lastActive = null;

            that._moveDelegate = proxy(that._move, that);
            that._upDelegate = proxy(that._up, that);

            that.element.addClass(SELECTABLE);
            that.element.delegate("." + SELECTABLE + " " + that.options.filter, MOUSEDOWN, proxy(that._down, that));
        },

        events: [CHANGE],

        options: {
            name: "Selectable",
            filter: ">*",
            multiple: false
        },
        _collide: function(element, marqueePos) {
            var pos = element.offset(),
                selectee = {
                    left: pos.left,
                    top: pos.top,
                    right: pos.left + element.outerWidth(),
                    bottom: pos.top + element.outerHeight()
                };

            return (!(selectee.left > marqueePos.right ||
                selectee.right < marqueePos.left ||
                selectee.top > marqueePos.bottom ||
                selectee.bottom < marqueePos.top));
        },
        _position: function(event) {
            var pos = this._originalPosition,
                left = pos.x,
                top = pos.y,
                right = event.pageX,
                bottom = event.pageY,
                tmp;

            if (left > right) {
                tmp = right;
                right = left;
                left = tmp;
            }

            if (top > bottom) {
                tmp = bottom;
                bottom = top;
                top = tmp;
            }

            return {
                top: top,
                right: right,
                left: left,
                bottom: bottom
            };
        },
        _down: function (event) {
            var that = this,
                selected,
                ctrlKey = event.ctrlKey,
                shiftKey = event.shiftKey,
                single = !that.options.multiple;

            that._downTarget = $(event.currentTarget);
            that._shiftPressed = shiftKey;

            if (that._downTarget.closest("." + SELECTABLE)[0] !== that.element[0]) {
                return;
            }

            DOCUMENT
                .unbind(MOUSEUP, that._upDelegate) // more cancel friendly
                .bind(MOUSEUP, that._upDelegate);

            that._originalPosition = {
                x: event.pageX,
                y: event.pageY
            };

            if(!single && $(event.target).is(":not(:input, a)")) {
                DOCUMENT
                    .unbind(MOUSEMOVE, that._moveDelegate)
                    .bind(MOUSEMOVE, that._moveDelegate)
                    .unbind(SELECTSTART, false)
                    .bind(SELECTSTART, false);

                if (!kendo.support.touch) {
                    event.preventDefault();
                }
            }

            if (!single) {
                $("body").append(that._marquee);
                that._marquee.css({
                    left: event.clientX + 1,
                    top: event.clientY + 1,
                    width: 0,
                    height: 0
                });
            }

            selected = that._downTarget.hasClass(SELECTED);
            if(single || !(ctrlKey || shiftKey)) {
                that.element
                .find(that.options.filter + "." + SELECTED)
                .not(that._downTarget)
                .removeClass(SELECTED);
            }
            if(ctrlKey) {
                that._lastActive = that._downTarget;
            }

            if(selected && (ctrlKey || shiftKey)) {
                that._downTarget.addClass(SELECTED);
                if(!shiftKey) {
                    that._downTarget.addClass(UNSELECTING);
                }
            }
            else {
                if (!(kendo.support.touch && single)) {
                    that._downTarget.addClass(ACTIVE);

                    if (single && that._downTarget.hasClass(SELECTED)) {
                        that._downTarget.removeClass(ACTIVE);
                    }
                }
            }
        },
        _move: function (event) {
            var that = this,
                pos = that._position(event),
                ctrlKey = event.ctrlKey,
                selectee, collide;

                that._marquee.css({
                    left: pos.left,
                    top: pos.top,
                    width: pos.right - pos.left,
                    height: pos.bottom - pos.top
                });

            that.element.find(that.options.filter).each(function () {
                selectee = $(this);
                collide = that._collide(selectee, pos);

                if (collide) {
                    if(selectee.hasClass(SELECTED)) {
                        if(that._downTarget[0] !== selectee[0] && ctrlKey) {
                            selectee
                                .removeClass(SELECTED)
                                .addClass(UNSELECTING);
                        }
                    } else if (!selectee.hasClass(ACTIVE) && !selectee.hasClass(UNSELECTING)) {
                        selectee.addClass(ACTIVE);
                    }
                }
                else {
                    if (selectee.hasClass(ACTIVE)) {
                        selectee.removeClass(ACTIVE);
                    }
                    else if(ctrlKey && selectee.hasClass(UNSELECTING)) {
                        selectee
                            .removeClass(UNSELECTING)
                            .addClass(SELECTED);
                    }
                }
            });
        },
        _up: function (event) {
            var that = this,
                options = that.options,
                single = !options.multiple;

            DOCUMENT
                .unbind(SELECTSTART, false)
                .unbind(MOUSEMOVE, that._moveDelegate)
                .unbind(MOUSEUP, that._upDelegate);

            if (!single) {
                that._marquee.remove();
            }

            if (kendo.support.touch && single) {
                that._downTarget.addClass(ACTIVE);
            }

            if(!single && that._shiftPressed === true) {
                that.selectRange(that._firstSelectee(), that._downTarget);
            }
            else {
                that.element
                    .find(options.filter + "." + UNSELECTING)
                    .removeClass(UNSELECTING)
                    .removeClass(SELECTED);

                that.value(that.element.find(options.filter + "." + ACTIVE));
            }
            if(!that._shiftPressed) {
                that._lastActive = that._downTarget;
            }
            that._downTarget = null;
            that._shiftPressed = false;
        },
        value: function(val) {
            var that = this,
                selectElement = proxy(that._selectElement, that);

            if(val) {
                val.each(function() {
                    selectElement(this);
                });

                that.trigger(CHANGE, {});
                return;
            }

            return that.element
                    .find(that.options.filter + "." + SELECTED);
        },
        _firstSelectee: function() {
            var that = this, selected;
            if(that._lastActive !== null) {
                return that._lastActive;
            }

            selected = that.value();
            return selected.length > 0 ?
                    selected[0] :
                    that.element.find(that.options.filter);
        },
        _selectElement: function(el) {
            var selecee = $(el),
                isPrevented = this.trigger("select", { element: el });

            selecee.removeClass(ACTIVE);
            if(!isPrevented) {
                selecee.addClass(SELECTED);
            }
        },
        clear: function() {
            var that = this;
            that.element
                .find(that.options.filter + "." + SELECTED)
                .removeClass(SELECTED);
        },
        selectRange: function(start, end) {
            var that = this,
                found = false,
                selectElement = proxy(that._selectElement, that),
                selectee;
            start = $(start)[0];
            end = $(end)[0];
            that.element.find(that.options.filter).each(function () {
                selectee = $(this);
                if(found) {
                    selectElement(this);
                    found = this !== end;
                }
                else if(this === start) {
                    found = start !== end;
                    selectElement(this);
                }
                else if(this === end) {
                    var tmp = start;
                    start = end;
                    end = tmp;
                    found = true;
                    selectElement(this);
                }
                else {
                    selectee.removeClass(SELECTED);
                }
            });
            that.trigger(CHANGE, {});
        }
    });

    kendo.ui.plugin(Selectable);

})(jQuery);

//kendo.resizable.js

(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        proxy = $.proxy,
        isFunction = $.isFunction,
        extend = $.extend,
        HORIZONTAL = "horizontal",
        VERTICAL = "vertical",
        START = "start",
        RESIZE = "resize",
        RESIZEEND = "resizeend";

    var Resizable = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that.orientation = that.options.orientation.toLowerCase() != VERTICAL ? HORIZONTAL : VERTICAL;
            that._positionMouse = that.orientation == HORIZONTAL ? "x" : "y";
            that._position = that.orientation == HORIZONTAL ? "left" : "top";
            that._sizingDom = that.orientation == HORIZONTAL ? "outerWidth" : "outerHeight";

            new ui.Draggable(element, {
                distance: 0,
                filter: options.handle,
                drag: proxy(that._resize, that),
                dragstart: proxy(that._start, that),
                dragend: proxy(that._stop, that)
            });
        },

        events: [
            RESIZE,
            RESIZEEND,
            START
        ],

        options: {
            name: "Resizable",
            orientation: HORIZONTAL
        },
        _max: function(e) {
            var that = this,
                hintSize = that.hint ? that.hint[that._sizingDom]() : 0,
                size = that.options.max;

            return isFunction(size) ? size(e) : size !== undefined ? (that._initialElementPosition + size) - hintSize : size;
        },
        _min: function(e) {
            var that = this,
                size = that.options.min;

            return isFunction(size) ? size(e) : size !== undefined ? that._initialElementPosition + size : size;
        },
        _start: function(e) {
            var that = this,
                hint = that.options.hint,
                el = $(e.currentTarget);

            that._initialMousePosition = e[that._positionMouse].location;
            that._initialElementPosition = el.position()[that._position];

            if (hint) {
                that.hint = isFunction(hint) ? $(hint(el)) : hint;

                that.hint.css({
                    position: "absolute"
                })
                .css(that._position, that._initialElementPosition)
                .appendTo(that.element);
            }

            that.trigger(START, e);

            that._maxPosition = that._max(e);
            that._minPosition = that._min(e);

            $(document.body).css("cursor", el.css("cursor"));
        },
        _resize: function(e) {
            var that = this,
                handle = $(e.currentTarget),
                maxPosition = that._maxPosition,
                minPosition = that._minPosition,
                currentPosition = that._initialElementPosition + (e[that._positionMouse].location - that._initialMousePosition),
                position;

            position = minPosition !== undefined ? Math.max(minPosition, currentPosition) : currentPosition;
            that.position = position =  maxPosition !== undefined ? Math.min(maxPosition, position) : position;

            if(that.hint) {
                that.hint.toggleClass(that.options.invalidClass || "", position == maxPosition || position == minPosition)
                         .css(that._position, position);
            }

            that.trigger(RESIZE, extend(e, { position: position }));
        },
        _stop: function(e) {
            var that = this;

            if(that.hint) {
                that.hint.remove();
            }

            that.trigger(RESIZEEND, extend(e, { position: that.position }));
            $(document.body).css("cursor", "");
        }
    });

    kendo.ui.plugin(Resizable);

})(jQuery);

//kendo.reorderable.js

(function($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        CHANGE =  "change",
        KREORDERABLE = "k-reorderable";

    function toggleHintClass(hint, denied) {
        hint = $(hint);

        if (denied) {
            hint.find(".k-drag-status").removeClass("k-add").addClass("k-denied");
        } else {
            hint.find(".k-drag-status").removeClass("k-denied").addClass("k-add");
        }
    }

    var Reorderable = Widget.extend({
        init: function(element, options) {
            var that = this,
                draggable,
                group = kendo.guid() + "-reorderable";

            Widget.fn.init.call(that, element, options);

            element = that.element.addClass(KREORDERABLE);
            options = that.options;
            draggable = options.draggable || new kendo.ui.Draggable(element, {
                group: group,
                filter: options.filter,
                hint: options.hint
            });

            that.reorderDropCue = $('<div class="k-reorder-cue"><div class="k-icon k-i-arrow-s"></div><div class="k-icon k-i-arrow-n"></div></div>');

            element.find(draggable.options.filter).kendoDropTarget({
                group: draggable.options.group,
                dragenter: function(e) {
                    if (!that._draggable) {
                        return;
                    }

                    var dropTarget = this.element,
                        same = dropTarget[0] === that._draggable[0];

                    toggleHintClass(e.draggable.hint, same);
                    if (!same) {
                        that.reorderDropCue.css({
                             height: dropTarget.outerHeight(),
                             top: element.offset().top,
                             left: dropTarget.offset().left + (dropTarget.index() > that._draggable.index() ? dropTarget.outerWidth() : 0)
                        })
                        .appendTo(document.body);
                    }
                },
                dragleave: function(e) {
                    toggleHintClass(e.draggable.hint, true);
                    that.reorderDropCue.remove();
                },
                drop: function() {
                    if (!that._draggable) {
                        return;
                    }

                    var draggableElement = that._draggable[0],
                        dropTarget = this.element[0],
                        container;

                    if (draggableElement !== dropTarget) {
                        container = element.find(draggable.options.filter);
                        that.trigger(CHANGE, {
                            element: that._draggable,
                            oldIndex: container.index(draggableElement),
                            newIndex: container.index(dropTarget)
                        });
                    }
                }
            });

            draggable.bind([ "dragcancel", "dragend", "dragstart" ],
                {
                    dragcancel: function() {
                        that.reorderDropCue.remove();
                        that._draggable = null;
                    },
                    dragend: function() {
                        that.reorderDropCue.remove();
                        that._draggable = null;
                    },
                    dragstart: function(e) {
                        that._draggable = e.currentTarget;
                    }
                }
            );
        },

        options: {
            name: "Reorderable",
            filter: "*"
        },

        events: [
            CHANGE
        ]

    });

    kendo.ui.plugin(Reorderable);

})(jQuery);

//kendo.grid.js

(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        DataSource = kendo.data.DataSource,
        Groupable = ui.Groupable,
        tbodySupportsInnerHtml = kendo.support.tbodyInnerHtml,
        Widget = ui.Widget,
        keys = kendo.keys,
        isPlainObject = $.isPlainObject,
        extend = $.extend,
        map = $.map,
        grep = $.grep,
        isArray = $.isArray,
        inArray = $.inArray,
        proxy = $.proxy,
        isFunction = $.isFunction,
        isEmptyObject = $.isEmptyObject,
        math = Math,
        REQUESTSTART = "requestStart",
        ERROR = "error",
        ROW_SELECTOR = "tbody>tr:not(.k-grouping-row,.k-detail-row,.k-group-footer):visible",
        DATA_CELL = ":not(.k-group-cell,.k-hierarchy-cell):visible",
        SELECTION_CELL_SELECTOR = "tbody>tr:not(.k-grouping-row,.k-detail-row,.k-group-footer) > td:not(.k-group-cell,.k-hierarchy-cell)",
        CELL_SELECTOR =  ROW_SELECTOR + ">td" + DATA_CELL,
        FIRST_CELL_SELECTOR = CELL_SELECTOR + ":first",
        EDIT = "edit",
        SAVE = "save",
        REMOVE = "remove",
        DETAILINIT = "detailInit",
        CHANGE = "change",
        COLUMNHIDE = "columnHide",
        COLUMNSHOW = "columnShow",
        SAVECHANGES = "saveChanges",
        DATABOUND = "dataBound",
        DETAILEXPAND = "detailExpand",
        DETAILCOLLAPSE = "detailCollapse",
        FOCUSED = "k-state-focused",
        FOCUSABLE = "k-focusable",
        SELECTED = "k-state-selected",
        COLUMNRESIZE = "columnResize",
        COLUMNREORDER = "columnReorder",
        CLICK = "click",
        HEIGHT = "height",
        TABINDEX = "tabIndex",
        FUNCTION = "function",
        STRING = "string",
        DELETECONFIRM = "Are you sure you want to delete this record?",
        formatRegExp = /(\}|\#)/ig,
        indicatorWidth = 3,
        templateHashRegExp = /#/ig,
        COMMANDBUTTONTMPL = '<a class="k-button k-button-icontext #=className#" #=attr# href="\\#"><span class="#=iconClass# #=imageClass#"></span>#=text#</a>';

    var VirtualScrollable =  Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);
            that._refreshHandler = proxy(that.refresh, that);
            that.setDataSource(options.dataSource);
            that.wrap();
        },

        setDataSource: function(dataSource) {
            var that = this;
            if (that.dataSource) {
                that.dataSource.unbind(CHANGE, that._refreshHandler);
            }
            that.dataSource = dataSource;
            that.dataSource.bind(CHANGE, that._refreshHandler);
        },

        options: {
            name: "VirtualScrollable",
            itemHeight: $.noop
        },

        wrap: function() {
            var that = this,
                // workaround for IE issue where scroll is not raised if container is same width as the scrollbar
                scrollbar = kendo.support.scrollbar() + 1,
                element = that.element;

            element.css( {
                width: "auto",
                paddingRight: scrollbar,
                overflow: "hidden"
            });
            that.content = element.children().first();
            that.wrapper = that.content.wrap('<div class="k-virtual-scrollable-wrap"/>')
                                .parent()
                                .bind("DOMMouseScroll", proxy(that._wheelScroll, that))
                                .bind("mousewheel", proxy(that._wheelScroll, that));

            if (kendo.support.touch) {
                that.drag = new kendo.Drag(that.wrapper, {
                    global: true,
                    move: function(e) {
                        that.verticalScrollbar.scrollTop(that.verticalScrollbar.scrollTop() - e.y.delta);
                        e.preventDefault();
                    }
                });
            }

            that.verticalScrollbar = $('<div class="k-scrollbar k-scrollbar-vertical" />')
                                        .css({
                                            width: scrollbar
                                        }).appendTo(element)
                                        .bind("scroll", proxy(that._scroll, that));
        },

        _wheelScroll: function(e) {
            var that = this,
                scrollTop = that.verticalScrollbar.scrollTop(),
                originalEvent = e.originalEvent,
                delta;

            e.preventDefault();

            if (originalEvent.wheelDelta) {
                delta = originalEvent.wheelDelta;
            } else if (originalEvent.detail) {
                delta = (-originalEvent.detail) * 10;
            } else if ($.browser.opera) {
                delta = -originalEvent.wheelDelta;
            }
            that.verticalScrollbar.scrollTop(scrollTop + (-delta));
        },

        _scroll: function(e) {
            var that = this,
                scrollTop = e.currentTarget.scrollTop,
                dataSource = that.dataSource,
                rowHeight = that.itemHeight,
                skip = dataSource.skip() || 0,
                start = that._rangeStart || skip,
                height = that.element.innerHeight(),
                isScrollingUp = !!(that._scrollbarTop && that._scrollbarTop > scrollTop),
                firstItemIndex = math.max(math.floor(scrollTop / rowHeight), 0),
                lastItemIndex = math.max(firstItemIndex + math.floor(height / rowHeight), 0);

            that._scrollTop = scrollTop - (start * rowHeight);
            that._scrollbarTop = scrollTop;

            if (!that._fetch(firstItemIndex, lastItemIndex, isScrollingUp)) {
                that.wrapper[0].scrollTop = that._scrollTop;
            }
        },

        _fetch: function(firstItemIndex, lastItemIndex, scrollingUp) {
            var that = this,
                dataSource = that.dataSource,
                itemHeight = that.itemHeight,
                take = dataSource.take(),
                rangeStart = that._rangeStart || dataSource.skip() || 0,
                currentSkip = math.floor(firstItemIndex / take) * take,
                fetching = false,
                prefetchAt = 0.33;

            if (firstItemIndex < rangeStart) {

                fetching = true;
                rangeStart = math.max(0, lastItemIndex - take);
                that._scrollTop = (firstItemIndex - rangeStart) * itemHeight;
                that._page(rangeStart, take);

            } else if (lastItemIndex >= rangeStart + take && !scrollingUp) {

                fetching = true;
                rangeStart = firstItemIndex;
                that._scrollTop = itemHeight;
                that._page(rangeStart, take);

            } else if (!that._fetching) {

                if (firstItemIndex < (currentSkip + take) - take * prefetchAt && firstItemIndex > take) {
                    dataSource.prefetch(currentSkip - take, take);
                }
                if (lastItemIndex > currentSkip + take * prefetchAt) {
                    dataSource.prefetch(currentSkip + take, take);
                }

            }
            return fetching;
        },

        _page: function(skip, take) {
            var that = this,
                dataSource = that.dataSource;

            clearTimeout(that._timeout);
            that._fetching = true;
            that._rangeStart = skip;

            if (dataSource.inRange(skip, take)) {
                dataSource.range(skip, take);
            } else {
                kendo.ui.progress(that.wrapper.parent(), true);
                that._timeout = setTimeout(function() {
                    dataSource.range(skip, take);
                }, 100);
            }
        },

        refresh: function() {
            var that = this,
                html = "",
                maxHeight = 250000,
                dataSource = that.dataSource,
                rangeStart = that._rangeStart,
                scrollbar = kendo.support.scrollbar(),
                wrapperElement = that.wrapper[0],
                totalHeight,
                idx,
                itemHeight;

            kendo.ui.progress(that.wrapper.parent(), false);
            clearTimeout(that._timeout);

            itemHeight = that.itemHeight = that.options.itemHeight() || 0;

            var addScrollBarHeight = (wrapperElement.scrollWidth > wrapperElement.offsetWidth) ? scrollbar : 0;

            totalHeight = dataSource.total() * itemHeight + addScrollBarHeight;

            for (idx = 0; idx < math.floor(totalHeight / maxHeight); idx++) {
                html += '<div style="width:1px;height:' + maxHeight + 'px"></div>';
            }

            if (totalHeight % maxHeight) {
                html += '<div style="width:1px;height:' + (totalHeight % maxHeight) + 'px"></div>';
            }

            that.verticalScrollbar.html(html);
            wrapperElement.scrollTop = that._scrollTop;

            if (that.drag) {
                that.drag.cancel();
            }

            if (rangeStart && !that._fetching) { // we are rebound from outside local range should be reset
                that._rangeStart = dataSource.skip();
            }
            that._fetching = false;
        }
    });

    function groupCells(count) {
        return new Array(count + 1).join('<td class="k-group-cell">&nbsp;</td>');
    }

    function stringifyAttributes(attributes) {
        var attr,
            result = " ";

        if (attributes) {
            if (typeof attributes === STRING) {
                return attributes;
            }

            for (attr in attributes) {
                result += attr + '="' + attributes[attr] + '"';
            }
        }
        return result;
    }

    var defaultCommands = {
        create: {
            text: "Add new record",
            imageClass: "k-add",
            className: "k-grid-add",
            iconClass: "k-icon"
        },
        cancel: {
            text: "Cancel changes",
            imageClass: "k-cancel",
            className: "k-grid-cancel-changes",
            iconClass: "k-icon"
        },
        save: {
            text: "Save changes",
            imageClass: "k-update",
            className: "k-grid-save-changes",
            iconClass: "k-icon"
        },
        destroy: {
            text: "Delete",
            imageClass: "k-delete",
            className: "k-grid-delete",
            iconClass: "k-icon"
        },
        edit: {
            text: "Edit",
            imageClass: "k-edit",
            className: "k-grid-edit",
            iconClass: "k-icon"
        },
        update: {
            text: "Update",
            imageClass: "k-update",
            className: "k-grid-update",
            iconClass: "k-icon"
        },
        canceledit: {
            text: "Cancel",
            imageClass: "k-cancel",
            className: "k-grid-cancel",
            iconClass: "k-icon"
        }
    };

    function heightAboveHeader(context) {
        var top = 0;
        $('> .k-grouping-header, > .k-grid-toolbar', context).each(function () {
            top += this.offsetHeight;
        });
        return top;
    }

    function cursor(context, value) {
        $('th, th .k-grid-filter, th .k-link', context)
            .add(document.body)
            .css('cursor', value);
    }

    function buildEmptyAggregatesObject(aggregates) {
            var idx,
                length,
                aggregate = {},
                fieldsMap = {};

            if (!isEmptyObject(aggregates)) {
                if (!isArray(aggregates)){
                    aggregates = [aggregates];
                }

                for (idx = 0, length = aggregates.length; idx < length; idx++) {
                    aggregate[aggregates[idx].aggregate] = 0;
                    fieldsMap[aggregates[idx].field] = aggregate;
                }
            }

            return fieldsMap;
    }

    function reorder(selector, sourceIndex, destIndex) {
        var source = selector.eq(sourceIndex),
            dest = selector.eq(destIndex);

        source[sourceIndex > destIndex ? "insertBefore" : "insertAfter"](dest);
    }

    function attachCustomCommandEvent(context, container, commands) {
        var idx,
            length,
            command,
            commandName;

        commands = !isArray(commands) ? [commands] : commands;

        for (idx = 0, length = commands.length; idx < length; idx++) {
            command = commands[idx];

            if (isPlainObject(command) && command.click) {
                commandName = command.name || command.text;
                container.on(CLICK, "a.k-grid-" + commandName, { commandName: commandName }, proxy(command.click, context));
            }
        }
    }

    function visibleColumns(columns) {
        return grep(columns, function(column) {
            return !column.hidden;
        });
    }

    function addHiddenStyle(attr) {
        attr = attr || {};
        var style = attr.style;

        if(!style) {
            style = "display:none";
        } else {
            style = style.replace(/((.*)?display)(.*)?:([^;]*)/i, "$1:none");
            if(style === attr.style) {
                style = style.replace(/(.*)?/i, "display:none;$1");
            }
        }

        return extend({}, attr, { style: style });
    }

    function removeHiddenStyle(attr) {
        attr = attr || {};
        var style = attr.style;

        if(style) {
            attr.style = style.replace(/((.*)?)(display\s*:\s*none)\s*;?/i, "$1");
        }

        return attr;
    }

    function normalizeCols(table, visibleColumns, hasDetails, groups) {
        var colgroup = table.find(">colgroup"),
            width,
            cols = map(visibleColumns, function(column) {
                    width = column.width;
                    if (width && parseInt(width, 10) !== 0) {
                        return kendo.format('<col style="width:{0}"/>', typeof width === STRING? width : width + "px");
                    }

                    return "<col />";
                });

        if (hasDetails || colgroup.find(".k-hierarchy-col").length) {
            cols.splice(0, 0, '<col class="k-hierarchy-col" />');
        }

        if (colgroup.length) {
            colgroup.remove();
        }

        colgroup = $("<colgroup/>").append($(new Array(groups + 1).join('<col class="k-group-col">') + cols.join("")));

        table.prepend(colgroup);
    }

    var Grid = Widget.extend({
        init: function(element, options) {
            var that = this;

            options = isArray(options) ? { dataSource: options } : options;

            Widget.fn.init.call(that, element, options);

            that._element();

            that._columns(that.options.columns);

            that._dataSource();

            that._tbody();

            that._pageable();

            that._thead();

            that._groupable();

            that._toolbar();

            that._setContentHeight();

            that._templates();

            that._navigatable();

            that._selectable();

            that._details();

            that._editable();

            that._attachCustomCommandsEvent();

            if (that.options.autoBind) {
                that.dataSource.fetch();
            }

            kendo.notify(that);
        },

        events: [
           CHANGE,
           "dataBinding",
           DATABOUND,
           DETAILEXPAND,
           DETAILCOLLAPSE,
           DETAILINIT,
           EDIT,
           SAVE,
           REMOVE,
           SAVECHANGES,
           COLUMNRESIZE,
           COLUMNREORDER,
           COLUMNSHOW,
           COLUMNHIDE
        ],

        setDataSource: function(dataSource) {
            var that = this;

            that.options.dataSource = dataSource;

            that._dataSource();

            that._pageable();

            if (that.options.groupable) {
                that._groupable();
            }

            that._thead();

            if (that.virtualScrollable) {
                that.virtualScrollable.setDataSource(that.options.dataSource);
            }

            if (that.options.autoBind) {
                dataSource.fetch();
            }
        },

        options: {
            name: "Grid",
            columns: [],
            toolbar: null,
            autoBind: true,
            filterable: true,
            scrollable: true,
            sortable: false,
            selectable: false,
            navigatable: false,
            pageable: false,
            editable: false,
            groupable: false,
            rowTemplate: "",
            altRowTemplate: "",
            dataSource: {},
            height: null,
            resizable: false,
            reorderable: false,
            columnMenu: false,
            whereCondition: ""
        },

        setOptions: function(options) {
            var that = this;

            Widget.fn.setOptions.call(this, options);

            that._templates();
        },

        items: function() {
            return this.tbody.children(':not(.k-grouping-row,.k-detail-row,.k-group-footer)');
        },

        _attachCustomCommandsEvent: function() {
            var that = this,
                columns = that.columns || [],
                command,
                idx,
                length;

            for (idx = 0, length = columns.length; idx < length; idx++) {
                command = columns[idx].command;

                if (command) {
                    attachCustomCommandEvent(that, that.wrapper, command);
                }
            }
        },

        _element: function() {
            var that = this,
                table = that.element;

            if (!table.is("table")) {
                if (that.options.scrollable) {
                    table = that.element.find("> .k-grid-content > table");
                } else {
                    table = that.element.children("table");
                }

                if (!table.length) {
                    table = $("<table />").appendTo(that.element);
                }
            }

            that.table = table.attr("cellspacing", 0);

            that._wrapper();
        },

        _positionColumnResizeHandle: function(container) {
            var that = this,
                scrollable = that.options.scrollable,
                resizeHandle = that.resizeHandle,
                left;

            that.thead.on("mousemove", "th:not(.k-group-cell,.k-hierarchy-cell)", function(e) {
                 var th = $(this),
                    position = th.offset().left + this.offsetWidth;

                if(e.clientX > position - indicatorWidth &&  e.clientX < position + indicatorWidth) {
                    cursor(that.wrapper, th.css('cursor'));

                    if (!resizeHandle) {
                        resizeHandle = that.resizeHandle = $('<div class="k-resize-handle"/>');
                        container.append(resizeHandle);
                    }

                    left = this.offsetWidth;

                    th.prevAll().each(function() {
                        left += this.offsetWidth;
                    });

                    resizeHandle.css({
                        top: scrollable ? 0 : heightAboveHeader(that.wrapper),
                        left: left - indicatorWidth,
                        height: th.outerHeight(),
                        width: indicatorWidth * 3
                    })
                    .data("th", th)
                    .show();

                } else {
                    cursor(that.wrapper, "");

                    if (resizeHandle) {
                       resizeHandle.hide();
                    }
                }
            });
        },

        _resizable: function() {
            var that = this,
                options = that.options,
                container,
                columnStart,
                columnWidth,
                gridWidth,
                col;

            if (options.resizable) {
                container = options.scrollable ? that.wrapper.find(".k-grid-header-wrap") : that.wrapper;

                that._positionColumnResizeHandle(container);

                container.kendoResizable({
                    handle: ".k-resize-handle",
                    hint: function(handle) {
                        return $('<div class="k-grid-resize-indicator" />').css({
                            height: handle.data("th").outerHeight() + that.tbody.attr("clientHeight")
                        });
                    },
                    start: function(e) {
                        var th = $(e.currentTarget).data("th"),
                            index = $.inArray(th[0], th.parent().children(":visible")),
                            contentTable = that.tbody.parent(),
                            footer = that.footer || $();

                        cursor(that.wrapper, th.css('cursor'));

                        if (options.scrollable) {
                            col = that.thead.parent().find("col:eq(" + index + ")")
                                .add(contentTable.children("colgroup").find("col:eq(" + index + ")"))
                                .add(footer.find("colgroup").find("col:eq(" + index + ")"));
                        } else {
                            col = contentTable.children("colgroup").find("col:eq(" + index + ")");
                        }

                        columnStart = e.x.location;
                        columnWidth = th.outerWidth();
                        gridWidth = that.tbody.outerWidth();
                    },
                    resize: function(e) {
                        var width = columnWidth + e.x.location - columnStart,
                            footer = that.footer || $();

                        if (width > 10) {
                            col.css('width', width);

                            if (options.scrollable) {
                                that._footerWidth = gridWidth + e.x.location - columnStart;
                                that.tbody.parent()
                                    .add(that.thead.parent())
                                    .add(footer.find("table"))
                                    .css('width', that._footerWidth);
                            }
                        }
                    },
                    resizeend: function(e) {
                        var th = $(e.currentTarget).data("th"),
                            newWidth = th.outerWidth(),
                            column;

                        cursor(that.wrapper, "");

                        if (columnWidth != newWidth) {
                            column = that.columns[th.parent().find("th:not(.k-group-cell,.k-hierarchy-cell)").index(th)];

                            column.width = newWidth;

                            that.trigger(COLUMNRESIZE, {
                                column: column,
                                oldWidth: columnWidth,
                                newWidth: newWidth
                            });
                        }
                        that.resizeHandle.hide();
                    }
                });
            }
        },

        _draggable: function() {
            var that = this;
            if (that.options.reorderable) {
                that._draggableInstance = that.thead.kendoDraggable({
                    group: kendo.guid(),
                    filter: ".k-header:not(.k-group-cell,.k-hierarchy-cell):visible[" + kendo.attr("field") + "]",
                    hint: function(target) {
                        return $('<div class="k-header k-drag-clue" />')
                            .css({
                                width: target.width(),
                                paddingLeft: target.css("paddingLeft"),
                                paddingRight: target.css("paddingRight"),
                                lineHeight: target.height() + "px",
                                paddingTop: target.css("paddingTop"),
                                paddingBottom: target.css("paddingBottom")
                            })
                            .html(target.attr(kendo.attr("title")) || target.attr(kendo.attr("field")))
                            .prepend('<span class="k-icon k-drag-status k-denied" />');
                    }
                }).data("kendoDraggable");
            }
        },

        _reorderable: function() {
            var that = this;
            if (that.options.reorderable) {
                that.thead.kendoReorderable({
                    draggable: that._draggableInstance,
                    change: function(e) {
                        var column = visibleColumns(that.columns)[e.oldIndex];
                        that.trigger(COLUMNREORDER, {
                            newIndex: e.newIndex,
                            oldIndex: e.oldIndex,
                            column: column
                        });
                        that.reorderColumn(e.newIndex, column);
                    }
                });
            }
        },

        reorderColumn: function(destIndex, column) {
            var that = this,
                sourceIndex = $.inArray(column, that.columns),
                colSourceIndex = $.inArray(column, visibleColumns(that.columns)),
                rows,
                idx,
                length,
                footer = that.footer || that.wrapper.find(".k-grid-footer");

            if (sourceIndex === destIndex) {
                return;
            }

            that.columns.splice(sourceIndex, 1);
            that.columns.splice(destIndex, 0, column);
            that._templates();

            reorder(that.thead.prev().find("col:not(.k-group-col,.k-hierarchy-col)"), colSourceIndex, destIndex);
            if (that.options.scrollable) {
                reorder(that.tbody.prev().find("col:not(.k-group-col,.k-hierarchy-col)"), colSourceIndex, destIndex);
            }

            reorder(that.thead.find(".k-header:not(.k-group-cell,.k-hierarchy-cell)"), sourceIndex, destIndex);

            if (footer && footer.length) {
                reorder(footer.find(".k-grid-footer-wrap>table>colgroup>col:not(.k-group-col,.k-hierarchy-col)"), colSourceIndex, destIndex);
                reorder(footer.find(".k-footer-template>td:not(.k-group-cell,.k-hierarchy-cell)"), sourceIndex, destIndex);
            }

            rows = that.tbody.children(":not(.k-grouping-row,.k-detail-row)");
            for (idx = 0, length = rows.length; idx < length; idx += 1) {
                reorder(rows.eq(idx).find(">td:not(.k-group-cell,.k-hierarchy-cell)"), sourceIndex, destIndex);
            }
        },

        cellIndex: function(td) {
            return $(td).parent().find('td:not(.k-group-cell,.k-hierarchy-cell)').index(td);
        },

        _modelForContainer: function(container) {
            container = $(container);

            if (!container.is("tr") && this._editMode() !== "popup" || container.attr("cellEditable")=="true") {
                container = container.closest("tr");
            }

            var id = container.attr(kendo.attr("uid"));

            return this.dataSource.getByUid(id);
        },

        _editable: function() {
            var that = this,
                editable = that.options.editable,
                handler = function () {
                    var target = document.activeElement,
                        cell = that._editContainer;

                    if (cell && !$.contains(cell[0], target) && cell[0] !== target && !$(target).closest(".k-animation-container").length) {
                        if (that.editable.end()) {
                            that.closeCell();
                        }
                    }
                };

            if (editable) {
                var mode = that._editMode();

                if (mode === "incell") {
                    if (editable.update !== false) {
                        that.wrapper.delegate("tr:not(.k-grouping-row) > td:not(.k-hierarchy-cell,.k-detail-cell,.k-group-cell,:has(a.k-grid-delete))", CLICK, function(e) {
                            var td = $(this);
                            if(td.attr("editMode")!=undefined){
                                if (td.closest("tbody")[0] !== that.tbody[0] || $(e.target).is(":input")) {
                                    return;
                                }

                                if (that.editable) {
                                    if (that.editable.end()) {
                                        that.closeCell();
                                        that.editCell(td);
                                    }
                                } else {
                                    that.editCell(td);
                                }
                            }
                        });

                        that.wrapper.bind("focusin", function(e) {
                            clearTimeout(that.timer);
                            that.timer = null;
                        });
                        that.wrapper.bind("focusout", function(e) {
                            that.timer = setTimeout(handler, 1);
                        });
                    }
                } else {
                    if (editable.update !== false) {
                        that.wrapper.delegate("tbody>tr:not(.k-detail-row,.k-grouping-row):visible a.k-grid-edit", CLICK, function(e) {
                            e.preventDefault();
                            that.editRow($(this).closest("tr"));
                        });
                    }
                }

                if (editable.destroy !== false) {
                    that.wrapper.delegate("tbody>tr:not(.k-detail-row,.k-grouping-row):visible a.k-grid-delete", CLICK, function(e) {
                        e.preventDefault();
                        that.removeRow($(this).closest("tr"));
                    });
               }
            }
        },

        editCell: function(cell) {
            var that = this,
                column = that.columns[that.cellIndex(cell)],
                model = that._modelForContainer(cell);


            if (model && (!model.editable || model.editable(column.field)) && !column.command && column.field && column.celleditable) {

                that._attachModelChange(model);

                that._editContainer = cell;

                that.editable = cell.addClass("k-edit-cell")
                    .kendoEditable({
                        fields: { field: column.field, format: column.format, editor: column.editor, values: column.values },
                        model: model,
                        change: function(e) {
                            if (that.trigger(SAVE, { values: e.values, container: cell, model: model } )) {
                                e.preventDefault();
                            }
                        }
                    }).data("kendoEditable");
                if(column.defaulteditable!=true)
                cell.parent().addClass("k-grid-edit-row");
                else
                
                cell.parent().removeClass("k-grid-edit-row");

                that.trigger(EDIT, { container: cell, model: model });
            }
        },

        _destroyEditable: function() {
            var that = this;

            if (that.editable) {
                that._detachModelChange();

                that.editable.destroy();
                delete that.editable;

                if (that._editMode() === "popup") {
                    if(that._editContainer.data("kendoWindow")!=undefined && that._editContainer.data("kendoWindow")!=null)
                        that._editContainer.data("kendoWindow").close();
                }

                that._editContainer = null;
            }
        },

        _attachModelChange: function(model) {
            var that = this;

            that._modelChangeHandler = function(e) {
                that._modelChange({ field: e.field, model: this });
            };

            model.bind("change", that._modelChangeHandler);
        },

        _detachModelChange: function() {
            var that = this,
                container = that._editContainer,
                model = that._modelForContainer(container);

            if (model) {
                model.unbind(CHANGE, that._modelChangeHandler);
            }
        },

        closeCell: function() {
            var that = this,
                cell = that._editContainer.removeClass("k-edit-cell"),
                id = cell.closest("tr").attr(kendo.attr("uid")),
                column = that.columns[that.cellIndex(cell)],
                model = that.dataSource.getByUid(id);

            if(column.defaulteditable!=true){
                cell.parent().removeClass("k-grid-edit-row");
                that._destroyEditable(); // editable should be destoryed before content of the container is changed

                that._displayCell(cell, column, model);

                if (cell.hasClass("k-dirty-cell")) {
                    $('<span class="k-dirty"/>').prependTo(cell);
                }
            }
            else{
                cell.parent().removeClass("k-grid-edit-row");
                cell.addClass("k-edit-cell");
            }
        },

        _displayCell: function(cell, column, dataItem) {
            var that = this,
                state = { storage: {}, count: 0 },
                settings = extend({}, kendo.Template, that.options.templateSettings),
                tmpl = kendo.template(that._cellTmpl(column, state), settings);

            if (state.count > 0) {
                tmpl = proxy(tmpl, state.storage);
            }

            cell.empty().html(tmpl(dataItem));
        },

        removeRow: function(row) {
            var that = this,
                model,
                mode;

            if (!that._confirmation()) {
                return;
            }

            row = $(row).hide();
            model = that._modelForContainer(row);

            if (model && !that.trigger(REMOVE, { row: row, model: model })) {
                that.dataSource.remove(model);

                mode = that._editMode();

                if (mode === "inline" || mode === "popup") {
                    that.dataSource.sync();
                }
            }
        },

        _editMode: function() {
            var mode = "incell",
                editable = this.options.editable;

            if (editable !== true) {
                if (typeof editable == "string") {
                    mode = editable;
                } else {
                    mode = editable.mode || mode;
                }
            }

            return mode;
        },

        editRow: function(row) {
            var that = this,
                model = that._modelForContainer(row),
                mode = that._editMode(),
                container;

            that.cancelRow();

            if (model) {

                that._attachModelChange(model);

                if (mode === "popup") {
                    that._createPopupEditor(model);
                } else if (mode === "inline") {
                    that._createInlineEditor(row, model);
                } else if (mode === "incell") {
                    $(row).children(DATA_CELL).each(function() {
                        var cell = $(this);
                        var column = that.columns[cell.index()];

                        model = that._modelForContainer(cell);

                        if (model && (!model.editable || model.editable(column.field)) && column.field) {
                            that.editCell(cell);
                            return false;
                        }
                    });
                }

                container = that._editContainer;

                container.delegate("a.k-grid-cancel", CLICK, function(e) {
                    e.preventDefault();
                    that.cancelRow();
                });

                container.delegate("a.k-grid-update", CLICK, function(e) {
                    e.preventDefault();
                    that.saveRow();
                });
            }
        },

        _createPopupEditor: function(model) {
            var that = this,
                html = '<div ' + kendo.attr("uid") + '="' + model.uid + '"><div class="k-edit-form-container">',
                column,
                command,
                fields = [],
                idx,
                length,
                tmpl,
                updateText,
                cancelText,
                attr,
                editable = that.options.editable,
                options = isPlainObject(editable) ? editable.window : {},
                settings = extend({}, kendo.Template, that.options.templateSettings);

            if (editable.template) {
                html += (kendo.template(window.unescape(editable.template), settings))(model);

                for (idx = 0, length = that.columns.length; idx < length; idx++) {
                    column = that.columns[idx];
                    if (column.command) {
                        command = getCommand(column.command, "edit");
                    }
                }
            } else {
                for (idx = 0, length = that.columns.length; idx < length; idx++) {
                    column = that.columns[idx];

                    if (!column.command) {
                        html += '<div class="k-edit-label"><label for="' + column.field + '">' + (column.title || column.field || "") + '</label></div>';

                        if ((!model.editable || model.editable(column.field)) && column.field) {
                            fields.push({ field: column.field, format: column.format, editor: column.editor, values: column.values });
                            html += '<div ' + kendo.attr("container-for") + '="' + column.field + '" class="k-edit-field"></div>';
                        } else {
                            var state = { storage: {}, count: 0 };

                            tmpl = kendo.template(that._cellTmpl(column, state), settings);

                            if (state.count > 0) {
                                tmpl = proxy(tmpl, state.storage);
                            }

                            html += '<div class="k-edit-field">' + tmpl(model) + '</div>';
                        }
                    } else if (column.command) {
                        command = getCommand(column.command, "edit");
                    }
                }
            }

            if (command) {
                if (isPlainObject(command)) {
                   if (command.text && isPlainObject(command.text)) {
                       updateText = command.text.update;
                       cancelText = command.text.cancel;
                   }

                   if (command.attr) {
                       attr = command.attr;
                   }
                }
            }

            html += that._createButton({ name: "update", text: updateText, attr: attr }) + that._createButton({ name: "canceledit", text: cancelText, attr: attr });
            html += '</div></div>';

            var container = that._editContainer = $(html)
                .appendTo(that.wrapper).eq(0)
                .kendoWindow(extend({
                    modal: true,
                    resizable: false,
                    draggable: true,
                    title: "Edit",
                    visible: false
                }, options));

            var wnd = container.data("kendoWindow");

            wnd.wrapper.delegate(".k-i-close", "click", function() {
                    that.cancelRow();
                });

            that.editable = that._editContainer
                .kendoEditable({
                    fields: fields,
                    model: model,
                    clearContainer: false
                }).data("kendoEditable");

            wnd.center().open();

            that.trigger(EDIT, { container: container, model: model });
        },

        _createInlineEditor: function(row, model) {
            var that = this,
                column,
                cell,
                command,
                fields = [];

            row.children(":not(.k-group-cell,.k-hierarchy-cell)").each(function() {
                cell = $(this);
                column = that.columns[that.cellIndex(cell)];

                if (!column.command && column.field && (!model.editable || model.editable(column.field))) {
                    fields.push({ field: column.field, format: column.format, editor: column.editor, values: column.values });
                    cell.attr("data-container-for", column.field);
                    cell.empty();
                } else if (column.command) {
                    command = getCommand(column.command, "edit");
                    if (command) {
                        cell.empty();

                        var updateText,
                            cancelText,
                            attr;

                        if (isPlainObject(command)) {
                            if (command.text && isPlainObject(command.text)) {
                                updateText = command.text.update;
                                cancelText = command.text.cancel;
                            }

                            if (command.attr) {
                                attr = command.attr;
                            }
                        }

                        $(that._createButton({ name: "update", text: updateText, attr: attr }) +
                            that._createButton({ name: "canceledit", text: cancelText, attr: attr})).appendTo(cell);
                    }
                }
            });

            that._editContainer = row;

            that.editable = row
                .addClass("k-grid-edit-row")
                .kendoEditable({
                    fields: fields,
                    model: model,
                    clearContainer: false
                }).data("kendoEditable");

            that.trigger(EDIT, { container: row, model: model });
        },

        cancelRow: function() {
            var that = this,
                container = that._editContainer,
                model;

            if (container) {
                model = that._modelForContainer(container);

                that.dataSource.cancelChanges(model);

                if (that._editMode() !== "popup") {
                    that._displayRow(container);
                } else {
                    that._displayRow(that.items().filter("[" + kendo.attr("uid") + "=" + model.uid + "]"));
                }

                that._destroyEditable();
            }
        },

        saveRow: function() {
            var that = this,
                container = that._editContainer,
                model = that._modelForContainer(container),
                editable = that.editable;

            if (container && editable && editable.end() &&
                !that.trigger(SAVE, { container: container, model: model } )) {

                if (that._editMode() !== "popup") {
                    that._displayRow(container);
                }

                that._destroyEditable();
                that.dataSource.sync();
            }
        },

        _displayRow: function(row) {
            var that = this,
                model = that._modelForContainer(row);

            if (model) {
                row.replaceWith($((row.hasClass("k-alt") ? that.altRowTemplate : that.rowTemplate)(model)));
            }
        },

        _showMessage: function(text) {
            return window.confirm(text);
        },

        _confirmation: function() {
            var that = this,
                editable = that.options.editable,
                confirmation = editable === true || typeof editable === STRING ? DELETECONFIRM : editable.confirmation;

            return confirmation !== false && confirmation != null ? that._showMessage(confirmation) : true;
        },

        cancelChanges: function() {
            this.dataSource.cancelChanges();
        },

        saveChanges: function() {
            var that = this;

            if (((that.editable && that.editable.end()) || !that.editable) && !that.trigger(SAVECHANGES)) {
                that.dataSource.sync();
            }
        },

        addRow: function() {
            var that = this,
                index,
                dataSource = that.dataSource,
                mode = that._editMode(),
                createAt = that.options.editable.createAt || "",
                pageSize = dataSource.pageSize(),
                view = dataSource.view() || [];

            if ((that.editable && that.editable.end()) || !that.editable) {
                if (mode != "incell") {
                    that.cancelRow();
                }

                index = dataSource.indexOf(view[0]);

                if (createAt.toLowerCase() == "bottom") {
                    index += view.length;

                    if (pageSize && !dataSource.options.serverPaging && pageSize <= view.length) {
                        index -= 1;
                    }
                }

                if (index < 0) {
                    index = 0;
                }

                var model = dataSource.insert(index, {}),
                    id = model.uid,
                    row = that.table.find("tr[" + kendo.attr("uid") + "=" + id + "]"),
                    cell = row.children("td:not(.k-group-cell,.k-hierarchy-cell)").first();

                if ((mode === "inline" || mode === "popup") && row.length) {
                    that.editRow(row);
                } else if (cell.length) {
                    that.editCell(cell);
                }
            }
        },

        _toolbar: function() {
            var that = this,
                wrapper = that.wrapper,
                toolbar = that.options.toolbar,
                editable = that.options.editable,
                container,
                template;

            if (toolbar) {
                container = that.wrapper.find(".k-grid-toolbar");

                if (!container.length) {
                    toolbar = isFunction(toolbar) ? toolbar({}) : (typeof toolbar === STRING ? toolbar : that._toolbarTmpl(toolbar).replace(templateHashRegExp, "\\#"));

                    template = proxy(kendo.template(toolbar), that);

                    container = $('<div class="k-toolbar k-grid-toolbar" />')
                        .html(template({}))
                        .prependTo(wrapper);
                }

                if (editable && editable.create !== false) {
                    container.delegate(".k-grid-add", CLICK, function(e) { e.preventDefault(); that.addRow(); })
                        .delegate(".k-grid-cancel-changes", CLICK, function(e) { e.preventDefault(); that.cancelChanges(); })
                        .delegate(".k-grid-save-changes", CLICK, function(e) { e.preventDefault(); that.saveChanges(); });
                }
            }
        },

        _toolbarTmpl: function(commands) {
            var that = this,
                idx,
                length,
                html = "";

            if (isArray(commands)) {
                for (idx = 0, length = commands.length; idx < length; idx++) {
                    html += that._createButton(commands[idx]);
                }
            }
            return html;
        },

        _createButton: function(command) {
            var template = command.template || COMMANDBUTTONTMPL,
                commandName = typeof command === STRING ? command : command.name || command.text,
                options = { className: "k-grid-" + commandName, text: commandName, imageClass: "", attr: "", iconClass: "" };

            if (!commandName && !(isPlainObject(command) && command.template))  {
                throw new Error("Custom commands should have name specified");
            }

            if (isPlainObject(command)) {
                if (command.className) {
                    command.className += " " + options.className;
                }

                if (commandName === "edit" && isPlainObject(command.text)) {
                    command = extend(true, {}, command);
                    command.text = command.text.edit;
                }

                if (command.attr && isPlainObject(command.attr)) {
                    command.attr = stringifyAttributes(command.attr);
                }

                options = extend(true, options, defaultCommands[commandName], command);
            } else {
                options = extend(true, options, defaultCommands[commandName]);
            }

            return kendo.template(template)(options);
        },

        _groupable: function() {
            var that = this,
                wrapper = that.wrapper,
                groupable = that.options.groupable;

            if (!that.groupable) {
                that.table.delegate(".k-grouping-row .k-i-collapse, .k-grouping-row .k-i-expand", CLICK, function(e) {
                    var element = $(this),
                    group = element.closest("tr");

                    if(element.hasClass('k-i-collapse')) {
                        that.collapseGroup(group);
                    } else {
                        that.expandGroup(group);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            if (groupable) {
                if(!wrapper.has("div.k-grouping-header")[0]) {
                    $("<div />").addClass("k-grouping-header").html("&nbsp;").prependTo(wrapper);
                }

                if (that.groupable) {
                    that.groupable.destroy();
                }

                that.groupable = new Groupable(wrapper, extend({}, groupable, {
                    draggable: that._draggableInstance,
                    groupContainer: ">div.k-grouping-header",
                    dataSource: that.dataSource,
                    filter: ".k-header:not(.k-group-cell,.k-hierarchy-cell):visible[" + kendo.attr("field") + "]",
                    allowDrag: that.options.reorderable
                }));
            }
        },

        _selectable: function() {
            var that = this,
                multi,
                cell,
                selectable = that.options.selectable;

            if (selectable) {
                multi = typeof selectable === STRING && selectable.toLowerCase().indexOf("multiple") > -1;
                cell = typeof selectable === STRING && selectable.toLowerCase().indexOf("cell") > -1;

                that.selectable = new kendo.ui.Selectable(that.table, {
                    filter: ">" + (cell ? SELECTION_CELL_SELECTOR : "tbody>tr:not(.k-grouping-row,.k-detail-row,.k-group-footer)"),
                    multiple: multi,
                    change: function() {
                        that.trigger(CHANGE);
                    }
                });

                if (that.options.navigatable) {
                    that.wrapper.keydown(function(e) {
                        var current = that.current();
                        if (e.keyCode === keys.SPACEBAR && e.target == that.wrapper[0] && !current.hasClass("k-edit-cell")) {
                            e.preventDefault();
                            e.stopPropagation();
                            current = cell ? current : current.parent();

                            if(multi) {
                                if(!e.ctrlKey) {
                                    that.selectable.clear();
                                } else {
                                    if(current.hasClass(SELECTED)) {
                                        current.removeClass(SELECTED);
                                        current = null;
                                    }
                                }
                            } else {
                                that.selectable.clear();
                            }

                            that.selectable.value(current);
                        }
                    });
                }
            }
        },

        clearSelection: function() {
            var that = this;
            that.selectable.clear();
            that.trigger(CHANGE);
        },

        select: function(items) {
            var that = this,
                selectable = that.selectable;

            items = $(items);
            if(items.length) {
                if(!selectable.options.multiple) {
                    selectable.clear();
                    items = items.first();
                }
                selectable.value(items);
                return;
            }

            return selectable.value();
        },

        current: function(element) {
            var that = this,
                scrollable = that.options.scrollable,
                current = that._current;

            if (element !== undefined && element.length) {
                if (!current || current[0] !== element[0]) {
                    element.addClass(FOCUSED);
                    if (current) {
                        current.removeClass(FOCUSED);
                    }
                    that._current = element;

                    if(element.length && scrollable) {
                        that._scrollTo(element.parent()[0], that.content[0]);
                        if (scrollable.virtual) {
                            that._scrollTo(element[0], that.content.find(">.k-virtual-scrollable-wrap")[0]);
                        } else {
                            that._scrollTo(element[0], that.content[0]);
                        }
                    }
                }
            }

            return that._current;
        },

        _scrollTo: function(element, container) {
            var isHorizontal =  element.tagName.toLowerCase() === "td",
                elementOffset = element[isHorizontal ? "offsetLeft" : "offsetTop"],
                elementOffsetDir = element[isHorizontal ? "offsetWidth" : "offsetHeight"],
                containerScroll = container[isHorizontal ? "scrollLeft" : "scrollTop"],
                containerOffsetDir = container[isHorizontal ? "clientWidth" : "clientHeight"],
                bottomDistance = elementOffset + elementOffsetDir;

            container[isHorizontal ? "scrollLeft" : "scrollTop"] = containerScroll > elementOffset ?
                                    elementOffset :
                                    (bottomDistance > (containerScroll + containerOffsetDir) ?
                                        (bottomDistance - containerOffsetDir) : containerScroll);
        },

        _navigatable: function() {
            var that = this,
                wrapper = that.wrapper,
                table = that.table.addClass(FOCUSABLE),
                currentProxy = proxy(that.current, that),
                selector = "." + FOCUSABLE + " " + CELL_SELECTOR,
                browser = $.browser,
                clickCallback = function(e) {
                    var currentTarget = $(e.currentTarget);
                    if (currentTarget.closest("tbody")[0] !== that.tbody[0]) {
                        return;
                    }

                    currentProxy(currentTarget);
                    if(!$(e.target).is(":button,a,:input,a>.k-icon,textarea,span.k-icon,.k-input")) {
                        setTimeout(function() { wrapper.focus(); } );
                    }

                    e.stopPropagation();
                };

            if (that.options.navigatable) {
                wrapper.bind({
                    focus: function() {
                        var current = that._current;
                        if(current && current.is(":visible")) {
                            current.addClass(FOCUSED);
                        } else {
                            currentProxy(that.table.find(FIRST_CELL_SELECTOR));
                        }
                    },
                    focusout: function(e) {
                        if (that._current) {
                            that._current.removeClass(FOCUSED);
                        }
                        e.stopPropagation();
                    },
                    keydown: function(e) {
                        var key = e.keyCode,
                            current = that.current(),
                            shiftKey = e.shiftKey,
                            dataSource = that.dataSource,
                            pageable = that.options.pageable,
                            canHandle = !$(e.target).is(":button,a,:input,a>.t-icon"),
                            isInCell = that._editMode() == "incell",
                            currentIndex,
                            cell,
                            handled = false;

                        if (canHandle && keys.UP === key) {
                            currentProxy(current ? current.parent().prevAll(ROW_SELECTOR).last().children(":eq(" + current.index() + "),:eq(0)").last() : table.find(FIRST_CELL_SELECTOR));
                            handled = true;
                        } else if (canHandle && keys.DOWN === key) {
                            currentProxy(current ? current.parent().nextAll(ROW_SELECTOR).first().children(":eq(" + current.index() + "),:eq(0)").last() : table.find(FIRST_CELL_SELECTOR));
                            handled = true;
                        } else if (canHandle && keys.LEFT === key) {
                            currentProxy(current ? current.prevAll(DATA_CELL + ":first") : table.find(FIRST_CELL_SELECTOR));
                            handled = true;
                        } else if (canHandle && keys.RIGHT === key) {
                            currentProxy(current ? current.nextAll(":visible:first") : table.find(FIRST_CELL_SELECTOR));
                            handled = true;
                        } else if (canHandle && pageable && keys.PAGEDOWN == key) {
                            that._current = null;
                            dataSource.page(dataSource.page() + 1);
                            handled = true;
                        } else if (canHandle && pageable && keys.PAGEUP == key) {
                            that._current = null;
                            dataSource.page(dataSource.page() - 1);
                            handled = true;
                        } else if (that.options.editable) {
                            current = current ? current : table.find(FIRST_CELL_SELECTOR);
                            if (keys.ENTER == key || keys.F2 == key) {
                                that._handleEditing(current);
                                handled = true;
                            } else if (keys.TAB == key && isInCell) {
                                cell = shiftKey ? current.prevAll(DATA_CELL + ":first") : current.nextAll(":visible:first");
                                if (!cell.length) {
                                    cell = current.parent()[shiftKey ? "prevAll" : "nextAll"]("tr:not(.k-grouping-row,.k-detail-row):visible")
                                        .children(DATA_CELL + (shiftKey ? ":last" : ":first"));
                                }

                                if (cell.length) {
                                    that._handleEditing(current, cell);
                                    handled = true;
                                }
                            } else if (keys.ESC == key && that._editContainer) {
                                if (that._editContainer.has(current[0]) || current[0] === that._editContainer[0]) {
                                    if (isInCell) {
                                        that.closeCell();
                                    } else {
                                        currentIndex = that.items().index(current.parent());
                                        document.activeElement.blur();
                                        that.cancelRow();
                                        if (currentIndex >= 0) {
                                            that.current(that.items().eq(currentIndex).children().filter(DATA_CELL).first());
                                        }
                                    }

                                    if (browser.msie && parseInt(browser.version, 10) < 9) {
                                        document.body.focus();
                                    }
                                    wrapper.focus();
                                    handled = true;
                                }
                            }
                        }

                        if(handled) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                });

                wrapper.delegate(selector, "mousedown", clickCallback); }
        },

        _handleEditing: function(current, next) {
            var that = this,
                mode = that._editMode(),
                editContainer = that._editContainer,
                idx,
                isEdited;

            if (mode == "incell") {
                isEdited = current.hasClass("k-edit-cell");
            } else {
                isEdited = current.parent().hasClass("k-grid-edit-row");
            }

            if (that.editable) {
                if ($.contains(editContainer[0], document.activeElement)) {
                    $(document.activeElement).blur();
                }

                if (that.editable.end()) {
                    if (mode == "incell") {
                        that.closeCell();
                    } else {
                        if (current.parent()[0] === editContainer[0]) {
                            idx = that.items().index(current.parent());
                        } else {
                            idx = that.items().index(editContainer);
                        }
                        that.saveRow();
                        that.current(that.items().eq(idx).children().filter(DATA_CELL).first());
                        isEdited = true;
                    }
                } else {
                    if (mode == "incell") {
                        that.current(editContainer);
                    } else {
                        that.current(editContainer.children().filter(DATA_CELL).first());
                    }
                    editContainer.find(":input:visible:first").focus();
                    return;
                }
            }

            if (next) {
                that.current(next);
            }

            that.wrapper.focus();
            if ((!isEdited && !next) || next) {
                if (mode == "incell") {
                    that.editCell(that.current());
                } else {
                    that.editRow(that.current().parent());
                }
            }
        },

        _wrapper: function() {
            var that = this,
                table = that.table,
                height = that.options.height,
                wrapper = that.element;

            if (!wrapper.is("div")) {
               wrapper = wrapper.wrap("<div/>").parent();
            }

            that.wrapper = wrapper.addClass("k-grid k-widget")
                                  .attr(TABINDEX, math.max(table.attr(TABINDEX) || 0, 0));

            table.removeAttr(TABINDEX);

            if (height) {
                that.wrapper.css(HEIGHT, height);
                table.css(HEIGHT, "auto");
            }
        },

        _tbody: function() {
            var that = this,
                table = that.table,
                tbody;

            tbody = table.find(">tbody");

            if (!tbody.length) {
                tbody = $("<tbody/>").appendTo(table);
            }

            that.tbody = tbody;
        },

        _scrollable: function() {
            var that = this,
                header,
                table,
                options = that.options,
                scrollable = options.scrollable,
                scrollbar = kendo.support.scrollbar();

            if (scrollable) {
                header = that.wrapper.children(".k-grid-header");

                if (!header[0]) {
                    header = $('<div class="k-grid-header" />').insertBefore(that.table);
                }

                // workaround for IE issue where scroll is not raised if container is same width as the scrollbar
                header.css("padding-right", scrollable.virtual ? scrollbar + 1 : scrollbar);
                table = $('<table cellspacing="0" />');
                table.append(that.thead);
                header.empty().append($('<div class="k-grid-header-wrap" />').append(table));

                that.content = that.table.parent();

                if (that.content.is(".k-virtual-scrollable-wrap")) {
                    that.content = that.content.parent();
                }

                if (!that.content.is(".k-grid-content, .k-virtual-scrollable-wrap")) {
                    that.content = that.table.wrap('<div class="k-grid-content" />').parent();
                }
                if (scrollable !== true && scrollable.virtual && !that.virtualScrollable) {
                    that.virtualScrollable = new VirtualScrollable(that.content, {
                        dataSource: that.dataSource,
                        itemHeight: proxy(that._averageRowHeight, that)
                    });
                }

                that.scrollables = header.children(".k-grid-header-wrap"); // the footer does not exists here yet!

                if (scrollable.virtual) {
                    that.content.find(">.k-virtual-scrollable-wrap").bind('scroll', function () {
                        that.scrollables.scrollLeft(this.scrollLeft);
                    });
                } else {
                    that.content.bind('scroll', function () {
                        that.scrollables.scrollLeft(this.scrollLeft);
                    });

                    var touchScroller = kendo.touchScroller(that.content);
                    if (touchScroller && touchScroller.movable) {
                        touchScroller.movable.bind("change", function(e) {
                            that.scrollables.scrollLeft(-e.sender.x);
                        });
                    }
                }
            }
        },

        _setContentHeight: function() {
            var that = this,
                options = that.options,
                height = that.wrapper.innerHeight(),
                header = that.wrapper.children(".k-grid-header"),
                scrollbar = kendo.support.scrollbar();

            if (options.scrollable) {

                height -= header.outerHeight();

                if (that.pager) {
                    height -= that.pager.element.outerHeight();
                }

                if(options.groupable) {
                    height -= that.wrapper.children(".k-grouping-header").outerHeight();
                }

                if(options.toolbar) {
                    height -= that.wrapper.children(".k-grid-toolbar").outerHeight();
                }

                if (that.footerTemplate) {
                    height -= that.wrapper.children(".k-grid-footer").outerHeight();
                }

                var isGridHeightSet = function(el) {
                    var initialHeight, newHeight;
                    if (el[0].style.height) {
                        return true;
                    } else {
                        initialHeight = el.height();
                    }

                    el.height("auto");
                    newHeight = el.height();

                    if (initialHeight != newHeight) {
                        el.height("");
                        return true;
                    }
                    el.height("");
                    return false;
                };

                if (isGridHeightSet(that.wrapper)) { // set content height only if needed
                    if (height > scrollbar * 2) { // do not set height if proper scrollbar cannot be displayed
                        that.content.height(height);
                    } else {
                        that.content.height(scrollbar * 2 + 1);
                    }
                }
            }
        },

        _averageRowHeight: function() {
            var that = this,
                rowHeight = that._rowHeight;

            if (!that._rowHeight) {
                that._rowHeight = rowHeight = that.table.outerHeight() / that.table[0].rows.length;
                that._sum = rowHeight;
                that._measures = 1;
            }

            var currentRowHeight = that.table.outerHeight() / that.table[0].rows.length;

            if (rowHeight !== currentRowHeight) {
                that._measures ++;
                that._sum += currentRowHeight;
                that._rowHeight = that._sum / that._measures;
            }
            return rowHeight;
        },

        _dataSource: function() {
            var that = this,
                options = that.options,
                pageable,
                dataSource = options.dataSource;

            dataSource = isArray(dataSource) ? { data: dataSource } : dataSource;

            if (isPlainObject(dataSource)) {
                extend(dataSource, { table: that.table, fields: that.columns });

                pageable = options.pageable;

                if (isPlainObject(pageable) && pageable.pageSize !== undefined) {
                    dataSource.pageSize = pageable.pageSize;
                }
            }

            if (that.dataSource && that._refreshHandler) {
                that.dataSource.unbind(CHANGE, that._refreshHandler)
                                .unbind(REQUESTSTART, that._requestStartHandler)
                                .unbind(ERROR, that._errorHandler);
            } else {
                that._refreshHandler = proxy(that.refresh, that);
                that._requestStartHandler = proxy(that._requestStart, that);
                that._errorHandler = proxy(that._error, that);
            }

            that.dataSource = DataSource.create(dataSource)
                                .bind(CHANGE, that._refreshHandler)
                                .bind(REQUESTSTART, that._requestStartHandler)
                                .bind(ERROR, that._errorHandler);
        },

        _error: function() {
            this._progress(false);
        },

        _requestStart: function() {
            this._progress(true);
        },

        _modelChange: function(e) {
            var that = this,
                model = e.model,
                row = that.tbody.find("tr[" + kendo.attr("uid") + "=" + model.uid +"]"),
                cell,
                column,
                isAlt = row.hasClass("k-alt"),
                tmp,
                idx,
                length;

            if (row.children(".k-edit-cell").length && !that.options.rowTemplate) {
                row.children(":not(.k-group-cell,.k-hierarchy-cell)").each(function() {
                    cell = $(this);
                    column = that.columns[that.cellIndex(cell)];

                    if (column.field === e.field) {
                        if (!cell.hasClass("k-edit-cell")) {
                            that._displayCell(cell, column, model);
                            $('<span class="k-dirty"/>').prependTo(cell);
                        } else {
                            cell.addClass("k-dirty-cell");
                        }
                    }
                });

            } else if (!row.hasClass("k-grid-edit-row")) {
                tmp = $((isAlt ? that.altRowTemplate : that.rowTemplate)(model));

                row.replaceWith(tmp);

                for (idx = 0, length = that.columns.length; idx < length; idx++) {
                    column = that.columns[idx];

                    if (column.field === e.field) {
                        cell = tmp.children(":not(.k-group-cell,.k-hierarchy-cell)").eq(idx);
                        $('<span class="k-dirty"/>').prependTo(cell);
                    }
                }
                that.trigger("itemChange", { item: tmp, data: model, ns: ui });
            }

        },

        _pageable: function() {
            var that = this,
                wrapper,
                pageable = that.options.pageable;

            if (pageable) {
                wrapper = that.wrapper.children("div.k-grid-pager");

                if (!wrapper.length) {
                    wrapper = $('<div class="k-pager-wrap k-grid-pager"/>').appendTo(that.wrapper);
                }

                if (that.pager) {
                    that.pager.destroy();
                }

                if (typeof pageable === "object" && pageable instanceof kendo.ui.Pager) {
                    that.pager = pageable;
                } else {
                    that.pager = new kendo.ui.Pager(wrapper, extend({}, pageable, { dataSource: that.dataSource }));
                }
            }
        },

        _footer: function() {
            var that = this,
                aggregates = that.dataSource.aggregates(),
                html = "",
                footerTemplate = that.footerTemplate,
                options = that.options,
                footer;

            if (footerTemplate) {
                aggregates = !isEmptyObject(aggregates) ? aggregates : buildEmptyAggregatesObject(that.dataSource.aggregate());

                html = $(that._wrapFooter(footerTemplate(aggregates)));
                footer = that.footer || that.wrapper.find(".k-grid-footer");

                if (footer.length) {
                    var tmp = html;

                    footer.replaceWith(tmp);
                    that.footer = tmp;
                } else {
                    if (options.scrollable) {
                        that.footer = options.pageable ? html.insertBefore(that.wrapper.children("div.k-grid-pager")) : html.appendTo(that.wrapper);
                    } else {
                        that.footer = html.insertBefore(that.tbody);
                    }
                }

                if (options.scrollable) {
                    var containsFooter = false;
                    that.scrollables.each(function(){
                        if ($(this).hasClass("k-grid-footer-wrap")) {
                            containsFooter = true;
                        }
                    });
                    if (!containsFooter) {
                        that.scrollables = that.scrollables.add(that.footer.children(".k-grid-footer-wrap"));
                    }
                }

                if (options.resizable && that._footerWidth) {
                    that.footer.find("table").css('width', that._footerWidth);
                }
            }
        },

        _wrapFooter: function(footerRow) {
            var that = this,
                html = "";

            if (that.options.scrollable) {
                html = $('<div class="k-grid-footer"><div class="k-grid-footer-wrap"><table cellspacing="0"><tbody>' + footerRow + '</tbody></table></div></div>');
                that._appendCols(html.find("table"));
                return html;
            }

            return '<tfoot class="k-grid-footer">' + footerRow + '</tfoot>';
        },

        _columnMenu: function() {
            var that = this,
                menu,
                columns = that.columns,
                column,
                options = that.options,
                columnMenu = options.columnMenu,
                menuOptions,
                sortable,
                filterable,
                cell;

            if (columnMenu) {
                if (typeof columnMenu == "boolean") {
                    columnMenu = {};
                }

                that.thead
                    .find("th:not(.k-hierarchy-cell,.k-group-cell)")
                    .each(function (index) {
                        column = columns[index];
                        cell = $(this);

                        if (!column.command && (column.field || cell.attr("data-" + kendo.ns + "field"))) {
                            menu = cell.data("kendoColumnMenu");
                            if (menu) {
                                menu.destroy();
                            }
                            sortable = column.sortable !== false && columnMenu.sortable !== false ? options.sortable : false;
                            filterable = options.filterable && column.filterable !== false && columnMenu.filterable !== false ? extend({}, column.filterable, options.filterable) : false;
                            menuOptions = {
                                dataSource: that.dataSource,
                                values: column.values,
                                columns: columnMenu.columns,
                                sortable: sortable,
                                filterable: filterable,
                                messages: columnMenu.messages,
                                owner: that
                            };

                            cell.kendoColumnMenu(menuOptions);
                        }
                    });
            }
        },

        _filterable: function() {
            var that = this,
                columns = that.columns,
                cell,
                filterMenu,
                filterable = that.options.filterable;

            if (filterable && !that.options.columnMenu) {
                that.thead
                    .find("th:not(.k-hierarchy-cell,.k-group-cell)")
                    .each(function(index) {
                        cell = $(this);
                        if (columns[index].filterable !== false && !columns[index].command && (columns[index].field || cell.attr("data-" + kendo.ns + "field"))) {
                            filterMenu = cell.data("kendoFilterMenu");
                            if (filterMenu) {
                                filterMenu.destroy();
                            }
                            cell.kendoFilterMenu(extend(true, {}, filterable, columns[index].filterable, { dataSource: that.dataSource, values: columns[index].values}));
                        }
                    });
            }
        },

        _sortable: function() {
            var that = this,
                columns = that.columns,
                column,
                sortable = that.options.sortable;

            if (sortable) {
                that.thead
                    .find("th:not(.k-hierarchy-cell,.k-group-cell)")
                    .each(function(index) {
                        column = columns[index];
                        if (column.sortable !== false && !column.command && column.field) {
                            $(this).attr("data-" + kendo.ns +"field", column.field).kendoSortable(extend({}, sortable, { dataSource: that.dataSource }));
                        }
                    });
            }
        },

        _columns: function(columns) {
            var that = this,
                table = that.table,
                encoded,
                cols = table.find("col"),
                dataSource = that.options.dataSource;

            // using HTML5 data attributes as a configuration option e.g. <th data-field="foo">Foo</foo>
            columns = columns.length ? columns : map(table.find("th"), function(th, idx) {
                th = $(th);
                var sortable = th.attr(kendo.attr("sortable")),
                    filterable = th.attr(kendo.attr("filterable")),
                    type = th.attr(kendo.attr("type")),
                    groupable = th.attr(kendo.attr("groupable")),
                    field = th.attr(kendo.attr("field")),
                    menu = th.attr(kendo.attr("menu"));

                if (!field) {
                   field = th.text().replace(/\s|[^A-z0-9]/g, "");
                }

                return {
                    field: field,
                    type: type,
                    sortable: sortable !== "false",
                    filterable: filterable !== "false",
                    groupable: groupable !== "false",
                    menu: menu,
                    template: th.attr(kendo.attr("template")),
                    width: cols.eq(idx).css("width")
                };
            });

            encoded = !(that.table.find("tbody tr").length > 0 && (!dataSource || !dataSource.transport));

            that.columns = map(columns, function(column) {
                column = typeof column === STRING ? { field: column } : column;
                if (column.hidden) {
                    column.attributes = addHiddenStyle(column.attributes);
                    column.footerAttributes = addHiddenStyle(column.footerAttributes);
                    column.headerAttributes = addHiddenStyle(column.headerAttributes);
                }

                return extend({ encoded: encoded }, column);
            });
        },

        _tmpl: function(rowTemplate, alt) {
            var that = this,
                settings = extend({}, kendo.Template, that.options.templateSettings),
                idx,
                length = that.columns.length,
                template,
                state = { storage: {}, count: 0 },
                column,
                type,
                hasDetails = that._hasDetails(),
                className = [],
                groups = that.dataSource.group().length;

            if (!rowTemplate) {
                rowTemplate = "<tr";

                if (alt) {
                    className.push("k-alt");
                }

                if (hasDetails) {
                    className.push("k-master-row");
                }

                if (className.length) {
                    rowTemplate += ' class="' + className.join(" ") + '"';
                }

                if (length) { // data item is an object
                    rowTemplate += ' ' + kendo.attr("uid") + '="#=uid#"';
                }

                rowTemplate += ">";

                if (groups > 0) {
                    rowTemplate += groupCells(groups);
                }

                if (hasDetails) {
                    rowTemplate += '<td class="k-hierarchy-cell"><a class="k-icon k-plus" href="\\#"></a></td>';
                }

                for (idx = 0; idx < length; idx++) {
                    column = that.columns[idx];
                    template = column.template;
                    type = typeof template;
                    var cellEditable=false;
                    if(column.celleditable!=undefined)
                        cellEditable=column.celleditable;
                        
                    var defaultEditable=false;
                    if(column.defaulteditable!=undefined)
                        defaultEditable=column.defaulteditable;
                    rowTemplate += "<td" + stringifyAttributes(column.attributes) + "cellEditable="+cellEditable+" editMode="+defaultEditable+">";
                    rowTemplate += that._cellTmpl(column, state);

                    rowTemplate += "</td>";
                }

                rowTemplate += "</tr>";
            }

            rowTemplate = kendo.template(rowTemplate, settings);

            if (state.count > 0) {
                return proxy(rowTemplate, state.storage);
            }

            return rowTemplate;
        },

        _headerCellText: function(column) {
            var that = this,
                settings = extend({}, kendo.Template, that.options.templateSettings),
                template = column.headerTemplate,
                type = typeof(template),
                text = column.title || column.field || "";

            if (type === FUNCTION) {
                text = kendo.template(template, settings)({});
            } else if (type === STRING) {
                text = template;
            }
            return text;
        },

        _cellTmpl: function(column, state) {
            var that = this,
                settings = extend({}, kendo.Template, that.options.templateSettings),
                template = column.template,
                paramName = settings.paramName,
                html = "",
                idx,
                length,
                format = column.format,
                type = typeof template,
                columnValues = column.values;

            if (column.command) {
                if (isArray(column.command)) {
                    for (idx = 0, length = column.command.length; idx < length; idx++) {
                        html += that._createButton(column.command[idx]);
                    }
                    return html.replace(templateHashRegExp, "\\#");
                }
                return that._createButton(column.command).replace(templateHashRegExp, "\\#");
            }
            if (type === FUNCTION) {
                state.storage["tmpl" + state.count] = template;
                html += "#=this.tmpl" + state.count + "(" + paramName + ")#";
                state.count ++;
            } else if (type === STRING) {
                html += template;
            } else if (columnValues && columnValues.length && isPlainObject(columnValues[0]) && "value" in columnValues[0]) {
                html += "#var v =" + kendo.stringify(columnValues) + "#";
                html += "#for (var idx=0,length=v.length;idx<length;idx++) {#";
                html += "#if (v[idx].value == ";

                if (!settings.useWithBlock) {
                    html += paramName + ".";
                }

                html += column.field;
                html += ") { #";
                html += "${v[idx].text}";
                html += "#break;#";
                html += "#}#";
                html += "#}#";
            } else {
                html += column.encoded ? "${" : "#=";

                if (format) {
                    html += 'kendo.format(\"' + format.replace(formatRegExp,"\\$1") + '\",';
                }

                if (!settings.useWithBlock) {
                    html += paramName + ".";
                }

                html += column.field;

                if (format) {
                    html += ")";
                }

                html += column.encoded ? "}" : "#";
            }
            return html;
        },

        _templates: function() {
            var that = this,
                options = that.options,
                dataSource = that.dataSource,
                groups = dataSource.group(),
                aggregates = dataSource.aggregate();

            that.rowTemplate = that._tmpl(options.rowTemplate);
            that.altRowTemplate = that._tmpl(options.altRowTemplate || options.rowTemplate, true);

            if (that._hasDetails()) {
                that.detailTemplate = that._detailTmpl(options.detailTemplate || "");
            }

            if (!isEmptyObject(aggregates) ||
                grep(that.columns, function(column) { return column.footerTemplate; }).length) {

                that.footerTemplate = that._footerTmpl(aggregates, "footerTemplate", "k-footer-template");
            }

            if (groups.length && grep(that.columns, function(column) { return column.groupFooterTemplate; }).length) {
                aggregates = $.map(groups, function(g) { return g.aggregates; });
                that.groupFooterTemplate = that._footerTmpl(aggregates, "groupFooterTemplate", "k-group-footer");
            }
        },

        _footerTmpl: function(aggregates, templateName, rowClass) {
            var that = this,
                settings = extend({}, kendo.Template, that.options.templateSettings),
                paramName = settings.paramName,
                html = "",
                idx,
                length,
                columns = that.columns,
                template,
                type,
                storage = {},
                count = 0,
                scope = {},
                dataSource = that.dataSource,
                groups = dataSource.group().length,
                fieldsMap = buildEmptyAggregatesObject(aggregates),
                column;

            html += '<tr class="' + rowClass + '">';

            if (groups > 0) {
                html += groupCells(groups);
            }

            if (that._hasDetails()) {
                html += '<td class="k-hierarchy-cell">&nbsp;</td>';
            }

            for (idx = 0, length = that.columns.length; idx < length; idx++) {
                column = columns[idx];
                template = column[templateName];
                type = typeof template;

                html += "<td" + stringifyAttributes(column.footerAttributes) + ">";

                if (template) {
                    if (type !== FUNCTION) {
                        scope = fieldsMap[column.field] ? extend({}, settings, { paramName: paramName + "." + column.field }) : {};
                        template = kendo.template(template, scope);
                    }

                    storage["tmpl" + count] = template;
                    html += "#=this.tmpl" + count + "(" + paramName + ")#";
                    count ++;
                } else {
                    html += "&nbsp;";
                }

                html += "</td>";
            }

            html += '</tr>';

            html = kendo.template(html, settings);

            if (count > 0) {
                return proxy(html, storage);
            }

            return html;
        },

        _detailTmpl: function(template) {
            var that = this,
                html = "",
                settings = extend({}, kendo.Template, that.options.templateSettings),
                paramName = settings.paramName,
                templateFunctionStorage = {},
                templateFunctionCount = 0,
                groups = that.dataSource.group().length,
                colspan = visibleColumns(that.columns).length,
                type = typeof template;

            html += '<tr class="k-detail-row">';
            if (groups > 0) {
                html += groupCells(groups);
            }
            html += '<td class="k-hierarchy-cell"></td><td class="k-detail-cell"' + (colspan? ' colspan="' + colspan + '"' : '') + ">";

            if (type === FUNCTION) {
                templateFunctionStorage["tmpl" + templateFunctionCount] = template;
                html += "#=this.tmpl" + templateFunctionCount + "(" + paramName + ")#";
                templateFunctionCount ++;
            } else {
                html += template;
            }

            html += "</td></tr>";

            html = kendo.template(html, settings);

            if (templateFunctionCount > 0) {
                return proxy(html, templateFunctionStorage);
            }

            return html;
        },

        _hasDetails: function() {
            var that = this;

            return that.options.detailTemplate !== undefined  || (that._events[DETAILINIT] || []).length;
        },

        _details: function() {
            var that = this;

            that.table.delegate(".k-hierarchy-cell .k-plus, .k-hierarchy-cell .k-minus", CLICK, function(e) {
                var button = $(this),
                    expanding = button.hasClass("k-plus"),
                    masterRow = button.closest("tr.k-master-row"),
                    detailRow,
                    detailTemplate = that.detailTemplate,
                    data,
                    hasDetails = that._hasDetails();

                button.toggleClass("k-plus", !expanding)
                    .toggleClass("k-minus", expanding);

                if(hasDetails && !masterRow.next().hasClass("k-detail-row")) {
                    data = that.dataItem(masterRow);
                    $(detailTemplate(data))
                        .addClass(masterRow.hasClass("k-alt") ? "k-alt" : "")
                        .insertAfter(masterRow);

                    that.trigger(DETAILINIT, { masterRow: masterRow, detailRow: masterRow.next(), data: data, detailCell: masterRow.next().find(".k-detail-cell") });
                }

                detailRow = masterRow.next();

                that.trigger(expanding ? DETAILEXPAND : DETAILCOLLAPSE, { masterRow: masterRow, detailRow: detailRow});
                detailRow.toggle(expanding);

                e.preventDefault();
                return false;
            });
        },

        dataItem: function(tr) {
            return this._data[this.tbody.find('> tr:not(.k-grouping-row,.k-detail-row,.k-group-footer)').index($(tr))];
        },

        expandRow: function(tr) {
            $(tr).find('> td .k-plus, > td .k-i-expand').click();
        },

        collapseRow: function(tr) {
            $(tr).find('> td .k-minus, > td .k-i-collapse').click();
        },

        _thead: function() {
            var that = this,
                columns = that.columns,
                hasDetails = that._hasDetails() && columns.length,
                idx,
                length,
                html = "",
                thead = that.table.find(">thead"),
                tr,
                text,
                th;

            if (!thead.length) {
                thead = $("<thead/>").insertBefore(that.tbody);
            }

            tr = that.element.find("tr:has(th):first");

            if (!tr.length) {
                tr = thead.children().first();
                if (!tr.length) {
                    tr = $("<tr/>");
                }
            }

            if (!tr.children().length) {
                if (hasDetails) {
                    html += '<th class="k-hierarchy-cell">&nbsp;</th>';
                }

                for (idx = 0, length = columns.length; idx < length; idx++) {
                    th = columns[idx];
                    text = that._headerCellText(th);

                    if (!th.command) {
                        html += "<th " + kendo.attr("field") + "='" + (th.field || "") + "' ";
                        if (th.title) {
                            html += kendo.attr("title") + '="' + th.title.replace(/'/g, "\'") + '" ';
                        }

                        if (th.groupable !== undefined) {
                            html += kendo.attr("groupable") + "='" + th.groupable + "' ";
                        }

                        if (th.aggregates) {
                            html += kendo.attr("aggregates") + "='" + th.aggregates + "'";
                        }

                        html += stringifyAttributes(th.headerAttributes);

                        html += ">" + text + "</th>";
                    } else {
                        html += "<th" + stringifyAttributes(th.headerAttributes) + ">" + text + "</th>";
                    }
                }

                tr.html(html);
            } else if (hasDetails && !tr.find(".k-hierarchy-cell")[0]) {
                tr.prepend('<th class="k-hierarchy-cell">&nbsp;</th>');
            }

            tr.find("th").addClass("k-header");

            if(!that.options.scrollable) {
                thead.addClass("k-grid-header");
            }

            tr.appendTo(thead);

            that.thead = thead;

            that._sortable();

            that._filterable();

            that._scrollable();

            that._updateCols();

            //that._setContentHeight(); ***

            that._resizable();

            that._draggable();

            that._reorderable();

            that._columnMenu();
        },

        _updateCols: function() {
            var that = this;

            that._appendCols(that.thead.parent().add(that.table));
        },

        _appendCols: function(table) {
            var that = this;

            normalizeCols(table, visibleColumns(that.columns), that._hasDetails(),  that.dataSource.group().length);
        },

        _autoColumns: function(schema) {
            if (schema && schema.toJSON) {
                var that = this,
                    field;

                schema = schema.toJSON();

                for (field in schema) {
                    that.columns.push({ field: field });
                }

                that._thead();

                that._templates();
            }
        },

        _rowsHtml: function(data) {
            var that = this,
                html = "",
                idx,
                length,
                rowTemplate = that.rowTemplate,
                altRowTemplate = that.altRowTemplate;

            for (idx = 0, length = data.length; idx < length; idx++) {
                if (idx % 2) {
                    html += altRowTemplate(data[idx]);
                } else {
                    html += rowTemplate(data[idx]);
                }

                that._data.push(data[idx]);
            }

            return html;
        },

        _groupRowHtml: function(group, colspan, level) {
            var that = this,
                html = "",
                idx,
                length,
                field = group.field,
                column = grep(that.columns, function(column) { return column.field == field; })[0] || { },
                value = column.format ? kendo.format(column.format, group.value) : group.value,
                template = column.groupHeaderTemplate,
                text =  (column.title || field) + ': ' + value,
                data = extend({}, { field: group.field, value: group.value }, group.aggregates[group.field]),
                groupItems = group.items;

            if (template) {
                text  = typeof template === FUNCTION ? template(data) : kendo.template(template)(data);
            }

            html +=  '<tr class="k-grouping-row">' + groupCells(level) +
                      '<td colspan="' + colspan + '">' +
                        '<p class="k-reset">' +
                         '<a class="k-icon k-i-collapse" href="#"></a>' + text +
                         '</p></td></tr>';

            if(group.hasSubgroups) {
                for(idx = 0, length = groupItems.length; idx < length; idx++) {
                    html += that._groupRowHtml(groupItems[idx], colspan - 1, level + 1);
                }
            } else {
                html += that._rowsHtml(groupItems);
            }

            if (that.groupFooterTemplate) {
                html += that.groupFooterTemplate(group.aggregates);
            }
            return html;
        },

        collapseGroup: function(group) {
            group = $(group).find(".k-icon").addClass("k-i-expand").removeClass("k-i-collapse").end();

            var level = group.find(".k-group-cell").length,
                footerCount = 1,
                offset,
                tr;

            group.nextAll("tr").each(function() {
                tr = $(this);
                offset = tr.find(".k-group-cell").length;

                if (tr.hasClass("k-grouping-row")) {
                    footerCount++;
                } else if (tr.hasClass("k-group-footer")) {
                    footerCount--;
                }

                if (offset <= level || (tr.hasClass("k-group-footer") && footerCount < 0)) {
                    return false;
                }

                tr.hide();
            });
        },

        expandGroup: function(group) {
            group = $(group).find(".k-icon").addClass("k-i-collapse").removeClass("k-i-expand").end();
            var that = this,
                level = group.find(".k-group-cell").length,
                tr,
                offset,
                groupsCount = 1;

            group.nextAll("tr").each(function () {
                tr = $(this);
                offset = tr.find(".k-group-cell").length;
                if (offset <= level) {
                    return false;
                }

                if (offset == level + 1 && !tr.hasClass("k-detail-row")) {
                    tr.show();

                    if (tr.hasClass("k-grouping-row") && tr.find(".k-icon").hasClass("k-i-collapse")) {
                        that.expandGroup(tr);
                    }

                    if (tr.hasClass("k-master-row") && tr.find(".k-icon").hasClass("k-minus")) {
                        tr.next().show();
                    }
                }

                if (tr.hasClass("k-grouping-row")) {
                    groupsCount ++;
                }

                if (tr.hasClass("k-group-footer")) {
                    if (groupsCount == 1) {
                        tr.show();
                    } else {
                        groupsCount --;
                    }
                }
            });
        },

        _updateHeader: function(groups) {
            var that = this,
                cells = that.thead.find("th.k-group-cell"),
                length = cells.length;

            if(groups > length) {
                $(new Array(groups - length + 1).join('<th class="k-group-cell k-header">&nbsp;</th>')).prependTo(that.thead.find("tr"));
            } else if(groups < length) {
                length = length - groups;
                $(grep(cells, function(item, index) { return length > index; } )).remove();
            }
        },

        _firstDataItem: function(data, grouped) {
            if(data && grouped) {
                if(data.hasSubgroups) {
                    data = this._firstDataItem(data.items[0], grouped);
                } else {
                    data = data.items[0];
                }
            }
            return data;
        },

        hideColumn: function(column) {
            var that = this,
                rows,
                row,
                cell,
                idx,
                cols,
                colWidth,
                width = 0,
                length,
                footer = that.footer || that.wrapper.find(".k-grid-footer"),
                columns = that.columns,
                columnIndex;

            if (typeof column == "number") {
                column = columns[column];
            } else {
                column = grep(columns, function(item) {
                    return item.field === column;
                })[0];
            }

            if (!column || column.hidden) {
                return;
            }

            columnIndex = inArray(column, visibleColumns(columns));
            column.hidden = true;
            column.attributes = addHiddenStyle(column.attributes);
            column.footerAttributes = addHiddenStyle(column.footerAttributes);
            column.headerAttributes = addHiddenStyle(column.headerAttributes);
            that._templates();

            that._updateCols();
            that.thead.find(">tr>th:not(.k-hierarchy-cell,.k-group-cell):visible").eq(columnIndex).hide();
            if (footer) {
                that._appendCols(footer.find("table:first"));
                footer.find(".k-footer-template>td:not(.k-hierarchy-cell,.k-group-cell):visible").eq(columnIndex).hide();
            }

            rows = that.tbody.children();
            for (idx = 0, length = rows.length; idx < length; idx += 1) {
                row = rows.eq(idx);
                if (row.is(".k-grouping-row,.k-detail-row")) {
                    cell = row.children(":not(.k-group-cell):first,.k-detail-cell").last();
                    cell.attr("colspan", parseInt(cell.attr("colspan"), 10) - 1);
                } else {
                    if (row.hasClass("k-grid-edit-row") && (cell = row.children(".k-edit-container")[0])) {
                        cell = $(cell);
                        cell.attr("colspan", parseInt(cell.attr("colspan"), 10) - 1);
                        cell.find("col").eq(columnIndex).remove();
                        row = cell.find("tr:first");
                    }

                    row.children(":not(.k-group-cell,.k-hierarchy-cell):visible").eq(columnIndex).hide();
                }
            }

            cols = that.thead.prev().find("col");
            for (idx = 0, length = cols.length; idx < length; idx += 1) {
                colWidth = cols[idx].style.width;
                if (colWidth && colWidth.indexOf("%") == -1) {
                    width += parseInt(colWidth, 10);
                } else {
                    width = 0;
                    break;
                }
            }

            if (width) {
                $(">.k-grid-header table:first,>.k-grid-footer table:first",that.wrapper).add(that.table).width(width);
            }

            that.trigger(COLUMNHIDE, { column: column });
        },

        showColumn: function(column) {
            var that = this,
                rows,
                idx,
                length,
                row,
                cell,
                tables,
                width,
                colWidth,
                cols,
                columns = that.columns,
                footer = that.footer || that.wrapper.find(".k-grid-footer"),
                columnIndex;

            if (typeof column == "number") {
                column = columns[column];
            } else {
                column = grep(columns, function(item) {
                    return item.field === column;
                })[0];
            }

            if (!column || !column.hidden) {
                return;
            }

            columnIndex = inArray(column, columns);
            column.hidden = false;
            column.attributes = removeHiddenStyle(column.attributes);
            column.footerAttributes = removeHiddenStyle(column.footerAttributes);
            column.headerAttributes = removeHiddenStyle(column.headerAttributes);
            that._templates();

            that._updateCols();
            that.thead.find(">tr>th:not(.k-hierarchy-cell,.k-group-cell)").eq(columnIndex).show();
            if (footer) {
                that._appendCols(footer.find("table:first"));
                footer.find(".k-footer-template>td:not(.k-hierarchy-cell,.k-group-cell)").eq(columnIndex).show();
            }

            rows = that.tbody.children();
            for (idx = 0, length = rows.length; idx < length; idx += 1) {
                row = rows.eq(idx);
                if (row.is(".k-grouping-row,.k-detail-row")) {
                    cell = row.children(":not(.k-group-cell):first,.k-detail-cell").last();
                    cell.attr("colspan", parseInt(cell.attr("colspan"), 10) + 1);
                } else {
                    if (row.hasClass("k-grid-edit-row") && (cell = row.children(".k-edit-container")[0])) {
                        cell = $(cell);
                        cell.attr("colspan", parseInt(cell.attr("colspan"), 10) + 1);
                        normalizeCols(cell.find(">form>table"), visibleColumns(columns), false,  0);
                        row = cell.find("tr:first");
                    }

                    row.children(":not(.k-group-cell,.k-hierarchy-cell)").eq(columnIndex).show();
                }
            }

            tables = $(">.k-grid-header table:first,>.k-grid-footer table:first",that.wrapper).add(that.table);
            if (!column.width) {
                tables.width("");
            } else {
                width = 0;
                cols = that.thead.prev().find("col");
                for (idx = 0, length = cols.length; idx < length; idx += 1) {
                    colWidth = cols[idx].style.width;
                    if (colWidth.indexOf("%") > -1) {
                        width = 0;
                        break;
                    }
                    width += parseInt(colWidth, 10);
                }

                if (width) {
                    tables.width(width);
                }
            }

            that.trigger(COLUMNSHOW, { column: column });
        },

        _progress: function(toggle) {
            var that = this,
                element = that.element.is("table") ? that.element.parent() : (that.content && that.content.length ? that.content : that.element);

            kendo.ui.progress(element, toggle);
        },

        refresh: function(e) {
            var that = this,
                length,
                idx,
                html = "",
                data = that.dataSource.view(),
                tbody,
                placeholder,
                currentIndex,
                current = that.current(),
                groups = (that.dataSource.group() || []).length,
                colspan = groups + visibleColumns(that.columns).length;

            if (e && e.action === "itemchange" && that.editable) { // skip rebinding if editing is in progress
                return;
            }

            that.trigger("dataBinding");

            if (current && current.hasClass("k-state-focused")) {
                currentIndex = that.items().index(current.parent());
            }

            that._destroyEditable();

            that._progress(false);

            that._data = [];

            if (!that.columns.length) {
                that._autoColumns(that._firstDataItem(data[0], groups));
                colspan = groups + that.columns.length;
            }

            that._group = groups > 0 || that._group;

            if(that._group) {
                that._templates();
                that._updateCols();
                that._updateHeader(groups);
                that._group = groups > 0;
            }

            if(groups > 0) {
                if (that.detailTemplate) {
                    colspan++;
                }

                for (idx = 0, length = data.length; idx < length; idx++) {
                    html += that._groupRowHtml(data[idx], colspan, 0);
                }
            } else {
                html += that._rowsHtml(data);
            }

            if (tbodySupportsInnerHtml) {
                that.tbody[0].innerHTML = html;
            } else {
                placeholder = document.createElement("div");
                placeholder.innerHTML = "<table><tbody>" + html + "</tbody></table>";
                tbody = placeholder.firstChild.firstChild;
                that.table[0].replaceChild(tbody, that.tbody[0]);
                that.tbody = $(tbody);
            }

            that._footer();

            that._setContentHeight();

            if (currentIndex >= 0) {
                that.current(that.items().eq(currentIndex).children().filter(DATA_CELL).first());
            }

            that.trigger(DATABOUND);
            $(that.table).find("tr:not(.k-grouping-row) > td").each(function() {
                var td = $(this);
                if(td.attr("editMode")=="true"){
                    if (td.closest("tbody")[0] !== that.tbody[0] || $(e.target).is(":input")) {
                        return;
                    }

                    if (that.editable) {
                        if (that.editable.end()) {
                            that.closeCell();
                            that.editCell(td);
                        }
                    } else {
                        that.editCell(td);
                    }
                }
            });
       }
   });

   function getCommand(commands, name) {
       var idx, length, command;

       if (typeof commands === STRING && commands === name) {
          return commands;
       }

       if (isPlainObject(commands) && commands.name === name) {
           return commands;
       }

       if (isArray(commands)) {
           for (idx = 0, length = commands.length; idx < length; idx++) {
               command = commands[idx];

               if ((typeof command === STRING && command === name) || (command.name === name)) {
                   return command;
               }
           }
       }
       return null;
   }

   ui.plugin(Grid);
   ui.plugin(VirtualScrollable);
})(jQuery);

