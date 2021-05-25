using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Import
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class FWBImportService :BaseWebUISecureObject, IFWBImportService
    {
        
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string searchAirline = "", string searchFlightNo = "", string searchAWBNo = "", string searchFromDate = "", string searchToDate = "", string SearchIncludeTransitAWB = "", string SearchExcludeDeliveredAWB = "", string LoggedInCity = "")
        {
            try
            {
                LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
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
                            case "FWBIMPORT":
                                if (appName.ToUpper().Trim() == "FWBIMPORT")
                                    CreateGrid(myCurrentForm, processName, searchAirline, searchFlightNo, searchAWBNo, searchFromDate, searchToDate);
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Import/FWBImportService.svc/GetFWBImportGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "FWB";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.ProcessName = ProcessName;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "SLINo", IsLocked = false, Title = "Lot No", DataType = GridDataType.String.ToString(), Width = 60 });

                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Org", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "ShipmentDestination", IsLocked = false, Title = "Final Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "Status", IsLocked = false, Title = "Status", DataType = GridDataType.String.ToString(), Width = 40 });

                    g.Column.Add(new GridColumn { Field = "AWBDate", Title = "AWB Date", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ChWt", Title = "Ch. Wt", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flt No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flt Date", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 80 });

                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AccPcs", Title = "AccPcs", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccGrWt", Title = "AccGrWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AccVolWt", Title = "AccVolWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "FBLWt", Title = "FBLWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "FWBWt", Title = "FWBWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "RCSWt", Title = "RCSWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });
                    //g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });

                    //g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 40 });
                    //g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 60 });
                    //g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 60 });
                    //g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString(), Width = 40 });
                    //g.Column.Add(new GridColumn { Field = "Destination", Title = "Destination", DataType = GridDataType.String.ToString(), Width = 40 });
                    //g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 40 });
                    //g.Column.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    //g.Column.Add(new GridColumn { Field = "ATA", Title = "ATA", DataType = GridDataType.String.ToString(), IsHidden = true });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchAirline", Value = searchAirline });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFlightNo", Value = searchFlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBNo", Value = searchAWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });
                    //g.ExtraParam.Add(new GridExtraParam { Field = "SearchIncludeTransitAWB", Value = SearchIncludeTransitAWB });
                    //g.ExtraParam.Add(new GridExtraParam { Field = "SearchExcludeDeliveredAWB", Value = SearchExcludeDeliveredAWB });
                    g.InstantiateIn(Container);

                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetFWBImportGridData(string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "GetListFWBImportBookingParam";
                string filters = GridFilter.ProcessFilters<FWBImportGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@searchAirline", searchAirline), new SqlParameter("@searchFlightNo", searchFlightNo), new SqlParameter("@searchAWBNo", searchAWBNo), new SqlParameter("@searchFromDate", searchFromDate), new SqlParameter("@searchToDate", searchToDate), new SqlParameter("@LoggedInCity", "") };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var FWBImportList = ds.Tables[0].AsEnumerable().Select(e => new FWBImportGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    SLINo = e["SLINo"].ToString(),
                    //AWBDate = e["AWBDate"].ToString() == "" ? "" : Convert.ToDateTime(e["AWBDate"].ToString()).ToString("yyyy/MM/dd"),
                    AWBDate = e["AWBDate"].ToString(),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Gross = Convert.ToDecimal(e["Gross"].ToString()),
                    Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
                    ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
                    Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
                    FlightNo = e["FlightNo"].ToString(),
                    //FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("yyyy/MM/dd"),
                    FlightDate = Convert.ToString(e["FlightDate"]),
                    FlightOrigin = e["FlightOrigin"].ToString(),
                    FlightDestination = e["FlightDestination"].ToString(),
                    Status = e["Status"].ToString(),
                    CommodityCode = e["CommodityCode"].ToString(),
                    ProductName = e["ProductName"].ToString(),
                    NoOfHouse = e["NoOfHouse"].ToString(),
                    AccGrWt = Convert.ToDecimal(e["AccGrWt"].ToString()),
                    AccVolWt = Convert.ToDecimal(e["AccVolWt"].ToString() == "" ? "0" : e["AccVolWt"].ToString()),
                    AccPcs = Convert.ToInt32(e["AccPcs"].ToString() == "" ? "0" : e["AccPcs"].ToString()),
                    Shipper = "",
                    Consignee = "",
                    HandlingInfo = "",
                    XRay = "",
                    Location = "",
                    Payment = "",
                    Dimension = "",
                    Weight = "",
                    Reservation = "",
                    HAWB = "",
                    ShippingBill = "",
                    Document = "",
                    IsWarning = Convert.ToBoolean(e["IsWarning"]),
                    WarningRemarks = e["WarningRemarks"].ToString(),
                    //FBLWt = Convert.ToDecimal(e["FBLWt"].ToString() == "" ? "0" : e["FBLWt"].ToString()),
                    FWBWt = Convert.ToDecimal(e["FWBWt"].ToString() == "" ? "0" : e["FWBWt"].ToString()),
                    RCSWt = Convert.ToDecimal(e["RCSWt"].ToString() == "" ? "0" : e["RCSWt"].ToString())
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = FWBImportList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public Stream GetGridData(string processName, string moduleName, string appName, string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string LoggedInCity)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", searchAirline: searchAirline, searchFlightNo: searchFlightNo, searchAWBNo: searchAWBNo, searchFromDate: searchFromDate, searchToDate: searchToDate,LoggedInCity: LoggedInCity);
        }

        public string GetProcessSequence(string ProcessName)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequence", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetFWBImportInformation(Int32 AWBSNO)
        {

            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFWBImportInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAWBRateDetails(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBRateDetails_FWBImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// 
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
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsAndULDNew_FWBImport", Parameters);
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
            catch(Exception ex)//
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
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDimemsionsAndULDRate_FWBImport", Parameters);
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
            catch(Exception ex)//
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
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBOtherChargeData_FWBImport", Parameters);
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetShipperAndConsigneeInformation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperAndConsigneeInformation_FWBImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@FieldType", FieldType), new SqlParameter("@SNO", SNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperConsigneeDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetOSIInfoAndHandlingMessage(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOSIInfoAndHandlingMessage_FWBImport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
