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
using CargoFlash.Cargo.Model.Shipment;
using System.Collections;

namespace CargoFlash.Cargo.WebUI.Shipment
{
    public class SLInfoManagementWebUI : BaseWebUISecureObject
    {
        public SLInfoManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Shipment";
                this.MyAppID = "SLInfo";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public SLInfoManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Shipment";
                this.MyAppID = "SLInfo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        
        public object GetRecordSLInfo()
        {
            object city = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        SLInfo SLInfoList = new SLInfo();
                        object obj = (object)SLInfoList;

                        city = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                        this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                    }
                    else
                    {
                        //Error Messgae: Record not found.
                    }
                }

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return city;
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
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordSLInfo();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordSLInfo();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordSLInfo();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateSLITab(container1: htmlFormAdapter.InstantiateIn(), container2: htmlFormAdapter.InstantiateIn(TargetAppID: "SLIDimension")));
                           
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRecordSLInfo();
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
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return container;
        }
        private StringBuilder CreateSLITab(StringBuilder container1, StringBuilder container2)
        {
            //<li id='liAirCraftCapacity' onclick='javascript:AirCraftCapacityGrid();'>AirCraft Capacity Information</li>
            //    <div id='divTab5'><table id='tblAirCraftCapacity'></table></div>
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liSLIAWB' onclick='javascript:SLIAWBData();' class='k-state-active'>AWB Information</li>
                <li id='liSLIDim' onclick='javascript:SLIDimData();'>Dimension Information</li>
                <li id='liSLICharges' onclick='javascript:SLIChargesData();'>Charges Information</li>
            </ul>
            <div id='divTab1'> 
              <span id='spnSLIInformation'>");
            strBuilder.Append(container1);
            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnSLISNo' name='hdnSLISNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblSLIAWBInfromation'></table>");
            strBuilder.Append(@"</span> 
            </div>
            <div id='divTab2' >
            <span id='spnSLIDim'>");
            strBuilder.Append(container2);
            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnSLISNo' name='hdnSLISNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblDimInformation'></table></span></div><div id='divTab3'><table id='tblSLIChargesInformation'></table></div></div>");
            return strBuilder;

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
        
        private StringBuilder CreateGrid(StringBuilder Container)
        {

            try
            {
                using (Grid g = new Grid())
                {

                    g.CommandButtonNewText = "New Shippers Letter of Instruction";
                    g.FormCaptionText = "Shippers Letter of Instruction";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                   
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No",DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CountryCode", Title = "Country Code", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "ZoneName", Title = "Zone Name", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "TimeDifference", Title = "Time Difference", DataType = GridDataType.Number.ToString() });
                    //g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });

                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return Container;
        }
        ///// <summary>
        ///// Postback Method to GET or POST 
        ///// to set Mode/Context of the page
        ///// </summary>
        //public override void DoPostBack()
        //{
        //    try
        //    {
        //        this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
        //        switch (OperationMode)
        //        {
        //            case DisplayModeSave:
        //                SaveCity();
        //                if (string.IsNullOrEmpty(ErrorMessage))
        //                    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
        //                break;
        //            case DisplayModeUpdate:
        //                UpdateCity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
        //                if (string.IsNullOrEmpty(ErrorMessage))
        //                    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
        //                break;
        //            case DisplayModeSaveAndNew:
        //                SaveCity();
        //                if (string.IsNullOrEmpty(ErrorMessage))
        //                    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
        //                break;

        //            case DisplayModeDelete:
        //                DeleteCity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
        //                if (string.IsNullOrEmpty(ErrorMessage))
        //                    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
        //                break;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;

        //    }
        //}
        ///// <summary>
        ///// Save City record into the database 
        ///// call webservice to save that data into the database
        ///// </summary>
        //private void SaveCity()
        //{
        //    try
        //    {
        //        List<City> listCity = new List<City>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        var city = new City
        //        {
        //            ZoneSNo = Convert.ToInt32(FormElement["ZoneSNo"]),
        //            ZoneName = FormElement["Text_ZoneSNo"],
        //            CityCode = FormElement["CityCode"],
        //            CityName = FormElement["CityName"],
        //            CountrySNo = Convert.ToInt32(FormElement["CountrySNo"]),
        //            CountryCode = FormElement["Text_CountrySNo"],
        //            CountryName = FormElement["Text_CountrySNo"],
        //            DaylightSaving = FormElement["DaylightSaving"],
        //            IATAArea=FormElement["IATAArea"],
        //            TimeDifference = Convert.ToInt32(FormElement["TimeDifference"]),
        //            TimeZoneSNo = Convert.ToInt32(FormElement["TimeZoneSNo"]),
        //            IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",
        //            IsActive = FormElement["IsActive"] == "0",//not null
        //            CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //        };
        //        listCity.Add(city);
        //        object datalist = (object)listCity;
        //        DataOperationService(DisplayModeSave, datalist, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //}
        ///// <summary>
        ///// Update City record into the database 
        ///// Retrieve information from webform and store the same into modal 
        ///// call webservice to update that data into the database
        ///// </summary>
        ///// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        //private void UpdateCity(string RecordID)
        //{
        //    try
        //    {
        //        List<City> listCity = new List<City>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        var city = new City
        //        {
        //            SNo = Convert.ToInt32(RecordID),
        //            ZoneSNo =Convert.ToInt32(FormElement["ZoneSNo"]),
        //            ZoneName = FormElement["Text_ZoneSNo"],
        //            CityCode = FormElement["CityCode"],
        //            CityName = FormElement["CityName"],
        //            CountrySNo = Convert.ToInt32(FormElement["CountrySNo"]),
        //            CountryCode = FormElement["Text_CountrySNo"],
        //            CountryName = FormElement["Text_CountrySNo"],
        //            DaylightSaving = FormElement["DaylightSaving"],
        //            IATAArea = FormElement["IATAArea"],
        //            TimeDifference = Convert.ToInt32(FormElement["TimeDifference"]),
        //            TimeZoneSNo = Convert.ToInt32(FormElement["TimeZoneSNo"]),
        //            IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",
        //            IsActive = FormElement["IsActive"] == "0",//not null
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //        };
        //        listCity.Add(city);
        //        object datalist = (object)listCity;
        //        DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }

        //}
        ///// <summary>
        ///// Delete City record from the database 
        ///// call webservice to update that data into the database
        ///// </summary>
        ///// <param name="RecordID"></param>
        //private void DeleteCity(string RecordID)
        //{
        //    try
        //    {
        //        List<string> listID = new List<string>();
        //        listID.Add(RecordID);
        //        listID.Add(MyUserID.ToString());
        //        object recordID = (object)listID;
        //        DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;

        //    }
        //}
    }
}
