using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;

namespace CargoFlash.Cargo.WebUI.EDI
{
    public class MOPManagementWebUI : BaseWebUISecureObject
    {
        public MOPManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "EDI";
                this.MyAppID = "MOP";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "MOP";
                    switch (DisplayMode)
                    {

                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateManageTrackingDetailsPage());
                            break;
                    }

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return container;
        }
        public StringBuilder CreateManageTrackingDetailsPage()
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liPT' class='k-state-active'>C2K</li>
               
                              
            </ul>
            <div id='divTab1'> 
              <span id='spnPT'>");
            // containerLocal.Append(container);

            containerLocal.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
            containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
            containerLocal.Append("<table class='WebFormTable'>");
            containerLocal.Append("<tr><td class='formSection' colspan='6'>C2K Process</td>");

            containerLocal.Append("<tr><td style='width:33%;text-align:right;font-weight: bold;'>AWB No.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td style='width:33%;'><input type='text' class='k-input' name='AWB' id='AWB' style='width: 100px; text-transform: uppercase;' controltype='uppercase' allowchar='-0123456789' data-valid='maxlength[12],minlength[12],required' data-valid-msg='AWB No cannot be blank. Minimum 12 Characters required' tabindex='1' maxlength='12' data-role='alphabettextbox' autocomplete='off'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' tabindex='2' value='Search' text='Search' class='btn btn-success' onClick='MOPProcess()' id='btnMOPProcess'></td><td style='width:33%;' colspan='2'></td>");


            containerLocal.Append("</tr><tr><td colspan='6'><div id='divTracking' style='width:100%'></div></td></tr></table>");
            //containerLocal.Append("<div id='divTracking' style='width:100%'></div>");
            //containerLocal.Append("<div id='divhtml' style='width:100%'></div>");
            containerLocal.Append("<div id='divTrackingTrans' style='width:100%'></div>");
            containerLocal.Append("</span></div> </div> </div>");

         
            return containerLocal;

        }
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                // if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
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

            }
            return strContent;
        }
    }
}
