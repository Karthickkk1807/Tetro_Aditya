using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Data.SqlClient.DataClassification;
using Razorpay.Api;
using System.Data;
using System.Security.Claims;

namespace TetroONE.Models
{
    public class GetPayment
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? PaymentId { get; set; }
    }

    public class PaymentGetContactNameDetails
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? PaymentTypeId { get; set; }
        public int? PaymentCategory { get; set; }
    }

    public class GetPaymentBillNo
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public int? PaymentTypeId { get; set; }
        public int? ContactId { get; set; }
    }

    public class GetPaymentBillNoAmount
    {
        public int LoginUserId { get; set; }
        public int? PaymentTypeId { get; set; }
        public int? ContactId { get; set; }
        public string? BillNumber { get; set; }
    }

    public class GetAutoGenerateNo
    {
        public int LoginUserId { get; set; }
        public int? FranchiseId { get; set; }
        public string? ModuleName { get; set; }
    }

    public class InsertUpdatePaymentDetails
    {
        public int LoginUserId { get; set; }
        public int? PaymentId { get; set; }
        public DateTime PaymentDate { get; set; }
        public int FranchiseId { get; set; }
        public int BillingFranchiseId { get; set; }
        public string PaymentTypeId { get; set; }
        public string PaymentCategory { get; set; }
        public int ContactId { get; set; }
        public string PaymentNo { get; set; }
        public string? Comments { get; set; }
        public List<PaymentBillInfoDetails> paymentBillInfoDetails { get; set; }
        public DataTable TVP_PaymentBillInfoDetails { get; set; }
    }

    public class PaymentBillInfoDetails
    {
        public int? PaymentBillInfoId { get; set; }
        public string? BillNumber { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public int? ModeOfPaymentId { get; set; }
        public int? PaymentStatusId { get; set; }
        public int? PaymentId { get; set; }
    }

}