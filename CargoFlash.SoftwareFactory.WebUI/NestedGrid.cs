﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Data;
using CargoFlash.SoftwareFactory.WebUI.Adapters;

namespace CargoFlash.SoftwareFactory.WebUI.Controls
{
    public class NestedGrid : IDisposable
    {
        /// <summary>
        /// Properties of grid class
        /// </summary>
        public string GridID { get; set; }
        public string DataSoruceUrl { get; set; }
        public string ReadGridUrl { get; set; }
        public string EditGridUrl { get; set; }
        public string NestedGridUrl { get; set; }
        public string DeleteGridUrl { get; set; }
        public string PrimaryID { get; set; }
        public bool IsChild { get; set; }
        public bool IsAllowedPaging { get; set; }
        public bool IsAllowedSorting { get; set; }
        public bool IsAllowedFiltering { get; set; }
        public bool IsAllowedAction { get; set; }
        public bool IsAllowedScrolling { get; set; }
        public int Height { get; set; }
        public string DefaultSortName { get; set; }
        public string SortDirection { get; set; }
        public string ActionDirection { get; set; }
        public int DefaultPageSize { get; set; }
        public string ModuleName { get; set; }
        public string AppsName { get; set; }
        public string ActionName { get; set; }
        public string PageName { get; set; }
        public string NewURL { get; set; }
        public List<GridColumn> Column { get; set; }
        public List<GridAction> Action { get; set; }
        public bool IsFormHeader { get; set; }
        public bool IsModule { get; set; }
        public bool IsShowEdit { get; set; }
        public bool IsSaveChanges { set; get; }
        public bool IsAddNewRecord { set; get; }
        public int EditingMode { set; get; }
        public bool IsCelleditable { set; get; }
        public bool IsDefaulteditable { set; get; }
        public string FormCaptionText { set; get; }
        public bool IsBackRequired { get; set; }
        public List<GridExtraParams> ExtraParam { get; set; }
        public bool IsColumnMenu { get; set; }
        public bool IsToggleColumns { get; set; }
        public string ParentSuccessGrid { get; set; }
        public string ParentErrorGrid { get; set; }
        public string SuccessGrid { get; set; }
        public string ErrorGrid { get; set; }
        public bool IsSave { get; set; }
        public bool IsAccordion { get; set; }
        public string ReferenceId { get; set; }
        public bool IsAutoHeight { get; set; }
        public string SuccessOnBlank { get; set; }
        public string DetailExpand { get; set; }
        public string DetailCollapse { get; set; }
        public bool IsProcessPart { get; set; }
        public string ProcessName { get; set; }


        #region NestedGridProperty

        public string NestedDataSoruceUrl { get; set; }
        public string NestedReadGridUrl { get; set; }
        public string NestedEditGridUrl { get; set; }
        public string NestedDeleteGridUrl { get; set; }
        public string NestedPrimaryID { get; set; }
        public string NestedParentID { get; set; }
        public bool IsNestedChild { get; set; }
        public bool IsNestedAllowedPaging { get; set; }
        public bool IsNestedAllowedSorting { get; set; }
        public bool IsNestedAllowedFiltering { get; set; }
        public bool IsNestedAllowedAction { get; set; }
        public bool IsNestedAllowedScrolling { get; set; }
        public int NestedHeight { get; set; }
        public string NestedDefaultSortName { get; set; }
        public string NestedSortDirection { get; set; }
        public string NestedActionDirection { get; set; }
        public int NestedDefaultPageSize { get; set; }
        public string NestedModuleName { get; set; }
        public string NestedAppsName { get; set; }
        public string NestedActionName { get; set; }
        public string NestedPageName { get; set; }
        public List<GridColumn> NestedColumn { get; set; }
        public List<GridAction> NestedAction { get; set; }
        public bool NestedIsShowEdit { get; set; }
        public bool NestedIsPageable { get; set; }
        public List<NestedGridExtraParam> NestedExtraParam { get; set; }
        public List<NestedGridExtraParam> NestedExtraParamParent { get; set; }
        public bool IsNestedAutoHeight { get; set; }
        public bool IsDisplayOnly { get; set; }
        public string NestedRowDataBound { get; set; }
        public string NestedSuccessOnBlank { get; set; }
        public bool IsNestedProcessPart { get; set; }
        public string NestedProcessName { get; set; }
        public bool IsAllowNestedGrid { get; set; }
        #endregion
        #region NestedChildGridProperty

