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
//using CargoFlash.Cargo.Model.Irregularity;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Irregularity
{
    public class IrregularityManagementWebUI : BaseWebUISecureObject
    {
        public IrregularityManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Irregularity";
                this.MyAppID = "Irregularity";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public IrregularityManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Irregularity";
                this.MyAppID = "Irregularity";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        /// <summary>
        /// Get Record from Irregularity
        /// </summary>
        /// <returns></returns>
        public object GetRecordIrregularity()
        {
            object irregularity = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        CargoFlash.Cargo.Model.Irregularity.Irregularity irregularityList = new CargoFlash.Cargo.Model.Irregularity.Irregularity();
                        object obj = (object)irregularityList;

                        irregularity = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                        this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                    }
                    else
                    {
                        //Error Messgae: Record not found.
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return irregularity;
        }

        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container"></param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "AWBNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordIrregularity();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", false);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //  htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateTracingTab(htmlFormAdapter.InstantiateIn()));
                            container.Append("<input id='hdnIncidentCategoryCode' name='hdnIncidentCategoryCode' type='hidden' value='" + ((CargoFlash.Cargo.Model.Irregularity.Irregularity)(htmlFormAdapter.objFormData)).IncidentCategoryCode + "'/>");
                            //container.Append("<div id='divGetAWBDetail'></div>");
                            //container.Append("<div id='divUploader'></div>");
                            //container.Append("<div id='divIrregularityTransDimension'><span id='spnIrregularityTransDimension'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityTransDimension'></table></span></div>");
                            //container.Append("<div id='divIrregularityTrans'><span id='spnIrregularityTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityTrans'></table></span></div>");
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordIrregularity();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input id='hdnIncidentCategoryCode' name='hdnIncidentCategoryCode' type='hidden' value='" + ((CargoFlash.Cargo.Model.Irregularity.Irregularity)(htmlFormAdapter.objFormData)).IncidentCategoryCode + "'/>");
                            container.Append("<div id='divGetAWBDetail'></div>");
                            container.Append("<div id='divIrregularityTrans'><span id='spnIrregularityTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityTrans'></table></span></div>");
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordIrregularity();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateTracingTab(htmlFormAdapter.InstantiateIn()));
                            container.Append("<input id='hdnIncidentCategoryCode' name='hdnIncidentCategoryCode' type='hidden' value='" + ((CargoFlash.Cargo.Model.Irregularity.Irregularity)(htmlFormAdapter.objFormData)).IncidentCategoryCode + "'/>");
                            //container.Append("<input id='hdnIncidentCategoryCode' name='hdnIncidentCategoryCode' type='hidden' value='" + ((CargoFlash.Cargo.Model.Irregularity.Irregularity)(htmlFormAdapter.objFormData)).IncidentCategoryCode + "'/>");
                            //container.Append("<div id='divGetAWBDetail'></div>");
                            //container.Append("<div id='divIrregularityTrans'><span id='spnIrregularityTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityTrans'></table></span></div>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divGetAWBDimDetails'><span id='spnAWBDimDetails'><table id='tblAWBDimDetails'></table></span></div>");
                            container.Append("<div id='divGetAWBDetail'></div>");
                            container.Append("<div id='divUploader'></div>");
                            container.Append("<div id='divIrregularityTransDimension'><span id='spnIrregularityTransDimension'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityTransDimension'></table></span></div>");
                            container.Append("<div id='divIrregularityTrans'><span id='spnIrregularityTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityTrans'></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordIrregularity();
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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return container;
        }

        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        private StringBuilder CreateTracingTab(StringBuilder container)
        {
             //< li id = 'liNND' > 1st Notice of NND</ li >
             //< li id = 'liNND2nd' > 2nd Notice of NND</ li >
             //< li id = 'liNND3rd' > 3rd Notice of NND</ li >
            StringBuilder strBuilder = new StringBuilder();
            strBuilder.Append(@"<div id='MainDiv'>
            <div id='ApplicationTabs'>
                <ul>
                    <li  id='liIrregularity' class='k-state-active'>Irregularity Information</li>
                    <li id='liTracing'>Assigning</li>
                    <li id='liHistory'>History</li>
                    <li id='liReport'>CDR</li>
                    <li id='liAction'>Action</li>
                    <li id='liIrrFlightReport'>CIR</li>
                    <li id='liCSR'>CSR</li>
                </ul>
                <div id='divTab1'> 
            <span id='spnIrregularityInformation'>");
            strBuilder.Append(container);
            strBuilder.Append("<div id='divGetAWBDetail'></div>");
            strBuilder.Append("<div id='divUploader'></div>");
            strBuilder.Append("<div id='divAction'></div>");
            strBuilder.Append("<div id='divIrrFlightReport'></div>");
            strBuilder.Append("<div id='divCSR'></div>");
            strBuilder.Append("<div id='divIrregularityTransDimension'><span id='spnIrregularityTransDimension'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityTransDimension'></table></span></div>");
            strBuilder.Append("<div id='divIrregularityTrans' style='overflow:auto;'><span id='spnIrregularityTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityTrans'></table></span></div>");
            strBuilder.Append(@"</span> 
            </div>
            <div id='divTracing'><span id='spnTracing'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTracing' class='WebFormTable'></table><table id='tblTracingHistory' class='WebFormTable'></table></span></div>");
            strBuilder.Append(@"
            <div id='divHistory'><span id='spnHistory'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><div id='divGetHistoryDetail'><span id='spnHistoryDetail'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblHistoryDetail' class='WebFormTable'></table></span></div><table id='tblHistory' class='WebFormTable'></table></span></div>");
            strBuilder.Append(@"
            <div id='divIrregularityReport'><span id='spnIrregularityReport'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table style='width:100%;' id='tblIrregularityReport'></table></span></div>");
            //strBuilder.Append(@"
            //<div id='divNND'><span id='spnNND'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table style='width:100%;' id='tblNND' rel='tblNND' class='WebFormTable'></table></span></div>");
            //strBuilder.Append(@"
            //<div id='divNND2nd'><span id='spnNND2nd'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table style='width:100%;' id='tblNND2nd' class='WebFormTable'></table></span></div>");
            //strBuilder.Append(@"
            //<div id='divNND3rd'><span id='spnNND3rd'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table style='width:100%;' id='tblNND3rd' class='WebFormTable'></table></span></div>");
            strBuilder.Append(@"
            <div id='divAction'><span id='spnAction'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table style='width:100%;' id='tblAction' class='WebFormTable'></table><table id='tblActionHistory' class='WebFormTable'></table></span></div>");
            strBuilder.Append(@"
            <div id='divIrrFlightReport'><span id='spnIrrFlightReport'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table style='width:100%;' id='tblIrrFlightReport' class='WebFormTable'></table></span></div>");
            strBuilder.Append(@"<div id='divCSR'><span id='spnCSR'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCSR'></table></span></div>");
            strBuilder.Append("<script>$('#ApplicationTabs').kendoTabStrip();</script>");
            return strBuilder;
        }

        /// <summary>
        /// Generate Irregularity web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionIrregularity.xml
        /// </summary>
        /// <param name="container"></param>
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

        /// <summary>
        /// Generate Grid the for the page
        /// as per the columns of entity supplied
        /// </summary>
        /// <param name="Container"></param>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Irregularity";
                    g.FormCaptionText = "Irregularity";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "IncidentCategory", Title = "Incident Category", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReferenceCode", Title = "Reference Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReportingStation", Title = "Reporting Station", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AssignTo", Title = "Assign To", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No.", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CN38No", Title = "CN No.", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IrregularityStatus", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No.", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "UpdatedUser", Title = "Updated By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedOn", Title = "Updated On", DataType = GridDataType.Date.ToString(), Template = "# if( UpdatedOn==null) {# # } else {# #= kendo.toString(new Date(data.UpdatedOn.getTime() + data.UpdatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return Container;
        }

        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            try
            {
                //string errormessages = System.Web.HttpContext.Current.Request.QueryString["ErrorMessage"];
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        //SaveIrregularity();
                        //string abc= System.Web.HttpContext.Current.Request.QueryString["ErrorMessage"];
                        //if (ErrorMessageList.Count > 0)
                        //{
                        //    if (ErrorMessageList[0] == "0")
                        //        ErrorMessage = ErrorMessage.Replace("<li>0</li>", string.Empty);
                        //    else
                        //    {
                        //        this.MyRecordID = ErrorMessageList[0].Split('-')[1];
                        //        ErrorMessage = "";
                        //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("EDIT", true), false);
                        //    }
                        //}

                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateIrregularity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveIrregularity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;

                    case DisplayModeDelete:
                        DeleteIrregularity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        /// <summary>
        /// Save Irregularity record into the database 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveIrregularity()
        {
            try
            {
                List<CargoFlash.Cargo.Model.Irregularity.Irregularity> listIrregularity = new List<CargoFlash.Cargo.Model.Irregularity.Irregularity>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var irregularity = new CargoFlash.Cargo.Model.Irregularity.Irregularity
                {
                    IncidentCategorySNo = Convert.ToInt32(FormElement["IncidentCategory"]),
                    ReportingStationSNo = Convert.ToInt32(FormElement["ReportingStation"]),
                    AWBSNo = Convert.ToInt32(FormElement["AWBNo"]),
                    Status = false,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listIrregularity.Add(irregularity);
                object datalist = (object)listIrregularity;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        /// <summary>
        /// Update Irregularity record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateIrregularity(string RecordID)
        {
            try
            {
                //List<City> listCity = new List<City>();
                //var FormElement = System.Web.HttpContext.Current.Request.Form;
                //var city = new City
                //{
                //    SNo = Convert.ToInt32(RecordID),
                //    ZoneSNo = Convert.ToInt32(FormElement["ZoneSNo"]),
                //    ZoneName = FormElement["Text_ZoneSNo"],
                //    CityCode = FormElement["CityCode"],
                //    CityName = FormElement["CityName"],
                //    CountrySNo = Convert.ToInt32(FormElement["CountrySNo"]),
                //    CountryCode = FormElement["Text_CountrySNo"],
                //    CountryName = FormElement["Text_CountrySNo"],
                //    DaylightSaving = FormElement["DaylightSaving"],
                //    IATAArea = FormElement["IATAArea"],
                //    TimeDifference = Convert.ToInt32(FormElement["TimeDifference"]),
                //    TimeZoneSNo = Convert.ToInt32(FormElement["TimeZoneSNo"]),
                //    IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",
                //    IsActive = FormElement["IsActive"] == "0",//not null
                //    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                //};
                //listCity.Add(city);
                //object datalist = (object)listCity;
                //DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                //{
                //    //ErrorNumer
                //    //Error Message
                //}
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        /// <summary>
        /// Delete Irregularity record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteIrregularity(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
    }
}