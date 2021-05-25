using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Data;
using System.Net;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Report;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Report
{
    #region Credit Limit Transaction Report Class Description
    /*
	*****************************************************************************
	Class Name:	    CreditLimitTransactionReportManagementWebUI      
	Purpose:		This Class used to get details Credit Limit
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Pankaj Khanna
	Created On:	    02 JAN 2017
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class CreditLimitTransactionReportManagementWebUI : BaseWebUISecureObject
    {
        public CreditLimitTransactionReportManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Report";
                this.MyAppID = "CreditLimitTransactionReport";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public CreditLimitTransactionReportManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }

                this.MyPrimaryID = "SNo";
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Report";
                this.MyAppID = "CreditLimitTransactionReport";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public object GetRecordCreditLimitTransactionReport()
        {
            object CreditLimitTransactionReport = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        CreditLimitTransactionReport CreditLimitTransactionReportList = new CreditLimitTransactionReport();
                        object obj = (object)CreditLimitTransactionReportList;

                        CreditLimitTransactionReport = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                        this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                    }
                    else
                    {
                        //Error Messgae: Record not found.
                    }
                }

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return CreditLimitTransactionReport;
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "CreditLimitTransactionReport";
                    switch (DisplayMode)
                    {
                        
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                       
                        default:
                            break;
                    }
                    container.Append("<div id='divCreditLimitTransactionReport'></div><table id='tblCreditLimitTransactionReport'></table>");
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
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return container;
        }

    }
}
