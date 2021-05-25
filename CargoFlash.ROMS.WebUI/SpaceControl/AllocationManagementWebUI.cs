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
    public class AllocationManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordAllocation()
        {
            object alloc = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Allocation AllocationList = new Allocation();
                    object obj = (object)AllocationList;
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
        public AllocationManagementWebUI()
        {
            try
            {
                this.MyModuleID = "SpaceControl";
                this.MyAppID = "Allocation";
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
                            htmlFormAdapter.objFormData = GetRecordAllocation();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(ViewAllocationDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordAllocation();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(EditAllocationDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordAllocation();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(EditAllocationDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordAllocation();
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
                    g.FormCaptionText = "Allocation";
                    g.CommandButtonNewText = "New Allocation";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AircraftType", Title = "Aircraft", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AllocationCode", Title = "Allocation Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OrginAirportName", Title = "OrginAirport Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationAirportName", Title = "DestinationAirport Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "StartDate", Title = "Start Date", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "EndDate", Title = "End Date", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightNumber", Title = "Flight No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IsActive", Title = "Active", DataType = GridDataType.Boolean.ToString() });
                    //g.Column.Add(new GridColumn { Field = "FlightNumber", Title = "FlightNumber", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "StartDate", Title = "StartDate", DataType = GridDataType.Date.ToString() });
                    //g.Column.Add(new GridColumn { Field = "EndDate", Title = "EndDate", DataType = GridDataType.Date.ToString() });

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
                        SaveAllocation();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveAllocation();
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
        private void SaveAllocation()
        {
            try
            {
                List<Allocation> listAloc = new List<Allocation>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var aloc = new Allocation
                {
                    SNo = 0,
                    AircraftSNo = Convert.ToInt32(FormElement["AircraftSNo"].ToString()),
                    AllocationCode = FormElement["AllocationCode"].ToString(),
                    OriginAirportSNo = Convert.ToInt32(FormElement["OriginAirportSNo"].ToString()),
                    DestinationAirportSNo = Convert.ToInt32(FormElement["DestinationAirportSNo"].ToString()),
                    StartDate = Convert.ToDateTime(FormElement["StartDate"].ToString()),
                    EndDate = Convert.ToDateTime(FormElement["EndDate"].ToString()),
                    CarrierCode = FormElement["CarrierCode"].ToString(),
                    FlightNo = FormElement["CarrierCode"].ToString() + "-" + FormElement["FlightNumber"].ToString(),
                    FlightNumber = FormElement["FlightNumber"].ToString(),
                    Remarks = FormElement["Remarks"].ToString(),
                    IsActive = FormElement["IsActive"] == null ? false : true
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
                List<Allocation> listAloc = new List<Allocation>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var aloc = new Allocation
                {
                    SNo = Convert.ToInt32(RecordID),
                    AircraftSNo = Convert.ToInt32(FormElement["AircraftSNo"].ToString()),
                    AllocationCode = FormElement["AllocationCode"].ToString(),
                    OriginAirportSNo = Convert.ToInt32(FormElement["OriginAirportSNo"].ToString()),
                    DestinationAirportSNo = Convert.ToInt32(FormElement["DestinationAirportSNo"].ToString()),
                    StartDate = Convert.ToDateTime(FormElement["StartDate"].ToString()),
                    EndDate = Convert.ToDateTime(FormElement["EndDate"].ToString()),
                    CarrierCode = FormElement["CarrierCode"].ToString(),
                    FlightNo = FormElement["CarrierCode"].ToString() + "-" + FormElement["FlightNumber"].ToString(),
                    FlightNumber = FormElement["FlightNumber"].ToString(),
                    Remarks = FormElement["Remarks"].ToString(),
                    CreatedBy = Convert.ToInt32( ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    IsActive = FormElement["IsActive"] == null ? false : true
                };
                listAloc.Add(aloc);
                object datalist = (object)listAloc;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
                }
                //List<DueCarrier> listDueCarrier = new List<DueCarrier>();
                //var FormElement = System.Web.HttpContext.Current.Request.Form;
                //var DueCarrier = new DueCarrier
                //{
                //    SNo = Convert.ToInt32(RecordID),
                //    Code = FormElement["Code"].ToUpper(),
                //    Name = FormElement["Name"].ToUpper(),
                //    IsCarrier = FormElement["IsCarrier"] == "1",
                //    FreightType = FormElement["FreightType"],
                //    IsMandatory = FormElement["IsMandatory"] == "0",
                //    IsActive = FormElement["IsActive"] == "0",
                //    IsEditable = FormElement["IsEditable"] == "0",
                //    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                //    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                //};
                //listDueCarrier.Add(DueCarrier);
                //object datalist = (object)listDueCarrier;
                //DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
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
        public StringBuilder EditAllocationDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAllocation' class='k-state-active'>Allocation Information</li>
                <li id='liAllocationTrans' onclick='javascript:AllocationTransGrid();'>Allocation Trans Details</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnAllocationInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2'>
                <input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnAllocationSNo' name='hdnAllocationSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAllocationTrans'></table></div>");

            return containerLocal;
        }
        public StringBuilder ViewAllocationDetailsPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAllocation' class='k-state-active'>Allocation Information</li>
                <li id='liAllocationTrans' onclick='javascript:AllocationTransGrid();'>Allocation Trans Details</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnAllocationInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2'>
                <input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><input id='hdnAllocationSNo' name='hdnAllocationSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblAllocationTrans'></table></div>");

            return containerLocal;
        }
    }
}
