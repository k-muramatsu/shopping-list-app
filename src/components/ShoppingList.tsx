import { useState } from "react";
import type { ShoppingItem as ShoppingItemType } from "../types";
import type { Category } from "../data/categories";
import { categories as defaultCategories } from "../data/categories";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ShoppingItem } from "./ShoppingItem";
import { ItemSuggestions } from "./ItemSuggestions";
import { CategoryPicker } from "./CategoryPicker";
import { CategoryManager } from "./CategoryManager";
import styles from "./ShoppingList.module.css";

function mergeCategories(defaults: Category[], custom: Category[]): Category[] {
  const merged = defaults.map((dc) => {
    const cc = custom.find((c) => c.name === dc.name);
    if (!cc) return dc;
    const extraItems = cc.items.filter((i) => !dc.items.includes(i));
    return { ...dc, items: [...dc.items, ...extraItems] };
  });
  const newCategories = custom.filter((c) => !defaults.some((d) => d.name === c.name));
  return [...merged, ...newCategories];
}

export function ShoppingList() {
  const [items, setItems] = useLocalStorage<ShoppingItemType[]>("shopping-items", []);
  const [history, setHistory] = useLocalStorage<string[]>("item-history", []);
  const [customCategories, setCustomCategories] = useLocalStorage<Category[]>("custom-categories", []);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showManager, setShowManager] = useState(false);

  const allCategories = mergeCategories(defaultCategories, customCategories);

  const addItem = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: trimmed, checked: false },
    ]);

    if (!history.includes(trimmed)) {
      setHistory((prev) => [...prev, trimmed]);
    }

    setInputValue("");
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(inputValue);
  };

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="アイテム名を入力..."
            className={styles.input}
          />
          {showSuggestions && history.length > 0 && (
            <ItemSuggestions
              suggestions={history}
              filter={inputValue}
              onSelect={addItem}
            />
          )}
        </div>
        <button type="submit" className={styles.addButton}>
          追加
        </button>
      </form>

      <div className={styles.pickerHeader}>
        <span className={styles.pickerTitle}>カテゴリから選択</span>
        <button
          className={styles.manageButton}
          onClick={() => setShowManager(true)}
          type="button"
        >
          編集
        </button>
      </div>
      <CategoryPicker categories={allCategories} onSelect={addItem} />

      {items.length === 0 ? (
        <p className={styles.empty}>リストは空です</p>
      ) : (
        <>
          <h2 className={styles.listTitle}>買い物リスト</h2>
          <ul className={styles.list}>
            {items.map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </>
      )}

      {showManager && (
        <CategoryManager
          customCategories={customCategories}
          onUpdate={setCustomCategories}
          onClose={() => setShowManager(false)}
        />
      )}
    </div>
  );
}
