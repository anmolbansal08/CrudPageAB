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
using System.Collections;
using CargoFlash.Cargo.Model.Master;
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
    public class DriversManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Default Constructor and Initialized Variables.
        /// </summary>
        /// <param name="PageContext"></param>
        public DriversManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }

            this.MyUserID= int.Parse(System.Web.HttpContext.Current.Session["LoginSNo"].ToString().ToUpper());
            this.MyModuleID = "Master";
            this.MyAppID = "Drivers";
            this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
        }

        public DriversManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Drivers";
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
                    htmlFormAdapter.HeadingColumnName = "LicenceNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetDriversRecord();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetDriversRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetDriversRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetDriversRecord();
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
                    SaveDrivers();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveDrivers();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateDrivers(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                    break;
                case DisplayModeDelete:
                    DeleteDrivers(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }



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
                g.CommandButtonNewText = "New Driver";
                g.FormCaptionText = "Drivers";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "Mobile", Title = "Mobile Number", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "DriverName", Title = "Driver Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "LicenceNo", Title = "Licence No.", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                g.Action = new List<GridAction>();
                g.Action.Add(new GridAction { ActionName = "READ", AppsName = this.MyAppID, CssClassName = "read", ModuleName = "Master" });
                g.Action.Add(new GridAction { ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "edit", ModuleName = "Master" });
                g.Action.Add(new GridAction { ActionName = "DELETE", AppsName = this.MyAppID, CssClassName = "trash", ModuleName = "Master" });
                g.InstantiateIn(Container);
            }
        }


        //private void CreateGrid(StringBuilder Container)
        //{
        //    using (Grid g = new Grid())
        //    {
        //        g.Height = 400;
        //        g.PageName = this.MyPageName;
        //        g.PrimaryID = this.MyPrimaryID;
        //        g.ModuleName = this.MyModuleID;
        //        g.AppsName = this.MyAppID;
        //        g.ServiceModuleName = MyModuleID;
        //        g.UserID = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
        //        g.IsAllowedGrouping = true;
        //        g.CommandButtonNewText = "New Driver";
        //        g.FormCaptionText = "Drivers";
        //       // g.SuccessGrid = "ShowAction";
        //        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //        g.Column = new List<GridColumn>();

        //        g.Column.Add(new GridColumn { Field = "Mobile", Title = "Mobile Number", DataType = GridDataType.String.ToString(), IsGroupable = false, FooterTemplate = "Total Drivers : <b>#=count#</b>" });
        //        g.Column.Add(new GridColumn { Field = "DriverName", Title = "Driver Name", DataType = GridDataType.String.ToString() });
        //        g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
        //        g.Column.Add(new GridColumn { Field = "LicenceNo", Title = "Licence No.", DataType = GridDataType.String.ToString() });
        //        g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
        //        g.Aggregate = new List<GridAggregate>();
        //        g.Aggregate.Add(new GridAggregate { Field = "LicenceNo", Aggregate = "count" });

        //        g.InstantiateIn(Container);
        //    }
        //}
        
        private void SaveDrivers()
        {
            List<DriversSave> listDrivers = new List<DriversSave>();
            //var FormElement = System.Web.HttpContext.Current.Request.Form;
            var Drivers = new DriversSave
            {
                SNo = 0,
                CitySNo = System.Web.HttpContext.Current.Request.Form["CitySNo"] == "" ? 0 : Convert.ToInt32(System.Web.HttpContext.Current.Request.Form["CitySNo"]),
                FirstName = System.Web.HttpContext.Current.Request.Form["FirstName"].ToUpper(),
                LastName = System.Web.HttpContext.Current.Request.Form["LastName"].ToUpper(),
                EMailID = System.Web.HttpContext.Current.Request.Form["EMailID"].ToUpper(),
                Mobile = System.Web.HttpContext.Current.Request.Form["Mobile"],               
                Address = System.Web.HttpContext.Current.Request.Form["Address"].ToUpper(),
                ZipCode = System.Web.HttpContext.Current.Request.Form["ZipCode"].ToUpper(),
                LicenceNo = System.Web.HttpContext.Current.Request.Form["LicenceNo"].ToUpper(),
                LicenceExpiry = ConvertToDateTime(System.Web.HttpContext.Current.Request.Form["LicenceExpiry"]),
             //   IsActive = System.Web.HttpContext.Current.Request.Form["IsActive"] == null ? true : System.Web.HttpContext.Current.Request.Form["IsActive"] == "0",
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,

            };
            listDrivers.Add(Drivers);
            object datalist = (object)listDrivers;
            DataOperationService(DisplayModeSave, datalist, MyModuleID);
        }

        /// <summary>
        /// Update Drivers as per given sno
        /// </summary>
        /// <param name="RecordID"></param>
        private void UpdateDrivers(int RecordID)
        {
            List<DriversSave> listDriversUpdate = new List<DriversSave>();
            var DriversUpdate = new DriversSave
            {
                SNo = RecordID,
                CitySNo = System.Web.HttpContext.Current.Request.Form["CitySNo"] == "" ? 0 : Convert.ToInt32(System.Web.HttpContext.Current.Request.Form["CitySNo"]),
                FirstName = System.Web.HttpContext.Current.Request.Form["FirstName"].ToUpper(),
                LastName = System.Web.HttpContext.Current.Request.Form["LastName"].ToUpper(),
                EMailID = System.Web.HttpContext.Current.Request.Form["EMailID"].ToUpper(),
                Mobile = System.Web.HttpContext.Current.Request.Form["Mobile"],
                Address = System.Web.HttpContext.Current.Request.Form["Address"].ToUpper(),
                ZipCode = System.Web.HttpContext.Current.Request.Form["ZipCode"].ToUpper(),
                LicenceNo = System.Web.HttpContext.Current.Request.Form["LicenceNo"].ToUpper(),
                LicenceExpiry = ConvertToDateTime(System.Web.HttpContext.Current.Request.Form["LicenceExpiry"]),
                IsActive = System.Web.HttpContext.Current.Request.Form["IsActive"] == null ? true : System.Web.HttpContext.Current.Request.Form["IsActive"] == "0",
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,

            };
            listDriversUpdate.Add(DriversUpdate);
            object datalist = (object)listDriversUpdate;
            DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        }
        /// <summary>
        /// Delete Drivers as per given recordid
        /// Created By : 
        /// Created On : 
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteDrivers(int RecordID)
        {
            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        }
        
        private object GetDriversRecord()
        {
            object dp = null;
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
            {
                Drivers dpList = new Drivers();
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
