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
using System.Net;
namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CreditLimitUpdateService : SignatureAuthenticate, ICreditLimitUpdateService
    {
        public string GetCreditLimitUpdateAgentDetailsRecord(string SNo,string Flag1)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo),
                                              new SqlParameter ("@Flag1",Flag1)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCreditLimitUpdateAgentDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> SaveCreditLimitUpdate(List<CreditLimitUpdate> CreditLimitUpdate)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCreditLimitUpdate = CollectionHelper.ConvertTo(CreditLimitUpdate, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CreditLimitUpdateTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCreditLimitUpdate;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCreditLimitAgent", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CreditLimitUpdate");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
    }
}
