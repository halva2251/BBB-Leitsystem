using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace leitsystem_api.Models
{
    public class Building
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        // Navigation property: one Building can have many Floors.
        public virtual ICollection<Floor> Floors { get; set; } = new List<Floor>();
    }
}
