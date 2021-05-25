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
    public class CityConnectionTimeManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Get Record from CityConnectionTime
        /// </summary>
        /// <returns></returns>
        public object GetRecordCityConnectionTime()
        {
            object CityConnectionTime = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CityConnectionTime CityConnectionTimeList = new CityConnectionTime();
                    object obj = (object)CityConnectionTimeList;
                    //retrieve Entity from database according to the record
                    CityConnectionTime = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);

                }
                else
                {
                    //ErrorMessage: Record not found.

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

            return CityConnectionTime;
        }
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        public CityConnectionTimeManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "CityConnectionTime";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationwebUI = new ApplicationWebUI();
                applicationwebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationwebUI.ErrorMessage;
            }

        }
        public CityConnectionTimeManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {

                    this.MyPrimaryID = "SNo";
                    this.MyPageName = "Default.aspx";
                    this.MyModuleID = "Master";
                    this.MyAppID = "CityConnectionTime";

                }


            }
            catch (Exception ex)
            {

                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }


        }
        /// <summary>
        ///  Generate CityConnectionTime web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionCityConnectionTime.xml
        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
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
        /// <returns></returns>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New City Connection Time";
                    g.FormCaptionText = "City Connection Time";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ConnectionTypeName", Title = "Connection Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ProductName", Title = "Product Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirlineCodeSNo", Title = "Airline Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirportCode", Title = "Airport Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AircraftType", Title = "Aircraft Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SPHCode", Title = "SHC", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Root", Title = "Route Setting", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ConnectionTime", Title = "Connection Time", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_BasedOn", Title = "Based On", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_IsInternational", Title = "International", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "userCreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "userUpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
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
                    htmlFormAdapter.HeadingColumnName = "RefNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordCityConnectionTime();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordCityConnectionTime();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordCityConnectionTime();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRecordCityConnectionTime();
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
                        SaveCityConnectionTime();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveCityConnectionTime();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateConnectionTime(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteConnectionTime(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        ///  Save SaveCityConnectionTime record into the database 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveCityConnectionTime()
        {
            try
            {
                List<CityConnectionTime> listCityConnectionTime = new List<CityConnectionTime>();
                List<CityConnectionTimeSlab> listCityConnectiontrans = new List<CityConnectionTimeSlab>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                //Code to Save Slab Details
                if (FormElement["tblAppendGrid1_rowOrder"] != null)
                {
                    string[] values = FormElement["tblAppendGrid1_rowOrder"].ToString().Split(',');

                    for (int count = 0; count < Convert.ToInt32(FormElement["tblAppendGrid1_rowOrder"].ToString().Split(',').Length); count++)
                    {
                        listCityConnectiontrans.Add(new CityConnectionTimeSlab()
                        {
                            SNo = 1,
                            CityConnectionTimeSNo = 1,
                            StartWeight = Convert.ToInt32(FormElement["tblAppendGrid1_StartWeight_" + values[count]]),
                            EndWeight = Convert.ToInt32(FormElement["tblAppendGrid1_EndWeight_" + values[count]]),

                            GrossWtVariancePlus = FormElement["tblAppendGrid1_GrossWtVariancePlus_" + values[count]] == "" ? (int?)null : Convert.ToInt32(FormElement["tblAppendGrid1_GrossWtVariancePlus_" + values[count]])
                            ,
                            VoluemeWeightPlus = FormElement["tblAppendGrid1_VoluemeWeightPlus_" + values[count]] == "" ? (int?)null : Convert.ToInt32(FormElement["tblAppendGrid1_VoluemeWeightPlus_" + values[count]]),
                            GrossWtVarianceminus = FormElement["tblAppendGrid1_GrossWtVarianceminus_" + values[count]] == "" ? (int?)null : Convert.ToInt32(FormElement["tblAppendGrid1_GrossWtVarianceminus_" + values[count]]),
                            VoluemeWeightminus = FormElement["tblAppendGrid1_VoluemeWeightminus_" + values[count]] == "" ? (int?)null : Convert.ToInt32(FormElement["tblAppendGrid1_VoluemeWeightminus_" + values[count]]),
                            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                        }
                        );
                    }
                }
                else
                {
                    listCityConnectiontrans.Add(new CityConnectionTimeSlab()
                    {
                        SNo = 0,
                        CityConnectionTimeSNo = 0,
                        StartWeight = 0,
                        EndWeight = 0,
                        GrossWtVariancePlus = 0,
                        VoluemeWeightPlus = 0,
                        GrossWtVarianceminus = 0,
                        VoluemeWeightminus = 0,
                        UpdatedBy = 0,
                    }
                                                );
                }
                int number = 0;
                string val = string.Empty;

                if (FormElement["Text_ConnectionTypeSNo"].ToString() == "ACCEPTANCE VARIANCE")
                {
                    var CityConnectionTime = new CityConnectionTime
                    {

                        AirportSNo = FormElement["AirportSNo"] == "" ? "" : (FormElement["AirportSNo"]).ToString(),
                        AirportCode = FormElement["AirportSNo"] == "" ? "" : FormElement["Text_AirportSNo"].ToUpper(),
                        AircraftSNo = FormElement["AircraftSNo"] == "" ? "" : (FormElement["AircraftSNo"]).ToString(),
                        AircraftType = FormElement["Text_AircraftSNo"].ToUpper(),
                        IsRoot = FormElement["IsRoot"] == "0",
                       // BasedOn = FormElement["BasedOn"] == "" ? 0 : Convert.ToInt32(FormElement["BasedOn"]),
                        IsInternational = Convert.ToBoolean(FormElement["IsInternational"] == "0" ? true : false),
                        ConnectionTypeSNo = Convert.ToInt32(FormElement["ConnectionTypeSNo"]),
                        ConnectionTypeName = FormElement["Text_ConnectionTypeSNo"].ToUpper(),
                        IsActive = FormElement["IsActive"] == "0",
                        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                      
                        AirlineSNo= FormElement["AirlineCodeSNo"],
                        CCTSlabs = listCityConnectiontrans
                    };
                    listCityConnectionTime.Add(CityConnectionTime);
                    object datalist = (object)listCityConnectionTime;
                    DataOperationService(DisplayModeSave, datalist, MyModuleID);
                    { }


                }
                else
                {
                    listCityConnectiontrans.Add(new CityConnectionTimeSlab()
                    {
                        SNo = 0,
                        CityConnectionTimeSNo = 0,
                        StartWeight = 0,
                        EndWeight = 0,
                        GrossWtVariancePlus = 0,
                        VoluemeWeightPlus = 0,
                        GrossWtVarianceminus = 0,
                        VoluemeWeightminus = 0,
                        UpdatedBy = 0,
                    });


                    var CityConnectionTime = new CityConnectionTime
                    {
                        ProductSNo = FormElement["ProductSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ProductSNo"]),
                        ProductName = FormElement["Text_ProductSNo"],
                        AirportSNo = FormElement["AirportSNo"] == "" ? "" : Convert.ToString(FormElement["AirportSNo"]),
                        AirportCode = FormElement["Text_AirportSNo"].ToUpper(),
                        AircraftSNo = FormElement["AircraftSNo"] == "" ? "" : Convert.ToString(FormElement["AircraftSNo"]),
                        AircraftType = FormElement["Text_AircraftSNo"].ToUpper(),
                        SPHCSNo = FormElement["SPHCSNo"] == "" ? "" : (FormElement["SPHCSNo"]).ToString(),
                        SPHCode = FormElement["Text_SPHCSNo"].ToUpper(),
                        IsRoot = FormElement["IsRoot"] == "0",
                        BasedOn = FormElement["BasedOn"] == "" ? 0 : Convert.ToInt32(FormElement["BasedOn"]),
                        IsInternational = Convert.ToBoolean(FormElement["IsInternational"] == "0" ? true : false),
                        ConnectionTypeSNo = Convert.ToInt32(FormElement["ConnectionTypeSNo"]),
                        ConnectionTypeName = FormElement["Text_ConnectionTypeSNo"].ToUpper(),
                        ConnectionTime = FormElement["Text_ConnectionTypeSNo"].ToUpper() == "AUTO CONFIRM" ? FormElement["Weight"].ToString() : ((string.IsNullOrEmpty(FormElement["ConnectionTimeHr"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeHr"])) * 60 + (string.IsNullOrEmpty(FormElement["ConnectionTimeMin"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeMin"]))).ToString(),
                        ConnectionTimeHr = FormElement["Text_ConnectionTypeSNo"].ToUpper() == "AUTO CONFIRM" ? 0 : string.IsNullOrEmpty(FormElement["ConnectionTimeHr"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeHr"]),
                        ConnectionTimeMin = FormElement["Text_ConnectionTypeSNo"].ToUpper() == "AUTO CONFIRM" ? 0 : string.IsNullOrEmpty(FormElement["ConnectionTimeMin"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeMin"]),
                       
                        IsActive = FormElement["IsActive"] == "0",
                        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        AirlineSNo = FormElement["AirlineCodeSNo"],
                        OtherAirlineAccess = FormElement["OtherAirlineAccess"] == "" ? "" : (FormElement["OtherAirlineAccess"]).ToString(),
                        CCTSlabs = listCityConnectiontrans,
                        AdjustableWeight = Convert.ToDecimal(FormElement["AdjustableWeight"] == "" ? "0" : (FormElement["AdjustableWeight"]).ToString()),
                        AgentSNo = FormElement["AgentSNo"] == "" ? "" : (FormElement["AgentSNo"]).ToString()
                    };
                    listCityConnectionTime.Add(CityConnectionTime);
                    object datalist = (object)listCityConnectionTime;   
                    DataOperationService(DisplayModeSave, datalist, MyModuleID);
                    { }
                }
              

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        /// <summary>
        /// Update Airline record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateConnectionTime(string RecordID)
        {
            try
            {
                List<CityConnectionTime> listCityConnectionTime = new List<CityConnectionTime>();
                List<CityConnectionTimeSlab> listCityConnectiontrans = new List<CityConnectionTimeSlab>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;


                int number = 0;
                string val = string.Empty;

                if (FormElement["Text_ConnectionTypeSNo"].ToString() == "ACCEPTANCE VARIANCE")
                {
                    //Code to Save Slab Details
                    if (FormElement["tblAppendGrid1_rowOrder"] != null)
                    {
                        string[] values = FormElement["tblAppendGrid1_rowOrder"].ToString().Split(',');

                        for (int count = 0; count < Convert.ToInt32(FormElement["tblAppendGrid1_rowOrder"].ToString().Split(',').Length); count++)
                        {
                            listCityConnectiontrans.Add(new CityConnectionTimeSlab()
                            {
                                SNo = 1,
                                CityConnectionTimeSNo = 1,
                                StartWeight = Convert.ToInt32(FormElement["tblAppendGrid1_StartWeight_" + values[count]]),
                                EndWeight = Convert.ToInt32(FormElement["tblAppendGrid1_EndWeight_" + values[count]]),

                                GrossWtVariancePlus = FormElement["tblAppendGrid1_GrossWtVariancePlus_" + values[count]] == "" ? (int?)null : Convert.ToInt32(FormElement["tblAppendGrid1_GrossWtVariancePlus_" + values[count]])
                            ,
                                VoluemeWeightPlus = FormElement["tblAppendGrid1_VoluemeWeightPlus_" + values[count]] == "" ? (int?)null : Convert.ToInt32(FormElement["tblAppendGrid1_VoluemeWeightPlus_" + values[count]]),
                                GrossWtVarianceminus = FormElement["tblAppendGrid1_GrossWtVarianceminus_" + values[count]] == "" ? (int?)null : Convert.ToInt32(FormElement["tblAppendGrid1_GrossWtVarianceminus_" + values[count]]),
                                VoluemeWeightminus = FormElement["tblAppendGrid1_VoluemeWeightminus_" + values[count]] == "" ? (int?)null : Convert.ToInt32(FormElement["tblAppendGrid1_VoluemeWeightminus_" + values[count]]),
                                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                            }
                            );
                        }
                    }
                    else
                    {
                        listCityConnectiontrans.Add(new CityConnectionTimeSlab()
                        {
                            SNo = 0,
                            CityConnectionTimeSNo = 0,
                            StartWeight = 0,
                            EndWeight = 0,
                            GrossWtVariancePlus = 0,
                            VoluemeWeightPlus = 0,
                            GrossWtVarianceminus = 0,
                            VoluemeWeightminus = 0,
                            UpdatedBy = 0,
                        }
                                                    );
                    }



                    var CityConnectionTime = new CityConnectionTime
                    {
                        SNo = Convert.ToInt32(RecordID),
                        AirportSNo = FormElement["AirportSNo"] == "" ? "" : (FormElement["AirportSNo"]).ToString(),
                        AirportCode = FormElement["AirportSNo"] == "" ? "" : FormElement["Text_AirportSNo"].ToUpper(),
                        AircraftSNo = FormElement["AircraftSNo"] == "" ? "" : (FormElement["AircraftSNo"]).ToString(),
                        AircraftType = FormElement["Text_AircraftSNo"].ToUpper(),
                        IsRoot = FormElement["IsRoot"] == "0",
                        // BasedOn = FormElement["BasedOn"] == "" ? 0 : Convert.ToInt32(FormElement["BasedOn"]),
                        IsInternational = Convert.ToBoolean(FormElement["IsInternational"] == "0" ? true : false),
                        ConnectionTypeSNo = Convert.ToInt32(FormElement["ConnectionTypeSNo"]),
                        ConnectionTypeName = FormElement["Text_ConnectionTypeSNo"].ToUpper(),
                        IsActive = FormElement["IsActive"] == "0",
                        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),

                        AirlineSNo = FormElement["AirlineCodeSNo"],
                        CCTSlabs = listCityConnectiontrans
                    };
                    listCityConnectionTime.Add(CityConnectionTime);
                    object datalist = (object)listCityConnectionTime;
                    DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                    { }

                  
                }
                else
                {
                    listCityConnectiontrans.Add(new CityConnectionTimeSlab()
                    {
                        SNo = 0,
                        CityConnectionTimeSNo = 0,
                        StartWeight = 0,
                        EndWeight = 0,
                        GrossWtVariancePlus = 0,
                        VoluemeWeightPlus = 0,
                        GrossWtVarianceminus = 0,
                        VoluemeWeightminus = 0,
                        UpdatedBy = 0,
                    });


                    var CityConnectionTime = new CityConnectionTime
                    {
                        SNo = Convert.ToInt32(RecordID),
                        ProductSNo = FormElement["ProductSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ProductSNo"]),
                        ProductName = FormElement["Text_ProductSNo"],
                        AirportSNo = FormElement["AirportSNo"] == "" ? "" : Convert.ToString(FormElement["AirportSNo"]),
                        AirportCode = FormElement["Text_AirportSNo"].ToUpper(),
                        AircraftSNo = FormElement["AircraftSNo"] == "" ? "" : Convert.ToString(FormElement["AircraftSNo"]),
                        AircraftType = FormElement["Text_AircraftSNo"].ToUpper(),
                        SPHCSNo = FormElement["SPHCSNo"] == "" ? "" : (FormElement["SPHCSNo"]).ToString(),
                        SPHCode = FormElement["Text_SPHCSNo"].ToUpper(),
                        IsRoot = FormElement["IsRoot"] == "0",
                        BasedOn = FormElement["BasedOn"] == "" ? 0 : Convert.ToInt32(FormElement["BasedOn"]),
                        IsInternational = Convert.ToBoolean(FormElement["IsInternational"] == "0" ? true : false),
                        ConnectionTypeSNo = Convert.ToInt32(FormElement["ConnectionTypeSNo"]),
                        ConnectionTypeName = FormElement["Text_ConnectionTypeSNo"].ToUpper(),
                        ConnectionTime = FormElement["Text_ConnectionTypeSNo"].ToUpper() == "AUTO CONFIRM" ? FormElement["Weight"].ToString() : ((string.IsNullOrEmpty(FormElement["ConnectionTimeHr"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeHr"])) * 60 + (string.IsNullOrEmpty(FormElement["ConnectionTimeMin"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeMin"]))).ToString(),
                        ConnectionTimeHr = FormElement["Text_ConnectionTypeSNo"].ToUpper() == "AUTO CONFIRM" ? 0 : string.IsNullOrEmpty(FormElement["ConnectionTimeHr"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeHr"]),
                        ConnectionTimeMin = FormElement["Text_ConnectionTypeSNo"].ToUpper() == "AUTO CONFIRM" ? 0 : string.IsNullOrEmpty(FormElement["ConnectionTimeMin"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeMin"]),

                        IsActive = FormElement["IsActive"] == "0",
                        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        AirlineSNo = FormElement["AirlineCodeSNo"],
                        OtherAirlineAccess = FormElement["OtherAirlineAccess"] == "" ? "" : (FormElement["OtherAirlineAccess"]).ToString(),
                        CCTSlabs = listCityConnectiontrans,
                        AdjustableWeight = Convert.ToDecimal(FormElement["AdjustableWeight"] == "0" ? null : (FormElement["AdjustableWeight"]).ToString()),
                        AgentSNo= FormElement["AgentSNo"] == "" ? null : (FormElement["AgentSNo"]).ToString()
                    };
                    listCityConnectionTime.Add(CityConnectionTime);
                    object datalist = (object)listCityConnectionTime;
                    DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                    { }
                }


            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }


        }
        /// <summary>
        /// Delete Airline record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteConnectionTime(string RecordID)
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
