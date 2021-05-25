

// <copyright file="LegGridModel.cs" company="Cargoflash">
//
// Created On: 08-Sep-2017
// Created By: Braj
// Description: Leg Grid Model
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
namespace CargoFlash.Cargo.Model.Schedule
{
    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Runtime.Serialization;
    #endregion
    /// <summary>
    /// Leg grid model is used for update flight leg's
    /// </summary>
    public class LegGridModel
    {
        /// <summary>
        /// Gets or sets flight sno
        /// </summary>
        public Int64 SNo { get; set; }
        /// <summary>
        /// Gets or sets valid from flight
        /// </summary>
        public DateTime? ValidFrom { get; set; }
        /// <summary>
        /// Gets or sets valid to date 
        /// </summary>
        public DateTime? ValidTo { get; set; }
        /// <summary>
        /// Gets or sets grouo flight sno
        /// </summary>
        public string GroupFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets flight no
        /// </summary>
        public string FlightNo { get; set; }

        /// <summary>
        /// Gets or sets boarding point
        /// </summary>
        public string Board { get; set; }
        /// <summary>
        /// Gets or sets off point or origin point
        /// </summary>
        public string Off { get; set; }
        /// <summary>
        /// Gets or sets forwaeder agent
        /// </summary>
        public string Forwarder { get; set; }
        /// <summary>
        /// Gets or sets aircraft type
        /// </summary>
        public string AircraftType { get; set; }
        /// <summary>
        /// Gets or sets aircrft type sno
        /// </summary>
        public string ACSNo { get; set; }
        /// <summary>
        /// Gets or sets aircraft registration no
        /// </summary>
        public string ACRegNo { get; set; }


        /// <summary>
        /// Gets or set gross weight
        /// </summary>
        public decimal? GrossWeight { get; set; }
        /// <summary>
        /// Gets or sets flight volume weight 
        /// </summary>
        public decimal? VolumeWeight { get; set; }
        /// <summary>
        /// Gets or sets free sale capacity 
        /// </summary>
        public decimal? FreeSaleCapacity { get; set; }
        /// <summary>
        /// Gets or set free sale capacity volume
        /// </summary>
        public decimal? FreeSaleCapacityVolume { get; set; }
        /// <summary>
        /// Gets or sets over booked capacity 
        /// </summary>
        public decimal? OverBookingCapacity { get; set; }
        /// <summary>
        /// Gets or sets over booked capacity volume
        /// </summary>
        public decimal? OverBookingCapacityVolume { get; set; }
        /// <summary>
        /// Gets or sets reserved capacity gross weight
        /// </summary>
        public decimal? ReservedCapacityGrosswt { get; set; }
        /// <summary>
        /// Gets or sets reserved capacity volume weight
        /// </summary>
        public decimal? ReservedCapacityVolwt { get; set; }
        /// <summary>
        /// Gets or sets used gross weight 
        /// </summary>
        public string UsedGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets used volume 
        /// </summary>
        public string UsedVolume { get; set; }
        /// <summary>
        /// Gets or sets commercial capacity 
        /// </summary>
        public string CommercialCapacity { get; set; }

        /// <summary>
        /// Gets or sets Max Gross weight per pieces 
        /// </summary>
        public decimal? MaxGrossPerPcs { get; set; }
        /// <summary>
        /// Gets or sets max volume weight per pieces
        /// </summary>
        public decimal? MaxVolumePerPcs { get; set; }

        #region Pax Information
        public int? OpenSeats { get; set; }
        #endregion

        #region Movement Tab Information 
        public DateTime? LocalETD { get; set; }
        public DateTime? LocalETA { get; set; }
        /// <summary>
        /// Gets or sets flight type name
        /// </summary>
        public string FlightTypeSNo { get; set; }
        /// <summary>
        /// Gets or sets is booking closed or not 
        /// </summary>
        public bool IsBookingClosed { get; set; }
        /// <summary>
        /// Gets or sets flight is cancelled or not 
        /// </summary>
        public bool IsCancelled { get; set; }
        /// <summary>
        /// Gets or sets flight delay status
        /// </summary>
        public bool IsDelay { get; set; }
        /// <summary>
        /// Gets or sets CAO
        /// </summary>
        public bool IsCAO { get; set; }
        /// <summary>
        /// Gets or sets days difference         /// 
        /// </summary>
        public string DayDiff { get; set; }
        /// <summary>
        /// Gets or sets flight arrive day difference
        /// </summary>
        public int? ArrDayDiff { get; set; }
        /// <summary>
        /// Gets or sets no of days flight open in the week
        /// </summary>
        public string Days { get; set; }
        
        /// <summary>
        /// Gets or sets flight update remarks
        /// </summary>
        public string Remarks { get; set; }

        public bool IsCharter { get; set; }
        #endregion
        /// <summary>
        /// Gets or sets changes for leg grid
        /// </summary>
        public bool IsGrid { get; set; }
        /// <summary>
        /// Gets or sets changes in pax information
        /// </summary>
        public bool IsPax { get; set; }
        /// <summary>
        /// Gets or sets changes in movement details
        /// </summary>
        public bool IsMovement { get; set; }
        /// <summary>
        /// Gets or sets cancel status for update (0 no changes for cancel 1 - Yes 2 - No)
        /// </summary>
        public int CancelStatus { get; set; }

        /// <summary>
        /// Gets or sets cancel notice 
        /// </summary>
        public bool IsCancelNotice { get; set; }
    }
}
