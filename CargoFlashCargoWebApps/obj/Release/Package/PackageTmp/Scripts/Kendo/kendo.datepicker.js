
/*
* Kendo UI Web v2012.2.710 (http://kendoui.com)
* Copyright 2012 Telerik AD. All rights reserved.
*
* Kendo UI Web commercial licenses may be obtained at http://kendoui.com/web-license
* If you do not own a commercial license, this file shall be governed by the
* GNU General Public License (GPL) version 3.
* For GPL requirements, please review: http://www.gnu.org/copyleft/gpl.html
*/
(function ($, undefined) {
    /**
    * @name kendo.ui.Calendar.Description
    *
    * @section
    * <p>
    *  The <b>Calendar</b> renders a graphical calendar that supports
    *  navigation and selection. It supports custom templates for its
    *  "month" view, configurable options for a minimum and maximum date,
    *  start view and the depth of the navigation.
    * </p>
    * <h3>Getting Started</h3>
    *
    * @exampleTitle Create a div element
    * @example
    * <div id="calendar"></div>
    *
    * @exampleTitle Initialize the Calendar via a jQuery ID selector
    * @example
    * $(document).ready(function(){
    *  $("#calendar").kendoCalendar();
    * });
    *
    * @section
    * <p>
    *  When a <b>Calendar</b> is initialized, it will automatically be
    *  displayed near the location of the used HTML element.
    * </p>
    * <h3>Configuring Calendar Behaviors</h3>
    * <p>
    *  The <b>Calendar</b> provides many configuration options that can be
    *  easily set during initialization. Among the properties that can be
    *  controlled:
    * </p>
    * <ul>
    *  <li>Selected date</li>
    *  <li>Minimum and/or maximum date</li>
    *  <li>Start view</li>
    *  <li>
    *   Define the navigation depth (last view to which end user can
    *   navigate)
    *  </li>
    *  <li>Day template</li>
    *  <li>Footer template</li>
    * </ul>
    *
    * @exampleTitle Create Calendar with selected date and a defined minimum
    * and maximum date
    * @example
    * $("#calendar").kendoCalendar({
    *  value: new Date(),
    *  min: new Date(1950, 0, 1),
    *  max: new Date(2049, 11, 31)
    * });
    *
    * @section
    * <p>
    *  The <b>Calendar</b> will not navigate before than the minimum
    *  date specified. It will also not navigate ahead the maximum date
    *  specified.
    * </p>
    * @section
    * <h3>Define start view and navigation depth</h3>
    * <p>
    *  The first rendered view can be defined with "start" option.
    *  Navigation depth can be controlled with "depth" option. Predefined
    *  views are:
    *  <ul>
    *   <li>"month" - shows the days from the month</li>
    *   <li>"year" - shows the months of the year</li>
    *   <li>"decade" - shows the years from the decade</li>
    *   <li>"century" - shows the decades from the century</li>
    *  </ul>
    * </p>
    *
    * @exampleTitle Create a Calendar, which allows a user to select a month
    * @example
    * $("#calendar").kendoCalendar({
    *  start: "year",
    *  depth: "year"
    * });
    *
    * @section
    * <h3>Customize day template</h3>
    * <p>
    *  The <b>Calendar</b> allows to customize content of the rendered day
    *  in the "month" view.
    * </p>
    *
    * @exampleTitle Create a Calendar with custom template
    * @example
    * $("#calendar").kendoCalendar({
    *  month: {
    *   content: '<div class="custom"><#=data.value#></div>'
    *  }
    * });
    *
    * @section
    * <p>
    *  This templates wraps the "value" in a div HTML element. Here is an
    *  example of the object passed to the template function:
    * </p>
    *
    * @exampleTitle Structure of the data object passed to the template
    * @example
    * data = {
    *  date: date, // Date object corresponding to the current cell
    *  title: kendo.toString(date, "D"),
    *  value: date.getDate(),
    *  dateString: "2011/0/1" // formatted date using yyyy/MM/dd format and month is zero-based
    * };
    *
    * @section
    * <h3>Accessing an Existing Calendar</h3>
    * <p>
    *  You can reference an existing <b>Calendar</b> instance via
    *  <a href="http://api.jquery.com/jQuery.data/">jQuery.data()</a>.
    *  Once a reference has been established, you can use the API to control
    *  its behavior.
    * </p>
    *
    * @exampleTitle Accessing an existing Calendar instance
    * @example
    * var calendar = $("#calendar").data("kendoCalendar");
    *
    */
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        parse = kendo.parseDate,
        extractFormat = kendo._extractFormat,
        template = kendo.template,
        getCulture = kendo.getCulture,
        touch = kendo.support.touch,
        transitions = kendo.support.transitions,
        transitionOrigin = transitions ? transitions.css + "transform-origin" : "",
        cellTemplate = template('<td#=data.cssClass#><a class="k-link" href="\\#" data-#=data.ns#value="#=data.dateString#">#=data.value#</a></td>', { useWithBlock: false }),
        emptyCellTemplate = template("<td>&nbsp;</td>", { useWithBlock: false }),
        isIE8 = $.browser.msie && parseInt($.browser.version, 10) < 9,
        CLICK = touch ? "touchend" : "click",
        MIN = "min",
        LEFT = "left",
        SLIDE = "slide",
        MONTH = "month",
        CENTURY = "century",
        CHANGE = "change",
        NAVIGATE = "navigate",
        VALUE = "value",
        HOVER = "k-state-hover",
        DISABLED = "k-state-disabled",
        OTHERMONTH = "k-other-month",
        OTHERMONTHCLASS = ' class="' + OTHERMONTH + '"',
        TODAY = "k-nav-today",
        CELLSELECTOR = "td:has(.k-link)",
        MOUSEENTER = touch ? "touchstart" : "mouseenter",
        MOUSELEAVE = touch ? "touchend" : "mouseleave",
        MS_PER_MINUTE = 60000,
        MS_PER_DAY = 86400000,
        PREVARROW = "_prevArrow",
        NEXTARROW = "_nextArrow",
        proxy = $.proxy,
        extend = $.extend,
        DATE = Date,
        views = {
            month: 0,
            year: 1,
            decade: 2,
            century: 3
        };

    var Calendar = Widget.extend(/** @lends kendo.ui.Calendar.prototype */{
    /**
    * @constructs
    * @extends kendo.ui.Widget
    * @param {Element} element DOM element
    * @param {Object} options Configuration options.
    * @option {Date} [value] <null> Specifies the selected date.
    * _example
    * // set the selected date to Jan 1st. 2012
    * $("#calendar").kendoCalendar({
    *     value: new Date(2012, 0, 1)
    * });
    * _exampleTitle To set after initialization
    * _example
    * // get a reference to the Kendo UI calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // set the selected date on the calendar to Jan 1st, 2012
    * calendar.value(new Date(2012, 0, 1));
    * @option {Date} [min] <Date(1900, 0, 1)> Specifies the minimum date, which the calendar can show.
    * _example
    * // set the min date to Jan 1st, 2011
    * $("#calendar").kendoCalendar({
    *     min = new Date(2011, 0, 1)
    * });
    * _exampleTitle To set after initialization
    * _example
    * // get a reference to the Kendo UI calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // set the min date to Jan 1st, 2011
    * calendar.min(new Date(2011, 0, 1));
    * @option {Date} [max] <Date(2099, 11, 31)> Specifies the maximum date, which the calendar can show.
    * _example
    * $("#calendar").kendoCalendar({
    *     max = new Date(2013, 0, 1);
    * });
    * _exampleTitle To set after initialization
    * _example
    * // get a reference to the Kendo UI calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // set the max date to Jan 1st, 2013
    * calendar.max(new Date(2013, 0, 1));
    * @option {String} [footer] <> Specifies the content of the footer. If false, the footer will not be rendered.
    * _example
    * // change the footer text from the default current date
    * $("#calendar").kendoCalendar({
    *     footer = "My Custom Footer"
    * });
    * _exampleTitle Hide the footer
    * _example
    * $("#calendar").kendoCalendar({
    *     footer = false;
    * });
    * @option {String} [format] <MM/dd/yyyy> Specifies the format, which is used to parse value set with value() method.
    * _example
    * $("#calendar").kendoCalendar({
    *     format: "yyyy/MM/dd"
    * });
    * @option {String} [start] <month> Specifies the start view.
    * _example
    * $("#calendar").kendoCalendar({
    *     start: "year"
    * });
    * @option {String} [depth] Specifies the navigation depth.
    * _example
    * $("#calendar").kendoCalendar({
    *     depth: "year"
    * });
    * @option {Array} [dates] <> Specifies a list of dates, which will be passed to the month template.
    *  _example
    * $("#calendar").kendoCalendar({
    *     dates: [new Date(2000, 10, 10, 10, 0, 0), new Date(2000, 10, 10, 30, 0)] //can manipulate month template depending on this array.
    * });
    * @option {String} [footer] <> Template to be used for rendering the footer. If false, the footer will not be rendered.
    * _example
    *
    *  //calendar intialization
    *  <script>
    *      $("#calendar").kendoCalendar({
    *          footer: kendo.template("Today - #=kendo.toString(data, 'd') #")
    *      });
    *  </script>
    * @option {Object} [month] <> Templates for the cells rendered in the "month" view.
    * @option {String} [month.content] <> Template to be used for rendering the cells in the "month" view, which are in range.
    * _example
    *  //template
    * <script id="cellTemplate" type="text/x-kendo-tmpl">
    *      <div class="${ data.value < 10 ? exhibition : party }">
    *      </div>
    *      ${ data.value }
    *  </script>
    *
    *  //calendar intialization
    *  <script>
    *      $("#calendar").kendoCalendar({
    *          month: {
    *             content:  $("#cellTemplate").html(),
    *          }
    *      });
    *  </script>
    * @option {String} [month.empty] <> Template to be used for rendering the cells in the "month" view, which are not in the min/max range.
    * @option {String} [culture] <en-US> Specifies the culture info used by the widget.
    * _example
    *
    * // specify on widget initialization
    * $("#calendar").kendoCalendar({
    *     culture: "de-DE"
    * });
    */
    init: function (element, options) {
        var that = this, value;

        Widget.fn.init.call(that, element, options);

        element = that.wrapper = that.element;
        options = that.options;

        options.url = window.unescape(options.url);

        element.addClass("k-widget k-calendar");

        that._templates();

        that._header();

        that._footer(that.footer);

        element
                .delegate(CELLSELECTOR, MOUSEENTER + " " + MOUSELEAVE, mousetoggle)
                .delegate(CELLSELECTOR, CLICK, proxy(that._click, that));

        value = options.value;
        normalize(options);

        that._index = views[options.start];
        that._current = new DATE(restrictValue(value, options.min, options.max));

        that.value(value);

        kendo.notify(that);
    },

    options: {
        name: "Calendar",
        value: null,
        min: new DATE(1900, 0, 1),
        max: new DATE(2099, 11, 31),
        dates: [],
        url: "",
        culture: "",
        footer: "",
        format: "",
        month: {},
        start: MONTH,
        depth: MONTH,
        animation: {
            horizontal: {
                effects: SLIDE,
                duration: 500,
                divisor: 2
            },
            vertical: {
                effects: "zoomIn",
                duration: 400
            }
        }
    },

    events: [
    /**
    * Fires when the selected date is changed
    * @name kendo.ui.Calendar#change
    * @event
    * @param {Event} e
    * @example
    * $("#calendar").kendoCalendar({
    *     change: function(e) {
    *         // handle event
    *     });
    * });
    * @exampleTitle To set after initialization
    * @example
    * // get a reference to the Kendo UI calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // bind to the change event
    * calendar.bind("change", function(e) {
    *      // handle event
    * });
    */
    /**
    * Fires when navigate
    * @name kendo.ui.Calendar#navigate
    * @event
    * @param {Event} e
    * @example
    * $("#calendar").kendoCalendar({
    *     navigate: function(e) {
    *          // handle event
    *     }
    * });
    * @exampleTitle To set after initialization
    * @example
    * // get a reference to the Kendo UI calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // bind to the change event
    * calendar.bind("navigate", function(e) {
    *      // handle event
    * });
    */
            CHANGE,
            NAVIGATE
        ],

    setOptions: function (options) {
        normalize(options);

        Widget.fn.setOptions.call(this, options);
    },

    /**
    * Gets/Sets the min value of the calendar.
    * @param {Date|String} value The min date to set.
    * @returns {Date} The min value of the calendar.
    * @example
    * // get a reference to the calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    *
    * // get the min value of the calendar.
    * var min = calendar.min();
    *
    * // set the min value of the calendar.
    * calendar.min(new Date(1900, 0, 1));
    */
    min: function (value) {
        return this._option(MIN, value);
    },

    /**
    * Gets/Sets the max value of the calendar.
    * @param {Date | String} value The max date to set.
    * @returns {Date} The max value of the calendar.
    * @example
    * // get a reference to the calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    *
    * // get the max value of the calendar.
    * var max = calendar.max();
    *
    * // set the max value of the calendar.
    * calendar.max(new Date(2100, 0, 1));
    */
    max: function (value) {
        return this._option("max", value);
    },

    /**
    * Navigates to the past
    * @example
    * // get a reference to the calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // navigate to past
    * calendar.navigateToPast();
    */
    navigateToPast: function () {
        this._navigate(PREVARROW, -1);
    },

    /**
    * Navigates to the future
    * @example
    * // get a reference to the calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // navigate to future
    * calendar.navigateToFuture();
    */
    navigateToFuture: function () {
        this._navigate(NEXTARROW, 1);
    },

    /**
    * Navigates to the upper view
    * @example
    * // get a reference to the calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // navigate up
    * calendar.navigateUp();
    */
    navigateUp: function () {
        var that = this,
                index = that._index;

        if (that._title.hasClass(DISABLED)) {
            return;
        }

        that.navigate(that._current, ++index);
    },

    /**
    * Navigates to the lower view
    * @param {Date} value Desired date
    * @example
    * // get a reference to the calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // navigate down
    * calendar.navigateDown(value);
    */
    navigateDown: function (value) {
        var that = this,
            index = that._index,
            depth = that.options.depth;

        if (!value) {
            return;
        }

        if (index === views[depth]) {
            if (+that._value != +value) {
                that.value(value);
                that.trigger(CHANGE);
            }
            return;
        }

        that.navigate(value, --index);
    },

    /**
    * Navigates to view
    * @param {Date} value Desired date
    * @param {String} view Desired view
    * @example
    * // get a reference to the calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    * // navigate to the desired date
    * calendar.navigate(value, view);
    */
    navigate: function (value, view) {
        view = isNaN(view) ? views[view] : view;

        var that = this,
                options = that.options,
                culture = options.culture,
                min = options.min,
                max = options.max,
                title = that._title,
                from = that._table,
                selectedValue = that._value,
                currentValue = that._current,
                future = value && +value > +currentValue,
                vertical = view !== undefined && view !== that._index,
                to, currentView, compare;

        if (!value) {
            value = currentValue;
        } else {
            that._current = value = new DATE(restrictValue(value, min, max));
        }

        if (view === undefined) {
            view = that._index;
        } else {
            that._index = view;
        }

        that._view = currentView = calendar.views[view];
        compare = currentView.compare;

        title.toggleClass(DISABLED, view === views[CENTURY]);
        that[PREVARROW].toggleClass(DISABLED, compare(value, min) < 1);
        that[NEXTARROW].toggleClass(DISABLED, compare(value, max) > -1);

        if (!from || that._changeView) {
            title.html(currentView.title(value, culture));

            that._table = to = $(currentView.content(extend({
                min: min,
                max: max,
                date: value,
                url: options.url,
                dates: options.dates,
                format: options.format,
                culture: culture
            }, that[currentView.name])));

            makeUnselectable(to);

            that._animate({
                from: from,
                to: to,
                vertical: vertical,
                future: future
            });

            that.trigger(NAVIGATE);
        }

        if (view === views[options.depth] && selectedValue) {
            that._class("k-state-selected", currentView.toDateString(selectedValue));
        }

        that._changeView = true;
    },

    /**
    * Gets/Sets the value of the calendar.
    * @param {Date|String} value The date to set.
    * @returns {Date} The value of the calendar.
    * @example
    * // get a reference to the calendar widget
    * var calendar = $("#calendar").data("kendoCalendar");
    *
    * // get the value of the calendar.
    * var value = calendar.value();
    *
    * // set the value of the calendar.
    * calendar.value(new Date());
    */
    value: function (value) {
        var that = this,
            view = that._view,
            options = that.options,
            min = options.min,
            max = options.max;

        if (value === undefined) {
            return that._value;
        }

        value = parse(value, options.format, options.culture);

        if (value !== null) {
            value = new DATE(value);

            if (!isInRange(value, min, max)) {
                value = null;
            }
        }

        that._value = value;
        that._changeView = !value || view && view.compare(value, that._current) !== 0;

        that.navigate(value);
    },

    _animate: function (options) {
        var that = this,
                from = options.from,
                to = options.to;

        if (!from) {
            to.insertAfter(that.element[0].firstChild);
        } else if (from.parent().data("animating")) {
            from.parent().kendoStop(true, true).remove();
            from.remove();

            to.insertAfter(that.element[0].firstChild);
        } else if (!from.is(":visible") || that.options.animation === false) {
            to.insertAfter(from);
            from.remove();
        } else {
            that[options.vertical ? "_vertical" : "_horizontal"](from, to, options.future);
        }
    },

    _horizontal: function (from, to, future) {
        var that = this,
                horizontal = that.options.animation.horizontal,
                effects = horizontal.effects,
                viewWidth = from.outerWidth();

        if (effects && effects.indexOf(SLIDE) != -1) {
            from.add(to).css({ width: viewWidth });

            from.wrap("<div/>");

            from.parent()
                    .css({
                        position: "relative",
                        width: viewWidth * 2,
                        "float": LEFT,
                        left: future ? 0 : -viewWidth
                    });

            to[future ? "insertAfter" : "insertBefore"](from);

            extend(horizontal, {
                effects: SLIDE + ":" + (future ? LEFT : "right"),
                complete: function () {
                    from.remove();
                    to.unwrap();
                }
            });

            from.parent().kendoStop(true, true).kendoAnimate(horizontal);
        }
    },

    _vertical: function (from, to) {
        var that = this,
                vertical = that.options.animation.vertical,
                effects = vertical.effects,
                cell, position;

        if (effects && effects.indexOf("zoom") != -1) {
            to.css({
                position: "absolute",
                top: from.prev().outerHeight(),
                left: 0
            }).insertBefore(from);

            if (transitionOrigin) {
                cell = that._cellByDate(that._view.toDateString(that._current));
                position = cell.position();
                position = (position.left + parseInt(cell.width() / 2, 10)) + "px" + " " + (position.top + parseInt(cell.height() / 2, 10) + "px");
                to.css(transitionOrigin, position);
            }

            from.kendoStop(true, true).kendoAnimate({
                effects: "fadeOut",
                duration: 600,
                complete: function () {
                    from.remove();
                    to.css({
                        position: "static",
                        top: 0,
                        left: 0
                    });
                }
            });

            to.kendoStop(true, true).kendoAnimate(vertical);
        }
    },

    _cellByDate: function (value) {
        return this._table.find("td:not(." + OTHERMONTH + ")")
                       .filter(function () {
                           return $(this.firstChild).attr(kendo.attr(VALUE)) === value;
                       });
    },

    _class: function (className, value) {
        this._table.find("td:not(." + OTHERMONTH + ")")
                .removeClass(className)
                .filter(function () {
                    return $(this.firstChild).attr(kendo.attr(VALUE)) === value;
                })
                .addClass(className);
    },

    _click: function (e) {
        var that = this,
                options = that.options,
                currentValue = that._current,
                link = $(e.currentTarget.firstChild),
                value = link.attr(kendo.attr(VALUE)).split("/");

        //Safari cannot create corretly date from "1/1/2090"
        value = new DATE(value[0], value[1], value[2]);

        if (link[0].href.indexOf("#") != -1) {
            e.preventDefault();
        }

        if (link.parent().hasClass(OTHERMONTH)) {
            currentValue = value;
        } else {
            that._view.setDate(currentValue, value);
        }

        that.navigateDown(restrictValue(currentValue, options.min, options.max));
    },

    _focus: function (value) {
        var that = this,
                view = that._view;

        if (view.compare(value, that._current) !== 0) {
            that.navigate(value);
        } else {
            that._current = value;
        }

        that._class("k-state-focused", view.toDateString(value));
    },

    _footer: function (template) {
        var that = this,
                element = that.element,
                today = new DATE(),
                footer = element.find(".k-footer");

        if (!template) {
            that._toggle(false);
            footer.hide();
            return;
        }

        if (!footer[0]) {
            footer = $('<div class="k-footer"><a href="#" class="k-link k-nav-today"></a></div>').appendTo(element);
        }

        that._today = footer.show()
                                .find(".k-link")
                                .html(template(today))
                                .attr("title", kendo.toString(today, "D", that.options.culture));

        that._toggle();
    },

    _header: function () {
        var that = this,
            element = that.element,
            links;

        if (!element.find(".k-header")[0]) {
            element.html('<div class="k-header">' +
                             '<a href="#" class="k-link k-nav-prev"><span class="k-icon k-i-arrow-w"></span></a>' +
                             '<a href="#" class="k-link k-nav-fast"></a>' +
                             '<a href="#" class="k-link k-nav-next"><span class="k-icon k-i-arrow-e"></span></a>' +
                             '</div>');
        }

        links = element.find(".k-link")
                           .bind(MOUSEENTER + " " + MOUSELEAVE, mousetoggle)
                           .click(false);

        that._title = links.eq(1).bind(CLICK, proxy(that.navigateUp, that));
        that[PREVARROW] = links.eq(0).bind(CLICK, proxy(that.navigateToPast, that));
        that[NEXTARROW] = links.eq(2).bind(CLICK, proxy(that.navigateToFuture, that));
    },

    _navigate: function (arrow, modifier) {
        var that = this,
                index = that._index + 1,
                currentValue = new DATE(that._current);

        arrow = that[arrow];

        if (!arrow.hasClass(DISABLED)) {
            if (index > 3) {
                currentValue.setFullYear(currentValue.getFullYear() + 100 * modifier);
            } else {
                calendar.views[index].setDate(currentValue, modifier);
            }

            that.navigate(currentValue);
        }
    },

    _option: function (option, value) {
        var that = this,
                options = that.options,
                selectedValue = +that._value,
                bigger, navigate;

        if (value === undefined) {
            return options[option];
        }

        value = parse(value, options.format, options.culture);

        if (!value) {
            return;
        }

        options[option] = new DATE(value);

        navigate = that._view.compare(value, that._current);

        if (option === MIN) {
            bigger = +value > selectedValue;
            navigate = navigate > -1;
        } else {
            bigger = selectedValue > +value;
            navigate = navigate < 1;
        }

        if (bigger) {
            that.value(null);
        } else if (navigate) {
            that.navigate();
        }

        that._toggle();
    },

    _toggle: function (toggle) {
        var that = this,
                options = that.options,
                link = that._today;

        if (toggle === undefined) {
            toggle = isInRange(new DATE(), options.min, options.max);
        }

        if (link) {
            link.unbind(CLICK);

            if (toggle) {
                link.addClass(TODAY)
                        .removeClass(DISABLED)
                        .bind(CLICK, proxy(that._todayClick, that));
            } else {
                link.removeClass(TODAY)
                        .addClass(DISABLED)
                        .bind(CLICK, prevent);
            }
        }
    },

    _todayClick: function (e) {
        var that = this,
                depth = views[that.options.depth],
                today = new DATE();

        e.preventDefault();

        if (that._view.compare(that._current, today) === 0 && that._index == depth) {
            that._changeView = false;
        }

        that._value = today;
        that.navigate(today, depth);

        that.trigger(CHANGE);
    },

    _templates: function () {
        var that = this,
                options = that.options,
                footer = options.footer,
                month = options.month,
                content = month.content,
                empty = month.empty;

        that.month = {
            content: template('<td#=data.cssClass#><a class="k-link#=data.linkClass#" href="#=data.url#" ' + kendo.attr("value") + '="#=data.dateString#" title="#=data.title#">' + (content || "#=data.value#") + '</a></td>', { useWithBlock: !!content }),
            empty: template("<td>" + (empty || "&nbsp;") + "</td>", { useWithBlock: !!empty })
        };

        if (footer !== false) {
            that.footer = template(footer || '#= kendo.toString(data,"D","' + options.culture + '") #', { useWithBlock: false });
        }
    }
});

ui.plugin(Calendar);

var calendar = {
    firstDayOfMonth: function (date) {
        return new DATE(
                date.getFullYear(),
                date.getMonth(),
                1
            );
    },

    firstVisibleDay: function (date, calendarInfo) {
        calendarInfo = calendarInfo || kendo.culture().calendar;

        var firstDay = calendarInfo.firstDay,
            firstVisibleDay = new DATE(date.getFullYear(), date.getMonth(), 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

        while (firstVisibleDay.getDay() != firstDay) {
            calendar.setTime(firstVisibleDay, -1 * MS_PER_DAY);
        }

        return firstVisibleDay;
    },

    setTime: function (date, time) {
        var tzOffsetBefore = date.getTimezoneOffset(),
            resultDATE = new DATE(date.getTime() + time),
            tzOffsetDiff = resultDATE.getTimezoneOffset() - tzOffsetBefore;

        date.setTime(resultDATE.getTime() + tzOffsetDiff * MS_PER_MINUTE);
    },
    views: [{
        name: MONTH,
        title: function (date, culture) {
            return getCalendarInfo(culture).months.names[date.getMonth()] + " " + date.getFullYear();
        },
        content: function (options) {
            var that = this,
                idx = 0,
                min = options.min,
                max = options.max,
                date = options.date,
                dates = options.dates,
                format = options.format,
                culture = options.culture,
                navigateUrl = options.url,
                hasUrl = navigateUrl && dates[0],
                currentCalendar = getCalendarInfo(culture),
                firstDayIdx = currentCalendar.firstDay,
                days = currentCalendar.days,
                names = shiftArray(days.names, firstDayIdx),
                short = shiftArray(days.namesShort, firstDayIdx),
                start = calendar.firstVisibleDay(date, currentCalendar),
                firstDayOfMonth = that.first(date),
                lastDayOfMonth = that.last(date),
                toDateString = that.toDateString,
                today = new DATE(),
                html = '<table class="k-content" cellspacing="0"><thead><tr>';

            for (; idx < 7; idx++) {
                html += '<th scope="col" title="' + names[idx] + '">' + short[idx] + '</th>';
            }

            today = +new DATE(today.getFullYear(), today.getMonth(), today.getDate());

            return view({
                cells: 42,
                perRow: 7,
                html: html += "</tr></thead><tbody><tr>",
                start: new DATE(start.getFullYear(), start.getMonth(), start.getDate()),
                min: new DATE(min.getFullYear(), min.getMonth(), min.getDate()),
                max: new DATE(max.getFullYear(), max.getMonth(), max.getDate()),
                content: options.content,
                empty: options.empty,
                setter: that.setDate,
                build: function (date, idx) {
                    var cssClass = [],
                            day = date.getDay(),
                            linkClass = "",
                            url = "#";

                    if (date < firstDayOfMonth || date > lastDayOfMonth) {
                        cssClass.push(OTHERMONTH);
                    }

                    if (+date === today) {
                        cssClass.push("k-today");
                    }

                    if (day === 0 || day === 6) {
                        cssClass.push("k-weekend");
                    }

                    if (hasUrl && inArray(+date, dates)) {
                        url = navigateUrl.replace("{0}", kendo.toString(date, format, culture));
                        linkClass = " k-action-link";
                    }

                    return {
                        date: date,
                        dates: dates,
                        ns: kendo.ns,
                        title: kendo.toString(date, "D", culture),
                        value: date.getDate(),
                        dateString: toDateString(date),
                        cssClass: cssClass[0] ? ' class="' + cssClass.join(" ") + '"' : "",
                        linkClass: linkClass,
                        url: url
                    };
                }
            });
        },
        first: function (date) {
            return calendar.firstDayOfMonth(date);
        },
        last: function (date) {
            return new DATE(date.getFullYear(), date.getMonth() + 1, 0);
        },
        compare: function (date1, date2) {
            var result,
                month1 = date1.getMonth(),
                year1 = date1.getFullYear(),
                month2 = date2.getMonth(),
                year2 = date2.getFullYear();

            if (year1 > year2) {
                result = 1;
            } else if (year1 < year2) {
                result = -1;
            } else {
                result = month1 == month2 ? 0 : month1 > month2 ? 1 : -1;
            }

            return result;
        },
        setDate: function (date, value) {
            if (value instanceof DATE) {
                date.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
            } else {
                calendar.setTime(date, value * MS_PER_DAY);
            }
        },
        toDateString: function (date) {
            return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
        }
    },
        {
            name: "year",
            title: function (date) {
                return date.getFullYear();
            },
            content: function (options) {
                var namesAbbr = getCalendarInfo(options.culture).months.namesAbbr,
                toDateString = this.toDateString,
                min = options.min,
                max = options.max;

                return view({
                    min: new DATE(min.getFullYear(), min.getMonth(), 1),
                    max: new DATE(max.getFullYear(), max.getMonth(), 1),
                    start: new DATE(options.date.getFullYear(), 0, 1),
                    setter: this.setDate,
                    build: function (date) {
                        return {
                            value: namesAbbr[date.getMonth()],
                            ns: kendo.ns,
                            dateString: toDateString(date),
                            cssClass: ""
                        };
                    }
                });
            },
            first: function (date) {
                return new DATE(date.getFullYear(), 0, date.getDate());
            },
            last: function (date) {
                return new DATE(date.getFullYear(), 11, date.getDate());
            },
            compare: function (date1, date2) {
                return compare(date1, date2);
            },
            setDate: function (date, value) {
                if (value instanceof DATE) {
                    date.setFullYear(value.getFullYear(),
                    value.getMonth(),
                    date.getDate());
                } else {
                    var month = date.getMonth() + value;

                    date.setMonth(month);

                    if (month > 11) {
                        month -= 12;
                    }

                    if (month > 0 && date.getMonth() != month) {
                        date.setDate(0);
                    }
                }
            },
            toDateString: function (date) {
                return date.getFullYear() + "/" + date.getMonth() + "/1";
            }
        },
        {
            name: "decade",
            title: function (date) {
                var start = date.getFullYear();

                start = start - start % 10;

                return start + "-" + (start + 9);
            },
            content: function (options) {
                var year = options.date.getFullYear(),
                toDateString = this.toDateString;

                return view({
                    start: new DATE(year - year % 10 - 1, 0, 1),
                    min: new DATE(options.min.getFullYear(), 0, 1),
                    max: new DATE(options.max.getFullYear(), 0, 1),
                    setter: this.setDate,
                    build: function (date, idx) {
                        return {
                            value: date.getFullYear(),
                            ns: kendo.ns,
                            dateString: toDateString(date),
                            cssClass: idx === 0 || idx == 11 ? OTHERMONTHCLASS : ""
                        };
                    }
                });
            },
            first: function (date) {
                var year = date.getFullYear();
                return new DATE(year - year % 10, date.getMonth(), date.getDate());
            },
            last: function (date) {
                var year = date.getFullYear();
                return new DATE(year - year % 10 + 9, date.getMonth(), date.getDate());
            },
            compare: function (date1, date2) {
                return compare(date1, date2, 10);
            },
            setDate: function (date, value) {
                setDate(date, value, 1);
            },
            toDateString: function (date) {
                return date.getFullYear() + "/0/1";
            }
        },
        {
            name: CENTURY,
            title: function (date) {
                var start = date.getFullYear();

                start = start - start % 100;

                return start + "-" + (start + 99);
            },
            content: function (options) {
                var year = options.date.getFullYear(),
                minYear = options.min.getFullYear(),
                maxYear = options.max.getFullYear(),
                toDateString = this.toDateString;

                minYear = minYear - minYear % 10;
                maxYear = maxYear - maxYear % 10;

                if (maxYear - minYear < 10) {
                    maxYear = minYear + 9;
                }

                return view({
                    start: new DATE(year - year % 100 - 10, 0, 1),
                    min: new DATE(minYear, 0, 1),
                    max: new DATE(maxYear, 0, 1),
                    setter: this.setDate,
                    build: function (date, idx) {
                        var year = date.getFullYear();
                        return {
                            value: year + " - " + (year + 9),
                            ns: kendo.ns,
                            dateString: toDateString(date),
                            cssClass: idx === 0 || idx == 11 ? OTHERMONTHCLASS : ""
                        };
                    }
                });
            },
            first: function (date) {
                var year = date.getFullYear();
                return new DATE(year - year % 100, date.getMonth(), date.getDate());
            },
            last: function (date) {
                var year = date.getFullYear();
                return new DATE(year - year % 100 + 99, date.getMonth(), date.getDate());
            },
            compare: function (date1, date2) {
                return compare(date1, date2, 100);
            },
            setDate: function (date, value) {
                setDate(date, value, 10);
            },
            toDateString: function (date) {
                var year = date.getFullYear();
                return (year - year % 10) + "/0/1";
            }
        }]
};

function view(options) {
    var idx = 0,
            data,
            min = options.min,
            max = options.max,
            start = options.start,
            setter = options.setter,
            build = options.build,
            length = options.cells || 12,
            cellsPerRow = options.perRow || 4,
            content = options.content || cellTemplate,
            empty = options.empty || emptyCellTemplate,
            html = options.html || '<table class="k-content k-meta-view" cellspacing="0"><tbody><tr>';

    for (; idx < length; idx++) {
        if (idx > 0 && idx % cellsPerRow === 0) {
            html += "</tr><tr>";
        }

        data = build(start, idx);

        html += isInRange(start, min, max) ? content(data) : empty(data);

        setter(start, 1);
    }

    return html + "</tr></tbody></table>";
}

function compare(date1, date2, modifier) {
    var year1 = date1.getFullYear(),
            start = date2.getFullYear(),
            end = start,
            result = 0;

    if (modifier) {
        start = start - start % modifier;
        end = start - start % modifier + modifier - 1;
    }

    if (year1 > end) {
        result = 1;
    } else if (year1 < start) {
        result = -1;
    }

    return result;
}

function restrictValue(value, min, max) {
    var today = new DATE();

    today = new DATE(today.getFullYear(), today.getMonth(), today.getDate());

    if (value) {
        today = new DATE(value);
    }

    if (min > today) {
        today = new DATE(min);
    } else if (max < today) {
        today = new DATE(max);
    }
    return today;
}

function isInRange(date, min, max) {
    return +date >= +min && +date <= +max;
}

function shiftArray(array, idx) {
    return array.slice(idx).concat(array.slice(0, idx));
}

function setDate(date, value, multiplier) {
    value = value instanceof DATE ? value.getFullYear() : date.getFullYear() + multiplier * value;
    date.setFullYear(value);
}

function mousetoggle(e) {
    e.stopImmediatePropagation();
    $(this).toggleClass(HOVER, e.type == "mouseenter");
}

function prevent(e) {
    e.preventDefault();
}

function getCalendarInfo(culture) {
    return getCulture(culture).calendars.standard;
}

function normalize(options) {
    var start = views[options.start],
            depth = views[options.depth],
            culture = getCulture(options.culture);

    options.format = extractFormat(options.format || culture.calendars.standard.patterns.d);

    if (isNaN(start)) {
        start = 0;
        options.start = MONTH;
    }

    if (depth === undefined || depth > start) {
        options.depth = MONTH;
    }
}

function makeUnselectable(element) {
    if (isIE8) {
        element.find("*").attr("unselectable", "on");
    }
}

function inArray(date, dates) {
    for (var i = 0, length = dates.length; i < length; i++) {
        if (date === +dates[i]) {
            return true;
        }
    }
    return false;
}

function isEqualDatePart(value1, value2) {
    if (value1) {
        return value1.getFullYear() === value2.getFullYear() &&
                   value1.getMonth() === value2.getMonth() &&
                   value1.getDate() === value2.getDate();
    }

    return false;
}

calendar.isEqualDatePart = isEqualDatePart;
calendar.makeUnselectable = makeUnselectable;
calendar.restrictValue = restrictValue;
calendar.isInRange = isInRange;
calendar.normalize = normalize;
calendar.viewsEnum = views;

kendo.calendar = calendar;
})(jQuery);
;


/*
* Kendo UI Web v2012.2.710 (http://kendoui.com)
* Copyright 2012 Telerik AD. All rights reserved.
*
* Kendo UI Web commercial licenses may be obtained at http://kendoui.com/web-license
* If you do not own a commercial license, this file shall be governed by the
* GNU General Public License (GPL) version 3.
* For GPL requirements, please review: http://www.gnu.org/copyleft/gpl.html
*/
(function($, undefined) {
    /**
     * @name kendo.ui.DatePicker.Description
     *
     * @section
     * <p>
     *  The <b>DatePicker</b> allows the end user to select a date from a
     *  calendar or by direct input. It supports custom templates for "month"
     *  view, configurable options for min and max date, start view and the
     *  depth of the navigation.
     * </p>
     * <h3>Getting Started</h3>
     *
     * @exampleTitle Creating a DatePicker from existing input element
     * @example
     * <input id="datePicker" />
     *
     * @exampleTitle DatePicker initialization
     * @example
     * $(document).ready(function(){
     *  $("#datePicker").kendoDatePicker();
     * });
     *
     * @section
     * <p>
     *  When a <b>DatePicker</b> is initialized, it will be displayed at the
     *  location of the target HTML element.
     * </p>
     * <h3>Configuring DatePicker Behaviors</h3>
     * <p>
     *  The <b>DatePicker</b> provides configuration options that can be set
     *  during initialization. Among the properties that can be controlled:
     * </p>
     * <ul>
     *  <li>Selected date</li>
     *  <li>Minimum and/or maximum date</li>
     *  <li>Define format</li>
     *  <li>Start view</li>
     *  <li>Navigation depth (last view to which end user can navigate)</li>
     * </ul>
     *
     * @exampleTitle Create DatePicker with a selected date and a defined
     * minimum and maximum date
     * @example
     * $(document).ready(function(){
     *  $("#datePicker").kendoDatePicker({
     *   value: new Date(),
     *   min: new Date(1950, 0, 1),
     *   max: new Date(2049, 11, 31)
     *  })
     * });
     *
     * @section
     * <p>
     *  DatePicker will set the value only if the entered date is valid and
     *  within the defined range.
     * </p>
     * @section
     * <h3>Defining a Start View and Navigation Depth</h3>
     * <p>
     *  The first rendered view can be defined with "start" option.
     *  Navigation depth can be controlled with "depth" option. Predefined
     *  views are:
     * </p>
     * <ul>
     *  <li>"month" - shows the days from the month</li>
     *  <li>"year" - shows the months of the year</li>
     *  <li>"decade" - shows the years from the decade</li>
     *  <li>"century" - shows the decades from the century</li>
     * </ul>
     *
     * @exampleTitle Create a DatePicker for selecting a month
     * @example
     * $("#datePicker").kendoDatePicker({
     *  start: "year",
     *  depth: "year"
     * });
     *
     * @section
     * <h3>Accessing an Existing DatePicker</h3>
     * <p>
     *  You can reference an existing <b>DatePicker</b> instance via
     *  <a href="http://api.jquery.com/jQuery.data/">jQuery.data()</a>.
     *  Once a reference has been established, you can use the API to control
     *  its behavior.
     * </p>
     *
     * @exampleTitle Accessing an existing DatePicker instance
     * @example
     * var datePicker = $("#datePicker").data("kendoDatePicker");
     *
     */
    var kendo = window.kendo,
    ui = kendo.ui,
    touch = kendo.support.touch,
    Widget = ui.Widget,
    parse = kendo.parseDate,
    keys = kendo.keys,
    template = kendo.template,
    DIV = "<div />",
    SPAN = "<span />",
    CLICK = (touch ? "touchend" : "click"),
    CLICK_DATEPICKER = CLICK + ".datepicker",
    OPEN = "open",
    CLOSE = "close",
    CHANGE = "change",
    NAVIGATE = "navigate",
    DATEVIEW = "dateView",
    DISABLED = "disabled",
    DEFAULT = "k-state-default",
    FOCUSED = "k-state-focused",
    SELECTED = "k-state-selected",
    STATEDISABLED = "k-state-disabled",
    HOVER = "k-state-hover",
    HOVEREVENTS = "mouseenter mouseleave",
    MOUSEDOWN = (touch ? "touchstart" : "mousedown"),
    MIN = "min",
    MAX = "max",
    MONTH = "month",
    FIRST = "first",
    calendar = kendo.calendar,
    isInRange = calendar.isInRange,
    restrictValue = calendar.restrictValue,
    isEqualDatePart = calendar.isEqualDatePart,
    extend = $.extend,
    proxy = $.proxy,
    DATE = Date;

    function normalize(options) {
        var parseFormats = options.parseFormats;

        calendar.normalize(options);

        parseFormats = $.isArray(parseFormats) ? parseFormats : [parseFormats];
        parseFormats.splice(0, 0, options.format);

        options.parseFormats = parseFormats;
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    var DateView = function(options) {
        var that = this,
            body = document.body,
            sharedCalendar = DatePicker.sharedCalendar;

        if (!sharedCalendar) {
            sharedCalendar = DatePicker.sharedCalendar = new ui.Calendar($(DIV).hide().appendTo(body));
            calendar.makeUnselectable(sharedCalendar.element);
        }

        that.calendar = sharedCalendar;
        that.options = options = options || {};
        that.popup = new ui.Popup($(DIV).addClass("k-calendar-container").appendTo(body), extend(options.popup, options, { name: "Popup" }));

        that._templates();

        that.value(options.value);
    };

    DateView.prototype = {
        _calendar: function() {
            var that = this,
                popup = that.popup,
                options = that.options,
                calendar = that.calendar,
                element = calendar.element;

            if (element.data(DATEVIEW) !== that) {

                element.appendTo(popup.element)
                       .data(DATEVIEW, that)
                       .undelegate(CLICK_DATEPICKER)
                       .delegate("td:has(.k-link)", CLICK_DATEPICKER, proxy(that._click, that))
                       .unbind(MOUSEDOWN)
                       .bind(MOUSEDOWN, preventDefault)
                       .show();

                calendar.unbind(CHANGE)
                        .bind(CHANGE, options);

                if (!touch) {
                    calendar.unbind(NAVIGATE)
                            .bind(NAVIGATE, proxy(that._navigate, that));
                }

                calendar.month = that.month;
                calendar.options.depth = options.depth;
                calendar.options.culture = options.culture;

                calendar._footer(that.footer);

                calendar.min(options.min);
                calendar.max(options.max);

                calendar.navigate(that._value, options.start);
                that.value(that._value);
            }
        },

        open: function() {
            var that = this;

            that._calendar();
            that.popup.open();
        },

        close: function() {
            this.popup.close();
        },

        min: function(value) {
            this._option(MIN, value);
        },

        max: function(value) {
            this._option(MAX, value);
        },

        toggle: function() {
            var that = this;

            that[that.popup.visible() ? CLOSE : OPEN]();
        },

        move: function(e) {
            var that = this,
                options = that.options,
                currentValue = new DATE(that._current),
                calendar = that.calendar,
                index = calendar._index,
                view = calendar._view,
                key = e.keyCode,
                value, prevent, method;

            if (key == keys.ESC) {
                that.close();
                return;
            }

            if (e.altKey) {
                if (key == keys.DOWN) {
                    that.open();
                    prevent = true;
                } else if (key == keys.UP) {
                    that.close();
                    prevent = true;
                }
                return;
            }

            if (!that.popup.visible() || calendar._table.parent().data("animating")) {
                return;
            }

            if (e.ctrlKey) {
                if (key == keys.RIGHT) {
                    calendar.navigateToFuture();
                    prevent = true;
                } else if (key == keys.LEFT) {
                    calendar.navigateToPast();
                    prevent = true;
                } else if (key == keys.UP) {
                    calendar.navigateUp();
                    prevent = true;
                } else if (key == keys.DOWN) {
                    that._navigateDown();
                    prevent = true;
                }
            } else {
                if (key == keys.RIGHT) {
                    value = 1;
                    prevent = true;
                } else if (key == keys.LEFT) {
                    value = -1;
                    prevent = true;
                } else if (key == keys.UP) {
                    value = index === 0 ? -7 : -4;
                    prevent = true;
                } else if (key == keys.DOWN) {
                    value = index === 0 ? 7 : 4;
                    prevent = true;
                } else if (key == keys.ENTER) {
                    that._navigateDown();
                    prevent = true;
                } else if (key == keys.HOME || key == keys.END) {
                    method = key == keys.HOME ? FIRST : "last";
                    currentValue = view[method](currentValue);
                    prevent = true;
                } else if (key == keys.PAGEUP) {
                    prevent = true;
                    calendar.navigateToPast();
                } else if (key == keys.PAGEDOWN) {
                    prevent = true;
                    calendar.navigateToFuture();
                }

                if (value || method) {
                    if (!method) {
                        view.setDate(currentValue, value);
                    }

                    that._current = currentValue = restrictValue(currentValue, options.min, options.max);
                    calendar._focus(currentValue);
                }
            }

            if (prevent) {
                e.preventDefault();
            }
        },

        value: function(value) {
            var that = this,
                calendar = that.calendar,
                options = that.options;

            that._value = value;
            that._current = new DATE(restrictValue(value, options.min, options.max));

            if (calendar.element.data(DATEVIEW) === that) {
                calendar._focus(that._current);
                calendar.value(value);
            }
        },

        _click: function(e) {
            if (e.currentTarget.className.indexOf(SELECTED) !== -1) {
                this.close();
            }
        },

        _navigate: function() {
            var that = this,
                calendar = that.calendar;

            that._current = new DATE(calendar._current);
            calendar._focus(calendar._current);
        },

        _navigateDown: function() {
            var that = this,
                calendar = that.calendar,
                currentValue = calendar._current,
                cell = calendar._table.find("." + FOCUSED),
                value = cell.children(":" + FIRST).attr(kendo.attr("value")).split("/");

            //Safari cannot create corretly date from "1/1/2090"
            value = new DATE(value[0], value[1], value[2]);

            if (!cell[0] || cell.hasClass(SELECTED)) {
                that.close();
                return;
            }

            calendar._view.setDate(currentValue, value);
            calendar.navigateDown(currentValue);
        },

        _option: function(option, value) {
            var that = this,
                options = that.options,
                calendar = that.calendar;

            options[option] = value;

            if (calendar.element.data(DATEVIEW) === that) {
                calendar[option](value);
            }
        },

        _templates: function() {
            var that = this,
                options = that.options,
                footer = options.footer,
                month = options.month || {},
                content = month.content,
                empty = month.empty;

            that.month = {
                content: template('<td#=data.cssClass#><a class="k-link" href="\\#" ' + kendo.attr("value") + '="#=data.dateString#" title="#=data.title#">' + (content || "#=data.value#") + '</a></td>', { useWithBlock: !!content }),
                empty: template("<td>" + (empty || "&nbsp;") + "</td>", { useWithBlock: !!empty })
            };

            if (footer !== false) {
                that.footer = template(footer || '#= kendo.toString(data,"D","' + options.culture +'") #', { useWithBlock: false });
            }
        }
    };

    DateView.normalize = normalize;

    kendo.DateView = DateView;

    var DatePicker = Widget.extend(/** @lends kendo.ui.DatePicker.prototype */{
        /**
         * @constructs
         * @extends kendo.ui.Widget
         * @param {Element} element DOM element
         * @param {Object} options Configuration options.
         * @option {Date} [value] <null> Specifies the selected date.
         * _example
         * // set the selected value to January 1st, 2011
         * $("#datePicker").kendoDatePicker({
         *  value: new Date(2011, 0, 1)
         * });
         * _exampleTitle To set after initialization
         * _example
         * // get a reference to the datePicker widget
         * var datePicker = $("#datePicker").data("kendoDatePicker");
         * // set the selected date on the datePicker to January 1st, 2011
         * datePicker.value(new Date(2011, 0, 1));
         * @option {Date} [min] <Date(1900, 0, 1)> Specifies the minimum date that the calendar can show.
         * _example
         * // set the min date to Jan 1st, 2011
         * $("#datePicker").kendoDatePicker({
         *  min: new Date(2011, 0, 1)
         * });
         * _exampleTitle To set after initialization
         * _example
         * // get a reference to the datePicker widget
         * var datePicker = $("#datePicker").data("kendoDatePicker");
         * // set the min date to Jan 1st, 2011
         * datePicker.min(new Date(2011, 0, 1));
         * @option {Date} [max] <Date(2099, 11, 31)> Specifies the maximum date, which the calendar can show.
         * _example
         * $("#datePicker").kendoDatePicker({
         *  max: new Date(2013, 0, 1) // sets max date to Jan 1st, 2013
         * });
         * _exampleTitle To set after initialization
         * _example
         * var datePicker = $("#datePicker").data("kendoDatePicker");
         * // set the max date to Jan 1st, 2013
         * datePicker.max(new Date(2013,0, 1));
         * @option {String} [format] <MM/dd/yyyy> Specifies the format, which is used to format the value of the DatePicker displayed in the input.
         * _example
         * $("#datePicker").kendoDatePicker({
         *     format: "yyyy/MM/dd"
         * });
         * @option {Array} [parseFormats] <> Specifies the formats, which are used to parse the value set with value() method or by direct input. If not set the value of the format will be used.
         * _example
         * $("#datePicker").kendoDatePicker({
         *     format: "yyyy/MM/dd",
         *     parseFormats: ["MMMM yyyy"] //format also will be added to parseFormats
         * });
         * @option {String} [start] <month> Specifies the start view.
         * The following settings are available for the <b>start</b> value:
         * <div class="details-list">
         *    <dl>
         *         <dt>
         *              <code>"month"</code>
         *         </dt>
         *         <dd>
         *             shows the days of the month
         *         </dd>
         *         <dt>
         *              <code>"year"</code>
         *         </dt>
         *         <dd>
         *              shows the months of the year
         *         </dd>
         *         <dt>
         *              <code>"decade"</code>
         *         </dt>
         *         <dd>
         *              shows the years of the decade
         *         </dd>
         *         <dt>
         *              <code>"century"</code>
         *         </dt>
         *         <dd>
         *              shows the decades from the centery
         *         </dd>
         *    </dl>
         * </div>
         * _example
         * $("#datePicker").kendoDatePicker({
         *     start: "decade" // the datePicker will start with a decade display
         * });
         * @option {String} [depth] Specifies the navigation depth. The following
         * settings are available for the <b>depth</b> value:
         * <div class="details-list">
         *    <dl>
         *         <dt>
         *              <code>"month"</code>
         *         </dt>
         *         <dd>
         *             shows the days of the month
         *         </dd>
         *         <dt>
         *              <code>"year"</code>
         *         </dt>
         *         <dd>
         *              shows the months of the year
         *         </dd>
         *         <dt>
         *              <code>"decade"</code>
         *         </dt>
         *         <dd>
         *              shows the years of the decade
         *         </dd>
         *         <dt>
         *              <code>"century"</code>
         *         </dt>
         *         <dd>
         *              shows the decades from the centery
         *         </dd>
         *    </dl>
         * </div>
         * _example
         * $("#datePicker").kendoDatePicker({
         *     start: "decade",
         *     depth: "year" // the datePicker will only go to the year level
         * });
         * @option {String} [footer] <> Template to be used for rendering the footer of the calendar.
         * _example
         *  // DatePicker initialization
         *  <script>
         *      $("#datePicker").kendoDatePicker({
         *          footer: kendo.template("Today - #=kendo.toString(data, 'd') #")
         *      });
         *  </script>
         * @option {Object} [month] <> Templates for the cells rendered in the calendar "month" view.
         * @option {String} [month.content] <> Template to be used for rendering the cells in the calendar "month" view, which are in range.
         * _example
         *  //template
         *
         * <script id="cellTemplate" type="text/x-kendo-tmpl">
         *      <div class="${ data.value < 10 ? exhibition : party }">
         *      </div>
         *      ${ data.value }
         *  </script>
         *
         *  //datePicker initialization
         *  <script>
         *      $("#datePicker").kendoDatePicker({
         *          month: {
         *             content:  kendo.template($("#cellTemplate").html()),
         *          }
         *      });
         *  </script>
         *
         * @option {String} [month.empty]
         * The template used for rendering the cells in the calendar "month" view, which are not in the range between
         * the minimum and maximum values.
         *
         * @option {Object} [animation]
         * The animation(s) used for opening and/or closing the pop-up. Setting this value to <strong>false</strong>
         * will disable the animation(s).
         *
         * @option {Object} [animation.open]
         * The animation(s) used for displaying of the pop-up.
         *
         * _exampleTitle Fade-in the pop-up over 300 milliseconds
         * _example
         * $("#datePicker").kendoDatePicker({
         *     animation: {
         *         open: {
         *             effects: "fadeIn",
         *             duration: 300,
         *             show: true
         *         }
         *     }
         * });
         *
         * @option {Object} [animation.close]
         * The animation(s) used for hiding of the pop-up.
         *
         * _exampleTitle Fade-out the pop-up over 300 milliseconds
         * _example
         * $("#datePicker").kendoDatePicker({
         *     animation: {
         *         close: {
         *             effects: "fadeOut",
         *             duration: 300,
         *             show: false,
         *             hide: true
         *         }
         *     }
         * });
         *
         * @option {String} [culture] <en-US> Specifies the culture info used by the widget.
         * _example
         *
         * // specify on widget initialization
         * $("#datepicker").kendoDatePicker({
         *     culture: "de-DE"
         * });
         */
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);
            element = that.element;
            options = that.options;

            normalize(options);

            that._wrapper();

            that.dateView = new DateView(extend({}, options, {
                anchor: that.wrapper,
                change: function() {
                    // calendar is the current scope
                    that._change(this.value());
                    that.close();
                },
                close: function(e) {
                    if (that.trigger(CLOSE)) {
                        e.preventDefault();
                    }
                },
                open: function(e) {
                    if (that.trigger(OPEN)) {
                        e.preventDefault();
                    }
                }
            }));

            that._icon();

            if (!touch) {
                element[0].type = "text";
            }

            element
                .addClass("k-input")
                .bind({
                    keydown: proxy(that._keydown, that),
                    focus: function(e) {
                        that._inputWrapper.addClass(FOCUSED);
                    },
                    blur: proxy(that._blur, that)
                })
                .closest("form")
                .bind("reset", function() {
                    that.value(element[0].defaultValue);
                });

            that.enable(!element.is('[disabled]'));
            that.value(options.value || that.element.val());

            kendo.notify(that);
        },
        events: [
        /**
        * Fires when the selected date is changed
        * @name kendo.ui.DatePicker#change
        * @event
        * @param {Event} e
        * @example
        * $("#datePicker").kendoDatePicker({
        *     change: function(e) {
        *         // handle event
        *     }
        * });
        * @exampleTitle To set after initialization
        * @example
        * // get a reference to the datePicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        * // bind to the change event
        * datePicker.bind("change", function(e) {
        *     // handle event
        * });
        */
        /**
        * Fires when the calendar is opened
        * @name kendo.ui.DatePicker#open
        * @event
        * @param {Event} e
        * @example
        * $("#datePicker").kendoDatePicker({
        *     open: function(e) {
        *         // handle event
        *     }
        * });
        * @exampleTitle To set after initialization
        * @example
        * // get a reference to the datePicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        * // bind to the open event
        * datePicker.bind("open", function(e) {
        *     // handle event
        * });
        */
        /**
        * Fires when the calendar is closed
        * @name kendo.ui.DatePicker#close
        * @event
        * @param {Event} e
        * @example
        * $("#datePicker").kendoDatePicker({
        *     close: function(e) {
        *         // handle event
        *     }
        * });
        * @exampleTitle To set after initialization
        * @example
        * // get a reference to the datePicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        * // bind to the close event
        * datePicker.bind("close", function(e) {
        *     // handle event
        * });
        */
        OPEN,
        CLOSE,
        CHANGE],
        options: {
            name: "DatePicker",
            value: null,
            footer: "",
            format: "",
            culture: "",
            parseFormats: [],
            min: new Date(1900, 0, 1),
            max: new Date(2099, 11, 31),
            start: MONTH,
            depth: MONTH,
            animation: {},
            month : {}
        },

        setOptions: function(options) {
            var that = this;

            Widget.fn.setOptions.call(that, options);

            normalize(that.options);

            extend(that.dateView.options, that.options);
        },

        /**
        * Enable/Disable the datePicker widget.
        * @param {Boolean} enable The argument, which defines whether to enable/disable the datePicker.
        * @example
        * // get a reference to the datepicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        *
        * // disables the datePicker
        * datePicker.enable(false);
        *
        * // enables the datePicker
        * datePicker.enable(true);
        */
        enable: function(enable) {
            var that = this,
                icon = that._dateIcon.unbind(CLICK + " " + MOUSEDOWN),
                wrapper = that._inputWrapper.unbind(HOVEREVENTS),
                element = that.element;

            if (enable === false) {
                wrapper
                    .removeClass(DEFAULT)
                    .addClass(STATEDISABLED);

                element.attr(DISABLED, DISABLED);
            } else {
                wrapper
                    .addClass(DEFAULT)
                    .removeClass(STATEDISABLED)
                    .bind(HOVEREVENTS, that._toggleHover);

                element
                    .removeAttr(DISABLED);

                icon.bind(CLICK, proxy(that._click, that))
                    .bind(MOUSEDOWN, preventDefault);
            }
        },

        /**
        * Opens the calendar.
        * @name kendo.ui.DatePicker#open
        * @function
        * @example
        * // get a reference to the datepicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        * // open the datepicker
        * datePicker.open();
        */
        open: function() {
            this.dateView.open();
        },

        /**
        * Closes the calendar.
        * @name kendo.ui.DatePicker#close
        * @function
        * @example
        * // get a reference to the datepicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        * // close the datepicker
        * datePicker.close();
        */
        close: function() {
            this.dateView.close();
        },

        /**
        * Gets/Sets the min value of the datePicker.
        * @param {Date | String} value The min date to set.
        * @returns {Date} The min value of the datePicker.
        * @example
        * // get a reference to the datepicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        *
        * // get the min value of the datePicker.
        * var min = datePicker.min();
        *
        * // set the min value of the datePicker.
        * datePicker.min(new Date(1900, 0, 1));
        */
        min: function(value) {
            return this._option(MIN, value);
        },

        /**
        * Gets/Sets the max value of the datePicker.
        * @param {Date | String} value The max date to set.
        * @returns {Date} The max value of the datePicker.
        * @example
        * // get a reference to the datepicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        *
        * // get the max value of the datePicker.
        * var max = datePicker.max();
        *
        * // set the max value of the datePicker.
        * datePicker.max(new Date(1900, 0, 1));
        */
        max: function(value) {
            return this._option(MAX, value);
        },

        /**
        * Gets/Sets the value of the datePicker.
        * @param {Date | String} value The value to set.
        * @returns {Date} The value of the datePicker.
        * @example
        * // get a reference to the datepicker widget
        * var datePicker = $("#datePicker").data("kendoDatePicker");
        *
        * // get the value of the datePicker.
        * var value = datePicker.value();
        *
        * // set the value of the datePicker.
        * datePicker.value("10/10/2000"); //parse "10/10/2000" date and selects it in the calendar.
        */
        value: function(value) {
            var that = this;

            if (value === undefined) {
                return that._value;
            }

            that._old = that._update(value);
        },

        _toggleHover: function(e) {
            if (!touch) {
                $(e.currentTarget).toggleClass(HOVER, e.type === "mouseenter");
            }
        },

        _blur: function() {
            var that = this;

            that.close();
            that._change(that.element.val());
            that._inputWrapper.removeClass(FOCUSED);
        },

        _click: function() {
            var that = this,
                element = that.element;

            that.dateView.toggle();

            if (!touch && element[0] !== document.activeElement) {
                element.focus();
            }
        },

        _change: function(value) {
            var that = this;

            value = that._update(value);

            if (+that._old != +value) {
                that._old = value;
                that.trigger(CHANGE);

                // trigger the DOM change event so any subscriber gets notified
                that.element.trigger(CHANGE);
            }
        },

        _keydown: function(e) {
            var that = this,
                dateView = that.dateView;

            if (!dateView.popup.visible() && e.keyCode == keys.ENTER) {
                that._change(that.element.val());
            } else {
                dateView.move(e);
            }
        },

        _icon: function() {
            var that = this,
                element = that.element,
                icon;

            icon = element.next("span.k-select");

            if (!icon[0]) {
                icon = $('<span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-i-calendar" style="cursor:pointer;">select</span></span>').insertAfter(element);
            }

            that._dateIcon = icon;
        },

        _option: function(option, value) {
            var that = this,
                options = that.options;

            if (value === undefined) {
                return options[option];
            }

            value = parse(value, options.parseFormats, options.culture);

            if (!value) {
                return;
            }

            options[option] = new DATE(value);
            that.dateView[option](value);
        },

        _update: function(value) {
            var that = this,
                options = that.options,
                min = options.min,
                max = options.max,
                date = parse(value, options.parseFormats, options.culture);

            if (+date === +that._value) {
                return date;
            }

            if (date !== null && isEqualDatePart(date, min)) {
                date = restrictValue(date, min, max);
            } else if (!isInRange(date, min, max)) {
                date = null;
            }

            that._value = date;
            that.dateView.value(date);
            that.element.val(date ? kendo.toString(date, options.format, options.culture) : value);

            return date;
        },

        _wrapper: function() {
            var that = this,
                element = that.element,
                wrapper;

            wrapper = element.parents(".k-datepicker");

            if (!wrapper[0]) {
                wrapper = element.addClass("k-picker-wrap k-state-default");
//                wrapper = wrapper.parent();
            }

            wrapper[0].style.cssText = element[0].style.cssText;
            element.css({
                width: "100px",
                height: element[0].style.height
            });

            that.wrapper = wrapper.addClass("k-datepicker k-header");
            that._inputWrapper = $(wrapper[0].firstChild);
        }
    });

    ui.plugin(DatePicker);

})(jQuery);
;

