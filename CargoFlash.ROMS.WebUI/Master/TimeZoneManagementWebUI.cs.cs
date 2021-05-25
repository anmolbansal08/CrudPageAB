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
using CargoFlash.Cargo.Model.Master;
using System.Collections;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Master
{
    /// <summary>
    /// This is Term and Condition Class, its Used for CRUD Application.
    /// Created By : Adil Rasheed
    /// Created On : 29 APR 2013
    /// Approved By : Manish Kumar
    /// </summary>
    public class TimeZoneManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public object GetRecordTimeZone()
        {
            object TimeZone = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Timezone TimeZoneList = new Timezone();
                    object obj = (object)TimeZoneList;
                    //retrieve Entity from database according to the record
                    TimeZone = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);

                }
                else
                {
                    //ErrorMessage: Record not found.

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

            return TimeZone;
        }
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID and PrimaryID
        /// </summary>
        public TimeZoneManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "TimeZone";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationwebUI = new ApplicationWebUI();
                applicationwebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationwebUI.ErrorMessage;
            }

        }
        /// <summary>
        ///  Set context of the page(Form) i.e. bind Module ID,App ID,PageName and PrimaryID
        /// </summary>
        /// <param name="PageContext"></param>
        public TimeZoneManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {

                    this.MyPrimaryID = "SNo";
                    this.MyPageName = "Default.aspx";
                    this.MyModuleID = "Master";
                    this.MyAppID = "TimeZone";

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
        /// Generate Account web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionAirlineTimeZone.xml
        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        /// 
        public StringBuilder CreateWebForm(StringBuilder container)
        {
             StringBuilder strContent = new StringBuilder();
            try
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
        /// <returns></returns>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Time Zone";
                    g.FormCaptionText = "Time Zone";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsShowEdit = false;
                    g.IsShowDelete = false;
                        
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn
                    {
                        Field = "StandardName",
                        Title = "Standard Name",
                        DataType = GridDataType.String.ToString(),
                        IsGroupable = false
                      //  FooterTemplate = "Total Standard Name : <b>#=count#</b>"
                    });
                    g.Column.Add(new GridColumn { Field = "GMT", Title = "GMT", DataType = GridDataType.String.ToString() });

                 
                    //g.Aggregate = new List<GridAggregate>();
                    //g.Aggregate.Add(new GridAggregate { Field = "StandardName", Aggregate = "count" });
                   // g.Action = new List<GridAction>();
                    //g.Action.Add(new GridAction { ActionName = "READ", AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });
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
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container"></param>
        /// <returns></returns>
        /// 


        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "ZoneName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        htmlFormAdapter.objFormData = GetTimeZoneRecored();
                        htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                        htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                        htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        //htmlFormAdapter.objFormData = null;
                        //htmlFormAdapter.objDataTable = GetTimeZoneTransRecord();
                        //container.Append(htmlFormAdapter.TransInstantiateWithHeader(MyModuleID, "TimeZoneTrans", "READ"));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetTimeZoneRecored();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                        htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                        htmlFormAdapter.objFormData = GetTimeZoneRecored();
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                     //   htmlFormAdapter.objFormData = null;
                     //htmlFormAdapter.objDataTable = GetTimeZoneTransRecord();
                     //   container.Append(htmlFormAdapter.TransInstantiateWithHeader(MyModuleID, "TimeZoneTrans", "EDIT", ValidateOnSubmit: true));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                        //    htmlFormAdapter.objFormData = GetTimeZoneRecored();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
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

            container.Append("<input id='hdnTimeSoneSNo' name='hdnTimeSoneSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblTimeZoneTrans' width='100%'></table>");
            return container;
        }


        //public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        //{
        //    using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
        //    {
        //        htmlFormAdapter.CurrentPage = this.CurrentPageContext;
        //        htmlFormAdapter.HeadingColumnName = "";
        //        switch (DisplayMode)
        //        {
        //            case DisplayModeReadView:
        //                htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
        //                htmlFormAdapter.objFormData = GetTimeZoneRecored();
        //                htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
        //                htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
        //                htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
        //                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                container.Append(htmlFormAdapter.InstantiateIn());
        //                htmlFormAdapter.objFormData = null;
        //                htmlFormAdapter.objDataTable = GetTimeZoneTransRecord();
        //                container.Append(htmlFormAdapter.TransInstantiateWithHeader(MyModuleID, "TimeZoneTrans", "READ"));
        //                break;
        //            case DisplayModeDuplicate:
        //                htmlFormAdapter.DisplayMode = DisplayModeType.New;
        //                htmlFormAdapter.objFormData = GetTimeZoneRecored();
        //                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                container.Append(htmlFormAdapter.InstantiateIn());
        //                htmlFormAdapter.objFormData = null;
        //                htmlFormAdapter.objDataTable = GetTimeZoneTransRecord();
        //                container.Append(htmlFormAdapter.TransInstantiateWithHeader(MyModuleID, "TimeZoneTrans", ValidateOnSubmit: true));

        //                //htmlFormAdapter.DisplayMode = DisplayModeType.New;
        //                //htmlFormAdapter.objFormData = GetTimeZoneRecored();
        //                //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                //container.Append(htmlFormAdapter.InstantiateIn());
        //                break;
        //            case DisplayModeEdit:
        //                htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
        //                htmlFormAdapter.objFormData = GetTimeZoneRecored();
        //                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                container.Append(htmlFormAdapter.InstantiateIn());
        //                htmlFormAdapter.objFormData = null;
        //                htmlFormAdapter.objDataTable = GetTimeZoneTransRecord();
        //                container.Append(htmlFormAdapter.TransInstantiateWithHeader(MyModuleID, "TimeZoneTrans", "EDIT", ValidateOnSubmit: true));
        //                break;
        //            case DisplayModeNew:
        //                htmlFormAdapter.DisplayMode = DisplayModeType.New;
        //                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                container.Append(htmlFormAdapter.InstantiateIn());
        //                container.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "TimeZoneTrans", ValidateOnSubmit: true));
        //                break;
        //            case DisplayModeDelete:
        //                htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
        //                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                htmlFormAdapter.objFormData = GetTimeZoneRecored();
        //                container.Append(htmlFormAdapter.InstantiateIn());
        //                break;
        //            default:
        //                break;
        //        }
        //    }

        //    return container;
        //}
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
                      //  SaveAirlineTimeZone();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                     //   SaveAirlineTimeZone();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                   //     UpdateAirlineTimeZone(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                   //     DeleteAirlineTimeZone(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        /// <summary>
        /// Insert new AirlineTimeZone record into the database
        /// Retrieve information from webform and store the same into modal object 
        /// call webservice to save that data into the database
        /// </summary>
        //private void SaveAirlineTimeZone()
        //{
        //    try
        //    {
        //        List<AirlineTimeZone> listAirlineTimeZone = new List<AirlineTimeZone>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        int number = 0;
        //        string val = string.Empty;
        //        var AirlineTimeZone = new AirlineTimeZone
        //        {
        //            TimeZoneName = FormElement["TimeZoneName"],
        //            TimeDifference = Int32.TryParse(FormElement["TimeDifference"], out number) ? number : 0,
        //            prefix = FormElement["Prefix"],
        //            Hour = Int32.TryParse(FormElement["Hour"], out number) ? number : 0,
        //            Minute = Int32.TryParse(FormElement["Minute"], out number) ? number : 0,
        //            CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),

        //        };
        //        listAirlineTimeZone.Add(AirlineTimeZone);
        //        object datalist = (object)listAirlineTimeZone;
        //        DataOperationService(DisplayModeSave, datalist, MyModuleID);
        //        { }

        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //}
        /// <summary>
        /// Update AirlineTimeZone record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        //private void UpdateAirlineTimeZone(string RecordID)
        //{
        //    try
        //    {
        //        List<AirlineTimeZone> listAirlineTimeZone = new List<AirlineTimeZone>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        int number = 0;
        //        var CityConnectionTime = new AirlineTimeZone
        //        {
        //            SNo = Convert.ToInt32(RecordID),
        //            TimeZoneName = FormElement["TimeZoneName"],
        //            TimeDifference = Convert.ToInt32(FormElement["TimeDifference"]),
        //            prefix = FormElement["Prefix"].ToUpper(),
        //            Hour = Int32.TryParse(FormElement["Hour"], out number) ? number : 0,
        //            Minute = Int32.TryParse(FormElement["Minute"], out number) ? number : 0,
        //            CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //        };
        //        listAirlineTimeZone.Add(CityConnectionTime);
        //        object datalist = (object)listAirlineTimeZone;
        //        DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }

        //}
        /// <summary>
        /// Delete AirlineTimeZone record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        //private void DeleteAirlineTimeZone(string RecordID)
        //{
        //    try
        //    {
        //        List<string> listID = new List<string>();
        //        listID.Add(RecordID);
        //        listID.Add(MyUserID.ToString());
        //        object recordID = (object)listID;
        //        DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //}

        private object GetTimeZoneRecored()
        {
            object timezone = null;
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
            {
                Timezone timezoneList = new Timezone();
                object obj = (object)timezoneList;

                timezone = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return timezone;
        }

        private DataTable GetTimeZoneTransRecord()
        {
            object doc = null;
            DataTable dtCreateTimeZoneTransRecord = null;
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
            {
                List<TimeZoneTrans> TimeZoneTransList = new List<TimeZoneTrans>();
                object obj = (object)TimeZoneTransList;

                doc = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, MyAppID + "Trans");
                dtCreateTimeZoneTransRecord = BaseWebUISecureObject.ConvertToDataTable((List<TimeZoneTrans>)doc);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dtCreateTimeZoneTransRecord;
        }
    }
}
