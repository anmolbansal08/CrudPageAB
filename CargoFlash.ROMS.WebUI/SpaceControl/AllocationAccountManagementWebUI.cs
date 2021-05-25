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
using System.Collections;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.SpaceControl;


namespace CargoFlash.Cargo.WebUI.SpaceControl
{
    public class AllocationAccountManagementWebUI :BaseWebUISecureObject
    {
        public object GetAllocationAccountRecord()
        {
            object alloc = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AllocationAccount AllocationAcList = new AllocationAccount();
                    object obj = (object)AllocationAcList;
                    alloc = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return alloc;
        }
        public AllocationAccountManagementWebUI()
        {
            try
            {
                this.MyModuleID = "SpaceControl";
                this.MyAppID = "AllocationAccount";
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
                    htmlFormAdapter.HeadingColumnName = "AllocationCode";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetAllocationAccountRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                           // container.Append(ViewAllocationDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetAllocationAccountRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(EditAllocationDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetAllocationAccountRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(EditAllocationAccountTransULDPage(htmlFormAdapter.InstantiateIn()));
                           container.Append(EditAllocationAccountTransULDPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetAllocationAccountRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    if (this.FormAction.ToString().ToUpper().Trim() == "NEW")
                        container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAllocationTransAcountSNo' name='hdnAllocationTransAcountSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblAllocationTransAccount'></table>");
                   
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
                    g.FormCaptionText = "Allocation Account";
                    g.CommandButtonNewText = "New Allocation Account";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ProductName", Title = "Product Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AccountAllocationCode", Title = "AccountAllocation Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", DataType = GridDataType.Decimal.ToString() });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", DataType = GridDataType.Decimal.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReleaseTime", Title = "Release Time", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "StartDate", Title = "Start Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EndDate", Title = "End Date", DataType = GridDataType.String.ToString() });

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
                        SaveAllocationAccount();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveAllocationAccount();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateAllocation(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteAllocation(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        private void SaveAllocationAccount()
        {
            try
            {
                List<AllocationAccount> listAloc = new List<AllocationAccount>();
                var e = System.Web.HttpContext.Current.Request.Form;
                var aloc = new AllocationAccount
                {
                    SNo = 0 ,
                    AccountAllocationCode = e["AccountAllocationCode"].ToString() ,
                    Remarks = e["Remarks"].ToString(),
                //    AccountSNo = Convert.ToInt32(e["AccountSNo"].ToString()),
                  //  AllocationTransSNo = Convert.ToInt32(e["AllocationTransSNo"].ToString()),
                  //  ProductSNo = Convert.ToInt32(e["ProductSNo"].ToString()),
                    AllocationBlockType = Convert.ToInt32(e["AllocationBlockType"].ToString()),
                    Day1 = e["Day1"] == null ? false : true,
                    Day2 = e["Day2"] == null ? false : true,
                    Day3 = e["Day3"] == null ? false : true,
                    Day4 = e["Day4"] == null ? false : true,
                    Day5 = e["Day5"] == null ? false : true,
                    Day6 = e["Day6"] == null ? false : true,
                    Day7 = e["Day7"] == null ? false : true,
                    StartDate = (DateTime.Parse(e["StartDate"].ToString()).ToString("dd-MMM-yyyy")),
                    EndDate = (DateTime.Parse(e["EndDate"].ToString()).ToString("dd-MMM-yyyy")),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"].ToString()),
                    ReleaseTime = e["ReleaseTime"].ToString(),
                    BsaReference = e["BsaReference"].ToString(),
                    IsActive = e["IsActive"] == null ? false : true,
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                };
                listAloc.Add(aloc);
                object datalist = (object)listAloc;
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
        private void UpdateAllocation(string RecordID)
        {
            try
            {
                List<AllocationAccount> listAloc = new List<AllocationAccount>();
                var e = System.Web.HttpContext.Current.Request.Form;
                var aloc = new AllocationAccount
                {
                    SNo = Convert.ToInt32(RecordID),
                    AccountAllocationCode = e["AccountAllocationCode"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    AccountSNo = e["AccountSNo"].ToString(),
                    // AllocationTransSNo = Convert.ToInt32(e["AllocationTransSNo"].ToString()),
                    ProductSNo = e["ProductSNo"].ToString(),
                    AllocationBlockType = Convert.ToInt32(e["AllocationBlockType"].ToString()),
                    Day1 = e["Day1"] == null ? false : true,
                    Day2 = e["Day2"] == null ? false : true,
                    Day3 = e["Day3"] == null ? false : true,
                    Day4 = e["Day4"] == null ? false : true,
                    Day5 = e["Day5"] == null ? false : true,
                    Day6 = e["Day6"] == null ? false : true,
                    Day7 = e["Day7"] == null ? false : true,
                    StartDate = Convert.ToDateTime(e["StartDate"]).ToString(),
                    EndDate = Convert.ToDateTime(e["EndDate"]).ToString(),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"].ToString()),
                    ReleaseTime = e["ReleaseTime"].ToString(),
                    BsaReference = e["BsaReference"].ToString(),
                    IsActive = e["IsActive"] == null ? false : true,
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                };
                listAloc.Add(aloc);
                object datalist = (object)listAloc;
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
        private void DeleteAllocation(string RecordID)
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
        public StringBuilder EditAllocationAccountTransULDPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAllocation' class='k-state-active'>Allocation Account Information</li>
                <li id='liAllocationTrans' onclick='javascript:AllocationAccountULDDetails() ;'>Allocation Trans ULD Details</li> 
            </ul>
            <div id='divTab1' > 
              <span id='spnAllocationInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2'>
                <input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/>
                <input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/>
                <input id='hdnAllocationTransAccountSNo' name='hdnAllocationTransAccountSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAllocationTransAccountULD'></table></div>");

            return containerLocal;
        }
//        public StringBuilder ViewAllocationDetailsPage(StringBuilder container)
//        {
//            StringBuilder containerLocal = new StringBuilder();
//            containerLocal.Append(@"
//    <div id='MainDiv'>
//        <div id='ApplicationTabs'>
//            <ul>
//                <li  id='liAllocation' class='k-state-active'>Allocation Information</li>
//                <li id='liAllocationTrans' onclick='javascript:AllocationTransGrid();'>Allocation Trans Details</li>
//            </ul>
//            <div id='divTab1' > 
//              <span id='spnAllocationInformation'>");
//            containerLocal.Append(container);
//            containerLocal.Append(@"</span> 
//            </div>
//            <div id='divTab2'>
//                <input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><input id='hdnAllocationSNo' name='hdnAllocationSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblAllocationTrans'></table></div>");

//            return containerLocal;
//        }
    }
}
