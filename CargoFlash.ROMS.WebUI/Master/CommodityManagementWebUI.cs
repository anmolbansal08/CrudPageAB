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
    public class CommodityManagementWebUI : BaseWebUISecureObject
    {
        public CommodityManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "Commodity";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationwebUI = new ApplicationWebUI();
                applicationwebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationwebUI.ErrorMessage;
            }

        }

        public CommodityManagementWebUI(Page PageContext)
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
                this.MyAppID = "Commodity";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public object GetRecordCommodity()
        {
            object commodity = null;

            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        Commodity gpList = new Commodity();
                        object obj = (object)gpList;
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        commodity = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return commodity;
        }

        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "CommodityCode";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordCommodity();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);

                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordCommodity();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordCommodity();
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
                            htmlFormAdapter.objFormData = GetRecordCommodity();
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
        }

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

        public override void DoPostBack()
        {
            try
            {

                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveCommodity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveCommodity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateCommodity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteCommodity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void CreateGrid(StringBuilder Container)
        {

            try
            {
                using (Grid c = new Grid())
                {


                    c.PageName = this.MyPageName;
                    c.PrimaryID = this.MyPrimaryID;
                    c.ModuleName = this.MyModuleID;
                    c.AppsName = this.MyAppID;
                    c.CommandButtonNewText = "New Commodity";
                    c.FormCaptionText = "Commodity";
                    c.ServiceModuleName = this.MyModuleID;

                    c.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    c.Column = new List<GridColumn>();
                    c.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity Code", DataType = GridDataType.String.ToString() });
                    c.Column.Add(new GridColumn { Field = "CommodityDescription", Title = "Description", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= CommodityDescription #\">#= CommodityDescription #</span>" });
                    c.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    c.Column.Add(new GridColumn { Field = "Text_InsurancedCommodity", Title = "Insurance Commodity", DataType = GridDataType.String.ToString() });
                    c.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
                    c.Column.Add(new GridColumn { Field = "UpdatedOn", Title = "Updated On", DataType = GridDataType.Date.ToString() });
                    c.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        private void SaveCommodity()
        {
            try
            {
                List<Commodity> listCommodity = new List<Commodity>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                string val = string.Empty;
                var Commodity = new Commodity
                {
                    SNo = 1,
                    CommoditySubGroupSNo =FormElement["CommoditySubGroupSNo"],
                    SubGroupName = FormElement["Text_CommoditySubGroupSNo"],
                    CommodityCode = FormElement["CommodityCode"],
                    CommodityDescription = FormElement["CommodityDescription"],
                    DensityGroupSNo =FormElement["DensityGroupSNo"],
                    GroupName = FormElement["Text_DensityGroupSNo"] ,
                    IsHeavyWeightExempt = FormElement["IsHeavyWeightExempt"] == "0",
                    IsGeneral = FormElement["IsGeneral"] == "0",
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CommodityClass = (FormElement["CommodityClass"]).ToString(),
                    SHCSNo = FormElement["SHCSNo"],
                    InsurancedCommodity = FormElement["InsurancedCommodity"] == "0" ? true : false,// Added By Pankaj Kumar Ishwar on 07-02-2018
                    InsuranceCategory = string.IsNullOrEmpty(FormElement["InsuranceCategory"]) == true ? 0 : Convert.ToInt16(FormElement["InsuranceCategory"]),// Added By Pankaj Kumar Ishwar on 07-02-2018
                    Text_InsuranceCategory = string.IsNullOrEmpty(FormElement["Text_InsuranceCategory"]) == true ? "" : FormElement["Text_InsuranceCategory"].ToString(),// Added By Pankaj Kumar Ishwar on 07-02-2018
                    MinimumChargeableWeight = string.IsNullOrEmpty(FormElement["MinimumChargeableWeight"]) == true ? 0 : Convert.ToDecimal(FormElement["MinimumChargeableWeight"]),// Added By DEVENDRA SINGH  ON 05-07-2018 
                };

                listCommodity.Add(Commodity);
                object datalist = (object)listCommodity;
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

        private void UpdateCommodity(string RecordID)
        {
            try
            {
                List<Commodity> listCommodity = new List<Commodity>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                int number = 0;
                var Commodity = new Commodity
                {
                    SNo = Convert.ToInt32(RecordID),
                    CommoditySubGroupSNo = FormElement["CommoditySubGroupSNo"],
                    SubGroupName = FormElement["Text_CommoditySubGroupSNo"],
                    CommodityCode = System.Web.HttpContext.Current.Request["CommodityCode"],
                    CommodityDescription = System.Web.HttpContext.Current.Request["CommodityDescription"],
                    DensityGroupSNo = FormElement["DensityGroupSNo"],
                    GroupName = FormElement["Text_DensityGroupSNo"],
                    IsHeavyWeightExempt = FormElement["IsHeavyWeightExempt"] == "0",
                    IsGeneral = FormElement["IsGeneral"] == "0",
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CommodityClass = (FormElement["CommodityClass"]).ToString(),
                    SHCSNo = FormElement["SHCSNo"],
                    InsurancedCommodity = FormElement["InsurancedCommodity"] == "0" ? true : false,// Added By Pankaj Kumar Ishwar on 07-02-2018
                    InsuranceCategory = string.IsNullOrEmpty(FormElement["InsuranceCategory"]) == true ? 0 : Convert.ToInt16(FormElement["InsuranceCategory"]),// Added By Pankaj Kumar Ishwar on 07-02-2018
                    Text_InsuranceCategory = string.IsNullOrEmpty(FormElement["Text_InsuranceCategory"]) == true ? "" : FormElement["Text_InsuranceCategory"].ToString(),// Added By Pankaj Kumar Ishwar on 07-02-2018
                    MinimumChargeableWeight = string.IsNullOrEmpty(FormElement["MinimumChargeableWeight"]) == true ? 0 : Convert.ToDecimal(FormElement["MinimumChargeableWeight"]),// Added By DEVENDRA SINGH  ON 05-07-2018 
                };
                listCommodity.Add(Commodity);
                object datalist = (object)listCommodity;
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

        private void DeleteCommodity(string RecordID)
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
