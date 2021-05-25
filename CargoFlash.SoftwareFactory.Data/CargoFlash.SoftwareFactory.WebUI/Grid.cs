using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Data;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.Cargo.Model;

namespace CargoFlash.SoftwareFactory.WebUI.Controls
{
    public class Grid : IDisposable
    {
        /// <summary>
        /// Properties of grid class
        /// </summary>
        public string GridID { get; set; }
        public string DataSoruceUrl { get; set; }
        public string ReadGridUrl { get; set; }
        public string EditGridUrl { get; set; }
        public string DeleteGridUrl { get; set; }
        public string PrimaryID { get; set; }
        public Int64 UserID { get; set; }
        public bool IsChild { get; set; }
        public bool IsAllowedPaging { get; set; }
        public bool IsAllowedSorting { get; set; }
        public bool IsAllowedFiltering { get; set; }
        public bool IsAllowedAction { get; set; }
        public bool IsAllowedScrolling { get; set; }
        public bool IsAllowedGrouping { get; set; }
        public bool IsAutoHeight { get; set; }
        public int Height { get; set; }
        public string DefaultSortName { get; set; }
        public string SortDirection { get; set; }
        public string ActionDirection { get; set; }
        public int DefaultPageSize { get; set; }
        public string ModuleName { get; set; }
        public string AppsName { get; set; }
        public string ActionName { get; set; }
        public string PageName { get; set; }
        public string GroupColumnName { get; set; }
        public string CommandButtonNewText { get; set; }
        public string FormCaptionText { get; set; }
        public string NewURL { get; set; }
        public List<GridColumn> Column { get; set; }
        public List<GridAction> Action { get; set; }
        public bool IsFormHeader { get; set; }
        public bool IsModule { get; set; }
        public bool IsShowEdit { get; set; }
        public string EditName { get; set; }
        public string ReadName { get; set; }
        public bool IsShowDelete { get; set; }
        public string DeleteName { get; set; }
        public string ServiceModuleName { get; set; }
        public bool IsSaveChanges { set; get; }
        public bool IsAddNewRecord { set; get; }
        public int EditingMode { set; get; }
        public string NestedGridUrl { get; set; }
        public bool IsColumnMenu { set; get; }
        public bool IsToggleColumns { set; get; }
        public string ActionTitle { get; set; }
        public string SuccessGrid { get; set; }
        public string ErrorGrid { get; set; }
        public bool ShowActionOnRight { get; set; }
        public bool IsActionRequired { get; set; }
        public bool IsPagable { get; set; }
        public bool IsToolBarRatioButton { get; set; }
        public List<GridAggregate> Aggregate { get; set; }
        public List<GridExtraParam> ExtraParam { get; set; }
        public string ExtraSearchCondition { get; set; }
        public bool IsExportToExcel { get; set; }
        public string ReportID { get; set; }
        public string AllowedAction { get; set; }

        public List<PageRights> PageRights { get; set; }
        public bool IsReloadOnScroll { get; set; }
        public bool IsRowChange { get; set; }//added by Manoj Kumar on2.7.2015
        public bool IsRowDataBound { get; set; }//added by Manoj Kumar on2.7.2015
        //   public string ActionWidth { get; set; }//added
        public bool IsAutoBind { get; set; }
        public bool IsToolBar { get; set; }
        public bool IsAllExport { get; set; }
        public bool IsCurrentExport { get; set; }
        public bool IsVirtualScroll { get; set; }
        public bool IsPageable { get; set; }
        public bool IsGroupable { get; set; }
        public bool IsSortable { get; set; }
        public bool IsAllowCopy { get; set; }
        public bool IsFilterable { get; set; }
        public bool IsRowFilter { get; set; }
        public bool IsDisplayOnly { get; set; }
        public bool IsProcessPart { get; set; }
        public string ProcessName { get; set; }
        public bool IsPageSizeChange { get; set; }
        public bool IsPager { get; set; }
        public bool IsOnlyTotalDisplay { get; set; }
        public bool IsRefresh { get; set; }
        public string SuccessOnBlank { get; set; }

        /// <summary>
        /// Default contructor of the Grid Claas
        /// </summary>
        public Grid()
        {
            Guid gid = Guid.NewGuid();

            this.GridID = gid.ToString();
            this.IsRowChange = false;//added by Manoj Kumar on2.7.2015
            this.IsRowDataBound = false;//added by Manoj Kumar on2.7.2015
            this.Height = 400;
            this.DefaultPageSize = 10;
            this.DefaultSortName = "asc";
            this.SortDirection = "left";
            this.IsAllowedAction = true;
            this.IsAllowedFiltering = true;
            this.IsAllowedGrouping = false;
            this.IsAllowedPaging = true;
            this.IsAllowedSorting = true;
            this.IsAllowedScrolling = true;
            this.IsFormHeader = true;
            this.IsModule = false;
            this.IsShowEdit = true;
            this.EditName = "Edit";
            this.ReadName = "Read";
            this.IsShowDelete = true;
            this.DeleteName = "Delete";
            this.IsSaveChanges = false;
            this.IsAddNewRecord = false;
            this.EditingMode = 1;
            this.IsAutoHeight = true;
            this.IsColumnMenu = true;
            this.IsToggleColumns = true;
            this.ActionTitle = "Action";
            this.ShowActionOnRight = false;
            this.IsActionRequired = true;
            this.IsPagable = true;
            this.SuccessGrid = "addToolBar";
            this.IsToolBarRatioButton = true;
            this.IsExportToExcel = true;
            this.ReportID = "";
            this.IsReloadOnScroll = false;

            this.IsAutoBind = true;
            this.IsToolBar = false;
            this.IsAllExport = false;
            this.IsCurrentExport = false;
            this.IsVirtualScroll = true;
            this.IsPageable = true;
            this.IsGroupable = false;
            this.IsSortable = true;
            this.IsAllowCopy = true;
            this.IsFilterable = true;
            this.IsRowFilter = true;
            this.IsDisplayOnly = false;
            this.IsProcessPart = false;
            this.ProcessName = "";
            this.IsPageSizeChange = true;
            this.IsPager = true;
            this.IsOnlyTotalDisplay = false;
            this.IsRefresh = true;
            this.SuccessOnBlank = "";

        }

