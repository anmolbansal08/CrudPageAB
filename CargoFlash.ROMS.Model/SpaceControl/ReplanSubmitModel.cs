// <copyright file="AWBGridRequest.cs" company="Cargoflash">
//
// Created On: 29-Apr-2017
// Created By: Braj
// Description: Replan submit model 
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>


namespace CargoFlash.Cargo.Model.SpaceControl
{
    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    #endregion

    /// <summary>
    /// Replan submit model used for submitting AWB and itinerary information
    /// </summary>
    public class ReplanSubmitModel
    {
        /// <summary>
        /// Gets or sets awb reference booking sno
        /// </summary>
        public Int64? AWBRefBookingSNo { get; set; }
        /// <summary>
        /// Gets or sets awb sno
        /// </summary>
        public Int32? AWBSNo { get; set; }
        /// <summary>
        /// Gets or sets flight plan sno
        /// </summary>
        public Int32? FlightPlanSNo { get; set; }
        /// <summary>
        /// Gets or sets daily flight sno 
        /// </summary>
        public Int32? DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets origin airport sno 
        /// </summary>
        public int OriginSNo { get; set; }
        /// <summary>
        /// Gets or sets destination airport sno
        /// </summary>
        public int DestinationSNo { get; set; }
        /// <summary>
        /// Gets or sets allotment sno
        /// </summary>
        public int AllotmentSNo { get; set; }
        /// <summary>
        /// Gets  or sets commodity sno
        /// </summary>
        public string CommoditySNo { get; set; }
        /// <summary>
        /// Gets or sets account sno
        /// </summary>
        public int AccountSNo { get; set; }
        /// <summary>
        /// Gets or sets product sno
        /// </summary>
        public int ProductSNo { get; set; }
        /// <summary>
        /// Gets or sets priority sno
        /// </summary>
        public int PrioritySNo { get; set; }
        /// <summary>
        /// Gets or sets awb stock sno
        /// </summary>
        public int AWBStockSNo { get; set; }
        public string SPHCSNO { get; set; }
        /// <summary>
        /// Gets or sets awb no 
        /// </summary>
        public string AWBNo { get; set; }
        /// <summary>
        /// Gets or sets awb booking reference number
        /// </summary>
        public string ReferenceNumber { get; set; }
        /// <summary>
        /// Gets or sets awb prefix or carrier code
        /// </summary>
        public string AWBPrefix { get; set; }
        /// <summary>
        /// Gets or sets BUP or ULD
        /// </summary>
        public int? IsBUP { get; set; }
        /// <summary>
        /// Gets or sets BUL or ULD pieces
        /// </summary>
        public int? BUPPieces { get; set; }
        /// <summary>
        /// Gets or sets nature or goods
        /// </summary>
        public string NOG { get; set; }
        /// <summary>
        /// Gets or sets gross unit 
        /// </summary>
        public int? UM { get; set; }
        /// <summary>
        /// Gets or sets booking type 
        /// </summary>
        public int? BookingType { get; set; }
        /// <summary>
        /// Gets or sets payment type
        /// </summary>
        public int? PaymentType { get; set; }
        /// <summary>
        /// Gets or sets shipment type
        /// </summary>
        public int? ShipmentType { get; set; }

        /// <summary>
        /// Gets or sets flight no
        /// </summary>
        public string FlightNo { get; set; }
        /// <summary>
        /// Get or sets flight date
        /// </summary>
        public DateTime? FlightDate { get; set; }
        /// <summary>
        /// Gets or sets flight awb status is confirm or not that is (1,2)
        /// </summary>
        public int? FlightStatus { get; set; }
        /// <summary>
        /// Gets or sets awb status 
        /// </summary>
        public int? AWBStatus { get; set; }

        /// <summary>
        /// Gets or sets awb pieces
        /// </summary>
        public int? Pieces { get; set; }
        /// <summary>
        /// Gets or sets awb gross weight
        /// </summary>
        public decimal? GrossWeight { get; set; }

        /// <summary>
        /// Gets or sets chargeable weight 
        /// </summary>
        public decimal? ChargeableWeight { get; set; }
        /// <summary>
        /// Gets or sets volume weight
        /// </summary>
        public decimal? VolumeWeight { get; set; }
        /// <summary>
        /// Gets or set awb CBM
        /// </summary>
        public decimal? CBM { get; set; }
        /// <summary>
        /// Gets or sets flight ETA
        /// </summary>
        public string ETA { get; set; }
        /// <summary>
        /// Gets or sets ETD
        /// </summary>
        public string ETD { get; set; }
        /// <summary>
        /// Gets or sets aircraft type
        /// </summary>
        public string AircraftType { get; set; }
        /// <summary>
        /// Gets or sets soft embargo
        /// </summary>
        public string SoftEmbargo { get; set; }
        /// <summary>
        /// Gets or sets no of houses
        /// </summary>
        public string NoofHouse { get; set; }
        /// <summary>
        /// Gets or sets advice status code
        /// </summary>
        public string AdviceStatusCode { get; set; }
        /// <summary>
        /// Gets or sets allotment code
        /// </summary>
        public string AllotmentCode { get; set; }
        /// <summary>
        /// Gets or sets minmum connection time for 2nd leg or consuctive legs
        /// </summary>
        public bool? IsMCT { get; set; }
        /// <summary>
        /// Gets or sets BCT
        /// </summary>
        public bool? IsBCT { get; set; }
        /// <summary>
        /// Gets or sets awb route complete information
        /// </summary>
        public bool? IsRouteComplete { get; set; }
        /// <summary>
        /// Gets or sets value for interline flights
        /// </summary>
        public bool? IsInterline { get; set; }
        /// <summary>
        /// Gets or sets carrier code 
        /// </summary>
        public string CarrierCode { get; set; }
    }
}
