using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(NonExecutedBooking))]
    public class NonExecutedBooking
    {
        //SNo,FlightNo,FlightDate,FlightOrigin,FlightDestination,ETD
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public string FlightNo { get; set; }

        public Nullable<DateTime> FlightDate { get; set; }

        public string FFMDetail { get; set; }
        //public string EnableSENDFBL { get; set; }

        //public string EnablePRINT { get; set; }
        //public string EnableVERSION { get; set; }

        public string ProcessStatus { get; set; }
    }

    
    [KnownType(typeof(NonExecutedBookingGridData))]
    public class NonExecutedBookingGridData
    {
        public string ProcessStatus { get; set; }// Added By manoj Kumar on 2.7.2015
        public Int32 DailyFlightSNo { get; set; }//Added By Manoj Kumar on 3.7.2015
        public Int32 SNo { get; set; }
        public string AWBNo { get; set; }
        public int SLINo { get; set; }
        public Nullable<DateTime> AWBDate { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public decimal Gross { get; set; }
        public decimal Volume { get; set; }
        public decimal ChWt { get; set; }
        public int Pcs { get; set; }
        public string FlightNo { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        public string FlightDate { get; set; }
        public string Status { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string HandlingInfo { get; set; }
        public string XRay { get; set; }
        public string Payment { get; set; }
        public string Location { get; set; }
        public string Dimension { get; set; }
        public string Weight { get; set; }
        public string Reservation { get; set; }
        public string HAWB { get; set; }
        public string ShippingBill { get; set; }
        public string Document { get; set; }
        public string NoOfHouse { get; set; }
        public int AccPcs { get; set; }
        public decimal AccGrWt { get; set; }
        public decimal AccVolWt { get; set; }
        public string WarningRemarks { get; set; }
        public bool IsWarning { get; set; }
        public decimal FBLWt { get; set; }// Added by RH 12-08-15
        public decimal FWBWt { get; set; }// Added by RH 12-08-15
        public decimal RCSWt { get; set; }// Added by RH 12-08-15
        public Nullable<DateTime> FlightDateSearch { get; set; } //Added by Vinay for FBL
    }


    [KnownType(typeof(ReservationItineraryInformation))]
    public class ReservationItineraryInformation
    {
        public string SNo { get; set; }
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string AWBPieces
        {
            get;
            set;
        }
        public string AWBGrossWeight
        {
            get;
            set;
        }
        public string AWBVolumeWeight
        {
            get;
            set;
        }
        public string UM
        {
            get;
            set;
        }
        public string DailyFlightSNo
        {
            get;
            set;
        }
        public string CarrierCode
        {
            get;
            set;
        }
        public string FlightNo
        {
            get;
            set;
        }
        public string FlightDate
        {
            get;
            set;
        }
        public string Origin
        {
            get;
            set;
        }
        public string Destination
        {
            get;
            set;
        }
        public string Pieces
        {
            get;
            set;
        }
        public string GrossWeight
        {
            get;
            set;
        }
        public string VolumeWeight
        {
            get;
            set;
        }
        public string ETD
        {
            get;
            set;
        }
        public string ETA
        {
            get;
            set;
        }
        public string AircraftType
        {
            get;
            set;
        }
        public string FreeSpaceGrossWeight
        {
            get;
            set;
        }
        public string FreeSpaceVolumeWeight
        {
            get;
            set;
        }
        public string AllotmentCode
        {
            get;
            set;
        }
        public string AllocatedGrossWeight
        {
            get;
            set;
        }
        public string AllocatedVolumeWeight
        {
            get;
            set;
        }
        public string AvailableGrossWeight
        {
            get;
            set;
        }
        public string AvailableVolumeWeight
        {
            get;
            set;
        }
        public string SoftEmbargo
        {
            get;
            set;
        }
        public string FlightVolumeWeight
        {
            get;
            set;
        }
        public string OriginAirportSNo { get; set; }
        public string DestinationAirportSNo { get; set; }
        public string IsBCT { get; set; }
        public string IsMCT { get; set; }
    }

    [KnownType(typeof(ReservationInformation))]
    public class ReservationInformation
    {
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string BookingType
        {
            get;
            set;
        }
        public string AWBStock
        {
            get;
            set;
        }
        public string AWBPrefix
        {
            get;
            set;
        }
        public string AWBNo
        {
            get;
            set;
        }
        public string PaymentType
        {
            get;
            set;
        }
        public string IsBUP
        {
            get;
            set;
        }
        public string BupPieces
        {
            get;
            set;
        }
        public string BupIntactPieces
        {
            get;
            set;
        }
        public string ProductSNo
        {
            get;
            set;
        }
        public string OriginCitySNo
        {
            get;
            set;
        }
        public string DestinationCitySNo
        {
            get;
            set;
        }
        public string AccountSNo
        {
            get;
            set;
        }
        public string AWBPieces
        {
            get;
            set;
        }
        public string GrossWeight
        {
            get;
            set;
        }
        public string VolumeWeight
        {
            get;
            set;
        }
        public string ChargeableWeight
        {
            get;
            set;
        }
        public string Volume
        {
            get;
            set;
        }
        public string Priority
        {
            get;
            set;
        }
        public string UM
        {
            get;
            set;
        }
        public string CommoditySNo
        {
            get;
            set;
        }
        public string NOG
        {
            get;
            set;
        }
        public string SPHC
        {
            get;
            set;
        }
        public string NoofHouse
        {
            get;
            set;
        }
        public string IsRoutingComplete
        {
            get;
            set;
        }
    }

    [KnownType(typeof(ReservationShipperInformation))]
    public class ReservationShipperInformation
    {
        public string SNo { get; set; }
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string ShipperAccountNo
        {
            get;
            set;
        }
        public string ShipperName
        {
            get;
            set;
        }
        public string ShipperName2
        {
            get;
            set;
        }
        public string ShipperStreet
        {
            get;
            set;
        }
        public string ShipperStreet2
        {
            get;
            set;
        }
        public string ShipperLocation
        {
            get;
            set;
        }
        public string ShipperState
        {
            get;
            set;
        }
        public string ShipperPostalCode
        {
            get;
            set;
        }
        public string ShipperCity
        {
            get;
            set;
        }
        public string ShipperCountryCode
        {
            get;
            set;
        }
        public string ShipperMobile
        {
            get;
            set;
        }
        public string ShipperMobile2
        {
            get;
            set;
        }
        public string ShipperEMail
        {
            get;
            set;
        }
        public string ShipperFax
        {
            get;
            set;
        }
        public string ShipperGarudaMiles
        {
            get;
            set;
        }
    }

    [KnownType(typeof(ReservationConsigneeInformation))]
    public class ReservationConsigneeInformation
    {
        public string SNo { get; set; }
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string ConsigneeAccountNo
        {
            get;
            set;
        }
        public string ConsigneeName
        {
            get;
            set;
        }
        public string ConsigneeName2
        {
            get;
            set;
        }
        public string ConsigneeStreet
        {
            get;
            set;
        }
        public string ConsigneeStreet2
        {
            get;
            set;
        }
        public string ConsigneeLocation
        {
            get;
            set;
        }
        public string ConsigneeState
        {
            get;
            set;
        }
        public string ConsigneePostalCode
        {
            get;
            set;
        }
        public string ConsigneeCity
        {
            get;
            set;
        }
        public string ConsigneeCountryCode
        {
            get;
            set;
        }
        public string ConsigneeMobile
        {
            get;
            set;
        }
        public string ConsigneeMobile2
        {
            get;
            set;
        }
        public string ConsigneeEMail
        {
            get;
            set;
        }
        public string ConsigneeFax
        {
            get;
            set;
        }
    }



}
