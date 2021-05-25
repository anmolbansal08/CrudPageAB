using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace CargoFlash.SoftwareFactory.WebUI.Controls
{
    public class GridMain : IDisposable
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
        public string CommandButtonNewText { get; set; }
        public string FormCaptionText { get; set; }
        public string NewURL { get; set; }
        public List<GridMainColumn> Column { get; set; }
        public List<GridMainAction> Action { get; set; }
        public bool IsFormHeader { get; set; }
        public bool IsModule { get; set; }
        public bool IsShowEdit { get; set; }
        public string ServiceModuleName { get; set; }
        public bool IsSaveChanges { set; get; }
        public bool IsAddNewRecord { set; get; }
        public int EditingMode { set; get; }
        public string NestedGridUrl { get; set; }
        public bool IsUserModule { set; get; }
        public int UserSNo { set; get; }
        public bool IsUserSNo { set; get; }
        public bool IsPageSNo { set; get; }
        public bool IsToolBar { set; get; }
        public string ApplicationType { set; get; }
        public bool IsAutoSize { set; get; }
        public bool IsBackRequired { set; get; }
        public string SuccessGrid { get; set; }
        public string ErrorGrid { get; set; }
        public bool IsColumnMenu { set; get; }
        public List<GridMainExtraParam> ExtraParam { get; set; }
        public string ServiceName { set; get; }
        public string GroupColumnName { get; set; }
        public bool CheckedRequired { get; set; }
        public bool CheckBoxRequired { get; set; }
        public bool isCalculateRequired { get; set; }

        /// <summary>
        /// Default contructor of the Grid Claas
        /// </summary>
        public GridMain()
        {
            Guid gid = Guid.NewGuid();
            this.GridID = gid.ToString();
            this.Height = 400;
            this.DefaultPageSize = 10;
            this.DefaultSortName = "asc";
            this.SortDirection = "left";
            this.IsAllowedAction = true;
            this.IsAllowedFiltering = false;
            this.IsAllowedPaging = true;
            this.IsAllowedSorting = false;
            this.IsAllowedScrolling = false;
            this.IsFormHeader = true;
            this.IsModule = false;
            this.IsShowEdit = true;
            this.IsSaveChanges = false;
            this.IsAddNewRecord = false;
            this.EditingMode = 1;
            this.IsUserModule = false;
            this.UserSNo = 0;
            this.IsUserSNo = false;
            this.IsPageSNo = false;
            this.ApplicationType = "";
            this.IsAutoSize = true;
            this.IsBackRequired = false;
            this.IsColumnMenu = false;
            this.ServiceName = "";
            this.CheckedRequired = false;
            this.CheckBoxRequired = true;
            this.isCalculateRequired = false;
        }

        /// <summary>
        /// 
        /// </summary>
        public void InstantiateIn(StringBuilder gridString)
        {
            if (IsFormHeader)
            {
                gridString.Append("<table class='WebFormTable'><tr><td class='formSection' colspan='2'>" + this.FormCaptionText + "</td></tr><tr><td class='formbuttonrow' colspan='2'><a href='" + this.NewURL + "' class='buttonlink'>" + this.CommandButtonNewText + "<a/></td></tr><tr><td colspan='2'>");
            }
            else
            {
                if (IsToolBar)
                {
                    if (IsBackRequired)
                    {
                        gridString.Append("<table class='WebFormTable2'><tr><td class='formSection' colspan='2'>Permission Management</td></tr><tr><td colspan='2' class='formActiontitle Background'>" + this.FormCaptionText + "</td></tr><tr><td colspan='2' class='formbuttonrow'><a href='" + this.NewURL + "' class='buttonlink'>Back<a/></td></tr><tr><td colspan='2'>");
                    }
                    else
                    {
                        gridString.Append("<table class='WebFormTable2'><tr><td class='formSection' colspan='2'>Permission Management</td></tr><tr><td colspan='2' class='formActiontitle Background'>" + this.FormCaptionText + "</td></tr><tr><td colspan='2' class='formbuttonrow'><button type=\"submit\" value=\"AddUser\" onclick=\"return showUserPopup();\" class=\"button\">Add User</button><button type=\"submit\" value=\"AddGroup\" onclick=\"return showGroupPopup();\" class=\"button\">Add Group</button><button type=\"submit\" value=\"Submit\" onclick=\"return DeleteUserGroup('form1','json','');\" class=\"button\">Delete</button></td></tr><tr><td colspan='2'>");
                    }
                }
                else
                {
                    if (ApplicationType.Trim() != "")
                    {
                        gridString.Append("<table class='WebFormTable2'><tr><td colspan='2'>");
                    }
                    else
                    {
                        gridString.Append("<table class='WebFormTable2'><tr><td class='formSection' colspan='2'>Permission Management</td></tr><tr><td colspan='2' class='formActiontitle Background'>" + this.FormCaptionText + "</td></tr><tr><td colspan='2'>");
                    }
                }
            }

            if (string.IsNullOrEmpty(this.DataSoruceUrl))
                if(ServiceName.Trim()!="")
                    this.DataSoruceUrl = "Services/" + (string.IsNullOrEmpty(this.ServiceModuleName) ? "" : this.ServiceModuleName + "/") + this.AppsName + "Service.svc/" + ServiceName + "";
                    else
                this.DataSoruceUrl = "Services/" + (string.IsNullOrEmpty(this.ServiceModuleName) ? "" : this.ServiceModuleName + "/") + this.AppsName + "Service.svc/GetGridData";

            gridString.Append("<div id=\"" + this.GridID + "\">");
            gridString.Append("</div>");
            gridString.Append("<script type=\"text/javascript\">");
            gridString.Append("$(document).ready(function () {");
            gridString.Append("$(\"#" + this.GridID + "\").kendoGrid({");
            gridString.Append("dataSource: {");
            gridString.Append("type: \"json\",");
            gridString.Append("serverPaging: " + this.IsAllowedPaging.ToString().ToLower() + ",");
            gridString.Append("serverSorting: " + this.IsAllowedSorting.ToString().ToLower() + ",");
            gridString.Append("serverFiltering: " + this.IsAllowedFiltering.ToString().ToLower() + ",");
            gridString.Append("allowUnsort:  " + this.IsAllowedSorting.ToString().ToLower() + ",");
            if (IsAllowedPaging)
            {
                gridString.Append("pageSize: " + this.DefaultPageSize.ToString() + ",");
            }
            gridString.Append("transport: {");
            gridString.Append("read: {");
            gridString.Append("url: \"" + this.DataSoruceUrl + "\",");
            gridString.Append("dataType: \"json\",");
            gridString.Append("type: \"POST\",");
            gridString.Append("contentType: \"application/json; charset=utf-8\",");
            if (!string.IsNullOrEmpty(this.SuccessGrid))
            {
                gridString.Append("success: " + this.SuccessGrid + ",");
            }
            if (!string.IsNullOrEmpty(this.ErrorGrid))
            {
                gridString.Append("error: " + this.ErrorGrid + ",");
            }

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
            string strSchema = String.Join(",", Column.Select(e => e.ToString(true, false, false,false,false)).ToArray());
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
            if (IsAllowedPaging)
            {
                gridString.Append("pageable: " + this.IsAllowedPaging.ToString().ToLower() + ",");
            }
            gridString.Append("columnMenu: " + this.IsColumnMenu.ToString().ToLower() + ",");
            gridString.Append("columns: [");
            string url = PageName + "?Module=" + this.ModuleName + "&Apps=" + this.AppsName + "&FormAction=";
            string targetParamRead = url + "Read&RecID=#=" + this.PrimaryID + "#";
            string targetParamEdit = url + "Edit&RecID=#=" + this.PrimaryID + "#";
            string targetParamDelete = url + "Delete&RecID=#=" + this.PrimaryID + "#";
            gridString.Append("{");

            if (IsFormHeader)
            {
                gridString.Append("template: ' <a class=\"actionView\" href=\"" + targetParamRead + "\"><img src=\"Images/view.png\" border=0 /></a> <a class=\"actionEdit\" href=\"" + targetParamEdit + "\"><img src=\"Images/edit.png\" border=0 /></a> <a  class=\"actionDelete\" href=\"" + targetParamDelete + "\"><img src=\"Images/delete.png\" border=0 /></a>', title: \"Action\", width: \"80px\", filterable: false, sortable: false");
            }
            else
            {
                if (IsModule)
                {
                    if (IsShowEdit)
                    {
                        if (IsUserModule)
                        {
                            if (this.IsUserSNo)
                            {
                                targetParamEdit = "Users.aspx?Module=" + this.ModuleName + "&Apps=Pages&FormAction=INDEXVIEW&RecID=#=" + this.PrimaryID + "#&UserSNo=#=" + this.UserSNo + "#";
                            }
                            else
                            {
                                targetParamEdit = "Users.aspx?Module=" + this.ModuleName + "&Apps=UserGroup&FormAction=INDEXVIEW&RecID=#=" + this.PrimaryID + "#&UserSNo=#=" + this.PrimaryID + "#";
                            }
                        }
                        else
                        {
                            targetParamEdit = "Users.aspx?Module=" + this.ModuleName + "&Apps=Pages&FormAction=INDEXVIEW&RecID=#=" + this.PrimaryID + "#";
                        }
                        string multiAction = string.Empty;
                        if (Action != null)
                        {   
                            foreach (GridMainAction a in Action)
                            {
                                multiAction += a.ToString("", "", UserSNo, false, false);
                            }
                        }

                        gridString.Append("template: ' <a class=\"actionButton2 actionEdit\" href=\"" + targetParamEdit + "\">Edit</a>"+ multiAction + "', title: \"Action\", width: \"80px\", filterable: false, sortable: false");
                    }
                    else
                    {
                        if (this.IsPageSNo)
                        {
                            if (ApplicationType.Trim() != "")
                            {
                                if (ApplicationType.ToUpper() == "USER")
                                {
                                    gridString.Append("template: ' <input type=\"checkbox\" data-type=\"boolean\" class=\"checkbox\"/>', title: \"<input type='checkbox' id='chkAllUserList' name='chkAllUserList' onclick='return AllUserList();' onchange='return AllUserList();' class='checkbox'/>\", width: \"50px\", filterable: false, sortable: false");
                                }
                               else if (ApplicationType.ToUpper() == "GROUPUSER")
                                {
                                    gridString.Append("template: ' <input type=\"checkbox\" data-type=\"boolean\" class=\"checkbox\"/>', title: \"<input type='checkbox' id='chkAllGroupUserList' name='chkAllGroupUserList' onclick='return AllGroupUserList();' onchange='return AllGroupUserList();' class='checkbox'/>\", width: \"50px\", filterable: false, sortable: false");
                                }
                                else if (ApplicationType.ToUpper() == "GROUPUSERS")
                                {
                                    gridString.Append("template: ' <input type=\"checkbox\" data-type=\"boolean\" class=\"checkbox\"/>', title: \"<input type='checkbox' id='chkAllGroupUsersList' name='chkAllGroupUsersList' onclick='return AllGroupUsersList();' onchange='return AllGroupUsersList();' class='checkbox'/>\", width: \"50px\", filterable: false, sortable: false");
                                }
                                else if (ApplicationType.ToUpper() == "USERGROUP")
                                {
                                    gridString.Append("template: ' <input type=\"checkbox\" data-type=\"boolean\" class=\"checkbox\"/>', title: \"<input type='checkbox' id='chkAllUserGroupList' name='chkAllUserGroupList' onclick='return AllUserGroupList();' onchange='return AllUserGroupList();' class='checkbox'/>\", width: \"50px\", filterable: false, sortable: false");
                                }
                                else if (ApplicationType.ToUpper() == "USERGROUPS")
                                {
                                    gridString.Append("template: ' <input type=\"checkbox\" data-type=\"boolean\" class=\"checkbox\"/>', title: \"<input type='checkbox' id='chkAllUserGroupsList' name='chkAllUserGroupsList' onclick='return AllUserGroupsList();' onchange='return AllUserGroupsList();' class='checkbox'/>\", width: \"50px\", filterable: false, sortable: false");
                                }
                                else
                                {
                                    gridString.Append("template: ' <input type=\"checkbox\" data-type=\"boolean\" class=\"checkbox\"/>', title: \"<input type='checkbox' id='chkAllGroupList' name='chkAllGroupList' onclick='return AllGroupList();' onchange='return AllGroupList();' class='checkbox'/>\", width: \"50px\", filterable: false, sortable: false");
                                }
                            }
                            else
                            {
                                gridString.Append("template: ' <input type=\"checkbox\" id=\"Delete\" name=\"Delete\" data-type=\"boolean\" class=\"checkbox\"/>', title: \"<input type='checkbox' id='DeleteAllItems' name='DeleteAllItems' onclick='return DeleteAll(this);' onchange='return DeleteAll(this);' class='checkbox'/>\", width: \"50px\", filterable: false, sortable: false");
                            }
                        }
                        else
                        {
                            if (CheckedRequired)
                            {
                                gridString.Append("template: ' <input type=\"checkbox\" name=\"Read\" id=\"Read\" data-type=\"boolean\" checked=\"checked\"/>', title: \"<div><input type='checkbox' onclick='return CheckAll(this);' onchange='return CheckAll(this);' name='All' id='All' checked='checked'/></div>\", width: \"50px\", filterable: false, sortable: false");
                            }
                            else if (!CheckBoxRequired)
                            {
                                gridString.Append("template: '', title: \"\", width: \".01px\", filterable: false, sortable: false");
                            }
                            else
                            {
                                if (isCalculateRequired)
                                {
                                    gridString.Append("template: ' <input type=\"checkbox\" name=\"Read\" id=\"Read\" data-type=\"boolean\"', title: \"<div><input type='checkbox' name='All' id='All'/></div>\", width: \"50px\", filterable: false, sortable: false");
                                }
                                else
                                {
                                    gridString.Append("template: ' <input type=\"checkbox\" name=\"Read\" id=\"Read\" data-type=\"boolean\"/>', title: \"<div><input type='checkbox' onclick='return CheckAll(this);' onchange='return CheckAll(this);' name='All' id='All'/></div>\", width: \"50px\", filterable: false, sortable: false");
                                }
                            }
                        }
                    }
                }
                else
                {
                    gridString.Append("template: ' <a class=\"actionButton2 actionEdit\" href=\"" + targetParamEdit + "\">Edit</a>', title: \"Action\", width: \"80px\", filterable: false, sortable: false");
                }
            }

            gridString.Append("},");

            gridString.Append(String.Join(",", Column.Select(e => e.ToString(false, this.IsAllowedSorting, this.IsAllowedFiltering,false,false)).ToArray()));
            gridString.Append("]");
            gridString.Append("});");
            gridString.Append("});");            
            gridString.Append("if ($.browser.mozilla) { function DeleteAll(obj){$(obj).change(function() { var self = $(this); if (self.attr('checked')) { self.closest('table').closest('tr').find(':checkbox').attr('checked', true); } else { self.closest('table').closest('tr').find(':checkbox').attr('checked', false); }});}; } else { function DeleteAll(obj){$(obj).click(function() { var self = $(this); if (self.attr('checked')) { self.closest('table').closest('tr').find(':checkbox').attr('checked', true); } else { self.closest('table').closest('tr').find(':checkbox').attr('checked', false); }});}; }");
            gridString.Append("if ($.browser.mozilla) { function CheckAll(obj){$(obj).change(function() { var self = $(this); if (self.attr('checked')) { self.closest('table').closest('tr').find(':checkbox').attr('checked', true); } else { self.closest('table').closest('tr').find(':checkbox').attr('checked', false); }});}; } else { function CheckAll(obj){$(obj).click(function() { var self = $(this); if (self.attr('checked')) { self.closest('table').closest('tr').find(':checkbox').attr('checked', true); } else { self.closest('table').closest('tr').find(':checkbox').attr('checked', false); }});}; }");

            gridString.Append("</script>");
            gridString.Append("</td></tr></table>");
        }

        /// <summary>
        /// Default distructor of the Grid Claas
        /// </summary>
        ~GridMain()
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

    public class GridMainExtraParam
    {
        public string Field { get; set; }
        public string Value { get; set; }

        public GridMainExtraParam()
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

    public class GridMainColumn
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

        public GridMainColumn() { }

        public string ToString(bool isSchema, bool IsSortable, bool IsFilterable, bool IsCelleditable, bool IsDefaulteditable)
        {
            bool commarequired = false;
            StringBuilder stb = new StringBuilder();


            if (isSchema)
            {
                if (!((String.IsNullOrWhiteSpace(Field)) && (String.IsNullOrWhiteSpace(DataType))))
                {

                    string strf = string.Format("{0} :#type :\"{1}\" @", Field, DataType.ToLower());
                    stb.Append(strf.Replace("#", "{").Replace("@", "}"));
                }
            }
            else
            {
                stb.Append("{" + Environment.NewLine);
                if (!String.IsNullOrWhiteSpace(Field))
                {
                    stb.Append(string.Format("field :\"{0}\"", Field));
                    commarequired = true;
                }
                if (!String.IsNullOrWhiteSpace(Title))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("title :\"{0}\"", Title));
                    commarequired = true;
                }

                if (!String.IsNullOrWhiteSpace(Template))
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    if (DataType.ToLower() == GridDataType.Date.ToString().ToLower())
                    {
                        stb.Append(string.Format("template :'#= kendo.toString({0},\"{1}\") #'", Field, HttpContext.Current.Session["DateFormat"].ToString()));
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
                    stb.Append(string.Format("template :'#= kendo.toString({0},\"{1}\") #'", Field, HttpContext.Current.Session["DateFormat"].ToString()));
                    commarequired = true;
                }

                if (Width > 0)
                {
                    if (commarequired) stb.Append(", " + Environment.NewLine);
                    stb.Append(string.Format("width:{0}px", Width.ToString()));
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
                stb.Append(Environment.NewLine + "}");
            }

            return stb.ToString();
        }
    }

    public class GridMainAction
    {
        //public string ModuleName { get; set; }
        //public string AppsName { get; set; }
        //public string ActionName { get; set; }
        //public string CssClassName { get; set; }
        //public string ToolTips { get; set; }

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

        public GridMainAction()
        {
            this.IsLink = false;
            this.ClientAction = "";
            this.IsNavigateUrl = true;
            this.IsNewWindow = false;
           
        }

        public string ToString(string pageName, string recordID, Int64 UserID = 0, bool IsToolBarRatioButton=false,bool IsHeaderToolBar = false)
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
                        strAction = "<a " + (IsHeaderToolBar ? "class='tool-item gradient' " : "") + "href=\"" + urlToolBarRatio + "\"><i class=\"icon-" + this.CssClassName + "\"><span class=\"actionSpan\">" + this.ActionName.ToUpper() + "</span></i></a>";
                    else if (!string.IsNullOrWhiteSpace(this.ClientAction) && string.IsNullOrWhiteSpace(this.NewUrl))
                        strAction = "<a " + (IsHeaderToolBar ? "class='tool-item gradient' " : "") + "href=\"javascript:void(0);\" onclick=\"return " + this.ClientAction + "(this);\"><i class=\"icon-" + this.CssClassName + "\"><span class=\"actionSpan\">" + this.ActionName.ToUpper() + "</span></i></a>";
                    else
                        strAction = "<a " + (IsHeaderToolBar ? "class='tool-item gradient' " : "") + "href=\"" + this.NewUrl + "?RecID=\" " + (this.IsNewWindow ? "target=_blank" : "") + (string.IsNullOrWhiteSpace(this.ClientAction) ? "" : " onclick=\"return " + this.ClientAction + "(this);\"") + "><i class=\"icon-" + this.CssClassName + "\"><span class=\"actionSpan\">" + this.ActionName.ToUpper() + "</span></i></a>";
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
                    strAction = "<a class=\"actionButton " + CssClassName + "\" href=\"javascript:void(0);\" onclick=\" return " + this.ClientAction + "\">" + ButtonCaption + "</a>";
                }

            }
            else
            {
                strAction = "<input name=\"Select\" type=\"radio\" id=\"Select_#=" + recordID + "#\" value=#=" + recordID + "# onclick=\" return " + this.ClientAction + "(this);\">";
            }
            return strAction;
        }
    }

    public enum GridMainDataType
    {
        Number,
        String,
        Boolean,
        Float,
        Decimal,
        Date
    }
}
