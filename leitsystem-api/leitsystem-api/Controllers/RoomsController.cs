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
    public class RoomsController : ControllerBase
    {
        private readonly DataContext _context;

        public RoomsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDTO>>> GetRooms()
        {
            var rooms = await _context.Rooms
                .Include(r => r.Floor)
                .ToListAsync();

            var roomDtos = rooms.Select(r => new RoomDTO
            {
                Id = r.Id,
                Name = r.Name,
                FloorId = r.FloorId,
                FloorName = r.Floor != null ? r.Floor.Name : string.Empty,
                Capacity = r.Capacity,
                Type = r.Type,
                IsActive = r.IsActive
            }).ToList();

            return Ok(roomDtos);
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDTO>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Floor)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound();
            }

            var roomDto = new RoomDTO
            {
                Id = room.Id,
                Name = room.Name,
                FloorId = room.FloorId,
                FloorName = room.Floor != null ? room.Floor.Name : string.Empty,
                Capacity = room.Capacity,
                Type = room.Type,
                IsActive = room.IsActive
            };

            return Ok(roomDto);
        }

        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<RoomDTO>> CreateRoom(RoomCreateDTO dto)
        {
            var room = new Room
            {
                Name = dto.Name,
                FloorId = dto.FloorId,
                Capacity = dto.Capacity,
                Type = dto.Type,
                IsActive = dto.IsActive
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            var floor = await _context.Floors.FindAsync(room.FloorId);
            var roomDto = new RoomDTO
            {
                Id = room.Id,
                Name = room.Name,
                FloorId = room.FloorId,
                FloorName = floor != null ? floor.Name : string.Empty,
                Capacity = room.Capacity,
                Type = room.Type,
                IsActive = room.IsActive
            };

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, roomDto);
        }

        // PUT: api/Rooms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, RoomUpdateDTO dto)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            room.Name = dto.Name;
            room.FloorId = dto.FloorId;
            room.Capacity = dto.Capacity;
            room.Type = dto.Type;
            room.IsActive = dto.IsActive;

            _context.Entry(room).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Rooms.Any(r => r.Id == id))
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

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
