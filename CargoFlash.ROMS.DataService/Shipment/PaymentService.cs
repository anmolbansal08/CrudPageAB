using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Xml.Linq;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    #region Airline Service Description
    /*
	*****************************************************************************
	Service Name:	AirlineService      
	Purpose:		This Service used to get details of Airline save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class PaymentService : BaseWebUISecureObject, IPaymentService
    {
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, bool IsSubModule = true, string searchAWBNo = "", string PaymentOption = "", string searchinvoiceno = "", string searchFromDate = "", string searchToDate = "")
        {
            //LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).AirportCode;
            //SearchIncludeTransitAWB = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).AirportCode;
            this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
            StringBuilder myCurrentForm = new StringBuilder();
            switch (this.DisplayMode)
            {
                case DisplayModeEdit:
                //using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                //{
                //    htmlFormAdapter.objFormData = GetPayment();
                //    htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                //    myCurrentForm.Append(htmlFormAdapter.InstantiateIn());
                //    myCurrentForm.Append(@"<div id='AmountCalculateDiv'></div>");

                //}
                //break;

                case DisplayModeIndexView:
                    switch (processName)
                    {
                        case "InvoicePayment":
                            if (appName.ToUpper().Trim() == "INVOICEPAYMENT")
                            {

                                CreateGrid(myCurrentForm, processName, PaymentOption, searchinvoiceno, searchAWBNo, searchFromDate, searchToDate, isV2: true);

                            }
                            break;
                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }

        public Stream GetGridData(PaymentInvoiceSearch model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, PaymentOption: model.PaymentOption, searchAWBNo: model.searchAWBNo, searchinvoiceno: model.searchinvoiceno, searchFromDate: model.searchFromDate, searchToDate: model.searchToDate);
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string PaymentOption, string searchinvoiceno, string searchAWBNo, string searchFromDate, string searchToDate, bool isV2 = false)
        {
            using (Grid g = new Grid())
            {
                if (PaymentOption == "0")
                {
                    g.PrimaryID = "SNo";
                    g.GridID = "FirstGrid";
                    g.PageName = "Default.cshtml";
                    g.ModuleName = "Shipment";
                    g.AppsName = "Payment";
                    g.SuccessGrid = "ChangeActionName";
                    g.FormCaptionText = "Invoice Payment";
                    g.EditName = "Payment";
                    g.IsDisplayOnly = false;
                    g.IsShowDelete = false;
                    g.ServiceModuleName = this.MyModuleID;
                    g.IsAllowedGrouping = true;


                    g.DataSoruceUrl = "Services/Shipment/PaymentService.svc/GetInvoiceSearch";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);


                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
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
                    g.ExtraParam = new List<GridExtraParam>();

                    g.ExtraParam.Add(new GridExtraParam { Field = "searchinvoiceno", Value = searchinvoiceno });
                    g.ExtraParam.Add(new GridExtraParam { Field = "PaymentOption", Value = PaymentOption });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBNo", Value = searchAWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });

                    g.InstantiateIn(Container, isV2);
                }
                else
                {
                    g.PrimaryID = "SNo";
                    g.GridID = "SecondGrid";
                    g.PageName = "Default.cshtml";
                    g.ModuleName = "Shipment";
                    g.AppsName = "Payment";

                    g.ReadName = "Receipt";
                    g.FormCaptionText = "Receipt";
                    g.IsShowDelete = false;
                    g.IsShowEdit = false;
                    g.IsDisplayOnly = false;
                    g.ServiceModuleName = "Receipt";
                    g.DataSoruceUrl = "Services/Shipment/PaymentService.svc/GetInvoiceSearch";
                    g.ServiceModuleName = "Print";
                    g.IsAllowedGrouping = true;
                    g.SuccessGrid = "ChangeActionName1";
                    //g.IsAllowedFiltering = false;
                    g.IsVirtualScroll = false;
                    g.IsActionRequired = false;
                    g.ProcessName = "";


                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ReceiptNo", Title = "Receipt No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReceiptDate", Title = "Receipt Date", DataType = GridDataType.Date.ToString(), Template = "# if( ReceiptDate==null) {# # } else {# #= kendo.toString(new Date(data.ReceiptDate.getTime() + data.ReceiptDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    // g.Column.Add(new GridColumn { Field = "InvoiceNo", Title = "Invoice No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No/ULD No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "HAWBNO", Title = "House No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DONo", Title = "DO No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DOSNo", Title = "DOSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "DBNo", Title = " Delivery Bill No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InvoiceSNo", Title = "InvoiceSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "DB_btn_Hide", Title = "DB_btn_Hide", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "I_btn_Hide", Title = "I_btn_Hide", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccountName", Title = "Bill To", DataType = GridDataType.String.ToString() });
                    //Added By Shivali Thakur
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ShipmentType", Title = "Shipment Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalReceivable", Title = "Total Receivable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PaidAmount", Title = "Paid Amount", DataType = GridDataType.String.ToString() });

                    if (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["IsReceiptHide"].ToString().ToUpper().Trim() == "TRUE")
                    {
                        g.Column.Add(new GridColumn
                        {
                            Field = "ReceiptNo",
                            Title = "Print Receipt",
                            DataType = GridDataType.String.ToString(),
                            Width = 100,
                            Template = "&nbsp;&nbsp; # if( DB_btn_Hide==1) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"DB\" title=\"DELIVERY BILL\" onclick=\"PrintSlip(#=InvoiceSNo#,#=InvoiceType#);\" />&nbsp;&nbsp;#} # # if( DOSNo==0) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" onclick=\"Print(#=DOSNo#,#=InvoiceSNo#);\" />#} # # if( I_btn_Hide==1) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"I\" title=\"EXPORT INVOICE\" onclick=\"PrintInvoice(#=InvoiceSNo#,#=InvoiceType#);\" />#} #"
                        });
                    }
                    else
                    {
                        g.Column.Add(new GridColumn
                        {
                            Field = "ReceiptNo",
                            Title = "Print Receipt",
                            DataType = GridDataType.String.ToString(),
                            Width = 100,
                            Template = "<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"PR\" title=\"Receipt Note- Bill\" onclick=\"PaymentReceiptPrintSlip(#=SNo#);\" />&nbsp;&nbsp; # if( DB_btn_Hide==1) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"DB\" title=\"DELIVERY BILL\" onclick=\"PrintSlip(#=InvoiceSNo#,#=InvoiceType#);\" />&nbsp;&nbsp;#} # # if( DOSNo==0) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" onclick=\"Print(#=DOSNo#,#=InvoiceSNo#);\" />#} # # if( I_btn_Hide==1) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"I\" title=\"EXPORT INVOICE\" onclick=\"PrintInvoice(#=InvoiceSNo#,#=InvoiceType#);\" />#} #"
                        });
                    }

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchinvoiceno", Value = searchinvoiceno });
                    g.ExtraParam.Add(new GridExtraParam { Field = "PaymentOption", Value = PaymentOption });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBNo", Value = searchAWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });
                    g.InstantiateIn(Container, true);
                }
            }
        }

        public DataSourceResult GetInvoiceSearch(GetInvoiceSearch model, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                DataSet ds = new DataSet();
                if (model.searchAWBNo != "0" && model.searchinvoiceno != "0")
                {
                    model.searchinvoiceno = "0";
                    model.searchFromDate = "0";
                    model.searchToDate = "0";
                }

                if (model.searchAWBNo == "0" && model.searchinvoiceno != "0")
                {
                    model.searchAWBNo = "0";
                    model.searchFromDate = "0";
                    model.searchToDate = "0";
                }

                if (model.searchAWBNo == "0" && model.searchinvoiceno == "0" && model.searchFromDate == "0")
                {
                    model.searchAWBNo = "0";
                    model.searchFromDate = "0";

                }

                if (model.searchAWBNo == "0" && model.searchinvoiceno == "0" && model.searchFromDate != "0")
                {
                    model.searchAWBNo = "0";
                    model.searchinvoiceno = "0";

                }

                if (model.PaymentOption == "0")
                {
                    string sorts = GridSort.ProcessSorting(sort);
                    string filters = GridFilter.ProcessFilters<Payment>(filter);
                    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                    new SqlParameter("@PageSize", pageSize),
                    new SqlParameter("@WhereCondition", filters),
                    new SqlParameter("@OrderBy", sorts),/*For Multicity*/
                       new SqlParameter("@searchInvoiceno", model.searchinvoiceno),
                                            new SqlParameter("@searchAWBNo", model.searchAWBNo),
                                            new SqlParameter("@searchFromDate", model.searchFromDate),
                                            new SqlParameter("@searchToDate", model.searchToDate),
                    new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()),
                    new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPayment", Parameters);

                    var PaymentList = ds.Tables[0].AsEnumerable().Select(e => new Payment
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        InvoiceDate = DateTime.SpecifyKind(Convert.ToDateTime(e["InvoiceDate"]), DateTimeKind.Utc),
                        AWBNo = e["AWBNo"].ToString(),
                        AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                        TotalReceivable = Convert.ToString(e["TotalReceivable"]),
                        BalanceReceivable = Convert.ToString(e["BalanceReceivable"]),
                        PaymentReceivable = e["PaymentReceivable"].ToString(),

                        //Added By Pankaj Khanna
                        AccountName = e["AccountName"].ToString().ToUpper(),
                        AirlineName = e["AirlineName"].ToString().ToUpper(),

                        //Added By Shivali Thakur
                        ShipmentType = e["ShipmentType"].ToString().ToUpper(),
                        InvoiceType = e["InvoiceType"].ToString(),
                        ProcessName = e["ProcessName"].ToString().ToUpper(),
                        DONo = e["DONo"].ToString().ToUpper(),
                        DOSNo = e["DOSNo"].ToString().ToUpper(),
                        HAWBNO = e["HAWBNO"].ToString(),
                        DB_btn_Hide = Convert.ToInt16(e["DB_btn_Hide"]),
                        I_btn_Hide = Convert.ToInt16(e["I_btn_Hide"]),
                        DBNo = e["DBNo"].ToString().ToUpper(),
                    });
                    ds.Dispose();
                    return new DataSourceResult
                    {
                        Data = PaymentList.AsQueryable().ToList(),
                        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                    };
                }
                else
                {
                    string sorts = GridSort.ProcessSorting(sort);
                    string filters = GridFilter.ProcessFilters<PaymentReceipt>(filter);
                    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                    new SqlParameter("@PageSize", pageSize),
                    new SqlParameter("@WhereCondition", filters),
                    new SqlParameter("@OrderBy", sorts),/*For Multicity*/
                       new SqlParameter("@searchInvoiceno", model.searchinvoiceno),
                                            new SqlParameter("@searchAWBNo", model.searchAWBNo),
                                            new SqlParameter("@searchFromDate", model.searchFromDate),
                                            new SqlParameter("@searchToDate", model.searchToDate),
                    new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()),
                    new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListReceipt", Parameters);
                    var PaymentList = ds.Tables[0].AsEnumerable().Select(e => new PaymentReceipt
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        AccountName = e["AccountName"].ToString().ToUpper(),
                        AirlineName = e["AirlineName"].ToString().ToUpper(),
                        ShipmentType = e["ShipmentType"].ToString().ToUpper(),
                        ReceiptNo = e["ReceiptNo"].ToString(),
                        ReceiptDate = e["ReceiptDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ReceiptDate"]), DateTimeKind.Utc),
                        AWBNo = e["AWBNo"].ToString(),
                        TotalReceivable = Convert.ToString(e["TotalReceivable"]),
                        PaidAmount = Convert.ToString(e["PaidAmount"]),
                        PaymentReceivable = e["PaymentReceivable"].ToString(), 
                        InvoiceSNo = Convert.ToInt32(e["InvoiceSNo"]),
                        InvoiceType = Convert.ToInt32(e["InvoiceType"]),
                        DONo = e["DONo"].ToString().ToUpper(),
                        DOSNo = e["DOSNo"].ToString().ToUpper(),
                        HAWBNO = e["HAWBNO"].ToString(),
                        DB_btn_Hide = Convert.ToInt16(e["DB_btn_Hide"]),
                        I_btn_Hide = Convert.ToInt16(e["I_btn_Hide"]),
                        DBNo = e["DBNo"].ToString().ToUpper(),
                    });
                    ds.Dispose();
                    return new DataSourceResult
                    {
                        Data = PaymentList.AsQueryable().ToList(),
                        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                    };
                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public Payment GetPaymentRecord(int recordID, string UserID, string InvoiceType)
        {
            try
            {
                Payment Payments = new Payment();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                            new SqlParameter("@UserID", Convert.ToInt32(UserID)),
                                            new SqlParameter("@InvoiceType", Convert.ToInt32(InvoiceType)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordPayment", Parameters);
                if (dr.Read())
                {
                    Payments.SNo = Convert.ToInt32(dr["SNo"]);
                    Payments.AccountNo = dr["AccountNo"].ToString().ToUpper();
                    Payments.InvoiceNo = dr["InvoiceNo"].ToString();
                    Payments.AWBNo = dr["AWBNo"].ToString();
                    /*---------------------Added by Pankaj kumar ishwar-----------------------------*/
                    Payments.TotalReceivable = Convert.ToString(dr["TotalReceivable"]) + " " + Convert.ToString(dr["CurrencyCode"]);
                    Payments.BalanceReceivable = Convert.ToString(dr["BalanceReceivable"]) + " " + Convert.ToString(dr["CurrencyCode"]);
                    Payments.AccountName = dr["AccountName"].ToString().ToUpper();
                    Payments.AccountAddress = dr["AccountAddress"].ToString().ToUpper();
                    Payments.AccountCity = dr["AccountCity"].ToString().ToUpper();
                    Payments.AccountSNo = Convert.ToInt32(dr["AccountSNo"]);
                    Payments.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);

                    //Payment.TxtPaymentMode = "Cash";
                    Payments.PaymentMode = 1;
                    Payments.Text_PaymentMode = "Cash";
                    //Add By Sushant
                    Payments.VirtualAccountNo = "";
                    Payments.VirtualAccountNo1 = "";
                    if (InvoiceType == "2")
                    {
                        Payments.OfficeName = dr["Officename"].ToString().ToUpper();
                        Payments.OfficeSno = Convert.ToInt32(dr["OfficeSno"]);

                    }
                }
                dr.Close();
                return Payments;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public Payment GetReceiptRecord(int recordID, string UserID)
        {
            try
            {
                Payment Payment = new Payment();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordReceipt", Parameters);
                if (dr.Read())
                {
                    Payment.SNo = Convert.ToInt32(dr["SNo"]);
                    Payment.AccountNo = dr["AccountNo"].ToString().ToUpper();
                    Payment.InvoiceNo = dr["InvoiceNo"].ToString();
                    Payment.AWBNo = dr["AWBNo"].ToString();
                    Payment.TotalReceivable = Convert.ToString(dr["TotalReceivable"]);
                    Payment.BalanceReceivable = Convert.ToString(dr["BalanceReceivable"]);
                    Payment.AccountName = dr["AccountName"].ToString().ToUpper();
                    Payment.AccountAddress = dr["AccountAddress"].ToString().ToUpper();
                    Payment.AccountCity = dr["AccountCity"].ToString().ToUpper();
                    //Payment.PaymentAmmount = Convert.ToString(dr["PaymentAmmount"]);
                    Payment.PaymentDate = Convert.ToDateTime(dr["InvoiceDate"].ToString());
                    Payment.PaymentReference = dr["PaymentReference"].ToString();
                    Payment.TxtPaymentMode = dr["PaymentMode"].ToString();
                }
                dr.Close();
                return Payment;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckCreditcustomerIscahMode(string accountsno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@accountsno", accountsno) };
                DataSet ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "usp_CheckCreditcustomerIscahMode", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public List<string> SavePayment(List<Payment> Payment)
        {

            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                List<string> Custommsg = new List<string>();
                DataTable dtCreatePayment = CollectionHelper.ConvertTo(Payment, "ShipmentType,AccountNo,InvoiceNo,AWBNo,TotalReceivable,BalanceReceivable,InvoiceDate,AccountName,AccountAddress,AccountCity,Text_PaymentMode,TxtPaymentMode,PaymentReceivable,AWBSNo,AirlineName,CreditNoteAmount,AccountSNo,AirlineSNo,NetPayableAmount,ProcessName,DONo,DOSNo,PaymentReceived,HAWBNO,DB_btn_Hide,I_btn_Hide,VirtualAccountNo1,DBNo,OfficeName");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Payment", dtCreatePayment, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                int ret = 0;

                DataSet ds = new DataSet();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@PaymentTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatePayment;
                SqlParameter[] Parameters = { param };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SavePayment", Parameters);

                ret = Convert.ToInt32(ds.Tables[ds.Tables.Count - 1].Rows[0][0]);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Payment");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        if (ret == 900)
                        {
                            ErrorMessage.Add(ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString());
                        }
                        else
                        {
                            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                            string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(dataBaseExceptionMessage);
                        }
                    }
                }

                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetChargeNotePrintRecord(int Recid)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Recid) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChargeNotePrintRecord", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetChargeNotePrintRecordExport(int InvoiceSNo, int InvoiceType, int UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", InvoiceSNo), new SqlParameter("@InvoiceType", InvoiceType), new SqlParameter("@UserSNo", UserSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChargeNotePrintRecordExport", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetPaymentReceiptPrint(int ReceiptSNo, int UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@SNo", ReceiptSNo) ,
                                            new SqlParameter("@UserSNo", UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPaymentReceiptPrint", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ConvertNumberIntoWords(decimal TotalAmount, int InvoiceSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TotalAmount", TotalAmount), new SqlParameter("@InvoiceSNo", InvoiceSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAmountInWord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        //added by devendra singh for Export invoice print
        public string GetPaymentExportInvoicePrint(int InvoiceSNo, int InvoiceType)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@InvoiceSNo",InvoiceSNo),
                                            new SqlParameter("@InvoiceType",InvoiceType),
                                            new SqlParameter("@UserSNO", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())


                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChargeNotePrintRecordExportInvoice", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        // Added By NEHAL AHMAD  26 Feb 2020   ExportInvoicePenaltyReceipt

        public string ExportInvoicePenaltyReceipt(int InvoiceSNo, int InvoiceType)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@InvoiceSNo",InvoiceSNo),
                                            new SqlParameter("@InvoiceType",InvoiceType),
                                            new SqlParameter("@UserSNO", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())


                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentPenaltyExportInvoice", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string GetAgentDetails(int InvoiceSNo, int InvoiceType)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@InvoiceSNo",InvoiceSNo),
                                            new SqlParameter("@InvoiceType",InvoiceType),
                                              new SqlParameter("@UserSNO", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spinvoicepayment_getAgentType", Parameters);
                //return ds.Tables[0].Columns[0].
                return ds.Tables[0].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        //Add By SUSHANT
        public string CheckPaymentMode(string PaymentSNo, string AccountSno, string Type)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@TransactionType",PaymentSNo),
                                             new SqlParameter("@AccountSno",AccountSno),
                                             new SqlParameter("@Type",Type),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckPaymentMode", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        //Added By Shivali Thakur
        public string GetUserAccountStatus(int SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUserAccountStatus", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetImportExportInvoicePrint(int InvoiceSNo, int InvoiceType)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@InvoiceSNo",InvoiceSNo),
                                            new SqlParameter("@InvoiceType",InvoiceType),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetImportExportInvoice", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetInvoiceNoFromCRA(string StateCode, string MemoType,string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@StateCode",StateCode),
                                            new SqlParameter("@MemoType",MemoType),
                                            new SqlParameter("@AWBNo",AWBNo),
                                            new SqlParameter("@InvNumber",SqlDbType.VarChar){Direction=ParameterDirection.Output,Size=250}
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(CRAConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetInvoiceNumber", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateInvoice(int InvoiceSNo, string InvoiceNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@InvoiceSNo",InvoiceSNo),
                                            new SqlParameter("@InvoiceNo",InvoiceNo),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateInvoice", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}