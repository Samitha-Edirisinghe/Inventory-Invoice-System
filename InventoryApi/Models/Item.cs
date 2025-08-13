using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryApi.Models
{
    public class Item
    {
        [Key]
        public int ItemId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public int StockQuantity { get; set; }
    }
}