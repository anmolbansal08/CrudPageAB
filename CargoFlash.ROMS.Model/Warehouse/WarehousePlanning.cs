using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Warehouse
{
    [KnownType(typeof(WarehousePlanning))]
    public class WarehousePlanning
    {
        public int SNo { get; set; }
        public string AirPortName { get; set; }
        public string WarehouseName { get; set; }
        public string WarehouseCode { get; set; }
        public string TotalArea { get; set; }
        public string CellArea { get; set; }
        public string WHRowCount { get; set; }
        public string WHColumnCount { get; set; }
        public string CityName { get; set; }
        public string AirportSNo { get; set; }

        public List<WarehousePlanningMatrix> WarehousePlanningMatrix { get; set; }
    }

    [KnownType(typeof(WarehousePlanningMatrix))]
    public class WarehousePlanningMatrix
    {
        public int? SNo { get; set; }
        public string WHRowNo { get; set; }
        public string WHColumnNo { get; set; }
        public int WHAreaSNo { get; set; }
        public string ColorCode { get; set; }
        public string AreaName { get; set; }
        public int SubAreaSNo { get; set; }
        public string SubColorCode { get; set; }
        public string SubAreaName { get; set; }
        public int IsStorable { get; set; }
    }
    [KnownType(typeof(WarehousePlanningLocation))]
    public class WarehousePlanningLocation
    {
        public string SNo { get; set; }
        public string WHMatrixSNo { get; set; }
        public string WarehouseCity { get; set; }
        public string Text_WarehouseCity { get; set; }
        public string Terminal { get; set; }
        public string Text_Terminal { get; set; }
        public string Airline { get; set; }
        public string Text_Airline { get; set; }
        public string SHC { get; set; }
        public string Text_SHC { get; set; }
        public string DestCountry { get; set; }
        public string Text_DestCountry { get; set; }
        public string DestCity { get; set; }
        public string Text_DestCity { get; set; }
        public string AgentForwarder { get; set; }
        public string Text_AgentForwarder { get; set; }
        public string Location { get; set; }
        public string Text_Location { get; set; }
        public string SubLocation { get; set; }
        public string Text_SubLocation { get; set; }
        public string FixedMovable { get; set; }
        public string Storable { get; set; }
        public string SubAreaName { get; set; }
        public string ColorCode { get; set; }
        public string ColorSNo { get; set; }
        public string SubLocationName { get; set; }

        public string LocationName { get; set; }
        public List<WarehousePlanningLocationList> LocationList { get; set; }
    }
    [KnownType(typeof(WarehousePlanningSearch))]
    public class WarehousePlanningSearch
    {
        public string Terminal { get; set; }       
        public string Airline { get; set; }
        public string SHC { get; set; }      
        public string DestCountry { get; set; }
        public string DestCity { get; set; }
        public string AgentForwarder { get; set; }
        public string Location { get; set; }
        public string SubLocation { get; set; }
        public string SubAreaName { get; set; }
        public string WarehouseSNo { get; set; }
        public string AirportSNo { get; set; }

    } 
    [KnownType(typeof(WarehousePlanningSearchResult))]
    public class WarehousePlanningSearchResult
    {

        public string SNo { get; set; }
        public string AWBNo { get; set; }
        public string LocationName { get; set; }
        public string SPHC { get; set; }        
        public string CountryName { get; set; }
        public string CityName { get; set; }
        public string TerminalName { get; set; }
        public string AgentName { get; set; }
        public string AirlineName { get; set; }
        public string ULDNo { get; set; }
    }

    [KnownType(typeof(WarehousePlanningSearchResultbtn))]
    public class WarehousePlanningSearchResultbtn
    {

        public string SNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBSNo { get; set; }
        public string LocationName { get; set; }
        public string SPHC { get; set; }
        public string CountryName { get; set; }
        public string CityName { get; set; }
        public string TerminalName { get; set; }
        public string AgentName { get; set; }
        public string AirlineName { get; set; }
        public string ULDNo { get; set; }
        public string Show { get; set; }
        public string pieceno { get; set; }
        public string ConsumablesName { get; set; }//new added
        public string LocationType { get; set; }
        public string WhLevel { get; set; }
        public string WHSetupSNo { get; set; }
        public string IsImport { get; set; }
        public string ConsumableSNo { get; set; }
        public string SLISNo { get; set; }
        public string WHSubAreaSNo { get; set; }
    }


    [KnownType(typeof(WarehousePlanningLocationList))]
    public class WarehousePlanningLocationList
    {
        public string SNo { get; set; }
        public string Name { get; set; }
        public string RackNbr { get; set; }
        public string SlabNbr { get; set; }
        public string GrossWt { get; set; }
        public string VolWt { get; set; }
        public string Number { get; set; }
        public string RoomNumber { get; set; }
        public int? TempControlled { get; set; }
        public double StartTemperature { get; set; }
        public double EndTemperature { get; set; }
        public string HdnSensorName { get; set; }
        public string SensorName { get; set; }
        public string ULDCount { get; set; }
        public string SkidCount { get; set; }
    }

    [KnownType(typeof(WarehousePlanningLocationResultbtn))]
    public class WarehousePlanningLocationResultbtn
    {

        public string SNo { get; set; }
        public string LocationName { get; set; }
        public string SPHC { get; set; }
        public string CountryName { get; set; }
        public string CityName { get; set; }
        public string TerminalName { get; set; }
        public string AgentName { get; set; }
        public string AirlineName { get; set; }
        public string LocationType { get; set; }
        public string WhLevel { get; set; }
        public string WHSetupSNo { get; set; }
    }
}
