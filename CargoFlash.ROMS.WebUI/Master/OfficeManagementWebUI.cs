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
using CargoFlash.Cargo.WebUI;
namespace CargoFlash.Cargo.WebUI.Master
{
    #region OfficeManagementWebUI Class Description
    /*
	*****************************************************************************
	Class Name:		officeManagementWebUI
	Purpose:		This class used to handle HTTP Type Request/Response
                    and communicate with REST Services for DML operations
                    object of this class is used in various Code behind files
                    of Modules
	Company:		CargoFlash Infotecth Pvt Lrd.
	Author:			Badiuz zaman khan
	Created On:		2014-2-18
	Approved By:
	Approved On:
	*****************************************************************************
	*/
    #endregion

    public class OfficeManagementWebUI : BaseWebUISecureObject
    {
        public OfficeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Office";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    switch (DisplayMode)
                    {
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
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
                    htmlFormAdapter.HeadingColumnName = "Name";
                    switch (DisplayMode)
                    {
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateOfficeTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordOffice();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateOfficeTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordOffice();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            // container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateOfficeTab(htmlFormAdapter.InstantiateIn()));

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordOffice();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateOfficeTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordOffice();
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
        ///
        /// </summary>
        /// <param name="Container"></param>
        /// <returns></returns>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Office";
                    g.FormCaptionText = "Office";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Name", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Name #\">#= Name #</span>" });
                    // g.Column.Add(new GridColumn { Field = "Name", Title = "Name", DataType = GridDataType.String.ToString()});
                    g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OfficeType", Title = "Office Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });
                    g.Column.Add(new GridColumn { Field = "CurrencyCode", Title = "Currency Code", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "GSTNumber", Title = "GST Number", DataType = GridDataType.String.ToString() });
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
        ///
        /// </summary>
        public override void DoPostBack()
        {

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveOfficeDetail();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveOfficeDetail();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateOfficeDetail(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;
                case DisplayModeDelete:
                    DeleteOffice(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        /// <summary>
        /// Method Used to Save office Detail and OfficeCredit limit
        /// </summary>
        private void SaveOfficeDetail()
        {
            try
            {
                List<Office> listOffice = new List<Office>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var office = new Office
                {
                    //=== by arman
                    ParentID = int.Parse(FormElement["IsHeadOffice"] == "0" ? "0" : FormElement["ParentID"].ToString()),
                    Text_ParentID = FormElement["IsHeadOffice"] == "0" ? "" : FormElement["Text_ParentID"] == null ? "" : FormElement["Text_ParentID"].ToString(),
                    //===end
                    Name = FormElement["Name"],
                    Address = FormElement["Address"],
                    CitySNo = int.Parse(FormElement["CitySno"]),
                    CityCode = FormElement["Text_CitySNo"].Split('-')[0],
                    CityName = FormElement["Text_CitySNo"].Split('-')[1],
                    AirportSNo = int.Parse(FormElement["AirportSNo"]),
                    AirportCode = FormElement["Text_AirportSNo"].Split('-')[0],
                    AirportName = FormElement["Text_AirportSNo"].Split('-')[1],
                    //CurrencySNo = int.Parse(FormElement["CurrencySNo"]),
                    //CurrencyCode = FormElement["Text_CurrencySNo"].Split('-')[0],
                    CurrencySNo = FormElement["CurrencySNo"].ToString(),
                    CurrencyCode = FormElement["Text_CurrencySNo"].Split('-')[0],
                    ERPCode = FormElement["ERPCode"],
                    Longitude = Decimal.Parse(FormElement["longitude"].ToString() == "" ? "0" : FormElement["longitude"]),
                    Latitude = Decimal.Parse(FormElement["Latitude"].ToString() == "" ? "0" : FormElement["Latitude"]),
                    ValidFrom = DateTime.Parse(FormElement["ValidFrom"]),
                    ValidTo = DateTime.Parse(FormElement["ValidTo"]),
                    IsSelf = FormElement["IsSelf"] == "0",
                    IsAllowedCL = FormElement["IsAllowedCL"] == "0",
                    IsActive = FormElement["IsActive"] == "0",
                    AllowCreditLimitOnAgent = FormElement["AllowCreditLimitOnAgent"] == "0",
                    AllowCreditLimitOfOffice = FormElement["AllowCreditLimitOfOffice"] == "0",
                    //InvoicingCycle=int.Parse(FormElement["InvoicingCycle"]),
                    InvoicingCycle = FormElement["InvoicingCycle"] == "" ? 0 : Convert.ToInt32(FormElement["InvoicingCycle"]),
                    CreatedBy = int.Parse(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = int.Parse(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    CreditLimit = Decimal.Parse(FormElement["CreditLimit"] == "" ? "0" : FormElement["CreditLimit"]),
                    MinimumCL = Decimal.Parse(FormElement["MinimumCL"] == "" ? "0" : FormElement["MinimumCL"]),
                    AlertClPerCentage = Decimal.Parse(FormElement["AlertClPercentage"] == "" ? "0" : FormElement["AlertClPercentage"]),
                    IsHeadOffice = FormElement["IsHeadOffice"] == "0",
                    OfficeType = FormElement["OfficeType"].ToString(),
                    Text_OfficeType = FormElement["Text_OfficeType"].ToString(),
                    //SitaAddress = FormElement["Text_SitaAddress"].ToString(),
                    CustomsOriginCode = FormElement["Text_CustomsOriginCode"],
                    IsConsolidatedStock = FormElement["IsConsolidatedStock"] == "0", //Added by Akaram Ali on 18 nov 2017
                    GSTNumber = FormElement["GSTNumber"],

                    SMS = FormElement["SMS"] == null ? false : true,
                    Message = FormElement["Message"] == null ? false : true,
                    MessageCSR = FormElement["MessageCSR"] == null ? false : true,
                    Mobile = FormElement["Mobile"],
                    Email = FormElement["Email"],
                     EmailID = FormElement["EmailID"],
                    //InvoiceDays = int.Parse((FormElement["InvoiceDays"].ToString() == "" ? "0" : FormElement["InvoiceDays"].ToString())),
                    InvoiceDays = int.Parse(FormElement["InvoiceDays"]==""?"0":FormElement["InvoiceDays"].ToString()),
                    StockUtilization=int.Parse(FormElement["StockUtilization"] == ""? "0":FormElement["StockUtilization"].ToString())
                    //RegulatedAgentRegNo = FormElement["Text_RegulatedAgentRegNo"],
                    //AgentRegExpirydate = DateTime.Parse(FormElement["AgentRegExpirydate"]),
                };
                listOffice.Add(office);
                object datalist = (object)listOffice;
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
        /// Get information of individual Account from database according record id supplied
        /// </summary>
        /// <returns>object type of entity Account found from database return null in case if touple not found</returns>
        public object GetRecordOffice()
        {
            object office = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Office officeList = new Office();
                    object obj = (object)officeList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    office = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return office;
        }

        /// <summary>
        /// Update Account record into the database
        /// Retrieve information from webform and store the same into modal
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateOfficeDetail(string RecordID)
        {
            try
            {
                List<Office> listoffice = new List<Office>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var office = new Office
                {
                    SNo = int.Parse(RecordID),
                    ParentID = int.Parse(FormElement["IsHeadOffice"]== "0" ? "0" : FormElement["ParentID"].ToString()),
                    //Text_ParentID = FormElement["IsHeadOffice"]=="0" ? "" : FormElement["ParentID"].ToString(),
                    Name = FormElement["Name"],
                    Address = FormElement["Address"],
                    CitySNo = int.Parse(FormElement["CitySno"]),
                    CityCode = FormElement["Text_CitySNo"].Split('-')[0],
                    CityName = FormElement["Text_CitySNo"].Split('-')[1],
                    AirportSNo = int.Parse(FormElement["AirportSNo"]),
                    AirportCode = FormElement["Text_AirportSNo"].Split('-')[0],
                    AirportName = FormElement["Text_AirportSNo"].Split('-')[1],
                    CurrencySNo = FormElement["CurrencySNo"].ToString(),
                    CurrencyCode = FormElement["Text_CurrencySNo"],
                    ERPCode = FormElement["ERPCode"],
                    Longitude = Decimal.Parse(FormElement["longitude"].ToString() == "" ? "0" : FormElement["longitude"]),
                    Latitude = Decimal.Parse(FormElement["Latitude"].ToString() == "" ? "0" : FormElement["Latitude"]),
                    ValidFrom = DateTime.Parse(FormElement["ValidFrom"]),
                    ValidTo = DateTime.Parse(FormElement["ValidTo"]),
                    IsSelf = FormElement["IsSelf"] == "0",
                    IsAllowedCL = FormElement["IsAllowedCL"] == "0",
                    IsActive = FormElement["IsActive"] == "0",
                    AllowCreditLimitOnAgent = FormElement["AllowCreditLimitOnAgent"] == "0",
                    AllowCreditLimitOfOffice = FormElement["AllowCreditLimitOfOffice"] == "0",
                    InvoicingCycle = Convert.ToInt32(FormElement["InvoicingCycle"] == "" ? (int?)0 : Convert.ToInt32(FormElement["InvoicingCycle"])),
                    CreatedBy = int.Parse(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = int.Parse(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    CreditLimit = Decimal.Parse(FormElement["CreditLimit"] == "" ? "0" : FormElement["CreditLimit"]),
                    MinimumCL = Decimal.Parse(FormElement["MinimumCL"] == "" ? "0" : FormElement["MinimumCL"]),
                    AlertClPerCentage = Decimal.Parse(FormElement["AlertClPercentage"] == "" ? "0" : FormElement["AlertClPercentage"]),
                    IsHeadOffice = FormElement["IsHeadOffice"] == "0",
                    OfficeType = FormElement["OfficeType"].ToString(),
                    Text_OfficeType = FormElement["Text_OfficeType"].ToString(),
                    //SitaAddress = FormElement["SitaAddress"].ToString(),
                    CustomsOriginCode = FormElement["CustomsOriginCode"],
                    IsConsolidatedStock = FormElement["IsConsolidatedStock"] == "0",//Added by Akaram Ali on 18 nov 2017
                    GSTNumber = FormElement["GSTNumber"],
                    SMS = FormElement["SMS"] == null ? false : true,
                    Message = FormElement["Message"] == null ? false : true,
                    MessageCSR = FormElement["MessageCSR"] == null ? false : true,
                    Mobile = FormElement["Mobile"],
                    Email = FormElement["Email"],
                    EmailID = FormElement["EmailID"],
                    InvoiceDays=int.Parse(FormElement["InvoiceDays"].ToString()),
                    StockUtilization = int.Parse(FormElement["StockUtilization"] == "" ? "0" : FormElement["StockUtilization"].ToString())
                    //RegulatedAgentRegNo = FormElement["RegulatedAgentRegNo"],
                    //AgentRegExpirydate = DateTime.Parse(FormElement["AgentRegExpirydate"]),
                };
                listoffice.Add(office);
                object datalist = (object)listoffice;
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
        /// Delete Office record from the database
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteOffice(string RecordID)
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

        /// <summary>
        ///
        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        private StringBuilder CreateOfficeTab(StringBuilder container)
        {
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='lioffice' class='k-state-active'>Office Information</li>
                <li id='liContactInformation' onclick='javascript:ContactInformationGrid();'>Contact Information</li>
                <li id='liOfficeAirline'>Associated Airlines</li>
                 <li id='liBranch' onclick='javascript:OfficeBranchGrid();'>Branch</li>
                <li id='liOfficeCommision'  >Office Commission</li>
                <li style='display:none;' id='liAcceptanceVariance'>Acceptance Variance</li>



           </ul>
            <div id='divTab1'>
              <span id='spnOfficeInformation'>");
            strBuilder.Append(container);
            strBuilder.Append(@"</span>
            </div>
      <div id='divContactInformation' style='overflow-x:scroll;'><span id='spnContactInformation'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnofficSNo' name='hdnofficSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblContactInformation'></table></span></div><div id='divTab2'><span id='spnOfficeAirlineTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnofficSNo' name='hdnofficSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><table id='tblOfficeAirlineTrans'></table></span></div><div id='divTab3'><span id='spnBranch'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnofficSNo' name='hdnofficSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><table id='tblBranch'></table></span></div><div id='divTab4' ><span id='spnOfficeCommision'><input id='hdnOfficeCommisionSNo' name='hdnOfficeCommisionSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblOfficeCommision'></table></span></div><div id='divTab4' ><span id='spnAcceptanceVariance'><input id='hdnAirlineSNo' name='hdnAirlineSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblAcceptanceVariance'></table></span></div>   </div> </div>");
            return strBuilder;
            //third tab name change  old name Assign Office To Airline new name Associated Airlines
        }
    }
}
