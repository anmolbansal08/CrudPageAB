using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using CargoFlash.Cargo.WebUI.Permissions;
using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;


public partial class Users : System.Web.UI.Page
{
    public StringBuilder myCurrentFrom = new StringBuilder();
    public UsersManagementWebUI usersManagementWebUI = null;

    override protected void OnInit(EventArgs e)
    {

        if (Request.QueryString["Module"] != null)
        {
            if (Request.QueryString["Apps"] != null)
            {
                CargoFlash.Cargo.DataService.LoginService ls = new CargoFlash.Cargo.DataService.LoginService();

                CargoFlash.Cargo.Model.PageAccessLogModel p = new CargoFlash.Cargo.Model.PageAccessLogModel();
                p.UserSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
                p.UserID = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName;
                p.CityCode = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode;
                p.Module = Request.QueryString["Module"].ToUpper().ToString();
                p.AppName = Request.QueryString["Apps"].ToUpper().ToString();
                p.FormAction = Request.QueryString["FormAction"].ToUpper().ToString();
                //string ipAddress = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_FORWARDED_FOR"];
                string ipAddress = System.Web.HttpContext.Current.Request.UserHostAddress;
                if (!string.IsNullOrEmpty(ipAddress))
                {
                    string[] forwardedIps = ipAddress.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    ipAddress = forwardedIps[forwardedIps.Length - 1];
                }
                else
                {
                    ipAddress = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }
                p.IPAddress = ipAddress;
                p.Browser = HttpContext.Current.Request.Browser.Type;
                p.URL = Request.Url.OriginalString;

                ls.SetPageAccessLog(p);
            }
        }


        if (Request.QueryString["Module"] != null)
        {
            //ScriptManager.RegisterStartupScript(this, this.GetType(), "SessionData", "var _SessionLoginID_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginID"].ToString()) + "'; _SessionUserName_='" + BaseWebUISecureObject.LexEncryptString(Session["UserName"].ToString()) + "';_SessionLoginSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginSNo"].ToString()) + "';_SessionCity_='" + BaseWebUISecureObject.LexEncryptString(Session["City"].ToString()) + "';_SessionCitySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["CitySNo"].ToString()) + "';_SessionCityCode_='" + BaseWebUISecureObject.LexEncryptString(Session["CityCode"].ToString()) + "';_SessionFullName_='" + BaseWebUISecureObject.LexEncryptString(Session["FullName"].ToString()) + "';_SessionLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginType"].ToString()) + "';_SessionLoginTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginTypeSNo"].ToString()) + "';_SessionConsolidatorSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ConsolidatorSNo"].ToString()) + "';_SessionConsolidatorBranchSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ConsolidatorBranchSNo"].ToString()) + "';_SessionPOSSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["POSSNo"].ToString()) + "';_SessionDropBoxSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["DropBoxSNo"].ToString()) + "';_SessionCustomerSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["CustomerSNo"].ToString()) + "';_SessionUserSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["UserSNo"].ToString()) + "';_SessionOriginConsolidatorSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["OriginConsolidatorSNo"].ToString()) + "';_SessionOriginConsolidatorCode_='" + BaseWebUISecureObject.LexEncryptString(Session["OriginConsolidatorCode"].ToString()) + "';_SessionOriginConsolidatorName_='" + BaseWebUISecureObject.LexEncryptString(Session["OriginConsolidatorName"].ToString()) + "';_SessionTopUpConsolidatorSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["TopUpConsolidatorSNo"].ToString()) + "';_SessionTopUpConsolidatorCode_='" + BaseWebUISecureObject.LexEncryptString(Session["TopUpConsolidatorCode"].ToString()) + "';_SessionTopUpConsolidatorName_='" + BaseWebUISecureObject.LexEncryptString(Session["TopUpConsolidatorName"].ToString()) + "';_SessionBillingTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["BillingTypeSNo"].ToString()) + "';_SessionBillingTypeCode_='" + BaseWebUISecureObject.LexEncryptString(Session["BillingTypeCode"].ToString()) + "';_SessionBillingTypeName_='" + BaseWebUISecureObject.LexEncryptString(Session["BillingTypeName"].ToString()) + "';_SessionBillingType_='" + BaseWebUISecureObject.LexEncryptString(Session["BillingType"].ToString()) + "';_SessionCityTimeZone_='" + BaseWebUISecureObject.LexEncryptString(Session["CityTimeZone"].ToString()) + "';_SessionActualLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["ActualLoginType"].ToString()) + "';_SessionIsCityChangeAllowed_='" + BaseWebUISecureObject.LexEncryptString(Session["IsCityChangeAllowed"].ToString()) + "';_SessionCFSignature_='" + Session["CF_Signature"].ToString() + "';_SessionAccessibleCitySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCitySNo"].ToString()) + "';_SessionAccessibleCityCode_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCityCode"].ToString()) + "';_SessionAccessibleCityName_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCityName"].ToString()) + "';_SessionActingLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["ActingLoginType"].ToString()) + "';_SessionActingLoginTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ActingLoginTypeSNo"].ToString()) + "';FlightServicePath='" + GlobalSetting.eCargoClientURL + "';lApplicationMessage='" + GlobalSetting.ApplicationMessage + "';isSSL=" + GlobalSetting.SSL.ToString().ToLower() + ";_SessionGrossWtVariance_='" + BaseWebUISecureObject.LexEncryptString(GlobalSetting.GrossWtVariance) + "';LECommonServiceURL='" + GlobalSetting.CommonClientServiceURL + "';", true);


            //ScriptManager.RegisterStartupScript(this, this.GetType(), "SessionData", "var _SessionLoginID_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginID"].ToString()) + "'; _SessionUserName_='" + BaseWebUISecureObject.LexEncryptString(Session["UserName"].ToString()) + "';_SessionLoginSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginSNo"].ToString()) + "';_SessionCity_='" + BaseWebUISecureObject.LexEncryptString(Session["City"].ToString()) + "';_SessionCitySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["CitySNo"].ToString()) + "';_SessionCityCode_='" + BaseWebUISecureObject.LexEncryptString(Session["CityCode"].ToString()) + "';_SessionFullName_='" + BaseWebUISecureObject.LexEncryptString(Session["FullName"].ToString()) + "';_SessionLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginType"].ToString()) + "';_SessionLoginTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginTypeSNo"].ToString()) + "';_SessionTruckingCompanySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["TruckingCompanySNo"].ToString()) + "';_SessionForwarderSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ForwarderSNo"].ToString()) + "';_SessionCityTimeZone_='" + BaseWebUISecureObject.LexEncryptString(Session["CityTimeZone"].ToString()) + "';_SessionActualLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["ActualLoginType"].ToString()) + "';_SessionIsCityChangeAllowed_='" + BaseWebUISecureObject.LexEncryptString(Session["IsCityChangeAllowed"].ToString()) + "';_SessionCFSignature_='" + Session["CF_Signature"].ToString() + "';_SessionAccessibleCitySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCitySNo"].ToString()) + "';_SessionAccessibleCityCode_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCityCode"].ToString()) + "';_SessionAccessibleCityName_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCityName"].ToString()) + "';_SessionActingLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["ActingLoginType"].ToString()) + "';_SessionActingLoginTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ActingLoginTypeSNo"].ToString()) + "';FlightServicePath='" + GlobalSetting.eCargoClientURL + "';lApplicationMessage='" + GlobalSetting.ApplicationMessage + "';isSSL=" + GlobalSetting.SSL.ToString().ToLower() + ";LECommonServiceURL='" + GlobalSetting.CommonClientServiceURL + "';", true);


            if (Request.QueryString["RecID"] != null)
            {
                CargoFlash.Cargo.Model.Permissions.CustomizedGrid.GroupName = null;
                CargoFlash.Cargo.Model.Permissions.CustomizedGrid.UserName = null;
                CargoFlash.Cargo.Model.Permissions.CustomizedGrid.UserGroupPage = null;

                CargoFlash.Cargo.Permissions.DataService.GroupsService groupsService = new CargoFlash.Cargo.Permissions.DataService.GroupsService(false);
                CargoFlash.Cargo.Model.Permissions.Groups groups = groupsService.GetGroupsRecord(Request.QueryString["RecID"].ToString(), "1");

                CargoFlash.Cargo.Model.Permissions.CustomizedGrid.GroupName = groups.GroupName;

                if (Request.QueryString["UserSNo"] != null)
                {
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "msgUserSNo", "document.getElementById('hdnUserSNo').value='" + Request.QueryString["UserSNo"].ToString() + "';document.getElementById('hdngroupSNo').value='0';", true);

                    CargoFlash.Cargo.Permissions.DataService.UsersService usersService = new CargoFlash.Cargo.Permissions.DataService.UsersService(false);
                    CargoFlash.Cargo.Model.Permissions.Users users = usersService.GetUsersRecord(Request.QueryString["UserSNo"].ToString());

                    CargoFlash.Cargo.Model.Permissions.CustomizedGrid.UserName = users.UserName;
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "msgGroupSNo", "document.getElementById('hdngroupSNo').value='" + Request.QueryString["RecID"].ToString() + "';document.getElementById('hdnUserSNo').value='0';", true);
                }
            }

