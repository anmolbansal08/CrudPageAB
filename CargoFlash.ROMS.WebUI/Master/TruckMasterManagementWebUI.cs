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
    public class TruckMasterManagementWebUI : BaseWebUISecureObject
    {
        public TruckMasterManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Master";
                this.MyAppID = "TruckMaster";
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
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public TruckMasterManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "TruckMaster";
                this.MyPrimaryID = "SNo";
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
                    g.CommandButtonNewText = "New Truck Master";
                    g.FormCaptionText = "Truck Master";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.IsShowDelete = false;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "TruckNo", Title = "Truck No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AssignedTruckRegNo", Title = "Assigned Truck Reg No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EIDNo", Title = "EID No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PPNo", Title = "PP No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SHJcustomsCardNo", Title = "SHJ customs Card No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DXBcustomsCardNo", Title = "DXB customs Card No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ADPNo", Title = "ADP No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
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


        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "TruckNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordTruckMaster();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", false);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordTruckMaster();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordTruckMaster();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordTruckMaster();
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

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveTruckMaster();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveTruckMaster();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateTruckMaster(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteTruckMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        public object GetRecordTruckMaster()
        {
            object TruckMaster = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    TruckMaster TruckMasterList = new TruckMaster();
                    object obj = (object)TruckMasterList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    TruckMaster = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

            }
            return TruckMaster;
        }

        /// <summary>
        /// Get information of individual FlightType from database according record id supplied
        /// </summary>
        /// <returns>object type of entity FlightType found from database return null in case if touple not found</returns>

        private void SaveTruckMaster()
        {
            try
            {
                List<TruckMaster> listTruckMaster = new List<TruckMaster>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var TruckMaster = new TruckMaster
                {
                    TruckNo = FormElement["TruckNo"].ToString(),
                    AssignedTruckRegNo = FormElement["AssignedTruckRegNo"].ToString().ToUpper(),
                    AssignedTruckExpDate = string.IsNullOrEmpty(FormElement["AssignedTruckExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["AssignedTruckExpDate"].ToString()),
                    EIDNo = FormElement["EIDNo"].ToString().ToUpper(),
                    EIDNoExpDate = string.IsNullOrEmpty(FormElement["EIDNoExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["EIDNoExpDate"].ToString()),
                    PPNo = FormElement["PPNo"].ToString().ToUpper(),
                    PPExpDate = string.IsNullOrEmpty(FormElement["PPExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["PPExpDate"].ToString()),
                    SHJcustomsCardNo = FormElement["SHJcustomsCardNo"].ToString().ToUpper(),
                    SHJcustomscardNoexpDate = string.IsNullOrEmpty(FormElement["SHJcustomscardNoexpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["SHJcustomscardNoexpDate"].ToString()),
                    DXBcustomsCardNo = FormElement["DXBcustomsCardNo"].ToString().ToUpper(),
                    DXBcustomsExpDate = string.IsNullOrEmpty(FormElement["DXBcustomsExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["DXBcustomsExpDate"].ToString()),
                    ADPNo = FormElement["ADPNo"].ToString().ToUpper(),
                    ADPNoExpDate = string.IsNullOrEmpty(FormElement["ADPNoExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ADPNoExpDate"].ToString()),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };

                listTruckMaster.Add(TruckMaster);
                object datalist = (object)listTruckMaster;
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
        private void UpdateTruckMaster(int RecordID)
        {
            try
            {
                List<TruckMaster> listTruckMaster = new List<TruckMaster>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var TruckMaster = new TruckMaster
                {
                    SNo = Convert.ToInt32(RecordID),
                    TruckNo = FormElement["TruckNo"].ToString().ToUpper(),
                    AssignedTruckRegNo = FormElement["AssignedTruckRegNo"].ToString().ToUpper(),
                    AssignedTruckExpDate = string.IsNullOrEmpty(FormElement["AssignedTruckExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["AssignedTruckExpDate"].ToString()),
                    EIDNo = FormElement["EIDNo"].ToString().ToUpper(),
                    EIDNoExpDate = string.IsNullOrEmpty(FormElement["EIDNoExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["EIDNoExpDate"].ToString()),
                    PPNo = FormElement["PPNo"].ToString().ToUpper(),
                    PPExpDate = string.IsNullOrEmpty(FormElement["PPExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["PPExpDate"].ToString()),
                    SHJcustomsCardNo = FormElement["SHJcustomsCardNo"].ToString().ToUpper(),
                    SHJcustomscardNoexpDate = string.IsNullOrEmpty(FormElement["SHJcustomscardNoexpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["SHJcustomscardNoexpDate"].ToString()),
                    DXBcustomsCardNo = FormElement["DXBcustomsCardNo"].ToString().ToUpper(),
                    DXBcustomsExpDate = string.IsNullOrEmpty(FormElement["DXBcustomsExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["DXBcustomsExpDate"].ToString()),
                    ADPNo = FormElement["ADPNo"].ToString().ToUpper(),
                    ADPNoExpDate = string.IsNullOrEmpty(FormElement["ADPNoExpDate"]) == true ? (DateTime?)null : Convert.ToDateTime(FormElement["ADPNoExpDate"].ToString()),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listTruckMaster.Add(TruckMaster);
                object datalist = (object)listTruckMaster;
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

        private void DeleteTruckMaster(string RecordID)
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
