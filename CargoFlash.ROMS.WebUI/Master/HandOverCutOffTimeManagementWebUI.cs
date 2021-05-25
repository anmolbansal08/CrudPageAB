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

namespace CargoFlash.Cargo.WebUI.Master
{
    public class HandOverCutOffTimeManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Set context of the page(form) i.e bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public HandOverCutOffTimeManagementWebUI(Page PageContext)
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
                this.MyAppID = "HandOverCutOffTime";
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
                    htmlFormAdapter.HeadingColumnName = "HandOverCutOffTime";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordHandOverCutOffTime();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordHandOverCutOffTime();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordHandOverCutOffTime();
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
                            htmlFormAdapter.objFormData = GetRecordHandOverCutOffTime();
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
        /// Generate HandOverCutOffTime web page from XML
        /// </summary>
        /// <param name="container"></param>
        public override void CreateWebForm(StringBuilder container)
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
                        case DisplayModeDuplicate:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
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
        }

        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveHandOverCutOffTime();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveHandOverCutOffTime();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false,2000), false);

                        break;
                    case DisplayModeUpdate:
                        UpdateHandOverCutOffTime(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteHandOverCutOffTime(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2002), false);
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
                    g.CommandButtonNewText = "New Handover Cut-Off Time";
                    g.FormCaptionText = "Handover Cut-Off Time";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    //g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Bucket Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "HandOverCutoffTime", Title = "Handover Cut-Off Time (mins)", DataType = GridDataType.String.ToString() });
                  

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
        /// Insert new HandOverCutOffTime record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveHandOverCutOffTime()
        {
            try
            {
                List<HandOverCutOffTime> listHandOverCutOffTime = new List<HandOverCutOffTime>();
                var HandOverCutOffTime = new HandOverCutOffTime
                {
                    SNo = 0,

                    BucketClassSNo = CurrentPageContext.Request.Form["BucketClassSNo"],
                    CityCode = CurrentPageContext.Request.Form["CityCode"],
                    //CityCode = CurrentPageContext.Request.Form["Multi_CityCode"],
                    HandOverCutoffTime = (Convert.ToInt32(CurrentPageContext.Request.Form["HandOverCutOffTime0DD"]) * 1440) + (Convert.ToInt32(CurrentPageContext.Request.Form["HandOverCutOffTime0HH"]) * 60) + Convert.ToInt32(CurrentPageContext.Request.Form["HandOverCutOffTime0MM"]),
                    ValidFrom = Convert.ToDateTime(CurrentPageContext.Request.Form["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(CurrentPageContext.Request.Form["ValidTo"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString()
                };
                listHandOverCutOffTime.Add(HandOverCutOffTime);
                object datalist = (object)listHandOverCutOffTime;
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
        /// Update HandOverCutOffTime record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void UpdateHandOverCutOffTime(int RecordID)
        {
            try
            {
                List<HandOverCutOffTime> listHandOverCutOffTime = new List<HandOverCutOffTime>();
                var HandOverCutOffTime = new HandOverCutOffTime
                {
                    SNo = Convert.ToInt32(RecordID),
                    BucketClassSNo = CurrentPageContext.Request.Form["BucketClassSNo"],
                    CityCode = CurrentPageContext.Request.Form["Multi_CityCode"],
                    HandOverCutoffTime = (Convert.ToInt32(CurrentPageContext.Request.Form["HandOverCutOffTime0DD"]) * 1440) + (Convert.ToInt32(CurrentPageContext.Request.Form["HandOverCutOffTime0HH"]) * 60) + Convert.ToInt32(CurrentPageContext.Request.Form["HandOverCutOffTime0MM"]),
                    ValidFrom = Convert.ToDateTime(CurrentPageContext.Request.Form["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(CurrentPageContext.Request.Form["ValidTo"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString()
                };
                listHandOverCutOffTime.Add(HandOverCutOffTime);
                object datalist = (object)listHandOverCutOffTime;
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
        /// Delete HandOverCutOffTime record from the database 
        /// call webservice to update that data into the database 
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteHandOverCutOffTime(string RecordID)
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
        ///  Get information of individual HandOverCutOffTime from database according record id supplied
        /// </summary>
        /// <returns>object type of entity HandOverCutOffTime found from database</returns>
        public object GetRecordHandOverCutOffTime()
        {
            object HandOverCutOffTime = null;

            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        HandOverCutOffTime gpList = new HandOverCutOffTime();
                        object obj = (object)gpList;
                        HandOverCutOffTime = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return HandOverCutOffTime;
        }
    }
}
