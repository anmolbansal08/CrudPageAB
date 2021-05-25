
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
    public class SystemSettingManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordSystemSetting()
        {

            object SystemSetting = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    SystemSettings TerminalList = new SystemSettings();
                    object obj = (object)TerminalList;
                    SystemSetting = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return SystemSetting;
        }
        public SystemSettingManagementWebUI(Page PageContext)
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
                this.MyAppID = "SystemSetting";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public SystemSettingManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Permissions";
                this.MyAppID = "SystemSetting";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public object GetRecordSystemConfig()
        {
            object SystemSettings = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("New"))
                {
                    SystemSetting SystemSettingList = new SystemSetting();
                    object obj = (object)SystemSettingList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    SystemSettings = DataGetRecordService("", obj, MyModuleID, "", "", qString);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return SystemSettings;
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "sysKey";
                    switch (DisplayMode)
                    {
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordSystemConfig();
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
        private void UpdateSystemConfig(string RecordID)
        {
            try
            {
                List<SystemSetting> ListSystemSetting = new List<SystemSetting>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var SystemSetting = new SystemSetting
                {
                    IsSendMail = (FormElement["IsSendMail"]) == "0",
                    IsSendSMS = (FormElement["IsSendSMS"]) == "0",
                    SenderEmailId = (FormElement["SenderEmailId"]),
                    GridServiceURL = (FormElement["GridServiceURL"]),
                    DateFormat = (FormElement["DateFormat"]),
                    JSVersion = Convert.ToInt32(FormElement["JSVersion"]),
                    LongDateFormat = (FormElement["LongDateFormat"]),
                    CRAServiceURL = (FormElement["CRAServiceURL"]),
                    SessionTimeout = Convert.ToInt32(FormElement["SessionTimeout"]),
                    TimeFormat = (FormElement["TimeFormat"]),
                    EmailAttachmentWServicePath = Convert.ToString(FormElement["EmailAttachmentWServicePath"]),
                    IsPartialRCS = (FormElement["IsPartialRCS"]) == "0",
                    SLICaption = (FormElement["SLICaption"]),
                    CCSUrl = (FormElement["CCSUrl"]),
                    CCSGroups = (FormElement["CCSGroups"]),
                    IsShowTickerOnPublish = (FormElement["IsShowTickerOnPublish"]) == "0",
                    //ShowTickerOnPublish = Convert.ToInt32(FormElement["ShowTickerOnPublish"]),
                    ShowTickerOnPublishText = (FormElement["ShowTickerOnPublishText"]),
                };
                ListSystemSetting.Add(SystemSetting);
                object datalist = (object)ListSystemSetting;
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
                        UpdateSystemConfig(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
