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
    public class AirlineHubManagementWebUI : BaseWebUISecureObject
    {
        public object GetAirlineHubRecord()
        {
            object AirlineHub = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AirlineHub AirlineHubList = new AirlineHub();
                    object obj = (object)AirlineHubList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    AirlineHub = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return AirlineHub;
        }
        public AirlineHubManagementWebUI()
        {
            try
            {
                //if (this.SetCurrentPageContext(PageContext))
                //{
                //    this.ErrorNumber = 0;
                //    this.ErrorMessage = "";
                //}
                //   this.MyPageName = "Default.aspx";
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "AirlineHub";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public AirlineHubManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Master";
                this.MyAppID = "AirlineHub";
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
            return strContent ;
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Text_AirlineSNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetAirlineHubRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetAirlineHubRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetAirlineHubRecord();
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
                            htmlFormAdapter.objFormData = GetAirlineHubRecord();
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

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Airline Hub";
                    g.FormCaptionText = "Airline Hub";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "AIRLINE", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OriginAirportSNo", Title = "ORIGIN", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_DestinationAirportSNo", Title = "DESTINATION", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Transit1", Title = "TRANSIT 1", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Transit2", Title = "TRANSIT 2", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Hub", Title = "HUB", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_IsExclude", Title = "INCLUDE/EXCLUDE", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "DayLightSaving", Title = "Day Light Saving", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
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
                        SaveAirlineHub();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateAirlineHub(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveAirlineHub();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        
                        break;

                    case DisplayModeDelete:
                        DeleteAirlineHub(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        ///// <summary>
        ///// Save City record into the database 
        ///// call webservice to save that data into the database
        ///// </summary>
        private void SaveAirlineHub()
        {
            try
            {
                List<AirlineHub> listAirlineHub = new List<AirlineHub>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                //string TimeofDifference = FormElement["TimeDifference"].Split(new char[] { ')' })[1];
                var ERC = new AirlineHub
                {
                    SNo=1,
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    OriginAirportSNo = Convert.ToInt32(FormElement["OriginAirportSNo"].ToString()),
                    Transit1 = FormElement["Transit1"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["Transit1"]),
                    Transit2 = FormElement["Transit2"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["Transit2"]),
                    Hub = Convert.ToInt32(FormElement["Hub"]),
                    IsExclude=FormElement["IsExclude"]=="0"?true:false,
                    //Text_ZoneSNo  = FormElement["Text_ZoneName"] == "" ? null : FormElement["Text_ZoneName"],
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    DestinationAirportSNo = Convert.ToInt32(FormElement["DestinationAirportSNo"].ToString())

                };
                listAirlineHub.Add(ERC);
                object datalist = (object)listAirlineHub;
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
        private void UpdateAirlineHub(string RecordID)
        {
            try
            {
                List<AirlineHub> listAirlineHub = new List<AirlineHub>();
                // String[] Logo = SaveImage();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AirlineHub = new AirlineHub
                {
                    SNo = Convert.ToInt32(RecordID),
                    
                    AirlineSNo = 0,
                    OriginAirportSNo = Convert.ToInt32(FormElement["OriginAirportSNo"]),
                    Transit1 = FormElement["Transit1"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["Transit1"]),
                    Transit2 = FormElement["Transit2"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["Transit2"]),
                    Hub = Convert.ToInt32(FormElement["Hub"]),
                    IsExclude = FormElement["IsExclude"] == "0" ? true : false,
                    //Text_ZoneSNo  = FormElement["Text_ZoneName"] == "" ? null : FormElement["Text_ZoneName"],
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    DestinationAirportSNo = Convert.ToInt32(FormElement["DestinationAirportSNo"].ToString())
                };
                listAirlineHub.Add(AirlineHub);
                object datalist = (object)listAirlineHub;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
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
        private void DeleteAirlineHub(string RecordID)
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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
    }
}
