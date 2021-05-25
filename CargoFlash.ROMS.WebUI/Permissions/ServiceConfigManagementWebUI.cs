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
   public class ServiceConfigManagementWebUI:BaseWebUISecureObject
    {
        public ServiceConfigManagementWebUI(Page PageContext)
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
                this.MyAppID = "ServiceConfig";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public ServiceConfigManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Permissions";
                this.MyAppID = "ServiceConfig";
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
            object ServiceConfigs = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("New"))
                {
                    ServiceConfigs SystemSettingList = new ServiceConfigs();
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
                    //htmlFormAdapter.HeadingColumnName = "sysKey";
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
        private void UpdateServiceConfig(string RecordID)
        {
            try
            {
                List<ServiceConfigs> serviceconfig = new List<ServiceConfigs>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ServiceConfigs = new ServiceConfigs
                {
                    RosterFTPHostName = (FormElement["RosterFTPHostName"]),
                    RosterFTPUserId = (FormElement["RosterFTPUserId"]),
                    RosterFTPPassword = (FormElement["RosterFTPPassword"]),
                    RosterFtpFolderPath = (FormElement["RosterFtpFolderPath"]),
                    AttendanceFTPHostName = (FormElement["AttendanceFTPHostName"]),
                    AttendanceFTPUserId = (FormElement["AttendanceFTPUserId"]),
                    AttendanceFTPPassword = (FormElement["AttendanceFTPPassword"]),
                    AttendanceFtpFolderPath = (FormElement["AttendanceFtpFolderPath"]),
                    StaffFTPHostName = (FormElement["StaffFTPHostName"]),
                    StaffFTPUserId = (FormElement["StaffFTPUserId"]),
                    StaffFTPPassword = (FormElement["StaffFTPPassword"]),
                    StaffFtpFolderPath = (FormElement["StaffFtpFolderPath"]),
                    SITAFTPHostName = (FormElement["SITAFTPHostName"]),
                    SITAFTPUserId = (FormElement["SITAFTPUserId"]),
                    SITAFTPPassword = (FormElement["SITAFTPPassword"]),
                    SITAFtpFolderPath = (FormElement["SITAFtpFolderPath"]),
                    SITAMAILBOXServerName = (FormElement["SITAMAILBOXServerName"]),
                    SITAMAILBOXUserId = (FormElement["SITAMAILBOXUserId"]),
                    SITAMAILBOXPassword = (FormElement["SITAMAILBOXPassword"]),
                    EmailFTPHostName = (FormElement["EmailFTPHostName"]),
                    EmailFTPUserId = (FormElement["EmailFTPUserId"]),
                    EmailFTPPassword = (FormElement["EmailFTPPassword"]),
                    EmailFtpFolderPath = (FormElement["EmailFtpFolderPath"]),
                    IsActiveAttendanceWService = (FormElement["IsActiveAttendanceWService"]) =="0",
                    IsActiveShiftWService = (FormElement["IsActiveShiftWService"])=="0",
                    IsActiveRosterWService = (FormElement["IsActiveRosterWService"])=="0",
                    IsActiveEmailWService = (FormElement["IsActiveEmailWService"])=="0",
                    IsActiveEDIOutboundWService = (FormElement["IsActiveEDIOutboundWService"]) == "0",
                    IsActiveEdiInboundWService = (FormElement["IsActiveEdiInboundWService"]) == "0",
                    IsActiveEDIProcessWService = (FormElement["IsActiveEDIProcessWService"]) == "0",
                    IsActiveNilManifestWService = (FormElement["IsActiveNilManifestWService"]) == "0",
                    IsActiveSMSWService = (FormElement["IsActiveSMSWService"])=="0",
                    AttendanceTimeInterval = (FormElement["AttendanceTimeInterval"]),
                    ShiftTimeInterval = (FormElement["ShiftTimeInterval"]),
                    RosterTimeInterval = (FormElement["RosterTimeInterval"]),
                    EmailTimeInterval = (FormElement["EmailTimeInterval"]),
                    EDIOutboundTimeInterval = (FormElement["EDIOutboundTimeInterval"]),
                    EDIInboundTimeInterval = (FormElement["EDIInboundTimeInterval"]),
                    NilManifestTimeInterval = (FormElement["NilManifestTimeInterval"]),
                    EDIProcessTimeInterval = (FormElement["EDIProcessTimeInterval"]),
                    SMSTimeInterval = (FormElement["SMSTimeInterval"]),
                    IsActiveLyingListWService = (FormElement["IsActiveLyingListWService"])=="0",
                    LyingListTimeInterval = (FormElement["LyingListTimeInterval"]),
                    IsActiveLyingListService = (FormElement["IsActiveLyingListService"])=="0",
                    LyingListTimepmInterval = (FormElement["LyingListTimepmInterval"]),
                    IsActiveAutoSCMCreation = (FormElement["IsActiveAutoSCMCreation"])=="0",
                    AutoSCMCreation = (FormElement["AutoSCMCreation"]),
                    IsActiveCustomsAPIWService = (FormElement["IsActiveCustomsAPIWService"])=="0",
                    CustomsAPITimeInterval = (FormElement["CustomsAPITimeInterval"]),
                    INBOUNDMAILBOXServerName = (FormElement["INBOUNDMAILBOXServerName"]),
                    INBOUNDMAILBOXUserId = (FormElement["INBOUNDMAILBOXUserId"]),
                    INBOUNDMAILBOXPassword = (FormElement["INBOUNDMAILBOXPassword"]),
                    BNICreateVATimeInterval = (FormElement["BNICreateVATimeInterval"]),
                    IsActiveBNICreateVAAPIWService = (FormElement["IsActiveBNICreateVAAPIWService"])=="0",
                    IsActivePushAWBDataToCRAWService = (FormElement["IsActivePushAWBDataToCRAWService"])=="0",
                    PushAWBDataToCRATimeInterval = (FormElement["PushAWBDataToCRATimeInterval"]),
                };
                serviceconfig.Add(ServiceConfigs);
                object datalist = (object)serviceconfig;
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
                        UpdateServiceConfig(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
