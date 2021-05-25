using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Permissions
{
    public class WebFormDefinitionDefaultParameter : BaseWebUISecureObject
    {
         public WebFormDefinitionDefaultParameter(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Permissions";
                this.MyAppID = "DefaultParameter";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
         public WebFormDefinitionDefaultParameter()
        {
            try
            {
                this.MyModuleID = "Permissions";
                this.MyAppID = "DefaultParameter";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
         public object GetRecordDefaultParameter()
        {
            object ServiceConfigs = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("New"))
                {
                    DefaultParameter SystemSettingList = new DefaultParameter();
                    object obj = (object)SystemSettingList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    ServiceConfigs = DataGetRecordService("", obj, MyModuleID, "", "", qString);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return ServiceConfigs;
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    switch (DisplayMode)
                    {
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordDefaultParameter();
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
                        case DisplayModeEdit:
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
        private void UpdateDefaultParameter(string RecordID)
        {
            try
            {
                List<DefaultParameter> DefaultParameterList = new List<DefaultParameter>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var DefaultParameter = new DefaultParameter
                {
                    DefaultProductSNo = (FormElement["DefaultProductSNo"]),
                    DefaultProductName = (FormElement["DefaultProductName"]),
                    DefaultAirportSNo = (FormElement["DefaultAirportSNo"]),
                    DefaultAirportName = (FormElement["DefaultAirportName"]),
                    FWBTransfer = (FormElement["FWBTransfer"]),
                    FWBAmendmentTime = (FormElement["FWBAmendmentTime"]),
                    BOEVerification = (FormElement["BOEVerification"]),
                    FC_AirlineName = (FormElement["FC_AirlineName"]),
                    FC_AllowedCity = (FormElement["FC_AllowedCity"]),
                    IsCheckFlightOverBooking = (FormElement["IsCheckFlightOverBooking"])=="0",
                    DefaultAirportCode = (FormElement["DefaultAirportCode"]),
                    DomesticBookingPeriod = (FormElement["DomesticBookingPeriod"]),
                    CMSDivisor = (FormElement["CMSDivisor"]),
                    INHDivisor = (FormElement["INHDivisor"]),
                    InternationalBookingPeriod = (FormElement["InternationalBookingPeriod"]),
                    FWBOnExecution = (FormElement["FWBOnExecution"])=="0",
                };
                DefaultParameterList.Add(DefaultParameter);
                object datalist = (object)DefaultParameter;
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
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeUpdate:
                        UpdateDefaultParameter(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
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
    }
}
