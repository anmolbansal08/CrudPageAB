using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
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
using System.Web.Script.Serialization;
//using MailDLL;
//using System.Web.Services;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Master
{
    #region AirCraftDimensionMatrix Class Description
    /*
	*****************************************************************************
	Class Name:		AircraftDimensionMatrixManagementWebUI      
	Purpose:		This Class used to get details of AircraftDimensionMatrix save update and Read
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Laxmikanta Pradhan
	Created On:		03 Jan 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    public class AircraftDimensionMatrixManagementWebUI : BaseWebUISecureObject
    {
        public AircraftDimensionMatrixManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPrimaryID = "SNo";
                this.MyPageName = "Default.cshtml";
                this.MyModuleID = "Master";
                this.MyAppID = "AircraftDimensionMatrix";
            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

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

        public object GetRecordAircraftDimensionMatrix()
        {
            object AircraftMatrixRead = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AircraftMatrixRead AirCraftDimensionList = new AircraftMatrixRead();
                    object obj = (object)AirCraftDimensionList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    AircraftMatrixRead = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return AircraftMatrixRead;
        }

        public AircraftDimensionMatrixManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "AircraftDimensionMatrix";
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
                    htmlFormAdapter.HeadingColumnName = "";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            //htmlFormAdapter.objFormData = GetRecordAircraftDimensionMatrix();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(ViewAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            //container.Append(htmlFormAdapter.InstantiateIn(TargetAppID: "AircraftDimensionMatrix"));
                            container.Append("<input id='hdnAircraftSNo' name='hdnAircraftSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                            //container.Append("<input id='hdnuserID' name='hdnuserID' type='hidden' value='" + this.MyUserID + "'/>");
                            break;
                        case DisplayModeDuplicate:
                            //htmlFormAdapter.objFormData = GetRecordAircraftDimensionMatrix();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(CreateAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            //htmlFormAdapter.objFormData = GetRecordAircraftDimensionMatrix();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(CreateAirCraftTab(htmlFormAdapter.InstantiateIn()));
                            //container.Append(htmlFormAdapter.InstantiateIn(TargetAppID: "AircraftDimensionMatrix"));
                            container.Append("<input id='hdnAircraftSNo' name='hdnAircraftSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            //htmlFormAdapter.objFormData = GetRecordAircraftDimensionMatrix();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                           
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input id='hdnAircraftSNo' name='hdnAircraftSNo' type='hidden' value='" + this.MyRecordID + "'/>");
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
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.CommandButtonNewText = "New Aircraft Dimension Matrix";
                    g.FormCaptionText = "Aircraft Dimension Matrix";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);

                    g.Column = new List<GridColumn>();
                    //g.Column.Add(new GridColumn { Field = "SNo", Title = "AircraftSNO", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "Aircraft", Title = "Aircraft Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "HoldType", Title = "Hold Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Unit", Title = "Unit", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Rows", Title = "Rows", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Columns", Title = "Columns", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created User", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });

                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction { ButtonCaption = "Read", ActionName = "Read", AppsName = this.MyAppID, CssClassName = "icon-read", ModuleName = this.MyModuleID });
                    //g.Action.Add(new GridAction { ButtonCaption = "Planning", ActionName = "Edit", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });
                    g.Action.Add(new GridAction { ButtonCaption = "Edit", ActionName = "Edit", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });
                    g.Action.Add(new GridAction { ButtonCaption = "Delete", ActionName = "Delete", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });

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
                    //SaveAircraftDimensionMatrix();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    //SaveAircraftDimensionMatrix();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    //UpdateAirCraft(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteAircraftDimension
                        (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        //private void SaveAircraftDimensionMatrix()
        //{
        //    try
        //    {
        //        List<AircraftDimensionMatrix> listAircraftDimensionMatrix = new List<AircraftDimensionMatrix>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        var AircraftDimensionMatrix = new AircraftDimensionMatrix
        //        {
        //            AircraftSNo = Convert.ToInt32(FormElement["Aircraft"]),
        //            HoldType = Convert.ToInt32(FormElement["HoldType"]),
        //            Unit = Convert.ToString(FormElement["Unit"]),
        //            //Rows = Convert.ToInt32(FormElement["Rows"]),
        //            //Cols = Convert.ToInt32(FormElement["Cols"]),
        //            CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                 
        //        };
        //        listAircraftDimensionMatrix.Add(AircraftDimensionMatrix);

        //        List<AircraftMatrixTrans> listAircraftMatrixTrans = new List<AircraftMatrixTrans>();
        //        List<AircraftMatrixTransVal> listaircraftmatrixtransval = new List<AircraftMatrixTransVal>();
        //        int rwcount = Convert.ToInt32(FormElement["Rows"]);
        //        int colcount = Convert.ToInt32(FormElement["Cols"]);
        //        var aircraftmatrixtrans = new AircraftMatrixTrans
        //        {
        //            //Rows = Convert.ToInt32(FormElement["Rows"]),
        //            //Cols = Convert.ToInt32(FormElement["Cols"]),
                    
        //        };
        //        AircraftMatrixTransVal AircraftMatrixTransVal = new AircraftMatrixTransVal();
        //        for (int i = 1; i <= rwcount; i++)
        //        {
        //            for (int j = 1; j <= colcount; j++)
        //            {
        //                AircraftMatrixTransVal.ADRowNo = i;
        //                AircraftMatrixTransVal.ADColNo = j;
                        
        //            }
        //        }

        //        //var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        System.Data.DataTable dtCreate = new System.Data.DataTable();
        //        dtCreate.TableName = "MatrixVal";
        //        dtCreate.Columns.Add("ADRowNo", typeof(System.Int32));
        //        dtCreate.Columns.Add("ADColNo", typeof(System.Int32));
        //        dtCreate.Columns.Add("CellValue", typeof(System.Int32));
               
                    
        //        for (int p = 1; p <= rwcount; p++)
        //        {
        //             for (int q = 1; q <= colcount; q++)
        //             {
        //                DataRow dr = dtCreate.NewRow();
        //                dr["ADRowNo"] = Convert.ToInt32(FormElement["txt#ADRowNo"]);
        //                dr["ADColNo"] = Convert.ToInt32(FormElement["span#ADColNo"]);
        //                dr["CellValue"] = Convert.ToInt32(FormElement["input#txt" + p + q]);
        //                dtCreate.Rows.Add(dr);
        //             }
        //        }

        //        List<AircraftMatrixMasterTrans> listaircraftmastertrans = new List<AircraftMatrixMasterTrans>();
        //        var aircraftMatrixMasterTrans = new AircraftMatrixMasterTrans { aircraftDimensionMatrix = listAircraftDimensionMatrix, aircraftMatrixTransVal = listaircraftmatrixtransval };
        //        listaircraftmastertrans.Add(aircraftMatrixMasterTrans);

        //        //object datalist = (object)listAircraftDimensionMatrix;
        //        object datalist = (object)listaircraftmastertrans;
        //        DataOperationService(DisplayModeSave, datalist, MyModuleID);
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //}

        public String ConvertDataTableTojSonString(DataTable dataTable)
        {
            System.Web.Script.Serialization.JavaScriptSerializer serializer =
                   new System.Web.Script.Serialization.JavaScriptSerializer();

            List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();

            Dictionary<String, Object> row;

            foreach (DataRow dr in dataTable.Rows)
            {
                row = new Dictionary<String, Object>();
                foreach (DataColumn col in dataTable.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                tableRows.Add(row);
            }
            return serializer.Serialize(tableRows);
        }

        //public static string options()
        //{
        //    JavaScriptSerializer serializer = new JavaScriptSerializer();
            
        //    landmarkEntities A = new landmarkEntities();
        //    var b =


        //    List < Test1 > c = new List<Test1>();
        //    foreach (var s in b)
        //    {
        //        Test1 testobj = new Test1();
        //        testobj.name = s.Name;
        //        testobj.price = s.price;
        //        c.Add(testobj);

        //    }

        //    string jsonString = serializer.Serialize(c);
        //    return jsonString;

        //}

        private void UpdateAirCraft(string RecordID)
        {
            //try
            //{
            //    List<AirCraft> listAirCraft = new List<AirCraft>();
            //    var FormElement = System.Web.HttpContext.Current.Request.Form;
            //    var AirCraft = new AirCraft
            //    {
            //        SNo = Convert.ToInt32(RecordID),
            //        AircraftType = FormElement["AircraftType"],
            //        ABBRCodeSNo = FormElement["ABBRCodeSNo"],
            //        AirlineSNo=Convert.ToInt32(FormElement["AirlineSNo"]),
            //        VolumeWeight = Convert.ToDecimal(FormElement["VolumeWeight"].ToString() == "" ? "0" : FormElement["VolumeWeight"].ToString()),
            //        VolumeWeightType = Convert.ToInt32(FormElement["VolumeWeightType"]),
            //        GrossWeight = Convert.ToDecimal(FormElement["GrossWeight"].ToString() == "" ? "0" : FormElement["GrossWeight"].ToString()),
            //        GrossWeightType = Convert.ToInt32(FormElement["GrossWeightType"]),
            //        MaxGrossWtPiece = Convert.ToDecimal(FormElement["MaxGrossWtPiece"].ToString() == "" ? "0" : FormElement["MaxGrossWtPiece"].ToString()),
            //        BodyType = FormElement["BodyType"] == "1",
            //        CargoClassification = Convert.ToInt32(FormElement["CargoClassification"]),
            //        AircraftVersion = FormElement["AircraftVersion"].ToString() == "" ? null : FormElement["AircraftVersion"],
            //        LowerDeckPalletQty = FormElement["LowerDeckPalletQty"] == "" ? null : FormElement["LowerDeckPalletQty"],
            //        UpperDeckPalletQty = FormElement["UpperDeckPalletQty"] == "" ? null : FormElement["UpperDeckPalletQty"],
            //        LowerDeckContainerQty = FormElement["LowerDeckContainerQty"] == "" ? null : FormElement["LowerDeckContainerQty"],
            //        Position = FormElement["Position"] == "" ? null : FormElement["Position"],
            //        IsActive = FormElement["IsActive"] == "0",
            //        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
            //        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
            //    };
            //    listAirCraft.Add(AirCraft);
            //    object datalist = (object)listAirCraft;
            //    DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            //}

        }

        private void DeleteAircraftDimension(string RecordID)
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
              
            </ul>
            <div id='divTab1'> 
              <span id='spnAirCraftInformation'>");
            strBuilder.Append(container);
            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAirCraftInventory'></table>");
            strBuilder.Append(@"</span> 
            </div>
            <div id='divTab2' >
            <span id='spnAirCraftInventoryPaxFactor'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAirCraftInventoryPaxFactor'></table></span></div><div id='divTab3'><table id='tblAirCraftDoor'></table></div><div id='divTab4'><table id='tblAirCraftULD'></table></div><div id='divTab5'><table id='tblAirCraftSPHC'></table></div><div id='divTab6'><div id='divAirCraftPassengerCapacity'></div><table id='tblAirCraftPassengerCapacity'></table></div></div>");
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
                <li id='liAirCraftPassengerCapacity' onclick='javascript:AirCraftPassengerCapacity();'>Passenger Capacity</li>
              
            </ul>
            <div id='divTab1'> 
              <span id='spnAirCraftInformation'>");
            strBuilder.Append(container);
            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><table id='tblAirCraftInventory'></table>");
            strBuilder.Append(@"</span> 
            </div>
            <div id='divTab2' >
            <span id='spnAirCraftInventoryPaxFactor'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><table id='tblAirCraftInventoryPaxFactor'></table></span></div><div id='divTab3'><table id='tblAirCraftDoor'></table></div><div id='divTab4'><table id='tblAirCraftULD'></table></div><div id='divTab5'><table id='tblAirCraftSPHC'></table></div><div id='divTab6'><div id='divAirCraftPassengerCapacity'></div><table id='tblAirCraftPassengerCapacity'></table></div>");
            return strBuilder;

        }
    }
}
