using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Data;
using System.Net;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Permissions;
using System.Collections;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.WebUI.Permissions
{
    public class GroupsManagementWebUI : BaseWebUISecureObject
    {
        public GroupsManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Permissions";
                this.MyAppID = "Groups";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public GroupsManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPageName = "Default.cshtml";
            this.MyModuleID = "Users";
            this.MyAppID = "Groups";
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            //object user = null;
            //if (!DisplayMode.ToLower().Contains("new"))
            //{
            //    Groups gpList = new Groups();
            //    object obj = (object)gpList;
            //    user = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj);
            //    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
            //}
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "RefNo";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            //this.MyPageName = "Default.aspx";
                            //this.MyModuleID = "Security";
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetGroupsRecord();
                            this.MyModuleID = "Security";

                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);


                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                            container.Append(htmlFormAdapter.InstantiateIn());
                            CreateSecurityPage(container);
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetGroupsRecord();
                            //this.MyPageName = "Default.aspx";
                            this.MyModuleID = "Security";
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            CreateSecurityPage(container);
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetGroupsRecord();
                            //this.MyPageName = "Default.aspx";
                            this.MyModuleID = "Security";
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input type='hidden' id='hdnSSNo' name='hdnSSNo' value=" + this.MyRecordID + " />");
                            CreateSecurityPage(container);
                            break;
                        case DisplayModeNew:
                            //MyPageName = "Default.aspx";
                            MyModuleID = "Security";
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            CreateSecurityPage(container);
                            break;
                        case DisplayModeDelete:
                            //this.MyPageName = "Default.aspx";
                            //this.MyModuleID = "Security";
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetGroupsRecord();
                            this.MyModuleID = "Security";
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                            container.Append(htmlFormAdapter.InstantiateIn());
                            CreateSecurityPage(container);
                            break;
                        default:
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return container;
        }

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:

                            if (System.Web.HttpContext.Current.Request.QueryString["Module"] != null)
                            {
                                if (System.Web.HttpContext.Current.Request.QueryString["Module"].ToUpper() == "SECURITY")
                                {
                                    CreateGridGroupList(container);
                                }
                                else
                                {
                                    CreateGrid(container);
                                }
                            }

                            break;
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        default:
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return container;
        }

        public override void DoPostBack()
        {
            MyPageName = "Default.cshtml";
            MyModuleID = "Security";
            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveGroups();
                    if (string.IsNullOrEmpty(ErrorMessage))
                    {
                        //===============================================Date: 16-03-2017 commented by Arman Ali========================================//
                        //this.MyRecordID = GroupBusiness.GroupSNo.ToString();
                        //if (ErrorMessage != "" && ErrorMessage != null)
                        //{
                        //    System.Web.HttpContext.Current.Server.Transfer(MyPageName + "?" + GetWebURLString("INDEXVIEW", false));
                        //}
                        //else
                        //{
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("Read", true, 2000), false);
                        //}
                        //========================End============================================================================================//
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);// added by arman ali
                    }

                    break;
                case DisplayModeUpdate:
                    UpdateGroups(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveGroups();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeDelete:
                    DeleteGroups(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["RecID"] != null)
                {
                    CustomizedGrid.GroupSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString());
                }

                using (GridMain g = new GridMain())
                {
                    g.IsAllowedFiltering = true;
                    g.IsAllowedSorting = true;
                    g.IsToolBar = false;
                    g.IsModule = true;
                    g.IsFormHeader = false;
                    g.IsAutoSize = false;
                    g.IsSaveChanges = false;
                    g.PageName = this.MyPageName;
                    g.FormCaptionText = "Group List";
                    g.PrimaryID = "SNo";
                    g.ModuleName = "Users";
                    g.AppsName = "Groups";
                    g.DataSoruceUrl = "Services/Permissions/GroupsService.svc/GetActiveGroupGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridMainColumn>();
                    g.Column.Add(new GridMainColumn { Field = "GroupName", Title = "Group Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridMainColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });




                    g.InstantiateIn(Container);

                    CreateUserPage(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return Container;
        }

        private void CreateGridGroupList(StringBuilder Container)
        {
            using (Grid g = new Grid())
            {
                this.MyPageName = "Default.cshtml";
                g.PageName = "Default.cshtml";
                g.ModuleName = "Security";
                g.IsFormHeader = true;
                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                //g.SuccessGrid = "ShowAction";
                g.FormCaptionText = "Group";
                //------------------Start Work By Akash For Give Right  To SuperAdmin  as per Aman Khan Sir---==========   6 July 2017 12:27 PM
                if (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToString() == "SUPER ADMIN")
                {
                    g.CommandButtonNewText = "New Group";
                }
                //----------------------End Work Of Akash

                g.PrimaryID = "SNo";
                g.AppsName = "Groups";
                g.ReportID = "Groups";
                g.DataSoruceUrl = "Services/Permissions/GroupsService.svc/GetGridData";
                g.NewURL = "Default.cshtml?Module=Security&Apps=Groups&FormAction=New";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference No", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "GroupName", Title = "Group Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AllowMultiCity", Title = "Multi City Access", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });


               //------------------Start Work By Akash For Give Right  To SuperAdmin  as per Aman Khan Sir---==========   6 July 2017 12:27 PM
                g.Action = new List<GridAction>();
                if (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToString() != "SUPER ADMIN")
                {
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Read",
                        ActionName = "Read",
                        AppsName = "Groups",
                        CssClassName = "Read",
                        ModuleName = "Security"
                    });
                }
                //----------------------End Work Of Akash
                g.InstantiateIn(Container);











                //this.MyPageName = "Default.cshtml";
                //g.PageName = "Default.cshtml";
                //g.ModuleName = "Security";
                //g.IsFormHeader = true;
                ////g.IsAutoSize = false;
                //g.IsAllowedFiltering = true;
                //g.IsAllowedSorting = true;
                //g.FormCaptionText = "Group";
                //g.CommandButtonNewText = "New Group";
                //g.PrimaryID = "SNo";
                //g.AppsName = "Groups";
                //g.DataSoruceUrl = "Services/Permissions/GroupsService.svc/GetGridData";
                //g.NewURL = "Default.cshtml?Module=Security&Apps=Groups&FormAction=New";
                //g.Column = new List<GridColumn>();
                //g.Column.Add(new GridColumn { Field = "GroupName", Title = "Group Name", DataType = GridDataType.String.ToString() });
                //g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

                //g.InstantiateIn(Container);
            }
        }

        public void CreateGridUserGroupList(int UserSNo, StringBuilder Container)
        {
            CustomizedGrid.UserSNo = UserSNo;

            using (GridMain g = new GridMain())
            {
                g.ErrorGrid = "resetGrid";
                g.SuccessGrid = "SuccessGrid";
                this.MyPageName = "Default.cshtml";
                g.PageName = "Default.cshtml";
                g.ModuleName = "Security";
                g.ApplicationType = "USERGROUPS";
                g.IsToolBar = false;
                g.IsModule = true;
                g.IsUserModule = true;
                g.IsShowEdit = false;
                g.IsFormHeader = false;
                g.IsPageSNo = true;
                g.IsAutoSize = false;
                g.FormCaptionText = "Group";
                //------------------Start Work By Akash For Give Right  To SuperAdmin  as per Aman Khan Sir---==========   6 July 2017 12:27 PM
                if (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToString() == "SUPER ADMIN")
                {
                    g.CommandButtonNewText = "New Group";
                }
                //----------------------End Work Of Akash

                g.PrimaryID = "SNo";
                g.AppsName = "Groups";
                g.DataSoruceUrl = "Services/Permissions/GroupsService.svc/GetGridUserGroupsData";
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "GroupName", Title = "Group Name", DataType = GridDataType.String.ToString(), Template = "<span>#= GroupName #</span><input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= SNo #\"/>" });




                g.InstantiateIn(Container);
            }
        }

        public void CreateGridUserGroupList2(int UserSNo, StringBuilder Container)
        {
            CustomizedGrid.UserSNo = UserSNo;

            using (GridMain g = new GridMain())
            {
                this.MyPageName = "Default.cshtml";
                g.PageName = "Default.cshtml";
                g.ModuleName = "Security";
                g.ApplicationType = "USERGROUP";
                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                g.IsAutoSize = false;
                g.IsToolBar = false;
                g.IsModule = true;
                g.IsUserModule = true;
                g.IsShowEdit = false;
                g.IsFormHeader = false;
                g.IsPageSNo = true;
                g.IsAutoSize = false;
                g.FormCaptionText = "Group";

                //------------------Start Work By Akash For Give Right  To SuperAdmin  as per Aman Khan Sir---==========   6 July 2017 12:27 PM
                if (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToString() == "SUPER ADMIN")
                {
                    g.CommandButtonNewText = "New Group";
                }
                //----------------------End Work Of Akash
                g.PrimaryID = "SNo";
                g.AppsName = "Groups";
                g.DataSoruceUrl = "Services/Permissions/GroupsService.svc/GetGridUserGroupsData2";
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "GroupName", Title = "Group Name", DataType = GridDataType.String.ToString(), Template = "<span>#= GroupName #</span><input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= SNo #\"/>" });
                g.Column.Add(new GridMainColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

                g.InstantiateIn(Container);
            }
        }

        private void SaveGroups()
        {
            List<Groups> listGroup = new List<Groups>();
            int? x = null;
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            var groups = new Groups
            {
                SNo = 0,
                GroupName = FormElement["GroupName"].ToUpper(),
                IsActive = FormElement["IsActive"] == "0",
                IsMultiCity = FormElement["IsMultiCity"] == "0",
                CloneGroupSNo = FormElement["CloneGroupSNo"] == "" ? x : Convert.ToInt32(FormElement["CloneGroupSNo"]),
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                 UserTypeSNo = Convert.ToString(FormElement["UserTypeSNo"]),
                 PenaltyType = Convert.ToString(FormElement["PenaltyType"]),
            };
            listGroup.Add(groups);
            object datalist = (object)listGroup;
            DataOperationService(DisplayModeSave, datalist, "Permissions");
        }

        private void UpdateGroups(int RecordID)
        {
            List<Groups> listGroup = new List<Groups>();
            int? x = null;
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            var groups = new Groups
            {
                SNo = Convert.ToInt32(RecordID),
                GroupName = FormElement["GroupName"].ToUpper(),
                IsActive = FormElement["IsActive"] == "0",
                IsMultiCity = FormElement["IsMultiCity"] == "0",
                CloneGroupSNo = FormElement["CloneGroupSNo"] == "" ? x : Convert.ToInt32(FormElement["CloneGroupSNo"]),
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                UserTypeSNo= Convert.ToString(FormElement["UserTypeSNo"]),
                PenaltyType = Convert.ToString(FormElement["PenaltyType"]),
            };
            listGroup.Add(groups);
            object datalist = (object)listGroup;
            DataOperationService(DisplayModeUpdate, datalist, "Permissions");
        }

        private void DeleteGroups(int RecordID)
        {
            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, listID, "Permissions");
        }

        public object GetGroupsRecord()
        {
            object Groups = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Groups GroupsList = new Groups();
                    object obj = (object)GroupsList;
                    Groups = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Messgae: Record not found.
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return Groups;
        }

        //private object GetGroupsRecord()
        //{
        //    //MyModuleID = "";
        //    object groups = null;
        //    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
        //    {
        //        Groups groupsList = new Groups();
        //        object obj = (object)groupsList;

        //        //groups = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
        //        groups = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, "Permissions");
        //        this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
        //    }
        //    else
        //    {
        //        //Error Messgae: Record not found.
        //    }
        //    return groups;
        //}

        public void CreateSecurityPage(StringBuilder container)
        {
            container.Append(@"
                            <div class='black_overlay' id='divPopUpBackground'></div>
   <div id='dvGroup' style='display:none;'>
       <table class='WebFormTable' id='tblGroupUserMain' style='visibility:hidden;width:100%; border-bottom:1px solid #CCCCCC !important; border-top:0px !important;'>
            <tr>
                <td class='formbuttonrow' style='border-top:0px !important;border-top:0px !important;border-top:1px !important;border-top:0px !important;'><input type='button' value='Assign User' class='button' onclick='return showGroupUserPopup();'/><input type='button' onclick='return DeleteGroupUser();' value='Remove User' class='button'/></td>
            </tr>
            <tr>
                <td style='vertical-align:top !important;'><div id='dvGroupUsers'></div></td>
            </tr>
        </table>
        
        <div id='light3' style='display:none;'> 
            <table class='WebFormTable'>
                <tr>
                    <td class='formActiontitle Background' id='tdGroup'></td>
                </tr>
                <tr>
                    <td class='formbuttonrow' id='tdSubmitUser2'><button type='submit' value='SubmitUser' class='button' onclick='return AddGroupUser();' style='padding-bottom:2px !important;'>Save</button></td>
                </tr>
                <tr>
                    <td style='border-bottom:1px solid #CCCCCC !important;'><div id='tblUsers'></div><input type='hidden' id='hdnGroupSNo' name='hdnGroupSNo'/><input type='hidden' id='hdnGroupName' name='hdnGroupName'/></td>
                </tr>
                 <tr>
                    <td id='tdNotFound2' style='border-bottom:1px solid #CCCCCC !important; display:none;'></td>
                </tr>
            </table>
            <br />
        </div>
    </div>
   <div id='dvUser' style='display:none;'>
        <table class='WebFormTable' id='tblUserGroupMain' style='visibility:hidden;width:100%; border-bottom:1px solid #CCCCCC !important; border-top:0px !important;'>
            <tr>
                <td class='formbuttonrow' style='border-top:0px !important;border-top:0px !important;border-top:1px !important;border-top:0px !important;'><input type='button' value='Assign Group' class='button' onclick='return showUserGroupPopup();'/><input type='button' onclick='return DeleteUserGroup2();' value='Remove Group' class='button'/></td>
            </tr>
            <tr>
                <td style='vertical-align:top !important;'><div id='dvUsersGroup'></div></td>
            </tr>
        </table>

        <div id='light4' style='display:none;'> 
            <table class='WebFormTable'>
                <tr>
                    <td class='formActiontitle Background' id='tdUser'></td>
                </tr>
                <tr>
                    <td class='formbuttonrow' id='tdSubmitGroup2'><button type='submit' value='SubmitGroup' class='button' onclick='return AddUserGroup();' style='padding-bottom:2px !important;'>Save</button></td>
                </tr>
                <tr>
                    <td style='border-bottom:1px solid #CCCCCC !important;'><div id='tblGroups'></div><input type='hidden' id='hdnUserSNo' name='hdnUserSNo'/><input type='hidden' id='hdnUserName' name='hdnUserName'/></td>
                </tr>
                <tr>
                    <td id='tdNotFoundGroup2' style='border-bottom:1px solid #CCCCCC !important; display:none;'></td>
                </tr>
            </table>
            <br />
        </div>
    </div>");
        }

        private void CreateUserPage(StringBuilder container)
        {
            container.Append(@"
        <div id='dvSubmit' style='display:none; background:#DAECF4;'>
        <input type='hidden' name='hdngroupSNo' id='hdngroupSNo'/>
        <input type='hidden' name='hdnUserSNo' id='hdnUserSNo'/>
    </div>   

    <div id='dvDelete' style='display:none; background:#DAECF4;'>
        <input type='hidden' name='hdnPageSNo' id='hdnPageSNo'/>
    </div>

    <div class='black_overlay' id='divPopUpBackground'></div>
    <input type='hidden' name='hdnUserAdd' id='hdnUserAdd'/>
    <div id='light1' style='display:none;'> 
        <table class='WebFormTable'>
            <tr>
                <td class='formActiontitle Background' id='tdUser'></td>
            </tr>
            <tr>
                <td class='formbuttonrow' id='tdSubmitUser'><button type='submit' value='SubmitUser' class='button' onclick='return AddUsers();' style='padding-bottom:2px !important;'>Save</button></td>
            </tr>
            <tr>
                <td style='border-bottom:1px solid #CCCCCC !important;'><div id='tblUser'></div></td>
            </tr>
            <tr>
                <td id='tdNotFound'></td>
            </tr>
        </table>
        <br />
    </div>
    <div id='light2' style='display:none;'>
        <table class='WebFormTable'>
            <tr>
                <td class='formActiontitle Background' id='tdGroup'></td>
            </tr>
            <tr>
                <td class='formbuttonrow' id='tdSubmitGroup'><button type='submit' value='SubmitGroup' class='button' onclick='return AddGroups();' style='padding-bottom:2px !important;'>Save</button></td>
            </tr>
            <tr>
               <td style='border-bottom:1px solid #CCCCCC !important;'><div id='tblGroup'></div></td>
            </tr>
            <tr>
                <td id='tdNotFoundGroup' style='border-bottom:1px solid #CCCCCC !important; display:none;'></td>
            </tr>
        </table>
        <br />
    </div>");
        }
    }
}
