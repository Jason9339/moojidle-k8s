import React, { useState, useEffect } from "react";
import "./AnnouncementsTab.css";
import { getAnnouncements } from "@/services/AnnouncementTabApi.js";

function AnnouncementsTab({ courseId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements(courseId);
        setAnnouncements(data);
      } catch (err) {
        setError("Failed to load announcements.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [courseId]);

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.context.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="announcements-tab">
      {/* Filter and search bar */}
      <div className="announcements-header">
        <select className="filter-dropdown">
          <option value="all">All</option>
        </select>
        <input
          type="text"
          className="search-bar"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Announcements list */}
      <div className="announcements-list">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.a_id} className="announcement-item">
            <p className="announcement-content">{announcement.context}</p>
            <p className="announcement-posted">
              Posted on: {new Date(announcement.create_date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementsTab;
