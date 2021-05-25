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
    public class PagesManagementWebUI : BaseWebUISecureObject
    {
        public PagesManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPageName = "Permission.aspx";
            this.MyModuleID = "Users";
            this.MyAppID = "Pages";
        }

        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter())
            {
                htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                htmlFormAdapter.HeadingColumnName = "Name";
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
        }

        private void CreateGrid(StringBuilder Container)
        {
            if (System.Web.HttpContext.Current.Request.QueryString["RecID"] != null)
            {
                CustomizedGrid.GroupSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString());
            }

            if (System.Web.HttpContext.Current.Request.QueryString["UserSNo"] != null)
            {
                CustomizedGrid.UserSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["UserSNo"].ToString());
            }
            else
            {
                CustomizedGrid.UserSNo = 0;
            }

            using (NestedGrids g = new NestedGrids())
            {

                string lFormCaptionText = "";

                if (CustomizedGrid.UserName == null)
                {
                    lFormCaptionText = "Group: " + CustomizedGrid.GroupName;
                    g.IsBackRequired = true;
                    g.NewURL = "Users.aspx?Module=Users&Apps=Groups&FormAction=INDEXVIEW";
                }
                else
                {
                    lFormCaptionText = "User: " + CustomizedGrid.UserName + " - Group: " + CustomizedGrid.GroupName;
                    g.IsBackRequired = true;
                    g.NewURL = "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&RecID=" + System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString() + "&UserSNo=" + System.Web.HttpContext.Current.Request.QueryString["UserSNo"].ToString() + "";
                }

                g.DefaultPageSize = 1000;
                g.FormCaptionText = lFormCaptionText;
                g.IsModule = true;
                g.IsFormHeader = false;
                g.IsShowEdit = false;
                g.IsSaveChanges = false;
                g.IsAddNewRecord = false;
                g.Height = 392;
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = "Users";
                g.AppsName = "Pages";
                g.DataSoruceUrl = "Services/Permissions/PagesService.svc/GetGridData";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "PageName", Title = "Module Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsActive", Title = "All Permission", DataType = GridDataType.Boolean.ToString(), Template = "<input id=\"IsActive\" type=\"checkbox\" # if(IsFound){ # checked #} # onclick=\"return CheckAllDocument(this);\" onchange=\"return CheckAllDocument(this);\" class=\"checkbox1\"/><input type=\"hidden\" id=\"IsActive_previous\" name=\"IsActive_previous\" value=\"#= IsFound #\" /><input type=\"hidden\" name=\"SNo\" value=\"#= SNo #\" /><input type=\"hidden\" id=\"IsChildOpen\" name=\"IsChildOpen\" value=\"false\" />" });

                //#region Nested Grid Section

                g.NestedPrimaryID = "MenuSNo";
                g.NestedModuleName = "Users";
                g.NestedAppsName = "Pages";
                g.NestedParentID = "MenuSNo";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1000;
                g.NestedIsPageable = false;
                g.IsNestedAllowedFiltering = false;
                g.IsNestedAllowedSorting = false;
                g.NestedDataSoruceUrl = "Services/Permissions/PageRightsService.svc/GetChildGridData";
                g.NestedColumn = new List<GridColumn>();

                g.NestedColumn.Add(new GridColumn { Field = "PageName", Title = "Page Name", DataType = GridDataType.String.ToString() });
                g.NestedColumn.Add(new GridColumn { Field = "ProcessPermission", Title = "Action", DataType = GridDataType.String.ToString(), Template = "<a id=\"btnAction\" onclick=\"OpenSubprocessDialog(#= SNo #); return false;\"> # if( IsSubProcess == true || IsGroupSubProcess==true) { # <img class=\"k - image\" alt=\"Sub Process Permission\" style=\"cursor:pointer;\" title=\"Sub Process Permission\" src=\"images/edit.png\"> # } # </a> <a id=\"btnActionStatusAccessibility\" onclick=\"OpenStatusAccessibilityDialog(#= SNo #); return false;\"> # if(IsStatusAccessibility==true) { # <img class=\"k - image\" alt=\"Status Accessibility\" style=\"cursor:pointer;\" title=\"Status Accessibility\" src=\"images/createcountry.png\"> # } # </a>" });
                g.NestedColumn.Add(new GridColumn { Field = "Create", Title = "<div><input type='checkbox' id='chkidCreate' name='chkidCreate' onclick='return CreateCheckAll(this);' onchange='return CreateCheckAll(this);'/>Create</div>", DataType = GridDataType.Boolean.ToString(), Template = "<input id=\"chkCreate\" class=\"checkbox\" type=\"checkbox\" onclick=\"return CreateRead(this);\" # if( Create == true) { if(GroupCreate){ # checked # } } else {# disabled # } #></input><input type=\"hidden\" name=\"SNo1\" value=\"#= SNo1 #\" /><input type=\"hidden\" id=\"chkCreate_previous\" value=\"#= GroupCreate #\" />" });
                g.NestedColumn.Add(new GridColumn { Field = "Edit", Title = "<div><input type='checkbox' id='chkidEdit' name='chkidEdit' onclick='return CreateCheckAll(this);' onchange='return CreateCheckAll(this);'/>Edit</div>", DataType = GridDataType.Boolean.ToString(), Template = "<input id=\"chkEdit\" class=\"checkbox\" type=\"checkbox\" onclick=\"return CreateRead(this);\" # if( Edit == true) { if(GroupEdit){ # checked # } } else {# disabled # } #></input><input type=\"hidden\" name=\"SNo2\" value=\"#= SNo2 #\" /><input type=\"hidden\" id=\"chkEdit_previous\" value=\"#= GroupEdit #\" />" });
                g.NestedColumn.Add(new GridColumn { Field = "Delete", Title = "<div><input type='checkbox' id='chkidDelete' name='chkidDelete' onclick='return CreateCheckAll(this);' onchange='return CreateCheckAll(this);'/>Delete</div>", DataType = GridDataType.Boolean.ToString(), Template = "<input id=\"chkDelete\" class=\"checkbox\" type=\"checkbox\" onclick=\"return CreateRead(this);\" # if( Delete == true) { if(GroupDelete){ # checked # } } else {# disabled # } #></input><input type=\"hidden\" name=\"SNo3\" value=\"#= SNo3 #\" /><input type=\"hidden\" id=\"chkDelete_previous\" value=\"#= GroupDelete #\" />" });
                g.NestedColumn.Add(new GridColumn { Field = "Read", Title = "<div><input type='checkbox' id='chkidRead' name='chkidRead' onclick='return CreateCheckAll(this);' onchange='return CreateCheckAll(this);'/>Read</div>", DataType = GridDataType.Boolean.ToString(), Template = "<input id=\"chkRead\" class=\"checkbox\" type=\"checkbox\"  onclick=\"return UnCheckedByRead(this);\"   # if( Read == true) { if(GroupRead){ # checked # } } else {# disabled # } #></input><input type=\"hidden\" name=\"SNo4\" value=\"#= SNo4 #\" /><input type=\"hidden\" id=\"chkRead_previous\" value=\"#= GroupRead #\" />" });

                //#endregion

                g.InstantiateIn(Container);

                CreateUserPage(Container);
            }
        }

        private void UpdatePages(int RecordID)
        {
            List<Pages> listGroup = new List<Pages>();
            var pages = new Pages { SNo = Convert.ToInt32(RecordID), PageName = CurrentPageContext.Request.Form["PageName"], Hyperlink = CurrentPageContext.Request.Form["Hyperlink"].ToString(), MenuSNo = Convert.ToInt32(CurrentPageContext.Request.Form["MenuSNo"]), DisplayOrder = Convert.ToInt32(CurrentPageContext.Request.Form["DisplayOrder"]), Help = CurrentPageContext.Request.Form["Help"], Description = CurrentPageContext.Request.Form["Description"], IsActive = Convert.ToBoolean(CurrentPageContext.Request.Form["IsActive"].ToString()), CreatedBy = 2, CreatedOn = DateTime.Today, UpdatedBy = 2, UpdatedOn = DateTime.Today };
            listGroup.Add(pages);
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

    <div id='divSpecialRights'></div>

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
