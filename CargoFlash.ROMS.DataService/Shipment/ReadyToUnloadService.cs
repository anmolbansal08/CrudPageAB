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
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService.Shipment;
using Newtonsoft.Json;
using System.Net;
namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ReadyToUnloadService : BaseBusiness, IReadyToUnloadService
    {
        public KeyValuePair<string, List<ReadyToUnloading>> GetReadyToUnloadingRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ReadyToUnloading readyToUnloading = new ReadyToUnloading();

                SqlParameter[] Parameters = {new SqlParameter("@PageNo",page),
                                        new SqlParameter("@PageSize",pageSize),
                                        new SqlParameter("@WhereCondition",whereCondition),
                                        new SqlParameter("@OrderBy",sort)};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSLIReadyToUnloading", Parameters);//GetReadyToUnloadingRecord //GetReadyToUnloadingRecord_SLI
                var readyToUnloadingList = ds.Tables[0].AsEnumerable().Select(e => new ReadyToUnloading
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Sli = Convert.ToInt32(e["Sli"].ToString()),
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    Pieces = e["Pieces"].ToString().ToUpper(),
                    Verified = e["Verified"].ToString().ToUpper(),
                    TruckNo = e["TruckNo"].ToString().ToUpper(),
                    ManPower = e["ManPower"].ToString().ToUpper(),
                    BuildEquipment = e["BuildEquipment"].ToString().ToUpper(),
                    HdnBuildEquipment = e["BuildEquipmentSNo"].ToString().ToUpper(),
                    Location = e["Location"].ToString().ToUpper(),
                    HdnLocation = e["LocationSNo"].ToString().ToUpper(),
                    StartDate = e["StartDate"].ToString().ToUpper(),
                    EndDate = e["EndDate"].ToString().ToUpper(),
                    StartUTime = e["StartUTime"].ToString().ToUpper(),
                    EndUTime = e["EndUTime"].ToString().ToUpper(),
                    SLINo = e["SLINo"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper()
                });
                return new KeyValuePair<string, List<ReadyToUnloading>>(ds.Tables[1].Rows[0][0].ToString(), readyToUnloadingList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateReadyToUnloading(List<ReadyToUnloading> ReadyToUnloading)
        {
            try
            {
                DataTable dtUpdateReadyToUnloading = CollectionHelper.ConvertTo(ReadyToUnloading, "Sli,AWBNo,Pieces,Verified,HdnBuildEquipment,HdnLocation,SLINo,AgentName,Location,StartDate,EndDate");

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ReadyToLoadingType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateReadyToUnloading;
                SqlParameter[] Parameters = { param };
                string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateReadyToUnloading", Parameters).ToString();

                return ret;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

    }
}
