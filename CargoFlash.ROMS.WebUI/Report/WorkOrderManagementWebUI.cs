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
using CargoFlash.Cargo.Model.Report;
using System.Collections;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Report
{
    #region Work Order Class Description
    /*
	*****************************************************************************
	Class Name:		WorkOrderManagementWebUI      
	Purpose:		This Class used to get details of Work Order
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		05 Feb 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class WorkOrderManagementWebUI : BaseWebUISecureObject
    {
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
                            BuildFormView(this.DisplayMode, container);
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

        public object GetRecordWorkOrder()
        {
            object WorkOrder = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    WorkOrder WorkOrderList = new WorkOrder();
                    object obj = (object)WorkOrderList;
                    //retrieve Entity from Database according to the record
                    WorkOrder = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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

            } return WorkOrder;
        }

        public WorkOrderManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Report";
                this.MyAppID = "WorkOrder";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public WorkOrderManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Report";
                this.MyAppID = "WorkOrder";
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
                    htmlFormAdapter.HeadingColumnName = "WorkOrderType";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordWorkOrder();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordWorkOrder();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordWorkOrder();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordWorkOrder();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeIndexView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    container.Append("<div id='divpopUp' style='display: none;'></div>");
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
                    //string CitySNo = System.Web.HttpContext.Current.Session["CitySNo"].ToString();
                    //string UserType = System.Web.HttpContext.Current.Session["ActingLoginType"].ToString().ToUpper();
                    //string GateTicketSearch = "";
                    //string PlateNumberSearch = "";

                    //g.CommandButtonNewText = "New WorkOrder";
                    g.FormCaptionText = "Work Order";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.IsAddNewRecord = false;
                    g.IsActionRequired = false;
                    g.IsShowGridHeader = false;
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "InvoiceNo", Title = "Work Order No", DataType = GridDataType.String.ToString() });
                    //    g.Column.Add(new GridColumn { Field = "InvoiceDate", Title = "Work Order Date", DataType = GridDataType.Date.ToString() });

                    g.Column.Add(new GridColumn { Field = "InvoiceDate", Title = "Work Order Date", DataType = GridDataType.Date.ToString(), Template = "# if(InvoiceDate==null) {# # } else {# #= kendo.toString(new Date(data.InvoiceDate.getTime() + data.InvoiceDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });



                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Template = "<span class=\"actionView\" style=\"cursor:pointer; color:blue;\" onclick=\"GetData(this,#=SNo#);\">#=AWBNo#</span>" });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SLINo", Title = "Lot No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightNo1", Title = "Flight No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DoNo", Title = "DO", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DOSNo", Title = "DOSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ProcessName", Title = "Process Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalAmount", Title = "Total Amount", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GrandTotal", Title = "Grand Total", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RoundOffAmount", Title = "Round Off Amount", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalReceivable", Title = "Total Receivable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "BalanceReceivable", Title = "Balance Receivable", DataType = GridDataType.String.ToString() });

                    //  g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created Date", DataType = GridDataType.Date.ToString() });


                    g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created Date", DataType = GridDataType.Date.ToString(), Template = "# if(CreatedOn==null) {# # } else {# #= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });




                    g.Column.Add(new GridColumn { Field = "SNo", Title = "Print", DataType = GridDataType.String.ToString(), Width = 100, Template = "<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" title=\"Deliverybill workorder\" onclick=\"PrintSlip(#=SNo#);\" />&nbsp;&nbsp; # if( DOSNo==0 || DoNo==0) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"DO\" title=\"Delivery Order\" onclick=\"Print(#=SNo#,#=DOSNo#);\" />#}#" });
                    g.Action = new List<GridAction>();
                    //g.Action.Add(new GridAction { ActionName = "READ", ButtonCaption="Arrived",  AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });
                    g.Action.Add(new GridAction { ActionName = "EDIT", ButtonCaption = "Arrive", AppsName = this.MyAppID, CssClassName = "edit", ModuleName = this.MyModuleID });
                    //g.Action.Add(new GridAction { ActionName = "DELETE", AppsName = this.MyAppID, CssClassName = "delete", ModuleName = this.MyModuleID });
                    //g.Action.Add(new GridAction { ActionName = "PRINT", AppsName = this.MyAppID, CssClassName = "print", ModuleName = this.MyModuleID, NewUrl = "STT.aspx", IsNewWindow = true });
                    //g.Action.Add(new GridAction { ActionName = "Tracking", AppsName = this.MyAppID, CssClassName = "tracking", ModuleName = "", NewUrl = "Default.aspx?Module=Shipment&Apps=WaybillStatus&FormAction=NEW&" });c
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "Type", Value = (System.Web.HttpContext.Current.Request.QueryString["Type"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["Type"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AgentAirline", Value = (System.Web.HttpContext.Current.Request.QueryString["AgentAirline"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["AgentAirline"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = (System.Web.HttpContext.Current.Request.QueryString["FlightNo"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["FlightNo"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = (System.Web.HttpContext.Current.Request.QueryString["FlightDate"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["FlightDate"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWB", Value = (System.Web.HttpContext.Current.Request.QueryString["AWB"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["AWB"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBType", Value = (System.Web.HttpContext.Current.Request.QueryString["AWBType"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["AWBType"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "ULD", Value = (System.Web.HttpContext.Current.Request.QueryString["ULD"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["ULD"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "SLI", Value = (System.Web.HttpContext.Current.Request.QueryString["SLI"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["SLI"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo1", Value = (System.Web.HttpContext.Current.Request.QueryString["FlightNo1"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["FlightNo1"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AgentAirlineName", Value = (System.Web.HttpContext.Current.Request.QueryString["SLI"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["AgentAirlineName"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = (System.Web.HttpContext.Current.Request.QueryString["SLI"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["AWBNo"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "ULDNo", Value = (System.Web.HttpContext.Current.Request.QueryString["SLI"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["ULDNo"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "SLINo", Value = (System.Web.HttpContext.Current.Request.QueryString["SLI"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["SLINo"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FromDate", Value = (System.Web.HttpContext.Current.Request.QueryString["FromDate"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["FromDate"].ToString().ToUpper().Trim()) });
                    g.ExtraParam.Add(new GridExtraParam { Field = "ToDate", Value = (System.Web.HttpContext.Current.Request.QueryString["ToDate"] == null ? string.Empty : System.Web.HttpContext.Current.Request.QueryString["ToDate"].ToString().ToUpper().Trim()) });
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

        //private StringBuilder CreateGrid(StringBuilder Container)
        //{
        //    try
        //    {
        //        using (Grid g = new Grid())
        //        {
        //            g.CommandButtonNewText = "New WorkOrder";
        //            g.FormCaptionText = "WorkOrder";
        //            g.PrimaryID = this.MyPrimaryID;
        //            g.PageName = this.MyPageName;
        //            g.ModuleName = this.MyModuleID;
        //            g.AppsName = this.MyAppID;
        //            g.ServiceModuleName = this.MyModuleID;
        //            g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //            g.Column = new List<GridColumn>();
        //            g.Column.Add(new GridColumn { Field = "WorkOrderType", Title = "WorkOrder Type", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
        //            g.InstantiateIn(Container);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    }
        //    return Container;
        //}
    }
}
