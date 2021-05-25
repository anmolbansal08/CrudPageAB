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
    /// This is Vehicle Type Management Class, its Used for CRUD Application.
    /// Created By : 
    /// Created On : 
    /// Approved By :
    /// </summary>
    public class VehicleMakeManagementWebUI : BaseWebUISecureObject
    {
        ///// <summary>
        ///// Default Constructor and Initialized Variables.
        ///// </summary>
        ///// <param name="PageContext"></param>
        public VehicleMakeManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }

            this.MyUserID = int.Parse(System.Web.HttpContext.Current.Session["LoginSNo"].ToString().ToUpper());
            this.MyModuleID = "Master";
            this.MyAppID = "VehicleMake";
            this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
        }


        public VehicleMakeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "VehicleMake";
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
                    htmlFormAdapter.HeadingColumnName = "vehiclemake";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetVehicleMakeRecord();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetVehicleMakeRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetVehicleMakeRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetVehicleMakeRecord();
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
                    SaveVehicleMake();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveVehicleMake();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateVehicleMake(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                    break;
                case DisplayModeDelete:
                    DeleteVehicleMake(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        /// <summary>
        /// create VehicleType list
        /// Created By :
        /// Created On :
        /// </summary>
        /// <param name="Container"></param>
        private void CreateGrid(StringBuilder Container)
        {
            using (Grid g = new Grid())
            {
                g.Height = 400;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.ServiceModuleName = MyModuleID;
                g.UserID = this.MyUserID;
                g.IsAllowedGrouping = true;
                g.CommandButtonNewText = "New Vehicle Brand";
                g.FormCaptionText = "Vehicle Brand";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "vehiclemake", Title = "Vehicle  Brand", DataType = GridDataType.String.ToString(), IsGroupable = false, FooterTemplate = "Total Vehicle Make : <b>#=count#</b>" });
                g.Column.Add(new GridColumn {Field = "vehicletype", Title = "Vehicle Type", DataType = GridDataType.String.ToString()});
                g.Column.Add(new GridColumn { Field = "Capacity", Title = "Capacity", DataType = GridDataType.String.ToString(), });
                g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                g.Aggregate = new List<GridAggregate>();
                g.Aggregate.Add(new GridAggregate { Field = "vehiclemake", Aggregate = "count" });
                g.InstantiateIn(Container);
            }
        }
        /// <summary>
        /// Save VehicleType
        /// Created By :
        /// Created On :
        /// </summary>
        private void SaveVehicleMake()
        {
            List<VehicleMake> listVehicleMake = new List<VehicleMake>();
          //  var FormElement = System.Web.HttpContext.Current.Request.Form;
            var VehicleMake = new VehicleMake
            {
                VehicleTypeSNo = System.Web.HttpContext.Current.Request.Form["VehicleTypeSNo"].ToString().Trim(),
                vehiclemake = System.Web.HttpContext.Current.Request.Form["vehiclemake"].ToUpper(),
                Capacity = Convert.ToInt32(System.Web.HttpContext.Current.Request.Form["Capacity"]),
              
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,

            };
            listVehicleMake.Add(VehicleMake);
            object datalist = (object)listVehicleMake;
            DataOperationService(DisplayModeSave, datalist, MyModuleID);
        }
        /// <summary>
        /// Update VehicleType as per given sno
        /// Created By :
        /// Created On :
        /// </summary>
        /// <param name="RecordID"></param>
        private void UpdateVehicleMake(int RecordID)
        {
            List<VehicleMake> listVehicleMake = new List<VehicleMake>();
            //  var FormElement = System.Web.HttpContext.Current.Request.Form;
            var VehicleMake = new VehicleMake
            {
                SNo = Convert.ToInt32(RecordID),
             //   VehicleTypeSNo = CurrentPageContext.Request.Form["VehicleTypeSNo"].ToString().Trim(),
              //  vehiclemake = CurrentPageContext.Request.Form["vehiclemake"].ToUpper(),
                Capacity = Convert.ToInt32(System.Web.HttpContext.Current.Request.Form["Capacity"]),
                IsActive = System.Web.HttpContext.Current.Request["IsActive"] == "0",
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,

            };
            listVehicleMake.Add(VehicleMake);
            object datalist = (object)listVehicleMake;
            DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        }
        /// <summary>
        /// Delete VehicleType as per given recordid
        /// Created By :
        /// Created On :
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteVehicleMake(int RecordID)
        {
            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        }
        /// <summary>
        /// Get VehicleType Record 
        /// Created By : 
        /// Created On : 
        /// </summary>
        private object GetVehicleMakeRecord()
        {
            object dp = null;
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
            {
                VehicleMake dpList = new VehicleMake();
                object obj = (object)dpList;

                dp = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dp;
        }
    
    

    
    }
}
