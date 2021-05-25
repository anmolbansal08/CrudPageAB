<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Routing" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="CargoFlash.Cargo.Business" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e)
    {
        // Code that runs on application startup
        CargoFlashCargoWebApps.RouteConfig.RegisterRoutes(System.Web.Routing.RouteTable.Routes);
        CargoFlashCargoWebApps.BundleConfig.RegisterBundles(System.Web.Optimization.BundleTable.Bundles);
        CargoFlashCargoWebApps.FilterConfig.RegisterGlobalFilters(System.Web.Mvc.GlobalFilters.Filters);
        CargoFlash.Cargo.Business.Common.RefreshAutocompletes();
        RouteTable.Routes.MapHubs();
    }
    //public static void RegisterRoutes(RouteCollection routes)
    //{
    //    //routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
    //    //routes.MapRoute(
    //    //    "Blog",                                           // Route name
    //    //    "Archive/{entryDate}",                            // URL with parameters
    //    //    new { controller = "Archive", action = "Entry" }  // Parameter defaults
    //    //);
    //    //routes.MapRoute(
    //    //    "Default",                                              // Route name
    //    //    "{controller}/{action}/{id}",                           // URL with parameters
    //    //    new { controller = "Home", action = "Index", id = "" }  // Parameter defaults
    //    //);
    //    //routes.MapPageRoute("", "{controller}/{action}/{id}", "~/Default.aspx");    
    //}

    protected void Application_BeginRequest(object sender, EventArgs e)
    {
        if (HttpContext.Current.Request.FilePath == "/")
        {
            // Response.Redirect("~/Account/GarudaLogin.cshtml");
        }
        HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
        if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
        {
            HttpContext.Current.Response.AddHeader("Cache-Control", "no-cache");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
            HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
            HttpContext.Current.Response.End();
        }
    }
    protected void Application_EndRequest(object sender, EventArgs e)
    {
        HttpContext.Current.ApplicationInstance.CompleteRequest();
    }
    void Application_End(object sender, EventArgs e)
    {
        //  Code that runs on application shutdown
    }
    void Application_Error(object sender, EventArgs e)
    {
        //// Code that runs when an unhandled error occurs

        //// Get the exception object.
        //Exception exc = Server.GetLastError();

        //// Handle HTTP errors
        //if (exc.GetType() == typeof(HttpException))
        //{
        //    // The Complete Error Handling Example generates
        //    // some errors using URLs with "NoCatch" in them;
        //    // ignore these here to simulate what would happen
        //    // if a global.asax handler were not implemented.
        //    if (exc.Message.Contains("NoCatch") || exc.Message.Contains("maxUrlLength"))
        //        return;

        //    //Redirect HTTP errors to HttpError page
        //    Server.Transfer("/errorpage.html");
        //}

        //// For other kinds of errors give the user some information
        //// but stay on the default page
        //Response.Write("<h2>Global Page Error</h2>\n");
        //Response.Write(
        //    "<p>We apologize for the inconvenience, an error occurred while processing your request.</p>\n");
        //Response.Write("Return to the <a href='/Default.cshtml'>" +
        //    "Default Page</a>\n");

        //// Log the exception and notify system operators
        //ExceptionUtility.LogException(exc, "DefaultPage");
        //ExceptionUtility.NotifySystemOps(exc);

        //// Clear the error from the server
        //Server.ClearError();
    }
    void Session_Start(object sender, EventArgs e)
    {
        // Code that runs when a new session is started
    }
    void Session_End(object sender, EventArgs e)
    {

        var userSNo =string.IsNullOrEmpty(Convert.ToString(Session["UserSNoSignedOut"]))? 0: (int)Session["UserSNoSignedOut"];       

        //CargoFlash.Cargo.DataService.Common.CommonService.UserSignOutOrSessionExpire(Convert.ToInt32(0),userSNo);
        //CargoFlash.Cargo.DataService.Common.CommonService obj = new CargoFlash.Cargo.DataService.Common.CommonService();
        Common.UserSignOutOrSessionExpire(userSNo, Session.SessionID);

        //Added by Braj 
        // This is used for temperary purpose only for autocomplete testing 
        CargoFlash.Cargo.Business.Common.RefreshAutocompletes();


        // Added by Anand
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.
        //if (Session["UserDetail"] != null) return;
        //this.Context.Server.Transfer("~/Account/Login.cshtml");
    }

</script>
