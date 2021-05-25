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
using System.Web;

namespace CargoFlash.Cargo.WebUI.Master
{
    /// <summary>
    /// This is Vehicle Management Class, its Used for CRUD Application.
    /// Created By : Jasmine Kaur Sethi
    /// Created On : 29 APR 2013
    /// Approved By : Manish Kumar
    /// </summary>
    public class VehicleManagementWebUI : BaseWebUISecureObject
    {
        ///// <summary>
        ///// Default Constructor and Initialized Variables.
        ///// </summary>
        ///// <param name="PageContext"></param>
        public VehicleManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }

            this.MyUserID = int.Parse(System.Web.HttpContext.Current.Session["LoginSNo"].ToString().ToUpper());
            this.MyModuleID = "Master";
            this.MyAppID = "Vehicle";
            this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
        }

        public VehicleManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Vehicle";
                this.MyPrimaryID = "SNo";
                this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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
                    htmlFormAdapter.HeadingColumnName = "VehiclePlateNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetVehicleRecord();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetVehicleRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetVehicleRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetVehicleRecord();
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
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    //this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
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
                        case DisplayModeDuplicate:
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


        public override void DoPostBack()
        {
            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveVehicle();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveVehicle();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateVehicle(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                    break;
                case DisplayModeDelete:
                    DeleteVehicle(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        /// <summary>
        /// create Vehicle list
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="Container"></param>
        private void CreateGrid(StringBuilder Container)
        {
           // string CitySNo = System.Web.HttpContext.Current.Session["AccessibleCitySNo"].ToString();
            using (Grid g = new Grid())
            {
                g.Height = 400;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.ServiceModuleName = MyModuleID;
                g.UserID = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
                g.IsAllowedGrouping = true;
                g.CommandButtonNewText = "New Vehicle";
                g.FormCaptionText = "Vehicle";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString(), IsGroupable = false, FooterTemplate = "Total Vehicle : <b>#=count#</b>" });
                g.Column.Add(new GridColumn {Field ="VehicleType", Title = "Vehicle Type", DataType = GridDataType.String.ToString(), GroupHeaderTemplate = "Vehicle Type : #=value# (No. Of Vehicle : <b>#= count#</b>)"});
                g.Column.Add(new GridColumn {Field= "vehiclemake", Title = "Vehicle Brand", DataType = GridDataType.String.ToString(), GroupHeaderTemplate = "Vehicle Brand : #=value# (No. Of Vehicle : <b>#= count#</b>)" });
                g.Column.Add(new GridColumn {Field = "VehiclePlateNo", Title = "Vehicle Plate No.", DataType = GridDataType.String.ToString(),  });
                g.Column.Add(new GridColumn { Field ="Capacity", Title = "Capacity", DataType = GridDataType.String.ToString(), });
              //  g.Column.Add(new GridColumn {Field = "Owner", Title = "Owner", DataType = GridDataType.String.ToString(), GroupHeaderTemplate = "Owner : #=value# (No. Of Vehicle : <b>#= count#</b>)" });
                g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                g.Aggregate = new List<GridAggregate>();
                g.Aggregate.Add(new GridAggregate { Field = "vehiclemake", Aggregate = "count" });
                g.Aggregate.Add(new GridAggregate { Field = "Capacity", Aggregate = "count" });
                g.Aggregate.Add(new GridAggregate { Field = "VehicleType", Aggregate = "count" });
                g.Aggregate.Add(new GridAggregate { Field = "CityName", Aggregate = "count" });
                g.Aggregate.Add(new GridAggregate { Field = "VehiclePlateNo", Aggregate = "count" });
               // g.Aggregate.Add(new GridAggregate { Field = "Owner", Aggregate = "count" });
                g.Aggregate.Add(new GridAggregate { Field = "Active", Aggregate = "count" });
                g.ExtraParam = new List<GridExtraParam>();
                //g.ExtraParam.Add(new GridExtraParam { Field = "CitySNo", Value = CitySNo });
               // g.IsModelParam = true;
                g.InstantiateIn(Container);
            } 
                
                    
        }
        /// <summary>
        /// Save Vehicle
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        private void SaveVehicle()
        {
            DateTime? d = null;
            List<VehicleRecords> listVehicle = new List<VehicleRecords>();
            //  var FormElement = System.Web.HttpContext.Current.Request.Form;
            var Vehicle = new VehicleRecords
            {
                SNo = 0,               
                ISOwner = Convert.ToInt32(System.Web.HttpContext.Current.Request.Form["ISOwner"]),
              //  ISOwnerType = Convert.ToInt32(System.Web.HttpContext.Current.Request.Form["ISOwnerType"]),
                VehicleMakeSNo = System.Web.HttpContext.Current.Request.Form["VehicleMakeSNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["VehicleMakeSNo"],
                Text_VehicleTypeSNo = System.Web.HttpContext.Current.Request.Form["Text_VehicleTypeSNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["Text_VehicleTypeSNo"],
                Text_VehicleMakeSNo = System.Web.HttpContext.Current.Request.Form["Text_VehicleMakeSNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["Text_VehicleMakeSNo"],
                VehiclePlateNo = System.Web.HttpContext.Current.Request.Form["VehiclePlateNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["VehiclePlateNo"].ToUpper(),
                Capacity = Convert.ToInt64(System.Web.HttpContext.Current.Request.Form["Capacity"] == "" ? 0 : Convert.ToInt64(System.Web.HttpContext.Current.Request.Form["Capacity"])),
                VehicleTypeSNo = System.Web.HttpContext.Current.Request.Form["VehicleTypeSNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["VehicleTypeSNo"],
                IsActive = System.Web.HttpContext.Current.Request.Form["IsActive"] == "0",
                CitySNo = System.Web.HttpContext.Current.Request.Form["CitySNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["CitySNo"],
                Text_CitySNo = System.Web.HttpContext.Current.Request.Form["Text_CitySNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["Text_CitySNo"],
               // CityName = System.Web.HttpContext.Current.Request.Form["Text_CitySNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["Text_CitySNo"].Split('-')[1],
                CityCode = System.Web.HttpContext.Current.Request.Form["Text_CitySNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["Text_CitySNo"].Split('-')[0],
                ExpiryDate = (!string.IsNullOrEmpty((System.Web.HttpContext.Current.Request.Form["ExpiryDate"])) ? (Convert.ToDateTime(System.Web.HttpContext.Current.Request.Form["ExpiryDate"]) != Convert.ToDateTime(null) ? Convert.ToDateTime(System.Web.HttpContext.Current.Request.Form["ExpiryDate"]) : d) : d),
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                CreatedUser="",
                UpdatedUser="",
            };
            listVehicle.Add(Vehicle);
            object datalist = (object)listVehicle;
            DataOperationService(DisplayModeSave, datalist, MyModuleID);
        }
        /// <summary>
        /// Update Vehicle as per given sno
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="RecordID"></param>
        private void UpdateVehicle(int RecordID)
        {
            DateTime? d = null;
            List<VehicleRecordstrans> listVehicle = new List<VehicleRecordstrans>();
            var Vehicle = new VehicleRecordstrans
            {
                SNo = Convert.ToInt32(RecordID),
                ISOwner = Convert.ToInt32(System.Web.HttpContext.Current.Request.Form["ISOwner"]),
                Capacity = Convert.ToInt64(System.Web.HttpContext.Current.Request.Form["Capacity"] == "" ? 0 : Convert.ToInt64(System.Web.HttpContext.Current.Request.Form["Capacity"])),
                CitySNo = System.Web.HttpContext.Current.Request.Form["CitySNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["CitySNo"],
                Text_CitySNo = System.Web.HttpContext.Current.Request.Form["Text_CitySNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["Text_CitySNo"],               
                CityCode = System.Web.HttpContext.Current.Request.Form["Text_CitySNo"] == string.Empty ? "" : System.Web.HttpContext.Current.Request.Form["Text_CitySNo"].Split('-')[0],
                IsActive = System.Web.HttpContext.Current.Request.Form["IsActive"] == "0",
                ExpiryDate = (!string.IsNullOrEmpty((System.Web.HttpContext.Current.Request.Form["ExpiryDate"])) ? (Convert.ToDateTime(System.Web.HttpContext.Current.Request.Form["ExpiryDate"]) != Convert.ToDateTime(null) ? Convert.ToDateTime(System.Web.HttpContext.Current.Request.Form["ExpiryDate"]) : d) : d),
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedUser = "",

            };
            listVehicle.Add(Vehicle);
            object datalist = (object)listVehicle;
            DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        }
        /// <summary>
        /// Delete Vehicle as per given recordid
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteVehicle(int RecordID)
        {
            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);

        }
        /// <summary>
        /// Get Vehicle Record 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        private object GetVehicleRecord()
        {
            object ba = null;

            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
            {
                Vehicle VehicleList = new Vehicle();
                object obj = (object)VehicleList;

                ba = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return ba;
        }
    }
}