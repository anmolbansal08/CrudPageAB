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
    public class AllocationService : IAllocationService
    {
        /// <summary>
        /// Retrieve Account infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        public Allocation GetAllocationRecord(string recordID, string UserID)
        {
    
            Allocation Alloc = new Allocation();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllocation", Parameters);
            if (dr.Read())
            {
                Alloc.SNo = Convert.ToInt32(recordID.ToString());
                Alloc.AircraftSNo = Convert.ToInt32(dr["AircraftSNo"].ToString());
                Alloc.Text_AircraftSNo = dr["AircraftType"].ToString();
                Alloc.Text_DestinationAirportSNo = dr["dest"].ToString();
                Alloc.Text_OriginAirportSNo = dr["orig"].ToString();
                Alloc.AllocationCode = dr["AllocationCode"].ToString();
                Alloc.OriginAirportSNo = Convert.ToInt32(dr["OriginAirportSNo"].ToString());
                Alloc.DestinationAirportSNo = Convert.ToInt32(dr["DestinationAirportSNo"].ToString());
                Alloc.StartDate = Convert.ToDateTime(dr["StartDate"].ToString());
                Alloc.EndDate = Convert.ToDateTime(dr["EndDate"].ToString());
                Alloc.CarrierCode = dr["CarrierCode"].ToString();
                Alloc.Text_CarrierCode = dr["CarrierCode"].ToString();
                Alloc.FlightNumber = dr["FlightNumber"].ToString();
                Alloc.FlightNo = dr["FlightNo"].ToString();
                Alloc.Remarks = dr["Remarks"].ToString();
                Alloc.IsActive = dr["IsActive"].ToString() == "True" ? true : false;
                Alloc.CreatedBy = Convert.ToInt32(dr["CreatedBy"].ToString());
            }
            dr.Close();
            return Alloc;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Allocation>(filter);
           
          
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAllocation", Parameters);
            var AllocationList = ds.Tables[0].AsEnumerable().Select(e => new Allocation
            {
                SNo = Convert.ToInt32(e["SNo"].ToString())
                ,
                AircraftType = e["AircraftType"].ToString()
                ,
                OrginAirportName = e["OrginAirportName"].ToString()
                ,
                DestinationAirportName = e["DestinationAirportName"].ToString()
                ,
                StartDate = Convert.ToDateTime(e["StartDate"].ToString())
                ,
                EndDate = Convert.ToDateTime(e["EndDate"].ToString())
                    // ,CarrierCode = e["CarrierCode"].ToString()
                ,
                FlightNumber = e["FlightNumber"].ToString()
                ,
                IsActive = e["Active"].ToString() == "False" ? true : false
                ,
                AllocationCode = e["AllocationCode"].ToString()


            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = AllocationList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public List<string> SaveAllocation(List<Allocation> allocation)
        {
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreatealloc = CollectionHelper.ConvertTo(allocation, "AircraftType,OrginAirportName,DestinationAirportName,Text_OriginAirportSNo,Text_DestinationAirportSNo,Text_AircraftSNo,Text_CarrierCode");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Allocation", dtCreatealloc, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter paramAccount = new SqlParameter();
            paramAccount.ParameterName = "@AllocTbl";
            paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
            paramAccount.Value = dtCreatealloc;

            SqlParameter[] Parameters = { paramAccount };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAllocation", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Allocation");
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

        public List<string> UpdateAllocation(List<Allocation> allocation)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtUpdateAllocation = CollectionHelper.ConvertTo(allocation, "AircraftType,OrginAirportName,DestinationAirportName,Text_OriginAirportSNo,Text_DestinationAirportSNo,Text_AircraftSNo,Text_CarrierCode");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Allocation", dtUpdateAllocation, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@allocTbl";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdateAllocation;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAllocation", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Account");
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
        public List<string> DeleteAllocation(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@AccountCode", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAllocation", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Allocation");
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
            }
            else
            {
                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    ErrorMessage.Add(dataBaseExceptionMessage);
                //Error
            }
            return ErrorMessage;
        }

        public DataSourceResult GetAllocationCode(String AllocCode)
        {
            List<String> cur = new List<String>();
            SqlParameter[] Parameters = { new SqlParameter("@AllocCode", AllocCode) };
            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllocCodeCheck", Parameters);
            if (dr.Read())
            {
                cur.Add(dr["SNo"].ToString());
            }
            return new DataSourceResult
            {
                Data = cur,
                Total = cur.Count()
            };
        }
    }
}
