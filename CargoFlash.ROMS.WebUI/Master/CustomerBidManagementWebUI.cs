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


namespace CargoFlash.Cargo.WebUI.Master
{
    public class CustomerBidManagementWebUI : BaseWebUISecureObject
    {
        public object GetCustomerBid()
        {
            object customerBid = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CustomerBid CustomerBid = new CustomerBid();
                    object obj = (object)CustomerBid;
                    customerBid = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return customerBid;
        }



        public CustomerBidManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Master";
                this.MyAppID = "CustomerBid";
                this.MyPrimaryID = "SNo";
            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }

        }


        public override void BuildFormView(string DisplayMode, StringBuilder container)
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
                            htmlFormAdapter.objFormData = GetCustomerBid();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetCustomerBid();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetCustomerBid();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;

                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetCustomerBid();
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
        }

        public override void CreateWebForm(StringBuilder container)
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
                        case DisplayModeIndexView:
                            CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
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
        }

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveCustomerBid();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2000), false);
                        break;
                    case DisplayModeSaveAndNew:

                        SaveCustomerBid();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false,2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateCustomerBid(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteCustomerType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        private void CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = MyPrimaryID;
                    g.ModuleName = MyModuleID;
                    g.AppsName = MyAppID;
                    g.ServiceModuleName = MyModuleID;
                    g.CommandButtonNewText = "New Customer Bid";
                    g.FormCaptionText = "Customer Bid";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    //g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_CustomerSNo", Title = "Customer Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AuctionSNo", Title = "Auction Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_CurrencyCode", Title = "Currency Code", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
        private void SaveCustomerBid()
        {
            try
            {
                List<CustomerBid> listCustomerType = new List<CustomerBid>();
                double dnumber = 0;
                var CustomerBid = new CustomerBid
                {
                    SNo = 0,
                    AuctionSNo = System.Web.HttpContext.Current.Request["AuctionSNo"].ToString().ToUpper(),
                    CustomerSNo = System.Web.HttpContext.Current.Request["CustomerSNo"].ToUpper(),
                    CustomerRate = double.TryParse(System.Web.HttpContext.Current.Request["CustomerRate"], out dnumber) ? dnumber : 0,
                    CurrencyCode = System.Web.HttpContext.Current.Request["CurrencyCode"].ToString().ToUpper(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString()
                };
                listCustomerType.Add(CustomerBid);
                object datalist = (object)listCustomerType;
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

        private void UpdateCustomerBid(int RecordID)
        {
            try
            {

                List<CustomerBid> listCustomerType = new List<CustomerBid>();
                int number = 0;
                double dnumber = 0;
                var CustomerBid = new CustomerBid
                {
                    SNo = RecordID,
                    AuctionSNo = (Int32.TryParse(System.Web.HttpContext.Current.Request["AuctionSNo"], out number) ? number : 0).ToString(),
                    CustomerSNo = (Int32.TryParse(System.Web.HttpContext.Current.Request["CustomerSNo"], out number) ? number : 0).ToString(),
                    CustomerRate = double.TryParse(System.Web.HttpContext.Current.Request["CustomerRate"], out dnumber) ? dnumber : 0,
                    CurrencyCode = System.Web.HttpContext.Current.Request["CurrencyCode"].ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString()
                };
                listCustomerType.Add(CustomerBid);
                object datalist = (object)listCustomerType;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }

        private void DeleteCustomerType(string RecordID)
        {
            try
            {

                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }


    }
}
