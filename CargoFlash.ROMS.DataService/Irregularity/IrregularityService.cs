using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.ServiceModel.Web;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.IO;
using Image = System.Drawing.Image;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Net;
using CargoFlash.Cargo.Model.Common;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "IrregularityService" in both code and config file together.
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class IrregularityService : IIrregularityService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        /// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Irregularity.Irregularity>(filter);
            int Station = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo;
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Station", Station),new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListIrregularity", Parameters);
            var IrregularityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Irregularity.Irregularity
            {
                SNo = Convert.ToInt32(e["SNo"].ToString()),
                IncidentCategory = e["IncidentCategory"].ToString().ToUpper(),
                ReportingStation = e["ReportingStation"].ToString().ToUpper(),
                AWBNo = e["AWBNo"].ToString().ToUpper(),
                IrregularityStatus = e["IrregularityStatus"].ToString().ToUpper(),
                UpdatedUser = e["UpdatedUser"].ToString().ToUpper(),
                FlightNo = e["FlightNo"].ToString().ToUpper(),
                AssignTo = e["AssignTo"].ToString().ToUpper(),
                CN38No = e["CN38No"].ToString().ToUpper(),
                FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                UpdatedOn = e["UpdatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["UpdatedOn"]), DateTimeKind.Utc),
                ReferenceCode = e["ReferenceCode"].ToString().ToUpper()
                //e["UpdatedOn"].ToString().ToUpper()
                //FlightDate = e["FlightDate"].ToString() != "" ? Convert.ToDateTime(e["FlightDate"]).ToString("dd-MMM-yyyy") : "",
                //Convert.ToDateTime(dr["FlightDate"].ToString()).ToString("MM-dd-yyyy");
                //FlightDate = e["FlightDate"].ToString(),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = IrregularityList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Get Record on the basis of recordID from Irregularity
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public CargoFlash.Cargo.Model.Irregularity.Irregularity GetIrregularityRecord(string recordID, string UserID)
        {
            try
            {
            CargoFlash.Cargo.Model.Irregularity.Irregularity GetIrregularity = new CargoFlash.Cargo.Model.Irregularity.Irregularity();
            SqlDataReader dr = null;
            
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordIrregularity", Parameters);
                if (dr.Read())
                {
                    GetIrregularity.SNo = Convert.ToInt32(dr["SNo"]);
                    GetIrregularity.IncidentCategorySNo = Convert.ToInt32(dr["IncidentCategorySNo"]);
                    GetIrregularity.IncidentCategory = dr["IncidentCategory"].ToString();
                    GetIrregularity.Text_IncidentCategory = dr["IncidentCategory"].ToString();
                    GetIrregularity.IncidentCategoryCode = dr["IncidentCategoryCode"].ToString();
                    GetIrregularity.ReportingStationSNo = Convert.ToInt32(dr["ReportingStationSNo"]);
                    GetIrregularity.ReportingStation = dr["ReportingStation"].ToString();
                    GetIrregularity.Text_ReportingStation = dr["ReportingStation"].ToString();
                    GetIrregularity.AWBSNo = Convert.ToInt32(dr["AWBSNo"].ToString());
                    GetIrregularity.AWBNo = dr["AWBNo"].ToString().ToUpper();
                    GetIrregularity.Text_AWBNo = dr["AWBNo"].ToString().ToUpper().Trim();
                    if (!String.IsNullOrEmpty(dr["IsLabelled"].ToString()))
                    {
                        GetIrregularity.LabelType = dr["LabelType"].ToString();
                        GetIrregularity.IsAWBLabel = Convert.ToBoolean(dr["IsLabelled"].ToString());
                    }
                    GetIrregularity.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    GetIrregularity.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    GetIrregularity.Type = Convert.ToInt32(dr["Type"]);
                    GetIrregularity.FlightNo = dr["FlightNo"].ToString();
                    GetIrregularity.FlightDate = Convert.ToDateTime(dr["FlightDate"].ToString() == "" ? "1777-07-07" : Convert.ToDateTime(dr["FlightDate"].ToString()).ToString(DateFormat.DateFormatString));
                    //dr["FlightDate"].ToString() == "01-Jan-00 12:00:00 AM" ? "" : dr["FlightDate"].ToString();
                    GetIrregularity.OriginAirportCode = dr["OriginAirportCode"].ToString();
                    GetIrregularity.DestinationAirportCode = dr["DestinationAirportCode"].ToString();
                    GetIrregularity.Commodities = dr["NatureOfGoods"].ToString();
                    GetIrregularity.SHC = dr["SHC"].ToString();
                    GetIrregularity.Agent = dr["Agent"].ToString();
                    GetIrregularity.Shipper = dr["Shipper"].ToString();
                    GetIrregularity.Consignee = dr["Consignee"].ToString();
                    GetIrregularity.FreightType = dr["FreightType"].ToString();
                    GetIrregularity.TotalPieces = dr["TotalPieces"].ToString();
                    GetIrregularity.TotalGrossWeight = dr["TotalGrossWeight"].ToString();
                    GetIrregularity.RemainingPcs = dr["RemainingPcs"].ToString();
                    GetIrregularity.tabCount = dr["tabCount"].ToString() + '-' + Convert.ToInt32(dr["AWBSNo"].ToString());
                    GetIrregularity.DailyFltSNo = dr["DailyFlightSNo"].ToString();
                    GetIrregularity.ReferenceCode = dr["ReferenceCode"].ToString();
                }
                dr.Close();
                return GetIrregularity;
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }
            
        }

        /// <summary>
        /// Below Method used to fetch record for edit and view for Irregularitytrans
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="whereCondition"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public KeyValuePair<string, List<IrregularityTrans>> GetIrregularityTransRecord(string recordID, int page, int pageSize, IrregularityCreate model, string sort)
        {
            try
            { 
            IrregularityTrans irregularityTrans = new IrregularityTrans();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@IrregularitySNo", recordID),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIrregularityTransRecord", Parameters);

            if (ds.Tables[0].Rows.Count != 0)
            {
                //string[] Parameter = whereCondition.Split('-');
                //string IncidentCategory = Parameter[0];
                //string IsAWBLabel = Parameter[1] == "undefined" ? "" : Parameter[1];
                if (string.IsNullOrEmpty(model.IsAWBLabel))
                {
                    model.IsAWBLabel = "";
                }
                var IrregularityTransList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    IrregularityTransSNo = Convert.ToInt32(e["IrregularityTransSNo"].ToString()),
                    IrregularitySNo = Convert.ToInt32(e["IrregularitySNo"].ToString()),
                    HAWBNo = e["HAWBNoText"].ToString(),
                    HdnHAWBNo = e["HAWBNo"].ToString() == "" ? "" : e["HAWBNo"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"].ToString()),
                    Weight = Convert.ToDecimal(e["Weight"].ToString()),
                    Dimensions = e["Dimensions"].ToString(),
                    HdnPacking = e["PackingSNo"].ToString(),
                    Packing = e["PackingName"].ToString(),
                    HdnPilferageDiscovered = e["EventSNo"].ToString(),
                    PilferageDiscovered = e["EventName"].ToString(),
                    HdnDamageDiscovered = e["EventSNo"].ToString(),
                    DamageDiscovered = e["EventName"].ToString(),
                    HdnDamageType = e["DamageSNo"].ToString(),
                    DamageType = e["DamageName"].ToString(),
                    IsInspected = e["IsInspected"].ToString(),
                    HdnContentType = e["ContentType"].ToString(),
                    ContentType = e["DamageContent"].ToString().ToUpper(),
                    Reason = Convert.ToInt32(e["Reason"].ToString()),
                    IdentificationRemarks = e["Description"].ToString(),
                    Value = e["EstimatedValue"].ToString(),
                    IrregularityStatusSNo = e["Status"].ToString(),
                    IsReport = e["IsReport"].ToString() == "True" ? "1" : "0",
                    ReportDate = e["ReportDate"].ToString(),
                    Place = e["ReportPlace"].ToString(),
                    HdnPlace = e["HdnPlace"].ToString(),
                    Remarks = e["ReportRemarks"].ToString(),
                    PoliceReportFilePath = e["PoliceReportFilePath"].ToString(),
                    ClosingRemarks = e["ClosingRemarks"].ToString(),
                    ClosingFlightNo = e["ClosingFlightNo"].ToString(),
                    ClosingFlightDate = e["ClosingFlightDate"].ToString(),
                    OnHold = e["OnHold"].ToString(),
                    OnHoldSince = e["OnHoldSince"].ToString(),
                    UnHoldAt = e["UnHoldAt"].ToString(),
                    IsMisrouted = e["IsMisrouted"].ToString(),
                    NonDeliveryReasonSNo = e["NonDeliveryReasonSNo"].ToString(),
                    AlternateDeliveryAddress = e["AlternateDeliveryAddress"].ToString(),
                    DisposalAdviceSNo = e["DisposalAdviceSNo"].ToString(),
                    DateOfShipmentDestruction = e["DateOfShipmentDestruction"].ToString(),
                    CostOfShipmentDestruction = e["CostOfShipmentDestruction"].ToString(),
                    DateOfShipmentAuction = e["AmountRecoveredFromAuction"].ToString(),
                    AmountRecoveredFromAuction = e["AmountRecoveredFromAuction"].ToString(),
                    Action = "Action",
                    HdnStatus = e["IrregularityStatusSNo"].ToString() == "" ? "" : e["IrregularityStatusSNo"].ToString(),
                    Status = e["IrregularityStatus"].ToString() == "" ? "" : e["IrregularityStatus"].ToString(),
                    IncidentCategory = model.IncidentCategory,
                    IsAWBLabel = model.IsAWBLabel,
                    Attachment = e["Attachment"].ToString(),
                    HdnPieces = e["Pieces"].ToString(),
                    HAWBPcs = e["HAWBPcs"].ToString(),
                    HdnRecuperation = e["RecuperationSNo"].ToString(),
                    Recuperation = e["RecuperationType"].ToString(),
                });
                return new KeyValuePair<string, List<IrregularityTrans>>(ds.Tables[0].Rows[0][0].ToString(), IrregularityTransList.AsQueryable().ToList());
            }
            var abc = ds.Tables[0].AsEnumerable().Select(e => new IrregularityTrans
            {
                SNo = Convert.ToInt32(e["SNo"])
            });
            return new KeyValuePair<string, List<IrregularityTrans>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Get Record on the basis of AWBNo from AWB
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public string GetAWBDetail(string AWBNo, int Type, string IrregularityType, int DailyFlightSNo)
        {
            try
            {
            SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@Type", Type), new SqlParameter("@IrregularityType", IrregularityType), new SqlParameter("@DailyFlightSNo", DailyFlightSNo),new SqlParameter("@DestinationAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBDetail", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string GetFlightDetailSSPD(string AWBSNo)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlightDetailSSPD", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        /// <summary>
        /// Get Record on the basis of AWBNo from AWB
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public string GetAWBRoute(string IrregularitySNo)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", IrregularitySNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRouteDetail", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Get Record on the basis of AWBNo from AWB
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public string GetTracingDetail(string IrregularitySNo, string usersno)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", IrregularitySNo), new SqlParameter("@usersno", usersno) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTracingDetail", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private static string DStoJSON(DataSet ds)
        {
            try
            { 
            StringBuilder json = new StringBuilder();
            json.Append("[");
            int lInteger = 0;
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                lInteger = lInteger + 1;
                json.Append("{");
                int i = 0;
                int colcount = dr.Table.Columns.Count;
                foreach (DataColumn dc in dr.Table.Columns)
                {
                    json.Append("\"");
                    json.Append(dc.ColumnName);
                    json.Append("\":\"");
                    json.Append(dr[dc]);
                    json.Append("\"");
                    i++;
                    if (i < colcount) json.Append(",");
                }

                if (lInteger < ds.Tables[0].Rows.Count)
                {
                    json.Append("},");
                }
                else
                {
                    json.Append("}");
                }
            }

            json.Append("]");

            return json.ToString();
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        ///// </summary>
        ///// <param name="Irregularity"></param>
        ///// <returns></returns>
        public List<string> SaveIrregularity(string ReportingStation, string IncidentCategory, string IsAWBLabel, string AWBNo, string POMailSNo, string strData, string Type, string strData1, string AirportSNo, string DailyFlightSNo, string IncidentSubCategorySNo)
        {
            try
            { 
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrregularity = new DataTable();
            List<IrregularityTransDimension> lstChildData = new List<IrregularityTransDimension>();
            DataTable dtDimensionTrans = CollectionHelper.ConvertTo(lstChildData, "IrregularityTransSNo,IrregularitySNo");
            DataTable dtDimensions = new DataTable();
            List<IrregularityIncidentCategoryDimension> lstDimensions = new List<IrregularityIncidentCategoryDimension>();
                if (strData == "")
                {
                    lstDimensions = (List<IrregularityIncidentCategoryDimension>)Newtonsoft.Json.JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(strData1), typeof(List<IrregularityIncidentCategoryDimension>));
                    dtDimensions = CollectionHelper.ConvertTo(lstDimensions, "");
                    GetDimensionTransData(dtDimensionTrans, dtDimensions);
                }
                else
                {
                    DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(strData), (typeof(DataTable)));
                    dtCreateIrregularity.Columns.Add("SNo");
                    dtCreateIrregularity.Columns.Add("HAWBNo");
                    dtCreateIrregularity.Columns.Add("Pieces");
                    dtCreateIrregularity.Columns.Add("Weight");
                    //dtCreateIrregularity.Columns.Add("Dimensions");
                    dtCreateIrregularity.Columns.Add("EventSNo");
                    dtCreateIrregularity.Columns.Add("PackingSNo");
                    dtCreateIrregularity.Columns.Add("DamageSNo");
                    dtCreateIrregularity.Columns.Add("IsInspected");
                    dtCreateIrregularity.Columns.Add("ContentType");
                    dtCreateIrregularity.Columns.Add("Reason");
                    dtCreateIrregularity.Columns.Add("IdentificationRemarks");
                    dtCreateIrregularity.Columns.Add("EstimatedValue");
                    dtCreateIrregularity.Columns.Add("IrregularityStatusSNo");
                    dtCreateIrregularity.Columns.Add("PoliceReportFiled");
                    dtCreateIrregularity.Columns.Add("PoliceReportFilingDate");
                    dtCreateIrregularity.Columns.Add("PoliceReportFilingPlace");
                    dtCreateIrregularity.Columns.Add("PoliceReportFilingRemarks");
                    dtCreateIrregularity.Columns.Add("PoliceReportFilePath");
                    dtCreateIrregularity.Columns.Add("ClosingRemarks");
                    dtCreateIrregularity.Columns.Add("ClosingFlightNo");
                    dtCreateIrregularity.Columns.Add("ClosingFlightDate");
                    dtCreateIrregularity.Columns.Add("OnHold");
                    dtCreateIrregularity.Columns.Add("OnHoldSince");
                    dtCreateIrregularity.Columns.Add("UnHoldAt");
                    dtCreateIrregularity.Columns.Add("IsMisrouted");
                    dtCreateIrregularity.Columns.Add("NonDeliveryReasonSNo");
                    dtCreateIrregularity.Columns.Add("AlternateDeliveryAddress");
                    dtCreateIrregularity.Columns.Add("DisposalAdviceSNo");
                    dtCreateIrregularity.Columns.Add("DateOfShipmentDestruction");
                    dtCreateIrregularity.Columns.Add("CostOfShipmentDestruction");
                    dtCreateIrregularity.Columns.Add("DateOfShipmentAuction");
                    dtCreateIrregularity.Columns.Add("AmountRecoveredFromAuction");
                    dtCreateIrregularity.Columns.Add("RecuperationSNo");
                    foreach (DataRow dr in dt.Rows)
                    {
                        DataRow drRow = dtCreateIrregularity.NewRow();
                        drRow["SNo"] = DBNull.Value;
                        drRow["HAWBNo"] = IsAWBLabel == "true" ? ((IncidentCategory == "MSAV" || IncidentCategory == "FDAV") ? DBNull.Value : dr["HdnHAWBNo"]) : DBNull.Value;
                        drRow["Pieces"] = (IncidentCategory == "MSAV" || IncidentCategory == "FDAV") ? DBNull.Value : dr["Pieces"];
                        drRow["Weight"] = dr["Weight"] == "" ? 0 : dr["Weight"];
                        //(IncidentCategory == "PLCA" || IncidentCategory == "DMCA" || IncidentCategory == "MSAV" || IncidentCategory == "FDAV") ? DBNull.Value : dr["Weight"] == "" ? 0 : dr["Weight"];
                        //drRow["Dimensions"] = (IncidentCategory == "MSCA" || IncidentCategory == "PLCA") ? dr["Dimensions"] : DBNull.Value;
                        drRow["EventSNo"] = IncidentCategory == "PLCA" ? dr["HdnPilferageDiscovered"] : IncidentCategory == "DMCA" ? dr["HdnDamageDiscovered"] : DBNull.Value;
                        drRow["PackingSNo"] = (IncidentCategory == "MSCA" || IncidentCategory == "PLCA" || (IncidentCategory == "FDCA" && IsAWBLabel == "false") || (IncidentCategory == "OVCD" && IsAWBLabel == "false") || IncidentCategory == "DMCA") ? dr["HdnPacking"] : DBNull.Value;
                        drRow["DamageSNo"] = IncidentCategory == "DMCA" ? dr["HdnDamageType"] : DBNull.Value;//Damge
                        drRow["IsInspected"] = IncidentCategory == "DMCA" ? dr["IsInspected"] : DBNull.Value;//Damge
                        drRow["ContentType"] = IncidentCategory == "DMCA" ? dr["HdnContentType"] : DBNull.Value;//Damge
                        drRow["Reason"] = IncidentCategory == "UDLD" ? dr["Reason"] : DBNull.Value;
                        drRow["IdentificationRemarks"] = dr["IdentificationRemarks"] == "" ? DBNull.Value : dr["IdentificationRemarks"];
                        //(IncidentCategory == "MSCA" || IncidentCategory == "PLCA" || (IncidentCategory == "FDCA" && IsAWBLabel == "false") || (IncidentCategory == "OVCD" || IsAWBLabel == "false") || IncidentCategory == "DMCA" || IncidentCategory=="SSPD") ?
                        drRow["EstimatedValue"] = (IncidentCategory == "PLCA" || IncidentCategory == "DMCA") ? dr["Value"] : DBNull.Value;
                        drRow["IrregularityStatusSNo"] = DBNull.Value;
                        drRow["PoliceReportFiled"] = IncidentCategory == "PLCA" ? dr["HdnPilferageDiscovered"] : DBNull.Value;
                        drRow["PoliceReportFilingDate"] = IncidentCategory == "PLCA" ? dr["ReportDate"] : DBNull.Value;
                        drRow["PoliceReportFilingPlace"] = IncidentCategory == "PLCA" ? dr["HdnPlace"] : DBNull.Value;
                        drRow["PoliceReportFilingRemarks"] = IncidentCategory == "PLCA" ? dr["Remarks"] : DBNull.Value;
                        drRow["PoliceReportFilePath"] = DBNull.Value;
                        drRow["ClosingRemarks"] = DBNull.Value;
                        drRow["ClosingFlightNo"] = DBNull.Value;
                        drRow["ClosingFlightDate"] = DBNull.Value;
                        drRow["OnHold"] = DBNull.Value;
                        drRow["OnHoldSince"] = DBNull.Value;
                        drRow["UnHoldAt"] = DBNull.Value;
                        drRow["IsMisrouted"] = DBNull.Value;
                        drRow["NonDeliveryReasonSNo"] = DBNull.Value;
                        drRow["AlternateDeliveryAddress"] = DBNull.Value;
                        drRow["DisposalAdviceSNo"] = DBNull.Value;
                        drRow["DateOfShipmentDestruction"] = DBNull.Value;
                        drRow["CostOfShipmentDestruction"] = DBNull.Value;
                        drRow["DateOfShipmentAuction"] = DBNull.Value;
                        drRow["AmountRecoveredFromAuction"] = DBNull.Value;
                        drRow["RecuperationSNo"] = (IncidentCategory == "PLCA" || IncidentCategory == "DMCA") ? dr["HdnRecuperation"] : DBNull.Value;
                        dtCreateIrregularity.Rows.Add(drRow);
                    }
                }
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@ReportingStation",Convert.ToInt32(ReportingStation)),
                                            new SqlParameter("@IncidentCategory",IncidentCategory),
                                            new SqlParameter("@IncidentSubCategorySNo",IncidentSubCategorySNo),
                                            new SqlParameter("@LabelType",Convert.ToBoolean(IsAWBLabel)),
                                            new SqlParameter("@AWBNo",(AWBNo==""?"-1":AWBNo)),
                                            new SqlParameter("@POMailSNo",(POMailSNo==""?"-1":POMailSNo)),
                                            new SqlParameter("@IrregularityTransTable",(strData==""?dtDimensions:dtCreateIrregularity )),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@Type",Type),
                                            new SqlParameter("@IrregularityDimensionTransTable",dtDimensionTrans),
                                            new SqlParameter("@AirportSNo",Convert.ToInt32(AirportSNo)),
                                            new SqlParameter("@DailyFlightSNo",DailyFlightSNo==""?Convert.ToInt32("0"):Convert.ToInt32(DailyFlightSNo)),
                                            new SqlParameter("@ActionFrom",1)
                                        };
                string res = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateIrregularity", param);
                //string res = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckListTypeCreate", Parameters);   
                //var CLTSNo = res.Split('-')[1];

                //int ret = Convert.ToInt32(res);
                //int ret = Convert.ToInt32(res.Split('-')[1]);
                int ret = res.Split('-').Length > 1 ? Convert.ToInt32(res.Split('-')[1]) : 0;
                //(int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateSlotBooking", Parameters);
                ErrorMessage.Add(res.Split('-')[1]);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Irregularity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)
            {
                throw ex;
            }
            
        }

        private void GetDimensionTransData(DataTable dtDimensionTrans, DataTable dtDimensions)
        {
            try
            { 
            for (int j = 0; j < dtDimensions.Rows.Count; j++)
            {
                if (dtDimensions.Rows[j]["hdnChildData"].ToString() != "0")
                {
                    DataTable Temp = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(dtDimensions.Rows[j]["hdnChildData"].ToString()), (typeof(DataTable)));
                    foreach (DataRow dtRow in Temp.Rows)
                    {
                        DataRow dr = dtDimensionTrans.NewRow();
                        dr["SNo"] = dtDimensions.Rows[j]["SNo"];
                        dr["Length"] = dtRow["Length"].ToString();
                        dr["Width"] = dtRow["Width"].ToString();
                        dr["Height"] = dtRow["Height"].ToString();
                        dr["MeasurementUnit"] = dtRow["MeasurementUnit"].ToString();
                        //dr["IrregularityTransSNo"] = 0;
                        //dr["IrregularitySNo"] = 0;
                        dtDimensionTrans.Rows.Add(dr);
                    }
                }

            }
            dtDimensions.Columns.Remove("hdnChildData");
            //for (int i = 0; i < dtAWBULDTrans.Rows.Count; i++)
            //{
            //    dtAWBULDTrans.Rows[i]["ChargeLineCount"] = i + 1;
            //}
            dtDimensionTrans.AcceptChanges();
            dtDimensions.AcceptChanges();
            //dtAWBULDTrans.AcceptChanges();
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        /// <summary>
        /// Below Mtheod used in Create  and update officeTargetcomm trans
        /// </summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public List<Tuple<string, int>> UpdateIrregularityTrans(string strData)
        {
            try
            { 
            int ret = 0;
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            DataTable dtUploader = new DataTable();
            string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
            string path = BaseDirectory + "UploadImage\\";
            BaseBusiness baseBussiness = new BaseBusiness();
            // convert JSON string into datatable
            DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(strData), (typeof(DataTable)));
            // for update existing record
            string IncidentCategory = dt.Rows[0]["IncidentCategory"].ToString();
            string IsAWBLabel = dt.Rows[0]["IsAWBLabel"].ToString();
            if (dt.Rows.Count > 0)
            {
                DataTable dtCreateIrregularity = new DataTable();
                dtCreateIrregularity.Columns.Add("SNo");
                dtCreateIrregularity.Columns.Add("HAWBNo");
                dtCreateIrregularity.Columns.Add("Pieces");
                dtCreateIrregularity.Columns.Add("Weight");
                //dtCreateIrregularity.Columns.Add("Dimensions");
                dtCreateIrregularity.Columns.Add("EventSNo");
                dtCreateIrregularity.Columns.Add("PackingSNo");
                dtCreateIrregularity.Columns.Add("DamageSNo");
                dtCreateIrregularity.Columns.Add("IsInspected");
                dtCreateIrregularity.Columns.Add("ContentType");
                dtCreateIrregularity.Columns.Add("Reason");
                dtCreateIrregularity.Columns.Add("IdentificationRemarks");
                dtCreateIrregularity.Columns.Add("EstimatedValue");
                dtCreateIrregularity.Columns.Add("IrregularityStatusSNo");
                dtCreateIrregularity.Columns.Add("PoliceReportFiled");
                dtCreateIrregularity.Columns.Add("PoliceReportFilingDate");
                dtCreateIrregularity.Columns.Add("PoliceReportFilingPlace");
                dtCreateIrregularity.Columns.Add("PoliceReportFilingRemarks");
                dtCreateIrregularity.Columns.Add("PoliceReportFilePath");
                dtCreateIrregularity.Columns.Add("ClosingRemarks");
                dtCreateIrregularity.Columns.Add("ClosingFlightNo");
                dtCreateIrregularity.Columns.Add("ClosingFlightDate");
                dtCreateIrregularity.Columns.Add("OnHold");
                dtCreateIrregularity.Columns.Add("OnHoldSince");
                dtCreateIrregularity.Columns.Add("UnHoldAt");
                dtCreateIrregularity.Columns.Add("IsMisrouted");
                dtCreateIrregularity.Columns.Add("NonDeliveryReasonSNo");
                dtCreateIrregularity.Columns.Add("AlternateDeliveryAddress");
                dtCreateIrregularity.Columns.Add("DisposalAdviceSNo");
                dtCreateIrregularity.Columns.Add("DateOfShipmentDestruction");
                dtCreateIrregularity.Columns.Add("CostOfShipmentDestruction");
                dtCreateIrregularity.Columns.Add("DateOfShipmentAuction");
                dtCreateIrregularity.Columns.Add("AmountRecoveredFromAuction");
                dtCreateIrregularity.Columns.Add("RecuperationSNo");
                foreach (DataRow dr in dt.Rows)
                {
                    DataRow drRow = dtCreateIrregularity.NewRow();
                    drRow["SNo"] = drRow["SNo"].ToString() == "" ? 0 : drRow["SNo"];
                    drRow["HAWBNo"] = (IncidentCategory == "MISSING MAIL DOCUMENT" || IncidentCategory == "FOUND MAIL DOCUMENT") ? 0 : dr["HdnHAWBNo"];
                    drRow["Pieces"] = (IncidentCategory == "MISSING MAIL DOCUMENT" || IncidentCategory == "FOUND MAIL DOCUMENT") ? 0 : (dr["Pieces"].ToString() == "" ? 0 : dr["Pieces"]);
                    drRow["Weight"] = (IncidentCategory == "PILFERED CARGO" || IncidentCategory == "MISSING MAIL DOCUMENT" || IncidentCategory == "FOUND MAIL DOCUMENT") ? 0 : dr["Weight"].ToString() == "" ? 0 : dr["Weight"];
                    //drRow["Dimensions"] = (IncidentCategory == "MISSING CARGO" || IncidentCategory == "PILFERED CARGO") ? dr["Dimensions"] : DBNull.Value;
                    drRow["EventSNo"] = IncidentCategory == "PILFERED CARGO" ? dr["HdnPilferageDiscovered"] : IncidentCategory == "DAMAGED CARGO" ? (dr["HdnDamageDiscovered"].ToString() == "" ? 0 : dr["HdnDamageDiscovered"]) : 0;
                    drRow["PackingSNo"] = (IncidentCategory == "MISSING CARGO" || IncidentCategory == "PILFERED CARGO" || (IncidentCategory == "FOUND CARGO" && IsAWBLabel == "false") || (IncidentCategory == "OVER CARRIED CARGO" && IsAWBLabel == "false") || IncidentCategory == "DAMAGED CARGO") ? (dr["HdnPacking"] == "" ? 0 : dr["HdnPacking"]) : 0;
                    drRow["DamageSNo"] = IncidentCategory == "DAMAGED CARGO" ? (dr["HdnDamageType"].ToString() == "" ? 0 : dr["HdnDamageType"]) : 0;//Damge
                    drRow["IsInspected"] = IncidentCategory == "DAMAGED CARGO" ? dr["IsInspected"] : DBNull.Value;//Damge
                    drRow["ContentType"] = IncidentCategory == "DAMAGED CARGO" ? (dr["IsInspected"].ToString() == "0" ? 0 : dr["HdnContentType"]) : DBNull.Value;//Damge
                    drRow["Reason"] = IncidentCategory == "UNDELIVERED CARGO" ? dr["Reason"] : DBNull.Value;
                    drRow["IdentificationRemarks"] = dr["IdentificationRemarks"].ToString() == "" ? DBNull.Value : dr["IdentificationRemarks"];
                    //(IncidentCategory == "MISSING CARGO" || IncidentCategory == "PILFERED CARGO" || (IncidentCategory == "FOUND CARGO" && IsAWBLabel == "false") || (IncidentCategory == "OVER CARRIED CARGO" || IsAWBLabel == "false") || IncidentCategory == "DAMAGED CARGO" || IncidentCategory == "SHORT SHIPPED CARGO") ?
                    drRow["EstimatedValue"] = (IncidentCategory == "PILFERED CARGO" || IncidentCategory == "DAMAGED CARGO") ? (dr["Value"].ToString() == "" ? 0 : dr["Value"]) : 0;
                    drRow["IrregularityStatusSNo"] = 0;
                    drRow["PoliceReportFiled"] = IncidentCategory == "PILFERED CARGO" ? (dr["IsReport"] == "" ? 0 : dr["IsReport"]) : DBNull.Value;
                    drRow["PoliceReportFilingDate"] = IncidentCategory == "PILFERED CARGO" ? dr["ReportDate"] : DBNull.Value;
                    drRow["PoliceReportFilingPlace"] = IncidentCategory == "PILFERED CARGO" ? (dr["HdnPlace"] == "" ? 0 : dr["HdnPlace"]) : DBNull.Value;
                    drRow["PoliceReportFilingRemarks"] = IncidentCategory == "PILFERED CARGO" ? dr["Remarks"] : DBNull.Value;
                    drRow["PoliceReportFilePath"] = DBNull.Value;
                    drRow["ClosingRemarks"] = DBNull.Value;
                    drRow["ClosingFlightNo"] = DBNull.Value;
                    drRow["ClosingFlightDate"] = DBNull.Value;
                    drRow["OnHold"] = DBNull.Value;
                    drRow["OnHoldSince"] = DBNull.Value;
                    drRow["UnHoldAt"] = DBNull.Value;
                    drRow["IsMisrouted"] = DBNull.Value;
                    drRow["NonDeliveryReasonSNo"] = 0;
                    drRow["AlternateDeliveryAddress"] = DBNull.Value;
                    drRow["DisposalAdviceSNo"] = 0;
                    drRow["DateOfShipmentDestruction"] = DBNull.Value;
                    drRow["CostOfShipmentDestruction"] = 0;
                    drRow["DateOfShipmentAuction"] = DBNull.Value;
                    drRow["AmountRecoveredFromAuction"] = DBNull.Value;
                    drRow["RecuperationSNo"] = (IncidentCategory == "PILFERED CARGO" || IncidentCategory == "DAMAGED CARGO") ? dr["HdnRecuperation"] : DBNull.Value;
                    dtCreateIrregularity.Rows.Add(drRow);
                }
                int IrregularityTransSNo = Convert.ToInt32(dt.Rows[0]["IrregularityTransSNo"].ToString());
                int IrregularitySNo = Convert.ToInt32(dt.Rows[0]["IrregularitySNo"].ToString());
                int Status = Convert.ToInt32(dt.Rows[0]["HdnStatus"].ToString());
                string UserSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();

                dtUploader.Columns.Add("IrregularitySNo");
                dtUploader.Columns.Add("IrregularityTransSNo");
                dtUploader.Columns.Add("UploadDocument", typeof(byte[]));
                dtUploader.Columns.Add("ImageName");
                dtUploader.Columns.Add("ImageAttachement");
                DataRow row;


                string[] filePaths = Directory.GetFiles(path, "*.*");
                string a = IrregularitySNo + "_" + IrregularityTransSNo;
                if (filePaths.Length > 0)
                {
                    for (int i = 0; i < filePaths.Length; i++)
                    {
                        string[] filename = Path.GetFileName(filePaths[i]).Split('_');
                        //int length = filename[0].Length;
                        //string FinalFileName1 = filename[0].Substring(filename[0].Length - 1);
                        if (filename.Length > 3)
                        {
                            string FinalFileName = filename[1] + "_" + filename[2];
                            if (FinalFileName == a)
                            {
                                var serverPath = filePaths[i];
                                row = dtUploader.NewRow();
                                row["IrregularitySNo"] = Convert.ToInt32(IrregularitySNo);
                                row["IrregularityTransSNo"] = Convert.ToInt32(IrregularityTransSNo);
                                row["UploadDocument"] = ReadImageFile(serverPath);
                                row["ImageName"] = Convert.ToString(filename[8]);
                                row["ImageAttachement"] = Convert.ToString(Path.GetFileName(filePaths[i]));
                                dtUploader.Rows.Add(row);
                            }
                        }


                    }
                }
                SqlParameter[] param = { 
                                            new SqlParameter("@IrregularityTransSNo",IrregularityTransSNo),
                                            new SqlParameter("@Status",Status),
                                            new SqlParameter("@UpdatedBy",Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())),
                                            new SqlParameter("@IrregularityTable",dtCreateIrregularity),
                                            new SqlParameter("@UploaderTable",dtUploader)
                                        };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateIrregularityTrans", param);


            }
            if (ret >= 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Irregularity");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (dataBaseExceptionMessage == "Related Information Not Found.")
                    {
                        dataBaseExceptionMessage = "Status Updated Successfully";
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 1));
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 1));
                    }
                }
            }
            for (int i = 0; i < dtUploader.Rows.Count; i++)
            {
                string FileName = dtUploader.Rows[i]["ImageAttachement"].ToString();
                System.IO.File.Delete(Path.GetFullPath(path + FileName));
            }
            return ErrorMessage;
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        ///// </summary>
        ///// <param name="SendMessage"></param>
        ///// <returns></returns>
        public List<string> SendMessage(string IrregularitySNo, string Message, string Email, string AssignTo)
        {
            try
            {
            List<string> ErrorMessage = new List<string>();
            
                //DataTable dtSitaAddress = (DataTable)JsonConvert.DeserializeObject(SitaAddress, (typeof(DataTable)));
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        {
                                            new SqlParameter("@IrregularitySNo",Convert.ToInt32(IrregularitySNo)),
                                            new SqlParameter("@Message",Message),
                                            new SqlParameter("@Email",Email),
                                            new SqlParameter("@AssignTo",AssignTo),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SendMessage", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Irregularity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)
            {
                throw ex;
            }
            
        }

        ///// </summary>
        ///// <param name="UpdateStatus"></param>
        ///// <returns></returns>

        public List<string> SendMailNND(string IrregularitySNo, string TabCount, string TableID, string Email, Decimal DeliveryOrderFee, Decimal HandlingCharges, Decimal StorageCharges)
        {
            try
            {
              
            List<string> ErrorMessage = new List<string>();
             //DataTable dtSitaAddress = (DataTable)JsonConvert.DeserializeObject(SitaAddress, (typeof(DataTable)));
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        {
                                            new SqlParameter("@IrregularitySNo",Convert.ToInt32(IrregularitySNo)),
                                            new SqlParameter("@TabCount",Convert.ToInt32(TabCount)),
                                            new SqlParameter("@TableID",TableID),
                                            new SqlParameter("@Email",Email),
                                            new SqlParameter("@DeliveryOrderFee",DeliveryOrderFee),
                                            new SqlParameter("@HandlingCharges",HandlingCharges),
                                            new SqlParameter("@StorageCharges",StorageCharges),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SendMailNND", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Irregularity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }
            
        }

        public List<string> UpdateStatus(string IrregularitySNo, string Status, string Remarks)
        {
            try
            {
            List<string> ErrorMessage = new List<string>();
            
                //DataTable dtSitaAddress = (DataTable)JsonConvert.DeserializeObject(SitaAddress, (typeof(DataTable)));
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        {
                                            new SqlParameter("@IrregularitySNo",Convert.ToInt32(IrregularitySNo)),
                                            new SqlParameter("@Status",Status),
                                            new SqlParameter("@Remarks",Remarks),
                                            new SqlParameter("@CityCode",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateStatus", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Irregularity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)
            {
                throw ex;
            }
            
        }


        public string GetHistory(int IrregularitySNo, string IrregularityType)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", IrregularitySNo), new SqlParameter("@IrregularityType", IrregularityType) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHistory", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public static byte[] ReadImageFile(string imageLocation)
        {
            try
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
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string GetImageFromDB(int IrregularitySNo, int IrregularityTransSNo)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", IrregularitySNo), new SqlParameter("@IrregularityTransSNo", IrregularityTransSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetImageFromDB", Parameters);
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataTable dt = ds.Tables[0];

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    //System.Web.HttpFileCollection uploadedFile = System.Web.HttpContext.Current.Request.Files;
                    byte[] bytes = (byte[])dt.Rows[i]["UploadDocument"];
                    string ImageAttachement = dt.Rows[i]["ImageAttachement"].ToString();
                    Image img = ByteArrayToImage(bytes);
                    string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                    string path = BaseDirectory + "UploadImage\\";
                    //img.SaveAs(Path.Combine(path, ImageAttachement));
                    img.Save(Path.Combine(path, ImageAttachement));
                    //ByteArrayToImage((byte[])dt.Rows[i]["UploadDocument"]).Save(Path.Combine(path, ImageAttachement));
                }


                //foreach (DataRow dr in dt.Rows)
                //{
                //    foreach (DataColumn dc in dt.Columns)
                //    {
                //        string ImageName = "";
                //        string ImageAttachement = "";
                //        if (dc.ToString() == "ImageAttachement")
                //        {
                //             ImageAttachement = dr[dc].ToString();

                //        }
                //        if (dc.ToString() == "ImageName")
                //        {
                //             ImageName = dr[dc].ToString();

                //        }
                //        if (dc.ToString() == "UploadDocument")
                //        {
                //            byte[] bytes = (byte[])dr[dc];
                //            Image img = ByteArrayToImage(bytes);
                //        }
                //        string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                //        string path = BaseDirectory + "UploadImage\\";
                //        //ImageName.SaveAs(Path.Combine(path, ImageAttachement));
                //    }
                //}
            }
            ds.Dispose();
            //    DataTable dt_table = new DataTable();
            //    dt_table.Columns.Add("ImageAttachement");
            //    DataRow row;
            //    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            //    {
            //        row = dt_table.NewRow();
            //        row["ImageAttachement"] = ds.Tables[0].Rows[i]["ImageAttachement"];
            //        dt_table.Rows.Add(row);
            //}
            return DStoJSON(ds);
            //return dt_table;
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public Image ByteArrayToImage(byte[] byteArrayIn)
        {
            try
            { 
            MemoryStream ms = new MemoryStream(byteArrayIn);
            ms.Position = 0;
            Image returnImage = Image.FromStream(ms);
            return returnImage;
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<IrregularityTransDimension>> GetIrregularityTransDimensionRecord(string recordID, int page, int pageSize, IrregularityRequest model, string sort)
        {
            try
            { 
            IrregularityTrans irregularityTrans = new IrregularityTrans();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@IrregularitySNo", model.UploadSNo),
                                           new SqlParameter("@IrregularityTransSNo", model.transSno),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIrregularityTransDimensionRecord", Parameters);

            if (ds.Tables[0].Rows.Count != 0)
            {
                //string[] Parameter = whereCondition.Split('-');
                //string IncidentCategory = Parameter[0];
                //string IsAWBLabel = Parameter[1] == "undefined" ? "" : Parameter[1];
                var IrregularityTransList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityTransDimension
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    IrregularityTransSNo = Convert.ToInt32(e["IrregularityTransSNo"].ToString()),
                    IrregularitySNo = Convert.ToInt32(e["IrregularitySNo"].ToString()),
                    Length = Convert.ToDecimal(e["Length"].ToString()),
                    Width = Convert.ToDecimal(e["Width"].ToString()),
                    Height = Convert.ToDecimal(e["Height"].ToString()),
                    MeasurementUnit = e["MeasurementUnit"].ToString(),
                });
                return new KeyValuePair<string, List<IrregularityTransDimension>>(ds.Tables[0].Rows[0][0].ToString(), IrregularityTransList.AsQueryable().ToList());
            }
            var abc = ds.Tables[0].AsEnumerable().Select(e => new IrregularityTransDimension
            {
                SNo = Convert.ToInt32(e["SNo"])
            });
            return new KeyValuePair<string, List<IrregularityTransDimension>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
                }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// added by tarun k singh
        /// 13/01/18
        /// update irr response record
        /// </summary>
        /// <param name="strData"></param>
        /// <returns></returns>
        public List<Tuple<string, int>> UpdateIrregularityResponseRecord(string strData)
        {
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                int ret = 0;
               DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(strData), (typeof(DataTable)));
                if (dt.Rows.Count > 0)
                {
                   
                    DataTable dtCreateIrregularityResponse = new DataTable();
                     dtCreateIrregularityResponse.Columns.Add("imgurl");
                     dtCreateIrregularityResponse.Columns.Add("IrregularityTracingSNo");
                     dtCreateIrregularityResponse.Columns.Add("ResponseDateTimeVal");
                    dtCreateIrregularityResponse.Columns.Add("StationVal");
                    dtCreateIrregularityResponse.Columns.Add("HdnResponse");
                    dtCreateIrregularityResponse.Columns.Add("Remarks");
                    foreach (DataRow dr in dt.Rows)
                    {
                        DataRow drRow = dtCreateIrregularityResponse.NewRow();
                        drRow["imgurl"] = dr["imgurl"].ToString();
                        drRow["IrregularityTracingSNo"] = dr["IrregularityTracingSNo"].ToString();
                        drRow["ResponseDateTimeVal"] = dr["ResponseDateTimeVal"].ToString();
                        drRow["StationVal"] = dr["StationVal"].ToString();
                        drRow["HdnResponse"] = Convert.ToInt16(dr["HdnResponse"].ToString());
                        drRow["Remarks"] = dr["Remarks"].ToString();
                        dtCreateIrregularityResponse.Rows.Add(drRow);
                    }
                    string UserSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                    SqlParameter[] param = {
                                            new SqlParameter("@UserSNo",UserSNo),
                                            new SqlParameter("@IrregularityResponseTable",dtCreateIrregularityResponse)
                                        };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateIrregularityResponse", param);
                }
                if (ret >= 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Irregularity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (dataBaseExceptionMessage == "Related Information Not Found.")
                        {
                            dataBaseExceptionMessage = "Status Updated Successfully";
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 1));
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 1));
                        }
                    }
                }

                
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// added by tarun k singh
        /// for getting irr response record
        /// 12/01/18
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="model"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public KeyValuePair<string, List<IrregularityResponse>> GetIrregularityResponseRecord(string recordID, int page, int pageSize, IrregularityResponseRequest model, string sort)
        {
            try
            {
                IrregularityTrans irregularityTrans = new IrregularityTrans();
                SqlParameter[] Parameters = {
                                           //new SqlParameter("@IrregularitySNo", recordID),
                                           new SqlParameter("@IrregularityTracingSNo", model.IrrTracingSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIrregularityResponseRecord", Parameters);

                if (ds.Tables[0].Rows.Count != 0)
                {
                   
                    var IrregularityResponseList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityResponse
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        IrregularityTracingSNo = Convert.ToInt32(e["IrregularityTracingSNo"].ToString()),
                        HdnResponse= Convert.ToInt32(e["HdnResponse"].ToString()),
                        Response = e["Response"].ToString(),//Convert.ToInt32(
                        Remarks = e["Remarks"].ToString(),
                        imgurl = e["imgurl"].ToString(),
                        User = e["User"].ToString(),
                        ResponseDateTime = e["ResponseDateTime"].ToString(),
                        Station = e["Station"].ToString(),
                    });
                    return new KeyValuePair<string, List<IrregularityResponse>>(ds.Tables[0].Rows[0][0].ToString(), IrregularityResponseList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new IrregularityResponse
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<IrregularityResponse>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateIrregularityTransDimension(string strData)
        {
            try
            { 
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            // convert JSON string into datatable
            DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(strData), (typeof(DataTable)));
            // for update existing record
            if (dt.Rows.Count > 0)
            {
                DataTable dtCreateIrregularity = new DataTable();
                dtCreateIrregularity.Columns.Add("SNo");
                dtCreateIrregularity.Columns.Add("Length");
                dtCreateIrregularity.Columns.Add("Width");
                dtCreateIrregularity.Columns.Add("Height");
                dtCreateIrregularity.Columns.Add("MeasurementUnit");
                foreach (DataRow dr in dt.Rows)
                {
                    DataRow drRow = dtCreateIrregularity.NewRow();
                    drRow["SNo"] = dr["SNo"];
                    drRow["Length"] = dr["Length"];
                    drRow["Width"] = dr["Width"];
                    drRow["Height"] = dr["Height"];
                    drRow["MeasurementUnit"] = dr["MeasurementUnit"].ToString() == "" ? DBNull.Value : dr["MeasurementUnit"];
                    dtCreateIrregularity.Rows.Add(drRow);
                }
                int IrregularityTransSNo = Convert.ToInt32(dt.Rows[0]["IrregularityTransSNo"].ToString());
                string UserSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                SqlParameter[] param = { 
                                            new SqlParameter("@IrregularityTransSNo",IrregularityTransSNo),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@IrregularityDimensionTable",dtCreateIrregularity),
                                        };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateIrregularityTransDimension", param);
            }
            if (ret >= 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Irregularity");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (dataBaseExceptionMessage == "Related Information Not Found.")
                    {
                        dataBaseExceptionMessage = "Status Updated Successfully";
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            //for (int i = 0; i < dtUploader.Rows.Count; i++)
            //{
            //    string FileName = dtUploader.Rows[i]["ImageAttachement"].ToString();
            //    System.IO.File.Delete(Path.GetFullPath(path + FileName));
            //}
            return ErrorMessage;
                }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteIrregularityTransDimension(string recordID)
        {
            try
            { 
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIrregularityTransDimension", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Irregularity");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            return ErrorMessage;
                
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> Blank(string strData)
        {
            try
            { 
            List<string> ErrorMessage = new List<string>();
            string blank1 = "Dimensions Added Successfully";
            ErrorMessage.Add(blank1);
            return ErrorMessage;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string GetHistoryDetails(int ISNo, int ActionSNo)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@ISNo", ISNo), new SqlParameter("@ActionSNo", ActionSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHistoryDetails", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
                }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAWBDimDetails(int AWBSNo, int typeID)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@typeID", typeID) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBDimDetails", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckAWBInOFLD(int IrregularitySNo, int IrregularityTransSNo)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", IrregularitySNo), new SqlParameter("@IrregularityTransSNo", IrregularityTransSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckAWBInOFLD", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> SaveAction(int IrregularitySNo, int IrregularityTransSNo, int Action, string PackageCondition, string Remarks, string AWBNo, string Type, string CityCode, int CitySNo, int UserSNo, int Pieces)
        {
            try
            { 
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] param = {   new SqlParameter("@IrregularitySNo",IrregularitySNo),
                                       new SqlParameter("@IrregularityTransSNo",IrregularityTransSNo),
                                       new SqlParameter("@Action",Action),
                                       new SqlParameter("@PackageCondition",PackageCondition),
                                       new SqlParameter("@Remarks",Remarks),
                                       new SqlParameter("@AWBNo",AWBNo),
                                       new SqlParameter("@Type",Type),
                                       new SqlParameter("@CityCode",CityCode),
                                       new SqlParameter("@CitySNo",CitySNo),
                                       new SqlParameter("@UserSNo",UserSNo),
                                       new SqlParameter("@Pieces",Pieces),
                                     new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                   };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveActionIrregularity", param);

            if (ret >= 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Irregularity");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (dataBaseExceptionMessage == "Related Information Not Found.")
                    {
                        dataBaseExceptionMessage = "Status Updated Successfully";
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            return ErrorMessage;
                }
            catch(Exception ex)
            {
                throw ex;
            }


        }

        public List<string> SaveUDLDAction(int IrregularitySNo, int IrregularityTransSNo, string DisposalAdvice, string DestructionDate, string AuctionDate, string Remarks, string AWBNo, string Type, string CityCode, int CitySNo, int UserSNo, int Pieces)
        {
            try
            { 
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] param = {   new SqlParameter("@IrregularitySNo",IrregularitySNo),
                                       new SqlParameter("@IrregularityTransSNo",IrregularityTransSNo),
                                       new SqlParameter("@DisposalAdvice",DisposalAdvice),
                                       new SqlParameter("@DestructionDate",DestructionDate),
                                       new SqlParameter("@AuctionDate",AuctionDate),
                                       new SqlParameter("@Remarks",Remarks),
                                       new SqlParameter("@AWBNo",AWBNo),
                                       new SqlParameter("@Type",Type),
                                       new SqlParameter("@CityCode",CityCode),
                                       new SqlParameter("@CitySNo",CitySNo),
                                       new SqlParameter("@UserSNo",UserSNo),
                                       new SqlParameter("@Pieces",Pieces),
                                     new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                   };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveUDLDActionIrregularity", param);

            if (ret >= 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Irregularity");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (dataBaseExceptionMessage == "Related Information Not Found.")
                    {
                        dataBaseExceptionMessage = "Status Updated Successfully";
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            return ErrorMessage;
                }
            catch(Exception ex)
            {
                throw ex;
            }


        }

        public string GetActionDetails(int IrregularitySNo, int IrregularityTransSNo)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", IrregularitySNo), new SqlParameter("@IrregularityTransSNo", IrregularityTransSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetActionDetails", Parameters);
            ds.Dispose();
            return DStoJSON(ds);
                }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string GetNNDPrint(int ISNo, string AWBNo, int MovementType, string CityCode, int TerminalSNo, string TabCount)
        {
            try
            { 
            SqlParameter[] Parameters = {
                                          new SqlParameter("@ISNo", ISNo),
                                          new SqlParameter("@AWBNo", AWBNo),
                                          new SqlParameter("@MovementType", MovementType),
                                          new SqlParameter("@CityCode", CityCode),
                                          new SqlParameter("@TerminalSNo", TerminalSNo),
                                          new SqlParameter("@TabCount", TabCount)
                                         // new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetNNDPrint", Parameters);
            ds.Dispose();

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string GetHAWBPcs(int SNo, string MovementTypeSNo)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo), new SqlParameter("@MovementTypeSNo", MovementTypeSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHAWBPcs", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            { 
                return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string ULDNo = "", string CreatedOn = "")
        {
            //this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
            try
            {
                StringBuilder myCurrentForm = new StringBuilder();

                using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                {
                    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                    myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                }

                byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultMyForm);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveActionNew(List<SaveActionNew> SaveData)
        {
            try
            {
            List<string> ErrorMessage = new List<string>();
            DataSet ds = new DataSet();
            
                DataTable dtActionNew = new DataTable();
                dtActionNew = CollectionHelper.ConvertTo(SaveData, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        {
                                            new SqlParameter("@dtActionNew",dtActionNew),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveActionNew", param);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
           
            
            catch(Exception ex)
            {
                throw ex;
            }
        }
        
        public string GetActionHistory(string IrregularitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", IrregularitySNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetActionHistory", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAwbNoForAction(string IrregularitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", IrregularitySNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAwbNoForAction", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSeggrigateOrNot(string AWBSNo, string DailyFlightSNo)
        {
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSeggrigateOrNot", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> DeleteIrregularity(List<string> listID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                string RecordID = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordID), new SqlParameter("@UserID", UserId)};
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIrregularity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Irregularity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetCarrierSurveyReportFormPrintForIrrg(string IrregularitySNo, int incidentctg)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@IrregularitySNo", Convert.ToString(IrregularitySNo)), new SqlParameter("@IncidentCategorySNo", incidentctg) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCarrierSurveyReportFormPrintForIrrg", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        //public string SaveAuthorizedPersonal(int IrregularitySNo)
        //{
        //    DataTable dtAuthorizedPersonal = CollectionHelper.ConvertTo(AuthorizedPersonal, "");
        //    dtAuthorizedPersonal.Columns.Add("IdCardFile", typeof(byte[]));
        //    dtAuthorizedPersonal.Columns.Add("AuthorizationLetterFile", typeof(byte[]));
        //    dtAuthorizedPersonal.Columns.Add("PhotoFile", typeof(byte[]));
        //    foreach (DataRow dr in dtAuthorizedPersonal.Rows)
        //    {
        //        foreach (DataColumn dc in dtAuthorizedPersonal.Columns)
        //        {
        //            if (dc.ToString() == "AttachIdCardName")
        //            {
        //                if (dr[dc].ToString() != "")
        //                {
        //                    var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr[dc].ToString());
        //                    // var serverPath = System.Web.HttpContext.Current.Server.MapPath("~/UploadImage/" + dr[dc].ToString());

        //                    dr["IdCardFile"] = ReadImageFile(serverPath);
        //                }
        //            }
        //            else if (dc.ToString() == "AttachAuthorizationLetterName")
        //            {
        //                if (dr[dc].ToString() != "")
        //                {
        //                    var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr[dc].ToString());
        //                    dr["AuthorizationLetterFile"] = ReadImageFile(serverPath);
        //                }
        //            }
        //            else if (dc.ToString() == "AttachPhotoName")
        //            {
        //                if (dr[dc].ToString() != "")
        //                {
        //                    var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr[dc].ToString());
        //                    dr["PhotoFile"] = ReadImageFile(serverPath);
        //                }
        //            }
        //        }
        //    }

        //    SqlParameter[] param = 
        //                        { 
        //                          new SqlParameter("@AuthorizedPersonal",dtAuthorizedPersonal),
        //                          new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                         };
        //    try
        //    {
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAuthorizedPersonal", param);
        //        //if (ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() == "0")
        //        //{
        //        //    string[] filePaths = Directory.GetFiles(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/"));
        //        //    foreach (string filePath in filePaths)
        //        //        File.Delete(filePath);
        //        //}
        //        return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        return ex.Message;
        //    }
        //}
    }
}
