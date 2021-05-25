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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public  class RatePriorityMasterService :SignatureAuthenticate,IRatePriorityMasterService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();


        public string BindDatatable()
        {
            try
            {

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRatePriorityMaster");
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }

        public string UpdateRatePriorityMaster(List<RatePriorityMaster> RatePriorityMaster, int UpdatedBy)
        {
            try
            {
                DataTable DtRatePriorityMaster = CollectionHelper.ConvertTo(RatePriorityMaster, "");
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UpdateRatePriorityMaster", SqlDbType.Structured){Value=DtRatePriorityMaster} ,
                                            new SqlParameter("@UpdatedBy", UpdatedBy)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateRatePriorityMaster", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

    }
}
