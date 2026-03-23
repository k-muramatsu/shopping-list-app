import { useState } from "react";
import type { Category } from "../data/categories";
import styles from "./CategoryPicker.module.css";

interface Props {
  categories: Category[];
  onSelect: (name: string) => void;
}

export function CategoryPicker({ categories, onSelect }: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleToggle = (categoryName: string) => {
    setOpenCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  return (
    <div className={styles.container}>
      {categories.map((category) => (
        <div key={category.name} className={styles.category}>
          <button
            className={`${styles.categoryHeader} ${openCategory === category.name ? styles.open : ""}`}
            onClick={() => handleToggle(category.name)}
            type="button"
          >
            <span>{category.name}</span>
            <span className={styles.arrow}>
              {openCategory === category.name ? "▲" : "▼"}
            </span>
          </button>
          {openCategory === category.name && (
            <div className={styles.items}>
              {category.items.map((item) => (
                <button
                  key={item}
                  className={styles.itemButton}
                  onClick={() => onSelect(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
