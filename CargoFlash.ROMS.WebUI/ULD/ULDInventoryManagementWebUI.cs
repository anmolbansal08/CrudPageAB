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
using CargoFlash.Cargo.Model.ULD;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.WebUI.ULD
{
    public class ULDInventoryManagementWebUI : BaseWebUISecureObject
    {
        public ULDInventoryManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDInventory";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public ULDInventoryManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDInventory";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public object GetRecordULDInventory()
        {
            object ULDInventory = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ULDInventory ULDInventoryList = new ULDInventory();
                    object obj = (object)ULDInventoryList;
                    ULDInventory = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return ULDInventory;
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "ULD Inventory";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordULDInventory();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateULDInventoryTargetTab(htmlFormAdapter.InstantiateIn()));
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
            StringBuilder strContent = new StringBuilder();
            try
            {
                this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (this.DisplayMode)
                {
                    case DisplayModeIndexView:
                        strContent = CreateGrid(container);
                        break;
                    case DisplayModeReadView:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeNew:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    default:
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return strContent;
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    //g.CommandButtonNewText = "Fetch ULD Inventory";
                    //g.FormCaptionText = "ULD Inventory";
                    //g.PrimaryID = this.MyPrimaryID;
                    //g.PageName = this.MyPageName;
                    //g.ModuleName = this.MyModuleID;
                    //g.AppsName = this.MyAppID;
                    //g.ServiceModuleName = this.MyModuleID;
                    //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    //g.Column = new List<GridColumn>();


                    g.CommandButtonNewText = "Fetch ULD Inventory";
                    g.FormCaptionText = "ULD Inventory";
                    g.ActionTitle = "Edit";
                    g.IsDisplayOnly = false;
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsShowEdit = false;
                    g.IsShowDelete = false;
                    g.IsActionRequired = false;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.SuccessGrid = "ShowEditAction";
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "InventoryDate", Title = "Inventory Date", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "InventoryDate", Title = "Inventory Date", DataType = GridDataType.Date.ToString(), Template = "# if( InventoryDate==null) {# # } else {# #= kendo.toString(new Date(data.InventoryDate.getTime() + data.InventoryDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Station", Title = "Station", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InventoryTakenBy", Title = "Inventory Taken By", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "InventoryTakenAt", Title = "Inventory Taken At", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "InventoryTakenAt", Title = "Inventory Taken At", DataType = GridDataType.Date.ToString(), Template = "# if( InventoryTakenAt==null) {# # } else {# #= kendo.toString(new Date(data.InventoryTakenAt.getTime() + data.InventoryTakenAt.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "InventoryDownload", Title = "Download", DataType = GridDataType.String.ToString(), Template = "<a onclick=\"GetInventoryReport(this,#=SNo#);\" style=\"cursor:pointer;\" ><i class=\"fa fa-download fa-2x\"></i></a>", Filterable = "false", Sortable = "false" });
                    g.Column.Add(new GridColumn { Field = "IsScm", Title = "IsScm", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn
                    {
                        Field = "SNo",
                        Title = "Scm message",
                        DataType = GridDataType.String.ToString(),
                        Width = 100,
                        Template =
                            "# if( IsScm==0) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"M\" title=\"Scm message\" onclick=\"Scmmessage(this,#=SNo#);\" />&nbsp;&nbsp; #} #"
                    });

                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction { ButtonCaption = "EDIT", ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });

                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return Container;
        }

        private StringBuilder CreateULDInventoryTargetTab(StringBuilder container)
        {
            StringBuilder strBuilder = new StringBuilder();
            strBuilder.Append(@"<div id='divTab1'>
            <span id='spnULDInventory'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><div id='div'> "); strBuilder.Append(container); strBuilder.Append(@"</div><table id='tblULDInventory'></table></span></div> <div id='divOverview'></div><input id='hdnCity' name='hdnCity' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString() + "'/> ");

            return strBuilder;
        }
    }
}