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
	Class Name:		OfficeTargetManagementWebUI      
	Purpose:		This class used to handle HTTP Type Request/Response	
                    and communicate with REST Services for DML operations
                    object of this class is used in various Code behind files 
                    of Modules
	Company:		CargoFlash Infotecth Pvt Lrd.
	Author:			Badiuz zaman khan
	Created On:		2014-3-21
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class OfficeTargetManagementWebUI : BaseWebUISecureObject
    {
        public OfficeTargetManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "OfficeTarget";
                this.MyPrimaryID = "SNo";
            }
            catch(Exception ex)
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
                    htmlFormAdapter.HeadingColumnName = "OfficeName";
                    switch (DisplayMode)
                    {

                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateOfficeTargetTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetOfficeTargetRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateOfficeTargetTab(htmlFormAdapter.InstantiateIn()));
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetOfficeTargetRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(CreateOfficeTargetTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetOfficeTargetRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateOfficeTargetTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetOfficeTargetRecord();
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
        public override void DoPostBack()
        {

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveOfficeTarget();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2004), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveOfficeTarget();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2004), false);
                    break;
                case DisplayModeUpdate:
                    UpdateOfficeTarget(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2005), false);
                    break;
                case DisplayModeDelete:
                   ///DeleteOffice(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2006), false);
                    break;
            }
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
                    g.CommandButtonNewText = "New Office Target";
                    g.FormCaptionText = "Office Target";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "OfficeName", Title = "Office Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirportCode", Title = "Airport Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OfficeTargetType", Title = "Target Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TargetName", Title = "Target Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
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
        /// Method Used to Save office Detail and  
        /// </summary>
        private void SaveOfficeTarget()
        {
            try
            {
               
                List<OfficeTarget> listOffice = new List<OfficeTarget>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var officeTarget = new OfficeTarget
                {
                    AirPortSNo = int.Parse(FormElement["AirportSno"]),
                    OfficeSNo = int.Parse(FormElement["OfficeSNo"]),
                    TargetType = int.Parse(FormElement["TargetType"]),
                    TargetName = FormElement["TargetName"],
                    ProductSNo = int.Parse(FormElement["ProductSNo"]),
                    ProductName = FormElement["Text_ProductSNo"],
                    FlightTypeSNo = int.Parse(FormElement["FlightTypeSNo"]),
                    NoOfFlight = int.Parse(FormElement["NoOfFlight"]),
                    AverageWeightPerFlight =Decimal.Parse(FormElement["AverageWeightPerFlight"]),
                    CurrencySNo = int.Parse(FormElement["CurrencySNo"]),
                    CurrencyCode=FormElement["Text_CurrencySNo"],
                    ValidFrom = DateTime.Parse(FormElement["ValidFrom"]),
                    ValidTo = DateTime.Parse(FormElement["ValidTo"]),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                   
                };
                listOffice.Add(officeTarget);
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
        private void UpdateOfficeTarget(string recordID)
        {
            try
            {
                List<OfficeTarget> listofficeTarget = new List<OfficeTarget>();
                var FormElement = HttpContext.Current.Request.Form;
                var officeTarget = new OfficeTarget
                {
                    SNo = int.Parse(recordID),
                    AirPortSNo = int.Parse(FormElement["AirportSno"]),
                    OfficeSNo = int.Parse(FormElement["OfficeSNo"]),
                    TargetType = int.Parse(FormElement["TargetType"]),
                    TargetName = FormElement["TargetName"],
                    ProductSNo = int.Parse(FormElement["ProductSNo"]),
                    ProductName = FormElement["Text_ProductSNo"],
                    FlightTypeSNo = int.Parse(FormElement["FlightTypeSNo"]),
                    NoOfFlight = int.Parse(FormElement["NoOfFlight"]),
                    AverageWeightPerFlight = Decimal.Parse(FormElement["AverageWeightPerFlight"]),
                    CurrencySNo = int.Parse(FormElement["CurrencySNo"]),
                    CurrencyCode = FormElement["Text_CurrencySNo"],
                    ValidFrom = DateTime.Parse(FormElement["ValidFrom"]),
                    ValidTo = DateTime.Parse(FormElement["ValidTo"]),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                };
                listofficeTarget.Add(officeTarget);
                object datalist = (object)listofficeTarget;
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
        /// Get information of individual Account from database according record id supplied
        /// </summary>
        /// <returns>object type of entity Account found from database return null in case if touple not found</returns>
        public object GetOfficeTargetRecord()
        {
            object officeTarget = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    OfficeTarget officeTargetList = new OfficeTarget();
                    object obj = (object)officeTargetList;
                    //retrieve Entity from Database according to the record
                    officeTarget = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return officeTarget;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        private StringBuilder CreateOfficeTargetTab(StringBuilder container)
        {
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='lioffice' class='k-state-active'>Target Information</li>
                <li id='liOfficeTargetCommision'>Target Commission</li>
                <li id='liOfficeTargetPenalty'>Target Penalty</li>
            </ul>
            <div id='divTab1'> 
              <span id='spnOfficeTargetInformation'>");
            strBuilder.Append(container);
            strBuilder.Append(@"</span> 
            </div>
            <div id='divTab2'>
            <span id='spnOfficeTarget'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnofficeTargetSNo' name='hdnofficeTargetSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblOfficeTargetCommTrans'></table></span></div><div id='divTab3' ><span id='spnAccountTargetPenalty'><input id='hdnofficeTargetPenaltySNo' name='hdnofficeTargetPenaltySNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblOfficeTargetPenaltyTrans'></table></span></div></div> </div>");
            return strBuilder;

        }

    }
}
