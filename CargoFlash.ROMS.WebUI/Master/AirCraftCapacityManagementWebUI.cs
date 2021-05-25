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
    #region AirCraft Capacity Class Description
    /*
	*****************************************************************************
	Class Name:		AirCraftCapacityManagementWebUI      
	Purpose:		This Class used to get details of AirCraft Capacity save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		06 May 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class AirCraftCapacityManagementWebUI : BaseWebUISecureObject
    {
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
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
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
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return container;
        }

        public object GetRecordAirCraftCapacity()
        {
            object AirCraftCapacity = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AirCraftCapacity AirCraftCapacityList = new AirCraftCapacity();
                    object obj = (object)AirCraftCapacityList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    AirCraftCapacity = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return AirCraftCapacity;
        }

        public AirCraftCapacityManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "AirCraftCapacity";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public AirCraftCapacityManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPrimaryID = "SNo";
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Master";
                this.MyAppID = "AirCraftCapacity";
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
                    htmlFormAdapter.HeadingColumnName = "Text_AirCraftSNo";
                    //htmlFormAdapter.AuditLogColumn = "AirCraftSNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordAirCraftCapacity();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(ViewAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            container.Append(CreateAirCraftCapacityTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordAirCraftCapacity();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateAirCraftCapacityTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordAirCraftCapacity();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateAirCraftCapacityTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateAirCraftCapacityTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordAirCraftCapacity();
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

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Aircraft Info (Regn Nbr)";
                    g.FormCaptionText = "Aircraft Info (Regn Nbr)";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirCraftSNo", Title = "Aircraft Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirCraftInventorySNo", Title = "Registration No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OriginSNo", Title = "Origin City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_DestinationSNo", Title = "Destination City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "strVolumeWeightType", Title = "Vol. Wt Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Vol. Wt", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "strGrossWeightType", Title = "Gr. Wt Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gr. Wt", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "MaxGrossWtPiece", Title = "Max Wt Per Piece", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(Container);
                    //g.Action = new List<GridAction>();
                    //g.Action.Add(new GridAction { ButtonCaption = "Read", ActionName = "READ", AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return Container;
        }

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveAirCraftCapacity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveAirCraftCapacity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateAirCraftCapacity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteAirCraftCapacity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void SaveAirCraftCapacity()
        {
            try
            {
                List<AirCraftCapacity> listAirCraftCapacity = new List<AirCraftCapacity>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AirCraftCapacity = new AirCraftCapacity
                {
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    AirCraftSNo = FormElement["AirCraftSNo"],
                    AirCraftInventorySNo = FormElement["AirCraftInventorySNo"],
                    OriginSNo = FormElement["OriginSNo"] == "" ? null : FormElement["OriginSNo"],
                    DestinationSNo = FormElement["DestinationSNo"] == "" ? null : FormElement["DestinationSNo"],
                    FlyingMinutesStart = FormElement["FlyingMinutesStart"] == "" ? null : FormElement["FlyingMinutesStart"],
                    FlyingMinuteEnd = FormElement["FlyingMinuteEnd"] == "" ? null : FormElement["FlyingMinuteEnd"],
                    VolumeWeight = FormElement["VolumeWeight"],
                    VolumeWeightType = FormElement["VolumeWeightType"],
                    GrossWeight = FormElement["GrossWeight"],
                    GrossWeightType = FormElement["GrossWeightType"],
                    MaxGrossWtPiece = FormElement["MaxGrossWtPiece"] == "" ? null : FormElement["MaxGrossWtPiece"],
                    ReportGrossWeight = FormElement["ReportGrossWeight"] == "" ? null : FormElement["ReportGrossWeight"],
                    AlertVolumeWeight = FormElement["AlertVolumeWeight"] == "" ? null : FormElement["AlertVolumeWeight"],
                    AlertGrossWeight = FormElement["AlertGrossWeight"] == "" ? null : FormElement["AlertGrossWeight"],
                    LeverageGrossWeight = FormElement["LeverageGrossWeight"] == "" ? null : FormElement["LeverageGrossWeight"],
                    LeverageVolumeWeight = FormElement["LeverageVolumeWeight"] == "" ? null : FormElement["LeverageVolumeWeight"],
                    LeverageAlertGrossWeight = FormElement["LeverageAlertGrossWeight"] == "" ? null : FormElement["LeverageAlertGrossWeight"],
                    LeverageAlertVolumeWeight = FormElement["LeverageAlertVolumeWeight"] == "" ? null : FormElement["LeverageAlertVolumeWeight"],
                    LowerDeckPalletQty = FormElement["LowerDeckPalletQty"] == "" ? null : FormElement["LowerDeckPalletQty"],
                    UpperDeckPalletQty = FormElement["UpperDeckPalletQty"] == "" ? null : FormElement["UpperDeckPalletQty"],
                    LowerDeckContainerQty = FormElement["LowerDeckContainerQty"] == "" ? null : FormElement["LowerDeckContainerQty"],
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listAirCraftCapacity.Add(AirCraftCapacity);
                object datalist = (object)listAirCraftCapacity;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        private void UpdateAirCraftCapacity(string RecordID)
        {
            try
            {
                List<AirCraftCapacity> listAirCraftCapacity = new List<AirCraftCapacity>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AirCraftCapacity = new AirCraftCapacity
                {
                    SNo = Convert.ToInt32(RecordID),
                    AirlineSNo=Convert.ToInt32(FormElement["AirlineSNo"]),
                    AirCraftSNo = FormElement["AirCraftSNo"],
                    AirCraftInventorySNo = FormElement["AirCraftInventorySNo"],
                    OriginSNo = FormElement["OriginSNo"] == "" ? null : FormElement["OriginSNo"],
                    DestinationSNo = FormElement["DestinationSNo"] == "" ? null : FormElement["DestinationSNo"],
                    FlyingMinutesStart = FormElement["FlyingMinutesStart"] == "" ? null : FormElement["FlyingMinutesStart"],
                    FlyingMinuteEnd = FormElement["FlyingMinuteEnd"] == "" ? null : FormElement["FlyingMinuteEnd"],
                    VolumeWeight = FormElement["VolumeWeight"],
                    VolumeWeightType = FormElement["VolumeWeightType"],
                    GrossWeight = FormElement["GrossWeight"],
                    GrossWeightType = FormElement["GrossWeightType"],
                    MaxGrossWtPiece = FormElement["MaxGrossWtPiece"] == "" ? null : FormElement["MaxGrossWtPiece"],
                    ReportGrossWeight = FormElement["ReportGrossWeight"] == "" ? null : FormElement["ReportGrossWeight"],
                    AlertVolumeWeight = FormElement["AlertVolumeWeight"] == "" ? null : FormElement["AlertVolumeWeight"],
                    AlertGrossWeight = FormElement["AlertGrossWeight"] == "" ? null : FormElement["AlertGrossWeight"],
                    LeverageGrossWeight = FormElement["LeverageGrossWeight"] == "" ? null : FormElement["LeverageGrossWeight"],
                    LeverageVolumeWeight = FormElement["LeverageVolumeWeight"] == "" ? null : FormElement["LeverageVolumeWeight"],
                    LeverageAlertGrossWeight = FormElement["LeverageAlertGrossWeight"] == "" ? null : FormElement["LeverageAlertGrossWeight"],
                    LeverageAlertVolumeWeight = FormElement["LeverageAlertVolumeWeight"] == "" ? null : FormElement["LeverageAlertVolumeWeight"],
                    LowerDeckPalletQty = FormElement["LowerDeckPalletQty"] == "" ? null : FormElement["LowerDeckPalletQty"],
                    UpperDeckPalletQty = FormElement["UpperDeckPalletQty"] == "" ? null : FormElement["UpperDeckPalletQty"],
                    LowerDeckContainerQty = FormElement["LowerDeckContainerQty"] == "" ? null : FormElement["LowerDeckContainerQty"],
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listAirCraftCapacity.Add(AirCraftCapacity);
                object datalist = (object)listAirCraftCapacity;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }

        private void DeleteAirCraftCapacity(string RecordID)
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

        private StringBuilder CreateAirCraftCapacityTab(StringBuilder container)
        {
            //<li id='liAirCraftCapacity' onclick='javascript:AirCraftCapacityGrid();'>AirCraft Capacity Information</li>
            //    <div id='divTab5'><table id='tblAirCraftCapacity'></table></div>
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAirCraftCapacity' class='k-state-active'>Aircraft Info (Regn Nbr)</li>
                <li id='liAirCraftDoor' onclick='javascript:AirCraftCapacityDoorTableGrid();'>Door Information</li>
                <li id='liAirCraftCapacityULD' onclick='javascript:AirCraftCapacityULDGrid();'>ULD Information</li>
                <li id='liAirCraftCapacitySPHC' onclick='javascript:AirCraftCapacitySPHCGrid();'>SHC Information</li>
                <li id='liAirCraftCapacityPassengerCapacity' onclick='javascript:AirCraftCapacityPassengerCapacity();'>Passenger Capacity</li>
            </ul>
            <div id='divTab1'> 
              <span id='spnAirCraftCapacityInformation'>");
            strBuilder.Append(container);
            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirCraftCapacitySNo' name='hdnAirCraftCapacitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAirCraftInventory'></table>");
            strBuilder.Append(@"</span> 
            </div><div id='divTab2'><table id='tblAirCraftCapacityDoor'></table></div><div id='divTab3'><table id='tblAirCraftCapacityULD'></table></div><div id='divTab4'><table id='tblAirCraftCapacitySPHC'></table></div><div id='divTab5'><div id='divAirCraftCapacityPassengerCapacity'></div><table id='tblAirCraftCapacityPassengerCapacity'></table></div></div>");
            return strBuilder;

        }
    }
}
