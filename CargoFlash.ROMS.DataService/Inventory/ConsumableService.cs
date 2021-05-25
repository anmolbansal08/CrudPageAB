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
using CargoFlash.Cargo.Model.Inventory;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Inventory
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ConsumableService : SignatureAuthenticate, IConsumableService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Consumable>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListConsumables", Parameters);
                var ConsumableStockList = ds.Tables[0].AsEnumerable().Select(e => new Consumable
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Item = e["Item"].ToString().ToUpper(),
                    //   Text_BasisOfChargeSNo = e["Text_BasisOfChargeSNo"].ToString(),
                    Chargeable = e["Chargeable"].ToString(),
                    Numbered = e["Numbered"].ToString(),
                    Returnable = e["Returnable"].ToString(),

                    Text_Owner = e["Text_Owner"].ToString(),
                    Text_OwnerName = e["Text_OwnerName"].ToString().ToUpper(),
                    Text_Type = e["Text_Type"].ToString(),
                    Text_City = e["Text_City"].ToString(),
                    AllTareWeight = e["AllTareWeight"].ToString(),
                    AirportName=e["AirportName"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ConsumableStockList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
        public List<string> SaveConsumable(List<Consumable> Consumable)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateConsumable = CollectionHelper.ConvertTo(Consumable, "AirportName,Text_Type,Text_Item,Text_City,Text_Airport,Text_Owner,Text_OwnerName,Chargeable,Numbered,Returnable,Text_Office,AllTareWeight,InventoryBuild,InventoryLocation,InventoryWeighing");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Consumable", dtCreateConsumable, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ConsumableTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateConsumable;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveConsumable", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Consumable");
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
        public List<string> UpdateConsumable(List<Consumable> Consumable)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateConsumable = CollectionHelper.ConvertTo(Consumable, "AirportName,Text_Type,Text_Item,Text_City,Text_Airport,Text_Owner,Text_OwnerName,Chargeable,Numbered,Returnable,Text_Office,AllTareWeight,InventoryBuild,InventoryLocation,InventoryWeighing");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Consumable", dtCreateConsumable, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ConsumableTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateConsumable;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateConsumable", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Consumable");
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
        public List<string> DeleteConsumable(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteConsumable", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Consumable");
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
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
        public Consumable GetConsumableRecord(int recordID, string UserID)
        {
            Consumable consumable = new Consumable();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordConsumable", Parameters);
                if (dr.Read())
                {
                    consumable.Item = Convert.ToString(dr["ItemSno"]);
                   // consumable.ItemSno = Convert.ToInt32(dr["ItemSno"]);
                    consumable.Text_Item = Convert.ToString(dr["Item"]);
                   // consumable.Text_BasisOfChargeSNo = dr["Text_BasisOfChargeSNo"].ToString().ToUpper();
                   // consumable.BasisOfChargeSNo = Convert.ToInt32(dr["BasisOfChargeSNo"]);
                    consumable.Chargeable = dr["Chargeable"].ToString().ToUpper();
                    consumable.Numbered = dr["Numbered"].ToString().ToUpper() ;
                    consumable.Returnable =dr["Returnable"].ToString().ToUpper();
                    consumable.IsChargeable = Convert.ToBoolean(dr["IsChargeable"]);
                    consumable.IsNumbered = Convert.ToBoolean(dr["IsNumbered"]);
                    consumable.IsReturnable = Convert.ToBoolean(dr["IsReturnable"]);
                    consumable.TareWeight = Convert.ToDecimal(dr["TareWeight"]);
                    consumable.Type = Convert.ToBoolean(dr["Type"]);
                    consumable.Text_Type = dr["Text_Type"].ToString().ToUpper();
                    consumable.City=Convert.ToInt32(dr["CitySno"]);
                    consumable.Text_City = dr["Text_City"].ToString();
                    consumable.Airport = Convert.ToInt32(dr["AirportSno"]);
                    consumable.Text_Airport = dr["AirportName"].ToString();
                    consumable.Owner =Convert.ToInt32(dr["Owner"]);
                    consumable.Text_Owner = dr["Text_Owner"].ToString();
                    consumable.Text_OwnerName = dr["Text_OwnerSno"].ToString();
                    consumable.OwnerName = Convert.ToInt32(dr["OwnerSno"]);
                    consumable.Office = Convert.ToInt32(dr["OfficeSno"]);
                    consumable.Text_Office =dr["Text_OfficeSno"].ToString();
                    consumable.InventoryBuild = Convert.ToBoolean(dr["InventoryBuild"]) == false ? false : true;
                    consumable.InventoryLocation = Convert.ToBoolean(dr["InventoryLocation"]) == false ? false : true;
                    consumable.InventoryWeighing = Convert.ToBoolean(dr["InventoryWeighing"]) == false ? false : true;
                    consumable.InvenatoryUsage = Convert.ToString(dr["Text_InvenatoryUsage"]).ToUpper();
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return consumable;
        }


        public string Getofficelist(string OfficeSNo)
        {

            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", OfficeSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Getofficelist", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }



        public string GetAirportOfficeInformation(string CitySNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportOfficeInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
       
    }
}
