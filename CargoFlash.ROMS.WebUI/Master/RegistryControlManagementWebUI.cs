using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
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
using CargoFlash.Cargo.WebUI;


namespace CargoFlash.Cargo.WebUI.Master
{
    public class RegistryControlManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;

        public object GetRegistryControlRecord()
        {
            object RC = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CargoFlash.Cargo.Model.Master.RegistryControl RCList = new CargoFlash.Cargo.Model.Master.RegistryControl();
                    object obj = (object)RCList;
                    RC = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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
            return RC;
        }

        public object GetRecordRegistryControl()
        {
            object RC = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RegistryControl RCList = new RegistryControl();
                    object obj = (object)RCList;
                    RC = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return RC;
        }

        public RegistryControlManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "RegistryControl";
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
                    htmlFormAdapter.HeadingColumnName = "CountryName";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRegistryControlRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<table id='xyz'><tr><td></td></tr></table>");
                            container.Append(@"<input type='hidden' id='RecordID' value='" + System.Web.HttpContext.Current.Request.QueryString["RecID"] + "' /><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><div style=height:10px' />&nbsp;&nbsp;</div>" +
                                                 "<table id='tblRegistryControlTran'></table>");
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRegistryControlRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRegistryControlRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(@"<input type='hidden' id='RecordID' value='" + System.Web.HttpContext.Current.Request.QueryString["RecID"] + "' /><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><div style=height:10px' />&nbsp;&nbsp;</div>" +
                                                "<table id='tblRegistryControlTran'></table>");
                           
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(@"<input type='hidden' id='RecordID' /><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><div style=height:10px' />&nbsp;&nbsp;</div>" +
                                                "<table id='tblRegistryControlTran'></table>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRegistryControlRecord();
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

        //public StringBuilder CreateWebForm(StringBuilder container)
        //{
        //    try
        //    {
        //        if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
        //        {
        //            Set the display Mode form the URL QuesyString.
        //            this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

        //            Match the display Mode of the form.
        //            switch (this.DisplayMode)
        //            {
        //                case DisplayModeIndexView:
        //                    CreateGrid(container);
        //                    break;
        //                case DisplayModeReadView:
        //                    BuildFormView(this.DisplayMode, container);
        //                    break;
        //                case DisplayModeEdit:
        //                    BuildFormView(this.DisplayMode, container);
        //                    break;
        //                case DisplayModeNew:
        //                    BuildFormView(this.DisplayMode, container);
        //                    break;
        //                case DisplayModeDuplicate:
        //                    BuildFormView(this.DisplayMode, container);
        //                    break;
        //                case DisplayModeDelete:
        //                    BuildFormView(this.DisplayMode, container);
        //                    break;
        //                default:
        //                    break;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;

        //    }
        //    return container;
        //}

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
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
                            // BuildFormView(this.DisplayMode, container);
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
            return strContent;
        }
        
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                         SaveRegistryControl();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                      
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateRegistryControl();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        //DeleteCountry(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.FormCaptionText = "Registry Control";
                    g.CommandButtonNewText = "New Registry Control";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "processName", Title = "Process Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SubProcessName", Title = "SubProcess Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "pagename", Title = "Page Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "priority", Title = "Priority", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IsRequired", Title = "Required", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "isdisplay", Title = "Display", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "isactive", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "isdeleted", Title = "Deleted", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "isoneclick", Title = "On Click", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "displaycaption", Title = "Display Caption", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "progresscheck", Title = "Progress Check", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ispopupsubprocess", Title = "Popup Sub Process", DataType = GridDataType.String.ToString() });
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

        private void SaveRegistryControl()
        {
            var Flist = System.Web.HttpContext.Current.Request.Form;
            string airlinesno, CitySno, GroupSNo, ProcessSNo, PageSNo;
            airlinesno = Flist["AirlineSNo"].ToString();
            CitySno = Flist["CitySno"].ToString();
            GroupSNo = Flist["GroupSNo"].ToString();
            ProcessSNo = Flist["ProcessSNo"].ToString();
            PageSNo = Flist["PageSNo"].ToString();

            DataTable dtCreate = new DataTable();
            dtCreate.TableName = "RC";
            dtCreate.Columns.Add("AirlineSNo", typeof(System.Int32));
            dtCreate.Columns.Add("CitySno", typeof(System.Int32));
            dtCreate.Columns.Add("GroupSNo", typeof(System.Int32));
            dtCreate.Columns.Add("ProcessSNo", typeof(System.Int32));
            dtCreate.Columns.Add("PageSNo", typeof(System.Int32));
            dtCreate.Columns.Add("SPSNo", typeof(System.Int32));
            dtCreate.Columns.Add("PSNo", typeof(System.Int32));
            dtCreate.Columns.Add("priority", typeof(System.String));
            dtCreate.Columns.Add("IsRequired", typeof(System.Boolean));
            dtCreate.Columns.Add("IsDisplay", typeof(System.Boolean));
            dtCreate.Columns.Add("IsActive", typeof(System.Boolean));
       
            dtCreate.Columns.Add("IsOnClick", typeof(System.Boolean));
            dtCreate.Columns.Add("DC", typeof(System.String));
            dtCreate.Columns.Add("ProgressCheck", typeof(System.Boolean));
            dtCreate.Columns.Add("IsPopUpSubProcess", typeof(System.Boolean));
            dtCreate.Columns.Add("Status", typeof(System.String));
            dtCreate.Columns.Add("Group", typeof(System.String));
            dtCreate.Columns.Add("Page", typeof(System.Int32));
            

            for (int count = 1; count <= Convert.ToInt32(Flist["tblRegistryControlTran_totRowCount_1"].ToString()); count++)
            {
                DataRow dr = dtCreate.NewRow();
                dr["AirlineSNo"] = Convert.ToInt32(Flist["AirlineSNo"].ToString() == "" ? "0" : Flist["AirlineSNo"].ToString());
                dr["CitySno"] = Convert.ToInt32(Flist["CitySno"].ToString() == "" ? "0" : Flist["CitySno"].ToString());
                dr["GroupSNo"] = Convert.ToInt32(Flist["GroupSNo"].ToString() == "" ? "0" : Flist["GroupSNo"].ToString());
                dr["ProcessSNo"] = Convert.ToInt32(Flist["ProcessSNo"].ToString() == "" ? "0" : Flist["ProcessSNo"].ToString());
                dr["PageSNo"] = Convert.ToInt32(Flist["PageSNo"].ToString() == "" ? "0" : Flist["PageSNo"].ToString()); 
                dr["SPSNo"] = Flist["tblRegistryControlTran_SPSNo_" + count].ToString();
                dr["PSNo"] = Flist["tblRegistryControlTran_PSNo_" + count].ToString();
                dr["priority"] = Flist["tblRegistryControlTran_priority_" + count].ToString();
                dr["IsRequired"] = Flist["tblRegistryControlTran_IsRequired_" + count] == null ? false : true;
                dr["IsDisplay"] = Flist["tblRegistryControlTran_IsDisplay_" + count] == null ? false : true;
                dr["IsActive"] = Flist["tblRegistryControlTran_IsActive_" + count] == null ? false : true;               
                dr["IsOnClick"] = Flist["tblRegistryControlTran_IsOnClick_" + count] == null ? false : true;
                dr["DC"] = Flist["tblRegistryControlTran_DC_" + count].ToString();
                dr["ProgressCheck"] = Flist["tblRegistryControlTran_ProgressCheck_" + count] == null ? false : true;
                dr["IsPopUpSubProcess"] = Flist["tblRegistryControlTran_IsPopUpSubProcess_" + count] == null ? false : true;
                dr["Status"] = Flist["tblRegistryControlTran_Status_" + count].ToString();
                dr["Group"] = Flist["tblRegistryControlTran_Group_" + count].ToString();
                dr["Page"] = 0;
                dtCreate.Rows.Add(dr);
                dtCreate.AcceptChanges();
            }

            DataOperationService(DisplayModeSave, dtCreate, MyModuleID);
        }
        
        private void UpdateRegistryControl()
        {
            var Flist = System.Web.HttpContext.Current.Request.Form;
            string airlinesno, CitySno, GroupSNo, ProcessSNo, PageSNo;
            airlinesno = Flist["AirlineSNo"].ToString();
            CitySno = Flist["CitySno"].ToString();
            GroupSNo = Flist["GroupSNo"].ToString();
            ProcessSNo = Flist["ProcessSNo"].ToString(); 
            PageSNo = Flist["PageSNo"].ToString();


            DataTable dtCreate = new DataTable();
            dtCreate.TableName = "RC";
            dtCreate.Columns.Add("AirlineSNo", typeof(System.Int32));
            dtCreate.Columns.Add("CitySno", typeof(System.Int32));
            dtCreate.Columns.Add("GroupSNo", typeof(System.Int32));
            dtCreate.Columns.Add("ProcessSNo", typeof(System.Int32));
            dtCreate.Columns.Add("PageSNo", typeof(System.Int32));
            dtCreate.Columns.Add("SPSNo", typeof(System.Int32));
            dtCreate.Columns.Add("PSNo", typeof(System.Int32));
            dtCreate.Columns.Add("priority", typeof(System.String));
            dtCreate.Columns.Add("IsRequired", typeof(System.Boolean));
            dtCreate.Columns.Add("IsDisplay", typeof(System.Boolean));
            dtCreate.Columns.Add("IsActive", typeof(System.Boolean));
         
            dtCreate.Columns.Add("IsOnClick", typeof(System.Boolean));
            dtCreate.Columns.Add("DC", typeof(System.String));
            dtCreate.Columns.Add("ProgressCheck", typeof(System.Boolean));
            dtCreate.Columns.Add("IsPopUpSubProcess", typeof(System.Boolean));
            dtCreate.Columns.Add("Status", typeof(System.String));
            dtCreate.Columns.Add("Group", typeof(System.String));
            dtCreate.Columns.Add("Page", typeof(System.Int32));


            for (int count = 1; count <= Convert.ToInt32(Flist["tblRegistryControlTran_totRowCount_1"].ToString()); count++)
            {
                DataRow dr = dtCreate.NewRow();
                dr["AirlineSNo"] = Convert.ToInt32(Flist["AirlineSNo"].ToString() == "" ? "0" : Flist["AirlineSNo"].ToString());
                dr["CitySno"] = Convert.ToInt32(Flist["CitySno"].ToString() == "" ? "0" : Flist["CitySno"].ToString());
                dr["GroupSNo"] = Convert.ToInt32(Flist["GroupSNo"].ToString() == "" ? "0" : Flist["GroupSNo"].ToString());
                dr["ProcessSNo"] = Convert.ToInt32(Flist["ProcessSNo"].ToString() == "" ? "0" : Flist["ProcessSNo"].ToString());
                dr["PageSNo"] = Convert.ToInt32(Flist["PageSNo"].ToString() == "" ? "0" : Flist["PageSNo"].ToString());
                dr["SPSNo"] = Flist["tblRegistryControlTran_SPSNo_" + count].ToString();
                dr["PSNo"] = Flist["tblRegistryControlTran_PSNo_" + count].ToString();
                dr["priority"] = Flist["tblRegistryControlTran_priority_" + count].ToString();
                dr["IsRequired"] = Flist["tblRegistryControlTran_IsRequired_" + count] == null ? false : true;
                dr["IsDisplay"] = Flist["tblRegistryControlTran_IsDisplay_" + count] == null ? false : true;
                dr["IsActive"] = Flist["tblRegistryControlTran_IsActive_" + count] == null ? false : true;
                
                dr["IsOnClick"] = Flist["tblRegistryControlTran_IsOnClick_" + count] == null ? false : true;
                dr["DC"] = Flist["tblRegistryControlTran_DC_" + count].ToString();
                dr["ProgressCheck"] = Flist["tblRegistryControlTran_ProgressCheck_" + count] == null ? false : true;
                dr["IsPopUpSubProcess"] = Flist["tblRegistryControlTran_IsPopUpSubProcess_" + count] == null ? false : true;
                dr["Status"] = Flist["tblRegistryControlTran_Status_" + count].ToString();
                dr["Group"] = Flist["tblRegistryControlTran_Group_" + count].ToString();
                dr["Page"] = 1;
                dtCreate.Rows.Add(dr);
                dtCreate.AcceptChanges();
            }
            DataOperationService(DisplayModeSave, dtCreate, MyModuleID);
        }
    }
}
