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
    public class WeighingScaleWebUI : BaseWebUISecureObject
    {
        public WeighingScaleWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "WeighingScale";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public WeighingScaleWebUI(Page PageContext)
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
                this.MyAppID = "WeighingScale";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        /// <summary>
        /// Get Record from City
        /// </summary>
        /// <returns></returns>
        public object GetRecordWeighingScale()
        {
            object WeighingScale = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                         WeighingScale  WeighingScaleList = new  WeighingScale();
                        object obj = (object) WeighingScaleList;
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        WeighingScale = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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
            return WeighingScale;
        }

        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container"></param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Name";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordWeighingScale();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData =GetRecordWeighingScale();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordWeighingScale();
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
                            htmlFormAdapter.objFormData = GetRecordWeighingScale();
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
        /// <summary>
        /// Generate City web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionCity.xml
        /// </summary>
        /// <param name="container"></param>
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
                    g.CommandButtonNewText = "New Weighing Scale";
                    g.FormCaptionText = "Weighing Scale";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "Name", Title = "Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "WeighingScaleID", Title = "Weighing Scale ID", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityName", Title = "City", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TerminalName", Title = "Terminal", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IPAddress", Title = "IPAddress", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PortNo", Title = "PortNo", DataType = GridDataType.String.ToString() });
                   // g.Column.Add(new GridColumn { Field = "TimeDifference", Title = "Time Difference", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                   
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
                        SaveWeighingScale();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateWeighingScale(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveWeighingScale();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        //else
                        //    return;
                        break;

                    case DisplayModeDelete:
                       DeleteWeighingScale(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
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
        /// Save City record into the database 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveWeighingScale()
        {
            try
            {
                List<WeighingScale> listWeighingScale = new List<WeighingScale>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                //string TimeofDifference = FormElement["TimeDifference"].Split(new char[] { ')' })[1];
                var WeighingScale = new WeighingScale
                {
                    Name = FormElement["Name"],
                    WeighingScaleID=FormElement["WeighingScaleID"],
                    CitySNo=Convert.ToInt32(FormElement["CitySNo"]),
                    AirportSNo=Convert.ToInt32(FormElement["AirportSNo"]),
                    TerminalSNo=Convert.ToInt32(FormElement["TerminalSNo"]),
                    IPAddress=FormElement["IPAddress"],
                    FTPHostName=FormElement["FTPHostName"],
                    FTPFolderPath=FormElement["FTPFolderPath"],
                    FTPUserId=FormElement["FTPUserId"],
                    FTPPassword=FormElement["FTPPassword"],
                    PortNo = FormElement["PortNo"],
                    IsActive = FormElement["IsActive"] == "0",
                   
                    //CreatedOn=DateTime.Now,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    //UpdatedOn=DateTime.Now,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    
                };
                listWeighingScale.Add(WeighingScale);
                object datalist = (object) listWeighingScale;
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
       
        private void UpdateWeighingScale(string RecordID)
        {
            try
            {
                List<WeighingScale> listWeighingScale = new List<WeighingScale>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                //string TimeofDifference = FormElement["TimeDifference"].Split(new char[] { ')' })[1];
                var WeighingScale = new WeighingScale
                {
                    
                    SNo = Convert.ToInt32(RecordID),
                    Name = FormElement["Name"],
                    WeighingScaleID = FormElement["WeighingScaleID"],
                    CitySNo = Convert.ToInt32(FormElement["CitySNo"]),
                    AirportSNo = Convert.ToInt32(FormElement["AirportSNo"]),
                    TerminalSNo = Convert.ToInt32(FormElement["TerminalSNo"]),
                    IPAddress = FormElement["IPAddress"],
                    FTPHostName=FormElement["FTPHostName"],
                    FTPFolderPath = FormElement["FTPFolderPath"],
                    FTPUserId = FormElement["FTPUserId"],
                    FTPPassword = FormElement["FTPPassword"],
                    PortNo = FormElement["PortNo"],
                    IsActive = FormElement["IsActive"] == "0",  
                  
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
               listWeighingScale.Add(WeighingScale);
                object datalist = (object) listWeighingScale;
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
        /// Delete City record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteWeighingScale(string RecordID)
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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
    }
}
