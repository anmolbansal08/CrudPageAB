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
using System.Globalization;
using System.Web;
namespace CargoFlash.Cargo.WebUI.Master
{
    public class EmbargoManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public EmbargoManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Master";
                this.MyAppID = "Embargo";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public EmbargoManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Embargo";
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
        ///  Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed i.e(Read,Write,Update,Delete)</param>
        /// <param name="container">Control Object</param>
        //public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        //{
        //    try
        //    {
        //        using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
        //        {
        //            htmlFormAdapter.CurrentPage = this.CurrentPageContext;
        //            htmlFormAdapter.HeadingColumnName = "EmbargoName";
        //            switch (DisplayMode)
        //            {
        //                case DisplayModeReadView:

        //                    htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
        //                    htmlFormAdapter.objFormData = GetRecordEmbargo();
        //                    htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
        //                    htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
        //                    htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
        //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                    container.Append(htmlFormAdapter.InstantiateIn());
        //                    break;
        //                case DisplayModeDuplicate:
        //                    htmlFormAdapter.DisplayMode = DisplayModeType.New;
        //                    htmlFormAdapter.objFormData = GetRecordEmbargo();
        //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                    container.Append(htmlFormAdapter.InstantiateIn());
        //                    break;
        //                case DisplayModeEdit:
        //                    htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
        //                    Embargo objEdit = (Embargo)GetRecordEmbargo();
        //                    htmlFormAdapter.objFormData = objEdit;
        //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                    container.Append(htmlFormAdapter.InstantiateIn());
        //                   // container.Append(String.Format(@"<input type='hidden' id='hdnExcludeCustomer' runat='server' value={0} />", objEdit.ExcludeCustomer));
        //                    break;
        //                case DisplayModeNew:
        //                    htmlFormAdapter.DisplayMode = DisplayModeType.New;
        //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                    container.Append(htmlFormAdapter.InstantiateIn());
        //                    break;
        //                case DisplayModeDelete:
        //                    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
        //                    htmlFormAdapter.objFormData = GetRecordEmbargo();
        //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
        //                    container.Append(htmlFormAdapter.InstantiateIn());
        //                    break;
        //                default:
        //                    break;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;
        //    }
        //    return container;
        //}

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "RefNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordEmbargo();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", false);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);

                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordEmbargo();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordEmbargo();
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
                            htmlFormAdapter.objFormData = GetRecordEmbargo();
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
        /// Generate Embargo web page from XML
        /// </summary>
        /// <param name="container"></param>
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

        /// <summary>
        /// Postback Method to GET or POST 
        ///  to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            try
            {
                //this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveEmbargo();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateEmbargo(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveEmbargo();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeDelete:
                        DeleteEmbargo(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        /// Generate Grid for the page as per the columns of the entity supplied
        /// </summary>
        /// <param name="Container"></param>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid e = new Grid())
                {
                    e.PageName = this.MyPageName;
                    e.PrimaryID = this.MyPrimaryID;
                    e.ModuleName = this.MyModuleID;
                    e.AppsName = this.MyAppID;
                    e.CommandButtonNewText = "New Embargo";
                    e.FormCaptionText = "Embargo";
                    e.ServiceModuleName = this.MyModuleID;
                    e.IsShowDelete = false;
                    e.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    e.Column = new List<GridColumn>();
                    e.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference Code", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "Text_ConfigType", Title = "Config Type", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "EmbargoName", Title = "Embargo Name", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Origin #\">#= Origin #</span>" });
                    e.Column.Add(new GridColumn { Field = "Destination", Title = "Destination", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Destination #\">#= Destination #</span>" });
                    e.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_AirlineSNo #\">#= Text_AirlineSNo #</span>" });
                    e.Column.Add(new GridColumn { Field = "Text_AccountSNo", Title = "Agent", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_AccountSNo #\">#= Text_AccountSNo #</span>" });
                  //  e.Column.Add(new GridColumn { Field = "Text_FreightType", Title = "Freight Type", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "Reason", Title = "Reason", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Reason #\">#= Reason #</span>" });
                    e.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString(),Template = "#= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });

                    e.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });
                    e.Column.Add(new GridColumn { Field = "EmbargoType", Title = "Embargo Type", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "Text_LimitOn", Title = "Restriction", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn {Field ="Text_CreatedBy", Title ="Created By", DataType =GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field ="Text_UpdatedBy", Title ="Updated By", DataType =GridDataType.String.ToString()});
                    e.InstantiateIn(Container);
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
        /// Insert new Embargo record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveEmbargo()
        {
            try
            {
                var days = "";
                List<Embargo> listEmbargo = new List<Embargo>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                //string EOriginCountry = CurrentPageContext.Request.Form["OriginCountry"];
                //string EDestinationCountry = CurrentPageContext.Request.Form["DestinationCountry"];
                //int EOriginGlobalZoneSNo = 0;
                //int EDestinationGlobalZoneSNo = 0;
                ////int EOriginLocalZoneSNo = 0;
                ////int EDestinationLocalZoneSNo = 0;
                if (FormElement["Day0"] == "8")
                {
                    days = "1,2,3,4,5,6,7";
                }
                else
                {
                    for (int i = 1; i < 8; i++)
                    {
                        if (FormElement["Day" + i] == i.ToString())
                        {
                            days = days + i + ",";
                        }
                    }
                    if (days.Length > 1)
                    {
                        days = days.Substring(0, (days.Length - 1));
                    }
                }
                //EOriginGlobalZoneSNo = int.TryParse(System.Web.HttpContext.Current.Request["OriginGlobalZoneSNo"], out number) ? number : 0;
                //EDestinationGlobalZoneSNo = int.TryParse(System.Web.HttpContext.Current.Request["DestinationGlobalZoneSNo"], out number) ? number : 0;
                ////EOriginLocalZoneSNo = int.TryParse(System.Web.HttpContext.Current.Request["OriginLocalZoneSNo"], out number) ? number : 0;
                ////EDestinationLocalZoneSNo = int.TryParse(System.Web.HttpContext.Current.Request["DestinationLocalZoneSNo"], out number) ? number : 0;
                //string EOriginCity = CurrentPageContext.Request.Form["OriginCity"];
                //string EDestinationCity = CurrentPageContext.Request.Form["DestinationCity"];
                var embargo = new Embargo
                {
                    ConfigType=FormElement["ConfigType"]=="1"?true:false,
                    EmbargoName = FormElement["EmbargoName"].ToUpper(),// CurrentPageContext.Request.Form["EmbargoName"].ToUpper(),
                    AirlineSNo = FormElement["AirlineSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirlineSNo"]),
                    AccountSNo = FormElement["AccountSNo"] == "" ? "" : FormElement["AccountSNo"],
                    OriginCountrySNo =FormElement["OriginCountrySNo"]==""? (Int32?)null : Convert.ToInt32(FormElement["OriginCountrySNo"]),
                    DestinationCountrySNo = FormElement["DestinationCountrySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationCountrySNo"]),
                    OriginAirportSNo = FormElement["OriginAirportSNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginAirportSNo"]),
                    DestinationAirportSNo = FormElement["DestinationAirportSNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationAirportSNo"]),
                    //OriginLocalZoneSNo = EOriginLocalZoneSNo,
                    //DestinationLocalZoneSNo = EDestinationLocalZoneSNo,
                    OriginCitySNo = FormElement["OriginCitySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginCitySNo"]),
                    DestinationCitySNo = FormElement["DestinationCitySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationCitySNo"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    LimitOn = FormElement["LimitOn"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["LimitOn"]),
                    Period = FormElement["Period"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["Period"]),
                    MaxWeight = FormElement["MaxWeight"] == "" ? 0 : Convert.ToDouble(FormElement["MaxWeight"]),
                    AllowedWeight = FormElement["AllowedWeight"] == "" ? 0 : Convert.ToDouble(FormElement["AllowedWeight"]),
                    FreightType = FormElement["FreightType"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["FreightType"]),
                    Reason = FormElement["Reason"],
                    IsActive = Convert.ToBoolean(FormElement["IsActive"].ToString() == "0"),
                    IsSoftEmbargo = FormElement["IsSoftEmbargo"] == "0" ? false : true,
                    Commodity = (!(string.IsNullOrEmpty(FormElement["Commodity"]))) ? (FormElement["Commodity"]).ToString() : "0",
                    Aircraft = (!(string.IsNullOrEmpty(FormElement["Aircraft"]))) ? (FormElement["Aircraft"]).ToString() : "0",
                    Product = (!(string.IsNullOrEmpty(FormElement["Product"]))) ? (FormElement["Product"]).ToString() : "0",
                    SHC = (!(string.IsNullOrEmpty(FormElement["SHC"]))) ? (FormElement["SHC"]).ToString() : "0",
                    Flight = (!(string.IsNullOrEmpty(FormElement["Flight"]))) ? (FormElement["Flight"]).ToString() : "0",
                    //added by tarun kumar singh
                    DaysOfOps=days,
                    ApplicableOn = FormElement["ApplicableOn"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["ApplicableOn"]),
                    //IsExcludeSHC=FormElement["IsExcludeSHC"]=="1"?true:false,
                    //IsExcludeAircraft = FormElement["IsExcludeAircraft"] == "1" ? true : false,
                    //IsExcludeFlight = FormElement["IsExcludeFlight"] == "1" ? true : false,
                    //IsExcludeCommodity = FormElement["IsExcludeCommodity"] == "1" ? true : false,
                    //IsExcludeProduct = FormElement["IsExcludeProduct"] == "1" ? true : false,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    //Customer = CurrentPageContext.Request.Form["Multi_Customer"] == null ? "0" : CurrentPageContext.Request.Form["Multi_Customer"].ToString(),
                    ExcludeCommodity = (!(string.IsNullOrEmpty(FormElement["ExcludeCommodity"]))) ? (FormElement["ExcludeCommodity"]).ToString() : "0",
                    /*************************************/
                    ExcludeSHC = (!(string.IsNullOrEmpty(FormElement["ExcludeSHC"]))) ? (FormElement["ExcludeSHC"]).ToString() : "0",
                    ExcludeProduct = (!(string.IsNullOrEmpty(FormElement["ExcludeProduct"]))) ? (FormElement["ExcludeProduct"]).ToString() : "0",
                    ExcludeAircraft = (!(string.IsNullOrEmpty(FormElement["ExcludeAircraft"]))) ? (FormElement["ExcludeAircraft"]).ToString() : "0",
                    ExcludeAccountSNo = (!(string.IsNullOrEmpty(FormElement["ExcludeAccountSNo"]))) ? (FormElement["ExcludeAccountSNo"]).ToString() : "0",
                    ExcludeFlight = (!(string.IsNullOrEmpty(FormElement["ExcludeFlight"]))) ? (FormElement["ExcludeFlight"]).ToString() : "0",
                    AgentsAirline = (!(string.IsNullOrEmpty(FormElement["AgentsAirline"]))) ? (FormElement["AgentsAirline"]).ToString() : "0",
                    /*************************************/
                };
                listEmbargo.Add(embargo);
                object datalist = (object)listEmbargo;
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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        /// <summary>
        /// Update Embargo Record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void UpdateEmbargo(int RecordID)
        {
            try
            {
                var days2 = "";
                int number = 0;
                List<Embargo> listEmbargo = new List<Embargo>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                //string EOriginCountry = CurrentPageContext.Request.Form["OriginCountry"];
                //string EDestinationCountry = CurrentPageContext.Request.Form["DestinationCountry"];
                //int EOriginGlobalZoneSNo = 0;
                //int EDestinationGlobalZoneSNo = 0;
                //int EOriginLocalZoneSNo = 0;
                //int EDestinationLocalZoneSNo = 0;

                //EOriginGlobalZoneSNo = int.TryParse(System.Web.HttpContext.Current.Request["OriginGlobalZoneSNo"], out number) ? number : 0;
                //EDestinationGlobalZoneSNo = int.TryParse(System.Web.HttpContext.Current.Request["DestinationGlobalZoneSNo"], out number) ? number : 0;
                //EOriginLocalZoneSNo = int.TryParse(System.Web.HttpContext.Current.Request["OriginLocalZoneSNo"], out number) ? number : 0;
                //EDestinationLocalZoneSNo = int.TryParse(System.Web.HttpContext.Current.Request["DestinationLocalZoneSNo"], out number) ? number : 0;
                //string EOriginCity = CurrentPageContext.Request.Form["OriginCity"];
                //string EDestinationCity = CurrentPageContext.Request.Form["DestinationCity"];
                if (FormElement["Day0"] == "8")
                {
                    days2 = "1,2,3,4,5,6,7";
                }
                else
                {
                    for (int i = 1; i < 8; i++)
                    {
                        if (FormElement["Day" + i] == i.ToString())
                        {
                            days2 = days2 + i + ",";
                        }
                    }
                    if (days2.Length > 1)
                    {
                        days2 = days2.Substring(0, (days2.Length - 1));
                    }
                }
                var embargo = new Embargo
                {
                    SNo = RecordID,
                    ConfigType = FormElement["ConfigType"] == "1" ? true : false,
                    EmbargoName = FormElement["EmbargoName"].ToUpper(),// CurrentPageContext.Request.Form["EmbargoName"].ToUpper(),
                    AirlineSNo = FormElement["AirlineSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirlineSNo"]),
                    AccountSNo = FormElement["AccountSNo"] == "" ? "" : FormElement["AccountSNo"],
                    OriginCountrySNo = FormElement["OriginCountrySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginCountrySNo"]),
                    DestinationCountrySNo = FormElement["DestinationCountrySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationCountrySNo"]),
                    OriginAirportSNo = FormElement["OriginAirportSNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginAirportSNo"]),
                    DestinationAirportSNo = FormElement["DestinationAirportSNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationAirportSNo"]),
                    //OriginLocalZoneSNo = EOriginLocalZoneSNo,
                    //DestinationLocalZoneSNo = EDestinationLocalZoneSNo,
                    OriginCitySNo = FormElement["OriginCitySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginCitySNo"]),
                    DestinationCitySNo = FormElement["DestinationCitySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationCitySNo"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    LimitOn = FormElement["LimitOn"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["LimitOn"]),
                    Period = FormElement["Period"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["Period"]),
                    MaxWeight = FormElement["MaxWeight"] == "" ? 0 : Convert.ToDouble(FormElement["MaxWeight"]),
                    AllowedWeight = FormElement["AllowedWeight"] == "" ? 0 : Convert.ToDouble(FormElement["AllowedWeight"]),
                    FreightType = FormElement["FreightType"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["FreightType"]),
                    Reason = FormElement["Reason"],
                    IsActive = Convert.ToBoolean(FormElement["IsActive"].ToString() == "0"),
                    IsSoftEmbargo = FormElement["IsSoftEmbargo"] == "0" ? false:true,
                    Commodity = (!(string.IsNullOrEmpty(FormElement["Commodity"]))) ? (FormElement["Commodity"]).ToString() : "0",
                    Aircraft = (!(string.IsNullOrEmpty(FormElement["Aircraft"]))) ? (FormElement["Aircraft"]).ToString() : "0",
                    Product = (!(string.IsNullOrEmpty(FormElement["Product"]))) ? (FormElement["Product"]).ToString() : "0",
                    SHC = (!(string.IsNullOrEmpty(FormElement["SHC"]))) ? (FormElement["SHC"]).ToString() : "0",
                    Flight = (!(string.IsNullOrEmpty(FormElement["Flight"]))) ? (FormElement["Flight"]).ToString() : "0",
                    DaysOfOps = days2,
                    ApplicableOn = FormElement["ApplicableOn"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["ApplicableOn"]),
                    //IsExcludeSHC = FormElement["IsExcludeSHC"] == "1" ? true : false,
                    //IsExcludeAircraft = FormElement["IsExcludeAircraft"] == "1" ? true : false,
                    //IsExcludeFlight = FormElement["IsExcludeFlight"] == "1" ? true : false,
                    //IsExcludeCommodity = FormElement["IsExcludeCommodity"] == "1" ? true : false,
                    //IsExcludeProduct = FormElement["IsExcludeProduct"] == "1" ? true : false,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    //Customer = CurrentPageContext.Request.Form["Multi_Customer"] == null ? "0" : CurrentPageContext.Request.Form["Multi_Customer"].ToString(),
                    ExcludeCommodity = (!(string.IsNullOrEmpty(FormElement["ExcludeCommodity"]))) ? (FormElement["ExcludeCommodity"]).ToString() : "0",
                    /*************************************/
                    ExcludeSHC = (!(string.IsNullOrEmpty(FormElement["ExcludeSHC"]))) ? (FormElement["ExcludeSHC"]).ToString() : "0",
                    ExcludeProduct = (!(string.IsNullOrEmpty(FormElement["ExcludeProduct"]))) ? (FormElement["ExcludeProduct"]).ToString() : "0",
                    ExcludeAircraft = (!(string.IsNullOrEmpty(FormElement["ExcludeAircraft"]))) ? (FormElement["ExcludeAircraft"]).ToString() : "0",
                    ExcludeAccountSNo = (!(string.IsNullOrEmpty(FormElement["ExcludeAccountSNo"]))) ? (FormElement["ExcludeAccountSNo"]).ToString() : "0",
                    ExcludeFlight = (!(string.IsNullOrEmpty(FormElement["ExcludeFlight"]))) ? (FormElement["ExcludeFlight"]).ToString() : "0",
                    AgentsAirline = (!(string.IsNullOrEmpty(FormElement["AgentsAirline"]))) ? (FormElement["AgentsAirline"]).ToString() : "0",
                    /*************************************/
                };
                listEmbargo.Add(embargo);
                object datalist = (object)listEmbargo;
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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        // <summary>
        /// Delete Embargo record from the database 
        /// call webservice to update that data into the database 
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteEmbargo(string RecordID)
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

        /// <summary>
        /// Get information of individual Embargo from database according record id supplied
        /// </summary>
        /// <returns>object type of entity Embargo found from database </returns>
        public object GetRecordEmbargo()
        {
            object emb = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        Embargo embargoList = new Embargo();
                        object obj = (object)embargoList;
                        //retrieve Entity from Database according to the record
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        emb = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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
            
            return emb;
        }
    }
}








