import styles from "./ItemSuggestions.module.css";

interface Props {
  suggestions: string[];
  filter: string;
  onSelect: (name: string) => void;
}

export function ItemSuggestions({ suggestions, filter, onSelect }: Props) {
  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) return null;

  return (
    <ul className={styles.list}>
      {filtered.map((name) => (
        <li key={name} className={styles.item}>
          <button
            className={styles.button}
            onClick={() => onSelect(name)}
            type="button"
          >
            {name}
          </button>
        </li>
      ))}
    </ul>
  );
}