/*
* Kendo UI Web v2012.2.710 (http://kendoui.com)
* Copyright 2012 Telerik AD. All rights reserved.
*
* Kendo UI Web commercial licenses may be obtained at http://kendoui.com/web-license
* If you do not own a commercial license, this file shall be governed by the
* GNU General Public License (GPL) version 3.
* For GPL requirements, please review: http://www.gnu.org/copyleft/gpl.html
*/
(function ($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        support = kendo.support,
        touch = support.touch,
        getOffset = kendo.getOffset,
        appendingToBodyTriggersResize = $.browser.msie && $.browser.version < 9,
        OPEN = "open",
        CLOSE = "close",
        DEACTIVATE = "deactivate",
        ACTIVATE = "activate",
        CENTER = "center",
        LEFT = "left",
        RIGHT = "right",
        TOP = "top",
        BOTTOM = "bottom",
        ABSOLUTE = "absolute",
        HIDDEN = "hidden",
        BODY = "body",
        LOCATION = "location",
        POSITION = "position",
        VISIBLE = "visible",
        FITTED = "fitted",
        EFFECTS = "effects",
        ACTIVE = "k-state-active",
        ACTIVEBORDER = "k-state-border",
        ACTIVECHILDREN = ".k-picker-wrap, .k-dropdown-wrap, .k-link",
        MOUSEDOWN = touch ? "touchstart" : "mousedown",
        DOCUMENT = $(document),
        WINDOW = $(window),
        DOCUMENT_ELEMENT = $(document.documentElement),
        RESIZE_SCROLL = "resize scroll",
        cssPrefix = support.transitions.css,
        TRANSFORM = cssPrefix + "transform",
        extend = $.extend,
        styles = ["font-family",
                   "font-size",
                   "font-stretch",
                   "font-style",
                   "font-weight",
                   "line-height"];

    function contains(container, target) {
        return container === target || $.contains(container, target);
    }

    var Popup = Widget.extend({
        init: function (element, options) {
            var that = this, parentPopup;

            Widget.fn.init.call(that, element, options);

            element = that.element;
            options = that.options;

            that.collisions = options.collision ? options.collision.split(" ") : [];

            if (that.collisions.length === 1) {
                that.collisions.push(that.collisions[0]);
            }

            parentPopup = $(that.options.anchor).closest(".k-popup,.k-group"); // When popup is in another popup, make it relative.
            options.appendTo = $($(options.appendTo)[0] || parentPopup[0] || BODY);

            that.element.hide()
                .addClass("k-popup k-group k-reset")
                .css({ position: ABSOLUTE })
                .appendTo(options.appendTo)
                .bind("mouseenter mouseleave", function (e) {
                    that._hovered = e.type === "mouseenter";
                });

            that.wrapper = $();

            if (options.animation === false) {
                options.animation = { open: { show: true, effects: {} }, close: { hide: true, effects: {}} };
            }

            extend(options.animation.open, {
                complete: function () {
                    that.wrapper.css({ overflow: VISIBLE }); // Forcing refresh causes flickering in mobile.
                    that.trigger(ACTIVATE);
                }
            });

            extend(options.animation.close, {
                complete: function () {
                    that.wrapper.hide();

                    var location = that.wrapper.data(LOCATION),
                        anchor = $(options.anchor),
                        direction, dirClass;

                    if (location) {
                        that.wrapper.css(location);
                    }

                    if (options.anchor != BODY) {
                        direction = anchor.hasClass(ACTIVEBORDER + "-down") ? "down" : "up";
                        dirClass = ACTIVEBORDER + "-" + direction;

                        anchor
                            .removeClass(dirClass)
                            .children(ACTIVECHILDREN)
                            .removeClass(ACTIVE)
                            .removeClass(dirClass);

                        element.removeClass(ACTIVEBORDER + "-" + kendo.directions[direction].reverse);
                    }

                    that._closing = false;
                    that.trigger(DEACTIVATE);
                }
            });

            that._mousedownProxy = function (e) {
                that._mousedown(e);
            };

            that._currentWidth = DOCUMENT.width();

            that._resizeProxy = function (e) {
                that._resize(e);
            };

            if (options.toggleTarget) {
                $(options.toggleTarget).bind(options.toggleEvent, $.proxy(that.toggle, that));
            }
        },

        events: [
            OPEN,
            ACTIVATE,
            CLOSE,
            DEACTIVATE
        ],

        options: {
            name: "Popup",
            toggleEvent: "click",
            origin: BOTTOM + " " + LEFT,
            position: TOP + " " + LEFT,
            anchor: BODY,
            collision: "flip fit",
            viewport: window,
            animation: {
                open: {
                    effects: "slideIn:down",
                    transition: true,
                    duration: 200,
                    show: true
                },
                close: { // if close animation effects are defined, they will be used instead of open.reverse
                    duration: 100,
                    show: false,
                    hide: true
                }
            }
        },

        open: function (x, y) {
            var that = this,
                fixed = { isFixed: !isNaN(parseInt(y, 10)), x: x, y: y },
                element = that.element,
                options = that.options,
                direction = "down",
                animation, wrapper,
                anchor = $(options.anchor),
                style,
                idx;

            if (!that.visible()) {
                for (idx = 0; idx < styles.length; idx++) {
                    style = styles[idx];
                    element.css(style, anchor.css(style));
                }

                if (element.data("animating") || that.trigger(OPEN)) {
                    return;
                }

                DOCUMENT_ELEMENT.unbind(MOUSEDOWN, that._mousedownProxy)
                                .bind(MOUSEDOWN, that._mousedownProxy);
                if (!touch) {
                    WINDOW.unbind(RESIZE_SCROLL, that._resizeProxy)
                          .bind(RESIZE_SCROLL, that._resizeProxy);
                }

                that.wrapper = wrapper = kendo.wrap(element)
                                        .css({
                                            overflow: HIDDEN,
                                            display: "block",
                                            position: ABSOLUTE
                                        });

                if (support.mobileOS.android) {
                    wrapper.add(anchor).css(TRANSFORM, "translatez(0)"); // Android is VERY slow otherwise. Should be tested in other droids as well since it may cause blur.
                }

                wrapper.css(POSITION);

                if (options.appendTo == BODY) {
                    wrapper.css(TOP, "-10000px");
                }

                animation = extend(true, {}, options.animation.open);
                that.flipped = that._position(fixed);
                animation.effects = kendo.parseEffects(animation.effects, that.flipped);

                direction = animation.effects.slideIn ? animation.effects.slideIn.direction : direction;

                if (options.anchor != BODY) {
                    var dirClass = ACTIVEBORDER + "-" + direction;

                    element.addClass(ACTIVEBORDER + "-" + kendo.directions[direction].reverse);

                    anchor
                        .addClass(dirClass)
                        .children(ACTIVECHILDREN)
                        .addClass(ACTIVE)
                        .addClass(dirClass);
                }

                element.data(EFFECTS, animation.effects)
                       .kendoStop(true)
                       .kendoAnimate(animation);
            }
        },

        toggle: function () {
            var that = this;

            that[that.visible() ? CLOSE : OPEN]();
        },

        visible: function () {
            return this.element.is(":" + VISIBLE);
        },

        close: function () {
            var that = this,
                options = that.options,
                animation, openEffects, closeEffects;

            if (that.visible()) {
                if (that._closing || that.trigger(CLOSE)) {
                    return;
                }

                // Close all inclusive popups.
                that.element.find(".k-popup").each(function () {
                    var that = $(this),
                        popup = that.data("kendoPopup");

                    if (popup) {
                        popup.close();
                    }
                });

                DOCUMENT_ELEMENT.unbind(MOUSEDOWN, that._mousedownProxy);
                WINDOW.unbind(RESIZE_SCROLL, that._resizeProxy);

                animation = extend(true, {}, options.animation.close);
                openEffects = that.element.data(EFFECTS);
                closeEffects = animation.effects;

                that.wrapper = kendo.wrap(that.element).css({ overflow: HIDDEN });

                if (!closeEffects && !kendo.size(closeEffects) && openEffects && kendo.size(openEffects)) {
                    animation.effects = openEffects;
                    animation.reverse = true;
                }

                that._closing = true;

                that.element.kendoStop(true).kendoAnimate(animation);
            }
        },

        _resize: function (e) {
            var that = this;

            if (appendingToBodyTriggersResize) {
                var width = DOCUMENT.width();
                if (width == that._currentWidth) {
                    return;
                }
                that._currentWidth = width;
            }

            if (!that._hovered) {
                that.close();
            }
        },

        _mousedown: function (e) {
            var that = this,
                container = that.element[0],
                options = that.options,
                anchor = $(options.anchor)[0],
                toggleTarget = options.toggleTarget,
                target = kendo.eventTarget(e),
                popup = $(target).closest(".k-popup")[0];

            if (popup && popup !== that.element[0]) {
                return;
            }

            if (!contains(container, target) && !contains(anchor, target) && !(toggleTarget && contains($(toggleTarget)[0], target))) {
                that.close();
            }
        },

        _fit: function (position, size, viewPortSize) {
            var output = 0;

            if (position + size > viewPortSize) {
                output = viewPortSize - (position + size);
            }

            if (position < 0) {
                output = -position;
            }

            return output;
        },

        _flip: function (offset, size, anchorSize, viewPortSize, origin, position, boxSize) {
            var output = 0;
            boxSize = boxSize || size;

            if (position !== origin && position !== CENTER && origin !== CENTER) {
                if (offset + boxSize > viewPortSize) {
                    output += -(anchorSize + size);
                }

                if (offset + output < 0) {
                    output += anchorSize + size;
                }
            }
            return output;
        },

        _position: function (fixed) {
            var that = this,
                element = that.element,
                wrapper = that.wrapper,
                options = that.options,
                viewport = $(options.viewport),
                viewportOffset = $(viewport).offset(),
                anchor = $(options.anchor),
                origins = options.origin.toLowerCase().split(" "),
                positions = options.position.toLowerCase().split(" "),
                collisions = that.collisions,
                zoomLevel = support.zoomLevel(),
                zIndex = 10002;

            var siblingContainer = anchor.parents().filter(wrapper.siblings());

            if (siblingContainer[0]) {
                var parentZIndex = Number($(siblingContainer).css("zIndex"));
                if (parentZIndex) {
                    zIndex = parentZIndex + 1;
                }
            }

            wrapper.css("zIndex", zIndex);

            if (fixed && fixed.isFixed) {
                wrapper.css({ left: fixed.x, top: fixed.y });
            } else {
                wrapper.css(that._align(origins, positions));
            }

            var pos = getOffset(wrapper, POSITION),
                offset = getOffset(wrapper),
                anchorParent = anchor.offsetParent().parent(".k-animation-container"); // If the parent is positioned, get the current positions

            if (anchorParent.length && anchorParent.data(FITTED)) {
                pos = getOffset(wrapper, POSITION);
                offset = getOffset(wrapper);
            }

            if (viewport[0] === window) {
                offset.top -= (window.pageYOffset || document.documentElement.scrollTop || 0);
                offset.left -= (window.pageXOffset || document.documentElement.scrollLeft || 0);
            }
            else {
                offset.top -= viewportOffset.top;
                offset.left -= viewportOffset.left;
            }

            if (!that.wrapper.data(LOCATION)) { // Needed to reset the popup location after every closure - fixes the resize bugs.
                wrapper.data(LOCATION, extend({}, pos));
            }

            var offsets = extend({}, offset),
                location = extend({}, pos);

            if (collisions[0] === "fit") {
                location.top += that._fit(offsets.top, wrapper.outerHeight(), viewport.height() / zoomLevel);
            }

            if (collisions[1] === "fit") {
                location.left += that._fit(offsets.left, wrapper.outerWidth(), viewport.width() / zoomLevel);
            }

            if (location.left != pos.left || location.top != pos.top) {
                wrapper.data(FITTED, true);
            } else {
                wrapper.removeData(FITTED);
            }

            var flipPos = extend({}, location);

            if (collisions[0] === "flip") {
                location.top += that._flip(offsets.top, element.outerHeight(), anchor.outerHeight(), viewport.height() / zoomLevel, origins[0], positions[0], wrapper.outerHeight());
            }

            if (collisions[1] === "flip") {
                location.left += that._flip(offsets.left, element.outerWidth(), anchor.outerWidth(), viewport.width() / zoomLevel, origins[1], positions[1], wrapper.outerWidth());
            }

            wrapper.css(location);

            return (location.left != flipPos.left || location.top != flipPos.top);
        },

        _align: function (origin, position) {
            var that = this,
                element = that.wrapper,
                anchor = $(that.options.anchor),
                verticalOrigin = origin[0],
                horizontalOrigin = origin[1],
                verticalPosition = position[0],
                horizontalPosition = position[1],
                anchorOffset = getOffset(anchor),
                appendTo = $(that.options.appendTo),
                appendToOffset,
                width = element.outerWidth(),
                height = element.outerHeight(),
                anchorWidth = anchor.outerWidth(),
                anchorHeight = anchor.outerHeight(),
                top = anchorOffset.top,
                left = anchorOffset.left,
                round = Math.round;

            if (appendTo[0] != document.body) {
                appendToOffset = getOffset(appendTo);
                top -= appendToOffset.top;
                left -= appendToOffset.left;
            }


            if (verticalOrigin === BOTTOM) {
                top += anchorHeight;
            }

            if (verticalOrigin === CENTER) {
                top += round(anchorHeight / 2);
            }

            if (verticalPosition === BOTTOM) {
                top -= height;
            }

            if (verticalPosition === CENTER) {
                top -= round(height / 2);
            }

            if (horizontalOrigin === RIGHT) {
                left += anchorWidth;
            }

            if (horizontalOrigin === CENTER) {
                left += round(anchorWidth / 2);
            }

            if (horizontalPosition === RIGHT) {
                left -= width;
            }

            if (horizontalPosition === CENTER) {
                left -= round(width / 2);
            }

            return {
                top: top,
                left: left
            };
        }
    });

    ui.plugin(Popup);
})(jQuery);
;