        public string NestedChildDataSoruceUrl { get; set; }
        public string NestedChildReadGridUrl { get; set; }
        public string NestedChildEditGridUrl { get; set; }
        public string NestedChildDeleteGridUrl { get; set; }
        public string NestedChildPrimaryID { get; set; }
        public string NestedChildParentID { get; set; }
        public bool IsNestedChildChild { get; set; }
        public bool IsNestedChildAllowedPaging { get; set; }
        public bool IsNestedChildAllowedSorting { get; set; }
        public bool IsNestedChildAllowedFiltering { get; set; }
        public bool IsNestedChildAllowedAction { get; set; }
        public bool IsNestedChildAllowedScrolling { get; set; }
        public int NestedChildHeight { get; set; }
        public string NestedChildDefaultSortName { get; set; }
        public string NestedChildSortDirection { get; set; }
        public string NestedChildActionDirection { get; set; }
        public int NestedChildDefaultPageSize { get; set; }
        public string NestedChildModuleName { get; set; }
        public string NestedChildAppsName { get; set; }
        public string NestedChildActionName { get; set; }
        public string NestedChildPageName { get; set; }
        public List<GridColumn> NestedChildColumn { get; set; }
        public List<GridAction> NestedChildAction { get; set; }
        public bool NestedChildIsShowEdit { get; set; }
        public bool NestedChildIsPageable { get; set; }
        public List<NestedChildGridExtraParam> NestedChildExtraParam { get; set; }
        public bool IsNestedChildAutoHeight { get; set; }
        public bool IsNestedChildDisplayOnly { get; set; }
        public string NestedChildRowDataBound { get; set; }
        public string NestedChildSuccessOnBlank { get; set; }
        public bool IsNestedChildProcessPart { get; set; }
        public string NestedChildProcessName { get; set; }

        #endregion
        /// <summary>
        /// Default contructor of the Grid Claas
        /// </summary>
        public NestedGrid()
        {
            Guid gid = Guid.NewGuid();
            this.GridID = gid.ToString();
            this.Height = 300;
            this.DefaultPageSize = 10;
            this.DefaultSortName = "asc";
            this.SortDirection = "left";
            this.IsAllowedAction = true;
            this.IsAllowedFiltering = true;
            this.IsAllowedPaging = true;
            this.IsAllowedSorting = true;
            this.IsAllowedScrolling = false;
            this.IsFormHeader = true;
            this.IsModule = false;
            this.IsShowEdit = true;
            this.IsSaveChanges = true;
            this.IsAddNewRecord = false;
            this.EditingMode = 3;
            this.IsBackRequired = false;
            this.IsColumnMenu = true;
            this.IsToggleColumns = true;
            this.SuccessGrid = "";
            this.SuccessOnBlank = "";
            this.ParentSuccessGrid = "";
            this.ParentErrorGrid = "";
            this.ReferenceId = "";
            this.IsSave = false;
            this.IsAccordion = false;
            this.IsAutoHeight = true;
            this.IsDisplayOnly = false;
            this.DetailExpand = "";
            this.DetailCollapse = "";
            this.IsProcessPart = false;
            this.ProcessName = "";

            #region NestedGridPropertyInitialize

            this.NestedHeight = 300;
            this.NestedSuccessOnBlank = "";
            this.NestedDefaultPageSize = 10;
            this.NestedDefaultSortName = "asc";
            this.NestedSortDirection = "left";
            this.IsNestedAllowedAction = false;
            this.IsNestedAllowedFiltering = true;
            this.IsNestedAllowedPaging = true;
            this.IsNestedAllowedSorting = true;
            this.IsNestedAllowedScrolling = true;
            this.NestedIsShowEdit = true;
            this.NestedIsPageable = true;
            this.IsNestedAutoHeight = true;
            this.IsAllowNestedGrid = false;

            #endregion

            #region NestedChildGridPropertyInitialize

            this.NestedChildHeight = 300;
            this.NestedChildSuccessOnBlank = "";
            this.NestedChildDefaultPageSize = 10;
            this.NestedChildDefaultSortName = "asc";
            this.NestedChildSortDirection = "left";
            this.IsNestedChildAllowedAction = false;
            this.IsNestedChildAllowedFiltering = true;
            this.IsNestedChildAllowedPaging = true;
            this.IsNestedChildAllowedSorting = true;
            this.IsNestedChildAllowedScrolling = true;
            this.NestedChildIsShowEdit = true;
            this.NestedChildIsPageable = true;
            this.IsNestedChildAutoHeight = true;


            #endregion
        }

