using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using leitsystem_api.Data;
using leitsystem_api.ModelsDTO;
using leitsystem_api.Models;
using leitsystem_api.ModelsDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace leitsystem_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessPointsController : ControllerBase
    {
        private readonly DataContext _context;

        public AccessPointsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/AccessPoints
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccessPointDto>>> GetAccessPoints()
        {
            var accessPoints = await _context.AccessPoints.ToListAsync();
            var dtos = accessPoints.Select(a => new AccessPointDto
            {
                Id = a.Id,
                Name = a.Name,
                MAC = a.MAC,
                IPAddress = a.IPAddress,
                Description = a.Description,
                ConnectedDevices = a.ConnectedDevices,
                Group = a.Group,
                Status = a.Status,
                Model = a.Model,
                SWVersion = a.SWVersion,
                Channel = a.Channel,
                Band = a.Band,
                Uptime = a.Uptime
            }).ToList();

            return dtos;
        }

        // GET: api/AccessPoints/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccessPointDto>> GetAccessPoint(int id)
        {
            var accessPoint = await _context.AccessPoints.FindAsync(id);
            if (accessPoint == null)
            {
                return NotFound();
            }

            var dto = new AccessPointDto
            {
                Id = accessPoint.Id,
                Name = accessPoint.Name,
                MAC = accessPoint.MAC,
                IPAddress = accessPoint.IPAddress,
                Description = accessPoint.Description,
                ConnectedDevices = accessPoint.ConnectedDevices,
                Group = accessPoint.Group,
                Status = accessPoint.Status,
                Model = accessPoint.Model,
                SWVersion = accessPoint.SWVersion,
                Channel = accessPoint.Channel,
                Band = accessPoint.Band,
                Uptime = accessPoint.Uptime
            };

            return dto;
        }

        // POST: api/AccessPoints
        [HttpPost]
        public async Task<ActionResult<AccessPointDto>> CreateAccessPoint(AccessPointCreateDTO dto)
        {
            var accessPoint = new AccessPoint
            {
                Name = dto.Name,
                MAC = dto.MAC,
                IPAddress = dto.IPAddress,
                Description = dto.Description,
                ConnectedDevices = dto.ConnectedDevices,
                Group = dto.Group,
                Status = dto.Status,
                Model = dto.Model,
                SWVersion = dto.SWVersion,
                Channel = dto.Channel,
                Band = dto.Band,
                Uptime = dto.Uptime
            };

            _context.AccessPoints.Add(accessPoint);
            await _context.SaveChangesAsync();

            var resultDto = new AccessPointDto
            {
                Id = accessPoint.Id,
                Name = accessPoint.Name,
                MAC = accessPoint.MAC,
                IPAddress = accessPoint.IPAddress,
                Description = accessPoint.Description,
                ConnectedDevices = accessPoint.ConnectedDevices,
                Group = accessPoint.Group,
                Status = accessPoint.Status,
                Model = accessPoint.Model,
                SWVersion = accessPoint.SWVersion,
                Channel = accessPoint.Channel,
                Band = accessPoint.Band,
                Uptime = accessPoint.Uptime
            };

            return CreatedAtAction(nameof(GetAccessPoint), new { id = accessPoint.Id }, resultDto);
        }

        // PUT: api/AccessPoints/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccessPoint(int id, AccessPointUpdateDTO dto)
        {
            var accessPoint = await _context.AccessPoints.FindAsync(id);
            if (accessPoint == null)
            {
                return NotFound();
            }

            // Update properties
            accessPoint.Name = dto.Name;
            accessPoint.MAC = dto.MAC;
            accessPoint.IPAddress = dto.IPAddress;
            accessPoint.Description = dto.Description;
            accessPoint.ConnectedDevices = dto.ConnectedDevices;
            accessPoint.Group = dto.Group;
            accessPoint.Status = dto.Status;
            accessPoint.Model = dto.Model;
            accessPoint.SWVersion = dto.SWVersion;
            accessPoint.Channel = dto.Channel;
            accessPoint.Band = dto.Band;
            accessPoint.Uptime = dto.Uptime;

            _context.Entry(accessPoint).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccessPointExists(id))
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

        // DELETE: api/AccessPoints/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccessPoint(int id)
        {
            var accessPoint = await _context.AccessPoints.FindAsync(id);
            if (accessPoint == null)
            {
                return NotFound();
            }

            _context.AccessPoints.Remove(accessPoint);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AccessPointExists(int id)
        {
            return _context.AccessPoints.Any(e => e.Id == id);
        }
    }
}
