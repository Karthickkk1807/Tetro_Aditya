using System.Data;

namespace TetroONE.Models
{
    public class GetExpense
    {
        public int LoginUserId { get; set; }

        public DateTime? ExpenseDate { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? FranchiseId { get; set; }
    }

    public class DeleteExpense
    {
        public int LoginUserId { get; set; }
        public int FranchiseId { get; set; }
        public int ExpenseId { get; set; }
    }

    public class ExpenseDetailsStatic
    {
        public int? ExpenseId { get; set; }
        public int FranchiseId { get; set; }
        public int BillingFranchiseId { get; set; }
        public DateTime? ExpenseDate { get; set; }
        public string? ExpenseNo { get; set; }
        
        
       
    }

    public class ExpenseTypeMappingDetails
    {
        public int? ExpenseTypeMappingId { get; set; }
        public int? ClaimId { get; set; }
        public int ExpenseCategoryId { get; set; }
        public int TypeId { get; set; }
        public decimal ExpenseAmount { get; set; }
        public string? Description { get; set; }
        public int? ExpenseId { get; set; }

    }



    public class InsertUpdateExpenseDetails
    {
        public int LoginUserId { get; set; }
        public int? ExpenseId { get; set; }
        public int FranchiseId { get; set; }
        public int BillingFranchiseId { get; set; }
        public DateTime? ExpenseDate { get; set; }
        public string? ExpenseNo { get; set; }
        public DataTable TVP_ExpenseTypeMappingDetails { get; set; }
        public DataTable TVP_AttachmentDetails { get; set; }
    }
}
