/*
* Kendo UI v2014.1.528 (http://www.telerik.com/kendo-ui)
* Copyright 2014 Telerik AD. All rights reserved.
*
* Kendo UI commercial licenses may be obtained at
* http://www.telerik.com/purchase/license-agreement/kendo-ui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
(function(f, define){
    define([ "./kendo.dataviz.core" ], f);
})(function(){

(function () {

    // Imports ================================================================
    var kendo = window.kendo,
        ui = kendo.dataviz.ui,
        deepExtend = kendo.deepExtend;

    // Constants ==============================================================
    var BAR_GAP = 1.5,
        BAR_SPACING = 0.4,
        BLACK = "#000",
        SANS = "Arial,Helvetica,sans-serif",
        SANS11 = "11px " + SANS,
        SANS12 = "12px " + SANS,
        SANS16 = "16px " + SANS,
        WHITE = "#fff";

    var chartBaseTheme = {
            title: {
                font: SANS16
            },
            legend: {
                labels: {
                    font: SANS12
                }
            },
            seriesDefaults: {
                visible: true,
                labels: {
                    font: SANS11
                },
                donut: {
                    margin: 1
                },
                line: {
                    width: 2
                },
                vericalLine: {
                    width: 2
                },
                scatterLine: {
                    width: 1
                },
                area: {
                    opacity: 0.4,
                    markers: {
                        visible: false,
                        size: 6
                    },
                    highlight: {
                        markers: {
                            border: {
                                color: "#fff",
                                opacity: 1,
                                width: 1
                            }
                        }
                    },
                    line: {
                        opacity: 1,
                        width: 0
                    }
                },
                verticalArea: {
                    opacity: 0.4,
                    markers: {
                        visible: false,
                        size: 6
                    },
                    line: {
                        opacity: 1,
                        width: 0
                    }
                },
                radarLine: {
                    width: 2,
                    markers: {
                        visible: false
                    }
                },
                radarArea: {
                    opacity: 0.5,
                    markers: {
                        visible: false,
                        size: 6
                    },
                    line: {
                        opacity: 1,
                        width: 0
                    }
                },
                candlestick: {
                    line: {
                        width: 1,
                        color: BLACK
                    },
                    border: {
                        width: 1,
                        _brightness: 0.8
                    },
                    gap: 1,
                    spacing: 0.3,
                    downColor: WHITE,
                    highlight: {
                        line: {
                            width: 2
                        },
                        border: {
                            width: 2,
                            opacity: 1
                        }
                    }
                },
                ohlc: {
                    line: {
                        width: 1
                    },
                    gap: 1,
                    spacing: 0.3,
                    highlight: {
                        line: {
                            width: 3,
                            opacity: 1
                        }
                    }
                },
                bubble: {
                    opacity: 0.6,
                    border: {
                        width: 0
                    },
                    labels: {
                        background: "transparent"
                    }
                },
                bar: {
                    gap: BAR_GAP,
                    spacing: BAR_SPACING
                },
                column: {
                    gap: BAR_GAP,
                    spacing: BAR_SPACING
                },
                bullet: {
                    gap: BAR_GAP,
                    spacing: BAR_SPACING,
                    target: {
                        color: "#ff0000"
                    }
                },
                verticalBullet: {
                    gap: BAR_GAP,
                    spacing: BAR_SPACING,
                    target: {
                        color: "#ff0000"
                    }
                },
                boxPlot: {
                    outliersField: "",
                    meanField: "",
                    whiskers: {
                        width: 1,
                        color: BLACK
                    },
                    mean: {
                        width: 1,
                        color: BLACK
                    },
                    median: {
                        width: 1,
                        color: BLACK
                    },
                    border: {
                        width: 1,
                        _brightness: 0.8
                    },
                    gap: 1,
                    spacing: 0.3,
                    downColor: WHITE,
                    highlight: {
                        whiskers: {
                            width: 2
                        },
                        mean: {
                            width: 2
                        },
                        median: {
                            width: 2
                        },
                        border: {
                            width: 2,
                            opacity: 1
                        }
                    }
                },
                funnel: {
                    labels: {
                        color:"",
                        background: ""
                    }
                },
                notes: {
                    icon: {
                        size: 7,
                        border: {
                            width: 1
                        }
                    },
                    label: {
                        padding: 3,
                        font: SANS12
                    },
                    line: {
                        length: 10,
                        width: 1
                    },
                    visible: true
                }
            },
            categoryAxis: {
                majorGridLines: {
                    visible: true
                }
            },
            axisDefaults: {
                labels: {
                    font: SANS12
                },
                title: {
                    font: SANS16,
                    margin: 5
                },
                crosshair: {
                    tooltip: {
                        font: SANS12
                    }
                },
                notes: {
                    icon: {
                        size: 7,
                        border: {
                            width: 1
                        }
                    },
                    label: {
                        padding: 3,
                        font: SANS12
                    },
                    line: {
                        length: 10,
                        width: 1
                    },
                    visible: true
                }
            },
            tooltip: {
                font: SANS12
            },
            navigator: {
                pane: {
                    height: 90,
                    margin: {
                        top: 10
                    }
                }
            }
        };

    var gaugeBaseTheme = {
        scale: {
            labels: {
                font: SANS12
            }
        }
    };

    var diagramBaseTheme = {
        shapeDefaults: {
            hover: {
                opacity: 0.2
            },
            stroke: {
                width: 0
            }
        },
        editable: {
            resize: {
                handles: {
                    width: 7,
                    height: 7
                }
            },
            rotate: {
                thumb: {
                    width: 14
                }
            },
            handles: {
                type: "rectangle"
            },
            select: {
                stroke: {
                    width: 1,
                    dashType: "dot"
                }
            }
        },
        connectionDefaults: {
            stroke: {
                width: 2
            },
            select: {
                handles: {
                    width: 8,
                    height: 8
                }
            }
        }
    };

    var themes = ui.themes,
        registerTheme = ui.registerTheme = function(themeName, options) {
            var result = {};
            // Apply base theme
            result.chart = deepExtend({}, chartBaseTheme, options.chart);
            result.gauge = deepExtend({}, gaugeBaseTheme, options.gauge);
            result.diagram = deepExtend({}, diagramBaseTheme, options.diagram);

            // Copy the line/area chart settings for their vertical counterparts
            var defaults = result.chart.seriesDefaults;
            defaults.verticalLine = deepExtend({}, defaults.line);
            defaults.verticalArea = deepExtend({}, defaults.area);

            defaults.polarArea = deepExtend({}, defaults.radarArea);
            defaults.polarLine = deepExtend({}, defaults.radarLine);

            themes[themeName] = result;
        };

    registerTheme("black", {
        chart: {
            title: {
                color: WHITE
            },
            legend: {
                labels: {
                    color: WHITE
                },
                inactiveItems: {
                    labels: {
                        color: "#919191"
                    },
                    markers: {
                        color: "#919191"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: WHITE
                },
                errorBars: {
                    color: WHITE
                },
                notes: {
                    icon: {
                        background: "#3b3b3b",
                        border: {
                            color: "#8e8e8e"
                        }
                    },
                    label: {
                        color: WHITE
                    },
                    line: {
                        color: "#8e8e8e"
                    }
                },
                pie: {
                    overlay: {
                        gradient: "sharpBevel"
                    }
                },
                donut: {
                    overlay: {
                        gradient: "sharpGlass"
                    }
                },
                line: {
                    markers: {
                        background: "#3d3d3d"
                    }
                },
                scatter: {
                    markers: {
                        background: "#3d3d3d"
                    }
                },
                scatterLine: {
                    markers: {
                        background: "#3d3d3d"
                    }
                },
                candlestick: {
                    downColor: "#555",
                    line: {
                        color: WHITE
                    },
                    border: {
                        _brightness: 1.5,
                        opacity: 1
                    },
                    highlight: {
                        border: {
                            color: WHITE,
                            opacity: 0.2
                        }
                    }
                },
                ohlc: {
                    line: {
                        color: WHITE
                    }
                }
            },
            chartArea: {
                background: "#3d3d3d"
            },
            seriesColors: ["#0081da", "#3aafff", "#99c900", "#ffeb3d", "#b20753", "#ff4195"],
            axisDefaults: {
                line: {
                    color: "#8e8e8e"
                },
                labels: {
                    color: WHITE
                },
                majorGridLines: {
                    color: "#545454"
                },
                minorGridLines: {
                    color: "#454545"
                },
                title: {
                    color: WHITE
                },
                crosshair: {
                    color: "#8e8e8e"
                },
                notes: {
                    icon: {
                        background: "#3b3b3b",
                        border: {
                            color: "#8e8e8e"
                        }
                    },
                    label: {
                        color: WHITE
                    },
                    line: {
                        color: "#8e8e8e"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#0070e4"
            },
            scale: {
                rangePlaceholderColor: "#1d1d1d",
                labels: {
                    color: WHITE
                },
                minorTicks: {
                    color: WHITE
                },
                majorTicks: {
                    color: WHITE
                },
                line: {
                    color: WHITE
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#0066cc",
                connectorDefaults: {
                    background: WHITE,
                    stroke: {
                        color: "#384049"
                    },
                    hover: {
                        background: "#3d3d3d",
                        stroke: {
                            color: "#efefef"
                        }
                    }
                },
                content: {
                    color: WHITE
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: "#3d3d3d",
                        stroke: {
                            color: WHITE
                        },
                        hover: {
                            background: WHITE,
                            stroke: {
                                color: WHITE
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: WHITE
                        },
                        background: WHITE
                    }
                },
                select: {
                    stroke: {
                        color: WHITE
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: WHITE
                },
                content: {
                    color: WHITE
                },
                select: {
                    handles: {
                        background: "#3d3d3d",
                        stroke: {
                            color: "#efefef"
                        }
                    }
                }
            }
        }
    });

    registerTheme("blueopal", {
        chart: {
            title: {
                color: "#293135"
            },
            legend: {
                labels: {
                    color: "#293135"
                },
                inactiveItems: {
                    labels: {
                        color: "#27A5BA"
                    },
                    markers: {
                        color: "#27A5BA"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: BLACK,
                    background: WHITE,
                    opacity: 0.5
                },
                errorBars: {
                    color: "#293135"
                },
                candlestick: {
                    downColor: "#c4d0d5",
                    line: {
                        color: "#9aabb2"
                    }
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#9aabb2"
                        }
                    },
                    label: {
                        color: "#293135"
                    },
                    line: {
                        color: "#9aabb2"
                    }
                }
            },
            seriesColors: ["#0069a5", "#0098ee", "#7bd2f6", "#ffb800", "#ff8517", "#e34a00"],
            axisDefaults: {
                line: {
                    color: "#9aabb2"
                },
                labels: {
                    color: "#293135"
                },
                majorGridLines: {
                    color: "#c4d0d5"
                },
                minorGridLines: {
                    color: "#edf1f2"
                },
                title: {
                    color: "#293135"
                },
                crosshair: {
                    color: "#9aabb2"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#9aabb2"
                        }
                    },
                    label: {
                        color: "#293135"
                    },
                    line: {
                        color: "#9aabb2"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#005c83"
            },
            scale: {
                rangePlaceholderColor: "#daecf4",

                labels: {
                    color: "#293135"
                },
                minorTicks: {
                    color: "#293135"
                },
                majorTicks: {
                    color: "#293135"
                },
                line: {
                    color: "#293135"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#7ec6e3",
                connectorDefaults: {
                    background: "#003f59",
                    stroke: {
                        color: WHITE
                    },
                    hover: {
                        background: WHITE,
                        stroke: {
                            color: "#003f59"
                        }
                    }
                },
                content: {
                    color: "#293135"
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#003f59"
                        },
                        hover: {
                            background: "#003f59",
                            stroke: {
                                color: "#003f59"
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: "#003f59"
                        },
                        background: "#003f59"
                    }
                },
                select: {
                    stroke: {
                        color: "#003f59"
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: "#003f59"
                },
                content: {
                    color: "#293135"
                },
                select: {
                    handles: {
                        background: "#3d3d3d",
                        stroke: {
                            color: "#efefef"
                        }
                    }
                }
            }
        }
    });

    registerTheme("highcontrast", {
        chart: {
            title: {
                color: "#ffffff"
            },
            legend: {
                labels: {
                    color: "#ffffff"
                },
                inactiveItems: {
                    labels: {
                        color: "#66465B"
                    },
                    markers: {
                        color: "#66465B"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: "#ffffff"
                },
                errorBars: {
                    color: "#ffffff"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#ffffff"
                        }
                    },
                    label: {
                        color: "#ffffff"
                    },
                    line: {
                        color: "#ffffff"
                    }
                },
                pie: {
                    overlay: {
                        gradient: "sharpGlass"
                    }
                },
                donut: {
                    overlay: {
                        gradient: "sharpGlass"
                    }
                },
                line: {
                    markers: {
                        background: "#2c232b"
                    }
                },
                scatter: {
                    markers: {
                        background: "#2c232b"
                    }
                },
                scatterLine: {
                    markers: {
                        background: "#2c232b"
                    }
                },
                area: {
                    opacity: 0.5
                },
                candlestick: {
                    downColor: "#664e62",
                    line: {
                        color: "#ffffff"
                    },
                    border: {
                        _brightness: 1.5,
                        opacity: 1
                    },
                    highlight: {
                        border: {
                            color: "#ffffff",
                            opacity: 1
                        }
                    }
                },
                ohlc: {
                    line: {
                        color: "#ffffff"
                    }
                }
            },
            chartArea: {
                background: "#2c232b"
            },
            seriesColors: ["#a7008f", "#ffb800", "#3aafff", "#99c900", "#b20753", "#ff4195"],
            axisDefaults: {
                line: {
                    color: "#ffffff"
                },
                labels: {
                    color: "#ffffff"
                },
                majorGridLines: {
                    color: "#664e62"
                },
                minorGridLines: {
                    color: "#4f394b"
                },
                title: {
                    color: "#ffffff"
                },
                crosshair: {
                    color: "#ffffff"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#ffffff"
                        }
                    },
                    label: {
                        color: "#ffffff"
                    },
                    line: {
                        color: "#ffffff"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#a7008f"
            },
            scale: {
                rangePlaceholderColor: "#2c232b",

                labels: {
                    color: "#ffffff"
                },
                minorTicks: {
                    color: "#2c232b"
                },
                majorTicks: {
                    color: "#664e62"
                },
                line: {
                    color: "#ffffff"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#a7018f",
                connectorDefaults: {
                    background: WHITE,
                    stroke: {
                        color: "#2c232b"
                    },
                    hover: {
                        background: "#2c232b",
                        stroke: {
                            color: WHITE
                        }
                    }
                },
                content: {
                    color: WHITE
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: "#2c232b",
                        stroke: {
                            color: WHITE
                        },
                        hover: {
                            background: WHITE,
                            stroke: {
                                color: WHITE
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: WHITE
                        },
                        background: WHITE
                    }
                },
                select: {
                    stroke: {
                        color: WHITE
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: WHITE
                },
                content: {
                    color: WHITE
                },
                select: {
                    handles: {
                        background: "#2c232b",
                        stroke: {
                            color: WHITE
                        }
                    }
                }
            }
        }
    });

    registerTheme("default", {
        chart: {
            title: {
                color: "#8e8e8e"
            },
            legend: {
                labels: {
                    color: "#232323"
                },
                inactiveItems: {
                    labels: {
                        color: "#919191"
                    },
                    markers: {
                        color: "#919191"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: BLACK,
                    background: WHITE,
                    opacity: 0.5
                },
                errorBars: {
                    color: "#232323"
                },
                candlestick: {
                    downColor: "#dedede",
                    line: {
                        color: "#8d8d8d"
                    }
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#8e8e8e"
                        }
                    },
                    label: {
                        color: "#232323"
                    },
                    line: {
                        color: "#8e8e8e"
                    }
                }
            },
            seriesColors: ["#ff6800", "#a0a700", "#ff8d00", "#678900", "#ffb53c", "#396000"],
            axisDefaults: {
                line: {
                    color: "#8e8e8e"
                },
                labels: {
                    color: "#232323"
                },
                minorGridLines: {
                    color: "#f0f0f0"
                },
                majorGridLines: {
                    color: "#dfdfdf"
                },
                title: {
                    color: "#232323"
                },
                crosshair: {
                    color: "#8e8e8e"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#8e8e8e"
                        }
                    },
                    label: {
                        color: "#232323"
                    },
                    line: {
                        color: "#8e8e8e"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#ea7001"
            },
            scale: {
                rangePlaceholderColor: "#dedede",

                labels: {
                    color: "#2e2e2e"
                },
                minorTicks: {
                    color: "#2e2e2e"
                },
                majorTicks: {
                    color: "#2e2e2e"
                },
                line: {
                    color: "#2e2e2e"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#e15613",
                connectorDefaults: {
                    background: "#282828",
                    stroke: {
                        color: WHITE
                    },
                    hover: {
                        background: WHITE,
                        stroke: {
                            color: "#282828"
                        }
                    }
                },
                content: {
                    color: "#2e2e2e"
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#282828"
                        },
                        hover: {
                            background: "#282828",
                            stroke: {
                                color: "#282828"
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: "#282828"
                        },
                        background: "#282828"
                    }
                },
                select: {
                    stroke: {
                        color: "#a7018f"
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: "#282828"
                },
                content: {
                    color: "#2e2e2e"
                },
                select: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#282828"
                        }
                    }
                }
            }
        }
    });

    registerTheme("silver", {
        chart: {
            title: {
                color: "#4e5968"
            },
            legend: {
                labels: {
                    color: "#4e5968"
                },
                inactiveItems: {
                    labels: {
                        color: "#B1BCC8"
                    },
                    markers: {
                        color: "#B1BCC8"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: "#293135",
                    background: "#eaeaec",
                    opacity: 0.5
                },
                errorBars: {
                    color: "#4e5968"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#4e5968"
                        }
                    },
                    label: {
                        color: "#4e5968"
                    },
                    line: {
                        color: "#4e5968"
                    }
                },
                line: {
                    markers: {
                        background: "#eaeaec"
                    }
                },
                scatter: {
                    markers: {
                        background: "#eaeaec"
                    }
                },
                scatterLine: {
                    markers: {
                        background: "#eaeaec"
                    }
                },
                pie: {
                    connectors: {
                        color: "#A6B1C0"
                    }
                },
                donut: {
                    connectors: {
                        color: "#A6B1C0"
                    }
                },
                candlestick: {
                    downColor: "#a6afbe"
                }
            },
            chartArea: {
                background: "#eaeaec"
            },
            seriesColors: ["#007bc3", "#76b800", "#ffae00", "#ef4c00", "#a419b7", "#430B62"],
            axisDefaults: {
                line: {
                    color: "#a6b1c0"
                },
                labels: {
                    color: "#4e5968"
                },
                majorGridLines: {
                    color: "#dcdcdf"
                },
                minorGridLines: {
                    color: "#eeeeef"
                },
                title: {
                    color: "#4e5968"
                },
                crosshair: {
                    color: "#a6b1c0"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#4e5968"
                        }
                    },
                    label: {
                        color: "#4e5968"
                    },
                    line: {
                        color: "#4e5968"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#0879c0"
            },
            scale: {
                rangePlaceholderColor: "#f3f3f4",

                labels: {
                    color: "#515967"
                },
                minorTicks: {
                    color: "#515967"
                },
                majorTicks: {
                    color: "#515967"
                },
                line: {
                    color: "#515967"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#1c82c2",
                connectorDefaults: {
                    background: "#515967",
                    stroke: {
                        color: WHITE
                    },
                    hover: {
                        background: WHITE,
                        stroke: {
                            color: "#282828"
                        }
                    }
                },
                content: {
                    color: "#515967"
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#515967"
                        },
                        hover: {
                            background: "#515967",
                            stroke: {
                                color: "#515967"
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: "#515967"
                        },
                        background: "#515967"
                    }
                },
                select: {
                    stroke: {
                        color: "#515967"
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: "#515967"
                },
                content: {
                    color: "#515967"
                },
                select: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#515967"
                        }
                    }
                }
            }
        }
    });

    registerTheme("metro", {
        chart: {
            title: {
                color: "#777777"
            },
            legend: {
                labels: {
                    color: "#777777"
                },
                inactiveItems: {
                    labels: {
                        color: "#CBCBCB"
                    },
                    markers: {
                        color: "#CBCBCB"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: BLACK
                },
                errorBars: {
                    color: "#777777"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#777777"
                        }
                    },
                    label: {
                        color: "#777777"
                    },
                    line: {
                        color: "#777777"
                    }
                },
                candlestick: {
                    downColor: "#c7c7c7",
                    line: {
                        color: "#787878"
                    }
                },
                overlay: {
                    gradient: "none"
                },
                border: {
                    _brightness: 1
                }
            },
            seriesColors: ["#8ebc00", "#309b46", "#25a0da", "#ff6900", "#e61e26", "#d8e404", "#16aba9", "#7e51a1", "#313131", "#ed1691"],
            axisDefaults: {
                line: {
                    color: "#c7c7c7"
                },
                labels: {
                    color: "#777777"
                },
                minorGridLines: {
                    color: "#c7c7c7"
                },
                majorGridLines: {
                    color: "#c7c7c7"
                },
                title: {
                    color: "#777777"
                },
                crosshair: {
                    color: "#c7c7c7"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#777777"
                        }
                    },
                    label: {
                        color: "#777777"
                    },
                    line: {
                        color: "#777777"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#8ebc00"
            },
            scale: {
                rangePlaceholderColor: "#e6e6e6",

                labels: {
                    color: "#777"
                },
                minorTicks: {
                    color: "#777"
                },
                majorTicks: {
                    color: "#777"
                },
                line: {
                    color: "#777"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#8ebc00",
                connectorDefaults: {
                    background: BLACK,
                    stroke: {
                        color: WHITE
                    },
                    hover: {
                        background: WHITE,
                        stroke: {
                            color: BLACK
                        }
                    }
                },
                content: {
                    color: "#777"
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#787878"
                        },
                        hover: {
                            background: "#787878",
                            stroke: {
                                color: "#787878"
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: "#787878"
                        },
                        background: "#787878"
                    }
                },
                select: {
                    stroke: {
                        color: "#515967"
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: "#787878"
                },
                content: {
                    color: "#777"
                },
                select: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#787878"
                        }
                    }
                }
            }
        }
    });

    registerTheme("metroblack", {
        chart: {
            title: {
                color: "#ffffff"
            },
            legend: {
                labels: {
                    color: "#ffffff"
                },
                inactiveItems: {
                    labels: {
                        color: "#797979"
                    },
                    markers: {
                        color: "#797979"
                    }
                }
            },
            seriesDefaults: {
                border: {
                    _brightness: 1
                },
                labels: {
                    color: "#ffffff"
                },
                errorBars: {
                    color: "#ffffff"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#cecece"
                        }
                    },
                    label: {
                        color: "#ffffff"
                    },
                    line: {
                        color: "#cecece"
                    }
                },
                line: {
                    markers: {
                        background: "#0e0e0e"
                    }
                },
                bubble: {
                    opacity: 0.6
                },
                scatter: {
                    markers: {
                        background: "#0e0e0e"
                    }
                },
                scatterLine: {
                    markers: {
                        background: "#0e0e0e"
                    }
                },
                candlestick: {
                    downColor: "#828282",
                    line: {
                        color: "#ffffff"
                    }
                },
                overlay: {
                    gradient: "none"
                }
            },
            chartArea: {
                background: "#0e0e0e"
            },
            seriesColors: ["#00aba9", "#309b46", "#8ebc00", "#ff6900", "#e61e26", "#d8e404", "#25a0da", "#7e51a1", "#313131", "#ed1691"],
            axisDefaults: {
                line: {
                    color: "#cecece"
                },
                labels: {
                    color: "#ffffff"
                },
                minorGridLines: {
                    color: "#2d2d2d"
                },
                majorGridLines: {
                    color: "#333333"
                },
                title: {
                    color: "#ffffff"
                },
                crosshair: {
                    color: "#cecece"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#cecece"
                        }
                    },
                    label: {
                        color: "#ffffff"
                    },
                    line: {
                        color: "#cecece"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#00aba9"
            },
            scale: {
                rangePlaceholderColor: "#2d2d2d",

                labels: {
                    color: "#ffffff"
                },
                minorTicks: {
                    color: "#333333"
                },
                majorTicks: {
                    color: "#cecece"
                },
                line: {
                    color: "#cecece"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#00aba9",
                connectorDefaults: {
                    background: WHITE,
                    stroke: {
                        color: "#0e0e0e"
                    },
                    hover: {
                        background: "#0e0e0e",
                        stroke: {
                            color: WHITE
                        }
                    }
                },
                content: {
                    color: WHITE
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: "#0e0e0e",
                        stroke: {
                            color: "#787878"
                        },
                        hover: {
                            background: "#787878",
                            stroke: {
                                color: "#787878"
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: WHITE
                        },
                        background: WHITE
                    }
                },
                select: {
                    stroke: {
                        color: "#787878"
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: WHITE
                },
                content: {
                    color: WHITE
                },
                select: {
                    handles: {
                        background: "#0e0e0e",
                        stroke: {
                            color: WHITE
                        }
                    }
                }
            }
        }
    });

    registerTheme("moonlight", {
        chart: {
            title: {
                color: "#ffffff"
            },
            legend: {
                labels: {
                    color: "#ffffff"
                },
                inactiveItems: {
                    labels: {
                        color: "#A1A7AB"
                    },
                    markers: {
                        color: "#A1A7AB"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: "#ffffff"
                },
                errorBars: {
                    color: "#ffffff"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#8c909e"
                        }
                    },
                    label: {
                        color: "#ffffff"
                    },
                    line: {
                        color: "#8c909e"
                    }
                },
                pie: {
                    overlay: {
                        gradient: "sharpBevel"
                    }
                },
                donut: {
                    overlay: {
                        gradient: "sharpGlass"
                    }
                },
                line: {
                    markers: {
                        background: "#212a33"
                    }
                },
                bubble: {
                    opacity: 0.6
                },
                scatter: {
                    markers: {
                        background: "#212a33"
                    }
                },
                scatterLine: {
                    markers: {
                        background: "#212a33"
                    }
                },
                area: {
                    opacity: 0.3
                },
                candlestick: {
                    downColor: "#757d87",
                    line: {
                        color: "#ea9d06"
                    },
                    border: {
                        _brightness: 1.5,
                        opacity: 1
                    },
                    highlight: {
                        border: {
                            color: WHITE,
                            opacity: 0.2
                        }
                    }
                },
                ohlc: {
                    line: {
                        color: "#ea9d06"
                    }
                }
            },
            chartArea: {
                background: "#212a33"
            },
            seriesColors: ["#ffca08", "#ff710f", "#ed2e24", "#ff9f03", "#e13c02", "#a00201"],
            axisDefaults: {
                line: {
                    color: "#8c909e"
                },
                minorTicks: {
                    color: "#8c909e"
                },
                majorTicks: {
                    color: "#8c909e"
                },
                labels: {
                    color: "#ffffff"
                },
                majorGridLines: {
                    color: "#3e424d"
                },
                minorGridLines: {
                    color: "#2f3640"
                },
                title: {
                    color: "#ffffff"
                },
                crosshair: {
                    color: "#8c909e"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#8c909e"
                        }
                    },
                    label: {
                        color: "#ffffff"
                    },
                    line: {
                        color: "#8c909e"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#f4af03"
            },
            scale: {
                rangePlaceholderColor: "#2f3640",

                labels: {
                    color: WHITE
                },
                minorTicks: {
                    color: "#8c909e"
                },
                majorTicks: {
                    color: "#8c909e"
                },
                line: {
                    color: "#8c909e"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#f3ae03",
                connectorDefaults: {
                    background: WHITE,
                    stroke: {
                        color: "#414550"
                    },
                    hover: {
                        background: "#414550",
                        stroke: {
                            color: WHITE
                        }
                    }
                },
                content: {
                    color: WHITE
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: "#414550",
                        stroke: {
                            color: WHITE
                        },
                        hover: {
                            background: WHITE,
                            stroke: {
                                color: WHITE
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: WHITE
                        },
                        background: WHITE
                    }
                },
                select: {
                    stroke: {
                        color: WHITE
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: WHITE
                },
                content: {
                    color: WHITE
                },
                select: {
                    handles: {
                        background: "#414550",
                        stroke: {
                            color: WHITE
                        }
                    }
                }
            }
        }
    });
    registerTheme("uniform", {
        chart: {
            title: {
                color: "#686868"
            },
            legend: {
                labels: {
                    color: "#686868"
                },
                inactiveItems: {
                    labels: {
                        color: "#B6B6B6"
                    },
                    markers: {
                        color: "#B6B6B6"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: "#686868"
                },
                errorBars: {
                    color: "#686868"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#9e9e9e"
                        }
                    },
                    label: {
                        color: "#686868"
                    },
                    line: {
                        color: "#9e9e9e"
                    }
                },
                pie: {
                    overlay: {
                        gradient: "sharpBevel"
                    }
                },
                donut: {
                    overlay: {
                        gradient: "sharpGlass"
                    }
                },
                line: {
                    markers: {
                        background: "#ffffff"
                    }
                },
                bubble: {
                    opacity: 0.6
                },
                scatter: {
                    markers: {
                        background: "#ffffff"
                    }
                },
                scatterLine: {
                    markers: {
                        background: "#ffffff"
                    }
                },
                area: {
                    opacity: 0.3
                },
                candlestick: {
                    downColor: "#cccccc",
                    line: {
                        color: "#cccccc"
                    },
                    border: {
                        _brightness: 1.5,
                        opacity: 1
                    },
                    highlight: {
                        border: {
                            color: "#cccccc",
                            opacity: 0.2
                        }
                    }
                },
                ohlc: {
                    line: {
                        color: "#cccccc"
                    }
                }
            },
            chartArea: {
                background: "#ffffff"
            },
            seriesColors: ["#527aa3", "#6f91b3", "#8ca7c2", "#a8bdd1", "#c5d3e0", "#e2e9f0"],
            axisDefaults: {
                line: {
                    color: "#9e9e9e"
                },
                minorTicks: {
                    color: "#aaaaaa"
                },
                majorTicks: {
                    color: "#888888"
                },
                labels: {
                    color: "#686868"
                },
                majorGridLines: {
                    color: "#dadada"
                },
                minorGridLines: {
                    color: "#e7e7e7"
                },
                title: {
                    color: "#686868"
                },
                crosshair: {
                    color: "#9e9e9e"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#9e9e9e"
                        }
                    },
                    label: {
                        color: "#686868"
                    },
                    line: {
                        color: "#9e9e9e"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#527aa3"
            },
            scale: {
                rangePlaceholderColor: "#e7e7e7",

                labels: {
                    color: "#686868"
                },
                minorTicks: {
                    color: "#aaaaaa"
                },
                majorTicks: {
                    color: "#888888"
                },
                line: {
                    color: "#9e9e9e"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#d1d1d1",
                connectorDefaults: {
                    background: "#686868",
                    stroke: {
                        color: WHITE
                    },
                    hover: {
                        background: WHITE,
                        stroke: {
                            color: "#686868"
                        }
                    }
                },
                content: {
                    color: "#686868"
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#686868"
                        },
                        hover: {
                            background: "#686868",
                            stroke: {
                                color: "#686868"
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: "#686868"
                        },
                        background: "#686868"
                    }
                },
                select: {
                    stroke: {
                        color: "#686868"
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: "#686868"
                },
                content: {
                    color: "#686868"
                },
                select: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#686868"
                        }
                    }
                }
            }
        }
    });

    registerTheme("bootstrap", {
        chart: {
            title: {
                color: "#333333"
            },
            legend: {
                labels: {
                    color: "#333333"
                },
                inactiveItems: {
                    labels: {
                        color: "#999999"
                    },
                    markers: {
                        color: "#9A9A9A"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: "#333333"
                },
                overlay: {
                    gradient: "none"
                },
                errorBars: {
                    color: "#343434"
                },
                notes: {
                    icon: {
                        background: "#000000",
                        border: {
                            color: "#000000"
                        }
                    },
                    label: {
                        color: "#ffffff"
                    },
                    line: {
                        color: "#000000"
                    }
                },
                pie: {
                    overlay: {
                        gradient: "none"
                    }
                },
                donut: {
                    overlay: {
                        gradient: "none"
                    }
                },
                line: {
                    markers: {
                        background: "#ffffff"
                    }
                },
                bubble: {
                    opacity: 0.6
                },
                scatter: {
                    markers: {
                        background: "#ffffff"
                    }
                },
                scatterLine: {
                    markers: {
                        background: "#ffffff"
                    }
                },
                area: {
                    opacity: 0.8
                },
                candlestick: {
                    downColor: "#d0d0d0",
                    line: {
                        color: "#333333"
                    },
                    border: {
                        _brightness: 1.5,
                        opacity: 1
                    },
                    highlight: {
                        border: {
                            color: "#b8b8b8",
                            opacity: 0.2
                        }
                    }
                },
                ohlc: {
                    line: {
                        color: "#333333"
                    }
                }
            },
            chartArea: {
                background: "#ffffff"
            },
            seriesColors: ["#428bca", "#5bc0de", "#5cb85c", "#f2b661", "#e67d4a", "#da3b36"],
            axisDefaults: {
                line: {
                    color: "#cccccc"
                },
                minorTicks: {
                    color: "#ebebeb"
                },
                majorTicks: {
                    color: "#cccccc"
                },
                labels: {
                    color: "#333333"
                },
                majorGridLines: {
                    color: "#cccccc"
                },
                minorGridLines: {
                    color: "#ebebeb"
                },
                title: {
                    color: "#333333"
                },
                crosshair: {
                    color: "#000000"
                },
                notes: {
                    icon: {
                        background: "#000000",
                        border: {
                            color: "#000000"
                        }
                    },
                    label: {
                        color: "#ffffff"
                    },
                    line: {
                        color: "#000000"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#428bca"
            },
            scale: {
                rangePlaceholderColor: "#cccccc",
                labels: {
                    color: "#333333"
                },
                minorTicks: {
                    color: "#ebebeb"
                },
                majorTicks: {
                    color: "#cccccc"
                },
                line: {
                    color: "#cccccc"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#428bca",
                connectorDefaults: {
                    background: "#333333",
                    stroke: {
                        color: WHITE
                    },
                    hover: {
                        background: WHITE,
                        stroke: {
                            color: "#333333"
                        }
                    }
                },
                content: {
                    color: "#333333"
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#333333"
                        },
                        hover: {
                            background: "#333333",
                            stroke: {
                                color: "#333333"
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: "#333333"
                        },
                        background: "#333333"
                    }
                },
                select: {
                    stroke: {
                        color: "#333333"
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: "#c4c4c4"
                },
                content: {
                    color: "#333333"
                },
                select: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#333333"
                        }
                    },
                    stroke: {
                        color: "#333333"
                    }
                }
            }
        }
    });

    registerTheme("flat", {
            chart: {
            title: {
                color: "#4c5356"
            },
            legend: {
                labels: {
                    color: "#4c5356"
                },
                inactiveItems: {
                    labels: {
                        color: "#CBCBCB"
                    },
                    markers: {
                        color: "#CBCBCB"
                    }
                }
            },
            seriesDefaults: {
                labels: {
                    color: "#4c5356"
                },
                errorBars: {
                    color: "#4c5356"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#cdcdcd"
                        }
                    },
                    label: {
                        color: "#4c5356"
                    },
                    line: {
                        color: "#cdcdcd"
                    }
                },
                candlestick: {
                    downColor: "#c7c7c7",
                    line: {
                        color: "#787878"
                    }
                },
                area: {
                    opacity: 0.9
                },
                overlay: {
                    gradient: "none"
                },
                border: {
                    _brightness: 1
                }
            },
            seriesColors: ["#10c4b2", "#ff7663", "#ffb74f", "#a2df53", "#1c9ec4", "#ff63a5", "#1cc47b"],
            axisDefaults: {
                line: {
                    color: "#cdcdcd"
                },
                labels: {
                    color: "#4c5356"
                },
                minorGridLines: {
                    color: "#cdcdcd"
                },
                majorGridLines: {
                    color: "#cdcdcd"
                },
                title: {
                    color: "#4c5356"
                },
                crosshair: {
                    color: "#cdcdcd"
                },
                notes: {
                    icon: {
                        background: "transparent",
                        border: {
                            color: "#cdcdcd"
                        }
                    },
                    label: {
                        color: "#4c5356"
                    },
                    line: {
                        color: "#cdcdcd"
                    }
                }
            }
        },
        gauge: {
            pointer: {
                color: "#10c4b2"
            },
            scale: {
                rangePlaceholderColor: "#cdcdcd",

                labels: {
                    color: "#4c5356"
                },
                minorTicks: {
                    color: "#4c5356"
                },
                majorTicks: {
                    color: "#4c5356"
                },
                line: {
                    color: "#4c5356"
                }
            }
        },
        diagram: {
            shapeDefaults: {
                background: "#10c4b2",
                connectorDefaults: {
                    background: "#363940",
                    stroke: {
                        color: WHITE
                    },
                    hover: {
                        background: WHITE,
                        stroke: {
                            color: "#363940"
                        }
                    }
                },
                content: {
                    color: "#4c5356"
                }
            },
            editable: {
                resize: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#363940"
                        },
                        hover: {
                            background: "#363940",
                            stroke: {
                                color: "#363940"
                            }
                        }
                    }
                },
                rotate: {
                    thumb: {
                        stroke: {
                            color: "#363940"
                        },
                        background: "#363940"
                    }
                },
                select: {
                    stroke: {
                        color: "#363940"
                    }
                }
            },
            connectionDefaults: {
                stroke: {
                    color: "#cdcdcd"
                },
                content: {
                    color: "#4c5356"
                },
                select: {
                    handles: {
                        background: WHITE,
                        stroke: {
                            color: "#363940"
                        }
                    },
                    stroke: {
                        color: "#363940"
                    }
                }
            }
        }
    });

})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });