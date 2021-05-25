using System.Web;
using System.Web.Mvc;

namespace CargoFlash.Cargo.Web.API
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}