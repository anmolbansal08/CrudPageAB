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
    #region AirCraft Class Description
    /*
	*****************************************************************************
	Class Name:		AirCraftManagementWebUI      
	Purpose:		This Class used to get details of AirCraft save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		17 Apr 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class AirCraftManagementWebUI : BaseWebUISecureObject
    {
        public StringBuilder CreateWebForm(StringBuilder container)
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

        public object GetRecordAirCraft()
        {
            object AirCraft = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AirCraft AirCraftList = new AirCraft();
                    object obj = (object)AirCraftList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    AirCraft = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return AirCraft;
        }

        public AirCraftManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "AirCraft";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public AirCraftManagementWebUI(Page PageContext)
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
                this.MyAppID = "AirCraft";
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

                    StringBuilder strf = new StringBuilder();
                    htmlFormAdapter.Ischildform = true;
                    //Updated by Akash for Audit Log on 6 Nov 2017
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "AircraftType";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordAirCraft();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(ViewAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            strf.Append("<input id='hdnAircraftSNo' name='hdnAircraftSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                            strf.Append("<table id='tblAirCraftInventory'></table>");

                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(ViewAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            //Updated by Akash for Audit Log on 6 Nov 2017

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordAirCraft();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(CreateAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            strf.Append("<table id='tblAirCraftInventory'></table>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(CreateAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            //Updated by Akash for Audit Log on 6 Nov 2017
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordAirCraft();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(CreateAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            strf.Append("<input id='hdnAircraftSNo' name='hdnAircraftSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                            strf.Append("<table id='tblAirCraftInventory'></table>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(CreateAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            //Updated by Akash for Audit Log on 6 Nov 2017
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(CreateAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            strf.Append("<table id='tblAirCraftInventory'></table>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(CreateAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            //Updated by Akash for Audit Log on 6 Nov 2017
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordAirCraft();
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
                    g.CommandButtonNewText = "New Aircraft";
                    g.FormCaptionText = "Aircraft";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AircraftType", Title = "Aircraft Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "strCargoClassification", Title = "Cargo Classification", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
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

        public override void DoPostBack()
        {
            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveAirCraft();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveAirCraft();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateAirCraft(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteAirCraft
                        (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        private void SaveAirCraft()
        {
            try
            {
                List<AirCraft> listAirCraft = new List<AirCraft>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AirCraft = new AirCraft
                {
                    AircraftType = FormElement["AircraftType"],
                    ABBRCodeSNo = FormElement["ABBRCodeSNo"],
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    VolumeWeight = Convert.ToDecimal(FormElement["VolumeWeight"].ToString() == "" ? "0" : FormElement["VolumeWeight"].ToString()),
                    VolumeWeightType = Convert.ToInt32(FormElement["VolumeWeightType"]),
                    StructuralCapacity = FormElement["StructuralCapacity"] == "" ? 0 : Convert.ToInt32(FormElement["StructuralCapacity"]),
                    GrossWeight = Convert.ToDecimal(FormElement["GrossWeight"].ToString() == "" ? "0" : FormElement["GrossWeight"].ToString()),
                    GrossWeightType = Convert.ToInt32(FormElement["GrossWeightType"]),
                    MaxGrossWtPiece = Convert.ToDecimal(FormElement["MaxGrossWtPiece"].ToString() == "" ? "0" : FormElement["MaxGrossWtPiece"].ToString()),
                    MaxVolumePiece = Convert.ToDecimal(FormElement["MaxVolumePiece"].ToString() == "" ? "0" : FormElement["MaxVolumePiece"].ToString()),
                    BodyType = FormElement["BodyType"] == "1",
                    CargoClassification = Convert.ToInt32(FormElement["CargoClassification"]),
                    AircraftVersion = FormElement["AircraftVersion"].ToString() == "" ? null : FormElement["AircraftVersion"],
                    LowerDeckPalletQty = FormElement["LowerDeckPalletQty"] == "" ? null : FormElement["LowerDeckPalletQty"],
                    UpperDeckPalletQty = FormElement["UpperDeckPalletQty"] == "" ? null : FormElement["UpperDeckPalletQty"],
                    LowerDeckContainerQty = FormElement["LowerDeckContainerQty"] == "" ? null : FormElement["LowerDeckContainerQty"],
                    Position = FormElement["Position"] == "" ? null : FormElement["Position"],
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listAirCraft.Add(AirCraft);
                object datalist = (object)listAirCraft;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        private void UpdateAirCraft(string RecordID)
        {
            try
            {
                List<AirCraft> listAirCraft = new List<AirCraft>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AirCraft = new AirCraft
                {
                    SNo = Convert.ToInt32(RecordID),
                    AircraftType = FormElement["AircraftType"],
                    ABBRCodeSNo = FormElement["ABBRCodeSNo"],
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    VolumeWeight = Convert.ToDecimal(FormElement["VolumeWeight"].ToString() == "" ? "0" : FormElement["VolumeWeight"].ToString()),
                    StructuralCapacity = FormElement["StructuralCapacity"] == "" ? 0 : Convert.ToInt32(FormElement["StructuralCapacity"]),
                    VolumeWeightType = Convert.ToInt32(FormElement["VolumeWeightType"]),
                    GrossWeight = Convert.ToDecimal(FormElement["GrossWeight"].ToString() == "" ? "0" : FormElement["GrossWeight"].ToString()),
                    GrossWeightType = Convert.ToInt32(FormElement["GrossWeightType"]),
                    MaxGrossWtPiece = Convert.ToDecimal(FormElement["MaxGrossWtPiece"].ToString() == "" ? "0" : FormElement["MaxGrossWtPiece"].ToString()),
                    MaxVolumePiece = Convert.ToDecimal(FormElement["MaxVolumePiece"].ToString() == "" ? "0" : FormElement["MaxVolumePiece"].ToString()),
                    BodyType = FormElement["BodyType"] == "1",
                    CargoClassification = Convert.ToInt32(FormElement["CargoClassification"]),
                    AircraftVersion = FormElement["AircraftVersion"].ToString() == "" ? null : FormElement["AircraftVersion"],
                    LowerDeckPalletQty = FormElement["LowerDeckPalletQty"] == "" ? null : FormElement["LowerDeckPalletQty"],
                    UpperDeckPalletQty = FormElement["UpperDeckPalletQty"] == "" ? null : FormElement["UpperDeckPalletQty"],
                    LowerDeckContainerQty = FormElement["LowerDeckContainerQty"] == "" ? null : FormElement["LowerDeckContainerQty"],
                    Position = FormElement["Position"] == "" ? null : FormElement["Position"],
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listAirCraft.Add(AirCraft);
                object datalist = (object)listAirCraft;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }

        private void DeleteAirCraft(string RecordID)
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

        private StringBuilder CreateAirCraftTab(StringBuilder container)
        {
            //<li id='liAirCraftCapacity' onclick='javascript:AirCraftCapacityGrid();'>AirCraft Capacity Information</li>
            //    <div id='divTab5'><table id='tblAirCraftCapacity'></table></div>
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAirCraft' onclick='javascript:AirCraftInventoryGrid();' class='k-state-active'>Aircraft Information</li>
                <li id='liAirCraftInventoryPaxFactor' onclick='javascript:AirCraftInventoryPaxFactorGrid();'>Pax Factor Information</li>
                <li id='liAirCraftDoor' onclick='javascript:AirCraftDoorTableGrid();'>Door Information</li>
                <li id='liAirCraftULD' onclick='javascript:AirCraftULDGrid();'>ULD Information</li>
                <li id='liAirCraftSPHC' onclick='javascript:AirCraftSPHCGrid();'>SHC Information</li>
                <li id='liAirCraftPassengerCapacity' onclick='javascript:AirCraftPassengerCapacity();'>Passenger Capacity</li>
                <li id='liAirCraftDimensionMatrix' onclick='javascript:AircraftFWD_AFT();'>Air Craft Dimension</li>
                 <li id='liAircraftSectorWiseCapacity' onclick='javascript:AircraftSectorWiseCapacity();'>Aircraft Sector Wise Capacity</li>
            </ul>
            <div id='divTab1'> 
              <span id='spnAirCraftInformation'>");
            strBuilder.Append(container);
            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/>");
            strBuilder.Append(@"</span> 
            </div>
            <div id='divTab2' >
            <span id='spnAirCraftInventoryPaxFactor'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAirCraftInventoryPaxFactor'></table></span></div><div id='divTab3'><table id='tblAirCraftDoor'></table></div><div id='divTab4'><table id='tblAirCraftULD'></table></div><div id='divTab5'><table id='tblAirCraftSPHC'></table></div><div id='divTab6'><div id='divAirCraftPassengerCapacity'></div><table id='tblAirCraftPassengerCapacity'></table></div><div id='divTab7'><div id='divAircraftDimensionMatrix'></div><table id='tblAircraftDimensionMatrix'></table></div><div id='divTab8'><div id='divAircraftSectorWiseCapacity'></div><table id='tblAircraftSectorWiseCapacity'></table></div>");
            return strBuilder;

        }

        private StringBuilder ViewAirCraftTab(StringBuilder container)
        {
            //<li id='liAirCraftCapacity' onclick='javascript:AirCraftCapacityGrid();'>AirCraft Capacity Information</li>
            //    <div id='divTab5'><table id='tblAirCraftCapacity'></table></div>
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAirCraft' onclick='javascript:AirCraftInventoryGrid();' class='k-state-active'>Aircraft Information</li>
                <li id='liAirCraftInventoryPaxFactor' onclick='javascript:AirCraftInventoryPaxFactorGrid();'>Pax Factor Information</li>
                <li id='liAirCraftDoor' onclick='javascript:AirCraftDoorTableGrid();'>Door Information</li>
                <li id='liAirCraftULD' onclick='javascript:AirCraftULDGrid();'>ULD Information</li>
                <li id='liAirCraftSPHC' onclick='javascript:AirCraftSPHCGrid();'>SHC Information</li>
                <li id='liAirCraftDimensionMatrix' onclick='javascript:AircraftFWD_AFT();'>AirCraftDimension</li>
                <li id='liAirCraftPassengerCapacity' onclick='javascript:AirCraftPassengerCapacity();'>Passenger Capacity</li>
              <li id='liAircraftSectorWiseCapacity' onclick='javascript:AircraftSectorWiseCapacity();'>Aircraft Sector Wise Capacity</li>
            </ul>
            <div id='divTab1'> 
              <span id='spnAirCraftInformation'>");
            strBuilder.Append(container);
            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><table id='tblAirCraftInventory'></table>");
            strBuilder.Append(@"</span> 
            </div>
            <div id='divTab2' >
            <span id='spnAirCraftInventoryPaxFactor'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><table id='tblAirCraftInventoryPaxFactor'></table></span></div><div id='divTab3'><table id='tblAirCraftDoor'></table></div><div id='divTab4'><table id='tblAirCraftULD'></table></div><div id='divTab5'><table id='tblAirCraftSPHC'></table></div><div id='divTab6'><div id='divAirCraftPassengerCapacity'></div><table id='tblAirCraftPassengerCapacity'></table></div><div id='divTab7'><div id='divAircraftDimensionMatrix'></div><table id='tblAircraftDimensionMatrix'></table></div><div id='divTab8'><table id='tblAircraftSectorWiseCapacity'></table></div>");
            return strBuilder;

        }
    }
}
