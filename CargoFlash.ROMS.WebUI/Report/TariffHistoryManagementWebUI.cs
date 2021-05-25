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
    #region Tariff History Class Description
    /*
	*****************************************************************************
	Class Name:		TariffHistoryManagementWebUI      
	Purpose:		This Class used to get details Tariff History
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		18 June 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class TariffHistoryManagementWebUI : BaseWebUISecureObject
    {
        public TariffHistoryManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Report";
                this.MyAppID = "TariffHistory";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public TariffHistoryManagementWebUI(Page PageContext)
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
                this.MyAppID = "TariffHistory";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public object GetRecordTariffHistory()
        {
            object TariffHistory = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        TariffHistory TariffHistoryList = new TariffHistory();
                        object obj = (object)TariffHistoryList;

                        TariffHistory = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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
            return TariffHistory;
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "TariffHistory";
                    switch (DisplayMode)
                    {
                        //case DisplayModeReadView:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        //    htmlFormAdapter.objFormData = GetRecordBackLogCargo();
                        //    htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                        //    htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;

                        //case DisplayModeDuplicate:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        //    htmlFormAdapter.objFormData = GetRecordBackLogCargo();
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        //case DisplayModeEdit:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                        //    htmlFormAdapter.objFormData = GetRecordBackLogCargo();
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        //case DisplayModeDelete:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                        //    htmlFormAdapter.objFormData = GetRecordBackLogCargo();
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        default:
                            break;
                    }
                    container.Append("<div id='divTariffHistory'></div><table id='tblTariffHistory'></table>");
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
                        //case DisplayModeIndexView:
                        //    CreateGrid(container);
                        //    break;
                        //case DisplayModeReadView:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        //case DisplayModeEdit:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        //case DisplayModeDuplicate:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        //case DisplayModeDelete:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
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
