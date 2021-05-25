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
using CargoFlash.Cargo.Model.Accounts;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class DirectPaymentManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordDirectPayment()
        {
            object DirectPayment = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    DirectPayment DirectPaymentList = new DirectPayment();
                    object obj = (object)DirectPaymentList;
                    //DirectPayment = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
                    //this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    qString.Add("IsOffice", System.Web.HttpContext.Current.Request.QueryString["RecID"].Split('-')[0]);
                    DirectPayment = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"].Split('-')[1], obj, this.MyModuleID, "", "", qString);
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

            } return DirectPayment;
        }

        public DirectPaymentManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Accounts";
                this.MyAppID = "DirectPayment";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public DirectPaymentManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Accounts";
                this.MyAppID = "DirectPayment";
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
                    htmlFormAdapter.HeadingColumnName = "RefNo";
                    htmlFormAdapter.AuditLogColumn = "RefNo";//,Text_Office,Text_Agent";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordDirectPayment();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                       case DisplayModeEdit:
                             htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                             htmlFormAdapter.objFormData = GetRecordDirectPayment();
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                       case DisplayModeDelete:
                             htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                             htmlFormAdapter.objFormData = GetRecordDirectPayment();
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
                //if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {

                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            CreateGrid(container);
                            break;
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
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
                    case DisplayModeSave:
                        SaveDirectPayment();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateDirectPayment();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteDirectPayment(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        public void SaveDirectPayment() //updated by shahbaz akhtar on 28-12-2016 : purpose-add office
        {
            try
            {
                int Type = 0;
                List<DirectPayment> listDirectPayment = new List<DirectPayment>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                if (FormElement["Text_TransectionModeSNo"].ToString().ToUpper() == "VIRTUAL UPDATE")   // updated by arman 16-05-2017 : 5 for virtual payment (updatetype) 
                {
                    if (FormElement["UpdateType"] != null)
                    {
                        Type = Convert.ToInt32(FormElement["UpdateType"].ToString());
                    }
                }
                var Account = 0;
                if(FormElement["Agent"].ToString() != "")
                {
                    Account = Convert.ToInt32(FormElement["Agent"].ToString());
                }
               
                var DirectPayment = new DirectPayment
                {

                    AccountSNo = Account,
                    AWBSNo = Convert.ToInt32(FormElement["AWBSNo"] == "" ? "0" : FormElement["AWBSNo"]),
                   // UpdateType = Convert.ToInt32(FormElement["UpdateType"].ToString()),
                    UpdateType = Type,
                  //  Amount = Convert.ToDouble(Convert.ToString(FormElement["Amount"]).Replace(",","")),
                    Amount= Convert.ToString(FormElement["Amount"]).Replace(",",""),
                    Remarks = FormElement["Remarks"].ToString(),
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                    TransectionModeSNo =Convert.ToInt32((FormElement["TransectionModeSNo"] == "") ? (int?)null : Convert.ToInt32(FormElement["TransectionModeSNo"].ToString()) ),
                    BankName = FormElement["BankName"].ToString(),
                    BranchName = FormElement["BranchName"].ToString(),
                    ChequeAccountName = FormElement["ChequeAccountName"].ToString(),
                    BankAccountNo = FormElement["BankAccountNo"].ToString(),
                    ChequeDate = string.IsNullOrEmpty(FormElement["ChequeDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ChequeDate"].ToString()),
                    ReferenceNo = FormElement["ReferenceNo"].ToString(),
                    ChequeNo = string.IsNullOrEmpty(FormElement["ChequeNo"]) == true ? "" : FormElement["ChequeNo"].ToString(),
                    //OfficeSNo = Convert.ToInt32(FormElement["Office"].ToString()),
                    //OfficeSNo = Convert.ToInt32(FormElement["OfficeSNo"].ToString()),
                    OfficeSNo = Convert.ToInt32(FormElement["Office"] == "" ? "0" : FormElement["Office"]),
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"].ToString()),
                    CitySNo = Convert.ToInt32(FormElement["City"].ToString()),
                    CurrencySNo = Convert.ToInt32(FormElement["CurrencySNo"].ToString()),
                    ValidFrom = string.IsNullOrEmpty(FormElement["ValidFrom"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ValidFrom"].ToString()),
                    ValidTo = string.IsNullOrEmpty(FormElement["ValidTo"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ValidTo"].ToString()),
                    RequestedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                    Description=Convert.ToString(FormElement["Description"].ToString()),
                    PaymentDateCal = string.IsNullOrEmpty(FormElement["PaymentDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["PaymentDate"].ToString())
                };
                listDirectPayment.Add(DirectPayment);
                object datalist = (object)listDirectPayment;
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
        private StringBuilder CreateGrid(StringBuilder Container)//updated by shahbaz akhtar on 28-12-2016 
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Direct Payment";
                    g.FormCaptionText = "Direct Payment";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference Number", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Office", Title = "Office", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Agent", Title = "Agent", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Credit", Title = "Credit", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Amount", Title = "Amount", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdateType", Title = "Update Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Transaction", Title = "Transaction Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccountSNo", Title = "AccountSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "OfficeSNo", Title = "OfficeSNo", DataType = GridDataType.String.ToString(), IsHidden = true });

                    g.Action = new List<GridAction>();
                  
                    //g.Action.Add(new GridAction
                    //{
                    //    ButtonCaption = "Verify",
                    //    ActionName = "READ",
                    //    AppsName = this.MyAppID,
                    //    CssClassName = "read",
                    //    ModuleName = this.MyModuleID
                    //});

                    g.InstantiateIn(Container);

                    //g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return Container;
        }

        public void UpdateDirectPayment() //updated by shahbaz akhtar on 28-12-2016 : purpose-add office
        {
            try
            {
                int Type = 0;
                List<DirectPayment> listDirectPayment = new List<DirectPayment>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                if (FormElement["Text_TransectionModeSNo"].ToString().ToUpper() == "VIRTUAL UPDATE")   
                {
                    if (FormElement["UpdateType"] != null)
                    {
                        Type = Convert.ToInt32(FormElement["UpdateType"].ToString());
                    }
                }
                var Account = 0;
                if (FormElement["Agent"].ToString() != "")
                {
                    Account = Convert.ToInt32(FormElement["Agent"].ToString());
                }

                var DirectPayment = new DirectPayment
                {
                   // Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]).Split('-')[1],
                    SNo = Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]).Split('-')[1],
                    AccountSNo = Account,
                    AWBSNo = Convert.ToInt32(FormElement["AWBSNo"] == "" ? "0" : FormElement["AWBSNo"]),
                    // UpdateType = Convert.ToInt32(FormElement["UpdateType"].ToString()),
                    UpdateType = Type,
                    Amount = Convert.ToString(FormElement["Amount"]).Replace(",", ""),
                    Remarks = FormElement["Remarks"].ToString(),
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                    TransectionModeSNo = Convert.ToInt32((FormElement["TransectionModeSNo"] == "") ? (int?)null : Convert.ToInt32(FormElement["TransectionModeSNo"].ToString())),
                    BankName = FormElement["BankName"].ToString(),
                    BranchName = FormElement["BranchName"].ToString(),
                    ChequeAccountName = FormElement["ChequeAccountName"].ToString(),
                    BankAccountNo = FormElement["BankAccountNo"].ToString(),
                    ChequeDate = string.IsNullOrEmpty(FormElement["ChequeDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ChequeDate"].ToString()),
                    ReferenceNo = FormElement["ReferenceNo"].ToString(),
                    ChequeNo = string.IsNullOrEmpty(FormElement["ChequeNo"]) == true ? "" : FormElement["ChequeNo"].ToString(),
                    OfficeSNo = Convert.ToInt32(FormElement["Office"] == "" ? "0" : FormElement["Office"]),
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"].ToString()),
                    CitySNo = Convert.ToInt32(FormElement["City"].ToString()),
                    CurrencySNo = Convert.ToInt32(FormElement["CurrencySNo"].ToString()),
                    ValidFrom = string.IsNullOrEmpty(FormElement["ValidFrom"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ValidFrom"].ToString()),
                    ValidTo = string.IsNullOrEmpty(FormElement["ValidTo"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ValidTo"].ToString()),
                    RequestedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                    Description=Convert.ToString(FormElement["Description"]),
                    PaymentDateCal = string.IsNullOrEmpty(FormElement["PaymentDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["PaymentDate"].ToString())
                };
                listDirectPayment.Add(DirectPayment);
                object datalist = (object)listDirectPayment;
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

        private void DeleteDirectPayment(string RecordID)
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
