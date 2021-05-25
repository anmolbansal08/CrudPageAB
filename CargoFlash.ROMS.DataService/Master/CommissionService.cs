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
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CommissionService : SignatureAuthenticate, ICommissionService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Commission>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCommissionDetails", Parameters);
                var CommissionList = ds.Tables[0].AsEnumerable().Select(e => new Commission
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    RefNo = Convert.ToString(e["RefNo"]),
                    Text_OfficeSNo = e["Text_OfficeSNo"].ToString().ToUpper(),
                    Text_Agent = e["Text_Agent"].ToString().ToUpper(),
                    CustomerType = e["CustomerType"].ToString().ToUpper(),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString(),
                    //  CommissionTypeText = e["CommissionUnit"].ToString().ToUpper(),
                    //  CommissionAmount = Convert.ToDecimal(e["Commission"].ToString()),
                    //   IncentiveAmount = Convert.ToDecimal(e["Incentive"].ToString()),
                    // ValidFromText = e["ValidFromText"].ToString().ToUpper(),
                    //   ValidToText = e["ValidToText"].ToString().ToUpper(),
                     Active = e["Active"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CommissionList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public Commission GetCommissionRecord(string recordID, string UserSNo)
        {

            Commission commission = new Commission();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCommissionRecord", Parameters);
                if (dr.Read())
                {
                    commission.SNo = Convert.ToInt32(dr["SNo"]);
                    commission.RefNo = Convert.ToString(dr["RefNo"]);
                    commission.OfficeSNo = Convert.ToInt32(dr["OfficeSNo"]);
                    commission.Text_OfficeSNo = Convert.ToString(dr["Text_OfficeSNo"]);
                    commission.Agent = Convert.ToInt32(dr["AccountSNo"]);
                    commission.Text_Agent = Convert.ToString(dr["Agent"].ToString());
                    commission.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    commission.Text_AirlineSNo = Convert.ToString(dr["Text_AirlineSNo"]); 
                    // commission.Unit = Convert.ToInt32(dr["Unit"]);
                    //  commission.Text_Unit = Convert.ToString(dr["UnitText"]);
                    //  commission.Type = Convert.ToInt32(dr["Type"]);
                    //   commission.Text_Type = Convert.ToString(dr["Text_Type"]);
                    commission.CustomerType = Convert.ToString(dr["CustomerType"]);
                    //   commission.CommissionTypeText = Convert.ToString(dr["CommissionType"]);
                    //    commission.CommissionAmount = Convert.ToDecimal(dr["Commission"]);
                    ///    commission.IncentiveAmount = Convert.ToDecimal(dr["Incentive"]);
                    //   commission.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    //    commission.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                     commission.Active = Convert.ToString(dr["Active"]);
                    commission.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    commission.CreatedUser = Convert.ToString(dr["CreatedUser"]);
                    commission.UpdatedUser = Convert.ToString(dr["UpdatedUser"]);
                    commission.AgentType = Convert.ToInt32(dr["AgentType"]);
                    commission.Text_AgentType = Convert.ToString(dr["Text_AgentType"]);
                    commission.OriginCountrySNo = string.IsNullOrEmpty(dr["OriginCountrySNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["OriginCountrySNo"]);
                    commission.Text_OriginCountrySNo = dr["Text_OriginCountrySNo"].ToString();
                    commission.DestinationCountrySNo = string.IsNullOrEmpty(dr["DestinationCountrySNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["DestinationCountrySNo"]);
                    commission.Text_DestinationCountrySNo = dr["Text_DestinationCountrySNo"].ToString();
                    commission.OriginCitySNo = string.IsNullOrEmpty(dr["OriginCitySNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["OriginCitySNo"]);
                    commission.Text_OriginCitySNo = dr["Text_OriginCitySNo"].ToString();
                    commission.DestinationCitySNo = string.IsNullOrEmpty(dr["DestinationCitySNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["DestinationCitySNo"]);
                    commission.Text_DestinationCitySNo = dr["Text_DestinationCitySNo"].ToString();

                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return commission;
        }
        public List<string> DeleteCommission(List<string> RecordID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (RecordID.Count > 0)
                {
                    string RecordId = RecordID[0].ToString();
                    string UserId = RecordID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCommission", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Commission");
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
                }
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> SaveCommission(List<Commission> commissionList)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtcreateofficetarget = CollectionHelper.ConvertTo(commissionList, "Type,Text_Type,RefNo,Text_Agent,Text_OfficeSNo,Text_Account,Text_Unit,CustomerType,CommissionTypeText,Text_IncentiveType,ValidFromText,ValidToText,Active,IsDeleted,CreatedOn,UpdatedOn,CommissionTrans,Text_AirlineSNo,AgentType,Text_AgentType,Text_OriginCountrySNo,Text_DestinationCountrySNo,Text_OriginCitySNo,Text_DestinationCitySNo");
                DataTable dtcreatecommissiontrans = CollectionHelper.ConvertTo(commissionList[0].CommissionTrans, "Active");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Commission", dtcreateofficetarget, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommssionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtcreateofficetarget;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@CommissionTrans";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtcreatecommissiontrans;

                SqlParameter[] Parameters = { param, param1 };



                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCommissionRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Commission");
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
        public List<string> UpdateCommission(List<Commission> commissionList)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtcreateofficetarget = CollectionHelper.ConvertTo(commissionList, "Type,Text_Type,RefNo,Text_Agent,Text_OfficeSNo,Text_Account,Text_Unit,CustomerType,CommissionTypeText,Text_IncentiveType,ValidFromText,ValidToText,Active,IsDeleted,CreatedOn,UpdatedOn,CommissionTrans,Text_AirlineSNo,Active,AgentType,Text_AgentType,Text_OriginCountrySNo,Text_DestinationCountrySNo,Text_OriginCitySNo,Text_DestinationCitySNo");
                DataTable dtcreatecommissiontrans = CollectionHelper.ConvertTo(commissionList[0].CommissionTrans, "Active");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Commission", dtcreateofficetarget, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommssionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtcreateofficetarget;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@CommissionTrans";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtcreatecommissiontrans;


                SqlParameter[] Parameters = { param, param1 };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCommissionRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Commission");
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


        public KeyValuePair<string, List<CommissionTrans>> GetCommissionTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "CommissionTransSNo=" + recordID;
                CommissionTrans commissionTrans = new CommissionTrans();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCommissionTransRecord", Parameters);
                var commissionTransList = ds.Tables[0].AsEnumerable().Select(e => new CommissionTrans
                {
                    Sno = Convert.ToInt32(e["Sno"]),

                    CommissionTransSNo = Convert.ToInt32(e["CommissionTransSNo"]),
                    StartWeight = Convert.ToDecimal(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToDecimal(e["EndWeight"].ToString()),
                    Unit = Convert.ToInt32(e["Unit"].ToString()),
                    Commission = Convert.ToInt32(e["Commission"].ToString()),
                    // BasedON = (e["BasedONSNo"].ToString()),

                    Incentive = Convert.ToDecimal(e["Incentive"].ToString()),
                    ValidFrom = Convert.ToDateTime(e["validfrom_Text"]).ToString("MM-dd-yyyy"),
                    ValidTo = Convert.ToDateTime(e["validto_Text"]).ToString("MM-dd-yyyy")
                    //Active = Convert.ToString(e["Active"]),
                    //IsActive = Convert.ToBoolean(e["IsActive"])
            });
                return new KeyValuePair<string, List<CommissionTrans>>(ds.Tables[1].Rows[0][0].ToString(), commissionTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
    }
}
