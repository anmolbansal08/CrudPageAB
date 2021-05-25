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
    #region Airport Class Description
    /*
	*****************************************************************************
	Class Name:		AirportManagementWebUI      
	Purpose:		This Class used to get details of Airport save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			
	Created On:		
    Updated By:     Tarun Kumar
	Updated On:	    13 May 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class AirportManagementWebUI: BaseWebUISecureObject
    {
        public object GetRecordAirport()
        {
            object Airport = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Airport AirportList = new Airport();
                    object obj = (object)AirportList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    Airport = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return Airport;
        }
        public AirportManagementWebUI()
        {
            try
            {
                //if (this.SetCurrentPageContext(PageContext))
                //{
                //    this.ErrorNumber = 0;
                //    this.ErrorMessage = "";
                //}
                //   this.MyPageName = "Default.aspx";
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "Airport";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public AirportManagementWebUI(Page PageContext)
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
                this.MyAppID = "Airport";
            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
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
                    htmlFormAdapter.HeadingColumnName = "AirportName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordAirport();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                          //  container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(ReadAirportCutOffTimePage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordAirport();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateAirportCutOffTimePage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordAirport();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateAirportCutOffTimePage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           // container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateAirportCutOffTimePage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordAirport();
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
        /// Generate Airline web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionAirline.xml
        /// </summary>
        /// <param name="container"></param>
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {


                // if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Airport";
                    g.FormCaptionText = "Airport";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AirportCode", Title = "Airport Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport Name", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= AirportName #\">#= AirportName #</span>" });
                    g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CountryCode", Title = "Country Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DayLightSaving", Title = "Day Light Saving", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_IsDefaultAirport", Title = "Default Airport", DataType = GridDataType.String.ToString() });
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
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        /// 
        public StringBuilder ReadAirportCutOffTimePage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='AirportDiv'>
        <div id='ApplicationTabs'>
            <ul>
              <li  id='liAirport' class='k-state-active'>Airport</li>
                <li id='liAirportCutoffTime' onclick='javascript:AirportCutoffTimeGrid();'>Acceptance Cut-Off Time</li>
            </ul>
            <div id='divTab1' > 
              <span id='AirportInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
             <div id='divTab2'>
                <span id='spnAccountTarget'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAirportSNo' name='hdnAirportSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblAirportCutoffTime'></table></span></div></div></div>");
            return containerLocal;
        }

        public StringBuilder CreateAirportCutOffTimePage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='AirportDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAirport' class='k-state-active'>Airport</li>
                <li id='liAirportCutoffTime' onclick='javascript:AirportCutoffTimeGrid();'>Acceptance Cut-Off Time</li>
            </ul>
            <div id='divTab1' > 
              <span id='AirportInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
             <div id='divTab2'>
                <span id='spnAccountTarget'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirportSNo' name='hdnAirportSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden'  value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAirportCutoffTime'></table></span></div></div></div>");

            return containerLocal;
        }
        public override void DoPostBack()
        {
            //try
            //{

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveAirport();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveAirport();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateAirport(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteAirport(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            //}
        }
        private void SaveAirport()
        {
            try
            {
                List<Airport> listAirport = new List<Airport>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var airport = new Airport
                {
                    AirportCode = FormElement["AirportCode"].ToUpper(),
                    AirportName = FormElement["AirportName"].ToUpper(),//not null
                    // CitySNo = FormElement["CityCode"].ToUpper(),
                    CityCode = FormElement["Text_CityCode"].Split('-')[0].ToUpper(),
                    CityName = FormElement["Text_CityCode"].Split('-')[1].ToUpper(),
                    //CountrySNo = FormElement["CountryCode"].ToUpper(),//not null
                    CountryCode = FormElement["Text_CountryCode"].Split('-')[0].ToUpper(),//not null
                    CountryName = FormElement["Text_CountryCode"].Split('-')[1].ToUpper(),//not null
                    IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",//not null
                    IsActive = FormElement["IsActive"] == "0",//not null

                    //ProductSNo = FormElement["ProductSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ProductSNo"]),
                    //ProductName = FormElement["Text_ProductSNo"].ToUpper(),

                    //AirlineSNo = FormElement["AirlineSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirlineSNo"]),
                    //AirlineCode = FormElement["Text_AirlineSNo"].ToUpper(),
                    //AircraftSNo = FormElement["AircraftSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AircraftSNo"]),
                    //AircraftType = FormElement["Text_AircraftSNo"].ToUpper(),
                    //SPHCSNo = FormElement["SPHCSNo"],
                    //SPHCode = FormElement["Text_SPHCSNo"].ToUpper(),
                    //IsBaseSetting = FormElement["IsBaseSetting"] == "0",
                    //AcceptanceCutoffType = Convert.ToInt32(FormElement["AcceptanceCutoffType"]),
                    //ConnectionTime = Int32.Parse(FormElement["ConnectionTime"]),
                    //IsAcceptanceActive = FormElement["IsAcceptanceActive"] == "0",
                    IsEmailAlertonoffloadedCargo = FormElement["IsEmailAlertonoffloadedCargo"] == "0" ? true : false,//Added By Pankaj Kumar Ishwar on 28/03/2018
                    EmailAlertTime = Convert.ToString(FormElement["EmailAlertTime"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsDefaultAirport = FormElement["IsDefaultAirport"] == "0" ? true : false,
                    IsDoChargeApplicable = FormElement["IsDoChargeApplicable"] == "0" ? true : false
                };
                listAirport.Add(airport);
                object datalist = (object)listAirport;
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
        /// Update Airline record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateAirport(string RecordID)
        {
            try
            {
                List<Airport> listAirport = new List<Airport>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var airport = new Airport
                {
                    SNo = Convert.ToInt32(RecordID),
                    AirportCode = FormElement["AirportCode"].ToUpper(),
                    AirportName = FormElement["AirportName"].ToUpper(),//not null
                    //CitySNo = FormElement["CitySNo"].ToUpper(),
                    CityCode = FormElement["Text_CityCode"].Split('-')[0].ToUpper(),
                    CityName = FormElement["Text_CityCode"].Split('-')[1].ToUpper(),
                    //CountrySNo = FormElement["CountrySNo"].ToUpper(),//not null
                    CountryCode = FormElement["Text_CountryCode"].Split('-')[0].ToUpper(),//not null
                    CountryName = FormElement["Text_CountryCode"].Split('-')[1].ToUpper(),//not null
                    IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",//not null
                    IsActive = FormElement["IsActive"] == "0",//not null
                    //SPHCSNo = FormElement["SPHCSNo"],
                    //SPHCode = FormElement["Text_SPHCSNo"].ToUpper(),
                    //ProductSNo = FormElement["ProductSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ProductSNo"]),
                    //ProductName = FormElement["Text_ProductSNo"].ToUpper(),

                    //AirlineSNo = FormElement["AirlineSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirlineSNo"]),
                    //AirlineCode = FormElement["Text_AirlineSNo"].ToUpper(),
                    //AircraftSNo = FormElement["AircraftSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AircraftSNo"]),
                    //AircraftType = FormElement["Text_AircraftSNo"].ToUpper(),
                    //SPHCSNo = FormElement["SPHCSNo"],
                    //SPHCode = FormElement["Text_SPHCSNo"].ToUpper(),
                    //IsBaseSetting = FormElement["IsBaseSetting"] == "0",
                    //AcceptanceCutoffType = Convert.ToInt32(FormElement["AcceptanceCutoffType"]),
                    //ConnectionTime = Int32.Parse(FormElement["ConnectionTime"]),
                    //IsAcceptanceActive = FormElement["IsAcceptanceActive"] == "0",
                    IsEmailAlertonoffloadedCargo = FormElement["IsEmailAlertonoffloadedCargo"] == "0" ? true : false,//Added By Pankaj Kumar Ishwar on 28/03/2018
                    EmailAlertTime = Convert.ToString(FormElement["EmailAlertTime"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsDefaultAirport = FormElement["IsDefaultAirport"] == "0" ? true : false,
                    IsDoChargeApplicable = FormElement["IsDoChargeApplicable"] == "0" ? true : false
                };
                listAirport.Add(airport);
                object datalist = (object)listAirport;
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
        /// Delete Airline record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteAirport(string RecordID)
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
