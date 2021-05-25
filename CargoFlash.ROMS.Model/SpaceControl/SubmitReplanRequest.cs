// <copyright file="ReplanFlightRequestModel.cs" company="Cargoflash">
//
// Created On: 8-March-2017
// Created By: Braj
// Description: Replan Flight Request Model
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

    public class SubmitReplanRequest
    {
        /// <summary>
        /// Gets or sets booking reference no
        /// </summary>
        public Int64 BookingRefNo { get; set; }
        /// <summary>
        /// Gets or sets booked from
        /// </summary>
        public string BookedFrom { get; set; }
        /// <summary>
        /// Gets or sets replan from (e.g. Reservation or PoMail) 
        /// </summary>
        public string ReplanFrom { get; set; }
        /// <summary>
        /// Gets or sets Awb details 
        /// </summary>
        public ReplanSubmitModel AWBDetails { get; set; }
        /// <summary>
        /// Gets or sets Itenerary details
        /// </summary>
        public List<ReplanSubmitModel> ItineraryDetails { get; set; }
        /// <summary>
        /// Gets or gets airport sno
        /// </summary>
        public int? AirportSNo { get; set; }



    }

}
