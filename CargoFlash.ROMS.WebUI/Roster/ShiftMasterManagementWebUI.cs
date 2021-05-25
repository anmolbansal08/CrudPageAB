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
using CargoFlash.Cargo.Model.Roster;
using System.Collections;
using System.Web;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Roster
{
    public class ShiftMasterManagementWebUI : BaseWebUISecureObject
    {

        public object GetRecordShiftMaster()
        {

            object ShiftMaster = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ShiftMaster ShiftMasterList = new ShiftMaster();
                    object obj = (object)ShiftMasterList;
                    ShiftMaster = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return ShiftMaster;
        }
        public ShiftMasterManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Roster";
                this.MyAppID = "ShiftMaster";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public ShiftMasterManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Roster";
                this.MyAppID = "ShiftMaster";
                this.MyPrimaryID = "SNo";
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
                    htmlFormAdapter.HeadingColumnName = "ShiftName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordShiftMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordShiftMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.objFormData = GetRecordShiftMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordShiftMaster();
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Shift Master";
                    g.FormCaptionText = "Shift Master";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ShiftName", Title = "Shift Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TimeIn", Title = "Time In", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TimeOut", Title = "Time Out", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DayNext", Title = "Next Day", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });

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

        public override void DoPostBack()
        {
            //try
            //{

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveShiftMaster();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveShiftMaster();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateShiftMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteShiftMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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


        private void SaveShiftMaster()
        {
            try
            {
                List<ShiftMaster> listShiftMaster = new List<ShiftMaster>();
                // String[] Logo = SaveImage();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ShiftMaster = new ShiftMaster
                {

                    // SNo=0,
                    ShiftName = FormElement["ShiftName"].ToUpper(),
                    TimeIn = FormElement["TimeIn"],//not null
                    TimeOut = FormElement["TimeOut"],//not null
                    NextDay = Convert.ToBoolean(FormElement["NextDay"] == "on" ? 1 : 0),

                    IsActive = FormElement["IsActive"] == "0",//not null
                    //CreatedOn=DateTime.UtcNow.ToString(),
                    //UpdatedOn = DateTime.UtcNow.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()


                };
                listShiftMaster.Add(ShiftMaster);
                object datalist = (object)listShiftMaster;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        private void UpdateShiftMaster(string RecordID)
        {
            try
            {
                List<ShiftMaster> listShiftMaster = new List<ShiftMaster>();
                // String[] Logo = SaveImage();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ShiftMaster = new ShiftMaster
                {
                    SNo = int.Parse(RecordID),
                    ShiftName = FormElement["ShiftName"].ToUpper(),
                    TimeIn = FormElement["TimeIn"],//not null
                    TimeOut = FormElement["TimeOut"],//not null
                    NextDay = Convert.ToBoolean(FormElement["NextDay"] == "on" ? 1 : 0),

                    IsActive = FormElement["IsActive"] == "0",//not null
                    //CreatedOn=DateTime.UtcNow.ToString(),
                    //UpdatedOn = DateTime.UtcNow.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listShiftMaster.Add(ShiftMaster);
                object datalist = (object)listShiftMaster;
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
        private void DeleteShiftMaster(string RecordID)
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