        /// <summary>
        /// Paremeterized contructor of the Grid Claas
        /// </summary>
        public Grid(string AllowedAction)
        {
            Guid gid = Guid.NewGuid();
            this.GridID = gid.ToString();
            this.Height = 400;
            this.DefaultPageSize = 10;
            this.DefaultSortName = "asc";
            this.SortDirection = "left";
            this.IsAllowedAction = true;
            this.IsAllowedFiltering = true;
            this.IsAllowedGrouping = false;
            this.IsAllowedPaging = true;
            this.IsAllowedSorting = true;
            this.IsAllowedScrolling = true;
            this.IsFormHeader = true;
            this.IsModule = false;
            this.IsShowEdit = true;
            this.EditName = "EDIT";
            this.ReadName = "Read";
            this.IsShowDelete = true;
            this.DeleteName = "Delete";
            this.IsSaveChanges = false;
            this.IsAddNewRecord = false;
            this.EditingMode = 1;
            this.IsAutoHeight = true;
            this.IsColumnMenu = true;
            this.IsToggleColumns = true;
            this.ActionTitle = "Action";
            this.ShowActionOnRight = false;
            this.IsActionRequired = true;
            this.IsPagable = true;
            this.SuccessGrid = "addToolBar";
            this.IsToolBarRatioButton = true;
            this.IsExportToExcel = true;
            this.ReportID = "";
            this.AllowedAction = AllowedAction;
            this.IsReloadOnScroll = false;
            this.IsRowChange = false;//Added by Manoj Kumar on 2.7.2015
            this.IsRowDataBound = false;//Added by Manoj Kumar on 2.7.2015

            this.IsAutoBind = true;
            this.IsToolBar = false;
            this.IsAllExport = false;
            this.IsCurrentExport = false;
            this.IsVirtualScroll = true;
            this.IsPageable = true;
            this.IsGroupable = true;
            this.IsSortable = true;
            this.IsAllowCopy = true;
            this.IsFilterable = true;
            this.IsRowFilter = true;
            this.IsProcessPart = false;
            this.ProcessName = "";
            this.IsPageSizeChange = true;
            this.IsPager = true;
            this.IsOnlyTotalDisplay = true;
            this.IsRefresh = true;
            this.SuccessOnBlank = "";
        }


