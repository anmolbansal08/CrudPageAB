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
using CargoFlash.Cargo.Model.Accounts;
using System.Collections;
using CargoFlash.Cargo.WebUI;


namespace CargoFlash.Cargo.WebUI.Accounts
{
    public class SummaryReportManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordSummaryReport()
        {
            object SummaryReport = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CashRegister SummaryReportList = new CashRegister();
                    object obj = (object)SummaryReportList;
                    SummaryReport = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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
            }
            return SummaryReport;
        }

        public SummaryReportManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Accounts";
                this.MyAppID = "SummaryReport";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public SummaryReportManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }

                this.MyPrimaryID = "SNo";
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Accounts";
                this.MyAppID = "SummaryReport";
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
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Text_CashierID";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordSummaryReport();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordSummaryReport();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordSummaryReport();
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
                            htmlFormAdapter.objFormData = GetRecordSummaryReport();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
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
                        case DisplayModeDuplicate:
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
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return container;
        }

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;

                    case DisplayModeDelete:
                        //  DeleteCashRegister(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        //Changes done by Nitin Sharma
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {

                    g.FormCaptionText = "Summary Report";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.IsActionRequired = false;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "CashierId", Title = "Cashier Id", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CashierName", Title = "Cashier Name", DataType = GridDataType.String.ToString() });

                    //g.Column.Add(new GridColumn { Field = "StartSession", Title = "Start Session", DataType = GridDataType.Date.ToString(), Template = "# if( StartSession==null) {# # } else {# #= kendo.toString(new Date(data.StartSession.getTime() + data.StartSession.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });
                    //g.Column.Add(new GridColumn { Field = "EndSession", Title = "End Session", DataType = GridDataType.Date.ToString(), Template = "# if( EndSession==null) {# # } else {# #= kendo.toString(new Date(data.EndSession.getTime() + data.EndSession.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "ShiftStart", Title = "Shift Start", DataType = GridDataType.Date.ToString(), Template = "# if( ShiftStart==null) {# # } else {# #= kendo.toString(new Date(data.ShiftStart.getTime() + data.ShiftStart.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "ShiftEnd", Title = "Shift End", DataType = GridDataType.Date.ToString(), Template = "# if( ShiftEnd==null) {# # } else {# #= kendo.toString(new Date(data.ShiftEnd.getTime() + data.ShiftEnd.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });

                    // g.Column.Add(new GridColumn { Field = "Startbalance", Title = "Start Balance", DataType = GridDataType.String.ToString()});
                    //g.Column.Add(new GridColumn { Field = "ClosingBalance", Title = "Closing Balance", DataType = GridDataType.String.ToString(), Width = 200 });
                    g.Column.Add(new GridColumn { Field = "CashierId", Title = "Print", DataType = GridDataType.String.ToString(), Width = 100, Template = "<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"Print\" onclick=PrintSummaryReport(#=SNo#,\"#=CashierIDGroupSNo#\",\"#=cashregisterSNo#\"); />" });
                    g.Column.Add(new GridColumn { Field = "CashierId", Title = "Details", DataType = GridDataType.String.ToString(), Width = 100, Template = "<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"Details\" onclick=DPrintSummaryReport(#=SNo#,\"#=CashRegisterDate#\",this); />" });

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
    }
}