        /// <summary>
        /// 
        /// </summary>
        public void InstantiateIn(StringBuilder gridString)
        {
            //if (IsDisplayOnly)
            //{
            //    this.IsFormHeader = false;
            //    this.IsToolBar = false;
            //    this.IsGroupable = false;
            //    this.IsRowFilter = false;
            //    this.IsFilterable = false;
            //    this.IsCurrentExport = false;
            //    this.IsAllExport = false;
            //    this.IsActionRequired = false;
            //    //this.IsPageable = false;
            //}
            gridString.Append("<table class='WebFormTable2'>");
            if (IsFormHeader)
            {
                gridString.Append("<tr><td class='formSection' colspan='2'>" + this.AppsName + "</td></tr><tr><td class='formbuttonrow' colspan='2'><a href='" + this.NewURL + "' class='buttonlink'>New Group<a/></td></tr>");
            }
            else
            {
                if (IsBackRequired)
                {
                    gridString.Append("<tr><td class='formSection' colspan='2'>Permission Management</td></tr><tr><td colspan='2' class='formActiontitle Background'>" + this.FormCaptionText + "</td></tr><tr><td colspan='2' class='formbuttonrow'><button type=\"submit\" value=\"Submit\" onclick=\"return SaveForm('form1','json','');\" class=\"button\">Save</button><a href='" + this.NewURL + "' class='buttonlink'>Back<a/></td></tr>");
                }
                else
                {
                    gridString.Append("<tr><td colspan='2' class='formActiontitle Background'>" + this.FormCaptionText + "</td></tr><tr><td colspan='2'>");

                }
            }
            if (this.IsSave)
                gridString.Append("<tr><td colspan='2' class='formbuttonrow'><button id=\"btnSave\" type=\"submit\" value=\"Submit\" onclick=\"return SaveForm('form1','json','');\" class=\"button\">Save</button></td></tr>");
            gridString.Append("<tr><td colspan='2'>");
            gridString.Append("<div id=\"" + this.GridID + "\">");
            gridString.Append("</div>");
            gridString.Append("<script type=\"text/javascript\">");
            gridString.Append("$(document).ready(function () {");
            gridString.Append("$(\"#" + this.GridID + "\").kendoGrid({");
            gridString.Append("dataSource: {");
            gridString.Append("type: \"json\",");
            gridString.Append("batch: \"true\",");
            gridString.Append("serverPaging: " + this.IsAllowedPaging.ToString().ToLower() + ",");
            gridString.Append("serverSorting: " + this.IsAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("parentId: '" + this.ReferenceId + "',");
            gridString.Append("serverFiltering: " + this.IsAllowedFiltering.ToString().ToLower() + ",");
            gridString.Append("allowUnsort:  " + this.IsAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("pageSize: " + this.DefaultPageSize.ToString() + ",");
            gridString.Append("transport: {");
            gridString.Append("read: {");
            gridString.Append("url: \"" + this.DataSoruceUrl + "\",");
            gridString.Append("dataType: \"json\",");
            gridString.Append("type: \"POST\",");
            if (!string.IsNullOrEmpty(this.ParentSuccessGrid))
            {
                gridString.Append("success: " + this.ParentSuccessGrid + ",");
            }
            if (!string.IsNullOrEmpty(this.SuccessOnBlank))
            {
                gridString.Append("successonblank: " + this.SuccessOnBlank + ",");
            }
            if (!string.IsNullOrEmpty(this.ParentErrorGrid))
            {
                gridString.Append("error: " + this.ParentErrorGrid + ",");
            }
            gridString.Append("contentType: \"application/json; charset=utf-8\",");
            //gridString.Append("data: {}");            

            string extraParam = "";
            if (ExtraParam != null)
            {
                extraParam = String.Join(",", ExtraParam.Select(e => e.ToString()).ToArray());
                extraParam = extraParam.Substring(0, extraParam.Length);
            }
            gridString.Append("data: {" + extraParam + "}");

            gridString.Append("},");
            gridString.Append("parameterMap: function (options, operation) {");
            gridString.Append("if (operation !== \"read\" && options.models) {");
            gridString.Append("return { models: kendo.stringify(options.models) };");
            gridString.Append("}");
            gridString.Append("else{");
            gridString.Append("return JSON.stringify(options);");
            gridString.Append("}");
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("schema: {");
            gridString.Append("model: {");
            gridString.Append("id: \"" + this.PrimaryID + "\",");
            gridString.Append("fields: {");
            string strSchema = String.Join(",", Column.Select(e => e.ToString(true, false, false, false, false)).ToArray());
            //gridString.Append(strSchema.Substring(0, strSchema.Length));
            string strColSchema = strSchema;
            if (this.IsProcessPart)
            {
                this.GetProcessConfiguration(this.ProcessName);
                strColSchema = strColSchema + "" + new GridColumn().ToProcessString(true);
            }
            gridString.Append(strColSchema.Substring(0, strSchema.Length));
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("data: \"Data\",");
            gridString.Append("total: \"Total\"");
            gridString.Append("}");
            gridString.Append("},");

            if (!this.IsAutoHeight)
            {
                gridString.Append("height: " + this.Height.ToString() + ",");
            }
            gridString.Append("scrollable: " + this.IsAllowedScrolling.ToString().ToLower() + ",");
            if (!this.IsDisplayOnly)
            {
                gridString.Append("sortable: " + this.IsAllowedSorting.ToString().ToLower() + ",");
                gridString.Append("filterable: " + this.IsAllowedFiltering.ToString().ToLower() + ",");
            }
            gridString.Append("editable: true,");
            gridString.Append("accordion:" + this.IsAccordion.ToString().ToLower() + ",");

            if (this.IsAddNewRecord || this.IsSaveChanges)
            {
                gridString.Append("toolbar: [" + (this.IsAddNewRecord ? "\"create\"" : "") + "" + (this.IsAddNewRecord && this.IsSaveChanges ? "," : "") + (this.IsSaveChanges ? "\"save\"" : "") + ",\"cancel\"]" + ",");
            }

            gridString.Append("detailInit: detailInit,"); //For Nested Grid
            if (!string.IsNullOrWhiteSpace(this.DetailExpand))
                gridString.Append("detailExpand: " + this.DetailExpand + ",");
            if (!string.IsNullOrWhiteSpace(this.DetailCollapse))
                gridString.Append("detailCollapse:  " + this.DetailCollapse + ",");

            gridString.Append("parentId: '" + this.ReferenceId + "',");
            gridString.Append("selectable: 'row',");
            if (this.IsColumnMenu)
            {
                gridString.Append("columnMenu: " + this.IsColumnMenu.ToString().ToLower() + ",");
                gridString.Append("columnMenu: {");
                gridString.Append("columns: " + this.IsToggleColumns.ToString().ToLower() + ",");
                gridString.Append("sortable: " + this.IsColumnMenu.ToString().ToLower() + ",");
                gridString.Append("filterable: " + this.IsColumnMenu.ToString().ToLower() + ",");
                gridString.Append("},");
            }
            gridString.Append("dataBound: onGridDataBound,");
            gridString.Append("columns: [");
            string url = PageName + "?Module=" + this.ModuleName + "&Apps=" + this.AppsName + "&FormAction=";
            string targetParamRead = url + "Read&RecID=#=" + this.PrimaryID + "#";
            string targetParamEdit = url + "Edit&RecID=#=" + this.PrimaryID + "#";
            string targetParamDelete = url + "Delete&RecID=#=" + this.PrimaryID + "#";
            gridString.Append("{");

            if (IsFormHeader)
            {
                gridString.Append("template: ' <a class=\"actionButton actionView\" href=\"" + targetParamRead + "\">Read</a> <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">Edit</a> <a  class=\"actionButton actionDelte\" href=\"" + targetParamDelete + "\"> Delete </a>', title: \"Action\", width: \"120px\", filterable: false, sortable: false");
            }
            else
            {
                if (IsModule)
                {
                    if (IsShowEdit)
                    {
                        targetParamEdit = "Users.aspx?Module=" + this.ModuleName + "&Apps=Pages&FormAction=INDEXVIEW";
                        gridString.Append("template: ' <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">Edit</a>', title: \"Action\", width: \"80px\", filterable: false, sortable: false");
                    }
                    else
                    {
                        gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
                    }
                }
                else
                {
                    gridString.Append("template: ' <a class=\"actionButton actionEdit\" href=\"" + targetParamEdit + "\">Edit</a>', title: \"Action\", width: \"80px\", filterable: false, sortable: false");
                }
            }

            gridString.Append("},");
            //gridString.Append(String.Join(",", Column.Select(e => e.ToString(false, this.IsAllowedSorting, this.IsAllowedFiltering, true, false)).ToArray()));
            string strColValue = String.Join(",", Column.Select(e => e.ToString(false, this.IsAllowedSorting, this.IsAllowedFiltering, true, false)).ToArray());
            string strColData = strColValue;
            if (this.IsProcessPart)
            {
                strColData = strColData + "" + new GridColumn().ToProcessString(false);
            }
            gridString.Append(strColData);
            gridString.Append("]");
            gridString.Append(", editable: \"popup\"");
            gridString.Append("});");
            gridString.Append("});");

            #region NestedGridScript

            ///* ****************************************************************************
            // *                          Nested Grid Start
            // * ****************************************************************************/

            gridString.Append("function detailInit(e) {");
            gridString.Append("e.sender.options.parentValue= e.data." + this.PrimaryID + ";");
            gridString.Append("e.sender.options.storedparentValue= e.data." + this.PrimaryID + ";");
            gridString.Append("$('<div/>').appendTo(e.detailCell).kendoGrid({");
            gridString.Append("dataSource: {");
            gridString.Append("type: \"json\",");
            gridString.Append("serverPaging: " + this.IsNestedAllowedPaging.ToString().ToLower() + ",");
            gridString.Append("serverSorting: " + this.IsNestedAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("serverFiltering: " + this.IsNestedAllowedFiltering.ToString().ToLower() + ",");
            gridString.Append("parentId: '" + this.NestedParentID + "',");
            gridString.Append("parentValue: e.data." + this.PrimaryID + ",");
            gridString.Append("filter: { field: \"" + this.NestedParentID + "\", operator: \"eq\", value: e.data." + this.PrimaryID + " },");
            gridString.Append("allowUnsort:  " + this.IsNestedAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("pageSize: " + this.NestedDefaultPageSize.ToString() + ",");
            gridString.Append("transport: {");
            gridString.Append("read: {");
            gridString.Append("url: \"" + this.NestedDataSoruceUrl + "\",");
            gridString.Append("dataType: \"json\",");
            gridString.Append("type: \"POST\",");
            gridString.Append("contentType: \"application/json; charset=utf-8\",");
            //gridString.Append("data: {}");

            if (!string.IsNullOrEmpty(this.SuccessGrid))
            {
                gridString.Append("success: " + this.SuccessGrid + ",");
            }
            if (!string.IsNullOrEmpty(this.NestedSuccessOnBlank))
            {
                gridString.Append("successonblank: " + this.NestedSuccessOnBlank + ",");
            }
            if (!string.IsNullOrEmpty(this.ErrorGrid))
            {
                gridString.Append("error: " + this.ErrorGrid + ",");
            }
            string nestedExtraParam = "";
            if (NestedExtraParam != null)
            {
                nestedExtraParam = String.Join(",", NestedExtraParam.Select(e => e.ToString()).ToArray());
                nestedExtraParam = nestedExtraParam.Substring(0, nestedExtraParam.Length);
                nestedExtraParam = nestedExtraParam + ", filter: { field: '" + this.NestedParentID + "', operator: 'eq', value: e.data." + this.PrimaryID + " }";
            }
            string nestedExtraParamParent = "";
            if (NestedExtraParamParent != null)
            {
                foreach (var item in NestedExtraParamParent)
                {
                    nestedExtraParamParent += item.Field+":e.data."+item.Value+",";
                }

            }
            gridString.Append("data: {" + nestedExtraParamParent + nestedExtraParam + "}");

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
            gridString.Append("id: \"" + this.NestedPrimaryID + "\",");
            gridString.Append("fields: {");
            string strNestedSchema = String.Join(",", NestedColumn.Select(e => e.ToString(true, false, false, false, false)).ToArray());
            string strColNestedSchema = strNestedSchema;
            if (this.IsNestedProcessPart)
            {
                this.GetProcessConfiguration(this.NestedProcessName);
                strColNestedSchema = strColNestedSchema + "" + new GridColumn().ToProcessString(true);
            }
            gridString.Append(strNestedSchema.Substring(0, strNestedSchema.Length));
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("data: \"Data\",");
            gridString.Append("total: \"Total\"");
            gridString.Append("}");
            gridString.Append("},");

            if (!this.IsNestedAutoHeight)
            {
                gridString.Append("height: " + this.NestedHeight.ToString() + ",");
            }
            gridString.Append("scrollable: " + this.IsNestedAllowedScrolling.ToString().ToLower() + ",");
            gridString.Append("pageable: " + this.NestedIsPageable.ToString().ToLower() + ",");
            if (NestedChildColumn != null)
            {
                gridString.Append("detailInit: childDetailInit,"); //For Nested Grid
            }
            //gridString.Append("detailInit: detailInit,");

            gridString.Append("dataBound: onGridDataBound,");

            gridString.Append("columns: [");
            string nestedUrl = PageName + "?Module=" + this.NestedModuleName + "&Apps=" + this.NestedAppsName + "&FormAction=";
            string nestedTargetParamRead = nestedUrl + "Read&RecID=#=" + this.NestedPrimaryID + "#";
            string nestedTargetParamEdit = nestedUrl + "Edit&RecID=#=" + this.NestedPrimaryID + "#";
            string nestedTargetParamDelete = nestedUrl + "Delete&RecID=#=" + this.NestedPrimaryID + "#";
            gridString.Append("{");

            if (NestedIsShowEdit)
            {
                gridString.Append("template: ' <a class=\"actionButton actionView\" href=\"" + nestedTargetParamRead + "\">Read</a> <a class=\"actionButton actionEdit\" href=\"" + nestedTargetParamEdit + "\">Edit</a> <a  class=\"actionButton actionDelte\" href=\"" + nestedTargetParamDelete + "\"> Delete </a>', title: \"Action\", width: \"120px\", filterable: false, sortable: false");
            }
            else
            {
                if (NestedModuleName.Trim().ToUpper() == "SHIPMENT")
                {
                    gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
                }
                else
                {
                    gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
                    //gridString.Append("template: ' <input type=\"checkbox\" id=\"NestedRead\" name=\"NestedRead\" data-type=\"boolean\" onclick=\"return CheckPermission(this);\" onchange=\"return CheckPermission(this);\" class=\"checkbox\"/>', title: \"<div><input type='checkbox' id='NestedAll' name='NestedAll' onclick='return NestedCheckAll(this);' onchange='return NestedCheckAll(this);' class='checkbox'/></div>\", width: \"50px\", filterable: false, sortable: false");
                }
            }

            gridString.Append("},");
            //gridString.Append(String.Join(",", NestedColumn.Select(e => e.ToString(false, this.IsNestedAllowedSorting, this.IsNestedAllowedFiltering, true, false)).ToArray()));
            string strNestedColValue = String.Join(",", NestedColumn.Select(e => e.ToString(false, this.IsNestedAllowedSorting, this.IsNestedAllowedFiltering, true, false)).ToArray());
            string strNestedColData = strNestedColValue;
            if (this.IsNestedProcessPart)
            {
                strNestedColData = strNestedColData + "" + new GridColumn().ToProcessString(false);
            }
            gridString.Append(strNestedColData);
            gridString.Append("]");
            gridString.Append("});");
            gridString.Append("}");

            #endregion

            if (this.IsAllowNestedGrid)
            {

                #region NestedChildGridScript

                ///* ****************************************************************************
                // *                        Nested Child Child                                                          Grid Start
                // * ****************************************************************************/
                if (NestedChildColumn != null)
                {
                    gridString.Append("function childDetailInit(e) {");
                    gridString.Append("e.sender.options.parentValue= e.data." + this.PrimaryID + ";");
                    gridString.Append("e.sender.options.storedparentValue= e.data." + this.PrimaryID + ";");
                    gridString.Append("$('<div/>').appendTo(e.detailCell).kendoGrid({");
                    gridString.Append("dataSource: {");
                    gridString.Append("type: \"json\",");
                    gridString.Append("serverPaging: " + this.IsNestedChildAllowedPaging.ToString().ToLower() + ",");
                    gridString.Append("serverSorting: " + this.IsNestedChildAllowedSorting.ToString().ToLower() + ",");
                    gridString.Append("serverFiltering: " + this.IsNestedChildAllowedFiltering.ToString().ToLower() + ",");
                    gridString.Append("parentId: '" + this.NestedChildParentID + "',");
                    gridString.Append("parentValue: e.data." + this.PrimaryID + ",");
                    gridString.Append("filter: { field: \"" + this.NestedChildParentID + "\", operator: \"eq\", value: e.data." + this.PrimaryID + " },");
                    gridString.Append("allowUnsort:  " + this.IsNestedChildAllowedSorting.ToString().ToLower() + ",");
                    gridString.Append("pageSize: " + this.NestedChildDefaultPageSize.ToString() + ",");
                    gridString.Append("transport: {");
                    gridString.Append("read: {");
                    gridString.Append("url: \"" + this.NestedChildDataSoruceUrl + "\",");
                    gridString.Append("dataType: \"json\",");
                    gridString.Append("type: \"POST\",");
                    gridString.Append("contentType: \"application/json; charset=utf-8\",");
                    //gridString.Append("data: {}");

                    if (!string.IsNullOrEmpty(this.SuccessGrid))
                    {
                        gridString.Append("success: " + this.SuccessGrid + ",");
                    }
                    if (!string.IsNullOrEmpty(this.NestedChildSuccessOnBlank))
                    {
                        gridString.Append("successonblank: " + this.NestedChildSuccessOnBlank + ",");
                    }
                    if (!string.IsNullOrEmpty(this.ErrorGrid))
                    {
                        gridString.Append("error: " + this.ErrorGrid + ",");
                    }
                    string NestedChildExtraParam = "";
                    if (NestedChildExtraParam != null)
                    {
                        NestedChildExtraParam = String.Join(",", NestedChildExtraParam.Select(e => e.ToString()).ToArray());
                        NestedChildExtraParam = NestedChildExtraParam.Substring(0, NestedChildExtraParam.Length);
                        NestedChildExtraParam = NestedChildExtraParam + ", filter: { field: '" + this.NestedChildParentID + "', operator: 'eq', value: e.data." + this.PrimaryID + " }";
                    }
                    gridString.Append("data: {" + NestedChildExtraParam + "}");

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
                    gridString.Append("id: \"" + this.NestedChildPrimaryID + "\",");
                    gridString.Append("fields: {");
                    string strNestedChildSchema = String.Join(",", NestedChildColumn.Select(e => e.ToString(true, false, false, false, false)).ToArray());
                    string strColNestedChildSchema = strNestedChildSchema;
                    if (this.IsNestedChildProcessPart)
                    {
                        this.GetProcessConfiguration(this.NestedChildProcessName);
                        strColNestedChildSchema = strColNestedChildSchema + "" + new GridColumn().ToProcessString(true);
                    }
                    gridString.Append(strNestedChildSchema.Substring(0, strNestedChildSchema.Length));
                    gridString.Append("}");
                    gridString.Append("},");
                    gridString.Append("data: \"Data\",");
                    gridString.Append("total: \"Total\"");
                    gridString.Append("}");
                    gridString.Append("},");

                    if (!this.IsNestedChildAutoHeight)
                    {
                        gridString.Append("height: " + this.NestedChildHeight.ToString() + ",");
                    }
                    gridString.Append("scrollable: " + this.IsNestedChildAllowedScrolling.ToString().ToLower() + ",");
                    gridString.Append("pageable: " + this.NestedChildIsPageable.ToString().ToLower() + ",");
                    gridString.Append("detailInit: childdetailInit,"); //For NestedChild Grid
                    //gridString.Append("detailInit: detailInit,");
                   
                    gridString.Append("columns: [");
                    string NestedChildUrl = PageName + "?Module=" + this.NestedChildModuleName + "&Apps=" + this.NestedChildAppsName + "&FormAction=";
                    string NestedChildTargetParamRead = NestedChildUrl + "Read&RecID=#=" + this.NestedChildPrimaryID + "#";
                    string NestedChildTargetParamEdit = NestedChildUrl + "Edit&RecID=#=" + this.NestedChildPrimaryID + "#";
                    string NestedChildTargetParamDelete = NestedChildUrl + "Delete&RecID=#=" + this.NestedChildPrimaryID + "#";
                    gridString.Append("{");

                    if (NestedChildIsShowEdit)
                    {
                        gridString.Append("template: ' <a class=\"actionButton actionView\" href=\"" + NestedChildTargetParamRead + "\">Read</a> <a class=\"actionButton actionEdit\" href=\"" + NestedChildTargetParamEdit + "\">Edit</a> <a  class=\"actionButton actionDelte\" href=\"" + NestedChildTargetParamDelete + "\"> Delete </a>', title: \"Action\", width: \"120px\", filterable: false, sortable: false");
                    }
                    else
                    {
                        if (NestedChildModuleName.Trim().ToUpper() == "SHIPMENT")
                        {
                            gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
                        }
                        else
                        {
                            gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
                            //gridString.Append("template: ' <input type=\"checkbox\" id=\"NestedChildRead\" name=\"NestedChildRead\" data-type=\"boolean\" onclick=\"return CheckPermission(this);\" onchange=\"return CheckPermission(this);\" class=\"checkbox\"/>', title: \"<div><input type='checkbox' id='NestedChildAll' name='NestedChildAll' onclick='return NestedChildCheckAll(this);' onchange='return NestedChildCheckAll(this);' class='checkbox'/></div>\", width: \"50px\", filterable: false, sortable: false");
                        }
                    }

                    gridString.Append("},");
                    //gridString.Append(String.Join(",", NestedChildColumn.Select(e => e.ToString(false, this.IsNestedChildAllowedSorting, this.IsNestedChildAllowedFiltering, true, false)).ToArray()));
                    string strNestedChildColValue = String.Join(",", NestedChildColumn.Select(e => e.ToString(false, this.IsNestedChildAllowedSorting, this.IsNestedChildAllowedFiltering, true, false)).ToArray());
                    string strNestedChildColData = strNestedChildColValue;
                    if (this.IsNestedChildProcessPart)
                    {
                        strNestedChildColData = strNestedChildColData + "" + new GridColumn().ToProcessString(false);
                    }
                    gridString.Append(strNestedChildColData);
                    gridString.Append("]");
                    gridString.Append("});");
                    gridString.Append("}");
                }
                #endregion
            }


            //gridString.Append("if ($.browser.mozilla) { function CheckAllDocument(obj){$(obj).change(function() { var self = $(this); if (self.attr('checked')) { self.closest('tr').next('tr').find(':checkbox.checkbox').attr('checked', true); } else { self.closest('tr').next('tr').find(':checkbox.checkbox').attr('checked', false); }});};  }else { function CheckAllDocument(obj){$(obj).click(function() { var self = $(this); if (self.attr('checked')) { self.closest('tr').next('tr').find(':checkbox.checkbox').attr('checked', true); } else { self.closest('tr').next('tr').find(':checkbox.checkbox').attr('checked', false); }});}; }");
            //gridString.Append("if ($.browser.mozilla) { function NestedCheckAll(obj){$(obj).change(function() { var self = $(this); if (self.attr('checked')) { self.closest('table').closest('tr').find(':checkbox').attr('checked', true); } else { self.closest('table').closest('tr').find(':checkbox').attr('checked', false); }});}; } else { function NestedCheckAll(obj){$(obj).click(function() { var self = $(this); if (self.attr('checked')) { self.closest('table').closest('tr').find(':checkbox').attr('checked', true); } else { self.closest('table').closest('tr').find(':checkbox').attr('checked', false); }});}; }");
            //gridString.Append("if ($.browser.mozilla) { function CheckPermission(obj){$(obj).change(function() { var self = $(this); if (self.attr('checked')) { self.closest('tr').find(':checkbox').attr('checked', true); } else { self.closest('tr').find(':checkbox').attr('checked', false); }});}; } else { function CheckPermission(obj){$(obj).click(function() { var self = $(this); if (self.attr('checked')) { self.closest('tr').find(':checkbox').attr('checked', true); } else { self.closest('tr').find(':checkbox').attr('checked', false); }});}; }");
            gridString.Append("</script>");
            gridString.Append("</td></tr></table>");
            gridString.Append("<script type='text/javascript'>");
            gridString.Append("$(document).ready(function() {");
            gridString.Append("$('.k-hierarchy-cell').find('.k-icon.k-plus').bind('click', function(e) {$(this).closest('tr').each(function(index, element){ $(this).find(\"input[type='hidden'][name$='IsChildOpen']\").val('true'); }); });");
            gridString.Append("});");
            gridString.Append("</script>");
        }

        /// <summary>
        /// Default distructor of the Grid Claas
        /// </summary>
        ~NestedGrid()
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

    public class GridExtraParams
    {
        public string Field { get; set; }
        public string Value { get; set; }

        public GridExtraParams()
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
    public class NestedChildGridExtraParam
    {
        public string Field { get; set; }
        public string Value { get; set; }

        public NestedChildGridExtraParam()
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

    public class NestedGridExtraParam
    {
        public string Field { get; set; }
        public string Value { get; set; }

        public NestedGridExtraParam()
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
}