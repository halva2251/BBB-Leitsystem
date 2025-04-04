using leitsystem_api.Data;
using leitsystem_api.Models;
using leitsystem_api.ModelsDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace leitsystem_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomAccessPointsController : ControllerBase
    {
        private readonly DataContext _context;

        public RoomAccessPointsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/RoomAccessPoints
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomAccesspointDTO>>> GetRoomAccessPoints()
        {
            var roomAccessPoints = await _context.RoomAccesspoints.ToListAsync();
            var dtos = roomAccessPoints.Select(ra => new RoomAccesspointDTO
            {   
                RoomId = ra.RoomId,
                AccesspointId = ra.AccesspointId
            }).ToList();

            return Ok(dtos);
        }

        // GET: api/RoomAccessPoints/{roomId}/{accesspointId}
        [HttpGet("{roomId}/{accesspointId}")]
        public async Task<ActionResult<RoomAccesspointDTO>> GetRoomAccessPoint(int roomId, int accesspointId)
        {
            var roomAccessPoint = await _context.RoomAccesspoints
                .FirstOrDefaultAsync(ra => ra.RoomId == roomId && ra.AccesspointId == accesspointId);

            if (roomAccessPoint == null)
            {
                return NotFound();
            }

            var dto = new RoomAccesspointDTO
            {
                RoomId = roomAccessPoint.RoomId,
                AccesspointId = roomAccessPoint.AccesspointId
            };

            return Ok(dto);
        }

        // POST: api/RoomAccessPoints
        [HttpPost]
        public async Task<ActionResult<RoomAccesspointDTO>> CreateRoomAccessPoint(RoomAccesspointCreateDTO dto)
        {
            // In your CreateRoomAccessPoint method:
            var accessPointExists = await _context.AccessPoints.AnyAsync(ap => ap.Id == dto.AccesspointId);
            if (!accessPointExists)
            {
                return BadRequest("The provided AccesspointId does not exist.");
            }

            var roomExists = await _context.Rooms.AnyAsync(r => r.Id == dto.RoomId);
            if (!roomExists)
            {
                return BadRequest("The provided RoomId does not exist.");
            }

            var roomAccessPoint = new RoomAccesspoint
            {
                RoomId = dto.RoomId,
                AccesspointId = dto.AccesspointId
            };

            _context.RoomAccesspoints.Add(roomAccessPoint);
            await _context.SaveChangesAsync();

            var resultDto = new RoomAccesspointDTO
            {
                RoomId = roomAccessPoint.RoomId,
                AccesspointId = roomAccessPoint.AccesspointId
            };

            return CreatedAtAction(nameof(GetRoomAccessPoint), new { roomId = resultDto.RoomId, accesspointId = resultDto.AccesspointId }, resultDto);
        }

        // DELETE: api/RoomAccessPoints/{roomId}/{accesspointId}
        [HttpDelete("{roomId}/{accesspointId}")]
        public async Task<IActionResult> DeleteRoomAccessPoint(int roomId, int accesspointId)
        {
            var roomAccessPoint = await _context.RoomAccesspoints.FindAsync(roomId, accesspointId);
            if (roomAccessPoint == null)
            {
                return NotFound();
            }

            _context.RoomAccesspoints.Remove(roomAccessPoint);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
