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
    public class ReceivedConsumableService : BaseWebUISecureObject, IReceivedConsumableService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string searchAirline = "", string searchFlightNo = "", string FlightDate = "", string LoggedInCity = "",string Type="0")
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
                        case "RECEIVEDCONSUMABLE":
                            if (appName.ToUpper().Trim() == "RECEIVEDCONSUMABLE")
                                CreateGrid(myCurrentForm, processName, searchAirline, searchFlightNo, FlightDate,Type);
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

        public Stream GetGridData(string processName, string moduleName, string appName, string searchAirline, string searchFlightNo, string FlightDate, string LoggedInCity,string Type)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", searchAirline: searchAirline, searchFlightNo: searchFlightNo, FlightDate: FlightDate, LoggedInCity: LoggedInCity,Type:Type);
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string searchAirline, string searchFlightNo, string FlightDate,string Type)
        {
            if (Type == "0")
            {
                using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Import/ReceivedConsumableService.svc/GetReceivedConsumableGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Receive Consumable";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsShowGridHeader = false;
                    g.ProcessName = ProcessName;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 60, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    /*For MultCity */
                    g.Column.Add(new GridColumn { Field = "FlightOrg", Title = "Org.", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "FlightDest", Title = "Dest.", DataType = GridDataType.String.ToString(), Width = 40 });
                    /*For MultCity */
                    g.Column.Add(new GridColumn { Field = "Item", Title = "Consumable Item", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Quantity", Title = "Quantity", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "Process Status", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "Numbered", Title = "Numbered", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ConsumableSno", Title = "Consumable Sno", DataType = GridDataType.String.ToString(), IsHidden = true });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchAirline", Value = searchAirline });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFlightNo", Value = searchFlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFlightDate", Value = FlightDate });

                    g.InstantiateIn(Container);

                }
            }
            else if (Type == "1") {
            using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Import/ReceivedConsumableService.svc/GetReceivedConsumableGridDataForSelf";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Receive Consumable";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.ProcessName = ProcessName;

                    g.Column = new List<GridColumn>();
                   g.Column.Add(new GridColumn { Field = "Item", Title = "Consumable Item", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Quantity", Title = "Quantity", DataType = GridDataType.String.ToString(), Width = 40 });
                //    g.Column.Add(new GridColumn { Field = "ReceivedType", Title = "Received Type", DataType = GridDataType.String.ToString(),  Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "Process Status", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "Numbered", Title = "Numbered", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ConsumableSno", Title = "Consumable Sno", DataType = GridDataType.String.ToString(), IsHidden = true });

                    //g.ExtraParam = new List<GridExtraParam>();
                    //g.ExtraParam.Add(new GridExtraParam { Field = "searchAirline", Value = searchAirline });
                    //g.ExtraParam.Add(new GridExtraParam { Field = "searchFlightNo", Value = searchFlightNo });
                    //g.ExtraParam.Add(new GridExtraParam { Field = "searchFlightDate", Value = FlightDate });

                    g.InstantiateIn(Container);

                }

            }
        }

        public DataSourceResult GetReceivedConsumableGridData(string searchAirline, string searchFlightNo,  string FlightDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "GetReceivedConsumableGridData";
                string filters = GridFilter.ProcessFilters<ReceivedConsumable>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@searchAirline", searchAirline), new SqlParameter("@searchFlightNo", searchFlightNo), new SqlParameter("@searchFlightDate", FlightDate)
                                            /* for MultiCity */
                                            ,new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                           new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString())
                                        /* for MultiCity */
                                        }; //new SqlParameter("@LoggedInCity","")

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var ReceivedConsumableList = ds.Tables[0].AsEnumerable().Select(e => new ReceivedConsumable
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ULDNo = e["ULDNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    /*For MultCity */
                    FlightOrg = e["FlightOrg"].ToString(),
                    FlightDest = e["FlightDest"].ToString(),
                    /*For MultCity */
                    FlightDate = DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    Item = e["Item"].ToString(),
                    Quantity = Convert.ToInt16(e["Quantity"]),
                    ProcessStatus = "",
                    Numbered = Convert.ToBoolean(e["Numbered"]),
                    ConsumableSno = Convert.ToInt32(e["ConsumableSno"])

                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ReceivedConsumableList.AsQueryable().ToList(),
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

        public DataSourceResult GetReceivedConsumableGridDataForSelf(string searchAirline, string searchFlightNo, string FlightDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "GetReceivedConsumableGridDataForSelf";
                string filters = GridFilter.ProcessFilters<ReceivedConsumable>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) }; //new SqlParameter("@LoggedInCity","")

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var ReceivedConsumableList = ds.Tables[0].AsEnumerable().Select(e => new ReceivedConsumable
                {
                    SNo = Convert.ToInt32(e["SNo"]),

                    Item = e["Item"].ToString(),
                    Quantity = Convert.ToInt16(e["Quantity"]),
                    ProcessStatus = "",
                    Numbered = Convert.ToBoolean(e["Numbered"]),
                    ConsumableSno = Convert.ToInt32(e["ConsumableSno"])
                    //  ReceivedType = e["ReceivedType"].ToString()

                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ReceivedConsumableList.AsQueryable().ToList(),
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



            public string CreateIssueConsumables(List<ReceivedConsumableList> ReceivedConsumableList,string type)
            {
                try
                {
                    BaseBusiness baseBusiness = new BaseBusiness();
                    List<string> ErrorMessage = new List<string>();
                    int ret = 0;

                    DataTable dtlstConsumabIssue = CollectionHelper.ConvertTo(ReceivedConsumableList, "");
                    //  var dtlstConsumabIssue = JsonConvert.DeserializeObject<DataTable>(lstConsumabIssue);
                    //string LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;

                    SqlParameter[] Parameters = { new SqlParameter("@ReceivedConsumablesTypeTable", dtlstConsumabIssue), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()), new SqlParameter("@FromFlight", type) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateReceivedConsumables", Parameters);




                    return ret.ToString();
                }
                catch(Exception ex)//
                {
                    throw ex;
                }
        }

        //    public KeyValuePair<string, List<GetDimemsionsAndULDNew>> GetDimemsionsAndULDNew(string recordID, int page, int pageSize, string whereCondition, string sort)
        //    {
        //        GetDimemsionsAndULDNew officeCommision = new GetDimemsionsAndULDNew();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //        DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetDimemsionsAndULDNewImport", Parameters);
        //        var GetDimemsionsAndULDNewList = ds.Tables[0].AsEnumerable().Select(e => new GetDimemsionsAndULDNew
        //        {
        //            SNo = Convert.ToInt32(e["SNo"]),
        //            AWBSNo = Convert.ToInt32(e["AWBSNo"]),
        //            HAWBSNo = Convert.ToInt32(e["HAWBSNo"]),
        //            NoOfPieces = Convert.ToInt32(e["NoOfPieces"]),
        //            WeightCode = e["WeightCode"].ToString(),
        //            GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
        //            RateClassCode = e["txtRateClassCode"].ToString(),
        //            HdnRateClassCode = e["RateClassCode"].ToString(),
        //            CommodityItemNumber = Convert.ToInt32(e["CommodityItemNumber"]),
        //            ChargeableWeight = Convert.ToDecimal(e["ChargeableWeight"].ToString()),
        //            Charge = Convert.ToDecimal(e["Charge"].ToString()),
        //            ChargeAmount = Convert.ToDecimal(e["ChargeAmount"].ToString()),
        //            NatureOfGoods = e["NatureOfGoods"].ToString(),
        //            hdnChildData = e["hdnChildData"].ToString(),

        //        });
        //        return new KeyValuePair<string, List<GetDimemsionsAndULDNew>>(ds.Tables[1].Rows[0][0].ToString(), GetDimemsionsAndULDNewList.AsQueryable().ToList());
        //    }

        //    public KeyValuePair<string, List<GetDimemsionsAndULDRate>> GetDimemsionsAndULDRate(string recordID, int page, int pageSize, string whereCondition, string sort)
        //    {
        //        GetDimemsionsAndULDRate officeCommision = new GetDimemsionsAndULDRate();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //        DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetDimemsionsAndULDRateImport", Parameters);
        //        var GetDimemsionsAndULDRateList = ds.Tables[0].AsEnumerable().Select(e => new GetDimemsionsAndULDRate
        //        {
        //            SNo = Convert.ToInt32(e["SNo"]),
        //            AWBSNo = Convert.ToInt32(e["AWBSNo"]),
        //            WeightCode = e["WeightCode"].ToString(),
        //            RateClassCode = e["txtRateClassCode"].ToString(),
        //            HdnRateClassCode = e["RateClassCode"].ToString(),
        //            SLAC = Convert.ToInt32(e["SLAC"]),
        //            HdnULD = Convert.ToInt32(e["ULDTypeSNo"]),
        //            ULD = e["ULDTypeCode"].ToString(),
        //            ULDNo = e["ULDSNo"].ToString(),
        //            Charge = Convert.ToDecimal(e["Charge"].ToString()),
        //            ChargeAmount = Convert.ToDecimal(e["ChargeAmount"].ToString()),
        //            HarmonisedCommodityCode = Convert.ToInt32(e["HarmonisedCommodityCode"].ToString()),
        //            HdnCountry = Convert.ToInt32(e["CountrySNo"].ToString()),
        //            Country = e["txtCountry"].ToString(),
        //            NatureOfGoods = e["NatureOfGoods"].ToString(),
        //        });
        //        return new KeyValuePair<string, List<GetDimemsionsAndULDRate>>(ds.Tables[1].Rows[0][0].ToString(), GetDimemsionsAndULDRateList.AsQueryable().ToList());
        //    }

        //    public KeyValuePair<string, List<GetAWBOtherChargeData>> GetAWBOtherChargeData(string recordID, int page, int pageSize, string whereCondition, string sort)
        //    {
        //        GetAWBOtherChargeData officeCommision = new GetAWBOtherChargeData();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //        DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetAWBOtherChargeDataImport", Parameters);
        //        var GetAWBOtherChargeDataList = ds.Tables[0].AsEnumerable().Select(e => new GetAWBOtherChargeData
        //        {
        //            SNo = Convert.ToInt32(e["SNo"]),
        //            AWBSNo = Convert.ToInt32(e["AWBSNo"]),
        //            Type = e["Type"].ToString(),
        //            OtherCharge = e["OtherChargeCode"].ToString(),
        //            HdnOtherCharge = e["OtherChargeCode"].ToString(),
        //            DueType = e["DueType"].ToString(),
        //            Amount = Convert.ToDecimal(e["ChargeAmount"]),
        //        });
        //        return new KeyValuePair<string, List<GetAWBOtherChargeData>>(ds.Tables[1].Rows[0][0].ToString(), GetAWBOtherChargeDataList.AsQueryable().ToList());
        //    }

        //    public string GetShipperAndConsigneeInformation(Int32 AWBSNO)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperAndConsigneeInformationImport", Parameters);
        //        ds.Dispose();
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }

        //    public string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@FieldType", FieldType), new SqlParameter("@SNO", SNO) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperConsigneeDetailsImport", Parameters);
        //        ds.Dispose();
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }

        //    public string GetOSIInfoAndHandlingMessage(Int32 AWBSNO)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOSIInfoAndHandlingMessageImport", Parameters);
        //        ds.Dispose();
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }

        //    public string GetAWBSummary(Int32 AWBSNO)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBSummaryImport", Parameters);
        //        ds.Dispose();
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }

        //    public string GetRecordAtAWBEDox(Int32 AWBSNO)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtAWBEDoxImport", Parameters);
        //        ds.Dispose();
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }

        //    public string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest)
        //    {
        //        DataSet ds;
        //        SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DlyFlghtSno), new SqlParameter("@Origin", Origin), new SqlParameter("@Dest", Dest) };
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateCutoffTimeImport", Parameters);
        //            return ds.Tables[0].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)//
        //        {
        //            return "";
        //        }

        //    }

        //    public string SaveAcceptance(string AWBNo, Int32 AWBSNo, ImportShipmentInformation ShipmentInformation, List<ImportAWBSPHC> lstAWBSPHC, List<ImportItineraryInformation> listItineraryInformation, List<ImportAWBSPHCTrans> AWBSPHCTrans, Int32 UpdatedBy)
        //    {
        //        List<ImportShipmentInformation> lstShipmentInformation = new List<ImportShipmentInformation>();
        //        lstShipmentInformation.Add(ShipmentInformation);

        //        //List<AWBSPHC> lstAWBSPHC = new List<AWBSPHC>();
        //        //lstAWBSPHC.Add(AwbSPHC);

        //        DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "");
        //        DataTable dtAWBSPHC = CollectionHelper.ConvertTo(lstAWBSPHC, "");
        //        DataTable dtItineraryInformation = CollectionHelper.ConvertTo(listItineraryInformation, "");
        //        DataTable dtAWBSPHCTrans = CollectionHelper.ConvertTo(AWBSPHCTrans, "SNo");

        //        BaseBusiness baseBusiness = new BaseBusiness();

        //        SqlParameter paramShipmentInformation = new SqlParameter();
        //        paramShipmentInformation.ParameterName = "@ShipmentInformation";
        //        paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramShipmentInformation.Value = dtShipmentInformation;

        //        SqlParameter paramAWBSPHC = new SqlParameter();
        //        paramAWBSPHC.ParameterName = "@AWBSPHC";
        //        paramAWBSPHC.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBSPHC.Value = dtAWBSPHC;

        //        SqlParameter paramItineraryInformation = new SqlParameter();
        //        paramItineraryInformation.ParameterName = "@ItineraryInformation";
        //        paramItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramItineraryInformation.Value = dtItineraryInformation;

        //        SqlParameter paramAWBSPHCTrans = new SqlParameter();
        //        paramAWBSPHCTrans.ParameterName = "@AWBSPHCTrans";
        //        paramAWBSPHCTrans.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBSPHCTrans.Value = dtAWBSPHCTrans;


        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@AWBSNo", AWBSNo), paramShipmentInformation, paramAWBSPHC, paramItineraryInformation, paramAWBSPHCTrans, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveAcceptanceImport", Parameters);
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    public string UpdateRateDimemsionsAndULD(Int32 AWBSNo, List<ImportDimensionsArray> Dimensions, List<ImportULDDimensionsArray> ULDDimension, List<GetAWBOtherChargeData> OtherCharge, List<ImportAWBRateArray> RateArray, Int32 UpdatedBy)
        //    {
        //        DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");//hdnChildData
        //        DataTable dtAWBULDTrans = CollectionHelper.ConvertTo(ULDDimension, "");
        //        List<ImportChildData> lstChildData = new List<ImportChildData>();
        //        DataTable dtDimensionTrans = CollectionHelper.ConvertTo(lstChildData, "");
        //        DataTable dtOtherCharge = CollectionHelper.ConvertTo(OtherCharge, "");
        //        DataTable dtAWBRate = CollectionHelper.ConvertTo(RateArray, "");

        //        GetDimensionTransData(dtDimensionTrans, dtDimensions, dtAWBULDTrans);

        //        BaseBusiness baseBusiness = new BaseBusiness();

        //        SqlParameter paramDimensions = new SqlParameter();
        //        paramDimensions.ParameterName = "@RateDimensions";
        //        paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramDimensions.Value = dtDimensions;

        //        SqlParameter paramDimensionsTrans = new SqlParameter();
        //        paramDimensionsTrans.ParameterName = "@RateDimensionsTrans";
        //        paramDimensionsTrans.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramDimensionsTrans.Value = dtDimensionTrans;

        //        SqlParameter paramAWBULDTrans = new SqlParameter();
        //        paramAWBULDTrans.ParameterName = "@ULDRateDimensions";
        //        paramAWBULDTrans.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBULDTrans.Value = dtAWBULDTrans;

        //        SqlParameter paramOtherCharge = new SqlParameter();
        //        paramOtherCharge.ParameterName = "@OtherCharge";
        //        paramOtherCharge.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramOtherCharge.Value = dtOtherCharge;

        //        SqlParameter paramAwbRate = new SqlParameter();
        //        paramAwbRate.ParameterName = "@AwbRate";
        //        paramAwbRate.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAwbRate.Value = dtAWBRate;


        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramDimensions, paramDimensionsTrans, paramAWBULDTrans, paramOtherCharge, paramAwbRate, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateRateDimemsionsAndULDImport", Parameters);
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    private void GetDimensionTransData(DataTable dtDimensionTrans, DataTable dtDimensions, DataTable dtAWBULDTrans)
        //    {
        //        for (int j = 0; j < dtDimensions.Rows.Count; j++)
        //        {
        //            if (dtDimensions.Rows[j]["hdnChildData"].ToString() != "")
        //            {
        //                DataTable Temp = (DataTable)JsonConvert.DeserializeObject(dtDimensions.Rows[j]["hdnChildData"].ToString(), (typeof(DataTable)));
        //                foreach (DataRow dtRow in Temp.Rows)
        //                {
        //                    DataRow dr = dtDimensionTrans.NewRow();
        //                    dr["SNo"] = dtDimensions.Rows[j]["SNo"];
        //                    dr["AWBSNo"] = dtRow["AWBSNo"].ToString();
        //                    dr["Length"] = dtRow["Length"].ToString();
        //                    dr["Width"] = dtRow["Width"].ToString();
        //                    dr["Height"] = dtRow["Height"].ToString();
        //                    dr["MeasurementUnitCode"] = dtRow["MeasurementUnitCode"].ToString();
        //                    dr["Pieces"] = dtRow["Pieces"].ToString();
        //                    dr["VolumeWeight"] = dtRow["VolumeWeight"].ToString();
        //                    dr["VolumeUnit"] = dtRow["VolumeUnit"].ToString();
        //                    dr["AWBRateDescriptionSNo"] = dtRow["AWBRateDescriptionSNo"].ToString();
        //                    dtDimensionTrans.Rows.Add(dr);

        //                }
        //            }

        //        }
        //        dtDimensions.Columns.Remove("hdnChildData");
        //        for (int i = 0; i < dtAWBULDTrans.Rows.Count; i++)
        //        {
        //            dtAWBULDTrans.Rows[i]["ChargeLineCount"] = i + 1;
        //        }
        //        dtDimensionTrans.AcceptChanges();
        //        dtDimensions.AcceptChanges();
        //        dtAWBULDTrans.AcceptChanges();

        //    }

        //    public string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportNotifyDetails NotifyModel, ImportNominyDetails NominyModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno)
        //    {
        //        List<ImportShipperInformation> lstShipperInformation = new List<ImportShipperInformation>();
        //        lstShipperInformation.Add(ShipperInformation);
        //        DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");
        //        BaseBusiness baseBusiness = new BaseBusiness();


        //        List<ImportConsigneeInformation> lstConsigneeInformation = new List<ImportConsigneeInformation>();
        //        lstConsigneeInformation.Add(ConsigneeInformation);
        //        DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

        //        List<ImportNotifyDetails> lstNotifyInformation = new List<ImportNotifyDetails>();
        //        lstNotifyInformation.Add(NotifyModel);
        //        DataTable dtNotifyDetails = CollectionHelper.ConvertTo(lstNotifyInformation, "");

        //        List<ImportNominyDetails> lstNominyInformation = new List<ImportNominyDetails>();
        //        lstNominyInformation.Add(NominyModel);
        //        DataTable dtNominyDetails = CollectionHelper.ConvertTo(lstNominyInformation, "");


        //        SqlParameter paramShipperInformation = new SqlParameter();
        //        paramShipperInformation.ParameterName = "@ShipperInformation";
        //        paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramShipperInformation.Value = dtShipperInformation;

        //        SqlParameter paramConsigneeInformation = new SqlParameter();
        //        paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
        //        paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramConsigneeInformation.Value = dtConsigneeInformation;

        //        SqlParameter paramNotifyDetails = new SqlParameter();
        //        paramNotifyDetails.ParameterName = "@NotifyDetails";
        //        paramNotifyDetails.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramNotifyDetails.Value = dtNotifyDetails;

        //        SqlParameter paramNominyDetails = new SqlParameter();
        //        paramNominyDetails.ParameterName = "@NominyDetails";
        //        paramNominyDetails.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramNominyDetails.Value = dtNominyDetails;

        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramShipperInformation, paramConsigneeInformation, paramNotifyDetails, paramNominyDetails, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateShipperAndConsigneeInformationImport", Parameters);
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    public string UpdateOSIInfoAndHandlingMessage(Int32 AWBSNo, ImportOSIInformation OSIInformation, List<ImportAWBHandlingMessage> AWBHandlingMessage, List<ImportAWBOSIModel> AWBOSIModel, List<ImportAWBOCIModel> AWBOCIModel, Int32 UpdatedBy)
        //    {
        //        List<ImportOSIInformation> lstOSIInformation = new List<ImportOSIInformation>();
        //        lstOSIInformation.Add(OSIInformation);
        //        DataTable dtOSIInformation = CollectionHelper.ConvertTo(lstOSIInformation, "");
        //        DataTable dtAWBHandlingMessage = CollectionHelper.ConvertTo(AWBHandlingMessage, "");
        //        DataTable dtAWBOSIModel = CollectionHelper.ConvertTo(AWBOSIModel, "");
        //        DataTable dtAWBOCIModel = CollectionHelper.ConvertTo(AWBOCIModel, "");

        //        BaseBusiness baseBusiness = new BaseBusiness();

        //        SqlParameter paramOSIInformation = new SqlParameter();
        //        paramOSIInformation.ParameterName = "@OSIInformation";
        //        paramOSIInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramOSIInformation.Value = dtOSIInformation;

        //        SqlParameter paramAWBHandlingMessage = new SqlParameter();
        //        paramAWBHandlingMessage.ParameterName = "@AWBHandlingMessage";
        //        paramAWBHandlingMessage.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBHandlingMessage.Value = dtAWBHandlingMessage;

        //        SqlParameter paramAWBOSIModel = new SqlParameter();
        //        paramAWBOSIModel.ParameterName = "@AWBOSIInformation";
        //        paramAWBOSIModel.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBOSIModel.Value = dtAWBOSIModel;

        //        SqlParameter paramAWBOCIModel = new SqlParameter();
        //        paramAWBOCIModel.ParameterName = "@AWBOCIInformation";
        //        paramAWBOCIModel.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBOCIModel.Value = dtAWBOCIModel;

        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramOSIInformation, paramAWBHandlingMessage, paramAWBOSIModel, paramAWBOCIModel, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateOSIInfoAndHandlingMessageImport", Parameters);
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    public string UpdateAWBSummary(Int32 AWBSNo, List<ImportSummaryArray> Summary, Int32 UpdatedBy)
        //    {
        //        DataTable dtSummary = CollectionHelper.ConvertTo(Summary, "");
        //        BaseBusiness baseBusiness = new BaseBusiness();

        //        SqlParameter paramAWBSummary = new SqlParameter();
        //        paramAWBSummary.ParameterName = "@AWBSummaryType";
        //        paramAWBSummary.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBSummary.Value = dtSummary;

        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramAWBSummary, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAWBSummaryImport", Parameters);
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    public string UpdateFHLinfo(Int32 AWBSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno)
        //    {
        //        List<ImportHAWBInformation> lstHAWBInformation = new List<ImportHAWBInformation>();
        //        lstHAWBInformation.Add(HAWBInformation);
        //        DataTable dtHAWBInformation = CollectionHelper.ConvertTo(lstHAWBInformation, "");

        //        List<ImportShipperInformation> lstShipperInformation = new List<ImportShipperInformation>();
        //        lstShipperInformation.Add(ShipperInformation);
        //        DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");


        //        List<ImportConsigneeInformation> lstConsigneeInformation = new List<ImportConsigneeInformation>();
        //        lstConsigneeInformation.Add(ConsigneeInformation);
        //        DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

        //        List<ImportChargeDeclarations> lstChargeDeclarationsInformation = new List<ImportChargeDeclarations>();
        //        lstChargeDeclarationsInformation.Add(ChargeDeclarationsInformation);
        //        DataTable dtChargeDeclarationsInformation = CollectionHelper.ConvertTo(lstChargeDeclarationsInformation, "");

        //        DataTable dtOCIInformation = CollectionHelper.ConvertTo(OCIInformation, "");

        //        BaseBusiness baseBusiness = new BaseBusiness();

        //        SqlParameter paramHAWBInformation = new SqlParameter();
        //        paramHAWBInformation.ParameterName = "@HAWBInformation";
        //        paramHAWBInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramHAWBInformation.Value = dtHAWBInformation;

        //        SqlParameter paramShipperInformation = new SqlParameter();
        //        paramShipperInformation.ParameterName = "@ShipperInformation";
        //        paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramShipperInformation.Value = dtShipperInformation;

        //        SqlParameter paramConsigneeInformation = new SqlParameter();
        //        paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
        //        paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramConsigneeInformation.Value = dtConsigneeInformation;

        //        SqlParameter paramChargeDeclarationsInformation = new SqlParameter();
        //        paramChargeDeclarationsInformation.ParameterName = "@ChargeDeclarationsInformation";
        //        paramChargeDeclarationsInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramChargeDeclarationsInformation.Value = dtChargeDeclarationsInformation;

        //        SqlParameter paramOCIInformation = new SqlParameter();
        //        paramOCIInformation.ParameterName = "@OCIInformation";
        //        paramOCIInformation.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramOCIInformation.Value = dtOCIInformation;

        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramHAWBInformation, paramShipperInformation, paramConsigneeInformation, paramChargeDeclarationsInformation, paramOCIInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateFHLinfoImport", Parameters);
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    public string SaveFAD(Int32 ArrivedShipmentSNo, Int32 AWBSNo, Int32 ReportingStation, Int32 DiscrepancyType, Int32 DiscrepancySubType, Int32 Discrepancypieces, string DiscrepancyGrossweight, string DiscrepancyVolwt, string Remarks, Int32 UpdatedBy)
        //    {
        //        BaseBusiness baseBusiness = new BaseBusiness();
        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo), new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@ReportingStation", ReportingStation), new SqlParameter("@DiscrepancyType", DiscrepancyType), new SqlParameter("@DiscrepancySubType", DiscrepancySubType), new SqlParameter("@Discrepancypieces", Discrepancypieces), new SqlParameter("@DiscrepancyGrossweight", Convert.ToDecimal(DiscrepancyGrossweight)), new SqlParameter("@DiscrepancyVolwt", Convert.ToDecimal(DiscrepancyVolwt)), new SqlParameter("@Remarks", Remarks), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveFADImport", Parameters);
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    public KeyValuePair<string, List<BindLocation>> BindLocation(string recordID, int page, int pageSize, string whereCondition, string sort)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindLocationImport", Parameters);
        //        var BindLocationList = ds.Tables[0].AsEnumerable().Select(e => new BindLocation
        //        {
        //            SNo = Convert.ToInt32(e["SNo"]),
        //            AWBSNo = Convert.ToInt32(e["AWBSNo"]),
        //            AWBNo = Convert.ToString(e["AWBNo"]),
        //            Received = Convert.ToString(e["Received"]),
        //            Location = e["Location"].ToString(),
        //            Pieces = Convert.ToInt32(e["Pieces"]),
        //            Weight = Convert.ToDecimal(e["Weight"].ToString()),
        //        });
        //        return new KeyValuePair<string, List<BindLocation>>(ds.Tables[1].Rows[0][0].ToString(), BindLocationList.AsQueryable().ToList());
        //    }

        //    public string BindFAASection(Int32 AWBSNO)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASection", Parameters);
        //        ds.Dispose();

        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }

        //    public KeyValuePair<string, List<BindFAASectionChargeDescription>> BindFAASectionChargeDescription(string recordID, int page, int pageSize, string whereCondition, string sort)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@ArrivalShipmentSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASectionChargeDescription", Parameters);
        //        var BindFAASectionChargeDescriptionList = ds.Tables[0].AsEnumerable().Select(e => new BindFAASectionChargeDescription
        //        {
        //            //SNo = Convert.ToString(e["SNo"]),
        //            //AWBSNo = Convert.ToString(e["AWBSNo"]),
        //            //AWBNo = Convert.ToString(e["AWBNo"]),
        //            TariffSNo = Convert.ToString(e["TariffSNo"]),
        //            ChargeDescription = Convert.ToString(e["TariffHeadName"]),
        //            ChargeCode = Convert.ToString(e["TariffCode"]),
        //            Amount = e["ChargeAmount"].ToString(),
        //        });
        //        return new KeyValuePair<string, List<BindFAASectionChargeDescription>>(ds.Tables[1].Rows[0][0].ToString(), BindFAASectionChargeDescriptionList.AsQueryable().ToList());
        //    }

        //    public KeyValuePair<string, List<BindFAASectionAWBInformation>> BindFAASectionAWBInformation(string recordID, int page, int pageSize, string whereCondition, string sort)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@ArrivalShipmentSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASectionAWBInformation", Parameters);
        //        var BindFAASectionAWBInformationList = ds.Tables[0].AsEnumerable().Select(e => new BindFAASectionAWBInformation
        //        {
        //            SNo = Convert.ToString(e["SNo"]),
        //            AWBSNo = Convert.ToString(e["AWBSNo"]),
        //            AWBNo = Convert.ToString(e["AWBNo"]),
        //            Origin = Convert.ToString(e["Origin"]),
        //            Pcs = e["Pcs"].ToString(),
        //            Weight = Convert.ToString(e["Weight"]),
        //            CCPP = e["CCPP"].ToString(),
        //            CargoType = e["CargoType"].ToString(),
        //            Contents = Convert.ToString(e["Contents"]),
        //        });
        //        return new KeyValuePair<string, List<BindFAASectionAWBInformation>>(ds.Tables[1].Rows[0][0].ToString(), BindFAASectionAWBInformationList.AsQueryable().ToList());
        //    }

        //    public KeyValuePair<string, List<BindFAASectionEmailHistory>> BindFAASectionEmailHistory(string recordID, int page, int pageSize, string whereCondition, string sort)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@ArrivalShipmentSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindFAASectionEmailHistory", Parameters);
        //        var BindFAASectionEmailHistoryList = ds.Tables[0].AsEnumerable().Select(e => new BindFAASectionEmailHistory
        //        {
        //            SNo = Convert.ToString(e["SNo"]),
        //            AWBSNo = Convert.ToString(e["AWBSNo"]),
        //            AWBNo = Convert.ToString(e["AWBNo"]),
        //            Origin = Convert.ToString(e["Origin"]),
        //            Pcs = e["Pcs"].ToString(),
        //            Weight = Convert.ToString(e["Weight"]),
        //            CCPP = e["CCPP"].ToString(),
        //            CargoType = e["CargoType"].ToString(),
        //            Contents = Convert.ToString(e["Contents"]),
        //            EmailSentdatetime = e["EmailSentdatetime"].ToString(),
        //            EmailSentBy = e["EmailSentBy"].ToString(),
        //            EmailSentTo = Convert.ToString(e["EmailSentTo"]),
        //        });
        //        return new KeyValuePair<string, List<BindFAASectionEmailHistory>>(ds.Tables[1].Rows[0][0].ToString(), BindFAASectionEmailHistoryList.AsQueryable().ToList());
        //    }

        //    public string SaveAWBEDoxDetail(Int32 AWBSNo, List<ImportAWBEDoxDetail> AWBEDoxDetail, List<ImportSPHCDoxArray> SPHCDoxArray, string AllEDoxReceived, string Remarks, Int32 UpdatedBy)
        //    {
        //        DataTable dtAWBEDoxDetail = CollectionHelper.ConvertTo(AWBEDoxDetail, "");
        //        DataTable dtSPHCDoxArray = CollectionHelper.ConvertTo(SPHCDoxArray, "");

        //        SqlParameter paramAWBEDoxDetail = new SqlParameter();
        //        paramAWBEDoxDetail.ParameterName = "@AWBEDoxDetail";
        //        paramAWBEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBEDoxDetail.Value = dtAWBEDoxDetail;

        //        dtSPHCDoxArray.Columns.Add("FileBinary", typeof(byte[]));
        //        foreach (DataRow dr in dtSPHCDoxArray.Rows)
        //        {
        //            if (dr["AltDocName"].ToString() != "")
        //            {
        //                var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr["AltDocName"].ToString());
        //                dr["FileBinary"] = ReadFile(serverPath);
        //            }
        //        }

        //        SqlParameter paramAWBSPHCEDoxDetail = new SqlParameter();
        //        paramAWBSPHCEDoxDetail.ParameterName = "@SPHCDocDetails";
        //        paramAWBSPHCEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
        //        paramAWBSPHCEDoxDetail.Value = dtSPHCDoxArray;


        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramAWBEDoxDetail, paramAWBSPHCEDoxDetail, new SqlParameter("@AllEDoxReceived", AllEDoxReceived), new SqlParameter("@Remarks", Remarks), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAWBEDoxDetailsImport", Parameters);
        //            DeleteSelectedFiles();
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    public static void DeleteSelectedFiles()
        //    {
        //        if (System.IO.Directory.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/")))
        //        {
        //            string[] files = System.IO.Directory.GetFiles(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/"));
        //            foreach (string s in files)
        //            {
        //                if (s.Split('\\').Last().Split('_')[0] == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                {
        //                    File.Delete(s);
        //                }
        //            }
        //        }
        //    }

        //    public static byte[] ReadFile(string imageLocation)
        //    {
        //        byte[] imageData = null;
        //        FileInfo fileInfo = new FileInfo(imageLocation);
        //        long imageFileLength = fileInfo.Length;
        //        FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
        //        BinaryReader br = new BinaryReader(fs);
        //        imageData = br.ReadBytes((int)imageFileLength);
        //        fs.Dispose();
        //        br.Dispose();
        //        return imageData;
        //    }

        //    public string SaveFAA(Int32 AWBSNo, Int32 ArrivedShipmentSNo, string DeliveryOrderFee, string DeliveryHandlingCharge, string SitaEmailAddress, string Remarks, Int32 UpdatedBy)
        //    {
        //        BaseBusiness baseBusiness = new BaseBusiness();
        //        DataSet ds = new DataSet();
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo), new SqlParameter("@DeliveryOrderFee", Convert.ToDecimal(DeliveryOrderFee)), new SqlParameter("@DeliveryHandlingCharge", Convert.ToDecimal(DeliveryHandlingCharge)), new SqlParameter("@SitaEmailAddress", SitaEmailAddress), new SqlParameter("@Remarks", Remarks), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };
        //        DataSet ds1 = new DataSet();
        //        try
        //        {
        //            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveFAAImport", Parameters);
        //            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    /*********Manish***********/
        //    public string CheckWaybillDetail(string AWBNo)
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo) };
        //        DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "spCheckWaybillDetail", Parameters);
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }

        //    public string GetDeliveryOrderRecord(int AWBSNo, int ArrivedShipmentSNo)
        //    {
        //        int UserID = 1;
        //        SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
        //        DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "spGetDeliveryOrderDetail", Parameters);
        //        ds.Dispose();

        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }

        //    public string SaveDO(int AWBSNo, DeliveryOrderInfo DeliveryOrderInfo, List<DOHandlingCharges> lstHandlingCharges, List<DOServiceCharges> lstServiceCharges)
        //    {
        //        List<DeliveryOrderInfo> lstDeliveryOrderInfo = new List<DeliveryOrderInfo>();
        //        lstDeliveryOrderInfo.Add(DeliveryOrderInfo);

        //        DataTable dtDeliveryOrderInfo = CollectionHelper.ConvertTo(lstDeliveryOrderInfo, "Text_HAWBSNo");
        //        DataTable dtHandlingCharges = CollectionHelper.ConvertTo(lstHandlingCharges, "");
        //        DataTable dtServiceCharges = CollectionHelper.ConvertTo(lstServiceCharges, "AWBSNo");

        //        BaseBusiness baseBusiness = new BaseBusiness();
        //        SqlParameter[] param =
        //                                {
        //                                    new SqlParameter("@AWBSNo",AWBSNo),
        //                                    new SqlParameter("@DeliveryOrderInfoTable",dtDeliveryOrderInfo),
        //                                    new SqlParameter("@HandlingChargesTable",dtHandlingCharges),
        //                                    new SqlParameter("@ServiceChargesTable",dtServiceCharges),
        //                                    new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                };
        //        try
        //        {
        //            string ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveDO", param).Tables[0].Rows[0][0];
        //            return ret;
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }

        //    public string SaveDOPayment(List<ImportPayment> lstDOPayment)
        //    {
        //        DataTable dtDOPayment = CollectionHelper.ConvertTo(lstDOPayment, "");

        //        BaseBusiness baseBusiness = new BaseBusiness();
        //        SqlParameter[] param =
        //                                {
        //                                    new SqlParameter("@DOPaymentTable",dtDOPayment),
        //                                    new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                };
        //        try
        //        {
        //            string ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveDoPayment", param).Tables[0].Rows[0][0];
        //            return ret;
        //        }
        //        catch(Exception ex)// (Exception ex)
        //        {
        //            return ex.Message;
        //        }
        //    }
        //    /******************************/
    }
}
