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
    public class ULDSLACalendarManagementWebUI : BaseWebUISecureObject
    {
        public object GetULDSLACalendarRecord()
        {
            object ULDSLACalendar = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["recid"]))
                {
                    ULDSLACalendar ULDSLACalendars = new ULDSLACalendar();
                    object obj = (object)ULDSLACalendars;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    ULDSLACalendar = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["recid"], obj, this.MyModuleID, "", "", qString);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["recid"]);
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
            return ULDSLACalendar;
        }
        public ULDSLACalendarManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDSLACalendar";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public ULDSLACalendarManagementWebUI(Page PageContext)
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
                this.MyAppID = "ULDSLACalendar";
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
                    htmlFormAdapter.HeadingColumnName = "ULDSLACalendar";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetULDSLACalendarRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(ULDSLACalendarTransTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetULDSLACalendarRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetULDSLACalendarRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(ULDSLACalendarTransTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(ULDSLACalendarTransTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetULDSLACalendarRecord();
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
                            CreateGrid(container);
                            break;
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
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
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.CommandButtonNewText = "New Calendar";
                    g.FormCaptionText = "ULD Calendar";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "CalendarName", Title = "Calendar Name", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "CalendarDesc", Title = "Calendar Description", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "Year", Title = "Year", DataType = GridDataType.String.ToString()});
                    g.Column.Add(new GridColumn { Field = "StartDate", Title = "Start Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EndDate", Title = "End Date", DataType = GridDataType.String.ToString() });
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
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveULDSLACalendar();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveULDSLACalendar();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateULDSLACalendar(System.Web.HttpContext.Current.Request.QueryString["recid"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteULDSLACalendar(System.Web.HttpContext.Current.Request.QueryString["recid"]);
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
        private void SaveULDSLACalendar()
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                List<ULDSLACalendar> listULDSLACalendar = new List<ULDSLACalendar>();

                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ULDSLACalendar = new ULDSLACalendar
                    {
                        CalendarName = FormElement["CalendarName"],
                        CalendarDesc = FormElement["CalendarDesc"],
                        StartDate = FormElement["StartDate"],
                        EndDate = FormElement["EndDate"],
                        Cityname = FormElement["Cityname"] == "" ? "0" : FormElement["Cityname"],
                        countryname = Convert.ToInt32(FormElement["countryname"]),
                        IsActive = Convert.ToInt32(FormElement["IsActive"]),
                        CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                    };
                    listULDSLACalendar.Add(ULDSLACalendar);
                
                object datalist = (object)listULDSLACalendar;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);

            }
              catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        private void UpdateULDSLACalendar(string RecordID)
        {
            try
            {
                List<ULDSLACalendar> listULDSLACalendar = new List<ULDSLACalendar>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ULDSLACalendar = new ULDSLACalendar
                {
                    SNo = Convert.ToInt32(RecordID),
                    CalendarName = FormElement["CalendarName"],
                    CalendarDesc = FormElement["CalendarDesc"],
                    StartDate = FormElement["StartDate"],
                    EndDate = FormElement["EndDate"],
                    Cityname = FormElement["Cityname"],
                    countryname = Convert.ToInt32(FormElement["countryname"]),
                    IsActive = Convert.ToInt32(FormElement["IsActive"]),
                    UpdatedBy=Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                };
                listULDSLACalendar.Add(ULDSLACalendar);
                object datalist = (object)listULDSLACalendar;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
        private void DeleteULDSLACalendar(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
        private StringBuilder ULDSLACalendarTransTab(StringBuilder container)
        {
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liCalendarDetails' style='color: #7401DF' class='k-state-active'>Calendar Details</li>
                <li id='liWeekOffDetails' style='color: #7401DF' onclick='WeekOffDetailsTab();'>Week Off Details</li>
                <li id='liHolidayDetails' style='color: #7401DF' onclick='HolidayDetailsTab();'>Holiday Details</li>
                <li id='liCustom' style='color: #7401DF' onclick='CustomTab();'>Custom</li>
            </ul>
            <div id='ApplicationTabs-1'>");
            strBuilder.Append(container);
            strBuilder.Append(@"
            </div>
            <div id='ApplicationTabs-2'>
                                                        <table id='tblAirlineCCTrans' width='100%'></table>
             </div>
                    <div id='ApplicationTabs-3'>
                            <table id='tblAirlinePartTrans' width='100%'></table>
             </div>
                            <div id='ApplicationTabs-4'>
                <table id='tblEventMsgTrans' width='100%'></table>
             </div>
                        <div id='ApplicationTabs-5'>
                <table id='tblRecipientMessageTrans' width='100%'></table>
             </div>
                                <input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirlineSNo' name='hdnAirlineSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='NEW'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/></div></div>");

            return strBuilder;

        }
    }
}
