import { FormEvent, useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import styles from "./SearchBar.module.css";

const LOCATIONS = [
  "All Locations",
  "Centre Region",
  "Littoral Region",
  "North-West",
  "West Region",
  "South Region",
  "North Region",
];

interface SearchBarProps {
  onSearch?: (query: { schoolName: string; location: string }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [schoolName, setSchoolName] = useState("");
  const [location, setLocation] = useState(LOCATIONS[0]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearch?.({ schoolName, location });
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit} role="search">
      <div className={styles.field}>
        <Search size={18} className={styles.icon} aria-hidden="true" />
        <input
          type="text"
          placeholder="Search by school name..."
          value={schoolName}
          onChange={(event) => setSchoolName(event.target.value)}
          aria-label="Search by school name"
          className={styles.input}
        />
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.field}>
        <MapPin size={18} className={styles.icon} aria-hidden="true" />
        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          aria-label="Filter by location"
          className={styles.select}
        >
          {LOCATIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
      </div>

      <button type="submit" className={styles.submit}>
        <Search size={16} aria-hidden="true" />
        Explore Schools
      </button>
    </form>
  );
}
