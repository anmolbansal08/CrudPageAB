using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Diagnostics;

namespace CargoFlashCargoWebApps
{
    public class PageAccessLogAttribute : FilterAttribute, IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
            
        }

        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                CargoFlash.Cargo.DataService.LoginService ls = new CargoFlash.Cargo.DataService.LoginService();

                CargoFlash.Cargo.Model.PageAccessLogModel p = new CargoFlash.Cargo.Model.PageAccessLogModel();
                p.UserSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
                p.UserID = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName;
                p.CityCode = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode;
                p.Module = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
                p.AppName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
                p.FormAction = filterContext.ActionDescriptor.ActionName;
                //string ipAddress = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_FORWARDED_FOR"];
                string ipAddress = System.Web.HttpContext.Current.Request.UserHostAddress;
                p.IPAddress = ipAddress;
                p.HostName = System.Web.HttpContext.Current.Request.UserHostName;
                p.Browser = HttpContext.Current.Request.Browser.Type;
                p.URL = System.Web.HttpContext.Current.Request.Url.OriginalString;

                ls.SetPageAccessLogNew(p);
            }
            catch(Exception ex)
            {

            }
        }

    }
}