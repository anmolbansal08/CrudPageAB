using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.ULD;
using System.Net;
namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDSupportProcessedService : SignatureAuthenticate, IULDSupportProcessedService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public KeyValuePair<string, List<ULDSupportProcessed>> GetULDSupportProcessedRecord(int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                var AirPortCode = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString();
                var CurrentAirportSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString();
                page = 1;
                whereCondition = "AssignAirportSNo=" + CurrentAirportSNo;
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort), new SqlParameter("@AirPortCode", AirPortCode) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDSupportProcessed", Parameters);
                var ULDSupportProcessedSlabList = ds.Tables[0].AsEnumerable().Select(e => new ULDSupportProcessed
                {

                    ULDSupportRequestAssignTransSNo = Convert.ToInt32(e["ULDSupportRequestAssignTransSNo"]),
                    ULDSupportRequestSno = Convert.ToInt32(e["ULDSupportRequestSno"]),
                    RequestRefNo = (e["ReferenceNo"]).ToString(),
                    RequestBy = e["Text_ReqByAirportSno"].ToString(),
                    ULDType = e["uldname"].ToString(),
                    RequestQTY = (e["QTY"]).ToString(),
                    ProcessedQTY = (e["ReleaseQty"]).ToString(),
                    AssignedTo = e["Text_ReqToAirportSno"].ToString(),
                    Remarks = (e["Remark"]).ToString(),
                    ULDSupportRequestQTY = Convert.ToInt32((e["QTY"])),
                    UpdatedBy=Convert.ToString(e["UpdatedBy"]),
                    UpdatedOn=Convert.ToString(e["UpdatedOn"]),
                    ClosedOn = (e["ClosedOn"]).ToString(),
                    InitiateRemarks = (e["InitiateRemarks"]).ToString(),
                });
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new KeyValuePair<string, List<ULDSupportProcessed>>(null, ULDSupportProcessedSlabList.AsQueryable().ToList());
                }
                else
                {
                    return new KeyValuePair<string, List<ULDSupportProcessed>>(ds.Tables[0].Rows[0][0].ToString(), ULDSupportProcessedSlabList.AsQueryable().ToList());
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateULDSupportProcessed(Int32 ULDSupportRequestAssignTransSNo, Int32 ULDSupportProcessedQTY, string ULDSupportProcessedRemarks, Int32 ULDSupportRequestSno)
        {
            try
            {

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@ULDSupportRequestAssignTransSNo", ULDSupportRequestAssignTransSNo), new SqlParameter("@ULDSupportProcessedQTY", ULDSupportProcessedQTY), new SqlParameter("@ULDSupportProcessedRemarks", ULDSupportProcessedRemarks), new SqlParameter("@ULDSupportRequestSno", ULDSupportRequestSno), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds1 = new DataSet();
              
                    ds1 = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spULDSupport_UpdateULDSupportProcessed", Parameters);
                    return ds1.Tables[0].Rows[0][0].ToString();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
