import { useState } from "react";
import type { ShoppingItem as ShoppingItemType } from "../types";
import type { Category } from "../data/categories";
import { categories as defaultCategories } from "../data/categories";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ShoppingItem } from "./ShoppingItem";
import { ItemSuggestions } from "./ItemSuggestions";
import { CategoryPicker } from "./CategoryPicker";
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

  const handleAddItemToCategory = (categoryName: string, itemName: string) => {
    setCustomCategories((prev) => {
      const existing = prev.find((c) => c.name === categoryName);
      if (existing) {
        if (existing.items.includes(itemName)) return prev;
        return prev.map((c) =>
          c.name === categoryName ? { ...c, items: [...c.items, itemName] } : c
        );
      }
      const defaultCat = defaultCategories.find((c) => c.name === categoryName);
      return [...prev, { name: categoryName, icon: defaultCat?.icon ?? "📦", items: [itemName] }];
    });
  };

  const handleDeleteItemFromCategory = (categoryName: string, itemName: string) => {
    const defaultCat = defaultCategories.find((c) => c.name === categoryName);
    const isDefaultItem = defaultCat?.items.includes(itemName);

    if (isDefaultItem) {
      setCustomCategories((prev) => {
        const existing = prev.find((c) => c.name === categoryName);
        if (existing) {
          return prev.map((c) =>
            c.name === categoryName
              ? { ...c, items: c.items.filter((i) => i !== itemName), removedDefaults: [...(c as Category & { removedDefaults?: string[] }).removedDefaults ?? [], itemName] }
              : c
          );
        }
        return [...prev, { name: categoryName, icon: defaultCat?.icon ?? "📦", items: [], removedDefaults: [itemName] }];
      });
    } else {
      setCustomCategories((prev) =>
        prev.map((c) =>
          c.name === categoryName
            ? { ...c, items: c.items.filter((i) => i !== itemName) }
            : c
        )
      );
    }
  };

  const mergedWithRemovals = allCategories.map((cat) => {
    const custom = customCategories.find((c) => c.name === cat.name) as (Category & { removedDefaults?: string[] }) | undefined;
    if (!custom?.removedDefaults?.length) return cat;
    return { ...cat, items: cat.items.filter((i) => !custom.removedDefaults!.includes(i)) };
  });

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

      <span className={styles.pickerTitle}>カテゴリから選択</span>
      <CategoryPicker
        categories={mergedWithRemovals}
        onSelect={addItem}
        onAddItem={handleAddItemToCategory}
        onDeleteItem={handleDeleteItemFromCategory}
      />

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
    </div>
  );
}
