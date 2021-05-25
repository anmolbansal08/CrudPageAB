<%@ Application Language="C#" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e)
    {
        // Code that runs on application startup
        CargoFlashCargoWebApps.RouteConfig.RegisterRoutes(System.Web.Routing.RouteTable.Routes);
        CargoFlashCargoWebApps.BundleConfig.RegisterBundles(System.Web.Optimization.BundleTable.Bundles);
    
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
            Response.Redirect("~/Account/GarudaLogin.cshtml");
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
        // Code that runs when an unhandled error occurs
    }
    void Session_Start(object sender, EventArgs e)
    {
        // Code that runs when a new session is started
    }
    void Session_End(object sender, EventArgs e)
    {
        // Added by Anand
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.
        //if (Session["UserDetail"] != null) return;
        //this.Context.Server.Transfer("~/Account/Login.cshtml");
    }       
</script>
