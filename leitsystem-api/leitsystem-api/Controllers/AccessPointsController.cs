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
    public class AccessPointsController : Controller
    {
        private readonly DataContext _context;

        public AccessPointsController(DataContext context)
        {
            _context = context;
        }

        // GET: AccessPoints
        public async Task<IActionResult> Index()
        {
            return View(await _context.AccessPoints.ToListAsync());
        }

        // GET: AccessPoints/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var accessPoint = await _context.AccessPoints
                .FirstOrDefaultAsync(m => m.Id == id);
            if (accessPoint == null)
            {
                return NotFound();
            }

            return View(accessPoint);
        }

        // GET: AccessPoints/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: AccessPoints/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,MAC,IPAddress,Description,ConnectedDevices,Group,Status,Model,SWVersion,Channel,Band,Uptime")] AccessPoint accessPoint)
        {
            if (ModelState.IsValid)
            {
                _context.Add(accessPoint);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(accessPoint);
        }

        // GET: AccessPoints/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var accessPoint = await _context.AccessPoints.FindAsync(id);
            if (accessPoint == null)
            {
                return NotFound();
            }
            return View(accessPoint);
        }

        // POST: AccessPoints/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,MAC,IPAddress,Description,ConnectedDevices,Group,Status,Model,SWVersion,Channel,Band,Uptime")] AccessPoint accessPoint)
        {
            if (id != accessPoint.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(accessPoint);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AccessPointExists(accessPoint.Id))
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
            return View(accessPoint);
        }

        // GET: AccessPoints/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var accessPoint = await _context.AccessPoints
                .FirstOrDefaultAsync(m => m.Id == id);
            if (accessPoint == null)
            {
                return NotFound();
            }

            return View(accessPoint);
        }

        // POST: AccessPoints/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var accessPoint = await _context.AccessPoints.FindAsync(id);
            if (accessPoint != null)
            {
                _context.AccessPoints.Remove(accessPoint);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AccessPointExists(int id)
        {
            return _context.AccessPoints.Any(e => e.Id == id);
        }
    }
}