            if (Request.QueryString["Apps"] != null)
            {
                if (Request.QueryString["PageSNo"] != null)
                {
                    string lModulePage = GetModulePage(Request.QueryString["PageSNo"].ToString());
                    CargoFlash.Cargo.Model.Permissions.CustomizedGrid.UserGroupPage = lModulePage;
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "msgPageSNo1", "document.getElementById('hdnPageSNo').value='" + Request.QueryString["PageSNo"].ToString() + "';document.getElementById('hdnUserAdd').value='" + lModulePage + "';", true);
                }

                switch (Request.QueryString["Module"].ToUpper().ToString())
                {
                    case "USERS":
                        switch (Request.QueryString["Apps"].ToUpper().ToString())
                        {
                            case "USERS":
                                usersManagementWebUI = new UsersManagementWebUI(this);
                                usersManagementWebUI.CreateWebForm(myCurrentFrom);
                                break;
                            case "PAGES":
                                PagesManagementWebUI pagesManagementWebUI = new PagesManagementWebUI(this);
                                pagesManagementWebUI.CreateWebForm(myCurrentFrom);
                                break;
                            case "GROUPS":
                                GroupsManagementWebUI groupsManagementWebUI = new GroupsManagementWebUI(this);
                                groupsManagementWebUI.CreateWebForm(myCurrentFrom);
                                break;
                            case "GROUPPAGERIGHTTRANS":
                                GroupPageRightTransManagementWebUI groupPageRightTransManagementWebUI = new GroupPageRightTransManagementWebUI(this);
                                groupPageRightTransManagementWebUI.CreateWebForm(myCurrentFrom);
                                break;
                            case "USERGROUP":
                                UserGroupManagementWebUI userGroupManagementWebUI = new UserGroupManagementWebUI(this);
                                userGroupManagementWebUI.CreateWebForm(myCurrentFrom);
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }

                if (Request.QueryString["MsgKey"] != null)
                {
                    HttpContext.Current.Session["MsgKey"] = Request.QueryString["MsgKey"].ToString();
                }
                string errorMessage = "";
                if (HttpContext.Current.Session["MsgKey"] != null && !IsPostBack)
                {
                    ApplicationWebUI ap = new ApplicationWebUI();
                    errorMessage = ap.ReadServerMessages(Convert.ToInt16(HttpContext.Current.Session["MsgKey"]), "Permission");
                    ScriptManager.RegisterStartupScript(this, typeof(Page), "ShowMessage", "ShowMessage('success','Success!',\"" + errorMessage + "\");", true);
                    HttpContext.Current.Session["MsgKey"] = null;
                }
            }
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (IsPostBack)
            if (Request.QueryString["Module"] != null)
            {
                if (Request.QueryString["Apps"] != null)
                {
                    switch (Request.QueryString["Module"].ToUpper().ToString())
                    {
                        case "USERS":
                            switch (Request.QueryString["Apps"].ToUpper().ToString())
                            {
                                case "USERS":
                                    usersManagementWebUI = new UsersManagementWebUI(this);
                                    usersManagementWebUI.DoPostBack();
                                    break;
                                case "PAGES":
                                    PagesManagementWebUI pagesManagementWebUI = new PagesManagementWebUI(this);
                                    pagesManagementWebUI.DoPostBack();
                                    break;
                                case "GROUPS":
                                    GroupsManagementWebUI groupsManagementWebUI = new GroupsManagementWebUI(this);
                                    groupsManagementWebUI.DoPostBack();
                                    break;
                                case "GROUPPAGERIGHTTRANS":
                                    GroupPageRightTransManagementWebUI groupPageRightTransManagementWebUI = new GroupPageRightTransManagementWebUI(this);
                                    groupPageRightTransManagementWebUI.DoPostBack();
                                    break;
                                case "USERGROUP":
                                    UserGroupManagementWebUI userGroupManagementWebUI = new UserGroupManagementWebUI(this);
                                    userGroupManagementWebUI.DoPostBack();
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
    }

    private string GetModulePage(string SNo)
    {
        string lModulePage = "";
        CargoFlash.Cargo.Permissions.DataService.PagesService pagesService = new CargoFlash.Cargo.Permissions.DataService.PagesService(false);
        CargoFlash.Cargo.Model.Permissions.Pages pages = pagesService.GetModulePagesRecord(SNo);
        lModulePage = pages.Hyperlink + ": " + pages.PageName;
        return lModulePage;
    }
}
