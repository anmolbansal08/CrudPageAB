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
using CargoFlash.Cargo.Model.Roster;
using System.Collections;
using System.Web;
using CargoFlash.Cargo.WebUI;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.Cargo.Model.Shipment;

namespace CargoFlash.Cargo.WebUI.Accounts
{
    public class CCAManagementWebUI : BaseWebUISecureObject
    {

        public CCAManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "CCA";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public CCAManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Shipment";
                this.MyAppID = "CCA";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            strContent = BuildFormView(this.DisplayMode, container);
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
            return strContent;
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Back";
                    switch (DisplayMode)
                    {
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(RenderCCAForm());
                            container.Append("<div id='divCCANEW'><span id='spnCCA'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCCANEWSNo' name='hdnCCANEWSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblCCA' Style='margin-top: 20px;'></table></span></div>");
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetCCARecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(RenderCCAForm());
                            container.Append("<div id='divCCANEW'><span id='spnCCA'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCCASNo' name='hdnCCANEWSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblCCA' Style='margin-top: 20px;'></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetCCARecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(RenderCCAForm());
                            container.Append("<div id='divCCANEW'><span id='spnCCA'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCCASNo' name='hdnCCANEWSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblCCA' Style='margin-top: 20px;'></table></span></div>");
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


        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New CCA";
                    g.FormCaptionText = "Cargo Charges Correction Advice";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.IsRowDataBound = true;
                    //g.IsProcessPart = true;
                    g.SuccessGrid = "fn_OnCCASuccessGrid";
                    //IsHidden = true,
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "Action", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "CCANo", Title = "CCANo", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWBNo", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin City", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Destination", Title = "Destination City", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AgentName", Title = "Agent Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedDate", Title = "Created Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ApprovedDate", Title = "Approved/Rejected Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CCAGeneratedStatus", Title = "AWB Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "CCA Status", DataType = GridDataType.String.ToString() }); 
                    g.Column.Add(new GridColumn { Field = "PendingDays", Title = "Pending for Approval(Days)", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CCAStatus", Title = "Mode", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IsCCADoc", Title = "IsCCADoc", DataType = GridDataType.String.ToString(),IsHidden=true });
                    g.Action = new List<GridAction>();


                    //if (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToUpper() == "ADMIN")
                    //{
                    //string Approve = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ApproveCCA"].ToUpper().ToString();
                    bool Approve = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SpecialRights["CCAAPPR"];
                    bool Request = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SpecialRights["CCAREQ"];
                    //string[] tokens = Approve.Split(new[] { "," }, StringSplitOptions.None);
                    //string LoginType = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToUpper();

                    //if (tokens.Contains(LoginType))
                    if (Approve == true)
                    {
                       
                        g.Action.Add(new GridAction
                        {
                            ButtonCaption = "View",
                            ActionName = "READ",
                            AppsName = this.MyAppID,
                            CssClassName = "READ",
                            ModuleName = this.MyModuleID
                        });

                        g.Action.Add(new GridAction
                        {
                            ButtonCaption = "Approve",
                            ActionName = "EDIT",
                            AppsName = this.MyAppID,
                            CssClassName = "EDIT",
                            ModuleName = this.MyModuleID
                        });
                    }
                    else if (Approve == false && Request == false)
                    {
                        g.Action.Add(new GridAction
                        {
                            ButtonCaption = "View",
                            ActionName = "READ",
                            AppsName = this.MyAppID,
                            CssClassName = "READ",
                            ModuleName = this.MyModuleID
                        });
                    }
                    else if (Request == true)
                    {

                    }

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

        public override void DoPostBack()
        {

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    // SaveCreditDebitNote();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    //SaveDutyArea();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    // UpdateCreditNote(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    // DeleteDutyArea(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            //}
        }


        public object GetCCARecord()
        {
            object CCA = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        CCAGrid BTLList = new CCAGrid();
                        object obj = (object)BTLList;
                        //retrieve Entity from Database according to the record
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        CCA = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
                        this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    }
                    else
                    {
                        //Error Message: Record not found.
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }

            return CCA;
        }

        private StringBuilder RenderCCAForm()
        {
            StringBuilder Container = new StringBuilder();
            Container.Append("<Div id='ccaContainer'></Div>");
            return Container;
        }
    }
}
