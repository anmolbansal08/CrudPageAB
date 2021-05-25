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
    #region Airline Class Description
    /*
	*****************************************************************************
	Class Name:		AirlineManagementWebUI
	Purpose:		This Class used to get details of Airline save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 Mar 2014
    Updated By:
	Updated On:
	Approved By:
	Approved On:
	*****************************************************************************
	*/
    #endregion
    public class AirlineManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordAirline()
        {

            object Airline = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Airline AirlineList = new Airline();
                    object obj = (object)AirlineList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    Airline = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return Airline;
        }
        public AirlineManagementWebUI(Page PageContext)
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
                this.MyAppID = "Airline";
                this.MyPrimaryID = "AirlineCode";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public AirlineManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Airline";
                this.MyPrimaryID = "AirlineCode";
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
                    htmlFormAdapter.HeadingColumnName = "AirlineName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordAirline();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(AirlineTransTab(htmlFormAdapter.InstantiateIn()));
                            container.Append("<input type='hidden' id='hdnTXTAirlinesno' name='hdnTXTAirlinesno' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).SNo.ToString() + " /><input type='hidden' id='hdnIsCCAllowed' name='hdnIsCCAllowed' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).IsCCAllowed.ToString() + " /><input type='hidden' id='hdnIsPartAllowed' name='hdnIsPartAllowed' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).IsPartAllowed.ToString() + " />");
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordAirline();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(AirlineTransTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = (Airline)GetRecordAirline();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(AirlineTransTab(htmlFormAdapter.InstantiateIn()));
                            container.Append("<input type='hidden' id='hdnTXTAirlinesno' name='hdnTXTAirlinesno' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).SNo.ToString() + " /><input type='hidden' id='hdnIsCCAllowed' name='hdnIsCCAllowed' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).IsCCAllowed.ToString() + " /><input type='hidden' id='hdnIsPartAllowed' name='hdnIsPartAllowed' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).IsPartAllowed.ToString() + " />");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(AirlineTransTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordAirline();
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
                    g.CommandButtonNewText = "New Airline";
                    g.FormCaptionText = "Airline";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;

                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AirlineCode", Title = "AWB Prefix", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CarrierCode", Title = "Carrier Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= AirlineName #\">#= AirlineName #</span>" });
                    g.Column.Add(new GridColumn { Field = "Interline", Title = "Interline", DataType = GridDataType.String.ToString() });
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
            //try
            //{

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveAirline();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveAirline();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateAirline(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteAirline(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            //}
        }
        //private String[] SaveImage()
        //{
        //    String AirlineLogo = "", AwbLogo = "";
        //    try
        //    {
        //        System.Web.HttpFileCollection multipleFiles = System.Web.HttpContext.Current.Request.Files;

        //        String[] inputName = multipleFiles.AllKeys;
        //        var server = System.Web.HttpContext.Current.Server;
        //        String str = server.MapPath("~/");
        //        if (!Directory.Exists(Path.Combine(str, "Logo")))
        //        {
        //            Directory.CreateDirectory(Path.Combine(str, "Logo"));
        //        }
        //        for (int fileCount = 0; fileCount < multipleFiles.Count; fileCount++)
        //        {
        //            System.Web.HttpPostedFile uploadedFile = multipleFiles[fileCount];
        //            string fileName = Path.GetFileName(uploadedFile.FileName);
        //            if (uploadedFile.ContentLength > 0 && ((uploadedFile.ContentLength / 1024) <= 2048))
        //            {
        //                switch (inputName[fileCount])
        //                {
        //                    case "AirlineLogo":
        //                        AirlineLogo = Path.Combine("Logo", "AirlineLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
        //                        uploadedFile.SaveAs(Path.Combine(str, AirlineLogo));
        //                        break;
        //                    case "AwbLogo":
        //                        AwbLogo = Path.Combine("Logo", "AwbLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
        //                        uploadedFile.SaveAs(Path.Combine(str, AwbLogo));
        //                        break;
        //                        //case "ReportLogo":
        //                        //    ReportLogo = Path.Combine("Logo", "ReportLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
        //                        //    uploadedFile.SaveAs(Path.Combine(str, ReportLogo));
        //                        //    //@todo
        //                        //    break;
        //                        //ReportLogo { get; set; }
        //                }
        //            }
        //        }
        //        return new String[] { AirlineLogo, AwbLogo };
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    }
        //    return new String[] { AirlineLogo, AwbLogo };
        //}
        private void SaveAirline()
        {
            try
            {
                List<Airline> listAirline = new List<Airline>();
                //String[] Logo = SaveImage();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Airline = new Airline
                {
                    AirlineCode = FormElement["AirlineCode"].ToUpper(),
                    CarrierCode = FormElement["CarrierCode"].ToUpper(),
                    AirlineName = FormElement["AirlineName"].ToUpper(),
                    AirportCodeSNo = string.IsNullOrEmpty(FormElement["AirportCode"]) == true ? "" : FormElement["AirportCode"].ToString(),
                    AirportCode = string.IsNullOrEmpty(FormElement["Text_AirportCode"]) == true ? "" : FormElement["Text_AirportCode"].Split('-')[0],
                    ICAOCode = string.IsNullOrEmpty(FormElement["ICAOCode"]) == true ? "" : FormElement["ICAOCode"].ToUpper(),
                    Address = string.IsNullOrEmpty(FormElement["Address"]) == true ? "" : FormElement["Address"].ToString(),
                    CountrySNo = string.IsNullOrEmpty(FormElement["CountryName"]) == true ? "" : FormElement["CountryName"].ToString(),
                    CountryName = string.IsNullOrEmpty(FormElement["Text_CountryName"]) == true ? "" : FormElement["Text_CountryName"].Split('-')[0],
                    SenderEmailId = string.IsNullOrEmpty(FormElement["SenderEmailId"]) == true ? "" : FormElement["SenderEmailId"].ToString(),
                    AirlineEmailId = string.IsNullOrEmpty(FormElement["AirlineEmailId"]) == true ? "" : FormElement["AirlineEmailId"],
                    AirlineLogo = string.IsNullOrEmpty(FormElement["AirlineLogoValue"]) == true ? "" : FormElement["AirlineLogoValue"].ToString(),
                    AwbLogo = string.IsNullOrEmpty(FormElement["AWBLogoValue"]) == true ? "" : FormElement["AWBLogoValue"].ToString(),
                    AirlineWebsite = string.IsNullOrEmpty(FormElement["AirlineWebsite"]) == true ? "" : FormElement["AirlineWebsite"].ToString(),
                    MobileCountryCode = string.IsNullOrEmpty(FormElement["MobileCountryCode"]) == true ? "" : FormElement["MobileCountryCode"].ToString(),
                    MobileNo = string.IsNullOrEmpty(FormElement["MobileNo"]) == true ? "" : FormElement["MobileNo"].ToString(),
                    PhoneCountryCode = string.IsNullOrEmpty(FormElement["PhoneCountryCode"]) == true ? "" : FormElement["PhoneCountryCode"].ToString(),
                    CityPrefixCode = string.IsNullOrEmpty(FormElement["CityPrefixCode"]) == true ? "" : FormElement["CityPrefixCode"].ToString(),
                    PhoneNo = string.IsNullOrEmpty(FormElement["PhoneNo"]) == true ? "" : FormElement["PhoneNo"].ToString(),
                    CSDCode = string.IsNullOrEmpty(FormElement["CSDCode"]) == true ? "" : FormElement["CSDCode"].ToString(),
                    IsActive = FormElement["IsActive"] == "0" ? true : false,
                    IsCCAllowed = FormElement["IsCCAllowed"] == "0" ? true : false,
                    IsPartAllowed = FormElement["IsPartAllowed"] == "0" ? true : false,
                    IsCheckModulus7 = FormElement["IsCheckModulus7"] == "0" ? true : false,
                    CurrencySNo = string.IsNullOrEmpty(FormElement["CurrencyCode"]) == true ? "" : FormElement["CurrencyCode"].ToString(),
                    CurrencyCode = string.IsNullOrEmpty(FormElement["Text_CurrencyCode"]) == true ? "" : FormElement["Text_CurrencyCode"].Split('-')[0],// FormElement["Text_CurrencyCode"].ToUpper(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    ContactPerson = string.IsNullOrEmpty(FormElement["ContactPerson"]) == true ? "" : FormElement["ContactPerson"].ToString(),
                    AWBDuplicacy = string.IsNullOrEmpty(FormElement["AWBDuplicacy"]) == true ? "" : FormElement["AWBDuplicacy"].ToString(),
                    HandlingInformation = string.IsNullOrEmpty(FormElement["HandlingInformation"]) == true ? "" : FormElement["HandlingInformation"].ToString(),
                    IsInterline = FormElement["IsInterline"] == "0" ? true : false,
                    InvoicingCycle = string.IsNullOrEmpty(FormElement["InvoicingCycle"]) == true ? 0 : Convert.ToInt32(FormElement["InvoicingCycle"]),
                    EmailAddress = string.IsNullOrEmpty(FormElement["EmailAddress"]) == true ? "" : FormElement["EmailAddress"].ToString(),
                    SitaAddress = string.IsNullOrEmpty(FormElement["SitaAddress"]) == true ? "" : FormElement["SitaAddress"].ToString(),
                    SMS = string.IsNullOrEmpty(FormElement["SMS"]) == true ? false : true,
                    Message = string.IsNullOrEmpty(FormElement["Message"]) == true ? false : true,
                    Mobile = string.IsNullOrEmpty(FormElement["Mobile"]) == true ? "" : FormElement["Mobile"].ToString(),
                    Email = string.IsNullOrEmpty(FormElement["Email"]) == true ? "" : FormElement["Email"].ToString(),
                    IsAllowedCL = FormElement["IsAllowedCL"] == "0" ? true : false,
                    CreditLimit = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["CreditLimit"]) == true ? "0" : FormElement["CreditLimit"]),
                    MinimumCL = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["MinimumCL"]) == true ? "0" : FormElement["MinimumCL"]),
                    AlertCLPercentage = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["AlertCLPercentage"]) == true ? "0" : FormElement["AlertCLPercentage"]),
                    BillingCode = string.IsNullOrEmpty(FormElement["BillingCode"]) == true ? "" : FormElement["BillingCode"].ToString(),
                    AccountNo = string.IsNullOrEmpty(FormElement["AccountNo"]) == true ? "" : FormElement["AccountNo"].ToString(),
                    BillingAddress = string.IsNullOrEmpty(FormElement["BillingAddress"]) == true ? "" : FormElement["BillingAddress"].ToString(),
                    IsCashAirline = FormElement["IsCashAirline"] == "0" ? true : false,
                    SCM = Convert.ToInt32(string.IsNullOrEmpty(FormElement["Scm"]) == true ? "0" : FormElement["Scm"]),
                    SCMCycle = string.IsNullOrEmpty(FormElement["ScmCycle"]) == true ? "" : FormElement["ScmCycle"].ToString(),
                    SCMDays = string.IsNullOrEmpty(FormElement["ScmDays"]) == true ? "" : FormElement["ScmDays"].ToString(),
                    PartnerAirline = string.IsNullOrEmpty(FormElement["PartnerAirline"]) == true ? "" : FormElement["PartnerAirline"].ToString(),
                    Commission = String.IsNullOrEmpty(FormElement["Commission"]) == true ? (Decimal?)null : Convert.ToDecimal(FormElement["Commission"]),
                    FreeSaleCapacity = String.IsNullOrEmpty(FormElement["FreeSaleCapacity"]) == true ? 0 : Convert.ToInt32(FormElement["FreeSaleCapacity"]),
                    OverBookingCapacity = Convert.ToInt32(string.IsNullOrEmpty(FormElement["OverBookingCapacity"]) == true ? "0" : FormElement["OverBookingCapacity"]),
                    OverBookingCapacityVol = String.IsNullOrEmpty(FormElement["OverBookingCapacityVol"]) == true ? 0 : Convert.ToInt32(FormElement["OverBookingCapacityVol"]),
                    FreeSaleCapacityVol = String.IsNullOrEmpty(FormElement["FreeSaleCapacityVol"]) == true ? 0 : Convert.ToInt32(FormElement["FreeSaleCapacityVol"]),
                    AirlineMember = string.IsNullOrEmpty(FormElement["AirlineMember"]) == true ? 0 : Convert.ToInt16(FormElement["AirlineMember"]),
                    Text_AirlineMember = string.IsNullOrEmpty(FormElement["Text_AirlineMember"]) == true ? "" : FormElement["Text_AirlineMember"].ToString(),

					//// Added by Devendra
					//FOH_FWB = Convert.ToInt32(string.IsNullOrEmpty(FormElement["FOH_FWB"]) == true ? "0" : FormElement["FOH_FWB"]),
					FOH_FWB = Convert.ToInt32("0"),

					AirlineSignatory = FormElement["IsAirlineSignatory"] == "0" ? true : false,
                    ISCPercentage = string.IsNullOrEmpty(FormElement["ISCPercentage"]) == true ? 0 : Convert.ToDecimal(FormElement["ISCPercentage"]),
                    SIS = string.IsNullOrEmpty(FormElement["SIS"]) == true ? "" : FormElement["SIS"].ToUpper(),
                    MaxStackContainer = string.IsNullOrEmpty(FormElement["MaxStackContainer"]) == true ? 0 : Convert.ToInt32(FormElement["MaxStackContainer"]),
                    MaxStackPallets = string.IsNullOrEmpty(FormElement["MaxStackPallets"]) == true ? 0 : Convert.ToInt32(FormElement["MaxStackPallets"]),
                    UCMOutAlert = Convert.ToInt32(string.IsNullOrEmpty(FormElement["UCMOutAlert"]) == true ? "0" : FormElement["UCMOutAlert"]),
                    UCMinAlert = Convert.ToInt32(string.IsNullOrEmpty(FormElement["UCMinAlert"]) == true ? "0" : FormElement["UCMinAlert"]),
                    CountryRegistration = (Convert.ToString(FormElement["CountryRegistration"])).ToUpper(),
                    VATRegistrationNumber = (Convert.ToString(FormElement["VATRegistrationNumber"])).ToUpper(),
                    SAPCustomeCode = (Convert.ToString(FormElement["SAPCustomeCode"])).ToUpper(),
                    //// Added by Devendra
                   //Added by Pankaj Kumar Ishwar
                    DimensionMandatoryOn =Convert.ToInt32(FormElement["DimensionMandatoryOn"]),
                    IsHandled = FormElement["IsHandled"] == "0" ? true : false,
                    AirlineType = string.IsNullOrEmpty(FormElement["AirlineType"]) == true ? 0 : Convert.ToInt16(FormElement["AirlineType"]),
                    Text_AirlineType = string.IsNullOrEmpty(FormElement["Text_AirlineType"]) == true ? "" : FormElement["Text_AirlineType"].ToString(),
                };
                listAirline.Add(Airline);
                object datalist = (object)listAirline;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        private void UpdateAirline(string RecordID)
        {
            try
            {
                List<Airline> listAirline = new List<Airline>();
               // String[] Logo = SaveImage();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Airline = new Airline
                {
                    SNo = Convert.ToInt32(FormElement["hdnTXTAirlinesno"].ToString()),
                    AirlineCode = FormElement["AirlineCode"].ToUpper(),
                    CarrierCode = FormElement["CarrierCode"].ToUpper(),
                    AirlineName = FormElement["AirlineName"].ToUpper(),
                    AirportCodeSNo = string.IsNullOrEmpty(FormElement["AirportCode"]) == true ? "" : FormElement["AirportCode"].ToString(),
                    AirportCode = string.IsNullOrEmpty(FormElement["Text_AirportCode"]) == true ? "" : FormElement["Text_AirportCode"].Split('-')[0],
                    ICAOCode = string.IsNullOrEmpty(FormElement["ICAOCode"]) == true ? "" : FormElement["ICAOCode"].ToUpper(),
                    Address = string.IsNullOrEmpty(FormElement["Address"]) == true ? "" : FormElement["Address"].ToString(),
                    CountrySNo = string.IsNullOrEmpty(FormElement["CountryName"]) == true ? "" : FormElement["CountryName"].ToString(),
                    CountryName = string.IsNullOrEmpty(FormElement["Text_CountryName"]) == true ? "" : FormElement["Text_CountryName"].Split('-')[0],
                    SenderEmailId = string.IsNullOrEmpty(FormElement["SenderEmailId"]) == true ? "" : FormElement["SenderEmailId"].ToString(),
                    AirlineEmailId = string.IsNullOrEmpty(FormElement["AirlineEmailId"]) == true ? "" : FormElement["AirlineEmailId"],
                    AirlineLogo = FormElement["AirlineLogoValue"].ToString(),
                    AwbLogo = FormElement["AWBLogoValue"].ToString(),
                    AirlineWebsite = string.IsNullOrEmpty(FormElement["AirlineWebsite"]) == true ? "" : FormElement["AirlineWebsite"].ToString(),
                    MobileCountryCode = string.IsNullOrEmpty(FormElement["MobileCountryCode"]) == true ? "" : FormElement["MobileCountryCode"].ToString(),
                    MobileNo = string.IsNullOrEmpty(FormElement["MobileNo"]) == true ? "" : FormElement["MobileNo"].ToString(),
                    PhoneCountryCode = string.IsNullOrEmpty(FormElement["PhoneCountryCode"]) == true ? "" : FormElement["PhoneCountryCode"].ToString(),
                    CityPrefixCode = string.IsNullOrEmpty(FormElement["CityPrefixCode"]) == true ? "" : FormElement["CityPrefixCode"].ToString(),
                    PhoneNo = string.IsNullOrEmpty(FormElement["PhoneNo"]) == true ? "" : FormElement["PhoneNo"].ToString(),
                    CSDCode = string.IsNullOrEmpty(FormElement["CSDCode"]) == true ? "" : FormElement["CSDCode"].ToString(),
                    IsActive = FormElement["IsActive"] == "0" ? true : false,
                    IsCCAllowed = FormElement["IsCCAllowed"] == "0" ? true : false,
                    IsPartAllowed = FormElement["IsPartAllowed"] == "0" ? true : false,
                    IsCheckModulus7 = FormElement["IsCheckModulus7"] == "0" ? true : false,
                    CurrencySNo = string.IsNullOrEmpty(FormElement["CurrencyCode"]) == true ? "" : FormElement["CurrencyCode"].ToString(),
                    CurrencyCode = string.IsNullOrEmpty(FormElement["Text_CurrencyCode"]) == true ? "" : FormElement["Text_CurrencyCode"].Split('-')[0],// FormElement["Text_CurrencyCode"].ToUpper(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    ContactPerson = string.IsNullOrEmpty(FormElement["ContactPerson"]) == true ? "" : FormElement["ContactPerson"].ToString(),
                    AWBDuplicacy = string.IsNullOrEmpty(FormElement["AWBDuplicacy"]) == true ? "" : FormElement["AWBDuplicacy"].ToString(),
                    HandlingInformation = string.IsNullOrEmpty(FormElement["HandlingInformation"]) == true ? "" : FormElement["HandlingInformation"].ToString(),
                    IsInterline = FormElement["IsInterline"] == "0" ? true : false,
                    InvoicingCycle = string.IsNullOrEmpty(FormElement["InvoicingCycle"]) == true ? 0 : Convert.ToInt32(FormElement["InvoicingCycle"]),
                    EmailAddress = string.IsNullOrEmpty(FormElement["EmailAddress"]) == true ? "" : FormElement["EmailAddress"].ToString(),
                    SitaAddress = string.IsNullOrEmpty(FormElement["SitaAddress"]) == true ? "" : FormElement["SitaAddress"].ToString(),
                    SMS = string.IsNullOrEmpty(FormElement["SMS"]) == true ? false : true,
                    Message = string.IsNullOrEmpty(FormElement["Message"]) == true ? false : true,
                    Mobile = string.IsNullOrEmpty(FormElement["Mobile"]) == true ? "" : FormElement["Mobile"].ToString(),
                    Email = string.IsNullOrEmpty(FormElement["Email"]) == true ? "" : FormElement["Email"].ToString(),
                    IsAllowedCL = FormElement["IsAllowedCL"] == "0" ? true : false,
                    CreditLimit = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["CreditLimit"]) == true ? "0" : FormElement["CreditLimit"]),
                    MinimumCL = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["MinimumCL"]) == true ? "0" : FormElement["MinimumCL"]),
                    AlertCLPercentage = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["AlertCLPercentage"]) == true ? "0" : FormElement["AlertCLPercentage"]),
                    BillingCode = string.IsNullOrEmpty(FormElement["BillingCode"]) == true ? "" : FormElement["BillingCode"].ToString(),
                    AccountNo = string.IsNullOrEmpty(FormElement["AccountNo"]) == true ? "" : FormElement["AccountNo"].ToString(),
                    BillingAddress = string.IsNullOrEmpty(FormElement["BillingAddress"]) == true ? "" : FormElement["BillingAddress"].ToString(),
                    IsCashAirline = FormElement["IsCashAirline"] == "0" ? true : false,
                    SCM = Convert.ToInt32(string.IsNullOrEmpty(FormElement["Scm"]) == true ? "0" : FormElement["Scm"]),
                    SCMCycle = string.IsNullOrEmpty(FormElement["ScmCycle"]) == true ? "" : FormElement["ScmCycle"].ToString(),
                    SCMDays = string.IsNullOrEmpty(FormElement["ScmDays"]) == true ? "" : FormElement["ScmDays"].ToString(),
                    PartnerAirline = string.IsNullOrEmpty(FormElement["PartnerAirline"]) == true ? "" : FormElement["PartnerAirline"].ToString(),
                    Commission = string.IsNullOrEmpty(FormElement["Commission"]) == true ? (Decimal?)null : Convert.ToDecimal(FormElement["Commission"]),
                    FreeSaleCapacity = Convert.ToInt32(string.IsNullOrEmpty(FormElement["FreeSaleCapacity"]) == true ? "0" : FormElement["FreeSaleCapacity"]),
                    OverBookingCapacity = Convert.ToInt32(string.IsNullOrEmpty(FormElement["OverBookingCapacity"]) == true ? "0" : FormElement["OverBookingCapacity"]),
                    OverBookingCapacityVol = Convert.ToInt32(string.IsNullOrEmpty(FormElement["OverBookingCapacityVol"]) == true ? "0" : FormElement["OverBookingCapacityVol"]),
                    FreeSaleCapacityVol = Convert.ToInt32(string.IsNullOrEmpty(FormElement["FreeSaleCapacityVol"]) == true ? "0" : FormElement["FreeSaleCapacityVol"]),
                    AirlineMember = string.IsNullOrEmpty(FormElement["AirlineMember"]) == true ? 0 : Convert.ToInt16(FormElement["AirlineMember"]),
                    Text_AirlineMember = string.IsNullOrEmpty(FormElement["Text_AirlineMember"]) == true ? "" : FormElement["Text_AirlineMember"].ToString(),
                    // Added by Devendra
                    //FOH_FWB = Convert.ToInt32(string.IsNullOrEmpty(FormElement["FOH_FWB"]) == true ? "0" : FormElement["FOH_FWB"]),
					FOH_FWB = Convert.ToInt32("0"),
					
					AirlineSignatory = FormElement["IsAirlineSignatory"] == "0" ? true : false,
                    ISCPercentage = string.IsNullOrEmpty(FormElement["ISCPercentage"]) == true ? 0 : Convert.ToDecimal(FormElement["ISCPercentage"]),
                    SIS = string.IsNullOrEmpty(FormElement["SIS"]) == true ? "" : FormElement["SIS"].ToUpper(),
                    MaxStackContainer = string.IsNullOrEmpty(FormElement["MaxStackContainer"]) == true ? 0 : Convert.ToInt32(FormElement["MaxStackContainer"]),
                    MaxStackPallets = string.IsNullOrEmpty(FormElement["MaxStackPallets"]) == true ? 0 : Convert.ToInt32(FormElement["MaxStackPallets"]),
                    UCMOutAlert = Convert.ToInt32(string.IsNullOrEmpty(FormElement["UCMOutAlert"]) == true ? "0" : FormElement["UCMOutAlert"]),
                    UCMinAlert = Convert.ToInt32(string.IsNullOrEmpty(FormElement["UCMinAlert"]) == true ? "0" : FormElement["UCMinAlert"]),
                       CountryRegistration = (Convert.ToString(FormElement["CountryRegistration"])).ToUpper(),
                    VATRegistrationNumber = (Convert.ToString(FormElement["VATRegistrationNumber"])).ToUpper(),
                    SAPCustomeCode = (Convert.ToString(FormElement["SAPCustomeCode"])).ToUpper(),
                    //// Added by Devendra
                    //ReserveCapacity = string.IsNullOrEmpty(FormElement["ReserveCapacity"]) == true ? 0 : Convert.ToInt32(FormElement["ReserveCapacity"]),
                    //ReserveCapacityVol = string.IsNullOrEmpty(FormElement["ReserveCapacityVol"]) == true ? 0 : Convert.ToInt32(FormElement["ReserveCapacityVol"]),

                    //Added by Pankaj Kumar Ishwar
                    DimensionMandatoryOn = Convert.ToInt32(FormElement["DimensionMandatoryOn"]),
                    IsHandled = FormElement["IsHandled"] == "0" ? true : false,
                    AirlineType = string.IsNullOrEmpty(FormElement["AirlineType"]) == true ? 0 : Convert.ToInt16(FormElement["AirlineType"]),
                    Text_AirlineType = string.IsNullOrEmpty(FormElement["Text_AirlineType"]) == true ? "" : FormElement["Text_AirlineType"].ToString(),
                };
                listAirline.Add(Airline);
                object datalist = (object)listAirline;
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
        private void DeleteAirline(string RecordID)
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
            }
        }
        //        private StringBuilder AirlineTransTab(StringBuilder container)
        //        {
        //            StringBuilder strBuilder = new StringBuilder();

        //            strBuilder.Append(@"
        //        <div id='MainDiv'>
        //        <div id='ApplicationTabs'>
        //            <ul>
        //                <li  id='liAirline' class='k-state-active'>Airline</li>
        //                <li id='liCCShipment' onclick='CCShipmentTab();'>CC Shipment</li>
        //                <li id='liPartShipment' onclick='PartShipmentTab();'>CC Shipment</li>
        //            </ul>
        //            <div id='divTab1'>
        //              <span id='spnAirline'>");
        //            strBuilder.Append(container);
        //            strBuilder.Append(@"</span>
        //            </div>
        //            <div id='divTab2'>
        //            <span id='spnCCShipment'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirlineSNo' name='hdnAirlineSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='NEW'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAirlineCCTrans'></table></span></div></div> </div>");
        //            return strBuilder;
        //        }

        private StringBuilder AirlineTransTab(StringBuilder container)
        {
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAirline' class='k-state-active'>Airline</li>
                <li id='liCCShipment' onclick='CCShipmentTab();'>CC Shipment</li>
                <li id='liPartShipment' onclick='PartShipmentTab();'>Part Shipment</li>
                <li id='liEventMessage' onclick='EventMessageTab();'>Event</li>
                <li id='liRecipientMessage' onclick='RecipientMessageTab();'>Recipient Config</li>
               <li id='liAirlineParameter' onclick='AirlineParameterTab();'>Airline Parameter</li>
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
<div id='ApplicationTabs-6'>
<table id='tblAirlineParameterTrans' width='100%'></table>
             </div>
<input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirlineSNo' name='hdnAirlineSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='NEW'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/></div></div>");

            return strBuilder;

        }
    }
}
