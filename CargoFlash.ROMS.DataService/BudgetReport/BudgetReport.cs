using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.DataService.BudgetReport
{

    public class BudgetReport : SignatureAuthenticate, IBudgetReport
    {
        public string GetTargetBudgetGridDataService(TargetBudget Budget)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@FromMonth", Budget.FromMonth), new SqlParameter("@ToMonth", Budget.ToMonth), new SqlParameter("@OriginSNo", Budget.OriginSno), new SqlParameter("@DestinationSNo", Budget.DestinationSno) };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReport_TargetBudget", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    public class TargetBudget
    {
        public DateTime FromMonth { get; set; }
        public DateTime ToMonth { get; set; }
        public int OriginSno { get; set; }
        public int DestinationSno { get; set; }
    }
}
