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
    /// Created By : Naveen Thakur
    /// Created On : 08 APR 2020
    /// Approved By : 
    /// </summary>
    public class VehicleTypeManagementWebUI : BaseWebUISecureObject
    {

        public VehicleTypeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "VehicleType";
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
        /// <summary>
        /// Default Constructor and Initialized Variables.
        /// </summary>
        /// <param name="PageContext"></param>
        public VehicleTypeManagementWebUI(Page PageContext)
        {
            //if (this.SetCurrentPageContext(PageContext))
            //{
            //    this.ErrorNumber = 0;
            //    this.ErrorMessage = "";
            //}

            //this.MyUserID = int.Parse(System.Web.HttpContext.Current.Session["LoginSNo"].ToString().ToUpper());
            //this.MyModuleID = "Master";
            //this.MyAppID = "VehicleType";
            //this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
            //this.MyPrimaryID = "SNo";
            //this.MyPageName = "Default.aspx";

            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "VehicleType";
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
                    htmlFormAdapter.HeadingColumnName = "vehicletype";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetVehicleTypeRecord();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetVehicleTypeRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetVehicleTypeRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetVehicleTypeRecord();
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
                    SaveVehicleType();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveVehicleType();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateVehicleType(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                    break;
                case DisplayModeDelete:
                    DeleteVehicleType(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

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
                g.CommandButtonNewText = "New Vehicle Type";
                g.FormCaptionText = "Vehicle Type";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "vehicletype", Title = "Vehicle Type", DataType = GridDataType.String.ToString(), IsGroupable = false, FooterTemplate = "Total Vehicle Type : <b>#=count#</b>" });
               // g.Column.Add(new GridColumn { Field = "Capacity", Title = "Capacity", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                g.Aggregate = new List<GridAggregate>();
                g.Aggregate.Add(new GridAggregate { Field = "vehicletype", Aggregate = "count" });
                g.InstantiateIn(Container);
            }
        }
        
       
        private void SaveVehicleType()
        {
            List<VehicleType> listVehicleType = new List<VehicleType>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            var VehicleType = new VehicleType
            {
                //vehicletype = CurrentPageContext.Request.Form["vehicletype"].ToString().ToUpper() != string.Empty ? CurrentPageContext.Request.Form["vehicletype"].ToUpper() : string.Empty,
                // Capacity = Convert.ToInt32(CurrentPageContext.Request.Form["Capacity"]),
                vehicletype = (FormElement["vehicletype"] != string.Empty ? FormElement["vehicletype"] : string.Empty).ToUpper(),
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,

            };
            listVehicleType.Add(VehicleType);
            object datalist = (object)listVehicleType;
            DataOperationService(DisplayModeSave, datalist, MyModuleID);
        }
       
        /// <param name="RecordID"></param>
        private void UpdateVehicleType(int RecordID)
        {
            List<VehicleType> listVehicleType = new List<VehicleType>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            var VehicleType = new VehicleType
            {
                SNo = RecordID,
                //  vehicletype = CurrentPageContext.Request.Form["vehicletype"].ToString().ToUpper() != string.Empty ? CurrentPageContext.Request.Form["vehicletype"].ToUpper() : string.Empty,
                vehicletype = (FormElement["vehicletype"] != string.Empty ? FormElement["vehicletype"] : string.Empty).ToUpper(),
                // IsActive = System.Web.HttpContext.Current.Request["IsActive"] == "0",
                IsActive = FormElement["IsActive"] == "0",
                // Capacity = Convert.ToInt32(CurrentPageContext.Request.Form["Capacity"]),
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,

            };
            listVehicleType.Add(VehicleType);
            object datalist = (object)listVehicleType;
            DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        }
       
        /// <param name="RecordID"></param>
        private void DeleteVehicleType(int RecordID)
        {
            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        }
      
        private object GetVehicleTypeRecord()
        {
            object dp = null;
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
            {
                VehicleType dpList = new VehicleType();
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