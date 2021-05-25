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
using CargoFlash.Cargo.Model.Rate;
using System.Collections;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.WebUI;
using System.Web;
using System.Web.UI.WebControls;

namespace CargoFlash.Cargo.WebUI.Rate
{
    public class ManageTactRateManagementWebUI : BaseWebUISecureObject
    {
        public ManageTactRateManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "ManageTactRate";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public ManageTactRateManagementWebUI(Page PageContext)
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
                this.MyAppID = "ManageTactRate";
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
                    StringBuilder strf = new StringBuilder();
                    htmlFormAdapter.Ischildform = true;
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "RefNo";
                    switch (DisplayMode)
                    {

                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divTactRateSlab' validateonsubmit='true'><span id='spnTactRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnTactRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTactRateSlab' validateonsubmit='true' style='text-align: center;' border=1 class='WebFormTable' ></table></span></div>");
                            //container.Append("<div id='divTactRateSlab'><span id='spnTactRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTactRateSlabSNo' name='hdnTactRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTactRateSlab'></table></span></div>");
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordManageTactRate();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<div id='divTactRateSlab' validateonsubmit='true'><span id='spnTactRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTactRateSlabSNo' name='hdnTactRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTactRateSlab' validateonsubmit='true' border=1 class='WebFormTable'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordManageTactRate();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<div id='divTactRateSlab' validateonsubmit='true'><span id='spnTactRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTactRateSlabSNo' name='hdnTactRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTactRateSlab' validateonsubmit='true' border=1 class='WebFormTable'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeReadView:

                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordManageTactRate();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<div id='divTactRateSlab'><span id='spnTactRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTactRateSlabSNo' name='hdnTactRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTactRateSlab' border=1 class='WebFormTable'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<div id='divTactRateSlab'><span id='spnTactRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTactRateSlabSNo' name='hdnTactRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTactRateSlab'></table></span></div>");
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
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
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
                        //case DisplayModeDelete:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
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

                    g.CommandButtonNewText = "New Manage TACT Rate";
                    g.FormCaptionText = "Manage TACT Rate";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "RefNo", Title = "ReferenceNumber", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OriginSNo", Title = "Origin", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_DestinationSNo", Title = "Destination", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CarrierCode", Title = "CarrierCode", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_CommoditySNo", Title = "Commodity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_CurrencyCode", Title = "Currency Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ExpiryDate", Title = "Expiry Date", DataType = GridDataType.DateTime.ToString(), Template = "# if(ExpiryDate==null) {# # } else {# #= kendo.toString(new Date(data.ExpiryDate.getTime() + data.ExpiryDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                    //g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidTo==null) {# # } else {# #= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });
                    //g.Column.Add(new GridColumn { Field = "Text_Status", Title = "Status", DataType = GridDataType.String.ToString() });

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
                        SaveManageTactRate();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateManageTactRate(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        private void SaveManageTactRate()
        {
            try
            {
                List<ManageTactRate> listManageTactRate = new List<ManageTactRate>();
                List<TactULDTrans> listULDtrans = new List<TactULDTrans>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                for (int count = 1; count <= 10; count++)
                {
                    //SNo,OfficeSNo,AccountSNo,IsDomestic,Unit,CommissionType,CommissionAmount,IncentiveType,IncentiveAmount,NetNet,ValidFrom,ValidTo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn
                    //if(FormElement["chk"+count]=="1")

                    //{            
                    if (FormElement["chk" + count] == "1")
                    {
                        listULDtrans.Add(new TactULDTrans()
                        {

                            ULDNo = count,
                            ULDCode = (FormElement["lblULDCode" + count]),
                            ULDWeight = Convert.ToInt32(FormElement["ChargeableWeight" + count]),
                            ULDRate = Convert.ToInt32(FormElement["txtUldRate" + count]),
                            ULDChk = FormElement["chk" + count] == "1",

                        }
                        );
                    }
                }



                var ManageTactRate = new ManageTactRate
                {
                    SNo = 0,
                    Text_OriginSNo = (FormElement["Text_OriginSNo"] == "" ? "0" : FormElement["Text_OriginSNo"]),
                    OriginNumeric = Convert.ToInt32(FormElement["OriginNumeric"] == "" ? "0" : FormElement["OriginNumeric"]),
                    Text_OriginCountrySNo = (FormElement["Text_OriginCountrySNo"] == "" ? "0" : FormElement["Text_OriginCountrySNo"]),
                    Text_DestinationSNo = (FormElement["Text_DestinationSNo"] == "" ? "0" : FormElement["Text_DestinationSNo"]),
                    DestinationNumeric = Convert.ToInt32(FormElement["DestinationNumeric"] == "" ? "0" : FormElement["DestinationNumeric"]),

                    Text_DestinationCountrySNo = (FormElement["Text_DestinationCountrySNo"] == "" ? "0" : FormElement["Text_DestinationCountrySNo"]),
                    Text_Category = (FormElement["Text_Category"] == "" ? "0" : FormElement["Text_Category"]),
                    Text_AreaSNo = (FormElement["Text_AreaSNo"] == "" ? "0" : FormElement["Text_AreaSNo"]),
                    Note = FormElement["Note"] == "" ? "0" : FormElement["Note"],
                    CarrierCode = FormElement["CarrierCode"] == "" ? "" : FormElement["CarrierCode"],

                    RateTypeSNo = Convert.ToInt32(FormElement["RateTypeSNo"] == "" ? "0" : FormElement["RateTypeSNo"]),
                    Text_CommoditySNo = (FormElement["CommoditySNo"] == "" ? "0" : FormElement["CommoditySNo"]),
                    ChangeIndicator = (FormElement["ChangeIndicator"] == "" ? "0" : FormElement["ChangeIndicator"]),
                    IntendedDate = DateTime.Parse(FormElement["IntendedDate"]),
                    ActualDate = DateTime.Parse(FormElement["ActualDate"]),
                    ExpiryDate = DateTime.Parse(FormElement["ExpiryDate"]),
                    Text_GovernmentStatus = (FormElement["Text_GovernmentStatus"] == "" ? "0" : FormElement["Text_GovernmentStatus"]),
                    OriginGateway = (FormElement["OriginGateway"] == "" ? "0" : FormElement["OriginGateway"]),
                    DestinationGateway = (FormElement["DestinationGateway"] == "" ? "0" : FormElement["DestinationGateway"]),
                    UniqueAreaCode = (FormElement["UniqueAreaCode"] == "" ? "0" : FormElement["UniqueAreaCode"]),
                    SourceCode = (FormElement["SourceCode"] == "" ? "0" : FormElement["SourceCode"]),
                    Text_ActionCode = (FormElement["Text_ActionCode"] == "" ? "0" : FormElement["Text_ActionCode"]),
                    ConstrunctionAllowed = (FormElement["ConstrunctionAllowed"] == "" ? "0" : FormElement["ConstrunctionAllowed"]),
                    CategorySortIndicator = (FormElement["CategorySortIndicator"] == "" ? "0" : FormElement["CategorySortIndicator"]),
                    IdentificationCode = (FormElement["IdentificationCode"] == "" ? "0" : FormElement["IdentificationCode"]),
                    Text_CurrencyCode = (FormElement["Text_CurrencyCode"] == "" ? "0" : FormElement["Text_CurrencyCode"]),
                    Text_DirectionCode = (FormElement["Text_DirectionCode"] == "" ? "0" : FormElement["Text_DirectionCode"]),
                    Text_ProportionalCode = (FormElement["Text_ProportionalCode"] == "" ? "0" : FormElement["Text_ProportionalCode"]),
                    Text_DecimalPlace = (FormElement["Text_DecimalPlace"] == "" ? "0" : FormElement["Text_DecimalPlace"]),
                    Rate = Convert.ToDecimal(FormElement["Rate"] == "" ? "0" : FormElement["Rate"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    /////slab information//////////
                    Minimum = Convert.ToDecimal(FormElement["Minimum"] == "" ? "0" : FormElement["Minimum"]),
                    Normal = Convert.ToDecimal(FormElement["Normal"] == "" ? "0" : FormElement["Normal"]),
                    SlabValue1 = Convert.ToDecimal(FormElement["SlabValue1"] == "" ? "0" : FormElement["SlabValue1"]),
                    SlabValue2 = Convert.ToDecimal(FormElement["SlabValue2"] == "" ? "0" : FormElement["SlabValue2"]),
                    SlabValue3 = Convert.ToDecimal(FormElement["SlabValue3"] == "" ? "0" : FormElement["SlabValue3"]),
                    SlabValue4 = Convert.ToDecimal(FormElement["SlabValue4"] == "" ? "0" : FormElement["SlabValue4"]),
                    SlabValue5 = Convert.ToDecimal(FormElement["SlabValue5"] == "" ? "0" : FormElement["SlabValue5"]),
                    SlabValue6 = Convert.ToDecimal(FormElement["SlabValue6"] == "" ? "0" : FormElement["SlabValue6"]),
                    ULDClass = Convert.ToInt32(FormElement["ULDClass"] == "" ? "0" : FormElement["ULDClass"]),
                    Text_ULDWeight = Convert.ToDecimal(FormElement["ULDWeight"] == "" ? "0" : FormElement["ULDWeight"]),
                    TactULDTrans = listULDtrans,

                };
                listManageTactRate.Add(ManageTactRate);
                object datalist = (object)listManageTactRate;
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
        private void UpdateManageTactRate(int RecordID)
        {

            try
            {
                List<ManageTactRate> listManageTactRate = new List<ManageTactRate>();
                List<TactULDTrans> listULDtrans = new List<TactULDTrans>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;


                for (int count = 1; count <= 10; count++)
                {
                    //SNo,OfficeSNo,AccountSNo,IsDomestic,Unit,CommissionType,CommissionAmount,IncentiveType,IncentiveAmount,NetNet,ValidFrom,ValidTo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn
                    //if(FormElement["chk"+count]=="1")

                    //{            
                    if (FormElement["chk" + count] == "1")
                    {
                        listULDtrans.Add(new TactULDTrans()
                        {

                            ULDNo = count,
                            ULDCode = (FormElement["lblULDCode" + count]),
                            ULDWeight = Convert.ToInt32(FormElement["ChargeableWeight" + count]),
                            ULDRate = Convert.ToInt32(FormElement["txtUldRate" + count]),
                            ULDChk = FormElement["chk" + count] == "1",

                        }
                        );
                    }
                }

                var ManageTactRate = new ManageTactRate
                {
                    SNo = Convert.ToInt32(RecordID),
                    Text_OriginSNo = (FormElement["Text_OriginSNo"] == "" ? "0" : FormElement["Text_OriginSNo"]),
                    OriginNumeric = Convert.ToInt32(FormElement["OriginNumeric"] == "" ? "0" : FormElement["OriginNumeric"]),
                    Text_OriginCountrySNo = (FormElement["Text_OriginCountrySNo"] == "" ? "0" : FormElement["Text_OriginCountrySNo"]),
                    Text_DestinationSNo = (FormElement["Text_DestinationSNo"] == "" ? "0" : FormElement["Text_DestinationSNo"]),
                    DestinationNumeric = Convert.ToInt32(FormElement["DestinationNumeric"] == "" ? "0" : FormElement["DestinationNumeric"]),

                    Text_DestinationCountrySNo = (FormElement["Text_DestinationCountrySNo"] == "" ? "0" : FormElement["Text_DestinationCountrySNo"]),
                    Text_Category = (FormElement["Text_Category"] == "" ? "0" : FormElement["Text_Category"]),
                    Text_AreaSNo = (FormElement["Text_AreaSNo"] == "" ? "0" : FormElement["Text_AreaSNo"]),
                    Note = FormElement["Note"] == "" ? "0" : FormElement["Note"],
                    CarrierCode = FormElement["CarrierCode"] == "" ? "" : FormElement["CarrierCode"],

                    RateTypeSNo = Convert.ToInt32(FormElement["RateTypeSNo"] == "" ? "0" : FormElement["RateTypeSNo"]),
                    Text_CommoditySNo = (FormElement["CommoditySNo"] == "" ? "0" : FormElement["CommoditySNo"]),
                    ChangeIndicator = (FormElement["ChangeIndicator"] == "" ? "0" : FormElement["ChangeIndicator"]),
                    IntendedDate = DateTime.Parse(FormElement["IntendedDate"]),
                    ActualDate = DateTime.Parse(FormElement["ActualDate"]),
                    ExpiryDate = DateTime.Parse(FormElement["ExpiryDate"]),
                    Text_GovernmentStatus = (FormElement["Text_GovernmentStatus"] == "" ? "0" : FormElement["Text_GovernmentStatus"]),
                    OriginGateway = (FormElement["OriginGateway"] == "" ? "0" : FormElement["OriginGateway"]),
                    DestinationGateway = (FormElement["DestinationGateway"] == "" ? "0" : FormElement["DestinationGateway"]),
                    UniqueAreaCode = (FormElement["UniqueAreaCode"] == "" ? "0" : FormElement["UniqueAreaCode"]),
                    SourceCode = (FormElement["SourceCode"] == "" ? "0" : FormElement["SourceCode"]),
                    Text_ActionCode = (FormElement["Text_ActionCode"] == "" ? "0" : FormElement["Text_ActionCode"]),
                    ConstrunctionAllowed = (FormElement["ConstrunctionAllowed"] == "" ? "0" : FormElement["ConstrunctionAllowed"]),
                    CategorySortIndicator = (FormElement["CategorySortIndicator"] == "" ? "0" : FormElement["CategorySortIndicator"]),
                    IdentificationCode = (FormElement["IdentificationCode"] == "" ? "0" : FormElement["IdentificationCode"]),
                    Text_CurrencyCode = (FormElement["Text_CurrencyCode"] == "" ? "0" : FormElement["Text_CurrencyCode"]),
                    Text_DirectionCode = (FormElement["Text_DirectionCode"] == "" ? "0" : FormElement["Text_DirectionCode"]),
                    Text_ProportionalCode = (FormElement["Text_ProportionalCode"] == "" ? "0" : FormElement["Text_ProportionalCode"]),
                    Text_DecimalPlace = (FormElement["Text_DecimalPlace"] == "" ? "0" : FormElement["Text_DecimalPlace"]),
                    Rate = Convert.ToDecimal(FormElement["Rate"] == "" ? "0" : FormElement["Rate"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    /////slab information//////////
                    Minimum = Convert.ToDecimal(FormElement["Minimum"] == "" ? "0" : FormElement["Minimum"]),
                    Normal = Convert.ToDecimal(FormElement["Normal"] == "" ? "0" : FormElement["Normal"]),
                    SlabValue1 = Convert.ToDecimal(FormElement["SlabValue1"] == "" ? "0" : FormElement["SlabValue1"]),
                    SlabValue2 = Convert.ToDecimal(FormElement["SlabValue2"] == "" ? "0" : FormElement["SlabValue2"]),
                    SlabValue3 = Convert.ToDecimal(FormElement["SlabValue3"] == "" ? "0" : FormElement["SlabValue3"]),
                    SlabValue4 = Convert.ToDecimal(FormElement["SlabValue4"] == "" ? "0" : FormElement["SlabValue4"]),
                    SlabValue5 = Convert.ToDecimal(FormElement["SlabValue5"] == "" ? "0" : FormElement["SlabValue5"]),
                    SlabValue6 = Convert.ToDecimal(FormElement["SlabValue6"] == "" ? "0" : FormElement["SlabValue6"]),
                    ULDClass = Convert.ToInt32(FormElement["ULDClass"] == "" ? "0" : FormElement["ULDClass"]),
                    Text_ULDWeight = Convert.ToDecimal(FormElement["ULDWeight"] == "" ? "0" : FormElement["ULDWeight"]),
                    TactULDTrans = listULDtrans,

                };
                listManageTactRate.Add(ManageTactRate);
                object datalist = (object)listManageTactRate;
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
        public object GetRecordManageTactRate()
        {
            object ManageTactRate = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ManageTactRate ManageClassRateList = new ManageTactRate();
                    object obj = (object)ManageClassRateList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    ManageTactRate = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return ManageTactRate;
        }
    }
}
