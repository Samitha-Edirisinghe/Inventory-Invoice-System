using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryApi.Models
{
    public class Invoice
    {
        [Key]
        public int InvoiceId { get; set; }

        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; }
        
        public DateTime InvoiceDate { get; set; } = DateTime.Now;

        [Column(TypeName = "decimal(18,2)")]
        public decimal GrandTotal { get; set; }

        public List<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
    }
}