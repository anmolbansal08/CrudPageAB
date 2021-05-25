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


namespace CargoFlash.Cargo.WebUI.Accounts
{
    public class VerifyPaymentManagementWebUI : BaseWebUISecureObject
    {

        public object GetRecordVerifyPayment()
        {
            object DirectPayment = null;
            try
            {               
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    VerifyPayment DirectPaymentList = new VerifyPayment();
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

        public VerifyPaymentManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Accounts";
                this.MyAppID = "VerifyPayment";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public VerifyPaymentManagementWebUI(Page PageContext)
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
                this.MyAppID = "VerifyPayment";
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
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordVerifyPayment();
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
                        SaveVerification();
                        if (string.IsNullOrEmpty(ErrorMessage) == false)
                        {
                            if (ErrorMessage.ToString() == "<value>Data Submitted Successfully. Payment Is Not Verified.</value>")
                            {
                                System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                            }
                        }
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

        public void SaveVerification()
        {
            try
            {
                List<ISVerifyPayment> listVerifyPayment = new List<ISVerifyPayment>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var VerifyPayment = new ISVerifyPayment
                {
                    SNo = Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]).Split('-')[1],
                    //OfficeSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["OfficeSNo"]),
                    OfficeSNo = Convert.ToInt32(FormElement["OfficeSNo"]),
                    IsVerified = Convert.ToInt32(FormElement["IsVerified"].ToString()),
                    VerifiedRemarks = FormElement["VerifiedRemarks"].ToString(),
                    VerifiedBy = Convert.ToInt32(((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                   
                };
                listVerifyPayment.Add(VerifyPayment);
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
                    g.FormCaptionText = "Verify Payment";
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
                    g.Column.Add(new GridColumn { Field = "OfficeSNo", Title = "OfficeSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Action = new List<GridAction>();
                  
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Verify",
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
