using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Item> Items { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Invoice>()
                .HasMany(i => i.InvoiceItems)
                .WithOne()
                .HasForeignKey(ii => ii.InvoiceId);
                
            modelBuilder.Entity<InvoiceItem>()
                .HasOne(ii => ii.Item)
                .WithMany()
                .HasForeignKey(ii => ii.ItemId);
        }
    }
}