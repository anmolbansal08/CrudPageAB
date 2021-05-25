using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Accounts
{
    public class PaymentManagementWebUI : BaseWebUISecureObject
    {
        public PaymentManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Accounts";
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

        private void CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.CommandButtonNewText = "New Payment";
                    g.FormCaptionText = "Payment";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ContactsTypeName", Title = "Contact Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ContactsTypeDis", Title = "Name", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "PaymentdateDisplay", Title = "Payment Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Amount", Title = "Amount", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PaymentMode", Title = "Mode of Payment", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PaymentReferenceNo", Title = "Payment Reference No", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "RequestdateDisplay", Title = "RequestOn", DataType = GridDataType.String.ToString() });
                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction { ButtonCaption = "Read", ActionName = "READ", AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });
                    g.InstantiateIn(Container);
                   
                    
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }


        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            CreateGrid(container);
                            break;
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
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


        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container">Control object</param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Amount";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordPayment();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordPayment();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordPayment();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordPayment();
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


        public override void DoPostBack()
        {

            try
            {

                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SavePayment();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SavePayment();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                         break;
                    //case DisplayModeUpdate:
                    //    UpdateContacts(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    //    break;
                    //case DisplayModeDelete:
                    //    DeleteContacts(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    //    break;
                }

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }


        /// <summary>
        /// Get information of individual Account from database according record id supplied
        /// </summary>
        /// <returns>object type of entity Account found from database return null in case if touple not found</returns>
        public object GetRecordPayment()
        {
            object Payment = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Payment PaymentList = new Payment();
                    object obj = (object)PaymentList;
                    //retrieve Entity from Database according to the record
                    Payment = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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

            } return Payment;
        }


        private void SavePayment()
        {
            DateTime? d = null;
            try
            {
                List<Payment> listPayments = new List<Payment>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                var Payment = new Payment
                {
                    SNo = 0,
                    PaymentReferenceNo = FormElement["PaymentReferenceNo"].ToString(),
                    CitySNo = Convert.ToInt32(FormElement["CitySNo"].ToString()),
                    PaymentType = FormElement["PaymentType"]== "0",
                    ContactTypeSNo = Convert.ToInt32(FormElement["ContactTypeSNo"].ToString()),
                    IsCredit = FormElement["IsCredit"] == "0",
                    Amount = Convert.ToDecimal(FormElement["Amount"].ToString()),
                    PaymentDate = FormElement["PaymentDate"].ToString() == string.Empty ? d : Convert.ToDateTime(FormElement["PaymentDate"]),
                    RequestedRemarks = FormElement["RequestedRemarks"] == string.Empty ? null : FormElement["RequestedRemarks"].ToUpper(),
                    ModeOfPayment = Convert.ToInt16(FormElement["ModeOfPayment"].ToString()),
                    BankAccountSNo = FormElement["BankAccountSNo"].ToString() == string.Empty ? 0 : Convert.ToInt32(FormElement["BankAccountSNo"].ToString()),
                    OtherPaymentMode = FormElement["OtherPaymentMode"] != string.Empty ? FormElement["OtherPaymentMode"].ToUpper() : null,
                    ChequeNo = FormElement["ChequeNo"] != string.Empty ? FormElement["ChequeNo"].ToUpper() : null,
                    ChequeDate = FormElement["ChequeDate"].ToString() == string.Empty ? d : Convert.ToDateTime(FormElement["ChequeDate"]),
                    BankName = FormElement["BankName"] != string.Empty ? FormElement["BankName"].ToUpper() : null,
                    BankCity = FormElement["BankCity"] != string.Empty ? FormElement["BankCity"].ToUpper() : null,
                    DepositDate = FormElement["DepositDate"].ToString() == string.Empty ? d : Convert.ToDateTime(FormElement["DepositDate"]),
                    RequestBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    InvoiceNo = null,
              };


                listPayments.Add(Payment);
                object datalist = (object)listPayments;
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
 
  }
}
