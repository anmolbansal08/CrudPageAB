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
     * @name kendo.ui.Menu.Description
     *
     * @section
     * <p>
     *  The <b>Menu</b> displays hierarchical data as a multi-level menu. It provides rich styling for unordered lists
     *  of items, and can be used for both navigation and executing JavaScript commands. Items can be defined and
     *  initialized from HTML, or the API can be used to add and remove items.
     * </p>
     * <h3>Getting Started</h3>
     *
     * @exampleTitle Create a HTML hierarchical list of items
     * @example
     * <ul id="menu">
     *     <li>Item 1
     *         <ul>
     *             <li>Item 1.1</li>
     *             <li>Item 1.2</li>
     *         </ul>
     *     </li>
     *     <li>Item 2</li>
     * </ul>
     *
     * @section
     * <p>
     *  Initialization of a <strong>Menu</strong> should occur after the DOM is fully loaded. It is recommended that
     *  initialization the <strong>Menu</strong> occur within a handler is provided to $(document).ready().
     * </p>
     *
     * @exampleTitle Initialize a Menu using a selector within $(document).ready()
     * @example
     * $(document).ready(function() {
     *     $("#menu").kendoMenu();
     * });
     *
     * @exampleTitle Initialize the Menu using JSON data object
     * @example
     * $(document).ready(function() {
     *  $("#menu").kendoMenu({
     *   dataSource:
     *     [{
     *         text: "Item 1",
     *         url: "http://www.kendoui.com"                // Link URL if navigation is needed, optional.
     *     },
     *     {
     *         text: "<b>Item 2</b>",
     *         encoded: false,                                 // Allows use of HTML for item text
     *         content: "text"                                 // content within an item
     *     },
     *     {
     *         text: "Item 3",
     *         imageUrl: "http://www.kendoui.com/test.jpg", // Item image URL, optional.
     *         items: [{                                    // Sub item collection
     *              text: "Sub Item 1"
     *         },
     *         {
     *              text: "Sub Item 2"
     *         }]
     *     },
     *     {
     *         text: "Item 4",
     *         spriteCssClass: "imageClass3"                // Item image sprite CSS class, optional.
     *     }]
     *  })
     * });
     *
     * @section
     * <h3>Customizing Menu Animations</h3>
     * <p>
     *  By default, the <b>Menu</b> uses a slide animation to expand and
     *  reveal sub-items as the mouse hovers. Animations can be easily
     *  customized using configuration properties, changing the animation
     *  style and delay. Menu items can also be configured to open on click
     *  instead of on hover.
     * </p>
     *
     * @exampleTitle Changing Menu animation and open behavior
     * @example
     * $("#menu").kendoMenu({
     *  animation: {
     *   open: { effects: "fadeIn" },
     *   hoverDelay: 500
     *  },
     *  openOnClick: true
     * });
     *
     * @section
     * <h3>Dynamically configuring Menu items</h3>
     * <p>
     *  The <b>Menu</b> API provides several methods for dynamically adding
     *  or removing Items. To add items, provide the new item as a JSON
     *  object along with a reference item that will be used to determine the
     *  placement in the hierarchy.
     * </p>
     * <p>
     *  A reference item is simply a target Menu Item HTML element that
     *  already exists in the Menu. Any valid jQuery selector can be used to
     *  obtain a reference to the target item. For examples, see the
     *  <a href="../menu/api.html" title="Menu API demos">Menu API demos</a>.
     *  Removing an item only requires a reference to the target element that
     *  should be removed.
     * </p>
     *
     * @exampleTitle Dynamically add a new root Menu item
     * @example
     * var menu = $("#menu").kendoMenu().data("kendoMenu");
     * menu.insertAfter(
     *  { text: "New Menu Item" },
     *  menu.element.children("li:last")
     * );
     *
     * @section
     * <h3>Accessing an Existing Menu</h3>
     * <p>
     *  You can reference an existing <b>Menu</b> instance via
     *  <a href="http://api.jquery.com/jQuery.data/">jQuery.data()</a>.
     *  Once a reference has been established, you can use the API to control
     *  its behavior.
     * </p>
     *
     * @exampleTitle Accessing an existing Menu instance
     * @example
     * var menu = $("#menu").data("kendoMenu");
     *
     */
    var kendo = window.kendo,
        ui = kendo.ui,
        touch = kendo.support.touch,
        extend = $.extend,
        proxy = $.proxy,
        each = $.each,
        template = kendo.template,
        Widget = ui.Widget,
        excludedNodesRegExp = /^(ul|a|div)$/i,
        IMG = "img",
        OPEN = "open",
        MENU = "k-menu",
        LINK = "k-link",
        LAST = "k-last",
        CLOSE = "close",
        CLICK = touch ? "touchend" : "click",
        TIMER = "timer",
        FIRST = "k-first",
        IMAGE = "k-image",
        SELECT = "select",
        ZINDEX = "zIndex",
        MOUSEENTER = "mouseenter",
        MOUSELEAVE = "mouseleave",
        KENDOPOPUP = "kendoPopup",
        DEFAULTSTATE = "k-state-default",
        DISABLEDSTATE = "k-state-disabled",
        groupSelector = ".k-group",
        allItemsSelector = ":not(.k-list) > .k-item",
        disabledSelector = ".k-item.k-state-disabled",
        itemSelector = ".k-item:not(.k-state-disabled)",
        linkSelector = ".k-item:not(.k-state-disabled) > .k-link",
        templateSelector = "div:not(.k-animation-container,.k-list-container)",

        templates = {
            content: template(
                "<div class='k-content k-group'>#= content(item) #</div>"
            ),
            group: template(
                "<ul class='#= groupCssClass(group) #'#= groupAttributes(group) #>" +
                    "#= renderItems(data) #" +
                "</ul>"
            ),
            itemWrapper: template(
                "<#= tag(item) # class='#= textClass(item) #'#= textAttributes(item) #>" +
                    "#= image(item) ##= sprite(item) ##= text(item) #" +
                    "#= arrow(data) #" +
                "</#= tag(item) #>"
            ),
            item: template(
                "<li class='#= wrapperCssClass(group, item) #'>" +
                    "#= itemWrapper(data) #" +
                    "# if (item.items) { #" +
                    "#= subGroup({ items: item.items, menu: menu, group: { expanded: item.expanded } }) #" +
                    "# } #" +
                "</li>"
            ),
            image: template("<img class='k-image' alt='' src='#= imageUrl #' />"),
            arrow: template("<span class='#= arrowClass(item, group) #'></span>"),
            sprite: template("<span class='k-sprite #= spriteCssClass #'></span>"),
            empty: template("")
        },

        rendering = {
            /** @ignore */
            wrapperCssClass: function (group, item) {
                var result = "k-item",
                    index = item.index;

                if (item.enabled === false) {
                    result += " k-state-disabled";
                } else {
                    result += " k-state-default";
                }

                if (group.firstLevel && index === 0) {
                    result += " k-first";
                }

                if (index == group.length-1) {
                    result += " k-last";
                }

                return result;
            },
            /** @ignore */
            textClass: function(item) {
                return LINK;
            },
            /** @ignore */
            textAttributes: function(item) {
                return item.url ? " href='" + item.url + "'" : "";
            },
            /** @ignore */
            arrowClass: function(item, group) {
                var result = "k-icon";

                if (group.horizontal) {
                    result += " k-i-arrow-s";
                } else {
                    result += " k-i-arrow-e";
                }

                return result;
            },
            /** @ignore */
            text: function(item) {
                return item.encoded === false ? item.text : kendo.htmlEncode(item.text);
            },
            /** @ignore */
            tag: function(item) {
                return item.url ? "a" : "span";
            },
            /** @ignore */
            groupAttributes: function(group) {
                return group.expanded !== true ? " style='display:none'" : "";
            },
            /** @ignore */
            groupCssClass: function(group) {
                return "k-group";
            },
            /** @ignore */
            content: function(item) {
                return item.content ? item.content : "&nbsp;";
            }
        };

    function getEffectDirection(direction, root) {
        direction = direction.split(" ")[!root+0] || direction;
        return direction.replace("top", "up").replace("bottom", "down");
    }

    function parseDirection(direction, root) {
        direction = direction.split(" ")[!root+0] || direction;
        var output = { origin: [ "bottom", "left" ], position: [ "top", "left" ] },
            horizontal = /left|right/.test(direction);

        if (horizontal) {
            output.origin = [ "top", direction ];
            output.position[1] = kendo.directions[direction].reverse;
        } else {
            output.origin[0] = direction;
            output.position[0] = kendo.directions[direction].reverse;
        }

        output.origin = output.origin.join(" ");
        output.position = output.position.join(" ");

        return output;
    }

    function contains(parent, child) {
        try {
            return $.contains(parent, child);
        } catch (e) {
            return false;
        }
    }

    function updateItemClasses (item) {
        item = $(item);

        item.addClass("k-item")
            .children(IMG)
            .addClass(IMAGE);
        item
            .children("a")
            .addClass(LINK)
            .children(IMG)
            .addClass(IMAGE);
        item
            .filter(":not([disabled])")
            .addClass(DEFAULTSTATE);
        item
            .filter(".k-separator:empty")
            .append("&nbsp;");
        item
            .filter("li[disabled]")
            .addClass(DISABLEDSTATE)
            .removeAttr("disabled");
        item
            .children("a")
            .filter(":focus")
            .parent()
            .addClass("k-state-active");

        if (!item.children("." + LINK).length) {
            item
                .contents()      // exclude groups, real links, templates and empty text nodes
                .filter(function() { return (!this.nodeName.match(excludedNodesRegExp) && !(this.nodeType == 3 && !$.trim(this.nodeValue))); })
                .wrapAll("<span class='" + LINK + "'/>");
        }

        updateArrow(item);
        updateFirstLast(item);
    }

    function updateArrow (item) {
        item = $(item);

        item.find(".k-icon").remove();

        item.filter(":has(.k-group)")
            .children(".k-link:not(:has([class*=k-i-arrow]))")
            .each(function () {
                var item = $(this),
                    parent = item.parent().parent();

                item.append("<span class='k-icon " + (parent.hasClass(MENU + "-horizontal") ? "k-i-arrow-s" : "k-i-arrow-e") + "'/>");
            });
    }

    function updateFirstLast (item) {
        item = $(item);

        item.filter(".k-first:not(:first-child)").removeClass(FIRST);
        item.filter(".k-last:not(:last-child)").removeClass(LAST);
        item.filter(":first-child").addClass(FIRST);
        item.filter(":last-child").addClass(LAST);
    }

    var Menu = Widget.extend({/** @lends kendo.ui.Menu.prototype */
        /**
         * Creates a Menu instance.
         * @constructs
         * @extends kendo.ui.Widget
         * @class Menu UI widget
         * @param {Selector} element DOM element
         * @param {Object} options Configuration options.
         * @option {Object} [animation] A collection of <b>Animation</b> objects, used to change default animations. A value of false will disable all animations in the widget.
         * <p>Available animations for the <b>Menu</b> are listed below.  Each animation has a reverse options which is used for the <b>close</b> effect by default, but can be over-ridden
         * by setting the <b>close</b> animation.  Each animation also has a direction which can be set off the animation (i.e. <b>slideIn:Down</b>).</p>
         * <div class="details-list">
         * <dl>
         *     <dt><b>slideIn</b></dt>
         *     <dd>Menu content slides in from the top</dd>
         *     <dt><b>fadeIn</b></dt>
         *     <dd>Menu content fades in</dd>
         *     <dt><b>expand</b></dt>
         *     <dd>Menu content expands from the top down. Similar to slideIn.</dd>
         * </dl>
         * </div>
         * _example
         *  $("#menu").kendoMenu({
         *      animation: { open: { effects: "fadeIn" } }
         *  });
         * @option {Animation} [animation.open] The animation that will be used when opening sub menus.
         * @option {Animation} [animation.close] The animation that will be used when closing sub menus.
         * @option {String} [orientation] <"horizontal"> Root menu orientation. Could be horizontal or vertical.
         * _example
         *  $("#menu").kendoMenu({
         *      orientation: "vertical"
         *  });
         * @option {Boolean} [closeOnClick] <true> Specifies that sub menus should close after item selection (provided they won't navigate).
         * _example
         *  $("#menu").kendoMenu({
         *      closeOnClick: false
         *  });
         * @option {Boolean} [openOnClick] <false> Specifies that the root sub menus will be opened on item click.
         * _example
         *  $("#menu").kendoMenu({
         *      openOnClick: true
         *  });
         * @option {Number} [hoverDelay] <100> Specifies the delay in ms before the menu is opened/closed - used to avoid accidental closure on leaving.
         * _example
         *  $("#menu").kendoMenu({
         *      hoverDelay: 200
         *  });
         * @option {String} [direction] <"default"> Specifies Menu opening direction. Can be "top", "bottom", "left", "right".
         * You can also specify different direction for root and sub menu items, separating them with space. The example below will initialize the root menu to open upwards and
         * its sub menus to the left.
         * _example
         * $("#menu").kendoMenu({
         *     direction: "top left"
         * });
         * @option {String} [popupCollision] Specifies how Menu should adjust to screen boundaries. By default the strategy is <b>"fit"</b> for a sub menu with a horizontal parent,
         * meaning it will move to fit in screen boundaries in all directions, and <b>"fit flip"</b> for a sub menu with vertical parent, meaning it will fit vertically and flip over
         * its parent horizontally. You can also switch off the screen boundary detection completely if you set the <b>popupCollision</b> to false.
         * _example
         * $("#menu").kendoMenu({
         *     popupCollision: false
         * });
         */
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            element = that.wrapper = that.element;
            options = that.options;

            if (options.dataSource) {
                that.element.empty();
                that.append(options.dataSource, element);
            }

            that._updateClasses();

            if (options.animation === false) {
                options.animation = { open: { show: true, effects: {} }, close: { hide: true, effects: {} } };
            }

            that.nextItemZIndex = 100;

            element.delegate(disabledSelector, CLICK, false)
                   .delegate(itemSelector, CLICK, proxy(that._click , that));

            if (!touch) {
                element.delegate(itemSelector, MOUSEENTER, proxy(that._mouseenter, that))
                       .delegate(itemSelector, MOUSELEAVE, proxy(that._mouseleave, that))
                       .delegate(linkSelector, MOUSEENTER + " " + MOUSELEAVE, that._toggleHover);
            } else {
                options.openOnClick = true;
                element.delegate(linkSelector, "touchstart touchend", that._toggleHover);
            }

            if (options.openOnClick) {
                that.clicked = false;
                $(document).click(proxy( that._documentClick, that ));
            }

            kendo.notify(that);
        },

        events: [
            /**
            * Fires before a sub menu gets opened.
            * @name kendo.ui.Menu#open
            * @event
            * @param {Event} e
            * @param {Element} e.item The opened item
            * @example
            *  $("#menu").kendoMenu({
            *      open: function(e) {
            *          // handle event
            *      }
            *  });
            * @exampleTitle To set after initialization
            * @example
            *  // get a reference to the menu widget
            *  var menu = $("#menu").data("kendoMenu");
            *  // bind to the open event
            *  menu.bind("open", function(e) {
            *      // handle event
            *  });
            */
            OPEN,
            /**
            * Fires after a sub menu gets closed.
            * @name kendo.ui.Menu#close
            * @event
            * @param {Event} e
            * @param {Element} e.item The closed item
            * @example
            *  $("#menu").kendoMenu({
            *      close: function(e) {
            *          // handle event
            *      }
            *  });
            * @exampleTitle To set after initialization
            * @example
            *  // get a reference to the menu widget
            *  var menu = $("#menu").data("kendoMenu");
            *  // bind to the close event
            *  menu.bind("close", function(e) {
            *      // handle event
            *  });
            */
            CLOSE,
            /**
            * Fires when a menu item gets selected.
            * @name kendo.ui.Menu#select
            * @event
            * @param {Event} e
            * @param {Element} e.item The selected item
            * @example
            *  $("#menu").kendoMenu({
            *      select: function(e) {
            *          // handle event
            *      }
            *  });
            * @exampleTitle To set after initialization
            * @example
            *  // get a reference to the menu widget
            *  var menu = $("#menu").data("kendoMenu");
            *  // bind to the select event
            *  menu.bind("select", function(e) {
            *      // handle event
            *  });
            */
            SELECT
        ],

        options: {
            name: "Menu",
            animation: {
                open: {
                    duration: 200,
                    show: true
                },
                close: { // if close animation effects are defined, they will be used instead of open.reverse
                    duration: 100
                }
            },
            orientation: "horizontal",
            direction: "default",
            openOnClick: false,
            closeOnClick: true,
            hoverDelay: 100
        },

        /**
         *
         * Enables or disables an item of a <strong>Menu</strong>. This can optionally be accomplished on
         * initialization by setting the <b>disabled="disabled"</b> on the desired menu item html element.
         *
         * @param {Selector} element
         * Target element
         *
         * @param {Boolean} enable
         * Desired state
         *
         * @returns {Menu}
         * Returns the Menu object to support chaining.
         *
         * @example
         * // get a reference to the menu widget
         * var menu = $("#menu").data("kendoMenu");
         * // disable the li menu item with the id "secondItem"
         * menu.enable("#secondItem", false);
         */
        enable: function (element, enable) {
            this._toggleDisabled(element, enable !== false);

            return this;
        },

        disable: function (element) {
            this._toggleDisabled(element, false);

            return this;
        },

        /**
         *
         * Appends an item to a <strong>Menu</strong> in the specified referenceItem's sub menu.
         *
         * @param {Selector} item
         * Target item, specified as a JSON object. Can also handle an array of such objects.
         *
         * @param {Item} referenceItem
         * A reference item to append the new item in.
         *
         * @returns {Menu}
         * Returns the Menu object to support chaining.
         *
         * @example
         * // get a reference to the menu widget
         * var menu = $("#menu").data("kendoMenu");
         * //
         * menu.append(
         *     [{
         *         text: "Item 1",
         *         url: "http://www.kendoui.com"                // Link URL if navigation is needed, optional.
         *     },
         *     {
         *         text: "<b>Item 2</b>",
         *         encoded: false,                                 // Allows use of HTML for item text
         *         content: "text"                                 // content within an item
         *     },
         *     {
         *         text: "Item 3",
         *         imageUrl: "http://www.kendoui.com/test.jpg", // Item image URL, optional.
         *         items: [{                                    // Sub item collection
         *              text: "Sub Item 1"
         *         },
         *         {
         *              text: "Sub Item 2"
         *         }]
         *     },
         *     {
         *         text: "Item 4",
         *         spriteCssClass: "imageClass3"                // Item image sprite CSS class, optional.
         *     }],
         *     referenceItem
         * );
         */
        append: function (item, referenceItem) {
            referenceItem = this.element.find(referenceItem);

            var inserted = this._insert(item, referenceItem, referenceItem.length ? referenceItem.find("> .k-group, .k-animation-container > .k-group") : null);

            each(inserted.items, function (idx) {
                inserted.group.append(this);

                var contents = inserted.contents[idx];
                if (contents) {
                    $(this).append(contents);
                }

                updateArrow(this);
            });

            updateArrow(referenceItem);
            updateFirstLast(inserted.group.find(".k-first, .k-last").add(inserted.items));

            return this;
        },

        /**
         *
         * Inserts an item into a <strong>Menu</strong> before the specified referenceItem.
         *
         * @param {Selector} item
         * Target item, specified as a JSON object. Can also handle an array of such objects.
         *
         * @param {Selector} referenceItem
         * A reference item to insert the new item before
         *
         * @returns {Menu}
         * Returns the Menu object to support chaining.
         *
         * @example
         * // get a reference to the menu widget
         * var menu = $("#menu").data("kendoMenu");
         * //
         * menu.insertBefore(
         *     [{
         *         text: "Item 1",
         *         url: "http://www.kendoui.com"                // Link URL if navigation is needed, optional.
         *     },
         *     {
         *         text: "<b>Item 2</b>",
         *         encoded: false,                                 // Allows use of HTML for item text
         *         content: "text"                                 // content within an item
         *     },
         *     {
         *         text: "Item 3",
         *         imageUrl: "http://www.kendoui.com/test.jpg", // Item image URL, optional.
         *         items: [{                                    // Sub item collection
         *              text: "Sub Item 1"
         *         },
         *         {
         *              text: "Sub Item 2"
         *         }]
         *     },
         *     {
         *         text: "Item 4",
         *         spriteCssClass: "imageClass3"                // Item image sprite CSS class, optional.
         *     }],
         *     referenceItem
         * );
         */
        insertBefore: function (item, referenceItem) {
            referenceItem = this.element.find(referenceItem);

            var inserted = this._insert(item, referenceItem, referenceItem.parent());

            each(inserted.items, function (idx) {
                referenceItem.before(this);

                var contents = inserted.contents[idx];
                if (contents) {
                    $(this).append(contents);
                }

                updateArrow(this);
                updateFirstLast(this);
            });

            updateFirstLast(referenceItem);

            return this;
        },

        /**
         *
         * Inserts an item into a <strong>Menu</strong> after the specified referenceItem.
         *
         * @param {Selector} item
         * Target item, specified as a JSON object. Can also handle an array of such objects.
         *
         * @param {Selector} referenceItem
         * A reference item to insert the new item after.
         *
         * @returns {Menu}
         * Returns the Menu object to support chaining.
         *
         * @example
         * // get a reference to the menu widget
         * var menu = $("#menu").data("kendoMenu");
         * //
         * menu.insertAfter(
         *     [{
         *         text: "Item 1",
         *         url: "http://www.kendoui.com"                // Link URL if navigation is needed, optional.
         *     },
         *     {
         *         text: "<b>Item 2</b>",
         *         encoded: false,                                 // Allows use of HTML for item text
         *         content: "text"                                 // content within an item
         *     },
         *     {
         *         text: "Item 3",
         *         imageUrl: "http://www.kendoui.com/test.jpg", // Item image URL, optional.
         *         items: [{                                    // Sub item collection
         *              text: "Sub Item 1"
         *         },
         *         {
         *              text: "Sub Item 2"
         *         }]
         *     },
         *     {
         *         text: "Item 4",
         *         spriteCssClass: "imageClass3"                // Item image sprite CSS class, optional.
         *     }],
         *     referenceItem
         * );
         *
         */
        insertAfter: function (item, referenceItem) {
            referenceItem = this.element.find(referenceItem);

            var inserted = this._insert(item, referenceItem, referenceItem.parent());

            each(inserted.items, function (idx) {
                referenceItem.after(this);

                var contents = inserted.contents[idx];
                if (contents) {
                    $(this).append(contents);
                }

                updateArrow(this);
                updateFirstLast(this);
            });

            updateFirstLast(referenceItem);

            return this;
        },

        _insert: function (item, referenceItem, parent) {
            var that = this,
                items, groups, contents = [];

            if (!referenceItem || !referenceItem.length) {
                parent = that.element;
            }

            var plain = $.isPlainObject(item),
                groupData = {
                    firstLevel: parent.hasClass(MENU),
                    horizontal: parent.hasClass(MENU + "-horizontal"),
                    expanded: true,
                    length: parent.children().length
                };

            if (referenceItem && !parent.length) {
                parent = $(Menu.renderGroup({ group: groupData })).appendTo(referenceItem);
            }

            if (plain || $.isArray(item)) { // is JSON
                items = $.map(plain ? [ item ] : item, function (value, idx) {
                            if (typeof value === "string") {
                                return $(value);
                            } else {
                                return $(Menu.renderItem({
                                    group: groupData,
                                    item: extend(value, { index: idx })
                                }));
                            }
                        });
                contents = $.map(plain ? [ item ] : item, function (value, idx) {
                            if (value.content || value.contentUrl) {
                                return $(Menu.renderContent({
                                    item: extend(value, { index: idx })
                                }));
                            } else {
                                return false;
                            }
                        });
            } else {
                items = $(item);
                groups = items.find("> ul")
                                .addClass("k-group");
                items = items.filter("li");

                items.add(groups.find("> li")).each(function () {
                    updateItemClasses(this);
                });
            }

            return { items: items, group: parent, contents: contents };
        },

        /**
         *
         * Removes a specified item(s) from a <strong>Menu</strong>.
         *
         * @param {Selector} element
         * Target item selector.
         *
         * @returns {Menu}
         * Returns the Menu object to support chaining.
         *
         * @example
         * // get a reference to the menu widget
         * var menu = $("#menu").data("kendoMenu");
         * // remove the item with the id "Item1"
         * menu.remove("#Item1");
         *
         */
        remove: function (element) {
            element = this.element.find(element);

            var that = this,
                parent = element.parentsUntil(that.element, allItemsSelector),
                group = element.parent("ul");

            element.remove();

            if (group && !group.children(allItemsSelector).length) {
                var container = group.parent(".k-animation-container");
                if (container.length) {
                    container.remove();
                } else {
                    group.remove();
                }
            }

            if (parent.length) {
                parent = parent.eq(0);

                updateArrow(parent);
                updateFirstLast(parent);
            }

            return that;
        },

        /**
         *
         * Opens a sub-menu of a specified item(s) in a <strong>Menu</strong>.
         *
         * @param {Selector} element
         * Target item selector.
         *
         * @returns {Menu}
         * Returns the Menu object to support chaining.
         *
         * @example
         * // get a reference to the menu widget
         * var menu = $("#menu").data("kendoMenu");
         * // open the sub menu of "Item1"
         * menu.open("#Item1");
         *
         */
        open: function (element) {
            var that = this,
                options = that.options,
                horizontal = options.orientation == "horizontal",
                direction = options.direction;
            element = that.element.find(element);

            if (/^(top|bottom|default)$/.test(direction)) {
                direction = horizontal ? (direction + " right").replace("default", "bottom") : "right";
            }

            element.siblings()
                   .find(">.k-popup:visible,>.k-animation-container>.k-popup:visible")
                   .each(function () {
                       var popup = $(this).data("kendoPopup");

                       if (popup) {
                           popup.close();
                       }
                   });

            element.each(function () {
                var li = $(this);

                clearTimeout(li.data(TIMER));

                li.data(TIMER, setTimeout(function () {
                    var ul = li.find(".k-group:first:hidden"), popup;

                    if (ul[0] && that.trigger(OPEN, { item: li[0] }) === false) {
                        li.data(ZINDEX, li.css(ZINDEX));
                        li.css(ZINDEX, that.nextItemZIndex ++);

                        popup = ul.data(KENDOPOPUP);
                        var root = li.parent().hasClass(MENU),
                            parentHorizontal = root && horizontal,
                            directions = parseDirection(direction, root),
                            effects = options.animation.open.effects,
                            openEffects = effects !== undefined ? effects : "slideIn:" + getEffectDirection(direction, root);

                        if (!popup) {
                            popup = ul.kendoPopup({
                                origin: directions.origin,
                                position: directions.position,
                                collision: options.popupCollision !== undefined ? options.popupCollision : (parentHorizontal ? "fit" : "fit flip"),
                                anchor: li,
                                appendTo: li,
                                animation: {
                                    open: extend(true, { effects: openEffects }, options.animation.open),
                                    close: options.animation.close
                                },
                                close: function (e) {
                                    var li = e.sender.wrapper.parent();

                                    if (that.trigger(CLOSE, { item: li[0] }) === false) {
                                        li.css(ZINDEX, li.data(ZINDEX));
                                        li.removeData(ZINDEX);
                                    } else {
                                        e.preventDefault();
                                    }
                                }
                            }).data(KENDOPOPUP);
                        } else {
                            popup = ul.data(KENDOPOPUP);
                            popup.options.origin = directions.origin;
                            popup.options.position = directions.position;
                            popup.options.animation.open.effects = openEffects;
                        }

                        popup.open();
                    }

                }, that.options.hoverDelay));
            });

            return that;
        },

        /**
         *
         * Closes a sub-menu of a specified item(s) in a <strong>Menu</strong>.
         *
         * @param {Selector} element Target item selector.
         *
         * @returns {Menu}
         * Returns the Menu object to support chaining.
         *
         * @example
         * // get a reference to the menu widget
         * var menu = $("#menu").data("kendoMenu");
         * // close the sub menu of "Item1"
         * menu.close("#Item1");
         *
         */
        close: function (element) {
            var that = this;
            element = that.element.find(element);

            if (!element[0]) {
                element = that.element.find(">.k-item");
            }

            element.each(function () {
                var li = $(this);

                clearTimeout(li.data(TIMER));

                li.data(TIMER, setTimeout(function () {
                    var ul = li.find(".k-group:first:visible"), popup;
                    if (ul[0]) {
                        popup = ul.data(KENDOPOPUP);
                        popup.close();
                    }
                }, that.options.hoverDelay));
            });

            return that;
        },

        _toggleDisabled: function (element, enable) {
            element = this.element.find(element);
            element.each(function () {
                $(this)
                    .toggleClass(DEFAULTSTATE, enable)
                    .toggleClass(DISABLEDSTATE, !enable);
            });
        },

        _toggleHover: function(e) {
            var target = $(kendo.eventTarget(e)).closest(allItemsSelector);

            if (!target.parents("li." + DISABLEDSTATE).length) {
                target.toggleClass("k-state-hover", e.type == MOUSEENTER || e.type == "touchstart");
            }
        },

        _updateClasses: function() {
            var that = this;

            that.element.addClass("k-widget k-reset k-header " + MENU).addClass(MENU + "-" + that.options.orientation);

            var items = that.element
                            .find("li > ul")
                            .addClass("k-group")
                            .end()
                            .find("> li,.k-group > li");

            items.each(function () {
                updateItemClasses(this);
            });
        },

        _mouseenter: function (e) {
            var that = this,
                element = $(e.currentTarget),
                hasChildren = (element.children(".k-animation-container").length || element.children(groupSelector).length);

            if (e.delegateTarget != element.parents(".k-menu")[0]) {
                return;
            }

            if (!that.options.openOnClick || that.clicked) {
                if (!contains(e.currentTarget, e.relatedTarget) && hasChildren) {
                    that.open(element);
                }
            }

            if (that.options.openOnClick && that.clicked) {
                element.siblings().each(proxy(function (_, sibling) {
                    that.close(sibling);
                }, that));
            }
        },

        _mouseleave: function (e) {
            var that = this,
                element = $(e.currentTarget),
                hasChildren = (element.children(".k-animation-container").length || element.children(groupSelector).length);

            if (element.parentsUntil(".k-animation-container", ".k-list-container,.k-calendar-container")[0]) {
                e.stopImmediatePropagation();
                return;
            }

            if (!that.options.openOnClick && !contains(e.currentTarget, e.relatedTarget) && hasChildren) {
                that.close(element);
            }
        },

        _click: function (e) {
            var that = this, openHandle,
                target = $(kendo.eventTarget(e)),
                link = target.closest("." + LINK),
                href = link.attr("href"),
                element = target.closest(allItemsSelector),
                isLink = (!!href && href.charAt(href.length - 1) != "#");

            if (element.children(templateSelector)[0]) {
                return;
            }

            if (element.hasClass(DISABLEDSTATE)) {
                e.preventDefault();
                return;
            }

            if (touch) {
                element.siblings().each(proxy(function (_, sibling) {
                    that.close(sibling);
                }, that));
            }

            if (!e.handled && that.trigger(SELECT, { item: element[0] })) { // We shouldn't stop propagation.
                e.preventDefault();
            }

            e.handled = true;

            if (that.options.closeOnClick && !(href && href.length > 0) && !element.children(groupSelector + ",.k-animation-container").length) {
                that.close(link.parentsUntil(that.element, allItemsSelector));
            }

            if ((!element.parent().hasClass(MENU) || !that.options.openOnClick) && !touch) {
                return;
            }

            if (!isLink) {
                e.preventDefault();
            }

            that.clicked = true;
            openHandle = element.children(".k-animation-container, .k-group").is(":visible") ? CLOSE : OPEN;
            that[openHandle](element);
        },

        _documentClick: function (e) {
            var that = this;

            if (contains(that.element[0], e.target)) {
                return;
            }

            that.clicked = false;
        }
    });

    // client-side rendering
    extend(Menu, {
        renderItem: function (options) {
            options = extend({ menu: {}, group: {} }, options);

            var empty = templates.empty,
                item = options.item;

            return templates.item(extend(options, {
                image: item.imageUrl ? templates.image : empty,
                sprite: item.spriteCssClass ? templates.sprite : empty,
                itemWrapper: templates.itemWrapper,
                arrow: item.items || item.content ? templates.arrow : empty,
                subGroup: Menu.renderGroup
            }, rendering));
        },

        renderGroup: function (options) {
            return templates.group(extend({
                renderItems: function(options) {
                    var html = "",
                        i = 0,
                        items = options.items,
                        len = items ? items.length : 0,
                        group = extend({ length: len }, options.group);

                    for (; i < len; i++) {
                        html += Menu.renderItem(extend(options, {
                            group: group,
                            item: extend({ index: i }, items[i])
                        }));
                    }

                    return html;
                }
            }, options, rendering));
        },

        renderContent: function (options) {
            return templates.content(extend(options, rendering));
        }
    });

    kendo.ui.plugin(Menu);

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