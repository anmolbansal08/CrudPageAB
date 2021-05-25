using CargoFlash.Cargo.Model.Master;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Rate
{
    public class RateDetailsHistoryManagementWebUI : BaseWebUISecureObject
    {
        public RateDetailsHistoryManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "RateDetailsHistory";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public RateDetailsHistoryManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "RateDetailsHistory";
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
                    htmlFormAdapter.HeadingColumnName = "SpotName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetOtherChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetOtherChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetOtherChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetOtherChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
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
                        case DisplayModeDuplicate:
                            BuildFormView(this.DisplayMode, container);
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
        private StringBuilder CreateGrid(StringBuilder container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Other Charges";
                    g.FormCaptionText = "Charges";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OtherCharges", Title = "Other Charges", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ChargeType", Title = "Charge Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PaymentType", Title = "Payment Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Currency", Title = "Currency", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(container);
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
                        SaveOtherCharges();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveOtherCharges();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateOtherCharges(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteOtherCharges(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void SaveOtherCharges()
        {
            try
            {
                List<OtherCharges> listOtherChargesDetails = new List<OtherCharges>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                List<OtherChargesRemarks> listRemarks = new List<OtherChargesRemarks>();
                List<OtherChargesSlabParameter> listSlabs = new List<OtherChargesSlabParameter>();
                List<OtherChargesRateParameter> listOtherChargesRateParameter = new List<OtherChargesRateParameter>();
                listRemarks.Add(new OtherChargesRemarks { Remarks = FormElement["tblRemarks_Remarks_1"] });
                if (Convert.ToInt16(FormElement["ChargeType"]) == 1 || Convert.ToInt16(FormElement["ChargeType"]) == 2 || Convert.ToInt16(FormElement["ChargeType"]) == 4 || Convert.ToInt16(FormElement["ChargeType"]) == 5)
                {
                    int SlabCount = Convert.ToInt32(FormElement["SlabCount"]);
                    for (int i = 1; i <= SlabCount; i++)
                    {
                        listSlabs.Add(new OtherChargesSlabParameter() { SNo = i, SlabSNo = Convert.ToInt32(FormElement["tblRateBase_SNo_" + i]), RateClassSNo = Convert.ToInt32(FormElement["tblRateBase_RateClassSNo_" + i]), RateValue = Convert.ToDecimal(FormElement["tblRateBase_RateValue_" + i]) });
                    }
                }
                var rateParameters = new OtherChargesRateParameter
                {
                    SNo = 0,
                    IssueCarrierSNo = Convert.ToString(FormElement["IssueCarrierSNo"]),
                    IEIssueCarrier = Convert.ToString(FormElement["IEIssueCarrier"]) == "1" ? true : false,
                    FlightSNo = Convert.ToString(FormElement["FlightSNo"]),
                    IEFlight = Convert.ToString(FormElement["IEFlight"]) == "1" ? true : false,
                    StartTime = Convert.ToInt32(FormElement["StartTime"] == "" ? "0" : FormElement["StartTime"]),
                    EndTime = Convert.ToInt32(FormElement["EndTime"] == "" ? "0" : FormElement["EndTime"]),
                    IEEtd = Convert.ToString(FormElement["IEEtd"]) == "1" ? true : false,
                    Days = Convert.ToString(FormElement["Days"]),
                    IEDays = Convert.ToString(FormElement["IEDays"]) == "1" ? true : false,
                    TransitStationsSNo = Convert.ToString(FormElement["TransitStationsSNo"]),
                    IETransitStation = Convert.ToString(FormElement["IETransitStation"]) == "1" ? true : false,
                    ProductSNo = Convert.ToString(FormElement["ProductSNo"]),
                    IEProduct = Convert.ToString(FormElement["IEProduct"]) == "1" ? true : false,
                    AgentGroupSNo = Convert.ToString(FormElement["AgentGroupSNo"]),
                    IEAgentGroup = Convert.ToString(FormElement["IEAgentGroup"]) == "1" ? true : false,
                    CommoditySNo = Convert.ToString(FormElement["CommoditySNo"]),
                    IECommodity = Convert.ToString(FormElement["IECommodity"]) == "1" ? true : false,
                    AccountSNo = Convert.ToString(FormElement["AccountSNo"]),
                    IEAccount = Convert.ToString(FormElement["IEAccount"]) == "1" ? true : false,
                    SHCSNo = Convert.ToString(FormElement["SHCSNo"]),
                    IESHCS = Convert.ToString(FormElement["IESHCS"]) == "1" ? true : false,
                    ShipperSNo = Convert.ToString(FormElement["ShipperSNo"]),
                    IEShipper = Convert.ToString(FormElement["IEShipper"]) == "1" ? true : false,
                };
                listOtherChargesRateParameter.Add(rateParameters);
                var otherCharges = new OtherCharges
                {
                    SNo = 0,
                    AirlineSNo = Convert.ToString(FormElement["AirlineSNo"].Split('-')[0]),
                    OtherChargeType = Convert.ToInt32(FormElement["Charge"]),
                    DueCarrierCodeSNo = Convert.ToString(FormElement["OCCodeSNo"].Split('-')[0]),
                    IsOtherChargeMandatory = FormElement["IsOtherChargeMandatory"] == null ? false : true,
                    IsTaxable = FormElement["IsTaxable"] == null ? false : true,
                    IsCommissionable = FormElement["IsCommissionable"] == null ? false : true,
                    OriginLevel = Convert.ToInt32(FormElement["OriginType"]),
                    DestinationLevel = Convert.ToInt32(FormElement["DestinationType"]),
                    OriginCitySNo = Convert.ToInt32(FormElement["OriginSNo"]),
                    DestinationCitySNo = Convert.ToInt32(FormElement["DestinationSNo"]),
                    CurrencySNo = Convert.ToInt32(FormElement["CurrencySNo"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"] == "" ? "31/12/9999" : FormElement["ValidTo"]),
                    Unit = Convert.ToInt16(FormElement["UOMSNo"]),
                    PaymentType = Convert.ToInt16(FormElement["PaymentType"]),
                    Status = Convert.ToInt16(FormElement["Active"]),
                    MinimumCharge = FormElement["Minimum"] == "" ? 0 : Convert.ToDecimal(FormElement["Minimum"]),
                    Charge = FormElement["ChargeText"] == "" ? 0 : Convert.ToDecimal(FormElement["ChargeText"]),
                    ChargeType = Convert.ToInt16(FormElement["ChargeType"]),
                    IsActive = true,
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    listOtherChargesRemarks = listRemarks,
                    listOtherChargesSLABParameter = listSlabs,
                    listOtherChargesRateParameter = listOtherChargesRateParameter
                };
                listOtherChargesDetails.Add(otherCharges);
                //listOtherChargesDetails.Add(region);
                object datalist = (object)listOtherChargesDetails;

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

        private object GetOtherChargesRecord()
        {
            object othercharges = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        OtherCharges otherChargesList = new OtherCharges();
                        object obj = (object)otherChargesList;
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        othercharges = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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
            return othercharges;
        }

        private void UpdateOtherCharges(int RecordID)
        {
            try
            {
                List<OtherCharges> listOtherChargesDetails = new List<OtherCharges>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                List<OtherChargesRemarks> listRemarks = new List<OtherChargesRemarks>();
                List<OtherChargesSlabParameter> listSlabs = new List<OtherChargesSlabParameter>();
                List<OtherChargesRateParameter> listOtherChargesRateParameter = new List<OtherChargesRateParameter>();
                int RemarksCount = Convert.ToInt32(FormElement["RemarksCount"]);
                for (int i = 1; i <= RemarksCount; i++)
                {
                    if (Convert.ToString(FormElement["tblRemarks_Remarks_" + i]) != null)
                        listRemarks.Add(new OtherChargesRemarks { Remarks = FormElement["tblRemarks_Remarks_" + i] });
                }
                if (Convert.ToInt16(FormElement["ChargeType"]) == 2)
                {
                    int SlabCount = Convert.ToInt32(FormElement["SlabCount"]);
                    for (int i = 1; i <= SlabCount; i++)
                    {
                        listSlabs.Add(new OtherChargesSlabParameter() { SNo = i, SlabSNo = Convert.ToInt32(FormElement["tblRateBase_SNo_" + i]), RateClassSNo = Convert.ToInt32(FormElement["tblRateBase_RateClassSNo_" + i]), RateValue = Convert.ToDecimal(FormElement["tblRateBase_RateValue_" + i]) });
                    }
                }
                var rateParameters = new OtherChargesRateParameter
                {
                    SNo = 0,
                    IssueCarrierSNo = Convert.ToString(FormElement["IssueCarrierSNo"]).TrimStart(','),
                    IEIssueCarrier = Convert.ToString(FormElement["IEIssueCarrier"]) == "1" ? true : false,
                    FlightSNo = Convert.ToString(FormElement["FlightSNo"]).TrimStart(','),
                    IEFlight = Convert.ToString(FormElement["IEFlight"]) == "1" ? true : false,
                    StartTime = Convert.ToInt32(FormElement["StartTime"] == "" ? "0" : FormElement["StartTime"]),
                    EndTime = Convert.ToInt32(FormElement["EndTime"] == "" ? "0" : FormElement["EndTime"]),
                    IEEtd = Convert.ToString(FormElement["IEEtd"]) == "1" ? true : false,
                    Days = Convert.ToString(FormElement["Days"]).TrimStart(','),
                    IEDays = Convert.ToString(FormElement["IEDays"]) == "1" ? true : false,
                    TransitStationsSNo = Convert.ToString(FormElement["TransitStationsSNo"]).TrimStart(','),
                    IETransitStation = Convert.ToString(FormElement["IETransitStation"]) == "1" ? true : false,
                    ProductSNo = Convert.ToString(FormElement["ProductSNo"]).TrimStart(','),
                    IEProduct = Convert.ToString(FormElement["IEProduct"]) == "1" ? true : false,
                    AgentGroupSNo = Convert.ToString(FormElement["AgentGroupSNo"]).TrimStart(','),
                    IEAgentGroup = Convert.ToString(FormElement["IEAgentGroup"]) == "1" ? true : false,
                    CommoditySNo = Convert.ToString(FormElement["CommoditySNo"]).TrimStart(','),
                    IECommodity = Convert.ToString(FormElement["IECommodity"]) == "1" ? true : false,
                    AccountSNo = Convert.ToString(FormElement["AccountSNo"]).TrimStart(','),
                    IEAccount = Convert.ToString(FormElement["IEAccount"]) == "1" ? true : false,
                    SHCSNo = Convert.ToString(FormElement["SHCSNo"]).TrimStart(','),
                    IESHCS = Convert.ToString(FormElement["IESHCS"]) == "1" ? true : false,
                    ShipperSNo = Convert.ToString(FormElement["ShipperSNo"]).TrimStart(','),
                    IEShipper = Convert.ToString(FormElement["IEShipper"]) == "1" ? true : false,
                };
                listOtherChargesRateParameter.Add(rateParameters);
                var otherCharges = new OtherCharges
                {
                    SNo = RecordID,
                    AirlineSNo = Convert.ToString(FormElement["AirlineSNo"].Split('-')[0]),
                    OtherChargeType = Convert.ToInt32(FormElement["Charge"]),
                    DueCarrierCodeSNo = Convert.ToString(FormElement["OCCodeSNo"].Split('-')[0]),
                    IsOtherChargeMandatory = FormElement["IsOtherChargeMandatory"] == null ? false : true,
                    IsTaxable = FormElement["IsTaxable"] == null ? false : true,
                    IsCommissionable = FormElement["IsCommissionable"] == null ? false : true,
                    OriginLevel = Convert.ToInt32(FormElement["OriginType"]),
                    DestinationLevel = Convert.ToInt32(FormElement["DestinationType"]),
                    OriginCitySNo = Convert.ToInt32(FormElement["OriginSNo"]),
                    DestinationCitySNo = Convert.ToInt32(FormElement["DestinationSNo"]),
                    CurrencySNo = Convert.ToInt32(FormElement["CurrencySNo"]),
                    ValidFrom = Convert.ToDateTime(DateTime.Now),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"] == "" ? "31/12/9999" : FormElement["ValidTo"]),
                    Unit = Convert.ToInt16(FormElement["UOMSNo"]),
                    PaymentType = Convert.ToInt16(FormElement["PaymentType"]),
                    Status = Convert.ToInt16(FormElement["Active"]),
                    MinimumCharge = FormElement["Minimum"] == "" ? 0 : Convert.ToDecimal(FormElement["Minimum"]),
                    Charge = FormElement["ChargeText"] == "" ? 0 : Convert.ToDecimal(FormElement["ChargeText"]),
                    ChargeType = Convert.ToInt16(FormElement["ChargeType"]),
                    IsActive = true,
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    listOtherChargesRemarks = listRemarks,
                    listOtherChargesSLABParameter = listSlabs,
                    listOtherChargesRateParameter = listOtherChargesRateParameter
                };
                listOtherChargesDetails.Add(otherCharges);
                //listOtherChargesDetails.Add(region);
                object datalist = (object)listOtherChargesDetails;

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

        public void DeleteOtherCharges(string RecordID)
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
