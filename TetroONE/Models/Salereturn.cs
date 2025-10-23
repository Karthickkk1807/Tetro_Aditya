using System.Data;

namespace TetroONE.Models
{
    public class GetSaleReturn
    {
        public int LoginUserId { get; set; }
        public int? SaleReturnId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? FranchiseId { get; set; }

    }

	public class GetProductPrice
	{
		public int LoginUserId { get; set; }
        public int FranchiseId { get; set; }
        public int DistributorId { get; set; }
        public int UnitId { get; set; }
		public int ProductId { get; set; }

	}

	public class Getdistributor
	{
		public int LoginUserId { get; set; }
		public int FranchiseId { get; set; }
		

	}
	public class DeleteSaleReturn
    {
        public int LoginUserId { get; set; }

        public int? SaleReturnId { get; set; }
        

    }
    public class SaleReturnDetailsStatic
    {
        public int? SaleReturnId { get; set; }
        public int FranchiseId { get; set; }
        public DateTime SaleReturnDate { get; set; }
        public string? SaleReturnNo { get; set; }
        public int BillingFranchiseId { get; set; }
        public int ClientId { get; set; }
        public int BillFromFranchiseId { get; set; }
        public int? SaleReturnStatusId { get; set; }
    }

    public class SaleReturnProductMappingDetails
    {
        public int? SaleReturnProductMappingId { get; set; }
        public int ProductId { get; set; }
        public int UnitId { get; set; }

        public decimal Price { get; set; }
        public decimal Quantity { get; set; }
        public decimal? TotalAmount { get; set; }
        public int? SaleReturnId { get; set; }
        
    }


    public class InsertSaleReturnDetails
    {
        public int LoginUserId { get; set; }
        public int? SaleReturnId { get; set; }
        public int FranchiseId { get; set; }
        public DateTime SaleReturnDate { get; set; }
        public string? SaleReturnNo { get; set; }
        public int BillingFranchiseId { get; set; }
        public int ClientId { get; set; }
        public int? SaleReturnStatusId { get; set; }

        public List<SaleReturnProductMappingDetails> SaleReturnProductMappingDetails { get; set; }
        public DataTable? TVP_SaleReturnProductMappingDetails { get; set; }
    }
}
