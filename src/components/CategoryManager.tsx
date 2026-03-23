import { useState } from "react";
import type { Category } from "../data/categories";
import styles from "./CategoryManager.module.css";

interface Props {
  customCategories: Category[];
  onUpdate: (categories: Category[]) => void;
  onClose: () => void;
}

export function CategoryManager({ customCategories, onUpdate, onClose }: Props) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});

  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (customCategories.some((c) => c.name === name)) return;
    onUpdate([...customCategories, { name, items: [] }]);
    setNewCategoryName("");
  };

  const deleteCategory = (categoryName: string) => {
    onUpdate(customCategories.filter((c) => c.name !== categoryName));
  };

  const addItemToCategory = (categoryName: string) => {
    const itemName = (newItemInputs[categoryName] || "").trim();
    if (!itemName) return;
    onUpdate(
      customCategories.map((c) =>
        c.name === categoryName && !c.items.includes(itemName)
          ? { ...c, items: [...c.items, itemName] }
          : c
      )
    );
    setNewItemInputs((prev) => ({ ...prev, [categoryName]: "" }));
  };

  const deleteItem = (categoryName: string, itemName: string) => {
    onUpdate(
      customCategories.map((c) =>
        c.name === categoryName
          ? { ...c, items: c.items.filter((i) => i !== itemName) }
          : c
      )
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>カテゴリ管理</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className={styles.addCategory}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
            placeholder="新しいカテゴリ名..."
            className={styles.input}
          />
          <button className={styles.addButton} onClick={addCategory} type="button">
            追加
          </button>
        </div>

        <div className={styles.categoryList}>
          {customCategories.map((category) => (
            <div key={category.name} className={styles.category}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{category.name}</span>
                <button
                  className={styles.deleteCategoryButton}
                  onClick={() => deleteCategory(category.name)}
                  type="button"
                >
                  削除
                </button>
              </div>
              <div className={styles.items}>
                {category.items.map((item) => (
                  <span key={item} className={styles.itemTag}>
                    {item}
                    <button
                      className={styles.deleteItemButton}
                      onClick={() => deleteItem(category.name, item)}
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className={styles.addItem}>
                <input
                  type="text"
                  value={newItemInputs[category.name] || ""}
                  onChange={(e) =>
                    setNewItemInputs((prev) => ({ ...prev, [category.name]: e.target.value }))
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addItemToCategory(category.name))
                  }
                  placeholder="アイテムを追加..."
                  className={styles.itemInput}
                />
                <button
                  className={styles.addItemButton}
                  onClick={() => addItemToCategory(category.name)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
