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
    public class SpotRateManagementWebUI : BaseWebUISecureObject
    {
        public SpotRateManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "SpotRate";
                this.MyPrimaryID = "SNo";
                this.MyUserID = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public SpotRateManagementWebUI(Page PageContext)
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
                this.MyAppID = "SpotRate";
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
                    htmlFormAdapter.HeadingColumnName = "Text_RateAdhocType";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetSpotRateRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divFlightInfo'><span id='spnFlightInfo'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblFlightInfo'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            container.Append("<div id='divSpotCode'><span id='spnspotCode'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblSpotCode'></table></span></div>");

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetSpotRateRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divFlightInfo'><span id='spnFlightInfo'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblFlightInfo'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");

                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetSpotRateRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate' validateonsubmit='true'></table></span></div>");
                            container.Append("<div id='divFlightInfo'><span id='spnFlightInfo'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblFlightInfo' validateonsubmit='true'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            container.Append("<div id='divSpotCode'><span id='spnspotCode'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblSpotCode'></table></span></div>");

                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate' validateonsubmit='true'></table></span></div>");
                            container.Append("<div id='divFlightInfo'><span id='spnFlightInfo'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblFlightInfo' validateonsubmit='true'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");

                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetSpotRateRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divFlightInfo'><span id='spnFlightInfo'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnFlightSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblFlightInfo'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            container.Append("<div id='divSpotCode'><span id='spnspotCode'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblSpotCode'></table></span></div>");

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
            //System.Data.DataSet ds = WebFormControlDefinition.GetConfiguration("RESERVATIONBOOKING");
            //HttpContext.Current.Session["_ProcessSetting"] = ds.Tables[ds.Tables.Count - 1];
            try
            {
                using (Grid g = new Grid())
                {

                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.FormCaptionText = "Spot Rate";
                    g.CommandButtonNewText = "New Spot Rate";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.IsRowDataBound = true;
                    //g.IsProcessPart = true;
                    g.SuccessGrid = "fn_OnSpotSuccessGrid";

                    g.Column.Add(new GridColumn { Field = "spotcode", Title = "Spot Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_RateAdhocType", Title = "Request Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB Number", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OriginCitySNo", Title = "Origin", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_DestinationCitySNo", Title = "Destination", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.String.ToString() });//nehal
                    g.Column.Add(new GridColumn { Field = "ChargeableWeight", Title = "Ch.Weight", DataType = GridDataType.String.ToString() });//nehal
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Agent Name", DataType = GridDataType.String.ToString() }); 
                    g.Column.Add(new GridColumn { Field = "Reference", Title = "ReferenceNo", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "SectorRate", Title = "Rate", DataType = GridDataType.Decimal.ToString() });
                    g.Column.Add(new GridColumn { Field = "SectorRate", Title = "Applied Rate", DataType = GridDataType.Decimal.ToString() });
                    g.Column.Add(new GridColumn { Field = "RequestedRate", Title = "Requested Rate", DataType = GridDataType.Decimal.ToString() });
                    g.Column.Add(new GridColumn { Field = "ApprovedRate", Title = "Approved Rate", DataType = GridDataType.Decimal.ToString() });//nehal
                    g.Column.Add(new GridColumn { Field = "Text_IsApproved", Title = "Status", DataType = GridDataType.String.ToString() });//nehal
                    g.Column.Add(new GridColumn { Field = "ValidFr", Title = "Valid From", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Action = new List<GridAction>();


                    // string Approve = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ApproveSpotRate"].ToUpper().ToString();

                    //string[] tokens = Approve.Split(new[] { "," }, StringSplitOptions.None);
                    // string LoginType = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToUpper();
                    bool Approve = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SpecialRights["SPOTAPPR"];
                    bool Request = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SpecialRights["SPOTREQ"];

                    //if (tokens.Contains(LoginType))
                    //{
                    //if (Approve == true)
                    //{
                    //    g.Action.Add(new GridAction
                    //    {
                    //        ButtonCaption = "View",
                    //        ActionName = "READ",
                    //        AppsName = this.MyAppID,
                    //        CssClassName = "READ",
                    //        ModuleName = this.MyModuleID
                    //    });

                    //    g.Action.Add(new GridAction
                    //    {
                    //        ButtonCaption = "Approve",
                    //        ActionName = "EDIT",
                    //        AppsName = this.MyAppID,
                    //        CssClassName = "EDIT",
                    //        ModuleName = this.MyModuleID
                    //    });
                    //}
                    if (Approve == true)
                    {

                        g.Action.Add(new GridAction
                        {
                            ButtonCaption = "View",
                            ActionName = "READ",
                            AppsName = this.MyAppID,
                            CssClassName = "READ",
                            ModuleName = this.MyModuleID
                        });

                        g.Action.Add(new GridAction
                        {
                            ButtonCaption = "Approve",
                            ActionName = "EDIT",
                            AppsName = this.MyAppID,
                            CssClassName = "EDIT",
                            ModuleName = this.MyModuleID
                        });

                        g.Action.Add(new GridAction
                        {
                            ButtonCaption = "In-Active",
                            ActionName = "EDIT",
                            AppsName = this.MyAppID,
                            CssClassName = "EDIT",
                            ModuleName = this.MyModuleID
                        });
                    }
                    else if (Approve == false && Request == false)
                    {
                        g.Action.Add(new GridAction
                        {
                            ButtonCaption = "View",
                            ActionName = "READ",
                            AppsName = this.MyAppID,
                            CssClassName = "READ",
                            ModuleName = this.MyModuleID
                        });
                    }
                    else if (Request == true)
                    {

                    }

                    container.Append("<table id='tbl'></table>");
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
                        SaveSpotRateDetails();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveSpotRateDetails();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        //  UpdateRate(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteSpotRate(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void SaveSpotRateDetails()
        {
            throw new NotImplementedException();
            //try
            //{
            //    List<SpotRate> listSpotRate = new List<SpotRate>();
            //    var FormElement = System.Web.HttpContext.Current.Request.Form;
            //    var SpotRate = new SpotRate
            //    {
            //        SNo=0,
            //        //ServiceName = FormElement["ServiceName"].ToUpper(),
            //        //IsActive = FormElement["IsActive"] == "0",
            //        //IsEditable = FormElement["IsEditable"] == "0",
            //        CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
            //        UpdatedBy =  Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
            //    };
            //    listSpotRate.Add(SpotRate);
            //    object datalist = (object)listSpotRate;
            //    DataOperationService(DisplayModeSave, datalist, MyModuleID);

            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            //}
        }
        private object GetSpotRateRecord()
        {
            object Rate = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    SpotRate RateDetils = new SpotRate();
                    object obj = (object)RateDetils;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserID", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());

                    Rate = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return Rate;
        }

        private void DeleteSpotRate(string RecordID)
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
    }
}
