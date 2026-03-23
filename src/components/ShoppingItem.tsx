import type { ShoppingItem as ShoppingItemType } from "../types";
import styles from "./ShoppingItem.module.css";

interface Props {
  item: ShoppingItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ShoppingItem({ item, onToggle, onDelete }: Props) {
  return (
    <li className={styles.item}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
          className={styles.checkbox}
        />
        <span className={item.checked ? styles.checkedName : styles.name}>
          {item.name}
        </span>
      </label>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(item.id)}
        aria-label={`${item.name}を削除`}
      >
        ×
      </button>
    </li>
  );
}
