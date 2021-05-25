using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    /*
	*****************************************************************************
	Class Name:		Employee
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Krishan Kant Agarwal
	Created On:		19 Nov 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    [KnownType(typeof(Employee))]
    public class Employee
    {
        public int SNo { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public int Mobile { get; set; }
        public string Email { get; set; }
        public string UpdateBy { get; set; }
        public string UpdatedAt { get; set; }

    }

}
