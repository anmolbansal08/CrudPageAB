using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.WebUI;
using CargoFlash.Cargo.Model.Schedule;
using System.Data;
namespace CargoFlash.Cargo.WebUI.Schedule
{
    #region ScheduleManagementWebUI Class Description

    /*
	*****************************************************************************
	Class Name:		ScheduleManagementWebUI      
	Purpose:		This class used to handle HTTP Type Request/Response	
                    and communicate with REST Services for DML operations
                    object of this class is used in various Code behind files 
                    of Modules
	Company:		CargoFlash 
	Author:			Anand
	Created On:		20 Mar 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class ScheduleManagementWebUI : BaseWebUISecureObject
    {

        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>

        public ScheduleManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Schedule";
                this.MyAppID = "Schedule";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        /// <summary>
        /// Get information of individual Schedule from database according record id supplied
        /// </summary>
        /// <returns>object type of entity Schedule found from database return null in case if touple not found</returns>
        public object GetRecordSchedule()
        {
            object Schedule = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CargoFlash.Cargo.Model.Schedule.Schedule ScheduleList = new CargoFlash.Cargo.Model.Schedule.Schedule();
                    object obj = (object)ScheduleList;
                    //retrieve Entity from Database according to the record
                    Schedule = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            }
            return Schedule;
        }
        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container">Control object</param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "FlightNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordSchedule();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordSchedule();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordSchedule();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnScheduleSno' name='hdnScheduleSno' type='hidden' value='" + this.MyRecordID + "'/><table id='tblScheduleTrans'></table>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordSchedule();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    //if (this.FormAction.ToString().ToUpper().Trim() != "NEW")
                    container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnScheduleSno' name='hdnScheduleSno' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnTextViaRoute' name='hdnTextViaRoute' type='hidden'/><div style='width: 100%; max-height:385px; overflow: visible;'><table id='tblScheduleTrans'></table></div><div id='DivUsedFlights' style='display:none; overflow: visible;'></div>");
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

            return container;
        }
        /// <summary>
        /// Generate Schedule web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionSchedule.xml
        /// </summary>
        /// <param name="container"></param>
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
                    g.CommandButtonNewText = "New Schedule";
                    g.FormCaptionText = "Schedule";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ScheduleTypeName", Title = "Schedule Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_CarrierCode", Title = "Carrier", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ISRfs", Title = "RFS", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Origin", Title = "Origin", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Destination", Title = "Dest", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Routing", Title = "Routing", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString(), Template = "# if( ValidFrom==null) {# # } else {# #= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString(), Template = "# if( ValidTo==null) {# # } else {# #= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

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
        /// <summary>
        /// Insert new Schedule record into the database
        /// Retrieve information from webform and store the same into modal object 
        /// call webservice to save that data into the database
        /// </summary>
        private string SaveSchedule()
        {
            string str = string.Empty;
            try
            {
                int number = 0;
                List<CargoFlash.Cargo.Model.Schedule.ScheduleDetails> listScheduleDetail = new List<CargoFlash.Cargo.Model.Schedule.ScheduleDetails>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                System.Data.DataTable dtCreate = new System.Data.DataTable();
                dtCreate.TableName = "SchTrans";
                dtCreate.Columns.Add("SNo", typeof(System.Int32));
                dtCreate.Columns.Add("ScheduleSNo", typeof(System.Int32));
                dtCreate.Columns.Add("ScheduleType", typeof(System.String));
                dtCreate.Columns.Add("FlightNo", typeof(System.String));
                dtCreate.Columns.Add("HdnOrigin", typeof(System.Int32));
                dtCreate.Columns.Add("Origin", typeof(System.String));
                dtCreate.Columns.Add("ETD", typeof(System.String));
                dtCreate.Columns.Add("HdnDestination", typeof(System.Int32));
                dtCreate.Columns.Add("Destination", typeof(System.String));
                dtCreate.Columns.Add("ETA", typeof(System.String));
                dtCreate.Columns.Add("IsDayLightSaving", typeof(System.String));
                dtCreate.Columns.Add("DayDifference", typeof(System.String));

                dtCreate.Columns.Add("StartDate", typeof(System.String));
                dtCreate.Columns.Add("EndDate", typeof(System.String));
                dtCreate.Columns.Add("HdnAirCraft", typeof(System.String));
                dtCreate.Columns.Add("AirCraft", typeof(System.String));
                dtCreate.Columns.Add("HdnFlightType", typeof(System.String));
                dtCreate.Columns.Add("FlightType", typeof(System.String));
                dtCreate.Columns.Add("AllocatedGrossWeight", typeof(System.String));
                dtCreate.Columns.Add("AllocatedVolumeWeight", typeof(System.String));
                dtCreate.Columns.Add("MaxGrossPerPcs", typeof(System.String));
                dtCreate.Columns.Add("MaxVolumePerPcs", typeof(System.String));
                dtCreate.Columns.Add("AllDays", typeof(System.String));
                dtCreate.Columns.Add("DAY1", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY2", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY3", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY4", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY5", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY6", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY7", typeof(System.Boolean));
                dtCreate.Columns.Add("IsActive", typeof(System.String));
                dtCreate.Columns.Add("FirstLeg", typeof(System.Boolean));
                dtCreate.Columns.Add("IsCAO", typeof(System.String));
                dtCreate.Columns.Add("NoOfStop", typeof(System.String));
                dtCreate.Columns.Add("Routing", typeof(System.String));
                dtCreate.Columns.Add("SDDifference", typeof(System.String));
                dtCreate.Columns.Add("ALTCarrierCode", typeof(System.String));
                dtCreate.Columns.Add("ALTFlightNumber", typeof(System.String));
                dtCreate.Columns.Add("HdnDepartureSequence", typeof(System.String));
                //Values added for Aircraft Capacity by VSINGH 
                dtCreate.Columns.Add("IsCodeShare", typeof(System.Boolean));
                dtCreate.Columns.Add("CodeShareCarrierCode", typeof(System.String));
                dtCreate.Columns.Add("CodeShareFlightNumber", typeof(System.String));
                dtCreate.Columns.Add("CodeShareFlightNo", typeof(System.String));
                dtCreate.Columns.Add("OverBookingCapacity", typeof(System.Decimal));
                dtCreate.Columns.Add("FreeSaleCapacity", typeof(System.Decimal));

                dtCreate.Columns.Add("UM", typeof(System.Boolean));
                dtCreate.Columns.Add("OverBookingCapacityVol", typeof(System.Decimal));
                dtCreate.Columns.Add("FreeSaleCapacityVol", typeof(System.Decimal));
                dtCreate.Columns.Add("UMV", typeof(System.Int32));
                dtCreate.Columns.Add("ReservedCapacity", typeof(System.Decimal));
                dtCreate.Columns.Add("ReservedCapacityVol", typeof(System.Decimal));
                dtCreate.Columns.Add("LegId", typeof(System.Int32));
                dtCreate.Columns.Add("IsLeg", typeof(System.Boolean));
                dtCreate.Columns.Add("AddLegNo", typeof(System.Int32));
                dtCreate.Columns.Add("IsCharter", typeof(System.String));
                //Values added for Aircraft Capacity by VSINGH 
                for (int count = 1; count <= Convert.ToInt32(FormElement["tblScheduleTrans_rowOrder"].ToString().Split(',').Length); count++)
                {
                    string strIsCAO = "0";
                    //string strActive = "0";
                    if (FormElement["tblScheduleTrans_RbtnIsCAO_" + count.ToString()] != null)
                    {
                        strIsCAO = FormElement["tblScheduleTrans_RbtnIsCAO_" + count.ToString()].ToString();
                    }
                    string strIsCharter = "0";
                    if (FormElement["tblScheduleTrans_RbtnIsCharter_" + count.ToString()] != null)
                    {
                        strIsCharter = FormElement["tblScheduleTrans_RbtnIsCharter_" + count.ToString()].ToString();
                    }

                    //if (FormElement["tblScheduleTrans_RbtnIsActive_" + count.ToString()] != null)
                    //{
                    //    strActive = FormElement["tblScheduleTrans_RbtnIsActive_" + count.ToString()].ToString();
                    //}

                    DataRow dr = dtCreate.NewRow();
                    dr["SNo"] = 0;
                    dr["ScheduleSNo"] = 0;
                    dr["ScheduleType"] = FormElement["tblScheduleTrans_ScheduleType_" + count.ToString()].ToString();
                    dr["FlightNo"] = FormElement["Text_CarrierCode"].ToUpper().Trim() + "-" + FormElement["FlightNumber"].Trim() + FormElement["SingleAlpha"].ToUpper().Trim();// FormElement["tblScheduleTrans_FlightNo_" + count.ToString()].ToString();
                    dr["HdnOrigin"] = Convert.ToInt32(FormElement["tblScheduleTrans_HdnOrigin_" + count.ToString()].ToString());
                    dr["Origin"] = FormElement["tblScheduleTrans_Origin_" + count.ToString()].ToString();
                    dr["ETD"] = FormElement["tblScheduleTrans_ETD_" + count.ToString()].ToString().Insert(2, ":");
                    dr["HdnDestination"] = Convert.ToInt32(FormElement["tblScheduleTrans_HdnDestination_" + count.ToString()].ToString());
                    dr["Destination"] = FormElement["tblScheduleTrans_Destination_" + count.ToString()].ToString();
                    dr["ETA"] = FormElement["tblScheduleTrans_ETA_" + count.ToString()].ToString().Insert(2, ":");
                    dr["IsDayLightSaving"] = FormElement["tblScheduleTrans_RbtnDayLightSaving_" + count.ToString()].ToString();
                    dr["DayDifference"] = FormElement["tblScheduleTrans_DayDifference_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_DayDifference_" + count.ToString()].ToString();

                    dr["StartDate"] = FormElement["tblScheduleTrans_StartDate_" + count.ToString()].ToString();
                    dr["EndDate"] = FormElement["tblScheduleTrans_EndDate_" + count.ToString()].ToString();
                    dr["HdnAirCraft"] = FormElement["tblScheduleTrans_HdnAirCraft_" + count.ToString()].ToString();
                    dr["AirCraft"] = FormElement["tblScheduleTrans_AirCraft_" + count.ToString()].ToString();
                    dr["HdnFlightType"] = FormElement["tblScheduleTrans_HdnFlightType_" + count.ToString()].ToString();
                    dr["FlightType"] = FormElement["tblScheduleTrans_FlightType_" + count.ToString()].ToString();
                    dr["AllocatedGrossWeight"] = FormElement["tblScheduleTrans_AllocatedGrossWeight_" + count.ToString()].ToString();
                    dr["AllocatedVolumeWeight"] = FormElement["tblScheduleTrans_AllocatedVolumeWeight_" + count.ToString()].ToString();
                    dr["MaxGrossPerPcs"] = FormElement["tblScheduleTrans_MaxGrossPerPcs_" + count.ToString()].ToString();
                    dr["MaxVolumePerPcs"] = FormElement["tblScheduleTrans_MaxVolumePerPcs_" + count.ToString()].ToString();
                    dr["AllDays"] = FormElement["tblScheduleTrans_AllDays_" + count.ToString()] == null ? false : true;
                    dr["DAY1"] = FormElement["tblScheduleTrans_Day1_" + count.ToString()] == null ? false : true;
                    dr["DAY2"] = FormElement["tblScheduleTrans_Day2_" + count.ToString()] == null ? false : true;
                    dr["DAY3"] = FormElement["tblScheduleTrans_Day3_" + count.ToString()] == null ? false : true;
                    dr["DAY4"] = FormElement["tblScheduleTrans_Day4_" + count.ToString()] == null ? false : true;
                    dr["DAY5"] = FormElement["tblScheduleTrans_Day5_" + count.ToString()] == null ? false : true;
                    dr["DAY6"] = FormElement["tblScheduleTrans_Day6_" + count.ToString()] == null ? false : true;
                    dr["DAY7"] = FormElement["tblScheduleTrans_Day7_" + count.ToString()] == null ? false : true;
                    dr["IsActive"] = FormElement["IsActive"] == "0"; //strActive;
                    dr["FirstLeg"] = false; //FormElement["tblScheduleTrans_FirstLeg_" + count.ToString()] == null ? false : true;

                    dr["IsCAO"] = strIsCAO;
                    dr["IsCharter"] = strIsCharter;
                    dr["NoOfStop"] = "";//FormElement["tblScheduleTrans_NoOfStop_" + count.ToString()];

                    dr["Routing"] = FormElement["tblScheduleTrans_Routing_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_Routing_" + count.ToString()].ToString();
                    dr["SDDifference"] = FormElement["tblScheduleTrans_SDDifference_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_SDDifference_" + count.ToString()].ToString();
                    dr["ALTCarrierCode"] = FormElement["Text_CarrierCode"].ToUpper().Trim();
                        //FormElement["tblScheduleTrans_ALTCarrierCode_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_ALTCarrierCode_" + count.ToString()].ToString();
                    dr["ALTFlightNumber"] = FormElement["tblScheduleTrans_FlightNo_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_FlightNo_" + count.ToString()].ToString();
                    dr["HdnDepartureSequence"] = FormElement["tblScheduleTrans_HdnDepartureSequence_" + count.ToString()].ToString();

                    //Values added for Aircraft Capacity by VSINGH 
                  bool value=FormElement["tblScheduleTrans_IsCodeShare_" + count.ToString()] == null ? false : true;
                  if (value == false)
                  {
                      dr["IsCodeShare"] = false;
                      dr["CodeShareCarrierCode"] = "";
                      dr["CodeShareFlightNumber"] = "";
                      dr["CodeShareFlightNo"] = "";
                  }
                  else
                  {
                      dr["IsCodeShare"] = true;
                      dr["CodeShareCarrierCode"] = FormElement["tblScheduleTrans_CodeShareCarrierCode_" + count.ToString()].ToString();
                      dr["CodeShareFlightNumber"] = FormElement["tblScheduleTrans_CodeShareFlightNumber_" + count.ToString()].ToString();
                      dr["CodeShareFlightNo"] = FormElement["tblScheduleTrans_CodeShareCarrierCode_" + count.ToString()].ToString() + "-" + FormElement["tblScheduleTrans_CodeShareFlightNumber_" + count.ToString()].ToString();
                  }
                     // dr["OverBookingCapacity"] =0;
                    //  dr["FreeSaleCapacity"] = 0;
                    dr["OverBookingCapacity"] =  FormElement["tblScheduleTrans_OverBookingCapacity_" + count.ToString()];
                    dr["FreeSaleCapacity"] = FormElement["tblScheduleTrans_FreeSaleCapacity_" + count.ToString()];
                    dr["UM"] = FormElement["tblScheduleTrans_HdnUMG_" + count.ToString()].ToUpper() == "K" ? 0 : 1;
                    dr["OverBookingCapacityVol"] = FormElement["tblScheduleTrans_OverBookingCapacityVol_" + count.ToString()];
                    dr["FreeSaleCapacityVol"] = FormElement["tblScheduleTrans_FreeSaleCapacityVol_" + count.ToString()];
                    dr["UMV"] = FormElement["tblScheduleTrans_HdnUMV_" + count.ToString()]=="CBM" ? 2 : 1;
                    dr["ReservedCapacity"] = FormElement["tblScheduleTrans_ReservedCapacity_" + count.ToString()];
                    dr["ReservedCapacityVol"] = FormElement["tblScheduleTrans_ReservedCapacityVol_" + count.ToString()];
                    dr["LegId"] = FormElement["tblScheduleTrans_HdnLegId_" + count.ToString()];
                    dr["IsLeg"] = FormElement["tblScheduleTrans_HdnIsLeg_" + count.ToString()]=="1";
                    dr["AddLegNo"]= FormElement["tblScheduleTrans_AddLegNo_" + count.ToString()];
                    //Values added for Aircraft Capacity by VSINGH 
                    dtCreate.Rows.Add(dr);
                    dtCreate.AcceptChanges();
                }


                var ScheduleDetail = new CargoFlash.Cargo.Model.Schedule.ScheduleDetails
                {
                    //SNo =  0,
                    ScheduleType = Int32.TryParse(FormElement["ScheduleType"], out number) ? number : 0,
                    AirlineSNo = Int32.TryParse(FormElement["CarrierCode"].Split('-')[0], out number) ? number : 0,
                    AWBCode = FormElement["CarrierCode"].Split('-')[1],
                    FromDate = FormElement["FStartDate"].ToString(),
                    ToDate = FormElement["FEndDate"].ToString(),
                    CarrierCode = FormElement["CarrierCode"].ToUpper(),// NOT NULL,
                    Text_CarrierCode = FormElement["Text_CarrierCode"].ToUpper(),// NOT NULL,
                    FlightNumber = FormElement["FlightNumber"],
                    FlightNo = FormElement["Text_CarrierCode"].ToUpper() + "-" + FormElement["FlightNumber"] + FormElement["SingleAlpha"].ToUpper(),
                    OperatedasTruck = FormElement["OperatedasTruck"] == null ? false : true,
                    Origin = Int32.TryParse(FormElement["Origin"], out number) ? number : 0,
                    Text_Origin = FormElement["Text_Origin"].ToUpper(),// NOT NULL,
                    Destination = Int32.TryParse(FormElement["Destination"], out number) ? number : 0,
                    Text_Destination = FormElement["Text_Destination"].ToUpper(),// NOT NULL,
                    Routing = FormElement["Multi_ViaRoute"].ToString(),
                    TextRouting = FormElement["hdnTextViaRoute"].ToString(),
                    IsCAO = true,
                    CAO = "Yes",
                    IsActive = FormElement["IsActive"] == "0",
                    Active = FormElement["IsActive"] == "0" ? "Yes" : "No",
                    IsSch = FormElement["IsSch"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    dt = dtCreate,
                    PreAlertDate = FormElement["PreAlertDate"].ToString(),
                    PreAlertTime = FormElement["PreAlertTime"].ToString()

                };
                listScheduleDetail.Add(ScheduleDetail);
                object datalist = (object)listScheduleDetail;


                DataOperationService(DisplayModeSave, datalist, MyModuleID);
                {
                    //string ERROR = ErrorMessage;
                    //List<string> ERR = ErrorMessageList;

                    //if(ERR.Count > 0 && ERR[0].Contains("SAVE~~SAVE") == true)
                    //{
                    //    str = ERR[0].Remove(0, 10);
                    //}
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return str;
        }
        /// <summary>
        /// Update Schedule record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="SrNo">Key column/attribute value which touple has be updated</param>
        private void UpdateSchedule(string SrNo)
        {

            try
            {
                int number = 0;
                List<CargoFlash.Cargo.Model.Schedule.ScheduleDetails> listScheduleDetail = new List<CargoFlash.Cargo.Model.Schedule.ScheduleDetails>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                System.Data.DataTable dtCreate = new System.Data.DataTable();
                dtCreate.TableName = "SchTrans";
                dtCreate.Columns.Add("SNo", typeof(System.Int32));
                dtCreate.Columns.Add("ScheduleSNo", typeof(System.Int32));
                dtCreate.Columns.Add("ScheduleType", typeof(System.String));
                dtCreate.Columns.Add("FlightNo", typeof(System.String));
                dtCreate.Columns.Add("HdnOrigin", typeof(System.Int32));
                dtCreate.Columns.Add("Origin", typeof(System.String));
                dtCreate.Columns.Add("ETD", typeof(System.String));
                dtCreate.Columns.Add("HdnDestination", typeof(System.Int32));
                dtCreate.Columns.Add("Destination", typeof(System.String));
                dtCreate.Columns.Add("ETA", typeof(System.String));
                dtCreate.Columns.Add("IsDayLightSaving", typeof(System.String));
                dtCreate.Columns.Add("DayDifference", typeof(System.String));

                dtCreate.Columns.Add("StartDate", typeof(System.String));
                dtCreate.Columns.Add("EndDate", typeof(System.String));
                dtCreate.Columns.Add("HdnAirCraft", typeof(System.String));
                dtCreate.Columns.Add("AirCraft", typeof(System.String));
                dtCreate.Columns.Add("HdnFlightType", typeof(System.String));
                dtCreate.Columns.Add("FlightType", typeof(System.String));
                dtCreate.Columns.Add("AllocatedGrossWeight", typeof(System.String));
                dtCreate.Columns.Add("AllocatedVolumeWeight", typeof(System.String));
                dtCreate.Columns.Add("MaxGrossPerPcs", typeof(System.String));
                dtCreate.Columns.Add("MaxVolumePerPcs", typeof(System.String));
                dtCreate.Columns.Add("AllDays", typeof(System.String));
                dtCreate.Columns.Add("DAY1", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY2", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY3", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY4", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY5", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY6", typeof(System.Boolean));
                dtCreate.Columns.Add("DAY7", typeof(System.Boolean));
                dtCreate.Columns.Add("IsActive", typeof(System.String));
                dtCreate.Columns.Add("FirstLeg", typeof(System.Boolean));
                dtCreate.Columns.Add("IsCAO", typeof(System.String));
                dtCreate.Columns.Add("NoOfStop", typeof(System.String));
                dtCreate.Columns.Add("Routing", typeof(System.String));
                dtCreate.Columns.Add("SDDifference", typeof(System.String));
                dtCreate.Columns.Add("ALTCarrierCode", typeof(System.String));
                dtCreate.Columns.Add("ALTFlightNumber", typeof(System.String));
                dtCreate.Columns.Add("HdnDepartureSequence", typeof(System.String));
                //Values added for Aircraft Capacity by VSINGH 
                dtCreate.Columns.Add("IsCodeShare", typeof(System.Boolean));
                dtCreate.Columns.Add("CodeShareCarrierCode", typeof(System.String));
                dtCreate.Columns.Add("CodeShareFlightNumber", typeof(System.String));
                dtCreate.Columns.Add("CodeShareFlightNo", typeof(System.String));
                dtCreate.Columns.Add("OverBookingCapacity", typeof(System.Decimal));
                dtCreate.Columns.Add("FreeSaleCapacity", typeof(System.Decimal));

                dtCreate.Columns.Add("UM", typeof(System.Boolean));
                dtCreate.Columns.Add("OverBookingCapacityVol", typeof(System.Decimal));
                dtCreate.Columns.Add("FreeSaleCapacityVol", typeof(System.Decimal));
                dtCreate.Columns.Add("UMV", typeof(System.Int32));
                dtCreate.Columns.Add("ReservedCapacity", typeof(System.Decimal));
                dtCreate.Columns.Add("ReservedCapacityVol", typeof(System.Decimal));
                dtCreate.Columns.Add("LegId", typeof(System.Int32));
                dtCreate.Columns.Add("IsLeg", typeof(System.Boolean));
                dtCreate.Columns.Add("AddLegNo", typeof(System.Int32));
                dtCreate.Columns.Add("IsCharter", typeof(System.String));
                //Values added for Aircraft Capacity by VSINGH 
                for (int count = 1; count <= Convert.ToInt32(FormElement["tblScheduleTrans_rowOrder"].ToString().Split(',').Length); count++)
                {
                    string strIsCAO = "0";
                   // string strActive = "0";
                    if (FormElement["tblScheduleTrans_RbtnIsCAO_" + count.ToString()] != null)
                    {
                        strIsCAO = FormElement["tblScheduleTrans_RbtnIsCAO_" + count.ToString()].ToString();
                    }
                    string strIsCharter = "0";
                    if (FormElement["tblScheduleTrans_RbtnIsCharter_" + count.ToString()] != null)
                    {
                        strIsCharter = FormElement["tblScheduleTrans_RbtnIsCharter_" + count.ToString()].ToString();
                    }
                    //if (FormElement["tblScheduleTrans_RbtnIsActive_" + count.ToString()] != null)
                    //{
                    //    strActive = FormElement["tblScheduleTrans_RbtnIsActive_" + count.ToString()].ToString();
                    //}

                    DataRow dr = dtCreate.NewRow();
                    dr["SNo"] = FormElement["tblScheduleTrans_SNo_" + count.ToString()];
                    dr["ScheduleSNo"] = FormElement["hdnScheduleSNo"];
                    dr["ScheduleType"] = FormElement["tblScheduleTrans_ScheduleType_" + count.ToString()].ToString();
                    dr["FlightNo"] = FormElement["Text_CarrierCode"].ToUpper().Trim() + "-" + FormElement["FlightNumber"].Trim() + FormElement["SingleAlpha"].ToUpper().Trim();// FormElement["tblScheduleTrans_FlightNo_" + count.ToString()].ToString();
                    dr["HdnOrigin"] = int.Parse(FormElement["tblScheduleTrans_HdnOrigin_" + count.ToString()].ToString());
                    dr["Origin"] = FormElement["tblScheduleTrans_Origin_" + count.ToString()].ToString();
                    dr["ETD"] = FormElement["tblScheduleTrans_ETD_" + count.ToString()].ToString().Insert(2, ":");
                    dr["HdnDestination"] = int.Parse(FormElement["tblScheduleTrans_HdnDestination_" + count.ToString()].ToString());
                    dr["Destination"] = FormElement["tblScheduleTrans_Destination_" + count.ToString()].ToString();
                    dr["ETA"] = FormElement["tblScheduleTrans_ETA_" + count.ToString()].ToString().Insert(2, ":");
                    dr["IsDayLightSaving"] = FormElement["tblScheduleTrans_RbtnIsDayLightSaving_" + count.ToString()].ToString();
                    dr["DayDifference"] = FormElement["tblScheduleTrans_DayDifference_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_DayDifference_" + count.ToString()].ToString();

                    dr["StartDate"] = FormElement["tblScheduleTrans_StartDate_" + count.ToString()].ToString();
                    dr["EndDate"] = FormElement["tblScheduleTrans_EndDate_" + count.ToString()].ToString();
                    dr["HdnAirCraft"] = FormElement["tblScheduleTrans_HdnAirCraft_" + count.ToString()].ToString();
                    dr["AirCraft"] = FormElement["tblScheduleTrans_AirCraft_" + count.ToString()].ToString();
                    dr["HdnFlightType"] = FormElement["tblScheduleTrans_HdnFlightType_" + count.ToString()].ToString();
                    dr["FlightType"] = FormElement["tblScheduleTrans_FlightType_" + count.ToString()].ToString();
                    dr["AllocatedGrossWeight"] = FormElement["tblScheduleTrans_AllocatedGrossWeight_" + count.ToString()].ToString();
                    dr["AllocatedVolumeWeight"] = FormElement["tblScheduleTrans_AllocatedVolumeWeight_" + count.ToString()].ToString();
                    dr["MaxGrossPerPcs"] = FormElement["tblScheduleTrans_MaxGrossPerPcs_" + count.ToString()].ToString();
                    dr["MaxVolumePerPcs"] = FormElement["tblScheduleTrans_MaxVolumePerPcs_" + count.ToString()].ToString();
                    dr["AllDays"] = FormElement["tblScheduleTrans_AllDays_" + count.ToString()] == null ? false : true;
                    dr["DAY1"] = FormElement["tblScheduleTrans_Day1_" + count.ToString()] == null ? false : true;
                    dr["DAY2"] = FormElement["tblScheduleTrans_Day2_" + count.ToString()] == null ? false : true;
                    dr["DAY3"] = FormElement["tblScheduleTrans_Day3_" + count.ToString()] == null ? false : true;
                    dr["DAY4"] = FormElement["tblScheduleTrans_Day4_" + count.ToString()] == null ? false : true;
                    dr["DAY5"] = FormElement["tblScheduleTrans_Day5_" + count.ToString()] == null ? false : true;
                    dr["DAY6"] = FormElement["tblScheduleTrans_Day6_" + count.ToString()] == null ? false : true;
                    dr["DAY7"] = FormElement["tblScheduleTrans_Day7_" + count.ToString()] == null ? false : true;
                    dr["IsActive"] = FormElement["IsActive"] == "0"; //strActive;
                    dr["FirstLeg"] = false;//FormElement["tblScheduleTrans_FirstLeg_" + count.ToString()] == null ? false : true;

                    dr["IsCAO"] = strIsCAO;
                    dr["IsCharter"] = strIsCharter;
                    dr["NoOfStop"] = "";//FormElement["tblScheduleTrans_NoOfStop_" + count.ToString()];

                    dr["Routing"] = FormElement["tblScheduleTrans_Routing_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_Routing_" + count.ToString()].ToString();
                    dr["SDDifference"] = FormElement["tblScheduleTrans_SDDifference_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_SDDifference_" + count.ToString()].ToString();
                    dr["ALTCarrierCode"] = FormElement["Text_CarrierCode"].ToUpper().Trim();
                        //FormElement["tblScheduleTrans_ALTCarrierCode_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_ALTCarrierCode_" + count.ToString()].ToString();
                    dr["ALTFlightNumber"] = FormElement["tblScheduleTrans_FlightNo_" + count.ToString()] == null ? "0" : FormElement["tblScheduleTrans_FlightNo_" + count.ToString()].ToString();
                    dr["HdnDepartureSequence"] = FormElement["tblScheduleTrans_HdnDepartureSequence_" + count.ToString()].ToString();

                    //Values added for Aircraft Capacity by VSINGH 
                    bool value = FormElement["tblScheduleTrans_IsCodeShare_" + count.ToString()] == null ? false : true;
                    if (value == false)
                    {
                        dr["IsCodeShare"] = false;
                        dr["CodeShareCarrierCode"] = "";
                        dr["CodeShareFlightNumber"] = "";
                        dr["CodeShareFlightNo"] = "";
                    }
                    else
                    {
                        dr["IsCodeShare"] = true;
                        dr["CodeShareCarrierCode"] = FormElement["tblScheduleTrans_CodeShareCarrierCode_" + count.ToString()].ToString();
                        dr["CodeShareFlightNumber"] = FormElement["tblScheduleTrans_CodeShareFlightNumber_" + count.ToString()].ToString();
                        dr["CodeShareFlightNo"] = FormElement["tblScheduleTrans_CodeShareCarrierCode_" + count.ToString()].ToString() + "-" + FormElement["tblScheduleTrans_CodeShareFlightNumber_" + count.ToString()].ToString();
                    }
                    // dr["OverBookingCapacity"] =0;
                    //  dr["FreeSaleCapacity"] = 0;
                    dr["OverBookingCapacity"] = FormElement["tblScheduleTrans_OverBookingCapacity_" + count.ToString()];
                    dr["FreeSaleCapacity"] = FormElement["tblScheduleTrans_FreeSaleCapacity_" + count.ToString()];
                    dr["UM"] = FormElement["tblScheduleTrans_HdnUMG_" + count.ToString()].ToUpper() == "K" ? 0 : 1;
                    dr["OverBookingCapacityVol"] = FormElement["tblScheduleTrans_OverBookingCapacityVol_" + count.ToString()];
                    dr["FreeSaleCapacityVol"] = FormElement["tblScheduleTrans_FreeSaleCapacityVol_" + count.ToString()];
                    dr["UMV"] = FormElement["tblScheduleTrans_HdnUMV_" + count.ToString()] == "CBM" ? 2 : 1;
                    dr["ReservedCapacity"] = FormElement["tblScheduleTrans_ReservedCapacity_" + count.ToString()];
                    dr["ReservedCapacityVol"] = FormElement["tblScheduleTrans_ReservedCapacityVol_" + count.ToString()];
                    dr["LegId"] = FormElement["tblScheduleTrans_HdnLegId_" + count.ToString()];
                    dr["IsLeg"] = FormElement["tblScheduleTrans_HdnIsLeg_" + count.ToString()] == "1";
                    dr["AddLegNo"] = FormElement["tblScheduleTrans_AddLegNo_" + count.ToString()];
                    //Values added for Aircraft Capacity by VSINGH 
                    dtCreate.Rows.Add(dr);
                    dtCreate.AcceptChanges();
                }


                var ScheduleDetail = new CargoFlash.Cargo.Model.Schedule.ScheduleDetails
                {
                    SNo = int.Parse(SrNo),
                    ScheduleType =0, //Int32.TryParse(FormElement["ScheduleType"], out number) ? number : 0,
                    AirlineSNo = 0, //Int32.TryParse(FormElement["CarrierCode"].Split('-')[0], out number) ? number : 0,
                    AWBCode = "",// FormElement["CarrierCode"].Split('-')[1],
                    FromDate = FormElement["FStartDate"].ToString(),
                    ToDate = FormElement["FEndDate"].ToString(),
                    CarrierCode = FormElement["Text_CarrierCode"].ToUpper().Trim(),// NOT NULL,
                    Text_CarrierCode = FormElement["Text_CarrierCode"].ToUpper().Trim(),// NOT NULL,
                    FlightNumber = FormElement["FlightNumber"],
                    FlightNo = FormElement["Text_CarrierCode"].ToUpper().Trim() + "-" + FormElement["FlightNumber"].Trim() + FormElement["SingleAlpha"].ToUpper().Trim(),
                    OperatedasTruck = false,//FormElement["OperatedasTruck"] == null ? false : true,
                    Origin =  0, //Int32.TryParse(FormElement["Origin"], out number) ? number : 0,
                    Text_Origin = "",//FormElement["Text_Origin"].ToUpper(),// NOT NULL,
                    Destination =0, //Int32.TryParse(FormElement["Destination"], out number) ? number : 0,
                    Text_Destination ="",  //FormElement["Text_Destination"].ToUpper(),// NOT NULL,
                    Routing = "",//FormElement["Multi_ViaRoute"].ToString(),
                    TextRouting = "",//FormElement["hdnTextViaRoute"].ToString(),
                    IsCAO = true,
                    CAO = "Yes",
                    IsActive = FormElement["IsActive"] == "0",
                    Active = FormElement["IsActive"] == "0" ? "Yes" : "No",
                    //IsSch = FormElement["IsSch"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    dt = dtCreate,
                    PreAlertDate = FormElement["PreAlertDate"].ToString(),
                    PreAlertTime = FormElement["PreAlertTime"].ToString()

                };
                listScheduleDetail.Add(ScheduleDetail);
                object datalist = (object)listScheduleDetail;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {
                    //string ERROR = ErrorMessage;
                }
            }
            
            //try
            //{
            //    int number = 0;
            //    List<CargoFlash.Cargo.Model.Schedule.Schedule> listSchedule = new List<CargoFlash.Cargo.Model.Schedule.Schedule>();
            //    var FormElement = System.Web.HttpContext.Current.Request.Form;
            //    var Schedule = new CargoFlash.Cargo.Model.Schedule.Schedule
            //    {
            //        SNo = Int32.TryParse(SrNo, out number) ? number : 0,
            //        ScheduleType = Int32.TryParse(FormElement["ScheduleType"], out number) ? number : 0,
            //        AirlineSNo = Int32.TryParse(FormElement["CarrierCode"].Split('-')[0], out number) ? number : 0,
            //        AWBCode = FormElement["CarrierCode"].Split('-')[1],
            //        CarrierCode = FormElement["CarrierCode"].ToUpper(),// NOT NULL,
            //        Text_CarrierCode = FormElement["Text_CarrierCode"].ToUpper(),// NOT NULL,
            //        FlightNumber = FormElement["FlightNumber"],
            //        OperatedasTruck = FormElement["OperatedasTruck"] == null ? false : true,
            //        FlightNo = FormElement["Text_CarrierCode"].ToUpper() + "-" + FormElement["FlightNumber"] + FormElement["SingleAlpha"].ToUpper(),//FormElement["Text_CarrierCode"].ToUpper() + "-" + FormElement["FlightNumber"],
            //        Origin = Int32.TryParse(FormElement["Origin"], out number) ? number : 0,
            //        Text_Origin = FormElement["Text_Origin"].ToUpper(),// NOT NULL,
            //        Destination = Int32.TryParse(FormElement["Destination"], out number) ? number : 0,
            //        Text_Destination = FormElement["Text_Destination"].ToUpper(),// NOT NULL,
            //        IsCAO = true,
            //        CAO = "Yes",
            //        IsActive = FormElement["IsActive"] == "0",
            //        Active = FormElement["IsActive"] == "0" ? "Yes" : "No",
            //        IsSch = FormElement["IsSch"] == "0",
            //        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
            //        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
            //    };
            //    listSchedule.Add(Schedule);
            //    object datalist = (object)listSchedule;
            //    DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            //    {
            //        //ErrorNumer
            //        //Error Message
            //    }
            //}
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }
        /// <summary>
        /// Delete Schedule record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="SrNo"></param>
        private void DeleteSchedule(string SrNo)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(SrNo);
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
            }
        }
        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            try
            {

                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        this.MyRecordID = SaveSchedule();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", true, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveSchedule();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:

                        UpdateSchedule(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteSchedule(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
    }
}
