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
using Newtonsoft.Json;
using System.Xml.Serialization;
using System.Xml;
using System.IO;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    class BTLService : SignatureAuthenticate, IBTLService
    {

        public string  GetBTLRecord(string recordID)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", 1) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordBTL", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<BTL>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListBTL", Parameters);
                var BTLList = ds.Tables[0].AsEnumerable().Select(e => new BTL
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    BTLName = e["BTLName"].ToString().ToUpper(),
                    Text_AirlineSNo = (e["Text_AirlineSNo"]).ToString().ToUpper(),
                    Text_Type = e["Text_Type"].ToString().ToUpper(),
                    Text_BTLLevel = e["Text_BTLLevel"].ToString().ToUpper(),
                    Text_BTLStatus = e["Text_BTLStatus"].ToString().ToUpper(),
                    ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc)
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = BTLList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> SaveBTL(List<BTL> BTL)
        {

            try
            {

                //validate Business Rule
                DataTable dtCreateBTL = CollectionHelper.ConvertTo(BTL, "Text_AirlineSNo,Text_Type,Text_BTLLevel,Text_BTLStatus,Text_AircraftSNo,Text_AccountSNo,Text_DaysOfWeek,BTLFlightTrans,BTLPeriodTrans");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("BTL", dtCreateBTL, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                DataTable dtCreateBTLFlightTrans = CollectionHelper.ConvertTo(BTL[0].BTLFlightTrans, "");


                DataTable dtCreateBTLPeriodTrans = CollectionHelper.ConvertTo(BTL[0].BTLPeriodTrans, "");

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@BTLTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateBTL;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@BTLFlightTrans";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtCreateBTLFlightTrans;

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@BTLPeriodTrans";
                param2.SqlDbType = System.Data.SqlDbType.Structured;
                param2.Value = dtCreateBTLPeriodTrans;

                SqlParameter[] Parameters = { param, param1, param2 };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateBTL", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "BTL");
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }
    }
}