        /// <summary>
        /// 
        /// </summary>
        public void InstantiateIn(StringBuilder gridString)
        {
            this.PageRights = ((CargoFlash.Cargo.Model.UserLogin)HttpContext.Current.Session["UserDetail"]).PageRights.Where(e => e.Apps == this.AppsName).Select(e => new PageRights { Apps = e.Apps, PageRight = e.PageRight }).ToList(); //HttpContext.Current.Session["PageRights"] == null ? "ALL" : HttpContext.Current.Session["PageRights"].ToString();
            string url = PageName + "?Module=" + this.ModuleName + "&Apps=" + this.AppsName + "&FormAction=";
            string targetParamRead = url + "Read&UserID=" + this.UserID + "&RecID=";
            string targetParamEdit = url + "Edit&UserID=" + this.UserID + "&RecID=";
            string targetParamDelete = url + "Delete&UserID=" + this.UserID + "&RecID=";
            StringBuilder strAction = new StringBuilder("");
            if (IsDisplayOnly)
            {
                this.IsFormHeader = false;
                this.IsToolBar = false;
                this.IsGroupable = false;
                this.IsRowFilter = false;
                this.IsFilterable = false;
                this.IsCurrentExport = false;
                this.IsAllExport = false;
                this.IsActionRequired = false;
                //this.IsPageable = false;
            }
            if (IsFormHeader)
            {

                gridString.Append("<table class='WebFormTable'><tr><td class='formSection' colspan='2'>" + this.FormCaptionText + "</td></tr><tr align='right'><td class='form2buttonrow'>");
                if (!string.IsNullOrWhiteSpace(this.CommandButtonNewText))
                {
                    gridString.Append("<input type='button' value='" + this.CommandButtonNewText + "'  onclick=navigateUrl('" + this.NewURL + "');  class='btn btn-info' />");
                }
                if (!string.IsNullOrWhiteSpace(this.ExtraSearchCondition))
                {
                    gridString.Append(this.ExtraSearchCondition);
                }
                if (!string.IsNullOrWhiteSpace(this.ExtraSearchCondition))
                {
                    gridString.Append("<tr><td colspan='2'>");
                    gridString.Append(this.ExtraSearchCondition);
                    gridString.Append("</td></tr>");
                }
                if (IsActionRequired)
                {
                    gridString.Append("<div id='header-user-options' style='top:32px; right: auto; z-index: 120; opacity: 1; float: right; display: none;' class='header-tool-container gradient tool-top tool-rounded'><div class='tool-items'>");
                    if (Action == null || Action.Count == 0)
                    {
                        if (this.PageRights.Where(e => e.PageRight.ToUpper() == "READ").Any())
                            gridString.Append("<a class='tool-item gradient' href=\"" + targetParamRead + "\"><i class=\"icon-read\"><span class=\"actionSpan\">" + ReadName + "</span></i></a>");
                        if (this.PageRights.Where(e => e.PageRight.ToUpper() == "EDIT").Any())
                            gridString.Append("<a class='tool-item gradient' href=\"" + targetParamEdit + "\"><i class=\"icon-edit\"><span class=\"actionSpan\">" + EditName + "</span></i></a>");
                        if (IsShowDelete && (this.PageRights.Where(e => e.PageRight.ToUpper() == "DELETE").Any()))
                            gridString.Append("<a class='tool-item gradient' href=\"" + targetParamDelete + "\"><i class=\"icon-trash\"><span class=\"actionSpan\">Delete</span></i></a>");
                    }
                    else
                    {
                        gridString.Append(String.Join(" ", Action.Select(e => e.ToString(PageName, this.PrimaryID, this.UserID, this.IsToolBarRatioButton, true)).ToArray()));
                    }
                    gridString.Append("</div></div>");
                }
                gridString.Append("<tr><td colspan='2'>");
            }
            else
            {
                if (this.FormCaptionText.Trim() == "")
                {
                    gridString.Append("<table class='WebFormTable'><tr><td colspan='2'>");
                }
                else
                {
                    gridString.Append("<table class='WebFormTable'><tr><td class='formSection' colspan='2'>" + this.FormCaptionText + "</td></tr><tr><td colspan='2'>");
                }

                if (!string.IsNullOrWhiteSpace(this.ExtraSearchCondition))
                {
                    gridString.Append(this.ExtraSearchCondition);
                    gridString.Append("</td></tr><tr><td colspan='2'>");
                }
            }
            if (string.IsNullOrEmpty(this.DataSoruceUrl))
                this.DataSoruceUrl = "Services/" + (string.IsNullOrEmpty(this.ServiceModuleName) ? "" : this.ServiceModuleName + "/") + this.AppsName + "Service.svc/GetGridData";

            gridString.Append("<div id=\"" + this.GridID + "\">");
            gridString.Append("</div>");
            gridString.Append("<script type=\"text/javascript\">");
            //gridString.Append("$(document).ready(function () { StartProgress();");
            gridString.Append("$(document).ready(function () { ");
            gridString.Append("$(\"#" + this.GridID + "\").kendoGrid({");


            gridString.Append("autoBind: " + this.IsAutoBind.ToString().ToLower() + ",");
            gridString.Append("groupable: " + this.IsGroupable.ToString().ToLower() + ",");

            if (this.IsAllowCopy)
            {
                gridString.Append("selectable: 'row',");
            }
            else
            {
                gridString.Append("selectable: 'row',");
            }
            gridString.Append("allowCopy: " + this.IsAllowCopy.ToString().ToLower() + ",");

            this.IsToolBar = this.IsToolBar || this.IsAllExport || this.IsCurrentExport;

            if (this.IsToolBar)
            {
                gridString.Append("toolbar: [");
                if (!string.IsNullOrWhiteSpace(this.CommandButtonNewText) && IsFormHeader && (this.PageRights.Where(e => e.PageRight.ToUpper() == "NEW").Any()))
                {
                    gridString.Append("'create'");
                    if (this.IsAllExport || this.IsCurrentExport)
                        gridString.Append(",");
                }

                if (this.IsAllExport)
                    gridString.Append("'allexcel'");

                if (this.IsAllExport && this.IsCurrentExport)
                    gridString.Append(",");

                if (this.IsCurrentExport)
                    gridString.Append("'excel'");

                gridString.Append("],");
            }


            if (!string.IsNullOrWhiteSpace(this.CommandButtonNewText) && IsFormHeader && (this.PageRights.Where(e => e.PageRight.ToUpper() == "NEW").Any()))
            {
                gridString.Append("create: {");
                gridString.Append("cssClass: 'btn btn-info btn-grid-create',");
                gridString.Append("navigateUrl: '" + this.NewURL + "',");
                gridString.Append("title: '" + CommandButtonNewText + "'");
                gridString.Append("},");
            }

            if (this.IsCurrentExport)
            {
                gridString.Append("excel: {");
                gridString.Append("cssClass: 'k-grid-export-image',");
                gridString.Append("fileName: '" + (string.IsNullOrEmpty(this.ReportID) == true ? this.AppsName : this.ReportID) + "'");
                gridString.Append("},");
            }

            if (this.IsAllExport)
            {
                gridString.Append("allexcel: {");
                gridString.Append("cssClass: 'k-grid-exportAll-image',");
                gridString.Append("fileName: 'All_" + (string.IsNullOrEmpty(this.ReportID) == true ? this.AppsName : this.ReportID) + "'");
                gridString.Append("},");
            }

            if (this.IsPageable)
            {
                gridString.Append("pageable: {");
                gridString.Append("refresh:" + this.IsRefresh.ToString().ToLower() + ",");
                gridString.Append("pageSizes: " + this.IsPageSizeChange.ToString().ToLower() + ",");
                gridString.Append("previousNext: " + this.IsPager.ToString().ToLower() + ",");
                gridString.Append("numeric: " + this.IsPager.ToString().ToLower() + ",");
                gridString.Append("buttonCount: 5,");
                gridString.Append("totalinfo: " + this.IsOnlyTotalDisplay.ToString().ToLower() + ",");
                gridString.Append("},");
            }
            if (this.IsVirtualScroll)
            {
                gridString.Append("scrollable: {");
                gridString.Append(" virtual: true");
                gridString.Append("},");
            }

            gridString.Append("sortable : " + this.IsSortable.ToString().ToLower() + ",");
            gridString.Append("filterable : " + this.IsFilterable.ToString().ToLower() + ",");
            if (this.IsRowFilter)
            {
                gridString.Append("filterable: {");
                gridString.Append(" mode: 'menu'");
                gridString.Append("},");
            }

            gridString.Append("dataBound: onGridDataBound,");
            if (this.IsRowChange)
            {
                gridString.Append("change: onRowChange,");
            }

            gridString.Append("dataSource: {");
            gridString.Append("type: \"json\",");
            gridString.Append("serverPaging: " + this.IsAllowedPaging.ToString().ToLower() + ",");
            gridString.Append("serverSorting: " + this.IsAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("serverFiltering: " + this.IsAllowedFiltering.ToString().ToLower() + ",");
            gridString.Append("allowUnsort:  " + this.IsAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("pageSize: " + this.DefaultPageSize.ToString() + ",");
            gridString.Append("transport: {");
            gridString.Append("read: {");
            gridString.Append("url: \"" + this.DataSoruceUrl + "\",");
            gridString.Append("dataType: \"json\",");
            gridString.Append("type: \"POST\",");
            gridString.Append("contentType: \"application/json; charset=utf-8\",");
            gridString.Append("queryString: '',");
            gridString.Append("sortString: '',");
            gridString.Append("storedProcedure: '',");
            if (!string.IsNullOrEmpty(this.SuccessGrid))
            {
                gridString.Append("success: " + this.SuccessGrid + ",");
            }
            if (!string.IsNullOrEmpty(this.ErrorGrid))
            {
                gridString.Append("error: " + this.ErrorGrid + ",");
            }
            if (!string.IsNullOrEmpty(this.SuccessOnBlank))
            {
                gridString.Append("successonblank: " + this.SuccessOnBlank + ",");
            }
            //if (this.IsNew)
            //{
            //    gridString.Append("create: CreateUrl,");

            //}
            string extraParam = "";
            if (ExtraParam != null)
            {
                extraParam = String.Join(",", ExtraParam.Select(e => e.ToString()).ToArray());
                extraParam = extraParam.Substring(0, extraParam.Length);
            }
            gridString.Append("data: {" + extraParam + "}");

            gridString.Append("},");
            gridString.Append("parameterMap: function (options) {");
            gridString.Append("if (options.filter == undefined)");
            gridString.Append("options.filter = null;");
            gridString.Append("if (options.sort == undefined)");
            gridString.Append("options.sort = null;");
            gridString.Append("return JSON.stringify(options);");
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("schema: {");
            gridString.Append("model: {");
            gridString.Append("id: \"" + this.PrimaryID + "\",");
            gridString.Append("fields: {");
            string strSchema = String.Join(",", Column.Select(e => e.ToString(true, false, false, false, false)).ToArray());
            string strColSchema = strSchema;
            if (this.IsProcessPart)
            {
                this.GetProcessConfiguration(this.ProcessName);
                strColSchema = strColSchema + "" + new GridColumn().ToProcessString(true);
            }
            gridString.Append(strColSchema.Substring(0, strSchema.Length));
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("data: function (data) {");
            gridString.Append("return data.Data;");
            gridString.Append("},");
            gridString.Append("total: function (data) {");
            gridString.Append("return data.Total;");
            gridString.Append("},");
            gridString.Append("}");
            string strAggregate = "";
            if (Aggregate != null)
            {
                strAggregate = String.Join(",", Aggregate.Select(e => e.ToString()).ToArray());
            }
            if (!string.IsNullOrEmpty(this.GroupColumnName))
            {
                gridString.Append(",group: { field: \"" + this.GroupColumnName + "\"");

                if (Aggregate != null)
                {
                    gridString.Append(", aggregates: [" + strAggregate.Substring(0, strAggregate.Length) + "]");
                }

                gridString.Append("}");
            }

            if (Aggregate != null)
            {
                gridString.Append(", aggregate: [" + strAggregate.Substring(0, strAggregate.Length) + "]");
            }
            gridString.Append("},");
            if (!this.IsAutoHeight)
            {
                gridString.Append("height: " + this.Height.ToString() + ",");
            }
            if (!string.IsNullOrWhiteSpace(strAction.ToString()))
            {
                gridString.Append("action: {");
                gridString.Append("actionString: \"" + strAction.ToString() + "\"");
                gridString.Append("},");
            }

            //////gridString.Append("columnMenu: { columns: " + this.IsToggleColumns.ToString().ToLower() + "},");
            gridString.Append("columns: [");
            //gridString.Append("template: ' <a class=\"actionView\" href=\"" + targetParamRead + "\"><img class=\"View\" border=\"0px\" /></a> <a class=\"actionEdit\" href=\"" + targetParamEdit + "\"><img class=\"Edit\" border=0 /></a> <a  class=\"actionDelete\" href=\"" + targetParamDelete + "\"><img class=\"Delete\" border=0 /></a>', title: \"" + this.ActionTitle + "\", width: \"80px\", filterable: false, sortable: false");
            if (!ShowActionOnRight && IsActionRequired)
            {
                gridString.Append("{");

                if (IsModule == false)
                {
                    if (IsToolBarRatioButton == true)
                    {
                        gridString.Append("template: '");
                        gridString.Append("<div id=\"user-options\" class=\"toolbar-icons\" style=\"display: none;\">");
                        if (Action == null || Action.Count == 0)
                        {
                            if (this.PageRights.Where(e => e.PageRight.ToUpper() == "READ").Any())
                                gridString.Append("<a href=\"" + targetParamRead + "\"><i class=\"icon-read\"><span class=\"actionSpan\">READ</span></i></a>");
                            if (this.PageRights.Where(e => e.PageRight.ToUpper() == "EDIT").Any())
                                gridString.Append("<a href=\"" + targetParamEdit + "\"><i class=\"icon-edit\"><span class=\"actionSpan\">EDIT</span></i></a>");
                            if (this.PageRights.Where(e => e.PageRight.ToUpper() == "DELETE").Any())
                                gridString.Append("<a href=\"" + targetParamDelete + "\"><i class=\"icon-trash\"><span class=\"actionSpan\">DELETE</span></i></a>");
                        }
                        else
                        {
                            gridString.Append(String.Join(" ", Action.Select(e => e.ToString(PageName, this.PrimaryID, this.UserID, this.IsToolBarRatioButton)).ToArray()));
                        }
                        gridString.Append("</div>");
                        gridString.Append("<input type=\"radio\" class=\"faction\" name=\"faction\" value=#=" + this.PrimaryID + "#  id=\"faction\" />', title: \"" + this.ActionTitle + "\", width: \"55px\", filterable: false, sortable: false");
                    }
                    else
                        gridString.Append("template: ' <a class=\"actionView\" href=\"" + targetParamRead + "\"><img class=\"View\" border=\"0px\" /></a> <a class=\"actionEdit\" href=\"" + targetParamEdit + "\"><img class=\"Edit\" border=0 /></a> <a  class=\"actionDelete\" href=\"" + targetParamDelete + "\"><img class=\"Delete\" border=0 /></a>', title: \"" + this.ActionTitle + "\", width: \"80px\", filterable: false, sortable: false");

                }
                else
                {
                    if (IsModule)
                    {
                        if (IsShowEdit)
                        {
                            targetParamEdit = "Users.aspx?Module=" + this.ModuleName + "&Apps=Pages&FormAction=INDEXVIEW&RecID=#=" + this.PrimaryID + "#";
                            gridString.Append("template: ' <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">" + EditName + "</a>', title: \"" + this.ActionTitle + "\", width: \"80px\", filterable: false, sortable: false");
                        }
                        else
                        {
                            gridString.Append("template: ' <input type=\"checkbox\" name=\"Read\" data-type=\"boolean\" onclick=\"IsMarkUnMarkAll(this);\"/>', title: \"<div><input type='checkbox' name='All' onclick='MarkUnMarkAll(this);'/></div>\", width: \"50px\", filterable: false, sortable: false");
                        }
                    }
                    else
                    {
                        gridString.Append("template: ' <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">Edit</a>', title: \"" + this.ActionTitle + "\", width: \"80px\", filterable: false, sortable: false");
                    }
                }

                gridString.Append("},");
            }
            string strColValue = String.Join(",", Column.Select(e => e.ToString(false, this.IsAllowedSorting, this.IsAllowedFiltering, false, false, Aggregate)).ToArray());
            string strColData = strColValue;
            if (this.IsProcessPart)
            {
                strColData = strColData + "" + new GridColumn().ToProcessString(false);
            }
            gridString.Append(strColData);
            if (ShowActionOnRight && IsActionRequired)
            {
                gridString.Append(",");
                gridString.Append("{");

                if (IsModule == false)
                {
                    if (Action == null)
                        gridString.Append("template: ' <a class=\"actionButton actionView\" href=\"" + targetParamRead + "\">Read</a> <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">Edit</a> <a  class=\"actionButton actionDelte\" href=\"" + targetParamDelete + "\"> Delete </a>', title: \"" + this.ActionTitle + "\", width: \"120px\", filterable: false, sortable: false");
                    else
                        if (Action.Count > 0)
                            gridString.Append("template: ' " + String.Join(" ", Action.Select(e => e.ToString(PageName, this.PrimaryID)).ToArray()) + "', title: \"" + this.ActionTitle + "\", width: \"120px\", filterable: false, sortable: false");
                        else
                            gridString.Append("template: ' <a class=\"actionButton actionView\" href=\"" + targetParamRead + "\">Read</a> <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">Edit</a> <a  class=\"actionButton actionDelte\" href=\"" + targetParamDelete + "\"> Delete </a>', title: \"" + this.ActionTitle + "\", width: \"120px\", filterable: false, sortable: false");
                }
                else
                {
                    if (IsModule)
                    {
                        if (IsShowEdit)
                        {
                            targetParamEdit = "Users.aspx?Module=" + this.ModuleName + "&Apps=Pages&FormAction=INDEXVIEW&RecID=#=" + this.PrimaryID + "#";
                            gridString.Append("template: ' <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">Edit</a>', title: \"" + this.ActionTitle + "\", width: \"80px\", filterable: false, sortable: false");
                        }
                        else
                        {
                            gridString.Append("template: ' <input type=\"checkbox\" name=\"Read\" data-type=\"boolean\" onclick=\"IsMarkUnMarkAll(this);\"/>', title: \"<div><input type='checkbox' name='All'  onclick='MarkUnMarkAll(this);'/></div>\", width: \"50px\", filterable: false, sortable: false");
                        }
                    }
                    else
                    {
                        gridString.Append("template: ' <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">Edit</a>', title: \"" + this.ActionTitle + "\", width: \"80px\", filterable: false, sortable: false");
                    }
                }
                gridString.Append("}");
            }
            gridString.Append("]");
            gridString.Append("});");
            //////////gridString.Append("});StopProgress();");
            gridString.Append("});");
            gridString.Append("</script>");
            gridString.Append("</td></tr></table>");
            gridString.Append("</td></tr></table>");
            gridString.Append("<style>.k-grid td {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}</style>");
        }

        /// <summary>
        /// Default distructor of the Grid Claas
        /// </summary>
        ~Grid()
        {
            if (this != null)
                this.Dispose();
        }

        /// <summary>
        /// Clean all the use variable of this class
        /// </summary>
        public virtual void Dispose()
        {

        }

        public void GetProcessConfiguration(string ProcessName)
        {
            try
            {
                DataSet ds = WebFormControlDefinition.GetConfiguration(ProcessName);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    HttpContext.Current.Session["_ProcessSetting"] = ds.Tables[ds.Tables.Count - 1];

                }
                else
                {
                    HttpContext.Current.Session["_ProcessSetting"] = null;
                }
            }
            catch (Exception ex)
            {
                HttpContext.Current.Session["_ProcessSetting"] = null;
            }
        }
    }

    public class GridColumn
    {
        public string Field { get; set; }
        public string Title { get; set; }
        public int Width { get; set; }
        public string Format { get; set; }
        public string Template { get; set; }
        public string Sortable { get; set; }
        public string Celleditable { get; set; }
        public string Filterable { get; set; }
        public string DataType { get; set; }
        public string Defaulteditable { get; set; }
        public bool IsHidden { get; set; }
        public bool IsGroupable { get; set; }
        public string GroupHeaderTemplate { get; set; }
        public string GroupFooterTemplate { get; set; }
        public string FooterTemplate { get; set; }
        //added by Manoj Kumar on 20.7.2015
        public string HeaderTemplate { get; set; }
        //end
        public bool IsLocked { get; set; }
        public DataTable _ProcessSetting { get; set; }
        public string Tooltip { get; set; }
        public string FixTooltip { get; set; }

        public GridColumn()
        {
            this.IsHidden = false;
            this.IsGroupable = true;
            this.IsLocked = false;
            this._ProcessSetting = null;
        }

        public string ToString(bool isSchema, bool IsSortable, bool IsFilterable, bool IsCelleditable, bool IsDefaulteditable, List<GridAggregate> Aggregate = null)
        {
            bool commarequired = false;
            StringBuilder stb = new StringBuilder();


            if (isSchema)
            {
                if (!((String.IsNullOrWhiteSpace(Field)) && (String.IsNullOrWhiteSpace(DataType))))
                {
                    string strf = "";

                    if (DataType.ToLower() == "datetime")
                    {
                        strf = string.Format("{0} :#type :\"{1}\" @", Field, "date");
                    }
                    else
                    {
                        strf = string.Format("{0} :#type :\"{1}\" @", Field, DataType.ToLower());
                    }
                    stb.Append(strf.Replace("#", "{").Replace("@", "}"));
                }
            }
            else
            {
                stb.Append("{" + Environment.NewLine);
                if (!String.IsNullOrWhiteSpace(Field))
                {
                    if (IsHidden)
                    {
                        stb.Append(string.Format("hidden : \"{0}\", field :\"{1}\"", IsHidden.ToString().ToLower(), Field));
                    }
                    else
                    {
                        stb.Append(string.Format("field :\"{0}\"", Field));
                    }
                    commarequired = true;
                }
                if (!String.IsNullOrWhiteSpace(Title))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("title :\"{0}\"", Title));
                    commarequired = true;
                }
                if (this.IsLocked)
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("locked :\"{0}\"", this.IsLocked.ToString().ToLower()));
                    commarequired = true;
                }

                if (!String.IsNullOrWhiteSpace(Template))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    if (DataType.ToLower() == GridDataType.Date.ToString().ToLower())
                    {
                        var tmp = "# if( " + Field + "==null) {# # } else {# #= kendo.toString(" + Field + ",\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#";
                        stb.Append(string.Format("template :'{0}'", tmp));
                    }
                    else if (DataType.ToLower() == GridDataType.DateTime.ToString().ToLower())
                    {
                        var tmp = "# if( " + Field + "==null) {# # } else {# #= kendo.toString(" + Field + ",\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#";
                        stb.Append(string.Format("template :'{0}'", tmp));
                    }
                    else
                    {
                        stb.Append(string.Format("template :'{0}'", Template));
                    }
                    commarequired = true;
                }
                else if (DataType.ToLower() == GridDataType.Date.ToString().ToLower())
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    var tmp = "# if( " + Field + "==null) {# # } else {# #= kendo.toString(" + Field + ",\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#";
                    stb.Append(string.Format("template :'{0}'", tmp));
                    commarequired = true;
                }
                else if (DataType.ToLower() == GridDataType.DateTime.ToString().ToLower())
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    var tmp = "# if( " + Field + "==null) {# # } else {# #= kendo.toString(" + Field + ",\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#";
                    stb.Append(string.Format("template :'{0}'", tmp));
                    commarequired = true;
                }
                else if (Tooltip != null)
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);

