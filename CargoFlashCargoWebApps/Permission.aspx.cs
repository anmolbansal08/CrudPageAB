using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Text;
using CargoFlash.Cargo.WebUI.Permissions;
using CargoFlash.Cargo.WebUI.Shipment;
using CargoFlash.Cargo.DataService;
using CargoFlash.Cargo.Model.Permissions;
using System.Collections;
using System.Data;
using System.Web.Script.Serialization;
using CargoFlash.Cargo.Permissions.DataService;
using CargoFlash.SoftwareFactory.WebUI;
using System.Web.Script.Services;

//[CargoFlash.Cargo.Business.AppPageRights("Permission.aspx")]
public partial class Permission : System.Web.UI.Page
{
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


    }
    protected void Page_Load(object sender, EventArgs e)
    {



        //ScriptManager.RegisterStartupScript(this, this.GetType(), "SessionData", "var _SessionLoginID_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginID"].ToString()) + "'; _SessionUserName_='" + BaseWebUISecureObject.LexEncryptString(Session["UserName"].ToString()) + "';_SessionLoginSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginSNo"].ToString()) + "';_SessionCity_='" + BaseWebUISecureObject.LexEncryptString(Session["City"].ToString()) + "';_SessionCitySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["CitySNo"].ToString()) + "';_SessionCityCode_='" + BaseWebUISecureObject.LexEncryptString(Session["CityCode"].ToString()) + "';_SessionFullName_='" + BaseWebUISecureObject.LexEncryptString(Session["FullName"].ToString()) + "';_SessionLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginType"].ToString()) + "';_SessionLoginTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginTypeSNo"].ToString()) + "';_SessionConsolidatorSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ConsolidatorSNo"].ToString()) + "';_SessionConsolidatorBranchSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ConsolidatorBranchSNo"].ToString()) + "';_SessionPOSSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["POSSNo"].ToString()) + "';_SessionDropBoxSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["DropBoxSNo"].ToString()) + "';_SessionCustomerSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["CustomerSNo"].ToString()) + "';_SessionUserSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["UserSNo"].ToString()) + "';_SessionOriginConsolidatorSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["OriginConsolidatorSNo"].ToString()) + "';_SessionOriginConsolidatorCode_='" + BaseWebUISecureObject.LexEncryptString(Session["OriginConsolidatorCode"].ToString()) + "';_SessionOriginConsolidatorName_='" + BaseWebUISecureObject.LexEncryptString(Session["OriginConsolidatorName"].ToString()) + "';_SessionTopUpConsolidatorSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["TopUpConsolidatorSNo"].ToString()) + "';_SessionTopUpConsolidatorCode_='" + BaseWebUISecureObject.LexEncryptString(Session["TopUpConsolidatorCode"].ToString()) + "';_SessionTopUpConsolidatorName_='" + BaseWebUISecureObject.LexEncryptString(Session["TopUpConsolidatorName"].ToString()) + "';_SessionBillingTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["BillingTypeSNo"].ToString()) + "';_SessionBillingTypeCode_='" + BaseWebUISecureObject.LexEncryptString(Session["BillingTypeCode"].ToString()) + "';_SessionBillingTypeName_='" + BaseWebUISecureObject.LexEncryptString(Session["BillingTypeName"].ToString()) + "';_SessionBillingType_='" + BaseWebUISecureObject.LexEncryptString(Session["BillingType"].ToString()) + "';_SessionCityTimeZone_='" + BaseWebUISecureObject.LexEncryptString(Session["CityTimeZone"].ToString()) + "';_SessionActualLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["ActualLoginType"].ToString()) + "';_SessionIsCityChangeAllowed_='" + BaseWebUISecureObject.LexEncryptString(Session["IsCityChangeAllowed"].ToString()) + "';_SessionCFSignature_='" + Session["CF_Signature"].ToString() + "';_SessionAccessibleCitySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCitySNo"].ToString()) + "';_SessionAccessibleCityCode_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCityCode"].ToString()) + "';_SessionAccessibleCityName_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCityName"].ToString()) + "';_SessionActingLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["ActingLoginType"].ToString()) + "';_SessionActingLoginTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ActingLoginTypeSNo"].ToString()) + "';FlightServicePath='" + GlobalSetting.eCargoClientURL + "';lApplicationMessage='" + GlobalSetting.ApplicationMessage + "';isSSL=" + GlobalSetting.SSL.ToString().ToLower() + ";_SessionGrossWtVariance_='" + BaseWebUISecureObject.LexEncryptString(GlobalSetting.GrossWtVariance) + "';LECommonServiceURL='" + GlobalSetting.CommonClientServiceURL + "';__ServiceURL__='" + GlobalSetting.ServiceURL + "';__GridServiceURL__='" + GlobalSetting.ServiceURL.Replace("Services", "") + "'; url = '" + "Services/AutoCompleteService.svc/AutoCompleteDataSource'; serviceurl = '" + "Services/AutoCompleteService.svc/';", true);

        // ScriptManager.RegisterStartupScript(this, this.GetType(), "SessionData", "var _SessionLoginID_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginID"].ToString()) + "'; _SessionUserName_='" + BaseWebUISecureObject.LexEncryptString(Session["UserName"].ToString()) + "';_SessionLoginSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginSNo"].ToString()) + "';_SessionCity_='" + BaseWebUISecureObject.LexEncryptString(Session["City"].ToString()) + "';_SessionCitySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["CitySNo"].ToString()) + "';_SessionCityCode_='" + BaseWebUISecureObject.LexEncryptString(Session["CityCode"].ToString()) + "';_SessionFullName_='" + BaseWebUISecureObject.LexEncryptString(Session["FullName"].ToString()) + "';_SessionLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginType"].ToString()) + "';_SessionLoginTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["LoginTypeSNo"].ToString()) + "';_SessionTruckingCompanySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["TruckingCompanySNo"].ToString()) + "';_SessionForwarderSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ForwarderSNo"].ToString()) + "';_SessionUserSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["UserSNo"].ToString()) + "';_SessionCityTimeZone_='" + BaseWebUISecureObject.LexEncryptString(Session["CityTimeZone"].ToString()) + "';_SessionActualLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["ActualLoginType"].ToString()) + "';_SessionIsCityChangeAllowed_='" + BaseWebUISecureObject.LexEncryptString(Session["IsCityChangeAllowed"].ToString()) + "';_SessionCFSignature_='" + Session["CF_Signature"].ToString() + "';_SessionAccessibleCitySNo_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCitySNo"].ToString()) + "';_SessionAccessibleCityCode_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCityCode"].ToString()) + "';_SessionAccessibleCityName_='" + BaseWebUISecureObject.LexEncryptString(Session["AccessibleCityName"].ToString()) + "';_SessionActingLoginType_='" + BaseWebUISecureObject.LexEncryptString(Session["ActingLoginType"].ToString()) + "';_SessionActingLoginTypeSNo_='" + BaseWebUISecureObject.LexEncryptString(Session["ActingLoginTypeSNo"].ToString()) + "';FlightServicePath='" + GlobalSetting.eCargoClientURL + "';lApplicationMessage='" + GlobalSetting.ApplicationMessage + "';isSSL=" + GlobalSetting.SSL.ToString().ToLower() + ";LECommonServiceURL='" + GlobalSetting.CommonClientServiceURL + "';__ServiceURL__='" + GlobalSetting.ServiceURL + "';__GridServiceURL__='" + GlobalSetting.ServiceURL.Replace("Services", "") + "'; url = '" + "Services/AutoCompleteService.svc/AutoCompleteDataSource'; serviceurl = '" + "Services/AutoCompleteService.svc/';", true);
    }

    [WebMethod]
    public static string GetListPageUsers(int PageSNo)
    {
        StringBuilder myCurrentFrom = new StringBuilder();

        UsersManagementWebUI usersManagementWebUI = new UsersManagementWebUI(null);
        usersManagementWebUI.CreateGridUserList(PageSNo, myCurrentFrom);

        string str = myCurrentFrom.ToString();
        return str;
    }

    [WebMethod]
    public static string GetGridPageData(int PageSNo)
    {
        StringBuilder myCurrentFrom = new StringBuilder();

        UserGroupManagementWebUI userGroupManagementWebUI = new UserGroupManagementWebUI(null);
        userGroupManagementWebUI.CreateGridGroupData(PageSNo, myCurrentFrom);

        string str = myCurrentFrom.ToString();
        return str;
    }

    [WebMethod]
    public static void AddGroupPermission(int PageSNo, List<CargoFlash.Cargo.Model.Permissions.DeletePermission> PageAccessibilityList)
    {
        DeletePermissionGroupCollection deletePermissionGroup;
        List<DeletePermissionGroupCollection> deletePermissionGroupCollection = new List<DeletePermissionGroupCollection>();

        foreach (CargoFlash.Cargo.Model.Permissions.DeletePermission dPermission in PageAccessibilityList)
        {
            if (dPermission.GroupSNo != 0)
            {
                deletePermissionGroup = new DeletePermissionGroupCollection();
                deletePermissionGroup.GroupSNo = dPermission.GroupSNo;
                deletePermissionGroup.PageSNo = PageSNo;

                deletePermissionGroupCollection.Add(deletePermissionGroup);
                deletePermissionGroup = null;
            }
        }

        UsersService usersService = new UsersService(false);
        usersService.AddGroupPermission(PageSNo, deletePermissionGroupCollection);

        StringBuilder myCurrentFrom = new StringBuilder();
        UserGroupManagementWebUI userGroupManagementWebUI = new UserGroupManagementWebUI(null);
        userGroupManagementWebUI.CreateGridGroupData(PageSNo, myCurrentFrom);
    }

    [WebMethod]
    public static string GetListGroupUsers(int GroupSNo)
    {
        StringBuilder myCurrentFrom = new StringBuilder();

        UsersManagementWebUI usersManagementWebUI = new UsersManagementWebUI(null);
        usersManagementWebUI.CreateGridUserGroupList(GroupSNo, myCurrentFrom);

        return myCurrentFrom.ToString();
    }

    [WebMethod]
    public static string GetListGroupUsers2(int GroupSNo)
    {
        StringBuilder myCurrentFrom = new StringBuilder();

        UsersManagementWebUI usersManagementWebUI = new UsersManagementWebUI(null);
        usersManagementWebUI.CreateGridUserGroupList2(GroupSNo, myCurrentFrom);

        return myCurrentFrom.ToString();
    }

    [WebMethod]
    public static string GetListUserGroups(int UserSNo)
    {
        StringBuilder myCurrentFrom = new StringBuilder();

        GroupsManagementWebUI groupsManagementWebUI = new GroupsManagementWebUI(null);
        groupsManagementWebUI.CreateGridUserGroupList(UserSNo, myCurrentFrom);

        return myCurrentFrom.ToString();
    }

    [WebMethod]
    public static string GetListUserGroups2(int UserSNo)
    {
        StringBuilder myCurrentFrom = new StringBuilder();

        GroupsManagementWebUI groupsManagementWebUI = new GroupsManagementWebUI(null);
        groupsManagementWebUI.CreateGridUserGroupList2(UserSNo, myCurrentFrom);

        return myCurrentFrom.ToString();
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
    public static string GetModulePages()
    {
        string lModulePages = "";
        //HttpContext.Current.Request.Headers.Add("Token", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).Signature);

        var user = System.Web.HttpContext.Current.Session["UserDetail"];

        PagesService pagesService = new PagesService(false);
        DataSet moduleDataSet = pagesService.GetModuleList();

        List<ModulePage> modulePages = new List<ModulePage>();
        ModulePage modulePage;

        foreach (DataRow row in moduleDataSet.Tables[0].Rows)
        {
            modulePage = new ModulePage();
            modulePage.SNo = Convert.ToInt32(row["SNo"].ToString());
            modulePages.Add(modulePage);
            modulePage = null;
        }

        DataSet pageDataSet = pagesService.GetPageList(modulePages);

        lModulePages = BindModulePages(moduleDataSet, pageDataSet);

        JavaScriptSerializer js = new JavaScriptSerializer();
        string str = js.Serialize(lModulePages);
        return str;
    }


    private static string BindModulePages(DataSet moduleDataSet, DataSet pageDataSet)
    {
        StringBuilder lModulePages = new StringBuilder();
        int lModuleCounter = 0;
        int lPageCounter = 0;


        //-------------------Do By Akash -Start(for Manage Permission To Users) 
        string GiveUserRights = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ManagePermissionToUsers"].ToUpper().ToString();
        string[] tokens = GiveUserRights.Split(new[] { "," }, StringSplitOptions.None);
        string LoginType = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToUpper();
        if (tokens.Contains(LoginType))
        {
            lModulePages.Append("[{" +
                                 "text: \"Permission\", imageUrl: \"images/permission.png\", expanded: true, items: [" +
                                         "{ text: \"Group\", target: \"Users.aspx?Module=Users&Apps=Groups&FormAction=INDEXVIEW\", imageUrl: \"images/usergroup.png\" }]" +
                                       "},{ text: \"Application\", imageUrl: \"images/application.png\", expanded: true, items: [");
        }
        else
        {
            lModulePages.Append("[{" +
                               "text: \"Permission\", imageUrl: \"images/permission.png\", expanded: true, items: [" +
                                       "{ text: \"Group\", target: \"Users.aspx?Module=Users&Apps=Groups&FormAction=INDEXVIEW\", imageUrl: \"images/usergroup.png\" }," +
                                       "{ text: \"User\",target: \"Users.aspx?Module=Users&Apps=Users&FormAction=INDEXVIEW&ulist=ulist\", imageUrl: \"images/user.png\"}]" +
                                     "},{ text: \"Application\", imageUrl: \"images/application.png\", expanded: true, items: [");
        }
        //-------------------Do By Akash - End

        foreach (DataRow moduleRow in moduleDataSet.Tables[0].Rows)
        {
            lModuleCounter = lModuleCounter + 1;

            lPageCounter = 0;

            lModulePages.Append(" { text: \"" + moduleRow["PageName"] + "\", imageUrl: \"images/master.png\", items: [");

            foreach (DataRow pageRow in pageDataSet.Tables[0].Rows)
            {
                lPageCounter = lPageCounter + 1;

                if (moduleRow["SNo"].ToString() == pageRow["MenuSNo"].ToString())
                {
                    if (lPageCounter < pageDataSet.Tables[0].Rows.Count)
                    {
                        lModulePages.Append("{ text: \"" + pageRow["PageName"] + "\", target: \"Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=" + pageRow["SNo"].ToString() + "\", imageUrl: \"images/createcountry.png\" },");
                    }
                    else
                    {
                        lModulePages.Append("{ text: \"" + pageRow["PageName"] + "\", target: \"Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=" + pageRow["SNo"].ToString() + "\", imageUrl: \"images/createcountry.png\" }");
                    }
                }
            }

            if (lModuleCounter < moduleDataSet.Tables[0].Rows.Count)
            {
                lModulePages.Append("] },");
            }
            else
            {
                lModulePages.Append("] }");
            }
        }

        lModulePages.Append(" ] }]");

        return lModulePages.ToString();
    }

    //[WebMethod]
    //public static string GetListeCargoMAWB(int CitySNo, int ConsolidatorSNo, DateTime Date)
    //{
    //    StringBuilder myCurrentFrom = new StringBuilder();

    //    eCargoMAWBManagementWebUI ecargoMAWBManagementWebUI = new eCargoMAWBManagementWebUI(null);
    //    ecargoMAWBManagementWebUI.CreateGrid(myCurrentFrom, CitySNo, ConsolidatorSNo, Date);

    //    string str = myCurrentFrom.ToString();
    //    return str;
    //}
}
