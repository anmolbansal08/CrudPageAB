using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Schedule
{
    [KnownType(typeof(ViewEditFlight))]
    public class ViewEditFlight
    {
        public string FlightNo { get; set; }
        //public string Origin { get; set; }
        // public string Destination { get; set; }
        public string FlightDate { get; set; }
        public int orgsno { get; set; }
        public int destsno { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public string Days { get; set; }
        public string Mon { get; set; }
        public string Tue { get; set; }
        public string Wed { get; set; }
        public string Thu { get; set; }
        public string Fri { get; set; }
        public string Sat { get; set; }
        public string Sun { get; set; }
        public string FlightType { get; set; }
        public string AircraftType { get; set; }
        public string RegistrationNo { get; set; }
        public decimal GrossWt { get; set; }
        public decimal VolumeWt { get; set; }
        public decimal AlertCapGrossWt { get; set; }
        public decimal AlertCapVolumeWt { get; set; }
        public decimal ReservedCapGrossWt { get; set; }
        public decimal ReservedCapVolumeWt { get; set; }
        public decimal FreeSaleGrossWt { get; set; }
        public decimal FreeSaleVolumeWt { get; set; }

        public decimal OverBookingGrossWt { get; set; }
        public decimal OverBookingVolumeWt { get; set; }

        public decimal CommercialCapacity { get; set; }
        public decimal WeightPerPax { get; set; }
        public int OpenSeats { get; set; }


        public decimal QueuelimitCapGrossWt { get; set; }
        public decimal QueuelimitCapVolumeWt { get; set; }

        public string ETD { get; set; }
        public string ETA { get; set; }
        public int DFSNo { get; set; }
        public string Reason { get; set; }
        public Boolean Active { get; set; }
        public string DDiff { get; set; }
        public Boolean IsCAO { get; set; }
        public Boolean IsBookingClosed { get; set; }
        public Boolean IsCancelled { get; set; }

        public int MovementNo { get; set; }
        public int UserSNo { get; set; }
        
        public string strData { get; set; }
        public Boolean IsDelay { get; set; }
        public string ATD { get; set; }
        public string ATA { get; set; }

    }
    [KnownType(typeof(DailyFlightAllotment))]
    public class DailyFlightAllotment
    {
        public int SNo { get; set; }
        public int IsUsed { get; set; }
        public int DailyFlightSNo { get; set; }
        public int AllotmentSNo { get; set; }
        public string AllotmentCode { get; set; }
        public string AllotmentTypeSNo { get; set; }
        public string HdnAllotmentTypeSNo { get; set; }
        public string OfficeSNo { get; set; }
        public string HdnOfficeSNo { get; set; }
        public string AccountSNo { get; set; }
        public string HdnAccountSNo { get; set; }
        public Decimal GrossWeight { get; set; }
        public Decimal Volume { get; set; }
        public string ReleaseGross { get; set; }
        public string ReleaseVolume { get; set; }
        public Decimal GrossVariancePlus { get; set; }
        public Decimal GrossVarianceMinus { get; set; }
        public Decimal VolumeVariancePlus { get; set; }
        public Decimal VolumeVarianceMinus { get; set; }
        public string SHC { get; set; }
        public string HdnSHC { get; set; }
        public string Commodity { get; set; }
        public string HdnCommodity { get; set; }
        public string Product { get; set; }
        public string HdnProduct { get; set; }
        public Boolean IsExcludeSHC { get; set; }
        public Boolean IsExcludeCommodity { get; set; }
        public Boolean IsExcludeProduct { get; set; }
        public string ReleaseTimeHr { get; set; }
        public string ReleaseTimeMin { get; set; }
        public Boolean Active { get; set; }


    }

    [KnownType(typeof(FlightAllotment))]
    public class FlightAllotment
    {
        public int FlightNo { get; set; }
    }
}
