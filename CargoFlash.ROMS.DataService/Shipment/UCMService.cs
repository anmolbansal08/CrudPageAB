

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Runtime.Serialization;
using CargoFlash.Cargo.Model.Shipment;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UCMService : SignatureAuthenticate, IUCMService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<UCM>(filter);


                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                                 new  SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                   new  SqlParameter("@AirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString())
        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetGridUCMList", Parameters);
                var UCMList = ds.Tables[0].AsEnumerable().Select(e => new UCM
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString().ToUpper(),
                    // FlightDate = DateTime.Parse(e["FlightDate"].ToString().ToUpper()),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    Text_FlightNo = e["Text_FlightNo"].ToString().ToUpper(),
                    Text_UCMType = e["Text_UCMType"].ToString().ToUpper(),
                    Auto = e["Auto"].ToString().ToUpper(),
                    IsNillUCM = e["IsNillUCM"].ToString().ToUpper(),
                    Station = e["Station"].ToString().ToUpper(),
                    FlightRoute = e["FlightRoute"].ToString().ToUpper(),
                    CityCode = e["CityCode"].ToString(),
                    Createdat = e["Createdat"].ToString(),
                    CreatedBy = e["CreatedBy"].ToString(),
                    ProcessBy = e["ProcessBy"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = UCMList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public int SaveUCM(string SitaAddress, string EmailAddress, string SCMMessage, string FlightNo, string FlightDate, string origincity)
        {
            try
            {
                SqlParameter param = new SqlParameter();

                SqlParameter[] Parameters = { new SqlParameter("@SitaAddress", SitaAddress), new SqlParameter("@EmailAddress", EmailAddress), new SqlParameter("@UCMMessage", SCMMessage),
                                        new SqlParameter("@FlightNo", FlightNo),
                                        new SqlParameter("@FlightDate", FlightDate),
                                        new SqlParameter("@origincity", origincity)
                                        };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveUCM", Parameters);
                return ret;
            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GenerateANDSaveCIMPMessage(string FlightDate, string FlightNo, string UCMType, string SI1, string SI2)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@MessageType", UCMType), new SqlParameter("@SI1", SI1), new SqlParameter("@SI2", SI2), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString())                                            
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "InsertUCMSupplement", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)// (Exception)
            {

            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        public string GetUCMDetailRecord(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", 0), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@UCMType", UCMType), new SqlParameter("@origincity", origincity) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUCMRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUCM(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity, List<UCMDetail> dataDetails, List<UCMDetailTrans> data1)
        {
            try
            {
                int ret = 0;
                DataTable dtUCMDetailTemp = CollectionHelper.ConvertTo(dataDetails, "");
                DataTable dtUCMDetailTransTemp = CollectionHelper.ConvertTo(data1, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();

                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@AirlineSNo", AirlineSNo),
                                        new SqlParameter("@FlightDate",FlightDate),
                                        new SqlParameter("@FlightNo", FlightNo),
                                        new SqlParameter("@UCMType",UCMType),
                                        new SqlParameter("@origincity",origincity),
                                        //new SqlParameter("@UCMType",dtUCMDetailTemp),
                                        //new SqlParameter("@origincity",dtUCMDetailTransTemp),
                                           new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        new SqlParameter("@UCMDetail",SqlDbType.Structured){Value=dtUCMDetailTemp},
                                        new SqlParameter("@UCMDetailTrans",SqlDbType.Structured){Value=dtUCMDetailTransTemp}
                                        };

                string procname = string.Empty;
                procname = "createUCM";

                var rect = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, procname, Parameters);

                ret = rect == null ? 0 : Convert.ToInt32(rect);

                ErrorMessage.Add(Convert.ToString(ret));

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UCM");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }


        public string GetUCMPallet(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", 0), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@UCMType", UCMType), new SqlParameter("@origincity", origincity) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUCMPallet", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public List<string> CheckULDNo(string ULDType, string Serial, string Owner, string UCMtype, string FlightNo, string flightdate, string origincity)
        {
            try
            {
                int ret = 0;

                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@ULDType", ULDType),
                                        new SqlParameter("@Serial",Serial),
                                        new SqlParameter("@Owner", Owner),
                                        new SqlParameter("@UCMtype", UCMtype),
                                        new SqlParameter("@FlightNo", FlightNo),
                                        new SqlParameter("@flightdate", flightdate),
                                        new SqlParameter("@origincity", origincity)
                                        };

                string procname = string.Empty;

                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckULDExists", Parameters);
                ErrorMessage.Add(Convert.ToString(ret));

                if (ret > 0)
                {
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }

                return ErrorMessage;
            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



        public List<string> createUCMPallet(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity, string ULDType, string SerialNo, string OwnerCode, string Destination, int ContentType = 0)
        {
            try
            {
                int ret = 0;
                //DataTable dtUCMDetailTemp = CollectionHelper.ConvertTo(dataDetails, "");

                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@AirlineSNo", AirlineSNo),
                                        new SqlParameter("@FlightDate",FlightDate),
                                        new SqlParameter("@FlightNo", FlightNo),
                                        new SqlParameter("@UCMType",UCMType),
                                        new SqlParameter("@origincity",origincity), 
                                       new SqlParameter("@ULDType",ULDType), 
                                       new SqlParameter("@SerialNo",SerialNo), 
                                       new SqlParameter("@OwnerCode",OwnerCode), 
                                       new SqlParameter("@Destination",Destination), 
                                       new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),//,
                                       new SqlParameter("@ContentType",ContentType)
                                          //new SqlParameter("@UCMDetail",SqlDbType.Structured){Value=dtUCMDetailTemp}
                                        
                                        };

                string procname = string.Empty;

                if (UCMType == "0")
                {
                    procname = "createUCMPalletUCMOut";
                }
                else
                {
                    procname = "createUCMPalletUCMIn";

                }

                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, procname, Parameters);

                ErrorMessage.Add(Convert.ToString(ret));

                if (ret > 0)
                {
                    if (ret == 1005)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UCM");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }

                    else if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UCM");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public UCM GetUCMRecord(string recordID, string UserID, string Text_UCMType)
        {
            try
            {
                UCM ucm = new UCM();
                SqlDataReader dr = null;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUCMDetail", Parameters);
                if (dr.Read())
                {
                    ucm.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    ucm.Text_AirlineSNo = dr["AirlineName"].ToString().ToUpper();
                    ucm.FlightDate = Convert.ToDateTime(dr["FlightDate"]);
                    ucm.FlightNo = dr["FlightNo"].ToString().ToUpper();
                    ucm.Text_FlightNo = dr["FlightNo"].ToString().ToUpper();

                    //  ucm.Text_UCMType = dr["UCM"].ToString();
                    ucm.Text_UCMType = Text_UCMType;
                    ucm.UCMType = Convert.ToInt32(dr["UCMType"]);
                    ucm.Text_CarrierCode = dr["CarrierCode"].ToString();
                    ucm.MessageType = "S";
                    ucm.Text_MessageType = "S";
                    ucm.CityCode = dr["CityCode"].ToString();
                }
                dr.Close();
                return ucm;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }

            //finally 
            //{

            //}

        }

        public List<string> DeleteUCM(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@UCMSNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteUCM", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UCM");
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
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateUCM(string SNo, string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity, List<UCMDetail> dataDetails, List<UCMDetailTrans> data1)
        {
            try
            {
                int ret = 0;
                //int sno = Convert.ToInt32(SNo);
                //int ASNO = Convert.ToInt32(AirlineSNo);


                DataTable dtUCMDetailTemp = CollectionHelper.ConvertTo(dataDetails, "");
                DataTable dtUCMDetailTransTemp = CollectionHelper.ConvertTo(data1, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                        new SqlParameter("@SNo", SNo),   
                                        new SqlParameter("@AirlineSNo", AirlineSNo),
                                        new SqlParameter("@FlightDate",FlightDate),
                                        new SqlParameter("@FlightNo", FlightNo),
                                        new SqlParameter("@UCMType",UCMType),
                                        new SqlParameter("@origincity",origincity),  
                                         new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        new SqlParameter("@UCMDetail",SqlDbType.Structured){Value=dtUCMDetailTemp},
                                        new SqlParameter("@UCMDetailTrans",SqlDbType.Structured){Value=dtUCMDetailTransTemp}
                                    };

                // DataSet ds = (DataSet)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateUCM", Parameters);
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateUCM", Parameters);


                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UCM");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<UCMDetail>> GetUCMSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                whereCondition = "UCMAmendmentSNo=" + recordID;
                UCMDetail alertEvents = new UCMDetail();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUCMSlabRecord", Parameters);
                var UCMSlabList = ds.Tables[0].AsEnumerable().Select(e => new UCMDetail
                {
                    SNo = e["SNo"].ToString(),
                    ULDName = e["ULDName"].ToString(),
                    ContentType = e["ContentType"].ToString(),
                    DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                });
                return new KeyValuePair<string, List<UCMDetail>>("SNo", UCMSlabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string GetRecipientEmail(string AirlineSNo, string UCMType)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo),
                                            new SqlParameter("@UCMType", UCMType)
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUCMRecipientEmail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }


        public KeyValuePair<string, List<UCMDetailTrans>> GetUCMattachdSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "UCMAmendmentSNo=" + recordID;
                UCMDetailTrans alertEvents = new UCMDetailTrans();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUCMattachdSlabRecord", Parameters);
                var UCMattachedSlabList = ds.Tables[0].AsEnumerable().Select(e => new UCMDetailTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    HdnULDName = e["HdnULDName"].ToString(),
                    ULDName = e["ULDName"].ToString(),
                    BUPType = e["BUPType"].ToString(),
                    HdnBasePallet = e["HdnBasePallet"].ToString(),
                    BasePallet = e["BasePallet"].ToString().ToUpper(),
                    ContentType = e["ContentType"].ToString(),
                    HdnEULDType = "",
                    EULDType = "",
                    ESerialNo = "",
                    EOwnerCode = ""

                });
                return new KeyValuePair<string, List<UCMDetailTrans>>("SNo", UCMattachedSlabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public List<string> DeleteUCMSlabRecord(string RecordID)
        {

            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();


                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)) ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
            };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteUCMSlabRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UCM");
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
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public List<string> DeleteUCMattachdRecord(string RecordID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();


                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteUCMattachdRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UCM");
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
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }

        }

        public List<string> CreateOwnerCode(string NewOwnerCode, string AirlineSno)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();

                SqlParameter[] Parameters = {  
                                                new SqlParameter("@CarrierCode", NewOwnerCode),
                                                new SqlParameter("@airlinesno", AirlineSno)
               };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateOwnerCode", Parameters);

                ErrorMessage.Add(ret.ToString());

                if (ret > 0)
                {

                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "UCM");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }

                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<UCMDetail>> GetUCMDefaultOutInRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                string[] SpCondition = whereCondition.Split(new[] { "NAYAK" }, StringSplitOptions.None);
                SqlParameter[] Parameters = { new SqlParameter("@UcmType", SpCondition[0]), new SqlParameter("@FlightNo", SpCondition[1])
                        , new SqlParameter("@FlightDate",  SpCondition[2]), new SqlParameter("@CarrierCode",  SpCondition[3]) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUCMDefaultOutInRecord", Parameters);
                var UCMSlabList = ds.Tables[0].AsEnumerable().Select(e => new UCMDetail
                {
                    SNo = e["SNo"].ToString(),
                    ULDName = e["ULDName"].ToString(),
                    ContentType = e["ContentType"].ToString(),
                    DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                });
                return new KeyValuePair<string, List<UCMDetail>>("SNo", UCMSlabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

    }
}
