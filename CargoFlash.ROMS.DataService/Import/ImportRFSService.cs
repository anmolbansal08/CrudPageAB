using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.IO;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using KLAS.Business.EDI;


namespace CargoFlash.Cargo.DataService.Import
{
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ImportRFSService : BaseWebUISecureObject, IImportRFSService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        public Stream GetGridData(string processName, string moduleName, string appName, string SearchFlightNo, string SearchFromFlightDate, string SearchToFlightDate, string SearchFlightStatus)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", SearchFlightNo: SearchFlightNo, SearchFromFlightDate: SearchFromFlightDate, SearchToFlightDate: SearchToFlightDate, SearchFlightStatus: SearchFlightStatus);
        }

        private void CreateRFSGrid(StringBuilder Container, string SearchFlightNo = "", string SearchFromFlightDate = "", string SearchToFlightDate = "", string SearchFlightStatus = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 10;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/Import/ImportRFSService.svc/GetRFSGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "RFS";
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsDisplayOnly = false;
                g.IsActionRequired = false;
                g.IsSortable = true;
                g.IsAllowedFiltering = true;
                g.ProcessName = "ImportRFS";
                g.IsVirtualScroll = false;
                g.IsShowGridHeader = false;
                g.SuccessGrid = "SuccessImportRFSGrid";

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckNo", IsLocked = false, Title = "Truck No", Template = "<sapn title=\"#= TruckNo #\">#= TruckNo #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "TruckDate", Title = "Truck Date", DataType = GridDataType.Date.ToString(), Template = "# if( TruckDate==null) {# # } else {# #= kendo.toString(new Date(data.TruckDate.getTime() + data.TruckDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 60 });
                g.Column.Add(new GridColumn { Field = "TruckSourceDetails", IsLocked = false, Title = "Truck Source", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "AgendOrVendorName", IsLocked = false, Title = "Vendors Name", DataType = GridDataType.String.ToString(), Width = 100 });
                g.Column.Add(new GridColumn { Field = "SealNo", IsLocked = false, Title = "Seal No", Template = "<sapn title=\"#= SealNo #\">#= SealNo #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Destination", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ATA", Title = "ATA", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Status", IsLocked = false, Title = "Status", DataType = GridDataType.String.ToString(), Width = 100, Template = "# if( IsRFSCancelled==1) {#<span class=\"actionView\" style=\"cursor:pointer;color: INDIANRED;font-weight:bold;\" onclick=\"GetRFSCancelledRemarks(this);\">#=Status#</span># } else {#<span style=\"color: blue;font-weight:bold;\" >#=Status#</span>#}#" });
                g.Column.Add(new GridColumn { Field = "TruckSource", Title = "TruckSource", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AccountSNo", Title = "AccountSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsTruckAgentOrVendor", Title = "IsTruckAgentOrVendor", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AgendOrVendorName", Title = "AgendOrVendorName", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckSNo", Title = "TruckSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckType", Title = "TruckType", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsTruck", Title = "IsTruck", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsAssignFlight", Title = "IsAssignFlight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsCharges", Title = "IsCharges", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ChargesCalculatedManually", Title = "ChargesCalculatedManually", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ChargesRemarks", Title = "ChargesRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsRFSCancelled", Title = "IsRFSCancelled", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "TruckNo", Value = SearchFlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFromFlightDate", Value = SearchFromFlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchToFlightDate", Value = SearchToFlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFlightStatus", Value = SearchFlightStatus });
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetRFSGridData(String TruckNo, String SearchFromFlightDate, String SearchToFlightDate, String SearchFlightStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
            ProcName = "GetImportRFSGridData";
            string filters = GridFilter.ProcessFilters<ImportRFSModel>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightNo", TruckNo), new SqlParameter("@SearchFromFlightDate", SearchFromFlightDate), new SqlParameter("@SearchToFlightDate", SearchToFlightDate), new SqlParameter("@SearchFlightStatus", SearchFlightStatus), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var rfsList = ds.Tables[0].AsEnumerable().Select(e => new ImportRFSModel
            {
                SNo = Convert.ToInt32(e["SNo"]),
                DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                TruckNo = e["TruckNo"].ToString(),
                TruckDate = e["TruckDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["TruckDate"]), DateTimeKind.Utc),
                Origin = e["Origin"].ToString(),
                Destination = e["Destination"].ToString(),
                ATA = e["ATA"].ToString(),
                Status = e["Status"].ToString(),
                TruckSource = Convert.ToInt32(e["TruckSource"]),
                AccountSNo = Convert.ToInt32(e["AccountSNo"]),
                IsTruckAgentOrVendor = e["IsTruckAgentOrVendor"].ToString(),
                AgendOrVendorName = e["AgendOrVendorName"].ToString(),
                SealNo = e["SealNo"].ToString(),
                ProcessStatus = e["ProcessStatus"].ToString(),
                TruckSNo = e["TruckSNo"].ToString(),
                TruckType = e["TruckType"].ToString(),
                IsTruck = Convert.ToInt32(e["IsTruck"]),
                IsAssignFlight = Convert.ToInt32(e["IsAssignFlight"]),
                IsCharges = Convert.ToInt32(e["IsCharges"]),
                ChargesCalculatedManually = Convert.ToInt32(e["ChargesCalculatedManually"]),
                ChargesRemarks = e["ChargesRemarks"].ToString(),
                IsRFSCancelled = Convert.ToInt32(e["IsRFSCancelled"]),
                TruckSourceDetails = Convert.ToInt32(e["TruckSource"]) == 0 ? "SAS" : ((Convert.ToInt32(e["TruckSource"]) == 1 ? "SAS Vendor" : "Airline Vendor"))
            });

            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SearchFlightNo = "", string SearchFromFlightDate = "", string SearchToFlightDate = "", string SearchFlightStatus = "", string ProcessStatus = "", string FlightSNo = "", string RFSTruckDetailsSNo = "")
        {
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
                        case "ImportRFS":
                            if (appName.ToUpper().Trim() == "IMPORTRFS")
                                CreateRFSGrid(myCurrentForm, SearchFlightNo, SearchFromFlightDate, SearchToFlightDate, SearchFlightStatus);
                            //if (appName.ToUpper().Trim() == "MANIFESTULD")
                            //    CreateManifestULDGrid(myCurrentForm, ProcessStatus, FlightSNo);
                            break;
                        case "IMPORTRFSCHARGE":
                            if (appName.ToUpper().Trim() == "IMPORTRFS")
                                CreateRFSChargeGridData(myCurrentForm, RFSTruckDetailsSNo);
                            break;
                        case "RFSCUSTOMCHARGE":
                            if (appName.ToUpper().Trim() == "IMPORTRFS")
                                CreateRFSCustomChargesGridData(myCurrentForm, RFSTruckDetailsSNo);
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
                    break;

            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }

        public string BindRFSTruckInformation(string RFSTruckDetailsSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindImportRFSTruckInformation", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string SaveImportTruckDetails(List<ImportTruckDetails> TruckDetails, string AirportCode, string RFSTruckDetailsSNo)
        {
            DataTable dtTruckDetails = CollectionHelper.ConvertTo(TruckDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramSaveTruckDetails = new SqlParameter();
            paramSaveTruckDetails.ParameterName = "@TruckDetailsType";
            paramSaveTruckDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramSaveTruckDetails.Value = dtTruckDetails;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramSaveTruckDetails, new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@AirportCode", AirportCode), new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveImportTruckDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string BindImportRFSAssignFlightInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindImportRFSAssignFlightInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetRFSMendatoryCharges(int AWBSNo, string CityCode, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, int Pieces, List<ImportRFSShipmentInfo> lstShipmentInfo)
        {
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(lstShipmentInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
            {
                 new SqlParameter("@AwbSNo", AWBSNo),
                 new SqlParameter("@CityCode", CityCode),
                 new SqlParameter("@MovementType", "1"),
                 new SqlParameter("@ShipmentType", "0"),
                 new SqlParameter("@HAWBSNo", 0),
                 new SqlParameter("@PageSize", 99999),
                 new SqlParameter("@WhereCondition", ""),
                 new SqlParameter("@ProcessSNo", ProcessSNo),
                 new SqlParameter("@SubProcessSNo", SubProcessSNo),
                 new SqlParameter("@ArrivedShipmentSNo", 0),
                 new SqlParameter("@DOSNo", 0),
                 new SqlParameter("@PDSNo", 0),
                 new SqlParameter("@RateType", 0),
                 new SqlParameter("@ChargeType", 0),
                 new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                 new SqlParameter("@TariffSNo", 0),
                 new SqlParameter("@PrimaryValue", 0),
                 new SqlParameter("@SecondaryValue", 0),
                 new SqlParameter("@TaxReturn", 0),
                 new SqlParameter("@IsMandatory", 0),
                 new SqlParameter("@IsESS", 0),
                 new SqlParameter("@GrWT", GrWT),
                 new SqlParameter("@VolWt", 0),
                 new SqlParameter("@ChWt", ChWt),
                 new SqlParameter("@Pieces", Pieces),
                 new SqlParameter("@Remarks", ""),
                 new SqlParameter("@PartShipmentType",dtShipmentInfo)
            };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIEInbound", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string GetChargeValue(int TariffSNo, int AWBSNo, string CityCode, int PValue, int SValue, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, int Pieces, List<RFSShipmentInfo> lstShipmentInfo)
        {
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(lstShipmentInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
            {
                 new SqlParameter("@AwbSNo", AWBSNo),
                 new SqlParameter("@CityCode", CityCode),
                 new SqlParameter("@MovementType", "1"),
                 new SqlParameter("@ShipmentType", "0"),
                 new SqlParameter("@HAWBSNo", 0),
                 new SqlParameter("@PageSize", 99999),
                 new SqlParameter("@WhereCondition", ""),
                 new SqlParameter("@ProcessSNo", ProcessSNo),
                 new SqlParameter("@SubProcessSNo", SubProcessSNo),
                 new SqlParameter("@ArrivedShipmentSNo", 0),
                 new SqlParameter("@DOSNo", 0),
                 new SqlParameter("@PDSNo", 0),
                 new SqlParameter("@RateType", 0),
                 new SqlParameter("@ChargeType", 0),
                 new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                 new SqlParameter("@TariffSNo", TariffSNo),
                 new SqlParameter("@PrimaryValue", PValue),
                 new SqlParameter("@SecondaryValue", SValue),
                 new SqlParameter("@TaxReturn", 0),
                 new SqlParameter("@IsMandatory", 0),
                 new SqlParameter("@IsESS", 0),
                 new SqlParameter("@GrWT", GrWT),
                 new SqlParameter("@VolWt", 0),
                 new SqlParameter("@ChWt", ChWt),
                 new SqlParameter("@Pieces", Pieces),
                 new SqlParameter("@Remarks", ""),
                 new SqlParameter("@PartShipmentType",dtShipmentInfo)
            };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIEInbound", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string BindRFSChargesInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSChargesInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public Stream GetRFSChargesData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", RFSTruckDetailsSNo: RFSTruckDetailsSNo);
        }

        private void CreateRFSChargeGridData(StringBuilder Container, string RFSTruckDetailsSNo = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/Import/ImportRFSService.svc/GetRFSChargeGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                //g.FormCaptionText = "RFS Charges" + " <span id='spnRFSChargesBill' style='font-size:13px;float:right;color:#b66202; margin-right:10px;'><input type='checkbox' name='chkBillToAgent' id='chkBillToAgent' />Bill To Agent</span>";
                g.FormCaptionText = "RFS Freight Charges";
                g.IsProcessPart = true;
                g.IsRowDataBound = false;
                g.IsSortable = false;
                g.ProcessName = "IMPORTRFSCHARGE";
                g.IsVirtualScroll = false;
                g.IsPageable = false;
                //g.SuccessGrid = "BindAmount";
                g.SuccessGrid = "SuccessImportRFSChargeGrid";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "RFSTruckDetailsSNo", Title = "RFSTruckDetailsSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "AirlineSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "RateAirlineMasterSNo", Title = "RateAirlineMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Airline", IsLocked = false, Title = "AIRLINE NAME", Template = "<sapn title=\"#= Airline #\">#= Airline #</span>", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "NoOfUnits", IsLocked = false, Title = "NO OF UNITS", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ChargeableUnit", IsLocked = false, Title = "CHARGEABLE UNIT", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "Amount", IsLocked = false, Title = "AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtAmount\" value=\"#=Amount#\" ondrop=\"return false;\" onpaste=\"return false;\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" style=\"width:30%;\" maxlength=\"8\" onchange=\"GetRFSFreightChargesByPosition(this,2)\"  />" });

                g.Column.Add(new GridColumn { Field = "TaxType", IsLocked = false, Title = "TAX", Template = "<sapn title=\"#= TaxType #\" style=\"font-weight:bold;\">#= TaxType #</span>", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "TaxAmount", IsLocked = false, Title = "TAX AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtTaxAmount\" value=\"#=TaxAmount#\" ondrop=\"return false;\" onpaste=\"return false;\" disabled=\"disabled;\"  style=\"width:30%;\" maxlength=\"8\" />" });

                g.Column.Add(new GridColumn { Field = "TotalAmount", IsLocked = false, Title = "TOTAL AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtTotalAmount\" value=\"#=TotalAmount#\" ondrop=\"return false;\" onpaste=\"return false;\"  disabled=\"disabled;\"  style=\"width:30%;\" maxlength=\"8\" />" });

                g.Column.Add(new GridColumn { Field = "FreightRemarks", IsLocked = false, Title = "REMARKS", DataType = GridDataType.String.ToString(), Template = "<textarea type=\"text\" id=\"FreightRemarks\" value=\"#=FreightRemarks#\" ondrop=\"return false;\" onpaste=\"return false;\" style=\"width:95%;height:40px;text-transform:uppercase;\" maxlength=\"250\" />" });

                g.Column.Add(new GridColumn { Field = "HdnAmount", Title = "HdnAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "HdnChargeableUnit", Title = "HdnChargeableUnit", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "HdnTotalAmount", Title = "HdnTotalAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "HdnTaxAmount", Title = "HdnTaxAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckRatesTax", Title = "TruckRatesTax", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "RFSTruckDetailsSNo", Value = RFSTruckDetailsSNo });
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetRFSChargeGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            //if (filter == null)
            //{
            //    filter = new GridFilter();
            //    filter.Logic = "AND";
            //    filter.Filters = new List<GridFilter>();
            //}
            DataSet ds = new DataSet();
            ProcName = "GetRFSChargeGridData";
            //string filters = GridFilter.ProcessFilters<RFSModel>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var rfsList = ds.Tables[0].AsEnumerable().Select(e => new RFSChargesModel
            {
                Airline = e["AirlineName"].ToString(),
                NoOfUnits = Convert.ToDecimal(e["NoOfUnits"]),
                ChargeableUnit = Convert.ToDecimal(e["ChargeableUnit"].ToString()),
                HdnChargeableUnit = Convert.ToDecimal(e["ChargeableUnit"]),
                AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                RFSTruckDetailsSNo = Convert.ToInt32(e["RFSTruckDetailsSNo"]),
                HdnAmount = Convert.ToDecimal(e["Amount"]),
                Amount = Convert.ToDecimal(e["Amount"]),
                FreightRemarks = e["FreightRemarks"].ToString().ToUpper(),
                RateAirlineMasterSNo = Convert.ToInt32(e["RateAirlineMasterSNo"]),
                HdnTotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                TotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                HdnTaxAmount = Convert.ToDecimal(e["TaxAmount"]),
                TaxAmount = Convert.ToDecimal(e["TaxAmount"]),
                TaxType = e["TaxType"].ToString().ToUpper(),
                TruckRatesTax = e["TruckRatesTax"].ToString()
            });

            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                //FilterCondition = filters,
                //SortCondition = sorts,
                StoredProcedure = ProcName
            };
        }

        public Stream GetRFSCustomChargesData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", RFSTruckDetailsSNo: RFSTruckDetailsSNo);
        }

        private void CreateRFSCustomChargesGridData(StringBuilder Container, string RFSTruckDetailsSNo = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/Import/ImportRFSService.svc/GetRFSCustomChargesGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "RFS Custom Charges";
                g.IsProcessPart = true;
                g.IsRowDataBound = false;
                g.IsSortable = false;
                g.ProcessName = "RFSCUSTOMCHARGE";
                g.IsVirtualScroll = false;
                g.IsPageable = false;
                g.SuccessGrid = "SuccessImportRFSCustomChargeGrid";
                //g.SuccessGrid = "BindCustomCharge";

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "RFSTruckDetailsSNo", Title = "RFSTruckDetailsSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "AirlineSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AirlineName", IsLocked = false, Title = "AIRLINE NAME", Template = "<sapn title=\"#= AirlineName #\">#= AirlineName #</span>", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "RateAirlineCustomChargesSNo", Title = "RateAirlineCustomChargesSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ChargeName", IsLocked = false, Title = "CHARGE NAMES", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Amount", IsLocked = false, Title = "AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtCustomAmount\" value=\"#=Amount#\" ondrop=\"return false;\" onpaste=\"return false;\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" style=\"width:30%;\" maxlength=\"8\" onchange=\"GetRFSCustomChargesByAmount(this)\" />" });
                g.Column.Add(new GridColumn { Field = "TaxType", IsLocked = false, Title = "Tax", Template = "<sapn title=\"#= TaxType #\" style=\"font-weight:bold;\">#= TaxType #</span>", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "TaxAmount", IsLocked = false, Title = "TAX AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtCustomTaxAmount\" value=\"#=TaxAmount#\" ondrop=\"return false;\" onpaste=\"return false;\"  disabled=\"disabled;\" style=\"width:30%;\" maxlength=\"8\" />" });

                g.Column.Add(new GridColumn { Field = "TotalAmount", IsLocked = false, Title = "TOTAL AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtCustomTotalAmount\" value=\"#=TotalAmount#\" ondrop=\"return false;\" onpaste=\"return false;\"  disabled=\"disabled;\" style=\"width:30%;\" maxlength=\"8\" />" });

                g.Column.Add(new GridColumn { Field = "HdnTotalAmount", Title = "HdnTotalAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "HdnTaxAmount", Title = "HdnTaxAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "RateAirlineMasterSNo", Title = "RateAirlineMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckRatesTax", Title = "TruckRatesTax", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "RFSTruckDetailsSNo", Value = RFSTruckDetailsSNo });
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetRFSCustomChargesGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            DataSet ds = new DataSet();
            ProcName = "GetRFSCustomChargesGridData";
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
            var rfsList = ds.Tables[0].AsEnumerable().Select(e => new RFSCustomChargesModel
            {
                RFSTruckDetailsSNo = Convert.ToInt32(e["RFSTruckDetailsSNo"]),
                AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                AirlineName = Convert.ToString(e["AirlineName"]),
                RateAirlineCustomChargesSNo = Convert.ToInt32(e["RateAirlineCustomChargesSNo"]),
                ChargeName = e["Charge_Name"].ToString(),
                Amount = Convert.ToDecimal(e["Amount"]),
                HdnTotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                TotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                HdnTaxAmount = Convert.ToDecimal(e["TaxAmount"]),
                TaxAmount = Convert.ToDecimal(e["TaxAmount"]),
                TaxType = e["TaxType"].ToString(),
                TruckRatesTax = e["TruckRatesTax"].ToString(),
                RateAirlineMasterSNo = Convert.ToInt32(e["RateAirlineMasterSNo"])

            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                StoredProcedure = ProcName
            };
        }

        public string GetRFSHandlingDetails(string RFSTruckDetailsSNo, string SNo, string Type)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@SNo", SNo), new SqlParameter("@Type", Type) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRFSHandlingDetails", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetBillingInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBillingInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        public string GetAgentInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetTruckDetails(string DailyFlightSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTruckDetails", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string SaveRFSChargesDetails(List<RFSChargesDetails> RFSChargesDetails, List<RFSCustomChargesDetails> RFSCustomChargesDetails, List<RFSHandlingCharges> RFSHandlingCharges, string BillTo, string BillToSno, string AirportCode, string PaymentMode, string BillToDockingVendor)
        {
            DataTable dtRFSChargesDetails = CollectionHelper.ConvertTo(RFSChargesDetails, "");
            //BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramRFSChargesDetails = new SqlParameter();
            paramRFSChargesDetails.ParameterName = "@RFSChargesDetailsType";
            paramRFSChargesDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRFSChargesDetails.Value = dtRFSChargesDetails;

            DataTable dtRFSCustomChargesDetails = CollectionHelper.ConvertTo(RFSCustomChargesDetails, "");
            SqlParameter paramRFSCustomChargesDetails = new SqlParameter();
            paramRFSCustomChargesDetails.ParameterName = "@RFSCustomChargesDetails";
            paramRFSCustomChargesDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRFSCustomChargesDetails.Value = dtRFSCustomChargesDetails;

            DataTable dtRFSHandlingChargesDetails = CollectionHelper.ConvertTo(RFSHandlingCharges, "");
            SqlParameter paramRFSHandlingChargesDetails = new SqlParameter();
            paramRFSHandlingChargesDetails.ParameterName = "@RFSHandlingCharge";
            paramRFSHandlingChargesDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRFSHandlingChargesDetails.Value = dtRFSHandlingChargesDetails;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramRFSChargesDetails, paramRFSCustomChargesDetails, paramRFSHandlingChargesDetails, new SqlParameter("@BillTo", BillTo),
                                             new SqlParameter("@BillToSno", BillToSno), new SqlParameter("@AirportCode", AirportCode), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@MovementType", 1), new SqlParameter("@PaymentMode", PaymentMode), new SqlParameter("@BillToDockingVendor", BillToDockingVendor) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveRFSChargesDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string SaveImportRFSAssignFlight(List<AssignFlightDetails> AssignFlightDetails, string AirportCode, string RFSTruckDetailsSNo)
        {
            DataTable dtAssignFlightDetails = CollectionHelper.ConvertTo(AssignFlightDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramAssignFlightDetails = new SqlParameter();
            paramAssignFlightDetails.ParameterName = "@ImportAssignFlightDetailsType";
            paramAssignFlightDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramAssignFlightDetails.Value = dtAssignFlightDetails;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramAssignFlightDetails, new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@AirportCode", AirportCode), new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveImportRFSAssignFlight", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}