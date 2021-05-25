using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace CargoFlash.SoftwareFactory.WebUI.Controls
{
    public class ECargoGrid : IDisposable
    {
        /// <summary>
        /// Properties of grid class
        /// </summary>
        public string GridID { get; set; }
        public string DataSoruceUrl { get; set; }
        public string ReadGridUrl { get; set; }
        public string EditGridUrl { get; set; }
        public string ECargoGridUrl { get; set; }
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
        public List<ECargoGridExtraParams> ExtraParam { get; set; }
        public bool IsColumnMenu { get; set; }
        public bool IsToggleColumns { get; set; }
        public bool IsCheckBoxRequired { get; set; }

        #region ECargoGridProperty

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
        public List<ECargoGridExtraParam> NestedExtraParam { get; set; }

        #endregion

        #region ECargoGridSecondProperty

        public string SecondNestedDataSoruceUrl { get; set; }
        public string SecondNestedReadGridUrl { get; set; }
        public string SecondNestedEditGridUrl { get; set; }
        public string SecondNestedDeleteGridUrl { get; set; }
        public string SecondNestedPrimaryID { get; set; }
        public string SecondNestedParentID { get; set; }
        public bool IsSecondNestedChild { get; set; }
        public bool IsSecondNestedAllowedPaging { get; set; }
        public bool IsSecondNestedAllowedSorting { get; set; }
        public bool IsSecondNestedAllowedFiltering { get; set; }
        public bool IsSecondNestedAllowedAction { get; set; }
        public bool IsSecondNestedAllowedScrolling { get; set; }
        public int SecondNestedHeight { get; set; }
        public string SecondNestedDefaultSortName { get; set; }
        public string SecondNestedSortDirection { get; set; }
        public string SecondNestedActionDirection { get; set; }
        public int SecondNestedDefaultPageSize { get; set; }
        public string SecondNestedModuleName { get; set; }
        public string SecondNestedAppsName { get; set; }
        public string SecondNestedActionName { get; set; }
        public string SecondNestedPageName { get; set; }
        public List<GridColumn> SecondNestedColumn { get; set; }
        public List<GridAction> SecondNestedAction { get; set; }
        public bool SecondNestedIsShowEdit { get; set; }
        public bool SecondNestedIsPageable { get; set; }
        public bool SecondNestedIsRequiredCheckBox { get; set; }

        #endregion

        #region ECargoGridThirdProperty

        public string ThirdNestedDataSoruceUrl { get; set; }
        public string ThirdNestedReadGridUrl { get; set; }
        public string ThirdNestedEditGridUrl { get; set; }
        public string ThirdNestedDeleteGridUrl { get; set; }
        public string ThirdNestedPrimaryID { get; set; }
        public string ThirdNestedParentID { get; set; }
        public bool IsThirdNestedChild { get; set; }
        public bool IsThirdNestedAllowedPaging { get; set; }
        public bool IsThirdNestedAllowedSorting { get; set; }
        public bool IsThirdNestedAllowedFiltering { get; set; }
        public bool IsThirdNestedAllowedAction { get; set; }
        public bool IsThirdNestedAllowedScrolling { get; set; }
        public int ThirdNestedHeight { get; set; }
        public string ThirdNestedDefaultSortName { get; set; }
        public string ThirdNestedSortDirection { get; set; }
        public string ThirdNestedActionDirection { get; set; }
        public int ThirdNestedDefaultPageSize { get; set; }
        public string ThirdNestedModuleName { get; set; }
        public string ThirdNestedAppsName { get; set; }
        public string ThirdNestedActionName { get; set; }
        public string ThirdNestedPageName { get; set; }
        public List<GridColumn> ThirdNestedColumn { get; set; }
        public List<GridAction> ThirdNestedAction { get; set; }
        public bool ThirdNestedIsShowEdit { get; set; }
        public bool ThirdNestedIsPageable { get; set; }

        #endregion

        /// <summary>
        /// Default contructor of the Grid Claas
        /// </summary>
        public ECargoGrid()
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
            this.IsAllowedScrolling = true;
            this.IsFormHeader = true;
            this.IsModule = false;
            this.IsShowEdit = true;
            this.IsSaveChanges = true;
            this.IsAddNewRecord = false;
            this.EditingMode = 3;
            this.IsColumnMenu = true;
            this.IsToggleColumns = true;
            this.IsCheckBoxRequired = false;

            #region ECargoGridPropertyInitialize
            this.NestedHeight = 300;
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
            #endregion

            #region ECargoGridSecondPropertyInitialize
            this.SecondNestedHeight = 300;
            this.SecondNestedDefaultPageSize = 10;
            this.SecondNestedDefaultSortName = "asc";
            this.SecondNestedSortDirection = "left";
            this.IsSecondNestedAllowedAction = false;
            this.IsSecondNestedAllowedFiltering = true;
            this.IsSecondNestedAllowedPaging = true;
            this.IsSecondNestedAllowedSorting = true;
            this.IsSecondNestedAllowedScrolling = true;
            this.SecondNestedIsShowEdit = true;
            this.SecondNestedIsPageable = true;
            this.SecondNestedIsRequiredCheckBox = false;
            #endregion

            #region ECargoGridThirdPropertyInitialize
            this.ThirdNestedHeight = 300;
            this.ThirdNestedDefaultPageSize = 10;
            this.ThirdNestedDefaultSortName = "asc";
            this.ThirdNestedSortDirection = "left";
            this.IsThirdNestedAllowedAction = false;
            this.IsThirdNestedAllowedFiltering = true;
            this.IsThirdNestedAllowedPaging = true;
            this.IsThirdNestedAllowedSorting = true;
            this.IsThirdNestedAllowedScrolling = true;
            this.ThirdNestedIsShowEdit = true;
            this.ThirdNestedIsPageable = true;
            #endregion
        }

        /// <summary>
        /// 
        /// </summary>
        public void InstantiateIn(StringBuilder gridString)
        {
            if (IsFormHeader)
            {
                gridString.Append("<table class='WebFormTable2'><tr><td class='formSection' colspan='2'>" + this.AppsName + "</td></tr><tr><td class='formbuttonrow' colspan='2'><a href='" + this.NewURL + "' class='buttonlink'>New Group<a/></td></tr><tr><td colspan='2'>");
            }
            else
            {
                gridString.Append("<table class='WebFormTable2'><tr><td class='formSection' colspan='2'>Permission Management</td></tr><tr><td colspan='2' class='formActiontitle Background'>" + this.FormCaptionText + "</td></tr><tr><td colspan='2' class='formbuttonrow'><button type=\"submit\" value=\"Submit\" onclick=\"return SaveForm('form1','json','');\" class=\"button\">Save</button></td></tr><tr><td colspan='2'>");

            }

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
            gridString.Append("serverFiltering: " + this.IsAllowedFiltering.ToString().ToLower() + ",");
            gridString.Append("allowUnsort:  " + this.IsAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("pageSize: " + this.DefaultPageSize.ToString() + ",");
            gridString.Append("transport: {");
            gridString.Append("read: {");
            gridString.Append("url: \"" + this.DataSoruceUrl + "\",");
            gridString.Append("dataType: \"json\",");
            gridString.Append("type: \"POST\",");
            gridString.Append("contentType: \"application/json; charset=utf-8\",");

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
            gridString.Append(strSchema.Substring(0, strSchema.Length));
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("data: \"Data\",");
            gridString.Append("total: \"Total\"");
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("scrollable: " + this.IsAllowedScrolling.ToString().ToLower() + ",");
            gridString.Append("sortable: " + this.IsAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("filterable: " + this.IsAllowedFiltering.ToString().ToLower() + ",");

            gridString.Append("editable: true,");

            if (this.IsAddNewRecord || this.IsSaveChanges)
            {
                gridString.Append("toolbar: [" + (this.IsAddNewRecord ? "\"create\"" : "") + "" + (this.IsAddNewRecord && this.IsSaveChanges ? "," : "") + (this.IsSaveChanges ? "\"save\"" : "") + ",\"cancel\"]" + ",");
            }

            gridString.Append("detailInit: detailInit,"); //For Nested Grid

            gridString.Append("columnMenu: " + this.IsColumnMenu.ToString().ToLower() + ",");

            gridString.Append("selectable: 'row',");
            gridString.Append("columnMenu: { columns: " + this.IsToggleColumns.ToString().ToLower() + "},");

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
                if (this.IsCheckBoxRequired)
                {
                    gridString.Append("template: ' <input type=\"checkbox\" id=\"TopNestedRead\" name=\"TopFirstNestedRead\" data-type=\"boolean\" onclick=\"return TOPNestedCheckAll(this);\" onchange=\"return TOPNestedCheckAll(this);\"/>', title: \"\", width: \"50px\", filterable: false, sortable: false");
                }
                else
                {
                    gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
                }
            }

            gridString.Append("},");
            gridString.Append(String.Join(",", Column.Select(e => e.ToString(false, this.IsAllowedSorting, this.IsAllowedFiltering, true, false)).ToArray()));
            gridString.Append("]");
            gridString.Append(", editable: \"popup\"");
            gridString.Append("});");
            gridString.Append("});");

            #region ECargoGridScript

            ///* ****************************************************************************
            // *                          Nested Grid Start 1
            // * ****************************************************************************/

            gridString.Append("function detailInit(e) {");
            gridString.Append("$('<div/>').appendTo(e.detailCell).kendoGrid({");
            gridString.Append("dataSource: {");
            gridString.Append("type: \"json\",");
            gridString.Append("serverPaging: " + this.IsNestedAllowedPaging.ToString().ToLower() + ",");
            gridString.Append("serverSorting: " + this.IsNestedAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("serverFiltering: " + this.IsNestedAllowedFiltering.ToString().ToLower() + ",");
            gridString.Append("filter: { field: \"" + this.NestedParentID + "\", operator: \"eq\", value: e.data." + this.PrimaryID + " },");
            gridString.Append("allowUnsort:  " + this.IsNestedAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("pageSize: " + this.NestedDefaultPageSize.ToString() + ",");
            gridString.Append("transport: {");
            gridString.Append("read: {");
            gridString.Append("url: \"" + this.NestedDataSoruceUrl + "\",");
            gridString.Append("dataType: \"json\",");
            gridString.Append("type: \"POST\",");
            gridString.Append("contentType: \"application/json; charset=utf-8\",");

            string nestedExtraParam = "";
            if (NestedExtraParam != null)
            {
                nestedExtraParam = String.Join(",", NestedExtraParam.Select(e => e.ToString()).ToArray());
                nestedExtraParam = nestedExtraParam.Substring(0, nestedExtraParam.Length);
            }
            gridString.Append("data: {" + nestedExtraParam + "}");

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
            gridString.Append(strNestedSchema.Substring(0, strNestedSchema.Length));
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("data: \"Data\",");
            gridString.Append("total: \"Total\"");
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("scrollable: " + this.IsNestedAllowedScrolling.ToString().ToLower() + ",");
            gridString.Append("pageable: " + this.NestedIsPageable.ToString().ToLower() + ",");

            gridString.Append("detailInit: detailInitSecond,"); //For Nested Grid

            gridString.Append("columns: [");
            string nestedUrl = PageName + "?Module=" + this.NestedModuleName + "&Apps=" + this.NestedAppsName + "&FormAction=";
            string nestedTargetParamRead = nestedUrl + "Read&RecID=#=" + this.NestedPrimaryID + "#";
            string nestedTargetParamEdit = nestedUrl + "Edit&RecID=#=" + this.NestedPrimaryID + "#";
            string nestedTargetParamDelete = nestedUrl + "Delete&RecID=#=" + this.NestedPrimaryID + "#";
            gridString.Append("{");
            gridString.Append("template: ' <input type=\"checkbox\" id=\"FirstNestedRead\" name=\"FirstNestedRead\" data-type=\"boolean\" onclick=\"return TOPNestedCheckAll(this);\" onchange=\"return TOPNestedCheckAll(this);\" class=\"checkbox\"/>', title: \"<div><input type='checkbox' id='NestedAll' name='NestedAll' onclick='return NestedCheckAll(this);' onchange='return NestedCheckAll(this);' class='checkbox'/></div>\", width: \"50px\", filterable: false, sortable: false");
            gridString.Append("},");
            gridString.Append(String.Join(",", NestedColumn.Select(e => e.ToString(false, this.IsNestedAllowedSorting, this.IsNestedAllowedFiltering, true, false)).ToArray()));
            gridString.Append("]");
            gridString.Append("});");
            gridString.Append("}");

            #endregion

            #region ECargoGridScript

            ///* ****************************************************************************
            // *                          Nested Grid Start 2
            // * ****************************************************************************/

            gridString.Append("function detailInitSecond(e) {var TableFrom=e.masterRow.closest(\"tr\").find(\"input[type='hidden'][id^='hdnTableFrom']\").val();");
            gridString.Append("$('<div/>').appendTo(e.detailCell).kendoGrid({");
            gridString.Append("dataSource: {");
            gridString.Append("type: \"json\",");
            gridString.Append("serverPaging: " + this.IsSecondNestedAllowedPaging.ToString().ToLower() + ",");
            gridString.Append("serverSorting: " + this.IsSecondNestedAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("serverFiltering: " + this.IsSecondNestedAllowedFiltering.ToString().ToLower() + ",");
            gridString.Append("filter: { field: \"" + this.SecondNestedParentID + "\", operator: \"eq\", value: e.data." + this.NestedPrimaryID + " },");
            gridString.Append("allowUnsort:  " + this.IsSecondNestedAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("pageSize: " + this.SecondNestedDefaultPageSize.ToString() + ",");
            gridString.Append("transport: {");
            gridString.Append("read: {");
            gridString.Append("url: \"" + this.SecondNestedDataSoruceUrl + "\",");
            gridString.Append("dataType: \"json\",");
            gridString.Append("type: \"POST\",");
            gridString.Append("contentType: \"application/json; charset=utf-8\",");

            string nestedExtraParamSecond = "";
            if (NestedExtraParam != null)
            {
                nestedExtraParamSecond = String.Join(",", NestedExtraParam.Select(e => e.ToString()).ToArray());
                nestedExtraParamSecond = nestedExtraParamSecond.Substring(0, nestedExtraParamSecond.Length);
            }
            gridString.Append("data: {TableFrom : TableFrom}");

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
            gridString.Append("id: \"" + this.SecondNestedPrimaryID + "\",");
            gridString.Append("fields: {");
            string strSecondNestedSchemaSecond = String.Join(",", SecondNestedColumn.Select(e => e.ToString(true, false, false, false, false)).ToArray());
            gridString.Append(strSecondNestedSchemaSecond.Substring(0, strSecondNestedSchemaSecond.Length));
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("data: \"Data\",");
            gridString.Append("total: \"Total\"");
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("scrollable: " + this.IsSecondNestedAllowedScrolling.ToString().ToLower() + ",");
            gridString.Append("pageable: " + this.SecondNestedIsPageable.ToString().ToLower() + ",");

            gridString.Append("detailInit: detailInitThird,"); //For Nested Grid

            gridString.Append("columns: [");
            string SecondNestedUrlSecond = PageName + "?Module=" + this.SecondNestedModuleName + "&Apps=" + this.SecondNestedAppsName + "&FormAction=";
            string SecondNestedTargetParamReadSecond = SecondNestedUrlSecond + "Read&RecID=#=" + this.SecondNestedPrimaryID + "#";
            string SecondNestedTargetParamEditSecond = SecondNestedUrlSecond + "Edit&RecID=#=" + this.SecondNestedPrimaryID + "#";
            string SecondNestedTargetParamDeleteSecond = SecondNestedUrlSecond + "Delete&RecID=#=" + this.SecondNestedPrimaryID + "#";
            gridString.Append("{");
            
            if (this.SecondNestedIsRequiredCheckBox)
            {
                gridString.Append("template: ' <input type=\"checkbox\" id=\"SecondNestedRead\" name=\"SecondNestedRead\" data-type=\"boolean\" class=\"checkbox\"/>', title: \"<div><input type='checkbox' id='NestedAll' name='NestedAll' onclick='return NestedCheckAll(this);' onchange='return NestedCheckAll(this);' class='checkbox'/></div>\", width: \"50px\", filterable: false, sortable: false");
            }
            else
            {
                gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
            }

            gridString.Append("},");
            gridString.Append(String.Join(",", SecondNestedColumn.Select(e => e.ToString(false, this.IsSecondNestedAllowedSorting, this.IsSecondNestedAllowedFiltering, true, false)).ToArray()));
            gridString.Append("]");
            gridString.Append("});");
            gridString.Append("}");

            #endregion

            #region ECargoGridScript

            ///* ****************************************************************************
            // *                          Nested Grid Start 3
            // * ****************************************************************************/

            gridString.Append("function detailInitThird(e) {var TableFrom=e.masterRow.closest(\"tr\").find(\"input[type='hidden'][id^='hdnTableFrom']\").val();");
            gridString.Append("$('<div/>').appendTo(e.detailCell).kendoGrid({");
            gridString.Append("dataSource: {");
            gridString.Append("type: \"json\",");
            gridString.Append("serverPaging: " + this.IsThirdNestedAllowedPaging.ToString().ToLower() + ",");
            gridString.Append("serverSorting: " + this.IsThirdNestedAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("serverFiltering: " + this.IsThirdNestedAllowedFiltering.ToString().ToLower() + ",");
            gridString.Append("filter: { field: \"" + this.ThirdNestedParentID + "\", operator: \"eq\", value: e.data." + this.SecondNestedPrimaryID + " },");
            gridString.Append("allowUnsort:  " + this.IsThirdNestedAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("pageSize: " + this.ThirdNestedDefaultPageSize.ToString() + ",");
            gridString.Append("transport: {");
            gridString.Append("read: {");
            gridString.Append("url: \"" + this.ThirdNestedDataSoruceUrl + "\",");
            gridString.Append("dataType: \"json\",");
            gridString.Append("type: \"POST\",");
            gridString.Append("contentType: \"application/json; charset=utf-8\",");

            string nestedExtraParamThird = "";
            if (NestedExtraParam != null)
            {
                nestedExtraParamThird = String.Join(",", NestedExtraParam.Select(e => e.ToString()).ToArray());
                nestedExtraParamThird = nestedExtraParamThird.Substring(0, nestedExtraParamThird.Length);
            }
            //gridString.Append("data: {" + nestedExtraParamThird + "}");
            gridString.Append("data: {TableFrom : TableFrom}");

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
            gridString.Append("id: \"" + this.ThirdNestedPrimaryID + "\",");
            gridString.Append("fields: {");
            string strThirdNestedSchemaThird = String.Join(",", ThirdNestedColumn.Select(e => e.ToString(true, false, false, false, false)).ToArray());
            gridString.Append(strThirdNestedSchemaThird.Substring(0, strThirdNestedSchemaThird.Length));
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("data: \"Data\",");
            gridString.Append("total: \"Total\"");
            gridString.Append("}");
            gridString.Append("},");
            gridString.Append("scrollable: " + this.IsThirdNestedAllowedScrolling.ToString().ToLower() + ",");
            gridString.Append("pageable: " + this.ThirdNestedIsPageable.ToString().ToLower() + ",");
            gridString.Append("columns: [");
            string ThirdNestedUrlThird = PageName + "?Module=" + this.ThirdNestedModuleName + "&Apps=" + this.ThirdNestedAppsName + "&FormAction=";
            string ThirdNestedTargetParamReadThird = ThirdNestedUrlThird + "Read&RecID=#=" + this.ThirdNestedPrimaryID + "#";
            string ThirdNestedTargetParamEditThird = ThirdNestedUrlThird + "Edit&RecID=#=" + this.ThirdNestedPrimaryID + "#";
            string ThirdNestedTargetParamDeleteThird = ThirdNestedUrlThird + "Delete&RecID=#=" + this.ThirdNestedPrimaryID + "#";
            gridString.Append("{");
            gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
            gridString.Append("},");
            gridString.Append(String.Join(",", ThirdNestedColumn.Select(e => e.ToString(false, this.IsThirdNestedAllowedSorting, this.IsThirdNestedAllowedFiltering, true, false)).ToArray()));
            gridString.Append("]");
            gridString.Append("});");
            gridString.Append("}");

            #endregion

            gridString.Append("if ($.browser.mozilla) { function NestedCheckAll(obj){$(obj).change(function() { var self = $(this); if (self.attr('checked')) { self.closest('table').closest('tr').find('.checkbox').attr('checked', true); } else { self.closest('table').closest('tr').find('.checkbox').attr('checked', false); }});}; } else { function NestedCheckAll(obj){$(obj).click(function() {var self = $(this); if (self.attr('checked')) { self.closest('table').closest('tr').find('.checkbox').attr('checked', true); } else { self.closest('table').closest('tr').find('.checkbox').attr('checked', false); }});}; }");
            gridString.Append("if ($.browser.mozilla) { function TOPNestedCheckAll(obj){$(obj).change(function() { var self = $(this); if (self.attr('checked')) { self.closest('tr').next('tr').find('.checkbox').attr('checked', true); } else { self.closest('tr').next('tr').find('.checkbox').attr('checked', false); }});}; } else { function TOPNestedCheckAll(obj){$(obj).click(function() {var self = $(this); if (self.attr('checked')) { self.closest('tr').next('tr').find('.checkbox').attr('checked', true); } else { self.closest('tr').next('tr').find('.checkbox').attr('checked', false); }});}; }");
            gridString.Append("</script>");
            gridString.Append("</td></tr></table>");
        }

        /// <summary>
        /// Default distructor of the Grid Claas
        /// </summary>
        ~ECargoGrid()
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
    }

    public class ECargoGridExtraParams
    {
        public string Field { get; set; }
        public string Value { get; set; }

        public ECargoGridExtraParams()
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

    public class ECargoGridExtraParam
    {
        public string Field { get; set; }
        public string Value { get; set; }

        public ECargoGridExtraParam()
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
