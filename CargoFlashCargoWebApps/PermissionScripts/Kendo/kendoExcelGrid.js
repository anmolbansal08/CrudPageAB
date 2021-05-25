(function ($) {
    var kendo = window.kendo;

    var ExcelGrid = kendo.ui.Grid.extend({
        init: function (element, options) {
            var that = this;

            if (options.excel) {
                options.excel = $.extend(
                    {
                        cssClass: "k-i-expand"      // If the exportCssClass is not defined, then set a default image.
                    },
                    options.excel);

                // Add the export toolbar button.
                options.toolbar = $.merge([
                    {
                        name: "export",
                        template: kendo.format("<a class='k-button k-button-icontext k-grid-export' title='Export to Excel'><div class='{0} k-icon'></div>Export</a>", options.excel.cssClass)
                    }
                ], options.toolbar || []);
            }

            // Initialize the grid.
            kendo.ui.Grid.fn.init.call(that, element, options);

            // Add an event handler for the Export button.
            $(element).on("click", ".k-grid-export", { sender: that }, function (e) {
                e.data.sender.exportToExcel();
            });
        },

        options: {
            name: "ExcelGrid"
        },

        exportToExcel: function () {
            var that = this;

            // Create a datasource for the export data.
            var ds = new kendo.data.DataSource({
                data: that.dataSource.data()
            });
            ds.query({
                aggregate: that.dataSource._aggregate,
                filter: that.dataSource._filter,
                sort: that.dataSource._sort
            });

            // Define the data to be sent to the server to create the spreadsheet.
            data = {
                model: JSON.stringify(that.columns),
                data: JSON.stringify(ds._view),
                title: that.options.excel.title
            };

            // Create the spreadsheet.
            $.ajax({
                type: "POST",
                url: that.options.excel.createUrl,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data)
            })
            .done(function (e) {
                // Download the spreadsheet.
                window.location = kendo.format("{0}?title={1}",
                    that.options.excel.downloadUrl,
                    that.options.excel.title);
            });
        }
    });

    kendo.ui.plugin(ExcelGrid);
})(jQuery);