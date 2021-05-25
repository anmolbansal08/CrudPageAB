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
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
	#region Product Service Description
	/*
	*****************************************************************************
	Service Name:	ProductService      
	Purpose:		This Service used to get details of Product save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shivang Srivastava.
	Created On:		04 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
	#endregion
	[GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
	[ServiceBehavior(IncludeExceptionDetailInFaults = true)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
	public class ProductService : SignatureAuthenticate, IProductService
	{
		public Product GetProductRecord(int recordID, string UserSNo)
		{
			SqlDataReader dr = null;
			try
			{
				Product Product = new Product();
				SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
				dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordProduct", Parameters);
				if (dr.Read())
				{
					Product.SNo = Convert.ToInt32(dr["SNo"]);
					Product.ProductName = dr["ProductName"].ToString().ToUpper();
					//Product.Priority = Convert.ToDecimal(dr["Priority"].ToString());
					Product.IsDefault = Convert.ToBoolean(dr["IsDefault"]);
					Product.Default1 = dr["DEFALT"].ToString();
					Product.IsActive = Convert.ToBoolean(dr["IsActive"]);
					Product.Active = dr["ACTIVE"].ToString();
					Product.IsExpress = Convert.ToBoolean(dr["IsExpress"]);
					Product.Express = dr["EXPRESS"].ToString();
					Product.UpdatedBy = dr["UpdatedUser"].ToString();
					Product.CreatedBy = dr["CreatedUser"].ToString();
					Product.ProductCode = dr["ProductCode"].ToString();
                    /* ---------- Added By Pankaj Kumar Ishwar on 27/03/2018 ----------*/
                    Product.PriorityMasterSNo = Convert.ToString(dr["PriorityMasterSNo"]);
                    Product.Text_PriorityMasterSNo = Convert.ToString(dr["Text_PriorityMasterSNo"]).ToUpper();
                    //Add  By Sushant Kumar Nayak On 19-05-2018
                    Product.Text_TypeOfDiscount = Convert.ToString(dr["TypeOfDiscount"]);
                    Product.TypeOfDiscount = Convert.ToString(dr["TypeOfDiscountSno"]).ToUpper();
                    Product.LabelTypeOfDiscount = "";
				}
				dr.Close();
				return Product;
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}
		public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
		{
			try
			{
				string sorts = GridSort.ProcessSorting(sort);
				string filters = GridFilter.ProcessFilters<Product>(filter);

				SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
				DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListProduct", Parameters);
				var productList = ds.Tables[0].AsEnumerable().Select(e => new Product
				{
					SNo = Convert.ToInt32(e["SNo"]),
					ProductName = e["ProductName"].ToString().ToUpper(),
					Default1 = e["Default1"].ToString().ToUpper(),
					//Priority = Convert.ToDecimal(e["Priority"]),
					Active = Convert.ToString(e["Active"]),
					ProductCode = Convert.ToString(e["ProductCode"]),
                    Text_PriorityMasterSNo = Convert.ToString(e["Text_PriorityMasterSNo"]),
            });
				ds.Dispose();
				return new DataSourceResult
				{
					Data = productList.AsQueryable().ToList(),
					Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
				};
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}
		public List<string> SaveProduct(List<Product> Product)
		{
			try
			{
				//validate Business Rule
				List<string> ErrorMessage = new List<string>();
                DataTable dtCreateProduct = CollectionHelper.ConvertTo(Product, "Active,Default1,Express,Text_PriorityMasterSNo,Text_TypeOfDiscount,LabelTypeOfDiscount");
				BaseBusiness baseBusiness = new BaseBusiness();

				if (!baseBusiness.ValidateBaseBusiness("Product", dtCreateProduct, "SAVE"))
				{
					ErrorMessage = baseBusiness.ErrorMessage;
					return ErrorMessage;
				}
				SqlParameter param = new SqlParameter();
				param.ParameterName = "@ProductTable";
				param.SqlDbType = System.Data.SqlDbType.Structured;
				param.Value = dtCreateProduct;
				SqlParameter[] Parameters = { param };

				int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateProduct", Parameters);
				if (ret > 0)
				{
					if (ret > 1000)
					{
						//For Customised Validation Messages like 'Record Already Exists' etc
						string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Product");
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
			catch (Exception ex)//
			{
				throw ex;
			}
		}
		public List<string> UpdateProduct(List<Product> Product)
		{
			try
			{
				List<string> ErrorMessage = new List<string>();
                DataTable dtCreateProduct = CollectionHelper.ConvertTo(Product, "Active,Default1,Express,Text_PriorityMasterSNo,Text_TypeOfDiscount,LabelTypeOfDiscount");
				BaseBusiness baseBusiness = new BaseBusiness();

				if (!baseBusiness.ValidateBaseBusiness("Product", dtCreateProduct, "UPDATE"))
				{
					ErrorMessage = baseBusiness.ErrorMessage;
					return ErrorMessage;
				}

				SqlParameter param = new SqlParameter();
				param.ParameterName = "@ProductTable";
				param.SqlDbType = System.Data.SqlDbType.Structured;
				param.Value = dtCreateProduct;
				SqlParameter[] Parameters = { param };

				int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateProduct", Parameters);
				if (ret > 0)
				{
					if (ret > 1000)
					{
						//For Customised Validation Messages like 'Record Already Exists' etc
						string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Product");
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
			catch (Exception ex)//
			{
				throw ex;
			}
		}
		public List<string> DeleteProduct(List<string> listID)
		{
			try
			{
				List<string> ErrorMessage = new List<string>();
				BaseBusiness baseBusiness = new BaseBusiness();
				if (listID.Count > 1)
				{
					string RecordID = listID[0].ToString();
					string UserID = listID[1].ToString();

					SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
											 new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

					int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteProduct", Parameters);
					if (ret > 0)
					{
						if (ret > 1000)
						{
							//For Customised Validation Messages like 'Record Already Exists' etc
							string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Product");
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
			catch (Exception ex)//
			{
				throw ex;
			}
		}
		public DataSourceResult GetDefault()
		{
			try
			{
				List<String> cur = new List<String>();
				//SqlParameter[] Parameters = { new SqlParameter("@CountryCode", CountryCode) };
				SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDefaultProduct");
				if (dr.Read())
				{
					cur.Add(dr["IsDefault"].ToString());
					cur.Add(dr["ProductName"].ToString());
				}
				return new DataSourceResult
				{
					Data = cur,
					Total = cur.Count()
				};
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}
	}
}
