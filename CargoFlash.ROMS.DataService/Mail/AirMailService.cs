using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Mail;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Globalization;
using System.Net;
using Newtonsoft.Json;


namespace CargoFlash.Cargo.DataService.Mail
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirMailService : BaseWebUISecureObject, IAirMailService
    {
        public bool IsKlasConnection = false;

        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string CN38No = "",string BookingDate="", string FlightNo = "0", string FlightDate = "", string ShipmentOrigin = "0", string ShipmentDest = "0", string MailCategory = "0", string MailHCCode = "0", string TotalPieces = "0", string GrossWeight = "0", string ChargeableWeight = "0", string ProcessedStatus = "", string MovementType = "", string Status = "")
        {
            try
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
                            case "AIRMAIL":
                                if (appName.ToUpper().Trim() == "AIRMAIL")
                                    CreateAirMailGrid(myCurrentForm, processName, CN38No,BookingDate, FlightNo, FlightDate, ShipmentOrigin, ShipmentDest, MailCategory, MailHCCode, TotalPieces, GrossWeight, ChargeableWeight, ProcessedStatus, MovementType, Status);
                                break;
                            default:
                                break;
                        }
                        break;
                    case DisplayModeReadView:

                        break;
                    default:
                        break;
                }
                myCurrentForm.Append("<div id='divAirMailTrans_' style='width:100%'><div id='divAirMailTrans' style='width:100%'> <input id='hdnPageType' name='hdnAirmailSNo' type='hidden'/><table id='tblAirMailTrans' validateonsubmit='true' class='WebFormTable' style='width:100%'></table></div></div>");
                byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultMyForm);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateAirMailGrid(StringBuilder Container, string ProcessName, string CN38No = "", string BookingDate = "", string FlightNo = "0", string FlightDate = "", string ShipmentOrigin = "0", string ShipmentDest = "0", string MailCategory = "0", string MailHCCode = "0", string TotalPieces = "0", string GrossWeight = "0", string ChargeableWeight = "0", string ProcessedStatus = "", string MovementType = "", string Status = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/Mail/AirMailService.svc/GetAirMailDetailsGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Airmail List";
                    g.IsPageable = true;
                    g.IsAllowedPaging = true;
                    g.IsProcessPart = true;
                    g.IsRowChange = true;
                    g.IsRowDataBound = false;
                    g.IsPageSizeChange = true;
                    g.IsPager = true;
                    g.IsOnlyTotalDisplay = true;
                    g.ProcessName = ProcessName;
                    g.IsVirtualScroll = false;
                    g.IsDisplayOnly = false;
                    g.IsActionRequired = false;
                    g.IsSortable = true;
                    g.IsAllowedFiltering = true;
                    //  g.IsVirtualScroll = false;
                    g.IsShowGridHeader = false;
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 40 });
                    g.Column.Add(new GridColumn { Field = "CN38No", IsLocked = false, Title = "Airmail Number", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "BookingDate", Title = "Booking Date", DataType = GridDataType.Date.ToString(), Width = 40, Template = "# if( BookingDate==null) {# # } else {# #= kendo.toString(new Date(data.BookingDate.getTime() + data.BookingDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 40, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "ShipmentOrigin", IsLocked = false, Title = "Origin City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ShipmentDest", IsLocked = false, Title = "Dest City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "MailCategoryName", IsLocked = false, Title = "Mail Category", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "MailHCCode", IsLocked = false, Title = "Mail Handling Class Code", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "TotalPieces", IsLocked = false, Title = "Total Pc", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", IsLocked = false, Title = "Gr.Wt.", DataType = GridDataType.String.ToString(), Width = 35 });
                    //g.Column.Add(new GridColumn { Field = "ChargeableWeight", IsLocked = false, Title = "Chargeable Weight", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "ProcessedStatus", Title = "Process Status", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "SplitLoaded", Title = "Split Plan", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Type", Title = "Type", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "UM", Title = "TransactionType", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "CN38No", Value = CN38No });
                    g.ExtraParam.Add(new GridExtraParam { Field = "BookingDate", Value = BookingDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "ShipmentOrigin", Value = ShipmentOrigin });
                    g.ExtraParam.Add(new GridExtraParam { Field = "ShipmentDest", Value = ShipmentDest });
                    g.ExtraParam.Add(new GridExtraParam { Field = "MailCategory", Value = MailCategory });
                    g.ExtraParam.Add(new GridExtraParam { Field = "MailHCCode", Value = MailHCCode });
                    g.ExtraParam.Add(new GridExtraParam { Field = "TotalPieces", Value = TotalPieces });
                    g.ExtraParam.Add(new GridExtraParam { Field = "GrossWeight", Value = GrossWeight });
                    //g.ExtraParam.Add(new GridExtraParam { Field = "ChargeableWeight", Value = ChargeableWeight });
                    g.ExtraParam.Add(new GridExtraParam { Field = "ProcessedStatus", Value = ProcessedStatus });
                    g.ExtraParam.Add(new GridExtraParam { Field = "Status", Value = Status });
                    g.ExtraParam.Add(new GridExtraParam { Field = "MovementType", Value = MovementType });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public Stream GetAirMailGridData(string processName, string moduleName, string appName, string CN38No, string FlightNo, string FlightDate, string ShipmentOrigin, string ShipmentDest, string MailCategory, string MailHCCode, string MovementType)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, "IndexView", CN38No: CN38No, FlightNo: FlightNo, FlightDate: FlightDate, ShipmentOrigin: ShipmentOrigin, ShipmentDest: ShipmentDest, MailCategory: MailCategory, MailHCCode: MailHCCode, MovementType: MovementType);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetAirMailDetailsGridData(string CN38No, string FlightNo, string FlightDate, string ShipmentOrigin, string ShipmentDest, string MailCategory, string MailHCCode, string MovementType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {

            //FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");
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

                ProcName = "GetListAirMailDetails";

                string filters = GridFilter.ProcessFilters<AirMail>(filter);

                SqlParameter[] Parameters =
                                        {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                            new SqlParameter("@CN38No", CN38No),
                                            new SqlParameter("@FlightNo", FlightNo),
                                            new SqlParameter("@FlightDate", FlightDate),
                                            new SqlParameter("@LoggedInCity", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode),
                                            new SqlParameter("@ShipmentOrigin", ShipmentOrigin),
                                            new SqlParameter("@ShipmentDest", ShipmentDest),
                                            new SqlParameter("@MailCategory", MailCategory),
                                            new SqlParameter("@MailHCCode", MailHCCode),
                                            new SqlParameter("@MovementType", string.IsNullOrEmpty(MovementType)?0: Convert.ToInt32(MovementType))
                                            
                                        };

                ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, ProcName, Parameters);     // KLAS connection string

                var AirMailList = ds.Tables[0].AsEnumerable().Select(e => new AirMail
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CN38No = e["CN38No"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    //FlightDate = Convert.ToDateTime(e["FlightDate"]),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDest = e["ShipmentDest"].ToString(),
                    //MailCategory = Convert.ToInt32(e["MailCategory"]),
                    //MailHCCode = e["MailHCCode"].ToString()
                    MailCategoryName = e["MailCategoryName"].ToString(),
                    MailHCCode = e["MHCName"].ToString(),
                    TotalPieces = Convert.ToInt32(e["TotalPieces"]),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                    //ChargeableWeight = Convert.ToDecimal(e["ChargeableWeight"]),
                    ProcessedStatus = e["ProcessedStatus"].ToString(),
                    Status = e["Status"].ToString(),
                    UM = e["TransactionType"].ToString(),
                    ProcessStatus = e["ProcessStatus"].ToString(),
                    BookingDate = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                    SplitLoaded = e["SplitLoaded"].ToString(),
                    Type = e["Type"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirMailList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string GetAirMailDetails(Int32 AirMailSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirMailSNO", AirMailSNO),
                                              new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };
                DataSet ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "GetAirMailDetails", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAirMailCustomerInformation(Int32 AirMailSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirMailSNO", AirMailSNO) };
                DataSet ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "GetAirMailCustomerInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //public string GetAirMailTrans(Int32 AirMailSNO)
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@AirMailSNO", AirMailSNO) };
        //    DataSet ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "GetAirMailTrans", Parameters);
        //    ds.Dispose();
        //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //}


        public KeyValuePair<string, List<AirMailTransaction>> GetAirMailTrans(string SNO, int pageNo, int pageSize, string whereCondition, CreateAirMailWhereCondition model, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirMailSNO", model.AirMailSNo), new SqlParameter("@PageNo", pageNo), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
                //SqlParameter[] Parameters = { new SqlParameter("@AirMailSNO", model.AirMailSNo) };
                DataSet ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "GetAirMailTransDN", Parameters);
                var AirMailTransactionList = ds.Tables[0].AsEnumerable().Select(e => new AirMailTransaction
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    POMailSNo = Convert.ToInt32(e["POMailSNo"].ToString()),
                    OriCountryCode = (e["text_oricountrycode"].ToString()),
                    OriCityCode = e["text_oricitycode"].ToString(),
                    OriOEQualifier = (e["text_orioequalifier"].ToString()),
                    DestCountryCode = (e["text_destcountrycode"].ToString()),
                    DestCityCode = e["text_destcitycode"].ToString(),
                    DestOEQualifier = e["text_destoequalifier"].ToString(),
                    MailCategory = e["text_mailcategory"].ToString(),
                    MailSubCategory = (e["text_mailsubcategory"].ToString()),
                    YearOfDispatch = e["YearOfDispatch"].ToString(),
                    DNNo = e["DNNo"].ToString(),
                    ReceptacleNumber = e["ReceptacleNumber"].ToString(),
                    HNRIndicator = (e["HNRIndicator"].ToString()),
                    RIICode = e["RIICode"].ToString(),
                    ReceptacleWeight = e["ReceptacleWeightValue"].ToString(),
                    ULDStock = e["text_ULDNo"].ToString(),
                    HdnULDStock = e["ULDNo"].ToString(),
                    HdnOriCountryCode = (e["OriCountryCode"].ToString()),
                    HdnOriCityCode = e["OriCityCode"].ToString(),
                    HdnOriOEQualifier = (e["OriOEQualifier"].ToString()),
                    HdnDestCountryCode = (e["DestCountryCode"].ToString()),
                    HdnDestCityCode = e["DestCityCode"].ToString(),
                    HdnDestOEQualifier = e["DestOEQualifier"].ToString(),
                    HdnMailCategory = e["MailCategory"].ToString(),
                    HdnMailSubCategory = (e["MailSubCategory"].ToString()),
                });
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new KeyValuePair<string, List<AirMailTransaction>>("", AirMailTransactionList.AsQueryable().ToList());
                }
                else
                {


                    return new KeyValuePair<string, List<AirMailTransaction>>(ds.Tables[1].Rows[0][0].ToString(), AirMailTransactionList.AsQueryable().ToList());
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string DeletePOMailTrans(string recid, string PoMailSNo)
        {

            string message = string.Empty;
            try
            {
                SqlParameter[] Parameters = { 
                                                new SqlParameter("@SNo", recid), 
                                                new SqlParameter("@PoMailSNo", PoMailSNo) ,
                                                new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };
                DataSet dsResult = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "DeleteAirMailTransaction", Parameters);
                if (dsResult != null && dsResult.Tables.Count > 0 && dsResult.Tables[0] != null && dsResult.Tables[0].Rows.Count > 0)
                {
                    message = dsResult.Tables[0].Rows[0]["Result"].ToString();
                }
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    message = ex.Message;
            //}
            catch(Exception ex)//
            {
                throw ex;
            }
            return message;
        }

        public string GetFlightDetails(string PoMailSNo, string DNNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PoMailSNo", PoMailSNo), new SqlParameter("@DNNo", DNNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "PoMail_GetFlightDetails", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
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

        public string SaveAirmail(Int32 AirMailSNo, AirMail ShipmentInformation, string MovementType, int AirlineCode)
        {
            if (AirMailSNo > 0)
            {
                ShipmentInformation.SNo = AirMailSNo;
            }
            string message = string.Empty;
            List<AirMail> lstPOMailInformation = new List<AirMail>();
            lstPOMailInformation.Add(ShipmentInformation);
            lstPOMailInformation.ForEach(e => e.CN38No = e.AirportCode + e.CN38No);

            // DataTable dtPOMailInformation = CollectionHelper.ConvertTo(lstPOMailInformation, "ProcessedStatus,Text_IssuingAgent,Text_SPHC,Text_MailCategory,Text_MailHCCode,UpdatedBy,UpdatedOn,CreatedBy,CreatedOn,MailCategoryName,AirportCode");
            DataTable dtPOMailInformation = CollectionHelper.ConvertTo(lstPOMailInformation, "AirportCode,CreatedBy,CreatedOn,ItineraryCarrierCode,ItineraryDestination,ItineraryFlightNo,ItineraryGrossWeight,ItineraryOrigin,ItineraryPieces,ItineraryVolumeWeight,MailCategoryName,ProcessedStatus,Text_IssuingAgent,Text_ItineraryCarrierCode,Text_ItineraryDestination,Text_ItineraryFlightNo,Text_ItineraryOrigin,Text_MailCategory,Text_MailHCCode,Text_SPHC,UpdatedBy,UpdatedOn,Status,BookingDate,SplitLoaded");

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramShipmentInformation = new SqlParameter();
            paramShipmentInformation.ParameterName = "@ShipmentInfo";
            paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipmentInformation.Value = dtPOMailInformation;

            SqlParameter[] Parameters =
            {
                new SqlParameter("@SNo", AirMailSNo),
                paramShipmentInformation,
                new SqlParameter("@CreateBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) ,
                 new SqlParameter("@MovementType", MovementType),
                    new SqlParameter("@AirlineCode", AirlineCode)
            };
            DataSet dsResult = new DataSet();
            try
            {
                dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAirMail", Parameters);
                //dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigDBMSKlasString, "CreateAirMail", Parameters);
                if (dsResult != null && dsResult.Tables.Count > 0 && dsResult.Tables[0] != null && dsResult.Tables[0].Rows.Count > 0)
                {
                    message = dsResult.Tables[0].Rows[0]["Result"].ToString() + '/' + dsResult.Tables[0].Rows[0]["PoMailSNo"].ToString();
                }
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    message = ex.Message;
            //}
            catch(Exception ex)//
            {
                throw ex;
            }
            return message;
        }

        public string SaveItinerary(Int32 AirMailSNo, AirMail ShipmentInformation, string MovementType, int AirlineCode, POMailInformation POMailInformation, List<POMailItineraryInformation> PoMailItineraryInformation)
        {

            if (AirMailSNo > 0)
            {
                ShipmentInformation.SNo = AirMailSNo;
            }
            string message = string.Empty;
            List<AirMail> lstPOMailInformation_save = new List<AirMail>();
            lstPOMailInformation_save.Add(ShipmentInformation);
            lstPOMailInformation_save.ForEach(e => e.CN38No = e.AirportCode + e.CN38No);

            // DataTable dtPOMailInformation = CollectionHelper.ConvertTo(lstPOMailInformation, "ProcessedStatus,Text_IssuingAgent,Text_SPHC,Text_MailCategory,Text_MailHCCode,UpdatedBy,UpdatedOn,CreatedBy,CreatedOn,MailCategoryName,AirportCode");
            DataTable dtPOMailInformation_save = CollectionHelper.ConvertTo(lstPOMailInformation_save, "AirportCode,CreatedBy,CreatedOn,ItineraryCarrierCode,ItineraryDestination,ItineraryFlightNo,ItineraryGrossWeight,ItineraryOrigin,ItineraryPieces,ItineraryVolumeWeight,MailCategoryName,ProcessedStatus,Text_IssuingAgent,Text_ItineraryCarrierCode,Text_ItineraryDestination,Text_ItineraryFlightNo,Text_ItineraryOrigin,Text_MailCategory,Text_MailHCCode,Text_SPHC,UpdatedBy,UpdatedOn,Status,ProcessStatus,BookingDate,SplitLoaded,Type");

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramShipmentInformation = new SqlParameter();
            paramShipmentInformation.ParameterName = "@ShipmentInfo";
            paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipmentInformation.Value = dtPOMailInformation_save;


            try
            {


                List<POMailInformation> lstPOMailInformation = new List<POMailInformation>();
                lstPOMailInformation.Add(POMailInformation);
                DataTable dtPOMailInformation = CollectionHelper.ConvertTo(lstPOMailInformation, "");

                DataTable dtPoMailItineraryInformation = CollectionHelper.ConvertTo(PoMailItineraryInformation, "");

                SqlParameter paramPOMailInformation = new SqlParameter();
                paramPOMailInformation.ParameterName = "@POMailInformation";
                paramPOMailInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramPOMailInformation.Value = dtPOMailInformation;

                SqlParameter paramPoMailItineraryInformation = new SqlParameter();
                paramPoMailItineraryInformation.ParameterName = "@PoMailItineraryInformation";
                paramPoMailItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramPoMailItineraryInformation.Value = dtPoMailItineraryInformation;
                int BookingRefNo = 0;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters_itenary = {
                new SqlParameter("@SNo", AirMailSNo),
                paramShipmentInformation,
                new SqlParameter("@CreateBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) ,
                new SqlParameter("@MovementType", MovementType),
                new SqlParameter("@AirlineCode", AirlineCode),                                        
                                                          

                                            paramPOMailInformation,
                                            paramPoMailItineraryInformation,

                                            new SqlParameter("@BookingStationCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                           
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAirmail", Parameters_itenary);
                //  return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    message = ds.Tables[0].Rows[0]["Result"].ToString() + '/' + ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                }

            }

            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return message;
        }
        public string SaveAirmailCustomer(Int32 AirMailSNo, AirMailCustomer Customer, string SHIPPER_AccountNo, string CONSIGNEE_AccountNo)
        {
            if (AirMailSNo > 0)
            {
                Customer.POMailSNo = AirMailSNo;
            }
            string message = string.Empty;
            List<AirMailCustomer> lstCustomer = new List<AirMailCustomer>();
            lstCustomer.Add(Customer);
            DataTable dtCustomer = CollectionHelper.ConvertTo(lstCustomer, "SNo,UpdatedBy,UpdatedOn,CreatedBy,CreatedOn");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramCustomer = new SqlParameter();
            paramCustomer.ParameterName = "@CustomerInfo";
            paramCustomer.SqlDbType = System.Data.SqlDbType.Structured;
            paramCustomer.Value = dtCustomer;

            SqlParameter[] Parameters =
            {
                new SqlParameter("@PoMailSNo", AirMailSNo),
                paramCustomer,
                new SqlParameter("@CreateBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                 new SqlParameter("@SHIPPER_AccountNo", SHIPPER_AccountNo),
                  new SqlParameter("@CONSIGNEE_AccountNo", CONSIGNEE_AccountNo)
            };
            DataSet dsResult = new DataSet();
            try
            {
                dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAirMailCustomer", Parameters);
                //dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigDBMSKlasString, "CreateAirMailCustomer", Parameters);
                if (dsResult != null && dsResult.Tables.Count > 0 && dsResult.Tables[0] != null && dsResult.Tables[0].Rows.Count > 0)
                {
                    message = dsResult.Tables[0].Rows[0]["Result"].ToString();
                }
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    message = ex.Message;
            //}
            catch(Exception ex)//
            {
                throw ex;
            }
            return message;
        }

        /// <summary>
        /// Harish
        /// </summary>
        /// <param name="AirMailSNo"></param>
        /// <param name="LstPieceTrans"></param>
        /// <returns></returns>
        public string SaveAirmailTrans(Int32 AirMailSNo, List<AirMailTransaction> LstPieceTrans, string Value)
        {
            //if (AirMailSNo > 0)
            //{
            //    Customer.POMailSNo = AirMailSNo;
            //}
            string message = string.Empty;
            string SNo = "";
            //List<AirMailTrans> lstCustomer = new List<AirMailTrans>();
            //lstCustomer.Add(Customer);

            DataTable dtPieceInfo = CollectionHelper.ConvertTo(LstPieceTrans, "POMailSNo,HdnOriCountryCode,HdnOriCityCode,HdnOriOEQualifier,HdnDestCountryCode,HdnDestCityCode,HdnDestOEQualifier,HdnMailCategory,HdnMailSubCategory,HdnULDStock");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramPieceInfo = new SqlParameter();
            paramPieceInfo.ParameterName = "@PieceInfo";
            paramPieceInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramPieceInfo.Value = dtPieceInfo;

            SqlParameter[] Parameters =
            {
                new SqlParameter("@PoMailSNo", AirMailSNo),
                paramPieceInfo,
                new SqlParameter("@Value", Value),
                new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
            };
            DataSet dsResult = new DataSet();
            try
            {
                dsResult = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), "CreateAirMailTransaction_New", Parameters);
                if (dsResult != null && dsResult.Tables.Count > 0 && dsResult.Tables[0] != null && dsResult.Tables[0].Rows.Count > 0)
                {
                    message = dsResult.Tables[0].Rows[0]["Result"].ToString() + '_' +dsResult.Tables[0].Rows[0]["SNO"].ToString() + '_' + dsResult.Tables[0].Rows[0]["ShipmentType"].ToString();
                    //SNo = dsResult.Tables[0].Rows[0]["SNO"].ToString();
                }
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    message = ex.Message;
            //}
            catch(Exception ex)//
            {
                throw ex;
            }
            return message;
        }
        public string SaveDNFlightDetails(List<DNFlightTransaction> FlightDetails, string DNSNo)
        {
            string message = string.Empty;
            DataTable dtFlightInfo = CollectionHelper.ConvertTo(FlightDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramFlightInfo = new SqlParameter();
            paramFlightInfo.ParameterName = "@FlightInfo";
            paramFlightInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramFlightInfo.Value = dtFlightInfo;

            SqlParameter[] Parameters =
            {
                paramFlightInfo,
                new SqlParameter("@DNSNo",DNSNo),
                new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
            };
            DataSet dsResult = new DataSet();
            try
            {
                dsResult = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), "PoMail_SaveDNflighttrans", Parameters);
                if (dsResult != null && dsResult.Tables.Count > 0 && dsResult.Tables[0] != null && dsResult.Tables[0].Rows.Count > 0)
                {
                    message = dsResult.Tables[0].Rows[0]["Result"].ToString();
                }
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    message = ex.Message;
            //}
            catch(Exception ex)//
            {
                throw ex;
            }
            return message;
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

        /// <summary>
        /// Harish
        /// </summary>
        /// <param name="AirMailSNO"></param>
        /// <returns></returns>
        public string GetRecordAtPayment(Int32 AirMailSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirMailSNo", AirMailSNo) };
                //(IsKlasConnection ? DMLConnectionString.WebConfigDBMSKlasString : DMLConnectionString.WebConfigConnectionString)
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtAirMailPayment", Parameters);//GetRecordAtAirMailPayment
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string FBLHandlingCharges(Int32 AirMailSNo, string CityCode)
        {
            //((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AirMailSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", "0"),
                                            new SqlParameter("@ShipmentType", "1"),
                                            new SqlParameter("@HAWBSNo", "0"),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", 17),
                                            new SqlParameter("@SubProcessSNo", 2195),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString())
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Save Payment Invoice
        /// </summary>
        /// <param name="AirMailSNo"></param>
        /// <param name="TotalCash"></param>
        /// <param name="TotalCredit"></param>
        /// <param name="lstHandlingCharge"></param>
        /// <param name="lstAWBCheque"></param>
        /// <param name="CityCode"></param>
        /// <param name="UpdatedBy"></param>
        /// <returns></returns>
        public string SaveAtPayment(string strData)
        {
            SaveAtPaymentRequest savePaymentRequest = JsonConvert.DeserializeObject<SaveAtPaymentRequest>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
            string Message = "";
            DataTable dtHandlingCharge = CollectionHelper.ConvertTo(savePaymentRequest.lstHandlingCharge, "");
            //DataTable dtAgentBranchCheque = CollectionHelper.ConvertTo(lstAgentBranchCheque, "");
            DataTable dtAWBCheque = CollectionHelper.ConvertTo(savePaymentRequest.lstAWBCheque, "");

            SqlParameter paramHandlingCharge = new SqlParameter();
            paramHandlingCharge.ParameterName = "@HandlingCharge";
            paramHandlingCharge.SqlDbType = System.Data.SqlDbType.Structured;
            paramHandlingCharge.Value = dtHandlingCharge;

            SqlParameter paramAWBCheque = new SqlParameter();
            paramAWBCheque.ParameterName = "@AWBCheque";
            paramAWBCheque.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBCheque.Value = dtAWBCheque;


            try
            {
                String connecionString = String.Empty;

                SqlParameter[] Parameters = {
                                                paramHandlingCharge,
                                                new SqlParameter("@CityCode", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode.ToString()),
                                                new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                new SqlParameter("@MovementType", 2), 
                                                new SqlParameter("@Process", 17), 
                                                new SqlParameter("@DOSNo", 0),
                                                new SqlParameter("@PDSNo", 0) ,

                                                new SqlParameter("@SubProcessSNo", 2195), 
                                                new SqlParameter("@ChargeToSNo", 0), 
                                                new SqlParameter("@IsESS", 0),
                                                new SqlParameter("@BilltoAccountSNo", 0) ,
                                                new SqlParameter("@Shippername", ""),
                                                new SqlParameter("@DONumber", ""),
                                                new SqlParameter("@HAWBSNO",0) ,
                                              new SqlParameter("@AirMailSNo_Payment",Convert.ToInt32(savePaymentRequest.AirMailSNo)) 
                                            };


                connecionString = DMLConnectionString.WebConfigConnectionString;
                Message = Convert.ToString(SqlHelper.ExecuteScalar(connecionString, "SaveAtPaymentInvoice", Parameters));



            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    Message = ex.Message;
            //}
            catch(Exception ex)//
            {
                throw ex;
            }
            return Message;
        }


        public string GetMailSubCategory()
        {
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetMailSubCategory");
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetScannedDN(string StrData)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@String", StrData) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ScanDN", Parameters);

                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<ScannDn> GetScannedDNN(string StrData)
        {
            try
            {
                ScannDn scndn;
                SqlParameter[] Parameters = { new SqlParameter("@String", StrData) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ScanDN", Parameters);
                List<ScannDn> listScanDNN = new List<ScannDn>();
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    scndn = new ScannDn();
                    scndn.oricountrycode = dr["oricountrycode"].ToString();
                    scndn.text_oricountrycode = dr["text_oricountrycode"].ToString();
                    scndn.oricitycode = dr["oricitycode"].ToString();
                    scndn.text_oricitycode = dr["text_oricitycode"].ToString();
                    scndn.orioequalifier_SNo = dr["orioequalifier_SNo"].ToString();
                    scndn.text_orioequalifier = dr["text_orioequalifier"].ToString();
                    scndn.destcountrycode = dr["destcountrycode"].ToString();
                    scndn.text_destcountrycode = dr["text_destcountrycode"].ToString();
                    scndn.destcitycode = dr["destcitycode"].ToString();
                    scndn.text_destcitycode = dr["text_destcitycode"].ToString();
                    scndn.destoequalifier_SNo = dr["destoequalifier_SNo"].ToString();
                    scndn.text_destoequalifier = dr["text_destoequalifier"].ToString();
                    scndn.mailcategory = dr["mailcategory"].ToString();
                    scndn.text_mailcategory = dr["text_mailcategory"].ToString();
                    scndn.text_mailsubcategory = dr["text_mailsubcategory"].ToString();
                    scndn.mailsubcategory = dr["mailsubcategory"].ToString();
                    scndn.yearofdispatch = dr["yearofdispatch"].ToString();
                    scndn.dnno = dr["dnno"].ToString();
                    scndn.receptaclenumber = dr["receptaclenumber"].ToString();
                    scndn.hnrindicator = dr["hnrindicator"].ToString();
                    scndn.riicode = dr["riicode"].ToString();
                    scndn.receptacleweight = dr["receptacleweight"].ToString();
                    listScanDNN.Add(scndn);

                }
                return listScanDNN;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //added by jitendra kumar
        public string SearchFlightResult(string airlinecode, string Origin, String Destination, string ItineraryDate, string ItineraryCarrierCode, string ItineraryFlightNo, string ItineraryTransit, decimal ItineraryGrossWeight, decimal ItineraryVolumeWeight, string Commodity, string SHCSNo, Int32 AgentSNo, int OverrideBCT, int OverrideMCT, int IsMCT, string ETA, string SearchCarrierCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@FlightNo", ItineraryFlightNo),
                                            new SqlParameter("@FlightDate", ItineraryDate),
                                            new SqlParameter("@Origin", Origin),
                                            new SqlParameter("@Destination", Destination),
                                            new SqlParameter("@Volume", ItineraryVolumeWeight),
                                            new SqlParameter("@GrWeight", ItineraryGrossWeight),
                                            new SqlParameter("@ProductSNo", 0),
                                            new SqlParameter("@CommoditySNo", ""),
                                            new SqlParameter("@SHCSNo", SHCSNo),
                                            new SqlParameter("@AgentSNo", AgentSNo),
                                            new SqlParameter("@ShipperSNo", 0),
                                            new SqlParameter("@IsCAO", false),
                                            new SqlParameter("@IsUld", false),
                                              new SqlParameter("@OverrideBCT",OverrideBCT),
                                            new SqlParameter("@OverrideMCT",OverrideMCT),
                                            new SqlParameter("@IsMCT",IsMCT),
                                            new SqlParameter("@ETD",ETA),
                                            new SqlParameter("@SearchCarrierCode",SearchCarrierCode),
                                            new SqlParameter("@ErrorMessage",DbType.String){Direction=ParameterDirection.Output,Size=250}
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_FlightSearch", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SearchFlightResultTest(string airlinecode, string Origin, String Destination, string ItineraryDate, string ItineraryCarrierCode, string ItineraryFlightNo, string ItineraryTransit, decimal ItineraryGrossWeight, decimal ItineraryVolumeWeight, string Commodity, string SHCSNo, Int32 AgentSNo, int OverrideBCT, int OverrideMCT, int IsMCT, string ETA, string SearchCarrierCode, string SearchFrom, string BookingNo)
        {
            try
            {
                if (BookingNo != "0")
                {
                    BookingNo = BookingNo.Remove(0, 4);
                }
                SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@FlightNo", ItineraryFlightNo),
                                            new SqlParameter("@FlightDate", ItineraryDate),
                                            new SqlParameter("@Origin", Origin),
                                            new SqlParameter("@Destination", Destination),
                                            new SqlParameter("@Volume", ItineraryVolumeWeight),
                                            new SqlParameter("@GrWeight", ItineraryGrossWeight),
                                            new SqlParameter("@ProductSNo", 0),
                                            new SqlParameter("@CommoditySNo", ""),
                                            new SqlParameter("@SHCSNo", SHCSNo),
                                            new SqlParameter("@AgentSNo", AgentSNo),
                                            new SqlParameter("@ShipperSNo", 0),
                                            new SqlParameter("@IsCAO", false),
                                            new SqlParameter("@IsUld", false),
                                              new SqlParameter("@OverrideBCT",OverrideBCT),
                                            new SqlParameter("@OverrideMCT",OverrideMCT),
                                            new SqlParameter("@IsMCT",IsMCT),
                                            new SqlParameter("@ETD",ETA),
                                            new SqlParameter("@SearchCarrierCode",SearchCarrierCode),
                                            new SqlParameter("@SearchFrom",SearchFrom),
                                            new SqlParameter("@BookingNo",BookingNo),
                                            new SqlParameter("@ErrorMessage",DbType.String){Direction=ParameterDirection.Output,Size=250} 
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_FlightSearch", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string CheckEmbargoParam(int DailFlightSNo, int AgentSNo, int ProductSNo, int CommoditySNo, int ItineraryPieces, string ItineraryGrossWeight, string ItineraryVolumeWeight, int PaymentType, string SPHC)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailFlightSNo", DailFlightSNo),
                                            new SqlParameter("@AgentSNo", AgentSNo),
                                            new SqlParameter("@ProductSNo", ProductSNo),
                                            new SqlParameter("@CommoditySNo", CommoditySNo),
                                             new SqlParameter("@ItineraryPieces", ItineraryPieces),
                                             new SqlParameter("@ItineraryGrossWeight", ItineraryGrossWeight),
                                             new SqlParameter("@ItineraryVolumeWeight", ItineraryVolumeWeight),
                                             new SqlParameter("@PaymentType", PaymentType),
                                             new SqlParameter("@SPHC", SPHC)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "USP_Reservation_CheckEmbargoParam", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string CheckEmbargoParamAll(Int64 AirMailSNo, Int64 BookingSNo, Int64 BookingRefNo, POMailInformation POMailInformation, List<POMailItineraryInformation> PoMailItineraryInformation)
        {
            try
            {

                BaseBusiness baseBusiness = new BaseBusiness();

                List<POMailInformation> lstPOMailInformation = new List<POMailInformation>();
                lstPOMailInformation.Add(POMailInformation);
                DataTable dtPOMailInformation = CollectionHelper.ConvertTo(lstPOMailInformation, "");


                DataTable dtPoMailItineraryInformation = CollectionHelper.ConvertTo(PoMailItineraryInformation, "");

                SqlParameter paramPOMailInformation = new SqlParameter();
                paramPOMailInformation.ParameterName = "@POMailInformation";
                paramPOMailInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramPOMailInformation.Value = dtPOMailInformation;

                SqlParameter paramPoMailItineraryInformation = new SqlParameter();
                paramPoMailItineraryInformation.ParameterName = "@PoMailItineraryInformation";
                paramPoMailItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramPoMailItineraryInformation.Value = dtPoMailItineraryInformation;

                SqlParameter[] Parameters = { paramPOMailInformation,
                                            paramPoMailItineraryInformation,
                                            new SqlParameter("@POMailSNo", AirMailSNo),
                                            new SqlParameter("@BookingSNo", BookingSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "POMail_CheckEmbargoAll", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SelectdRoute(string DailFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailFlightSNo", DailFlightSNo),
                                            new SqlParameter("@ErrorMessage",DbType.String){Direction=ParameterDirection.Output,Size=250}
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "USP_MAIL_FlightSearch_selected", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetAirportofSelectedAWBOriginDestination(Int32 CitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetAirportofSelectedAWBOriginDestination", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetSelectedAWBOriginDestination(string Citycode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CityCODE", Citycode) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "USP_SelectedAWBOriginDestination", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string ViewRoute(Int32 ItineraryOrigin, Int32 ItineraryDestination)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ItineraryOrigin", ItineraryOrigin),
                                            new SqlParameter("@ItineraryDestination", ItineraryDestination)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "USp_Reservation_ViewRouteSearch", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string ISSecondLegORNot(string ItineraryOrigin, string ItineraryDestination)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ItineraryOrigin", ItineraryOrigin),
                                          new SqlParameter("@ItineraryDestination", ItineraryDestination)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_ISSecondLegORNot", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string UpdatePomailItenaryInformation(Int64 BookingRefNo, POMailInformation POMailInformation, List<POMailItineraryInformation> PoMailItineraryInformation)
        {
            List<POMailInformation> lstPOMailInformation = new List<POMailInformation>();
            lstPOMailInformation.Add(POMailInformation);
            DataTable dtPOMailInformation = CollectionHelper.ConvertTo(lstPOMailInformation, "");

            DataTable dtPoMailItineraryInformation = CollectionHelper.ConvertTo(PoMailItineraryInformation, "");

            SqlParameter paramPOMailInformation = new SqlParameter();
            paramPOMailInformation.ParameterName = "@POMailInformation";
            paramPOMailInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramPOMailInformation.Value = dtPOMailInformation;

            SqlParameter paramPoMailItineraryInformation = new SqlParameter();
            paramPoMailItineraryInformation.ParameterName = "@PoMailItineraryInformation";
            paramPoMailItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramPoMailItineraryInformation.Value = dtPoMailItineraryInformation;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            
                                            new SqlParameter("@BookingRefNo", Convert.ToInt32(BookingRefNo)),
                                            paramPOMailInformation,
                                            paramPoMailItineraryInformation,

                                            new SqlParameter("@BookingStationCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                           
                                        };
            DataSet ds1 = new DataSet();
            try
            {


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "usp_UpdatePomailItenaryInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    return ex.Message;
            //}
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string BindAllotmentArray(int DailyFlightSNo, int AccountSNo, int ShipperSNo, decimal GrossWt, decimal Volume, string ProductSNo, string CommoditySNo, string SHC)
        {
            try
            {
                dynamic queryData = "";
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                            new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@ShipperSNo", ShipperSNo),
                                            new SqlParameter("@GrossWt", GrossWt),
                                            new SqlParameter("@Volume", Volume),
                                            new SqlParameter("@ProductSNo", ProductSNo),
                                            new SqlParameter("@CommoditySNo", CommoditySNo),
                                            new SqlParameter("@SHC", SHC),
                                            new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_DailyFlightAllotment", Parameters);
                //if(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName=="AGENT")
                //{
                //     queryData = ds.Tables[0].AsEnumerable().Where(x => x.Field<string>("AllotmentType").ToUpper() != "OPEN");
                //     if (queryData==null)
                //     {
                //         queryData = "";
                //     }
                //     ds.Dispose();
                //}
                //else
                //{
                //    queryData = ds;
                //    ds.Dispose();
                //}
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetItineraryCarrierCode(string AWBCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBCode", AWBCode) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_Mail_GetItineraryCarrierCode", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        #region Tax Information
        public KeyValuePair<string, List<TaxChargeInformation>> GetTaxChargeInformationTabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                var AWBSNo = (whereCondition == "0" || whereCondition == "") ? 0 : Convert.ToInt32(whereCondition);
                whereCondition = "";
                TaxChargeInformation TaxChargeInformation = new TaxChargeInformation();
                SqlParameter[] Parameters = { new SqlParameter("@PomailSno", recordID), new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetRecordTaxChargeInformation_POMAIL", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var TaxChargeInformationList = ds.Tables[0].AsEnumerable().Select(e => new TaxChargeInformation
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = e["AWBSNo"].ToString(),
                    BookingRefNo = e["BookingRefNo"].ToString(),
                    TaxCode = e["TaxCode"].ToString(),
                    TaxName = e["TaxName"].ToString(),
                    TaxType = e["TaxType"].ToString(),
                    TaxApplicable = e["TaxApplicable"].ToString(),
                    TaxRate = e["TaxRate"].ToString(),
                    TaxAmount = e["TaxAmount"].ToString(),
                    ReferenceNo = e["ReferenceNo"].ToString(),
                    //TotalTaxAmount = e["TotalTaxAmount"].ToString(),
                    MarketRateTax = e["MarketRateTax"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<TaxChargeInformation>>(ds.Tables[1].Rows[0][0].ToString(), TaxChargeInformationList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        #endregion
        #region Due Agent Other Charges Information
        public KeyValuePair<string, List<AgentOtherCharge>> GetOtherchargeInformationRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                var AWBSNo = (whereCondition == "0" || whereCondition == "") ? 0 : Convert.ToInt32(whereCondition);
                whereCondition = "";
                AgentOtherCharge AgentOtherCharge = new AgentOtherCharge();
                SqlParameter[] Parameters = { new SqlParameter("@PomailSno", recordID), new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "USP_GetRecordAgentOtherCharge_POMAIL", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AgentOtherChargeList = ds.Tables[0].AsEnumerable().Select(e => new AgentOtherCharge
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = e["AWBSNo"].ToString(),
                    BookingRefNo = e["BookingRefNo"].ToString(),
                    Type = e["OtherChargeType"].ToString(),
                    OtherChargeCode = e["OtherChargeCode"].ToString(),
                    OtherchargeDetail = e["OtherchargeDetail"].ToString(),
                    ChargeValue = e["ChargeValue"].ToString(),
                    ReferenceNumber = e["ReferenceNumber"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AgentOtherCharge>>(ds.Tables[1].Rows[0][0].ToString(), AgentOtherChargeList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        #endregion

        public string IsItineraryCarrierCodeInterline(string ItineraryCarrierCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ItineraryCarrierCode", ItineraryCarrierCode),
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_IsItineraryCarrierCodeInterline", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GETCitySNofromItinerary(int ItineraryOriginSNo, int ItineraryDestinationSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ItineraryOriginSNo", ItineraryOriginSNo),
                                            new SqlParameter("@ItineraryDestinationSNo",ItineraryDestinationSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GETCitySNofromItinerary", Parameters);
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
