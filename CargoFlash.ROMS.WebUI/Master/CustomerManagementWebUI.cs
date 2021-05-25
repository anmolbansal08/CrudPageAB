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
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Master
{
    #region Customer Class Description
    /*
	*****************************************************************************
	Class Name:		CustomerManagementWebUI      
	Purpose:		This Class used to get details of Customer save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		17 feb 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class CustomerManagementWebUI : BaseWebUISecureObject
    {
        public object GetCustomer()
        {
            object Customer = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Customer CustomerList = new Customer();
                    object obj = (object)CustomerList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    Customer = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return Customer;
        }

        public CustomerManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Customer";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public CustomerManagementWebUI(Page PageContext)
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
                this.MyAppID = "Customer";
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
                    string Name = "";
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "AccountNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetCustomer();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(ViewCustomerDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetCustomer();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(EditCustomerDetailsPage(htmlFormAdapter.InstantiateIn(), Name));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetCustomer();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            Name = Convert.ToString(((CargoFlash.Cargo.Model.Master.Customer)(htmlFormAdapter.objFormData)).Name);
                            container.Append(EditCustomerDetailsPage(htmlFormAdapter.InstantiateIn(), Name));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(EditCustomerDetailsPage(htmlFormAdapter.InstantiateIn(), Name));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetCustomer();
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
            return container;
        }

        private StringBuilder CreateGrid(StringBuilder container)
        {
            try
            {
                using (Grid g = new Grid())
                {

                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.FormCaptionText = "Participant Detail";
                    g.CommandButtonNewText = "New Participant";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AccountNo", Title = "Account No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CustomerTypeName", Title = "Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AccountName", Title = "Forwarder (Agent) Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Name 1", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Name2", Title = "Name 2", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TaxID", Title = "Tax ID", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ConsigneeAsForwarder", Title = "Consignee As Forwarder", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

                    g.InstantiateIn(container);
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
                        SaveCustomer();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveCustomer();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateCustomer(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteCustomer(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void SaveCustomer()
        {
            try
            {
                List<Customer> listCustomer = new List<Customer>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Customer = new Customer
                {
                    Name = FormElement["CustomerName"],
                    CustomerTypeName = FormElement["Text_CustomerTypeSNo"].ToUpper(),
                    CustomerTypeSNo = FormElement["CustomerTypeSNo"],
                    AccountSNo = FormElement["AccountSNo"],
                    AccountName = String.IsNullOrEmpty(FormElement["Text_AccountSNo"]) == true ? "" : FormElement["Text_AccountSNo"].ToString().ToUpper(),
                    SecurityCode = null,//FormElement["SecurityCode"] == "" ? null : FormElement["SecurityCode"],
                    CitySNo = FormElement["CityCode"],
                    CustomerNo = null,//FormElement["CustomerNo"] == "" ? null : FormElement["CustomerNo"],
                    IsActive = FormElement["IsActive"] == "0",
                    CityCode = FormElement["Text_CityCode"].ToUpper().Split('-')[0],
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsFocConsignee = FormElement["IsFocConsignee"] == "0",
                    IsConsigneeAsForwarder = FormElement["IsConsigneeAsForwarder"] == "0",
                    Name2 = FormElement["CustomerName2"].ToString().ToUpper(),
                    CustomCode =  String.IsNullOrEmpty(FormElement["CustomCode"])==true?"": FormElement["CustomCode"].ToString().ToUpper(),
                    AgreementNumber = FormElement["AgreementNumber"].ToString().ToUpper(),
                    TaxID = FormElement["TaxID"].ToString().ToUpper()
                };
                listCustomer.Add(Customer);
                object datalist = (object)listCustomer;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        private void UpdateCustomer(string RecordID)
        {
            try
            {
                List<Customer> listCustomer = new List<Customer>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Customer = new Customer
                {
                    SNo = Convert.ToInt32(RecordID),
                    Name = FormElement["hdnCustomerName"].ToString().Split('-')[0],
                    CustomerTypeName = FormElement["CustomerTypeSNo"].ToUpper(),
                    //CustomerTypeName = FormElement["Text_CustomerTypeSNo"].ToUpper(),
                    CustomerTypeSNo = "0", //FormElement["CustomerTypeSNo"],
                    AccountSNo = FormElement["AccountSNo"],
                    AccountName = String.IsNullOrEmpty(FormElement["Text_AccountSNo"]) == true ? "" : FormElement["Text_AccountSNo"].ToString().ToUpper(),
                    SecurityCode = null,//FormElement["SecurityCode"] == "" ? null : FormElement["SecurityCode"],
                    CitySNo = FormElement["CityCode"],
                    CustomerNo = null,//FormElement["CustomerNo"] == "" ? null : FormElement["CustomerNo"],
                    IsActive = FormElement["IsActive"] == "0",
                    CityCode = FormElement["Text_CityCode"].ToUpper().Split('-')[0],
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsFocConsignee = FormElement["IsFocConsignee"] == "0",
                    IsConsigneeAsForwarder = FormElement["IsConsigneeAsForwarder"] == null || FormElement["IsConsigneeAsForwarder"] == "0",
                    Name2 = FormElement["hdnCustomerName"].ToString().Split('-')[1],
                    CustomCode = String.IsNullOrEmpty(FormElement["CustomCode"]) == true ? "" : FormElement["CustomCode"].ToString().ToUpper(),
                    AgreementNumber = FormElement["AgreementNumber"].ToString().ToUpper(),
                    TaxID = FormElement["TaxID"].ToString().ToUpper()
                };
                listCustomer.Add(Customer);
                object datalist = (object)listCustomer;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        private void DeleteCustomer(string RecordID)
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

        public StringBuilder ViewCustomerDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
        <div id='MainDiv'>
            <div id='ApplicationTabs'>
            <ul>
                <li  id='liCustomer' class='k-state-active'>Participant Information</li>
                <li id='liCustomerAddress' onclick='javascript:CustomerAddressGrid();'>Participant Address Details</li>
                 <li id='liAuthorizedPersonal' onclick='javascript:GetAuthorizedPersonnel();'>Authorized Personnel</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnCustomerInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2' >
              <input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCustomerSNo' name='hdnCustomerSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCustomerName' name='hdnCustomerName' type='hidden' value=''/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblCustomerAddress'></table></div>");
            containerLocal.Append(@"<div id='divTab3'>");
            HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(MyModuleID);
            containerLocal.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "AuthorizedPersonal"));
            //containerLocal.Append(@"<input type='button' value='Save' class='btn btn-block btn-success btn-sm' id='btnSaveAttachement' onclick='SaveAttachment()'/><div id='divImage'></div></div>");
            return containerLocal;
        }

        public StringBuilder EditCustomerDetailsPage(StringBuilder container, string Name)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
            <div id='MainDiv'>
            <div id='ApplicationTabs'>
            <ul>
                <li  id='liCustomer' class='k-state-active'>Participant Information</li>
                <li id='liCustomerAddress' onclick='javascript:CustomerAddressGrid();'>Participant Address Details</li>
                <li id='liAuthorizedPersonal' onclick='javascript:GetAuthorizedPersonnel();'>Authorized Personnel</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnCustomerInformation'><input id='hdnAccountName' name='hdnAccountName' type='hidden' value=''/>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2' >
                <input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCustomerSNo' name='hdnCustomerSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCustomerName' name='hdnCustomerName' type='hidden' value='" + Name + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblCustomerAddress'></table></div>");
            containerLocal.Append(@"<div id='divTab3'>");
            HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(MyModuleID);
            containerLocal.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "AuthorizedPersonal"));
            containerLocal.Append(@"<input type='button' value='Save' class='btn btn-block btn-success btn-sm' id='btnSaveAttachement'/><div id='divImage'></div></div>");
            return containerLocal;
        }
    }
}
