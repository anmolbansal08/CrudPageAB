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
using CargoFlash.Cargo.Model.ULD;
using System.Collections;
using System.Web;
namespace CargoFlash.Cargo.WebUI.ULD
{
    #region MaintenanceType Class Description
    /*
    *****************************************************************************
    Class Name:		MaintenanceTypeManagementWebUI      
    Purpose:		
    Company:		CargoFlash Infotech Pvt Ltd.
    Author:			Devendra singh
    Created On:		10 july 2017
    Updated By:    
    Updated On:	
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    public class MaintenanceTypeManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Set context of the page(form) i.e bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public MaintenanceTypeManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "ULD";
                this.MyAppID = "MaintenanceType";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public MaintenanceTypeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "MaintenanceType";
                this.MyPrimaryID = "SNo";
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
        /// <param name="DisplayMode">Identify which operation has to be performed i.e(Read,Write,Update,Delete)</param>
        /// <param name="container">Control Object</param>
        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "MaintenancType";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordMaintenanceType();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordMaintenanceType();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordMaintenanceType();
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
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.objFormData = GetRecordMaintenanceType();
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
        }

        /// <summary>
        /// Generate MaintenanceType web page from XML
        /// </summary>
        /// <param name="container"></param>
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
                        SaveMaintenanceType();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveMaintenanceType();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateMaintenanceType(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteMaintenanceType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        /// Generate Grid for the page as per the columns of the entity supplied
        /// </summary>
        /// <param name="Container"></param>
        private void CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.CommandButtonNewText = "New Maintenance Type";
                    g.FormCaptionText = "Maintenance Type";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "MaintenanceCategorys", Title = "Maintenance Category", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "MaintenancType", Title = "Maintenance Type", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "MaintenanceDesc", Title = "Maintenance Description", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "ManhourCost", Title = "Man hour Cost ", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "uldtype", Title = "ULD Type", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "ReferenceNo", Title = "Reference No", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        /// <summary>
        /// Insert new MaintenanceType record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveMaintenanceType()
        {
            try
            {
                List<MaintenanceType> listMaintenanceType = new List<MaintenanceType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var MaintenanceType = new MaintenanceType
                {
                    SNo = Convert.ToInt32(FormElement["SNo"]),
                    MaintenancType = Convert.ToString(FormElement["MaintenanceType"]),
                    MaintenanceDesc = Convert.ToString(FormElement["MaintenanceDesc"]),
                    ManhourCost = Convert.ToString(FormElement["ManhourCost"]),                  
                    IsActive = FormElement["IsActive"] == "0" ? true : false,//not null
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    uldtype = Convert.ToString(FormElement["uldtype"]),
                    MaintenanceCategory =Convert.ToInt16(FormElement["MaintenanceCategory"])
                };
                listMaintenanceType.Add(MaintenanceType);
                object datalist = (object)listMaintenanceType;
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
        /// Update MaintenanceType record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void UpdateMaintenanceType(int RecordID)
        {
            try
            {
                List<MaintenanceType> listMaintenanceType = new List<MaintenanceType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                var MaintenanceType = new MaintenanceType
                {
                    SNo = Convert.ToInt32(RecordID),

                    MaintenancType = Convert.ToString(FormElement["MaintenancType"].ToString()),
                    MaintenanceDesc = Convert.ToString(FormElement["MaintenanceDesc"].ToString()),
                    ManhourCost = Convert.ToString(FormElement["ManhourCost"].ToString()),
                    
                    IsActive = FormElement["IsActive"] == "0" ? true : false,//not null

                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    uldtypesno = Convert.ToString(FormElement["uldtypesno"]),
                    uldtype = Convert.ToString(FormElement["uldtype"]),
                    MaintenanceCategory =Convert.ToInt16(FormElement["MaintenanceCategory"])
                };

                listMaintenanceType.Add(MaintenanceType);
                object datalist = (object)listMaintenanceType;
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
        /// Delete MaintenanceType record from the database 
        /// call webservice to update that data into the database 
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteMaintenanceType(string RecordID)
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

        /// <summary>
        ///  Get information of individual MaintenanceType from database according record id supplied
        /// </summary>
        /// <returns>object type of entity MaintenanceType found from database</returns>

        public object GetRecordMaintenanceType()
        {
            object MaintenanceType = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        MaintenanceType udList = new MaintenanceType();
                        object obj = (object)udList;
                        MaintenanceType = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                        this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

            } return MaintenanceType;
        }

    }
}




