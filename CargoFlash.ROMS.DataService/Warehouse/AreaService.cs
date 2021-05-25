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
using CargoFlash.Cargo.Model.Warehouse;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AreaService : SignatureAuthenticate, IAreaService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public Area GetAreaRecord(string recordID, string UserID)
        {
            Area area = new Area();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordArea", Parameters);
                if (dr.Read())
                {

                    area.SNo = Convert.ToInt32(dr["SNo"]);
                    area.AreaName = dr["AreaName"].ToString().ToUpper();
                    area.ColorSNo = dr["ColorSNo"].ToString();
                    area.ColorCode = dr["ColorSNo"].ToString();
                    area.Text_ColorCode = dr["ColorCode"].ToString().ToUpper();
                    area.IsStorable = Convert.ToBoolean(dr["IsStorable"]);
                    area.Storable = dr["Storable"].ToString().ToUpper();
                    //if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    //{
                    //    area.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    //    area.Active = dr["Active"].ToString().ToUpper();
                    //}
                    //area.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    //area.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            dr.Close();
            return area;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Area>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListArea", Parameters);
                var AreaList = ds.Tables[0].AsEnumerable().Select(e => new Area
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AreaName = e["AreaName"].ToString().ToUpper(),
                    ColorCode = e["ColorCode"].ToString().ToUpper(),
                    IsStorable = Convert.ToBoolean(e["IsStorable"].ToString().ToUpper()),
                    Storable = e["Storable"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedBy"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AreaList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> SaveArea(List<Area> Area)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateArea = CollectionHelper.ConvertTo(Area, "UpdatedOn,CreatedOn,Text_ColorCode,Storable");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Area", dtCreateArea, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AreaTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateArea;

                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateArea", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Area");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> UpdateArea(List<Area> Area)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateArea = CollectionHelper.ConvertTo(Area, "UpdatedOn,CreatedOn,Text_ColorCode,Storable");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Area", dtCreateArea, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AreaTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateArea;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateArea", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Area");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteArea(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteArea", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Area");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }
    }
}
