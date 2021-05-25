using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Warehouse;
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
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class WarehousePlanningService : SignatureAuthenticate, IWarehousePlanningService
    {
        public WarehousePlanning GetPanningMatrix(string recordID, string subLocationTypeSNo)
        {
            WarehousePlanning obj = new WarehousePlanning();

            DataSet ds = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@WarehouseSNo", recordID),
                                              new SqlParameter("@SubLocationTypeSNo",subLocationTypeSNo)
                };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_GetMatrix", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    DataRow drwh = ds.Tables[0].Rows[0];

                    obj.SNo = Convert.ToInt32(drwh["Sno"]);
                    obj.AirPortName = drwh["AirportName"].ToString();
                    obj.WarehouseCode = drwh["WarehouseCode"].ToString();
                    obj.WarehouseName = drwh["WarehouseName"].ToString();
                    obj.WHRowCount = drwh["WHRowCount"].ToString();
                    obj.WHColumnCount = drwh["WHColumnCount"].ToString();
                    obj.TotalArea = drwh["TotalArea"].ToString();
                    obj.CellArea = drwh["CellArea"].ToString();
                    obj.CityName = drwh["CityName"].ToString();
                    obj.AirportSNo = drwh["AirportSNo"].ToString();

                    obj.WarehousePlanningMatrix = ds.Tables[1].AsEnumerable().Select(e => new WarehousePlanningMatrix
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        WHColumnNo = e["WHColumnNo"].ToString(),
                        WHRowNo = e["WHRowNo"].ToString(),
                        WHAreaSNo = e["WHAreaSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["WHAreaSNo"]),
                        ColorCode = e["ColorCode"].ToString(),
                        AreaName = e["AreaName"].ToString(),
                        SubAreaSNo = e["SubAreaSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["SubAreaSNo"]),
                        SubColorCode = e["SubColorCode"].ToString(),
                        SubAreaName = e["SubAreaName"].ToString().ToUpper(),
                        IsStorable = e["IsStorable"] == DBNull.Value ? 1 : Convert.ToInt32(e["IsStorable"])
                    }).ToList();

                }

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return obj;
        }


        public string SaveArea(WarehousePlanningMatrix obj)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@WHMatrixSNo", obj.WHColumnNo), new SqlParameter("@WHAreaSNo", obj.SNo),
                                                  new SqlParameter("@IsStorable",SqlDbType.Int){Direction=ParameterDirection.Output}
                                            };
                var res = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_SetArea", Parameters);
                string IsStorable = Convert.ToString(Parameters[Parameters.Length - 1].Value);
                return IsStorable;
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }

        }

        public string FindLocation(WarehousePlanningSearch obj)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TerminalSNo", obj.Terminal),
                                                    new SqlParameter("@AirlineSNo", obj.Airline),
                                                    new SqlParameter("@SHCSNo", obj.SHC),
                                                    new SqlParameter("@DestinationCountrySNo", obj.DestCountry),
                                                    new SqlParameter("@DestinationCitySNo", obj.DestCity),
                                                    new SqlParameter("@AccountSNo", obj.AgentForwarder),
                                                     new SqlParameter("@LocationTypeSNo", obj.Location),
                                                    new SqlParameter("@SearchBy", obj.SubLocation),
                                                    new SqlParameter("@SearchText", obj.SubAreaName),
                                                    new SqlParameter("@WarehouseSNo",obj.WarehouseSNo)

                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_LocationSearch_MapArea", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    return ds.Tables[0].Rows[0]["SubAreaSNo"].ToString().TrimEnd(',');
                }
                return "";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string FindNameLocation(WarehousePlanningSearch obj)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TerminalSNo", obj.Terminal),
                                                    new SqlParameter("@AirlineSNo", obj.Airline),
                                                    new SqlParameter("@SHCSNo", obj.SHC),
                                                    new SqlParameter("@DestinationCountrySNo", obj.DestCountry),
                                                    new SqlParameter("@DestinationCitySNo", obj.DestCity),
                                                    new SqlParameter("@AccountSNo", obj.AgentForwarder),
                                                     new SqlParameter("@LocationTypeSNo", obj.Location),
                                                    new SqlParameter("@SearchBy", obj.SubLocation),
                                                    new SqlParameter("@SearchText", obj.SubAreaName),
                                                    new SqlParameter("@WarehouseSNo",obj.WarehouseSNo)

                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_CreateLocationSearch_MapArea", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    return ds.Tables[0].Rows[0]["SubAreaSNo"].ToString().TrimEnd(',');
                }
                return "";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public KeyValuePair<string, List<WarehousePlanningSearchResultbtn>> SearchData(string recid, int pageNo, int pageSize, LocationSearch model, string sort)
        {
            try
            {
                LocationSearch locationsearch = new LocationSearch();
                List<WarehousePlanningSearchResultbtn> lst = new List<WarehousePlanningSearchResultbtn>();

                SqlParameter[] Parameters = {
                                          new SqlParameter("@PageNo", pageNo),
                                          new SqlParameter("@PageSize", pageSize),
                                          new SqlParameter("@OrderBy", sort),
                                          new SqlParameter("@WHSetupSNo",model.WHSetupSNo),
                                          new SqlParameter("@TerminalSNo",model.TerminalSNo),
                                          new SqlParameter("@AirlineSNo",model.AirlineSNo),
                                          new SqlParameter("@SPHCSNo", model.SPHCSNo),
                                          new SqlParameter("@DestinationCountrySNo",model.DestinationCountrySNo),
                                          new SqlParameter("@DestinationCitySNo",model.DestinationCitySNo),
                                          new SqlParameter("@AccountSno",model.AccountSno),
                                          new SqlParameter("@WHTypeSNo", model.WHTypeSNo),
                                          new SqlParameter("@SearchBy", model.SearchBy),
                                          new SqlParameter("@SearchText", model.SearchText),
                                          new SqlParameter("@AWBNo", model.AWBNo),
                                          new SqlParameter("@ULDNo", model.ULDNo) , 
                                          new SqlParameter("@ConsumablesName", model.ConsumablesName),
                                          new SqlParameter("@LocationName", model.LocationName),
                                          new SqlParameter("@SearchAction", model.SearchAction),
                                          new SqlParameter("@OriginCitySNo", model.OriginCitySNo),
                                          new SqlParameter("@DestAsLocation", model.DestAsLocation),
                                          new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                        };

                //SqlParameter[] Parameters = { new SqlParameter("@TerminalSNo", obj.Terminal),
                //                                    new SqlParameter("@AirlineSNo", obj.Airline),
                //                                    new SqlParameter("@SHCSNo", obj.SHC),
                //                                    new SqlParameter("@DestinationCountrySNo", obj.DestCountry),
                //                                    new SqlParameter("@DestinationCitySNo", obj.DestCity),
                //                                    new SqlParameter("@AccountSNo", obj.AgentForwarder),
                //                                     new SqlParameter("@LocationTypeSNo", obj.Location),
                //                                    new SqlParameter("@SearchBy", obj.SubLocation),
                //                                    new SqlParameter("@SearchText", obj.SubAreaName),
                //                                    new SqlParameter("@WarehouseSNo", obj.WarehouseSNo),
                //                                    new SqlParameter("@AirportSNo", obj.AirportSNo)
                //                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWh_LocationSearch", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new WarehousePlanningSearchResultbtn
                    {
                        SNo = e["SNo"].ToString(),
                        AWBNo = e["AWBNo"].ToString(),
                        LocationName = e["LocationName"].ToString(),
                        SPHC = e["SPHCCode"].ToString(),
                        CountryName = e["CountryName"].ToString(),
                        CityName = e["CityName"].ToString(),
                        TerminalName = e["TerminalName"].ToString(),
                        AgentName = e["AgentName"].ToString(),
                        AirlineName = e["AirlineName"].ToString(),
                        ULDNo = e["ULDNo"].ToString(),
                        Show = "S",
                        pieceno = e["pieceno"].ToString(),
                        AWBSNo = e["AWBSNo"].ToString(),
                        ConsumablesName = e["ConsumablesName"].ToString(),
                        WhLevel = e["WHLevel"].ToString(),
                        WHSetupSNo = e["WHSetupSNo"].ToString(),
                        IsImport = e["IsImport"].ToString(),
                        ConsumableSNo = e["ConsumableSNo"].ToString(),
                        SLISNo = e["SLISNo"].ToString(),
                        WHSubAreaSNo = e["WHSubAreaSNo"].ToString()

                    }).ToList();

                string rowcount = "0";
                if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                    rowcount = ds.Tables[1].Rows[0][0].ToString();

                return new KeyValuePair<string, List<WarehousePlanningSearchResultbtn>>(rowcount, lst.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public List<WarehousePlanningSearchResultbtn> PendingLocationSearchData(WarehousePlanningSearch obj)
        {
            try
            {
                List<WarehousePlanningSearchResultbtn> lst = new List<WarehousePlanningSearchResultbtn>();

                SqlParameter[] Parameters = { new SqlParameter("@TerminalSNo", obj.Terminal),
                                                    new SqlParameter("@AirlineSNo", obj.Airline),
                                                    new SqlParameter("@SHCSNo", obj.SHC),
                                                    new SqlParameter("@DestinationCountrySNo", obj.DestCountry),
                                                    new SqlParameter("@DestinationCitySNo", obj.DestCity),
                                                    new SqlParameter("@AccountSNo", obj.AgentForwarder),
                                                     new SqlParameter("@LocationTypeSNo", obj.Location),
                                                    new SqlParameter("@SearchBy", obj.SubLocation),
                                                    new SqlParameter("@SearchText", obj.SubAreaName),
                                                    new SqlParameter("@WarehouseSNo", obj.WarehouseSNo),
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_PendingLocationSearch", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new WarehousePlanningSearchResultbtn
                    {
                        SNo = e["SNo"].ToString(),
                        AWBNo = e["AWBNo"].ToString(),
                        LocationName = e["LocationName"].ToString(),
                        SPHC = e["SPHC"].ToString(),
                        CountryName = e["CountryName"].ToString(),
                        CityName = e["CityName"].ToString(),
                        TerminalName = e["TerminalName"].ToString(),
                        AgentName = e["AgentName"].ToString(),
                        AirlineName = e["AirlineName"].ToString(),
                        ULDNo = e["ULDNo"].ToString(),
                        Show = "A",
                        pieceno = e["pieceno"].ToString(),
                        AWBSNo = e["AWBSNo"].ToString(),
                        ConsumablesName = e["ConsumablesName"].ToString(),
                        // WhLevel = e["WHLevel"].ToString(),
                        WHSetupSNo = e["WHSetupSNo"].ToString(),
                        IsImport = e["IsImport"].ToString(),
                        ConsumableSNo = e["ConsumableSNo"].ToString(),
                        SLISNo = e["SLISNo"].ToString()
                    }).ToList();
                return lst;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public List<WarehousePlanningSearchResultbtn> CreateLocationSearchData(WarehousePlanningSearch obj)
        {
            try
            {
                List<WarehousePlanningSearchResultbtn> lst = new List<WarehousePlanningSearchResultbtn>();

                SqlParameter[] Parameters = { new SqlParameter("@TerminalSNo", obj.Terminal),
                                                    new SqlParameter("@AirlineSNo", obj.Airline),
                                                    new SqlParameter("@SHCSNo", obj.SHC),
                                                    new SqlParameter("@DestinationCountrySNo", obj.DestCountry),
                                                    new SqlParameter("@DestinationCitySNo", obj.DestCity),
                                                    new SqlParameter("@AccountSNo", obj.AgentForwarder),
                                                     new SqlParameter("@LocationTypeSNo", obj.Location),
                                                    new SqlParameter("@SearchBy", obj.SubLocation),
                                                    new SqlParameter("@SearchText", obj.SubAreaName),
                                                    new SqlParameter("@WarehouseSNo", obj.WarehouseSNo),
                                                    new SqlParameter("@AirportSNo", obj.AirportSNo)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_CreateLocationSearch", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new WarehousePlanningSearchResultbtn
                    {
                        SNo = e["SNo"].ToString(),
                        LocationName = e["LocationName"].ToString(),
                        SPHC = e["SPHCCode"].ToString(),
                        CountryName = e["CountryName"].ToString(),
                        CityName = e["CityName"].ToString(),
                        TerminalName = e["TerminalName"].ToString(),
                        AgentName = e["AgentName"].ToString(),
                        AirlineName = e["AirlineName"].ToString(),
                        LocationType = e["LocationType"].ToString(),
                        WhLevel = e["WHLevel"].ToString(),
                        WHSetupSNo = e["WHSetupSNo"].ToString()

                    }).ToList();
                return lst;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string SaveLocation(WarehousePlanningLocation obj)
        {
            try
            {

                DataTable dtRoom = GetRoomTable(obj.SubLocationName, obj.LocationList);
                DataTable dtFloor = GetFloorTable(obj.SubLocationName, obj.LocationList);
                DataTable dtDolly = GetDollyTable(obj.SubLocationName, obj.LocationList);
                DataTable dtRack = GetRackTable(obj.SubLocationName, obj.LocationList);
                DataTable dtCages = GetCagesTable(obj.SubLocationName, obj.LocationList);

                SqlParameter[] Parameters = { new SqlParameter("@WhMatrixSNo", obj.WHMatrixSNo),
                                              new SqlParameter("@WHSubLocationTypeSNo", obj.SubLocation),
                                              new SqlParameter("@WHSubAreaName", obj.SubAreaName),
                                              new SqlParameter("@IsFixed", obj.FixedMovable),
                                              new SqlParameter("@ColorCode", obj.ColorCode.Split('-')[1]),
                                              new SqlParameter("@ColorSNo", obj.ColorSNo),
                                              new SqlParameter("@WhSubAreaLocationTypeSNo", obj.Location),
                                              new SqlParameter("@WhSubAreaDestCountrySNo", obj.DestCountry),
                                              new SqlParameter("@WhSubAreaDestCitySNo", obj.DestCity),
                                              new SqlParameter("@WhSubAreaTerminalSNo", obj.Terminal),
                                              new SqlParameter("@WhSubAreaAirlineSNo", obj.Airline),
                                              new SqlParameter("@WhSubAreaSHCSNo", obj.SHC),
                                              new SqlParameter("@WhSubAreaAgentSNo", obj.AgentForwarder),
                                              new SqlParameter("@WhRack", dtRack){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@WhFloor", dtFloor){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@WhDolly", dtDolly){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@WhRoom", dtRoom){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@WhCages", dtCages){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@IsStorable", obj.Storable),
                                              new SqlParameter("@WHSubAreaSNo",SqlDbType.Int){Direction=ParameterDirection.Output}

                                            };
                var res = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_CreateSubArea", Parameters);
                string WhSubAreaSNo = Convert.ToString(Parameters[Parameters.Length - 1].Value);
                return WhSubAreaSNo;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }
        public string UpdateLocation(WarehousePlanningLocation obj)
        {
            try
            {

                DataTable dtRoom = GetRoomTable(obj.SubLocationName, obj.LocationList);
                DataTable dtFloor = GetFloorTable(obj.SubLocationName, obj.LocationList);
                DataTable dtDolly = GetDollyTable(obj.SubLocationName, obj.LocationList);
                DataTable dtRack = GetRackTable(obj.SubLocationName, obj.LocationList);
                DataTable dtCages = GetCagesTable(obj.SubLocationName, obj.LocationList);

                SqlParameter[] Parameters = { new SqlParameter("@WhMatrixSNo", obj.WHMatrixSNo),
                                              new SqlParameter("@WHSubLocationTypeSNo", obj.SubLocation),
                                              new SqlParameter("@WHSubAreaName", obj.SubAreaName),
                                              new SqlParameter("@IsFixed", obj.FixedMovable),
                                              new SqlParameter("@ColorCode", obj.ColorCode.Split('-')[1]),
                                              new SqlParameter("@ColorSNo", obj.ColorSNo),
                                              new SqlParameter("@WhSubAreaLocationTypeSNo", obj.Location),
                                              new SqlParameter("@WhSubAreaDestCountrySNo", obj.DestCountry),
                                              new SqlParameter("@WhSubAreaDestCitySNo", obj.DestCity),
                                              new SqlParameter("@WhSubAreaTerminalSNo", obj.Terminal),
                                              new SqlParameter("@WhSubAreaAirlineSNo", obj.Airline),
                                              new SqlParameter("@WhSubAreaSHCSNo", obj.SHC),
                                              new SqlParameter("@WhSubAreaAgentSNo", obj.AgentForwarder),
                                              new SqlParameter("@WhRack", dtRack){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@WhFloor", dtFloor){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@WhDolly", dtDolly){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@WhRoom", dtRoom){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@WhCages", dtCages){SqlDbType=SqlDbType.Structured},
                                              new SqlParameter("@IsStorable", obj.Storable),
                                              new SqlParameter("@WHSubAreaSNo",SqlDbType.Int){Direction=ParameterDirection.Output}

                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_UpdateSubArea", Parameters);
                string WhSubAreaSNo = Convert.ToString(Parameters[Parameters.Length - 1].Value);
                return WhSubAreaSNo;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string DeleteSubArea(WarehousePlanningLocation obj)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@WhMatrixSNo", obj.WHMatrixSNo),
                                                new SqlParameter("@ErrorMessage",SqlDbType.VarChar) { Size=250, Direction=ParameterDirection.Output} };
                var res = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_DeleteSubArea", Parameters);
                if (!string.IsNullOrEmpty(Parameters[Parameters.Length - 1].Value.ToString()))
                {
                    return Parameters[Parameters.Length - 1].Value.ToString();
                }
                return "";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string DeleteArea(WarehousePlanningLocation obj)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@WhMatrixSNo", obj.WHMatrixSNo),
                                                new SqlParameter("@ErrorMessage",SqlDbType.VarChar) { Size=250, Direction=ParameterDirection.Output} };
                var res = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_DeleteArea", Parameters);
                if (!string.IsNullOrEmpty(Parameters[Parameters.Length - 1].Value.ToString()))
                {
                    return Parameters[Parameters.Length - 1].Value.ToString();
                }
                return "";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public WarehousePlanningLocation GetSubAreaData(WarehousePlanningMatrix obj)
        {
            WarehousePlanningLocation ob = new WarehousePlanningLocation();
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@WHMatrixSNo", obj.WHColumnNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_GetSubArea", Parameters);
                DataRow drwh = ds.Tables[0].Rows[0];
                ob.SNo = drwh["SNo"].ToString();
                ob.Terminal = drwh["WHSubAreaTerminalSNo"].ToString().TrimEnd(',');
                ob.Text_Terminal = drwh["WHSubAreaTerminalValue"].ToString().ToUpper().TrimEnd(',');
                ob.Airline = drwh["WHSubAreaAirlineSNo"].ToString().TrimEnd(',');
                ob.Text_Airline = drwh["WHSubAreaAirlineValue"].ToString().TrimEnd(',');
                ob.SHC = drwh["WHSubAreaSHCSNo"].ToString().TrimEnd(',');
                ob.Text_SHC = drwh["WHSubAreaSHCValue"].ToString().TrimEnd(',');
                ob.DestCountry = drwh["WHSubAreaDestinationCountrySNo"].ToString().TrimEnd(',');
                ob.Text_DestCountry = drwh["WHSubAreaDestinationCountryValue"].ToString().ToUpper().TrimEnd(',');
                ob.DestCity = drwh["WHSubAreaDestinationCitySNo"].ToString().TrimEnd(',');
                ob.Text_DestCity = drwh["WHSubAreaDestinationCityValue"].ToString().ToUpper().TrimEnd(',');
                ob.AgentForwarder = drwh["WHSubAreaAgentSNo"].ToString().TrimEnd(',');
                ob.Text_AgentForwarder = drwh["WHSubAreaAgentValue"].ToString().ToUpper().TrimEnd(',');
                ob.Location = drwh["WHSubAreaLocationTypeSNo"].ToString().TrimEnd(',');
                ob.Text_Location = drwh["WHSubAreaLocationTypeValue"].ToString().TrimEnd(',');
                ob.SubLocation = drwh["WHSubLocationTypeSNo"].ToString();
                ob.Text_SubLocation = drwh["SubLocationType"].ToString().TrimEnd(',');
                ob.SubAreaName = drwh["SubAreaName"].ToString();
                ob.ColorSNo = drwh["ColorSNo"].ToString();
                ob.ColorCode = drwh["ColorCode"].ToString();
                ob.FixedMovable = drwh["IsFixed"].ToString();
                ob.Storable = drwh["IsStorable"].ToString();
                ob.LocationName = drwh["LocationName"].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

            return ob;
        }

        public KeyValuePair<string, List<WarehousePlanningLocationList>> GetRoomRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            WarehousePlanningLocationList tariffSlab = new WarehousePlanningLocationList();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@SubAreaSNo", recordID)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_GetSubAreaGrid", Parameters);
            var obj = ds.Tables[4].AsEnumerable().Select(e => new WarehousePlanningLocationList
            {
                SNo = e["SNo"].ToString(),
                RoomNumber = e["RoomNo"].ToString(),
                Name = e["RoomName"].ToString(),
                TempControlled = Convert.ToInt16(e["IsTemperatureControlled"]),
                StartTemperature = Convert.ToDouble(e["StartTemperature"]),
                EndTemperature = Convert.ToDouble(e["EndTemperature"]),
                GrossWt = e["GrossCapacity"].ToString(),
                VolWt = e["VolumeCapacity"].ToString(),
                SensorName = e["SensorName"].ToString(),
                HdnSensorName = e["HdnSensorName"].ToString(),
                ULDCount = e["ULDCount"].ToString(),
                SkidCount = e["SkidCount"].ToString()
            });
            if (obj.Any())
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>(ds.Tables[4].Rows[0][0].ToString(), obj.AsQueryable().ToList());
            else
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>("", obj.AsQueryable().ToList());
        }
        public KeyValuePair<string, List<WarehousePlanningLocationList>> GetFloorRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            WarehousePlanningLocationList tariffSlab = new WarehousePlanningLocationList();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@SubAreaSNo", recordID)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_GetSubAreaGrid", Parameters);
            var obj = ds.Tables[3].AsEnumerable().Select(e => new WarehousePlanningLocationList
            {
                SNo = e["SNo"].ToString(),
                Name = e["FloorName"].ToString(),
                GrossWt = e["GrossCapacity"].ToString(),
                VolWt = e["VolumeCapacity"].ToString(),
                ULDCount = e["ULDCount"].ToString(),
                SkidCount = e["SkidCount"].ToString()
            });
            if (obj.Any())
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>(ds.Tables[3].Rows[0][0].ToString(), obj.AsQueryable().ToList());
            else
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>("", obj.AsQueryable().ToList());
        }
        public KeyValuePair<string, List<WarehousePlanningLocationList>> GetCagesRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            WarehousePlanningLocationList tariffSlab = new WarehousePlanningLocationList();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@SubAreaSNo", recordID)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_GetSubAreaGrid", Parameters);

            var obj = ds.Tables[1].AsEnumerable().Select(e => new WarehousePlanningLocationList
            {
                SNo = e["SNo"].ToString(),
                Number = e["CageNo"].ToString(),
                Name = e["CageName"].ToString(),
                GrossWt = e["GrossCapacity"].ToString(),
                VolWt = e["VolumeCapacity"].ToString(),
                ULDCount = e["ULDCount"].ToString(),
                SkidCount = e["SkidCount"].ToString()
            });
            if (obj.Any())
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>(ds.Tables[1].Rows[0][0].ToString(), obj.AsQueryable().ToList());
            else
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>("", obj.AsQueryable().ToList());


        }
        public KeyValuePair<string, List<WarehousePlanningLocationList>> GetDollyRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            WarehousePlanningLocationList tariffSlab = new WarehousePlanningLocationList();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@SubAreaSNo", recordID)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_GetSubAreaGrid", Parameters);
            var obj = ds.Tables[2].AsEnumerable().Select(e => new WarehousePlanningLocationList
            {
                SNo = e["SNo"].ToString(),
                Name = e["DollyName"].ToString(),
                GrossWt = e["GrossCapacity"].ToString(),
                VolWt = e["VolumeCapacity"].ToString(),
                ULDCount = e["ULDCount"].ToString(),
                SkidCount = e["SkidCount"].ToString()
            });
            if (obj.Any())
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>(ds.Tables[2].Rows[0][0].ToString(), obj.AsQueryable().ToList());
            else
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>("", obj.AsQueryable().ToList());
        }
        public KeyValuePair<string, List<WarehousePlanningLocationList>> GetRackRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            WarehousePlanningLocationList tariffSlab = new WarehousePlanningLocationList();
            SqlParameter[] Parameters = {
                                           new SqlParameter("@SubAreaSNo", recordID)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_GetSubAreaGrid", Parameters);
            var obj = ds.Tables[0].AsEnumerable().Select(e => new WarehousePlanningLocationList
            {
                SNo = e["SNo"].ToString(),
                RackNbr = e["RackNo"].ToString(),
                SlabNbr = e["SlabNo"].ToString(),
                Name = e["RackName"].ToString(),
                GrossWt = e["GrossCapacity"].ToString(),
                VolWt = e["VolumeCapacity"].ToString(),
                ULDCount = e["ULDCount"].ToString(),
                SkidCount = e["SkidCount"].ToString()
            });
            if (obj.Any())
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>(ds.Tables[0].Rows[0][0].ToString(), obj.AsQueryable().ToList());
            else
                return new KeyValuePair<string, List<WarehousePlanningLocationList>>("", obj.AsQueryable().ToList());
        }

        private DataTable GetRackTable(string SubLocationName, List<WarehousePlanningLocationList> LocationList)
        {

            DataTable dt = new DataTable();
            DataRow dr;
            dt.Columns.Add("RackNo", typeof(string));
            dt.Columns.Add("SlabNo", typeof(string));
            dt.Columns.Add("RackName", typeof(string));
            dt.Columns.Add("GrossCapacity", typeof(double));
            dt.Columns.Add("VolumeCapacity", typeof(double));
            dt.Columns.Add("ULDCount", typeof(int));
            dt.Columns.Add("SkidCount", typeof(int));

            if (SubLocationName != "RACK") return dt;
            if (LocationList == null) return dt;
            foreach (var item in LocationList)
            {
                dr = dt.NewRow();
                dr["RackNo"] = item.RackNbr;
                dr["SlabNo"] = item.SlabNbr;
                dr["RackName"] = item.Name;
                dr["GrossCapacity"] = item.GrossWt == "" ? "0" : item.GrossWt;
                dr["VolumeCapacity"] = item.VolWt == "" ? "0" : item.VolWt;
                dr["ULDCount"] = item.ULDCount == "" ? "0" : item.ULDCount;
                dr["SkidCount"] = item.SkidCount == "" ? "0" : item.SkidCount;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        private DataTable GetFloorTable(string SubLocationName, List<WarehousePlanningLocationList> LocationList)
        {

            DataTable dt = new DataTable();
            DataRow dr;
            dt.Columns.Add("FloorName", typeof(string));
            dt.Columns.Add("GrossCapacity", typeof(double));
            dt.Columns.Add("VolumeCapacity", typeof(double));
            dt.Columns.Add("ULDCount", typeof(int));
            dt.Columns.Add("SkidCount", typeof(int));

            if (SubLocationName != "FLOOR") return dt;
            if (LocationList == null) return dt;
            foreach (var item in LocationList)
            {
                dr = dt.NewRow();
                dr["FloorName"] = item.Name;
                dr["GrossCapacity"] = item.GrossWt == "" ? "0" : item.GrossWt;
                dr["VolumeCapacity"] = item.VolWt == "" ? "0" : item.VolWt;
                dr["ULDCount"] = item.ULDCount == "" ? "0" : item.ULDCount;
                dr["SkidCount"] = item.SkidCount == "" ? "0" : item.SkidCount;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        private DataTable GetDollyTable(string SubLocationName, List<WarehousePlanningLocationList> LocationList)
        {

            DataTable dt = new DataTable();
            DataRow dr;
            dt.Columns.Add("DollyName", typeof(string));
            dt.Columns.Add("GrossCapacity", typeof(double));
            dt.Columns.Add("VolumeCapacity", typeof(double));
            dt.Columns.Add("ULDCount", typeof(int));
            dt.Columns.Add("SkidCount", typeof(int));

            if (SubLocationName != "DOLLY") return dt;
            if (LocationList == null) return dt;
            foreach (var item in LocationList)
            {
                dr = dt.NewRow();
                dr["DollyName"] = item.Name;
                dr["GrossCapacity"] = item.GrossWt == "" ? "0" : item.GrossWt;
                dr["VolumeCapacity"] = item.VolWt == "" ? "0" : item.VolWt;
                dr["ULDCount"] = item.ULDCount == "" ? "0" : item.ULDCount;
                dr["SkidCount"] = item.SkidCount == "" ? "0" : item.SkidCount;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        private DataTable GetCagesTable(string SubLocationName, List<WarehousePlanningLocationList> LocationList)
        {

            DataTable dt = new DataTable();
            DataRow dr;
            dt.Columns.Add("CageNo", typeof(string));
            dt.Columns.Add("CageName", typeof(string));
            dt.Columns.Add("GrossCapacity", typeof(double));
            dt.Columns.Add("VolumeCapacity", typeof(double));
            dt.Columns.Add("ULDCount", typeof(int));
            dt.Columns.Add("SkidCount", typeof(int));

            if (SubLocationName != "CAGES") return dt;
            if (LocationList == null) return dt;
            foreach (var item in LocationList)
            {
                dr = dt.NewRow();
                dr["CageNo"] = item.Number;
                dr["CageName"] = item.Name;
                dr["GrossCapacity"] = item.GrossWt == "" ? "0" : item.GrossWt;
                dr["VolumeCapacity"] = item.VolWt == "" ? "0" : item.VolWt;
                dr["ULDCount"] = item.ULDCount == "" ? "0" : item.ULDCount;
                dr["SkidCount"] = item.SkidCount == "" ? "0" : item.SkidCount;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        private DataTable GetRoomTable(string SubLocationName, List<WarehousePlanningLocationList> LocationList)
        {

            DataTable dt = new DataTable();
            DataRow dr;
            dt.Columns.Add("RoomNo", typeof(string));
            dt.Columns.Add("RoomName", typeof(string));
            dt.Columns.Add("IsTemperatureControlled", typeof(bool));
            dt.Columns.Add("StartTemperature", typeof(double));
            dt.Columns.Add("EndTemperature", typeof(decimal));
            dt.Columns.Add("GrossCapacity", typeof(double));
            dt.Columns.Add("VolumeCapacity", typeof(double));
            dt.Columns.Add("SensorIds", typeof(string));
            dt.Columns.Add("ULDCount", typeof(int));
            dt.Columns.Add("SkidCount", typeof(int));

            if (SubLocationName != "ROOM") return dt;
            if (LocationList == null) return dt;
            foreach (var item in LocationList)
            {
                dr = dt.NewRow();
                dr["RoomNo"] = item.RoomNumber;
                dr["RoomName"] = item.Name;
                dr["IsTemperatureControlled"] = item.TempControlled;
                dr["StartTemperature"] = item.StartTemperature;
                dr["EndTemperature"] = item.EndTemperature;
                dr["GrossCapacity"] = item.GrossWt == "" ? "0" : item.GrossWt;
                dr["VolumeCapacity"] = item.VolWt == "" ? "0" : item.VolWt;
                dr["SensorIds"] = item.HdnSensorName;
                dr["ULDCount"] = item.ULDCount == "" ? "0" : item.ULDCount;
                dr["SkidCount"] = item.SkidCount == "" ? "0" : item.SkidCount;
                dt.Rows.Add(dr);
            }
            return dt;
        }


        public List<string> DeleteCagesRecord(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spWh_DeleteCagesTrans", Parameters);
            BaseBusiness baseBusiness = new BaseBusiness();
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WHCages");
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
        public List<Tuple<string, int>> DeleteRackRecord(string recordID)
        {
            int ret = 0;
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spWh_DeleteRackRecordTrans", Parameters);
            BaseBusiness baseBusiness = new BaseBusiness();
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    if (ret >= 2003)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WHRack");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WHRack");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
                }
            }
            return ErrorMessage;
        }

        public List<Tuple<string, int>> DeleteRoomRecord(string recordID)
        {

            int ret = 0;
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spWh_DeleteRoomRecordTrans", Parameters);
            BaseBusiness baseBusiness = new BaseBusiness();
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    if (ret >= 2003)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WHRoom");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WHRoom");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
                }
            }
            return ErrorMessage;
        }

        public List<Tuple<string, int>> DeleteFloorRecord(string recordID)
        {
            int ret = 0;
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spWh_DeleteFloorRecordTrans", Parameters);
            BaseBusiness baseBusiness = new BaseBusiness();
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    if (ret >= 2003)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WHFloor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WHFloor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
                }
            }
            return ErrorMessage;
        }
        public List<string> DeleteDollyRecord(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spWh_DeleteDollyRecordTrans", Parameters);
            BaseBusiness baseBusiness = new BaseBusiness();
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WHDolly");
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
