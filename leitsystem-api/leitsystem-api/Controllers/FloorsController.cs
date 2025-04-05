using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using leitsystem_api.Data;
using leitsystem_api.Models;
using leitsystem_api.ModelsDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace leitsystem_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FloorsController : ControllerBase
    {
        private readonly DataContext _context;

        public FloorsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Floors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FloorDTO>>> GetFloors()
        {
            var floors = await _context.Floors.ToListAsync();
            var floorDTOs = floors.Select(f => new FloorDTO
            {
                Id = f.Id,
                BuildingId = f.BuildingId,
                Name = f.Name,
                Description = f.Description
            }).ToList();

            return floorDTOs;
        }

        // GET: api/Floors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FloorDTO>> GetFloor(int id)
        {
            var floor = await _context.Floors.FindAsync(id);
            if (floor == null)
            {
                return NotFound();
            }

            var floorDTO = new FloorDTO
            {
                Id = floor.Id,
                BuildingId = floor.BuildingId,
                Name = floor.Name,
                Description = floor.Description
            };

            return floorDTO;
        }

        // POST: api/Floors
        [HttpPost]
        public async Task<ActionResult<FloorDTO>> CreateFloor(FloorCreateDTO dto)
        {
            var floor = new Floor
            {
                BuildingId = dto.BuildingId,
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Floors.Add(floor);
            await _context.SaveChangesAsync();

            var floorDTO = new FloorDTO
            {
                Id = floor.Id,
                BuildingId = floor.BuildingId,
                Name = floor.Name,
                Description = floor.Description
            };

            return CreatedAtAction(nameof(GetFloor), new { id = floor.Id }, floorDTO);
        }

        // PUT: api/Floors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFloor(int id, FloorUpdateDTO dto)
        {
            var floor = await _context.Floors.FindAsync(id);
            if (floor == null)
            {
                return NotFound();
            }

            floor.BuildingId = dto.BuildingId;
            floor.Name = dto.Name;
            floor.Description = dto.Description;

            _context.Entry(floor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FloorExists(id))
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

        // DELETE: api/Floors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFloor(int id)
        {
            var floor = await _context.Floors.FindAsync(id);
            if (floor == null)
            {
                return NotFound();
            }

            _context.Floors.Remove(floor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FloorExists(int id)
        {
            return _context.Floors.Any(f => f.Id == id);
        }
    }
}
