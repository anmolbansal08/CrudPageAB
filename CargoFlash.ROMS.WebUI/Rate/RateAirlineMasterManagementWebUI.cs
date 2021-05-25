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
using CargoFlash.Cargo.Model.Tariff;
using System.Collections;
using System.Web;
using Newtonsoft.Json;


namespace CargoFlash.Cargo.WebUI.Rate
{
    #region RateAirlineMasterManagementWebUI Class Description

    /*
	*****************************************************************************
	Class Name:		RateAirlineMasterManagementWebUI      
	Purpose:		This class used to handle HTTP Type Request/Response	
                    and communicate with REST Services for DML operations
                    object of this class is used in various Code behind files 
                    of Modules
	Company:		CargoFlash 
	Author:			Madhav Kumar Jha
	Created On:		24 Feb 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class RateAirlineMasterManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Get information of individual RateAirlineMaster from database according record id supplied
        /// </summary> 
        /// <returns>object type of entity RateAirlineMaster found from database return null in case if touple not found</returns>
        public object GetRecordRateAirlineMaster()
        {
            object RateAirlineMaster = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RateAirlineMaster RateAirlineMasterList = new RateAirlineMaster();
                    object obj = (object)RateAirlineMasterList;
                    //retrieve Entity from Database according to the record
                    RateAirlineMaster = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return RateAirlineMaster;
        }
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public RateAirlineMasterManagementWebUI(Page PageContext)
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
                this.MyAppID = "RateAirlineMaster";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }


        public RateAirlineMasterManagementWebUI()
        {
            try
            {
                //if (this.SetCurrentPageContext(Page PageContext))
                //{
                //this.ErrorNumber = 0;
                //this.ErrorMessage = "";
                //}
                //   this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "RateAirlineMaster";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        public StringBuilder CreateRateAirlineMasterDetailsPage(StringBuilder container, string pageType)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"

            <div id='divTab1' > 
              <span id='spnRateAirlineMasterInformation'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + pageType + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnRateAirlineMasterSNo' name='hdnRateAirlineMasterSNo' type='hidden' value='" + this.MyRecordID + "'/>");
            containerLocal.Append(container);

            containerLocal.Append("<table class='WebFormTable' ><tr><td class'formActiontitle'>&nbsp;<input id='hdnRateAirlineTrans' name='hdnRateAirlineTrans' type='hidden' value=''/></td></tr></table> <table id='tblRateAirlineTrans'></table>");

            containerLocal.Append("<table class='WebFormTable' ><tr><td class'formActiontitle'>&nbsp;<input id='hdnRateDueCarrierTrans' name='hdnRateDueCarrierTrans' type='hidden' value=''/></td></tr></table> <table id='tblRateDueCarrierTrans'></table>");

            containerLocal.Append("<table class='WebFormTable' ><tr><td class'formActiontitle'>&nbsp;<input id='hdnRateAirlineCustomCharges' name='hdnRateAirlineCustomCharges' type='hidden' value=''/></td></tr></table> <table id='tblRateAirlineCustomCharges'></table>");

            containerLocal.Append(@"</span> 
            </div>
            ");
            return containerLocal;
        }


        /// <summary>
        /// Generate form layout 
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container">Control object</param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Text_AirlineSNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordRateAirlineMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(ReadRateAirlineMasterDetailsPage(htmlFormAdapter.InstantiateIn()));
                            container.Append(CreateRateAirlineMasterDetailsPage(htmlFormAdapter.InstantiateIn(), "Read"));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordRateAirlineMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordRateAirlineMaster();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateRateAirlineMasterDetailsPage(htmlFormAdapter.InstantiateIn(), "Edit"));

                            //container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateRateAirlineMasterDetailsPage(htmlFormAdapter.InstantiateIn(), "New"));
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordRateAirlineMaster();
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
        /// <summary>
        /// Generate RateAirlineMaster web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionRateAirlineMaster.xml
        /// </summary>
        /// <param name="container"></param>
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
        /// <summary>
        /// Generate Grid the for the page
        /// as per the columns of entity supplied
        /// </summary>
        /// <param name="Container"></param>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Truck Rates";
                    g.FormCaptionText = "Truck Rates";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "RateAirlineMasterSNo", Title = "RateAirlineMasterSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "TruckCode", Title = "Truck Code", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                   
                    g.Column.Add(new GridColumn { Field = "Text_TruckType", Title = "Truck Type", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "Text_SHCSNo", Title = "SHC", DataType = GridDataType.String.ToString() });

                    //g.Column.Add(new GridColumn { Field = "OfficeName", Title = "Office", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "AccountName", Title = "Account Name", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "ProductName", Title = "Product Name", DataType = GridDataType.String.ToString(), Width = 100 });
                    //g.Column.Add(new GridColumn { Field = "CommoditySubGroupName", Title = "Commodity SubGroup Name", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "SPHCGroupName", Title = "SHC Group", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "FlightTypeName", Title = "Flight Type", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "OriginCityCode", Title = "Origin City", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "DestinationCityCode", Title = "Dest. City", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginAirportCode", Title = "Origin Airport", DataType = GridDataType.String.ToString(), IsHidden = false });
                    g.Column.Add(new GridColumn { Field = "DestinationAirportCode", Title = "Dest. Airport", DataType = GridDataType.String.ToString(), IsHidden = false });
                    //  g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.String.ToString() });
                    //  g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidFrom==null) {# # } else {# #= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidTo==null) {# # } else {# #= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString(), IsHidden = true });
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
        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            //try
            //{

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveRateAirlineMaster();
                    if (!string.IsNullOrEmpty(ErrorMessage))
                        if (ErrorMessage.IndexOf("Airline Rate already exists") == -1)
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveRateAirlineMaster();
                    if (!string.IsNullOrEmpty(ErrorMessage))
                        if (ErrorMessage.IndexOf("Airline Rate already exists") == -1)
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateRateAirlineMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (!string.IsNullOrEmpty(ErrorMessage))
                        if (ErrorMessage.IndexOf("Airline Rate Aready Exists") == -1)
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteRateAirlineMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (!string.IsNullOrEmpty(ErrorMessage))
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
        /// <summary>
        /// Save Images viz(RateAirlineMasterLogo,AwbLogo,ReportLogo)
        /// input from webform to stipulated folder 
        /// </summary>
        private String[] SaveImage()
        {
            String RateAirlineMasterLogo = "", AwbLogo = "", ReportLogo = "";
            try
            {
                System.Web.HttpFileCollection multipleFiles = System.Web.HttpContext.Current.Request.Files;

                String[] inputName = multipleFiles.AllKeys;
                var server = System.Web.HttpContext.Current.Server;
                String str = server.MapPath("~/");
                if (!Directory.Exists(Path.Combine(str, "Logo")))
                {
                    Directory.CreateDirectory(Path.Combine(str, "Logo"));
                }
                for (int fileCount = 0; fileCount < multipleFiles.Count; fileCount++)
                {
                    System.Web.HttpPostedFile uploadedFile = multipleFiles[fileCount];
                    string fileName = Path.GetFileName(uploadedFile.FileName);
                    if (uploadedFile.ContentLength > 0 && ((uploadedFile.ContentLength / 1024) <= 2048))
                    {
                        switch (inputName[fileCount])
                        {
                            case "RateAirlineMasterLogo":
                                RateAirlineMasterLogo = Path.Combine("Logo", "RateAirlineMasterLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, RateAirlineMasterLogo));
                                break;
                            case "AwbLogo":
                                AwbLogo = Path.Combine("Logo", "AwbLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, AwbLogo));
                                //@todo
                                break;
                            case "ReportLogo":
                                ReportLogo = Path.Combine("Logo", "ReportLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, ReportLogo));
                                //@todo
                                break;
                            //ReportLogo { get; set; } 
                        }
                    }
                }
                return new String[] { RateAirlineMasterLogo, AwbLogo, ReportLogo };
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return new String[] { RateAirlineMasterLogo, AwbLogo, ReportLogo };
        }
        /// <summary>
        /// Insert new RateAirlineMaster record into the database
        /// Retrieve information from webform and store the same into modal object 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveRateAirlineMaster()
        {
            try
            {
                List<RateAirlineMaster> listRateAirlineMaster = new List<RateAirlineMaster>();
                String[] Logo = SaveImage();
                int number = 0;
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var rateAirlineMasterTrans = "";
                var RateAirlineMaster = new RateAirlineMaster
                {
                    TruckCode = FormElement["TruckCode"].ToString(),
                    AirportName = FormElement["AirportName"].ToString(),
                    
                    AirlineSNo = Int32.TryParse(FormElement["AirlineSNo"], out number) ? number : (int?)null,
                    RateType = Int32.TryParse(FormElement["RateType"], out number) ? number : (int?)null,
                    //RateClassCode = FormElement["RateClassCode"].ToString(),
                    //CommoditySubGroupSNo = Int32.TryParse(FormElement["CommoditySubGroupSNo"], out number) ? number : (int?)null,
                    //CommoditySNo = Int32.TryParse(FormElement["CommoditySNo"], out number) ? number : (int?)null,
                    SHCSNo = Int32.TryParse(FormElement["SHCSNo"], out number) ? number : (int?)null,
                    SPHCGroupSNo = Int32.TryParse(FormElement["SPHCGroupSNo"], out number) ? number : (int?)null,
                    WeightType = Int32.TryParse(FormElement["WeightType"], out number) ? number : (int?)null,
                    //OfficeSNo = Int32.TryParse(FormElement["OfficeSNo"], out number) ? number : (int?)null,
                    //AccountSNo = Int32.TryParse(FormElement["AccountSNo"], out number) ? number : (int?)null,
                    //OriginZoneSNo = Int32.TryParse(FormElement["OriginZoneSNo"], out number) ? number : (int?)null,
                    //DestinationZoneSNo = Int32.TryParse(FormElement["DestinationZoneSNo"], out number) ? number : (int?)null,
                    //OriginCitySNo = Int32.TryParse(FormElement["OriginCitySNo"], out number) ? number : (int?)null,
                    //DestinationCitySNo = Int32.TryParse(FormElement["DestinationCitySNo"], out number) ? number : (int?)null,
                    //OriginCityCode = FormElement["Text_OriginCitySNo"].ToString().Substring(0,3).ToString(),
                    //DestinationCityCode = FormElement["Text_DestinationCitySNo"].ToString().Substring(0, 3).ToString(),
                    OriginAirportSNo = Int32.TryParse(FormElement["OriginAirPortSNo"], out number) ? number : (int?)null,
                    DestinationAirportSNo = Int32.TryParse(FormElement["DestinationAirPortSNo"], out number) ? number : (int?)null,
                    //ProductSNo = Int32.TryParse(FormElement["ProductSNo"], out number) ? number : (int?)null,
                    //FlightTypeSNo = Int32.TryParse(FormElement["FlightTypeSNo"], out number) ? number : (int?)null,
                    CurrencySNo = Int32.TryParse(FormElement["CurrencySNo"], out number) ? number : (int?)null,
                    MinimumRate = Convert.ToDecimal(FormElement["MinimumRate"] == "" ? "0" : FormElement["MinimumRate"]),
                    Tax = Convert.ToDecimal(FormElement["Tax"] == "" ? "0" : FormElement["Tax"]),
                    //IsGlobalSurCharge = FormElement["IsGlobalSurCharge"] == "0",
                    IsGlobalDueCarrier = FormElement["IsGlobalDueCarrier"] == "0",
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    Remarks = FormElement["Remarks"].ToString(),
                    IsApproved = FormElement["IsApproved"] == "0",
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    TruckType = Int32.TryParse(FormElement["TruckType"], out number) ? number : 0


                };
                listRateAirlineMaster.Add(RateAirlineMaster);
                rateAirlineMasterTrans = FormElement["hdnRateAirlineTrans"];
                var dtRateAirlineTrans = JsonConvert.DeserializeObject<DataTable>(rateAirlineMasterTrans);
                List<RateAirlineTrans> listRateAirlineTrans = dtRateAirlineTrans.AsEnumerable().Select(row =>
                                            new RateAirlineTrans
                                            {
                                                SNo = Convert.ToInt32(row.Field<string>("SNo")),
                                                SlabName = row.Field<string>("SlabName"),
                                                StartWeight = Convert.ToDecimal(row.Field<string>("StartWeight")),
                                                EndWeight = Convert.ToDecimal(row.Field<string>("EndWeight")),
                                                Value = Convert.ToDecimal(row.Field<string>("Value")),
                                            }).ToList();

                var rateDueCarrierTrans = FormElement["hdnRateDueCarrierTrans"];
                var dtRateDueCarrierTrans = JsonConvert.DeserializeObject<DataTable>(rateDueCarrierTrans);
                List<RateDueCarrierTrans> listRateDueCarrierTrans = dtRateDueCarrierTrans.AsEnumerable().Select(row =>
                                              new RateDueCarrierTrans
                                              {
                                                  DueCarrierSNo = Convert.ToInt32(row.Field<string>("HdnName")),
                                                  IsChargeableWeight = Convert.ToBoolean(Convert.ToInt32(row.Field<string>("IsChargeableWeight"))),
                                                  Value = Convert.ToDecimal(row.Field<string>("Value")),
                                                  MinimumValue = Convert.ToDecimal(row.Field<string>("MinimumValue")),
                                                  ValidFrom = row.Field<string>("ValidFrom"),
                                                  ValidTo = row.Field<string>("ValidTo")
                                              }).ToList();


                var rateAirlineCustomCharges = FormElement["hdnRateAirlineCustomCharges"];
                var dtRateAirlineCustomCharges = JsonConvert.DeserializeObject<DataTable>(rateAirlineCustomCharges);
                List<RateAirlineCustomCharges> listRateAirlineCustomCharges = dtRateAirlineCustomCharges.AsEnumerable().Select(row =>
                                              new RateAirlineCustomCharges
                                              {
                                                  //SNo = Convert.ToInt32(row.Field<string>("SNo")),
                                                  RateAirlineMasterSNo = Convert.ToInt32(row.Field<string>("RateAirlineMasterSNo")),
                                                  Charge_Name = row.Field<string>("Charge_Name"),
                                                  Value = Convert.ToDecimal(row.Field<string>("Value")),
                                              }).ToList();




                RateAirlineMasterCollection rateAirlineMasterCollection = new RateAirlineMasterCollection
                {
                    rateAirlineMaster = listRateAirlineMaster,
                    rateAirlineTrans = listRateAirlineTrans,
                    rateDueCarrierTrans = listRateDueCarrierTrans,
                    rateAirlineCustomCharges = listRateAirlineCustomCharges
                };
                List<RateAirlineMasterCollection> listRateAirlineCollection = new List<RateAirlineMasterCollection>();
                listRateAirlineCollection.Add(rateAirlineMasterCollection);
                object datalist = (object)listRateAirlineCollection;
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
        /// <summary>
        /// Update RateAirlineMaster record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateRateAirlineMaster(string RecordID)
        {
            try
            {
                List<RateAirlineMaster> listRateAirlineMaster = new List<RateAirlineMaster>();
                int number = 0;
                String[] Logo = SaveImage();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var rateAirlineMasterTrans = "";
                var RateAirlineMaster = new RateAirlineMaster
                {
                    SNo = Convert.ToInt32(RecordID),
                    TruckCode = FormElement["TruckCode"].ToString(),
                    AirportName = FormElement["AirportName"].ToString(),
                    AirlineSNo = Int32.TryParse(FormElement["AirlineSNo"], out number) ? number : 0,
                    RateType = Int32.TryParse(FormElement["RateType"], out number) ? number : 0,
                    //RateClassCode = FormElement["RateClassCode"].ToString(),
                    //CommoditySubGroupSNo = Int32.TryParse(FormElement["CommoditySubGroupSNo"], out number) ? number : 0,
                    //CommoditySNo = Int32.TryParse(FormElement["CommoditySNo"], out number) ? number : 0,
                    SHCSNo = Int32.TryParse(FormElement["SHCSNo"], out number) ? number : 0,
                    SPHCGroupSNo = Int32.TryParse(FormElement["SPHCGroupSNo"], out number) ? number : (int?)null,
                    WeightType = Int32.TryParse(FormElement["WeightType"], out number) ? number : 0,
                    //OfficeSNo = Int32.TryParse(FormElement["OfficeSNo"], out number) ? number : 0,
                    //AccountSNo = Int32.TryParse(FormElement["AccountSNo"], out number) ? number : 0,
                    //OriginZoneSNo = Int32.TryParse(FormElement["OriginZoneSNo"], out number) ? number : 0,
                    //DestinationZoneSNo = Int32.TryParse(FormElement["DestinationZoneSNo"], out number) ? number : 0,
                    //OriginCitySNo = Int32.TryParse(FormElement["OriginCitySNo"], out number) ? number : 0,
                    //DestinationCitySNo = Int32.TryParse(FormElement["DestinationCitySNo"], out number) ? number : 0,
                    //OriginCityCode = FormElement["Text_OriginCitySNo"].ToString().Substring(0, 3).ToString(),
                    //DestinationCityCode = FormElement["Text_DestinationCitySNo"].ToString().Substring(0, 3).ToString(),
                    OriginAirportSNo = Int32.TryParse(FormElement["OriginAirPortSNo"], out number) ? number : 0,
                    DestinationAirportSNo = Int32.TryParse(FormElement["DestinationAirPortSNo"], out number) ? number : 0,
                    //ProductSNo = Int32.TryParse(FormElement["ProductSNo"], out number) ? number : 0,
                    //FlightTypeSNo = Int32.TryParse(FormElement["FlightTypeSNo"], out number) ? number : 0,
                    CurrencySNo = Int32.TryParse(FormElement["CurrencySNo"], out number) ? number : 0,
                    MinimumRate = Convert.ToDecimal(FormElement["MinimumRate"] == "" ? "0" : FormElement["MinimumRate"]),
                    Tax = Convert.ToDecimal(FormElement["Tax"] == "" ? "0" : FormElement["Tax"]),
                    //IsGlobalSurCharge = FormElement["IsGlobalSurCharge"] == "0",
                    IsGlobalDueCarrier = FormElement["IsGlobalDueCarrier"] == "0",
                    Remarks = FormElement["Remarks"].ToString(),
                    IsApproved = FormElement["IsApproved"] == "0",
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    TruckType = Int32.TryParse(FormElement["TruckType"], out number) ? number : 0
                };
                listRateAirlineMaster.Add(RateAirlineMaster);

                rateAirlineMasterTrans = FormElement["hdnRateAirlineTrans"];
                var dtRateAirlineTrans = JsonConvert.DeserializeObject<DataTable>(rateAirlineMasterTrans);
                List<RateAirlineTrans> listRateAirlineTrans = dtRateAirlineTrans.AsEnumerable().Select(row =>
                                            new RateAirlineTrans
                                            {

                                                SNo = Convert.ToInt32(row.Field<string>("SNo")),
                                                RateAirlineMasterSNo = Convert.ToInt32(RecordID),
                                                SlabName = row.Field<string>("SlabName"),
                                                StartWeight = Convert.ToDecimal(row.Field<string>("StartWeight")),
                                                EndWeight = Convert.ToDecimal(row.Field<string>("EndWeight")),
                                                Value = Convert.ToDecimal(row.Field<string>("Value")),
                                            }).ToList();

                var rateDueCarrierTrans = FormElement["hdnRateDueCarrierTrans"];
                var dtRateDueCarrierTrans = JsonConvert.DeserializeObject<DataTable>(rateDueCarrierTrans);
                List<RateDueCarrierTrans> listRateDueCarrierTrans = dtRateDueCarrierTrans.AsEnumerable().Select(row =>
                                              new RateDueCarrierTrans
                                              {
                                                  SNo = Convert.ToInt32(row.Field<string>("SNo")),
                                                  RateAirlineMasterSNo = Convert.ToInt32(RecordID),
                                                  DueCarrierSNo = Convert.ToInt32(row.Field<string>("HdnName")),
                                                  IsChargeableWeight = Convert.ToBoolean(Convert.ToInt32(row.Field<string>("IsChargeableWeight"))),
                                                  Value = Convert.ToDecimal(row.Field<string>("Value")),
                                                  MinimumValue = Convert.ToDecimal(row.Field<string>("MinimumValue")),
                                                  ValidFrom = row.Field<string>("ValidFrom"),
                                                  ValidTo = row.Field<string>("ValidTo")
                                              }).ToList();

                var rateAirlineCustomCharges = FormElement["hdnRateAirlineCustomCharges"];
                var dtRateAirlineCustomCharges = JsonConvert.DeserializeObject<DataTable>(rateAirlineCustomCharges);
                List<RateAirlineCustomCharges> listRateAirlineCustomCharges = dtRateAirlineCustomCharges.AsEnumerable().Select(row =>
                                              new RateAirlineCustomCharges
                                              {
                                                  // SNo = Convert.ToInt32(row.Field<string>("SNo")),
                                                  RateAirlineMasterSNo = Convert.ToInt32(RecordID),
                                                  Charge_Name = row.Field<string>("Charge_Name"),
                                                  Value = Convert.ToDecimal(row.Field<string>("Value")),
                                              }).ToList();


                RateAirlineMasterCollection rateAirlineMasterCollection = new RateAirlineMasterCollection
                {
                    rateAirlineMaster = listRateAirlineMaster,
                    rateAirlineTrans = listRateAirlineTrans,
                    rateDueCarrierTrans = listRateDueCarrierTrans,
                    rateAirlineCustomCharges = listRateAirlineCustomCharges

                };
                List<RateAirlineMasterCollection> listRateAirlineCollection = new List<RateAirlineMasterCollection>();
                listRateAirlineCollection.Add(rateAirlineMasterCollection);
                object datalist = (object)listRateAirlineCollection;

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
        /// <summary>
        /// Delete RateAirlineMaster record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteRateAirlineMaster(string RecordID)
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
