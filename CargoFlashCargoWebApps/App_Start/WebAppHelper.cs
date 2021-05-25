using CargoFlash.Cargo.DataService.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CargoFlashCargoWebApps.App_Start
{
    public class WebAppHelper
    {

        public static string GetLoginPage()
        {
            CommonService CS = new CargoFlash.Cargo.DataService.Common.CommonService();
            string loginPage = CS.GetSystemSetting("LoginPage");            
            return "/Account/" + loginPage;
        }


    }
}