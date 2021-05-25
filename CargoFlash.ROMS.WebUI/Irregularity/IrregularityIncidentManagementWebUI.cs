using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Irregularity
{
    public class IrregularityIncidentManagementWebUI : BaseWebUISecureObject
    {
        public IrregularityIncidentManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Irregularity";
                this.MyAppID = "IrregularityIncident";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public IrregularityIncidentManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Irregularity";
                this.MyAppID = "IrregularityIncident";
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
                {
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
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "IncidentCategory";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divIrregularityslab'><span id='spnIrregularitySlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityIncident' style='text-align:center'></table></span></div>");  //added

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divIrregularityslab'><span id='spnIrregularitySlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityIncident' style='text-align:center'></table></span></div>");  //added
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divIrregularityslab'><span id='spnIrregularitySlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityIncident' style='text-align:center'></table></span></div>");  //added
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divIrregularityslab'><span id='spnIrregularitySlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityIncident' style='text-align:center'></table></span></div>");  //added
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divIrregularityslab'><span id='spnIrregularitySlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnIrregularitySNo' name='hdnIrregularitySNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblIrregularityIncident' style='text-align:center'></table></span></div>");  //added
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Incident";
                    g.FormCaptionText = "Incident Category";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "IncidentCategory", Title = "Category", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IncidentCategoryCode", Title = "Category Code", DataType = GridDataType.String.ToString() });
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

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveIrregularityIncident();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveIrregularityIncident();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateIrregularityIncident(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteIrregularityIncident(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }

        }
        private void UpdateIrregularityIncident(string RecordID)
        {
            try
            {
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer(); //added
                List<IrregularityIncident> irregularityIncident = new List<IrregularityIncident>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                
                List<SubCategoryTrans> AppendGridData = js.Deserialize<List<SubCategoryTrans>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"])); //added

             
                var obj = new IrregularityIncident
                {
                    SNo = Convert.ToInt32(RecordID),
                    IncidentCategory = FormElement["IncidentCategory"].ToUpper(),
                    IncidentCategoryCode = FormElement["IncidentCategoryCode"],//not null
                    Description = FormElement["Description"],
                    InitiationDays = Convert.ToInt32(FormElement["InitiationDays"]),
                    ClosureDays = Convert.ToInt32(FormElement["ClosureDays"]),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    TransData = AppendGridData  //added
                };
                irregularityIncident.Add(obj);
                object datalist = (object)irregularityIncident;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void SaveIrregularityIncident()
        {
            try
            {
                
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                //System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();  //added
                //List<SubCategoryTrans> AppendGridData = js.Deserialize<List<SubCategoryTrans>>(FormElement["hdnFormData"]); //added

                string TranData = CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]);
                List<SubCategoryTrans> AppendGridData = JsonConvert.DeserializeObject<List<SubCategoryTrans>>(TranData);


                List<IrregularityIncident> irregularityIncident = new List<IrregularityIncident>();
                
                var obj = new IrregularityIncident
                {
                    SNo = 0,
                    IncidentCategory = FormElement["IncidentCategory"].ToUpper(),
                    IncidentCategoryCode = FormElement["IncidentCategoryCode"],//not null
                    Description = FormElement["Description"],
                    InitiationDays = Convert.ToInt32(FormElement["InitiationDays"]),
                    ClosureDays = Convert.ToInt32(FormElement["ClosureDays"]),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    TransData = AppendGridData  //added
                };
                irregularityIncident.Add(obj);
                object datalist = (object)irregularityIncident;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
        private void DeleteIrregularityIncident(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        public object GetRecord()
        {

            object IrregularityEvent = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    IrregularityIncident theobj = new IrregularityIncident();
                    object obj = (object)theobj;
                    IrregularityEvent = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return IrregularityEvent;
        }
    }
}
