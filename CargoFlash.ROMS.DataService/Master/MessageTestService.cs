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
using System.Web.UI;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class MessageTestService : SignatureAuthenticate, IMessageTestService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
       

        int CitySno;
        int AccountSno;
        int StatusSno;
        decimal GrossWeight = 0;
        int Pieces;
        decimal VolumeAmount = 0;
        string VolumeAmountCode;
        decimal chargeableWeight;
        string natureOfGoods;
        int totalPieces;
        string ErrorMessage;
        FFRManagement m = new FFRManagement();
        DataSet ds;
        public DataSet GetGridData()
        {
            try
            {
                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spMessage_MessageReceivedLog");


                return ds;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetMessageReceived()
        {
            try
            {


                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ScheduleFFR");
                // Excel_DS = m.GetMessageReceived();
                DataTable dt = ds.Tables[0];

                return "k";
            }
            catch(Exception ex)//
            {
                throw ex;
            }
         }       
    }
}
