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
using CargoFlash.Cargo.Model.Tariff;
using System.Collections;
using System.Web;
using CargoFlash.Cargo.WebUI;
namespace CargoFlash.Cargo.WebUI.Tariff
{
    #region Charges Class Description
    /*
	*****************************************************************************
	Class Name:		ChargesManagementWebUI      
	Purpose:		This Class used to get details of Charges save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		26 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    public class HandlingChargesManagementWebUI : BaseWebUISecureObject
    {
        public object GetHandlingChargesRecord()
        {
            object Charges = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    HandlingCharges ChargesList = new HandlingCharges();
                    object obj = (object)ChargesList;
                    Charges = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Messgae: Record not found.
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return Charges;
        }

        private DataTable GetHandlingChargesTransRecord()
        {
            object tariffforwardrateTrans = null;
            DataTable dtCreateTariffForwardRateTransRecord = null;
            if ((!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"])))
            {
                List<HandlingChargesTrans> tariffforwardTransList = new List<HandlingChargesTrans>();
                object obj = (object)tariffforwardTransList;

                tariffforwardrateTrans = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "HandlingChargesTrans");
                dtCreateTariffForwardRateTransRecord = BaseWebUISecureObject.ConvertToDataTable((List<HandlingChargesTrans>)tariffforwardrateTrans);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dtCreateTariffForwardRateTransRecord;
        }

        public HandlingChargesManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Tariff";
                this.MyAppID = "HandlingCharges";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public HandlingChargesManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Tariff";
                this.MyAppID = "HandlingCharges";
                this.MyPrimaryID = "SNo";
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
                    htmlFormAdapter.HeadingColumnName = "ChargeName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetHandlingChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.objDataTable = GetHandlingChargesTransRecord();
                            container.Append(htmlFormAdapter.TransInstantiateWithHeader("Tariff", "HandlingChargesTrans", "Read"));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetHandlingChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);                           
                            container.Append(htmlFormAdapter.InstantiateIn());
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.objDataTable = GetHandlingChargesTransRecord();
                            container.Append(htmlFormAdapter.TransInstantiateWithHeader("Tariff", "HandlingChargesTrans", ValidateOnSubmit: true));                           
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetHandlingChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                            container.Append(htmlFormAdapter.InstantiateIn());
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.objDataTable = GetHandlingChargesTransRecord();
                            container.Append(htmlFormAdapter.TransInstantiateWithHeader("Tariff", "HandlingChargesTrans", ValidateOnSubmit: true));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(htmlFormAdapter.TransInstantiateWithHeader("Tariff", "HandlingChargesTrans", ValidateOnSubmit: true));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetHandlingChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.objDataTable = GetHandlingChargesTransRecord();
                            container.Append(htmlFormAdapter.TransInstantiateWithHeader("Tariff", "HandlingChargesTrans", "Read"));
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
            StringBuilder strContent = new StringBuilder();
            try
            {
                //Set the display Mode form the URL QuesyString.
                this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                //Match the display Mode of the form.
                switch (this.DisplayMode)
                {
                    case DisplayModeIndexView:
                        strContent = CreateGrid(container);
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

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Charge";
                    g.FormCaptionText = "Handling Charges";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsShowDelete = false;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "ChargeName", Title = "Charge Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Ratetype", Title = "Rate Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InvoiceGroup", Title = "Invoice Group", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Chargetype", Title = "Charge Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_ChargeCategory", Title = "Charge Category", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return Container;
        }

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                if (OperationMode.Contains("UPDATE"))
                    OperationMode = OperationMode.Replace("UPDATE", "EDIT");
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:                       
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;

                    case DisplayModeDelete:
                        DeleteHandlingCharges(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                    case DisplayModeEdit:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDuplicate:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        private void DeleteHandlingCharges(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
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
