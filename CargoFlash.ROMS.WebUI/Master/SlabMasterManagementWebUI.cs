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
 
namespace CargoFlash.Cargo.WebUI.Master
{
    #region SlabMaster Class Description
    /*
	*****************************************************************************
	Class Name:		SlabMasterManagementWebUI      
	Purpose:		This Class used to get details of SlabMaster save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		11 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class SlabMasterManagementWebUI : BaseWebUISecureObject
    {
        public object GetSlabMaster()
        {
            object SlabMaster = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    SlabMaster SlabMasterList = new SlabMaster();
                    object obj = (object)SlabMasterList;
                    SlabMaster = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return SlabMaster;
        }
        public SlabMasterManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "SlabMaster";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public SlabMasterManagementWebUI(Page PageContext)
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
                this.MyAppID = "SlabMaster";
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
                    htmlFormAdapter.HeadingColumnName = "SlabTitle";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetSlabMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(ViewSlabMasterDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetSlabMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(EditSlabMasterDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetSlabMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           // container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(EditSlabMasterDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(EditSlabMasterDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetSlabMaster();
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
                    g.FormCaptionText = "Slab Master";
                    g.CommandButtonNewText = "New Slab Master";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SlabTitle", Title = "Slab Title", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_SlabLevel", Title = "Slab Level", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Default", Title = "Default Slab", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Slab", Title = "Slab Names", DataType = GridDataType.String.ToString() });
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
                        SaveSlabMaster();
                            if (ErrorMessageList.Count > 0)
                            {
                                if (ErrorMessageList[0] == "0")
                                {
                                    ErrorMessage = ErrorMessage.Replace("<li>0</li>", string.Empty);
                                }
                                else
                                {
                                    if (ErrorMessageList[0] == "1001" )
                                    {
                                        ErrorMessage = ErrorMessage.Replace("<li>1001</li>", string.Empty);
                                    }
                                    else if (ErrorMessageList[0] == "1234")
                                    {
                                        ErrorMessage = ErrorMessage.Replace("<li>1234</li>", string.Empty);
                                    }
                                    else
                                    {
                                        this.MyRecordID = ErrorMessageList[0];
                                        ErrorMessage = "";
                                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("EDIT", true, 2000) , false);
                                        //ScriptManager.RegisterStartupScript(this.Page, this.GetType(), "script", "Confirm();", true);
                                    }
                                }
                            }
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveSlabMaster();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateSlabMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteSlabMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        private void SaveSlabMaster()
        {
            try
            {
                List<SlabMaster> listSlabMaster = new List<SlabMaster>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var SlabMaster = new SlabMaster
                {
                    SNo=0,
                    SlabTitle = FormElement["SlabTitle"],
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    IsDefault = FormElement["IsDefault"]== "1" ?true:false,
                    //CountrySNo = FormElement["CountryCode"],
                    //CountryCode = FormElement["Text_CountryCode"] == "" ? null : FormElement["Text_CountryCode"],
                    SlabLevel = FormElement["SlabLevel"] == "" ? 255 : Convert.ToInt32(FormElement["SlabLevel"]),
                    Slab = Convert.ToString(FormElement["Slab"] == "" ? null : FormElement["Slab"]),
                    IsActive = FormElement["IsActive"] == "0" ? true : false,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listSlabMaster.Add(SlabMaster);
                object datalist = (object)listSlabMaster;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void UpdateSlabMaster(string RecordID)
        {
            try
            {
                List<SlabMaster> listSlabMaster = new List<SlabMaster>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var SlabMaster = new SlabMaster
                {
                    SNo = Convert.ToInt32(RecordID),
                    SlabTitle = FormElement["SlabTitle"],
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    IsDefault = FormElement["IsDefault"]== "1" ?true:false,
                    //CountrySNo = FormElement["CountryCode"],
                    //CountryCode = FormElement["Text_CountryCode"] == "" ? null : FormElement["Text_CountryCode"],
                    SlabLevel = FormElement["SlabLevel"] == "" ? 255 : Convert.ToInt32(FormElement["SlabLevel"]),
                    Slab = Convert.ToString(FormElement["Slab"] == "" ? null : FormElement["Slab"]),
                    IsActive = FormElement["IsActive"] == "0" ? true : false,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listSlabMaster.Add(SlabMaster);
                object datalist = (object)listSlabMaster;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void DeleteSlabMaster(string RecordID)
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
        public StringBuilder ViewSlabMasterDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
        <div id='MainDiv'>
            <div id='ApplicationTabs'>
            <ul>
                <li  id='liSlabMaster' class='k-state-active'>Slab Master Information</li>
                    <li id='liSlab' onclick='javascript:CreateSlab();'>Slab Details</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnSlabMasterInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2' >
                <input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnSlabMasterSNo' name='hdnSlabMasterSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblSlab'></table>");
            return containerLocal;
        }
        public StringBuilder EditSlabMasterDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liSlabMaster' class='k-state-active'>Slab Master Information</li>
                    <li id='liSlab' onclick='javascript:CreateSlab();'>Slab Details</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnSlabMasterInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2' >
                <input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnSlabMasterSNo' name='hdnSlabMasterSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblSlab'></table>");
            return containerLocal;
        }
    }
}
