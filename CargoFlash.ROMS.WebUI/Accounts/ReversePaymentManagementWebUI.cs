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
    public class ReversePaymentManagementWebUI:BaseWebUISecureObject
    {
        
        public object GetRecordApprovePayment()
        {
            object ReversePayment = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ReversePayment ReversePaymentList = new ReversePayment();
                    object obj = (object)ReversePaymentList;
                   
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    qString.Add("IsOffice", System.Web.HttpContext.Current.Request.QueryString["RecID"].Split('-')[0]);
                    ReversePayment = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"].Split('-')[1], obj, this.MyModuleID, "", "", qString);
                    //ReversePayment = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return ReversePayment;
        }

        public ReversePaymentManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Accounts";
                this.MyAppID = "ReversePayment";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public ReversePaymentManagementWebUI(Page PageContext)
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
                this.MyAppID = "ReversePayment";
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
                    htmlFormAdapter.HeadingColumnName = "PaymentRefNumber";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordApprovePayment();
                            //htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            //htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
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
                        SaveReversePayment();
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

        public void SaveReversePayment()
        {
            try
            {
                List<ISReversePayment> listVerifyPayment = new List<ISReversePayment>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ApprovePayment = new ISReversePayment
                {
                    SNo = Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]).Split('-')[1],
                    //AccountSNo = Convert.ToInt32(FormElement["AccountSNo"].ToString()),
                    OfficeSNo=Convert.ToInt32(FormElement["OfficeSNo"].ToString()),
                    IsReversal = Convert.ToInt32(FormElement["IsReversal"].ToString()),
                    ReversalRemarks = FormElement["ReversalRemarks"].ToString(),
                    ReversalBy = Convert.ToInt32(((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),

                };
                listVerifyPayment.Add(ApprovePayment);
                object datalist = (object)listVerifyPayment;
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
                    // g.CommandButtonNewText = "New DirectPayment";
                    g.FormCaptionText = "Reverse Payment";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);

                    g.Column = new List<GridColumn>();
                    g.SuccessGrid = "fn_ReverseSuccessGrid";
                    if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "JT")
                    {
                        g.Column.Add(new GridColumn { Field = "Print", Title = "Print", Width = 50,  DataType = GridDataType.String.ToString() });
                        g.Column.Add(new GridColumn { Field = "IsExcludeBankGuarantee", Title = "BG Ex", DataType = GridDataType.String.ToString(),IsHidden=true });
                    }                                                                                                            

                    g.Column.Add(new GridColumn { Field = "Office", Title = "Office", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Agent", Title = "Agent", Width = 180, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", Width = 70, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Credit", Title = "Credit", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Amount", Title = "Amount", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Currency", Title = "Currency", Width = 70,  DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PaymentMode", Title = "Payment Mode", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PaymentRefNumber", Title = "Payment Ref.Nbr", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReferenceNo", Title = "Reference No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReceiptDate", Title = "Receipt Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TransactionDate", Title = "Transaction Date/Time", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdateType", Title = "Update Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Transaction", Title = "Transaction Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ApprovedOn", Title = "Approved On", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ApprovedRemarks", Title = "Approved Remarks", DataType = GridDataType.String.ToString() });                 
                    //g.Column.Add(new GridColumn { Field = "IsExcludeBankGuarantee", Title = "BG Pcs", Template = "<input type=\"button\"  id=\"btnPrint\"  value=\"#=IsExcludeBankGuarantee#\" style=\"width:50%;\" onclick=\"BindPrintData(this.id, this.LogoURL);\" />", DataType = GridDataType.String.ToString(), Width = 100 });

                    g.Action = new List<GridAction>();

                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Reverse",
                        ActionName = "READ",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID
                    });

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
      
    }
}
