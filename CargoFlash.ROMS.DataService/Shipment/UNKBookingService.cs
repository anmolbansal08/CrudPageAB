using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Text;
using System.ServiceModel.Web;
using Newtonsoft.Json;
using System.Net;


namespace CargoFlash.Cargo.DataService.Shipment
{

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UNKBookingService : SignatureAuthenticate, IUNKBookingService
    {
        //public string BindUNKBooking()
        //{

        //    //SqlParameter[] Parameters = { 
        //    //                           new SqlParameter("@AWBNo", AWBNO),
        //    //                           new SqlParameter("@SwapAWBNo", SwapAWBNO)};
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUNKBookingDetail");
        //    ds.Dispose();

        //    return CompleteDStoJSON(ds);

        //}
        public static string CompleteDStoJSON(DataSet ds)
        {
            try
            {
                StringBuilder json = new StringBuilder();
                if (ds != null && ds.Tables.Count > 0)
                {
                    json.Append("{");
                    for (int tblCount = 0; tblCount < ds.Tables.Count; tblCount++)
                    {
                        if (tblCount > 0)
                            json.Append(",");
                        json.Append("\"Table" + tblCount.ToString() + "\":");
                        int lInteger = 0;
                        json.Append("[");
                        foreach (DataRow dr in ds.Tables[tblCount].Rows)
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
                                json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                                json.Append("\"");
                                i++;
                                if (i < colcount) json.Append(",");
                            }

                            if (lInteger < ds.Tables[tblCount].Rows.Count)
                            {
                                json.Append("},");
                            }
                            else
                            {
                                json.Append("}");
                            }
                        }
                        json.Append("]");
                    }
                    json.Append("}");
                }
                else
                {
                    json.Append("[");
                    json.Append("]");
                }
                return json.ToString();
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
