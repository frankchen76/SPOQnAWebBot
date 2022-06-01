#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BotBiz.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;

namespace BotAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WebBotsController : ControllerBase
    {
        private readonly WebBotDBContext _context;

        public WebBotsController(WebBotDBContext context)
        {
            _context = context;
        }

        // GET: api/WebBots
        [HttpGet]
        [RequiredScope("WebBot.Read")]
        public async Task<ActionResult<IEnumerable<WebBot>>> GetWebBots()
        {
            var ret = new List<WebBot>();
            var result = await _context.WebBots.ToListAsync();
            foreach (var item in result)
            {
                ret.Add(new WebBot()
                {
                    Id = item.Id,
                    BotName = item.BotName
                });
            }
            return ret ;
        }

        // GET: api/WebBots/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WebBot>> GetWebBot(int id)
        {
            var webBot = await _context.WebBots.FindAsync(id);

            if (webBot == null)
            {
                return NotFound();
            }

            return webBot;
        }

        // PUT: api/WebBots/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWebBot(string id, WebBot webBot)
        {
            if (id != webBot.Id.ToString())
            {
                return BadRequest();
            }

            _context.Entry(webBot).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WebBotExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/WebBots
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WebBot>> PostWebBot(WebBot webBot)
        {
            _context.WebBots.Add(webBot);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWebBot", new { id = webBot.Id }, webBot);
        }

        // DELETE: api/WebBots/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWebBot(int id)
        {
            var webBot = await _context.WebBots.FindAsync(id);
            if (webBot == null)
            {
                return NotFound();
            }

            _context.WebBots.Remove(webBot);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WebBotExists(string id)
        {
            return _context.WebBots.Any(e => e.Id.ToString() == id);
        }
    }
}
