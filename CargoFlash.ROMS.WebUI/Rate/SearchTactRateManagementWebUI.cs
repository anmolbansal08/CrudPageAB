using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Data;
using System.Net;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Rate;
using System.Collections;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.WebUI;
using System.Web;


namespace CargoFlash.Cargo.WebUI.Rate
{

    #region ManageClassRateManagementWebUI Description
    /*
	*****************************************************************************
	Class Name:      SearchTactRateManagementWebUI   
	Purpose:		This Class used to get Tact Rate 
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shahbaz Akhtar
	Created On:		14 JUN  2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class SearchTactRateManagementWebUI : BaseWebUISecureObject
    {
         public SearchTactRateManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "SearchTactRate";
                this.MyPrimaryID = "Sno";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
         public SearchTactRateManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "SearchTactRate";
                this.MyPrimaryID = "Sno";
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
                     htmlFormAdapter.HeadingColumnName = "SearchTactRate";
                     switch (DisplayMode)
                     {
                        
                         case DisplayModeNew:
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             container.Append("<div id='divRateCondition' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblManageRateCondition' border=1 class='WebFormTable'></table></span></div>");
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
             return container;
         }
         public StringBuilder CreateWebForm(StringBuilder container)
         {
             try
             {
                 if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                 {
                     //Set the display Mode form the URL QuesyString.
                     this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                     //Match the display Mode of the form.
                     switch (this.DisplayMode)
                     {
                        
                         case DisplayModeNew:
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

             }
             return container;
         }

    }
}
