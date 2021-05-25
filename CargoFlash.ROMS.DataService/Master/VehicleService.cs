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
using CargoFlash.Cargo.DataService;
using System.IO;

namespace CargoFlash.Cargo.DataService.Master
{
    /// <summary>
    /// This is Vehicle Service Class.
    /// Created By : Jasmine Kaur Sethi
    /// Created On : 29 APR 2013
    /// Approved By : Manish Kumar
    /// </summary>
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class VehicleService : CargoFlash.Cargo.DataService.SignatureAuthenticate, IVehicleService
    {
        /// <summary>
        /// Get Vehicle record as per the recordid and UserID
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="RecordID"></param>
        /// /// <param name="UserID"></param>
        public Vehicle GetVehicleRecord(int recordID, string UserID)
        {
            Vehicle ba = new Vehicle();

            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordVehicle", Parameters);
            if (dr.Read())
            {
                DateTime? d = null;
                ba.SNo = Convert.ToInt32(dr["SNo"]);
                ba.ISOwner = dr["Owner"].ToString();
                ba.VehicleMakeSNo = dr["VehicleMakeSNo"].ToString();
                ba.Text_VehicleMakeSNo = dr["vehiclemake"].ToString();
                ba.VehiclePlateNo = dr["VehiclePlateNo"].ToString();
                ba.Capacity = Convert.ToInt64(dr["Capacity"]);
                ba.VehicleTypeSNo = dr["VehicleTypeSNo"].ToString();
                ba.Text_VehicleTypeSNo = dr["vehicletype"].ToString();
                ba.IsActive = Convert.ToBoolean(dr["IsActive"]);
                ba.Active = dr["Active"].ToString();
                ba.CitySNo = dr["CitySNo"].ToString();
                ba.Text_CitySNo = dr["CityCode"].ToString() + "-" + dr["CityName"].ToString();
                ba.CityCode = dr["CityCode"].ToString();
                ba.CityName = dr["CityName"].ToString();
                ba.CreatedUser = dr["CreatedUser"].ToString();
                ba.UpdatedUser = dr["UpdatedUser"].ToString();
                ba.ISOwnerType = Convert.ToInt32(dr["ISOwner"]);
                ba.ISOwnerTypeNo = Convert.ToInt32(dr["ISOwner"]);
                ba.ExpiryDate = Convert.IsDBNull(dr["ExpiryDate"]) ? d : Convert.ToDateTime(dr["ExpiryDate"]);
            }
            dr.Close();
            return ba;
        }




        /// <summary>
        /// Get grid data 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public DataSourceResult GetGridData(VehicleGridDataModel model, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            if (filter == null)
            {
                filter = new GridFilter();
                filter.Logic = "AND";
                filter.Filters = new List<GridFilter>();
            }
            // filter.Filters.Add(new GridFilter { Field = "CitySNo", Operator = "IN", Value =model.CitySNo });
            string filters = GridFilter.ProcessFilters<VehicleGridData>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListVehicle", Parameters);

            var VehicleList = ds.Tables[0].AsEnumerable().Select(e => new VehicleGridData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                Owner = e["Owner"].ToString(),
                VehicleType = e["vehicletype"].ToString(),
                vehiclemake = e["vehiclemake"].ToString(),
                // Capacity = Convert.ToInt64(e["Capacity"]),
                Capacity = e["Capacity"].ToString(),
                VehiclePlateNo = e["VehiclePlateNo"].ToString(),
                CityName = e["CityName"].ToString(),
                Active = e["Active"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = VehicleList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = "GetListVehicle"
            };
        }


        /// <summary>
        /// Get Capacity  
        /// Created On : 16 DEC 2016
        /// </summary>
        /// 

        public string GetCapacityTransvehicle(int VehicleTypeSNo, int VehicleMakeSNo)
        {
            SqlParameter[] Parameters = {new SqlParameter("@VehicleTypeSNo", VehicleTypeSNo),
                                         new SqlParameter("@VehicleMakeSNo", VehicleMakeSNo)};

            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCapacityTransvehicle", Parameters);
            ds.Dispose();
            //return Common.DStoJSON(ds);
            return CargoFlash.Cargo.Business.Common.DStoJSON(ds);
        }

        /// <summary>
        /// Trucking HHT Print  
        /// Created On : 16 DEC 2016
        /// </summary>
        /// 

        public Stream GetHHTTruckingPrint(string TruckSNo, string IsTruckingLoadPrint)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TruckSNo", TruckSNo), new SqlParameter("@IsTruckingLoadPrint", IsTruckingLoadPrint) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "HHT_TruckingPrint", Parameters);

                byte[] resultBytes = Encoding.UTF8.GetBytes(GetHHTTruckingHTML(ds, IsTruckingLoadPrint.ToLower().Trim()));
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultBytes);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetHHTTruckingHTML(DataSet ds, string IsTruckingLoadPrint)
        {
            try
            {
                StringBuilder tbl = new StringBuilder();

                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
                    tbl.Append("<tr align=\"center\">  <td colspan=\"13\" style=\"font: bold;'\" ><div><h2>" + "TRUCK MANIFEST" + "</h2></div> </td> <td colspan=\"3\"  style=\"width : 10%\" align=\"left\" >Date and Time:</td><td align=\"left\" colspan=\"4\" >" + ds.Tables[0].Rows[0]["LoadCreatedOn"].ToString() + "</td><td colspan=\"2\" >&nbsp;</td></tr> ");
                    tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" >&nbsp;</td></tr> ");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" >&nbsp;</td><td colspan=\"2\" align=\"left\"> Truck No. :</td><td colspan=\"6\" align=\"left\" >" + ds.Tables[0].Rows[0]["TruckNo"].ToString() + "</td><td colspan=\"2\" >&nbsp;</td><td colspan=\"3\"  >Driver ID:</td><td align=\"left\" colspan=\"4\" >" + ds.Tables[0].Rows[0]["DriverID"].ToString() + "</td><td colspan=\"2\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" >&nbsp;</td><td colspan=\"2\" align=\"left\"> Driver Name :</td><td colspan=\"6\" align=\"left\" >" + ds.Tables[0].Rows[0]["DriverName"].ToString() + "</td><td colspan=\"2\" >&nbsp;</td><td colspan=\"3\"  >Mobile No.:</td><td align=\"left\" colspan=\"4\" >" + ds.Tables[0].Rows[0]["DriverMobileNo"].ToString() + "</td><td colspan=\"2\" >&nbsp;</td></tr>");
                    tbl.Append("<tr  align=\"center\"><td colspan=\"2\" >&nbsp;</td><td style=\"border:solid 1px black\" colspan=\"8\" class=\"grdTableHeader\"> AWN No.</td><td style=\"border:solid 1px black\" colspan=\"1\" class=\"grdTableHeader\">AWB Pcs</td><td style=\"border:solid 1px black\" colspan=\"3\" class=\"grdTableHeader\">Loaded Pcs</td><td style=\"border:solid 1px black;width : 10%\"  colspan=\"3\" class=\"grdTableHeader\">Loaded Weight</td></tr>");
                    if (ds != null && ds.Tables[1].Rows.Count > 0)
                    {

                        DataTable dtDistinctAWB = null;
                        dtDistinctAWB = ds.Tables[1];
                        foreach (DataRow drDistinctULD in dtDistinctAWB.Rows)
                        {
                            int TotalPieces = 0;
                            int Loadedpieces = 0;
                            decimal Weight = 0.00M;
                            string AWBNo = "";
                            int SNo = 0;


                            DataRow[] drRpt = ds.Tables[1].Select("AWBNo='" + drDistinctULD["AWBNo"] + "'");

                            if (drRpt.Length > 0)
                            {
                                foreach (DataRow dr in drRpt)
                                {
                                    SNo = Convert.ToInt32(dr["SNo"].ToString());
                                    AWBNo = dr["AWBNo"].ToString();
                                    TotalPieces = (TotalPieces == 0 ? Convert.ToInt32(dr["TotalPieces"].ToString()) : TotalPieces + Convert.ToInt32(dr["TotalPieces"].ToString()));
                                    Loadedpieces = (Loadedpieces == 0 ? Convert.ToInt32(dr["Loadedpieces"].ToString()) : Convert.ToInt32(dr["Loadedpieces"].ToString()));
                                    Weight = (Weight == 0 ? Convert.ToDecimal(dr["TotalPieces"].ToString()) : Convert.ToDecimal(Weight));
                                }

                                tbl.Append("<tr align=\"center\" class=\"grdTableRow\"><td colspan=\"2\" >&nbsp;</td><td style=\"border:solid 1px black\" colspan=\"8\" >" + drDistinctULD["AWBNo"] + "</td><td style=\"border:solid 1px black\" colspan=\"1\" >" + drDistinctULD["TotalPieces"] + "</td><td style=\"border:solid 1px black\" colspan=\"3\" >" + drDistinctULD["Loadedpieces"] + "</td><td style=\"border:solid 1px; width:10% black\"  colspan=\"3\" >" + drDistinctULD["Weight"] + "</td></tr>");
                            }
                        }
                    }
                    tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" >&nbsp;</td></tr> ");
                    tbl.Append("<tr  class=\"grdTableRow\"><td colspan=\"5\" style=\"border-right: none;\"><b>Prepared by : </b></td><td colspan=\"2\" >&nbsp;</td><td colspan=\"11\" align=\"right\" style=\"border-left: none;\"><b>Page______________________ of Page _______________________________ </b></td></tr>");

                    tbl.Append("</table>");
                }


                return tbl.ToString();

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        /// <summary>
        /// Save Vehicle 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="Vehicle"></param>
        public List<string> SaveVehicle(List<VehicleRecords> Vehicle)
        {
            //validate Business Rule
            //  int returnValue = 0;

            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateVehicle = CollectionHelper.ConvertTo(Vehicle, "Text_VehicleTypeSNo,Text_VehicleMakeSNo,ISOwnerTypeNo");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Vehicle", dtCreateVehicle, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@VehicleTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateVehicle;


            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateVehicle", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Vehicle");
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

        /// <summary>
        /// Update Vehicle 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        ///<param name="Vehicle"></param>
        public List<string> UpdateVehicle(List<VehicleRecordstrans> Vehicle)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateVehicle = CollectionHelper.ConvertTo(Vehicle, "Text_VehicleTypeSNo,Text_VehicleMakeSNo,ISOwnerTypeNo");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Vehicle", dtCreateVehicle, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@VehicleTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateVehicle;

            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateVehicle", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Vehicle");
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

        /// <summary>
        /// Delete Vehicle 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="RecordID"></param>
        public List<string> DeleteVehicle(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteVehicle", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Vehicle");
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
    }
}