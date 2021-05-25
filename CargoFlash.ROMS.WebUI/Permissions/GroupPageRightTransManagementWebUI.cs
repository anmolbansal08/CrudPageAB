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
    public class GroupPageRightTransManagementWebUI : BaseWebUISecureObject
    {
        public GroupPageRightTransManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPageName = "Users.aspx";
            this.MyModuleID = "Users";
            this.MyAppID = "GroupPageRightTrans";
        }

        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            object user = null;
            if (!DisplayMode.ToLower().Contains("new"))
            {
                Users gpList = new Users();
                object obj = (object)gpList;
                user = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj);
                this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
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
                case DisplayModeUpdate:
                    UpdateGroupPageRightTrans(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false));
                    break;
            }
        }

        private void CreateGrid(StringBuilder Container)
        {
            using (Grid g = new Grid())
            {
                g.IsModule = true;
                g.IsFormHeader = false;
                g.Height = 400;
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "GroupPageRightTrans";
                g.DataSoruceUrl = "Services/Permissions/GroupPageRightTransService.svc/GetGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "GroupSNo", Title = "Group Name", DataType = GridDataType.String.ToString() });

                g.InstantiateIn(Container);

                CreateUserPage(Container);
            }
        }

        private void UpdateGroupPageRightTrans(int RecordID)
        {
            List<GroupPageRightTrans> listGroup = new List<GroupPageRightTrans>();
            var groupPageRightTrans = new GroupPageRightTrans { SNo = Convert.ToInt32(RecordID), GroupSNo = Convert.ToInt32(CurrentPageContext.Request.Form["GroupSNo"].ToString()), PageRightsSNo = Convert.ToInt32(CurrentPageContext.Request.Form["PageRightsSNo"].ToString()), CreatedBy = 2, CreatedOn = DateTime.Today, UpdatedBy = 2, UpdatedOn = DateTime.Today };
            listGroup.Add(groupPageRightTrans);
            object datalist = (object)listGroup;
            DataOperationService(DisplayModeUpdate, datalist);

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
