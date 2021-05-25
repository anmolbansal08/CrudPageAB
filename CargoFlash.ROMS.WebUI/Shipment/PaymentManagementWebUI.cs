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
using CargoFlash.Cargo.Model.Shipment;
using System.Collections;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.WebUI.Shipment
{
    #region Product Class Description
    /*
	*****************************************************************************
	Class Name:		PaymentManagementWebUI      
	Purpose:		This Class used to get details of Payment save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta.
	Created On:		29 Dec 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class PaymentManagementWebUI : BaseWebUISecureObject
    {
        public object GetPayment()
        {
            object Product = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Payment PaymentList = new Payment();
                    object obj = (object)PaymentList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("InvoiceType", System.Web.HttpContext.Current.Request.QueryString["InvoiceType"]);
                    Product = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return Product;
        }

        public object GetReceipt()
        {
            object Product = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Payment PaymentList = new Payment();
                    object obj = (object)PaymentList;
                    Product = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "Receipt");
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

            } return Product;
        }

        public PaymentManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "Payment";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public PaymentManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.cshtml";
                this.MyModuleID = "Shipment";
                this.MyAppID = "Payment";
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
                    htmlFormAdapter.HeadingColumnName = "AWBNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetReceipt();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(GetChargeNotePrintRecord(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetPayment();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetPayment();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(@"<div id='AmountCalculateDiv'></div>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetPayment();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
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
                        //case DisplayModeIndexView:
                        //    CreateGrid(container);
                        //    break;
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
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

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    //case DisplayModeSave:
                    //    SavePayment();
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    //    break;
                    //case DisplayModeSaveAndNew:
                    //    SavePayment();
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    //    break;
                    case DisplayModeUpdate:
                        SavePayment(System.Web.HttpContext.Current.Request.QueryString["RecID"], System.Web.HttpContext.Current.Request.QueryString["InvoiceType"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteProduct(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PrimaryID = this.MyPrimaryID;
                    g.GridID = "FirstGrid";
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.SuccessGrid = "ChangeActionName";
                    //g.CommandButtonNewText = "Payment";
                    g.FormCaptionText = "Invoice Payment";              
                    g.EditName = "Payment";
                    g.IsDisplayOnly = false;
                    g.IsShowDelete = false;
                    g.ServiceModuleName = this.MyModuleID;
                    g.IsAllowedGrouping = true;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                  //  g.Column.Add(new GridColumn { Field = "InvoiceNo", Title = "Invoice No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InvoiceDate", Title = "Invoice Date", DataType = GridDataType.Date.ToString(), Template = "# if( InvoiceDate==null) {# # } else {# #= kendo.toString(new Date(data.InvoiceDate.getTime() + data.InvoiceDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No/ULD No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "HAWBNO", Title = "House No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DONo", Title = "DO No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DOSNo", Title = "DOSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "DBNo", Title = " Delivery Bill No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ProcessName", Title = "Process Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "InvoiceType", Title = "InvoiceType", DataType = GridDataType.String.ToString(), IsHidden = true });
                    //g.Column.Add(new GridColumn { Field = "AccountNo", Title = "Account No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DB_btn_Hide", Title = "DB_btn_Hide", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccountName", Title = "Bill To", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ShipmentType", Title = "Shipment Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalReceivable", Title = "Total Receivable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "BalanceReceivable", Title = "Balance Receivable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PaymentReceivable", Title = "Payment Receivable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "I_btn_Hide", Title = "I_btn_Hide", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn
                    {
                        Field = "InvoiceNo",
                        Title = "Print Invoice",
                        DataType = GridDataType.String.ToString(),
                        Width = 100,
                        Template =
                            "# if( DB_btn_Hide==1) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"DB\" title=\"Delivery Bill\" onclick=\"PrintSlip(#=SNo#,#=InvoiceType#);\" />&nbsp;&nbsp; #} # # if( DOSNo==0) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" title=\"DELIVERY ORDER\" onclick=\"Print(#=DOSNo#);\" />&nbsp;&nbsp; #} # # if( I_btn_Hide==1) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"I\" title=\"EXPORT INVOICE\" onclick=\"PrintInvoice(#=SNo#,#=InvoiceType#);\" />&nbsp;&nbsp; #} #"
                    });
                    g.QueryString.Add("InvoiceType");
                    //g.Action = new List<GridAction>();
                    //g.Action.Add(new GridAction { ButtonCaption = "Payment", ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "EDIT", ModuleName = this.MyModuleID });
                    g.InstantiateIn(Container);
                }
                StringBuilder strcontent = new StringBuilder();
                using (Grid g1 = new Grid())
                {
                    g1.PrimaryID = "SNo";
                    g1.GridID = "SecondGrid";
                    g1.PageName = this.MyPageName;
                    g1.ModuleName = this.MyModuleID;
                    g1.AppsName = this.MyAppID;
                    g1.ReadName = "Receipt";
                    g1.FormCaptionText = "Receipt";
                    g1.IsShowDelete = false;
                    g1.IsShowEdit = false;
                    g1.IsDisplayOnly = false;
                    g1.ServiceModuleName = "Receipt";
                    g1.DataSoruceUrl = "Services/Shipment/PaymentService.svc/GetGridDataReceipt";
                    g1.ServiceModuleName = "Print";
                    g1.IsAllowedGrouping = true;
                    g1.SuccessGrid = "ChangeActionName1";
                    //g1.IsAllowedFiltering = false;
                    g1.IsVirtualScroll = false;
                    g1.IsActionRequired = false;
                    g1.ProcessName = "";

                    g1.Column = new List<GridColumn>();
                    g1.Column.Add(new GridColumn { Field = "ReceiptNo", Title = "Receipt No", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "ReceiptDate", Title = "Receipt Date", DataType = GridDataType.Date.ToString(), Template = "# if( ReceiptDate==null) {# # } else {# #= kendo.toString(new Date(data.ReceiptDate.getTime() + data.ReceiptDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                   // g1.Column.Add(new GridColumn { Field = "InvoiceNo", Title = "Invoice No", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No/ULD No", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "HAWBNO", Title = "House No", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "DONo", Title = "DO No", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "DOSNo", Title = "DOSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g1.Column.Add(new GridColumn { Field = "DBNo", Title = " Delivery Bill No", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "InvoiceSNo", Title = "InvoiceSNo", DataType = GridDataType.String.ToString(),IsHidden=true });
                    g1.Column.Add(new GridColumn { Field = "DB_btn_Hide", Title = "DB_btn_Hide", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g1.Column.Add(new GridColumn { Field = "I_btn_Hide", Title = "I_btn_Hide", DataType = GridDataType.String.ToString(), IsHidden = true });
                  //  g1.Column.Add(new GridColumn { Field = "InvoiceSNo", Title = "InvoiceSNo", DataType = GridDataType.String.ToString()});
                    //g1.Column.Add(new GridColumn { Field = "AccountNo", Title = "Account No", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "AccountName", Title = "Bill To", DataType = GridDataType.String.ToString() });
                    //Added By Shivali Thakur
                    g1.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "ShipmentType", Title = "Shipment Type", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "TotalReceivable", Title = "Total Receivable", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn { Field = "PaidAmount", Title = "Paid Amount", DataType = GridDataType.String.ToString() });
                    g1.Column.Add(new GridColumn
                    {
                        Field = "ReceiptNo",
                        Title = "Print Receipt",
                        DataType = GridDataType.String.ToString(),
                        Width = 100,
                        Template = "<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"PR\" title=\"Receipt Note- Bill\" onclick=\"PaymentReceiptPrintSlip(#=SNo#);\" />&nbsp;&nbsp; # if( DB_btn_Hide==1) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"DB\" title=\"DELIVERY BILL\" onclick=\"PrintSlip(#=InvoiceSNo#,#=InvoiceType#);\" />&nbsp;&nbsp;#} # # if( DOSNo==0) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" onclick=\"Print(#=DOSNo#,#=InvoiceSNo#);\" />#} # # if( I_btn_Hide==1) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"I\" title=\"EXPORT INVOICE\" onclick=\"PrintInvoice(#=InvoiceSNo#,#=InvoiceType#);\" />#} #"
                    });


                    //g1.Action = new List<GridAction>();
                    //g1.Action.Add(new GridAction { ButtonCaption = "Receipt", ActionName = "READ", AppsName = "Receipt", CssClassName = "Read", ModuleName = "Receipt" });
                    //g1.Action.Add(new GridAction { ActionName = "PRINT", AppsName = "PRINT", CssClassName = "print", ModuleName = this.MyModuleID });
                    //g1.IsToggleColumns = false;
                    g1.InstantiateIn(strcontent);
                }
                Container.Append(strcontent);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return Container;
        }

        private void SavePayment(string RecordID, string InvoiceType)
        {
            try
            {
                List<Payment> listPayment = new List<Payment>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Payment = new Payment
                {
                    SNo = Convert.ToInt32(RecordID),
                    PaymentAmmount = string.IsNullOrEmpty(FormElement["PaymentAmmount"]) == true ? 0 : Convert.ToDecimal(FormElement["PaymentAmmount"].ToString()),
                    // PaymentMode = Decimal.Parse(FormElement["Priority"] == "" ? "0" : FormElement["Priority"]),
                    PaymentMode = string.IsNullOrEmpty(FormElement["PaymentMode"]) == true ? 0 : Convert.ToInt32(FormElement["PaymentMode"].ToString()),
                    PaymentDate = Convert.ToDateTime(FormElement["PaymentDate"].ToString()),
                    PaymentReference = FormElement["PaymentReference"].ToString(),
                    AWBNo = string.IsNullOrEmpty(FormElement["AWBNo"]) == true ? "" : FormElement["AWBNo"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),

                    //added by pankaj khanna
                    InvoiceType = InvoiceType,
                    Text_CreditNote = string.IsNullOrEmpty(FormElement["CreditNote"]) == true ? "" : FormElement["CreditNote"].ToString(),
                    ChequeNo = string.IsNullOrEmpty(FormElement["ChequeNo"]) == true ? "" : FormElement["ChequeNo"].ToString().ToUpper(),
                    ChequeAmmount = string.IsNullOrEmpty(FormElement["ChequeAmmount"]) == true ? 0 : Convert.ToDecimal(FormElement["ChequeAmmount"].ToString()),
                    ChequeAccountName = string.IsNullOrEmpty(FormElement["ChequeAccountName"]) == true ? "" : FormElement["ChequeAccountName"].ToString(),
                    ChequeDate = string.IsNullOrEmpty(FormElement["ChequeDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ChequeDate"].ToString()),
                    BankName = string.IsNullOrEmpty(FormElement["BankName"]) == true && string.IsNullOrEmpty(FormElement["BankNameCard"]) == false ? FormElement["BankNameCard"].ToString() : string.IsNullOrEmpty(FormElement["BankName"]) == false && string.IsNullOrEmpty(FormElement["BankNameCard"]) == true ? FormElement["BankName"].ToString():"",
                    BranchName = string.IsNullOrEmpty(FormElement["BranchName"]) == true ? "" : FormElement["BranchName"].ToString(),
                    SessionCitySNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString(),

                    CardNumber = string.IsNullOrEmpty(FormElement["CardNumberCard"]) == true ? "" : FormElement["CardNumberCard"].ToString().ToUpper(),
                    CardType = string.IsNullOrEmpty(FormElement["IsCard"]) == true ? "" : FormElement["IsCard"].ToString().ToUpper(),
                    VirtualAccountNo = FormElement["VirtualAccountNo"].ToString(),
                    OfficeSno = string.IsNullOrEmpty(FormElement["OfficeSno"]) == true ? 0 : Convert.ToInt32(FormElement["OfficeSno"].ToString())
                  
                };
                listPayment.Add(Payment);
                object datalist = (object)listPayment;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
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

        private void UpdateProduct(string RecordID)
        {
            try
            {
                List<Payment> listPayment = new List<Payment>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Payment = new Payment
                {
                    //SNo = Convert.ToInt32(RecordID),
                    //ProductName = FormElement["ProductName"],
                    //Priority = Decimal.Parse(FormElement["Priority"] == "" ? "0" : FormElement["Priority"]),
                    //IsDefault = FormElement["IsDefault"] == "0",
                    //IsActive = FormElement["IsActive"] == "0",
                    //IsExpress = FormElement["IsExpress"] == "0",
                    //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listPayment.Add(Payment);
                object datalist = (object)listPayment;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
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

        private void DeleteProduct(string RecordID)
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
        public StringBuilder GetCurrencyByID()
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            //                <li id='liCT'>Consolidated Tracking</li>
            containerLocal.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li id='liCT' onclick='javascript:onclickliCT() ;'>Consolidated History</li>
                <li  id='liPT'>Process History</li>
                <li id='liET' onclick='javascript:onclickliET() ;'>EDI Message History</li>
               
                <li id='liFT' onclick='javascript:onclickliFT() ;'>Flight History</li>
                <li id='liFT'>ULD History</li>
                              
            </ul>");


           
            containerLocal.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
            containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
            containerLocal.Append("</span></div></div> </div>");
            return containerLocal;
        }
        public StringBuilder GetChargeNotePrintRecord(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
        <div id='MainDiv' align='center'>
            <div id='ApplicationTabs'>
            
            </div>  </div>
              ");
            //containerLocal.Append(container);
            //            containerLocal.Append(@"</span> 
            //            </div>
            //            <div id='divTab2' >
            //              <input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCustomerSNo' name='hdnCustomerSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCustomerName' name='hdnCustomerName' type='hidden' value=''/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblCustomerAddress'></table></div>");
            //            containerLocal.Append(@"<div id='divTab3'>");
            //            HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(MyModuleID);
            //            containerLocal.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "AuthorizedPersonal"));
            //            //containerLocal.Append(@"<input type='button' value='Save' class='btn btn-block btn-success btn-sm' id='btnSaveAttachement' onclick='SaveAttachment()'/><div ///id='divImage'></div></div>");
            return containerLocal;
        }
    }
}
