import { useState } from "react";
import type { Category } from "../data/categories";
import styles from "./CategoryPicker.module.css";

interface Props {
  categories: Category[];
  onSelect: (name: string) => void;
  onAddItem: (categoryName: string, itemName: string) => void;
  onDeleteItem: (categoryName: string, itemName: string) => void;
}

export function CategoryPicker({ categories, onSelect, onAddItem, onDeleteItem }: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [newItemInput, setNewItemInput] = useState("");

  const handleToggle = (categoryName: string) => {
    setOpenCategory((prev) => (prev === categoryName ? null : categoryName));
    setNewItemInput("");
  };

  const handleAddItem = (categoryName: string) => {
    const trimmed = newItemInput.trim();
    if (!trimmed) return;
    onAddItem(categoryName, trimmed);
    setNewItemInput("");
  };

  return (
    <div className={styles.container}>
      {categories.map((category) => {
        const isOpen = openCategory === category.name;
        return (
          <div key={category.name} className={styles.category}>
            <button
              className={`${styles.categoryHeader} ${isOpen ? styles.open : ""}`}
              onClick={() => handleToggle(category.name)}
              type="button"
            >
              <span className={styles.headerLeft}>
                <span className={styles.icon}>{category.icon}</span>
                <span>{category.name}</span>
              </span>
              <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div className={styles.panel}>
                <div className={styles.items}>
                  {category.items.map((item) => (
                    <div key={item} className={styles.itemTag}>
                      <button
                        className={styles.itemName}
                        onClick={() => onSelect(item)}
                        type="button"
                      >
                        {item}
                      </button>
                      <button
                        className={styles.removeButton}
                        onClick={() => onDeleteItem(category.name, item)}
                        type="button"
                        aria-label={`${item}を削除`}
                      >
                        −
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.addRow}>
                  <input
                    type="text"
                    value={newItemInput}
                    onChange={(e) => setNewItemInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddItem(category.name))
                    }
                    placeholder="アイテムを追加..."
                    className={styles.addInput}
                  />
                  <button
                    className={styles.addButton}
                    onClick={() => handleAddItem(category.name)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
