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
using CargoFlash.Cargo.Model;
using System.Collections;
using CargoFlash.Cargo.Model.Master;
using System.Web;
namespace CargoFlash.Cargo.WebUI.Master
{

    public class SpecialHandlingCodeManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordSpecialHandlingCode()
        {
            object SpecialHandlingCode = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    SpecialHandlingCode SpecialHandlingCodeList = new SpecialHandlingCode();
                    object obj = (object)SpecialHandlingCodeList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    SpecialHandlingCode = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Message: Record not found.
                }

            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return SpecialHandlingCode;
        }
        public SpecialHandlingCodeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "SpecialHandlingCode";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }

        }
        public SpecialHandlingCodeManagementWebUI(Page PageContext)
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
                this.MyAppID = "SpecialHandlingCode";
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
                    htmlFormAdapter.HeadingColumnName = "Code";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordSpecialHandlingCode();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordSpecialHandlingCode();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordSpecialHandlingCode();
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
                            htmlFormAdapter.objFormData = GetRecordSpecialHandlingCode();
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

            try
            {
                //this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveSpecialHandlingCode();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Server.Transfer(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2000), false);
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveSpecialHandlingCode();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false,2000), false);
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateSpecialHandlingCode(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteSpecialHandlingCode(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2002), false);
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

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid p = new Grid())
                {

                    p.PageName = this.MyPageName;
                    p.PrimaryID = this.MyPrimaryID;
                    p.ModuleName = this.MyModuleID;
                    p.AppsName = this.MyAppID;
                    p.CommandButtonNewText = "New Special Handling Code";
                    p.FormCaptionText = "Special Handling Code";

                    p.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    p.ServiceModuleName = this.MyModuleID;
                    p.Column = new List<GridColumn>();
                    p.Column.Add(new GridColumn { Field = "Code", Title = "Code", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "Description", Title = "Description", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "DGR", Title = "DGR", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "ShownInNOTOC", Title = "Special Load", DataType = GridDataType.String.ToString() });
                    //p.Column.Add(new GridColumn { Field = "Express", Title = "Express", DataType = GridDataType.String.ToString() });
                    //p.Column.Add(new GridColumn { Field = "HeavyWeightExempt", Title = "Heavy Weight Exempt", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "TemperatureControlled", Title = "Temperature Controlled", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "ExpressDelivery", Title = "Express Delivery", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "Text_DGClass", Title = "DG Class", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "Divisions", Title = "Division", DataType = GridDataType.String.ToString() });
                    //p.Column.Add(new GridColumn { Field = "SHCStatement", Title = "SHCStatement", DataType = GridDataType.String.ToString() });
                    //p.Column.Add(new GridColumn { Field = "MandatoryStatement", Title = "MandatoryStatement", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    p.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

            return Container;

        }

        private void SaveSpecialHandlingCode()
        {
            try
            {
                List<SpecialHandlingCode> listSpecialHandlingCode = new List<SpecialHandlingCode>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var SpecialHandlingCode = new SpecialHandlingCode
                {
                    Code = Convert.ToString(FormElement["Code"].ToUpper()),
                    IsDGR = FormElement["IsDGR"] == "0",
                    Description = Convert.ToString(FormElement["Description"]),
                    IsShownInNOTOC = FormElement["IsShownInNOTOC"] == "0",
                    IsExpress = false,//FormElement["IsExpress"] == "0",
                    IsHeavyWeightExempt = false, //FormElement["IsHeavyWeightExempt"] == "0",
                    Priority = Convert.ToDecimal(FormElement["Priority"] == string.Empty ? "0.00" : FormElement["Priority"]),
                    IsActive = FormElement["IsActive"] == "0",
                    IsTemperatureControlled = FormElement["IsTemperatureControlled"] == "0",
                    IsExpressDelivery = FormElement["IsExpressDelivery"] == null ? false : true,
                    DGClass = FormElement["DGClass"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["DGClass"]),
                    Divisions = Convert.ToString(FormElement["Divisions"]),
                    SHCStatement = Convert.ToString(FormElement["SHCStatement"]),
                    MandatoryStatement = Convert.ToString(FormElement["MandatoryStatement"]),
                    StatementLabel = Convert.ToString(FormElement["StatementLabel"]),
                    PackingInstructionLabel = Convert.ToString(FormElement["PackingInstructionLabel"]),
                    IsAllowLateAcceptance = FormElement["IsAllowLateAcceptance"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),

                };


                listSpecialHandlingCode.Add(SpecialHandlingCode);
                object datalist = (object)listSpecialHandlingCode;
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
        private void UpdateSpecialHandlingCode(int RecordID)
        {

            try
            {
                List<SpecialHandlingCode> listSpecialHandlingCode = new List<SpecialHandlingCode>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var SpecialHandlingCode = new SpecialHandlingCode
                {
                    SNo = Convert.ToInt32(RecordID),
                    Code = Convert.ToString(FormElement["Code"].ToUpper()),
                    IsDGR = FormElement["IsDGR"] == "0",
                    Description = Convert.ToString(FormElement["Description"]),
                    IsShownInNOTOC = FormElement["IsShownInNOTOC"] == "0",
                    IsExpress = false,//  FormElement["IsExpress"] == "0",
                    IsHeavyWeightExempt = false,// FormElement["IsHeavyWeightExempt"] == "0",
                    Priority = Convert.ToDecimal(FormElement["Priority"] == string.Empty ? "0.00" : FormElement["Priority"]),
                    IsActive = FormElement["IsActive"] == "0",
                    IsTemperatureControlled = FormElement["IsTemperatureControlled"] == "0",
                    IsExpressDelivery = FormElement["IsExpressDelivery"] == null ? false : true,
                    // IsExpressDelivery = FormElement["ExpressDelivery"] == "0",
                    DGClass = FormElement["DGClass"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["DGClass"]),
                    Divisions = Convert.ToString(FormElement["Divisions"]),
                    SHCStatement = Convert.ToString(FormElement["SHCStatement"]),
                    MandatoryStatement = Convert.ToString(FormElement["MandatoryStatement"]),
                    StatementLabel = Convert.ToString(FormElement["StatementLabel"]),
                    PackingInstructionLabel = Convert.ToString(FormElement["PackingInstructionLabel"]),
                    IsAllowLateAcceptance = FormElement["IsAllowLateAcceptance"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listSpecialHandlingCode.Add(SpecialHandlingCode);
                object datalist = (object)listSpecialHandlingCode;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {

                    //ErrorNumer
                    //Error Message
                }
                //}
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }


        }

        private void DeleteSpecialHandlingCode(string RecordID)
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

