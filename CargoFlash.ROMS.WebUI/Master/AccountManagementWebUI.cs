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


namespace CargoFlash.Cargo.WebUI.Master
{
    #region AccountManagementWebUI Class Description

    /*
	*****************************************************************************
	Class Name:		AccountManagementWebUI      
	Purpose:		This class used to handle HTTP Type Request/Response	
                    and communicate with REST Services for DML operations
                    object of this class is used in various Code behind files 
                    of Modules
	Company:		CargoFlash 
	Author:			Madhav Kumar Jha
	Created On:		24 Feb 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class AccountManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Get information of individual Account from database according record id supplied
        /// </summary>
        /// <returns>object type of entity Account found from database return null in case if touple not found</returns>
        public object GetRecordAccount()
        {
            object Account = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Account AccountList = new Account();
                    object obj = (object)AccountList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    Account = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return Account;
        }

        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public AccountManagementWebUI(Page PageContext)
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
                this.MyAppID = "Account";
                this.MyPrimaryID = "SNo";
                
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public AccountManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Account";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public StringBuilder ReadAccountDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
        <div id='PaymentDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liPaymentEntry' class='k-state-active'>Account Information</li>
                <li id='liBranch' onclick='javascript:AccountBranchGrid();'>Branch</li>
                <li id='liAccountContactInformation' onclick='javascript:AccountContactInformationGrid();'>Account Contact Information</li>
                <li id='liAccountCommision' onclick='javascript:AccountCommisionGrid();'>Account Commission</li>
                <li id='liAccountVatExempt' onclick='javascript:AccountVatExemptGrid();'>Account Vat Exempt</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnAccountInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>");
            containerLocal.Append(@"<div id='divBranch'><span id='spnBranch'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAccountSNo' name='hdnAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblBranch'></table></span></div>");
            containerLocal.Append(@"<div id='divContactInformation' style='overflow-x:scroll;'><span id='spnContactInformation'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAccountSNo' name='hdnAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblContactInformation'></table></span></div>");
            containerLocal.Append(@"<div id='divTab2' >
                 <span id='spnAccountCommision'>
                 <input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAccountSNo' name='hdnAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblAccountCommision'></table></span></div><div id='divTab3'><span id='spnAccountVatExempt'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAccountSNo' name='hdnAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblAccountVatExempt'></table></span></div></div></div>");
            return containerLocal;
        }

        public StringBuilder CreateAccountDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
        <div id='PaymentDiv'>
            <div id='ApplicationTabs'>
            <ul>
                <li  id='liPaymentEntry' class='k-state-active'>Account Information</li>
                <li id='liBranch' onclick='javascript:AccountBranchGrid();'>Branch</li>
                <li id='liAccountContactInformation' onclick='javascript:AccountContactInformationGrid();'>Account Contact Information</li>
                <li id='liAccountCommision' onclick='javascript:AccountCommisionGrid();'>Account Commission</li>
                <li id='liAccountVatExempt' onclick='javascript:AccountVatExemptGrid();'>Account Vat Exempt</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnAccountInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>");
            containerLocal.Append(@"<div id='divBranch'><span id='spnBranch'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAccountSNo' name='hdnAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblBranch'></table></span></div>");
            containerLocal.Append(@"<div id='divContactInformation' style='overflow-x:scroll;'><span id='spnContactInformation'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAccountSNo' name='hdnAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblContactInformation'></table></span></div>");
            containerLocal.Append(@"<div id='divTab2' >
                 <span id='spnAccountCommision'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAccountSNo' name='hdnAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAccountCommision'></table></span></div><div id='divTab3' ><span id='spnAccountVatExempt'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAccountSNo' name='hdnAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAccountVatExempt'></table></span></div></div></div>");
            return containerLocal;
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
                    htmlFormAdapter.HeadingColumnName = "Name";
                    
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordAccount();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(ReadAccountDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordAccount();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateAccountDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordAccount();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateAccountDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateAccountDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordAccount();
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

        /// <summary>
        /// Generate Account web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionAccount.xml
        /// </summary>
        /// <param name="container"></param>
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                // if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
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
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return strContent;
        }

        /// <summary>
        /// Generate Grid the for the page
        /// as per the columns of entity supplied
        /// </summary>
        /// <param name="Container"></param>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Account";
                    g.FormCaptionText = "Account";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Name", DataType = GridDataType.String.ToString(),Width=200, Template = "<span title=\"#= Name #\">#= Name #</span>" });
                    g.Column.Add(new GridColumn { Field = "AccountNo", Title = "Participant ID", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AccountTypeSNo", Title = "Account Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Branch", Title = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ICMSEnvironment"].ToUpper() == "GA" ? "Branch" : "Master Account", IsHidden = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ICMSEnvironment"].ToUpper() == "GA" ? true : false, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_Branch  #\">#= Text_Branch  #</span>" });
                    
                    g.Column.Add(new GridColumn { Field = "Branch", Title = "Master Branch", IsHidden = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ClientEnvironment"].ToUpper() == "GA" ? true : false, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Branch  #\">#= Branch  #</span>" });
                    
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline Name", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_AirlineSNo #\">#= Text_AirlineSNo #</span>" });
                    g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", Width = 80, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OfficeSNo", Title = "Office Name", DataType = GridDataType.String.ToString() });
                    //    g.Column.Add(new GridColumn { Field = "Text_ForwarderAsConsignee", Title = "Forwarder (Agent) As Consignee", DataType = GridDataType.String.ToString(), Width = 200 });
                    g.Column.Add(new GridColumn { Field = "OfficeTypeName", Title = "Office Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_CustomerTypeSNo", Title = "Customer Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_TransactionTypeSNo", Title = "Transaction Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "BankIntegrate", Title = "Bank Integrate", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IATA",Title= "IATA", DataType = GridDataType.String.ToString() });// Add by Pankaj Kumar Ishwar 
                    g.Column.Add(new GridColumn { Field = "IATANo", Title = "IATA No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CASSNo", Title = "CASS NO", DataType = GridDataType.String.ToString() });
                   // g.Column.Add(new GridColumn { Field = "GSTNumber", Title = "GST Number", DataType = GridDataType.String.ToString() });
               //     g.Column.Add(new GridColumn { Field = "Blacklist", Title = "Blacklist", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", Width = 70, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_InvoicingCycle", Title = "Invoicing Cycle", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_InvoicingCycle  #\">#= Text_InvoicingCycle  #</span>" });

                    // add by umar
                    g.Column.Add(new GridColumn { Field = "Text_FreightInvoicingCycle", Title = "Freight Invoicing Cycle", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_FreightInvoicingCycle  #\">#= Text_FreightInvoicingCycle  #</span>" });
                    // end
                  
                    g.Column.Add(new GridColumn { Field = "CurrencyCode", Title = "Invoice Currency", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= CurrencyCode  #\">#= CurrencyCode  #</span>" });
                    g.Column.Add(new GridColumn { Field = "GarudaMile", Title = "Miles", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= GarudaMile   #\">#= GarudaMile   #</span>" });
                    g.Column.Add(new GridColumn { Field = "Text_LoginColorCodeSno", Title = "Login colour code", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_LoginColorCodeSno    #\">#= Text_LoginColorCodeSno    #</span>" });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ValidFrom  #\">#= ValidFrom  #</span>" });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ValidTo  #\">#= ValidTo  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Text_IndustryTypeSNO", Title = "Industry type", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_IndustryTypeSNO  #\">#= Text_IndustryTypeSNO  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Text_CountrySNo", Title = "Country", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_CountrySNo  #\">#= Text_CountrySNo  #</span>" });
                    g.Column.Add(new GridColumn { Field = "CreditLimit", Title = "Credit Limit", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= CreditLimit  #\">#= CreditLimit  #</span>" });
                    g.Column.Add(new GridColumn { Field = "VAccountNo", Title = "Account number", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= VAccountNo  #\">#= VAccountNo  #</span>" });
                    g.Column.Add(new GridColumn { Field = "ERPCode", Title = "VA Code", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ERPCode  #\">#= ERPCode  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Address", Title = "Address ", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Address  #\">#= Address  #</span>" });
                 // --- contact info----------------
                    g.Column.Add(new GridColumn { Field = "CustomCode", Title = "Saluation ", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= CustomCode  #\">#= CustomCode  #</span>" });
                    g.Column.Add(new GridColumn { Field = "AccountCode", Title = "First Name ", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= AccountCode  #\">#= AccountCode  #</span>" });
                    g.Column.Add(new GridColumn { Field = "DisplayName", Title = "Last Name ", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= DisplayName  #\">#= DisplayName  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Mobile", Title = "Mobile No. ", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Mobile  #\">#= Mobile #</span>" });
                    g.Column.Add(new GridColumn { Field = "Email", Title = "Designation ", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Email  #\">#= Email  #</span>" });
                   
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

        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveAccount();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveAccount();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateAccount(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteAccount(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        /// <summary>
        /// Save Images viz(AccountLogo,AwbLogo,ReportLogo)
        /// input from webform to stipulated folder 
        /// </summary>
        private String[] SaveImage()
        {
            String AccountLogo = "", AwbLogo = "", ReportLogo = "";
            try
            {
                System.Web.HttpFileCollection multipleFiles = System.Web.HttpContext.Current.Request.Files;

                String[] inputName = multipleFiles.AllKeys;
                var server = System.Web.HttpContext.Current.Server;
                String str = server.MapPath("~/");
                if (!Directory.Exists(Path.Combine(str, "Logo")))
                {
                    Directory.CreateDirectory(Path.Combine(str, "Logo"));
                }
                for (int fileCount = 0; fileCount < multipleFiles.Count; fileCount++)
                {
                    System.Web.HttpPostedFile uploadedFile = multipleFiles[fileCount];
                    string fileName = Path.GetFileName(uploadedFile.FileName);
                    if (uploadedFile.ContentLength > 0 && ((uploadedFile.ContentLength / 1024) <= 2048))
                    {
                        switch (inputName[fileCount])
                        {
                            case "AccountLogo":
                                AccountLogo = Path.Combine("Logo", "AccountLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, AccountLogo));
                                break;
                            case "AwbLogo":
                                AwbLogo = Path.Combine("Logo", "AwbLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, AwbLogo));
                                break;
                            case "ReportLogo":
                                ReportLogo = Path.Combine("Logo", "ReportLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, ReportLogo));
                                break;
                        }
                    }
                }
                return new String[] { AccountLogo, AwbLogo, ReportLogo };
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return new String[] { AccountLogo, AwbLogo, ReportLogo };
        }

        /// <summary>
        /// Insert new Account record into the database
        /// Retrieve information from webform and store the same into modal object 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveAccount()
        {
            try
            {
                List<Account> listAccount = new List<Account>();
                List<OtherAirlines> listOtherAirlines = new List<OtherAirlines>();
                String[] Logo = SaveImage();
                int number = 0;
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                string[] values = FormElement["tblOtherAirlineSlab_rowOrder"].ToString().Split(',');

                for (int count = 0; count < Convert.ToInt32(FormElement["tblOtherAirlineSlab_rowOrder"].ToString().Split(',').Length); count++)
                {

                    listOtherAirlines.Add(new OtherAirlines()
                    {
                        SNo = 0,

                        HdnAirlineSNo = Convert.ToInt32(FormElement["tblOtherAirlineSlab_HdnAirlineSNo_" + values[count]]),
                        AccountSNo = 0,
                        ReferenceNumber = FormElement["tblOtherAirlineSlab_ReferenceNumber_" + values[count]]

                    }
                    );

                }
                var Account = new Account
                {
                    //ParentID = int.Parse(FormElement["ParentID"].ToString() == "" ? "0" : FormElement["ParentID"].ToString()),
                    //Text_ParentID = FormElement["Text_ParentID"].ToString(),
                    AirlineSNo = Int32.TryParse(FormElement["AirlineSNo"], out number) ? number : 0,
                    AccountTypeSNo = Int32.TryParse(FormElement["AccountTypeSNo"], out number) ? number : 0,
                    CurrencySNo = Int32.TryParse(FormElement["CurrencySNo"], out number) ? number : 0,
                    Text_CurrencySNo = Convert.ToString(FormElement["Text_CurrencySNo"]),
                    CurrencyCode = Convert.ToString(FormElement["Text_CurrencySNo"]).Split('-')[0],
                    OfficeSNo = Int32.TryParse(FormElement["OfficeSNo"], out number) ? number : 0,
                    Text_OfficeSNo = Convert.ToString(FormElement["Text_OfficeSNo"]),
                    CitySNo = Int32.TryParse(FormElement["CitySNo"], out number) ? number : 0,
                    Name = Convert.ToString(FormElement["Name"].ToString() == string.Empty ? "" : FormElement["Name"]),
                    Address = Convert.ToString(FormElement["Address"].ToString() == string.Empty ? "" : FormElement["Address"]),
                    //AgentAccountNo = Convert.ToString(FormElement["AgentAccountNo"].ToString() == string.Empty ? "" : FormElement["AgentAccountNo"]),
                    IATANo = Convert.ToString(FormElement["IATANo"].ToString() == string.Empty ? "" : FormElement["IATANo"]),
                    //CASSNo = Convert.ToString(FormElement["CASSNo"].ToString() == string.Empty ? "" : FormElement["CASSNo"]),
                    CASSNo = Convert.ToString(FormElement["CASSNo"]) == null ? "" : Convert.ToString(FormElement["CASSNo"]),
                    IsAllowedCL = Convert.ToBoolean(FormElement["IsAllowedCL"] == "0"),
                    IsAllowedConsolidatedCL = Convert.ToBoolean(FormElement["IsAllowedConsolidatedCL"] == "0"),
                    ValidFrom = string.IsNullOrEmpty(FormElement["ValidFrom"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ValidFrom"].ToString()),
                    ValidTo = string.IsNullOrEmpty(FormElement["ValidTo"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ValidTo"].ToString()),
                    IsActive = Convert.ToBoolean(FormElement["IsActive"] == "0"),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CreditLimit = Convert.ToDecimal(FormElement["CreditLimit"] == "" ? "0" : FormElement["CreditLimit"]),
                    BankGuarantee = Convert.ToDecimal(FormElement["BankGuarantee"] == "" ? "0" : FormElement["BankGuarantee"]),
                    MinimumCL = Convert.ToDecimal(FormElement["MinimumCL"] == "" ? "0" : FormElement["MinimumCL"]),
                    AlertCLPercentage = Convert.ToDecimal(FormElement["AlertCLPercentage"] == "" ? "0" : FormElement["AlertCLPercentage"]),
                    IsHeadAccount = Convert.ToBoolean(FormElement["IsHeadAccount"] == "0"),
                    Branch = FormElement["Branch"].ToString(),
                    Text_Branch = FormElement["Text_Branch"].ToString(),
                    BillingCode = FormElement["BillingCode"] == null ? "" : FormElement["BillingCode"],
                    AccountNo = FormElement["AccountNo"] == null ? "" : FormElement["AccountNo"],
                    IsWarehouse = Convert.ToBoolean(FormElement["IsWarehouse"] == "0"),
                    InvoicingCycle = FormElement["InvoicingCycle"] == "" ? 0 : Convert.ToInt32(FormElement["InvoicingCycle"]),
                    // add by umar 
                    FreightInvoicingCycle = FormElement["FreightInvoicingCycle"] == "" ? 0 : Convert.ToInt32(FormElement["FreightInvoicingCycle"]),
                    // end
                    IsBlacklist = Convert.ToBoolean(FormElement["IsBlacklist"] == "0"),
                    ForwarderAsConsignee = Convert.ToBoolean(FormElement["ForwarderAsConsignee"] == "0"),
                    GarudaMile = Convert.ToString(FormElement["GarudaMile"].ToString() == string.Empty ? "" : FormElement["GarudaMile"]),
                    LoginColorCodeSno = Convert.ToInt16(FormElement["LoginColorCodeSno"] == "" ? (int?)0 : Convert.ToInt16(FormElement["LoginColorCodeSno"])),
                    // IsBlacklist =Convert.ToBoolean(FormElement["IsBlacklist"])
                    // BusinessTypeSno = Convert.ToString(FormElement["BusinessTypeSno"]) == null ? "" : Convert.ToString(FormElement["BusinessTypeSno"]),
                    BusinessTypeSno = Convert.ToInt16(FormElement["BusinessTypeSno"] == "" ? (int?)0 : Convert.ToInt16(FormElement["BusinessTypeSno"])),
                    RateMarkUp = Convert.ToInt16(FormElement["RateMarkUp"] == "" ? (int?)0 : Convert.ToInt16(FormElement["RateMarkUp"])),


                    SMS = FormElement["SMS"] == null ? false : true,
                    Message = FormElement["Message"] == null ? false : true,
                    Mobile = FormElement["Mobile"],
                    Email = FormElement["Email"],
                    //  DisplayName = Convert.ToString(FormElement["DisplayName"].ToString() == "" ? "" : FormElement["DisplayName"]),
                    IsVendorType = Convert.ToInt32(FormElement["IsVendorType"]),

                    RegulatedAgentRegNo = FormElement["RegulatedAgentRegNo"] == string.Empty ? "" : FormElement["RegulatedAgentRegNo"],
                    //  AgentRegExpirydate = DateTime.Parse(FormElement["AgentRegExpirydate"]),
                    AgentRegExpirydate = FormElement["AgentRegExpirydate"] == string.Empty ? (DateTime?)null : DateTime.Parse(FormElement["AgentRegExpirydate"]),
                    //Sachin 27-12-2016
                    CustomCode = "",
                    CustomerTypeSNo = Convert.ToInt16(FormElement["CustomerTypeSNo"] == "" ? (int?)0 : Convert.ToInt16(FormElement["CustomerTypeSNo"])),
                    TransactionTypeSNo = Convert.ToInt16(FormElement["TransactionTypeSNo"] == "" ? (int?)0 : Convert.ToInt16(FormElement["TransactionTypeSNo"])),
                    CountrySNo = Convert.ToInt32(FormElement["CountrySNo"] == "" ? (int?)0 : Convert.ToInt32(FormElement["CountrySNo"])),
                    IndustryTypeSNO = Convert.ToInt32(FormElement["IndustryTypeSNO"] == "" ? (int?)0 : Convert.ToInt32(FormElement["IndustryTypeSNO"])),

                    RARegistrationNo = Convert.ToString(FormElement["RARegistrationNo"]) == string.Empty ? "" : Convert.ToString(FormElement["RARegistrationNo"]),
                    //  RARegistrationExpDate = Convert.ToDateTime(FormElement["RARegistrationExpDate"]),
                    RARegistrationExpDate = string.IsNullOrEmpty(FormElement["RARegistrationExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["RARegistrationExpDate"].ToString()),
                    ConsolidateInvoicing = Convert.ToBoolean(FormElement["ConsolidateInvoicing"] == "0"),
                    ConsolidateStock = Convert.ToBoolean(FormElement["ConsolidateStock"] == "0"),
                    ParticipantID = Convert.ToString(FormElement["ParticipantID"]) == string.Empty ? "" : Convert.ToString(FormElement["ParticipantID"]),
                    ERPCode = Convert.ToString(FormElement["ERPCode"]) == string.Empty ? "" : Convert.ToString(FormElement["ERPCode"]),
                    StockType = Convert.ToBoolean(FormElement["StockType"] == "0"),
                    IsAutoStock = Convert.ToInt16(FormElement["IsAutoStock"] == "" ? (int?)2 : Convert.ToInt16(FormElement["IsAutoStock"])),
                    NumOfDueDays = Convert.ToInt32(FormElement["NumOfDueDays"] == "" ? "0" : FormElement["NumOfDueDays"]),
                    Remarks = Convert.ToString(FormElement["Remark"]),
                    VatExempt = Convert.ToBoolean(FormElement["VatExempt"] == "0"),
                    ORCPercentage = Convert.ToInt32(FormElement["ORCPercentage"] == "" ? "0" : FormElement["ORCPercentage"]),
                    NoofReplan = Convert.ToInt32(FormElement["NoofReplan"] == "" ? "0" : FormElement["NoofReplan"]),
                    OtherAirlineSNo = Convert.ToString(FormElement["OtherAirlineSNo"]),

                    // FormElement["IsAutoStock"]=="0",
                    // Added by devendra on 12 JAN 2018
                    //IsAsAgreed = Convert.ToBoolean(FormElement["AsAgreed"] == "0"),
                    IsAsAgreed = FormElement["AsAgreed"] == null ? true : FormElement["AsAgreed"] == "0" ? true : false,
                    //Added By Pankaj Kumar Ishwar on 30/03/2018
                    GSTNumber = Convert.ToString(FormElement["GSTNumber"]),
                    GSTBillingAddress = Convert.ToString(FormElement["GSTADD"]),
                    DefaultGSTNumber = Convert.ToString(FormElement["DefaultGSTNumber"]),
                    DefaultGSTBillingAddress = Convert.ToString(FormElement["DEFAULTGSTADD"]),
                    RegisteredCompanyName = Convert.ToString(FormElement["RegCompanyName"]),
                    VisibilityofPriority = FormElement["VisibilityofPriority"] == "0" ? true : false,
                    SplitShipmentAllowed = Convert.ToInt32(FormElement["SplitShipmentAllowed"]),
                    AWBPrintAllowedHour = Convert.ToInt32(FormElement["AWBPrintAllowedHour"] == "" ? (int?)null : Convert.ToInt32(FormElement["AWBPrintAllowedHour"])),
                    AWBLabelAllowedHour = Convert.ToInt32(FormElement["AWBLabelAllowedHour"] == "" ? (int?)null : Convert.ToInt32(FormElement["AWBLabelAllowedHour"])),
                    OtherAirlinesSlab = listOtherAirlines,
                    IsExcludeBankGuarantee = FormElement["IsExcludeBankGuarantee"] == null ? false : true
                  
                };
                listAccount.Add(Account);

                List<AccountCollection> ListAccountCollection = new List<AccountCollection>();
                var accountCollection = new AccountCollection
                {
                    account = listAccount
                };

                ListAccountCollection.Add(accountCollection);
                object datalist = (object)listAccount;
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

        /// <summary>
        /// Update Account record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateAccount(int RecordID)
        {
            try
            {
                List<Account> listAccount = new List<Account>();
                List<OtherAirlines> listOtherAirlines = new List<OtherAirlines>();
                int number = 0;

                String[] Logo = SaveImage();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                string[] values = FormElement["tblOtherAirlineSlab_rowOrder"].ToString().Split(',');

                for (int count = 0; count < Convert.ToInt32(FormElement["tblOtherAirlineSlab_rowOrder"].ToString().Split(',').Length); count++)
                {
                    
                    listOtherAirlines.Add(new OtherAirlines()
                    {
                        SNo = 0,
               
                        HdnAirlineSNo = Convert.ToInt32(FormElement["tblOtherAirlineSlab_HdnAirlineSNo_" + values[count]]),
                        AccountSNo = RecordID,
                        ReferenceNumber = FormElement["tblOtherAirlineSlab_ReferenceNumber_" + values[count]]  

                    }
                    );

                }
                var Account = new Account
                {
                    SNo = Convert.ToInt32(RecordID),
                    //ParentID = 0,//int.Parse(FormElement["ParentID"].ToString() == "" ? "0" : FormElement["ParentID"].ToString()),
                    //Text_ParentID = FormElement["Text_ParentID"].ToString(),
                    AirlineSNo = Int32.TryParse(FormElement["AirlineSNo"], out number) ? number : 0,
                    AccountTypeSNo = Int32.TryParse(FormElement["AccountTypeSNo"], out number) ? number : 0,
                    CurrencySNo = Int32.TryParse(FormElement["CurrencySNo"], out number) ? number : 0,
                    //CurrencyCode = Convert.ToString(FormElement["Text_CurrencySNo"]),
                    CurrencyCode = Convert.ToString(FormElement["Text_CurrencySNo"]).Split('-')[0],
                    Text_CurrencySNo = Convert.ToString(FormElement["Text_CurrencySNo"]),
                    OfficeSNo = Int32.TryParse(FormElement["OfficeSNo"], out number) ? number : 0,
                    Text_OfficeSNo = Convert.ToString(FormElement["Text_OfficeSNo"]),
                    CitySNo = Int32.TryParse(FormElement["CitySNo"], out number) ? number : 0,
                    Name = Convert.ToString(FormElement["Name"].ToString() == string.Empty ? "" : FormElement["Name"]),
                    Address = Convert.ToString(FormElement["Address"].ToString() == string.Empty ? "" : FormElement["Address"]),
                    //  AgentAccountNo = Convert.ToString(FormElement["AgentAccountNo"].ToString() == string.Empty ? "" : FormElement["AgentAccountNo"]),
                    IATANo = Convert.ToString(FormElement["IATANo"].ToString() == string.Empty ? "" : FormElement["IATANo"]),
                    CASSNo = Convert.ToString(FormElement["CASSNo"]) == null ? "" : Convert.ToString(FormElement["CASSNo"]),
                    IsAllowedCL = FormElement["IsAllowedCL"] == "0",
                    IsAllowedConsolidatedCL = FormElement["IsAllowedConsolidatedCL"] == "0",
                    ValidFrom = string.IsNullOrEmpty(FormElement["ValidFrom"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ValidFrom"].ToString()),
                    ValidTo = string.IsNullOrEmpty(FormElement["ValidTo"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ValidTo"].ToString()),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CreditLimit = Convert.ToDecimal(FormElement["CreditLimit"] == string.Empty ? "0" : FormElement["CreditLimit"]),
                    BankGuarantee = Convert.ToDecimal(FormElement["BankGuarantee"] == string.Empty ? "0" : FormElement["BankGuarantee"]),
                    MinimumCL = Convert.ToDecimal(FormElement["MinimumCL"] == string.Empty ? "0" : FormElement["MinimumCL"]),
                    AlertCLPercentage = Convert.ToDecimal(FormElement["AlertCLPercentage"] == string.Empty ? "0" : FormElement["AlertCLPercentage"]),
                    IsHeadAccount = FormElement["IsHeadAccount"] == "0",
                    Branch = FormElement["Branch"].ToString(),
                    Text_Branch = FormElement["Text_Branch"].ToString(),
                    IsWarehouse = FormElement["IsWarehouse"] == "0",
                    InvoicingCycle = Convert.ToInt32(FormElement["InvoicingCycle"] == "" ? (int?)0 :Convert.ToInt32(FormElement["InvoicingCycle"])),
                    FreightInvoicingCycle = Convert.ToInt32(FormElement["FreightInvoicingCycle"] == "" ? (int?)0 : Convert.ToInt32(FormElement["FreightInvoicingCycle"])), // add by umar
                    IsBlacklist = FormElement["IsBlacklist"] == "0",
                    // Blacklist = Convert.ToString(FormElement["IsBlacklist"]),
                    BillingCode = FormElement["BillingCode"] == null ? "" : FormElement["BillingCode"],
                    AccountNo = FormElement["AccountNo"] == null ? "" : FormElement["AccountNo"],
                    ForwarderAsConsignee = FormElement["ForwarderAsConsignee"] == "0",
                    GarudaMile = Convert.ToString(FormElement["GarudaMile"].ToString() == string.Empty ? "" : FormElement["GarudaMile"]),
                    LoginColorCodeSno = Convert.ToInt16(FormElement["LoginColorCodeSno"] == "" ? (int?)0 : Convert.ToInt16(FormElement["LoginColorCodeSno"])),

                    SMS = FormElement["SMS"] == null ? false : true,
                    Message = FormElement["Message"] == null ? false : true,
                    Mobile = FormElement["Mobile"],
                    Email = FormElement["Email"],


                    //  DisplayName = Convert.ToString(FormElement["DisplayName"].ToString() == string.Empty ? "" : FormElement["DisplayName"]),
                    IsVendorType = Convert.ToInt32(FormElement["IsVendorType"]),

                    RegulatedAgentRegNo = FormElement["RegulatedAgentRegNo"],
                    AgentRegExpirydate = FormElement["AgentRegExpirydate"] == string.Empty ? (DateTime?)null : DateTime.Parse(  FormElement["AgentRegExpirydate"]),

                    CustomCode = "",
                    //Convert.ToInt16(FormElement["CustomerTypeSNo"]=="" ? (int?)0:  Convert.ToInt16(FormElement["CustomerTypeSNo"]))
                    CustomerTypeSNo = Convert.ToInt16(FormElement["CustomerTypeSNo"] == "" ? (int?)0 : Convert.ToInt16(FormElement["CustomerTypeSNo"])),
                    TransactionTypeSNo = Convert.ToInt16(FormElement["TransactionTypeSNo"] == "" ? (int?)0 : Convert.ToInt16(FormElement["TransactionTypeSNo"])),
                    CountrySNo = Convert.ToInt32(FormElement["CountrySNo"] == "" ? (int?)0 : Convert.ToInt32(FormElement["CountrySNo"])),
                    IndustryTypeSNO = Convert.ToInt32(FormElement["IndustryTypeSNO"] == "" ? (int?)0 : Convert.ToInt32(FormElement["IndustryTypeSNO"])),

                    RARegistrationNo = Convert.ToString(FormElement["RARegistrationNo"]),
                    RARegistrationExpDate = string.IsNullOrEmpty(FormElement["RARegistrationExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["RARegistrationExpDate"].ToString()),
                    ConsolidateInvoicing = Convert.ToBoolean(FormElement["ConsolidateInvoicing"] == "0"),
                    ConsolidateStock = Convert.ToBoolean(FormElement["ConsolidateStock"] == "0"),
                    ParticipantID = Convert.ToString(FormElement["ParticipantID"]),
                    ERPCode = Convert.ToString(FormElement["ERPCode"]),
                    StockType = Convert.ToBoolean(FormElement["StockType"] == "0"),
                    BusinessTypeSno = Convert.ToInt16(FormElement["BusinessTypeSno"] == "" ? (int?)0 : Convert.ToInt16(FormElement["BusinessTypeSno"])),
                    RateMarkUp = Convert.ToInt32(FormElement["RateMarkUp"] == "" ? (int?)0 : Convert.ToInt32(FormElement["RateMarkUp"])),
                    IsAutoStock = Convert.ToInt16(FormElement["IsAutoStock"] == "" ? (int?)2 : Convert.ToInt16(FormElement["IsAutoStock"])),
                    NumOfDueDays = Convert.ToInt32(FormElement["NumOfDueDays"] == "" ? "0" : FormElement["NumOfDueDays"]),
                    Remarks = Convert.ToString(FormElement["Remark"]),
                    VatExempt = Convert.ToBoolean(FormElement["VatExempt"] == "0"),
                    ORCPercentage = Convert.ToInt32(FormElement["ORCPercentage"] == "" ? "0" : FormElement["ORCPercentage"]),
                    NoofReplan = Convert.ToInt32(FormElement["NoofReplan"] == "" ? "0" : FormElement["NoofReplan"]),  
                    OtherAirlineSNo = Convert.ToString(FormElement["OtherAirlineSNo"]),
                    //IsAsAgreed = Convert.ToBoolean(FormElement["AsAgreed"] == "0"),
					IsAsAgreed = FormElement["AsAgreed"] == null ? true : FormElement["AsAgreed"] == "0" ? true : false,
					//Added By Pankaj Kumar Ishwar on 30/03/2018
					GSTNumber = Convert.ToString(FormElement["GSTNumber"]),  
                    GSTBillingAddress = Convert.ToString(FormElement["GSTADD"]),
                    DefaultGSTNumber = Convert.ToString(FormElement["DefaultGSTNumber"]),
                    DefaultGSTBillingAddress = Convert.ToString(FormElement["DEFAULTGSTADD"]),
                    RegisteredCompanyName = Convert.ToString(FormElement["RegCompanyName"]),
                    VisibilityofPriority = FormElement["VisibilityofPriority"] == "0" ? true : false,
                    SplitShipmentAllowed = Convert.ToInt32(FormElement["SplitShipmentAllowed"]),
                    AWBPrintAllowedHour = Convert.ToInt32(FormElement["AWBPrintAllowedHour"] == "" ? (int?)null : Convert.ToInt32(FormElement["AWBPrintAllowedHour"])),
                    AWBLabelAllowedHour = Convert.ToInt32(FormElement["AWBLabelAllowedHour"] == "" ? (int?)null : Convert.ToInt32(FormElement["AWBLabelAllowedHour"])),
                    OtherAirlinesSlab = listOtherAirlines,
                    IsExcludeBankGuarantee =Convert.ToBoolean(FormElement["hdnIsExcludeBankGuarantee"].ToUpper() == "FALSE" ? false : true)
                };
                listAccount.Add(Account);
                object datalist = (object)listAccount;
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

        /// <summary>
        /// Delete Account record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteAccount(string RecordID)
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
