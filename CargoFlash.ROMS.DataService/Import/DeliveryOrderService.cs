using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;


namespace CargoFlash.Cargo.DataService.Import
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DeliveryOrderService : BaseWebUISecureObject, IDeliveryOrderService
    {
        public Stream GetWebForm(DeliveryOrderGetWebForm model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, "", (model.IsSubModule == "1"));

        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string searchAirline = "", string searchFlightNo = "", string searchAWBNo = "", string searchFromDate = "", string searchToDate = "", string SearchIncludeTransitAWB = "", string SearchExcludeDeliveredAWB = "", string LoggedInCity = "", string searchSPHC = "", string searchConsignee = "")
        {
            LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).AirportCode;
            SearchIncludeTransitAWB = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).AirportCode;
            this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
            StringBuilder myCurrentForm = new StringBuilder();
            switch (this.DisplayMode)
            {
                case DisplayModeNew:
                    using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                    {
                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                    }
                    break;
                case DisplayModeSearch:
                    using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                    {
                        htmlFormAdapter.DisplayMode = DisplayModeType.Search;
                        myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                    }
                    break;
                case DisplayModeDuplicate:

                    break;
                case DisplayModeEdit:

                    break;
                case DisplayModeDelete:

                    break;
                case DisplayModeIndexView:
                    switch (processName)
                    {
                        case "DELIVERYORDER":
                            if (appName.ToUpper().Trim() == "DELIVERYORDER")
                                CreateGrid(myCurrentForm, processName, searchAirline, searchFlightNo, searchAWBNo, searchFromDate, searchToDate, SearchIncludeTransitAWB, SearchExcludeDeliveredAWB, searchSPHC, searchConsignee, LoggedInCity, isV2: true);
                            break;
                        default:
                            break;
                    }
                    break;
                case DisplayModeReadView:
                    using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                    {
                        htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                    }
                    break;
                default:
                    break;
            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }

        public Stream GetGridData(DeliveryOrderSearch model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, searchAirline: model.searchAirline, searchFlightNo: model.searchFlightNo, searchAWBNo: model.searchAWBNo, searchFromDate: model.searchFromDate, searchToDate: model.searchToDate, SearchIncludeTransitAWB: model.SearchIncludeTransitAWB, SearchExcludeDeliveredAWB: model.SearchExcludeDeliveredAWB, LoggedInCity: model.LoggedInCity, searchSPHC: model.searchSPHC, searchConsignee: model.searchConsignee);
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string SearchIncludeTransitAWB, string SearchExcludeDeliveredAWB, string searchSPHC, string searchConsignee, string LoggedInCity, bool isV2 = false)
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Delivery Order";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsActionRequired = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.ProcessName = ProcessName;
                g.IsShowGridHeader = false;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "SNo", Title = "Warning!!", IsHidden = false, DataType = GridDataType.String.ToString(), Template = "#if(IsWarning==true){#<img src=\"images/warning.png\" title=\"#=WarningRemarks#\" style=\"cursor:pointer;\">#}#", Width = 20, Filterable = "false" });

                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 60, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString(), Width = 40 });
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ClientEnvironment"].ToString().ToUpper().Trim() != "TH"))
                {
                    g.Column.Add(new GridColumn { Field = "Destination", Title = "Destination", DataType = GridDataType.String.ToString(), Width = 40 });
                }
                g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 40 });
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ClientEnvironment"].ToString().ToUpper().Trim() != "TH"))
                {
                    g.Column.Add(new GridColumn { Field = "CargoMailCourier", Title = "Cargo/Mail/Courier", DataType = GridDataType.String.ToString(), Width = 60 });
                }
                g.Column.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ATA", Title = "ATA", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "EnteredType", Title = "EnteredType", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "POMailSNo", Title = "POMailSNo", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "searchAirline", Value = searchAirline });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchFlightNo", Value = searchFlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBNo", Value = searchAWBNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchIncludeTransitAWB", Value = SearchIncludeTransitAWB });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchExcludeDeliveredAWB", Value = SearchExcludeDeliveredAWB });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchSPHC", Value = searchSPHC });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchConsignee", Value = searchConsignee });
                g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                g.InstantiateIn(Container, isV2);

            }
        }

        public DataSourceResult GetDeliveryOrderGridData(GetDeliveryOrderGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "GetDeliveryOrderGridData";
                string filters = GridFilter.ProcessFilters<DeliveryOrder>(filter);

                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@searchAirline", model.searchAirline),
                                            new SqlParameter("@searchFlightNo", model.searchFlightNo),
                                            new SqlParameter("@searchAWBNo", model.searchAWBNo),
                                            new SqlParameter("@searchFromDate", model.searchFromDate),
                                            new SqlParameter("@searchToDate", model.searchToDate),
                                            new SqlParameter("@SearchIncludeTransitAWB", model.SearchIncludeTransitAWB),
                                            new SqlParameter("@SearchExcludeDeliveredAWB", model.SearchExcludeDeliveredAWB),
                                            new SqlParameter("@LoggedInCity", model.LoggedInCity),
                                            new SqlParameter("@searchSPHC",model.searchSPHC),
                                            new SqlParameter("@searchConsignee", model.searchConsignee),
                                             new SqlParameter("@LoginCitySno",Convert.ToInt32( ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo)),
                                              new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var DeliveryOrderList = ds.Tables[0].AsEnumerable().Select(e => new DeliveryOrder
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    AWBNo = e["AWBNo"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Pcs = Convert.ToInt32(e["Pcs"]),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"]),
                    ATA = e["ATA"].ToString(),
                    ProcessStatus = e["Status"].ToString(),
                    EnteredType = e["EnteredType"].ToString(),
                    IsWarning = Convert.ToBoolean(e["IsWarning"]),
                    WarningRemarks = e["WarningRemarks"].ToString(),
                    POMailSNo = Convert.ToInt32(e["POMailSNo"]),
                    CargoMailCourier = e["CargoMailCourier"].ToString()

                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DeliveryOrderList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetProcessSequence(string ProcessName)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequenceImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetDeliveryOrderInformation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDeliveryOrderInformation", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string BindFADSection(Int32 ArrivedShipmentSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordBindFADSection", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string BindFHLSectionTable(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordBindFHLSectionTable", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAWBRateDetails(Int32 AWBSNO)
        {

            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBRateDetailsImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<GetDimemsionsAndULDNew>> GetDimemsionsAndULDNew(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                GetDimemsionsAndULDNew officeCommision = new GetDimemsionsAndULDNew();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsAndULDNewImport", Parameters);
                var GetDimemsionsAndULDNewList = ds.Tables[0].AsEnumerable().Select(e => new GetDimemsionsAndULDNew
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    HAWBSNo = Convert.ToInt32(e["HAWBSNo"]),
                    NoOfPieces = Convert.ToInt32(e["NoOfPieces"]),
                    WeightCode = e["WeightCode"].ToString(),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                    RateClassCode = e["txtRateClassCode"].ToString(),
                    HdnRateClassCode = e["RateClassCode"].ToString(),
                    CommodityItemNumber = Convert.ToInt32(e["CommodityItemNumber"]),
                    ChargeableWeight = Convert.ToDecimal(e["ChargeableWeight"].ToString()),
                    Charge = Convert.ToDecimal(e["Charge"].ToString()),
                    ChargeAmount = Convert.ToDecimal(e["ChargeAmount"].ToString()),
                    NatureOfGoods = e["NatureOfGoods"].ToString(),
                    hdnChildData = e["hdnChildData"].ToString(),

                });
                return new KeyValuePair<string, List<GetDimemsionsAndULDNew>>(ds.Tables[1].Rows[0][0].ToString(), GetDimemsionsAndULDNewList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<GetDimemsionsAndULDRate>> GetDimemsionsAndULDRate(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                GetDimemsionsAndULDRate officeCommision = new GetDimemsionsAndULDRate();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsAndULDRateImport", Parameters);
                var GetDimemsionsAndULDRateList = ds.Tables[0].AsEnumerable().Select(e => new GetDimemsionsAndULDRate
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    WeightCode = e["WeightCode"].ToString(),
                    RateClassCode = e["txtRateClassCode"].ToString(),
                    HdnRateClassCode = e["RateClassCode"].ToString(),
                    SLAC = Convert.ToInt32(e["SLAC"]),
                    HdnULD = Convert.ToInt32(e["ULDTypeSNo"]),
                    ULD = e["ULDTypeCode"].ToString(),
                    ULDNo = e["ULDSNo"].ToString(),
                    Charge = Convert.ToDecimal(e["Charge"].ToString()),
                    ChargeAmount = Convert.ToDecimal(e["ChargeAmount"].ToString()),
                    HarmonisedCommodityCode = Convert.ToInt32(e["HarmonisedCommodityCode"].ToString()),
                    HdnCountry = Convert.ToInt32(e["CountrySNo"].ToString()),
                    Country = e["txtCountry"].ToString(),
                    NatureOfGoods = e["NatureOfGoods"].ToString(),
                });
                return new KeyValuePair<string, List<GetDimemsionsAndULDRate>>(ds.Tables[1].Rows[0][0].ToString(), GetDimemsionsAndULDRateList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<GetAWBOtherChargeData>> GetAWBOtherChargeData(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            try
            {
                GetAWBOtherChargeData officeCommision = new GetAWBOtherChargeData();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBOtherChargeDataImport", Parameters);
                var GetAWBOtherChargeDataList = ds.Tables[0].AsEnumerable().Select(e => new GetAWBOtherChargeData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    Type = e["Type"].ToString(),
                    OtherCharge = e["OtherChargeCode"].ToString(),
                    HdnOtherCharge = e["OtherChargeCode"].ToString(),
                    DueType = e["DueType"].ToString(),
                    Amount = Convert.ToDecimal(e["ChargeAmount"]),
                });
                return new KeyValuePair<string, List<GetAWBOtherChargeData>>(ds.Tables[1].Rows[0][0].ToString(), GetAWBOtherChargeDataList.AsQueryable().ToList());
            }

            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GetShipperAndConsigneeInformation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperAndConsigneeInformationImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@FieldType", FieldType), new SqlParameter("@SNO", SNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperConsigneeDetailsImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {


                throw ex;
            }
        }
        //start tax for shipper
        public string GetShipperConsigneeDetails_TaxId(string UserType, string TaxId, Int32 SNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@TaxID", TaxId), new SqlParameter("@SNO", SNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperConsigneeDetailsImport_TaxId", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {


                throw ex;
            }
        }

        //start tax for shipper end
        public string GetOSIInfoAndHandlingMessage(Int32 AWBSNO)
        {
            try
            {


                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOSIInfoAndHandlingMessageImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;

            }
        }

        public string GetAWBSummary(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBSummaryImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GetRecordAtAWBEDox(Int32 AWBSNO)
        {
            try
            {


                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtAWBEDoxImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest)
        {
            DataSet ds;
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DlyFlghtSno), new SqlParameter("@Origin", Origin), new SqlParameter("@Dest", Dest) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateCutoffTimeImport", Parameters);
                return ds.Tables[0].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string SaveAcceptance(string AWBNo, Int32 AWBSNo, ImportShipmentInformation ShipmentInformation, List<ImportAWBSPHC> lstAWBSPHC, List<ImportItineraryInformation> listItineraryInformation, List<ImportAWBSPHCTrans> AWBSPHCTrans, Int32 UpdatedBy)
        {

            List<ImportShipmentInformation> lstShipmentInformation = new List<ImportShipmentInformation>();
            lstShipmentInformation.Add(ShipmentInformation);
            DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "");
            DataTable dtAWBSPHC = CollectionHelper.ConvertTo(lstAWBSPHC, "");
            DataTable dtItineraryInformation = CollectionHelper.ConvertTo(listItineraryInformation, "");
            DataTable dtAWBSPHCTrans = CollectionHelper.ConvertTo(AWBSPHCTrans, "SNo");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramShipmentInformation = new SqlParameter();
            paramShipmentInformation.ParameterName = "@ShipmentInformation";
            paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipmentInformation.Value = dtShipmentInformation;

            SqlParameter paramAWBSPHC = new SqlParameter();
            paramAWBSPHC.ParameterName = "@AWBSPHC";
            paramAWBSPHC.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSPHC.Value = dtAWBSPHC;

            SqlParameter paramItineraryInformation = new SqlParameter();
            paramItineraryInformation.ParameterName = "@ItineraryInformation";
            paramItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramItineraryInformation.Value = dtItineraryInformation;

            SqlParameter paramAWBSPHCTrans = new SqlParameter();
            paramAWBSPHCTrans.ParameterName = "@AWBSPHCTrans";
            paramAWBSPHCTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSPHCTrans.Value = dtAWBSPHCTrans;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@AWBSNo", AWBSNo), paramShipmentInformation, paramAWBSPHC, paramItineraryInformation, paramAWBSPHCTrans, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveAcceptanceImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string UpdateRateDimemsionsAndULD(Int32 AWBSNo, List<ImportDimensionsArray> Dimensions, List<ImportULDDimensionsArray> ULDDimension, List<GetAWBOtherChargeData> OtherCharge, List<ImportAWBRateArray> RateArray, Int32 UpdatedBy)
        {
            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");//hdnChildData
            DataTable dtAWBULDTrans = CollectionHelper.ConvertTo(ULDDimension, "");
            List<ImportChildData> lstChildData = new List<ImportChildData>();
            DataTable dtDimensionTrans = CollectionHelper.ConvertTo(lstChildData, "");
            DataTable dtOtherCharge = CollectionHelper.ConvertTo(OtherCharge, "");
            DataTable dtAWBRate = CollectionHelper.ConvertTo(RateArray, "");

            GetDimensionTransData(dtDimensionTrans, dtDimensions, dtAWBULDTrans);

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramDimensions = new SqlParameter();
            paramDimensions.ParameterName = "@RateDimensions";
            paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensions.Value = dtDimensions;

            SqlParameter paramDimensionsTrans = new SqlParameter();
            paramDimensionsTrans.ParameterName = "@RateDimensionsTrans";
            paramDimensionsTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensionsTrans.Value = dtDimensionTrans;

            SqlParameter paramAWBULDTrans = new SqlParameter();
            paramAWBULDTrans.ParameterName = "@ULDRateDimensions";
            paramAWBULDTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBULDTrans.Value = dtAWBULDTrans;

            SqlParameter paramOtherCharge = new SqlParameter();
            paramOtherCharge.ParameterName = "@OtherCharge";
            paramOtherCharge.SqlDbType = System.Data.SqlDbType.Structured;
            paramOtherCharge.Value = dtOtherCharge;

            SqlParameter paramAwbRate = new SqlParameter();
            paramAwbRate.ParameterName = "@AwbRate";
            paramAwbRate.SqlDbType = System.Data.SqlDbType.Structured;
            paramAwbRate.Value = dtAWBRate;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramDimensions, paramDimensionsTrans, paramAWBULDTrans, paramOtherCharge, paramAwbRate, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateRateDimemsionsAndULDImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        private void GetDimensionTransData(DataTable dtDimensionTrans, DataTable dtDimensions, DataTable dtAWBULDTrans)
        {
            try
            {
                for (int j = 0; j < dtDimensions.Rows.Count; j++)
                {
                    if (dtDimensions.Rows[j]["hdnChildData"].ToString() != "")
                    {
                        DataTable Temp = (DataTable)JsonConvert.DeserializeObject(dtDimensions.Rows[j]["hdnChildData"].ToString(), (typeof(DataTable)));
                        foreach (DataRow dtRow in Temp.Rows)
                        {
                            DataRow dr = dtDimensionTrans.NewRow();
                            dr["SNo"] = dtDimensions.Rows[j]["SNo"];
                            dr["AWBSNo"] = dtRow["AWBSNo"].ToString();
                            dr["Length"] = dtRow["Length"].ToString();
                            dr["Width"] = dtRow["Width"].ToString();
                            dr["Height"] = dtRow["Height"].ToString();
                            dr["MeasurementUnitCode"] = dtRow["MeasurementUnitCode"].ToString();
                            dr["Pieces"] = dtRow["Pieces"].ToString();
                            dr["VolumeWeight"] = dtRow["VolumeWeight"].ToString();
                            dr["VolumeUnit"] = dtRow["VolumeUnit"].ToString();
                            dr["AWBRateDescriptionSNo"] = dtRow["AWBRateDescriptionSNo"].ToString();
                            dtDimensionTrans.Rows.Add(dr);

                        }
                    }

                }
                dtDimensions.Columns.Remove("hdnChildData");
                for (int i = 0; i < dtAWBULDTrans.Rows.Count; i++)
                {
                    dtAWBULDTrans.Rows[i]["ChargeLineCount"] = i + 1;
                }
                dtDimensionTrans.AcceptChanges();
                dtDimensions.AcceptChanges();
                dtAWBULDTrans.AcceptChanges();

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportNotifyDetails NotifyModel, ImportNominyDetails NominyModel, ImportAgentModelDetail AgentModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno)
        {
            List<ImportShipperInformation> lstShipperInformation = new List<ImportShipperInformation>();
            lstShipperInformation.Add(ShipperInformation);
            DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");
            BaseBusiness baseBusiness = new BaseBusiness();


            List<ImportConsigneeInformation> lstConsigneeInformation = new List<ImportConsigneeInformation>();
            lstConsigneeInformation.Add(ConsigneeInformation);
            DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

            List<ImportNotifyDetails> lstNotifyInformation = new List<ImportNotifyDetails>();
            lstNotifyInformation.Add(NotifyModel);
            DataTable dtNotifyDetails = CollectionHelper.ConvertTo(lstNotifyInformation, "");

            List<ImportNominyDetails> lstNominyInformation = new List<ImportNominyDetails>();
            lstNominyInformation.Add(NominyModel);
            DataTable dtNominyDetails = CollectionHelper.ConvertTo(lstNominyInformation, "");

            List<ImportAgentModelDetail> lstImportAgentModelDetail = new List<ImportAgentModelDetail>();
            lstImportAgentModelDetail.Add(AgentModel);
            DataTable dtImportAgentModelDetail = CollectionHelper.ConvertTo(lstImportAgentModelDetail, "");

            SqlParameter paramShipperInformation = new SqlParameter();
            paramShipperInformation.ParameterName = "@ShipperInformation";
            paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipperInformation.Value = dtShipperInformation;

            SqlParameter paramConsigneeInformation = new SqlParameter();
            paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
            paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramConsigneeInformation.Value = dtConsigneeInformation;

            SqlParameter paramNotifyDetails = new SqlParameter();
            paramNotifyDetails.ParameterName = "@NotifyDetails";
            paramNotifyDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramNotifyDetails.Value = dtNotifyDetails;

            SqlParameter paramNominyDetails = new SqlParameter();
            paramNominyDetails.ParameterName = "@NominyDetails";
            paramNominyDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramNominyDetails.Value = dtNominyDetails;

            SqlParameter paramImportAgentModelDetail = new SqlParameter();
            paramImportAgentModelDetail.ParameterName = "@ImportAgentModelDetail";
            paramImportAgentModelDetail.SqlDbType = System.Data.SqlDbType.Structured;
            paramImportAgentModelDetail.Value = dtImportAgentModelDetail;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramShipperInformation, paramConsigneeInformation, paramNotifyDetails, paramNominyDetails, paramImportAgentModelDetail, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateShipperAndConsigneeInformationImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string UpdateOSIInfoAndHandlingMessage(Int32 AWBSNo, ImportOSIInformation OSIInformation, List<ImportAWBHandlingMessage> AWBHandlingMessage, List<ImportAWBOSIModel> AWBOSIModel, List<ImportAWBOCIModel> AWBOCIModel, Int32 UpdatedBy)
        {
            List<ImportOSIInformation> lstOSIInformation = new List<ImportOSIInformation>();
            lstOSIInformation.Add(OSIInformation);
            DataTable dtOSIInformation = CollectionHelper.ConvertTo(lstOSIInformation, "");
            DataTable dtAWBHandlingMessage = CollectionHelper.ConvertTo(AWBHandlingMessage, "");
            DataTable dtAWBOSIModel = CollectionHelper.ConvertTo(AWBOSIModel, "");
            DataTable dtAWBOCIModel = CollectionHelper.ConvertTo(AWBOCIModel, "");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramOSIInformation = new SqlParameter();
            paramOSIInformation.ParameterName = "@OSIInformation";
            paramOSIInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramOSIInformation.Value = dtOSIInformation;

            SqlParameter paramAWBHandlingMessage = new SqlParameter();
            paramAWBHandlingMessage.ParameterName = "@AWBHandlingMessage";
            paramAWBHandlingMessage.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBHandlingMessage.Value = dtAWBHandlingMessage;

            SqlParameter paramAWBOSIModel = new SqlParameter();
            paramAWBOSIModel.ParameterName = "@AWBOSIInformation";
            paramAWBOSIModel.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBOSIModel.Value = dtAWBOSIModel;

            SqlParameter paramAWBOCIModel = new SqlParameter();
            paramAWBOCIModel.ParameterName = "@AWBOCIInformation";
            paramAWBOCIModel.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBOCIModel.Value = dtAWBOCIModel;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramOSIInformation, paramAWBHandlingMessage, paramAWBOSIModel, paramAWBOCIModel, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateOSIInfoAndHandlingMessageImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string UpdateAWBSummary(Int32 AWBSNo, List<ImportSummaryArray> Summary, Int32 UpdatedBy)
        {
            DataTable dtSummary = CollectionHelper.ConvertTo(Summary, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramAWBSummary = new SqlParameter();
            paramAWBSummary.ParameterName = "@AWBSummaryType";
            paramAWBSummary.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBSummary.Value = dtSummary;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramAWBSummary, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBSummaryImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string SaveFHLinfoImport(Int32 AWBSNo, Int32 ArrivedShipmentSNo, Int32 HAWBSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 ShipperSno, Int32 ConsigneeSno, int IsShipperEnable, int IsConsigneeEnable, bool IsFHLSave, int IsFHLAmendment, bool IsFHLAmendmentCharges, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<ImportHAWBInformation> lstHAWBInformation = new List<ImportHAWBInformation>();
            lstHAWBInformation.Add(HAWBInformation);
            DataTable dtHAWBInformation = CollectionHelper.ConvertTo(lstHAWBInformation, "");

            List<ImportShipperInformation> lstShipperInformation = new List<ImportShipperInformation>();
            lstShipperInformation.Add(ShipperInformation);
            DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");

            List<ImportConsigneeInformation> lstConsigneeInformation = new List<ImportConsigneeInformation>();
            lstConsigneeInformation.Add(ConsigneeInformation);
            DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

            List<ImportChargeDeclarations> lstChargeDeclarationsInformation = new List<ImportChargeDeclarations>();
            lstChargeDeclarationsInformation.Add(ChargeDeclarationsInformation);
            DataTable dtChargeDeclarationsInformation = CollectionHelper.ConvertTo(lstChargeDeclarationsInformation, "");

            DataTable dtOCIInformation = CollectionHelper.ConvertTo(OCIInformation, "");

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@HAWBInformation",dtHAWBInformation),
                                            new SqlParameter("@ShipperInformation",dtShipperInformation),
                                            new SqlParameter("@ConsigneeInformation",dtConsigneeInformation),
                                            new SqlParameter("@ChargeDeclarationsInformation",dtChargeDeclarationsInformation),
                                            new SqlParameter("@OCIInformation",dtOCIInformation),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ShipperSno", ShipperSno),
                                            new SqlParameter("@ConsigneeSno", ConsigneeSno),
                                            new SqlParameter("@IsShipperEnable", IsShipperEnable),
                                            new SqlParameter("@IsConsigneeEnable", IsConsigneeEnable),                              new SqlParameter("@IsFHLSave", IsFHLSave),
                                            new SqlParameter("@IsFHLAmendment", IsFHLAmendment),
                                            new SqlParameter("@IsFHLAmendmentCharges", IsFHLAmendmentCharges),
                                                      new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneeTaxParticipants",CreateConsigneeTaxParticipants),
                                             new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneeTaxId",CreateConsigneeTaxId)
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveFHLinfoImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string UpdateFHLinfoImport(Int32 AWBSNo, Int32 ArrivedShipmentSNo, Int32 HAWBSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 ShipperSno, Int32 ConsigneeSno, int IsShipperEnable, int IsConsigneeEnable, bool IsFHLSave, int IsFHLAmendment, bool IsFHLAmendmentCharges, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<ImportHAWBInformation> lstHAWBInformation = new List<ImportHAWBInformation>();
            lstHAWBInformation.Add(HAWBInformation);
            DataTable dtHAWBInformation = CollectionHelper.ConvertTo(lstHAWBInformation, "");

            List<ImportShipperInformation> lstShipperInformation = new List<ImportShipperInformation>();
            lstShipperInformation.Add(ShipperInformation);
            DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");

            List<ImportConsigneeInformation> lstConsigneeInformation = new List<ImportConsigneeInformation>();
            lstConsigneeInformation.Add(ConsigneeInformation);
            DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

            List<ImportChargeDeclarations> lstChargeDeclarationsInformation = new List<ImportChargeDeclarations>();
            lstChargeDeclarationsInformation.Add(ChargeDeclarationsInformation);
            DataTable dtChargeDeclarationsInformation = CollectionHelper.ConvertTo(lstChargeDeclarationsInformation, "");

            DataTable dtOCIInformation = CollectionHelper.ConvertTo(OCIInformation, "");

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@HAWBInformation",dtHAWBInformation),
                                            new SqlParameter("@ShipperInformation",dtShipperInformation),
                                            new SqlParameter("@ConsigneeInformation",dtConsigneeInformation),
                                            new SqlParameter("@ChargeDeclarationsInformation",dtChargeDeclarationsInformation),
                                            new SqlParameter("@OCIInformation",dtOCIInformation),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ShipperSno", ShipperSno),
                                            new SqlParameter("@ConsigneeSno", ConsigneeSno),
                                            new SqlParameter("@IsShipperEnable", IsShipperEnable),
                                            new SqlParameter("@IsConsigneeEnable", IsConsigneeEnable),
                                            new SqlParameter("@IsFHLSave", IsFHLSave),
                                            new SqlParameter("@IsFHLAmendment", IsFHLAmendment),
                                            new SqlParameter("@IsFHLAmendmentCharges", IsFHLAmendmentCharges),
                                            new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneeTaxParticipants",CreateConsigneeTaxParticipants),
                                             new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneeTaxId",CreateConsigneeTaxId)
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateFHLinfoImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string DeleteFHL(Int32 HAWBSNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "DeleteFHL", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string BindHAWBSectionData(Int32 HAWBSNo, int AWBSNo, int ArrivedShipmentSNo, string DestCity)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo),
                                          new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                          new SqlParameter("@DestCity", DestCity),
                                          new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@AirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordBindHAWBSectionData", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveFAD(Int32 ArrivedShipmentSNo, Int32 AWBSNo, Int32 ReportingStation, Int32 DiscrepancyType, Int32 DiscrepancySubType, Int32 Discrepancypieces, string DiscrepancyGrossweight, string DiscrepancyVolwt, string Remarks, Int32 UpdatedBy)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo), new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@ReportingStation", ReportingStation), new SqlParameter("@DiscrepancyType", DiscrepancyType), new SqlParameter("@DiscrepancySubType", DiscrepancySubType), new SqlParameter("@Discrepancypieces", Discrepancypieces), new SqlParameter("@DiscrepancyGrossweight", Convert.ToDecimal(DiscrepancyGrossweight)), new SqlParameter("@DiscrepancyVolwt", Convert.ToDecimal(DiscrepancyVolwt)), new SqlParameter("@Remarks", Remarks), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveFADImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<BindLocation>> BindLocation(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string[] getRecordID = recordID.Split('.');
                SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", getRecordID[0]), new SqlParameter("@AWBSNo", getRecordID[1]), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindLocationForImport", Parameters);
                var BindLocationList = ds.Tables[0].AsEnumerable().Select(e => new BindLocation
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    // AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    HAWBNo = Convert.ToString(e["HAWBNo"]),
                    //Received = Convert.ToString(e["RcvdPieces"]),
                    Location = e["AssignLocation"].ToString(),
                    MovableLocation = e["MovableLocation"].ToString(),
                    // StartPieces = Convert.ToInt32(e["StartPieces"]),
                    EndPieces = Convert.ToInt32(e["EndPieces"]),
                    Weight = Convert.ToDecimal(e["RcvdGrossWeight"].ToString()),

                });
                return new KeyValuePair<string, List<BindLocation>>("50", BindLocationList.AsQueryable().ToList());
            }

            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string BindFAASection(Int32 AWBSNO, Int32 ArrivedShipmentSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASection", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<BindFAASectionChargeDescription>> BindFAASectionChargeDescription(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            try
            {
                DataTable dt = new DataTable();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ArrivalShipmentSNo", recordID),
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", whereCondition),
                                            new SqlParameter("@OrderBy", sort),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASectionChargeDescription", Parameters);
                if (ds.Tables[0].Rows.Count > 0 && ds.Tables[0] != null)
                {
                    dt = null;

                    var FAASectionChargeDescription = ds.Tables[0].AsEnumerable().Where(row => row.Field<String>("isMandatory") == "1").OrderByDescending(row => row.Field<String>("TariffHeadName"));
                    if (FAASectionChargeDescription.Any())
                        dt = FAASectionChargeDescription.CopyToDataTable();
                    else
                        dt = ds.Tables[0].Clone();
                }

                var BindFAASectionChargeDescriptionList = dt.AsEnumerable().Select(e => new BindFAASectionChargeDescription
                {
                    TariffSNo = Convert.ToString(e["TariffSNo"]),
                    ChargeDescription = Convert.ToString(e["TariffHeadName"]),
                    ChargeCode = Convert.ToString(e["TariffCode"]),
                    Amount = e["ChargeAmount"].ToString()
                });

                return new KeyValuePair<string, List<BindFAASectionChargeDescription>>(dt.Rows.Count.ToString(), BindFAASectionChargeDescriptionList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public KeyValuePair<string, List<BindFAASectionAWBInformation>> BindFAASectionAWBInformation(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ArrivalShipmentSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASectionAWBInformation", Parameters);
                if (ds.Tables.Count > 0 && ds != null)
                {
                    var BindFAASectionAWBInformationList = ds.Tables[0].AsEnumerable().Select(e => new BindFAASectionAWBInformation
                    {
                        SNo = Convert.ToString(e["SNo"]),
                        AWBSNo = Convert.ToString(e["AWBSNo"]),
                        AWBNo = Convert.ToString(e["AWBNo"]),
                        Origin = Convert.ToString(e["Origin"]),
                        Pcs = e["Pcs"].ToString(),
                        Weight = Convert.ToString(e["Weight"]),
                        CCPP = e["CCPP"].ToString(),
                        CargoType = e["CargoType"].ToString(),
                        Contents = Convert.ToString(e["Contents"]),
                    });
                    return new KeyValuePair<string, List<BindFAASectionAWBInformation>>(ds.Tables[1].Rows[0][0].ToString(), BindFAASectionAWBInformationList.AsQueryable().ToList());
                }
                else
                {
                    return new KeyValuePair<string, List<BindFAASectionAWBInformation>>("Record not Found", Enumerable.Empty<BindFAASectionAWBInformation>().ToList<BindFAASectionAWBInformation>());

                }
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public KeyValuePair<string, List<BindFAASectionEmailHistory>> BindFAASectionEmailHistory(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ArrivalShipmentSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASectionEmailHistory", Parameters);
                if (ds.Tables[0].Rows.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Columns.Count > 1)
                {

                    var BindFAASectionEmailHistoryList = ds.Tables[0].AsEnumerable().Select(e => new BindFAASectionEmailHistory
                    {
                        SNo = Convert.ToString(e["SNo"]),
                        AWBSNo = Convert.ToString(e["AWBSNo"]),
                        AWBNo = Convert.ToString(e["AWBNo"]),
                        Origin = Convert.ToString(e["Origin"]),
                        Pcs = e["Pcs"].ToString(),
                        Weight = Convert.ToString(e["Weight"]),
                        CCPP = e["CCPP"].ToString(),
                        CargoType = e["CargoType"].ToString(),
                        Contents = Convert.ToString(e["Contents"]),
                        EmailSentdatetime = e["EmailSentdatetime"].ToString(),
                        EmailSentBy = e["EmailSentBy"].ToString(),
                        EmailSentTo = Convert.ToString(e["EmailSentTo"]),
                        Remarks = Convert.ToString(e["Remarks"]),
                        FAX = Convert.ToString(e["FAX"]),
                    });
                    return new KeyValuePair<string, List<BindFAASectionEmailHistory>>(ds.Tables[1].Rows[0][0].ToString(), BindFAASectionEmailHistoryList.AsQueryable().ToList());
                }

                else
                {
                    return new KeyValuePair<string, List<BindFAASectionEmailHistory>>("Record not Found", Enumerable.Empty<BindFAASectionEmailHistory>().ToList<BindFAASectionEmailHistory>());

                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<BindFAASectionSMSHistory>> BindFAASectionSMSHistory(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ArrivalShipmentSNo", recordID),
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", whereCondition),
                                            new SqlParameter("@OrderBy", sort)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASectionSMSHistory", Parameters);

                if (ds.Tables.Count > 0 && ds != null)
                {
                    var BindFAASectionEmailHistoryList = ds.Tables[0].AsEnumerable().Select(e => new BindFAASectionSMSHistory
                    {
                        SNo = e["SNo"].ToString(),
                        MobileNo = e["MobileNo"].ToString(),
                        SMSCotent = e["SMSContent"].ToString(),
                        SendAt = e["SendAt"].ToString(),
                        Status = e["Status"].ToString(),
                    });
                    return new KeyValuePair<string, List<BindFAASectionSMSHistory>>(ds.Tables[1].Rows[0][0].ToString(), BindFAASectionEmailHistoryList.AsQueryable().ToList());
                }

                else
                {
                    return new KeyValuePair<string, List<BindFAASectionSMSHistory>>("Record not Found", Enumerable.Empty<BindFAASectionSMSHistory>().ToList<BindFAASectionSMSHistory>());

                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetRecordAtAWDImport(Int32 AWBSNO, Int32 ArrivedShipmentSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtAWDImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveEDoxListAWD(Int32 AWBSNo, Int32 ArrivedShipmentSNo, List<ImportEDoxDetailAWD> AWDEDoxDetail, string AllEDoxReceived, string Consignee, string AuthorizedPerson, int CustomerType, string AuthorizedPersoneId, string AuthorizedPersoneName, string AuthorizedPersonCompany)
        {


            DataTable dtAWDEDoxDetail = CollectionHelper.ConvertTo(AWDEDoxDetail, "");

            SqlParameter paramAWDEDoxDetail = new SqlParameter();
            paramAWDEDoxDetail.ParameterName = "@AWDEDoxDetail";
            paramAWDEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWDEDoxDetail.Value = dtAWDEDoxDetail;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                          new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                          paramAWDEDoxDetail,
                                          new SqlParameter("@AllEDoxReceived", AllEDoxReceived),
                                          new SqlParameter("@Consignee", Consignee),
                                          new SqlParameter("@AuthorizedPerson", AuthorizedPerson),
                                          new SqlParameter("@CustomerType", CustomerType),
                                          new SqlParameter("@AuthorizedPersoneId", AuthorizedPersoneId),
                                          new SqlParameter("@AuthorizedPersoneName", AuthorizedPersoneName),
                                          new SqlParameter("@AuthorizedPersonCompany", AuthorizedPersonCompany),
                                          new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveEDoxListAWDImport", Parameters);
                DeleteSelectedFiles();
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveAWBEDoxDetail(Int32 AWBSNo, Int32 ArrivedShipmentSNo, List<ImportAWBEDoxDetail> AWBEDoxDetail, List<ImportSPHCDoxArray> SPHCDoxArray, string AllEDoxReceived, string Remarks, List<EDoxCheckListDetail> EDoxCheckListDetail)
        {
            DataTable dtAWBEDoxDetail = CollectionHelper.ConvertTo(AWBEDoxDetail, "");
            DataTable dtSPHCDoxArray = CollectionHelper.ConvertTo(SPHCDoxArray, "");
            DataTable dtEDoxCheckListArray = CollectionHelper.ConvertTo(EDoxCheckListDetail, "");

            dtSPHCDoxArray.Columns.Add("FileBinary", typeof(byte[]));
            foreach (DataRow dr in dtSPHCDoxArray.Rows)
            {
                if (dr["AltDocName"].ToString() != "")
                {
                    var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr["AltDocName"].ToString());
                    dr["FileBinary"] = ReadFile(serverPath);
                }
            }

            dtEDoxCheckListArray.Columns.Add("FileBinary", typeof(byte[]));
            foreach (DataRow dr in dtSPHCDoxArray.Rows)
            {
                if (dr["EDoxAltDocName"].ToString() != "")
                {
                    var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr["EDoxAltDocName"].ToString());
                    dr["FileBinary"] = ReadFile(serverPath);
                }
            }

            dtEDoxCheckListArray.Columns.Remove("FileBinary");
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@AWBEDoxDetail", dtAWBEDoxDetail),
                                            new SqlParameter("@SPHCDocDetails", dtSPHCDoxArray),
                                            new SqlParameter("@EdoxCheckListDetail", dtEDoxCheckListArray),
                                            new SqlParameter("@AllEDoxReceived", AllEDoxReceived),
                                            new SqlParameter("@Remarks", Remarks),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAWBEDoxDetailsImport", Parameters);
                DeleteSelectedFiles();
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public static void DeleteSelectedFiles()
        {
            try
            {

                if (System.IO.Directory.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/")))
                {
                    string[] files = System.IO.Directory.GetFiles(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/"));
                    foreach (string s in files)
                    {
                        if (s.Split('\\').Last().Split('_')[0] == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                        {
                            File.Delete(s);
                        }
                    }
                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public static byte[] ReadFile(string imageLocation)
        {

            byte[] imageData = null;
            FileInfo fileInfo = new FileInfo(imageLocation);
            long imageFileLength = fileInfo.Length;
            FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
            BinaryReader br = new BinaryReader(fs);
            imageData = br.ReadBytes((int)imageFileLength);
            fs.Dispose();
            br.Dispose();
            return imageData;
        }

        public string SaveFAA(Int32 AWBSNo, Int32 ArrivedShipmentSNo, string DeliveryOrderFee, string DeliveryHandlingCharge, string SitaEmailAddress, string Remarks, string FAX, string ConsigneeContact)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@DeliveryOrderFee", Convert.ToDecimal(DeliveryOrderFee)),
                                            new SqlParameter("@DeliveryHandlingCharge", Convert.ToDecimal(DeliveryHandlingCharge)),
                                            new SqlParameter("@SitaEmailAddress", SitaEmailAddress),
                                            new SqlParameter("@Remarks", Remarks),
                                            new SqlParameter("@FAX", FAX),
                                            new SqlParameter("@ConsigneeContact", ConsigneeContact),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveFAAImport", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        /*********Manish***********/
        public string CheckWaybillDetail(string AWBNo, int ArrivedShipmentSNo, int ICNNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo),
                                          new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                           new SqlParameter("@POMailSNo", ICNNo)

                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCheckWaybillDetail", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetDeliveryOrderRecord(int AWBSNo, int ArrivedShipmentSNo, string DOType, string DestCity, int POMailSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWBSNo", AWBSNo),
                                           new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                           new SqlParameter("@DOType", DOType),
                                           new SqlParameter("@DestCity", DestCity),
                                           new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                           new SqlParameter("@POMailSNo",POMailSNo)

                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetDeliveryOrderDetail", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetPhysicalDeliveryOrderRecord(int DOSNo, int POMailSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           new SqlParameter("@DOSNo", DOSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                           new SqlParameter("@POMailSNo", POMailSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetDeliveryProcessDetail", Parameters);
                ds.Dispose();

                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                return CompleteDStoJSONDO(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GetPaymentDetail(string strData)
        {
            SavePaymentRequest doRequest = new SavePaymentRequest();

            doRequest = JsonConvert.DeserializeObject<SavePaymentRequest>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
            SqlParameter paramHandlingCharge = new SqlParameter();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@Awbsno", doRequest.AWBSNo),
                                            new SqlParameter("@Dosno", doRequest.DONumber),
                                            new SqlParameter("@pomailSno", doRequest.PomailSno)
                                        };
            DataSet ds1 = new DataSet();
            try
            {

                //  DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetPaymentDetail", Parameters);
                string ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "usp_GetPaymentDetail", Parameters).Tables[0].Rows[0][0];
                return ret;


            }

            catch (Exception ex)//
            {
                throw ex;
            }

        }

        public string SaveAtPayment(string strData)
        {
            SavePaymentRequest doRequest = new SavePaymentRequest();
            string Message = "";
            doRequest = JsonConvert.DeserializeObject<SavePaymentRequest>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));

            DataTable dtHandlingCharges = CollectionHelper.ConvertTo(doRequest.lstHandlingCharges, "");
            SqlParameter paramHandlingCharge = new SqlParameter();
            paramHandlingCharge.ParameterName = "@HandlingCharge";
            paramHandlingCharge.SqlDbType = System.Data.SqlDbType.Structured;
            paramHandlingCharge.Value = dtHandlingCharges;

            SqlParameter[] Parameters = { paramHandlingCharge,
                                            new SqlParameter("@CityCode", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@MovementType", 1),
                                            new SqlParameter("@Process", 22),
                                            new SqlParameter("@DOSNo", doRequest.DONumber),
                                            new SqlParameter("@PDSNo", 0),
                                            new SqlParameter("@SubProcessSNo", 2135),
                                            new SqlParameter("@ChargeToSNo", 0),
                                            new SqlParameter("@IsESS",0),
                                            new SqlParameter("@BilltoAccountSNo",0),
                                            new SqlParameter("@Shippername",doRequest.Shippername),
                                            new SqlParameter("@DONumber",""),
                                            new SqlParameter("@HAWBSNo",0),
                                            new SqlParameter("@AirMailSNo_Payment",0),
                                            new SqlParameter("@ErrorMessage",Message) {Direction=ParameterDirection.Output }
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveAtPaymentInvoice_savedo", Parameters);
                try
                {
                    Message = (Parameters[15].Value.ToString());
                }
                catch (Exception ex) { }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Message;
        }

        public string SaveDO(string strData, int POMailSNo, string GSTNo, string loginAirportSno)
        {
            SaveDORequest doRequest = new SaveDORequest();

            doRequest = JsonConvert.DeserializeObject<SaveDORequest>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
            List<DeliveryOrderInfo> lstDeliveryOrderInfo = new List<DeliveryOrderInfo>();
            lstDeliveryOrderInfo.Add(doRequest.DeliveryOrderInfo);

            DataTable dtDeliveryOrderInfo = CollectionHelper.ConvertTo(lstDeliveryOrderInfo, "Text_HAWBSNo");
            DataTable dtHandlingCharges = CollectionHelper.ConvertTo(doRequest.lstHandlingCharges, "");
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(doRequest.lstShipmentDetailDetail, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                        new SqlParameter("@AWBSNo",doRequest.AWBSNo),
                                        new SqlParameter("@DeliveryOrderInfoTable",dtDeliveryOrderInfo),
                                        new SqlParameter("@HandlingChargesTable",dtHandlingCharges),
                                        new SqlParameter("@ShipmentInfoTable",dtShipmentInfo),
                                        new SqlParameter("@POMailSNo",POMailSNo),
                                        new SqlParameter("@RushHandling",doRequest.RushHandling),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        new SqlParameter("@GSTNo",GSTNo),
                                        new SqlParameter("@LoginAirportSNo",loginAirportSno)
                                    };
            try
            {
                string ret = "";
                ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveDo", param).Tables[1].Rows[0][0];
                return ret;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SaveDOPayment(List<ImportPayment> lstDOPayment)
        {
            DataTable dtDOPayment = CollectionHelper.ConvertTo(lstDOPayment, "");

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                        new SqlParameter("@DOPaymentTable",dtDOPayment),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                    };
            try
            {
                string ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveDoPayment", param).Tables[0].Rows[0][0];
                return ret;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string SaveDLVInfo(PhysicalDeliveryInfo PhysicalDeliveryInfo)
        {
            List<PhysicalDeliveryInfo> lstPhysicalDeliveryInfo = new List<PhysicalDeliveryInfo>();
            lstPhysicalDeliveryInfo.Add(PhysicalDeliveryInfo);
            DataTable dtDLVInfo = CollectionHelper.ConvertTo(lstPhysicalDeliveryInfo, "Text_HAWBSNo");

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                        new SqlParameter("@DeliveryOrderInfoTable",dtDLVInfo),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                    };
            try
            {
                string ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SavePhysicalDelivery", param).Tables[0].Rows[0][0];
                return ret;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string SaveChargeNote(string strData)
        {
            saveChargeNoteRequest chargenoteRequest = new saveChargeNoteRequest();

            chargenoteRequest = JsonConvert.DeserializeObject<saveChargeNoteRequest>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));

            DataTable dtHandlingCharges = CollectionHelper.ConvertTo(chargenoteRequest.lstHandlingCharges, "");
            //DataTable dtServiceCharges = CollectionHelper.ConvertTo(lstServiceCharges, "AWBSNo");
            //dtHandlingCharges.Columns.Add("WaveOff", typeof(bool), "0");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                        new SqlParameter("@PDSNo",chargenoteRequest.PDSNo),
                                        new SqlParameter("@BillToSNo",chargenoteRequest.BillToSNo),
                                        new SqlParameter("@BillTo",chargenoteRequest.BillTo),
                                        new SqlParameter("@HandlingChargesTable",dtHandlingCharges),
                                        //new SqlParameter("@ServiceChargesTable",dtServiceCharges),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                    };
            try
            {
                string ret = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveChargeNote", param).Tables[0].Rows[0][0].ToString();
                return ret;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string GetDeliveryOrderPrint(int DOSNo, string Type, int InvoiceSNo, int POMailSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                          new SqlParameter("@DOSNo", DOSNo),
                                          new SqlParameter("@Type", Type),
                                           new SqlParameter("@InvoiceSNo", InvoiceSNo),
                                           new SqlParameter("@POMailSNo", POMailSNo),

                                         // new SqlParameter("@InvoiceSNo", InvoiceSNo),
                                          new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetDeliveryOrderPrint", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetPhysicalDeliveryPrint(int PDSNo, int OFW, int Disable)
        {
            try
            {
                SqlParameter[] Parameters = {
                                          new SqlParameter("@PDSNo", PDSNo),
                                          new SqlParameter("@OFW",OFW),
                                          new SqlParameter("@Disable",Disable),
                                          new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetPhysicalDeliveryPrint", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetPhysicalDODetail(int AWBSNo, int ArrivedShipmentSNo, int POMailSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWBSNo", AWBSNo),
                                           new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                           new SqlParameter("@POMailSNo", POMailSNo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetPhysicalDODetail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string CheckWarehousePDS(int DOSNo, int awbSNo, int OFW)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           new SqlParameter("@DOSNo", DOSNo),
                                           new SqlParameter("@awbSNo", awbSNo),
                                           new SqlParameter("@OFW", OFW)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetCheckWarehousePDS", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GetCancelDODetail(int AWBSNo, int POMailSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWBSNo", AWBSNo),
                                           new SqlParameter("@POMailSNo", POMailSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetCancelDODetail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetChargeNotePrintRecord(int InvoiceSNo, int PDSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", InvoiceSNo), new SqlParameter("@PDSNo", PDSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChargeNotePrintRecordImport", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public static string CompleteDStoJSONDO(DataSet ds)
        {
            StringBuilder json = new StringBuilder();
            if (ds != null && ds.Tables.Count > 0)
            {
                json.Append("{");
                bool isList = false;
                for (int tblCount = 0; tblCount < ds.Tables.Count; tblCount++)
                {
                    if (tblCount > 0)
                        json.Append(",");
                    json.Append("\"Table" + tblCount.ToString() + "\":");
                    int lInteger = 0;
                    json.Append("[");
                    isList = ds.Tables[tblCount].Columns.Contains("list");
                    foreach (DataRow dr in ds.Tables[tblCount].Rows)
                    {
                        lInteger = lInteger + 1;
                        json.Append("{");
                        int i = 0;
                        int colcount = dr.Table.Columns.Count;
                        foreach (DataColumn dc in dr.Table.Columns)
                        {
                            json.Append("\"");
                            json.Append((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName));
                            json.Append("\":\"");
                            if (dc.DataType.Name.ToUpper() == "DATETIME")
                            {
                                //json.Append(dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString(CargoFlash.SoftwareFactory.Data.DateFormat.DateFormatString));
                                json.Append(dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString("dd-MMM-yyyy hh:mm"));
                            }
                            else
                                json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                            json.Append("\"");
                            i++;
                            if (i < colcount) json.Append(",");
                        }

                        if (lInteger < ds.Tables[tblCount].Rows.Count)
                        {
                            json.Append("},");
                        }
                        else
                        {
                            json.Append("}");
                        }
                    }
                    json.Append("]");
                }
                json.Append("}");
            }
            else
            {
                json.Append("[");
                json.Append("]");
            }


            return json.ToString();
        }

        public string GetDeliveryOrderPaymentType(int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, int PDSNo, int ProcessSNo, int SubProcessSNo, List<DOShipmentInfo> ShipmentDetailArray)
        {
            try
            {
                DataTable dtShipmentInfo = CollectionHelper.ConvertTo(ShipmentDetailArray, "ULDSNo");
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWBSNo", AWBSNo),
                                           new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                           new SqlParameter("@DestinationCity", DestinationCity),
                                           new SqlParameter("@PDSNo", PDSNo),
                                           new SqlParameter("@ProcessSNo", ProcessSNo),
                                           new SqlParameter("@SubProcessSNo", SubProcessSNo),
                                           new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@PartShipmentType",dtShipmentInfo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetDeliveryOrderPaymentType", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GatValueOfAutocomplete(int SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTariffChargeDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.DStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, decimal PValue, decimal SValue, int HAWBSNo, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int DOSNo = 0, int PDSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", DestinationCity),
                                            new SqlParameter("@MovementType", 1),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", ProcessSNo),
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@DOSNo", DOSNo),
                                            new SqlParameter("@PDSNo", PDSNo),
                                            new SqlParameter("@RateType", 0),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", TariffSNo),
                                            new SqlParameter("@PrimaryValue", PValue),
                                            new SqlParameter("@SecondaryValue", SValue),
                                            new SqlParameter("@TaxReturn", 1),
                                            new SqlParameter("@IsMandatory", 0),
                                            new SqlParameter("@IsESS", 0),
                                            new SqlParameter("@GrWT", GrWt),
                                            new SqlParameter("@VolWt", VolWt),
                                            new SqlParameter("@ChWt", ChWt),
                                            new SqlParameter("@Pieces", Piecs),
                                            new SqlParameter("@Remarks", Remarks)
                                        };


                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CancelDO(int DOSNo, List<DOHandlingCharges> lstHandlingCharges, string BillTo, string BillToText, int POMailSNo)
        {
            DataTable dtHandlingCharges = CollectionHelper.ConvertTo(lstHandlingCharges, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                        new SqlParameter("@DOSNo",DOSNo),
                                        new SqlParameter("@HandlingChargesTable",dtHandlingCharges),
                                        new SqlParameter("@BillTo",BillTo),
                                         new SqlParameter("@BillToText",BillToText),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        new SqlParameter("@POMailSNo",POMailSNo),
                                    };
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CancelDO", param);
                string ret = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                return ret;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string GetPaymentRecord(int AWBSNo, int POMailSNo, int dosno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                        new SqlParameter("@POMailSNo", POMailSNo),
                 new SqlParameter("@dosno", dosno)};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetPaymentRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GetFOCConsignee(int AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@CitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetFOCConsignee", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetExchangeRate(int OrigCurr, int DestCurr, int AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@OrigCurr", OrigCurr),
                                            new SqlParameter("@DestCurr", DestCurr),
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetExchangeRate", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetHandlingChargesRecorde(int AWBSNo, int ArrivedShipmentSNo, string DOType, string DestCity, int HAWBSNo, int DOSNo, int PDSNo, int TariffSNo, decimal PValue, decimal SValue, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int ProcessSNo = 0, int SubProcessSNo = 0)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWBSNo", AWBSNo),
                                           new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                           new SqlParameter("@DOType", DOType),
                                           new SqlParameter("@DestCity", DestCity),
                                           new SqlParameter("@HAWBSNo",HAWBSNo),
                                           new SqlParameter("@DOSNo",DOSNo),
                                           new SqlParameter("@PDSNo",PDSNo),
                                           new SqlParameter("@TariffSNo",TariffSNo),
                                           new SqlParameter("@PValue",PValue),
                                           new SqlParameter("@SValue",SValue),
                                           new SqlParameter("@GrWt",GrWt),
                                           new SqlParameter("@VolWt",VolWt),
                                           new SqlParameter("@ChWt",ChWt),
                                           new SqlParameter("@Piecs",Piecs),
                                           new SqlParameter("@Remarks",Remarks),
                                           new SqlParameter("@ProcessSNo",ProcessSNo),
                                           new SqlParameter("@SubProcessSNo",SubProcessSNo),
                                           new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetHandlingChargesRecorde", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckCreditLimit(int BillTo, decimal TotalCredit)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                        new SqlParameter("@BillTo",BillTo),
                                        new SqlParameter("@TotalCredit",TotalCredit)

                                    };
            try
            {
                string ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CheckCreditLimit", param).Tables[0].Rows[0][0];
                return ret;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string GetDelivered(string AWBSNo, int isDelivered, int DOsnoval)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                        new SqlParameter("@isDelivered",isDelivered),
                                        new SqlParameter("@AWBSNo",AWBSNo),
                                        new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                        new SqlParameter("@DOsnoval",DOsnoval)
                                    };
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetDelivered", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string GetLocationData(int AWBSNo, int ArrivedShipmentSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetLocationData", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckAgentCreditLimit(int AgentSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AgentSNo", AgentSNo),
                                            new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCheckAgentCreditLimit", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetBillToForworderName(int AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBillToForworderName", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GetBupDetails(int AWBSNo, int ULDStockSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@ULDStockSNo", ULDStockSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBupDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.DStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCharges(int TariffSNo, int AWBSNo, string CityCode, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, decimal pValue, decimal sValue, int Pieces, int DOSNo, int PDSNo, List<DOShipmentInfo> lstShipmentInfo, String Remarks, int POMailSNo)
        {
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(lstShipmentInfo, "ULDSNo");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
            {
                 new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", CityCode),
                                            new SqlParameter("@MovementType", 1),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", ProcessSNo),
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", 0),
                                           new SqlParameter("@DOSNo", DOSNo),
                                            new SqlParameter("@PDSNo", PDSNo),
                                            new SqlParameter("@RateType", 0),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", TariffSNo),
                                            new SqlParameter("@PrimaryValue", pValue),
                                            new SqlParameter("@SecondaryValue", sValue),
                                            new SqlParameter("@TaxReturn", 1),
                                            new SqlParameter("@IsMandatory", 0),
                                            new SqlParameter("@IsESS", 0),
                                            new SqlParameter("@GrWT", GrWT),
                                            new SqlParameter("@VolWt", 0),
                                            new SqlParameter("@ChWt", ChWt),
                                            new SqlParameter("@Pieces", Pieces),
                                            //new SqlParameter("@Remarks", ""),
                                              new SqlParameter("@Remarks",Remarks),
                                            new SqlParameter("@PartShipmentType",dtShipmentInfo),
                                            new SqlParameter("@AirMailSNo",POMailSNo)

                                    };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIEInbound", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        /// <summary>
        /// Get Storage Charge 
        /// </summary>
        /// <param name="AwbSno">AwbSno</param>
        /// <returns>JSON String</returns>
        public string GetStorageCharge(int AWBSNo)
        {
            SqlParameter[] SqlParam = { new SqlParameter("@AwbSNo", AWBSNo) };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SPGetStorageCharge", SqlParam);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;

            }

        }

        public string CheckPayment(int DOSNo, int PDSNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                      new SqlParameter("@DOSNo", DOSNo),
                                      new SqlParameter("@PDSNo", PDSNo)
                                    };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetCheckPayment", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string CheckPaymentCharges(int DOSNo, int PDSNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
                                    {
                                      new SqlParameter("@DOSNo", DOSNo),
                                      new SqlParameter("@PDSNo", PDSNo)
                                    };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetCheckPayment_Charges", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }
        public string ESSGetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, decimal PValue, decimal SValue, int HAWBSNo, int MovementType, int RateType, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int DOSNo = 0, int PDSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", DestinationCity),
                                            new SqlParameter("@MovementType", MovementType),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", 1004),
                                            new SqlParameter("@SubProcessSNo", 2306),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@DOSNo", DOSNo),
                                            new SqlParameter("@PDSNo", PDSNo),
                                            new SqlParameter("@RateType", RateType),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", TariffSNo),
                                            new SqlParameter("@PrimaryValue", PValue),
                                            new SqlParameter("@SecondaryValue", SValue),
                                            new SqlParameter("@TaxReturn", 1),
                                            new SqlParameter("@IsMandatory", 0),
                                            new SqlParameter("@IsESS", 1),
                                            new SqlParameter("@GrWT", GrWt),
                                            new SqlParameter("@VolWt", VolWt),
                                            new SqlParameter("@ChWt", ChWt),
                                            new SqlParameter("@Pieces", Piecs),
                                            new SqlParameter("@Remarks", Remarks)
                                        };


                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetHouseWiseDetail(Int32 HAWBSNo, int AWBSNo, int ArrivedShipmentSNo, string DestCity)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo),
                                          new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                          new SqlParameter("@DestCity", DestCity),
                                          new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetHouseWiseDetail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;

            }
        }

        public string GetAndCheckCompleteShipment(int AWBSNo, int HAWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@HAWBSNo", HAWBSNo),
                                          new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetAndCheckCompleteShipment", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetDoSaveInfo(int AWBSNo, int DOSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                         new SqlParameter("@DOSNo", DOSNo)

                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetDoSaveInfo", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveFHLHarmonizedCommodity(List<HarmonizedCommodityCode> HarmonizedCommodityCode, string HAWBNo, string AwbSNo)
        {
            try
            {
                DataTable dtHarmonizedCommodityCode = CollectionHelper.ConvertTo(HarmonizedCommodityCode, "");
                SqlParameter[] param = { new SqlParameter("@dtHarmonizedCommodityCode", dtHarmonizedCommodityCode), new SqlParameter("@HAWBNo", HAWBNo), new SqlParameter("@AwbSNo", AwbSNo) };
                return (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "ImportSaveHarmonizedCommodty", param).Tables[0].Rows[0][0];
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }

        }

        public string SaveFHLHAWBDescription(List<HawbDescription> HawbDescription, string HAWBNo, string AwbSNo)
        {
            try
            {
                DataTable dtHawbDescription = CollectionHelper.ConvertTo(HawbDescription, "");
                SqlParameter[] param = { new SqlParameter("@dtHawbDescription", dtHawbDescription), new SqlParameter("@HAWBNo", HAWBNo), new SqlParameter("@AwbSNo", AwbSNo) };
                return (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "ImportSaveDescription", param).Tables[0].Rows[0][0];
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }

        }

        public string GetHAWBNoDetails(string HAWBNo, string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@HAWBNo", HAWBNo),
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHAWBNoDetailsFHLImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string BindShipmentDetail(int AWBSNo, int ArrivedShipmentSNo, string DOType)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                          new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                          new SqlParameter("@DOType", DOType),
                                          new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                          new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spBindShipmentDetail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveCustomInfo(string strData)
        {
            try
            {
                CustomReferneceNumber CustomReferneceNumber = JsonConvert.DeserializeObject<CustomReferneceNumber>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                string Message = "";
                DataTable dtCustomReferneceNumber = CollectionHelper.ConvertTo(CustomReferneceNumber.lstCustomReference, "lstCustomReference");
                SqlParameter paramCustomRefernece = new SqlParameter();
                paramCustomRefernece.ParameterName = "@CustomRefernece";
                paramCustomRefernece.SqlDbType = System.Data.SqlDbType.Structured;
                paramCustomRefernece.Value = dtCustomReferneceNumber;
                SqlParameter[] Parameters = {
                                            paramCustomRefernece,
                                             new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())


                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSaveCustomInfo", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveCustomReference(string AWBSNo, string BOEVerification, string UpdatedBy, string BOENo, string BOEDate)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo.ToString()),
                                            new SqlParameter("@BOEVerification", BOEVerification),
                                             new SqlParameter("@UpdatedBy", UpdatedBy),
                                            new SqlParameter("@BOENo",BOENo),
                                            new SqlParameter("@BOEDate",BOEDate)
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spDO_SaveCustomeDetails", Parameters);

                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string GetRecordCustomInfo(string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomInfo", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetRecordAtAWBCustRef(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtDOCustomRecord", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetFADIrregurality(string AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetFADIrregurality", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public string GetInvoiceType(string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetInvoiceType", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetPendingInvoice(string AWBSno, string DOSNo, string DLVSno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSno", AWBSno),
                new SqlParameter("@DOSNo", DOSNo),
                new SqlParameter("@DLVSno", DLVSno)};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetPendingInvoice", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetFlightArrivalFlightInformation(Int32 DailyFlightSno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSno) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetFlightArrivalFlightInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string GetDetailsByAirlineAWB(string AWB, string Type)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWB", AWB), new SqlParameter("@Type", Type) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDetailsByAirlineAWB", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string saveDOShipment(List<ConsignmentDetails> ConsignmentDetails, List<FlightCheckInDetails> FlightCheckInDetails, int DailyFlightSNo, int waybilltype, string wayBillNo)
        {
            try
            {
                DataTable dtConsignmentDetails = CollectionHelper.ConvertTo(ConsignmentDetails, "");
                DataTable dtFlightCheckInDetails = CollectionHelper.ConvertTo(FlightCheckInDetails, "");

                SqlParameter paramdtConsignmentDetails = new SqlParameter();
                paramdtConsignmentDetails.ParameterName = "@ConsignmentDetails";
                paramdtConsignmentDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramdtConsignmentDetails.Value = dtConsignmentDetails;


                SqlParameter paramFlightCheckInDetails = new SqlParameter();
                paramFlightCheckInDetails.ParameterName = "@FlightCheckInType";
                paramFlightCheckInDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramFlightCheckInDetails.Value = dtFlightCheckInDetails;

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                    paramdtConsignmentDetails,
                    paramFlightCheckInDetails,
                    new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                    new SqlParameter("@UpdatedBy",Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())),
                    new SqlParameter("@LoginAirportSNo", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString())),
                    new SqlParameter("@WayBillType",waybilltype),
                    new SqlParameter("@WayBillNo",wayBillNo)
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveDoShipmentDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string getDailyFlightSnoByFilter(string origin, string destination, string flightDate, string flightNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] parameters = {
                    new SqlParameter("@origin", origin),
                    new SqlParameter("@destination", destination),
                    new SqlParameter("@flightDate",flightDate) ,
                    new SqlParameter("@flightNo",flightNo)
                };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "getDailyFlightSnoByFilter", parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string getArrivedShipmentDetail(string wayBillNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] parameters = {
                    new SqlParameter("@wayBillNo", wayBillNo)
                };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "getArrivedShipmentDetail", parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string ImportGetAWBPrintData(int? AwbNo)
        {
            try
            {


                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AwbNo),
                     new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))?.UserSNo))
                };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Import_GetAWBPrintData", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string getCustomerDetails(string customerNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] parameters = {
                    new SqlParameter("@CustomerNo", customerNo)
                };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "getCustomerDetails", parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    public class SaveDORequest
    {
        public int? AWBSNo { get; set; }
        public bool? RushHandling { get; set; }
        public DeliveryOrderInfo DeliveryOrderInfo { get; set; }
        public List<DOHandlingCharges> lstHandlingCharges { get; set; }
        public List<DOShipmentInfo> lstShipmentDetailDetail { get; set; }

    }

    public class SavePaymentRequest
    {
        public int? AWBSNo { get; set; }
        public bool? RushHandling { get; set; }
        public List<DOHandlingCharges> lstHandlingCharges { get; set; }
        public string Shippername { get; set; }
        public string DONumber { get; set; }
        public int? PomailSno { get; set; }
    }

    public class saveChargeNoteRequest
    {
        public int PDSNo { get; set; }
        public int BillToSNo { get; set; }
        public string BillTo { get; set; }
        public List<DOHandlingCharges> lstHandlingCharges { get; set; }
    }
}