                    stb.Append("template :'<span  title= \"#= " + Tooltip + " #\">#= " + Field + " #</span>' ");
                    commarequired = true;
                }
                else if (FixTooltip != null)
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);

                    stb.Append("template :'<span  title= \" " + FixTooltip + " \">#= " + Field + " #</span>' ");
                    commarequired = true;
                }

                if (!String.IsNullOrWhiteSpace(this.Format))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("template :'#= kendo.toString({0},\"{1}\") #'", Field, this.Format));
                    commarequired = true;
                }

                if (Width > 0)
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("width:{0}", Width.ToString()));
                }

                if (!String.IsNullOrWhiteSpace(Sortable))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("sortable:{0}", Sortable.ToString().ToLower()));
                }
                else
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("sortable:{0}", IsSortable.ToString().ToLower()));
                }


                if (!String.IsNullOrWhiteSpace(Celleditable))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("celleditable:{0}", Celleditable.ToString().ToLower()));
                }
                else
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("celleditable:{0}", IsCelleditable.ToString().ToLower()));
                }

                if (!String.IsNullOrWhiteSpace(Defaulteditable))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("defaulteditable:{0}", Defaulteditable.ToString().ToLower()));
                }
                else
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("defaulteditable:{0}", IsDefaulteditable.ToString().ToLower()));
                }

                if (!String.IsNullOrWhiteSpace(Filterable))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("filterable:{0}", Filterable.ToString().ToLower()));
                }
                else
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("filterable:{0}", IsFilterable.ToString().ToLower()));
                }

                if (commarequired) stb.Append(", " + Environment.NewLine);
                stb.Append(string.Format("groupable:{0}", this.IsGroupable.ToString().ToLower()));
                if (Aggregate != null)
                {
                    int index = Aggregate.FindIndex(e => e.Field == Field);
                    if (index >= 0)
                    {
                        if (commarequired) stb.Append(", " + Environment.NewLine);
                        stb.Append(string.Format("aggregates:[\"{0}\"]", Aggregate.ElementAt(index).Aggregate));
                        //stb.Append(string.Format("aggregates:[{0}]", Aggregate.Select(e => e.Aggregate).Where( == Field).ToString();
                    }
                }
                if (!String.IsNullOrWhiteSpace(GroupHeaderTemplate))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("groupHeaderTemplate:\"{0}\"", GroupHeaderTemplate.ToString()));
                }
                if (!String.IsNullOrWhiteSpace(GroupFooterTemplate))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("groupFooterTemplate:\"{0}\"", GroupFooterTemplate.ToString()));
                }
                if (!String.IsNullOrWhiteSpace(FooterTemplate))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("footerTemplate:\"{0}\"", FooterTemplate.ToString()));
                }
                //Add By Manoj Kumar on 20.7.2015
                if (!String.IsNullOrWhiteSpace(HeaderTemplate))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("headerTemplate:\"{0}\"", HeaderTemplate.ToString()));
                }
                //End


                stb.Append(Environment.NewLine + "}");
            }

            return stb.ToString();
        }

        public string ToString(bool isSchema)
        {
            StringBuilder stb = new StringBuilder();


            if (isSchema)
            {
                if (!((String.IsNullOrWhiteSpace(Field)) && (String.IsNullOrWhiteSpace(DataType))))
                {
                    string strf = "";

                    if (DataType.ToLower() == "datetime")
                    {
                        strf = string.Format("{0} :#type :\"{1}\" @", Field, "date");
                    }
                    else
                    {
                        strf = string.Format("{0} :#type :\"{1}\" @", Field, DataType.ToLower());
                    }
                    stb.Append(strf.Replace("#", "{").Replace("@", "}"));
                }
            }
            return stb.ToString();
        }

        public string ToProcessString(bool isSchema)
        {
            bool commarequired = false;
            StringBuilder stb = new StringBuilder();
            if (HttpContext.Current.Session["_ProcessSetting"] != null)
            {
                _ProcessSetting = (DataTable)(HttpContext.Current.Session["_ProcessSetting"]);
                string a = "";

                if (isSchema)
                {
                    foreach (DataRow drProcessSetting in _ProcessSetting.Rows)
                    {
                        stb.Append("," + drProcessSetting["SUBPROCESSDISPLAYNAME"].ToString() + ": {type : \"string\" }");
                    }
                }
                else
                {

                    foreach (DataRow drProcessSetting in _ProcessSetting.Rows)
                    {
                        stb.Append(",");
                        stb.Append("{");
                        stb.Append("field :\"SNo\", ");
                        stb.Append("title :\"" + drProcessSetting["SUBPROCESSDISPLAYNAME"].ToString() + "\", ");
                        stb.Append("tooltip :\"" + drProcessSetting["SUBPROCESSDISPLAYNAME"].ToString() + "\", ");
                        stb.Append("isrequired :\"" + drProcessSetting["IsRequired"].ToString().ToLower() + "\", ");
                        if (drProcessSetting["ProgressCheck"].ToString().ToLower() == "true")
                            stb.Append("template :'<input type=\"button\" currentProcess=\"" + drProcessSetting["PROCESSNAME"].ToString() + "\" process=\"" + drProcessSetting["SUBPROCESSNAME"].ToString() + "\" onclick=\"BindEvents(this,event);return false;\"  title=\"" + drProcessSetting["SUBPROCESSDISPLAYNAME"].ToString() + "\"   value=\"" + drProcessSetting["DisplayCaption"].ToString() + "\" class= #=checkProgrss(ProcessStatus,\"" + drProcessSetting["SUBPROCESSNAME"].ToString() + "\",\"" + drProcessSetting["DisplayCaption"].ToString() + "\")# ondblclick=\"BindEvents(this,event,true); \"/>', ");
                        else
                            stb.Append("template :'<input type=\"button\" currentProcess=\"" + drProcessSetting["PROCESSNAME"].ToString() + "\" process=\"" + drProcessSetting["SUBPROCESSNAME"].ToString() + "\" onclick=\"BindEvents(this,event);return false;\"  title=\"" + drProcessSetting["SUBPROCESSDISPLAYNAME"].ToString() + "\"  value=\"" + drProcessSetting["DisplayCaption"].ToString() + "\" ondblclick=\"BindEvents(this,event,true); \"/>', ");
                        stb.Append("width:40, ");
                        stb.Append("sortable:false, ");
                        stb.Append("celleditable:false, ");
                        stb.Append("defaulteditable:false, ");
                        stb.Append("filterable:false, ");
                        stb.Append("groupable:false");
                        stb.Append("}");
                    }
                }
            }
            return stb.ToString();
        }
    }

    public class GridAggregate
    {
        public string Field { get; set; }
        public string Aggregate { get; set; }

        public GridAggregate()
        {
        }

        public string ToString()
        {
            bool commarequired = false;
            StringBuilder stb = new StringBuilder();

            stb.Append(Environment.NewLine + "{");
            if (!String.IsNullOrWhiteSpace(Field))
            {
                stb.Append(string.Format("field :\"{0}\"", Field));
                commarequired = true;
            }
            if (!String.IsNullOrWhiteSpace(Aggregate))
            {
                if (commarequired) stb.Append(", ");
                stb.Append(string.Format("aggregate :\"{0}\"", Aggregate));
            }
            stb.Append("}" + Environment.NewLine);

            return stb.ToString();
        }
    }

    public class GridExtraParam
    {
        public string Field { get; set; }
        public string Value { get; set; }

        public GridExtraParam()
        {
        }

        public string ToString()
        {
            StringBuilder stb = new StringBuilder();

            if (!String.IsNullOrWhiteSpace(Field) && !String.IsNullOrWhiteSpace(Field))
            {
                stb.Append(string.Format("{0} : \"{1}\"", Field, Value));
            }

            return stb.ToString();
        }
    }

    public class GridAction
    {
        public string ModuleName { get; set; }
        public string AppsName { get; set; }
        public string ActionName { get; set; }
        public string CssClassName { get; set; }
        public string ButtonCaption { get; set; }
        public bool IsLink { get; set; }
        public string ClientAction { get; set; }
        public bool IsNavigateUrl { get; set; }
        public string NewUrl { get; set; }
        public bool IsNewWindow { get; set; }

        public GridAction()
        {
            this.IsLink = false;
            this.ClientAction = "";
            this.IsNavigateUrl = true;
            this.IsNewWindow = false;

        }

        public string ToString(string pageName, string recordID, Int64 UserID = 0, bool IsToolBarRatioButton = false, bool IsHeaderToolBar = false)
        {
            string strAction = "";
            if (IsToolBarRatioButton)
            {
                if (!string.IsNullOrEmpty(recordID))
                    recordID = "&UserID=" + UserID + "&RecID=";
                string urlToolBarRatio = pageName + "?Module=" + this.ModuleName + "&Apps=" + this.AppsName + "&FormAction=" + this.ActionName + recordID;

                if (this.CssClassName != null && this.ActionName != null)
                {
                    if (string.IsNullOrWhiteSpace(this.ClientAction) && string.IsNullOrWhiteSpace(this.NewUrl))
                        strAction = "<a " + (IsHeaderToolBar ? "class='tool-item gradient' " : "") + "href=\"" + urlToolBarRatio + "\"><i class=\"icon-" + this.CssClassName + "\"><span class=\"actionSpan\">" + (string.IsNullOrWhiteSpace(this.ButtonCaption) == true ? this.ActionName : this.ButtonCaption) + "</span></i></a>";
                    else if (!string.IsNullOrWhiteSpace(this.ClientAction) && string.IsNullOrWhiteSpace(this.NewUrl))
                        strAction = "<a " + (IsHeaderToolBar ? "class='tool-item gradient' " : "") + "href=\"javascript:void(0);\" onclick=\"return " + this.ClientAction + "(this);\"><i class=\"icon-" + this.CssClassName + "\"><span class=\"actionSpan\">" + (string.IsNullOrWhiteSpace(this.ButtonCaption) == true ? this.ActionName : this.ButtonCaption) + "</span></i></a>";
                    else
                        strAction = "<a " + (IsHeaderToolBar ? "class='tool-item gradient' " : "") + "href=\"" + this.NewUrl + "?RecID=\" " + (this.IsNewWindow ? "target=_blank" : "") + (string.IsNullOrWhiteSpace(this.ClientAction) ? "" : " onclick=\"return " + this.ClientAction + "(this);\"") + "><i class=\"icon-" + this.CssClassName + "\"><span class=\"actionSpan\">" + (string.IsNullOrWhiteSpace(this.ButtonCaption) == true ? this.ActionName : this.ButtonCaption) + "</span></i></a>";
                }
            }
            else if (IsLink)
            {
                if (!String.IsNullOrWhiteSpace(ModuleName)) { }
                if (!String.IsNullOrWhiteSpace(AppsName)) { }
                if (!String.IsNullOrWhiteSpace(ActionName)) { }
                if (!String.IsNullOrWhiteSpace(CssClassName)) { }
                if (!String.IsNullOrWhiteSpace(ButtonCaption)) { }

                if (!string.IsNullOrEmpty(recordID))
                    recordID = "&RecID=#=" + recordID + "#";
                string url = pageName + "?Module=" + this.ModuleName + "&Apps=" + this.AppsName + "&FormAction=" + ActionName + recordID;
                if (string.IsNullOrWhiteSpace(this.ClientAction))
                {
                    strAction = "<a class=\"actionButton " + CssClassName + "\" href=\"" + (this.IsNavigateUrl == true ? url : "javascript:void(0);") + "\">" + ButtonCaption + "</a>";
                }
                else
                {
                    strAction = "<a class=\"actionButton " + CssClassName + "\" href=\"javascript:void(0);\" onclick=\" return " + this.ClientAction + "(this);\">" + ButtonCaption + "</a>";
                }

            }
            else
            {
                strAction = "<input name=\"Select\" type=\"radio\" id=\"Select_#=" + recordID + "#\" value=#=" + recordID + "# onclick=\" return " + this.ClientAction + "(this);\">";
            }
            return strAction;
        }
    }

    public enum GridDataType
    {
        Number,
        String,
        Boolean,
        Float,
        Decimal,
        Date,
        DateTime
    }
}