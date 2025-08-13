using InventoryApi.Data;
using InventoryApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoicesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices()
        {
            return await _context.Invoices
                .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Item)
                .ToListAsync();
        }

        // GET: api/Invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Item)
                .FirstOrDefaultAsync(i => i.InvoiceId == id);

            if (invoice == null) return NotFound();
            return invoice;
        }

        // POST: api/Invoices
        [HttpPost]
        public async Task<ActionResult<Invoice>> PostInvoice(Invoice invoice)
        {
            // Calculate totals and update stock
            foreach (var item in invoice.InvoiceItems)
            {
                var dbItem = await _context.Items.FindAsync(item.ItemId);
                if (dbItem == null) return BadRequest("Item not found");
                
                item.UnitPrice = dbItem.Price;
                item.Total = item.Quantity * item.UnitPrice;
                invoice.GrandTotal += item.Total;
                
                // Update stock
                dbItem.StockQuantity -= item.Quantity;
                _context.Entry(dbItem).State = EntityState.Modified;
            }

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.InvoiceId }, invoice);
        }
    }
}