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
using System.Collections;
using System.Web;
using CargoFlash.Cargo.WebUI;
using CargoFlash.Cargo.Model.BuildUp;

namespace CargoFlash.Cargo.WebUI.AgentBuildUp
{
    public class AgentBuildUpWeighingManagementWebUI : BaseWebUISecureObject
    {
        public AgentBuildUpWeighingManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "BuildUp";
                this.MyAppID = "AgentBuildUpWeighing";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public AgentBuildUpWeighingManagementWebUI()
        {
            try
            {
                this.MyModuleID = "BuildUp";
                this.MyAppID = "AgentBuildUpWeighing";
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
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            //htmlFormAdapter.objFormData = GetRecordDutyArea();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            //htmlFormAdapter.objFormData = GetRecordDutyArea();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            //htmlFormAdapter.objFormData = GetRecordDutyArea();
                            this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn(TargetAppID: "AgentBuildup"));
                            container.Append("<input id='hdnAgentBuildupSNo' name='hdnAgentBuildupSNo' type='hidden' value='" + this.MyRecordID + "'/><div id='dvWeighingDone'></div><div id='dvWeighing'></div>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            //htmlFormAdapter.objFormData = GetRecordDutyArea();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
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
            StringBuilder strContent = new StringBuilder();
            try
            {
                // if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Agent Build Up Weighing";
                    g.FormCaptionText = "Agent Build Up Weighing";

                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.AddSlashInColumns = "WeighingStatus";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "AgentName", Title = "Agent Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginCityCode", Title = "Origin", DataType = GridDataType.String.ToString() });
                    //  g.Column.Add(new GridColumn { Field = "WeighingStatus", Title = "Weighing ULD", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "WeighingStatus", Template = "<a onclick=\"showChildAgentBuildUpULD(this)\" id=\"WeighingStatus\" style=\"cursor:pointer;color:blue\">#=WeighingStatus#</a>", Title = "Weighing ULD", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDStatus", Title = "Status", DataType = GridDataType.String.ToString(), Width = 150 });
                    g.Column.Add(new GridColumn { Field = "EqptAssignedtoBulk", Title = "Eqpt. Assigned to Bulk", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "LotNo", Title = "Lot No.", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "WeighingBy", Title = "Weighing By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "WeighingOn", Title = "Weighing On", DataType = GridDataType.DateTime.ToString(), Template = "# if( WeighingOn==null) {# # } else {# #= kendo.toString(new Date(data.WeighingOn.getTime() + data.WeighingOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });



                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Weighing and X-Ray",// and X-Ray
                        ActionName = "EDIT",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID,

                    });

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
                    //SaveAgentBuildUp();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    //SaveAgentBuildUp();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    //SaveAgentBuildUp(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    //SaveAgentBuildUp(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }

        }
    }
}
