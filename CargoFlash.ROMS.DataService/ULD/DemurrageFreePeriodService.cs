using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DemurrageFreePeriodService : SignatureAuthenticate, IDemurrageFreePeriodService
    {
      
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<ULDStockGrid>(filter);
       
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDemurragFreePeriod", Parameters);
            var DemurragFreePeriodList = ds.Tables[0].AsEnumerable().Select(e => new DemurragFreePeriodGrid
            {
                SNo = Convert.ToInt32(e["SNo"].ToString().ToUpper()),
                ULDType = e["ULDType"].ToString().ToUpper(),
                AirlineName = e["AirlineName"].ToString().ToUpper(),
                AgentName = e["AgentName"].ToString().ToUpper(),
                Name = e["Name"].ToString().ToUpper(),
                FreeType = e["FreeType"].ToString().ToUpper(),
                FreeDays = e["FreeDays"].ToString().ToUpper(),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = DemurragFreePeriodList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        public DemurrageFreePeriod GetDemurrageFreePeriodRecord(string recordID)
        {
            DemurrageFreePeriod demurrageFreePeriod = new DemurrageFreePeriod();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDemurrageFreePeriod", Parameters);
                if (dr.Read())
                {
                    demurrageFreePeriod.SNo = Convert.ToInt32(dr["SNo"].ToString().ToUpper());
                    demurrageFreePeriod.ULDTypeSno = Convert.ToString(dr["ULDTypeSno"]);
                    demurrageFreePeriod.AirlineSNo = Convert.ToString(dr["AirlineSNo"]);
                    demurrageFreePeriod.AgentSNo = Convert.ToString(dr["AgentSNo"]);
                    demurrageFreePeriod.ShipperSNo = Convert.ToString(dr["ShipperSNo"]);
                    demurrageFreePeriod.TypeSNo = Convert.ToString(dr["TypeSNo"]);
                    demurrageFreePeriod.Text_ULDTypeSno = Convert.ToString(dr["Text_ULDTypeSno"]);
                    demurrageFreePeriod.Text_AirlineSNo = Convert.ToString(dr["Text_AirlineSNo"]);
                    demurrageFreePeriod.Text_AgentSNo = Convert.ToString(dr["Text_AgentSNo"]);
                    demurrageFreePeriod.Text_ShipperSNo = Convert.ToString(dr["Text_ShipperSNo"]);
                    demurrageFreePeriod.Text_TypeSNo = Convert.ToString(dr["Text_TypeSNo"]);
                    demurrageFreePeriod.FreeDaysSNo = Convert.ToString(dr["FreeDaysSNo"]);
                }
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return demurrageFreePeriod;
        }

        public string SaveDetails(DemurrageFreePeriod obj)
        {
            List<string> str = new List<string>();
            int User = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
            SqlParameter[] Parameters = {   new SqlParameter("@ULDTypeSno", obj.ULDTypeSno),
                                                new SqlParameter("@AirlineSNo", obj.AirlineSNo),
                                                new SqlParameter("@AgentSNo", obj.AgentSNo),
                                                new SqlParameter("@ShipperSNo",  obj.ShipperSNo),
                                                new SqlParameter("@TypeSNo", obj.TypeSNo ), 
                                                new SqlParameter("@FreeDaysSNo", obj.FreeDaysSNo ),
                                                new SqlParameter("@USerSNO", User ),
                                            };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spDemurragefreeSavedetails", Parameters);
            return ds.Tables[0].Rows[0][0].ToString();
        }
        public List<string> DeleteDemurrageFreePeriod(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spDeleteDemurrageFreePeriod", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DemurrageFreePeriod");
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
            else
            {
                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    ErrorMessage.Add(dataBaseExceptionMessage);
                //Error
            }
            return ErrorMessage;
        }

        public List<string> UpdateDemurrageFreePeriod(List<DemurrageFreePeriod> DemurrageFreePeriod)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateDemurrageFreePeriod = CollectionHelper.ConvertTo(DemurrageFreePeriod, "Text_ULDTypeSno,Text_AirlineSNo,Text_AgentSNo,Text_ShipperSNo,Text_TypeSNo");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("DemurrageFreePeriod", dtCreateDemurrageFreePeriod, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DemurrageFreePeriodTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDemurrageFreePeriod;
            SqlParameter[] Parameters = { param };
           
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDemurrageFreePeriod", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DemurrageFreePeriod");
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
    }
}
