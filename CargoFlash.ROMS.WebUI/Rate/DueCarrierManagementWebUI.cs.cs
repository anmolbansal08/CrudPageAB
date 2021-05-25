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
using CargoFlash.Cargo.Model.Rate;
using System.Collections;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.WebUI.Rate
{
    #region DueCarrier Class Description
    /*
	*****************************************************************************
	Class Name:		DueCarrierManagementWebUI      
	Purpose:		This Class used to get details of DueCarrier save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		26 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class DueCarrierManagementWebUI : BaseWebUISecureObject
    {
        public object GetDueCarrier()
        {
            object DueCarrier = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    DueCarrier DueCarrierList = new DueCarrier();
                    object obj = (object)DueCarrierList;
                    DueCarrier = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return DueCarrier;
        }
        public DueCarrierManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "DueCarrier";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public DueCarrierManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "DueCarrier";
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
                    htmlFormAdapter.HeadingColumnName = "Name";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetDueCarrier();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(ViewDueCarrierDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetDueCarrier();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(EditDueCarrierDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetDueCarrier();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(EditDueCarrierDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(EditDueCarrierDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetDueCarrier();
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
                    g.FormCaptionText = "Due Carrier";
                    g.CommandButtonNewText = "New Due Carrier";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Code", Title = "Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TempFreightType", Title = "Freight Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Carrier", Title = "Due", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Mandatory", Title = "Mandatory", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Editable", Title = "Editable", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "ShowOnCSR", Title = "ShowOnCSR", DataType = GridDataType.String.ToString() });//Updated by indra pratap singh

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
                        SaveDueCarrier();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveDueCarrier();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateDueCarrier(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteDueCarrier(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        private void SaveDueCarrier()
        {
            try
            {
                List<DueCarrier> listDueCarrier = new List<DueCarrier>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var DueCarrier = new DueCarrier
                {
                    Code = FormElement["Code"].ToUpper(),
                    Name = FormElement["Name"].ToUpper(),
                    IsCarrier = FormElement["IsCarrier"] == "1",
                    FreightType = FormElement["FreightType"],
                    IsMandatory = FormElement["IsMandatory"] == "0",
                    IsActive = FormElement["IsActive"] == "0",
                    IsEditable = FormElement["IsEditable"] == "0",
                    IsShowOnCSR = FormElement["IsshowOnCSR"] == "0",// updated by indra pratap singh

                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listDueCarrier.Add(DueCarrier);
                object datalist = (object)listDueCarrier;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void UpdateDueCarrier(string RecordID)
        {
            try
            {
                List<DueCarrier> listDueCarrier = new List<DueCarrier>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var DueCarrier = new DueCarrier
                {
                    SNo = Convert.ToInt32(RecordID),
                    Code = FormElement["Code"].ToUpper(),
                    Name = FormElement["Name"].ToUpper(),
                    IsCarrier = FormElement["IsCarrier"] == "1",
                    FreightType = FormElement["FreightType"],
                    IsMandatory = FormElement["IsMandatory"] == "0",
                    IsActive = FormElement["IsActive"] == "0",
                    IsEditable = FormElement["IsEditable"] == "0",
                    IsShowOnCSR = FormElement["IsshowOnCSR"] == "0",// Updated by indra pratap singh
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listDueCarrier.Add(DueCarrier);
                object datalist = (object)listDueCarrier;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void DeleteDueCarrier(string RecordID)
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
        public StringBuilder EditDueCarrierDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liDueCarrier' class='k-state-active'>Due Carrier Information</li>
                <li id='liDueCarrierSPHC' onclick='javascript:DueCarrierSPHCGrid();'>Due Carrier SPHC Details</li>
                <li id='liDueCarrierCommodity' onclick='javascript:DueCarrierCommodityGrid();'>Due Carrier Commodity Details</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnDueCarrierInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2'>
                <input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnDueCarrierSNo' name='hdnDueCarrierSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblDueCarrierSpecialHandlingTrans'></table></div><div id='divTab3'><table id='tblDueCarrierCommodityTrans'></table></div>");

            return containerLocal;
        }
        public StringBuilder ViewDueCarrierDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liDueCarrier' class='k-state-active'>Due Carrier Information</li>
                <li id='liDueCarrierSPHC' onclick='javascript:DueCarrierSPHCGrid();'>Due Carrier SPHC Details</li>
                <li id='liDueCarrierCommodity' onclick='javascript:DueCarrierCommodityGrid();'>Due Carrier Commodity Details</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnDueCarrierInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2'>
                <input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><input id='hdnDueCarrierSNo' name='hdnDueCarrierSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblDueCarrierSpecialHandlingTrans'></table></div><div id='divTab3'><table id='tblDueCarrierCommodityTrans'></table></div>");

            return containerLocal;
        }
    }
}
