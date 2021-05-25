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
    public class UserPageRightTransManagementWebUI : BaseWebUISecureObject
    {
        public UserPageRightTransManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPageName = "Users.aspx";
            this.MyModuleID = "Users";
            this.MyAppID = "UserPageRightTrans";
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
                        CreateGrid(container);
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
            this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveUserPageRightTrans();
                    CurrentPageContext.Server.Transfer(MyPageName + "?" + GetWebURLString("INDEXVIEW", false));
                    break;
                case DisplayModeUpdate:
                    UpdateUserPageRightTrans(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false));
                    break;
            }
        }

        private void CreateGrid(StringBuilder Container)
        {
            using (GridMain g = new GridMain())
            {
                g.IsModule = true;
                g.IsFormHeader = false;
                g.IsShowEdit = true;
                g.IsSaveChanges = true;
                g.IsAddNewRecord = false;
                g.Height = 400;
                g.PageName = this.MyPageName;
                g.FormCaptionText = "Group";
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "UserPageRightTrans";
                g.DataSoruceUrl = "Services/Permissions/UserPageRightTransService.svc/GetGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridMainColumn>();
                g.Column.Add(new GridMainColumn { Field = "UserSNo", Title = "UserSNo", DataType = GridDataType.String.ToString() });

                g.InstantiateIn(Container);
            }
        }

        private void SaveUserPageRightTrans()
        {
            List<UserPageRightTrans> listGroup = new List<UserPageRightTrans>();
            var userPageRightTrans = new UserPageRightTrans { UserSNo = Convert.ToInt32(CurrentPageContext.Request.Form["UserSNo"]), IncludePageRightSNo = Convert.ToInt32(CurrentPageContext.Request.Form["IncludePageRightSNo"]), ExcludePageRightSNo = Convert.ToInt32(CurrentPageContext.Request.Form["ExcludePageRightSNo"]), CreatedBy = 2, CreatedOn = DateTime.Today, UpdatedBy = 2, UpdatedOn = DateTime.Today };
            listGroup.Add(userPageRightTrans);
            object datalist = (object)listGroup;
            DataOperationService(DisplayModeSave, datalist);
        }

        private void UpdateUserPageRightTrans(int RecordID)
        {
            List<UserPageRightTrans> listGroup = new List<UserPageRightTrans>();
            var userPageRightTrans = new UserPageRightTrans { SNo = Convert.ToInt32(RecordID), UserSNo = Convert.ToInt32(CurrentPageContext.Request.Form["UserSNo"]), IncludePageRightSNo = Convert.ToInt32(CurrentPageContext.Request.Form["IncludePageRightSNo"]), ExcludePageRightSNo = Convert.ToInt32(CurrentPageContext.Request.Form["ExcludePageRightSNo"]), CreatedBy = 2, CreatedOn = DateTime.Today, UpdatedBy = 2, UpdatedOn = DateTime.Today };
            listGroup.Add(userPageRightTrans);
            object datalist = (object)listGroup;
            DataOperationService(DisplayModeUpdate, datalist);

        }
    }
}
