using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace leitsystem_api.Models
{
    public class AccessPoint
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string MAC { get; set; }

        public string IPAddress { get; set; }

        public string Description { get; set; }

        public int ConnectedDevices { get; set; }

        // Many-to-many relationship: an AccessPoint can be linked to multiple Rooms.
        public virtual ICollection<RoomAccesspoint> RoomAccesspoints { get; set; } = new List<RoomAccesspoint>();
    }
}
