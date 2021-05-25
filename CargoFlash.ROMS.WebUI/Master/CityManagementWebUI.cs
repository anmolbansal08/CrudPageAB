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
    public class CityManagementWebUI : BaseWebUISecureObject
    {
        public CityManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "City";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public CityManagementWebUI(Page PageContext)
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
                this.MyAppID = "City";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        /// <summary>
        /// Get Record from City
        /// </summary>
        /// <returns></returns>
        public object GetRecordCity()
        {
            object city = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        City cityList = new City();
                        object obj = (object)cityList;
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        city = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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
            return city;
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
                    htmlFormAdapter.HeadingColumnName = "CityName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordCity();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordCity();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordCity();
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
                            htmlFormAdapter.objFormData = GetRecordCity();
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
        /// <summary>
        /// Generate City web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionCity.xml
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
                    g.CommandButtonNewText = "New City";
                    g.FormCaptionText = "City";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CountryCode", Title = "Country Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "StandardName", Title = "Standard Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DayLightSaving", Title = "Daylight Saving", DataType = GridDataType.String.ToString() });

                   // g.Column.Add(new GridColumn { Field = "TimeDifference", Title = "Time Difference", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IsPriorApproval", Title = "Prior Approval", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "House", Title = "HAWB", DataType = GridDataType.String.ToString() });  // by arman 2017-05-15 : field name For House
                  //  g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });

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
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveCity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateCity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveCity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        //else
                        //    return;
                        break;

                    case DisplayModeDelete:
                        DeleteCity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        /// Save City record into the database 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveCity()
        {
            try
            {
                List<City> listCity = new List<City>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                //string TimeofDifference = FormElement["TimeDifference"].Split(new char[] { ')' })[1];
                var city = new City
                {             
                    
                    CityCode = FormElement["CityCode"],
                    CityName = FormElement["CityName"],
                    CountrySNo = Convert.ToInt32(FormElement["CountrySNo"]),
                    CountryCode = FormElement["Text_CountrySNo"].Split('-')[0],  //FormElement["Text_CountrySNo"],
                    CountryName = FormElement["Text_CountrySNo"].Split('-')[1],// FormElement["Text_CountrySNo"],
                    //DaylightSaving = FormElement["DaylightSaving"],
                    IATAArea=FormElement["IATAArea"],
                    //TimeDifference = Convert.ToInt32(TimeofDifference),
                    TimeZoneSNo = Convert.ToInt32(FormElement["TimeZoneSNo"]),
                    //IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",
                    IsActive = FormElement["IsActive"] == "0" ? true : false,//not null
                    PriorApproval =  FormElement["PriorApproval"] == "0" ? true : false,
                    ZoneSNo =FormElement["ZoneSNo"]=="" ? 0: Convert.ToInt32(FormElement["ZoneSNo"]),
                   Text_ZoneSNo=FormElement["Text_ZoneSNo"],
                    SHCSNo = FormElement["SHCSNo"],
                    DGClassSNo = FormElement["DGClassSNo"],
                    VolumeConversionCM = Convert.ToDouble(FormElement["VolumeConversionCM"] == "" ? "0" : FormElement["VolumeConversionCM"]),
                    VolumeConversionInch = Convert.ToDouble(FormElement["VolumeConversionInch"] == "" ? "0" : FormElement["VolumeConversionInch"]),
                    //Text_ZoneSNo  = FormElement["Text_ZoneName"] == "" ? null : FormElement["Text_ZoneName"],
                    IsHouse = FormElement["IsHouse"] == "0" ? true : false,
                    IsDimension=FormElement["IsDimension"]=="0" ? true : false,// Added By Pankaj Kumar Ishwar
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listCity.Add(city);
                object datalist = (object)listCity;
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
        /// Update City record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateCity(string RecordID)
        {
            try
            {
                List<City> listCity = new List<City>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var city = new City
                {
                    SNo = Convert.ToInt32(RecordID),
                  
                    CityCode = FormElement["CityCode"],
                    CityName = FormElement["CityName"],
                    CountrySNo = Convert.ToInt32(FormElement["CountrySNo"]),
                    //CountryCode = FormElement["Text_CountrySNo"],
                    //CountryName = FormElement["Text_CountrySNo"],
                    CountryCode = FormElement["Text_CountrySNo"].Split('-')[0],  //FormElement["Text_CountrySNo"],
                    CountryName = FormElement["Text_CountrySNo"].Split('-')[1],// FormElement["Text_CountrySNo"],
                   // DaylightSaving = FormElement["DaylightSaving"],
                    IATAArea = FormElement["IATAArea"],
                   // TimeDifference = Convert.ToInt32(FormElement["TimeDifference"]),
                    TimeZoneSNo = Convert.ToInt32(FormElement["TimeZoneSNo"]),
                   // IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",
                    IsActive =  FormElement["IsActive"] == "0" ? true : false,//not null
                    PriorApproval =  FormElement["PriorApproval"] == "0" ? true : false,
                    ZoneSNo = FormElement["ZoneSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ZoneSNo"]),
                    Text_ZoneSNo  = FormElement["Text_ZoneSNo"] == "" ? null : FormElement["Text_ZoneSNo"],
                    SHCSNo = FormElement["SHCSNo"],
                    DGClassSNo = FormElement["DGClassSNo"],
                    VolumeConversionCM = Convert.ToDouble(FormElement["VolumeConversionCM"] == "" ? "0" : FormElement["VolumeConversionCM"]),
                    VolumeConversionInch = Convert.ToDouble(FormElement["VolumeConversionInch"] == "" ? "0" : FormElement["VolumeConversionInch"]),
                    IsHouse = FormElement["IsHouse"] == "0" ? true : false,
                    IsDimension=FormElement["IsDimension"] == "0" ? true : false,// Added By Pankaj Kumar Ishwar
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listCity.Add(city);
                object datalist = (object)listCity;
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
        /// <summary>
        /// Delete City record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteCity(string RecordID)
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
