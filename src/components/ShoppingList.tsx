import { useState } from "react";
import type { ShoppingItem as ShoppingItemType } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ShoppingItem } from "./ShoppingItem";
import { ItemSuggestions } from "./ItemSuggestions";
import styles from "./ShoppingList.module.css";

export function ShoppingList() {
  const [items, setItems] = useLocalStorage<ShoppingItemType[]>("shopping-items", []);
  const [history, setHistory] = useLocalStorage<string[]>("item-history", []);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleSelectSuggestion = (name: string) => {
    addItem(name);
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
              onSelect={handleSelectSuggestion}
            />
          )}
        </div>
        <button type="submit" className={styles.addButton}>
          追加
        </button>
      </form>

      {items.length === 0 ? (
        <p className={styles.empty}>リストは空です</p>
      ) : (
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
      )}
    </div>
  );
}
