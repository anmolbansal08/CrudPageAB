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
using CargoFlash.Cargo.Model.Master;
using System.Collections;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Shipment
{
   public class UCMInOutAlertManagementWebUI :BaseWebUISecureObject
    {
        public UCMInOutAlertManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Shipment";
                this.MyAppID = "UCMINOUTALERT";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public UCMInOutAlertManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Shipment";
                this.MyAppID = "UCMINOUTALERT";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }


        //public StringBuilder CreateGrid(StringBuilder container)
        //{
        //    StringBuilder containerLocal = new StringBuilder();
        //    containerLocal.Append(@"<div id='div1'>");
        //    containerLocal.Append(container);
        //    containerLocal.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
        //    containerLocal.Append("<div id='div2'>");
        //    containerLocal.Append("<table class='WebFormTable' validateonsubmit='true' id='tblUcmInOut'> <tbody>");
        //    containerLocal.Append("</tbody></table></div>");
        //    containerLocal.Append("</div>");
        //    return containerLocal;
        //}

        //public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        //{
        //    try
        //    {
        //        using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
        //        {
        //            htmlFormAdapter.CurrentPage = this.CurrentPageContext;
        //            switch (DisplayMode)
        //            {
        //                case DisplayModeReadView:
        //                    container.Append(CreateGrid(htmlFormAdapter.InstantiateIn()));
        //                    break;
        //                default:
        //                    break;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //    return container;
        //}
        //public StringBuilder CreateWebForm(StringBuilder container)
        //{
        //    StringBuilder strContent = new StringBuilder();
        //    try
        //    {
        //        if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
        //        {
        //            //Set the display Mode form the URL QuesyString.
        //            this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
        //            //Match the display Mode of the form.
        //            switch (this.DisplayMode)
        //            {
        //                case DisplayModeReadView:
        //                    BuildFormView(this.DisplayMode, container);
        //                    break;
        //                default:
        //                    break;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    }
        //    return strContent;
        //}
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "SNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            //htmlFormAdapter.objFormData = GetFlightRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            //htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            //htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<table id='xyz'><tr><td></td></tr></table>");
                            //container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnCountryVatSno' name='hdnCountryVatSno' type='hidden' value='" + ((CargoFlash.Cargo.Model.Master.Country)(htmlFormAdapter.objFormData)).SNo + "'/><table id='tblCountryVat'></table>");
                            break;
                        case DisplayModeDuplicate:
                            //htmlFormAdapter.objFormData = GetCountryRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            // htmlFormAdapter.objFormData = GetFlightRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = GetFlightRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());

                            //htmlFormAdapter.objFormData = GetCountryRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<table id='xyz'><tr><td></td></tr></table>");
                            //container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCountryVatSno' name='hdnCountryVatSno' type='hidden' value='" + ((CargoFlash.Cargo.Model.Master.Country)(htmlFormAdapter.objFormData)).SNo + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblCountryVat'></table>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            //htmlFormAdapter.objFormData = GetCountryRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    //<input type='button' id='btnRefresh' value='Refresh'>&nbsp;&nbsp;&nbsp;&nbsp;Auto Refresh in Next 10 Seconds <span id='countdownElements'></span>
                    container.Append(@"<table id='tblUCMInOutAlert'><div style=height:10px' /></table><table id='tblMessageType'></table>");
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
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            //strContent = CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            // BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            //BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            // BuildFormView(this.DisplayMode, container);
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
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:

                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:

                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        //UpdateCountry(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        //DeleteCountry(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
    }
}
