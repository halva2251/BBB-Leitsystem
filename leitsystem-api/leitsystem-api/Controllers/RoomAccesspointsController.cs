using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using leitsystem_api.Data;
using leitsystem_api.Models;

namespace leitsystem_api.Controllers
{
    public class RoomAccesspointsController : Controller
    {
        private readonly DataContext _context;

        public RoomAccesspointsController(DataContext context)
        {
            _context = context;
        }

        // GET: RoomAccesspoints
        public async Task<IActionResult> Index()
        {
            var dataContext = _context.RoomAccesspoints.Include(r => r.AccessPoint).Include(r => r.Room);
            return View(await dataContext.ToListAsync());
        }

        // GET: RoomAccesspoints/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roomAccesspoint = await _context.RoomAccesspoints
                .Include(r => r.AccessPoint)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(m => m.RoomId == id);
            if (roomAccesspoint == null)
            {
                return NotFound();
            }

            return View(roomAccesspoint);
        }

        // GET: RoomAccesspoints/Create
        public IActionResult Create()
        {
            ViewData["AccesspointId"] = new SelectList(_context.AccessPoints, "Id", "Id");
            ViewData["RoomId"] = new SelectList(_context.Rooms, "Id", "Id");
            return View();
        }

        // POST: RoomAccesspoints/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("RoomId,AccesspointId")] RoomAccesspoint roomAccesspoint)
        {
            if (ModelState.IsValid)
            {
                _context.Add(roomAccesspoint);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["AccesspointId"] = new SelectList(_context.AccessPoints, "Id", "Id", roomAccesspoint.AccesspointId);
            ViewData["RoomId"] = new SelectList(_context.Rooms, "Id", "Id", roomAccesspoint.RoomId);
            return View(roomAccesspoint);
        }

        // GET: RoomAccesspoints/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roomAccesspoint = await _context.RoomAccesspoints.FindAsync(id);
            if (roomAccesspoint == null)
            {
                return NotFound();
            }
            ViewData["AccesspointId"] = new SelectList(_context.AccessPoints, "Id", "Id", roomAccesspoint.AccesspointId);
            ViewData["RoomId"] = new SelectList(_context.Rooms, "Id", "Id", roomAccesspoint.RoomId);
            return View(roomAccesspoint);
        }

        // POST: RoomAccesspoints/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("RoomId,AccesspointId")] RoomAccesspoint roomAccesspoint)
        {
            if (id != roomAccesspoint.RoomId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(roomAccesspoint);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RoomAccesspointExists(roomAccesspoint.RoomId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["AccesspointId"] = new SelectList(_context.AccessPoints, "Id", "Id", roomAccesspoint.AccesspointId);
            ViewData["RoomId"] = new SelectList(_context.Rooms, "Id", "Id", roomAccesspoint.RoomId);
            return View(roomAccesspoint);
        }

        // GET: RoomAccesspoints/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roomAccesspoint = await _context.RoomAccesspoints
                .Include(r => r.AccessPoint)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(m => m.RoomId == id);
            if (roomAccesspoint == null)
            {
                return NotFound();
            }

            return View(roomAccesspoint);
        }

        // POST: RoomAccesspoints/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var roomAccesspoint = await _context.RoomAccesspoints.FindAsync(id);
            if (roomAccesspoint != null)
            {
                _context.RoomAccesspoints.Remove(roomAccesspoint);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RoomAccesspointExists(int id)
        {
            return _context.RoomAccesspoints.Any(e => e.RoomId == id);
        }
    }
}
