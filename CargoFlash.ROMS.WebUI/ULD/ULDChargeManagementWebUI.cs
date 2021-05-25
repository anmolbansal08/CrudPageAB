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
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.WebUI.ULD
{
    public class ULDChargeManagementWebUI : BaseWebUISecureObject
    {
        public object GetULDChargesRecord()
        {
            object Charges = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ULD_Charge ChargesList = new ULD_Charge();
                    object obj = (object)ChargesList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    Charges = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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
            return Charges;
        }
        public ULDChargeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDCharge";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public ULDChargeManagementWebUI(Page PageContext)
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
                this.MyAppID = "ULDCharge";
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
                    htmlFormAdapter.HeadingColumnName = "ULDCharge";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetULDChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetULDChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetULDChargesRecord();
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
                            htmlFormAdapter.objFormData = GetULDChargesRecord();
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
            return container;
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
                    g.CommandButtonNewText = "Create New Charge";
                    g.FormCaptionText = "ULD Charge";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AgentName", Title = "Agent Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "uldname", Title = "ULD Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CountryName", Title = "Country", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "currencycode", Title = "Currency", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FreeType", Title = "Free Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FreePeriodsDays", Title = "Free Period", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReferenceNo", Title = "Reference No", DataType = GridDataType.String.ToString() });
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
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveULDCharge();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveULDCharge();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateULDCharge(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeDelete:
                        DeleteULDCharge(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        private void SaveULDCharge()
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                List<ULD_Charge> listULDCharge = new List<ULD_Charge>();

                var FormElement = System.Web.HttpContext.Current.Request.Form;

                string ULD = FormElement["ULDType"];

                string[] SULD = ULD.Split(',');
                for (int i = 0; i < SULD.Length; i++)
                {

                    var ULD_Charge = new ULD_Charge
                    {
                        SNo = Convert.ToInt32(1),
                        AgentName = FormElement["AgentName"] == "" ? 0 : Convert.ToInt32(FormElement["AgentName"]),
                        ULDType = SULD[i],
                        TarriffTo = FormElement["TarriffTo"] == "" ? 0 : Convert.ToInt32(FormElement["TarriffTo"]),
                        AirlineName = FormElement["AirlineName"] == "" ? 0 : Convert.ToInt32(FormElement["AirlineName"]),
                        SDate = Convert.ToString(FormElement["SDate"]),
                        Currency = FormElement["Currency"] == "" ? 0 : Convert.ToInt32(FormElement["Currency"]),
                        FreeType = FormElement["FreeType"] == "" ? 0 : Convert.ToInt32(FormElement["FreeType"]),
                        FreePeriod = FormElement["FreePeriod"] == "" ? 0 : Convert.ToInt32(FormElement["FreePeriod"]),
                        DemurrageCharge = FormElement["DemurrageCharge"] == "" ? 0 : Convert.ToDecimal(FormElement["DemurrageCharge"]),
                        NonReturnDays = FormElement["NonReturnDays"] == "" ? 0 : Convert.ToInt32(FormElement["NonReturnDays"]),
                        NoReturnValues = FormElement["NoReturnValues"] == "" ? 0 : Convert.ToInt32(FormElement["NoReturnValues"]),
                        TAX = FormElement["TAX"] == "" ? 0 : Convert.ToInt32(FormElement["TAX"]),
                        Owner = FormElement["Owner"] == "" ? 0 : Convert.ToInt32(FormElement["Owner"]),
                        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        UpdatedBy = "0",
                        IsActive = FormElement["IsActive"] == "0" ? true : false,
                        country = FormElement["country"] == "" ? "0" : FormElement["country"].ToString(),
                        City = FormElement["City"] == "" ? "0" : FormElement["City"].ToString(),
                        endDate = FormElement["endDate"]
                    };
                    listULDCharge.Add(ULD_Charge);
                }
                object datalist = (object)listULDCharge;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        private void UpdateULDCharge(string RecordID)
        {
            try
            {
                List<ULD_Charge> listULDCharge = new List<ULD_Charge>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ULD_Charge = new ULD_Charge
                {
                    SNo = Convert.ToInt32(RecordID),
                    AgentName = FormElement["AgentName"] == "" ? 0 : Convert.ToInt32(FormElement["AgentName"]),
                    ULDType = FormElement["ULDType"],
                    TarriffTo = FormElement["TarriffTo"] == "" ? 0 : Convert.ToInt32(FormElement["TarriffTo"]),
                    AirlineName = FormElement["AirlineName"] == "" ? 0 : Convert.ToInt32(FormElement["AirlineName"]),
                    SDate = Convert.ToString(FormElement["SDate"]),
                    Currency = FormElement["Currency"] == "" ? 0 : Convert.ToInt32(FormElement["Currency"]),
                    FreeType = FormElement["FreeType"] == "" ? 0 : Convert.ToInt32(FormElement["FreeType"]),
                    FreePeriod = FormElement["FreePeriod"] == "" ? 0 : Convert.ToInt32(FormElement["FreePeriod"]),
                    DemurrageCharge = FormElement["DemurrageCharge"] == "" ? 0 : Convert.ToDecimal(FormElement["DemurrageCharge"]),
                    NonReturnDays = FormElement["NonReturnDays"] == "" ? 0 : Convert.ToInt32(FormElement["NonReturnDays"]),
                    NoReturnValues = FormElement["NoReturnValues"] == "" ? 0 : Convert.ToInt32(FormElement["NoReturnValues"]),
                    TAX = FormElement["TAX"] == "" ? 0 : Convert.ToInt32(FormElement["TAX"]),
                    Owner = FormElement["Owner"] == "" ? 0 : Convert.ToInt32(FormElement["Owner"]),
                    CreatedBy = "0",
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsActive = FormElement["IsActive"] == "0" ? true : false,
                    Active = FormElement["Active"],
                    country = FormElement["country"] == "" ? "0" : FormElement["country"].ToString(),
                    City = FormElement["City"] == "" ? "0" : FormElement["City"].ToString(),
                    endDate = FormElement["endDate"]


                };
                listULDCharge.Add(ULD_Charge);
                object datalist = (object)listULDCharge;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
        private void DeleteULDCharge(string RecordID)
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
