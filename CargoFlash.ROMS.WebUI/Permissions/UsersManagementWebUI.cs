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
    public class UsersManagementWebUI : BaseWebUISecureObject
    {
        //        public UsersManagementWebUI(Page PageContext)
        //        {
        //            if (this.SetCurrentPageContext(PageContext))
        //            {
        //                this.ErrorNumber = 0;
        //                this.ErrorMessage = "";
        //            }
        //            this.MyPageName = "Default.aspx";
        //            this.MyModuleID = "Permissions";
        //            this.MyAppID = "Users";
        //        }
        //        public UsersManagementWebUI()
        //        {
        //            try
        //            {
        //                this.MyModuleID = "Permissions";
        //                this.MyAppID = "Users";
        //                this.MyPrimaryID = "SNo";
        //            }
        //            catch (Exception ex)
        //            {
        //                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //                ErrorMessage = applicationWebUI.ErrorMessage;
        //            }
        //        }

        //        public override void BuildFormView(string DisplayMode, StringBuilder container)
        //        {
        //            //object user = null;
        //            //if (!DisplayMode.ToLower().Contains("new"))
        //            //{
        //            //    Users gpList = new Users();
        //            //    object obj = (object)gpList;
        //            //    user = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj);
        //            //    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
        //            //}

        //            using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter("Permissions"))
        //            {
        //                htmlFormAdapter.CurrentPage = this.CurrentPageContext;
        //                htmlFormAdapter.HeadingColumnName = "UserName";
        //                switch (DisplayMode)
        //                {
        //                    case DisplayModeReadView:
        //                        this.MyPageName = "Default.aspx";
        //                        this.MyModuleID = "Permissions";
        //                        htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
        //                        htmlFormAdapter.objFormData = GetUsersRecord();
        //                        htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
        //                        htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
        //                        htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
        //                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                        container.Append(htmlFormAdapter.InstantiateIn());
        //                        CreateSecurityPage(container);
        //                        break;
        //                    case DisplayModeDuplicate:
        //                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
        //                        htmlFormAdapter.objFormData = GetUsersRecord();
        //                        this.MyPageName = "Default.aspx";
        //                        this.MyModuleID = "Permissions";
        //                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                        container.Append(htmlFormAdapter.InstantiateIn());
        //                        CreateSecurityPage(container);
        //                        break;
        //                    case DisplayModeEdit:
        //                        htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
        //                        htmlFormAdapter.objFormData = GetUsersRecord();
        //                        this.MyPageName = "Default.aspx";
        //                        this.MyModuleID = "Permissions";
        //                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                        container.Append(htmlFormAdapter.InstantiateIn());
        //                        CreateSecurityPage(container);
        //                        break;
        //                    case DisplayModeNew:
        //                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
        //                        this.MyPageName = "Default.aspx";
        //                        this.MyModuleID = "Permissions";
        //                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                        container.Append(htmlFormAdapter.InstantiateIn());
        //                        CreateSecurityPage(container);
        //                        break;
        //                    case DisplayModeDelete:
        //                        this.MyPageName = "Default.aspx";
        //                        this.MyModuleID = "Permissions";
        //                        htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
        //                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                        htmlFormAdapter.objFormData = GetUsersRecord();
        //                        container.Append(htmlFormAdapter.InstantiateIn());
        //                        CreateSecurityPage(container);
        //                        break;
        //                    default:
        //                        break;
        //                }
        //            }
        //        }

        //     /*   public override void CreateWebForm(StringBuilder container)
        //        {
        //            if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
        //            {
        //                //Set the display Mode form the URL QuesyString.
        //                this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

        //                //Match the display Mode of the form.
        //                switch (this.DisplayMode)
        //                {
        //                    case DisplayModeIndexView:

        //                        if (System.Web.HttpContext.Current.Request.QueryString["Module"] != null)
        //                        {
        //                            if (System.Web.HttpContext.Current.Request.QueryString["Module"].ToUpper() == "PERMISSIONS")
        //                            {
        //                                CreateGrid(container);
        //                            }
        //                            else
        //                            {
        //                                CreateGridUsersList(container);
        //                            }
        //                        }

        //                        break;
        //                    case DisplayModeReadView:
        //                        BuildFormView(this.DisplayMode, container);
        //                        break;
        //                    case DisplayModeEdit:
        //                        BuildFormView(this.DisplayMode, container);
        //                        break;
        //                    case DisplayModeDuplicate:
        //                        BuildFormView(this.DisplayMode, container);
        //                        break;
        //                    case DisplayModeNew:
        //                        BuildFormView(this.DisplayMode, container);
        //                        break;
        //                    case DisplayModeDelete:
        //                        BuildFormView(this.DisplayMode, container);
        //                        break;
        //                    default:
        //                        break;
        //                }
        //            }
        //        }*/

        //         public StringBuilder CreateWebForm(StringBuilder container)
        //        {
        //            try
        //            {
        //                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
        //                {
        //                    //Set the display Mode form the URL QuesyString.
        //                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
        //                    //Match the display Mode of the form.
        //                    switch (this.DisplayMode)
        //                    {
        //                        case DisplayModeIndexView:
        //                            CreateGrid(container);
        //                            break;
        //                        case DisplayModeReadView:
        //                            BuildFormView(this.DisplayMode, container);
        //                            break;
        //                        case DisplayModeDuplicate:
        //                            BuildFormView(this.DisplayMode, container);
        //                            break;
        //                        case DisplayModeEdit:
        //                            BuildFormView(this.DisplayMode, container);
        //                            break;
        //                        case DisplayModeNew:
        //                            BuildFormView(this.DisplayMode, container);
        //                            break;
        //                        case DisplayModeDelete:
        //                            BuildFormView(this.DisplayMode, container);
        //                            break;
        //                        default:
        //                            break;
        //                    }
        //                }
        //            }
        //            catch (Exception ex)
        //            {
        //                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //            }
        //            return container;
        //        }

        //        public override void DoPostBack()
        //        {
        //            MyPageName = "Default.aspx";
        //            MyModuleID = "Security";
        //            this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
        //            switch (OperationMode)
        //            {
        //                case DisplayModeSave:
        //                    SaveUsers();
        //                    if (string.IsNullOrEmpty(ErrorMessage))
        //                    {
        //                        this.MyRecordID = GroupBusiness.UserSNo.ToString();
        //                       // CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("Read", true, 2000), false);
        //                        CurrentPageContext.Server.Transfer(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
        //                    }
        //                    //if (string.IsNullOrEmpty(ErrorMessage))
        //                    //   
        //                    break;
        //                case DisplayModeUpdate:
        //                    UpdateUsers(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
        //                    if (string.IsNullOrEmpty(ErrorMessage))
        //                        CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
        //                    //else
        //                    //{                        
        //                    //    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString();
        //                    //    CurrentPageContext.Server.Transfer(MyPageName + "?" + GetWebURLString("EDIT", true));
        //                    //}
        //                    break;
        //                case DisplayModeSaveAndNew:
        //                    SaveUsers();
        //                    if (string.IsNullOrEmpty(ErrorMessage))
        //                        CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
        //                    break;
        //                case DisplayModeDelete:
        //                    DeleteUsers(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
        //                    if (string.IsNullOrEmpty(ErrorMessage))
        //                        CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
        //                    break;
        //            }
        //        }

        //        private void CreateGrid(StringBuilder Container)
        //        {
        //            using (GridMain g = new GridMain())
        //            {
        //                if (System.Web.HttpContext.Current.Request.QueryString["RecID"] != null)
        //                {
        //                    g.UserSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString());
        //                }

        //                g.IsAllowedFiltering = true;
        //                g.IsAllowedSorting = true;
        //                g.IsModule = true;
        //                g.IsUserModule = true;
        //                g.IsShowEdit = true;
        //                g.IsFormHeader = false;
        //                g.Height = 440;
        //                g.FormCaptionText = "User List";
        //                g.PageName = this.MyPageName;
        //                g.PrimaryID = "SNo";
        //                g.ModuleName = "Users";
        //                g.AppsName = "Users";
        //                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetActiveUsersGridData";
        //                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //                g.Column = new List<GridMainColumn>();
        //                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "EMailID", Title = "Email Address", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "CityName", Title = "City", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

        //                g.InstantiateIn(Container);

        //                CreateUserPage(Container);
        //            }
        //        }

        //        private void CreateGrid2(StringBuilder Container)
        //        {
        //            using (GridMain g = new GridMain())
        //            {
        //                if (System.Web.HttpContext.Current.Request.QueryString["RecID"] != null)
        //                {
        //                    g.UserSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString());
        //                }

        //                if (System.Web.HttpContext.Current.Request.QueryString["PageSNo"] != null)
        //                {
        //                    CustomizedGrid.PageSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["PageSNo"].ToString());
        //                }

        //                g.IsModule = true;
        //                g.IsUserModule = true;
        //                g.IsShowEdit = true;
        //                g.IsFormHeader = false;
        //                g.Height = 400;
        //                g.FormCaptionText = "User";
        //                g.PageName = this.MyPageName;
        //                g.PrimaryID = "SNo";
        //                g.ModuleName = "Users";
        //                g.AppsName = "Users";
        //                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetListPageUsers";
        //                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //                g.Column = new List<GridMainColumn>();
        //                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString() });

        //                g.InstantiateIn(Container);
        //            }
        //        }

        //        public void CreateGridUserList(int PageSNo, StringBuilder Container)
        //        {
        //            using (GridMain g = new GridMain())
        //            {
        //                g.IsAllowedFiltering = true;
        //                g.IsAllowedSorting = true;
        //                g.ErrorGrid = "resetGrid";
        //                g.SuccessGrid = "SuccessGrid";
        //                g.ApplicationType = "USER";
        //                g.IsToolBar = false;
        //                g.IsModule = true;
        //                g.IsUserModule = true;
        //                g.IsShowEdit = false;
        //                g.IsFormHeader = false;
        //                g.IsPageSNo = true;
        //                g.Height = 316;
        //                g.FormCaptionText = "User";
        //                g.PageName = this.MyPageName;
        //                g.PrimaryID = "SNo";
        //                g.ModuleName = "Users";
        //                g.AppsName = "Users";
        //                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetGridUserData2";
        //                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //                g.Column = new List<GridMainColumn>();
        //                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "SNo", Title = "Image", DataType = GridDataType.String.ToString(), Template = "<img src=\"images/user.png\" /><input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= SNo #\"/>" });

        //                g.InstantiateIn(Container);
        //            }
        //        }

        //        private void CreateGridUsersList(StringBuilder Container)
        //        {
        //            using (GridMain g = new GridMain())
        //            {
        //                this.MyPageName = "Default.aspx";
        //                g.PageName = "Default.aspx";
        //                g.ModuleName = "Security";
        //                g.IsFormHeader = true;
        //                g.IsAllowedFiltering = true;
        //                g.IsAllowedSorting = true;
        //                g.Height = 400;
        //                g.FormCaptionText = "User";
        //                g.CommandButtonNewText = "New User";
        //                g.PrimaryID = "SNo";
        //                g.AppsName = "Users";
        //                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetGridData";
        //                g.NewURL = "Default.aspx?Module=Security&Apps=Users&FormAction=New";
        //                g.Column = new List<GridMainColumn>();
        //                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "UserType", Title = "User Type", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "EMailID", Title = "Email Address", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "CityCode", Title = "City", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

        //                g.InstantiateIn(Container);
        //            }
        //        }

        //        public void CreateGridUserGroupList(int GroupSNo, StringBuilder Container)
        //        {
        //            CustomizedGrid.GroupSNo = GroupSNo;

        //            using (GridMain g = new GridMain())
        //            {
        //                g.ErrorGrid = "resetGrid";
        //                g.SuccessGrid = "SuccessGrid";
        //                g.ApplicationType = "GROUPUSERS";
        //                g.IsToolBar = false;
        //                g.IsModule = true;
        //                g.IsUserModule = true;
        //                g.IsShowEdit = false;
        //                g.IsFormHeader = false;
        //                g.IsPageSNo = true;
        //                g.Height = 316;
        //                g.FormCaptionText = "User";
        //                g.PageName = this.MyPageName;
        //                g.PrimaryID = "SNo";
        //                g.ModuleName = "Users";
        //                g.AppsName = "Users";
        //                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetGridGroupUsers";
        //                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //                g.Column = new List<GridMainColumn>();
        //                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString(), Template = "<span>#= UserName #</span><input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= SNo #\"/>" });

        //                g.InstantiateIn(Container);
        //            }
        //        }

        //        public void CreateGridUserGroupList2(int GroupSNo, StringBuilder Container)
        //        {
        //            CustomizedGrid.GroupSNo = GroupSNo;

        //            using (GridMain g = new GridMain())
        //            {
        //                g.ApplicationType = "GROUPUSER";
        //                g.IsAllowedFiltering = true;
        //                g.IsAllowedSorting = true;
        //                g.IsAutoSize = false;
        //                g.IsToolBar = false;
        //                g.IsModule = true;
        //                g.IsUserModule = true;
        //                g.IsShowEdit = false;
        //                g.IsFormHeader = false;
        //                g.IsPageSNo = true;
        //                g.FormCaptionText = "User";
        //                g.PageName = this.MyPageName;
        //                g.PrimaryID = "SNo";
        //                g.ModuleName = "Users";
        //                g.AppsName = "Users";
        //                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetGridGroupUsers2";
        //                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //                g.Column = new List<GridMainColumn>();
        //                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString(), Template = "<span>#= UserName #</span><input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= SNo #\"/>" });
        //                g.Column.Add(new GridMainColumn { Field = "EMailID", Title = "Email Address", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "CityName", Title = "City", DataType = GridDataType.String.ToString() });
        //                g.Column.Add(new GridMainColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

        //                g.InstantiateIn(Container);
        //            }
        //        }

        //        private void SaveUsers()
        //        {
        //            List<Users> listGroup = new List<Users>();
        //            var users = new Users
        //            {
        //                SNo = 0,
        //                FirstName = CurrentPageContext.Request.Form["FirstName"].ToUpper(),
        //                LastName = CurrentPageContext.Request.Form["LastName"].ToUpper(),
        //                UserName = CurrentPageContext.Request.Form["UserName"].ToUpper(),
        //                EMailID = CurrentPageContext.Request.Form["EMailID"].ToUpper(),
        //                Password = CurrentPageContext.Request.Form["Password"],
        //                Mobile = CurrentPageContext.Request.Form["Mobile"],
        //                CreatedOn=DateTime.Now,
        //                UpdatedOn=DateTime.Now,
        //                CityCode = CurrentPageContext.Request.Form["CityCode"].ToUpper(),
        //                CustomerSNo = CurrentPageContext.Request.Form["CustomerSNo"] == "" ? 0 : Convert.ToInt32(CurrentPageContext.Request.Form["CustomerSNo"].ToString()),
        //                GroupSNo = CurrentPageContext.Request.Form["GroupSNo"] == "" ? 0 : Convert.ToInt32(CurrentPageContext.Request.Form["GroupSNo"]),
        //                Address = CurrentPageContext.Request.Form["Address"].ToUpper(),
        //                CreatedBy = this.MyUserID,
        //                UpdatedBy = this.MyUserID
        //            };
        //            listGroup.Add(users);
        //            object datalist = (object)listGroup;
        //            DataOperationService(DisplayModeSave, datalist, "Permissions");

        //        }

        //        private void UpdateUsers(int RecordID)
        //        {
        //            List<Users> listGroup = new List<Users>();
        //            var users = new Users
        //            {
        //                SNo = Convert.ToInt32(RecordID),
        //                FirstName = CurrentPageContext.Request.Form["FirstName"].ToUpper(),
        //                LastName = CurrentPageContext.Request.Form["LastName"].ToUpper(),
        //                UserName = CurrentPageContext.Request.Form["UserName"].ToUpper(),
        //                EMailID = CurrentPageContext.Request.Form["EMailID"].ToUpper(),
        //                Password = CurrentPageContext.Request.Form["Password"],
        //                Mobile = CurrentPageContext.Request.Form["Mobile"],
        //                CreatedOn = DateTime.Now,
        //                UpdatedOn = DateTime.Now,
        //                CityCode = CurrentPageContext.Request.Form["CityCode"].ToUpper(),
        //                CustomerSNo = CurrentPageContext.Request.Form["CustomerSNo"] == null || CurrentPageContext.Request.Form["CustomerSNo"] ==""? 0 : Convert.ToInt32(CurrentPageContext.Request.Form["CustomerSNo"].ToString()),
        //                GroupSNo = CurrentPageContext.Request.Form["GroupSNo"] == "" ? 0 : Convert.ToInt32(CurrentPageContext.Request.Form["GroupSNo"]),
        //                Address = CurrentPageContext.Request.Form["Address"].ToUpper(),
        //                CreatedBy = this.MyUserID,
        //                UpdatedBy = this.MyUserID
        //            };
        //            listGroup.Add(users);
        //            object datalist = (object)listGroup;
        //            DataOperationService(DisplayModeUpdate, datalist, "Permissions");
        //        }

        //        private void DeleteUsers(int RecordID)
        //        {
        //            List<string> listID = new List<string>();
        //            listID.Add(RecordID.ToString());
        //            listID.Add(MyUserID.ToString());
        //            object recordID = (object)listID;
        //            DataOperationService(DisplayModeDelete, listID, "Permissions");
        //        }

        //        private object GetUsersRecord()
        //        {
        //            object users = null;
        //            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
        //            {
        //                Users usersList = new Users();
        //                object obj = (object)usersList;

        //                users = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, "Permissions");
        //                this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
        //            }
        //            else
        //            {
        //                //Error Messgae: Record not found.
        //            }
        //            return users;
        //        }

        //        public void CreateSecurityPage(StringBuilder container)
        //        {
        //            container.Append(@"
        //                            <div class='black_overlay' id='divPopUpBackground'></div>
        //   <div id='dvGroup' style='display:none;'>
        //       <table class='WebFormTable' id='tblGroupUserMain' style='visibility:hidden;width:100%; border-bottom:1px solid #CCCCCC !important; border-top:0px !important;'>
        //            <tr>
        //                <td class='formbuttonrow' style='border-top:0px !important;border-top:0px !important;border-top:1px !important;border-top:0px !important;'><input type='button' value='Assign User' class='button' onclick='return showGroupUserPopup();'/><input type='button' onclick='return DeleteGroupUser();' value='Remove User' class='button'/></td>
        //            </tr>
        //            <tr>
        //                <td style='vertical-align:top !important;'><div id='dvGroupUsers'></div></td>
        //            </tr>
        //        </table>
        //        
        //        <div id='light3' style='display:none;'> 
        //            <table class='WebFormTable'>
        //                <tr>
        //                    <td class='formActiontitle Background' id='tdGroup'></td>
        //                </tr>
        //                <tr>
        //                    <td class='formbuttonrow' id='tdSubmitUser2'><button type='submit' value='SubmitUser' class='button' onclick='return AddGroupUser();' style='padding-bottom:2px !important;'>Save</button></td>
        //                </tr>
        //                <tr>
        //                    <td style='border-bottom:1px solid #CCCCCC !important;'><div id='tblUsers'></div><input type='hidden' id='hdnGroupSNo' name='hdnGroupSNo'/><input type='hidden' id='hdnGroupName' name='hdnGroupName'/></td>
        //                </tr>
        //                 <tr>
        //                    <td id='tdNotFound2' style='border-bottom:1px solid #CCCCCC !important; display:none;'></td>
        //                </tr>
        //            </table>
        //            <br />
        //        </div>
        //    </div>
        //   <div id='dvUser' style='display:none;'>
        //        <table class='WebFormTable' id='tblUserGroupMain' style='visibility:hidden;width:100%; border-bottom:1px solid #CCCCCC !important; border-top:0px !important;'>
        //            <tr>
        //                <td class='formbuttonrow' style='border-top:0px !important;border-top:0px !important;border-top:1px !important;border-top:0px !important;'><input type='button' value='Assign Group' class='button' onclick='return showUserGroupPopup();'/><input type='button' onclick='return DeleteUserGroup2();' value='Remove Group' class='button'/></td>
        //            </tr>
        //            <tr>
        //                <td style='vertical-align:top !important;'><div id='dvUsersGroup'></div></td>
        //            </tr>
        //        </table>
        //
        //        <div id='light4' style='display:none;'> 
        //            <table class='WebFormTable'>
        //                <tr>
        //                    <td class='formActiontitle Background' id='tdUser'></td>
        //                </tr>
        //                <tr>
        //                    <td class='formbuttonrow' id='tdSubmitGroup2'><button type='submit' value='SubmitGroup' class='button' onclick='return AddUserGroup();' style='padding-bottom:2px !important;'>Save</button></td>
        //                </tr>
        //                <tr>
        //                    <td style='border-bottom:1px solid #CCCCCC !important;'><div id='tblGroups'></div><input type='hidden' id='hdnUserSNo' name='hdnUserSNo'/><input type='hidden' id='hdnUserName' name='hdnUserName'/></td>
        //                </tr>
        //                <tr>
        //                    <td id='tdNotFoundGroup2' style='border-bottom:1px solid #CCCCCC !important; display:none;'></td>
        //                </tr>
        //            </table>
        //            <br />
        //        </div>
        //    </div>");
        //        }

        //        private void CreateUserPage(StringBuilder container)
        //        {
        //            container.Append(@"
        //        <div id='dvSubmit' style='display:none; background:#DAECF4;'>
        //        <input type='hidden' name='hdngroupSNo' id='hdngroupSNo'/>
        //        <input type='hidden' name='hdnUserSNo' id='hdnUserSNo'/>
        //    </div>   
        //
        //    <div id='dvDelete' style='display:none; background:#DAECF4;'>
        //        <input type='hidden' name='hdnPageSNo' id='hdnPageSNo'/>
        //    </div>
        //
        //    <div class='black_overlay' id='divPopUpBackground'></div>
        //    <input type='hidden' name='hdnUserAdd' id='hdnUserAdd'/>
        //    <div id='light1' style='display:none;'> 
        //        <table class='WebFormTable'>
        //            <tr>
        //                <td class='formActiontitle Background' id='tdUser'></td>
        //            </tr>
        //            <tr>
        //                <td class='formbuttonrow' id='tdSubmitUser'><button type='submit' value='SubmitUser' class='button' onclick='return AddUsers();' style='padding-bottom:2px !important;'>Save</button></td>
        //            </tr>
        //            <tr>
        //                <td style='border-bottom:1px solid #CCCCCC !important;'><div id='tblUser'></div></td>
        //            </tr>
        //            <tr>
        //                <td id='tdNotFound'></td>
        //            </tr>
        //        </table>
        //        <br />
        //    </div>
        //    <div id='light2' style='display:none;'>
        //        <table class='WebFormTable'>
        //            <tr>
        //                <td class='formActiontitle Background' id='tdGroup'></td>
        //            </tr>
        //            <tr>
        //                <td class='formbuttonrow' id='tdSubmitGroup'><button type='submit' value='SubmitGroup' class='button' onclick='return AddGroups();' style='padding-bottom:2px !important;'>Save</button></td>
        //            </tr>
        //            <tr>
        //               <td style='border-bottom:1px solid #CCCCCC !important;'><div id='tblGroup'></div></td>
        //            </tr>
        //            <tr>
        //                <td id='tdNotFoundGroup' style='border-bottom:1px solid #CCCCCC !important; display:none;'></td>
        //            </tr>
        //        </table>
        //        <br />
        //    </div>");
        //        }



        public UsersManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPageName = "Default.cshtml";
            this.MyModuleID = "Users";
            this.MyAppID = "Users";

            //this.MyUserID = int.Parse(System.Web.HttpContext.Current.Session["LoginSNo"].ToString().ToUpper());
        }

        public UsersManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Permissions";
                this.MyAppID = "Users";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter("Permissions"))
            {
                htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                htmlFormAdapter.HeadingColumnName = "UserName";
                switch (DisplayMode)
                {
                    case DisplayModeReadView:
                        //this.MyPageName = "Default.aspx";
                        //this.MyModuleID = "Security";
                        htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        htmlFormAdapter.objFormData = GetUsersRecord();
                        htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                        htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                        htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        //CreateSecurityPage(container);
                        break;
                    case DisplayModeDuplicate:
                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        htmlFormAdapter.objFormData = GetUsersRecord();
                        //this.MyPageName = "Default.aspx";
                        //this.MyModuleID = "Security";
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        //CreateSecurityPage(container);
                        break;
                    case DisplayModeEdit:
                        htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                        htmlFormAdapter.objFormData = GetUsersRecord();
                        //this.MyPageName = "Default.aspx";
                        //this.MyModuleID = "Security";
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        //CreateSecurityPage(container);
                        break;
                    case DisplayModeNew:
                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        //this.MyPageName = "Default.aspx";
                        //this.MyModuleID = "Security";
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        //CreateSecurityPage(container);
                        break;
                    case DisplayModeDelete:
                        //this.MyPageName = "Default.aspx";
                        //this.MyModuleID = "Security";
                        htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        htmlFormAdapter.objFormData = GetUsersRecord();
                        container.Append(htmlFormAdapter.InstantiateIn());
                        //CreateSecurityPage(container);
                        break;
                    default:
                        break;
                }
            }
            return container;
        }

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            //if (this.CurrentPageContext.Request.QueryString["FormAction"] != null)
            if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
            {
                //this.DisplayMode = "FORMACTION." + CurrentPageContext.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
                //this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
                switch (this.DisplayMode)
                {
                    case DisplayModeIndexView:
                    case "FORMACTION.UNBLOCK":
                        //if (CurrentPageContext.Request.QueryString["Module"] != null)
                        if (System.Web.HttpContext.Current.Request.QueryString["Module"] != null)
                        {
                            //if (CurrentPageContext.Request.QueryString["Module"].ToUpper() == "USERS")
                            if (System.Web.HttpContext.Current.Request.QueryString["Module"].ToUpper() == "USERS")
                                CreateGrid(container);
                            else if(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AllowedUserCreation.ToString()!="NO")
                                CreateGridUsersList(container);
                            //else
                              
                            //CreateGridUsersList("");
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
            return container;
        }

        public override void DoPostBack()
        {
            ////MyPageName = "Default.aspx";
            ////MyModuleID = "Security";
            ////  this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
            //string Operation = CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();

            //System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(System.Web.HttpContext.Current.Session["CurrentLanguage"].ToString());
            ////var rm = new System.Resources.ResourceManager("App_GlobalResources.Lang", System.Reflection.Assembly.GetExecutingAssembly());
            //var rm = new System.Resources.ResourceManager("CargoFlashDMSWebApps.App_GlobalResources.Lang", System.Reflection.Assembly.Load("CargoFlashDMSWebApps"));
            //var ci = System.Threading.Thread.CurrentThread.CurrentCulture;
            //// rm.GetString(this.HeadingText.ToString().Trim(), ci)
            //System.Resources.ResourceSet rs = rm.GetResourceSet(System.Threading.Thread.CurrentThread.CurrentCulture, true, true);
            //System.Collections.IDictionaryEnumerator ide = rs.GetEnumerator();
            //while (ide.MoveNext())
            //{
            //    if (ide.Value.ToString().ToUpper().Trim() == Operation.ToUpper())
            //    {
            //        Operation = ide.Key.ToString();
            //        break;
            //    }
            //}

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveUsers();
                    if (ErrorMessage.Contains("-"))
                    {
                        this.MyRecordID = ErrorMessage.Replace("-", "").ToString();
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    }
                    break;
                case DisplayModeUpdate:
                    UpdateUsers(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveUsers();
                    if (ErrorMessage.Contains("-"))
                        //  System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);// commented by arman 2017-08-06
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeDelete:
                    //DeleteUsers(Convert.ToInt32(CurrentPageContext.Request.QueryString["RecID"])); //Commented By Shatrughana
                    DeleteUsers(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"])); //Added By Shatrughana
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        private void CreateGrid(StringBuilder Container)
        {
            string CitySNo = "";

            using (GridMain g = new GridMain())
            {

                if (this.CurrentPageContext.Request.QueryString["RecID"] != null)
                    g.UserSNo = Convert.ToInt32(this.CurrentPageContext.Request.QueryString["RecID"].ToString());
                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                g.IsModule = true;
                g.IsUserModule = true;
                g.IsShowEdit = true;
                g.IsFormHeader = false;
                g.Height = 440;
                g.FormCaptionText = "User List";
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "Users";
                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetActiveUsersGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User ID", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "EMailID", Title = "Email Address", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "CityName", Title = "City", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                g.ExtraParam = new List<GridMainExtraParam>();
                g.ExtraParam.Add(new GridMainExtraParam { Field = "CitySNo", Value = CitySNo });

                g.InstantiateIn(Container);

                CreateUserPage(Container);
            }
        }

        private void CreateGrid2(StringBuilder Container)
        {
            using (GridMain g = new GridMain())
            {
                if (this.CurrentPageContext.Request.QueryString["RecID"] != null)
                    g.UserSNo = Convert.ToInt32(this.CurrentPageContext.Request.QueryString["RecID"].ToString());
                if (this.CurrentPageContext.Request.QueryString["PageSNo"] != null)
                    CustomizedGrid.PageSNo = Convert.ToInt32(this.CurrentPageContext.Request.QueryString["PageSNo"].ToString());
                g.IsModule = true;
                g.IsUserModule = true;
                g.IsShowEdit = true;
                g.IsFormHeader = false;
                g.Height = 400;
                g.FormCaptionText = "User";
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "Users";
                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetListPageUsers";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString() });
                g.InstantiateIn(Container);
            }
        }

        public void CreateGridUserList(int PageSNo, StringBuilder Container)
        {
            using (GridMain g = new GridMain())
            {
                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                g.ErrorGrid = "resetGrid";
                g.SuccessGrid = "SuccessGrid";
                g.ApplicationType = "USER";
                g.IsToolBar = false;
                g.IsModule = true;
                g.IsUserModule = true;
                g.IsShowEdit = false;
                g.IsFormHeader = false;
                g.IsPageSNo = true;
                g.Height = 316;
                g.FormCaptionText = "User";
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "Users";
                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetGridUserData2";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "SNo", Title = "Image", DataType = GridDataType.String.ToString(), Filterable = "false", Template = "<img src=\"images/user.png\" /><input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= SNo #\"/>" });
                g.InstantiateIn(Container);
            }
        }

        private void CreateGridUsersList(StringBuilder Container)
        {
            //System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(System.Web.HttpContext.Current.Session["CurrentLanguage"].ToString());
            //var rm = new System.Resources.ResourceManager("App_GlobalResources.Lang", System.Reflection.Assembly.GetExecutingAssembly());
            //var rm = new System.Resources.ResourceManager("CargoFlashDMSWebApps.App_GlobalResources.Lang", System.Reflection.Assembly.Load("CargoFlashDMSWebApps"));
            //var ci = System.Threading.Thread.CurrentThread.CurrentCulture;
            //string CitySNo = System.Web.HttpContext.Current.Session["AccessibleCitySNo"].ToString().ToUpper();
           // string UserSNo = ((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).UserSNo.ToString();  // commented by arman Date: 2017-10-23
            using (Grid g = new Grid())
            {
                this.MyPageName = "Default.cshtml";
                g.PageName = "Default.cshtml";
                g.ModuleName = "Permissions";
                g.IsFormHeader = true;
                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                g.Height = 400;
                g.FormCaptionText = "User";
                g.CommandButtonNewText = "New User";
                g.PrimaryID = "SNo";
                g.AppsName = "Users";
                g.ReportID = "User";
                g.ServiceModuleName = "Permissions";
                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetGridData";
                g.NewURL = "Default.cshtml?Module=Permissions&Apps=Users&FormAction=New";
                //g.SuccessGrid = "ShowAction";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline", DataType = GridDataType.String.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "FirstName", Title = "User Name", DataType = GridDataType.String.ToString() });
                //  g.Column.Add(new GridColumn { Field = "LastName", Title = "Last Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "UserName", Title = "User ID", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "UserType", Title = "Group Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "UserTypeText", Title = "User Type", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AgentName", Title = "Agent Name", DataType = GridDataType.String.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "Agent_Master_Branch", Title = "Master Agent", DataType = GridDataType.String.ToString(), Width = 80 });
                //g.Column.Add(new GridColumn { Field = "CompanyName", Title = "Company Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "EMailID", Title = "Email Address", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "GroupEMailID", Title = "Group Email Address", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString(), Width = 80 });
                //g.Column.Add(new GridColumn { Field = "IsCityChangeAllowed", Title = "Allow City", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Text_CompanyName", Title = "Company Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "Blocked", Title = "Blocked", DataType = GridDataType.String.ToString(), Width = 80 });

                g.Column.Add(new GridColumn { Field = "Text_UserExpairyDate", Title = "Expiry Date", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "LastResetBy", Title = "Reset By", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "UserCreatedby", Title = "Created By", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "UserCreatedOn", Title = "Created On Date", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "CreatedOntime", Title = "Created On Time", DataType = GridDataType.String.ToString() });
                g.Action = new List<GridAction>();
                g.Action.Add(new GridAction { ActionName = "Read", AppsName = this.MyAppID, CssClassName = "read", ModuleName = "Permissions" });
                g.Action.Add(new GridAction { ActionName = "Edit", AppsName = this.MyAppID, CssClassName = "edit", ModuleName = "Permissions" });
                g.Action.Add(new GridAction { ActionName = "Edit", AppsName = this.MyAppID, ClientAction = "ResetUserPassword", CssClassName = "repeat", ModuleName = "Permissions", ButtonCaption = "Reset Password" });
                // g.ExtraParam = new List<GridExtraParam>();  // commented by arman Date: 2017-10-23
                //g.ExtraParam.Add(new GridExtraParam { Field = "CitySNo", Value = CitySNo });
                // g.ExtraParam.Add(new GridExtraParam { Field = "UserSNo", Value = UserSNo }); // commented by arman Date: 2017-10-23
                g.InstantiateIn(Container);
            }
        }

        public void CreateGridUserGroupList(int GroupSNo, StringBuilder Container)
        {
            CustomizedGrid.GroupSNo = GroupSNo;
            using (GridMain g = new GridMain())
            {
                g.ErrorGrid = "resetGrid";
                g.SuccessGrid = "SuccessGrid";
                g.ApplicationType = "GROUPUSERS";
                g.IsToolBar = false;
                g.IsModule = true;
                g.IsUserModule = true;
                g.IsShowEdit = false;
                g.IsFormHeader = false;
                g.IsPageSNo = true;
                g.Height = 316;
                g.FormCaptionText = "User";
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "Users";
                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetGridGroupUsers";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString(), Template = "<span>#= UserName #</span><input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= SNo #\"/>" });
                g.InstantiateIn(Container);
            }
        }

        public void CreateGridUserGroupList2(int GroupSNo, StringBuilder Container)
        {
            CustomizedGrid.GroupSNo = GroupSNo;
            using (GridMain g = new GridMain())
            {
                g.ApplicationType = "GROUPUSER";
                g.IsAllowedFiltering = true;
                g.IsAllowedSorting = true;
                g.IsAutoSize = false;
                g.IsToolBar = false;
                g.IsModule = true;
                g.IsUserModule = true;
                g.IsShowEdit = false;
                g.IsFormHeader = false;
                g.IsPageSNo = true;
                g.FormCaptionText = "User";
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "Users";
                g.DataSoruceUrl = "Services/Permissions/UsersService.svc/GetGridGroupUsers2";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString(), Template = "<span>#= UserName #</span><input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= SNo #\"/>" });
                g.Column.Add(new GridMainColumn { Field = "EMailID", Title = "Email Address", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "CityName", Title = "City", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridMainColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                g.InstantiateIn(Container);
            }
        }

        private void SaveUsers()
        {
            //List<Users> listGroup = new List<Users>();
            List<Users> listGroup = new List<Users>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            string AgentSno = string.Empty;
            string AllowedUserCreation = string.Empty;
            AgentSno = Convert.ToString(FormElement["Agent"].ToString());
            if (!string.IsNullOrEmpty(AgentSno))
                AgentSno = AgentSno.Split('-')[0].ToString();
            //if (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToString() != "SUPER ADMIN")
            //{  AllowedUserCreation = null; }

            //else
            //{
                AllowedUserCreation = (FormElement["IsAllowedUserCreation"] != null && FormElement["IsAllowedUserCreation"] == "1") ? "1" : "0";
              // }
            var users = new Users
            {
                SNo = 0,
                FirstName = FormElement["FirstName"].ToUpper(),
                LastName = FormElement["LastName"].ToUpper(),
                EmployeeID = FormElement["EmployeeID"],
                UserName = FormElement["UserName"],
                EMailID = FormElement["EMailID"].ToUpper(),
                GroupEMailID = FormElement["GroupEMailID"] == null ? "" : FormElement["GroupEMailID"].ToUpper(),
                MobileCountryCode = FormElement["MobileCountryCode"] == "" ? "" : FormElement["MobileCountryCode"],
                Mobile = FormElement["Mobile"] == "" ? "" : FormElement["Mobile"],
                CitySNo = FormElement["CitySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CitySNo"]),
                //DCity = FormElement["UserName"].ToUpper(),
                //CompanyName = FormElement["CompanyName"] == "" ? "" : FormElement["CompanyName"].ToUpper(),
                Address = FormElement["Address"].ToUpper(),
                IsActive = FormElement["IsActive"] == "0",
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                GroupSNo = FormElement["GroupSNo"] == "" ? 0 : Convert.ToInt32(FormElement["GroupSNo"]),
                AirportSNo = FormElement["AirportSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirportSNo"]),
                //WareHouseMasterSNo = Convert.ToInt32(FormElement["WareHouseMasterSNo"]),
                Agent = AgentSno,//FormElement["Agent"],
                Airline = FormElement["Airline"],
                IsCityChangeAllowed = FormElement["MLIsCityChangeAllowed"] == "0" ? true : false,
                AllowCity = FormElement["AllowCitySNo"],
                OtherAirlineAccess = FormElement["OtherAirlineAccess"] == "0" ? true : false,
                OtherAirline = FormElement["OtherAirline"],
                // ForwarderSno = FormElement["ForwarderSno"] == "" ? 0 : Convert.ToInt32(FormElement["ForwarderSno"]),
                //TruckerSno = FormElement["TruckerSno"] == "" ? 0 : Convert.ToInt32(FormElement["TruckerSno"]), 
                //LanguaugeSNo = Convert.ToInt32(FormElement["LanguaugeSNo"]),
                IsBlock = FormElement["IsBlock"] == "0",

                UserTypeSNo = FormElement["UserTypeSNo"],
                UserTypeValue = FormElement["UserTypeValue"] == "" ? 0 : Convert.ToInt32(FormElement["UserTypeValue"]),
                Designation = FormElement["Designation"] == "" ? 0 : Convert.ToInt32(FormElement["Designation"]),
                Terminal = FormElement["Terminal"] == "" ? 0 : Convert.ToInt32(FormElement["Terminal"]),

                //added by Pankaj Khanna
                //OfficeSNo = Convert.ToInt32(FormElement["OfficeSNo"]),
                OfficeSNo = FormElement["OfficeSNo"] == "" ? 0 : Convert.ToInt32(FormElement["OfficeSNo"]),
                NameSNo = FormElement["NameSNo"] == "" ? 0 : Convert.ToInt32(FormElement["NameSNo"]),
                //Name = FormElement["Name"] == "" ? 0 : Convert.ToInt32(FormElement["Name"])
                UserExpairyDate = Convert.ToDateTime(FormElement["UserExpiaryDate"]),
                isProductAccess = FormElement["Otherproducts"] == "0" ? true : false,
                Productsno = FormElement["Products"],
                IsAllowedUserCreation = AllowedUserCreation,//(FormElement["IsAllowedUserCreation"] != null && FormElement["IsAllowedUserCreation"] == "1") ? "1" : "0"
                IsSpecialInvoice = FormElement["IsSpecialInvoice"] == "0" ? true : false,
                ShowAsAgreedonAWBPrint = Convert.ToBoolean(FormElement["ShowAsAgreedonAWBPrint"] == "on" ? 1 : 0),
                OverrideAsAgreedonAWBPrint = Convert.ToBoolean(FormElement["OverrideAsAgreedonAWBPrint"] == "on" ? 1 : 0),
                ViewRatewhileBooking = Convert.ToBoolean(FormElement["ViewRatewhileBooking"] == "on" ? 1 : 0),
                EnableRateTabInReservation = Convert.ToBoolean(FormElement["EnableRateTabInReservation"] == "on" ? 1 : 0),
                ShowBalanceCreditLimit = Convert.ToBoolean(FormElement["ShowBalanceCreditLimit"] == "on" ? 1 : 0),
            };

            //listGroup.Add(users);
            //object datalist = (object)listGroup;
            //DataOperationService(DisplayModeSave, datalist, MyModuleID);

            listGroup.Add(users);

            List<UserCollection> listusercollection = new List<UserCollection>();
            var usercollection = new UserCollection
            {
                userstype = listGroup,
                // usercitytranstype = listUserCityTrans
            };
            listusercollection.Add(usercollection);
            object datalist = (object)listusercollection;
            DataOperationService(DisplayModeSave, datalist, "Permissions");
        }

        private void UpdateUsers(int RecordID)
        {
            List<Users> listGroup = new List<Users>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            string AgentSno = string.Empty;
            string AllowedUserCreation = string.Empty;
            AgentSno = Convert.ToString(FormElement["Agent"].ToString());
            if (!string.IsNullOrEmpty(AgentSno))
                AgentSno = AgentSno.Split('-')[0].ToString();
            //if (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToString() != "SUPER ADMIN")
            //{ AllowedUserCreation = null; }

            //else
            //{
                AllowedUserCreation = (FormElement["IsAllowedUserCreation"] != null && FormElement["IsAllowedUserCreation"] == "1") ? "1" : "0";
            //}
            var users = new Users
            {
                //SNo = Convert.ToInt32(RecordID),
                //FirstName = FormElement["FirstName"].ToUpper(),
                //LastName = FormElement["LastName"].ToUpper(),
                //EmployeeID = FormElement["EmployeeID"],
                //UserName = FormElement["UserName"],
                //EMailID = FormElement["EMailID"].ToUpper(),
                //GroupEMailID = FormElement["GroupEMailID"],
                //MobileCountryCode = FormElement["MobileCountryCode"] == "" ? "" : FormElement["MobileCountryCode"],
                //Mobile = FormElement["Mobile"] == "" ? "" : FormElement["Mobile"],
                //CitySNo = FormElement["CitySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CitySNo"]),
                ////DCity = FormElement["UserName"].ToUpper(),
                ////CompanyName = FormElement["CompanyName"] == "" ? "" : FormElement["CompanyName"].ToUpper(),
                //Address = FormElement["Address"].ToUpper(),
                //IsActive = FormElement["IsActive"] == "0",
                //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                //GroupSNo = FormElement["GroupSNo"] == "" ? 0 : Convert.ToInt32(FormElement["GroupSNo"]),
                //AirportSNo = FormElement["AirportSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirportSNo"]),
                ////WareHouseMasterSNo = Convert.ToInt32(FormElement["WareHouseMasterSNo"]),
                //Agent = FormElement["Agent"],
                //Airline = FormElement["Airline"],
                //IsCityChangeAllowed = FormElement["MLIsCityChangeAllowed"] == "0",
                //AllowCity = FormElement["AllowCitySNo"],
                //OtherAirlineAccess = FormElement["OtherAirlineAccess"] == "0",
                //OtherAirline = FormElement["OtherAirline"],
                // ForwarderSno = FormElement["ForwarderSno"] == "" ? 0 : Convert.ToInt32(FormElement["ForwarderSno"]),
                //TruckerSno = FormElement["TruckerSno"] == "" ? 0 : Convert.ToInt32(FormElement["TruckerSno"]), 
                ////LanguaugeSNo = Convert.ToInt32(FormElement["LanguaugeSNo"]),
                //IsBlock = FormElement["IsBlock"] == "0",

                //UserTypeSNo = FormElement["UserTypeSNo"],
                //UserTypeValue = FormElement["UserTypeValue"] == "" ? 0 : Convert.ToInt32(FormElement["UserTypeValue"]),
                //Designation = FormElement["Designation"] == "" ? 0 : Convert.ToInt32(FormElement["Designation"]),
                //Terminal = FormElement["Terminal"] == "" ? 0 : Convert.ToInt32(FormElement["Terminal"]),

                ////added by Pankaj Khanna
                //OfficeSNo = Convert.ToInt32(FormElement["OfficeSNo"]),
                //NameSNo = FormElement["NameSNo"] == "" ? 0 : Convert.ToInt32(FormElement["NameSNo"])
                ////Name = FormElement["Name"] == "" ? 0 : Convert.ToInt32(FormElement["Name"])

                // ******************** Previus ****************************************************
                SNo = Convert.ToInt32(RecordID),
                FirstName = FormElement["FirstName"].ToUpper(),
                LastName = FormElement["LastName"].ToUpper(),
                EmployeeID = FormElement["EmployeeID"],
                DCity = FormElement["Text_CitySNo"].ToUpper(),
                //CompanyName = FormElement["CompanyName"] == "" ? "" : FormElement["CompanyName"].ToUpper(),
                Address = FormElement["Address"].ToUpper(),
                EMailID = FormElement["EMailID"].ToUpper(),
                GroupEMailID = FormElement["GroupEMailID"] == null ? "" : FormElement["GroupEMailID"].ToUpper(),
                UserName = FormElement["UserName"],
                MobileCountryCode = FormElement["MobileCountryCode"] == "" ? "" : FormElement["MobileCountryCode"],
                Mobile = FormElement["Mobile"] == "" ? "" : FormElement["Mobile"],
                CitySNo = FormElement["CitySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CitySNo"]),
                AirportSNo = FormElement["AirportSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirportSNo"]),
                ////WareHouseMasterSNo = Convert.ToInt32(FormElement["WareHouseMasterSNo"]),
                Agent = AgentSno,//FormElement["Agent"],
                Airline = FormElement["Airline"],
                ForwarderSno = FormElement["ForwarderSno"] == "" ? 0 : Convert.ToInt32(FormElement["ForwarderSno"]),
                TruckerSno = FormElement["TruckerSno"] == "" ? 0 : Convert.ToInt32(FormElement["TruckerSno"]),
                GroupSNo = FormElement["GroupSNo"] == "" ? 0 : Convert.ToInt32(FormElement["GroupSNo"]),
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                IsCityChangeAllowed = FormElement["MLIsCityChangeAllowed"] == "0" ? true : false,
                AllowCity = FormElement["AllowCitySNo"],
                OtherAirlineAccess = FormElement["OtherAirlineAccess"] == "0" ? true : false,
                OtherAirline = FormElement["OtherAirline"],
                //LanguaugeSNo = Convert.ToInt32(FormElement["LanguaugeSNo"]),
                //IsBlock = Convert.ToBoolean(FormElement["IsBlock"].ToString()),
                //IsActive = Convert.ToBoolean(FormElement["IsActive"].ToString())
                IsBlock = FormElement["IsBlock"] == "0",
                IsActive = FormElement["IsActive"] == "0",
                UserTypeSNo = FormElement["UserTypeSNo"],
                UserTypeValue = FormElement["UserTypeValue"] == "" ? 0 : Convert.ToInt32(FormElement["UserTypeValue"]),
                Designation = FormElement["Designation"] == "" ? 0 : Convert.ToInt32(FormElement["Designation"]),
                Terminal = FormElement["Terminal"] == "" ? 0 : Convert.ToInt32(FormElement["Terminal"]),
                OfficeSNo = FormElement["OfficeSNo"] == "" ? 0 : Convert.ToInt32(FormElement["OfficeSNo"]),
                NameSNo = FormElement["NameSNo"] == "" ? 0 : Convert.ToInt32(FormElement["NameSNo"]),
                UserExpairyDate = Convert.ToDateTime(FormElement["UserExpairyDate"]),
                isProductAccess = FormElement["Otherproducts"] == "0" ? true : false,
                Productsno = FormElement["Products"],
               Remarks = Convert.ToString(FormElement["Remarks"]).ToUpper(),
              IsAllowedUserCreation = AllowedUserCreation,//(FormElement["IsAllowedUserCreation"] !=null && FormElement["IsAllowedUserCreation"] == "1") ? "1" : "0"
               IsSpecialInvoice = FormElement["IsSpecialInvoice"] == "0" ? true : false,
               ShowAsAgreedonAWBPrint = Convert.ToBoolean(FormElement["ShowAsAgreedonAWBPrint"] == "on" ? 1 : 0),
                OverrideAsAgreedonAWBPrint = Convert.ToBoolean(FormElement["OverrideAsAgreedonAWBPrint"] == "on" ? 1 : 0),
                ViewRatewhileBooking = Convert.ToBoolean(FormElement["ViewRatewhileBooking"] == "on" ? 1 : 0),
                EnableRateTabInReservation = Convert.ToBoolean(FormElement["EnableRateTabInReservation"] == "on" ? 1 : 0),
                ShowBalanceCreditLimit = Convert.ToBoolean(FormElement["ShowBalanceCreditLimit"] == "on" ? 1 : 0),
            };
            listGroup.Add(users);
            //List<UserCityTrans> listUserCityTrans = new List<UserCityTrans>();
            List<UserCollection> listusercollection = new List<UserCollection>();
            var usercollection = new UserCollection
            {
                userstype = listGroup,
                //usercitytranstype = listUserCityTrans
            };
            listusercollection.Add(usercollection);
            object datalist = (object)listusercollection;
            DataOperationService(DisplayModeUpdate, datalist, "Permissions");
        }

        private void DeleteUsers(int RecordID)
        {
            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, listID, "Permissions");
        }

        private object GetUsersRecord()
        {
            object users = null;
            //if (!string.IsNullOrEmpty(CurrentPageContext.Request.QueryString["RecID"]))
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
            {
                Users usersList = new Users();
                object obj = (object)usersList;
                users = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, "Permissions");
                this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
            }
            else
            {
                // TODO: Error Messgae: Record not found.
            }
            return users;
        }

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
