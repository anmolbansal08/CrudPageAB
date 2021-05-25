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
using CargoFlash.Cargo.Model.SpaceControl;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.DataService.SpaceControl
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AWBQueueManagementService : IAWBQueueManagementService
    {
        ///  Get list of the records to be shown in the grid on Pageload
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<AWBQueueManagement>(filter);

      
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAWBQueueManagement", Parameters);

            var QueueList = ds.Tables[0].AsEnumerable().Select(e => new AWBQueueManagement
            {
                SNo = Convert.ToInt32(e["SNo"]),
                QueueManagmentType = e["QueueManagmentType"].ToString(),
                SectorName = e["SectorName"].ToString().ToUpper(),
                OriginAirportCode = e["OriginAirportCode"].ToString().ToUpper(),
                DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                CarrierCode = e["CarrierCode"].ToString(),
                Active = e["Active"].ToString(),

            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = QueueList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };

        }

        public List<string> SaveAWBQueueManagement(List<AWBQueueManagement> awbQueueManagement)
        {

            List<string> ErrorMessage = new List<string>();

            DataTable dtawbQueMang = CollectionHelper.ConvertTo(awbQueueManagement, "Active,Text_FlightTypeSNo,Text_OriginAirportSNo,Text_DestinationAirportSNo");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("AWBQueueManagement", dtawbQueMang, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter paramAccount = new SqlParameter();
            paramAccount.ParameterName = "@AWBQueueManagement";
            paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
            paramAccount.Value = dtawbQueMang;

            SqlParameter[] Parameters = { paramAccount };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAWBQueueManagement", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AWBQueueManagement");
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


        /// <summary>
        /// 
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public AWBQueueManagement GetAWBQueueManagementRecord(string recordID, string UserID)
        {
            AWBQueueManagement awbQueueManagement = new AWBQueueManagement();
            SqlDataReader dr = null;
            try
            {
                

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAWBQueueManagement", Parameters);
                if (dr.Read())
                {
                    awbQueueManagement.SNo = Convert.ToInt32(dr["SNo"]);
                    awbQueueManagement.QueueManagmentType = dr["QueueManagmentType"].ToString();
                    awbQueueManagement.SectorName = dr["SectorName"].ToString();
                    awbQueueManagement.SectorDescription = dr["SectorDescription"].ToString();
                    awbQueueManagement.OriginAirportSNo = int.Parse(dr["OriginAirportSNo"].ToString());
                    awbQueueManagement.Text_OriginAirportSNo = dr["OriginAirportCode"].ToString();
                    awbQueueManagement.DestinationAirportSNo = int.Parse(dr["DestinationAirportSNo"].ToString());
                    awbQueueManagement.Text_OriginAirportSNo = dr["DestinationAirportCode"].ToString();
                    awbQueueManagement.CarrierCode = dr["CarrierCode"].ToString();
                    awbQueueManagement.FlightNumber = int.Parse(dr["FlightNumber"].ToString());
                    awbQueueManagement.FlightTypeSNo = int.Parse(dr["FlightTypeSNo"].ToString());
                    awbQueueManagement.Text_FlightTypeSNo = dr["FlightTypeName"].ToString();

                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        awbQueueManagement.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        awbQueueManagement.Active = dr["Active"].ToString().ToUpper();
                    }

                    awbQueueManagement.CreatedBy = dr["CreatedUser"].ToString();
                    awbQueueManagement.UpdatedBy = dr["UpdatedUser"].ToString();
                }
                dr.Close();

            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();

            }
            return awbQueueManagement;
        }
    }
}
