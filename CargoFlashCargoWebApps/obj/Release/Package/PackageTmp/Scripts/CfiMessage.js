// By: Hans Fj�llemark and John Papa
// https://github.com/CodeSeven/InvokeMsg
// 
// Modified to support css styling instead of inline styling
// Inspired by https://github.com/Srirangan/notifer.js/

(function(window, $) {
    window.InvokeMsg = (function() {
        var 
            defaults = {
                tapToDismiss: true,
                cfMessageClass: 'cfMessage',
                containerId: 'cfMessage-container',
                debug: false,
                fadeIn: 300,
                fadeOut: 1000,
                extendedTimeOut: 5000,
                iconClasses: {
                    error: 'cfMessage-error',
                    info: 'cfMessage-info',
                    success: 'cfMessage-success',
                    warning: 'cfMessage-warning'
                },
                iconClass: 'cfMessage-info',
                positionClass: 'cfMessage-top-right',
                timeOut: 5000, // Set timeOut to 0 to make it sticky
                titleClass: 'cfMessage-title',
                messageClass: 'cfMessage-message'
            },


            error = function(message, title) {
                return notify({
                    iconClass: getOptions().iconClasses.error,
                    message: message,
                    title: title
                })
            },

            getContainer = function(options) {
                var $container = $('#' + options.containerId)

                if ($container.length)
                    return $container

                $container = $('<div/>')
                    .attr('id', options.containerId)
                    .addClass(options.positionClass)

                $container.appendTo($('body'))

                return $container
            },

            getOptions = function() {
                return $.extend({}, defaults, InvokeMsg.options)
            },

            info = function(message, title) {
                return notify({
                    iconClass: getOptions().iconClasses.info,
                    message: message,
                    title: title
                })
            },

            notify = function(map) {
                var 
                    options = getOptions(),
                    iconClass = map.iconClass || options.iconClass,
                    intervalId = null,
                    $container = getContainer(options),
                    $cfMessageElement = $('<div/>'),
                    $titleElement = $('<div/>'),
                    $messageElement = $('<div/>'),
                    response = { options: options, map: map }

                if (map.iconClass) {
                    $cfMessageElement.addClass(options.cfMessageClass).addClass(iconClass)
                }

                if (map.title) {
                    $titleElement.append(map.title).addClass(options.titleClass)
                    $cfMessageElement.append($titleElement)
                }

                if (map.message) {
                    $messageElement.append(map.message).addClass(options.messageClass)
                    $cfMessageElement.append($messageElement)
                }

                var fadeAway = function() {
                    if ($(':focus', $cfMessageElement).length > 0)
                		return
                	
                    var fade = function() {
                        return $cfMessageElement.fadeOut(options.fadeOut)
                    }

                    $.when(fade()).done(function() {
                        if ($cfMessageElement.is(':visible')) {
                            return
                        }
                        $cfMessageElement.remove()
                        if ($container.children().length === 0)
                            $container.remove()
                    })
                }

                var delayedFadeAway = function() {
                    if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                        intervalId = setTimeout(fadeAway, options.extendedTimeOut)
                    }
                }

                var stickAround = function() {
                    clearTimeout(intervalId)
                    $cfMessageElement.stop(true, true)
                        .fadeIn(options.fadeIn)
                }

                $cfMessageElement.hide()
                $container.prepend($cfMessageElement)
                $cfMessageElement.fadeIn(options.fadeIn)

                //Added by Amit Yadav            

                var len = $("#cfMessage-container").find(".cfMessage").length;
                $("#cfMessage-container").attr("style", "top:" + (38 * len) + "px;");

                if (options.timeOut > 0) {
                    intervalId = setTimeout(fadeAway, options.timeOut)
                }

                $cfMessageElement.hover(stickAround, delayedFadeAway)

                if (options.tapToDismiss) {
                    $cfMessageElement.click(fadeAway)
                }

                if (options.debug) {
                    console.log(response)
                }
                return $cfMessageElement
            },

            success = function(message, title) {
                return notify({
                    iconClass: getOptions().iconClasses.success,
                    message: message,
                    title: title
                })
            },

            warning = function(message, title) {
                return notify({
                    iconClass: getOptions().iconClasses.warning,
                    message: message,
                    title: title
                })
            }

        return {
            error: error,
            info: info,
            options: {},
            success: success,
            warning: warning
        }
    })()
} (window, jQuery));