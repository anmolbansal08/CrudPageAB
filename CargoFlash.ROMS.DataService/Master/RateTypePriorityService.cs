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
using Newtonsoft.Json;
using System.Web.Services;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{


    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateTypePriorityService : SignatureAuthenticate, IRateTypePriorityService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();


        public string BindDatatable()
        {
            try
            {

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRateTypePriority");
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }






        public string UpdateRateTypePriority(List<RateTypePriority> RateTypePriority, int UpdatedBy)
        {
            try
            {
                DataTable DtRateTypePriority = CollectionHelper.ConvertTo(RateTypePriority, "");
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@RateTypePriorityTable", SqlDbType.Structured){Value=DtRateTypePriority} ,
                                            new SqlParameter("@UpdatedBy", UpdatedBy)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateRateTypePriority", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
         }



    }
}
