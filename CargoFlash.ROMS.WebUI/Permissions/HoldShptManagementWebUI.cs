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
using CargoFlash.Cargo.Model.Permissions;
using System.Collections;
using System.Web;
using CargoFlash.Cargo.WebUI;
namespace CargoFlash.Cargo.WebUI.Permissions
{
    public class HoldShptManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;
        public object GetRecordHoldShpt()
        {
            object HoldShpt = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    HoldShpt HoldShptList = new HoldShpt();
                    object obj = (object)HoldShptList;
                    HoldShpt = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return HoldShpt;
        }
        public HoldShptManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Permissions";
                this.MyAppID = "HoldShpt";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public HoldShptManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Permissions";
                this.MyAppID = "HoldShpt";
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
                    htmlFormAdapter.HeadingColumnName = "Text_AWBNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordHoldShpt();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divHoldShpt'><span id='spnHoldShpt'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/></span></div>");
                            container.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordHoldShpt();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.objFormData = GetRecordHoldShpt();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordHoldShpt();
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
            container.Append("<table id='tblHoldShpt' width='100%'></table>");
            return strContent;
        }
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New On Hold";
                    g.FormCaptionText = "Hold Shipment";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Airport", Title = "Airport", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MomvementType", Title = "Movement Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PiecesOnHold", Title = "Pieces", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Hold_Type", Title = "Hold Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "HoldOn", Title = "Hold On", DataType = GridDataType.DateTime.ToString(), Template = "# if( HoldOn==null) {# # } else {# #= kendo.toString(new Date(data.HoldOn.getTime() + data.HoldOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "UnHoldOn", Title = "UnHold On", DataType = GridDataType.DateTime.ToString(), Template = "# if( UnHoldOn==null) {# # } else {# #= kendo.toString(new Date(data.UnHoldOn.getTime() + data.UnHoldOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "Text_UnHold", Title = "UnHold By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CCTRefNo", Title = "CCT Ref No", DataType = GridDataType.String.ToString() });
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
                   
                    // SaveHoldShpt();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                   // HttpContext.Current.Session["MsgKey"] = null;
                    break;
                case DisplayModeSaveAndNew:
                   // SaveHoldShpt();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                   //HttpContext.Current.Session["MsgKey"] = null;
                    break;
                case DisplayModeUpdate:

                   // UpdateHoldShpt(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    HttpContext.Current.Session["MsgKey"] = null;
                    break;

                case DisplayModeDelete:
                    DeleteHoldShpt(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void SaveHoldShpt()
        {
            try
            {
                List<HoldShpt> listHoldShpt = new List<HoldShpt>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;




                var HoldShpt = new HoldShpt
                {
                    AWBSNo = Convert.ToInt32(FormElement["AWBNo"]),
                    Text_AWBNo = Convert.ToString(FormElement["Text_AWBNo"]),
                    CitySNo = FormElement["CitySNo"] != "" ? Convert.ToInt32(FormElement["CitySNo"]) : 0,
                   
                    CityCode =FormElement["Text_CityCode"] !="" ? FormElement["Text_CityCode"] : "",
             
                    Hold_Type = FormElement["Hold_Type"] !="" ? Convert.ToInt32(FormElement["Hold_Type"]) : 0,
                    Text_Hold_Type =FormElement["Text_Hold_Type"] !="" ?  FormElement["Text_Hold_Type"] : "",
                    HoldRemarks = FormElement["HoldRemarks"] != "" ?  FormElement["HoldRemarks"] : "",
                    UnHoldRemarks = FormElement["UnHoldRemarks"] !="" ? FormElement["UnHoldRemarks"] : "",
               
                    HoldBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UnHoldBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                };



                listHoldShpt.Add(HoldShpt);
                object datalist = (object)listHoldShpt;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        private void UpdateHoldShpt(string RecordID)
        {
            try
            {
                List<HoldShpt> listHoldShpt = new List<HoldShpt>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var HoldShpt = new HoldShpt
                {
                    SNo = Convert.ToInt32(RecordID),
                    AWBSNo = Convert.ToInt32(FormElement["AWBNo"]),
                    Text_AWBNo = Convert.ToString(FormElement["Text_AWBNo"]),
                    CitySNo = Convert.ToInt32(FormElement["CityCode"]),
                    CityCode = FormElement["Text_CityCode"],
                    //Text_CityCode = FormElement["Text_CityCode"],
                    Hold_Type = Convert.ToInt32(FormElement["Hold_Type"]),
                    Text_Hold_Type = Convert.ToString(FormElement["Text_Hold_Type"]),
                    HoldRemarks = Convert.ToString(FormElement["HoldRemarks"]),
                    UnHoldRemarks = FormElement["UnHoldRemarks"].ToString(),
                    //HoldOn = Convert.ToString(FormElement["HoldOn"]) == "on" ? DateTime.Now.ToString("yyyy-MM-dd") : "",
                    //UnHoldOn = Convert.ToString(FormElement["UnHold"]) == "on" ? DateTime.Now.ToString("yyyy-MM-dd") : "",
                    HoldBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UnHoldBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                };
                listHoldShpt.Add(HoldShpt);
                object datalist = (object)listHoldShpt;
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
        private void DeleteHoldShpt(string RecordID)
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
