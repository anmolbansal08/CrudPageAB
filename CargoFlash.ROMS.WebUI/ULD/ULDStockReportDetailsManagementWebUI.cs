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
using CargoFlash.Cargo.Model.ULD;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web;
using System.Configuration;



namespace CargoFlash.Cargo.WebUI.ULD
{
    public class ULDStockReportDetailsManagementWebUI : BaseWebUISecureObject
    {
        /*
        *****************************************************************************
        ManagementWebUI Name:		  ULDStockReportDetailsManagementWebUI
        Purpose:		              Only View 
        Company:		              CargoFlash Infotech Pvt Ltd.
        Author:			              Sushant Kumar Nayak
        Created On:		              18-11-2017
        Updated By:    
        Updated On:
        Approved By:
        Approved On:
        *****************************************************************************
        */

        public ULDStockReportDetailsManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDStockReportDetails";
                this.MyPrimaryID = "ULDStockReportDetailsSNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public ULDStockReportDetailsManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDStockReportDetails";
                this.MyPrimaryID = "ULDStockReportDetailsSNo";
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
                    htmlFormAdapter.HeadingColumnName = "";
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
                    container.Append("<div id='DivULDStockReportDetailsService'></div><table id='tblULDStockReportDetailsService'></table>");
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
            StringBuilder strContent = new StringBuilder();
            try
            {
                //Set the display Mode form the URL QuesyString.
                this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                //Match the display Mode of the form.
                switch (this.DisplayMode)
                {
                    case DisplayModeIndexView:
                        // strContent = CreateGrid(container);
                        break;
                    case DisplayModeDuplicate:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeReadView:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeEdit:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeNew:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeDelete:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    default:
                        break;
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
