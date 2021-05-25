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

namespace CargoFlash.Cargo.WebUI.Permissions
{
    public class UserGroupManagementWebUI : BaseWebUISecureObject
    {
        public UserGroupManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPageName = "Users.aspx";
            this.MyModuleID = "Users";
            this.MyAppID = "UserGroup";
        }

        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            object user = null;
            if (!DisplayMode.ToLower().Contains("new"))
            {
                Users gpList = new Users();
                object obj = (object)gpList;
                user = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj);
                this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString();
            }
            using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter())
            {
                htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                htmlFormAdapter.HeadingColumnName = "Name";
                switch (DisplayMode)
                {
                    case DisplayModeReadView:
                        htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                        htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        htmlFormAdapter.objFormData = user;
                        container.Append(htmlFormAdapter.InstantiateIn());
                        break;
                    case DisplayModeEdit:
                        htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                        htmlFormAdapter.objFormData = user;
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        break;
                    case DisplayModeNew:
                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        break;
                    case DisplayModeDelete:
                        htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        htmlFormAdapter.objFormData = user;
                        container.Append(htmlFormAdapter.InstantiateIn());
                        break;
                    default:
                        break;
                }
            }
        }

        public override void CreateWebForm(StringBuilder container)
        {
            if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
            {
                //Set the display Mode form the URL QuesyString.
                this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

                //Match the display Mode of the form.
                switch (this.DisplayMode)
                {
                    case DisplayModeIndexView:

                        if (System.Web.HttpContext.Current.Request.QueryString["PageSNo"] != null)
                        {
                            CreateGridUserGroup(container);
                        }
                        else
                        {
                            CreateGrid(container);
                        }

                        break;
                    case DisplayModeReadView:
                        BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeEdit:
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

        public override void DoPostBack()
        {
        }

        private void CreateGrid(StringBuilder Container)
        {
            
            using (GridMain g = new GridMain())
            {
                if (System.Web.HttpContext.Current.Request.QueryString["UserSNo"] != null)
                {
                    g.UserSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["UserSNo"].ToString());

                    CustomizedGrid.UserSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["UserSNo"].ToString());
                }

                g.NewURL = "Users.aspx?Module=Users&Apps=Users&FormAction=INDEXVIEW";
                g.IsToolBar = true;
                g.IsBackRequired = true;
                g.IsUserSNo = true;
                g.IsModule = true;
                g.IsFormHeader = false;
                g.IsShowEdit = true;
                g.IsSaveChanges = true;
                g.IsAddNewRecord = false;
                g.Height = 440;
                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                g.PageName = this.MyPageName;
                g.IsUserModule = true;
                g.FormCaptionText = "User: " + CustomizedGrid.UserName;
                g.PrimaryID = "GroupSNo";
                g.ModuleName = "Users";
                g.AppsName = "UserGroup";
                g.Action = new List<GridMainAction>();
                g.Action.Add(new GridMainAction { IsLink = true, CssClassName = "actionEdit", ClientAction = "OpenSpecialPermissionDialog(#=UserSNo#);", ButtonCaption = "<img class=\"k - image\" alt=\"Special Permission\" title=\"Special Permission\" src=\"images/edit.png\" /> " });
                g.DataSoruceUrl = "Services/Permissions/UserGroupService.svc/GetGridData";
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User ID", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "GroupName", Title = "Group Name", DataType = GridDataType.String.ToString() });

                g.InstantiateIn(Container);

                CreateUserPage(Container);
                Container.Append(@"<div id='divSpecialPermission'></div>");
            }
        }

        private void CreateGridUserGroup(StringBuilder Container)
        {
            using (GridMain g = new GridMain())
            {
                if (System.Web.HttpContext.Current.Request.QueryString["PageSNo"] != null)
                {
                    CustomizedGrid.PageSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["PageSNo"].ToString());
                }

                if (CustomizedGrid.UserGroupPage != "")
                {
                    g.FormCaptionText = CustomizedGrid.UserGroupPage;
                }
                else
                {
                    g.FormCaptionText = "User Group";
                }

                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                g.IsToolBar = true;
                g.IsUserSNo = true;
                g.IsModule = true;
                g.IsFormHeader = false;
                g.IsShowEdit = false;
                g.IsSaveChanges = true;
                g.IsAddNewRecord = false;
                g.IsPageSNo = true;
                g.Height = 397;
                g.PageName = this.MyPageName;
                g.IsUserModule = true;
                g.PrimaryID = "GroupSNo";
                g.ModuleName = "Users";
                g.AppsName = "UserGroup";
                g.DataSoruceUrl = "Services/Permissions/UserGroupService.svc/GetGridUserGroupData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "GroupName", Title = "User/Group", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "IsGroup", Title = "Image", DataType = GridDataType.Boolean.ToString(), Template = "# if(IsGroup) { # <img src=\"images/usergroup.png\" /> # } else { # <img src=\"images/user.png\"/> # } #   <input type=\"hidden\" value=\"#= IsGroup #\" id=\"hdnIsGroup\" name=\"hdnIsGroup\">  <input type=\"hidden\" value=\"#= GroupSNo #\" id=\"GroupSNo\" name=\"GroupSNo\">" });

                g.InstantiateIn(Container);

                CreateUserPage(Container);
            }
        }

        public void CreateGridGroupData(int PageSNo, StringBuilder Container)
        {
            CustomizedGrid.PageSNo = PageSNo;

            using (GridMain g = new GridMain())
            {
                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                g.ErrorGrid = "resetGrid";
                g.SuccessGrid = "SuccessGrid";
                g.ApplicationType = "GROUP";
                g.IsToolBar = false;
                g.IsModule = true;
                g.IsFormHeader = false;
                g.IsShowEdit = false;
                g.IsSaveChanges = true;
                g.IsAddNewRecord = false;
                g.IsPageSNo = true;
                g.Height = 316;
                g.PageName = this.MyPageName;
                g.IsUserModule = true;
                g.FormCaptionText = "User Group";
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "UserGroup";
                g.DataSoruceUrl = "Services/Permissions/GroupsService.svc/GetGridPageData2";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "GroupName", Title = "Group Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "SNo", Title = "Image", DataType = GridDataType.String.ToString(), Template = "<img src=\"images/usergroup.png\" /><input type=\"hidden\" name=\"hdncheckGroupSNo\" id=\"hdncheckGroupSNo\" value=\"#= SNo #\"/>" });

                g.InstantiateIn(Container);
            }
        }

        private void SaveUserGroup()
        {
            List<UserGroup> listGroup = new List<UserGroup>();
            var userGroup = new UserGroup { UserSNo = Convert.ToInt32(CurrentPageContext.Request.Form["UserSNo"]), GroupSNo = Convert.ToInt32(CurrentPageContext.Request.Form["GroupSNo"]), CreatedBy = 2, CreatedOn = DateTime.Today, UpdatedBy = 2, UpdatedOn = DateTime.Today };
            listGroup.Add(userGroup);
            object datalist = (object)listGroup;
            DataOperationService(DisplayModeSave, datalist);
        }

        private void UpdateUserGroup(int RecordID)
        {
            List<UserGroup> listGroup = new List<UserGroup>();
            var userGroup = new UserGroup { SNo = Convert.ToInt32(RecordID), UserSNo = Convert.ToInt32(CurrentPageContext.Request.Form["UserSNo"]), GroupSNo = Convert.ToInt32(CurrentPageContext.Request.Form["GroupSNo"]), CreatedBy = 2, CreatedOn = DateTime.Today, UpdatedBy = 2, UpdatedOn = DateTime.Today };
            listGroup.Add(userGroup);
            object datalist = (object)listGroup;
            DataOperationService(DisplayModeUpdate, datalist);
        }

        private void DeleteUserGroup(int RecordID)
        {
            object recordID = (object)RecordID;
            DataOperationService(DisplayModeDelete, recordID);
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
