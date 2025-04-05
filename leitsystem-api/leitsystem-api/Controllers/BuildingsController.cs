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
    public class BuildingsController : ControllerBase
    {
        private readonly DataContext _context;

        public BuildingsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Buildings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BuildingDTO>>> GetBuildings()
        {
            var buildings = await _context.Buildings.ToListAsync();
            var buildingDtos = buildings.Select(b => new BuildingDTO
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description
            }).ToList();

            return Ok(buildingDtos);
        }

        // GET: api/Buildings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BuildingDTO>> GetBuilding(int id)
        {
            var building = await _context.Buildings.FindAsync(id);
            if (building == null)
            {
                return NotFound();
            }

            var buildingDto = new BuildingDTO
            {
                Id = building.Id,
                Name = building.Name,
                Description = building.Description
            };

            return Ok(buildingDto);
        }

        // GET: api/Buildings/5/floors
        [HttpGet("{id}/floors")]
        public async Task<ActionResult<IEnumerable<FloorDTO>>> GetFloorsForBuilding(int id)
        {
            // Verify the building exists.
            var building = await _context.Buildings.FindAsync(id);
            if (building == null)
            {
                return NotFound();
            }

            var floors = await _context.Floors
                .Where(f => f.BuildingId == id)
                .ToListAsync();

            var floorDTOs = floors.Select(f => new FloorDTO
            {
                Id = f.Id,
                BuildingId = f.BuildingId,
                Name = f.Name,
                Description = f.Description
            }).ToList();

            return Ok(floorDTOs);
        }

        // POST: api/Buildings
        [HttpPost]
        public async Task<ActionResult<BuildingDTO>> CreateBuilding(BuildingCreateDTO dto)
        {
            var building = new Building
            {
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Buildings.Add(building);
            await _context.SaveChangesAsync();

            var buildingDto = new BuildingDTO
            {
                Id = building.Id,
                Name = building.Name,
                Description = building.Description
            };

            return CreatedAtAction(nameof(GetBuilding), new { id = building.Id }, buildingDto);
        }

        // PUT: api/Buildings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBuilding(int id, BuildingUpdateDTO dto)
        {
            var building = await _context.Buildings.FindAsync(id);
            if (building == null)
            {
                return NotFound();
            }

            building.Name = dto.Name;
            building.Description = dto.Description;

            _context.Entry(building).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BuildingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(building);
        }

        // DELETE: api/Buildings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuilding(int id)
        {
            var building = await _context.Buildings.FindAsync(id);
            if (building == null)
            {
                return NotFound();
            }

            _context.Buildings.Remove(building);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BuildingExists(int id)
        {
            return _context.Buildings.Any(b => b.Id == id);
        }
    }
}
