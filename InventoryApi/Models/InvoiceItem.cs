using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryApi.Models
{
    public class InvoiceItem
    {
        [Key]
        public int InvoiceItemId { get; set; }

        [ForeignKey("Invoice")]
        public int InvoiceId { get; set; }

        [ForeignKey("Item")]
        public int ItemId { get; set; }
        
        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        public Item Item { get; set; }
    }
}